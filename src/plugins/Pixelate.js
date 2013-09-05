/**
*
* Pixelate Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    var Sqrt=Math.sqrt;
    
    // a sample pixelate filter
    // used for illustration purposes on how to create a plugin filter
    FILTER.PixelateFilter=FILTER.Create({
        // parameters
        scale: 1,
        
        // this is the filter constructor
        init: function(scale) {
            this.scale=scale || 1;
        },
        
        // this is the filter actual apply method routine
        apply: function(im, w, h) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            if (this.scale<=1) return im;
            
            var imLen=im.length, imArea=w*h, step=~~(Sqrt(imArea)*this.scale*0.01), 
                size=step*step, inv_size=1.0/size, jws=step*w,
                x, y, yw, px, py, xOff, yOff, i
                ;
            
            x=0; y=0; yw=0;
            while (y<h) 
            { 
                r=0.0; g=0.0; b=0.0;
                px=0; py=0; pyw=0;
                // take simple average
                // using a smoothing window here could be better (eg a gaussian)
                while (py<step) 
                { 
                    xOff=x+px; yOff=yw+pyw;
                    if (xOff<w && yOff<imArea)
                    {
                        i=(xOff + yOff)<<2; 
                        r+=inv_size*im[i]; g+=inv_size*im[i+1]; b+=inv_size*im[i+2]; 
                    }
                    px++; if (px>=step) { px=0; py++; pyw+=w; }
                }
                r=~~r; g=~~g; b=~~b;
                px=0; py=0; pyw=0;
                while (py<step) 
                { 
                    xOff=x+px; yOff=yw+pyw;
                    if (xOff<w && yOff<imArea)
                    {
                        i=(xOff + yOff)<<2; 
                        im[i]=r; im[i+1]=g; im[i+2]=b; 
                    }
                    px++; if (px>=step) { px=0; py++; pyw+=w; }
                }
                x+=step; if (x>=w) {x=0; y+=step; yw+=jws; } 
            }
            // return the pixelated image data
            return im;
        }
    });
    
})(FILTER);