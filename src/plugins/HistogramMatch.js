/**
*
* Histogram Equalize,
* Histogram Equalize for grayscale images,
* RGB Histogram Equalize
* Histogram Matching,
* Histogram Matching for grayscale images,
* RGB Histogram Matching
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var notSupportClamp = FILTER._notSupportClamp,
    CHANNEL = FILTER.CHANNEL, MODE = FILTER.MODE,
    FilterUtil = FILTER.Util.Filter,
    compute_histogram = FilterUtil.histogram,
    match_histogram = FilterUtil.match_histogram,
    TypedObj = FILTER.Util.Array.typed_obj,
    stdMath = Math, Min = stdMath.min, Max = stdMath.max;

// a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
FILTER.Create({
    name : "HistogramEqualizeFilter"

    ,path: FILTER.Path

    ,mode: MODE.INTENSITY
    ,channel: 0
    ,factor: 0.0
    ,range: null

    ,init: function(mode, channel, factor, range) {
        var self = this;
        self.mode = mode || MODE.INTENSITY;
        self.channel = channel || 0;
        self.range = [0, 255];
        if (null != factor) self.factor = (+factor) || 0;
        if (range && (0 < range.length) && (0 === (range.length&1))) self.range = range;
    }

    ,serialize: function() {
        var self = this;
        return {
             channel: self.channel,
             factor: self.factor,
             range: self.range
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.channel = params.channel;
        self.factor = params.factor;
        self.range = params.range;
        return self;
    }

    ,_apply_rgb: function(im, w, h) {
        var self = this,
            r, g, b,
            rangeR, rangeG, rangeB,
            cdfR, cdfG, cdfB,
            f = self.factor || 0,
            range = self.range,
            ra = range[0] || 0,
            rb = range[1] || 255,
            ga = (null == range[2] ? ra : range[2]) || 0,
            gb = (null == range[3] ? rb : range[3]) || 255,
            ba = (null == range[4] ? ra : range[4]) || 0,
            bb = (null == range[5] ? rb : range[5]) || 255,
            t0, t1, t2, v,
            i, l = im.length;

        cdfR = compute_histogram(im, CHANNEL.R, true);
        cdfG = compute_histogram(im, CHANNEL.G, true);
        cdfB = compute_histogram(im, CHANNEL.B, true);
        // equalize each channel separately
        f = 1 - Min(Max(f, 0), 1);
        rangeR = (cdfR.max - cdfR.min)/cdfR.total;
        rangeG = (cdfG.max - cdfG.min)/cdfG.total;
        rangeB = (cdfB.max - cdfB.min)/cdfB.total;
        if (notSupportClamp)
        {
            for (i=0; i<l; i+=4)
            {
                r = im[i  ];
                g = im[i+1];
                b = im[i+2];
                if (ra <= r && r <= rb)
                {
                    v = cdf.binR[r]*rangeR;
                    t0 = ((f)*(v + cdfR.min) + (1-f)*(cdfR.max - v));
                }
                else
                {
                    t0 = r;
                }
                if (ga <= g && g <= gb)
                {
                    v = cdf.binG[g]*rangeG;
                    t1 = ((f)*(v + cdfG.min) + (1-f)*(cdfG.max - v));
                }
                else
                {
                    t1 = g;
                }
                if (ba <= b && b <= bb)
                {
                    v = cdf.binB[b]*rangeB;
                    t2 = ((f)*(v + cdfB.min) + (1-f)*(cdfB.max - v));
                }
                else
                {
                    t2 = b;
                }
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
                if (ra <= r && r <= rb)
                {
                    v = cdf.binR[r]*rangeR;
                    t0 = ((f)*(v + cdfR.min) + (1-f)*(cdfR.max - v));
                }
                else
                {
                    t0 = r;
                }
                if (ga <= g && g <= gb)
                {
                    v = cdf.binG[g]*rangeG;
                    t1 = ((f)*(v + cdfG.min) + (1-f)*(cdfG.max - v));
                }
                else
                {
                    t1 = g;
                }
                if (ba <= b && b <= bb)
                {
                    v = cdf.binB[b]*rangeB;
                    t2 = ((f)*(v + cdfB.min) + (1-f)*(cdfB.max - v));
                }
                else
                {
                    t2 = b;
                }
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
            range, cdf, i, v,
            l = im.length, f = self.factor || 0,
            channel = self.channel || 0,
            va = self.range[0] || 0,
            vb = self.range[1] || 255,
            mode = self.mode;

        if (MODE.GRAY === mode || MODE.CHANNEL === mode)
        {
            cdf = compute_histogram(im, channel, true);
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
            cdf = compute_histogram(im, CHANNEL.G, true);
        }
        // equalize only the intesity channel
        f = 1 - Min(Max(f, 0), 1);
        range = (cdf.max - cdf.min)/cdf.total;
        if (notSupportClamp)
        {
            if (MODE.GRAY === mode)
            {
                for (i=0; i<l; i+=4)
                {
                    v = im[i+channel];
                    if (va <= v && v <= vb)
                    {
                        v = cdf.bin[v]*range;
                        r = ((f)*(v + cdf.min) + (1-f)*(cdf.max - v));
                    }
                    else
                    {
                        r = v;
                    }
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    r = r|0;
                    im[i] = r; im[i+1] = r; im[i+2] = r;
                }
            }
            else if (MODE.CHANNEL === mode)
            {
                for (i=0; i<l; i+=4)
                {
                    v = im[i+channel];
                    if (va <= v && v <= vb)
                    {
                        v = cdf.bin[v]*range;
                        r = ((f)*(v + cdf.min) + (1-f)*(cdf.max - v));
                    }
                    else
                    {
                        r = v;
                    }
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    im[i+channel] = r|0;
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                {
                    v = im[i+1];
                    if (va <= v && v <= vb)
                    {
                        v = cdf.bin[v]*range;
                        y = ((f)*(v + cdf.min) + (1-f)*(cdf.max - v));
                    }
                    else
                    {
                        y = v;
                    }
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
            if (MODE.GRAY === mode)
            {
                for (i=0; i<l; i+=4)
                {
                    v = im[i+channel];
                    if (va <= v && v <= vb)
                    {
                        v = cdf.bin[v]*range;
                        r = ((f)*(v + cdf.min) + (1-f)*(cdf.max - v));
                    }
                    else
                    {
                        r = v;
                    }
                    im[i] = r; im[i+1] = r; im[i+2] = r;
                }
            }
            else if (MODE.CHANNEL === mode)
            {
                for (i=0; i<l; i+=4)
                {
                    v = im[i+channel];
                    if (va <= v && v <= vb)
                    {
                        v = cdf.bin[v]*range;
                        r = ((f)*(v + cdf.min) + (1-f)*(cdf.max - v));
                    }
                    else
                    {
                        r = v;
                    }
                    im[i+channel] = r;
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                {
                    v = im[i+1];
                    if (va <= v && v <= vb)
                    {
                        v = cdf.bin[v]*range;
                        y = ((f)*(v + cdf.min) + (1-f)*(cdf.max - v));
                    }
                    else
                    {
                        y = v;
                    }
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

// a simple histogram matching filter  https://en.wikipedia.org/wiki/Histogram_matching
FILTER.Create({
    name : "HistogramMatchFilter"

    ,path: FILTER.Path

    ,mode: MODE.INTENSITY
    ,cdf: null
    ,channel: 0

    ,init: function(mode, cdf, channel) {
        var self = this;
        self.mode = mode || MODE.INTENSITY;
        self.cdf = cdf;
        self.channel = channel || 0;
    }

    ,serialize: function() {
        var self = this;
        return {
             channel: self.channel,
             cdf: TypedObj(self.cdf)
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.channel = params.channel;
        self.cdf = TypedObj(params.cdf, 1);
        return self;
    }

    ,_apply_rgb: function(im, w, h) {
        var self = this,
            r, g, b, v, i,
            cdf = self.cdf,
            cdfR, cdfG, cdfB,
            l = im.length;

        cdfR = compute_histogram(im, CHANNEL.R, true, true);
        cdfG = compute_histogram(im, CHANNEL.G, true, true);
        cdfB = compute_histogram(im, CHANNEL.B, true, true);
        // match each channel separately
        for (i=0; i<l; i+=4)
        {
            r = im[i  ];
            g = im[i+1];
            b = im[i+2];
            im[i  ] = match_histogram(r, cdfR.bin, cdf[0], 0, 255);
            im[i+1] = match_histogram(g, cdfG.bin, cdf[1], 0, 255);
            im[i+2] = match_histogram(b, cdfB.bin, cdf[2], 0, 255);
        }
        // return the new image data
        return im;
    }

    ,apply: function(im, w, h) {
        var self = this;

        if (MODE.RGB === self.mode) return self._apply_rgb(im, w, h);

        var r, g, b, y, cb, cr,
            cdf, i, v, l = im.length,
            channel = self.channel || 0,
            cdf2, mode = self.mode;

        if (MODE.GRAY === mode || MODE.CHANNEL === mode)
        {
            cdf = compute_histogram(im, channel, true, true);
            cdf2 = self.cdf[channel];
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
            cdf = compute_histogram(im, CHANNEL.G, true, true);
            cdf2 = self.cdf[0];
        }
        // match only the intesity channel
        if (MODE.GRAY === mode)
        {
            for (i=0; i<l; i+=4)
            {
                r = match_histogram(im[i+channel], cdf.bin, cdf2, 0, 255);
                im[i] = r; im[i+1] = r; im[i+2] = r;
            }
        }
        else if (MODE.CHANNEL === mode)
        {
            for (i=0; i<l; i+=4)
            {
                im[i+channel] = match_histogram(im[i+channel], cdf.bin, cdf2, 0, 255);
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                y = match_histogram(im[i+1], cdf.bin, cdf2, 0, 255);
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
        return im;
    }
});

}(FILTER);