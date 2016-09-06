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
    
    read: function ( path, onComplete, onError ) {
        var self = this;
        if ( FILTER.Browser.isNode )
        {
            if ( 'http://' === path.slice(0,7) || 'https://' === path.slice(0,8) )
            {
                FILTER.Util.XHR.create({
                    url: path,
                    responseType: self._responseType,
                    onComplete: function( xhr ) {
                        if ( 'function' === typeof onComplete ) onComplete( xhr.response );
                    },
                    onError: function( xhr ) {
                        if ( 'function' === typeof onError ) onError( xhr.statusText );
                    }
                }, null);
            }
            else
            {
                // https://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback
                require('fs').readFile('file://' === path.slice(0,7) ? path.slice(7) : path, {
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
                      if ( 'function' === typeof onComplete ) onComplete( data );
                  }
                });
            }
        }
        else
        {
            if ( ("undefined" !== typeof FileReader) &&
                ('.' !== path.slice(0,1)) && ('file://' !== path.slice(0,7)) &&
                ('http://' !== path.slice(0,7)) && ('https://' !== path.slice(0,8)) )
            {
                // handle local file input using html native FileReader API
                // https://developer.mozilla.org/en-US/docs/Web/API/FileReader
                // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsArrayBuffer
                var fileReader = new FileReader( );
                fileReader.addEventListener('load', function( evt ) {
                    if ( (/*DONE*/2 === fileReader.readyState) && ('function' === typeof onComplete) )
                        onComplete( fileReader.result );
                });
                fileReader.addEventListener('error', function( evt ) {
                    if ( 'function' === typeof onError )
                        onError( fileReader.error/*, evt*/ );
                });
                if ( 'arraybuffer' === self._responseType ) fileReader.readAsArrayBuffer( path );
                else fileReader.readAsText( path );
            }
            else
            {
                // handle local/remote file input using XmlHttpRequest
                FILTER.Util.XHR.create({
                    url: path,
                    responseType: self._responseType,
                    onComplete: function( xhr ) {
                        if ( 'function' === typeof onComplete ) onComplete( xhr.response );
                    },
                    onError: function( xhr ) {
                        if ( 'function' === typeof onError ) onError( xhr.statusText );
                    }
                }, null);
            }
        }
        return self;
    },
    
    write: function ( path, data, onComplete, onError ){
        var self = this;
        if ( FILTER.Browser.isNode )
        {
            // https://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback
            require('fs').writeFile('file://' === path.slice(0,7) ? path.slice(7) : path, data, {
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
                  if ( 'function' === typeof onComplete ) onComplete( path );
              }
            });
        }
        else
        {
            // use blobs to write data and return download links
            if ( "undefined" !== typeof Blob )
            {
                // https://developer.mozilla.org/en-US/docs/Web/API/Blob
                // https://developer.mozilla.org/en-US/docs/Web/API/File
                if ( 'function' === typeof onComplete )
                    onComplete(new Blob([ data ], {
                        type : 'arraybuffer' === self._encoding ? 'application/octet-binary' : 'text'
                    }), path);
            }
        }
        return self;
    }
});
FILTER.IO.FileLoader = FILTER.IO.FileReader = FILTER.IO.FileWriter = FileManager;

FILTER.IO.BinaryManager = Class(FileManager, {
    name: "IO.BinaryManager",
    
    constructor: function BinaryManager( codec, opts ) {
        var self = this;
        if ( !(self instanceof BinaryManager) ) return new BinaryManager( codec, opts );
        self._codec = "object" === typeof codec ? codec : null;
        self._opts = opts || null;
        self.$super("constructor");
    },
    
    _codec: null,
    _opts: null,
    
    dispose: function( ) {
        var self = this;
        self._opts = null;
        self._codec = null;
        self.$super("dispose");
        return self;
    },
    
    codec: function( codec ) {
        var self = this;
        if ( arguments.length )
        {
            self._codec = "object" === typeof codec ? codec : null;
            return self;
        }
        else
        {
            return self._codec;
        }
    },
    
    options: function( options ) {
        var self = this;
        if ( arguments.length )
        {
            self._opts = "object" === typeof options ? options : null;
            return self;
        }
        else
        {
            return self._opts;
        }
    },
    
    read: function( path, onComplete, onError ){
        var self = this, image = new FILTER.Image( ), decoder = self._codec ? self._codec.decoder : null;
        if ( 'function' === typeof decoder )
        {
            self.responseType( 'arraybuffer' ).$super( 'read', path, function( buffer ){
                var exc = null, metaData = {}, imData;
                try {
                    imData = decoder( buffer, metaData );
                } catch ( e ) {
                    exc = e;
                    imData = null;
                    //throw e;
                }
                if ( exc || !imData )
                {
                    if ( 'function' === typeof onError ) onError( exc, buffer, image, metaData );
                }
                else
                {
                    image.image( imData );
                    if ( 'function' === typeof onComplete ) onComplete( image, metaData );
                }
            }, onError );
        }
        return image;
    },
    
    write: function( path, image, onComplete, onError ){
        var exc = null, self = this, buffer, encoder = self._codec ? self._codec.encoder : null;
        if ( image && ('function' === typeof encoder) )
        {
            try {
                buffer = encoder( image.getPixelData( ), self._opts||{} );
            } catch ( e ) {
                exc = e;
                buffer = null;
                //throw e;
            }
            if ( exc || !buffer )
            {
                if ( 'function' === typeof onError ) onError( exc, image );
            }
            else
            {
                self.encoding( 'arraybuffer' ).$super( 'write', path, buffer, onComplete, onError );
            }
        }
        return self;
    }
});
FILTER.IO.BinaryLoader = FILTER.IO.BinaryReader = FILTER.IO.BinaryWriter = FILTER.IO.BinaryManager;

}(FILTER);