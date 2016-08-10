/**
*
*   FILTER.js Generic Filters
*   @version: 0.9.5
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Generic Filters)
*   https://github.com/foo123/FILTER.js
*
**/!function( root, factory ){
"use strict";
if ( ('object'===typeof module) && module.exports ) /* CommonJS */
    module.exports = factory.call(root,(module.$deps && module.$deps["FILTER"]) || require("./FILTER".toLowerCase()));
else if ( ("function"===typeof define) && define.amd && ("function"===typeof require) && ("function"===typeof require.specified) && require.specified("FILTER_FILTERS") /*&& !require.defined("FILTER_FILTERS")*/ ) 
    define("FILTER_FILTERS",['module',"FILTER"],function(mod,module){factory.moduleUri = mod.uri; factory.call(root,module); return module;});
else /* Browser/WebWorker/.. */
    (factory.call(root,root["FILTER"])||1)&&('function'===typeof define)&&define.amd&&define(function(){return root["FILTER"];} );
}(  /* current root */          this, 
    /* module factory */        function ModuleFactory__FILTER_FILTERS( FILTER ){
/* main code starts here */

/**
*
*   FILTER.js Generic Filters
*   @version: 0.9.5
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Generic Filters)
*   https://github.com/foo123/FILTER.js
*
**/
"use strict";
var FILTER_FILTERS_PATH = FILTER.getPath( ModuleFactory__FILTER_FILTERS.moduleUri );
/**
*
* CompositeFilter Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var OP = Object.prototype, FP = Function.prototype, AP = Array.prototype
    ,slice = AP.slice, splice = AP.splice, concat = AP.push, getFilter = FILTER.Filter.get
;

//
// Composite Filter Stack  (a variation of Composite Design Pattern)
var CompositeFilter = FILTER.CompositeFilter = FILTER.Class( FILTER.Filter, {
    name: "CompositeFilter"
    
    ,constructor: function CompositeFilter( filters ) { 
        var self = this;
        if ( !(self instanceof CompositeFilter) ) return new CompositeFilter(filters);
        self.$super('constructor');
        self._stack = filters && filters.length ? filters.slice( ) : [ ];
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_stack: null
    ,_meta: null
    ,_stable: true
    
    ,dispose: function( withFilters ) {
        var self = this, i, stack = self._stack;
        
        if ( true === withFilters )
        {
            for (i=0; i<stack.length; i++)
            {
                stack[ i ] && stack[ i ].dispose( withFilters );
                stack[ i ] = null;
            }
        }
        self._stack = null;
        self._meta = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, i, stack = self._stack,
            json = { filter: self.name, _isOn: !!self._isOn, _stable: !!self._stable, _update: self._update, filters: [ ] };
        for (i=0; i<stack.length; i++) json.filters.push( stack[ i ].serialize( ) );
        return json;
    }
    
    ,unserialize: function( json ) {
        var self = this, i, l, ls, filters, filter, stack = self._stack;
        if ( json && self.name === json.filter )
        {
            self._isOn = json._isOn;
            self._update = json._update;
            self._stable = json._stable;
            
            filters = json.filters || [ ];
            l = filters.length; ls = stack.length;
            if ( (l !== ls) || (!self._stable) )
            {
                // dispose any prev filters
                for (i=0; i<ls; i++)
                {
                    stack[ i ] && stack[ i ].dispose( true );
                    stack[ i ] = null;
                }
                stack = [ ];
                
                for (i=0; i<l; i++)
                {
                    filter = filters[ i ] && filters[ i ].filter ? getFilter( filters[ i ].filter ) : null;
                    if ( filter )
                    {
                        stack.push( new filter( ).unserialize( filters[ i ] ) );
                    }
                    else
                    {
                        throw new Error('Filter "' + filters[ i ].filter + '" could not be created');
                        return;
                    }
                }
                self._stack = stack;
            }
            else
            {
                for (i=0; i<l; i++) stack[ i ].unserialize( filters[ i ] );
            }
        }
        return self;
    }
    
    ,getMeta: function( ) {
        return this._meta;
    }
    
    ,setMeta: function( meta ) {
        var self = this, stack = self._stack, i, l;
        if ( meta && (l=meta.length) && stack.length )
            for (i=0; i<l; i++) stack[ meta[i][0] ].setMeta( meta[i][1] );
        return self;
    }
    
    ,stable: function( bool ) {
        if ( !arguments.length ) bool = true;
        this._stable = !!bool;
        return this;
    }
    
    // manipulate the filter chain, methods
    ,filters: function( f ) {
        if ( arguments.length )
        {
            this._stack = f.slice( );
            return this;
        }
        return this._stack.slice( );
    }
    
    ,push: function(/* variable args here.. */) {
        if ( arguments.length ) concat.apply(this._stack, arguments);
        return this;
    }
    
    ,pop: function( ) {
        return this._stack.pop( );
    }
    
    ,shift: function( ) {
        return this._stack.shift( );
    }
    
    ,unshift: function(/* variable args here.. */) {
        if ( arguments.length ) splice.apply(this._stack, concat.apply([0, 0], arguments));
        return this;
    }
    
    ,getAt: function( i ) {
        return this._stack.length > i ? this._stack[ i ] : null;
    }
    
    ,setAt: function( i, filter ) {
        if ( this._stack.length > i ) this._stack[ i ] = filter;
        else this._stack.push( filter );
        return this;
    }
    
    ,insertAt: function( i /*, filter1, filter2, filter3..*/) {
        var args = slice.call(arguments), arglen = args.length;
        if ( argslen > 1 )
        {
            args.shift( );
            splice.apply( this._stack, [i, 0].concat( args ) );
        }
        return this;
    }
    
    ,removeAt: function( i ) {
        return this._stack.splice( i, 1 );
    }
    
    ,remove: function( filter ) {
        var i = this._stack.length;
        while ( --i >= 0 ) 
        { 
            if ( filter === this._stack[i] ) 
                this._stack.splice( i, 1 ); 
        }
        return this;
    }
    
    ,reset: function( ) {
        this._stack.length = 0;  
        return this;
    }
    
    // used for internal purposes
    ,_apply: function( im, w, h, image ) {
        var self = this, scratchpad = {}/*, update = false*/;
        self._meta = [];
        if ( self._isOn && self._stack.length )
        {
            var filterstack = self._stack, stacklength = filterstack.length, fi, filter;
            for (fi=0; fi<stacklength; fi++)
            {
                filter = filterstack[fi]; 
                if ( filter && filter._isOn ) 
                {
                    im = filter._apply(im, w, h, image, scratchpad);
                    if ( filter.hasMeta ) self._meta.push([fi, filter.getMeta()]);
                    //update = update || filter._update;
                }
            }
        }
        //self._update = update;
        self.hasMeta = self._meta.length > 0;
        return im;
    }
        
    ,canRun: function( ) {
        return this._isOn && this._stack.length;
    }
    
    ,toString: function( ) {
        var tab = "  ", s = this._stack, out = [], i, l = s.length;
        for (i=0; i<l; i++) out.push( tab + s[i].toString( ).split("\n").join("\n"+tab) );
        return [
             "[FILTER: " + this.name + "]"
             ,"[",out.join( "\n" ),"]",""
         ].join("\n");
    }
});
// aliases
CompositeFilter.prototype.get = CompositeFilter.prototype.getAt;
CompositeFilter.prototype.set = CompositeFilter.prototype.setAt;
CompositeFilter.prototype.empty = CompositeFilter.prototype.reset;
CompositeFilter.prototype.concat = CompositeFilter.prototype.push;

}(FILTER);/**
*
* Table Lookup Filter
*
* Changes target image colors according to color lookup tables for each channel
*
* @param tableR Optional (a lookup table of 256 color values for red channel)
* @param tableG Optional (a lookup table of 256 color values for green channel)
* @param tableB Optional (a lookup table of 256 color values for blue channel)
* @param tableA Optional (a lookup table of 256 color values for alpha channel, NOT USED YET)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// color table
var CHANNEL = FILTER.CHANNEL, CT = FILTER.ColorTable, clamp = FILTER.Color.clampPixel,
    FilterUtil = FILTER.Util.Filter, eye = FilterUtil.ct_eye, ct_mult = FilterUtil.ct_multiply,
    Power = Math.pow, Exponential = Math.exp, nF = 1.0/255,
    TypedArray = FILTER.Util.Array.typed
;

//
//
// ColorTableFilter
var ColorTableFilter = FILTER.ColorTableFilter = FILTER.Class( FILTER.Filter, {
    name: "ColorTableFilter"
    
    ,constructor: function ColorTableFilter( tR, tG, tB, tA ) {
        var self = this;
        if ( !(self instanceof ColorTableFilter) ) return new ColorTableFilter(tR, tG, tB, tA);
        self.$super('constructor');
        self._table = [null, null, null, null];
        tR = tR || null;
        tG = tG || tR;
        tB = tB || tG;
        tA = tA || null;
        self._table[CHANNEL.R] = tR;
        self._table[CHANNEL.G] = tG;
        self._table[CHANNEL.B] = tB;
        self._table[CHANNEL.A] = tA;
    }
    
    ,path: FILTER_FILTERS_PATH
    // parameters
    ,_table: null
    
    ,dispose: function( ) {
        var self = this;
        self._table = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 _tableR: self._table[CHANNEL.R]
                ,_tableG: self._table[CHANNEL.G]
                ,_tableB: self._table[CHANNEL.B]
                ,_tableA: self._table[CHANNEL.A]
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._table[CHANNEL.R] = TypedArray(params._tableR, CT);
            self._table[CHANNEL.G] = TypedArray(params._tableG, CT);
            self._table[CHANNEL.B] = TypedArray(params._tableB, CT);
            self._table[CHANNEL.A] = TypedArray(params._tableA, CT);
        }
        return self;
    }
    
    ,channel: function( channel ) {
        if ( null == channel ) return this;
        var tR, tG, tB;
        switch(channel || CHANNEL.R)
        {
            case CHANNEL.B: 
                tR = eye(0,0); tG = eye(0,0); tB = eye(); 
                break;
            
            case CHANNEL.G: 
                tR = eye(0,0); tG = eye(); tB = eye(0,0); 
                break;
            
            case CHANNEL.R: 
            default:
                tR = eye(); tG = eye(0,0); tB = eye(0,0); 
                break;
            
        }
        return this.set(tR, tG, tB);
    }
    
    ,redChannel: function( ) {
        return this.channel( CHANNEL.R );
    }
    
    ,greenChannel: function( ) {
        return this.channel( CHANNEL.G );
    }
    
    ,blueChannel: function( ) {
        return this.channel( CHANNEL.B );
    }
    
    ,channelInvert: function( channel ) {
        if ( null == channel ) return this;
        var tR, tG, tB;
        switch(channel || CHANNEL.R)
        {
            case CHANNEL.B: 
                tR = eye(); tG = eye(); tB = eye(-1,255); 
                break;
            
            case CHANNEL.G: 
                tR = eye(); tG = eye(-1,255); tB = eye(); 
                break;
            
            case CHANNEL.R: 
            default:
                tR = eye(-1,255); tG = eye(); tB = eye(); 
                break;
            
        }
        return this.set(tR, tG, tB);
    }
    
    ,redInvert: function( ) {
        return this.channelInvert( CHANNEL.R );
    }
    
    ,greenInvert: function( ) {
        return this.channelInvert( CHANNEL.G );
    }
    
    ,blueInvert: function( ) {
        return this.channelInvert( CHANNEL.B );
    }
    
    /*,alphaInvert: function( ) {
        return this.channelInvert( CHANNEL.A );
    }*/
    
    ,invert: function( ) {
        return this.set(eye(-1,255));
    }
    
    ,thresholds: function( thresholdsR, thresholdsG, thresholdsB ) {
        // assume thresholds are given in pointwise scheme as pointcuts
        // not in cumulative scheme
        // [ 0.5 ] => [0, 1]
        // [ 0.3, 0.3, 0.3 ] => [0, 0.3, 0.6, 1]
        if (!thresholdsR.length) thresholdsR=[thresholdsR];
        if (!thresholdsG) thresholdsG=thresholdsR;
        if (!thresholdsB) thresholdsB=thresholdsG;

        var tLR=thresholdsR.length, numLevelsR=tLR+1, 
            tLG=thresholdsG.length, numLevelsG=tLG+1, 
            tLB=thresholdsB.length, numLevelsB=tLB+1, 
            tR=new CT(256), qR=new CT(numLevelsR), 
            tG=new CT(256), qG=new CT(numLevelsG), 
            tB=new CT(256), qB=new CT(numLevelsB), 
            i, j, nLR=255/(numLevelsR-1), nLG=255/(numLevelsG-1), nLB=255/(numLevelsB-1)
        ;
        i=0; while (i<numLevelsR) { qR[i] = ~~(nLR * i); i++; }
        thresholdsR[0]=~~(255*thresholdsR[0]);
        i=1; while (i<tLR) { thresholdsR[i]=thresholdsR[i-1] + ~~(255*thresholdsR[i]); i++; }
        i=0; while (i<numLevelsG) { qG[i] = ~~(nLG * i); i++; }
        thresholdsG[0]=~~(255*thresholdsG[0]);
        i=1; while (i<tLG) { thresholdsG[i]=thresholdsG[i-1] + ~~(255*thresholdsG[i]); i++; }
        i=0; while (i<numLevelsB) { qB[i] = ~~(nLB * i); i++; }
        thresholdsB[0]=~~(255*thresholdsB[0]);
        i=1; while (i<tLB) { thresholdsB[i]=thresholdsB[i-1] + ~~(255*thresholdsB[i]); i++; }

        for(i=0; i<256; i++)
        { 
            // the non-linear mapping is here
            j=0; while (j<tLR && i>thresholdsR[j]) j++;
            tR[ i ] = clamp(qR[ j ]); 
            j=0; while (j<tLG && i>thresholdsG[j]) j++;
            tG[ i ] = clamp(qG[ j ]); 
            j=0; while (j<tLB && i>thresholdsB[j]) j++;
            tB[ i ] = clamp(qB[ j ]); 
        }
        return this.set(tR, tG, tB);
    }
    
    ,threshold: function( thresholdR, thresholdG, thresholdB ) {
        thresholdR = null == thresholdR ? 0.5 : thresholdR;
        thresholdG = null == thresholdG ? thresholdR : thresholdG;
        thresholdB = null == thresholdB ? thresholdG : thresholdB;
        return this.thresholds([thresholdR], [thresholdG], [thresholdB]);
    }
    
    ,quantize: function( numLevels ) {
        if ( null == numLevels ) numLevels = 64;
        if ( numLevels < 2 ) numLevels = 2;

        var t=new CT(256), q=new CT(numLevels), i, nL=255/(numLevels-1), nR=numLevels/256;
        i=0; while (i<numLevels) { q[i] = ~~(nL * i); i++; }
        for(i=0; i<256; i++) { t[i] = clamp(q[ ~~(nR * i) ]); }
        return this.set(t);
    }
    
    ,binarize: function( ) {
        return this.quantize(2);
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,solarize: function( threshold, type ) {
        if ( null == type ) type = 1;
        if ( null == threshold ) threshold=0.5;
        
        var i, t=new CT(256), q, c, n=2/255;
        if ( -1 === type ) // inverse
        {
            threshold *= 256; 
            for(i=0; i<256; i++)
            { 
                t[i] = i>threshold ? 255-i : i; 
            }
        }
        else if ( 2 === type ) // variation
        {
            threshold = 1-threshold;
            for(i=0; i<256; i++)
            { 
                q = n*i; 
                c = q<threshold ? (255-255*q) : (255*q-255); 
                t[i] = ~~(clamp( c ));
            }
        }
        else
        {
            for(i=0; i<256; i++)
            { 
                q = n*i; 
                c = q>threshold ? (255-255*q) : (255*q-255); 
                t[i] = ~~(clamp( c ));
            }
        }
        return this.set(t);
    }
    
    ,solarize2: function( threshold ) {
        return this.solarize( threshold, 2 );
    }
    
    ,solarizeInverse: function( threshold ) {
        return this.solarize( threshold, -1 );
    }
    
    // apply a binary mask to the image color channels
    ,mask: function( mask ) {
        var i=0, tR=new CT(256), tG=new CT(256), tB=new CT(256),
            maskR=(mask>>>16)&255, maskG=(mask>>>8)&255, maskB=mask&255
        ;
        for(i=0; i<256; i++)
        { 
            tR[i] = clamp(i & maskR); 
            tG[i] = clamp(i & maskG); 
            tB[i] = clamp(i & maskB); 
        }
        return this.set(tR, tG, tB);
    }
    
    // replace a color with another
    ,replace: function( color, replacecolor ) {
        if (color==replacecolor) return this;
        var c1R=(color>>>16)&255, c1G=(color>>>8)&255, c1B=(color)&255, 
            c2R=(replacecolor>>>16)&255, c2G=(replacecolor>>>8)&255, c2B=(replacecolor)&255, 
            tR=eye(), tG=eye(), tB=eye();
            tR[c1R]=c2R; tG[c1G]=c2G; tB[c1B]=c2B;
        return this.set(tR, tG, tB);
    }
    
    // extract a range of color values from a specific color channel and set the rest to background color
    ,extract: function( channel, range, background ) {
        if (!range || !range.length) return this;
        background=background||0;
        var bR = (background>>>16)&255, bG = (background>>>8)&255, bB = background&255, 
            tR=eye(0,bR), tG=eye(0,bG), tB=eye(0,bB), s, f;
        switch(channel || CHANNEL.R)
        {
            case CHANNEL.B:
                s=range[0]; f=range[1];
                while (s<=f) { tB[s]=clamp(s); s++; }
                break;
            
            case CHANNEL.G:
                s=range[0]; f=range[1];
                while (s<=f) { tG[s]=clamp(s); s++; }
                break;
            
            case CHANNEL.R:
            default:
                s=range[0]; f=range[1];
                while (s<=f) { tR[s]=clamp(s); s++; }
                break;
            
        }
        return this.set(tR, tG, tB);
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,gammaCorrection: function( gammaR, gammaG, gammaB ) {
        gammaR = gammaR || 1;
        gammaG = gammaG || gammaR;
        gammaB = gammaB || gammaG;
        
        // gamma correction uses inverse gamma
        gammaR = 1.0/gammaR; gammaG = 1.0/gammaG; gammaB = 1.0/gammaB;
        
        var tR=new CT(256), tG=new CT(256), tB=new CT(256), i=0;
        for(i=0; i<256; i++)
        { 
            tR[i] = clamp(~~(255*Power(nF*i, gammaR))); 
            tG[i] = clamp(~~(255*Power(nF*i, gammaG))); 
            tB[i] = clamp(~~(255*Power(nF*i, gammaB)));  
        }
        return this.set(tR, tG, tB);
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,exposure: function( exposure ) {
        if ( null == exposure ) exposure = 1;
        var i=0, t=new CT(256);
        for(i=0; i<256; i++)
        { 
            t[i]=clamp(~~(255 * (1 - Exponential(-exposure * i *nF)))); 
        }
        return this.set(t);
    }
    
    ,set: function( tR, tG, tB, tA ) {
        if ( !tR ) return this;
        
        var i, T = this._table, R = T[CHANNEL.R] || eye( ), G, B, A;
        
        if ( tG || tB )
        {
            tG = tG || tR; tB = tB || tG;
            G = T[CHANNEL.G] || R; B = T[CHANNEL.B] || G;
            T[CHANNEL.R] = ct_mult( tR, R );
            T[CHANNEL.G] = ct_mult( tG, G );
            T[CHANNEL.B] = ct_mult( tB, B );
        }
        else
        {
            T[CHANNEL.R] = ct_mult( tR, R );
            T[CHANNEL.G] = T[CHANNEL.R];
            T[CHANNEL.B] = T[CHANNEL.R];
        }
        return this;
    }
    
    ,reset: function( ) {
        this._table = [null, null, null, null]; 
        return this;
    }
    
    ,combineWith: function( filt ) {
        return this.set(filt.getTable(CHANNEL.R), filt.getTable(CHANNEL.G), filt.getTable(CHANNEL.B));
    }
    
    ,getTable: function ( channel ) {
        return this._table[channel || CHANNEL.R] || null;
    }
    
    ,setTable: function ( table, channel ) {
        this._table[channel || CHANNEL.R] = table || null;
        return this;
    }
    
    // used for internal purposes
    ,_apply: function(im, w, h/*, image*/) {
        var self = this, T = self._table;
        if ( !self._isOn || !T || !T[CHANNEL.R] ) return im;
        
        var i, l=im.length, l2=l>>>2, rem=(l2&15)<<2, R = T[0], G = T[1], B = T[2], A = T[3];
        
        // apply filter (algorithm implemented directly based on filter definition)
        if ( A )
        {
            // array linearization
            // partial loop unrolling (4 iterations)
            for (i=0; i<l; i+=64)
            {
                im[i   ] = R[im[i   ]]; im[i+1 ] = G[im[i+1 ]]; im[i+2 ] = B[im[i+2 ]]; im[i+3 ] = A[im[i+3 ]];
                im[i+4 ] = R[im[i+4 ]]; im[i+5 ] = G[im[i+5 ]]; im[i+6 ] = B[im[i+6 ]]; im[i+7 ] = A[im[i+7 ]];
                im[i+8 ] = R[im[i+8 ]]; im[i+9 ] = G[im[i+9 ]]; im[i+10] = B[im[i+10]]; im[i+11] = A[im[i+11]];
                im[i+12] = R[im[i+12]]; im[i+13] = G[im[i+13]]; im[i+14] = B[im[i+14]]; im[i+15] = A[im[i+15]];
                im[i+16] = R[im[i+16]]; im[i+17] = G[im[i+17]]; im[i+18] = B[im[i+18]]; im[i+19] = A[im[i+19]];
                im[i+20] = R[im[i+20]]; im[i+21] = G[im[i+21]]; im[i+22] = B[im[i+22]]; im[i+23] = A[im[i+23]];
                im[i+24] = R[im[i+24]]; im[i+25] = G[im[i+25]]; im[i+26] = B[im[i+26]]; im[i+27] = A[im[i+27]];
                im[i+28] = R[im[i+28]]; im[i+29] = G[im[i+29]]; im[i+30] = B[im[i+30]]; im[i+31] = A[im[i+31]];
                im[i+32] = R[im[i+32]]; im[i+33] = G[im[i+33]]; im[i+34] = B[im[i+34]]; im[i+35] = A[im[i+35]];
                im[i+36] = R[im[i+36]]; im[i+37] = G[im[i+37]]; im[i+38] = B[im[i+38]]; im[i+39] = A[im[i+39]];
                im[i+40] = R[im[i+40]]; im[i+41] = G[im[i+41]]; im[i+42] = B[im[i+42]]; im[i+43] = A[im[i+43]];
                im[i+44] = R[im[i+44]]; im[i+45] = G[im[i+45]]; im[i+46] = B[im[i+46]]; im[i+47] = A[im[i+47]];
                im[i+48] = R[im[i+48]]; im[i+49] = G[im[i+49]]; im[i+50] = B[im[i+50]]; im[i+51] = A[im[i+51]];
                im[i+52] = R[im[i+52]]; im[i+53] = G[im[i+53]]; im[i+54] = B[im[i+54]]; im[i+55] = A[im[i+55]];
                im[i+56] = R[im[i+56]]; im[i+57] = G[im[i+57]]; im[i+58] = B[im[i+58]]; im[i+59] = A[im[i+59]];
                im[i+60] = R[im[i+60]]; im[i+61] = G[im[i+61]]; im[i+62] = B[im[i+62]]; im[i+63] = A[im[i+63]];
            }
            // loop unrolling remainder
            if ( rem )
            {
                for (i=l-rem; i<l; i+=4)
                    im[i   ] = R[im[i   ]]; im[i+1 ] = G[im[i+1 ]]; im[i+2 ] = B[im[i+2 ]]; im[i+3 ] = A[im[i+3 ]];
            }
        }
        else
        {
            // array linearization
            // partial loop unrolling (4 iterations)
            for (i=0; i<l; i+=64)
            {
                im[i   ] = R[im[i   ]]; im[i+1 ] = G[im[i+1 ]]; im[i+2 ] = B[im[i+2 ]];
                im[i+4 ] = R[im[i+4 ]]; im[i+5 ] = G[im[i+5 ]]; im[i+6 ] = B[im[i+6 ]];
                im[i+8 ] = R[im[i+8 ]]; im[i+9 ] = G[im[i+9 ]]; im[i+10] = B[im[i+10]];
                im[i+12] = R[im[i+12]]; im[i+13] = G[im[i+13]]; im[i+14] = B[im[i+14]];
                im[i+16] = R[im[i+16]]; im[i+17] = G[im[i+17]]; im[i+18] = B[im[i+18]];
                im[i+20] = R[im[i+20]]; im[i+21] = G[im[i+21]]; im[i+22] = B[im[i+22]];
                im[i+24] = R[im[i+24]]; im[i+25] = G[im[i+25]]; im[i+26] = B[im[i+26]];
                im[i+28] = R[im[i+28]]; im[i+29] = G[im[i+29]]; im[i+30] = B[im[i+30]];
                im[i+32] = R[im[i+32]]; im[i+33] = G[im[i+33]]; im[i+34] = B[im[i+34]];
                im[i+36] = R[im[i+36]]; im[i+37] = G[im[i+37]]; im[i+38] = B[im[i+38]];
                im[i+40] = R[im[i+40]]; im[i+41] = G[im[i+41]]; im[i+42] = B[im[i+42]];
                im[i+44] = R[im[i+44]]; im[i+45] = G[im[i+45]]; im[i+46] = B[im[i+46]];
                im[i+48] = R[im[i+48]]; im[i+49] = G[im[i+49]]; im[i+50] = B[im[i+50]];
                im[i+52] = R[im[i+52]]; im[i+53] = G[im[i+53]]; im[i+54] = B[im[i+54]];
                im[i+56] = R[im[i+56]]; im[i+57] = G[im[i+57]]; im[i+58] = B[im[i+58]];
                im[i+60] = R[im[i+60]]; im[i+61] = G[im[i+61]]; im[i+62] = B[im[i+62]];
            }
            // loop unrolling remainder
            if ( rem )
            {
                for (i=l-rem; i<l; i+=4)
                    im[i   ] = R[im[i   ]]; im[i+1 ] = G[im[i+1 ]]; im[i+2 ] = B[im[i+2 ]];
            }
        }
        return im;
    }
        
    ,canRun: function( ) {
        return this._isOn && this._table && this._table[CHANNEL.R];
    }
});
// aliases
ColorTableFilter.prototype.posterize = ColorTableFilter.prototype.levels = ColorTableFilter.prototype.quantize;
FILTER.TableLookupFilter = FILTER.ColorTableFilter;

}(FILTER);/**
*
* Color Matrix Filter(s)
*
* Changes target coloring combining current pixel color values according to Matrix
*
* (matrix is 4x5 array of values which are (eg for row 1: Red value): 
* New red Value=Multiplier for red value, multiplier for Green value, multiplier for Blue Value, Multiplier for Alpha Value,constant  bias term
* other rows are similar but for new Green, Blue and Alpha values respectively) 
*
* @param colorMatrix Optional (a color matrix as an array of values)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var CHANNEL = FILTER.CHANNEL, CM = FILTER.ColorMatrix, A8U = FILTER.Array8U, FUtil = FILTER.Util.Filter,
    eye = FUtil.cm_eye, mult = FUtil.cm_multiply, rechannel = FUtil.cm_rechannel,
    Sin = Math.sin, Cos = Math.cos, toRad = FILTER.CONST.toRad, toDeg = FILTER.CONST.toDeg,
    TypedArray = FILTER.Util.Array.typed, notSupportClamp = FILTER._notSupportClamp
;

//
//
// ColorMatrixFilter
var ColorMatrixFilter = FILTER.ColorMatrixFilter = FILTER.Class( FILTER.Filter, {
    name: "ColorMatrixFilter"
    
    ,constructor: function ColorMatrixFilter( matrix ) {
        var self = this;
        if ( !(self instanceof ColorMatrixFilter) ) return new ColorMatrixFilter(matrix);
        self.$super('constructor');
        self.matrix = matrix && matrix.length ? new CM(matrix) : null;
    }
    
    ,path: FILTER_FILTERS_PATH
    ,matrix: null
    
    ,dispose: function( ) {
        var self = this;
        self.matrix = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                matrix: self.matrix
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.matrix = TypedArray( params.matrix, CM );
        }
        return self;
    }
    
    // get the image color channel as a new image
    ,channel: function( channel, grayscale ) {
        channel = channel || 0;
        var m = [
            0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 
            0, 0, 0, 0, 255
        ], f = (CHANNEL.A === channel) || grayscale ? 1 : 0;
        m[CHANNEL.R*5+channel] = CHANNEL.R === channel ? 1 : f;
        m[CHANNEL.G*5+channel] = CHANNEL.G === channel ? 1 : f;
        m[CHANNEL.B*5+channel] = CHANNEL.B === channel ? 1 : f;
        return this.set(m);
    }
    
    // aliases
    // get the image red channel as a new image
    ,redChannel: function( grayscale ) {
        return this.channel(CHANNEL.R, grayscale);
    }
    
    // get the image green channel as a new image
    ,greenChannel: function( grayscale ) {
        return this.channel(CHANNEL.G, grayscale);
    }
    
    // get the image blue channel as a new image
    ,blueChannel: function( grayscale ) {
        return this.channel(CHANNEL.B, grayscale);
    }
    
    // get the image alpha channel as a new image
    ,alphaChannel: function( grayscale ) {
        return this.channel(CHANNEL.A, true);
    }
    
    ,maskChannel: function( channel ) {
        channel = channel || 0;
        if ( CHANNEL.A === channel ) return this;
        var m = [
            1, 0, 0, 0, 0, 
            0, 1, 0, 0, 0, 
            0, 0, 1, 0, 0, 
            0, 0, 0, 1, 0
        ];
        m[channel*5+channel] = 0;
        return this.set(m);
    }
    
    ,swapChannels: function( channel1, channel2 ) {
        if ( channel1 === channel2 ) return this;
        var m = [
            1, 0, 0, 0, 0, 
            0, 1, 0, 0, 0, 
            0, 0, 1, 0, 0, 
            0, 0, 0, 1, 0
        ];
        m[channel1*5+channel1] = 0;
        m[channel2*5+channel2] = 0;
        m[channel1*5+channel2] = 1;
        m[channel2*5+channel1] = 1;
        return this.set(m);
    }
    
    ,invertChannel: function( channel ) {
        channel = channel || 0;
        if ( CHANNEL.A === channel ) return this;
        var m = [
            1, 0, 0, 0, 0, 
            0, 1, 0, 0, 0, 
            0, 0, 1, 0, 0, 
            0, 0, 0, 1, 0
        ];
        m[channel*5+channel] = -1;
        m[channel*5+4] = 255;
        return this.set(m);
    }
    
    ,invertRed: function( ) {
        return this.invertChannel(CHANNEL.R);
    }
    
    ,invertGreen: function( ) {
        return this.invertChannel(CHANNEL.G);
    }
    
    ,invertBlue: function( ) {
        return this.invertChannel(CHANNEL.B);
    }
    
    ,invertAlpha: function( ) {
        return this.invertChannel(CHANNEL.A);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,invert: function( ) {
        return this.set(rechannel([
            -1, 0,  0, 0, 255,
            0, -1,  0, 0, 255,
            0,  0, -1, 0, 255,
            0,  0,  0, 1,   0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,desaturate: function( ) {
        var L = FILTER.LUMA;
        return this.set(rechannel([
            L[0], L[1], L[2], 0, 0, 
            L[0], L[1], L[2], 0, 0, 
            L[0], L[1], L[2], 0, 0, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,saturate: function( s ) {
        var sInv, irlum, iglum, iblum, L = FILTER.LUMA;
        sInv = 1 - s;  irlum = sInv * L[0];
        iglum = sInv * L[1];  iblum = sInv * L[2];
        return this.set(rechannel([
            (irlum + s), iglum, iblum, 0, 0, 
            irlum, (iglum + s), iblum, 0, 0, 
            irlum, iglum, (iblum + s), 0, 0, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,colorize: function( rgb, amount ) {
        var r, g, b, inv_amount, L = FILTER.LUMA;
        if ( null == amount ) amount = 1;
        r = (((rgb >> 16) & 255) * 0.0039215686274509803921568627451);  // / 255
        g = (((rgb >> 8) & 255) * 0.0039215686274509803921568627451);  // / 255
        b = ((rgb & 255) * 0.0039215686274509803921568627451);  // / 255
        inv_amount = 1 - amount;
        return this.set(rechannel([
            (inv_amount + ((amount * r) * L[0])), ((amount * r) * L[1]), ((amount * r) * L[2]), 0, 0, 
            ((amount * g) * L[0]), (inv_amount + ((amount * g) * L[1])), ((amount * g) * L[2]), 0, 0, 
            ((amount * b) * L[0]), ((amount * b) * L[1]), (inv_amount + ((amount * b) * L[2])), 0, 0, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,contrast: function( r, g, b ) {
        if ( null == g ) g = r;
        if ( null == b ) b = r;
        r += 1.0; g += 1.0; b += 1.0;
        return this.set(rechannel([
            r, 0, 0, 0, (128 * (1 - r)), 
            0, g, 0, 0, (128 * (1 - g)), 
            0, 0, b, 0, (128 * (1 - b)), 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,brightness: function( r, g, b ) {
        if ( null == g ) g = r;
        if ( null == b ) b = r;
        return this.set(rechannel([
            1, 0, 0, 0, r, 
            0, 1, 0, 0, g, 
            0, 0, 1, 0, b, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,adjustHue: function( degrees ) {
        degrees *= toRad;
        var cos = Cos(degrees), sin = Sin(degrees), L = FILTER.LUMA;
        return this.set(rechannel([
            ((L[0] + (cos * (1 - L[0]))) + (sin * -(L[0]))), ((L[1] + (cos * -(L[1]))) + (sin * -(L[1]))), ((L[2] + (cos * -(L[2]))) + (sin * (1 - L[2]))), 0, 0, 
            ((L[0] + (cos * -(L[0]))) + (sin * 0.143)), ((L[1] + (cos * (1 - L[1]))) + (sin * 0.14)), ((L[2] + (cos * -(L[2]))) + (sin * -0.283)), 0, 0, 
            ((L[0] + (cos * -(L[0]))) + (sin * -((1 - L[0])))), ((L[1] + (cos * -(L[1]))) + (sin * L[1])), ((L[2] + (cos * (1 - L[2]))) + (sin * L[2])), 0, 0, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,average: function( r, g, b ) {
        if ( null == r ) r = 0.3333;
        if ( null == g ) g = 0.3333;
        if ( null == b ) b = 0.3334;
        return this.set(rechannel([
            r, g, b, 0, 0, 
            r, g, b, 0, 0, 
            r, g, b, 0, 0, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    ,quickContrastCorrection: function( contrast ) {
        if ( null == contrast ) contrast = 1.2;
        return this.set(rechannel([
            contrast, 0, 0, 0, 0, 
            0, contrast, 0, 0, 0, 
            0, 0, contrast, 0, 0, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from glfx.js
    // Gives the image a reddish-brown monochrome tint that imitates an old photograph.
    // 0 to 1 (0 for no effect, 1 for full sepia coloring)
    ,sepia: function( amount ) {
        if ( null == amount ) amount = 0.5;
        if ( amount > 1 ) amount = 1;
        else if ( amount < 0 ) amount = 0;
        return this.set(rechannel([
            1.0 - (0.607 * amount), 0.769 * amount, 0.189 * amount, 0, 0, 
            0.349 * amount, 1.0 - (0.314 * amount), 0.168 * amount, 0, 0, 
            0.272 * amount, 0.534 * amount, 1.0 - (0.869 * amount), 0, 0, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    ,sepia2: function( amount ) {
        if ( null == amount ) amount = 10;
        if ( amount > 100 ) amount = 100;
        amount *= 2.55;
        var L = FILTER.LUMA;
        return this.set(rechannel([
            L[0], L[1], L[2], 0, 40, 
            L[0], L[1], L[2], 0, 20, 
            L[0], L[1], L[2], 0, -amount, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,threshold: function( threshold, factor, lumia ) {
        if ( null == factor ) factor = 256;
        var L = FILTER.LUMA;
        return this.set(rechannel(false !== lumia
        ? [
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
            0, 0, 0, 1, 0
        ]
        : [
            factor, 0, 0, 0, (-(factor-1) * threshold), 
            0, factor, 0, 0, (-(factor-1) * threshold), 
            0,  0, factor, 0, (-(factor-1) * threshold), 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    ,thresholdRGB: function( threshold, factor ) {
        return this.threshold(threshold, factor, false);
    }
    
    ,thresholdChannel: function( channel, threshold, factor, lumia ) {
        if ( null == factor ) factor = 256;
        var m = [
            1, 0, 0, 0, 0, 
            0, 1, 0, 0, 0, 
            0, 0, 1, 0, 0, 
            0, 0, 0, 1, 0
        ], L = FILTER.LUMA;
        if ( CHANNEL.A === channel )
        {
            m[channel*5+channel] = factor;
            m[channel*5+4] = -factor * threshold;
        }
        else if ( false !== lumia )
        {
            m[channel*5+CHANNEL.R] = L[0] * factor;
            m[channel*5+CHANNEL.G] = L[1] * factor;
            m[channel*5+CHANNEL.B] = L[2] * factor;
            m[channel*5+4] = -(factor-1) * threshold;
        }
        else
        {
            m[channel*5+CHANNEL.R] = factor;
            m[channel*5+CHANNEL.G] = factor;
            m[channel*5+CHANNEL.B] = factor;
            m[channel*5+4] = -(factor-1) * threshold;
        }
        return this.set(m);
    }
    
    ,thresholdRed: function( threshold, factor, lumia ) {
        return this.thresholdChannel(CHANNEL.R, threshold, factor, lumia);
    }
    
    ,thresholdGreen: function( threshold, factor, lumia ) {
        return this.thresholdChannel(CHANNEL.G, threshold, factor, lumia);
    }
    
    ,thresholdBlue: function( threshold, factor, lumia ) {
        return this.thresholdChannel(CHANNEL.B, threshold, factor, lumia);
    }
    
    ,thresholdAlpha: function( threshold, factor, lumia ) {
        return this.thresholdChannel(CHANNEL.A, threshold, factor, lumia);
    }
    
    // RGB to YCbCr
    ,RGB2YCbCr: function( ) {
        return this.set(rechannel([
            0.299, 0.587, 0.114, 0, 0,
            -0.168736, -0.331264, 0.5, 0, 128,
            0.5, -0.418688, -0.081312, 0, 128,
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.Y, CHANNEL.CB, CHANNEL.CR, CHANNEL.A
        ));
    }
    
    // YCbCr to RGB
    ,YCbCr2RGB: function( ) {
        return this.set(rechannel([
            1, 0, 1.402, 0, -179.456,
            1, -0.34414, -0.71414, 0, 135.45984,
            1, 1.772, 0, 0, -226.816,
            0, 0, 0, 1, 0
        ],
            CHANNEL.Y, CHANNEL.CB, CHANNEL.CR, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // blend with another filter
    ,blend: function( filt, amount ) {
        this.matrix = this.matrix ? cm_blend(this.matrix, filt.matrix, amount) : new CM(filt.matrix);
        return this;
    }
    
    ,set: function( matrix ) {
        var self = this;
        self.matrix = self.matrix ? mult(self.matrix, matrix) : new CM(matrix); 
        return self;
    }
    
    ,reset: function( ) {
        this.matrix = null; 
        return this;
    }
    
    ,combineWith: function( filt ) {
        return this.set( filt.matrix );
    }
    
    // used for internal purposes
    ,_apply: notSupportClamp
    ? function( im, w, h/*, image*/ ) {
        var self = this, M = self.matrix;
        if ( !self._isOn || !M ) return im;
        
        var imLen = im.length, i, imArea = imLen>>>2, rem = (imArea&7)<<2,
            p = new CM(32), t = new A8U(4), pr = new CM(4);

        // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
        // linearize array
        // partial loop unrolling (1/8 iterations)
        for (i=0; i<imLen; i+=32)
        {
            t[0]   =  im[i  ]; t[1] = im[i+1]; t[2] = im[i+2]; t[3] = im[i+3];
            p[0 ]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[1 ]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[2 ]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[3 ]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+4]; t[1] = im[i+5]; t[2] = im[i+6]; t[3] = im[i+7];
            p[4 ]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[5 ]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[6 ]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[7 ]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+8]; t[1] = im[i+9]; t[2] = im[i+10]; t[3] = im[i+11];
            p[8 ]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[9 ]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[10]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[11]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+12]; t[1] = im[i+13]; t[2] = im[i+14]; t[3] = im[i+15];
            p[12]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[13]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[14]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[15]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];
            
            t[0]   =  im[i+16]; t[1] = im[i+17]; t[2] = im[i+18]; t[3] = im[i+19];
            p[16]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[17]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[18]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[19]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+20]; t[1] = im[i+21]; t[2] = im[i+22]; t[3] = im[i+23];
            p[20]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[21]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[22]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[23]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+24]; t[1] = im[i+25]; t[2] = im[i+26]; t[3] = im[i+27];
            p[24]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[25]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[26]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[27]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+28]; t[1] = im[i+29]; t[2] = im[i+30]; t[3] = im[i+31];
            p[28]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[29]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[30]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[31]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];
            
            // clamp them manually
            p[0 ] = p[0 ]<0 ? 0 : (p[0 ]>255 ? 255 : p[0 ]);
            p[1 ] = p[1 ]<0 ? 0 : (p[1 ]>255 ? 255 : p[1 ]);
            p[2 ] = p[2 ]<0 ? 0 : (p[2 ]>255 ? 255 : p[2 ]);
            p[3 ] = p[3 ]<0 ? 0 : (p[3 ]>255 ? 255 : p[3 ]);
            p[4 ] = p[4 ]<0 ? 0 : (p[4 ]>255 ? 255 : p[4 ]);
            p[5 ] = p[5 ]<0 ? 0 : (p[5 ]>255 ? 255 : p[5 ]);
            p[6 ] = p[6 ]<0 ? 0 : (p[6 ]>255 ? 255 : p[6 ]);
            p[7 ] = p[7 ]<0 ? 0 : (p[7 ]>255 ? 255 : p[7 ]);
            p[8 ] = p[8 ]<0 ? 0 : (p[8 ]>255 ? 255 : p[8 ]);
            p[9 ] = p[9 ]<0 ? 0 : (p[9 ]>255 ? 255 : p[9 ]);
            p[10] = p[10]<0 ? 0 : (p[10]>255 ? 255 : p[10]);
            p[11] = p[11]<0 ? 0 : (p[11]>255 ? 255 : p[11]);
            p[12] = p[12]<0 ? 0 : (p[12]>255 ? 255 : p[12]);
            p[13] = p[13]<0 ? 0 : (p[13]>255 ? 255 : p[13]);
            p[14] = p[14]<0 ? 0 : (p[14]>255 ? 255 : p[14]);
            p[15] = p[15]<0 ? 0 : (p[15]>255 ? 255 : p[15]);
            p[16] = p[16]<0 ? 0 : (p[16]>255 ? 255 : p[16]);
            p[17] = p[17]<0 ? 0 : (p[17]>255 ? 255 : p[17]);
            p[18] = p[18]<0 ? 0 : (p[18]>255 ? 255 : p[18]);
            p[19] = p[19]<0 ? 0 : (p[19]>255 ? 255 : p[19]);
            p[20] = p[20]<0 ? 0 : (p[20]>255 ? 255 : p[20]);
            p[21] = p[21]<0 ? 0 : (p[21]>255 ? 255 : p[21]);
            p[22] = p[22]<0 ? 0 : (p[22]>255 ? 255 : p[22]);
            p[23] = p[23]<0 ? 0 : (p[23]>255 ? 255 : p[23]);
            p[24] = p[24]<0 ? 0 : (p[24]>255 ? 255 : p[24]);
            p[25] = p[25]<0 ? 0 : (p[25]>255 ? 255 : p[25]);
            p[26] = p[26]<0 ? 0 : (p[26]>255 ? 255 : p[26]);
            p[27] = p[27]<0 ? 0 : (p[27]>255 ? 255 : p[27]);
            p[28] = p[28]<0 ? 0 : (p[28]>255 ? 255 : p[28]);
            p[29] = p[29]<0 ? 0 : (p[29]>255 ? 255 : p[29]);
            p[30] = p[30]<0 ? 0 : (p[30]>255 ? 255 : p[30]);
            p[31] = p[31]<0 ? 0 : (p[31]>255 ? 255 : p[31]);
            
            im[i   ] = ~~p[0 ]; im[i+1 ] = ~~p[1 ]; im[i+2 ] = ~~p[2 ]; im[i+3 ] = ~~p[3 ];
            im[i+4 ] = ~~p[4 ]; im[i+5 ] = ~~p[5 ]; im[i+6 ] = ~~p[6 ]; im[i+7 ] = ~~p[7 ];
            im[i+8 ] = ~~p[8 ]; im[i+9 ] = ~~p[9 ]; im[i+10] = ~~p[10]; im[i+11] = ~~p[11];
            im[i+12] = ~~p[12]; im[i+13] = ~~p[13]; im[i+14] = ~~p[14]; im[i+15] = ~~p[15];
            im[i+16] = ~~p[16]; im[i+17] = ~~p[17]; im[i+18] = ~~p[18]; im[i+19] = ~~p[19];
            im[i+20] = ~~p[20]; im[i+21] = ~~p[21]; im[i+22] = ~~p[22]; im[i+23] = ~~p[23];
            im[i+24] = ~~p[24]; im[i+25] = ~~p[25]; im[i+26] = ~~p[26]; im[i+27] = ~~p[27];
            im[i+28] = ~~p[28]; im[i+29] = ~~p[29]; im[i+30] = ~~p[30]; im[i+31] = ~~p[31];
        }
        // loop unrolling remainder
        if ( rem )
        {
            for (i=imLen-rem; i<imLen; i+=4)
            {
                t[0]   =  im[i]; t[1] = im[i+1]; t[2] = im[i+2]; t[3] = im[i+3];
                pr[0]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4];
                pr[1]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9];
                pr[2]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
                pr[3]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];
                
                // clamp them manually
                pr[0] = pr[0]<0 ? 0 : (pr[0]>255 ? 255 : pr[0]);
                pr[1] = pr[1]<0 ? 0 : (pr[1]>255 ? 255 : pr[1]);
                pr[2] = pr[2]<0 ? 0 : (pr[2]>255 ? 255 : pr[2]);
                pr[3] = pr[3]<0 ? 0 : (pr[3]>255 ? 255 : pr[3]);
                
                im[i  ] = ~~pr[0]; im[i+1] = ~~pr[1]; im[i+2] = ~~pr[2]; im[i+3] = ~~pr[3];
            }
        }
        return im;
    }
    : function( im, w, h/*, image*/ ) {
        var self = this, M = self.matrix;
        if ( !self._isOn || !M ) return im;
        
        var imLen = im.length, i, imArea = imLen>>>2, rem = (imArea&7)<<2,
            p = new CM(32), t = new A8U(4), pr = new CM(4);

        // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
        // linearize array
        // partial loop unrolling (1/8 iterations)
        for (i=0; i<imLen; i+=32)
        {
            t[0]   =  im[i  ]; t[1] = im[i+1]; t[2] = im[i+2]; t[3] = im[i+3];
            p[0 ]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[1 ]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[2 ]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[3 ]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+4]; t[1] = im[i+5]; t[2] = im[i+6]; t[3] = im[i+7];
            p[4 ]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[5 ]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[6 ]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[7 ]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+8]; t[1] = im[i+9]; t[2] = im[i+10]; t[3] = im[i+11];
            p[8 ]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[9 ]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[10]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[11]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+12]; t[1] = im[i+13]; t[2] = im[i+14]; t[3] = im[i+15];
            p[12]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[13]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[14]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[15]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];
            
            t[0]   =  im[i+16]; t[1] = im[i+17]; t[2] = im[i+18]; t[3] = im[i+19];
            p[16]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[17]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[18]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[19]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+20]; t[1] = im[i+21]; t[2] = im[i+22]; t[3] = im[i+23];
            p[20]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[21]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[22]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[23]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+24]; t[1] = im[i+25]; t[2] = im[i+26]; t[3] = im[i+27];
            p[24]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[25]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[26]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[27]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+28]; t[1] = im[i+29]; t[2] = im[i+30]; t[3] = im[i+31];
            p[28]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[29]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[30]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[31]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];
            
            im[i   ] = ~~p[0 ]; im[i+1 ] = ~~p[1 ]; im[i+2 ] = ~~p[2 ]; im[i+3 ] = ~~p[3 ];
            im[i+4 ] = ~~p[4 ]; im[i+5 ] = ~~p[5 ]; im[i+6 ] = ~~p[6 ]; im[i+7 ] = ~~p[7 ];
            im[i+8 ] = ~~p[8 ]; im[i+9 ] = ~~p[9 ]; im[i+10] = ~~p[10]; im[i+11] = ~~p[11];
            im[i+12] = ~~p[12]; im[i+13] = ~~p[13]; im[i+14] = ~~p[14]; im[i+15] = ~~p[15];
            im[i+16] = ~~p[16]; im[i+17] = ~~p[17]; im[i+18] = ~~p[18]; im[i+19] = ~~p[19];
            im[i+20] = ~~p[20]; im[i+21] = ~~p[21]; im[i+22] = ~~p[22]; im[i+23] = ~~p[23];
            im[i+24] = ~~p[24]; im[i+25] = ~~p[25]; im[i+26] = ~~p[26]; im[i+27] = ~~p[27];
            im[i+28] = ~~p[28]; im[i+29] = ~~p[29]; im[i+30] = ~~p[30]; im[i+31] = ~~p[31];
        }
        // loop unrolling remainder
        if ( rem )
        {
            for (i=imLen-rem; i<imLen; i+=4)
            {
                t[0]   =  im[i]; t[1] = im[i+1]; t[2] = im[i+2]; t[3] = im[i+3];
                pr[0]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4];
                pr[1]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9];
                pr[2]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
                pr[3]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];
                
                im[i  ] = ~~pr[0]; im[i+1] = ~~pr[1]; im[i+2] = ~~pr[2]; im[i+3] = ~~pr[3];
            }
        }
        return im;
    }
        
    ,canRun: function( ) {
        return this._isOn && this.matrix;
    }
});
// aliases
ColorMatrixFilter.prototype.grayscale = ColorMatrixFilter.prototype.desaturate;
ColorMatrixFilter.prototype.rotateHue = ColorMatrixFilter.prototype.adjustHue;
ColorMatrixFilter.prototype.threshold_rgb = ColorMatrixFilter.prototype.thresholdRGB;
ColorMatrixFilter.prototype.threshold_alpha = ColorMatrixFilter.prototype.thresholdAlpha;
ColorMatrixFilter.blend = cm_blend;

