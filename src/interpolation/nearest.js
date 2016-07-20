/**
*
* Filter Interpolation methods
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var clamp = FILTER.Math.clamp, IMG = FILTER.ImArray;

// http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
FILTER.Interpolation.nearest = function( im, w, h, nw, nh ) {
    var size = (nw*nh)<<2, interpolated = new IMG(size),
        rx = (w-1)/nw, ry = (h-1)/nh, 
        i, j, x, y, xi, yi, pixel, index,
        yw, xoff, yoff, w4 = w<<2
    ;
    i=0; j=0; x=0; y=0; yi=0; yw=0; yoff=0;
    for (index=0; index<size; index+=4,j++,x+=rx) 
    {
        if ( j >= nw ) { j=0; x=0; i++; y+=ry; yi=~~y; yw=yi*w; yoff=y - yi<0.5 ? 0 : w4; }
        
        xi = ~~x; xoff = x - xi<0.5 ? 0 : 4;
        
        pixel = ((yw + xi)<<2) + xoff + yoff;

        interpolated[index]      = im[pixel];
        interpolated[index+1]    = im[pixel+1];
        interpolated[index+2]    = im[pixel+2];
        interpolated[index+3]    = im[pixel+3];
    }
    return interpolated;
};

}(FILTER);