/**
*
* Drop Shadow Filter Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var MODE = FILTER.MODE,
    boxKernel_3x3 = new FILTER.ConvolutionMatrix([
    1/9,1/9,1/9,
    1/9,1/9,1/9,
    1/9,1/9,1/9
    ]);

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
    ,path: FILTER_PLUGINS_PATH
    
    // constructor
    ,init: function( offsetX, offsetY, color, opacity, quality, pad, onlyShadow ) {
        var self = this;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        self.color = color || 0;
        self.opacity = null == opacity ? 1.0 : +opacity;
        self.quality = (quality || 1)|0;
        self.pad = null == pad ? true : !!pad;
        self.onlyShadow = !!onlyShadow;
    }
    
    ,dispose: function( ) {
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
    
    ,serialize: function( ) {
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
    
    ,unserialize: function( params ) {
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
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        self.hasMeta = false;
        if ( !self._isOn ) return im;
        var max = Math.max, color = self.color||0, a = self.opacity, quality = self.quality,
            pad = self.pad, onlyShadow = self.onlyShadow, offX = self.offsetX||0, offY = self.offsetY||0,
            r, g, b, imSize = im.length, imArea = imSize>>>2, shSize = imSize, i, x, y, sw = w, sh = h, sx, sy, si, ai, aa, shadow;
            
        if ( 0.0 > a ) a = 0.0;
        if ( 1.0 < a ) a = 1.0;
        if ( 0.0 === a ) return im;
        
        r = (color>>>16)&255; g = (color>>>8)&255; b = (color)&255;
        
        if ( 0 >= quality ) quality = 1;
        if ( 3 < quality ) quality = 3;
        
        shadow = new FILTER.ImArray(shSize);
        
        // generate shadow from image alpha channel
        var maxx = 0, maxy = 0;
        for(i=0,x=0,y=0; i<shSize; i+=4,x++)
        {
            if ( x >= sw ) { x=0; y++; }
            ai = im[i+3];
            if ( ai > 0 )
            {
                shadow[i  ] = r;
                shadow[i+1] = g;
                shadow[i+2] = b;
                shadow[i+3] = (a*ai)|0;
                maxx = max(maxx, x);
                maxy = max(maxy, y);
            }
            /*else
            {
                shadow[i  ] = 0;
                shadow[i+1] = 0;
                shadow[i+2] = 0;
                shadow[i+3] = 0;
            }*/
        }
        
        // blur shadow, quality is applied multiple times for smoother effect
        shadow = FILTER.Util.Filter.integral_convolution(r===g && g===b ? MODE.GRAY : MODE.RGB, shadow, w, h, 2, boxKernel_3x3, null, 3, 3, 1.0, 0.0, quality);
        
        // pad image to fit whole offseted shadow
        maxx += offX; maxy += offY;
        if ( pad && (maxx >= w || maxx < 0 || maxy >= h || maxy < 0) )
        {
            var pad_left = maxx < 0 ? -maxx : 0, pad_right = maxx >= w ? maxx-w : 0,
                pad_top = maxy < 0 ? -maxy : 0, pad_bot = maxy >= h ? maxy-h : 0;
            im = FILTER.Util.Image.pad(im, w, h, pad_right, pad_bot, pad_left, pad_top);
            w += pad_left + pad_right; h += pad_top + pad_bot;
            imArea = w * h; imSize = imArea << 2;
            self.hasMeta = true;
            self.meta = {_IMG_WIDTH: w, _IMG_HEIGHT: h};
        }
        // offset and combine with original image
        offY *= w;
        if ( onlyShadow )
        {
            // return only the shadow
            for(x=0,y=0,si=0; si<shSize; si+=4,x++)
            {
                if ( x >= sw ) {x=0; y+=w;}
                sx = x+offX; sy = y+offY;
                if ( 0 > sx || sx >= w || 0 > sy || sy >= imArea /*|| 0 === shadow[si+3]*/ ) continue;
                i = (sx + sy) << 2;
                im[i  ] = shadow[si  ]; im[i+1] = shadow[si+1]; im[i+2] = shadow[si+2]; im[i+3] = shadow[si+3];
            }
        }
        else
        {
            // return image with shadow
            for(x=0,y=0,si=0; si<shSize; si+=4,x++)
            {
                if ( x >= sw ) {x=0; y+=w;}
                sx = x+offX; sy = y+offY;
                if ( 0 > sx || sx >= w || 0 > sy || sy >= imArea ) continue;
                i = (sx + sy) << 2; ai = im[i+3]; a = shadow[si+3];
                if ( (255 === ai) || (0 === a) ) continue;
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

}(FILTER);