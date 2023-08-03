/**
*
* Color Map Filter(s)
*
* Changes target coloring combining current pixel color values according to non-linear color map
*
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MAP, CHANNEL = FILTER.CHANNEL, MODE = FILTER.MODE, Color = FILTER.Color, CM = FILTER.ColorMatrix,
    TypedArray = FILTER.Util.Array.typed, notSupportClamp = FILTER._notSupportClamp, function_body = FILTER.Util.String.function_body, HAS = Object.prototype.hasOwnProperty, toString = Function.prototype.toString;

// ColorMapFilter
var ColorMapFilter = FILTER.Create({
    name: "ColorMapFilter"

    ,init: function ColorMapFilter(M, init) {
        var self = this;
        if (M) self.set(M, init);
    }

    ,path: FILTER.Path
    ,_map: null
    ,_mapInit: null
    ,_mapName: null
    ,_mapChanged: false
    // parameters
    ,thresholds: null
    // NOTE: quantizedColors should contain 1 more element than thresholds
    ,quantizedColors: null
    ,mode: MODE.COLOR

    ,dispose: function() {
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

    ,serialize: function() {
        var self = this, json;
        json = {
            _mapName: self._mapName || null
            ,_map: ("generic" === self._mapName) && self._map && self._mapChanged ? toString.call(self._map) : null
            ,_mapInit: ("generic" === self._mapName) && self._mapInit && self._mapChanged ? toString.call(self._mapInit) : null
            ,thresholds: self.thresholds
            ,quantizedColors: self.quantizedColors
        };
        self._mapChanged = false;
        return json;
    }

    ,unserialize: function(params) {
        var self = this;
        self.thresholds = TypedArray(params.thresholds, Array);
        self.quantizedColors = TypedArray(params.quantizedColors, Array);

        //self._mapName = params._mapName;
        //self._map = params._map;
        if (!params._map && params._mapName && HAS.call(MAP, params._mapName))
        {
            self.set(params._mapName);
        }
        else if (params._map && ("generic" === params._mapName))
        {
            // using bind makes the code become [native code] and thus unserializable
            /*self._map = new Function("FILTER", '"use strict"; return ' + params._map)( FILTER );
            if ( params._mapInit )
                self._mapInit = new Function("FILTER", '"use strict"; return ' + params._mapInit)( FILTER );*/
            self.set(params._map, params._mapInit||null);
        }
        /*else
        {
            self._map = null;
        }*/
        return self;
    }

    ,RGB2HSV: function() {
        return this.set("rgb2hsv");
    }

    ,HSV2RGB: function() {
        return this.set("hsv2rgb");
    }

    ,RGB2HSL: function() {
        return this.set("rgb2hsl");
    }

    ,HSL2RGB: function() {
        return this.set("hsl2rgb");
    }

    ,RGB2HWB: function() {
        return this.set("rgb2hwb");
    }

    ,HWB2RGB: function() {
        return this.set("hwb2rgb");
    }

    ,RGB2CMYK: function() {
        return this.set("rgb2cmyk");
    }

    ,RGB2ILL: function() {
        return this.set("rgb2ill");
    }

    ,hue: function() {
        return this.set("hue");
    }

    ,saturation: function() {
        return this.set("saturation");
    }

    ,quantize: function(thresholds, quantizedColors) {
        var self = this;
        self.thresholds = thresholds;
        self.quantizedColors = quantizedColors;
        return self.set("quantize");
    }
    ,threshold: null

    ,mask: function(min, max, background) {
        var self = this;
        self.thresholds = [min, max];
        self.quantizedColors = [background || 0];
        return self.set("mask");
    }
    ,extract: null

    ,set: function(M, preample) {
        var self = this;
        if (M && HAS.call(MAP, String(M)))
        {
            if (self._mapName !== String(M))
            {
                self._mapName = String(M);
                self._map = MAP[self._mapName];
                self._mapInit = MAP["init__" + self._mapName];
                self._apply = apply__(self._map, self._mapInit);
            }
            self._mapChanged = false;
        }
        else if (M)
        {
            self._mapName = "generic";
            self._map = T;
            self._mapInit = preample || null;
            self._apply = apply__(self._map, self._mapInit);
            self._mapChanged = true;
        }
        return self;
    }

    ,reset: function() {
        var self = this;
        self._mapName = null;
        self._map = null;
        self._mapInit = null;
        self._mapChanged = false;
        return self;
    }

    // used for internal purposes
    /*,_apply: apply*/

    ,canRun: function() {
        return this._isOn && this._map;
    }
});
// aliases
ColorMapFilter.prototype.threshold = ColorMapFilter.prototype.quantize;
ColorMapFilter.prototype.extract = ColorMapFilter.prototype.mask;

