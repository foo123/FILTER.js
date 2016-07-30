/**
*
* GLSL Inline Filter
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

//
//
// Inline GLSL Filter  (IN PROGRESS!!)
FILTER.GLSL.InlineFilter = FILTER.Class( FILTER.GLSL.Filter, {
    
    name : "GLSL.InlineFilter",
    
    constructor : function() { 
        this.id='WGLDM1'; //FILTER.uuid();
    },
    
    filterParams: null, 
    
    _apply: function(webgl, w, h, inBuffer, outBuffer) {
        // get this filter's (cached / singleton) program
        var webglprogram=this._getProgram(webgl, this.shaders, this.attributes, this.uniforms, this.textures);
        // use this filter's program
        webgl.switchToStoredProgram(webglprogram);
        // update any filter-specific parameters
        webglprogram.enableAttributes(BUFFERS).setUniformValues(this.filterParams);
        // set the input buffer
        webgl.setTextureFramebuffer(inBuffer);
        // set the output buffer
        webgl.setTextureFramebuffer(outBuffer);
        // render
        webgl.drawTriangles(this.triangles);
    }
});
FILTER.GLSL.CustomFilter = FILTER.GLSL.InlineFilter;

}(FILTER);