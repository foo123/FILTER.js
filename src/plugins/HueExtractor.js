/**
*
* Hue Extractor Plugin
* @package FILTER.js
*
**/
(function(FILTER){

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
                r,g,b, dst,
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
                
                if (hue>=hMin && hue<=hMax) {  dst[i] = im[i]; dst[i+1]=im[i+1]; dst[i+2]=im[i+2]; dst[i+3]=im[i+3]; }
                else { dst[i] = background.r; dst[i+1]=background.g; dst[i+2]=background.b; dst[i+3]=background.a; }
                i+=4;
            }
            
            // return the new image data
            return dst;
        }
    });
    
})(FILTER);