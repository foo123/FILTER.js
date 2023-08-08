/**
*
* Channel Copy
* @package FILTER.js
*
**/
!function(FILTER) {
"use strict";

var stdMath = Math, Min = stdMath.min, Floor = stdMath.floor,
    GLSL = FILTER.Util.GLSL,
    CHANNEL = FILTER.CHANNEL, MODE = FILTER.MODE;

// a plugin to copy a channel of an image to a channel of another image
FILTER.Create({
    name: "ChannelCopyFilter"

    // parameters
    ,srcChannel: CHANNEL.R
    ,dstChannel: CHANNEL.R
    ,centerX: 0
    ,centerY: 0
    ,color: 0
    ,hasInputs: true

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    // constructor
    ,init: function(srcChannel, dstChannel, centerX, centerY, color) {
        var self = this;
        self.srcChannel = srcChannel || CHANNEL.R;
        self.dstChannel = dstChannel || CHANNEL.R;
        self.centerX = centerX || 0;
        self.centerY = centerY || 0;
        self.color = color || 0;
    }

    ,dispose: function() {
        var self = this;
        self.srcChannel = null;
        self.dstChannel = null;
        self.centerX = null;
        self.centerY = null;
        self.color = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             srcChannel: self.srcChannel
            ,dstChannel: self.dstChannel
            ,centerX: self.centerX
            ,centerY: self.centerY
            ,color: self.color
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.srcChannel = params.srcChannel;
        self.dstChannel = params.dstChannel;
        self.centerX = params.centerX;
        self.centerY = params.centerY;
        self.color = params.color;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this, Src;
        Src = self.input("source"); if (!Src) return im;

        var src = Src[0], w2 = Src[1], h2 = Src[2],
            i, l = im.length, l2 = src.length,
            sC = self.srcChannel, tC = self.dstChannel,
            x, x2, y, y2, off, xc, yc,
            cX = self.centerX||0, cY = self.centerY||0, cX2 = w2>>>1, cY2 = h2>>>1,
            wm = Min(w,w2), hm = Min(h, h2),
            color = self.color||0, r, g, b, a,
            mode = self.mode, COLOR32 = MODE.COLOR32, COLOR8 = MODE.COLOR8,
            MASK32 = MODE.COLORMASK32, MASK8 = MODE.COLORMASK8;

        if (COLOR32 === mode || MASK32 === mode)
        {
            a = (color >>> 24)&255;
            r = (color >>> 16)&255;
            g = (color >>> 8)&255;
            b = (color)&255;
        }
        else if (COLOR8 === mode || MASK8 === mode)
        {
            color &= 255;
        }

        // make center relative
        cX = Floor(cX*(w-1)) - cX2;
        cY = Floor(cY*(h-1)) - cY2;

        for (x=0,y=0,i=0; i<l; i+=4,++x)
        {
            if (x>=w) {x=0; ++y;}

            xc = x - cX; yc = y - cY;
            if (xc<0 || xc>=wm || yc<0 || yc>=hm)
            {
                if (COLOR32 === mode) {im[i  ] = r; im[i+1] = g; im[i+2] = b; im[i+3] = a;}
                else if (MASK32 === mode) { im[i  ] = r & im[i  ]; im[i+1] = g & im[i+1]; im[i+2] = b & im[i+2]; im[i+3] = a & im[i+3];}
                else if (COLOR8 === mode) im[i+tC] = color;
                else if (MASK8 === mode) im[i+tC] = color & im[i+sC];
                // else ignore
            }
            else
            {
                // copy channel
                off = (xc + yc*w2)<<2;
                im[i + tC] = src[off + sC];
            }
        }
        // return the new image data
        return im;
    }
});

function glsl(filter)
{
    var color = filter.color||0, src = filter.input("source");
    if (!src) return {instance: filter, shader: GLSL.DEFAULT};
    return {instance: filter, shader: [
'precision highp float;',
'varying vec2 pix;',
'uniform sampler2D img;',
'uniform sampler2D src;',
'uniform vec2 srcSize;',
'uniform vec2 center;',
'uniform vec4 color;',
'uniform int sC;',
'uniform int tC;',
'const int COLOR32='+MODE.COLOR32+';',
'const int COLOR8='+MODE.COLOR8+';',
'const int MASK32='+MODE.MASK32+';',
'const int MASK8='+MODE.MASK8+';',
'const int RED='+CHANNEL.R+';',
'const int GREEN='+CHANNEL.G+';',
'const int BLUE='+CHANNEL.B+';',
'const int ALPHA='+CHANNEL.A+';',
'uniform int mode;',
'void main(void) {',
'   vec4 tCol = vec4(0.0);',
'   vec2 p = pix - center + 0.5*srcSize;',
'   if (COLOR32 != mode) tCol = texture2D(img, pix);',
'   if (0.0 > p.x || min(1.0, srcSize.x) < p.x || 0.0 > p.y || min(1.0, srcSize.y) < p.y) {',
'       if (MASK32 == mode) {tCol *= color;}',
'       else if (COLOR32 == mode) {tCol = color;}',
'       else if (MASK8 == mode) {',
'           if (ALPHA == tC) tCol.a *= color.a;',
'           else if (BLUE == tC) tCol.b *= color.b;',
'           else if (GREEN == tC) tCol.g *= color.g;',
'           else tCol.r *= color.r;',
'       }',
'       else if (COLOR8 == mode) {',
'           if (ALPHA == tC) tCol.a = color.a;',
'           else if (BLUE == tC) tCol.b = color.b;',
'           else if (GREEN == tC) tCol.g = color.g;',
'           else tCol.r = color.r;',
'       }',
'   } else {',
'       vec4 sCol = texture2D(src, p);',
'       if (ALPHA == sC) {',
'           if (ALPHA == tC) tCol.a = sCol.a;',
'           else if (BLUE == tC) tCol.b = sCol.a;',
'           else if (GREEN == tC) tCol.g = sCol.a;',
'           else tCol.r = sCol.a;',
'       } else if (BLUE == sC) {',
'           if (ALPHA == tC) tCol.a = sCol.b;',
'           else if (BLUE == tC) tCol.b = sCol.b;',
'           else if (GREEN == tC) tCol.g = sCol.b;',
'           else tCol.r = sCol.b;',
'       } else if (GREEN == sC) {',
'           if (ALPHA == tC) tCol.a = sCol.g;',
'           else if (BLUE == tC) tCol.b = sCol.g;',
'           else if (GREEN == tC) tCol.g = sCol.g;',
'           else tCol.r = sCol.g;',
'       } else {',
'           if (ALPHA == tC) tCol.a = sCol.r;',
'           else if (BLUE == tC) tCol.b = sCol.r;',
'           else if (GREEN == tC) tCol.g = sCol.r;',
'           else tCol.r = sCol.r;',
'       }',
'   }',
'   gl_FragColor = tCol;',
'}'
    ].join('\n'),
    textures: function(gl, w, h) {
        GLSL.uploadTexture(gl, src[0], src[1], src[2], 1);
    },
    vars: function(gl, w, h, program) {
        gl.uniform1i(program.uniform.src, 1);  // img unit 1
        gl.uniform2f(program.uniform.srcSize, src[1]/w, src[2]/h);
        gl.uniform2f(program.uniform.center, filter.centerX, filter.centerY);
        gl.uniform1i(program.uniform.sC, filter.srcChannel);
        gl.uniform1i(program.uniform.tC, filter.dstChannel);
        if (MODE.COLOR8 === filter.mode || MODE.MASK8 === filter.mode)
        {
            color = (color & 255)/255;
            gl.uniform4f(program.uniform.color,
                color,
                color,
                color,
                color
            );
        }
        else
        {
            gl.uniform4f(program.uniform.color,
                ((color >>> 16) & 255)/255,
                ((color >>> 8) & 255)/255,
                (color & 255)/255,
                ((color >>> 24) & 255)/255
            );
        }
    }
    };
}

}(FILTER);