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
    ,_blendMode: null
    ,_blendImage: null
    ,blendImage: null
    ,startX: 0
    ,startY: 0
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    // constructor
    ,init: function( blendImage, blendMode ) { 
        var self = this;
        self.startX = 0;
        self.startY = 0;
        self._blendImage = null;
        self.blendImage = null;
        self._blendMode = null;
        if ( blendImage ) self.setImage( blendImage );
        if ( blendMode ) self.setMode( blendMode );
    }
    
    ,dispose: function( ) {
        var self = this;
        self.blendImage = null;
        self._blendImage = null;
        self._blendMode = null;
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
    ,setMode: function( blendMode ) {
        var self = this;
        if ( blendMode )
        {
            self._blendMode = (''+blendMode).toLowerCase();
            if ( !blend_function[HAS](self._blendMode) ) self._blendMode = null;
        }
        else
        {
            self._blendMode = null;
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
                ,_blendMode: self._blendMode
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
            self.setMode( params._blendMode );
        }
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self.startX = 0;
        self.startY = 0;
        self._blendMode = null;
        return self;
    }
    
    // main apply routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this, bImg = self.blendImage;
        if ( !self._isOn || !self._blendMode || !(bImg || self._blendImage) ) return im;
        
        //self._blendImage = self._blendImage || { data: bImg.getData( ), width: bImg.width, height: bImg.height };
        
        var image2 = self._blendImage || { data: bImg.getData( ), width: bImg.width, height: bImg.height },
            startX = self.startX||0, startY = self.startY||0, 
            startX2 = 0, startY2 = 0, W, H, im2, w2, h2, 
            W1, W2, start, end, x, y, x2, y2,
            pix2, blend = blend_function[ self._blendMode ]
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
        start = 0; end = H*W;
        while (start<end)
        {
            pix2 = (x2 + y2)<<2;
            // blend only if im2 has opacity in this point
            if ( im2[pix2+3] ) 
                // calculate and assign blended color
                blend(im, im2, (x + y)<<2, pix2, notSupportClamp);
            
            // next pixels
            start++;
            x++; if (x>=W1) { x = startX; y += w; }
            x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
        }
        return im; 
    }
});

}(FILTER);