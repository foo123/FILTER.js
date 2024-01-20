/**
*
* TemplateMatcher
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var MODE = FILTER.MODE, GLSL = FILTER.Util.GLSL, FilterUtil = FILTER.Util.Filter,
    sat = FilterUtil.sat, satsum = FilterUtil.satsum,
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
        var self = this, tpldata = self.tpldata(true), t = self.input("template");

        self.meta = {matches: []};
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
            maxMatches = self.maxMatches, maxOnly = self.maxMatchesOnly,
            sat1, sat2, matches = [], max, maxc, maxv,
            k, x, y, x1, y1, x2, y2, xf, yf;

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

        if (metaData && ((metaData.tmfilter_SAT && metaData.tmfilter_SAT2) || (metaData.haarfilter_SAT && metaData.haarfilter_SAT2)))
        {
            sat1 = metaData.tmfilter_SAT || [metaData.haarfilter_SAT,metaData.haarfilter_SAT,metaData.haarfilter_SAT];
            sat2 = metaData.tmfilter_SAT2 || [metaData.haarfilter_SAT2,metaData.haarfilter_SAT2,metaData.haarfilter_SAT2];
        }
        else
        {
            sat1 = [new A32F(mm), new A32F(mm), new A32F(mm)];
            sat2 = [new A32F(mm), new A32F(mm), new A32F(mm)];
            sat(im, w, h, 2, 0, sat1[0], sat2[0]); // R
            sat(im, w, h, 2, 1, sat1[1], sat2[1]); // G
            sat(im, w, h, 2, 2, sat1[2], sat2[2]); // B
            if (metaData)
            {
                metaData.tmfilter_SAT = sat1;
                metaData.tmfilter_SAT2 = sat2;
            }
        }

        for (r=0,rl=rot.length; r<rl; ++r)
        {
            ro = rot[r];
            if (90 === ro || -270 === ro || 270 === ro || -90 === ro)
            {
                // swap x/y
                tw2 = th;
                th2 = tw;
            }
            else
            {
                tw2 = tw;
                th2 = th;
            }
            for (sc=scale.min; sc<=scale.max; sc*=scale.inc)
            {
                tws = stdMath.round(sc*tw2); ths = stdMath.round(sc*th2);
                tt = scaleThresh ? scaleThresh(sc, ro) : thresh;
                max = new Array(mm); maxc = 0; maxv = -Infinity;
                for (k=(x1+y1*w)<<2,m4=((x2+y2*w)<<2)+4,x=x1,y=y1; k<m4; k+=4,++x)
                {
                    if (x > x2) {x=x1; ++y;}
                    if (x + tws <= x2 && y + ths <= y2)
                    {
                        score = (is_grayscale ?
                        ncc(x, y, sat1[0], sat2[0], tpldata.avg[0], tpldata.basis[0], w, h, tw, th, sc, ro)   // R
                        : ((
                        ncc(x, y, sat1[0], sat2[0], tpldata.avg[0], tpldata.basis[0], w, h, tw, th, sc, ro) + // R
                        ncc(x, y, sat1[1], sat2[1], tpldata.avg[1], tpldata.basis[1], w, h, tw, th, sc, ro) + // G
                        ncc(x, y, sat1[2], sat2[2], tpldata.avg[2], tpldata.basis[2], w, h, tw, th, sc, ro)   // B
                        ) / 3));
                        if (score >= tt)
                        {
                            if (maxOnly && (score < maxv)) continue;
                            if (score > maxv)
                            {
                                maxv = score;
                                if (maxOnly) maxc = 0; // reset for new max if maxOnly, else append this one as well
                            }
                            max[maxc++] = {x:x, y:y, width:tws, height:ths};
                        }
                    }
                }
                if (maxc && maxc < stdMath.min(maxMatches, mm)) // if not too many
                {
                    max.length = maxc;
                    matches.push.apply(matches, max);
                }
            }
        }

        self.meta = {matches: FilterUtil.merge_features(matches, self.minNeighbors, self.tolerance)};
        max = null; sat1 = null; sat2 = null;
        return im;
    }
});
function preprocess_tpl(t, w, h, Jmax, minSz, channel)
{
    var tr = 0, tg = 0, tb = 0, a, b,
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
        if (null != channel)
        {
            b[channel] = FilterUtil.tm_approximate(t, w, h, channel, Jmax, minSz);
        }
        else
        {
            b = [
            FilterUtil.tm_approximate(t, w, h, 0, Jmax, minSz),
            FilterUtil.tm_approximate(t, w, h, 1, Jmax, minSz),
            FilterUtil.tm_approximate(t, w, h, 2, Jmax, minSz)
            ];
        }
    }
    return {avg:a, basis:b||null};
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
function ncc(x, y, sat1, sat2, avgt, basis, w, h, tw, th, sc, rot)
{
    // normalized cross-correlation at point (x,y)
    var tws = stdMath.round(sc*tw), ths = stdMath.round(sc*th),
        area, t, x0, y0, x1, y1, bk, k, K = basis.length,
        sum1, sum2, diff, avgf, varf, vart = 0, varft = 0;
    if (90 === rot || -270 === rot || 270 === rot || -90 === rot)
    {
        // swap x/y
        t = tws;
        tws = ths;
        ths = t;
    }
    area = tws*ths;
    sum1 = satsum(sat1, w, h, x, y, x+tws-1, y+ths-1);
    sum2 = satsum(sat2, w, h, x, y, x+tws-1, y+ths-1);
    avgf = sum1/area;
    varf = stdMath.abs(sum2-sum1*avgf);
    if (1 >= K)
    {
        return varf < 1e-3 ? (stdMath.abs(avgf - avgt) < 0.5 ? 1 : 0) : 0;
    }
    else
    {
        for (k=0,K=basis.length; k<K; ++k)
        {
            bk = basis[k];
            // up to 4 cardinal rotations supported
            if (-90 === rot || 270 === rot)
            {
                x0 = bk.y0;
                y0 = bk.x0;
                x1 = bk.y1;
                y1 = bk.x1;
            }
            else if (180 === rot || -180 === rot)
            {
                x1 = tw-1-bk.x0;
                y1 = th-1-bk.y0;
                x0 = tw-1-bk.x1;
                y0 = th-1-bk.y1;
            }
            else if (-270 === rot || 90 === rot)
            {
                y1 = tw-1-bk.x0;
                x1 = th-1-bk.y0;
                y0 = tw-1-bk.x1;
                x0 = th-1-bk.y1;
            }
            else // 0, 360, -360
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
            diff = bk.k-avgt;
            vart += diff*diff*(x1-x0+1)*(y1-y0+1);
            varft += diff*satsum(sat1, w, h, x+x0, y+y0, x+x1, y+y1);
        }
        return varf < 1e-3 ? 0 : stdMath.min(stdMath.max(stdMath.abs(varft)/stdMath.sqrt(varf*vart), 0), 1);
    }
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