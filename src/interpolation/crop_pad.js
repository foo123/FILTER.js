/**
*
* Filter Interpolation methods
* @package FILTER.js
*
**/
!function(FILTER, undef){
@@USE_STRICT@@

var clamp = FILTER.Math.clamp, IMG = FILTER.ImArray, A32F = FILTER.Array32F;
FILTER.Interpolation = FILTER.Interpolation || {};

FILTER.Interpolation.pad = function( im, w, h, pad_right, pad_bot, pad_left, pad_top ) {
     pad_right = pad_right || 0; pad_bot = pad_bot || 0;
     pad_left = pad_left || 0; pad_top = pad_top || 0;
     var nw = w+pad_left+pad_right, nh = h+pad_top+pad_bot, 
        paddedSize = (nw*nh)<<2, padded = new IMG(paddedSize), 
        y, yw, w4 = w<<2, nw4 = nw<<2, pixel, pixel2,
        offtop = pad_top*nw4, offleft = pad_left<<2;
        
        for (y=0,yw=0,pixel=offtop; y<h; y++,yw+=w,pixel+=nw4)
        {
            pixel2 = yw<<2;
            padded.set(im.subarray(pixel2,pixel2+w4),offleft+pixel);
        }
     return padded;
};
    
FILTER.Interpolation.crop = function( im, w, h, x1, y1, x2, y2 ) {
     x2 = min(x2,w-1); y2 = min(y2,h-1);
     var nw = x2-x1+1, nh = y2-y1+1, 
        croppedSize = (nw*nh)<<2, cropped = new IMG(croppedSize), 
        y, yw, nw4 = nw<<2, pixel, pixel2;
        
        for (y=y1,yw=y1*w,pixel=0; y<=y2; y++,yw+=w,pixel+=nw4)
        {
            pixel2 = (yw+x1)<<2;
            cropped.set(im.subarray(pixel2,pixel2+nw4),pixel);
        }
     return cropped;
};

}(FILTER);