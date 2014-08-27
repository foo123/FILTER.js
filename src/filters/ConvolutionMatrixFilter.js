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
!function(FILTER, undef){
    
    @@USE_STRICT@@
    
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
    //  Convolution Matrix Filter
    var ConvolutionMatrixFilter = FILTER.ConvolutionMatrixFilter = FILTER.Class( FILTER.Filter, {
        name: "ConvolutionMatrixFilter"
        
        ,constructor: function( weights, factor, bias ) {
            var self = this;
            self.$super('constructor');
            self._coeff = new CM([1.0, 0.0]);
            
            if ( weights && weights.length)
            {
                self.set(weights, ~~(Sqrt(weights.length)+0.5), factor||1.0, bias||0.0);
            }
            else 
            {
                self._matrix = null; self._dim = 0;
            }
            self._matrix2 = null;  self._dim2 = 0;
            self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
            
            if ( FILTER.useWebGL ) 
            {
                self._webglInstance = FILTER.WebGLConvolutionMatrixFilterInstance || null;
            }
        }
        
        ,_dim: 0
        ,_dim2: 0
        ,_matrix: null
        ,_matrix2: null
        ,_mat: null
        ,_mat2: null
        ,_coeff: null
        ,_isGrad: false
        ,_doIntegral: 0
        ,_doSeparable: false
        ,_indices: null
        ,_indices2: null
        ,_indicesf: null
        ,_indicesf2: null
        ,_webglInstance: null
        
        ,dispose: function( ) {
            var self = this;
            
            self.$super('dispose');
            
            self._webglInstance = null;
            self._dim = null;
            self._dim2 = null;
            self._matrix = null;
            self._matrix2 = null;
            self._mat = null;
            self._mat2 = null;
            self._coeff = null;
            self._isGrad = null;
            self._doIntegral = null;
            self._doSeparable = null;
            self._indices = null;
            self._indices2 = null;
            self._indicesf = null;
            self._indicesf2 = null;
            
            return self;
        }
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    _dim: self._dim
                    ,_dim2: self._dim2
                    ,_matrix: self._matrix
                    ,_matrix2: self._matrix2
                    ,_mat: self._mat
                    ,_mat2: self._mat2
                    ,_coeff: self._coeff
                    ,_isGrad: self._isGrad
                    ,_doIntegral: self._doIntegral
                    ,_doSeparable: self._doSeparable
                    ,_indices: self._indices
                    ,_indices2: self._indices2
                    ,_indicesf: self._indicesf
                    ,_indicesf2: self._indicesf2
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self._dim = params._dim;
                self._dim2 = params._dim2;
                self._matrix = params._matrix;
                self._matrix2 = params._matrix2;
                self._mat = params._mat;
                self._mat2 = params._mat2;
                self._coeff = params._coeff;
                self._isGrad = params._isGrad;
                self._doIntegral = params._doIntegral;
                self._doSeparable = params._doSeparable;
                self._indices = params._indices;
                self._indices2 = params._indices2;
                self._indicesf = params._indicesf;
                self._indicesf2 = params._indicesf2;
            }
            return self;
        }
        
        // generic low-pass filter
        ,lowPass: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            this.set(ones(d), d, 1/(d*d), 0.0);
            this._doIntegral = 1; return this;
        }

        // generic high-pass filter (I-LP)
        ,highPass: function( d, f ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            f = ( f === undef ) ? 1 : f;
            // HighPass Filter = I - (respective)LowPass Filter
            var size=d*d, fact=-f/size, w=ones(d, fact, 1+fact);
            this.set(w, d, 1.0, 0.0);
            this._doIntegral = 1; return this;
        }

        ,glow: function( f, d ) { 
            f = ( f === undef ) ? 0.5 : f;  
            return this.highPass(d, -f); 
        }
        
        ,sharpen: function( f, d ) { 
            f = ( f === undef ) ? 0.5 : f;  
            return this.highPass(d, f); 
        }
        
        ,verticalBlur: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            this.set(average1DKernel(d), 1, 1/d, 0.0); 
            this._dim2 = d; this._doIntegral = 1; return this;
        }
        
        ,horizontalBlur: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            this.set(average1DKernel(d), d, 1/d, 0.0); 
            this._dim2 = 1; this._doIntegral = 1; return this;
        }
        
        // supports only vertical, horizontal, diagonal
        ,directionalBlur: function( theta, d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            theta *= toRad;
            var c = Cos(theta), s = -Sin(theta), filt = twos2(d, c, s, 1/d);
            return this.set(filt, d, 1.0, 0.0);
        }
        
        // fast gauss filter
        ,fastGauss: function( quality, d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            quality = ~~(quality||1);
            if ( quality < 1 ) quality = 1;
            else if ( quality > 3 ) quality = 3;
            this.set(ones(d), d, 1/(d*d), 0.0);
            this._doIntegral = quality; return this;
        }
        
        // generic binomial(quasi-gaussian) low-pass filter
        ,binomialLowPass: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            /*var filt=gaussKernel(d);
            return this.set(filt.kernel, d, 1/filt.sum); */
            var kernel = binomial1DKernel(d), sum=1<<(d-1), fact=1/sum;
            this.set(kernel, d, fact, fact);
            this._matrix2 = new CM(kernel);
            var tmp = this._computeIndices(this._matrix2, this._dim2);
            this._indices2 = tmp[0]; this._indicesf2 = tmp[1]; this._mat2 = tmp[2];
            this._doSeparable = true; return this;
        }

        // generic binomial(quasi-gaussian) high-pass filter
        ,binomialHighPass: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt = gaussKernel(d);
            // HighPass Filter = I - (respective)LowPass Filter
            return this.set(blendMatrix(ones(d), new CM(filt.kernel), 1, -1/filt.sum), d, 1.0, 0.0); 
        }
        
        // X-gradient, partial X-derivative (Prewitt)
        ,prewittX: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt = prewittKernel(d, 0);
            // this can be separable
            return this.set(filt.kernel, d, 1.0, 0.0);
        }
        
        // Y-gradient, partial Y-derivative (Prewitt)
        ,prewittY: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt = prewittKernel(d, 1);
            // this can be separable
            return this.set(filt.kernel, d, 1.0, 0.0);
        }
        
        // directional gradient (Prewitt)
        ,prewittDirectional: function( theta, d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            theta*=toRad;
            var c = Cos(theta), s = Sin(theta), gradx = prewittKernel(d, 0), grady = prewittKernel(d, 1);
            return this.set(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), d, 1.0, 0.0);
        }
        
        // gradient magnitude (Prewitt)
        ,prewitt: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var gradx = prewittKernel(d, 0), grady = prewittKernel(d, 1);
            this.set(gradx.kernel, d, 1.0, 0.0);
            this._isGrad = true;
            this._matrix2 = new CM(grady.kernel);
            var tmp = this._computeIndices(this._matrix2, this._dim2);
            this._indices2 = tmp[0]; this._indicesf2 = tmp[1]; this._mat2 = tmp[2];
            return this;
        }
        
        // partial X-derivative (Sobel)
        ,sobelX: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt = sobelKernel(d, 0);
            // this can be separable
            return this.set(filt.kernel, d, 1.0, 0.0);
        }
        
        // partial Y-derivative (Sobel)
        ,sobelY: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt = sobelKernel(d, 1);
            // this can be separable
            return this.set(filt.kernel, d, 1.0, 0.0);
        }
        
        // directional gradient (Sobel)
        ,sobelDirectional: function( theta, d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            theta*=toRad;
            var c = Cos(theta), s = Sin(theta), gradx = sobelKernel(d, 0), grady = sobelKernel(d, 1);
            return this.set(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), d, 1.0, 0.0);
        }
        
        // gradient magnitude (Sobel)
        ,sobel: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var gradx = sobelKernel(d, 0), grady = sobelKernel(d, 1);
            this.set(gradx.kernel, d, 1.0, 0.0);
            this._matrix2 = new CM(grady.kernel);
            var tmp = this._computeIndices(this._matrix2, this._dim2);
            this._indices2 = tmp[0]; this._indicesf2 = tmp[1]; this._mat2 = tmp[2];
            this._isGrad = true;
            return this;
        }
        
        ,laplace: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var size = d*d, laplacian = ones(d, -1, size-1);
            this.set(laplacian, d, 1.0, 0.0);
            this._doIntegral = 1; return this;
        }
        
        ,emboss: function( angle, amount, d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            angle = ( angle === undef ) ? (-0.25*Math.PI) : (angle*toRad);
            amount = amount||1;
            var dx = amount*Cos(angle), dy = -amount*Sin(angle), filt = twos(d, dx, dy, 1);
            return this.set(filt, d, 1.0, 0.0);
        }
        
        ,edges: function( m ) {
            m = m||1;
            return this.set([
                    0,   m,   0,
                    m,  -4*m, m,
                    0,   m,   0
                 ], 3, 1.0, 0.0);
        }
        
        ,set: function( m, d, f, b ) {
            var self = this;
            self._matrix2 = null; self._dim2 = 0; self._indices2 = self._indicesf2 = null; self._mat2 = null;
            self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
            self._matrix = new CM(m); self._dim = d; self._coeff[0] = f||1; self._coeff[1] = b||0;
            var tmp  = self._computeIndices(self._matrix, self._dim);
            self._indices = tmp[0]; self._indicesf = tmp[1]; self._mat = tmp[2];
            return self;
        }
        
        ,_computeIndices: function( m, d ) {
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            var indices = [], indices2 = [], mat = [], k, x, y,  matArea = m.length, matRadius = d, matHalfSide = (matRadius>>1);
            x=0; y=0; k=0;
            while (k<matArea)
            { 
                indices2.push(x-matHalfSide); 
                indices2.push(y-matHalfSide);
                if (m[k])
                {
                    indices.push(x-matHalfSide); 
                    indices.push(y-matHalfSide);
                    mat.push(m[k]);
                }
                k++; x++; if (x>=matRadius) { x=0; y++; }
            }
            return [new A16I(indices), new A16I(indices2), new CM(mat)];
        }
        
        ,reset: function( ) {
            var self = this;
            self._matrix = self._matrix2 = null; 
            self._mat = self._mat2 = null; 
            self._dim = self._dim2 = 0;
            self._indices = self._indices2 = self._indicesf = self._indicesf2 = null;
            self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
            return self;
        }
        
        ,combineWith: function( filt ) {
            // matrices/kernels need to be convolved -> larger kernel->tensor in order to be actually combined
            // todo??
            return this;
        }
        
        ,getMatrix: function( ) {
            return this._matrix;
        }
        
        ,setMatrix: function( m, d ) {
            return this.set(m, d);
        }
        
        // used for internal purposes
        ,_apply: function(im, w, h/*, image*/) {
            var self = this;
            if ( !self._isOn || !self._matrix ) return im;
            
            // do a faster convolution routine if possible
            if ( self._doIntegral ) 
            {
                if (self._matrix2)
                    return integralConvolution(im, w, h, self._matrix, self._matrix2, self._dim, self._dim2, self._coeff[0], self._coeff[1], self._doIntegral);
                else
                    return integralConvolution(im, w, h, self._matrix, null, self._dim, self._dim, self._coeff[0], self._coeff[1], self._doIntegral);
            }
            else if ( self._doSeparable )
            {
                return separableConvolution(im, w, h, self._mat, self._mat2, self._indices, self._indices2, self._coeff[0], self._coeff[1]);
            }
            // handle some common cases fast
            /*else if (3==this._dim)
            {
                return convolution3(im, w, h, this._matrix, this._matrix2, this._dim, this._dim, this._coeff[0], this._coeff[1], this._isGrad);
            }*/
            
            var imLen = im.length, imArea = (imLen>>2), 
                dst = new IMG(imLen), 
                t0, t1, t2,
                i, j, k, x, ty, ty2, 
                xOff, yOff, srcOff, 
                r, g, b, r2, g2, b2,
                bx = w-1, by = imArea-w,
                coeff1 = self._coeff[0], coeff2 = self._coeff[1],
                mat = self._matrix, mat2 = self._matrix2, wt, wt2, _isGrad = self._isGrad,
                mArea, matArea, imageIndices
                ;
            
            // apply filter (algorithm direct implementation based on filter definition with some optimizations)
            if (mat2) // allow to compute a second matrix in-parallel in same pass
            {
                // pre-compute indices, 
                // reduce redundant computations inside the main convolution loop (faster)
                mArea = self._indicesf.length; 
                imageIndices = new A16I(self._indicesf);
                for (k=0; k<mArea; k+=2)
                { 
                    imageIndices[k+1] *= w;
                } 
                matArea = mat.length;
                
                // do direct convolution
                x=0; ty=0;
                for (i=0; i<imLen; i+=4, x++)
                {
                    // update image coordinates
                    if (x>=w) { x=0; ty+=w; }
                    
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=0; g=0; b=0; r2=0; g2=0; b2=0; 
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                        {
                            srcOff = (xOff + yOff)<<2; 
                            wt = mat[k]; r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                            // allow to apply a second similar matrix in-parallel (eg for total gradients)
                            wt2 = mat2[k]; r2 += im[srcOff] * wt2; g2 += im[srcOff+1] * wt2;  b2 += im[srcOff+2] * wt2;
                        }
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
                        t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                        t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                        t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                    }
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
            else
            {
                // pre-compute indices, 
                // reduce redundant computations inside the main convolution loop (faster)
                mArea = self._indices.length; 
                imageIndices = new A16I(self._indices);
                for (k=0; k<mArea; k+=2)
                { 
                    imageIndices[k+1] *= w;
                }
                mat = self._mat;
                matArea = mat.length;
                
                // do direct convolution
                x=0; ty=0;
                for (i=0; i<imLen; i+=4, x++)
                {
                    // update image coordinates
                    if (x>=w) { x=0; ty+=w; }
                    
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=0; g=0; b=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                        {
                            srcOff = (xOff + yOff)<<2; wt = mat[k];
                            r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        }
                    }
                    
                    // output
                    t0 = coeff1*r+coeff2;  t1 = coeff1*g+coeff2;  t2 = coeff1*b+coeff2;
                    if (notSupportClamp)
                    {   
                        // clamp them manually
                        t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                        t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                        t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                    }
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
            return dst;
        }
            
        ,canRun: function( ) {
            return this._isOn && this._matrix;
        }
    });
    // aliases
    ConvolutionMatrixFilter.prototype.bump = ConvolutionMatrixFilter.prototype.emboss;
    ConvolutionMatrixFilter.prototype.boxBlur = ConvolutionMatrixFilter.prototype.lowPass;
    ConvolutionMatrixFilter.prototype.gaussBlur = ConvolutionMatrixFilter.prototype.binomialLowPass;
    ConvolutionMatrixFilter.prototype.gradX = ConvolutionMatrixFilter.prototype.prewittX;
    ConvolutionMatrixFilter.prototype.gradY = ConvolutionMatrixFilter.prototype.prewittY;
    ConvolutionMatrixFilter.prototype.gradDirectional = ConvolutionMatrixFilter.prototype.prewittDirectional;
    ConvolutionMatrixFilter.prototype.grad = ConvolutionMatrixFilter.prototype.prewitt;

    
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
        i=0; while (i<d) { ker[i] = k; k++; i++; }
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
        var l=d*d, half=d>>1, center=l>>1, i, k, j, o=new CM(l), tx, ty;
        tx = 0;
        for (i=0; i<=half; i++)
        {
            k = 0; ty = 0;
            for (j=0; j<=half; j++)
            {
                //tx=i*dx;  ty=j*dy;
                o[center + i + k]=   tx + ty;
                o[center - i - k]= - tx - ty;
                o[center - i + k]= - tx + ty;
                o[center + i - k]=   tx - ty;
                k += d; ty += dy;
            }
            tx += dx;
        }
        o[center] = c||1;
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
        i=0;
        while (i<=half)
        {
            // do the mapping of the base line to the transformed one
            o[T[center + i]]=o[T[center - i]]=f;
            // anti-aliasing ??..
            i++;
        }
        o[center] = cf||1;
        return o;
    }
    
    // speed-up convolution for special kernels like moving-average
    function integralConvolution(im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats) 
    {
        var imLen=im.length, imArea=(imLen>>2), integral, integralLen, colR, colG, colB,
            matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
            dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
            i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
            xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2,
            r, g, b, r2, g2, b2, repeat
        ;
        
        // convolution speed-up based on the integral image concept and symmetric / separable kernels
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        matArea = matRadiusX*matRadiusY;
        matHalfSideX = matRadiusX>>1;  matHalfSideY = w*(matRadiusY>>1);
        // one additional offest needed due to integral computation
        matOffsetLeft = -matHalfSideX-1; matOffsetTop = -matHalfSideY-w;
        matOffsetRight = matHalfSideX; matOffsetBottom = matHalfSideY;
        bx1 = 0; bx2 = w-1; by1 = 0; by2 = imArea-w;
        
        integralLen = (imArea<<1)+imArea;  rowLen = (w<<1)+w;
        
        numRepeats = numRepeats||1;  repeat = 0;
        
        if (matrix2) // allow to compute a second matrix in-parallel
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>1]; centerOffset2 = wtCenter2-wt2;
            
            // do this multiple times??
            while (repeat<numRepeats)
            {
                dst = new IMG(imLen); integral = new A32F(integralLen);
                
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
                for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
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
                     xOff1 = (xOff1<bx1) ? bx1 : xOff1;
                     xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                     yOff1 = (yOff1<by1) ? by1 : yOff1;
                     yOff2 = (yOff2>by2) ? by2 : yOff2;
                    
                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                    // arguably faster way to write p1*=3; etc..
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                    
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
                        t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                        t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                        t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                    }
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                
                // do another pass??
                im = dst;  repeat++;
            }
        }
        else
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
        
            // do this multiple times??
            while (repeat<numRepeats)
            {
                dst = new IMG(imLen); integral = new A32F(integralLen);
                
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
                for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
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
                     xOff1 = (xOff1<bx1) ? bx1 : xOff1;
                     xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                     yOff1 = (yOff1<by1) ? by1 : yOff1;
                     yOff2 = (yOff2>by2) ? by2 : yOff2;
                    
                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                    // arguably faster way to write p1*=3; etc..
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                    
                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1])  +  (centerOffset * im[i]);
                    g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                    b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                    
                    // output
                    t0 = coeff1*r + coeff2;  t1 = coeff1*g + coeff2;  t2 = coeff1*b + coeff2;
                    if (notSupportClamp)
                    {   
                        // clamp them manually
                        t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                        t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                        t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                    }
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                
                // do another pass??
                im = dst;  repeat++;
            }
        }
        return dst;
    }
    
    // speed-up convolution for separable kernels
    function separableConvolution(im, w, h, matrix, matrix2, ind1, ind2, coeff1, coeff2) 
    {
        var imLen=im.length, imArea=(imLen>>2),
            matA, indA,
            matArea, mat, indices, matArea2,
            dst, imageIndices,
            i, j, k, x, ty, ty2,
            xOff, yOff, bx, by, t0, t1, t2, wt,
            r, g, b, coeffs, coeff,
            numPasses
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        matA = [matrix2, matrix];
        indA = [ind2, ind1];
        coeffs = [coeff2, coeff1];
        
        bx = w-1; by = imArea-w;
        
        // one horizontal and one vertical pass
        numPasses = 2;
        while (numPasses--)
        {
            dst = new IMG(imLen);
            
            mat = matA[numPasses];
            indices = indA[numPasses];
            matArea = mat.length;
            matArea2 = indices.length;
            coeff = coeffs[numPasses];
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            imageIndices = new A16I(indices);
            for (k=0; k<matArea2; k+=2)
            { 
                imageIndices[k+1] *= w;
            } 
        
            // do direct convolution
            if (notSupportClamp)
            {   
                x=0; ty=0;
                for (i=0; i<imLen; i+=4, x++)
                {
                    // update image coordinates
                    if (x>=w) { x=0; ty+=w; }
                    
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=0; g=0; b=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                        {
                            srcOff = (xOff + yOff)<<2; wt = mat[k];
                            r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        }
                    }
                    
                    // output
                    t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                    
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                    
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
            else
            {
                x=0; ty=0;
                for (i=0; i<imLen; i+=4, x++)
                {
                    // update image coordinates
                    if (x>=w) { x=0; ty+=w; }
                    
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=0; g=0; b=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                        {
                            srcOff = (xOff + yOff)<<2; wt = mat[k];
                            r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        }
                    }
                    
                    // output
                    t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                    
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
            
            // do another pass??
            im = dst;
        }
        return dst;
    }
    /*
    // some common convolution cases can be handled faster (3x3)
    function convolution3(im, w, h, matrix, matrix2, coeff1, coeff2, _isGrad) 
    {
        return im;
    }
    */
}(FILTER);