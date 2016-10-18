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
            D = new FILTER.Array32F(imSize);
        
        if ( null != color )
        {
            if ( MODE.HUE === mode )
            {
                color = cos(toRad*color);
            }
            else if ( MODE.COLOR === mode )
            {
                var r = ((color >>> 16)&255)/255, g = ((color >>> 8)&255)/255, b = ((color)&255)/255;
                color = 10000*(r+g+b)/3 + 1000*(r+g)/2 + 100*(g+b)/2 + 10*(r+b)/2 + r;
            }
        }
        // compute an appropriate (relational) dissimilarity matrix, based on filter operation mode
        delta = FILTER.Util.Filter.dissimilarity_rgb_2(im, w, h, 2, D, delta, mode);
        // return the connected image data
        return FILTER.MachineLearning.connected_components(im, w, h, 2, D, self.connectivity, delta, color, self.invert);
    }
});

}(FILTER);