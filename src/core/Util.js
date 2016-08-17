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
    A32I = FILTER.Array32I, A16I = FILTER.Array16I, A8U = FILTER.Array8U,
    ColorTable = FILTER.ColorTable, ColorMatrix = FILTER.ColorMatrix,
    AffineMatrix = FILTER.AffineMatrix, ConvolutionMatrix = FILTER.ConvolutionMatrix,
    MathUtil = FILTER.Util.Math, StringUtil = FILTER.Util.String, ArrayUtil = FILTER.Util.Array,
    ImageUtil = FILTER.Util.Image, FilterUtil = FILTER.Util.Filter,
    Exp = Math.exp, Sqrt = Math.sqrt, Pow = Math.pow, Ceil = Math.ceil, Floor = Math.floor,
    Log = Math.log, Sin = Math.sin, Cos = Math.cos,
    Min = Math.min, Max = Math.max, Abs = Math.abs,
    PI = Math.PI, PI2 = PI+PI, PI_2 = 0.5*PI, 
    pi = PI, pi2 = PI2, pi_2 = PI_2, pi_32 = 3*pi_2,
    Log2 = Math.log2 || function( x ) { return Log(x) / Math.LN2; },
    MODE = FILTER.MODE, notSupportClamp = FILTER._notSupportClamp, noTypedArraySet = FILTER._noTypedArraySet,
    esc_re = /([.*+?^${}()|\[\]\/\\\-])/g, trim_re = /^\s+|\s+$/g,
    func_body_re = /^function[^{]+{([\s\S]*)}$/;

function esc( s )
{
    return s.replace(esc_re, '\\$1');
}
function function_body( func )
{
    return func.toString( ).match( func_body_re )[ 1 ] || '';
}

function arrayset( a, b, offset )
{
    offset = offset || 0;
    var j, i, n = b.length, rem = n&31;
    for(j=0; j<n; j+=32)
    {
        i = j;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
        a[ i + offset ] = b[ i ]; ++i;
    }
    if ( rem )
    {
        for(i=n-rem; i<n; i++) a[ i + offset ] = b[ i  ];
    }
}

function clamp( x, m, M )
{ 
    return x > M ? M : (x < m ? m : x); 
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
        cropped.set(im.subarray(pixel2, pixel2+nw4), pixel);
    }
    return cropped;
}
function crop_shim( im, w, h, x1, y1, x2, y2 )
{
    x2 = Min(x2, w-1); y2 = Min(y2, h-1);
    var nw = x2-x1+1, nh = y2-y1+1, 
        croppedSize = (nw*nh)<<2, cropped = new IMG(croppedSize), 
        y, yw, nw4 = nw<<2, pixel, pixel2;

    for (y=y1,yw=y1*w,pixel=0; y<=y2; y++,yw+=w,pixel+=nw4)
    {
        pixel2 = (yw+x1)<<2;
        arrayset(cropped, im.slice(pixel2, pixel2+nw4), pixel);
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
        padded.set(im.subarray(pixel2, pixel2+w4), offleft+pixel);
    }
    return padded;
}
function pad_shim( im, w, h, pad_right, pad_bot, pad_left, pad_top )
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
        arrayset(padded, im.slice(pixel2, pixel2+w4), offleft+pixel);
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

