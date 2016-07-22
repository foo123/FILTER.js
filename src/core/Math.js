/**
*
* Filter Math
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var IMG = FILTER.ImArray, A32F = FILTER.Array32F, A64F = FILTER.Array64F,
    Sqrt = Math.sqrt, Pow = Math.pow, Ceil = Math.ceil, Log = Math.log, 
    PI = Math.PI, PI2 = PI+PI, PI_2 = 0.5*PI, LN2 = Math.LN2, SQRT2 = Math.SQRT2,
    log2 = function( x ) { return Log(x) / LN2; },
    Log2 = Math.log2 || log2, Min = Math.min,
    X = 0, Y = 1, Z = 2,
    arrayset = FILTER.ArraySet, subarray = FILTER.ArraySubArray
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
        integralG = new A32F(count); 
        integralB = new A32F(count);
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
        cdfG=new A32F(256); 
        cdfB=new A32F(256);
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
};

FILTER.Interpolation.crop = crop;
FILTER.Interpolation.pad = pad;

}(FILTER);