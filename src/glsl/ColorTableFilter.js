/**
*
* GLSL Color Table Filter
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

//
//
// GLSL Shaders
var tableLookup = {
        
        attributes: null,
        
        uniforms: null,
            
        textures: [
            {name: "u_image", image: null, texture: null},
            // these need to be textures most probably as their size is > 128
            // http://www.john-smith.me/hassles-with-array-access-in-webgl--and-a-couple-of-workarounds
            {name: "u_TR", image: null, texture: null},
            {name: "u_TG", image: null, texture: null},
            {name: "u_TB", image: null, texture: null}
        ],
        
        vertex: null,
        
        fragment: {
            type: "fragment",
            
            source: "\
                precision mediump float;\
                \
                // our texture\
                uniform sampler2D u_image;\
                // lookup tables as textures\
                uniform sampler2D u_TR;\
                uniform sampler2D u_TG;\
                uniform sampler2D u_TB;\
                \
                // the texCoords passed in from the vertex shader.\
                varying vec2 v_texCoord;\
                \
                void main() {\
                   vec4 rgba =texture2D(u_image, v_texCoord);\
                   float tR =texture2D(u_TR, vec2(rgba.r, 0.0)).r;\
                   float tG =texture2D(u_TG, vec2(rgba.g, 0.0)).g;\
                   float tB =texture2D(u_TB, vec2(rgba.b, 0.0)).b;\
                   gl_FragColor = vec4(tR, tG, tB, rgba.a);\
                 }"
        }
};
    
//
//
// ColorTable GLSL Filter  (IN PROGRESS!!)
FILTER.GLSL.ColorTableFilter = FILTER.Class( FILTER.GLSL.Filter, {
    
    name : "GLSL.ColortableFilter",
    
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
FILTER.GLSL.TableLookupFilter = FILTER.GLSL.ColorTableFilter;

}(FILTER);