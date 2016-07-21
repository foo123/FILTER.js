/**
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
}(FILTER);