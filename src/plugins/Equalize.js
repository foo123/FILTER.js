/**
*
* Histogram Equalize Plugin, Histogram Equalize for grayscale images Plugin, RGB Histogram Equalize Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp = FILTER._notSupportClamp, A32F = FILTER.Array32F,
    //RGB2YCbCr = FILTER.Color.RGB2YCbCr, YCbCr2RGB = FILTER.Color.YCbCr2RGB,
    Min = Math.min, Max = Math.max, subarray = FILTER.Util.Array.subarray
;

// a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
FILTER.Create({
    name : "HistogramEqualizeFilter"
    
    ,path: FILTER_PLUGINS_PATH
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var r, g, b, y, cb, cr, range, max = 0, min = 255,
            cdf, accum, i, l=im.length, l2=l>>2, n=1.0/(l2)
        ;
        
        // initialize the arrays
        cdf = new A32F( 256 );
        /*for (i=0; i<256; i+=32)
        { 
            // partial loop unrolling
            cdf[i   ]=0;
            cdf[i+1 ]=0;
            cdf[i+2 ]=0;
            cdf[i+3 ]=0;
            cdf[i+4 ]=0;
            cdf[i+5 ]=0;
            cdf[i+6 ]=0;
            cdf[i+7 ]=0;
            cdf[i+8 ]=0;
            cdf[i+9 ]=0;
            cdf[i+10]=0;
            cdf[i+11]=0;
            cdf[i+12]=0;
            cdf[i+13]=0;
            cdf[i+14]=0;
            cdf[i+15]=0;
            cdf[i+16]=0;
            cdf[i+17]=0;
            cdf[i+18]=0;
            cdf[i+19]=0;
            cdf[i+20]=0;
            cdf[i+21]=0;
            cdf[i+22]=0;
            cdf[i+23]=0;
            cdf[i+24]=0;
            cdf[i+25]=0;
            cdf[i+26]=0;
            cdf[i+27]=0;
            cdf[i+28]=0;
            cdf[i+29]=0;
            cdf[i+30]=0;
            cdf[i+31]=0;
        }*/
        
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            //ycbcr = RGB2YCbCr(subarray(im,i,i+3));
            r = im[i]; g = im[i+1]; b = im[i+2];
            y = ~~( 0   + 0.299*r    + 0.587*g     + 0.114*b    );
            cb = ~~( 128 - 0.168736*r - 0.331264*g  + 0.5*b      );
            cr = ~~( 128 + 0.5*r      - 0.418688*g  - 0.081312*b );
            // clamp them manually
            cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
            y = y<0 ? 0 : (y>255 ? 255 : y);
            cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
            im[i] = cr; im[i+1] = y; im[i+2] = cb;
            cdf[ y ] += n;
            max = Max(y, max);
            min = Min(y, min);
        }
        
        // compute cdf
        for (accum=0,i=0; i<256; i+=32)
        { 
            // partial loop unrolling
            accum += cdf[i   ]; cdf[i   ] = accum;
            accum += cdf[i+1 ]; cdf[i+1 ] = accum;
            accum += cdf[i+2 ]; cdf[i+2 ] = accum;
            accum += cdf[i+3 ]; cdf[i+3 ] = accum;
            accum += cdf[i+4 ]; cdf[i+4 ] = accum;
            accum += cdf[i+5 ]; cdf[i+5 ] = accum;
            accum += cdf[i+6 ]; cdf[i+6 ] = accum;
            accum += cdf[i+7 ]; cdf[i+7 ] = accum;
            accum += cdf[i+8 ]; cdf[i+8 ] = accum;
            accum += cdf[i+9 ]; cdf[i+9 ] = accum;
            accum += cdf[i+10]; cdf[i+10] = accum;
            accum += cdf[i+11]; cdf[i+11] = accum;
            accum += cdf[i+12]; cdf[i+12] = accum;
            accum += cdf[i+13]; cdf[i+13] = accum;
            accum += cdf[i+14]; cdf[i+14] = accum;
            accum += cdf[i+15]; cdf[i+15] = accum;
            accum += cdf[i+16]; cdf[i+16] = accum;
            accum += cdf[i+17]; cdf[i+17] = accum;
            accum += cdf[i+18]; cdf[i+18] = accum;
            accum += cdf[i+19]; cdf[i+19] = accum;
            accum += cdf[i+20]; cdf[i+20] = accum;
            accum += cdf[i+21]; cdf[i+21] = accum;
            accum += cdf[i+22]; cdf[i+22] = accum;
            accum += cdf[i+23]; cdf[i+23] = accum;
            accum += cdf[i+24]; cdf[i+24] = accum;
            accum += cdf[i+25]; cdf[i+25] = accum;
            accum += cdf[i+26]; cdf[i+26] = accum;
            accum += cdf[i+27]; cdf[i+27] = accum;
            accum += cdf[i+28]; cdf[i+28] = accum;
            accum += cdf[i+29]; cdf[i+29] = accum;
            accum += cdf[i+30]; cdf[i+30] = accum;
            accum += cdf[i+31]; cdf[i+31] = accum;
        }
        
        // equalize only the intesity channel
        range = max-min;
        if (notSupportClamp)
        {   
            for (i=0; i<l; i+=4)
            { 
                //rgba = YCbCr2RGB([cdf[im[i+1]]*range + min, im[i+2], im[i]]);
                y = cdf[im[i+1]]*range + min; cb = im[i+2]; cr = im[i];
                r = ~~( y                      + 1.402   * (cr-128) );
                g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                b = ~~( y + 1.772   * (cb-128) );
                // clamp them manually
                r = r<0 ? 0 : (r>255 ? 255 : r);
                g = g<0 ? 0 : (g>255 ? 255 : g);
                b = b<0 ? 0 : (b>255 ? 255 : b);
                im[i] = r; im[i+1] = g; im[i+2] = b; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            { 
                //rgba = YCbCr2RGB([cdf[im[i+1]]*range + min, im[i+2], im[i]]);
                y = cdf[im[i+1]]*range + min; cb = im[i+2]; cr = im[i];
                r = ~~( y                      + 1.402   * (cr-128) );
                g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                b = ~~( y + 1.772   * (cb-128) );
                im[i] = r; im[i+1] = g; im[i+2] = b; 
            }
        }
        
        // return the new image data
        return im;
    }
});

