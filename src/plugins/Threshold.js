/**
*
* Threshold Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var TypedArray = FILTER.Util.Array.typed, MODE = FILTER.MODE,
    HUE = FILTER.Color.hue, INTENSITY = FILTER.Color.intensity;

// a plugin to apply a general threshold filtering to an image
FILTER.Create({
    name: "ThresholdFilter"
    
    // filter parameters
    ,thresholds: null
    // NOTE: quantizedColors should contain 1 more element than thresholds
    ,quantizedColors: null
    ,mode: MODE.COLOR
    
    // constructor
    ,init: function( thresholds, quantizedColors, mode ) {
        var self = this;
        self.thresholds = thresholds;
        self.quantizedColors = quantizedColors || null;
        self.mode = mode || MODE.COLOR;
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
                ,mode: self.mode
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
        if (!self._isOn || !self.thresholds || !self.thresholds.length || 
            !self.quantizedColors || !self.quantizedColors.length) return im;
        
        var color, v, i, j, l=im.length, mode = self.mode||MODE.COLOR,
            thresholds=self.thresholds, tl=thresholds.length, colors=self.quantizedColors, cl=colors.length
        ;
        
        if ( MODE.HUE === mode )
        {
            for (i=0; i<l; i+=4)
            {
                if ( 0 === im[i+3] ) continue;
                v = HUE(im[i], im[i+1], im[i+2]);
                // maybe use sth faster here ??
                j=0; while (j<tl && v>thresholds[j]) j++;
                color = j < cl ? colors[j] : 0xffffff;
                im[i] = (color >>> 16) & 255; im[i+1] = (color >>> 8) & 255; im[i+2] = color & 255;
                //im[i+3] = (color >>> 24) & 255;
            }
        }
        else if ( MODE.INTENSITY === mode )
        {
            for (i=0; i<l; i+=4)
            {
                if ( 0 === im[i+3] ) continue;
                v = INTENSITY(im[i], im[i+1], im[i+2]);
                // maybe use sth faster here ??
                j=0; while (j<tl && v>thresholds[j]) j++;
                color = j < cl ? colors[j] : 0xffffff;
                im[i] = (color >>> 16) & 255; im[i+1] = (color >>> 8) & 255; im[i+2] = color & 255;
                //im[i+3] = (color >>> 24) & 255;
            }
        }
        else //if ( MODE.COLOR === mode )
        {
            for (i=0; i<l; i+=4)
            {
                if ( 0 === im[i+3] ) continue;
                v = /*(im[i+3] << 24) |*/ (im[i] << 16) | (im[i+1] << 8) | (im[i+2]&255);
                // maybe use sth faster here ??
                j=0; while (j<tl && v>thresholds[j]) j++;
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