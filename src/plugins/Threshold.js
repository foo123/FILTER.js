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
    FilterUtil = FILTER.Util.Filter,
    A32F = FILTER.Array32F, stdMath = Math,
    Pow = stdMath.pow, Min = stdMath.min, Max = stdMath.max;

// https://en.wikipedia.org/wiki/Thresholding_(image_processing)
// https://en.wikipedia.org/wiki/Otsu%27s_method
FILTER.Create({
    name : "ThresholdFilter"

    ,path: FILTER.Path

    ,mode: MODE.INTENSITY
    ,color0: 0
    ,color1: null

    ,init: function(mode, color0, color1) {
        var self = this;
        self.mode = mode || MODE.INTENSITY;
        self.color0 = color0 || 0;
        if (null != color1) self.color1 = color1;
    }

    ,serialize: function() {
        var self = this;
        return {
             color0: self.color0
            ,color1: self.color1
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.color0 = params.color0;
        self.color1 = params.color1;
        return self;
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
            r1, g1, b1, //a1,
            i, l=im.length;

        if (null != color1)
        {
            r1 = (color1 >>> 16)&255;
            g1 = (color1 >>> 8)&255;
            b1 = (color1)&255;
        }
        binR = FilterUtil.histogram(im, CHANNEL.R);
        binG = FilterUtil.histogram(im, CHANNEL.G);
        binB = FilterUtil.histogram(im, CHANNEL.B);
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
            bin, i, t, l = im.length,
            is_grayscale = MODE.GRAY === self.mode;

        if (null != color1)
        {
            r1 = (color1 >>> 16)&255;
            g1 = (color1 >>> 8)&255;
            b1 = (color1)&255;
        }
        if (is_grayscale)
        {
            bin = FilterUtil.histogram(im, CHANNEL.R);
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                r = im[i  ];
                g = im[i+1];
                b = im[i+2];
                y  = (0   + 0.299*r    + 0.587*g     + 0.114*b)|0;
                cb = (128 - 0.168736*r - 0.331264*g  + 0.5*b)|0;
                cr = (128 + 0.5*r      - 0.418688*g  - 0.081312*b)|0;
                if (notSupportClamp)
                {
                    // clamp them manually
                    cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                    y = y<0 ? 0 : (y>255 ? 255 : y);
                    cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                }
                im[i  ] = cr;
                im[i+1] = y;
                im[i+2] = cb;
            }
            bin = FilterUtil.histogram(im, CHANNEL.G);
        }
        t = FilterUtil.otsu(bin.bin, bin.total, bin.min, bin.max);
        if (is_grayscale)
        {
            for (i=0; i<l; i+=4)
            {
                if (im[i] < t)
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
                    r = ( y                      + 1.402   * (cr-128) )|0;
                    g = ( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) )|0;
                    b = ( y + 1.772   * (cb-128) )|0;
                    if (notSupportClamp)
                    {
                        // clamp them manually
                        r = r<0 ? 0 : (r>255 ? 255 : r);
                        g = g<0 ? 0 : (g>255 ? 255 : g);
                        b = b<0 ? 0 : (b>255 ? 255 : b);
                    }
                    im[i  ] = r;
                    im[i+1] = g;
                    im[i+2] = b;
                }
            }
        }
        return im;
    }
});

function otsu(bin, tot, min, max)
{
    var omega0, omega1,
        mu0, mu1, mu,
        sigmat, sigma,
        sum0, isum0, i, t;

    if (null == min) min = 0;
    if (null == max) max = 255;
    for (mu=0,i=min; i<=max; ++i) mu += i*bin[i]/tot;
    t = min;
    sum0 = bin[min];
    isum0 = min*bin[min]/tot;
    omega0 = sum0/tot;
    omega1 = 1-omega0;
    mu0 = isum0/omega0;
    mu1 = (mu - isum0)/omega1;
    sigmat = omega0*omega1*Pow(mu1 - mu0, 2);
    for (i=min+1; i<=max; ++i)
    {
        sum0 += bin[i];
        isum0 += i*bin[i]/tot;
        omega0 = sum0/tot;
        omega1 = 1-omega0;
        mu0 = isum0/omega0;
        mu1 = (mu - isum0)/omega1;
        sigma = omega0*omega1*Pow(mu1 - mu0, 2);
        if (sigma > sigmat)
        {
            sigmat = sigma;
            t = i;
        }
    }
    return t;
}
FilterUtil.otsu = otsu;
}(FILTER);