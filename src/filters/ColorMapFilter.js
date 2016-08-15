/**
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
var ColorMapFilter = FILTER.Create({
    name: "ColorMapFilter"
    
    ,init: function ColorMapFilter( M, init ) {
        var self = this;
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
            _mapName: self._mapName || null
            ,_map: ("generic" === self._mapName) && self._map && self._mapChanged ? self._map.toString( ) : null
            ,_mapInit: ("generic" === self._mapName) && self._mapInit && self._mapChanged ? self._mapInit.toString( ) : null
            ,thresholds: self.thresholds
            ,quantizedColors: self.quantizedColors
            ,mode: self.mode
        };
        self._mapChanged = false;
        return json;
    }
    
    ,unserialize: function( params ) {
        var self = this;
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
            self.set(params._map, params._mapInit||null);
        }
        /*else
        {
            self._map = null;
        }*/
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
    ,threshold: null
    
    ,mask: function( min, max, background ) {
        var self = this;
        self.thresholds = [min, max];
        self.quantizedColors = [background || 0];
        return self.set("mask");
    }
    ,extract: null
    
    ,set: function( M, preample ) {
        var self = this;
        if ( M && Maps.hasOwnProperty(String(M)) )
        {
            if ( self._mapName !== String(M) )
            {
                self._mapName = String(M);
                self._map = Maps[self._mapName];
                self._mapInit = Maps["init__"+self._mapName];
                self._apply = apply__( self._map, self._mapInit );
            }
            self._mapChanged = false;
        }
        else if ( M )
        {
            self._mapName = "generic"; 
            self._map = T;
            self._mapInit = preample || null;
            self._apply = apply__( self._map, self._mapInit );
            self._mapChanged = true;
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
    return new Function("FILTER", "\"use strict\";\
    return function( im, w, h ){\
    var self = this;\
    if ( !self._map ) return im;\
    var x, y, i, imLen = im.length, imArea = imLen>>>2, rem = (imArea&7)<<2, c = new FILTER.ColorMatrix(4);\
\
    "+__INIT__+";\
    \
    for (x=0,y=0,i=0; i<imLen; i+=32)\
    {\
        c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; y++;}\
        c[0] = im[i+4]; c[1] = im[i+5]; c[2] = im[i+6]; c[3] = im[i+7];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i+4] = c[0]|0; im[i+5] = c[1]|0; im[i+6] = c[2]|0; im[i+7] = c[3]|0;\
        \
        if (++x>=w) {x=0; y++;}\
        c[0] = im[i+8]; c[1] = im[i+9]; c[2] = im[i+10]; c[3] = im[i+11];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i+8] = c[0]|0; im[i+9] = c[1]|0; im[i+10] = c[2]|0; im[i+11] = c[3]|0;\
        \
        if (++x>=w) {x=0; y++;}\
        c[0] = im[i+12]; c[1] = im[i+13]; c[2] = im[i+14]; c[3] = im[i+15];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i+12] = c[0]|0; im[i+13] = c[1]|0; im[i+14] = c[2]|0; im[i+15] = c[3]|0;\
        \
        if (++x>=w) {x=0; y++;}\
        c[0] = im[i+16]; c[1] = im[i+17]; c[2] = im[i+18]; c[3] = im[i+19];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i+16] = c[0]|0; im[i+17] = c[1]|0; im[i+18] = c[2]|0; im[i+19] = c[3]|0;\
        \
        if (++x>=w) {x=0; y++;}\
        c[0] = im[i+20]; c[1] = im[i+21]; c[2] = im[i+22]; c[3] = im[i+23];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i+20] = c[0]|0; im[i+21] = c[1]|0; im[i+22] = c[2]|0; im[i+23] = c[3]|0;\
        \
        if (++x>=w) {x=0; y++;}\
        c[0] = im[i+24]; c[1] = im[i+25]; c[2] = im[i+26]; c[3] = im[i+27];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i+24] = c[0]|0; im[i+25] = c[1]|0; im[i+26] = c[2]|0; im[i+27] = c[3]|0;\
        \
        if (++x>=w) {x=0; y++;}\
        c[0] = im[i+28]; c[1] = im[i+29]; c[2] = im[i+30]; c[3] = im[i+31];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i+28] = c[0]|0; im[i+29] = c[1]|0; im[i+30] = c[2]|0; im[i+31] = c[3]|0;\
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
            im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
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

}(FILTER);