function cm_blend( m1, m2, amount )
{
    var m = new CM(20);
    
    // unroll the loop completely
    m[ 0 ] = m1[0] + amount * (m2[0]-m1[0]);
    m[ 1 ] = m1[1] + amount * (m2[1]-m1[1]);
    m[ 2 ] = m1[2] + amount * (m2[2]-m1[2]);
    m[ 3 ] = m1[3] + amount * (m2[3]-m1[3]);
    m[ 4 ] = m1[4] + amount * (m2[4]-m1[4]);

    m[ 5 ] = m1[5] + amount * (m2[5]-m1[5]);
    m[ 6 ] = m1[6] + amount * (m2[6]-m1[6]);
    m[ 7 ] = m1[7] + amount * (m2[7]-m1[7]);
    m[ 8 ] = m1[8] + amount * (m2[8]-m1[0]);
    m[ 9 ] = m1[9] + amount * (m2[9]-m1[9]);
    
    m[ 10 ] = m1[10] + amount * (m2[10]-m1[10]);
    m[ 11 ] = m1[11] + amount * (m2[11]-m1[11]);
    m[ 12 ] = m1[12] + amount * (m2[12]-m1[12]);
    m[ 13 ] = m1[13] + amount * (m2[13]-m1[13]);
    m[ 14 ] = m1[14] + amount * (m2[14]-m1[14]);
    
    m[ 15 ] = m1[15] + amount * (m2[15]-m1[15]);
    m[ 16 ] = m1[16] + amount * (m2[16]-m1[16]);
    m[ 17 ] = m1[17] + amount * (m2[17]-m1[17]);
    m[ 18 ] = m1[18] + amount * (m2[18]-m1[18]);
    m[ 19 ] = m1[19] + amount * (m2[19]-m1[19]);
    
    //while (i < 20) { m[i] = (inv_amount * m1[i]) + (amount * m2[i]);  i++; };
    return m;
}

}(FILTER);/**
*
* Color Map Filter(s)
*
* Changes target coloring combining current pixel color values according to non-linear color map
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var CHANNEL = FILTER.CHANNEL, MODE = FILTER.MODE, Color = FILTER.Color, CM = FILTER.ColorMatrix,
    TypedArray = FILTER.Util.Array.typed, notSupportClamp = FILTER._notSupportClamp, Maps,
    function_body = FILTER.Util.String.function_body;

//
//
// ColorMapFilter
var ColorMapFilter = FILTER.ColorMapFilter = FILTER.Class( FILTER.Filter, {
    name: "ColorMapFilter"
    
    ,constructor: function ColorMapFilter( M, init ) {
        var self = this;
        if ( !(self instanceof ColorMapFilter) ) return new ColorMapFilter(M, init);
        self.$super('constructor');
        if ( M ) self.set( M, init );
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_map: null
    ,_mapInit: null
    ,_mapName: null
    ,_mapChanged: false
    // parameters
    ,thresholds: null
    // NOTE: quantizedColors should contain 1 more element than thresholds
    ,quantizedColors: null
    ,mode: MODE.COLOR
    
    ,dispose: function( ) {
        var self = this;
        
        self._map = null;
        self._mapInit = null;
        self._mapName = null;
        self._mapChanged = null;
        
        self.thresholds = null;
        self.quantizedColors = null;
        self.$super('dispose');
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, json;
        json = {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _mapName: self._mapName || null
                ,_map: ("generic" === self._mapName) && self._map && self._mapChanged ? self._map.toString( ) : null
                ,_mapInit: ("generic" === self._mapName) && self._mapInit && self._mapChanged ? self._mapInit.toString( ) : null
                ,thresholds: self.thresholds
                ,quantizedColors: self.quantizedColors
                ,mode: self.mode
            }
        };
        self._mapChanged = false;
        return json;
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.mode = params.mode;
            self.thresholds = TypedArray( params.thresholds, Array );
            self.quantizedColors = TypedArray( params.quantizedColors, Array );
            
            //self._mapName = params._mapName;
            //self._map = params._map;
            if ( !params._map && params._mapName && Maps.hasOwnProperty(params._mapName) )
            {
                self.set(params._mapName);
            }
            else if ( params._map && ("generic" === params._mapName) )
            {
                // using bind makes the code become [native code] and thus unserializable
                /*self._map = new Function("FILTER", '"use strict"; return ' + params._map)( FILTER );
                if ( params._mapInit )
                    self._mapInit = new Function("FILTER", '"use strict"; return ' + params._mapInit)( FILTER );*/
                self.set(params._map, params._mapInit||null, 1);
            }
            /*else
            {
                self._map = null;
            }*/
        }
        return self;
    }
    
    ,RGB2HSV: function( ) {
        return this.set("rgb2hsv");
    }
    
    ,HSV2RGB: function( ) {
        return this.set("hsv2rgb");
    }
    
    ,RGB2CMYK: function( ) {
        return this.set("rgb2cmyk");
    }
    
    ,hue: function( ) {
        return this.set("hue");
    }
    
    ,saturation: function( ) {
        return this.set("saturation");
    }
    
    ,quantize: function( thresholds, quantizedColors ) {
        var self = this;
        self.thresholds = thresholds;
        self.quantizedColors = quantizedColors;
        return self.set("quantize");
    }
    
    ,mask: function( min, max, background ) {
        var self = this;
        self.thresholds = [min, max];
        self.quantizedColors = [background || 0];
        return self.set("mask");
    }
    
    ,set: function( M, preample, precompiled ) {
        var self = this;
        if ( precompiled || ("function" === typeof M) )
        {
            self._mapName = "generic"; 
            self._map = T;
            self._mapInit = preample || null;
            self._apply = apply__( self._map, self._mapInit );
            self._mapChanged = precompiled ? false : true;
        }
        else if ( M && Maps.hasOwnProperty(String(M)) && (self._mapName !== String(M)) )
        {
            self._mapName = String(M);
            self._map = Maps[self._mapName];
            self._mapInit = Maps["init__"+self._mapName];
            self._apply = apply__( self._map, self._mapInit );
            self._mapChanged = false;
        }
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self._mapName = null; 
        self._map = null; 
        self._mapInit = null; 
        self._mapChanged = false;
        return self;
    }
    
    // used for internal purposes
    /*,_apply: apply*/
        
    ,canRun: function( ) {
        return this._isOn && this._map;
    }
});
// aliases
ColorMapFilter.prototype.threshold = ColorMapFilter.prototype.quantize;
ColorMapFilter.prototype.extract = ColorMapFilter.prototype.mask;

