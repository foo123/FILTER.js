/**
*
* Histogram Equalize,
* Histogram Equalize for grayscale images,
* RGB Histogram Equalize
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var notSupportClamp = FILTER._notSupportClamp,
    CHANNEL = FILTER.CHANNEL, MODE = FILTER.MODE,
    FilterUtil = FILTER.Util.Filter,
    A32F = FILTER.Array32F, stdMath = Math,
    Min = stdMath.min, Max = stdMath.max;

// a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
FILTER.Create({
    name : "HistogramEqualizeFilter"

    ,path: FILTER.Path

    ,mode: MODE.INTENSITY
    ,factor: 1.0

    ,init: function(mode, factor) {
        var self = this;
        self.mode = mode || MODE.INTENSITY;
        if (null != factor) self.factor = +factor;
    }

    ,serialize: function() {
        var self = this;
        return {
             factor: self.factor
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.factor = params.factor;
        return self;
    }

    ,_apply_rgb: function(im, w, h) {
        var self = this,
            r ,g, b,
            rangeR, rangeG, rangeB,
            cdfR, cdfG, cdfB,
            f = self.factor,
            t0, t1, t2,
            i, l=im.length;

        cdfR = FilterUtil.histogram(im, CHANNEL.R, true);
        cdfG = FilterUtil.histogram(im, CHANNEL.G, true);
        cdfB = FilterUtil.histogram(im, CHANNEL.B, true);
        // equalize each channel separately
        rangeR = f*(cdfR.max - cdfR.min)/cdfR.total;
        rangeG = f*(cdfG.max - cdfG.min)/cdfG.total;
        rangeB = f*(cdfB.max - cdfB.min)/cdfB.total;
        if (notSupportClamp)
        {
            for (i=0; i<l; i+=4)
            {
                r = im[i  ];
                g = im[i+1];
                b = im[i+2];
                t0 = cdfR.bin[r]*rangeR + cdfR.min;
                t1 = cdfG.bin[g]*rangeG + cdfG.min;
                t2 = cdfB.bin[b]*rangeB + cdfB.min;
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                im[i  ] = t0|0;
                im[i+1] = t1|0;
                im[i+2] = t2|0;
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                r = im[i  ];
                g = im[i+1];
                b = im[i+2];
                t0 = cdfR.bin[r]*rangeR + cdfR.min;
                t1 = cdfG.bin[g]*rangeG + cdfG.min;
                t2 = cdfB.bin[b]*rangeB + cdfB.min;
                im[i  ] = t0|0;
                im[i+1] = t1|0;
                im[i+2] = t2|0;
            }
        }
        // return the new image data
        return im;
    }

    ,apply: function(im, w, h) {
        var self = this;

        if (MODE.RGB === self.mode) return self._apply_rgb(im, w, h);

        var r, g, b, y, cb, cr,
            range, cdf, i,
            l = im.length, f = self.factor,
            is_grayscale = MODE.GRAY === self.mode;

        if (is_grayscale)
        {
            cdf = FilterUtil.histogram(im, CHANNEL.R, true);
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
                // clamp them manually
                cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                y = y<0 ? 0 : (y>255 ? 255 : y);
                cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                im[i  ] = cr;
                im[i+1] = y;
                im[i+2] = cb;
            }
            cdf = FilterUtil.histogram(im, CHANNEL.G, true);
        }
        // equalize only the intesity channel
        range = f*(cdf.max - cdf.min)/cdf.total;
        if (notSupportClamp)
        {
            if (is_grayscale)
            {
                for (i=0; i<l; i+=4)
                {
                    r = (cdf.bin[im[i]]*range + cdf.min)|0;
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    im[i] = r; im[i+1] = r; im[i+2] = r;
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                {
                    y = cdf.bin[im[i+1]]*range + cdf.min;
                    cb = im[i+2];
                    cr = im[i  ];
                    r = (y                      + 1.402   * (cr-128));
                    g = (y - 0.34414 * (cb-128) - 0.71414 * (cr-128));
                    b = (y + 1.772   * (cb-128));
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    g = g<0 ? 0 : (g>255 ? 255 : g);
                    b = b<0 ? 0 : (b>255 ? 255 : b);
                    im[i  ] = r|0;
                    im[i+1] = g|0;
                    im[i+2] = b|0;
                }
            }
        }
        else
        {
            if (is_grayscale)
            {
                for (i=0; i<l; i+=4)
                {
                    r = (cdf.bin[im[i]]*range + cdf.min)|0;
                    im[i] = r; im[i+1] = r; im[i+2] = r;
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                {
                    y = cdf.bin[im[i+1]]*range + cdf.min;
                    cb = im[i+2];
                    cr = im[i  ];
                    r = (y                      + 1.402   * (cr-128));
                    g = (y - 0.34414 * (cb-128) - 0.71414 * (cr-128));
                    b = (y + 1.772   * (cb-128));
                    im[i  ] = r|0;
                    im[i+1] = g|0;
                    im[i+2] = b|0;
                }
            }
        }
        return im;
    }
});

}(FILTER);