/**
*
* Image Blend Filter Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var HAS = 'hasOwnProperty', Min = Math.min, Round = Math.round,
    notSupportClamp = FILTER._notSupportClamp, blend_function = FILTER.Color.Combine
;

//
// a photoshop-like Blend Filter Plugin
FILTER.Create({
    name: "BlendFilter"
    
    // parameters
    ,_blendImage: null
    ,blendImage: null
    ,mode: null
    ,startX: 0
    ,startY: 0
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    // constructor
    ,init: function( blendImage, mode ) { 
        var self = this;
        self.startX = 0;
        self.startY = 0;
        self._blendImage = null;
        self.blendImage = null;
        self.mode = null;
        if ( blendImage ) self.setImage( blendImage );
        if ( mode ) self.setMode( mode );
    }
    
    ,dispose: function( ) {
        var self = this;
        self.blendImage = null;
        self._blendImage = null;
        self.mode = null;
        self.$super('dispose');
        return self;
    }
    
    // set blend image auxiliary method
    ,setImage: function( blendImage ) {
        var self = this;
        if ( blendImage )
        {
            self.blendImage = blendImage;
            self._blendImage = null;
        }
        return self;
    }
    
    // set blend mode auxiliary method
    ,setMode: function( mode ) {
        var self = this;
        if ( mode )
        {
            self.mode = (''+mode).toLowerCase();
            if ( !blend_function[HAS](self.mode) ) self.mode = null;
        }
        else
        {
            self.mode = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, bImg = self.blendImage;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _blendImage: self._blendImage || (bImg ? { data: bImg.getData( ), width: bImg.width, height: bImg.height } : null)
                ,mode: self.mode
                ,startX: self.startX
                ,startY: self.startY
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.startX = params.startX;
            self.startY = params.startY;
            self.blendImage = null;
            self._blendImage = params._blendImage;
            if ( self._blendImage ) self._blendImage.data = FILTER.Util.Array.typed( self._blendImage.data, FILTER.ImArray );
            self.setMode( params.mode );
        }
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self.startX = 0;
        self.startY = 0;
        self.mode = null;
        return self;
    }
    
    // main apply routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this, bImg = self.blendImage;
        if ( !self._isOn || !self.mode || !(bImg || self._blendImage) ) return im;
        
        //self._blendImage = self._blendImage || { data: bImg.getData( ), width: bImg.width, height: bImg.height };
        
        var image2 = self._blendImage || { data: bImg.getData( ), width: bImg.width, height: bImg.height },
            startX = self.startX||0, startY = self.startY||0, 
            startX2 = 0, startY2 = 0, W, H, im2, w2, h2, 
            W1, W2, start, end, x, y, x2, y2,
            pix2, blend = blend_function[ self.mode ]
        ;
        
        //if ( !blend ) return im;
        
        if (startX < 0) { startX2 = -startX;  startX = 0; }
        if (startY < 0) { startY2 = -startY;  startY = 0; }
        
        w2 = image2.width; h2 = image2.height;
        if (startX >= w || startY >= h) return im;
        if (startX2 >= w2 || startY2 >= h2) return im;
        
        startX = Round(startX); startY = Round(startY);
        startX2 = Round(startX2); startY2 = Round(startY2);
        W = Min(w-startX, w2-startX2); H = Min(h-startY, h2-startY2);
        if (W <= 0 || H <= 0) return im;
        
        im2 = image2.data;
        
        // blend images
        x = startX; y = startY*w;
        x2 = startX2; y2 = startY2*w2;
        W1 = startX+W; W2 = startX2+W;
        for(start=0,end=H*W; start<end; start++)
        {
            pix2 = (x2 + y2)<<2;
            // blend only if im2 has opacity in this point
            if ( 0 < im2[pix2+3] ) blend(im, im2, (x + y)<<2, pix2, notSupportClamp);
            // next pixels
            x++; if (x>=W1) { x = startX; y += w; }
            x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
        }
        return im; 
    }
});

}(FILTER);