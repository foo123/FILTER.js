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
    var supportWebGL=false, WEBGLNAME=null,
        createCanvas=FILTER.createCanvas
        ;
    
    // http://www.khronos.org/webgl/wiki/Main_Page
    // http://www.html5rocks.com/en/tutorials/webgl/webgl_fundamentals/
    
    //
    //
    // Generic WebGL Class
    function WebGL(canvas, options)
    {
        if (canvas)
            this._gl=WebGL.getWebGL(canvas, options);
    }
    
    //
    //
    // static methods
    // adapted from Kronos WebGL specifications
    WebGL.getWebGL=function(canvas, opt_attribs) {
        if (!window.WebGLRenderingContext)  return null;

        return WebGL.getGLContext(canvas, opt_attribs);
    };
    
    // adapted from Kronos WebGL specifications
    WebGL.getGLContext=function(canvas, opt_attribs) {
        opt_attribs=opt_attribs || { depth: false, alpha: true, premultipliedAlpha: false/*, antialias: true, stencil: false, preserveDrawingBuffer: false*/ };
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
    
    //
    //
    // instance methods
    WebGL.prototype={
        
        _gl: null,
        _boundBuffer: null,
        _enabledAttributes: {},
        
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

        getAttribLocation: function( program, id ){
            return this._gl.getAttribLocation( program, id );
        },

        setFloatAttribute: function(index,buffer,size,offset){
            this.bindArrayBuffer( buffer );
            this.enableAttribute( index );
            this._gl.vertexAttribPointer( index, size, this._gl.FLOAT, false, 0, offset );
            return this;
        },

        getUniformLocation: function( program, id ){
            return this._gl.getUniformLocation( program, id );
        },

        uniform1i: function(uniform,value){
            this._gl.uniform1i( uniform, value );
            return this;
        },

        uniform1f: function(uniform,value){
            this._gl.uniform1f( uniform, value );
            return this;
        },

        uniform2f: function(uniform,value1, value2){
            this._gl.uniform2f( uniform, value1, value2 );
            return this;
        },

        uniform3f: function(uniform, value1, value2, value3){
            this._gl.uniform3f( uniform, value1, value2, value3 );
            return this;
        },

        uniform4f: function(uniform, value1, value2, value3, value4){
            this._gl.uniform4f( uniform, value1, value2, value3, value4);
            return this;
        },

        uniform1iv: function(uniform,value){
            this._gl.uniform1iv( uniform, value );
            return this;
        },

        uniform2iv: function(uniform,value){
            this._gl.uniform2iv( uniform, value );
            return this;
        },

        uniform3iv: function(uniform,value){
            this._gl.uniform3iv( uniform, value );
            return this;
        },

        uniform1fv: function(uniform,value){
            this._gl.uniform1fv( uniform, value );
            return this;
        },

        uniform2fv: function(uniform,value){
            this._gl.uniform2fv( uniform, value );
            return this;
        },

        uniform3fv: function(uniform,value){
            this._gl.uniform3fv( uniform, value );
            return this;
        },

        uniform4fv: function(uniform,value){
            this._gl.uniform3fv( uniform, value );
            return this;
        },

        uniformMatrix3fv: function(location,value){
            this._gl.uniformMatrix3fv( location, false, value );
            return this;
        },

        uniformMatrix4fv: function(location,value){
            this._gl.uniformMatrix4fv( location, false, value );
            return this;
        },

        useProgram: function(program){
            this._gl.useProgram( program );
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
			unit=unit||0;
            this._gl.activeTexture( this._gl.TEXTURE0 + unit );
			this._gl.bindTexture( this._gl.TEXTURE_2D, texture );
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
            
            return program;
        }
    };
    FILTER.WebGL=WebGL;
    
    supportWebGL=WebGL.getWebGL(createCanvas());
    FILTER.supportWebGL=false;
    FILTER.useWebGLIfAvailable=function(bool) {
        console.log(supportWebGL);
        FILTER.supportWebGL=(bool && supportWebGL);
    };
    
    
    //
    //
    //  GLSL Shaders
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
                       gl_Position = vec4(clipSpace * vec2(1, u_flipY), 0, 1);\
                        \
                       // pass the texCoord to the fragment shader\
                       // The GPU will interpolate this value between points.\
                       v_texCoord = a_texCoord;\
                    }\
                    "
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
                    void main() { gl_FragColor=texture2D(u_image, v_texCoord); }\
                    "
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
                    \
                    // the texCoords passed in from the vertex shader.\
                    varying vec2 v_texCoord;\
                    \
                    void main() {\
                       vec4 rgba =texture2D(u_image, v_texCoord);\
                       float r;\
                       float g;\
                       float b;\
                       float a;\
                       r=u_CM[0]*rgba.r + u_CM[1]*rgba.g +  u_CM[2]*rgba.b + u_CM[3]*rgba.a + u_CM[4];\
                       g=u_CM[5]*rgba.r + u_CM[6]*rgba.g +  u_CM[7]*rgba.b + u_CM[8]*rgba.a + u_CM[9];\
                       b=u_CM[10]*rgba.r + u_CM[11]*rgba.g +  u_CM[12]*rgba.b + u_CM[13]*rgba.a + u_CM[14];\
                       a=u_CM[15]*rgba.r + u_CM[16]*rgba.g +  u_CM[17]*rgba.b + u_CM[18]*rgba.a + u_CM[19];\
                       gl_FragColor = vec4(r, g, b, a);\
                    }\
                    "
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
                    }\
                    "
            }
        },
        
        convolutionMatrix: {
            
            attributes: null,
            
            uniforms: {
                u_textureSize: {type: "uniform2fv", value: []},
                u_factor: {type: "uniform1f", value: 1.0},
                u_bias: {type: "uniform1f", value: 0.0},
                u_kernelRadius: {type: "uniform1i", value: 0},
                // http://stackoverflow.com/questions/7709689/webgl-pass-array-shader
                u_kernel: {type: "uniform1f", value: null}
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
                    uniform float u_factor;\
                    uniform float u_bias;\
                    uniform int u_kernelRadius;\
                    const int MAX_KERNEL_SIZE = 121;\
                    uniform float u_kernel[MAX_KERNEL_SIZE];\
                    \
                    // the texCoords passed in from the vertex shader.\
                    varying vec2 v_texCoord;\
                    \
                    void main() {\
                       vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;\
                       vec4 colorSum =0;\
                       int i, j, k;\
                       k=0;\
                       for (j=-u_kernelRadius; j<=u_kernelRadius; j++)\
                       {\
                           for (i=-u_kernelRadius; i<=u_kernelRadius; i++)\
                           {\
                               colorSum += texture2D(u_image, v_texCoord + onePixel * vec2(i, j)) * u_kernel[k];\
                               k++;\
                           }\
                       }\
                       gl_FragColor = vec4(((u_factor * colorSum) + u_bias).rgb, texture2D(u_image, v_texCoord).a);\
                    }\
                    "
            }
        },
        
        displacementMap: {
            attributes: null,
            
            uniforms: {
                u_start: {type: "uniform2fv", value: []},
                u_scale: {type: "uniform2fv", value: []},
                u_component: {type: "uniform2fv", value: []},
                u_color: {type: "uniform1f", value: []},
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
                                    srcOff=clamp(srcOff, vec2(-1.0, -1.0), vec2(1.0, 1.0));\
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
                    }\
                    "
            },
            
            fragment: null
        },
        
        // TODO
        geometricMap: null,
        
        statistical: null
    };
    
    
})(FILTER);