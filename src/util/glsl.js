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

GLSL.DEFAULT = FRAGMENT_DEFAULT;

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
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}
function GLSLProgram(fragmentSource, gl)
{
	var self = this, vsh, fsh, a, u;

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
            gl.deleteProgram(self.id);
            self.id = null;
        }
        else
        {
            for (a in self.attribute) self.attribute[a] = gl.getAttribLocation(self.id, a);
            for (u in self.uniform) self.uniform[u] = gl.getUniformLocation(self.id, u);
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
    fragmentSource: null
};
function use(gl, program, filter, w, h)
{
    if (!program.id) return;
    gl.useProgram(program.id);
    setupVars(gl, program, filter, w, h);
};
function setupVars(gl, program, filter, w, h)
{
    if (!program.id) return;

    var floatSize = FILTER.Array32F.BYTES_PER_ELEMENT, vertSize = 4 * floatSize;

    if ('pos' in program.attribute)
    {
        gl.enableVertexAttribArray(program.attribute.pos);
        gl.vertexAttribPointer(program.attribute.pos, 2, gl.FLOAT, false, vertSize , 0 * floatSize);
    }
    if ('uv' in program.attribute)
    {
        gl.enableVertexAttribArray(program.attribute.uv);
        gl.vertexAttribPointer(program.attribute.uv, 2, gl.FLOAT, false, vertSize, 2 * floatSize);
    }
    if (filter.textures) filter.textures(gl, w, h, program);
    if ('dp' in program.uniform)
    {
        gl.uniform2f(program.uniform.dp, 1/w, 1/h);
    }
    if (filter.instance && ('mode' in program.uniform))
    {
        gl.uniform1i(program.uniform.mode, filter.instance.mode);
    }
    if (filter.vars) filter.vars(gl, w, h, program);
}
function getFilterProgram(gl, filter, w, h, programCache)
{
    var shader = filter.shader, program;

    if (!shader) return null;
    shader = trim(shader);
    program = programCache[shader];
    if (!program)
    {
        // new program
        program = programCache[shader] = new GLSLProgram(shader, gl);
    }
    // if valid, use it
    if (program.id) use(gl, program, filter, w, h);
    return program;
}
function createTexture(gl, w, h)
{
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (w && h) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    return tex;
}
function deleteTexture(gl, tex)
{
    if (tex)
    {
        gl.deleteTexture(tex);
        tex = null;
    }
}
function copyTexture(gl, width, height)
{
    var tex = createTexture(gl, width, height);
    gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, width, height, 0);
    return tex;
}
function createFramebufferTexture(gl, w, h)
{
    var tex = createTexture(gl, w, h);

    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return {fbo: fbo, tex: tex};
}
function deleteFramebuffer(gl, fbo)
{
    if (fbo)
    {
        gl.deleteFramebuffer(fbo);
        fbo = null;
    }
}
function deleteFramebufferTexture(gl, buf)
{
    if (buf)
    {
        deleteFramebuffer(gl, buf.fbo)
        deleteTexture(gl, buf.tex);
        buf = null;
    }
}
function uploadTexture(gl, pixels, width, height, index, useSub, tex)
{
    tex = tex || createTexture(gl, width, height);
    if (null != index)
    {
        gl.activeTexture(gl.TEXTURE0 + index);
        gl.bindTexture(gl.TEXTURE_2D, tex);
    }
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
    return tex;
}
function getPixels(gl, width, height, pixels)
{
    pixels = pixels || new FILTER.ImArray((width * height) << 2);
                    //x, y, width, height, format, type, pixels
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return pixels;
}
function prepareGL(img)
{
    if (img.glCanvas)
    {
        var gl, ws, hs, DPR = 1/*FILTER.devicePixelRatio*/;
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

        gl = FILTER.getGL(img.glCanvas);

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
		}
        else
        {
			gl.bindBuffer(gl.ARRAY_BUFFER, img.glVex);
        }
        gl.viewport(0, 0, img.glCanvas.width, img.glCanvas.height);
        // clear canvas
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        return gl;
    }
}
function runOne(gl, glsl, cache, w, h, input, output, prev, flipY)
{
    var program = getFilterProgram(gl, glsl, w, h, cache);
    if (program)
    {
        var i, src, dst, buf0, buf1, t, prevUnit = 1, flip = false,
            iterations = glsl.iterations || 1, last = iterations - 1;
        for (i=0; i<iterations; ++i)
        {
            if (0 === i)
            {
                src = input;
            }
            else
            {
                buf0 = buf0 || createFramebufferTexture(gl, w, h);
                src = buf0;
            }
            if (i === last)
            {
                dst = output;
                flip = flipY;
            }
            else
            {
                buf1 = buf1 || createFramebufferTexture(gl, w, h);
                dst = buf1;
            }
            gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
            gl.viewport(0, 0, w, h);
            gl.uniform1f(program.uniform.flipY, flip ? -1 : 1);
            if ('img_prev_prev' in program.uniform)
            {
                if (!('img' in program.uniform) && !('img_prev' in program.uniform))
                {
                    gl.activeTexture(gl.TEXTURE0 + 0);
                    gl.bindTexture(gl.TEXTURE_2D, src.tex);
                    gl.uniform1i(program.uniform.img_prev, 0);
                }
                else if (prev[1])
                {
                    gl.activeTexture(gl.TEXTURE0 + prevUnit + 1);
                    gl.bindTexture(gl.TEXTURE_2D, prev[1]);
                    gl.uniform1i(program.uniform.img_prev_prev, prevUnit + 1);
                }
            }
            if ('img_prev' in program.uniform)
            {
                if (!('img' in program.uniform))
                {
                    gl.activeTexture(gl.TEXTURE0 + 0);
                    gl.bindTexture(gl.TEXTURE_2D, src.tex);
                    gl.uniform1i(program.uniform.img_prev, 0);
                }
                else if (prev[0])
                {
                    gl.activeTexture(gl.TEXTURE0 + prevUnit + 0);
                    gl.bindTexture(gl.TEXTURE_2D, prev[0]);
                    gl.uniform1i(program.uniform.img_prev, prevUnit + 0);
                }
            }
            if ('img' in program.uniform)
            {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, src.tex);
                gl.uniform1i(program.uniform.img, 0);
            }
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            // swap buffers
            t = buf0; buf0 = buf1; buf1 = t;
        }
        deleteFramebufferTexture(gl, buf0);
        deleteFramebufferTexture(gl, buf1);
        return true;
    }
    return false;
}
GLSL.run = function(img, glsls, data, metaData) {
    var gl = prepareGL(img), input, output,
        i, n = glsls.length, glsl,
        src, dst, buf0, buf1,
        im, w, h, cache, im0, t,
        fromshader = false, first = -1, last = -1,
        prev = [null, null], flipY = false;
    if (!gl) return;
    im = data[0];
    w = data[1];
    h = data[2];
    cache = img.cache;
    input = uploadTexture(gl, im, w, h, 0/*, img.glTex*/);
    output = null;
    for (i=0; i<n; ++i)
    {
        if (glsls[i].shader && 0 > first) first = i;
        if (glsls[n-1-i].shader && 0 > last) last = n-1-i;
    }
    if (0 < last)
    {
        glsls.splice(++last, 0, {shader:FRAGMENT_DEFAULT});
        ++n;
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
                buf0 = buf0 || createFramebufferTexture(gl, w, h);
                src = buf0;
            }
            if (!fromshader && 0 < i) uploadTexture(gl, im, w, h, 0, 0, src);
            if (i === last)
            {
                dst = {fbo: output, tex: output};
                flipY = true;
            }
            else
            {
                buf1 = buf1 || createFramebufferTexture(gl, w, h);
                dst = buf1;
            }
            runOne(gl, glsl, cache, w, h, src, dst, prev, flipY);
            // swap buffers
            t = buf0; buf0 = buf1; buf1 = t;
            // store previous frames
            deleteTexture(gl, prev[1]);
            prev[1] = prev[0];
            prev[0] = copyTexture(gl, w, h);
            fromshader = true;
        }
        else if (glsl.instance && glsl.instance._apply)
        {
            im0 = fromshader ? getPixels(gl, w, h) : im;
            im = glsl.instance._apply(im0, w, h, metaData);
            fromshader = false;
            prev = [null, null];
            flipY = false;
        }
    }
    if (fromshader) getPixels(gl, w, h, im)
    deleteFramebufferTexture(gl, buf0);
    deleteFramebufferTexture(gl, buf1);
    return im;
};
GLSL.uploadTexture = uploadTexture;
GLSL.getPixels = getPixels;
GLSL.formatFloat = function(x, signed) {
    var s = x.toString();
    return (signed ? (0 > x ? '' : '+') : '') + s + (-1 === s.indexOf('.') ? '.0' : '');
};
GLSL.formatInt = function(x, signed) {
    x = stdMath.floor(x);
    return (signed ? (0 > x ? '' : '+') : '') + x.toString();
};
FILTER.Util.GLSL = GLSL;

}(FILTER);