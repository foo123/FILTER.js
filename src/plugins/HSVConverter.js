/**
*
* HSV Converter Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

//toCol = 0.70833333333333333333333333333333 // 255/360
var notSupportClamp = FILTER._notSupportClamp, MODE = FILTER.MODE, CHANNEL = FILTER.CHANNEL,
    HUE = FILTER.Color.hue, RGB2HSV = FILTER.Color.RGB2HSV, subarray = FILTER.Util.Array.subarray;

// a plugin to convert an RGB Image to an HSV Image
FILTER.Create({
    name: "HSVConverterFilter"
    
    ,path: FILTER_PLUGINS_PATH
    
    ,mode: MODE.HSV
    
    ,init: function( mode ) {
        var self = this;
        self.mode = mode || MODE.HSV;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 mode: self.mode
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.mode = params.mode;
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
        var /*r,g,b,*/ i, l=im.length, hsv, t0, t1, t2, mode = self.mode,
            H = CHANNEL.H, S = CHANNEL.S, V = CHANNEL.V;
        
        if ( notSupportClamp )
        {   
            if ( MODE.HUE === mode )
            {
                for (i=0; i<l; i+=4)
                {
                    hsv = ~~(HUE(im[i],im[i+1],im[i+2])*0.70833333333333333333333333333333);
                    // clamp them manually
                    hsv = hsv<0 ? 0 : (hsv>255 ? 255 : hsv);
                    im[i] = hsv; im[i+1] = hsv; im[i+2] = hsv; 
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                {
                    //r = im[i]; g = im[i+1]; b = im[i+2];
                    hsv = RGB2HSV([im[i],im[i+1],im[i+2]],0);
                    t0 = hsv[0]*0.70833333333333333333333333333333; t2 = hsv[1]*255; t1 = hsv[2];
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    im[i+H] = ~~t0; im[i+S] = ~~t1; im[i+V] = ~~t2; 
                }
            }
        }
        else
        {
            if ( MODE.HUE === mode )
            {
                for (i=0; i<l; i+=4)
                {
                    hsv = ~~(HUE(im[i],im[i+1],im[i+2])*0.70833333333333333333333333333333);
                    im[i] = hsv; im[i+1] = hsv; im[i+2] = hsv; 
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                {
                    //r = im[i]; g = im[i+1]; b = im[i+2];
                    hsv = RGB2HSV([im[i],im[i+1],im[i+2]],0);
                    t0 = hsv[0]*0.70833333333333333333333333333333; t2 = hsv[1]*255; t1 = hsv[2];
                    im[i+H] = ~~t0; im[i+S] = ~~t1; im[i+V] = ~~t2; 
                }
            }
        }
        // return the new image data
        return im;
    }
});

}(FILTER);