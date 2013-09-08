/**
*
* Alpha Mask Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    var notSupportTyped=FILTER._notSupportTypedArrays;
    
    // a plugin to mask an image using the alpha channel of another image
    FILTER.AlphaMaskFilter=FILTER.Create({
        
        // parameters
        alphaMask : null,
        centerX : 0,
        centerY : 0,
        
        // constructor
        init : function(alphaMask, centerX, centerY) {
            this.alphaMask=alphaMask||null;
            this.centerX=centerX||0;
            this.centerY=centerY||0;
        },
        
        // this is the filter actual apply method routine
        apply: function(im, w, h) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // for this filter, no need to clone the image data, operate in-place
            
            if (!this.alphaMask) return im;
            
            var 
                alpha=this.alphaMask.getData(),
                i, l=im.length, l2=alpha.length, 
                w2=this.alphaMask.width, h2=this.alphaMask.height,
                x, x2, y, y2, off, xc, yc, 
                wm=Math.min(w,w2), hm=Math.min(h, h2),  cX, cY, 
                dw=(w-w2)>>1, dh=(h-h2)>>1
                ;
            
            
            cX=this.centerX + dw; cY=this.centerY + dh;
            i=0; x=0; y=0; /*x2=0; y2=0;*/
            while (i<l)
            {
                xc=x - cX; yc=y - cY;
                if (xc>=0 && xc<wm && yc>=0 && yc<hm)
                {
                    // copy alpha channel
                    off=(xc + yc*w2)<<2;
                    im[i+3]=alpha[off+3];
                }
                else
                {
                    // better to remove the alpha channel if mask dimensions are different??
                    im[i+3]=0;
                }
                i+=4;  x++; if (x>=w) { x=0; y++; }  //x2++; if (x2>=w2) { x2=0; y2++; }
            }
            
            // return the new image data
            return im;
        }
    });
    
})(FILTER);