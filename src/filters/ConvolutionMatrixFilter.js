/**
*
* Convolution Matrix Filter(s)
*
* Convolves the target image with a matrix filter
*
* @param weights Optional (a convolution matrix as an array of values)
* @param factor Optional (filter normalizer factor)
* @package FILTER.js
*
**/
(function(FILTER, undef){
    
    var 
        sqrt2=FILTER.CONSTANTS.SQRT2, toRad=FILTER.CONSTANTS.toRad, toDeg=FILTER.CONSTANTS.toDeg,
        Abs=Math.abs, Sqrt=Math.sqrt, Sin=Math.sin, Cos=Math.cos,
        
        // Convolution Matrix
        CM=FILTER.Array32F, 
        IMG = FILTER.ImArray, //IMGcopy = FILTER.ImArrayCopy,
        A32F=FILTER.Array32F, A16I=FILTER.Array16I, A8U=FILTER.Array8U,
        notSupportClamp=FILTER._notSupportClamp,
        
        // hardcode Pascal numbers, used for binomial kernels
        _pascal=[
            [1],
            [1, 1],
            [1, 2,  1],
            [1, 3,  3,  1],
            [1, 4,  6,  4,  1],
            [1, 5,  10, 10, 5,  1],
            [1, 6,  15, 20, 15, 6,  1],
            [1, 7,  21, 35, 35, 21, 7,  1],
            [1, 8,  28, 56, 70, 56, 28, 8,  1]
        ]
    ;
    
    //
    //
    //  Private methods
    
    function addMatrix(m1, m2)
    {
        var l=m1.length, i, m=new CM(m1.length);
        i=0; while (i<l) { m[i]=m1[i] + m2[i]; i++; }
        return m;
    }
    
    function subtractMatrix(m1, m2)
    {
        var l=m1.length, i, m=new CM(m1.length);
        i=0; while (i<l) { m[i]=m1[i]-m2[i]; i++; }
        return m;
    }
    
    function multiplyScalar(m1, s)
    {
        if (1==s) return new CM(m1);
        var l=m1.length, i, m=new CM(m1.length);
        i=0; while (i<l) { m[i]=m1[i]*s; i++; }
        return m;
    }
    
    function blendMatrix(m1, m2, a, b)
    {
        var l=m1.length, i, m=new CM(m1.length);
        a=a||1; b=b||1;
        i=0; while (i<l) { m[i]=a*m1[i] + b*m2[i]; i++; }
        return m;
    }
    
    function convolveKernels(k1, k2)
    {
        var i, j, kl=k1.length, k, ker=[], sum=0;
        for (i=0; i<kl; i++) { for (j=0; j<kl; j++) { k=k1[i]*k2[j];  sum+=k;  ker.push(k); } }
        return {kernel:ker, sum:sum};
    }
    
    function identity1DKernel(d)
    {
        var i, center=(d>>1), ker=new Array(d);
        i=0; while (i<d) { ker[i]=0; i++; }
        ker[center]=1;  return ker;
    }

    function average1DKernel(d)
    {
        var i, ker=new Array(d);
        i=0; while (i<d) { ker[i]=1; i++; }
        return ker;
    }
    
    // pascal numbers (binomial coefficients) are used to get coefficients for filters that resemble gaussian distributions
    // eg Sobel, Canny, gradients etc..
    function binomial1DKernel(d) 
    {
        var l=_pascal.length, row, uprow, i, il;
        d--;
        if (d<l)
        {
            row=new CM(_pascal[d]);
        }
        else
        {
            // else compute them iteratively
            row=new CM(_pascal[l-1]);
            while (l<=d)
            {
                uprow=row; row=new CM(uprow.length+1); row[0]=1;
                for (i=0, il=uprow.length-1; i<il; i++) { row[i+1]=(uprow[i]+uprow[i+1]); } row[uprow.length]=1;
                if (l<40) _pascal.push(new Array(row)); // save it for future dynamically
                l++;
            }
        }
        return row;
    }
    
    function derivative1DKernel(d)
    {
        var i, half=d>>1, k=-half, ker=new Array(d);
        i=0; while (i<d) { ker[i]=k; k++; i++; }
        return ker;
    }
    
    function gaussKernel(d)
    {
        var binomial=binomial1DKernel(d);
        // convolve with itself
        return convolveKernels(binomial, binomial);
    }
    
    function verticalKernel(d)
    {
        var eye=identity1DKernel(d), average=average1DKernel(d);
        // convolve with itself
        return convolveKernels(average, eye);
    }
    
    function horizontalKernel(d)
    {
        var eye=identity1DKernel(d), average=average1DKernel(d);
        // convolve with itself
        return convolveKernels(eye, average);
    }
    
    function sobelKernel(d, dir)
    {
        var binomial=binomial1DKernel(d), derivative=derivative1DKernel(d);
        if (1==dir) // y
            return convolveKernels(derivative.reverse(), binomial);
        else  // x
            return convolveKernels(binomial, derivative);
    }
    
    function prewittKernel(d, dir)
    {
        var average=average1DKernel(d), derivative=derivative1DKernel(d);
        if (1==dir) // y
            return convolveKernels(derivative.reverse(), average);
        else // x
            return convolveKernels(average, derivative);
    }
    
    function ones(d, f, c) 
    { 
        f=f||1; c=c||f;
        var l=d*d, center=l>>1, i, o=new CM(l);
        i=0; while(i<l) { o[i]=f; i++; } o[center]=c;
        return o;
    }
    
    function twos(d, dx, dy, c)
    {
        /*var l=d*d, half=d>>1, center=l>>1, i, k, o2=new CM(l), x, y, x0, y0;
        x0=-half*dx; y0=-half*dy; x=x0; y=y0; i=0; k=0;
        while (i<l)
        {
            o2[i]=x + y; i++; k++; x+=dx;
            if (k>=d) { k=0; x=x0; y+=dy; }
        }
        c=c||1;  o2[center]=c;
        //return o2;
        console.log(o2);*/
        var l=d*d, half=d>>1, center=l>>1, i, k, j, o=new CM(l), tx, ty;
        tx=0;
        for (i=0; i<=half; i++)
        {
            k=0; ty=0;
            for (j=0; j<=half; j++)
            {
                //tx=i*dx;  ty=j*dy;
                o[center + i + k]=   tx + ty;
                o[center - i - k]= - tx - ty;
                o[center - i + k]= - tx + ty;
                o[center + i - k]=   tx - ty;
                k+=d; ty+=dy;
            }
            tx+=dx;
        }
        c=c||1;  o[center]=c;
        return o;
    }
    
    function twos2(d, c, s, cf)
    {
        var l=d*d, half=d>>1, center=l>>1, i, j, k, 
            o=new CM(l), T=new CM(l), 
            tx, ty, dx, dy, f=1/d, 
            delta=1e-8;
        
        if (Abs(c)>delta) { dx=1; dy=s/c; }
        else  { dx=c/s; dy=1; }
        
        i=0; tx=0; ty=0; k=dy*d;
        while (i<=half)
        {
            // compute the transformation of the (diagonal) line
            T[center + i]= ~~(center + tx + ty + 0.5);
            T[center - i]= ~~(center - tx - ty + 0.5);
            i++; tx+=dx; ty+=k;
        }
        /*console.log(dx, dy);
        if (Abs(dx)>Abs(dy)) { vy=1; vx=0; }
        else if (Abs(dx)<Abs(dy)) { vy=0; vx=1; }
        else { vy=0; vx=0; }
        norm=1/(2*(Abs(dx)+Abs(dy)-1));
        fact=(vx + vy)*norm/d;*/
        i=0;
        while (i<=half)
        {
            // do the mapping of the base line to the transformed one
            o[T[center + i]]=o[T[center - i]]=f;
            // anti-aliasing ??..
            i++;
        }
        cf=cf||1; o[center]=cf;
        return o;
    }
    
    // speed-up convolution for special kernels like moving-average
    function integralConvolution(im, w, h, matrix, matrix2, dimX, dimY, factor, bias, numRepeats) 
    {
        var imLen=im.length, imArea, integral, integralLen, colR, colG, colB, /*colA=0,*/
            matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
            dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
            i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
            xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2,
            r, g, b, /*a,*/ r2, g2, b2, coeff1, coeff2,
            repeat
            ;
        
        // convolution speed-up based on the integral image concept and symmetric / separable kernels
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        imArea=w*h;
        matArea=matRadiusX*matRadiusY;
        matHalfSideX=matRadiusX>>1;  matHalfSideY=w*(matRadiusY>>1);
        // one additional offest needed due to integral computation
        matOffsetLeft = -matHalfSideX-1; matOffsetTop = -matHalfSideY-w;
        matOffsetRight = matHalfSideX; matOffsetBottom = matHalfSideY;
        bx1=0; bx2=w-1; by1=0; by2=imArea-w;
        
        integralLen=(imArea<<1)+imArea;  rowLen=(w<<1)+w;
        
        numRepeats=numRepeats||1;  repeat=0;
        
        if (matrix2) // allow to compute a second matrix in-parallel
        {
            wt=matrix[0]; wtCenter=matrix[matArea>>1]; centerOffset=wtCenter-wt;
            wt2=matrix2[0]; wtCenter2=matrix2[matArea>>1]; centerOffset2=wtCenter2-wt2;
            coeff1=factor;  coeff2=bias;
            
            // do this multiple times??
            while (repeat<numRepeats)
            {
            
                dst=new IMG(imLen); integral=new A32F(integralLen);
                
                // compute integral of image in one pass
                // first row
                i=0; j=0; x=0;colR=colG=colB=0;
                while (x<w)
                {
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                    i+=4; j+=3; x++;
                }
                // other rows
                i=rowLen+w; j=rowLen; x=0; colR=colG=colB=0;
                while (i<imLen)
                {
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j]=integral[j-rowLen]+colR; integral[j+1]=integral[j-rowLen+1]+colG; integral[j+2]=integral[j-rowLen+2]+colB;
                    i+=4; j+=3; x++; if (x>=w) { x=0; colR=colG=colB=0; }
                }
                
                
                // now can compute any symmetric convolution kernel in constant time 
                // depending only on image dimensions, regardless of matrix radius
                
                // do direct convolution
                i=0; x=0; y=0; ty=0;
                while (i<imLen)
                {
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                    xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;
                    
                    // fix borders
                    if (xOff1<bx1) xOff1=bx1;
                    else if (xOff2>bx2) xOff2=bx2;
                    if (yOff1<by1) yOff1=by1;
                    else if (yOff2>by2) yOff2=by2;
                    
                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                    // arguably faster way to write p1*=3; etc..
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                    //p1*=3; p2*=3; p3*=3; p4*=3;
                    
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
                        if (t0<0) t0=0;
                        else if (t0>255) t0=255;
                        if (t1<0) t1=0;
                        else if (t1>255) t1=255;
                        if (t2<0) t2=0;
                        else if (t2>255) t2=255;
                    }
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                    
                    // update image coordinates
                    i+=4; x++; if (x>=w) { x=0; y++; ty+=w; }
                }
                
                // do another pass??
                im=dst;  repeat++;
            }
        }
        else
        {
            wt=matrix[0]; wtCenter=matrix[matArea>>1]; centerOffset=wtCenter-wt;
            factor=factor||1;  bias=bias||0;
        
            // do this multiple times??
            while (repeat<numRepeats)
            {
            
                dst=new IMG(imLen); integral=new A32F(integralLen);
                
                // compute integral of image in one pass
                // first row
                i=0; j=0; x=0; colR=colG=colB=0;
                while (x<w)
                {
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                    i+=4; j+=3; x++;
                }
                // other rows
                i=rowLen+w; j=rowLen; x=0; colR=colG=colB=0;
                while (i<imLen)
                {
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j]=integral[j-rowLen]+colR; integral[j+1]=integral[j-rowLen+1]+colG; integral[j+2]=integral[j-rowLen+2]+colB;
                    i+=4; j+=3; x++; if (x>=w) { x=0; colR=colG=colB=0; }
                }
                
                
                // now can compute any symmetric convolution kernel in constant time 
                // depending only on image dimensions, regardless of matrix radius
                
                // do direct convolution
                i=0; x=0; y=0; ty=0;
                while (i<imLen)
                {
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                    xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;
                    
                    // fix borders
                    if (xOff1<bx1) xOff1=bx1;
                    else if (xOff2>bx2) xOff2=bx2;
                    if (yOff1<by1) yOff1=by1;
                    else if (yOff2>by2) yOff2=by2;
                    
                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                    // arguably faster way to write p1*=3; etc..
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                    //p1*=3; p2*=3; p3*=3; p4*=3;
                    
                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1])  +  (centerOffset * im[i]);
                    g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                    b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                    
                    // output
                    t0 = factor*r+bias;  t1 = factor*g+bias;  t2 = factor*b+bias;
                    if (notSupportClamp)
                    {   
                        // clamp them manually
                        if (t0<0) t0=0;
                        else if (t0>255) t0=255;
                        if (t1<0) t1=0;
                        else if (t1>255) t1=255;
                        if (t2<0) t2=0;
                        else if (t2>255) t2=255;
                    }
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                    
                    // update image coordinates
                    i+=4; x++; if (x>=w) { x=0; y++; ty+=w; }
                }
                
                // do another pass??
                im=dst;  repeat++;
            }
        }
        return dst;
    }
    
    // speed-up convolution for separable kernels
    function separableConvolution(im, w, h, matrix, matrix2, dim1, dim2, coeff1, coeff2/*, factor, bias*/) 
    {
        var imLen=im.length, imArea,
            matRadiusXA, matRadiusYA, matHalfSideXA, matHalfSideYA, matAreaA, matA,
            matRadiusX, matRadiusY, matHalfSideX, matHalfSideY, matArea, mat,
            dst, hsw, matIndices, imageIndices,
            i, j, k, x, /*y,*/ ty, ty2,
            xOff, yOff, bx, by, t0, t1, t2, wt,
            r, g, b, coeffs, coeff,
            /*pass,*/ numPasses
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        imArea=w*h;
        matAreaA=[dim2, dim1];
        matA=[matrix2, matrix];
        matRadiusXA=[1, dim1];
        matRadiusYA=[dim2, 1];
        matHalfSideXA=[0, dim1>>1];
        matHalfSideYA=[dim2>>1, 0];
        coeffs=[coeff2, coeff1];
        
        bx=w-1; by=imArea-w;
        //factor=factor||1;  bias=bias||0;
        
        // one horizontal and one vertical pass
        numPasses=2;  //pass=0;
        while (--numPasses)
        {
            dst=new IMG(imLen);
            
            matArea=matAreaA[numPasses];
            mat=matA[numPasses];
            matHalfSideX=matHalfSideXA[numPasses];
            matHalfSideY=matHalfSideYA[numPasses];
            matRadiusX=matRadiusXA[numPasses];
            coeff=coeffs[numPasses];
            
            // pre-compute indices, 
            imageIndices=new A16I(matArea<<1); matIndices=new A8U(matArea);
            // reduce redundant computations inside the main convolution loop (faster)
            j=0; k=0; x=0; ty=0; ty2=0; hsw=matHalfSideY*w;
            while (k<matArea)
            { 
                matIndices[k] = x + ty; 
                imageIndices[j] = x-matHalfSideX; imageIndices[j+1] = ty2-hsw;
                j+=2; k++; x++; if (x>=matRadiusX) { x=0; ty+=matRadiusX; ty2+=w; }
            } 
        
            // do direct convolution
            i=0; x=0; ty=0;
            while (i<imLen)
            {
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=0; g=0; b=0;
                j=0; k=0;
                while (k < matArea)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2; wt=coeff * mat[matIndices[k]];
                        r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    }
                    j+=2; k++;
                }
                
                // output
                /*if (pass)
                {
                    t0 = factor*coeff*r + bias;  t1 = factor*coeff*g + bias;  t2 = factor*coeff*b + bias;
                }
                else
                {
                    t0 = coeff*r;  t1 = coeff*g;  t2 = coeff*b;
                }*/
                t0 = r;  t1 = g;  t2 = b;
                
                if (notSupportClamp)
                {   
                    // clamp them manually
                    if (t0<0) t0=0;
                    else if (t0>255) t0=255;
                    if (t1<0) t1=0;
                    else if (t1>255) t1=255;
                    if (t2<0) t2=0;
                    else if (t2>255) t2=255;
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
                
                // update image coordinates
                i+=4; x++; if (x>=w) { x=0; ty+=w; }
            }
            
            // do another pass??
            im=dst;  //pass++;
        }
        return dst;
    }
    
    // some common convolution cases can be handled faster (3x3)
    function convolution3(im, w, h, matrix, matrix2, factor, bias, _isGrad) 
    {
        var 
            matRadiusX=matRadiusY=3, matHalfSideX=matHalfSideY=1, 
            matArea=9, matArea2=18, hsw=w, wt, wt2,
            imageIndices=new A16I(18), matIndices=new A8U(9),
            imArea=w*h, imLen=im.length, dst=new IMG(imLen), t0, t1, t2,
            i, j, k, x, ty, ty2, xOff, yOff, srcOff, r, g, b, r2, g2, b2,
            bx=w-1, by=imArea-w,
            coeff1=factor, coeff2=bias
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        j=0; k=0; x=0; ty=0; ty2=0;
        while (k<matArea)
        { 
            matIndices[k] = x + ty; 
            imageIndices[j] = x-matHalfSideX; imageIndices[j+1] = ty2-hsw;
            j+=2; k++; x++; if (x>=matRadiusX) { x=0; ty+=matRadiusX; ty2+=w; }
        } 
        
        // apply filter (algorithm direct implementation based on filter definition with some optimizations)
        if (matrix2) // allow to compute a second matrix in-parallel in same pass
        {
            // do direct convolution
            i=0; x=0; ty=0;
            while (i<imLen)
            {
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=0; g=0; b=0; r2=0; g2=0; b2=0; 
                xOff=x + imageIndices[0]; yOff=ty + imageIndices[1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[0]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[0]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[2]; yOff=ty + imageIndices[3];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[1]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[1]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[4]; yOff=ty + imageIndices[5];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[2]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[2]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[6]; yOff=ty + imageIndices[7];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[3]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[3]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[8]; yOff=ty + imageIndices[9];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[4]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[4]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[10]; yOff=ty + imageIndices[11];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[5]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[5]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[12]; yOff=ty + imageIndices[13];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[6]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[6]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[14]; yOff=ty + imageIndices[15];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[7]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[7]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[16]; yOff=ty + imageIndices[17];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[8]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[8]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                
                // output
                if (_isGrad)
                {
                    t0 = Abs(r)+Abs(r2);  t1 = Abs(g)+Abs(g2);  t2 = Abs(b)+Abs(b2);
                }
                else
                {
                    t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                }
                if (notSupportClamp)
                {   
                    // clamp them manually
                    if (t0<0) t0=0;
                    else if (t0>255) t0=255;
                    if (t1<0) t1=0;
                    else if (t1>255) t1=255;
                    if (t2<0) t2=0;
                    else if (t2>255) t2=255;
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
                
                // update image coordinates
                i+=4; x++; if (x>=w) { x=0; ty+=w; }
            }
        }
        else
        {
            // do direct convolution
            i=0; x=0; ty=0;
            while (i<imLen)
            {
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=0; g=0; b=0;
                xOff=x + imageIndices[0]; yOff=ty + imageIndices[1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[0]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[2]; yOff=ty + imageIndices[3];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[1]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[4]; yOff=ty + imageIndices[5];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[2]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[6]; yOff=ty + imageIndices[7];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[3]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[8]; yOff=ty + imageIndices[9];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[4]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[10]; yOff=ty + imageIndices[11];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[5]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[12]; yOff=ty + imageIndices[13];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[6]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[14]; yOff=ty + imageIndices[15];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[7]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[16]; yOff=ty + imageIndices[17];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[8]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                
                // output
                t0 = factor*r+bias;  t1 = factor*g+bias;  t2 = factor*b+bias;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    if (t0<0) t0=0;
                    else if (t0>255) t0=255;
                    if (t1<0) t1=0;
                    else if (t1>255) t1=255;
                    if (t2<0) t2=0;
                    else if (t2>255) t2=255;
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
                
                // update image coordinates
                i+=4; x++; if (x>=w) { x=0; ty+=w; }
            }
        }
        return dst;
    }
    
    // some common convolution cases can be handled faster (5x5)
    function convolution5(im, w, h, matrix, matrix2, factor, bias, _isGrad) 
    {
        var 
            matRadiusX=matRadiusY=5, matHalfSideX=matHalfSideY=2, 
            matArea=25, matArea2=50, hsw=w, wt, wt2,
            imageIndices=new A16I(50), matIndices=new A8U(25),
            imArea=w*h, imLen=im.length, dst=new IMG(imLen), t0, t1, t2,
            i, j, k, x, ty, ty2, xOff, yOff, srcOff, r, g, b, r2, g2, b2,
            bx=w-1, by=imArea-w,
            coeff1=factor, coeff2=bias
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        j=0; k=0; x=0; ty=0; ty2=0;
        while (k<matArea)
        { 
            matIndices[k] = x + ty; 
            imageIndices[j] = x-matHalfSideX; imageIndices[j+1] = ty2-hsw;
            j+=2; k++; x++; if (x>=matRadiusX) { x=0; ty+=matRadiusX; ty2+=w; }
        } 
        
        // apply filter (algorithm direct implementation based on filter definition with some optimizations)
        if (matrix2) // allow to compute a second matrix in-parallel in same pass
        {
            // do direct convolution
            i=0; x=0; ty=0;
            while (i<imLen)
            {
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=0; g=0; b=0; r2=0; g2=0; b2=0; 
                xOff=x + imageIndices[0]; yOff=ty + imageIndices[1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[0]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[0]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[2]; yOff=ty + imageIndices[3];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[1]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[1]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[4]; yOff=ty + imageIndices[5];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[2]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[2]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[6]; yOff=ty + imageIndices[7];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[3]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[3]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[8]; yOff=ty + imageIndices[9];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[4]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[4]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[10]; yOff=ty + imageIndices[11];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[5]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[5]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[12]; yOff=ty + imageIndices[13];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[6]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[6]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[14]; yOff=ty + imageIndices[15];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[7]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[7]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[16]; yOff=ty + imageIndices[17];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[8]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[8]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[18]; yOff=ty + imageIndices[19];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[9]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[9]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[20]; yOff=ty + imageIndices[21];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[10]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[10]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[22]; yOff=ty + imageIndices[23];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[11]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[11]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[24]; yOff=ty + imageIndices[25];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[12]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[12]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[26]; yOff=ty + imageIndices[27];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[13]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[13]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[28]; yOff=ty + imageIndices[29];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[14]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[14]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[30]; yOff=ty + imageIndices[31];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[15]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[15]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[32]; yOff=ty + imageIndices[33];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[16]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[16]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[34]; yOff=ty + imageIndices[35];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[17]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[17]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[36]; yOff=ty + imageIndices[27];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[18]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[18]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[38]; yOff=ty + imageIndices[39];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[19]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[19]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[40]; yOff=ty + imageIndices[41];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[20]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[20]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[42]; yOff=ty + imageIndices[43];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[21]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[21]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[44]; yOff=ty + imageIndices[45];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[22]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[22]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[46]; yOff=ty + imageIndices[47];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[23]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[23]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                xOff=x + imageIndices[48]; yOff=ty + imageIndices[49];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[24]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                    // allow to apply a second similar matrix in-parallel (eg for total gradients)
                    wt2=matrix2[matIndices[24]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                }
                
                // output
                if (_isGrad)
                {
                    t0 = Abs(r)+Abs(r2);  t1 = Abs(g)+Abs(g2);  t2 = Abs(b)+Abs(b2);
                }
                else
                {
                    t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                }
                if (notSupportClamp)
                {   
                    // clamp them manually
                    if (t0<0) t0=0;
                    else if (t0>255) t0=255;
                    if (t1<0) t1=0;
                    else if (t1>255) t1=255;
                    if (t2<0) t2=0;
                    else if (t2>255) t2=255;
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
                
                // update image coordinates
                i+=4; x++; if (x>=w) { x=0; ty+=w; }
            }
        }
        else
        {
            // do direct convolution
            i=0; x=0; ty=0;
            while (i<imLen)
            {
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=0; g=0; b=0;
                xOff=x + imageIndices[0]; yOff=ty + imageIndices[1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[0]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[2]; yOff=ty + imageIndices[3];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[1]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[4]; yOff=ty + imageIndices[5];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[2]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[6]; yOff=ty + imageIndices[7];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[3]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[8]; yOff=ty + imageIndices[9];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[4]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[10]; yOff=ty + imageIndices[11];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[5]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[12]; yOff=ty + imageIndices[13];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[6]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[14]; yOff=ty + imageIndices[15];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[7]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[16]; yOff=ty + imageIndices[17];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[8]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[18]; yOff=ty + imageIndices[19];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[9]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[20]; yOff=ty + imageIndices[21];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[10]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[22]; yOff=ty + imageIndices[23];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[11]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[24]; yOff=ty + imageIndices[25];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[12]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[26]; yOff=ty + imageIndices[27];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[13]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[28]; yOff=ty + imageIndices[29];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[14]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[30]; yOff=ty + imageIndices[31];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[15]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[32]; yOff=ty + imageIndices[33];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[16]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[34]; yOff=ty + imageIndices[35];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[17]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[36]; yOff=ty + imageIndices[27];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[18]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[38]; yOff=ty + imageIndices[39];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[19]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[40]; yOff=ty + imageIndices[41];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[20]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[42]; yOff=ty + imageIndices[43];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[21]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[44]; yOff=ty + imageIndices[45];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[22]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[46]; yOff=ty + imageIndices[47];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[23]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                xOff=x + imageIndices[48]; yOff=ty + imageIndices[49];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2; 
                    wt=matrix[matIndices[24]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                }
                
                // output
                t0 = factor*r+bias;  t1 = factor*g+bias;  t2 = factor*b+bias;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    if (t0<0) t0=0;
                    else if (t0>255) t0=255;
                    if (t1<0) t1=0;
                    else if (t1>255) t1=255;
                    if (t2<0) t2=0;
                    else if (t2>255) t2=255;
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
                
                // update image coordinates
                i+=4; x++; if (x>=w) { x=0; ty+=w; }
            }
        }
        return dst;
    }
    
    //
    //
    //  Convolution Matrix Filter
    var ConvolutionMatrixFilter = FILTER.ConvolutionMatrixFilter = FILTER.Extends( FILTER.Filter,
    {
        
        name : "ConvolutionMatrixFilter",
        
        constructor: function(weights, factor, bias) {
            this._coeff=new CM([1.0, 0.0]);
            
            if ( weights && weights.length)
            {
                this.set(weights, ~~(Sqrt(weights.length)+0.5), factor||1.0, bias||0.0);
            }
            else 
            {
                this._matrix=null; this._dim = 0;
            }
            this._matrix2=null;  this._dim2=this._dim;
            this._isGrad=false; this._doIntegral=0; this._doSeparable=false;
            
            if ( FILTER.useWebGL )  this._webglInstance = FILTER.WebGLConvolutionMatrixFilterInstance;
        },
        
        _dim: 0,
        _dim2: 0,
        _matrix: null,
        _matrix2: null,
        _coeff: null,
        _isGrad: false,
        _doIntegral: 0,
        _doSeparable: false,
        
        _webglInstance: null,
        
        // generic low-pass filter
        lowPass : function(d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            this.set(ones(d), d, 1/(d*d), 0.0);
            this._doIntegral=1; return this;
        },

        // generic high-pass filter (I-LP)
        highPass : function(d, f) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            f = ( f === undef ) ? 1 : f;
            // HighPass Filter = I - (respective)LowPass Filter
            var size=d*d, fact=-f/size, w=ones(d, fact, 1+fact);
            this.set(w, d, 1.0, 0.0);
            this._doIntegral=1; return this;
        },

        glow : function(f, d) { 
            f = ( f === undef ) ? 0.5 : f;  
            return this.highPass(d, -f); 
        },
        
        sharpen : function(f, d) { 
            f = ( f === undef ) ? 0.5 : f;  
            return this.highPass(d, f); 
        },
        
        verticalBlur : function(d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            //var filt=verticalKernel(d);
            //this.set(filt.kernel, 1, 1/filt.sum); 
            this.set(average1DKernel(d), 1, 1/d, 0.0); 
            this._dim2=d; this._doIntegral=1; return this;
        },
        
        horizontalBlur : function(d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            //var filt=horizontalKernel(d);
            //this.set(filt.kernel, d, 1/filt.sum); 
            this.set(average1DKernel(d), d, 1/d, 0.0); 
            this._dim2=1; this._doIntegral=1; return this;
        },
        
        // supports only vertical, horizontal, diagonal
        directionalBlur : function(theta, d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            theta *= toRad;
            var c = Cos(theta), s = -Sin(theta),
                filt = twos2(d, c, s, 1/d);
            return this.set(filt, d, 1.0, 0.0);
        },
        
        // fast gauss filter
        fastGauss : function(quality, d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            quality = ~~(quality||1);
            if ( quality < 1 ) quality = 1;
            else if ( quality > 3 ) quality = 3;
            this.set(ones(d), d, 1/(d*d), 0.0);
            this._doIntegral=quality; return this;
        },
        
        // generic binomial(quasi-gaussian) low-pass filter
        binomialLowPass : function(d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            /*var filt=gaussKernel(d);
            return this.set(filt.kernel, d, 1/filt.sum); */
            var kernel=binomial1DKernel(d), sum=1<<(d-1), fact=1/sum;
            this.set(kernel, d, fact, fact);
            this._matrix2=new CM(kernel);
            this._doSeparable=true; return this;
        },

        // generic binomial(quasi-gaussian) high-pass filter
        binomialHighPass : function(d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt=gaussKernel(d);
            // HighPass Filter = I - (respective)LowPass Filter
            return this.set(blendMatrix(ones(d), new CM(filt.kernel), 1, -1/filt.sum), d, 1.0, 0.0); 
        },
        
        // X-gradient, partial X-derivative (Prewitt)
        prewittX : function(d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt=prewittKernel(d, 0);
            // this can be separable
            return this.set(filt.kernel, d, 1.0, 0.0);
        },
        
        // Y-gradient, partial Y-derivative (Prewitt)
        prewittY : function(d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt=prewittKernel(d, 1);
            // this can be separable
            return this.set(filt.kernel, d, 1.0, 0.0);
        },
        
        // directional gradient (Prewitt)
        prewittDirectional : function(theta, d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            theta*=toRad;
            var c=Cos(theta), s=Sin(theta),
                gradx=prewittKernel(d, 0), grady=prewittKernel(d, 1);
            return this.set(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), d, 1.0, 0.0);
        },
        
        // gradient magnitude (Prewitt)
        prewitt : function(d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var gradx=prewittKernel(d, 0), grady=prewittKernel(d, 1);
            this.set(gradx.kernel, d, 1.0, 0.0);
            this._isGrad=true;
            this._matrix2=new CM(grady.kernel);
            return this;
        },
        
        // partial X-derivative (Sobel)
        sobelX : function(d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt=sobelKernel(d, 0);
            // this can be separable
            return this.set(filt.kernel, d, 1.0, 0.0);
        },
        
        // partial Y-derivative (Sobel)
        sobelY : function(d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt=sobelKernel(d, 1);
            // this can be separable
            return this.set(filt.kernel, d, 1.0, 0.0);
        },
        
        // directional gradient (Sobel)
        sobelDirectional : function(theta, d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            theta*=toRad;
            var c=Cos(theta), s=Sin(theta),
                gradx=sobelKernel(d, 0), grady=sobelKernel(d, 1);
            return this.set(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), d, 1.0, 0.0);
        },
        
        // gradient magnitude (Sobel)
        sobel : function(d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var gradx=sobelKernel(d, 0), grady=sobelKernel(d, 1);
            this.set(gradx.kernel, d, 1.0, 0.0);
            this._matrix2=new CM(grady.kernel);
            this._isGrad=true;
            return this;
        },
        
        /*laplace : function(d) {
            /*return this.set([
                    0,   -1,   0,
                    -1,  4,   -1,
                    0,   -1,   0
                ], 3, 1);* /
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var laplacian=ones(d, -1), size=d*d, center=(size>>1);
            laplacian[center]=size-1;
            return this.set(laplacian, d, 1);
        },*/
        
        laplace : function(d) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var size=d*d, laplacian=ones(d, -1, size-1);
            this.set(laplacian, d, 1.0, 0.0);
            this._doIntegral=1; return this;
        },
        
        emboss : function(angle, amount, d) {
            /*return this.set([
                    -x-y,  -y,  -y+x,
                     -x,    1,   x,
                     y-x,   y,   y+x
                 ], 3, 1);*/
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            angle=( angle === undef ) ? (-0.25*Math.PI) : (angle*toRad);
            amount=amount||1;
            var dx = amount*Cos(angle), dy = -amount*Sin(angle), filt=twos(d, dx, dy, 1);
            return this.set(filt, d, 1.0, 0.0);
        },
        
        edges : function(m) {
            m=m||1;
            return this.set([
                    0,   m,   0,
                    m,  -4*m, m,
                    0,   m,   0
                 ], 3, 1.0, 0.0);
        },
        
        /*motionblur : function(dir, d) {
            var w=1, i,j, wm=[
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0
                     ];
            if (dir==0)
            {
                for (i=0;i<9;i++)
                {
                    wm[4*9+i]=w;
                }
            }
            else if (dir==2)
            {
                for (i=0;i<9;i++)
                {
                    wm[9*i+5]=w;
                }
            }
            else if (dir==1)
            {
                for (i=0;i<9;i++)
                {
                    wm[9*i+i]=w;
                }
            }
            return this.set(wm, 9, 1/9);
        },*/
        
        set : function(m, d, f, b) {
            this._matrix2=null; this._isGrad=false; this._doIntegral=0; this._doSeparable=false;
            this._matrix=new CM(m); this._dim2=this._dim=d; this._coeff[0]=f||1; this._coeff[1]=b||0;
            return this;
        },
        
        reset : function() {
            this._matrix=null; this._matrix2=null; this._dim=0; this._dim2=0;
            this._isGrad=false; this._doIntegral=0; this._doSeparable=false;
            return this;
        },
        
        combineWith : function(filt) {
            // matrices/kernels need to be convolved -> larger kernel->tensor in order to be actually combined
            // todo??
            return this;
        },
        
        getMatrix : function() {
            return this._matrix;
        },
        
        setMatrix : function(m, d) {
            this._matrix=m; this._dim2=this._dim=d;
            this._matrix2=null; this._coeff[0]=1; this._coeff[1]=0; this._isGrad=false; this._doIntegral=0; this._doSeparable=false;
            return this;
        },
        
        // used for internal purposes
        _apply : function(im, w, h/*, image*/) {
            
            if ( !this._isOn || !this._matrix ) return im;
            
            // use a faster convolution if possible
            if (this._doIntegral) 
            {
                if (this._matrix2)
                    return integralConvolution(im, w, h, this._matrix, this._matrix2, this._dim, this._dim2, this._coeff[0], this._coeff[1], this._doIntegral);
                else
                    return integralConvolution(im, w, h, this._matrix, null, this._dim, this._dim2, this._coeff[0], this._coeff[1], this._doIntegral);
            }
            // handle some common cases fast
            else if (this._doSeparable)
            {
                return separableConvolution(im, w, h, this._matrix, this._matrix2, this._dim, this._dim2, this._coeff[0], this._coeff[1]/*, this._factor, this._bias*/);
            }
            else if (3==this._dim)
            {
                if (this._matrix2)
                    return convolution3(im, w, h, this._matrix, this._matrix2, this._coeff[0], this._coeff[1], this._isGrad);
                else
                    return convolution3(im, w, h, this._matrix, null, this._coeff[0], this._coeff[1], false);
            }
            else if (5==this._dim)
            {
                if (this._matrix2)
                    return convolution5(im, w, h, this._matrix, this._matrix2, this._coeff[0], this._coeff[1], this._isGrad);
                else
                    return convolution5(im, w, h, this._matrix, null, this._coeff[0], this._coeff[1], false);
            }
            
            var 
                matRadiusX=this._dim, matRadiusY=this._dim, matHalfSideX=matRadiusX>>1, matHalfSideY=matRadiusY>>1, 
                matArea=matRadiusX*matRadiusY, matArea2=matArea<<1, hsw=matHalfSideY*w,
                mat=this._matrix, mat2=this._matrix2, wt, wt2,
                _isGrad=this._isGrad, imageIndices=new A16I(matArea<<1), matIndices=new A8U(matArea),
                imArea=w*h, imLen=im.length, dst=new IMG(imLen), t0, t1, t2,
                i, j, k, x, ty, ty2, xOff, yOff, srcOff, r, g, b, r2, g2, b2,
                bx=w-1, by=imArea-w,
                coeff1=this._coeff[0], coeff2=this._coeff[1]
                ;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            j=0; k=0; x=0; ty=0; ty2=0;
            while (k<matArea)
            { 
                matIndices[k] = x + ty; 
                imageIndices[j] = x-matHalfSideX; imageIndices[j+1] = ty2-hsw;
                j+=2; k++; x++; if (x>=matRadiusX) { x=0; ty+=matRadiusX; ty2+=w; }
            } 
            
            // apply filter (algorithm direct implementation based on filter definition with some optimizations)
            if (mat2) // allow to compute a second matrix in-parallel in same pass
            {
                // do direct convolution
                i=0; x=0; ty=0;
                while (i<imLen)
                {
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=0; g=0; b=0; r2=0; g2=0; b2=0; 
                    j=0; k=0;
                    while (k < matArea)
                    {
                        xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                        if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                        {
                            srcOff=(xOff + yOff)<<2; 
                            wt=mat[matIndices[k]]; r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                            // allow to apply a second similar matrix in-parallel (eg for total gradients)
                            wt2=mat2[matIndices[k]]; r2+=im[srcOff] * wt2; g2+=im[srcOff+1] * wt2;  b2+=im[srcOff+2] * wt2;
                        }
                        j+=2; k++;
                    }
                    
                    // output
                    if (_isGrad)
                    {
                        t0 = Abs(r)+Abs(r2);  t1 = Abs(g)+Abs(g2);  t2 = Abs(b)+Abs(b2);
                    }
                    else
                    {
                        t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                    }
                    if (notSupportClamp)
                    {   
                        // clamp them manually
                        if (t0<0) t0=0;
                        else if (t0>255) t0=255;
                        if (t1<0) t1=0;
                        else if (t1>255) t1=255;
                        if (t2<0) t2=0;
                        else if (t2>255) t2=255;
                    }
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = src[i+3];
                    
                    // update image coordinates
                    i+=4; x++; if (x>=w) { x=0; ty+=w; }
                }
            }
            else
            {
                // do direct convolution
                i=0; x=0; ty=0;
                while (i<imLen)
                {
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=0; g=0; b=0;
                    j=0; k=0;
                    while (k < matArea)
                    {
                        xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                        if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                        {
                            srcOff=(xOff + yOff)<<2; wt=mat[matIndices[k]];
                            r+=im[srcOff] * wt; g+=im[srcOff+1] * wt;  b+=im[srcOff+2] * wt;
                        }
                        j+=2; k++;
                    }
                    
                    // output
                    t0 = coeff1*r+coeff2;  t1 = coeff1*g+coeff2;  t2 = coeff1*b+coeff2;
                    if (notSupportClamp)
                    {   
                        // clamp them manually
                        if (t0<0) t0=0;
                        else if (t0>255) t0=255;
                        if (t1<0) t1=0;
                        else if (t1>255) t1=255;
                        if (t2<0) t2=0;
                        else if (t2>255) t2=255;
                    }
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = src[i+3];
                    
                    // update image coordinates
                    i+=4; x++; if (x>=w) { x=0; ty+=w; }
                }
            }
            return dst;
        },
        
        apply : function(image) {
            if ( this._isOn && this._matrix )
            {
            /*if (this._webglInstance)
            {
                var w=image.width, h=image.height;
                this._webglInstance.filterParams=[
                    new CM([w, h]),
                    1.0,
                    new CM([w, h]),
                    this._coeff, 
                    (this._matrix2) ? 1 : 0,
                    (this._isGrad) ? 1 : 0,
                    this._dim>>1,
                    this._dim2>>1,
                    this._matrix.length,
                    this._matrix,
                    (this._matrix2) ? this._matrix2 : new CM([0])
                ];
                this._webglInstance._apply(image.webgl, w, h);
                return image;
            }
            else
            {*/
                return image.setData(this._apply(image.getData(), image.width, image.height, image));
            /*}*/
            }
            return image;
        }
    });
    // aliases
    ConvolutionMatrixFilter.prototype.boxBlur = ConvolutionMatrixFilter.prototype.lowPass;
    ConvolutionMatrixFilter.prototype.gaussBlur = ConvolutionMatrixFilter.prototype.binomialLowPass;
    ConvolutionMatrixFilter.prototype.gradX = ConvolutionMatrixFilter.prototype.prewittX;
    ConvolutionMatrixFilter.prototype.gradY = ConvolutionMatrixFilter.prototype.prewittY;
    ConvolutionMatrixFilter.prototype.gradDirectional = ConvolutionMatrixFilter.prototype.prewittDirectional;
    ConvolutionMatrixFilter.prototype.grad = ConvolutionMatrixFilter.prototype.prewitt;
        
    
    /*function multiplyMatrix(m1, m2, d) 
    {
        var i, j, k, m=new CM(m1.length), sum, id=0, jd=0, kd=0;
        for (i=0; i<d; i++)
        {
            //jd=0;
            for (j=0; j<d; j++)
            {
                sum=0; kd=0;
                for (k=0; k<d; k++) { sum+=m1[id + k]*m2[kd + j]; kd+=d; }
                m[id + j]=sum; //jd+=d;
            }
            id+=d;
        }
        return m;
    }
    
    function unit(d) 
    { 
        d=(0==d%2) ? d+1 : d;
        var l=d*d, i, center=(l>>2)+1, e=new CM(l);
        for (i=0; i<l; i++) e[i]=0;  e[center]=1;
        return e;
    }
    
    function eye(d) 
    { 
        d=(0==d%2) ? d+1 : d;
        var l=d*d, k, i=0, j=0, e=new CM(l);
        for (k=0; k<l; k++) { if (i==j) e[k]=1; else e[k]=0; j++; if (d==j) { i++; j=0; } }
        return e;
    }*/
    
    
})(FILTER);