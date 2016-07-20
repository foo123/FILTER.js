/**
*
* Filter BinaryLoader Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Loader = FILTER.Loader, XHR = FILTER.Util.XHR, FilterImage = FILTER.Image, Class = FILTER.Class;

var FileLoader = FILTER.FileLoader = FILTER.FileReader = Class(Loader, {
    name: "FileLoader",
    
    constructor: function FileLoader( ) {
        var self = this;
        if ( !(self instanceof FileLoader) ) return new FileLoader( );
    },
    
    load: function ( file, onLoad, onError ) {
        var self = this;
        // read file
        if ( FILTER.Browser.isNode )
        {
            // https://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback
            require('fs').readFile('file://' === file.slice(0,7) ? file.slice(7) : file, {
                // return raw buffer
                encoding: 'arraybuffer' === self._responseType ? null : self._responseType,
                flag: 'r'
            }, function( err, data ) {
              if ( err )
              {
                  if ( 'function' === typeof onError ) onError( err.toString() );
              }
              else
              {
                  if ( 'function' === typeof onLoad ) onLoad( data );
              }
            });
        }
        else
        {
            XHR.create({
                url: file,
                responseType: self._responseType,
                onComplete: function( xhr ) {
                    if ( 'function' === typeof onLoad ) onLoad( xhr.response );
                },
                onError: function( xhr ) {
                    if ( 'function' === typeof onError ) onError( xhr.statusText );
                }
            }, null);
        }
        return self;
    }
});

FILTER.BinaryLoader = FILTER.BinaryReader = Class(FileLoader, {
    name: "BinaryLoader",
    
    constructor: function BinaryLoader( decoder ) {
        var self = this;
        if ( !(self instanceof BinaryLoader) ) return new BinaryLoader( decoder );
        self._decoder = "function" === typeof decoder ? decoder : null;
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
        self._decoder = "function" === typeof decoder ? decoder : null;
        return self;
    },
    
    encoder: function( encoder ) {
        var self = this;
        self._encoder = "function" === typeof encoder ? encoder : null;
        return self;
    },
    
    load: function( url, onLoad, onError ){
        var self = this, image = new FilterImage( ), decoder = self._decoder;
        
        if ( 'function' === typeof decoder )
        {
            self
                .responseType( self._responseType || 'arraybuffer' )
                .$super('load', url, function( buffer ) {
                    var metaData = {}, imData = decoder( buffer, metaData );
                    if ( !imData )
                    {
                        if ( 'function' === typeof onError ) onError( image, metaData, buffer );
                        return;
                    }
                    image.image( imData );
                    if ( 'function' === typeof onLoad ) onLoad( image, metaData );
                }, onError )
            ;
        }
        return image;
    }

});
  
}(FILTER);