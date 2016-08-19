/**
*
*   FILTER.js Plugins
*   @version: 0.9.5
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Plugins)
*   https://github.com/foo123/FILTER.js
*
**/!function( root, factory ){
"use strict";
if ( ('object'===typeof module) && module.exports ) /* CommonJS */
    module.exports = factory.call(root,(module.$deps && module.$deps["FILTER"]) || require("./FILTER".toLowerCase()));
else if ( ("function"===typeof define) && define.amd && ("function"===typeof require) && ("function"===typeof require.specified) && require.specified("FILTER_PLUGINS") /*&& !require.defined("FILTER_PLUGINS")*/ ) 
    define("FILTER_PLUGINS",['module',"FILTER"],function(mod,module){factory.moduleUri = mod.uri; factory.call(root,module); return module;});
else /* Browser/WebWorker/.. */
    (factory.call(root,root["FILTER"])||1)&&('function'===typeof define)&&define.amd&&define(function(){return root["FILTER"];} );
}(  /* current root */          this, 
    /* module factory */        function ModuleFactory__FILTER_PLUGINS( FILTER ){
/* main code starts here */

/**
*
*   FILTER.js Plugins
*   @version: 0.9.5
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Plugins)
*   https://github.com/foo123/FILTER.js
*
**/
"use strict";
var FILTER_PLUGINS_PATH = FILTER.getPath( ModuleFactory__FILTER_PLUGINS.moduleUri );

/**
*
* Noise Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp = FILTER._notSupportClamp, rand = Math.random;

// a sample noise filter
// used for illustration purposes on how to create a plugin filter
FILTER.Create({
    name: "NoiseFilter"
    
    // parameters
    ,min: -127
    ,max: 127
    
    // this is the filter constructor
    ,init: function( min, max ) {
        var self = this;
        self.min = min||-127;
        self.max = max||127;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
             min: self.min
            ,max: self.max
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.min = params.min;
        self.max = params.max;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var range=self.max-self.min, m=self.min,
            i, l=im.length, n, r, g, b, t0, t1, t2;
        
        // add noise
        if (notSupportClamp)
        {   
            for (i=0; i<l; i+=4)
            { 
                r = im[i]; g = im[i+1]; b = im[i+2];
                n = range*rand()+m;
                t0 = r+n; t1 = g+n; t2 = b+n; 
                // clamp them manually
                if (t0<0) t0=0;
                else if (t0>255) t0=255;
                if (t1<0) t1=0;
                else if (t1>255) t1=255;
                if (t2<0) t2=0;
                else if (t2>255) t2=255;
                im[i] = t0|0; im[i+1] = t1|0; im[i+2] = t2|0;
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            { 
                r = im[i]; g = im[i+1]; b = im[i+2];
                n = range*rand()+m;
                t0 = r+n; t1 = g+n; t2 = b+n; 
                im[i] = t0|0; im[i+1] = t1|0; im[i+2] = t2|0;
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Perlin Noise Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var perlin_noise = FILTER.Util.Image.perlin, MODE = FILTER.MODE;

// an efficient perlin noise and simplex noise plugin
// http://en.wikipedia.org/wiki/Perlin_noise
FILTER.Create({
    name: "PerlinNoiseFilter"
    
    // parameters
    ,mode: MODE.GRAY
    ,_baseX: 1
    ,_baseY: 1
    ,_octaves: 1
    ,_offsets: null
    ,_seed: 0
    ,_stitch: false
    ,_fractal: true
    ,_perlin: false
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    // constructor
    ,init: function( baseX, baseY, octaves, stitch, fractal, offsets, seed, use_perlin ) {
        var self = this;
        self.mode = MODE.GRAY;
        self._baseX = baseX || 1;
        self._baseY = baseY || 1;
        self._seed = seed || 0;
        self._stitch = !!stitch;
        self._fractal = false !== fractal;
        self._perlin = !!use_perlin;
        self.octaves( octaves||1, offsets );
    }
    
    ,seed: function( randSeed ) {
        var self = this;
        self._seed = randSeed || 0;
        return self;
    }
    
    ,octaves: function( octaves, offsets ) {
        var self = this;
        self._octaves = octaves || 1;
        self._offsets = !offsets ? [] : offsets.slice(0);
        while (self._offsets.length < self._octaves) self._offsets.push([0,0]);
        return self;
    }
    
    ,seamless: function( enabled ) {
        if ( !arguments.length ) enabled = true;
        this._stitch = !!enabled;
        return this;
    }
    
    ,colors: function( enabled ) {
        if ( !arguments.length ) enabled = true;
        this.mode = !!enabled ? MODE.COLOR : MODE.GRAY;
        return this;
    }
    
    ,turbulence: function( enabled ) {
        if ( !arguments.length ) enabled = true;
        this._fractal = !enabled;
        return this;
    }
    
    ,simplex: function( ) {
        this._perlin = false;
        return this;
    }
    
    ,perlin: function( ) {
        this._perlin = true;
        return this;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             _baseX: self._baseX
            ,_baseY: self._baseY
            ,_octaves: self._octaves
            ,_offsets: self._offsets
            ,_seed: self._seed || 0
            ,_stitch: self._stitch
            ,_fractal: self._fractal
            ,_perlin: self._perlin
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self._baseX = params._baseX;
        self._baseY = params._baseY;
        self._octaves = params._octaves;
        self._offsets = params._offsets;
        self._seed = params._seed || 0;
        self._stitch = params._stitch;
        self._fractal = params._fractal;
        self._perlin = params._perlin;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        if ( !perlin_noise ) return im;
        if ( self._seed )
        {
            perlin_noise.seed( self._seed );
            self._seed = 0;
        }
        return perlin_noise( im, w, h, self._stitch, MODE.COLOR !== self.mode, self._baseX, self._baseY, self._octaves, self._offsets, 1.0, 0.5, self._perlin );
    }
});

}(FILTER);/**
*
* Filter Linear-Gradient, Radial-Gradient plugins
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Gradient = FILTER.Color.Gradient, MODE = FILTER.MODE, TypedArray = FILTER.Util.Array.typed, Floor = Math.floor;

FILTER.Create({
     name: "GradientFilter"
    
    // parameters
    ,colors: null
    ,stops: null
    ,angle: 0
    ,centerX: 0.0
    ,centerY: 0.0
    ,radiusX: 1.0
    ,radiusY: 1.0
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,dispose: function( ) {
        var self = this;
        self.colors = null;
        self.stops = null;
        self.angle = null;
        self.centerX = null;
        self.centerY = null;
        self.radiusX = null;
        self.radiusY = null;
        self.$super('dispose');
        return self;
    }
    
    ,setColors: function( colors, stops ) {
        var self = this;
        if ( colors && colors.length )
        {
            var c = Gradient.stops( colors, stops );
            self.colors = c[0]; self.stops = c[1];
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             angle: self.angle
            ,centerX: self.centerX
            ,centerY: self.centerY
            ,radiusX: self.radiusX
            ,radiusY: self.radiusY
            ,colors: self.colors
            ,stops: self.stops
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.angle = params.angle || 0;
        self.centerX = params.centerX || 0.0;
        self.centerY = params.centerY || 0.0;
        self.radiusX = params.radiusX || 1.0;
        self.radiusY = params.radiusY || 1.0;
        self.colors = TypedArray( params.colors, Array );
        self.stops = TypedArray( params.stops, Array );
        return self;
    }
    
    ,linear: function( colors, stops, angle ) {
        var self = this;
        self.mode = MODE.LINEAR;
        self.setColors( colors, stops );
        self.angle = angle||0;
        return self;
    }
    
    ,radial: function( colors, stops, centerX, centerY, radiusX, radiusY ) {
        var self = this;
        self.mode = MODE.RADIAL;
        self.setColors( colors, stops );
        self.centerX = centerX||0.0;
        self.centerY = centerY||0.0;
        self.radiusX = radiusX||1.0;
        self.radiusY = radiusY||1.0;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function( im, w, h ) {
        var self = this;
        if ( !self.colors ) return im;
        return MODE.RADIAL === self.mode ? Gradient.radial( im, w, h, self.colors, self.stops, Floor((self.centerX||0.0)*(w-1)), Floor((self.centerY||0.0)*(h-1)), self.radiusX, self.radiusY, Gradient.interpolate ) : Gradient.linear( im, w, h, self.colors, self.stops, self.angle, Gradient.interpolate );
    }
});

}(FILTER);/**
*
* Channel Copy Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var Min = Math.min, Floor = Math.floor, CHANNEL = FILTER.CHANNEL, MODE = FILTER.MODE;

// a plugin to copy a channel of an image to a channel of another image
FILTER.Create({
    name: "ChannelCopyFilter"
    
    // parameters
    ,srcChannel: CHANNEL.R
    ,dstChannel: CHANNEL.R
    ,centerX: 0
    ,centerY: 0
    ,color: 0
    ,hasInputs: true
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    // constructor
    ,init: function( srcChannel, dstChannel, centerX, centerY, color ) {
        var self = this;
        self.srcChannel = srcChannel || CHANNEL.R;
        self.dstChannel = dstChannel || CHANNEL.R;
        self.centerX = centerX || 0;
        self.centerY = centerY || 0;
        self.color = color || 0;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.srcChannel = null;
        self.dstChannel = null;
        self.centerX = null;
        self.centerY = null;
        self.color = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             srcChannel: self.srcChannel
            ,dstChannel: self.dstChannel
            ,centerX: self.centerX
            ,centerY: self.centerY
            ,color: self.color
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.srcChannel = params.srcChannel;
        self.dstChannel = params.dstChannel;
        self.centerX = params.centerX;
        self.centerY = params.centerY;
        self.color = params.color;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this, Src;
        Src = self.input("source"); if ( !Src ) return im;
        
        var src = Src[0], w2 = Src[1], h2 = Src[2],
            i, l = im.length, l2 = src.length, 
            sC = self.srcChannel, tC = self.dstChannel,
            x, x2, y, y2, off, xc, yc,
            cX = self.centerX||0, cY = self.centerY||0, cX2 = w2>>>1, cY2 = h2>>>1,
            wm = Min(w,w2), hm = Min(h, h2),  
            color = self.color||0, r, g, b, a,
            mode = self.mode, COLOR32 = MODE.COLOR32, COLOR8 = MODE.COLOR8,
            MASK32 = MODE.COLORMASK32, MASK8 = MODE.COLORMASK8;
        
        if ( COLOR32 === mode || MASK32 === mode )
        {
            a = (color >>> 24)&255;
            r = (color >>> 16)&255;
            g = (color >>> 8)&255;
            b = (color)&255;
        }
        else if ( COLOR8 === mode || MASK8 === mode )
        {
            color &= 255;
        }
        
        // make center relative
        cX = Floor(cX*(w-1)) - cX2;
        cY = Floor(cY*(h-1)) - cY2;
        
        for (x=0,y=0,i=0; i<l; i+=4,x++)
        {
            if (x>=w) { x=0; y++; }
            
            xc = x - cX; yc = y - cY;
            if (xc<0 || xc>=wm || yc<0 || yc>=hm)
            {
                if ( COLOR32 === mode ) { im[i  ] = r; im[i+1] = g; im[i+2] = b; im[i+3] = a; }
                else if ( MASK32 === mode ) { im[i  ] = r & im[i  ]; im[i+1] = g & im[i+1]; im[i+2] = b & im[i+2]; im[i+3] = a & im[i+3]; }
                else if ( COLOR8 === mode ) im[i+tC] = color;
                else if ( MASK8 === mode ) im[i+tC] = color & im[i+sC];
                // else ignore
            }
            else
            {
                // copy channel
                off = (xc + yc*w2)<<2;
                im[i + tC] = src[off + sC];
            }
        }
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Histogram Equalize Plugin, Histogram Equalize for grayscale images Plugin, RGB Histogram Equalize Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp = FILTER._notSupportClamp, A32F = FILTER.Array32F,
    MODE = FILTER.MODE, Min = Math.min, Max = Math.max;

// a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
FILTER.Create({
    name : "HistogramEqualizeFilter"
    
    ,path: FILTER_PLUGINS_PATH
    
    ,mode: MODE.INTENSITY
    
    ,init: function( mode ) {
        var self = this;
        self.mode = mode || MODE.INTENSITY;
    }
    
    ,_apply_rgb: function( im, w, h ) {
        var self = this,
            r,g,b, rangeR, rangeG, rangeB,
            maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
            cdfR, cdfG, cdfB,
            accumR, accumG, accumB, t0, t1, t2,
            i, l=im.length, l2=l>>>2;
        
        // initialize the arrays
        cdfR=new A32F(256); cdfG=new A32F(256); cdfB=new A32F(256);
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            r = im[i]; g = im[i+1]; b = im[i+2];
            cdfR[r]++; cdfG[g]++; cdfB[b]++;
            maxR = Max(r, maxR);
            maxG = Max(g, maxG);
            maxB = Max(b, maxB);
            minR = Min(r, minR);
            minG = Min(g, minG);
            minB = Min(b, minB);
        }
        
        // compute cdf
        for (accumR=accumG=accumB=0,i=0; i<256; i+=32)
        { 
            // partial loop unrolling
            accumR += cdfR[i   ]; cdfR[i   ] = accumR;
            accumR += cdfR[i+1 ]; cdfR[i+1 ] = accumR;
            accumR += cdfR[i+2 ]; cdfR[i+2 ] = accumR;
            accumR += cdfR[i+3 ]; cdfR[i+3 ] = accumR;
            accumR += cdfR[i+4 ]; cdfR[i+4 ] = accumR;
            accumR += cdfR[i+5 ]; cdfR[i+5 ] = accumR;
            accumR += cdfR[i+6 ]; cdfR[i+6 ] = accumR;
            accumR += cdfR[i+7 ]; cdfR[i+7 ] = accumR;
            accumR += cdfR[i+8 ]; cdfR[i+8 ] = accumR;
            accumR += cdfR[i+9 ]; cdfR[i+9 ] = accumR;
            accumR += cdfR[i+10]; cdfR[i+10] = accumR;
            accumR += cdfR[i+11]; cdfR[i+11] = accumR;
            accumR += cdfR[i+12]; cdfR[i+12] = accumR;
            accumR += cdfR[i+13]; cdfR[i+13] = accumR;
            accumR += cdfR[i+14]; cdfR[i+14] = accumR;
            accumR += cdfR[i+15]; cdfR[i+15] = accumR;
            accumR += cdfR[i+16]; cdfR[i+16] = accumR;
            accumR += cdfR[i+17]; cdfR[i+17] = accumR;
            accumR += cdfR[i+18]; cdfR[i+18] = accumR;
            accumR += cdfR[i+19]; cdfR[i+19] = accumR;
            accumR += cdfR[i+20]; cdfR[i+20] = accumR;
            accumR += cdfR[i+21]; cdfR[i+21] = accumR;
            accumR += cdfR[i+22]; cdfR[i+22] = accumR;
            accumR += cdfR[i+23]; cdfR[i+23] = accumR;
            accumR += cdfR[i+24]; cdfR[i+24] = accumR;
            accumR += cdfR[i+25]; cdfR[i+25] = accumR;
            accumR += cdfR[i+26]; cdfR[i+26] = accumR;
            accumR += cdfR[i+27]; cdfR[i+27] = accumR;
            accumR += cdfR[i+28]; cdfR[i+28] = accumR;
            accumR += cdfR[i+29]; cdfR[i+29] = accumR;
            accumR += cdfR[i+30]; cdfR[i+30] = accumR;
            accumR += cdfR[i+31]; cdfR[i+31] = accumR;
        
            accumG += cdfG[i   ]; cdfG[i   ] = accumG;
            accumG += cdfG[i+1 ]; cdfG[i+1 ] = accumG;
            accumG += cdfG[i+2 ]; cdfG[i+2 ] = accumG;
            accumG += cdfG[i+3 ]; cdfG[i+3 ] = accumG;
            accumG += cdfG[i+4 ]; cdfG[i+4 ] = accumG;
            accumG += cdfG[i+5 ]; cdfG[i+5 ] = accumG;
            accumG += cdfG[i+6 ]; cdfG[i+6 ] = accumG;
            accumG += cdfG[i+7 ]; cdfG[i+7 ] = accumG;
            accumG += cdfG[i+8 ]; cdfG[i+8 ] = accumG;
            accumG += cdfG[i+9 ]; cdfG[i+9 ] = accumG;
            accumG += cdfG[i+10]; cdfG[i+10] = accumG;
            accumG += cdfG[i+11]; cdfG[i+11] = accumG;
            accumG += cdfG[i+12]; cdfG[i+12] = accumG;
            accumG += cdfG[i+13]; cdfG[i+13] = accumG;
            accumG += cdfG[i+14]; cdfG[i+14] = accumG;
            accumG += cdfG[i+15]; cdfG[i+15] = accumG;
            accumG += cdfG[i+16]; cdfG[i+16] = accumG;
            accumG += cdfG[i+17]; cdfG[i+17] = accumG;
            accumG += cdfG[i+18]; cdfG[i+18] = accumG;
            accumG += cdfG[i+19]; cdfG[i+19] = accumG;
            accumG += cdfG[i+20]; cdfG[i+20] = accumG;
            accumG += cdfG[i+21]; cdfG[i+21] = accumG;
            accumG += cdfG[i+22]; cdfG[i+22] = accumG;
            accumG += cdfG[i+23]; cdfG[i+23] = accumG;
            accumG += cdfG[i+24]; cdfG[i+24] = accumG;
            accumG += cdfG[i+25]; cdfG[i+25] = accumG;
            accumG += cdfG[i+26]; cdfG[i+26] = accumG;
            accumG += cdfG[i+27]; cdfG[i+27] = accumG;
            accumG += cdfG[i+28]; cdfG[i+28] = accumG;
            accumG += cdfG[i+29]; cdfG[i+29] = accumG;
            accumG += cdfG[i+30]; cdfG[i+30] = accumG;
            accumG += cdfG[i+31]; cdfG[i+31] = accumG;
        
            accumB += cdfB[i   ]; cdfB[i   ] = accumB;
            accumB += cdfB[i+1 ]; cdfB[i+1 ] = accumB;
            accumB += cdfB[i+2 ]; cdfB[i+2 ] = accumB;
            accumB += cdfB[i+3 ]; cdfB[i+3 ] = accumB;
            accumB += cdfB[i+4 ]; cdfB[i+4 ] = accumB;
            accumB += cdfB[i+5 ]; cdfB[i+5 ] = accumB;
            accumB += cdfB[i+6 ]; cdfB[i+6 ] = accumB;
            accumB += cdfB[i+7 ]; cdfB[i+7 ] = accumB;
            accumB += cdfB[i+8 ]; cdfB[i+8 ] = accumB;
            accumB += cdfB[i+9 ]; cdfB[i+9 ] = accumB;
            accumB += cdfB[i+10]; cdfB[i+10] = accumB;
            accumB += cdfB[i+11]; cdfB[i+11] = accumB;
            accumB += cdfB[i+12]; cdfB[i+12] = accumB;
            accumB += cdfB[i+13]; cdfB[i+13] = accumB;
            accumB += cdfB[i+14]; cdfB[i+14] = accumB;
            accumB += cdfB[i+15]; cdfB[i+15] = accumB;
            accumB += cdfB[i+16]; cdfB[i+16] = accumB;
            accumB += cdfB[i+17]; cdfB[i+17] = accumB;
            accumB += cdfB[i+18]; cdfB[i+18] = accumB;
            accumB += cdfB[i+19]; cdfB[i+19] = accumB;
            accumB += cdfB[i+20]; cdfB[i+20] = accumB;
            accumB += cdfB[i+21]; cdfB[i+21] = accumB;
            accumB += cdfB[i+22]; cdfB[i+22] = accumB;
            accumB += cdfB[i+23]; cdfB[i+23] = accumB;
            accumB += cdfB[i+24]; cdfB[i+24] = accumB;
            accumB += cdfB[i+25]; cdfB[i+25] = accumB;
            accumB += cdfB[i+26]; cdfB[i+26] = accumB;
            accumB += cdfB[i+27]; cdfB[i+27] = accumB;
            accumB += cdfB[i+28]; cdfB[i+28] = accumB;
            accumB += cdfB[i+29]; cdfB[i+29] = accumB;
            accumB += cdfB[i+30]; cdfB[i+30] = accumB;
            accumB += cdfB[i+31]; cdfB[i+31] = accumB;
        }
        
        // equalize each channel separately
        rangeR=(maxR-minR)/l2; rangeG=(maxG-minG)/l2; rangeB=(maxB-minB)/l2;
        if (notSupportClamp)
        {   
            for (i=0; i<l; i+=4)
            { 
                r = im[i]; g = im[i+1]; b = im[i+2]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            { 
                r = im[i]; g = im[i+1]; b = im[i+2]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        // return the new image data
        return im;
    }
    
    ,apply: function( im, w, h ) {
        var self = this;
        
        if ( MODE.RGB === self.mode ) return self._apply_rgb( im, w, h );
        
        var r, g, b, y, cb, cr, range, max = 0, min = 255,
            cdf, accum, i, l = im.length, l2 = l>>>2,
            is_grayscale = MODE.GRAY === self.mode;
        
        // initialize the arrays
        cdf = new A32F( 256 );
        // compute pdf and maxima/minima
        if ( is_grayscale )
        {
            for (i=0; i<l; i+=4)
            {
                r = im[i];
                cdf[ r ]++;
                max = Max(r, max);
                min = Min(r, min);
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                r = im[i]; g = im[i+1]; b = im[i+2];
                y =  ~~(0   + 0.299*r    + 0.587*g     + 0.114*b);
                cb = ~~(128 - 0.168736*r - 0.331264*g  + 0.5*b);
                cr = ~~(128 + 0.5*r      - 0.418688*g  - 0.081312*b);
                // clamp them manually
                cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                y = y<0 ? 0 : (y>255 ? 255 : y);
                cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                im[i] = cr; im[i+1] = y; im[i+2] = cb;
                cdf[ y ]++;
                max = Max(y, max);
                min = Min(y, min);
            }
        }
        
        // compute cdf
        for (accum=0,i=0; i<256; i+=32)
        { 
            // partial loop unrolling
            accum += cdf[i   ]; cdf[i   ] = accum;
            accum += cdf[i+1 ]; cdf[i+1 ] = accum;
            accum += cdf[i+2 ]; cdf[i+2 ] = accum;
            accum += cdf[i+3 ]; cdf[i+3 ] = accum;
            accum += cdf[i+4 ]; cdf[i+4 ] = accum;
            accum += cdf[i+5 ]; cdf[i+5 ] = accum;
            accum += cdf[i+6 ]; cdf[i+6 ] = accum;
            accum += cdf[i+7 ]; cdf[i+7 ] = accum;
            accum += cdf[i+8 ]; cdf[i+8 ] = accum;
            accum += cdf[i+9 ]; cdf[i+9 ] = accum;
            accum += cdf[i+10]; cdf[i+10] = accum;
            accum += cdf[i+11]; cdf[i+11] = accum;
            accum += cdf[i+12]; cdf[i+12] = accum;
            accum += cdf[i+13]; cdf[i+13] = accum;
            accum += cdf[i+14]; cdf[i+14] = accum;
            accum += cdf[i+15]; cdf[i+15] = accum;
            accum += cdf[i+16]; cdf[i+16] = accum;
            accum += cdf[i+17]; cdf[i+17] = accum;
            accum += cdf[i+18]; cdf[i+18] = accum;
            accum += cdf[i+19]; cdf[i+19] = accum;
            accum += cdf[i+20]; cdf[i+20] = accum;
            accum += cdf[i+21]; cdf[i+21] = accum;
            accum += cdf[i+22]; cdf[i+22] = accum;
            accum += cdf[i+23]; cdf[i+23] = accum;
            accum += cdf[i+24]; cdf[i+24] = accum;
            accum += cdf[i+25]; cdf[i+25] = accum;
            accum += cdf[i+26]; cdf[i+26] = accum;
            accum += cdf[i+27]; cdf[i+27] = accum;
            accum += cdf[i+28]; cdf[i+28] = accum;
            accum += cdf[i+29]; cdf[i+29] = accum;
            accum += cdf[i+30]; cdf[i+30] = accum;
            accum += cdf[i+31]; cdf[i+31] = accum;
        }
        
        // equalize only the intesity channel
        range = (max-min)/l2;
        if (notSupportClamp)
        {   
            if ( is_grayscale )
            {
                for (i=0; i<l; i+=4)
                { 
                    r = ~~(cdf[im[i]]*range + min);
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    im[i] = r; im[i+1] = r; im[i+2] = r; 
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                { 
                    y = cdf[im[i+1]]*range + min; cb = im[i+2]; cr = im[i];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    g = g<0 ? 0 : (g>255 ? 255 : g);
                    b = b<0 ? 0 : (b>255 ? 255 : b);
                    im[i] = r; im[i+1] = g; im[i+2] = b; 
                }
            }
        }
        else
        {
            if ( is_grayscale )
            {
                for (i=0; i<l; i+=4)
                { 
                    r = ~~(cdf[im[i]]*range + min);
                    im[i] = r; im[i+1] = r; im[i+2] = r; 
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                { 
                    y = cdf[im[i+1]]*range + min; cb = im[i+2]; cr = im[i];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    im[i] = r; im[i+1] = g; im[i+2] = b; 
                }
            }
        }
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Rectangular Pixelate Filter, Triangular Pixelate Filter, Hexagonal Pixelate Filter Plugins
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var IMG = FILTER.ImArray, sqrt = Math.sqrt, min = Math.min, max = Math.max, SQRT_3 = sqrt(3.0);

// a simple fast Rectangular Pixelate filter
FILTER.Create({
    name: "PixelateFilter"
    
    // parameters
    ,scale: 1
    
    // this is the filter constructor
    ,init: function( scale ) {
        var self = this;
        self.scale = scale || 1;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
            scale: self.scale
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.scale = params.scale;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        if ( !self._isOn || self.scale <= 1 ) return im;
        if ( self.scale > 100 ) self.scale = 100;
        
        var dst, imLen = im.length, imArea = imLen>>>2,
            step, stepx, stepy,
            bx = w-1, by = imArea-w, p1, p2, p3, p4, p5, r, g, b,
            i, x, yw, sx, sy, syw, pxa, pya, pxb, pyb, pxc, pyc
        ;
        
        dst = new IMG(imLen);
        step = (sqrt(imArea)*self.scale*0.01)|0;
        stepx = step-1; stepy = w*stepx;
        
        // do pixelation via interpolation on 5 points of a certain rectangle
        x=yw=sx=sy=syw=0;
        for (i=0; i<imLen; i+=4)
        {
            pxa = x-sx; pya = yw-syw;
            pxb = min(bx, pxa+stepx); pyb = min(by, pya+stepy);
            //pxc = (pxa>>>1)+(pxb>>>1); pyc = (pya>>>1)+(pyb>>>1);
            
            // these edge conditions create the rectangular pattern
            p1 = (pxa + pya) << 2;
            p2 = (pxa + pyb) << 2;
            p3 = (pxb + pya) << 2;
            p4 = (pxb + pyb) << 2;
            //p5 = (pxc + pyc) << 2;
            
            // compute rectangular interpolation
            r = im[p1  ]+im[p2  ]+im[p3  ]+im[p4  ]/*+im[p5  ]*/;
            g = im[p1+1]+im[p2+1]+im[p3+1]+im[p4+1]/*+im[p5+1]*/;
            b = im[p1+2]+im[p2+2]+im[p3+2]+im[p4+2]/*+im[p5+2]*/;
            dst[i] = (0.25*r)|0; dst[i+1] = (0.25*g)|0; dst[i+2] = (0.25*b)|0; dst[i+3] = im[i+3];
            
            // next pixel
            x++; sx++; 
            if ( x >= w ) 
            { 
                sx=0; x=0; sy++; syw+=w; yw+=w;
                if ( sy >= step ) { sy=0; syw=0; }
            }
            if ( sx >= step ) { sx=0; }
        }
        // return the pixelated image data
        return dst;
    }
});

