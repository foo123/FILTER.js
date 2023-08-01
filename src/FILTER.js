/**
*
*   FILTER.js
*   @version: @@VERSION@@
*   @built on @@DATE@@
*   @dependencies: Asynchronous.js
*
*   JavaScript Image Processing Library
*   https://github.com/foo123/FILTER.js
*
**/
var FILTER = (function(){
"use strict";
var PROTO = 'prototype',
    HAS = Object[PROTO].hasOwnProperty,
    toString = Object[PROTO].toString,
    def = Object.defineProperty,
    stdMath = Math, NOOP = function() {},
    _uuid = 0
;

// basic backwards-compatible "class" construction
function makeSuper(superklass)
{
    var called = {};
    return function $super(method, args) {
        var self = this, m = ':'+method, ret;
        if (1 === called[m]) return (superklass[PROTO].$super || NOOP).call(self, method, args);
        called[m] = 1;
        ret = ('constructor' === method ? superklass : (superklass[PROTO][method] || NOOP)).apply(self, args || []);
        called[m] = 0;
        return ret;
    };
}
function makeClass(superklass, klass, statik)
{
    if (arguments.length < 2)
    {
        klass = superklass;
        superklass = null;
    }
    var C = HAS.call(klass, 'constructor') ? klass.constructor : function() {}, p;
    if (superklass)
    {
        C[PROTO] = Object.create(superklass[PROTO]);
        C[PROTO].$super = makeSuper(superklass);
    }
    else
    {
        C[PROTO].$super = NOP;
    }
    C[PROTO].constructor = C;
    for (p in klass)
    {
        if (HAS.call(klass, p) && ('constructor' !== p))
        {
            C[PROTO][p] = klass[p];
        }
    }
    if (statik)
    {
        for (p in statik)
        {
            if (HAS.call(statik, p))
            {
                C[p] = statik[p];
            }
        }
    }
    return C;
}
function merge(/*args*/)
{
    var n = arguments.length,
        a = n ? arguments[0] : null,
        i, j, b;
    for (i=1; i<n; ++i)
    {
        b = arguments[i];
        for (j in b)
        {
            if (HAS.call(b, j))
            {
                a[j] = b[j];
            }
        }
    }
    return a;
}
makeClass.Merge = merge;

var FILTER = {
    VERSION: "@@VERSION@@",
    Class: makeClass,
    Asynchronous: Asynchronous,
    Path: Asynchronous.path(ModuleFactory__FILTER.moduleUri)
};

FILTER.uuid = function(namespace) {
    return [namespace||'filter', new Date().getTime(), ++_uuid].join('_');
};

FILTER.NotImplemented = function(method) {
    return method ? function() {
        throw new Error('Method "'+method+'" not Implemented!');
    } : function() {
        throw new Error('Method not Implemented!');
    };
};

// Canvas/Image for Browser
// override if needed to provide Canvas/Image alternatives for Nodejs
FILTER.Canvas = function(w, h) {
    var canvas = document.createElement('canvas');
    w = w || 0;
    h = h || 0;
    // set the size of the drawingBuffer
    canvas.width = w * FILTER.devicePixelRatio;
    canvas.height = h * FILTER.devicePixelRatio;
    if (canvas.style)
    {
        // set the display size of the canvas if displayed
        canvas.style.width = String(w) + "px";
        canvas.style.height = String(h) + "px";
    }
    return canvas;
};
FILTER.Canvas.Image = function() {
    return new Image();
};

// Typed Arrays Substitute(s)
FILTER._notSupportClamp = "undefined" === typeof Uint8ClampedArray;
FILTER.Array = Array;
FILTER.Array32F = typeof Float32Array !== "undefined" ? Float32Array : Array;
FILTER.Array64F = typeof Float64Array !== "undefined" ? Float64Array : Array;
FILTER.Array8I = typeof Int8Array !== "undefined" ? Int8Array : Array;
FILTER.Array16I = typeof Int16Array !== "undefined" ? Int16Array : Array;
FILTER.Array32I = typeof Int32Array !== "undefined" ? Int32Array : Array;
FILTER.Array8U = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
FILTER.Array16U = typeof Uint16Array !== "undefined" ? Uint16Array : Array;
FILTER.Array32U = typeof Uint32Array !== "undefined" ? Uint32Array : Array;
FILTER.ImArray = FILTER._notSupportClamp ? FILTER.Array8U : Uint8ClampedArray;
FILTER.ImArrayCopy = FILTER.ImArray;
FILTER.ColorTable = FILTER.ImArrayCopy;
FILTER.AffineMatrix = FILTER.ColorMatrix = FILTER.ConvolutionMatrix = FILTER.Array32F;

// packages
FILTER.Util = {
    Array   : {
        // IE still does not support Uint8ClampedArray and some methods on it, add the method "set"
         hasClampedArray: "undefined" !== typeof Uint8ClampedArray
        ,hasArrayset: ("undefined" !== typeof Int16Array) && ("function" === typeof Int16Array[PROTO].set)
        ,hasSubarray: "function" === typeof FILTER.Array32F[PROTO].subarray
    },
    String  : {},
    Math    : {},
    Filter  : {},
    Image   : {}
};

// Constants
FILTER.MODE = {
    IGNORE: 0, WRAP: 1, CLAMP: 2,
    COLOR: 3, COLOR32: 3, TILE: 4, STRETCH: 5,
    INTENSITY: 6, HUE: 7, SATURATION: 8,
    GRAY: 9, GRAYSCALE: 9, RGB: 10, RGBA: 11,
    HSV: 12, HSL: 19, HWB: 27, CMY: 13, CMYK: 13,
    XYZ: 28, ILL: 29, PATTERN: 14,
    COLOR8: 15, COLORMASK: 16, COLORMASK32: 16, COLORMASK8: 17,
    MATRIX: 18, NONLINEAR: 20, STATISTICAL: 21, ADAPTIVE: 22,
    THRESHOLD: 23, HISTOGRAM: 24, MONO: 25, MASK: 26
};
FILTER.CHANNEL = {
    R: 0, G: 1, B: 2, A: 3,
    RED: 0, GREEN: 1, BLUE: 2, ALPHA: 3,
    Y: 1, CB: 2, CR: 0, IP: 0, Q: 2,
    INPHASE: 0, QUADRATURE: 2,
    H: 0, S: 2, V: 1, L: 1, I: 1, U: 2,
    HUE: 0, SATURATION: 2, INTENSITY: 1,
    CY: 2, MA: 0, YE: 1, K: 3,
    CYAN: 2, MAGENTA: 0, YELLOW: 1, BLACK: 3,
    XX: 0, YY: 1, ZZ: 2,
    ILL1: 0, ILL2: 1, ILL3: 2
};
FILTER.STRIDE = {
    CHANNEL: [0,0,1], X: [0,1,4], Y: [1,0,4],
    RGB: [0,1,2], ARGB: [3,0,1,2], RGBA: [0,1,2,3],
    BGR: [2,1,0], ABGR: [3,2,1,0], BGRA: [2,1,0,3]
};
FILTER.LUMA = FILTER.LUMA_YUV = FILTER.LUMA_YIQ = new FILTER.Array32F([
    //0.212671, 0.71516, 0.072169
    0.2126, 0.7152, 0.0722
]);
FILTER.LUMA_YCbCr = new FILTER.Array32F([
    //0.30, 0.59, 0.11
    0.299, 0.587, 0.114
]);
FILTER.LUMA_GREEN = new FILTER.Array32F([
    0, 1, 0
]);
FILTER.CONSTANTS = FILTER.CONST = {
     X: 0, Y: 1, Z: 2
    ,PI: stdMath.PI, PI2: 2*stdMath.PI, PI_2: stdMath.PI/2
    ,toRad: stdMath.PI/180, toDeg: 180/stdMath.PI
};
FILTER.FORMAT = {
    IMAGE: 1024, DATA: 2048
};
return FILTER;
});
