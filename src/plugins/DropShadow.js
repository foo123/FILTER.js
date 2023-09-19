/**
*
* Drop Shadow Filter
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MODE = FILTER.MODE,
    boxKernel_3x3 = new FILTER.ConvolutionMatrix([
    1/9,1/9,1/9,
    1/9,1/9,1/9,
    1/9,1/9,1/9
    ]),
    stdMath = Math, IMG = FILTER.ImArray,
    FilterUtil = FILTER.Util.Filter,
    ImageUtil = FILTER.Util.Image,
    GLSL = FILTER.Util.GLSL;

// adapted from http://www.jhlabs.com/ip/filters/
// analogous to ActionScript filter
FILTER.Create({
     name: "DropShadowFilter"

    // parameters
    ,offsetX: null
    ,offsetY: null
    ,color: 0
    ,opacity: 1
    ,quality: 1
    ,pad: true
    ,onlyShadow: false

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    // constructor
    ,init: function(offsetX, offsetY, color, opacity, quality, pad, onlyShadow) {
        var self = this;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        self.color = color || 0;
        self.opacity = null == opacity ? 1.0 : +opacity;
        self.quality = (quality || 1)|0;
        self.pad = null == pad ? true : !!pad;
        self.onlyShadow = !!onlyShadow;
    }

    ,dispose: function() {
        var self = this;
        self.offsetX = null;
        self.offsetY = null;
        self.color = null;
        self.opacity = null;
        self.quality = null;
        self.pad = null;
        self.onlyShadow = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             offsetX: self.offsetX
            ,offsetY: self.offsetY
            ,color: self.color
            ,opacity: self.opacity
            ,quality: self.quality
            ,pad: self.pad
            ,onlyShadow: self.onlyShadow
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.offsetX = params.offsetX;
        self.offsetY = params.offsetY;
        self.color = params.color;
        self.opacity = params.opacity;
        self.quality = params.quality;
        self.pad = params.pad;
        self.onlyShadow = params.onlyShadow;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        self.hasMeta = false;
        if (!self._isOn) return im;
        var max = stdMath.max, color = self.color||0,
            a = self.opacity, quality = self.quality,
            pad = self.pad, onlyShadow = self.onlyShadow,
            offX = self.offsetX||0, offY = self.offsetY||0,
            r, g, b, imSize = im.length, imArea = imSize>>>2, shSize = imSize,
            i, x, y, sw = w, sh = h, sx, sy, si, ai, aa, shadow;

        if (0.0 > a) a = 0.0;
        if (1.0 < a) a = 1.0;
        if (0.0 === a) return im;

        r = (color>>>16)&255; g = (color>>>8)&255; b = (color)&255;

        if (0 >= quality) quality = 1;
        if (3 < quality) quality = 3;

        shadow = new IMG(shSize);

        // generate shadow from image alpha channel
        var maxx = 0, maxy = 0;
        for (i=0,x=0,y=0; i<shSize; i+=4,++x)
        {
            if (x >= sw) {x=0; ++y;}
            ai = im[i+3];
            if (ai > 0)
            {
                shadow[i  ] = r;
                shadow[i+1] = g;
                shadow[i+2] = b;
                shadow[i+3] = (a*ai)|0;
                maxx = max(maxx, x);
                maxy = max(maxy, y);
            }
            else
            {
                shadow[i  ] = 0;
                shadow[i+1] = 0;
                shadow[i+2] = 0;
                shadow[i+3] = 0;
            }
        }

        // blur shadow, quality is applied multiple times for smoother effect
        shadow = FilterUtil.integral_convolution(r===g && g===b ? MODE.GRAY : MODE.RGB, shadow, w, h, 2, boxKernel_3x3, null, 3, 3, 1.0, 0.0, quality);

        // pad image to fit whole offseted shadow
        maxx += offX; maxy += offY;
        if (pad && (maxx >= w || maxx < 0 || maxy >= h || maxy < 0))
        {
            var pad_left = maxx < 0 ? -maxx : 0, pad_right = maxx >= w ? maxx-w : 0,
                pad_top = maxy < 0 ? -maxy : 0, pad_bot = maxy >= h ? maxy-h : 0;
            if (onlyShadow) im = new IMG(((w + pad_left + pad_right)*(h + pad_top + pad_bot)) << 2);
            else im = ImageUtil.pad(im, w, h, pad_right, pad_bot, pad_left, pad_top);
            w += pad_left + pad_right; h += pad_top + pad_bot;
            imArea = w * h; imSize = imArea << 2;
            self.hasMeta = true;
            self.meta = {_IMG_WIDTH: w, _IMG_HEIGHT: h};
        }
        else if (pad && onlyShadow)
        {
            im = new IMG(imSize);
        }
        // offset and combine with original image
        offY *= w;
        if (onlyShadow)
        {
            // return only the shadow
            for (x=0,y=0,si=0; si<shSize; si+=4,++x)
            {
                if (x >= sw) {x=0; y+=w;}
                sx = x+offX; sy = y+offY;
                if (0 > sx || sx >= w || 0 > sy || sy >= imArea /*|| 0 === shadow[si+3]*/) continue;
                i = (sx + sy) << 2;
                im[i  ] = shadow[si  ]; im[i+1] = shadow[si+1]; im[i+2] = shadow[si+2]; im[i+3] = shadow[si+3];
            }
        }
        else
        {
            // return image with shadow
            for (x=0,y=0,si=0; si<shSize; si+=4,++x)
            {
                if (x >= sw) {x=0; y+=w;}
                sx = x+offX; sy = y+offY;
                if (0 > sx || sx >= w || 0 > sy || sy >= imArea) continue;
                i = (sx + sy) << 2; ai = im[i+3]; a = shadow[si+3];
                if ((255 === ai) || (0 === a)) continue;
                a /= 255; //ai /= 255; //aa = ai + a*(1.0-ai);
                // src over composition
                // https://en.wikipedia.org/wiki/Alpha_compositing
                /*im[i  ] = (im[i  ]*ai + shadow[si  ]*a*(1.0-ai))/aa;
                im[i+1] = (im[i+1]*ai + shadow[si+1]*a*(1.0-ai))/aa;
                im[i+2] = (im[i+2]*ai + shadow[si+2]*a*(1.0-ai))/aa;*/
                //im[i+3] = aa*255;
                r = im[i  ] + (shadow[si  ]-im[i  ])*a;
                g = im[i+1] + (shadow[si+1]-im[i+1])*a;
                b = im[i+2] + (shadow[si+2]-im[i+2])*a;
                im[i  ] = r|0; im[i+1] = g|0; im[i+2] = b|0;
            }
        }
        return im;
    }
});

