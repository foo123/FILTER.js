/**
*
* Frequency Filter
*
* Filter inputs in the Fourier Frequency Domain
*
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MODE = FILTER.MODE, A32F = FILTER.Array32F,
    fft = FILTER.Util.Filter.fft2d,
    ifft = FILTER.Util.Filter.ifft2d;

//
//  Frequency Filter
FILTER.Create({
    name: "FrequencyFilter"

    ,init: function FrequencyFilter(filterR, filterG, filterB) {
        var self = this;
        self.set(filterR, filterG, filterB);
    }

    ,path: FILTER.Path
    ,_filterE: null
    ,_filterG: null
    ,_filterB: null
    ,_changed: false

    ,dispose: function() {
        var self = this;
        self._filterR = null;
        self._filterG = null;
        self._filterB = null;
        self._changed = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this, json;
        json = {
             _filterR: false === self._filterR ? false : (self._changed && self._filterR ? self._filterR.toString() : null)
             ,_filterG: false === self._filterG ? false : (self._changed && self._filterG ? self._filterG.toString() : null)
             ,_filterB: false === self._filterB ? false : (self._changed && self._filterB ? self._filterB.toString() : null)
        };
        self._changed = false;
        return json;
    }

    ,unserialize: function(params) {
        var self = this;
        if (null != params._filterR)
            self._filterR = false === params._filterR ? null : ((new Function("FILTER", '"use strict"; return ' + params._filterR + ';'))(FILTER));
        if (null != params._filterG)
            self._filterG = false === params._filterG ? null : ((new Function("FILTER", '"use strict"; return ' + params._filterG + ';'))(FILTER));
        if (null != params._filterB)
            self._filterB = false === params._filterB ? null : ((new Function("FILTER", '"use strict"; return ' + params._filterB + ';'))(FILTER));
        return self;
    }

    ,set: function(filterR, filterG, filterB) {
        var self = this;
        if (false === filterR)
        {
            self._filterR = false;
            self._changed = true;
        }
        else
        {
            if (filterR && ("function" === typeof filterR))
            {
                self._filterR = filterR;
                self._changed = true;
            }
        }
        if (false === filterG)
        {
            self._filterG = false;
        }
        else
        {
            if (filterG && ("function" === typeof filterG))
            {
                self._filterG = filterG;
            }
        }
        if (false === filterB)
        {
            self._filterG = false;
        }
        else
        {
            if (filterB && ("function" === typeof filterB))
            {
                self._filterB = filterB;
            }
        }
        return self;
    }

    ,_apply: function(im, w, h) {
        var self = this,
            gray = MODE.GRAY === self.mode,
            filterR = self._filterR,
            filterG = self._filterG,
            filterB = self._filterB,
            R_r, G_r, B_r,
            R_i, G_i, B_i,
            R, G, B,
            i, j, v,
            n = w*h, l = im.length;
        if (!filterR && !filterG && !filterB) return im;
        if (filterR)
        {
            R_r = new A32F(n); R_i = new A32F(n);
        }
        if (filterG && !gray)
        {
            G_r = new A32F(n); G_i = new A32F(n);
        }
        if (filterB && !gray)
        {
            B_r = new A32F(n); B_i = new A32F(n);
        }
        for (i=0,j=0; i<l; i+=4,++j)
        {
           if (filterR) R_r[j] = im[i  ]/255;
           if (filterG && !gray) G_r[j] = im[i+1]/255;
           if (filterB && !gray) B_r[j] = im[i+2]/255;
        }
        if (filterR)
        {
            R = filter(fft(R_r, R_i, w, h), filterR, w, h);
            R = ifft(R.r, R.i, w, h).r;
        }
        if (filterG && !gray)
        {
            G = filter(fft(G_r, G_i, w, h), filterG, w, h);
            G = ifft(G.r, G.i, w, h).r;
        }
        if (filterB && !gray)
        {
            B = filter(fft(B_r, B_i, w, h), filterB, w, h);
            B = ifft(B.r, B.i, w, h).r;
        }
        if (gray)
        {
            R = R || G || B;
            for (i=0,j=0; i<l; i+=4,++j)
            {
               v = (255*R[j])|0;
               im[i  ] = v;
               im[i+1] = v;
               im[i+2] = v;
            }
        }
        else
        {
            for (i=0,j=0; i<l; i+=4,++j)
            {
               if (R)
               {
                   v = (255*R[j])|0;
                   im[i  ] = v;
               }
               if (G)
               {
                   v = (255*G[j])|0;
                   im[i+1] = v;
               }
               if (B)
               {
                   v = (255*B[j])|0;
                   im[i+2] = v;
               }
            }
        }
        return im;
    }

    ,canRun: function() {
        return this._isOn && (this._filterR || this._filterG || this._filterB);
    }
});
FILTER.FourierFilter = FILTER.FrequencyFilter;

function filter(fft, map, w, h)
{
    for (var O=[0,0],i=0; i<w; ++i)
    {
        for (var j=0,jw=0; j<h; ++j,jw+=w)
        {
            var k = i+jw, o = map(fft.r[k], fft.i[k], i, j, w, h, fft) || O;
            fft.r[k] = o[0] || 0;  fft.i[k] = o[1] || 0;
        }
    }
    return fft;
}
}(FILTER);