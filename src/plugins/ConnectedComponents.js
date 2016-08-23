/**
*
* Connected Components Extractor Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var A32F = FILTER.Array32F, MODE = FILTER.MODE,
    HUE = FILTER.Color.hue, INTENSITY = FILTER.Color.intensity,
    min = Math.min, max = Math.max, cos = Math.cos, toRad = FILTER.CONST.toRad,
    connected_components = FILTER.MachineLearning.connected_components;

FILTER.Create({
    name: "ConnectedComponentsFilter"
    
    // parameters
    ,connectivity: 4
    ,tolerance: 1e-6
    ,mode: MODE.COLOR
    ,color: null
    ,invert: false
    ,box: null
    //,hasMeta: true
    
    // this is the filter constructor
    ,init: function( connectivity, tolerance, mode, color, invert ) {
        var self = this;
        self.connectivity = 8 === connectivity ? 8 : 4;
        self.tolerance = null == tolerance ? 1e-6 : +tolerance;
        self.mode = mode || MODE.COLOR;
        self.color = null == color ? null : +color;
        self.invert = !!invert;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
             connectivity: self.connectivity
            ,tolerance: self.tolerance
            ,color: self.color
            ,invert: self.invert
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.connectivity = params.connectivity;
        self.tolerance = params.tolerance;
        self.color = params.color;
        self.invert = params.invert;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function( im, w, h ) {
        var self = this, imLen = im.length, imSize = imLen>>>2,
            mode = self.mode||MODE.COLOR, color = self.color,
            delta = min(0.999, max(0.0, self.tolerance||0.0)),
            i, j, D = new A32F(imSize);
        
        if ( MODE.HUE === mode )
        {
            if ( null != color ) color = cos(toRad*color);
            for(i=0,j=0; i<imLen; i+=4,j++)
                D[j] = 0 === im[i+3] ? -10000 : cos(toRad*HUE(im[i],im[i+1],im[i+2]));
        }
        else if ( MODE.INTENSITY === mode )
        {
            delta *= 255;
            for(i=0,j=0; i<imLen; i+=4,j++)
                D[j] = 0 === im[i+3] ? -10000 : INTENSITY(im[i],im[i+1],im[i+2]);
        }
        else //if ( MODE.COLOR === mode )
        {
            delta = (delta*0xff)|0;
            delta = (delta<<16)|(delta<<8)|delta;
            for(i=0,j=0; i<imLen; i+=4,j++)
                D[j] = 0 === im[i+3] ? -0xffffffff : (im[i]<<16)|(im[i+1]<<8)|im[i+2];
        }
        // return the connected image data
        return connected_components(2, im, D, w, h, self.connectivity, self.invert, delta, color);
    }
});

}(FILTER);