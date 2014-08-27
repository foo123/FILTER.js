/**
*
* Histogram Equalize for grayscale images Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    @@USE_STRICT@@
    
    var notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F;
    
    // a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
    FILTER.GrayscaleHistogramEqualizeFilter = FILTER.Create({
        name: "GrayscaleHistogramEqualizeFilter"
        
        ,path: FILTER.getPath( )
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            var self = this;
            if ( !self._isOn ) return im;
            var c, g, rangeI, maxI=0, minI=255,
                cdfI, accum=0, t0, t1, t2,
                i, l=im.length, l2=l>>2, n=1.0/(l2)
                ;
            
            // initialize the arrays
            cdfI = new A32F(256);
            for (i=0; i<256; i+=4)
            { 
                // partial loop unrolling
                cdfI[i]=0; 
                cdfI[i+1]=0; 
                cdfI[i+2]=0; 
                cdfI[i+3]=0; 
            }
            
            // compute pdf and maxima/minima
            for (i=0; i<l; i+=4)
            {
                c = im[i];  // image is already grayscale
                cdfI[c] += n;
                
                if (c>maxI) maxI=c;
                else if (c<minI) minI=c;
            }
            
            // compute cdf
            accum = 0;
            for (i=0; i<256; i+=4)
            { 
                // partial loop unrolling
                accum += cdfI[i]; cdfI[i] = accum;
                accum += cdfI[i+1]; cdfI[i+1] = accum;
                accum += cdfI[i+2]; cdfI[i+2] = accum;
                accum += cdfI[i+3]; cdfI[i+3] = accum;
            }
            
            // equalize the grayscale/intesity channels
            rangeI = maxI-minI;
            if (notSupportClamp)
            {   
                for (i=0; i<l; i+=4)
                { 
                    c = im[i]; // grayscale image has same value in all channels
                    g = cdfI[c]*rangeI + minI;
                    // clamp them manually
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    g = ~~g;
                    im[i] = g; im[i+1] = g; im[i+2] = g; 
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                { 
                    c = im[i]; // grayscale image has same value in all channels
                    g = ~~( cdfI[c]*rangeI + minI );
                    im[i] = g; im[i+1] = g; im[i+2] = g; 
                }
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);