// a simple grayscale histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
FILTER.Create({
    name: "GrayscaleHistogramEqualizeFilter"
    
    ,path: FILTER_PLUGINS_PATH
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var c, g, range, max = 0, min = 255,
            cdf, accum, t0, t1, t2,
            i, l = im.length, l2=l>>2, n=1.0/(l2)
        ;
        
        // initialize the arrays
        cdf = new A32F( 256 );
        /*for (i=0; i<256; i+=32)
        { 
            // partial loop unrolling
            cdf[i   ]=0;
            cdf[i+1 ]=0;
            cdf[i+2 ]=0;
            cdf[i+3 ]=0;
            cdf[i+4 ]=0;
            cdf[i+5 ]=0;
            cdf[i+6 ]=0;
            cdf[i+7 ]=0;
            cdf[i+8 ]=0;
            cdf[i+9 ]=0;
            cdf[i+10]=0;
            cdf[i+11]=0;
            cdf[i+12]=0;
            cdf[i+13]=0;
            cdf[i+14]=0;
            cdf[i+15]=0;
            cdf[i+16]=0;
            cdf[i+17]=0;
            cdf[i+18]=0;
            cdf[i+19]=0;
            cdf[i+20]=0;
            cdf[i+21]=0;
            cdf[i+22]=0;
            cdf[i+23]=0;
            cdf[i+24]=0;
            cdf[i+25]=0;
            cdf[i+26]=0;
            cdf[i+27]=0;
            cdf[i+28]=0;
            cdf[i+29]=0;
            cdf[i+30]=0;
            cdf[i+31]=0;
        }*/
        
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            c = im[i];  // image is already grayscale
            cdf[c] += n;
            max = Max(c, max);
            min = Min(c, min);
        }
        
        // compute cdf
        for (accum=0,i=0; i<256; i+=32)
        { 
            // partial loop unrolling
            accum += cdf[i   ]; cdf[i   ] = accum;
            accum += cdf[i+1 ]; cdf[i+1 ] = accum;
            accum += cdf[i+2 ]; cdf[i+2 ] = accum;
            accum += cdf[i+3 ]; cdf[i+3 ] = accum;
            accum += cdf[i+4 ]; cdf[i+4 ] = accum;
            accum += cdf[i+5 ]; cdf[i+5 ] = accum;
            accum += cdf[i+6 ]; cdf[i+6 ] = accum;
            accum += cdf[i+7 ]; cdf[i+7 ] = accum;
            accum += cdf[i+8 ]; cdf[i+8 ] = accum;
            accum += cdf[i+9 ]; cdf[i+9 ] = accum;
            accum += cdf[i+10]; cdf[i+10] = accum;
            accum += cdf[i+11]; cdf[i+11] = accum;
            accum += cdf[i+12]; cdf[i+12] = accum;
            accum += cdf[i+13]; cdf[i+13] = accum;
            accum += cdf[i+14]; cdf[i+14] = accum;
            accum += cdf[i+15]; cdf[i+15] = accum;
            accum += cdf[i+16]; cdf[i+16] = accum;
            accum += cdf[i+17]; cdf[i+17] = accum;
            accum += cdf[i+18]; cdf[i+18] = accum;
            accum += cdf[i+19]; cdf[i+19] = accum;
            accum += cdf[i+20]; cdf[i+20] = accum;
            accum += cdf[i+21]; cdf[i+21] = accum;
            accum += cdf[i+22]; cdf[i+22] = accum;
            accum += cdf[i+23]; cdf[i+23] = accum;
            accum += cdf[i+24]; cdf[i+24] = accum;
            accum += cdf[i+25]; cdf[i+25] = accum;
            accum += cdf[i+26]; cdf[i+26] = accum;
            accum += cdf[i+27]; cdf[i+27] = accum;
            accum += cdf[i+28]; cdf[i+28] = accum;
            accum += cdf[i+29]; cdf[i+29] = accum;
            accum += cdf[i+30]; cdf[i+30] = accum;
            accum += cdf[i+31]; cdf[i+31] = accum;
        }
        
        // equalize the grayscale/intesity channels
        range = max-min;
        if (notSupportClamp)
        {   
            for (i=0; i<l; i+=4)
            { 
                c = im[i]; // grayscale image has same value in all channels
                g = cdf[c]*range + min;
                // clamp them manually
                g = g<0 ? 0 : (g>255 ? 255 : g);
                g = ~~g;
                im[i] = g; im[i+1] = g; im[i+2] = g; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            { 
                c = im[i]; // grayscale image has same value in all channels
                g = ~~( cdf[c]*range + min );
                im[i] = g; im[i+1] = g; im[i+2] = g; 
            }
        }
        
        // return the new image data
        return im;
    }
});

