/**
*
* HSV Converter Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    // a plugin to convert an RGB Image to an HSV Image
    FILTER.HSVConverterFilter=FILTER.Create({
        
        // this is the filter actual apply method routine
        apply: function(im, w, h) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // for this filter, no need to clone the image data, operate in-place
            
            var 
                r,g,b, i, l=im.length, hsv, h, s, v,
                RGB2HSV=FILTER.Color.RGB2HSV, toCol=0.70833333333333333333333333333333 // 255/360
                ;
            
            i=0;
            while (i<l)
            {
                r=im[i]; g=im[i+1]; b=im[i+2];
                hsv=RGB2HSV({r:r, g:g, b:b});
                h=hsv.h*toCol; s=hsv.s*255; v=hsv.v;
                im[i]=h; im[i+1]=v; im[i+2]=s;
                i+=4;
            }
            
            // return the new image data
            return im;
        }
    });
    
})(FILTER);