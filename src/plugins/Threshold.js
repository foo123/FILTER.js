/**
*
* Threshold Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    var notSupportClamp=FILTER._notSupportClamp,
        RGBA2Color=FILTER.Color.RGBA2Color, Color2RGBA=FILTER.Color.Color2RGBA
        ;
    
    // a plugin to apply a general threshold filtering to an image
    FILTER.ThresholdFilter=FILTER.Create({
        
        // filter parameters
        thresholds : null,
        // NOTE: quantizedColors should contain 1 more element than thresholds
        quantizedColors : null,
        
        name : "ThresholdFilter",
        
        // constructor
        init : function(thresholds, quantizedColors) {
            this.thresholds=thresholds;
            this.quantizedColors=quantizedColors||null;
        },
        
        
        // this is the filter actual apply method routine
        apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            
            if (!this.thresholds || !this.thresholds.length) return im;
            else if (!this.quantizedColors || !this.quantizedColors.length) return im;
            
            var 
                t0, t1, t2, t3, color, rgba,
                i, j, l=im.length,
                thresholds=this.thresholds, tl=thresholds.length, colors=this.quantizedColors, cl=colors.length
                ;
            
            i=0;
            while (i<l)
            {
                color=RGBA2Color({r:im[i], g:im[i+1], b:im[i+2], a:im[i+3]});
                
                // maybe use sth faster here ??
                j=0; while (j<tl && color>thresholds[j]) j++;
                color= (j<cl) ? colors[j] : color=255;
                
                rgba=Color2RGBA(color);
                t0=rgba.r; t1=rgba.g; t2=rgba.b; t3=rgba.a;
                
                /*if (notSupportClamp)
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
                }*/
                im[i]=t0; im[i+1]=t1; im[i+2]=t2; im[i+3]=t3;
                i+=4;
            }
            
            // return the new image data
            return im;
        }
    });
    
})(FILTER);