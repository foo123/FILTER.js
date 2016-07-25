/**
*
* CSSFilter Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// https://dvcs.w3.org/hg/FXTF/raw-file/tip/filters/index.html
// https://developer.mozilla.org/en-US/docs/Web/CSS/filter


//
//
// Generic CSS-based Filter
FILTER.CSSFilter = FILTER.Class( FILTER.Filter, {
    name: "CSSFilter"
    
    ,path: FILTER_SVG_PATH
    
    ,constructor: function( cssFilterString ) { 
        // todo
        this.$super('constructor');
    }
});

}(FILTER);