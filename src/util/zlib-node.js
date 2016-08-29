/**
*
* Filter Utils, zlib (native nodejs module)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

if ( FILTER.Util.LOADED_ZLIB ) return;
FILTER.Util.LOADED_ZLIB = true;

// https://nodejs.org/api/zlib.html
var zlib = require('zlib');

FILTER.Util.ZLib = {
    Module: zlib,

    inflate: function( data, chunkSize ){
        return zlib.inflateSync(data instanceof Buffer ? data : new Buffer(data), {
            chunkSize: null == chunkSize ? 16*1024 : chunkSize
        });
    },

    rawinflate: function( data, chunkSize ){
        return zlib.inflateRawSync(data instanceof Buffer ? data : new Buffer(data), {
            chunkSize: null == chunkSize ? 16*1024 : chunkSize
        });
    },

    deflate: function( data, compressionLevel, chunkSize ){
        var opts = {
            chunkSize: null == chunkSize ? 16*1024 : chunkSize,
        };
        if ( null != compressionLevel ) opts.level = compressionLevel;
        return zlib.deflateSync(data instanceof Buffer ? data : new Buffer(data), opts);
    },

    rawdeflate: function( data, compressionLevel, chunkSize ){
        var opts = {
            chunkSize: null == chunkSize ? 16*1024 : chunkSize,
        };
        if ( null != compressionLevel ) opts.level = compressionLevel;
        return zlib.deflateRawSync(data instanceof Buffer ? data : new Buffer(data), opts);
    }
};

}(FILTER);