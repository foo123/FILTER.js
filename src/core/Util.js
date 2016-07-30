/**
*
* Filter Core Utils (Filter, Image, Math, Geometry)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var IMG = FILTER.ImArray, IMGcpy = FILTER.ImArrayCopy,
    A32F = FILTER.Array32F, A64F = FILTER.Array64F,
    A16I = FILTER.Array16I, A8U = FILTER.Array8U,
    ColorTable = FILTER.ColorTable, ColorMatrix = FILTER.ColorMatrix, ConvolutionMatrix = FILTER.ConvolutionMatrix,
    MathUtil = FILTER.Util.Math, StringUtil = FILTER.Util.String,
    ImageUtil = FILTER.Util.Image, FilterUtil = FILTER.Util.Filter,
    Sqrt = Math.sqrt, Pow = Math.pow, Ceil = Math.ceil,
    Log = Math.log, Sin = Math.sin, Cos = Math.cos,
    Min = Math.min, Max = Math.max, Abs = Math.abs,
    PI = Math.PI, PI2 = PI+PI, PI_2 = 0.5*PI, 
    pi = PI, pi2 = PI2, pi_2 = PI_2, pi_32 = 3*pi_2,
    Log2 = Math.log2 || function( x ) { return Log(x) / Math.LN2; },
    arrayset = FILTER.Util.Array.arrayset, subarray = FILTER.Util.Array.subarray,
    MODE = FILTER.MODE, notSupportClamp = FILTER._notSupportClamp,
    esc_re = /([.*+?^${}()|\[\]\/\\\-])/g, trim_re = /^\s+|\s+$/g
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
    p[0] = x||0.0; p[1] = y||0.0;
    return p;
}

function point3( x, y, z )
{
    var p = new A32F( 3 );
    p[0] = x||0.0; p[1] = y||0.0; p[2] = z||0.0;
    return p;
}

function interpolate2( p0, p1, t ) 
{
    return point2( p0[0]+t*(p1[0]-p0[0]), p0[1]+t*(p1[1]-p0[1]) );
}

function interpolate3( p0, p1, t ) 
{
    return point3( p0[0]+t*(p1[0]-p0[0]), p0[1]+t*(p1[1]-p0[1]), p0[2]+t*(p1[2]-p0[2]) );
}

function cross2( p0, p1 )
{ 
    return p0[0]*p1[1] - p1[0]*p0[1]; 
}

function enorm2( x, y ) 
{
    // avoid oveflows
    var t;
    if ( 0 > x ) x = -x;
    if ( 0 > y ) y = -y;
    if ( 0 === x )  
    {
        return y;
    }
    else if ( 0 === y )  
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

    d = point2( p1[0]-p0[0], p1[1]-p0[1] );
    
    if ( 0 === d[1] && 0 === d[0] )  // same point infinite normals
    {
        return null;
    }
    
    n = point2( 0, 0 );
    
    if ( 0 === d[0] ) // lamda=Inf
    {
        n[0] = 10;
    }
    if ( 0 === d[1] )  // normallamda=Inf
    {
        n[1] = 10;
    }
    
    if ( 0 !== d[1] && 0 !== d[0] )
    {
        lamda = d[1] / d[0];
        normallamda = -d[0] / d[1];
        n[0] = 10;
        n[1] = normallamda*n[0];
    }
    
    // normalize
    l = enorm2( n[0], n[1] );
    n[0] /= l; n[1] /= l;
    if ( 0 > cross2( d, n ) )
    {
        n[0] = -n[0];
        n[1] = -n[1];
    }
    return n;
}

function crop( im, w, h, x1, y1, x2, y2 )
{
    x2 = Min(x2, w-1); y2 = Min(y2, h-1);
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

function get_data( D, W, H, x0, y0, x1, y1, orig )
{
    x0 = Min(x0, W-1); y0 = Min(y0, H-1);
    x1 = Min(x1, W-1); y1 = Min(y1, H-1);
    if ( (0 === x0) && (0 === y0) && (W === x1+1) && (H === y1+1) ) return true === orig ? D : new IMGcpy( D );
    if ( !D.length || (x1 < x0) || (y1 < y0) ) return new IMG(0);
    var x, y, i, I, w = x1-x0+1, h = y1-y0+1, size = (w*h) << 2, d = new IMG(size);
    for(x=x0,y=y0,i=0; y<=y1; i+=4,x++)
    {
        if ( x>x1 ){ x=x0; y++; }
        I = (y*W + x) << 2;
        d[i  ] = D[I  ];
        d[i+1] = D[I+1];
        d[i+2] = D[I+2];
        d[i+3] = D[I+3];
    }
    return d;
}

function set_data( D, W, H, d, w, h, x0, y0, x1, y1, X0, Y0 )
{
    var i, I, x, y;
    if ( !D.length || !d.length || !w || !h || !W || !H ) return D;
    x0 = Min(x0, w-1); y0 = Min(y0, h-1);
    X0 = Min(X0, W-1); Y0 = Min(Y0, H-1);
    x1 = Min(x1, w-1); y1 = Min(y1, h-1);
    X0 -= x0; Y0 -= y0;
    for(x=x0,y=y0; y<=y1; x++)
    {
        if ( x>x1 ) { x=x0; y++; }
        if ( (y+Y0 >= H) || (x+X0 >= W) ) continue;
        i = (y*w + x) << 2;
        I = ((y+Y0)*W + x+X0) << 2;
        D[I  ] = d[i  ];
        D[I+1] = d[i+1];
        D[I+2] = d[i+2];
        D[I+3] = d[i+3];
    }
    return D;
}

function fill_data( D, W, H, c, x0, y0, x1, y1 )
{
    x0 = Min(x0, W-1); y0 = Min(y0, H-1);
    x1 = Min(x1, W-1); y1 = Min(y1, H-1);
    if ( !D.length || (x1 < x0) || (y1 < y0) ) return D;
    var x, y, i, r = c[0] & 255, g = c[1] & 255, b = c[2] & 255, a = 3 < c.length ? c[3] & 255 : 255;
    for(x=x0,y=y0; y<=y1; x++)
    {
        if ( x>x1 ) { x=x0; y++; }
        i = (y*W + x) << 2;
        D[i  ] = r;
        D[i+1] = g;
        D[i+2] = b;
        D[i+3] = a;
    }
    return D;
}

function generic_transform( im, w, h, T, mode )
{
    var x, y, i, j, imLen=im.length, dst=new IMG(imLen), t, tx, ty,
        CLAMP = MODE.CLAMP, WRAP = MODE.WRAP;
    mode = mode || CLAMP;

    x=0; y=0;
    for (i=0; i<imLen; i+=4, x++)
    {
        if (x>=w) { x=0; y++; }
        
        t = T([x, y], w, h); tx = ~~(t[0]); ty = ~~(t[1]);
        if ( 0>tx || tx>=w || 0>ty || ty>=h )
        {
            if ( WRAP === mode )
            {
                if ( ty >= h ) ty -= h;
                else if ( ty < 0 ) ty += h;
                if ( tx >= w ) tx -= w;
                else if ( tx < 0 )  tx += w;
            }
            else //if ( CLAMP === mode )
            {
                if ( ty >= h )  ty = h-1;
                else if ( ty < 0 ) ty = 0;
                if ( tx >= w ) tx = w-1;
                else if ( tx < 0 ) tx = 0;
            }
        }
        j = (tx + ty*w) << 2;
        dst[i] = im[j];   dst[i+1] = im[j+1];
        dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
    }
    return dst;
}
function affine_transform( im, w, h, a, b, c, d, tx, ty, mode )
{
    var x, y, yw, i, j, imLen=im.length, imArea=imLen>>>2, dst=new IMG(imLen),
        tyw, cw, dw, CLAMP = MODE.CLAMP, WRAP = MODE.WRAP, nx, ny, bx=w-1, by=imArea-w
    ;
    mode = mode || CLAMP;
    
    x=0; y=0; tyw=ty*w; cw=c*w; dw=d*w;
    for (i=0; i<imLen; i+=4,x++)
    {
        if (x>=w) { x=0; y++; }
        
        nx = ~~(a*x + b*y + tx); ny = ~~(cw*x + dw*y + tyw);
        if ( 0>nx || nx>bx || 0>ny || ny>by )
        {
            if ( WRAP === mode )
            {
                if ( ny > by ) ny -= imArea;
                else if ( ny < 0 ) ny += imArea;
                if ( nx >= w ) nx -= w;
                else if ( nx < 0 )  nx += w;
            }
            else //if ( CLAMP === mode )
            {
                if ( ny > by )  ny = by;
                else if ( ny < 0 ) ny = 0;
                if ( nx > bx ) nx = bx;
                else if ( nx < 0 ) nx = 0;
            }
        }
        j = (nx + ny) << 2;
        dst[i] = im[j];   dst[i+1] = im[j+1];
        dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
    }
    return dst;
}
function cyclic_shift( im, w, h, dx, dy )
{
    var x, y, yw, i, j, l = im.length, dst = new IMG(l);
    
    if ( dx < 0 ) dx += w;
    if ( dy < 0 ) dy += h;
    
    x=0; y=0; yw=0;
    for (i=0; i<l; i+=4, x++)
    {
        if (x>=w) { x=0; y++; yw+=w; }
        
        j = ( (x+dx) % w + ((y+dy) % h) * w ) << 2;
        dst[i] = im[j];   dst[i+1] = im[j+1];
        dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
    }
    return dst;
}
function flip_x( im, w, h )
{
    var x, y, yw, i, j, l = im.length, dst = new IMG(l);
    
    x=0; y=0; yw=0;
    for (i=0; i<l; i+=4, x++)
    {
        if (x>=w) { x=0; y++; yw+=w; }
        
        j = (w-1-x+yw)<<2;
        dst[i] = im[j];   dst[i+1] = im[j+1];
        dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
    }
    return dst;
}
function flip_y( im, w, h )
{
    var x, y, yw2, i, j, l = im.length, dst = new IMG(l);
    
    x=0; y=0; yw2=(h-1)*w;
    for (i=0; i<l; i+=4, x++)
    {
        if (x>=w) { x=0; y++; yw2-=w; }
        
        j = (x+yw2)<<2;
        dst[i] = im[j];   dst[i+1] = im[j+1];
        dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
    }
    return dst;
}
function flip_xy( im, w, h )
{
    var x, y, yw, yw2, i, j, l = im.length, dst = new IMG(l);
    
    x=0; y=0; yw2=(h-1)*w;
    for (i=0; i<l; i+=4, x++)
    {
        if (x>=w) { x=0; y++; yw+=w; yw2-=w; }
        
        j = (w-1-x+yw2)<<2;
        dst[i] = im[j];   dst[i+1] = im[j+1];
        dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
    }
    return dst;
}
/*
// adapted from http://www.jhlabs.com/ip/filters/
function polar_transform( im, w, h, mode )
{
    var x, y, i, j, imLen=im.length, imcopy=new IMGcpy(im),
        tx, ty, ix, iy, ip, bx = w-1, by = h-1, theta, r=0, radius, cX, cY,
        CLAMP = MODE.CLAMP, WRAP = MODE.WRAP;
    mode = mode || CLAMP;
    
    cX = ~~(0.5*w + 0.5);
    cY = ~~(0.5*h + 0.5);
    radius = Max(cY, cX);
        
    x=0; y=0;
    for (i=0; i<imLen; i+=4, x++)
    {
        if (x>=w) { x=0; y++; }
        
        tx = x-cX;
        ty = y-cY;
        theta = 0;
        
        if (tx >= 0) 
        {
            if (ty > 0) 
            {
                theta = PI - Atan(tx/ty);
                r = Sqrt(tx*tx + ty*ty);
            } 
            else if (ty < 0) 
            {
                theta = Atan(tx/ty);
                r = Sqrt(tx*tx + ty*ty);
            } 
            else 
            {
                theta = HalfPI;
                r = tx;
            }
        } 
        else if (tx < 0) 
        {
            if (ty < 0) 
            {
                theta = DoublePI - Atan(tx/ty);
                r = Sqrt(tx*tx + ty*ty);
            } 
            else if (ty > 0) 
            {
                theta = PI + Atan(tx/ty);
                r = Sqrt(tx*tx + ty*ty);
            } 
            else 
            {
                theta = ThreePI2;
                r = -tx;
            }
        }
        // inverse transform
        ix = (w-1) - (w-1)/DoublePI * theta;
        iy = (h * r / radius);
        ix = Round(ix); iy = Round(iy);
        if (0>ix || ix>bx || 0>iy || iy>by)
        {
            switch(mode)
            {
                case WRAP:
                    if (iy>by) iy-=h;
                    else if (iy<0) iy+=h;
                    if (ix>bx) ix-=w;
                    else if (ix<0)  ix+=w;
                    break;
                    
                case CLAMP:
                default:
                    if (iy>by)  iy=by;
                    else if (iy<0) iy=0;
                    if (ix>bx) ix=bx;
                    else if (ix<0) ix=0;
                    break;
            }
        }
        ip = ( ix + iy*w ) << 2;
        im[i] = imcopy[ ip ];
        im[i+1] = imcopy[ ip+1 ];
        im[i+2] = imcopy[ ip+2 ];
        im[i+3] = imcopy[ ip+3 ];
    }
    return im;
}
function cartesian( im, w, h, mode )
{
    var x, y, i, j, imLen=im.length, imcopy=new IMGcpy(im),
        ix, iy, ip, nx, ny, bx = w-1, by = h-1, 
        theta, theta2, r=0, radius, cX, cY, 
        CLAMP = MODE.CLAMP, WRAP = MODE.WRAP;
    mode = mode || CLAMP;
    
    cX = ~~(0.5*w + 0.5);
    cY = ~~(0.5*h + 0.5);
    radius = Max(cY, cX);
        
    x=0; y=0;
    for (i=0; i<imLen; i+=4, x++)
    {
        if (x>=w) { x=0; y++; }
        
        theta = x / w * DoublePI;

        if (theta >= ThreePI2)
            theta2 = DoublePI - theta;
        else if (theta >= PI)
            theta2 = theta - PI;
        else if (theta >= HalfPI)
            theta2 = PI - theta;
        else
            theta2 = theta;
        r = radius * (y / h);

        nx = -r * Sin(theta2);
        ny = r * Cos(theta2);
        
        if (theta >= ThreePI2) 
        {
            ix = cX - nx;
            iy = cY - ny;
        } 
        else if (theta >= PI) 
        {
            ix = cX - nx;
            iy = cY + ny;
        } 
        else if (theta >= HalfPI) 
        {
            ix = cX + nx;
            iy = cY + ny;
        } 
        else 
        {
            ix = cX + nx;
            iy = cY - ny;
        }
        // inverse transform
        ix = Round(ix); iy = Round(iy);
        if (0>ix || ix>bx || 0>iy || iy>by)
        {
            switch(mode)
            {
                case WRAP:
                    if (iy>by) iy-=h;
                    else if (iy<0) iy+=h;
                    if (ix>bx) ix-=w;
                    else if (ix<0)  ix+=w;
                    break;
                    
                case CLAMP:
                default:
                    if (iy>by)  iy=by;
                    else if (iy<0) iy=0;
                    if (ix>bx) ix=bx;
                    else if (ix<0) ix=0;
                    break;
            }
        }
        ip = ( ix + iy*w ) << 2;
        im[i] = imcopy[ ip ];
        im[i+1] = imcopy[ ip+1 ];
        im[i+2] = imcopy[ ip+2 ];
        im[i+3] = imcopy[ ip+3 ];
    }
    return im;
}*/

