/**
*
* RGB Histogram Equalize Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    @@USE_STRICT@@
    
    var notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F;
    
    // a sample histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
    // not the best implementation
    // used for illustration purposes on how to create a plugin filter
    FILTER.RGBHistogramEqualizeFilter = FILTER.Create({
        name: "RGBHistogramEqualizeFilter"
        
        ,path: FILTER.getPath( )
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            var self = this;
            if ( !self._isOn ) return im;
            var r,g,b, rangeR, rangeG, rangeB,
                maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
                cdfR, cdfG, cdfB,
                accumR, accumG, accumB, t0, t1, t2,
                i, l=im.length, l2=l>>2, n=1.0/(l2)
            ;
            
            // initialize the arrays
            cdfR=new A32F(256); cdfG=new A32F(256); cdfB=new A32F(256);
            for (i=0; i<256; i+=4)
            { 
                // partial loop unrolling
                cdfR[i]=0; cdfG[i]=0; cdfB[i]=0; 
                cdfR[i+1]=0; cdfG[i+1]=0; cdfB[i+1]=0; 
                cdfR[i+2]=0; cdfG[i+2]=0; cdfB[i+2]=0; 
                cdfR[i+3]=0; cdfG[i+3]=0; cdfB[i+3]=0; 
            }
            
            // compute pdf and maxima/minima
            for (i=0; i<l; i+=4)
            {
                r = im[i]; g = im[i+1]; b = im[i+2];
                cdfR[r] += n; cdfG[g] += n; cdfB[b] += n;
                
                if (r>maxR) maxR=r;
                else if (r<minR) minR=r;
                if (g>maxG) maxG=g;
                else if (g<minG) minG=g;
                if (b>maxB) maxB=b;
                else if (b<minB) minB=b;
            }
            
            // compute cdf
            accumR=accumG=accumB=0;
            for (i=0; i<256; i+=4)
            { 
                // partial loop unrolling
                accumR+=cdfR[i]; cdfR[i]=accumR; 
                accumG+=cdfG[i]; cdfG[i]=accumG; 
                accumB+=cdfB[i]; cdfB[i]=accumB; 
                accumR+=cdfR[i+1]; cdfR[i+1]=accumR; 
                accumG+=cdfG[i+1]; cdfG[i+1]=accumG; 
                accumB+=cdfB[i+1]; cdfB[i+1]=accumB; 
                accumR+=cdfR[i+2]; cdfR[i+2]=accumR; 
                accumG+=cdfG[i+2]; cdfG[i+2]=accumG; 
                accumB+=cdfB[i+2]; cdfB[i+2]=accumB; 
                accumR+=cdfR[i+3]; cdfR[i+3]=accumR; 
                accumG+=cdfG[i+3]; cdfG[i+3]=accumG; 
                accumB+=cdfB[i+3]; cdfB[i+3]=accumB; 
            }
            
            // equalize each channel separately
            rangeR=maxR-minR; rangeG=maxG-minG; rangeB=maxB-minB;
            if (notSupportClamp)
            {   
                for (i=0; i<l; i+=4)
                { 
                    r = im[i]; g = im[i+1]; b = im[i+2]; 
                    t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                    im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                { 
                    r = im[i]; g = im[i+1]; b = im[i+2]; 
                    t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                    im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
                }
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);