// a simple fast Triangular Pixelate filter
FILTER.Create({
    name: "TriangularPixelateFilter"
    
    // parameters
    ,scale: 1
    
    // this is the filter constructor
    ,init: function( scale ) {
        var self = this;
        self.scale = scale || 1;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
            scale: self.scale
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.scale = params.scale;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        if ( !self._isOn || self.scale <= 1 ) return im;
        if ( self.scale > 100 ) self.scale = 100;
        
        var dst, imLen = im.length, imArea = (imLen>>>2),
            step, stepx, stepy,
            bx = w-1, by = imArea-w, p1, p2, p3, p4, r, g, b,
            i, x, yw, sx, sy, syw, pxa, pya, pxb, pyb, pxc, pyc
        ;
        
        dst = new IMG(imLen);
        step = (sqrt(imArea)*self.scale*0.01)|0;
        stepx = step-1; stepy = w*stepx;
        
        // do pixelation via interpolation on 4 points of a certain triangle
        x=yw=sx=sy=syw=0;
        for (i=0; i<imLen; i+=4)
        {
            pxa = x-sx; pya = yw-syw;
            pxb = min(bx, pxa+stepx); pyb = min(by, pya+stepy);
            //pxc = (pxa>>>1)+(pxb>>>1); pyc = (pya>>>1)+(pyb>>>1);
            
            // these edge conditions create the various triangular patterns
            if ( sx+sy > stepx ) 
            { 
                // second triangle
                p1 = (pxb + pya) << 2;
                p2 = (pxb + pyb) << 2;
                p3 = (pxa + pya) << 2;
                //p4 = (pxc + pyc) << 2;
            }
            else
            {
                // first triangle
                p1 = (pxa + pya) << 2;
                p2 = (pxa + pyb) << 2;
                p3 = (pxb + pya) << 2;
                //p4 = (pxc + pyc) << 2;
            }
            
            // compute triangular interpolation
            r = im[p1  ]+im[p2  ]+im[p3  ]/*+im[p4  ]*/;
            g = im[p1+1]+im[p2+1]+im[p3+1]/*+im[p4+1]*/;
            b = im[p1+2]+im[p2+2]+im[p3+2]/*+im[p4+2]*/;
            dst[i] = (0.333*r)|0; dst[i+1] = (0.333*g)|0; dst[i+2] = (0.333*b)|0; dst[i+3] = im[i+3];
            
            // next pixel
            x++; sx++; 
            if ( x >= w ) 
            { 
                sx=0; x=0; sy++; syw+=w; yw+=w;
                if ( sy >= step ) { sy=0; syw=0; }
            }
            if ( sx >= step ) { sx=0; }
        }
        // return the pixelated image data
        return dst;
    }
});

