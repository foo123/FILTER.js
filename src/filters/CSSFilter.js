/**
*
* CSSFilter Class
* @package FILTER.js
*
**/
!function(FILTER, undef){

    @@USE_STRICT@@
    
    // https://dvcs.w3.org/hg/FXTF/raw-file/tip/filters/index.html
    // https://developer.mozilla.org/en-US/docs/Web/CSS/filter
    
    
    //
    //
    // Generic CSS-based Filter
    var CSSFilter = FILTER.CSSFilter = FILTER.Class( FILTER.Filter, {
        constructor : function(cssFilterString) { 
            // todo
            this.$super('constructor');
        }
    });
    
}(FILTER);