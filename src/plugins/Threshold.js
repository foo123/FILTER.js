/**
*
* Threshold Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var TypedArray = FILTER.Util.Array.typed, HUE = FILTER.Color.hue;

// a plugin to apply a general threshold filtering to an image
FILTER.Create({
    name: "ThresholdFilter"
    
    // filter parameters
    ,thresholds: null
    // NOTE: quantizedColors should contain 1 more element than thresholds
    ,quantizedColors: null
    ,asHue: false
    
    // constructor
    ,init: function( thresholds, quantizedColors, asHue ) {
        var self = this;
        self.thresholds = thresholds;
        self.quantizedColors = quantizedColors || null;
        self.asHue = !!asHue;
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
                ,asHue: self.asHue
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
            self.asHue = params.asHue;
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
        
        var color, hue, i, j, l=im.length,
            thresholds=self.thresholds, tl=thresholds.length, colors=self.quantizedColors, cl=colors.length
        ;
        
        if ( self.asHue )
        {
            for (i=0; i<l; i+=4)
            {
                if ( 0 === im[i+3] ) continue;
                hue = HUE(im[i], im[i+1], im[i+2]);
                // maybe use sth faster here ??
                j=0; while (j<tl && hue>thresholds[j]) j++;
                color = j < cl ? colors[j] : 0xffffff;
                im[i] = (color >>> 16) & 255; im[i+1] = (color >>> 8) & 255; im[i+2] = color & 255;
                //im[i+3] = (color >>> 24) & 255;
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                if ( 0 === im[i+3] ) continue;
                color = /*(im[i+3] << 24) |*/ (im[i] << 16) | (im[i+1] << 8) | (im[i+2]&255);
                // maybe use sth faster here ??
                j=0; while (j<tl && color>thresholds[j]) j++;
                color = j < cl ? colors[j] : 0xffffff;
                im[i] = (color >>> 16) & 255; im[i+1] = (color >>> 8) & 255; im[i+2] = color & 255;
                //im[i+3] = (color >>> 24) & 255;
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);