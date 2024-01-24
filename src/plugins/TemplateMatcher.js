/**
*
* TemplateMatcher
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var MODE = FILTER.MODE, GLSL = FILTER.Util.GLSL, FilterUtil = FILTER.Util.Filter,
    sat = FilterUtil.sat, satsum = FilterUtil.satsum, rsatsum = FilterUtil.rsatsum,
    TypedArray = FILTER.Util.Array.typed, TypedObj = FILTER.Util.Array.typed_obj,
    stdMath = Math, clamp = FILTER.Util.Math.clamp, A32F = FILTER.Array32F;

// Template matching using fast normalized cross correlation, Briechle, Hanebeck, 2001
// https://www.semanticscholar.org/paper/Template-matching-using-fast-normalized-cross-Briechle-Hanebeck/3632776737dc58adf0e278f9a7cafbeb6c1ec734)
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
    ,returnAngle: false
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
            if (null != params.scaleThreshold) self.scaleThreshold = params.scaleThreshold;
            if (null != params.tolerance) self.tolerance = params.tolerance || 0;
            if (null != params.minNeighbors) self.minNeighbors = params.minNeighbors || 0;
            if (null != params.maxMatches) self.maxMatches = params.maxMatches || 0;
            if (undef !== params.maxMatchesOnly) self.maxMatchesOnly = !!params.maxMatchesOnly;
            if (undef !== params.returnAngle) self.returnAngle = !!params.returnAngle;
            if (null != params.scales) {self.sc = params.scales || {min:1,max:1,inc:1.1}; self._glsl = null;}
            if (null != params.rotations) {self.rot = params.rotations || [0]; self._glsl = null;}
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
        var self = this;
        return {
            threshold: self.threshold
            ,scaleThreshold: 'function' === typeof self.scaleThreshold ? self.scaleThreshold.toString() : null
            ,tolerance: self.tolerance
            ,minNeighbors: self.minNeighbors
            ,maxMatches: self.maxMatches
            ,sc: self.sc
            ,rot: self.rot
            ,_q: self._q
            ,_s: self._s
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.threshold = params.threshold;
        self.scaleThreshold = params.scaleThreshold ? (new Function('FILTER', 'return '+params.scaleThreshold+';'))(FILTER) : null;
        self.tolerance = params.tolerance;
        self.minNeighbors = params.minNeighbors;
        self.maxMatches = params.maxMatches;
        self.sc = params.sc;
        self.rot = params.rot;
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
            rot = self.rot, scale = self.sc,
            thresh = self.threshold,
            scaleThresh = self.scaleThreshold,
            r, rl, ro, sc, tt, tw2, th2, tws, ths,
            m = im.length, n = tpl.length,
            mm = w*h, nn = tw*th, m4, score,
            maxMatches = self.maxMatches,
            maxOnly = self.maxMatchesOnly,
            returnAngle = self.returnAngle,
            minNeighbors = self.minNeighbors, eps = self.tolerance,
            k, x, y, x1, y1, x2, y2, xf, yf, sin, cos,
            sat1, sat2, rsat, rsat2, isTilted, isVertical,
            max, maxc, maxv, matches;

        if (1 === rot) rot = [0]; // only 1 given direction
        else if (4 === rot) rot = [0, 90, 180, 270]; // 4 cardinal directions
        else if (8 === rot) rot = [0, 45, 90, 135, 180, 225, 270, 315]; // 8 cardinal directions (max)

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

        if (metaData && (metaData.tmfilter_SAT/* || metaData.haarfilter_SAT*/))
        {
            sat1 = metaData.tmfilter_SAT//  || [metaData.haarfilter_SAT, metaData.haarfilter_SAT, metaData.haarfilter_SAT];
            sat2 = metaData.tmfilter_SAT2// || [metaData.haarfilter_SAT2,metaData.haarfilter_SAT2,metaData.haarfilter_SAT2];
            rsat = metaData.tmfilter_RSAT// || [metaData.haarfilter_RSAT,metaData.haarfilter_RSAT,metaData.haarfilter_RSAT];
            rsat2 = metaData.tmfilter_RSAT2;
        }
        else
        {
            sat1 = [new A32F(mm), new A32F(mm), new A32F(mm)];
            sat2 = [new A32F(mm), new A32F(mm), new A32F(mm)];
            rsat = [new A32F(mm), new A32F(mm), new A32F(mm)];
            rsat2 = [new A32F(mm), new A32F(mm), new A32F(mm)];
            sat(im, w, h, 2, 0, sat1[0], sat2[0], rsat[0], rsat2[0]); // R
            sat(im, w, h, 2, 1, sat1[1], sat2[1], rsat[1], rsat2[1]); // G
            sat(im, w, h, 2, 2, sat1[2], sat2[2], rsat[2], rsat2[2]); // B
            if (metaData)
            {
                metaData.tmfilter_SAT = sat1;
                metaData.tmfilter_SAT2 = sat2;
                metaData.tmfilter_RSAT = rsat;
                metaData.tmfilter_RSAT2 = rsat2;
            }
        }

        for (r=0,rl=rot.length; r<rl; ++r)
        {
            ro = rot[r];
            isTilted = 45 === ro || -45 === ro || 315 === ro || -315 === ro || 135 === ro || -135 === ro || 225 === ro || -225 === ro;
            isVertical = 90 === ro || -270 === ro || 270 === ro || -90 === ro;
            sin = stdMath.sin(ro*stdMath.PI/180); cos = stdMath.cos(ro*stdMath.PI/180);
            matches = [];
            for (sc=scale.min; sc<=scale.max; sc*=scale.inc)
            {
                tws = stdMath.round(sc*tw); ths = stdMath.round(sc*th);
                if (isVertical)
                {
                    tw2 = ths;
                    th2 = tws;
                }
                else
                {
                    tw2 = tws;
                    th2 = ths;
                }
                tt = scaleThresh ? scaleThresh(sc, ro) : thresh;
                max = new Array(mm); maxc = 0; maxv = -Infinity;
                for (k=(x1+y1*w)<<2,m4=((x2+y2*w)<<2)+4,x=x1,y=y1; k<m4; k+=4,++x)
                {
                    if (x > x2) {x=x1; ++y;}
                    if (x + tw2 <= x2 && y + th2 <= y2)
                    {
                        score = (is_grayscale ?
                        ncc(x, y, sat1[0], sat2[0], rsat[0], rsat2[0], tpldata['avg'][0],  tpldata['var'][0], tpldata.basis[0], w, h, tw, th, sc, ro)   // R
                        : ((
                        ncc(x, y, sat1[0], sat2[0], rsat[0], rsat2[0], tpldata['avg'][0], tpldata['var'][0], tpldata.basis[0], w, h, tw, th, sc, ro) + // R
                        ncc(x, y, sat1[1], sat2[1], rsat[1], rsat2[1], tpldata['avg'][1], tpldata['var'][1], tpldata.basis[1], w, h, tw, th, sc, ro) + // G
                        ncc(x, y, sat1[2], sat2[2], rsat[2], rsat2[2], tpldata['avg'][2], tpldata['var'][2], tpldata.basis[2], w, h, tw, th, sc, ro)   // B
                        ) / 3));
                        if (score >= tt)
                        {
                            if (maxOnly && (score < maxv)) continue;
                            if (score > maxv)
                            {
                                maxv = score;
                                if (maxOnly) maxc = 0; // reset for new max if maxOnly, else append this one as well
                            }
                            max[maxc++] = rect(x, y, tws, ths, returnAngle, isVertical, isTilted, sin, cos);
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
                matches = FilterUtil.merge_features(matches, minNeighbors, eps);
                if (returnAngle) matches.forEach(function(match) {match.angle = ro;});
                all_matches.push.apply(all_matches, matches);
            }
        }

        max = null; sat1 = sat2 = rsat = rsat2 = null;
        return im;
    }
});
function ncc(x, y, sat1, sat2, rsat1, rsat2, avgt, vart, basis, w, h, tw, th, sc, rot)
{
    // normalized cross-correlation at point (x,y)
    var tws0 = stdMath.round(sc*tw), ths0 = stdMath.round(sc*th), tws = tws0, ths = ths0,
        area, area2, sw, sh, t, x0, y0, x1, y1, bk, k, K = basis.length,
        sum1, sum2, diff, avgf, varf, /*vart,*/ varft,
        is_vertical = 90 === rot || -270 === rot || 270 === rot || -90 === rot,
        is_tilted = 45 === rot || -45 === rot || 315 === rot || -315 === rot || 135 === rot || -135 === rot || 225 === rot || -225 === rot;
    if (is_vertical)
    {
        // swap x/y
        tws = ths0;
        ths = tws0;
    }
    area = tws0*ths0;
    if (is_tilted)
    {
        sum1 = rsatsum(rsat1, w, h, x, y, tws0, ths0);
        sum2 = rsatsum(rsat2, w, h, x, y, tws0, ths0);
    }
    else
    {
        sum1 = satsum(sat1, w, h, x, y, x+tws-1, y+ths-1);
        sum2 = satsum(sat2, w, h, x, y, x+tws-1, y+ths-1);
    }
    avgf = sum1/area;
    varf = stdMath.abs(sum2-sum1*avgf);
    if (1 >= K)
    {
        return varf < 1e-3 ? (stdMath.abs(avgf - avgt) < 0.5 ? 1 : 0) : 0;
    }
    else
    {
        if (varf < 1e-3) return 0;
        varft = 0; //vart = 0;
        for (k=0; k<K; ++k)
        {
            bk = basis[k];
            // up to 8 cardinal rotations supported (ie matches every 45 deg)
            if (270 === rot || -90 === rot)
            {
                x0 = bk.y0;
                y0 = bk.x0;
                x1 = bk.y1;
                y1 = bk.x1;
            }
            else if (180 === rot || -180 === rot)
            {
                x0 = tw-1-bk.x1;
                y0 = th-1-bk.y1;
                x1 = tw-1-bk.x0;
                y1 = th-1-bk.y0;
            }
            else if (90 === rot || -270 === rot)
            {
                x0 = th-1-bk.y1;
                y0 = tw-1-bk.x1;
                x1 = th-1-bk.y0;
                y1 = tw-1-bk.x0;
            }
            else if (-45 === rot || 315 === rot)
            {
                x0 = bk.x0;
                y0 = th-1-bk.y1;
                x1 = bk.x1;
                y1 = th-1-bk.y0;
            }
            else if (-135 === rot || 225 === rot)
            {
                x0 = bk.y0;
                y0 = tw-1-bk.x1;
                x1 = bk.y1;
                y1 = tw-1-bk.x0;
            }
            else if (-225 === rot || 135 === rot)
            {
                x0 = tw-1-bk.x1;
                y0 = bk.y0;
                x1 = tw-1-bk.x0;
                y1 = bk.y1;
            }
            else if (-315 === rot || 45 === rot)
            {
                x0 = th-1-bk.y1;
                y0 = bk.x0;
                x1 = th-1-bk.y0;
                y1 = bk.x1;
            }
            else // 0, 360, -360, ..
            {
                x0 = bk.x0;
                y0 = bk.y0;
                x1 = bk.x1;
                y1 = bk.y1;
            }
            x0 = stdMath.round(sc*x0);
            y0 = stdMath.round(sc*y0);
            x1 = stdMath.round(sc*x1);
            y1 = stdMath.round(sc*y1);
            sw = x1-x0+1;
            sh = y1-y0+1;
            area2 = sw*sh;
            diff = bk.k-avgt;
            varft += diff*((is_tilted ? rsatsum(rsat1, w, h, x+x0, y+y0, sw, sh) : satsum(sat1, w, h, x+x0, y+y0, x+x1, y+y1)) - avgf*area2);
            //vart += diff*diff*area2;
        }
        vart *= area;
        return stdMath.min(stdMath.max(stdMath.abs(varft)/stdMath.sqrt(vart*varf), 0), 1);
    }
}
function rect(x, y, w, h, with_angle, is_vertical, is_tilted, sin, cos)
{
    if (with_angle)
    {
        return {x:x, y:y, width:w, height:h};
    }
    else if (is_tilted)
    {
        var dx = stdMath.abs(cos*w + sin*h - w)/2, dy = stdMath.abs(-sin*w + cos*h - h)/2;
        return {x:x-dx/2, y:y-dy/2, width:w+dx, height:h+dy};
    }
    else if (is_vertical)
    {
        return {x:x, y:y, width:h, height:w};
    }
    else
    {
        return {x:x, y:y, width:w, height:h};
    }
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
    b = [{k:satsum(s, w, h, 0, 0, w-1, h-1)/n,x0:0,y0:0,x1:w-1,y1:h-1}];
    bk = b[0];
    Jmax *= 255*255; J = 0;
    for (p=0; p<l; p+=4) {v = (t[p+c]-bk.k); J += v*v/n;}
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