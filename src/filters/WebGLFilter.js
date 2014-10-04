/**
*
* WebGLFilter Classes
* @package FILTER.js
*
**/
!function(FILTER, undef){
    
    @@USE_STRICT@@
    
    // IN PROGRESS, TODO
    
    //
    //
    // WebGL Support
    var supportWebGL=false, supportWebGLSharedResources=false,  WEBGLNAME=null,
        createCanvas=FILTER.createCanvas
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
    var WebGLProgram = FILTER.WebGLProgram = FILTER.Class({
    
        constructor : function(webgl, id, program, attributes, uniforms, textures)  {
            var self = this;
            self.id=id || 0;
            self._attributes = [];
            self._uniforms = [];
            self._textures = [];
            self.setContainer(webgl);
            self.setProgram(program);
            if (attributes)  self.setAttributes(attributes);
            if (uniforms)  self.setUniforms(uniforms);
            if (textures) self.setTextures(textures);
        },
        
        glContainer : null,
        _gl : null,
        
        program: null,
        
        _shaders: null,
        _attributes: null,
        _uniforms: null,
        _textures: null,
        _attributesNeedUpdate: false,
        _uniformsNeedUpdate: false,
        _texturesNeedUpdate: false,
        
        dispose: function() {
            var self = this;
            self._gl.deleteProgram(self.program);
            self.program=null;
            self._attributes=null;
            self._uniforms=null;
            self._textures=null;
            self._attributesNeedUpdate=false;
            self._uniformsNeedUpdate=false;
            self._texturesNeedUpdate=false;
            return self;
        },
        
        use: function() {
            this._gl.useProgram(this.program);
            return this;
        },
        
        setContainer: function(webgl) {
            var self = this;
            if (webgl)
            {
                self.glContainer=webgl;
                self._gl=webgl._gl;
                self._attributesNeedUpdate=true;
                self._uniformsNeedUpdate=true;
                self._texturesNeedUpdate=true;
            }
            return self;
        },
        
        setProgram: function(program) {
            var self = this;
            if (program)
            {
                self.program=program;
                self._attributesNeedUpdate=true;
                self._uniformsNeedUpdate=true;
                self._texturesNeedUpdate=true;
            }
            return self;
        },
        
        setAttributes: function(attributes) {
            var self = this;
            if (attributes)
            {
                self._attributes=attributes;
                self.updateAttributeLocations();
                self._attributesNeedUpdate=false;
            }
            return self;
        },
        
        setUniforms: function(uniforms) {
            var self = this;
            if (uniforms)
            {
                self._uniforms=uniforms;
                self.updateUniformLocations();
                self._uniformsNeedUpdate=false;
            }
            return self;
        },
        
        setTextures: function(textures) {
            var self = this;
            if (textures)
            {
                self._textures=textures;
                self.updateTextureLocations();
                self._texturesNeedUpdate=false;
            }
            return self;
        },
        
        enableAttributes: function(buffers) {
            if (!buffers) return this;
            
            if (this._attributesNeedUpdate) this.updateAttributeLocations();
            
            var gl=this._gl,
                a=this._attributes, aL=Math.min(a.length, buffers.length), 
                i, buffer;
            
            for (i=0; i<aL; i++)
            {
                if (!a[i].enabled)
                {
                    // should re-create buffer every time ??
                    if (!a[i].buffer)  a[i].buffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, a[i].buffer);
                    gl.bufferData(gl.ARRAY_BUFFER, buffers[i].buffer, gl.STATIC_DRAW);
                    gl.enableVertexAttribArray(a[i].location);
                    gl.vertexAttribPointer(a[i].location, a[i].size, gl[a[i].type], false, 0, 0);
                    a[i].enabled=true;
                }
            }
            return this;
        },
        
        disableAttributes: function() {
            var gl=this._gl,
                a=this._attributes, aL=a.length, i;
            
            for (i=0; i<aL; i++)
            {
                if (a[i].enabled)
                {
                    // should delete buffer every time ??
                    //if (a[i].buffer)  gl.deleteBuffer(a[i].buffer)
                    gl.disableVertexAttribArray(a[i].location);
                    a[i].enabled=false;
                }
            }
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
            
            var gl=this._gl, i, t=this._textures, l=Math.min(textures.length, t.length);
            for (i=0; i<l; i++)  
            {
                // set which texture units to render with.
                gl.uniform1i(t[i].location, i);  // texture unit
                gl.activeTexture( gl.TEXTURE0 + i );
                gl.bindTexture( gl.TEXTURE_2D, textures[i] );
            }
            
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
            return this._gl.getUniformLocation(this.program, uniformName);
        },
        
        getUniformLocations: function(uniformNames) {
            var gl=this._gl, i, nL=uniformNames.length, locations=new Array(nL), prg=this.program;
            for (i=0; i<nL; i++)  locations[i]=gl.getUniformLocation(prg, uniformNames[i]);
            return locations;
        },
        
        updateAttributeLocations: function() {
            var gl=this._gl, i, a=this._attributes, aL=a.length, prg=this.program;
            for (i=0; i<aL; i++)  a[i].location=gl.getAttribLocation(prg, a[i].name);
            this._attributesNeedUpdate=false;
            return this;
        },
        
        updateUniformLocations: function() {
            var gl=this._gl, i, u=this._uniforms, uL=u.length, prg=this.program;
            for (i=0; i<uL; i++)  u[i].location=gl.getUniformLocation(prg, u[i].name);
            this._uniformsNeedUpdate=false;
            return this;
        },
        
        updateTextureLocations: function() {
            var gl=this._gl, i, t=this._textures, tL=t.length, prg=this.program;
            for (i=0; i<tL; i++)  t[i].location=gl.getUniformLocation(prg, t[i].name);
            this._texturesNeedUpdate=false;
            return this;
        },
        
        setUniformByLocation: function(uniformLocation, uniformValue, uniformType) {
            var gl=this._gl;
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
            var uniformLocation = this._gl.getUniformLocation(this.program, uniformName);
            this.setUniformByLocation(uniformLocation, uniformValue, uniformType);
            return this;
        }
    });
    
    
    //
    //
    // Generic WebGL Class
    var WebGL = FILTER.WebGL = FILTER.Class({
        
        constructor: function(canvas, options)  {
            canvas = canvas || createCanvas();
            this._programs = [];
            this._gl=WebGL.getWebGL(canvas, options);
        },
        
        _gl: null,
        _boundFB: null,
        _programs: null,
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
        },
        
        useProgram: function(program) {
            this._gl.useProgram( program );
            return this;
        },
        
        deleteProgram: function(RenderBuffer) {
            this._gl.deleteProgram(RenderBuffer);
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
                    this._currentProgramIndex = i;
                    this._currentProgram = this._programs[i];
                    this._currentProgram.use();
                    return this;
                }
            }
            return this;
        },
        
        switchToStoredProgram: function(webglprogram) {
            if (this._currentProgram)
            {
                this._currentProgram.disableAttributes();
            }
            return this.useStoredProgram(webglprogram);
        },
        
        useStoredProgramById: function(id){
            var i, programs=this._programs, pL=programs.length;
            for (i=0; i<pL; i++)
            {
                if (programs[i].id===id)
                {
                    this._currentProgramIndex = i;
                    this._currentProgram = this._programs[i];
                    this._currentProgram.use();
                    return this;
                }
            }
            return this;
        },
        
        switchToStoredProgramById: function(id) {
            if (this._currentProgram)
            {
                this._currentProgram.disableAttributes();
            }
            return this.useStoredProgramById(id);
        },
        
        useStoredProgramByIndex: function(i){
            this._currentProgramIndex = i;
            this._currentProgram = this._programs[i];
            this._currentProgram.use();
            return this;
        },
        
        switchToStoredProgramByIndex: function(i) {
            if (this._currentProgram)
            {
                this._currentProgram.disableAttributes();
            }
            return this.useStoredProgramByIndex(i);
        },
        
        createBuffer: function() {
            return this._gl.createBuffer();
        },

        bindBuffer: function(buffer) {
            this._gl.bindBuffer( this._gl.ARRAY_BUFFER, buffer );
            return this;
        },

        bindElementArrayBuffer: function(buffer) {
            this._gl.bindBuffer( this._gl.ELEMENT_ARRAY_BUFFER, buffer );
            return this;
        },

        disposeBuffer: function(buffer) {
            this._gl.deleteBuffer(buffer);
            buffer=null;
            return this;
        },

        createFramebuffer: function() {
            return this._gl.createFramebuffer();
        },

        bindFramebuffer: function(fb) {
            this._gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
            return this;
        },
        
        disposeFramebuffer: function(fb) {
            this._gl.deleteFramebuffer(fb);
            fb=null;
            return this;
        },

        /*createRenderbuffer: function() {
            return this._gl.createRenderbuffer();
        },

        bindRenderbuffer: function(rb) {
            this._gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
            return this;
        },
        
        disposeRenderbuffer: function(rb) {
            this._gl.deleteRenderbuffer(rb);
            return this;
        },*/

        setStaticArrayBuffer: function(buffer, data) {
            var gl=this._gl;
            this.bindBuffer( buffer );
            gl.bufferData( gl.ARRAY_BUFFER, data, gl.STATIC_DRAW );
            return this;
        },

        setStaticIndexBuffer: function(buffer, data){
            var gl=this._gl;
            this.bindElementArrayBuffer( buffer );
            gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW );
            return this;
        },

        setDynamicArrayBuffer: function(buffer, data){
            var gl=this._gl;
            this.bindBuffer( buffer );
            gl.bufferData( gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW );
            return this;
        },

        setDynamicIndexBuffer: function(buffer, data){
            var gl=this._gl;
            this.bindElementArrayBuffer( buffer );
            gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, data, gl.DYNAMIC_DRAW );
            return this;
        },

        createTextureFramebuffer: function(w, h) {
            var gl=this._gl, texture, buffer;
            fbuffer = gl.createFramebuffer();
            //bind framebuffer to texture
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbuffer);
            texture = this.createTexture(w, h);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            // restore default framebuffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            
            return {
                texture: texture,
                buffer: fbuffer,
                width: w, height: h
            };
        },
        
        disposeTextureFramebuffer: function(fb) {
            var gl=this._gl;
            gl.deleteTexture(fb.texture);
            gl.deleteFramebuffer(fb.buffer);
            fb.texture=null; fb.buffer=null; fb=null;
            return this;
        },
        
        createTexture: function(w, h, image) {
            var gl=this._gl, texture;
            image=image || null;
            // Create and initialize the WebGLTexture object.
            texture = gl.createTexture();
            //set properties for the texture
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
            // restore default texture
            gl.bindTexture(gl.TEXTURE_2D, null);
            
            return texture;
        },

        bindTexture: function(tex) {
            if (this._boundTex!=tex)
            {
                this._gl.bindTexture(this._gl.TEXTURE_2D, tex);
                this._boundTex=tex;
            }
            return this;
        },
        
        setTexture: function(texture, unit) {
            var gl=this._gl;
            unit=unit||0;
            gl.activeTexture( gl.TEXTURE0 + unit );
            gl.bindTexture( gl.TEXTURE_2D, texture );
            return this;
        },
        
        setTextureFrameBuffer: function(fb) {
            if (fb)
            {
                var gl=this._gl;
                if (this._boundFB!=fb)
                {
                    gl.bindFramebuffer(gl.FRAMEBUFFER, fb.buffer);
                    gl.viewport(0, 0, fb.width, fb.height);
                    this._boundFB=fb;
                }
            }
            return this;
        },
        
        getDefaultTextureFrameBuffer: function(w, h) {
            return {texture: null, buffer: null, width:w, height: h};
        },
        
        disposeTexture: function(texture) {
            var gl=this._gl;
            gl.deleteTexture(texture);
            texture=null;
            return this;
        },
        
        getAttribLocation: function( program, id ) {
            return this._gl.getAttribLocation( program, id );
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
        
        clear: function() {
            this._gl.clear(this._gl.COLOR_BUFFER_BIT | this._gl.DEPTH_BUFFER_BIT);
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
        }
    });
    //
    //
    // static methods
    
    // adapted from Kronos WebGL specifications
    WebGL.getWebGL = function(canvas, opt_attribs) {
        if (!window.WebGLRenderingContext)  return null;

        return WebGL.getContext(canvas, opt_attribs);
    };
    
    // adapted from Kronos WebGL specifications
    WebGL.getContext = function(canvas, opt_attribs) {
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
    WebGL.getSupportedExtensionWithKnownPrefixes = function(gl, name) {
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
    WebGL.getExtensionWithKnownPrefixes = function(gl, name)  {
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
    // Generic WebGL Filter
    var WebGLFilter = FILTER.WebGLFilter = FILTER.Class( FILTER.Filter, {
        
        name : "GenericWebGLFilter",
        
        constructor: function(shaders, attributes, uniforms, textures) { 
            var self = this;
            self.$super('constructor');
            self.shaders=shaders || null; 
            self.attributes=attributes || null; 
            self.uniforms=uniforms || null; 
            self.textures=textures || null; 
            self.id=FILTER.getId();
        },
        
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
        
        _apply: function(webgl, w, h, inTexture, outBuffer) {
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
            var 
                webgl=image.webgl, w=image.width, h=image.height,
                inBuffer=webgl.createTextureFramebuffer(w, h, image.canvasElement),
                outBuffer=webgl.getDefaultTextureFrameBuffer(w, h)
            ;
            this._apply(webgl, w, h, inBuffer, outBuffer);
            return image;
        }
    });
    
    
    //
    //
    // GLSL Shaders
    /*
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
    */
    
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
    
}(FILTER);