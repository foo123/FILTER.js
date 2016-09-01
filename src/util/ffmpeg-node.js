/**
*
* Filter Utils, ffmpeg (nodejs module with ffmpeg bindings)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

if ( FILTER.Util.LOADED_FFMPEG ) return;
FILTER.Util.LOADED_FFMPEG = true;

// https://github.com/damianociarla/node-ffmpeg
var ffmpeg = require('ffmpeg');

FILTER.Util.FFMpeg = {
    Module: ffmpeg,
    command: function( opts ){
        return ffmpeg( opts );
    }
};

}(FILTER);