// compute integral image (Summed Area Table, SAT) (for a given channel)
function integral( im, w, h, channel ) 
{
    var rowLen = w<<2, integ, sum,
        imLen = im.length, count = imLen>>2, i, j, x
    ;
    // compute integral of image in one pass
    channel = channel || 0;
    integ = new A32F(count); 
    // first row
    for (x=0,j=0,i=0,sum=0; x<w; x++, i+=4, j++)
    {
        sum+=im[i+channel]; integ[j]=sum; 
    }
    // other rows
    for (x=0,j=0,sum=0,i=rowLen; i<imLen; i+=4, j++, x++)
    {
        if ( x >=w ) { x=0; sum=0; }
        sum+=im[i+channel]; integ[j+w]=integ[j]+sum; 
    }
    return integ;
}

// compute image histogram (for a given channel)
function histogram( im, w, h, channel ) 
{
    var i, l = im.length, cdf, accum, n = 1.0 / (l>>2);
    
    // initialize the arrays
    channel = channel || 0;
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
        cdf[ im[i+channel] ] += n;
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
    return cdf;
}

function spectrum( im, w, h, channel ) 
{
    // TODO
    return null;
}

// speed-up convolution for special kernels like moving-average
function integral_convolution_rgb(rgba, im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats) 
{
    var imLen=im.length, imArea=(imLen>>2), integral, integralLen, colR, colG, colB,
        matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2,
        r, g, b, r2, g2, b2, repeat, tmp
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
    dst = im; im = new IMG(imLen); integral = new A32F(integralLen);
    
    numRepeats = numRepeats||1;
    
    if (matrix2) // allow to compute a second matrix in-parallel
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
        wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>1]; centerOffset2 = wtCenter2-wt2;
        
        // do this multiple times??
        for(repeat=0; repeat<numRepeats; repeat++)
        {
            //dst = new IMG(imLen); integral = new A32F(integralLen);
            tmp = im; im = dst; dst = tmp;

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
                 xOff1 = xOff1<bx1 ? bx1 : xOff1;
                 xOff2 = xOff2>bx2 ? bx2 : xOff2;
                 yOff1 = yOff1<by1 ? by1 : yOff1;
                 yOff2 = yOff2>by2 ? by2 : yOff2;
                
                // compute integral positions
                p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                // arguably faster way to write p1*=3; etc..
                p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                
                // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                // also fix the center element (in case it is different)
                r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                
                r2 = wt2 * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset2 * im[i  ]);
                g2 = wt2 * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset2 * im[i+1]);
                b2 = wt2 * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset2 * im[i+2]);
                
                // output
                t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            
            // do another pass??
        }
    }
    else
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
    
        // do this multiple times??
        for(repeat=0; repeat<numRepeats; repeat++)
        {
            //dst = new IMG(imLen); integral = new A32F(integralLen);
            tmp = im; im = dst; dst = tmp;
            
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
                integral[j+rowLen  ]=integral[j  ]+colR; 
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
                 xOff1 = xOff1<bx1 ? bx1 : xOff1;
                 xOff2 = xOff2>bx2 ? bx2 : xOff2;
                 yOff1 = yOff1<by1 ? by1 : yOff1;
                 yOff2 = yOff2>by2 ? by2 : yOff2;
                
                // compute integral positions
                p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                // arguably faster way to write p1*=3; etc..
                p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                
                // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                // also fix the center element (in case it is different)
                r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                
                // output
                t0 = coeff1*r + coeff2;  t1 = coeff1*g + coeff2;  t2 = coeff1*b + coeff2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            
            // do another pass??
        }
    }
    return dst;
}
/*function integral_convolution_rgba(rgba, im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats) 
{
    var imLen=im.length, imArea=(imLen>>2), integral, integralLen, colR, colG, colB, colA,
        matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2, t3,
        r, g, b, a, r2, g2, b2, a2, repeat, tmp
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
    dst = im; im = new IMG(imLen); integral = new A32F(integralLen);
    
    numRepeats = numRepeats||1;
    
    if (matrix2) // allow to compute a second matrix in-parallel
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
        wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>1]; centerOffset2 = wtCenter2-wt2;
        
        // do this multiple times??
        for(repeat=0; repeat<numRepeats; repeat++)
        {
            //dst = new IMG(imLen); integral = new A32F(integralLen);
            tmp = im; im = dst; dst = tmp;
            
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
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2]; colA+=im[i+3];
                integral[i+rowLen  ]=integral[i  ]+colR; 
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
                 xOff1 = xOff1<bx1 ? bx1 : xOff1;
                 xOff2 = xOff2>bx2 ? bx2 : xOff2;
                 yOff1 = yOff1<by1 ? by1 : yOff1;
                 yOff2 = yOff2>by2 ? by2 : yOff2;
                
                // compute integral positions
                p1=(xOff1 + yOff1)<<2; p4=(xOff2 + yOff2)<<2; p2=(xOff2 + yOff1)<<2; p3=(xOff1 + yOff2)<<2;
                
                // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                // also fix the center element (in case it is different)
                r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                a = wt * (integral[p4+3] - integral[p2+3] - integral[p3+3] + integral[p1+3])  +  (centerOffset * im[i+3]);
                
                r2 = wt2 * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset2 * im[i  ]);
                g2 = wt2 * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset2 * im[i+1]);
                b2 = wt2 * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset2 * im[i+2]);
                a2 = wt2 * (integral[p4+3] - integral[p2+3] - integral[p3+3] + integral[p1+3])  +  (centerOffset2 * im[i+3]);
                
                // output
                t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;  t3 = coeff1*a + coeff2*a2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;  dst[i+3] = ~~t3;
            }
            
            // do another pass??
        }
    }
    else
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
    
        // do this multiple times??
        for(repeat=0; repeat<numRepeats; repeat++)
        {
            //dst = new IMG(imLen); integral = new A32F(integralLen);
            tmp = im; im = dst; dst = tmp;
            
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
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2]; colA+=im[i+3];
                integral[i+rowLen  ]=integral[i  ]+colR; 
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
                 xOff1 = xOff1<bx1 ? bx1 : xOff1;
                 xOff2 = xOff2>bx2 ? bx2 : xOff2;
                 yOff1 = yOff1<by1 ? by1 : yOff1;
                 yOff2 = yOff2>by2 ? by2 : yOff2;
                
                // compute integral positions
                p1=(xOff1 + yOff1)<<2; p4=(xOff2 + yOff2)<<2; p2=(xOff2 + yOff1)<<2; p3=(xOff1 + yOff2)<<2;
                
                // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                // also fix the center element (in case it is different)
                r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                a = wt * (integral[p4+3] - integral[p2+3] - integral[p3+3] + integral[p1+3])  +  (centerOffset * im[i+3]);
                
                // output
                t0 = coeff1*r + coeff2;  t1 = coeff1*g + coeff2;  t2 = coeff1*b + coeff2;  t3 = coeff1*a + coeff2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;  dst[i+3] = ~~t3;
            }
            
            // do another pass??
        }
    }
    return dst;
}
function integral_convolution(rgba, im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats)
{
    return rgba
    ? integral_convolution_rgba(im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats)
    : integral_convolution_rgb(im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats)
    ;
}
*/
// speed-up convolution for separable kernels
function separable_convolution(rgba, im, w, h, matrix, matrix2, ind1, ind2, coeff1, coeff2) 
{
    var imLen=im.length, imArea=(imLen>>2),
        matArea, mat, indices, matArea2,
        dst, imageIndices, imageIndices1, imageIndices2,
        i, j, k, x, ty, ty2,
        xOff, yOff, bx, by, t0, t1, t2, t3, wt,
        r, g, b, a, coeff, numPasses, tmp
    ;
    
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    bx = w-1; by = imArea-w;
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    imageIndices1 = new A16I(ind1);
    for (k=0,matArea2=ind1.length; k<matArea2; k+=2) imageIndices1[k+1] *= w;
    imageIndices2 = new A16I(ind2);
    for (k=0,matArea2=ind2.length; k<matArea2; k+=2) imageIndices2[k+1] *= w;

    // one horizontal and one vertical pass
    numPasses = 2;
    mat = matrix;
    indices = ind1;
    coeff = coeff1;
    imageIndices = imageIndices1;
    dst = im; im = new IMG(imLen);
    
    while (numPasses--)
    {
        tmp = im; im = dst; dst = tmp;
        matArea = mat.length;
        matArea2 = indices.length;
        
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
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        //a += im[srcOff+3] * wt;
                    }
                }
                
                // output
                t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                /*if ( rgba )
                {
                    t3 = coeff * a;
                    t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                    dst[i+3] = ~~t3;
                }
                else
                {*/
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                /*}*/
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
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        //a += im[srcOff+3] * wt;
                    }
                }
                
                // output
                t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                /*if ( rgba )
                {
                    t3 = coeff * a;
                    dst[i+3] = ~~t3;
                }
                else
                {*/
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                /*}*/
            }
        }
        
        // do another pass??
        mat = matrix2;
        indices = ind2;
        coeff = coeff2;
        imageIndices = imageIndices2;
    }
    return dst;
}
function ct_eye( c1, c0 )
{
    if ( null == c0 ) c0 = 0;
    if ( null == c1 ) c1 = 1;
    var i, t = new ColorTable(256);
    for(i=0; i<256; i+=32)
    {
        t[i   ] = c0 + c1*(i   );
        t[i+1 ] = c0 + c1*(i+1 );
        t[i+2 ] = c0 + c1*(i+2 );
        t[i+3 ] = c0 + c1*(i+3 );
        t[i+4 ] = c0 + c1*(i+4 );
        t[i+5 ] = c0 + c1*(i+5 );
        t[i+6 ] = c0 + c1*(i+6 );
        t[i+7 ] = c0 + c1*(i+7 );
        t[i+8 ] = c0 + c1*(i+8 );
        t[i+9 ] = c0 + c1*(i+9 );
        t[i+10] = c0 + c1*(i+10);
        t[i+11] = c0 + c1*(i+11);
        t[i+12] = c0 + c1*(i+12);
        t[i+13] = c0 + c1*(i+13);
        t[i+14] = c0 + c1*(i+14);
        t[i+15] = c0 + c1*(i+15);
        t[i+16] = c0 + c1*(i+16);
        t[i+17] = c0 + c1*(i+17);
        t[i+18] = c0 + c1*(i+18);
        t[i+19] = c0 + c1*(i+19);
        t[i+20] = c0 + c1*(i+20);
        t[i+21] = c0 + c1*(i+21);
        t[i+22] = c0 + c1*(i+22);
        t[i+23] = c0 + c1*(i+23);
        t[i+24] = c0 + c1*(i+24);
        t[i+25] = c0 + c1*(i+25);
        t[i+26] = c0 + c1*(i+26);
        t[i+27] = c0 + c1*(i+27);
        t[i+28] = c0 + c1*(i+28);
        t[i+29] = c0 + c1*(i+29);
        t[i+30] = c0 + c1*(i+30);
        t[i+31] = c0 + c1*(i+31);
    }
    return t;
}
// multiply (functionaly compose) 2 Color Tables
function ct_multiply( ct2, ct1 )
{
    var i, ct12 = new ColorTable(256);
    for(i=0; i<256; i+=32)
    { 
        ct12[i   ] = clamp(ct2[ clamp(ct1[i   ],0,255) ],0,255); 
        ct12[i+1 ] = clamp(ct2[ clamp(ct1[i+1 ],0,255) ],0,255); 
        ct12[i+2 ] = clamp(ct2[ clamp(ct1[i+2 ],0,255) ],0,255); 
        ct12[i+3 ] = clamp(ct2[ clamp(ct1[i+3 ],0,255) ],0,255); 
        ct12[i+4 ] = clamp(ct2[ clamp(ct1[i+4 ],0,255) ],0,255); 
        ct12[i+5 ] = clamp(ct2[ clamp(ct1[i+5 ],0,255) ],0,255); 
        ct12[i+6 ] = clamp(ct2[ clamp(ct1[i+6 ],0,255) ],0,255); 
        ct12[i+7 ] = clamp(ct2[ clamp(ct1[i+7 ],0,255) ],0,255); 
        ct12[i+8 ] = clamp(ct2[ clamp(ct1[i+8 ],0,255) ],0,255); 
        ct12[i+9 ] = clamp(ct2[ clamp(ct1[i+9 ],0,255) ],0,255); 
        ct12[i+10] = clamp(ct2[ clamp(ct1[i+10],0,255) ],0,255); 
        ct12[i+11] = clamp(ct2[ clamp(ct1[i+11],0,255) ],0,255); 
        ct12[i+12] = clamp(ct2[ clamp(ct1[i+12],0,255) ],0,255); 
        ct12[i+13] = clamp(ct2[ clamp(ct1[i+13],0,255) ],0,255); 
        ct12[i+14] = clamp(ct2[ clamp(ct1[i+14],0,255) ],0,255); 
        ct12[i+15] = clamp(ct2[ clamp(ct1[i+15],0,255) ],0,255); 
        ct12[i+16] = clamp(ct2[ clamp(ct1[i+16],0,255) ],0,255); 
        ct12[i+17] = clamp(ct2[ clamp(ct1[i+17],0,255) ],0,255); 
        ct12[i+18] = clamp(ct2[ clamp(ct1[i+18],0,255) ],0,255); 
        ct12[i+19] = clamp(ct2[ clamp(ct1[i+19],0,255) ],0,255); 
        ct12[i+20] = clamp(ct2[ clamp(ct1[i+20],0,255) ],0,255); 
        ct12[i+21] = clamp(ct2[ clamp(ct1[i+21],0,255) ],0,255); 
        ct12[i+22] = clamp(ct2[ clamp(ct1[i+22],0,255) ],0,255); 
        ct12[i+23] = clamp(ct2[ clamp(ct1[i+23],0,255) ],0,255); 
        ct12[i+24] = clamp(ct2[ clamp(ct1[i+24],0,255) ],0,255); 
        ct12[i+25] = clamp(ct2[ clamp(ct1[i+25],0,255) ],0,255); 
        ct12[i+26] = clamp(ct2[ clamp(ct1[i+26],0,255) ],0,255); 
        ct12[i+27] = clamp(ct2[ clamp(ct1[i+27],0,255) ],0,255); 
        ct12[i+28] = clamp(ct2[ clamp(ct1[i+28],0,255) ],0,255); 
        ct12[i+29] = clamp(ct2[ clamp(ct1[i+29],0,255) ],0,255); 
        ct12[i+30] = clamp(ct2[ clamp(ct1[i+30],0,255) ],0,255); 
        ct12[i+31] = clamp(ct2[ clamp(ct1[i+31],0,255) ],0,255); 
    }
    return ct12;
}
function cm_eye( )
{
    return new ColorMatrix([
    1,0,0,0,0,
    0,1,0,0,0,
    0,0,1,0,0,
    0,0,0,1,0
    ]);
}
// multiply (functionaly compose, matrix multiply) 2 Color Matrices
function cm_multiply(cm1, cm2) 
{
    var cm12 = new ColorMatrix(20);

    // unroll the loop completely
    // i=0
    cm12[ 0 ] = cm2[0]*cm1[0] + cm2[1]*cm1[5] + cm2[2]*cm1[10] + cm2[3]*cm1[15];
    cm12[ 1 ] = cm2[0]*cm1[1] + cm2[1]*cm1[6] + cm2[2]*cm1[11] + cm2[3]*cm1[16];
    cm12[ 2 ] = cm2[0]*cm1[2] + cm2[1]*cm1[7] + cm2[2]*cm1[12] + cm2[3]*cm1[17];
    cm12[ 3 ] = cm2[0]*cm1[3] + cm2[1]*cm1[8] + cm2[2]*cm1[13] + cm2[3]*cm1[18];
    cm12[ 4 ] = cm2[0]*cm1[4] + cm2[1]*cm1[9] + cm2[2]*cm1[14] + cm2[3]*cm1[19] + cm2[4];

    // i=5
    cm12[ 5 ] = cm2[5]*cm1[0] + cm2[6]*cm1[5] + cm2[7]*cm1[10] + cm2[8]*cm1[15];
    cm12[ 6 ] = cm2[5]*cm1[1] + cm2[6]*cm1[6] + cm2[7]*cm1[11] + cm2[8]*cm1[16];
    cm12[ 7 ] = cm2[5]*cm1[2] + cm2[6]*cm1[7] + cm2[7]*cm1[12] + cm2[8]*cm1[17];
    cm12[ 8 ] = cm2[5]*cm1[3] + cm2[6]*cm1[8] + cm2[7]*cm1[13] + cm2[8]*cm1[18];
    cm12[ 9 ] = cm2[5]*cm1[4] + cm2[6]*cm1[9] + cm2[7]*cm1[14] + cm2[8]*cm1[19] + cm2[9];

    // i=10
    cm12[ 10 ] = cm2[10]*cm1[0] + cm2[11]*cm1[5] + cm2[12]*cm1[10] + cm2[13]*cm1[15];
    cm12[ 11 ] = cm2[10]*cm1[1] + cm2[11]*cm1[6] + cm2[12]*cm1[11] + cm2[13]*cm1[16];
    cm12[ 12 ] = cm2[10]*cm1[2] + cm2[11]*cm1[7] + cm2[12]*cm1[12] + cm2[13]*cm1[17];
    cm12[ 13 ] = cm2[10]*cm1[3] + cm2[11]*cm1[8] + cm2[12]*cm1[13] + cm2[13]*cm1[18];
    cm12[ 14 ] = cm2[10]*cm1[4] + cm2[11]*cm1[9] + cm2[12]*cm1[14] + cm2[13]*cm1[19] + cm2[14];

    // i=15
    cm12[ 15 ] = cm2[15]*cm1[0] + cm2[16]*cm1[5] + cm2[17]*cm1[10] + cm2[18]*cm1[15];
    cm12[ 16 ] = cm2[15]*cm1[1] + cm2[16]*cm1[6] + cm2[17]*cm1[11] + cm2[18]*cm1[16];
    cm12[ 17 ] = cm2[15]*cm1[2] + cm2[16]*cm1[7] + cm2[17]*cm1[12] + cm2[18]*cm1[17];
    cm12[ 18 ] = cm2[15]*cm1[3] + cm2[16]*cm1[8] + cm2[17]*cm1[13] + cm2[18]*cm1[18];
    cm12[ 19 ] = cm2[15]*cm1[4] + cm2[16]*cm1[9] + cm2[17]*cm1[14] + cm2[18]*cm1[19] + cm2[19];

    return cm12;
}
function cm_rechannel( m, Ri, Gi, Bi, Ai, Ro, Go, Bo, Ao )
{
    var cm = new ColorMatrix(20);
    cm[Ro*5+Ri] = m[0 ]; cm[Ro*5+Gi] = m[1 ]; cm[Ro*5+Bi] = m[2 ]; cm[Ro*5+Ai] = m[3 ]; cm[Ro*5+4] = m[4 ];
    cm[Go*5+Ri] = m[5 ]; cm[Go*5+Gi] = m[6 ]; cm[Go*5+Bi] = m[7 ]; cm[Go*5+Ai] = m[8 ]; cm[Go*5+4] = m[9 ];
    cm[Bo*5+Ri] = m[10]; cm[Bo*5+Gi] = m[11]; cm[Bo*5+Bi] = m[12]; cm[Bo*5+Ai] = m[13]; cm[Bo*5+4] = m[14];
    cm[Ao*5+Ri] = m[15]; cm[Ao*5+Gi] = m[16]; cm[Ao*5+Bi] = m[17]; cm[Ao*5+Ai] = m[18]; cm[Ao*5+4] = m[19];
    return cm;
}

