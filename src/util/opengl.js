/**
*
* Filter Utils, OpenGL support and bindings
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

if ( FILTER.Util.LOADED_OPENGL ) return;
FILTER.Util.LOADED_OPENGL = true;

var GLSLUtil = FILTER.Util.GLSL = FILTER.Util.GLSL||{};

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

// glsl (webgl/node-gl) support, override this for node-gl support
var GLExt = null;
FILTER.GL = FILTER.Browser.isNode
? function( canvas, options ){ return null; }
: function( canvas, options ){
    options = options || {
        depth: false,
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
        stencil: false,
        preserveDrawingBuffer: false
    };
    var gl = null;
    if ( !GLExt )
    {
        var names = ["webgl2", "experimental-webgl2", "webgl", "experimental-webgl", "webkit-3d", "moz-webgl"],
            nl = names.length, i;

        for(i=0; i<nl; ++i) 
        {
            try {
                gl = canvas.getContext(names[i], options);
            } catch(e) {
                gl = null;
            }
            if ( gl )  { GLExt = names[i]; break; }
        }
    }
    else
    {
        gl = canvas.getContext(GLExt, options);
    }
    return gl;
};

}(FILTER);