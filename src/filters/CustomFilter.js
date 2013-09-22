/**
*
* Custom Filter(s)
*
* Allows to create an filter on-the-fly using an inline function
*
* @param handler Optional (the filter apply routine)
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
        
        constructor: FILTER.CustomFilter,
        
        _handler : null,
        
        _apply : function(im, w, h, image) {
            if (!this._handler) return im;
            return this._handler.call(this, im, w, h, image);
        },
        
        apply : function(image) {
            if (!this._handler) return image;
            return image.setData(this._handler.call(this, image.getData(), image.width, image.height, image));
        }
    };
    
})(FILTER);