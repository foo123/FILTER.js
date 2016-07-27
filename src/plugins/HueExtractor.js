/**
*
* Hue Extractor Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var HUE = FILTER.Color.hue;

// a plugin to extract regions based on a HUE range
FILTER.Create({
    name: "HueExtractorFilter"
    
    // filter parameters
    ,minHue : 0
    ,maxHue : 360
    ,background : 0
    
    // constructor
    ,init : function( minHue, maxHue, background ) {
        var self = this;
        self.minHue = minHue;
        self.maxHue = maxHue;
        self.background = background || 0;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 minHue: self.minHue
                ,maxHue: self.maxHue
                ,background: self.background
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.minHue = params.minHue;
            self.maxHue = params.maxHue;
            self.background = params.background;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        
        var br, bg, bb, ba, background = self.background||0,
            i, l=im.length, hue, minHue = self.minHue, maxHue = self.maxHue
        ;
        
        br = (background >>> 16) & 255;
        bg = (background >>> 8) & 255;
        bb = background & 255;
        ba = (background >>> 24) & 255;
        
        for (i=0; i<l; i+=4)
        {
            hue = HUE(im[i], im[i+1], im[i+2]);
            if ( (hue<minHue) || (hue>maxHue) ) 
            {  
                im[i] = br; im[i+1] = bg; im[i+2] = bb; im[i+3] = ba; 
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);