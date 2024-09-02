/**
*
* Automatic Threshold (Otsu)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var notSupportClamp = FILTER._notSupportClamp,
    CHANNEL = FILTER.CHANNEL, MODE = FILTER.MODE,
    TypedArray = FILTER.Util.Array.typed,
    TypedObj = FILTER.Util.Array.typed_obj,
    FilterUtil = FILTER.Util.Filter;

/*
1. https://en.wikipedia.org/wiki/Thresholding_(image_processing)
2. https://en.wikipedia.org/wiki/Otsu%27s_method
*/
FILTER.Create({
    name : "OtsuThresholdFilter"

    ,path: FILTER.Path

    ,hasMeta: true
    ,mode: MODE.INTENSITY
    ,color0: 0
    ,color1: null
    ,channel: 0
    ,nclasses: 2
    ,sigma: null

    ,init: function(mode, color0, color1, channel, nclasses, sigma) {
        var self = this;
        self.mode = mode || MODE.INTENSITY;
        self.color0 = color0 || 0;
        if (null != color1) self.color1 = color1;
        self.channel = channel || 0;
        if (null != nclasses) self.nclasses = (+nclasses) || 0;
        if (sigma && sigma.length) self.sigma = sigma;
    }

    ,serialize: function() {
        var self = this;
        return {
             color0: self.color0
            ,color1: self.color1
            ,channel: self.channel
            ,nclasses: self.nclasses
            ,sigma: self.sigma
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.color0 = params.color0;
        self.color1 = params.color1;
        self.channel = params.channel;
        self.nclasses = params.nclasses;
        self.sigma = params.sigma;
        return self;
    }

    ,metaData: function(serialisation) {
        return serialisation && FILTER.isWorker ? TypedObj(this.meta) : this.meta;
    }

    ,setMetaData: function(meta, serialisation) {
        this.meta = serialisation && ("string" === typeof meta) ? TypedObj(meta, 1) : meta;
        return this;
    }

    ,_apply_rgb: function(im, w, h) {
        var self = this,
            r, g, b,
            binR, binG, binB,
            tR, tG, tB,
            color0 = self.color0 || 0,
            r0 = (color0 >>> 16)&255,
            g0 = (color0 >>> 8)&255,
            b0 = (color0)&255,
            //a0 = (color0 >>> 24)&255,
            color1 = self.color1,
            nclasses = self.nclasses,
            sigma = self.sigma,
            r1, g1, b1, //a1,
            i, j, n, l=im.length;

        if (null != color1)
        {
            r1 = (color1 >>> 16)&255;
            g1 = (color1 >>> 8)&255;
            b1 = (color1)&255;
        }
        binR = FilterUtil.histogram(im, CHANNEL.R);
        binG = FilterUtil.histogram(im, CHANNEL.G);
        binB = FilterUtil.histogram(im, CHANNEL.B);
        if (sigma || (2 < nclasses))
        {
            if (sigma)
            {
                tR = FilterUtil.otsu_multi(binR.bin, binR.total, binR.min, binR.max, sigma[0] || 0);
                tG = FilterUtil.otsu_multi(binG.bin, binG.total, binG.min, binG.max, sigma[1] || 0);
                tB = FilterUtil.otsu_multi(binB.bin, binB.total, binB.min, binB.max, sigma[2] || 0);
            }
            else
            {
                tR = FilterUtil.otsu_multiclass(binR.bin, binR.total, binR.min, binR.max, nclasses);
                tG = FilterUtil.otsu_multiclass(binG.bin, binG.total, binG.min, binG.max, nclasses);
                tB = FilterUtil.otsu_multiclass(binB.bin, binB.total, binB.min, binB.max, nclasses);
            }
            for (i=0; i<l; i+=4)
            {
                for (r=im[i  ],j=0,n=tR.length; j<n; ++j)
                {
                    if (r < tR[j])
                    {
                        im[i  ] = (r0 + (r1 - r0)*j/n)|0;
                        break;
                    }
                }
                if (j >= n) im[i  ] = r1;
                for (g=im[i+1],j=0,n=tG.length; j<n; ++j)
                {
                    if (g < tG[j])
                    {
                        im[i+1] = (g0 + (g1 - g0)*j/n)|0;
                        break;
                    }
                }
                if (j >= n) im[i+1] = g1;
                for (b=im[i+2],j=0,n=tB.length; j<n; ++j)
                {
                    if (b < tB[j])
                    {
                        im[i+2] = (b0 + (b1 - b0)*j/n)|0;
                        break;
                    }
                }
                if (j >= n) im[i+2] = b1;
            }
        }
        else
        {
            tR = FilterUtil.otsu(binR.bin, binR.total, binR.min, binR.max);
            tG = FilterUtil.otsu(binG.bin, binG.total, binG.min, binG.max);
            tB = FilterUtil.otsu(binB.bin, binB.total, binB.min, binB.max);
            for (i=0; i<l; i+=4)
            {
                if (im[i  ] < tR) im[i  ] = r0;
                else if (null != color1) im[i  ] = r1;
                if (im[i+1] < tG) im[i+1] = g0;
                else if (null != color1) im[i+1] = g1;
                if (im[i+2] < tB) im[i+2] = b0;
                else if (null != color1) im[i+2] = b1;
            }
        }
        // return thresholds as meta
        self.meta = [tR, tG, tB];
        return im;
    }

    ,apply: function(im, w, h) {
        var self = this;

        if (MODE.RGB === self.mode) return self._apply_rgb(im, w, h);

        var r, g, b, t, y, cb, cr,
            color0 = self.color0 || 0,
            r0 = (color0 >>> 16)&255,
            g0 = (color0 >>> 8)&255,
            b0 = (color0)&255,
            //a0 = (color0 >>> 24)&255,
            color1 = self.color1,
            r1, g1, b1, //a1,
            bin, i, j, n, t, l = im.length,
            channel = self.channel || 0,
            nclasses = self.nclasses,
            sigma = self.sigma,
            mode = self.mode;

        if (null != color1)
        {
            r1 = (color1 >>> 16)&255;
            g1 = (color1 >>> 8)&255;
            b1 = (color1)&255;
        }
        if (MODE.GRAY === mode || MODE.CHANNEL === mode)
        {
            bin = FilterUtil.histogram(im, channel);
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                r = im[i  ];
                g = im[i+1];
                b = im[i+2];
                y  = (0   + 0.299*r    + 0.587*g     + 0.114*b);
                cb = (128 - 0.168736*r - 0.331264*g  + 0.5*b);
                cr = (128 + 0.5*r      - 0.418688*g  - 0.081312*b);
                if (notSupportClamp)
                {
                    // clamp them manually
                    cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                    y = y<0 ? 0 : (y>255 ? 255 : y);
                    cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                }
                im[i  ] = cr|0;
                im[i+1] = y|0;
                im[i+2] = cb|0;
            }
            bin = FilterUtil.histogram(im, CHANNEL.G);
        }
        if (sigma || (2 < nclasses))
        {
            if (sigma)
            {
                t = FilterUtil.otsu_multi(bin.bin, bin.total, bin.min, bin.max, sigma[0] || 0);
            }
            else
            {
                t = FilterUtil.otsu_multiclass(bin.bin, bin.total, bin.min, bin.max, nclasses);
            }
            if (MODE.GRAY === mode)
            {
                for (i=0; i<l; i+=4)
                {
                    for (r=im[i+channel],j=0,n=t.length; j<n; ++j)
                    {
                        if (r < t[j])
                        {
                            im[i  ] = (r0 + (r1 - r0)*j/n)|0;
                            im[i+1] = (g0 + (g1 - g0)*j/n)|0;
                            im[i+2] = (b0 + (b1 - b0)*j/n)|0;
                            break;
                        }
                    }
                    if (j >= n)
                    {
                        im[i  ] = r1;
                        im[i+1] = g1;
                        im[i+2] = b1;
                    }
                }
            }
            else if (MODE.CHANNEL === mode)
            {
                for (i=0; i<l; i+=4)
                {
                    for (r=im[i+channel],j=0,n=t.length; j<n; ++j)
                    {
                        if (r < t[j])
                        {
                            if (2 === channel) im[i+channel] = (b0 + (b1 - b0)*j/n)|0;
                            else if (1 === channel) im[i+channel] = (g0 + (g1 - g0)*j/n)|0;
                            else im[i+channel] = (r0 + (r1 - r0)*j/n)|0;
                            break;
                        }
                    }
                    if (j >= n)
                    {
                        if (2 === channel) im[i+channel] = b1;
                        else if (1 === channel) im[i+channel] = g1;
                        else im[i+channel] = r1;
                    }
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                {
                    for (y=im[i+1],j=0,n=t.length; j<n; ++j)
                    {
                        if (y < t[j])
                        {
                            im[i  ] = (r0 + (r1 - r0)*j/n)|0;
                            im[i+1] = (g0 + (g1 - g0)*j/n)|0;
                            im[i+2] = (b0 + (b1 - b0)*j/n)|0;
                            break;
                        }
                    }
                    if (j >= n)
                    {
                        im[i  ] = r1;
                        im[i+1] = g1;
                        im[i+2] = b1;
                    }
                }
            }
        }
        else
        {
            t = FilterUtil.otsu(bin.bin, bin.total, bin.min, bin.max);
            if (MODE.GRAY === mode)
            {
                for (i=0; i<l; i+=4)
                {
                    if (im[i+channel] < t)
                    {
                        im[i  ] = r0;
                        im[i+1] = g0;
                        im[i+2] = b0;
                    }
                    else if (null != color1)
                    {
                        im[i  ] = r1;
                        im[i+1] = g1;
                        im[i+2] = b1;
                    }
                }
            }
            else if (MODE.CHANNEL === mode)
            {
                for (i=0; i<l; i+=4)
                {
                    if (im[i+channel] < t)
                    {
                        im[i+channel] = 2 === channel ? b0 : (1 === channel ? g0 : r0);
                    }
                    else if (null != color1)
                    {
                        im[i+channel] = 2 === channel ? b1 : (1 === channel ? g1 : r1);
                    }
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                {
                    cr = im[i  ];
                    y  = im[i+1];
                    cb = im[i+2];
                    if (y < t)
                    {
                        im[i  ] = r0;
                        im[i+1] = g0;
                        im[i+2] = b0;
                    }
                    else if (null != color1)
                    {
                        im[i  ] = r1;
                        im[i+1] = g1;
                        im[i+2] = b1;
                    }
                    else
                    {
                        r = (y                      + 1.402   * (cr-128));
                        g = (y - 0.34414 * (cb-128) - 0.71414 * (cr-128));
                        b = (y + 1.772   * (cb-128));
                        if (notSupportClamp)
                        {
                            // clamp them manually
                            r = r<0 ? 0 : (r>255 ? 255 : r);
                            g = g<0 ? 0 : (g>255 ? 255 : g);
                            b = b<0 ? 0 : (b>255 ? 255 : b);
                        }
                        im[i  ] = r|0;
                        im[i+1] = g|0;
                        im[i+2] = b|0;
                    }
                }
            }
        }
        // return thresholds as meta
        self.meta = [t];
        return im;
    }
});
}(FILTER);