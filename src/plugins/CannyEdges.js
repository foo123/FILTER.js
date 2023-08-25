/**
*
* Canny Edges Detector
* @package FILTER.js
*
**/
!function(FILTER) {
"use strict";

var MAGNITUDE_SCALE = 1, MAGNITUDE_LIMIT = 510,
    MAGNITUDE_MAX = MAGNITUDE_SCALE * MAGNITUDE_LIMIT;

// an efficient Canny Edges Detector
// http://en.wikipedia.org/wiki/Canny_edge_detector
FILTER.Create({
    name : "CannyEdgesFilter"

    ,low: 25
    ,high: 75
    ,lowpass: true

    ,path: FILTER.Path

    ,init: function(lowThreshold, highThreshold, lowpass) {
        var self = this;
        self.low = arguments.length < 1 ? 25 : +lowThreshold;
        self.high = arguments.length < 2 ? 75 : +highThreshold;
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

    ,getGLSL: function() {
        return glsl(this)
    }


    // this is the filter actual apply method routine
    ,_apply: function(im, w, h) {
        var self = this;
        // NOTE: assume image is already grayscale (and contrast-normalised if needed)
        return (self._runWASM ? (FILTER.Util.Filter.wasm||FILTER.Util.Filter) : FILTER.Util.Filter)['gradient'](im, w, h, 2, 0, self.lowpass ? 1 : 0, 0, self.low*MAGNITUDE_SCALE, self.high*MAGNITUDE_SCALE, MAGNITUDE_SCALE, MAGNITUDE_LIMIT, MAGNITUDE_MAX);
    }
});

function glsl(filter)
{
    var glslcode = FILTER.Util.Filter.gradient_glsl(), output = [];
    if (filter.lowpass)
    {
        output.push({
        instance: filter,
        shader: [
        'varying vec2 pix;',
        'uniform vec2 dp;',
        'uniform sampler2D img;',
        glslcode.lowpass,
        'void main(void) {',
        '    gl_FragColor = lowpass(img, pix, dp);',
        '}'
        ].join('\n')
        });
    }
    output.push({
    instance: filter,
    shader: [
    '#define MAGNITUDE_SCALE 1.0',
    '#define MAGNITUDE_LIMIT 510.0',
    '#define MAGNITUDE_MAX 510.0',
    'varying vec2 pix;',
    'uniform vec2 dp;',
    'uniform sampler2D img;',
    'uniform float low;',
    'uniform float high;',
    glslcode.gradient,
    'void main(void) {',
    '    gl_FragColor = gradient(img, pix, dp, low, high, MAGNITUDE_SCALE, MAGNITUDE_LIMIT, MAGNITUDE_MAX);',
    '}'
    ].join('\n'),
    vars: function(gl, w, h, program) {
        gl.uniform1f(program.uniform.low, filter.low*MAGNITUDE_SCALE/255);
        gl.uniform1f(program.uniform.high, filter.high*MAGNITUDE_SCALE/255);
    }
    });
    output.push({
    instance: filter,
    shader: [
    'varying vec2 pix;',
    'uniform vec2 dp;',
    'uniform sampler2D img;',
    glslcode.hysteresis,
    'void main(void) {',
    '    gl_FragColor = hysteresis(img, pix, dp);',
    '}'
    ].join('\n'), iterations: 50
    });
    return output;
}
}(FILTER);