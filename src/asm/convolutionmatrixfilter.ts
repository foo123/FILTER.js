// The entry file of your WebAssembly module.
export function convolutionmatrixfilter(im:Uint8ClampedArray, w:i32, h:i32, mode:i32, mat:Float32Array, mat2:Float32Array, ind1:Int16Array, ind2:Int16Array, coeff1:f32, coeff2:f32, isGrad:i32=0, hasMat2:i32=0):Uint8ClampedArray
{
    const GRAY:i32 = 9;
    let imLen:i32 = im.length, imArea:i32 = imLen>>>2,
        dst:Uint8ClampedArray = new Uint8ClampedArray(imLen),
        t0:f32, t1:f32, t2:f32, t3:f32, i:i32, j:i32, k:i32,
        x:i32, ty:i32, ty2:i32, tm:f32, tM:f32,
        xOff:i32, yOff:i32, srcOff:i32,
        r:f32, g:f32, b:f32, a:f32, r2:f32, g2:f32, b2:f32, a2:f32,
        bx:i32 = w-1, by:i32 = imArea-w,
        wt:f32, wt2:f32, tt:u8,
        mArea:i32, matArea:i32, imageIndices:Int16Array,
        mArea2:i32, matArea2:i32, imageIndices2:Int16Array, ma:i32;

    if (GRAY == mode)
    {
        if (1==hasMat2) // allow to compute a second matrix in-parallel in same pass
        {
            // pre-compute indices,
            // reduce redundant computations inside the main convolution loop (faster)
            mArea = ind1.length;
            imageIndices = new Int16Array(mArea);
            for (k=0; k<mArea; k+=2)
            {
                imageIndices[k  ] = ind1[k  ];
                imageIndices[k+1] = ind1[k+1]*w;
            }
            matArea = mat.length;
            mArea2 = ind2.length;
            imageIndices2 = new Int16Array(mArea2);
            for (k=0; k<mArea2; k+=2)
            {
                imageIndices2[k  ] = ind2[k  ];
                imageIndices2[k+1] = ind2[k+1]*w;
            }
            matArea2 = mat2.length;

            // do direct convolution
            x=0; ty=0; ma = matArea2 > matArea ? matArea2 : matArea;
            for (i=0; i<imLen; i+=4, ++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=r2=g2=b2=a2=0;
                for (k=0, j=0; k<ma; ++k, j+=2)
                {
                    if (k<matArea)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                        {
                            srcOff = (xOff + yOff)<<2;
                            wt = mat[k]; r += f32(im[srcOff]) * wt;
                        }
                    }
                    if (k<matArea2)
                    {
                        xOff = x + imageIndices2[j]; yOff = ty + imageIndices2[j+1];
                        if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                        {
                            srcOff = (xOff + yOff)<<2;
                            wt = mat2[k]; r2 += f32(im[srcOff]) * wt;
                        }
                    }
                }

                // output
                if (1==isGrad)
                {
                    r = Mathf.abs(r);
                    r2 = Mathf.abs(r2);
                    tM = Mathf.max(r, r2);
                    if (0 < tM)
                    {
                        // approximation
                        tm = Mathf.min(r, r2);
                        t0 = tM*(1+0.43*tm/tM*tm/tM);
                    }
                    else
                    {
                        t0 = 0;
                    }
                }
                else
                {
                    t0 = coeff1*r + coeff2*r2;
                }
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                tt = u8(t0);
                dst[i] = tt;  dst[i+1] = tt;  dst[i+2] = tt;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
        }
        else
        {
            // pre-compute indices,
            // reduce redundant computations inside the main convolution loop (faster)
            mArea = ind1.length;
            imageIndices = new Int16Array(mArea);
            for (k=0; k<mArea; k+=2)
            {
                imageIndices[k  ] = ind1[k  ];
                imageIndices[k+1] = ind1[k+1]*w;
            }
            matArea = mat.length;

            // do direct convolution
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, ++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; ++k, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2; wt = mat[k];
                    r += f32(im[srcOff]) * wt;
                }

                // output
                t0 = coeff1*r+coeff2;
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                tt = u8(t0);
                dst[i] = tt;  dst[i+1] = tt;  dst[i+2] = tt;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
        }
    }
    else
    {
        if (1==hasMat2) // allow to compute a second matrix in-parallel in same pass
        {
            // pre-compute indices,
            // reduce redundant computations inside the main convolution loop (faster)
            mArea = ind1.length;
            imageIndices = new Int16Array(mArea);
            for (k=0; k<mArea; k+=2)
            {
                imageIndices[k  ] = ind1[k  ];
                imageIndices[k+1] = ind1[k+1]*w;
            }
            matArea = mat.length;
            mArea2 = ind2.length;
            imageIndices2 = new Int16Array(mArea2);
            for (k=0; k<mArea2; k+=2)
            {
                imageIndices2[k  ] = ind2[k  ];
                imageIndices2[k+1] = ind2[k+1]*w;
            }
            matArea2 = mat2.length;

            // do direct convolution
            x=0; ty=0; ma = matArea2 > matArea ? matArea2 : matArea;
            for (i=0; i<imLen; i+=4, ++x)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=r2=g2=b2=a2=0;
                for (k=0, j=0; k<ma; ++k, j+=2)
                {
                    if (k<matArea)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                        {
                            srcOff = (xOff + yOff)<<2;
                            wt = mat[k];
                            r += f32(im[srcOff]) * wt;
                            g += f32(im[srcOff+1]) * wt;
                            b += f32(im[srcOff+2]) * wt;
                        }
                    }
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    if (k<matArea2)
                    {
                        xOff = x + imageIndices2[j]; yOff = ty + imageIndices2[j+1];
                        if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                        {
                            srcOff = (xOff + yOff)<<2;
                            wt2 = mat2[k];
                            r2 += f32(im[srcOff]) * wt2;
                            g2 += f32(im[srcOff+1]) * wt2;
                            b2 += f32(im[srcOff+2]) * wt2;
                        }
                    }
                }

                // output
                if (1==isGrad)
                {
                    r = Mathf.abs(r);
                    r2 = Mathf.abs(r2);
                    tM = Mathf.max(r, r2);
                    if (0 < tM)
                    {
                        // approximation
                        tm = Mathf.min(r, r2);
                        t0 = tM*(1+0.43*tm/tM*tm/tM);
                    }
                    else
                    {
                        t0 = 0;
                    }
                    g = Mathf.abs(g);
                    g2 = Mathf.abs(g2);
                    tM = Mathf.max(g, g2);
                    if (0 < tM)
                    {
                        // approximation
                        tm = Mathf.min(g, g2);
                        t1 = tM*(1+0.43*tm/tM*tm/tM);
                    }
                    else
                    {
                        t1 = 0;
                    }
                    b = Mathf.abs(b);
                    b2 = Mathf.abs(b2);
                    tM = Mathf.max(b, b2);
                    if (0 < tM)
                    {
                        // approximation
                        tm = Mathf.min(b, b2);
                        t2 = tM*(1+0.43*tm/tM*tm/tM);
                    }
                    else
                    {
                        t2 = 0;
                    }
                }
                else
                {
                    t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                }
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                dst[i] = u8(t0);  dst[i+1] = u8(t1);  dst[i+2] = u8(t2);
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
        }
        else
        {
            // pre-compute indices,
            // reduce redundant computations inside the main convolution loop (faster)
            mArea = ind1.length;
            imageIndices = new Int16Array(mArea);
            for (k=0; k<mArea; k+=2)
            {
                imageIndices[k  ] = ind1[k  ];
                imageIndices[k+1] = ind1[k+1]*w;
            }
            matArea = mat.length;

            // do direct convolution
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, ++x)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2; wt = mat[k];
                    r += f32(im[srcOff]) * wt;
                    g += f32(im[srcOff+1]) * wt;
                    b += f32(im[srcOff+2]) * wt;
                    //a += im[srcOff+3] * wt;
                }

                // output
                t0 = coeff1*r+coeff2;  t1 = coeff1*g+coeff2;  t2 = coeff1*b+coeff2;
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                dst[i] = u8(t0);  dst[i+1] = u8(t1);  dst[i+2] = u8(t2);
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
        }
    }
    return dst;
}

