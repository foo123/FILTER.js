/**
*
* Seamless Tile Plugin
* @package FILTER.js
*
**/
!function(FILTER) {
"use strict";

var stdMath = Math, GLSL = FILTER.Util.GLSL, ImageUtil = FILTER.Util.Image;

/*
a plugin to create a seamless tileable pattern from an image
adapted from: http://www.blitzbasic.com/Community/posts.php?topic=43846
*/
FILTER.Create({
    name: "SeamlessTileFilter"

    ,type: 2 // 0 radial, 1 linear 1, 2 linear 2

    // constructor
    ,init: function(mode) {
        var self = this;
        self.type = null == mode ? 2 : (mode||0);
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,serialize: function() {
        var self = this;
        return {
            type: self.type
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.type = params.type;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    // this is the filter actual apply method routine
    // adapted from: http://www.blitzbasic.com/Community/posts.php?topic=43846
    ,apply: function(im, w, h) {
        var self = this,
            resize = (self._runWASM ? (ImageUtil.wasm||ImageUtil) : ImageUtil).interpolate,
            //needed arrays
            tile, diagonal, mask,
            a1, a2, a3, i, j, w2, h2,
            index, indexd, N, N2, imSize;

        //find largest side of the image
        //and resize the image to become square
        //if (w !== h) im = resize(im, w, h, N = w > h ? w : h, N);
        //else  N = w;
        //N2 = stdMath.round(N/2);
        w2 = stdMath.round(w/2);
        h2 = stdMath.round(h/2);
        imSize = im.length;
        tile = new FILTER.ImArray(imSize);
        //diagonal = getdiagonal(im, N, N2);
        mask = getmask(self.type, w, h, w2, h2);

        //Create the tile
        for (j=0,i=0; j<h; ++i)
        {
            if (i >= w) {i=0; ++j;}
            index = i+j*w;
            indexd = ((i+w2) % w) + ((j+h2) % h)*w;
            a1 = mask[index]; a2 = mask[indexd];
            a3 = a1+a2; a1 /= a3; a2 /= a3;
            index <<= 2; indexd <<= 2;
            tile[index  ] = ~~(a1*im[index  ] + a2*im[indexd  ]/*diagonal[index  ]*/);
            tile[index+1] = ~~(a1*im[index+1] + a2*im[indexd+1]/*diagonal[index+1]*/);
            tile[index+2] = ~~(a1*im[index+2] + a2*im[indexd+2]/*diagonal[index+2]*/);
            tile[index+3] = im[index+3];
        }

        //create the new tileable image
        //if it wasn't a square image, resize it back to the original scale
        //if (w !== h) tile = resize(tile, N, N, w, h);

        // return the new image data
        return tile;
    }
});

/*function getdiagonal(im, N, N2)
{
    var imSize = im.length,
        diagonal = new FILTER.ImArray(imSize),
        i, j, k, index;

    for (i=0,j=0,k=0; k<imSize; k+=4,++i)
    {
        if (i >= N) {i=0; ++j;}
        index = ((i+N2)%N + ((j+N2)%N)*N)<<2;
        diagonal[index  ] = im[k  ];
        diagonal[index+1] = im[k+1];
        diagonal[index+2] = im[k+2];
        diagonal[index+3] = im[k+3];
    }
    return diagonal;
}*/
function getmask(masktype, w, h, w2, h2)
{
    var size = w*h, mask = new FILTER.Array8U(size),
        length = FILTER.Util.Math.hypot, i, j, d, NN;
    //try to make your own masktypes here
    if (0 === masktype) //RADIAL
    {
        //Create the mask
        NN = stdMath.sqrt(w2*h2);
        for (i=0,j=0; i<w2; ++j)
        {
            if (j >= h2) {j=0; ++i;}

            //Scale d To range from 1 To 255
            d = 255 - (255 / NN * length((w2 - i), (h2 - j)));
            d = ~~(d < 1 ? 1 : (d > 255 ? 255 : d));

            //Form the mask in Each quadrant
            mask[i     + j*w      ] = d;
            mask[i     + (h-1-j)*w] = d;
            mask[w-1-i + j*w      ] = d;
            mask[w-1-i + (h-1-j)*w] = d;
        }
    }
    else if (1 === masktype) //LINEAR 1
    {
        //Create the mask
        for (i=0,j=0; i<w2; ++j)
        {
            if (j >= h2) {j=0; ++i;}

            //Scale d To range from 1 To 255
            d = 255 - (255 * (j < i ? ((h2 - j)/h2) : ((w2 - i)/w2)));
            d = ~~(d < 1 ? 1 : (d > 255 ? 255 : d));

            //Form the mask in Each quadrant
            mask[i     + j*w      ] = d;
            mask[i     + (h-1-j)*w] = d;
            mask[w-1-i + j*w      ] = d;
            mask[w-1-i + (h-1-j)*w] = d;
        }
    }
    else //if (2 === masktype) //LINEAR 2
    {
        //Create the mask
        NN = stdMath.sqrt(w*h);
        for (i=0,j=0; i<w2; ++j)
        {
            if (j >= h2) {j=0; ++i;}

            //Scale d To range from 1 To 255
            d = 255 - (255 / (1.13*NN) * (/*j < i ? length(N - j, N - i) :*/ length((w - i), (h - j))));
            d = ~~(d < 1 ? 1 : (d > 255 ? 255 : d));

            //Form the mask in Each quadrant
            mask[i     + j*w      ] = d;
            mask[i     + (h-1-j)*w] = d;
            mask[w-1-i + j*w      ] = d;
            mask[w-1-i + (h-1-j)*w] = d;
        }
    }
    return mask;
}
function glsl(filter)
{
    var glslcode = (new GLSL.Filter(filter))
    /*.begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform vec2 wh;',
    'uniform vec2 nwh;',
    ImageUtil.glsl()['interpolate'],
    'void main(void) {',
    '   gl_FragColor = interpolate(pix, img, wh, nwh);',
    '}'
    ].join('\n'), 1, 'resize')
    .dimensions(function(w, h, io) {io.w = w; io.h = h; w = stdMath.max(w, h); return [w, w];})
    .input('wh', function(filter, nw, nh, w, h) {return [w, h];})
    .input('nwh', function(filter, nw, nh, w, h) {return [nw, nh];})
    .output('image')
    .end()*/
    /*.begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'vec4 diagonal(vec2 pix, sampler2D img) {',
    '   vec2 ij = pix - vec2(0.5);',
    '   if (ij.x < 0.0) ij.x += 1.0;',
    '   if (ij.y < 0.0) ij.y += 1.0;',
    '   return texture2D(img, ij);',
    '}',
    'void main(void) {',
    '   gl_FragColor = diagonal(pix, img);',
    '}'
    ].join('\n'))
    .output('diagonal')
    .end()*/
    /*.begin()
    .shader([
    'varying vec2 pix;',
    'uniform vec2 wh;',
    'uniform float NN;',
    'uniform int masktype;',
    'vec4 mask(vec2 pix, float w, float h, NN, int masktype) {',
    '   vec2 ij = vec2(pix.x, pix.y);',
    '   //float NN = sqrt(wh.x*wh.y);',
    '   float d = 0.0;',
    '   if (ij.x > 0.5) ij.x = 1.0 - ij.x;',
    '   if (ij.y > 0.5) ij.y = 1.0 - ij.y;',
    '   if (0 == masktype) //RADIAL',
    '   {',
    '       d = 1.0 - length(wh*(vec2(0.5) - ij)) * 2.0 / NN;',
    '   }',
    '   else if (1 == masktype) //LINEAR 1',
    '   {',
    '       d = 1.0 - (ij.y < ij.x ? (0.5 - ij.y) : (0.5 - ij.x)) * 2.0;',
    '   }',
    '   else //if (2 == masktype) //LINEAR 2',
    '   {',
    '       d = 1.0 - (/*ij.y < ij.x ? length(wh*(vec2(1.0) - ij)) :* / length(wh*(vec2(1.0) - ij))) / (1.13*NN);',
    '   }',
    '   return vec4(clamp(d, 0.003921569/*1/255* /, 1.0));',
    '}',
    'void main(void) {',
    '   gl_FragColor = mask(pix, N, masktype);',
    '}'
    ].join('\n'))
    .input('wh', function(filter, w, h) {return [w, h];})
    .input('NN', function(filter, w, h) {return stdMath.sqrt(w*h);})
    .input('masktype', function(filter) {return filter.type;})
    //.output('mask')
    .end()*/
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform vec2 wh;',
    'uniform float NN;',
    'uniform int masktype;',
    'uniform sampler2D img;',
    '/*uniform sampler2D diagonal;*/',
    'vec4 mask(vec2 pix, vec2 wh, float NN, int masktype) {',
    '   vec2 ij = vec2(pix.x, pix.y);',
    '   float d = 0.0;',
    '   if (ij.x > 0.5) ij.x = 1.0 - ij.x;',
    '   if (ij.y > 0.5) ij.y = 1.0 - ij.y;',
    '   if (0 == masktype) //RADIAL',
    '   {',
    '       d = 1.0 - length(wh*(vec2(0.5) - ij)) * 2.0 / NN;',
    '   }',
    '   else if (1 == masktype) //LINEAR 1',
    '   {',
    '       d = 1.0 - (ij.y < ij.x ? (0.5 - ij.y) : (0.5 - ij.x)) * 2.0;',
    '   }',
    '   else //if (2 == masktype) //LINEAR 2',
    '   {',
    '       d = 1.0 - (/*ij.y < ij.x ? length(wh*(vec2(1.0) - ij)) :*/ length(wh*(vec2(1.0) - ij))) / (1.13*NN);',
    '   }',
    '   return vec4(clamp(d, 0.003921569/*1/255*/, 1.0));',
    '}',
    'void main(void) {',
    '   vec4 im = texture2D(img, pix);',
    '   vec2 pixd = pix - vec2(0.5);',
    '   if (pixd.x < 0.0) pixd.x += 1.0;',
    '   if (pixd.y < 0.0) pixd.y += 1.0;',
    '   vec2 pixm = pix + vec2(0.5);',
    '   if (pixm.x > 1.0) pixm.x -= 1.0;',
    '   if (pixm.y > 1.0) pixm.y -= 1.0;',
    '   float a1 = mask(pix, wh, NN, masktype).a;',
    '   float a2 = mask(pixm, wh, NN, masktype).a;',
    '   gl_FragColor = vec4(mix(im.rgb, /*texture2D(diagonal, pix)*/texture2D(img, pixd).rgb, a2/(a1+a2)), im.a);',
    '}'
    ].join('\n'))
    .input('wh', function(filter, w, h) {return [w, h];})
    .input('NN', function(filter, w, h) {return stdMath.sqrt(w*h);})
    .input('masktype', function(filter) {return filter.type;})
    //.input('diagonal')
    .end()
    /*.begin()
    .shader('resize')
    .dimensions(function(w, h, io) {return [io.w, io.h];})
    .input('wh', function(filter, nw, nh, w, h) {return [w, h];})
    .input('nwh', function(filter, nw, nh, w, h) {return [nw, nh];})
    .end()*/;
    return glslcode.code();
}

}(FILTER);