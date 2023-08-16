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
!function(FILTER, undef) {
"use strict";

var MODE = FILTER.MODE, CM = FILTER.ConvolutionMatrix, IMG = FILTER.ImArray,
    A32F = FILTER.Array32F, A16I = FILTER.Array16I, A8U = FILTER.Array8U,
    convolve = FILTER.Util.Filter.cm_convolve,
    combine = FILTER.Util.Filter.cm_combine,
    gaussian = FILTER.Util.Filter.gaussian,
    integral_convolution = FILTER.Util.Filter.integral_convolution,
    separable_convolution = FILTER.Util.Filter.separable_convolution,
    TypedArray = FILTER.Util.Array.typed,
    notSupportClamp = FILTER._notSupportClamp,
    GLSL = FILTER.Util.GLSL,

    stdMath = Math, sqrt2 = stdMath.SQRT2, toRad = FILTER.CONST.toRad, toDeg = FILTER.CONST.toDeg,
    Abs = stdMath.abs, Sqrt = stdMath.sqrt, Sin = stdMath.sin, Cos = stdMath.cos,
    Min = stdMath.min, Max = stdMath.max,

    // hardcode Pascal numbers, used for binomial kernels
    _pascal = [
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

    ,init: function ConvolutionMatrixFilter(weights, factor, bias, mode) {
        var self = this, d;
        self._coeff = new CM([1.0, 0.0]);
        if (weights && weights.length)
        {
            d = (Sqrt(weights.length)+0.5)|0;
            self.set(weights, d, d, factor||1.0, bias||0.0);
        }
        self.mode = mode || MODE.RGB;
    }

    ,path: FILTER.Path
    ,dimx: 0
    ,dimy: 0
    ,dimx2: 0
    ,dimy2: 0
    ,matrix: null
    ,matrix2: null
    ,_mat: null
    ,_mat2: null
    ,_coeff: null
    ,_isGrad: false
    ,_doIntegral: 0
    ,_doSeparable: false
    ,_doIntegralSeparable: null
    ,_indices: null
    ,_indices2: null
    ,_indicesf: null
    ,_indicesf2: null
    ,_w: null
    ,mode: MODE.RGB

    ,dispose: function() {
        var self = this;
        self.dimx = self.dimy = null;
        self.dimx2 = self.dimy2 = null;
        self.matrix = null;
        self.matrix2 = null;
        self._mat = null;
        self._mat2 = null;
        self._coeff = null;
        self._isGrad = null;
        self._doIntegral = null;
        self._doSeparable = null;
        self._doIntegralSeparable = null;
        self._indices = null;
        self._indices2 = null;
        self._indicesf = null;
        self._indicesf2 = null;
        self._w = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             dimx: self.dimx
            ,dimy: self.dimy
            ,dimx2: self.dimx2
            ,dimy2: self.dimy2
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
            ,_w: self._w
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.dimx = params.dimx;
        self.dimy = params.dimy;
        self.dimx2 = params.dimx2;
        self.dimy2 = params.dimy2;
        self.matrix = TypedArray(params.matrix, CM);
        self.matrix2 = TypedArray(params.matrix2, CM);
        self._mat = TypedArray(params._mat, CM);
        self._mat2 = TypedArray(params._mat2, CM);
        self._coeff = TypedArray(params._coeff, CM);
        self._isGrad = params._isGrad;
        self._doIntegral = params._doIntegral;
        self._doSeparable = params._doSeparable;
        self._indices = TypedArray(params._indices, A16I);
        self._indices2 = TypedArray(params._indices2, A16I);
        self._indicesf = TypedArray(params._indicesf, A16I);
        self._indicesf2 = TypedArray(params._indicesf2, A16I);
        self._w = params._w ? [TypedArray(params._w[0], CM), +params._w[1], +params._w[2], +params._w[3]] : null;
        return self;
    }

    // generic functional-based kernel filter
    ,functional: function(f, d, separable) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        if (separable)
        {
            // separable
            self.set(functional(d, 1, f), d, 1, 1, 1, 1, d, functional(1, d, f));
            self._doSeparable = true;
        }
        else
        {
            self.set(functional(d, d, f), d, d, 1, 0);
        }
        return self;
    }

    // fast gauss filter
    ,fastGauss: function(quality, d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        quality = (quality||1)|0;
        if (quality < 1) quality = 1;
        else if (quality > 7) quality = 7;
        self.set(ones(d), d, d, 1/(d*d), 0.0);
        self._doIntegralSeparable = [average1(d), d, 1, 1/d, 0, average1(d), 1, d, 1/d, 0];
        self._doIntegral = quality; return self;
    }

    // gauss filter
    ,gauss: function(sigma, d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        self.set(gaussian(d, 1, sigma), d, 1, 1, 1, 1, d, gaussian(1, d, sigma));
        self._doSeparable = true; return self;
    }

    // generic box low-pass filter
    ,lowPass: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        self.set(ones(d), d, d, 1/(d*d), 0.0);
        self._doIntegral = 1; return self;
    }
    ,boxBlur: null

    // generic box high-pass filter (I-LP)
    ,highPass: function(d, f) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        f = null == f ? 1 : f;
        // HighPass Filter = I - (respective)LowPass Filter
        var fact = -f/(d*d);
        self.set(ones(d, fact, 1+fact), d, d, 1.0, 0.0);
        self._doIntegral = 1; return self;
    }

    ,glow: function(f, d) {
        f = null == f ? 0.5 : f;
        return this.highPass(d, -f);
    }

    ,sharpen: function(f, d) {
        f = null == f ? 0.5 : f;
        return this.highPass(d, f);
    }

    ,verticalBlur: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        self.set(average1(d), 1, d, 1/d, 0.0);
        self._doIntegral = 1; return self;
    }

    ,horizontalBlur: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        self.set(average1(d), d, 1, 1/d, 0.0);
        self._doIntegral = 1; return self;
    }

    // supports only vertical, horizontal, diagonal
    ,directionalBlur: function(theta, d) {
        d = null == d ? 3 : (d&1 ? d : d+1);
        theta *= toRad;
        return this.set(twos2(d, Cos(theta), -Sin(theta), 1/d), d, d, 1.0, 0.0);
    }

    // generic binomial(quasi-gaussian) low-pass filter
    ,binomialLowPass: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        /*var filt=binomial(d);
        return this.set(filt.kernel, d, 1/filt.sum); */
        var kernel = binomial1(d), fact = 1/(1<<(d-1));
        self.set(kernel, d, 1, fact, fact, 1, d, kernel);
        self._doSeparable = true; return self;
    }
    ,gaussBlur: null

    // generic binomial(quasi-gaussian) high-pass filter
    ,binomialHighPass: function(d) {
        d = null == d ? 3 : (d&1 ? d : d+1);
        var kernel = binomial2(d);
        // HighPass Filter = I - (respective)LowPass Filter
        return this.set(combine(ones(d), kernel, 1, -1/summa(kernel)), d, d, 1.0, 0.0);
    }

    // X-gradient, partial X-derivative (Prewitt)
    ,prewittX: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(prewitt(d, 0), d, 1.0, 0.0);
        self.set(derivative1(d,1), d, 1, 1, 1, 1, d, average1(d));
        self._doSeparable = true; return self;
    }
    ,gradX: null

    // Y-gradient, partial Y-derivative (Prewitt)
    ,prewittY: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(prewitt(d, 1), d, 1.0, 0.0);
        self.set(average1(d), d, 1, 1, 1, 1, d, derivative1(d,1));
        self._doSeparable = true; return self;
    }
    ,gradY: null

    // directional gradient (Prewitt)
    ,prewittDirectional: function(theta, d) {
        d = null == d ? 3 : (d&1 ? d : d+1);
        theta *= toRad;
        return this.set(combine(prewitt(d, 0), prewitt(d, 1), Cos(theta), Sin(theta)), d, d, 1.0, 0.0);
    }
    ,gradDirectional: null

    // gradient magnitude (Prewitt)
    ,prewitt: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        self.set(prewitt(d, 0), d, d, 1.0, 0.0, d, d, prewitt(d, 1));
        self._isGrad = true; return self;
    }
    ,grad: null

    // partial X-derivative (Sobel)
    ,sobelX: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(sobel(d, 0), d, 1.0, 0.0);
        self.set(derivative1(d,1), d, 1, 1, 1, 1, d, binomial1(d));
        self._doSeparable = true; return self;
    }

    // partial Y-derivative (Sobel)
    ,sobelY: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(sobel(d, 1), d, 1.0, 0.0);
        self.set(binomial1(d), d, 1, 1, 1, 1, d, derivative1(d,1));
        self._doSeparable = true; return self;
    }

    // directional gradient (Sobel)
    ,sobelDirectional: function(theta, d) {
        d = null == d ? 3 : (d&1 ? d : d+1);
        theta *= toRad;
        return this.set(combine(sobel(d, 0), sobel(d, 1), Cos(theta), Sin(theta)), d, d, 1.0, 0.0);
    }

    // gradient magnitude (Sobel)
    ,sobel: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        self.set(sobel(d, 0), d, d, 1.0, 0.0, d, d, sobel(d, 1));
        self._isGrad = true; return self;
    }

    ,laplace: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        self.set(ones(d, -1, d*d-1), d, d, 1.0, 0.0);
        self._doIntegral = 1; return self;
    }

    ,emboss: function(angle, amount, d) {
        d = null == d ? 3 : (d&1 ? d : d+1);
        angle = null == angle ? -0.25*stdMath.PI : angle*toRad;
        amount = amount || 1;
        return this.set(twos(d, amount*Cos(angle), -amount*Sin(angle), 1), d, d, 1.0, 0.0);
    }
    ,bump: null

    ,edges: function(m) {
        m = m || 1;
        return this.set([
            0,   m,   0,
            m,  -4*m, m,
            0,   m,   0
         ], 3, 3, 1.0, 0.0);
    }
    ,bilateral: function(d, sigmaSpatial, sigmaColor) {
        d = null == d ? 3 : (d&1 ? d : d+1);
        var self = this;
        self.set(ones(d), d, d, 1, 0);
        self._w = bilateral(d, sigmaSpatial||1, sigmaColor||1);
        return self;
    }

    ,set: function(m, dx, dy, f, b, dx2, dy2, m2) {
        var self = this, tmp;

        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        self._doIntegralSeparable = null;
        self.matrix2 = null;
        self.dimx2 = self.dimy2 = 0;
        self._indices2 = self._indicesf2 = null;
        self._mat2 = self._w = null;

        self.matrix = new CM(m);
        if (null == dy) dy = dx;
        self.dimx = dx; self.dimy = dy;
        if (null == f) {f = 1; b = 0;}
        self._coeff[0] = f; self._coeff[1] = b||0;
        tmp = indices(self.matrix, self.dimx, self.dimy);
        self._indices = tmp[0]; self._indicesf = tmp[1]; self._mat = tmp[2];

        if (m2)
        {
            self.matrix2 = new CM(m2);
            self.dimx2 = dx2; self.dimy2 = dy2;
            tmp = indices(self.matrix2, self.dimx2, self.dimy2);
            self._indices2 = tmp[0]; self._indicesf2 = tmp[1]; self._mat2 = tmp[2];
        }
        else if (null != dx2)
        {
            self.dimx2 = dx2;
            self.dimy2 = dy2;
        }

        self._glsl = null;
        return self;
    }

    ,reset: function() {
        var self = this;
        self.matrix = self.matrix2 = null;
        self.dimx = self.dimy = self.dimx2 = self.dimy2 = 0;
        self._mat = self._mat2 = self._w = null;
        self._indices = self._indices2 = self._indicesf = self._indicesf2 = null;
        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        self._doIntegralSeparable = null;
        self._glsl = null;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,combineWith: function(filt) {
        var self = this;
        if (!filt.matrix) return self;
        return self.matrix ? self.set(convolve(self.matrix, filt.matrix), self.dimx*filt.dimx, self.dimy*filt.dimy, self._coeff[0]*filt._coeff[0]) : self.set(filt.matrix, filt.dimx, filt.dimy, filt._coeff[0], filt._coeff[1]);
    }

    // used for internal purposes
    ,_apply_weighted: function(im, w, h, d, wS, fC) {
        var self = this,
            imLen = im.length,
            dst = new IMG(imLen),
            x, y, yw, xx, yy, yyw,
            r, g, b, r2, g2, b2,
            sr, sg, sb, dr, dg, db,
            bx = w-1, by = h-1, i, j, k,
            radius = d >>>1, l = d*d, f, s,
            exp = stdMath.exp, is_gray = MODE.GRAY === self.mode;
        for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
        {
            if (x >= w) {x=0; ++y; yw+=w;}
            r = im[i]; g = im[i+1]; b = im[i+2];
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
                    r2 = im[j]; g2 = im[j+1]; b2 = im[j+2];
                }
                dr = (r2-r); dg = (g2-g); db = (b2-b);
                f = wS[k]*exp(fC*(dr*dr+dg*dg+db*db));
                s += f;
                sr += f*r2;
                sg += f*g2;
                sb += f*b2;
            }
            sr /= s; sg /= s; sb /= s;
            if (notSupportClamp)
            {
                // clamp them manually
                sr = sr<0 ? 0 : (sr>255 ? 255 : sr);
                sg = sg<0 ? 0 : (sg>255 ? 255 : sg);
                sb = sb<0 ? 0 : (sb>255 ? 255 : sb);
            }
            dst[i  ] = sr|0;
            dst[i+1] = sg|0;
            dst[i+2] = sb|0;
            dst[i+3] = im[i+3];
        }
        return dst;
    }
    ,_apply: function(im, w, h) {
        //"use asm";
        var self = this, mode = self.mode;
        if (!self.matrix) return im;
        if (self._w)
        {
            return self._apply_weighted(im, w, h, self.dimx, self._w[0], self._w[1]);
        }
        // do a faster convolution routine if possible
        else if (self._doIntegral)
        {
            return self.matrix2 ? integral_convolution(mode, im, w, h, 2, self.matrix, self.matrix2, self.dimx, self.dimy, self.dimx2, self.dimy2, self._coeff[0], self._coeff[1], self._doIntegral) : integral_convolution(mode, im, w, h, 2, self.matrix, null, self.dimx, self.dimy, self.dimx, self.dimy, self._coeff[0], self._coeff[1], self._doIntegral);
        }
        else if (self._doSeparable)
        {
            return separable_convolution(mode, im, w, h, 2, self._mat, self._mat2, self._indices, self._indices2, self._coeff[0], self._coeff[1]);
        }

        var imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen),
            t0, t1, t2, t3, i, j, k, x, ty, ty2, tm, tM,
            xOff, yOff, srcOff, r, g, b, a, r2, g2, b2, a2,
            bx = w-1, by = imArea-w, coeff1 = self._coeff[0], coeff2 = self._coeff[1],
            mat = self._mat, mat2 = self._mat2, wt, wt2, _isGrad = self._isGrad,
            mArea, matArea, imageIndices,
            mArea2, matArea2, imageIndices2, ma;

        // apply filter (algorithm direct implementation based on filter definition with some optimizations)
        if (MODE.GRAY === mode)
        {
            if (mat2) // allow to compute a second matrix in-parallel in same pass
            {
                // pre-compute indices,
                // reduce redundant computations inside the main convolution loop (faster)
                mArea = self._indices.length;
                imageIndices = new A16I(self._indices);
                for (k=0; k<mArea; k+=2) imageIndices[k+1] *= w;
                matArea = mat.length;
                mArea2 = self._indices2.length;
                imageIndices2 = new A16I(self._indices2);
                for (k=0; k<mArea2; k+=2) imageIndices2[k+1] *= w;
                matArea2 = mat2.length;

                // do direct convolution
                x=0; ty=0; ma = Max(matArea,matArea2);
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
                                wt = mat[k]; r += im[srcOff] * wt;
                            }
                        }
                        if (k<matArea2)
                        {
                            xOff = x + imageIndices2[j]; yOff = ty + imageIndices2[j+1];
                            if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                            {
                                srcOff = (xOff + yOff)<<2;
                                wt = mat2[k]; r2 += im[srcOff] * wt;
                            }
                        }
                    }

                    // output
                    if (_isGrad)
                    {
                        r = Abs(r);
                        r2 = Abs(r2);
                        tM = Max(r, r2);
                        if (tM)
                        {
                            // approximation
                            tm = Min(r, r2);
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
                    if (notSupportClamp)
                    {
                        // clamp them manually
                        t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
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
                        r += im[srcOff] * wt;
                    }

                    // output
                    t0 = coeff1*r+coeff2;
                    if (notSupportClamp)
                    {
                        // clamp them manually
                        t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    }
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
                mArea = self._indices.length;
                imageIndices = new A16I(self._indices);
                for (k=0; k<mArea; k+=2) imageIndices[k+1] *= w;
                matArea = mat.length;
                mArea2 = self._indices2.length;
                imageIndices2 = new A16I(self._indices2);
                for (k=0; k<mArea2; k+=2) imageIndices2[k+1] *= w;
                matArea2 = mat2.length;

                // do direct convolution
                x=0; ty=0; ma = Max(matArea,matArea2);
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
                                wt = mat[k]; r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                            }
                        }
                        // allow to apply a second similar matrix in-parallel (eg for total gradients)
                        if (k<matArea2)
                        {
                            xOff = x + imageIndices2[j]; yOff = ty + imageIndices2[j+1];
                            if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                            {
                                srcOff = (xOff + yOff)<<2;
                                wt2 = mat2[k]; r2 += im[srcOff] * wt2; g2 += im[srcOff+1] * wt2;  b2 += im[srcOff+2] * wt2;
                            }
                        }
                    }

                    // output
                    if (_isGrad)
                    {
                        r = Abs(r);
                        r2 = Abs(r2);
                        tM = Max(r, r2);
                        if (tM)
                        {
                            // approximation
                            tm = Min(r, r2);
                            t0 = tM*(1+0.43*tm/tM*tm/tM);
                        }
                        else
                        {
                            t0 = 0;
                        }
                        g = Abs(g);
                        g2 = Abs(g2);
                        tM = Max(g, g2);
                        if (tM)
                        {
                            // approximation
                            tm = Min(g, g2);
                            t1 = tM*(1+0.43*tm/tM*tm/tM);
                        }
                        else
                        {
                            t1 = 0;
                        }
                        b = Abs(b);
                        b2 = Abs(b2);
                        tM = Max(b, b2);
                        if (tM)
                        {
                            // approximation
                            tm = Min(b, b2);
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
                    if (notSupportClamp)
                    {
                        // clamp them manually
                        t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                        t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                        t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
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
                    if (notSupportClamp)
                    {
                        // clamp them manually
                        t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                        t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                        t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    }
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
        }
        return dst;
    }
});
// aliases
ConvolutionMatrixFilter.prototype.gradX = ConvolutionMatrixFilter.prototype.prewittX;
ConvolutionMatrixFilter.prototype.gradY = ConvolutionMatrixFilter.prototype.prewittY;
ConvolutionMatrixFilter.prototype.gradDirectional = ConvolutionMatrixFilter.prototype.prewittDirectional;
ConvolutionMatrixFilter.prototype.grad = ConvolutionMatrixFilter.prototype.prewitt;
ConvolutionMatrixFilter.prototype.bump = ConvolutionMatrixFilter.prototype.emboss;
ConvolutionMatrixFilter.prototype.boxBlur = ConvolutionMatrixFilter.prototype.lowPass;
ConvolutionMatrixFilter.prototype.gaussBlur = ConvolutionMatrixFilter.prototype.gauss/*binomialLowPass*/;