function glsl(filter)
{
    var matrix_code = function(m, dx, dy, f, b) {
        var def = [], calc = [],
            k, i, j, matArea = m.length,
            rx = dx>>>1, ry = dy>>>1,
            toFloat = GLSL.formatFloat;
        def.push('vec4 col=texture2D(img,  pix);');
        i=-rx; j=-ry; k=0;
        while (k<matArea)
        {
            if (m[k])
            {
                if (i || j)
                {
                    def.push('vec2 p'+k+'=vec2(pix.x'+toFloat(i, 1)+'*dp.x, pix.y'+toFloat(j, 1)+'*dp.y); vec3 c'+k+'=vec3(0.0); if (0.0 <= p'+k+'.x && 1.0 >= p'+k+'.x && 0.0 <= p'+k+'.y && 1.0 >= p'+k+'.y) c'+k+'=texture2D(img,  p'+k+').rgb;');
                }
                else
                {
                    def.push('vec3 c'+k+'=col.rgb;');
                }
                calc.push(toFloat(m[k], calc.length)+'*c'+k);
            }
            ++k; ++i; if (i>rx) {i=-rx; ++j;}
        }
        return [def.join('\n'), 'vec4(('+toFloat(f||1)+'*('+calc.join('')+')+vec3('+toFloat(b||0)+')),col.a)'];
    };
    var code = matrix_code(boxKernel_3x3, 3, 3, 1, 0);
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform vec2 wh;',
    'uniform vec2 nwh;',
    'uniform float pad_right;',
    'uniform float pad_bot;',
    'uniform float pad_left;',
    'uniform float pad_top;',
    ImageUtil.glsl()['pad'],
    'void main(void) {',
    '    gl_FragColor = pad(pix, img, wh, nwh, pad_right, pad_bot, pad_left, pad_top);',
    '}'
    ].join('\n'), function() {return filter.pad ? 1 : 0;})
    .dimensions(function(w, h) {return [w+stdMath.abs(filter.offsetX||0), h+stdMath.abs(filter.offsetY||0)];})
    .input('wh', function(filter, nw, nh, w, h) {return [w, h];})
    .input('nwh', function(filter, nw, nh, w, h) {return [nw, nh];})
    .input('pad_right', function(filter) {return (filter.offsetX||0) > 0 ? (filter.offsetX||0) : 0;})
    .input('pad_bot', function(filter) {return (filter.offsetY||0) > 0 ? (filter.offsetY||0) : 0;})
    .input('pad_left', function(filter) {return (filter.offsetX||0) < 0 ? -(filter.offsetX||0) : 0;})
    .input('pad_top', function(filter) {return (filter.offsetY||0) < 0 ? -(filter.offsetY||0) : 0;})
    .end()
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform vec4 c;',
    'void main(void) {',
    '   vec4 im = texture2D(img, pix);',
    '   gl_FragColor = im.a > 0.0 ? vec4(c.rgb, c.a*im.a) : vec4(0.0);',
    '}'
    ].join('\n'))
    .save('image')
    .input('c', function(filter) {
        var color = filter.color || 0;
        return [((color>>>16)&255)/255, ((color>>>8)&255)/255, ((color)&255)/255, stdMath.min(stdMath.max(filter.opacity, 0.0), 1.0)];
    })
    .end()
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform vec2 dp;',
    'void main(void) {',
    code[0],
    'gl_FragColor = '+code[1]+';',
    '}'
    ].join('\n'), function() {return stdMath.min(stdMath.max(filter.quality, 1), 3);})
    .end()
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform vec2 offset;',
    'uniform int onlyShadow;',
    'uniform sampler2D shadow;',
    'uniform sampler2D image;',
    'void main(void) {',
    '   vec2 pixo = pix - offset;',
    '   vec4 sh = pixo.x < 0.0 || pixo.y < 0.0 ? vec4(0.0) : texture2D(shadow, pixo);',
    '   vec4 im = onlyShadow ? vec4(0.0) : texture2D(image, pix);',
    '   if (1 == onlyShadow)',
    '   {',
    '       gl_FragColor = sh;',
    '   }',
    '   else',
    '   {',
    '       if ((1.0 == im.a) || (0.0 == sh.a)) gl_FragColor = im;',
    '       else gl_FragColor = vec4(mix(im.rgb, sh.rgb, sh.a), im.a);',
    '   }',
    '}'
    ].join('\n'))
    .input('offset', function(filter, w, h) {return [(filter.offsetX||0)/w, (filter.offsetY||0)/h];})
    .input('onlyShadow', function(filter) {return filter.onlyShadow ? 1 : 0;})
    .input('shadow', true)
    .input('image')
    .end();
    return glslcode.code();
}

}(FILTER);