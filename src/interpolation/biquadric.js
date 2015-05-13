/**
*
* Filter Interpolation methods
* @package FILTER.js
*
**/
!function(FILTER, undef){
@@USE_STRICT@@

var clamp = FILTER.Math.clamp, IMG = FILTER.ImArray, A32F = FILTER.Array32F;
FILTER.Interpolation = FILTER.Interpolation || {};

// TODO
// https://code.google.com/a/eclipselabs.org/p/bicubic-interpolation-image-processing/source/browse/trunk/libimage.c
FILTER.Interpolation.biquadric = function( im, w, h, nw, nh ) {
};

}(FILTER);