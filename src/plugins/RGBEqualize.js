/**
*
* RGB Histogram Equalize Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    // a sample histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
    // not the best implementation
    // used for illustration purposes on how to create a plugin filter
    FILTER.RGBHistogramEqualizeFilter=FILTER.Create({
        // this is the filter constructor
        init: function(param) {
            // lets assume some parameters are needed for this filter
            //this.param=param;
        },
        
        // this is the filter actual apply method routine
        apply: function(im, w, h) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // for this filter, no need to clone the image data, operate in-place
            var 
                r,g,b, rangeR, rangeG, rangeB,
                maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
                pdfR=new FILTER.Array32F(256), pdfG=new FILTER.Array32F(256), pdfB=new FILTER.Array32F(256),
                cdfR=new FILTER.Array32F(256), cdfG=new FILTER.Array32F(256), cdfB=new FILTER.Array32F(256),
                accumR, accumG, accumB,
                i, l=im.length, n=1.0/(l>>2)
                ;
            
            // this.param is available here
            //console.log(this.param);
            
            // initialize the arrays
            i=0; while (i<256) { pdfR[i]=0; pdfG[i]=0; pdfB[i]=0; cdfR[i]=0; cdfG[i]=0; cdfB[i]=0; i++; }
            
            // compute pdf and maxima/minima
            i=0;
            while (i<l)
            {
                r=im[i]; g=im[i+1]; b=im[i+2];
                pdfR[r]+=n; pdfG[g]+=n; pdfB[b]+=n;
                
                if (r>maxR) maxR=r;
                if (r<minR) minR=r;
                if (g>maxG) maxG=g;
                if (g<minG) minG=g;
                if (b>maxB) maxB=b;
                if (b<minB) minB=b;
                i+=4;
            }
            
            // compute cdf
            accumR=accumG=accumB=0; i=0;
            while (i<256) { accumR+=pdfR[i]; cdfR[i]=accumR; accumG+=pdfG[i]; cdfG[i]=accumG; accumB+=pdfB[i]; cdfB[i]=accumB; i++; }
            pdfR=null; pdfG=null; pdfB=null;  // free the space
            
            // equalize each channel separately
            rangeR=maxR-minR; rangeG=maxG-minG; rangeB=maxB-minB;
            i=0; 
            while (i<l) 
            { 
                r=im[i]; g=im[i+1]; b=im[i+2]; 
                im[i]=cdfR[r]*rangeR+minR; im[i+1]=cdfG[g]*rangeG+minG; im[i+2]=cdfB[b]*rangeB+minB; 
                i+=4; 
            }
            
            // return the new image data
            return im;
        }
    });
    
})(FILTER);