/**
*
* Geometric Map Filter
*
* Displaces/Distorts the target image according to a geometric mapping function
*
* @param geoMap
* @package FILTER.js
*
**/
(function(FILTER){
    
    var 
        Min=Math.min, Max=Math.max
    ;
    
    FILTER.GeometricMapFilter=function(map)
    {
        this.map=map;
    };

    FILTER.GeometricMapFilter.prototype={
    
        // parameters
        map : null,
        
        // used for internal purposes
        _apply : function(im, w, h) {
            
            if (!this.map) return im;
        },
        
        apply : function(image) {
            if (!this.map) return image;
            return image.setData(this._apply(image.getData(), image.width, image.height));
        },
        
        reset : function() {
            this.map=null; return this;
        }
    };
    
})(FILTER);