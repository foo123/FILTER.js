/**
*
* Filter Core Utils
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var MODE = FILTER.MODE, notSupportClamp = FILTER._notSupportClamp, noTypedArraySet = FILTER._noTypedArraySet,
    IMG = FILTER.ImArray, IMGcpy = FILTER.ImArrayCopy,
    A32F = FILTER.Array32F, A64F = FILTER.Array64F,
    A32I = FILTER.Array32I, A16I = FILTER.Array16I, A8U = FILTER.Array8U,
    ColorTable = FILTER.ColorTable, ColorMatrix = FILTER.ColorMatrix,
    AffineMatrix = FILTER.AffineMatrix, ConvolutionMatrix = FILTER.ConvolutionMatrix,
    ArrayUtil = FILTER.Util.Array = FILTER.Util.Array || {},
    StringUtil = FILTER.Util.String = FILTER.Util.String || {},
    MathUtil = FILTER.Util.Math = FILTER.Util.Math || {},
    ImageUtil = FILTER.Util.Image = FILTER.Util.Image || {},
    FilterUtil = FILTER.Util.Filter = FILTER.Util.Filter || {},
    stdMath = Math, Exp = stdMath.exp, Sqrt = stdMath.sqrt,
    Pow = stdMath.pow, Ceil = stdMath.ceil, Floor = stdMath.floor,
    Log = stdMath.log, Sin = stdMath.sin, Cos = stdMath.cos,
    Min = stdMath.min, Max = stdMath.max, Abs = stdMath.abs,
    PI = stdMath.PI, PI2 = PI+PI, PI_2 = PI/2,
    pi = PI, pi2 = PI2, pi_2 = PI_2, pi_32 = 3*pi_2,
    Log2 = stdMath.log2 || function(x) {return Log(x) / stdMath.LN2;},
    esc_re = /([.*+?^${}()|\[\]\/\\\-])/g, trim_re = /^\s+|\s+$/g,
    func_body_re = /^function[^{]+{([\s\S]*)}$/;

function esc(s)
{
    return s.replace(esc_re, '\\$1');
}
function function_body(func)
{
    return Function.prototype.toString.call(func).match(func_body_re)[1] || '';
}

function clamp(x, m, M)
{
    return x > M ? M : (x < m ? m : x);
}

function arrayset_shim(a, b, offset, b0, b1)
{
    //"use asm";
    offset = offset || 0; b0 = b0 || 0;
    var j, i, n = b1 ? b1-b0+1 : b.length, rem = n&31;
    for (i=0; i<rem; ++i)
    {
        a[i + offset] = b[b0 + i];
    }
    for (j=rem; j<n; j+=32)
    {
        i = j;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
    }
}

function crop(im, w, h, x1, y1, x2, y2)
{
    //"use asm";
    x2 = Min(x2, w-1); y2 = Min(y2, h-1);
    var nw = x2-x1+1, nh = y2-y1+1,
        croppedSize = (nw*nh)<<2, cropped = new IMG(croppedSize),
        y, yw, nw4 = nw<<2, pixel, pixel2;

    for (y=y1,yw=y1*w,pixel=0; y<=y2; ++y,yw+=w,pixel+=nw4)
    {
        pixel2 = (yw+x1) << 2;
        cropped.set(im.subarray(pixel2, pixel2+nw4), pixel);
    }
    return cropped;
}
function crop_shim(im, w, h, x1, y1, x2, y2)
{
    //"use asm";
    x2 = Min(x2, w-1); y2 = Min(y2, h-1);
    var nw = x2-x1+1, nh = y2-y1+1,
        croppedSize = (nw*nh)<<2, cropped = new IMG(croppedSize),
        y, yw, nw4 = nw<<2, pixel, pixel2;

    for (y=y1,yw=y1*w,pixel=0; y<=y2; ++y,yw+=w,pixel+=nw4)
    {
        pixel2 = (yw+x1)<<2;
        arrayset_shim(cropped, im, pixel, pixel2, pixel2+nw4);
    }
    return cropped;
}
function pad(im, w, h, pad_right, pad_bot, pad_left, pad_top)
{
    //"use asm";
    pad_right = pad_right || 0; pad_bot = pad_bot || 0;
    pad_left = pad_left || 0; pad_top = pad_top || 0;
    var nw = w+pad_left+pad_right, nh = h+pad_top+pad_bot,
        paddedSize = (nw*nh)<<2, padded = new IMG(paddedSize),
        y, yw, w4 = w<<2, nw4 = nw<<2, pixel, pixel2,
        offtop = pad_top*nw4, offleft = pad_left<<2;

    for (y=0,yw=0,pixel=offtop; y<h; ++y,yw+=w,pixel+=nw4)
    {
        pixel2 = yw<<2;
        padded.set(im.subarray(pixel2, pixel2+w4), offleft+pixel);
    }
    return padded;
}
function pad_shim(im, w, h, pad_right, pad_bot, pad_left, pad_top)
{
    //"use asm";
    pad_right = pad_right || 0; pad_bot = pad_bot || 0;
    pad_left = pad_left || 0; pad_top = pad_top || 0;
    var nw = w+pad_left+pad_right, nh = h+pad_top+pad_bot,
        paddedSize = (nw*nh)<<2, padded = new IMG(paddedSize),
        y, yw, w4 = w<<2, nw4 = nw<<2, pixel, pixel2,
        offtop = pad_top*nw4, offleft = pad_left<<2;

    for (y=0,yw=0,pixel=offtop; y<h; ++y,yw+=w,pixel+=nw4)
    {
        pixel2 = yw<<2;
        arrayset_shim(padded, im, offleft+pixel, pixel2, pixel2+w4);
    }
    return padded;
}

// compute integral image (Summed Area Table, SAT) (for a given channel)
function integral(im, w, h, stride, channel, integ)
{
    //"use asm";
    stride = stride||0; channel = channel||0;
    var len = im.length, size = len>>>stride, rowLen = w<<stride,
        rem = (w&31)<<stride, i32 = 32<<stride, ii = 1<<stride,
        integ, sum, i, j, i0, x;

    integ = integ || new A32F(size);
    // compute integral of image in one pass
    // first row
    sum = 0; j = 0;
    for (i=channel; i<rem; i+=ii)
    {
        sum += im[i]; integ[j++] = sum;
    }
    for (i0=rem+channel; i0<rowlen; i0+=i32)
    {
        i =i0; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
        i+=ii; sum += im[i]; integ[j++] = sum;
    }

    // other rows
    x=0; j=0; sum=0; rem += rowlen;
    for (i=rowLen+channel; i<rem; i+=ii)
    {
        sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
    }
    for (i0=rem+channel; i0<len; i0+=i32)
    {
        i =i0; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
        i+=ii; sum += im[i]; integ[j+w] = integ[j] + sum; ++j;
        if (++x >=w) {x=0; sum=0;}
    }
    return integ;
}
// compute image histogram (for a given channel)
function histogram(im, w, h, stride, channel, pdf_only, cdf)
{
    //"use asm";
    stride = stride||0; channel = channel||0;
    var i, i0, i32 = 32<<stride, ii = 1<<stride,
        l = im.length, l2 = l>>>stride, accum, rem = (l2&31)<<stride;

    // initialize the arrays
    cdf = cdf || new A32F(256);
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
    for (i=channel; i<rem; i+=ii)
    {
        cdf[im[i]]++;
    }
    for (i0=rem+channel; i0<l; i0+=i32)
    {
        // partial loop unrolling
        i =i0; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
        i+=ii; cdf[im[i]]++;
    }

    // return pdf NOT cdf
    if (true === pdf_only) return cdf;

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
function spectrum(im, w, h, stride, channel)
{
    // TODO
    return null;
}

function integral2(im, w, h, stride, channel, sat, sat2, rsat)
{
    //"use asm";
    var len = im.length, size = len>>>stride, rowLen = w<<stride,
        rem = (w&31)<<stride, sum, sum2, c, i, i0, j, i32 = 32<<stride, ii = 1<<stride, x, y;

    // compute sat(integral), sat2(square) and rsat(tilted integral) of image in one pass
    // SAT(-1, y) = SAT(x, -1) = SAT(-1, -1) = 0
    // SAT(x, y) = SAT(x, y-1) + SAT(x-1, y) + I(x, y) - SAT(x-1, y-1)  <-- integral image

    // RSAT(-1, y) = RSAT(x, -1) = RSAT(x, -2) = RSAT(-1, -1) = RSAT(-1, -2) = 0
    // RSAT(x, y) = RSAT(x-1, y-1) + RSAT(x+1, y-1) - RSAT(x, y-2) + I(x, y) + I(x, y-1)    <-- rotated(tilted) integral image at 45deg
    // first row
    sum=sum2=0; j=0;
    for (i=channel; i<rem; i+=ii)
    {
        c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
    }
    for (i0=rem+channel; i0<rowLen; i0+=i32)
    {
        i =i0; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
        i+=ii; c=im[i]; sum+=c; sat[j]=sum; rsat[j]=c; sum2+=c*c; sat2[j]=sum2; ++j;
    }

    // other rows
    x=0; y=1; j=0; sum=0; sum2=0; rem+=rowLen;
    for (i=rowLen+channel; i<rem; i+=ii)
    {
        c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
    }
    for (i0=rem+channel; i0<len; i0+=i32)
    {
        i =i0; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
        i+=ii; c=im[i]; sum+=c; sat[j+w]=sat[j]+sum; sum2+=c*c; sat2[j+w]=sat2[j]+sum2; rsat[j+w]=rsat[j+1-w] + (c+im[(j-w)<<stride]) + (y>1?rsat[j-w-w]:0) + (x>0?rsat[j-1-w]:0); ++j;
        if (++x >=w) {x=0; ++y; sum=sum2=0;}
    }
}
function gradient(im, w, h, stride, channel, do_lowpass, do_sat,
                    low, high, MAGNITUDE_SCALE, MAGNITUDE_LIMIT, MAGNITUDE_MAX)
{
    //"use asm";
    var stride0 = stride, imSize = im.length, count = imSize>>>stride,
        index, i, j, k, sum, w_1 = w-1, h_1 = h-1, w_2, h_2, w2, w4 = w<<stride,
        dx = 1<<stride, dx2 = dx<<1, dy = w4, count = imSize>>>stride,
        i0, i1s, i2s, i1n, i2n, i1w, i1e, ine, inw, ise, isw, //f,
        sobelX, sobelY, gX = new A32F(count), gY = new A32F(count), lowpassed;

    if (do_lowpass)
    {
        w_2 = w-2; h_2 = h-2; w2 = w<<1;
        lowpassed = new A8U(count); //f = 1.0/159.0;
        // pre-bluring is optional, e.g a deriche pre-blur filtering can be used
        /*
        gauss lowpass 5x5 with sigma = 1.4
                       | 2  4  5  4 2 |
                 1     | 4  9 12  9 4 |
        Gauss = ---  * | 5 12 15 12 5 |
                159    | 4  9 12  9 4 |
                       | 2  4  5  4 2 |
        */
        /*
        // first, second rows, last, second-to-last rows
        for (i=0; i<w; i++)
        {
            lowpassed[i] = 0; lowpassed[i+w] = 0;
            lowpassed[i+count-w] = 0; lowpassed[i+count-w2] = 0;
        }
        // first, second columns, last, second-to-last columns
        for (i=0,k=0; i<h; i++,k+=w)
        {
            lowpassed[k] = 0; lowpassed[1+k] = 0;
            lowpassed[w_1+k] = 0; lowpassed[w_2+k] = 0;
        }
        */
        for (i=2,j=2,k=w2; j<h_2; ++i)
        {
            if (i >= w_2) {i=2; k+=w; ++j; if (j>=h_2) break;}
            index = i+k; i0 = (index<<stride)+channel;
            i1s = i0+dy; i2s = i1s+dy; i1n = i0-dy; i2n = i1n-dy;
            // use fixed-point arithmetic here
            lowpassed[index] = (((103*(
                        2*im[i2n-dx2] +  4*im[i2n-dx] +  5*im[i2n] +  4*im[i2n+dx] + 2*im[i2n+dx2]
                       +4*im[i1n-dx2] +  9*im[i1n-dx] + 12*im[i1n] +  9*im[i1n+dx] + 4*im[i1n+dx2]
                       +5*im[i0 -dx2] + 12*im[i0 -dx] + 15*im[i0 ] + 12*im[i0 +dx] + 5*im[i0 +dx2]
                       +4*im[i1s-dx2] +  9*im[i1s-dx] + 12*im[i1s] +  9*im[i1s+dx] + 4*im[i1s+dx2]
                       +2*im[i2s-dx2] +  4*im[i2s-dx] +  5*im[i2s] +  4*im[i2s+dx] + 2*im[i2s+dx2]
                      )+8192)&0xFFFFFFFF)>>>14)&255;
        }
        dx = 1; dx2 = 2; dy = w; stride = 0; channel = 0;
    }
    else
    {
        lowpassed = im;
    }

    /*
    separable sobel gradient 3x3 in X,Y directions
             | −1  0  1 |
    sobelX = | −2  0  2 |
             | −1  0  1 |

             |  1  2  1 |
    sobelY = |  0  0  0 |
             | −1 -2 -1 |
    */
    for (i=1,j=1,k=w; j<h_1; ++i)
    {
        if (i >= w_1) {i=1; k+=w; ++j; if (j>=h_1) break;}
        index = k+i; i0 = (index<<stride)+channel;
        i1s = i0+dy; i1n = i0-dy;
        gX[index] = lowpassed[i1n+dx]-lowpassed[i1n-dx]+(lowpassed[i0+dx]<<1)-(lowpassed[i0-dx]<<1)+lowpassed[i1s+dx]-lowpassed[i1s-dx];
        gY[index] = lowpassed[i1n-dx]-lowpassed[i1s-dx]+(lowpassed[i1n]<<1)-(lowpassed[i1s]<<1)+lowpassed[i1n+dx]-lowpassed[i1s+dx];
    }
    // do the next stages of canny edge processing
    return optimum_gradient(gX, gY, im, w, h, stride0, do_sat, low, high, MAGNITUDE_SCALE, MAGNITUDE_LIMIT, MAGNITUDE_MAX);
}
function optimum_gradient(gX, gY, im, w, h, stride, sat, low, high, MAGNITUDE_SCALE, MAGNITUDE_LIMIT, MAGNITUDE_MAX)
{
    //"use asm";
    if (null == MAGNITUDE_SCALE)
    {
        MAGNITUDE_SCALE = 1; MAGNITUDE_LIMIT = 510; // 2*255
        MAGNITUDE_MAX = MAGNITUDE_SCALE * MAGNITUDE_LIMIT;
    }
    var imSize = im.length, count = imSize>>>stride, index, i, j, k, sum,
        w_1 = w-1, h_1 = h-1, i0, i1s, i2s, i1n, i2n, i1w, i1e, ine, inw, ise, isw,
        g = new A32F(count), xGrad, yGrad, absxGrad, absyGrad, gradMag, tmp,
        nMag, sMag, wMag, eMag, neMag, seMag, swMag, nwMag, gg,
        x0, x1, x2, y0, y1, y2, x, y, y0w, yw, jj, ii, followedge;

    // non-maximal supression
    for (i=1,j=1,k=w; j<h_1; ++i)
    {
        if (i >= w_1) {i=1; k+=w; ++j; if (j>=h_1) break;}

        i0 = i + k;
        i1n = i0 - w;
        i1s = i0 + w;
        i1w = i0 - 1;
        i1e = i0 + 1;
        inw = i1n - 1;
        ine = i1n + 1;
        isw = i1s - 1;
        ise = i1s + 1;

        xGrad = gX[i0]; yGrad = gY[i0];
        absxGrad = Abs(xGrad); absyGrad = Abs(yGrad);
        gradMag = absxGrad+absyGrad;
        nMag = Abs(gX[i1n])+Abs(gY[i1n]);
        sMag = Abs(gX[i1s])+Abs(gY[i1s]);
        wMag = Abs(gX[i1w])+Abs(gY[i1w]);
        eMag = Abs(gX[i1e])+Abs(gY[i1e]);
        neMag = Abs(gX[ine])+Abs(gY[ine]);
        seMag = Abs(gX[ise])+Abs(gY[ise]);
        swMag = Abs(gX[isw])+Abs(gY[isw]);
        nwMag = Abs(gX[inw])+Abs(gY[inw]);

        gg = (xGrad * yGrad <= 0
            ? absxGrad >= absyGrad
                ? (tmp = absxGrad * gradMag) >= Abs(yGrad * neMag - (xGrad + yGrad) * eMag)
                    && tmp > Abs(yGrad * swMag - (xGrad + yGrad) * wMag)
                : (tmp = absyGrad * gradMag) >= Abs(xGrad * neMag - (yGrad + xGrad) * nMag)
                    && tmp > Abs(xGrad * swMag - (yGrad + xGrad) * sMag)
            : absxGrad >= absyGrad
                ? (tmp = absxGrad * gradMag) >= Abs(yGrad * seMag + (xGrad - yGrad) * eMag)
                    && tmp > Abs(yGrad * nwMag + (xGrad - yGrad) * wMag)
                : (tmp = absyGrad * gradMag) >= Abs(xGrad * seMag + (yGrad - xGrad) * sMag)
                    && tmp > Abs(xGrad * nwMag + (yGrad - xGrad) * nMag));
        g[i0] = gg ? (gradMag >= MAGNITUDE_LIMIT ? MAGNITUDE_MAX : Floor(MAGNITUDE_SCALE * gradMag)) : 0;
    }
    if (sat)
    {
        // integral (canny) gradient
        // first row
        for (i=0,sum=0; i<w; ++i) {sum += g[i]; g[i] = sum;}
        // other rows
        for (i=w,k=0,sum=0; i<count; ++i,++k)
        {
            if (k>=w) {k=0; sum=0;}
            sum += g[i]; g[i] = g[i-w] + sum;
        }
        return g;
    }
    else
    {
        // full (canny) gradient
        // reset image
        if (stride) for (i=0; i<imSize; i+=4) {im[i] = im[i+1] = im[i+2] = 0;}
        else for (i=0; i<imSize; ++i) {im[i] = 0;}

        //hysteresis and double-threshold, inlined
        for (i=0,j=0,index=0,k=0; index<count; ++index,k=index<<stride,++i)
        {
            if (i >= w) {i=0; ++j;}
            if ((0 !== im[k]) || (g[index] < high)) continue;

            x0 = i; y0 = j; ii = k;
            do {
                // threshold here
                if (stride) {im[ii] = im[ii+1] = im[ii+2] = 255;}
                else {im[ii] = 255;}

                x1 = x0 === 0 ? x0 : x0-1;
                x2 = x0 === w_1 ? x0 : x0+1;
                y1 = y0 === 0 ? y0 : y0-1;
                y2 = y0 === h_1 ? y0 : y0+1;
                y0w = y1*w;
                x = x1; y = y1; yw = y0w; followedge = 0;
                while (x <= x2 && y <= y2)
                {
                    jj = x + yw; ii = jj << stride;
                    if ((y !== y1 || x !== x1) && (0 === im[ii]) && (g[jj] >= low))
                    {
                        x0 = x; y0 = y;
                        followedge = 1; break;
                    }
                    ++y; yw+=w; if (y>y2) {y=y0; yw=y0w; ++x;}
                }
            } while (followedge);
        }
        return im;
    }
}

