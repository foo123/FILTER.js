/**
*
* Noise Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    // a sample noise filter
    // not the best implementation
    // used for illustration puproses on how to create a plugin filter
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
                i, l=im.length, n
                ;
            
            // add noise
            i=0; 
            while (i<l) 
            { 
                r=im[i]; g=im[i+1]; b=im[i+2];
                n=range*rand()+m;
                im[i]=r+n; im[i+1]=g+n; im[i+2]=b+n; 
                i+=4; 
            }
            
            // return the new image data
            return im;
        }
    });
    
})(FILTER);