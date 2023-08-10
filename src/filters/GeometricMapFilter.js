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
FILTER.Create({
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

    ,canRun: function() {
        return this._isOn && this._map;
    }
});

// private methods
function glsl(filter)
{
    if (!filter._map) return {instance: filter, shader: GLSL.DEFAULT};
    if (HAS.call(GLSLMAP, filter._mapName))
    {
        return {instance: filter, shader: [
            'precision mediump float;',
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

//
// private geometric maps
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

}(FILTER);