// compute integral image (Summed Area Table, SAT) (for a given channel)
function integral( im, w, h, channel, integ ) 
{
        channel = channel || 0;
    var len = im.length, size = len>>>2, rowLen = w<<2,
        rem = (w&31)<<2, integ = new A32F(size), sum, i, j, x;
        
    // compute integral of image in one pass
    // first row
    for (j=0,sum=0,i=channel; i<rowlen; i+=128)
    {
        sum += im[i    ]; integ[j++] = sum;
        sum += im[i+4  ]; integ[j++] = sum;
        sum += im[i+8  ]; integ[j++] = sum;
        sum += im[i+12 ]; integ[j++] = sum;
        sum += im[i+16 ]; integ[j++] = sum;
        sum += im[i+20 ]; integ[j++] = sum;
        sum += im[i+24 ]; integ[j++] = sum;
        sum += im[i+28 ]; integ[j++] = sum;
        sum += im[i+32 ]; integ[j++] = sum;
        sum += im[i+36 ]; integ[j++] = sum;
        sum += im[i+40 ]; integ[j++] = sum;
        sum += im[i+44 ]; integ[j++] = sum;
        sum += im[i+48 ]; integ[j++] = sum;
        sum += im[i+52 ]; integ[j++] = sum;
        sum += im[i+56 ]; integ[j++] = sum;
        sum += im[i+60 ]; integ[j++] = sum;
        sum += im[i+64 ]; integ[j++] = sum;
        sum += im[i+68 ]; integ[j++] = sum;
        sum += im[i+72 ]; integ[j++] = sum;
        sum += im[i+76 ]; integ[j++] = sum;
        sum += im[i+80 ]; integ[j++] = sum;
        sum += im[i+84 ]; integ[j++] = sum;
        sum += im[i+88 ]; integ[j++] = sum;
        sum += im[i+92 ]; integ[j++] = sum;
        sum += im[i+96 ]; integ[j++] = sum;
        sum += im[i+100]; integ[j++] = sum;
        sum += im[i+104]; integ[j++] = sum;
        sum += im[i+108]; integ[j++] = sum;
        sum += im[i+112]; integ[j++] = sum;
        sum += im[i+116]; integ[j++] = sum;
        sum += im[i+120]; integ[j++] = sum;
        sum += im[i+124]; integ[j++] = sum;
    }
    if ( rem )
    {
        for (i=rowlen-rem+channel; i<rowlen; i+=4,j++)
        {
            sum += im[i]; integ[j] = sum;
        }
    }
    // other rows
    for (x=0,j=0,sum=0,i=rowLen+channel; i<len; i+=128)
    {
        sum += im[i    ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+4  ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+8  ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+12 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+16 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+20 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+24 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+28 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+32 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+36 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+40 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+44 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+48 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+52 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+56 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+60 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+64 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+68 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+72 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+76 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+80 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+84 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+88 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+92 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+96 ]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+100]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+104]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+108]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+112]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+116]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+120]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
        sum += im[i+124]; integ[j+w] = integ[j] + sum; ++j;
        if ( ++x >=w ) { x=0; sum=0; }
    }
    if ( rem )
    {
        for (i=len-rem+channel; i<len; i+=4,x++,j++)
        {
            if ( x >=w ) { x=0; sum=0; }
            sum += im[i]; integ[j+w] = integ[j] + sum; 
        }
    }
    return integ;
}
// compute image histogram (for a given channel)
function histogram( im, w, h, channel, pdf, cdf )
{
    channel = channel || 0;
    var i, l = im.length, l2 = l>>>2, cdf, accum, rem = (l2&31)<<2;
    
    // initialize the arrays
    cdf = cdf || new A32F( 256 ); 
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
    // compute pdf
    for (i=channel; i<l; i+=128)
    {
        // partial loop unrolling
        cdf[ im[i    ] ]++;
        cdf[ im[i+4  ] ]++;
        cdf[ im[i+8  ] ]++;
        cdf[ im[i+12 ] ]++;
        cdf[ im[i+16 ] ]++;
        cdf[ im[i+20 ] ]++;
        cdf[ im[i+24 ] ]++;
        cdf[ im[i+28 ] ]++;
        cdf[ im[i+32 ] ]++;
        cdf[ im[i+36 ] ]++;
        cdf[ im[i+40 ] ]++;
        cdf[ im[i+44 ] ]++;
        cdf[ im[i+48 ] ]++;
        cdf[ im[i+52 ] ]++;
        cdf[ im[i+56 ] ]++;
        cdf[ im[i+60 ] ]++;
        cdf[ im[i+64 ] ]++;
        cdf[ im[i+68 ] ]++;
        cdf[ im[i+72 ] ]++;
        cdf[ im[i+76 ] ]++;
        cdf[ im[i+80 ] ]++;
        cdf[ im[i+84 ] ]++;
        cdf[ im[i+88 ] ]++;
        cdf[ im[i+92 ] ]++;
        cdf[ im[i+96 ] ]++;
        cdf[ im[i+100] ]++;
        cdf[ im[i+104] ]++;
        cdf[ im[i+108] ]++;
        cdf[ im[i+112] ]++;
        cdf[ im[i+116] ]++;
        cdf[ im[i+120] ]++;
        cdf[ im[i+124] ]++;
    }
    if ( rem )
    {
        for (i=l-rem+channel; i<l; i+=4) cdf[ im[ i ] ]++;
    }
    // return pdf NOT cdf
    if ( true === pdf )
    {
        /*for (i=0; i<256; i+=64) 
        { 
            // partial loop unrolling
            cdf[i   ] /= l2;
            cdf[i+1 ] /= l2;
            cdf[i+2 ] /= l2;
            cdf[i+3 ] /= l2;
            cdf[i+4 ] /= l2;
            cdf[i+5 ] /= l2;
            cdf[i+6 ] /= l2;
            cdf[i+7 ] /= l2;
            cdf[i+8 ] /= l2;
            cdf[i+9 ] /= l2;
            cdf[i+10] /= l2;
            cdf[i+11] /= l2;
            cdf[i+12] /= l2;
            cdf[i+13] /= l2;
            cdf[i+14] /= l2;
            cdf[i+15] /= l2;
            cdf[i+16] /= l2;
            cdf[i+17] /= l2;
            cdf[i+18] /= l2;
            cdf[i+19] /= l2;
            cdf[i+20] /= l2;
            cdf[i+21] /= l2;
            cdf[i+22] /= l2;
            cdf[i+23] /= l2;
            cdf[i+24] /= l2;
            cdf[i+25] /= l2;
            cdf[i+26] /= l2;
            cdf[i+27] /= l2;
            cdf[i+28] /= l2;
            cdf[i+29] /= l2;
            cdf[i+30] /= l2;
            cdf[i+31] /= l2;
            cdf[i+32] /= l2;
            cdf[i+33] /= l2;
            cdf[i+34] /= l2;
            cdf[i+35] /= l2;
            cdf[i+36] /= l2;
            cdf[i+37] /= l2;
            cdf[i+38] /= l2;
            cdf[i+39] /= l2;
            cdf[i+40] /= l2;
            cdf[i+41] /= l2;
            cdf[i+42] /= l2;
            cdf[i+43] /= l2;
            cdf[i+44] /= l2;
            cdf[i+45] /= l2;
            cdf[i+46] /= l2;
            cdf[i+47] /= l2;
            cdf[i+48] /= l2;
            cdf[i+49] /= l2;
            cdf[i+50] /= l2;
            cdf[i+51] /= l2;
            cdf[i+52] /= l2;
            cdf[i+53] /= l2;
            cdf[i+54] /= l2;
            cdf[i+55] /= l2;
            cdf[i+56] /= l2;
            cdf[i+57] /= l2;
            cdf[i+58] /= l2;
            cdf[i+59] /= l2;
            cdf[i+60] /= l2;
            cdf[i+61] /= l2;
            cdf[i+62] /= l2;
            cdf[i+63] /= l2;
        }*/
        return cdf;
    }
    
    // compute cdf
    for (accum=0,i=0; i<256; i+=64) 
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
        accum += cdf[i+32]; cdf[i+32] = accum;
        accum += cdf[i+33]; cdf[i+33] = accum;
        accum += cdf[i+34]; cdf[i+34] = accum;
        accum += cdf[i+35]; cdf[i+35] = accum;
        accum += cdf[i+36]; cdf[i+36] = accum;
        accum += cdf[i+37]; cdf[i+37] = accum;
        accum += cdf[i+38]; cdf[i+38] = accum;
        accum += cdf[i+39]; cdf[i+39] = accum;
        accum += cdf[i+40]; cdf[i+40] = accum;
        accum += cdf[i+41]; cdf[i+41] = accum;
        accum += cdf[i+42]; cdf[i+42] = accum;
        accum += cdf[i+43]; cdf[i+43] = accum;
        accum += cdf[i+44]; cdf[i+44] = accum;
        accum += cdf[i+45]; cdf[i+45] = accum;
        accum += cdf[i+46]; cdf[i+46] = accum;
        accum += cdf[i+47]; cdf[i+47] = accum;
        accum += cdf[i+48]; cdf[i+48] = accum;
        accum += cdf[i+49]; cdf[i+49] = accum;
        accum += cdf[i+50]; cdf[i+50] = accum;
        accum += cdf[i+51]; cdf[i+51] = accum;
        accum += cdf[i+52]; cdf[i+52] = accum;
        accum += cdf[i+53]; cdf[i+53] = accum;
        accum += cdf[i+54]; cdf[i+54] = accum;
        accum += cdf[i+55]; cdf[i+55] = accum;
        accum += cdf[i+56]; cdf[i+56] = accum;
        accum += cdf[i+57]; cdf[i+57] = accum;
        accum += cdf[i+58]; cdf[i+58] = accum;
        accum += cdf[i+59]; cdf[i+59] = accum;
        accum += cdf[i+60]; cdf[i+60] = accum;
        accum += cdf[i+61]; cdf[i+61] = accum;
        accum += cdf[i+62]; cdf[i+62] = accum;
        accum += cdf[i+63]; cdf[i+63] = accum;
    }
    return cdf;
}
function spectrum( im, w, h, channel ) 
{
    // TODO
    return null;
}

