/**
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

var MAP, MODE = FILTER.MODE, function_body = FILTER.Util.String.function_body;

// GeometricMapFilter
FILTER.Create({
    name: "GeometricMapFilter"
    
    ,init: function GeometricMapFilter( T, init ) {
        var self = this;
        if ( T ) self.set( T, init );
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_map: null
    ,_mapInit: null
    ,_mapName: null
    ,_mapChanged: false
    // parameters
    ,color: 0
    ,centerX: 0
    ,centerY: 0
    ,angle: 0
    ,radius: 0
    //,wavelength: 0
    //,amplitude: 0
    //,phase: 0
    ,mode: MODE.CLAMP
    
    ,dispose: function( ) {
        var self = this;
        
        self._map = null;
        self._mapInit = null;
        self._mapName = null;
        self._mapChanged = null;
        
        self.color = 0;
        self.centerX = null;
        self.centerY = null;
        self.angle = null;
        self.radius = null;
        //self.wavelength = null;
        //self.amplitude = null;
        //self.phase = null;
        self.$super('dispose');
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, json;
        json = {
            _mapName: self._mapName || null
            ,_map: ("generic" === self._mapName) && self._map && self._mapChanged ? self._map.toString( ) : null
            ,_mapInit: ("generic" === self._mapName) && self._mapInit && self._mapChanged ? self._mapInit.toString( ) : null
            ,color: self.color
            ,centerX: self.centerX
            ,centerY: self.centerY
            ,angle: self.angle
            ,radius: self.radius
            //,wavelength: self.wavelength
            //,amplitude: self.amplitude
            //,phase: self.phase
        };
        self._mapChanged = false;
        return json;
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.color = params.color;
        self.centerX = params.centerX;
        self.centerY = params.centerY;
        self.angle = params.angle;
        self.radius = params.radius;
        //self.wavelength = params.wavelength;
        //self.amplitude = params.amplitude;
        //self.phase = params.phase;
        
        //self._mapName = params._mapName;
        //self._map = params._map;
        if ( !params._map && params._mapName && MAP.hasOwnProperty(params._mapName) )
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
    
    ,polar: function( centerX, centerY ) {
        return this;
    }
    
    ,cartesian: function( centerX, centerY ) {
        return this;
    }
    
    ,twirl: function( angle, radius, centerX, centerY ) {
        var self = this;
        self.angle = angle||0; self.radius = radius||0;
        self.centerX = centerX||0; self.centerY = centerY||0;
        return self.set("twirl");
    }
    
    ,sphere: function( radius, centerX, centerY ) {
        var self = this;
        self.radius = radius||0; self.centerX = centerX||0; self.centerY = centerY||0;
        return self.set("sphere");
    }
    
    /*,ripple: function( radius, wavelength, amplitude, phase, centerX, centerY ) {
        var self = this;
        self.radius = radius!==undef ? radius : 50; 
        self.centerX = centerX||0; 
        self.centerY = centerY||0;
        self.wavelength = wavelength!==undef ? wavelength : 16; 
        self.amplitude = amplitude!==undef ? amplitude : 10; 
        self.phase = phase||0;
        return self.set("ripple");
    }*/
    
    ,set: function( T, preample ) {
        var self = this;
        if ( T && MAP.hasOwnProperty(String(T)) )
        {
            if ( self._mapName !== String(T) )
            {
                self._mapName = String(T);
                self._map = MAP[self._mapName];
                self._mapInit = MAP["init__"+self._mapName];
                self._apply = apply__( self._map, self._mapInit );
            }
            self._mapChanged = false;
        }
        else if ( T )
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
    
    ,canRun: function( ) {
        return this._isOn && this._map;
    }
});

