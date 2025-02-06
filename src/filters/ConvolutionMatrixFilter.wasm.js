/**
*
* Convolution Matrix Filter WASM
*
**/
!function(FILTER, undef) {
"use strict";

if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(_wasm(), {}, {
    convolutionmatrixfilter: {inputs: [{arg:0,type:FILTER.ImArray},{arg:4,type:FILTER.ConvolutionMatrix},{arg:5,type:FILTER.ConvolutionMatrix},{arg:6,type:FILTER.Array16I},{arg:7,type:FILTER.Array16I}], output: {type:FILTER.ImArray}},
    weighted: {inputs: [{arg:0,type:FILTER.ImArray},{arg:4,type:FILTER.Array32F}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
    FILTER.ConvolutionMatrixFilter.prototype.getWASM = function() {
        return _wasm(this);
    };
    FILTER.ConvolutionMatrixFilter.prototype._apply_wasm = function(im, w, h) {
        var self = this, mode = self.mode;
        if (!self.matrix) return im;
        if (self._w)
        {
            return wasm.weighted(im, w, h, self.dimx, self._w[0], self._w[1]);
        }
        // do a faster convolution routine if possible
        else if (self._doIntegral)
        {
            return self.matrix2 ? FILTER.Util.Filter.wasm.integral_convolution(mode, im, w, h, 2, self.matrix, self.matrix2, self.dimx, self.dimy, self.dimx2, self.dimy2, self._coeff[0], self._coeff[1], self._doIntegral, 1) : FILTER.Util.Filter.wasm.integral_convolution(mode, im, w, h, 2, self.matrix, [], self.dimx, self.dimy, self.dimx, self.dimy, self._coeff[0], self._coeff[1], self._doIntegral, 0);
        }
        else if (self._doSeparable)
        {
            return FILTER.Util.Filter.wasm.separable_convolution(mode, im, w, h, 2, self._mat, self._mat2, self._indices, self._indices2, self._coeff[0], self._coeff[1]);
        }
        return wasm.convolutionmatrixfilter(im, w, h, mode, self._mat, self._mat2 ? self._mat2 : [], self._indices, self._indices2 ? self._indices2 : [], self._coeff[0], self._coeff[1], self._isGrad, self._mat2 ? 1 : 0);
    };
    }
    FILTER.unwaitFor(1);
});
}

//  Private methods
function _wasm()
{
    return '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';
}

}(FILTER);