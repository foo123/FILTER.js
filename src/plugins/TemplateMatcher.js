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
    ,qty: 0.95
    ,sz: 3
    ,scale: 1
    ,rotation: 0
    ,tpldata: null
    ,_draw: false

    ,init: function(tpl, quality, size, scale, rotation) {
        var self = this;
        if (tpl) self.setInput("template", tpl);
        self.qty = quality || 0.95;
        self.sz = size || 3;
        self.scale = scale || 1;
        self.rotation = rotation || 0;
    }

    ,dispose: function() {
        var self = this;
        self.tpldata = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
            qty: self.qty
            ,sz: self.sz
            ,scale: self.scale
            ,rotation: self.rotation
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.qty = params.qty;
        self.sz = params.sz;
        self.scale = params.scale;
        self.rotation = params.rotation;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,apply: function(im, w, h) {
        var self = this,
            needsUpdate = self.isInputUpdated("template"),
            t = self.input("template");
        self.meta = [];
        if (!t) return im;
        var tpl = t[0], tw = t[1], th = t[2],
            sc = self.scale, rot = self.rotation,
            tws = stdMath.round(sc*tw),
            ths = stdMath.round(sc*th),
            m = im.length, n = tpl.length,
            mm = w*h, nn = tw*th,
            tpldata, sat1, sat2, out,
            k, x, y;

        if (needsUpdate || !self.tpldata) self.tpldata = process_template(tpl, tw, th, 1-self.qty, self.sz);

        tpldata = self.tpldata;
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
                      nccorr(x, y, sat1[0], sat2[0], tpldata.basis[0], w, h, tw, th, sc, rot) // R
                    + nccorr(x, y, sat1[1], sat2[1], tpldata.basis[1], w, h, tw, th, sc, rot) // G
                    + nccorr(x, y, sat1[2], sat2[2], tpldata.basis[2], w, h, tw, th, sc, rot) // B
                    );
                }
            }

            self.meta = minmax(out, w, h).maxpos.map(function(p) {return {x:p.x, y:p.y, width:tws, height:ths};});
            out = null; sat1 = null; sat2 = null;
        }
        return im;
    }
});
function preprocessTemplate(tplImg, quality, minsize, channel)
{
    var tpl = tplImg.getSelectedData(1);
    return process_template(tpl[0], tpl[1], tpl[2], 1.0 - (quality || 0.95), minsize || 3, channel);
}
function nccorr(x, y, sat1, sat2, basis, w, h, tw, th, sc, rot)
{
    var tws = stdMath.round(sc*tw),
        ths = stdMath.round(sc*th),
        area = tws*ths,
        x0 = clamp(x-1, 0, w-1),
        x1 = clamp(x0+tws, 0, w-1),
        y0 = clamp(y-1, 0, h-1),
        y1 = clamp(y0+ths, 0, h-1),
        wy0 = w*y0, wy1 = w*y1,
        k, K, bk,
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
/*function nrg(basis, avg, sc, rot)
{
    var n = 0, k, K, bk;
    for (k=0,K=basis.length; k<K; ++k)
    {
        bk = basis[k];
        n += (bk.k-avg) * (stdMath.round(sc*bk.x1)-stdMath.round(sc*bk.x0)+1) * (stdMath.round(sc*bk.y1)-stdMath.round(sc*bk.y0)+1);
    }
    n = n*n;
    return stdMath.max(n, 1e-3);
}*/
function process_template(t, w, h, Jmax, minSz, channel)
{
    var sc = 1, rot = 0;
    var tr = 0, tg = 0, tb = 0,
        basis = [[], [], []], avg,
        sw = stdMath.round(sc*w),
        sh = stdMath.round(sc*h),
        n = sw*sh, p, x, y;
    for (y=0; y<sh; ++y)
    {
        for (x=0; x<sw; ++x)
        {
            p = (((x/sc)|0) + ((y/sc)|0) * w) << 2;
            tr += t[p  ] / n;
            tg += t[p+1] / n;
            tb += t[p+2] / n;
        }
    }
    avg = [tr, tg, tb];
    if (null != channel)
    {
        basis[channel] = approximate(t, avg[channel], w, h, channel, [{k:avg[channel],x0:0,x1:sw-1,y0:0,y1:sh-1}], Jmax, minSz);
    }
    else
    {
        basis = [
        approximate(t, tr, w, h, 0, [{k:tr,x0:0,x1:sw-1,y0:0,y1:sh-1}], Jmax, minSz),
        approximate(t, tg, w, h, 1, [{k:tg,x0:0,x1:sw-1,y0:0,y1:sh-1}], Jmax, minSz),
        approximate(t, tb, w, h, 2, [{k:tb,x0:0,x1:sw-1,y0:0,y1:sh-1}], Jmax, minSz)
        ];
    }
    return {avg:avg, basis:basis};
}
function cost(t, tm, w, h, c, b)
{
    var sc = 1;
    var J = 0, x, y, p,
        sw = stdMath.round(sc*w),
        sh = stdMath.round(sc*h),
        n = sw*sh,
        v, k, K = b.length, bk;
    for (y=0; y<sh; ++y)
    {
        for (x=0; x<sw; ++x)
        {
            p = (((x/sc)|0) + ((y/sc)|0) * w) << 2;
            v = (t[p+c]/*- tm*/) / 255;
            for (k=0; k<K; ++k)
            {
                bk = b[k];
                if (bk.x0 <= x && bk.x1 >= x && bk.y0 <= y && bk.y1 >= y)
                    v -= bk.k / 255;
            }
            J += v*v / n;
        }
    }
    return J;
}
function avg(t, c, w, h, x0, x1, y0, y1)
{
    var sc = 1;
    var tm = 0, x, y, n = (x1-x0+1)*(y1-y0+1);
    for (y=y0; y<=y1; ++y) for (x=x0; x<=x1; ++x) tm += t[((((x/sc)|0) + ((y/sc)|0) * w) << 2) + c] / n;
    return tm;
}
function approximate(t, tm, w, h, c, b, Jmax, minSz)
{
    var sc = 1;
    var J = cost(t, tm, w, h, c, b), Jmin, x, y, k, K, bk, bb, bmin;
    while (J > Jmax)
    {
        Jmin = J;
        bmin = b;
        K = b.length;
        for (k=0; k<K; ++k)
        {
            bk = b[k];
            if (minSz >= bk.x1 - bk.x0 + 1 && minSz >= bk.y1 - bk.y0 + 1) continue;
            //if (bk.x1 - bk.x0 >= bk.y1 - bk.y0)
            {
                //x = (bk.x0 + bk.x1) >>> 1;
                for (x=bk.x0+1; x+1<bk.x1; ++x)
                {
                bb = b.slice(0, k);
                bb.push({k:avg(t, c, w, h, bk.x0, x, bk.y0, bk.y1), x0:bk.x0, x1:x, y0:bk.y0, y1:bk.y1});
                bb.push({k:avg(t, c, w, h, x+1, bk.x1, bk.y0, bk.y1), x0:x+1, x1:bk.x1, y0:bk.y0, y1:bk.y1});
                bb.push.apply(bb, b.slice(k+1));
                J = cost(t, tm, w, h, c, bb);
                if (J < Jmin)
                {
                    Jmin = J;
                    bmin = bb;
                }
                }
            }
            //else if (bk.x1 - bk.x0 < bk.y1 - bk.y0)
            {
                //y = (bk.y0 + bk.y1) >>> 1;
                for (y=bk.y0+1; y+1<bk.y1; ++y)
                {
                bb = b.slice(0, k);
                bb.push({k:avg(t, c, w, h, bk.x0, bk.x1, bk.y0, y), x0:bk.x0, x1:bk.x1, y0:bk.y0, y1:y});
                bb.push({k:avg(t, c, w, h, bk.x0, bk.x1, y+1, bk.y1), x0:bk.x0, x1:bk.x1, y0:y+1, y1:bk.y1});
                bb.push.apply(bb, b.slice(k+1));
                J = cost(t, tm, w, h, c, bb);
                if (J < Jmin)
                {
                    Jmin = J;
                    bmin = bb;
                }
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
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform sampler2D tpl;',
    'uniform vec2 imgSize;',
    'uniform vec2 tplSize;',
    'uniform float scale;',
    'void main(void) {',
    '    vec2 tplSizeScaled = tplSize * scale;',
    '    if (pix.y*imgSize.y + tplSizeScaled.y > imgSize.y || pix.x*imgSize.x + tplSizeScaled.x > imgSize.x)',
    '    {',
    '        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);',
    '    }',
    '    else',
    '    {',
    '        float sumR = 0.0;',
    '        float sumG = 0.0;',
    '        float sumB = 0.0;',
    '        float ii = 0.0;',
    '        float jj = 0.0;',
    '        int tplW = int(tplSizeScaled.x);',
    '        int tplH = int(tplSizeScaled.y);',
    '        for (int i = 0; i < 1000; i++)',
    '        {',
    '            if (i >= tplH) break;',
    '            ii = float(i);',
    '            for (int j = 0; j < 1000; j++)',
    '            {',
    '                if (j >= tplW) break;',
    '                jj = float(j);',
    '                vec4 I = texture2D(img, pix + vec2(jj, ii) / imgSize);',
    '                vec4 T = texture2D(tpl, vec2(jj, ii) / tplSizeScaled);',
    '                float diffR = T.r - I.r;',
    '                float diffG = T.g - I.g;',
    '                float diffB = T.b - I.b;',
    '                sumR += diffR * diffR;',
    '                sumG += diffG * diffG;',
    '                sumB += diffB * diffB;',
    '            }',
    '        }',
    '        float v = (sumR + sumG + sumB) / (3.0*255.0);',
    '        gl_FragColor = vec4(v, v, v, 1.0);',
    '    }',
    '}'
    ].join('\n'))
    .save('im')
    .input('tpl', function(filter) {
        var tpl = filter.input("template");
        return {data:tpl[0], width:tpl[1], height:tpl[2]};
    })
    .input('tplSize', function(filter, w, h, w2, h2, io) {
        var tpl = filter.input("template");
        return io.tplSize = [tpl[1], tpl[2]];
    })
    .input('imgSize', function(filter, w, h) {
        return [w, h];
    })
    .input('scale', function(filter) {return filter.scale;})
    .end()
    .begin()
    .shader(function(glsl, im, w, h) {
        var sz = glsl.io().tplSize,
            tsw = stdMath.round(glsl.instance.scale*sz[0]),
            tsh = stdMath.round(glsl.instance.scale*sz[1]);
        filter.meta = minmax(im, w, h, null, null, 4, 0).minpos.map(function(p) {return {x:p.x, y:p.y, width:tsw, height:tsh};});
        return glsl.io()['im'].data;//im;
    })
    .end();
    return glslcode.code();
}
FILTER.TemplateMatcherFilter.preprocessTemplate = preprocessTemplate;
}(FILTER);