/**
*
* Histogram Equalize Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    @@USE_STRICT@@
    
    var notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F,
        RGB2YCbCr=FILTER.Color.RGB2YCbCr, YCbCr2RGB=FILTER.Color.YCbCr2RGB
        ;
    
    // a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
    FILTER.HistogramEqualizeFilter = FILTER.Create({
        name : "HistogramEqualizeFilter"
        
        ,path: FILTER.getPath( )
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            var self = this;
            if ( !self._isOn ) return im;
            var r,g,b, rangeI,  maxI = 0, minI = 255,
                cdfI, accum = 0, t0, t1, t2,
                i, y, l=im.length, l2=l>>2, n=1.0/(l2), ycbcr, rgba
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
                r = im[i]; g = im[i+1]; b = im[i+2];
                ycbcr = RGB2YCbCr({r:r, g:g, b:b});
                r = im[i] = ~~ycbcr.cr; g = im[i+1] = ~~ycbcr.y; b = im[i+2] = ~~ycbcr.cb;
                cdfI[ g ] += n;
                
                if ( g>maxI ) maxI=g;
                else if ( g<minI ) minI=g;
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
            
            // equalize only the intesity channel
            rangeI = maxI-minI;
            if (notSupportClamp)
            {   
                for (i=0; i<l; i+=4)
                { 
                    ycbcr = {cr : im[i], y : im[i+1], cb : im[i+2]};
                    ycbcr.y = cdfI[ycbcr.y]*rangeI + minI;
                    rgba = YCbCr2RGB(ycbcr);
                    t0 = rgba.r; t1 = rgba.g; t2 = rgba.b; 
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
                    ycbcr = {cr : im[i], y : im[i+1], cb : im[i+2]};
                    ycbcr.y = cdfI[ycbcr.y]*rangeI + minI;
                    rgba = YCbCr2RGB(ycbcr);
                    im[i] = ~~rgba.r; im[i+1] = ~~rgba.g; im[i+2] = ~~rgba.b; 
                }
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);