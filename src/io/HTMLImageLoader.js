/**
*
* Filter (HTML)ImageLoader Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

FILTER.IO.HTMLImageManager = FILTER.Class(FILTER.IO.Manager, {
    name: "IO.HTMLImageManager",
    
    constructor: function HTMLImageLoader() {
        if ( !(this instanceof HTMLImageLoader) )
            return new HTMLImageLoader();
        this.$super('constructor');
    },
    
    read: function( url, onLoad, onError ){
        var scope = this, loader = new Image( ), image = new FILTER.Image( );
        
        loader.onload = function( event ){
            image.image( loader );
            if ( 'function' === typeof onLoad ) onLoad(image, loader);
        };
        loader.onerror = function( event ){
            if ( 'function' === typeof onError ) onError(image, loader);
        };
        loader.crossOrigin = scope._crossOrigin || "";
        loader.src = url;
        
        return image;
    }
});
FILTER.IO.HTMLImageManager.prototype.load = FILTER.IO.HTMLImageManager.prototype.read;
FILTER.IO.HTMLImageLoader = FILTER.IO.HTMLImageManager;

}(FILTER);