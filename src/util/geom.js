/**
*
* Filter Utils, Geometry utils
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

if ( FILTER.Util.LOADED_GEOMETRY ) return;
FILTER.Util.LOADED_GEOMETRY = true;

var GeomUtil = FILTER.Util.Geometry = FILTER.Util.Geometry || {}, fabs = Math.abs, sqrt = Math.sqrt;

GeomUtil.L2norm = GeomUtil.eudist = GeomUtil.pydist = function dist2( a, b ) {
    var at = fabs(a), bt = fabs(b);
    if ( at > bt )       { bt /= at; return at * sqrt(1.0 + bt*bt); }
    else if ( bt > 0.0 ) { at /= bt; return bt * sqrt(1.0 + at*at); }
    return 0.0;
};

GeomUtil.L1norm = GeomUtil.absdist = function dist1( a, b ) {
    return fabs(a) + fabs(b);
};

}(FILTER);