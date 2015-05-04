/**
*
* Filter (HTML)ImageLoader Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
@@USE_STRICT@@

var FilterImage = FILTER.Image/*, ON = 'addEventListener'*/;

FILTER.HTMLImageLoader = FILTER.Class(FILTER.Loader, {
    name: "HTMLImageLoader",
    
    constructor: function HTMLImageLoader() {
        if ( !(this instanceof HTMLImageLoader) )
            return new HTMLImageLoader();
        this.$super('constructor');
    },
    
    load: function( url, onLoad, onProgress, onError ){
        var scope = this, loader, 
            image = new FilterImage( )
        ;
        
        loader = new Image( );
        
        loader.onload = function( event ){
            image.setImage( loader );
            if ( 'function' === typeof onLoad ) onLoad(image, loader);
        };
        loader.onerror = function( event ){
            if ( 'function' === typeof onError ) onError(image, loader);
        };
        
        if ( scope._crossOrigin ) loader.crossOrigin = scope._crossOrigin;
        else  loader.crossOrigin = "";
        
        loader.src = url;
        
        return image;
    }
});
}(FILTER);