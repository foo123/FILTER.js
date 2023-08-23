/**
*
* Filter Core Utils
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MODE = FILTER.MODE, notSupportClamp = FILTER._notSupportClamp,
    IMG = FILTER.ImArray, copy,
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
    return /*Function.prototype.toString.call(*/func.toString().match(func_body_re)[1] || '';
}

function clamp(x, m, M)
{
    return x > M ? M : (x < m ? m : x);
}
function hypot(a, b, c)
{
    c = c || 0;
    b = b || 0;
    var m = Max(Abs(a), Abs(b), Abs(c));
    if (m)
    {
        a /= m;
        b /= m;
        c /= m;
        return m*Sqrt(a*a + b*b + c*c);
    }
    return 0;
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
function interpolate_bilinear(im, w, h, nw, nh)
{
    // http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
    // http://tech-algorithm.com/articles/bilinear-image-scaling/
    var size = (nw*nh) << 2,
        interpolated = new IMG(size),
        rx = (w-1)/nw, ry = (h-1)/nh,
        A, B, C, D, a, b, c, d,
        i, j, x, y, xi, yi, pixel, index,
        yw, dx, dy, w4 = w << 2,
        round = stdMath.round
    ;
    i=0; j=0; x=0; y=0; yi=0; yw=0; dy=0;
    for (index=0; index<size; index+=4,++j,x+=rx)
    {
        if (j >= nw) {j=0; x=0; ++i; y+=ry; yi=y|0; dy=y - yi; yw=yi*w;}

        xi = x|0; dx = x - xi;

        // Y = A(1-w)(1-h) + B(w)(1-h) + C(h)(1-w) + Dwh
        a = (1-dx)*(1-dy); b = dx*(1-dy);
        c = dy*(1-dx); d = dx*dy;

        pixel = (yw + xi)<<2;

        A = im[pixel]; B = im[pixel+4];
        C = im[pixel+w4]; D = im[pixel+w4+4];
        interpolated[index] = clamp(round(A*a +  B*b + C*c  +  D*d), 0, 255);

        A = im[pixel+1]; B = im[pixel+5];
        C = im[pixel+w4+1]; D = im[pixel+w4+5];
        interpolated[index+1] = clamp(round(A*a +  B*b + C*c  +  D*d), 0, 255);

        A = im[pixel+2]; B = im[pixel+6];
        C = im[pixel+w4+2]; D = im[pixel+w4+6];
        interpolated[index+2] = clamp(round(A*a +  B*b + C*c  +  D*d), 0, 255);

        A = im[pixel+3]; B = im[pixel+7];
        C = im[pixel+w4+3]; D = im[pixel+w4+7];
        interpolated[index+3] = clamp(round(A*a +  B*b + C*c  +  D*d), 0, 255);
    }
    return interpolated;
}
ArrayUtil.copy = copy = ArrayUtil.hasArrayset ? function(a) {
    var b = new a.constructor(a.length);
    b.set(a, 0);
    return b;
} : function(a) {
    //var b = a.slice(0);
    var b = new a.constructor(a.length);
    arrayset_shim(b, a, 0, 0, a.length-1);
    return b;
};

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
function gaussian(dx, dy, sigma)
{
    var rx = dx >>> 1,
        ry = dy >>> 1,
        l = dx*dy,
        f = -1/(2*sigma*sigma),
        m = new A32F(l),
        x, y, i, s, exp = stdMath.exp;
    for (s=0,x=-rx,y=-ry,i=0; i<l; ++i,++x)
    {
        if (x > rx) {x=-rx; ++y;}
        m[i] = exp(f*(x*x+y*y));
        s += m[i];
    }
    for (i=0; i<l; ++i) m[i] /= s;
    return m;
}
var gauss_5_14 = gaussian(5, 5, 1.4);
function gradient(im, w, h, stride, channel, do_lowpass, do_sat,
                    low, high, MAGNITUDE_SCALE, MAGNITUDE_LIMIT, MAGNITUDE_MAX)
{
    //"use asm";
    var stride0 = stride,
        imSize = im.length, count = imSize>>>stride,
        index, i, j, k, sum, w_1 = w-1, h_1 = h-1,
        w_2, h_2, w2, w4 = w<<stride,
        dx = 1<<stride, dx2 = dx<<1, dy = w4,
        i0, i1s, i2s, i1n, i2n,
        i1w, i1e, ine, inw, ise, isw,
        sobelX, sobelY,
        gX = new A32F(count),
        gY = new A32F(count),
        g, lowpassed;

    if (do_lowpass)
    {
        w_2 = w-2; h_2 = h-2; w2 = w<<1;
        lowpassed = new A32F(count);
        //f = 1.0/159.0;
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
        g = gauss_5_14;
        for (i=2,j=2,k=w2; j<h_2; ++i)
        {
            if (i >= w_2) {i=2; k+=w; ++j; if (j>=h_2) break;}
            index = i+k; i0 = (index<<stride);
            if (0 < stride && 0 === im[i0+3])
            {
                lowpassed[index] = 0;
            }
            else
            {
                i0 += channel;
                i1s = i0+dy; i2s = i1s+dy; i1n = i0-dy; i2n = i1n-dy;
                lowpassed[index] = (
                g[0]*im[i2n-dx2] + g[1]*im[i2n-dx] + g[2]*im[i2n] + g[3]*im[i2n+dx] + g[4]*im[i2n+dx2]
               +g[5]*im[i1n-dx2] + g[6]*im[i1n-dx] + g[7]*im[i1n] + g[8]*im[i1n+dx] + g[9]*im[i1n+dx2]
               +g[10]*im[i0 -dx2] + g[11]*im[i0 -dx] + g[12]*im[i0 ] + g[13]*im[i0 +dx] + g[14]*im[i0 +dx2]
               +g[15]*im[i1s-dx2] +  g[16]*im[i1s-dx] + g[17]*im[i1s] + g[18]*im[i1s+dx] + g[19]*im[i1s+dx2]
               +g[20]*im[i2s-dx2] + g[21]*im[i2s-dx] + g[22]*im[i2s] + g[23]*im[i2s+dx] + g[24]*im[i2s+dx2]
                );
            }
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
        gX[index] = (lowpassed[i1n+dx]-lowpassed[i1n-dx])+2*(lowpassed[i0+dx]-lowpassed[i0-dx])+(lowpassed[i1s+dx]-lowpassed[i1s-dx]);
        gY[index] = (lowpassed[i1n-dx]-lowpassed[i1s-dx])+2*(lowpassed[i1n]-lowpassed[i1s])+(lowpassed[i1n+dx]-lowpassed[i1s+dx]);
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
    var imSize = im.length,
        count = imSize>>>stride,
        index, i, j, k, sum,
        w_1 = w-1, h_1 = h-1,
        i0, i1s, i2s, i1n, i2n,
        i1w, i1e, ine, inw, ise, isw,
        g = new A32F(count), xGrad, yGrad,
        absxGrad, absyGrad, gradMag, tmp,
        nMag, sMag, wMag, eMag,
        neMag, seMag, swMag, nwMag, gg,
        x0, x1, x2, y0, y1, y2,
        x, y, y0w, yw, jj, ii,
        followedge, tm, tM;

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
        tM = Max(absxGrad, absyGrad);
        tm = Min(absxGrad, absyGrad);
        gradMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[i1n]),Abs(gY[i1n]));
        tm = Min(Abs(gX[i1n]),Abs(gY[i1n]));
        nMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[i1s]),Abs(gY[i1s]));
        tm = Min(Abs(gX[i1s]),Abs(gY[i1s]));
        sMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[i1w]),Abs(gY[i1w]));
        tm = Min(Abs(gX[i1w]),Abs(gY[i1w]));
        wMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[i1e]),Abs(gY[i1e]));
        tm = Min(Abs(gX[i1e]),Abs(gY[i1e]));
        eMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[ine]),Abs(gY[ine]));
        tm = Min(Abs(gX[ine]),Abs(gY[ine]));
        neMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[ise]),Abs(gY[ise]));
        tm = Min(Abs(gX[ise]),Abs(gY[ise]));
        seMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[isw]),Abs(gY[isw]));
        tm = Min(Abs(gX[isw]),Abs(gY[isw]));
        swMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[inw]),Abs(gY[inw]));
        tm = Min(Abs(gX[inw]),Abs(gY[inw]));
        nwMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation

        gg = xGrad * yGrad <= 0
            ? (absxGrad >= absyGrad
                ? ((tmp = absxGrad * gradMag) >= Abs(yGrad * neMag - (xGrad + yGrad) * eMag)
                    && tmp > Abs(yGrad * swMag - (xGrad + yGrad) * wMag))
                : ((tmp = absyGrad * gradMag) >= Abs(xGrad * neMag - (yGrad + xGrad) * nMag)
                    && tmp > Abs(xGrad * swMag - (yGrad + xGrad) * sMag)))
            : (absxGrad >= absyGrad
                ? ((tmp = absxGrad * gradMag) >= Abs(yGrad * seMag + (xGrad - yGrad) * eMag)
                    && tmp > Abs(yGrad * nwMag + (xGrad - yGrad) * wMag))
                : ((tmp = absyGrad * gradMag) >= Abs(xGrad * seMag + (yGrad - xGrad) * sMag)
                    && tmp > Abs(xGrad * nwMag + (yGrad - xGrad) * nMag)));
        g[i0] = gg ? (gradMag >= MAGNITUDE_LIMIT ? MAGNITUDE_MAX : MAGNITUDE_SCALE * gradMag) : 0;
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
            /*if ((0 === im[k]) && (g[index] >= high))
            {
                follow(im, w, h, g, i, j, index, stride, low);
            }*/
            if ((0 < im[k]) || (g[index] < high)) continue;
            x1 = i; y1 = j; ii = k; jj = index;
            do {
                // threshold here
                if (stride) {im[ii] = im[ii+1] = im[ii+2] = /*g[jj]*/255;}
                else {im[ii] = /*g[jj]*/255;}

                x0 = x1 === 0 ? x1 : x1-1;
                x2 = x1 === w_1 ? x1 : x1+1;
                y0 = y1 === 0 ? y1 : y1-1;
                y2 = y1 === h_1 ? y1 : y1+1;
                y0w = y0*w;
                x = x0; y = y0; yw = y0w = y0*w; followedge = 0;
                while (x <= x2 && y <= y2)
                {
                    jj = x + yw; ii = jj << stride;
                    if ((y !== y1 || x !== x1) && (0 === im[ii]) && (g[jj] >= low))
                    {
                        x1 = x; y1 = y;
                        followedge = 1; break;
                    }
                    ++y; yw+=w; if (y>y2) {y=y0; yw=y0w; ++x;}
                }
            } while (followedge);
        }
        return im;
    }
}
/*function follow(im, w, h, g, x1, y1, i1, stride, low)
{
    var
        x0 = x1 === 0 ? x1 : x1 - 1,
        x2 = x1 === w - 1 ? x1 : x1 + 1,
        y0 = y1 === 0 ? y1 : y1 - 1,
        y2 = y1 === h -1 ? y1 : y1 + 1,
        x, y, yw, y0w, i2, j2
    ;

    j2 = i1 << stride;
    im[j2] = g[i1];
    if (0 < stride) im[j2+1] = im[j2+2] = im[j2];
    x = x0, y = y0; y0w = yw = y0*w;
    while (x <= x2 && y <= y2)
    {
        i2 = x + yw; j2 = i2 << stride;
        if ((y !== y1 || x !== x1) && 0 === im[j2] && g[i2] >= low)
        {
            follow(im, w, h, g, x, y, i2, stride, low);
            return;
        }
        ++y; if (y>y2) {y=y0; yw=y0w; ++x;}
    }
}*/
function gradient_glsl()
{
var toFloat = FILTER.Util.GLSL.formatFloat,
g = function(i, notsigned) {return toFloat(gauss_5_14[i], !notsigned);};
return {
'lowpass': [
'vec4 lowpass(sampler2D img, vec2 pix, vec2 dp) {',
'   float a = texture2D(img, pix).a;',
'   if (0.0 == a || 0.0 > pix.x-2.0*dp.x || 0.0 > pix.y-2.0*dp.y || 1.0 < pix.x+2.0*dp.x || 1.0 < pix.y+2.0*dp.y) return vec4(0.0, 0.0, 0.0, a);',
'   return vec4('+g(0,1)+'*texture2D(img, pix+vec2(-2.0,-2.0)*dp).rgb'+g(1)+'*texture2D(img, pix+vec2(-1.0,-2.0)*dp).rgb'+g(2)+'*texture2D(img, pix+vec2(0.0,-2.0)*dp).rgb'+g(3)+'*texture2D(img, pix+vec2(1.0,-2.0)*dp).rgb'+g(4)+'*texture2D(img, pix+vec2(2.0,-2.0)*dp).rgb'+g(5)+'*texture2D(img, pix+vec2(-2.0,-1.0)*dp).rgb'+g(6)+'*texture2D(img, pix+vec2(-1.0,-1.0)*dp).rgb'+g(7)+'*texture2D(img, pix+vec2(0.0,-1.0)*dp).rgb'+g(8)+'*texture2D(img, pix+vec2(1.0,-1.0)*dp).rgb'+g(9)+'*texture2D(img, pix+vec2(2.0,-1.0)*dp).rgb'+g(10)+'*texture2D(img, pix+vec2(-2.0,0.0)*dp).rgb'+g(11)+'*texture2D(img, pix+vec2(-1.0,0.0)*dp).rgb'+g(12)+'*texture2D(img, pix+vec2(0.0,0.0)*dp).rgb'+g(13)+'*texture2D(img, pix+vec2(1.0,0.0)*dp).rgb'+g(14)+'*texture2D(img, pix+vec2(2.0,0.0)*dp).rgb'+g(15)+'*texture2D(img, pix+vec2(-2.0,1.0)*dp).rgb'+g(16)+'*texture2D(img, pix+vec2(-1.0,1.0)*dp).rgb'+g(17)+'*texture2D(img, pix+vec2(0.0,1.0)*dp).rgb'+g(18)+'*texture2D(img, pix+vec2(1.0,1.0)*dp).rgb'+g(19)+'*texture2D(img, pix+vec2(2.0,1.0)*dp).rgb'+g(20)+'*texture2D(img, pix+vec2(-2.0,2.0)*dp).rgb'+g(21)+'*texture2D(img, pix+vec2(-1.0,2.0)*dp).rgb'+g(22)+'*texture2D(img, pix+vec2(0.0,2.0)*dp).rgb'+g(23)+'*texture2D(img, pix+vec2(1.0,2.0)*dp).rgb'+g(24)+'*texture2D(img, pix+vec2(2.0,2.0)*dp).rgb, a);',
'}'
].join('\n'),
'gradient': [
'vec2 sobel_gradient(sampler2D i, vec2 p, vec2 d) {',
'   if (0.0 > pix.x-d.x || 0.0 > pix.y-d.y || 1.0 < pix.x+d.x || 1.0 < pix.y+d.y) return vec2(0.0);',
'    return vec2(',
'    (texture2D(i, p+vec2(1.0,-1.0)*d).r-texture2D(i, p+vec2(-1.0,-1.0)*d).r)',
'    +2.0*(texture2D(i, p+vec2(1.0,0.0)*d).r-texture2D(i, p+vec2(-1.0,0.0)*d).r)',
'    +(texture2D(i, p+vec2(1.0,1.0)*d).r-texture2D(i, p+vec2(-1.0,1.0)*d).r)',
'    ,',
'    (texture2D(i, p+vec2(-1.0,-1.0)*d).r-texture2D(i, p+vec2(-1.0,1.0)*d).r)',
'    +2.0*(texture2D(i, p+vec2(0.0,-1.0)*d).r-texture2D(i, p+vec2(0.0,1.0)*d).r)',
'    +(texture2D(i, p+vec2(1.0,-1.0)*d).r-texture2D(i, p+vec2(1.0,1.0)*d).r)',
'    );',
'}',
'float gradient_suppressed(sampler2D img, vec2 pix, vec2 dp, float magnitude_scale, float magnitude_limit, float magnitude_max) {',
'    vec2 g = sobel_gradient(img, pix, dp);',
'    vec2 gn = sobel_gradient(img, pix+vec2(0.0,-1.0)*dp, dp);',
'    vec2 gs = sobel_gradient(img, pix+vec2(0.0,1.0)*dp, dp);',
'    vec2 gw = sobel_gradient(img, pix+vec2(-1.0,0.0)*dp, dp);',
'    vec2 ge = sobel_gradient(img, pix+vec2(1.0,0.0)*dp, dp);',
'    vec2 gnw = sobel_gradient(img, pix+vec2(-1.0,-1.0)*dp, dp);',
'    vec2 gne = sobel_gradient(img, pix+vec2(1.0,-1.0)*dp, dp);',
'    vec2 gsw = sobel_gradient(img, pix+vec2(-1.0,1.0)*dp, dp);',
'    vec2 gse = sobel_gradient(img, pix+vec2(1.0,1.0)*dp, dp);',
'    float gM = length(g);',
'    float gnM = length(gn);',
'    float gsM = length(gs);',
'    float gwM = length(gw);',
'    float geM = length(ge);',
'    float gnwM = length(gnw);',
'    float gneM = length(gne);',
'    float gswM = length(gsw);',
'    float gseM = length(gse);',
'    float gg = 0.0; float tmp;',
'    if (g.x*g.y <= 0.0)',
'    {',
'        if (abs(g.x) >= abs(g.y))',
'        {',
'            tmp = abs(g.x)*gM;',
'            if (tmp >= abs(g.y * gneM - (g.x + g.y) * geM) && tmp > abs(g.y * gswM - (g.x + g.y) * gwM))',
'            {',
'                gg = 1.0;',
'            }',
'        }',
'        else',
'        {',
'            tmp = abs(g.y)*gM;',
'            if (tmp >= abs(g.x * gneM - (g.y + g.x) * gnM) && tmp > abs(g.x * gswM - (g.y + g.x) * gsM))',
'            {',
'                gg = 1.0;',
'            }',
'        }',
'    }',
'    else',
'    {',
'        if (abs(g.x) >= abs(g.y))',
'        {',
'            tmp = abs(g.x)*gM;',
'            if (tmp >= abs(g.y * gseM + (g.x - g.y) * geM) && tmp > abs(g.y * gnwM + (g.x - g.y) * gwM))',
'            {',
'                gg = 1.0;',
'            }',
'        }',
'        else',
'        {',
'            tmp = abs(g.y)*gM;',
'            if (tmp >= abs(g.x * gseM + (g.y - g.x) * gsM)',
'                && tmp > abs(g.x * gnwM + (g.y - g.x) * gnM))',
'            {',
'                gg = 1.0;',
'            }',
'        }',
'    }',
'    if (0.0 < gg)',
'    {',
'        if (gM >= magnitude_limit)',
'        {',
'            gg = magnitude_max;',
'        }',
'        else',
'        {',
'            gg = magnitude_scale * gM;',
'        }',
'    }',
'    return gg;',
'}',
'vec4 gradient(sampler2D img, vec2 pix, vec2 dp, float low, float high, float magnitude_scale, float magnitude_limit, float magnitude_max) {',
'    float a = texture2D(img, pix).a;',
'    if (0.0 == a) return vec4(0.0);',
'    float g = gradient_suppressed(img, pix, dp, magnitude_scale, magnitude_limit, magnitude_max);',
'    if (g >= high) return vec4(vec3(1.0), a);',
'    else if (g < low) return vec4(vec3(0.0), a);',
'    return vec4(vec3(/*clamp((g-low)/(high-low)-0.1, 0.0, 0.9)/0.9*/0.1), a);',
'}'
].join('\n'),
'hysteresis': [
'vec4 hysteresis(sampler2D img, vec2 pix, vec2 dp) {',
'   vec4 g = texture2D(img, pix);',
'   float x; float y; vec4 gg;',
'   if (0.0 < g.r && 1.0 > g.r) {',
'       for (int i=-1; i<=1; ++i) { x = float(i);',
'           if (0.0 > pix.x+x*dp.x || 1.0 < pix.x+x*dp.x) continue;',
'           for (int j=-1; j<=1; ++j) { y = float(j);',
'               if (0==i && 0==j) continue;',
'               if (0.0 > pix.y+y*dp.y || 1.0 < pix.y+y*dp.y) continue;',
'               gg = texture2D(img, pix+vec2(x,y)*dp);',
'               if (1.0 == gg.r) return vec4(vec3(1.0), g.a);',
'           }',
'       }',
'   }',
'   return g;',
'}'
].join('\n')
};
}