// a sample RGB histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
// used for illustration purposes on how to create a plugin filter
FILTER.Create({
    name: "RGBHistogramEqualizeFilter"
    
    ,path: FILTER_PLUGINS_PATH
    
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
        /*for (i=0; i<256; i+=32)
        { 
            // partial loop unrolling
            cdfR[i   ]=0;
            cdfR[i+1 ]=0;
            cdfR[i+2 ]=0;
            cdfR[i+3 ]=0;
            cdfR[i+4 ]=0;
            cdfR[i+5 ]=0;
            cdfR[i+6 ]=0;
            cdfR[i+7 ]=0;
            cdfR[i+8 ]=0;
            cdfR[i+9 ]=0;
            cdfR[i+10]=0;
            cdfR[i+11]=0;
            cdfR[i+12]=0;
            cdfR[i+13]=0;
            cdfR[i+14]=0;
            cdfR[i+15]=0;
            cdfR[i+16]=0;
            cdfR[i+17]=0;
            cdfR[i+18]=0;
            cdfR[i+19]=0;
            cdfR[i+20]=0;
            cdfR[i+21]=0;
            cdfR[i+22]=0;
            cdfR[i+23]=0;
            cdfR[i+24]=0;
            cdfR[i+25]=0;
            cdfR[i+26]=0;
            cdfR[i+27]=0;
            cdfR[i+28]=0;
            cdfR[i+29]=0;
            cdfR[i+30]=0;
            cdfR[i+31]=0;
        
            cdfG[i   ]=0;
            cdfG[i+1 ]=0;
            cdfG[i+2 ]=0;
            cdfG[i+3 ]=0;
            cdfG[i+4 ]=0;
            cdfG[i+5 ]=0;
            cdfG[i+6 ]=0;
            cdfG[i+7 ]=0;
            cdfG[i+8 ]=0;
            cdfG[i+9 ]=0;
            cdfG[i+10]=0;
            cdfG[i+11]=0;
            cdfG[i+12]=0;
            cdfG[i+13]=0;
            cdfG[i+14]=0;
            cdfG[i+15]=0;
            cdfG[i+16]=0;
            cdfG[i+17]=0;
            cdfG[i+18]=0;
            cdfG[i+19]=0;
            cdfG[i+20]=0;
            cdfG[i+21]=0;
            cdfG[i+22]=0;
            cdfG[i+23]=0;
            cdfG[i+24]=0;
            cdfG[i+25]=0;
            cdfG[i+26]=0;
            cdfG[i+27]=0;
            cdfG[i+28]=0;
            cdfG[i+29]=0;
            cdfG[i+30]=0;
            cdfG[i+31]=0;
        
            cdfB[i   ]=0;
            cdfB[i+1 ]=0;
            cdfB[i+2 ]=0;
            cdfB[i+3 ]=0;
            cdfB[i+4 ]=0;
            cdfB[i+5 ]=0;
            cdfB[i+6 ]=0;
            cdfB[i+7 ]=0;
            cdfB[i+8 ]=0;
            cdfB[i+9 ]=0;
            cdfB[i+10]=0;
            cdfB[i+11]=0;
            cdfB[i+12]=0;
            cdfB[i+13]=0;
            cdfB[i+14]=0;
            cdfB[i+15]=0;
            cdfB[i+16]=0;
            cdfB[i+17]=0;
            cdfB[i+18]=0;
            cdfB[i+19]=0;
            cdfB[i+20]=0;
            cdfB[i+21]=0;
            cdfB[i+22]=0;
            cdfB[i+23]=0;
            cdfB[i+24]=0;
            cdfB[i+25]=0;
            cdfB[i+26]=0;
            cdfB[i+27]=0;
            cdfB[i+28]=0;
            cdfB[i+29]=0;
            cdfB[i+30]=0;
            cdfB[i+31]=0;
        }*/
        
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            r = im[i]; g = im[i+1]; b = im[i+2];
            cdfR[r] += n; cdfG[g] += n; cdfB[b] += n;
            maxR = Max(r, maxR);
            maxG = Max(g, maxG);
            maxB = Max(b, maxB);
            minR = Min(r, minR);
            minG = Min(g, minG);
            minB = Min(b, minB);
        }
        
        // compute cdf
        for (accumR=accumG=accumB=0,i=0; i<256; i+=32)
        { 
            // partial loop unrolling
            accumR += cdfR[i   ]; cdfR[i   ] = accumR;
            accumR += cdfR[i+1 ]; cdfR[i+1 ] = accumR;
            accumR += cdfR[i+2 ]; cdfR[i+2 ] = accumR;
            accumR += cdfR[i+3 ]; cdfR[i+3 ] = accumR;
            accumR += cdfR[i+4 ]; cdfR[i+4 ] = accumR;
            accumR += cdfR[i+5 ]; cdfR[i+5 ] = accumR;
            accumR += cdfR[i+6 ]; cdfR[i+6 ] = accumR;
            accumR += cdfR[i+7 ]; cdfR[i+7 ] = accumR;
            accumR += cdfR[i+8 ]; cdfR[i+8 ] = accumR;
            accumR += cdfR[i+9 ]; cdfR[i+9 ] = accumR;
            accumR += cdfR[i+10]; cdfR[i+10] = accumR;
            accumR += cdfR[i+11]; cdfR[i+11] = accumR;
            accumR += cdfR[i+12]; cdfR[i+12] = accumR;
            accumR += cdfR[i+13]; cdfR[i+13] = accumR;
            accumR += cdfR[i+14]; cdfR[i+14] = accumR;
            accumR += cdfR[i+15]; cdfR[i+15] = accumR;
            accumR += cdfR[i+16]; cdfR[i+16] = accumR;
            accumR += cdfR[i+17]; cdfR[i+17] = accumR;
            accumR += cdfR[i+18]; cdfR[i+18] = accumR;
            accumR += cdfR[i+19]; cdfR[i+19] = accumR;
            accumR += cdfR[i+20]; cdfR[i+20] = accumR;
            accumR += cdfR[i+21]; cdfR[i+21] = accumR;
            accumR += cdfR[i+22]; cdfR[i+22] = accumR;
            accumR += cdfR[i+23]; cdfR[i+23] = accumR;
            accumR += cdfR[i+24]; cdfR[i+24] = accumR;
            accumR += cdfR[i+25]; cdfR[i+25] = accumR;
            accumR += cdfR[i+26]; cdfR[i+26] = accumR;
            accumR += cdfR[i+27]; cdfR[i+27] = accumR;
            accumR += cdfR[i+28]; cdfR[i+28] = accumR;
            accumR += cdfR[i+29]; cdfR[i+29] = accumR;
            accumR += cdfR[i+30]; cdfR[i+30] = accumR;
            accumR += cdfR[i+31]; cdfR[i+31] = accumR;
        
            accumG += cdfG[i   ]; cdfG[i   ] = accumG;
            accumG += cdfG[i+1 ]; cdfG[i+1 ] = accumG;
            accumG += cdfG[i+2 ]; cdfG[i+2 ] = accumG;
            accumG += cdfG[i+3 ]; cdfG[i+3 ] = accumG;
            accumG += cdfG[i+4 ]; cdfG[i+4 ] = accumG;
            accumG += cdfG[i+5 ]; cdfG[i+5 ] = accumG;
            accumG += cdfG[i+6 ]; cdfG[i+6 ] = accumG;
            accumG += cdfG[i+7 ]; cdfG[i+7 ] = accumG;
            accumG += cdfG[i+8 ]; cdfG[i+8 ] = accumG;
            accumG += cdfG[i+9 ]; cdfG[i+9 ] = accumG;
            accumG += cdfG[i+10]; cdfG[i+10] = accumG;
            accumG += cdfG[i+11]; cdfG[i+11] = accumG;
            accumG += cdfG[i+12]; cdfG[i+12] = accumG;
            accumG += cdfG[i+13]; cdfG[i+13] = accumG;
            accumG += cdfG[i+14]; cdfG[i+14] = accumG;
            accumG += cdfG[i+15]; cdfG[i+15] = accumG;
            accumG += cdfG[i+16]; cdfG[i+16] = accumG;
            accumG += cdfG[i+17]; cdfG[i+17] = accumG;
            accumG += cdfG[i+18]; cdfG[i+18] = accumG;
            accumG += cdfG[i+19]; cdfG[i+19] = accumG;
            accumG += cdfG[i+20]; cdfG[i+20] = accumG;
            accumG += cdfG[i+21]; cdfG[i+21] = accumG;
            accumG += cdfG[i+22]; cdfG[i+22] = accumG;
            accumG += cdfG[i+23]; cdfG[i+23] = accumG;
            accumG += cdfG[i+24]; cdfG[i+24] = accumG;
            accumG += cdfG[i+25]; cdfG[i+25] = accumG;
            accumG += cdfG[i+26]; cdfG[i+26] = accumG;
            accumG += cdfG[i+27]; cdfG[i+27] = accumG;
            accumG += cdfG[i+28]; cdfG[i+28] = accumG;
            accumG += cdfG[i+29]; cdfG[i+29] = accumG;
            accumG += cdfG[i+30]; cdfG[i+30] = accumG;
            accumG += cdfG[i+31]; cdfG[i+31] = accumG;
        
            accumB += cdfB[i   ]; cdfB[i   ] = accumB;
            accumB += cdfB[i+1 ]; cdfB[i+1 ] = accumB;
            accumB += cdfB[i+2 ]; cdfB[i+2 ] = accumB;
            accumB += cdfB[i+3 ]; cdfB[i+3 ] = accumB;
            accumB += cdfB[i+4 ]; cdfB[i+4 ] = accumB;
            accumB += cdfB[i+5 ]; cdfB[i+5 ] = accumB;
            accumB += cdfB[i+6 ]; cdfB[i+6 ] = accumB;
            accumB += cdfB[i+7 ]; cdfB[i+7 ] = accumB;
            accumB += cdfB[i+8 ]; cdfB[i+8 ] = accumB;
            accumB += cdfB[i+9 ]; cdfB[i+9 ] = accumB;
            accumB += cdfB[i+10]; cdfB[i+10] = accumB;
            accumB += cdfB[i+11]; cdfB[i+11] = accumB;
            accumB += cdfB[i+12]; cdfB[i+12] = accumB;
            accumB += cdfB[i+13]; cdfB[i+13] = accumB;
            accumB += cdfB[i+14]; cdfB[i+14] = accumB;
            accumB += cdfB[i+15]; cdfB[i+15] = accumB;
            accumB += cdfB[i+16]; cdfB[i+16] = accumB;
            accumB += cdfB[i+17]; cdfB[i+17] = accumB;
            accumB += cdfB[i+18]; cdfB[i+18] = accumB;
            accumB += cdfB[i+19]; cdfB[i+19] = accumB;
            accumB += cdfB[i+20]; cdfB[i+20] = accumB;
            accumB += cdfB[i+21]; cdfB[i+21] = accumB;
            accumB += cdfB[i+22]; cdfB[i+22] = accumB;
            accumB += cdfB[i+23]; cdfB[i+23] = accumB;
            accumB += cdfB[i+24]; cdfB[i+24] = accumB;
            accumB += cdfB[i+25]; cdfB[i+25] = accumB;
            accumB += cdfB[i+26]; cdfB[i+26] = accumB;
            accumB += cdfB[i+27]; cdfB[i+27] = accumB;
            accumB += cdfB[i+28]; cdfB[i+28] = accumB;
            accumB += cdfB[i+29]; cdfB[i+29] = accumB;
            accumB += cdfB[i+30]; cdfB[i+30] = accumB;
            accumB += cdfB[i+31]; cdfB[i+31] = accumB;
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
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
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