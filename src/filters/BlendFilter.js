/**
*
* Blend Filter
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var IMG = FILTER.ImArray, copy = FILTER.Util.Array.copy,
    GLSL = FILTER.Util.GLSL,
    stdMath = Math, Min = stdMath.min, Round = stdMath.round,
    notSupportClamp = FILTER._notSupportClamp,
    clamp = FILTER.Color.clampPixel;

// Blend Filter, svg-like image blending
var BlendFilter = FILTER.Create({
    name: "BlendFilter"

    ,init: function BlendFilter(matrix) {
        var self = this;
        self.set(matrix);
    }

    ,path: FILTER.Path
    // parameters
    ,matrix: null
    ,hasInputs: true

    ,dispose: function() {
        var self = this;
        self.matrix = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
            matrix: self.matrix
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.matrix = params.matrix;
        return self;
    }

    ,set: function(matrix) {
        var self = this;
        if (matrix && matrix.length /*&& (matrix.length&3 === 0)*//*4N*/)
        {
            //self.resetInputs();
            self.matrix = matrix;
        }
        self._glsl = null;
        return self;
    }

    ,setInputValues: function(inputIndex, values) {
        var self = this, index, matrix = self.matrix;
        if (values)
        {
            if (!matrix) matrix = self.matrix = ["normal", 0, 0, 1];
            index = (inputIndex-1)*4;
            if (null != values.mode)      matrix[index  ] =  values.mode||"normal";
            if (null != values.startX)    matrix[index+1] = +values.startX;
            if (null != values.startY)    matrix[index+2] = +values.startY;
            if (null != values.enabled)   matrix[index+3] = !!values.enabled;
        }
        return self;
    }

    ,reset: function() {
        var self = this;
        self.matrix = null;
        self.resetInputs();
        self._glsl = null;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return wasm(this);
    }

    ,_apply: function(im, w, h) {
        //"use asm";
        var self = this, matrix = self.matrix;
        if (!matrix || !matrix.length) return im;

        var i, j, j2, k, l = matrix.length, imLen = im.length, input,
            startX, startY, startX2, startY2, W, H, A, w2, h2,
            W1, W2, start, end, x, y, x2, y2, f, B, mode,
            rb, gb, bb, ab, ra, ga, ba, aa, a;

        //B = im;
        // clone original image since same image may also blend with itself
        B = copy(im);

        for (i=0,k=1; i<l; i+=4,++k)
        {
            if (!matrix[i+3]) continue; // not enabled, skip
            mode = matrix[i] || 'normal';
            f = BLEND[mode];
            if (!f) continue;

            input = self.input(k);
            if (!input) continue; // no input, skip
            A = input[0]; w2 = input[1]; h2 = input[2];

            startX = matrix[i+1]||0; startY = matrix[i+2]||0;
            startX2 = 0; startY2 = 0;
            if (startX < 0) {startX2 = -startX; startX = 0;}
            if (startY < 0) {startY2 = -startY; startY = 0;}
            if (startX >= w || startY >= h || startX2 >= w2 || startY2 >= h2) continue;

            startX = Round(startX); startY = Round(startY);
            startX2 = Round(startX2); startY2 = Round(startY2);
            W = Min(w-startX, w2-startX2); H = Min(h-startY, h2-startY2);
            if (W <= 0 || H <= 0) continue;

            // blend images
            x = startX; y = startY*w; x2 = startX2; y2 = startY2*w2; W1 = startX+W; W2 = startX2+W;
            if (notSupportClamp)
            {
                for (start=0,end=H*W; start<end; ++start)
                {
                    j = (x + y) << 2;
                    j2 = (x2 + y2) << 2;
                    rb = B[j  ];
                    gb = B[j+1];
                    bb = B[j+2];
                    ab = B[j+3]/255;
                    ra = A[j2  ];
                    ga = A[j2+1];
                    ba = A[j2+2];
                    aa = A[j2+3]/255;
                    a = 'normal' !== mode ? (aa + ab - aa*ab) : (aa + ab * (1 - aa));
                    if (0 < a)
                    {
                        B[j  ] = clamp(Round(255*f(ab*rb/255, ab, aa*ra/255, aa)/a));
                        B[j+1] = clamp(Round(255*f(ab*gb/255, ab, aa*ga/255, aa)/a));
                        B[j+2] = clamp(Round(255*f(ab*bb/255, ab, aa*ba/255, aa)/a));
                        B[j+3] = clamp(Round(255*a));
                    }
                    else
                    {
                        B[j  ] = 0;
                        B[j+1] = 0;
                        B[j+2] = 0;
                        B[j+3] = 0;
                    }
                    // next pixels
                    if (++x >= W1) {x = startX; y += w;}
                    if (++x2 >= W2) {x2 = startX2; y2 += w2;}
                }
            }
            else
            {
                for (start=0,end=H*W; start<end; ++start)
                {
                    j = (x + y) << 2;
                    j2 = (x2 + y2) << 2;
                    rb = B[j  ];
                    gb = B[j+1];
                    bb = B[j+2];
                    ab = B[j+3]/255;
                    ra = A[j2  ];
                    ga = A[j2+1];
                    ba = A[j2+2];
                    aa = A[j2+3]/255;
                    a = 'normal' !== mode ? (aa + ab - aa*ab) : (aa + ab * (1 - aa));
                    if (0 < a)
                    {
                        B[j  ] = Round(255*f(ab*rb/255, ab, aa*ra/255, aa)/a);
                        B[j+1] = Round(255*f(ab*gb/255, ab, aa*ga/255, aa)/a);
                        B[j+2] = Round(255*f(ab*bb/255, ab, aa*ba/255, aa)/a);
                        B[j+3] = Round(255*a);
                    }
                    else
                    {
                        B[j  ] = 0;
                        B[j+1] = 0;
                        B[j+2] = 0;
                        B[j+3] = 0;
                    }
                    // next pixels
                    if (++x >= W1) {x = startX; y += w;}
                    if (++x2 >= W2) {x2 = startX2; y2 += w2;}
                }
            }
        }
        return B;
    }
});
// aliases
FILTER.CombineFilter = FILTER.BlendFilter;
var BLEND = FILTER.Color.Blend = {
//https://dev.w3.org/SVG/modules/compositing/master/
'normal': function(Dca, Da, Sca, Sa){return Sca + Dca * (1 - Sa);},
'multiply': function(Dca, Da, Sca, Sa){return Sca*Dca + Sca*(1 - Da) + Dca*(1 - Sa);},
'screen': function(Dca, Da, Sca, Sa){return Sca + Dca - Sca * Dca;},
'overlay': function(Dca, Da, Sca, Sa){return 2*Dca <= Da ? (2*Sca * Dca + Sca * (1 - Da) + Dca * (1 - Sa)) : (Sca * (1 + Da) + Dca * (1 + Sa) - 2 * Dca * Sca - Da * Sa);},
'darken': function(Dca, Da, Sca, Sa){return stdMath.min(Sca * Da, Dca * Sa) + Sca * (1 - Da) + Dca * (1 - Sa);},
'lighten': function(Dca, Da, Sca, Sa){return stdMath.max(Sca * Da, Dca * Sa) + Sca * (1 - Da) + Dca * (1 - Sa);},
'color-dodge': function(Dca, Da, Sca, Sa){return Sca === Sa && 0 === Dca ? (Sca * (1 - Da)) : (Sca === Sa ? (Sa * Da + Sca * (1 - Da) + Dca * (1 - Sa)) : (Sa * Da * stdMath.min(1, Dca/Da * Sa/(Sa - Sca)) + Sca * (1 - Da) + Dca * (1 - Sa)));},
'color-burn': function(Dca, Da, Sca, Sa){var m = Da ? Dca/Da : 0; return 0 === Sca && Dca === Da ? (Sa * Da + Dca * (1 - Sa)) : (0 === Sca ? (Dca * (1 - Sa)) : (Sa * Da * (1 - stdMath.min(1, (1 - m) * Sa/Sca)) + Sca * (1 - Da) + Dca * (1 - Sa)));},
'hard-light': function(Dca, Da, Sca, Sa){return 2 * Sca <= Sa ? (2 * Sca * Dca + Sca * (1 - Da) + Dca * (1 - Sa)) : (Sca * (1 + Da) + Dca * (1 + Sa) - Sa * Da - 2 * Sca * Dca);},
'soft-light': function(Dca, Da, Sca, Sa){var m = Da ? Dca/Da : 0; return 2 * Sca <= Sa ? (Dca * (Sa + (2 * Sca - Sa) * (1 - m)) + Sca * (1 - Da) + Dca * (1 - Sa)) : (2 * Sca > Sa && 4 * Dca <= Da ? (Da * (2 * Sca - Sa) * (16 * stdMath.pow(m, 3) - 12 * stdMath.pow(m, 2) - 3 * m) + Sca - Sca * Da + Dca) : (Da * (2 * Sca - Sa) * (stdMath.pow(m, 0.5) - m) + Sca - Sca * Da + Dca));},
'difference': function(Dca, Da, Sca, Sa){return Sca + Dca - 2 * stdMath.min(Sca * Da, Dca * Sa);},
'exclusion': function(Dca, Da, Sca, Sa){return (Sca * Da + Dca * Sa - 2 * Sca * Dca) + Sca * (1 - Da) + Dca * (1 - Sa);},
'average': function(Dca, Da, Sca, Sa){return (Sca + Dca) / 2;},
// linear-dodge
'add': function(Dca, Da, Sca, Sa){return stdMath.min(1, Sca + Dca);},
// linear-burn
'subtract': function(Dca, Da, Sca, Sa){return stdMath.max(0, Dca + Sca - 1);},
'negation': function(Dca, Da, Sca, Sa){return 1 - stdMath.abs(1 - Sca - Dca);},
'linear-light': function(Dca, Da, Sca, Sa){return Sca < 0.5 ? BLEND.subtract(Dca, Da, 2*Sca, Sa) : BLEND.add(Dca, Da, 2*(1 - Sca), Sa);}
};
// aliases
BLEND['lineardodge'] = BLEND['linear-dodge'] = BLEND['add'];
BLEND['linearburn'] = BLEND['linear-burn'] = BLEND['subtract'];
BLEND['linearlight'] = BLEND['linear-light'];
BLEND['hardlight'] = BLEND['hard-light'];
BLEND['softlight'] = BLEND['soft-light'];
BLEND['colordodge'] = BLEND['color-dodge'];
BLEND['colorburn'] = BLEND['color-burn'];
var modes = [
    'NORMAL',
    'MULTIPLY',
    'SCREEN',
    'OVERLAY',
    'DARKEN',
    'LIGHTEN',
    'COLORDODGE',
    'COLORBURN',
    'HARDLIGHT',
    'SOFTLIGHT',
    'DIFFERENCE',
    'EXCLUSION',
    'AVERAGE',
    'LINEARDODGE',
    'LINEARBURN',
    'NEGATION',
    'LINEARLIGHT'
], same = {
    'ADD' : 'LINEARDODGE',
    'SUBTRACT': 'LINEARBURN'
};
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {env:{
      "BLEND.multiply": BLEND.multiply,
      "BLEND.screen": BLEND.screen,
      "BLEND.overlay": BLEND.overlay,
      "BLEND.darken": BLEND.darken,
      "BLEND.lighten": BLEND.lighten,
      "BLEND.colordodge": BLEND.colordodge,
      "BLEND.colorburn": BLEND.colorburn,
      "BLEND.hardlight": BLEND.hardlight,
      "BLEND.softlight": BLEND.softlight,
      "BLEND.difference": BLEND.difference,
      "BLEND.exclusion": BLEND.exclusion,
      "BLEND.average": BLEND.average,
      "BLEND.lineardodge": BLEND.lineardodge,
      "BLEND.linearburn": BLEND.linearburn,
      "BLEND.negation": BLEND.negation,
      "BLEND.linearlight": BLEND.linearlight,
      "BLEND.normal": BLEND.normal
}}, {
    blendfilter: {inputs: [{arg:0,type:FILTER.ImArray},{arg:3,type:'f32',array:1},{arg:4,type:FILTER.ImArray,array:1},{arg:5,type:'i32',array:1}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
    BlendFilter.prototype._apply_wasm = function(im, w, h) {
        var self = this, matrix = self.matrix, inputs, inputSizes, input, m, i, j, l, mode;
        if (!matrix || !matrix.length) return im;
        m = matrix.slice();
        inputs = new Array(matrix.length >>> 2);
        inputSizes = new Array(matrix.length >>> 1);
        for (i=0,j=0,l=matrix.length; i<l; i+=4,++j)
        {
            mode = (matrix[i]||'normal').toUpperCase().replace('-', '');
            if (same[mode]) mode = same[mode];
            m[i] = modes.indexOf(mode);
            input = self.input(j+1);
            if (!input)
            {
                m[i+3] = 0;
                inputs[j] = [];
                inputSizes[2*j] = 0;
                inputSizes[2*j+1] = 0;
            }
            else
            {
                inputs[j] = input[0] || [];
                inputSizes[2*j] = input[1] || 0;
                inputSizes[2*j+1] = input[2] || 0;
            }
        }
        return wasm.blendfilter(im, w, h, m, inputs, inputSizes);
    };
    }
    FILTER.unwaitFor(1);
});
}

