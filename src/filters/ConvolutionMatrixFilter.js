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
"use strict";

var FilterUtil = FILTER.Util.Filter, CM = FILTER.ConvolutionMatrix,
    IMG = FILTER.ImArray, //IMGcopy = FILTER.ImArrayCopy,
    A32F = FILTER.Array32F, A16I = FILTER.Array16I, A8U = FILTER.Array8U,
    integral_convolution = FilterUtil.integral_convolution,
    separable_convolution = FilterUtil.separable_convolution,
    blend = FilterUtil.cm_combine, convolve = FilterUtil.cm_convolve, MODE = FILTER.MODE,
    TypedArray = FILTER.Util.Array.typed, notSupportClamp = FILTER._notSupportClamp,
    
    sqrt2 = Math.SQRT2, toRad = FILTER.CONST.toRad, toDeg = FILTER.CONST.toDeg,
    Abs = Math.abs, Sqrt = Math.sqrt, Sin = Math.sin, Cos = Math.cos,
    
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
//  Convolution Matrix Filter
var ConvolutionMatrixFilter = FILTER.Create({
    name: "ConvolutionMatrixFilter"
    
    ,init: function ConvolutionMatrixFilter( weights, factor, bias, mode ) {
        var self = this;
        self._coeff = new CM([1.0, 0.0]);
        self.matrix2 = null;  self.dim2 = 0;
        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        if ( weights && weights.length)
        {
            self.set(weights, (Sqrt(weights.length)+0.5)|0, factor||1.0, bias||0.0);
        }
        else 
        {
            self.matrix = null; self.dim = 0;
        }
        self.mode = mode || MODE.RGB;
    }
    
    ,path: FILTER_FILTERS_PATH
    ,dim: 0
    ,dim2: 0
    ,matrix: null
    ,matrix2: null
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
    ,mode: MODE.RGB
    
    ,dispose: function( ) {
        var self = this;
        self.dim = null;
        self.dim2 = null;
        self.matrix = null;
        self.matrix2 = null;
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
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             dim: self.dim
            ,dim2: self.dim2
            ,matrix: self.matrix
            ,matrix2: self.matrix2
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
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.dim = params.dim;
        self.dim2 = params.dim2;
        self.matrix = TypedArray( params.matrix, CM );
        self.matrix2 = TypedArray( params.matrix2, CM );
        self._mat = TypedArray( params._mat, CM );
        self._mat2 = TypedArray( params._mat2, CM );
        self._coeff = TypedArray( params._coeff, CM );
        self._isGrad = params._isGrad;
        self._doIntegral = params._doIntegral;
        self._doSeparable = params._doSeparable;
        self._indices = TypedArray( params._indices, A16I );
        self._indices2 = TypedArray( params._indices2, A16I );
        self._indicesf = TypedArray( params._indicesf, A16I );
        self._indicesf2 = TypedArray( params._indicesf2, A16I );
        return self;
    }
    
    // generic functional-based kernel filter
    ,functional: function( f, d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        var kernel = functional1(d, f), fact = 1.0/summa(kernel);
        // this can be separable
        this.set(kernel, d, fact, fact, d, kernel);
        this._doSeparable = true; return this;
    }
    
    // fast gauss filter
    ,fastGauss: function( quality, d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        quality = (quality||1)|0;
        if ( quality < 1 ) quality = 1;
        else if ( quality > 7 ) quality = 7;
        this.set(ones(d), d, 1/(d*d), 0.0);
        this._doIntegral = quality; return this;
    }
    
    // generic box low-pass filter
    ,lowPass: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        this.set(ones(d), d, 1/(d*d), 0.0);
        this._doIntegral = 1; return this;
    }
    ,boxBlur: null

    // generic box high-pass filter (I-LP)
    ,highPass: function( d, f ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        f = f === undef ? 1 : f;
        // HighPass Filter = I - (respective)LowPass Filter
        var fact = -f/(d*d);
        this.set(ones(d, fact, 1+fact), d, 1.0, 0.0);
        this._doIntegral = 1; return this;
    }

    ,glow: function( f, d ) { 
        f = f === undef ? 0.5 : f;  
        return this.highPass(d, -f); 
    }
    
    ,sharpen: function( f, d ) { 
        f = f === undef ? 0.5 : f;  
        return this.highPass(d, f); 
    }
    
    ,verticalBlur: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        this.set(average1(d), 1, 1/d, 0.0, d); 
        this._doIntegral = 1; return this;
    }
    
    ,horizontalBlur: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        this.set(average1(d), d, 1/d, 0.0, 1); 
        this._doIntegral = 1; return this;
    }
    
    // supports only vertical, horizontal, diagonal
    ,directionalBlur: function( theta, d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        theta *= toRad;
        return this.set(twos2(d, Cos(theta), -Sin(theta), 1/d), d, 1.0, 0.0);
    }
    
    // generic binomial(quasi-gaussian) low-pass filter
    ,binomialLowPass: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        /*var filt=binomial(d);
        return this.set(filt.kernel, d, 1/filt.sum); */
        var kernel = binomial1(d), fact = 1/(1<<(d-1));
        this.set(kernel, d, fact, fact, d, kernel);
        this._doSeparable = true; return this;
    }
    ,gaussBlur: null

    // generic binomial(quasi-gaussian) high-pass filter
    ,binomialHighPass: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        var kernel = binomial2(d);
        // HighPass Filter = I - (respective)LowPass Filter
        return this.set(blend(ones(d), kernel, 1, -1/summa(kernel)), d, 1.0, 0.0); 
    }
    
    // X-gradient, partial X-derivative (Prewitt)
    ,prewittX: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(prewitt(d, 0), d, 1.0, 0.0);
        this.set(average1(d), d, 1.0, 0.0, d, derivative1(d,0));
        this._doSeparable = true; return this;
    }
    ,gradX: null
    
    // Y-gradient, partial Y-derivative (Prewitt)
    ,prewittY: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(prewitt(d, 1), d, 1.0, 0.0);
        this.set(derivative1(d,1), d, 1.0, 0.0, d, average1(d));
        this._doSeparable = true; return this;
    }
    ,gradY: null
    
    // directional gradient (Prewitt)
    ,prewittDirectional: function( theta, d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        theta *= toRad;
        return this.set(blend(prewitt(d, 0), prewitt(d, 1), Cos(theta), Sin(theta)), d, 1.0, 0.0);
    }
    ,gradDirectional: null
    
    // gradient magnitude (Prewitt)
    ,prewitt: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        this.set(prewitt(d, 0), d, 1.0, 0.0, d, prewitt(d, 1));
        this._isGrad = true; return this;
    }
    ,grad: null
    
    // partial X-derivative (Sobel)
    ,sobelX: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(sobel(d, 0), d, 1.0, 0.0);
        this.set(binomial1(d), d, 1.0, 0.0, d, derivative1(d,0));
        this._doSeparable = true; return this;
    }
    
    // partial Y-derivative (Sobel)
    ,sobelY: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(sobel(d, 1), d, 1.0, 0.0);
        this.set(derivative1(d,1), d, 1.0, 0.0, d, binomial1(d));
        this._doSeparable = true; return this;
    }
    
    // directional gradient (Sobel)
    ,sobelDirectional: function( theta, d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        theta *= toRad;
        return this.set(blend(sobel(d, 0), sobel(d, 1), Cos(theta), Sin(theta)), d, 1.0, 0.0);
    }
    
    // gradient magnitude (Sobel)
    ,sobel: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        this.set(sobel(d, 0), d, 1.0, 0.0, d, sobel(d, 1));
        this._isGrad = true; return this;
    }
    
    ,laplace: function( d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        this.set(ones(d, -1, d*d-1), d, 1.0, 0.0);
        this._doIntegral = 1; return this;
    }
    
    ,emboss: function( angle, amount, d ) {
        d = d === undef ? 3 : (d&1 ? d : d+1);
        angle = angle === undef ? -0.25*Math.PI : angle*toRad;
        amount = amount || 1;
        return this.set(twos(d, amount*Cos(angle), -amount*Sin(angle), 1), d, 1.0, 0.0);
    }
    ,bump: null
    
    ,edges: function( m ) {
        m = m || 1;
        return this.set([
            0,   m,   0,
            m,  -4*m, m,
            0,   m,   0
         ], 3, 1.0, 0.0);
    }
    
    ,set: function( m, d, f, b, d2, m2 ) {
        var self = this, tmp;
        
        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        self.matrix2 = null; self.dim2 = 0; self._indices2 = self._indicesf2 = null; self._mat2 = null;
        
        self.matrix = new CM(m); self.dim = d; self._coeff[0] = f||1; self._coeff[1] = b||0;
        tmp  = indices(self.matrix, self.dim);
        self._indices = tmp[0]; self._indicesf = tmp[1]; self._mat = tmp[2];
        
        if ( m2 )
        {
            self.matrix2 = new CM(m2); self.dim2 = d2;
            tmp  = indices(self.matrix2, self.dim2);
            self._indices2 = tmp[0]; self._indicesf2 = tmp[1]; self._mat2 = tmp[2];
        }
        else if ( d2 )
        {
            self.dim2 = d2;
        }
        
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self.matrix = self.matrix2 = null; 
        self.dim = self.dim2 = 0;
        self._mat = self._mat2 = null; 
        self._indices = self._indices2 = self._indicesf = self._indicesf2 = null;
        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        return self;
    }
    
    ,combineWith: function( filt ) {
        var self = this;
        if ( !filt.matrix ) return self;
        return self.matrix ? self.set(convolve(self.matrix, filt.matrix), self.dim*filt.dim, self._coeff[0]*filt._coeff[0]) : self.set(filt.matrix, filt.dim, filt._coeff[0], filt._coeff[1]);
    }
    
    // used for internal purposes
    ,_apply: notSupportClamp ? function( im, w, h ) {
        var self = this, mode = self.mode;
        if ( !self.matrix ) return im;
        
        // do a faster convolution routine if possible
        if ( self._doIntegral ) 
        {
            return self.matrix2 ? integral_convolution(mode, im, w, h, self.matrix, self.matrix2, self.dim, self.dim2, self._coeff[0], self._coeff[1], self._doIntegral) : integral_convolution(mode, im, w, h, self.matrix, null, self.dim, self.dim, self._coeff[0], self._coeff[1], self._doIntegral);
        }
        else if ( self._doSeparable )
        {
            return separable_convolution(mode, im, w, h, self._mat, self._mat2, self._indices, self._indices2, self._coeff[0], self._coeff[1]);
        }
        
        var imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen), 
            t0, t1, t2, t3, i, j, k, x, ty, ty2, 
            xOff, yOff, srcOff, r, g, b, a, r2, g2, b2, a2,
            bx = w-1, by = imArea-w, coeff1 = self._coeff[0], coeff2 = self._coeff[1],
            mat = self.matrix, mat2 = self.matrix2, wt, wt2, _isGrad = self._isGrad,
            mArea, matArea, imageIndices;
        
        // apply filter (algorithm direct implementation based on filter definition with some optimizations)
        if ( MODE.GRAY === mode )
        {
            if (mat2) // allow to compute a second matrix in-parallel in same pass
            {
                // pre-compute indices, 
                // reduce redundant computations inside the main convolution loop (faster)
                mArea = self._indicesf.length; 
                imageIndices = new A16I(self._indicesf);
                for (k=0; k<mArea; k+=2) imageIndices[k+1] *= w;
                matArea = mat.length;
                
                // do direct convolution
                x=0; ty=0;
                for (i=0; i<imLen; i+=4, x++)
                {
                    // update image coordinates
                    if (x>=w) { x=0; ty+=w; }
                    
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=g=b=a=r2=g2=b2=a2=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2; 
                        wt = mat[k]; r += im[srcOff] * wt;
                        // allow to apply a second similar matrix in-parallel (eg for total gradients)
                        wt2 = mat2[k]; r2 += im[srcOff] * wt2;
                    }
                    
                    // output
                    if ( _isGrad )
                    {
                        t0 = Abs(r)+Abs(r2);
                    }
                    else
                    {
                        t0 = coeff1*r + coeff2*r2;
                    }
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
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
                for (k=0; k<mArea; k+=2) imageIndices[k+1] *= w;
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
                    r=g=b=a=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt;
                    }
                    
                    // output
                    t0 = coeff1*r+coeff2;
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
        }
        else
        {
            if (mat2) // allow to compute a second matrix in-parallel in same pass
            {
                // pre-compute indices, 
                // reduce redundant computations inside the main convolution loop (faster)
                mArea = self._indicesf.length; 
                imageIndices = new A16I(self._indicesf);
                for (k=0; k<mArea; k+=2) imageIndices[k+1] *= w;
                matArea = mat.length;
                
                // do direct convolution
                x=0; ty=0;
                for (i=0; i<imLen; i+=4, x++)
                {
                    // update image coordinates
                    if (x>=w) { x=0; ty+=w; }
                    
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=g=b=a=r2=g2=b2=a2=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2; 
                        wt = mat[k]; r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        //a += im[srcOff+3] * wt;
                        // allow to apply a second similar matrix in-parallel (eg for total gradients)
                        wt2 = mat2[k]; r2 += im[srcOff] * wt2; g2 += im[srcOff+1] * wt2;  b2 += im[srcOff+2] * wt2;
                        //a2 += im[srcOff+3] * wt2;
                    }
                    
                    // output
                    if ( _isGrad )
                    {
                        t0 = Abs(r)+Abs(r2);  t1 = Abs(g)+Abs(g2);  t2 = Abs(b)+Abs(b2);
                    }
                    else
                    {
                        t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                    }
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
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
                for (k=0; k<mArea; k+=2) imageIndices[k+1] *= w;
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
                    r=g=b=a=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        //a += im[srcOff+3] * wt;
                    }
                    
                    // output
                    t0 = coeff1*r+coeff2;  t1 = coeff1*g+coeff2;  t2 = coeff1*b+coeff2;
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
        }
        return dst;
    } : function( im, w, h ) {
        var self = this, mode = self.mode;
        if ( !self.matrix ) return im;
        
        // do a faster convolution routine if possible
        if ( self._doIntegral ) 
        {
            return self.matrix2 ? integral_convolution(mode, im, w, h, self.matrix, self.matrix2, self.dim, self.dim2, self._coeff[0], self._coeff[1], self._doIntegral) : integral_convolution(mode, im, w, h, self.matrix, null, self.dim, self.dim, self._coeff[0], self._coeff[1], self._doIntegral);
        }
        else if ( self._doSeparable )
        {
            return separable_convolution(mode, im, w, h, self._mat, self._mat2, self._indices, self._indices2, self._coeff[0], self._coeff[1]);
        }
        
        var imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen), 
            t0, t1, t2, t3, i, j, k, x, ty, ty2, 
            xOff, yOff, srcOff, r, g, b, a, r2, g2, b2, a2,
            bx = w-1, by = imArea-w, coeff1 = self._coeff[0], coeff2 = self._coeff[1],
            mat = self.matrix, mat2 = self.matrix2, wt, wt2, _isGrad = self._isGrad,
            mArea, matArea, imageIndices;
        
        // apply filter (algorithm direct implementation based on filter definition with some optimizations)
        if ( MODE.GRAY === mode )
        {
            if (mat2) // allow to compute a second matrix in-parallel in same pass
            {
                // pre-compute indices, 
                // reduce redundant computations inside the main convolution loop (faster)
                mArea = self._indicesf.length; 
                imageIndices = new A16I(self._indicesf);
                for (k=0; k<mArea; k+=2) imageIndices[k+1] *= w;
                matArea = mat.length;
                
                // do direct convolution
                x=0; ty=0;
                for (i=0; i<imLen; i+=4, x++)
                {
                    // update image coordinates
                    if (x>=w) { x=0; ty+=w; }
                    
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=g=b=a=r2=g2=b2=a2=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2; 
                        wt = mat[k]; r += im[srcOff] * wt;
                        // allow to apply a second similar matrix in-parallel (eg for total gradients)
                        wt2 = mat2[k]; r2 += im[srcOff] * wt2;
                    }
                    
                    // output
                    if ( _isGrad )
                    {
                        t0 = Abs(r)+Abs(r2);
                    }
                    else
                    {
                        t0 = coeff1*r + coeff2*r2;
                    }
                    dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
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
                for (k=0; k<mArea; k+=2) imageIndices[k+1] *= w;
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
                    r=g=b=a=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt;
                    }
                    
                    // output
                    t0 = coeff1*r+coeff2;
                    dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
        }
        else
        {
            if (mat2) // allow to compute a second matrix in-parallel in same pass
            {
                // pre-compute indices, 
                // reduce redundant computations inside the main convolution loop (faster)
                mArea = self._indicesf.length; 
                imageIndices = new A16I(self._indicesf);
                for (k=0; k<mArea; k+=2) imageIndices[k+1] *= w;
                matArea = mat.length;
                
                // do direct convolution
                x=0; ty=0;
                for (i=0; i<imLen; i+=4, x++)
                {
                    // update image coordinates
                    if (x>=w) { x=0; ty+=w; }
                    
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=g=b=a=r2=g2=b2=a2=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2; 
                        wt = mat[k]; r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        //a += im[srcOff+3] * wt;
                        // allow to apply a second similar matrix in-parallel (eg for total gradients)
                        wt2 = mat2[k]; r2 += im[srcOff] * wt2; g2 += im[srcOff+1] * wt2;  b2 += im[srcOff+2] * wt2;
                        //a2 += im[srcOff+3] * wt2;
                    }
                    
                    // output
                    if ( _isGrad )
                    {
                        t0 = Abs(r)+Abs(r2);  t1 = Abs(g)+Abs(g2);  t2 = Abs(b)+Abs(b2);
                    }
                    else
                    {
                        t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                    }
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
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
                for (k=0; k<mArea; k+=2) imageIndices[k+1] *= w;
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
                    r=g=b=a=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        //a += im[srcOff+3] * wt;
                    }
                    
                    // output
                    t0 = coeff1*r+coeff2;  t1 = coeff1*g+coeff2;  t2 = coeff1*b+coeff2;
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
        }
        return dst;
    }
        
    ,canRun: function( ) {
        return this._isOn && this.matrix;
    }
});
// aliases
ConvolutionMatrixFilter.prototype.gradX = ConvolutionMatrixFilter.prototype.prewittX;
ConvolutionMatrixFilter.prototype.gradY = ConvolutionMatrixFilter.prototype.prewittY;
ConvolutionMatrixFilter.prototype.gradDirectional = ConvolutionMatrixFilter.prototype.prewittDirectional;
ConvolutionMatrixFilter.prototype.grad = ConvolutionMatrixFilter.prototype.prewitt;
ConvolutionMatrixFilter.prototype.bump = ConvolutionMatrixFilter.prototype.emboss;
ConvolutionMatrixFilter.prototype.boxBlur = ConvolutionMatrixFilter.prototype.lowPass;
ConvolutionMatrixFilter.prototype.gaussBlur = ConvolutionMatrixFilter.prototype.binomialLowPass;


