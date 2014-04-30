/**
*
* SVGFilter Class
* @package FILTER.js
*
**/
!function(FILTER, undef){

    @@USE_STRICT@@
    
    // http://www.w3.org/TR/SVG/filters.html
    
    //
    //
    // Generic SVG-based Filter
    var SVGFilter = FILTER.SVGFilter = FILTER.Class( FILTER.Filter, {
        constructor : function(svgXml) { 
            // todo
            this.$super('constructor');
        }
    });
    
}(FILTER);