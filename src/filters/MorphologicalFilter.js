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
        self._glsl = null;
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
        self._glsl = null;
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
    return out;
}
FILTER.Util.Filter.primitive_morphology_operator = morph_prim_op;
MORPHO = {
    "dilate": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null, dst = new IMG(im.length),
            morph = (self._runWASM ? morph_prim_op.wasm : morph_prim_op) || morph_prim_op;

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

        dst = morph(self.mode, im, dst, w, h, 2, index, index2, Math.max, 0, self._iter);

        return dst;
    }
    ,"erode": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null, dst = new IMG(im.length),
            morph = (self._runWASM ? morph_prim_op.wasm : morph_prim_op) || morph_prim_op;

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

        dst = morph(self.mode, im, dst, w, h, 2, index, index2, Math.min, 255, self._iter);

        return dst;
    }
    // dilation of erotion
    ,"open": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null, dst = new IMG(im.length),
            morph = (self._runWASM ? morph_prim_op.wasm : morph_prim_op) || morph_prim_op;

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
        dst = morph(self.mode, im, dst, w, h, 2, index, index2, Math.min, 255, self._iter);
        // dilate
        var tmp = im; im = dst; dst = tmp;
        dst = morph(self.mode, im, dst, w, h, 2, index, index2, Math.max, 0, self._iter);

        return dst;
    }
    // erotion of dilation
    ,"close": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null, dst = new IMG(im.length),
            morph = (self._runWASM ? morph_prim_op.wasm : morph_prim_op) || morph_prim_op;

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
        dst = morph(self.mode, im, dst, w, h, 2, index, index2, Math.max, 0, self._iter);
        // erode
        var tmp = im; im = dst; dst = tmp;
        dst = morph(self.mode, im, dst, w, h, 2, index, index2, Math.min, 255, self._iter);

        return dst;
    }
    // 1/2 (dilation - erosion)
    ,"gradient": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null,
            imLen = im.length, imcpy, dst = new IMG(imLen),
            morph = (self._runWASM ? morph_prim_op.wasm : morph_prim_op) || morph_prim_op;

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
        dst = morph(self.mode, imcpy, dst, w, h, 2, index, index2, Math.max, 0, self._iter);
        // erode
        imcpy = morph(self.mode, im, imcpy, w, h, 2, index, index2, Math.min, 255, self._iter);
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
            imLen = im.length, imcpy, dst = new IMG(imLen), dst2 = new IMG(imLen),
            morph = (self._runWASM ? morph_prim_op.wasm : morph_prim_op) || morph_prim_op;

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
        dst2 = morph(self.mode, imcpy, dst2, w, h, 2, index, index2, Math.max, 0, self._iter);
        // erode
        imcpy = copy(im);
        dst = morph(self.mode, imcpy, dst, w, h, 2, index, index2, Math.min, 255, self._iter);
        for (j=0; j<imLen; j+=4)
        {
            dst[j  ] = ((dst[j  ]+dst2[j  ]-2*im[j  ])/2)|0;
            dst[j+1] = ((dst[j+1]+dst2[j+1]-2*im[j+1])/2)|0;
            dst[j+2] = ((dst[j+2]+dst2[j+2]-2*im[j+2])/2)|0;
        }
        return dst;
    }
};
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    primitive_morphology_operator: {inputs: [{arg:1,type:FILTER.ImArray},{arg:2,type:FILTER.ImArray},{arg:6,type:FILTER.Array32I},{arg:7,type:FILTER.Array32I}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
    morph_prim_op.wasm = function(mode, inp, out, w, h, stride, index, index2, op, op0, iter) {
        return wasm.primitive_morphology_operator(mode, inp, out, w, h, stride, index, index2 || [], Math.min === op ? -1 : 1, Math.min === op ? 255 : 0, iter||1);
    };
    }
    FILTER.unwaitFor(1);
});
}
function glsl(filter)
{
    var matrix_code = function(m, d, op, op0, img) {
        var code = [], ca = 'c0',
            x, y, k, i, j,
            matArea = m.length, matRadius = d,
            matHalfSide = matRadius>>>1;
        code.push('int apply=1;');
        code.push('vec4 res=vec4('+op0+');');
        code.push('float alpha=1.0;');
        x=0; y=0; k=0;
        img = img || 'img';
        while (k<matArea)
        {
            i = x-matHalfSide;
            j = y-matHalfSide;
            if (m[k] || (0===i && 0===j))
            {
                code.push('if (1==apply){vec2 p'+k+'=vec2(pix.x'+toFloat(i, 1)+'*dp.x, pix.y'+toFloat(j, 1)+'*dp.y); vec4 c'+k+'=vec4(0.0); if (0.0 <= p'+k+'.x && 1.0 >= p'+k+'.x && 0.0 <= p'+k+'.y && 1.0 >= p'+k+'.y) {c'+k+'=texture2D('+img+',p'+k+');} else {apply=0;} res='+op+'(res, c'+k+');'+(0===i && 0===j?(' alpha=c'+k+'.a;'):'')+'}');
            }
            ++k; ++x; if (x>=matRadius) {x=0; ++y;}
        }
        code.push('if (1==apply) gl_FragColor = vec4(res.rgb,alpha); else gl_FragColor = texture2D('+img+',pix);');
        return code.join('\n');
    };
    var morph = function(m, op, img) {
        return glslcode.shader([
        'varying vec2 pix;',
        'uniform sampler2D '+(img||'img')+';',
        'uniform vec2 dp;',
        'void main(void) {',
        'dilate' === op ? matrix_code(m, filter._dim, 'max', '0.0', img) : matrix_code(m, filter._dim, 'min', '1.0', img),
        '}'
        ].join('\n'), filter._iter || 1);
    };
    var toFloat = GLSL.formatFloat, glslcode = new GLSL.Filter(filter);
    if (!filter._dim) return glslcode.begin().shader(GLSL.DEFAULT).end().code();
    switch (filter._filterName)
    {
        case 'dilate':
        glslcode.begin();
        morph(filter._structureElement, 'dilate');
        glslcode.end();
        break;
        case 'erode':
        glslcode.begin();
        morph(filter._structureElement, 'erode')
        glslcode.end();
        break;
        case 'open':
        glslcode.begin();
        morph(filter._structureElement, 'erode')
        glslcode.end();
        glslcode.begin();
        morph(filter._structureElement, 'dilate');
        glslcode.end();
        break;
        case 'close':
        glslcode.begin();
        morph(filter._structureElement, 'dilate');
        glslcode.end();
        glslcode.begin();
        morph(filter._structureElement, 'erode')
        glslcode.end();
        break;
        case 'gradient':
        glslcode.begin();
        morph(filter._structureElement, 'dilate');
        glslcode.save('original');
        glslcode.output('dilated');
        glslcode.end();
        glslcode.begin();
        morph(filter._structureElement, 'erode');
        glslcode.input('original', null, true);
        //glslcode.output('eroded');
        glslcode.end();
        glslcode.begin();
        glslcode.shader([
        'varying vec2 pix;',
        'uniform sampler2D dilated;',
        'uniform sampler2D img;',
        'void main(void) {',
        'vec4 dilate = texture2D(dilated, pix);',
        'vec4 erode = texture2D(img, pix);',
        'gl_FragColor = vec4(((dilate-erode)*0.5).rgb, erode.a);',
        '}'
        ].join('\n'));
        glslcode.input('dilated');
        //glslcode.input('eroded');
        glslcode.end();
        break;
        case 'laplacian':
        glslcode.begin();
        morph(filter._structureElement, 'dilate');
        glslcode.save('original');
        glslcode.output('dilated');
        glslcode.end();
        glslcode.begin();
        morph(filter._structureElement, 'erode');
        glslcode.input('original', null, true);
        //glslcode.output('eroded');
        glslcode.end();
        glslcode.begin();
        glslcode.shader([
        'varying vec2 pix;',
        'uniform sampler2D original;',
        'uniform sampler2D dilated;',
        'uniform sampler2D img;',
        'void main(void) {',
        'vec4 original = texture2D(original, pix);',
        'vec4 dilate = texture2D(dilated, pix);',
        'vec4 erode = texture2D(img, pix);',
        'gl_FragColor = vec4(((dilate+erode-2.0*original)*0.5).rgb, original.a);',
        '}'
        ].join('\n'));
        glslcode.input('original');
        glslcode.input('dilated');
        //glslcode.input('original', null, true);
        glslcode.end();
        break;
        default:
        glslcode.begin().end();
        break;
    }
    return glslcode.code();
}
function wasm()
{
    return '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';
}

}(FILTER);