function apply__( map, preample )
{
    var __INIT__ = preample ? function_body(preample) : '', __APPLY__ = function_body(map),
        __CLAMP__ = notSupportClamp ? "c[0] = 0>c[0] ? 0 : (255<c[0] ? 255: c[0]); c[1] = 0>c[1] ? 0 : (255<c[1] ? 255: c[1]); c[2] = 0>c[2] ? 0 : (255<c[2] ? 255: c[2]); c[3] = 0>c[3] ? 0 : (255<c[3] ? 255: c[3]);" : '';
    return new Function("FILTER", "return function( im, w, h ){\
    var self = this;\
    if ( !self._isOn || !self._map ) return im;\
    var x, y, i, imLen = im.length, imArea = imLen>>>2, rem = (imArea&7)<<2, c = new FILTER.ColorMatrix(4);\
\
    "+__INIT__+";\
    \
    for (x=0,y=0,i=0; i<imLen; i+=32)\
    {\
        c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = ~~c[0]; im[i+1] = ~~c[1]; im[i+2] = ~~c[2]; im[i+3] = ~~c[3];\
        \
        if (++x>=w) {x=0; y++;}\
        c[0] = im[i+4]; c[1] = im[i+5]; c[2] = im[i+6]; c[3] = im[i+7];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i+4] = ~~c[0]; im[i+5] = ~~c[1]; im[i+6] = ~~c[2]; im[i+7] = ~~c[3];\
        \
        if (++x>=w) {x=0; y++;}\
        c[0] = im[i+8]; c[1] = im[i+9]; c[2] = im[i+10]; c[3] = im[i+11];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i+8] = ~~c[0]; im[i+9] = ~~c[1]; im[i+10] = ~~c[2]; im[i+11] = ~~c[3];\
        \
        if (++x>=w) {x=0; y++;}\
        c[0] = im[i+12]; c[1] = im[i+13]; c[2] = im[i+14]; c[3] = im[i+15];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i+12] = ~~c[0]; im[i+13] = ~~c[1]; im[i+14] = ~~c[2]; im[i+15] = ~~c[3];\
        \
        if (++x>=w) {x=0; y++;}\
        c[0] = im[i+16]; c[1] = im[i+17]; c[2] = im[i+18]; c[3] = im[i+19];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i+16] = ~~c[0]; im[i+17] = ~~c[1]; im[i+18] = ~~c[2]; im[i+19] = ~~c[3];\
        \
        if (++x>=w) {x=0; y++;}\
        c[0] = im[i+20]; c[1] = im[i+21]; c[2] = im[i+22]; c[3] = im[i+23];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i+20] = ~~c[0]; im[i+21] = ~~c[1]; im[i+22] = ~~c[2]; im[i+23] = ~~c[3];\
        \
        if (++x>=w) {x=0; y++;}\
        c[0] = im[i+24]; c[1] = im[i+25]; c[2] = im[i+26]; c[3] = im[i+27];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i+24] = ~~c[0]; im[i+25] = ~~c[1]; im[i+26] = ~~c[2]; im[i+27] = ~~c[3];\
        \
        if (++x>=w) {x=0; y++;}\
        c[0] = im[i+28]; c[1] = im[i+29]; c[2] = im[i+30]; c[3] = im[i+31];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i+28] = ~~c[0]; im[i+29] = ~~c[1]; im[i+30] = ~~c[2]; im[i+31] = ~~c[3];\
        \
        if (++x>=w) {x=0; y++;}\
    }\
    if ( rem )\
    {\
        for (i=imLen-rem; i<imLen; i+=4,x++)\
        {\
            if (x>=w) {x=0; y++;}\
            c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
            "+__APPLY__+";\
            "+__CLAMP__+";\
            im[i] = ~~c[0]; im[i+1] = ~~c[1]; im[i+2] = ~~c[2]; im[i+3] = ~~c[3];\
        }\
    }\
    return im;\
};")( FILTER );
}


