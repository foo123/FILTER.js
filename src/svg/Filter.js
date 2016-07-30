/**
*
* SVG Filter Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// http://www.w3.org/TR/SVG/filters.html

//
//
// Generic SVG-based Filter
FILTER.SVG.Filter = FILTER.Class( FILTER.Filter, {
    name: "SVG.Filter"
    
    ,path: FILTER_SVG_PATH
    
    ,constructor: function( svgXml ) { 
        // todo
        this.$super('constructor');
    }
});

// https://dvcs.w3.org/hg/FXTF/raw-file/tip/filters/index.html
// https://developer.mozilla.org/en-US/docs/Web/CSS/filter


//
//
// Generic CSS-based Filter
FILTER.SVG.CSSFilter = FILTER.Class( FILTER.Filter, {
    name: "SVG.CSSFilter"
    
    ,path: FILTER_SVG_PATH
    
    ,constructor: function( cssFilterString ) { 
        // todo
        this.$super('constructor');
    }
});

}(FILTER);