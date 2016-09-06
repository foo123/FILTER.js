/**
*
* GLSL Generic Filter Classes
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// Generic GLSL Filter
var GLSLFilter = FILTER.GLSL.Filter = FILTER.Class( FILTER.Filter, {
    
    name : "GLSL.Filter",
    
    path: FILTER_GLSL_PATH,
    
    constructor: function( ) { 
        var self = this;
        self.$super('constructor');
        self.vertex = null;
        self.fragment = null;
        self.attributes = null;
        self.uniforms = null;
        self.textures = null;
    },
    
    filterParams: null,
    numTriangles: 6,
    attributes: null,
    uniforms: null,
    textures: null,
    
    createProgram: function( gl, vertex, fragment ){
        return GLSL.createProgram(gl,
            GLSLUtil.createShader(gl, vertex, "vertex"),
            GLSLUtil.createShader(gl, fragment, "fragment")
        );
    },
    
    _apply: function(gl, im, w, h) {
        // get this filter's (cached / singleton) program
        var webglprogram=this._getProgram(webgl, this.shaders, this.attributes, this.uniforms, this.textures);
        // use this filter's program
        webgl.switchToStoredProgram(webglprogram);
        // update any filter-specific parameters
        webglprogram.enableAttributes(BUFFERS).setUniformValues(this.filterParams);
        // set the input texture
        webgl.setTextureFramebuffer(inBuffer);
        // set the output buffer
        webgl.setTextureFramebuffer(outBuffer);
        // render
        webgl.drawTriangles(this.triangles);
    },
    
    apply: function(image) {
        var gl = image.gl(), w = image.width, h = image.height,
            inBuffer = gl.createTextureFramebuffer(w, h, image.oCanvas),
            outBuffer = gl.getDefaultTextureFrameBuffer(w, h)
        ;
        this._apply(gl, w, h, inBuffer, outBuffer);
        return image;
    }
});
GLSLFilter.defaultVertexShader = "\
attribute vec2 __POSITION;\
attribute vec2 __IMAGE_XY;\
uniform vec2 __RESOLUTION;\
varying vec2 IMAGE_XY;\
void main(){\
// convert the position from pixels to 0.0 to 1.0\
vec2 zeroToOne = __POSITION / __RESOLUTION;\
// convert from 0->1 to 0->2\
vec2 zeroToTwo = zeroToOne * 2.0;\
// convert from 0->2 to -1->+1 (clipspace)\
vec2 clipSpace = zeroToTwo - 1.0;\
gl_Position = vec4(clipSpace*vec2(1, -1), 0, 1);\
// pass the texCoord to the fragment shader\
// The GPU will interpolate this value between points\
IMAGE_XY = __IMAGE_XY;\
}\
";
GLSLFilter.defaultFragmentShader = "\
precision mediump float;\
// our texture\
uniform sampler2D IMAGE;\
uniform vec2 IMAGE_WH;\
// the texCoords passed in from the vertex shader.\
varying vec2 IMAGE_XY;\
void main(){\
// compute 1 pixel in texture coordinates.\
vec2 onePixel = vec2(1.0, 1.0) / IMAGE_WH;\
// Look up a color from the texture.\
gl_FragColor = texture2D(IMAGE, IMAGE_XY);\
}\
";

}(FILTER);