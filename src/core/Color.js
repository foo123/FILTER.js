/**
*
* Color Methods / Transforms
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

// adapted from https://github.com/foo123/css-color
var // utils
    stdMath = Math,
    sqrt = stdMath.sqrt, round = stdMath.round, floor = stdMath.floor,
    min = stdMath.min, max = stdMath.max, abs = stdMath.abs,
    sin = stdMath.sin, cos = stdMath.cos,
    pi = stdMath.PI, pi2 = 2*pi, pi_2 = pi/2, pi_32 = 3*pi_2,
    //notSupportClamp = FILTER._notSupportClamp,
    clamp = FILTER.Util.Math.clamp,
    esc = FILTER.Util.String.esc,
    trim = FILTER.Util.String.trim,

    // color format regexes
    hexieRE = /^#([0-9a-fA-F]{8})\b/,
    hexRE = /^#([0-9a-fA-F]{3,6})\b/,
    rgbRE = /^(rgba?)\b\s*\(([^\)]*)\)/i,
    hslRE = /^(hsla?)\b\s*\(([^\)]*)\)/i,
    hwbRE = /^(hwba?)\b\s*\(([^\)]*)\)/i,
    sepRE = /\s+|,/gm, aRE = /\/\s*(\d*?\.?\d+%?)/,

    LUMA = FILTER.LUMA, CHANNEL = FILTER.CHANNEL,
    //RED = CHANNEL.RED, GREEN = CHANNEL.GREEN, BLUE = CHANNEL.BLUE, ALPHA = CHANNEL.ALPHA,
    C2F = 1/255, C2P = 100/255, P2C = 2.55
;

// adapted from https://github.com/foo123/css-color
function hsl2rgb(h, s, l)
{
    var c, hp, d, x, m, r, g, b;
    s /= 100;
    l /= 100;
    c = (1 - stdMath.abs(2*l - 1))*s;
    hp = h/60;
    d = stdMath.floor(hp / 2);
    x = c*(1 - stdMath.abs(hp - 2*d - 1));
    m = l - c/2;
    if (hp >= 0 && hp < 1)
    {
        r = c + m;
        g = x + m;
        b = 0 + m;
    }
    else if (hp >= 1 && hp < 2)
    {
        r = x + m;
        g = c + m;
        b = 0 + m;
    }
    else if (hp >= 2 && hp < 3)
    {
        r = 0 + m;
        g = c + m;
        b = x + m;
    }
    else if (hp >= 3 && hp < 4)
    {
        r = 0 + m;
        g = x + m;
        b = c + m;
    }
    else if (hp >= 4 && hp < 5)
    {
        r = x + m;
        g = 0 + m;
        b = c + m;
    }
    else //if (hp >= 5 && hp < 6)
    {
        r = c + m;
        g = 0 + m;
        b = x + m;
    }
    return [
    clamp(stdMath.round(r*255), 0, 255),
    clamp(stdMath.round(g*255), 0, 255),
    clamp(stdMath.round(b*255), 0, 255)
    ];
}
function hsv2rgb(h, s, v)
{
    v /= 100;
    var l = v*(1 - s/200), lm = stdMath.min(l, 1-l);
    return hsl2rgb(h, 0 === lm ? 0 : 100*(v-l)/lm, 100*l);
}
function hwb2rgb(h, w, b)
{
    var b1 = 1 - b/100;
    return hsv2rgb(h, 100 - w/b1, 100*b1);
}
function rgb2hslvwb(r, g, b, asPercent, type)
{
    // https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
    // https://en.wikipedia.org/wiki/HWB_color_model
    var h, sl, sv, l, v, c, xmax, xmin, wh, bl;

    if (asPercent)
    {
        r /= 100;
        g /= 100;
        b /= 100;
    }
    else
    {
        r /= 255;
        g /= 255;
        b /= 255;
    }
    v = xmax = stdMath.max(r, g, b);
    wh = xmin = stdMath.min(r, g, b);
    bl = 1 - xmax;
    c = xmax - xmin;
    l = (xmax + xmin)/2;
    if (0 === c)
    {
        h = 0;
    }
    else if (v === r)
    {
        h = 60*(0 + (g - b)/c);
    }
    else if (v === g)
    {
        h = 60*(2 + (b - r)/c);
    }
    else //if (v === b)
    {
        h = 60*(4 + (r - g)/c);
    }
    if (0 === l || 1 === l)
    {
        sl = 0;
    }
    else
    {
        sl = (v - l)/stdMath.min(l, 1 - l);
    }
    if (0 === v)
    {
        sv = 0;
    }
    else
    {
        sv = c/v;
    }
    return 'hwb' === type ? [
    clamp(stdMath.round(h), 0, 360),
    clamp(wh*100, 0, 100),
    clamp(bl*100, 0, 100)
    ] : ('hsv' === type ? [
    clamp(stdMath.round(h), 0, 360),
    clamp(sv*100, 0, 100),
    clamp(v*100, 0, 100)
    ] : /*'hsl' === type*/[
    clamp(stdMath.round(h), 0, 360),
    clamp(sl*100, 0, 100),
    clamp(l*100, 0, 100)
    ]);
}
function rgb2hue(r, g, b, asPercent)
{
    var h, c, v, xmax, xmin;

    if (asPercent)
    {
        r /= 100;
        g /= 100;
        b /= 100;
    }
    else
    {
        r /= 255;
        g /= 255;
        b /= 255;
    }
    v = xmax = stdMath.max(r, g, b);
    xmin = stdMath.min(r, g, b);
    c = xmax - xmin;
    if (0 === c)
    {
        h = 0;
    }
    else if (v === r)
    {
        h = 60*(0 + (g - b)/c);
    }
    else if (v === g)
    {
        h = 60*(2 + (b - r)/c);
    }
    else //if (v === b)
    {
        h = 60*(4 + (r - g)/c);
    }
    return clamp(stdMath.round(h), 0, 360);
}
function rgb2sat(r, g, b, asPercent, type)
{
    var sl, sv, l, v, c, xmax, xmin;

    if (asPercent)
    {
        r /= 100;
        g /= 100;
        b /= 100;
    }
    else
    {
        r /= 255;
        g /= 255;
        b /= 255;
    }
    v = xmax = stdMath.max(r, g, b);
    xmin = stdMath.min(r, g, b);
    c = xmax - xmin;
    l = (xmax + xmin)/2;
    if (0 === l || 1 === l)
    {
        sl = 0;
    }
    else
    {
        sl = (v - l)/stdMath.min(l, 1 - l);
    }
    if (0 === v)
    {
        sv = 0;
    }
    else
    {
        sv = c/v;
    }
    return 'hsv' === type ? clamp(sv*100, 0, 100) : /*'hsl' === type*/clamp(sl*100, 0, 100);
}
function rgb2hsl(r, g, b, asPercent)
{
    return rgb2hslvwb(r, g, b, asPercent, 'hsl');
}
function rgb2hsv(r, g, b, asPercent)
{
    return rgb2hslvwb(r, g, b, asPercent, 'hsv');
}
function rgb2hwb(r, g, b, asPercent)
{
    return rgb2hslvwb(r, g, b, asPercent, 'hwb');
}
function rgb2cmyk(r, g, b, asPercent)
{
    var c = 0, m = 0, y = 0, k = 0, minCMY, invCMY;

    if (asPercent)
    {
        r = clamp(round(r*P2C), 0, 255);
        g = clamp(round(g*P2C), 0, 255);
        b = clamp(round(b*P2C), 0, 255);
    }

    // BLACK, k=1
    if (0 === r && 0 === g && 0 === b) return [0, 0, 0, 1];

    c = 1 - (r*C2F);
    m = 1 - (g*C2F);
    y = 1 - (b*C2F);

    minCMY = min(c, m, y);
    invCMY = 1 / (1 - minCMY);
    c = (c - minCMY) * invCMY;
    m = (m - minCMY) * invCMY;
    y = (y - minCMY) * invCMY;
    k = minCMY;

    return [c, m, y, k];
}
function cmyk2rgb(c, m, y, k)
{
    var r = 0, g = 0, b = 0, minCMY, invCMY;

    // BLACK
    if (0 === c && 0 === m && 0 === y) return [0, 0, 0];

    minCMY = k;
    invCMY = 1 - minCMY;
    c = c*invCMY + minCMY;
    m = m*invCMY + minCMY;
    y = y*invCMY + minCMY;

    r = (1 - c)*255;
    g = (1 - m)*255;
    b = (1 - y)*255;

    return [
        clamp(round(r), 0, 255),
        clamp(round(g), 0, 255),
        clamp(round(b), 0, 255)
    ];
}
function lightness(r, g, b)
{
    return (LUMA[0]*r + LUMA[1]*g + LUMA[2]*b);
}
var GLSL = [
'#define FORMAT_HWB 3',
'#define FORMAT_HSV 2',
'#define FORMAT_HSL 1',
'vec4 hsl2rgb(float h, float s, float l) {',
'   float c = (1.0 - abs(2.0*l - 1.0))*s;',
'   float hp = h/60.0;',
'   float d = float(floor(hp / 2.0));',
'   float x = c*(1.0 - abs(hp - 2.0*d - 1.0));',
'   float m = l - c/2.0;',
'   vec4 rgb = vec4(0.0,0.0,0.0,1.0);',
'   if (hp >= 0.0 && hp < 1.0) {',
'       rgb.r = c + m;',
'       rgb.g = x + m;',
'       rgb.b = m;',
'   } else if (hp >= 1.0 && hp < 2.0) {',
'       rgb.r = x + m;',
'       rgb.g = c + m;',
'       rgb.b = m;',
'   } else if (hp >= 2.0 && hp < 3.0) {',
'       rgb.r = m;',
'       rgb.g = c + m;',
'       rgb.b = x + m;',
'   } else if (hp >= 3.0 && hp < 4.0) {',
'       rgb.r = m;',
'       rgb.g = x + m;',
'       rgb.b = c + m;',
'   } else if (hp >= 4.0 && hp < 5.0) {',
'       rgb.r = x + m;',
'       rgb.g = m;',
'       rgb.b = c + m;',
'   } else {',
'       rgb.r = c + m;',
'       rgb.g = m;',
'       rgb.b = x + m;',
'   }',
'   return clamp(rgb, 0.0, 1.0);',
'}',
'vec4 hsv2rgb(float h, float s, float v) {',
'    float l = v*(1.0 - s/2.0);',
'    float lm = min(l, 1.0-l);',
'    if (0.0 == lm) return hsl2rgb(h, 0.0, l);',
'    else return hsl2rgb(h, (v-l)/lm, l);',
'}',
'vec4 hwb2rgb(float h, float w, float b) {',
'    float b1 = 1.0 - b;',
'    return hsv2rgb(h, 1.0 - w/b1, b1);',
'}',
'vec4 rgb2hslvwb(float r, float g, float b, int type) {',
'    float xmax = max(r, max(g, b));',
'    float xmin = min(r, min(g, b));',
'    float v = xmax;',
'    float c = xmax - xmin;',
'    float l = clamp((xmax + xmin)/2.0, 0.0, 1.0);',
'    float wh = clamp(xmin, 0.0, 1.0);',
'    float bl = clamp(1.0 - xmax, 0.0, 1.0);',
'    float h = 0.0;',
'    if (0.0 == c) {',
'        h = 0.0;',
'    } else if (v == r) {',
'        h = 60.0*((g - b)/c);',
'    } else if (v == g) {',
'        h = 60.0*(2.0 + (b - r)/c);',
'    } else {',
'        h = 60.0*(4.0 + (r - g)/c);',
'    }',
'    h = clamp(h, 0.0, 360.0);',
'   float sl; float sv;',
'    if (0.0 == l || 1.0 == l) {',
'        sl = 0.0;',
'    } else {',
'        sl = clamp((v - l)/min(l, 1.0 - l), 0.0, 1.0);',
'    }',
'    if (0.0 == v) {',
'        sv = 0.0;',
'    } else {',
'        sv = clamp(c/v, 0.0, 1.0);',
'    }',
'    v = clamp(v, 0.0, 1.0);',
'    if (FORMAT_HWB == type) return vec4(h, wh, bl, 1.0);',
'    else if (FORMAT_HSV == type) return vec4(h, sv, v, 1.0);',
'    return vec4(h, sl, l, 1.0);',
'}',
'vec4 rgb2hsl(float r, float g, float b) {',
'    return rgb2hslvwb(r, g, b, FORMAT_HSL);',
'}',
'vec4 rgb2hsv(float r, float g, float b) {',
'    return rgb2hslvwb(r, g, b, FORMAT_HSV);',
'}',
'vec4 rgb2hwb(float r, float g, float b) {',
'    return rgb2hslvwb(r, g, b, FORMAT_HWB);',
'}',
'vec4 rgb2cmyk(float r, float g, float b) {',
'    if (0.0 == r && 0.0 == g && 0.0 == b) {',
'       return vec4(0.0, 0.0, 0.0, 1.0);',
'    }',
'    float c = 1.0 - r;',
'    float m = 1.0 - g;',
'    float y = 1.0 - b;',
'    float minCMY = min(c, min(m, y));',
'    float invCMY = 1.0 / (1.0 - minCMY);',
'    return vec4(',
'        (c - minCMY) * invCMY,',
'        (m - minCMY) * invCMY,',
'        (y - minCMY) * invCMY,',
'        minCMY',
'    );',
'}',
'vec4 cmyk2rgb(float c, float m, float y, float k) {',
'    if (0.0 == c && 0.0 == m && 0.0 == y) {',
'        return vec4(0.0, 0.0, 0.0, 1.0);',
'    }',
'    float minCMY = k;',
'    float invCMY = 1.0 - minCMY;',
'    c = c*invCMY + minCMY;',
'    m = m*invCMY + minCMY;',
'    y = y*invCMY + minCMY;',
'    return vec4(',
'        1.0 - c,',
'        1.0 - m,',
'        1.0 - y,',
'        1.0',
'    );',
'}',
'vec4 rgb2ycbcr(float r, float g, float b) {',
'    return clamp(vec4(',
'    0.0 + 0.299*r    + 0.587*g     + 0.114*b,',
'    0.5 - 0.168736*r - 0.331264*g  + 0.5*b,',
'    0.5 + 0.5*r      - 0.418688*g  - 0.081312*b,',
'    1.0',
'    ), 0.0, 1.0);',
'}',
'vec4 ycbcr2rgb(float y, float cb, float cr) {',
'    return clamp(vec4(',
'    y                      + 1.402   * (cr-0.5),',
'    y - 0.34414 * (cb-0.5) - 0.71414 * (cr-0.5),',
'    y + 1.772   * (cb-0.5),',
'    1.0',
'    ), 0.0, 1.0);',
'}',
'float rgb2hue(float r, float g, float b) {',
'    return rgb2hslvwb(r, g, b, FORMAT_HSL).x;',
'}',
'float rgb2sat(float r, float g, float b, int type) {',
'    return rgb2hslvwb(r, g, b, type).y;',
'}',
'float intensity(float r, float g, float b) {',
'    return clamp('+LUMA[0]+'*r + '+LUMA[1]+'*g + '+LUMA[2]+'*b, 0.0, 1.0);',
'}'
].join('\n');
//
// Color Class and utils
var Color = FILTER.Color = FILTER.Class({

    //
    // static
    __static__: {

        GLSLCode: function() {
            return GLSL;
        },
        clamp: clamp,

        clampPixel: function(v) {
            return min(255, max(v, 0));
        },

        color24: function(r, g, b) {
            return ((r&255) << 16) | ((g&255) << 8) | (b&255);
        },

        color32: function(r, g, b, a) {
            return ((a&255) << 24) | ((r&255) << 16) | ((g&255) << 8) | (b&255);
        },

        rgb24: function(color) {
            return [(color >>> 16)&255, (color >>> 8)&255, color&255];
        },

        rgba32: function(color) {
            return [(color >>> 16)&255, (color >>> 8)&255, color&255, (color >>> 24)&255];
        },

        rgb24GL: function(color) {
            var toFloat = FILTER.Util.GLSL.formatFloat;
            return 'vec3('+[toFloat(((color >>> 16)&255)/255), toFloat(((color >>> 8)&255)/255), toFloat((color&255)/255)].join(',')+');';
        },

        rgba32GL: function(color) {
            var toFloat = FILTER.Util.GLSL.formatFloat;
            return 'vec4('+[toFloat(((color >>> 16)&255)/255), toFloat(((color >>> 8)&255)/255), toFloat((color&255)/255), toFloat(((color >>> 24)&255)/255)].join(',')+');';
        },

        intensity: function(r, g, b) {
            return ~~lightness(r, g, b);
        },

        hue: function(r, g, b) {
            return rgb2hue(r, g, b);
        },

        saturation: function(r, g, b) {
            return rgb2sat(r, g, b, false, 'hsv')*2.55;
        },

        dist: function(ccc1, ccc2, p1, p2) {
            //p1 = p1 || 0; p2 = p2 || 0;
            var d0 = ccc1[p1+0]-ccc2[p2+0], d1 = ccc1[p1+1]-ccc2[p2+1], d2 = ccc1[p1+2]-ccc2[p2+2];
            return sqrt(d0*d0 + d1*d1 + d2*d2);
        },

        RGB2Gray: function(rgb, p) {
            //p = p || 0;
            var g = (LUMA[0]*rgb[p+0] + LUMA[1]*rgb[p+1] + LUMA[2]*rgb[p+2])|0;
            rgb[p+0] = g; rgb[p+1] = g; rgb[p+2] = g;
            return rgb;
        },

        RGB2Color: function(rgb, p) {
            //p = p || 0;
            return ((rgb[p+0]&255) << 16) | ((rgb[p+1]&255) << 8) | (rgb[p+2]&255);
        },

        RGBA2Color: function(rgba, p) {
            //p = p || 0;
            return ((rgba[p+3]&255) << 24) | ((rgba[p+0]&255) << 16) | ((rgba[p+1]&255) << 8) | (rgba[p+2]&255);
        },

        Color2RGBA: function(c, rgba, p) {
            /*p = p || 0;*/ c = c|0;
            rgba[p+0] = (c >>> 16) & 255;
            rgba[p+1] = (c >>> 8) & 255;
            rgba[p+2] = (c & 255);
            rgba[p+3] = (c >>> 24) & 255;
            return rgba;
        },

        // https://www.cs.rit.edu/~ncs/color/t_convert.html#RGB%20to%20XYZ%20&%20XYZ%20to%20RGB
        RGB2XYZ: function(ccc, p) {
            //p = p || 0;
            var r = ccc[p+0], g = ccc[p+1], b = ccc[p+2];
            // each take full range from 0-255
            ccc[p+0] = ( 0.412453*r + 0.357580*g + 0.180423*b )|0;
            ccc[p+1] = ( 0.212671*r + 0.715160*g + 0.072169*b )|0;
            ccc[p+2] = ( 0.019334*r + 0.119193*g + 0.950227*b )|0;
            return ccc;
        },

        // https://www.cs.rit.edu/~ncs/color/t_convert.html#RGB%20to%20XYZ%20&%20XYZ%20to%20RGB
        XYZ2RGB: function(ccc, p) {
            //p = p || 0;
            var x = ccc[p+0], y = ccc[p+1], z = ccc[p+2];
            // each take full range from 0-255
            ccc[p+0] = ( 3.240479*x - 1.537150*y - 0.498535*z )|0;
            ccc[p+1] = (-0.969256*x + 1.875992*y + 0.041556*z )|0;
            ccc[p+2] = ( 0.055648*x - 0.204043*y + 1.057311*z )|0;
            return ccc;
        },

        /*RGB2LAB: function(ccc, p) {
            //p = p || 0;
            var r = ccc[p+0], g = ccc[p+1], b = ccc[p+2],
                K1 = 1.0 / 1.055, K2 = 1.0 / 12.92, Xr = 1.0 / 95.047, Yr = 1.0 / 100.0, Zr = 1.0 / 108.883,
                e = 0.008856, k = 7.787, S = 16.0 / 116.0, S2 = 1.0 / 2.4, OneThird = 1.0 / 3.0,
                R = r / 255, G = g / 255, B = b / 255, xr, y, zr, fx, fy, fz;

            // Inverse sRBG Companding http://www.brucelindbloom.com/index.html?Math.html
            r = R > 0.04045 ? (stdMath.pow((R + 0.055) * K1, 2.4) * 100.0) : (R * K2 * 100.0);
            g = G > 0.04045 ? (stdMath.pow((G + 0.055) * K1, 2.4) * 100.0) : (G * K2 * 100.0);
            b = B > 0.04045 ? (stdMath.pow((B + 0.055) * K1, 2.4) * 100.0) : (B * K2 * 100.0);

            // Step 2. Linear RGB to XYZ
            xr = (r * 0.4124 + g * 0.3576 + b * 0.1805) * Xr;
            yr = (r * 0.2126 + g * 0.7152 + b * 0.0722) * Yr;
            zr = (r * 0.0193 + g * 0.1192 + b * 0.9505) * Zr;

            fx = xr > e ? stdMath.pow(xr, OneThird) : (k * xr) + S;
            fy = yr > e ? stdMath.pow(yr, OneThird) : (k * yr) + S;
            fz = zr > e ? stdMath.pow(zr, OneThird) : (k * zr) + S;

            // each take full range from 0-255
            ccc[p+0] = ( 116.0 * fy - 16.0 )|0;
            ccc[p+1] = ( 500.0 * (fx - fy) )|0;
            ccc[p+2] = ( 200.0 * (fy - fz) )|0;
            return ccc;
        },

        LAB2RGB: function(ccc, p) {
            //p = p || 0;
            var L = ccc[p+0], A = ccc[p+1], B = ccc[p+2],
                e = 0.008856, k = 7.787, S = 16.0 / 116.0, S2 = 1.0 / 2.4,
                Xr = 95.047, Yr = 100.000, Zr = 108.883,
                K1 = 1.0 / 116.0, K2 = 1.0 / 500.0, K3 = 1.0 / 200.0,
                K4 = 1.0 / k, W = 0.0031308,
                Xr2 = 1.0 / 100.0, Yr2 = 1.0 / 100.0, Zr2 = 1.0 / 100.0,
                fx, fy, fz, xr, yr, zr, X, Y, Z, r, g, b;

            fy = (L + 16.0) * K1;
            fx = (A * K2) + fy;
            fz = fy - (B * K3);

            yr = fy * fy * fy;
            if (yr <= e) yr = (fy - S) * K4;
            xr = fx * fx * fx;
            if (xr <= e) xr = (fx - S) * K4;
            zr = fz * fz * fz;
            if (zr <= e) zr = (fz - S) * K4;

            X = xr * Xr * Xr2;
            Y = yr * Yr * Yr2;
            Z = zr * Zr * Zr2;

            // Step 1.  XYZ to Linear RGB
            r = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
            g = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
            b = X * 0.0557 + Y * -0.2040 + Z * 1.0570;

            // Step 2.  Companding
            // sRGB Companding
            // each take full range from 0-255
            ccc[p+0] = ( r > W ? (1.055 * stdMath.pow(r, S2) - 0.055) : (12.92 * r) )|0;
            ccc[p+1] = ( g > W ? (1.055 * stdMath.pow(g, S2) - 0.055) : (12.92 * g) )|0;
            ccc[p+2] = ( b > W ? (1.055 * stdMath.pow(b, S2) - 0.055) : (12.92 * b) )|0;
            return ccc;
        },*/

        // https://www.cs.harvard.edu/~sjg/papers/cspace.pdf
        RGB2ILL: function(ccc, p) {
            //p = p || 0;
            var r = ccc[p+0]/255, g = ccc[p+1]/255, b = ccc[p+2]/255, x, y, z, xi, yi, zi, ln = Math.log;
            // RGB to XYZ
            // each take full range from 0-255
            x = ( 0.412453*r + 0.357580*g + 0.180423*b );
            y = ( 0.212671*r + 0.715160*g + 0.072169*b );
            z = ( 0.019334*r + 0.119193*g + 0.950227*b );
            // B matrix and logarithm transformation
            xi = ln( 0.9465229*x + 0.2946927*y - 0.1313419*z );
            yi = ln(-0.1179179*x + 0.9929960*y + 0.007371554*z );
            zi = ln( 0.09230461*x - 0.04645794*y + 0.9946464*z );
            // A matrix
            ccc[p+0] = ( 27.07439*xi - 22.80783*yi - 1.806681*zi );
            ccc[p+1] = (-5.646736*xi - 7.722125*yi + 12.86503*zi );
            ccc[p+2] = (-4.163133*xi - 4.579428*yi - 4.576049*zi );
            return ccc;
        },

        // https://www.cs.harvard.edu/~sjg/papers/cspace.pdf
        // http://matrix.reshish.com/inverCalculation.php
        ILL2RGB: function(ccc, p) {
            //p = p || 0;
            var r = ccc[p+0], g = ccc[p+1], b = ccc[p+2], x, y, z, xi, yi, zi, exp = Math.exp;
            // inverse A matrix and inverse logarithm
            xi = exp( 0.021547742011105847*r - 0.021969518919866274*g - 0.07027206572176435*b );
            yi = exp(-0.018152109501074376*r - 0.03004415376911152*g - 0.07729896865586937*b );
            zi = exp(-0.0014378861182725712*r + 0.050053456205559545*g - 0.07724195758868482*b );
            // inverse B matrix
            x = ( 1.0068824301911365*xi - 0.2924918682640871*yi + 0.13512537828457516*zi );
            y = ( 0.12021888110585245*xi + 0.9717816461525606*yi + 0.008672665360769691*zi );
            z = (-0.08782494811157235*xi + 0.07253363731909634*yi + 0.9932476695469974*zi );
            // XYZ to RGB
            ccc[p+0] = ( 3.240479*x - 1.537150*y - 0.498535*z )|0;
            ccc[p+1] = (-0.969256*x + 1.875992*y + 0.041556*z )|0;
            ccc[p+2] = ( 0.055648*x - 0.204043*y + 1.057311*z )|0;
            return ccc;
        },

        // http://en.wikipedia.org/wiki/YCbCr
        RGB2YCbCr: function(ccc, p) {
            //p = p || 0;
            var r = ccc[p+0], g = ccc[p+1], b = ccc[p+2];
            // each take full range from 0-255
            ccc[p+0] = ( 0   + 0.299*r    + 0.587*g     + 0.114*b    )|0;
            ccc[p+1] = ( 128 - 0.168736*r - 0.331264*g  + 0.5*b      )|0;
            ccc[p+2] = ( 128 + 0.5*r      - 0.418688*g  - 0.081312*b )|0;
            return ccc;
        },

        // http://en.wikipedia.org/wiki/YCbCr
        YCbCr2RGB: function(ccc, p) {
            //p = p || 0;
            var y = ccc[p+0], cb = ccc[p+1], cr = ccc[p+2];
            // each take full range from 0-255
            ccc[p+0] = ( y                      + 1.402   * (cr-128) )|0;
            ccc[p+1] = ( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) )|0;
            ccc[p+2] = ( y + 1.772   * (cb-128) )|0;
            return ccc;
        },

        RGB2HSV: function(ccc, p, unscaled)  {
            //p = p || 0;
            var hsv = rgb2hsv(ccc[p+0], ccc[p+1], ccc[p+2]);
            ccc[p+0] = unscaled ? hsv[0] : hsv[0]*255/360;
            ccc[p+1] = unscaled ? hsv[1] : hsv[1]*2.55;
            ccc[p+2] = unscaled ? hsv[2] : hsv[2]*2.55;
            return ccc;
        },

        RGB2HSL: function(ccc, p, unscaled)  {
            //p = p || 0;
            var hsl = rgb2hsl(ccc[p+0], ccc[p+1], ccc[p+2]);
            ccc[p+0] = unscaled ? hsl[0] : hsl[0]*255/360;
            ccc[p+1] = unscaled ? hsl[1] : hsl[1]*2.55;
            ccc[p+2] = unscaled ? hsl[2] : hsl[2]*2.55;
            return ccc;
        },

        RGB2HWB: function(ccc, p, unscaled)  {
            //p = p || 0;
            var hsl = rgb2hwb(ccc[p+0], ccc[p+1], ccc[p+2]);
            ccc[p+0] = unscaled ? hsl[0] : hsl[0]*255/360;
            ccc[p+1] = unscaled ? hsl[1] : hsl[1]*2.55;
            ccc[p+2] = unscaled ? hsl[2] : hsl[2]*2.55;
            return ccc;
        },

        HSV2RGB: function(ccc, p, unscaled) {
            //p = p || 0;
            var rgb = hsv2rgb(ccc[p+0]*(unscaled ? 1 : 360/255), ccc[p+1]*(unscaled ? 1 : 100/255), ccc[p+2]*(unscaled ? 1 : 100/255));
            ccc[p+0] = rgb[0];
            ccc[p+1] = rgb[1];
            ccc[p+2] = rgb[2];
            return ccc;
        },

        HSL2RGB: function(ccc, p, unscaled) {
            //p = p || 0;
            var rgb = hsl2rgb(ccc[p+0]*(unscaled ? 1 : 360/255), ccc[p+1]*(unscaled ? 1 : 100/255), ccc[p+2]*(unscaled ? 1 : 100/255));
            ccc[p+0] = rgb[0];
            ccc[p+1] = rgb[1];
            ccc[p+2] = rgb[2];
            return ccc;
        },

        HWB2RGB: function(ccc, p, unscaled) {
            //p = p || 0;
            var rgb = hwb2rgb(ccc[p+0]*(unscaled ? 1 : 360/255), ccc[p+1]*(unscaled ? 1 : 100/255), ccc[p+2]*(unscaled ? 1 : 100/255));
            ccc[p+0] = rgb[0];
            ccc[p+1] = rgb[1];
            ccc[p+2] = rgb[2];
            return ccc;
        },

        RGB2CMYK: function(ccc, p)  {
            //p = p || 0;
            var c = 0, m = 0, y = 0, k = 0, invCMY,
                r = ccc[p+0], g = ccc[p+1], b = ccc[p+2];

            // BLACK, k=255
            if (0 === r && 0 === g && 0 === b) return ccc;

            c = 255 - r;
            m = 255 - g;
            y = 255 - b;

            k = min(c, m, y);
            invCMY = 255 === k ? 0 : 255 / (255 - k);
            ccc[p+0] = (c - k) * invCMY;
            ccc[p+1] = (m - k) * invCMY;
            ccc[p+2] = (y - k) * invCMY;

            return ccc;
        },

        toString: function() {
            return "[" + "FILTER: " + this.name + "]";
        },

        C2F: C2F,
        C2P: C2P,
        P2C: P2C,

        // color format regexes
        hexieRE: /^#([0-9a-fA-F]{8})\b/,
        hexRE: /^#([0-9a-fA-F]{3,6})\b/,
        rgbRE: /^(rgba?)\b\s*\(([^\)]*)\)/i,
        hslRE: /^(hsla?)\b\s*\(([^\)]*)\)/i,
        colorstopRE: /^\s+(\d+(\.\d+)?%?)/,

        // color format conversions
        // http://www.rapidtables.com/convert/color/index.htm
        col2per: function(c, suffix) {
            return (c*C2P)+(suffix||'');
        },
        per2col: function(c) {
            return c*P2C;
        },

        rgb2hex: function(r, g, b, condenced, asPercent) {
            var hex;
            if (asPercent)
            {
                r = clamp(round(r*P2C), 0, 255);
                g = clamp(round(g*P2C), 0, 255);
                b = clamp(round(b*P2C), 0, 255);
            }
            r = r < 16 ? '0'+r.toString(16) : r.toString(16);
            g = g < 16 ? '0'+g.toString(16) : g.toString(16);
            b = b < 16 ? '0'+b.toString(16) : b.toString(16);
            hex = condenced && (r[0]===r[1] && g[0]===g[1] && b[0]===b[1]) ? ('#'+r[0]+g[0]+b[0]) : ('#'+r+g+b);
            return hex;
        },
        rgb2hexIE: function(r, g, b, a, asPercent) {
            var hex;
            if (asPercent)
            {
                r = clamp(round(r*P2C), 0, 255);
                g = clamp(round(g*P2C), 0, 255);
                b = clamp(round(b*P2C), 0, 255);
                a = clamp(round(a*P2C), 0, 255);
            }

            r = r < 16 ? '0'+r.toString(16) : r.toString(16);
            g = g < 16 ? '0'+g.toString(16) : g.toString(16);
            b = b < 16 ? '0'+b.toString(16) : b.toString(16);
            a = a < 16 ? '0'+a.toString(16) : a.toString(16);
            hex = '#' + a + r + g + b;

            return hex;
        },
        hex2rgb: function(h/*, asPercent*/) {
            if (!h || 3 > h.length) return [0, 0, 0];

            return 6 > h.length ? [
                clamp(parseInt(h[0]+h[0], 16), 0, 255),
                clamp(parseInt(h[1]+h[1], 16), 0, 255),
                clamp(parseInt(h[2]+h[2], 16), 0, 255)
            ] : [
                clamp(parseInt(h[0]+h[1], 16), 0, 255),
                clamp(parseInt(h[2]+h[3], 16), 0, 255),
                clamp(parseInt(h[4]+h[5], 16), 0, 255)
            ];
            /*if (asPercent)
                rgb = [
                    (rgb[0]*C2P)+'%',
                    (rgb[1]*C2P)+'%',
                    (rgb[2]*C2P)+'%'
                ];*/
        },
        hue2rgb: function(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        },
        hsl2rgb: function(h, s, l) {
            return hsl2rgb(h, s, l);
        },
        hsv2rgb: function(h, s, v) {
            return hsv2rgb(h, s, v);
        },
        hwb2rgb: function(h, w, b) {
            return hwb2rgb(h, w, b);
        },
        rgb2hsl: function(r, g, b, asPercent) {
            return rgb2hsl(r, g, b, asPercent);
        },
        rgb2hsv: function(r, g, b, asPercent) {
            return rgb2hsv(r, g, b, asPercent);
        },
        rgb2hwb: function(r, g, b, asPercent) {
            return rgb2hwb(r, g, b, asPercent);
        },
        rgb2cmyk: function(r, g, b, asPercent) {
            return rgb2cmyk(r, g, b, asPercent);
        },
        cmyk2rgb: function(c, m, y, k) {
            return cmyk2rgb(c, m, y, k);
        },

        parse: function parse(s) {
            var m, m2, hasOpacity, rgb = null, opacity = 1, c = null, end = 0, end2 = 0, kw = null;
            s = trim(String(s)).toLowerCase();
            if (m = s.match(hexRE))
            {
                // hex
                rgb = hex2rgb(m[1]);
                opacity = 1;
                end = m[0].length;
                end2 = 0;
            }
            else if (m = s.match(hwbRE))
            {
                // hwb(a)
                hasOpacity = m[2].match(aRE);
                var col = trim(m[2]).split(sepRE).map(trim),
                    h = col[0] ? col[0] : '0',
                    w = col[1] ? col[1] : '0',
                    b = col[2] ? col[2] : '0',
                    a = hasOpacity ? hasOpacity[1] : '1';
                h = parseFloat(h, 10);
                w = '%' === w.slice(-1) ? parseFloat(w, 10) : parseFloat(w, 10)*100/255;
                b = '%' === b.slice(-1) ? parseFloat(b, 10) : parseFloat(b, 10)*100/255;
                a = '%' === a.slice(-1) ? parseFloat(a, 10)/100 : parseFloat(a, 10);
                rgb = hwb2rgb(h, w, b);
                opacity = a;
                end = m[0].length;
                end2 = 0;
            }
            else if (m = s.match(hslRE))
            {
                // hsl(a)
                hasOpacity = m[2].match(aRE);
                var col = trim(m[2]).split(sepRE).map(trim),
                    h = col[0] ? col[0] : '0',
                    s = col[1] ? col[1] : '0',
                    l = col[2] ? col[2] : '0',
                    a = hasOpacity ? hasOpacity[1] : ('hsla' === m[1] && null != col[3] ? col[3] : '1');
                h = parseFloat(h, 10);
                s = '%' === s.slice(-1) ? parseFloat(s, 10) : parseFloat(s, 10)*100/255;
                l = '%' === l.slice(-1) ? parseFloat(l, 10) : parseFloat(l, 10)*100/255;
                a = '%' === a.slice(-1) ? parseFloat(a, 10)/100 : parseFloat(a, 10);
                rgb = hsl2rgb(h, s, l);
                opacity = a;
                end = m[0].length;
                end2 = 0;
            }
            else if (m = s.match(rgbRE))
            {
                // rgb(a)
                hasOpacity = m[2].match(aRE);
                var col = trim(m[2]).split(sepRE).map(trim),
                    r = col[0] ? col[0] : '0',
                    g = col[1] ? col[1] : '0',
                    b = col[2] ? col[2] : '0',
                    a = hasOpacity ? hasOpacity[1] : ('rgba' === m[1] && null != col[3] ? col[3] : '1');
                r = '%' === r.slice(-1) ? parseFloat(r, 10)*2.55 : parseFloat(r, 10);
                g = '%' === g.slice(-1) ? parseFloat(g, 10)*2.55 : parseFloat(g, 10);
                b = '%' === b.slice(-1) ? parseFloat(b, 10)*2.55 : parseFloat(b, 10);
                a = '%' === a.slice(-1) ? parseFloat(a, 10)/100 : parseFloat(a, 10);
                rgb = [r, g, b];
                opacity = a;
                end = m[0].length;
                end2 = 0;
            }
            if (rgb) return new Color().fromRGB([rgb[0], rgb[1], rgb[2], opacity]);
        },
        /*parse: function(s, parsed, onlyColor) {
            var m, m2, s2, end = 0, end2 = 0, c, hasOpacity;

            if ('hsl' === parsed ||
                (!parsed && (m = s.match(Color.hslRE)))
            )
            {
                // hsl(a)
                if ('hsl' === parsed)
                {
                    hasOpacity = 'hsla' === s[0].toLowerCase();
                    var col = s[1].split(',').map(trim);
                }
                else
                {
                    end = m[0].length;
                    end2 = 0;
                    hasOpacity = 'hsla' === m[1].toLowerCase();
                    var col = m[2].split(',').map(trim);
                }

                var h = col[0] ? col[0] : '0';
                var s = col[1] ? col[1] : '0';
                var l = col[2] ? col[2] : '0';
                var a = hasOpacity && null!=col[3] ? col[3] : '1';

                h = parseFloat(h, 10);
                s = ('%'===s.slice(-1)) ? parseFloat(s, 10) : parseFloat(s, 10)*C2P;
                l = ('%'===l.slice(-1)) ? parseFloat(l, 10) : parseFloat(l, 10)*C2P;
                a = parseFloat(a, 10);

                c = new Color().fromHSL([h, s, l, a]);

                return onlyColor ? c : [c, 0, end+end2];
            }
            if ('rgb' === parsed ||
                (!parsed && (m = s.match(Color.rgbRE)))
            )
            {
                // rgb(a)
                if ('rgb' === parsed)
                {
                    hasOpacity = 'rgba' === s[0].toLowerCase();
                    var col = s[1].split(',').map(trim);
                }
                else
                {
                    end = m[0].length;
                    end2 = 0;
                    hasOpacity = 'rgba' === m[1].toLowerCase();
                    var col = m[2].split(',').map(trim);
                }

                var r = col[0] ? col[0] : '0';
                var g = col[1] ? col[1] : '0';
                var b = col[2] ? col[2] : '0';
                var a = hasOpacity && null!=col[3] ? col[3] : '1';

                r = ('%'===r.slice(-1)) ? parseFloat(r, 10)*2.55 : parseFloat(r, 10);
                g = ('%'===g.slice(-1)) ? parseFloat(g, 10)*2.55 : parseFloat(g, 10);
                b = ('%'===b.slice(-1)) ? parseFloat(b, 10)*2.55 : parseFloat(b, 10);
                a = parseFloat(a, 10);

                c = new Color().fromRGB([r, g, b, a]);

                return onlyColor ? c : [c, 0, end+end2];
            }
            if ('hex' === parsed ||
                (!parsed && (m = s.match(Color.hexRE)))
            )
            {
                // hex
                if ('hex' === parsed)
                {
                    var col = Color.hex2rgb(s[0]);
                }
                else
                {
                    end = m[0].length;
                    end2 = 0;
                    var col = Color.hex2rgb(m[1]);
                }

                var h1 = col[0] ? col[0] : 0x00;
                var h2 = col[1] ? col[1] : 0x00;
                var h3 = col[2] ? col[2] : 0x00;
                var a = null!=col[3] ? col[3] : 0xff;

                c = new Color().fromHEX([h1, h2, h3, a]);

                return onlyColor ? c : [c, 0, end+end2];
            }
            return null;
        },*/
        fromString: function(s/*, parsed*/) {
            return Color.parse(s/*, parsed, 1*/);
        },
        fromRGB: function(rgb) {
            return new Color().fromRGB(rgb);
        },
        fromHSL: function(hsl) {
            return new Color().fromHSL(hsl);
        },
        fromHSV: function(hsv) {
            return new Color().fromHSV(hsv);
        },
        fromHWB: function(hwb) {
            return new Color().fromHWB(hwb);
        },
        fromCMYK: function(cmyk) {
            return new Color().fromCMYK(cmyk);
        },
        fromHEX: function(hex) {
            return new Color().fromHEX(hex);
        },
        fromPixel: function(pixCol) {
            return new Color().fromPixel(pixCol);
        }
    },

    constructor: function Color(color) {
        // constructor factory pattern used here also
        if (this instanceof Color)
        {
            this.reset();
            if (color) this.set(color);
        }
        else
        {
            return new Color(color);
        }
    },

    name: "Color",
    col: null,
    kword: null,

    clone: function() {
        var c = new Color();
        c.col = this.col.slice();
        c.kword = this.kword;
        return c;
    },

    reset: function() {
        this.col = [0, 0, 0, 1];
        this.kword = null;
        return this;
    },

    set: function(color) {
        if (color)
        {
            if (null != color[0])
                this.col[0] = clamp(color[0], 0, 255);
            if (null != color[1])
                this.col[1] = clamp(color[1], 0, 255);
            if (null != color[2])
                this.col[2] = clamp(color[2], 0, 255);
            if (null != color[3])
                this.col[3] = clamp(color[3], 0, 1);
            else
                this.col[3] = 1;

            this.kword = null;
        }
        return this;
    },

    isLight: function(threshold) {
        if (null == threshold) threshold = 127.5;
        return threshold <= lightness(this.col[0], this.col[1], this.col[2]);
    },

    isTransparent: function() {
        return 1 > this.col[3];
    },

    fromPixel: function(color) {
        color = color || 0;
        this.col = [
            clamp((color>>16)&255, 0, 255),
            clamp((color>>8)&255, 0, 255),
            clamp((color)&255, 0, 255),
            clamp(((color>>24)&255)*C2F, 0, 1)
        ];
        this.kword = null;

        return this;
    },

    fromHEX: function(hex) {

        this.col[0] = hex[0] ? clamp(parseInt(hex[0], 10), 0, 255) : 0;
        this.col[1] = hex[1] ? clamp(parseInt(hex[1], 10), 0, 255) : 0;
        this.col[2] = hex[2] ? clamp(parseInt(hex[2], 10), 0, 255) : 0;
        this.col[3] = null!=hex[3] ? clamp(parseInt(hex[3], 10)*C2F, 0, 1) : 1;

        this.kword = null;

        return this;
    },

    fromRGB: function(rgb) {

        this.col[0] = rgb[0] ? clamp(round(rgb[0]), 0, 255) : 0;
        this.col[1] = rgb[1] ? clamp(round(rgb[1]), 0, 255) : 0;
        this.col[2] = rgb[2] ? clamp(round(rgb[2]), 0, 255) : 0;
        this.col[3] = null!=rgb[3] ? clamp(rgb[3], 0, 1) : 1;

        this.kword = null;

        return this;
    },

    fromCMYK: function(cmyk) {
        var rgb = cmyk2rgb(cmyk[0]||0, cmyk[1]||0, cmyk[2]||0, cmyk[3]||0);

        this.col[0] = rgb[0];
        this.col[1] = rgb[1];
        this.col[2] = rgb[2];
        this.col[3] = null!=cmyk[4] ? clamp(cmyk[4], 0, 1) : 1;

        this.kword = null;

        return this;
    },

    fromHSL: function(hsl) {
        var rgb = hsl2rgb(hsl[0]||0, hsl[1]||0, hsl[2]||0);

        this.col[0] = rgb[0];
        this.col[1] = rgb[1];
        this.col[2] = rgb[2];
        this.col[3] = null!=hsl[3] ? clamp(hsl[3], 0, 1) : 1;

        this.kword = null;

        return this;
    },

    fromHSV: function(hsv) {
        var rgb = hsv2rgb(hsv[0]||0, hsv[1]||0, hsv[2]||0);

        this.col[0] = rgb[0];
        this.col[1] = rgb[1];
        this.col[2] = rgb[2];
        this.col[3] = null!=hsv[3] ? clamp(hsv[3], 0, 1) : 1;

        this.kword = null;

        return this;
    },

    fromHWB: function(hwb) {
        var rgb = hwb2rgb(hwb[0]||0, hwb[1]||0, hwb[2]||0);

        this.col[0] = rgb[0];
        this.col[1] = rgb[1];
        this.col[2] = rgb[2];
        this.col[3] = null!=hwb[3] ? clamp(hwb[3], 0, 1) : 1;

        this.kword = null;

        return this;
    },

    toPixel: function(withTransparency) {
        if (withTransparency)
            return ((clamp(this.col[3]*255, 0, 255) << 24) | (this.col[0] << 16) | (this.col[1] << 8) | (this.col[2])&255);
        else
            return ((this.col[0] << 16) | (this.col[1] << 8) | (this.col[2])&255);
    },

    toCMYK: function(asString, condenced, noTransparency) {
        var cmyk = rgb2cmyk(this.col[0], this.col[1], this.col[2]);
        if (noTransparency)
            return cmyk;
        else
            return cmyk.concat(this.col[3]);
    },

    toHEX: function(asString, condenced, withTransparency) {
        if (withTransparency)
            return Color.rgb2hexIE(this.col[0], this.col[1], this.col[2], clamp(round(255*this.col[3]), 0, 255));
        else
            return Color.rgb2hex(this.col[0], this.col[1], this.col[2], condenced);
    },

    toRGB: function(asString, condenced, noTransparency) {
        var opcty = this.col[3];
        if (asString)
        {
            if (condenced)
            {
                opcty =  ((1 > opcty && opcty > 0) ? opcty.toString().slice(1) : opcty);
            }

            if (noTransparency || 1 == this.col[3])
                return 'rgb(' + this.col.slice(0, 3).join(',') + ')';
            else
                return 'rgba(' + this.col.slice(0, 3).concat(opcty).join(',') + ')';
        }
        else
        {
            if (noTransparency)
                return this.col.slice(0, 3);
            else
                return this.col.slice();
        }
    },

    toHSL: function(asString, condenced, noTransparency) {
        var opcty = this.col[3];
        var hsl = rgb2hsl(this.col[0], this.col[1], this.col[2]);

        if (asString)
        {
            if (condenced)
            {
                hsl[1] = (0==hsl[1] ? hsl[1] : (hsl[1]+'%'));
                hsl[2] = (0==hsl[2] ? hsl[2] : (hsl[2]+'%'));
                opcty =  ((1 > opcty && opcty > 0) ? opcty.toString().slice(1) : opcty );
            }

            if (noTransparency || 1 == this.col[3])
                return 'hsl(' + [hsl[0], hsl[1], hsl[2]].join(',') + ')';
            else
                return 'hsla(' + [hsl[0], hsl[1], hsl[2], opcty].join(',') + ')';
        }
        else
        {
            if (noTransparency)
                return hsl;
            else
                return hsl.concat(this.col[3]);
        }
    },

    toHWB: function(asString, condenced, noTransparency) {
        var opcty = this.col[3];
        var hwb = rgb2hwb(this.col[0], this.col[1], this.col[2]);

        if (asString)
        {
            if (condenced)
            {
                hwb[1] = (0 === hwb[1] ? hwb[1] : (String(hwb[1])+'%'));
                hwb[2] = (0 === hwb[2] ? hwb[2] : (String(hwb[2])+'%'));
                opcty = 1 > opcty && opcty > 0 ? opcty.toString().slice(1) : opcty;
            }

            if (noTransparency || 1 === this.col[3])
                return 'hwb(' + [hwb[0], hwb[1], hwb[2]].join(' ') + ')';
            else
                return 'hwb(' + [hwb[0], hwb[1], hwb[2]].join(' ') + ' / ' + opcty + ')';
        }
        else
        {
            if (noTransparency)
                return hwb;
            else
                return hwb.concat(this.col[3]);
        }
    },

    toString: function(format, condenced) {
        format = format ? format.toLowerCase() : 'hex';
        if ('rgb' === format || 'rgba' === format)
        {
            return this.toRGB(1, false !== condenced, 'rgb' === format);
        }
        else if ('hsl' === format || 'hsla' === format)
        {
            return this.toHSL(1, false !== condenced, 'hsl' === format);
        }
        else if ('hwb' === format)
        {
            return this.toHWB(1, false !== condenced, false);
        }
        return this.toHEX(1, false !== condenced, 'hexie' === format);
    }
});
// aliases and utilites
Color.toGray = Color.intensity;

}(FILTER);