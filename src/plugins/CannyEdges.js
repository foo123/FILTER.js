/**
*
* Canny Edges Detector
* @package FILTER.js
*
**/
!function(FILTER) {
"use strict";

var MAGNITUDE_SCALE = 100, MAGNITUDE_LIMIT = 1000,
    MAGNITUDE_MAX = MAGNITUDE_SCALE * MAGNITUDE_LIMIT,
    stdMath = Math, round = stdMath.round;

// an efficient Canny Edges Detector
// http://en.wikipedia.org/wiki/Canny_edge_detector
FILTER.Create({
    name : "CannyEdgesFilter"

    ,low: 2.5
    ,high: 7.5
    ,lowpass: true

    ,path: FILTER.Path

    ,init: function(lowThreshold, highThreshold, lowpass) {
        var self = this;
		self.low = arguments.length < 1 ? 2.5 : +lowThreshold;
		self.high = arguments.length < 2 ? 7.5 : +highThreshold;
		self.lowpass = arguments.length < 3 ? true : !!lowpass;
    }

    ,thresholds: function(low, high, lowpass) {
        var self = this;
        self.low = +low;
        self.high = +high;
        if (arguments.length > 2) self.lowpass = !!lowpass;
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             low: self.low
            ,high: self.high
            ,lowpass: self.lowpass
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.low = params.low;
        self.high = params.high;
        self.lowpass = params.lowpass;
        return self;
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        // NOTE: assume image is already grayscale (and contrast-normalised if needed)
        return FILTER.Util.Filter.gradient(im, w, h, 2, 0, self.lowpass, 0, round(self.low*MAGNITUDE_SCALE), round(self.high*MAGNITUDE_SCALE), MAGNITUDE_SCALE, MAGNITUDE_LIMIT, MAGNITUDE_MAX);
    }
});

}(FILTER);