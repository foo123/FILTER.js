/**
*
*   FILTER.js I/O Classes
*   @version: 0.9.6
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (I/O Loaders)
*   https://github.com/foo123/FILTER.js
*
**/!function( root, factory ){
"use strict";
if ( ('object'===typeof module) && module.exports ) /* CommonJS */
    module.exports = factory.call(root,(module.$deps && module.$deps["FILTER"]) || require("./FILTER".toLowerCase()));
else if ( ("function"===typeof define) && define.amd && ("function"===typeof require) && ("function"===typeof require.specified) && require.specified("FILTER_IO") /*&& !require.defined("FILTER_IO")*/ ) 
    define("FILTER_IO",['module',"FILTER"],function(mod,module){factory.moduleUri = mod.uri; factory.call(root,module); return module;});
else /* Browser/WebWorker/.. */
    (factory.call(root,root["FILTER"])||1)&&('function'===typeof define)&&define.amd&&define(function(){return root["FILTER"];} );
}(  /* current root */          this, 
    /* module factory */        function ModuleFactory__FILTER_IO( FILTER ){
/* main code starts here */

/**
*
*   FILTER.js I/O Classes
*   @version: 0.9.6
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (I/O Loaders)
*   https://github.com/foo123/FILTER.js
*
**/
"use strict";
var FILTER_IO_PATH = FILTER.getPath( ModuleFactory__FILTER_IO.moduleUri );
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
    
    read: function( url, onComplete, onError ){
        var scope = this, loader = new Image( ), image = new FILTER.Image( );
        
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

}(FILTER);/**
*
* Filter Utils, cross-platform XmlHttpRequest (XHR)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

if ( FILTER.Util.LOADED_XHR ) return;
FILTER.Util.LOADED_XHR = true;

var HAS = 'hasOwnProperty', toString = Object.prototype.toString,
    KEYS = Object.keys, CRLF = "\r\n", trim = FILTER.Util.String.trim,
    isNode = FILTER.Browser.isNode;

// adapted from https://github.com/foo123/RT
function header_encode( headers, xmlHttpRequest, httpRequestResponse )
{
    var header = '';
    if ( !headers ) return xhr ? xhr : header;
    var keys = KEYS(headers), key, i, l, k, kl;
    if ( httpRequestResponse )
    {
        for(i=0,l=keys.length; i<l; i++)
        {
            key = keys[i];
            // both single value and array
            httpRequestResponse.setHeader(key, headers[key]);
        }
        return httpRequestResponse;
    }
    else if ( xmlHttpRequest )
    {
        for(i=0,l=keys.length; i<l; i++)
        {
            key = keys[i];
            if ( '[object Array]' === toString.call(headers[key]) )
            {
                for(k=0,kl=headers[key].length; k<kl; k++)
                    xmlHttpRequest.setRequestHeader(key, String(headers[key][k]));
            }
            else
            {
                xmlHttpRequest.setRequestHeader(key, String(headers[key]));
            }
        }
        return xmlHttpRequest;
    }
    else
    {
        for(i=0,l=keys.length; i<l; i++)
        {
            key = keys[i];
            if ( '[object Array]' === toString.call(headers[key]) )
            {
                if ( header.length ) header += CRLF;
                header += key + ': ' + String(headers[key][0]);
                for(k=1,kl=headers[key].length; k<kl; k++)
                    header += CRLF + String(headers[key][k]);
            }
            else
            {
                if ( header.length ) header += CRLF;
                header += key + ': ' + String(headers[key]);
            }
        }
        return header;
    }
}

function header_decode( headers, lowercase )
{
    var header = { }, key = null, parts, i, l, line;
    if ( !!headers )
    {
        lowercase = true === lowercase;
        headers = headers.split( CRLF );
        for (i=0,l=headers.length; i<l; i++)
        {
            line = headers[i];
            parts = line.split(':');
            if ( parts.length > 1 )
            {
                key = trim(parts.shift());
                if ( lowercase ) key = key.toLowerCase();
                if ( header[HAS](key) )
                {
                    if ( 'string' === typeof header[key] ) header[key] = [header[key]];
                    header[key].push( trim(parts.join(':')) );
                }
                else
                {
                    header[key] = trim(parts.join(':'));
                }
            }
            else if ( parts[0].length && key )
            {
                header[key] = CRLF + parts[0];
            }
        }
    }
    return header;
}

FILTER.Util.Http = {
    Header: {
        encode: header_encode,
        decode: header_decode
    }
};

var XHR = FILTER.Util.XHR = function XHR( send, abort ){
    var xhr = this, aborted = false;
    xhr.readyState = XHR.UNSENT;
    xhr.status = null;
    xhr.statusText = null;
    xhr.responseType = 'text';
    xhr.responseURL = null;
    xhr.response = null;
    xhr.responseText = null;
    xhr.responseXml = null;
    xhr._rawHeaders = null;
    xhr._headers = null;
    xhr.send = function( payload ) {
        if ( aborted || (XHR.UNSENT !== xhr.readyState) ) return xhr;
        if ( send ) send( payload );
        xhr.readyState = XHR.OPENED;
        return xhr;
    };
    xhr.abort = function( ){
        if ( aborted ) return xhr;
        aborted = true;
        if ( abort ) abort( );
        return xhr;
    };
    xhr.getAllResponseHeaders = function( decoded ) {
        if ( XHR.DONE !== xhr.readyState ) return null;
        return true===decoded ? xhr._headers : xhr._rawHeaders;
    };
    xhr.getResponseHeader = function( key, lowercased ) {
        if ( (null == key) || (XHR.DONE !== xhr.readyState) ) return null;
        var headers = xhr._headers || {};
        if ( false !== lowercased ) key = key.toLowerCase( );
        return headers[HAS](key) ? headers[key] : null;
    };
    xhr.dispose = function( ) {
        xhr.readyState = null;
        xhr.status = null;
        xhr.statusText = null;
        xhr.responseType = null;
        xhr.responseURL = null;
        xhr.response = null;
        xhr.responseText = null;
        xhr.responseXml = null;
        xhr._rawHeaders = null;
        xhr._headers = null;
        xhr.getAllResponseHeaders = null;
        xhr.getResponseHeader = null;
        xhr.send = null;
        xhr.abort = null;
        return xhr;
    };
};

XHR.UNSENT = 0;
XHR.OPENED = 1;
XHR.HEADERS_RECEIVED = 2;
XHR.LOADING = 3;
XHR.DONE = 4;

XHR.create = isNode ? function( o, payload ) {
        o = o || {};
        if ( !o.url ) return null;
        var url = '[object Object]' === toString.call(o.url) ? o.url : require('url').parse( o.url ),
            $hr$, xhr,
            options = {
                method      : o.method || 'GET',
                agent       : false,
                protocol    : url.protocol,
                host        : url.hostname,
                hostname    : url.hostname,
                port        : url.port || 80,
                path        : (url.pathname||'/')+(url.query?('?'+url.query):'')
            }
        ;
        
        if ( 'file:' === options.protocol )
        {
            xhr = new XHR(
            function( payload ) {
                // https://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback
                xhr.readyState = XHR.OPENED;
                require('fs').readFile(options.path, {
                    // return raw buffer
                    encoding: 'arraybuffer' === xhr.responseType ? null : xhr.responseType,
                    flag: 'r'
                }, function( err, data ) {
                    xhr.readyState = XHR.DONE;
                    xhr.responseUrl = options.path;
                    if ( o.onLoadStart ) o.onLoadStart( xhr );
                    if ( o.onLoadEnd ) o.onLoadEnd( xhr );
                    if ( err )
                    {
                        xhr.status = 500;
                        xhr.statusText = err.toString();
                        if ( o.onRequestError ) o.onRequestError( xhr );
                        else if ( o.onError ) o.onError( xhr );
                    }
                    else
                    {
                        xhr.status = 200;
                        xhr.statusText = null;
                        xhr.response = data;
                        if ( 'arraybuffer' !== xhr.responseType )
                        {
                            xhr.responseText = data;
                            xhr.responseXml = null;
                        }
                        else
                        {
                            xhr.responseText = null;
                            xhr.responseXml = null;
                        }
                        if ( o.onComplete ) o.onComplete( xhr );
                    }
                });
            },
            function( ) { });
            xhr.responseType = o.responseType || 'text';
            if ( arguments.length > 1 ) xhr.send( payload );
            return xhr;
        }
        
        xhr = new XHR(
        function( payload ) {
            if ( null != payload )
            {
                payload = String( payload );
                $hr$.setHeader( 'Content-Length', String(payload.length) );
                $hr$.write( payload );
            }
            /*else
            {
                $hr$.setHeader( 'Content-Length', '0' );
                $hr$.write( '' );
            }*/
            $hr$.end( );
        },
        function( ) {
            $hr$.abort( );
        });
        $hr$ = ('https:'===options.protocol?require('https').request:require('http').request)(options, function( response ) {
            var xdata = '', data_sent = 0;
            
            xhr.readyState = XHR.OPENED;
            if ( o.onStateChange ) o.onStateChange( xhr );
            
            xhr.readyState = XHR.HEADERS_RECEIVED;
            xhr._rawHeaders = response.rawHeaders.join("\r\n");
            xhr._headers = response.headers;
            xhr.responseURL = response.url || null;
            xhr.status = response.statusCode || null;
            xhr.statusText = response.statusMessage || null;
            if ( o.onStateChange ) o.onStateChange( xhr );
            
            response.on('data', function( chunk ){
                if ( !data_sent )
                {
                    data_sent = 1;
                    xhr.readyState = XHR.LOADING;
                    if ( o.onStateChange ) o.onStateChange( xhr );
                    if ( o.onLoadStart ) o.onLoadStart( xhr );
                }
                xdata += chunk.toString( );
                if ( o.onProgress ) o.onProgress( xhr );
            });
            
            response.on('end', function( ){
                xhr.readyState = XHR.DONE;
                xhr.responseType = 'text';
                xhr.response = xhr.responseText = xdata;
                
                if ( o.onStateChange ) o.onStateChange( xhr );
                if ( o.onLoadEnd ) o.onLoadEnd( xhr );
                
                if ( XHR.DONE === xhr.readyState )
                {
                    if ( 200 === xhr.status )
                    {
                        if ( o.onComplete ) o.onComplete( xhr );
                    }
                    else
                    {
                        if ( o.onRequestError ) o.onRequestError( xhr );
                        else if ( o.onError ) o.onError( xhr );
                    }
                }
            });
            
            response.on('error', function( ee ){
                xhr.statusText = ee.toString( );
                if ( o.onError ) o.onError( xhr );
            });
        });
        
        $hr$.setTimeout(o.timeout || 30000, function( e ){
            if ( o.onTimeout ) o.onTimeout( xhr );
        });
        $hr$.on('abort', function( ee ){
            if ( o.onAbort ) o.onAbort( xhr );
        });
        $hr$.on('error', function( ee ){
            xhr.statusText = ee.toString( );
            if ( o.onError ) o.onError( xhr );
        });
        
        if ( o.headers ) header_encode( o.headers, null, $hr$ );
        //if ( o.mimeType ) $hr$.overrideMimeType( o.mimeType );
        if ( arguments.length > 1 ) xhr.send( payload );
        return xhr;
    } : function( o, payload ) {
        o = o || {};
        if ( !o.url ) return null;
        var $xhr$ = 'undefined' !== typeof XMLHttpRequest
            ? new XMLHttpRequest( )
            : new ActiveXObject( 'Microsoft.XMLHTTP' ) /* or ActiveXObject( 'Msxml2.XMLHTTP' ); ??*/,
            
            xhr = new XHR(
            function( payload ){
                $xhr$.send( payload );
            },
            function( ){
                $xhr$.abort( );
            }),
            
            update = function( xhr, $xhr$ ) {
                //xhr.responseType = $xhr$.responseType;
                xhr.readyState = $xhr$.readyState;
                xhr.status = $xhr$.status;
                xhr.statusText = $xhr$.statusText;
                xhr.responseURL = $xhr$.responseURL;
                xhr.response = $xhr$.response;
                if ( 'arraybuffer' !== $xhr$.responseType )
                {
                    xhr.responseText = $xhr$.responseText;
                    xhr.responseXml = $xhr$.responseXml;
                }
                else
                {
                    xhr.responseText = null;
                    xhr.responseXml = null;
                }
                return xhr;
            }
        ;
        xhr.getAllResponseHeaders = function( decoded ){
            var headers = $xhr$.getAllResponseHeaders( );
            return true===decoded ? header_decode( headers ) : headers;
        };
        xhr.getResponseHeader = function( key ){
            return $xhr$.getResponseHeader( key );
        };
        
        $xhr$.open( o.method||'GET', o.url, !o.sync );
        xhr.responseType = $xhr$.responseType = o.responseType || 'text';
        $xhr$.timeout = o.timeout || 30000; // 30 secs default timeout
        
        if ( o.onProgress )
        {
            $xhr$.onprogress = function( ) {
                o.onProgress( update( xhr, $xhr$ ) );
            };
        }
        if ( o.onLoadStart )
        {
            $xhr$.onloadstart = function( ) {
                o.onLoadStart( update( xhr, $xhr$ ) );
            };
        }
        if ( o.onLoadEnd )
        {
            $xhr$.onloadend = function( ) {
                o.onLoadEnd( update( xhr, $xhr$ ) );
            };
        }
        if ( !o.sync && o.onStateChange )
        {
            $xhr$.onreadystatechange = function( ) {
                o.onStateChange( update( xhr, $xhr$ ) );
            };
        }
        $xhr$.onload = function( ) {
            update( xhr, $xhr$ );
            if ( XHR.DONE === $xhr$.readyState )
            {
                if ( 200 === $xhr$.status )
                {
                    if ( o.onComplete ) o.onComplete( xhr );
                }
                else
                {
                    if ( o.onRequestError ) o.onRequestError( xhr );
                    else if ( o.onError ) o.onError( xhr );
                }
            }
        };
        $xhr$.onabort = function( ) {
            if ( o.onAbort ) o.onAbort( update( xhr, $xhr$ ) );
        };
        $xhr$.onerror = function( ) {
            if ( o.onError ) o.onError( update( xhr, $xhr$ ) );
        };
        $xhr$.ontimeout = function( ) {
            if ( o.onTimeout ) o.onTimeout( update( xhr, $xhr$ ) );
        };
        
        if ( o.headers ) header_encode( o.headers, $xhr$ );
        if ( o.mimeType ) $xhr$.overrideMimeType( o.mimeType );
        if ( arguments.length > 1 ) xhr.send( payload );
        return xhr;
    }
;

}(FILTER);/**
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
/* main code ends here */
/* export the module */
return FILTER;
});