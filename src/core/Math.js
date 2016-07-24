/**
*
* Filter Math
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var IMG = FILTER.ImArray, A32F = FILTER.Array32F, A64F = FILTER.Array64F,
    A16I = FILTER.Array16I, A8U = FILTER.Array8U,
    Sqrt = Math.sqrt, Pow = Math.pow, Ceil = Math.ceil, Log = Math.log, 
    PI = Math.PI, PI2 = PI+PI, PI_2 = 0.5*PI, LN2 = Math.LN2, SQRT2 = Math.SQRT2,
    log2 = function( x ) { return Log(x) / LN2; },
    Log2 = Math.log2 || log2, Min = Math.min,
    X = 0, Y = 1, Z = 2,
    arrayset = FILTER.ArraySet, subarray = FILTER.ArraySubArray,
    notSupportClamp = FILTER._notSupportClamp
;

function clamp( x, m, M )
{ 
    return x > M ? M : (x < m ? m : x); 
}

function closest_power_of_two( x )
{ 
    return Pow( 2, Ceil( Log2(x) ) ); 
}

function point2( x, y )
{
    var p = new A32F( 2 );
    p[X] = x||0.0; p[Y] = y||0.0;
    return p;
}

function point3( x, y, z )
{
    var p = new A32F( 3 );
    p[X] = x||0.0; p[Y] = y||0.0; p[Z] = z||0.0;
    return p;
}

function interpolate2( p0, p1, t ) 
{
    var it = 1.0-t;
    return point2( t*p0[X]+it*p1[X], t*p0[Y]+it*p1[Y] );
}

function interpolate3( p0, p1, t ) 
{
    var it = 1.0-t;
    return point3( t*p0[X]+it*p1[X], t*p0[Y]+it*p1[Y], t*p0[Z]+it*p1[Z] );
}

function cross2( p0, p1 )
{ 
    return p0[X]*p1[Y] - p1[X]*p0[Y]; 
}

function enorm2( x, y ) 
{
    // avoid oveflows
    var t;
    if ( 0 > x ) x = -x;
    if ( 0 > y ) y = -y;
    if ( 0.0 == x )  
    {
        return y;
    }
    else if ( 0.0 == y )  
    {
        return x;
    }
    else if ( x > y ) 
    {
        t = y / x;  
        return x *Sqrt( 1.0 + t*t ); 
    }
    else 
    { 
        t = x / y;
        return y * Sqrt( 1.0 + t*t ); 
    }
}

function normal2( p1, p0 ) 
{
    var d, n, lamda, normallamda, l;

    d = point2( p1[X]-p0[X], p1[Y]-p0[Y] );
    
    if ( 0 === d[Y] && 0 === d[X] )  // same point infinite normals
    {
        return null;
    }
    
    n = point2( 0, 0 );
    
    if ( 0 === d[X] ) // lamda=Inf
    {
        n[X] = 10;
    }
    if ( 0 === d[Y] )  // normallamda=Inf
    {
        n[Y] = 10;
    }
    
    if ( 0 !== d[Y] && 0 !== d[X] )
    {
        lamda = d[Y] / d[X];
        normallamda = -d[X] / d[Y];
        n[X] = 10;
        n[Y] = normallamda*n[X];
    }
    
    // normalize
    l = enorm2( n[X], n[Y] );
    n[X] /= l; n[Y] /= l;
    if ( 0 > cross2( d, n ) )
    {
        n[X] = -n[X];
        n[Y] = -n[Y];
    }
    return n;
}

// compute integral image (Summed Area Table, SAT)
function integral( im, w, h, grayscale ) 
{
    var rowLen = w<<2, integralR, integralG, integralB, colR, colG, colB,
        imLen = im.length, count = (imLen>>2), i, j, x, rgb
    ;
    rgb = true !== grayscale;
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
    }
    // other rows
    i=rowLen; x=0; j=0; colR=colG=colB=0;
    for (i=rowLen; i<imLen; i+=4, j++, x++)
    {
        if (x>=w) { x=0; colR=colG=colB=0; }
        colR+=im[i]; 
        integralR[j+w]=integralR[j]+colR; 
    }
    if ( rgb )
    {
        // first row
        j=0; i=0; colR=colG=colB=0;
        for (x=0; x<w; x++, i+=4, j++)
        {
            colG+=im[i+1]; colB+=im[i+2];
            integralG[j]=colG; integralB[j]=colB;
        }
        // other rows
        i=rowLen; x=0; j=0; colR=colG=colB=0;
        for (i=rowLen; i<imLen; i+=4, j++, x++)
        {
            if (x>=w) { x=0; colR=colG=colB=0; }
            colG+=im[i+1]; colB+=im[i+2];
            integralG[j+w]=integralG[j]+colG; integralB[j+w]=integralB[j]+colB;
        }
        return [integralR, integralG, integralB];
    }
    return [integralR, integralR, integralR];
}

// compute image histogram
function histogram( im, w, h, grayscale ) 
{
    var l = im.length,
        maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
        cdfR, cdfG, cdfB, r,g,b,
        accumR, accumG, accumB,
        i, n=1.0/(l>>2), rgb
    ;
    
    rgb = true !== grayscale;
    // initialize the arrays
    cdfR=new A32F(256); 
    if ( rgb )
    {
        cdfG=new A32F(256); 
        cdfB=new A32F(256);
    }
    for (i=0; i<256; i+=8) 
    { 
        // partial loop unrolling
        cdfR[i]=0;
        cdfR[i+1]=0;
        cdfR[i+2]=0;
        cdfR[i+3]=0;
        cdfR[i+4]=0;
        cdfR[i+5]=0;
        cdfR[i+6]=0;
        cdfR[i+7]=0;
    }
    // compute pdf and maxima/minima
    for (i=0; i<l; i+=4)
    {
        r = im[i];
        cdfR[r] += n;
        
        if (r>maxR) maxR=r;
        else if (r<minR) minR=r;
    }
    
    // compute cdf
    accumR=accumG=accumB=0;
    for (i=0; i<256; i+=8) 
    { 
        // partial loop unrolling
        accumR += cdfR[i]; cdfR[i] = accumR;
        accumR += cdfR[i+1]; cdfR[i+1] = accumR;
        accumR += cdfR[i+2]; cdfR[i+2] = accumR;
        accumR += cdfR[i+3]; cdfR[i+3] = accumR;
        accumR += cdfR[i+4]; cdfR[i+4] = accumR;
        accumR += cdfR[i+5]; cdfR[i+5] = accumR;
        accumR += cdfR[i+6]; cdfR[i+6] = accumR;
        accumR += cdfR[i+7]; cdfR[i+7] = accumR;
    }
    
    if ( rgb )
    {
        // initialize the arrays
        for (i=0; i<256; i+=8) 
        { 
            // partial loop unrolling
            cdfG[i]=0; cdfB[i]=0;
            cdfG[i+1]=0; cdfB[i+1]=0;
            cdfG[i+2]=0; cdfB[i+2]=0;
            cdfG[i+3]=0; cdfB[i+3]=0;
            cdfG[i+4]=0; cdfB[i+4]=0;
            cdfG[i+5]=0; cdfB[i+5]=0;
            cdfG[i+6]=0; cdfB[i+6]=0;
            cdfG[i+7]=0; cdfB[i+7]=0;
        }
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            g = im[i+1]; b = im[i+2];
            cdfG[g] += n; cdfB[b] += n;
            if (g>maxG) maxG=g;
            else if (g<minG) minG=g;
            if (b>maxB) maxB=b;
            else if (b<minB) minB=b;
        }
        
        // compute cdf
        accumR=accumG=accumB=0;
        for (i=0; i<256; i+=8) 
        { 
            // partial loop unrolling
            accumG += cdfG[i]; cdfG[i] = accumG;
            accumB += cdfB[i]; cdfB[i] = accumB;
            accumG += cdfG[i+1]; cdfG[i+1] = accumG;
            accumB += cdfB[i+1]; cdfB[i+1] = accumB;
            accumG += cdfG[i+2]; cdfG[i+2] = accumG;
            accumB += cdfB[i+2]; cdfB[i+2] = accumB;
            accumG += cdfG[i+3]; cdfG[i+3] = accumG;
            accumB += cdfB[i+3]; cdfB[i+3] = accumB;
            accumG += cdfG[i+4]; cdfG[i+4] = accumG;
            accumB += cdfB[i+4]; cdfB[i+4] = accumB;
            accumG += cdfG[i+5]; cdfG[i+5] = accumG;
            accumB += cdfB[i+5]; cdfB[i+5] = accumB;
            accumG += cdfG[i+6]; cdfG[i+6] = accumG;
            accumB += cdfB[i+6]; cdfB[i+6] = accumB;
            accumG += cdfG[i+7]; cdfG[i+7] = accumG;
            accumB += cdfB[i+7]; cdfB[i+7] = accumB;
        }
        return [cdfR, cdfG, cdfB];
    }
    return [cdfR, cdfR, cdfR];
}

function spectrum( im, w, h, grayscale ) 
{
    // TODO
    return null;
}

function crop( im, w, h, x1, y1, x2, y2 )
{
    x2 = Min(x2,w-1); y2 = Min(y2,h-1);
    var nw = x2-x1+1, nh = y2-y1+1, 
        croppedSize = (nw*nh)<<2, cropped = new IMG(croppedSize), 
        y, yw, nw4 = nw<<2, pixel, pixel2;

    for (y=y1,yw=y1*w,pixel=0; y<=y2; y++,yw+=w,pixel+=nw4)
    {
        pixel2 = (yw+x1)<<2;
        arrayset(cropped, subarray(im, pixel2, pixel2+nw4), pixel);
    }
    return cropped;
}

function pad( im, w, h, pad_right, pad_bot, pad_left, pad_top )
{
    pad_right = pad_right || 0; pad_bot = pad_bot || 0;
    pad_left = pad_left || 0; pad_top = pad_top || 0;
    var nw = w+pad_left+pad_right, nh = h+pad_top+pad_bot, 
        paddedSize = (nw*nh)<<2, padded = new IMG(paddedSize), 
        y, yw, w4 = w<<2, nw4 = nw<<2, pixel, pixel2,
        offtop = pad_top*nw4, offleft = pad_left<<2;

    for (y=0,yw=0,pixel=offtop; y<h; y++,yw+=w,pixel+=nw4)
    {
        pixel2 = yw<<2;
        arrayset(padded, subarray(im, pixel2, pixel2+w4), offleft+pixel);
    }
    return padded;
}

// speed-up convolution for special kernels like moving-average
function integralConvolution(im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats) 
{
    var imLen=im.length, imArea=(imLen>>2), integral, integralLen, colR, colG, colB,
        matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2,
        r, g, b, r2, g2, b2, repeat
    ;
    
    // convolution speed-up based on the integral image concept and symmetric / separable kernels
    
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    matArea = matRadiusX*matRadiusY;
    matHalfSideX = matRadiusX>>1;  matHalfSideY = w*(matRadiusY>>1);
    // one additional offest needed due to integral computation
    matOffsetLeft = -matHalfSideX-1; matOffsetTop = -matHalfSideY-w;
    matOffsetRight = matHalfSideX; matOffsetBottom = matHalfSideY;
    bx1 = 0; bx2 = w-1; by1 = 0; by2 = imArea-w;
    
    integralLen = (imArea<<1)+imArea;  rowLen = (w<<1)+w;
    
    numRepeats = numRepeats||1;  repeat = 0;
    
    if (matrix2) // allow to compute a second matrix in-parallel
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
        wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>1]; centerOffset2 = wtCenter2-wt2;
        
        // do this multiple times??
        while (repeat<numRepeats)
        {
            dst = new IMG(imLen); integral = new A32F(integralLen);
            
            // compute integral of image in one pass
            
            // first row
            i=0; j=0; colR=colG=colB=0;
            for (x=0; x<w; x++, i+=4, j+=3)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
            }
            // other rows
            j=0; x=0; colR=colG=colB=0;
            for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=0; }
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j+rowLen]=integral[j]+colR; 
                integral[j+rowLen+1]=integral[j+1]+colG; 
                integral[j+rowLen+2]=integral[j+2]+colB;
            }
            
            
            // now can compute any symmetric convolution kernel in constant time 
            // depending only on image dimensions, regardless of matrix radius
            
            // do direct convolution
            x=0; y=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; y++; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;
                
                // fix borders
                 xOff1 = (xOff1<bx1) ? bx1 : xOff1;
                 xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                 yOff1 = (yOff1<by1) ? by1 : yOff1;
                 yOff2 = (yOff2>by2) ? by2 : yOff2;
                
                // compute integral positions
                p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                // arguably faster way to write p1*=3; etc..
                p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                
                // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                // also fix the center element (in case it is different)
                r = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1])  +  (centerOffset * im[i]);
                g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                
                r2 = wt2 * (integral[p4] - integral[p2] - integral[p3] + integral[p1])  +  (centerOffset2 * im[i]);
                g2 = wt2 * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset2 * im[i+1]);
                b2 = wt2 * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset2 * im[i+2]);
                
                // output
                t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            
            // do another pass??
            im = dst;  repeat++;
        }
    }
    else
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
    
        // do this multiple times??
        while (repeat<numRepeats)
        {
            dst = new IMG(imLen); integral = new A32F(integralLen);
            
            // compute integral of image in one pass
            
            // first row
            i=0; j=0; colR=colG=colB=0;
            for (x=0; x<w; x++, i+=4, j+=3)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
            }
            // other rows
            j=0; x=0; colR=colG=colB=0;
            for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=0; }
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j+rowLen]=integral[j]+colR; 
                integral[j+rowLen+1]=integral[j+1]+colG; 
                integral[j+rowLen+2]=integral[j+2]+colB;
            }
            
            // now can compute any symmetric convolution kernel in constant time 
            // depending only on image dimensions, regardless of matrix radius
            
            // do direct convolution
            x=0; y=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; y++; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;
                
                // fix borders
                 xOff1 = (xOff1<bx1) ? bx1 : xOff1;
                 xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                 yOff1 = (yOff1<by1) ? by1 : yOff1;
                 yOff2 = (yOff2>by2) ? by2 : yOff2;
                
                // compute integral positions
                p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                // arguably faster way to write p1*=3; etc..
                p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                
                // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                // also fix the center element (in case it is different)
                r = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1])  +  (centerOffset * im[i]);
                g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                
                // output
                t0 = coeff1*r + coeff2;  t1 = coeff1*g + coeff2;  t2 = coeff1*b + coeff2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            
            // do another pass??
            im = dst;  repeat++;
        }
    }
    return dst;
}
function integralConvolution_rgba(im, w, h, matrix, dimX, dimY, coeff1, coeff2, numRepeats) 
{
    var imLen=im.length, imArea=(imLen>>2), integral, integralLen, colR, colG, colB, colA,
        matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2, t3,
        r, g, b, a, repeat
    ;
    
    // convolution speed-up based on the integral image concept and symmetric / separable kernels
    
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    matArea = matRadiusX*matRadiusY;
    matHalfSideX = matRadiusX>>1;  matHalfSideY = w*(matRadiusY>>1);
    // one additional offest needed due to integral computation
    matOffsetLeft = -matHalfSideX-1; matOffsetTop = -matHalfSideY-w;
    matOffsetRight = matHalfSideX; matOffsetBottom = matHalfSideY;
    bx1 = 0; bx2 = w-1; by1 = 0; by2 = imArea-w;
    
    integralLen = imLen;  rowLen = w<<2;
    
    numRepeats = numRepeats||1;  repeat = 0;
    
    wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;

    // do this multiple times??
    while (repeat<numRepeats)
    {
        dst = new IMG(imLen); integral = new A32F(integralLen);
        
        // compute integral of image in one pass
        
        // first row
        i=0; colR=colG=colB=colA=0;
        for (x=0; x<w; x++, i+=4)
        {
            colR+=im[i]; colG+=im[i+1]; colB+=im[i+2]; colA+=im[i+3];
            integral[i]=colR; integral[i+1]=colG; integral[i+2]=colB; integral[i+3]=colA;
        }
        // other rows
        x=0; colR=colG=colB=colA=0;
        for (i=rowLen+w; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; colR=colG=colB=colA=0; }
            colR+=im[i]; colG+=im[i+1]; colB+=im[i+2]; colB+=im[i+3];
            integral[i+rowLen]=integral[i]+colR; 
            integral[i+rowLen+1]=integral[i+1]+colG; 
            integral[i+rowLen+2]=integral[i+2]+colB;
            integral[i+rowLen+3]=integral[i+3]+colA;
        }
        
        // now can compute any symmetric convolution kernel in constant time 
        // depending only on image dimensions, regardless of matrix radius
        
        // do direct convolution
        x=0; y=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; y++; ty+=w; }
            
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
            xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;
            
            // fix borders
             xOff1 = (xOff1<bx1) ? bx1 : xOff1;
             xOff2 = (xOff2>bx2) ? bx2 : xOff2;
             yOff1 = (yOff1<by1) ? by1 : yOff1;
             yOff2 = (yOff2>by2) ? by2 : yOff2;
            
            // compute integral positions
            p1=(xOff1 + yOff1)<<2; p4=(xOff2 + yOff2)<<2; p2=(xOff2 + yOff1)<<2; p3=(xOff1 + yOff2)<<2;
            
            // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
            // also fix the center element (in case it is different)
            r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
            g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
            b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
            a = wt * (integral[p4+3] - integral[p2+3] - integral[p3+3] + integral[p1+3])  +  (centerOffset * im[i+3]);
            
            // output
            t0 = coeff1*r + coeff2;  t1 = coeff1*g + coeff2;  t2 = coeff1*b + coeff2; t3 = coeff1*a + coeff2;
            if (notSupportClamp)
            {   
                // clamp them manually
                t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                t3 = (t3<0) ? 0 : ((t3>255) ? 255 : t3);
            }
            dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2; dst[i+3] = ~~t3;
        }
        
        // do another pass??
        im = dst;  repeat++;
    }
    return dst;
}

// speed-up convolution for separable kernels
function separableConvolution(im, w, h, matrix, matrix2, ind1, ind2, coeff1, coeff2) 
{
    var imLen=im.length, imArea=(imLen>>2),
        matA, indA,
        matArea, mat, indices, matArea2,
        dst, imageIndices,
        i, j, k, x, ty, ty2,
        xOff, yOff, bx, by, t0, t1, t2, wt,
        r, g, b, coeffs, coeff,
        numPasses
    ;
    
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    matA = [matrix2, matrix];
    indA = [ind2, ind1];
    coeffs = [coeff2, coeff1];
    
    bx = w-1; by = imArea-w;
    
    // one horizontal and one vertical pass
    numPasses = 2;
    while (numPasses--)
    {
        dst = new IMG(imLen);
        
        mat = matA[numPasses];
        indices = indA[numPasses];
        matArea = mat.length;
        matArea2 = indices.length;
        coeff = coeffs[numPasses];
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        imageIndices = new A16I(indices);
        for (k=0; k<matArea2; k+=2)
        { 
            imageIndices[k+1] *= w;
        } 
    
        // do direct convolution
        if (notSupportClamp)
        {   
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=0; g=0; b=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                    }
                }
                
                // output
                t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                
                // clamp them manually
                t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
        }
        else
        {
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=0; g=0; b=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                    }
                }
                
                // output
                t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
        }
        
        // do another pass??
        im = dst;
    }
    return dst;
}

//
// Constants
FILTER.CONSTANTS = FILTER.CONST = {
     PI:    PI
    ,PI2:   PI2
    ,PI_2:  PI_2
    ,SQRT2: SQRT2
    ,LN2: LN2
    ,toRad: PI/180
    ,toDeg: 180/PI
    ,X: X
    ,Y: Y
    ,Z: Z
};
FILTER.Geometry = {
     Point2: point2
    ,Point3: point3
    ,enorm2: enorm2
    ,cross2: cross2
    ,normal2: normal2
    ,interpolate2: interpolate2
    ,interpolate3: interpolate3
};
FILTER.Math = {
     clamp: clamp
    ,closestPower2: closest_power_of_two
    ,integral: integral
    ,histogram: histogram
    ,spectrum: spectrum
    ,integralConvolution: integralConvolution
    ,separableConvolution: separableConvolution
    ,integralConvolution_rgba: integralConvolution_rgba
};

FILTER.Interpolation.crop = crop;
FILTER.Interpolation.pad = pad;

}(FILTER);