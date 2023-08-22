/**
*
* Affine Matrix Filter
*
* Distorts the target image according to an linear affine matrix mapping function
*
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var IMG = FILTER.ImArray, AM = FILTER.AffineMatrix, TypedArray = FILTER.Util.Array.typed,
    GLSL = FILTER.Util.GLSL,
    MODE = FILTER.MODE, toRad = FILTER.CONST.toRad,
    stdMath = Math, Sin = stdMath.sin, Cos = stdMath.cos, Tan = stdMath.tan,
    am_multiply = FILTER.Util.Filter.am_multiply;

// AffineMatrixFilter
var AffineMatrixFilter = FILTER.Create({
    name: "AffineMatrixFilter"

    ,init: function AffineMatrixFilter(matrix) {
        var self = this;
        self.matrix = matrix && matrix.length ? new AM(matrix) : null;
    }

    ,path: FILTER.Path
    // parameters
    ,matrix: null
    ,mode: MODE.CLAMP
    ,color: 0

    ,dispose: function() {
        var self = this;
        self.matrix = null;
        self.color = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             matrix: self.matrix
            ,color: self.color
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.matrix = TypedArray(params.matrix, AM);
        self.color = params.color;
        return self;
    }

    ,flipX: function() {
        return this.set([
            -1, 0, 0, 1,
            0, 1, 0, 0
        ]);
    }

    ,flipY: function() {
        return this.set([
            1, 0, 0, 0,
            0, -1, 0, 1
        ]);
    }

    ,flipXY: function() {
        return this.set([
            -1, 0, 0, 1,
            0, -1, 0, 1
        ]);
    }

    ,translate: function(tx, ty, rel) {
        return this.set(rel
        ? [
            1, 0, 0, tx,
            0, 1, 0, ty
        ]
        : [
            1, 0, tx, 0,
            0, 1, ty, 0
        ]);
    }
    ,shift: null

    ,rotate: function(theta) {
        var s = Sin(theta), c = Cos(theta);
        return this.set([
            c, -s, 0, 0,
            s, c, 0, 0
        ]);
    }

    ,scale: function(sx, sy) {
        return this.set([
            sx, 0, 0, 0,
            0, sy, 0, 0
        ]);
    }

    ,skew: function(thetax, thetay) {
        return this.set([
            1, thetax ? Tan(thetax) : 0, 0, 0,
            thetay ? Tan(thetay) : 0, 1, 0, 0
        ]);
    }

    ,set: function(matrix) {
        var self = this;
        self.matrix = self.matrix ? am_multiply(self.matrix, matrix) : new AM(matrix);
        self._glsl = null;
        return self;
    }

    ,reset: function() {
        this.matrix = null;
        this._glsl = null;
        return this;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return wasm(this);
    }

    ,combineWith: function(filt) {
        return this.set(filt.matrix);
    }

    // used for internal purposes
    ,_apply: function(im, w, h) {
        //"use asm";
        var self = this, T = self.matrix;
        if (!T) return im;
        var x, y, yw, nx, ny, i, j, imLen = im.length,
            imArea = imLen>>>2, bx = w-1, by = imArea-w,
            dst = new IMG(imLen), color = self.color||0, r, g, b, a,
            COLOR = MODE.COLOR, CLAMP = MODE.CLAMP, WRAP = MODE.WRAP, IGNORE = MODE.IGNORE,
            Ta = T[0], Tb = T[1], Tx = T[2]+T[3]*bx,
            Tcw = T[4]*w, Td = T[5], Tyw = T[6]*w+T[7]*by,
            mode = self.mode || IGNORE
        ;

        if (COLOR === mode)
        {
            a = (color >>> 24)&255;
            r = (color >>> 16)&255;
            g = (color >>> 8)&255;
            b = (color)&255;

            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ++y; yw+=w;}

                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;
                if (0>nx || nx>bx || 0>ny || ny>by)
                {
                    // color
                    dst[i] = r;   dst[i+1] = g;
                    dst[i+2] = b;  dst[i+3] = a;
                    continue;
                }
                j = ((nx|0) + (ny|0)) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        else if (IGNORE === mode)
        {
            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ++y; yw+=w;}

                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;

                // ignore
                ny = ny > by || ny < 0 ? yw : ny;
                nx = nx > bx || nx < 0 ? x : nx;

                j = ((nx|0) + (ny|0)) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        else if (WRAP === mode)
        {
            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ++y; yw+=w;}

                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;

                // wrap
                ny = ny > by ? ny-imArea : (ny < 0 ? ny+imArea : ny);
                nx = nx > bx ? nx-w : (nx < 0 ? nx+w : nx);

                j = ((nx|0) + (ny|0)) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        else //if (CLAMP === mode)
        {
            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ++y; yw+=w;}

                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;

                // clamp
                ny = ny > by ? by : (ny < 0 ? 0 : ny);
                nx = nx > bx ? bx : (nx < 0 ? 0 : nx);

                j = ((nx|0) + (ny|0)) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        return dst;
    }

    ,canRun: function() {
        return this._isOn && this.matrix;
    }
});
// aliases
AffineMatrixFilter.prototype.shift = AffineMatrixFilter.prototype.translate;
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    affinematrixfilter: {inputs: [{arg:0,type:FILTER.ImArray},{arg:4,type:FILTER.AffineMatrix}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    AffineMatrixFilter.prototype._apply_wasm = function(im, w, h) {
        var self = this;
        if (!self.matrix) return im;
        return wasm.affinematrixfilter(im, w, h, self.mode||0, self.matrix, self.color||0);
    };
    FILTER.unwaitFor(1);
});
}

function glsl(filter)
{
    var m = filter.matrix, color = filter.color || 0;
    return {instance: filter, shader: m ? [
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform float am[6];',
    'uniform vec4 color;',
    '#define IGNORE '+MODE.IGNORE+'',
    '#define CLAMP '+MODE.CLAMP+'',
    '#define COLOR '+MODE.COLOR+'',
    '#define WRAP '+MODE.WRAP+'',
    'uniform int mode;',
    'void main(void) {',
    '   vec2 p = vec2(am[0]*pix.x+am[1]*pix.y+am[2], am[3]*pix.x+am[4]*pix.y+am[5]);',
    '   if (0.0 > p.x || 1.0 < p.x || 0.0 > p.y || 1.0 < p.y) {',
    '       if (COLOR == mode) {gl_FragColor = color;}',
    '       else if (CLAMP == mode) {gl_FragColor = texture2D(img, vec2(clamp(p.x, 0.0, 1.0),clamp(p.y, 0.0, 1.0)));}',
    '       else if (WRAP == mode) {',
    '           if (0.0 > p.x) p.x += 1.0;',
    '           if (1.0 < p.x) p.x -= 1.0;',
    '           if (0.0 > p.y) p.y += 1.0;',
    '           if (1.0 < p.y) p.y -= 1.0;',
    '           gl_FragColor = texture2D(img, p);',
    '       }',
    '       else {gl_FragColor = texture2D(img, pix);}',
    '   } else {',
    '       gl_FragColor = texture2D(img, p);',
    '   }',
    '}'
    ].join('\n') : GLSL.DEFAULT,
    vars: m ? function(gl, w, h, program) {
        var m = filter.matrix, color = filter.color || 0;
        gl.uniform1fv(program.uniform.am, new FILTER.Array32F([
            m[0], m[1], m[2]/w+m[3],
            m[4], m[5], m[6]/h+m[7]
        ]));
        gl.uniform4f(program.uniform.color,
            ((color >>> 16) & 255)/255,
            ((color >>> 8) & 255)/255,
            (color & 255)/255,
            ((color >>> 24) & 255)/255
        );
    } : null
    };
}
function wasm()
{
    return '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';
}
}(FILTER);