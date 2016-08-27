/**
*
* Filter File / Binary IO Manager Class(es)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Class = FILTER.Class;

var FileManager = FILTER.IO.FileManager = Class(FILTER.IO.Manager, {
    name: "IO.FileManager",
    
    constructor: function FileManager( ) {
        var self = this;
        if ( !(self instanceof FileManager) ) return new FileManager( );
        self.$super("constructor");
    },
    
    read: function ( file, onLoad, onError ) {
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
            FILTER.Util.XHR.create({
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
    },
    
    write: function ( file, data, onWrite, onError ) {
        var self = this;
        // read file
        if ( FILTER.Browser.isNode )
        {
            // https://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback
            require('fs').writeFile('file://' === file.slice(0,7) ? file.slice(7) : file, data, {
                // return raw buffer
                encoding: 'arraybuffer' === self._encoding ? null : self._encoding,
                flag: 'w'
            }, function( err ) {
              if ( err )
              {
                  if ( 'function' === typeof onError ) onError( err.toString() );
              }
              else
              {
                  if ( 'function' === typeof onWrite ) onWrite( file );
              }
            });
        }
        return self;
    }
});
FileManager.prototype.load = FileManager.prototype.read;
FILTER.IO.FileLoader = FILTER.IO.FileReader = FILTER.IO.FileWriter = FileManager;

FILTER.IO.BinaryManager = Class(FileManager, {
    name: "IO.BinaryManager",
    
    constructor: function BinaryManager( codec ) {
        var self = this;
        if ( !(self instanceof BinaryManager) ) return new BinaryManager( codec );
        self._codec = "function" === typeof codec ? codec : null;
        self.$super("constructor");
    },
    
    _decoder: null,
    _encoder: null,
    _codec: null,
    
    dispose: function( ) {
        var self = this;
        self._decoder = null;
        self._encoder = null;
        self._codec = null;
        self.$super("dispose");
        return self;
    },
    
    encoder: function( encoder ) {
        var self = this;
        self._codec = self._encoder = "function" === typeof encoder ? encoder : null;
        return self;
    },
    
    decoder: function( decoder ) {
        var self = this;
        self._codec = self._decoder = "function" === typeof decoder ? decoder : null;
        return self;
    },
    
    read: function( url, onLoad, onError ){
        var self = this, image = new FILTER.Image( ), decoder = self._decoder || self._codec;
        
        if ( 'function' === typeof decoder )
        {
            self
                .responseType( 'arraybuffer' )
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
    },
    
    write: function( file, image, onWrite, onError ){
        var self = this, encoder = self._encoder || self._codec;
        
        if ( image && ('function' === typeof encoder) )
        {
            self
                .encoding( 'arraybuffer' )
                .$super('write', file, encoder( image.getPixelData( ) ), onWrite, onError )
            ;
        }
        return self;
    }
});
FILTER.IO.BinaryManager.prototype.load = FILTER.IO.BinaryManager.prototype.read;
FILTER.IO.BinaryLoader = FILTER.IO.BinaryReader = FILTER.IO.BinaryWriter = FILTER.IO.BinaryManager;

}(FILTER);