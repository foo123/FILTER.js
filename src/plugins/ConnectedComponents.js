/**
*
* Connected Components Extractor Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var MODE = FILTER.MODE, min = Math.min, max = Math.max,
    abs = Math.abs, cos = Math.cos, toRad = FILTER.CONST.toRad;

/*function dist_v( a, b, delta )
{
    return (abs(a-b) <= delta);
}

function dist_rgb( a, b, delta )
{
    return (a === b) || (
        (-1 !== a && -1 !== b) && 
        (abs(((a>>16)&255)-((b>>16)&255))<=delta) &&
        (abs(((a>>8)&255)-((b>>8)&255))<=delta) &&
        (abs((a&255)-(b&255))<=delta)
    );
}*/

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
    ,init: function( connectivity, tolerance, color, invert ) {
        var self = this;
        self.connectivity = 8 === connectivity ? 8 : 4;
        self.tolerance = null == tolerance ? 1e-6 : +tolerance;
        self.color = null == color ? null : +color;
        self.invert = !!invert;
        self.mode = MODE.COLOR;
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
            i, j, D = new FILTER.Array32F(imSize), //dist,
            HUE = FILTER.Color.hue, INTENSITY = FILTER.Color.intensity;
        
        if ( MODE.HUE === mode )
        {
            if ( null != color ) color = cos(toRad*color);
            for(i=0,j=0; i<imLen; i+=4,j++)
                D[j] = 0 === im[i+3] ? 10000 : cos(toRad*HUE(im[i],im[i+1],im[i+2]));
        }
        else if ( MODE.INTENSITY === mode )
        {
            delta *= 255;
            for(i=0,j=0; i<imLen; i+=4,j++)
                D[j] = 0 === im[i+3] ? 10000 : INTENSITY(im[i],im[i+1],im[i+2]);
        }
        else if ( MODE.GRAY === mode )
        {
            delta *= 255;
            for(i=0,j=0; i<imLen; i+=4,j++)
                D[j] = 0 === im[i+3] ? 10000 : im[i];
        }
        else //if ( MODE.COLOR === mode )
        {
            delta = (delta*0xff)|0;
            delta = (delta<<16) | (delta<<8) | delta;
            for(i=0,j=0; i<imLen; i+=4,j++)
                D[j] = 0 === im[i+3] ? 0xffffffff : (im[i]<<16) | (im[i+1]<<8) | im[i+2];
        }
        // return the connected image data
        return FILTER.MachineLearning.connected_components(im, w, h, 2, D, self.connectivity, delta, color, self.invert);
    }
});

}(FILTER);