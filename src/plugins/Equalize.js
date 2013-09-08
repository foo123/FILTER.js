/**
*
* Histogram Equalize Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    var notSupportTyped=FILTER._notSupportTypedArrays;
    
    // a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
    FILTER.HistogramEqualizeFilter=FILTER.Create({
        
        // this is the filter actual apply method routine
        apply: function(im, w, h) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // for this filter, no need to clone the image data, operate in-place
            var 
                r,g,b, rangeI,
                maxI=0, minI=255,
                pdfI=new FILTER.Array32F(256),
                cdfI=new FILTER.Array32F(256), accum=0, t0, t1, t2,
                i, y, l=im.length, l2=l>>2, n=1.0/(l2), ycbcr, ycbcrA=new Array(l2), rgba,
                RGB2YCbCr=FILTER.Color.RGB2YCbCr, YCbCr2RGB=FILTER.Color.YCbCr2RGB
                ;
            
            // initialize the arrays
            i=0; while (i<256) { pdfI[i]=0; cdfI[i]=0; i++; }
            
            // compute pdf and maxima/minima
            i=0; y=0;
            while (i<l)
            {
                r=im[i]; g=im[i+1]; b=im[i+2];
                ycbcr=RGB2YCbCr({r:r, g:g, b:b});
                pdfI[ycbcr.y]+=n;
                
                if (ycbcr.y>maxI) maxI=ycbcr.y;
                if (ycbcr.y<minI) minI=ycbcr.y;
                
                ycbcrA[y]=ycbcr;
                i+=4; y++;
            }
            
            // compute cdf
            accum=0; i=0; 
            while (i<256) { accum+=pdfI[i]; cdfI[i]=accum; i++; }
            pdfI=null;  // free the space
            
            // equalize only the intesity channel
            rangeI=maxI-minI;
            i=0; y=0;
            while (i<l) 
            { 
                ycbcr=ycbcrA[y];
                ycbcr.y=cdfI[ycbcr.y]*rangeI+minI;
                rgba=YCbCr2RGB(ycbcr);
                t0=rgba.r; t1=rgba.g; t2=rgba.b; 
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
                i+=4; y++; 
            }
            
            // return the new image data
            return im;
        }
    });
    
})(FILTER);