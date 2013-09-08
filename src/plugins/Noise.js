/**
*
* Noise Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    var notSupportTyped=FILTER._notSupportTypedArrays;
    
    // a sample noise filter
    // used for illustration purposes on how to create a plugin filter
    FILTER.NoiseFilter=FILTER.Create({
        // parameters
        min: -127,
        max: 127,
        
        // this is the filter constructor
        init: function(min, max) {
            this.min=min||-127;
            this.max=max||127;
        },
        
        // this is the filter actual apply method routine
        apply: function(im, w, h) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // for this filter, no need to clone the image data, operate in-place
            var range=this.max-this.min, rand=Math.random, m=this.min,
                i, l=im.length, n, r, g, b, t0, t1, t2
                ;
            
            // add noise
            i=0; 
            while (i<l) 
            { 
                r=im[i]; g=im[i+1]; b=im[i+2];
                n=range*rand()+m;
                t0=r+n; t1=g+n; t2=b+n; 
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