//
//  Private methods
function summa( kernel )
{
    for(var sum=0,i=0,l=kernel.length; i<l; i++) sum += kernel[i];
    return sum;
}
function indices( m, d )
{
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    var indices = [], indices2 = [], mat = [], k, x, y,  matArea = m.length, matRadius = d, matHalfSide = matRadius>>>1;
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

function functional1( d, f )
{
    var x, y, i, ker = new Array(d);
    for(x=0,y=0,i=0; i<d; i++,x++) ker[i] = f(x, y, d);
    return ker;
}
function identity1( d )
{
    var i, ker = new Array(d);
    for(i=0; i<d; i++) ker[i] = 0;
    ker[d>>>1] = 1;
    return ker;
}
function average1( d )
{
    var i, ker = new Array(d);
    for(i=0; i<d; i++) ker[i] = 1;
    return ker;
}
function derivative1( d, rev )
{
    var i, half = d>>>1, ker = new Array(d);
    if ( rev ) for(i=0; i<d; i++) ker[d-1-i] = i-half;
    else for(i=0; i<d; i++) ker[i] = i-half;
    return ker;
}

// pascal numbers (binomial coefficients) are used to get coefficients for filters that resemble gaussian distributions
// eg Sobel, Canny, gradients etc..
function binomial1( d )
{
    var l = _pascal.length, row, uprow, i, il;
    d--;
    if (d < l)
    {
        row = _pascal[d];
    }
    else
    {
        // else compute them iteratively
        row = _pascal[l-1];
        while ( l<=d )
        {
            uprow=row; row=new Array(uprow.length+1); row[0]=1;
            for(i=0,il=uprow.length-1; i<il; i++) row[i+1] = uprow[i]+uprow[i+1]; row[uprow.length]=1;
            if (l<20) _pascal.push(row); // save it for future dynamically
            l++;
        }
    }
    return row.slice();
}

//console.log( binomial1( 5 ) );
//console.log( derivative1( 5 ) );
//console.log( sobel( 5 ) );
//console.log( binomial2( 5 ) );
//console.log( summa(binomial2( 5 )) );

function functional2( d, f )
{
    var functional = functional1(d, f);
    // convolve with itself
    return convolve(functional, functional);
}
function binomial2( d )
{
    var binomial = binomial1(d);
    // convolve with itself
    return convolve(binomial, binomial);
}
function vertical2( d )
{
    return convolve(average1(d), identity1(d));
}
function horizontal2( d )
{
    return convolve(identity1(d), average1(d));
}
function sobel( d, dir )
{
    return 1===dir ? /*y*/convolve(derivative1(d,1), binomial1(d)) : /*x*/convolve(binomial1(d), derivative1(d,0));
}
function prewitt( d, dir )
{
    return 1===dir ? /*y*/convolve(derivative1(d,1), average1(d)) : /*x*/convolve(average1(d), derivative1(d,0));
}
function ones( d, f, c )
{ 
    f = f||1; c = c||f;
    var l = d*d, i, o = new CM(l);
    for(i=0; i<d; i++) o[i] = f;
    o[l>>>1] = c;
    return o;
}
function twos( d, dx, dy, c )
{
    var l=d*d, half=d>>>1, center=l>>>1, i, k, j, o=new CM(l), tx, ty;
    for (tx=0,i=0; i<=half; i++,tx+=dx)
    {
        for (k=0,ty=0,j=0; j<=half; j++,k+=d,ty+=dy)
        {
            //tx=i*dx;  ty=j*dy;
            o[center + i + k]=   tx + ty;
            o[center - i - k]= - tx - ty;
            o[center - i + k]= - tx + ty;
            o[center + i - k]=   tx - ty;
        }
    }
    o[center] = c||1;
    return o;
}
function twos2( d, c, s, cf )
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
        T[center + i]= (center + tx + ty + 0.5)|0;
        T[center - i]= (center - tx - ty + 0.5)|0;
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

}(FILTER);