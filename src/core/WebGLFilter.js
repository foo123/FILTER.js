/**
*
* WebGLFilter Classes and Shaders
* @package FILTER.js
*
**/
(function(FILTER){

    //
    //
    // WebGL Support
    var supportWebGL=false, supportWebGLSharedResources=false,  WEBGLNAME=null,
        createCanvas=FILTER.createCanvas,
        MAX_KERNEL_SIZE=121
        ;
    
    // http://www.khronos.org/webgl/wiki/Main_Page
    // http://www.html5rocks.com/en/tutorials/webgl/webgl_fundamentals/
    
    // Add your prefix here.
    var browserPrefixes = [
      "",
      "MOZ_",
      "OP_",
      "WEBKIT_"
    ], browserPrefixesLength=browserPrefixes.length;

    //
    //
    // Generic WebGL Program Class
    function WebGLProgram(webgl, program, uniforms)  
    {
        this.glContainer=webgl || null;
        this.program=program || null;
        if (uniforms)
        {
            this.setUniforms(uniforms);
        }
    }
    WebGLProgram.prototype={
    
        constructor: WebGLProgram,
        
        glContainer: null,
        
        program: null,
        
        _shaders: null,
        _uniforms: null,
        _locations: null,
        _values: null,
        _uniformsNeedUpdate: false,
        
        dispose: function() {
            this.glContainer._gl.deleteProgram(this.program);
            this.program=null;
            this._uniforms=null;
            this._locations=null;
            this._values=null;
            return this;
        },
        
        setContainer: function(webgl) {
            this.glContainer=webgl;
            //this._uniformsNeedUpdate=true;
            return this;
        },
        
        setProgram: function(program) {
            this.program=program;
            this._uniformsNeedUpdate=true;
            return this;
        },
        
        setUniforms: function(uniforms) {
            if (uniforms)
            {
                this._uniforms=uniforms;
                this.updateUniformLocations();
                this._uniformsNeedUpdate=false;
            }
            return this;
        },
        
        setUniformValues: function(values) {
            if (!values)  return this;
            
            if (this._uniformsNeedUpdate) this.updateUniformLocations();
            
            var i, loc=this._locations, vL=Math.min(values.length, loc.length);
            this._values=values;
            for (i=0; i<vL; i++)  this.setUniformByLocation(loc[i], values[i].value, values[i].type);
            
            return this;
        },
        
        deleteProgram: function() {
            this.glContainer._gl.deleteProgram(this.program);
            this.program=null;
            this._uniforms=null;
            this._locations=null;
            this._values=null;
            return this;
        },
        
        useProgram: function() {
            this.glContainer._gl.useProgram(this.program);
            return this;
        },
        
        getCachedUniformLocation: function(uniformName) {
            var i=this._uniforms.indexOf(uniformName);
            return this._locations[i];
        },
        
        getUniformLocation: function(uniformName) {
            var gl=this.glContainer._gl;
            return gl.getUniformLocation(this.program, uniformName);
        },
        
        getUniformLocations: function(uniformNames) {
            var gl=this.glContainer._gl, i, nL=uniformNames.length, locations=new Array(nL), prg=this.program;
            for (i=0; i<nL; i++)  locations[i]=gl.getUniformLocation(prg, uniformNames[i]);
            return locations;
        },
        
        updateUniformLocations: function() {
            var gl=this.glContainer._gl, i, nL=this._uniforms.length, locations=new Array(nL), prg=this.program;
            for (i=0; i<nL; i++)  locations[i]=gl.getUniformLocation(prg, this._uniforms[i]);
            this._uniformsNeedUpdate=false;
            this._locations=locations;
            return this;
        },
        
        setUniformByLocation: function(uniformLocation, uniformValue, uniformType) {
            var gl=this.glContainer._gl;
            uniformType = uniformType || "uniform1f";
            switch(uniformType)
            {
                case "uniform1i":
                    gl.uniform1i(uniformLocation, uniformValue);
                    break;
                case "uniform1f":
                    gl.uniform1f(uniformLocation, uniformValue);
                    break;
                case "uniform2f":
                    gl.prototype.uniform2f.apply(gl, [uniformLocation].concat(uniformValue));
                    break;
                case "uniform3f":
                    gl.prototype.uniform3f.apply(gl, [uniformLocation].concat(uniformValue));
                    break;
                case "uniform4f":
                    gl.prototype.uniform4f.apply(gl, [uniformLocation].concat(uniformValue));
                    break;
                case "uniform2iv":
                    gl.uniform2iv(uniformLocation, uniformValue);
                    break;
                case "uniform3iv":
                    gl.uniform3iv(uniformLocation, uniformValue);
                    break;
                case "uniform1fv":
                    gl.uniform1fv(uniformLocation, uniformValue);
                    break;
                case "uniform2fv":
                    gl.uniform2fv(uniformLocation, uniformValue);
                    break;
                case "uniform3fv":
                    gl.uniform3fv(uniformLocation, uniformValue);
                    break;
                case "uniform4fv":
                    gl.uniform4fv(uniformLocation, uniformValue);
                    break;
                default:
                    throw 'unknown gl uniform type ' + uniformType;
            }
            return this;
        },
        
        setUniformByName(uniformName, uniformValue, uniformType) {
            var gl=this.glContainer._gl,
                program = this.program,
                uniformLocation = gl.getUniformLocation(program, uniformName)
                ;
            uniformType = uniformType || "uniform1f";
            switch(uniformType)
            {
                case "uniform1i":
                    gl.uniform1i(uniformLocation, uniformValue);
                    break;
                case "uniform1f":
                    gl.uniform1f(uniformLocation, uniformValue);
                    break;
                case "uniform2f":
                    gl.prototype.uniform2f.apply(gl, [uniformLocation].concat(uniformValue));
                    break;
                case "uniform3f":
                    gl.prototype.uniform3f.apply(gl, [uniformLocation].concat(uniformValue));
                    break;
                case "uniform4f":
                    gl.prototype.uniform4f.apply(gl, [uniformLocation].concat(uniformValue));
                    break;
                case "uniform2iv":
                    gl.uniform2iv(uniformLocation, uniformValue);
                    break;
                case "uniform3iv":
                    gl.uniform3iv(uniformLocation, uniformValue);
                    break;
                case "uniform1fv":
                    gl.uniform1fv(uniformLocation, uniformValue);
                    break;
                case "uniform2fv":
                    gl.uniform2fv(uniformLocation, uniformValue);
                    break;
                case "uniform3fv":
                    gl.uniform3fv(uniformLocation, uniformValue);
                    break;
                case "uniform4fv":
                    gl.uniform4fv(uniformLocation, uniformValue);
                    break;
                default:
                    throw 'unknown gl uniform type ' + uniformType;
            }
            return this;
        }
    };
    // export it
    FILTER.WEbGLProgram=WEbGLProgram;
    
    
    //
    //
    // Generic WebGL Class
    function WebGL(canvas, options)
    {
        canvas = canvas || createCanvas();
        this._gl=WebGL.getWebGL(canvas, options);
    }
    
    //
    //
    // static methods
    // adapted from Kronos WebGL specifications
    WebGL.getWebGL=function(canvas, opt_attribs) {
        if (!window.WebGLRenderingContext)  return null;

        return WebGL.getContext(canvas, opt_attribs);
    };
    
    // adapted from Kronos WebGL specifications
    WebGL.getContext=function(canvas, opt_attribs) {
        opt_attribs=opt_attribs || { depth: false, alpha: true, premultipliedAlpha: false, antialias: true, stencil: false, preserveDrawingBuffer: false };
        if (!WEBGLNAME)
        {
            var 
                names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"], nl=names.length,
                gl = null, i
            ;
        
            for (i = 0; i <nl; ++i) 
            {
                try {
                    gl = canvas.getContext(names[i], opt_attribs);
                } catch(e) { }
                
                if (gl)  { WEBGLNAME=names[i]; break;}
            }
        }
        else
        {
            gl = canvas.getContext(WEBGLNAME, opt_attribs);
        }
        return gl;
    };
    
    // adapted from Kronos WebGL specifications
    WebGL.getSupportedExtensionWithKnownPrefixes=function(gl, name) {
        var supported = gl.getSupportedExtensions();
        for (var ii = 0; ii < browserPrefixesLength; ++ii) 
        {
            var prefixedName = browserPrefixes[ii] + name;
            if (supported.indexOf(prefixedName) >= 0) 
            {
                return prefixedName;
            }
        }
        return null;
    };

    // adapted from Kronos WebGL specifications
    WebGL.getExtensionWithKnownPrefixes=function(gl, name)  {
        for (var ii = 0; ii < browserPrefixesLength; ++ii) 
        {
            var prefixedName = browserPrefixes[ii] + name;
            var ext = gl.getExtension(prefixedName);
            if (ext) 
            {
                return ext;
            }
        }
        return null;
    };
    
    //
    //
    // instance methods
    WebGL.prototype={
        
        constructor: WebGL,
        
        _gl: null,
        _boundBuffer: null,
        _boundTexture: null,
        _boundFrameBuffer: null,
        _enabledAttributes: {},
        _programs: [],
        _currentProgram: null,
        
        // adapted from Kronos WebGL specifications
        glTypeToArrayBufferType: function(type) {
            var gl=this._gl;
            switch (type) 
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
        },

        getBytesPerComponent: function(type) {
            var gl=this._gl;
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
        },
        
        // adapted from Three.js
        deleteBuffer: function(buffer){
            this._gl.deleteBuffer(buffer);
            return this;
        },

        deleteTexture: function(texture){
            this._gl.deleteTexture( texture );
            return this;
        },

        deleteFramebuffer: function(Framebuffer){
            this._gl.deleteFramebuffer(Framebuffer);
            return this;
        },

        deleteRenderbuffer: function(RenderBuffer){
            this._gl.deleteRenderbuffer(RenderBuffer);
            return this;
        },

        deleteProgram: function(RenderBuffer){
            this._gl.deleteProgram(RenderBuffer);
            return this;
        },
        
        addProgram: function(program) {
            this._programs.push(program);
            return this;
        },
        
        removeProgram: function(program) {
            var i, programs=this._programs, pL=programs.length;
            for (i=0; i<pL; i++)
            {
                if (programs[i]===program)
                {
                    programs.splice(i, 1);
                    return this;
                }
            }
            return this;
        },
        
        removeProgramByIndex: function(i) {
            this._programs.splice(i, 1);
            return this;
        },
        
        useProgram: function(program){
            this._gl.useProgram( program );
            this._currentProgram = {program: program};
            return this;
        },
        
        useProgramByIndex: function(i){
            this._gl.useProgram( this._programs[i].program );
            this._currentProgram = this._programs[i];
            return this;
        },
        
        createBuffer: function(){
            return this._gl.createBuffer();
        },

        setStaticArrayBuffer: function(buffer,data){
            this.bindArrayBuffer( buffer );
            this._gl.bufferData( this._gl.ARRAY_BUFFER, data, this._gl.STATIC_DRAW );
            return this;
        },

        setStaticIndexBuffer: function(buffer,data){
            this.bindElementArrayBuffer( buffer );
            this._gl.bufferData( this._gl.ELEMENT_ARRAY_BUFFER, data, this._gl.STATIC_DRAW );
            return this;
        },

        setDynamicArrayBuffer: function(buffer,data){
            this.bindArrayBuffer( buffer );
            this._gl.bufferData( this._gl.ARRAY_BUFFER, data, this._gl.DYNAMIC_DRAW );
            return this;
        },

        setDynamicIndexBuffer: function(buffer,data){
            this.bindElementArrayBuffer( buffer );
            this._gl.bufferData( this._gl.ELEMENT_ARRAY_BUFFER, data, this._gl.DYNAMIC_DRAW );
            return this;
        },

        drawTriangles: function(count){
            this._gl.drawArrays( this._gl.TRIANGLES, 0, count );
            return this;
        },

        drawTriangleStrip: function(count){
            this._gl.drawArrays( this._gl.TRIANGLE_STRIP, 0, count );
            return this;
        },

        drawLines: function(count){
            this._gl.drawArrays( this._gl.LINES, 0, count );
            return this;
        },

        drawLineStrip: function(count){
            this._gl.drawArrays( this._gl.LINE_STRIP, 0, count );
            return this;
        },

        drawPoints: function(count){
            this._gl.drawArrays( this._gl.POINTS, 0, count );
            return this;
        },

        drawTriangleElements: function(buffer,count,offset){
            this.bindElementArrayBuffer( buffer );
            this._gl.drawElements( this._gl.TRIANGLES, count, this._gl.UNSIGNED_SHORT, offset ); // 2 bytes per Uint16
            return this;
        },

        drawLineElements: function(buffer,count,offset){
            this.bindElementArrayBuffer(  buffer );
            this._gl.drawElements( this._gl.LINES, count, this._gl.UNSIGNED_SHORT, offset ); // 2 bytes per Uint16
            return this;
        },

        bindTexture: function(texBuffer) {
            if (this._boundTexture != texBuffer)
            {
                this._gl.bindTexture(this._gl.TEXTURE_2D, texBuffer);
                this._boundTexture = texBuffer;
            }
            return this;
        },
        
        bindFramebuffer: function(fBuffer){
            if (this._boundFrameBuffer != fBuffer)
            {
                this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, fBuffer);
                this._boundFrameBuffer = fBuffer;
            }
            return this;
        },
        
        bindArrayBuffer: function(buffer){
            if (this._boundBuffer != buffer)
            {
                this._gl.bindBuffer( this._gl.ARRAY_BUFFER, buffer );
                this._boundBuffer = buffer;

            }
            return this;
        },

        bindElementArrayBuffer: function(buffer){
            if (this._boundBuffer != buffer)
            {
                this._gl.bindBuffer( this._gl.ELEMENT_ARRAY_BUFFER, buffer );
                this._boundBuffer = buffer;

            }
            return this;
        },

        enableAttribute: function( attribute ) {
            if ( ! this._enabledAttributes[ attribute ] ) 
            {
                this._gl.enableVertexAttribArray( attribute );
                this._enabledAttributes[ attribute ] = true;
            }
            return this;
        },

        disableAttributes: function() {
            for ( var attribute in this._enabledAttributes ) 
            {
                if ( this._enabledAttributes[ attribute ] ) 
                {
                    this._gl.disableVertexAttribArray( attribute );
                    this._enabledAttributes[ attribute ] = false;
                }
            }
            return this;
        },

        getAttribLocation: function( program, id ) {
            return this._gl.getAttribLocation( program, id );
        },

        setFloatAttribute: function(index, buffer, size, offset){
            this.bindArrayBuffer( buffer );
            this.enableAttribute( index );
            this._gl.vertexAttribPointer( index, size, this._gl.FLOAT, false, 0, offset );
            return this;
        },

        getUniformLocation: function( program, id ) {
            return this._gl.getUniformLocation( program, id );
        },

        uniform1i: function(uniform, value) {
            this._gl.uniform1i( uniform, value );
            return this;
        },

        uniform1f: function(uniform, value) {
            this._gl.uniform1f( uniform, value );
            return this;
        },

        uniform2f: function(uniform,value1, value2) {
            this._gl.uniform2f( uniform, value1, value2 );
            return this;
        },

        uniform3f: function(uniform, value1, value2, value3) {
            this._gl.uniform3f( uniform, value1, value2, value3 );
            return this;
        },

        uniform4f: function(uniform, value1, value2, value3, value4) {
            this._gl.uniform4f( uniform, value1, value2, value3, value4);
            return this;
        },

        uniform1iv: function(uniform,value){
            this._gl.uniform1iv( uniform, value );
            return this;
        },

        uniform2iv: function(uniform, value){
            this._gl.uniform2iv( uniform, value );
            return this;
        },

        uniform3iv: function(uniform, value){
            this._gl.uniform3iv( uniform, value );
            return this;
        },

        uniform1fv: function(uniform, value){
            this._gl.uniform1fv( uniform, value );
            return this;
        },

        uniform2fv: function(uniform, value){
            this._gl.uniform2fv( uniform, value );
            return this;
        },

        uniform3fv: function(uniform, value){
            this._gl.uniform3fv( uniform, value );
            return this;
        },

        uniform4fv: function(uniform, value){
            this._gl.uniform3fv( uniform, value );
            return this;
        },

        uniformMatrix3fv: function(location, value){
            this._gl.uniformMatrix3fv( location, false, value );
            return this;
        },

        uniformMatrix4fv: function(location, value){
            this._gl.uniformMatrix4fv( location, false, value );
            return this;
        },

        setRectangle: function(x, y, w, h) {
            var x1=x, y1=y, x2=x+w, y2=y+h;
            
            this._gl.bufferData(this._gl.ARRAY_BUFFER, new FILTER.Array32F([
                x1, y1,
                x2, y1,
                x1, y2,
                x1, y2,
                x2, y1,
                x2, y2
            ]), this._gl.STATIC_DRAW);
            return this;
        },
        
        setViewport: function(x, y, w, h) {
            this._gl.viewport(x, y, w, h);
            return this;
        },
        
        // adapted from WebGL foundamentals
        loadShader: function(shaderSource, shaderType) {
            var shader, compiled, type, gl=this._gl;
            
            type=("vertex"==shaderType) ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
            
            // Create the shader object
            shader = gl.createShader(type);

            // Load the shader source
            gl.shaderSource(shader, shaderSource);

            // Compile the shader
            gl.compileShader(shader);

            // Check the compile status
            compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
            if (!compiled && !gl.isContextLost()) 
            {
                // Something went wrong during compilation; get the error
                //lastError = gl.getShaderInfoLog(shader);
                gl.deleteShader(shader);
                return null;
            }

            return shader;
        },

        // adapted from Kronos / WebGL foundamentals
        loadTexture: function(image) {
            var texture, gl=this._gl;
            
            // Create and initialize the WebGLTexture object.
            texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // adapted from WebGL foundamentals
            // Set up texture so we can render any size image and so we are
            // working with pixels.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            // make the texture the same size as the image
            //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
           
            // Return the WebGLTexture object immediately.
            return texture;
        },
        
        setTexture: function(texture, unit){
			var gl=this._gl;
            unit=unit||0;
            gl.activeTexture( gl.TEXTURE0 + unit );
			gl.bindTexture( gl.TEXTURE_2D, texture );
            return this;
        },
        
        attachTextures: function(program, textures){
            var i, tL=textures.length, loc, tex, texture, gl=this._gl;
            
            for (i=0; i<tL; i++)
            {
                texture=textures[i];
                
                if (!texture.texture && texture.image)
                    texture.texture=this.loadTexture(texture.image);
                
                if (!texture.texture) continue;
                
                // lookup the sampler locations.
                loc = gl.getUniformLocation(program, texture.name);
                
                // set which texture units to render with.
                gl.uniform1i(loc, i);  // texture unit
                gl.activeTexture( gl.TEXTURE0 + i );
                gl.bindTexture( gl.TEXTURE_2D, texture.texture );
            }
            return this;
        },
        
        // adapted from WebGL foundamentals
        compileProgram: function(shaders, props) {
            var gl=this._gl, program, linked, i, sl=shaders.length, attsL;
            
            program = gl.createProgram();
            
            for (i = 0; i < sl; ++i) 
            {
                gl.attachShader(program, shaders[i]);
            }
            
            if (atts) 
            {
                for (i = 0; i < attsL; ++i) 
                {
                    gl.bindAttribLocation(program,  atts[i].location,  atts[i].value);
                }
            }
            gl.linkProgram(program);

            // Check the link status
            linked = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linked && !gl.isContextLost()) 
            {
                // something went wrong with the link
                //lastError = gl.getProgramInfoLog (program);
                gl.deleteProgram(program);
                return null;
            }
            
            return new WebGLProgram(gl, program);
        }
    };
    // export it
    FILTER.WebGL=WebGL;
    
    var _canvas=createCanvas();
    supportWebGL=WebGL.getWebGL(_canvas);
    supportWebGLSharedResources=supportWebGL && WebGL.getSupportedExtensionWithKnownPrefixes(supportWebGL, "WEBGL_shared_resources");
    FILTER.supportWebGL=false;
    FILTER.supportWebGLSharedResources=false;
    FILTER.useWebGLIfAvailable=function(bool) {
        console.log(supportWebGL);
        FILTER.supportWebGL=(bool && supportWebGL);
    };
    FILTER.useWebGLSharedResourcesIfAvailable=function(bool) {
        console.log(supportWebGLSharedResources);
        FILTER.supportWebGLSharedResources=(bool && supportWebGLSharedResources);
    };
    
    //
    //
    //
    FILTER.WEbGLFilter=function(shader) { this._shader=shader; };
    FILTER.WEbGLFilter.prototype={
        
        constructor: FILTER.WEbGLFilter,
        
        _shaders: null,
        _program: null,
        
        compile: function() {
        },
        
        _apply: function(webgl, w, h, inBuffer, outBuffer) {
            webgl
                useProgram(this._program)
                .bindTexture(inBuffer)
            // make this the framebuffer we are rendering to.
                .bindFramebuffer(outBuffer)
            // Tell the shader the resolution of the framebuffer.
                .uniform2f(resolutionLocation, w, h)
            // Tell webgl the viewport setting needed for framebuffer.
                .viewport(0, 0, w, h)
            // draw
                .drawArrays(6)
            ;
        }
    };
    
    //
    //
    // GLSL Shaders
    FILTER.Shaders={
        
        generic: {
            
            attributes: {
                a_position : {type: "attribute2fv", value: []},
                a_texCoord: {type: "attribute2fv", value: []}
            },
            
            uniforms: {
                u_resolution: {type: "uniform2fv", value: []},
                u_flipY: {type: "uniform1f", value: 0.0}
            },
            
            textures: [
                {name: "u_image", image: null, texture: null}
            ],
            
            vertex: {
                type: "vertex",
                
                source: "\
                    attribute vec2 a_position;\
                    attribute vec2 a_texCoord;\
                    \
                    uniform vec2 u_resolution;\
                    uniform float u_flipY;\
                    \
                    //varying vec2 v_posCoord;\
                    varying vec2 v_texCoord;\
                    \
                    void main() {\
                       // convert the rectangle from pixels to 0.0 to 1.0\
                       vec2 zeroToOne = a_position / u_resolution;\
                       // convert from 0->1 to -1->+1 (clipspace)\
                       vec2 clipSpace = zeroToOne*2.0 - 1.0;\
                        \
                       gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);\
                        \
                       // pass the texCoord to the fragment shader\
                       // The GPU will interpolate this value between points.\
                       v_texCoord = a_texCoord;\
                     }"
            },
                
            // dummy
            fragment: {
                type: "fragment",
                
                source: "\
                    precision mediump float;\
                    \
                    // our texture\
                    uniform sampler2D u_image;\
                    \
                    // the texCoords passed in from the vertex shader.\
                    varying vec2 v_texCoord;\
                    \
                    void main() {\
                        gl_FragColor=texture2D(u_image, v_texCoord);\
                     }"
            }
        },
        
        colorMatrix: {
            
            attributes: null,
            
            uniforms: {
                u_textureSize: {type: "uniform2fv", value: []},
                u_CM: {type: "uniform1f", value: null}
            },
                
            textures: [
                {name: "u_image", image: null, texture: null}
            ],
            
            vertex: null,
            
            fragment: {
                type: "fragment",
                
                source: "\
                    precision mediump float;\
                    \
                    // our texture\
                    uniform sampler2D u_image;\
                    uniform vec2 u_textureSize;\
                    uniform float u_CM[20];\
                    const float norm=0.0039215686274509803921568627451; // 1/255\
                    \
                    // the texCoords passed in from the vertex shader.\
                    varying vec2 v_texCoord;\
                    \
                    void main() {\
                       vec4 rgba =texture2D(u_image, v_texCoord);\
                       float r, g, b, a;\
                       r = dot( vec4( u_CM[0], u_CM[1], u_CM[2], u_CM[3] ), rgba ) + norm*u_CM[4];\
                       g = dot( vec4( u_CM[5], u_CM[6], u_CM[7], u_CM[8] ), rgba ) + norm*u_CM[9];\
                       b = dot( vec4( u_CM[10], u_CM[11], u_CM[12], u_CM[13] ), rgba ) + norm*u_CM[14];\
                       a = dot( vec4( u_CM[15], u_CM[16], u_CM[17], u_CM[18] ), rgba ) + norm*u_CM[19];\
                       gl_FragColor = clamp( vec4(r, g, b, a), 0.0,  1.0);\
                     }"
            }
        },
        
        tableLookup: {
            
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
        },
        
        convolutionMatrix: {
            
            attributes: null,
            
            uniforms: {
                u_textureSize: {type: "uniform2fv", value: []},
                u_coeff: {type: "uniform2fv", value: [1.0, 0.0]},
                u_hasKernel2: {type: "uniform1i", value: 0}
                u_isGrad: {type: "uniform1i", value: 0}
                u_kernelRadius: {type: "uniform1i", value: 0},
                u_kernelSize: {type: "uniform1i", value: 0},
                // http://stackoverflow.com/questions/7709689/webgl-pass-array-shader
                u_kernel: {type: "uniform1f", value: null}
                u_kernel2: {type: "uniform1f", value: null}
            },
                
            textures: [
                {name: "u_image", image: null, texture: null}
            ],
            
            vertex: null,
            
            fragment: {
                type: "fragment",
                
                source: "\
                    precision mediump float;\
                    \
                    // our texture\
                    uniform sampler2D u_image;\
                    uniform vec2 u_textureSize;\
                    uniform vec2 u_coeff;\
                    uniform bool u_hasKernel2;\
                    uniform bool u_isGrad;\
                    uniform int u_kernelRadius;\
                    uniform int u_kernelSize;\
                    const int MAX_KERNEL_SIZE = "+MAX_KERNEL_SIZE+";\
                    uniform float u_kernel[MAX_KERNEL_SIZE];\
                    uniform float u_kernel2[MAX_KERNEL_SIZE];\
                    \
                    // the texCoords passed in from the vertex shader.\
                    varying vec2 v_texCoord;\
                    \
                    void main() {\
                       vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\
                       vec4 tcolor=0;\
                       vec3 kernelSum=0;\
                       vec3 kernelSum2=0;\
                       int i, j, k;\
                       k=0;\
                       // allow to compute second convolution in-parallel (eg Gradients etc..)\
                       if (u_hasKernel2)\
                       {\
                           for (j=-u_kernelRadius; j<=u_kernelRadius; j++)\
                           {\
                               for (i=-u_kernelRadius; i<=u_kernelRadius; i++)\
                               {\
                                   tcolor = texture2D(u_image, v_texCoord + onePixel * vec2(i, j));\
                                   kernelSum += tcolor.rgb * u_kernel[k];\
                                   kernelSum2 += tcolor.rgb * u_kernel2[k];\
                                   k++;\
                               }\
                           }\
                       }\
                       else\
                       {\
                           for (j=-u_kernelRadius; j<=u_kernelRadius; j++)\
                           {\
                               for (i=-u_kernelRadius; i<=u_kernelRadius; i++)\
                               {\
                                   tcolor = texture2D(u_image, v_texCoord + onePixel * vec2(i, j));\
                                   kernelSum += tcolor.rgb * u_kernel[k];\
                                   k++;\
                               }\
                           }\
                       }\
                       if (u_hasKernel2)\
                       {\
                            if (u_isGrad)\
                            {\
                                gl_FragColor = clamp( vec4((abs(kernelSum) + abs(kernelSum2)), texture2D(u_image, v_texCoord).a), 0.0,  1.0);\
                            }\
                            else\
                            {\
                                gl_FragColor = clamp( vec4(((u_coeff[0] * kernelSum) + (u_coeff[1] * kernelSum2)), texture2D(u_image, v_texCoord).a), 0.0,  1.0);\
                            }\
                       }\
                       else\
                       {\
                            gl_FragColor = clamp( vec4(((u_coeff[0] * kernelSum) + u_coeff[1]), texture2D(u_image, v_texCoord).a), 0.0,  1.0);\
                       }\
                     }"
            }
        },
        
        displacementMap: {
            attributes: null,
            
            uniforms: {
                u_start: {type: "uniform2fv", value: []},
                u_scale: {type: "uniform2fv", value: []},
                u_component: {type: "uniform2fv", value: []},
                u_color: {type: "uniform4fv", value: [0.0, 0.0, 0.0, 0.0]},
                u_mode: {type: "uniform1i", value: 1}
            },
            
            textures: [
                {name: "u_image", image: null, texture: null},
                // http://www.john-smith.me/hassles-with-array-access-in-webgl--and-a-couple-of-workarounds
                {name: "u_map", image: null, texture: null}
            ],
            
            vertex: {
                type: "vertex",
                
                source: "\
                    precision mediump float;\
                    \
                    attribute vec2 a_position;\
                    attribute vec2 a_texCoord;\
                    \
                    uniform vec2 u_resolution;\
                    uniform float u_flipY;\
                    \
                    #ifdef VERTEX_TEXTURES\
                    \
                        // our displace map\
                        uniform sampler2D u_map;\
                        uniform vec2 u_start;\
                        uniform vec2 u_scale;\
                        uniform vec2 u_component;\
                        uniform vec4 u_color;\
                        uniform int u_mode;\
                    \
                    #endif\
                    \
                    varying vec2 v_texCoord;\
                    \
                    void main() {\
                       // convert the rectangle from pixels to 0.0 to 1.0\
                       vec2 zeroToOne = a_position / u_resolution;\
                       // convert from 0->1 to 0->2\
                       vec2 zeroToTwo = zeroToOne * 2.0;\
                       // convert from 0->2 to -1->+1 (clipspace)\
                       vec2 clipSpace = zeroToTwo - 1.0;\
                        \
                       #ifdef VERTEX_TEXTURES\
                        \
                            vec4 displaceRGBA = texture2D(u_map, clipSpace);\
                            vec2 displace = vec2(displaceRGBA[u_component.x], displaceRGBA[u_component.y]) - 0.5;\
                            vec2 srcOff = u_start + clipSpace + (displace * u_scale);\
                           if (srcOff.x<-1.0 || srcOff.x>1.0 || srcOff.y<-1.0 || srcOff.y>1.0)\
                           {\
                                if ("+FILTER.MODE.IGNORE+"==u_mode)\
                                {\
                                    // do nothing\
                                    srcOff=clipSpace;\
                                }\
                                //else if ("+FILTER.MODE.COLOR+"==u_mode)\
                                //{\
                                    // do nothing\
                                //}\
                                else if ("+FILTER.MODE.WRAP+"==u_mode)\
                                {\
                                    if (srcOff.y>1.0) srcOff.y-=1.0;\
                                    else if (srcOff.y<-1.0) srcOff.y+=1.0;\
                                    if (srcOff.x>1.0) srcOff.x-=1.0;\
                                    else if (srcOff.x<-1.0)  srcOff.x+=1.0;\
                                }\
                                else //if ("+FILTER.MODE.CLAMP+"==u_mode)\
                                {\
                                    srcOff=clamp(srcOff, -1.0,  1.0);\
                                }\
                           }\
                        \
                        #else\
                        \
                            vec2 srcOff = clipSpace;\
                        \
                        #endif\
                        \
                       gl_Position = vec4(srcOff * vec2(1, u_flipY), 0, 1);\
                        \
                       // pass the texCoord to the fragment shader\
                       // The GPU will interpolate this value between points.\
                       v_texCoord = a_texCoord;\
                    }"
            },
            
            fragment: null
        },
        
        geometricMap: {
            twirl: {
                
                attributes: null,
                
                uniforms: {
                    u_textureSize: {type: "uniform2fv", value: []},
                    u_center: {type: "uniform2fv", value: []},
                    u_angle: {type: "uniform1f", value: 0.0},
                    u_radius: {type: "uniform1f", value: 0.0}
                },
                    
                textures: [
                    {name: "u_image", image: null, texture: null}
                ],
                
                vertex: null,
                
                fragment: {
                    type: "fragment",
                    
                    source: "\
                            precision mediump float;\
                            \
                            // our texture\
                            uniform sampler2D u_image;\
                            uniform vec2 u_textureSize;\
                            uniform vec2 u_center;\
                            uniform float u_angle;\
                            uniform float u_radius;\
                            \
                            // the texCoords passed in from the vertex shader.\
                            varying vec2 v_texCoord;\
                            \
                            void main() {\
                                if (u_radius<=0.0)\
                                {\
                                    gl_FragColor = texture2D(u_image, v_texCoord);\
                                }\
                                else\
                                {\
                                    vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\
                                    vec2 st = v_texCoord * onePixel;\
                                    u_center = u_center * onePixel;\
                                    vec2 txy = st - u_center;\
                                    float d = length(txy);\
                                    float theta = 0.0;\
                                     if (d < u_radius)\
                                     {\
                                        float fact = u_angle/u_radius;\
                                        theta = atan(txy.t, txy.s) + fact*(radius-d);\
                                        txy = u_center + d*vec2(cos(theta), sin(theta));\
                                        gl_FragColor = texture2D(u_image, clamp(txy, 0.0, 1.0));\
                                    }\
                                    else\
                                    {\
                                        gl_FragColor = texture2D(u_image, v_texCoord);\
                                    }\
                             }\
                         }"
                }
            },
            
            sphere: {
                
                attributes: null,
                
                uniforms: {
                    u_textureSize: {type: "uniform2fv", value: []},
                    u_center: {type: "uniform2fv", value: []},
                    u_radius: {type: "uniform1f", value: 0.0}
                },
                    
                textures: [
                    {name: "u_image", image: null, texture: null}
                ],
                
                vertex: null,
                
                fragment: {
                    type: "fragment",
                    
                    source: "\
                            precision mediump float;\
                            \
                            // our texture\
                            uniform sampler2D u_image;\
                            uniform vec2 u_textureSize;\
                            uniform vec2 u_center;\
                            uniform float u_radius;\
                            //const float refraction = 0.555556;\
                            const float invrefraction=0.444444; // 1-refraction\
                            \
                            // the texCoords passed in from the vertex shader.\
                            varying vec2 v_texCoord;\
                            \
                            void main() {\
                                if (u_radius<=0.0)\
                                {\
                                    gl_FragColor = texture2D(u_image, v_texCoord);\
                                }\
                                else \
                                {\
                                    vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\
                                    vec2 st = v_texCoord * onePixel;\
                                    u_center = u_center * onePixel;\
                                    vec2 txy = st - u_center; \
                                    vec2 txy2 = txy * txy;\
                                    float r2 = txy2.x + txy2.y;\
                                    float radius2 = u_radius*u_radius;\
                                    if (r2 < radius2)\
                                    {\
                                        float d2 = radius2 - r2;\
                                        float d = sqrt(d2);\
                                        vec2 theta = vec2(asin(txy.s / sqrt(txy2.x + d2)), asin(txy.t) / sqrt(txy2.y + d2)) * invrefraction;\
                                        txy = st - ds * tan(theta);\
                                        gl_FragColor = texture2D(u_image, clamp(txy, 0.0, 1.0));\
                                    }\
                                    else\
                                    {\
                                        gl_FragColor = texture2D(u_image, v_texCoord);\
                                    }\
                             }\
                         }"
                }
            },
            
            flipX: {
                
                attributes: null,
                
                uniforms: {
                    u_textureSize: {type: "uniform2fv", value: []},
                    u_center: {type: "uniform2fv", value: []},
                    u_radius: {type: "uniform1f", value: 0.0}
                },
                    
                textures: [
                    {name: "u_image", image: null, texture: null}
                ],
                
                vertex: null,
                
                fragment: {
                    type: "fragment",
                    
                    source: "\
                            precision mediump float;\
                            \
                            // our texture\
                            uniform sampler2D u_image;\
                            \
                            // the texCoords passed in from the vertex shader.\
                            varying vec2 v_texCoord;\
                            \
                            void main() {\
                                gl_FragColor = texture2D(u_image, vec2(1.0-v_texCoord.s, v_texCoord.t));\
                         }"
                }
            },
            flipY: {
                
                attributes: null,
                
                uniforms: {
                    u_textureSize: {type: "uniform2fv", value: []},
                    u_center: {type: "uniform2fv", value: []},
                    u_radius: {type: "uniform1f", value: 0.0}
                },
                    
                textures: [
                    {name: "u_image", image: null, texture: null}
                ],
                
                vertex: null,
                
                fragment: {
                    type: "fragment",
                    
                    source: "\
                            precision mediump float;\
                            \
                            // our texture\
                            uniform sampler2D u_image;\
                            \
                            // the texCoords passed in from the vertex shader.\
                            varying vec2 v_texCoord;\
                            \
                            void main() {\
                                gl_FragColor = texture2D(u_image, vec2(v_texCoord.s, 1.0-v_texCoord.t));\
                         }"
                }
            },
            flipXY: {
                
                attributes: null,
                
                uniforms: {
                    u_textureSize: {type: "uniform2fv", value: []},
                    u_center: {type: "uniform2fv", value: []},
                    u_radius: {type: "uniform1f", value: 0.0}
                },
                    
                textures: [
                    {name: "u_image", image: null, texture: null}
                ],
                
                vertex: null,
                
                fragment: {
                    type: "fragment",
                    
                    source: "\
                            precision mediump float;\
                            \
                            // our texture\
                            uniform sampler2D u_image;\
                            \
                            // the texCoords passed in from the vertex shader.\
                            varying vec2 v_texCoord;\
                            \
                            void main() {\
                                gl_FragColor = texture2D(u_image, vec2(1.0-v_texCoord.s, 1.0-v_texCoord.t));\
                         }"
                }
            },
            affine: null
        },
        
        // TODO ??
        statistical: null
    };
    
    
})(FILTER);