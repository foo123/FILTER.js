/**
*
* Filter Loader Class(es)
* @package FILTER.js
*
**/
!function(FILTER, undef){
@@USE_STRICT@@

var FilterImage = FILTER.Image, Class = FILTER.Class, ON = 'addEventListener';

var Loader = FILTER.Loader = Class({
    name: "Loader",
    
    __static__: {
        // accessible as "$class.load" (extendable and with "late static binding")
        load: FILTER.Method(function($super, $private, $class){
              // $super is the direct reference to the superclass itself (NOT the prototype)
              // $private is the direct reference to the private methods of this class (if any)
              // $class is the direct reference to this class itself (NOT the prototype)
              return function( url, onLoad, onError ) {
                return new $class().load(url, onLoad, onError);
            }
        }, FILTER.LATE|FILTER.STATIC )
    },
    
    constructor: function Loader() {
        if ( !(this instanceof Loader) )
            return new Loader();
    },
    
    _crossOrigin: null,
    _responseType: null,
    
    dispose: function( ) {
        var self = this;
        self._crossOrigin = null;
        self._responseType = null;
        return self;
    },
    
    // override in sub-classes
    load: function( url, onLoad, onError ){
        return null;
    },

    responseType: function ( value ) {
        if ( arguments.length )
        {
            this._responseType = value;
            return this;
        }
        return this._responseType;
    },

    crossOrigin: function ( value ) {
        if ( arguments.length )
        {
            this._crossOrigin = value;
            return this;
        }
        return this._crossOrigin;
    }
});

var XHRLoader = FILTER.XHRLoader = Class(Loader, {
    name: "XHRLoader",
    
    constructor: function XHRLoader() {
        if ( !(this instanceof XHRLoader) )
            return new XHRLoader();
    },
    
    load: function ( url, onLoad, onError ) {
        var scope = this, request = new XMLHttpRequest( );
        request.open( 'GET', url, true );
        request[ON]('load', function ( event ) {
            if ( onLoad ) onLoad( this.response );
        }, false);
        //if ( 'function' === typeof onProgress ) request[ON]('progress', onProgress, false);
        if ( 'function' === typeof onError ) request[ON]('error', onError, false);
        if ( scope._crossOrigin ) request.crossOrigin = scope._crossOrigin;
        if ( scope._responseType ) request.responseType = scope._responseType;
        request.send( null );
        return scope;
    }
});

FILTER.BinaryLoader = Class(Loader, {
    name: "BinaryLoader",
    
    constructor: function BinaryLoader( decoder/*, encoder*/ ) {
        var self = this;
        if ( !(self instanceof BinaryLoader) ) return new BinaryLoader( decoder/*, encoder*/ );
        self._decoder = "function" === typeof (decoder) ? decoder : null;
        //self._encoder = "function" === typeof (encoder) ? encoder : null;
    },
    
    _decoder: null,
    _encoder: null,
    
    dispose: function( ) {
        var self = this;
        self._decoder = null;
        self._encoder = null;
        self.$super("dispose");
        return self;
    },
    
    codec: function( decoder/*, encoder*/ ) {
        var self = this;
        self._decoder = "function" === typeof (decoder) ? decoder : null;
        //self._encoder = "function" === typeof (encoder) ? encoder : null;
        return self;
    },
    
    load: function( url, onLoad, onError ){
        var loader = this, xhrloader, 
            image = new FilterImage( ),
            decoder = loader._decoder
        ;
        
        if ( 'function' === typeof decoder )
        {
            xhrloader = new XHRLoader( )
                .responseType( loader._responseType || 'arraybuffer' )
                .load( url, function( buffer ) {
                    var metaData = {}, imData = decoder( buffer, metaData );
                    if ( !imData ) return;
                    image.image( imData );
                    if ( 'function' === typeof onLoad ) onLoad( image, metaData );
                }, onError )
            ;
        }
        return image;
    }

});    
}(FILTER);