/**
*
* Algebraic Filter
*
* Algebraicaly combines input images
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

//
// TODO AlgebraicFilter
var AlgebraicFilter = FILTER.AlgebraicFilter = FILTER.Class( FILTER.Filter, {
    name: "AlgebraicFilter"
    
    ,constructor: function AlgebraicFilter( ) {
        var self = this;
        if ( !(self instanceof AlgebraicFilter) ) return new AlgebraicFilter();
        self.$super('constructor');
    }
    
    ,path: FILTER_FILTERS_PATH
    
    ,dispose: function( ) {
        var self = this;
        self.$super('dispose');
        return self;
    }
});

}(FILTER);