// speed-up convolution for special kernels like moving-average
function integral_convolution(mode, im, w, h, stride, matrix, matrix2, dimX, dimY, dimX2, dimY2, coeff1, coeff2, numRepeats)
{
    //"use asm";
    var imLen=im.length, imArea=imLen>>>stride, integral, integralLen,
        colR, colG, colB,
        matRadiusX=dimX, matRadiusY=dimY, matArea, matArea2,
        matHalfSideX, matHalfSideY, matHalfSideX2, matHalfSideY2,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        matOffsetLeft2, matOffsetRight2, matOffsetTop2, matOffsetBottom2,
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
    matArea2 = dimX2*dimY2;
    matHalfSideX2 = dimX2>>>1;  matHalfSideY2 = w*(dimY2>>>1);
    matOffsetLeft2 = -matHalfSideX2-1; matOffsetTop2 = -matHalfSideY2-w;
    matOffsetRight2 = matHalfSideX2; matOffsetBottom2 = matHalfSideY2;
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
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea2>>>1]; centerOffset2 = wtCenter2-wt2;

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

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft2; yOff1=ty + matOffsetTop2;
                    xOff2=x + matOffsetRight2; yOff2=ty + matOffsetBottom2;

                    // fix borders
                     xOff1 = xOff1<bx1 ? bx1 : xOff1;
                     xOff2 = xOff2>bx2 ? bx2 : xOff2;
                     yOff1 = yOff1<by1 ? by1 : yOff1;
                     yOff2 = yOff2>by2 ? by2 : yOff2;

                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;

                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
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
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea2>>>1]; centerOffset2 = wtCenter2-wt2;

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

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft2; yOff1=ty + matOffsetTop2;
                    xOff2=x + matOffsetRight2; yOff2=ty + matOffsetBottom2;

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
function integral_convolution_clamp(mode, im, w, h, stride, matrix, matrix2, dimX, dimY, dimX2, dimY2, coeff1, coeff2, numRepeats)
{
    //"use asm";
    var imLen=im.length, imArea=imLen>>>stride, integral, integralLen,
        colR, colG, colB,
        matRadiusX=dimX, matRadiusY=dimY, matArea, matArea2,
        matHalfSideX, matHalfSideY, matHalfSideX2, matHalfSideY2,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        matOffsetLeft2, matOffsetRight2, matOffsetTop2, matOffsetBottom2,
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
    matArea2 = dimX2*dimY2;
    matHalfSideX2 = dimX2>>>1;  matHalfSideY2 = w*(dimY2>>>1);
    matOffsetLeft2 = -matHalfSideX2-1; matOffsetTop2 = -matHalfSideY2-w;
    matOffsetRight2 = matHalfSideX2; matOffsetBottom2 = matHalfSideY2;
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
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea2>>>1]; centerOffset2 = wtCenter2-wt2;

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

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft2; yOff1=ty + matOffsetTop2;
                    xOff2=x + matOffsetRight2; yOff2=ty + matOffsetBottom2;

                    // fix borders
                    xOff1 = xOff1<bx1 ? bx1 : xOff1;
                    xOff2 = xOff2>bx2 ? bx2 : xOff2;
                    yOff1 = yOff1<by1 ? by1 : yOff1;
                    yOff2 = yOff2>by2 ? by2 : yOff2;

                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;

                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
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
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea2>>>1]; centerOffset2 = wtCenter2-wt2;

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

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft2; yOff1=ty + matOffsetTop2;
                    xOff2=x + matOffsetRight2; yOff2=ty + matOffsetBottom2;

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
        xOff, yOff, srcOff, bx, by, t0, t1, t2, t3, wt,
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
        xOff, yOff, srcOff, bx, by, t0, t1, t2, t3, wt,
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
function histogram(im, channel, cdf)
{
    channel = channel || 0;
    var h = new A32F(256), v, i, l = im.length,
        accum = 0, min = 255, max = 0;
    for (i=0; i<l; i+=4)
    {
        v = im[i+channel];
        ++h[v];
        min = Min(v, min);
        max = Max(v, max);
    }
    if (cdf)
    {
        for (i=0; i<256; )
        {
            // partial loop unrolling
            accum += h[i]; h[i++] = accum;
            accum += h[i]; h[i++] = accum;
            accum += h[i]; h[i++] = accum;
            accum += h[i]; h[i++] = accum;
        }
    }
    return {bin:h, channel:channel, min:min, max:max, total:l>>>2};
}

