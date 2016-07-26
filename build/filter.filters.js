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
    ,slice = AP.slice, splice = AP.splice, concat = AP.concat
;

//
// Composite Filter Stack  (a variation of Composite Design Pattern)
var CompositeFilter = FILTER.CompositeFilter = FILTER.Class( FILTER.Filter, {
    name: "CompositeFilter"
    
    ,constructor: function( filters ) { 
        var self = this;
        self.$super('constructor');
        self._stack = ( filters && filters.length ) ? filters.slice( ) : [ ];
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_stack: null
    ,_meta: null
    ,_stable: true
    
    ,dispose: function( withFilters ) {
        var self = this, i, stack = self._stack;
        
        self.$super('dispose');
        
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
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, json = { filter: self.name, _isOn: !!self._isOn, _stable: !!self._stable, filters: [ ] }, i, stack = self._stack;
        for (i=0; i<stack.length; i++)
        {
            json.filters.push( stack[ i ].serialize( ) );
        }
        return json;
    }
    
    ,unserialize: function( json ) {
        var self = this, i, l, ls, filters, filter, stack = self._stack;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            self._stable = !!json._stable;
            
            filters = json.filters || [ ];
            l = filters.length;
            ls = stack.length;
            if ( l !== ls || !self._stable )
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
                    filter = (filters[ i ] && filters[ i ].filter) ? FILTER[ filters[ i ].filter ] : null;
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
            }
            else
            {
                for (i=0; i<l; i++)
                {
                    stack[ i ] = stack[ i ].unserialize( filters[ i ] );
                }
            }
            
            self._stack = stack;
        }
        return self;
    }
    
    ,getMeta: function( ) {
        return this._meta;
    }
    
    ,setMeta: function( meta ) {
        var self = this, stack = self._stack, i, l;
        if ( meta && (l=meta.length) && stack.length )
        {
            for (i=0; i<l; i++) stack[meta[i][0]].setMeta(meta[i][1]);
        }
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
        var args = slice.call(arguments), argslen = args.length;
        if ( argslen )
        {
            this._stack = concat.apply( this._stack, args );
        }
        return this;
    }
    
    ,pop: function( ) {
        return this._stack.pop( );
    }
    
    ,shift: function( ) {
        return this._stack.shift( );
    }
    
    ,unshift: function(/* variable args here.. */) {
        var args = slice.call(arguments), argslen = args.length;
        if ( argslen )
        {
            splice.apply( this._stack, [0, 0].concat( args ) );
        }
        return this;
    }
    
    ,getAt: function( i ) {
        return ( this._stack.length > i ) ? this._stack[ i ] : null;
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
        var self = this/*, cache = {}*/, update = false;
        self.hasMeta = false; self._meta = [];
        if ( self._isOn && self._stack.length )
        {
            var _filterstack = self._stack, _stacklength = _filterstack.length, 
                fi, filter;
                
            for ( fi=0; fi<_stacklength; fi++ )
            {
                filter = _filterstack[fi]; 
                if ( filter && filter._isOn ) 
                {
                    im = filter._apply(im, w, h, image/*, cache*/);
                    update = update || filter._update;
                    if ( filter.hasMeta ) self._meta.push([fi, filter.getMeta()]);
                }
            }
        }
        self._update = update;
        self.hasMeta = self._meta.length > 0;
        return im;
    }
        
    ,canRun: function( ) {
        return this._isOn && this._stack.length;
    }
    
    ,toString: function( ) {
        var tab = arguments.length && arguments[0].substr ? arguments[0] : "  ",
            tab_tab = tab + tab, s = this._stack,
            out = [], i, l = s.length
        ;
        for (i=0; i<l; i++) out.push(s[i].toString(tab_tab));
        return [
             "[FILTER: " + this.name + "]"
             ,"["
             ,"  " + out.join("\n  ")
             ,"]"
             ,""
         ].join("\n");
    }
});
// aliases
CompositeFilter.prototype.empty = CompositeFilter.prototype.reset;
CompositeFilter.prototype.concat = CompositeFilter.prototype.push;

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
var InlineFilter = FILTER.InlineFilter = FILTER.CustomFilter = FILTER.Class( FILTER.Filter, {
    name: "InlineFilter"
    
    ,constructor: function( handler ) {
        var self = this;
        self.$super('constructor');
        // using bind makes the code become [native code] and thus unserializable
        self._handler = handler && ('function' === typeof handler) ? handler : null;
        self._params = {};
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_handler: null
    ,_params: null
    
    ,dispose: function( ) {
        var self = this;
        self.$super('dispose');
        self._handler = null;
        self._params = null;
        return self;
    }
    
    ,params: function( params ) {
        var self = this;
        if ( arguments.length )
        {
            for (var p in params)
            {
                if ( params[HAS](p) ) self._params[p] = params[p];
            }
            return self;
        }
        return self._params;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _handler: self._handler ? self._handler.toString( ) : null
                ,_params: self._params
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._handler = null;
            if ( params._handler )
            {
                // using bind makes the code become [native code] and thus unserializable
                // make FILTER namespace accessible to the function code
                self._handler = new Function( "FILTER", '"use strict"; return ' + params._handler + ';')( FILTER );
            }
            self._params = params._params || {};
        }
        return self;
    }
    
    ,_apply: function( im, w, h, image ) {
        var self = this;
        if ( !self._isOn || !self._handler ) return im;
        return self._handler( self, im, w, h, image );
    }
        
    ,canRun: function( ) {
        return this._isOn && this._handler;
    }
});

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

var Sin = Math.sin, Cos = Math.cos,
    // Color Matrix
    CM = FILTER.Array32F, TypedArray = FILTER.TypedArray,
    toRad = FILTER.CONST.toRad, toDeg = FILTER.CONST.toDeg,
    notSupportClamp = FILTER._notSupportClamp
;