// speed-up convolution for special kernels like moving-average
function integral_convolution(mode, im, w, h, stride, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats)
{
    //"use asm";
    var imLen=im.length, imArea=imLen>>>stride, integral, integralLen, colR, colG, colB,
        matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2,
        r, g, b, r2, g2, b2, repeat, tmp, w4 = w<<stride, ii = 1<<stride;

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

    if (MODE.GRAY === mode)
    {
        integralLen = imArea;  rowLen = w;
        integral = new A32F(integralLen);

        if (matrix2) // allow to compute a second matrix in-parallel
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>>1]; centerOffset2 = wtCenter2-wt2;

            // do this multiple times??
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=0;
                for (x=0; x<w; ++x, i+=ii, ++j)
                {
                    colR+=im[i]; integral[j]=colR;
                }
                // other rows
                j=0; x=0; colR=0;
                for (i=w4; i<imLen; i+=ii, ++j, ++x)
                {
                    if (x>=w) {x=0; colR=0;}
                    colR+=im[i]; integral[j+rowLen]=integral[j]+colR;
                }


                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

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
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=0;
                for (x=0; x<w; x++, i+=ii,++j)
                {
                    colR+=im[i]; integral[j]=colR;
                }
                // other rows
                j=0; x=0; colR=0;
                for (i=w4; i<imLen; i+=ii, ++j, ++x)
                {
                    if (x>=w) {x=0; colR=0;}
                    colR+=im[i]; integral[j+rowLen  ]=integral[j  ]+colR;
                }

                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

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
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=colG=colB=0;
                for (x=0; x<w; ++x, i+=ii, j+=3)
                {
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                }
                // other rows
                j=0; x=0; colR=colG=colB=0;
                for (i=w4; i<imLen; i+=ii, j+=3, ++x)
                {
                    if (x>=w) {x=0; colR=colG=colB=0;}
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j+rowLen]=integral[j]+colR;
                    integral[j+rowLen+1]=integral[j+1]+colG;
                    integral[j+rowLen+2]=integral[j+2]+colB;
                }


                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

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
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=colG=colB=0;
                for (x=0; x<w; ++x, i+=ii, j+=3)
                {
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                }
                // other rows
                j=0; x=0; colR=colG=colB=0;
                for (i=w4; i<imLen; i+=ii, j+=3, ++x)
                {
                    if (x>=w) {x=0; colR=colG=colB=0;}
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j+rowLen  ]=integral[j  ]+colR;
                    integral[j+rowLen+1]=integral[j+1]+colG;
                    integral[j+rowLen+2]=integral[j+2]+colB;
                }

                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

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
function integral_convolution_clamp(mode, im, w, h, stride, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats)
{
    //"use asm";
    var imLen=im.length, imArea=imLen>>>stride, integral, integralLen, colR, colG, colB,
        matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2,
        r, g, b, r2, g2, b2, repeat, tmp, w4 = w<<stride, ii = 1<<stride;

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

    if (MODE.GRAY === mode)
    {
        integralLen = imArea;  rowLen = w;
        integral = new A32F(integralLen);

        if (matrix2) // allow to compute a second matrix in-parallel
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>>1]; centerOffset2 = wtCenter2-wt2;

            // do this multiple times??
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=0;
                for (x=0; x<w; x++, i+=ii, ++j)
                {
                    colR+=im[i]; integral[j]=colR;
                }
                // other rows
                j=0; x=0; colR=0;
                for (i=w4; i<imLen; i+=ii, ++j, ++x)
                {
                    if (x>=w) {x=0; colR=0;}
                    colR+=im[i]; integral[j+rowLen]=integral[j]+colR;
                }


                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

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
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=0;
                for (x=0; x<w; x++, i+=ii,++j)
                {
                    colR+=im[i]; integral[j]=colR;
                }
                // other rows
                j=0; x=0; colR=0;
                for (i=w4; i<imLen; i+=ii, ++j, ++x)
                {
                    if (x>=w) {x=0; colR=0;}
                    colR+=im[i]; integral[j+rowLen  ]=integral[j  ]+colR;
                }

                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

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
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=colG=colB=0;
                for (x=0; x<w; ++x, i+=ii, j+=3)
                {
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                }
                // other rows
                j=0; x=0; colR=colG=colB=0;
                for (i=w4; i<imLen; i+=ii, j+=3, ++x)
                {
                    if (x>=w) {x=0; colR=colG=colB=0;}
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j+rowLen]=integral[j]+colR;
                    integral[j+rowLen+1]=integral[j+1]+colG;
                    integral[j+rowLen+2]=integral[j+2]+colB;
                }


                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

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
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=colG=colB=0;
                for (x=0; x<w; ++x, i+=ii, j+=3)
                {
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                }
                // other rows
                j=0; x=0; colR=colG=colB=0;
                for (i=w4; i<imLen; i+=ii, j+=3, ++x)
                {
                    if (x>=w) {x=0; colR=colG=colB=0;}
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j+rowLen  ]=integral[j  ]+colR;
                    integral[j+rowLen+1]=integral[j+1]+colG;
                    integral[j+rowLen+2]=integral[j+2]+colB;
                }

                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

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
function separable_convolution(mode, im, w, h, stride, matrix, matrix2, ind1, ind2, coeff1, coeff2)
{
    //"use asm";
    var imLen=im.length, imArea=imLen>>>stride,
        matArea, mat, indices, matArea2,
        dst, imageIndices, imageIndices1, imageIndices2,
        i, j, k, x, ty, ty2, ii = 1<<stride,
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

    if (MODE.GRAY === mode)
    {
        while (numPasses--)
        {
            tmp = im; im = dst; dst = tmp;
            matArea = mat.length;
            matArea2 = indices.length;

            // do direct convolution
            x=0; ty=0;
            for (i=0; i<imLen; i+=ii, ++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; ++k, j+=2)
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
            for (i=0; i<imLen; i+=ii, ++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; ++k, j+=2)
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
function separable_convolution_clamp(mode, im, w, h, stride, matrix, matrix2, ind1, ind2, coeff1, coeff2)
{
    //"use asm";
    var imLen=im.length, imArea=imLen>>>stride,
        matArea, mat, indices, matArea2,
        dst, imageIndices, imageIndices1, imageIndices2,
        i, j, k, x, ty, ty2, ii = 1<<stride,
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

    if (MODE.GRAY === mode)
    {
        while (numPasses--)
        {
            tmp = im; im = dst; dst = tmp;
            matArea = mat.length;
            matArea2 = indices.length;

            // do direct convolution
            x=0; ty=0;
            for (i=0; i<imLen; i+=ii, ++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; ++k, j+=2)
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
            for (i=0; i<imLen; i+=ii, ++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; ++k, j+=2)
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
function ct_eye(c1, c0)
{
    if ( null == c0 ) c0 = 0;
    if ( null == c1 ) c1 = 1;
    var i, t = new ColorTable(256);
    if ("function" === typeof c1)
    {
        for (i=0; i<256; i+=32)
        {
            t[i   ] = clamp(c1(i   ),0,255)|0;
            t[i+1 ] = clamp(c1(i+1 ),0,255)|0;
            t[i+2 ] = clamp(c1(i+2 ),0,255)|0;
            t[i+3 ] = clamp(c1(i+3 ),0,255)|0;
            t[i+4 ] = clamp(c1(i+4 ),0,255)|0;
            t[i+5 ] = clamp(c1(i+5 ),0,255)|0;
            t[i+6 ] = clamp(c1(i+6 ),0,255)|0;
            t[i+7 ] = clamp(c1(i+7 ),0,255)|0;
            t[i+8 ] = clamp(c1(i+8 ),0,255)|0;
            t[i+9 ] = clamp(c1(i+9 ),0,255)|0;
            t[i+10] = clamp(c1(i+10),0,255)|0;
            t[i+11] = clamp(c1(i+11),0,255)|0;
            t[i+12] = clamp(c1(i+12),0,255)|0;
            t[i+13] = clamp(c1(i+13),0,255)|0;
            t[i+14] = clamp(c1(i+14),0,255)|0;
            t[i+15] = clamp(c1(i+15),0,255)|0;
            t[i+16] = clamp(c1(i+16),0,255)|0;
            t[i+17] = clamp(c1(i+17),0,255)|0;
            t[i+18] = clamp(c1(i+18),0,255)|0;
            t[i+19] = clamp(c1(i+19),0,255)|0;
            t[i+20] = clamp(c1(i+20),0,255)|0;
            t[i+21] = clamp(c1(i+21),0,255)|0;
            t[i+22] = clamp(c1(i+22),0,255)|0;
            t[i+23] = clamp(c1(i+23),0,255)|0;
            t[i+24] = clamp(c1(i+24),0,255)|0;
            t[i+25] = clamp(c1(i+25),0,255)|0;
            t[i+26] = clamp(c1(i+26),0,255)|0;
            t[i+27] = clamp(c1(i+27),0,255)|0;
            t[i+28] = clamp(c1(i+28),0,255)|0;
            t[i+29] = clamp(c1(i+29),0,255)|0;
            t[i+30] = clamp(c1(i+30),0,255)|0;
            t[i+31] = clamp(c1(i+31),0,255)|0;
        }
    }
    else
    {
        for (i=0; i<256; i+=32)
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
    }
    return t;
}
// multiply (functionaly compose) 2 Color Tables
function ct_multiply(ct2, ct1)
{
    var i, ct12 = new ColorTable(256);
    for (i=0; i<256; i+=64)
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
function cm_eye()
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
    cm12[0] = cm2[0]*cm1[0] + cm2[1]*cm1[5] + cm2[2]*cm1[10] + cm2[3]*cm1[15];
    cm12[1] = cm2[0]*cm1[1] + cm2[1]*cm1[6] + cm2[2]*cm1[11] + cm2[3]*cm1[16];
    cm12[2] = cm2[0]*cm1[2] + cm2[1]*cm1[7] + cm2[2]*cm1[12] + cm2[3]*cm1[17];
    cm12[3] = cm2[0]*cm1[3] + cm2[1]*cm1[8] + cm2[2]*cm1[13] + cm2[3]*cm1[18];
    cm12[4] = cm2[0]*cm1[4] + cm2[1]*cm1[9] + cm2[2]*cm1[14] + cm2[3]*cm1[19] + cm2[4];

    // i=5
    cm12[5] = cm2[5]*cm1[0] + cm2[6]*cm1[5] + cm2[7]*cm1[10] + cm2[8]*cm1[15];
    cm12[6] = cm2[5]*cm1[1] + cm2[6]*cm1[6] + cm2[7]*cm1[11] + cm2[8]*cm1[16];
    cm12[7] = cm2[5]*cm1[2] + cm2[6]*cm1[7] + cm2[7]*cm1[12] + cm2[8]*cm1[17];
    cm12[8] = cm2[5]*cm1[3] + cm2[6]*cm1[8] + cm2[7]*cm1[13] + cm2[8]*cm1[18];
    cm12[9] = cm2[5]*cm1[4] + cm2[6]*cm1[9] + cm2[7]*cm1[14] + cm2[8]*cm1[19] + cm2[9];

    // i=10
    cm12[10] = cm2[10]*cm1[0] + cm2[11]*cm1[5] + cm2[12]*cm1[10] + cm2[13]*cm1[15];
    cm12[11] = cm2[10]*cm1[1] + cm2[11]*cm1[6] + cm2[12]*cm1[11] + cm2[13]*cm1[16];
    cm12[12] = cm2[10]*cm1[2] + cm2[11]*cm1[7] + cm2[12]*cm1[12] + cm2[13]*cm1[17];
    cm12[13] = cm2[10]*cm1[3] + cm2[11]*cm1[8] + cm2[12]*cm1[13] + cm2[13]*cm1[18];
    cm12[14] = cm2[10]*cm1[4] + cm2[11]*cm1[9] + cm2[12]*cm1[14] + cm2[13]*cm1[19] + cm2[14];

    // i=15
    cm12[15] = cm2[15]*cm1[0] + cm2[16]*cm1[5] + cm2[17]*cm1[10] + cm2[18]*cm1[15];
    cm12[16] = cm2[15]*cm1[1] + cm2[16]*cm1[6] + cm2[17]*cm1[11] + cm2[18]*cm1[16];
    cm12[17] = cm2[15]*cm1[2] + cm2[16]*cm1[7] + cm2[17]*cm1[12] + cm2[18]*cm1[17];
    cm12[18] = cm2[15]*cm1[3] + cm2[16]*cm1[8] + cm2[17]*cm1[13] + cm2[18]*cm1[18];
    cm12[19] = cm2[15]*cm1[4] + cm2[16]*cm1[9] + cm2[17]*cm1[14] + cm2[18]*cm1[19] + cm2[19];

    return cm12;
}
function cm_rechannel(m, Ri, Gi, Bi, Ai, Ro, Go, Bo, Ao)
{
    var cm = new ColorMatrix(20), RO = Ro*5, GO = Go*5, BO = Bo*5, AO = Ao*5;
    cm[RO+Ri] = m[0 ]; cm[RO+Gi] = m[1 ]; cm[RO+Bi] = m[2 ]; cm[RO+Ai] = m[3 ]; cm[RO+4] = m[4 ];
    cm[GO+Ri] = m[5 ]; cm[GO+Gi] = m[6 ]; cm[GO+Bi] = m[7 ]; cm[GO+Ai] = m[8 ]; cm[GO+4] = m[9 ];
    cm[BO+Ri] = m[10]; cm[BO+Gi] = m[11]; cm[BO+Bi] = m[12]; cm[BO+Ai] = m[13]; cm[BO+4] = m[14];
    cm[AO+Ri] = m[15]; cm[AO+Gi] = m[16]; cm[AO+Bi] = m[17]; cm[AO+Ai] = m[18]; cm[AO+4] = m[19];
    return cm;
}
/*
[ 0xx 1xy 2xo 3xor
  4yx 5yy 6yo 7yor
  0   0   1   0
  0   0   0   1 ]
*/
function am_multiply(am1, am2)
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
function am_eye()
{
    return new AffineMatrix([
    1,0,0,0,
    0,1,0,0
    ]);
}
function cm_combine(m1, m2, a1, a2, matrix)
{
    matrix = matrix || Array; a1 = a1 || 1; a2 = a2 || 1;
    for (var i=0,d=m1.length,m12=new matrix(d); i<d; ++i) m12[i] = a1 * m1[i] + a2 * m2[i];
    return m12;
}
function cm_convolve(cm1, cm2, matrix)
{
    matrix = matrix || Array/*ConvolutionMatrix*/;
    if (cm2 === +cm2) cm2 = [cm2];
    var i, j, p, d1 = cm1.length, d2 = cm2.length, cm12 = new matrix(d1*d2);
    for (i=0,j=0; i<d1; )
    {
        cm12[i*d2+j] = cm1[i]*cm2[j];
        if (++j >= d2) {j=0; ++i;}
    }
    return cm12;
}

function morph_prim_op(mode, inp, out, w, h, stride, index, index2, op, op0, iter/*, fa, fb, fc*/)
{
    //"use asm";
    var tmp, it, x, ty, i, j, k, imLen = inp.length, imArea = imLen>>>stride,
        rM, gM, bM, r, g, b, xOff, yOff, srcOff, bx=w-1, by=imArea-w, coverArea;

    tmp = inp; inp = out; out = tmp;
    /*if ( (0 === stride) || (FILTER.MODE.MONO === mode) )
    {
        coverArea = index.length;
        for (it=0; it<iter; it++)
        {
            tmp = inp; inp = out; out = tmp;
            for (x=0,ty=0,i=0; i<imLen; i++,x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }

                // calculate the image pixels that
                // fall under the structure matrix
                for (rM=op0,j=0; j<coverArea; j+=2)
                {
                    xOff = x+index[j]; yOff = ty+index[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff);
                    r = inp[srcOff];
                    rM = op(r, rM);
                }
                // output
                //rM = (fa*out[i]+fb*rM+fc*inp[i])|0;
                out[i] = rM;
            }
        }

        if ( index2 )
        {
            index = index2; coverArea = index.length;
            for (it=0; it<iter; it++)
            {
                tmp = inp; inp = out; out = tmp;
                for (x=0,ty=0,i=0; i<imLen; i++,x++)
                {
                    // update image coordinates
                    if (x>=w) { x=0; ty+=w; }

                    // calculate the image pixels that
                    // fall under the structure matrix
                    for (rM=op0,j=0; j<coverArea; j+=2)
                    {
                        xOff = x+index[j]; yOff = ty+index[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff);
                        r = inp[srcOff];
                        rM = op(r, rM);
                    }
                    // output
                    //rM = (fa*out[i]+fb*rM+fc*inp[i])|0;
                    out[i] = rM;
                }
            }
        }
    }
    else*/ if (FILTER.MODE.GRAY === mode)
    {
        coverArea = index.length;
        for (it=0; it<iter; ++it)
        {
            tmp = inp; inp = out; out = tmp;
            for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the image pixels that
                // fall under the structure matrix
                for (rM=op0,j=0; j<coverArea; j+=2)
                {
                    xOff = x+index[j]; yOff = ty+index[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    r = inp[srcOff];
                    rM = op(r, rM);
                }
                // output
                //rM = (fa*out[i]+fb*rM+fc*inp[i])|0;
                out[i] = rM; out[i+1] = rM; out[i+2] = rM; out[i+3] = inp[i+3];
            }
        }

        if (index2)
        {
            index = index2; coverArea = index.length;
            for (it=0; it<iter; ++it)
            {
                tmp = inp; inp = out; out = tmp;
                for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ty+=w;}

                    // calculate the image pixels that
                    // fall under the structure matrix
                    for (rM=op0,j=0; j<coverArea; j+=2)
                    {
                        xOff = x+index[j]; yOff = ty+index[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2;
                        r = inp[srcOff];
                        rM = op(r, rM);
                    }
                    // output
                    //rM = (fa*out[i]+fb*rM+fc*inp[i])|0;
                    out[i] = rM; out[i+1] = rM; out[i+2] = rM; out[i+3] = inp[i+3];
                }
            }
        }
    }
    else
    {
        coverArea = index.length;
        for (it=0; it<iter; ++it)
        {
            tmp = inp; inp = out; out = tmp;
            for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the image pixels that
                // fall under the structure matrix
                for (rM=gM=bM=op0,j=0; j<coverArea; j+=2)
                {
                    xOff = x+index[j]; yOff = ty+index[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    r = inp[srcOff]; g = inp[srcOff+1]; b = inp[srcOff+2];
                    rM = op(r, rM); gM = op(g, gM); bM = op(b, bM);
                }
                // output
                //rM = (fa*out[i]+fb*rM+fc*inp[i])|0; gM = (fa*out[i+1]+fb*gM+fc*inp[i+1])|0; bM = (fa*out[i+2]+fb*bM+fc*inp[i+2])|0;
                out[i] = rM; out[i+1] = gM; out[i+2] = bM; out[i+3] = inp[i+3];
            }
        }
        if (index2)
        {
            index = index2; coverArea = index.length;
            for (it=0; it<iter; ++it)
            {
                tmp = inp; inp = out; out = tmp;
                for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ty+=w;}

                    // calculate the image pixels that
                    // fall under the structure matrix
                    for (rM=gM=bM=op0,j=0; j<coverArea; j+=2)
                    {
                        xOff = x+index[j]; yOff = ty+index[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2;
                        r = inp[srcOff]; g = inp[srcOff+1]; b = inp[srcOff+2];
                        rM = op(r, rM); gM = op(g, gM); bM = op(b, bM);
                    }
                    // output
                    //rM = (fa*out[i]+fb*rM+fc*inp[i])|0; gM = (fa*out[i+1]+fb*gM+fc*inp[i+1])|0; bM = (fa*out[i+2]+fb*bM+fc*inp[i+2])|0;
                    out[i] = rM; out[i+1] = gM; out[i+2] = bM; out[i+3] = inp[i+3];
                }
            }
        }
    }
}

ArrayUtil.typed = FILTER.Browser.isNode ? function(a, A) {
    if ((null == a) || (a instanceof A)) return a;
    else if (Array.isArray(a)) return Array === A ? a : new A(a);
    if (null == a.length) a.length = Object.keys(a).length;
    return Array === A ? Array.prototype.slice.call(a) : new A(Array.prototype.slice.call(a));
} : function(a, A) {return a;};
ArrayUtil.typed_obj = FILTER.Browser.isNode ? function(o, unserialise) {
    return null == o ? o : (unserialise ? JSON.parse(o) : JSON.stringify(o));
} : function(o) {return o;};
ArrayUtil.arrayset_shim = arrayset_shim;
ArrayUtil.arrayset = ArrayUtil.hasArrayset ? function(a, b, offset) {a.set(b, offset||0);} : arrayset_shim;
ArrayUtil.subarray = ArrayUtil.hasSubarray ? function(a, i1, i2) {return a.subarray(i1, i2);} : function(a, i1, i2){ return a.slice(i1, i2); };


MathUtil.clamp = clamp;

StringUtil.esc = esc;
StringUtil.trim = String.prototype.trim
? function(s) {return s.trim();}
: function(s) {return s.replace(trim_re, '');};
StringUtil.function_body = function_body;

ImageUtil.crop = ArrayUtil.hasArrayset ? crop : crop_shim;
ImageUtil.pad = ArrayUtil.hasArrayset ? pad : pad_shim;

FilterUtil.integral = integral;
FilterUtil.histogram = histogram;
FilterUtil.spectrum = spectrum;
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
FilterUtil.gradient = gradient;
FilterUtil.optimum_gradient = optimum_gradient;
FilterUtil.sat = integral2;
FilterUtil.primitive_morphology_operator = morph_prim_op;

}(FILTER);