//  Private methods
function glsl(filter)
{
    var matrix_code = function(m, m2, dx, dy, dx2, dy2, f, b, isGrad) {
        var def = [], calc = [], calc2 = [],
            k, i, j, matArea = m.length,
            rx = dx>>>1, ry = dy>>>1;
        def.push('vec4 col=texture2D(img,  pix);');
        i=-rx; j=-ry; k=0;
        while (k<matArea)
        {
            if (m[k])
            {
                def.push('vec2 p'+k+'=vec2(pix.x'+toFloat(i, 1)+'*dp.x, pix.y'+toFloat(j, 1)+'*dp.y); vec3 c'+k+'=vec3(0.0); if (0.0 <= p'+k+'.x && 1.0 >= p'+k+'.x && 0.0 <= p'+k+'.y && 1.0 >= p'+k+'.y) c'+k+'=texture2D(img,  p'+k+').rgb;');
                calc.push(toFloat(m[k], calc.length)+'*c'+k);
            }
            ++k; ++i; if (i>rx) {i=-rx; ++j;}
        }
        if (m2)
        {
            matArea = m2.length;
            rx = dx2>>>1; ry = dy2>>>1;
            i=-rx; j=-ry; k=0;
            while (k<matArea)
            {
                if (m2[k])
                {
                    def.push('vec2 pp'+k+'=vec2(pix.x'+toFloat(i, 1)+'*dp.x, pix.y'+toFloat(j, 1)+'*dp.y); vec3 cc'+k+'=vec3(0.0); if (0.0 <= pp'+k+'.x && 1.0 >= pp'+k+'.x && 0.0 <= pp'+k+'.y && 1.0 >= pp'+k+'.y) cc'+k+'=texture2D(img,  pp'+k+').rgb;');
                    calc2.push(toFloat(m2[k], calc2.length)+'*cc'+k);
                }
                ++k; ++i; if (i>rx) {i=-rx; ++j;}
            }
            if (isGrad)
            {
                def.push('vec3 o1='+toFloat(f)+'*('+calc.join('')+');')
                def.push('vec3 o2='+toFloat(f)+'*('+calc2.join('')+');')
                return [def.join('\n'), 'vec4(sqrt(o1.x*o1.x+o2.x*o2.x),sqrt(o1.y*o1.y+o2.y*o2.y),sqrt(o1.z*o1.z+o2.z*o2.z),col.a)'];
            }
            else
            {
                def.push('vec3 o1='+calc.join('')+';')
                def.push('vec3 o2='+calc2.join('')+';')
                return [def.join('\n'), 'vec4(('+toFloat(f)+'*o1'+toFloat(b,1)+'*o2),col.a)'];
            }
        }
        else
        {
            return [def.join('\n'), 'vec4(('+toFloat(f)+'*('+calc.join('')+')+vec3('+toFloat(b)+')),col.a)'];
        }
    };
    var bilateral_code = function(d) {
        var def = [], calc = [],
            k, i, j, matArea = d*d, r = d>>>1;
        def.push('vec4 col=texture2D(img,  pix);');
        def.push('float f=0.0; float w; vec3 o=vec3(0.0);');
        i=-r; j=-r; k=0;
        while (k<matArea)
        {
            if (0===i && 0===j)
            {
                def.push('vec3 c'+k+'=col.rgb;');
            }
            else
            {
                def.push('vec2 p'+k+'=vec2(pix.x'+toFloat(i, 1)+'*dp.x, pix.y'+toFloat(j, 1)+'*dp.y); vec3 c'+k+'=col.rgb; if (0.0 <= p'+k+'.x && 1.0 >= p'+k+'.x && 0.0 <= p'+k+'.y && 1.0 >= p'+k+'.y) c'+k+'=texture2D(img,  p'+k+').rgb;');
            }
            calc.push('float wS'+k+'=wS['+k+']; float wC'+k+'=wC(c'+k+'.x-c0.x,c'+k+'.y-c0.y,c'+k+'.z-c0.z); w = wS'+k+'*wC'+k+'; f += w; o += w*c'+k+';');
            ++k; ++i; if (i>r) {i=-r; ++j;}
        }
        return [def.join('\n')+'\n'+calc.join('\n'), 'vec4(o/f,col.a)'];
    };
    var toFloat = GLSL.formatFloat, code, output,
        m = filter.matrix, m2 = filter.matrix2, t;
    if (!m) return {instance: filter, shader: GLSL.DEFAULT};
    if (filter._w)
    {
        code = bilateral_code(filter.dimx);
        return {instance: filter, shader: [
        'precision mediump float;',
        'varying vec2 pix;',
        'uniform sampler2D img;',
        'uniform vec2 dp;',
        'uniform float wS['+filter.matrix.length+'];',
        'uniform float fC;',
        'float wC(float r, float g, float b) {return exp(fC*(r*r+g*g+b*b));}',
        'void main(void) {',
        code[0],
        'gl_FragColor = '+code[1]+';',
        '}'
        ].join('\n'), vars: function(gl, w, h, program) {
            gl.uniform1fv(program.uniform.wS, filter._w[0]);
            gl.uniform1f(program.uniform.fC, filter._w[1]*255*255);
        }};
    }
    else if (t = filter._doIntegralSeparable)
    {
        output = [];
        code = matrix_code(t[0], null, t[1], t[2], t[1], t[2], t[3], t[4], false);
        output.push({instance: filter, shader: [
        'precision mediump float;',
        'varying vec2 pix;',
        'uniform sampler2D img;',
        'uniform vec2 dp;',
        'void main(void) {',
        code[0],
        'gl_FragColor = '+code[1]+';',
        '}'
        ].join('\n'), iterations: filter._doIntegral || 1});
        code = matrix_code(t[5], null, t[6], t[7], t[6], t[7], t[8], t[9], false);
        output.push({instance: filter, shader: [
        'precision mediump float;',
        'varying vec2 pix;',
        'uniform sampler2D img;',
        'uniform vec2 dp;',
        'void main(void) {',
        code[0],
        'gl_FragColor = '+code[1]+';',
        '}'
        ].join('\n'), iterations: filter._doIntegral || 1});
        return output;
    }
    else if (filter._doSeparable && m2)
    {
        output = [];
        code = matrix_code(m, null, filter.dimx, filter.dimy, filter.dimx, filter.dimy, filter._coeff[0], 0, false);
        output.push({instance: filter, shader: [
        'precision mediump float;',
        'varying vec2 pix;',
        'uniform sampler2D img;',
        'uniform vec2 dp;',
        'void main(void) {',
        code[0],
        'gl_FragColor = '+code[1]+';',
        '}'
        ].join('\n'), iterations: 1});
        code = matrix_code(m2, null, filter.dimx2, filter.dimy2, filter.dimx2, filter.dimy2, filter._coeff[1], 0, false);
        output.push({instance: filter, shader: [
        'precision mediump float;',
        'varying vec2 pix;',
        'uniform sampler2D img;',
        'uniform vec2 dp;',
        'void main(void) {',
        code[0],
        'gl_FragColor = '+code[1]+';',
        '}'
        ].join('\n'), iterations: 1});
        return output;
    }
    else
    {
        /*dx = filter.dimx; dy = filter.dimy;
        f = filter._coeff;
        if (filter._doSeparable && m2)
        {
            m = convolve(m, m2);
            dx = filter.dimx*filter.dimx2;
            dy = filter.dimy*filter.dimy2;
            f = [1, 0]
            m2 = null;
        }*/
        code = matrix_code(m, m2, filter.dimx, filter.dimy, filter.dimx2, filter.dimy2, filter._coeff[0], filter._coeff[1], filter._isGrad);
        return {instance: filter, shader: [
        'precision mediump float;',
        'varying vec2 pix;',
        'uniform sampler2D img;',
        'uniform vec2 dp;',
        'void main(void) {',
        code[0],
        'gl_FragColor = '+code[1]+';',
        '}'
        ].join('\n'), iterations: filter._doIntegral || 1};
    }
}
function indices(m, dx, dy)
{
    if (null == dy) dy = dx;
    // pre-compute indices,
    // reduce redundant computations inside the main convolution loop (faster)
    var indices = [], indices2 = [], mat = [], k, x, y,
        matArea = m.length, rx = dx >>> 1, ry = dy >>> 1;
    x=-rx; y=-ry; k=0;
    while (k<matArea)
    {
        indices2.push(x);
        indices2.push(y);
        if (m[k])
        {
            indices.push(x);
            indices.push(y);
            mat.push(m[k]);
        }
        ++k; ++x; if (x>rx) {x=-rx; ++y;}
    }
    return [new A16I(indices), new A16I(indices2), new CM(mat)];
}
function summa(kernel)
{
    for (var sum=0,i=0,l=kernel.length; i<l; ++i) sum += kernel[i];
    return sum;
}
function bilateral(d, sigmaSpatial, sigmaColor)
{
    return [gaussian(d, d, sigmaSpatial), -1/(2*sigmaColor*sigmaColor), sigmaSpatial, sigmaColor];
}
function identity1(d)
{
    var i, ker = new Array(d);
    for (i=0; i<d; i++) ker[i] = 0;
    ker[d>>>1] = 1;
    return ker;
}
function average1(d)
{
    var i, ker = new Array(d);
    for (i=0; i<d; ++i) ker[i] = 1;
    return ker;
}
function derivative1(d, rev)
{
    var i, half = d>>>1, ker = new Array(d);
    if (rev) for (i=0; i<d; ++i) ker[d-1-i] = i-half;
    else for (i=0; i<d; ++i) ker[i] = i-half;
    return ker;
}

