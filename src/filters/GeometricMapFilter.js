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
!function(FILTER, undef) {
"use strict";

var MAP, GLSLMAP, MODE = FILTER.MODE,
    function_body = FILTER.Util.String.function_body,
    stdMath = Math, floor = stdMath.floor, round = stdMath.round,
    sqrt = stdMath.sqrt, atan = stdMath.atan2,
    sin = stdMath.sin, cos = stdMath.cos,
    max = stdMath.max, min = stdMath.min,
    PI = stdMath.PI, TWOPI = 2*PI,
    clamp = FILTER.Util.Math.clamp,
    X = FILTER.POS.X, Y = FILTER.POS.Y,
    HAS = Object.prototype.hasOwnProperty,
    GLSL = FILTER.Util.GLSL;

// GeometricMapFilter
var GeometricMapFilter = FILTER.Create({
    name: "GeometricMapFilter"

    ,init: function GeometricMapFilter(T, init) {
        var self = this;
        if (T) self.set(T, init);
    }

    ,path: FILTER.Path
    ,_map: null
    ,_mapInit: null
    ,_mapName: null
    ,_mapChanged: false
    // parameters
    ,color: 0
    ,centerX: 0
    ,centerY: 0
    ,posX: 0
    ,posY: 1
    ,angle: 0
    ,radius: 0
    ,mode: MODE.CLAMP

    ,dispose: function() {
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
        self.$super('dispose');

        return self;
    }

    ,serialize: function() {
        var self = this, json;
        json = {
            _mapName: self._mapName || null
            ,_map: ("generic" === self._mapName) && self._map && self._mapChanged ? (self._map.filter || self._map).toString() : null
            ,_mapInit: ("generic" === self._mapName) && self._mapInit && self._mapChanged ? self._mapInit.toString() : null
            ,color: self.color
            ,centerX: self.centerX
            ,centerY: self.centerY
            ,posX: self.posX
            ,posY: self.posY
            ,angle: self.angle
            ,radius: self.radius
        };
        self._mapChanged = false;
        return json;
    }

    ,unserialize: function(params) {
        var self = this;
        self.color = params.color;
        self.centerX = params.centerX;
        self.centerY = params.centerY;
        self.posX = params.posX;
        self.posY = params.posY;
        self.angle = params.angle;
        self.radius = params.radius;

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

    ,twirl: function(angle, radius, centerX, centerY) {
        var self = this;
        self.angle = angle||0; self.radius = radius||0;
        self.centerX = centerX||0; self.centerY = centerY||0;
        return self.set("twirl");
    }

    ,sphere: function(radius, centerX, centerY) {
        var self = this;
        self.radius = radius||0; self.centerX = centerX||0; self.centerY = centerY||0;
        return self.set("sphere");
    }

    ,polar: function(centerX, centerY, posX, posY) {
        var self = this;
        self.centerX = centerX||0; self.centerY = centerY||0;
        self.posX = posX||0; self.posY = posY||0;
        return self.set("polar");
    }

    ,cartesian: function(centerX, centerY, posX, posY) {
        var self = this;
        self.centerX = centerX||0; self.centerY = centerY||0;
        self.posX = posX||0; self.posY = posY||0;
        return self.set("cartesian");
    }

    ,set: function(T, preample) {
        var self = this;
        if (T && HAS.call(MAP, String(T)))
        {
            if (self._mapName !== String(T))
            {
                self._mapName = String(T);
                self._map = MAP[self._mapName];
                self._mapInit = MAP["init__"+self._mapName];
                self._apply = apply__(self._map, self._mapInit);
            }
            self._mapChanged = false;
        }
        else if (T)
        {
            self._mapName = "generic";
            self._map = T;
            self._mapInit = preample || null;
            self._apply = apply__(self._map, self._mapInit);
            self._mapChanged = true;
        }
        self._glsl = null;
        return self;
    }

    ,reset: function() {
        var self = this;
        self._mapName = null;
        self._map = null;
        self._mapInit = null;
        self._mapChanged = false;
        self._glsl = null;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return wasm(this);
    }

    ,canRun: function() {
        return this._isOn && this._map;
    }
});
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    geometricmapfilter: {inputs: [{arg:0,type:FILTER.ImArray},{arg:5,type:FILTER.Array32F}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
        GeometricMapFilter.prototype._apply_wasm = function(im, w, h) {
            var self = this, map = self._mapName, mapCode;
            if (!map) return im;
            mapCode = 'twirl' === map ? 1 : (
                    'sphere' === map ? 2 : (
                    'polar' === map ? 3 : (
                    'cartesian' === map ? 4 : 0
                    )
                )
            );
            // custom
            if (0 === mapCode) return self._apply(im, w, h);
            return wasm.geometricmapfilter(im, w, h, self.mode||0, mapCode, [self.centerX||0, self.centerY||0,self.radius||0,self.angle||0,self.posX||0,self.posY||0], self.color||0);
        };
    }
    FILTER.unwaitFor(1);
});
}