function apply__( map, preample )
{
    var __INIT__ = preample ? function_body(preample) : '', __APPLY__ = function_body(map);
        //"use asm";
    return new Function("FILTER", "\"use strict\"; return function( im, w, h ){\
    var self = this;\
    if ( !self._map ) return im;\
    var x, y, i, j, imLen = im.length, dst = new FILTER.ImArray(imLen), t = new FILTER.Array32F(2),\
        COLOR = FILTER.MODE.COLOR, CLAMP = FILTER.MODE.CLAMP, WRAP = FILTER.MODE.WRAP, IGNORE = FILTER.MODE.IGNORE,\
        mode = self.mode||IGNORE, color = self.color||0, r, g, b, a, bx = w-1, by = h-1;\
\
    "+__INIT__+";\
    \
    if ( COLOR === mode )\
    {\
        a = (color >>> 24)&255;\
        r = (color >>> 16)&255;\
        g = (color >>> 8)&255;\
        b = (color)&255;\
    \
        for (x=0,y=0,i=0; i<imLen; i+=4,x++)\
        {\
            if (x>=w) { x=0; y++; }\
            \
            t[0] = x; t[1] = y;\
            \
            "+__APPLY__+";\
            \
            if ( 0>t[0] || t[0]>bx || 0>t[1] || t[1]>by )\
            {\
                /* color */\
                dst[i] = r;   dst[i+1] = g;\
                dst[i+2] = b;  dst[i+3] = a;\
                continue;\
            }\
            \
            j = ((t[0]|0) + (t[1]|0)*w) << 2;\
            dst[i] = im[j];   dst[i+1] = im[j+1];\
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];\
        }\
    }\
    else if ( IGNORE === mode )\
    {\
        for (x=0,y=0,i=0; i<imLen; i+=4,x++)\
        {\
            if (x>=w) { x=0; y++; }\
            \
            t[0] = x; t[1] = y;\
            \
            "+__APPLY__+";\
            \
            /* ignore */\
            t[1] = t[1] > by || t[1] < 0 ? y : t[1];\
            t[0] = t[0] > bx || t[0] < 0 ? x : t[0];\
            \
            j = ((t[0]|0) + (t[1]|0)*w) << 2;\
            dst[i] = im[j];   dst[i+1] = im[j+1];\
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];\
        }\
    }\
    else if ( WRAP === mode )\
    {\
        for (x=0,y=0,i=0; i<imLen; i+=4,x++)\
        {\
            if (x>=w) { x=0; y++; }\
            \
            t[0] = x; t[1] = y;\
            \
            "+__APPLY__+";\
            \
            /* wrap */\
            t[1] = t[1] > by ? t[1]-h : (t[1] < 0 ? t[1]+h : t[1]);\
            t[0] = t[0] > bx ? t[0]-w : (t[0] < 0 ? t[0]+w : t[0]);\
            \
            j = ((t[0]|0) + (t[1]|0)*w) << 2;\
            dst[i] = im[j];   dst[i+1] = im[j+1];\
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];\
        }\
    }\
    else /*if ( CLAMP === mode )*/\
    {\
        for (x=0,y=0,i=0; i<imLen; i+=4,x++)\
        {\
            if (x>=w) { x=0; y++; }\
            \
            t[0] = x; t[1] = y;\
            \
            "+__APPLY__+";\
            \
            /* clamp */\
            t[1] = t[1] > by ? by : (t[1] < 0 ? 0 : t[1]);\
            t[0] = t[0] > bx ? bx : (t[0] < 0 ? 0 : t[0]);\
            \
            j = ((t[0]|0) + (t[1]|0)*w) << 2;\
            dst[i] = im[j];   dst[i+1] = im[j+1];\
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];\
        }\
    }\
    return dst;\
};")( FILTER );
}

//
// private geometric maps
MAP = {
    // adapted from http://je2050.de/imageprocessing/ TwirlMap
     "twirl": "function( ){\
        TX = t[0]-CX; TY = t[1]-CY;\
        D = Sqrt(TX*TX + TY*TY);\
        if ( D < R )\
        {\
            theta = Atan2(TY, TX) + fact*(R-D);\
            t[0] = CX + D*Cos(theta);  t[1] = CY + D*Sin(theta);\
        }\
    }"
    ,"init__twirl": "function( ){\
        var Sqrt = Math.sqrt, Atan2 = Math.atan2, Sin = Math.sin, Cos = Math.cos,\
            CX = self.centerX*(w-1), CY = self.centerY*(h-1),\
            angle = self.angle, R = self.radius, fact = angle/R,\
            D, TX, TY, theta;\
    }"
    
    // adapted from http://je2050.de/imageprocessing/ SphereMap
    ,"sphere": "function( ){\
        TX = t[0]-CX;  TY = t[1]-CY;\
        TX2 = TX*TX; TY2 = TY*TY;\
        D2 = TX2 + TY2;\
        if ( D2 < R2 )\
        {\
            D2 = R2 - D2; D = Sqrt(D2);\
            thetax = Asin(TX / Sqrt(TX2 + D2)) * invrefraction;\
            thetay = Asin(TY / Sqrt(TY2 + D2)) * invrefraction;\
            t[0] = t[0] - D * Tan(thetax);  t[1] = t[1] - D * Tan(thetay);\
        }\
    }"
    ,"init__sphere": "function( ){\
        var Sqrt = Math.sqrt, Asin = Math.asin, Tan = Math.tan,\
            CX = self.centerX*(w-1), CY = self.centerY*(h-1),\
            invrefraction = 1-0.555556,\
            R = self.radius, R2 = R*R,\
            D, TX, TY, TX2, TY2, R2, D2, thetax, thetay;\
    }"
    /*
    // adapted from https://github.com/JoelBesada/JSManipulate
    ,"ripple": function( t ) {
        TX = t[0]-CX;  TY = t[1]-CY;
        TX2 = TX*TX; TY2 = TY*TY;
        D2 = TX2 + TY2;
        if ( D2 < R2 )
        {
            D = Sqrt(D2);
            amount = amplitude * Sin(D/wavelength * twoPI - phase);
            amount *= (R-D)/R;
            if ( D )  amount *= wavelength/D;
            t[0] = t[0] + TX*amount;  t[1] = t[1] + TY*amount;
        }
    }
    ,"init__ripple": function( )  {
        var Sqrt = Math.sqrt, Sin = Math.asin, twoPI = 2*Math.PI,
            CX = self.centerX*(w-1), CY = self.centerY*(h-1),
            invrefraction = 1-0.555556,
            R = self.radius, R2 = R*R, amount,
            wavelength = self.wavelength, amplitude = self.amplitude, phase = self.phase,
            D, TX, TY, TX2, TY2, D2;
    }*/
};

}(FILTER);