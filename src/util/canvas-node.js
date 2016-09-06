/**
*
* Filter Utils, Canvas Proxy Class (native nodejs module)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

if ( FILTER.Util.LOADED_CANVAS ) return;
FILTER.Util.LOADED_CANVAS = true;

// https://github.com/Automattic/node-canvas
// or maybe use your own proxy which uses node-canvas underneath, as you see fit
FILTER.CanvasProxy = require('canvas');

}(FILTER);