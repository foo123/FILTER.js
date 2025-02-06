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
    SQRT1_2 = stdMath.SQRT1_2,
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
    if (0 === m) return 0;
    a /= m;
    b /= m;
    c /= m;
    return m*Sqrt(a*a + b*b + c*c);
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
    pad_right = pad_right || 0; pad_bot = pad_bot || 0;
    pad_left = pad_left || 0; pad_top = pad_top || 0;
    var nw = w+pad_left+pad_right, nh = h+pad_top+pad_bot,
        paddedSize = ((nw*nh)<<2), padded = new IMG(paddedSize),
        y, w4 = (w<<2), nw4 = (nw<<2), pixel, pixel2,
        offtop = pad_top*nw4, offleft = (pad_left<<2);

    for (y=0,pixel2=0,pixel=offtop; y<h; ++y,pixel2+=w4,pixel+=nw4)
    {
        padded.set(im.subarray(pixel2, pixel2+w4), pixel+offleft);
    }
    return padded;
}
function pad_shim(im, w, h, pad_right, pad_bot, pad_left, pad_top)
{
    pad_right = pad_right || 0; pad_bot = pad_bot || 0;
    pad_left = pad_left || 0; pad_top = pad_top || 0;
    var nw = w+pad_left+pad_right, nh = h+pad_top+pad_bot,
        paddedSize = (nw*nh)<<2, padded = new IMG(paddedSize),
        y, w4 = w<<2, nw4 = nw<<2, pixel, pixel2,
        offtop = pad_top*nw4, offleft = pad_left<<2;

    for (y=0,pixel2=0,pixel=offtop; y<h; ++y,pixel2+=w4,pixel+=nw4)
    {
        arrayset_shim(padded, im, pixel+offleft, pixel2, pixel2+w4);
    }
    return padded;
}
function interpolate_nearest(im, w, h, nw, nh)
{
    var size = (nw*nh) << 2,
        interpolated = new IMG(size),
        x, y, xn, yn, nearest, pixel,
        round = stdMath.round
    ;
    for (x=0,y=0,pixel=0; pixel<size; pixel+=4,++x)
    {
        if (x >= nw) {x=0; ++y;}

        xn = clamp(round(x/nw*w), 0, w-1);
        yn = clamp(round(y/nh*h), 0, h-1);
        nearest = (yn*w + xn) << 2;

        interpolated[pixel  ] = im[nearest  ];
        interpolated[pixel+1] = im[nearest+1];
        interpolated[pixel+2] = im[nearest+2];
        interpolated[pixel+3] = im[nearest+3];
    }
    return interpolated;
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

function integral2(im, w, h, stride, channel, sat, sat2, rsat, rsat2)
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
    sum=sum2=0;
    for (i=0+channel,j=0; i<rowLen; i+=ii,++j)
    {
        c = im[i];
        sum += c; sat[j] = sum;
        if (sat2) {sum2 += c*c; sat2[j] = sum2;}
        if (rsat) {rsat[j] = c;}
        if (rsat2) {rsat2[j] = c*c;}
    }

    // other rows
    x=0; y=1; sum=sum2=0;
    for (i=rowLen+channel,j=0; i<len; i+=ii,++j)
    {
        c = im[i]; sum += c; sat[j+w] = sat[j]+sum;
        if (sat2) {sum2 += c*c; sat2[j+w] = sat2[j]+sum2;}
        if (rsat) {rsat[j+w] = (rsat[j+1-w]||0) + (c+(im[(j-w)<<stride]||0)) + (y>1?(rsat[j-w-w]||0):0) + (x>0?(rsat[j-1-w]||0):0);}
        if (rsat2) {rsat2[j+w] = (rsat2[j+1-w]||0) + (c*c+(im[(j-w)<<stride]||0)*(im[(j-w)<<stride]||0)) + (y>1?(rsat2[j-w-w]||0):0) + (x>0?(rsat2[j-1-w]||0):0);}
        if (++x >= w) {x=0; ++y; sum=sum2=0;}
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
'    return vec4(vec3(/*clamp((g-low)/(high-low)-0.1, 0.0, 0.9)/0.9*/0.01), a);',
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
function image_glsl()
{
return {
'crop': [
'vec4 crop(vec2 pix, sampler2D img, vec2 wh, vec2 nwh, float x1, float y1, float x2, float y2) {',
'   vec2 start = vec2(x1, y1)/wh; vec2 end = vec2(x2, y2)/wh;',
'   return texture2D(img, start + pix*(end-start));',
'}'
].join('\n'),
'pad': [
'vec4 pad(vec2 pix, sampler2D img, vec2 wh, vec2 nwh, float pad_right, float pad_bot, float pad_left, float pad_top) {',
'   vec2 p = pix*nwh - vec2(pad_left, pad_top);',
'   if (p.x < 0.0 || p.x > wh.x || p.y < 0.0 || p.y > wh.y) return vec4(0.0);',
'   return texture2D(img, p/wh);',
'}'
].join('\n'),
'interpolate': [
'vec4 interpolate_nearest(vec2 pix, sampler2D img, vec2 wh, vec2 nwh) {',
'   return texture2D(img, pix);',
'}',
'vec4 interpolate_bilinear(vec2 pix, sampler2D img, vec2 wh, vec2 nwh) {',
'   if (wh.x == nwh.x && wh.y == nwh.y) return texture2D(img, pix);',
'   vec2 xy = pix*wh /*+ vec2(0.5)*/;',
'   vec2 xyi = floor(xy);',
'   vec2 x1yi = xyi + vec2(1.0, 0.0);',
'   vec2 xy1i = xyi + vec2(0.0, 1.0);',
'   vec2 x1y1i = xyi + vec2(1.0, 1.0);',
'   vec2 d = (xy - xyi);',
'   return (1.0-d.x)*(1.0-d.y)*texture2D(img, xyi/wh) + (d.x)*(1.0-d.y)*texture2D(img, x1yi/wh) + (1.0-d.x)*(d.y)*texture2D(img, xy1i/wh) + (d.x)*(d.y)*texture2D(img, x1y1i/wh);',
'}',
'vec4 interpolate(vec2 pix, sampler2D img, vec2 wh, vec2 nwh) {',
'   return interpolate_bilinear(pix, img, wh, nwh);',
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
function histogram(im, channel, ret_cdf, ret_norm)
{
    channel = channel || 0;
    var h = new A32F(256), v, i,
        ALPHA = FILTER.CHANNEL.A,
        l = im.length, total = 0,
        accum = 0, min = 255, max = 0;
    for (i=0; i<256; ++i)
    {
        h[i] = 0;
    }
    for (i=0; i<l; i+=4)
    {
        if (0 < im[i+ALPHA])
        {
            v = im[i+channel];
            ++h[v];
            ++total;
            min = Min(v, min);
            max = Max(v, max);
        }
    }
    if (ret_cdf)
    {
        for (i=0; i<256; ++i)
        {
            accum += h[i];
            h[i] = accum;
        }
    }
    if (ret_norm)
    {
        for (i=0; i<256; ++i)
        {
            h[i] /= total;
        }
    }
    return {bin:h, channel:channel, min:min, max:max, total:total};
}
function integral_histogram(im, w, h, channel)
{
    var r, g, b, i, j, k, kk, x, y,
        RED = FILTER.CHANNEL.R,
        GREEN = FILTER.CHANNEL.G,
        BLUE = FILTER.CHANNEL.B,
        ALPHA = FILTER.CHANNEL.A,
        l = im.length, total = (l>>>2),
        w4 = w*4, w256 = w*256,
        minr = 255, maxr = 0,
        ming = 255, maxg = 0,
        minb = 255, maxb = 0,
        sumr = new A32F(256), sumg, sumb,
        hr = new A32F(256*total), hg, hb;

    if (null == channel)
    {
        sumg = new A32F(256);
        sumb = new A32F(256);
        hg = new A32F(256*total);
        hb = new A32F(256*total);
        for (x=0,y=0,j=0; j<256; ++j)
        {
            hr[0+j] = 0;
            hg[0+j] = 0;
            hb[0+j] = 0;
        }
        if (0 < im[0+ALPHA])
        {
            r = im[0+RED];
            g = im[0+GREEN];
            b = im[0+BLUE];
            hr[0+r] = 1;
            hg[0+g] = 1;
            hb[0+b] = 1;
            minr = Min(r, minr);
            maxr = Max(r, maxr);
            ming = Min(g, ming);
            maxg = Max(g, maxg);
            minb = Min(b, minb);
            maxb = Max(b, maxb);
        }
        for (x=1,y=0,i=4,k=256; i<w4; ++x,i+=4,k+=256)
        {
            for (kk=k-256,j=0; j<256; ++j)
            {
                hr[k+j] = hr[kk+j];
                hg[k+j] = hg[kk+j];
                hb[k+j] = hb[kk+j];
            }
            if (0 < im[i+ALPHA])
            {
                r = im[i+RED];
                g = im[i+GREEN];
                b = im[i+BLUE];
                ++hr[k+r];
                ++hg[k+g];
                ++hb[k+b];
                minr = Min(r, minr);
                maxr = Max(r, maxr);
                ming = Min(g, ming);
                maxg = Max(g, maxg);
                minb = Min(b, minb);
                maxb = Max(b, maxb);
            }
        }
        for (x=0,y=1,i=w4,k=w256; i<l; ++x,i+=4,k+=256)
        {
            if (x >= w)
            {
                x=0; ++y;
                for (j=0; j<256; ++j) sumr[j] = sumg[j] = sumb[j] = 0;
            }
            for (kk=k-w256,j=0; j<256; ++j)
            {
                hr[k+j] = hr[kk+j] + (sumr[j]||0);
                hg[k+j] = hg[kk+j] + (sumg[j]||0);
                hb[k+j] = hb[kk+j] + (sumb[j]||0);
            }
            if (0 < im[i+ALPHA])
            {
                r = im[i+RED];
                g = im[i+GREEN];
                b = im[i+BLUE];
                ++hr[k+r];
                ++hg[k+g];
                ++hb[k+b];
                sumr[r] = (sumr[r]||0) + 1;
                sumg[g] = (sumg[g]||0) + 1;
                sumb[b] = (sumb[b]||0) + 1;
                minr = Min(r, minr);
                maxr = Max(r, maxr);
                ming = Min(g, ming);
                maxg = Max(g, maxg);
                minb = Min(b, minb);
                maxb = Max(b, maxb);
            }
        }
        // pdfs only
        return {bin:[hr,hg,hb], min:[minr,ming,minb], max:[maxr,maxg,maxb], width:w, height:h, total:total};
    }
    else
    {
        channel = channel || 0;
        for (x=0,y=0,j=0; j<256; ++j) hr[0+j] = 0;
        if (0 < im[0+ALPHA])
        {
            r = im[i+channel];
            hr[0+r] = 1;
            minr = Min(r, minr);
            maxr = Max(r, maxr);
        }
        for (x=1,y=0,i=4,k=256; i<w4; ++x,i+=4,k+=256)
        {
            for (kk=k-256,j=0; j<256; ++j) hr[k+j] = hr[kk+j];
            if (0 < im[i+ALPHA])
            {
                r = im[i+channel];
                ++hr[k+r];
                minr = Min(r, minr);
                maxr = Max(r, maxr);
            }
        }
        for (x=0,y=1,i=w4,k=w256; i<l; ++x,i+=4,k+=256)
        {
            if (x >= w)
            {
                x=0; ++y;
                for (j=0; j<256; ++j) sumr[j] = 0;
            }
            for (kk=k-w256,j=0; j<256; ++j) hr[k+j] = hr[kk+j] + (sumr[j]||0);
            if (0 < im[i+ALPHA])
            {
                r = im[i+channel];
                ++hr[k+r]; sumr[r] = (sumr[r]||0) + 1;
                minr = Min(r, minr);
                maxr = Max(r, maxr);
            }
        }
        // pdf only
        return {bin:hr, channel:channel, min:minr, max:maxr, width:w, height:h, total:total};
    }
}
function match_histogram(l, actual_cdf, desired_cdf, min0, max0)
{
    if (null == min0) {min0 = 0; max0 = 255;}
    var i, j, jprev, min, max, diff, count, match;
    if (l === (+l))
    {
        min = min0;
        max = max0;
        i = l;
        j = i;
        jprev = j;
        for (;;)
        {
            // binary search, O(log(256))=O(8) thus O(1)
            diff = desired_cdf[j] - actual_cdf[i];
            if (0 === diff) return j;
            else if (0 > diff) min = j;
            else max = j;
            j = (min + max) >>> 1;
            if (jprev === j || min >= max) return j;
            jprev = j;
        }
    }
    else
    {
        // binary search, O(256*log(256))=O(256*8) thus O(1)
        count = max0 - min0 + 1;
        match = l && (count <= l.length) ? l : (new A8U(count));
        for (i=min0; i<=max0; ++i)
        {
            min = min0;
            max = max0;
            j = i;
            jprev = j;
            for (;;)
            {
                diff = desired_cdf[j] - actual_cdf[i];
                if (0 === diff) break;
                else if (0 > diff) min = j;
                else max = j;
                j = (min + max) >>> 1;
                if (jprev === j || min >= max) break;
                jprev = j;
            }
            match[i-min0] = j;
        }
        return match;
    }
}
function _otsu(bin, tot, min, max, ret_sigma)
{
    var omega0, omega1,
        mu0, mu1, mu,
        sigmat, sigma,
        sum0, isum0, i, t;

    if (min >= max) return true === ret_sigma ? [min, 0] : min;
    for (mu=0,i=min; i<=max; ++i) mu += i*bin[i]/tot;
    t = min;
    sum0 = bin[min];
    isum0 = min*bin[min]/tot;
    omega0 = sum0/tot;
    omega1 = 1-omega0;
    mu0 = isum0/omega0;
    mu1 = (mu - isum0)/omega1;
    sigmat = omega0*omega1*Pow(mu1 - mu0, 2);
    for (i=min+1; i<=max; ++i)
    {
        sum0 += bin[i];
        isum0 += i*bin[i]/tot;
        omega0 = sum0/tot;
        omega1 = 1-omega0;
        mu0 = isum0/omega0;
        mu1 = (mu - isum0)/omega1;
        sigma = omega0*omega1*Pow(mu1 - mu0, 2);
        if (sigma > sigmat)
        {
            sigmat = sigma;
            t = i;
        }
    }
    return true === ret_sigma ? [t, sigmat] : t;
}
function otsu(bin, tot, min, max)
{
    if (null == min) min = 0;
    if (null == max) max = 255;
    return _otsu(bin, tot, min, max);
}
function otsu_multi(bin, tot, min, max, sigma_thresh)
{
    if (min >= max) return [];
    var split = _otsu(bin, tot, min, max, true), thresh = split[0], sigma = split[1], left, right;
    if (sigma < sigma_thresh*sigma_thresh) return [];
    left = otsu_multi(bin, tot, min, thresh, sigma_thresh);
    if (!left.length || left[left.length-1] < thresh) left.push(thresh);
    right = otsu_multi(bin, tot, thresh, max, sigma_thresh);
    if (right.length && right[0] === thresh) right.shift();
    left.push.apply(left, right);
    return left;
}
function otsu_multiclass(bin, tot, min, max, n)
{
    if (n <= 1 || min >= max) return [];
    var thresh = _otsu(bin, tot, min, max), f, left, right;
    n = stdMath.round(n);
    if (2 === n) return [thresh];
    f = (thresh-min)/(max-min);
    left = otsu_multiclass(bin, tot, min, thresh, stdMath.round((n-1)*(f)));
    right = otsu_multiclass(bin, tot, thresh, max, stdMath.round((n-1)*(1-f)));
    if (!left.length || left[left.length-1] < thresh) left.push(thresh);
    if (right.length && right[0] === thresh) right.shift();
    left.push.apply(left, right);
    return left;
}
var SIN = {}, COS = {};
function sine(i)
{
    var sin_i;
    /*if (i < 500)
    {*/
        sin_i = SIN[i];
        if (null == sin_i) SIN[i] = sin_i = stdMath.sin(PI/i);
        return sin_i;
    /*}
    return stdMath.sin(PI/i);*/
}
function cosine(i)
{
    var cos_i;
    /*if (i < 500)
    {*/
        cos_i = COS[i];
        if (null == cos_i) COS[i] = cos_i = stdMath.cos(PI/i);
        return cos_i;
    /*}
    return stdMath.cos(PI/i);*/
}
function bitrevidx(idx, n)
{
    var rev_idx = 0;

    while (1 < n)
    {
        rev_idx <<= 1;
        rev_idx += idx & 1;
        idx >>= 1;
        n >>= 1;
    }
    return rev_idx;
}
function bitrev(re, im, re2, im2, n)
{
    var done = {}, i, j, t;

    for (i = 0; i < n; ++i)
    {
        if (1 === done[i]) continue;

        j = bitrevidx(i, n);

        t = re[j];
        re2[j] = re[i];
        re2[i] = t;
        t = im[j];
        im2[j] = im[i];
        im2[i] = t;

        done[j] = 1;
    }
}
function first_odd_fac(n)
{
    var sqrt_n = stdMath.sqrt(n), f = 3;

    while (f <= sqrt_n)
    {
        if (0 === (n % f)) return f;
        f += 2;
    }
    return n;
}
function _fft1(re, im, n, inv, output_re, output_im)
{
    // adapted from https://github.com/dntj/jsfft
    if (0 >= n) return;
    var ret = false;
    if (null == output_re)
    {
        output_re = (new re.constructor(n));
        output_im = (new im.constructor(n));
        ret = true;
    }
    if (n & (n - 1)) _fft1_r(re, im, n, inv, output_re, output_im)
    else _fft1_i(re, im, n, inv, output_re, output_im);
    if (ret) return {r:output_re, i:output_im};
}
function _fft1_r(re, im, n, inv, output_re, output_im)
{
    var i, j, t;
    if (1 === n)
    {

        output_re[0] = (re[0] || 0);
        output_im[0] = (im[0] || 0);
        return;
    }
    for (i = 0; i < n; ++i)
    {
        output_re[i] = 0/*re[i]*/;
        output_im[i] = 0/*im[i]*/;
    }

    // Use the lowest odd factor, so we are able to use _fft_i in the
    // recursive transforms optimally.
    var p = first_odd_fac(n), m = n / p,
        normalisation = 1 / stdMath.sqrt(p),
        recursive_result_re = new re.constructor(m),
        recursive_result_im = new im.constructor(m),
        recursive_result2_re = new re.constructor(m),
        recursive_result2_im = new im.constructor(m),
        del_f_r, del_f_i, f_r, f_i, _real, _imag;

    // Loops go like O(n Σ p_i), where p_i are the prime factors of n.
    // for a power of a prime, p, this reduces to O(n p log_p n)
    for (j = 0; j < p; ++j)
    {
        for (i = 0; i < m; ++i)
        {
            recursive_result_re[i] = (re[i * p + j] || 0);
            recursive_result_im[i] = (im[i * p + j] || 0);
        }
        // Don't go deeper unless necessary to save allocs.
        if (m > 1)
        {
            _fft1(recursive_result_re, recursive_result_im, m, inv, recursive_result2_re, recursive_result2_im);
            t = recursive_result_re;
            recursive_result_re = recursive_result2_re;
            recursive_result2_re = t;
            t = recursive_result_im;
            recursive_result_im = recursive_result2_im;
            recursive_result2_im = t;
        }

        del_f_r = stdMath.cos(2*PI*j/n);
        del_f_i = (inv ? -1 : 1) * stdMath.sin(2*PI*j/n);
        f_r = 1;
        f_i = 0;

        for (i = 0; i < n; ++i)
        {
            _real = normalisation * recursive_result_re[i % m];
            _imag = normalisation * recursive_result_im[i % m];

            output_re[i] += (f_r * _real - f_i * _imag);
            output_im[i] += (f_r * _imag + f_i * _real);

            _real = f_r * del_f_r - f_i * del_f_i;
            _imag = f_i = f_r * del_f_i + f_i * del_f_r;
            f_r = _real;
            f_i = _imag;
        }
    }

    /*for (i = 0; i < n; ++i)
    {
        output_re[i] *= normalisation;
        output_im[i] *= normalisation;
    }*/
}
function _fft1_i(re, im, n, inv, output_re, output_im)
{
    // Loops go like O(n log n):
    //   w ~ log n; i,j ~ n
    var w = 1, del_f_r, del_f_i, i, k, j, t, s,
        f_r, f_i, l_index, r_index,
        left_r, left_i, right_r, right_i;
    bitrev(re, im, output_re, output_im, n);
    while (w < n)
    {
        del_f_r = cosine(w);
        del_f_i = (inv ? -1 : 1) * sine(w);
        k = n/(2*w);
        for (i = 0; i < k; ++i)
        {
            f_r = 1;
            f_i = 0;
            for (j = 0; j < w; ++j)
            {
                l_index = 2*i*w + j;
                r_index = l_index + w;

                left_r = (output_re[l_index] || 0);
                left_i = (output_im[l_index] || 0);
                t = (output_re[r_index] || 0);
                s = (output_im[r_index] || 0);
                right_r = f_r * t - f_i * s;
                right_i = f_i * t + f_r * s;

                output_re[l_index] = SQRT1_2 * (left_r + right_r);
                output_im[l_index] = SQRT1_2 * (left_i + right_i);
                output_re[r_index] = SQRT1_2 * (left_r - right_r);
                output_im[r_index] = SQRT1_2 * (left_i - right_i);

                t = f_r * del_f_r - f_i * del_f_i;
                s = f_r * del_f_i + f_i * del_f_r;
                f_r = t;
                f_i = s;
            }
        }
        w <<= 1;
    }
}
function _fft2(re, im, nx, ny, inv, output_re, output_im)
{
    // adapted from https://github.com/dntj/jsfft
    if (0 >= nx || 0 >= ny) return;
    var ret = false,
        RE = re.constructor, IM = im.constructor,
        n = nx * ny, i, j, jn,
        row_re = new RE(nx), row_im = new IM(nx),
        col_re = new RE(ny), col_im = new IM(ny),
        frow_re = new RE(nx), frow_im = new IM(nx),
        fcol_re = new RE(ny), fcol_im = new IM(ny);

    if (null == output_re)
    {
        output_re = new RE(n);
        output_im = new IM(n);
        ret = true;
    }
    for (j = 0,jn = 0; j < ny; ++j,jn+=nx)
    {
        for (i = 0; i < nx; ++i)
        {
            row_re[i] = (re[i + jn] || 0);
            row_im[i] = (im[i + jn] || 0);
        }
        _fft1(row_re, row_im, nx, inv, frow_re, frow_im);
        for (i = 0; i < nx; ++i)
        {
            output_re[i + jn] = frow_re[i];
            output_im[i + jn] = frow_im[i];
        }
    }
    for (i = 0; i < nx; ++i)
    {
        for (j = 0,jn = 0; j < ny; ++j,jn+=nx)
        {
            col_re[j] = output_re[i + jn];
            col_im[j] = output_im[i + jn];
        }
        _fft1(col_re, col_im, ny, inv, fcol_re, fcol_im);
        for (j = 0,jn = 0; j < ny; ++j,jn+=nx)
        {
            output_re[i + jn] = fcol_re[j];
            output_im[i + jn] = fcol_im[j];
        }
    }

    if (ret) return {r:output_re, i:output_im};
}
function min_max_loc(data, w, h, tlo, thi, hasMin, hasMax, stride, offset)
{
    stride = stride || 0; offset = offset || 0;
    var k, l = data.length, ki = (1 << stride), x, y, d,
        min = Infinity, max = -Infinity,
        minpos, maxpos, minc = 0, maxc = 0;
    if (hasMin) minpos = new Array(l >>> stride);
    if (hasMax) maxpos = new Array(l >>> stride);
    for (k=0,y=0,x=0; k<l; k+=ki,++x)
    {
        if (x >= w) {x=0; ++y};
        d = data[k+offset];
        if (hasMin && (d <= min) && (null == tlo || d <= tlo))
        {
            if (d < min) {min = d; minc = 0;}
            minpos[minc++] = {x:x, y:y};
        }
        if (hasMax && (d >= max) && (null == thi || d >= thi))
        {
            if (d > max) {max = d; maxc = 0;}
            maxpos[maxc++] = {x:x, y:y};
        }
    }
    if (hasMin && hasMax)
    {
        minpos.length = minc;
        maxpos.length = maxc;
        return {min:min, minpos:minpos, max:max, maxpos:maxpos};
    }
    else if (hasMin)
    {
        minpos.length = minc;
        return {min:min, minpos:minpos};
    }
    else if (hasMax)
    {
        maxpos.length = maxc;
        return {max:max, maxpos:maxpos};
    }
}
function local_max(max, accum, thresh, N, M, K)
{
    max = max || [];
    var count, MK, index, value;
    if (null == M)
    {
        // 1-D: N cols
        for (count=N,index=0; index<count; ++index)
        {
            value = accum[index];
            if (
            value > thresh &&
            (0 > index-1 || value > accum[index-1]) &&
            (count <= index+1 || value >= accum[index+1])
            )
            {
                max.push(index);
            }
        }
    }
    else if (null == K)
    {
        // 2-D: N rows of M cols each
        for (count=N*M,index=0; index<count; ++index)
        {
            value = accum[index];
            if (
            value > thresh &&
            (0 > index-1 || value > accum[index-1]) &&
            (count <= index+1 || value >= accum[index+1]) &&
            (0 > index-M || value > accum[index-M]) &&
            (count <= index+M || value >= accum[index+M])
            )
            {
                max.push(index);
            }
        }
    }
    else
    {
        // 3-D: N rows of M*K cols each, M cols of K items each
        for (MK=M*K,count=N*MK,index=0; index<count; ++index)
        {
            value = accum[index];
            if (
            value > thresh &&
            (0 > index-1 || value > accum[index-1]) &&
            (count <= index+1 || value >= accum[index+1]) &&
            (0 > index-K || value > accum[index-K]) &&
            (count <= index+K || value >= accum[index+K]) &&
            (0 > index-MK || value > accum[index-MK]) &&
            (count <= index+MK || value >= accum[index+MK])
            )
            {
                max.push(index);
            }
        }
    }
    return max;
}
function nonzero_pixels(im, w, h, channel)
{
    channel = channel || 0;
    var nz = new Array(w*h), i, k, l, x, y;
    for (k=0,y=0,x=0,i=0,l=im.length; i<l; i+=4,++x)
    {
        if (x >= w) {x=0; ++y};
        if (im[i+channel] && im[i+3]) nz[k++] = {x:x, y:y};
    }
    nz.length = k;
    return nz;
}

function equals(r1, r2, eps)
{
    var delta = eps * (stdMath.min(r1.width, r2.width) + stdMath.min(r1.height, r2.height)) * 0.5;
    return stdMath.abs(r1.x - r2.x) <= delta &&
        stdMath.abs(r1.y - r2.y) <= delta &&
        stdMath.abs(r1.x + r1.width - r2.x - r2.width) <= delta &&
        stdMath.abs(r1.y + r1.height - r2.y - r2.height) <= delta;
}
function is_inside(r1, r2, eps)
{
    var dx = r2.width * eps, dy = r2.height * eps;
    return (r1.x >= r2.x - dx) &&
        (r1.y >= r2.y - dy) &&
        (r1.x + r1.width <= r2.x + r2.width + dx) &&
        (r1.y + r1.height <= r2.y + r2.height + dy);
}
function add(r1, r2)
{
    r1.x += r2.x;
    r1.y += r2.y;
    r1.width += r2.width;
    r1.height += r2.height;
    if (null != r2.score) r1.score = (r1.score||0) + r2.score;
    return r1;
}
function snap_to_grid(r)
{
    r.x = stdMath.round(r.x);
    r.y = stdMath.round(r.y);
    r.width = stdMath.round(r.width);
    r.height = stdMath.round(r.height);
    r.area = r.width*r.height;
    return r;
}
function merge_features(rects, min_neighbors, epsilon)
{
    if (!rects || !rects.length) return rects;
    var rlen = rects.length, ref = new Array(rlen), feats = [],
        nb_classes = 0, neighbors, r, found = false, i, j, n, t, ri;

    // original code
    // find number of neighbour classes
    for (i = 0; i < rlen; ++i) ref[i] = 0;
    for (i = 0; i < rlen; ++i)
    {
        found = false;
        for (j = 0; j < i; ++j)
        {
            if (equals(rects[j], rects[i], epsilon))
            {
                found = true;
                ref[i] = ref[j];
            }
        }

        if (!found)
        {
            ref[i] = nb_classes;
            ++nb_classes;
        }
    }

    // merge neighbor classes
    neighbors = new Array(nb_classes);  r = new Array(nb_classes);
    for (i = 0; i < nb_classes; ++i) {neighbors[i] = 0;  r[i] = {x:0,y:0,width:0,height:0};}
    for (i = 0; i < rlen; ++i) {ri=ref[i]; ++neighbors[ri]; add(r[ri], rects[i]);}
    for (i = 0; i < nb_classes; ++i)
    {
        n = neighbors[i];
        if (n >= min_neighbors)
        {
            t = 1/(n + n);
            ri = {
                x:t*(r[i].x * 2 + n),  y:t*(r[i].y * 2 + n),
                width:t*(r[i].width * 2 + n),  height:t*(r[i].height * 2 + n)
            };
            if (null != r[i].score) ri.score = r[i].score/n;

            feats.push(ri);
        }
    }

    // filter inside rectangles
    rlen = feats.length;
    for (i=0; i<rlen; ++i)
    {
        for (j=i+1; j<rlen; ++j)
        {
            if (!feats[i].isInside && is_inside(feats[i], feats[j], epsilon))
                feats[i].isInside = true;
            if (!feats[j].isInside && is_inside(feats[j], feats[i], epsilon))
                feats[j].isInside = true;
        }
    }
    i = rlen;
    while (--i >= 0)
    {
        if (feats[i].isInside) feats.splice(i, 1);
        else snap_to_grid(feats[i]);
    }

    return feats/*.sort(by_area)*/;
}
function clmp(x, a, b)
{
    return a > b ? (x < b ? b : (x > a ? a : x)) : (x < a ? a : (x > b ? b : x));
}
function intersect_x(y, x1, y1, x2, y2)
{
    return y2 === y1 ? (y === y1 ? x2 : null) : stdMath.round((y2-y)*(x2-x1)/(y2-y1)+x1);
}
function intersect_y(x, x1, y1, x2, y2)
{
    return x2 === x1 ? (x === x1 ? y2 : null) : stdMath.round((x2-x)*(y2-y1)/(x2-x1)+y1);
}
function satsum(sat, w, h, x0, y0, x1, y1)
{
    // exact sat sum of axis-aligned rectangle defined by p0, p1 (top left, bottom right)
    if (w <= 0 || h <= 0 || y1 < y0 || x1 < x0 || y1 < 0 || x1 < 0) return 0;
    var w1 = w-1, h1 = h-1;
    x0 = 0>x0 ? 0 : (w1<x0 ? w1 : x0);
    y0 = 0>y0 ? 0 : (h1<y0 ? h1 : y0);
    x1 = 0>x1 ? 0 : (w1<x1 ? w1 : x1);
    y1 = 0>y1 ? 0 : (h1<y1 ? h1 : y1);
    if (!sat) return (y1-y0+1)*(x1-x0+1);
    x0 -= 1; y0 -= 1;
    var wy0 = w*y0, wy1 = w*y1;
    return sat[x1 + wy1] - (0>x0 ? 0 : sat[x0 + wy1]) - (0>y0 ? 0 : sat[x1 + wy0]) + (0>x0 || 0>y0 ? 0 : sat[x0 + wy0]);
}
function satsums(o, w, h, x0, y0, x1, y1, f)
{
    //if (null == f) f = 1;
    o.area += f*satsum(null, w, h, x0, y0, x1, y1);
    o.sum  += f*satsum(o.sat, w, h, x0, y0, x1, y1);
    if (o.sat2) o.sum2 += f*satsum(o.sat2, w, h, x0, y0, x1, y1);
}
/*function satsumt_k(o, w, h, k, xm, ym, xM, yM, dx, dy, pm, pM, f)
{
    // axis-aligned right triangle satsum by optimal subdivision into k rectangular stripes
    var i, d, p, y, x, dp = pM-pm;
    if (dx > dy)
    {
        //subdivide along y
        d = stdMath.max(1, stdMath.round((dy-k+1)/k)||0);
        for (i=1,p=ym,y=stdMath.min(p+d, yM); i<=k; ++i)
        {
            x = stdMath.round(pm + ((y-ym)/dy)*dp);
            satsums(o, w, h, stdMath.min(pm, x), p, stdMath.max(pm, x), y, f);
            if (y >= yM) return;
            p = stdMath.min(y+1, yM);
            y = stdMath.min(p+d, yM);
        }
        if (y < yM)
        {
            satsums(o, w, h, stdMath.min(pm, pM), y+1, stdMath.max(pm, pM), yM, f);
        }
    }
    else
    {
        //subdivide along x
        d = stdMath.max(1, stdMath.round((dx-k+1)/k)||0);
        for (i=1,p=xm,x=stdMath.min(p+d, xM); i<=k; ++i)
        {
            y = stdMath.round(pm + ((x-xm)/dx)*dp);
            satsums(o, w, h, p, stdMath.min(pm, y), x, stdMath.max(pm, y), f);
            if (x >= xM) return;
            p = stdMath.min(x+1, xM);
            x = stdMath.min(p+d, xM);
        }
        if (x < xM)
        {
            satsums(o, w, h, x+1, stdMath.min(pm, pM), xM, stdMath.max(pm, pM), f);
        }
    }
}*/
function satsumt_kk(o, w, h, k, xm, ym, xM, yM, dx, dy, sgn, p0, o0, f)
{
    // axis-aligned right triangle satsum by optimal subdivision into k rectangular stripes
    var i, d, yp, y, xp, x;
    if (dx > dy)
    {
        //subdivide along y
        d = stdMath.max(1, stdMath.round((dy-k+1)/k)||0);
        for (i=1,yp=ym,y=stdMath.min(yp+d, yM); i<=k; ++i)
        {
            x = stdMath.round(p0 + sgn*((y-ym)/dy)*dx);
            satsums(o, w, h, stdMath.min(x, o0), yp, stdMath.max(x, o0), y, f);
            if (y >= yM) return;
            yp = stdMath.min(y+1, yM);
            y = stdMath.min(yp+d, yM);
        }
        if (y < yM)
        {
            ++y;
            x = stdMath.round(p0 + sgn*((y-ym)/dy)*dx);
            satsums(o, w, h, stdMath.min(x, o0), y, stdMath.max(x, o0), yM, f);
        }
    }
    else
    {
        //subdivide along x
        d = stdMath.max(1, stdMath.round((dx-k+1)/k)||0);
        for (i=1,xp=xm,x=stdMath.min(xp+d, xM); i<=k; ++i)
        {
            y = stdMath.round(p0 + sgn*((x-xm)/dx)*dy);
            satsums(o, w, h, xp, stdMath.min(y, o0), x, stdMath.max(y, o0), f);
            if (x >= xM) return;
            xp = stdMath.min(x+1, xM);
            x = stdMath.min(xp+d, xM);
        }
        if (x < xM)
        {
            ++x;
            y = stdMath.round(p0 + sgn*((x-xm)/dx)*dy);
            satsums(o, w, h, x, stdMath.min(y, o0), xM, stdMath.max(y, o0), f);
        }
    }
}
function satsumt(o, w, h, x0, y0, x1, y1, x2, y2, k, f)
{
    // approximate sat sum of axis-aligned right triangle defined by p0, p1, p2
    if (w <= 0 || h <= 0) return;
    //if (null == f) f = 1;
    var xm = stdMath.min(x0, x1, x2),
        ym = stdMath.min(y0, y1, y2),
        xM = stdMath.max(x0, x1, x2),
        yM = stdMath.max(y0, y1, y2),
        dx = xM - xm, dy = yM - ym,
        p0, pb, sgn, xmM, ymM,
        xym, xyM, yxm, yxM;

    k = k || 0;
    if (!dx || !dy)
    {
        // zero triangle area
    }
    else if (k <= 1)
    {
        //simplest approximation, half of enclosing rectangle sum
        satsums(o, w, h, xm, ym, xM, yM, f/2);
    }
    /*else if (dx > dy)
    {
        //better approximation, subdivide along y
        if (y0 === ym)
        {
            if (y1 === ym) xym = x2 === xm ? xM : xm;
            else if (y2 === ym) xym = x1 === xm ? xM : xm;
            else xym = x0;
        }
        else if (y1 === ym)
        {
            if (y2 === ym) xym = x0 === xm ? xM : xm;
            else xym = x1;
        }
        else
        {
            xym = x2;
        }
        if (y0 === yM)
        {
            if (y1 === yM) xyM = x2 === xm ? xM : xm;
            else if (y2 === yM) xyM = x1 === xm ? xM : xm;
            else xyM = x0;
        }
        else if (y1 === yM)
        {
            if (y2 === yM) xyM = x0 === xm ? xM : xm;
            else xyM = x1;
        }
        else
        {
            xyM = x2;
        }
        satsumt_k(o, w, h, k, xm, ym, xM, yM, dx, dy, xym, xyM, f);
    }
    else if (dx <= dy)
    {
        //better approximation, subdivide along x
        if (x0 === xm)
        {
            if (x1 === xm) yxm = y2 === ym ? yM : ym;
            else if (x2 === xm) yxm = y1 === ym ? yM : ym;
            else yxm = y0;
        }
        else if (x1 === xm)
        {
            if (x2 === xm) yxm = y0 === ym ? yM : ym;
            else yxm = y1;
        }
        else
        {
            yxm = y2;
        }
        if (x0 === xM)
        {
            if (x1 === xM) yxM = y2 === ym ? yM : ym;
            else if (x2 === xM) yxM = y1 === ym ? yM : ym;
            else yxM = y0;
        }
        else if (x1 === xM)
        {
            if (x2 === xM) yxM = y0 === ym ? yM : ym;
            else yxM = y1;
        }
        else
        {
            yxM = y2;
        }
        satsumt_k(o, w, h, k, xm, ym, xM, yM, dx, dy, yxm, yxM, f);
    }*/
    else
    {
        if ((y0 === ym) && ((y1 === yM && x1 === x0) || (y2 === yM && x2 === x0))) xmM = x0;
        else if ((y1 === ym) && ((y0 === yM && x0 === x1) || (y2 === yM && x2 === x1))) xmM = x1;
        else /*if ((y2 === ym) && ((y0 === yM && x0 === x2) || (y1 === yM && x1 === x2)))*/ xmM = x2;

        if ((x0 === xm) && ((x1 === xM && y1 === y0) || (x2 === xM && y2 === y0))) ymM = y0;
        else if ((x1 === xm) && ((x0 === xM && y0 === y1) || (x2 === xM && y2 === y1))) ymM = y1;
        else /*if ((x2 === xm) && ((x0 === xM && y0 === y2) || (x1 === xM && y1 === y2)))*/ ymM = y2;

        // 4 cases of axis-aligned right triangles
        if (xmM === xm && ymM === ym)
        {
            /*
             _
            | /
            |/

            */
            if (dx > dy)
            {
                p0 = xM;
                pb = xm;
                sgn = -1;
            }
            else
            {
                p0 = yM;
                pb = ym;
                sgn = -1;
            }
        }
        else if (xmM === xM && ymM === yM)
        {
            /*

             /|
            /_|

            */
            if (dx > dy)
            {
                p0 = xM;
                pb = xM;
                sgn = -1;
            }
            else
            {
                p0 = yM;
                pb = yM;
                sgn = -1;
            }
        }
        else if (xmM === xM && ymM === ym)
        {
            /*
             _
            \ |
             \|

            */
            if (dx > dy)
            {
                p0 = xm;
                pb = xM;
                sgn = 1;
            }
            else
            {
                p0 = ym;
                pb = ym;
                sgn = 1;
            }
        }
        else //if (xmM === xm && ymM === yM)
        {
            /*

            |\
            |_\

            */
            if (dx > dy)
            {
                p0 = xm;
                pb = xm;
                sgn = 1;
            }
            else
            {
                p0 = ym;
                pb = yM;
                sgn = 1;
            }
        }
        //better approximation, subdivide along y or x
        satsumt_kk(o, w, h, k, xm, ym, xM, yM, dx, dy, sgn, p0, pb, f);
    }
}
function satsumr(o, w, h, x1, y1, x2, y2, x3, y3, x4, y4, k)
{
    // approximate sat sum for arbitrary rotated rectangle defined (clockwise) by p1 to p4
    if (w <= 0 || h <= 0) return;
    var xm = stdMath.min(x1, x2, x3, x4),
        ym = stdMath.min(y1, y2, y3, y4),
        xM = stdMath.max(x1, x2, x3, x4),
        yM = stdMath.max(y1, y2, y3, y4),
        xi1, xi2, yi1, yi2,
        xr1, yr1, xr2, yr2,
        xc1, xc2, yc1, yc2;
    // (xm,ym), (xM,yM) is the normal rectangle enclosing the rotated rectangle
    // (min(xi1, xi2),min(yi1, yi2)), (max(xi1, xi2),max(yi1, yi2)) is the maximum normal rectangle enclosed by the rotated rectangle computed by satsum
    // the rest of the rotated rectangle are axis-aligned right triangles computed approximately by satsumt
    if (xm >= xM || ym >= yM || stdMath.abs(y1-y2) <= 1 || stdMath.abs(y2-y3) <= 1 || stdMath.abs(y3-y4) <= 1 || stdMath.abs(y4-y1) <= 1)
    {
        // axis-aligned unrotated or degenerate rectangle
        satsums(o, w, h, xm, ym, xM, yM, 1);
    }
    else
    {
        if (y1 === ym) xi1 = x1;
        else if (y2 === ym) xi1 = x2;
        else if (y3 === ym) xi1 = x3;
        else xi1 = x4;
        if (y1 === yM) xi2 = x1;
        else if (y2 === yM) xi2 = x2;
        else if (y3 === yM) xi2 = x3;
        else xi2 = x4;
        if (x1 === xm) yi1 = y1;
        else if (x2 === xm) yi1 = y2;
        else if (x3 === xm) yi1 = y3;
        else yi1 = y4;
        if (x1 === xM) yi2 = y1;
        else if (x2 === xM) yi2 = y2;
        else if (x3 === xM) yi2 = y3;
        else yi2 = y4;
        xr1 = stdMath.min(xi1, xi2); yr1 = stdMath.min(yi1, yi2);
        xr2 = stdMath.max(xi1, xi2); yr2 = stdMath.max(yi1, yi2);
        if ((yi1 >= yi2 && xi1 <= xi2) || (yi1 <= yi2 && xi1 >= xi2))
        {
            // can be subdivided into 1 enclosed center rectangle + 4 right triangles axis-aligned
            satsums(o, w, h, xr1, yr1, xr2, yr2, 1); // center
            if (xi1 <= xi2)
            {
                satsumt(o, w, h, xm, yi1, xi1, ym, xi1, yi1, k, 1); // left
                satsumt(o, w, h, xi1, ym, xM, yi2, xi1, yi2, k, 1); // top
                satsumt(o, w, h, xM, yi2, xi2, yM, xi2, yi2, k, 1); // right
                satsumt(o, w, h, xi2, yM, xm, yi1, xi2, yi1, k, 1); // bottom
                // remove common area computed multiple times
                satsums(o, w, h, xi1, ym, xi1, yi1, -1);
                satsums(o, w, h, xm, yi1, xi1, yi1, -1);
                satsums(o, w, h, xi2, yi2, xi2, yM, -1);
                satsums(o, w, h, xi2, yi2, xM, yi2, -1);
            }
            else
            {
                satsumt(o, w, h, xm, yi1, xi2, yi1, xi2, yM, k, 1); // left
                satsumt(o, w, h, xm, yi1, xi1, ym, xi1, yi1, k, 1); // top
                satsumt(o, w, h, xi1, ym, xM, yi2, xi1, yi2, k, 1); // right
                satsumt(o, w, h, xi2, yM, xi2, yi2, xM, yi2, k, 1); // bottom
                // remove common area computed multiple times
                satsums(o, w, h, xi1, ym, xi1, yi2, -1);
                satsums(o, w, h, xi2, yi2, xM, yi2, -1);
                satsums(o, w, h, xi2, yi1, xi2, yM, -1);
                satsums(o, w, h, xm, yi1, xi1, yi1, -1);
            }
            // add area removed more than once
            satsums(o, w, h, xr1, yr1, xr1, yr1, 1);
            satsums(o, w, h, xr1, yr2, xr1, yr2, 1);
            satsums(o, w, h, xr2, yr2, xr2, yr2, 1);
            satsums(o, w, h, xr2, yr1, xr2, yr1, 1);
        }
        else
        {
            /*
            // can be subdivided into 3 rectangles + 8 right triangles axis-aligned
            if (xi1 <= xi2)
            {
                xc1 = intersect_x(yi2, xm, yi1, xi2, yM);
                yc1 = intersect_y(xi1, xm, yi1, xi2, yM);
                xc2 = intersect_x(yi1, xM, yi2, xi1, ym);
                yc2 = intersect_y(xi2, xM, yi2, xi1, ym);
                satsumt(o, w, h, xi1, ym, xc2, yi1, xi1, yi1, k, 1); // right top
                satsumt(o, w, h, xm, yi1, xi1, ym, xi1, yi1, k, 1); // left top
                satsumt(o, w, h, xm, yi1, xi1, yi1, xi1, yc1, k, 1); // left bottom
                satsums(o, w, h, xm, yi1, xi1, yi1, -1); // remove common area
                satsums(o, w, h, xi1, ym, xi1, yi1, -1); // remove common area
                satsumt(o, w, h, xi1, yc1, xc1, yc1, xc1, yi2, k, 1); // inside left
                satsumt(o, w, h, xc2, yi1, xi2, yc2, xc2, yc2, k, 1); // inside right
                satsumt(o, w, h, xi2, yi2, xi2, yc2, xM, yi2, k, 1); // right top
                satsumt(o, w, h, xc1, yi2, xi2, yi2, xi2, yM, k, 1); // left bottom
                satsumt(o, w, h, xi2, yi2, xM, yi2, xi2, yM, k, 1); // right bottom
                satsums(o, w, h, xi2, yi2, xM, yi2, -1); // remove common area
                satsums(o, w, h, xi2, yi2, xi2, yM, -1); // remove common area
                satsums(o, w, h, xc1, yi1, xc2, yi2, 1); // center
                satsums(o, w, h, xc1, yc1, xc1, yi2, -1); // remove common area
                satsums(o, w, h, xc2, yi1, xc2, yc2, -1); // remove common area
                if (yi1 < yc1)
                {
                    satsums(o, w, h, xi1+1, yi1+1, xc1-1, yc1-1, 1); // center left
                }
                else
                {
                    satsums(o, w, h, xi1, yi1, xc2, yi1, -1); // remove common area
                }
                if (yi2 > yc2)
                {
                    satsums(o, w, h, xc2+1, yc2+1, xi2-1, yi2-1, 1); // center right
                }
                else
                {
                    satsums(o, w, h, xc1, yi2, xi2, yi2, -1); // remove common area
                }
            }
            else
            {
                xc1 = intersect_x(yi2, xm, yi2, xi1, ym);
                yc1 = intersect_y(xi2, xm, yi2, xi1, ym);
                xc2 = intersect_x(yi1, xi2, yM, xM, yi2);
                yc2 = intersect_y(xi1, xi2, yM, xM, yi2);
                satsumt(o, w, h, xi2, yM, xi2, yi1, xc2, yi1, k, 1); // right bottom
                satsumt(o, w, h, xm, yi1, xi2, yi1, xi2, yM, k, 1); // left bottom
                satsumt(o, w, h, xm, yi1, xi2, yc1, xi2, yi1, k, 1); // left top
                satsums(o, w, h, xi2, yi1, xi2, yM, -1); // remove common area
                satsums(o, w, h, xm, yi1, xi2, yi1, -1); // remove common area
                satsumt(o, w, h, xi2, yc1, xc1, yi1, xc1, yc1, k, 1); // inside left
                satsumt(o, w, h, xc2, yi1, xc2, yc2, xi1, yc2, k, 1); // inside right
                satsumt(o, w, h, xi1, yi2, xM, yi2, xi1, yc2, k, 1); // right bottom
                satsumt(o, w, h, xi1, yi2, xi1, ym, xM, yi2, k, 1); // right top
                satsumt(o, w, h, xi1, ym, xi1, yi2, xc1, yi2, k, 1); // left top
                satsums(o, w, h, xi1, yi2, xM, yi2, -1); // remove common area
                satsums(o, w, h, xi1, ym, xi1, yi2, -1); // remove common area
                satsums(o, w, h, xc1, yi2, xc2, yi1, 1); // center
                satsums(o, w, h, xc1, yi2, xc1, yc1, -1); // remove common area
                satsums(o, w, h, xc2, yc2, xc2, yi1, -1); // remove common area
                if (yi1 > yc1)
                {
                    satsums(o, w, h, xi2+1, yc1+1, xc1-1, yi1-1, 1); // center left
                }
                else
                {
                    satsums(o, w, h, xi2, yi1, xc2, yi1, -1); // remove common area
                }
                if (yi2 < yc2)
                {
                    satsums(o, w, h, xc2+1, yi2+1, xi1-1, yc2-1, 1); // center right
                }
                else
                {
                    satsums(o, w, h, xc1, yi2, xi2, yi2, -1); // remove common area
                }
            }
            */
            // or even faster, needs larger k
            // can be subdivided into 1 enclosing rectangle - 4 right triangles axis-aligned
            // enclosing rectangle
            satsums(o, w, h, xm, ym, xM, yM, 1);
            if (xi1 <= xi2)
            {
                satsumt(o, w, h, xm, yi1, xm, ym, xi1, ym, k, -1); // left
                satsumt(o, w, h, xi1, ym, xM, ym, xM, yi2, k, -1); // top
                satsumt(o, w, h, xM, yi2, xM, yM, xi2, yM, k, -1); // right
                satsumt(o, w, h, xi2, yM, xm, yM, xm, yi1, k, -1); // bottom
            }
            else
            {
                satsumt(o, w, h, xm, yi1, xm, yM, xi2, yM, k, -1); // left
                satsumt(o, w, h, xm, yi1, xm, ym, xi1, ym, k, -1); // top
                satsumt(o, w, h, xi1, ym, xM, ym, xM, yi2, k, -1); // right
                satsumt(o, w, h, xM, yi2, xM, yM, xi2, yM, k, -1); // bottom
            }
            // add area removed more than once
            satsums(o, w, h, xi1, ym, xi1, ym, 1);
            satsums(o, w, h, xm, yi1, xm, yi1, 1);
            satsums(o, w, h, xM, yi2, xM, yi2, 1);
            satsums(o, w, h, xi2, yM, xi2, yM, 1);
        }
    }
}
function rsatsum(rsat, w, h, xh, yh, ww, hh)
{
    // 45deg rotated (tilted) sat sum
    // (xh,yh) top left corner, (x,y) top right, (xw,yw) bottom right, (xwh,ywh) bottom left
    if (w <= 0 || h <= 0 || ww <= 0 || hh <= 0) return 0;
    var x = xh+hh-1, y = yh-hh+1, xw = x+ww-1, yw = y+ww-1, xwh = x+ww-hh, ywh = y+ww-1+hh-1;
    return (xw>=0 && xw<w && yw>=0 && yw<h ? rsat[xw + w*yw] : 0) + (xh>=0 && xh<w && yh>=0 && yh<h ? rsat[xh + w*yh] : 0) - (x>=0 && x<w && y>=0 && y<h ? rsat[x + w*y] : 0) - (xwh>=0 && xwh<w && ywh>=0 && ywh<h ? rsat[xwh + w*ywh] : 0);
}

function am_eye()
{
    return new AffineMatrix([
    1,0,0,0,
    0,1,0,0
    ]);
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
var typed_arrays = ['ImArray','Array32F','Array64F','Array8I','Array16I','Array32I','Array8U','Array16U','Array32U'];
function to_array(a, A)
{
    var i, l = a.length, array = new (A || Array)(l);
    for (i=0; i<l; ++i) array[i] = a[i];
    return array;
}
function replacer(k, v)
{
    if (Array !== FILTER.Array32F)
    {
        for (var i=0,l=typed_arrays.length; i<l; ++i)
        {
            if (v instanceof FILTER[typed_arrays[i]])
            {
                return {typed:typed_arrays[i], array:to_array(v, Array)};
            }
        }
    }
    return v;
}
function reviver(o)
{
    if (o instanceof Object)
    {
        if (o.typed && o.array && (-1 < typed_arrays.indexOf(o.typed)))
        {
            return to_array(o.array, FILTER[o.typed]);
        }
        else
        {
            for (var k=Object.keys(o),l=k.length,i=0; i<l; ++i)
            {
                o[k[i]] = reviver(o[k[i]]);
            }
        }
    }
    return o;
}
ArrayUtil.typed = FILTER.Browser.isNode ? function(a, A) {
    if ((null == a) || (a instanceof A)) return a;
    else if (Array.isArray(a)) return Array === A ? a : new A(a);
    if (null == a.length) a.length = Object.keys(a).length;
    return Array === A ? Array.prototype.slice.call(a) : new A(Array.prototype.slice.call(a));
} : function(a, A) {return a;};
ArrayUtil.typed_obj = FILTER.Browser.isNode ? function(o, unserialise) {
    return null == o ? o : (unserialise ? reviver(JSON.parse(o)) : JSON.stringify(o, replacer));
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
ImageUtil.interpolate_nearest = interpolate_nearest;
ImageUtil.interpolate = ImageUtil.interpolate_bilinear = interpolate_bilinear;
ImageUtil.nonzero_pixels = nonzero_pixels;
ImageUtil.glsl = image_glsl;

FilterUtil.am_eye = am_eye;
FilterUtil.am_multiply = am_multiply;
FilterUtil.ct_eye = ct_eye;
FilterUtil.ct_multiply = ct_multiply;
FilterUtil.cm_eye = cm_eye;
FilterUtil.cm_multiply = cm_multiply;
FilterUtil.cm_rechannel = cm_rechannel;
FilterUtil.cm_combine = cm_combine;
FilterUtil.cm_convolve = cm_convolve;
FilterUtil.gaussian = gaussian;
FilterUtil.integral_convolution = notSupportClamp ? integral_convolution_clamp : integral_convolution;
FilterUtil.separable_convolution = notSupportClamp ? separable_convolution_clamp : separable_convolution;
FilterUtil.gradient = gradient;
FilterUtil.optimum_gradient = optimum_gradient;
FilterUtil.gradient_glsl = gradient_glsl;
FilterUtil.histogram = histogram;
FilterUtil.integral_histogram = integral_histogram;
FilterUtil.match_histogram = match_histogram;
FilterUtil.otsu = otsu;
FilterUtil.otsu_multi = otsu_multi;
FilterUtil.otsu_multiclass = otsu_multiclass;
FilterUtil.fft1d = function(re, im, n) {return _fft1(re, im, n, false);};
FilterUtil.ifft1d = function(re, im, n) {return _fft1(re, im, n, true);};
FilterUtil.fft2d = function(re, im, nx, ny) {return _fft2(re, im, nx, ny, false);};
FilterUtil.ifft2d = function(re, im, nx, ny) {return _fft2(re, im, nx, ny, true);};
FilterUtil.minmax = function(d, w, h, tl, th, stride, offset) {
    return min_max_loc(d, w, h, tl, th, true, true, stride, offset);
};
FilterUtil.min = function(d, w, h, tl, stride, offset) {
    return min_max_loc(d, w, h, tl, null, true, false, stride, offset);
};
FilterUtil.max = function(d, w, h, th, stride, offset) {
    return min_max_loc(d, w, h, null, th, false, true, stride, offset);
};
FilterUtil.localmax = local_max;
FilterUtil.merge_features = merge_features;
FilterUtil.sat = integral2;
FilterUtil.satsum = satsum;
FilterUtil.satsums = satsums;
FilterUtil.satsumt = satsumt;
FilterUtil.satsumr = satsumr;
FilterUtil.rsatsum = rsatsum;

}(FILTER);