//
// private color maps
Maps = {
    
    "rgb2hsv": "function( ){\
        if ( 0 !== c[3] )\
        {\
            RGB2HSV(c, 0);\
            C0 = c[0]; C1 = c[1]; C2 = c[2];\
            c[CH] = C0; c[CS] = C1; c[CV] = C2;\
        }\
    }"
    ,"init__rgb2hsv": "function( ){\
        var C0, C1, C2, CH = FILTER.CHANNEL.H, CS = FILTER.CHANNEL.S, CV = FILTER.CHANNEL.V, RGB2HSV = FILTER.Color.RGB2HSV;\
    }"
    
    ,"hsv2rgb": "function( ){\
        if ( 0 !== c[3] )\
        {\
            C0 = c[CH]; C1 = c[CS]; C2 = c[CV];\
            c[0] = C0; c[1] = C1; c[2] = C2;\
            HSV2RGB(c, 0);\
        }\
    }"
    ,"init__hsv2rgb": "function( ){\
        var C0, C1, C2, CH = FILTER.CHANNEL.H, CS = FILTER.CHANNEL.S, CV = FILTER.CHANNEL.V, HSV2RGB = FILTER.Color.HSV2RGB;\
    }"
    
    ,"rgb2cmyk": "function( ){\
        if ( 0 !== c[3] )\
        {\
            RGB2CMYK(c, 0);\
            C0 = c[0]; C1 = c[1]; C2 = c[2];\
            c[CY] = C0; c[MA] = C1; c[YE] = C2;\
        }\
    }"
    ,"init__rgb2cmyk": "function( ){\
        var C0, C1, C2, CY = FILTER.CHANNEL.CY, MA = FILTER.CHANNEL.MA, YE = FILTER.CHANNEL.YE, RGB2CMYK = FILTER.Color.RGB2CMYK;\
    }"
    
    ,"hue": "function( ){\
        if ( 0 !== c[3] )\
        {\
            HHH = HUE(c[0], c[1], c[2])*0.70833333333333333333333333333333;\
            c[0] = HHH; c[1] = HHH; c[2] = HHH;\
        }\
    }"
    ,"init__hue": "function( ){\
        var HUE = FILTER.Color.hue, HHH;\
    }"
    
    ,"saturation": "function( ){\
        if ( 0 !== c[3] )\
        {\
            SSS = SATURATION(c[0], c[1], c[2]);\
            c[0] = SSS; c[1] = SSS; c[2] = SSS;\
        }\
    }"
    ,"init__saturation": "function( ){\
        var SATURATION = FILTER.Color.saturation, SSS;\
    }"
    
    ,"quantize": "function( ){\
        if ( 0 !== c[3] )\
        {\
            J = 0; V = VALUE(c[0], c[1], c[2]);\
            while (J<THRESH_LEN && V>THRESH[J]) J++;\
            COLVAL = J < COLORS_LEN ? COLORS[j] : 0xffffff;\
            c[0] = (COLVAL >>> 16) & 255; c[1] = (COLVAL >>> 8) & 255; c[2] = COLVAL & 255;\
        }\
    }"
    ,"init__quantize": "function( ){\
        var VALUE = FILTER.MODE.HUE === self.mode ? FILTER.Color.hue : (FILTER.MODE.SATURATION === self.mode ? FILTER.Color.saturation : (FILTER.MODE.INTENSITY === self.mode ? FILTER.Color.intensity : FILTER.Color.color24)),\
            THRESH = self.thresholds, THRESH_LEN = THRESH.length,\
            COLORS = self.quantizedColors, COLORS_LEN = COLORS.length, J, COLVAL, V;\
    }"
    
    ,"mask": "function( ){\
        if ( 0 !== c[3] )\
        {\
            V = VALUE(c[0], c[1], c[2]);\
            if ( (V < MIN_VALUE) || (V > MAX_VALUE) )\
            {\
                c[0] = COLVAL[0];\
                c[1] = COLVAL[1];\
                c[2] = COLVAL[2];\
                c[3] = COLVAL[3];\
            }\
        }\
    }"
    ,"init__mask": "function( ){\
        var VALUE = FILTER.MODE.HUE === self.mode ? FILTER.Color.hue : (FILTER.MODE.SATURATION === self.mode ? FILTER.Color.saturation : (FILTER.MODE.INTENSITY === self.mode ? FILTER.Color.intensity : FILTER.Color.color24)),\
            MIN_VALUE = self.thresholds[0], MAX_VALUE = self.thresholds[self.thresholds.length-1],\
            COLVAL = [(self.quantizedColors[0] >>> 16) & 255, (self.quantizedColors[0] >>> 8) & 255, self.quantizedColors[0] & 255, (self.quantizedColors[0] >>> 24) & 255], V;\
    }"
};

}(FILTER);/**
*
* Affine Matrix Filter
*
* Distorts the target image according to an linear affine matrix mapping function
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var IMG = FILTER.ImArray, AM = FILTER.AffineMatrix, TypedArray = FILTER.Util.Array.typed,
    FUtil = FILTER.Util.Filter, eye = FUtil.am_eye, mult = FUtil.am_multiply,
    MODE = FILTER.MODE, toRad = FILTER.CONST.toRad, Sin = Math.sin, Cos = Math.cos, Tan = Math.tan
;

//
// AffineMatrixFilter
var AffineMatrixFilter = FILTER.AffineMatrixFilter = FILTER.Class( FILTER.Filter, {
    name: "AffineMatrixFilter"
    
    ,constructor: function AffineMatrixFilter( matrix ) {
        var self = this;
        if ( !(self instanceof AffineMatrixFilter) ) return new AffineMatrixFilter(matrix);
        self.$super('constructor');
        self.matrix = matrix && matrix.length ? new AM(matrix) : null;
    }
    
    ,path: FILTER_FILTERS_PATH
    // parameters
    ,matrix: null
    ,mode: MODE.CLAMP
    ,color: 0
    
    ,dispose: function( ) {
        var self = this;
        self.matrix = null;
        self.color = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 matrix: self.matrix
                ,mode: self.mode
                ,color: self.color
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.matrix = TypedArray( params.matrix, AM );
            self.mode = params.mode;
            self.color = params.color;
        }
        return self;
    }
    
    ,flipX: function( ) {
        return this.set([
            -1, 0, 0, 1,
            0, 1, 0, 0
        ]);
    }
    
    ,flipY: function( ) {
        return this.set([
            1, 0, 0, 0,
            0, -1, 0, 1
        ]);
    }
    
    ,flipXY: function( ) {
        return this.set([
            -1, 0, 0, 1,
            0, -1, 0, 1
        ]);
    }
    
    ,translate: function( tx, ty, rel ) {
        return this.set(rel
        ? [
            1, 0, 0, tx,
            0, 1, 0, ty
        ]
        : [
            1, 0, tx, 0,
            0, 1, ty, 0
        ]);
    }
    
    ,rotate: function( theta ) {
        var s = Sin(theta), c = Cos(theta);
        return this.set([
            c, -s, 0, 0,
            s, c, 0, 0
        ]);
    }
    
    ,scale: function( sx, sy ) {
        return this.set([
            sx, 0, 0, 0,
            0, sy, 0, 0
        ]);
    }
    
    ,skew: function( thetax, thetay ) {
        return this.set([
            1, thetax ? Tan(thetax) : 0, 0, 0,
            thetay ? Tan(thetay) : 0, 1, 0, 0
        ]);
    }
    
    ,set: function( matrix ) {
        var self = this;
        self.matrix = self.matrix ? mult(self.matrix, matrix) : new AM(matrix); 
        return self;
    }
    
    ,reset: function( ) {
        this.matrix = null; 
        return this;
    }
    
    ,combineWith: function( filt ) {
        return this.set( filt.matrix );
    }
    
    // used for internal purposes
    ,_apply: function( im, w, h ) {
        var self = this, T = self.matrix;
        if ( !self._isOn || !T ) return im;
        var x, y, yw, nx, ny, i, j, imLen = im.length,
            imArea = imLen>>>2, bx = w-1, by = imArea-w,
            dst = new IMG(imLen), color = self.color||0, r, g, b, a,
            COLOR = MODE.COLOR, CLAMP = MODE.CLAMP, WRAP = MODE.WRAP, IGNORE = MODE.IGNORE,
            Ta = T[0], Tb = T[1], Tx = T[2]+T[3]*bx,
            Tcw = T[4]*w, Td = T[5], Tyw = T[6]*w+T[7]*by,
            mode = self.mode || CLAMP
        ;
        
        if ( COLOR === mode )
        {
            a = (color >>> 24)&255;
            r = (color >>> 16)&255;
            g = (color >>> 8)&255;
            b = (color)&255;
            
            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,x++)
            {
                if (x>=w) { x=0; y++; yw+=w; }
                
                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;
                if ( 0>nx || nx>bx || 0>ny || ny>by )
                {
                    // color
                    dst[i] = r;   dst[i+1] = g;
                    dst[i+2] = b;  dst[i+3] = a;
                    continue;
                }
                j = (~~nx + ~~ny) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        else if ( IGNORE === mode )
        {
            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,x++)
            {
                if (x>=w) { x=0; y++; yw+=w; }
                
                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;
                
                // ignore
                ny = ny > by || ny < 0 ? yw : ny;
                nx = nx > bx || nx < 0 ? x : nx;
                
                j = (~~nx + ~~ny) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        else if ( WRAP === mode )
        {
            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,x++)
            {
                if (x>=w) { x=0; y++; yw+=w; }
                
                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;
                
                // wrap
                ny = ny > by ? ny-imArea : (ny < 0 ? ny+imArea : ny);
                nx = nx > bx ? nx-w : (nx < 0 ? nx+w : nx);
                
                j = (~~nx + ~~ny) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        else //if ( CLAMP === mode )
        {
            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,x++)
            {
                if (x>=w) { x=0; y++; yw+=w; }
                
                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;
                
                // clamp
                ny = ny > by ? by : (ny < 0 ? 0 : ny);
                nx = nx > bx ? bx : (nx < 0 ? 0 : nx);
                
                j = (~~nx + ~~ny) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        return dst;
    }
        
    ,canRun: function( ) {
        return this._isOn && this.matrix;
    }
});
// aliases
AffineMatrixFilter.prototype.shift = AffineMatrixFilter.prototype.translate;

}(FILTER);/**
*
* Displacement Map Filter
*
* Displaces/Distorts the target image according to displace map
*
* @param displaceMap Optional (an Image used as a  dimaplcement map)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var IMG = FILTER.ImArray, IMGcopy = FILTER.ImArrayCopy, TypedArray = FILTER.Util.Array.typed,
    MODE = FILTER.MODE, A16I = FILTER.Array16I, Min = Math.min, Max = Math.max, Floor = Math.floor
;

//
//
// DisplacementMapFilter
var DisplacementMapFilter = FILTER.DisplacementMapFilter = FILTER.Class( FILTER.Filter, {
    name: "DisplacementMapFilter"
    
    ,constructor: function DisplacementMapFilter( displacemap ) {
        var self = this;
        if ( !(self instanceof DisplacementMapFilter) ) return new DisplacementMapFilter(displacemap);
        self.$super('constructor');
        if ( displacemap ) self.setMap( displacemap );
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_map: null
    ,map: null
    // parameters
    ,scaleX: 1
    ,scaleY: 1
    ,startX: 0
    ,startY: 0
    ,componentX: 0
    ,componentY: 0
    ,color: 0
    ,mode: MODE.CLAMP
    
    ,dispose: function( ) {
        var self = this;
        
        self._map = null;
        self.map = null;
        self.scaleX = null;
        self.scaleY = null;
        self.startX = null;
        self.startY = null;
        self.componentX = null;
        self.componentY = null;
        self.color = null;
        self.$super('dispose');
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, Map = self.map;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _map: self._map || (Map ? { data: Map.getData( ), width: Map.width, height: Map.height } : null)
                ,scaleX: self.scaleX
                ,scaleY: self.scaleY
                ,startX: self.startX
                ,startY: self.startY
                ,componentX: self.componentX
                ,componentY: self.componentY
                ,color: self.color
                ,mode: self.mode
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.map = null;
            self._map = params._map;
            if ( self._map ) self._map.data = TypedArray( self._map.data, IMG );
            self.scaleX = params.scaleX;
            self.scaleY = params.scaleY;
            self.startX = params.startX;
            self.startY = params.startY;
            self.componentX = params.componentX;
            self.componentY = params.componentY;
            self.color = params.color;
            self.mode = params.mode;
        }
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self._map = null; 
        self.map = null; 
        return self;
    }
    
    ,getMap: function( ) {
        return this.map;
    }
    
    ,setMap: function( map )  {
        var self = this;
        if ( map )
        {
            self.map = map;
            self._map = null;
        }
        return self;
    }
    
    // used for internal purposes
    ,_apply: function( im, w, h/*, image*/ ) {
        var self = this, Map = self.map;
        if ( !self._isOn || !(Map || self._map) ) return im;
        
        //self._map = self._map || { data: Map.getData( ), width: Map.width, height: Map.height };
        
        var _map = self._map || { data: Map.getData( ), width: Map.width, height: Map.height },
            map, mapW, mapH, mapArea, displace, ww, hh,
            color = self.color||0, alpha, red, green, blue,
            sty, stx, styw, bx0, by0, bx, by, bxx = w-1, byy = h-1, rem,
            i, j, k, x, y, ty, ty2, yy, xx, mapOff, dstOff, srcOff,
            SX = self.scaleX*0.00390625, SY = self.scaleY*0.00390625, X = self.componentX, Y = self.componentY, 
            applyArea, imArea, imLen, mapLen, imcpy, srcx, srcy,
            IGNORE = MODE.IGNORE, CLAMP = MODE.CLAMP, COLOR = MODE.COLOR, WRAP = MODE.WRAP,
            mode = self.mode||CLAMP
        ;
        
        map = _map.data;
        mapW = _map.width; mapH = _map.height; 
        mapLen = map.length; mapArea = mapLen>>>2;
        ww = Min(mapW, w); hh = Min(mapH, h);
        imLen = im.length; applyArea = (ww*hh)<<2; imArea = imLen>>>2;
        
        // make start relative
        //bxx = w-1; byy = h-1;
        stx = Floor(self.startX*bxx);
        sty = Floor(self.startY*byy);
        styw = sty*w;
        bx0 = -stx; by0 = -sty;
        bx = bxx-stx; by = byy-sty;
        
        displace = new A16I(mapArea<<1);
        imcpy = new IMGcopy(im);
        
        // pre-compute indices, 
        // reduce redundant computations inside the main application loop (faster)
        // this is faster if mapArea <= imArea, else a reverse algorithm may be needed (todo)
        rem = (mapArea&15)<<2;
        for (j=0,i=0; i<mapLen; i+=64)
        { 
            displace[j++] = Floor( ( map[i   +X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i   +Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+4 +X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+4 +Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+8 +X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+8 +Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+12+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+12+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+16+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+16+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+20+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+20+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+24+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+24+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+28+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+28+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+32+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+32+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+36+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+36+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+40+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+40+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+44+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+44+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+48+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+48+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+52+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+52+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+56+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+56+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+60+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+60+Y] - 128 ) * SY );
        }
        if ( rem )
        {
            for (i=mapLen-rem; i<mapLen; i+=4)
            { 
                displace[j++] = Floor( ( map[i   +X] - 128 ) * SX );
                displace[j++] = Floor( ( map[i   +Y] - 128 ) * SY );
            }
        }
        
        // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
        if ( COLOR === mode )
        {
            alpha = (color >>> 24) & 255; 
            red = (color >>> 16) & 255; 
            green = (color >>> 8) & 255; 
            blue = color & 255;
            for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,x++)
            {
                // update image coordinates
                if (x>=ww) { x=0; y++; ty+=w; ty2+=mapW; }
                
                // if inside the application area
                if (y<by0 || y>by || x<bx0 || x>bx) continue;
                
                xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;  
                
                j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];
                
                // color
                if (srcy>byy || srcy<0 || srcx>bxx || srcx<0)
                {
                    im[dstOff] = red;  im[dstOff+1] = green;
                    im[dstOff+2] = blue;  im[dstOff+3] = alpha;
                    continue;
                }
                
                srcOff = (srcx + srcy*w)<<2;
                // new pixel values
                im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
                im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
            }
        }
        else if ( IGNORE === mode )
        {
            for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,x++)
            {
                // update image coordinates
                if (x>=ww) { x=0; y++; ty+=w; ty2+=mapW; }
                
                // if inside the application area
                if (y<by0 || y>by || x<bx0 || x>bx) continue;
                
                xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;  
                
                j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];
                
                // ignore
                if (srcy>byy || srcy<0 || srcx>bxx || srcx<0) continue;
                
                srcOff = (srcx + srcy*w)<<2;
                // new pixel values
                im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
                im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
            }
        }
        else if ( WRAP === mode )
        {
            for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,x++)
            {
                // update image coordinates
                if (x>=ww) { x=0; y++; ty+=w; ty2+=mapW; }
                
                // if inside the application area
                if (y<by0 || y>by || x<bx0 || x>bx) continue;
                
                xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;  
                
                j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];
                
                // wrap
                srcy = srcy>byy ? srcy-h : (srcy<0 ? srcy+h : srcy);
                srcx = srcx>bxx ? srcx-w : (srcx<0 ? srcx+w : srcx);
                
                srcOff = (srcx + srcy*w)<<2;
                // new pixel values
                im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
                im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
            }
        }
        else //if ( CLAMP === mode )
        {
            for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,x++)
            {
                // update image coordinates
                if (x>=ww) { x=0; y++; ty+=w; ty2+=mapW; }
                
                // if inside the application area
                if (y<by0 || y>by || x<bx0 || x>bx) continue;
                
                xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;  
                
                j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];
                
                // clamp
                srcy = srcy>byy ? byy : (srcy<0 ? 0 : srcy);
                srcx = srcx>bxx ? bxx : (srcx<0 ? 0 : srcx);
                
                srcOff = (srcx + srcy*w)<<2;
                // new pixel values
                im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
                im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
            }
        }
        return im;
    }
        
    ,canRun: function( ) {
        return this._isOn && (this._map || this.map);
    }
});

}(FILTER);/**
*
* Geometric Map Filter
*
* Distorts the target image according to a geometric mapping function
*
* @param geoMap Optional (the geometric mapping function)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var MODE = FILTER.MODE, Maps, function_body = FILTER.Util.String.function_body;


//
//
// GeometricMapFilter
var GeometricMapFilter = FILTER.GeometricMapFilter = FILTER.Class( FILTER.Filter, {
    name: "GeometricMapFilter"
    
    ,constructor: function GeometricMapFilter( T, init ) {
        var self = this;
        if ( !(self instanceof GeometricMapFilter) ) return new GeometricMapFilter(T, init);
        self.$super('constructor');
        if ( T ) self.set( T, init );
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_map: null
    ,_mapInit: null
    ,_mapName: null
    ,_mapChanged: false
    // parameters
    ,color: 0
    ,centerX: 0
    ,centerY: 0
    ,angle: 0
    ,radius: 0
    //,wavelength: 0
    //,amplitude: 0
    //,phase: 0
    ,mode: MODE.CLAMP
    
    ,dispose: function( ) {
        var self = this;
        
        self._map = null;
        self._mapInit = null;
        self._mapName = null;
        self._mapChanged = null;
        
        self.color = 0;
        self.centerX = null;
        self.centerY = null;
        self.angle = null;
        self.radius = null;
        //self.wavelength = null;
        //self.amplitude = null;
        //self.phase = null;
        self.$super('dispose');
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, json;
        json = {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _mapName: self._mapName || null
                ,_map: ("generic" === self._mapName) && self._map && self._mapChanged ? self._map.toString( ) : null
                ,_mapInit: ("generic" === self._mapName) && self._mapInit && self._mapChanged ? self._mapInit.toString( ) : null
                ,color: self.color
                ,centerX: self.centerX
                ,centerY: self.centerY
                ,angle: self.angle
                ,radius: self.radius
                //,wavelength: self.wavelength
                //,amplitude: self.amplitude
                //,phase: self.phase
                ,mode: self.mode
            }
        };
        self._mapChanged = false;
        return json;
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.color = params.color;
            self.centerX = params.centerX;
            self.centerY = params.centerY;
            self.angle = params.angle;
            self.radius = params.radius;
            //self.wavelength = params.wavelength;
            //self.amplitude = params.amplitude;
            //self.phase = params.phase;
            self.mode = params.mode;
            
            //self._mapName = params._mapName;
            //self._map = params._map;
            if ( !params._map && params._mapName && Maps.hasOwnProperty(params._mapName) )
            {
                self.set(params._mapName);
            }
            else if ( params._map && ("generic" === params._mapName) )
            {
                // using bind makes the code become [native code] and thus unserializable
                /*self._map = new Function("FILTER", '"use strict"; return ' + params._map)( FILTER );
                if ( params._mapInit )
                self._mapInit = new Function("FILTER", '"use strict"; return ' + params._mapInit)( FILTER );*/
                self.set(params._map, params._mapInit||null, 1);
            }
            /*else
            {
                self._map = null;
            }*/
        }
        return self;
    }
    
    ,polar: function( centerX, centerY ) {
        return this;
    }
    
    ,cartesian: function( centerX, centerY ) {
        return this;
    }
    
    ,twirl: function( angle, radius, centerX, centerY ) {
        var self = this;
        self.angle = angle||0; self.radius = radius||0;
        self.centerX = centerX||0; self.centerY = centerY||0;
        return self.set("twirl");
    }
    
    ,sphere: function( radius, centerX, centerY ) {
        var self = this;
        self.radius = radius||0; self.centerX = centerX||0; self.centerY = centerY||0;
        return self.set("sphere");
    }
    
    /*,ripple: function( radius, wavelength, amplitude, phase, centerX, centerY ) {
        var self = this;
        self.radius = radius!==undef ? radius : 50; 
        self.centerX = centerX||0; 
        self.centerY = centerY||0;
        self.wavelength = wavelength!==undef ? wavelength : 16; 
        self.amplitude = amplitude!==undef ? amplitude : 10; 
        self.phase = phase||0;
        return self.set("ripple");
    }*/
    
    ,set: function( T, preample, precompiled ) {
        var self = this;
        if ( precompiled || ("function" === typeof T) )
        {
            self._mapName = "generic"; 
            self._map = T;
            self._mapInit = preample || null;
            self._apply = apply__( self._map, self._mapInit );
            self._mapChanged = precompiled ? false : true;
        }
        else if ( T && Maps.hasOwnProperty(String(T)) && (self._mapName !== String(T)) )
        {
            self._mapName = String(T);
            self._map = Maps[self._mapName];
            self._mapInit = Maps["init__"+self._mapName];
            self._apply = apply__( self._map, self._mapInit );
            self._mapChanged = false;
        }
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self._mapName = null; 
        self._map = null; 
        self._mapInit = null; 
        self._mapChanged = false;
        return self;
    }
    
    // used for internal purposes
    /*,_apply: apply*/
        
    ,canRun: function( ) {
        return this._isOn && this._map;
    }
});

