/**
*
* Filter Loader/Reader/Writer I/O Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

FILTER.Loader = FILTER.Reader = FILTER.Class({
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
        /*var self = this;
        if ( !(self instanceof Loader) )
            return new Loader( );*/
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
// aliases
FILTER.Loader.prototype.read = FILTER.Loader.prototype.load;

FILTER.Writer = FILTER.Class({
    name: "Writer",
    
    __static__: {
        // accessible as "$class.load" (extendable and with "late static binding")
        write: FILTER.Method(function($super, $private, $class){
              // $super is the direct reference to the superclass itself (NOT the prototype)
              // $private is the direct reference to the private methods of this class (if any)
              // $class is the direct reference to this class itself (NOT the prototype)
              return function( file, data, onWrite, onError ) {
                return new $class().write(file, data, onWrite, onError);
            }
        }, FILTER.LATE|FILTER.STATIC )
    },
    
    constructor: function Writer() {
        /*var self = this;
        if ( !(self instanceof Writer) )
            return new Writer( );*/
    },
    
    _encoding: null,
    
    dispose: function( ) {
        var self = this;
        self._encoding = null;
        return self;
    },
    
    // override in sub-classes
    write: function( file, data, onWrite, onError ){
        return null;
    },

    encoding: function ( value ) {
        var self = this;
        if ( arguments.length )
        {
            self._encoding = value;
            return self;
        }
        return self._encoding;
    }
});

}(FILTER);