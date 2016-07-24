/**
*
* SVGFilter Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// http://www.w3.org/TR/SVG/filters.html

//
//
// Generic SVG-based Filter
FILTER.SVGFilter = FILTER.Class( FILTER.Filter, {
    name: "SVGFilter"
    
    ,constructor: function( svgXml ) { 
        // todo
        this.$super('constructor');
    }
});

}(FILTER);