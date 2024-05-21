/**
*
* TemplateMatcher
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var MODE = FILTER.MODE, GLSL = FILTER.Util.GLSL, FilterUtil = FILTER.Util.Filter,
    sat = FilterUtil.sat, satsum = FilterUtil.satsum, satsumr = FilterUtil.satsumr,
    merge_features = FilterUtil.merge_features,
    TypedArray = FILTER.Util.Array.typed, TypedObj = FILTER.Util.Array.typed_obj,
    stdMath = Math, clamp = FILTER.Util.Math.clamp, A32F = FILTER.Array32F,
    // 1 default direction
    rot1  = [0],
    // 4 cardinal directions
    rot4  = [0, 90, 180, 270],
    // 8 cardinal directions
    rot8  = [0, 45, 90, 135, 180, 225, 270, 315],
    // 16 cardinal directions
    rot16 = [0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5]
;

// Template matching using fast normalized cross correlation, Briechle, Hanebeck, 2001
// https://www.semanticscholar.org/paper/Template-matching-using-fast-normalized-cross-Briechle-Hanebeck/3632776737dc58adf0e278f9a7cafbeb6c1ec734
// A NEW APPROACH TO REPRESENT ROTATED HAAR-LIKE FEATURES FOR OBJECTS DETECTION, MOHAMED OUALLA, ABDELALIM SADIQ, SAMIR MBARKI, 2015
// http://www.jatit.org/volumes/Vol78No1/3Vol78No1.pdf
FILTER.Create({
    name : "TemplateMatcherFilter"

    ,path: FILTER.Path

    ,_update: false // filter by itself does not alter image data, just processes information
    ,hasMeta: true
    ,hasInputs: true
    ,mode: MODE.RGB
    ,sc: null
    ,rot: null
    ,scaleThreshold: null
    ,threshold: 0.7
    ,tolerance: 0.2
    ,minNeighbors: 1
    ,maxMatches: 1000
    ,maxMatchesOnly: true
    ,_k: 3
    ,_q: 0.98
    ,_s: 3
    ,_tpldata: null

    ,init: function(tpl) {
        var self = this;
        self.sc = {min:1,max:1,inc:1.1};
        self.rot = [0];
        if (tpl) self.setInput("template", tpl);
    }

    ,dispose: function() {
        var self = this;
        self.sc = self.rot = null;
        self.scaleThreshold = null;
        self._tpldata = null;
        self.$super('dispose');
        return self;
    }

    ,params: function(params) {
        var self = this;
        if (params)
        {
            if (null != params.threshold) self.threshold = params.threshold || 0;
            if (null != params.scaleThreshold) {self.scaleThreshold = params.scaleThreshold; if (self.scaleThreshold) self.scaleThreshold.changed = true;}
            if (null != params.tolerance) self.tolerance = params.tolerance || 0;
            if (null != params.minNeighbors) self.minNeighbors = params.minNeighbors || 0;
            if (null != params.maxMatches) self.maxMatches = params.maxMatches || 0;
            if (undef !== params.maxMatchesOnly) self.maxMatchesOnly = !!params.maxMatchesOnly;
            if (null != params.scales) {self.sc = params.scales || {min:1,max:1,inc:1.1}; self._glsl = null;}
            if (null != params.rotations) {self.rot = params.rotations || [0]; self._glsl = null;}
            if (null != params.k) self._k = k || 0;
            if (null != params.q) self.quality(params.q, self._s);
            if (null != params.s) self.quality(self._q, params.s);
            if (null != params.selection) self.selection = params.selection || null;
        }
        return self;
    }
    ,quality: function(quality, size) {
        var self = this;
        quality = null == quality ? 0.98 : (quality || 0);
        size = null == size ? 3 : (size || 0);
        if (quality !== self._q || size !== self._s)
        {
            self._tpldata = null;
            self._q = quality;
            self._s = size;
        }
        return self;
    }

    ,tpldata: function(basis, channel) {
        var self = this;

        if (basis && basis.avg && basis.avg.length) return self._tpldata = basis;

        var needsUpdate = self.isInputUpdated("template"), tpl = self.input("template");
        if (!tpl)
        {
            self._tpldata = null;
        }
        else if (basis)
        {
            if (needsUpdate || !self._tpldata || !self._tpldata.basis)
                self._tpldata = preprocess_tpl(tpl[0], tpl[1], tpl[2], 1 - self._q, self._s, channel);
        }
        else
        {
            if (needsUpdate || !self._tpldata)
                self._tpldata = preprocess_tpl(tpl[0], tpl[1], tpl[2]);
        }
        return self._tpldata;
    }

    ,serialize: function() {
        var self = this, ret;
        ret = {
            threshold: self.threshold
            ,scaleThreshold: 'function' === typeof self.scaleThreshold ? (self.scaleThreshold.changed ? self.scaleThreshold.toString() : null) : false
            ,tolerance: self.tolerance
            ,minNeighbors: self.minNeighbors
            ,maxMatches: self.maxMatches
            ,maxMatchesOnly: self.maxMatchesOnly
            ,sc: self.sc
            ,rot: self.rot
            ,_k: self._k
            ,_q: self._q
            ,_s: self._s
        };
        if (self.scaleThreshold && self.scaleThreshold.changed) self.scaleThreshold.changed = null;
        return ret;
    }

    ,unserialize: function(params) {
        var self = this;
        self.threshold = params.threshold;
        self.scaleThreshold = false === params.scaleThreshold ? null : (params.scaleThreshold ? (new Function('FILTER', 'return '+params.scaleThreshold+';'))(FILTER) : self.scaleThreshold);
        self.tolerance = params.tolerance;
        self.minNeighbors = params.minNeighbors;
        self.maxMatches = params.maxMatches;
        self.maxMatchesOnly = params.maxMatchesOnly;
        self.sc = params.sc;
        self.rot = params.rot;
        self._k = params._k;
        self._q = params._q;
        self._s = params._s;
        return self;
    }

    // detected objects are passed as filter metadata (if filter is run in parallel thread)
    ,metaData: function(serialisation) {
        return serialisation && FILTER.isWorker ? TypedObj(this.meta) : this.meta;
    }

    ,setMetaData: function(meta, serialisation) {
        this.meta = serialisation && ("string" === typeof meta) ? TypedObj(meta, 1) : meta;
        return this;
    }

    /*,getGLSL: function() {
        return glsl(this);
    }*/

    ,apply: function(im, w, h, metaData) {
        var self = this, tpldata = self.tpldata(true), t = self.input("template"), all_matches = [];

        self.meta = {matches: all_matches};
        if (!t || !tpldata) return im;

        var tpl = t[0], tw = t[1], th = t[2],
            selection = self.selection || null,
            is_grayscale = MODE.GRAY === self.mode,
            is_vertical, rot = self.rot, scale = self.sc,
            thresh = self.threshold, _k = self._k || 0,
            scaleThresh = self.scaleThreshold,
            r, rl, ro, sc, tt, tw2, th2, tws, ths,
            m = im.length, n = tpl.length,
            mm = w*h, nn = tw*th, m4, score,
            nccR, nccG, nccB,
            maxMatches = self.maxMatches,
            maxOnly = self.maxMatchesOnly,
            minNeighbors = self.minNeighbors,
            eps = self.tolerance,
            k, x, y, x1, y1, x2, y2, xf, yf, sin, cos,
            sat1, sat2, max, maxc, maxv, matches,
            rect = {x1:0,y1:0, x2:0,y2:0, x3:0,y3:0, x4:0,y4:0, area:0,sum:0,sum2:0,sat:null,sat2:null};

        // 1 default direction
        if       (1 === rot) rot = rot1;
        // 4 cardinal directions
        else if  (4 === rot) rot = rot4;
        // 8 cardinal directions
        else if  (8 === rot) rot = rot8;
        // 16 cardinal directions
        else if (16 === rot) rot = rot16;

        if (selection)
        {
            if (selection[4])
            {
                // selection is relative, make absolute
                xf = w-1;
                yf = h-1;
            }
            else
            {
                // selection is absolute
                xf = 1;
                yf = 1;
            }
            x1 = stdMath.min(w-1, stdMath.max(0, selection[0]*xf));
            y1 = stdMath.min(h-1, stdMath.max(0, selection[1]*yf));
            x2 = stdMath.min(w-1, stdMath.max(0, selection[2]*xf));
            y2 = stdMath.min(h-1, stdMath.max(0, selection[3]*yf));
        }
        else
        {
            x1 = 0; y1 = 0;
            x2 = w-1; y2 = h-1;
        }

        if (metaData && (metaData.tmfilter_SAT || metaData.haarfilter_SAT))
        {
            sat1 = metaData.tmfilter_SAT  || [metaData.haarfilter_SAT, metaData.haarfilter_SAT, metaData.haarfilter_SAT];
            sat2 = metaData.tmfilter_SAT2 || [metaData.haarfilter_SAT2,metaData.haarfilter_SAT2,metaData.haarfilter_SAT2];
        }
        else
        {
            if (is_grayscale)
            {
                sat1 = [new A32F(mm), null, null];
                sat2 = [new A32F(mm), null, null];
                sat(im, w, h, 2, 0, sat1[2] = sat1[1] = sat1[0], sat2[2] = sat2[1] = sat2[0]); // R
            }
            else
            {
                sat1 = [new A32F(mm), new A32F(mm), new A32F(mm)];
                sat2 = [new A32F(mm), new A32F(mm), new A32F(mm)];
                sat(im, w, h, 2, 0, sat1[0], sat2[0]); // R
                sat(im, w, h, 2, 1, sat1[1], sat2[1]); // G
                sat(im, w, h, 2, 2, sat1[2], sat2[2]); // B
            }
            if (metaData)
            {
                metaData.tmfilter_SAT = sat1;
                metaData.tmfilter_SAT2 = sat2;
            }
        }

        if (sat1[0] === sat1[1] && sat1[0] === sat1[2]) is_grayscale = true;
        for (r=0,rl=rot.length; r<rl; ++r)
        {
            ro = ((rot[r]||0) % 360);
            if (0 > ro) ro += 360;
            is_vertical = ((45 < ro && ro <= 135) || (225 < ro && ro <= 315));
            sin = stdMath.sin((ro/180)*stdMath.PI); cos = stdMath.cos((ro/180)*stdMath.PI);
            matches = [];
            for (sc=scale.min; sc<=scale.max; sc*=scale.inc)
            {
                tws = stdMath.round(sc*tw); ths = stdMath.round(sc*th);
                if (is_vertical)
                {
                    tw2 = (ths>>>1);
                    th2 = (tws>>>1);
                }
                else
                {
                    tw2 = (tws>>>1);
                    th2 = (ths>>>1);
                }
                if (x2-x1+1 < (tw2<<1) || y2-y1+1 < (th2<<1)) continue;
                tt = scaleThresh ? scaleThresh(sc, ro) : thresh;
                max = new Array(mm); maxc = 0; maxv = -Infinity;
                if (is_grayscale)
                {
                    for (x=x1+tw2,y=y1+th2,k=y2-th2; y<=k; ++x)
                    {
                        if (x+tw2 > x2) {x=x1+tw2; ++y; if (y>k) break;}
                        nccR = ncc(x, y, sat1[0], sat2[0], tpldata['avg'][0], tpldata['var'][0], tpldata.basis[0], w, h, tw, th, sc, ro, _k, tws, ths, sin, cos, rect); // R
                        if (nccR >= tt)
                        {
                            score = nccR;
                            if (maxOnly && (score < maxv)) continue;
                            if (score > maxv)
                            {
                                maxv = score;
                                if (maxOnly) maxc = 0; // reset for new max if maxOnly, else append this one as well
                            }
                            max[maxc++] = {x:x-(tws>>>1), y:y-(ths>>>1), width:tws, height:ths};
                        }
                    }
                }
                else
                {
                    for (x=x1+tw2,y=y1+th2,k=y2-th2; y<=k; ++x)
                    {
                        if (x+tw2 > x2) {x=x1+tw2; ++y; if (y>k) break;}
                        nccR = ncc(x, y, sat1[0], sat2[0], tpldata['avg'][0], tpldata['var'][0], tpldata.basis[0], w, h, tw, th, sc, ro, _k, tws, ths, sin, cos, rect); // R
                        nccG = ncc(x, y, sat1[1], sat2[1], tpldata['avg'][1], tpldata['var'][1], tpldata.basis[1], w, h, tw, th, sc, ro, _k, tws, ths, sin, cos, rect); // G
                        nccB = ncc(x, y, sat1[2], sat2[2], tpldata['avg'][2], tpldata['var'][2], tpldata.basis[2], w, h, tw, th, sc, ro, _k, tws, ths, sin, cos, rect); // B
                        if (nccR >= tt && nccG >= tt && nccB >= tt)
                        {
                            score = (nccR + nccG + nccB)/3;
                            if (maxOnly && (score < maxv)) continue;
                            if (score > maxv)
                            {
                                maxv = score;
                                if (maxOnly) maxc = 0; // reset for new max if maxOnly, else append this one as well
                            }
                            max[maxc++] = {x:x-(tws>>>1), y:y-(ths>>>1), width:tws, height:ths};
                        }
                    }
                }
                if (maxc && (maxc < stdMath.min(maxMatches, mm))) // if not too many
                {
                    max.length = maxc;
                    matches.push.apply(matches, max);
                }
            }
            if (matches.length)
            {
                matches = merge_features(matches, minNeighbors, eps);
                matches.forEach(function(match) {match.angle = ro;});
                all_matches.push.apply(all_matches, matches);
            }
        }

        max = matches = null; sat1 = sat2 = null;
        return im;
    }
});
function ncc(x, y, sat1, sat2, avgt, vart, basis, w, h, tw, th, sc, ro, kk, tws0, ths0, sin, cos, rect)
{
    // normalized cross-correlation centered at point (x,y)
    if (null == sc)
    {
        sc = 1;
    }
    if (null == ro)
    {
        ro = 0;
    }
    if (null == kk)
    {
        kk = 0;
        if (null == tws0) {tws0 = stdMath.round(sc*tw); ths0 = stdMath.round(sc*th);}
        if (null == sin)  {sin = stdMath.sin((ro/180)*stdMath.PI); cos = stdMath.cos((ro/180)*stdMath.PI);}
        if (null == rect) {rect = {x1:0,y1:0, x2:0,y2:0, x3:0,y3:0, x4:0,y4:0, area:0,sum:0,sum2:0,sat:null,sat2:null};}
    }
    var tws = tws0, ths = ths0, tws2, ths2, area,
        x0, y0, x1, y1, f, bk, k, K = basis.length,
        sum1, sum2, diff, avgf, varf, varft,
        is_tilted = !(0 === ro || 90 === ro || 180 === ro || 270 === ro);
    if (is_tilted)
    {
        tws2 = tws>>>1; ths2 = ths>>>1;
        x0 = -tws2; y0 = -ths2; x1 = tws-1-tws2; y1 = ths-1-ths2;
        rect.sat = sat1; rect.sat2 = sat2;
        rot(rect, x0, y0, x1, y1, sin, cos, 0, 0);
        satsumr(rect, w, h, x+rect.x1, y+rect.y1, x+rect.x2, y+rect.y2, x+rect.x3, y+rect.y3, x+rect.x4, y+rect.y4, kk);
        area = rect.area;
        sum1 = rect.sum;
        sum2 = rect.sum2;
        rect.sat2 = null;
    }
    else
    {
        // swap x/y
        if ((45 < ro && ro <= 135) || (225 < ro && ro <= 315)) {tws = ths0; ths = tws0;}
        tws2 = tws>>>1; ths2 = ths>>>1;
        x0 = x-tws2; y0 = y-ths2; x1 = x+tws-1-tws2; y1 = y+ths-1-ths2;
        area = satsum(null, w, h, x0, y0, x1, y1);
        sum1 = satsum(sat1, w, h, x0, y0, x1, y1);
        sum2 = satsum(sat2, w, h, x0, y0, x1, y1);
    }
    f = area/(tws*ths);
    if (f < 0.5) return 0; // percent of matched area too small, reject
    avgf = sum1/area;
    varf = stdMath.abs(sum2-sum1*avgf);
    if (1 >= K)
    {
        return varf < 1e-3 ? (stdMath.abs(avgf - avgt) < 0.5 ? 1 : (1 - stdMath.abs(avgf - avgt)/stdMath.max(avgf, avgt))) : 0;
    }
    else
    {
        if (varf < 1e-3) return 0;
        if (1 >= f) f = 1;
        varft = 0; //vart = 0;
        for (k=0; k<K; ++k)
        {
            bk = basis[k];
            if (is_tilted)
            {
                x0 = bk.x0;
                y0 = bk.y0;
                x1 = bk.x1;
                y1 = bk.y1;
            }
            else
            {
                if (225 < ro && ro <= 315) // 270
                {
                    // swap x/y
                    x0 = bk.y0;
                    y0 = tw-1-bk.x1;
                    x1 = bk.y1;
                    y1 = tw-1-bk.x0;
                }
                else if (135 < ro && ro <= 225) // 180
                {
                    x0 = tw-1-bk.x1;
                    y0 = th-1-bk.y1;
                    x1 = tw-1-bk.x0;
                    y1 = th-1-bk.y0;
                }
                else if (45 < ro && ro <= 135) // 90
                {
                    // swap x/y
                    x0 = th-1-bk.y1;
                    y0 = bk.x0;
                    x1 = th-1-bk.y0;
                    y1 = bk.x1;
                }
                else // 0
                {
                    x0 = bk.x0;
                    y0 = bk.y0;
                    x1 = bk.x1;
                    y1 = bk.y1;
                }
            }
            x0 = stdMath.round(sc*x0)-tws2;
            y0 = stdMath.round(sc*y0)-ths2;
            x1 = stdMath.round(sc*x1)-tws2;
            y1 = stdMath.round(sc*y1)-ths2;
            diff = bk.k-avgt;
            if (is_tilted)
            {
                rot(rect, x0, y0, x1, y1, sin, cos, 0, 0);
                satsumr(rect, w, h, x+rect.x1, y+rect.y1, x+rect.x2, y+rect.y2, x+rect.x3, y+rect.y3, x+rect.x4, y+rect.y4, kk);
                varft += diff*(rect.sum - avgf*rect.area);
            }
            else
            {
                varft += diff*(satsum(sat1, w, h, x+x0, y+y0, x+x1, y+y1) - avgf*satsum(null, w, h, x+x0, y+y0, x+x1, y+y1));
            }
            //vart += diff*diff*area2;
        }
        vart *= /*area*/tws*ths; varft /= f;
        return stdMath.min(stdMath.max((stdMath.abs(varft)/stdMath.sqrt(vart*varf)) || 0, 0), 1);
    }
}
function rot(rect, x1, y1, x3, y3, sin, cos, ox, oy)
{
    var x, y;
    x = x1 - ox; y = y1 - oy;
    rect.x1 = stdMath.round(cos*x - sin*y + ox);
    rect.y1 = stdMath.round(sin*x + cos*y + oy);

    x = x3 - ox; /*y = y1 - oy;*/
    rect.x2 = stdMath.round(cos*x - sin*y + ox);
    rect.y2 = stdMath.round(sin*x + cos*y + oy);

    /*x = x3 - ox;*/ y = y3 - oy;
    rect.x3 = stdMath.round(cos*x - sin*y + ox);
    rect.y3 = stdMath.round(sin*x + cos*y + oy);

    x = x1 - ox; /*y = y3 - oy;*/
    rect.x4 = stdMath.round(cos*x - sin*y + ox);
    rect.y4 = stdMath.round(sin*x + cos*y + oy);

    rect.area = 0; rect.sum = 0; rect.sum2 = 0;
}
function preprocess_tpl(t, w, h, Jmax, minSz, channel)
{
    var tr = 0, tg = 0, tb = 0, a, b, v,
        l = t.length, n = w*h, p;
    for (p=0; p<l; p+=4)
    {
        tr += t[p  ]/n;
        tg += t[p+1]/n;
        tb += t[p+2]/n;
    }
    a = [tr, tg, tb];
    if (null != Jmax)
    {
        b = [[], [], []];
        v = [0, 0, 0];
        if (null != channel)
        {
            b[channel] = FilterUtil.tm_approximate(t, w, h, channel, Jmax, minSz);
            v[channel] = basisv(b[channel], a[channel]);
        }
        else
        {
            b = [
            FilterUtil.tm_approximate(t, w, h, 0, Jmax, minSz),
            FilterUtil.tm_approximate(t, w, h, 1, Jmax, minSz),
            FilterUtil.tm_approximate(t, w, h, 2, Jmax, minSz)
            ];
            v = [
            basisv(b[0], a[0], w, h),
            basisv(b[1], a[1], w, h),
            basisv(b[2], a[2], w, h)
            ];
        }
    }
    return {'avg':a, 'basis':b||null, 'var':v||null};
}
function approximate(t, w, h, c, Jmax, minSz)
{
    var J, J2, Jmin, bmin,
        x0, x1, y0, y1, ww, hh,
        x, y, xx, yy, yw, avg1, avg2,
        p, tp, l = t.length, n = l>>>2,
        s, v, k, K, b, bk, bb;
    sat(t, w, h, 2, c, s=new A32F(n));
    b = [{k:satsum(s, w, h, 0, 0, w-1, h-1)/n,x0:0,y0:0,x1:w-1,y1:h-1,q:1}];
    bk = b[0];
    Jmax *= 255*255; J = 0;
    for (p=0; p<l; p+=4) {v = (t[p+c]-bk.k); J += v*v/n;}
    Jmin = J;
    while (J > Jmax)
    {
        Jmin = J;
        bmin = b;
        K = b.length;
        for (k=0; k<K; ++k)
        {
            bk = b[k];
            if (minSz >= bk.x1 - bk.x0 + 1 && minSz >= bk.y1 - bk.y0 + 1) continue;
            for (x=bk.x0; x<bk.x1; ++x)
            {
                J2 = J;
                hh = bk.y1-bk.y0+1;
                ww = x-bk.x0+1;
                avg1 = satsum(s, w, h, bk.x0, bk.y0, x, bk.y1)/(ww*hh);
                ww = bk.x1-(x+1)+1;
                avg2 = satsum(s, w, h, x+1, bk.y0, bk.x1, bk.y1)/(ww*hh);
                for (xx=bk.x0; xx<=x; ++xx)
                {
                    for (yy=bk.y0,yw=yy*w; yy<=bk.y1; ++yy,yw+=w)
                    {
                        p = (xx + yw) << 2;
                        tp = t[p+c];
                        v = (tp - bk.k);
                        J2 -= v*v/n;
                        v = (tp - avg1);
                        J2 += v*v/n;
                    }
                }
                for (xx=x+1; xx<=bk.x1; ++xx)
                {
                    for (yy=bk.y0,yw=yy*w; yy<=bk.y1; ++yy,yw+=w)
                    {
                        p = (xx + yw) << 2;
                        tp = t[p+c];
                        v = (tp - bk.k);
                        J2 -= v*v/n;
                        v = (tp - avg2);
                        J2 += v*v/n;
                    }
                }
                if (J2 < Jmin)
                {
                    Jmin = J2;
                    bmin = b.slice(0, k);
                    bmin.push({k:avg1, x0:bk.x0, x1:x, y0:bk.y0, y1:bk.y1});
                    bmin.push({k:avg2, x0:x+1, x1:bk.x1, y0:bk.y0, y1:bk.y1});
                    bmin.push.apply(bmin, b.slice(k+1));
                }
            }
            for (y=bk.y0; y<bk.y1; ++y)
            {
                J2 = J;
                ww = bk.x1-bk.x0+1;
                hh = y-bk.y0+1;
                avg1 = satsum(s, w, h, bk.x0, bk.y0, bk.x1, y)/(ww*hh);
                hh = bk.y1-(y+1)+1;
                avg2 = satsum(s, w, h, bk.x0, y+1, bk.x1, bk.y1)/(ww*hh);
                for (yy=bk.y0,yw=yy*w; yy<=y; ++yy,yw+=w)
                {
                    for (xx=bk.x0; xx<=bk.x1; ++xx)
                    {
                        p = (xx + yw) << 2;
                        tp = t[p+c];
                        v = (tp - bk.k);
                        J2 -= v*v/n;
                        v = (tp - avg1);
                        J2 += v*v/n;
                    }
                }
                for (yy=y+1,yw=yy*w; yy<=bk.y1; ++yy,yw+=w)
                {
                    for (xx=bk.x0; xx<=bk.x1; ++xx)
                    {
                        p = (xx + yw) << 2;
                        tp = t[p+c];
                        v = (tp - bk.k);
                        J2 -= v*v/n;
                        v = (tp - avg2);
                        J2 += v*v/n;
                    }
                }
                if (J2 < Jmin)
                {
                    Jmin = J2;
                    bmin = b.slice(0, k);
                    bmin.push({k:avg1, x0:bk.x0, x1:bk.x1, y0:bk.y0, y1:y});
                    bmin.push({k:avg2, x0:bk.x0, x1:bk.x1, y0:y+1, y1:bk.y1});
                    bmin.push.apply(bmin, b.slice(k+1));
                }
            }
        }
        if (bmin === b) break;
        J = Jmin;
        b = bmin;
    }
    b[0].q = 1-Jmin/255/255;
    return b;
}
function basisv(basis, avg, w, h)
{
    var k, K = basis.length, bk, v = 0;
    for (k=0; k<K; ++k) {bk = basis[k]; v += ((bk.x1-bk.x0+1)/w*(bk.k-avg))*((bk.y1-bk.y0+1)/h*(bk.k-avg));}
    return v;
}
FilterUtil.tm_approximate = approximate;
FilterUtil.tm_ncc = ncc;
/*function glsl(filter)
{
    if (!filter.input("template")) return (new GLSL.Filter(filter)).begin().shader(GLSL.DEFAULT).end().code();
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader(function(glsl, im) {
        var tpldata = filter.tpldata(), tpl = filter.input("template");
        filter.meta = {matches: []};
        glsl.io().matches = [];
        glsl.io().im = im;
        glsl.io().tpl = {data:tpl[0], width:tpl[1], height:tpl[2]};
        glsl.io().avgT = [tpldata.avg[0]/255, tpldata.avg[1]/255, tpldata.avg[2]/255];
        return im;
    })
    .end();
    var shader = [
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform sampler2D tpl;',
    'uniform vec2 imgSize;',
    'uniform vec2 tplSize;',
    'uniform vec3 avgT;',
    'uniform vec4 selection;',
    'uniform float sc;',
    'uniform int ro;',
    'void main(void) {',
    '    vec2 tplSizeScaled = tplSize * sc; vec2 twh;',
    '    if (90 == ro || -270 == ro || 270 == ro || -90 == ro)',
    '    {',
    '        twh.xy = tplSizeScaled.yx;',
    '    }',
    '    else',
    '    {',
    '        twh.xy = tplSizeScaled.xy;',
    '    }',
    '    if (pix.x < selection.x || pix.y < selection.y || pix.x > selection.z || pix.y > selection.w || pix.y*imgSize.y + twh.y > imgSize.y || pix.x*imgSize.x + twh.x > imgSize.x)',
    '    {',
    '        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
    '    }',
    '    else',
    '    {',
    '        int tplW = int(tplSizeScaled.x); int tplH = int(tplSizeScaled.y);',
    '        float N = tplSizeScaled.x*tplSizeScaled.y;',
    '        vec4 F; vec4 T;',
    '        vec3 avgF = vec3(0.0); //vec3 avgT = vec3(0.0);',
    '        vec3 dF; vec3 dT;',
    '        vec3 sumFF = vec3(0.0); vec3 sumTT = vec3(0.0); vec3 sumFT = vec3(0.0);',
    '        float ii; float jj; float x; float y;',
    '        for (int i = 0; i < 1000; i++)',
    '        {',
    '            if (i >= tplH) break;',
    '            ii = float(i);',
    '            for (int j = 0; j < 1000; j++)',
    '            {',
    '                if (j >= tplW) break;',
    '                jj = float(j);',
    '                F = texture2D(img, pix + vec2(jj, ii) / imgSize);',
    '                //T = texture2D(tpl, vec2(x, y) / twh);',
    '                avgF.rgb += F.rgb; //avgT.rgb += T.rgb;',
    '            }',
    '        }',
    '        avgF /= N; //avgT /= N;',
    '        for (int i = 0; i < 1000; i++)',
    '        {',
    '            if (i >= tplH) break;',
    '            ii = float(i);',
    '            for (int j = 0; j < 1000; j++)',
    '            {',
    '                if (j >= tplW) break;',
    '                jj = float(j);',
    '                if (-90 == ro || 270 == ro)',
    '                {',
    '                    x = ii;',
    '                    y = jj;',
    '                }',
    '                else if (180 == ro || -180 == ro)',
    '                {',
    '                    x = tplSizeScaled.x-1.0-jj;',
    '                    y = tplSizeScaled.y-1.0-ii;',
    '                }',
    '                else if (-270 == ro || 90 == ro)',
    '                {',
    '                    y = tplSizeScaled.x-1.0-jj;',
    '                    x = tplSizeScaled.y-1.0-ii;',
    '                }',
    '                else // 0, 360, -360',
    '                {',
    '                    x = jj;',
    '                    y = ii;',
    '                }',
    '                F = texture2D(img, pix + vec2(jj, ii) / imgSize);',
    '                T = texture2D(tpl, vec2(x, y) / twh);',
    '                dF.rgb = F.rgb - avgF.rgb; dT.rgb = T.rgb - avgT.rgb;',
    '                sumFF += dF * dF;',
    '                sumTT += dT * dT;',
    '                sumFT += dF * dT;',
    '            }',
    '        }',
    '        vec3 ncc = vec3(0.0 < sumFF.r && 0.0 < sumTT.r ? (sumFT.r/sqrt(sumFF.r*sumTT.r)) : 1.0,0.0 < sumFF.g && 0.0 < sumTT.g ? (sumFT.g/sqrt(sumFF.g*sumTT.g)) : 1.0,0.0 < sumFF.b && 0.0 < sumTT.b ? (sumFT.b/sqrt(sumFF.b*sumTT.b)) : 1.0);',
    '        float score = min(max((abs(ncc.r) + abs(ncc.g) + abs(ncc.b)) / 3.0, 0.0), 1.0);',
    '        gl_FragColor = vec4(score, score, score, 1.0);',
    '    }',
    '}'
    ].join('\n');
    var rot = filter.rot, r, rl, ro, sc;
    for (r=0,rl=rot.length; r<rl; ++r)
    {
        ro = rot[r];
        for (sc=filter.sc[0]; sc<=filter.sc[1]; sc*=filter.sc[2])
        {
            glslcode
            .begin()
            .shader(shader)
            .input('imgSize', function(filter, w, h) {
                return [w, h];
            })
            .input('tpl', function(filter, w, h, w2, h2, io) {
                return io.tpl;
            })
            .input('tplSize', function(filter, w, h, w2, h2, io) {
                return [io.tpl.width, io.tpl.height];
            })
            .input('avgT', function(filter, w, h, w2, h2, io) {
                return io.avgT;
            })
            .input('sc', sc)
            .input('ro', ro)
            .end()
            .begin()
            .shader(function(glsl, im, w, h) {
                var io = glsl.io(), inputs = glsl._inputs, max,
                    sc = inputs.sc.setter, ro = inputs.ro.setter, t,
                    tw = io.tpl.width, th = io.tpl.height,
                    tws = stdMath.round(sc*tw), ths = stdMath.round(sc*th);
                if (90 === ro || -270 === ro || 270 === ro || -90 === ro)
                {
                    // swap x/y
                    t = tws;
                    tws = ths;
                    ths = t;
                }
                max = FilterUtil.max(im, w, h, filter.scaleThreshold ? filter.scaleThreshold(sc, ro) : filter.threshold, 2, 0);
                if (max.maxpos.length && max.maxpos.length < stdMath.min(filter.maxMatches, w*h)) // if not too many
                    io.matches.push.apply(io.matches, max.maxpos.map(function(p) {return {x:p.x, y:p.y, width:tws, height:ths};}));
                return io.im;
            })
            .input('sc', sc)
            .input('ro', ro)
            .end();
        }
    }
    glslcode
    .begin()
    .shader(function(glsl) {
        filter.meta = {matches: FilterUtil.merge_features(glsl.io().matches, filter.minNeighbors, filter.tolerance)};
        return glsl.io().im;
    })
    .end();
    return glslcode.code();
}*/
}(FILTER);