export function weighted(im:Uint8ClampedArray, w:i32, h:i32, d:i32, wS:Float32Array, fC:f32):Uint8ClampedArray
{
    const GRAY:i32 = 9;
    let imLen:i32 = im.length,
        dst:Uint8ClampedArray = new Uint8ClampedArray(imLen),
        x:i32, y:i32, yw:i32, xx:i32, yy:i32, yyw:i32,
        r:f32, g:f32, b:f32, r2:f32, g2:f32, b2:f32,
        sr:f32, sg:f32, sb:f32, dr:f32, dg:f32, db:f32,
        bx:i32 = w-1, by:i32 = h-1, i:i32, j:i32, k:i32,
        radius:i32 = d >>>1, l:i32 = d*d, f:f32, s:f32;
    for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
    {
        if (x >= w) {x=0; ++y; yw+=w;}
        r = f32(im[i]); g = f32(im[i+1]); b = f32(im[i+2]);
        for (s=0,sr=0,sg=0,sb=0,xx=-radius,yy=-radius,yyw=yy*w,k=0; k<l; ++k,++xx)
        {
            if (xx > radius) {xx=-radius; ++yy; yyw+=w;}
            if (0 > x+xx || x+xx > bx || 0 > y+yy || y+yy > by)
            {
                r2 = r; g2 = g; b2 = b;
            }
            else
            {
                j = (x+xx + yw+yyw) << 2;
                r2 = f32(im[j]); g2 = f32(im[j+1]); b2 = f32(im[j+2]);
            }
            dr = (r2-r); dg = (g2-g); db = (b2-b);
            f = wS[k]*Mathf.exp(fC*(dr*dr+dg*dg+db*db));
            s += f;
            sr += f*r2;
            sg += f*g2;
            sb += f*b2;
        }
        sr /= s; sg /= s; sb /= s;
        // clamp them manually
        sr = sr<0 ? 0 : (sr>255 ? 255 : sr);
        sg = sg<0 ? 0 : (sg>255 ? 255 : sg);
        sb = sb<0 ? 0 : (sb>255 ? 255 : sb);
        dst[i  ] = u8(sr);
        dst[i+1] = u8(sg);
        dst[i+2] = u8(sb);
        dst[i+3] = im[i+3];
    }
    return dst;
}

