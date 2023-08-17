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
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'attribute vec2 pos;',
    'attribute vec2 uv;',
    'uniform vec2 resolution;',
    'uniform float flipY;',
    'varying vec2 pix;',
    'void main(void) {',
        'vec2 zeroToOne = pos / resolution;',
        'vec2 zeroToTwo = zeroToOne * 2.0;',
        'vec2 clipSpace = zeroToTwo - 1.0;',
        'gl_Position = vec4(clipSpace * vec2(1.0, flipY), 0.0, 1.0);',
        'pix = uv;',
    '}'
    ].join('\n')),
    FRAGMENT_DEFAULT = trim([
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'void main(void) {',
        'gl_FragColor = texture2D(img, pix);',
    '}',
    ].join('\n')),
    PRECISION = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif'
    ].join('\n'),
    COMMENTS = /\/\*.*?\*\//gmi
;

GLSL.DEFAULT = FRAGMENT_DEFAULT;

function extract(source, type, store)
{
    var r = new RegExp('\\b' + type + '\\s+\\w+\\s+(\\w+)', 'ig');
    source.replace(COMMENTS, '').replace(r, function(match, varName) {
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
    /*if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        FILTER.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }*/
    return shader;
}
function GLSLProgram(fragmentSource, gl)
{
    var self = this, vsh, fsh, a, u;

    if (-1 === fragmentSource.indexOf('precision '))
        fragmentSource = PRECISION + '\n' + fragmentSource;
    self.vertexSource = VERTEX_DEAULT;
    self.fragmentSource = fragmentSource;

    self.uniform = {};
    self.attribute = {};

    vsh = compile(gl, self.vertexSource, gl.VERTEX_SHADER);
    fsh = compile(gl, self.fragmentSource, gl.FRAGMENT_SHADER);
    self.id = gl.createProgram();
    gl.attachShader(self.id, vsh);
    gl.attachShader(self.id, fsh);
    gl.linkProgram(self.id);
    if (!gl.getProgramParameter(self.id, gl.LINK_STATUS) && !gl.isContextLost())
    {
        FILTER.error(gl.getProgramInfoLog(self.id));
        FILTER.error(gl.getShaderInfoLog(vsh));
        FILTER.error(gl.getShaderInfoLog(fsh));
        gl.deleteShader(vsh);
        gl.deleteShader(fsh);
        gl.deleteProgram(self.id);
        self.id = null;
    }
    else
    {
        // extract attributes
        extract(self.vertexSource, 'attribute', self.attribute);
        // extract uniforms
        extract(self.vertexSource, 'uniform', self.uniform);
        extract(self.fragmentSource, 'uniform', self.uniform);
        for (a in self.attribute) self.attribute[a] = gl.getAttribLocation(self.id, a);
        for (u in self.uniform) self.uniform[u] = gl.getUniformLocation(self.id, u);
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
function getProgram(gl, filter, programCache)
{
    var shader = trim(filter.shader), program = programCache[shader];
    // new program
    if (!program) program = programCache[shader] = new GLSLProgram(shader, gl);
    return program;
}
function createTexture(gl, width, height)
{
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (width && height) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
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
function createFramebufferTexture(gl, width, height)
{
    var tex = createTexture(gl, width, height);

    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return {fbo: fbo, tex: tex};
}
function unbindFramebufferTexture(gl, buf)
{
    gl.bindFramebuffer(gl.FRAMEBUFFER, buf.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return buf;
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
function createBuffer(gl, data)
{
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data || null, gl.STATIC_DRAW);
    return buf;
}
function deleteBuffer(gl, buf)
{
    if (buf)
    {
        gl.deleteBuffer(buf);
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
function prepareGL(img, ws, hs)
{
    var DPR = 1/*FILTER.devicePixelRatio*/;
    if (null == ws && null == hs)
    {
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
    }
    return FILTER.getGL(img, ws, hs);
}
function runOne(gl, program, glsl, w, h, pos, uv, input, output, prev, buf, flipY)
{
    var iterations = glsl.iterations || 1,
        i, src, dst, t, prevUnit = 1,
        flip = false, last = iterations - 1;

    gl.useProgram(program.id);
    if ('pos' in program.attribute)
    {
        gl.enableVertexAttribArray(program.attribute.pos);
        gl.bindBuffer(gl.ARRAY_BUFFER, pos);
        gl.vertexAttribPointer(program.attribute.pos, 2, gl.FLOAT, false, 0, 0);
    }
    if ('uv' in program.attribute)
    {
        gl.enableVertexAttribArray(program.attribute.uv);
        gl.bindBuffer(gl.ARRAY_BUFFER, uv);
        gl.vertexAttribPointer(program.attribute.uv, 2, gl.FLOAT, false, 0, 0);
    }
    if ('resolution' in program.uniform)
    {
        gl.uniform2f(program.uniform.resolution, w, h);
    }
    if ('dp' in program.uniform)
    {
        gl.uniform2f(program.uniform.dp, 1/w, 1/h);
    }
    if (glsl.instance && ('mode' in program.uniform))
    {
        gl.uniform1i(program.uniform.mode, glsl.instance.mode);
    }
    if (('_img_prev_prev' in program.uniform) && prev[1])
    {
        gl.activeTexture(gl.TEXTURE0 + prevUnit + 1);
        gl.bindTexture(gl.TEXTURE_2D, prev[1]);
        gl.uniform1i(program.uniform._img_prev_prev, prevUnit + 1);
    }
    if (('_img_prev' in program.uniform) && prev[0])
    {
        if (!('img' in program.uniform))
        {
            input = {fbo:null, tex:prev[0]};
            /*gl.activeTexture(gl.TEXTURE0 + 0);
            gl.bindTexture(gl.TEXTURE_2D, prev[0]);
            gl.uniform1i(program.uniform._img_prev, 0);*/
        }
        else
        {
            gl.activeTexture(gl.TEXTURE0 + prevUnit + 0);
            gl.bindTexture(gl.TEXTURE_2D, prev[0]);
            gl.uniform1i(program.uniform._img_prev, prevUnit + 0);
        }
    }
    if (glsl.vars) glsl.vars(gl, w, h, program);
    if (glsl.textures) glsl.textures(gl, w, h, program);

    if (last > 0)
    {
        buf[0] = buf[0] || createFramebufferTexture(gl, w, h);
        buf[1] = buf[1] || createFramebufferTexture(gl, w, h);
    }
    for (i=0; i<iterations; ++i)
    {
        if (gl.isContextLost && gl.isContextLost()) return true;
        if (0 === i)
        {
            src = input;
        }
        else
        {
            //buf[0] = buf[0] || createFramebufferTexture(gl, w, h);
            src = buf[0];
        }
        if (i === last)
        {
            dst = output;
            flip = flipY;
        }
        else
        {
            //buf[1] = buf[1] || createFramebufferTexture(gl, w, h);
            dst = buf[1];
        }
        if (('_img_prev' in program.uniform) && !('img' in program.uniform))
        {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, src.tex);
            gl.uniform1i(program.uniform._img_prev, 0);
        }
        else if ('img' in program.uniform)
        {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, src.tex);
            gl.uniform1i(program.uniform.img, 0);
        }
        gl.uniform1f(program.uniform.flipY, flip ? -1 : 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
        gl.viewport(0, 0, w, h);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        // swap buffers
        t = buf[0]; buf[0] = buf[1]; buf[1] = t;
        flip = false;
    }
}
GLSL.run = function(img, glsls, im, w, h, metaData) {
    var gl = prepareGL(img, w, h), input, output,
        i, n = glsls.length, glsl,
        pos, uv, src, dst, prev = [null, null],
        buf0, buf1, buf = [null, null],
        program, cache, im0, t,
        canRun, ctxLost, cleanUp,
        first = -1, last = -1, fromshader = false, flipY = false;
    if (!gl) return;
    for (i=0; i<n; ++i)
    {
        if (glsls[i].shader && 0 > first) first = i;
        if (glsls[n-1-i].shader && 0 > last) last = n-1-i;
        if (0 <= first && 0 <= last) break;
    }
    cache = img.cache;
    pos = createBuffer(gl, new FILTER.Array32F([
        0, 0,
        w, 0,
        0, h,
        0, h,
        w, 0,
        w, h
    ]));
    uv = createBuffer(gl, new FILTER.Array32F([
        0, 0,
        1, 0,
        0, 1,
        0, 1,
        1, 0,
        1, 1
    ]));
    gl.viewport(0, 0, w, h);
    input = null;
    output = null;
    if (last > first)
    {
        buf0 = createFramebufferTexture(gl, w, h);
        buf1 = createFramebufferTexture(gl, w, h);
    }
    cleanUp = function() {
        // clean up
        deleteBuffer(gl, pos);
        deleteBuffer(gl, uv);
        deleteTexture(gl, input);
        deleteFramebufferTexture(gl, output);
        deleteTexture(gl, prev[1]);
        deleteTexture(gl, prev[0]);
        deleteFramebufferTexture(gl, buf[0]);
        deleteFramebufferTexture(gl, buf[1]);
        deleteFramebufferTexture(gl, buf0);
        deleteFramebufferTexture(gl, buf1);
        pos = null;
        uv = null;
        input = null;
        output = null;
        prev = null;
        buf = null;
        buf0 = null;
        buf1 = null;
    };
    for (i=0; i<n; ++i)
    {
        canRun = false;
        glsl = glsls[i];
        if (glsl.shader)
        {
            program = getProgram(gl, glsl, cache);
            if (program && program.id) canRun = true;
        }
        if (canRun)
        {
            if (i+1 < n && glsls[i+1].shader && glsls[i+1]._usesPrev)
            {
                // store previous frames
                deleteTexture(gl, prev[1]);
                prev[1] = prev[0];
                if (fromshader) prev[0] = uploadTexture(gl, getPixels(gl, w, h), w, h);
                else prev[0] = uploadTexture(gl, im, w, h);
            }
            if (i === first)
            {
                if (!input) input = uploadTexture(gl, im, w, h, 0);
                src = {fbo: null, tex: input};
            }
            else
            {
                src = buf0;
            }
            if (i === last)
            {
                if (!output) output = createFramebufferTexture(gl, w, h);
                dst = output;
            }
            else
            {
                dst = buf1;
            }
            if (!fromshader && i > first) uploadTexture(gl, im, w, h, 0, 0, src.tex);
            ctxLost = runOne(gl, program, glsl, w, h, pos, uv, src, dst, prev, buf, false);
            if (ctxLost || (gl.isContextLost && gl.isContextLost()))
            {
                cleanUp();
                img.cache = {}; // need to recompile programs?
                FILTER.log('GL context lost on #'+img.id);
                return;
            }
            // swap buffers
            t = buf0; buf0 = buf1; buf1 = t;
            fromshader = true;
        }
        else if (glsl.instance && (glsl._apply || glsl.instance._apply))
        {
            // no glsl program, run js code instead
            im0 = fromshader ? getPixels(gl, w, h) : im;
            if (glsl._apply) im = glsl._apply(im0, w, h, metaData);
            else im = glsl.instance._apply(im0, w, h, metaData);
            if (glsl.instance.hasMeta && (
                (null != glsl.instance.meta._IMG_WIDTH && w !== glsl.instance.meta._IMG_WIDTH)
             || (null != glsl.instance.meta._IMG_HEIGHT && h !== glsl.instance.meta._IMG_HEIGHT)
            ))
            {
                w = glsl.instance.meta._IMG_WIDTH;
                h = glsl.instance.meta._IMG_HEIGHT;
                FILTER.setGLDimensions(img, w, h);
                deleteBuffer(gl, pos);
                pos = createBuffer(gl, new FILTER.Array32F([
                    0, 0,
                    w, 0,
                    0, h,
                    0, h,
                    w, 0,
                    w, h
                ]));
                gl.viewport(0, 0, w, h);
                deleteFramebufferTexture(gl, buf0);
                deleteFramebufferTexture(gl, buf1);
                deleteFramebufferTexture(gl, buf[0]);
                deleteFramebufferTexture(gl, buf[1]);
                buf = [null, null];
                if (last > first)
                {
                    buf0 = createFramebufferTexture(gl, w, h);
                    buf1 = createFramebufferTexture(gl, w, h);
                }
            }
            fromshader = false;
        }
    }
    if (fromshader) getPixels(gl, w, h, im);
    cleanUp();
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
function staticSwap(a, b, temp, output)
{
    return 'if ('+a+'>'+b+') {'+temp+'='+a+';'+a+'='+b+';'+b+'='+temp+';}';
}
GLSL.staticSort = function(items, temp, swap) {
    temp = temp || 'temp';
    swap = swap || staticSwap;
    var n = items.length, p, p2, k, k2, j, i, l, code = [];
    for (p=1; p<n; p=(p<<1))
    {
        p2 = (p << 1);
        for (k=p; k>=1; k=(k>>>1))
        {
            k2 = (k<<1);
            for (j=k%p; j<=(n-1-k); j+=k2)
            {
                for (i=0,l=stdMath.min(k-1, n-j-k-1); i<=l; ++i)
                {
                    if (stdMath.floor((i+j) / p2) === stdMath.floor((i+j+k) / p2))
                    {
                        code.push(swap(items[i+j], items[i+j+k], temp));
                    }
                }
            }
        }
    }
    return code;
};
FILTER.Util.GLSL = GLSL;

}(FILTER);