function tensor_product( m1, m2, matrix )
{
    matrix = matrix || Array/*ConvolutionMatrix*/;
    if ( m2 === +m2 ) m2 = [m2];
    var i, j, p, s, d1 = m1.length, d2 = m2.length, m12 = new matrix(d1*d2);
    for (s=0,i=0,j=0; i<d1; j++)
    {
        if ( j >= d2 ){ j=0; i++; }
        p = m1[i]*m2[j];
        m12[i*d2+j] = p;
        s += p;
    }
    return {kernel:m12, sum:s};
}

function lerp( data, index, c1, c2, t )
{
    data[index  ] = (~~(c1[0] + t*(c2[0]-c1[0]))) & 255;
    data[index+1] = (~~(c1[1] + t*(c2[1]-c1[1]))) & 255;
    data[index+2] = (~~(c1[2] + t*(c2[2]-c1[2]))) & 255;
    data[index+3] = (~~(c1[3] + t*(c2[3]-c1[3]))) & 255;
}

function colors_stops( colors, stops )
{
    stops = stops ? stops.slice() : stops;
    colors = colors ? colors.slice() : colors;
    var cl = colors.length, i;
    if ( !stops )
    {
        if ( 1 === cl )
        {
            stops = [1.0];
        }
        else
        {
            stops = new Array(cl);
            for(i=0; i<cl; i++) stops[i] = i+1 === cl ? 1.0 : i/(cl-1);
        }
    }
    else if ( stops.length < cl )
    {
        var cstoplen = stops.length, cstop = stops[cstoplen-1];
        for(i=cstoplen; i<cl; i++) stops.push( i+1 === cl ? 1.0 : cstop+(i-cstoplen+1)/(cl-1) );
    }
    if ( 1.0 != stops[stops.length-1] )
    {
        stops.push( 1.0 );
        colors.push( colors[colors.length-1] );
    }
    return [colors, stops];
}