function integral2( im, w, h, sat, sat2, rsat ) 
{
    var len = im.length, size = len>>>2, rowLen = w<<2,
        rem = (w&31)<<2, sum, sum2, c, i, j, x, y;
        
    // compute sat(integral), sat2(square) and rsat(tilted integral) of image in one pass
    // first row
    for (j=0,i=0,sum=sum2=0; i<rowLen; i+=128)
    {
        // SAT(-1, y) = SAT(x, -1) = SAT(-1, -1) = 0
        // SAT(x, y) = SAT(x, y-1) + SAT(x-1, y) + I(x, y) - SAT(x-1, y-1)  <-- integral image
        
        // RSAT(-1, y) = RSAT(x, -1) = RSAT(x, -2) = RSAT(-1, -1) = RSAT(-1, -2) = 0
        // RSAT(x, y) = RSAT(x-1, y-1) + RSAT(x+1, y-1) - RSAT(x, y-2) + I(x, y) + I(x, y-1)    <-- rotated(tilted) integral image at 45deg
        c=im[i    ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+4  ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+8  ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+12 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+16 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+20 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+24 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+28 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+32 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+36 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+40 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+44 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+48 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+52 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+56 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+60 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+64 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+68 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+72 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+76 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+80 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+84 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+88 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+92 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+96 ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+100]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+104]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+108]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+112]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+116]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+120]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        c=im[i+124]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
    }
    if ( rem )
    {
        for (i=rowLen-rem; i<rowLen; i+=4,j++)
        {
            c=im[i    ]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2;
        }
    }
    // other rows
    for (x=0,y=1,j=0,sum=0,sum2=0,i=rowLen; i<len; i+=128)
    {
        // SAT(-1, y) = SAT(x, -1) = SAT(-1, -1) = 0
        // SAT(x, y) = SAT(x, y-1) + SAT(x-1, y) + I(x, y) - SAT(x-1, y-1)  <-- integral image
        
        // RSAT(-1, y) = RSAT(x, -1) = RSAT(x, -2) = RSAT(-1, -1) = RSAT(-1, -2) = 0
        // RSAT(x, y) = RSAT(x-1, y-1) + RSAT(x+1, y-1) - RSAT(x, y-2) + I(x, y) + I(x, y-1)    <-- rotated(tilted) integral image at 45deg
        c=im[i    ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+4  ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+8  ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+12 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+16 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+20 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+24 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+28 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+32 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+36 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+40 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+44 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+48 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+52 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+56 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+60 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+64 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+68 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+72 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+76 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+80 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+84 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+88 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+92 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+96 ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+100]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+104]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+108]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+112]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+116]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+120]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
        c=im[i+124]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if ( ++x >=w ) { x=0; y++; sum=sum2=0; }
    }
    if ( rem )
    {
        for (i=len-rem; i<len; i+=4,x++,j++)
        {
            if ( x >=w ) { x=0; y++; sum=sum2=0; }
            c=im[i    ]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<2]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0);
        }
    }
}
function gradient( im, w, h, grad, grad2, summed )
{
    var i, j, k, sum, sum2, grad_x, grad_y,
        ind0, ind1, ind2, ind_1, ind_2,
        count = grad.length, lowpass,
        w_1 = w-1, h_1 = h-1, w_2 = w-2, h_2 = h-2, w2 = w<<1, w4 = w<<2;
    
    // first, second rows, last, second-to-last rows
    /*for (i=0; i<w; i++)
    {
        lowpass[i] = 0; lowpass[i+w] = 0;
        lowpass[i+count-w] = 0; lowpass[i+count-w2] = 0;
        grad[i] = 0; grad[i+count-w] = 0;
    }
    // first, second columns, last, second-to-last columns
    for (i=0,k=0; i<h; i++,k+=w)
    {
        lowpass[k] = 0; lowpass[1+k] = 0;
        lowpass[w_1+k] = 0; lowpass[w_2+k] = 0;
        grad[k] = 0; grad[w_1+k]=0;
    }*/
    
    // gauss lowpass
    lowpass = new A8U(count);
    for (i=2,j=2,k=w2; i<w_2; j++,k+=w)
    {
        if ( j >= h_2 ){ j=2; k=w2; i++; }
        ind0 = (i+k)<<2; ind1 = ind0+w4; ind2 = ind1+w4; 
        ind_1 = ind0-w4; ind_2 = ind_1-w4; 
        
        // use as simple fixed-point arithmetic as possible (only addition/subtraction and binary shifts)
        sum =(    (im[ind_2-8] << 1) + (im[ind_1-8] << 2) + (im[ind0-8] << 2) + (im[ind0-8])
                + (im[ind1-8] << 2) + (im[ind2-8] << 1) + (im[ind_2-4] << 2) + (im[ind_1-4] << 3)
                + (im[ind_1-4]) + (im[ind0-4] << 4) - (im[ind0-4] << 2) + (im[ind1-4] << 3)
                + (im[ind1-4]) + (im[ind2-4] << 2) + (im[ind_2] << 2) + (im[ind_2]) + (im[ind_1] << 4)
                - (im[ind_1] << 2) + (im[ind0] << 4) - (im[ind0]) + (im[ind1] << 4) - (im[ind1] << 2)
                + (im[ind2] << 2) + (im[ind2]) + (im[ind_2+4] << 2) + (im[ind_1+4] << 3) + (im[ind_1+4])
                + (im[ind0+4] << 4) - (im[ind0+4] << 2) + (im[ind1+4] << 3) + (im[ind1+4]) + (im[ind2+4] << 2)
                + (im[ind_2+8] << 1) + (im[ind_1+8] << 2) + (im[ind0+8] << 2) + (im[ind0+8])
                + (im[ind1+8] << 2) + (im[ind2+8] << 1) );
        
        lowpass[ind0] = ((((103*sum + 8192)&0xFFFFFFFF) >>> 14)&0xFF)|0;
        
    }
    // sobel gradient
    if ( grad2 )
    {
        for (i=1,j=1,k=w; i<w_1; j++,k+=w)
        {
            if ( j >= h_1 ){ j=1; k=w; i++; }
            // compute coords using simple add/subtract arithmetic (faster)
            ind0 = k+i; ind1 = ind0+w; ind_1 = ind0-w; 
            
            grad[ind0] = (
                      lowpass[ind_1+1] 
                    - lowpass[ind_1-1] 
                    - lowpass[ind0-1] - lowpass[ind0-1]
                    + lowpass[ind0+1] + lowpass[ind0+1]
                    - lowpass[ind1-1] 
                    + lowpass[ind1+1]
                    );
            grad2[ind0] = (
                      lowpass[ind_1-1] 
                    + lowpass[ind_1] + lowpass[ind_1]
                    + lowpass[ind_1+1] 
                    - lowpass[ind1-1] 
                    - lowpass[ind1] - lowpass[ind1]
                    - lowpass[ind1+1]
                    );
        }
        
        // integral gradient
        if ( summed )
        {
            // first row
            for(i=0,sum=sum2=0; i<w; i++) { sum += grad[i]; sum2 += grad2[i]; grad[i] = sum; grad2[i] = sum2; }
            // other rows
            for(i=w,k=0,sum=sum2=0; i<count; i++,k++)
            {
                if (k>=w) { k=0; sum=sum2=0; }
                sum += grad[i]; grad[i] = grad[i-w] + sum;
                sum2 += grad2[i]; grad2[i] = grad2[i-w] + sum2;
            }
        }
    }
    else
    {
        for (i=1,j=1,k=w; i<w_1; j++,k+=w)
        {
            if ( j >= h_1 ){ j=1; k=w; i++; }
            // compute coords using simple add/subtract arithmetic (faster)
            ind0 = k+i; ind1 = ind0+w; ind_1 = ind0-w; 
            
            grad_x = (
                      lowpass[ind_1+1] 
                    - lowpass[ind_1-1] 
                    - lowpass[ind0-1] - lowpass[ind0-1]
                    + lowpass[ind0+1] + lowpass[ind0+1]
                    - lowpass[ind1-1] 
                    + lowpass[ind1+1]
                    );
            grad_y = (
                      lowpass[ind_1-1] 
                    + lowpass[ind_1] + lowpass[ind_1]
                    + lowpass[ind_1+1] 
                    - lowpass[ind1-1] 
                    - lowpass[ind1] - lowpass[ind1]
                    - lowpass[ind1+1]
                    );
            
            grad[ind0] = Abs(grad_x) + Abs(grad_y);
        }
        
        // integral gradient
        if ( summed )
        {
            // first row
            for(i=0,sum=0; i<w; i++) { sum += grad[i]; grad[i] = sum; }
            // other rows
            for(i=w,k=0,sum=0; i<count; i++,k++)
            {
                if (k>=w) { k=0; sum=0; }
                sum += grad[i]; grad[i] = grad[i-w] + sum;
            }
        }
    }
}
function follow_edge( im, w, h, magnitude, x1, y1, i1, thresh )
{
    var x0 = x1 === 0 ? x1 : x1 - 1,
        x2 = x1 === w - 1 ? x1 : x1 + 1,
        y0 = y1 === 0 ? y1 : y1 - 1,
        y2 = y1 === h -1 ? y1 : y1 + 1,
        x, y, y0w = y0*w, yw, i, j;

    // threshold here
    im[i1] = im[i1+1] = im[i1+2] = 255;
    
    x = x0, y = y0; yw = y0w;
    while (x <= x2 && y <= y2)
    {
        j = x + yw; i = j << 2;
        if ( (y !== y1 || x !== x1) && (0 === im[i]) && (magnitude[j] >= thresh) ) 
        {
            follow_edge( im, w, h, magnitude, x, y, i, thresh );
            return;
        }
        y++; yw+=w; if ( y>y2 ){y=y0; yw=y0w; x++;}
    }
}
// adapted from Java: http://www.tomgibara.com/computer-vision/canny-edge-detector
function canny_gradient( im, w, h, kernelRadius, kernelWidth, low, high,
                        GAUSSIAN_CUT_OFF, MAGNITUDE_SCALE, MAGNITUDE_LIMIT, MAGNITUDE_MAX ) 
{
    //generate the gaussian convolution masks
    var //kernelRadius = 2, kernelWidth = 14,
        size = im.length, picsize = size>>>2,
        magnitude = new A32I(picsize),
        xConv = new A32F(picsize),
        yConv = new A32F(picsize),
        xGradient = new A32F(picsize),
        yGradient = new A32F(picsize),
        kernel = new A32F(kernelWidth),
        diffKernel = new A32F(kernelWidth),
        sigma2 = kernelRadius*kernelRadius, sigma22 = 2 * sigma2,
        factor = PI2 * sigma2, kwidth, g1, g2, g3, x, y;
    
    for (kwidth = 0; kwidth < kernelWidth; kwidth++) 
    {
        g1 = Exp(-(kwidth * kwidth) / sigma22); // gaussian
        if ( g1 <= GAUSSIAN_CUT_OFF && kwidth >= 2 ) break;
        g2 = Exp(-((x=kwidth - 0.5) * x) / sigma22); // gaussian
        g3 = Exp(-((x=kwidth + 0.5) * x) / sigma22); // gaussian
        kernel[kwidth] = (g1 + g2 + g3) / 3 / factor;
        diffKernel[kwidth] = g3 - g2;
    }

    var initX = kwidth - 1, maxX = w - initX, initY = w * (kwidth - 1), maxY = picsize - initY,
        index, sumX, sumY, xOffset, yOffset, i, j;
    
    //perform convolution in x and y directions
    for (x=initX,y=initY; x<maxX; y+=w) 
    {
        if ( y >= maxY) { y=initY; x++; }
        index = x + y;
        sumX = im[index<<2] * kernel[0];
        sumY = sumX;
        xOffset = 1;
        yOffset = w;
        for(; xOffset < kwidth ;) 
        {
            sumY += kernel[xOffset] * (im[(index - yOffset)<<2] + im[(index + yOffset)<<2]);
            sumX += kernel[xOffset] * (im[(index - xOffset)<<2] + im[(index + xOffset)<<2]);
            yOffset += w; xOffset++;
        }
        yConv[index] = sumY;
        xConv[index] = sumX;
    }

    //perform sobel gradient in x and y directions
    for (x=initX,y=initY; x<maxX; y+=w) 
    {
        if ( y >= maxY) { y=initY; x++; }
        index = x + y; yOffset = w;
        for (sumX=sumY=0,i = 1; i < kwidth; i++)
        {
            sumX += diffKernel[i] * (yConv[index - i] - yConv[index + i]);
            sumY += diffKernel[i] * (xConv[index - yOffset] - xConv[index + yOffset]);
            yOffset += w;
        }
        xGradient[index] = sumX;
        yGradient[index] = sumY;
    }
    
    var indexN, indexS, indexE, indexW,
        indexNW, indexNE, indexSW, indexSE,
        xGrad, yGrad, gradMag, tmp, nMag, sMag, eMag, wMag,
        nwMag, neMag, swMag, seMag, absxGrad, absyGrad;
    
    //perform non-maximal supression
    initX = kwidth; maxX = w - initX; initY = w * kwidth; maxY = picsize - initY;
    for (x=initX,y=initY; x<maxX; y+=w) 
    {
        if ( y >= maxY ) {y=initY; x++; }
        
        index = x + y;
        indexN = index - w;
        indexS = index + w;
        indexW = index - 1;
        indexE = index + 1;
        indexNW = indexN - 1;
        indexNE = indexN + 1;
        indexSW = indexS - 1;
        indexSE = indexS + 1;
        
        xGrad = xGradient[index];
        yGrad = yGradient[index];
        absxGrad = Abs(xGrad);
        absyGrad = Abs(yGrad);
        gradMag = absxGrad+absyGrad;
        /*
         * An explanation of what's happening here, for those who want
         * to understand the source: This performs the "non-maximal
         * supression" phase of the Canny edge detection in which we
         * need to compare the gradient magnitude to that in the
         * direction of the gradient; only if the value is a local
         * maximum do we consider the point as an edge candidate.
         * 
         * We need to break the comparison into a number of different
         * cases depending on the gradient direction so that the
         * appropriate values can be used. To avoid computing the
         * gradient direction, we use two simple comparisons: first we
         * check that the partial derivatives have the same sign (1)
         * and then we check which is larger (2). As a consequence, we
         * have reduced the problem to one of four identical cases that
         * each test the central gradient magnitude against the values at
         * two points with 'identical support'; what this means is that
         * the geometry required to accurately interpolate the magnitude
         * of gradient function at those points has an identical
         * geometry (upto right-angled-rotation/reflection).
         * 
         * When comparing the central gradient to the two interpolated
         * values, we avoid performing any divisions by multiplying both
         * sides of each inequality by the greater of the two partial
         * derivatives. The common comparand is stored in a temporary
         * variable (3) and reused in the mirror case (4).
         * 
         */
        nMag = Abs(xGradient[indexN])+Abs(yGradient[indexN]);
        sMag = Abs(xGradient[indexS])+Abs(yGradient[indexS]);
        wMag = Abs(xGradient[indexW])+Abs(yGradient[indexW]);
        eMag = Abs(xGradient[indexE])+Abs(yGradient[indexE]);
        neMag = Abs(xGradient[indexNE])+Abs(yGradient[indexNE]);
        seMag = Abs(xGradient[indexSE])+Abs(yGradient[indexSE]);
        swMag = Abs(xGradient[indexSW])+Abs(yGradient[indexSW]);
        nwMag = Abs(xGradient[indexNW])+Abs(yGradient[indexNW]);
        if (xGrad * yGrad <= 0
            ? absxGrad >= absyGrad
                ? (tmp = absxGrad * gradMag) >= Abs(yGrad * neMag - (xGrad + yGrad) * eMag)
                    && tmp > Abs(yGrad * swMag - (xGrad + yGrad) * wMag)
                : (tmp = absyGrad * gradMag) >= Abs(xGrad * neMag - (yGrad + xGrad) * nMag)
                    && tmp > Abs(xGrad * swMag - (yGrad + xGrad) * sMag)
            : absxGrad >= absyGrad
                ? (tmp = absxGrad * gradMag) >= Abs(yGrad * seMag + (xGrad - yGrad) * eMag)
                    && tmp > Abs(yGrad * nwMag + (xGrad - yGrad) * wMag)
                : (tmp = absyGrad * gradMag) >= Abs(xGrad * seMag + (yGrad - xGrad) * sMag)
                    && tmp > Abs(xGrad * nwMag + (yGrad - xGrad) * nMag)
        ) 
        {
            magnitude[index] = gradMag >= MAGNITUDE_LIMIT ? MAGNITUDE_MAX : Floor(MAGNITUDE_SCALE * gradMag);
        } 
        else 
        {
            magnitude[index] = 0;
        }
    }
    
    for (i=0; i<size; i+=4) { im[i] = im[i+1] = im[i+2] = 0; }

    //hysteresis and threshold
    for (x=0,y=0,j=0,i=0; j<picsize; j++,i=j<<2,x++) 
    {
        if ( x >= w ){ x=0; y++; }
        if ( (0 === im[i]) && (magnitude[j] >= high) )
            follow_edge( im, w, h, magnitude, x, y, i, low );
    }
    return im;
}

