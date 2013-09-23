/**
*
* WebGL Color Matrix Filter
* @package FILTER.js
*
**/
(function(FILTER){

    var cmShaders= [
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
    ],
    
    cmAttributes= [
        {name: "a_position", type: "attribute2fv", location: null, value: null},
        {name: "a_texCoord", type: "attribute2fv", location: null, value: null}
    ],
    
    cmUniforms= [
        {name: "u_resolution", type: "uniform2fv", location: null, value: null},
        {name: "u_flipY", type: "uniform1f", location: null, value: 0.0},
        {name: "u_textureSize", type: "uniform2fv", location: null, value: null},
        {name: "u_CM[0]", type: "uniform1f", location: null, value: null}
    ];
        
    //
    //
    // ColorMatrix WebGL Filter
    FILTER.WebGLColorMatrixFilter=function() 
    { 
        this.id='WGLDM1'; //FILTER.getId();
    };
    FILTER.WebGLColorMatrixFilter.prototype={
        
        constructor: FILTER.WebGLColorMatrixFilter,
        
        id: 0,
        
        filterParams: null, 
        
        textures: [
            {name: "u_image", image: null, location: null, texture: null}
        ],
            
        _getProgram: FILTER.WebGLFilter.prototype._getProgram,
        
        _apply: function(webgl, w, h, inBuffer, outBuffer) {
            var webglprogram=this._getProgram(webgl, cmShaders, cmUniforms, this.textures);
            webgl.useStoredProgram(webglprogram.setUniformValues(this.filterParams));
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
    
    // export an instance
    FILTER.WebGLColorMatrixFilterInstance=new FILTER.WebGLColorMatrixFilter();
    
})(FILTER);