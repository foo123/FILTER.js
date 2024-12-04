/**
*
* Table Lookup Filter
*
* Changes target image colors according to color lookup tables for each channel
*
* @param tableR Optional (a lookup table of 256 color values for red channel)
* @param tableG Optional (a lookup table of 256 color values for green channel)
* @param tableB Optional (a lookup table of 256 color values for blue channel)
* @param tableA Optional (a lookup table of 256 color values for alpha channel, NOT USED YET)
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

// color table
var CHANNEL = FILTER.CHANNEL, CT = FILTER.ColorTable, clamp = FILTER.Color.clampPixel,
    stdMath = Math, Floor = stdMath.floor, Power = stdMath.pow, Exponential = stdMath.exp, nF = 1.0/255,
    TypedArray = FILTER.Util.Array.typed, eye = FILTER.Util.Filter.ct_eye, ct_mult = FILTER.Util.Filter.ct_multiply, GLSL = FILTER.Util.GLSL;

// ColorTableFilter
var ColorTableFilter = FILTER.Create({
    name: "ColorTableFilter"

    ,init: function ColorTableFilter(tR, tG, tB, tA) {
        var self = this;
        self.table = [null, null, null, null];
        tR = tR || null;
        tG = tG || tR;
        tB = tB || tG;
        tA = tA || null;
        self.table[CHANNEL.R] = tR;
        self.table[CHANNEL.G] = tG;
        self.table[CHANNEL.B] = tB;
        self.table[CHANNEL.A] = tA;
    }

    ,path: FILTER.Path
    // parameters
    ,table: null
    ,img: null

    ,dispose: function() {
        var self = this;
        self.table = null;
        self.img = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             tableR: self.table[CHANNEL.R]
            ,tableG: self.table[CHANNEL.G]
            ,tableB: self.table[CHANNEL.B]
            ,tableA: self.table[CHANNEL.A]
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.table[CHANNEL.R] = TypedArray(params.tableR, CT);
        self.table[CHANNEL.G] = TypedArray(params.tableG, CT);
        self.table[CHANNEL.B] = TypedArray(params.tableB, CT);
        self.table[CHANNEL.A] = TypedArray(params.tableA, CT);
        return self;
    }

    ,functional: function(fR, fG, fB) {
        if ("function" !== typeof fR) return this;
        var tR = eye(fR), tG = fG ? eye(fG) : tR, tB = fB ? eye(fB) : tG;
        return this.set(tR, tG, tB);
    }

    ,channel: function(channel) {
        if (null == channel) return this;
        var tR, tG, tB;
        switch (channel || CHANNEL.R)
        {
            case CHANNEL.B:
                tR = eye(0,0); tG = eye(0,0); tB = eye();
                break;

            case CHANNEL.G:
                tR = eye(0,0); tG = eye(); tB = eye(0,0);
                break;

            case CHANNEL.R:
            default:
                tR = eye(); tG = eye(0,0); tB = eye(0,0);
                break;

        }
        return this.set(tR, tG, tB);
    }

    ,redChannel: function() {
        return this.channel(CHANNEL.R);
    }

    ,greenChannel: function() {
        return this.channel(CHANNEL.G);
    }

    ,blueChannel: function() {
        return this.channel(CHANNEL.B);
    }

    ,channelInvert: function(channel) {
        if (null == channel) return this;
        var tR, tG, tB;
        switch (channel || CHANNEL.R)
        {
            case CHANNEL.B:
                tR = eye(); tG = eye(); tB = eye(-1,255);
                break;

            case CHANNEL.G:
                tR = eye(); tG = eye(-1,255); tB = eye();
                break;

            case CHANNEL.R:
            default:
                tR = eye(-1,255); tG = eye(); tB = eye();
                break;

        }
        return this.set(tR, tG, tB);
    }

    ,redInvert: function() {
        return this.channelInvert(CHANNEL.R);
    }

    ,greenInvert: function() {
        return this.channelInvert(CHANNEL.G);
    }

    ,blueInvert: function() {
        return this.channelInvert(CHANNEL.B);
    }

    ,invert: function() {
        return this.set(FILTER.Util.Filter.ct_eye(-1,255));
    }

    ,thresholds: function(thresholdsR, thresholdsG, thresholdsB) {
        // assume thresholds are given in pointwise scheme as pointcuts
        // not in cumulative scheme
        // [ 0.5 ] => [0, 1]
        // [ 0.3, 0.3, 0.3 ] => [0, 0.3, 0.6, 1]
        if (!thresholdsR.length) thresholdsR = [thresholdsR];
        if (!thresholdsG) thresholdsG = thresholdsR;
        if (!thresholdsB) thresholdsB = thresholdsG;

        var tLR = thresholdsR.length, numLevelsR = tLR+1,
            tLG = thresholdsG.length, numLevelsG = tLG+1,
            tLB = thresholdsB.length, numLevelsB = tLB+1,
            tR = new CT(256), qR = new CT(numLevelsR),
            tG = new CT(256), qG = new CT(numLevelsG),
            tB = new CT(256), qB = new CT(numLevelsB),
            i, j, nLR=255/(numLevelsR-1), nLG=255/(numLevelsG-1), nLB=255/(numLevelsB-1);
        for (i=0; i<numLevelsR; ++i) qR[i] = (nLR * i)|0;
        thresholdsR[0] = (255*thresholdsR[0])|0;
        for (i=1; i<tLR; ++i) thresholdsR[i] = thresholdsR[i-1] + (255*thresholdsR[i])|0;
        for (i=0; i<numLevelsG; ++i) qG[i] = (nLG * i)|0;
        thresholdsG[0] = (255*thresholdsG[0])|0;
        for (i=1; i<tLG; ++i) thresholdsG[i] = thresholdsG[i-1] + (255*thresholdsG[i])|0;
        for (i=0; i<numLevelsB; ++i) qB[i] = (nLB * i)|0;
        thresholdsB[0] = (255*thresholdsB[0])|0;
        for (i=1; i<tLB; ++i) thresholdsB[i] = thresholdsB[i-1] + (255*thresholdsB[i])|0;
        for (i=0; i<256; ++i)
        {
            // the non-linear mapping is here
            j=0; while (j<tLR && i>thresholdsR[j]) ++j;
            tR[i] = clamp(qR[j]);
            j=0; while (j<tLG && i>thresholdsG[j]) ++j;
            tG[i] = clamp(qG[j]);
            j=0; while (j<tLB && i>thresholdsB[j]) ++j;
            tB[i] = clamp(qB[j]);
        }
        return this.set(tR, tG, tB);
    }

    ,threshold: function(thresholdR, thresholdG, thresholdB) {
        thresholdR = null == thresholdR ? 0.5 : thresholdR;
        thresholdG = null == thresholdG ? thresholdR : thresholdG;
        thresholdB = null == thresholdB ? thresholdG : thresholdB;
        return this.thresholds([thresholdR], [thresholdG], [thresholdB]);
    }

    ,quantize: function(numLevels) {
        if (null == numLevels) numLevels = 64;
        if (numLevels < 2) numLevels = 2;
        if (numLevels > 256) numLevels = 256;
        var qi = stdMath.ceil(255 / (numLevels - 1))
            /*j, q = new CT(numLevels), nL = 255/(numLevels-1), nR = numLevels/256,*/;
        //for (j=0; j<numLevels; ++j) q[j] = clamp((nL * j)|0);
        return this.set(eye(function(i) {return clamp(stdMath.round(i / qi) * qi)/*q[(nR * i)|0]*/;}));
    }
    ,posterize: null

    ,binarize: function() {
        return this.quantize(2);
    }

    // adapted from http://www.jhlabs.com/ip/filters/
    ,solarize: function(threshold, type) {
        if (null == type) type = 1;
        if (null == threshold) threshold = 0.5;

        var solar;
        if (-1 === type) // inverse
        {
            threshold *= 256;
            solar = function(i) {return i>threshold ? (255-i) : i;};
        }
        else
        {
            if (2 === type) // variation
            {
                threshold = 1 - threshold;
            }
            solar = function(i) {
                var q = 2*i/255;
                return q<threshold ? (255-255*q) : (255*q-255);
            };
        }
        return this.set(eye(solar));
    }

    ,solarize2: function(threshold) {
        return this.solarize(threshold, 2);
    }

    ,solarizeInverse: function(threshold) {
        return this.solarize(threshold, -1);
    }

    // apply a binary mask to the image color channels
    ,mask: function(mask) {
        var maskR = (mask>>>16)&255, maskG = (mask>>>8)&255, maskB = mask&255;
        return this.set(eye(function(i) {return i & maskR;}), eye(function(i) {return i & maskG;}), eye(function(i) {return i & maskB;}));
    }

    // replace a color with another
    ,replace: function(color, replacecolor) {
        if (color == replacecolor) return this;
        var tR = eye(), tG = eye(), tB = eye();
        tR[(color>>>16)&255] = (replacecolor>>>16)&255;
        tG[(color>>>8)&255] = (replacecolor>>>8)&255;
        tB[(color)&255] = (replacecolor)&255;
        return this.set(tR, tG, tB);
    }

    // extract a range of color values from a specific color channel and set the rest to background color
    ,extract: function(channel, range, background) {
        if (!range || !range.length) return this;
        background = background||0;
        var tR = eye(0,(background>>>16)&255), tG = eye(0,(background>>>8)&255), tB = eye(0,background&255);
        switch (channel || CHANNEL.R)
        {
            case CHANNEL.B:
                for (s=range[0],f=range[1]; s<=f; ++s) tB[s] = clamp(s);
                break;

            case CHANNEL.G:
                for (s=range[0],f=range[1]; s<=f; ++s) tG[s] = clamp(s);
                break;

            case CHANNEL.R:
            default:
                for (s=range[0],f=range[1]; s<=f; ++s) tR[s] = clamp(s);
                break;
        }
        return this.set(tR, tG, tB);
    }

    // adapted from http://www.jhlabs.com/ip/filters/
    ,gammaCorrection: function(gammaR, gammaG, gammaB) {
        gammaR = gammaR || 1;
        gammaG = gammaG || gammaR;
        gammaB = gammaB || gammaG;
        // gamma correction uses inverse gamma
        gammaR = 1.0/gammaR; gammaG = 1.0/gammaG; gammaB = 1.0/gammaB;
        return this.set(eye(function(i) {return 255*Power(nF*i, gammaR);}), eye(function(i) {return 255*Power(nF*i, gammaG);}), eye(function(i) {return 255*Power(nF*i, gammaB);}));
    }

    // adapted from http://www.jhlabs.com/ip/filters/
    ,exposure: function(exposure) {
        if (null == exposure) exposure = 1;
        return this.set(eye(function(i) {return 255 * (1 - Exponential(-exposure * i *nF));}));
    }

    ,contrast: function(r, g, b) {
        if (null == g) g = r;
        if (null == b) b = r;
        r += 1.0; g += 1.0; b += 1.0;
        return this.set(eye(r, 128*(1 - r)), eye(g, 128*(1 - g)), eye(b, 128*(1 - b)));
    }

    ,brightness: function(r, g, b) {
        if (null == g) g = r;
        if (null == b) b = r;
        return this.set(eye(1, r), eye(1, g), eye(1, b));
    }

    ,quickContrastCorrection: function(contrast) {
        return this.set(eye(null == contrast ? 1.2 : +contrast));
    }

    ,set: function(tR, tG, tB, tA) {
        var self = this;
        if (!tR) return self;

        var i, T = self.table, R = T[CHANNEL.R] || eye(), G, B, A;

        if (tG || tB)
        {
            tG = tG || tR; tB = tB || tG;
            G = T[CHANNEL.G] || R; B = T[CHANNEL.B] || G;
            T[CHANNEL.R] = ct_mult(tR, R);
            T[CHANNEL.G] = ct_mult(tG, G);
            T[CHANNEL.B] = ct_mult(tB, B);
        }
        else
        {
            T[CHANNEL.R] = ct_mult(tR, R);
            T[CHANNEL.G] = T[CHANNEL.R];
            T[CHANNEL.B] = T[CHANNEL.R];
        }
        self.img = null;
        self._glsl = null;
        return self;
    }

    ,reset: function() {
        var self = this;
        self.table = [null, null, null, null];
        self.img = null;
        self._glsl = null;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return wasm(this);
    }

    ,combineWith: function(filt) {
        return this.set(filt.getTable(CHANNEL.R), filt.getTable(CHANNEL.G), filt.getTable(CHANNEL.B));
    }

    ,getTable: function(channel) {
        return this.table[channel || CHANNEL.R] || null;
    }

    ,setTable: function(table, channel) {
        this.table[channel || CHANNEL.R] = table || null;
        this.img = null;
        return this;
    }

    ,getImage: function() {
        var self = this, table = self.table;
        if (table && table[CHANNEL.R] && !self.img)
        {
            var R = table[CHANNEL.R], G = table[CHANNEL.G] || R,
                B = table[CHANNEL.B] || G, A = table[CHANNEL.A],
                n = (256 << 2), t = new FILTER.Array8U(n), i, j;
            for (i=0,j=0; i<n; i+=4,++j)
            {
                t[i  ] = R[j];
                t[i+1] = G[j];
                t[i+2] = B[j];
                t[i+3] = A ? A[j] : 255;
            }
            self.img = t;
        }
        return self.img;
    }

    // used for internal purposes
    ,_apply: function(im, w, h) {
        //"use asm";
        var self = this, T = self.table;
        if (!T || !T[CHANNEL.R]) return im;

        var i, j, l=im.length, l2=l>>>2, rem=(l2&15)<<2,
            R = T[CHANNEL.R],
            G = T[CHANNEL.G] || R,
            B = T[CHANNEL.B] || G,
            A = T[CHANNEL.A];

        // apply filter (algorithm implemented directly based on filter definition)
        if (A)
        {
            // array linearization
            for (i=0; i<rem; i+=4)
            {
                im[i   ] = R[im[i   ]]; im[i+1] = G[im[i+1]]; im[i+2] = B[im[i+2]]; im[i+3] = A[im[i+3]];
            }
            // partial loop unrolling (4 iterations)
            for (j=rem; j<l; j+=64)
            {
                i = j;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
            }
        }
        else
        {
            // array linearization
            for (i=0; i<rem; i+=4)
            {
                im[i   ] = R[im[i   ]]; im[i+1] = G[im[i+1]]; im[i+2] = B[im[i+2]];
            }
            // partial loop unrolling (4 iterations)
            for (j=rem; j<l; j+=64)
            {
                i = j;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
            }
        }
        return im;
    }

    ,canRun: function() {
        return this._isOn && this.table && this.table[CHANNEL.R];
    }
});
// aliases
ColorTableFilter.prototype.posterize = ColorTableFilter.prototype.levels = ColorTableFilter.prototype.quantize;
FILTER.TableLookupFilter = FILTER.ColorTableFilter;
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    colortablefilter_RGB: {inputs: [{arg:0,type:FILTER.ImArray},{arg:3,type:FILTER.ImArray},{arg:4,type:FILTER.ImArray},{arg:5,type:FILTER.ImArray}], output: {type:FILTER.ImArray}},
    colortablefilter_RGBA: {inputs: [{arg:0,type:FILTER.ImArray},{arg:3,type:FILTER.ImArray},{arg:4,type:FILTER.ImArray},{arg:5,type:FILTER.ImArray},{arg:6,type:FILTER.ImArray}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
    ColorTableFilter.prototype._apply_wasm = function(im, w, h) {
        var self = this;
        if (!self.table || !self.table[CHANNEL.R]) return im;
        var R = self.table[CHANNEL.R],
            G = self.table[CHANNEL.G] || R,
            B = self.table[CHANNEL.B] || G,
            A = self.table[CHANNEL.A];
        return A ? wasm.colortablefilter_RGBA(im, w, h, R, G, B, A) : wasm.colortablefilter_RGB(im, w, h, R, G, B);
    };
    }
    FILTER.unwaitFor(1);
});
}

function glsl(filter)
{
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader(!filter.table || !filter.table[CHANNEL.R] ? GLSL.DEFAULT : [
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform sampler2D map;',
    'uniform int hasAlpha;',
    'void main(void) {',
    '   vec4 col = texture2D(img, pix);',
    '   if (1 == hasAlpha) gl_FragColor = vec4(texture2D(map, vec2(col.r, 0.0)).r,texture2D(map, vec2(col.g, 0.0)).g,texture2D(map, vec2(col.b, 0.0)).b,texture2D(map, vec2(col.a, 0.0)).a);',
    '   else gl_FragColor = vec4(texture2D(map, vec2(col.r, 0.0)).r,texture2D(map, vec2(col.g, 0.0)).g,texture2D(map, vec2(col.b, 0.0)).b,col.a);',
    '}'
    ].join('\n'))
    .input('hasAlpha', function(filter) {return filter.table[CHANNEL.A] ? 1 : 0;})
    .input('map', function(filter) {return {data:filter.getImage(), width:256, height:1};})
    .end();
    return glslcode.code();
}
function wasm()
{
    return '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';
}
}(FILTER);