/**
*
* YCbCr Converter Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp = FILTER._notSupportClamp, CHANNEL = FILTER.CHANNEL,
    subarray = FILTER.Util.Array.subarray, RGB2YCBCR = FILTER.Color.RGB2YCbCr;

// a plugin to convert an RGB Image to an YCbCr Image
FILTER.Create({
    name: "YCbCrConverterFilter"
    
    ,path: FILTER_PLUGINS_PATH
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var r,g,b, i, l=im.length, ycbcr, t0, t1, t2,
            Y = CHANNEL.Y, CB = CHANNEL.CB, CR = CHANNEL.CR;
        
        if ( notSupportClamp )
        {
            for (i=0; i<l; i+=4)
            {
                //r = im[i]; g = im[i+1]; b = im[i+2];
                ycbcr = RGB2YCBCR(subarray(im,i,i+3));
                t0 = ycbcr[2]; t1 = ycbcr[0]; t2 = ycbcr[1];
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                im[i+Y] = t1; im[i+CB] = t2; im[i+CR] = t0;
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                //r = im[i]; g = im[i+1]; b = im[i+2];
                ycbcr = RGB2YCBCR(subarray(im,i,i+3));
                im[i+Y] = ycbcr[0]; im[i+CB] = ycbcr[1]; im[i+CR] = ycbcr[2];
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);