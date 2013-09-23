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
    function WebGLProgram(webgl, id, program, attributes, uniforms, textures)  
    {
        this.glContainer=webgl || null;
        this.id=id || 0;
        this.program=program || null;
        if (attributes)
            this.setAttributes(attributes);
        if (uniforms)
            this.setUniforms(uniforms);
        if (textures)
            this.setTextures(textures);
    }
    WebGLProgram.prototype={
    
        constructor: WebGLProgram,
        
        glContainer: null,
        
        id: 0,
        
        program: null,
        
        _shaders: null,
        _attributes: null,
        _uniforms: null,
        _textures: null,
        _attributesNeedUpdate: false,
        _uniformsNeedUpdate: false,
        _texturesNeedUpdate: false,
        
        dispose: function() {
            this.glContainer._gl.deleteProgram(this.program);
            this.program=null;
            this._uniforms=null;
            this._textures=null;
            return this;
        },
        
        setContainer: function(webgl) {
            this.glContainer=webgl;
            this._uniformsNeedUpdate=true;
            this._texturesNeedUpdate=true;
            return this;
        },
        
        setProgram: function(program) {
            this.program=program;
            this._uniformsNeedUpdate=true;
            this._texturesNeedUpdate=true;
            return this;
        },
        
        setAttributes: function(attributes) {
            if (attributes)
            {
                this._attributes=attributes;
                this.updateAttributeLocations();
                this._attributesNeedUpdate=false;
            }
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
        
        setTextures: function(textures) {
            if (textures)
            {
                this._textures=textures;
                this.updateTextureLocations();
                this._texturesNeedUpdate=false;
            }
            return this;
        },
        
        enableAttributes: function() {
            var gl=this.glContainer._gl;
            // this process is hard-coded for now
            var positionLocation=this._attributes[0].location,
                texCoordLocation=this._attributes[1].location;
                
            // provide texture coordinates for the rectangle.
            var texCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new FILTER.Array32F([
                0.0,  0.0,
                1.0,  0.0,
                0.0,  1.0,
                0.0,  1.0,
                1.0,  0.0,
                1.0,  1.0]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(texCoordLocation);
            gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
            
            // Create a buffer for the position of the rectangle corners.
            var buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            return this;
        },
        
        setUniformValues: function(values) {
            if (!values)  return this;
            
            if (this._uniformsNeedUpdate) this.updateUniformLocations();
            
            var i, u=this._uniforms, l=Math.min(values.length, u.length);
            for (i=0; i<l; i++)  this.setUniformByLocation(u[i].location, values[i], u[i].type);
            
            return this;
        },
        
        attachTextures: function(textures) {
            if (!textures)  return this;
            
            if (this._texturesNeedUpdate) this.updateTextureLocations();
            
            var gl=this.glContainer._gl, i, t=this._textures, l=Math.min(textures.length, t.length);
            for (i=0; i<l; i++)  
            {
                // set which texture units to render with.
                gl.uniform1i(t[i].location, i);  // texture unit
                gl.activeTexture( gl.TEXTURE0 + i );
                gl.bindTexture( gl.TEXTURE_2D, textures[i] );
            }
            
            return this;
        },
        
        deleteProgram: function() {
            this.glContainer._gl.deleteProgram(this.program);
            this.program=null;
            this._uniforms=null;
            this._textures=null;
            return this;
        },
        
        useProgram: function() {
            this.glContainer._gl.useProgram(this.program);
            return this;
        },
        
        getCachedUniformLocation: function(uniformName) {
            var i, u=this._uniforms, l=u.length;
            for (i=0; i<l i++)
            {
                if (u[i].name==uniformName) return u[i].location;
            }
            return null;
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
        
        updateAttributeLocations: function() {
            var gl=this.glContainer._gl, i, a=this._attributes, aL=a.length, prg=this.program;
            for (i=0; i<aL; i++)  a[i].location=gl.getAttribLocation(prg, a[i].name);
            this._attributesNeedUpdate=false;
            return this;
        },
        
        updateUniformLocations: function() {
            var gl=this.glContainer._gl, i, u=this._uniforms, uL=u.length, prg=this.program;
            for (i=0; i<uL; i++)  u[i].location=gl.getUniformLocation(prg, u[i].name);
            this._uniformsNeedUpdate=false;
            return this;
        },
        
        updateTextureLocations: function() {
            var gl=this.glContainer._gl, i, t=this._textures, tL=t.length, prg=this.program;
            for (i=0; i<tL; i++)  t[i].location=gl.getUniformLocation(prg, t[i].name);
            this._texturesNeedUpdate=false;
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
            var uniformLocation = this.glContainer._gl.getUniformLocation(this.program, uniformName);
            this.setUniformByLocation(uniformLocation, uniformValue, uniformType);
            return this;
        }
    };
    // export it
    FILTER.WebGLProgram=WebGLProgram;
    
    
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
        _currentProgramIndex: -1,
        
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
        
        useProgram: function(program){
            this._gl.useProgram( program );
            return this;
        },
        
        addProgram: function(webglprogram) {
            this._programs.push(webglprogram);
            return this;
        },
        
        getProgramById: function(id) {
            var i, programs=this._programs, pL=programs.length;
            for (i=0; i<pL; i++)
            {
                if (programs[i].id===id)
                {
                    return programs[i];
                }
            }
            return null;
        },
        
        removeProgram: function(webglprogram) {
            var i, programs=this._programs, pL=programs.length;
            for (i=0; i<pL; i++)
            {
                if (programs[i]===webglprogram)
                {
                    programs.splice(i, 1);
                    return this;
                }
            }
            return this;
        },
        
        removeProgramById: function(id) {
            var i, programs=this._programs, pL=programs.length;
            for (i=0; i<pL; i++)
            {
                if (programs[i].id===id)
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
        
        useStoredProgram: function(webglprogram){
            var i, programs=this._programs, pL=programs.length;
            for (i=0; i<pL; i++)
            {
                if (programs[i]===webglprogram)
                {
                    this._currentProgram = this._programs[i];
                    this._currentProgramIndex = i;
                    this._gl.useProgram( this._programs[i].program );
                    return this;
                }
            }
            return this;
        },
        
        useStoredProgramById: function(id){
            var i, programs=this._programs, pL=programs.length;
            for (i=0; i<pL; i++)
            {
                if (programs[i].id===id)
                {
                    this._currentProgram = this._programs[i];
                    this._currentProgramIndex = i;
                    this._gl.useProgram( this._programs[i].program );
                    return this;
                }
            }
            return this;
        },
        
        useStoredProgramByIndex: function(i){
            this._currentProgram = this._programs[i];
            this._currentProgramIndex = i;
            this._gl.useProgram( this._programs[i].program );
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

        setFloatAttribute: function(index, buffer, size, offset) {
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

        uniform1iv: function(uniform,value) {
            this._gl.uniform1iv( uniform, value );
            return this;
        },

        uniform2iv: function(uniform, value) {
            this._gl.uniform2iv( uniform, value );
            return this;
        },

        uniform3iv: function(uniform, value) {
            this._gl.uniform3iv( uniform, value );
            return this;
        },

        uniform1fv: function(uniform, value) {
            this._gl.uniform1fv( uniform, value );
            return this;
        },

        uniform2fv: function(uniform, value) {
            this._gl.uniform2fv( uniform, value );
            return this;
        },

        uniform3fv: function(uniform, value) {
            this._gl.uniform3fv( uniform, value );
            return this;
        },

        uniform4fv: function(uniform, value) {
            this._gl.uniform3fv( uniform, value );
            return this;
        },

        uniformMatrix3fv: function(location, value) {
            this._gl.uniformMatrix3fv( location, false, value );
            return this;
        },

        uniformMatrix4fv: function(location, value) {
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
                FILTER.error(gl.getShaderInfoLog(shader));
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
        
        // adapted from WebGL foundamentals
        compileProgram: function(id, shaders, props) {
            var gl=this._gl, program, linked, i, sl=shaders.length;
            
            program = gl.createProgram();
            
            for (i = 0; i < sl; ++i)  gl.attachShader(program, shaders[i]);
            gl.linkProgram(program);

            // Check the link status
            linked = gl.getProgramParameter(program, gl.LINK_STATUS);
            if (!linked && !gl.isContextLost()) 
            {
                // something went wrong with the link
                FILTER.error(gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                return null;
            }
            var webglprogram=new WebGLProgram(this, id, program, props.attributes, props.uniforms, props.textures);
            
            /*
            if (props)
                webglprogram.setAttributes(props.attributes).setUniforms(props.uniforms).setTextures(props.textures);
            */
            
            return webglprogram;
        }
    };
    // export it
    FILTER.WebGL=WebGL;
    
    var _canvas, _isInit=false;
    function webGLInit()
    {
        if (_isInit) return;
        _canvas=createCanvas();
        supportWebGL=WebGL.getWebGL(_canvas);
        supportWebGLSharedResources=supportWebGL && WebGL.getSupportedExtensionWithKnownPrefixes(supportWebGL, "WEBGL_shared_resources");
        _isInit=true;
    }
    FILTER.useWebGL=false;
    FILTER.useWebGLSharedResources=false;
    FILTER.useWebGLIfAvailable=function(bool) {
        if (!_isInit) webGLInit();
        FILTER.useWebGL=(bool && supportWebGL) ? true : false;
        if (bool && !supportWebGL)
            FILTER.warning('WebGL is NOT supported, fallback to default Canvas API');
    };
    FILTER.useWebGLSharedResourcesIfAvailable=function(bool) {
        if (!_isInit) webGLInit();
        FILTER.useWebGLSharedResources=(bool && supportWebGLSharedResources) ? true : false;
        if (bool && !supportWebGLSharedResources)
            FILTER.warning('WebGL Shared Resources are NOT supported, fallback to non-shared resources');
    };
    
    //
    //
    // Generic WebGL Filter
    FILTER.WebGLFilter=function(shaders, attributes, uniforms, textures) 
    { 
        this.shaders=shaders || null; 
        this.attributes=attributes || null; 
        this.uniforms=uniforms || null; 
        this.textures=textures || null; 
        this.id=FILTER.getId();
    };
    FILTER.WebGLFilter.prototype={
        
        constructor: FILTER.WebGLFilter,
        
        id: 0,
        
        filterParams: null,
        
        triangles: 6,
        
        shaders: null,
        attributes: null,
        uniforms: null,
        textures: null,
        
        _getProgram: function(webgl, shaders, attributes, uniforms, textures) {
            var webglprogram=webgl.getProgramById(this.id);
            if (!webglprogram)
            {
                var i, sL=shaders.length, compiledShaders=new Array(sL);
                for (i=0; i<sL; i++)
                    compiledShaders[i]=webgl.loadShader(shaders[i].source, shaders[i].type);
                
                webglprogram=webgl.compileProgram(this.id, compiledShaders, {attributes: attributes, uniforms: uniforms, textures: textures});
                webgl.addProgram(webglprogram);
            }
            return webglprogram;
        },
        
        _apply: function(webgl, w, h, inBuffer, outBuffer) {
            var webglprogram=this._getProgram(webgl, this.shaders, this.attributes, this.uniforms, this.textures);
            webgl.useStoredProgram(webglprogram);
            webglprogram.enableAttributes().setUniformValues(this.filterParams);
            webgl.bindTexture(inBuffer);
            if (outBuffer)
                // make this the framebuffer we are rendering to.
                webgl.bindFramebuffer(outBuffer);
            webgl.viewport(0, 0, w, h).drawArrays(this.triangles);
        },
        
        apply: function(image) {
            this._apply(image.webgl, image.width, image.height, image.canvasElement, null);
            return image;
        }
    };
    
    
    //
    //
    // GLSL Shaders
    FILTER.Shaders={
        
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
        }
    };
    
    
})(FILTER);