function ct_eye(c1, c0)
{
    if (null == c0) c0 = 0;
    if (null == c1) c1 = 1;
    var i, t = new ColorTable(256);
    if ("function" === typeof c1)
    {
        for (i=0; i<256; ++i)
        {
            t[i   ] = clamp(c1(i   ),0,255)|0;
        }
    }
    else
    {
        for (i=0; i<256; ++i)
        {
            t[i   ] = clamp(c0 + c1*(i   ),0,255)|0;
        }
    }
    return t;
}
// multiply (functionaly compose) 2 Color Tables
function ct_multiply(ct2, ct1)
{
    var i, ct12 = new ColorTable(256);
    for (i=0; i<256; ++i)
    {
        ct12[i   ] = clamp(ct2[clamp(ct1[i   ],0,255)],0,255);
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
    var cm12 = new ColorMatrix(20), i;

    for (i=0; i<20; i+=5)
    {
        cm12[i+0] = cm2[i]*cm1[0] + cm2[i+1]*cm1[5] + cm2[i+2]*cm1[10] + cm2[i+3]*cm1[15];
        cm12[i+1] = cm2[i]*cm1[1] + cm2[i+1]*cm1[6] + cm2[i+2]*cm1[11] + cm2[i+3]*cm1[16];
        cm12[i+2] = cm2[i]*cm1[2] + cm2[i+1]*cm1[7] + cm2[i+2]*cm1[12] + cm2[i+3]*cm1[17];
        cm12[i+3] = cm2[i]*cm1[3] + cm2[i+1]*cm1[8] + cm2[i+2]*cm1[13] + cm2[i+3]*cm1[18];
        cm12[i+4] = cm2[i]*cm1[4] + cm2[i+1]*cm1[9] + cm2[i+2]*cm1[14] + cm2[i+3]*cm1[19] + cm2[i+4];
    }
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
MathUtil.hypot = hypot;

StringUtil.esc = esc;
StringUtil.trim = String.prototype.trim
? function(s) {return s.trim();}
: function(s) {return s.replace(trim_re, '');};
StringUtil.function_body = function_body;

ImageUtil.crop = ArrayUtil.hasArrayset ? crop : crop_shim;
ImageUtil.pad = ArrayUtil.hasArrayset ? pad : pad_shim;
ImageUtil.interpolate = interpolate_bilinear;

FilterUtil.ct_eye = ct_eye;
FilterUtil.ct_multiply = ct_multiply;
FilterUtil.cm_eye = cm_eye;
FilterUtil.cm_multiply = cm_multiply;
FilterUtil.cm_rechannel = cm_rechannel;
FilterUtil.am_eye = am_eye;
FilterUtil.am_multiply = am_multiply;
FilterUtil.cm_combine = cm_combine;
FilterUtil.cm_convolve = cm_convolve;
FilterUtil.gaussian = gaussian;
FilterUtil.integral_convolution = notSupportClamp ? integral_convolution_clamp : integral_convolution;
FilterUtil.separable_convolution = notSupportClamp ? separable_convolution_clamp : separable_convolution;
FilterUtil.gradient = gradient;
FilterUtil.optimum_gradient = optimum_gradient;
FilterUtil.gradient_glsl = gradient_glsl;
FilterUtil.sat = integral2;
FilterUtil.histogram = histogram;
FilterUtil._wasm = function() {
    return {imports:{},exports:{
        interpolate_bilinear:{inputs: [{arg:0,type:FILTER.ImArray}], output: {type:FILTER.ImArray}},
        integral_convolution:{inputs: [{arg:1,type:FILTER.ImArray},{arg:5,type:FILTER.Array32F},{arg:6,type:FILTER.Array32F}], output: {type:FILTER.ImArray}},
        separable_convolution:{inputs: [{arg:1,type:FILTER.ImArray},{arg:5,type:FILTER.Array32F},{arg:6,type:FILTER.Array32F},{arg:7,type:FILTER.Array16I},{arg:8,type:FILTER.Array16I}], output: {type:FILTER.ImArray}},
        histogram:{inputs: [{arg:0,type:FILTER.ImArray}], output: {struct:{
            bin: {type:FILTER.A32F, offset:0},
            channel: {type:'i32', offset:4},
            min: {type:'i32', offset:8},
            max: {type:'i32', offset:12},
            total: {type:'i32', offset:16}
        }}},
        gaussian:{inputs: [], output: {type:FILTER.Array32F}},
        gradient:{inputs: [{arg:0,type:FILTER.ImArray}], output: {type:FILTER.ImArray}},
        optimum_gradient:{inputs: [{arg:0,type:FILTER.Array32F},{arg:1,type:FILTER.Array32F},{arg:2,type:FILTER.ImArray}], output: {type:FILTER.ImArray}}
    },wasm:'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'};
};
}(FILTER);