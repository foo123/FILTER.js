/**
*
* YCbCr Converter Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    var RGB2YCBCR=FILTER.Color.RGB2YCbCr;
    
    // a plugin to convert an RGB Image to an YCbCr Image
    FILTER.YCbCrConverterFilter=FILTER.Create({
        
        name : "YCbCrConverterFilter",
        
        // this is the filter actual apply method routine
        apply: function(im, w, h) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // for this filter, no need to clone the image data, operate in-place
            
            var 
                r,g,b, i, l=im.length, ycbcr
                ;
            
            i=0;
            while (i<l)
            {
                r=im[i]; g=im[i+1]; b=im[i+2];
                ycbcr=RGB2YCBCR({r:r, g:g, b:b});
                im[i]=ycbcr.cr; im[i+1]=ycbcr.y; im[i+2]=ycbcr.cb;
                i+=4;
            }
            
            // return the new image data
            return im;
        }
    });
    
})(FILTER);