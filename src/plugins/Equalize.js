/**
*
* Histogram Equalize Plugin, Histogram Equalize for grayscale images Plugin, RGB Histogram Equalize Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp = FILTER._notSupportClamp, A32F = FILTER.Array32F,
    MODE = FILTER.MODE, Min = Math.min, Max = Math.max
;

// a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
FILTER.Create({
    name : "HistogramEqualizeFilter"
    
    ,path: FILTER_PLUGINS_PATH
    
    ,mode: MODE.INTENSITY
    
    ,init: function( mode ) {
        var self = this;
        self.mode = mode || MODE.INTENSITY;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             mode: self.mode
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.mode = params.mode;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,_apply_rgb: function(im, w, h) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        var r,g,b, rangeR, rangeG, rangeB,
            maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
            cdfR, cdfG, cdfB,
            accumR, accumG, accumB, t0, t1, t2,
            i, l=im.length, l2=l>>>2, rem=(l2&7)<<2
        ;
        
        // initialize the arrays
        cdfR=new A32F(256); cdfG=new A32F(256); cdfB=new A32F(256);
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=32)
        {
            r = im[i]; g = im[i+1]; b = im[i+2];
            cdfR[r]++; cdfG[g]++; cdfB[b]++;
            maxR = Max(r, maxR);
            maxG = Max(g, maxG);
            maxB = Max(b, maxB);
            minR = Min(r, minR);
            minG = Min(g, minG);
            minB = Min(b, minB);
            r = im[i+4]; g = im[i+5]; b = im[i+6];
            cdfR[r]++; cdfG[g]++; cdfB[b]++;
            maxR = Max(r, maxR);
            maxG = Max(g, maxG);
            maxB = Max(b, maxB);
            minR = Min(r, minR);
            minG = Min(g, minG);
            minB = Min(b, minB);
            r = im[i+8]; g = im[i+9]; b = im[i+10];
            cdfR[r]++; cdfG[g]++; cdfB[b]++;
            maxR = Max(r, maxR);
            maxG = Max(g, maxG);
            maxB = Max(b, maxB);
            minR = Min(r, minR);
            minG = Min(g, minG);
            minB = Min(b, minB);
            r = im[i+12]; g = im[i+13]; b = im[i+14];
            cdfR[r]++; cdfG[g]++; cdfB[b]++;
            maxR = Max(r, maxR);
            maxG = Max(g, maxG);
            maxB = Max(b, maxB);
            minR = Min(r, minR);
            minG = Min(g, minG);
            minB = Min(b, minB);
            r = im[i+16]; g = im[i+17]; b = im[i+18];
            cdfR[r]++; cdfG[g]++; cdfB[b]++;
            maxR = Max(r, maxR);
            maxG = Max(g, maxG);
            maxB = Max(b, maxB);
            minR = Min(r, minR);
            minG = Min(g, minG);
            minB = Min(b, minB);
            r = im[i+20]; g = im[i+21]; b = im[i+22];
            cdfR[r]++; cdfG[g]++; cdfB[b]++;
            maxR = Max(r, maxR);
            maxG = Max(g, maxG);
            maxB = Max(b, maxB);
            minR = Min(r, minR);
            minG = Min(g, minG);
            minB = Min(b, minB);
            r = im[i+24]; g = im[i+25]; b = im[i+26];
            cdfR[r]++; cdfG[g]++; cdfB[b]++;
            maxR = Max(r, maxR);
            maxG = Max(g, maxG);
            maxB = Max(b, maxB);
            minR = Min(r, minR);
            minG = Min(g, minG);
            minB = Min(b, minB);
            r = im[i+28]; g = im[i+29]; b = im[i+30];
            cdfR[r]++; cdfG[g]++; cdfB[b]++;
            maxR = Max(r, maxR);
            maxG = Max(g, maxG);
            maxB = Max(b, maxB);
            minR = Min(r, minR);
            minG = Min(g, minG);
            minB = Min(b, minB);
        }
        if ( rem )
        {
            for (i=l-rem; i<l; i+=4)
            {
                r = im[i]; g = im[i+1]; b = im[i+2];
                cdfR[r]++; cdfG[g]++; cdfB[b]++;
                maxR = Max(r, maxR);
                maxG = Max(g, maxG);
                maxB = Max(b, maxB);
                minR = Min(r, minR);
                minG = Min(g, minG);
                minB = Min(b, minB);
            }
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
        rangeR=(maxR-minR)/l2; rangeG=(maxG-minG)/l2; rangeB=(maxB-minB)/l2;
        if (notSupportClamp)
        {   
            for (i=0; i<l; i+=32)
            { 
                r = im[i]; g = im[i+1]; b = im[i+2]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
                r = im[i+4]; g = im[i+5]; b = im[i+6]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                im[i+4] = ~~t0; im[i+5] = ~~t1; im[i+6] = ~~t2; 
                r = im[i+8]; g = im[i+9]; b = im[i+10]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                im[i+8] = ~~t0; im[i+9] = ~~t1; im[i+10] = ~~t2; 
                r = im[i+12]; g = im[i+13]; b = im[i+14]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                im[i+12] = ~~t0; im[i+13] = ~~t1; im[i+14] = ~~t2; 
                r = im[i+16]; g = im[i+17]; b = im[i+18];
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                im[i+16] = ~~t0; im[i+17] = ~~t1; im[i+18] = ~~t2; 
                r = im[i+20]; g = im[i+21]; b = im[i+22];
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                im[i+20] = ~~t0; im[i+21] = ~~t1; im[i+22] = ~~t2; 
                r = im[i+24]; g = im[i+25]; b = im[i+26]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                im[i+24] = ~~t0; im[i+25] = ~~t1; im[i+26] = ~~t2;
                r = im[i+28]; g = im[i+29]; b = im[i+30];
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                im[i+28] = ~~t0; im[i+29] = ~~t1; im[i+30] = ~~t2;
            }
            if ( rem )
            {
                for (i=l-rem; i<l; i+=4)
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
        }
        else
        {
            for (i=0; i<l; i+=32)
            { 
                r = im[i]; g = im[i+1]; b = im[i+2]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
                r = im[i+4]; g = im[i+5]; b = im[i+6]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                im[i+4] = ~~t0; im[i+5] = ~~t1; im[i+6] = ~~t2; 
                r = im[i+8]; g = im[i+9]; b = im[i+10]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                im[i+8] = ~~t0; im[i+9] = ~~t1; im[i+10] = ~~t2; 
                r = im[i+12]; g = im[i+13]; b = im[i+14]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                im[i+12] = ~~t0; im[i+13] = ~~t1; im[i+14] = ~~t2; 
                r = im[i+16]; g = im[i+17]; b = im[i+18];
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                im[i+16] = ~~t0; im[i+17] = ~~t1; im[i+18] = ~~t2; 
                r = im[i+20]; g = im[i+21]; b = im[i+22];
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                im[i+20] = ~~t0; im[i+21] = ~~t1; im[i+22] = ~~t2; 
                r = im[i+24]; g = im[i+25]; b = im[i+26]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                im[i+24] = ~~t0; im[i+25] = ~~t1; im[i+26] = ~~t2;
                r = im[i+28]; g = im[i+29]; b = im[i+30];
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                im[i+28] = ~~t0; im[i+29] = ~~t1; im[i+30] = ~~t2;
            }
            if ( rem )
            {
                for (i=l-rem; i<l; i+=4)
                { 
                    r = im[i]; g = im[i+1]; b = im[i+2]; 
                    t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                    im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
                }
            }
        }
        
        // return the new image data
        return im;
    }
    
    ,apply: function(im, w, h) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        
        if ( MODE.RGB === self.mode ) return self._apply_rgb( im, w, h );
        
        var r, g, b, y, cb, cr, range, max = 0, min = 255,
            cdf, accum, i, l = im.length, l2 = l>>>2,
            is_grayscale = MODE.GRAY === self.mode, rem = (l2&7)<<2
        ;
        
        // initialize the arrays
        cdf = new A32F( 256 );
        // compute pdf and maxima/minima
        if ( is_grayscale )
        {
            for (i=0; i<l; i+=32)
            {
                r = im[i];
                cdf[ r ]++;
                max = Max(r, max);
                min = Min(r, min);
                r = im[i+4];
                cdf[ r ]++;
                max = Max(r, max);
                min = Min(r, min);
                r = im[i+8];
                cdf[ r ]++;
                max = Max(r, max);
                min = Min(r, min);
                r = im[i+12];
                cdf[ r ]++;
                max = Max(r, max);
                min = Min(r, min);
                r = im[i+16];
                cdf[ r ]++;
                max = Max(r, max);
                min = Min(r, min);
                r = im[i+20];
                cdf[ r ]++;
                max = Max(r, max);
                min = Min(r, min);
                r = im[i+24];
                cdf[ r ]++;
                max = Max(r, max);
                min = Min(r, min);
                r = im[i+28];
                cdf[ r ]++;
                max = Max(r, max);
                min = Min(r, min);
            }
            if ( rem )
            {
                for (i=l-rem; i<l; i+=4)
                {
                    r = im[i];
                    cdf[ r ]++;
                    max = Max(r, max);
                    min = Min(r, min);
                }
            }
        }
        else
        {
            for (i=0; i<l; i+=32)
            {
                r = im[i]; g = im[i+1]; b = im[i+2];
                y =  ~~(0   + 0.299*r    + 0.587*g     + 0.114*b);
                cb = ~~(128 - 0.168736*r - 0.331264*g  + 0.5*b);
                cr = ~~(128 + 0.5*r      - 0.418688*g  - 0.081312*b);
                // clamp them manually
                cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                y = y<0 ? 0 : (y>255 ? 255 : y);
                cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                im[i] = cr; im[i+1] = y; im[i+2] = cb;
                cdf[ y ]++;
                max = Max(y, max);
                min = Min(y, min);
                r = im[i+4]; g = im[i+5]; b = im[i+6];
                y =  ~~(0   + 0.299*r    + 0.587*g     + 0.114*b);
                cb = ~~(128 - 0.168736*r - 0.331264*g  + 0.5*b);
                cr = ~~(128 + 0.5*r      - 0.418688*g  - 0.081312*b);
                // clamp them manually
                cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                y = y<0 ? 0 : (y>255 ? 255 : y);
                cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                im[i+4] = cr; im[i+5] = y; im[i+6] = cb;
                cdf[ y ]++;
                max = Max(y, max);
                min = Min(y, min);
                r = im[i+8]; g = im[i+9]; b = im[i+10];
                y =  ~~(0   + 0.299*r    + 0.587*g     + 0.114*b);
                cb = ~~(128 - 0.168736*r - 0.331264*g  + 0.5*b);
                cr = ~~(128 + 0.5*r      - 0.418688*g  - 0.081312*b);
                // clamp them manually
                cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                y = y<0 ? 0 : (y>255 ? 255 : y);
                cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                im[i+8] = cr; im[i+9] = y; im[i+10] = cb;
                cdf[ y ]++;
                max = Max(y, max);
                min = Min(y, min);
                r = im[i+12]; g = im[i+13]; b = im[i+14];
                y =  ~~(0   + 0.299*r    + 0.587*g     + 0.114*b);
                cb = ~~(128 - 0.168736*r - 0.331264*g  + 0.5*b);
                cr = ~~(128 + 0.5*r      - 0.418688*g  - 0.081312*b);
                // clamp them manually
                cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                y = y<0 ? 0 : (y>255 ? 255 : y);
                cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                im[i+12] = cr; im[i+13] = y; im[i+14] = cb;
                cdf[ y ]++;
                max = Max(y, max);
                min = Min(y, min);
                r = im[i+16]; g = im[i+17]; b = im[i+18];
                y =  ~~(0   + 0.299*r    + 0.587*g     + 0.114*b);
                cb = ~~(128 - 0.168736*r - 0.331264*g  + 0.5*b);
                cr = ~~(128 + 0.5*r      - 0.418688*g  - 0.081312*b);
                // clamp them manually
                cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                y = y<0 ? 0 : (y>255 ? 255 : y);
                cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                im[i+16] = cr; im[i+17] = y; im[i+18] = cb;
                cdf[ y ]++;
                max = Max(y, max);
                min = Min(y, min);
                r = im[i+20]; g = im[i+21]; b = im[i+22];
                y =  ~~(0   + 0.299*r    + 0.587*g     + 0.114*b);
                cb = ~~(128 - 0.168736*r - 0.331264*g  + 0.5*b);
                cr = ~~(128 + 0.5*r      - 0.418688*g  - 0.081312*b);
                // clamp them manually
                cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                y = y<0 ? 0 : (y>255 ? 255 : y);
                cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                im[i+20] = cr; im[i+21] = y; im[i+22] = cb;
                cdf[ y ]++;
                max = Max(y, max);
                min = Min(y, min);
                r = im[i+24]; g = im[i+25]; b = im[i+26];
                y =  ~~(0   + 0.299*r    + 0.587*g     + 0.114*b);
                cb = ~~(128 - 0.168736*r - 0.331264*g  + 0.5*b);
                cr = ~~(128 + 0.5*r      - 0.418688*g  - 0.081312*b);
                // clamp them manually
                cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                y = y<0 ? 0 : (y>255 ? 255 : y);
                cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                im[i+24] = cr; im[i+25] = y; im[i+26] = cb;
                cdf[ y ]++;
                max = Max(y, max);
                min = Min(y, min);
                r = im[i+28]; g = im[i+29]; b = im[i+30];
                y =  ~~(0   + 0.299*r    + 0.587*g     + 0.114*b);
                cb = ~~(128 - 0.168736*r - 0.331264*g  + 0.5*b);
                cr = ~~(128 + 0.5*r      - 0.418688*g  - 0.081312*b);
                // clamp them manually
                cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                y = y<0 ? 0 : (y>255 ? 255 : y);
                cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                im[i+28] = cr; im[i+29] = y; im[i+30] = cb;
                cdf[ y ]++;
                max = Max(y, max);
                min = Min(y, min);
            }
            if ( rem )
            {
                for (i=l-rem; i<l; i+=4)
                {
                    r = im[i]; g = im[i+1]; b = im[i+2];
                    y =  ~~(0   + 0.299*r    + 0.587*g     + 0.114*b);
                    cb = ~~(128 - 0.168736*r - 0.331264*g  + 0.5*b);
                    cr = ~~(128 + 0.5*r      - 0.418688*g  - 0.081312*b);
                    // clamp them manually
                    cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                    y = y<0 ? 0 : (y>255 ? 255 : y);
                    cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                    im[i] = cr; im[i+1] = y; im[i+2] = cb;
                    cdf[ y ]++;
                    max = Max(y, max);
                    min = Min(y, min);
                }
            }
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
        range = (max-min)/l2;
        if (notSupportClamp)
        {   
            if ( is_grayscale )
            {
                for (i=0; i<l; i+=32)
                { 
                    r = ~~(cdf[im[i]]*range + min);
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    im[i] = r; im[i+1] = r; im[i+2] = r; 
                    r = ~~(cdf[im[i+4]]*range + min);
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    im[i+4] = r; im[i+5] = r; im[i+6] = r; 
                    r = ~~(cdf[im[i+8]]*range + min);
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    im[i+8] = r; im[i+9] = r; im[i+10] = r; 
                    r = ~~(cdf[im[i+12]]*range + min);
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    im[i+12] = r; im[i+13] = r; im[i+14] = r; 
                    r = ~~(cdf[im[i+16]]*range + min);
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    im[i+16] = r; im[i+17] = r; im[i+18] = r;
                    r = ~~(cdf[im[i+20]]*range + min);
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    im[i+20] = r; im[i+21] = r; im[i+22] = r; 
                    r = ~~(cdf[im[i+24]]*range + min);
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    im[i+24] = r; im[i+25] = r; im[i+26] = r; 
                    r = ~~(cdf[im[i+28]]*range + min);
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    im[i+28] = r; im[i+29] = r; im[i+30] = r; 
                }
                if ( rem )
                {
                    for (i=l-rem; i<l; i+=4)
                    { 
                        r = ~~(cdf[im[i]]*range + min);
                        // clamp them manually
                        r = r<0 ? 0 : (r>255 ? 255 : r);
                        im[i] = r; im[i+1] = r; im[i+2] = r; 
                    }
                }
            }
            else
            {
                for (i=0; i<l; i+=32)
                { 
                    y = cdf[im[i+1]]*range + min; cb = im[i+2]; cr = im[i];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    g = g<0 ? 0 : (g>255 ? 255 : g);
                    b = b<0 ? 0 : (b>255 ? 255 : b);
                    im[i] = r; im[i+1] = g; im[i+2] = b; 
                    y = cdf[im[i+5]]*range + min; cb = im[i+6]; cr = im[i+4];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    g = g<0 ? 0 : (g>255 ? 255 : g);
                    b = b<0 ? 0 : (b>255 ? 255 : b);
                    im[i+4] = r; im[i+5] = g; im[i+6] = b; 
                    y = cdf[im[i+9]]*range + min; cb = im[i+10]; cr = im[i+8];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    g = g<0 ? 0 : (g>255 ? 255 : g);
                    b = b<0 ? 0 : (b>255 ? 255 : b);
                    im[i+8] = r; im[i+9] = g; im[i+10] = b; 
                    y = cdf[im[i+13]]*range + min; cb = im[i+14]; cr = im[i+12];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    g = g<0 ? 0 : (g>255 ? 255 : g);
                    b = b<0 ? 0 : (b>255 ? 255 : b);
                    im[i+12] = r; im[i+13] = g; im[i+14] = b; 
                    y = cdf[im[i+17]]*range + min; cb = im[i+18]; cr = im[i+16];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    g = g<0 ? 0 : (g>255 ? 255 : g);
                    b = b<0 ? 0 : (b>255 ? 255 : b);
                    im[i+16] = r; im[i+17] = g; im[i+18] = b; 
                    y = cdf[im[i+21]]*range + min; cb = im[i+22]; cr = im[i+20];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    g = g<0 ? 0 : (g>255 ? 255 : g);
                    b = b<0 ? 0 : (b>255 ? 255 : b);
                    im[i+20] = r; im[i+21] = g; im[i+22] = b; 
                    y = cdf[im[i+25]]*range + min; cb = im[i+26]; cr = im[i+24];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    g = g<0 ? 0 : (g>255 ? 255 : g);
                    b = b<0 ? 0 : (b>255 ? 255 : b);
                    im[i+24] = r; im[i+25] = g; im[i+26] = b; 
                    y = cdf[im[i+29]]*range + min; cb = im[i+30]; cr = im[i+28];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    g = g<0 ? 0 : (g>255 ? 255 : g);
                    b = b<0 ? 0 : (b>255 ? 255 : b);
                    im[i+28] = r; im[i+29] = g; im[i+30] = b; 
                }
                if ( rem )
                {
                    for (i=l-rem; i<l; i+=4)
                    { 
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
            }
        }
        else
        {
            if ( is_grayscale )
            {
                for (i=0; i<l; i+=32)
                { 
                    r = ~~(cdf[im[i]]*range + min);
                    im[i] = r; im[i+1] = r; im[i+2] = r; 
                    r = ~~(cdf[im[i+4]]*range + min);
                    im[i+4] = r; im[i+5] = r; im[i+6] = r; 
                    r = ~~(cdf[im[i+8]]*range + min);
                    im[i+8] = r; im[i+9] = r; im[i+10] = r; 
                    r = ~~(cdf[im[i+12]]*range + min);
                    im[i+12] = r; im[i+13] = r; im[i+14] = r; 
                    r = ~~(cdf[im[i+16]]*range + min);
                    im[i+16] = r; im[i+17] = r; im[i+18] = r;
                    r = ~~(cdf[im[i+20]]*range + min);
                    im[i+20] = r; im[i+21] = r; im[i+22] = r; 
                    r = ~~(cdf[im[i+24]]*range + min);
                    im[i+24] = r; im[i+25] = r; im[i+26] = r; 
                    r = ~~(cdf[im[i+28]]*range + min);
                    im[i+28] = r; im[i+29] = r; im[i+30] = r; 
                }
                if ( rem )
                {
                    for (i=l-rem; i<l; i+=4)
                    { 
                        r = ~~(cdf[im[i]]*range + min);
                        im[i] = r; im[i+1] = r; im[i+2] = r; 
                    }
                }
            }
            else
            {
                for (i=0; i<l; i+=32)
                { 
                    y = cdf[im[i+1]]*range + min; cb = im[i+2]; cr = im[i];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    im[i] = r; im[i+1] = g; im[i+2] = b; 
                    y = cdf[im[i+5]]*range + min; cb = im[i+6]; cr = im[i+4];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    im[i+4] = r; im[i+5] = g; im[i+6] = b; 
                    y = cdf[im[i+9]]*range + min; cb = im[i+10]; cr = im[i+8];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    im[i+8] = r; im[i+9] = g; im[i+10] = b; 
                    y = cdf[im[i+13]]*range + min; cb = im[i+14]; cr = im[i+12];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    im[i+12] = r; im[i+13] = g; im[i+14] = b; 
                    y = cdf[im[i+17]]*range + min; cb = im[i+18]; cr = im[i+16];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    im[i+16] = r; im[i+17] = g; im[i+18] = b; 
                    y = cdf[im[i+21]]*range + min; cb = im[i+22]; cr = im[i+20];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    im[i+20] = r; im[i+21] = g; im[i+22] = b; 
                    y = cdf[im[i+25]]*range + min; cb = im[i+26]; cr = im[i+24];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    im[i+24] = r; im[i+25] = g; im[i+26] = b; 
                    y = cdf[im[i+29]]*range + min; cb = im[i+30]; cr = im[i+28];
                    r = ~~( y                      + 1.402   * (cr-128) );
                    g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                    b = ~~( y + 1.772   * (cb-128) );
                    im[i+28] = r; im[i+29] = g; im[i+30] = b; 
                }
                if ( rem )
                {
                    for (i=l-rem; i<l; i+=4)
                    { 
                        y = cdf[im[i+1]]*range + min; cb = im[i+2]; cr = im[i];
                        r = ~~( y                      + 1.402   * (cr-128) );
                        g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
                        b = ~~( y + 1.772   * (cb-128) );
                        im[i] = r; im[i+1] = g; im[i+2] = b; 
                    }
                }
            }
        }
        // return the new image data
        return im;
    }
});

}(FILTER);