// pascal numbers (binomial coefficients) are used to get coefficients for filters that resemble gaussian distributions
// eg Sobel, Canny, gradients etc..
function binomial1(d)
{
    var l = _pascal.length, row, uprow, i, il;
    --d;
    if (d < l)
    {
        row = _pascal[d];
    }
    else
    {
        // else compute them iteratively
        row = _pascal[l-1];
        while (l<=d)
        {
            uprow=row; row=new Array(uprow.length+1); row[0]=1;
            for (i=0,il=uprow.length-1; i<il; ++i) row[i+1] = uprow[i]+uprow[i+1]; row[uprow.length]=1;
            if (l<20) _pascal.push(row); // save it for future dynamically
            ++l;
        }
    }
    return row.slice();
}
function functional(dx, dy, f)
{
    var x, y, rx = dx>>>1, ry=dy>>>1, l=dx*dy, i,
        kernel = new Array(l), sum;
    for (sum=0,x=-rx,y=-ry,i=0; i<d; ++i,++x)
    {
        if (x > rx) {x=-rx; ++y;}
        kernel[i] = f(x, y, dx, dy);
        //sum += kernel[i];
    }
    //if (sum) for (i=0; i<l; ++i) kernel[i] /= sum;
    return kernel;
}
function binomial2(d)
{
    var binomial = binomial1(d);
    // convolve with itself
    return convolve(binomial, binomial);
}
function vertical2(d)
{
    return convolve(average1(d), identity1(d));
}
function horizontal2(d)
{
    return convolve(identity1(d), average1(d));
}
function sobel(d, dir)
{
    return 1===dir ? /*y*/convolve(derivative1(d,1), binomial1(d)) : /*x*/convolve(binomial1(d), derivative1(d,0));
}
function prewitt(d, dir)
{
    return 1===dir ? /*y*/convolve(derivative1(d,1), average1(d)) : /*x*/convolve(average1(d), derivative1(d,0));
}
function ones(d, f, c)
{
    f = f||1; c = c||f;
    var l = d*d, i, o = new CM(l);
    for (i=0; i<l; ++i) o[i] = f;
    o[l>>>1] = c;
    return o;
}
function twos(d, dx, dy, c)
{
    var l=d*d, half=d>>>1, center=l>>>1, i, k, j, o=new CM(l), tx, ty;
    for (tx=0,i=0; i<=half; ++i,tx+=dx)
    {
        for (k=0,ty=0,j=0; j<=half; ++j,k+=d,ty+=dy)
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
function twos2(d, c, s, cf)
{
    var l=d*d, half=d>>1, center=l>>1, i, j, k,
        o=new CM(l), T=new CM(l),
        tx, ty, dx, dy, f=1/d,
        delta=1e-8;

    if (Abs(c)>delta) {dx=1; dy=s/c;}
    else  {dx=c/s; dy=1;}

    i=0; tx=0; ty=0; k=dy*d;
    while (i<=half)
    {
        // compute the transformation of the (diagonal) line
        T[center + i]= (center + tx + ty + 0.5)|0;
        T[center - i]= (center - tx - ty + 0.5)|0;
        ++i; tx+=dx; ty+=k;
    }
    i=0;
    while (i<=half)
    {
        // do the mapping of the base line to the transformed one
        o[T[center + i]] = o[T[center - i]] = f;
        // anti-aliasing ??..
        ++i;
    }
    o[center] = cf||1;
    return o;
}

}(FILTER);