function apply__( map, preample )
{
    var __INIT__ = preample ? function_body(preample) : '', __APPLY__ = function_body(map);
    return new Function("FILTER", "return function( im, w, h ){\
    var self = this;\
    if ( !self._isOn || !self._map ) return im;\
    var x, y, i, j, imLen = im.length, dst = new FILTER.ImArray(imLen), t = new FILTER.Array32F(2),\
        COLOR = FILTER.MODE.COLOR, CLAMP = FILTER.MODE.CLAMP, WRAP = FILTER.MODE.WRAP, IGNORE = FILTER.MODE.IGNORE,\
        mode = self.mode||CLAMP, color = self.color||0, r, g, b, a, bx = w-1, by = h-1;\
\
    "+__INIT__+";\
    \
    if ( COLOR === mode )\
    {\
        a = (color >>> 24)&255;\
        r = (color >>> 16)&255;\
        g = (color >>> 8)&255;\
        b = (color)&255;\
    \
        for (x=0,y=0,i=0; i<imLen; i+=4,x++)\
        {\
            if (x>=w) { x=0; y++; }\
            \
            t[0] = x; t[1] = y;\
            \
            "+__APPLY__+";\
            \
            if ( 0>t[0] || t[0]>bx || 0>t[1] || t[1]>by )\
            {\
                /* color */\
                dst[i] = r;   dst[i+1] = g;\
                dst[i+2] = b;  dst[i+3] = a;\
                continue;\
            }\
            \
            j = (~~t[0] + (~~t[1])*w) << 2;\
            dst[i] = im[j];   dst[i+1] = im[j+1];\
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];\
        }\
    }\
    else if ( IGNORE === mode )\
    {\
        for (x=0,y=0,i=0; i<imLen; i+=4,x++)\
        {\
            if (x>=w) { x=0; y++; }\
            \
            t[0] = x; t[1] = y;\
            \
            "+__APPLY__+";\
            \
            /* ignore */\
            t[1] = t[1] > by || t[1] < 0 ? y : t[1];\
            t[0] = t[0] > bx || t[0] < 0 ? x : t[0];\
            \
            j = (~~t[0] + (~~t[1])*w) << 2;\
            dst[i] = im[j];   dst[i+1] = im[j+1];\
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];\
        }\
    }\
    else if ( WRAP === mode )\
    {\
        for (x=0,y=0,i=0; i<imLen; i+=4,x++)\
        {\
            if (x>=w) { x=0; y++; }\
            \
            t[0] = x; t[1] = y;\
            \
            "+__APPLY__+";\
            \
            /* wrap */\
            t[1] = t[1] > by ? t[1]-h : (t[1] < 0 ? t[1]+h : t[1]);\
            t[0] = t[0] > bx ? t[0]-w : (t[0] < 0 ? t[0]+w : t[0]);\
            \
            j = (~~t[0] + (~~t[1])*w) << 2;\
            dst[i] = im[j];   dst[i+1] = im[j+1];\
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];\
        }\
    }\
    else /*if ( CLAMP === mode )*/\
    {\
        for (x=0,y=0,i=0; i<imLen; i+=4,x++)\
        {\
            if (x>=w) { x=0; y++; }\
            \
            t[0] = x; t[1] = y;\
            \
            "+__APPLY__+";\
            \
            /* clamp */\
            t[1] = t[1] > by ? by : (t[1] < 0 ? 0 : t[1]);\
            t[0] = t[0] > bx ? bx : (t[0] < 0 ? 0 : t[0]);\
            \
            j = (~~t[0] + (~~t[1])*w) << 2;\
            dst[i] = im[j];   dst[i+1] = im[j+1];\
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];\
        }\
    }\
    return dst;\
};")( FILTER );
}

