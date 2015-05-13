/**
*
* Filter Math
* @package FILTER.js
*
**/
!function(FILTER, undef){
@@USE_STRICT@@

var IMG = FILTER.ImArray, A32F = FILTER.Array32F, A64F = FILTER.Array64F,
    PI = Math.PI, PI2 = 2.0*PI, PI_2 = 0.5*PI, 
    sin = Math.sin, cos = Math.cos, min = Math.min, max = Math.max
;
Math.log2 = Math.log2 || function(x) { return Math.log(x) / Math.LN2; };

//
// Constants
FILTER.CONSTANTS = {
     PI:    PI
    ,PI2:   PI2
    ,PI_2:  PI_2
    ,SQRT2: Math.SQRT2
    ,toRad: PI/180
    ,toDeg: 180/PI
};

function clamp(v, m, M) { return v > M ? M : (v < m ? m : v); }
function closest_power_of_two(x){ return Math.pow(2, Math.ceil(Math.log2(x))); }

FILTER.Math = {
    
    clamp: clamp,
    
    closestPower2: closest_power_of_two
};


FILTER.Compute = {
    
    // compute integral image (Summed Area Table, SAT)
    integral: function( im, w, h, grayscale ) {
        var rowLen = w<<2, integralR, integralG, integralB, colR, colG, colB,
            imLen = im.length, count = (imLen>>2), i, j, x, rgb
        ;
        grayscale = true === grayscale; rgb = !grayscale;
        // compute integral of image in one pass
        integralR = new A32F(count); 
        if ( rgb )
        {
            integralG = new A32F(count); 
            integralB = new A32F(count);
        }
        // first row
        j=0; i=0; colR=colG=colB=0;
        for (x=0; x<w; x++, i+=4, j++)
        {
            colR+=im[i]; integralR[j]=colR; 
            
            if ( rgb )
            {
                colG+=im[i+1]; colB+=im[i+2];
                integralG[j]=colG; integralB[j]=colB;
            }
        }
        // other rows
        i=rowLen; x=0; j=0; colR=colG=colB=0;
        for (i=rowLen; i<imLen; i+=4, j++, x++)
        {
            if (x>=w) { x=0; colR=colG=colB=0; }
            colR+=im[i]; 
            integralR[j+w]=integralR[j]+colR; 
            
            if ( rgb )
            {
                colG+=im[i+1]; colB+=im[i+2];
                integralG[j+w]=integralG[j]+colG; integralB[j+w]=integralB[j]+colB;
            }
        }
        return rgb ? [integralR, integralG, integralB] : [integralR, integralR, integralR];
    }
    
    // compute image histogram
    ,histogram: function( im, w, h, grayscale ) {
        var l = im.length,
            maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
            cdfR, cdfG, cdfB, r,g,b,
            accumR, accumG, accumB,
            i, n=1.0/(l>>2), rgb
        ;
        
        grayscale = true === grayscale; rgb = !grayscale;
        // initialize the arrays
        cdfR=new A32F(256); 
        if ( rgb )
        {
            cdfG=new A32F(256); 
            cdfB=new A32F(256);
        }
        for (i=0; i<256; i+=4) 
        { 
            // partial loop unrolling
            cdfR[i]=0;
            cdfR[i+1]=0;
            cdfR[i+2]=0;
            cdfR[i+3]=0;
            if ( rgb )
            {
                cdfG[i]=0; cdfB[i]=0;
                cdfG[i+1]=0; cdfB[i+1]=0;
                cdfG[i+2]=0; cdfB[i+2]=0;
                cdfG[i+3]=0; cdfB[i+3]=0;
            }
        }
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            r = im[i];
            cdfR[r] += n;
            
            if (r>maxR) maxR=r;
            else if (r<minR) minR=r;
            
            if ( rgb )
            {
                g = im[i+1]; b = im[i+2];
                cdfG[g] += n; cdfB[b] += n;
                if (g>maxG) maxG=g;
                else if (g<minG) minG=g;
                if (b>maxB) maxB=b;
                else if (b<minB) minB=b;
            }
        }
        
        // compute cdf
        accumR=accumG=accumB=0;
        for (i=0; i<256; i+=4) 
        { 
            // partial loop unrolling
            accumR += cdfR[i]; cdfR[i] = accumR;
            accumR += cdfR[i+1]; cdfR[i+1] = accumR;
            accumR += cdfR[i+2]; cdfR[i+2] = accumR;
            accumR += cdfR[i+3]; cdfR[i+3] = accumR;
            
            if ( rgb )
            {
                accumG += cdfG[i]; cdfG[i] = accumG;
                accumB += cdfB[i]; cdfB[i] = accumB;
                accumG += cdfG[i+1]; cdfG[i+1] = accumG;
                accumB += cdfB[i+1]; cdfB[i+1] = accumB;
                accumG += cdfG[i+2]; cdfG[i+2] = accumG;
                accumB += cdfB[i+2]; cdfB[i+2] = accumB;
                accumG += cdfG[i+3]; cdfG[i+3] = accumG;
                accumB += cdfB[i+3]; cdfB[i+3] = accumB;
            }
        }
        
        return rgb ? [cdfR, cdfG, cdfB] : [cdfR, cdfR, cdfR];
    }
    
    ,spectrum: function( im, w, h, grayscale ) {
        // TODO
        return null;
    }
};

}(FILTER);