/*
TO BE ADDED
// a simple fast Hexagonal Pixelate filter
FILTER.Create({
    name: "HexagonalPixelateFilter"
    
    // parameters
    ,scale: 1
    
    // this is the filter constructor
    ,init: function( scale ) {
        var self = this;
        self.scale = scale || 1;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
            scale: self.scale
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.scale = params.scale;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        if ( !self._isOn || self.scale <= 1 ) return im;
        if ( self.scale > 100 ) self.scale = 100;
        
        var dst, imLen = im.length, imArea = (imLen>>>2),
            step, step_1, step_2, stepx, stepy, stepx_2, stepy_2,
            bx = w-1, by = imArea-w,
            p1, p2, p3, p4, p5, p6, p7, d, r, g, b,
            i, x, yw, sx, sy, syw, sx2, sy2, pxa, pya, pxb, pyb, pxc, pyc, pxd
        ;
        
        dst = new IMG(imLen);
        step = (sqrt(imArea)*self.scale*0.01)|0; d = ~~(step/SQRT_3);
        step_1 = step-1; step_2 = step >>> 1;
        stepx_2 = (step/*+d+d* /) >>> 1; stepx = step_1/*+d+d* /;
        stepy_2 = w*step_2; stepy = w*step_1;
        
        // do pixelation via interpolation on 4 points of a certain ractangle
        x=yw=0; sx=sy=syw=0;
        for (i=0; i<imLen; i+=4)
        {
            // these edge conditions create the various hexagonal patterns
            if ( 2*(step_2-sy) > SQRT_3*sx ) 
            { 
                // top left hexagon
                pxa = max(0, x-sx-stepx); pya = max(0, yw-syw-stepy_2);
            }
            else if ( 2*sy > SQRT_3*sx ) 
            { 
                // bottom left hexagon
                pxa = max(0, x-sx-stepx); pya = min(by, yw-syw+stepy_2);
            }
            else if ( 2*(step_2-sy) > SQRT_3*(stepx+d+d-sx) ) 
            { 
                // top right hexagon
                pxa = min(bx, x-sx+stepx); pya = max(0, yw-syw-stepy_2);
            }
            else if ( 2*sy > SQRT_3*(stepx+d+d-sx) ) 
            { 
                // bottom right hexagon
                pxa = min(bx, x-sx+stepx); pya = min(by, yw-syw+stepy_2);
            }
            else
            { 
                // center hexagon
                pxa = min(bx, x-sx); pya = max(0, yw-syw);
            }
            
            pxb = min(bx, pxa+step_1); pyb = min(by, pya+stepy);
            
            p1 = (pxa + pya) << 2;
            p2 = (pxb + pya) << 2;
            p3 = (pxb + pyb) << 2;
            p4 = (pxa + pyb) << 2;
            
            // compute hexagonal interpolation
            r = im[p1  ]+im[p2  ]+im[p3  ]+im[p4  ];
            g = im[p1+1]+im[p2+1]+im[p3+1]+im[p4+1];
            b = im[p1+2]+im[p2+2]+im[p3+2]+im[p4+2];
            dst[i] = (0.25*r)|0; dst[i+1] = (0.25*g)|0; dst[i+2] = (0.25*b)|0; dst[i+3] = im[i+3];
            
            // next pixel
            x++; sx++; 
            if ( x >= w ) 
            { 
                sx=0; x=0; sy++; syw+=w; yw+=w;
                if ( sy > step_1 ) { sy=0; syw=0; }
            }
            if ( sx > stepx ) { sx=0; }
        }
        
        // return the pixelated image data
        return dst;
    }
});*/

}(FILTER);/**
*
* Halftone Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var f1 = 7/16, f2 = 3/16, f3 = 5/16, f4 = 1/16, 
    MODE = FILTER.MODE, A32F = FILTER.Array32F, clamp = FILTER.Color.clamp,
    intensity = FILTER.Color.intensity;

// http://en.wikipedia.org/wiki/Halftone
// http://en.wikipedia.org/wiki/Error_diffusion
// http://www.visgraf.impa.br/Courses/ip00/proj/Dithering1/average_dithering.html
// http://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering
FILTER.Create({
    name: "HalftoneFilter"
    
    // parameters
    ,size: 1
    ,thresh: 0.4
    ,mode: MODE.GRAY
    //,inverse: false
    
    // this is the filter constructor
    ,init: function( size, threshold, mode/*, inverse*/ ) {
        var self = this;
        self.size = size || 1;
        self.thresh = clamp(null == threshold ? 0.4 : threshold,0,1);
        self.mode = mode || MODE.GRAY;
        //self.inverse = !!inverse
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,threshold: function( t ) {
        this.thresh = clamp(t,0,1);
        return this;
    }
    
    /*,invert: function( bool ) {
        if ( !arguments.length ) bool = true;
        this.inverse = !!bool;
        return this;
    }*/
    
    ,serialize: function( ) {
        var self = this;
        return {
             size: self.size
            ,thresh: self.thresh
            //,inverse: self.inverse
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.size = params.size;
        self.thresh = params.thresh;
        //self.inverse = params.inverse;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this, l = im.length, imSize = l>>>2,
            err = new A32F(imSize*3), pixel, index, t, rgb, ycbcr,
            size = self.size, area = size*size, invarea = 1.0/area,
            threshold = 255*self.thresh, size2 = size2<<1,
            colored = MODE.RGB === self.mode, x, y, yw, sw = size*w, i, j, jw, 
            sum_r, sum_g, sum_b, r, g, b, qr, qg, qb, qrf, qgf, qbf
            //,inverse = self.inverse,one = inverse?0:255, zero = inverse?255:0
            ,f11 = /*area**/f1, f22 = /*area**/f2
            ,f33 = /*area**/f3, f44 = /*area**/f4
        ;
        
        for(y=0,yw=0,x=0; y<h; )
        {
            sum_r = sum_g = sum_b = 0;
            if ( colored )
            {
                for(i=0,j=0,jw=0; j<size; )
                {
                    pixel = (x+yw+i+jw)<<2; index = (x+yw+i+jw)*3;
                    sum_r += im[pixel  ] + err[index  ];
                    sum_g += im[pixel+1] + err[index+1];
                    sum_b += im[pixel+2] + err[index+2];
                    if ( ++i>=size ) {i=0; j++; jw+=w;}
                }
                sum_r *= invarea; sum_g *= invarea; sum_b *= invarea;
                t = intensity(sum_r, sum_g, sum_b);
                if ( t > threshold )
                {
                    r = sum_r|0; g = sum_g|0; b = sum_b|0;
                }
                else
                {                
                    r = 0; g = 0; b = 0;
                }
            }
            else
            {
                for(i=0,j=0,jw=0; j<size; )
                {
                    pixel = (x+yw+i+jw)<<2; index = (x+yw+i+jw)*3;
                    sum_r += im[pixel  ] + err[index  ];
                    if ( ++i>=size ) {i=0; j++; jw+=w;}
                }
                t = sum_r * invarea;
                if ( t > threshold )
                {
                    r = 255; g = 255; b = 255;
                }
                else
                {                
                    r = 0; g = 0; b = 0;
                }
            }
            
            pixel = (x+yw)<<2;
            qr = im[pixel  ] - r;
            qg = im[pixel+1] - g;
            qb = im[pixel+2] - b;
            
            if ( x+size<w )
            {                
                qrf = f11*qr; qgf = f11*qg; qbf = f11*qb;
                for(i=size,j=0,jw=0; j<size; )
                {
                    index = (x+yw+i+jw)*3;
                    err[index  ] += qrf;
                    err[index+1] += qgf;
                    err[index+2] += qbf;
                    if ( ++i>=size2 ) {i=size; j++; jw+=w;}
                }
            }
            if ( y+size<h && x>size) 
            {
                qrf = f22*qr; qgf = f22*qg; qbf = f22*qb;
                for(i=-size,j=size,jw=0; j<size2; )
                {
                    index = (x+yw+i+jw)*3;
                    err[index  ] += qrf;
                    err[index+1] += qgf;
                    err[index+2] += qbf;
                    if ( ++i>=0 ) {i=-size; j++; jw+=w;}
                }
            }
            if ( y+size<h ) 
            {
                qrf = f33*qr; qgf = f33*qg; qbf = f33*qb;
                for(i=0,j=size,jw=0; j<size2; )
                {
                    index = (x+yw+i+jw)*3;
                    err[index  ] += qrf;
                    err[index+1] += qgf;
                    err[index+2] += qbf;
                    if ( ++i>=size ) {i=0; j++; jw+=w;}
                }
            }
            if ( y+size<h && x+size<w )
            {
                qrf = f44*qr; qgf = f44*qg; qbf = f44*qb;
                for(i=size,j=size,jw=0; j<size2; )
                {
                    index = (x+yw+i+jw)*3;
                    err[index  ] += qrf;
                    err[index+1] += qgf;
                    err[index+2] += qbf;
                    if ( ++i>=size2 ) {i=size; j++; jw+=w;}
                }
            }
            
            for(i=0,j=0,jw=0; j<size; )
            {
                pixel = (x+yw+i+jw)<<2;
                im[pixel  ] = r;
                im[pixel+1] = g;
                im[pixel+2] = b;
                if ( ++i>=size ) {i=0; j++; jw+=w;}
            }
            
            x+=size; if ( x>=w ) {x=0; y+=size; yw+=sw;}
        }
        return im;
    }
});

}(FILTER);/**
*
* Drop Shadow Filter Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var IMG = FILTER.ImArray, integral_convolution = FILTER.Util.Filter.integral_convolution,
    MODE = FILTER.MODE, boxKernel_3x3 = new FILTER.ConvolutionMatrix([
        1/9,1/9,1/9,
        1/9,1/9,1/9,
        1/9,1/9,1/9
    ]);

// adapted from http://www.jhlabs.com/ip/filters/
// analogous to ActionScript filter
FILTER.Create({
     name: "DropShadowFilter"
    
    // parameters
    ,offsetX: null
    ,offsetY: null
    ,color: 0
    ,opacity: 1
    ,quality: 1
    ,onlyShadow: false
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    // constructor
    ,init: function( offsetX, offsetY, color, opacity, quality, onlyShadow ) {
        var self = this;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        self.color = color || 0;
        self.opacity = null == opacity ? 1.0 : +opacity;
        self.quality = (quality || 1)|0;
        self.onlyShadow = !!onlyShadow;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.offsetX = null;
        self.offsetY = null;
        self.color = null;
        self.opacity = null;
        self.quality = null;
        self.onlyShadow = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             offsetX: self.offsetX
            ,offsetY: self.offsetY
            ,color: self.color
            ,opacity: self.opacity
            ,quality: self.quality
            ,onlyShadow: self.onlyShadow
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.offsetX = params.offsetX;
        self.offsetY = params.offsetY;
        self.color = params.color;
        self.opacity = params.opacity;
        self.quality = params.quality;
        self.onlyShadow = params.onlyShadow;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        if ( !self._isOn ) return im;
        var color = self.color||0, a = self.opacity, quality = self.quality,
            onlyShadow = self.onlyShadow, offX = self.offsetX||0, offY = self.offsetY||0,
            r, g, b, imSize = im.length, imArea = imSize>>>2, i, x, y, sx, sy, si, ai, aa, shadow;
            
        if ( 0.0 > a ) a = 0.0;
        if ( 1.0 < a ) a = 1.0;
        if ( 0.0 === a ) return im;
        
        r = (color>>>16)&255; g = (color>>>8)&255; b = (color)&255;
        
        if ( 0 >= quality ) quality = 1;
        if ( 3 < quality ) quality = 3;
        
        shadow = new IMG(imSize);
        
        // generate shadow from image alpha channel
        for(i=0; i<imSize; i+=4)
        {
            ai = im[i+3];
            if ( ai > 0 )
            {
                shadow[i  ] = r;
                shadow[i+1] = g;
                shadow[i+2] = b;
                shadow[i+3] = (a*ai)|0;
            }
            /*else
            {
                shadow[i  ] = 0;
                shadow[i+1] = 0;
                shadow[i+2] = 0;
                shadow[i+3] = 0;
            }*/
        }
        
        // blur shadow, quality is applied multiple times for smoother effect
        shadow = integral_convolution(r===g && g===b ? MODE.GRAY : MODE.RGB, shadow, w, h, boxKernel_3x3, null, 3, 3, 1.0, 0.0, quality);
        
        // offset and combine with original image
        offY *= w;
        if ( onlyShadow )
        {
            // return only the shadow
            for(x=0,y=0,si=0; si<imSize; si+=4,x++)
            {
                if ( x >= w ) {x=0; y+=w;}
                sx = x+offX; sy = y+offY;
                if ( 0 > sx || sx >= w || 0 > sy || sy >= imArea /*|| 0 === shadow[si+3]*/ ) continue;
                i = (sx + sy) << 2;
                im[i  ] = shadow[si  ]; im[i+1] = shadow[si+1]; im[i+2] = shadow[si+2]; im[i+3] = shadow[si+3];
            }
        }
        else
        {
            // return image with shadow
            for(x=0,y=0,si=0; si<imSize; si+=4,x++)
            {
                if ( x >= w ) {x=0; y+=w;}
                sx = x+offX; sy = y+offY;
                if ( 0 > sx || sx >= w || 0 > sy || sy >= imArea ) continue;
                i = (sx + sy) << 2; ai = im[i+3]; a = shadow[si+3];
                if ( (255 === ai) || (0 === a) ) continue;
                a /= 255; //ai /= 255; //aa = ai + a*(1.0-ai);
                // src over composition
                // https://en.wikipedia.org/wiki/Alpha_compositing
                /*im[i  ] = (im[i  ]*ai + shadow[si  ]*a*(1.0-ai))/aa;
                im[i+1] = (im[i+1]*ai + shadow[si+1]*a*(1.0-ai))/aa;
                im[i+2] = (im[i+2]*ai + shadow[si+2]*a*(1.0-ai))/aa;*/
                //im[i+3] = aa*255;
                r = im[i  ] + (shadow[si  ]-im[i  ])*a;
                g = im[i+1] + (shadow[si+1]-im[i+1])*a;
                b = im[i+2] + (shadow[si+2]-im[i+2])*a;
                im[i  ] = r|0; im[i+1] = g|0; im[i+2] = b|0;
            }
        }
        return im;
    }
});

}(FILTER);/**
*
* Bokeh (Depth-of-Field) Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var Sqrt = Math.sqrt, Exp = Math.exp, Log = Math.log, 
    Abs = Math.abs, Floor = Math.floor,
    notSupportClamp = FILTER._notSupportClamp, A32F = FILTER.Array32F;

// a simple bokeh (depth-of-field) filter
FILTER.Create({
    name: "BokehFilter"
    
    // parameters
    ,centerX: 0.0
    ,centerY: 0.0
    ,radius: 10
    ,amount: 10
    
    // this is the filter constructor
    ,init: function( centerX, centerY, radius, amount ) {
        var self = this;
        self.centerX = centerX || 0.0;
        self.centerY = centerY || 0.0;
        self.radius = radius || 10;
        self.amount = amount || 10;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
             centerX: self.centerX
            ,centerY: self.centerY
            ,radius: self.radius
            ,amount: self.amount
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.centerX = params.centerX;
        self.centerY = params.centerY;
        self.radius = params.radius;
        self.amount = params.amount;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        if ( !self._isOn ) return im;
        var imLen = im.length, imArea, 
            integral, integralLen, colR, colG, colB,
            rowLen, i, j, x , y, ty, 
            cX = self.centerX||0, cY = self.centerY||0, 
            r = self.radius, m = self.amount,
            d, dx, dy, blur, blurw, wt,
            xOff1, yOff1, xOff2, yOff2,
            p1, p2, p3, p4, t0, t1, t2,
            bx1, bx2, by1, by2
        ;
        
        if ( m<=0 ) return im;
        
        imArea = (imLen>>>2);
        bx1=0; bx2=w-1; by1=0; by2=imArea-w;
        
        // make center relative
        cX = Floor(cX*(w-1));
        cY = Floor(cY*(h-1));
        
        integralLen = (imArea<<1)+imArea;  rowLen = (w<<1)+w;
        integral = new A32F(integralLen);
        
        // compute integral of image in one pass
        // first row
        i=0; j=0; x=0; colR=colG=colB=0;
        for (x=0; x<w; x++, i+=4, j+=3)
        {
            colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
            integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
        }
        // other rows
        i=rowLen+w; j=0; x=0; colR=colG=colB=0;
        for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
        {
            if (x>=w) { x=0; colR=colG=colB=0; }
            colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
            integral[j+rowLen]=integral[j]+colR; 
            integral[j+rowLen+1]=integral[j+1]+colG; 
            integral[j+rowLen+2]=integral[j+2]+colB;
        }
        
        
        // bokeh (depth-of-field) effect 
        // is a kind of adaptive blurring depending on distance from a center
        // like the camera/eye is focused on a specific area and everything else appears increasingly blurred
        
        x=0; y=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; y++; ty+=w; }
            
            // compute distance
            dx = x-cX; dy = y-cY;
            //d = Sqrt(dx*dx + dy*dy);
            d = Abs(dx) + Abs(dy);  // approximation
            
            // calculate amount(radius) of blurring 
            // depending on distance from focus center
            blur = d>r ? Log((d-r)*m)|0 : (d/r+0.5)|0; // smooth it a bit, around the radius edge condition
            
            if ( blur > 0 )
            {
                 blurw = blur*w; wt = 0.25/(blur*blur);
                 
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                xOff1 = x - blur; yOff1 = ty - blurw;
                xOff2 = x + blur; yOff2 = ty + blurw;
                
                // fix borders
                if (xOff1<bx1) xOff1=bx1;
                else if (xOff2>bx2) xOff2=bx2;
                if (yOff1<by1) yOff1=by1;
                else if (yOff2>by2) yOff2=by2;
                
                // compute integral positions
                p1 = xOff1 + yOff1; p4 = xOff2 + yOff2; p2 = xOff2 + yOff1; p3 = xOff1 + yOff2;
                // arguably faster way to write p1*=3; etc..
                p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
                
                // apply a fast box-blur to these pixels
                // compute matrix sum of these elements 
                // (trying to avoid possible overflow in the process, order of summation can matter)
                t0 = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                t1 = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                t2 = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                
                // output
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                }
                im[i] = t0|0;  im[i+1] = t1|0;  im[i+2] = t2|0;
                // alpha channel is not transformed
                //im[i+3] = im[i+3];
            }
        }
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Seamless Tile Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

// a plugin to create a seamless tileable pattern from an image
// adapted from: http://www.blitzbasic.com/Community/posts.php?topic=43846
FILTER.Create({
    name: "SeamlessTileFilter"
    
    ,type: 2 // 0 radial, 1 linear 1, 2 linear 2
    
    // constructor
    ,init: function( mode ) {
        var self = this;
        self.type = null == mode ? 2 : (mode||0);
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
            type: self.type
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.type = params.type;
        return self;
    }
    
    // this is the filter actual apply method routine
    // adapted from: http://www.blitzbasic.com/Community/posts.php?topic=43846
    ,apply: function(im, w, h) {
        var self = this, masktype = self.type,
            resize = FILTER.Interpolation.bilinear,
            IMG = FILTER.ImArray, A8U = FILTER.Array8U,
            //needed arrays
            diagonal, tile, mask, a1, a2, a3, d, i, j, k, 
            index, N, N2, size, imSize, sqrt = Math.sqrt;

        //find largest side of the image
        //and resize the image to become square
        if ( w !== h ) im = resize( im, w, h, N = w > h ? w : h, N );
        else  N = w; 
        N2 = Math.round(N/2);
        size = N*N; imSize = im.length;
        diagonal = new IMG(imSize);
        tile = new IMG(imSize);
        mask = new A8U(size);

        for (i=0,j=0,k=0; k<imSize; k+=4,i++)
        {
            if ( i >= N ) {i=0; j++;}
            index = ((i+N2)%N + ((j+N2)%N)*N)<<2;
            diagonal[index  ] = im[k  ];
            diagonal[index+1] = im[k+1];
            diagonal[index+2] = im[k+2];
            diagonal[index+3] = im[k+3];
        }

        //try to make your own masktypes here
        if ( 0 === masktype ) //RADIAL
        {
            //Create the mask
            for (i=0,j=0; i<N2; j++)
            {
                if ( j >= N2 ) { j=0; i++; }
                
                //Scale d To range from 1 To 255
                d = 255 - (255 * sqrt((i-N2)*(i-N2) + (j-N2)*(j-N2)) / N2);
                d = d < 1 ? 1 : (d > 255 ? 255 : d);

                //Form the mask in Each quadrant
                mask [i     + j*N      ] = d;
                mask [i     + (N-1-j)*N] = d;
                mask [N-1-i + j*N      ] = d;
                mask [N-1-i + (N-1-j)*N] = d;
            }
        }
        else if ( 1 === masktype ) //LINEAR 1
        {
            //Create the mask
            for (i=0,j=0; i<N2; j++)
            {
                if ( j >= N2 ) { j=0; i++; }
                
                //Scale d To range from 1 To 255
                d = 255 - (255 * (N2+j < N2+i ? (j-N2)/N2 : (i-N/2)/N2));
                d = d < 1 ? 1 : (d > 255 ? 255 : d);

                //Form the mask in Each quadrant
                mask [i     + j*N      ] = d;
                mask [i     + (N-1-j)*N] = d;
                mask [N-1-i + j*N      ] = d;
                mask [N-1-i + (N-1-j)*N] = d;
            }
        }
        else //if ( 2 === masktype ) //LINEAR 2
        {
            //Create the mask
            for (i=0,j=0; i<N2; j++)
            {
                if ( j >= N2 ) { j=0; i++; }
                
                //Scale d To range from 1 To 255
                d = 255 - (255 * (N2+j < N2+i ? sqrt((j-N)*(j-N) + (i-N)*(i-N)) / (1.13*N) : sqrt((i-N)*(i-N) + (j-N)*(j-N)) / (1.13*N)));
                d = d < 1 ? 1 : (d > 255 ? 255 : d);

                //Form the mask in Each quadrant
                mask [i     + j*N      ] = d;
                mask [i     + (N-1-j)*N] = d;
                mask [N-1-i + j*N      ] = d;
                mask [N-1-i + (N-1-j)*N] = d;
            }
        }

        //Create the tile
        for (j=0,i=0; j<N; i++)
        {
            if ( i >= N ) {i=0; j++;}
            index = i+j*N;
            a1 = mask[index]; a2 = mask[(i+N2) % N + ((j+N2) % N)*N];
            a3 = a1+a2; a1 /= a3; a2 /= a3; index <<= 2;
            tile[index  ] = ~~(a1*im[index  ] + a2*diagonal[index  ]);
            tile[index+1] = ~~(a1*im[index+1] + a2*diagonal[index+1]);
            tile[index+2] = ~~(a1*im[index+2] + a2*diagonal[index+2]);
            tile[index+3] = im[index+3];
        }

        //create the new tileable image
        //if it wasn't a square image, resize it back to the original scale
        if ( w !== h ) tile = resize( tile, N, N, w, h );

        // return the new image data
        return tile;
    }
});

}(FILTER);/**
*
* FloodFill, PatternFill Plugin(s)
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var TypedArray = FILTER.Util.Array.typed, abs = Math.abs,
    min = Math.min, max = Math.max, ceil = Math.ceil,
    MODE = FILTER.MODE, Array8U = FILTER.Array8U, Array32U = FILTER.Array32U;
    
// a fast flood fill filter using scanline algorithm
// adapted from: A Seed Fill Algorithm, by Paul Heckbert from "Graphics Gems", Academic Press, 1990
// http://en.wikipedia.org/wiki/Flood_fill
// http://www.codeproject.com/Articles/6017/QuickFill-An-efficient-flood-fill-algorithm
// http://www.codeproject.com/Articles/16405/Queue-Linear-Flood-Fill-A-Fast-Flood-Fill-Algorith
FILTER.Create({
    name : "FloodFillFilter"
    ,x: 0
    ,y: 0
    ,color: null
    ,borderColor: null
    ,tolerance: 0.0
    
    ,path: FILTER_PLUGINS_PATH
    
    ,init: function( x, y, color, tolerance, borderColor ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.color = color || 0;
        self.tolerance = tolerance || 0.0;
        self.borderColor = borderColor === +borderColor ? +borderColor : null;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             color: self.color
            ,borderColor: self.borderColor
            ,x: self.x
            ,y: self.y
            ,tolerance: self.tolerance
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.color = params.color;
        self.borderColor = params.borderColor;
        self.x = params.x;
        self.y = params.y;
        self.tolerance = params.tolerance;
        return self;
    }
    
    // this is the filter actual apply method routine
    /* adapted from:
     * A Seed Fill Algorithm
     * by Paul Heckbert
     * from "Graphics Gems", Academic Press, 1990
     */
    ,apply: function(im, w, h) {
        var self = this, 
            /* seems to have issues when tol is exactly 1.0*/
            tol = (255*(self.tolerance>=1.0 ? 0.999 : self.tolerance))|0,
            color = self.color || 0, borderColor = self.borderColor,
            isBorderColor = borderColor === +borderColor, OC, NC, /*pix = 4,*/ dy = w<<2, 
            x0 = self.x, y0 = self.y, imSize = im.length,
            ymin = 0, ymax = imSize-dy, xmin = 0, xmax = (w-1)<<2,
            l, i, x, x1, x2, yw, stack, slen, segment, notdone
        ;
        /*
         * Filled horizontal segment of scanline y for xl<=x<=xr.
         * Parent segment was on line y-dy.  dy=1 or -1
         */
        yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ) return im;
        
        OC = new Array8U(3); NC = new Array8U(3);
        NC[0] = (color >>> 16) & 255; NC[1] = (color >>> 8) & 255; NC[2] = color & 255; //NC[3] = (color >>> 24) & 255;
        // seed color is the image color at x0,y0 position
        if ( isBorderColor )
        {
            OC[0] = (borderColor >>> 16) & 255; OC[1] = (borderColor >>> 8) & 255; OC[2] = borderColor & 255;
            if ( abs(OC[0]-im[x0+yw])<=tol && abs(OC[1]-im[x0+yw+1])<=tol && abs(OC[2]-im[x0+yw+2])<=tol ) return im;
        }
        else
        {
            if ( im[x0+yw] === NC[0] && im[x0+yw+1] === NC[1] && im[x0+yw+2] === NC[2] ) return im;
            OC[0] = im[x0+yw]; OC[1] = im[x0+yw+1]; OC[2] = im[x0+yw+2];
        }
        
        stack = new Array(imSize>>>2); slen = 0; // pre-allocate and soft push/pop for speed
        
        if ( yw+dy >= ymin && yw+dy <= ymax ) stack[slen++]=[yw, x0, x0, dy]; /* needed in some cases */
        /*if ( yw >= ymin && yw <= ymax)*/ stack[slen++]=[yw+dy, x0, x0, -dy]; /* seed segment (popped 1st) */
        
        while ( slen > 0 ) 
        {
            /* pop segment off stack and fill a neighboring scan line */
            segment = stack[--slen];
            yw = segment[0]+(dy=segment[3]); x1 = segment[1]; x2 = segment[2];
            
            /*
             * segment of scan line y-dy for x1<=x<=x2 was previously filled,
             * now explore adjacent pixels in scan line y
             */
            if ( isBorderColor )
            {
                for (x=x1; x>=xmin; x-=4)
                {
                    i = x+yw;
                    if ( abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                    {
                        break;
                    }
                    else
                    {
                        im[i  ] = NC[0];
                        im[i+1] = NC[1];
                        im[i+2] = NC[2];
                    }
                }
            }
            else
            {
                for (x=x1; x>=xmin; x-=4)
                {
                    i = x+yw;
                    if ( abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                    {
                        im[i  ] = NC[0];
                        im[i+1] = NC[1];
                        im[i+2] = NC[2];
                    }
                    else
                    {
                        break;
                    }
                }
            }
            if ( x >= x1 ) 
            {
                // goto skip:
                i = x+yw;
                if ( isBorderColor )
                {
                    while ( x<=x2 && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                else
                {
                    while ( x<=x2 && !(abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+4;
                if ( l < x1 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax ) stack[slen++]=[yw, l, x1-4, -dy];  /* leak on left? */
                }
                x = x1+4;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                i = x+yw;
                if ( isBorderColor )
                {
                    while ( x<=xmax && !(abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        im[i  ] = NC[0];
                        im[i+1] = NC[1];
                        im[i+2] = NC[2];
                        x+=4; i = x+yw;
                    }
                }
                else
                {
                    while ( x<=xmax && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                    {
                        im[i  ] = NC[0];
                        im[i+1] = NC[1];
                        im[i+2] = NC[2];
                        x+=4; i = x+yw;
                    }
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack[slen++]=[yw, l, x-4, dy];
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack[slen++]=[yw, x2+4, x-4, -dy];	/* leak on right? */
                }
        /*skip:*/   
                i = x+yw;
                if ( isBorderColor )
                {
                    while ( x<=x2 && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol ) 
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                else
                {
                    while ( x<=x2 && !(abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) ) 
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                l = x;
                notdone = (x <= x2);
            }
        }
        // return the new image data
        return im;
    }
});
FILTER.ColorFillFilter = FILTER.FloodFillFilter;

FILTER.Create({
    name : "PatternFillFilter"
    ,x: 0
    ,y: 0
    ,offsetX: 0
    ,offsetY: 0
    ,tolerance: 0.0
    ,mode: MODE.TILE
    ,borderColor: null
    ,hasInputs: true
    
    ,path: FILTER_PLUGINS_PATH
    
    ,init: function( x, y, pattern, offsetX, offsetY, mode, tolerance, borderColor ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        if ( pattern ) self.setInput( "pattern", pattern );
        self.mode = mode || MODE.TILE;
        self.tolerance = tolerance || 0.0;
        self.borderColor = borderColor === +borderColor ? +borderColor : null;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.x = null;
        self.y = null;
        self.offsetX = null;
        self.offsetY = null;
        self.tolerance = null;
        self.borderColor = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             x: self.x
            ,y: self.y
            ,offsetX: self.offsetX
            ,offsetY: self.offsetY
            ,tolerance: self.tolerance
            ,borderColor: self.borderColor
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.x = params.x;
        self.y = params.y;
        self.offsetX = params.offsetX;
        self.offsetY = params.offsetY;
        self.tolerance = params.tolerance;
        self.borderColor = params.borderColor;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this, Pat;
        
        Pat = self.input("pattern"); if ( !Pat ) return im;
        
        // seems to have issues when tol is exactly 1.0
        var tol = (255*(self.tolerance>=1.0 ? 0.999 : self.tolerance))|0, mode = self.mode,
            borderColor = self.borderColor, isBorderColor = borderColor === +borderColor,
            OC, dy = w<<2, pattern = Pat[0], pw = Pat[1], ph = Pat[2], 
            x0 = self.x, y0 = self.y, px0 = self.offsetX||0, py0 = self.offsetY||0,
            imSize = im.length, size = imSize>>>2, ymin = 0, ymax = imSize-dy, xmin = 0, xmax = (w-1)<<2,
            l, i, x, y, x1, x2, yw, pi, px, py, stack, slen, visited, segment, notdone,
            STRETCH = MODE.STRETCH
        ;
        
        if ( 0 > px0 ) px0 += pw;
        if ( 0 > py0 ) py0 += ph;
        
        y = y0; yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ) return im;
        
        // seed color is the image color at x0,y0 position
        OC = new Array8U(3);
        if ( isBorderColor )
        {
            OC[0] = (borderColor >>> 16) & 255; OC[1] = (borderColor >>> 8) & 255; OC[2] = borderColor & 255;
            if ( abs(OC[0]-im[x0+yw])<=tol && abs(OC[1]-im[x0+yw+1])<=tol && abs(OC[2]-im[x0+yw+2])<=tol ) return im;
        }
        else
        {
            OC[0] = im[x0+yw]; OC[1] = im[x0+yw+1]; OC[2] = im[x0+yw+2];
        }
        
        stack = new Array(size); slen = 0; // pre-allocate and soft push/pop for speed
        visited = new Array32U(ceil(size/32));
        if ( yw+dy >= ymin && yw+dy <= ymax ) stack[slen++]=[yw, x0, x0, dy, y+1]; /* needed in some cases */
        /*if ( yw >= ymin && yw <= ymax)*/ stack[slen++]=[yw+dy, x0, x0, -dy, y]; /* seed segment (popped 1st) */
        
        while ( slen > 0 ) 
        {
            /* pop segment off stack and fill a neighboring scan line */
            segment = stack[--slen];
            yw = segment[0]+(dy=segment[3]); x1 = segment[1]; x2 = segment[2];
            y = segment[4];
            
            /*
             * segment of scan line y-dy for x1<=x<=x2 was previously filled,
             * now explore adjacent pixels in scan line y
             */
            if ( isBorderColor )
            {
                for (x=x1; x>=xmin; x-=4)
                {
                    i = x+yw;
                    if ( (visited[i>>>7]&(1<<((i>>>2)&31))) || (abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        break;
                    }
                    else
                    {
                        visited[i>>>7] |= 1<<((i>>>2)&31);
                        if ( STRETCH === mode )
                        {
                            px = (pw*(x>>>2)/w)|0;
                            py = (ph*(y)/h)|0;
                        }
                        else
                        {
                            px = ((x>>>2)+px0) % pw;
                            py = (y+py0) % ph;
                        }
                        pi = (px + py*pw) << 2;
                        im[i  ] = pattern[pi  ];
                        im[i+1] = pattern[pi+1];
                        im[i+2] = pattern[pi+2];
                    }
                }
            }
            else
            {
                for (x=x1; x>=xmin; x-=4)
                {
                    i = x+yw;
                    if ( !(visited[i>>>7]&(1<<((i>>>2)&31))) && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                    {
                        visited[i>>>7] |= 1<<((i>>>2)&31);
                        if ( STRETCH === mode )
                        {
                            px = (pw*(x>>>2)/w)|0;
                            py = (ph*(y)/h)|0;
                        }
                        else
                        {
                            px = ((x>>>2)+px0) % pw;
                            py = (y+py0) % ph;
                        }
                        pi = (px + py*pw) << 2;
                        im[i  ] = pattern[pi  ];
                        im[i+1] = pattern[pi+1];
                        im[i+2] = pattern[pi+2];
                    }
                    else
                    {
                        break;
                    }
                }
            }
            if ( x >= x1 ) 
            {
                // goto skip:
                i = x+yw;
                if ( isBorderColor )
                {
                    while ( (x<=x2 && (visited[i>>>7]&(1<<((i>>>2)&31)))) || (abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                else
                {
                    while ( x<=x2 && !(!(visited[i>>>7]&(1<<((i>>>2)&31))) && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+4;
                if ( l < x1 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack[slen++]=[yw, l, x1-4, -dy, 0 < dy ? y-1 : y+1];  /* leak on left? */
                }
                x = x1+4;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                i = x+yw;
                if ( isBorderColor )
                {
                    while ( x<=xmax && !(visited[i>>>7]&(1<<((i>>>2)&31))) && !(abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        visited[i>>>7] |= 1<<((i>>>2)&31);
                        if ( STRETCH === mode )
                        {
                            px = (pw*(x>>>2)/w)|0;
                            py = (ph*(y)/h)|0;
                        }
                        else
                        {
                            px = ((x>>>2)+px0) % pw;
                            py = (y+py0) % ph;
                        }
                        pi = (px + py*pw) << 2;
                        im[i  ] = pattern[pi  ];
                        im[i+1] = pattern[pi+1];
                        im[i+2] = pattern[pi+2];
                        x+=4; i = x+yw;
                    }
                }
                else
                {
                    while ( x<=xmax && !(visited[i>>>7]&(1<<((i>>>2)&31))) && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                    {
                        visited[i>>>7] |= 1<<((i>>>2)&31);
                        if ( STRETCH === mode )
                        {
                            px = (pw*(x>>>2)/w)|0;
                            py = (ph*(y)/h)|0;
                        }
                        else
                        {
                            px = ((x>>>2)+px0) % pw;
                            py = (y+py0) % ph;
                        }
                        pi = (px + py*pw) << 2;
                        im[i  ] = pattern[pi  ];
                        im[i+1] = pattern[pi+1];
                        im[i+2] = pattern[pi+2];
                        x+=4; i = x+yw;
                    }
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack[slen++]=[yw, l, x-4, dy, 0 < dy ? y+1 : y-1];
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack[slen++]=[yw, x2+4, x-4, -dy, 0 < dy ? y-1 : y+1];	/* leak on right? */
                }
      /*skip:*/   
                i = x+yw;
                if ( isBorderColor )
                {
                    while ( (x<=x2 && (visited[i>>>7]&(1<<((i>>>2)&31)))) || (abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                else
                {
                    while ( x<=x2 && !(!(visited[i>>>7]&(1<<((i>>>2)&31))) && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                l = x;
                notdone = (x <= x2);
            }
        }
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Canny Edges Detector Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var canny_gradient = FILTER.Util.Filter.canny_gradient,
    GAUSSIAN_CUT_OFF = 0.005, MAGNITUDE_SCALE = 100, MAGNITUDE_LIMIT = 1000,
    MAGNITUDE_MAX = MAGNITUDE_SCALE * MAGNITUDE_LIMIT, round = Math.round;

// an efficient Canny Edges Detector
// http://en.wikipedia.org/wiki/Canny_edge_detector
FILTER.Create({
    name : "CannyEdgesFilter"
    
    ,low: 2.5
    ,high: 7.5
    ,radius: 2
    ,width: 14
    
    ,path: FILTER_PLUGINS_PATH
    
    ,init: function( lowThreshold, highThreshold, kernelRadius, kernelWidth ) {
        var self = this;
		self.low = arguments.length < 1 ? 2.5 : +lowThreshold;
		self.high = arguments.length < 2 ? 7.5 : +highThreshold;
		self.radius = arguments.length < 3 ? 2 : +kernelRadius;
		self.width = arguments.length < 4 ? 14 : +kernelWidth;
    }
    
    ,thresholds: function( low, high, radius, width ) {
        var self = this;
        self.low = +low;
        self.high = +high;
        if ( null != radius ) self.radius = +radius;
        if ( null != width ) self.width = +width;
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             low: self.low
            ,high: self.high
            ,radius: self.radius
            ,width: self.width
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.low = params.low;
        self.high = params.high;
        self.radius = params.radius;
        self.width = params.width;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function( im, w, h ) {
        var self = this;
        // NOTE: assume image is already grayscale (and contrast-normalised if needed)
        return canny_gradient( im, w, h, self.radius, self.width, round( self.low*MAGNITUDE_SCALE ), round( self.high*MAGNITUDE_SCALE ), GAUSSIAN_CUT_OFF, MAGNITUDE_SCALE, MAGNITUDE_LIMIT, MAGNITUDE_MAX );
    }
});

}(FILTER);/**
*
* HAAR Feature Detector Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Array32F = FILTER.Array32F, Array8U = FILTER.Array8U,
    Abs = Math.abs, Max = Math.max, Min = Math.min, 
    Floor = Math.floor, Round = Math.round, Sqrt = Math.sqrt,
    TypedArray = FILTER.Util.Array.typed, TypedObj = FILTER.Util.Array.typed_obj,
    HAS = 'hasOwnProperty', MAX_FEATURES = 10, push = Array.prototype.push,
    FilterUtil = FILTER.Util.Filter, sat_image = FilterUtil.SAT, sat_gradient = FilterUtil.GRAD
;

function haar_detect(feats, w, h, sel_x1, sel_y1, sel_x2, sel_y2, haar, baseScale, scaleIncrement, stepIncrement, SAT, RSAT, SAT2, EDGES, cL, cH)
{
    var doCannyEdges = null != EDGES,
        selw = sel_x2-sel_x1+1, selh = sel_y2-sel_y1+1,
        imSize = selw*selh, imArea1 = imSize-1,
        haar_stages = haar.stages, sl = haar_stages.length,
        sizex = haar.size1, sizey = haar.size2,
        scale, maxScale = Min(selw/sizex, selh/sizey),
        xstep, ystep, xsize, ysize,
        startx = sel_x1, starty = sel_y1, startty,
        x, y, ty, tyw, tys, p0, p1, p2, p3, xl, yl, s, t,
        bx1, bx2, by1, by2, swh, inv_area,
        total_x, total_x2, vnorm, edges_density, pass,
        
        stage, threshold, trees, tl,
        t, cur_node_ind, features, feature,
        rects, nb_rects, thresholdf, 
        rect_sum, kr, r, x1, y1, x2, y2,
        x3, y3, x4, y4, rw, rh, yw, yh, sum
    ;
    
    bx1=0; bx2=selw-1; by1=0; by2=imSize-selw;
    scale = baseScale;
    for(scale=baseScale; scale<=maxScale; scale*=scaleIncrement)
    {
        // Viola-Jones Single Scale Detector
        xsize = (scale * sizex)|0;
        xstep = (xsize * stepIncrement)|0;
        ysize = (scale * sizey)|0;
        ystep = (ysize * stepIncrement)|0;
        //ysize = xsize; ystep = xstep;
        tyw = ysize*selw; tys = ystep*selw; 
        startty = starty*tys; 
        xl = selw-xsize; yl = selh-ysize;
        swh = xsize*ysize; inv_area = 1.0/swh;
        
        for(y=starty,ty=startty; y<yl; y+=ystep,ty+=tys) 
        {
            for (x=startx; x<xl; x+=xstep) 
            {
                p0 = x-1 + ty-selw;  p1 = p0 + xsize;
                p2 = p0 + tyw;    p3 = p2 + xsize;
                
                // clamp
                p0 = p0<0 ? 0 : (p0>imArea1 ? imArea1 : p0);
                p1 = p1<0 ? 0 : (p1>imArea1 ? imArea1 : p1);
                p2 = p2<0 ? 0 : (p2>imArea1 ? imArea1 : p2);
                p3 = p3<0 ? 0 : (p3>imArea1 ? imArea1 : p3);
                
                if (doCannyEdges) 
                {
                    // avoid overflow
                    edges_density = inv_area * (EDGES[p3] - EDGES[p2] - EDGES[p1] + EDGES[p0]);
                    if (edges_density < cL || edges_density > cH) continue;
                }
                
                // pre-compute some values for speed
                
                // avoid overflow
                total_x = inv_area * (SAT[p3] - SAT[p2] - SAT[p1] + SAT[p0]);
                // avoid overflow
                total_x2 = inv_area * (SAT2[p3] - SAT2[p2] - SAT2[p1] + SAT2[p0]);
                
                vnorm = total_x2 - total_x * total_x;
                vnorm = 1 < vnorm ? Sqrt(vnorm) : /*vnorm*/  1 ;  
                
                pass = false;
                for(s=0; s<sl; s++) 
                {
                    // Viola-Jones HAAR-Stage evaluator
                    stage = haar_stages[s];
                    threshold = stage.thres;
                    trees = stage.trees; tl = trees.length;
                    sum=0;
                    
                    for(t=0; t<tl; t++) 
                    { 
                        //
                        // inline the tree and leaf evaluators to avoid function calls per-loop (faster)
                        //
                        
                        // Viola-Jones HAAR-Tree evaluator
                        features = trees[t].feats; 
                        cur_node_ind = 0;
                        while (true) 
                        {
                            feature = features[cur_node_ind]; 
                            
                            // Viola-Jones HAAR-Leaf evaluator
                            rects = feature.rects; 
                            nb_rects = rects.length; 
                            thresholdf = feature.thres; 
                            rect_sum = 0;
                            
                            if (feature.tilt)
                            {
                                // tilted rectangle feature, Lienhart et al. extension
                                for(kr=0; kr<nb_rects; kr++) 
                                {
                                    r = rects[kr];
                                    
                                    // this produces better/larger features, possible rounding effects??
                                    x1 = x + (scale * r[0])|0;
                                    y1 = (y-1 + (scale * r[1])|0) * selw;
                                    x2 = x + (scale * (r[0] + r[2]))|0;
                                    y2 = (y-1 + (scale * (r[1] + r[2]))|0) * selw;
                                    x3 = x + (scale * (r[0] - r[3]))|0;
                                    y3 = (y-1 + (scale * (r[1] + r[3]))|0) * selw;
                                    x4 = x + (scale * (r[0] + r[2] - r[3]))|0;
                                    y4 = (y-1 + (scale * (r[1] + r[2] + r[3]))|0) * selw;
                                    
                                    // clamp
                                    x1 = x1<bx1 ? bx1 : (x1>bx2 ? bx2 : x1);
                                    x2 = x2<bx1 ? bx1 : (x2>bx2 ? bx2 : x2);
                                    x3 = x3<bx1 ? bx1 : (x3>bx2 ? bx2 : x3);
                                    x4 = x4<bx1 ? bx1 : (x4>bx2 ? bx2 : x4);
                                    y1 = y1<by1 ? by1 : (y1>by2 ? by2 : y1);
                                    y2 = y2<by1 ? by1 : (y2>by2 ? by2 : y2);
                                    y3 = y3<by1 ? by1 : (y3>by2 ? by2 : y3);
                                    y4 = y4<by1 ? by1 : (y4>by2 ? by2 : y4);
                                    
                                    // RSAT(x-h+w, y+w+h-1) + RSAT(x, y-1) - RSAT(x-h, y+h-1) - RSAT(x+w, y+w-1)
                                    //        x4     y4            x1  y1          x3   y3            x2   y2
                                    rect_sum += r[4] * (RSAT[x4 + y4] - RSAT[x3 + y3] - RSAT[x2 + y2] + RSAT[x1 + y1]);
                                }
                            }
                            else
                            {
                                // orthogonal rectangle feature, Viola-Jones original
                                for(kr=0; kr<nb_rects; kr++) 
                                {
                                    r = rects[kr];
                                    
                                    // this produces better/larger features, possible rounding effects??
                                    x1 = x-1 + (scale * r[0])|0; 
                                    x2 = x-1 + (scale * (r[0] + r[2]))|0;
                                    y1 = selw * (y-1 + (scale * r[1])|0); 
                                    y2 = selw * (y-1 + (scale * (r[1] + r[3]))|0);
                                    
                                    // clamp
                                    x1 = x1<bx1 ? bx1 : (x1>bx2 ? bx2 : x1);
                                    x2 = x2<bx1 ? bx1 : (x2>bx2 ? bx2 : x2);
                                    y1 = y1<by1 ? by1 : (y1>by2 ? by2 : y1);
                                    y2 = y2<by1 ? by1 : (y2>by2 ? by2 : y2);
                                    
                                    // SAT(x-1, y-1) + SAT(x+w-1, y+h-1) - SAT(x-1, y+h-1) - SAT(x+w-1, y-1)
                                    //      x1   y1         x2      y2          x1   y1            x2    y1
                                    rect_sum += r[4] * (SAT[x2 + y2]  - SAT[x1 + y2] - SAT[x2 + y1] + SAT[x1 + y1]);
                                }
                            }
                            
                            /*where = rect_sum * inv_area < thresholdf * vnorm ? 0 : 1;*/
                            // END Viola-Jones HAAR-Leaf evaluator
                            
                            if (rect_sum * inv_area < thresholdf * vnorm) 
                            {
                                if (feature.has_l) { sum += feature.l_val; break; } 
                                else { cur_node_ind = feature.l_node; }
                            } 
                            else 
                            {
                                if (feature.has_r) { sum += feature.r_val; break; } 
                                else { cur_node_ind = feature.r_node; }
                            }
                        }
                        // END Viola-Jones HAAR-Tree evaluator
                    }
                    pass = sum > threshold;
                    // END Viola-Jones HAAR-Stage evaluator
                    
                    if (!pass) break;
                }
                
                if (pass)
                {
                    // expand
                    if ( feats.count === feats.length ) push.apply(feats, new Array(MAX_FEATURES));
                    //                      x, y, width, height
                    feats[feats.count++] = [x, y, xsize, ysize];
                }
            }
        }
    }
}

//x2-x1+1=w  x2 = w+x1-1
function similar(r1, r2, tolerance)
{
    // tolerance = 0.2
    var d1=Max(r2[2], r1[2])*tolerance, 
        d2=Max(r2[3], r1[3])*tolerance;
    return Abs(r1[0]-r2[0])<=d1 && Abs(r1[1]-r2[1])<=d2 && Abs(r1[2]-r2[2])<=d1 && Abs(r1[3]-r2[3])<=d2; 
}

function is_inside(r1, r2)
{
    return (r1.x1>=r2.x1) && (r1.y1>=r2.y1) && (r1.x2<=r2.x2) && (r1.y2<=r2.y2); 
}

function snap_to_grid(r)
{
    r.x1 = (r.x1+0.5)|0; r.y1 = (r.y1+0.5)|0;
    r.x2 = (r.x2+0.5)|0; r.y2 = (r.y2+0.5)|0;
}

function by_area(r1, r2) { return r2.area-r1.area; }

// merge the detected features if needed
function merge_features(rects, min_neighbors, tolerance) 
{
    var rlen=rects.length, ref = new Array(rlen), feats=[], 
        nb_classes = 0, neighbors, r, found=false, i, j, n, t, ri, x1, y1, w, h;
    
    // original code
    // find number of neighbour classes
    for (i=0; i<rlen; i++) ref[i] = 0;
    for (i=0; i<rlen; i++)
    {
        found = false;
        for (j=0; j<i; j++)
        {
            if ( similar(rects[j],rects[i],tolerance) )
            {
                found = true;
                ref[i] = ref[j];
            }
        }
        
        if (!found)
        {
            ref[i] = nb_classes;
            nb_classes++;
        }
    }        
    
    // merge neighbor classes
    neighbors = new Array(nb_classes); r = new Array(nb_classes);
    for (i=0; i<nb_classes; i++)
    {
        neighbors[i] = 0;
        r[i] = [0,0,0,0];
    }
    for (i=0; i<rlen; i++)
    {
        ri = ref[i];
        neighbors[ri]++;
        //add_feat(r[ri],rects[i]);
        r[ri][0] += rects[i][0]; 
        r[ri][1] += rects[i][1]; 
        r[ri][2] += rects[i][2]; 
        r[ri][3] += rects[i][3]; 
    }
    for (i=0; i<nb_classes; i++) 
    {
        n = neighbors[i];
        if (n >= min_neighbors) 
        {
            t = 1/(n + n);
            x1 = t*(r[i][0] * 2 + n);
            y1 = t*(r[i][1] * 2 + n);
            w = t*(r[i][2] * 2 + n);
            h = t*(r[i][3] * 2 + n);
            feats.push({
                x1: x1, y1: y1, x2: x1+w-1, y2: y1+h-1,
                x: x1, y: y1, width: w, height: h,
                area: 0, inside: 0
            });
        }
    }
    
    // filter inside rectangles
    rlen=feats.length;
    for (i=0; i<rlen; i++)
    {
        for (j=i+1; j<rlen; j++)
        {
            if (!feats[i].inside && is_inside(feats[i],feats[j])) { feats[i].inside=1; }
            else if (!feats[j].inside && is_inside(feats[j],feats[i])) { feats[j].inside=1; }
        }
    }
    i=rlen;
    while (--i >= 0) 
    { 
        if (feats[i].inside) // inside
        {
            feats.splice(i, 1); 
        }
        else 
        {
            snap_to_grid(feats[i]); 
            feats[i].area = feats[i].width*feats[i].height;
        }
    }
    
    // sort according to size 
    // (a deterministic way to present results under different cases)
    return feats.sort(by_area);
}

// HAAR Feature Detector (Viola-Jones-Lienhart algorithm)
// adapted from: https://github.com/foo123/HAAR.js
// references:
// 1. Viola, Jones 2001 http://www.cs.cmu.edu/~efros/courses/LBMV07/Papers/viola-cvpr-01.pdf
// 2. Lienhart et al 2002 http://www.lienhart.de/Prof._Dr._Rainer_Lienhart/Source_Code_files/ICIP2002.pdf
// expose as static utility methods
FilterUtil.haar_detect = haar_detect;
FilterUtil.merge_features = merge_features;
FILTER.Create({
    name: "HaarDetectorFilter"
    
    // parameters
    ,_update: false // filter by itself does not alter image data, just processes information
    ,hasMeta: true
    ,haardata: null
    ,tolerance: 0.2
    ,baseScale: 1.0
    ,scaleIncrement: 1.25
    ,stepIncrement: 0.5
    ,minNeighbors: 1
    ,doCannyPruning: true
    ,cannyLow: 20
    ,cannyHigh: 100
    ,_haarchanged: false
    
    // this is the filter constructor
    ,init: function( haardata, baseScale, scaleIncrement, stepIncrement, minNeighbors, doCannyPruning, tolerance ) {
        var self = this;
        self.haardata = haardata || null;
        self.baseScale = undef === baseScale ? 1.0 : baseScale;
        self.scaleIncrement = undef === scaleIncrement ? 1.25 : scaleIncrement;
        self.stepIncrement = undef === stepIncrement ? 0.5 : stepIncrement;
        self.minNeighbors = undef === minNeighbors ? 1 : minNeighbors;
        self.doCannyPruning = undef === doCannyPruning ? true : !!doCannyPruning;
        self.tolerance = null == tolerance ? 0.2 : +tolerance;
        self._haarchanged = !!self.haardata;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,dispose: function( ) {
        var self = this;
        self.haardata = null;
        self.$super('dispose');
        return self;
    }
    
    ,haar: function( haardata ) {
        var self = this;
        self.haardata = haardata;
        self._haarchanged = true;
        return self;
    }
    
    ,params: function( params ) {
        var self = this;
        if ( params )
        {
        if ( params[HAS]('haardata') )
        {
            self.haardata = params.haardata;
            self._haarchanged = true;
        }
        if ( params[HAS]('baseScale') ) self.baseScale = params.baseScale;
        if ( params[HAS]('scaleIncrement') ) self.scaleIncrement = params.scaleIncrement;
        if ( params[HAS]('stepIncrement') ) self.stepIncrement = params.stepIncrement;
        if ( params[HAS]('minNeighbors') ) self.minNeighbors = params.minNeighbors;
        if ( params[HAS]('doCannyPruning') ) self.doCannyPruning = params.doCannyPruning;
        if ( params[HAS]('tolerance') ) self.tolerance = params.tolerance;
        if ( params[HAS]('cannyLow') ) self.cannyLow = params.cannyLow;
        if ( params[HAS]('cannyHigh') ) self.cannyHigh = params.cannyHigh;
        if ( params[HAS]('selection') ) self.selection = params.selection || null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, json;
        json = {
             //haardata: null
             baseScale: self.baseScale
            ,scaleIncrement: self.scaleIncrement
            ,stepIncrement: self.stepIncrement
            ,minNeighbors: self.minNeighbors
            ,doCannyPruning: self.doCannyPruning
            ,tolerance: self.tolerance
            ,cannyLow: self.cannyLow
            ,cannyHigh: self.cannyHigh
        };
        // avoid unnecessary (large) data transfer
        if ( self._haarchanged )
        {
            json.haardata = TypedObj( self.haardata );
            self._haarchanged = false;
        }
        return json;
    }
    
    ,unserialize: function( params ) {
        var self = this;
        if ( params[HAS]('haardata') ) self.haardata = TypedObj( params.haardata, 1 );
        self.baseScale = params.baseScale;
        self.scaleIncrement = params.scaleIncrement;
        self.stepIncrement = params.stepIncrement;
        self.minNeighbors = params.minNeighbors;
        self.doCannyPruning = params.doCannyPruning;
        self.tolerance = params.tolerance;
        self.cannyLow = params.cannyLow;
        self.cannyHigh = params.cannyHigh;
        return self;
    }
    
    // detected objects are passed as filter metadata (if filter is run in parallel thread)
    ,metaData: function( serialisation ) {
        return serialisation && FILTER.isWorker ? TypedObj( this.meta ) : this.meta;
    }
    
    ,setMetaData: function( meta, serialisation ) {
        this.meta = serialisation && "string" === typeof meta ? TypedObj( meta, 1 ) : meta;
        return this;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h, metaData) {
        var self = this;
        if ( !self.haardata ) return im;
        
        var imSize = im.length>>>2,
            selection = self.selection || null,
            SAT=null, SAT2=null, RSAT=null, EDGES=null, 
            x1, y1, x2, y2, features,
            haar_detect = FilterUtil.haar_detect,
            merge_features = FilterUtil.merge_features;
        
        if ( selection )
        {
            // selection is relative, make absolute
            x1 = Min(w-1, Max(0, selection[0]*(w-1)));
            y1 = Min(h-1, Max(0, selection[1]*(h-1)));
            x2 = Min(w-1, Max(0, selection[2]*(w-1)));
            y2 = Min(h-1, Max(0, selection[3]*(h-1)));
        }
        else
        {
            x1 = 0; y1 = 0;
            x2 = w-1; y2 = h-1;
        }
        
        // NOTE: assume image is already grayscale
        if ( metaData && metaData.haarfilter_SAT )
        {
            SAT = metaData.haarfilter_SAT; SAT2 = metaData.haarfilter_SAT2; RSAT = metaData.haarfilter_RSAT;
        }
        else
        {
            // pre-compute <del>grayscale,</del> SAT, RSAT and SAT2
            sat_image(im, w, h, SAT=new Array32F(imSize), SAT2=new Array32F(imSize), RSAT=new Array32F(imSize));
            if ( metaData ) { metaData.haarfilter_SAT = SAT; metaData.haarfilter_SAT2 = SAT2; metaData.haarfilter_RSAT = RSAT; }
        }
        
        // pre-compute integral gradient edges if needed
        if ( self.doCannyPruning )
        {
            if ( metaData && metaData.haarfilter_EDGES )
            {
                EDGES = metaData.haarfilter_EDGES;
            }
            else
            {
                sat_gradient(im, w, h, EDGES=new Array32F(imSize), null, 1);
                if ( metaData ) { metaData.haarfilter_EDGES = EDGES; }
            }
        }
        
        // synchronous detection loop
        features = new Array(MAX_FEATURES); features.count = 0;
        haar_detect(features, w, h, x1, y1, x2, y2, self.haardata, self.baseScale, self.scaleIncrement, self.stepIncrement, SAT, RSAT, SAT2, EDGES, self.cannyLow, self.cannyHigh);
        // truncate if needed
        if ( features.length > features.count ) features.length = features.count;
        
        // return results as meta
        self.meta = {objects: merge_features(features, self.minNeighbors, self.tolerance)};
        
        // return im back
        return im;
    }
});

}(FILTER);/**
*
* Connected Components Extractor Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var A32U = FILTER.Array32U, MODE = FILTER.MODE,
    HUE = FILTER.Color.hue, INTENSITY = FILTER.Color.intensity,
    min = Math.min, max = Math.max, abs = Math.abs, NUM_LABELS = 20;

// adapted from http://xenia.media.mit.edu/~rahimi/connected/

function root_of( id, labels )
{
    while( labels[id][1] !== id )
    {
        // link this node to its parent's parent, just to shorten the tree.
        //merge_box( labels[id][1], labels[labels[id][1]][1], labels );
        //merge_box( id, labels[id][1], labels );
        labels[id][1] = labels[labels[id][1]][1];
        id = labels[id][1];
    }
    return id;
}

function merge( id1, id2, labels )
{
    var r1 = root_of(id1, labels), r2 = root_of(id2, labels);
    if ( r1 !== r2 )
    {
        labels[r1][1] = r2;
        //merge_box( r1, r2, labels );
    }
}

/*function merge_box( id1, id2, labels )
{
    var x1 = min(labels[id1][3],labels[id2][3]),
        y1 = min(labels[id1][4],labels[id2][4]),
        x2 = max(labels[id1][5],labels[id2][5]),
        y2 = max(labels[id1][6],labels[id2][6]);

    labels[id1][3] = x1;
    labels[id1][4] = y1;
    labels[id1][5] = x2;
    labels[id1][6] = y2;
    
    labels[id2][3] = x1;
    labels[id2][4] = y1;
    labels[id2][5] = x2;
    labels[id2][6] = y2;
}*/

function new_label( x, y, labels )
{
    var current = labels.next;
    if ( current+1 > labels.length )
    {
        //if ( labels.highest > 0 ) labels.length = highest_label*2;
        //else labels.length = labels.highest+10;
        Array.prototype.push.apply(labels, new Array(NUM_LABELS));
    }
    labels[current] = [current, current, 0/*, x, y, x, y*/];
    ++labels.next;
    return current;
}

function copy_label( id, x, y, labels )
{
    /*labels[id][3] = min(labels[id][3],x);
    labels[id][4] = min(labels[id][4],y);
    labels[id][5] = max(labels[id][5],x);
    labels[id][6] = max(labels[id][6],y);*/
    return id;
}

function similar_color( im, p1, p2, delta, memo )
{
    return (0===im[p1+3] && 0===im[p2+3]) || (abs(im[p1]-im[p2])<=delta && abs(im[p1+1]-im[p2+1])<=delta && abs(im[p1+2]-im[p2+2])<=delta);
}

function similar_to_color( col, im, p1, delta, memo )
{
    return abs(im[p1]-col[0])<=delta && abs(im[p1+1]-col[1])<=delta && abs(im[p1+2]-col[2])<=delta;
}

function similar_intensity( im, p1, p2, delta, memo )
{
    if ( 0===im[p1+3] && 0===im[p2+3] ) return true;
    var i1 = p1 >>> 2, i2 = p2 >>> 2;
    if ( null == memo[i1] ) memo[i1] = INTENSITY(im[p1],im[p1+1],im[p1+2]);
    if ( null == memo[i2] ) memo[i2] = INTENSITY(im[p2],im[p2+1],im[p2+2]);
    return abs(memo[i1],memo[i2])<=delta;
}

function similar_to_intensity( col, im, p1, delta, memo )
{
    var i1 = p1 >>> 2;
    if ( null == memo[i1] ) memo[i1] = INTENSITY(im[p1],im[p1+1],im[p1+2]);
    return abs(memo[i1],col)<=delta;
}

function similar_hue( im, p1, p2, delta, memo )
{
    if ( 0===im[p1+3] && 0===im[p2+3] ) return true;
    var i1 = p1 >>> 2, i2 = p2 >>> 2;
    if ( null == memo[i1] ) memo[i1] = HUE(im[p1],im[p1+1],im[p1+2]);
    if ( null == memo[i2] ) memo[i2] = HUE(im[p2],im[p2+1],im[p2+2]);
    return abs(memo[i1],memo[i2])<=delta;
}

function similar_to_hue( col, im, p1, delta, memo )
{
    var i1 = p1 >>> 2;
    if ( null == memo[i1] ) memo[i1] = HUE(im[p1],im[p1+1],im[p1+2]);
    return abs(memo[i1],col)<=delta;
}

// TODO: add bounding boxes, so it can be used as connected color/hue detector/tracker as well efficiently
FILTER.Create({
    name: "ConnectedComponentsFilter"
    
    // parameters
    ,connectivity: 4
    ,tolerance: 0.0
    ,mode: MODE.COLOR
    ,color: null
    ,invert: false
    ,box: null
    //,hasMeta: true
    
    // this is the filter constructor
    ,init: function( connectivity, tolerance, mode, color, invert ) {
        var self = this;
        self.connectivity = 8 === connectivity ? 8 : 4;
        self.tolerance = tolerance || 0.0;
        self.mode = mode || MODE.COLOR;
        self.color = null == color ? null : color;
        self.invert = !!invert;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
             connectivity: self.connectivity
            ,tolerance: self.tolerance
            ,color: self.color
            ,invert: self.invert
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.connectivity = params.connectivity;
        self.tolerance = params.tolerance;
        self.color = params.color;
        self.invert = params.invert;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        if ( !self._isOn ) return im;
        
        var i, j, k, imLen = im.length, imSize = imLen>>>2, w4 = w<<2,
            mode = self.mode||MODE.COLOR, invert = self.invert, color = self.color,
            tolerance = min(0.999, max(0.0, self.tolerance||0.0)),
            connectivity = 8 === self.connectivity ? 8 : 4,
            K8_CONNECTIVITY = 8 === connectivity, d0 = K8_CONNECTIVITY ? -1 : 0, k0 = 4*d0,
            mylab, c, r, d, row, labels, labelimg,
            SIMILAR = null, memo = null, SIMILAR_TO = null, background_label = null,
            need_match = null != color, highest, tag//, box
        ;
        
        labels = new Array(NUM_LABELS);
        labels.next = 0;
        labelimg = new A32U(imSize);
        
        if ( MODE.HUE === mode )
        {
            tolerance *= 360;
            SIMILAR = similar_hue;
            memo = new Array(imSize);
            if ( need_match ) SIMILAR_TO = similar_to_hue;
        }
        else if ( MODE.INTENSITY === mode )
        {
            tolerance *= 255;
            SIMILAR = similar_intensity;
            memo = new Array(imSize);
            if ( need_match ) SIMILAR_TO = similar_to_intensity;
        }
        else //if ( MODE.COLOR === mode )
        {
            tolerance *= 255;
            SIMILAR = similar_color;
            if ( need_match )
            {
                color = [(color >>> 16)&255, (color >>> 8)&255, color&255];
                SIMILAR_TO = similar_to_color;
            }
        }
        background_label = need_match ? new_label(0, 0, labels) : null;
        
        labelimg[0] = need_match && !SIMILAR_TO(color, im, 0, tolerance, memo) ? background_label : new_label(0, 0, labels);
        
        // label the first row.
        for(c=1,i=4; c<w; c++,i+=4)
            labelimg[c] = need_match && !SIMILAR_TO(color, im, i, tolerance, memo) ? background_label : (SIMILAR(im, i, i-4, tolerance, memo) ? copy_label(labelimg[c-1], c, 0, labels) : new_label(c, 0, labels));

        // label subsequent rows.
        for(r=1,row=w,i=w4; r<h; r++,row+=w,i+=w4)
        {
            // label the first pixel on this row.
            labelimg[row] = need_match && !SIMILAR_TO(color, im, i, tolerance, memo) ? background_label : (SIMILAR(im, i, i-w4, tolerance, memo) ? copy_label(labelimg[row-w], 0, r, labels) : new_label(0, r, labels));

            // label subsequent pixels on this row.
            for(c=1,j=4; c<w; c++,j+=4)
            {
                if ( need_match && !SIMILAR_TO(color, im, i+j, tolerance, memo) )
                {
                    labelimg[row+c] = background_label;
                    continue;
                }
                // inherit label from pixel on the left if we're in the same blob.
                mylab = background_label === labelimg[row+c-1] ? -1 : (SIMILAR(im, i+j, i+j-4, tolerance, memo) ? copy_label(labelimg[row+c-1], c, r, labels) : -1);

                for(d=d0,k=k0; d<1; d++,k+=4)
                {
                    // if we're in the same blob, inherit value from above pixel.
                    // if we've already been assigned, merge its label with ours.
                    if( (background_label !== labelimg[row-w+c+d]) && SIMILAR(im, i+j, i-w4+j+k, tolerance, memo) )
                    {
                        if( mylab >= 0 ) merge(mylab, labelimg[row-w+c+d], labels);
                        else mylab = copy_label(labelimg[row-w+c+d], c+d, r, labels);
                    }
                }
                labelimg[row+c] = mylab >= 0 ? copy_label(mylab, c, r, labels) : new_label(c, r, labels);

                if( K8_CONNECTIVITY && 
                    (background_label !== labelimg[row+c-1]) && 
                    (background_label !== labelimg[row-w+c]) && 
                    SIMILAR(im, i+j-4, i-w4+j, tolerance, memo)
                )
                    merge(labelimg[row+c-1], labelimg[row-w+c], labels);
            }
        }
        
        // relabel image
        if ( 0 === background_label )
        {
            for(i=0,highest=labels.next,tag=0; i<highest; i++)
                if ( i === labels[i][1] ) labels[i][2] = 0 === labels[i][1] ? 0 : ++tag;
        }
        else
        {
            for(i=0,highest=labels.next,tag=0; i<highest; i++)
                if ( i === labels[i][1] ) labels[i][2] = tag++;
        }

        //box = {};
        tag = tag > 0 ? tag : 1;
        if ( invert )
        {
            for(c=0,i=0; i<imLen; i+=4,c++)
            {
                color = labels[root_of(labelimg[c], labels)][2];
                color = (255-255*color/tag)|0;
                im[i] = color; im[i+1] = color; im[i+2] = color; //im[i+3] = 255;
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
        else
        {
            for(c=0,i=0; i<imLen; i+=4,c++)
            {
                color = labels[root_of(labelimg[c], labels)][2];
                color = (255*color/tag)|0;
                im[i] = color; im[i+1] = color; im[i+2] = color; //im[i+3] = 255;
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
        // return the connected image data
        return im;
    }
});

}(FILTER);
/* main code ends here */
/* export the module */
return FILTER;
});