//
// private geometric maps
Maps = {
    
    // adapted from http://je2050.de/imageprocessing/ TwirlMap
     "twirl": "function( ){\
        TX = t[0]-CX; TY = t[1]-CY;\
        D = Sqrt(TX*TX + TY*TY);\
        if ( D < R )\
        {\
            theta = Atan2(TY, TX) + fact*(R-D);\
            t[0] = CX + D*Cos(theta);  t[1] = CY + D*Sin(theta);\
        }\
    }"
    ,"init__twirl": "function( ){\
        var Sqrt = Math.sqrt, Atan2 = Math.atan2, Sin = Math.sin, Cos = Math.cos,\
            CX = self.centerX*(w-1), CY = self.centerY*(h-1),\
            angle = self.angle, R = self.radius, fact = angle/R,\
            D, TX, TY, theta;\
    }"
    
    // adapted from http://je2050.de/imageprocessing/ SphereMap
    ,"sphere": "function( ){\
        TX = t[0]-CX;  TY = t[1]-CY;\
        TX2 = TX*TX; TY2 = TY*TY;\
        D2 = TX2 + TY2;\
        if ( D2 < R2 )\
        {\
            D2 = R2 - D2; D = Sqrt(D2);\
            thetax = Asin(TX / Sqrt(TX2 + D2)) * invrefraction;\
            thetay = Asin(TY / Sqrt(TY2 + D2)) * invrefraction;\
            t[0] = t[0] - D * Tan(thetax);  t[1] = t[1] - D * Tan(thetay);\
        }\
    }"
    ,"init__sphere": "function( ){\
        var Sqrt = Math.sqrt, Asin = Math.asin, Tan = Math.tan,\
            CX = self.centerX*(w-1), CY = self.centerY*(h-1),\
            invrefraction = 1-0.555556,\
            R = self.radius, R2 = R*R,\
            D, TX, TY, TX2, TY2, R2, D2, thetax, thetay;\
    }"
    /*
    // adapted from https://github.com/JoelBesada/JSManipulate
    ,"ripple": function( t ) {
        TX = t[0]-CX;  TY = t[1]-CY;
        TX2 = TX*TX; TY2 = TY*TY;
        D2 = TX2 + TY2;
        if ( D2 < R2 )
        {
            D = Sqrt(D2);
            amount = amplitude * Sin(D/wavelength * twoPI - phase);
            amount *= (R-D)/R;
            if ( D )  amount *= wavelength/D;
            t[0] = t[0] + TX*amount;  t[1] = t[1] + TY*amount;
        }
    }
    ,"init__ripple": function( )  {
        var Sqrt = Math.sqrt, Sin = Math.asin, twoPI = 2*Math.PI,
            CX = self.centerX*(w-1), CY = self.centerY*(h-1),
            invrefraction = 1-0.555556,
            R = self.radius, R2 = R*R, amount,
            wavelength = self.wavelength, amplitude = self.amplitude, phase = self.phase,
            D, TX, TY, TX2, TY2, D2;
    }*/
};

}(FILTER);/**
*
* Convolution Matrix Filter(s)
*
* Convolves the target image with a matrix filter
*
* @param weights Optional (a convolution matrix as an array of values)
* @param factor Optional (filter normalizer factor)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var FilterUtil = FILTER.Util.Filter, CM = FILTER.ConvolutionMatrix,
    IMG = FILTER.ImArray, //IMGcopy = FILTER.ImArrayCopy,
    A32F = FILTER.Array32F, A16I = FILTER.Array16I, A8U = FILTER.Array8U,
    integral_convolution = FilterUtil.integral_convolution,
    separable_convolution = FilterUtil.separable_convolution,
    blend = FilterUtil.cm_combine, convolve = FilterUtil.cm_convolve,
    
    TypedArray = FILTER.Util.Array.typed, notSupportClamp = FILTER._notSupportClamp,
    
    sqrt2 = FILTER.CONST.SQRT2, toRad = FILTER.CONST.toRad, toDeg = FILTER.CONST.toDeg,
    Abs = Math.abs, Sqrt = Math.sqrt, Sin = Math.sin, Cos = Math.cos,
    
    // hardcode Pascal numbers, used for binomial kernels
    _pascal=[
        [1],
        [1, 1],
        [1, 2,  1],
        [1, 3,  3,  1],
        [1, 4,  6,  4,  1],
        [1, 5,  10, 10, 5,  1],
        [1, 6,  15, 20, 15, 6,  1],
        [1, 7,  21, 35, 35, 21, 7,  1],
        [1, 8,  28, 56, 70, 56, 28, 8,  1]
    ]
;

//
//  Convolution Matrix Filter
var ConvolutionMatrixFilter = FILTER.ConvolutionMatrixFilter = FILTER.Class( FILTER.Filter, {
    name: "ConvolutionMatrixFilter"
    
    ,constructor: function ConvolutionMatrixFilter( weights, factor, bias, rgba ) {
        var self = this;
        if ( !(self instanceof ConvolutionMatrixFilter) ) return new ConvolutionMatrixFilter(weights, factor, bias, rgba);
        self.$super('constructor');
        self._coeff = new CM([1.0, 0.0]);
        self.matrix2 = null;  self.dim2 = 0;
        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        self._rgba = !!rgba;
        if ( weights && weights.length)
        {
            self.set(weights, ~~(Sqrt(weights.length)+0.5), factor||1.0, bias||0.0);
        }
        else 
        {
            self.matrix = null; self.dim = 0;
        }
    }
    
    ,path: FILTER_FILTERS_PATH
    ,dim: 0
    ,dim2: 0
    ,matrix: null
    ,matrix2: null
    ,_mat: null
    ,_mat2: null
    ,_coeff: null
    ,_isGrad: false
    ,_doIntegral: 0
    ,_doSeparable: false
    ,_indices: null
    ,_indices2: null
    ,_indicesf: null
    ,_indicesf2: null
    ,_rgba: false
    
    ,dispose: function( ) {
        var self = this;
        
        self.dim = null;
        self.dim2 = null;
        self.matrix = null;
        self.matrix2 = null;
        self._mat = null;
        self._mat2 = null;
        self._coeff = null;
        self._isGrad = null;
        self._doIntegral = null;
        self._doSeparable = null;
        self._indices = null;
        self._indices2 = null;
        self._indicesf = null;
        self._indicesf2 = null;
        self._rgba = null;
        self.$super('dispose');
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 dim: self.dim
                ,dim2: self.dim2
                ,matrix: self.matrix
                ,matrix2: self.matrix2
                ,_mat: self._mat
                ,_mat2: self._mat2
                ,_coeff: self._coeff
                ,_isGrad: self._isGrad
                ,_doIntegral: self._doIntegral
                ,_doSeparable: self._doSeparable
                ,_indices: self._indices
                ,_indices2: self._indices2
                ,_indicesf: self._indicesf
                ,_indicesf2: self._indicesf2
                ,_rgba: self._rgba
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.dim = params.dim;
            self.dim2 = params.dim2;
            self.matrix = TypedArray( params.matrix, CM );
            self.matrix2 = TypedArray( params.matrix2, CM );
            self._mat = TypedArray( params._mat, CM );
            self._mat2 = TypedArray( params._mat2, CM );
            self._coeff = TypedArray( params._coeff, CM );
            self._isGrad = params._isGrad;
            self._doIntegral = params._doIntegral;
            self._doSeparable = params._doSeparable;
            self._indices = TypedArray( params._indices, A16I );
            self._indices2 = TypedArray( params._indices2, A16I );
            self._indicesf = TypedArray( params._indicesf, A16I );
            self._indicesf2 = TypedArray( params._indicesf2, A16I );
            self._rgba = params._rgba;
        }
        return self;
    }
    
    ,rgba: function( bool ) {
        var self = this;
        if ( !arguments.length )
        {
            return self._rgba;
        }
        else
        {
            self._rgba = !!bool;
            return self;
        }
    }
    
    // generic functional-based kernel filter
    ,functional: function( f, d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        var kernel = functional1(d, f), fact = 1.0/summa(kernel);
        // this can be separable
        this.set(kernel, d, fact, fact, d, kernel);
        this._doSeparable = true; return this;
    }
    
    // fast gauss filter
    ,fastGauss: function( quality, d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        quality = ~~(quality||1);
        if ( quality < 1 ) quality = 1;
        else if ( quality > 3 ) quality = 3;
        this.set(ones(d), d, 1/(d*d), 0.0);
        this._doIntegral = quality; return this;
    }
    
    // generic box low-pass filter
    ,lowPass: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        this.set(ones(d), d, 1/(d*d), 0.0);
        this._doIntegral = 1; return this;
    }
    ,boxBlur: null

    // generic box high-pass filter (I-LP)
    ,highPass: function( d, f ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        f = f === undef ? 1 : f;
        // HighPass Filter = I - (respective)LowPass Filter
        var fact = -f/(d*d);
        this.set(ones(d, fact, 1+fact), d, 1.0, 0.0);
        this._doIntegral = 1; return this;
    }

    ,glow: function( f, d ) { 
        f = f === undef ? 0.5 : f;  
        return this.highPass(d, -f); 
    }
    
    ,sharpen: function( f, d ) { 
        f = f === undef ? 0.5 : f;  
        return this.highPass(d, f); 
    }
    
    ,verticalBlur: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        this.set(average1(d), 1, 1/d, 0.0, d); 
        this._doIntegral = 1; return this;
    }
    
    ,horizontalBlur: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        this.set(average1(d), d, 1/d, 0.0, 1); 
        this._doIntegral = 1; return this;
    }
    
    // supports only vertical, horizontal, diagonal
    ,directionalBlur: function( theta, d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        theta *= toRad;
        return this.set(twos2(d, Cos(theta), -Sin(theta), 1/d), d, 1.0, 0.0);
    }
    
    // generic binomial(quasi-gaussian) low-pass filter
    ,binomialLowPass: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        /*var filt=binomial(d);
        return this.set(filt.kernel, d, 1/filt.sum); */
        var kernel = binomial1(d), fact = 1/(1<<(d-1));
        this.set(kernel, d, fact, fact, d, kernel);
        this._doSeparable = true; return this;
    }
    ,gaussBlur: null

    // generic binomial(quasi-gaussian) high-pass filter
    ,binomialHighPass: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        var kernel = binomial2(d);
        // HighPass Filter = I - (respective)LowPass Filter
        return this.set(blend(ones(d), kernel, 1, -1/summa(kernel)), d, 1.0, 0.0); 
    }
    
    // X-gradient, partial X-derivative (Prewitt)
    ,prewittX: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(prewitt(d, 0), d, 1.0, 0.0);
        this.set(average1(d), d, 1.0, 0.0, d, derivative1(d,0));
        this._doSeparable = true; return this;
    }
    ,gradX: null
    
    // Y-gradient, partial Y-derivative (Prewitt)
    ,prewittY: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(prewitt(d, 1), d, 1.0, 0.0);
        this.set(derivative1(d,1), d, 1.0, 0.0, d, average1(d));
        this._doSeparable = true; return this;
    }
    ,gradY: null
    
    // directional gradient (Prewitt)
    ,prewittDirectional: function( theta, d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        theta *= toRad;
        return this.set(blend(prewitt(d, 0), prewitt(d, 1), Cos(theta), Sin(theta)), d, 1.0, 0.0);
    }
    ,gradDirectional: null
    
    // gradient magnitude (Prewitt)
    ,prewitt: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        this.set(prewitt(d, 0), d, 1.0, 0.0, d, prewitt(d, 1));
        this._isGrad = true; return this;
    }
    ,grad: null
    
    // partial X-derivative (Sobel)
    ,sobelX: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(sobel(d, 0), d, 1.0, 0.0);
        this.set(binomial1(d), d, 1.0, 0.0, d, derivative1(d,0));
        this._doSeparable = true; return this;
    }
    
    // partial Y-derivative (Sobel)
    ,sobelY: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(sobel(d, 1), d, 1.0, 0.0);
        this.set(derivative1(d,1), d, 1.0, 0.0, d, binomial1(d));
        this._doSeparable = true; return this;
    }
    
    // directional gradient (Sobel)
    ,sobelDirectional: function( theta, d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        theta *= toRad;
        return this.set(blend(sobel(d, 0), sobel(d, 1), Cos(theta), Sin(theta)), d, 1.0, 0.0);
    }
    
    // gradient magnitude (Sobel)
    ,sobel: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        this.set(sobel(d, 0), d, 1.0, 0.0, d, sobel(d, 1));
        this._isGrad = true; return this;
    }
    
    ,laplace: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        this.set(ones(d, -1, d*d-1), d, 1.0, 0.0);
        this._doIntegral = 1; return this;
    }
    
    ,emboss: function( angle, amount, d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        angle = angle === undef ? -0.25*Math.PI : angle*toRad;
        amount = amount || 1;
        return this.set(twos(d, amount*Cos(angle), -amount*Sin(angle), 1), d, 1.0, 0.0);
    }
    ,bump: null
    
    ,edges: function( m ) {
        m = m || 1;
        return this.set([
            0,   m,   0,
            m,  -4*m, m,
            0,   m,   0
         ], 3, 1.0, 0.0);
    }
    
    ,set: function( m, d, f, b, d2, m2 ) {
        var self = this, tmp;
        
        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        self.matrix2 = null; self.dim2 = 0; self._indices2 = self._indicesf2 = null; self._mat2 = null;
        
        self.matrix = new CM(m); self.dim = d; self._coeff[0] = f||1; self._coeff[1] = b||0;
        tmp  = indices(self.matrix, self.dim);
        self._indices = tmp[0]; self._indicesf = tmp[1]; self._mat = tmp[2];
        
        if ( m2 )
        {
            self.matrix2 = new CM(m2); self.dim2 = d2;
            tmp  = indices(self.matrix2, self.dim2);
            self._indices2 = tmp[0]; self._indicesf2 = tmp[1]; self._mat2 = tmp[2];
        }
        else if ( d2 )
        {
            self.dim2 = d2;
        }
        
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self.matrix = self.matrix2 = null; 
        self.dim = self.dim2 = 0;
        self._mat = self._mat2 = null; 
        self._indices = self._indices2 = self._indicesf = self._indicesf2 = null;
        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        return self;
    }
    
    ,combineWith: function( filt ) {
        // matrices/kernels need to be convolved -> larger kernel->tensor in order to be actually combined
        // todo??
        return this;
    }
    
    ,getMatrix: function( ) {
        return this.matrix;
    }
    
    ,setMatrix: function( m, d ) {
        return this.set( m, d );
    }
    
    // used for internal purposes
    ,_apply: notSupportClamp
    ? function(im, w, h/*, image*/) {
        var self = this, rgba = self._rgba;
        if ( !self._isOn || !self.matrix ) return im;
        
        // do a faster convolution routine if possible
        if ( self._doIntegral ) 
        {
            return self.matrix2 ? integral_convolution(rgba, im, w, h, self.matrix, self.matrix2, self.dim, self.dim2, self._coeff[0], self._coeff[1], self._doIntegral) : integral_convolution(rgba, im, w, h, self.matrix, null, self.dim, self.dim, self._coeff[0], self._coeff[1], self._doIntegral);
        }
        else if ( self._doSeparable )
        {
            return separable_convolution(rgba, im, w, h, self._mat, self._mat2, self._indices, self._indices2, self._coeff[0], self._coeff[1]);
        }
        
        var imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen), 
            t0, t1, t2, t3, i, j, k, x, ty, ty2, 
            xOff, yOff, srcOff, r, g, b, a, r2, g2, b2, a2,
            bx = w-1, by = imArea-w, coeff1 = self._coeff[0], coeff2 = self._coeff[1],
            mat = self.matrix, mat2 = self.matrix2, wt, wt2, _isGrad = self._isGrad,
            mArea, matArea, imageIndices
        ;
        
        // apply filter (algorithm direct implementation based on filter definition with some optimizations)
        if (mat2) // allow to compute a second matrix in-parallel in same pass
        {
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            mArea = self._indicesf.length; 
            imageIndices = new A16I(self._indicesf);
            for (k=0; k<mArea; k+=2)
            { 
                imageIndices[k+1] *= w;
            } 
            matArea = mat.length;
            
            // do direct convolution
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=r2=g2=b2=a2=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2; 
                    wt = mat[k]; r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                    //a += im[srcOff+3] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2 = mat2[k]; r2 += im[srcOff] * wt2; g2 += im[srcOff+1] * wt2;  b2 += im[srcOff+2] * wt2;
                    //a2 += im[srcOff+3] * wt2;
                }
                
                // output
                if ( _isGrad )
                {
                    t0 = Abs(r)+Abs(r2);  t1 = Abs(g)+Abs(g2);  t2 = Abs(b)+Abs(b2);
                }
                else
                {
                    t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                }
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                /*if ( rgba )
                {
                    t3 = _isGrad ? Abs(a)+Abs(a2) : coeff1*a + coeff2*a2;
                    if ( notSupportClamp ) t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                    dst[i+3] = ~~t3;
                }
                else
                {*/
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                /*}*/
            }
        }
        else
        {
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            mArea = self._indices.length; 
            imageIndices = new A16I(self._indices);
            for (k=0; k<mArea; k+=2)
            { 
                imageIndices[k+1] *= w;
            }
            mat = self._mat;
            matArea = mat.length;
            
            // do direct convolution
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2; wt = mat[k];
                    r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                    //a += im[srcOff+3] * wt;
                }
                
                // output
                t0 = coeff1*r+coeff2;  t1 = coeff1*g+coeff2;  t2 = coeff1*b+coeff2;
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                /*if ( rgba )
                {
                    t3 = coeff1*a + coeff2;
                    if ( notSupportClamp ) t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                    dst[i+3] = ~~t3;
                }
                else
                {*/
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                /*}*/
            }
        }
        return dst;
    }
    : function(im, w, h/*, image*/) {
        var self = this, rgba = self._rgba;
        if ( !self._isOn || !self.matrix ) return im;
        
        // do a faster convolution routine if possible
        if ( self._doIntegral ) 
        {
            return self.matrix2 ? integral_convolution(rgba, im, w, h, self.matrix, self.matrix2, self.dim, self.dim2, self._coeff[0], self._coeff[1], self._doIntegral) : integral_convolution(rgba, im, w, h, self.matrix, null, self.dim, self.dim, self._coeff[0], self._coeff[1], self._doIntegral);
        }
        else if ( self._doSeparable )
        {
            return separable_convolution(rgba, im, w, h, self._mat, self._mat2, self._indices, self._indices2, self._coeff[0], self._coeff[1]);
        }
        
        var imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen), 
            t0, t1, t2, t3, i, j, k, x, ty, ty2, 
            xOff, yOff, srcOff, r, g, b, a, r2, g2, b2, a2,
            bx = w-1, by = imArea-w, coeff1 = self._coeff[0], coeff2 = self._coeff[1],
            mat = self.matrix, mat2 = self.matrix2, wt, wt2, _isGrad = self._isGrad,
            mArea, matArea, imageIndices
        ;
        
        // apply filter (algorithm direct implementation based on filter definition with some optimizations)
        if (mat2) // allow to compute a second matrix in-parallel in same pass
        {
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            mArea = self._indicesf.length; 
            imageIndices = new A16I(self._indicesf);
            for (k=0; k<mArea; k+=2)
            { 
                imageIndices[k+1] *= w;
            } 
            matArea = mat.length;
            
            // do direct convolution
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=r2=g2=b2=a2=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2; 
                    wt = mat[k]; r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                    //a += im[srcOff+3] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2 = mat2[k]; r2 += im[srcOff] * wt2; g2 += im[srcOff+1] * wt2;  b2 += im[srcOff+2] * wt2;
                    //a2 += im[srcOff+3] * wt2;
                }
                
                // output
                if ( _isGrad )
                {
                    t0 = Abs(r)+Abs(r2);  t1 = Abs(g)+Abs(g2);  t2 = Abs(b)+Abs(b2);
                }
                else
                {
                    t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                /*if ( rgba )
                {
                    t3 = _isGrad ? Abs(a)+Abs(a2) : coeff1*a + coeff2*a2;
                    if ( notSupportClamp ) t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                    dst[i+3] = ~~t3;
                }
                else
                {*/
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                /*}*/
            }
        }
        else
        {
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            mArea = self._indices.length; 
            imageIndices = new A16I(self._indices);
            for (k=0; k<mArea; k+=2)
            { 
                imageIndices[k+1] *= w;
            }
            mat = self._mat;
            matArea = mat.length;
            
            // do direct convolution
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2; wt = mat[k];
                    r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                    //a += im[srcOff+3] * wt;
                }
                
                // output
                t0 = coeff1*r+coeff2;  t1 = coeff1*g+coeff2;  t2 = coeff1*b+coeff2;
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                /*if ( rgba )
                {
                    t3 = coeff1*a + coeff2;
                    if ( notSupportClamp ) t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                    dst[i+3] = ~~t3;
                }
                else
                {*/
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                /*}*/
            }
        }
        return dst;
    }
        
    ,canRun: function( ) {
        return this._isOn && this.matrix;
    }
});
// aliases
ConvolutionMatrixFilter.prototype.gradX = ConvolutionMatrixFilter.prototype.prewittX;
ConvolutionMatrixFilter.prototype.gradY = ConvolutionMatrixFilter.prototype.prewittY;
ConvolutionMatrixFilter.prototype.gradDirectional = ConvolutionMatrixFilter.prototype.prewittDirectional;
ConvolutionMatrixFilter.prototype.grad = ConvolutionMatrixFilter.prototype.prewitt;
ConvolutionMatrixFilter.prototype.bump = ConvolutionMatrixFilter.prototype.emboss;
ConvolutionMatrixFilter.prototype.boxBlur = ConvolutionMatrixFilter.prototype.lowPass;
ConvolutionMatrixFilter.prototype.gaussBlur = ConvolutionMatrixFilter.prototype.binomialLowPass;