// speed-up convolution for special kernels like moving-average
function integral_convolution(mode, im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats) 
{
    var imLen=im.length, imArea=imLen>>>2, integral, integralLen, colR, colG, colB,
        matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2,
        r, g, b, r2, g2, b2, repeat, tmp, w4 = w<<2;
    
    // convolution speed-up based on the integral image concept and symmetric / separable kernels
    
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    matArea = matRadiusX*matRadiusY;
    matHalfSideX = matRadiusX>>>1;  matHalfSideY = w*(matRadiusY>>>1);
    // one additional offest needed due to integral computation
    matOffsetLeft = -matHalfSideX-1; matOffsetTop = -matHalfSideY-w;
    matOffsetRight = matHalfSideX; matOffsetBottom = matHalfSideY;
    bx1 = 0; bx2 = w-1; by1 = 0; by2 = imArea-w;
    
    dst = im; im = new IMG(imLen);
    numRepeats = numRepeats||1;
    
    if ( MODE.GRAY === mode )
    {
        integralLen = imArea;  rowLen = w;
        integral = new A32F(integralLen);
        
        if (matrix2) // allow to compute a second matrix in-parallel
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>>1]; centerOffset2 = wtCenter2-wt2;
            
            // do this multiple times??
            for(repeat=0; repeat<numRepeats; repeat++)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass
                
                // first row
                i=0; j=0; colR=0;
                for (x=0; x<w; x++, i+=4, j++)
                {
                    colR+=im[i]; integral[j]=colR;
                }
                // other rows
                j=0; x=0; colR=0;
                for (i=w4; i<imLen; i+=4, j++, x++)
                {
                    if (x>=w) { x=0; colR=0; }
                    colR+=im[i]; integral[j+rowLen]=integral[j]+colR; 
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
                    
                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                    r2 = wt2 * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset2 * im[i  ]);
                    
                    // output
                    t0 = coeff1*r + coeff2*r2;
                    dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                // do another pass??
            }
        }
        else
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;
        
            // do this multiple times??
            for(repeat=0; repeat<numRepeats; repeat++)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;
                
                // compute integral of image in one pass
                
                // first row
                i=0; j=0; colR=0;
                for (x=0; x<w; x++, i+=4,j++)
                {
                    colR+=im[i]; integral[j]=colR;
                }
                // other rows
                j=0; x=0; colR=0;
                for (i=w4; i<imLen; i+=4, j++, x++)
                {
                    if (x>=w) { x=0; colR=0; }
                    colR+=im[i]; integral[j+rowLen  ]=integral[j  ]+colR; 
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
                    
                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                    
                    // output
                    t0 = coeff1*r + coeff2;
                    dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                // do another pass??
            }
        }
    }
    else
    {
        integralLen = (imArea<<1)+imArea;  rowLen = (w<<1)+w;
        integral = new A32F(integralLen);
        
        if (matrix2) // allow to compute a second matrix in-parallel
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>>1]; centerOffset2 = wtCenter2-wt2;
            
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
                for (i=w4; i<imLen; i+=4, j+=3, x++)
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
                    t0 = coeff1*r + coeff2*r2; t1 = coeff1*g + coeff2*g2; t2 = coeff1*b + coeff2*b2;
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                
                // do another pass??
            }
        }
        else
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;
        
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
                for (i=w4; i<imLen; i+=4, j+=3, x++)
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
                    t0 = coeff1*r + coeff2; t1 = coeff1*g + coeff2; t2 = coeff1*b + coeff2;
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                // do another pass??
            }
        }
    }
    return dst;
}
function integral_convolution_clamp(mode, im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats) 
{
    var imLen=im.length, imArea=imLen>>>2, integral, integralLen, colR, colG, colB,
        matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2,
        r, g, b, r2, g2, b2, repeat, tmp, w4 = w<<2;
    
    // convolution speed-up based on the integral image concept and symmetric / separable kernels
    
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    matArea = matRadiusX*matRadiusY;
    matHalfSideX = matRadiusX>>>1;  matHalfSideY = w*(matRadiusY>>>1);
    // one additional offest needed due to integral computation
    matOffsetLeft = -matHalfSideX-1; matOffsetTop = -matHalfSideY-w;
    matOffsetRight = matHalfSideX; matOffsetBottom = matHalfSideY;
    bx1 = 0; bx2 = w-1; by1 = 0; by2 = imArea-w;
    
    dst = im; im = new IMG(imLen);
    numRepeats = numRepeats||1;
    
    if ( MODE.GRAY === mode )
    {
        integralLen = imArea;  rowLen = w;
        integral = new A32F(integralLen);
        
        if (matrix2) // allow to compute a second matrix in-parallel
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>>1]; centerOffset2 = wtCenter2-wt2;
            
            // do this multiple times??
            for(repeat=0; repeat<numRepeats; repeat++)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass
                
                // first row
                i=0; j=0; colR=0;
                for (x=0; x<w; x++, i+=4, j++)
                {
                    colR+=im[i]; integral[j]=colR;
                }
                // other rows
                j=0; x=0; colR=0;
                for (i=w4; i<imLen; i+=4, j++, x++)
                {
                    if (x>=w) { x=0; colR=0; }
                    colR+=im[i]; integral[j+rowLen]=integral[j]+colR; 
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
                    
                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                    r2 = wt2 * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset2 * im[i  ]);
                    
                    // output
                    t0 = coeff1*r + coeff2*r2;
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                // do another pass??
            }
        }
        else
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;
        
            // do this multiple times??
            for(repeat=0; repeat<numRepeats; repeat++)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;
                
                // compute integral of image in one pass
                
                // first row
                i=0; j=0; colR=0;
                for (x=0; x<w; x++, i+=4,j++)
                {
                    colR+=im[i]; integral[j]=colR;
                }
                // other rows
                j=0; x=0; colR=0;
                for (i=w4; i<imLen; i+=4, j++, x++)
                {
                    if (x>=w) { x=0; colR=0; }
                    colR+=im[i]; integral[j+rowLen  ]=integral[j  ]+colR; 
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
                    
                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                    
                    // output
                    t0 = coeff1*r + coeff2;
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                // do another pass??
            }
        }
    }
    else
    {
        integralLen = (imArea<<1)+imArea;  rowLen = (w<<1)+w;
        integral = new A32F(integralLen);
        
        if (matrix2) // allow to compute a second matrix in-parallel
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>>1]; centerOffset2 = wtCenter2-wt2;
            
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
                for (i=w4; i<imLen; i+=4, j+=3, x++)
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
                    t0 = coeff1*r + coeff2*r2; t1 = coeff1*g + coeff2*g2; t2 = coeff1*b + coeff2*b2;
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                
                // do another pass??
            }
        }
        else
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;
        
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
                for (i=w4; i<imLen; i+=4, j+=3, x++)
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
                    t0 = coeff1*r + coeff2; t1 = coeff1*g + coeff2; t2 = coeff1*b + coeff2;
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                
                // do another pass??
            }
        }
    }
    return dst;
}
// speed-up convolution for separable kernels
function separable_convolution(mode, im, w, h, matrix, matrix2, ind1, ind2, coeff1, coeff2) 
{
    var imLen=im.length, imArea=imLen>>>2,
        matArea, mat, indices, matArea2,
        dst, imageIndices, imageIndices1, imageIndices2,
        i, j, k, x, ty, ty2,
        xOff, yOff, bx, by, t0, t1, t2, t3, wt,
        r, g, b, a, coeff, numPasses, tmp;
    
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
    
    if ( MODE.GRAY === mode )
    {
        while (numPasses--)
        {
            tmp = im; im = dst; dst = tmp;
            matArea = mat.length;
            matArea2 = indices.length;
            
            // do direct convolution
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
                        r += im[srcOff] * wt;
                    }
                }
                
                // output
                t0 = coeff * r;
                dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            // do another pass??
            mat = matrix2;
            indices = ind2;
            coeff = coeff2;
            imageIndices = imageIndices2;
        }
    }
    else
    {
        while (numPasses--)
        {
            tmp = im; im = dst; dst = tmp;
            matArea = mat.length;
            matArea2 = indices.length;
            
            // do direct convolution
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
                dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            // do another pass??
            mat = matrix2;
            indices = ind2;
            coeff = coeff2;
            imageIndices = imageIndices2;
        }
    }
    return dst;
}
function separable_convolution_clamp(mode, im, w, h, matrix, matrix2, ind1, ind2, coeff1, coeff2) 
{
    var imLen=im.length, imArea=imLen>>>2,
        matArea, mat, indices, matArea2,
        dst, imageIndices, imageIndices1, imageIndices2,
        i, j, k, x, ty, ty2,
        xOff, yOff, bx, by, t0, t1, t2, t3, wt,
        r, g, b, a, coeff, numPasses, tmp;
    
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
    
    if ( MODE.GRAY === mode )
    {
        while (numPasses--)
        {
            tmp = im; im = dst; dst = tmp;
            matArea = mat.length;
            matArea2 = indices.length;
            
            // do direct convolution
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
                        r += im[srcOff] * wt;
                    }
                }
                
                // output
                t0 = coeff * r;
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            // do another pass??
            mat = matrix2;
            indices = ind2;
            coeff = coeff2;
            imageIndices = imageIndices2;
        }
    }
    else
    {
        while (numPasses--)
        {
            tmp = im; im = dst; dst = tmp;
            matArea = mat.length;
            matArea2 = indices.length;
            
            // do direct convolution
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
                dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            // do another pass??
            mat = matrix2;
            indices = ind2;
            coeff = coeff2;
            imageIndices = imageIndices2;
        }
    }
    return dst;
}
/*
function algebraic_combination( /*c, f1, im1, f2, im2, ..* / )
{
    var args = arguments, argslen = args.length, c = args[0],
        f = args[1], im = args[2], imLen = im.length, res = new IMG(imLen), r, g, b, a, i, k = 0;
    while ( k+2 < argslen )
    {
        f = args[++k]; im = args[++k];
        for(i=0; i<imLen; i+=4)
        {
            r = f*im[i  ] + c;
            g = f*im[i+1] + c;
            b = f*im[i+2] + c;
            a = f*im[i+3] + c;
            res[i  ] = r|0;
            res[i+1] = g|0;
            res[i+2] = b|0;
            res[i+3] = a|0;
        }
        c = 0;
    }
    return res;
}*/
function ct_eye( c1, c0 )
{
    if ( null == c0 ) c0 = 0;
    if ( null == c1 ) c1 = 1;
    var i, t = new ColorTable(256);
    for(i=0; i<256; i+=32)
    {
        t[i   ] = clamp(c0 + c1*(i   ),0,255)|0;
        t[i+1 ] = clamp(c0 + c1*(i+1 ),0,255)|0;
        t[i+2 ] = clamp(c0 + c1*(i+2 ),0,255)|0;
        t[i+3 ] = clamp(c0 + c1*(i+3 ),0,255)|0;
        t[i+4 ] = clamp(c0 + c1*(i+4 ),0,255)|0;
        t[i+5 ] = clamp(c0 + c1*(i+5 ),0,255)|0;
        t[i+6 ] = clamp(c0 + c1*(i+6 ),0,255)|0;
        t[i+7 ] = clamp(c0 + c1*(i+7 ),0,255)|0;
        t[i+8 ] = clamp(c0 + c1*(i+8 ),0,255)|0;
        t[i+9 ] = clamp(c0 + c1*(i+9 ),0,255)|0;
        t[i+10] = clamp(c0 + c1*(i+10),0,255)|0;
        t[i+11] = clamp(c0 + c1*(i+11),0,255)|0;
        t[i+12] = clamp(c0 + c1*(i+12),0,255)|0;
        t[i+13] = clamp(c0 + c1*(i+13),0,255)|0;
        t[i+14] = clamp(c0 + c1*(i+14),0,255)|0;
        t[i+15] = clamp(c0 + c1*(i+15),0,255)|0;
        t[i+16] = clamp(c0 + c1*(i+16),0,255)|0;
        t[i+17] = clamp(c0 + c1*(i+17),0,255)|0;
        t[i+18] = clamp(c0 + c1*(i+18),0,255)|0;
        t[i+19] = clamp(c0 + c1*(i+19),0,255)|0;
        t[i+20] = clamp(c0 + c1*(i+20),0,255)|0;
        t[i+21] = clamp(c0 + c1*(i+21),0,255)|0;
        t[i+22] = clamp(c0 + c1*(i+22),0,255)|0;
        t[i+23] = clamp(c0 + c1*(i+23),0,255)|0;
        t[i+24] = clamp(c0 + c1*(i+24),0,255)|0;
        t[i+25] = clamp(c0 + c1*(i+25),0,255)|0;
        t[i+26] = clamp(c0 + c1*(i+26),0,255)|0;
        t[i+27] = clamp(c0 + c1*(i+27),0,255)|0;
        t[i+28] = clamp(c0 + c1*(i+28),0,255)|0;
        t[i+29] = clamp(c0 + c1*(i+29),0,255)|0;
        t[i+30] = clamp(c0 + c1*(i+30),0,255)|0;
        t[i+31] = clamp(c0 + c1*(i+31),0,255)|0;
    }
    return t;
}
// multiply (functionaly compose) 2 Color Tables
function ct_multiply( ct2, ct1 )
{
    var i, ct12 = new ColorTable(256);
    for(i=0; i<256; i+=64)
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
        ct12[i+32] = clamp(ct2[ clamp(ct1[i+32],0,255) ],0,255); 
        ct12[i+33] = clamp(ct2[ clamp(ct1[i+33],0,255) ],0,255); 
        ct12[i+34] = clamp(ct2[ clamp(ct1[i+34],0,255) ],0,255); 
        ct12[i+35] = clamp(ct2[ clamp(ct1[i+35],0,255) ],0,255); 
        ct12[i+36] = clamp(ct2[ clamp(ct1[i+36],0,255) ],0,255); 
        ct12[i+37] = clamp(ct2[ clamp(ct1[i+37],0,255) ],0,255); 
        ct12[i+38] = clamp(ct2[ clamp(ct1[i+38],0,255) ],0,255); 
        ct12[i+39] = clamp(ct2[ clamp(ct1[i+39],0,255) ],0,255); 
        ct12[i+40] = clamp(ct2[ clamp(ct1[i+40],0,255) ],0,255); 
        ct12[i+41] = clamp(ct2[ clamp(ct1[i+41],0,255) ],0,255); 
        ct12[i+42] = clamp(ct2[ clamp(ct1[i+42],0,255) ],0,255); 
        ct12[i+43] = clamp(ct2[ clamp(ct1[i+43],0,255) ],0,255); 
        ct12[i+44] = clamp(ct2[ clamp(ct1[i+44],0,255) ],0,255); 
        ct12[i+45] = clamp(ct2[ clamp(ct1[i+45],0,255) ],0,255); 
        ct12[i+46] = clamp(ct2[ clamp(ct1[i+46],0,255) ],0,255); 
        ct12[i+47] = clamp(ct2[ clamp(ct1[i+47],0,255) ],0,255); 
        ct12[i+48] = clamp(ct2[ clamp(ct1[i+48],0,255) ],0,255); 
        ct12[i+49] = clamp(ct2[ clamp(ct1[i+49],0,255) ],0,255); 
        ct12[i+50] = clamp(ct2[ clamp(ct1[i+50],0,255) ],0,255); 
        ct12[i+51] = clamp(ct2[ clamp(ct1[i+51],0,255) ],0,255); 
        ct12[i+52] = clamp(ct2[ clamp(ct1[i+52],0,255) ],0,255); 
        ct12[i+53] = clamp(ct2[ clamp(ct1[i+53],0,255) ],0,255); 
        ct12[i+54] = clamp(ct2[ clamp(ct1[i+54],0,255) ],0,255); 
        ct12[i+55] = clamp(ct2[ clamp(ct1[i+55],0,255) ],0,255); 
        ct12[i+56] = clamp(ct2[ clamp(ct1[i+56],0,255) ],0,255); 
        ct12[i+57] = clamp(ct2[ clamp(ct1[i+57],0,255) ],0,255); 
        ct12[i+58] = clamp(ct2[ clamp(ct1[i+58],0,255) ],0,255); 
        ct12[i+59] = clamp(ct2[ clamp(ct1[i+59],0,255) ],0,255); 
        ct12[i+60] = clamp(ct2[ clamp(ct1[i+60],0,255) ],0,255); 
        ct12[i+61] = clamp(ct2[ clamp(ct1[i+61],0,255) ],0,255); 
        ct12[i+62] = clamp(ct2[ clamp(ct1[i+62],0,255) ],0,255); 
        ct12[i+63] = clamp(ct2[ clamp(ct1[i+63],0,255) ],0,255); 
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
/*
[ rr rg rb ra roff
  gr gg gb ga goff
  br bg bb ba boff
  ar ag ab aa aoff
  0  0  0  0  1 ]
*/
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
/*
[ 0xx 1xy 2xo 3xor
  4yx 5yy 6yo 7yor
  0   0   1   0
  0   0   0   1 ]
*/
function am_multiply( am1, am2 )
{
    var am12 = new AffineMatrix(8);
    am12[0] = am1[0]*am2[0] + am1[1]*am2[4];
    am12[1] = am1[0]*am2[1] + am1[1]*am2[5];
    am12[2] = am1[0]*am2[2] + am1[1]*am2[6] + am1[2];
    am12[3] = am1[0]*am2[3] + am1[1]*am2[7] + am1[3];
    
    am12[4] = am1[4]*am2[0] + am1[5]*am2[4];
    am12[5] = am1[4]*am2[1] + am1[5]*am2[5];
    am12[6] = am1[4]*am2[2] + am1[5]*am2[6] + am1[6];
    am12[7] = am1[4]*am2[3] + am1[5]*am2[7] + am1[7];
    return am12;
}
function am_eye( )
{
    return new AffineMatrix([
    1,0,0,0,
    0,1,0,0
    ]);
}
function cm_combine( m1, m2, a1, a2, matrix )
{
    matrix = matrix || Array; a1 = a1 || 1; a2 = a2 || 1;
    for(var i=0,d=m1.length,m12=new matrix(d); i<d; i++) m12[i] = a1 * m1[i] + a2 * m2[i];
    return m12;
}
function cm_convolve( cm1, cm2, matrix )
{
    matrix = matrix || Array/*ConvolutionMatrix*/;
    if ( cm2 === +cm2 ) cm2 = [cm2];
    var i, j, p, d1 = cm1.length, d2 = cm2.length, cm12 = new matrix(d1*d2);
    for (i=0,j=0; i<d1; )
    {
        cm12[i*d2+j] = cm1[i]*cm2[j];
        if ( ++j >= d2 ){ j=0; i++; }
    }
    return cm12;
}

MathUtil.clamp = clamp;
MathUtil.Geometry = {};

ArrayUtil.arrayset = ArrayUtil.hasArrayset ? function( a, b, offset ){ a.set(b, offset||0); } : arrayset;
ArrayUtil.subarray = ArrayUtil.hasSubarray ? function( a, i1, i2 ){ return a.subarray(i1, i2); } : function( a, i1, i2 ){ return a.slice(i1, i2); };

StringUtil.esc = esc;
StringUtil.trim = String.prototype.trim 
? function( s ){ return s.trim(); }
: function( s ){ return s.replace(trim_re, ''); };
StringUtil.function_body = function_body;

ImageUtil.crop = FILTER.Interpolation.crop = ArrayUtil.hasArrayset ? crop : crop_shim;
ImageUtil.pad = FILTER.Interpolation.pad = ArrayUtil.hasArrayset ? pad : pad_shim;
ImageUtil.get_data = get_data;
ImageUtil.set_data = set_data;
ImageUtil.fill = fill_data;
ImageUtil.integral = integral;
ImageUtil.histogram = histogram;
ImageUtil.spectrum = spectrum;

FilterUtil.ct_eye = ct_eye;
FilterUtil.ct_multiply = ct_multiply;
FilterUtil.cm_eye = cm_eye;
FilterUtil.cm_multiply = cm_multiply;
FilterUtil.cm_rechannel = cm_rechannel;
FilterUtil.am_eye = am_eye;
FilterUtil.am_multiply = am_multiply;
FilterUtil.cm_combine = cm_combine;
FilterUtil.cm_convolve = cm_convolve;
FilterUtil.integral_convolution = notSupportClamp ? integral_convolution_clamp : integral_convolution;
FilterUtil.separable_convolution = notSupportClamp ? separable_convolution_clamp : separable_convolution;
//FilterUtil.algebraic_combination = algebraic_combination;
FilterUtil.canny_gradient = canny_gradient;
FilterUtil.GRAD = gradient;
FilterUtil.SAT = integral2;

}(FILTER);