/**
*
* GLSL Generic Filter Classes
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var GLSLUtil = FILTER.Util.GLSL;

// http://www.khronos.org/webgl/wiki/Main_Page
// http://www.html5rocks.com/en/tutorials/webgl/webgl_fundamentals/

// adapted from Kronos WebGL specifications
GLSLUtil.getSupportedExtensionWithKnownPrefixes = function( gl, name ) {
    var browserPrefixes = ["", "MOZ_", "OP_", "WEBKIT_"], bLen = browserPrefixes.length,
        supported = gl.getSupportedExtensions( ), i, prefixedName;
    for(i=0; i<bLen; ++i) 
    {
        prefixedName = browserPrefixes[i] + name;
        if ( -1 < supported.indexOf(prefixedName) ) return prefixedName;
    }
    return null;
};
GLSLUtil.getExtensionWithKnownPrefixes = function( gl, name )  {
    var browserPrefixes = ["", "MOZ_", "OP_", "WEBKIT_"], bLen = browserPrefixes.length,
        i, prefixedName, ext;
    for(i=0; i<bLen; ++i) 
    {
        prefixedName = browserPrefixes[i] + name;
        ext = gl.getExtension( prefixedName );
        if ( ext ) return ext;
    }
    return null;
};
GLSLUtil.getArrayBufferType = function getArrayBufferType( gl, type ) {
    switch ( type ) 
    {
        case gl.BYTE:
            return FILTER.Array8I;
        case gl.UNSIGNED_BYTE:
            return FILTER.Array8U;
        case gl.SHORT:
            return FILTER.Array16I;
        case gl.UNSIGNED_SHORT:
        case gl.UNSIGNED_SHORT_5_6_5:
        case gl.UNSIGNED_SHORT_4_4_4_4:
        case gl.UNSIGNED_SHORT_5_5_5_1:
            return FILTER.Array16U;
        case gl.INT:
            return FILTER.Array32I;
        case gl.UNSIGNED_INT:
            return FILTER.Array32U;
        case gl.FLOAT:
            return FILTER.Array32F;
        default:
        throw 'unknown gl type';
    }
};
GLSLUtil.getArrayType = function getArrayType( gl, typedArray ){
    if (typedArray instanceof FILTER.Array8I)   return gl.BYTE;
    if (typedArray instanceof FILTER.Array8U ||
        typedArray instanceof FILTER.ImArray)   return gl.UNSIGNED_BYTE;
    if (typedArray instanceof FILTER.Array16I)  return gl.SHORT;
    if (typedArray instanceof FILTER.Array16U)  return gl.UNSIGNED_SHORT;
    if (typedArray instanceof FILTER.Array32I)  return gl.INT;
    if (typedArray instanceof FILTER.Array32U)  return gl.UNSIGNED_INT;
    if (typedArray instanceof FILTER.Array32F)  return gl.FLOAT;
    throw "unsupported typed array type";
};
GLSLUtil.getBytesPerComponent = function getBytesPerComponent( gl, type ) {
    switch (type) 
    {
        case gl.BYTE:
        case gl.UNSIGNED_BYTE:
            return 1;
        case gl.SHORT:
        case gl.UNSIGNED_SHORT:
        case gl.UNSIGNED_SHORT_5_6_5:
        case gl.UNSIGNED_SHORT_4_4_4_4:
        case gl.UNSIGNED_SHORT_5_5_5_1:
            return 2;
        case gl.INT:
        case gl.UNSIGNED_INT:
        case gl.FLOAT:
            return 4;
        default:
        throw 'unknown gl type';
    }
};
// adapted from WebGL foundamentals
GLSLUtil.setBufferFromTypedArray = function setBufferFromTypedArray( gl, type, buffer, array, drawType ){
    gl.bindBuffer(type, buffer);
    gl.bufferData(type, array, drawType || gl.STATIC_DRAW);
};
GLSLUtil.createBufferFromTypedArray = function createBufferFromTypedArray( gl, typedArray, type, drawType ){
    //if ( typedArray instanceof WebGLBuffer ) { return typedArray; }
    type = type || gl.ARRAY_BUFFER;
    var buffer = gl.createBuffer();
    GLSLUtil.setBufferFromTypedArray(gl, type, buffer, typedArray, drawType);
    return buffer;
};
GLSLUtil.createAttributes = function createAttributes( gl, atts, prefix ){
    prefix = prefix || '';
    var attributes = {};
    Object.keys(atts).forEach(function(attName){
        var array = atts[attName], type = GLSLUtil.getArrayType(gl, array);
        attributes[attName] = {
            prefix:        prefix,
            buffer:        GLSLUtil.createBufferFromTypedArray(gl, array),
            type:          type,
            numComponents: GLSLUtil.getBytesPerComponent(gl, type),
            stride:        0,
            offset:        0
        };
    });
    return attributes;
};
GLSLUtil.createShader = function createShader( gl, source, type ){
    // Create the shader object
    var shader = gl.createShader("vertex"===type ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
    // Load the shader source
    gl.shaderSource(shader, source);
    // Compile the shader
    gl.compileShader(shader);
    // Check the compile status
    if ( 0 == gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) 
    {
        // Something went wrong during compilation; get the error
        var err = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        FILTER.error(err);
        return null;
    }
    return shader;
};
GLSLUtil.createProgram = function createProgram( gl, vertex, fragment ){
    var program = gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    // Check the link status
    if ( 0 == gl.getProgramParameter(program, gl.LINK_STATUS) ) 
    {
        // something went wrong with the link
        var err = gl.getProgramInfoLog(program);;
        gl.deleteProgram(program);
        FILTER.error(err);
        return null;
    }
    return program;
};
GLSLUtil.createTexture = function createTexture( gl, imageData, w, h ){
    // Create and initialize the GLTexture object.
    var textureID = gl.createTexture();
    //set properties for the texture
    gl.bindTexture(gl.TEXTURE_2D, textureID);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, imageData);
    // restore default texture
    gl.bindTexture(gl.TEXTURE_2D, null);
    return textureID;
};
GLSLUtil.defaultVertexShader = "\
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
GLSLUtil.defaultFragmentShader = "\
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

//
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
}(FILTER);