/**
*
* HSV Converter Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    var notSupportTyped=FILTER._notSupportTypedArrays, RGB2HSV=FILTER.Color.RGB2HSV,                 
        toCol=0.70833333333333333333333333333333 // 255/360
        ;
    
    // a plugin to convert an RGB Image to an HSV Image
    FILTER.HSVConverterFilter=FILTER.Create({
        
        // this is the filter actual apply method routine
        apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            
            var 
                r,g,b, i, l=im.length, hsv, h, s, v, t0, t1, t2
                ;
            
            i=0;
            while (i<l)
            {
                r=im[i]; g=im[i+1]; b=im[i+2];
                hsv=RGB2HSV({r:r, g:g, b:b});
                h=hsv.h*toCol; s=hsv.s*255; v=hsv.v;
                t0=h; t1=v; t2=s;
                if (notSupportTyped)
                {   
                    // clamp them manually
                    if (t0<0) t0=0;
                    else if (t0>255) t0=255;
                    if (t1<0) t1=0;
                    else if (t1>255) t1=255;
                    if (t2<0) t2=0;
                    else if (t2>255) t2=255;
                }
                im[i]=~~t0; im[i+1]=~~t1; im[i+2]=~~t2; 
                i+=4;
            }
            
            // return the new image data
            return im;
        }
    });
    
})(FILTER);