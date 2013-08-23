/**
*
* Filter SuperClass
* @package FILTER.js
*
**/
(function(FILTER){

    // machine arrays substitute 
    FILTER.Array32F = (typeof Float32Array !== "undefined") ? Float32Array : Array,
    FILTER.Array64F = (typeof Float64Array !== "undefined") ? Float64Array : Array,
    FILTER.Array8I = (typeof Int8Array !== "undefined") ? Int8Array : Array,
    FILTER.Array16I = (typeof Int16Array !== "undefined") ? Int16Array : Array,
    FILTER.Array32I = (typeof Int32Array !== "undefined") ? Int32Array : Array,
    FILTER.Array8U = (typeof Uint8Array !== "undefined") ? Uint8Array : Array,
    FILTER.Array16U = (typeof Uint16Array !== "undefined") ? Uint16Array : Array,
    FILTER.Array32U = (typeof Uint32Array !== "undefined") ? Uint32Array : Array
    ;
    
    FILTER.Filter=function(image) { this.image=image; };
    FILTER.Filter.prototype.apply=function() { /* do nothing here, override */ };
    
})(FILTER);