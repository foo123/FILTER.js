/**
*
* Channel Copy WASM
* @package FILTER.js
*
**/
!function(FILTER) {
"use strict";

if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(_wasm(), {}, {
    channelcopyfilter: {inputs: [{arg:0,type:FILTER.ImArray},{arg:4,type:FILTER.ImArray}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
    FILTER.ChannelCopyFilter.prototype.getWASM = function() {
        return _wasm(this);
    };
    FILTER.ChannelCopyFilter.prototype._apply_wasm = function(im, w, h) {
        var self = this, src;
        src = self.input("source"); if (!src) return im;
        return wasm.channelcopyfilter(im, w, h, self.mode||0, src[0], src[1], src[2], self.centerX||0, self.centerY||0, self.srcChannel||0, self.dstChannel||0, self.color||0);
    };
    }
    FILTER.unwaitFor(1);
});
}
function _wasm()
{
    return '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';
}
}(FILTER);