//
//  Private methods
function summa( kernel )
{
    for(var sum=0,i=0,l=kernel.length; i<l; i++) sum += kernel[i];
    return sum;
}
function indices( m, d )
{
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    var indices = [], indices2 = [], mat = [], k, x, y,  matArea = m.length, matRadius = d, matHalfSide = matRadius>>>1;
    x=0; y=0; k=0;
    while (k<matArea)
    { 
        indices2.push(x-matHalfSide); 
        indices2.push(y-matHalfSide);
        if (m[k])
        {
            indices.push(x-matHalfSide); 
            indices.push(y-matHalfSide);
            mat.push(m[k]);
        }
        k++; x++; if (x>=matRadius) { x=0; y++; }
    }
    return [new A16I(indices), new A16I(indices2), new CM(mat)];
}

function functional1( d, f )
{
    var i, ker = new Array(d);
    for(i=0; i<d; i++) ker[i] = f(i);
    return ker;
}
function identity1( d )
{
    var i, ker = new Array(d);
    for(i=0; i<d; i++) ker[i] = 0;
    ker[d>>>1] = 1;
    return ker;
}
function average1( d )
{
    var i, ker = new Array(d);
    for(i=0; i<d; i++) ker[i] = 1;
    return ker;
}
function derivative1( d, rev )
{
    var i, half = d>>>1, ker = new Array(d);
    if ( rev ) for(i=0; i<d; i++) ker[d-1-i] = i-half;
    else for(i=0; i<d; i++) ker[i] = i-half;
    return ker;
}

// pascal numbers (binomial coefficients) are used to get coefficients for filters that resemble gaussian distributions
// eg Sobel, Canny, gradients etc..
function binomial1( d )
{
    var l = _pascal.length, row, uprow, i, il;
    d--;
    if (d < l)
    {
        row = new CM(_pascal[d]);
    }
    else
    {
        // else compute them iteratively
        row = new CM(_pascal[l-1]);
        while ( l<=d )
        {
            uprow=row; row=new CM(uprow.length+1); row[0]=1;
            for (i=0, il=uprow.length-1; i<il; i++) { row[i+1]=(uprow[i]+uprow[i+1]); } row[uprow.length]=1;
            if (l<40) _pascal.push(new Array(row)); // save it for future dynamically
            l++;
        }
    }
    return row;
}

