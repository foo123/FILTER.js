/**
*
* Dimension Filter
*
* Changes the dimensions of the image by either (re-)scaling, cropping or padding
*
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var stdMath = Math, ImageUtil = FILTER.Util.Image, GLSL = FILTER.Util.GLSL;

// Dimension Filter, change image dimension
FILTER.Create({
    name: "DimensionFilter"

    ,init: function DimensionFilter(mode, a, b, c, d) {
        var self = this;
        self.set(mode, a, b, c, d);
    }

    ,path: FILTER.Path
    // parameters
    ,m: null
    ,a: 0
    ,b: 0
    ,c: 0
    ,d: 0
    ,meta: null
    ,hasMeta: true

    ,dispose: function() {
        var self = this;
        self.m = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
            m: self.m,
            a: self.a,
            b: self.b,
            c: self.c,
            d: self.d
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.set(params.m, params.a, params.b, params.c, params.d);
        return self;
    }

    ,metaData: function(serialisation) {
        return serialisation && FILTER.isWorker ? JSON.stringify(this.meta) : this.meta;
    }

    ,setMetaData: function(meta, serialisation) {
        this.meta = serialisation && ("string" === typeof meta) ? JSON.parse(meta) : meta;
        return this;
    }

    ,set: function(m, a, b, c, d) {
        var self = this;
        if (m)
        {
            self.m = String(m || 'scale').toLowerCase();
            self.a = a || 0;
            self.b = b || 0;
            self.c = c || 0;
            self.d = d || 0;
        }
        else
        {
            self.m = null;
            self.a = 0;
            self.b = 0;
            self.c = 0;
            self.d = 0;
        }
        self._glsl = null;
        return self;
    }

    ,reset: function() {
        return this.set(null);
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return null;
    }

    ,_apply: function(im, w, h, metaData) {
        var self = this, isWASM = self._runWASM, mode = self.m,
            a = self.a, b = self.b, c = self.c, d = self.d;
        if (!mode)
        {
            self.meta = null;
            self.hasMeta = false;
            return im;
        }
        self.hasMeta = true;
        switch (mode)
        {
            case 'set':
                if (c && d)
                {
                    // scale given
                    a = stdMath.round(c*w);
                    b = stdMath.round(d*h);
                }
                else
                {
                    // dimensions given
                    a = stdMath.round(a);
                    b = stdMath.round(b);
                }
                im = new FILTER.ImArray((a*b) << 2);
                self.meta = {_IMG_WIDTH:a, _IMG_HEIGHT:b};
            break;
            case 'pad':
                a = stdMath.round(a);
                b = stdMath.round(b);
                c = stdMath.round(c);
                d = stdMath.round(d);
                im = ImageUtil.pad(im, w, h, c, d, a, b);
                self.meta = {_IMG_WIDTH:a + c + w, _IMG_HEIGHT:b + d + h};
            break;
            case 'crop':
                a = stdMath.round(a);
                b = stdMath.round(b);
                c = stdMath.round(c);
                d = stdMath.round(d);
                im = ImageUtil.crop(im, w, h, a, b, a+c-1, b+d-1);
                self.meta = {_IMG_WIDTH:c, _IMG_HEIGHT:d};
            break;
            case 'scale':
            default:
                if (c && d)
                {
                    // scale given
                    a = stdMath.round(c*w);
                    b = stdMath.round(d*h);
                }
                else
                {
                    // dimensions given
                    a = stdMath.round(a);
                    b = stdMath.round(b);
                }
                im = isWASM ? (ImageUtil.wasm||ImageUtil)['interpolate'](im, w, h, a, b) : ImageUtil.interpolate(im, w, h, a, b);
                self.meta = {_IMG_WIDTH:a, _IMG_HEIGHT:b};
            break;
        }
        return im;
    }
});

function glsl(filter)
{
    var img_util = ImageUtil.glsl();
    var get = function(filter, w, h) {
        var modeCode,
            a = filter.a,
            b = filter.b,
            c = filter.c,
            d = filter.d,
            nw, nh;
        switch (filter.m)
        {
            case 'set':
            modeCode = 1;
            if (c && d)
            {
                // scale given
                a = c*w;
                b = d*h;
            }
            nw = a;
            nh = b;
            break;
            case 'pad':
            modeCode = 2;
            nw = w+a+c;
            nh = h+b+d;
            break;
            case 'crop':
            modeCode = 3;
            nw = c;
            nh = d;
            break;
            case 'scale':
            default:
            modeCode = 4;
            if (c && d)
            {
                // scale given
                a = c*w;
                b = d*h;
            }
            nw = a;
            nh = b;
            break;
        }
        return {
        m: modeCode,
        a: filter.a, b: filter.b,
        c: filter.c, d: filter.d,
        w: w, h: h,
        nw: stdMath.round(nw), nh: stdMath.round(nh)
        };
    };
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader(!filter.m ? GLSL.DEFAULT : [
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform vec2 wh;',
    'uniform vec2 nwh;',
    'uniform int m;',
    'uniform float a;',
    'uniform float b;',
    'uniform float c;',
    'uniform float d;',
    'vec4 set(vec2 pix, sampler2D img) {',
    '   return vec4(0.0);',
    '}',
    img_util['crop'],
    img_util['pad'],
    img_util['interpolate'],
    'void main(void) {',
    '    if (1 == m) gl_FragColor = set(pix, img);',
    '    else if (2 == m) gl_FragColor = pad(pix, img, wh, nwh, c, d, a, b);',
    '    else if (3 == m) gl_FragColor = crop(pix, img, wh, nwh, a, b, a+c-1.0, b+d-1.0);',
    '    else gl_FragColor = interpolate(pix, img, wh, nwh);',
    '}'
    ].join('\n'))
    .dimensions(function(w, h, io) {io.params = get(filter, w, h); return [io.params.nw, io.params.nh];})
    .input('wh', function(filter, nw, nh, w, h) {return [w, h];})
    .input('nwh', function(filter, nw, nh, w, h) {return [nw, nh];})
    .input('m', function(filter, nw, nh, w, h, io) {return io.params.m;})
    .input('a', function(filter, nw, nh, w, h, io) {return io.params.a;})
    .input('b', function(filter, nw, nh, w, h, io) {return io.params.b;})
    .input('c', function(filter, nw, nh, w, h, io) {return io.params.c;})
    .input('d', function(filter, nw, nh, w, h, io) {return io.params.d;})
    .end();
    return glslcode.code();
}

}(FILTER);