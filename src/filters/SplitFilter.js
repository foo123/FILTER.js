/**
*
* Split Filter
*
* Splits a filter into multiple copies of streams
*
* @param 
* @package FILTER.js
*
**/
(function(FILTER){
    
    // todo
    FILTER.SplitFilter=function(outputs)
    {
        this.outputs=outputs || 1;
    };

    FILTER.SplitFilter.prototype={
    
        // parameters
        outputs : 1,
        
        // used for internal purposes
        _apply : function(im, w, h) {
            
            return im;
        },
        
        apply : function(image) {
            return image;
            //return image.setData(this._apply(image.getData(), image.width, image.height));
        },
        
        reset : function() {
            this.outputs=1; return this;
        }
    };
    
})(FILTER);