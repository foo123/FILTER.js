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
    
    var 
        // Convolution Matrix
        CM=FILTER.Array32F,
        
        // hardcode usual pascal numbers, used for binomial kernels
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
    
        // crop if needed
        /*sum = (d) ? (2<<d) : 1;
        if (dim && row.length>dim)
        {
            diff=(row.length-dim); off=diff>>1; il=row.length;
            for (i=0; i<off; i++) { sum-=row[i]; sum-=row[il-1-i]; }
            if (diff%2) sum-=row[off];
            row=row.slice(off, dim+off);
        }*/
    /*
    Another way to generate pascal's numbers is to look at
    1
    1 2 1
    1 3 3 1
    1 4 6 4 1
    Look at the 4 and the 6. It is clear that
    4 = 1 + 3
    6 = 3+3
    pascal(row, col) = pascal(row-1, col-1) + pascal(row-1, col)
    */
    
    // pascal numbers (binomial coefficients) are used to get coefficients for filters that resemble gaussian distributions
    // eg Sobel, Canny, gradients etc..
    function binomialKernel(d) 
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
    
    function identityKernel(d)
    {
        var i, center=d>>1+1, fact=-f, ker=new Array(d);
        for (i=0; i<d; i++) { ker[i]=0; }
        ker[center]=1;
        return ker;
    }

    function averageKernel(d)
    {
        var i, ker=new Array(d);
        for (i=0; i<d; i++) ker[i]=1;
        return ker;
    }
    
    function derivativeKernel(d)
    {
        var i, f=d>>1, fact=-f, ker=new Array(d);
        for (i=0; i<d; i++) { ker[i]=fact; fact++;  }
        return ker;
    }
    
    function convolveKernels(k1, k2)
    {
        var i, j, kl=k1.length, k, ker=[], sum=0;
        if (typeof (k1[0].length)=='undefined') // simple kernels
        {
            for (i=0; i<kl; i++)
            {
                for (j=0; j<kl; j++) { k=k1[i]*k2[j];  sum+=k;  ker.push(k); }
            }
        }
        else // recursive kernels
        {
            for (i=0; i<kl; i++)
            {
                for (j=0; j<kl; j++) { k=convolveKernels(k1[i], k2[j]);  sum+=k.sum;  ker=ker.concat(k.ker); }
            }
        }
        return {kernel:ker, sum:sum};
    }
    
    function gaussFilter(d)
    {
        var binomial=binomialKernel(d);
        // convolve with itself
        return convolveKernels(binomial, binomial);
    }
    
    function sobelFilter(d, dir)
    {
        var binomial=binomialKernel(d), derivative=derivativeKernel(d);
        if (1==dir) // y
        {
            // convolve them
            return convolveKernels(derivative.reverse(), binomial);
        }
        else
        {
            // convolve them
            return convolveKernels(binomial, derivative);
        }
    }
    
    function prewittFilter(d, dir)
    {
        var average=averageKernel(d), derivative=derivativeKernel(d);
        if (1==dir) // y
        {
            // convolve them
            return convolveKernels(derivative.reverse(), average);
            
            /*if (3==d)
            {
                return { kernel:[1, sqrt2, 1, 0, 0, 0, -1, -sqrt2, -1], sum: 0 };
            }*/
        }
        else // x
        {
            // convolve them
            return convolveKernels(average, derivative);
            
            /*if (3==d)
            {
                return { kernel: [-1, 0, 1, -sqrt2, 0, sqrt2, 1, 0, 1], sum: 0 };
            }*/
        }
    }
    
    function addMatrix(m1, m2)
    {
        var l= m1.length, i, m=new CM(m1.length);
        for (i=0; i<l; i++) m[i]=m1[i] + m2[i];
        return m;
    }
    
    function subtractMatrix(m1, m2)
    {
        var l= m1.length, i, m=new CM(m1.length);
        for (i=0; i<l; i++) m[i]=m1[i]-m2[i];
        return m;
    }
    
    function multiplyScalar(m1, s)
    {
        if (1==s) return new CM(m1);
        var l= m1.length, i, m=new CM(m1.length);
        for (i=0; i<l; i++) m[i]=m1[i]*s;
        return m;
    }
    
    function blendMatrix(m1, m2, a, b)
    {
        var l= m1.length, i, m=new CM(m1.length);
        a=a||1; b=b||1;
        for (i=0; i<l; i++) m[i]=a*m1[i] + b*m2[i];
        return m;
    }
    
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
    
    function ones(d, f) 
    { 
        f=f||1;
        var l=d*d, i, o=new CM(l);
        for (i=0; i<l; i++) o[i]=f;
        return o;
    }

    // speed-up convolution for special kernels like moving-average
    function boxConvolution(src, w, h, dim, matrix, factor, bias) 
    {
        // todo
        return src;
    }
    
    //
    //
    //  Simple Convolution Filter
    FILTER.ConvolutionMatrixFilter=function(weights, factor, bias)
    {
        if (typeof weights != 'undefined' && weights.length)
        {
            this.set(weights, factor||1, ~~(Sqrt(weights.length)+0.5))
            this.bias=bias||0;
        }
        else 
        {
            this.matrix=null; /*this._indices=null;*/ this.dim = 0;
            this.auxMatrix=null; this._isGrad=false; this._useBox=false;
        }
    };
    
    FILTER.ConvolutionMatrixFilter.prototype={
        
        dim: 0,
        matrix: null,
        factor: 1,
        bias: 0,
        
        // generic low-pass filter
        lowPass : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            this.set(ones(d), 1/(d*d), d);
            this._useBox=true; return this;
        },

        // generic high-pass filter (I-LP)
        highPass : function(d, f) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            f=(typeof f == 'undefined') ? 1 : f;
            // HighPass Filter = I - (respective)LowPass Filter
            var size=d*d, fact=-f/size, w=ones(d, fact), i;
            w[size>>1 +1]=1+fact;
            this.set(w, 1, d);
            this._useBox=true; return this;
        },

        // aliases
        boxBlur : function(d) { return this.lowPass(d); },
        
        // generic binomial(gaussian) low-pass filter
        binomialLowPass : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=gaussFilter(d);
            return this.set(filt.kernel, 1/filt.sum, d); 
        },

        // generic binomial(gaussian) high-pass filter
        binomialHighPass : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=gaussFilter(d);
            // HighPass Filter = I - (respective)LowPass Filter
            return this.set(blendMatrix(ones(d), new CM(filt.kernel), 1, -1/filt.sum), 1, d); 
        },
        
        // aliases
        gaussBlur : function(d) { return this.binomialLowPass(d); },
        
        sharpen : function(d, f) { 
            f=(typeof f == 'undefined') ? 0.5 : f;  
            if (f<=0)
                return this.set([
                    0, -2, 0, 
                    -2, 10, -2, 
                    0, -2, 0
                ], 0.5, 3);
            else
                return this.highPass(d, f); 
        },
        
        // X-gradient, partial X-derivative (Prewitt)
        prewittX : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=prewittFilter(d, 0);
            return this.set(filt.kernel, 1, d);
        },
        
        // Y-gradient, partial Y-derivative (Prewitt)
        prewittY : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=prewittFilter(d, 1);
            return this.set(filt.kernel, 1, d);
        },
        
        // directional gradient (Prewitt)
        prewittDirectional : function(d, theta) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            theta*=toRad;
            var c=Cos(theta), s=Sin(theta),
                gradx=prewittFilter(d, 0), grady=prewittFilter(d, 1);
            return this.set(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), 1, d);
            /*return this.set([
                    -c+s,   s,   c+s,
                    -c,  0,   s,
                   -c-s,   -s,  c-s
               ], 1, 3);*/
        },
        
        // gradient magnitude (Prewitt)
        prewitt : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var gradx=prewittFilter(d, 0), grady=prewittFilter(d, 1);
            this.set(gradx.kernel, 1, d);
            this._isGrad=true;
            this.auxMatrix=new CM(grady.kernel);
            return this;
        },
        
        //aliases
        gradX : function(d) { return this.prewittX(d); },
        
        gradY : function(d) { return this.prewittY(d); },
        
        gradDirectional : function(d, theta) { return this.prewittDirectional(d, theta); },
        
        grad : function(d) { return this.prewitt(d); },
        
        // partial X-derivative (Sobel)
        sobelX : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=sobelFilter(d, 0);
            return this.set(filt.kernel, 1, d);
        },
        
        // partial Y-derivative (Sobel)
        sobelY : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=sobelFilter(d, 1);
            return this.set(filt.kernel, 1, d);
        },
        
        // directional gradient (Sobel)
        sobelDirectional : function(d, theta) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            theta*=toRad;
            var c=Cos(theta), s=Sin(theta),
                gradx=sobelFilter(d, 0), grady=sobelFilter(d, 1);
            return this.set(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), 1, d);
        },
        
        // gradient magnitude (Sobel)
        sobel : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var gradx=sobelFilter(d, 0), grady=sobelFilter(d, 1);
            this.set(gradx.kernel, 1, d);
            this.auxMatrix=new CM(grady.kernel);
            this._isGrad=true;
            return this;
        },
        
        laplace : function(d) {
            return this.set([
                    0,   -1,   0,
                    -1,  4,   -1,
                    0,   -1,   0
                ], 1, 3);
        },
        
        emboss : function(direction, magnitude) {
            direction=(typeof direction == 'undefined' || (direction!=1 && direction!=-1)) ? 1 : direction;
            //magnitude=(typeof magnitude == 'undefined' || magnitude<=0) ? 1 : magnitude;
            magnitude=1;
            var d=1/*1/magnitude*/, f=direction*magnitude; 
            return this.set([
                    -f*2,   -f*1,   0,
                    -f*1,  magnitude*1,   f*1,
                    0,   f*1,   f*2
                 ], d, 3);
        },
        
        // aliases
        embossHigh : function() { return this.emboss(1); },
        
        embossLow : function() { return this.emboss(-1); },
        
        edges : function(d) {
            return this.set([
                    0,   1,   0,
                    1,  -4,   1,
                    0,   1,   0
                 ], 1, 3);
        },
        
        edges2 : function(d) {
            return this.set([
                    0, 2, 0, 
                    2, -8, 2, 
                    0, 2, 0
                 ], 0.5, 3);
        },
        
        motionblur : function(dir) {
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
            return this.set(wm, 1/9, 9);
        },
        
        set : function(m, f, d) {
            /*var size=d*d, halfSide = d>>1, cx, cy, ty, 
                indices=new Array(size), i;*/
            
            this.auxMatrix=null; this._isGrad=false; this._useBox=false;
            this.matrix=new CM(m); this.factor=f; this.dim=d; 
            
            // pre-compute the matrix relative indices for reducing convolution loops
            /*i=0;
            for (cy=0, ty=0; cy<d; cy++, ty+=d){ for (cx=0; cx<side; cx++){ indices[i]=new FILTER.Array8I([cx - halfSide, cy - halfSide]); i++; } }
            this._indices=indices;*/
            
            return this;
        },
        
        combine : function(filt) {
            // matrices/kernels need to be convolved -> larger kernel->tensor in order to be actually combined
            // todo??
            return this;
        },
        
        // used for internal purposes
        _apply : function(src, w, h) {
            
            if (!this.matrix) return src;
            
            // use a faster convolution if possible
            //if (this._useBox) return boxConvolution(src, w, h, this.dim, this.matrix. this.factor, this.bias);
            
            var 
                matRadius=this.dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, hsw=matHalfSide*w,
                mat=this.matrix, factor=this.factor, bias=this.bias, mat2=this.auxMatrix, wt, wt2,
                _isGrad=this._isGrad, imageIndices=new FILTER.Array32I(matArea<<1), matIndices=new FILTER.Array8U(matArea),
                imArea=w*h, imLen=src.length, dst=new FILTER.ImArray(imLen),
                i, j, k, x, y, ty, ty2, xOff, yOff, srcOff, dstOff, r, g, b, r2, g2, b2
                ;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            i=0; j=0; x=0; y=0; ty=0; ty2=0;
            while (i<matArea)
            { 
                matIndices[i] = x + ty; 
                imageIndices[j] = x-matHalfSide; imageIndices[j+1] = ty2-hsw;
                i++; j+=2; x++; if (matRadius==x) { x=0; y++; ty+=matRadius; ty2+=w; }
            } 
            
            // do direct convolution
            i=0; x=0; y=0; ty=0;
            while (i<imLen)
            {
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=0; g=0; b=0; r2=0; g2=0; b2=0; 
                j=0; k=0;
                while (j < matArea)
                {
                    xOff=x + imageIndices[k]; yOff=ty + imageIndices[k+1];
                    if (xOff>=0 && xOff<w && yOff>=0 && yOff<imArea)
                    {
                        srcOff=(xOff + yOff)<<2; wt=mat[matIndices[j]];
                        r+=src[srcOff] * wt; g+=src[srcOff+1] * wt;  b+=src[srcOff+2] * wt;
                        // allow to apply a second similar matrix in-parallel (eg for total gradients)
                        if (mat2)
                        {
                            wt2=mat2[matIndices[j]];
                            r2+=src[srcOff] * wt2; g2+=src[srcOff+1] * wt2;  b2+=src[srcOff+2] * wt2;
                        }
                    }
                    j++; k+=2;
                }
                
                // output
                dstOff = i;
                if (_isGrad) { dst[dstOff] = Abs(r)+Abs(r2);  dst[dstOff+1] = Abs(g)+Abs(g2);  dst[dstOff+2] = Abs(b)+Abs(b2); }
                else { dst[dstOff] = factor*r+bias;  dst[dstOff+1] = factor*g+bias;  dst[dstOff+2] = factor*b+bias;  }
                // alpha channel is not transformed
                dst[dstOff+3] = src[dstOff+3];
                
                // update image coordinates
                i+=4; x++; if (x>=w) { x=0; y++; ty+=w; }
            }
            return dst;
        },
        
        apply : function(image) {
            if (!this.matrix) return image;
            return image.setData(this._apply(image.getData(), image.width, image.height));
        },
        
        reset : function() {
            this.matrix=null; this._indices=null; this.auxMatrix=null; this.dim=0; return this;
        }
    };
    
})(FILTER);