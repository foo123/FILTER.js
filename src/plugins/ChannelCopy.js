/**
*
* Channel Copy Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var Min = Math.min, Floor = Math.floor, CHANNEL = FILTER.CHANNEL, MODE = FILTER.MODE;

// a plugin to copy a channel of an image to a channel of another image
FILTER.Create({
    name: "ChannelCopyFilter"
    
    // parameters
    ,centerX: 0
    ,centerY: 0
    ,srcChannel: CHANNEL.R
    ,dstChannel: CHANNEL.R
    ,color: 0
    ,mode: MODE.IGNORE
    ,hasInputs: true
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    // constructor
    ,init: function( srcChannel, dstChannel, centerX, centerY, color ) {
        var self = this;
        self.srcChannel = srcChannel || CHANNEL.R;
        self.dstChannel = dstChannel || CHANNEL.R;
        self.centerX = centerX || 0;
        self.centerY = centerY || 0;
        self.color = color || 0;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.srcChannel = null;
        self.dstChannel = null;
        self.centerX = null;
        self.centerY = null;
        self.color = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             centerX: self.centerX
            ,centerY: self.centerY
            ,srcChannel: self.srcChannel
            ,dstChannel: self.dstChannel
            ,color: self.color
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.centerX = params.centerX;
        self.centerY = params.centerY;
        self.srcChannel = params.srcChannel;
        self.dstChannel = params.dstChannel;
        self.color = params.color;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this, Src;
        Src = self.input("source"); if ( !Src ) return im;
        
        var src = Src[0], w2 = Src[1], h2 = Src[2],
            i, l = im.length, l2 = src.length, 
            sC = self.srcChannel, tC = self.dstChannel,
            x, x2, y, y2, off, xc, yc,
            cX = self.centerX||0, cY = self.centerY||0, cX2 = w2>>>1, cY2 = h2>>>1,
            wm = Min(w,w2), hm = Min(h, h2),  
            color = self.color||0, r, g, b, a,
            mode = self.mode, COLOR = MODE.COLOR, CH_COLOR = MODE.COLOR_CHANNEL, MASK = MODE.COLOR_MASK;
        
        if ( COLOR === mode || MASK === mode )
        {
            a = (color >>> 24)&255;
            r = (color >>> 16)&255;
            g = (color >>> 8)&255;
            b = (color)&255;
        }
        else if ( CH_COLOR === mode )
        {
            color &= 255;
        }
        
        // make center relative
        cX = Floor(cX*(w-1)) - cX2;
        cY = Floor(cY*(h-1)) - cY2;
        
        for (x=0,y=0,i=0; i<l; i+=4,x++)
        {
            if (x>=w) { x=0; y++; }
            
            xc = x - cX; yc = y - cY;
            if (xc<0 || xc>=wm || yc<0 || yc>=hm)
            {
                if ( COLOR === mode ) { im[i  ] = r; im[i+1] = g; im[i+2] = b; im[i+3] = a; }
                else if ( MASK === mode ) { im[i  ] = r&im[i  ]; im[i+1] = g&im[i+1]; im[i+2] = b&im[i+2]; im[i+3] = a&im[i+3]; }
                else if ( CH_COLOR === mode ) im[i+tC] = color;
                // else ignore
            }
            else
            {
                // copy channel
                off = (xc + yc*w2)<<2;
                im[i + tC] = src[off + sC];
            }
        }
        // return the new image data
        return im;
    }
});

}(FILTER);