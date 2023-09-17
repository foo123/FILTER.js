// The entry file of your WebAssembly module.
function clamp(x:f32):u8
{
    return u8(Mathf.min(Mathf.max(0.0, Mathf.round(x)), 255.0));
}
function clampi(x:f32, min:i32, max:i32):i32
{
    return i32(Mathf.min(Mathf.max(f32(min), Mathf.round(x)), f32(max)));
}
export function interpolate_nearest(im:Uint8ClampedArray, w:i32, h:i32, nw:i32, nh:i32):Uint8ClampedArray
{
    let size:i32 = (nw*nh) << 2,
        interpolated:Uint8ClampedArray = new Uint8ClampedArray(size),
        x:i32, y:i32, xn:i32, yn:i32, pixel:i32, nearest:i32
    ;
    x=0; y=0;
    for (pixel=0; pixel<size; pixel+=4,++x)
    {
        if (x >= nw) {x=0; ++y;}

        xn = clampi(f32(x)/f32(nw)*f32(w), 0, w-1);
        yn = clampi(f32(y)/f32(nh)*f32(h), 0, h-1);
        nearest = (xn + yn*w) << 2;

        interpolated[pixel  ] = im[nearest  ];
        interpolated[pixel+1] = im[nearest+1];
        interpolated[pixel+2] = im[nearest+2];
        interpolated[pixel+3] = im[nearest+3];
    }
    return interpolated;
}
export function interpolate_bilinear(im:Uint8ClampedArray, w:i32, h:i32, nw:i32, nh:i32):Uint8ClampedArray
{
    let size:i32 = (nw*nh) << 2,
        interpolated:Uint8ClampedArray = new Uint8ClampedArray(size),
        rx:f32 = f32(w-1)/f32(nw), ry:f32 = f32(h-1)/f32(nh),
        A:f32, B:f32, C:f32, D:f32, a:f32, b:f32, c:f32, d:f32,
        i:i32, j:i32, x:f32, y:f32, xi:i32, yi:i32, pixel:i32, index:i32,
        yw:i32, dx:f32, dy:f32, w4:i32 = w << 2
    ;
    i=0; j=0; x=0; y=0; yi=0; yw=0; dy=0;
    for (index=0; index<size; index+=4,++j,x+=rx)
    {
        if (j >= nw) {j=0; x=0; ++i; y+=ry; yi=i32(y); dy=y - f32(yi); yw=yi*w;}

        xi = i32(x); dx = x - f32(xi);

        // Y = A(1-w)(1-h) + B(w)(1-h) + C(h)(1-w) + Dwh
        a = (1-dx)*(1-dy); b = dx*(1-dy);
        c = dy*(1-dx); d = dx*dy;

        pixel = (yw + xi)<<2;

        A = f32(im[pixel]); B = f32(im[pixel+4]);
        C = f32(im[pixel+w4]); D = f32(im[pixel+w4+4]);
        interpolated[index] = clamp(A*a + B*b + C*c + D*d);

        A = f32(im[pixel+1]); B = f32(im[pixel+5]);
        C = f32(im[pixel+w4+1]); D = f32(im[pixel+w4+5]);
        interpolated[index+1] = clamp(A*a + B*b + C*c + D*d);

        A = f32(im[pixel+2]); B = f32(im[pixel+6]);
        C = f32(im[pixel+w4+2]); D = f32(im[pixel+w4+6]);
        interpolated[index+2] = clamp(A*a + B*b + C*c + D*d);

        A = f32(im[pixel+3]); B = f32(im[pixel+7]);
        C = f32(im[pixel+w4+3]); D = f32(im[pixel+w4+7]);
        interpolated[index+3] = clamp(A*a + B*b + C*c + D*d);
    }
    return interpolated;
}

