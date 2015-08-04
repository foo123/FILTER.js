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
        var self = this;
        if ( !(self instanceof Loader) )
            return new Loader( );
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
        var self = this;
        if ( arguments.length )
        {
            self._responseType = value;
            return self;
        }
        return self._responseType;
    },

    crossOrigin: function ( value ) {
        var self = this;
        if ( arguments.length )
        {
            self._crossOrigin = value;
            return self;
        }
        return self._crossOrigin;
    }
});

var XHRLoader = FILTER.XHRLoader = Class(Loader, {
    name: "XHRLoader",
    
    constructor: function XHRLoader( ) {
        var self = this;
        if ( !(self instanceof XHRLoader) )
            return new XHRLoader( );
    },
    
    load: function ( url, onLoad, onError ) {
        var scope = this, request;
        
        if ( FILTER.Browser.isNode )
        {
            // https://nodejs.org/api/http.html#http_http_request_options_callback
            request = require('http').get(url, function(response) {
                var data = '';
                //response.setEncoding('utf8');
                response.on('data', function( chunk ) {
                    data += chunk;
                });
                response.on('end', function( ) {
                    if ( 'function' === typeof onLoad ) onLoad( new Buffer(data) );
                });
            }).on('error', function( e ) {
                if ( 'function' === typeof onError ) onError( e );
            });
        }
        else
        {
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
            request = new XMLHttpRequest( );
            request.open( 'GET', url, true );
            request[ON]('load', function ( event ) {
                if ( 'function' === typeof onLoad ) onLoad( this.response );
            }, false);
            //if ( 'function' === typeof onProgress ) request[ON]('progress', onProgress, false);
            if ( 'function' === typeof onError ) request[ON]('error', onError, false);
            if ( scope._crossOrigin ) request.crossOrigin = scope._crossOrigin;
            if ( scope._responseType ) request.responseType = scope._responseType;
            request.send( null );
        }
        return scope;
    }
});

var FileLoader = FILTER.FileLoader = Class(Loader, {
    name: "FileLoader",
    
    constructor: function FileLoader( ) {
        var self = this;
        if ( !(self instanceof FileLoader) )
            return new FileLoader( );
    },
    
    load: function ( file, onLoad, onError ) {
        var scope = this, 
            options = {
                // return raw buffer
                encoding: 'arraybuffer' === scope._responseType ? null : scope._responseType,
                flag: 'r'
            };
        // read file
        // https://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback
        require('fs').readFile(file, options, function( err, data ) {
          if ( err )
          {
              if ( 'function' === typeof onError ) onError( err );
          }
          else
          {
              if ( 'function' === typeof onLoad ) onLoad( data );
          }
        });        
        return scope;
    }
});

FILTER.BinaryLoader = Class(Loader, {
    name: "BinaryLoader",
    
    constructor: function BinaryLoader( decoder ) {
        var self = this;
        if ( !(self instanceof BinaryLoader) ) return new BinaryLoader( decoder );
        self._decoder = "function" === typeof (decoder) ? decoder : null;
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
    
    decoder: function( decoder ) {
        var self = this;
        self._decoder = "function" === typeof (decoder) ? decoder : null;
        return self;
    },
    
    encoder: function( encoder ) {
        var self = this;
        self._encoder = "function" === typeof (encoder) ? encoder : null;
        return self;
    },
    
    load: function( url, onLoad, onError ){
        var loader = this, xhrloader, 
            image = new FilterImage( ),
            decoder = loader._decoder
        ;
        
        if ( 'function' === typeof decoder )
        {
            xhrloader = FILTER.Browser.isNode ? new FileLoader( ) : new XHRLoader( );
            xhrloader
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