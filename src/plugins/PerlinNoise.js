/**
*
* Perlin Noise Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var ImageUtil = FILTER.ImageUtil, perlin = ImageUtil.perlin;

// an efficient perlin noise and simplex noise plugin
// http://en.wikipedia.org/wiki/Perlin_noise
FILTER.Create({
    name: "PerlinNoiseFilter"
    
    // parameters
    ,_baseX: 1
    ,_baseY: 1
    ,_octaves: 1
    ,_offsets: null
    ,_colors: false
    ,_seed: 0
    ,_stitch: false
    ,_fractal: true
    ,_perlin: false
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    // constructor
    ,init: function( baseX, baseY, octaves, stitch, fractal, offsets, seed, use_perlin ) {
        var self = this;
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
        this._colors = !!enabled;
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
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 _baseX: self._baseX
                ,_baseY: self._baseY
                ,_octaves: self._octaves
                ,_offsets: self._offsets
                ,_seed: self._seed || 0
                ,_stitch: self._stitch
                ,_colors: self._colors
                ,_fractal: self._fractal
                ,_perlin: self._perlin
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._baseX = params._baseX;
            self._baseY = params._baseY;
            self._octaves = params._octaves;
            self._offsets = params._offsets;
            self._seed = params._seed || 0;
            self._stitch = params._stitch;
            self._colors = params._colors;
            self._fractal = params._fractal;
            self._perlin = params._perlin;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !perlin ) return im;
        if ( self._seed )
        {
            perlin.seed( self._seed );
            self._seed = 0;
        }
        return perlin( im, w, h, self._stitch, !self._colors, self._baseX, self._baseY, self._octaves, self._offsets, 1.0, 0.5, self._perlin );
});

}(FILTER);