function apply__(map, preample)
{
    var __INIT__ = preample ? function_body(preample) : '', __APPLY__ = function_body(map),
        __CLAMP__ = notSupportClamp ? "c[0] = 0>c[0] ? 0 : (255<c[0] ? 255: c[0]); c[1] = 0>c[1] ? 0 : (255<c[1] ? 255: c[1]); c[2] = 0>c[2] ? 0 : (255<c[2] ? 255: c[2]); c[3] = 0>c[3] ? 0 : (255<c[3] ? 255: c[3]);" : '';
        //"use asm";
    return new Function("FILTER", "\"use strict\"; return function(im, w, h){\
    var self = this;\
    if (!self._map) return im;\
    var x, y, i, i0, imLen = im.length, imArea = imLen>>>2, rem = (imArea&7)<<2, c = new FILTER.ColorMatrix(4);\
\
    "+__INIT__+";\
    \
    x=0; y=0;\
    for (i=0; i<rem; i+=4)\
    {\
        c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        if (++x>=w) {x=0; ++y;}\
    }\
    for (i0=rem; i0<imLen; i0+=32)\
    {\
        i=i0; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
        i+=4; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
        i+=4; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
        i+=4; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
        i+=4; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
        i+=4; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
        i+=4; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
        i+=4; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
    }\
    return im;\
};")(FILTER);
}


