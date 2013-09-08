/**
*
* Hue Extractor Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    var notSupportTyped=FILTER._notSupportTypedArrays;
    
    // a plugin to extract regions based on a HUE range
    FILTER.HueExtractorFilter=FILTER.Create({
        
        // filter parameters
        range : null,
        background : 0,
        
        // constructor
        init : function(range, background) {
            this.range=range;
            this.range.sort();
            this.background=background||0;
        },
        
        
        // this is the filter actual apply method routine
        apply: function(im, w, h) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // for this filter, no need to clone the image data, operate in-place
            
            if (!this.range || !this.range.length) return im;
            
            var 
                r,g,b, dst, t0, t1, t2, t3,
                i, l=im.length, background, hue,
                RGB2HSV=FILTER.Color.RGB2HSV, HSV2RGB=FILTER.Color.HSV2RGB,
                hMin=this.range[0], hMax=this.range[this.range.length-1]
                ;
            
            dst=new FILTER.ImArray(l);
            background=FILTER.Color.Color2RGBA(this.background||0);
            
            i=0;
            while (i<l)
            {
                r=im[i]; g=im[i+1]; b=im[i+2];
                hue=RGB2HSV({r:r, g:g, b:b}).h;
                
                if (hue>=hMin && hue<=hMax) {  t0 = im[i]; t1=im[i+1]; t2=im[i+2]; t3=im[i+3]; }
                else { t0 = background.r; t1=background.g; t2=background.b; t3=background.a; }
                if (notSupportTyped)
                {   
                    // clamp them manually
                    if (t0<0) t0=0;
                    else if (t0>255) t0=255;
                    if (t1<0) t1=0;
                    else if (t1>255) t1=255;
                    if (t2<0) t2=0;
                    else if (t2>255) t2=255;
                    if (t3<0) t3=0;
                    else if (t3>255) t3=255;
                }
                dst[i]=~~t0; dst[i+1]=~~t1; dst[i+2]=~~t2; dst[i+3]=~~t3;
                i+=4;
            }
            
            // return the new image data
            return dst;
        }
    });
    
})(FILTER);