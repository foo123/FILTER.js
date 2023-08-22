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
var ChannelCopyFilter = FILTER.Create({
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

    ,getWASM: function() {
        return wasm(this);
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
            if (xc<0 || xc>=w2 || yc<0 || yc>=h2)
            {
                if (COLOR32 === mode) {im[i  ] = r; im[i+1] = g; im[i+2] = b; im[i+3] = a;}
                else if (MASK32 === mode) {im[i  ] = r & im[i  ]; im[i+1] = g & im[i+1]; im[i+2] = b & im[i+2]; im[i+3] = a & im[i+3];}
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
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    channelcopyfilter: {inputs: [{arg:0,type:FILTER.ImArray},{arg:4,type:FILTER.ImArray}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    ChannelCopyFilter.prototype._apply_wasm = function(im, w, h) {
        var self = this, src;
        src = self.input("source"); if (!src) return im;
        return wasm.channelcopyfilter(im, w, h, self.mode||0, src[0], src[1], src[2], self.centerX||0, self.centerY||0, self.srcChannel||0, self.dstChannel||0, self.color||0);
    };
    FILTER.unwaitFor(1);
});
}

function glsl(filter)
{
    var color = filter.color||0, src = filter.input("source");
    if (!src) return {instance: filter, shader: GLSL.DEFAULT};
    return {instance: filter, shader: [
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform sampler2D src;',
    'uniform vec2 srcSize;',
    'uniform vec2 center;',
    'uniform vec4 color;',
    'uniform int sC;',
    'uniform int tC;',
    '#define COLOR32 '+MODE.COLOR32+'',
    '#define COLOR8 '+MODE.COLOR8+'',
    '#define MASK32 '+MODE.COLORMASK32+'',
    '#define MASK8 '+MODE.COLORMASK8+'',
    '#define RED '+CHANNEL.R+'',
    '#define GREEN '+CHANNEL.G+'',
    '#define BLUE '+CHANNEL.B+'',
    '#define ALPHA '+CHANNEL.A+'',
    'uniform int mode;',
    'float get_channel(vec4 col, int channel) {',
    '   if (ALPHA == channel) return col.a;',
    '   if (BLUE == channel) return col.b;',
    '   if (GREEN == channel) return col.g;',
    '   if (RED == channel) return col.r;',
    '   return 0.0;',
    '}',
    'vec4 set_channel(vec4 col, float val, int channel) {',
    '   vec4 ret = vec4(col.r, col.g, col.b, col.a);',
    '   if (ALPHA == channel) ret.a = val;',
    '   else if (BLUE == channel) ret.b = val;',
    '   else if (GREEN == channel) ret.g = val;',
    '   else if (RED == channel) ret.r = val;',
    '   return ret;',
    '}',
    'void main(void) {',
    '   vec4 tCol = texture2D(img, pix);',
    '   vec2 p = (pix - (center - 0.5*srcSize))/srcSize;',
    '   if (0.0 > p.x || 1.0 < p.x || 0.0 > p.y || 1.0 < p.y) {',
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
    '       tCol = set_channel(tCol, get_channel(sCol, sC), tC);',
    '   }',
    '   gl_FragColor = tCol;',
    '}'
    ].join('\n'),
    textures: function(gl, w, h, program) {
        var src = filter.input("source");
        GLSL.uploadTexture(gl, src[0], src[1], src[2], 1);
    },
    vars: function(gl, w, h, program) {
        var src = filter.input("source"), color = filter.color||0;
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
function wasm()
{
    return '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';
}
}(FILTER);