export function integral_convolution(mode:i32, im:Uint8ClampedArray, w:i32, h:i32, stride:i32, matrix:Float32Array, matrix2:Float32Array, dimX:i32, dimY:i32, dimX2:i32, dimY2:i32, coeff1:f32, coeff2:f32, numRepeats:i32, hasMat2:i32=0):Uint8ClampedArray
{
    const GRAY:i32 = 9;
    let imLen:i32=im.length, imArea:i32=imLen>>>stride,
        integral:Float32Array, integralLen:i32, dst:Uint8ClampedArray,
        colR:f32, colG:f32, colB:f32,
        matRadiusX:i32=dimX, matRadiusY:i32=dimY, matArea:i32, matArea2:i32,
        matHalfSideX:i32, matHalfSideY:i32, matHalfSideX2:i32, matHalfSideY2:i32,
        rowLen:i32, matOffsetLeft:i32, matOffsetRight:i32, matOffsetTop:i32, matOffsetBottom:i32,
        matOffsetLeft2:i32, matOffsetRight2:i32, matOffsetTop2:i32, matOffsetBottom2:i32,
        i:i32, j:i32, x:i32, y:i32, ty:i32,
        wt:f32, wtCenter:f32, centerOffset:f32,
        wt2:f32, wtCenter2:f32, centerOffset2:f32,
        xOff1:i32, yOff1:i32, xOff2:i32, yOff2:i32,
        bx1:i32, by1:i32, bx2:i32, by2:i32,
        p1:i32, p2:i32, p3:i32, p4:i32,
        t0:f32, t1:f32, t2:f32, tt:u8,
        r:f32, g:f32, b:f32,
        r2:f32, g2:f32, b2:f32, repeat:i32,
        tmp:Uint8ClampedArray, w4:i32 = w<<stride, ii:i32 = 1<<stride;

    matArea = matRadiusX*matRadiusY;
    matHalfSideX = matRadiusX>>>1;  matHalfSideY = w*(matRadiusY>>>1);
    matOffsetLeft = -matHalfSideX-1; matOffsetTop = -matHalfSideY-w;
    matOffsetRight = matHalfSideX; matOffsetBottom = matHalfSideY;
    matArea2 = dimX2*dimY2;
    matHalfSideX2 = dimX2>>>1;  matHalfSideY2 = w*(dimY2>>>1);
    matOffsetLeft2 = -matHalfSideX2-1; matOffsetTop2 = -matHalfSideY2-w;
    matOffsetRight2 = matHalfSideX2; matOffsetBottom2 = matHalfSideY2;
    bx1 = 0; bx2 = w-1; by1 = 0; by2 = imArea-w;

    dst = im; im = new Uint8ClampedArray(imLen);

    if (GRAY == mode)
    {
        integralLen = imArea;  rowLen = w;
        integral = new Float32Array(integralLen);

        if (1==hasMat2) // allow to compute a second matrix in-parallel
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
                    colR+=f32(im[i]); integral[j]=colR;
                }
                // other rows
                j=0; x=0; colR=0;
                for (i=w4; i<imLen; i+=ii, ++j, ++x)
                {
                    if (x>=w) {x=0; colR=0;}
                    colR+=f32(im[i]); integral[j+rowLen]=integral[j]+colR;
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
                    r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * f32(im[i  ]));

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
                    r2 = wt2 * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset2 * f32(im[i  ]));

                    // output
                    t0 = coeff1*r + coeff2*r2;
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    tt = u8(t0);
                    dst[i] = tt;  dst[i+1] = tt;  dst[i+2] = tt;
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
                    colR+=f32(im[i]); integral[j]=colR;
                }
                // other rows
                j=0; x=0; colR=0;
                for (i=w4; i<imLen; i+=ii, ++j, ++x)
                {
                    if (x>=w) {x=0; colR=0;}
                    colR+=f32(im[i]); integral[j+rowLen  ]=integral[j  ]+colR;
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
                    tt = u8(t0);
                    dst[i] = tt;  dst[i+1] = tt;  dst[i+2] = tt;
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
        integral = new Float32Array(integralLen);

        if (1==hasMat2) // allow to compute a second matrix in-parallel
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
                    colR+=f32(im[i]); colG+=f32(im[i+1]); colB+=f32(im[i+2]);
                    integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                }
                // other rows
                j=0; x=0; colR=colG=colB=0;
                for (i=w4; i<imLen; i+=ii, j+=3, ++x)
                {
                    if (x>=w) {x=0; colR=colG=colB=0;}
                    colR+=f32(im[i]); colG+=f32(im[i+1]); colB+=f32(im[i+2]);
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
                    dst[i] = u8(t0);  dst[i+1] = u8(t1);  dst[i+2] = u8(t2);
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
                    colR+=f32(im[i]); colG+=f32(im[i+1]); colB+=f32(im[i+2]);
                    integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                }
                // other rows
                j=0; x=0; colR=colG=colB=0;
                for (i=w4; i<imLen; i+=ii, j+=3, ++x)
                {
                    if (x>=w) {x=0; colR=colG=colB=0;}
                    colR+=f32(im[i]); colG+=f32(im[i+1]); colB+=f32(im[i+2]);
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
                    dst[i] = u8(t0);  dst[i+1] = u8(t1);  dst[i+2] = u8(t2);
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                // do another pass??
            }
        }
    }
    return dst;
}