//
// private color maps
MAP = {

    "rgb2hsv": "function() {\
        if (0 !== c[3])\
        {\
            RGB2HSV(c, 0);\
            C0 = c[0]; C1 = c[1]; C2 = c[2];\
            c[CH] = C0; c[CS] = C1; c[CV] = C2;\
        }\
    }"
    ,"init__rgb2hsv": "function() {\
        var C0, C1, C2, CH = FILTER.CHANNEL.H, CS = FILTER.CHANNEL.S, CV = FILTER.CHANNEL.V, RGB2HSV = FILTER.Color.RGB2HSV;\
    }"

    "rgb2hsl": "function() {\
        if (0 !== c[3])\
        {\
            RGB2HSL(c, 0);\
            C0 = c[0]; C1 = c[1]; C2 = c[2];\
            c[CH] = C0; c[CS] = C1; c[CL] = C2;\
        }\
    }"
    ,"init__rgb2hsl": "function() {\
        var C0, C1, C2, CH = FILTER.CHANNEL.H, CS = FILTER.CHANNEL.S, CL = FILTER.CHANNEL.L, RGB2HSL = FILTER.Color.RGB2HSL;\
    }"

    "rgb2hwb": "function() {\
        if (0 !== c[3])\
        {\
            RGB2HWB(c, 0);\
            C0 = c[0]; C1 = c[1]; C2 = c[2];\
            c[CH] = C0; c[CW] = C1; c[CB] = C2;\
        }\
    }"
    ,"init__rgb2hwb": "function() {\
        var C0, C1, C2, CH = FILTER.CHANNEL.H, CW = FILTER.CHANNEL.WH, CB = FILTER.CHANNEL.BL, RGB2HWB = FILTER.Color.RGB2HWB;\
    }"

    ,"hsv2rgb": "function() {\
        if (0 !== c[3])\
        {\
            C0 = c[CH]; C1 = c[CS]; C2 = c[CV];\
            c[0] = C0; c[1] = C1; c[2] = C2;\
            HSV2RGB(c, 0);\
        }\
    }"
    ,"init__hsv2rgb": "function() {\
        var C0, C1, C2, CH = FILTER.CHANNEL.H, CS = FILTER.CHANNEL.S, CV = FILTER.CHANNEL.V, HSV2RGB = FILTER.Color.HSV2RGB;\
    }"

    ,"hsl2rgb": "function() {\
        if (0 !== c[3])\
        {\
            C0 = c[CH]; C1 = c[CS]; C2 = c[CL];\
            c[0] = C0; c[1] = C1; c[2] = C2;\
            HSL2RGB(c, 0);\
        }\
    }"
    ,"init__hsl2rgb": "function() {\
        var C0, C1, C2, CH = FILTER.CHANNEL.H, CS = FILTER.CHANNEL.S, CL = FILTER.CHANNEL.L, HSL2RGB = FILTER.Color.HSL2RGB;\
    }"

    ,"hwb2rgb": "function() {\
        if (0 !== c[3])\
        {\
            C0 = c[CH]; C1 = c[CW]; C2 = c[CB];\
            c[0] = C0; c[1] = C1; c[2] = C2;\
            HWB2RGB(c, 0);\
        }\
    }"
    ,"init__hwb2rgb": "function() {\
        var C0, C1, C2, CH = FILTER.CHANNEL.H, CW = FILTER.CHANNEL.WH, CB = FILTER.CHANNEL.BL, HWB2RGB = FILTER.Color.HWB2RGB;\
    }"

    ,"rgb2cmyk": "function() {\
        if (0 !== c[3])\
        {\
            RGB2CMYK(c, 0);\
            C0 = c[0]; C1 = c[1]; C2 = c[2];\
            c[CY] = C0; c[MA] = C1; c[YE] = C2;\
        }\
    }"
    ,"init__rgb2cmyk": "function() {\
        var C0, C1, C2, CY = FILTER.CHANNEL.CY, MA = FILTER.CHANNEL.MA, YE = FILTER.CHANNEL.YE, RGB2CMYK = FILTER.Color.RGB2CMYK;\
    }"

    ,"rgb2ill": "function() {\
        if (0 !== c[3])\
        {\
            RGB2ILL(c, 0);\
            C0 = c[0]; C1 = c[1]; C2 = c[2];\
            c[ILL1] = min(255, max(0, 255-127*C0)); c[ILL2] = min(255, max(0, 255-127*C1)); c[ILL3] = min(255, max(0, 255-127*C2));\
        }\
    }"
    ,"init__rgb2ill": "function() {\
        var C0, C1, C2, ILL1 = FILTER.CHANNEL.ILL1, ILL2 = FILTER.CHANNEL.ILL2, ILL3 = FILTER.CHANNEL.ILL3, RGB2ILL = FILTER.Color.RGB2ILL, min = Math.min, max = Math.max;\
    }"

    ,"hue": "function() {\
        if (0 !== c[3])\
        {\
            HHH = HUE(c[0], c[1], c[2])*0.7083333333333333/*255/360*/;\
            c[0] = HHH; c[1] = HHH; c[2] = HHH;\
        }\
    }"
    ,"init__hue": "function() {\
        var HUE = FILTER.Color.hue, HHH;\
    }"

    ,"saturation": "function() {\
        if (0 !== c[3])\
        {\
            SSS = SATURATION(c[0], c[1], c[2]);\
            c[0] = SSS; c[1] = SSS; c[2] = SSS;\
        }\
    }"
    ,"init__saturation": "function() {\
        var SATURATION = FILTER.Color.saturation, SSS;\
    }"

    ,"quantize": "function() {\
        if (0 !== c[3])\
        {\
            J = 0; V = VALUE(c[0], c[1], c[2])*FACTOR;\
            while (J<THRESH_LEN && V>THRESH[J]) ++J;\
            COLVAL = J < COLORS_LEN ? COLORS[j] : 0xffffff;\
            c[0] = (COLVAL >>> 16) & 255; c[1] = (COLVAL >>> 8) & 255; c[2] = COLVAL & 255;\
        }\
    }"
    ,"init__quantize": "function() {\
        var FACTOR = 1, VALUE = FILTER.MODE.HUE === self.mode ? FILTER.Color.hue : (FILTER.MODE.SATURATION === self.mode ? FILTER.Color.saturation : (FILTER.MODE.INTENSITY === self.mode ? FILTER.Color.intensity : FILTER.Color.color24)),\
            THRESH = self.thresholds, THRESH_LEN = THRESH.length,\
            COLORS = self.quantizedColors, COLORS_LEN = COLORS.length, J, COLVAL, V;\
        //if (FILTER.MODE.HUE === self.mode) FACTOR = 0.7083333333333333/*255/360*/;\
    }"

    ,"mask": "function() {\
        if (0 !== c[3])\
        {\
            V = VALUE(c[0], c[1], c[2]);\
            if ((V < MIN_VALUE) || (V > MAX_VALUE))\
            {\
                c[0] = COLVAL[0];\
                c[1] = COLVAL[1];\
                c[2] = COLVAL[2];\
                c[3] = COLVAL[3];\
            }\
        }\
    }"
    ,"init__mask": "function() {\
        var VALUE = FILTER.MODE.HUE === self.mode ? FILTER.Color.hue : (FILTER.MODE.SATURATION === self.mode ? FILTER.Color.saturation : (FILTER.MODE.INTENSITY === self.mode ? FILTER.Color.intensity : FILTER.Color.color24)),\
            MIN_VALUE = self.thresholds[0], MAX_VALUE = self.thresholds[self.thresholds.length-1],\
            COLVAL = [(self.quantizedColors[0] >>> 16) & 255, (self.quantizedColors[0] >>> 8) & 255, self.quantizedColors[0] & 255, (self.quantizedColors[0] >>> 24) & 255], V;\
    }"
};

}(FILTER);