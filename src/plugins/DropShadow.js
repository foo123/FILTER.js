/**
*
* Drop Shadow Filter Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var IMG = FILTER.ImArray, integralConvolution = FILTER.Math.integralConvolution_rgba,
    boxKernel_3x3 = new FILTER.Array32F([
        1/9,1/9,1/9
        1/9,1/9,1/9
        1/9,1/9,1/9
    ])
;

// adapted from http://www.jhlabs.com/ip/filters/
// analogous to ActionScript filter
FILTER.Create({
     name: "DropShadowFilter"
    
    // parameters
    ,offsetX: null
    ,offsetY: null
    ,color: 0
    ,opacity: 1
    ,quality: 3
    
    // constructor
    ,init: function( offsetX, offsetY, color, opacity, quality ) {
        var self = this;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        self.color = color || 0;
        self.opacity = null == opacity ? 1.0 : +opacity;
        self.quality = quality || 3;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.offsetX = null;
        self.offsetY = null;
        self.color = null;
        self.opacity = null;
        self.quality = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, Mask = self.alphaMask;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 offsetX: self.offsetX
                ,offsetY: self.offsetY
                ,color: self.color
                ,opacity: self.opacity
                ,quality: self.quality
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.offsetX = params.offsetX;
            self.offsetY = params.offsetY;
            self.color = params.color;
            self.opacity = params.opacity;
            self.quality = params.quality;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn ) return im;
        var color = self.color || 0, offX = self.offsetX||0, offY = self.offsetY||0,
            quality = ~~self.quality,
            a = ~~(255*self.opacity), r = (color >>> 16)&255,
            g = (color >>> 8)&255, b = (color)&255,
            imSize = im.length, i, x, y, sx, sy, si, shadow, ai, aa;
            
        if ( 0 > a ) a = 0;
        if ( 255 < a ) a = 255;
        if ( 0 === a ) return im;
        
        if ( 0 >= quality ) quality = 1;
        if ( 3 < quality ) quality = 3;
        
        shadow = new IMG(imSize);
        // generate shadow from image alpha channel
        for(i=0; i<imSize; i+=4)
        {
            ai = im[i+3];
            if ( ai > 0 )
            {
                shadow[i  ] = r;
                shadow[i+1] = g;
                shadow[i+2] = b;
                shadow[i+3] = a;
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
        shadow = integralConvolution(shadow, w, h, boxKernel_3x3, 3, 3, 1.0, 0.0, quality);
        
        // offset and combine with original image
        for(x=0,y=0,si=0; si<imSize; si+=4,x++)
        {
            if ( x >= w ) {x=0; y++;}
            sx = x+offX; sy = y+offY;
            if ( 0 > sx || sx >= w || 0 > sy || sy >= h ) continue;
            i = (sx + sy*w) << 2; ai = im[i+3]; a = shadow[si+3];
            if ( /*0 === alpha ||*/ (255 === ai) || (0 === a) ) continue;
            a /= 255; ai /= 255; aa = ai + a*(1.0-ai);
            // src over composition
            // https://en.wikipedia.org/wiki/Alpha_compositing
            im[i  ] = (~~((im[i  ]*ai + shadow[si  ]*a*(1.0-ai))/aa))&255;
            im[i+1] = (~~((im[i+1]*ai + shadow[si+1]*a*(1.0-ai))/aa))&255;
            im[i+2] = (~~((im[i+2]*ai + shadow[si+2]*a*(1.0-ai))/aa))&255;
            im[i+3] = ~~(aa*255);
        }
        
        // return image with shadow
        return im;
    }
});

}(FILTER);