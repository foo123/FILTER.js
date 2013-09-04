/**
*
* Histogram Equalize Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    // a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
    // used for illustration purposes on how to create a plugin filter
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
                cdfI=new FILTER.Array32F(256), accum=0,
                i, y, l=im.length, n=1.0/(l>>2), ycbcr, ycbcrA=new Array(l>>2), rgba,
                RGB2YCbCr=FILTER.Color.RGB2YCbCr, YCbCr2RGB=FILTER.Color.YCbCr2RGB
                ;
            
            // initialize the arrays
            i=0; while (i<256) { pdfI[i]=0; cdfI[i]=0; i++; }
            
            // compute pdf and maxima/minima
            i=0; y=0;
            while (i<l)
            {
                r=im[i]; g=im[i+1]; b=im[i+2];
                ycbcr=RGB2YCbCr({red:r, green:g, blue:b});
                pdfI[ycbcr.Y]+=n;
                
                if (ycbcr.Y>maxI) maxI=ycbcr.Y;
                if (ycbcr.Y<minI) minI=ycbcr.Y;
                
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
                ycbcr.Y=cdfI[ycbcr.Y]*rangeI+minI;
                rgba=YCbCr2RGB(ycbcr);
                im[i]=rgba.red; im[i+1]=rgba.green; im[i+2]=rgba.blue; 
                i+=4; y++; 
            }
            
            // return the new image data
            return im;
        }
    });
    
})(FILTER);