export function separable_convolution(mode:i32, im:Uint8ClampedArray, w:i32, h:i32, stride:i32, matrix:Float32Array, matrix2:Float32Array, ind1:Int16Array, ind2:Int16Array, coeff1:f32, coeff2:f32):Uint8ClampedArray
{
    const GRAY:i32 = 9;
    let imLen:i32=im.length, imArea:i32=imLen>>>stride,
        matArea:i32, mat:Float32Array, indices:Int16Array, matArea2:i32,
        dst:Uint8ClampedArray, imageIndices:Int16Array,
        imageIndices1:Int16Array, imageIndices2:Int16Array,
        i:i32, j:i32, k:i32, x:i32, ty:i32, ty2:i32, ii:i32 = 1<<stride,
        xOff:i32, yOff:i32, srcOff:i32, bx:i32, by:i32,
        t0:f32, t1:f32, t2:f32, t3:f32, wt:f32, tt:u8,
        r:f32, g:f32, b:f32, a:f32, coeff:f32,
        numPasses:i32, tmp:Uint8ClampedArray;

    bx = w-1; by = imArea-w;
    imageIndices1 = new Int16Array(ind1.length);
    for (k=0,matArea2=ind1.length; k<matArea2; k+=2)
    {
        imageIndices1[k  ] = ind1[k  ];
        imageIndices1[k+1] = ind1[k+1]*w;
    }
    imageIndices2 = new Int16Array(ind2.length);
    for (k=0,matArea2=ind2.length; k<matArea2; k+=2)
    {
        imageIndices2[k  ] = ind2[k  ];
        imageIndices2[k+1] = ind2[k+1]*w;
    }

    // one horizontal and one vertical pass
    numPasses = 2;
    mat = matrix;
    indices = ind1;
    coeff = coeff1;
    imageIndices = imageIndices1;
    dst = im; im = new Uint8ClampedArray(imLen);

    if (GRAY == mode)
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
                        r += f32(im[srcOff]) * wt;
                    }
                }

                // output
                t0 = coeff * r;
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                tt = u8(t0);
                dst[i] = tt;  dst[i+1] = tt;  dst[i+2] = tt;
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
                        r += f32(im[srcOff]) * wt; g += f32(im[srcOff+1]) * wt;  b += f32(im[srcOff+2]) * wt;
                    }
                }

                // output
                t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                dst[i] = u8(t0);  dst[i+1] = u8(t1);  dst[i+2] = u8(t2);
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
class HIST {
    bin: Float32Array;
    channel: i32;
    min: i32;
    max: i32;
    total: i32;
}
export function histogram(im:Uint8ClampedArray, channel:i32=0, cdf:i32=0):HIST
{
    let h:Float32Array = new Float32Array(256), v:i32, i:i32, l:i32 = im.length,
        accum:f32 = 0, min:i32 = 255, max:i32 = 0;
    for (i=0; i<l; i+=4)
    {
        v = im[i+channel];
        ++h[v];
        if (v < min) min = v;
        if (v > max) max = v;
    }
    if (1==cdf)
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
export function gaussian(dx:i32, dy:i32, sigma:f32):Float32Array
{
    var rx:i32 = dx >>> 1,
        ry:i32 = dy >>> 1,
        l:i32 = dx*dy,
        f:f32 = -1/(2*sigma*sigma),
        m:Float32Array = new Float32Array(l),
        x:i32, y:i32, i:i32, s:f32;
    for (s=0,x=-rx,y=-ry,i=0; i<l; ++i,++x)
    {
        if (x > rx) {x=-rx; ++y;}
        m[i] = Mathf.exp(f*f32(x*x + y*y));
        s += m[i];
    }
    for (i=0; i<l; ++i) m[i] /= s;
    return m;
}
const gauss_5_14:Array<f32> = [
 f32(0.012146124616265297)
​,f32(0.02610994502902031 )
​,f32(0.03369731828570366 )
​,f32(0.02610994502902031 )
​,f32(0.012146124616265297)
​,f32(0.02610994502902031 )
​,f32(0.05612730234861374 )
​,f32(0.07243751734495163 )
​,f32(0.05612730234861374 )
​,f32(0.02610994502902031 )
​,f32(0.03369731828570366 )
​,f32(0.07243751734495163 )
​,f32(0.09348738193511963 )
​,f32(0.07243751734495163 )
​,f32(0.03369731828570366 )
​,f32(0.02610994502902031 )
​,f32(0.05612730234861374 )
​,f32(0.07243751734495163 )
​,f32(0.05612730234861374 )
​,f32(0.02610994502902031 )
​,f32(0.012146124616265297)
​,f32(0.02610994502902031 )
​,f32(0.03369731828570366 )
​,f32(0.02610994502902031 )
​,f32(0.012146124616265297)
];//gaussian(5, 5, 1.4);
export function gradient(im:Uint8ClampedArray, w:i32, h:i32, stride:i32, channel:i32, do_lowpass:i32, do_sat:i32, low:f32, high:f32, MAGNITUDE_SCALE:f32, MAGNITUDE_LIMIT:f32, MAGNITUDE_MAX:f32):Uint8ClampedArray
{
    let stride0:i32 = stride,
        imSize:i32 = im.length, count:i32 = imSize>>>stride,
        index:i32, i:i32, j:i32, k:i32, w_1:i32 = w-1, h_1:i32 = h-1,
        w_2:i32, h_2:i32, w2:i32, w4:i32 = w<<stride,
        dx:i32 = 1<<stride, dx2:i32 = dx<<1, dy:i32 = w4,
        i0:i32, i1s:i32, i2s:i32, i1n:i32, i2n:i32,
        i1w:i32, i1e:i32, ine:i32, inw:i32, ise:i32, isw:i32,
        gX:Float32Array = new Float32Array(count),
        gY:Float32Array = new Float32Array(count),
        g:Array<f32>, lowpassed:Float32Array;

    lowpassed = new Float32Array(count);
    if (do_lowpass)
    {
        w_2 = w-2; h_2 = h-2; w2 = w<<1;
        g = gauss_5_14;
        for (i=2,j=2,k=w2; j<h_2; ++i)
        {
            if (i >= w_2) {i=2; k+=w; ++j; if (j>=h_2) break;}
            index = i+k; i0 = (index<<stride);
            if (0 < stride && 0 == im[i0+3])
            {
                lowpassed[index] = 0;
            }
            else
            {
                i0 += channel;
                i1s = i0+dy; i2s = i1s+dy; i1n = i0-dy; i2n = i1n-dy;
                lowpassed[index] = (
                g[0]*f32(im[i2n-dx2]) + g[1]*f32(im[i2n-dx]) + g[2]*f32(im[i2n]) + g[3]*f32(im[i2n+dx]) + g[4]*f32(im[i2n+dx2])
               +g[5]*f32(im[i1n-dx2]) + g[6]*f32(im[i1n-dx]) + g[7]*f32(im[i1n]) + g[8]*f32(im[i1n+dx]) + g[9]*f32(im[i1n+dx2])
               +g[10]*f32(im[i0 -dx2]) + g[11]*f32(im[i0 -dx]) + g[12]*f32(im[i0 ]) + g[13]*f32(im[i0 +dx]) + g[14]*f32(im[i0 +dx2])
               +g[15]*f32(im[i1s-dx2]) +  g[16]*f32(im[i1s-dx]) + g[17]*f32(im[i1s]) + g[18]*f32(im[i1s+dx]) + g[19]*f32(im[i1s+dx2])
               +g[20]*f32(im[i2s-dx2]) + g[21]*f32(im[i2s-dx]) + g[22]*f32(im[i2s]) + g[23]*f32(im[i2s+dx]) + g[24]*f32(im[i2s+dx2])
                );
            }
        }
    }
    else
    {
        for (i=0; i<count; ++i)
        {
            lowpassed[i] = f32(im[(i<<stride)+channel]);
        }
    }
    dx = 1; dx2 = 2; dy = w; stride = 0; channel = 0;

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
function ahypot(x:f32, y:f32):f32
{
    x = Mathf.abs(x); y = Mathf.abs(y);
    let tM = Mathf.max(x, y);
    if (0==tM) return 0;
    let tm = Mathf.min(x, y)/tM;
    return tM*(1+0.43*tm*tm); // approximation
}
export function optimum_gradient(gX:Float32Array, gY:Float32Array, im:Uint8ClampedArray, w:i32, h:i32, stride:i32, sat:i32, low:f32, high:f32, MAGNITUDE_SCALE:f32, MAGNITUDE_LIMIT:f32, MAGNITUDE_MAX:f32):Uint8ClampedArray
{
    let imSize:i32 = im.length,
        count:i32 = imSize>>>stride,
        index:i32, i:i32, j:i32, k:i32, sum:f32,
        w_1:i32 = w-1, h_1:i32 = h-1,
        i0:i32, i1s:i32, i2s:i32, i1n:i32, i2n:i32,
        i1w:i32, i1e:i32, ine:i32, inw:i32, ise:i32, isw:i32,
        g:Float32Array = new Float32Array(count), xGrad:f32, yGrad:f32,
        absxGrad:f32, absyGrad:f32, gradMag:f32, tmp:f32,
        nMag:f32, sMag:f32, wMag:f32, eMag:f32,
        neMag:f32, seMag:f32, swMag:f32, nwMag:f32, gg:f32,
        x0:i32, x1:i32, x2:i32, y0:i32, y1:i32, y2:i32,
        x:i32, y:i32, y0w:i32, yw:i32, jj:i32, ii:i32,
        followedge:i32, tm:f32, tM:f32;

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
        absxGrad = Mathf.abs(xGrad);
        absyGrad = Mathf.abs(yGrad);
        gradMag = ahypot(xGrad, yGrad);
        nMag = ahypot(gX[i1n],gY[i1n]);
        sMag = ahypot(gX[i1s],gY[i1s]);
        wMag = ahypot(gX[i1w],gY[i1w]);
        eMag = ahypot(gX[i1e],gY[i1e]);
        neMag = ahypot(gX[ine],gY[ine]);
        seMag = ahypot(gX[ise],gY[ise]);
        swMag = ahypot(gX[isw],gY[isw]);
        nwMag = ahypot(gX[inw],gY[inw]);

        gg = xGrad * yGrad <= 0
            ? (absxGrad >= absyGrad
                ? ((tmp = absxGrad * gradMag) >= Mathf.abs(yGrad * neMag - (xGrad + yGrad) * eMag)
                    && tmp > Mathf.abs(yGrad * swMag - (xGrad + yGrad) * wMag))
                : ((tmp = absyGrad * gradMag) >= Mathf.abs(xGrad * neMag - (yGrad + xGrad) * nMag)
                    && tmp > Mathf.abs(xGrad * swMag - (yGrad + xGrad) * sMag)))
            : (absxGrad >= absyGrad
                ? ((tmp = absxGrad * gradMag) >= Mathf.abs(yGrad * seMag + (xGrad - yGrad) * eMag)
                    && tmp > Mathf.abs(yGrad * nwMag + (xGrad - yGrad) * wMag))
                : ((tmp = absyGrad * gradMag) >= Mathf.abs(xGrad * seMag + (yGrad - xGrad) * sMag)
                    && tmp > Mathf.abs(xGrad * nwMag + (yGrad - xGrad) * nMag)));
        g[i0] = gg ? (gradMag >= MAGNITUDE_LIMIT ? MAGNITUDE_MAX : MAGNITUDE_SCALE * gradMag) : 0;
    }
    /*if (sat)
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
    {*/
        // full (canny) gradient
        // reset image
        if (stride) for (i=0; i<imSize; i+=4) {im[i] = im[i+1] = im[i+2] = 0;}
        else for (i=0; i<imSize; ++i) {im[i] = 0;}

        //hysteresis and double-threshold, inlined
        for (i=0,j=0,index=0,k=0; index<count; ++index,k=index<<stride,++i)
        {
            if (i >= w) {i=0; ++j;}
            if ((0 < im[k]) || (g[index] < high)) continue;
            x1 = i; y1 = j; ii = k; jj = index;
            do {
                // threshold here
                if (stride) {im[ii] = im[ii+1] = im[ii+2] = 255;}
                else {im[ii] = 255;}

                x0 = x1 === 0 ? x1 : x1-1;
                x2 = x1 === w_1 ? x1 : x1+1;
                y0 = y1 === 0 ? y1 : y1-1;
                y2 = y1 === h_1 ? y1 : y1+1;
                y0w = y0*w;
                x = x0; y = y0; yw = y0w = y0*w; followedge = 0;
                while (x <= x2 && y <= y2)
                {
                    jj = x + yw; ii = jj << stride;
                    if ((y !== y1 || x !== x1) && (0 == im[ii]) && (g[jj] >= low))
                    {
                        x1 = x; y1 = y;
                        followedge = 1; break;
                    }
                    ++y; yw+=w; if (y>y2) {y=y0; yw=y0w; ++x;}
                }
            } while (followedge);
        }
        return im;
    /*}*/
}
