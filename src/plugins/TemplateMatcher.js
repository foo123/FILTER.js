/**
*
* TemplateMatcher
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var GLSL = FILTER.Util.GLSL, FilterUtil = FILTER.Util.Filter,
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
    ,sc: null
    ,rot: null
    ,threshold: 0.7
    ,tolerance: 0.2
    ,minNeighbors: 1
    ,_q: 0.98
    ,_s: 3
    ,_tpldata: null
    ,_draw: false

    ,init: function(tpl) {
        var self = this;
        self.sc = [1,1,1.1];
        self.rot = [0];
        if (tpl) self.setInput("template", tpl);
    }

    ,dispose: function() {
        var self = this;
        self._tpldata = null;
        self.$super('dispose');
        return self;
    }

    ,params: function(params) {
        var self = this;
        if (params)
        {
            if (null != params.threshold) self.thresh = params.threshold || 0;
            if (null != params.tolerance) self.tolerance = params.tolerance || 0;
            if (null != params.minNeighbors) self.minNeighbors = params.minNeighbors || 0;
            if (null != params.selection) self.selection = params.selection || null;
        }
        return self;
    }

    ,scales: function(sMin, sMax, sInc) {
        this.sc = [sMin, sMax, sInc];
        this._glsl = null;
        return this;
    }
    ,rotations: function(rot) {
        this.rot = rot || [0];
        this._glsl = null;
        return this;
    }
    ,quality: function(quality, size) {
        var self = this;
        quality = null == quality ? 0.98 : (quality || 0);
        size = null == size ? 2 : (size || 0);
        if (quality !== self._q || size !== self._s)
        {
            self._tpldata = null;
            self._q = quality;
            self._s = size;
        }
        return self;
    }

    ,tpldata: function(withBasis, channel) {
        var self = this, needsUpdate = self.isInputUpdated("template"), tpl = self.input("template");
        if (!tpl)
        {
            self._tpldata = null;
        }
        else if (withBasis)
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
            ,tolerance: self.tolerance
            ,minNeighbors: self.minNeighbors
            ,sc: self.sc
            ,rot: self.rot
            ,_q: self._q
            ,_s: self._s
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.threshold = params.threshold;
        self.tolerance = params.tolerance;
        self.minNeighbors = params.minNeighbors;
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

    ,getGLSL: function() {
        return glsl(this);
    }

    ,apply: function(im, w, h, metaData) {
        var self = this, tpldata = self.tpldata(true), t = self.input("template");

        self.meta = {matches:[]};
        if (!t || !tpldata) return im;

        var tpl = t[0], tw = t[1], th = t[2],
            selection = self.selection || null,
            rot = /*self.rot*/[0], scale = self.sc,
            r, rl, ro, sc, t, tw2, th2, tws, ths,
            m = im.length, n = tpl.length,
            mm = w*h, nn = tw*th, m4,
            tpldata, sat1, sat2, out, matches = [],
            k, x, y, x1, y1, x2, y2, xf, yf;

        if (self._draw)
        {
            self._update = true;
            for (var c=0; c<3; ++c)
            {
                for (var b=tpldata.basis[c],k=0,K=b.length; k<K; ++k)
                {
                    var bk = b[k];
                    for (y=bk.y0; y<=bk.y1; ++y)
                    {
                        for (x=bk.x0; x<=bk.x1; ++x)
                        {
                            im[(x + w*y)*4 + c] = bk.k;
                        }
                    }
                }
            }
            return im;
        }
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

        if (metaData && metaData.tmfilter_SAT1 && metaData.tmfilter_SAT2)
        {
            sat1 = metaData.tmfilter_SAT1;
            sat2 = metaData.tmfilter_SAT2;
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
                metaData.tmfilter_SAT1 = sat1;
                metaData.tmfilter_SAT2 = sat2;
            }
        }

        out = new A32F(mm);
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
            for (sc=scale[0]; sc<=scale[1]; sc*=scale[2])
            {
                tws = stdMath.round(sc*tw2); ths = stdMath.round(sc*th2);
                for (k=(x1+y1*w)<<2,m4=((x2+y2*w)<<2)+4,x=x1,y=y1; k<m4; k+=4,++x)
                {
                    if (x > x2) {x=x1; ++y;}
                    out[k>>>2] = 0;
                    if (x + tws <= x2 && y + ths <= y2)
                    {
                        out[k>>>2] = (
                        ncc(x, y, sat1[0], sat2[0], tpldata.avg[0], tpldata.basis[0], w, h, tw, th, sc, ro) + // R
                        ncc(x, y, sat1[1], sat2[1], tpldata.avg[1], tpldata.basis[1], w, h, tw, th, sc, ro) + // G
                        ncc(x, y, sat1[2], sat2[2], tpldata.avg[2], tpldata.basis[2], w, h, tw, th, sc, ro)   // B
                        ) / 3;
                    }
                }
                matches.push.apply(matches, FilterUtil.max(out, w, h, self.threshold).maxpos.map(function(p) {return {x:p.x, y:p.y, width:tws, height:ths};}));
                //console.log(matches.length, mm);
            }
        }

        self.meta = {matches: FilterUtil.merge_features(matches, self.minNeighbors, self.tolerance)};
        out = null; sat1 = null; sat2 = null;
        return im;
    }
});
function ncc(x, y, sat1, sat2, avg, basis, w, h, tw, th, sc, rot)
{
    var tws = stdMath.round(sc*tw), ths = stdMath.round(sc*th),
        area, t, k, K, bk, x0, y0, x1, y1,
        sum1 = 0, sum2 = 0, diff, nrg = 0, denom = 0, nom = 0;
    if (90 === rot || -270 === rot || 270 === rot || -90 === rot)
    {
        // swap x/y
        t = tws;
        tws = ths;
        ths = t;
    }
    for (k=0,K=basis.length; k<K; ++k)
    {
        bk = basis[k];
        // up to 4 cardinal rotations supported
        if (90 === rot || -270 === rot)
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
        else if (270 === rot || -90 === rot)
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
        diff = bk.k-avg;
        nom += diff*satsum(sat1, w, h, x+x0, y+y0, x+x1, y+y1);
        nrg += diff*diff*(x1-x0+1)*(y1-y0+1);
    }
    area = tws*ths;
    sum1 = satsum(sat1, w, h, x, y, x+tws-1, y+ths-1);
    sum2 = satsum(sat2, w, h, x, y, x+tws-1, y+ths-1);
    denom = stdMath.sqrt(stdMath.abs((sum2 - sum1*sum1/area)*nrg));
    return clamp(denom ? stdMath.abs(nom)/denom : 1, 0, 1);
}
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
            b[channel] = approximate(t, w, h, channel, Jmax, minSz);
        }
        else
        {
            b = [
            approximate(t, w, h, 0, Jmax, minSz),
            approximate(t, w, h, 1, Jmax, minSz),
            approximate(t, w, h, 2, Jmax, minSz)
            ];
        }
    }
    return {avg:a, basis:b||null};
}
function approximate(t, w, h, c, Jmax, minSz)
{
    var J, J2, Jmin, bmin,
        x0, x1, y0, y1, ww, hh, dobreak,
        x, y, xx, yy, yw, avg1, avg2,
        p, tp, l = t.length, n = w*h,
        s, v, k, K, b, bk, bb, done;
    sat(t, w, h, 2, c, s=new A32F(n));
    b = [{k:satsum(s, w, h, 0, 0, w-1, h-1)/n,x0:0,y0:0,x1:w-1,y1:h-1}];
    bk = b[0];
    Jmax *= 255*255; J = 0;
    for (p=0; p<l; p+=4) {v = (t[p+c]-bk.k); J += v*v/n;}
    while (J >= Jmax)
    {
        Jmin = J;
        bmin = b;
        K = b.length;
        dobreak = false;
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
                    dobreak = true; //break;
                }
            }
            //if (dobreak) break;
            for (y=bk.y0; y<bk.y1; ++y)
            {
                J2 = J;
                ww = bk.x1-bk.yx0+1;
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
                    dobreak = true; //break;
                }
            }
            //if (dobreak) break;
        }
        if (bmin === b) break;
        J = Jmin;
        b = bmin;
    }
    return b;
}
FilterUtil.approximate = approximate;
function glsl(filter)
{
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader(function(glsl, im) {
        var tpldata = filter.tpldata(), tpl = filter.input("template");
        filter.meta = {matches:[]};
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
    'uniform int rot;',
    'void main(void) {',
    '    vec2 tplSizeScaled = tplSize * sc;',
    '    if (pix.x < selection.x || pix.y < selection.y || pix.x > selection.z || pix.y > selection.w || pix.y*imgSize.y + tplSizeScaled.y > imgSize.y || pix.x*imgSize.x + tplSizeScaled.x > imgSize.x)',
    '    {',
    '        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
    '    }',
    '    else',
    '    {',
    '        int tplW = int(tplSizeScaled.x); int tplH = int(tplSizeScaled.y);',
    '        float N = tplSizeScaled.x*tplSizeScaled.y;',
    '        vec4 F; vec4 T;',
    '        vec3 avgF = vec3(0.0); /*vec3 avgT = vec3(0.0);*/',
    '        vec3 dF; vec3 dT;',
    '        vec3 sumFF = vec3(0.0); vec3 sumTT = vec3(0.0); vec3 sumFT = vec3(0.0);',
    '        float ii; float jj;',
    '        for (int i = 0; i < 1000; i++)',
    '        {',
    '            if (i >= tplH) break;',
    '            ii = float(i);',
    '            for (int j = 0; j < 1000; j++)',
    '            {',
    '                if (j >= tplW) break;',
    '                jj = float(j);',
    '                F = texture2D(img, pix + vec2(jj, ii) / imgSize);',
    '                /*T = texture2D(tpl, vec2(jj, ii) / tplSizeScaled);*/',
    '                avgF.rgb += F.rgb; /*avgT.rgb += T.rgb;*/',
    '            }',
    '        }',
    '        avgF /= N; /*avgT /= N;*/',
    '        for (int i = 0; i < 1000; i++)',
    '        {',
    '            if (i >= tplH) break;',
    '            ii = float(i);',
    '            for (int j = 0; j < 1000; j++)',
    '            {',
    '                if (j >= tplW) break;',
    '                jj = float(j);',
    '                F = texture2D(img, pix + vec2(jj, ii) / imgSize);',
    '                T = texture2D(tpl, vec2(jj, ii) / tplSizeScaled);',
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
    var rot = /*filter.rot*/[0];
    for (var r=0,rl=rot.length; r<rl; ++r)
    {
        for (var sc=filter.sc[0]; sc<=filter.sc[1]; sc*=filter.sc[2])
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
            .input('rot', rot[r])
            .end()
            .begin()
            .shader(function(glsl, im, w, h) {
                var io = glsl.io(), inputs = glsl._inputs,
                    sc = inputs.sc, rot = inputs.rot, t,
                    tw = io.tpl.width, th = io.tpl.height,
                    tws = stdMath.round(sc*tw), ths = stdMath.round(sc*th);
                if (90 === rot || -270 === rot || 270 === rot || -90 === rot)
                {
                    // swap x/y
                    t = tws;
                    tws = ths;
                    ths = t;
                }
                io.matches.push.apply(io.matches, FilterUtil.max(im, w, h, filter.threshold, 2, 0).maxpos.map(function(p) {return {x:p.x, y:p.y, width:tws, height:ths};}));
                //console.log(io.matches.length);
                return io.im;
            })
            .end();
        }
    }
    glslcode
    .begin()
    .shader(function(glsl, im, w, h) {
        filter.meta = {matches: FilterUtil.merge_features(glsl.io().matches, filter.minNeighbors, filter.tolerance)};
        return glsl.io().im;
    })
    .end();
    return glslcode.code();
}
}(FILTER);