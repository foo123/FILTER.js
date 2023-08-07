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
    'varying vec2 pix;',
    'uniform float flipY;',
    'void main(void) {',
        'pix = uv;',
        'gl_Position = vec4(pos.x, pos.y*flipY, 0.0, 1.);',
    '}'
	].join('\n')),
	FRAGMENT_DEFAULT = trim([
    'precision highp float;',
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'void main(void) {',
        'gl_FragColor = texture2D(img, pix);',
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

        if (filter.textures) filter.textures(gl, w, h, self);
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
        if (filter.instance && ('mode' in self.uniform))
        {
            gl.uniform1i(self.uniform.mode, filter.instance.mode);
        }
        if (filter.vars) filter.vars(gl, w, h, self);
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
            program.use(gl).vars(gl, filter, w, h);
        }
        return programCache[shader] = program;
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
            xs = DPR*stdMath.floor(xs*fx); ys = DPR*stdMath.floor(ys*fy);
            xf = DPR*stdMath.floor(xf*fx); yf = DPR*stdMath.floor(yf*fy);
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
GLSL.uploadTexture = function(gl, pixels, width, height, index, useSub, tex) {
    tex = tex || GLSL.createTexture(gl);
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
GLSL.createFramebufferTexture = function(gl) {
    var fbo, renderbuffer, tex;
    fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    renderbuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);

    tex = GLSL.createTexture(gl);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    return {fbo: fbo, tex: tex};
};
GLSL.runOne = function(gl, glsl, cache, w, h, input, output, flipY, metaData, prev) {
    var prog = GLSL.Program.getFromFilter(gl, glsl, w, h, cache);
    if (prog)
    {
        var i, src, dst, t, iterations = glsl.iterations || 1, last = iterations - 1;
        for (i=0; i<iterations; ++i)
        {
            if (0 === i)
            {
                src = input;
            }
            else
            {
                cache['buf2'] = cache['buf2'] || GLSL.createFramebufferTexture(gl);
                src = cache['buf2'];
            }
            if (i === last)
            {
                dst = output;
            }
            else
            {
                cache['buf3'] = cache['buf3'] || GLSL.createFramebufferTexture(gl);
                dst = cache['buf3'];
            }
            if (output === dst)
            {
                gl.uniform1f(prog.uniform.flipY, flipY ? -1 : 1);
            }
            else
            {
                gl.uniform1f(prog.uniform.flipY, 1);
            }
            if (('img_prev' in prog.uniform) && prev[0])
            {
                gl.activeTexture(gl.TEXTURE0 + 1);
                gl.bindTexture(gl.TEXTURE_2D, prev[0].tex);
                gl.uniform1i(prog.uniform.img_prev, 1);
            }
            if (('img_prev_prev' in prog.uniform) && prev[1])
            {
                gl.activeTexture(gl.TEXTURE0 + 2);
                gl.bindTexture(gl.TEXTURE_2D, prev[1].tex);
                gl.uniform1i(prog.uniform.img_prev_prev, 2);
            }
            if ('img' in prog.uniform)
            {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, src.tex);
                gl.uniform1i(prog.uniform.img, 0);
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            // swap buffers
            t = cache['buf2'];
            cache['buf2'] = cache['buf3'];
            cache['buf3'] = t;
        }
        return true;
    }
    return false;
};
GLSL.run = function(gl, glsls, cache, im, w, h, input, output, flipY, metaData) {
    var i, n = glsls.length, glsl, src, dst, im0, tex,
        fromshader = false, first = -1, last = -1, t, prev = [null, null, null];
    for (i=0; i<n; ++i)
    {
        if (glsls[i].shader && 0 > first) first = i;
        if (glsls[n-1-i].shader && 0 > last) last = n-1-i;
    }
    for (i=0; i<n; ++i)
    {
        glsl = glsls[i];
        if (glsl.shader)
        {
            if (i === first)
            {
                src = {fbo: input, tex: input};
            }
            else
            {
                cache['buf0'] = cache['buf0'] || GLSL.createFramebufferTexture(gl);
                src = cache['buf0'];
            }
            if (!fromshader && 0 < i) GLSL.uploadTexture(gl, im, w, h, 0, 0, src.tex);
            if (i === last)
            {
                dst = {fbo: output, tex: output};
            }
            else
            {
                cache['buf1'] = cache['buf1'] || GLSL.createFramebufferTexture(gl);
                dst = cache['buf1'];
            }
            GLSL.runOne(gl, glsl, cache, w, h, src, dst, i === last ? flipY : false, metaData, prev);
            // swap buffers
            t = cache['buf0'];
            cache['buf0'] = cache['buf1'];
            cache['buf1'] = t;
            // store previous textures
            prev[2] = prev[1];
            prev[1] = prev[0];
            prev[0] = src;
            fromshader = true;
        }
        else if (glsl.instance && glsl.instance._apply)
        {
            im0 = fromshader ? GLSL.getPixels(gl, w, h) : im;
            im = glsl.instance._apply(im0, w, h, metaData);
            fromshader = false;
        }
    }
    if (fromshader) GLSL.getPixels(gl, w, h, im)
    return im;
};
GLSL.getPixels = function(gl, width, height, pixels) {
    pixels = pixels || new FILTER.ImArray((width * height) << 2);
                    //x, y, width, height, format, type, pixels
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return pixels;
};
FILTER.Util.GLSL = GLSL;

}(FILTER);