//
//
// ColorMatrixFilter
var ColorMatrixFilter = FILTER.ColorMatrixFilter = FILTER.Class( FILTER.Filter, {
    name: "ColorMatrixFilter"
    
    ,constructor: function( matrix ) {
        var self = this;
        self.$super('constructor');
        if ( matrix && matrix.length )
        {
            self._matrix = new CM(matrix);
        }    
        else
        {
            // identity matrix
            self._matrix = null;
        }
        
        /*if ( FILTER.useWebGL )
        {
            self._webglInstance = FILTER.WebGLColorMatrixFilterInstance || null;
        }*/
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_matrix: null
    ,_webglInstance: null
    
    ,dispose: function( ) {
        var self = this;
        
        self.$super('dispose');
        
        self._webglInstance = null;
        self._matrix = null;
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _matrix: self._matrix
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._matrix = TypedArray( params._matrix, CM );
        }
        return self;
    }
    
    // get the image color channel as a new image
    ,channel: function( ch, asGray ) {
        asGray = ( asGray === undef ) ? false : asGray;
        var f = ( asGray ) ? 1 : 0;
        switch(ch)
        {
            case FILTER.CHANNEL.ALPHA:
                return this.set([
                        0, 0, 0, 1, 0, 
                        0, 0, 0, 1, 0, 
                        0, 0, 0, 1, 0, 
                        0, 0, 0, 0, 255
                    ]);
                break;
            
            case FILTER.CHANNEL.BLUE:
                return this.set([
                        0, 0, f, 0, 0, 
                        0, 0, f, 0, 0, 
                        0, 0, 1, 0, 0, 
                        0, 0, 0, 0, 255
                    ]);
                break;
            
            case FILTER.CHANNEL.GREEN:
                return this.set([
                        0, f, 0, 0, 0, 
                        0, 1, 0, 0, 0, 
                        0, f, 0, 0, 0, 
                        0, 0, 0, 0, 255
                    ]);
                break;
            
            case FILTER.CHANNEL.RED:
            default:
                return this.set([
                        1, 0, 0, 0, 0, 
                        f, 0, 0, 0, 0, 
                        f, 0, 0, 0, 0, 
                        0, 0, 0, 0, 255
                    ]);
                break;
        }
    }
    
    // aliases
    // get the image red channel as a new image
    ,redChannel: function( asGray ) {
        return this.channel(FILTER.CHANNEL.RED, asGray);
    }
    
    // get the image green channel as a new image
    ,greenChannel: function( asGray ) {
        return this.channel(FILTER.CHANNEL.GREEN, asGray);
    }
    
    // get the image blue channel as a new image
    ,blueChannel: function( asGray ) {
        return this.channel(FILTER.CHANNEL.BLUE, asGray);
    }
    
    // get the image alpha channel as a new image
    ,alphaChannel: function( asGray ) {
        return this.channel(FILTER.CHANNEL.ALPHA, true);
    }
    
    ,maskChannel: function( ch ) {
        switch( ch )
        {
            case FILTER.CHANNEL.ALPHA:
                return this;
                break;
            
            case FILTER.CHANNEL.BLUE:
                return this.set([
                    1, 0, 0, 0, 0, 
                    0, 1, 0, 0, 0, 
                    0, 0, 0, 0, 0, 
                    0, 0, 0, 1, 0
                ]);
                break;
            
            case FILTER.CHANNEL.GREEN:
                return this.set([
                    1, 0, 0, 0, 0, 
                    0, 0, 0, 0, 0, 
                    0, 0, 1, 0, 0, 
                    0, 0, 0, 1, 0
                ]);
                break;
            
            case FILTER.CHANNEL.RED:
            default:
                return this.set([
                    0, 0, 0, 0, 0, 
                    0, 1, 0, 0, 0, 
                    0, 0, 1, 0, 0, 
                    0, 0, 0, 1, 0
                ]);
                break;
        }
    }
    
    ,swapChannels: function( ch1, ch2 ) {
        switch( ch1 )
        {
            case FILTER.CHANNEL.ALPHA:
                switch( ch2 )
                {
                    case FILTER.CHANNEL.ALPHA:
                        return this;
                        break;
                    
                    case FILTER.CHANNEL.BLUE:
                        return this.set([
                                1, 0, 0, 0, 0, 
                                0, 1, 0, 0, 0, 
                                0, 0, 0, 1, 0, 
                                0, 0, 1, 0, 0
                            ]);
                        break;
                    
                    case FILTER.CHANNEL.GREEN:
                        return this.set([
                                1, 0, 0, 0, 0, 
                                0, 0, 0, 1, 0, 
                                0, 0, 1, 0, 0, 
                                0, 1, 0, 0, 0
                            ]);
                        break;
                    
                    case FILTER.CHANNEL.RED:
                    default:
                        return this.set([
                                0, 0, 0, 1, 0, 
                                0, 1, 0, 0, 0, 
                                0, 0, 1, 0, 0, 
                                1, 0, 0, 0, 0
                            ]);
                        break;
                }
                break;
            
            case FILTER.CHANNEL.BLUE:
                switch( ch2 )
                {
                    case FILTER.CHANNEL.ALPHA:
                        return this.set([
                                1, 0, 0, 0, 0, 
                                0, 1, 0, 0, 0, 
                                0, 0, 0, 1, 0, 
                                0, 0, 1, 0, 0
                            ]);
                        break;
                    
                    case FILTER.CHANNEL.BLUE:
                        return this;
                        break;
                    
                    case FILTER.CHANNEL.GREEN:
                        return this.set([
                                1, 0, 0, 0, 0, 
                                0, 0, 1, 0, 0, 
                                0, 1, 0, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                        break;
                    
                    case FILTER.CHANNEL.RED:
                    default:
                        return this.set([
                                0, 0, 1, 0, 0, 
                                0, 1, 0, 0, 0, 
                                1, 0, 0, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                        break;
                }
                break;
            
            case FILTER.CHANNEL.GREEN:
                switch( ch2 )
                {
                    case FILTER.CHANNEL.ALPHA:
                        return this.set([
                                1, 0, 0, 0, 0, 
                                0, 0, 0, 1, 0, 
                                0, 0, 1, 0, 0, 
                                0, 1, 0, 0, 0
                            ]);
                        break;
                    
                    case FILTER.CHANNEL.BLUE:
                        return this.set([
                                1, 0, 0, 0, 0, 
                                0, 0, 1, 0, 0, 
                                0, 1, 0, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                        break;
                    
                    case FILTER.CHANNEL.GREEN:
                        return this;
                        break;
                    
                    case FILTER.CHANNEL.RED:
                    default:
                        return this.set([
                                0, 1, 0, 0, 0, 
                                1, 0, 0, 0, 0, 
                                0, 0, 1, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                        break;
                }
                break;
            
            case FILTER.CHANNEL.RED:
            default:
                switch( ch2 )
                {
                    case FILTER.CHANNEL.ALPHA:
                        return this.set([
                                0, 0, 0, 1, 0, 
                                0, 1, 0, 0, 0, 
                                0, 0, 1, 0, 0, 
                                1, 0, 0, 0, 0
                            ]);
                        break;
                    
                    case FILTER.CHANNEL.BLUE:
                        return this.set([
                                0, 0, 1, 0, 0, 
                                0, 1, 0, 0, 0, 
                                1, 0, 0, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                        break;
                    
                    case FILTER.CHANNEL.GREEN:
                        return this.set([
                                0, 1, 0, 0, 0, 
                                1, 0, 0, 0, 0, 
                                0, 0, 1, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                        break;
                    
                    case FILTER.CHANNEL.RED:
                    default:
                        return this;
                        break;
                }
                break;
        }
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,desaturate: function( ) {
        var L = FILTER.LUMA;
        return this.set([
            L[0], L[1], L[2], 0, 0, 
            L[0], L[1], L[2], 0, 0, 
            L[0], L[1], L[2], 0, 0, 
            0, 0, 0, 1, 0
        ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,colorize: function( rgb, amount ) {
        var r, g, b, inv_amount, L = FILTER.LUMA;
        if ( amount === undef ) amount = 1;
        r = (((rgb >> 16) & 255) * 0.0039215686274509803921568627451);  // / 255
        g = (((rgb >> 8) & 255) * 0.0039215686274509803921568627451);  // / 255
        b = ((rgb & 255) * 0.0039215686274509803921568627451);  // / 255
        inv_amount = 1 - amount;
        return this.set([
            (inv_amount + ((amount * r) * L[0])), ((amount * r) * L[1]), ((amount * r) * L[2]), 0, 0, 
            ((amount * g) * L[0]), (inv_amount + ((amount * g) * L[1])), ((amount * g) * L[2]), 0, 0, 
            ((amount * b) * L[0]), ((amount * b) * L[1]), (inv_amount + ((amount * b) * L[2])), 0, 0, 
                0, 0, 0, 1, 0
            ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,invert: function( ) {
        return this.set([
            -1, 0,  0, 0, 255,
            0, -1,  0, 0, 255,
            0,  0, -1, 0, 255,
            0,  0,  0, 1,   0
        ]);
    }
    
    ,invertAlpha: function( ) {
        return this.set([
            1,  0,  0, 0, 0,
            0,  1,  0, 0, 0,
            0,  0,  1, 0, 0,
            0,  0,  0, -1, 255
        ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,saturate: function( s ) {
        var sInv, irlum, iglum, iblum, L = FILTER.LUMA;
        sInv = 1 - s;  irlum = sInv * L[0];
        iglum = sInv * L[1];  iblum = sInv * L[2];
        return this.set([
            (irlum + s), iglum, iblum, 0, 0, 
            irlum, (iglum + s), iblum, 0, 0, 
            irlum, iglum, (iblum + s), 0, 0, 
            0, 0, 0, 1, 0
        ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,contrast: function( r, g, b ) {
        if ( g === undef )  g = r;
        if ( b === undef )  b = r;
        r += 1.0; g += 1.0; b += 1.0;
        return this.set([
            r, 0, 0, 0, (128 * (1 - r)), 
            0, g, 0, 0, (128 * (1 - g)), 
            0, 0, b, 0, (128 * (1 - b)), 
            0, 0, 0, 1, 0
        ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,brightness: function( r, g, b ) {
        if ( g === undef )  g = r;
        if ( b === undef )  b = r;
        return this.set([
            1, 0, 0, 0, r, 
            0, 1, 0, 0, g, 
            0, 0, 1, 0, b, 
            0, 0, 0, 1, 0
        ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,adjustHue: function( degrees ) {
        degrees *= toRad;
        var cos = Cos(degrees), sin = Sin(degrees), L = FILTER.LUMA;
        return this.set([
            ((L[0] + (cos * (1 - L[0]))) + (sin * -(L[0]))), ((L[1] + (cos * -(L[1]))) + (sin * -(L[1]))), ((L[2] + (cos * -(L[2]))) + (sin * (1 - L[2]))), 0, 0, 
            ((L[0] + (cos * -(L[0]))) + (sin * 0.143)), ((L[1] + (cos * (1 - L[1]))) + (sin * 0.14)), ((L[2] + (cos * -(L[2]))) + (sin * -0.283)), 0, 0, 
            ((L[0] + (cos * -(L[0]))) + (sin * -((1 - L[0])))), ((L[1] + (cos * -(L[1]))) + (sin * L[1])), ((L[2] + (cos * (1 - L[2]))) + (sin * L[2])), 0, 0, 
            0, 0, 0, 1, 0
        ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,average: function( r, g, b ) {
        if ( r === undef ) r = 0.3333;
        if ( g === undef ) g = 0.3333;
        if ( b === undef ) b = 0.3334;
        return this.set([
            r, g, b, 0, 0, 
            r, g, b, 0, 0, 
            r, g, b, 0, 0, 
            0, 0, 0, 1, 0
        ]);
    }
    
    ,quickContrastCorrection: function( contrast ) {
        if ( contrast === undef ) contrast = 1.2;
        return this.set([
            contrast, 0, 0, 0, 0, 
            0, contrast, 0, 0, 0, 
            0, 0, contrast, 0, 0, 
            0, 0, 0, 1, 0
        ]);
    }
    
    // adapted from glfx.js
    // Gives the image a reddish-brown monochrome tint that imitates an old photograph.
    // 0 to 1 (0 for no effect, 1 for full sepia coloring)
    ,sepia: function( amount ) {
        if ( amount === undef ) amount = 0.5;
        if ( amount > 1 ) amount = 1;
        else if ( amount < 0 ) amount = 0;
        return this.set([
            1.0 - (0.607 * amount), 0.769 * amount, 0.189 * amount, 0, 0, 
            0.349 * amount, 1.0 - (0.314 * amount), 0.168 * amount, 0, 0, 
            0.272 * amount, 0.534 * amount, 1.0 - (0.869 * amount), 0, 0, 
            0, 0, 0, 1, 0
        ]);
    }
    
    ,sepia2: function( amount ) {
        if ( amount === undef ) amount = 10;
        if ( amount > 100 ) amount = 100;
        amount *= 2.55;
        var L = FILTER.LUMA;
        return this.set([
            L[0], L[1], L[2], 0, 40, 
            L[0], L[1], L[2], 0, 20, 
            L[0], L[1], L[2], 0, -amount, 
            0, 0, 0, 1, 0
        ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,threshold: function( threshold, factor ) {
        if ( factor === undef )  factor = 256;
        var L = FILTER.LUMA;
        return this.set([
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
            0, 0, 0, 1, 0
        ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,threshold_rgb: function( threshold, factor ) {
        if ( factor === undef )  factor = 256;
        return this.set([
            factor, 0, 0, 0, (-(factor-1) * threshold), 
            0, factor, 0, 0, (-(factor-1) * threshold), 
            0,  0, factor, 0, (-(factor-1) * threshold), 
            0, 0, 0, 1, 0
        ]);
    }
    
    ,threshold_alpha: function( threshold, factor ) {
        if ( threshold === undef )  threshold = 0.5;
        if ( factor === undef ) factor = 256;
        return this.set([
            1, 0, 0, 0, 0, 
            0, 1, 0, 0, 0, 
            0, 0, 1, 0, 0, 
            0, 0, 0, factor, (-factor * threshold)
        ]);
    }
    
    // RGB to YCbCr
    ,RGB2YCbCr: function( ) {
        return this.set([
            0.5, -0.418688, -0.081312, 0, 128,  // Cr component in RED channel
            0.299, 0.587, 0.114, 0, 0,   // Y component in GREEN channel
            -0.168736, -0.331264, 0.5, 0, 128,  // Cb component in BLUE channel
            0, 0, 0, 1, 0
        ]);
    }
    
    // YCbCr to RGB
    ,YCbCr2RGB: function( ) {
        return this.set([
            1.402, 1, 0, 0, -179.456,  
            -0.71414, 1, -0.34414, 0, 135.45984,
            0, 1, 1.772, 0, -226.816,
            0, 0, 0, 1, 0
        ]);
    }
    
    // blend with another filter
    ,blend: function( filt, amount ) {
        this._matrix = ( this._matrix ) ? CMblend(this._matrix, filt.getMatrix(), amount) : new CM(filt.getMatrix());
        return this;
    }
    
    ,set: function( mat ) {
        this._matrix = this._matrix ? CMconcat(this._matrix, new CM(mat)) : new CM(mat);
        return this;
    }
    
    ,reset: function( ) {
        this._matrix = null; 
        return this;
    }
    
    ,combineWith: function( filt ) {
        return this.set( filt.getMatrix() );
    }
    
    ,getMatrix: function( ) {
        return this._matrix;
    }
    
    ,setMatrix: function( m ) {
        this._matrix = new CM(m); 
        return this;
    }
    
    // used for internal purposes
    ,_apply: notSupportClamp
    ? function(p, w, h/*, image*/) {
        var self = this;
        if ( self._isOn && self._matrix )
        {
            var pl = p.length, m = self._matrix,
                i, rem = (pl>>2)%4,
                p0, p1, p2, p3, 
                p4, p5, p6, p7, 
                p8, p9, p10, p11,
                p12, p13, p14, p15,
                t0, t1, t2, t3
            ;
            
            // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
            // linearize array
            // partial loop unrolling (quarter iterations)
            for (i=0; i<pl; i+=16)
            {
                t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = p[i+4]; t1 = p[i+5]; t2 = p[i+6]; t3 = p[i+7];
                p4  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p5  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p6  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p7  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = p[i+8]; t1 = p[i+9]; t2 = p[i+10]; t3 = p[i+11];
                p8  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p9  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p10  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p11  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = p[i+12]; t1 = p[i+13]; t2 = p[i+14]; t3 = p[i+15];
                p12  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p13  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p14  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p15  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                // clamp them manually
                p0 = (p0<0) ? 0 : ((p0>255) ? 255 : p0);
                p1 = (p1<0) ? 0 : ((p1>255) ? 255 : p1);
                p2 = (p2<0) ? 0 : ((p2>255) ? 255 : p2);
                p3 = (p3<0) ? 0 : ((p3>255) ? 255 : p3);
                p4 = (p4<0) ? 0 : ((p4>255) ? 255 : p4);
                p5 = (p5<0) ? 0 : ((p5>255) ? 255 : p5);
                p6 = (p6<0) ? 0 : ((p6>255) ? 255 : p6);
                p7 = (p7<0) ? 0 : ((p7>255) ? 255 : p7);
                p8 = (p8<0) ? 0 : ((p8>255) ? 255 : p8);
                p9 = (p9<0) ? 0 : ((p9>255) ? 255 : p9);
                p10 = (p10<0) ? 0 : ((p10>255) ? 255 : p10);
                p11 = (p11<0) ? 0 : ((p11>255) ? 255 : p11);
                p12 = (p12<0) ? 0 : ((p12>255) ? 255 : p12);
                p13 = (p13<0) ? 0 : ((p13>255) ? 255 : p13);
                p14 = (p14<0) ? 0 : ((p14>255) ? 255 : p14);
                p15 = (p15<0) ? 0 : ((p15>255) ? 255 : p15);
                
                p[i   ] = ~~p0;  p[i+1 ] = ~~p1;  p[i+2 ] = ~~p2;  p[i+3 ] = ~~p3;
                p[i+4 ] = ~~p4;  p[i+5 ] = ~~p5;  p[i+6 ] = ~~p6;  p[i+7 ] = ~~p7;
                p[i+8 ] = ~~p8;  p[i+9 ] = ~~p9;  p[i+10] = ~~p10; p[i+11] = ~~p11;
                p[i+12] = ~~p12; p[i+13] = ~~p13; p[i+14] = ~~p14; p[i+15] = ~~p15;
            }
            
            // loop unrolling remainder
            if (rem)
            {
                rem <<= 2;
                for (i=pl-rem; i<pl; i+=4)
                {
                    t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                    p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                    p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                    p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                    p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                    
                    // clamp them manually
                    p0 = (p0<0) ? 0 : ((p0>255) ? 255 : p0);
                    p1 = (p1<0) ? 0 : ((p1>255) ? 255 : p1);
                    p2 = (p2<0) ? 0 : ((p2>255) ? 255 : p2);
                    p3 = (p3<0) ? 0 : ((p3>255) ? 255 : p3);
                    
                    p[i] = ~~p0; p[i+1] = ~~p1; p[i+2] = ~~p2; p[i+3] = ~~p3;
                }
            }
        }
        return p;
    }
    : function(p, w, h/*, image*/) {
        var self = this;
        if ( self._isOn && self._matrix )
        {
            var pl = p.length, m = self._matrix,
                i, rem = (pl>>2)%4,
                p0, p1, p2, p3, 
                p4, p5, p6, p7, 
                p8, p9, p10, p11,
                p12, p13, p14, p15,
                t0, t1, t2, t3
            ;
            
            // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
            // linearize array
            // partial loop unrolling (quarter iterations)
            for (i=0; i<pl; i+=16)
            {
                t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = p[i+4]; t1 = p[i+5]; t2 = p[i+6]; t3 = p[i+7];
                p4  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p5  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p6  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p7  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = p[i+8]; t1 = p[i+9]; t2 = p[i+10]; t3 = p[i+11];
                p8  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p9  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p10  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p11  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = p[i+12]; t1 = p[i+13]; t2 = p[i+14]; t3 = p[i+15];
                p12  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p13  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p14  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p15  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                p[i   ] = ~~p0;  p[i+1 ] = ~~p1;  p[i+2 ] = ~~p2;  p[i+3 ] = ~~p3;
                p[i+4 ] = ~~p4;  p[i+5 ] = ~~p5;  p[i+6 ] = ~~p6;  p[i+7 ] = ~~p7;
                p[i+8 ] = ~~p8;  p[i+9 ] = ~~p9;  p[i+10] = ~~p10; p[i+11] = ~~p11;
                p[i+12] = ~~p12; p[i+13] = ~~p13; p[i+14] = ~~p14; p[i+15] = ~~p15;
            }
            
            // loop unrolling remainder
            if (rem)
            {
                rem <<= 2;
                for (i=pl-rem; i<pl; i+=4)
                {
                    t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                    p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                    p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                    p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                    p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                    
                    p[i] = ~~p0; p[i+1] = ~~p1; p[i+2] = ~~p2; p[i+3] = ~~p3;
                }
            }
        }
        return p;
    }
        
    ,canRun: function( ) {
        return this._isOn && this._matrix;
    }
});
// aliases
ColorMatrixFilter.prototype.grayscale = ColorMatrixFilter.prototype.desaturate;
ColorMatrixFilter.prototype.rotateHue = ColorMatrixFilter.prototype.adjustHue;
ColorMatrixFilter.prototype.thresholdRgb = ColorMatrixFilter.prototype.threshold_rgb;
ColorMatrixFilter.prototype.thresholdAlpha = ColorMatrixFilter.prototype.threshold_alpha;

//
//
// private methods
function eye()
{
    return new CM([
        1,0,0,0,0,
        0,1,0,0,0,
        0,0,1,0,0,
        0,0,0,1,0
    ]);
}
 
 // concatenate 2 Color Matrices (kind of Color Matrix multiplication)
 function CMconcat(tm, mat) 
 {
    var t=new CM(20), m0, m1, m2, m3, m4;
    
    // unroll the loop completely
    // i=0
    m0=mat[0]; m1=mat[1]; m2=mat[2]; m3=mat[3]; m4=mat[4];
    t[ 0 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
    t[ 1 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
    t[ 2 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
    t[ 3 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
    t[ 4 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;

    // i=5
    m0=mat[5]; m1=mat[6]; m2=mat[7]; m3=mat[8]; m4=mat[9];
    t[ 5 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
    t[ 6 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
    t[ 7 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
    t[ 8 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
    t[ 9 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;
    
    // i=10
    m0=mat[10]; m1=mat[11]; m2=mat[12]; m3=mat[13]; m4=mat[14];
    t[ 10 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
    t[ 11 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
    t[ 12 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
    t[ 13 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
    t[ 14 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;
    
    // i=15
    m0=mat[15]; m1=mat[16]; m2=mat[17]; m3=mat[18]; m4=mat[19];
    t[ 15 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
    t[ 16 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
    t[ 17 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
    t[ 18 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
    t[ 19 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;
    
    return t;
}

function CMblend(m1, m2, amount)
{
    var m=new CM(20);
    
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

ColorMatrixFilter.multiply = CMconcat;
ColorMatrixFilter.blend = CMblend;
ColorMatrixFilter.eye = eye;

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
var CT = FILTER.ImArrayCopy, clamp = FILTER.Color.clampPixel,
    TypedArray = FILTER.TypedArray,
    eye = function( ) {
        var t=new CT(256), i;
        for(i=0; i<256; i++) t[i]=i;
        return t;
    },

    inv_eye = function( ) {
        var t=new CT(256), i;
        for(i=0; i<256; i++) t[i]=255-i;
        return t;
    },

    val = function(col) {
        var t=new CT(256), i;
        for(i=0; i<256; i++) t[i]=col;
        return t;
    },
    
    clone = function(t) {
        if (t) return new CT(t);
        return null;
    },
    
    Power = Math.pow, Exponential = Math.exp, nF = 1.0/255
;

//
//
// TableLookupFilter
var TableLookupFilter = FILTER.TableLookupFilter = FILTER.Class( FILTER.Filter, {
    name: "TableLookupFilter"
    
    ,constructor: function( tR, tG, tB, tA ) {
        var self = this;
        self.$super('constructor');
        self._tableR = tR || null;
        self._tableG = tG || self._tableR;
        self._tableB = tB || self._tableG;
        self._tableA = tA || null;
    }
    
    ,path: FILTER_FILTERS_PATH
    // parameters
    ,_tableR: null
    ,_tableG: null
    ,_tableB: null
    ,_tableA: null
    
    ,dispose: function( ) {
        var self = this;
        
        self.$super('dispose');
        
        self._tableR = null;
        self._tableG = null;
        self._tableB = null;
        self._tableA = null;
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _tableR: self._tableR
                ,_tableG: self._tableG
                ,_tableB: self._tableB
                ,_tableA: self._tableA
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._tableR = TypedArray(params._tableR, CT);
            self._tableG = TypedArray(params._tableG, CT);
            self._tableB = TypedArray(params._tableB, CT);
            self._tableA = TypedArray(params._tableA, CT);
        }
        return self;
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
        thresholdR=thresholdR || 0.5;
        thresholdG=thresholdG || thresholdR;
        thresholdB=thresholdB || thresholdG;
        return this.thresholds([thresholdR], [thresholdG], [thresholdB]);
    }
    
    ,quantize: function( numLevels ) {
        if ( numLevels === undef ) numLevels=64;
        if (numLevels<2) numLevels=2;

        var t=new CT(256), q=new CT(numLevels), i, nL=255/(numLevels-1), nR=numLevels/256;
        i=0; while (i<numLevels) { q[i] = ~~(nL * i); i++; }
        for(i=0; i<256; i++) { t[i] = clamp(q[ ~~(nR * i) ]); }
        return this.set(t);
    }
    
    ,binarize: function( ) {
        return this.quantize(2);
    }
    
    ,channel: function( channel ) {
        if ( null == channel ) return this;
        var tR, tG, tB;
        switch(channel)
        {
            case FILTER.CHANNEL.BLUE: 
                tR = val(0); tG = val(0); tB = eye(); 
                break;
            
            case FILTER.CHANNEL.GREEN: 
                tR = val(0); tG = eye(); tB = val(0); 
                break;
            
            case FILTER.CHANNEL.RED: 
            default:
                tR = eye(); tG = val(0); tB = val(0); 
                break;
            
        }
        return this.set(tR, tG, tB);
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,solarize: function( threshold ) {
        if ( threshold === undef ) threshold=0.5;
        
        var i=0, t=new CT(256)
            ,q, c, n=2/255
        ;
        
        for(i=0; i<256; i++)
        { 
            q = n*i; 
            c = (q>threshold) ? (255-255*q) : (255*q-255); 
            t[i] = ~~(clamp( c ));
        }
        return this.set(t);
    }
    
    ,solarize2: function( threshold ) {
        if ( threshold === undef ) threshold=0.5;
        threshold=1-threshold;
        var i=0, t=new CT(256)
            ,q, c, n=2/255
        ;
        
        for(i=0; i<256; i++)
        { 
            q = n*i; 
            c = (q<threshold) ? (255-255*q) : (255*q-255); 
            t[i] = ~~(clamp( c ));
        }
        return this.set(t);
    }
    
    ,solarizeInverse: function( threshold ) {
        if ( threshold === undef ) threshold=0.5;
        threshold*=256; 
        
        var i=0, t=new CT(256);
        for(i=0; i<256; i++)
        { 
            t[i] = (i>threshold) ? 255-i : i; 
        }
        return this.set(t);
    }
    
    ,invert: function( ) {
        return this.set(inv_eye());
    }
    
    // apply a binary mask to the image color channels
    ,mask: function( mask ) {
        var i=0, maskR=(mask>>16)&255, maskG=(mask>>8)&255, maskB=mask&255;
            tR=new CT(256), tG=new CT(256), tB=new CT(256)
            ;
        for(i=0; i<256; i++)
        { 
            tR[i]=clamp(i & maskR); 
            tG[i]=clamp(i & maskG); 
            tB[i]=clamp(i & maskB); 
        }
        return this.set(tR, tG, tB);
    }
    
    // replace a color with another
    ,replace: function( color, replacecolor ) {
        if (color==replacecolor) return this;
        var  
            c1R=(color>>16)&255, c1G=(color>>8)&255, c1B=(color)&255, 
            c2R=(replacecolor>>16)&255, c2G=(replacecolor>>8)&255, c2B=(replacecolor)&255, 
            tR=eye(), tG=eye(), tB=eye()
            ;
            tR[c1R]=c2R; tG[c1G]=c2G; tB[c1B]=c2B;
        return this.set(tR, tG, tB);
    }
    
    // extract a range of color values from a specific color channel and set the rest to background color
    ,extract: function( channel, range, background ) {
        if (!range || !range.length) return this;
        
        background=background||0;
        var  
            bR=(background>>16)&255, bG=(background>>8)&255, bB=(background)&255, 
            tR=val(bR), tG=val(bG), tB=val(bB),
            s, f
            ;
        switch(channel)
        {
            case FILTER.CHANNEL.BLUE: 
                s=range[0]; f=range[1];
                while (s<=f) { tB[s]=clamp(s); s++; }
                break;
            
            case FILTER.CHANNEL.GREEN: 
                s=range[0]; f=range[1];
                while (s<=f) { tG[s]=clamp(s); s++; }
                break;
            
            case FILTER.CHANNEL.RED: 
            default:
                s=range[0]; f=range[1];
                while (s<=f) { tR[s]=clamp(s); s++; }
                break;
            
        }
        return this.set(tR, tG, tB);
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,gammaCorrection: function( gammaR, gammaG, gammaB ) {
        gammaR=gammaR || 1;
        gammaG=gammaG || gammaR;
        gammaB=gammaB || gammaG;
        
        // gamma correction uses inverse gamma
        gammaR=1.0/gammaR; gammaG=1.0/gammaG; gammaB=1.0/gammaB;
        
        var tR=new CT(256), tG=new CT(256), tB=new CT(256), i=0;
        for(i=0; i<256; i++)
        { 
            tR[i]=clamp(~~(255*Power(nF*i, gammaR))); 
            tG[i]=clamp(~~(255*Power(nF*i, gammaG))); 
            tB[i]=clamp(~~(255*Power(nF*i, gammaB)));  
        }
        return this.set(tR, tG, tB);
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,exposure: function( exposure ) {
        if ( exposure === undef ) exposure=1;
        var i=0, t=new CT(256);
        for(i=0; i<256; i++)
        { 
            t[i]=clamp(~~(255 * (1 - Exponential(-exposure * i *nF)))); 
        }
        return this.set(t);
    }
    
    ,set: function( _tR, _tG, _tB, _tA ) {
        if ( !_tR ) return this;
        
        _tG=_tG || _tR; _tB=_tB || _tG;
        var 
            tR=this._tableR || eye(), tG, tB, tA,
            tR2=clone(tR), tG2, tB2, tA2,
            i;
        
        if (_tG && _tB)
        {
            tG=this._tableG || clone(tR); tB=this._tableB || clone(tG);
            tG2=clone(tG); tB2=clone(tB);
            // concat/compose the filter's tables, same as composing the filters
            for(i=0; i<256; i++)
            { 
                tR[i]=clamp( _tR[clamp( tR2[i] )] ); 
                tG[i]=clamp( _tG[clamp( tG2[i] )] ); 
                tB[i]=clamp( _tB[clamp( tB2[i] )] ); 
            }
            this._tableR=tR; this._tableG=tG; this._tableB=tB;
        }
        else
        {
            // concat/compose the filter's tables, same as composing the filters
            for(i=0; i<256; i++)
            { 
                tR[i]=clamp( _tR[clamp( tR2[i] )] ); 
            }
            this._tableR=tR; this._tableG=this._tableR; this._tableB=this._tableR;
        }
        
        return this;
    }
    
    ,reset: function( ) {
        this._tableR = this._tableG = this._tableB = this._tableA = null; 
        return this;
    }
    
    ,combineWith: function( filt ) {
        return this.set(filt.getTable(0), filt.getTable(1), filt.getTable(2));
    }
    
    ,getTable: function ( channel ) {
        channel = channel || FILTER.CHANNEL.RED;
        switch (channel)
        {
            case FILTER.CHANNEL.ALPHA: return this._tableA;
            case FILTER.CHANNEL.BLUE: return this._tableB;
            case FILTER.CHANNEL.GREEN: return this._tableG;
            case FILTER.CHANNEL.RED: 
            default: return this._tableR;
        }
    }
    
    ,setTable: function ( table, channel ) {
        channel = channel || FILTER.CHANNEL.RED;
        switch (channel)
        {
            case FILTER.CHANNEL.ALPHA: this._tableA=table; return this;
            case FILTER.CHANNEL.BLUE: this._tableB=table; return this;
            case FILTER.CHANNEL.GREEN: this._tableG=table; return this;
            case FILTER.CHANNEL.RED: 
            default: this._tableR=table; return this;
        }
    }
    
    // used for internal purposes
    ,_apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !self._tableR ) return im;
        
        var l=im.length, rem = (l>>2)%4,
            i, r, g, b, a,
            tR=self._tableR, tG=self._tableG, tB=self._tableB, tA=self._tableA;
        
        // apply filter (algorithm implemented directly based on filter definition)
        if ( tA )
        {
            // array linearization
            // partial loop unrolling (quarter iterations)
            for ( i=0; i<l; i+=16 )
            {
                r = im[i]; g = im[i+1]; b = im[i+2]; a = im[i+3];
                im[i] = tR[r]; im[i+1] = tG[g]; im[i+2] = tB[b]; im[i+3] = tA[a];
                r = im[i+4]; g = im[i+5]; b = im[i+6]; a = im[i+7];
                im[i+4] = tR[r]; im[i+5] = tG[g]; im[i+6] = tB[b]; im[i+7] = tA[a];
                r = im[i+8]; g = im[i+9]; b = im[i+10]; a = im[i+11];
                im[i+8] = tR[r]; im[i+9] = tG[g]; im[i+10] = tB[b]; im[i+11] = tA[a];
                r = im[i+12]; g = im[i+13]; b = im[i+14]; a = im[i+15];
                im[i+12] = tR[r]; im[i+13] = tG[g]; im[i+14] = tB[b]; im[i+15] = tA[a];
            }
            
            // loop unrolling remainder
            if ( rem )
            {
                rem <<= 2;
                for (i=l-rem; i<l; i+=4)
                {
                    r = im[i]; g = im[i+1]; b = im[i+2]; a = im[i+3];
                    im[i] = tR[r]; im[i+1] = tG[g]; im[i+2] = tB[b]; im[i+3] = tA[a];
                }
            }
        }
        else
        {
            // array linearization
            // partial loop unrolling (quarter iterations)
            for (i=0; i<l; i+=16)
            {
                r = im[i]; g = im[i+1]; b = im[i+2];
                im[i] = tR[r]; im[i+1] = tG[g]; im[i+2] = tB[b];
                r = im[i+4]; g = im[i+5]; b = im[i+6];
                im[i+4] = tR[r]; im[i+5] = tG[g]; im[i+6] = tB[b];
                r = im[i+8]; g = im[i+9]; b = im[i+10];
                im[i+8] = tR[r]; im[i+9] = tG[g]; im[i+10] = tB[b];
                r = im[i+12]; g = im[i+13]; b = im[i+14];
                im[i+12] = tR[r]; im[i+13] = tG[g]; im[i+14] = tB[b];
            }
            
            // loop unrolling remainder
            if ( rem )
            {
                rem <<= 2;
                for (i=l-rem; i<l; i+=4)
                {
                    r = im[i]; g = im[i+1]; b = im[i+2];
                    im[i] = tR[r]; im[i+1] = tG[g]; im[i+2] = tB[b];
                }
            }
        }
        return im;
    }
        
    ,canRun: function( ) {
        return this._isOn && this._tableR;
    }
});
// aliases
TableLookupFilter.prototype.posterize = TableLookupFilter.prototype.levels = TableLookupFilter.prototype.quantize;

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

var IMG = FILTER.ImArray, IMGcopy = FILTER.ImArrayCopy, TypedArray = FILTER.TypedArray,
    MODE = FILTER.MODE, A16I = FILTER.Array16I, Min = Math.min, Max = Math.max, Floor = Math.floor
;

//
//
// DisplacementMapFilter
var DisplacementMapFilter = FILTER.DisplacementMapFilter = FILTER.Class( FILTER.Filter, {
    name: "DisplacementMapFilter"
    
    ,constructor: function( displacemap ) {
        var self = this;
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
    ,red: 0
    ,green: 0
    ,blue: 0
    ,alpha: 0
    ,mode: MODE.CLAMP
    
    ,dispose: function( ) {
        var self = this;
        
        self.$super('dispose');
        
        self._map = null;
        self.map = null;
        self.scaleX = null;
        self.scaleY = null;
        self.startX = null;
        self.startY = null;
        self.componentX = null;
        self.componentY = null;
        self.color = null;
        self.red = null;
        self.green = null;
        self.blue = null;
        self.alpha = null;
        self.mode = null;
        
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
                ,red: self.red
                ,green: self.green
                ,blue: self.blue
                ,alpha: self.alpha
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
            self.red = params.red;
            self.green = params.green;
            self.blue = params.blue;
            self.alpha = params.alpha;
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
    
    ,setColor: function( c ) {
        var self = this;
        self.color = c;
        self.alpha = (c >> 24) & 255; 
        self.red = (c >> 16) & 255; 
        self.green = (c >> 8) & 255; 
        self.blue = c & 255;
        return self;
    }
    
    // used for internal purposes
    ,_apply: function( im, w, h/*, image*/ ) {
        var self = this, Map = self.map;
        if ( !self._isOn || !(Map || self._map) ) return im;
        
        //self._map = self._map || { data: Map.getData( ), width: Map.width, height: Map.height };
        
        var _map = self._map || { data: Map.getData( ), width: Map.width, height: Map.height },
            map, mapW, mapH, mapArea, displace, ww, hh,
            sx = self.scaleX*0.00390625, sy = self.scaleY*0.00390625, 
            comx = self.componentX, comy = self.componentY, 
            alpha = self.alpha, red = self.red, 
            green = self.green, blue = self.blue, mode = self.mode,
            sty, stx, styw, bx0, by0, bx, by,
            i, j, k, x, y, ty, ty2, yy, xx, mapOff, dstOff, srcOff,
            applyArea, imArea, imLen, imcopy, srcx, srcy,
            _Ignore = MODE.IGNORE, _Clamp = MODE.CLAMP, _Color = MODE.COLOR, _Wrap = MODE.WRAP
        ;
        
        map = _map.data;
        mapW = _map.width; mapH = _map.height; 
        mapArea = (map.length>>2); ww = Min(mapW, w); hh = Min(mapH, h);
        imLen = im.length; applyArea = (ww*hh)<<2; imArea = (imLen>>2);
        
        // make start relative
        stx = Floor(self.startX*(w-1));
        sty = Floor(self.startY*(h-1));
        styw = sty*w;
        bx0 = -stx; by0 = -sty; bx = w-stx-1; by = h-sty-1;
        
        displace = new A16I(mapArea<<1);
        imcopy = new IMGcopy(im);
        
        // pre-compute indices, 
        // reduce redundant computations inside the main application loop (faster)
        // this is faster if mapArea <= imArea, else a reverse algorithm may be needed (todo)
        j=0; x=0; y=0; ty=0;
        for (i=0; i<mapArea; i++, j+=2, x++)
        { 
            if (x>=mapW) { x=0; y++; ty+=mapW; }
            mapOff = (x + ty)<<2;
            displace[j] = Floor( ( map[mapOff+comx] - 128 ) * sx ); 
            displace[j+1] = Floor( ( map[mapOff+comy] - 128 ) * sy );
        } 
        
        // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
        x=0; y=0; ty=0; ty2=0;
        for (i=0; i<applyArea; i+=4, x++)
        {
            // update image coordinates
            if (x>=ww) { x=0; y++; ty+=w; ty2+=mapW; }
            
            // if inside the application area
            if (y<by0 || y>by || x<bx0 || x>bx) continue;
            
            xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;  
            
            j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];
            
            if (srcy>=h || srcy<0 || srcx>=w || srcx<0)
            {
                if (mode == _Ignore) 
                {
                    continue;
                }
                
                else if (mode == _Color)
                {
                    im[dstOff] = red;  im[dstOff+1] = green;
                    im[dstOff+2] = blue;  im[dstOff+3] = alpha;
                    continue;
                }
                    
                else if (mode == _Wrap)
                {
                    if (srcy>by) srcy-=h;
                    else if (srcy<0) srcy+=h;
                    if (srcx>bx) srcx-=w;
                    else if (srcx<0)  srcx+=w;
                }
                    
                else
                {
                    if (srcy>by)  srcy=by;
                    else if (srcy<0) srcy=0;
                    if (srcx>bx) srcx=bx;
                    else if (srcx<0) srcx=0;
                }
            }
            srcOff = (srcx + srcy*w)<<2;
            // new pixel values
            im[dstOff] = imcopy[srcOff];   im[dstOff+1] = imcopy[srcOff+1];
            im[dstOff+2] = imcopy[srcOff+2];  im[dstOff+3] = imcopy[srcOff+3];
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

var IMG = FILTER.ImArray, IMGcopy = FILTER.ImArrayCopy, TypedArray = FILTER.TypedArray,
    PI = FILTER.CONST.PI, DoublePI = FILTER.CONST.PI2, HalfPI = FILTER.CONST.PI_2,
    MODE = FILTER.MODE, toRad = FILTER.CONST.toRad, ThreePI2 = 1.5 * PI,
    Sqrt = Math.sqrt, Atan2 = Math.atan2, Atan = Math.atan,
    Sin = Math.sin, Cos = Math.cos, 
    Floor = Math.floor, Round = Math.round, //Ceil=Math.ceil,
    Asin = Math.asin, Tan = Math.tan, Abs = Math.abs, Max = Math.max,
    Maps
;


//
//
// GeometricMapFilter
var GeometricMapFilter = FILTER.GeometricMapFilter = FILTER.Class( FILTER.Filter, {
    name: "GeometricMapFilter"
    
    ,constructor: function( inverseTransform ) {
        var self = this;
        self.$super('constructor');
        if ( inverseTransform ) self.generic( inverseTransform );
    }
    
    ,path: FILTER_FILTERS_PATH
    // parameters
    ,_map: null
    ,_mapName: null
    
    ,inverseTransform: null
    ,matrix: null
    ,centerX: 0
    ,centerY: 0
    ,dx: 0
    ,dy: 0
    ,angle: 0
    ,radius: 0
    ,wavelength: 0
    ,amplitude: 0
    ,phase: 0
    ,xAmplitude: 0
    ,yAmplitude: 0
    ,xWavelength: 0
    ,yWavelength: 0
    ,mode: MODE.CLAMP
    
    ,dispose: function( ) {
        var self = this;
        
        self.$super('dispose');
        
        self._map = null;
        self._mapName = null;
        
        self.inverseTransform = null;
        self.matrix = null;
        self.centerX = null;
        self.centerY = null;
        self.dx = null;
        self.dy = null;
        self.angle = null;
        self.radius = null;
        self.wavelength = null;
        self.amplitude = null;
        self.phase = null;
        self.xAmplitude = null;
        self.yAmplitude = null;
        self.xWavelength = null;
        self.yWavelength = null;
        self.mode = null;
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _mapName: self._mapName
                ,inverseTransform: self.inverseTransform ? self.inverseTransform.toString( ) : null
                ,matrix: self.matrix
                ,centerX: self.centerX
                ,centerY: self.centerY
                ,dx: self.dx
                ,dy: self.dy
                ,angle: self.angle
                ,radius: self.radius
                ,wavelength: self.wavelength
                ,amplitude: self.amplitude
                ,phase: self.phase
                ,xAmplitude: self.xAmplitude
                ,yAmplitude: self.yAmplitude
                ,xWavelength: self.xWavelength
                ,yWavelength: self.yWavelength
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
            
            self.inverseTransform = null;
            
            self.matrix = TypedArray( params.matrix, Array );
            self.centerX = params.centerX;
            self.centerY = params.centerY;
            self.dx = params.dx;
            self.dy = params.dy;
            self.angle = params.angle;
            self.radius = params.radius;
            self.wavelength = params.wavelength;
            self.amplitude = params.amplitude;
            self.phase = params.phase;
            self.xAmplitude = params.xAmplitude;
            self.yAmplitude = params.yAmplitude;
            self.xWavelength = params.xWavelength;
            self.yWavelength = params.yWavelength;
            self.mode = params.mode;
            
            if ( params.inverseTransform )
            {
                // using bind makes the code become [native code] and thus unserializable
                self.inverseTransform = new Function("FILTER", '"use strict"; return ' + params.inverseTransform)( FILTER );
            }
            
            self._mapName = params._mapName;
            self._map = null;
            if ( self._mapName && Maps[ self._mapName ] )
                self._map = Maps[ self._mapName ];
        }
        return self;
    }
    
    ,generic: function( inverseTransform ) {
        var self = this;
        if ( inverseTransform )
        {
            self.inverseTransform = inverseTransform;
            self._mapName = "generic"; 
            self._map = Maps.generic; 
        }
        return self;
    }
    
    ,affine: function( matrix ) {
        var self = this;
        if ( matrix )
        {
            self.matrix = matrix; 
            self._mapName = "affine";  
            self._map = Maps.affine; 
        }
        return self;
    }
    
    ,flipX: function( ) {
        var self = this;
        self._mapName = "flipX";  
        self._map = Maps.flipX; 
        return self;
    }
    
    ,flipY: function( ) {
        var self = this;
        self._mapName = "flipY";  
        self._map = Maps.flipY; 
        return self;
    }
    
    ,flipXY: function( ) {
        var self = this;
        self._mapName = "flipXY";  
        self._map = Maps.flipXY; 
        return self;
    }
    
    ,rotateCW: function( ) {
        var self = this;
        self._mapName = "rotateCW";  
        self._map = Maps.rotateCW; 
        return self;
    }
    
    ,rotateCCW: function( ) {
        var self = this;
        self._mapName = "rotateCCW";  
        self._map = Maps.rotateCCW; 
        return self;
    }
    
    ,polar: function( centerX, centerY ) {
        var self = this;
        self.centerX = centerX||0; self.centerY = centerY||0;
        self._mapName = "polar";  
        self._map = Maps.polar; 
        return self;
    }
    
    ,cartesian: function( centerX, centerY ) {
        var self = this;
        self.centerX = centerX||0; self.centerY = centerY||0;
        self._mapName = "cartesian";  
        self._map = Maps.cartesian; 
        return self;
    }
    
    ,twirl: function( angle, radius, centerX, centerY ) {
        var self = this;
        self.angle = angle||0; self.radius = radius||0;
        self.centerX = centerX||0; self.centerY = centerY||0;
        self._mapName = "twirl";  
        self._map = Maps.twirl; 
        return self;
    }
    
    ,sphere: function( radius, centerX, centerY ) {
        var self = this;
        self.radius = radius||0; self.centerX = centerX||0; self.centerY = centerY||0;
        self._mapName = "sphere";  
        self._map = Maps.sphere; 
        return self;
    }
    
    ,ripple: function( radius, wavelength, amplitude, phase, centerX, centerY ) {
        var self = this;
        self.radius = (radius!==undef) ? radius : 50; 
        self.centerX = centerX||0; 
        self.centerY = centerY||0;
        self.wavelength = (wavelength!==undef) ? wavelength : 16; 
        self.amplitude = (amplitude!==undef) ? amplitude : 10; 
        self.phase = phase||0;
        self._mapName = "ripple";  
        self._map = Maps.ripple; 
        return self;
    }
    
    ,shift: function( dx, dy ) {
        var self = this;
        self.dx = (dx!==undef) ? dx : 0; 
        self.dy = (dy!==undef) ? dy : self.dx; 
        self._mapName = "shift";  
        self._map = Maps.shift; 
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self._mapName = null; 
        self._map = null; 
        return self;
    }
    
    ,getMap: function( ) {
        return this._map;
    }
    
    ,setMap: function( map ) {
        var self = this;
        self._mapName = null; 
        self._map = map; 
        return self;
    }
    
    // used for internal purposes
    ,_apply: function( im, w, h, image ) {
        var self = this;
        if ( !self._isOn || !self._map ) return im;
        return self._map( self, im, w, h, image );
    }
        
    ,canRun: function( ) {
        return this._isOn && this._map;
    }
});
// aliases
GeometricMapFilter.prototype.translate = GeometricMapFilter.prototype.shift;

//
//
// private geometric maps

/*function trivialMap(im, w, h) { return im; },*/
Maps = {
    "generic": function( self, im, w, h )  {
        var x, y, i, j, imLen=im.length, dst=new IMG(imLen),
            invTransform=self.inverseTransform, mode=self.mode,
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
            t, tx, ty
        ;
        
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            t = invTransform([x, y], w, h); tx = ~~(t[0]); ty = ~~(t[1]);
            if (0>tx || tx>=w || 0>ty || ty>=h)
            {
                switch(mode)
                {
                    case _Wrap:
                        if (ty>=h) ty-=h;
                        else if (ty<0) ty+=h;
                        if (tx>=w) tx-=w;
                        else if (tx<0)  tx+=w;
                        break;
                        
                    case _Clamp:
                    default:
                        if (ty>=h)  ty=h-1;
                        else if (ty<0) ty=0;
                        if (tx>=w) tx=w-1;
                        else if (tx<0) tx=0;
                        break;
                }
            }
            j = (tx + ty*w)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }

    ,"affine": function( self, im, w, h ) {
        var x, y, yw, i, j, imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            mat=self.matrix, a=mat[0], b=mat[1], c=mat[3], d=mat[4], tx=mat[2], ty=mat[5], 
            tyw, cw, dw, mode=self.mode,
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
            nx, ny, bx=w-1, by=imArea-w
        ;
        
        x=0; y=0; tyw=ty*w; cw=c*w; dw=d*w;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            nx = ~~(a*x + b*y + tx); ny = ~~(cw*x + dw*y + tyw);
            if (0>nx || nx>bx || 0>ny || ny>by)
            {
                switch(mode)
                {
                    case _Wrap:
                        if (ny>by) ny-=imArea;
                        else if (ny<0) ny+=imArea;
                        if (nx>=w) nx-=w;
                        else if (nx<0)  nx+=w;
                        break;
                        
                    case _Clamp:
                    default:
                        if (ny>by)  ny=by;
                        else if (ny<0) ny=0;
                        if (nx>bx) nx=bx;
                        else if (nx<0) nx=0;
                        break;
                }
            }
            j = (nx + ny)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }

    ,"shift": function( self, im, w, h ) {
        var x, y, yw, i, j, l=im.length, dst=new IMG(l),
            dx = -self.dx, dy = -self.dy;
        
        if ( dx < 0 ) dx += w;
        if ( dy < 0 ) dy += h;
        
        x=0; y=0; yw=0;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; yw+=w; }
            
            j = ( (x+dx) % w + ((y+dy) % h) * w ) << 2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    ,"flipX": function( self, im, w, h ) {
        var x, y, yw, i, j, l=im.length, dst=new IMG(l);
        
        x=0; y=0; yw=0;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; yw+=w; }
            
            j = (w-1-x+yw)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    ,"flipY": function flipYMap( self, im, w, h ) {
        var x, y, yw2, i, j, l=im.length, dst=new IMG(l);
        
        x=0; y=0; yw2=(h-1)*w;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; yw2-=w; }
            
            j = (x+yw2)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    ,"flipXY": function( self, im, w, h )  {
        var x, y, yw, yw2, i, j, l=im.length, dst=new IMG(l);
        
        x=0; y=0; yw2=(h-1)*w;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; yw+=w; yw2-=w; }
            
            j = (w-1-x+yw2)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    ,"rotateCW": function( self, im, w, h )  {
        var x, y, yw, xw, i, j, l=im.length, dst=new IMG(l),
            hw=(l>>2);
        
        x=0; y=0; xw=hw-1;
        for (i=0; i<l; i+=4, x++, xw-=w)
        {
            if (x>=w) { x=0; xw=hw-1; y++; }
            
            j = (y + xw)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    ,"rotateCCW": function( self, im, w, h ) {
        var x, y, yw, xw, i, j, l=im.length, dst=new IMG(l),
            hw=(l>>2);
        
        x=0; y=0; xw=0;
        for (i=0; i<l; i+=4, x++, xw+=w)
        {
            if (x>=w) { x=0; xw=0; y++; }
            
            j = (w-1-y + xw)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    // adapted from http://je2050.de/imageprocessing/ TwirlMap
    ,"twirl": function( self, im, w, h )  {
        if ( 0 >= self.radius ) return im;
        
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im), // in Opera this is by-reference, hence the previous discrepancies
            cX=self.centerX, cY=self.centerY, angle=self.angle, radius=self.radius, mode=self.mode, 
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
            d, tx, ty, theta, fact=angle/radius,
            bx=w-1, by=h-1
        ;
        
        // make center relative
        cX = Floor(cX*(w-1));
        cY = Floor(cY*(h-1));
            
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            tx = x-cX; ty = y-cY; 
            d = Sqrt(tx*tx + ty*ty);
            if (d < radius)
            {
                theta = Atan2(ty, tx) + fact*(radius-d);
                tx = ~~(cX + d*Cos(theta));  ty = ~~(cY + d*Sin(theta));
                if (0>tx || tx>bx || 0>ty || ty>by)
                {
                    switch(mode)
                    {
                        case _Wrap:
                            if (ty>by) ty-=h;
                            else if (ty<0) ty+=h;
                            if (tx>bx) tx-=w;
                            else if (tx<0)  tx+=w;
                            break;
                            
                        case _Clamp:
                        default:
                            if (ty>by)  ty=by;
                            else if (ty<0) ty=0;
                            if (tx>bx) tx=bx;
                            else if (tx<0) tx=0;
                            break;
                    }
                }
                j = (tx + ty*w)<<2;
                // swaping the arrays of input/output (together with Uint8Array for Opera)
                // solves the problem in all browsers (FF24, Chrome, Opera 12, IE10+)
                im[i] = imcopy[j];   im[i+1] = imcopy[j+1];
                im[i+2] = imcopy[j+2];  im[i+3] = imcopy[j+3];
            }
        }
        return im;
    }
    
    // adapted from http://je2050.de/imageprocessing/ SphereMap
    ,"sphere": function( self, im, w, h )  {
        if (0>=self.radius) return im;
        
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
            cX=self.centerX, cY=self.centerY, radius=self.radius, mode=self.mode, 
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
            d, tx, ty, theta, radius2=radius*radius,
            refraction = 0.555556, invrefraction=1-refraction,
            r2, thetax, thetay, d2, ds, tx2, ty2,
            bx=w-1, by=h-1
        ;
        
        // make center relative
        cX = Floor(cX*(w-1));
        cY = Floor(cY*(h-1));
            
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            tx = x - cX;  ty = y - cY;
            tx2 = tx*tx; ty2 = ty*ty;
            r2 = tx2 + ty2;
            if (r2 < radius2)
            {
                d2 = radius2 - r2; ds = Sqrt(d2);
                thetax = Asin(tx / Sqrt(tx2 + d2)) * invrefraction;
                thetay = Asin(ty / Sqrt(ty2 + d2)) * invrefraction;
                tx = ~~(x - ds * Tan(thetax));  ty = ~~(y - ds * Tan(thetay));
                if (0>tx || tx>bx || 0>ty || ty>by)
                {
                    switch(mode)
                    {
                        case _Wrap:
                            if (ty>by) ty-=h;
                            else if (ty<0) ty+=h;
                            if (tx>bx) tx-=w;
                            else if (tx<0)  tx+=w;
                            break;
                            
                        case _Clamp:
                        default:
                            if (ty>by)  ty=by;
                            else if (ty<0) ty=0;
                            if (tx>bx) tx=bx;
                            else if (tx<0) tx=0;
                            break;
                    }
                }
                j = (tx + ty*w)<<2;
                im[i] = imcopy[j];   im[i+1] = imcopy[j+1];
                im[i+2] = imcopy[j+2];  im[i+3] = imcopy[j+3];
            }
        }
        return im;
    }
    
    // adapted from https://github.com/JoelBesada/JSManipulate
    ,"ripple": function( self, im, w, h ) {
        if (0>=self.radius) return im;
        
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
            d, tx, ty, amount, 
            r2, d2, ds, tx2, ty2,
            bx=w-1, by=h-1,
            cX=self.centerX, cY=self.centerY, radius=self.radius, mode=self.mode, 
            radius2=radius*radius,
            wavelength = self.wavelength,
            amplitude = self.amplitude,
            phase = self.phase
        ;
        
        // make center relative
        cX = Floor(cX*(w-1));
        cY = Floor(cY*(h-1));
            
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            tx = x - cX;  ty = y - cY;
            tx2 = tx*tx; ty2 = ty*ty;
            d2 = tx2 + ty2;
            if (d2 < radius2)
            {
                d = Sqrt(d2);
                amount = amplitude * Sin(d/wavelength * Math.PI * 2 - phase);
                amount *= (radius-d)/radius;
                if (d)  amount *= wavelength/d;
                tx = ~~(x + tx*amount);  ty = ~~(y + ty*amount);
                
                if (0>tx || tx>bx || 0>ty || ty>by)
                {
                    switch(mode)
                    {
                        case _Wrap:
                            if (ty>by) ty-=h;
                            else if (ty<0) ty+=h;
                            if (tx>bx) tx-=w;
                            else if (tx<0)  tx+=w;
                            break;
                            
                        case _Clamp:
                        default:
                            if (ty>by)  ty=by;
                            else if (ty<0) ty=0;
                            if (tx>bx) tx=bx;
                            else if (tx<0) tx=0;
                            break;
                    }
                }
                j = (tx + ty*w)<<2;
                im[i] = imcopy[j];   im[i+1] = imcopy[j+1];
                im[i+2] = imcopy[j+2];  im[i+3] = imcopy[j+3];
            }
        }
        return im;
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    /*
    ,"circle": function( self, im, w, h ) {
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
            tx, ty, ix, iy, ip, d2,
            bx = w-1, by = h-1, 
            cX, cY, cX2, cY2,
            mode = this.mode
        ;
        
        cX = ~~(0.5*w + 0.5);
        cY = ~~(0.5*h + 0.5);
        cX2 = cX*cX;
        cY2 = cY*cY;
        
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            tx = x-cX;
            ty = y-cY;
            d2 = tx*tx + ty*ty;
            ix = cX + cX2 * tx/d2;
            iy = cY + cY2 * ty/d2;
            // inverse transform
            if (0>ix || ix>bx || 0>iy || iy>by)
            {
                switch(mode)
                {
                    case _Wrap:
                        if (iy>by) iy-=h;
                        else if (iy<0) iy+=h;
                        if (ix>bx) ix-=w;
                        else if (ix<0)  ix+=w;
                        break;
                        
                    case _Clamp:
                    default:
                        if (iy>by)  iy=by;
                        else if (iy<0) iy=0;
                        if (ix>bx) ix=bx;
                        else if (ix<0) ix=0;
                        break;
                }
            }
            ip = ( ~~(ix+0.5) + ~~(iy+0.5) )<<2;
            im[i] = imcopy[ ip ];
            im[i+1] = imcopy[ ip+1 ];
            im[i+2] = imcopy[ ip+2 ];
            im[i+3] = imcopy[ ip+3 ];
        }
        return im;
    }
    */
    ,"polar": function( self, im, w, h ) {
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
            tx, ty, ix, iy, ip,
            bx = w-1, by = h-1, 
            theta, r=0, radius, cX, cY, 
            mode = self.mode
        ;
        
        cX = ~~(0.5*w + 0.5);
        cY = ~~(0.5*h + 0.5);
        radius = Max(cY, cX);
            
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            tx = x-cX;
            ty = y-cY;
            theta = 0;
            
            if (tx >= 0) 
            {
                if (ty > 0) 
                {
                    theta = PI - Atan(tx/ty);
                    r = Sqrt(tx*tx + ty*ty);
                } 
                else if (ty < 0) 
                {
                    theta = Atan(tx/ty);
                    r = Sqrt(tx*tx + ty*ty);
                } 
                else 
                {
                    theta = HalfPI;
                    r = tx;
                }
            } 
            else if (tx < 0) 
            {
                if (ty < 0) 
                {
                    theta = DoublePI - Atan(tx/ty);
                    r = Sqrt(tx*tx + ty*ty);
                } 
                else if (ty > 0) 
                {
                    theta = PI + Atan(tx/ty);
                    r = Sqrt(tx*tx + ty*ty);
                } 
                else 
                {
                    theta = ThreePI2;
                    r = -tx;
                }
            }
            // inverse transform
            ix = (w-1) - (w-1)/DoublePI * theta;
            iy = (h * r / radius);
            ix = Round(ix); iy = Round(iy);
            if (0>ix || ix>bx || 0>iy || iy>by)
            {
                switch(mode)
                {
                    case _Wrap:
                        if (iy>by) iy-=h;
                        else if (iy<0) iy+=h;
                        if (ix>bx) ix-=w;
                        else if (ix<0)  ix+=w;
                        break;
                        
                    case _Clamp:
                    default:
                        if (iy>by)  iy=by;
                        else if (iy<0) iy=0;
                        if (ix>bx) ix=bx;
                        else if (ix<0) ix=0;
                        break;
                }
            }
            ip = ( ix + iy*w ) << 2;
            im[i] = imcopy[ ip ];
            im[i+1] = imcopy[ ip+1 ];
            im[i+2] = imcopy[ ip+2 ];
            im[i+3] = imcopy[ ip+3 ];
        }
        return im;
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,"cartesian": function( self, im, w, h ) {
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
            ix, iy, ip, nx, ny,
            bx = w-1, by = h-1, 
            theta, theta2, r=0, radius, cX, cY, 
            mode = self.mode
        ;
        
        cX = ~~(0.5*w + 0.5);
        cY = ~~(0.5*h + 0.5);
        radius = Max(cY, cX);
            
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            theta = x / w * DoublePI;

            if (theta >= ThreePI2)
                theta2 = DoublePI - theta;
            else if (theta >= PI)
                theta2 = theta - PI;
            else if (theta >= HalfPI)
                theta2 = PI - theta;
            else
                theta2 = theta;
            r = radius * (y / h);

            nx = -r * Sin(theta2);
            ny = r * Cos(theta2);
            
            if (theta >= ThreePI2) 
            {
                ix = cX - nx;
                iy = cY - ny;
            } 
            else if (theta >= PI) 
            {
                ix = cX - nx;
                iy = cY + ny;
            } 
            else if (theta >= HalfPI) 
            {
                ix = cX + nx;
                iy = cY + ny;
            } 
            else 
            {
                ix = cX + nx;
                iy = cY - ny;
            }
            // inverse transform
            ix = Round(ix); iy = Round(iy);
            if (0>ix || ix>bx || 0>iy || iy>by)
            {
                switch(mode)
                {
                    case _Wrap:
                        if (iy>by) iy-=h;
                        else if (iy<0) iy+=h;
                        if (ix>bx) ix-=w;
                        else if (ix<0)  ix+=w;
                        break;
                        
                    case _Clamp:
                    default:
                        if (iy>by)  iy=by;
                        else if (iy<0) iy=0;
                        if (ix>bx) ix=bx;
                        else if (ix<0) ix=0;
                        break;
                }
            }
            ip = ( ix + iy*w ) << 2;
            im[i] = imcopy[ ip ];
            im[i+1] = imcopy[ ip+1 ];
            im[i+2] = imcopy[ ip+2 ];
            im[i+3] = imcopy[ ip+3 ];
        }
        return im;
    }
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

var 
    sqrt2 = FILTER.CONST.SQRT2, toRad = FILTER.CONST.toRad, toDeg = FILTER.CONST.toDeg,
    Abs = Math.abs, Sqrt = Math.sqrt, Sin = Math.sin, Cos = Math.cos,
    TypedArray = FILTER.TypedArray, FilterUtil = FILTER.Util.Filter,
    notSupportClamp = FILTER._notSupportClamp,
    integral_convolution = FilterUtil.integral_convolution,
    separable_convolution = FilterUtil.separable_convolution,
    // Convolution Matrix
    CM = FILTER.Array32F, IMG = FILTER.ImArray, //IMGcopy = FILTER.ImArrayCopy,
    A32F = FILTER.Array32F, A16I = FILTER.Array16I, A8U = FILTER.Array8U,
    
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
//
//  Convolution Matrix Filter
var ConvolutionMatrixFilter = FILTER.ConvolutionMatrixFilter = FILTER.Class( FILTER.Filter, {
    name: "ConvolutionMatrixFilter"
    
    ,constructor: function( weights, factor, bias, rgba ) {
        var self = this;
        self.$super('constructor');
        self._coeff = new CM([1.0, 0.0]);
        
        if ( weights && weights.length)
        {
            self.set(weights, ~~(Sqrt(weights.length)+0.5), factor||1.0, bias||0.0);
        }
        else 
        {
            self._matrix = null; self._dim = 0;
        }
        self._matrix2 = null;  self._dim2 = 0;
        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        self._rgba = !!rgba;
        /*if ( FILTER.useWebGL ) 
        {
            self._webglInstance = FILTER.WebGLConvolutionMatrixFilterInstance || null;
        }*/
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_dim: 0
    ,_dim2: 0
    ,_matrix: null
    ,_matrix2: null
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
    ,_webglInstance: null
    
    ,dispose: function( ) {
        var self = this;
        
        self.$super('dispose');
        
        self._webglInstance = null;
        self._dim = null;
        self._dim2 = null;
        self._matrix = null;
        self._matrix2 = null;
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
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _dim: self._dim
                ,_dim2: self._dim2
                ,_matrix: self._matrix
                ,_matrix2: self._matrix2
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
            
            self._dim = params._dim;
            self._dim2 = params._dim2;
            self._matrix = TypedArray( params._matrix, CM );
            self._matrix2 = TypedArray( params._matrix2, CM );
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
    
    // generic low-pass filter
    ,lowPass: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        this.set(ones(d), d, 1/(d*d), 0.0);
        this._doIntegral = 1; return this;
    }

    // generic high-pass filter (I-LP)
    ,highPass: function( d, f ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        f = ( f === undef ) ? 1 : f;
        // HighPass Filter = I - (respective)LowPass Filter
        var size=d*d, fact=-f/size, w=ones(d, fact, 1+fact);
        this.set(w, d, 1.0, 0.0);
        this._doIntegral = 1; return this;
    }

    ,glow: function( f, d ) { 
        f = ( f === undef ) ? 0.5 : f;  
        return this.highPass(d, -f); 
    }
    
    ,sharpen: function( f, d ) { 
        f = ( f === undef ) ? 0.5 : f;  
        return this.highPass(d, f); 
    }
    
    ,verticalBlur: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        this.set(average1DKernel(d), 1, 1/d, 0.0); 
        this._dim2 = d; this._doIntegral = 1; return this;
    }
    
    ,horizontalBlur: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        this.set(average1DKernel(d), d, 1/d, 0.0); 
        this._dim2 = 1; this._doIntegral = 1; return this;
    }
    
    // supports only vertical, horizontal, diagonal
    ,directionalBlur: function( theta, d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        theta *= toRad;
        var c = Cos(theta), s = -Sin(theta), filt = twos2(d, c, s, 1/d);
        return this.set(filt, d, 1.0, 0.0);
    }
    
    // fast gauss filter
    ,fastGauss: function( quality, d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        quality = ~~(quality||1);
        if ( quality < 1 ) quality = 1;
        else if ( quality > 3 ) quality = 3;
        this.set(ones(d), d, 1/(d*d), 0.0);
        this._doIntegral = quality; return this;
    }
    
    // generic binomial(quasi-gaussian) low-pass filter
    ,binomialLowPass: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        /*var filt=gaussKernel(d);
        return this.set(filt.kernel, d, 1/filt.sum); */
        var kernel = binomial1DKernel(d), sum=1<<(d-1), fact=1/sum;
        this.set(kernel, d, fact, fact);
        this._matrix2 = new CM(kernel);
        var tmp = this._computeIndices(this._matrix2, this._dim2);
        this._indices2 = tmp[0]; this._indicesf2 = tmp[1]; this._mat2 = tmp[2];
        this._doSeparable = true; return this;
    }

    // generic binomial(quasi-gaussian) high-pass filter
    ,binomialHighPass: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var filt = gaussKernel(d);
        // HighPass Filter = I - (respective)LowPass Filter
        return this.set(blendMatrix(ones(d), new CM(filt.kernel), 1, -1/filt.sum), d, 1.0, 0.0); 
    }
    
    // X-gradient, partial X-derivative (Prewitt)
    ,prewittX: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var filt = prewittKernel(d, 0);
        // this can be separable
        return this.set(filt.kernel, d, 1.0, 0.0);
    }
    
    // Y-gradient, partial Y-derivative (Prewitt)
    ,prewittY: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var filt = prewittKernel(d, 1);
        // this can be separable
        return this.set(filt.kernel, d, 1.0, 0.0);
    }
    
    // directional gradient (Prewitt)
    ,prewittDirectional: function( theta, d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        theta*=toRad;
        var c = Cos(theta), s = Sin(theta), gradx = prewittKernel(d, 0), grady = prewittKernel(d, 1);
        return this.set(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), d, 1.0, 0.0);
    }
    
    // gradient magnitude (Prewitt)
    ,prewitt: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var gradx = prewittKernel(d, 0), grady = prewittKernel(d, 1);
        this.set(gradx.kernel, d, 1.0, 0.0);
        this._isGrad = true;
        this._matrix2 = new CM(grady.kernel);
        var tmp = this._computeIndices(this._matrix2, this._dim2);
        this._indices2 = tmp[0]; this._indicesf2 = tmp[1]; this._mat2 = tmp[2];
        return this;
    }
    
    // partial X-derivative (Sobel)
    ,sobelX: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var filt = sobelKernel(d, 0);
        // this can be separable
        return this.set(filt.kernel, d, 1.0, 0.0);
    }
    
    // partial Y-derivative (Sobel)
    ,sobelY: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var filt = sobelKernel(d, 1);
        // this can be separable
        return this.set(filt.kernel, d, 1.0, 0.0);
    }
    
    // directional gradient (Sobel)
    ,sobelDirectional: function( theta, d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        theta*=toRad;
        var c = Cos(theta), s = Sin(theta), gradx = sobelKernel(d, 0), grady = sobelKernel(d, 1);
        return this.set(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), d, 1.0, 0.0);
    }
    
    // gradient magnitude (Sobel)
    ,sobel: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var gradx = sobelKernel(d, 0), grady = sobelKernel(d, 1);
        this.set(gradx.kernel, d, 1.0, 0.0);
        this._matrix2 = new CM(grady.kernel);
        var tmp = this._computeIndices(this._matrix2, this._dim2);
        this._indices2 = tmp[0]; this._indicesf2 = tmp[1]; this._mat2 = tmp[2];
        this._isGrad = true;
        return this;
    }
    
    ,laplace: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var size = d*d, laplacian = ones(d, -1, size-1);
        this.set(laplacian, d, 1.0, 0.0);
        this._doIntegral = 1; return this;
    }
    
    ,emboss: function( angle, amount, d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        angle = ( angle === undef ) ? (-0.25*Math.PI) : (angle*toRad);
        amount = amount||1;
        var dx = amount*Cos(angle), dy = -amount*Sin(angle), filt = twos(d, dx, dy, 1);
        return this.set(filt, d, 1.0, 0.0);
    }
    
    ,edges: function( m ) {
        m = m||1;
        return this.set([
            0,   m,   0,
            m,  -4*m, m,
            0,   m,   0
         ], 3, 1.0, 0.0);
    }
    
    ,set: function( m, d, f, b ) {
        var self = this;
        self._matrix2 = null; self._dim2 = 0; self._indices2 = self._indicesf2 = null; self._mat2 = null;
        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        self._matrix = new CM(m); self._dim = d; self._coeff[0] = f||1; self._coeff[1] = b||0;
        var tmp  = self._computeIndices(self._matrix, self._dim);
        self._indices = tmp[0]; self._indicesf = tmp[1]; self._mat = tmp[2];
        return self;
    }
    
    ,_computeIndices: function( m, d ) {
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        var indices = [], indices2 = [], mat = [], k, x, y,  matArea = m.length, matRadius = d, matHalfSide = (matRadius>>1);
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
    
    ,reset: function( ) {
        var self = this;
        self._matrix = self._matrix2 = null; 
        self._mat = self._mat2 = null; 
        self._dim = self._dim2 = 0;
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
        return this._matrix;
    }
    
    ,setMatrix: function( m, d ) {
        return this.set(m, d);
    }
    
    // used for internal purposes
    ,_apply: function(im, w, h/*, image*/) {
        var self = this, rgba = self._rgba;
        if ( !self._isOn || !self._matrix ) return im;
        
        // do a faster convolution routine if possible
        if ( self._doIntegral ) 
        {
            return self._matrix2
            ? integral_convolution(rgba, im, w, h, self._matrix, self._matrix2, self._dim, self._dim2, self._coeff[0], self._coeff[1], self._doIntegral)
            : integral_convolution(rgba, im, w, h, self._matrix, null, self._dim, self._dim, self._coeff[0], self._coeff[1], self._doIntegral)
            ;
        }
        else if ( self._doSeparable )
        {
            return separable_convolution(rgba, im, w, h, self._mat, self._mat2, self._indices, self._indices2, self._coeff[0], self._coeff[1]);
        }
        // handle some common cases fast
        /*else if (3==this._dim)
        {
            return convolution3(im, w, h, this._matrix, this._matrix2, this._dim, this._dim, this._coeff[0], this._coeff[1], this._isGrad);
        }*/
        
        var imLen = im.length, imArea = (imLen>>2), 
            dst = new IMG(imLen), 
            t0, t1, t2, t3,
            i, j, k, x, ty, ty2, 
            xOff, yOff, srcOff, 
            r, g, b, a, r2, g2, b2, a2,
            bx = w-1, by = imArea-w,
            coeff1 = self._coeff[0], coeff2 = self._coeff[1],
            mat = self._matrix, mat2 = self._matrix2, wt, wt2, _isGrad = self._isGrad,
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
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; 
                        wt = mat[k]; r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;  a += im[srcOff+3] * wt;
                        // allow to apply a second similar matrix in-parallel (eg for total gradients)
                        wt2 = mat2[k]; r2 += im[srcOff] * wt2; g2 += im[srcOff+1] * wt2;  b2 += im[srcOff+2] * wt2;  a2 += im[srcOff+3] * wt2;
                    }
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
                if ( notSupportClamp )
                {   
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                if ( rgba )
                {
                    t3 = _isGrad ? Abs(a)+Abs(a2) : coeff1*a + coeff2*a2;
                    if ( notSupportClamp ) t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                    dst[i+3] = ~~t3;
                }
                else
                {
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
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
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt; a += im[srcOff+3] * wt;
                    }
                }
                
                // output
                t0 = coeff1*r+coeff2;  t1 = coeff1*g+coeff2;  t2 = coeff1*b+coeff2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                if ( rgba )
                {
                    t3 = coeff1*a + coeff2;
                    if ( notSupportClamp ) t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                    dst[i+3] = ~~t3;
                }
                else
                {
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
        }
        return dst;
    }
        
    ,canRun: function( ) {
        return this._isOn && this._matrix;
    }
});
// aliases
ConvolutionMatrixFilter.prototype.bump = ConvolutionMatrixFilter.prototype.emboss;
ConvolutionMatrixFilter.prototype.boxBlur = ConvolutionMatrixFilter.prototype.lowPass;
ConvolutionMatrixFilter.prototype.gaussBlur = ConvolutionMatrixFilter.prototype.binomialLowPass;
ConvolutionMatrixFilter.prototype.gradX = ConvolutionMatrixFilter.prototype.prewittX;
ConvolutionMatrixFilter.prototype.gradY = ConvolutionMatrixFilter.prototype.prewittY;
ConvolutionMatrixFilter.prototype.gradDirectional = ConvolutionMatrixFilter.prototype.prewittDirectional;
ConvolutionMatrixFilter.prototype.grad = ConvolutionMatrixFilter.prototype.prewitt;


//
//
//  Private methods

function addMatrix(m1, m2)
{
    var l=m1.length, i, m=new CM(m1.length);
    i=0; while (i<l) { m[i]=m1[i] + m2[i]; i++; }
    return m;
}

function subtractMatrix(m1, m2)
{
    var l=m1.length, i, m=new CM(m1.length);
    i=0; while (i<l) { m[i]=m1[i]-m2[i]; i++; }
    return m;
}

function multiplyScalar(m1, s)
{
    if (1==s) return new CM(m1);
    var l=m1.length, i, m=new CM(m1.length);
    i=0; while (i<l) { m[i]=m1[i]*s; i++; }
    return m;
}

function blendMatrix(m1, m2, a, b)
{
    var l=m1.length, i, m=new CM(m1.length);
    a=a||1; b=b||1;
    i=0; while (i<l) { m[i]=a*m1[i] + b*m2[i]; i++; }
    return m;
}

function convolveKernels(k1, k2)
{
    var i, j, kl=k1.length, k, ker=[], sum=0;
    for (i=0; i<kl; i++) { for (j=0; j<kl; j++) { k=k1[i]*k2[j];  sum+=k;  ker.push(k); } }
    return {kernel:ker, sum:sum};
}

function identity1DKernel(d)
{
    var i, center=(d>>1), ker=new Array(d);
    i=0; while (i<d) { ker[i]=0; i++; }
    ker[center]=1;  return ker;
}

function average1DKernel(d)
{
    var i, ker=new Array(d);
    i=0; while (i<d) { ker[i]=1; i++; }
    return ker;
}

// pascal numbers (binomial coefficients) are used to get coefficients for filters that resemble gaussian distributions
// eg Sobel, Canny, gradients etc..
function binomial1DKernel(d) 
{
    var l=_pascal.length, row, uprow, i, il;
    d--;
    if (d<l)
    {
        row=new CM(_pascal[d]);
    }
    else
    {
        // else compute them iteratively
        row=new CM(_pascal[l-1]);
        while (l<=d)
        {
            uprow=row; row=new CM(uprow.length+1); row[0]=1;
            for (i=0, il=uprow.length-1; i<il; i++) { row[i+1]=(uprow[i]+uprow[i+1]); } row[uprow.length]=1;
            if (l<40) _pascal.push(new Array(row)); // save it for future dynamically
            l++;
        }
    }
    return row;
}

function derivative1DKernel(d)
{
    var i, half=d>>1, k=-half, ker=new Array(d);
    i=0; while (i<d) { ker[i] = k; k++; i++; }
    return ker;
}

function gaussKernel(d)
{
    var binomial=binomial1DKernel(d);
    // convolve with itself
    return convolveKernels(binomial, binomial);
}

function verticalKernel(d)
{
    var eye=identity1DKernel(d), average=average1DKernel(d);
    // convolve with itself
    return convolveKernels(average, eye);
}

function horizontalKernel(d)
{
    var eye=identity1DKernel(d), average=average1DKernel(d);
    // convolve with itself
    return convolveKernels(eye, average);
}

function sobelKernel(d, dir)
{
    var binomial=binomial1DKernel(d), derivative=derivative1DKernel(d);
    if (1==dir) // y
        return convolveKernels(derivative.reverse(), binomial);
    else  // x
        return convolveKernels(binomial, derivative);
}

function prewittKernel(d, dir)
{
    var average=average1DKernel(d), derivative=derivative1DKernel(d);
    if (1==dir) // y
        return convolveKernels(derivative.reverse(), average);
    else // x
        return convolveKernels(average, derivative);
}

function ones(d, f, c) 
{ 
    f=f||1; c=c||f;
    var l=d*d, center=l>>1, i, o=new CM(l);
    i=0; while(i<l) { o[i]=f; i++; } o[center]=c;
    return o;
}

function twos(d, dx, dy, c)
{
    var l=d*d, half=d>>1, center=l>>1, i, k, j, o=new CM(l), tx, ty;
    tx = 0;
    for (i=0; i<=half; i++)
    {
        k = 0; ty = 0;
        for (j=0; j<=half; j++)
        {
            //tx=i*dx;  ty=j*dy;
            o[center + i + k]=   tx + ty;
            o[center - i - k]= - tx - ty;
            o[center - i + k]= - tx + ty;
            o[center + i - k]=   tx - ty;
            k += d; ty += dy;
        }
        tx += dx;
    }
    o[center] = c||1;
    return o;
}

function twos2(d, c, s, cf)
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
    Sqrt = Math.sqrt, TypedArray = FILTER.TypedArray,
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
    
    ,constructor: function( ) {
        var self = this;
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
        
        self.$super('dispose');
        
        self._filterName = null;
        self._filter = null;
        self._dim = null;
        self._structureElement = null;
        self._indices = null;
        
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
var IMG = FILTER.ImArray, A32I = FILTER.Array32I,TypedArray = FILTER.TypedArray,
    Min = Math.min, Max = Math.max, Filters;
    
//
//
//  Statistical Filter
var StatisticalFilter = FILTER.StatisticalFilter = FILTER.Class( FILTER.Filter, {
    name: "StatisticalFilter"
    
    ,constructor: function( ) {
        var self = this;
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
        
        self.$super('dispose');
        
        self._dim = null;
        self._indices = null;
        self._filter = null;
        self._filterName = null;
        
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

}(FILTER);
/* main code ends here */
/* export the module */
return FILTER;
});