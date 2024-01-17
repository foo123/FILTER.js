/**
*
* TemplateMatcher
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var GLSL = FILTER.Util.GLSL, FilterUtil = FILTER.Util.Filter,
    sat = FilterUtil.sat, minmax = FilterUtil.minmaxloc,
    stdMath = Math, clamp = FILTER.Util.Math.clamp,
    A32F = FILTER.Array32F;

// Template matching using fast normalized cross correlation, Briechle, Hanebeck, 2001
// https://www.semanticscholar.org/paper/Template-matching-using-fast-normalized-cross-Briechle-Hanebeck/3632776737dc58adf0e278f9a7cafbeb6c1ec734)
FILTER.Create({
    name : "TemplateMatcherFilter"

    ,path: FILTER.Path

    ,_update: false // filter by itself does not alter image data, just processes information
    ,hasMeta: true
    ,hasInputs: true
    ,scale: 1
    ,rotation: 0
    ,_q: 0.98
    ,_s: 3
    ,_tpldata: null
    ,_draw: false

    ,init: function(tpl, scale, rotation) {
        var self = this;
        if (tpl) self.setInput("template", tpl);
        self.scale = scale || 1;
        self.rotation = rotation || 0;
    }

    ,dispose: function() {
        var self = this;
        self._tpldata = null;
        self.$super('dispose');
        return self;
    }

    ,quality: function(quality, size) {
        var self = this;
        self._q = null == quality ? 0.98 : (quality || 0);
        self._s = null == size ? 3 : (size || 0);
        self._tpldata = null;
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
             scale: self.scale
            ,rotation: self.rotation
            ,_q: self._q
            ,_s: self._s
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.scale = params.scale;
        self.rotation = params.rotation;
        self._q = params._q;
        self._s = params._s;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,apply: function(im, w, h) {
        var self = this, tpldata = self.tpldata(true), t = self.input("template");

        self.meta = [];
        if (!t || !tpldata) return im;

        var tpl = t[0], tw = t[1], th = t[2],
            sc = self.scale, rot = self.rotation,
            tws = stdMath.round(sc*tw),
            ths = stdMath.round(sc*th),
            m = im.length, n = tpl.length,
            mm = w*h, nn = tw*th,
            tpldata, sat1, sat2, out,
            k, x, y;

        if (self._draw)
        {
            self._update = true;
            for (var c=0; c<3; ++c)
            {
                var bb = tpldata.basis[c];
                for (var k=0,K=bb.length; k<K; ++k)
                {
                    var bk = bb[k];
                    for (var yk=bk.y0,wyk=w*yk; yk<bk.y1; ++yk,wyk+=w)
                    {
                        for (var xk=bk.x0; xk<bk.x1; ++xk)
                        {
                            im[((xk + wyk) << 2) + c] = bk.k;
                        }
                    }
                }
            }
        }
        else
        {
            self._update = false;
            out = new A32F(mm);
            sat1 = [new A32F(mm), new A32F(mm), new A32F(mm)];
            sat2 = [new A32F(mm), new A32F(mm), new A32F(mm)];
            sat(im, w, h, 2, 0, sat1[0], sat2[0]); // R
            sat(im, w, h, 2, 1, sat1[1], sat2[1]); // G
            sat(im, w, h, 2, 2, sat1[2], sat2[2]); // B

            for (k=0,x=0,y=0; k<m; k+=4,++x)
            {
                if (x >= w) {x=0; ++y;}
                if (x + tws >= w || y + ths >= h)
                {
                    out[k>>>2] = 0;
                }
                else
                {
                    out[k>>>2] = (
                      ncc(x, y, sat1[0], sat2[0], tpldata.basis[0], w, h, tw, th, sc, rot) // R
                    + ncc(x, y, sat1[1], sat2[1], tpldata.basis[1], w, h, tw, th, sc, rot) // G
                    + ncc(x, y, sat1[2], sat2[2], tpldata.basis[2], w, h, tw, th, sc, rot) // B
                    );
                }
            }

            self.meta = minmax(out, w, h).maxpos.map(function(p) {return {x:p.x, y:p.y, width:tws, height:ths};});
            out = null; sat1 = null; sat2 = null;
        }
        return im;
    }
});
function ncc(x, y, sat1, sat2, basis, w, h, tw, th, sc, rot)
{
    var tws = stdMath.round(sc*tw),
        ths = stdMath.round(sc*th),
        //area = tws*ths,
        k, K, bk,
        x0 = clamp(x-1, 0, w-1),
        x1 = clamp(x0+tws, 0, w-1),
        y0 = clamp(y-1, 0, h-1),
        y1 = clamp(y0+ths, 0, h-1),
        wy0 = w*y0, wy1 = w*y1,
        sum1 = sat1[x1 + wy1] - sat1[x0 + wy1] - sat1[x1 + wy0] + sat1[x0 + wy0],
        sum2 = sat2[x1 + wy1] - sat2[x0 + wy1] - sat2[x1 + wy0] + sat2[x0 + wy0],
        denom = stdMath.sqrt(stdMath.abs(sum2 - sum1*sum1)/* / area*/) /** (nrg)*/, // template energy is constant, can be left out
        nom = 0;
    for (k=0,K=basis.length; k<K; ++k)
    {
        bk = basis[k];
        x0 = clamp(x-1+stdMath.round(sc*bk.x0), 0, w-1);
        x1 = clamp(x+stdMath.round(sc*bk.x1), 0, w-1);
        y0 = clamp(y-1+stdMath.round(sc*bk.y0), 0, h-1);
        y1 = clamp(y+stdMath.round(sc*bk.y1), 0, h-1);
        wy0 = w*y0; wy1 = w*y1;
        nom += bk.k * (sat1[x1 + wy1] - sat1[x1 + wy0] - sat1[x0 + wy1] + sat1[x0 + wy0]);
    }
    return (nom / denom);
}
function preprocess_tpl(t, w, h, Jmax, minSz, channel)
{
    var tr = 0, tg = 0, tb = 0, a, b, s,
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
        s = [null, null, null];
        if (null != channel)
        {
            sat(t, w, h, 2, channel, s[channel] = new A32F(n));
            b[channel] = approximate(t, s[channel], [{k:a[channel],x0:0,x1:w-1,y0:0,y1:h-1}], w, h, channel, Jmax, minSz);
        }
        else
        {
            sat(t, w, h, 2, 0, s[0] = new A32F(n));
            sat(t, w, h, 2, 1, s[1] = new A32F(n));
            sat(t, w, h, 2, 2, s[2] = new A32F(n));
            b = [
            approximate(t, s[0], [{k:a[0],x0:0,x1:w-1,y0:0,y1:h-1}], w, h, 0, Jmax, minSz),
            approximate(t, s[1], [{k:a[1],x0:0,x1:w-1,y0:0,y1:h-1}], w, h, 1, Jmax, minSz),
            approximate(t, s[2], [{k:a[2],x0:0,x1:w-1,y0:0,y1:h-1}], w, h, 2, Jmax, minSz)
            ];
        }
    }
    return {avg:a, basis:b||null, sat:s||null};
}
function approximate(t, s, b, w, h, c, Jmax, minSz)
{
    var J = 0, J2, Jmin, bmin,
        x0, x1, y0, y1, ww, hh,
        x, y, xx, yy, yw, avg1, avg2,
        p, l = t.length, n = w*h,
        v, k, K = b.length, bk, bb;
    for (p=0,x=0,y=0; p<l; p+=4,++x)
    {
        if (x >= w) {x=0; ++y;}
        v = t[p+c] / 255;
        for (k=0; k<K; ++k)
        {
            bk = b[k];
            if (bk.x0 <= x && bk.x1 >= x && bk.y0 <= y && bk.y1 >= y)
                v -= bk.k / 255;
        }
        J += v*v / n;
    }
    while (J > Jmax)
    {
        Jmin = J;
        bmin = b;
        K = b.length;
        for (k=0; k<K; ++k)
        {
            bk = b[k];
            if (minSz >= bk.x1 - bk.x0 + 1 && minSz >= bk.y1 - bk.y0 + 1) continue;
            for (x=bk.x0+1; x+1<bk.x1; ++x)
            {
                J2 = J;
                hh = bk.y1-bk.y0+1;
                y0 = clamp(bk.y0-1, 0, bk.y1);
                y1 = clamp(bk.y1, 0, bk.y1);
                x0 = clamp(bk.x0-1, 0, bk.x1);
                x1 = clamp(x, 0, bk.x1);
                ww = x-bk.x0+1;
                avg1 = (s[x1 + w*y1] - s[x1 + w*y0] - s[x0 + w*y1] + s[x0 + w*y0]) / (ww*hh);
                x0 = clamp(x, 0, bk.x1);
                x1 = clamp(bk.x1, 0, bk.x1);
                ww = bk.x1-(x+1)+1;
                avg2 = (s[x1 + w*y1] - s[x1 + w*y0] - s[x0 + w*y1] + s[x0 + w*y0]) / (ww*hh);
                for (xx=bk.x0; xx<=x; ++xx)
                {
                    for (yy=bk.y0,yw=yy*w; yy<=bk.y1; ++yy,yw+=w)
                    {
                        p = (x + yw) << 2;
                        v = (t[p+c] - bk.k)/255;
                        J2 -= v*v/n;
                        v = (t[p+c] - avg1)/255;
                        J2 += v*v/n;
                    }
                }
                for (xx=x+1; xx<=bk.x1; ++xx)
                {
                    for (yy=bk.y0,yw=yy*w; yy<=bk.y1; ++yy,yw+=w)
                    {
                        p = (x + yw) << 2;
                        v = (t[p+c] - bk.k)/255;
                        J2 -= v*v/n;
                        v = (t[p+c] - avg2)/255;
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
            for (y=bk.y0+1; y+1<bk.y1; ++y)
            {
                J2 = J;
                ww = bk.x1-bk.yx0+1;
                x0 = clamp(bk.x0-1, 0, bk.x1);
                x1 = clamp(bk.x1, 0, bk.x1);
                y0 = clamp(bk.y0-1, 0, bk.y1);
                y1 = clamp(y, 0, bk.y1);
                hh = y-bk.y0+1;
                avg1 = (s[x1 + w*y1] - s[x1 + w*y0] - s[x0 + w*y1] + s[x0 + w*y0]) / (ww*hh);
                y0 = clamp(y, 0, bk.y1);
                y1 = clamp(bk.y1, 0, bk.y1);
                hh = bk.y1-(y+1)+1;
                avg2 = (s[x1 + w*y1] - s[x1 + w*y0] - s[x0 + w*y1] + s[x0 + w*y0]) / (ww*hh);
                for (yy=bk.y0,yw=yy*w; yy<=y; ++yy,yw+=w)
                {
                    for (xx=bk.x0; xx<=bk.x1; ++xx)
                    {
                        p = (x + yw) << 2;
                        v = (t[p+c] - bk.k)/255;
                        J2 -= v*v/n;
                        v = (t[p+c] - avg1)/255;
                        J2 += v*v/n;
                    }
                }
                for (yy=y+1,yw=yy*w; yy<=bk.y1; ++yy,yw+=w)
                {
                    for (xx=bk.x0; xx<=bk.x1; ++xx)
                    {
                        p = (x + yw) << 2;
                        v = (t[p+c] - bk.k)/255;
                        J2 -= v*v/n;
                        v = (t[p+c] - avg2)/255;
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
        }
        if (bmin === b) break;
        J = Jmin;
        b = bmin;
    }
    return b;
}
function glsl(filter)
{
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader(function(glsl, im) {
        var tpldata = filter.tpldata(), tpl = filter.input("template");
        filter.meta = [];
        glsl.io().im = im;
        glsl.io().tpl = {data:tpl[0], width:tpl[1], height:tpl[2]};
        glsl.io().avgT = [tpldata.avg[0]/255, tpldata.avg[1]/255, tpldata.avg[2]/255];
        return im;
    })
    .end()
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform sampler2D tpl;',
    'uniform vec2 imgSize;',
    'uniform vec2 tplSize;',
    'uniform vec3 avgT;',
    'uniform float scale;',
    'uniform float rotation;',
    'void main(void) {',
    '    vec2 tplSizeScaled = tplSize * scale;',
    '    if (pix.y*imgSize.y + tplSizeScaled.y > imgSize.y || pix.x*imgSize.x + tplSizeScaled.x > imgSize.x)',
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
    ].join('\n'))
    .input('tpl', function(filter, w, h, w2, h2, io) {
        return io.tpl;
    })
    .input('imgSize', function(filter, w, h) {
        return [w, h];
    })
    .input('tplSize', function(filter, w, h, w2, h2, io) {
        return [io.tpl.width, io.tpl.height];
    })
    .input('avgT', function(filter, w, h, w2, h2, io) {
        return io.avgT;
    })
    .input('scale', function(filter) {return filter.scale || 1;})
    .input('rotation', function(filter) {return filter.rotation || 0;})
    .end()
    .begin()
    .shader(function(glsl, im, w, h) {
        var tw = glsl.io().tpl.width, th = glsl.io().tpl.height,
            tws = stdMath.round(filter.scale*tw),
            ths = stdMath.round(filter.scale*th);
        filter.meta = minmax(im, w, h, null, null, 4, 0).maxpos.map(function(p) {return {x:p.x, y:p.y, width:tws, height:ths};});
        return glsl.io().im;
    })
    .end();
    return glslcode.code();
}
}(FILTER);