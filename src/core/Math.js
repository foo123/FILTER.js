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

FILTER.Interpolation = FILTER.Interpolation || {};

FILTER.Interpolation.pad = function( im, w, h, pad_right, pad_bot, pad_left, pad_top ) {
     pad_right = pad_right || 0; pad_bot = pad_bot || 0;
     pad_left = pad_left || 0; pad_top = pad_top || 0;
     var nw = w+pad_left+pad_right, nh = h+pad_top+pad_bot, 
        paddedSize = (nw*nh)<<2, padded = new IMG(paddedSize), 
        y, yw, w4 = w<<2, nw4 = nw<<2, pixel, pixel2,
        offtop = pad_top*nw4, offleft = pad_left<<2;
        
        for (y=0,yw=0,pixel=offtop; y<h; y++,yw+=w,pixel+=nw4)
        {
            pixel2 = yw<<2;
            padded.set(im.subarray(pixel2,pixel2+w4),offleft+pixel);
        }
     return padded;
};
    
FILTER.Interpolation.crop = function( im, w, h, x1, y1, x2, y2 ) {
     x2 = min(x2,w-1); y2 = min(y2,h-1);
     var nw = x2-x1+1, nh = y2-y1+1, 
        croppedSize = (nw*nh)<<2, cropped = new IMG(croppedSize), 
        y, yw, nw4 = nw<<2, pixel, pixel2;
        
        for (y=y1,yw=y1*w,pixel=0; y<=y2; y++,yw+=w,pixel+=nw4)
        {
            pixel2 = (yw+x1)<<2;
            cropped.set(im.subarray(pixel2,pixel2+nw4),pixel);
        }
     return cropped;
};

// http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
// http://tech-algorithm.com/articles/bilinear-image-scaling/
FILTER.Interpolation.bilinear = function( im, w, h, nw, nh ) {
    var size = (nw*nh)<<2, interpolated = new IMG(size),
        rx = (w-1)/nw, ry = (h-1)/nh, 
        A, B, C, D, a, b, c, d, 
        i, j, x, y, xi, yi, pixel, index,
        yw, dx, dy, w4 = w<<2
    ;
    i=0; j=0; x=0; y=0; yi=0; yw=0; dy=0;
    for (index=0; index<size; index+=4,j++,x+=rx) 
    {
        if ( j >= nw ) { j=0; x=0; i++; y+=ry; yi=~~y; dy=y - yi; yw=yi*w; }
        
        xi = ~~x; dx = x - xi;
        
        // Y = A(1-w)(1-h) + B(w)(1-h) + C(h)(1-w) + Dwh
        a = (1-dx)*(1-dy); b = dx*(1-dy);
        c = dy*(1-dx); d = dx*dy;
        
        pixel = (yw + xi)<<2;

        A = im[pixel]; B = im[pixel+4];
        C = im[pixel+w4]; D = im[pixel+w4+4];
        interpolated[index] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);
        
        A = im[pixel+1]; B = im[pixel+5];
        C = im[pixel+w4+1]; D = im[pixel+w4+5];
        interpolated[index+1] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);

        A = im[pixel+2]; B = im[pixel+6];
        C = im[pixel+w4+2]; D = im[pixel+w4+6];
        interpolated[index+2] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);

        A = im[pixel+3]; B = im[pixel+7];
        C = im[pixel+w4+3]; D = im[pixel+w4+7];
        interpolated[index+3] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);
    }
    return interpolated;
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