function glsl(filter)
{
    if (!filter.matrix || !filter.matrix.length) return (new GLSL.Filter(filter)).begin().shader(GLSL.DEFAULT).end().code();
    var matrix = filter.matrix, inputs = '', code = '', i, j, glslcode;
    for (j=1,i=0; i<matrix.length; i+=4,++j)
    {
        inputs += (inputs.length ? '\n' : '')+'uniform sampler2D input'+j+';\n'+'uniform vec2 inputSize'+j+';\n'+'uniform int inputMode'+j+';\n'+'uniform vec2 inputStart'+j+';\n'+'uniform int inputEnabled'+j+';';
        code += (code.length ? '\n' : '')+'col = doblend(col, pix, input'+j+', inputSize'+j+', inputStart'+j+', inputMode'+j+', inputEnabled'+j+');';
    }
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader([
    modes.map(function(m, i) {
        if ('LINEARDODGE' === m)
        {
            return '#define LINEARDODGE '+i+'\n'+'#define ADD '+i;
        }
        else if ('LINEARBURN' === m)
        {
            return '#define LINEARBURN '+i+'\n'+'#define SUBTRACT '+i;
        }
        return '#define '+m+' '+i;
    }).join('\n'),
    Object.keys(BLEND_GLSL).map(function(m) {
        return BLEND_GLSL[m];
    }).join('\n'),
    'float blend(int mode, float Dca, float Da, float Sca, float Sa) {',
    '    if (MULTIPLY == mode) return multiply(Dca, Da, Sca, Sa);',
    '    else if (SCREEN == mode) return screen(Dca, Da, Sca, Sa);',
    '    else if (OVERLAY == mode) return overlay(Dca, Da, Sca, Sa);',
    '    else if (DARKEN == mode) return darken(Dca, Da, Sca, Sa);',
    '    else if (LIGHTEN == mode) return lighten(Dca, Da, Sca, Sa);',
    '    else if (COLORDODGE == mode) return colordodge(Dca, Da, Sca, Sa);',
    '    else if (COLORBURN == mode) return colorburn(Dca, Da, Sca, Sa);',
    '    else if (HARDLIGHT == mode) return hardlight(Dca, Da, Sca, Sa);',
    '    else if (SOFTLIGHT == mode) return softlight(Dca, Da, Sca, Sa);',
    '    else if (DIFFERENCE == mode) return difference(Dca, Da, Sca, Sa);',
    '    else if (EXCLUSION == mode) return exclusion(Dca, Da, Sca, Sa);',
    '    else if (AVERAGE == mode) return average(Dca, Da, Sca, Sa);',
    '    else if (LINEARDODGE == mode) return lineardodge(Dca, Da, Sca, Sa);',
    '    else if (LINEARBURN == mode) return linearburn(Dca, Da, Sca, Sa);',
    '    else if (NEGATION == mode) return negation(Dca, Da, Sca, Sa);',
    '    else if (LINEARLIGHT == mode) return linearlight(Dca, Da, Sca, Sa);',
    '    return normal(Dca, Da, Sca, Sa);',
    '}',
    'vec4 doblend(vec4 B, vec2 pix, sampler2D Atex, vec2 size, vec2 start, int mode, int enabled) {',
    '    if (0 == enabled || pix.x < start.x || pix.y < start.y || pix.x > start.x+size.x || pix.y > start.y+size.y) return B;',
    '    vec4 A = texture2D(Atex, (pix-start)/size);',
    '    float a = 1.0;',
    '    if (NORMAL != mode) a = clamp(A.a + B.a - A.a*B.a, 0.0, 1.0);',
    '    else a = clamp(A.a + B.a*(1.0 - A.a), 0.0, 1.0);',
    '    if (0.0 < a) return vec4(',
    '        clamp(blend(mode, B.r*B.a, B.a, A.r*A.a, A.a)/a, 0.0, 1.0),',
    '        clamp(blend(mode, B.g*B.a, B.a, A.g*A.a, A.a)/a, 0.0, 1.0),',
    '        clamp(blend(mode, B.b*B.a, B.a, A.b*A.a, A.a)/a, 0.0, 1.0),',
    '        a',
    '    );',
    '    return vec4(0.0);',
    '}',
    'varying vec2 pix;',
    'uniform sampler2D img;',
    inputs,
    'void main(void) {',
    'vec4 col = texture2D(img, pix);',
    code,
    'gl_FragColor = col;',
    '}'
    ].join('\n'))
    .input('*', function(filter, w, h, wi, hi, gl, program) {
        var matrix = filter.matrix, i, j, input, mode;
        for (j=1,i=0; i<matrix.length; i+=4,++j)
        {
            input = filter.input(j);
            GLSL.uploadTexture(gl, input[0], input[1], input[2], j);
            gl.uniform1i(program.uniform['input'+j].loc, j);
            gl.uniform2f(program.uniform['inputSize'+j].loc, input[1]/w, input[2]/h);
            mode = (matrix[i]||'normal').toUpperCase().replace('-', '');
            if (same[mode]) mode = same[mode];
            gl.uniform1i(program.uniform['inputMode'+j].loc, modes.indexOf(mode));
            gl.uniform2f(program.uniform['inputStart'+j].loc, matrix[i+1]/w, matrix[i+2]/h);
            gl.uniform1i(program.uniform['inputEnabled'+j].loc, matrix[i+3] ? 1 : 0);
        }
    })
    .end();
    return glslcode.code();
}
var BLEND_GLSL = {
'normal': 'float normal(float Dca, float Da, float Sca, float Sa){return Sca + Dca * (1.0 - Sa);}',
'multiply': 'float multiply(float Dca, float Da, float Sca, float Sa){return Sca*Dca + Sca*(1.0 - Da) + Dca*(1.0 - Sa);}',
'screen': 'float screen(float Dca, float Da, float Sca, float Sa){return Sca + Dca - Sca * Dca;}',
'overlay': 'float overlay(float Dca, float Da, float Sca, float Sa){if (2.0*Dca <= Da) return (2.0*Sca * Dca + Sca * (1.0 - Da) + Dca * (1.0 - Sa)); else return (Sca * (1.0 + Da) + Dca * (1.0 + Sa) - 2.0 * Dca * Sca - Da * Sa);}',
'darken': 'float darken(float Dca, float Da, float Sca, float Sa){return min(Sca * Da, Dca * Sa) + Sca * (1.0 - Da) + Dca * (1.0 - Sa);}',
'lighten': 'float lighten(float Dca, float Da, float Sca, float Sa){return max(Sca * Da, Dca * Sa) + Sca * (1.0 - Da) + Dca * (1.0 - Sa);}',
'color-dodge': 'float colordodge(float Dca, float Da, float Sca, float Sa){if (Sca == Sa && 0.0 == Dca) return (Sca * (1.0 - Da)); else if (Sca == Sa) return (Sa * Da + Sca * (1.0 - Da) + Dca * (1.0 - Sa)); else return (Sa * Da * min(1.0, Dca/Da * Sa/(Sa - Sca)) + Sca * (1.0 - Da) + Dca * (1.0 - Sa));}',
'color-burn': 'float colorburn(float Dca, float Da, float Sca, float Sa){float m = 0.0; if (0.0 != Da) m = Dca/Da; if (0.0 == Sca && Dca == Da) return (Sa * Da + Dca * (1.0 - Sa)); else if (0.0 == Sca) return (Dca * (1.0 - Sa)); else return (Sa * Da * (1.0 - min(1.0, (1.0 - m) * Sa/Sca)) + Sca * (1.0 - Da) + Dca * (1.0 - Sa));}',
'hard-light': 'float hardlight(float Dca, float Da, float Sca, float Sa){if (2.0 * Sca <= Sa) return (2.0 * Sca * Dca + Sca * (1.0 - Da) + Dca * (1.0 - Sa)); else return (Sca * (1.0 + Da) + Dca * (1.0 + Sa) - Sa * Da - 2.0 * Sca * Dca);}',
'soft-light': 'float softlight(float Dca, float Da, float Sca, float Sa){float m = 0.0; if (0.0 != Da) m = Dca/Da; if (2.0 * Sca <= Sa) return (Dca * (Sa + (2.0 * Sca - Sa) * (1.0 - m)) + Sca * (1.0 - Da) + Dca * (1.0 - Sa)); else if (2.0 * Sca > Sa && 4.0 * Dca <= Da) return (Da * (2.0 * Sca - Sa) * (16.0 * pow(m, 3.0) - 12.0 * pow(m, 2.0) - 3.0 * m) + Sca - Sca * Da + Dca); else return (Da * (2.0 * Sca - Sa) * (pow(m, 0.5) - m) + Sca - Sca * Da + Dca);}',
'difference': 'float difference(float Dca, float Da, float Sca, float Sa){return Sca + Dca - 2.0 * min(Sca * Da, Dca * Sa);}',
'exclusion': 'float exclusion(float Dca, float Da, float Sca, float Sa){return (Sca * Da + Dca * Sa - 2.0 * Sca * Dca) + Sca * (1.0 - Da) + Dca * (1.0 - Sa);}',
'average': 'float average(float Dca, float Da, float Sca, float Sa){return (Sca + Dca) / 2.0;}',
// linear-dodge
'add': 'float lineardodge(float Dca, float Da, float Sca, float Sa){return min(1.0, Sca + Dca);}',
// linear-burn
'subtract': 'float linearburn(float Dca, float Da, float Sca, float Sa){return max(0.0, Dca + Sca - 1.0);}',
'negation': 'float negation(float Dca, float Da, float Sca, float Sa){return 1.0 - abs(1.0 - Sca - Dca);}',
'linear-light': 'float linearlight(float Dca, float Da, float Sca, float Sa){if (Sca < 0.5) return linearburn(Dca, Da, 2.0*Sca, Sa); else return lineardodge(Dca, Da, 2.0*(1.0 - Sca), Sa);}'
};
function wasm()
{
    return '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';
}
}(FILTER);