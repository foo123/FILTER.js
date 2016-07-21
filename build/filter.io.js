/**
*
*   FILTER.js I/O Classes
*   @version: 0.9.0
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
*   @version: 0.9.0
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (I/O Loaders)
*   https://github.com/foo123/FILTER.js
*
**/

/**
*
* Filter Utils, utf8 / base64
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var HAS = 'hasOwnProperty', toString = Object.prototype.toString, KEYS = Object.keys, CRLF = "\r\n",
    trim_re = /^\s+|\s+$/g,
    trim = String.prototype.trim 
        ? function( s ) { return s.trim( ); }
        : function( s ) { return s.replace(trim_re, ''); }
;

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

FILTER.Util.Http = {
    Header: {
        encode: header_encode,
        decode: header_decode
    }
};

XHR.create = FILTER.Browser.isNode
    ? function( o, payload ) {
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
    }
    : function( o, payload ) {
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
            if ( XHR.DONE === $xhr$.readyState )
            {
                update( xhr, $xhr$ );
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
* Filter XHRLoader Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

FILTER.IO.XHRLoader = FILTER.Class(FILTER.IO.Loader, {
    name: "IO.XHRLoader",
    
    constructor: function XHRLoader( ) {
        var self = this;
        if ( !(self instanceof XHRLoader) ) return new XHRLoader( );
    },
    
    load: function ( url, onLoad, onError ) {
        var self = this;
        
        FILTER.Util.XHR.create({
            url: url,
            responseType: self._responseType,
            onComplete: function( xhr ) {
                if ( 'function' === typeof onLoad ) onLoad( xhr.response );
            },
            onError: function( xhr ) {
                if ( 'function' === typeof onError ) onError( xhr.statusText );
            }
        }, null);
        /*if ( FILTER.Browser.isNode )
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
            if ( self._crossOrigin ) request.crossOrigin = self._crossOrigin;
            if ( self._responseType ) request.responseType = self._responseType;
            request.send( null );
        }*/
        return self;
    }
});
}(FILTER);/**
*
* Filter BinaryLoader Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Loader = FILTER.IO.Loader, XHR = FILTER.Util.XHR, FilterImage = FILTER.Image, Class = FILTER.Class;

var FileLoader = FILTER.IO.FileLoader = FILTER.IO.FileReader = Class(Loader, {
    name: "IO.FileLoader",
    
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

FILTER.IO.BinaryLoader = FILTER.IO.BinaryReader = Class(FileLoader, {
    name: "IO.BinaryLoader",
    
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
    }

});
  
}(FILTER);/**
*
* Filter BinaryWriter Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Class = FILTER.Class;

var FileWriter = FILTER.IO.FileWriter = Class(FILTER.IO.Writer, {
    name: "IO.FileWriter",
    
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

FILTER.IO.BinaryWriter = Class(FileWriter, {
    name: "IO.BinaryWriter",
    
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
  
}(FILTER);/**
*
* Filter (HTML)ImageLoader Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var FilterImage = FILTER.Image/*, ON = 'addEventListener'*/;

FILTER.IO.HTMLImageLoader = FILTER.Class(FILTER.IO.Loader, {
    name: "IO.HTMLImageLoader",
    
    constructor: function HTMLImageLoader() {
        if ( !(this instanceof HTMLImageLoader) )
            return new HTMLImageLoader();
        this.$super('constructor');
    },
    
    load: function( url, onLoad, onError ){
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
        
        loader.crossOrigin = scope._crossOrigin || "";
        loader.src = url;
        
        return image;
    }
});
}(FILTER);
/* main code ends here */
/* export the module */
return FILTER;
});