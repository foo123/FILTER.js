/**
*
* Morphological Filter(s)
*
* Applies morphological processing to target image
*
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

// used for internal purposes
var MORPHO, MODE = FILTER.MODE, IMG = FILTER.ImArray, copy = FILTER.Util.Array.copy,
    GLSL = FILTER.Util.GLSL,
    STRUCT = FILTER.Array8U, A32I = FILTER.Array32I,
    Sqrt = Math.sqrt, TypedArray = FILTER.Util.Array.typed,
    primitive_morphology_operator = FILTER.Util.Filter.primitive_morphology_operator,
    // return a box structure element
    box = function(d) {
        var i, size=d*d, ones = new STRUCT(size);
        for (i=0; i<size; ++i) ones[i] = 1;
        return ones;
    },
    box3 = box(3);

//  Morphological Filter
FILTER.Create({
    name: "MorphologicalFilter"

    ,init: function MorphologicalFilter() {
        var self = this;
        self._filterName = null;
        self._filter = null;
        self._dim = 0;
        self._dim2 = 0;
        self._iter = 1;
        self._structureElement = null;
        self._indices = null;
        self._structureElement2 = null;
        self._indices2 = null;
        self.mode = MODE.RGB;
    }

    ,path: FILTER.Path
    ,_filterName: null
    ,_filter: null
    ,_dim: 0
    ,_dim2: 0
    ,_iter: 1
    ,_structureElement: null
    ,_indices: null
    ,_structureElement2: null
    ,_indices2: null
    ,mode: MODE.RGB

    ,dispose: function() {
        var self = this;
        self._filterName = null;
        self._filter = null;
        self._dim = null;
        self._dim2 = null;
        self._iter = null;
        self._structureElement = null;
        self._indices = null;
        self._structureElement2 = null;
        self._indices2 = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             _filterName: self._filterName
            ,_dim: self._dim
            ,_dim2: self._dim2
            ,_iter: self._iter
            ,_structureElement: self._structureElement
            ,_indices: self._indices
            ,_structureElement2: self._structureElement2
            ,_indices2: self._indices2
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self._dim = params._dim;
        self._dim2 = params._dim2;
        self._iter = params._iter;
        self._structureElement = TypedArray(params._structureElement, STRUCT);
        self._indices = TypedArray(params._indices, A32I);
        self._structureElement2 = TypedArray(params._structureElement2, STRUCT);
        self._indices2 = TypedArray(params._indices2, A32I);
        self._filterName = params._filterName;
        if (self._filterName && MORPHO[self._filterName])
            self._filter = MORPHO[self._filterName];
        return self;
    }

    ,erode: function(structureElement, structureElement2, iterations) {
        return this.set("erode", structureElement, structureElement2||null, iterations);
    }

    ,dilate: function(structureElement, structureElement2, iterations) {
        return this.set("dilate", structureElement, structureElement2||null, iterations);
    }

    ,opening: function(structureElement, structureElement2, iterations) {
        return this.set("open", structureElement, structureElement2||null, iterations);
    }

    ,closing: function(structureElement, structureElement2, iterations) {
        return this.set("close", structureElement, structureElement2||null, iterations);
    }

    ,gradient: function(structureElement) {
        return this.set("gradient", structureElement);
    }

    ,laplacian: function(structureElement) {
        return this.set("laplacian", structureElement);
    }

    ,set: function(filtName, structureElement, structureElement2, iterations) {
        var self = this;
        self._dim2 = 0;
        self._structureElement2 = null;
        self._indices2 = null;
        self._iter = (iterations|0) || 1;
        self._filterName = filtName;
        self._filter = MORPHO[filtName];

        if (structureElement && structureElement.length)
        {
            // structure Element given
            self._structureElement = new STRUCT(structureElement);
            self._dim = (Sqrt(self._structureElement.length)+0.5)|0;
        }
        else if (structureElement && (structureElement === +structureElement))
        {
            // dimension given
            self._structureElement = box(structureElement);
            self._dim = structureElement;
        }
        else
        {
            // default
            self._structureElement = box3;
            self._dim = 3;
        }

        if (structureElement2 && structureElement2.length)
        {
            // structure Element given
            self._structureElement2 = new STRUCT(structureElement2);
            self._dim2 = (Sqrt(self._structureElement2.length)+0.5)|0;
        }
        else if (structureElement2 && (structureElement2 === +structureElement2))
        {
            // dimension given
            self._structureElement2 = box(structureElement2);
            self._dim2 = structureElement2;
        }

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        var indices = [], i, x, y, structureElement = self._structureElement,
            matArea = structureElement.length, matRadius = self._dim, matHalfSide = matRadius>>>1;
        for (x=0,y=0,i=0; i<matArea; ++i,++x)
        {
            if (x>=matRadius) {x=0; ++y;}
            // allow a general structuring element instead of just a box
            if (structureElement[i])
            {
                indices.push(x-matHalfSide);
                indices.push(y-matHalfSide);
            }
        }
        self._indices = new A32I(indices);

        if (self._structureElement2)
        {
            var indices = [], i, x, y, structureElement = self._structureElement2,
                matArea = structureElement.length, matRadius = self._dim2, matHalfSide = matRadius>>>1;
            for (x=0,y=0,i=0; i<matArea; ++i,++x)
            {
                if (x>=matRadius) {x=0; ++y;}
                // allow a general structuring element instead of just a box
                if (structureElement[i])
                {
                    indices.push(x-matHalfSide);
                    indices.push(y-matHalfSide);
                }
            }
            self._indices2 = new A32I(indices);
        }
        return self;
    }

    ,reset: function() {
        var self = this;
        self._filterName = null;
        self._filter = null;
        self._dim = 0;
        self._dim2 = 0;
        self._iter = 1;
        self._structureElement = null;
        self._indices = null;
        self._structureElement2 = null;
        self._indices2 = null;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,_apply: function(im, w, h) {
        var self = this;
        if (!self._dim || !self._filter)  return im;
        return self._filter(self, im, w, h);
    }

    ,canRun: function() {
        return this._isOn && this._dim && this._filter;
    }
});

// private methods
function glsl(filter)
{
    return {instance: filter, shader: GLSL.DEFAULT};
}
function morph_prim_op(mode, inp, out, w, h, stride, index, index2, op, op0, iter)
{
    //"use asm";
    var tmp, it, x, ty, i, j, k, imLen = inp.length, imArea = imLen>>>stride,
        rM, gM, bM, r, g, b, xOff, yOff, srcOff, bx=w-1, by=imArea-w, coverArea;

    tmp = inp; inp = out; out = tmp;
    if (FILTER.MODE.GRAY === mode)
    {
        coverArea = index.length;
        for (it=0; it<iter; ++it)
        {
            tmp = inp; inp = out; out = tmp;
            for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the image pixels that
                // fall under the structure matrix
                for (rM=op0,j=0; j<coverArea; j+=2)
                {
                    xOff = x+index[j]; yOff = ty+index[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    r = inp[srcOff];
                    rM = op(r, rM);
                }
                // output
                //rM = (fa*out[i]+fb*rM+fc*inp[i])|0;
                out[i] = rM; out[i+1] = rM; out[i+2] = rM; out[i+3] = inp[i+3];
            }
        }

        if (index2)
        {
            index = index2; coverArea = index.length;
            for (it=0; it<iter; ++it)
            {
                tmp = inp; inp = out; out = tmp;
                for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ty+=w;}

                    // calculate the image pixels that
                    // fall under the structure matrix
                    for (rM=op0,j=0; j<coverArea; j+=2)
                    {
                        xOff = x+index[j]; yOff = ty+index[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2;
                        r = inp[srcOff];
                        rM = op(r, rM);
                    }
                    // output
                    //rM = (fa*out[i]+fb*rM+fc*inp[i])|0;
                    out[i] = rM; out[i+1] = rM; out[i+2] = rM; out[i+3] = inp[i+3];
                }
            }
        }
    }
    else
    {
        coverArea = index.length;
        for (it=0; it<iter; ++it)
        {
            tmp = inp; inp = out; out = tmp;
            for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the image pixels that
                // fall under the structure matrix
                for (rM=gM=bM=op0,j=0; j<coverArea; j+=2)
                {
                    xOff = x+index[j]; yOff = ty+index[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    r = inp[srcOff]; g = inp[srcOff+1]; b = inp[srcOff+2];
                    rM = op(r, rM); gM = op(g, gM); bM = op(b, bM);
                }
                // output
                //rM = (fa*out[i]+fb*rM+fc*inp[i])|0; gM = (fa*out[i+1]+fb*gM+fc*inp[i+1])|0; bM = (fa*out[i+2]+fb*bM+fc*inp[i+2])|0;
                out[i] = rM; out[i+1] = gM; out[i+2] = bM; out[i+3] = inp[i+3];
            }
        }
        if (index2)
        {
            index = index2; coverArea = index.length;
            for (it=0; it<iter; ++it)
            {
                tmp = inp; inp = out; out = tmp;
                for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ty+=w;}

                    // calculate the image pixels that
                    // fall under the structure matrix
                    for (rM=gM=bM=op0,j=0; j<coverArea; j+=2)
                    {
                        xOff = x+index[j]; yOff = ty+index[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2;
                        r = inp[srcOff]; g = inp[srcOff+1]; b = inp[srcOff+2];
                        rM = op(r, rM); gM = op(g, gM); bM = op(b, bM);
                    }
                    // output
                    //rM = (fa*out[i]+fb*rM+fc*inp[i])|0; gM = (fa*out[i+1]+fb*gM+fc*inp[i+1])|0; bM = (fa*out[i+2]+fb*bM+fc*inp[i+2])|0;
                    out[i] = rM; out[i+1] = gM; out[i+2] = bM; out[i+3] = inp[i+3];
                }
            }
        }
    }
}
FILTER.Util.Filter.primitive_morphology_operator = morph_prim_op;
MORPHO = {
    "dilate": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null, dst = new IMG(im.length);

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        indices = self._indices; coverArea = indices.length; index = new A32I(coverArea);
        for (j=0; j<coverArea; j+=2) {index[j]=indices[j]; index[j+1]=indices[j+1]*w;}
        if (self._indices2)
        {
            indices = self._indices2; coverArea = indices.length; index2 = new A32I(coverArea);
            for (j=0; j<coverArea; j+=2) {index2[j]=indices[j]; index2[j+1]=indices[j+1]*w;}
        }

        morph_prim_op(self.mode, im, dst, w, h, 2, index, index2, Math.max, 0, self._iter);

        return dst;
    }
    ,"erode": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null, dst = new IMG(im.length);

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        indices = self._indices; coverArea = indices.length; index = new A32I(coverArea);
        for (j=0; j<coverArea; j+=2) {index[j]=indices[j]; index[j+1]=indices[j+1]*w;}
        if (self._indices2)
        {
            indices = self._indices2; coverArea = indices.length; index2 = new A32I(coverArea);
            for (j=0; j<coverArea; j+=2) {index2[j]=indices[j]; index2[j+1]=indices[j+1]*w;}
        }

        morph_prim_op(self.mode, im, dst, w, h, 2, index, index2, Math.min, 255, self._iter);

        return dst;
    }
    // dilation of erotion
    ,"open": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null, dst = new IMG(im.length);

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        indices = self._indices; coverArea = indices.length; index = new A32I(coverArea);
        for (j=0; j<coverArea; j+=2) {index[j]=indices[j]; index[j+1]=indices[j+1]*w;}
        if (self._indices2)
        {
            indices = self._indices2; coverArea = indices.length; index2 = new A32I(coverArea);
            for (j=0; j<coverArea; j+=2) {index2[j]=indices[j]; index2[j+1]=indices[j+1]*w;}
        }

        // erode
        morph_prim_op(self.mode, im, dst, w, h, 2, index, index2, Math.min, 255, self._iter);
        // dilate
        var tmp = im; im = dst; dst = tmp;
        morph_prim_op(self.mode, im, dst, w, h, 2, index, index2, Math.max, 0, self._iter);

        return dst;
    }
    // erotion of dilation
    ,"close": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null, dst = new IMG(im.length);

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        indices = self._indices; coverArea = indices.length; index = new A32I(coverArea2);
        for (j=0; j<coverArea; j+=2) {index[j]=indices[j]; index[j+1]=indices[j+1]*w;}
        if (self._indices2)
        {
            indices = self._indices2; coverArea = indices.length; index2 = new A32I(coverArea);
            for (j=0; j<coverArea; j+=2) {index2[j]=indices[j]; index2[j+1]=indices[j+1]*w;}
        }

        // dilate
        morph_prim_op(self.mode, im, dst, w, h, 2, index, index2, Math.max, 0, self._iter);
        // erode
        var tmp = im; im = dst; dst = tmp;
        morph_prim_op(self.mode, im, dst, w, h, 2, index, index2, Math.min, 255, self._iter);

        return dst;
    }
    // 1/2 (dilation - erosion)
    ,"gradient": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null,
            imLen = im.length, imcpy, dst = new IMG(imLen);

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        indices = self._indices; coverArea = indices.length; index = new A32I(coverArea);
        for (j=0; j<coverArea; j+=2) {index[j]=indices[j]; index[j+1]=indices[j+1]*w;}
        if (self._indices2)
        {
            indices = self._indices2; coverArea = indices.length; index2 = new A32I(coverArea);
            for (j=0; j<coverArea; j+=2) {index2[j]=indices[j]; index2[j+1]=indices[j+1]*w;}
        }

        // dilate
        imcpy = copy(im);
        morph_prim_op(self.mode, imcpy, dst, w, h, 2, index, index2, Math.max, 0, self._iter);
        // erode
        morph_prim_op(self.mode, im, imcpy, w, h, 2, index, index2, Math.min, 255, self._iter);
        for (j=0; j<imLen; j+=4)
        {
            dst[j  ] = ((dst[j  ]-imcpy[j  ])/2)|0;
            dst[j+1] = ((dst[j+1]-imcpy[j+1])/2)|0;
            dst[j+2] = ((dst[j+2]-imcpy[j+2])/2)|0;
        }
        return dst;
    }
    // 1/2 (dilation + erosion -2IM)
    ,"laplacian": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null,
            imLen = im.length, imcpy, dst = new IMG(imLen), dst2 = new IMG(imLen);

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        indices = self._indices; coverArea = indices.length; index = new A32I(coverArea);
        for (j=0; j<coverArea; j+=2) {index[j]=indices[j]; index[j+1]=indices[j+1]*w;}
        if (self._indices2)
        {
            indices = self._indices2; coverArea = indices.length; index2 = new A32I(coverArea);
            for (j=0; j<coverArea; j+=2) {index2[j]=indices[j]; index2[j+1]=indices[j+1]*w;}
        }

        // dilate
        imcpy = copy(im);
        morph_prim_op(self.mode, imcpy, dst2, w, h, 2, index, index2, Math.max, 0, self._iter);
        // erode
        imcpy = copy(im);
        morph_prim_op(self.mode, imcpy, dst, w, h, 2, index, index2, Math.min, 255, self._iter);
        for (j=0; j<imLen; j+=4)
        {
            dst[j  ] = ((dst[j  ]+dst2[j  ]-2*im[j  ])/2)|0;
            dst[j+1] = ((dst[j+1]+dst2[j+1]-2*im[j+1])/2)|0;
            dst[j+2] = ((dst[j+2]+dst2[j+2]-2*im[j+2])/2)|0;
        }
        return dst;
    }
};

}(FILTER);