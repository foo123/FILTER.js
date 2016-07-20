/**
*
* Filter BinaryWriter Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Class = FILTER.Class;

var FileWriter = FILTER.FileWriter = Class(FILTER.Writer, {
    name: "FileWriter",
    
    constructor: function FileWriter( ) {
        var self = this;
        if ( !(self instanceof FileWriter) ) return new FileWriter( );
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

FILTER.BinaryWriter = Class(FileWriter, {
    name: "BinaryWriter",
    
    constructor: function BinaryWriter( encoder ) {
        var self = this;
        if ( !(self instanceof BinaryWriter) ) return new BinaryWriter( encoder );
        self._encoder = "function" === typeof encoder ? encoder : null;
    },
    
    _encoder: null,
    
    dispose: function( ) {
        var self = this;
        self._encoder = null;
        self.$super("dispose");
        return self;
    },
    
    encoder: function( encoder ) {
        var self = this;
        self._encoder = "function" === typeof encoder ? encoder : null;
        return self;
    },
    
    write: function( file, image, onWrite, onError ){
        var self = this, encoder = self._encoder;
        
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
  
}(FILTER);