/**
*
* Statistical Filter(s)
*
* Applies statistical filtering/processing to target image
*
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

// used for internal purposes
var STAT, MODE = FILTER.MODE,IMG = FILTER.ImArray,
    A32I = FILTER.Array32I, A32U = FILTER.Array32U,
    GLSL = FILTER.Util.GLSL,
    TypedArray = FILTER.Util.Array.typed, Min = Math.min, Max = Math.max;

//  Statistical Filter
var StatisticalFilter = FILTER.Create({
    name: "StatisticalFilter"

    ,init: function StatisticalFilter() {
        var self = this;
        self.d = 0;
        self.k = 0;
        self._gray = false;
        self._filter = null;
        self._indices = null;
        self.mode = MODE.RGB;
    }

    ,path: FILTER.Path
    ,d: 0
    ,k: 0
    ,_filter: null
    ,_indices: null
    ,mode: MODE.RGB

    ,dispose: function() {
        var self = this;
        self.d = null;
        self.k = null;
        self._filter = null;
        self._indices = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             d: self.d
            ,k: self.k
            ,_filter: self._filter
            ,_indices: self._indices
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.d = params.d;
        self.k = params.k;
        self._filter = params._filter;
        self._indices = TypedArray(params._indices, A32I);
        return self;
    }

    ,kth: function(k, d) {
        return this.set(null == d ? 3 : (d&1 ? d : d+1), k);
    }

    ,median: function(d) {
        // allow only odd dimensions for median
        return this.set(null == d ? 3 : (d&1 ? d : d+1), 0.5);
    }

    ,minimum: function(d) {
        return this.set(null == d ? 3 : (d&1 ? d : d+1), 0);
    }
    ,erode: null

    ,maximum: function(d) {
        return this.set(null == d ? 3 : (d&1 ? d : d+1), 1);
    }
    ,dilate: null

    ,set: function(d, k) {
        var self = this;
        self.d = d = d||0;
        self.k = k = Min(1, Max(0, k||0));
        self._filter = 0 === k ? "0th" : (1 === k ? "1th" : "kth");
        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        var i, x, y, matArea2 = (d*d)<<1, dHalf = d>>>1, indices = new A32I(matArea2);
        for (x=0,y=0,i=0; i<matArea2; i+=2,++x)
        {
            if (x>=d) {x=0; ++y;}
            indices[i  ] = x-dHalf; indices[i+1] = y-dHalf;
        }
        self._indices = indices;
        self._glsl = null;
        return self;
    }

    ,reset: function() {
        var self = this;
        self.d = 0;
        self.k = 0;
        self._filter = null;
        self._indices = null;
        self._glsl = null;
        return self;
    }

    ,_getGLSL: function() {
        return glsl(this);
    }

    // used for internal purposes
    ,_apply: function(im, w, h) {
        var self = this;
        if (!self.d)  return im;
        if ('0th' === self._filter || '1th' === self._filter) return STAT["01th"](self, im, w, h);
        return STAT[self._filter](self, im, w, h);
    }

    ,canRun: function() {
        return this._isOn && this.d;
    }
});
// aliiases
StatisticalFilter.prototype.erode = StatisticalFilter.prototype.minimum;
StatisticalFilter.prototype.dilate = StatisticalFilter.prototype.maximum;

// private methods
function glsl(filter)
{
    return {instance: filter, shader: GLSL.DEFAULT};
}
STAT = {
     "01th": function(self, im, w, h) {
        //"use asm";
        var matRadius = self.d, matHalfSide = matRadius>>1,
            imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM, bx = w-1, by = imArea-w,
            indices = self._indices, matArea2 = indices.length,
            matArea = matArea2>>>1, imIndex = new A32I(matArea2),
            op, op0 ;

        if ('0th' === self._filter)
        {
            op = Min;
            op0 = 255;
        }
        else
        {
            op = Max;
            op0 = 0;
        }
        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        for (j=0; j<matArea2; j+=2) {imIndex[j]=indices[j]; imIndex[j+1]=indices[j+1]*w;}
        if (MODE.GRAY === self.mode)
        {
            for (i=0,x=0,ty=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ty+=w;}
                for (gM=op0,j=0; j<matArea2; j+=2)
                {
                    xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    gM = op(im[srcOff], gM);
                }
                // output
                dst[i] = gM; dst[i+1] = gM; dst[i+2] = gM; dst[i+3] = im[i+3];
            }
        }
        else
        {
            for (i=0,x=0,ty=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ty+=w;}
                for (rM=gM=bM=op0,j=0; j<matArea2; j+=2)
                {
                    xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    r = im[srcOff]; g = im[srcOff+1]; b = im[srcOff+2];
                    rM = op(r, rM); gM = op(g, gM); bM = op(b, bM);
                }
                // output
                dst[i] = rM; dst[i+1] = gM; dst[i+2] = bM; dst[i+3] = im[i+3];
            }
        }
        return dst;
    }
    ,"kth": function(self, im, w, h) {
        //"use asm";
        var matRadius = self.d, kth = self.k,
            matHalfSide = matRadius>>1,
            imLen = im.length, imArea = imLen>>>2,
            dst = new IMG(imLen),
            i, j, x, ty, xOff, yOff,
            srcOff, bx = w-1, by = imArea-w,
            r, g, b, kthR, kthG, kthB,
            rh, gh, bh, rhc, ghc, bhc,
            rhist, ghist, bhist, tot, sum,
            indices = self._indices, matArea2 = indices.length,
            matArea = matArea2>>>1, imIndex = new A32I(matArea2);

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        for (j=0; j<matArea2; j+=2) {imIndex[j]=indices[j]; imIndex[j+1]=indices[j+1]*w;}

        if (MODE.GRAY === self.mode)
        {
            gh = new IMG(matArea);
            ghist = new A32U(256);
            for (i=0,x=0,ty=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ty+=w;}

                tot=0;
                ghc=0;
                for (j=0; j<matArea2; j+=2)
                {
                    xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    g = im[srcOff];
                    // compute histogram, similar to counting sort
                    ++tot; ++ghist[g];
                    // maintain min-heap
                    if (1 === ghist[g]) heap_push(gh, ghc++, g);
                }

                // search histogram for kth statistic
                // and also reset histogram for next round
                // can it be made faster?? (used min-heap)
                tot *= kth;
                for (sum=0,kthG=-1,j=ghc; j>0; --j)
                {
                    g = heap_pop(gh, j); sum += ghist[g]; ghist[g] = 0;
                    if (0 > kthG && sum >= tot) kthG = g;
                }

                // output
                dst[i] = kthG; dst[i+1] = kthG; dst[i+2] = kthG; dst[i+3] = im[i+3];
            }
        }
        else
        {
            rh = new IMG(matArea);
            gh = new IMG(matArea);
            bh = new IMG(matArea);
            rhist = new A32U(256);
            ghist = new A32U(256);
            bhist = new A32U(256);
            for (i=0,x=0,ty=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ty+=w;}

                tot=0;
                rhc=ghc=bhc=0;
                for (j=0; j<matArea2; j+=2)
                {
                    xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    r = im[srcOff]; g = im[srcOff+1]; b = im[srcOff+2];
                    // compute histogram, similar to counting sort
                    ++rhist[r]; ++ghist[g]; ++bhist[b]; ++tot;
                    // maintain min-heap
                    if (1 === rhist[r]) heap_push(rh, rhc++, r);
                    if (1 === ghist[g]) heap_push(gh, ghc++, g);
                    if (1 === bhist[b]) heap_push(bh, bhc++, b);
                }

                // search histogram for kth statistic
                // and also reset histogram for next round
                // can it be made faster?? (used min-heap)
                tot *= kth;
                for (sum=0,kthR=-1,j=rhc; j>0; --j)
                {
                    r = heap_pop(rh, j); sum += rhist[r]; rhist[r] = 0;
                    if (0 > kthR && sum >= tot) kthR = r;
                }
                for (sum=0,kthG=-1,j=ghc; j>0; --j)
                {
                    g = heap_pop(gh, j); sum += ghist[g]; ghist[g] = 0;
                    if (0 > kthG && sum >= tot) kthG = g;
                }
                for (sum=0,kthB=-1,j=bhc; j>0; --j)
                {
                    b = heap_pop(bh, j); sum += bhist[b]; bhist[b] = 0;
                    if (0 > kthB && sum >= tot) kthB = b;
                }

                // output
                dst[i] = kthR; dst[i+1] = kthG; dst[i+2] = kthB; dst[i+3] = im[i+3];
            }
        }
        return dst;
    }
};
function heap_push(heap, items, item)
{
    // Push item onto heap, maintaining the heap invariant.
    heap[items] = item;
    _siftdown(heap, 0, items);
}
function heap_pop(heap, items)
{
    // Pop the smallest item off the heap, maintaining the heap invariant.
    var lastelt = heap[items-1], returnitem;
    if (items-1)
    {
        returnitem = heap[0];
        heap[0] = lastelt;
        _siftup(heap, 0, items-1);
        return returnitem;
    }
    return lastelt;
}
function _siftdown(heap, startpos, pos)
{
    var newitem = heap[pos], parentpos, parent;
    while (pos > startpos)
    {
        parentpos = (pos - 1) >>> 1;
        parent = heap[parentpos];
        if (newitem < parent)
        {
            heap[pos] = parent;
            pos = parentpos;
            continue;
        }
        break;
    }
    heap[pos] = newitem;
}
function _siftup(heap, pos, numitems)
{
    var endpos = numitems, startpos = pos, newitem = heap[pos], childpos, rightpos;
    childpos = 2*pos + 1;
    while (childpos < endpos)
    {
        rightpos = childpos + 1;
        if (rightpos < endpos && heap[childpos] >= heap[rightpos])
            childpos = rightpos;
        heap[pos] = heap[childpos];
        pos = childpos;
        childpos = 2*pos + 1;
    }
    heap[pos] = newitem;
    _siftdown(heap, startpos, pos);
}

}(FILTER);