/**
*
* Convolution Matrix Filter(s)
*
* @param weights (Array)
* @param opaque (Bool)
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
        toRad=FILTER.CONSTANTS.toRad, toDeg=FILTER.CONSTANTS.toDeg
    ;
    
    //
    //
    //  Private methods
    
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
        var l=_pascal.length, row, uprow; //, i, il, off, diff, sum;
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
                for (i=0, il=uprow.length-1; i<il; i++) { row.push(uprow[i]+uprow[i+1]); }
                row.push(1);
                if (l<12) _pascal.push(row.slice()); // save it for future dynamically
                l++;
            }
        }
        // crop if needed
        /*sum = (d) ? (2<<d) : 1;
        if (dim && row.length>dim)
        {
            diff=(row.length-dim); off=diff>>1; il=row.length;
            for (i=0; i<off; i++) { sum-=row[i]; sum-=row[il-1-i]; }
            if (diff%2) sum-=row[off];
            row=row.slice(off, dim+off);
        }*/
        return row;
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
        for (i=0; i<kl; i++)
        {
            for (j=0; j<kl; j++) { k=k1[i]*k2[j];  sum+=k;  ker.push(k); }
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
    
    function multiplyMatrix(m1, m2, d) 
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
    }
    
    function ones(d, f) 
    { 
        f=f||1;
        var l=d*d, i, o=new CM(l);
        for (i=0; i<l; i++) o[i]=f;
        return o;
    }
    
    //
    //
    //  Simple Convolution Filter
    FILTER.ConvolutionMatrixFilter=function(weights, factor)
    {
        this.factor=factor||1;
        
        if (typeof weights != 'undefined' && weights.length)
        {
            this.matrix=new CM(weights);
            this.dim = ~~(Math.sqrt(weights.length)+0.5);
        }
        else 
        {
            this.matrix=null;
            this.dim = 0;
        }
        this.isMedian=false; 
    };
    
    FILTER.ConvolutionMatrixFilter.prototype={
        
        // generic low-pass filter
        lowPass : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            return this.concat(ones(d), 1/(d*d), d);
        },

        // generic high-pass filter (I-LP)
        highPass : function(d, f) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            f=(typeof f == 'undefined') ? 1 : f;
            // HighPass Filter = I - (respective)LowPass Filter
            var size=d*d, fact=-f/size, w=ones(d, fact), i;
            w[size>>1 +1]=1+fact;
            return this.concat(w, 1, d);
        },

        // aliases
        boxBlur : function(d) { return this.lowPass(d); },
        
        // generic binomial(gaussian) low-pass filter
        binomialLowPass : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=gaussFilter(d);
            return this.concat(new CM(filt.kernel), 1/filt.sum, d); 
        },

        // generic binomial(gaussian) high-pass filter
        binomialHighPass : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=gaussFilter(d);
            // HighPass Filter = I - (respective)LowPass Filter
            return this.concat(blendMatrix(ones(d), new CM(filt.kernel), 1, -1/filt.sum), 1, d); 
        },
        
        // aliases
        gaussBlur : function(d) { return this.binomialLowPass(d); },
        
        sharpen : function(d, f) { f=(typeof f == 'undefined') ? 0.5 : f;  return this.highPass(d, f); },
        
        // X-gradient, partial X-derivative (Prewitt)
        prewittX : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=prewittFilter(d, 0);
            return this.concat(new CM(filt.kernel), 1, d);
        },
        
        // Y-gradient, partial Y-derivative (Prewitt)
        prewittY : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=prewittFilter(d, 1);
            return this.concat(new CM(filt.kernel), 1, d);
        },
        
        // directional gradient (Prewitt)
        prewittDirectional : function(d, theta) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            theta*=toRad;
            var c=Math.cos(theta), s=Math.sin(theta),
                gradx=prewittFilter(d, 0), grady=prewittFilter(d, 1),
            return this.concat(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), 1, d);
            /*return this.concat([
                    -c+s,   s,   c+s,
                    -c,  0,   s,
                   -c-s,   -s,  c-s
               ], 1, 3);*/
        },
        
        //aliases
        gradX : function(d) { return this.prewittX(d); },
        
        gradY : function(d) { return this.prewittY(d); },
        
        gradDirectional : function(d, theta) { return this.prewittDirectional(d, theta); },
        
        // partial X-derivative (Sobel)
        sobelX : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=sobelFilter(d, 0);
            return this.concat(new CM(filt.kernel), 1, d);
        },
        
        // partial Y-derivative (Sobel)
        sobelY : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var filt=sobelFilter(d, 1);
            return this.concat(new CM(filt.kernel), 1, d);
        },
        
        // directional gradient (Sobel)
        sobelDirectional : function(d, theta) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            theta*=toRad;
            var c=Math.cos(theta), s=Math.sin(theta),
                gradx=sobelFilter(d, 0), grady=sobelFilter(d, 1),
            return this.concat(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), 1, d);
        },
        
        laplace : function(d) {
            return this.concat([
                    0,   -1,   0,
                    -1,  4,   -1,
                    0,   -1,   0
                ], 1, 3);
        },
        
        emboss : function(d) {
            return this.concat([
                    -2,   -1,   0,
                    -1,  1,   1,
                    0,   1,   2
                 ], 1, 3);
        },
        
        /*bluremboss : function() {
            this.matrix=multiplyMatrix(new CM([
                    1/9,   1/9,   1/9,
                    1/9,  1/9,   1/9,
                    1/9,   1/9,   1/9
                 ]), new CM([
                    -2,   -1,   0,
                    -1,  1,   1,
                    0,   1,   2
                 ]), 3);
             this.dim=3; return this;
        },*/
        
        edges : function(d) {
            return this.concat([
                    0,   1,   0,
                    1,  -4,   1,
                    0,   1,   0
                 ], 1, 3);
        },
        
        motionblur : function(dir) {
            var w=1, i,j, wm=new CM(
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0
                         );
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
            return this.concat(wm, 1/9, 9);
        },
        
        reset : function() {
            this.matrix=null; this.dim=0; return this;
        },
        
        concat : function(m, f, d) {
            //this.matrix=multiplyMatrix(this.matrix, new CM(m), d);
            this.matrix=new CM(m); this.factor=f; this.dim=d;
            this.isMedian=false; 
            return this;
        },
        
        apply : function(image) {
            
            if (!this.matrix) return;
            
            var side = this.dim, halfSide = side>>1,
                data=image.getPixelData(),  src = data.data, sw = data.width, sh = data.height,
                newi=FILTER.static.createImageData(sw,sh), dst=newi.data,
                // pad output by the convolution matrix
                w = sw, h = sh,
                // go through the destination image pixels
                //alphaFac = this.opaque ? 1 : 0,
                x, y, sx, sy, dstOff, r=0, g=0, b=0, a=0, cx, cy, scx, scy,
                srcOff, wt, ty, yh, scyw, syw
                ;
            
            yh=0;
            for (y=0; y<h; y++) 
            {
                //yh=y*w;
                for (x=0; x<w; x++) 
                {
                    sy = y; sx = x;  dstOff = (yh+x)<<2;
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=0; g=0; b=0; a=0; ty=0;
                    for (cy=0; cy<side; cy++) 
                    {
                        //ty=cy*side;
                        scy = sy + cy - halfSide;
                        if (scy >= 0 && scy < sh)
                        {
                            scyw=scy*sw;
                            for (cx=0; cx<side; cx++) 
                            {
                                scx = sx + cx - halfSide;
                                if (scx >= 0 && scx < sw) 
                                {
                                    srcOff = (scyw + scx)<<2; wt = this.matrix[ty + cx];
                                    r += src[srcOff] * wt; g += src[srcOff+1] * wt;
                                    b += src[srcOff+2] * wt; /*a += src[srcOff+3] * wt;*/
                                }
                            }
                        }
                        ty+=side;
                    }
                    dst[dstOff] = this.factor*r;  dst[dstOff+1] = this.factor*g;
                    dst[dstOff+2] = this.factor*b;  /*dst[dstOff+3] = this.factor*(a + alphaFac*(255-a));*/
                    dst[dstOff+3] = src[dstOff+3];
                }
                yh+=w;
            }
            image.setPixelData(newi);
        },
        
        applyNaive : function(image) {
            
            if (!this.matrix) return;
            
            var side = this.dim, halfSide = side>>1,
                data=image.getPixelData(),  src = data.data, sw = data.width, sh = data.height,
                newi=FILTER.static.createImageData(sw,sh), dst=newi.data,
                // pad output by the convolution matrix
                w = sw, h = sh,
                // go through the destination image pixels
                //alphaFac = this.opaque ? 1 : 0,
                x, y, sx, sy, dstOff, r=0, g=0, b=0, a=0, cx, cy, scx, scy,
                srcOff, wt, ty, yh, scyw, syw
                ;
            
            yh=0;
            for (y=0; y<h; y++) 
            {
                //yh=y*w;
                for (x=0; x<w; x++) 
                {
                    sy = y; sx = x;  dstOff = (yh+x)<<2;
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=0; g=0; b=0; a=0; ty=0;
                    for (cy=0; cy<side; cy++) 
                    {
                        //ty=cy*side;
                        scy = sy + cy - halfSide;
                        if (scy >= 0 && scy < sh)
                        {
                            scyw=scy*sw;
                            for (cx=0; cx<side; cx++) 
                            {
                                scx = sx + cx - halfSide;
                                if (scx >= 0 && scx < sw) 
                                {
                                    srcOff = (scyw + scx)<<2; wt = this.matrix[ty + cx];
                                    r += src[srcOff] * wt; g += src[srcOff+1] * wt;
                                    b += src[srcOff+2] * wt; /*a += src[srcOff+3] * wt;*/
                                }
                            }
                        }
                        ty+=side;
                    }
                    dst[dstOff] = this.factor*r;  dst[dstOff+1] = this.factor*g;
                    dst[dstOff+2] = this.factor*b;  /*dst[dstOff+3] = this.factor*(a + alphaFac*(255-a));*/
                    dst[dstOff+3] = src[dstOff+3];
                }
                yh+=w;
            }
            image.setPixelData(newi);
        }
    };

    //
    //
    //  Composite Convolution Filter Stack
    FILTER.CompositeConvolutionMatrixFilter=function(filters)
    {
        this._stack=(typeof filters!='undefined' && filters.length) ? filters : [];
    };
    
    FILTER.CompositeConvolutionMatrixFilter.prototype={
        
        // filters stack, for multiple filter composition in optimal way
        _stack : [],
        
        filters : function(f) {
            if (f) this._stack=f;
            return this;
        },
        
        push : function(filter) {
            this._stack.push(filter);
            return this;
        },
        
        pop : function() {
            return this._stack.pop();
        },
        
        remove : function(filter) {
            var i=this._stack.length;
            while (--i>=0) { if (filter===this._stack[i]) this._stack.splice(i,1); }
            return this;
        },
        
        apply : function(image) {
            
            if (!this._stack.length) return;
            
            var 
                data=image.getPixelData(),  src = data.data, sw = data.width, sh = data.height,
                newi=image.clone().getPixelData(), dst=newi.data, tmp=new Uint8ClampedArray(dst),
                // pad output by the convolution matrix
                w = sw, h = sh,
                // go through the destination image pixels
                x, y, sx, sy, dstOff, r=0, g=0, b=0, a=0, cx, cy, scx, scy, scyw,
                srcOff, wt, ty, yh, _filterstack=this._stack, _stacklength=_filterstack.length, fi, filter, doFirst
                ;
            
            yh=0;
            for (y=0; y<h; y++) 
            {
                //yh=y*w;
                for (x=0; x<w; x++) 
                {
                    sy = y; sx = x;  dstOff = (yh+x)<<2;
                    fi=0;
                    // allow multiple filters composition optimally
                    while (fi<_stacklength)
                    {
                        filter=_filterstack[fi];  fi++; if (!filter) continue;
                        side=filter.dim;  halfSide = side>>1; filter=filter.matrix;
                        // calculate the weighed sum of the source image pixels that
                        // fall under the convolution matrix
                        r=0; g=0; b=0; a=0; ty=0;
                        for (cy=0; cy<side; cy++) 
                        {
                            //ty=cy*side;
                            scy = sy + cy - halfSide;
                            if (scy >= 0 && scy < sh)
                            {
                                scyw=scy*sw;
                                for (cx=0; cx<side; cx++) 
                                {
                                    scx = sx + cx - halfSide;
                                    if (scx >= 0 && scx < sw) 
                                    {
                                        srcOff = (scyw + scx)<<2; wt = filter[ty + cx];
                                        r += tmp[srcOff] * wt; g += tmp[srcOff+1] * wt;
                                        b += tmp[srcOff+2] * wt; a += tmp[srcOff+3] * wt;
                                    }
                                }
                            }
                            ty+=side;
                        }
                        tmp[dstOff] += r;  tmp[dstOff+1] += g;
                        tmp[dstOff+2] += b;  tmp[dstOff+3] += a;
                    }
                    dst[dstOff] = tmp[dstOff];  dst[dstOff+1] = tmp[dstOff+1];
                    dst[dstOff+2] = tmp[dstOff+2];  dst[dstOff+3] = tmp[dstOff+3];
                }
                yh+=w;
            }
            image.setPixelData(newi);
        }
    };
    
})(FILTER);