function functional2( d, f )
{
    var functional = functional1(d, f);
    // convolve with itself
    return convolve(functional, functional);
}
function binomial2( d )
{
    var binomial = binomial1(d);
    // convolve with itself
    return convolve(binomial, binomial);
}
function vertical2( d )
{
    return convolve(average1(d), identity1(d));
}
function horizontal2( d )
{
    return convolve(identity1(d), average1(d));
}
function sobel( d, dir )
{
    return 1===dir ? /*y*/convolve(derivative1(d,1), binomial1(d)) : /*x*/convolve(binomial1(d), derivative1(d,0));
}
function prewitt( d, dir )
{
    return 1===dir ? /*y*/convolve(derivative1(d,1), average1(d)) : /*x*/convolve(average1(d), derivative1(d,0));
}
function ones( d, f, c )
{ 
    f = f||1; c = c||f;
    var l = d*d, i, o = new CM(l);
    for(i=0; i<d; i++) o[i] = f;
    o[l>>>1] = c;
    return o;
}
function twos( d, dx, dy, c )
{
    var l=d*d, half=d>>>1, center=l>>>1, i, k, j, o=new CM(l), tx, ty;
    for (tx=0,i=0; i<=half; i++,tx+=dx)
    {
        for (k=0,ty=0,j=0; j<=half; j++,k+=d,ty+=dy)
        {
            //tx=i*dx;  ty=j*dy;
            o[center + i + k]=   tx + ty;
            o[center - i - k]= - tx - ty;
            o[center - i + k]= - tx + ty;
            o[center + i - k]=   tx - ty;
        }
    }
    o[center] = c||1;
    return o;
}
function twos2( d, c, s, cf )
{
    var l=d*d, half=d>>1, center=l>>1, i, j, k, 
        o=new CM(l), T=new CM(l), 
        tx, ty, dx, dy, f=1/d, 
        delta=1e-8;
    
    if (Abs(c)>delta) { dx=1; dy=s/c; }
    else  { dx=c/s; dy=1; }
    
    i=0; tx=0; ty=0; k=dy*d;
    while (i<=half)
    {
        // compute the transformation of the (diagonal) line
        T[center + i]= ~~(center + tx + ty + 0.5);
        T[center - i]= ~~(center - tx - ty + 0.5);
        i++; tx+=dx; ty+=k;
    }
    i=0;
    while (i<=half)
    {
        // do the mapping of the base line to the transformed one
        o[T[center + i]]=o[T[center - i]]=f;
        // anti-aliasing ??..
        i++;
    }
    o[center] = cf||1;
    return o;
}

}(FILTER);/**
*
* Morphological Filter(s)
*
* Applies morphological processing to target image
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// used for internal purposes
var IMG = FILTER.ImArray, STRUCT = FILTER.Array8U, A32I = FILTER.Array32I,
    Sqrt = Math.sqrt, TypedArray = FILTER.Util.Array.typed,
    // return a box structure element
    box = function(d) {
        var i, size=d*d, ones=new STRUCT(size);
        for (i=0; i<size; i++) ones[i]=1;
        return ones;
    },
    
    box3 = box(3),
    
    Filters
;


//
//
//  Morphological Filter
var MorphologicalFilter = FILTER.MorphologicalFilter = FILTER.Class( FILTER.Filter, {
    name: "MorphologicalFilter"
    
    ,constructor: function MorphologicalFilter( ) {
        var self = this;
        if ( !(self instanceof MorphologicalFilter) ) return new MorphologicalFilter();
        self.$super('constructor');
        self._filterName = null;
        self._filter = null;
        self._dim = 0;
        self._structureElement = null;
        self._indices = null;
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_filterName: null
    ,_filter: null
    ,_dim: 0
    ,_structureElement: null
    ,_indices: null
    
    ,dispose: function( ) {
        var self = this;
        
        self._filterName = null;
        self._filter = null;
        self._dim = null;
        self._structureElement = null;
        self._indices = null;
        self.$super('dispose');
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _filterName: self._filterName
                ,_dim: self._dim
                ,_structureElement: self._structureElement
                ,_indices: self._indices
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._dim = params._dim;
            self._structureElement = TypedArray( params._structureElement, STRUCT );
            self._indices = TypedArray( params._indices, A32I );
            self._filterName = params._filterName;
            if ( self._filterName && Filters[ self._filterName ] )
                self._filter = Filters[ self._filterName ];
        }
        return self;
    }
    
    ,erode: function( structureElement ) { 
        return this.set( structureElement, "erode" );
    }
    
    ,dilate: function( structureElement ) { 
        return this.set( structureElement, "dilate" );
    }
    
    ,opening: function( structureElement ) { 
        return this.set( structureElement, "open" );
    }
    
    ,closing: function( structureElement ) { 
        return this.set( structureElement, "close" );
    }
    
    ,set: function( structureElement, filtName ) {
        var self = this;
        self._filterName = filtName;
        self._filter = Filters[ filtName ];
        if ( structureElement && structureElement.length )
        {
            // structure Element given
            self._structureElement = new STRUCT( structureElement );
            self._dim = ~~(Sqrt(self._structureElement.length)+0.5);
        }
        else if (structureElement && structureElement===(structureElement-0))
        {
            // dimension given
            self._structureElement = box(structureElement);
            self._dim = structureElement;
        }
        else
        {
            // default
            self._structureElement = box3;
            self._dim = 3;
        }
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        var Indices=[], k, x, y,
            structureElement=self._structureElement, 
            matArea=structureElement.length, matRadius=self._dim, matHalfSide=(matRadius>>1);
        x=0; y=0; k=0;
        while (k<matArea)
        { 
            // allow a general structuring element instead of just a box
            if (structureElement[k])
            {
                Indices.push(x-matHalfSide); 
                Indices.push(y-matHalfSide);
            }
            k++; x++; if (x>=matRadius) { x=0; y++; }
        }
        self._indices = new A32I(Indices);
        
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self._filterName = null; 
        self._filter = null; 
        self._dim = 0; 
        self._structureElement = null; 
        self._indices = null;
        return self;
    }
    
    // used for internal purposes
    ,_apply: function( im, w, h ) {
        var self = this;
        if ( !self._isOn || !self._dim || !self._filter )  return im;
        return self._filter( self, im, w, h );
    }
        
    ,canRun: function( ) {
        return this._isOn && this._dim && this._filter;
    }
});

//
//
// private methods

Filters = {
    "dilate": function( self, im, w, h ) {
        var 
            structureElement=self._structureElement,
            matArea=structureElement.length, //matRadius*matRadius,
            matRadius=self._dim, imageIndices=new A32I(self._indices), 
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
            bx=w-1, by=imArea-w
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (k=0; k<coverArea2; k+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[k+1]*=w;
        }
        
        x=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            rM=0; gM=0; bM=0; 
            for (j=0; j<coverArea; j+=2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r>rM) rM=r; if (g>gM) gM=g; if (b>bM) bM=b;
                }
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM;  dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        return dst;
    }
    
    ,"erode": function( self, im, w, h ) {
        var 
            structureElement=self._structureElement,
            matArea=structureElement.length, //matRadius*matRadius,
            matRadius=self._dim, imageIndices=new A32I(self._indices), 
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
            bx=w-1, by=imArea-w
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (k=0; k<coverArea2; k+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[k+1]*=w;
        }
        
        x=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            for (j=0; j<coverArea; j+=2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        return dst;
    }
    
    // dilation of erotion
    ,"open": function( self, im, w, h ) {
        var 
            structureElement=self._structureElement,
            matArea=structureElement.length, //matRadius*matRadius,
            matRadius=self._dim, imageIndices=new A32I(self._indices), 
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
            bx=w-1, by=imArea-w
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (k=0; k<coverArea2; k+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[k+1]*=w;
        }
        
        // erode step
        x=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            for (j=0; j<coverArea; j+=2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        
        im = dst; dst = new IMG(imLen);
        
        // dilate step
        x=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            for (j=0; j<coverArea; j+=2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        return dst;
    }
    
    // erotion of dilation
    ,"close": function( self, im, w, h ) {
        var 
            structureElement=self._structureElement,
            matArea=structureElement.length, //matRadius*matRadius,
            matRadius=self._dim, imageIndices=new A32I(self._indices), 
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
            bx=w-1, by=imArea-w
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (k=0; k<coverArea2; k+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[k+1]*=w;
        }
        
        // dilate step
        x=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            for (j=0; j<coverArea; j+=2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        
        im = dst; dst = new IMG(imLen);
        
        // erode step
        x=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            for (j=0; j<coverArea; j+=2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        return dst;
    }
};

}(FILTER);/**
*
* Statistical Filter(s)
*
* Applies statistical filtering/processing to target image
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// used for internal purposes
var IMG = FILTER.ImArray, A32I = FILTER.Array32I, TypedArray = FILTER.Util.Array.typed,
    Min = Math.min, Max = Math.max, Filters;
    
//
//
//  Statistical Filter
var StatisticalFilter = FILTER.StatisticalFilter = FILTER.Class( FILTER.Filter, {
    name: "StatisticalFilter"
    
    ,constructor: function StatisticalFilter( ) {
        var self = this;
        if ( !(self instanceof StatisticalFilter) ) return new StatisticalFilter();
        self.$super('constructor');
        self._dim = 0;
        self._indices = null;
        self._filterName = null;
        self._filter = null;
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_dim: 0
    ,_indices: null
    ,_filter: null
    ,_filterName: null
    
    ,dispose: function( ) {
        var self = this;
        
        self._dim = null;
        self._indices = null;
        self._filter = null;
        self._filterName = null;
        self.$super('dispose');
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _filterName: self._filterName
                ,_dim: self._dim
                ,_indices: self._indices
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._dim = params._dim;
            self._indices = TypedArray( params._indices, A32I );
            self._filterName = params._filterName;
            if ( self._filterName && Filters[ self._filterName ] )
                self._filter = Filters[ self._filterName ];
        }
        return self;
    }
    
    ,median: function( d ) { 
        // allow only odd dimensions for median
        return this.set( null == d ? 3 : (d&1 ? d : d+1), "median" );
    }
    
    ,minimum: function( d ) { 
        return this.set( null == d ? 3 : (d&1 ? d : d+1), "minimum" );
    }
    
    ,maximum: function( d ) { 
        return this.set( null == d ? 3 : (d&1 ? d : d+1), "maximum" );
    }
    
    ,set: function( d, filt ) {
        var self = this;
        self._filterName = filt; 
        self._filter = Filters[ filt ]; 
        self._dim = d; 
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        var Indices=[], k, x, y,
            matArea=d*d, matRadius=d, matHalfSide=(matRadius>>1);
        x=0; y=0; k=0;
        while (k<matArea)
        { 
            Indices.push(x-matHalfSide); 
            Indices.push(y-matHalfSide);
            k++; x++; if (x>=matRadius) { x=0; y++; }
        }
        self._indices = new A32I(Indices);
        
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self._filterName = null; 
        self._filter = null; 
        self._dim = 0; 
        self._indices = null;
        return self;
    }
    
    // used for internal purposes
    ,_apply: function(im, w, h) {
        var self = this;
        if ( !self._isOn || !self._dim )  return im;
        return self._filter( self, im, w, h );
    }
        
    ,canRun: function( ) {
        return this._isOn && this._dim;
    }
});
// aliiases
StatisticalFilter.prototype.erode = StatisticalFilter.prototype.minimum;
StatisticalFilter.prototype.dilate = StatisticalFilter.prototype.maximum;


//
//
// private methods
Filters = {
    "median": function( self, im, w, h ) {
        var 
            matRadius=self._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, 
            imageIndices=new A32I(self._indices),
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, j2, x, ty, xOff, yOff, srcOff, 
            rM, gM, bM, r, g, b,
            medianR, medianG, medianB, len, len2,
            isOdd, matArea2=matArea<<1, bx=w-1, by=imArea-w
        ;
        
        rM = []; //new Array(matArea);
        gM = []; //new Array(matArea);
        bM = []; //new Array(matArea);
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (j=0; j<matArea2; j+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[j+1]*=w;
        }
        
        i=0; x=0; ty=0; 
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            rM.length=0; gM.length=0; bM.length=0; 
            j=0; //j2=0;
            while (j < matArea2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2]; 
                    rM.push(r); gM.push(g); bM.push(b);
                }
                j+=2; //j2+=1;
            }
            
            // sort them, this is SLOW, alternative implementation needed
            rM.sort(); gM.sort(); bM.sort();
            len=rM.length; len2=len>>>1;
            medianR= len&1 ? rM[len2] : ~~(0.5*rM[len2-1] + 0.5*rM[len2]);
            //len=gM.length; len2=len>>>1;
            medianG= len&1 ? gM[len2] : ~~(0.5*gM[len2-1] + 0.5*gM[len2]);
            //len=bM.length; len2=len>>>1;
            medianB= len&1 ? bM[len2] : ~~(0.5*bM[len2-1] + 0.5*bM[len2]);
            
            // output
            dst[i] = medianR;  dst[i+1] = medianG;   dst[i+2] = medianB;  
            dst[i+3] = im[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    }
    
    ,"maximum": function( self, im, w, h ) {
        var 
            matRadius=self._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, 
            imageIndices=new A32I(self._indices),
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            matArea2=matArea<<1, bx=w-1, by=imArea-w
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (j=0; j<matArea2; j+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[j+1]*=w;
        }
        
        i=0; x=0; ty=0;
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            rM=0; gM=0; bM=0; 
            j=0;
            while (j < matArea2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r>rM) rM=r; if (g>gM) gM=g; if (b>bM) bM=b;
                }
                j+=2;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM;  dst[i+2] = bM;  dst[i+3] = im[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    }
    
    ,"minimum": function( self, im, w, h ) {
        var 
            matRadius=self._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, 
            imageIndices=new A32I(self._indices),
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            matArea2=matArea<<1, bx=w-1, by=imArea-w
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (j=0; j<matArea2; j+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[j+1]*=w;
        }
        
        i=0; x=0; ty=0;
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            rM=255; gM=255; bM=255; 
            j=0;
            while (j < matArea2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
                j+=2;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    }
};

}(FILTER);/**
*
* Inline Filter(s)
*
* Allows to create an filter on-the-fly using an inline function
*
* @param handler Optional (the filter apply routine)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var HAS = 'hasOwnProperty';

//
//  Inline Filter 
//  used as a placeholder for constructing filters inline with an anonymous function
var InlineFilter = FILTER.InlineFilter = FILTER.Class( FILTER.Filter, {
    name: "InlineFilter"
    
    ,constructor: function InlineFilter( filter, params ) {
        var self = this;
        if ( !(self instanceof InlineFilter) ) return new InlineFilter(filter, params);
        self.$super('constructor');
        self._params = {};
        self.set( filter, params );
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_filter: null
    ,_params: null
    ,_changed: false
    
    ,dispose: function( ) {
        var self = this;
        self._filter = null;
        self._params = null;
        self._changed = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, json;
        json = {
            filter: self.name
            ,_isOn: !!self._isOn
            ,_update: self._update
            
            ,params: {
                 _filter: false === self._filter ? false : (self._changed && self._filter ? self._filter.toString( ) : null)
                ,_params: self._params
            }
        };
        self._changed = false;
        return json;
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            self._update = json._update;
            
            params = json.params;
            
            if ( null != params._filter )
                // using bind makes the code become [native code] and thus unserializable
                // make FILTER namespace accessible to the function code
                self._filter = false === params._filter ? null : new Function( "FILTER", '"use strict"; return ' + params._filter + ';')( FILTER );
            self._params = params._params || {};
        }
        return self;
    }
    
    ,params: function( params ) {
        var self = this;
        if ( arguments.length )
        {
            for (var p in params) if ( params[HAS](p) ) self._params[p] = params[p];
            return self;
        }
        return self._params;
    }
    
    ,set: function( filter, params ) {
        var self = this;
        if ( false === filter )
        {
            self._filter = false;
            self._changed = true;
        }
        else
        {
            if ( "function" === typeof filter )
            {
                self._filter = filter;
                self._changed = true;
            }
            if ( params ) self.params( params );
        }
        return self;
    }
    
    ,_apply: function( im, w, h, image ) {
        var self = this;
        if ( !self._isOn || !self._filter ) return im;
        return self._filter( self._params, im, w, h, image );
    }
        
    ,canRun: function( ) {
        return this._isOn && this._filter;
    }
});
FILTER.CustomFilter = FILTER.InlineFilter;

}(FILTER);
/* main code ends here */
/* export the module */
return FILTER;
});