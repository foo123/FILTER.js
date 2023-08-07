/**
*
* Filter GLSL Utils
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var proto = 'prototype',
    stdMath = Math,
    trim = FILTER.Util.String.trim,
    GLSL = FILTER.Util.GLSL || {},
	VERTEX_DEAULT = trim([
    'precision highp float;',
    'attribute vec2 pos;',
    'attribute vec2 uv;',
    'varying vec2 vUv;',
    'uniform float flipY;',
    'void main(void) {',
        'vUv = uv;',
        'gl_Position = vec4(pos.x, pos.y*flipY, 0.0, 1.);',
    '}'
	].join('\n')),
	FRAGMENT_DEFAULT = trim([
    'precision highp float;',
    'varying vec2 vUv;',
    'uniform sampler2D texture;',
    'void main(void) {',
        'gl_FragColor = texture2D(texture, vUv);',
    '}',
	].join('\n'))
;

function extract(source, type, store)
{
    var r = new RegExp('\\b' + type + '\\s+\\w+\\s+(\\w+)', 'ig');
    source.replace(r, function(match, varName) {
        store[varName] = 0;
        return match;
    });
    return store;
}
function compile(gl, source, type)
{
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        FILTER.error(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}
function GLSLProgram(fragmentSource, gl)
{
	var self = this, vsh, fsh;

    self.vertexSource = VERTEX_DEAULT;
    self.fragmentSource = fragmentSource;

    self.uniform = {};
    self.attribute = {};
    // extract attributes
    extract(self.vertexSource, 'attribute', self.attribute);
    // extract uniforms
    extract(self.vertexSource, 'uniform', self.uniform);
    extract(self.fragmentSource, 'uniform', self.uniform);

    vsh = compile(gl, self.vertexSource, gl.VERTEX_SHADER);
    fsh = vsh ? compile(gl, self.fragmentSource, gl.FRAGMENT_SHADER) : null;
    if (vsh && fsh)
    {
        self.id = gl.createProgram();
        gl.attachShader(self.id, vsh);
        gl.attachShader(self.id, fsh);
        gl.linkProgram(self.id);
        if (!gl.getProgramParameter(self.id, gl.LINK_STATUS))
        {
            FILTER.error(gl.getProgramInfoLog(self.id));
            self.id = null;
        }
    }
    // release references
    vsh = fsh = gl = null;
}
GLSLProgram[proto] = {
    constructor: GLSLProgram,
    id: null,
    uniform: null,
	attribute: null,
    vertexSource: null,
    fragmentSource: null,
    use: function(gl) {
        var self = this;
        if (self.id) gl.useProgram(self.id);
        return self;
    },
    vars: function(gl, filter, w, h) {
        var self = this, a, u, floatSize, vertSize;
        if (!self.id) return self;

        for (a in self.attribute) self.attribute[a] = gl.getAttribLocation(self.id, a);
        for (u in self.uniform) self.uniform[u] = gl.getUniformLocation(self.id, u);

        floatSize = FILTER.Array32F.BYTES_PER_ELEMENT;
        vertSize = 4 * floatSize;

        if ('pos' in self.attribute)
        {
            gl.enableVertexAttribArray(self.attribute.pos);
            gl.vertexAttribPointer(self.attribute.pos, 2, gl.FLOAT, false, vertSize , 0 * floatSize);
        }
        if ('uv' in self.attribute)
        {
            gl.enableVertexAttribArray(self.attribute.uv);
            gl.vertexAttribPointer(self.attribute.uv, 2, gl.FLOAT, false, vertSize, 2 * floatSize);
        }
        if ('dp' in self.uniform)
        {
            gl.uniform2f(self.uniform.dp, 1/w, 1/h);
        }
        if ('texture' in self.uniform)
        {
             gl.uniform1i(self.uniform.texture, 0);  // texture unit 0
        }
        if (filter && ('mode' in self.uniform))
        {
            gl.uniform1i(self.uniform.mode, filter.mode);
        }
        return self;
    }
};
function getFilterProgram(gl, filter, w, h, programCache)
{
    var shader = filter.shader, program;

    if (!shader) return null;

    shader = trim(shader);

    if (program = programCache[shader])
    {
        // existing program
        if (!program.id) return null;
        program.use(gl);
        return program;
    }
    else
    {
        // new program
        program = new GLSLProgram(shader, gl);
        if (program.id)
        {
            program.use(gl).vars(gl, filter.instance, w, h);
            if (filter.vars) filter.vars(gl, w, h, program);
        }
        return programCache[fragmentSource] = program;
    }
}
GLSLProgram.getFromFilter = getFilterProgram;
GLSL.Program = GLSLProgram;
GLSL.DEFAULT = FRAGMENT_DEFAULT;
GLSL.formatFloat = function(x, signed) {
    var s = x.toString();
    return (signed ? (0 > x ? '' : '+') : '') + s + (-1 === s.indexOf('.') ? '.0' : '');
};
GLSL.formatInt = function(x, signed) {
    x = stdMath.floor(x);
    return (signed ? (0 > x ? '' : '+') : '') + x.toString();
};
GLSL.prepareImgForGL = function(img) {
    if (img.glCanvas)
    {
        var ws, hs, DPR = 1/*FILTER.devicePixelRatio*/;
        if (img.selection)
        {
            var sel = img.selection,
                ow = img.width-1,
                oh = img.height-1,
                xs = sel[0],
                ys = sel[1],
                xf = sel[2],
                yf = sel[3],
                fx = sel[4] ? ow : 1,
                fy = sel[4] ? oh : 1;
            xs = DPR*Floor(xs*fx); ys = DPR*Floor(ys*fy);
            xf = DPR*Floor(xf*fx); yf = DPR*Floor(yf*fy);
            ws = xf-xs+DPR; hs = yf-ys+DPR;
        }
        else
        {
            ws = img.oCanvas.width;
            hs = img.oCanvas.height;
        }
        if (img.glCanvas.width !== ws)
            img.glCanvas.width = ws;
        if (img.glCanvas.height !== hs)
            img.glCanvas.height = hs;
        var gl = FILTER.getGL(img.glCanvas);
		if (!img.glVex)
        {
			// Create the vertex buffer for two triangles [x, y, u, v] * 6
			img.glVex = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, img.glVex);
			gl.bufferData(gl.ARRAY_BUFFER, new FILTER.Array32F([
            -1, -1, 0, 1,
             1, -1, 1, 1,
            -1,  1, 0, 0,
            -1,  1, 0, 0,
             1, -1, 1, 1,
             1,  1, 1, 0
			]), gl.STATIC_DRAW);
			// Note sure if this is a good idea; at least it makes texture loading in Ejecta instant.
			//gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
		}
		gl.viewport(0, 0, img.glCanvas.width, img.glCanvas.height);
        return gl;
    }
};
GLSL.createTexture = function(gl) {
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
};
GLSL.uploadTexture = function(gl, pixels, width, height, index, useSub) {
    var tex = GLSL.createTexture();
    if (useSub)
    {
                    // target, level, xoffset, yoffset, width, height, format, type, pixels
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }
    else
    {
                    // target, level, internalformat, width, height, border, format, type, pixels
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }
    index = +(index || 0);
    gl.activeTexture(gl.TEXTURE0 + index);
    gl.bindTexture(gl.TEXTURE_2D, tex);
  return tex;
};
GLSL.createFramebufferTexture = function(gl, width, height) {
    var fbo, renderbuffer, texture;
    fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

    texture = GLSL.createTexture();
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return {fbo: fbo, texture: texture};
};
GLSL.draw = function(gl, input, output, flipY) {
    gl.bindTexture(gl.TEXTURE_2D, input);
    gl.bindFramebuffer(gl.FRAMEBUFFER, output);
    gl.uniform1f(prog.uniform.flipY, flipY ? -1 : 1);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
};
GLSL.getPixels = function(gl, width, height, pixels) {
    pixels = pixels || new FILTER.Arrray8U((width * height) << 2);
                    //x, y, width, height, format, type, pixels
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return pixels;
};
FILTER.Util.GLSL = GLSL;

}(FILTER);