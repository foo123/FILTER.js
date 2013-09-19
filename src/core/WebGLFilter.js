/**
*
* WebGLFilter Auxilliary
* @package FILTER.js
*
**/
(function(FILTER){

    //
    //
    // WebGL Support
    var supportWebGL=false, WEBGLNAME=null,
        devicePixelRatio = window.devicePixelRatio || 1
        ;
    
    function createCanvas(w, h)
    {
        var canvas=document.createElement('canvas');
        w=w||0; h=h||0; //canvas.width=w||0; canvas.height=h||0;
        
        // set the display size of the canvas.
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
         
        // set the size of the drawingBuffer
        canvas.width = w * devicePixelRatio;
        canvas.height = h * devicePixelRatio;
        
        return canvas;
    }
    
    // adapted from Kronos WebGL specifications
    function getWebGL(canvas, opt_attribs) 
    {
        if (!window.WebGLRenderingContext)  return null;

        return getGLContext(canvas, opt_attribs);
    };
    
    // adapted from Kronos WebGL specifications
    function getGLContext(canvas, opt_attribs) 
    {
        opt_attribs=opt_attribs || null;
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
    }
    
    
    // adapted from WebGL foundamentals
    function getShader(gl, shaderSource, shaderType) 
    {
        var shader, compiled;
        
        // Create the shader object
        shader = gl.createShader(shaderType);

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
    }

    // adapted from Kronos / WebGL foundamentals
    function getTexture(gl, image) 
    {
        var texture;
        
        // Create and initialize the WebGLTexture object.
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        // adapted from WebGL foundamentals
        // Set up texture so we can render any size image and so we are
        // working with pixels.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        // make the texture the same size as the image
        //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, image.width, image.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
       
        // Return the WebGLTexture object immediately.
        return texture;
    }
    
    // adapted from WebGL foundamentals
    function getProgram(gl, shaders, opt_attribs, opt_locations) 
    {
        var program, linked, i, sl=shaders.length, optl=opt_attribs.length;
        
        program = gl.createProgram();
        
        for (i = 0; i < sl; ++i) 
        {
            gl.attachShader(program, shaders[i]);
        }
        
        if (opt_attribs) 
        {
            for (i = 0; i < optl; ++i) 
            {
                gl.bindAttribLocation(program,  opt_locations ? opt_locations[i] : i,  opt_attribs[i]);
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
    
    function setRectangle(gl, x, y, w, h) 
    {
        var x1=x, y1=y, x2=x+w, y2=y+h;
        
        gl.bufferData(gl.ARRAY_BUFFER, new FILTER.Array32F([
            x1, y1,
            x2, y1,
            x1, y2,
            x1, y2,
            x2, y1,
            x2, y2
        ]), gl.STATIC_DRAW);
    }

    supportWebGL=getWebGL(createCanvas());
    FILTER.supportWebGL=false;
    FILTER.createCanvas=createCanvas;
    FILTER.getWebGL=getWebGL;
    FILTER.getGLContext=getGLContext;
    FILTER.getShader=getShader;
    FILTER.getTexture=getTexture;
    FILTER.getProgram=getProgram;
    FILTER.setRectangle=setRectangle;
    FILTER.useWebGLIfAvailable=function(bool) {
        FILTER.supportWebGL=(bool && supportWebGL);
    };
    
    //
    //
    //  GLSL Shaders
    FILTER.Shaders={
        
        generic: {
            
            vertex: 
                "\
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
                ",
                
            fragment: null
        },
        
        colorMatrix: {
            
            vertex: null,
            
            fragment: "\
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
                   float r,g,b,a;\
                   r=u_CM[0]*rgba.r + u_CM[1]*rgba.g +  u_CM[2]*rgba.b + u_CM[3]*rgba.a + u_CM[4];\
                   g=u_CM[5]*rgba.r + u_CM[6]*rgba.g +  u_CM[7]*rgba.b + u_CM[8]*rgba.a + u_CM[9];\
                   b=u_CM[10]*rgba.r + u_CM[11]*rgba.g +  u_CM[12]*rgba.b + u_CM[13]*rgba.a + u_CM[14];\
                   a=u_CM[15]*rgba.r + u_CM[16]*rgba.g +  u_CM[17]*rgba.b + u_CM[18]*rgba.a + u_CM[19];\
                   gl_FragColor = vec4(r, g, b, a);\
                }\
                "
        },
        
        tableLookup: {
            
            vertex: null,
            
            fragment: "\
                precision mediump float;\
                \
                // our texture\
                uniform sampler2D u_image;\
                uniform vec2 u_textureSize;\
                uniform float u_TR[256];\
                uniform float u_TG[256];\
                uniform float u_TB[256];\
                \
                // the texCoords passed in from the vertex shader.\
                varying vec2 v_texCoord;\
                \
                void main() {\
                   vec4 rgba =texture2D(u_image, v_texCoord);\
                   float r,g,b;\
                   r=u_TR[round(rgba.r*255)];\
                   g=u_TG[round(rgba.g*255)];\
                   b=u_TB[round(rgba.b*255)];\
                   gl_FragColor = vec4(r, g, b, rgba.a);\
                }\
                "
        },
        
        convolutionMatrix: {
            
            vertex: null,
            
            fragment: "\
                precision mediump float;\
                \
                // our texture\
                uniform sampler2D u_image;\
                uniform vec2 u_textureSize;\
                uniform float u_factor;\
                uniform float u_bias;\
                uniform float u_kernelRadius;\
                uniform float u_kernel[];\
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
        },
        
        // TODO
        displacementMap: null,
        
        geometricMap: null,
        
        statistical: null
    }
    
})(FILTER);