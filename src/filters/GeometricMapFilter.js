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
        if ('polar' === T)
        {
            self._mapName = 'polar';
            self._map = 'polar';
            self._mapInit = null;
            self._apply = polar.bind(self);
            self._mapChanged = false;
        }
        else if ('cartesian' === T)
        {
            self._mapName = 'cartesian';
            self._map = 'cartesian';
            self._mapInit = null;
            self._apply = cartesian.bind(self);
            self._mapChanged = false;
        }
        else if (T && HAS.call(MAP, String(T)))
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
    if (!filter._map) return {instance: filter, shader: GLSL.DEFAULT};
    if (HAS.call(GLSLMAP, filter._mapName))
    {
        return {instance: filter, shader: [
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
            'void main(void) {',
                'vec2 p = pix;',
                'if (1 == mapping) p = twirl(pix, center, radius, angle, size);',
                'else if (2 == mapping) p = sphere(pix, center, radius2, size);',
                'else if (3 == mapping) p = polar(pix, center, RMAX, AMAX, size, swap);',
                'else if (4 == mapping) p = cartesian(pix, center, RMAX, AMAX, size, swap);',
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
            ].join('\n'),
            vars: function(gl, w, h, program) {
                var color = filter.color || 0,
                    cx = filter.centerX,
                    cy = filter.centerY,
                    fx = (w-1)*(w-1), fy = (h-1)*(h-1),
                    RMAX =  max(
                        sqrt(fx * (cx - 0) * (cx - 0) + fy * (cy - 0) * (cy - 0)),
                        sqrt(fx * (cx - 1) * (cx - 1) + fy * (cy - 0) * (cy - 0)),
                        sqrt(fx * (cx - 0) * (cx - 0) + fy * (cy - 1) * (cy - 1)),
                        sqrt(fx * (cx - 1) * (cx - 1) + fy * (cy - 1) * (cy - 1))
                    );
                gl.uniform4f(program.uniform.color,
                    ((color >>> 16) & 255)/255,
                    ((color >>> 8) & 255)/255,
                    (color & 255)/255,
                    ((color >>> 24) & 255)/255
                );
                gl.uniform2f(program.uniform.size,
                    w, h
                );
                gl.uniform2f(program.uniform.center,
                    cx, cy
                );
                gl.uniform1f(program.uniform.angle,
                    filter.angle
                );
                gl.uniform1f(program.uniform.radius,
                    filter.radius
                );
                gl.uniform1f(program.uniform.radius2,
                    filter.radius*filter.radius
                );
                gl.uniform1f(program.uniform.AMAX,
                    TWOPI
                );
                gl.uniform1f(program.uniform.RMAX,
                    RMAX
                );
                gl.uniform1i(program.uniform.swap,
                    filter.posX === Y ? 1 : 0
                );
                gl.uniform1i(program.uniform.mapping,
                    'twirl' === filter._mapName ? 1 : (
                    'sphere' === filter._mapName ? 2 : (
                    'polar' === filter._mapName ? 3 : (
                    'cartesian' === filter._mapName ? 4 : 0
                    )
                    )
                    )
                );
            }
        };
    }
    else
    {
        return {instance: filter, shader: filter._map.shader, vars: filter._map.vars, textures: filter._map.textures};
    }
}
// geometric maps
function polar(im, w, h)
{
    var self = this, x, y, xx, yy, a, r, i, j,
        imLen = im.length, W = w-1, H = h-1,
        cx = self.centerX*W, cy = self.centerY*H,
        px = self.posX, py = self.posY,
        COLOR = FILTER.MODE.COLOR,
        CLAMP = FILTER.MODE.CLAMP,
        WRAP = FILTER.MODE.WRAP,
        IGNORE = FILTER.MODE.IGNORE,
        mode = self.mode||IGNORE,
        color = self.color||0,
        ca = (color >>> 24)&255,
        cr = (color >>> 16)&255,
        cg = (color >>> 8)&255,
        cb = (color)&255,
		aMax = TWOPI, rMax = floor(max(
        sqrt((cx - 0) * (cx - 0) + (cy - 0) * (cy - 0)),
        sqrt((cx - W) * (cx - W) + (cy - 0) * (cy - 0)),
        sqrt((cx - 0) * (cx - 0) + (cy - H) * (cy - H)),
        sqrt((cx - W) * (cx - W) + (cy - H) * (cy - H))
        )),
        dst = new FILTER.ImArray(imLen);
    for (i=0,yy=0,xx=0; i<imLen; ++xx,i+=4)
    {
        if (xx >= w) {xx=0; ++yy;}

        if (px === Y)
        {
            r = rMax*yy/H;
            a = aMax*xx/W;
            y = round(r*cos(a) + cy);
            x = round(r*sin(a) + cx);
        }
        else
        {
            r = rMax*xx/W;
            a = aMax*yy/H;
            x = round(r*cos(a) + cx);
            y = round(r*sin(a) + cy);
        }
        if (0 > x || x >= w || 0 > y || y >= h)
        {
            if (COLOR === mode)
            {
                dst[i] = cr; dst[i+1] = cg;
                dst[i+2] = cb; dst[i+3] = ca;
                continue;
            }
            else if (WRAP === mode)
            {
                if (0 > x) x += w;
                if (w <= x) x -= w;
                if (0 > y) y += h;
                if (h <= y) y -= h;
            }
            else if (CLAMP === mode)
            {
                x = clamp(x, 0, W);
                y = clamp(y, 0, H);
            }
            else
            {
                continue;
            }
        }
        j = (x + y*w) << 2;
        dst[i] = im[j]; dst[i+1] = im[j+1];
        dst[i+2] = im[j+2]; dst[i+3] = im[j+3];
    }
    return dst;
}
function cartesian(im, w, h)
{
    var self = this, x, y, xx, yy, a, r, i, j,
        imLen = im.length, W = w-1, H = h-1,
        cx = self.centerX*W, cy = self.centerY*H,
        px = self.posX, py = self.posY,
        COLOR = FILTER.MODE.COLOR,
        CLAMP = FILTER.MODE.CLAMP,
        WRAP = FILTER.MODE.WRAP,
        IGNORE = FILTER.MODE.IGNORE,
        mode = self.mode||IGNORE,
        color = self.color||0,
        ca = (color >>> 24)&255,
        cr = (color >>> 16)&255,
        cg = (color >>> 8)&255,
        cb = (color)&255,
		aMax = TWOPI, rMax = floor(max(
        sqrt((cx - 0) * (cx - 0) + (cy - 0) * (cy - 0)),
        sqrt((cx - W) * (cx - W) + (cy - 0) * (cy - 0)),
        sqrt((cx - 0) * (cx - 0) + (cy - H) * (cy - H)),
        sqrt((cx - W) * (cx - W) + (cy - H) * (cy - H))
        )),
        dst = new FILTER.ImArray(imLen);
    for (i=0,yy=0,xx=0; i<imLen; ++xx,i+=4)
    {
        if (xx >= w) {xx=0; ++yy;}

        if (px === Y)
        {
            y = xx - cx;
            x = yy - cy;
        }
        else
        {
            x = xx - cx;
            y = yy - cy;
        }
        r = sqrt(x*x + y*y);
        a = atan(y, x);
        if (0 > a) a += TWOPI;
        if (px === Y)
        {
            y = round(H*r/rMax);
            x = round(W*a/aMax);
        }
        else
        {
            x = round(W*r/rMax);
            y = round(H*a/aMax);
        }
        if (0 > x || x >= w || 0 > y || y >= h)
        {
            if (COLOR === mode)
            {
                dst[i] = cr; dst[i+1] = cg;
                dst[i+2] = cb; dst[i+3] = ca;
                continue;
            }
            else if (WRAP === mode)
            {
                if (0 > x) x += w;
                if (w <= x) x -= w;
                if (0 > y) y += h;
                if (h <= y) y -= h;
            }
            else if (CLAMP === mode)
            {
                x = clamp(x, 0, W);
                y = clamp(y, 0, H);
            }
            else
            {
                continue;
            }
        }
        j = (x + y*w) << 2;
        dst[i] = im[j]; dst[i+1] = im[j+1];
        dst[i+2] = im[j+2]; dst[i+3] = im[j+3];
    }
    return dst;
}
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