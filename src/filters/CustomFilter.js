/**
*
* Custom Filter(s)
*
* @package FILTER.js
*
**/
(function(FILTER){
    
    //
    //
    //  Custom Filter 
    //  used as a placeholder for constructing filters inline with an anonymous function
    FILTER.CustomFilter=function(handler)
    {
        this._handler=handler;
    };
    
    FILTER.CustomFilter.prototype={
        
        _handler : null,
        
        _apply : function(im, w, h) {
            if (!this._handler) return im;
            return this._handler.call(this,im,w,h);
        },
        
        apply : function(image) {
            if (!this._handler) return image;
            return image.setData(this._handler.call(this, image.getData(), image.width, image.height));
        }
    };
    
})(FILTER);