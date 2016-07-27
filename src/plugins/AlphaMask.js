/**
*
* Alpha Mask Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp = FILTER._notSupportClamp, CHANNEL = FILTER.CHANNEL, Min = Math.min, Floor=Math.floor;

// a plugin to mask an image using the alpha channel of another image
FILTER.Create({
    name: "AlphaMaskFilter"
    
    // parameters
    ,_alphaMask: null
    ,alphaMask: null
    ,centerX: 0
    ,centerY: 0
    ,channel: CHANNEL.ALPHA
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    // constructor
    ,init: function( alphaMask, centerX, centerY, channel ) {
        var self = this;
        self.centerX = centerX||0;
        self.centerY = centerY||0;
        self.channel = null == channel ? CHANNEL.ALPHA : (channel||CHANNEL.RED);
        self._alphaMask = null;
        self.alphaMask = null;
        if ( alphaMask ) self.setMask( alphaMask );
    }
    
    ,dispose: function( ) {
        var self = this;
        self.centerX = null;
        self.centerY = null;
        self.channel = null;
        self.alphaMask = null;
        self._alphaMask = null;
        self.$super('dispose');
        return self;
    }
    
    ,setMask: function( alphaMask ) {
        var self = this;
        if ( alphaMask )
        {
            self.alphaMask = alphaMask;
            self._alphaMask = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, Mask = self.alphaMask;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _alphaMask: self._alphaMask || (Mask ? { data: Mask.getData( ), width: Mask.width, height: Mask.height } : null)
                ,centerX: self.centerX
                ,centerY: self.centerY
                ,channel: self.channel
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.alphaMask = null;
            self._alphaMask = params._alphaMask;
            if ( self._alphaMask ) self._alphaMask.data = FILTER.Util.Array.typed( self._alphaMask.data, FILTER.ImArray );
            self.centerX = params.centerX;
            self.centerY = params.centerY;
            self.channel = params.channel;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        
        var self = this, Mask = self.alphaMask;
        if ( !self._isOn || !(Mask || self._alphaMask) ) return im;
        
        //self._alphaMask = self._alphaMask || { data: Mask.getData( ), width: Mask.width, height: Mask.height };
        
        var _alpha = self._alphaMask || { data: Mask.getData( ), width: Mask.width, height: Mask.height },
            alpha = _alpha.data, w2 = _alpha.width, h2 = _alpha.height,
            i, l = im.length, l2 = alpha.length,
            x, x2, y, y2, off, xc, yc, 
            wm = Min(w, w2), hm = Min(h, h2),  
            channel = null==self.channel?CHANNEL.ALPHA:(self.channel||CHANNEL.RED),
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
                // copy (alpha) channel
                off = (xc + yc*w2)<<2;
                im[i+3] = alpha[off+channel];
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