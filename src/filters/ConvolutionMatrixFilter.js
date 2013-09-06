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
(function(FILTER){
    
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
    
    var IMG = FILTER.ImArray,
        // Convolution Matrix
        CM=FILTER.Array32F,
        
        // hardcode Pascal numbers, used for binomial kernels
        _pascal=[
            [1],
            [1,	1],
            [1,	2,	1],
            [1,	3,	3, 	1],
            [1,	4, 	6, 	4, 	1],
            [1,	5, 	10,	10,	5, 	1],
            [1,	6, 	15,	20,	15,	6, 	1],
            [1,	7, 	21,	35,	35,	21,	7, 	1],
            [1,	8, 	28,	56,	70,	56,	28,	8, 	1]
        ],
        sqrt2=FILTER.CONSTANTS.SQRT2,
        toRad=FILTER.CONSTANTS.toRad, toDeg=FILTER.CONSTANTS.toDeg,
        Abs=Math.abs, Sqrt=Math.sqrt, Sin=Math.sin, Cos=Math.cos
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
        /*
        else // recursive kernels
        {
            for (i=0; i<kl; i++)
            {
                for (j=0; j<kl; j++) { k=convolveKernels(k1[i], k2[j]);  sum+=k.sum;  ker=ker.concat(k.ker); }
            }
        }*/
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
        var l=_pascal.length, row, uprow;
        d--;
        if (d<l)
        {
            row=_pascal[d].slice();
        }
        else
        {
            // else compute them iteratively
            row=new CM(_pascal[l-1]);
            while (l<=d)
            {
                uprow=row.slice(); row=[1];
                for (i=0, il=uprow.length-1; i<il; i++) { row.push(uprow[i]+uprow[i+1]); } row.push(1);
                if (l<40) _pascal.push(row.slice()); // save it for future dynamically
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
    
    function ones(d, f) 
    { 
        f=f||1;
        var l=d*d, i, o=new CM(l);
        i=0; while(i<l) { o[i]=f; i++; }
        return o;
    }
    
    function twos(d, dx, dy)
    {
        var l=d*d, half=d>>1, i, k, o=new CM(l), x, y, x0, y0;
        x0=-half*dx; y0=-half*dy; x=x0; y=y0; i=0; k=0;
        while (i<l)
        {
            o[i]=x + y; i++; k++; x+=dx;
            if (k>=d) { k=0; x=x0; y+=dy; }
        }
        return o;
    }
    
    // speed-up convolution for special kernels like moving-average
    function integralConvolution(src, w, h, matrix, matrix2, dimX, dimY, factor, bias, numRepeats) 
    {
        var imLen=src.length, imArea, integral, integralLen, colR, colG, colB, /*colA=0,*/
            matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
            dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
            i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
            xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, 
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
            
                dst=new IMG(src); integral=new FILTER.Array32F(integralLen);
                
                // compute integral of image in one pass
                // first row
                i=0; j=0; x=0; /*y=0;*/ colR=colG=colB=0;
                while (x<w)
                {
                    colR+=src[i]; colG+=src[i+1]; colB+=src[i+2];
                    integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                    i+=4; j+=3; x++;
                }
                // other rows
                i=rowLen+w; j=rowLen; x=0; /*y=1;*/ colR=colG=colB=0;
                while (i<imLen)
                {
                    colR+=src[i]; colG+=src[i+1]; colB+=src[i+2];
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
                    r = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1])  +  (centerOffset * src[i]);
                    g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * src[i+1]);
                    b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * src[i+2]);
                    
                    r2 = wt2 * (integral[p4] - integral[p2] - integral[p3] + integral[p1])  +  (centerOffset2 * src[i]);
                    g2 = wt2 * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset2 * src[i+1]);
                    b2 = wt2 * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset2 * src[i+2]);
                    
                    // output
                    dst[i] = ~~(coeff1*r + coeff2*r2);  dst[i+1] = ~~(coeff1*g + coeff2*g2);  dst[i+2] = ~~(coeff1*b + coeff2*b2);
                    // alpha channel is not transformed
                    //dst[i+3] = src[i+3];
                    
                    // update image coordinates
                    i+=4; x++; if (x>=w) { x=0; y++; ty+=w; }
                }
                
                // do another pass??
                src=dst;  repeat++;
            }
        }
        else
        {
            wt=matrix[0]; wtCenter=matrix[matArea>>1]; centerOffset=wtCenter-wt;
            factor=factor||1;  bias=bias||0;
        
            // do this multiple times??
            while (repeat<numRepeats)
            {
            
                dst=new IMG(src); integral=new FILTER.Array32F(integralLen);
                
                // compute integral of image in one pass
                // first row
                i=0; j=0; x=0; /*y=0;*/ colR=colG=colB=0;
                while (x<w)
                {
                    colR+=src[i]; colG+=src[i+1]; colB+=src[i+2];
                    integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                    i+=4; j+=3; x++;
                }
                // other rows
                i=rowLen+w; j=rowLen; x=0; /*y=1;*/ colR=colG=colB=0;
                while (i<imLen)
                {
                    colR+=src[i]; colG+=src[i+1]; colB+=src[i+2];
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
                    r = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1])  +  (centerOffset * src[i]);
                    g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * src[i+1]);
                    b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * src[i+2]);
                    
                    // output
                    dst[i] = ~~(factor*r+bias);  dst[i+1] = ~~(factor*g+bias);  dst[i+2] = ~~(factor*b+bias);
                    // alpha channel is not transformed
                    //dst[i+3] = src[i+3];
                    
                    // update image coordinates
                    i+=4; x++; if (x>=w) { x=0; y++; ty+=w; }
                }
                
                // do another pass??
                src=dst;  repeat++;
            }
        }
        return dst;
    }
    
    //
    //
    //  Simple Convolution Filter
    FILTER.ConvolutionMatrixFilter=function(weights, factor, bias)
    {
        if (typeof weights != 'undefined' && weights.length)
        {
            this.set(weights, ~~(Sqrt(weights.length)+0.5), factor||1)
            this._bias=bias||0;
        }
        else 
        {
            this._matrix=null; this._dim = 0;
        }
        this._matrix2=null; this._coeff1=this._coeff2=null; this._isGrad=false; this._doFast=0;
    };
    
    FILTER.ConvolutionMatrixFilter.prototype={
        
        _dim: 0,
        _matrix: null,
        _factor: 1,
        _bias: 0,
        
        // generic low-pass filter
        lowPass : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            this.set(ones(d), d, 1/(d*d));
            this._doFast=1; return this;
        },

        // generic high-pass filter (I-LP)
        highPass : function(d, f) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            f=(typeof f == 'undefined') ? 1 : f;
            // HighPass Filter = I - (respective)LowPass Filter
            var size=d*d, fact=-f/size, w=ones(d, fact), i, center=(size>>1);
            w[center]=1+fact;
            this.set(w, d, 1);
            this._doFast=1; return this;
        },

        // aliases
        boxBlur : function(d) { return this.lowPass(d); },
        
        verticalBlur : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=verticalKernel(d);
            return this.set(filt.kernel, d, 1/filt.sum); 
        },
        
        horizontalBlur : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=horizontalKernel(d);
            return this.set(filt.kernel, d, 1/filt.sum); 
        },
        
        /*directionalBlur : function(theta, d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            theta*=toRad;
            var c=Cos(theta), s=Sin(theta),
                ver=ones(d), hor=ones(d);
            return this.set(multiplyScalar(hor, ver, c, s), d, 1/(d*d));
        },*/
        
        // generic binomial(gaussian) low-pass filter
        binomialLowPass : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=gaussKernel(d);
            return this.set(filt.kernel, d, 1/filt.sum); 
        },

        // generic binomial(gaussian) high-pass filter
        binomialHighPass : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=gaussKernel(d);
            // HighPass Filter = I - (respective)LowPass Filter
            return this.set(blendMatrix(ones(d), new CM(filt.kernel), 1, -1/filt.sum), d, 1); 
        },
        
        // aliases
        gaussBlur : function(d) { return this.binomialLowPass(d); },
        
        // fast gauss filter
        fastGauss : function(quality, d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            quality=quality||1; quality=~~quality;
            if (quality<1) quality=1;
            else if (quality>3) quality=3;
            this.set(ones(d), d, 1/(d*d));
            this._doFast=quality; return this;
        },
        
        sharpen : function(f, d) { 
            f=(typeof f == 'undefined') ? 0.5 : f;  
            if (f<=0)
                return this.set([
                    0, -2, 0, 
                    -2, 10, -2, 
                    0, -2, 0
                ], 3, 0.5);
            else
                return this.highPass(d, f); 
        },
        
        // X-gradient, partial X-derivative (Prewitt)
        prewittX : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=prewittKernel(d, 0);
            return this.set(filt.kernel, d, 1);
        },
        
        // Y-gradient, partial Y-derivative (Prewitt)
        prewittY : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=prewittKernel(d, 1);
            return this.set(filt.kernel, d, 1);
        },
        
        // directional gradient (Prewitt)
        prewittDirectional : function(theta, d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            theta*=toRad;
            var c=Cos(theta), s=Sin(theta),
                gradx=prewittKernel(d, 0), grady=prewittKernel(d, 1);
            return this.set(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), d, 1);
        },
        
        // gradient magnitude (Prewitt)
        prewitt : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var gradx=prewittKernel(d, 0), grady=prewittKernel(d, 1);
            this.set(gradx.kernel, d, 1);
            this._isGrad=true;
            this._matrix2=new CM(grady.kernel);
            return this;
        },
        
        //aliases
        gradX : function(d) { return this.prewittX(d); },
        
        gradY : function(d) { return this.prewittY(d); },
        
        gradDirectional : function(theta, d) { return this.prewittDirectional(theta, d); },
        
        grad : function(d) { return this.prewitt(d); },
        
        // partial X-derivative (Sobel)
        sobelX : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=sobelKernel(d, 0);
            return this.set(filt.kernel, d, 1);
        },
        
        // partial Y-derivative (Sobel)
        sobelY : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=sobelKernel(d, 1);
            return this.set(filt.kernel, d, 1);
        },
        
        // directional gradient (Sobel)
        sobelDirectional : function(theta, d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            theta*=toRad;
            var c=Cos(theta), s=Sin(theta),
                gradx=sobelKernel(d, 0), grady=sobelKernel(d, 1);
            return this.set(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), d, 1);
        },
        
        // gradient magnitude (Sobel)
        sobel : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var gradx=sobelKernel(d, 0), grady=sobelKernel(d, 1);
            this.set(gradx.kernel, d, 1);
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
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var laplacian=ones(d, -1), size=d*d, center=(size>>1);
            laplacian[center]=size-1;
            this.set(laplacian, d, 1);
            this._doFast=1; return this;
        },
        
        emboss : function(angle, amount, d) {
            /*return this.set([
                    -x-y,  -y,  -y+x,
                     -x,    1,   x,
                     y-x,   y,   y+x
                 ], 3, 1);*/
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            angle=(typeof angle == 'undefined') ? (-0.25*Math.PI) : (angle*toRad);
            amount=amount||1;
            var dx = amount*Cos(angle), dy = -amount*Sin(angle), filt=twos(d, dx, dy), size=d*d, center=(size>>1);
            filt[center]=1;
            return this.set(filt, d, 1);
        },
        
        edges : function(m) {
            m=m||1;
            return this.set([
                    0,   m,   0,
                    m,  -4*m, m,
                    0,   m,   0
                 ], 3, 1);
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
        
        set : function(m, d, f) {
            this._matrix2=null; this._coeff1=this._coeff2=null; this._isGrad=false; this._doFast=0;
            this._matrix=new CM(m); this._dim=d; this._factor=f||1; 
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
            this._matrix=m; this._dim=d;
            this._matrix2=null; this._coeff1=this._coeff2=null; this._isGrad=false; this._doFast=0;
            return this;
        },
        
        // used for internal purposes
        _apply : function(src, w, h) {
            
            if (!this._matrix) return src;
            
            // use a faster convolution if possible
            if (this._doFast) 
            {
                if (this._matrix2)
                    return integralConvolution(src, w, h, this._matrix, this._matrix2, this._dim, this._dim, this._coeff1, this._coeff2, this._doFast);
                else
                    return integralConvolution(src, w, h, this._matrix, null, this._dim, this._dim, this._factor, this._bias, this._doFast);
            }
            
            var 
                matRadiusX=this._dim, matRadiusY=this._dim, matHalfSideX=matRadiusX>>1, matHalfSideY=matRadiusY>>1, 
                matArea=matRadiusX*matRadiusY, matArea2=matArea<<1, hsw=matHalfSideY*w,
                mat=this._matrix, factor=this._factor, bias=this._bias, mat2=this._matrix2, wt, wt2,
                _isGrad=this._isGrad, imageIndices=new FILTER.Array16I(matArea<<1), matIndices=new FILTER.Array8U(matArea),
                imArea=w*h, imLen=src.length, dst=new IMG(imLen),
                i, j, k, x, ty, ty2, xOff, yOff, srcOff, r, g, b, r2, g2, b2,
                bx=w-1, by=imArea-w,
                coeff1=this._coeff1, coeff2=this._coeff2
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
                            wt=mat[matIndices[k]]; r+=src[srcOff] * wt; g+=src[srcOff+1] * wt;  b+=src[srcOff+2] * wt;
                            // allow to apply a second similar matrix in-parallel (eg for total gradients)
                            wt2=mat2[matIndices[k]]; r2+=src[srcOff] * wt2; g2+=src[srcOff+1] * wt2;  b2+=src[srcOff+2] * wt2;
                        }
                        j+=2; k++;
                    }
                    
                    // output
                    if (_isGrad)
                    {
                        dst[i] = ~~(Abs(r)+Abs(r2));  dst[i+1] = ~~(Abs(g)+Abs(g2));  dst[i+2] = ~~(Abs(b)+Abs(b2));
                    }
                    else
                    {
                        dst[i] = ~~(coeff1*r + coeff2*r2);  dst[i+1] = ~~(coeff1*g + coeff2*g2);  dst[i+2] = ~~(coeff1*b + coeff2*b2);
                    }
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
                            r+=src[srcOff] * wt; g+=src[srcOff+1] * wt;  b+=src[srcOff+2] * wt;
                        }
                        j+=2; k++;
                    }
                    
                    // output
                    dst[i] = ~~(factor*r+bias);  dst[i+1] = ~~(factor*g+bias);  dst[i+2] = ~~(factor*b+bias);
                    // alpha channel is not transformed
                    dst[i+3] = src[i+3];
                    
                    // update image coordinates
                    i+=4; x++; if (x>=w) { x=0; ty+=w; }
                }
            }
            return dst;
        },
        
        apply : function(image) {
            if (!this._matrix) return image;
            return image.setData(this._apply(image.getData(), image.width, image.height));
        },
        
        reset : function() {
            this._matrix=null; this._matrix2=null; this._dim=0; return this;
        }
    };
    
})(FILTER);