// private methods
function apply__(map, preample)
{
    var __INIT__ = preample ? function_body(preample) : '', __APPLY__ = function_body(map.filter || map);
        //"use asm";
    return new Function("FILTER", "\"use strict\"; return function(im, w, h) {\
    var self = this;\
    if (!self._map) return im;\
    var x, y, i, j, imLen = im.length, dst = new FILTER.ImArray(imLen), t = new FILTER.Array32F(2),\
        COLOR = FILTER.MODE.COLOR, CLAMP = FILTER.MODE.CLAMP, WRAP = FILTER.MODE.WRAP, IGNORE = FILTER.MODE.IGNORE,\
        mode = self.mode||IGNORE, color = self.color||0, r, g, b, a, bx = w-1, by = h-1;\
\
    "+__INIT__+";\
    \
    if (COLOR === mode)\
    {\
        a = (color >>> 24)&255;\
        r = (color >>> 16)&255;\
        g = (color >>> 8)&255;\
        b = (color)&255;\
    \
        for (x=0,y=0,i=0; i<imLen; i+=4,++x)\
        {\
            if (x>=w) {x=0; ++y;}\
            \
            t[0] = x; t[1] = y;\
            \
            "+__APPLY__+";\
            \
            if (0>t[0] || t[0]>bx || 0>t[1] || t[1]>by)\
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
    else if (IGNORE === mode)\
    {\
        for (x=0,y=0,i=0; i<imLen; i+=4,++x)\
        {\
            if (x>=w) {x=0; ++y;}\
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
    else if (WRAP === mode)\
    {\
        for (x=0,y=0,i=0; i<imLen; i+=4,++x)\
        {\
            if (x>=w) {x=0; ++y;}\
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
    else /*if (CLAMP === mode)*/\
    {\
        for (x=0,y=0,i=0; i<imLen; i+=4,++x)\
        {\
            if (x>=w) {x=0; ++y;}\
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
};")(FILTER);
}
function glsl(filter)
{
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader(!filter._map ? GLSL.DEFAULT : [
    'varying vec2 pix;',
    'uniform sampler2D img;',
    '#define TWOPI  6.283185307179586',
    '#define IGNORE '+MODE.IGNORE+'',
    '#define CLAMP '+MODE.CLAMP+'',
    '#define COLOR '+MODE.COLOR+'',
    '#define WRAP '+MODE.WRAP+'',
    'uniform int mode;',
    'uniform int swap;',
    'uniform vec2 size;',
    'uniform vec2 center;',
    'uniform float angle;',
    'uniform float radius;',
    'uniform float radius2;',
    'uniform float AMAX;',
    'uniform float RMAX;',
    'uniform vec4 color;',
    'uniform int mapping;',
    GLSLMAP['twirl'],
    GLSLMAP['sphere'],
    GLSLMAP['polar'],
    GLSLMAP['cartesian'],
    (HAS.call(GLSLMAP, filter._mapName) || !filter._map.shader
    ? 'vec2 map(vec2 pix) {return pix;}'
    : filter._map.shader.toString()),
    'void main(void) {',
        'vec2 p = pix;',
        'if (1 == mapping)      p = twirl(pix, center, radius, angle, size);',
        'else if (2 == mapping) p = sphere(pix, center, radius2, size);',
        'else if (3 == mapping) p = polar(pix, center, RMAX, AMAX, size, swap);',
        'else if (4 == mapping) p = cartesian(pix, center, RMAX, AMAX, size, swap);',
        'else                   p = map(pix);',
        'if (0.0 > p.x || 1.0 < p.x || 0.0 > p.y || 1.0 < p.y) {',
            'if (COLOR == mode) {gl_FragColor = color;}',
            'else if (CLAMP == mode) {gl_FragColor = texture2D(img, vec2(clamp(p.x, 0.0, 1.0),clamp(p.y, 0.0, 1.0)));}',
            'else if (WRAP == mode) {',
                'if (0.0 > p.x) p.x += 1.0;',
                'if (1.0 < p.x) p.x -= 1.0;',
                'if (0.0 > p.y) p.y += 1.0;',
                'if (1.0 < p.y) p.y -= 1.0;',
                'gl_FragColor = texture2D(img, p);',
            '}',
            'else {gl_FragColor = texture2D(img, pix);}',
        '} else {',
            'gl_FragColor = texture2D(img, p);',
        '}',
    '}'
    ].join('\n'))
    .input('size', function(filter, w, h) {return [w, h];})
    .input('center', function(filter) {return [filter.centerX, filter.centerY];})
    .input('angle', function(filter) {return filter.angle;})
    .input('radius', function(filter) {return filter.radius;})
    .input('radius2', function(filter) {return filter.radius*filter.radius;})
    .input('AMAX', function(filter) {return TWOPI;})
    .input('RMAX', function(filter, w, h) {
        var cx = filter.centerX,
            cy = filter.centerY,
            fx = (w-1)*(w-1), fy = (h-1)*(h-1);
        return max(
        sqrt(fx * (cx - 0) * (cx - 0) + fy * (cy - 0) * (cy - 0)),
        sqrt(fx * (cx - 1) * (cx - 1) + fy * (cy - 0) * (cy - 0)),
        sqrt(fx * (cx - 0) * (cx - 0) + fy * (cy - 1) * (cy - 1)),
        sqrt(fx * (cx - 1) * (cx - 1) + fy * (cy - 1) * (cy - 1))
        );
    })
    .input('swap', function(filter) {return filter.posX === Y ? 1 : 0;})
    .input('color', function(filter) {
        var color = filter.color || 0;
        return [
        ((color >>> 16) & 255)/255,
        ((color >>> 8) & 255)/255,
        (color & 255)/255,
        ((color >>> 24) & 255)/255
        ];
    })
    .input('mapping', function(filter) {
        return 'twirl' === filter._mapName ? 1 : (
        'sphere' === filter._mapName ? 2 : (
        'polar' === filter._mapName ? 3 : (
        'cartesian' === filter._mapName ? 4 : 0
        )
        )
        );
    });
    if (filter._map.shader && filter._map.inputs) filter._map.inputs.forEach(function(i) {
        if (i.name && i.setter) glslcode.input(i.name, i.setter, i.iname);
    });
    return glslcode.end().code();
}
// geometric maps
MAP = {
    // adapted from http://je2050.de/imageprocessing/ TwirlMap
     "twirl": "function() {\
        TX = t[0]-CX; TY = t[1]-CY;\
        D = Sqrt(TX*TX + TY*TY);\
        if (D < R)\
        {\
            theta = Atan2(TY, TX) + fact*(R-D);\
            t[0] = CX + D*Cos(theta);  t[1] = CY + D*Sin(theta);\
        }\
    }"
    ,"init__twirl": "function() {\
        var Sqrt = Math.sqrt, Atan2 = Math.atan2, Sin = Math.sin, Cos = Math.cos,\
            CX = self.centerX*(w-1), CY = self.centerY*(h-1),\
            angle = self.angle, R = self.radius, fact = angle/R,\
            D, TX, TY, theta;\
    }"

    // adapted from http://je2050.de/imageprocessing/ SphereMap
    ,"sphere": "function() {\
        TX = t[0]-CX;  TY = t[1]-CY;\
        TX2 = TX*TX; TY2 = TY*TY;\
        D2 = TX2 + TY2;\
        if (D2 < R2)\
        {\
            D2 = R2 - D2; D = Sqrt(D2);\
            thetax = Asin(TX / Sqrt(TX2 + D2)) * invrefraction;\
            thetay = Asin(TY / Sqrt(TY2 + D2)) * invrefraction;\
            t[0] = t[0] - D * Tan(thetax);  t[1] = t[1] - D * Tan(thetay);\
        }\
    }"
    ,"init__sphere": "function() {\
        var Sqrt = Math.sqrt, Asin = Math.asin, Tan = Math.tan,\
            CX = self.centerX*(w-1), CY = self.centerY*(h-1),\
            invrefraction = 1-0.555556,\
            R = self.radius, R2 = R*R,\
            D, TX, TY, TX2, TY2, R2, D2, thetax, thetay;\
    }"
    ,"polar": "function() {\
        if (px === Y)\
        {\
            r = rMax*t[1]/H;\
            a = aMax*t[0]/W;\
            t[1] = round(r*cos(a) + cy);\
            t[0] = round(r*sin(a) + cx);\
        }\
        else\
        {\
            r = rMax*t[0]/W;\
            a = aMax*t[1]/H;\
            t[0] = round(r*cos(a) + cx);\
            t[1] = round(r*sin(a) + cy);\
        }\
    }"
    ,"init__polar": "function() {\
        var sqrt = Math.sqrt, sin = Math.sin, cos = Math.cos,\
            floor = Math.floor, round = Math.round, max = Math.max,\
            W = w-1, H = h-1, Y = 1,\
            cx = self.centerX*W, cy = self.centerY*H,\
            px = self.posX, py = self.posY,\
            aMax = 6.283185307179586,\
            rMax = round(max(\
            sqrt((cx - 0) * (cx - 0) + (cy - 0) * (cy - 0)),\
            sqrt((cx - W) * (cx - W) + (cy - 0) * (cy - 0)),\
            sqrt((cx - 0) * (cx - 0) + (cy - H) * (cy - H)),\
            sqrt((cx - W) * (cx - W) + (cy - H) * (cy - H))\
            )), r, a\
        ;\
    }"
    ,"cartesian": "function() {\
        if (px === Y)\
        {\
            ty = t[0] - cx;\
            tx = t[1] - cy;\
        }\
        else\
        {\
            tx = t[0] - cx;\
            ty = t[1] - cy;\
        }\
        r = sqrt(tx*tx + ty*ty);\
        a = atan(ty, tx);\
        if (0 > a) a += 6.283185307179586;\
        if (px === Y)\
        {\
            t[1] = round(H*r/rMax);\
            t[0] = round(W*a/aMax);\
        }\
        else\
        {\
            t[0] = round(W*r/rMax);\
            t[1] = round(H*a/aMax);\
        }\
    }"
    ,"init__cartesian": "function() {\
        var sqrt = Math.sqrt, atan = Math.atan2,\
            floor = Math.floor, round = Math.round, max = Math.max,\
            W = w-1, H = h-1, Y = 1,\
            cx = self.centerX*W, cy = self.centerY*H,\
            px = self.posX, py = self.posY,\
            aMax = 6.283185307179586,\
            rMax = round(max(\
            sqrt((cx - 0) * (cx - 0) + (cy - 0) * (cy - 0)),\
            sqrt((cx - W) * (cx - W) + (cy - 0) * (cy - 0)),\
            sqrt((cx - 0) * (cx - 0) + (cy - H) * (cy - H)),\
            sqrt((cx - W) * (cx - W) + (cy - H) * (cy - H))\
            )), r, a, tx, ty\
        ;\
    }"
};

GLSLMAP = {
     "twirl": [
     'vec2 twirl(vec2 pix, vec2 center, float R, float angle, vec2 size) {',
        'vec2 T = size*(pix - center);',
        'float D = length(T);',
        'if (D < R) {',
            'float theta = atan(T.y, T.x) + (R-D)*angle/R;',
            'pix = (size*center + vec2(D*cos(theta),  D*sin(theta)))/size;',
        '}',
        'return pix;',
    '}'
    ].join('\n')
    ,"sphere": [
    'vec2 sphere(vec2 pix, vec2 center, float R2, vec2 size) {',
        'vec2 T = size*(pix - center);',
        'float TX2 = T.x*T.x; float TY2 = T.y*T.y;',
        'float D2 = TX2 + TY2;',
        'if (D2 < R2) {',
            'D2 = R2 - D2;',
            'float D = sqrt(D2);',
            'float thetax = asin(T.x / sqrt(TX2 + D2)) * (1.0-0.555556);',
            'float thetay = asin(T.y / sqrt(TY2 + D2)) * (1.0-0.555556);',
            'pix = pix - vec2(D * tan(thetax), D * tan(thetay))/size;',
        '}',
        'return pix;',
    '}'
    ].join('\n')
    ,"polar": [
    'vec2 polar(vec2 pix, vec2 center, float rMax, float aMax, vec2 size, int swap) {',
        'float r = 0.0;',
        'float a = 0.0;',
        '/*pix *= size;*/',
        'if (1 == swap) {',
            'r = pix.y*rMax;',
            'a = pix.x*aMax;',
            'return (size*center + vec2(r*sin(a), r*cos(a)))/size;',
        '} else {',
            'r = pix.x*rMax;',
            'a = pix.y*aMax;',
            'return (size*center + vec2(r*cos(a), r*sin(a)))/size;',
        '}',
    '}'
    ].join('\n')
    ,"cartesian": [
    'vec2 cartesian(vec2 pix, vec2 center, float rMax, float aMax, vec2 size, int swap) {',
        'vec2 xy = size* (pix - center);',
        'float r = 0.0;',
        'float a = 0.0;',
        'if (1 == swap) {',
            'xy = xy.yx;',
            'r = length(xy);',
            'a = atan(xy.y, xy.x);',
            'if (0.0 > a) a += TWOPI;',
            'return vec2(a/aMax, r/rMax);',
        '} else {',
            'r = length(xy);',
            'a = atan(xy.y, xy.x);',
            'if (0.0 > a) a += TWOPI;',
            'return vec2(r/rMax, a/aMax);',
        '}',
    '}'
    ].join('\n')
};
function wasm()
{
    return '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';
}
}(FILTER);