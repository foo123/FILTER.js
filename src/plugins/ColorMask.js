/**
*
* Color Mask Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp = FILTER._notSupportClamp, Min = Math.min, Floor=Math.floor;

// a plugin to mask an image using the alpha channel of another image
FILTER.Create({
    name: "ColorMaskFilter"
    
    // parameters
    ,_mask: null
    ,mask: null
    ,color: 0
    ,centerX: 0
    ,centerY: 0
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    // constructor
    ,init: function( color, colorMask, centerX, centerY ) {
        var self = this;
        self.color = color || 0;
        self.centerX = centerX||0;
        self.centerY = centerY||0;
        self._mask = null;
        self.mask = null;
        if ( null != colorMask ) self.setMask( colorMask );
    }
    
    ,dispose: function( ) {
        var self = this;
        self.color = null;
        self.centerX = null;
        self.centerY = null;
        self.mask = null;
        self._mask = null;
        self.$super('dispose');
        return self;
    }
    
    ,setMask: function( colorMask ) {
        var self = this;
        if ( null != colorMask )
        {
            self.mask = colorMask;
            self._mask = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, mask = self.mask;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _mask: mask === +mask ? +mask : (self._mask || (mask ? { data: mask.getData( ), width: mask.width, height: mask.height } : null))
                ,color: self.color
                ,centerX: self.centerX
                ,centerY: self.centerY
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.mask = null;
            self._mask = params._mask;
            if ( self._mask && (self._mask !== +self._mask) ) self._mask.data = FILTER.Util.Array.typed( self._mask.data, FILTER.ImArray );
            self.color = params.color;
            self.centerX = params.centerX;
            self.centerY = params.centerY;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        
        var self = this, mask = self.mask;
        if ( !self._isOn || null == mask || null == self._mask ) return im;
        
        var _mask = self._mask || { data: mask.getData( ), width: mask.width, height: mask.height },
            mask = _mask.data, w2 = _mask.width, h2 = _mask.height, color = self.color||0,
            i, l = im.length, l2 = alpha.length, 
            x, x2, y, y2, off, xc, yc, 
            wm = Min(w, w2), hm = Min(h, h2),  
            cX = self.centerX||0, cY = self.centerY||0, 
            cX2 = (w2>>1), cY2 = (h2>>1)
        ;
        
        
        // make center relative
        cX = Floor(cX*(w-1)) - cX2;
        cY = Floor(cY*(h-1)) - cY2;
        
        x=0; y=0;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            xc = x - cX; yc = y - cY;
            if (xc>=0 && xc<wm && yc>=0 && yc<hm)
            {
                // copy alpha channel
                off = (xc + yc*w2)<<2;
                im[i+3] = alpha[off+3];
            }
            else
            {
                // better to remove the alpha channel if mask dimensions are different??
                im[i+3] = 0;
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);