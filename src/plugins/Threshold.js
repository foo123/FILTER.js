/**
*
* Threshold Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp = FILTER._notSupportClamp,
    TypedArray = FILTER.TypedArray,
    RGBA2Color = FILTER.Color.RGBA2Color, Color2RGBA = FILTER.Color.Color2RGBA
    ;

// a plugin to apply a general threshold filtering to an image
FILTER.Create({
    name: "ThresholdFilter"
    
    // filter parameters
    ,thresholds: null
    // NOTE: quantizedColors should contain 1 more element than thresholds
    ,quantizedColors: null
    
    // constructor
    ,init: function( thresholds, quantizedColors ) {
        var self = this;
        self.thresholds = thresholds;
        self.quantizedColors = quantizedColors || null;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                thresholds: self.thresholds
                ,quantizedColors: self.quantizedColors
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.thresholds = TypedArray( params.thresholds, Array );
            self.quantizedColors = TypedArray( params.quantizedColors, Array );
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
        if (!self._isOn || !self.thresholds || !self.thresholds.length || 
            !self.quantizedColors || !self.quantizedColors.length) return im;
        
        var color, rgba,
            i, j, l=im.length,
            thresholds=self.thresholds, tl=thresholds.length, colors=self.quantizedColors, cl=colors.length
        ;
        
        for (i=0; i<l; i+=4)
        {
            color = RGBA2Color(im.subarray[i,i+4]);
            
            // maybe use sth faster here ??
            j=0; while (j<tl && color>thresholds[j]) j++;
            color = j < cl ? colors[j] : 255;
            
            rgba = Color2RGBA(color);
            //im.set(rgba,i);
            im[i] = rgba[0]; im[i+1] = rgba[1]; im[i+2] = rgba[2]; im[i+3] = rgba[3];
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);