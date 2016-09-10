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
    
    constructor: function HTMLImageManager( ){
        if ( !(this instanceof HTMLImageManager) ) return new HTMLImageManager();
        this.$super('constructor');
    },
    
    read: function( url, onComplete, onError, image ){
        var scope = this, loader = new Image( );
        
        if ( onComplete instanceof FILTER.Image )
        {
            image = onComplete;
            onComplete = onError;
        }
        else
        {
            image = image || new FILTER.Image( );
        }
        
        loader.onload = function( event ){
            image.image( loader );
            if ( 'function' === typeof onComplete ) onComplete(image, loader);
        };
        loader.onerror = function( event ){
            if ( 'function' === typeof onError ) onError(event, image, loader);
        };
        loader.crossOrigin = scope._crossOrigin || "";
        loader.src = url;
        
        return image;
    }
});
FILTER.IO.HTMLImageLoader = FILTER.IO.HTMLImageManager;

}(FILTER);