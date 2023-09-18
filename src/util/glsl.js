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
    HAS = Object.prototype.hasOwnProperty,
    trim = FILTER.Util.String.trim,
    GLSL = FILTER.Util.GLSL || {},
    A32F = FILTER.Array32F, A32I = FILTER.Array32I,
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
    COMMENTS = /\/\*.*?\*\//gmi,
    LINE_COMMENTS = /\/\/.*?$/gmi,
    ATTRIBUTE = /\battribute\s+(\w+)\s+(\w+)\s*(\[)?/gi,
    UNIFORM = /\buniform\s+(\w+)\s+(\w+)\s*(\[)?/gi
;

GLSL.DEFAULT = FRAGMENT_DEFAULT;

function extract(source, type, store)
{
    var r = type/*new RegExp('\\b' + type + '\\s+(\\w+)\\s+(\\w+)\\s*(\\[)?', 'ig')*/;
    source.replace(COMMENTS, '').replace(LINE_COMMENTS, '').replace(r, function(match, typeName, varName, bracket) {
        store[varName] = {name:varName, type:typeName+(bracket||''), loc:0};
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

    vsh = compile(gl, self.vertexSource, gl.VERTEX_SHADER);
    fsh = compile(gl, self.fragmentSource, gl.FRAGMENT_SHADER);
    self.id = gl.createProgram();
    gl.attachShader(self.id, vsh);
    gl.attachShader(self.id, fsh);
    gl.linkProgram(self.id);
    if (!gl.getProgramParameter(self.id, gl.LINK_STATUS) && !gl.isContextLost())
    {
        FILTER.error(gl.getShaderInfoLog(vsh));
        FILTER.error(gl.getShaderInfoLog(fsh));
        FILTER.error(gl.getProgramInfoLog(self.id));
        FILTER.log(fragmentSource);
        gl.deleteShader(vsh);
        gl.deleteShader(fsh);
        gl.deleteProgram(self.id);
        self.id = null;
    }
    else
    {
        self.uniform = {};
        self.attribute = {};
        // extract attributes
        extract(self.vertexSource, ATTRIBUTE, self.attribute);
        // extract uniforms
        extract(self.vertexSource, UNIFORM, self.uniform);
        extract(self.fragmentSource, UNIFORM, self.uniform);
        for (a in self.attribute) self.attribute[a].loc = gl.getAttribLocation(self.id, a);
        for (u in self.uniform) self.uniform[u].loc = gl.getUniformLocation(self.id, u);
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
function GLSLFilter(filter)
{
    var self = this, glsls = [], glsl = null, io = {},
        prev_output = function(glsl) {
            return glsl._prev && glsl._prev._output ? io[glsl._prev._output] : null;
        };
    self.begin = function() {
        glsl = {
        _prev: null,
        _next: null,
        _save: null,
        _inputs: {},
        _input: 'img', // main input (texture) is named 'img' by default
        _output: null,
        iterations: 1,
        instance: filter,
        shader: null,
        init: function(gl, im, wi, hi, fromshader) {
            if (this._save) io[this._save] = prev_output(this) || {data:fromshader ? getPixels(gl, wi, hi) : FILTER.Util.Array.copy(im), width:wi, height:hi};
        },
        inputs: function(gl, program, w, h, wi, hi, input) {
            var this_ = this, inputs = this_._inputs || {}, main_input = this_._input, unit = 0;
            Object.keys(inputs).forEach(function(i) {
                if (('*' === i) && inputs['*'].setter)
                {
                    inputs['*'].setter(filter, w, h, wi, hi, io, gl, program, input);
                }
                else if (HAS.call(program.uniform, i) || HAS.call(program.uniform, inputs[i].iname))
                {
                    var inp = inputs[i], name = HAS.call(program.uniform, inp.name) ? inp.name : inp.iname,
                        type = program.uniform[name].type, loc = program.uniform[name].loc, value;
                    if ('sampler2D' === type)
                    {
                        // texture
                        value = !inp.setter && HAS.call(io, inp.name) ? io[inp.name] : inp.setter(filter, w, h, wi, hi, io);
                        if (main_input === inp.iname)
                        {
                            if (!inp.setter && this_._prev && (inp.name === this_._prev._output))
                            {
                                /* prev output is passed as main input by default */
                            }
                            else
                            {
                                // upload data
                                uploadTexture(gl, value.data, value.width, value.height, 0, false, input.tex);
                            }
                            gl.uniform1i(loc, 0);
                        }
                        else
                        {
                            ++unit;
                            uploadTexture(gl, value.data, value.width, value.height, unit);
                            gl.uniform1i(loc, unit);
                        }
                    }
                    else
                    {
                        // other uniform
                        value = inp.setter(filter, w, h, wi, hi, io);
                        switch (type)
                        {
                            case 'ivec4':
                            gl.uniform4iv(loc, new A32I(value || [0,0,0,0]));
                            break;
                            case 'vec4':
                            gl.uniform4fv(loc, new A32F(value || [0,0,0,0]));
                            break;
                            case 'ivec3':
                            gl.uniform3iv(loc, new A32I(value || [0,0,0]));
                            break;
                            case 'vec3':
                            gl.uniform3fv(loc, new A32F(value || [0,0,0]));
                            break;
                            case 'ivec2':
                            gl.uniform2iv(loc, new A32I(value || [0,0]));
                            break;
                            case 'vec2':
                            gl.uniform2fv(loc, new A32F(value || [0,0]));
                            break;
                            case 'int[':
                            gl.uniform1iv(loc, new A32I(value || [0]));
                            break;
                            case 'float[':
                            gl.uniform1fv(loc, new A32F(value || [0]));
                            break;
                            case 'int':
                            gl.uniform1i(loc, value || 0);
                            break;
                            case 'float':
                            default:
                            gl.uniform1f(loc, value || 0);
                            break;
                        }
                    }
                }
            });
        },
        output: function(gl, output) {
            if (this._islast) io = {};
            else if (this._output) io[this._output] = {data:getPixels(gl, output.w, output.h), width:output.w, height:output.h};
        },
        _islast: true
        };
        return self;
    };
    self.shader = function(shader, iterations) {
        if (glsl)
        {
            glsl.shader = shader || null;
            glsl.iterations = iterations || 1;
        }
        return self;
    };
    self.dimensions = function(df) {
        if (glsl && df) glsl.dimensions = function(w, h) {return df(w, h, io);};
        return self;
    };
    self.save = function(name) {
        if (glsl && name) glsl._save = name;
        return self;
    };
    self.input = function(name, setter, iname) {
        if (glsl && name)
        {
            if (true === setter) glsl._input = name; // set main input name if other than the default
            else glsl._inputs[name] = {name:name, setter:setter, iname:iname||name};
        }
        return self;
    };
    self.output = function(name) {
        if (glsl && name) glsl._output = name;
        return self;
    };
    self.end = function() {
        if (glsl)
        {
            if (glsls.length)
            {
                glsl._prev = glsls[glsls.length-1];
                glsls[glsls.length-1]._next = glsl;
                glsls[glsls.length-1]._islast = false;
            }
            glsls.push(glsl);
        }
        glsl = null;
        return self;
    };
    self.code = function() {
        return glsls;
    };
}
GLSLFilter[proto] = {
    constructor: GLSLFilter,
    begin: null,
    shader: null,
    dimensions: null,
    save: null,
    input: null,
    output: null,
    end: null,
    code: null
};
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
    return {fbo: fbo, tex: tex, w: width, h: height};
}
function unbindFramebufferTexture(gl, buf)
{
    if (buf.fbo)
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, buf.fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
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
        if (buf.fbo)
        {
            unbindFramebufferTexture(gl, buf);
            deleteFramebuffer(gl, buf.fbo);
        }
        if (buf.tex) deleteTexture(gl, buf.tex);
        buf.fbo = null;
        buf.tex = null;
        //buf = null;
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
    /*if (null != index)
    {
        gl.bindTexture(gl.TEXTURE_2D, null);
    }*/
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
function runOne(gl, program, glsl, pos, uv, input, output, buf /*, prev, flipY*/)
{
    var iterations = glsl.iterations || 1,
        w = output.w, h = output.h, wi = input.w, hi = input.h;
    if ('function' === typeof iterations) iterations = iterations(w, h, wi, hi) || 1;
    var i, src, dst, t, prevUnit = 1,
        flip = false, last = iterations - 1;

    if (gl.isContextLost && gl.isContextLost()) return true;
    gl.useProgram(program.id);
    if ('pos' in program.attribute)
    {
        gl.enableVertexAttribArray(program.attribute.pos.loc);
        gl.bindBuffer(gl.ARRAY_BUFFER, pos);
        gl.vertexAttribPointer(program.attribute.pos.loc, 2, gl.FLOAT, false, 0, 0);
    }
    if ('uv' in program.attribute)
    {
        gl.enableVertexAttribArray(program.attribute.uv.loc);
        gl.bindBuffer(gl.ARRAY_BUFFER, uv);
        gl.vertexAttribPointer(program.attribute.uv.loc, 2, gl.FLOAT, false, 0, 0);
    }
    if ('resolution' in program.uniform)
    {
        gl.uniform2f(program.uniform.resolution.loc, w, h);
    }
    if ('dp' in program.uniform)
    {
        gl.uniform2f(program.uniform.dp.loc, 1/w, 1/h);
    }
    if (glsl.instance && ('mode' in program.uniform))
    {
        gl.uniform1i(program.uniform.mode.loc, glsl.instance.mode);
    }
    if (glsl.inputs)
    {
        glsl.inputs(gl, program, w, h, wi, hi, input);
    }

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
            //flip = flipY;
        }
        else
        {
            //buf[1] = buf[1] || createFramebufferTexture(gl, w, h);
            dst = buf[1];
        }
        if (HAS.call(program.uniform, glsl._input))
        {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, src.tex);
            gl.uniform1i(program.uniform[glsl._input].loc, 0);
        }
        gl.uniform1f(program.uniform.flipY.loc, flip ? -1 : 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
        gl.viewport(0, 0, w, h);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        // swap buffers
        t = buf[0]; buf[0] = buf[1]; buf[1] = t;
        flip = false;
    }
    if (glsl.output) glsl.output(gl, output);
}
GLSL.run = function(img, filter, glsls, im, w, h, metaData) {
    var gl = prepareGL(img, w, h),
        input = null, output = null,
        i, n = glsls.length, glsl,
        pos, uv, src, dst, prev = [null, null],
        buf0, buf1, buf = [null, null],
        program, cache, im0, t,
        canRun, isContextLost,
        cleanUp, lost, resize, refreshBuffers,
        first = -1, last = -1,
        nw, nh, wi, hi, d,
        fromshader = false, flipY = false;
    if (!gl) return;
    cleanUp = function() {
        // clean up
        deleteBuffer(gl, pos);
        deleteBuffer(gl, uv);
        deleteTexture(gl, input);
        deleteFramebufferTexture(gl, output);
        //deleteTexture(gl, prev[1]);
        //deleteTexture(gl, prev[0]);
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
    lost = function() {
        cleanUp();
        img.cache = {}; // need to recompile programs?
        FILTER.log('GL context lost on #'+img.id);
    };
    refreshBuffers = function(w, h, keepbuf, keepothers) {
        if (buf0 !== keepbuf) deleteFramebufferTexture(gl, buf0);
        if (buf1 !== keepbuf) deleteFramebufferTexture(gl, buf1);
        if (!keepothers)
        {
            deleteFramebufferTexture(gl, buf[0]);
            deleteFramebufferTexture(gl, buf[1]);
            buf = [null, null];
        }
        if (last > first && last > i)
        {
            if (buf0 !== keepbuf) buf0 = createFramebufferTexture(gl, w, h);
            if (buf1 !== keepbuf) buf1 = createFramebufferTexture(gl, w, h);
        }
    };
    resize = function(nw, nh, withBuffers) {
        if (w === nw && h === nh)  return;
        wi = w;
        hi = h;
        w = nw;
        h = nh;
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
        if (withBuffers) refreshBuffers(w, h, null, false);
        if (filter.hasMeta)
        {
            filter.meta = filter.meta || {};
            filter.meta._IMG_WIDTH = w;
            filter.meta._IMG_HEIGHT = h;
        }
    };
    if (gl.isContextLost && gl.isContextLost()) return lost();
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
    if (last > first)
    {
        buf0 = createFramebufferTexture(gl, w, h);
        buf1 = createFramebufferTexture(gl, w, h);
    }
    wi = w; hi = h;
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
            //if (wi !== w || hi !== h) refreshBuffers(w, h, buf1, true);
            if (null != glsl.dimensions)
            {
                d = 'function' === typeof glsl.dimensions ? glsl.dimensions(w, h) : glsl.dimensions;
                nw = d[0]; nh = d[1];
                resize(nw, nh, false);
                if (wi !== w || hi !== h) refreshBuffers(w, h, buf0, false);
            }
            else
            {
                wi = w;
                hi = h;
            }
            if (i === first)
            {
                if (!input) input = uploadTexture(gl, im, wi, hi, 0);
                src = {fbo:null, tex:input, w:wi, h:hi};
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
                if (buf1.w !== w || buf1.h !== h)
                {
                    deleteFramebufferTexture(gl, buf1);
                    buf1 = createFramebufferTexture(gl, w, h);
                }
                dst = buf1;
            }
            if (glsl.init) glsl.init(gl, im, wi, hi, fromshader);
            if (!fromshader && i > first) uploadTexture(gl, im, src.w, src.h, 0, 0, src.tex);
            isContextLost = runOne(gl, program, glsl, pos, uv, src, dst, buf /*, prev, false*/);
            if (isContextLost || (gl.isContextLost && gl.isContextLost())) return lost();
            // swap buffers
            t = buf0; buf0 = buf1; buf1 = t;
            fromshader = true;
        }
        else if (glsl.instance && (glsl._apply || glsl.instance._apply_wasm || glsl.instance._apply))
        {
            // no glsl program, run js code instead
            im0 = fromshader ? getPixels(gl, w, h) : im;
            if (glsl._apply) im = glsl._apply(im0, w, h, metaData);
            else if (glsl.instance._apply_wasm) im = glsl.instance._apply_wasm(im0, w, h, metaData);
            else im = glsl.instance._apply(im0, w, h, metaData);
            if (glsl.instance.hasMeta && null != glsl.instance.meta._IMG_WIDTH && null != glsl.instance.meta._IMG_HEIGHT)
            {
                resize(glsl.instance.meta._IMG_WIDTH, glsl.instance.meta._IMG_HEIGHT, true);
            }
            fromshader = false;
        }
    }
    if (fromshader)
    {
        n = (w*h) << 2;
        if (im.length !== n) im = new FILTER.ImArray(n);
        getPixels(gl, w, h, im);
    }
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
GLSL.Filter = GLSLFilter;
GLSL.isSupported = FILTER.supportsGLSL();
GLSL.isLoaded = true;
FILTER.Util.GLSL = GLSL;
}(FILTER);