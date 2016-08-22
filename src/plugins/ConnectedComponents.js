/**
*
* Connected Components Extractor Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var MODE = FILTER.MODE, HUE = FILTER.Color.hue, INTENSITY = FILTER.Color.intensity,
    min = Math.min, max = Math.max, abs = Math.abs,
    connected_components = FILTER.MachineLearning.connected_components;

function similar_hue( im, p1, p2, ARGS )
{
    if ( 0===im[p1+3] && 0===im[p2+3] ) return true;
    var i1 = p1 >>> 2, i2 = p2 >>> 2, memo = ARGS[1];
    if ( null == memo[i1] ) memo[i1] = HUE(im[p1],im[p1+1],im[p1+2]);
    if ( null == memo[i2] ) memo[i2] = HUE(im[p2],im[p2+1],im[p2+2]);
    return abs(memo[i1],memo[i2])<=ARGS[0];
}
function similar_to_hue( im, p1, ARGS )
{
    var i1 = p1 >>> 2, memo = ARGS[1];
    if ( null == memo[i1] ) memo[i1] = HUE(im[p1],im[p1+1],im[p1+2]);
    return abs(memo[i1],ARGS[2])<=ARGS[0];
}
function similar_intensity( im, p1, p2, ARGS )
{
    if ( 0===im[p1+3] && 0===im[p2+3] ) return true;
    var i1 = p1 >>> 2, i2 = p2 >>> 2, memo = ARGS[1];
    if ( null == memo[i1] ) memo[i1] = INTENSITY(im[p1],im[p1+1],im[p1+2]);
    if ( null == memo[i2] ) memo[i2] = INTENSITY(im[p2],im[p2+1],im[p2+2]);
    return abs(memo[i1],memo[i2])<=ARGS[0];
}
function similar_to_intensity( im, p1, ARGS )
{
    var i1 = p1 >>> 2, memo = ARGS[1];
    if ( null == memo[i1] ) memo[i1] = INTENSITY(im[p1],im[p1+1],im[p1+2]);
    return abs(memo[i1],ARGS[2])<=ARGS[0];
}
function similar_color( im, p1, p2, ARGS )
{
    var delta = ARGS[0];
    return (0===im[p1+3] && 0===im[p2+3]) || (abs(im[p1]-im[p2])<=delta && abs(im[p1+1]-im[p2+1])<=delta && abs(im[p1+2]-im[p2+2])<=delta);
}
function similar_to_color( im, p1, ARGS )
{
    var col = ARGS[2], delta = ARGS[0];
    return abs(im[p1]-col[0])<=delta && abs(im[p1+1]-col[1])<=delta && abs(im[p1+2]-col[2])<=delta;
}
                
FILTER.Create({
    name: "ConnectedComponentsFilter"
    
    // parameters
    ,connectivity: 4
    ,tolerance: 0.0
    ,mode: MODE.COLOR
    ,color: null
    ,invert: false
    ,box: null
    //,hasMeta: true
    
    // this is the filter constructor
    ,init: function( connectivity, tolerance, mode, color, invert ) {
        var self = this;
        self.connectivity = 8 === connectivity ? 8 : 4;
        self.tolerance = tolerance || 0.0;
        self.mode = mode || MODE.COLOR;
        self.color = null == color ? null : color;
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
    ,apply: function(im, w, h) {
        var self = this, imLen = im.length, imSize = imLen>>>2,
            mode = self.mode||MODE.COLOR, color = self.color,
            delta = min(0.999, max(0.0, self.tolerance||0.0)), memo = null, 
            SIMILAR = null, SIMILAR_TO = null, need_match = null != color;
        
        if ( MODE.HUE === mode )
        {
            delta *= 360;
            memo = new Array(imSize);
            SIMILAR = similar_hue;
            if ( need_match ) SIMILAR_TO = similar_to_hue;
        }
        else if ( MODE.INTENSITY === mode )
        {
            delta *= 255;
            memo = new Array(imSize);
            SIMILAR = similar_intensity;
            if ( need_match ) SIMILAR_TO = similar_to_intensity;
        }
        else //if ( MODE.COLOR === mode )
        {
            delta *= 255;
            SIMILAR = similar_color;
            if ( need_match )
            {
                color = [(color >>> 16)&255, (color >>> 8)&255, color&255];
                SIMILAR_TO = similar_to_color;
            }
        }
        // return the connected image data
        return connected_components(im, im, w, h, self.connectivity, self.invert, SIMILAR, SIMILAR_TO, [delta, memo, color]);
    }
});

}(FILTER);