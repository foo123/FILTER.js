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
    ,mode: null
    ,a: 0
    ,b: 0
    ,c: 0
    ,d: 0
    ,meta: null
    ,hasMeta: false
    ,_runWASM: false

    ,dispose: function() {
        var self = this;
        self.mode = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
            mode: self.mode,
            a: self.a,
            b: self.b,
            c: self.c,
            d: self.d
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.set(params.mode, params.a, params.b, params.c, params.d);
        return self;
    }

    ,metaData: function(serialisation) {
        return this.meta;
    }

    ,setMetaData: function(meta, serialisation) {
        return this;
    }

    ,set: function(mode, a, b, c, d) {
        var self = this;
        if (mode)
        {
            self.mode = String(mode || 'scale').toLowerCase();
            self.a = a || 0;
            self.b = b || 0;
            self.c = c || 0;
            self.d = d || 0;
        }
        else
        {
            self.mode = null;
            self.a = 0;
            self.b = 0;
            self.c = 0;
            self.d = 0;
        }
        return self;
    }

    ,reset: function() {
        return this.set(null);
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,_apply_wasm: function(im, w, h, metaData) {
        var self = this, ret;
        self._runWASM = true;
        ret = self._apply(im, w, h, metaData);
        self._runWASM = false;
        return ret;
    }
    ,_apply: function(im, w, h, metaData) {
        var self = this, isWASM = self._runWASM, mode = self.mode,
            a = self.a, b = self.b, c = self.c, d = self.d;
        self.meta = null;
        self.hasMeta = false;
        if (!mode) return im;
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
                self.hasMeta = true;
            break;
            case 'pad':
                a = stdMath.round(a);
                b = stdMath.round(b);
                c = stdMath.round(c);
                d = stdMath.round(d);
                im = ImageUtil.pad(im, w, h, c, d, a, b);
                self.meta = {_IMG_WIDTH:b + d + h, _IMG_HEIGHT:a + c + w};
                self.hasMeta = true;
            break;
            case 'crop':
                a = stdMath.round(a);
                b = stdMath.round(b);
                c = stdMath.round(c);
                d = stdMath.round(d);
                im = ImageUtil.crop(im, w, h, a, b, a+c-1, b+d-1);
                self.meta = {_IMG_WIDTH:c, _IMG_HEIGHT:d};
                self.hasMeta = true;
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
                self.hasMeta = true;
            break;
        }
        return im;
    }
});

function glsl(filter)
{
    /*if (!filter.mode)*/ return {instance: filter/*, shader: GLSL.DEFAULT*/};
    /*
    // in progress
    var img_util = ImageUtil.glsl(), w, h;
    return {instance: filter, shader: [
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform vec2 wh;',
    'uniform int mode;',
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
    '    if (1 == mode) gl_FragColor = set(pix, img);',
    '    else if (2 == mode) gl_FragColor = pad(pix, img, wh, c, d, a, b);',
    '    else if (3 == mode) gl_FragColor = crop(pix, img, wh, a, b, a+c-1, b+d-1);',
    '    else gl_FragColor = interpolate(pix, img, wh, vec2(a, b));',
    '}'
    ].join('\n'),
    vars: function(gl, w, h, program) {
        var modeCode,
            a = filter.a,
            b = filter.b,
            c = filter.c,
            d = filter.d;
        switch (filter.mode)
        {
            case 'set':
            modeCode = 1;
            if (c && d)
            {
                // scale given
                a = c*w;
                b = d*h;
            }
            break;
            case 'pad':
            modeCode = 2;
            break;
            case 'crop':
            modeCode = 3;
            break;
            case 'scale':
            default:
            if (c && d)
            {
                // scale given
                a = c*w;
                b = d*h;
            }
            modeCode = 4;
            break;
        }
        gl.uniform2fv(program.uniform.wh, new FILTER.Array32F([
            w, h
        ]));
        gl.uniform1i(program.uniform.mode, modeCode);
        gl.uniform1f(program.uniform.a, a);
        gl.uniform1f(program.uniform.b, b);
        gl.uniform1f(program.uniform.c, c);
        gl.uniform1f(program.uniform.d, d);
    }, width: function(ww, hh) {
        w = ww; h = hh;
        return w;
    }, height: function(ww, hh) {
        return h;
    }
    };*/
}

}(FILTER);