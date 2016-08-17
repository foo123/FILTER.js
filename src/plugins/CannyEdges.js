/**
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

}(FILTER);