function gradient( g, w, h, colors, stops, angle, interpolate )
{
    var i, x, y, size = g.length, t, px, py, stop1, stop2, sin, cos, r;
    //interpolate = interpolate || lerp;
    angle = angle || 0.0;
    if ( 0 > angle ) angle += pi2;
    if ( pi2 < angle ) angle -= pi2;
    sin = Abs(Sin(angle)); cos = Abs(Cos(angle));
    r = cos*w + sin*h;
    if ( (pi_2 < angle) && (angle <= pi) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = w-1-x; py = y;
            t = Min(1.0, (cos*px + sin*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    else if ( (pi < angle) && (angle <= pi_32) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = w-1-x; py = h-1-y;
            t = Min(1.0, (cos*px + sin*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    else if ( (pi_32 < angle) && (angle < pi2) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = x; py = h-1-y;
            t = Min(1.0, (cos*px + sin*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    else //if ( (0 <= angle) && (angle <= pi_2) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = x; py = y;
            t = Min(1.0, (cos*px + sin*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    return g;
}

function radial_gradient( g, w, h, colors, stops, centerX, centerY, radiusX, radiusY, interpolate )
{
    var i, x, y, size = g.length, t, px, py, stop1, stop2;
    //interpolate = interpolate || lerp;
    centerX = centerX || 0; centerY = centerY || 0;
    radiusX = radiusX || 1.0; radiusY = radiusY || 1.0;
    //relative radii to generate elliptical gradient instead of circular (rX=rY=1)
    if ( radiusY > radiusX )
    {
        radiusX = radiusX/radiusY;
        radiusY = 1.0;
    }
    else if ( radiusX > radiusY )
    {
        radiusY = radiusY/radiusX;
        radiusX = 1.0;
    }
    else
    {
        radiusY = 1.0;
        radiusX = 1.0;
    }
    for(x=0,y=0,i=0; i<size; i+=4,x++)
    {
        if ( x >= w ) { x=0; y++; }
        px = radiusX*(x-centerX)/(w-centerX); py = radiusY*(y-centerY)/(h-centerY);
        t = Min(1.0, Sqrt(px*px + py*py));
        stop2 = 0; while ( t > stops[stop2] ) ++stop2;
        stop1 = 0 === stop2 ? 0 : stop2-1;
        interpolate(
            g, i,
            colors[stop1], colors[stop2],
            // warp the value if needed, between stop ranges
            stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
        );
    }
    return g;
}

function esc( s )
{
    return s.replace(esc_re, '\\$1');
}

MathUtil.clamp = clamp;
MathUtil.closest_power2 = closest_power_of_two;
MathUtil.tensor_product = tensor_product;
MathUtil.Geometry = {
     Point2: point2
    ,Point3: point3
    ,enorm2: enorm2
    ,cross2: cross2
    ,normal2: normal2
    ,interpolate2: interpolate2
    ,interpolate3: interpolate3
};

StringUtil.esc = esc;
StringUtil.trim = String.prototype.trim 
? function( s ){ return s.trim(); }
: function( s ){ return s.replace(trim_re, ''); };

ImageUtil.crop = FILTER.Interpolation.crop = crop;
ImageUtil.pad = FILTER.Interpolation.pad = pad;
ImageUtil.get_data = get_data;
ImageUtil.set_data = set_data;
ImageUtil.fill = fill_data;
ImageUtil.integral = integral;
ImageUtil.histogram = histogram;
ImageUtil.spectrum = spectrum;
ImageUtil.gradient = gradient;
ImageUtil.radial_gradient = radial_gradient;
ImageUtil.lerp = lerp;
ImageUtil.colors_stops = colors_stops;

FilterUtil.ct_eye = ct_eye;
FilterUtil.ct_multiply = ct_multiply;
FilterUtil.cm_eye = cm_eye;
FilterUtil.cm_multiply = cm_multiply;
//FilterUtil.cm_apply = cm_apply;
FilterUtil.cm_rechannel = cm_rechannel;
FilterUtil.integral_convolution = integral_convolution_rgb;
FilterUtil.separable_convolution = separable_convolution;
FilterUtil.generic_transform = generic_transform;
FilterUtil.affine_transform = affine_transform;
FilterUtil.cyclic_shift = cyclic_shift;
FilterUtil.flip_x = flip_x;
FilterUtil.flip_y = flip_y;
FilterUtil.flip_xy = flip_xy;

}(FILTER);