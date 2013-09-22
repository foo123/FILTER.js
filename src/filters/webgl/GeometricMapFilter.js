/**
*
* WebGL Geometric Map Filter
* @package FILTER.js
*
**/
(function(FILTER){

    var twirlShaders= [
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
    ],
    
    attributes= [
        {name: "a_position", type: "attribute2fv", location: null, value: null},
        {name: "a_texCoord", type: "attribute2fv", location: null, value: null}
    ],
    
    twirlUniforms= [
        {name: "u_resolution", type: "uniform2fv", location: null, value: null},
        {name: "u_flipY", type: "uniform1f", location: null, value: 0.0},
        {name: "u_textureSize", type: "uniform2fv", location: null, value: null},
        {name: "u_center", type: "uniform2fv", location: null, value: null},
        {name: "u_angle", type: "uniform2fv", location: null, value: null},
        {name: "u_radius", type: "uniform1f", location: null, value: 0.0}
    ],
    
    sphereShaders= [
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
    ],
            
    sphereUniforms= [
        {name: "u_resolution", type: "uniform2fv", location: null, value: null},
        {name: "u_flipY", type: "uniform1f", location: null, value: 0.0},
        {name: "u_textureSize", type: "uniform2fv", location: null, value: null},
        {name: "u_center", type: "uniform2fv", location: null, value: null},
        {name: "u_radius", type: "uniform1f", location: null, value: 0.0}
    ],
    
    flipxShaders= [
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
                    \
                    // the texCoords passed in from the vertex shader.\
                    varying vec2 v_texCoord;\
                    \
                    void main() {\
                        gl_FragColor = texture2D(u_image, vec2(1.0-v_texCoord.s, v_texCoord.t));\
                 }"
        }
    ],
    
    flipxUniforms= [
        {name: "u_resolution", type: "uniform2fv", location: null, value: null},
        {name: "u_flipY", type: "uniform1f", location: null, value: 0.0}
    ],
    
    flipyShaders= [
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
                    \
                    // the texCoords passed in from the vertex shader.\
                    varying vec2 v_texCoord;\
                    \
                    void main() {\
                        gl_FragColor = texture2D(u_image, vec2(v_texCoord.s, 1.0-v_texCoord.t));\
                 }"
        }
    ],
    
    flipyUniforms= [
        {name: "u_resolution", type: "uniform2fv", location: null, value: null},
        {name: "u_flipY", type: "uniform1f", location: null, value: 0.0}
    ],
    
    flipxyShaders= [
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
                    \
                    // the texCoords passed in from the vertex shader.\
                    varying vec2 v_texCoord;\
                    \
                    void main() {\
                        gl_FragColor = texture2D(u_image, vec2(1.0-v_texCoord.s, 1.0-v_texCoord.t));\
                 }"
        }
    ],
    
    flipxyUniforms= [
        {name: "u_resolution", type: "uniform2fv", location: null, value: null},
        {name: "u_flipY", type: "uniform1f", location: null, value: 0.0}
    ];
    
    
    //
    //
    // GeometricMap WebGL Filter
    FILTER.WebGLGeometricMapFilter=function(type) 
    { 
        this.id=FILTER.getId();
    };
    FILTER.WebGLGeometricMapFilter.prototype={
        
        constructor: FILTER.WebGLGeometricMapFilter,
        
        id: 0,
        
        filterParams: null, 
        
        textures: [
            {name: "u_image", image: null, location: null, texture: null}
        ],
            
        _getProgram: FILTER.WebGLFilter.prototype._getProgram,
        
        _apply: function(filterParams, webgl, w, h, inBuffer, outBuffer) {
            switch(type)
            {
                case "twirl":
                    var webglprogram=this._getProgram(webgl, twirlShaders, twirlUniforms, this.textures);
                    break;
                case "sphere":
                    var webglprogram=this._getProgram(webgl, sphereShaders, sphereUniforms, this.textures);
                    break;
                case "flipx":
                    var webglprogram=this._getProgram(webgl, flipxShaders, flipxUniforms, this.textures);
                    break;
                case "flipy":
                    var webglprogram=this._getProgram(webgl, flipyShaders, flipyUniforms, this.textures);
                    break;
                case "flipxy":
                    var webglprogram=this._getProgram(webgl, flipxyShaders, flipxyUniforms, this.textures);
                    break;
                default
                    var webglprogram=null;
                    break;
            }
            webgl.useStoredProgram(webglprogram.setUniformValues(filterParams));
            webgl.bindTexture(inBuffer);
            if (outBuffer)
                // make this the framebuffer we are rendering to.
                webgl.bindFramebuffer(outBuffer);
            // Tell webgl the viewport setting needed for framebuffer.
            webgl
                .viewport(0, 0, w, h)
            // draw
                .drawArrays(6)
            ;
        },
        
        apply: function(image) {
            this._apply(image.webgl, image.width, image.height, image.canvasElement, null);
            return image;
        }
    };
    
})(FILTER);