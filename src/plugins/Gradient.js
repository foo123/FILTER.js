/**
*
* Filter Gradient, Radial-Gradient plugins
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Gradient = FILTER.Color.Gradient, TypedArray = FILTER.Util.Array.typed, Floor = Math.floor;

FILTER.Create({
     name: "GradientFilter"
    
    // parameters
    ,colors: null
    ,stops: null
    ,angle: 0
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    // constructor
    ,init: function( colors, stops, angle ) {
        var self = this;
        self.setColors( colors, stops );
        self.angle = angle||0;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.colors = null;
        self.stops = null;
        self.angle = null;
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
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 angle: self.angle
                ,colors: self.colors
                ,stops: self.stops
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.angle = params.angle;
            self.colors = TypedArray( params.colors, Array );
            self.stops = TypedArray( params.stops, Array );
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !self.colors ) return im;
        return Gradient.linear( im, w, h, self.colors, self.stops, self.angle, Gradient.interpolate );
    }
});

FILTER.Create({
     name: "RadialGradientFilter"
    
    // parameters
    ,colors: null
    ,stops: null
    ,centerX: 0.0
    ,centerY: 0.0
    ,radiusX: 1.0
    ,radiusY: 1.0
    
    // constructor
    ,init: function( colors, stops, centerX, centerY, radiusX, radiusY ) {
        var self = this;
        self.setColors( colors, stops );
        self.centerX = centerX||0.0;
        self.centerY = centerY||0.0;
        self.radiusX = radiusX||1.0;
        self.radiusY = radiusY||1.0;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.colors = null;
        self.stops = null;
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
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 centerX: self.centerX
                ,centerY: self.centerY
                ,radiusX: self.radiusX
                ,radiusY: self.radiusY
                ,colors: self.colors
                ,stops: self.stops
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.centerX = params.centerX || 0.0;
            self.centerY = params.centerY || 0.0;
            self.radiusX = params.radiusX || 1.0;
            self.radiusY = params.radiusY || 1.0;
            self.colors = TypedArray( params.colors, Array );
            self.stops = TypedArray( params.stops, Array );
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !self.colors ) return im;
        
        // make center relative
        return Gradient.radial( im, w, h, self.colors, self.stops, Floor((self.centerX||0.0)*(w-1)), Floor((self.centerY||0.0)*(h-1)), self.radiusX, self.radiusY, Gradient.interpolate );
    }
});

}(FILTER);