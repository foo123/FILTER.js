/**
*
* TemplateMatcher
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var GLSL = FILTER.Util.GLSL, FilterUtil = FILTER.Util.Filter,
    A32F = FILTER.Array32F, stdMath = Math;

// https://docs.opencv.org/4.9.0/d4/dc6/tutorial_py_template_matching.html
var TemplateMatcherFilter = FILTER.Create({
    name : "TemplateMatcherFilter"

    ,path: FILTER.Path

    ,_update: false // filter by itself does not alter image data, just processes information
    ,hasMeta: true
    ,hasInputs: true
    ,scale: 1
    ,dist: 0

    ,init: function(tpl, scale, dist) {
        var self = this;
        if (tpl) self.setInput("template", tpl);
        self.scale = scale || 1;
        self.dist = dist || 0;
    }

    ,serialize: function() {
        var self = this;
        return {
             scale: self.scale
            ,dist: self.dist
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.scale = params.scale;
        self.dist = params.dist;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,apply: function(im, w, h) {
        var self = this, t = self.input("template");
        self.meta = [];
        if (!t) return im;
        var tpl = t[0], tw = t[1], th = t[2],
            m = im.length, n = tpl.length,
            k, l, p, sc = self.scale,
            tsw = stdMath.round(sc*tw),
            tsh = stdMath.round(sc*th),
            out = new A32F(w*h),
            sumR, sumG, sumB,
            diffR, diffG, diffB,
            x, y, xx, yy, v;

        for (k=0,x=0,y=0; k<m; k+=4,++x)
        {
            if (x >= w) {x=0; ++y;}
            if (x + tsw >= w || y + tsh >= h)
            {
                out[k>>>2] = 1;
            }
            else
            {
                sumR=sumG=sumB=0;
                for (yy=0,xx=0; yy<tsh; ++xx)
                {
                    if (xx >= tsw) {xx=0; ++yy; if (yy>=tsh) break;}
                    l = (((xx/sc)|0) + ((yy/sc)|0) * tw) << 2;
                    p = (x+xx + (y+yy)*w) << 2;
                    diffR = (tpl[l  ] - im[p  ])/255;
                    diffG = (tpl[l+1] - im[p+1])/255;
                    diffB = (tpl[l+2] - im[p+2])/255;
                    sumR += diffR * diffR;
                    sumG += diffG * diffG;
                    sumB += diffB * diffB;
                }
                v = (sumR + sumG + sumB) / (3*255);
                out[k>>>2] = v;
            }
        }

        self.meta = FilterUtil.minmaxloc(out, w, h).minpos.map(function(p) {return {x:p.x, y:p.y, width:tsw, height:tsh};});
        return im;
    }
});
TemplateMatcherFilter.SQDIFF = 0;
TemplateMatcherFilter.SQDIFF_NORMED = 1;
TemplateMatcherFilter.CCORR = 2;
TemplateMatcherFilter.CCORR_NORMED = 3;
TemplateMatcherFilter.CCOEFF = 4;
TemplateMatcherFilter.CCOEFF_NORMED = 5;

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
    'uniform int dist;',
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
    .input('dist', function(filter) {return filter.dist;})
    .end()
    .begin()
    .shader(function(glsl, im, w, h) {
        var sz = glsl.io().tplSize,
            tsw = stdMath.round(glsl.instance.scale*sz[0]),
            tsh = stdMath.round(glsl.instance.scale*sz[1]);
        filter.meta = FilterUtil.minmaxloc(im, w, h, null, null, 4, 0).minpos.map(function(p) {return {x:p.x, y:p.y, width:tsw, height:tsh};});
        return glsl.io()['im'].data;//im;
    })
    .end();
    return glslcode.code();
}
}(FILTER);