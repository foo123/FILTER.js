/**
*
* WebGL Displacement Map Filter
* @package FILTER.js
*
**/
!function(FILTER, undef){

    @@USE_STRICT@@
    
    var dmShaders= [
        {
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
                    gl_FragColor=texture2D(u_image, v_texCoord);\
                }"
        }
    ],
    
    dmAttributes= [
        {name: "a_position", size: 2, type: "FLOAT", location: null, value: null},
        {name: "a_texCoord", size: 2, type: "FLOAT", location: null, value: null}
    ],
    
    dmUniforms= [
        {name: "u_resolution", type: "uniform2fv", location: null, value: null},
        {name: "u_flipY", type: "uniform1f", location: null, value: 0.0},
        {name: "u_start", type: "uniform2fv", location: null, value: null},
        {name: "u_scale", type: "uniform2fv", location: null, value: null},
        {name: "u_component", type: "uniform2fv", location: null, value: null},
        {name: "u_color", type: "uniform4fv", location: null, value: [0.0, 0.0, 0.0, 0.0]},
        {name: "u_mode", type: "uniform1i", location: null, value: 1},
        // http://www.john-smith.me/hassles-with-array-access-in-webgl--and-a-couple-of-workarounds
        {name: "u_map", image: null, location: null, texture: null, isTexture: true}
    ],
    
    texture={name: "u_image", image: null, location: null, texture: null}
    ;
    
    //
    //
    // DisplacementMap WebGL Filter  (IN PROGRESS!!)
    var WebGLDisplacementMapFilter = FILTER.WebGLDisplacementMapFilter = FILTER.Class( FILTER.WebGLFilter,
    {
        
        name : "WebGLDisplacementMapFilter",
        
        constructor : function() { 
            this.id='WGLDM4'; //FILTER.uuid();
        },
        
        filterParams : null, 
        
        _apply : function(webgl, w, h, inBuffer, outBuffer) {
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
    
}(FILTER);