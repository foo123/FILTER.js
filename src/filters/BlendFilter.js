/**
*
* Blend Filter
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var HAS = 'hasOwnProperty', Min = Math.min, Round = Math.round,
    notSupportClamp = FILTER._notSupportClamp, blend_function = FILTER.Color.Combine;

//
// Blend Filter, photoshop-like image blending
var BlendFilter = FILTER.BlendFilter = FILTER.Class( FILTER.Filter, {
    name: "BlendFilter"
    
    ,constructor: function BlendFilter( blendImage, blendMode ) { 
        var self = this;
        if ( !(self instanceof BlendFilter) ) return new BlendFilter(blendImage, blendMode);
        self.$super('constructor');
        self.startX = 0;
        self.startY = 0;
        self.alpha = 1;
        self.mode = null;
        if ( blendImage ) self.setInput( "blend", blendImage );
        if ( blendMode ) self.setMode( blendMode );
    }
    
    ,path: FILTER_FILTERS_PATH
    // parameters
    ,mode: null
    ,startX: 0
    ,startY: 0
    ,alpha: 1
    ,hasInputs: true
    
    ,dispose: function( ) {
        var self = this;
        self.$super('dispose');
        return self;
    }
    
    // set blend mode auxiliary method
    ,setMode: function( mode ) {
        var self = this;
        if ( mode )
        {
            self.mode = String(mode).toLowerCase();
            if ( !blend_function[HAS](self.mode) ) self.mode = null;
        }
        else
        {
            self.mode = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             mode: self.mode
            ,startX: self.startX
            ,startY: self.startY
            ,alpha: self.alpha
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.startX = params.startX;
        self.startY = params.startY;
        self.alpha = params.alpha;
        self.setMode( params.mode );
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self.startX = 0;
        self.startY = 0;
        self.alpha = 1;
        self.mode = null;
        return self;
    }
    
    ,_apply: function(im, w, h/*, image*/) {
        var self = this, blendImg, alpha = self.alpha;
        if ( !self._isOn || !self.mode || 0 === alpha ) return im;
        
        blendImg = self.input("blend"); if ( !blendImg ) return im;
        
        var startX = self.startX||0, startY = self.startY||0, 
            startX2 = 0, startY2 = 0, W, H, im2, w2, h2, 
            W1, W2, start, end, x, y, x2, y2,
            pix2, blend = blend_function[ self.mode ];
        
        if (startX < 0) { startX2 = -startX;  startX = 0; }
        if (startY < 0) { startY2 = -startY;  startY = 0; }
        
        w2 = blendImg[1]; h2 = blendImg[2];
        if (startX >= w || startY >= h) return im;
        if (startX2 >= w2 || startY2 >= h2) return im;
        
        startX = Round(startX); startY = Round(startY);
        startX2 = Round(startX2); startY2 = Round(startY2);
        W = Min(w-startX, w2-startX2); H = Min(h-startY, h2-startY2);
        if (W <= 0 || H <= 0) return im;
        
        im2 = blendImg[0];
        
        // blend images
        x = startX; y = startY*w;
        x2 = startX2; y2 = startY2*w2;
        W1 = startX+W; W2 = startX2+W;
        for(start=0,end=H*W; start<end; start++)
        {
            pix2 = (x2 + y2)<<2;
            // blend only if im2 has opacity in this point
            if ( 0 < im2[pix2+3] ) blend(im, im2, (x + y)<<2, pix2, alpha, notSupportClamp);
            // next pixels
            x++; if (x>=W1) { x = startX; y += w; }
            x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
        }
        return im; 
    }
});
// aliases
FILTER.CombineFilter = FILTER.BlendFilter;

}(FILTER);