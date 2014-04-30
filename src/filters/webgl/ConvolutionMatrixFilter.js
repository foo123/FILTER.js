/**
*
* WebGL Convolution Matrix Filter
* @package FILTER.js
*
**/
!function(FILTER, undef){

    @@USE_STRICT@@
    
    var MAX_KERNEL_SIZE=121,
    
        convolutionShaders= [
            {
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
            {
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
                    uniform int u_kernelRadiusX;\
                    uniform int u_kernelRadiusY;\
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
                           for (j=-u_kernelRadius; j<=u_kernelRadiusY; j++)\
                           {\
                               for (i=-u_kernelRadius; i<=u_kernelRadiusX; i++)\
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
    ],

    convolutionAttributes= [
        {name: "a_position", size: 2, type: "FLOAT", location: null, value: null},
        {name: "a_texCoord", size: 2, type: "FLOAT", location: null, value: null}
    ],
    
    convolutionUniforms= [
        {name: "u_resolution", type: "uniform2fv", location: null, value: null},
        {name: "u_flipY", type: "uniform1f", location: null, value: 0.0},
        {name: "u_textureSize", type: "uniform2fv", location: null, value: null},
        {name: "u_coeff", type: "uniform2fv", location: null, value: null},
        {name: "u_hasKernel2", type: "uniform1i", location: null, value: 0},
        {name: "u_isGrad", type: "uniform1i", location: null, value: 0},
        {name: "u_kernelRadiusX", type: "uniform1i", location: null, value: 0},
        {name: "u_kernelRadiusY", type: "uniform1i", location: null, value: 0},
        {name: "u_kernelSize", type: "uniform1i", location: null, value: 0},
        // http://stackoverflow.com/questions/7709689/webgl-pass-array-shader
        {name: "u_kernel[0]", type: "uniform1f", location: null, value: null},
        {name: "u_kernel2[0]", type: "uniform1f", location: null, value: null}
    ],
    
    texture={name: "u_image", image: null, location: null, texture: null}
    ;
        
    
    //
    //
    // ConvolutionMatrix WebGL Filter (IN PROGRESS!!)
    var WebGLConvolutionMatrixFilter = FILTER.WebGLConvolutionMatrixFilter = FILTER.Class( FILTER.WebGLFilter, {
        
        name : "WebGLConvolutionMatrixFilter",
        
        constructor : function() { 
            this.id='WGLCM2'; //FILTER.uuid();
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
    
    // export an instance
    FILTER.WebGLConvolutionMatrixFilterInstance=new WebGLConvolutionMatrixFilter();
    
}(FILTER);