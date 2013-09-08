/**
*
* RGB Histogram Equalize Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    var notSupportTyped=FILTER._notSupportTypedArrays;
    
    // a sample histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
    // not the best implementation
    // used for illustration purposes on how to create a plugin filter
    FILTER.RGBHistogramEqualizeFilter=FILTER.Create({
        
        // this is the filter actual apply method routine
        apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            var 
                r,g,b, rangeR, rangeG, rangeB,
                maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
                pdfR=new FILTER.Array32F(256), pdfG=new FILTER.Array32F(256), pdfB=new FILTER.Array32F(256),
                cdfR=new FILTER.Array32F(256), cdfG=new FILTER.Array32F(256), cdfB=new FILTER.Array32F(256),
                accumR, accumG, accumB, t0, t1, t2,
                i, l=im.length, l2=l>>2, n=1.0/(l2)
                ;
            
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
                t0=cdfR[r]*rangeR+minR; t1=cdfG[g]*rangeG+minG; t2=cdfB[b]*rangeB+minB; 
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