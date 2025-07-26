/**
*   CanvasLite
*   an html canvas implementation in pure JavaScript
*
*   @version 1.0.1 (2025-07-06 14:11:55)
*   https://github.com/foo123/CanvasLite
*
**//**
*   CanvasLite
*   an html canvas implementation in pure JavaScript
*
*   @version 1.0.1 (2025-07-06 14:11:55)
*   https://github.com/foo123/CanvasLite
*
**/
!function(root, name, factory) {
"use strict";
if (('object' === typeof module) && module.exports) /* CommonJS */
    module.exports = factory.call(root);
else if (('function' === typeof define) && define.amd && ('function' === typeof require) && ('function' === typeof require.specified) && require.specified(name) /*&& !require.defined(name)*/) /* AMD */
    define(name, ['module'], function(module) {return factory.call(root);});
else if (!(name in root)) /* Browser/WebWorker/.. */
    (root[name] = factory.call(root)||1) && ('function' === typeof(define)) && define.amd && define(function() {return root[name];});
}(  /* current root */          'undefined' !== typeof self ? self : this,
    /* module name */           "CanvasLite",
    /* module factory */        function ModuleFactory__CanvasLite(undef) {
"use strict";

var PROTO = 'prototype',
    def = Object.defineProperty,
    HAS = Object[PROTO].hasOwnProperty,
    toString = Object[PROTO].toString,
    isNode = ("undefined" !== typeof global) && ("[object global]" === toString.call(global)),
    isBrowser = ("undefined" !== typeof window) && ("[object Window]" === toString.call(window)),
    stdMath = Math, INF = Infinity, EPSILON = Number.EPSILON,
    sqrt2 = stdMath.sqrt(2), is_nan = isNaN, is_finite = isFinite,
    positive_number = function(x) {x = +x; return !is_nan(x) && is_finite(x) && (0 < x);},
    PI = stdMath.PI, TWO_PI = 2*PI, HALF_PI = PI/2,
    NUM_POINTS = 6, MIN_LEN = sqrt2, PIXEL_SIZE = 0.5, EPS = 1e-6,
    ImArray = 'undefined' !== typeof Uint8ClampedArray ? Uint8ClampedArray : ('undefined' !== typeof Uint8Array ? Uint8Array : Array),
    BLANK = [0, 0, 0, 0],
    COMMAND = /[MLHVCSQTAZ]/gi,
    NUMBER = /-?(?:(?:\d+\.\d+)|(?:\.\d+)|(?:\d+))/g
;
/**
*   Rasterizer
*   rasterize, stroke and fill lines, rectangles, curves and paths
*
*   @version 1.1.1
*   https://github.com/foo123/Rasterizer
*
**/
function Rasterizer(width, height, set_rgba_at, get_rgba_from)
{
    var self = this, ctx2D;
    if (!(self instanceof Rasterizer)) return new Rasterizer(width, height, set_rgba_at, get_rgba_from);

    get_rgba_from = get_rgba_from || (set_rgba_at && set_rgba_at.$target ? Rasterizer.getRGBAFrom(set_rgba_at.$target) : function(x, y) {return BLANK;});
    ctx2D = new RenderingContext2D(width, height, set_rgba_at, get_rgba_from);

    def(self, 'width', {
        get: function() {
            return width;
        },
        set: function(w) {
        }
    });
    def(self, 'height', {
        get: function() {
            return height;
        },
        set: function(h) {
        }
    });
    self.getContext = function(type) {
        if ('2d' === type) return ctx2D;
        err('Unsupported context "'+type+'"');
    };
}
Rasterizer.VERSION = '1.1.1';
Rasterizer[PROTO] = {
    constructor: Rasterizer,
    width: null,
    height: null,
    getContext: null
};
Rasterizer.getRGBAFrom = function(source) {
    if ('function' === typeof source)
    {
        return function(x, y) {
            var c = source(x, y);
            return [c[0], c[1], c[2], 3 < c.length ? c[3]/255 : 1.0];
        };
    }
    else if (source.data && null != source.width && null != source.height)
    {
        return function(x, y) {
            var w = source.width, h = source.height, data = source.data, index;
            if (0 <= x && x < w && 0 <= y && y < h)
            {
                index = (x + w*y) << 2;
                return [
                    data[index  ],
                    data[index+1],
                    data[index+2],
                    data[index+3]/255
                ];
            }
            return BLANK;
        };
    }
    else
    {
        var c = [source[0] || 0, source[1] || 0, source[2] || 0, 3 < source.length ? (source[3] || 0) : 1.0];
        return function(x, y) {
            return c;
        };
    }
};
Rasterizer.setRGBATo = function(target) {
    if ('function' === typeof target)
    {
        return target;
    }
    else
    {
        var setter = function(x, y, r, g, b, af, op) {
            var w = target.width, h = target.height, data = target.data;
            if (0 <= x && x < w && 0 <= y && y < h /*&& 0 < af*/)
            {
                var index = (x + w*y) << 2,
                    r0 = data[index  ] || 0,
                    g0 = data[index+1] || 0,
                    b0 = data[index+2] || 0,
                    a0 = (data[index+3] || 0)/255,
                    a1 = af, f = null,
                    ro = 0, go = 0,
                    bo = 0, ao = 0;
                op = op || 'source-over';
                if ('clear' !== op && 'copy' !== op)
                {
                    f = RenderingContext2D.CompositionMode[op];
                    if (!f)
                    {
                        op = 'source-over';
                        f = RenderingContext2D.CompositionMode[op];
                    }
                }
                switch(op)
                {
                    case 'clear':
                        f = null;
                    break;
                    case 'copy':
                        ro = r;
                        go = g;
                        bo = b;
                        ao = clamp(stdMath.round(255*a1), 0, 255);
                        f = null;
                    break;
                    case 'xor':
                    case 'destination-out':
                    case 'destination-in':
                    case 'destination-atop':
                    case 'destination-over':
                    case 'source-out':
                    case 'source-in':
                    case 'source-atop':
                    case 'source-over':
                        // alpha for these modes
                        ao = f(a0, a0, a1, a1);
                    break;
                    default:
                        // alpha for other modes
                        ao = a1 + a0 - a1*a0;
                    break;
                }
                if (f)
                {
                    if (0 < ao)
                    {
                        ro = clamp(stdMath.round(255*f(a0*r0/255, a0, a1*r/255, a1)/ao), 0, 255);
                        go = clamp(stdMath.round(255*f(a0*g0/255, a0, a1*g/255, a1)/ao), 0, 255);
                        bo = clamp(stdMath.round(255*f(a0*b0/255, a0, a1*b/255, a1)/ao), 0, 255);
                        ao = clamp(stdMath.round(255*ao), 0, 255);
                    }
                    else
                    {
                        ro = 0;
                        go = 0;
                        bo = 0;
                        ao = 0;
                    }
                }
                data[index  ] = ro;
                data[index+1] = go;
                data[index+2] = bo;
                data[index+3] = ao;
            }
        };
        setter.$target = target;
        return setter;
    }
};

function RenderingContext2D(width, height, set_rgba_at, get_rgba_from)
{
    // https://html.spec.whatwg.org/multipage/canvas.html#2dcontext
    var self = this, get_stroke_at, get_fill_at,
        canvas = null, clip_canvas = null,
        canvas_reset, canvas_output, stack,
        reset, fill, set_pixel, clip_pixel,
        color_pixel, get_data, set_data,
        lineCap, lineJoin, miterLimit,
        lineWidth, lineDash, lineDashOffset,
        integral_blur, shadowBlur, shadowColor,
        shadowOffsetX, shadowOffsetY,
        transform, alpha, op, currentPath;

    canvas_reset = function canvas_reset() {
        // sparse array/hash
        canvas = {};
    };
    canvas_output = function canvas_output(color_at) {
        /*
        https://html.spec.whatwg.org/multipage/canvas.html#drawing-model
        When a shape or image is painted, user agents must follow these steps, in the order given (or act as if they do):

        1. Render the shape or image onto an infinite transparent black bitmap, creating image A, as described in the previous sections. For shapes, the current fill, stroke, and line styles must be honored, and the stroke must itself also be subjected to the current transformation matrix.

        2. Multiply the alpha component of every pixel in A by global alpha.

        3. When the current filter is set to a value other than "none" and all the externally-defined filters it references, if any, are in documents that are currently loaded, then use image A as the input to the current filter, creating image B. If the current filter is a string parseable as a <filter-value-list>, then draw using the current filter in the same manner as SVG.

        Otherwise, let B be an alias for A.

        4. When shadows are drawn, render the shadow from image B, using the current shadow styles, creating image C.

        5. When shadows are drawn, composite C within the clipping region over the current output bitmap using the current compositing and blending operator.

        6. Composite B within the clipping region over the current output bitmap using the current compositing and blending operator.

        When compositing onto the output bitmap, pixels that would fall outside of the output bitmap must be discarded.
        */
        if (color_at instanceof Gradient || color_at instanceof Pattern)
        {
            color_at.transform.reset();
            if (currentPath)
            {
                color_at.transform.transform(
                currentPath.transform.a,
                currentPath.transform.b,
                currentPath.transform.c,
                currentPath.transform.d,
                currentPath.transform.e,
                currentPath.transform.f
                );
            }
            color_at = color_at.getColorAt.bind(color_at);
        }
        var idx, i, xy, x, y, c,
            col = null, shadow = null;
        // if shadows drawn
        if ((0 < shadowColor[3]) && (shadowBlur || shadowOffsetX || shadowOffsetY))
        {
            col = {};
            shadow = {};
            for (idx in canvas)
            {
                i = canvas[idx];
                xy = idx.split(',');
                x = +xy[0];
                y = +xy[1];
                col[idx] = 0 < i ? color_at(x, y) : 0;
                if ((0 < i) && (-shadowBlur <= x) && (x < width+shadowBlur) && (-shadowBlur <= y) && (y < height+shadowBlur))
                {
                    c = col[idx];
                    shadow[String(x+shadowOffsetX)+','+String(y+shadowOffsetY)] = i*(3 < c.length ? c[3] : 1); // copy alpha channel
                }
            }
            shadow = integral_blur(shadowBlur, shadow);
            for (idx in shadow)
            {
                i = shadow[idx];
                xy = idx.split(',');
                x = +xy[0];
                y = +xy[1];
                if ((0 < i) && (0 <= x) && (x < width) && (0 <= y) && (y < height))
                {
                    i *= alpha*(clip_canvas ? (clip_canvas[idx] || 0) : 1);
                    if (0 < i) color_pixel(x, y, i, null, shadowColor);
                }
            }
            shadow = null;
            for (idx in canvas)
            {
                i = canvas[idx];
                xy = /*+idx*/idx.split(',');
                x = /*xy % width*/+xy[0];
                y = /*~~(xy / width)*/+xy[1];
                if ((0 < i) && (0 <= x) && (x < width) && (0 <= y) && (y < height))
                {
                    i *= alpha*(clip_canvas ? (clip_canvas[idx] || 0) : 1);
                    if (0 < i) color_pixel(x, y, i, null, col[idx]);
                }
            }
            col = null;
        }
        else
        {
            for (idx in canvas)
            {
                i = canvas[idx];
                xy = /*+idx*/idx.split(',');
                x = /*xy % width*/+xy[0];
                y = /*~~(xy / width)*/+xy[1];
                if ((0 < i) && (0 <= x) && (x < width) && (0 <= y) && (y < height))
                {
                    i *= alpha*(clip_canvas ? (clip_canvas[idx] || 0) : 1);
                    if (0 < i) color_pixel(x, y, i, color_at);
                }
            }
        }
        canvas = null;
    };
    set_pixel = function set_pixel(x, y, i) {
        if (!is_nan(x) && !is_nan(y) && (-shadowBlur <= x) && (x < width+shadowBlur) && (-shadowBlur <= y) && (y < height+shadowBlur) && (0 < i) && (0 < alpha))
        {
            var idx = String(x)+','+String(y)/*String(x + y*width)*/,
                j = canvas[idx] || 0;
            if (i > j)
            {
                canvas[idx] = i;
                //if (shadow) shadow[String(x+shadowOffsetX)+','+String(y+shadowOffsetY)] = i; // copy alpha channel
            }
        }
    };
    clip_pixel = function clip_pixel(x, y, i) {
        if (!is_nan(x) && !is_nan(y) && (-shadowBlur <= x) && (x < width+shadowBlur) && (-shadowBlur <= y) && (y < height+shadowBlur) && (0 < i))
        {
            var idx = String(x)+','+String(y),
                j = canvas[idx] || 0;
            i *= (clip_canvas ? (clip_canvas[idx] || 0) : 1);
            if (i > j) canvas[idx] = i;
        }
    };
    color_pixel = function color_pixel(x, y, i, color_at, color) {
        var c = 'clear' === op ? BLANK : (color_at ? color_at(x, y) : color), af = 3 < c.length ? c[3] : 1.0;
        set_rgba_at(x, y, c[0], c[1], c[2], af*i, op);
    };
    reset = function(init) {
        get_stroke_at = Rasterizer.getRGBAFrom([0, 0, 0, 1]);
        get_fill_at = Rasterizer.getRGBAFrom([0, 0, 0, 1]);
        canvas = null;
        clip_canvas = null;
        lineCap = 'butt';
        lineJoin = 'miter';
        miterLimit = 10.0;
        lineWidth = 1;
        lineDash = [];
        lineDashOffset = 0;
        shadowColor = BLANK;
        shadowBlur = 0;
        shadowOffsetX = 0;
        shadowOffsetY = 0;
        transform = Matrix2D.EYE();
        alpha = 1.0;
        op = 'source-over';
        stack = [];
        currentPath = new Path2D(transform);
        if (!init) self.clearRect(0, 0, width, height);
    };
    integral_blur = function integral_blur(amount, canvas) {
        if (amount)
        {
            var passes = 3, sigma = amount/2,
                d = stdMath.floor(stdMath.max(stdMath.sqrt(12*sigma*sigma/passes + 1), 3)),
                d2 = d >> 1, d1 = d2+1, dd = d*d,
                W = d1+width+d1, H = d1+height+d1,
                x, y, xs, ys, xi, yi,
                xm, ym, xM, yM, s,
                size = W*H, pass,
                SAT = new Array(size);
            // multiple passes of (a fast/integral) box blur
            // with appropriate window d
            // approximate gaussian blur with given sigma
            // see central limit theorem
            for (pass=1; pass<=passes; ++pass)
            {
                // O(N) computation of summed area table (SAT)
                for (yi=0,y=-d1; yi<size; yi+=W,++y)
                {
                    ys = ','+String(y);
                    for (s=0,xi=0,x=-d1; xi<W; ++xi,++x)
                    {
                        xs = String(x);
                        s += (canvas[xs+ys] || 0);
                        SAT[xi+yi] = s + (yi > 0 ? SAT[xi+yi-W] : 0);
                    }
                }
                // O(N) box average computation via SAT
                canvas = {};
                for (y=0,ym=(d1-d2-1)*W,yM=(d1+d2)*W; y<height; ++y,ym+=W,yM+=W)
                {
                    ys = ','+String(y);
                    for (x=0,xm=d1-d2-1,xM=d1+d2; x<width; ++x,++xm,++xM)
                    {
                        // O(1) average computation
                        s = ((SAT[yM+xM]||0) - (SAT[yM+xm]||0) - (SAT[ym+xM]||0) + (SAT[ym+xm]||0))/dd;
                        if (0.0 < s) canvas[String(x)+ys] = s;
                    }
                }
            }
        }
        return canvas;
    };

    def(self, 'strokeStyle', {
        get: function() {
            return '';
        },
        set: function(c) {
           if (c instanceof Gradient || c instanceof Pattern)
           {
               get_stroke_at = c;
           }
           else
           {
                get_stroke_at = Rasterizer.getRGBAFrom((c.substr && c.split ? parseColor(c) : c) || BLANK);
           }
        }
    });
    def(self, 'fillStyle', {
        get: function() {
            return '';
        },
        set: function(c) {
           if (c instanceof Gradient || c instanceof Pattern)
           {
               get_fill_at = c;
           }
           else
           {
                get_fill_at = Rasterizer.getRGBAFrom((c.substr && c.split ? parseColor(c) : c) || BLANK);
           }
        }
    });
    def(self, 'lineWidth', {
        get: function() {
            return lineWidth;
        },
        set: function(lw) {
            lw = +lw;
            if (positive_number(lw))
            {
                lineWidth = lw;
            }
        }
    });
    def(self, 'lineCap', {
        get: function() {
            return lineCap;
        },
        set: function(lc) {
            lc = String(lc).toLowerCase();
            if (-1 !== ['butt','square','round'].indexOf(lc))
            {
                lineCap = lc;
            }
        }
    });
    def(self, 'lineJoin', {
        get: function() {
            return lineJoin;
        },
        set: function(lj) {
            lj = String(lj).toLowerCase();
            if (-1 !== ['miter','bevel','round'].indexOf(lj))
            {
                lineJoin = lj;
            }
        }
    });
    def(self, 'miterLimit', {
        get: function() {
            return miterLimit;
        },
        set: function(ml) {
            ml = +ml;
            if (!is_nan(ml) && is_finite(ml) && (0 <= ml))
            {
                miterLimit = ml;
            }
        }
    });
    def(self, 'lineDashOffset', {
        get: function() {
            return lineDashOffset;
        },
        set: function(ldo) {
            ldo = +ldo;
            if (!is_nan(ldo) && is_finite(ldo))
            {
                lineDashOffset = ldo;
            }
        }
    });
    def(self, 'lineDash', {
        get: function() {
            return lineDash.slice();
        },
        set: function(ld) {
            ld = [].concat(ld);
            if (ld.length & 1) ld = ld.concat(ld);
            if (ld.filter(positive_number).length === ld.length) lineDash = ld;
        }
    });
    self.getLineDash = function() {
        return self.lineDash;
    };
    self.setLineDash = function(ld) {
        self.lineDash = ld;
    };
    def(self, 'shadowColor', {
        get: function() {
            return '';
        },
        set: function(c) {
            if (c)
            {
                shadowColor = c.substr && c.split ? parseColor(c) : (c.slice());
                if (4 > shadowColor.length) shadowColor.push(1.0);
            }
        }
    });
    def(self, 'shadowBlur', {
        get: function() {
            return shadowBlur;
        },
        set: function(sb) {
            if (!is_nan(sb) && is_finite(sb) && (0 <= sb))
            {
                shadowBlur = stdMath.round(sb);
            }
        }
    });
    def(self, 'shadowOffsetX', {
        get: function() {
            return shadowOffsetX;
        },
        set: function(sx) {
            if (!is_nan(sx) && is_finite(sx))
            {
                shadowOffsetX = stdMath.round(sx);
            }
        }
    });
    def(self, 'shadowOffsetY', {
        get: function() {
            return shadowOffsetY;
        },
        set: function(sy) {
            if (!is_nan(sy) && is_finite(sy))
            {
                shadowOffsetY = stdMath.round(sy);
            }
        }
    });
    def(self, 'globalAlpha', {
        get: function() {
            return alpha;
        },
        set: function(a) {
            a = +a;
            if (!is_nan(a) && (0 <= a && a <= 1))
            {
                alpha = a;
            }
        }
    });
    def(self, 'globalCompositeOperation', {
        get: function() {
            return op;
        },
        set: function(o) {
            op = String(o);
        }
    });

    self.save = function() {
        if (!stack) stack = [];
        stack.push([
        get_stroke_at,
        get_fill_at,
        clip_canvas,
        lineCap,
        lineJoin,
        miterLimit,
        lineWidth,
        lineDash,
        lineDashOffset,
        transform,
        alpha,
        op,
        shadowColor,
        shadowBlur,
        shadowOffsetX,
        shadowOffsetY
        ]);
    };
    self.restore = function() {
        if (!stack || !stack.length) return;
        var state = stack.pop();
        get_stroke_at = state[0];
        get_fill_at = state[1];
        clip_canvas = state[2];
        lineCap = state[3];
        lineJoin = state[4];
        miterLimit = state[5];
        lineWidth = state[6];
        lineDash = state[7];
        lineDashOffset = state[8];
        currentPath.transform = transform = state[9];
        alpha = state[10];
        op = state[11];
        shadowColor = state[12];
        shadowBlur = state[13];
        shadowOffsetX = state[14];
        shadowOffsetY = state[15];
    };
    self.reset = function() {
        reset();
    };

    self.scale = function(sx, sy) {
        currentPath.transform = transform = transform.mul(Matrix2D.scale(sx, sy));
    };
    self.rotate = function(angle) {
        currentPath.transform = transform = transform.mul(Matrix2D.rotate(angle || 0));
    };
    self.translate = function(tx, ty) {
        currentPath.transform = transform = transform.mul(Matrix2D.translate(tx || 0, ty || 0));
    };
    self.transform = function(a, b, c, d, e, f) {
        currentPath.transform = transform = transform.mul(new Matrix2D(a, c, e, b, d, f));
    };
    self.getTransform = function() {
        return transform.clone();
    };
    self.setTransform = function(a, b, c, d, e, f) {
        if (1 < arguments.length)
        {
            transform = new Matrix2D(a, c, e, b, d, f);
        }
        else if (a && (null != a.a) && (null != a.f))
        {
            transform = new Matrix2D(a.a, a.c, a.e, a.b, a.d, a.f);
        }
        currentPath.transform = transform;
    };
    self.resetTransform = function() {
        currentPath.transform = transform = Matrix2D.EYE();
    };

    self.beginPath = function() {
        currentPath = new Path2D(transform);
    };
    self.closePath = function() {
        currentPath.closePath();
    };
    self.moveTo = function(x, y) {
        currentPath.moveTo(x, y);
    };
    self.lineTo = function(x, y) {
        currentPath.lineTo(x, y);
    };
    self.rect = function(x, y, w, h) {
        currentPath.rect(x, y, w, h);
    };
    self.roundRect = function(x, y, w, h) {
        currentPath.roundRect.apply(currentPath, arguments);
    };
    self.arc = function(cx, cy, r, start, end, ccw) {
        currentPath.arc(cx, cy, r, start, end, ccw);
    };
    self.ellipse = function(cx, cy, rx, ry, angle, start, end, ccw) {
        currentPath.ellipse(cx, cy, rx, ry, angle, start, end, ccw);
    };
    self.arcTo = function(x1, y1, x2, y2, r) {
        currentPath.arcTo(x1, y1, x2, y2, r);
    };
    self.quadraticCurveTo = function(x1, y1, x2, y2) {
        currentPath.quadraticCurveTo(x1, y1, x2, y2);
    };
    self.bezierCurveTo = function(x1, y1, x2, y2, x3, y3) {
        currentPath.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    };
    self.clearRect = function(x, y, w, h) {
        var o = op, a = alpha;
        op = 'clear';
        alpha = 1.0;
        self.fill((new Path2D(transform)).rect(x, y, w, h), 'evenodd');
        op = o;
        alpha = a;
    };
    self.strokeRect = function(x, y, w, h) {
        if (0 < lineWidth) self.stroke((new Path2D(transform)).rect(x, y, w, h));
    };
    self.fillRect = function(x, y, w, h) {
        self.fill((new Path2D(transform)).rect(x, y, w, h), 'evenodd');
    };
    self.stroke = function(path) {
        if (0 < lineWidth)
        {
            path = path || currentPath;
            var t = path.transform,
                sx = stdMath.abs(t.sx),
                sy = stdMath.abs(t.sy);
            /*if (!t.isIdentity)
            {
                sx = hypot(t.m11, t.m21);
                sy = hypot(-t.m12, t.m22);
            }*/
            canvas_reset();
            stroke_path(set_pixel, path, lineWidth, lineDash, lineDashOffset, lineCap, lineJoin, miterLimit, sx, sy, 0-shadowBlur, 0-shadowBlur, width-1+shadowBlur, height-1+shadowBlur);
            canvas_output(get_stroke_at);
        }
    };
    fill = function(path, fillRule) {
        var lw = 0.5/*0.65*/,
            xmin = 0-shadowBlur,
            ymin = 0-shadowBlur,
            xmax = width-1+shadowBlur,
            ymax = height-1+shadowBlur;
        // stroke thin path outline
        stroke_path(set_pixel, path, lw, [], 0, 'butt', 'bevel', 0, 1, 1, xmin, ymin, xmax, ymax);
        // fill path interior
        fill_path(set_pixel, path, fillRule, xmin, ymin, xmax, ymax);
    };
    self.fill = function(path, fillRule) {
        if (!arguments.length || (null == path && null == fillRule))
        {
            path = currentPath;
            fillRule = 'nonzero';
        }
        else if (1 === arguments.length || null == fillRule)
        {
            if (path instanceof Path2D)
            {
                fillRule = 'nonzero';
            }
            else
            {
                fillRule = path;
                path = currentPath;
            }
        }
        fillRule = String(fillRule || 'nonzero').toLowerCase();
        if ('evenodd' !== fillRule) fillRule = 'nonzero';
        path = path || currentPath;
        canvas_reset();
        fill(path, fillRule);
        canvas_output(get_fill_at);
    };
    self.clip = function(path, fillRule) {
        if (!arguments.length || (null == path && null == fillRule))
        {
            path = currentPath;
            fillRule = 'nonzero';
        }
        else if (1 === arguments.length || null == fillRule)
        {
            if (path instanceof Path2D)
            {
                fillRule = 'nonzero';
            }
            else
            {
                fillRule = path;
                path = currentPath;
            }
        }
        fillRule = String(fillRule || 'nonzero').toLowerCase();
        if ('evenodd' !== fillRule) fillRule = 'nonzero';
        path = path || currentPath;
        if (path === currentPath) currentPath = new Path2D(transform);
        var sp = set_pixel;
        set_pixel = clip_pixel;
        canvas = {};
        fill(path, fillRule);
        clip_canvas = canvas;
        canvas = null;
        set_pixel = sp;
    };
    self.isPointInStroke = function(path, x, y) {
        if (3 > arguments.length)
        {
            y = x;
            x = path;
            path = currentPath;
        }
        x = x || 0;
        y = y || 0;
        path = path || currentPath;
        //return point_in_stroke(x, y, path, lineWidth);
        // stroke and check if in stroke
        x = stdMath.round(x); y = stdMath.round(y);
        var pt = String(x)+','+String(y), point_in_stroke = false;
        stroke_path(function(px, py, i) {
            if ((x === px) && (y === py))
            {
                i *= clip_canvas ? (clip_canvas[pt] || 0) : 1;
                if (i > 0) point_in_stroke = true;
            }
        }, path, lineWidth, lineDash, lineDashOffset, lineCap, lineJoin, miterLimit, path.transform.sx, path.transform.sy, null, null, null, null);
        return point_in_stroke;
    };
    self.isPointInPath = function(path, x, y, fillRule) {
        if (!(path instanceof Path2D))
        {
            fillRule = y;
            y = x;
            x = path;
            path = currentPath;
        }
        fillRule = String(fillRule || 'nonzero').toLowerCase();
        if ('evenodd' !== fillRule) fillRule = 'nonzero';
        return point_in_path(x || 0, y || 0, path || currentPath, fillRule);
    };

    get_data = function(D, W, H, x0, y0, x1, y1) {
        x0 = stdMath.min(x0, W-1); y0 = stdMath.min(y0, H-1);
        x1 = stdMath.min(x1, W-1); y1 = stdMath.min(y1, H-1);
        if ((x1 < x0) || (y1 < y0)) return new ImArray(0);
        var c, x, y, i, I, w = x1-x0+1, h = y1-y0+1, size = (w*h) << 2, d = new ImArray(size);
        if (D)
        {
            for(x=x0,y=y0,i=0; y<=y1; i+=4,++x)
            {
                if (x>x1) {x=x0; ++y; if (y>y1) break;}
                I = (y*W + x) << 2;
                d[i  ] = D[I  ];
                d[i+1] = D[I+1];
                d[i+2] = D[I+2];
                d[i+3] = D[I+3];
            }
        }
        else
        {
            for(x=x0,y=y0,i=0; y<=y1; i+=4,++x)
            {
                if (x>x1) {x=x0; ++y; if (y>y1) break;}
                c = get_rgba_from(x, y);
                d[i  ] = clamp(c[0], 0, 255);
                d[i+1] = clamp(c[1], 0, 255);
                d[i+2] = clamp(c[2], 0, 255);
                d[i+3] = clamp(stdMath.round(c[3]*255), 0, 255);
            }
        }
        return d;
    };
    set_data = function(D, W, H, d, w, h, x0, y0, x1, y1, X0, Y0) {
        var i, I, x, y;
        //if (!D.length || !d.length || !w || !h || !W || !H) return;
        x0 = stdMath.min(x0, w-1); y0 = stdMath.min(y0, h-1);
        X0 = stdMath.min(X0, W-1); Y0 = stdMath.min(Y0, H-1);
        x1 = stdMath.min(x1, w-1); y1 = stdMath.min(y1, h-1);
        X0 -= x0; Y0 -= y0;
        for(x=x0,y=y0; y<=y1; ++x)
        {
            if (x>x1) {x=x0; ++y; if (y>y1) break;}
            if ((y+Y0 >= H) || (x+X0 >= W)) continue;
            i = (y*w + x) << 2;
            /*I = ((y+Y0)*W + x+X0) << 2;
            D[I  ] = d[i  ];
            D[I+1] = d[i+1];
            D[I+2] = d[i+2];
            D[I+3] = d[i+3];*/
            set_rgba_at(x+X0, y+Y0, d[i  ], d[i+1], d[i+2], d[i+3]/255, 'copy');
        }
    };
    self.drawImage = function(imgData, sx, sy, sw, sh, dx, dy, dw, dh) {
        if (imgData instanceof CanvasLite) imgData = imgData.getContext('2d').getImageData(0, 0, imgData.width, imgData.height);
        if (imgData && ('function' === typeof imgData.getImageData)) imgData = imgData.getImageData();
         if (!imgData || !imgData.data) err('Invalid image data in drawImage');
        var W = width, H = height,
            w = imgData.width, h = imgData.height,
            data = imgData.data, argslen = arguments.length,
            T, P, z, pt, res, gf = get_fill_at
        ;
        if (!w || !h) err('Invalid image data in drawImage');
        sx = sx || 0;
        sy = sy || 0;
        if (4 > argslen)
        {
            sw = w;
            sh = h;
        }
        if (6 > argslen)
        {
            dx = sx;
            dy = sy;
            dw = sw;
            dh = sh;
        }
        // fill rect with image taking account of active transform
        T = transform.inv();
        P = [0, 0];
        res = [0, 0, 0, 0];
        z = [0, 0, 0, 0];
        pt = function(x, y) {
            if (0 <= x && 0 <= y && x < w && y < h)
            {
                var index = (x + w*y) << 2;
                return [
                data[index  ],
                data[index+1],
                data[index+2],
                data[index+3]
                ];
            }
            return z;
        };
        get_fill_at = function(x, y) {
            T.transform(x, y, P);
            x = sx + (P[0]-dx)*sw/dw;
            y = sy + (P[1]-dy)*sh/dh;
            // nearest interpolation
            //x = stdMath.round(x);
            //y = stdMath.round(y);
            if (-1 < x && x < w && -1 < y && y < h)
            {
                var fx = stdMath.floor(x),
                    fy = stdMath.floor(y),
                    deltax = stdMath.abs(x-fx),
                    deltay = stdMath.abs(y-fy);
                x = fx; y = fy;
                /*
                // bilinear
                //a = (1-deltax)*(1-deltay);
                //b = (deltax)*(1-deltay);
                //c = (deltay)*(1-deltax);
                //d = (deltax)*(deltay);
                //((1-dx)*p00+dx*p10)(1-dy) + ((1-dx)*p10 + dx*p11)*dy
                var p00 = pt(x  ,y  ), p10 = pt(x+1,y  ),
                    p01 = pt(x  ,y+1), p11 = pt(x+1,y+1);
                res[0] = clamp(stdMath.round(linear(
                    linear(p00[0], p10[0], deltax),
                    linear(p10[0], p11[0], deltax),
                deltay)), 0, 255);
                res[1] = clamp(stdMath.round(linear(
                    linear(p00[1], p10[1], deltax),
                    linear(p10[1], p11[1], deltax),
                deltay)), 0, 255);
                res[2] = clamp(stdMath.round(linear(
                    linear(p00[2], p10[2], deltax),
                    linear(p10[2], p11[2], deltax),
                deltay)), 0, 255);
                res[3] = clamp(stdMath.round(linear(
                    linear(p00[3], p10[3], deltax),
                    linear(p10[3], p11[3], deltax),
                deltay)), 0, 255)/255;
                */
                // bicubic
                var p00 = pt(x-1,y-1), p10 = pt(x  ,y-1), p20 = pt(x+1,y-1), p30 = pt(x+2,y-1),
                    p01 = pt(x-1,y  ), p11 = pt(x  ,y  ), p21 = pt(x+1,y  ), p31 = pt(x+2,y  ),
                    p02 = pt(x-1,y+1), p12 = pt(x  ,y+1), p22 = pt(x+1,y+1), p32 = pt(x+2,y+1),
                    p03 = pt(x-1,y+2), p13 = pt(x  ,y+2), p23 = pt(x+1,y+2), p33 = pt(x+2,y+2);
                res[0] = clamp(stdMath.round(cubic(
                    cubic(p00[0], p10[0], p20[0], p30[0], deltax),
                    cubic(p01[0], p11[0], p21[0], p31[0], deltax),
                    cubic(p02[0], p12[0], p22[0], p32[0], deltax),
                    cubic(p03[0], p13[0], p23[0], p33[0], deltax),
                    deltay)), 0, 255);
                res[1] = clamp(stdMath.round(cubic(
                    cubic(p00[1], p10[1], p20[1], p30[1], deltax),
                    cubic(p01[1], p11[1], p21[1], p31[1], deltax),
                    cubic(p02[1], p12[1], p22[1], p32[1], deltax),
                    cubic(p03[1], p13[1], p23[1], p33[1], deltax),
                    deltay)), 0, 255);
                res[2] = clamp(stdMath.round(cubic(
                    cubic(p00[2], p10[2], p20[2], p30[2], deltax),
                    cubic(p01[2], p11[2], p21[2], p31[2], deltax),
                    cubic(p02[2], p12[2], p22[2], p32[2], deltax),
                    cubic(p03[2], p13[2], p23[2], p33[2], deltax),
                    deltay)), 0, 255);
                res[3] = clamp(stdMath.round(cubic(
                    cubic(p00[3], p10[3], p20[3], p30[3], deltax),
                    cubic(p01[3], p11[3], p21[3], p31[3], deltax),
                    cubic(p02[3], p12[3], p22[3], p32[3], deltax),
                    cubic(p03[3], p13[3], p23[3], p33[3], deltax),
                    deltay)), 0, 255)/255;
                return res;
            }
            return BLANK;
        };
        self.fillRect(dx, dy, dw, dh);
        // restore
        get_fill_at = gf;
        /*
        // NOTE: current transform is not taken account of
        var W = width, H = height,
            w = imgData.width, h = imgData.height,
            idata = imgData.data,
            resize = RenderingContext2D.Interpolation.bilinear,
            argslen = arguments.length
        ;
        if (!w || !h) err('Invalid image data in drawImage');
        sx = sx || 0;
        sy = sy || 0;
        if (3 === argslen)
        {
            dx = sx; dy = sy;
            set_data(null, W, H, idata, w, h, 0, 0, w-1, h-1, dx, dy);
        }
        else if (5 === argslen)
        {
            dx = sx; dy = sy;
            dw = sw; dh = sh;
            if ((w === dw) && (h === dh))
                set_data(null, W, H, idata, dw, dh, 0, 0, dw-1, dh-1, dx, dy);
            else
                set_data(null, W, H, resize(idata, w, h, dw, dh), dw, dh, 0, 0, dw-1, dh-1, dx, dy);
        }
        else
        {
            if ((sw === dw) && (sh === dh))
                set_data(null, W, H, get_data(idata, w, h, sx, sy, sx+sw-1, sy+sh-1), dw, dh, 0, 0, dw-1, dh-1, dx, dy);
            else
                set_data(null, W, H, resize(get_data(idata, w, h, sx, sy, sx+sw-1, sy+sh-1), sw, sh, dw, dh), dw, dh, 0, 0, dw-1, dh-1, dx, dy);
        }
        */
    };
    self.getImageData = function(x, y, w, h) {
        var W = width, H = height, x1, y1, x2, y2;
        if (null == x) x = 0;
        if (null == y) y = 0;
        if (null == w) w = W;
        if (null == h) h = H;
        x1 = stdMath.max(0, stdMath.min(x, W-1));
        y1 = stdMath.max(0, stdMath.min(y, H-1));
        x2 = stdMath.min(x1+w-1, W-1);
        y2 = stdMath.min(y1+h-1, H-1);
        return {data: get_data(null, W, H, x1, y1, x2, y2), width: x2-x1+1, height: y2-y1+1/*, colorSpace: undefined*/};
    };
    self.putImageData = function(imgData, x, y) {
        if (!imgData || !imgData.data) err('Invalid image data in putImageData');
        var W = width, H = height, w = imgData.width, h = imgData.height;
        if (null == x) x = 0;
        if (null == y) y = 0;
        set_data(null, W, H, imgData.data, w, h, 0, 0, w-1, h-1, x, y);
    };

    reset(true);
}
RenderingContext2D[PROTO] = {
    constructor: RenderingContext2D,
    strokeStyle: null,
    fillStyle: null,
    lineWidth: null,
    lineCap: null,
    lineJoin: null,
    miterLimit: null,
    lineDash: null,
    lineDashOffset: null,
    getLineDash: null,
    setLineDash: null,
    shadowColor: null,
    shadowBlur: null,
    shadowOffsetX: null,
    shadowOffsetY: null,
    globalAlpha: null,
    globalCompositeOperation: null,
    save: null,
    restore: null,
    reset: null,
    scale: null,
    rotate: null,
    translate: null,
    transform: null,
    getTransform: null,
    setTransform: null,
    resetTransform: null,
    beginPath: null,
    closePath: null,
    moveTo: null,
    lineTo: null,
    rect: null,
    arc: null,
    ellipse: null,
    arcTo: null,
    quadraticCurveTo: null,
    bezierCurveTo: null,
    clearRect: null,
    strokeRect: null,
    fillRect: null,
    stroke: null,
    fill: null,
    clip: null,
    isPointInStroke: null,
    isPointInPath: null,
    createImageData: function(width, height) {
        if (null == height && null != width.width && null != width.height)
        {
            height = width.height;
            width = width.width;
        }
        return {
            data: new ImArray((width*height) << 2),
            width: width,
            height: height/*,
            colorSpace: undefined*/
        };
    },
    getImageData: null,
    putImageData: null,
    drawImage: null,
    // handled through Gradient.js for example
    createLinearGradient: NOOP,
    createRadialGradient: NOOP,
    createConicGradient: NOOP,
    createPattern: NOOP,
    // NOT implemented
    strokeText: NOOP,
    fillText: NOOP,
    measureText: NOOP
};
Rasterizer.RenderingContext2D = RenderingContext2D;

RenderingContext2D.CompositionMode = {
//https://graphics.pixar.com/library/Compositing/paper.pdf
'xor': function(Dca, Da, Sca, Sa){return Sca * (1 - Da) + Dca * (1 - Sa);},
'destination-out': function(Dca, Da, Sca, Sa){return Dca * (1 - Sa);},
'destination-in': function(Dca, Da, Sca, Sa){return Dca * Sa;},
'destination-atop': function(Dca, Da, Sca, Sa){return Sca * (1 - Da) + Dca * Sa;},
'destination-over': function(Dca, Da, Sca, Sa){return Sca * (1 - Da) + Dca;},
'source-out': function(Dca, Da, Sca, Sa){return Sca * (1 - Da);},
'source-in': function(Dca, Da, Sca, Sa){return Sca * Da;},
'source-atop': function(Dca, Da, Sca, Sa){return Sca * Da + Dca * (1 - Sa);},
'source-over': function(Dca, Da, Sca, Sa){return Sca + Dca * (1 - Sa);},
//https://dev.w3.org/SVG/modules/compositing/master/
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
'exclusion': function(Dca, Da, Sca, Sa){return (Sca * Da + Dca * Sa - 2 * Sca * Dca) + Sca * (1 - Da) + Dca * (1 - Sa);}
};
RenderingContext2D.CompositionMode['hardlight'] = RenderingContext2D.CompositionMode['hard-light'];
RenderingContext2D.CompositionMode['softlight'] = RenderingContext2D.CompositionMode['soft-light'];

RenderingContext2D.Interpolation = {
/*'bilinear': function(im, w, h, nw, nh) {
    // http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
    // http://tech-algorithm.com/articles/bilinear-image-scaling/
    var size = (nw*nh) << 2,
        interpolated = new ImArray(size),
        rx = (w-1)/nw, ry = (h-1)/nh,
        A, B, C, D, a, b, c, d,
        i, j, x, y, xi, yi, pixel, index,
        yw, dx, dy, w4 = w << 2
    ;
    i=0; j=0; x=0; y=0; yi=0; yw=0; dy=0;
    for (index=0; index<size; index+=4,++j,x+=rx)
    {
        if (j >= nw) {j=0; x=0; ++i; y+=ry; yi=y|0; dy=y - yi; yw=yi*w;}

        xi = x|0; dx = x - xi;

        // Y = A(1-w)(1-h) + B(w)(1-h) + C(h)(1-w) + Dwh
        a = (1-dx)*(1-dy); b = dx*(1-dy);
        c = dy*(1-dx); d = dx*dy;

        pixel = (yw + xi)<<2;

        A = im[pixel]; B = im[pixel+4];
        C = im[pixel+w4]; D = im[pixel+w4+4];
        interpolated[index] = clamp(stdMath.round(A*a +  B*b + C*c  +  D*d), 0, 255);

        A = im[pixel+1]; B = im[pixel+5];
        C = im[pixel+w4+1]; D = im[pixel+w4+5];
        interpolated[index+1] = clamp(stdMath.round(A*a +  B*b + C*c  +  D*d), 0, 255);

        A = im[pixel+2]; B = im[pixel+6];
        C = im[pixel+w4+2]; D = im[pixel+w4+6];
        interpolated[index+2] = clamp(stdMath.round(A*a +  B*b + C*c  +  D*d), 0, 255);

        A = im[pixel+3]; B = im[pixel+7];
        C = im[pixel+w4+3]; D = im[pixel+w4+7];
        interpolated[index+3] = clamp(stdMath.round(A*a +  B*b + C*c  +  D*d), 0, 255);
    }
    return interpolated;
}*/
};
/*function nearest(A, B, t)
{
    return t < 0.5 ? A : B;
}*/
function linear(A, B, t)
{
    // linear bezier
    return A*(1-t) + B*(t);
}
function cubic(A, B, C, D, t)
{
    // cubic hermite
    var t2 = t*t;
    return (-A / 2.0 + (3.0*B) / 2.0 - (3.0*C) / 2.0 + D / 2.0)*t2*t + (A - (5.0*B) / 2.0 + 2.0*C - D / 2.0)*t2 + (-A / 2.0 + C / 2.0)*t + (B);
}
function Path2D(path, transform)
{
    var self = this, need_new_subpath = true, d = [], sd = null, add_path;

    def(self, 'transform', {
        get: function() {
            return transform.clone();
        },
        set: function(t) {
            transform = t;
        }
    });
    def(self, '_d', {
        get: function() {
            return d;
        },
        set: function(_d) {
        }
    });
    def(self, '_sd', {
        get: function() {
            if (!sd) sd = path_to_segments(d);
            return sd;
        },
        set: function(_sd) {
        }
    });
    self.moveTo = function(x, y) {
        var xy = handle([x, y], transform);
        if (!xy) return self;
        d.push(xy);
        need_new_subpath = false;
        return self;
    };
    self.closePath = function() {
        if (d.length && 2 < d[d.length-1].length)
        {
            var x0 = +d[d.length-1][0],
                y0 = d[d.length-1][1],
                x2 = +d[d.length-1][2],
                y2 = d[d.length-1][3],
                x1 = +d[d.length-1][d[d.length-1].length-2],
                y1 = d[d.length-1][d[d.length-1].length-1]
            ;
            if (!(is_almost_equal(x0, x1, 1e-6) && is_almost_equal(y0, y1, 1e-6)))
            {
                d[d.length-1].push(new Marker(x0, {join:[x2, y2]}), y0);
            }
            else
            {
                d[d.length-1][d[d.length-1].length-2] = new Marker(x1, {join:[x2, y2]});
            }
            d.push([x0, y0]);
            need_new_subpath = false;
            sd = null;
        }
        return self;
    };
    self.lineTo = function(x, y) {
        var xy = handle([x, y], transform);
        if (!xy) return self;
        if (need_new_subpath)
        {
            d.push(xy);
            need_new_subpath = false;
        }
        else
        {
            d[d.length-1].push(xy[0], xy[1]);
            sd = null;
        }
        return self;
    };
    self.rect = function(x, y, w, h) {
        var p = handle([
            x, y,
            x + w, y,
            x + w, y + h,
            x, y + h
        ], transform);
        if (!p) return self;
        p[0] = new Marker(+p[0], {lineCap:'butt', lineJoin:'miter'});
        if (d.length && 2 >= d[d.length-1].length)
        {
            d[d.length-1] = p;
        }
        else
        {
            d.push(p);
        }
        sd = null;
        return self.closePath();
    };
    self.roundRect = function(x, y, w, h/*,..*/) {
        var p = handle([
            x, y, w, h
        ]);
        if (!p) return self;
        var radii = (arguments[4] && arguments[4].push ? arguments[4] : [].slice.call(arguments, 4)).filter(function(r) {return 0 < r;});
        if (1 > radii.length || 4 < radii.length) err('Invalid radii in roundRect');
        var upperLeft, upperRight, lowerRight, lowerLeft, t;
        if (4 === radii.length)
        {
            upperLeft = radii[0];
            upperRight = radii[1];
            lowerRight = radii[2];
            lowerLeft = radii[3];
        }
        else if (3 === radii.length)
        {
            upperLeft = radii[0];
            upperRight = radii[1];
            lowerLeft = radii[1];
            lowerRight = radii[2];
        }
        else if (2 === radii.length)
        {
            upperLeft = radii[0];
            lowerRight = radii[0];
            upperRight = radii[1];
            lowerLeft = radii[1];
        }
        else
        {
            upperLeft = radii[0];
            upperRight = radii[0];
            lowerRight = radii[0];
            lowerLeft = radii[0];
        }
        if (0 > w)
        {
            x += w;
            w = -w;
            t = upperLeft;
            upperLeft = upperRight;
            upperRight = t;
            t = lowerLeft;
            lowerLeft = lowerRight;
            lowerRight = t;
        }
        if (0 > h)
        {
            y += h;
            h = -h;
            t = upperLeft;
            upperLeft = lowerLeft;
            lowerLeft = t;
            t = upperRight;
            upperRight = lowerRight;
            lowerRight = t;
        }
        var top = upperLeft + upperRight,
            right = upperRight + lowerRight,
            bottom = lowerRight + lowerLeft,
            left = upperLeft + lowerLeft,
            scale = stdMath.min(w/top, h/right, w/bottom, h/left);
        if (scale < 1)
        {
            upperLeft *= scale;
            upperRight *= scale;
            lowerLeft *= scale;
            lowerRight *= scale;
        }
        p = [];
        add_point(p, x + upperLeft, y, transform);
        add_point(p, x + w - upperRight, y, transform);
        add_arcto(p, x + w - upperRight, y, x + w, y, x + w, y + upperRight, upperRight, transform);
        add_point(p, x + w, y + h - lowerRight, transform);
        add_arcto(p, x + w, y + h - lowerRight, x + w, y + h, x + w - lowerRight, y + h, lowerRight, transform);
        add_point(p, x + lowerLeft, y + h, transform);
        add_arcto(p, x + lowerLeft, y + h, x, y + h, x, y + h - lowerLeft, lowerLeft, transform);
        add_point(p, x, y + upperLeft, transform);
        add_arcto(p, x, y + upperLeft, x, y, x + upperLeft, y, upperLeft, transform);
        p[0] = new Marker(+p[0], {lineCap:'butt', lineJoin:'bevel'});
        d.push(p);
        sd = null;
        return self.closePath();
    };
    self.arc = function(cx, cy, r, start, end, ccw) {
        var p = handle([
            cx, cy, r,
            start, end
        ]);
        if (!p) return self;
        if (0 > r) err('Negative radius in arc');
        p = arc_points(cx, cy, r, r, 0, start, end, ccw, transform);
        p[0] = new Marker(+p[0], {type:'arc', lineCap:true, lineJoin:'bevel'});
        p[p.length-2] = new Marker(+p[p.length-2], {type:'arc', lineCap:true, lineJoin:true});
        if (need_new_subpath)
        {
            d.push(p);
            need_new_subpath = false;
        }
        else
        {
            d[d.length-1].push.apply(d[d.length-1], p);
        }
        sd = null;
        return self;
    };
    self.ellipse = function(cx, cy, rx, ry, angle, start, end, ccw) {
        var p = handle([
            cx, cy, rx, ry,
            angle, start, end
        ]);
        if (!p) return self;
        if (0 > rx || 0 > ry) err('Negative radius in ellipse');
        p = arc_points(cx, cy, rx, ry, angle, start, end, ccw, transform);
        p[0] = new Marker(+p[0], {type:'arc', lineCap:true, lineJoin:'bevel'});
        p[p.length-2] = new Marker(+p[p.length-2], {type:'arc', lineCap:true, lineJoin:true});
        if (need_new_subpath)
        {
            d.push(p);
            need_new_subpath = false;
        }
        else
        {
            d[d.length-1].push.apply(d[d.length-1], p);
        }
        sd = null;
        return self;
    };
    self.arcTo = function(x1, y1, x2, y2, r) {
        var p = handle([
            x1, y1,
            x2, y2,
            r
        ]), p0;
        if (!p) return self;
        if (0 > r) err('Negative radius in arcTo');
        if (need_new_subpath)
        {
            d.push(transform.transform(p[0], p[1]));
            need_new_subpath = false;
        }
        p0 = transform.inv().transform(+d[d.length-1][d[d.length-1].length-2], d[d.length-1][d[d.length-1].length-1]);
        p = arc2_points(p0[0], p0[1], p[0], p[1], p[2], p[3], r, transform);
        p[0] = new Marker(+p[0], {type:'arc', lineCap:true, lineJoin:'bevel'});
        p[p.length-2] = new Marker(+p[p.length-2], {type:'arc', lineCap:true, lineJoin:true});
        d[d.length-1].push.apply(d[d.length-1], p);
        sd = null;
        return self;
    };
    self.quadraticCurveTo = function(x1, y1, x2, y2) {
        var p = handle([
            x1, y1,
            x2, y2
        ], transform);
        if (!p) return self;
        if (need_new_subpath)
        {
            d.push([p[0], p[1]]);
            need_new_subpath = false;
        }
        var y0 = d[d.length-1].pop(),
            x0 = +d[d.length-1].pop();
        p = bezier_points([x0, y0, p[0], p[1], p[2], p[3]], transform);
        p[0] = new Marker(+p[0], {type:'bezier', lineCap:true, lineJoin:'bevel'});
        p[p.length-2] = new Marker(+p[p.length-2], {type:'bezier', lineCap:true, lineJoin:true});
        d[d.length-1].push.apply(d[d.length-1], p);
        sd = null;
        return self;
    };
    self.bezierCurveTo = function(x1, y1, x2, y2, x3, y3) {
        var p = handle([
            x1, y1,
            x2, y2,
            x3, y3
        ], transform);
        if (!p) return self;
        if (need_new_subpath)
        {
            d.push([p[0], p[1]]);
            need_new_subpath = false;
        }
        var y0 = d[d.length-1].pop(),
            x0 = +d[d.length-1].pop();
        p = bezier_points([x0, y0, p[0], p[1], p[2], p[3], p[4], p[5]], transform);
        p[0] = new Marker(+p[0], {type:'bezier', lineCap:true, lineJoin:'bevel'});
        p[p.length-2] = new Marker(+p[p.length-2], {type:'bezier', lineCap:true, lineJoin:true});
        d[d.length-1].push.apply(d[d.length-1], p);
        sd = null;
        return self;
    };

    self.addPath = function(path/*, transform*/) {
        if (path instanceof Path2D)
        {
            add_path(path);
            sd = null;
        }
        return self;
    };
    self.dispose = function() {
        d = null;
        sd = null;
    };

    add_path = function(path/*, transform*/) {
        var last;
        path._d.reduce(function(d, p) {
            if (p && p.length && (2 < p.length))
            {
                last = [+p[p.length-2], p[p.length-1]];
                d.push(p.slice());
            }
            return d;
        }, d);
        if (last)
        {
            d.push(last);
            need_new_subpath = false;
        }
        else
        {
            need_new_subpath = true;
        }
    };

    if (1 === arguments.length)
    {
        if (path instanceof Matrix2D)
        {
            transform = path;
            path = null;
        }
        else
        {
            transform = null;
        }
    }
    if (!(transform instanceof Matrix2D)) transform = null;
    transform = transform || Matrix2D.EYE();
    if (path)
    {
        if (path instanceof Path2D) add_path(path);
        else parse_path(path, self);
    }
}
Path2D[PROTO] = {
    constructor: Path2D,
    _d: null,
    _sd: null,
    transform: null,
    dispose: null,
    addPath: null,
    moveTo: null,
    lineTo: null,
    rect: null,
    roundRect: null,
    arc: null,
    ellipse: null,
    arcTo: null,
    quadraticCurveTo: null,
    bezierCurveTo: null,
    closePath: null
};
RenderingContext2D.Path2D = Path2D;

function Matrix2D(m11, m12, m13, m21, m22, m23)
{
    var self = this, sx = 1, sy = 1;
    if (arguments.length)
    {
        self.m11 = m11;
        self.m12 = m12;
        self.m13 = m13;
        self.m21 = m21;
        self.m22 = m22;
        self.m23 = m23;
    }
    // aliases
    // https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix
    def(self, 'a', {
        get: function() {
            return self.m11;
        },
        set: function(a) {
            self.m11 = sx = a;
        }
    });
    def(self, 'c', {
        get: function() {
            return self.m12;
        },
        set: function(c) {
            self.m12 = c;
        }
    });
    def(self, 'e', {
        get: function() {
            return self.m13;
        },
        set: function(e) {
            self.m13 = e;
        }
    });
    def(self, 'b', {
        get: function() {
            return self.m21;
        },
        set: function(b) {
            self.m21 = b;
        }
    });
    def(self, 'd', {
        get: function() {
            return self.m22;
        },
        set: function(d) {
            self.m22 = sy = d;
        }
    });
    def(self, 'f', {
        get: function() {
            return self.m23;
        },
        set: function(f) {
            self.m23 = f;
        }
    });
    def(self, 'is2D', {
        get: function() {
            return true;
        },
        set: function(_) {
        }
    });
    def(self, 'isIdentity', {
        get: function() {
            return  is_strictly_equal(self.m11, 1)
                 && is_strictly_equal(self.m12, 0)
                 && is_strictly_equal(self.m13, 0)
                 && is_strictly_equal(self.m21, 0)
                 && is_strictly_equal(self.m22, 1)
                 && is_strictly_equal(self.m23, 0)
             ;
        },
        set: function(_) {
        }
    });
    def(self, 'sx', {
        get: function() {
            return sx;
        },
        set: function(s) {
            sx *= s;
        }
    });
    def(self, 'sy', {
        get: function() {
            return sy;
        },
        set: function(s) {
            sy *= s;
        }
    });
}
Matrix2D[PROTO] = {
    constructor: Matrix2D,
    is2D: true,
    isIdentity: true,
    m11: 1,
    m12: 0,
    m13: 0,
    m21: 0,
    m22: 1,
    m23: 0,
    m31: 0,
    m32: 0,
    m33: 1,
    a: null,
    b: null,
    c: null,
    d: null,
    e: null,
    f: null,
    clone: function() {
        var self = this, m;
        m  = new Matrix2D(
        self.m11, self.m12, self.m13,
        self.m21, self.m22, self.m23
        );
        m.sx = self.sx;
        m.sy = self.sy;
        return m;
    },
    mul: function(other) {
        var self = this, m;
        if (other instanceof Matrix2D)
        {
            m = new Matrix2D(
            self.m11*other.m11 + self.m12*other.m21,
            self.m11*other.m12 + self.m12*other.m22,
            self.m11*other.m13 + self.m12*other.m23 + self.m13,
            self.m21*other.m11 + self.m22*other.m21,
            self.m21*other.m12 + self.m22*other.m22,
            self.m21*other.m13 + self.m22*other.m23 + self.m23
            );
            m.sx = self.sx * other.sx;
            m.sy = self.sy * other.sy;
            return m;
        }
    },
    inv: function() {
        var self = this,
            a00 = self.m11, a01 = self.m12, a02 = self.m13,
            a10 = self.m21, a11 = self.m22, a12 = self.m23,
            det2 = a00*a11 - a01*a10,
            i00 = 0, i01 = 0, i10 = 0, i11 = 0;

        if (is_strictly_equal(det2, 0)) return null;
        i00 = a11/det2; i01 = -a01/det2;
        i10 = -a10/det2; i11 = a00/det2;
        var m = new Matrix2D(
        i00, i01, -i00*a02 - i01*a12,
        i10, i11, -i10*a02 - i11*a12
        );
        m.sx = 1/self.sx;
        m.sy = 1/self.sy;
        return m;
    },
    transform: function(x, y, res) {
        if ((2 === arguments.length) && y && y.length)
        {
            res = y;
            y = x[1];
            x = x[0];
        }
        else if (1 === arguments.length)
        {
            y = x[1];
            x = x[0];
        }
        var self = this,
            tx = self.m11*x + self.m12*y + self.m13,
            ty = self.m21*x + self.m22*y + self.m23;
        if (res && res.length)
        {
            res[0] = tx;
            res[1] = ty;
        }
        else
        {
            res = [
                tx,
                ty
            ];
        }
        return res;
    }
};
Matrix2D.translate = function(tx, ty) {
    return new Matrix2D(
    1, 0, tx || 0,
    0, 1, ty || 0
    );
};
Matrix2D.scale = function(sx, sy, ox, oy) {
    ox = ox || 0;
    oy = oy || 0;
    var m = new Matrix2D(
    sx, 0,  -sx*ox + ox,
    0,  sy, -sy*oy + oy
    );
    m.sx = sx;
    m.sy = sy;
    return m;
};
Matrix2D.rotate = function(theta, ox, oy) {
    ox = ox || 0;
    oy = oy || 0;
    var cos = stdMath.cos(theta || 0), sin = stdMath.sin(theta || 0);
    return new Matrix2D(
    cos, -sin, ox - cos*ox + sin*oy,
    sin,  cos, oy - cos*oy - sin*ox
    );
};
Matrix2D.skewX = function(s) {
    return new Matrix2D(
    1, s || 0, 0,
    0, 1, 0
    );
};
Matrix2D.skewY = function(s) {
    return new Matrix2D(
    1, 0, 0,
    s || 0, 1, 0
    );
};
Matrix2D.EYE = function() {
    return new Matrix2D(
    1, 0, 0,
    0, 1, 0
    );
};
RenderingContext2D.Matrix2D = Matrix2D;

function Marker(value, params)
{
    this.value = value;
    this.params = params || null;
}
Marker[PROTO] = {
    constructor: Marker,
    value: 0,
    params: null,
    valueOf: function() {
        return this.value;
    },
    toString: function() {
        return String(this.value);
    }
};

function handle(coords, transform)
{
    var i, n, res;
    for (i=0,n=coords.length; i<n; ++i)
    {
        if (is_nan(coords[i]) || !is_finite(coords[i]))
            return null;
    }
    if (transform)
    {
        res = [0, 0];
        for (i=0; i<n; i+=2)
        {
            transform.transform(coords[i], coords[i+1], res);
            coords[i] = res[0]; coords[i+1] = res[1];
        }
    }
    return coords;
}
function add_point(p, x, y, transform)
{
    var t = transform ? transform.transform(x, y) : [x, y];
    p.push(t[0], t[1]);
}
function add_arc(p, cx, cy, rx, ry, angle, ts, te, ccw, transform)
{
    p.push.apply(p, arc_points(cx, cy, rx, ry, angle, ts, te, ccw, transform));
}
function add_arcto(p, x0, y0, x1, y1, x2, y2, r, transform)
{
    p.push.apply(p, arc2_points(x0, y0, x1, y1, x2, y2, r, transform));
}
function toVal() {return this.v;}
function dash_endpoint(points, lines, pos, pt, last_pt, total_length)
{
    var t, j, k, l, nl = lines.length;
    pos = clamp(pos, 0, total_length-1);
    if (pos+1 < total_length)
    {
        for (l=last_pt.l||0,j=last_pt.i||0; j<nl; ++j)
        {
            if ((0 < lines[j]) && (l + lines[j] > pos))
            {
                k = j << 1;
                pt.i = j;
                pt.l = l;
                t = clamp((pos-l)/lines[j], 0.0, 1.0);
                if (is_strictly_equal(t, 0.0))
                {
                    pt.x = points[k+0];
                    pt.y = points[k+1];
                }
                else if (is_strictly_equal(t, 1.0))
                {
                    pt.x = points[k+2];
                    pt.y = points[k+3];
                }
                else
                {
                    pt.x = +points[k]+(+points[k+2]-points[k])*t;
                    pt.y = +points[k+1]+(+points[k+3]-points[k+1])*t;
                }
                pt.y = {dx:+points[k+2]-points[k+0],dy:+points[k+3]-points[k+1],v:pt.y,valueOf:toVal};
                return;
            }
            l += lines[j];
        }
    }
    j = nl - 1;
    k = j << 1;
    pt.i = j;
    pt.l = total_length;
    pt.x = points[k+2];
    pt.y = {dx:+points[k+2]-points[k+0],dy:+points[k+3]-points[k+1],v:points[k+3],valueOf:toVal};
}
function dashed_polyline(points, ld, offset, plen, pmin, sx, sy)
{
    var num_coords = points.length,
        num_lines = (num_coords >>> 1) - 1,
        lines = new Array(num_lines),
        i, j, l, index,
        ld_length = ld.length, total_length = 0,
        dash, gap, prev_dash, prev_gap, d1, d2,
        start, end, mid, left, right, prev, last,
        pos, segments, dashes = [];
    for (j=0,i=0; j<num_lines; ++j,i+=2)
    {
        l = hypot((+points[i+2]-points[i])/sx, (+points[i+3]-points[i+1])/sy);
        lines[j] = l; total_length += l;
    }
    start = {x:points[0],y:points[1],i:0,l:0};
    end = {x:points[num_coords-2],y:points[num_coords-1],i:0,l:0};
    index = 0;
    pos = -offset;
    for (;pos < total_length;)
    {
        dash = ld[index]/pmin;
        gap = ld[index+1]/pmin;
        if ((0 < dash) && (0 < pos+dash))
        {
            dash_endpoint(points, lines, pos,        start, end, total_length);
            dash_endpoint(points, lines, pos+dash-1, end, start, total_length);
            segments = null;
            if (start.i+1 < end.i)
            {
                segments = [];
                segments.push(start.x);
                segments.push(start.y);
                segments.push.apply(segments, points.slice((start.i+1) << 1, (end.i) << 1));
                segments.push(end.x);
                segments.push(end.y);
            }
            else if (start.i < end.i)
            {
                segments = [start.x, start.y, points[(end.i << 1) + 0], points[(end.i << 1) + 1], end.x, end.y];
            }
            else if (start.i === end.i)
            {
                segments = [start.x, start.y, end.x, end.y];
            }
            if (segments && segments.length)
            {
                last = dashes.length ? dashes[dashes.length-1] : null;
                prev = last ? {x:last[last.length-2], y:last[last.length-1], i:last.i} : null;
                if (prev && (start.i-1 === prev.i))
                {
                    mid = {x:points[(start.i << 1) + 0], y:points[(start.i << 1) + 1], i:start.i};
                    d1 = hypot((+prev.x-mid.x)/sx, (+prev.y-mid.y)/sy);
                    d2 = hypot((+mid.x-start.x)/sx, (+mid.y-start.y)/sy);
                    if (d1+d2+offset > prev_dash+prev_gap)
                    {
                        // add line join that is missed
                        left = {x:points[(prev.i << 1) + 0], y:points[(prev.i << 1) + 1], i:prev.i};
                        right = {x:points[(start.i << 1) + 2], y:points[(start.i << 1) + 3], i:start.i};
                        dashes.push([mid.x, {dx:+mid.x-left.x,dy:+mid.y-left.y,v:mid.y,valueOf:toVal}, mid.x, mid.y, mid.x, {dx:+right.x-mid.x,dy:+right.y-mid.y,v:mid.y,valueOf:toVal}]);
                        dashes[dashes.length-1].i = start.i;
                        dashes[dashes.length-1].alpha = last.alpha;
                    }
                }
                segments.i = end.i;
                segments.alpha = stdMath.max(0.7, 1 > ld[index] ? ld[index] : 1);
                dashes.push(segments);
            }
        }
        if (0 < dash) pos += dash;
        if (0 < gap) pos += gap;
        prev_dash = dash; prev_gap = gap;
        index += 2; if (index >= ld_length) {index = 0;}
    }
    return dashes;
}
function stroke_polyline(set_pixel, points, lw, lc1, lc2, lj, ml, sx, sy, xmin, ymin, xmax, ymax)
{
    var n = points.length, i,
        x1, y1, x2, y2, xp, yp, xn, yn,
        dx1, dy1, dx2, dy2, dx0, dy0, dx00, dy00, w1, w2, ljj = lj,
        alpha = 0, lcc1 = lc1, lcc2 = lc2;
    if (n < 6)
    {
        x1 = points[0];
        y1 = points[1];
        x2 = points[2];
        y2 = points[3];
        dx2 = stdMath.abs(+x2 - x1);
        dy2 = stdMath.abs(+y2 - y1);
        dx0 = null == y1.dx ? y2.dx : y1.dx;
        dy0 = null == y1.dy ? y2.dy : y1.dy;
        w2 = ww(lw, dx2, dy2, sx, sy, dx0, dy0);
        alpha = stroke_line(set_pixel, +x1, +y1, +x2, +y2, dx2, dy2, w2[0], w2[1], lc1, lc2, lw, xmin, ymin, xmax, ymax, dx0, dy0, points.alpha);
    }
    else
    {
        n -= 2;
        for (i=0; i<n; i+=2)
        {
            x1 = points[i];
            y1 = points[i+1];
            x2 = points[i+2];
            y2 = points[i+3];
            dx2 = stdMath.abs(x2 - x1);
            dy2 = stdMath.abs(y2 - y1);
            dx0 = null == y1.dx ? y2.dx : y1.dx;
            dy0 = null == y1.dy ? y2.dy : y1.dy;
            w2 = ww(lw, dx2, dy2, sx, sy, dx0, dy0);
            if (x1.params && x1.params.lineCap) lcc1 = true === x1.params.lineCap ? lc1 : x1.params.lineCap;
            if (x2.params && x2.params.lineCap) lcc2 = true === x2.params.lineCap ? lc2 : x2.params.lineCap;
            alpha = stdMath.max(alpha, stroke_line(set_pixel, +x1, +y1, +x2, +y2, dx2, dy2, w2[0], w2[1], 0 === i ? lcc1 : null, n === i+2 ? lcc2 : null, lw, xmin, ymin, xmax, ymax, dx0, dy0, points.alpha));
            if (0 < i && (0 < w1[0] || 0 < w1[1] || 0 < w2[0] || 0 < w2[1]))
            {
                if (x1.params && x1.params.lineJoin) ljj = true === x1.params.lineJoin ? lj : x1.params.lineJoin;
                join_lines(set_pixel, +xp, +yp, +x1, +y1, +x2, +y2, dx00 || dx1, dy00 || dy1, w1[0], w1[1], dx0 || dx2, dy0 || dy2, w2[0], w2[1], ljj, ml, xmin, ymin, xmax, ymax, alpha);
            }
            xp = x1;
            yp = y1;
            dx1 = dx2;
            dy1 = dy2;
            dx00 = dx0;
            dy00 = dy0;
            w1 = w2;
        }
    }
    if (x2.params && x2.params.join)
    {
        xp = x2.params.join[0];
        yp = x2.params.join[1];
        dx1 = stdMath.abs(xp - x2);
        dy1 = stdMath.abs(yp - y2);
        dx00 = null;
        dy00 = null;
        w1 = ww(lw, dx1, dy1, sx, sy, dx00, dy00);
        if (0 < w1[0] || 0 < w1[1] || 0 < w2[0] || 0 < w2[1])
        {
            join_lines(set_pixel, +x1, +y1, +x2, +y2, +xp, +yp, dx0 || dx2, dy0 || dy2, w2[0], w2[1], dx00 || dx1, dy00 || dy1, w1[0], w1[1], ljj, ml, xmin, ymin, xmax, ymax, alpha);
        }
    }
}
function stroke_line(set_pixel, x1, y1, x2, y2, dx, dy, wx, wy, c1, c2, lw, xmin, ymin, xmax, ymax, dx0, dy0, alpha0)
{
    if (0 === wx && 0 === wy)
    {
        return wu_line(set_pixel, x1, y1, x2, y2, dx, dy, lw, xmin, ymin, xmax, ymax, true, true, alpha0);
    }
    else if (0 === dx && 0 === dy && null != dx0)
    {
        return wu_line(set_pixel, x1-wx, y1-(dx0*dy0<0 ? 1 : -1)*wy, x2+wx, y2+(dx0*dy0<0 ? 1 : -1)*wy, 2*wx, 2*wy, 1, xmin, ymin, xmax, ymax, false, false, alpha0);
    }
    else
    {
        return wu_thick_line(set_pixel, x1, y1, x2, y2, dx, dy, wx, wy, c1, c2, lw, xmin, ymin, xmax, ymax, dx0, dy0, alpha0);
    }
}
function ww(w, dx, dy, sx, sy, dx0, dy0)
{
    var wxy, n, w2, ox, oy;
    w2 = stdMath.max(0, (w-1)/2);
    ox = 1 === sx ? 0 : sx/2;
    oy = 1 === sy ? 0 : sy/2;
    if (null != dx0)
    {
        dx = stdMath.abs(dx0);
        dy = stdMath.abs(dy0);
    }
    if (0.5 > sx*w2+ox && 0.5 > sy*w2+oy)
    {
        wxy = [0, 0];
    }
    else if (is_strictly_equal(dx, 0))
    {
        wxy = [sx*w2+ox, 0];
    }
    else if (is_strictly_equal(dy, 0))
    {
        wxy = [0, sy*w2+oy];
    }
    else
    {
        n = hypot(dx, dy);
        wxy = [(sx*w2+ox)*dy/n, (sy*w2+oy)*dx/n];
    }
    return wxy;
}
function clip(x1, y1, x2, y2, xmin, ymin, xmax, ymax)
{
    // clip points to viewport
    // https://en.wikipedia.org/wiki/Liang%E2%80%93Barsky_algorithm
    if (null == xmin) return;
    var p1 = -(x2 - x1),
        p2 = -p1,
        p3 = -(y2 - y1),
        p4 = -p3,
        q1 = x1 - xmin,
        q2 = xmax - x1,
        q3 = y1 - ymin,
        q4 = ymax - y1,
        rn2 = 1, rn1 = 0,
        r1, r2, r3, r4;

    if ((p1 === 0 && q1 < 0) || (p2 === 0 && q2 < 0) || (p3 === 0 && q3 < 0) || (p4 === 0 && q4 < 0))
    {
        // parallel to edge and outside of viewport
        return;
    }
    if (p1 !== 0)
    {
        r1 = q1/p1;
        r2 = q2/p2;
        if (p1 < 0)
        {
            if (r1 > rn1) rn1 = r1;
            if (r2 < rn2) rn2 = r2;
        }
        else
        {
            if (r2 > rn1) rn1 = r2;
            if (r1 < rn2) rn2 = r1;
        }
    }
    if (p3 !== 0)
    {
        r3 = q3/p3;
        r4 = q4/p4;
        if (p3 < 0)
        {
            if (r3 > rn1) rn1 = r3;
            if (r4 < rn2) rn2 = r4;
        }
        else
        {
            if (r4 > rn1) rn1 = r4;
            if (r3 < rn2) rn2 = r3;
        }
    }

    // completely outside viewport
    if (rn1 > rn2) return;

    return [
    x1 + p2*rn1, y1 + p4*rn1,
    x1 + p2*rn2, y1 + p4*rn2
    ];
}
function intersect(x1, y1, x2, y2, x3, y3, x4, y4)
{
    var a = y2 - y1, b = x1 - x2, c = x2*y1 - x1*y2,
        k = y4 - y3, l = x3 - x4, m = x4*y3 - x3*y4,
        D = a*l - b*k;
    // zero, infinite or one point
    return is_strictly_equal(D, 0) ? false : {x:(b*m - c*l)/D, y:(c*k - a*m)/D};
}
function fill_rect(set_pixel, x1, y1, x2, y2, xmin, ymin, xmax, ymax, alpha)
{
    // fill a rectangular area between (x1,y1), (x2,y2) integer coords
    var x, y;
    if (x1 > x2)
    {
        x = x1;
        x1 = x2;
        x2 = x;
    }
    if (y1 > y2)
    {
        y = y1;
        y1 = y2;
        y2 = y;
    }
    if (null != xmin)
    {
        // if rect is outside viewport return
        if (x2 < xmin || x1 > xmax || y2 < ymin || y1 > ymax) return;
        x1 = stdMath.max(x1, xmin);
        y1 = stdMath.max(y1, ymin);
        x2 = stdMath.min(x2, xmax);
        y2 = stdMath.min(y2, ymax);
    }
    if (null == alpha) alpha = 1;
    if (y1 === y2)
    {
        for (x=x1; x<=x2; ++x) set_pixel(x, y1, alpha);
    }
    else if (x1 === x2)
    {
        for (y=y1; y<=y2; ++y) set_pixel(x1, y, alpha);
    }
    else
    {
        for (y=y1; y<=y2; ++y)
        {
            for (x=x1; x<=x2; ++x) set_pixel(x, y, alpha);
        }
    }
}
function fill_triangle(set_pixel, ax, ay, bx, by, cx, cy, xmin, ymin, xmax, ymax, alpha)
{
    // fill the triangle defined by a, b, c points
    var x, xx, t,
        y, yb, yc,
        xac, xab, xbc,
        yac, yab, ybc,
        zab, zbc,
        clip = null != xmin, e = 0.5;
    if (clip)
    {
        // if triangle is outside viewport return
        if (stdMath.max(ax, bx, cx) < xmin || stdMath.min(ax, bx, cx) > xmax ||
        stdMath.max(ay, by, cy) < ymin || stdMath.min(ay, by, cy) > ymax)
            return;
    }
    if (null == alpha) alpha = 1;
    if (by < ay)
    {
        t = ay;
        ay = by;
        by = t;
        t = ax;
        ax = bx;
        bx = t;
    }
    if (cy < ay)
    {
        t = ay;
        ay = cy;
        cy = t;
        t = ax;
        ax = cx;
        cx = t;
    }
    if (cy < by)
    {
        t = by;
        by = cy;
        cy = t;
        t = bx;
        bx = cx;
        cx = t;
    }
    yac = cy - ay;
    if (is_strictly_equal(yac, 0))
    {
        // line or single point
        y = stdMath.round(ay);
        x = stdMath.round(stdMath.min(ax, bx, cx));
        xx = stdMath.round(stdMath.max(ax, bx, cx));
        return fill_rect(set_pixel, x, y, xx, y, xmin, ymin, xmax, ymax, alpha);
    }
    yab = by - ay;
    ybc = cy - by;
    xac = cx - ax;
    xab = bx - ax;
    xbc = cx - bx;
    zab = is_strictly_equal(yab, 0);
    zbc = is_strictly_equal(ybc, 0);
    y = stdMath.round(ay + e);
    yb = by;
    yc = stdMath.round(cy - e);
    if (clip) {y = stdMath.max(ymin, y); yc = stdMath.min(ymax, yc);}
    for (; y<=yc; ++y)
    {
        if (y < yb)
        {
            if (zab)
            {
                x = ax;
                xx = bx;
            }
            else
            {
                x = xac*(y - ay)/yac + ax;
                xx = xab*(y - ay)/yab + ax;
            }
        }
        else
        {
            if (zbc)
            {
                x = bx;
                xx = cx;
            }
            else
            {
                x = xac*(y - ay)/yac + ax;
                xx = xbc*(y - by)/ybc + bx;
            }
        }
        if (stdMath.abs(xx - x) < 1)
        {
            if (!clip || (x >= xmin && x <= xmax)) set_pixel(stdMath.round(x), y, 1);
            continue;
        }
        if (xx < x)
        {
            t = x;
            x = xx;
            xx = t;
        }
        x = stdMath.round(x +  e);
        xx = stdMath.round(xx - e);
        if (clip) {x = stdMath.max(xmin, x); xx = stdMath.min(xmax, xx);}
        for (; x<=xx; ++x) set_pixel(x, y, alpha);
    }
}
function fill_trapezoid(set_pixel, ax, ay, bx, by, cx, cy, dx, dy, xmin, ymin, xmax, ymax, alpha)
{
    // fill the trapezoid defined by a, b, c, d, points in order
    var y = stdMath.min(ay, by, cy, dy),
        yy = stdMath.max(ay, by, cy, dy),
        x = stdMath.min(ax, bx, cx, dx),
        xx = stdMath.max(ax, bx, cx, dx),
        y1, y2, x1, x2, xi, edges,
        clip = null != xmin, t, i, j, e = 0.5;
    if (clip)
    {
        // if is outside viewport return
        if (yy < ymin || y > ymax || xx < xmin || x > xmax)
            return;
    }
    if (null == alpha) alpha = 1;
    if (is_strictly_equal(y, yy))
    {
        // line or single point
        y = stdMath.round(y);
        x = stdMath.round(x);
        xx = stdMath.round(xx);
        return fill_rect(set_pixel, x, y, xx, y, xmin, ymin, xmax, ymax, alpha);
    }
    y = stdMath.round(y);
    yy = stdMath.round(yy);
    if (clip) {y = stdMath.max(ymin, y); yy = stdMath.min(ymax, yy);}
    if (y > yy) return;
    edges = [
    by < ay ? [bx, by, ax, ay] : [ax, ay, bx, by],
    cy < by ? [cx, cy, bx, by] : [bx, by, cx, cy],
    dy < cy ? [dx, dy, cx, cy] : [cx, cy, dx, dy],
    ay < dy ? [ax, ay, dx, dy] : [dx, dy, ax, ay]
    ];
    /*if (a > b) swap(a,b)
    if (c > d) swap(c,d)
    if (a > c) swap(a,c)
    if (b > d) swap(b,d)
    if (b > c) swap(b,c)*/
    if (edges[1][1] < edges[0][1]) {t=edges[0]; edges[0]=edges[1]; edges[1]=t;}
    if (edges[3][1] < edges[2][1]) {t=edges[2]; edges[2]=edges[3]; edges[3]=t;}
    if (edges[2][1] < edges[0][1]) {t=edges[0]; edges[0]=edges[2]; edges[2]=t;}
    if (edges[3][1] < edges[1][1]) {t=edges[1]; edges[1]=edges[3]; edges[3]=t;}
    if (edges[2][1] < edges[1][1]) {t=edges[2]; edges[2]=edges[1]; edges[1]=t;}
    for (i=0; y<=yy; ++y)
    {
        while (i < 4 && edges[i][3] < y) ++i;
        if (i >= 4) return;
        x = INF;
        xx = -INF;
        for (j=i; j<4; ++j)
        {
            x1 = edges[j][0];
            y1 = edges[j][1];
            x2 = edges[j][2];
            y2 = edges[j][3];
            if (y1 <= y && y <= y2)
            {
                if (is_strictly_equal(y1, y2))
                {
                    x = stdMath.min(x, x1, x2);
                    xx = stdMath.max(xx, x1, x2);
                }
                else
                {
                    xi = (x2 - x1)*(y - y1)/(y2 - y1) + x1;
                    x = stdMath.min(x, xi);
                    xx = stdMath.max(xx, xi);
                }
            }
        }
        if (xx - x < 1)
        {
            if (!clip || (x >= xmin && x <= xmax)) set_pixel(stdMath.round(x), y, 1);
            continue;
        }
        x = stdMath.round(x + e);
        xx = stdMath.round(xx - e);
        if (clip) {x = stdMath.max(xmin, x); xx = stdMath.min(xmax, xx);}
        for (; x<=xx; ++x) set_pixel(x, y, alpha);
    }
}
function fill_sector(set_pixel, ax, ay, bx, by, px, py, r, xmin, ymin, xmax, ymax, alpha)
{
    // fill circular sector with radius r defined by line a - b and point p
    var y, yy, x, xx, xi,
        x1, x2, y1, y2, p, n,
        xab, yab, zab, tol = 0.5,
        t, i, j, k, m, e, c,
        cx, cy, ta, tb, t0, t1, tp, ccw,
        clip = null != xmin
    ;
    if (by < ay) {t = ay; ay = by; by = t; t = ax; ax = bx; bx = t;}
    p = point_line_project(px, py, ax, ay, bx, by);
    n = hypot(px - p[0], py - p[1]);
    cx = px + r/n*(p[0] - px);
    cy = py + r/n*(p[1] - py);
    tp = stdMath.atan2(py - cy, px - cx);
    ta = stdMath.atan2(ay - cy, ax - cx);
    tb = stdMath.atan2(by - cy, bx - cx);
    tp = cmod(tp);
    t0 = cmod(ta);
    t1 = cmod(tb);
    ccw = !((tp < t0 && tp < t1) || (tp > t0 && tp > t1) || (tp > t0 && tp < t1));
    p = arc_points(cx, cy, r, r, 0, ta, tb, ccw);
    m = p.length - 2;
    if (null == alpha) alpha = 1;
    // outline of sector
    for (i=0; i<m; i+=2) wu_line(set_pixel, p[i], p[i+1], p[i+2], p[i+3], null, null, alpha, xmin, ymin, xmax, ymax);
    p = path_to_segments([p]);
    y = stdMath.round(stdMath.min(ay, by, py, p.ymin));
    yy = stdMath.round(stdMath.max(ay, by, py, p.ymax));
    if (clip)
    {
        y = stdMath.max(y, ymin);
        yy = stdMath.min(yy, ymax);
    }
    xab = bx - ax;
    yab = by - ay;
    zab = is_strictly_equal(yab, 0);
    i = 0; m = p.length;
    // fill of sector
    for (; y<=yy; ++y)
    {
        while (i < m && p[i][3] < y) ++i;
        if (i >= m) break;
        e = p[i];
        if (e[1] > y)
        {
            y = stdMath.floor(e[1]);
            continue;
        }
        x = INF;
        xx = -INF;
        if (y >= ay && y <= by)
        {
            if (zab)
            {
                x = stdMath.min(x, ax, bx);
                xx = stdMath.max(xx, ax, bx);
            }
            else
            {
                xi = xab*(y - ay)/yab + ax;
                x = stdMath.min(x, xi);
                xx = stdMath.max(xx, xi);
            }
        }
        for (j=i; j<m && p[j][1]<=y; ++j)
        {
            e = p[j];
            if (e[3] >= y)
            {
                x1 = e[0];
                x2 = e[2];
                y1 = e[1];
                y2 = e[3];
                if (is_strictly_equal(y1, y2))
                {
                    x = stdMath.min(x, x1, x2);
                    xx = stdMath.max(xx, x1, x2);
                }
                else
                {
                    xi = (x2 - x1)*(y - y1)/(y2 - y1) + x1;
                    x = stdMath.min(x, xi);
                    xx = stdMath.max(xx, xi);
                }
            }
        }
        x = stdMath.round(x + tol);
        xx = stdMath.round(xx - tol);
        if (clip)
        {
            x = stdMath.max(x, xmin);
            xx = stdMath.min(xx, xmax);
        }
        for (; x<=xx; ++x) set_pixel(x, y, alpha);
    }
}
function wu_line(set_pixel, xs, ys, xe, ye, dx, dy, lw, xmin, ymin, xmax, ymax, gs, ge, alpha0)
{
    var xm = stdMath.min(xs, xe), xM = stdMath.max(xs, xe),
        ym = stdMath.min(ys, ye), yM = stdMath.max(ys, ye),
        alpha = 1 > lw ? lw : 1, do_clip = null != xmin;

    if (null != alpha0 && alpha0 < alpha) alpha = alpha0;

    if (!alpha) return alpha;
    // if line is outside viewport return
    if (do_clip && (xM < xmin || xm > xmax || yM < ymin || ym > ymax)) return alpha;

    if (null == dx)
    {
        dx = stdMath.abs(xe - xs);
        dy = stdMath.abs(ye - ys);
    }

    // clip it to viewport if needed
    if (do_clip && (xm < xmin || xM > xmax || ym < ymin || yM > ymax))
    {
        var clipped = clip(xs, ys, xe, ye, xmin, ymin, xmax, ymax);
        if (!clipped) return alpha;
        xs = clipped[0];
        ys = clipped[1];
        xe = clipped[2];
        ye = clipped[3];
    }

    if (is_strictly_equal(dx, 0) || is_strictly_equal(dy, 0))
    {
        fill_rect(set_pixel, stdMath.round(xs), stdMath.round(ys), stdMath.round(xe), stdMath.round(ye), null, null, null, null, alpha);
        return alpha;
    }

    // Wu's line algorithm
    // https://en.wikipedia.org/wiki/Xiaolin_Wu%27s_line_algorithm
    var x, y,
        x1, x2,
        y1, y2,
        xend, yend,
        gradient = 0,
        intersect = 0,
        fpart = 0,
        rfpart = 0,
        gap = 0,
        e = 0.5,
        steep = dy > dx;

    if (steep)
    {
        x = xs;
        xs = ys;
        ys = x;
        x = xe;
        xe = ye;
        ye = x;
        x = dx;
        dx = dy;
        dy = x;
    }
    if (xs > xe)
    {
        x = xs;
        xs = xe;
        xe = x;
        y = ys;
        ys = ye;
        ye = y;
    }

    gradient = (ys > ye ? -1 : 1)*dy/dx;

    // handle first endpoint
    xend = stdMath.round(xs);
    yend = ys + gradient * (xend - xs);
    gap = gs ? 1 : (1 - (xs + e - stdMath.floor(xs + e)));
    x1 = xend;
    y1 = stdMath.floor(yend);
    fpart = yend - y1;
    rfpart = 1 - fpart;
    if (steep)
    {
        set_pixel(y1, x1, alpha*rfpart*gap);
        set_pixel(y1 + 1, x1, alpha*fpart*gap);
    }
    else
    {
        set_pixel(x1, y1, alpha*rfpart*gap);
        set_pixel(x1, y1 + 1, alpha*fpart*gap);
    }

    intersect = yend + gradient;

    // handle second endpoint
    xend = stdMath.round(xe);
    yend = ye + gradient * (xend - xe);
    gap = ge ? 1 : (xe + e - stdMath.floor(xe + e));
    x2 = xend;
    y2 = stdMath.floor(yend);
    fpart = yend - y2;
    rfpart = 1 - fpart;
    if (steep)
    {
        set_pixel(y2, x2, alpha*rfpart*gap);
        set_pixel(y2 + 1, x2, alpha*fpart*gap);
    }
    else
    {
        set_pixel(x2, y2, alpha*rfpart*gap);
        set_pixel(x2, y2 + 1, alpha*fpart*gap);
    }

    // main loop
    if (steep)
    {
        for (x=x1+1; x<x2; ++x)
        {
            y = stdMath.floor(intersect);
            fpart = intersect - y;
            rfpart = 1 - fpart;
            if (0 < rfpart) set_pixel(y, x, alpha*rfpart);
            if (0 < fpart) set_pixel(y + 1, x, alpha*fpart);
            intersect += gradient;
        }
    }
    else
    {
        for (x=x1+1; x<x2; ++x)
        {
            y = stdMath.floor(intersect);
            fpart = intersect - y;
            rfpart = 1 - fpart;
            if (0 < rfpart) set_pixel(x, y, alpha*rfpart);
            if (0 < fpart) set_pixel(x, y + 1, alpha*fpart);
            intersect += gradient;
        }
    }
    return alpha;
}
function wu_thick_line(set_pixel, xs, ys, xe, ye, dx, dy, wx, wy, cs, ce, lw, xmin, ymin, xmax, ymax, dx0, dy0, alpha0)
{
    var t, sx, sy,
        wsx, wsy,
        xa, xb, xc, xd,
        ya, yb, yc, yd,
        h = hypot(dx, dy),
        alpha = (1 > h ? h : 1) || 1;

    if (null != alpha0 && 1 > alpha0 && 0 < alpha0 /*&& alpha > alpha0*/) alpha = alpha0;

    if (xs > xe)
    {
        t = xs;
        xs = xe;
        xe = t;
        t = ys;
        ys = ye;
        ye = t;
        t = cs;
        cs = ce;
        ce = t;
    }

    sx = 1;
    sy = ys > ye ? -1 : 1;

    if (is_strictly_equal(dx, 0) && (null == dx0 || 0 === dx0))
    {
        if ('square' === cs) ys -= sy*wx;
        if ('square' === ce) ye += sy*wx;
        if ('round' === cs)
        {
            fill_sector(set_pixel, xs-wx, ys, xs+wx, ys, xs, ys-sy*wx, wx, xmin, ymin, xmax, ymax, alpha);
        }
        if ('round' === ce)
        {
            fill_sector(set_pixel, xe-wx, ye, xe+wx, ye, xe, ye+sy*wx, wx, xmin, ymin, xmax, ymax, alpha);
        }
        fill_rect(set_pixel, stdMath.round(xs - wx), stdMath.round(ys), stdMath.round(xs + wx), stdMath.round(ye), xmin, ymin, xmax, ymax, alpha);
        return alpha;
    }
    if (is_strictly_equal(dy, 0) && (null == dy0 || 0 === dy0))
    {
        if ('square' === cs) xs -= sx*wy;
        if ('square' === ce) xe += sx*wy;
        if ('round' === cs)
        {
            fill_sector(set_pixel, xs, ys-wy, xs, ys+wy, xs-wy, ys, wy, xmin, ymin, xmax, ymax, alpha);
        }
        if ('round' === ce)
        {
            fill_sector(set_pixel, xe, ye-wy, xe, ye+wy, xe+wy, ye, wy, xmin, ymin, xmax, ymax, alpha);
        }
        fill_rect(set_pixel, stdMath.round(xs), stdMath.round(ys - wy), stdMath.round(xe), stdMath.round(ys + wy), xmin, ymin, xmax, ymax, alpha);
        return alpha;
    }

    if ('square' === cs) {xs -= sx*wy; ys -= sy*wx;}
    if ('square' === ce) {xe += sx*wy; ye += sy*wx;}

/*
      wx      .b
    +-----.(s)  .
wy  |.a  |  .     . f
       . |    .     .
 dy      |.     .     .
         |  .g    .     . d
         |    .     .(e)
         +----- .----
             dx  c

a: ys + wsy - ys = -(x - xs)/m => x = xs - m*wsy: (xs-wsx, ys+wsy)
b: ys - wsy - ys = -(x - xs)/m => x = xs + m*wsy: (xs+wsx, ys-wsy)
c: ye + wsy - ye = -(x - xe)/m => x = xe - m*wsy: (xe-wsx, ye+wsy)
d: ye - wsy - ye = -(x - xe)/m => x = xe + m*wsy: (xe+wsx, ye-wsy)
f: ys + wsy - (ys-wsy) = -m*(x - (xs+wsx)) => x = xs - 2wsy/m + wsx: (xs - 2wsy/m + wsx, ys+wsy)
g: ye - wsy - (ye+wsy) = -m*(x - (xe-wsx)) => x = xe + 2wsy/m - wsx: (xe + 2wsy/m - wsx, ye-wsy)
*/

    wsx = sx*wx;
    wsy = sy*wy;

    xa = xs - wsx;
    ya = ys + wsy;
    xb = xs + wsx;
    yb = ys - wsy;
    xc = xe - wsx;
    yc = ye + wsy;
    xd = xe + wsx;
    yd = ye - wsy;

    if ('round' === cs || 'round' === ce) lw = hypot(wx, wy);

    // outline
    if ('round' === cs)
    {
        fill_sector(set_pixel, xa, ya, xb, yb, (xa-sx*wy+xb-sx*wy)/2, (ya-sy*wx+yb-sy*wx)/2, lw, xmin, ymin, xmax, ymax, alpha)
    }
    else
    {
        wu_line(set_pixel, xa, ya, xb, yb, null, null, alpha, xmin, ymin, xmax, ymax);
    }
    wu_line(set_pixel, xb, yb, xd, yd, null, null, alpha, xmin, ymin, xmax, ymax);
    if ('round' === ce)
    {
        fill_sector(set_pixel, xd, yd, xc, yc, (xc+sx*wy+xd+sx*wy)/2, (yc+sy*wx+yd+sy*wx)/2, lw, xmin, ymin, xmax, ymax, alpha)
    }
    else
    {
        wu_line(set_pixel, xd, yd, xc, yc, null, null, alpha, xmin, ymin, xmax, ymax);
    }
    wu_line(set_pixel, xc, yc, xa, ya, null, null, alpha, xmin, ymin, xmax, ymax);
    // fill
    /*fill_triangle(set_pixel, xa, ya, xb, yb, xc, yc, xmin, ymin, xmax, ymax, alpha);
    fill_triangle(set_pixel, xb, yb, xc, yc, xd, yd, xmin, ymin, xmax, ymax, alpha);*/
    fill_trapezoid(set_pixel, xa, ya, xb, yb, xd, yd, xc, yc, xmin, ymin, xmax, ymax, alpha);
    return alpha;
}
function join_lines(set_pixel, x1, y1, x2, y2, x3, y3, dx1, dy1, wx1, wy1, dx2, dy2, wx2, wy2, j, ml, xmin, ymin, xmax, ymax, alpha)
{
    var sx1 = x1 > x2 ? -1 : (x1 === x2 && 0 > dx1 ? -1 : 1),
        sy1 = y1 > y2 ? -1 : (y1 === y2 && 0 > dy1 ? -1 : 1),
        sx2 = x2 > x3 ? -1 : (x2 === x3 && 0 > dx2 ? -1 : 1),
        sy2 = y2 > y3 ? -1 : (y2 === y3 && 0 > dy2 ? -1 : 1),
        wsx1, wsy1,
        wsx2, wsy2,
        a1, b1,
        c1, d1,
        a2, b2,
        c2, d2,
        p, q,
        p0, q0,
        t, s,
        mitl, lw;

    dx1 = stdMath.abs(dx1); dy1 = stdMath.abs(dy1);
    dx2 = stdMath.abs(dx2); dy2 = stdMath.abs(dy2);

    // no join needed, 2-3 is a continuation of 1-2 along same line
    if (is_almost_equal(sy1*dy1*sx2*dx2, sy2*dy2*sx1*dx1, 1e-6)) return;
    if (null == alpha) alpha = 1;

    /*if (x1 > x2 && x2 > x3)
    {
        t = x1;
        x1 = x3;
        x3 = t;
        t = y1;
        y1 = y3;
        y3 = t;
        t = dx1;
        dx1 = dx2;
        dx2 = t;
        t = dy1;
        dy1 = dy2;
        dy2 = t;
        t = wx1;
        wx1 = wx2;
        wx2 = t;
        t = wy1;
        wy1 = wy2;
        wy2 = t;
    }

    sx1 = x1 > x2 ? -1 : 1;
    sy1 = y1 > y2 ? -1 : 1;
    sx2 = x2 > x3 ? -1 : 1;
    sy2 = y2 > y3 ? -1 : 1;*/
    wsx1 = sx1*wx1;
    wsy1 = sy1*wy1;
    wsx2 = sx2*wx2;
    wsy2 = sy2*wy2;
    a1 = {x:x1 - wsx1, y:y1 + wsy1};
    b1 = {x:x1 + wsx1, y:y1 - wsy1};
    c1 = {x:x2 - wsx1, y:y2 + wsy1};
    d1 = {x:x2 + wsx1, y:y2 - wsy1};
    a2 = {x:x2 - wsx2, y:y2 + wsy2};
    b2 = {x:x2 + wsx2, y:y2 - wsy2};
    c2 = {x:x3 - wsx2, y:y3 + wsy2};
    d2 = {x:x3 + wsx2, y:y3 - wsy2};
    s = {x:x2, y:y2};

    if (sy1*dy1*sx2*dx2 > sy2*dy2*sx1*dx1)
    {
        p = c1;
        q = a2;
    }
    else
    {
        p = d1;
        q = b2;
    }
    if (0 > sx2*sy1*sx1*sy2)
    {
        p = d1 === p ? c1 : d1;
        q = b2 === q ? a2 : b2;
    }
    if (0 > sx1*sy2)
    {
        p = d1 === p ? c1 : d1;
    }
    if (0 > sx2*sy1)
    {
        q = b2 === q ? a2 : b2;
    }
    if (0 > sx1*sx2)
    {
        p = d1 === p ? c1 : d1;
        q = b2 === q ? a2 : b2;
    }
    if ('bevel' === j)
    {
        wu_line(set_pixel, p.x, p.y, q.x, q.y, null, null, alpha, xmin, ymin, xmax, ymax);
        fill_triangle(set_pixel, s.x, s.y, p.x, p.y, q.x, q.y, xmin, ymin, xmax, ymax, alpha);
    }
    else
    {
        p0 = p === d1 ? b1 : a1;
        q0 = q === b2 ? d2 : c2;
        t = intersect(p0.x, p0.y, p.x, p.y, q.x, q.y, q0.x, q0.y);
        mitl = hypot(t.x - s.x, t.y - s.y);
        lw = stdMath.min(hypot(wx1, wy1), hypot(wx2, wy2));
        if ('round' === j)
        {
            t = {x:s.x + lw*(t.x - s.x)/mitl, y:s.y + lw*(t.y - s.y)/mitl};
            fill_triangle(set_pixel, s.x, s.y, p.x, p.y, q.x, q.y, xmin, ymin, xmax, ymax, alpha);
            fill_sector(set_pixel, p.x, p.y, q.x, q.y, t.x, t.y, lw, xmin, ymin, xmax, ymax, alpha);
        }
        else//if('miter' === j)
        {
            if (mitl > ml*lw)
            {
                wu_line(set_pixel, p.x, p.y, q.x, q.y, null, null, alpha, xmin, ymin, xmax, ymax);
                fill_triangle(set_pixel, s.x, s.y, p.x, p.y, q.x, q.y, xmin, ymin, xmax, ymax, alpha);
            }
            else
            {
                wu_line(set_pixel, p.x, p.y, t.x, t.y, null, null, alpha, xmin, ymin, xmax, ymax);
                wu_line(set_pixel, q.x, q.y, t.x, t.y, null, null, alpha, xmin, ymin, xmax, ymax);
                fill_triangle(set_pixel, s.x, s.y, p.x, p.y, q.x, q.y, xmin, ymin, xmax, ymax, alpha);
                fill_triangle(set_pixel, t.x, t.y, p.x, p.y, q.x, q.y, xmin, ymin, xmax, ymax, alpha);
            }
        }
    }
}
function arc_angles(ts, te, ccw)
{
    var t0 = cmod(ts), t1 = te + (t0 - ts);
    if (!ccw && t1 - t0 >= TWO_PI) t1 = t0 + TWO_PI;
    else if (ccw && t0 - t1 >= TWO_PI) t1 = t0 - TWO_PI;
    else if (!ccw && t0 > t1) t1 = t0 + (TWO_PI - cmod(t0 - t1));
    else if (ccw && t0 < t1) t1 = t0 - (TWO_PI - cmod(t1 - t0));
    return [t0, t1];
}
function arc_points(cx, cy, rx, ry, a, ts, te, ccw, transform)
{
    var tt = arc_angles(ts, te, ccw);
    ts = tt[0]; te = tt[1];
    var cos = a ? stdMath.cos(a) : 1,
        sin = a ? stdMath.sin(a) : 0,
        delta = te - ts,
        hasTransform = transform && !transform.isIdentity,
        arc = function(t) {
            var p = ts + t*delta,
                x = rx*stdMath.cos(p),
                y = ry*stdMath.sin(p),
                xo = cx + cos*x - sin*y,
                yo = cy + sin*x + cos*y;
            return hasTransform ? transform.transform(xo, yo) : [xo, yo];
        },
        points = sample_curve(arc, hasTransform ? transform.sx : 1, hasTransform ? transform.sy : 1);

    // normally must call .closePath even if the whole TWO_PI arc is drawn
    //if (stdMath.abs(delta)+1e-3 >= TWO_PI && (!is_almost_equal(points[0], points[points.length-2], 1e-3) || !is_almost_equal(points[1], points[points.length-1], 1e-3))) points.push(points[0], points[1]);
    return points;
}
function arc2_points(x0, y0, x1, y1, x2, y2, r, transform)
{
    var p = [], params = arc2arc(x0, y0, x1, y1, x2, y2, r), p0;
    if (params && 2 <= params.length)
    {
        p0 = transform ? transform.transform(params[0], params[1]) : [params[0], params[1]];
        p.push(p0[0], p0[1]);
        if (2 < params.length)
        {
            p.push.apply(p, arc_points(params[2], params[3], r, r, 0, params[4], params[5], params[6], transform));
        }
    }
    return p;
}
function arc2arc(x0, y0, x1, y1, x2, y2, r)
{
    // adapted from node-canvas
    if (
        (is_almost_equal(x1, x0) && is_almost_equal(y1, y0))
        || (is_almost_equal(x1, x2) && is_almost_equal(y1, y2))
        || is_almost_equal(r, 0)
    )
    {
        return [x1, y1];
    }

    var p1p0, p1p2,
        p1p0_length, p1p2_length,
        cos_phi, factor_max, tangent,
        factor_p1p0, t_p1p0,
        factor_p1p2, t_p1p2,
        orth_p1p0, orth_p1p0_length,
        orth_p1p2, orth_p1p2_length,
        factor_ra, cos_alpha,
        center, sa, ea, ccw = false
    ;

    p1p0 = {x:x0 - x1, y:y0 - y1};
    p1p2 = {x:x2 - x1, y:y2 - y1};
    p1p0_length = hypot(p1p0.x, p1p0.y);
    p1p2_length = hypot(p1p2.x, p1p2.y);
    cos_phi = (p1p0.x * p1p2.x + p1p0.y * p1p2.y) / (p1p0_length * p1p2_length);

    // all points on a line
    if (is_strictly_equal(cos_phi, -1))
    {
        return [x1, y1];
    }

    if (is_strictly_equal(cos_phi, 1))
    {
        // infinite far away point
        factor_max = 65535 / p1p0_length;
        return [x0 + factor_max * p1p0.x, y0 + factor_max * p1p0.y];
    }

    tangent = r / stdMath.tan(stdMath.acos(cos_phi) / 2);
    factor_p1p0 = tangent / p1p0_length;
    t_p1p0 = {x:x1 + factor_p1p0 * p1p0.x, y:y1 + factor_p1p0 * p1p0.y};

    orth_p1p0 = {x:p1p0.y, y:-p1p0.x};
    orth_p1p0_length = hypot(orth_p1p0.x, orth_p1p0.y);
    factor_ra = r / orth_p1p0_length;

    cos_alpha = (orth_p1p0.x * p1p2.x + orth_p1p0.y * p1p2.y) / (orth_p1p0_length * p1p2_length);
    if (cos_alpha < 0)
    {
        orth_p1p0 = {x:-orth_p1p0.x, y:-orth_p1p0.y};
    }

    center = {x:t_p1p0.x + factor_ra * orth_p1p0.x, y:t_p1p0.y + factor_ra * orth_p1p0.y};

    orth_p1p0 = {x:-orth_p1p0.x, y:-orth_p1p0.y};
    sa = stdMath.acos(orth_p1p0.x / orth_p1p0_length);
    if (orth_p1p0.y < 0) sa = TWO_PI - sa;

    factor_p1p2 = tangent / p1p2_length;
    t_p1p2 = {x:x1 + factor_p1p2 * p1p2.x, y:y1 + factor_p1p2 * p1p2.y};
    orth_p1p2 = {x:t_p1p2.x - center.x, y:t_p1p2.y - center.y};
    orth_p1p2_length = hypot(orth_p1p2.x, orth_p1p2.y);
    ea = stdMath.acos(orth_p1p2.x / orth_p1p2_length);

    if (orth_p1p2.y < 0) ea = TWO_PI - ea;
    if ((sa > ea) && ((sa - ea) < PI)) ccw = true;
    if ((sa < ea) && ((ea - sa) > PI)) ccw = true;

    return [
     t_p1p0.x
    ,t_p1p0.y
    ,center.x
    ,center.y
    ,sa
    ,ea
    ,ccw && !is_almost_equal(TWO_PI, r) ? true : false
    ];
}
function bezier_points(c, transform)
{
    var quadratic = function(t) {
           var t0 = t, t1 = 1 - t, t11 = t1*t1, t10 = 2*t1*t0, t00 = t0*t0;
           return [
               t11*c[0] + t10*c[2] + t00*c[4],
               t11*c[1] + t10*c[3] + t00*c[5]
           ];
        },
        cubic = function(t) {
            var t0 = t, t1 = 1 - t,
                t0t0 = t0*t0, t1t1 = t1*t1,
                t111 = t1t1*t1, t000 = t0t0*t0,
                t110 = 3*t1t1*t0, t100 = 3*t0t0*t1;
           return [
               t111*c[0] + t110*c[2] + t100*c[4] + t000*c[6],
               t111*c[1] + t110*c[3] + t100*c[5] + t000*c[7]
           ];
        },
        hasTransform = transform && !transform.isIdentity;
    return sample_curve(6 < c.length ? cubic : quadratic, hasTransform ? transform.sx : 1, hasTransform ? transform.sy : 1);
}
function stroke_path(set_pixel, path, lineWidth, lineDash, lineDashOffset, lineCap, lineJoin, miterLimit, sx, sy, xmin, ymin, xmax, ymax)
{
    var patternInfo = {length:0, min:INF, offset:lineDashOffset};
    lineDash.forEach(function(segment) {
        patternInfo.length += segment;
        patternInfo.min = stdMath.min(patternInfo.min, segment);
    });
    if (patternInfo.min >= 1) patternInfo.min = 1;
    if (patternInfo.offset >= patternInfo.length) patternInfo.offset -= stdMath.floor(patternInfo.offset/patternInfo.length)*patternInfo.length;
    if (patternInfo.offset < 0) patternInfo.offset += stdMath.ceil(-patternInfo.offset/patternInfo.length)*patternInfo.length;
    patternInfo.offset /= patternInfo.min;
    for (var i=0,d=path._d,n=d.length,p; i<n; ++i)
    {
        p = d[i];
        if (p && (2 < p.length))
        {
            var _p = lineDash.length ? dashed_polyline(p, lineDash, patternInfo.offset, patternInfo.length, patternInfo.min, sx, sy) : [p];
            for (var j=0,m=_p.length; j<m; ++j)
            {
                if (0 < _p[j].length) stroke_polyline(set_pixel, _p[j], lineWidth, 0 === j ? lineCap : 'butt', m === 1+j ? lineCap : 'butt', lineJoin, miterLimit, sx, sy, xmin, ymin, xmax, ymax);
            }
        }
    }
}
function fill_path(set_pixel, path, rule, xmin, ymin, xmax, ymax)
{
    var edges = path._sd;
    if (!edges.length) return;
    var n = edges.length,
        edg = new Array(n),
        y = edges.ymin, yM = edges.ymax,
        i = 0, j, k, d, e, c, tol = 0.5,
        y1, y2, x, xm, xM, x1, x2, xi,
        insidel, insider,
        evenodd = 'evenodd' === rule;
    y = stdMath.max(ymin, stdMath.round(y));
    yM = stdMath.min(ymax, stdMath.round(yM));
    for (; y<=yM; ++y)
    {
        while (i < n && edges[i][3] < y) ++i;
        if (i >= n) break;
        e = d = edges[i];
        if (e[1] > y)
        {
            y = stdMath.floor(e[1]);
            continue;
        }
        x1 = e[0];
        x2 = e[2];
        y1 = e[1];
        y2 = e[3];
        if (is_strictly_equal(y1, y2))
        {
            xi = false;
            xm = stdMath.min(x1, x2);
            xM = stdMath.max(x1, x2);
        }
        else
        {
            xi = (x2 - x1)*(y - y1)/(y2 - y1) + x1;
            xm = xi;
            xM = xi;
        }
        // store intersection point to be used later
        e[8] = xi;
        e[9] = 0;
        edg[0] = e;
        k = 1;
        // get rest edges that intersect at this y
        for (j=i+1; j<n && edges[j][1]<=y; ++j)
        {
            e = edges[j];
            if (e[3] >= y)
            {
                x1 = e[0];
                x2 = e[2];
                y1 = e[1];
                y2 = e[3];
                if (is_strictly_equal(y1, y2))
                {
                    xi = false;
                    xm = stdMath.min(xm, x1, x2);
                    xM = stdMath.max(xM, x1, x2);
                }
                else
                {
                    xi = (x2 - x1)*(y - y1)/(y2 - y1) + x1;
                    xm = stdMath.min(xm, xi);
                    xM = stdMath.max(xM, xi);
                }
                // store intersection point to be used later
                e[8] = xi;
                e[9] = 0;
                edg[k++] = e;
            }
        }
        // some edges found are redundant, mark them
        c = redundant(edg, k, y);
        if (c+2 > k) continue; // at least two edges are needed
        xm = stdMath.max(xmin, stdMath.round(xm + tol));
        xM = stdMath.min(xmax, stdMath.round(xM - tol));
        if (xm > xM) continue; // no fill at this point
        if (evenodd)
        {
            // evenodd fill rule
            for (x=xm; x<=xM; ++x)
            {
                for (insidel=false,insider=false,j=0; j<k; ++j)
                {
                    e = edg[j];
                    if (e[9]) continue; // redundant
                    xi = e[8];
                    if (false === xi) continue; // no intersection
                    // intersects segment on the left side
                    if (xi < x) insidel = !insidel;
                    // intersects segment on the right side
                    if (xi > x) insider = !insider;
                }
                if (insidel && insider) set_pixel(x, y, 1);
            }
        }
        else
        {
            // nonzero fill rule
            for (x=xm; x<=xM; ++x)
            {
                for (insidel=0,insider=0,j=0; j<k; ++j)
                {
                    e = edg[j];
                    if (e[9]) continue; // redundant
                    xi = e[8];
                    if (false === xi) continue; // no intersection
                    if (xi < x || xi > x)
                    {
                        c = wn(x, y, e[0 > e[4] ? 2 : 0], e[0 > e[4] ? 3 : 1], e[0 > e[4] ? 0 : 2], e[0 > e[4] ? 1 : 3]);
                        // intersects segment on the left side
                        if (xi < x) insidel += c;
                        // intersects segment on the right side
                        if (xi > x) insider += c;
                    }
                }
                if (insidel && insider) set_pixel(x, y, 1);
            }
        }
    }
}
/*function point_in_stroke(x, y, path, lw)
{
    // NOTE: lineDashes, lineJoins, etc are not taken account of
    var i, j, p, m,
        d = path._d, n = d.length,
        x1, y1, x2, y2,
        sx = stdMath.abs(path.transform.sx),
        sy = stdMath.abs(path.transform.sy);
    if (null == lw) lw = 1;
    for (i=0; i<n; ++i)
    {
        p = d[i];
        m = p.length - 2;
        if (0 < m)
        {
            for (j=0; j<m; j+=2)
            {
                x1 = +p[j];
                y1 = p[j+1];
                x2 = +p[j+2];
                y2 = p[j+3];
                //if (is_almost_equal((y2 - y1)*(x - x1), (y - y1)*(x2 - x1), 1e-4))
                if (2*point_line_segment_distance(x, y, x1, y1, x2, y2, sx, sy) <= lw)
                {
                    return true;
                }
            }
        }
    }
    return false;
}*/
function point_in_path(x, y, path, rule)
{
    var edges = path._sd;
    if (!edges.length || y < edges.ymin || y > edges.ymax) return false;
    var n = edges.length,
        edg = new Array(n),
        i = 0, j, k, d, e, c,
        y1, y2, xm, xM, x1, x2, xi,
        insidel, insider,
        evenodd = 'evenodd' === rule;
    while (i < n && edges[i][3] < y) ++i;
    if (i >= n) return false;
    e = d = edges[i];
    if (e[1] > y) return false;
    x1 = e[0];
    x2 = e[2];
    y1 = e[1];
    y2 = e[3];
    if (is_strictly_equal(y1, y2))
    {
        xi = false;
        xm = stdMath.min(x1, x2);
        xM = stdMath.max(x1, x2);
    }
    else
    {
        xi = (x2 - x1)*(y - y1)/(y2 - y1) + x1;
        xm = xi;
        xM = xi;
    }
    // store intersection point to be used later
    e[8] = xi;
    e[9] = 0;
    edg[0] = e;
    k = 1;
    // get rest edges that intersect at this y
    for (j=i+1; j<n && edges[j][1]<=y; ++j)
    {
        e = edges[j];
        if (e[3] >= y)
        {
            x1 = e[0];
            x2 = e[2];
            y1 = e[1];
            y2 = e[3];
            if (is_strictly_equal(y1, y2))
            {
                xi = false;
                xm = stdMath.min(xm, x1, x2);
                xM = stdMath.max(xM, x1, x2);
            }
            else
            {
                xi = (x2 - x1)*(y - y1)/(y2 - y1) + x1;
                xm = stdMath.min(xm, xi);
                xM = stdMath.max(xM, xi);
            }
            // store intersection point to be used later
            e[8] = xi;
            e[9] = 0;
            edg[k++] = e;
        }
    }
    // some edges found are redundant, mark them
    c = redundant(edg, k, y);
    if (c+2 > k) return false === edg[0][8] ? false : is_almost_equal(x, edg[0][8]);
    if (xm > xM || x < xm || x > xM) return false;
    if (evenodd)
    {
        // evenodd fill rule
        for (insidel=false,insider=false,j=0; j<k; ++j)
        {
            e = edg[j];
            if (e[9]) continue; // redundant
            xi = e[8];
            if (false === xi) continue; // no intersection
            // intersects segment on the left side
            if (xi <= x) insidel = !insidel;
            // intersects segment on the right side
            if (xi >= x) insider = !insider;
        }
        if (insidel && insider) return true;
    }
    else
    {
        // nonzero fill rule
        for (insidel=0,insider=0,j=0; j<k; ++j)
        {
            e = edg[j];
            if (e[9]) continue; // redundant
            xi = e[8];
            if (false === xi) continue; // no intersection
            if (xi < x || xi > x)
            {
                c = wn(x, y, e[0 > e[4] ? 2 : 0], e[0 > e[4] ? 3 : 1], e[0 > e[4] ? 0 : 2], e[0 > e[4] ? 1 : 3]);
                // intersects segment on the left side
                if (xi <= x) insidel += c;
                // intersects segment on the right side
                if (xi >= x) insider += c;
            }
        }
        if (insidel && insider) return true;
    }
    return false;
}

// utilities -----------------------
function path_to_segments(polylines)
{
    if (!polylines) return [];
    var segments = [],
        m = polylines.length,
        n, i, j, k, l, h, p,
        ymin = INF, ymax = -INF;
    for (k=0,l=0,j=0; j<m; ++j)
    {
        p = polylines[j];
        if (!p) continue;
        n = p.length - 2;
        if (0 >= n) continue;
        ++k; l = 1; h = -1;
        for (i=0; i<n; i+=2)
        {
            if (p[i].params && p[i].params.type)
            {
                if ((0 <= h) && h < segments.length)
                {
                    // relate start and end of curve segments
                    segments[h][7] = segments[h+l-2][6] + 1;
                    segments[h+l-2][7] = segments[h][6] + 1;
                }
                ++k;
                l = 1;
                h = segments.length;
            }
            ymin = stdMath.min(ymin, p[i+1]);
            ymax = stdMath.max(ymax, p[i+1]);
            if (p[i+1] > p[i+3])
            {
                segments.push([+p[i+2], p[i+3], +p[i], p[i+1], -1, k, l, l, 0, 0]);
            }
            else
            {
                segments.push([+p[i], p[i+1], +p[i+2], p[i+3], 1, k, l, l, 0, 0]);
            }
            ++l;
        }
        ymin = stdMath.min(ymin, p[n+1]);
        ymax = stdMath.max(ymax, p[n+1]);
    }
    segments = segments.sort(asc);
    segments.ymin = ymin;
    segments.ymax = ymax;
    return segments;
}
function redundant(edg, n, y)
{
    var i, j, e, f, c = 0;
    for (i=0; i<n; ++i)
    {
        e = edg[i];
        if (e[9]) continue;
        for (j=i+1; j<n; ++j)
        {
            f = edg[j];
            if (f[9] || (e[4] !== f[4]) || (e[5] !== f[5])
                || ((1 < stdMath.abs(e[6] - f[6])) && (1 < stdMath.abs(e[7] - f[7])))) continue;
            if (
                (is_almost_equal(e[0], f[0], 1e-6)
                && is_almost_equal(e[1], f[1], 1e-6)
                && is_almost_equal(e[2], f[2], 1e-6)
                && is_almost_equal(e[3], f[3], 1e-6))
                || is_almost_equal(e[3], f[1], 1e-6)
                || is_almost_equal(e[1], f[3], 1e-6)
            )
            {
                f[9] = 1;
                ++c;
            }
        }
    }
    return c;
}
function sample_curve(f, sx, sy)
{
    var i, p, points = [], n = NUM_POINTS;
    p = f(0);
    points.push(p[0], p[1]);
    for (i=0; i<n; ++i)
    {
        p = subdivide_curve(points, f, sx, sy, 0 === i ? 0 : i/n, n === i+1 ? 1 : (i+1)/n, p, null);
    }
    return points;
}
function subdivide_curve(points, f, sx, sy, l, r, left, right)
{
    if ((l >= r) || is_almost_equal(l, r, 1e-6)) return left;
    left = left || f(l); right = right || f(r);
    var m, middle, sc = stdMath.max(sx, sy),
        d = hypot((right[0] - left[0]), (right[1] - left[1]))*sc;
    if (d <= MIN_LEN)
    {
        // segment should have at least 2 pixels length
        // return linear interpolation between left and right
        if (d < 1) return left;
        points.push(right[0], right[1]);
    }
    else
    {
        m = (l + r) / 2;
        middle = f(m);
        if (point_line_distance(middle[0], middle[1], left[0], left[1], right[0], right[1])*sc < PIXEL_SIZE)
        {
            // no more refinement
            // return linear interpolation between left and right
            points.push(right[0], right[1]);
        }
        else
        {
            // recursively subdivide to refine samples with high enough curvature
            subdivide_curve(points, f, sx, sy, l, m, left, middle);
            subdivide_curve(points, f, sx, sy, m, r, middle, right);
        }
    }
    return right;
}
function parse_path(d, path)
{
    var c = trim(String(d)).match(COMMAND),
        p = d.split(COMMAND),
        curr = [0, 0], start = [curr[0], curr[1]],
        prev = null, hasPath = false, hasMoveTo = false;
    c && c.forEach(function(c, i) {
        var isRelative = c === c.toLowerCase(),
            pp = (trim(p[i+1] || '').match(NUMBER) || []).map(parse_number),
            p1, p2, p3, p4, tmp, implicitLine;
        switch (c.toUpperCase())
        {
            case 'M':
            implicitLine = false;
            while (2 <= pp.length)
            {
                if (implicitLine)
                {
                    p1 = [curr[0], curr[1]];
                    p2 = [
                    (isRelative ? p1[0] : 0) + pp.shift(),
                    (isRelative ? p1[1] : 0) + pp.shift(),
                    ];
                    curr[0] = p2[0];
                    curr[1] = p2[1];
                    path.lineTo(curr[0], curr[1]);
                    hasPath = true;
                }
                else
                {
                    curr[0] = (isRelative ? curr[0] : 0) + pp.shift();
                    curr[1] = (isRelative ? curr[1] : 0) + pp.shift();
                    start = [curr[0], curr[1]];
                    path.moveTo(curr[0], curr[1]);
                    hasMoveTo = true;
                }
                implicitLine = true;
            }
            prev = null;
            break;
            case 'H':
            hasPath = hasMoveTo || hasPath;
            while (1 <= pp.length)
            {
                p1 = [curr[0], curr[1]];
                p2 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                p1[1]
                ];
                curr[0] = p2[0];
                curr[1] = p2[1];
                path.lineTo(curr[0], curr[1]);
                if (hasMoveTo) hasPath = true;
                hasMoveTo = true;
            }
            prev = null;
            break;
            case 'V':
            hasPath = hasMoveTo || hasPath;
            while (1 <= pp.length)
            {
                p1 = [curr[0], curr[1]];
                p2 = [
                p1[0],
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                curr[0] = p2[0];
                curr[1] = p2[1];
                path.lineTo(curr[0], curr[1]);
                if (hasMoveTo) hasPath = true;
                hasMoveTo = true;
            }
            prev = null;
            break;
            case 'L':
            hasPath = hasMoveTo || hasPath;
            while (2 <= pp.length)
            {
                p1 = [curr[0], curr[1]];
                p2 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                curr[0] = p2[0];
                curr[1] = p2[1];
                path.lineTo(curr[0], curr[1]);
                if (hasMoveTo) hasPath = true;
                hasMoveTo = true;
            }
            prev = null;
            break;
            case 'A':
            hasPath = true;
            hasMoveTo = true;
            while (7 <= pp.length)
            {
                tmp = {
                    start: null,
                    end: null,
                    radiusX: pp.shift(),
                    radiusY: pp.shift(),
                    angle: pp.shift(),
                    largeArc: pp.shift(),
                    sweep: pp.shift()
                };
                p1 = [curr[0], curr[1]];
                p2 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                curr[0] = p2[0];
                curr[1] = p2[1];
                tmp.start = p1;
                tmp.end = p2;
                path.ellipse.apply(path, svgarc2ellipse(tmp.start[0], tmp.start[1], tmp.end[0], tmp.end[1], tmp.largeArc, tmp.sweep, tmp.radiusX, tmp.radiusY, tmp.angle));
            }
            prev = null;
            break;
            case 'Q':
            hasPath = true;
            hasMoveTo = true;
            while (4 <= pp.length)
            {
                p1 = [curr[0], curr[1]];
                p2 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                p3 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                curr[0] = p3[0];
                curr[1] = p3[1];
                path.quadraticCurveTo(p2[0], p2[1], p3[0], p3[1]);
                prev = ['Q', p1, p2, p3];
            }
            break;
            case 'T':
            hasPath = true;
            hasMoveTo = true;
            while (2 <= pp.length)
            {
                p1 = [curr[0], curr[1]];
                p3 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                p2 = prev && 'Q' === prev[0] ? [
                2*p1[0] - prev[2][0],
                2*p1[1] - prev[2][1],
                ] : [p1[0], p1[1]];
                curr[0] = p3[0];
                curr[1] = p3[1];
                path.quadraticCurveTo(p2[0], p2[1], p3[0], p3[1]);
                prev = ['Q', p1, p2, p3];
            }
            break;
            case 'C':
            hasPath = true;
            hasMoveTo = true;
            while (6 <= pp.length)
            {
                p1 = [curr[0], curr[1]];
                p2 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                p3 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                p4 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                curr[0] = p4[0];
                curr[1] = p4[1];
                path.bezierCurveTo(p2[0], p2[1], p3[0], p3[1], p4[0], p4[1]);
                prev = ['C', p1, p2, p3, p4];
            }
            break;
            case 'S':
            hasPath = true;
            hasMoveTo = true;
            while (4 <= pp.length)
            {
                p1 = [curr[0], curr[1]];
                p3 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                p4 = [
                (isRelative ? p1[0] : 0) + pp.shift(),
                (isRelative ? p1[1] : 0) + pp.shift()
                ];
                p2 = prev && 'C' === prev[0] ? [
                2*p1[0] - prev[3][0],
                2*p1[1] - prev[3][1],
                ] : [p1[0], p1[1]];
                curr[0] = p4[0];
                curr[1] = p4[1];
                path.bezierCurveTo(p2[0], p2[1], p3[0], p3[1], p4[0], p4[1]);
                prev = ['C', p1, p2, p3, p4];
            }
            break;
            case 'Z':
            p1 = [curr[0], curr[1]],
            p2 = [start[0], start[1]];
            curr[0] = p2[0];
            curr[1] = p2[1];
            start = [curr[0], curr[1]];
            path.closePath();
            hasPath = false;
            hasMoveTo = false;
            prev = null;
            break;
        }
    });
    if (hasPath) path.moveTo(curr[0], curr[1]);
}
function wn(x, y, x1, y1, x2, y2)
{
    // orientation winding number
    return 0 > (x - x1)*(y2 - y1) - (x2 - x1)*(y - y1) ? -1 : 1;
}
function hypot(dx, dy)
{
    dx = stdMath.abs(dx);
    dy = stdMath.abs(dy);
    var r = 0;
    if (is_strictly_equal(dx, 0))
    {
        return dy;
    }
    else if (is_strictly_equal(dy, 0))
    {
        return dx;
    }
    else if (dx > dy)
    {
        r = dy/dx;
        return dx*stdMath.sqrt(1 + r*r);
    }
    else if (dx < dy)
    {
        r = dx/dy;
        return dy*stdMath.sqrt(1 + r*r);
    }
    return dx*sqrt2;
}
function point_line_distance(x, y, x1, y1, x2, y2)
{
    var dx = x2 - x1,
        dy = y2 - y1,
        d = hypot(dx, dy)
    ;
    if (is_strictly_equal(d, 0)) return hypot(x - x1, y - y1);
    return stdMath.abs(dx*(y1 - y) - dy*(x1 - x)) / d;
}
/*function point_line_segment_distance(x, y, x1, y1, x2, y2, sx, sy)
{
    var t = 0, dx = (x2 - x1)/sx, dy = (y2 - y1)/sy,
        dx1 = (x - x1)/sx, dy1 = (y - y1)/sy,
        d = hypot(dx, dy)
    ;
    if (is_strictly_equal(d, 0)) return hypot(dx1, dy1);
    t = (dx1*dx + dy1*dy) / d;
    return 0.0 <= t && t <= 1.0 ? hypot(dx1 - t*dx, dy1 - t*dy) : INF;
}*/
function point_line_project(x, y, x1, y1, x2, y2)
{
    var dx = x2 - x1,
        dy = y2 - y1,
        dxp = x - x1,
        dyp = y - y1,
        d = dx*dxp + dy*dyp,
        l = hypot(dx, dy),
        lp = hypot(dxp, dyp),
        ll = d / l;
    return [x1 + ll * dx / l, y1 + ll * dy / l];
}
function dotp(x1, y1, x2, y2)
{
    return x1*x2 + y1*y2;
}
function crossp(x1, y1, x2, y2)
{
    return x1*y2 - y1*x2;
}
function angle(x1, y1, x2, y2)
{
    var n1 = hypot(x1, y1), n2 = hypot(x2, y2);
    if (is_strictly_equal(n1, 0) || is_strictly_equal(n2, 0)) return 0;
    return stdMath.acos(clamp(dotp(x1/n1, y1/n1, x2/n2, y2/n2), -1, 1));
}
function vector_angle(ux, uy, vx, vy)
{
    var p = crossp(ux, uy, vx, vy), a = angle(ux, uy, vx, vy);
    return (0 > p ? -1 : 1)*a;
}
function svgarc2ellipse(x1, y1, x2, y2, fa, fs, rx, ry, angle)
{
    // Step 1: simplify through translation/rotation
    var cos = angle ? stdMath.cos(angle) : 1,
        sin = angle ? stdMath.sin(angle) : 0,
        x =  cos*(x1 - x2)/2 + sin*(y1 - y2)/2,
        y = -sin*(x1 - x2)/2 + cos*(y1 - y2)/2,
        px = x*x, py = y*y, prx = rx*rx, pry = ry*ry,
        L = px/prx + py/pry;

    // correct out-of-range radii
    if (L > 1)
    {
        L = stdMath.sqrt(L);
        rx *= L;
        ry *= L;
        prx = rx*rx;
        pry = ry*ry;
    }

    // Step 2 + 3: compute center
    var M = stdMath.sqrt(stdMath.abs((prx*pry - prx*py - pry*px)/(prx*py + pry*px)))*(fa === fs ? -1 : 1),
        _cx = M*rx*y/ry,
        _cy = -M*ry*x/rx,

        cx = cos*_cx - sin*_cy + (x1 + x2)/2,
        cy = sin*_cx + cos*_cy + (y1 + y2)/2
    ;

    // Step 4: compute θ and dθ
    var theta = cmod(vector_angle(1, 0, (x - _cx)/rx, (y - _cy)/ry)),
        dtheta = vector_angle((x - _cx)/rx, (y - _cy)/ry, (-x - _cx)/rx, (-y - _cy)/ry);
    dtheta -= stdMath.floor(dtheta/TWO_PI)*TWO_PI; // % 360

    if (!fs && dtheta > 0) dtheta -= TWO_PI;
    if (fs && dtheta < 0) dtheta += TWO_PI;

    return [cx, cy, rx, ry, angle, theta, theta+dtheta, !fs];
}
function is_almost_equal(a, b, eps)
{
    return stdMath.abs(+a - b) < (eps || 1e-6);
}
function is_strictly_equal(a, b)
{
    return stdMath.abs(+a - b) < EPSILON;
}
function clamp(x, min, max)
{
    return stdMath.min(stdMath.max(x, min), max);
}
function mod(x, m, xmin, xmax)
{
    x -= m*stdMath.floor(x/m);
    if (xmin > x) x += m;
    if (xmax < x) x -= m;
    return x;
}
function cmod(x)
{
    return mod(x, TWO_PI, 0, TWO_PI);
}
function asc(a, b)
{
    var d = a[1] - b[1];
    return is_almost_equal(d, 0) ? (a[3] - b[3]) : d;
}
function parse_number(s)
{
    return parseFloat(s || '') || 0;
}
function trim(s)
{
    return s.trim();
}
function err(msg)
{
    throw new Error(msg);
}
function NOOP() {}
/**
*   Gradient
*   class to create linear/radial/elliptical/conic gradients as bitmaps even without canvas
*
*   @version 1.2.4
*   https://github.com/foo123/Gradient
*
**/
// Gradient Pattern
function Gradient(grad_color_at)
{
    if (
        !(this instanceof Gradient) ||
        ('function' !== typeof grad_color_at) ||
        (5 > grad_color_at.length)
    )
    {
        throw new Error('Gradient: invalid gradient');
    }

    var self = this, transform = new Transform(),
        stops = {'0': [0, [0,0,0,0]], '1': [1, [0,0,0,0]]},
        _stops = null, colorStops
    ;
    colorStops = function() {
        if (null == _stops)
        {
            var o = Object.keys(stops);
            o.sort(function(a, b) {return parseFloat(a) - parseFloat(b);});
            _stops = o.map(function(o) {return stops[o];}).filter(function(s) {return 0 <= s[0] && s[0] <= 1;});
        }
        return _stops;
    };

    def(self, 'transform', {
        get: function() {
            return transform;
        },
        set: function(transform) {
        },
        enumerable: true,
        configurable: false
    });
    self.addColorStop = function(offset, color) {
        _stops = null;
        stops[String(offset)] = [+offset, parseColor(color) || BLANK];
    };
    self.getColorAt = function(x, y) {
        var im = transform.imatrix(true),
            p = im ? im.transform(x, y) : null,
            rgba = [0, 0, 0, 0];
        return p ? grad_color_at(p[0], p[1], colorStops(), rgba, 0) : rgba;
    };
}
Gradient.VERSION = "1.2.4";
Gradient[PROTO] = {
    constructor: Gradient,
    transform: null,
    addColorStop: null,
    getColorAt: null
};
Gradient.createLinearGradient = function(x1, y1, x2, y2) {
    x1 = x1 || 0;
    y1 = y1 || 0;
    x2 = x2 || 0;
    y2 = y2 || 0;
    var dx = x2 - x1, dy = y2 - y1,
        vert = is_strictly_equal(dx, 0),
        hor = is_strictly_equal(dy, 0),
        f = 2*dx*dy;
    return new Gradient(function(x, y, stops, pixel, i) {
        var t, px, py, stop1, stop2, sl = stops.length;
        px = x - x1; py = y - y1;
        t = hor && vert ? 0 : (vert ? py/dy : (hor ? px/dx : (px*dy + py*dx)/f));
        if (0 >= t)
        {
            stop1 = stop2 = 0;
            t = 0;
        }
        else if (1 <= t)
        {
            stop1 = stop2 = sl - 1;
            t = 1;
        }
        else
        {
            stop2 = binary_search(t, stops, sl);
            stop1 = 0 === stop2 ? 0 : (stop2 - 1);
        }
        return interpolatePixel(
            pixel, i || 0,
            stops[stop1][1], stops[stop2][1],
            stops[stop2][0] > stops[stop1][0] ? (t - stops[stop1][0])/(stops[stop2][0] - stops[stop1][0]) : t
        );
    });
};
Gradient.createRadialGradient = function(x0, y0, r0, x1, y1, r1) {
    x0 = x0 || 0;
    y0 = y0 || 0;
    r0 = r0 || 0;
    x1 = x1 || 0;
    y1 = y1 || 0;
    r1 = r1 || 0;
    // 0 = (r0+t*(r1-r0))**2 - (x - (x0 + t*(x1-x0)))**2 - (y - (y0 + t*(y1-y0)))**2
    // t^{2} \left(r_{0}^{2} - 2 r_{0} r_{1} + r_{1}^{2} - x_{0}^{2} + 2 x_{0} x_{1} - x_{1}^{2} - y_{0}^{2} + 2 y_{0} y_{1} - y_{1}^{2}\right) + t \left(- 2 r_{0}^{2} + 2 r_{0} r_{1} - 2 x x_{0} + 2 x x_{1} + 2 x_{0}^{2} - 2 x_{0} x_{1} - 2 y y_{0} + 2 y y_{1} + 2 y_{0}^{2} - 2 y_{0} y_{1}\right) - x^{2} + 2 x x_{0} - x_{0}^{2} - y^{2} + 2 y y_{0} - y_{0}^{2}+r_{0}^{2}
    /*px1 = x - cx1; py1 = y - cy1;
    dr1 = sqrt(px1*px1 + py1*py1) - r1;
    px2 = x - cx2; py2 = y - cy2;
    dr2 = r2 - sqrt(px2*px2 + py2*py2);*/
    var a = r0*r0 - 2*r0*r1 + r1*r1 - x0*x0 + 2*x0*x1 - x1*x1 - y0*y0 + 2*y0*y1 - y1*y1,
        b = -2*r0*r0 + 2*r0*r1 + 2*x0*x0 - 2*x0*x1 + 2*y0*y0 - 2*y0*y1,
        c = -x0*x0 - y0*y0 + r0*r0;
    return new Gradient(function(x, y, stops, pixel, i) {
        var t, px, py, pr, s, stop1, stop2, sl = stops.length;
        s = quadratic_roots(a, b - 2*x*x0 + 2*x*x1 - 2*y*y0 + 2*y*y1, c - x*x + 2*x*x0 - y*y + 2*y*y0);
        if (!s)
        {
            t = -1;
        }
        else if (1 < s.length)
        {
            if (0 <= s[0] && s[0] <= 1 && 0 <= s[1] && s[1] <= 1) t = stdMath.min(s[0], s[1]);
            else if (0 <= s[0] && s[0] <= 1) t = s[0];
            else if (0 <= s[1] && s[1] <= 1) t =  s[1];
            else t = stdMath.min(s[0], s[1]);
        }
        else
        {
            t = s[0];
        }
        if (0 > t || t > 1)
        {
            px = x - x0; py = y - y0;
            pr = stdMath.sqrt(px*px + py*py);
            if (pr < r0)
            {
                t = 0;
                stop2 = stop1 = 0;
            }
            else
            {
                t = 1;
                stop2 = stop1 = sl - 1;
            }
        }
        else
        {
            //t = dr1/(dr2 + dr1);
            stop2 = binary_search(t, stops, sl);
            stop1 = 0 === stop2 ? 0 : (stop2 - 1);
        }
        return interpolatePixel(
            pixel, i || 0,
            stops[stop1][1], stops[stop2][1],
            stops[stop2][0] > stops[stop1][0] ? (t - stops[stop1][0])/(stops[stop2][0] - stops[stop1][0]) : t
        );
    });
};
Gradient.createConicGradient = function(angle, cx, cy) {
    angle = angle || 0;
    cx = cx || 0;
    cy = cy || 0;
    return new Gradient(function(x, y, stops, pixel, i) {
        var t, stop1, stop2, sl = stops.length;
        t = stdMath.atan2(y - cy, x - cx) /*+ HALF_PI*/ - angle;
        if (0 > t) t += TWO_PI;
        if (t > TWO_PI) t -= TWO_PI;
        t = clamp(t/TWO_PI, 0, 1);
        stop2 = binary_search(t, stops, sl);
        stop1 = 0 === stop2 ? 0 : (stop2 - 1);
        return interpolatePixel(
            pixel, i || 0,
            stops[stop1][1], stops[stop2][1],
            stops[stop2][0] > stops[stop1][0] ? (t - stops[stop1][0])/(stops[stop2][0] - stops[stop1][0]) : t
        );
    });
};

// Image Pattern
function Pattern(pat_color_at)
{
    if (
        !(this instanceof Pattern) ||
        ('function' !== typeof pat_color_at) ||
        (4 > pat_color_at.length)
    )
    {
        throw new Error('Pattern: invalid pattern');
    }

    var self = this, transform = new Transform();

    def(self, 'transform', {
        get: function() {
            return transform;
        },
        set: function(transform) {
        },
        enumerable: true,
        configurable: false
    });
    self.getColorAt = function(x, y) {
        var im = transform.imatrix(true), p, rgba = [0, 0, 0, 0];
        if (im)
        {
            p = im.transform(x, y);
            pat_color_at(p[0], p[1], rgba, 0);
        }
        rgba[3] /= 255;
        return rgba;
    };
}
Pattern[PROTO] = {
    constructor: Pattern,
    transform: null,
    getColorAt: null
};
Pattern.createPattern = function(imageData, repetition) {
    if (imageData && imageData.data && imageData.width && imageData.height && (imageData.data.length === 4*imageData.width*imageData.height))
    {
        var width = imageData.width,
            height = imageData.height,
            z = [0, 0, 0, 0],
            pt = function(x, y) {
                if (0 <= x && 0 <= y && x < width && y < height)
                {
                    var index = (x + width*y) << 2;
                    return [
                    imageData.data[index  ],
                    imageData.data[index+1],
                    imageData.data[index+2],
                    imageData.data[index+3]
                    ];
                }
                return z;
            }
        ;
        switch (repetition)
        {
            case 'no-repeat':
            return new Pattern(function(x, y, pixel, i) {
                //x = stdMath.round(x);
                //y = stdMath.round(y);
                if (-1 < x && x < width && -1 < y && y < height)
                {
                    var fx = stdMath.floor(x),
                        fy = stdMath.floor(y),
                        deltax = stdMath.abs(x-fx),
                        deltay = stdMath.abs(y-fy);
                    x = fx; y = fy;
                    /*
                    // bilinear
                    var p00 = pt(x  ,y  ), p10 = pt(x+1,y  ),
                        p01 = pt(x  ,y+1), p11 = pt(x+1,y+1);
                    pixel[i + 0] = clamp(stdMath.round(linear(
                        linear(p00[0], p10[0], deltax),
                        linear(p10[0], p11[0], deltax),
                    deltay)), 0, 255);
                    pixel[i + 1] = clamp(stdMath.round(linear(
                        linear(p00[1], p10[1], deltax),
                        linear(p10[1], p11[1], deltax),
                    deltay)), 0, 255);
                    pixel[i + 2] = clamp(stdMath.round(linear(
                        linear(p00[2], p10[2], deltax),
                        linear(p10[2], p11[2], deltax),
                    deltay)), 0, 255);
                    pixel[i + 3] = clamp(stdMath.round(linear(
                        linear(p00[3], p10[3], deltax),
                        linear(p10[3], p11[3], deltax),
                    deltay)), 0, 255);
                    */
                    // bicubic
                    var p00 = pt(x-1,y-1), p10 = pt(x  ,y-1), p20 = pt(x+1,y-1), p30 = pt(x+2,y-1),
                        p01 = pt(x-1,y  ), p11 = pt(x  ,y  ), p21 = pt(x+1,y  ), p31 = pt(x+2,y  ),
                        p02 = pt(x-1,y+1), p12 = pt(x  ,y+1), p22 = pt(x+1,y+1), p32 = pt(x+2,y+1),
                        p03 = pt(x-1,y+2), p13 = pt(x  ,y+2), p23 = pt(x+1,y+2), p33 = pt(x+2,y+2);
                    pixel[i + 0] = clamp(stdMath.round(cubic(
                        cubic(p00[0], p10[0], p20[0], p30[0], deltax),
                        cubic(p01[0], p11[0], p21[0], p31[0], deltax),
                        cubic(p02[0], p12[0], p22[0], p32[0], deltax),
                        cubic(p03[0], p13[0], p23[0], p33[0], deltax),
                        deltay)), 0, 255);
                    pixel[i + 1] = clamp(stdMath.round(cubic(
                        cubic(p00[1], p10[1], p20[1], p30[1], deltax),
                        cubic(p01[1], p11[1], p21[1], p31[1], deltax),
                        cubic(p02[1], p12[1], p22[1], p32[1], deltax),
                        cubic(p03[1], p13[1], p23[1], p33[1], deltax),
                        deltay)), 0, 255);
                    pixel[i + 2] = clamp(stdMath.round(cubic(
                        cubic(p00[2], p10[2], p20[2], p30[2], deltax),
                        cubic(p01[2], p11[2], p21[2], p31[2], deltax),
                        cubic(p02[2], p12[2], p22[2], p32[2], deltax),
                        cubic(p03[2], p13[2], p23[2], p33[2], deltax),
                        deltay)), 0, 255);
                    pixel[i + 3] = clamp(stdMath.round(cubic(
                        cubic(p00[3], p10[3], p20[3], p30[3], deltax),
                        cubic(p01[3], p11[3], p21[3], p31[3], deltax),
                        cubic(p02[3], p12[3], p22[3], p32[3], deltax),
                        cubic(p03[3], p13[3], p23[3], p33[3], deltax),
                        deltay)), 0, 255);
                }
                else
                {
                    pixel[i + 0] = 0;
                    pixel[i + 1] = 0;
                    pixel[i + 2] = 0;
                    pixel[i + 3] = 0;
                }
                return pixel;
            });
            case 'repeat-x':
            return new Pattern(function(x, y, pixel, i) {
                //x = stdMath.round(x);
                //y = stdMath.round(y);
                if (-1 < y && y < height)
                {
                    if (x > width) x -= stdMath.floor(x/width)*width;
                    if (x < 0) x += stdMath.ceil(-x/width)*width;
                    var fx = stdMath.floor(x),
                        fy = stdMath.floor(y),
                        deltax = stdMath.abs(x-fx),
                        deltay = stdMath.abs(y-fy);
                    x = fx; y = fy;
                    /*
                    // bilinear
                    var p00 = pt(x  ,y  ), p10 = pt(x+1,y  ),
                        p01 = pt(x  ,y+1), p11 = pt(x+1,y+1);
                    pixel[i + 0] = clamp(stdMath.round(linear(
                        linear(p00[0], p10[0], deltax),
                        linear(p10[0], p11[0], deltax),
                    deltay)), 0, 255);
                    pixel[i + 1] = clamp(stdMath.round(linear(
                        linear(p00[1], p10[1], deltax),
                        linear(p10[1], p11[1], deltax),
                    deltay)), 0, 255);
                    pixel[i + 2] = clamp(stdMath.round(linear(
                        linear(p00[2], p10[2], deltax),
                        linear(p10[2], p11[2], deltax),
                    deltay)), 0, 255);
                    pixel[i + 3] = clamp(stdMath.round(linear(
                        linear(p00[3], p10[3], deltax),
                        linear(p10[3], p11[3], deltax),
                    deltay)), 0, 255);
                    */
                    // bicubic
                    var p00 = pt(x-1,y-1), p10 = pt(x  ,y-1), p20 = pt(x+1,y-1), p30 = pt(x+2,y-1),
                        p01 = pt(x-1,y  ), p11 = pt(x  ,y  ), p21 = pt(x+1,y  ), p31 = pt(x+2,y  ),
                        p02 = pt(x-1,y+1), p12 = pt(x  ,y+1), p22 = pt(x+1,y+1), p32 = pt(x+2,y+1),
                        p03 = pt(x-1,y+2), p13 = pt(x  ,y+2), p23 = pt(x+1,y+2), p33 = pt(x+2,y+2);
                    pixel[i + 0] = clamp(stdMath.round(cubic(
                        cubic(p00[0], p10[0], p20[0], p30[0], deltax),
                        cubic(p01[0], p11[0], p21[0], p31[0], deltax),
                        cubic(p02[0], p12[0], p22[0], p32[0], deltax),
                        cubic(p03[0], p13[0], p23[0], p33[0], deltax),
                        deltay)), 0, 255);
                    pixel[i + 1] = clamp(stdMath.round(cubic(
                        cubic(p00[1], p10[1], p20[1], p30[1], deltax),
                        cubic(p01[1], p11[1], p21[1], p31[1], deltax),
                        cubic(p02[1], p12[1], p22[1], p32[1], deltax),
                        cubic(p03[1], p13[1], p23[1], p33[1], deltax),
                        deltay)), 0, 255);
                    pixel[i + 2] = clamp(stdMath.round(cubic(
                        cubic(p00[2], p10[2], p20[2], p30[2], deltax),
                        cubic(p01[2], p11[2], p21[2], p31[2], deltax),
                        cubic(p02[2], p12[2], p22[2], p32[2], deltax),
                        cubic(p03[2], p13[2], p23[2], p33[2], deltax),
                        deltay)), 0, 255);
                    pixel[i + 3] = clamp(stdMath.round(cubic(
                        cubic(p00[3], p10[3], p20[3], p30[3], deltax),
                        cubic(p01[3], p11[3], p21[3], p31[3], deltax),
                        cubic(p02[3], p12[3], p22[3], p32[3], deltax),
                        cubic(p03[3], p13[3], p23[3], p33[3], deltax),
                        deltay)), 0, 255);
                }
                else
                {
                    pixel[i + 0] = 0;
                    pixel[i + 1] = 0;
                    pixel[i + 2] = 0;
                    pixel[i + 3] = 0;
                }
                return pixel;
            });
            case 'repeat-y':
            return new Pattern(function(x, y, pixel, i) {
                //x = stdMath.round(x);
                //y = stdMath.round(y);
                if (-1 < x && x < width)
                {
                    if (y > height) y -= stdMath.floor(y/height)*height;
                    if (y < 0) y += stdMath.ceil(-y/height)*height;
                    var fx = stdMath.floor(x),
                        fy = stdMath.floor(y),
                        deltax = stdMath.abs(x-fx),
                        deltay = stdMath.abs(y-fy);
                    x = fx; y = fy;
                    /*
                    // bilinear
                    var p00 = pt(x  ,y  ), p10 = pt(x+1,y  ),
                        p01 = pt(x  ,y+1), p11 = pt(x+1,y+1);
                    pixel[i + 0] = clamp(stdMath.round(linear(
                        linear(p00[0], p10[0], deltax),
                        linear(p10[0], p11[0], deltax),
                    deltay)), 0, 255);
                    pixel[i + 1] = clamp(stdMath.round(linear(
                        linear(p00[1], p10[1], deltax),
                        linear(p10[1], p11[1], deltax),
                    deltay)), 0, 255);
                    pixel[i + 2] = clamp(stdMath.round(linear(
                        linear(p00[2], p10[2], deltax),
                        linear(p10[2], p11[2], deltax),
                    deltay)), 0, 255);
                    pixel[i + 3] = clamp(stdMath.round(linear(
                        linear(p00[3], p10[3], deltax),
                        linear(p10[3], p11[3], deltax),
                    deltay)), 0, 255);
                    */
                    // bicubic
                    var p00 = pt(x-1,y-1), p10 = pt(x  ,y-1), p20 = pt(x+1,y-1), p30 = pt(x+2,y-1),
                        p01 = pt(x-1,y  ), p11 = pt(x  ,y  ), p21 = pt(x+1,y  ), p31 = pt(x+2,y  ),
                        p02 = pt(x-1,y+1), p12 = pt(x  ,y+1), p22 = pt(x+1,y+1), p32 = pt(x+2,y+1),
                        p03 = pt(x-1,y+2), p13 = pt(x  ,y+2), p23 = pt(x+1,y+2), p33 = pt(x+2,y+2);
                    pixel[i + 0] = clamp(stdMath.round(cubic(
                        cubic(p00[0], p10[0], p20[0], p30[0], deltax),
                        cubic(p01[0], p11[0], p21[0], p31[0], deltax),
                        cubic(p02[0], p12[0], p22[0], p32[0], deltax),
                        cubic(p03[0], p13[0], p23[0], p33[0], deltax),
                        deltay)), 0, 255);
                    pixel[i + 1] = clamp(stdMath.round(cubic(
                        cubic(p00[1], p10[1], p20[1], p30[1], deltax),
                        cubic(p01[1], p11[1], p21[1], p31[1], deltax),
                        cubic(p02[1], p12[1], p22[1], p32[1], deltax),
                        cubic(p03[1], p13[1], p23[1], p33[1], deltax),
                        deltay)), 0, 255);
                    pixel[i + 2] = clamp(stdMath.round(cubic(
                        cubic(p00[2], p10[2], p20[2], p30[2], deltax),
                        cubic(p01[2], p11[2], p21[2], p31[2], deltax),
                        cubic(p02[2], p12[2], p22[2], p32[2], deltax),
                        cubic(p03[2], p13[2], p23[2], p33[2], deltax),
                        deltay)), 0, 255);
                    pixel[i + 3] = clamp(stdMath.round(cubic(
                        cubic(p00[3], p10[3], p20[3], p30[3], deltax),
                        cubic(p01[3], p11[3], p21[3], p31[3], deltax),
                        cubic(p02[3], p12[3], p22[3], p32[3], deltax),
                        cubic(p03[3], p13[3], p23[3], p33[3], deltax),
                        deltay)), 0, 255);
                }
                else
                {
                    pixel[i + 0] = 0;
                    pixel[i + 1] = 0;
                    pixel[i + 2] = 0;
                    pixel[i + 3] = 0;
                }
                return pixel;
            });
            case 'repeat':
            default:
            return new Pattern(function(x, y, pixel, i) {
                //x = stdMath.round(x);
                //y = stdMath.round(y);
                if (x > width) x -= stdMath.floor(x/width)*width;
                if (x < 0) x += stdMath.ceil(-x/width)*width;
                if (y > height) y -= stdMath.floor(y/height)*height;
                if (y < 0) y += stdMath.ceil(-y/height)*height;
                var fx = stdMath.floor(x),
                    fy = stdMath.floor(y),
                    deltax = stdMath.abs(x-fx),
                    deltay = stdMath.abs(y-fy);
                x = fx; y = fy;
                /*
                // bilinear
                var p00 = pt(x  ,y  ), p10 = pt(x+1,y  ),
                    p01 = pt(x  ,y+1), p11 = pt(x+1,y+1);
                pixel[i + 0] = clamp(stdMath.round(linear(
                    linear(p00[0], p10[0], deltax),
                    linear(p10[0], p11[0], deltax),
                deltay)), 0, 255);
                pixel[i + 1] = clamp(stdMath.round(linear(
                    linear(p00[1], p10[1], deltax),
                    linear(p10[1], p11[1], deltax),
                deltay)), 0, 255);
                pixel[i + 2] = clamp(stdMath.round(linear(
                    linear(p00[2], p10[2], deltax),
                    linear(p10[2], p11[2], deltax),
                deltay)), 0, 255);
                pixel[i + 3] = clamp(stdMath.round(linear(
                    linear(p00[3], p10[3], deltax),
                    linear(p10[3], p11[3], deltax),
                deltay)), 0, 255);
                */
                // bicubic
                var p00 = pt(x-1,y-1), p10 = pt(x  ,y-1), p20 = pt(x+1,y-1), p30 = pt(x+2,y-1),
                    p01 = pt(x-1,y  ), p11 = pt(x  ,y  ), p21 = pt(x+1,y  ), p31 = pt(x+2,y  ),
                    p02 = pt(x-1,y+1), p12 = pt(x  ,y+1), p22 = pt(x+1,y+1), p32 = pt(x+2,y+1),
                    p03 = pt(x-1,y+2), p13 = pt(x  ,y+2), p23 = pt(x+1,y+2), p33 = pt(x+2,y+2);
                pixel[i + 0] = clamp(stdMath.round(cubic(
                    cubic(p00[0], p10[0], p20[0], p30[0], deltax),
                    cubic(p01[0], p11[0], p21[0], p31[0], deltax),
                    cubic(p02[0], p12[0], p22[0], p32[0], deltax),
                    cubic(p03[0], p13[0], p23[0], p33[0], deltax),
                    deltay)), 0, 255);
                pixel[i + 1] = clamp(stdMath.round(cubic(
                    cubic(p00[1], p10[1], p20[1], p30[1], deltax),
                    cubic(p01[1], p11[1], p21[1], p31[1], deltax),
                    cubic(p02[1], p12[1], p22[1], p32[1], deltax),
                    cubic(p03[1], p13[1], p23[1], p33[1], deltax),
                    deltay)), 0, 255);
                pixel[i + 2] = clamp(stdMath.round(cubic(
                    cubic(p00[2], p10[2], p20[2], p30[2], deltax),
                    cubic(p01[2], p11[2], p21[2], p31[2], deltax),
                    cubic(p02[2], p12[2], p22[2], p32[2], deltax),
                    cubic(p03[2], p13[2], p23[2], p33[2], deltax),
                    deltay)), 0, 255);
                pixel[i + 3] = clamp(stdMath.round(cubic(
                    cubic(p00[3], p10[3], p20[3], p30[3], deltax),
                    cubic(p01[3], p11[3], p21[3], p31[3], deltax),
                    cubic(p02[3], p12[3], p22[3], p32[3], deltax),
                    cubic(p03[3], p13[3], p23[3], p33[3], deltax),
                    deltay)), 0, 255);
                return pixel;
            });
        }
    }
    else
    {
        throw new Error('Pattern: invalid image data');
    }
};
Gradient.Pattern = Pattern;
Gradient.createPattern = Pattern.createPattern;

// handled through Gradient.js
RenderingContext2D.Gradient = Gradient;
RenderingContext2D.Pattern = Pattern;
RenderingContext2D[PROTO].createLinearGradient = Gradient.createLinearGradient;
RenderingContext2D[PROTO].createRadialGradient = Gradient.createRadialGradient;
RenderingContext2D[PROTO].createConicGradient = Gradient.createConicGradient;
RenderingContext2D[PROTO].createPattern = Gradient.createPattern;

// Transform
function Transform()
{
    var self = this,
        matrix = new Matrix2D(),
        imatrix = new Matrix2D(),
        prev = [];

    self.dispose = function() {
        matrix = null;
        imatrix = null;
        prev = null;
    };
    self.matrix = function(orig) {
        return true === orig ? matrix : matrix.clone();
    };
    self.imatrix = function(orig) {
        return true === orig ? imatrix : imatrix.clone();
    };
    self.reset = function() {
        matrix = new Matrix2D();
        imatrix = new Matrix2D();
        return self;
    };
    self.save = function() {
        // up to 10 saves
        if (prev.length >= 10) prev.shift();
        prev.push([matrix, imatrix]);
        return self;
    };
    self.restore = function() {
        if (prev.length)
        {
            var p = prev.pop();
            matrix = p[0]; imatrix = p[1];
        }
        return self;
    };
    self.scale = function(sx, sy, ox, oy) {
        matrix = matrix.mul(Matrix2D.scale(sx, sy, ox, oy));
        imatrix = Matrix2D.scale(1/sx, 1/sy, ox, oy).mul(imatrix);
        return self;
    };
    self.rotate = function(theta, ox, oy) {
        matrix = matrix.mul(Matrix2D.rotate(theta, ox, oy));
        imatrix = Matrix2D.rotate(-theta, ox, oy).mul(imatrix);
        return self;
    };
    self.translate = function(tx, ty) {
        matrix = matrix.mul(Matrix2D.translate(tx, ty));
        imatrix = Matrix2D.translate(-tx, -ty).mul(imatrix);
        return self;
    };
    self.skewX = function(s) {
        var m = Matrix2D.skewX(s);
        matrix = matrix.mul(m);
        imatrix = m.inv().mul(imatrix);
        return self;
    };
    self.skewY = function(s) {
        var m = Matrix2D.skewY(s);
        matrix = matrix.mul(m);
        imatrix = m.inv().mul(imatrix);
        return self;
    };
    self.transform = function(a, b, c, d, e, f) {
        var m = new Matrix2D(a, c, e, b, d, f);
        matrix = matrix.mul(m);
        imatrix = m.inv().mul(imatrix);
        return self;
    };

}
Transform[PROTO] = {
    constructor: Transform,
    dispose: null,
    matrix: null,
    imatrix: null,
    reset: null,
    save: null,
    restore: null,
    scale: null,
    rotate: null,
    translate: null,
    reflectX: null,
    reflectY: null,
    skewX: null,
    skewY: null,
    transform: null
};
Gradient.Transform = Transform;


// utils
function linear_roots(a, b)
{
    return is_strictly_equal(a, 0) ? false : [-b/a];
}
function quadratic_roots(a, b, c)
{
    if (is_strictly_equal(a, 0)) return linear_roots(b, c);
    var D = b*b - 4*a*c, DS = 0;
    if (is_almost_equal(D, 0, 1e-6)) return [-b/(2*a)];
    if (0 > D) return false;
    DS = stdMath.sqrt(D);
    return [(-b-DS)/(2*a), (-b+DS)/(2*a)];
}
function binary_search(x, a, n)
{
    // assume a is sorted ascending
    var l = 0, r = n - 1, m;
    while (l < r)
    {
        if (a[l][0] >= x) return l;
        m = (l + r) >>> 1;
        if (a[m][0] < x) l = m + 1;
        else r = m;
    }
    return l;
}
// color utilities
function interpolatePixel(pixel, index, rgba0, rgba1, t)
{
    pixel[index + 0] = clamp(stdMath.round(rgba0[0] + t*(rgba1[0] - rgba0[0])), 0, 255);
    pixel[index + 1] = clamp(stdMath.round(rgba0[1] + t*(rgba1[1] - rgba0[1])), 0, 255);
    pixel[index + 2] = clamp(stdMath.round(rgba0[2] + t*(rgba1[2] - rgba0[2])), 0, 255);
    pixel[index + 3] = 3 < rgba0.length ? clamp(rgba0[3] + t*(rgba1[3] - rgba0[3]), 0, 1) : 1;
    return pixel;
}
var hexRE = /^#([0-9a-fA-F]{3,6})\b/,
    rgbRE = /^(rgba?)\b\s*\(([^\)]*)\)/i,
    hslRE = /^(hsla?)\b\s*\(([^\)]*)\)/i,
    hwbRE = /^(hwba?)\b\s*\(([^\)]*)\)/i,
    sepRE = /\s+|,/gm, aRE = /\/\s*(\d*?\.?\d+%?)/;

function hex2rgb(h)
{
    if (!h || 3 > h.length)
    {
        return [0, 0, 0, 0];
    }
    else if (6 > h.length)
    {
        return [
        clamp(parseInt(h[0]+h[0], 16)||0, 0, 255),
        clamp(parseInt(h[1]+h[1], 16)||0, 0, 255),
        clamp(parseInt(h[2]+h[2], 16)||0, 0, 255),
        1
        ];
    }
    else
    {
        return [
        clamp(parseInt(h[0]+h[1], 16)||0, 0, 255),
        clamp(parseInt(h[2]+h[3], 16)||0, 0, 255),
        clamp(parseInt(h[4]+h[5], 16)||0, 0, 255),
        1
        ];
    }
}
function hsl2rgb(h, s, l, a)
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
    clamp(stdMath.round(b*255), 0, 255),
    a
    ];
}
function hsv2rgb(h, s, v, a)
{
    v /= 100;
    var l = v*(1 - s/200), lm = stdMath.min(l, 1-l);
    return hsl2rgb(h, 0 === lm ? 0 : 100*(v-l)/lm, 100*l, a);
}
function hwb2rgb(h, w, b, a)
{
    var b1 = 1 - b/100;
    return hsv2rgb(h, 100 - w/b1, 100*b1, a);
}
var TRIM_RE = /^\s+|\s+$/gm;
var trim = String.prototype.trim ? function trim(s) {
    return s.trim()
} : function trim() {
    return s.replace(TRIM_RE, '');
};
function parseColor(s)
{
    var m, hasOpacity;
    s = trim(String(s)).toLowerCase();
    if (m = s.match(hexRE))
    {
        // hex
        return hex2rgb(m[1]);
    }
    if (m = s.match(hwbRE))
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
        return hwb2rgb(h, w, b, a);
    }
    if (m = s.match(hslRE))
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
        return hsl2rgb(h, s, l, a);
    }
    if (m = s.match(rgbRE))
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
        return [r, g, b, a];
    }
    if (HAS.call(keywords, s))
    {
        // keyword
        return keywords[s].slice();
    }
}
var keywords = {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
    /* extended */
     'transparent'         : [  0,0,0        ,0]
    ,'aliceblue'           : [  240,248,255  ,1]
    ,'antiquewhite'        : [  250,235,215  ,1]
    ,'aqua'                : [  0,255,255    ,1]
    ,'aquamarine'          : [  127,255,212  ,1]
    ,'azure'               : [  240,255,255  ,1]
    ,'beige'               : [  245,245,220  ,1]
    ,'bisque'              : [  255,228,196  ,1]
    ,'black'               : [  0,0,0    ,    1]
    ,'blanchedalmond'      : [  255,235,205  ,1]
    ,'blue'                : [  0,0,255  ,    1]
    ,'blueviolet'          : [  138,43,226   ,1]
    ,'brown'               : [  165,42,42    ,1]
    ,'burlywood'           : [  222,184,135  ,1]
    ,'cadetblue'           : [  95,158,160   ,1]
    ,'chartreuse'          : [  127,255,0    ,1]
    ,'chocolate'           : [  210,105,30   ,1]
    ,'coral'               : [  255,127,80   ,1]
    ,'cornflowerblue'      : [  100,149,237  ,1]
    ,'cornsilk'            : [  255,248,220  ,1]
    ,'crimson'             : [  220,20,60    ,1]
    ,'cyan'                : [  0,255,255    ,1]
    ,'darkblue'            : [  0,0,139  ,    1]
    ,'darkcyan'            : [  0,139,139    ,1]
    ,'darkgoldenrod'       : [  184,134,11   ,1]
    ,'darkgray'            : [  169,169,169  ,1]
    ,'darkgreen'           : [  0,100,0  ,    1]
    ,'darkgrey'            : [  169,169,169  ,1]
    ,'darkkhaki'           : [  189,183,107  ,1]
    ,'darkmagenta'         : [  139,0,139    ,1]
    ,'darkolivegreen'      : [  85,107,47    ,1]
    ,'darkorange'          : [  255,140,0    ,1]
    ,'darkorchid'          : [  153,50,204   ,1]
    ,'darkred'             : [  139,0,0  ,    1]
    ,'darksalmon'          : [  233,150,122  ,1]
    ,'darkseagreen'        : [  143,188,143  ,1]
    ,'darkslateblue'       : [  72,61,139    ,1]
    ,'darkslategray'       : [  47,79,79 ,    1]
    ,'darkslategrey'       : [  47,79,79 ,    1]
    ,'darkturquoise'       : [  0,206,209    ,1]
    ,'darkviolet'          : [  148,0,211    ,1]
    ,'deeppink'            : [  255,20,147   ,1]
    ,'deepskyblue'         : [  0,191,255    ,1]
    ,'dimgray'             : [  105,105,105  ,1]
    ,'dimgrey'             : [  105,105,105  ,1]
    ,'dodgerblue'          : [  30,144,255   ,1]
    ,'firebrick'           : [  178,34,34    ,1]
    ,'floralwhite'         : [  255,250,240  ,1]
    ,'forestgreen'         : [  34,139,34    ,1]
    ,'fuchsia'             : [  255,0,255    ,1]
    ,'gainsboro'           : [  220,220,220  ,1]
    ,'ghostwhite'          : [  248,248,255  ,1]
    ,'gold'                : [  255,215,0    ,1]
    ,'goldenrod'           : [  218,165,32   ,1]
    ,'gray'                : [  128,128,128  ,1]
    ,'green'               : [  0,128,0  ,    1]
    ,'greenyellow'         : [  173,255,47   ,1]
    ,'grey'                : [  128,128,128  ,1]
    ,'honeydew'            : [  240,255,240  ,1]
    ,'hotpink'             : [  255,105,180  ,1]
    ,'indianred'           : [  205,92,92    ,1]
    ,'indigo'              : [  75,0,130 ,    1]
    ,'ivory'               : [  255,255,240  ,1]
    ,'khaki'               : [  240,230,140  ,1]
    ,'lavender'            : [  230,230,250  ,1]
    ,'lavenderblush'       : [  255,240,245  ,1]
    ,'lawngreen'           : [  124,252,0    ,1]
    ,'lemonchiffon'        : [  255,250,205  ,1]
    ,'lightblue'           : [  173,216,230  ,1]
    ,'lightcoral'          : [  240,128,128  ,1]
    ,'lightcyan'           : [  224,255,255  ,1]
    ,'lightgoldenrodyellow': [  250,250,210  ,1]
    ,'lightgray'           : [  211,211,211  ,1]
    ,'lightgreen'          : [  144,238,144  ,1]
    ,'lightgrey'           : [  211,211,211  ,1]
    ,'lightpink'           : [  255,182,193  ,1]
    ,'lightsalmon'         : [  255,160,122  ,1]
    ,'lightseagreen'       : [  32,178,170   ,1]
    ,'lightskyblue'        : [  135,206,250  ,1]
    ,'lightslategray'      : [  119,136,153  ,1]
    ,'lightslategrey'      : [  119,136,153  ,1]
    ,'lightsteelblue'      : [  176,196,222  ,1]
    ,'lightyellow'         : [  255,255,224  ,1]
    ,'lime'                : [  0,255,0  ,    1]
    ,'limegreen'           : [  50,205,50    ,1]
    ,'linen'               : [  250,240,230  ,1]
    ,'magenta'             : [  255,0,255    ,1]
    ,'maroon'              : [  128,0,0  ,    1]
    ,'mediumaquamarine'    : [  102,205,170  ,1]
    ,'mediumblue'          : [  0,0,205  ,    1]
    ,'mediumorchid'        : [  186,85,211   ,1]
    ,'mediumpurple'        : [  147,112,219  ,1]
    ,'mediumseagreen'      : [  60,179,113   ,1]
    ,'mediumslateblue'     : [  123,104,238  ,1]
    ,'mediumspringgreen'   : [  0,250,154    ,1]
    ,'mediumturquoise'     : [  72,209,204   ,1]
    ,'mediumvioletred'     : [  199,21,133   ,1]
    ,'midnightblue'        : [  25,25,112    ,1]
    ,'mintcream'           : [  245,255,250  ,1]
    ,'mistyrose'           : [  255,228,225  ,1]
    ,'moccasin'            : [  255,228,181  ,1]
    ,'navajowhite'         : [  255,222,173  ,1]
    ,'navy'                : [  0,0,128  ,    1]
    ,'oldlace'             : [  253,245,230  ,1]
    ,'olive'               : [  128,128,0    ,1]
    ,'olivedrab'           : [  107,142,35   ,1]
    ,'orange'              : [  255,165,0    ,1]
    ,'orangered'           : [  255,69,0 ,    1]
    ,'orchid'              : [  218,112,214  ,1]
    ,'palegoldenrod'       : [  238,232,170  ,1]
    ,'palegreen'           : [  152,251,152  ,1]
    ,'paleturquoise'       : [  175,238,238  ,1]
    ,'palevioletred'       : [  219,112,147  ,1]
    ,'papayawhip'          : [  255,239,213  ,1]
    ,'peachpuff'           : [  255,218,185  ,1]
    ,'peru'                : [  205,133,63   ,1]
    ,'pink'                : [  255,192,203  ,1]
    ,'plum'                : [  221,160,221  ,1]
    ,'powderblue'          : [  176,224,230  ,1]
    ,'purple'              : [  128,0,128    ,1]
    ,'red'                 : [  255,0,0  ,    1]
    ,'rosybrown'           : [  188,143,143  ,1]
    ,'royalblue'           : [  65,105,225   ,1]
    ,'saddlebrown'         : [  139,69,19    ,1]
    ,'salmon'              : [  250,128,114  ,1]
    ,'sandybrown'          : [  244,164,96   ,1]
    ,'seagreen'            : [  46,139,87    ,1]
    ,'seashell'            : [  255,245,238  ,1]
    ,'sienna'              : [  160,82,45    ,1]
    ,'silver'              : [  192,192,192  ,1]
    ,'skyblue'             : [  135,206,235  ,1]
    ,'slateblue'           : [  106,90,205   ,1]
    ,'slategray'           : [  112,128,144  ,1]
    ,'slategrey'           : [  112,128,144  ,1]
    ,'snow'                : [  255,250,250  ,1]
    ,'springgreen'         : [  0,255,127    ,1]
    ,'steelblue'           : [  70,130,180   ,1]
    ,'tan'                 : [  210,180,140  ,1]
    ,'teal'                : [  0,128,128    ,1]
    ,'thistle'             : [  216,191,216  ,1]
    ,'tomato'              : [  255,99,71    ,1]
    ,'turquoise'           : [  64,224,208   ,1]
    ,'violet'              : [  238,130,238  ,1]
    ,'wheat'               : [  245,222,179  ,1]
    ,'white'               : [  255,255,255  ,1]
    ,'whitesmoke'          : [  245,245,245  ,1]
    ,'yellow'              : [  255,255,0    ,1]
    ,'yellowgreen'         : [  154,205,50   ,1]
};
// adapted from: https://github.com/buzzfeed/libgif-js
// Generic functions
function bitsToNum(ba)
{
    return ba.reduce(function(s, n) {
        return s * 2 + n;
    }, 0);
}

function byteToBitArr(bite)
{
    var a = [];
    for (var i = 7; i >= 0; --i)
    {
        a.push( !! (bite & (1 << i)));
    }
    return a;
}

function lzwDecode(minCodeSize, data)
{
    // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
    var pos = 0; // Maybe this streaming thing should be merged with the Stream?
    var readCode = function(size) {
        var code = 0;
        for (var i = 0; i < size; ++i)
        {
            if (data.charCodeAt(pos >> 3) & (1 << (pos & 7)))
            {
                code |= 1 << i;
            }
            ++pos;
        }
        return code;
    };

    var output = [];

    var clearCode = 1 << minCodeSize;
    var eoiCode = clearCode + 1;

    var codeSize = minCodeSize + 1;

    var dict = [];

    var clear = function() {
        dict = [];
        codeSize = minCodeSize + 1;
        for (var i = 0; i < clearCode; ++i)
        {
            dict[i] = [i];
        }
        dict[clearCode] = [];
        dict[eoiCode] = null;
    };

    var code;
    var last;

    while (true)
    {
        last = code;
        code = readCode(codeSize);

        if (code === clearCode)
        {
            clear();
            continue;
        }
        if (code === eoiCode) break;

        if (code < dict.length)
        {
            if (last !== clearCode)
            {
                dict.push(dict[last].concat(dict[code][0]));
            }
        }
        else
        {
            if (code !== dict.length) throw new Error('Invalid LZW code.');
            dict.push(dict[last].concat(dict[last][0]));
        }
        output.push.apply(output, dict[code]);

        if (dict.length === (1 << codeSize) && codeSize < 12)
        {
            // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
            codeSize++;
        }
    }

    // I don't know if this is technically an error, but some GIFs do it.
    //if (Math.ceil(pos / 8) !== data.length) throw new Error('Extraneous LZW bytes.');
    return output;
}

// Stream
/**
* @constructor
*/
// Make compiler happy.
function Stream(data)
{
    var self = this;
    self.data = data;
    self.len = self.data.length;
    self.pos = 0;

    self.readByte = function() {
        var self = this;
        if (self.pos >= self.data.length)
        {
            throw new Error('Attempted to read past end of stream.');
        }
        if (data instanceof Uint8Array) return data[self.pos++];
        else return data.charCodeAt(self.pos++) & 0xFF;
    };

    self.readBytes = function(n) {
        var self = this, bytes = [];
        for (var i = 0; i < n; ++i)
        {
            bytes.push(self.readByte());
        }
        return bytes;
    };

    self.read = function(n) {
        var self = this, s = '';
        for (var i = 0; i < n; ++i)
        {
            s += String.fromCharCode(self.readByte());
        }
        return s;
    };

    self.readUnsigned = function() { // Little-endian.
        var self = this, a = self.readBytes(2);
        return (a[1] << 8) + a[0];
    };
}

// The actual parsing; returns an object with properties.
function parseGIF(st, handler)
{
    handler || (handler = {});

    // LZW (GIF-specific)
    var parseCT = function(entries) { // Each entry is 3 bytes, for RGB.
        var ct = [];
        for (var i = 0; i < entries; ++i)
        {
            ct.push(st.readBytes(3));
        }
        return ct;
    };

    var readSubBlocks = function() {
        var size, data;
        data = '';
        do {
            size = st.readByte();
            data += st.read(size);
        } while (size !== 0);
        return data;
    };

    var parseHeader = function() {
        var hdr = {};
        hdr.sig = st.read(3);
        hdr.ver = st.read(3);
        if (hdr.sig !== 'GIF') throw new Error('Not a GIF file.'); // XXX: This should probably be handled more nicely.
        hdr.width = st.readUnsigned();
        hdr.height = st.readUnsigned();

        var bits = byteToBitArr(st.readByte());
        hdr.gctFlag = bits.shift();
        hdr.colorRes = bitsToNum(bits.splice(0, 3));
        hdr.sorted = bits.shift();
        hdr.gctSize = bitsToNum(bits.splice(0, 3));

        hdr.bgColor = st.readByte();
        hdr.pixelAspectRatio = st.readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
        if (hdr.gctFlag)
        {
            hdr.gct = parseCT(1 << (hdr.gctSize + 1));
        }
        handler.hdr && handler.hdr(hdr);
    };

    var parseExt = function(block) {
        var parseGCExt = function(block) {
            var blockSize = st.readByte(); // Always 4
            var bits = byteToBitArr(st.readByte());
            block.reserved = bits.splice(0, 3); // Reserved; should be 000.
            block.disposalMethod = bitsToNum(bits.splice(0, 3));
            block.userInput = bits.shift();
            block.transparencyGiven = bits.shift();
            block.delayTime = st.readUnsigned();
            block.transparencyIndex = st.readByte();
            block.terminator = st.readByte();
            handler.gce && handler.gce(block);
        };

        var parseComExt = function(block) {
            block.comment = readSubBlocks();
            handler.com && handler.com(block);
        };

        var parsePTExt = function(block) {
            // No one *ever* uses this. If you use it, deal with parsing it yourself.
            var blockSize = st.readByte(); // Always 12
            block.ptHeader = st.readBytes(12);
            block.ptData = readSubBlocks();
            handler.pte && handler.pte(block);
        };

        var parseAppExt = function(block) {
            var parseNetscapeExt = function(block) {
                var blockSize = st.readByte(); // Always 3
                block.unknown = st.readByte(); // ??? Always 1? What is this?
                block.iterations = st.readUnsigned();
                block.terminator = st.readByte();
                handler.app && handler.app.NETSCAPE && handler.app.NETSCAPE(block);
            };

            var parseUnknownAppExt = function(block) {
                block.appData = readSubBlocks();
                // FIXME: This won't work if a handler wants to match on any identifier.
                handler.app && handler.app[block.identifier] && handler.app[block.identifier](block);
            };

            var blockSize = st.readByte(); // Always 11
            block.identifier = st.read(8);
            block.authCode = st.read(3);
            switch (block.identifier)
            {
                case 'NETSCAPE':
                    parseNetscapeExt(block);
                    break;
                default:
                    parseUnknownAppExt(block);
                    break;
            }
        };

        var parseUnknownExt = function(block) {
            block.data = readSubBlocks();
            handler.unknown && handler.unknown(block);
        };

        block.label = st.readByte();
        switch (block.label)
        {
            case 0xF9:
                block.extType = 'gce';
                parseGCExt(block);
                break;
            case 0xFE:
                block.extType = 'com';
                parseComExt(block);
                break;
            case 0x01:
                block.extType = 'pte';
                parsePTExt(block);
                break;
            case 0xFF:
                block.extType = 'app';
                parseAppExt(block);
                break;
            default:
                block.extType = 'unknown';
                parseUnknownExt(block);
                break;
        }
    };

    var parseImg = function(img) {
        var deinterlace = function(pixels, width) {
            // Of course this defeats the purpose of interlacing. And it's *probably*
            // the least efficient way it's ever been implemented. But nevertheless...
            var newPixels = new Array(pixels.length);
            var rows = pixels.length / width;
            var cpRow = function (toRow, fromRow) {
                var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
                newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
            };

            // See appendix E.
            var offsets = [0, 4, 2, 1];
            var steps = [8, 8, 4, 2];

            var fromRow = 0;
            for (var pass = 0; pass < 4; ++pass)
            {
                for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass])
                {
                    cpRow(toRow, fromRow)
                    ++fromRow;
                }
            }
            return newPixels;
        };

        img.leftPos = st.readUnsigned();
        img.topPos = st.readUnsigned();
        img.width = st.readUnsigned();
        img.height = st.readUnsigned();

        var bits = byteToBitArr(st.readByte());
        img.lctFlag = bits.shift();
        img.interlaced = bits.shift();
        img.sorted = bits.shift();
        img.reserved = bits.splice(0, 2);
        img.lctSize = bitsToNum(bits.splice(0, 3));

        if (img.lctFlag)
        {
            img.lct = parseCT(1 << (img.lctSize + 1));
        }

        img.lzwMinCodeSize = st.readByte();

        var lzwData = readSubBlocks();

        img.pixels = lzwDecode(img.lzwMinCodeSize, lzwData);

        if (img.interlaced)
        {
            // Move
            img.pixels = deinterlace(img.pixels, img.width);
        }
        handler.img && handler.img(img);
    };

    var parseBlock = function() {
        var block = {};
        block.sentinel = st.readByte();

        // For ease of matching
        switch (String.fromCharCode(block.sentinel))
        {
            case '!':
                block.type = 'ext';
                parseExt(block);
                break;
            case ',':
                block.type = 'img';
                parseImg(block);
                break;
            case ';':
                block.type = 'eof';
                handler.eof && handler.eof(block);
                break;
            default:
                throw new Error('Unknown block: 0x' + block.sentinel.toString(16)); // TODO: Pad this with a 0.
        }

        if (block.type !== 'eof') parseBlock();
    };

    var parse = function() {
        parseHeader();
        parseBlock();
    };
    parse();
};

async function read_gif(buffer, metaData)
{
    var hdr, transparency = null,
        imgData = {width: 0, height: 0, data: null};
    // animated GIFs are not handled at this moment, needed??
    parseGIF(new Stream(new Uint8Array(buffer)), {
        hdr: function (_hdr) {hdr = _hdr;},
        gce: function (gce) {transparency = gce.transparencyGiven ? gce.transparencyIndex : null;},
        img: function (img) {
            //ct = color table, gct = global color table
            var ct = img.lctFlag ? img.lct : hdr.gct; // TODO: What if neither exists?
            var cdd = new ImArray((img.width * img.height) << 2);
            //apply color table colors
            img.pixels.forEach(function(pixel, i) {
                // imgData.data === [R,G,B,A,R,G,B,A,...]
                var index = i << 2;
                if (pixel !== transparency)
                {
                    cdd[index + 0] = ct[pixel][0];
                    cdd[index + 1] = ct[pixel][1];
                    cdd[index + 2] = ct[pixel][2];
                    cdd[index + 3] = 255; // Opaque.
                }
            });
            imgData.width = img.width;
            imgData.height = img.height;
            imgData.data = cdd;
        }
    });
    return imgData;
}
// adapted from https://github.com/eugeneware/jpeg-js
var dctZigZag = new Int32Array([
 0,
 1,  8,
16,  9,  2,
 3, 10, 17, 24,
32, 25, 18, 11, 4,
 5, 12, 19, 26, 33, 40,
48, 41, 34, 27, 20, 13,  6,
 7, 14, 21, 28, 35, 42, 49, 56,
57, 50, 43, 36, 29, 22, 15,
23, 30, 37, 44, 51, 58,
59, 52, 45, 38, 31,
39, 46, 53, 60,
61, 54, 47,
55, 62,
63
]);

var dctCos1  =  4017   // cos(pi/16)
var dctSin1  =   799   // sin(pi/16)
var dctCos3  =  3406   // cos(3*pi/16)
var dctSin3  =  2276   // sin(3*pi/16)
var dctCos6  =  1567   // cos(6*pi/16)
var dctSin6  =  3784   // sin(6*pi/16)
var dctSqrt2 =  5793   // sqrt(2)
var dctSqrt1d2 = 2896  // sqrt(2) / 2

function JpegImage() {}

function buildHuffmanTable(codeLengths, values)
{
    var k = 0, code = [], i, j, length = 16;
    while (length > 0 && !codeLengths[length - 1]) --length;
    code.push({children: [], index: 0});
    var p = code[0], q;
    for (i = 0; i < length; ++i)
    {
        for (j = 0; j < codeLengths[i]; ++j)
        {
            p = code.pop();
            p.children[p.index] = values[k];
            while (p.index > 0)
            {
                p = code.pop();
            }
            ++p.index;
            code.push(p);
            while (code.length <= i)
            {
                code.push(q = {children: [], index: 0});
                p.children[p.index] = q.children;
                p = q;
            }
            k++;
        }
        if (i + 1 < length)
        {
            // p here points to last code
            code.push(q = {children: [], index: 0});
            p.children[p.index] = q.children;
            p = q;
        }
    }
    return code[0].children;
}

function decodeScan(data, offset, frame, components, resetInterval,
            spectralStart, spectralEnd,
            successivePrev, successive)
{
    var precision = frame.precision;
    var samplesPerLine = frame.samplesPerLine;
    var scanLines = frame.scanLines;
    var mcusPerLine = frame.mcusPerLine;
    var progressive = frame.progressive;
    var maxH = frame.maxH, maxV = frame.maxV;

    var startOffset = offset, bitsData = 0, bitsCount = 0;
    function readBit( )
    {
        if (bitsCount > 0)
        {
            --bitsCount;
            return (bitsData >> bitsCount) & 1;
        }
        bitsData = data[offset++];
        if (bitsData == 0xFF)
        {
            var nextByte = data[offset++];
            if (nextByte)
            {
                throw "unexpected marker: " + ((bitsData << 8) | nextByte).toString(16);
            }
            // unstuff 0
        }
        bitsCount = 7;
        return bitsData >>> 7;
    }

    function decodeHuffman(tree)
    {
        var node = tree, bit;
        while ((bit = readBit()) != null)
        {
            node = node[bit];
            if (typeof node === 'number')  return node;
            if (typeof node !== 'object') throw "invalid huffman sequence";
        }
        return null;
    }

    function receive(length)
    {
        var n = 0;
        while (length > 0)
        {
            var bit = readBit();
            if (bit == null) return;
            n = (n << 1) | bit;
            --length;
        }
        return n;
    }

    function receiveAndExtend(length)
    {
        var n = receive(length);
        if (n >= 1 << (length - 1)) return n;
        return n + (-1 << length) + 1;
    }

    function decodeBaseline(component, zz)
    {
        var t = decodeHuffman(component.huffmanTableDC);
        var diff = t === 0 ? 0 : receiveAndExtend(t);
        zz[0]= (component.pred += diff);
        var k = 1;
        while (k < 64)
        {
            var rs = decodeHuffman(component.huffmanTableAC);
            var s = rs & 15, r = rs >> 4;
            if (s === 0)
            {
                if (r < 15) break;
                k += 16;
                continue;
            }
            k += r;
            var z = dctZigZag[k];
            zz[z] = receiveAndExtend(s);
            k++;
        }
    }

    function decodeDCFirst(component, zz)
    {
        var t = decodeHuffman(component.huffmanTableDC);
        var diff = t === 0 ? 0 : (receiveAndExtend(t) << successive);
        zz[0] = (component.pred += diff);
    }

    function decodeDCSuccessive(component, zz)
    {
        zz[0] |= readBit() << successive;
    }

    var eobrun = 0;

    function decodeACFirst(component, zz)
    {
        if (eobrun > 0)
        {
            --eobrun;
            return;
        }
        var k = spectralStart, e = spectralEnd;
        while (k <= e)
        {
            var rs = decodeHuffman(component.huffmanTableAC);
            var s = rs & 15, r = rs >> 4;
            if (s === 0)
            {
                if (r < 15)
                {
                    eobrun = receive(r) + (1 << r) - 1;
                    break;
                }
                k += 16;
                continue;
            }
            k += r;
            var z = dctZigZag[k];
            zz[z] = receiveAndExtend(s) * (1 << successive);
            k++;
        }
    }

    var successiveACState = 0, successiveACNextValue;

    function decodeACSuccessive(component, zz)
    {
        var k = spectralStart, e = spectralEnd, r = 0;
        while (k <= e)
        {
            var z = dctZigZag[k];
            switch (successiveACState)
            {
                case 0: // initial state
                    var rs = decodeHuffman(component.huffmanTableAC);
                    var s = rs & 15, r = rs >> 4;
                    if (s === 0)
                    {
                        if (r < 15)
                        {
                            eobrun = receive(r) + (1 << r);
                            successiveACState = 4;
                        }
                        else
                        {
                            r = 16;
                            successiveACState = 1;
                        }
                    }
                    else
                    {
                        if (s !== 1) throw "invalid ACn encoding";
                        successiveACNextValue = receiveAndExtend(s);
                        successiveACState = r ? 2 : 3;
                    }
                    continue;
                case 1: // skipping r zero items
                case 2:
                    if (zz[z]) zz[z] += (readBit() << successive);
                    else
                    {
                        r--;
                        if (r === 0) successiveACState = successiveACState == 2 ? 3 : 0;
                    }
                    break;
                case 3: // set value for a zero item
                    if (zz[z]) zz[z] += (readBit() << successive);
                    else
                    {
                        zz[z] = successiveACNextValue << successive;
                        successiveACState = 0;
                    }
                    break;
                case 4: // eob
                    if (zz[z]) zz[z] += (readBit() << successive);
                    break;
            }
            k++;
        }
        if (successiveACState === 4)
        {
            --eobrun;
            if (eobrun === 0) successiveACState = 0;
        }
    }

    function decodeMcu(component, decode, mcu, row, col)
    {
        var mcuRow = (mcu / mcusPerLine) | 0;
        var mcuCol = mcu % mcusPerLine;
        var blockRow = mcuRow * component.v + row;
        var blockCol = mcuCol * component.h + col;
        decode(component, component.blocks[blockRow][blockCol]);
    }

    function decodeBlock(component, decode, mcu)
    {
        var blockRow = (mcu / component.blocksPerLine) | 0;
        var blockCol = mcu % component.blocksPerLine;
        decode(component, component.blocks[blockRow][blockCol]);
    }

    var componentsLength = components.length;
    var component, i, j, k, n;
    var decodeFn;
    if (progressive)
    {
        if (spectralStart === 0) decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
        else decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
    }
    else
    {
        decodeFn = decodeBaseline;
    }

    var mcu = 0, marker;
    var mcuExpected;
    if (componentsLength == 1)
    {
        mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
    }
    else
    {
        mcuExpected = mcusPerLine * frame.mcusPerColumn;
    }
    if (!resetInterval) resetInterval = mcuExpected;

    var h, v;
    while (mcu < mcuExpected)
    {
        // reset interval stuff
        for (i = 0; i < componentsLength; ++i) components[i].pred = 0;
        eobrun = 0;

        if (componentsLength == 1)
        {
            component = components[0];
            for (n = 0; n < resetInterval; ++n)
            {
                decodeBlock(component, decodeFn, mcu);
                ++mcu;
            }
        }
        else
        {
            for (n = 0; n < resetInterval; ++n)
            {
                for (i = 0; i < componentsLength; ++i)
                {
                    component = components[i];
                    h = component.h;
                    v = component.v;
                    for (j = 0; j < v; ++j)
                    {
                        for (k = 0; k < h; ++k)
                        {
                            decodeMcu(component, decodeFn, mcu, j, k);
                        }
                    }
                }
                ++mcu;

                // If we've reached our expected MCU's, stop decoding
                if (mcu === mcuExpected) break;
            }
        }

        // find marker
        bitsCount = 0;
        marker = (data[offset] << 8) | data[offset + 1];
        if (marker < 0xFF00)
        {
            throw "marker was not found";
        }

        if (marker >= 0xFFD0 && marker <= 0xFFD7)
        {
            // RSTx
            offset += 2;
        }
        else break;
    }

    return offset - startOffset;
}

function buildComponentData(frame, component)
{
    var lines = [];
    var blocksPerLine = component.blocksPerLine;
    var blocksPerColumn = component.blocksPerColumn;
    var samplesPerLine = blocksPerLine << 3;
    var R = new Int32Array(64), r = new Uint8Array(64);

    // A port of poppler's IDCT method which in turn is taken from:
    //   Christoph Loeffler, Adriaan Ligtenberg, George S. Moschytz,
    //   "Practical Fast 1-D DCT Algorithms with 11 Multiplications",
    //   IEEE Intl. Conf. on Acoustics, Speech & Signal Processing, 1989,
    //   988-991.
    function quantizeAndInverse(zz, dataOut, dataIn)
    {
        var qt = component.quantizationTable;
        var v0, v1, v2, v3, v4, v5, v6, v7, t;
        var p = dataIn;
        var i;

        // dequant
        for (i = 0; i < 64; ++i) p[i] = zz[i] * qt[i];

        // inverse DCT on rows
        for (i = 0; i < 8; ++i)
        {
            var row = 8 * i;

            // check for all-zero AC coefficients
            if (p[1 + row] == 0 && p[2 + row] == 0 && p[3 + row] == 0 &&
            p[4 + row] == 0 && p[5 + row] == 0 && p[6 + row] == 0 &&
            p[7 + row] == 0)
            {
                t = (dctSqrt2 * p[0 + row] + 512) >> 10;
                p[0 + row] = t;
                p[1 + row] = t;
                p[2 + row] = t;
                p[3 + row] = t;
                p[4 + row] = t;
                p[5 + row] = t;
                p[6 + row] = t;
                p[7 + row] = t;
                continue;
            }

            // stage 4
            v0 = (dctSqrt2 * p[0 + row] + 128) >> 8;
            v1 = (dctSqrt2 * p[4 + row] + 128) >> 8;
            v2 = p[2 + row];
            v3 = p[6 + row];
            v4 = (dctSqrt1d2 * (p[1 + row] - p[7 + row]) + 128) >> 8;
            v7 = (dctSqrt1d2 * (p[1 + row] + p[7 + row]) + 128) >> 8;
            v5 = p[3 + row] << 4;
            v6 = p[5 + row] << 4;

            // stage 3
            t = (v0 - v1+ 1) >> 1;
            v0 = (v0 + v1 + 1) >> 1;
            v1 = t;
            t = (v2 * dctSin6 + v3 * dctCos6 + 128) >> 8;
            v2 = (v2 * dctCos6 - v3 * dctSin6 + 128) >> 8;
            v3 = t;
            t = (v4 - v6 + 1) >> 1;
            v4 = (v4 + v6 + 1) >> 1;
            v6 = t;
            t = (v7 + v5 + 1) >> 1;
            v5 = (v7 - v5 + 1) >> 1;
            v7 = t;

            // stage 2
            t = (v0 - v3 + 1) >> 1;
            v0 = (v0 + v3 + 1) >> 1;
            v3 = t;
            t = (v1 - v2 + 1) >> 1;
            v1 = (v1 + v2 + 1) >> 1;
            v2 = t;
            t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
            v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
            v7 = t;
            t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
            v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
            v6 = t;

            // stage 1
            p[0 + row] = v0 + v7;
            p[7 + row] = v0 - v7;
            p[1 + row] = v1 + v6;
            p[6 + row] = v1 - v6;
            p[2 + row] = v2 + v5;
            p[5 + row] = v2 - v5;
            p[3 + row] = v3 + v4;
            p[4 + row] = v3 - v4;
        }

        // inverse DCT on columns
        for (i = 0; i < 8; ++i)
        {
            var col = i;

            // check for all-zero AC coefficients
            if (p[1*8 + col] == 0 && p[2*8 + col] == 0 && p[3*8 + col] == 0 &&
            p[4*8 + col] == 0 && p[5*8 + col] == 0 && p[6*8 + col] == 0 &&
            p[7*8 + col] == 0)
            {
                t = (dctSqrt2 * dataIn[i+0] + 8192) >> 14;
                p[0*8 + col] = t;
                p[1*8 + col] = t;
                p[2*8 + col] = t;
                p[3*8 + col] = t;
                p[4*8 + col] = t;
                p[5*8 + col] = t;
                p[6*8 + col] = t;
                p[7*8 + col] = t;
                continue;
            }

            // stage 4
            v0 = (dctSqrt2 * p[0*8 + col] + 2048) >> 12;
            v1 = (dctSqrt2 * p[4*8 + col] + 2048) >> 12;
            v2 = p[2*8 + col];
            v3 = p[6*8 + col];
            v4 = (dctSqrt1d2 * (p[1*8 + col] - p[7*8 + col]) + 2048) >> 12;
            v7 = (dctSqrt1d2 * (p[1*8 + col] + p[7*8 + col]) + 2048) >> 12;
            v5 = p[3*8 + col];
            v6 = p[5*8 + col];

            // stage 3
            t = (v0 - v1 + 1) >> 1;
            v0 = (v0 + v1 + 1) >> 1;
            v1 = t;
            t = (v2 * dctSin6 + v3 * dctCos6 + 2048) >> 12;
            v2 = (v2 * dctCos6 - v3 * dctSin6 + 2048) >> 12;
            v3 = t;
            t = (v4 - v6 + 1) >> 1;
            v4 = (v4 + v6 + 1) >> 1;
            v6 = t;
            t = (v7 + v5 + 1) >> 1;
            v5 = (v7 - v5 + 1) >> 1;
            v7 = t;

            // stage 2
            t = (v0 - v3 + 1) >> 1;
            v0 = (v0 + v3 + 1) >> 1;
            v3 = t;
            t = (v1 - v2 + 1) >> 1;
            v1 = (v1 + v2 + 1) >> 1;
            v2 = t;
            t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
            v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
            v7 = t;
            t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
            v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
            v6 = t;

            // stage 1
            p[0*8 + col] = v0 + v7;
            p[7*8 + col] = v0 - v7;
            p[1*8 + col] = v1 + v6;
            p[6*8 + col] = v1 - v6;
            p[2*8 + col] = v2 + v5;
            p[5*8 + col] = v2 - v5;
            p[3*8 + col] = v3 + v4;
            p[4*8 + col] = v3 - v4;
        }

        // convert to 8-bit integers
        for (i = 0; i < 64; ++i)
        {
            var sample = 128 + ((p[i] + 8) >> 4);
            dataOut[i] = sample < 0 ? 0 : sample > 0xFF ? 0xFF : sample;
        }
    }

    var i, j;
    for (var blockRow = 0; blockRow < blocksPerColumn; ++blockRow)
    {
        var scanLine = blockRow << 3;
        for (i = 0; i < 8; ++i) lines.push(new Uint8Array(samplesPerLine));
        for (var blockCol = 0; blockCol < blocksPerLine; ++blockCol)
        {
            quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);

            var offset = 0, sample = blockCol << 3;
            for (j = 0; j < 8; ++j)
            {
                var line = lines[scanLine + j];
                for (i = 0; i < 8; ++i) line[sample + i] = r[offset++];
            }
        }
    }
    return lines;
}

function clampTo8bit(a)
{
    return a < 0 ? 0 : a > 255 ? 255 : a;
}

JpegImage[PROTO] = {
    constructor: JpegImage,

    parse: function parse(data) {
        var offset = 0, length = data.length;
        function readUint16()
        {
            var value = (data[offset] << 8) | data[offset + 1];
            offset += 2;
            return value;
        }

        function readDataBlock()
        {
            var length = readUint16();
            var array = data.subarray(offset, offset + length - 2);
            offset += array.length;
            return array;
        }

        function prepareComponents(frame)
        {
            var maxH = 0, maxV = 0;
            var component, componentId;
            for (componentId in frame.components)
            {
                if (frame.components.hasOwnProperty(componentId))
                {
                    component = frame.components[componentId];
                    if (maxH < component.h) maxH = component.h;
                    if (maxV < component.v) maxV = component.v;
                }
            }
            var mcusPerLine = stdMath.ceil(frame.samplesPerLine / 8 / maxH);
            var mcusPerColumn = stdMath.ceil(frame.scanLines / 8 / maxV);
            for (componentId in frame.components)
            {
                if (frame.components.hasOwnProperty(componentId))
                {
                    component = frame.components[componentId];
                    var blocksPerLine = stdMath.ceil(stdMath.ceil(frame.samplesPerLine / 8) * component.h / maxH);
                    var blocksPerColumn = stdMath.ceil(stdMath.ceil(frame.scanLines  / 8) * component.v / maxV);
                    var blocksPerLineForMcu = mcusPerLine * component.h;
                    var blocksPerColumnForMcu = mcusPerColumn * component.v;
                    var blocks = [];
                    for (var i = 0; i < blocksPerColumnForMcu; ++i)
                    {
                        var row = [];
                        for (var j = 0; j < blocksPerLineForMcu; ++j) row.push(new Int32Array(64));
                        blocks.push(row);
                    }
                    component.blocksPerLine = blocksPerLine;
                    component.blocksPerColumn = blocksPerColumn;
                    component.blocks = blocks;
                }
            }
            frame.maxH = maxH;
            frame.maxV = maxV;
            frame.mcusPerLine = mcusPerLine;
            frame.mcusPerColumn = mcusPerColumn;
        }

        var jfif = null;
        var adobe = null;
        var pixels = null;
        var frame, resetInterval;
        var quantizationTables = [], frames = [];
        var huffmanTablesAC = [], huffmanTablesDC = [];
        var fileMarker = readUint16();
        if (fileMarker != 0xFFD8)
        {
            // SOI (Start of Image)
            throw "SOI not found";
        }

        fileMarker = readUint16();
        while (fileMarker != 0xFFD9)
        {
            // EOI (End of image)
            var i, j, l;
            switch(fileMarker)
            {
                case 0xFF00:
                    break;
                case 0xFFE0: // APP0 (Application Specific)
                case 0xFFE1: // APP1
                case 0xFFE2: // APP2
                case 0xFFE3: // APP3
                case 0xFFE4: // APP4
                case 0xFFE5: // APP5
                case 0xFFE6: // APP6
                case 0xFFE7: // APP7
                case 0xFFE8: // APP8
                case 0xFFE9: // APP9
                case 0xFFEA: // APP10
                case 0xFFEB: // APP11
                case 0xFFEC: // APP12
                case 0xFFED: // APP13
                case 0xFFEE: // APP14
                case 0xFFEF: // APP15
                case 0xFFFE: // COM (Comment)
                    var appData = readDataBlock();

                    if (fileMarker === 0xFFE0)
                    {
                        if (appData[0] === 0x4A && appData[1] === 0x46 && appData[2] === 0x49 &&
                        appData[3] === 0x46 && appData[4] === 0)
                        {
                            // 'JFIF\x00'
                            jfif = {
                                version: { major: appData[5], minor: appData[6] },
                                densityUnits: appData[7],
                                xDensity: (appData[8] << 8) | appData[9],
                                yDensity: (appData[10] << 8) | appData[11],
                                thumbWidth: appData[12],
                                thumbHeight: appData[13],
                                thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
                            };
                        }
                    }
                    // TODO APP1 - Exif
                    if (fileMarker === 0xFFEE)
                    {
                        if (appData[0] === 0x41 && appData[1] === 0x64 && appData[2] === 0x6F &&
                        appData[3] === 0x62 && appData[4] === 0x65 && appData[5] === 0)
                        {
                            // 'Adobe\x00'
                            adobe = {
                                version: appData[6],
                                flags0: (appData[7] << 8) | appData[8],
                                flags1: (appData[9] << 8) | appData[10],
                                transformCode: appData[11]
                            };
                        }
                    }
                    break;

                case 0xFFDB: // DQT (Define Quantization Tables)
                    var quantizationTablesLength = readUint16();
                    var quantizationTablesEnd = quantizationTablesLength + offset - 2;
                    while (offset < quantizationTablesEnd)
                    {
                        var quantizationTableSpec = data[offset++];
                        var tableData = new Int32Array(64);
                        if ((quantizationTableSpec >> 4) === 0)
                        {
                            // 8 bit values
                            for (j = 0; j < 64; ++j)
                            {
                                var z = dctZigZag[j];
                                tableData[z] = data[offset++];
                            }
                        }
                        else if ((quantizationTableSpec >> 4) === 1)
                        {
                            //16 bit
                            for (j = 0; j < 64; ++j)
                            {
                                var z = dctZigZag[j];
                                tableData[z] = readUint16();
                            }
                        }
                        else throw "DQT: invalid table spec";
                        quantizationTables[quantizationTableSpec & 15] = tableData;
                    }
                    break;

                case 0xFFC0: // SOF0 (Start of Frame, Baseline DCT)
                case 0xFFC1: // SOF1 (Start of Frame, Extended DCT)
                case 0xFFC2: // SOF2 (Start of Frame, Progressive DCT)
                    readUint16(); // skip data length
                    frame = {};
                    frame.extended = (fileMarker === 0xFFC1);
                    frame.progressive = (fileMarker === 0xFFC2);
                    frame.precision = data[offset++];
                    frame.scanLines = readUint16();
                    frame.samplesPerLine = readUint16();
                    frame.components = {};
                    frame.componentsOrder = [];
                    var componentsCount = data[offset++], componentId;
                    var maxH = 0, maxV = 0;
                    for (i = 0; i < componentsCount; ++i)
                    {
                        componentId = data[offset];
                        var h = data[offset + 1] >> 4;
                        var v = data[offset + 1] & 15;
                        var qId = data[offset + 2];
                        frame.componentsOrder.push(componentId);
                        frame.components[componentId] = {
                            h: h,
                            v: v,
                            quantizationIdx: qId
                        };
                        offset += 3;
                    }
                    prepareComponents(frame);
                    frames.push(frame);
                    break;

                case 0xFFC4: // DHT (Define Huffman Tables)
                    var huffmanLength = readUint16();
                    for (i = 2; i < huffmanLength;)
                    {
                        var huffmanTableSpec = data[offset++];
                        var codeLengths = new Uint8Array(16);
                        var codeLengthSum = 0;
                        for (j = 0; j < 16; ++j, ++offset) codeLengthSum += (codeLengths[j] = data[offset]);
                        var huffmanValues = new Uint8Array(codeLengthSum);
                        for (j = 0; j < codeLengthSum; ++j, ++offset) huffmanValues[j] = data[offset];
                        i += 17 + codeLengthSum;

                        ((huffmanTableSpec >> 4) === 0
                                    ? huffmanTablesDC
                                    : huffmanTablesAC)[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues);
                    }
                    break;

                case 0xFFDD: // DRI (Define Restart Interval)
                    readUint16(); // skip data length
                    resetInterval = readUint16();
                    break;

                case 0xFFDA: // SOS (Start of Scan)
                    var scanLength = readUint16();
                    var selectorsCount = data[offset++];
                    var components = [], component;
                    for (i = 0; i < selectorsCount; ++i)
                    {
                        component = frame.components[data[offset++]];
                        var tableSpec = data[offset++];
                        component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
                        component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
                        components.push(component);
                    }
                    var spectralStart = data[offset++];
                    var spectralEnd = data[offset++];
                    var successiveApproximation = data[offset++];
                    var processed = decodeScan(data, offset,
                    frame, components, resetInterval,
                    spectralStart, spectralEnd,
                    successiveApproximation >> 4, successiveApproximation & 15);
                    offset += processed;
                    break;

                default:
                    if (data[offset - 3] == 0xFF &&
                    data[offset - 2] >= 0xC0 && data[offset - 2] <= 0xFE)
                    {
                        // could be incorrect encoding -- last 0xFF byte of the previous
                        // block was eaten by the encoder
                        offset -= 3;
                        break;
                    }
                throw "unknown JPEG marker " + fileMarker.toString(16);
            }
            fileMarker = readUint16();
        }

        if (frames.length != 1) throw "only single frame JPEGs supported";

        // set each frame's components quantization table
        for (var i = 0; i < frames.length; ++i)
        {
            var cp = frames[i].components;
            for (var j in cp)
            {
                cp[j].quantizationTable = quantizationTables[cp[j].quantizationIdx];
                delete cp[j].quantizationIdx;
            }
        }

        this.width = frame.samplesPerLine;
        this.height = frame.scanLines;
        this.jfif = jfif;
        this.adobe = adobe;
        this.components = [];
        for (var i = 0; i < frame.componentsOrder.length; ++i)
        {
            var component = frame.components[frame.componentsOrder[i]];
            this.components.push({
                lines: buildComponentData(frame, component),
                scaleX: component.h / frame.maxH,
                scaleY: component.v / frame.maxV
            });
        }
    },

    getData: function getData(width, height) {
        var scaleX = this.width / width, scaleY = this.height / height;

        var component1, component2, component3, component4;
        var component1Line, component2Line, component3Line, component4Line;
        var x, y;
        var offset = 0;
        var Y, Cb, Cr, K, C, M, Ye, R, G, B;
        var colorTransform;
        var dataLength = width * height * this.components.length;
        var data = new Uint8Array(dataLength);
        switch (this.components.length)
        {
            case 1:
                component1 = this.components[0];
                for (y = 0; y < height; ++y)
                {
                    component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                    for (x = 0; x < width; ++x)
                    {
                        Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                        data[offset++] = Y;
                    }
                }
                break;
            case 2:
                // PDF might compress two component data in custom colorspace
                component1 = this.components[0];
                component2 = this.components[1];
                for (y = 0; y < height; ++y)
                {
                    component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                    component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
                    for (x = 0; x < width; ++x)
                    {
                        Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                        data[offset++] = Y;
                        Y = component2Line[0 | (x * component2.scaleX * scaleX)];
                        data[offset++] = Y;
                    }
                }
                break;
            case 3:
                // The default transform for three components is true
                colorTransform = true;
                // The adobe transform marker overrides any previous setting
                if (this.adobe && this.adobe.transformCode) colorTransform = true;
                else if (typeof this.colorTransform !== 'undefined') colorTransform = !!this.colorTransform;

                component1 = this.components[0];
                component2 = this.components[1];
                component3 = this.components[2];
                for (y = 0; y < height; ++y)
                {
                    component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                    component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
                    component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
                    for (x = 0; x < width; ++x)
                    {
                        if (!colorTransform)
                        {
                            R = component1Line[0 | (x * component1.scaleX * scaleX)];
                            G = component2Line[0 | (x * component2.scaleX * scaleX)];
                            B = component3Line[0 | (x * component3.scaleX * scaleX)];
                        }
                        else
                        {
                            Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                            Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
                            Cr = component3Line[0 | (x * component3.scaleX * scaleX)];

                            R = clampTo8bit(Y + 1.402 * (Cr - 128));
                            G = clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                            B = clampTo8bit(Y + 1.772 * (Cb - 128));
                        }

                        data[offset++] = R;
                        data[offset++] = G;
                        data[offset++] = B;
                    }
                }
                break;
            case 4:
                if (!this.adobe) throw 'Unsupported color mode (4 components)';
                // The default transform for four components is false
                colorTransform = false;
                // The adobe transform marker overrides any previous setting
                if (this.adobe && this.adobe.transformCode) colorTransform = true;
                else if (typeof this.colorTransform !== 'undefined') colorTransform = !!this.colorTransform;

                component1 = this.components[0];
                component2 = this.components[1];
                component3 = this.components[2];
                component4 = this.components[3];
                for (y = 0; y < height; ++y)
                {
                    component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                    component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
                    component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
                    component4Line = component4.lines[0 | (y * component4.scaleY * scaleY)];
                    for (x = 0; x < width; ++x)
                    {
                        if (!colorTransform)
                        {
                            C = component1Line[0 | (x * component1.scaleX * scaleX)];
                            M = component2Line[0 | (x * component2.scaleX * scaleX)];
                            Ye = component3Line[0 | (x * component3.scaleX * scaleX)];
                            K = component4Line[0 | (x * component4.scaleX * scaleX)];
                        }
                        else
                        {
                            Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                            Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
                            Cr = component3Line[0 | (x * component3.scaleX * scaleX)];
                            K = component4Line[0 | (x * component4.scaleX * scaleX)];

                            C = 255 - clampTo8bit(Y + 1.402 * (Cr - 128));
                            M = 255 - clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                            Ye = 255 - clampTo8bit(Y + 1.772 * (Cb - 128));
                        }
                        data[offset++] = C;
                        data[offset++] = M;
                        data[offset++] = Ye;
                        data[offset++] = K;
                    }
                }
                break;
            default:
                throw 'Unsupported color mode';
        }
        return data;
    },

    copyToImageData: function copyToImageData(imageData) {
        var width = imageData.width, height = imageData.height;
        var imageDataArray = imageData.data;
        var data = this.getData(width, height);
        var i = 0, j = 0, x, y;
        var Y, K, C, M, R, G, B;
        switch (this.components.length)
        {
            case 1:
                for (y = 0; y < height; ++y)
                {
                    for (x = 0; x < width; ++x)
                    {
                        Y = data[i++];
                        imageDataArray[j++] = Y;
                        imageDataArray[j++] = Y;
                        imageDataArray[j++] = Y;
                        imageDataArray[j++] = 255;
                    }
                }
                break;
            case 3:
                for (y = 0; y < height; ++y)
                {
                    for (x = 0; x < width; ++x)
                    {
                        R = data[i++];
                        G = data[i++];
                        B = data[i++];

                        imageDataArray[j++] = R;
                        imageDataArray[j++] = G;
                        imageDataArray[j++] = B;
                        imageDataArray[j++] = 255;
                    }
                }
                break;
            case 4:
                for (y = 0; y < height; ++y)
                {
                    for (x = 0; x < width; ++x)
                    {
                        C = data[i++];
                        M = data[i++];
                        Y = data[i++];
                        K = data[i++];

                        R = 255 - clampTo8bit(C * (1 - K / 255) + K);
                        G = 255 - clampTo8bit(M * (1 - K / 255) + K);
                        B = 255 - clampTo8bit(Y * (1 - K / 255) + K);

                        imageDataArray[j++] = R;
                        imageDataArray[j++] = G;
                        imageDataArray[j++] = B;
                        imageDataArray[j++] = 255;
                    }
                }
                break;
            default:
                throw 'Unsupported color mode';
        }
    }
};

async function read_jpg(buffer, metaData)
{
    var jpg = new JpegImage(), imgData;
    jpg.parse(new Uint8Array(buffer));
    imgData = {
        width: jpg.width,
        height: jpg.height,
        data: new Uint8Array((jpg.width * jpg.height) << 2)
    };
    jpg.copyToImageData(imgData);
    return imgData;
}
// adapted from https://github.com/devongovett/png.js/
// and from https://github.com/lukeapage/pngjs

function readBytes(numbytes, buf, pos)
{
    var i, bytes = [];
    if (0 <= numbytes) for (i=0; i<numbytes; ++i)  bytes.push(buf[pos.pos++]);
    else for (i=0; i>numbytes; --i) bytes.push(buf[pos.pos++]);
    return bytes;
}
function readUInt8(buf, pos)
{
    return buf[pos.pos++];
}
function readUInt16LE(buf, pos)
{
    // big endian, the most significant byte is stored in the smallest address
    // little endian, the least significant byte is stored in the smallest address
    var b0, b1;
    b0 = buf[pos.pos++]; b1 = buf[pos.pos++];
    return b0 | (b1<<8);
};
function readUInt16BE(buf, pos)
{
    // big endian, the most significant byte is stored in the smallest address
    // little endian, the least significant byte is stored in the smallest address
    var b0, b1;
    b0 = buf[pos.pos++]; b1 = buf[pos.pos++];
    return b1 | (b0<<8);
}
function readUInt32LE(buf, pos)
{
    // big endian, the most significant byte is stored in the smallest address
    // little endian, the least significant byte is stored in the smallest address
    var b0, b1, b2, b3;
    b0 = buf[pos.pos++]; b1 = buf[pos.pos++]; b2 = buf[pos.pos++]; b3 = buf[pos.pos++];
    return b0 | (b1<<8) | (b2<<16) | (b3<<24);
}
function readUInt32BE(buf, pos)
{
    // big endian, the most significant byte is stored in the smallest address
    // little endian, the least significant byte is stored in the smallest address
    var b0, b1, b2, b3;
    b0 = buf[pos.pos++]; b1 = buf[pos.pos++]; b2 = buf[pos.pos++]; b3 = buf[pos.pos++];
    return b3 | (b2<<8) | (b1<<16) | (b0<<24);
}

var
APNG_DISPOSE_OP_NONE = 0,
APNG_DISPOSE_OP_BACKGROUND = 1,
APNG_DISPOSE_OP_PREVIOUS = 2,
APNG_BLEND_OP_SOURCE = 0,
APNG_BLEND_OP_OVER = 1,
readUInt16 = readUInt16BE,
readUInt32 = readUInt32BE;

function PNG() {}
PNG[PROTO] = {
    constructor: PNG,

    data: null,
    pos: null,
    palette: null,
    imgData: null,
    transparency: null,
    animation: null,
    text: null,
    width: 0,
    height: 0,
    bits: null,
    colorType: null,
    compressionMethod: null,
    filterMethod: null,
    interlaceMethod: null,
    hasAlphaChannel: null,
    colors: null,
    colorSpace: null,
    pixelBitlength: null,

    readData: function(data) {
        var self = this;
        var chunkSize, colors, delayDen, delayNum, frame, i, index, key, section, short, text, _i, _j, _ref;

        self.data = data;
        self.pos = 8;
        self.palette = [];
        self.imgData = [];
        self.transparency = {};
        self.animation = null;
        self.text = {};
        frame = null;
        while (true)
        {
            chunkSize = readUInt32(self.data, self);
            section = ((function() {
                var _i, _results;
                _results = [];
                for (i = _i = 0; _i < 4; i = ++_i) {
                _results.push(String.fromCharCode(this.data[this.pos++]));
                }
                return _results;
            }).call(self)).join('');

            switch (section)
            {
                case 'IHDR':
                    self.width = readUInt32(self.data, self);
                    self.height = readUInt32(self.data, self);
                    self.bits = self.data[self.pos++];
                    self.colorType = self.data[self.pos++];
                    self.compressionMethod = self.data[self.pos++];
                    self.filterMethod = self.data[self.pos++];
                    self.interlaceMethod = self.data[self.pos++];
                    break;
                case 'acTL':
                    self.animation = {
                        numFrames: readUInt32(self.data, self),
                        numPlays: readUInt32(self.data, self) || INF,
                        frames: []
                    };
                    break;
                case 'PLTE':
                    self.palette = readBytes(chunkSize, self.data, self);
                    break;
                case 'fcTL':
                    if (frame)
                    {
                        self.animation.frames.push(frame);
                    }
                    self.pos += 4;
                    frame = {
                        width: readUInt32(self.data, self),
                        height: readUInt32(self.data, self),
                        xOffset: readUInt32(self.data, self),
                        yOffset: readUInt32(self.data, self)
                    };
                    delayNum = readUInt16(self.data, self);
                    delayDen = readUInt16(self.data, self) || 100;
                    frame.delay = 1000 * delayNum / delayDen;
                    frame.disposeOp = self.data[self.pos++];
                    frame.blendOp = self.data[self.pos++];
                    frame.data = [];
                    break;
                case 'IDAT':
                case 'fdAT':
                    if (section === 'fdAT')
                    {
                        self.pos += 4;
                        chunkSize -= 4;
                    }
                    data = (frame != null ? frame.data : void 0) || self.imgData;
                    for (i = _i = 0; 0 <= chunkSize ? _i < chunkSize : _i > chunkSize; i = 0 <= chunkSize ? ++_i : --_i)
                    {
                        data.push(self.data[self.pos++]);
                    }
                    break;
                case 'tRNS':
                    self.transparency = {};
                    switch (self.colorType)
                    {
                        case 3:
                            self.transparency.indexed = readBytes(chunkSize, self.data, self);
                            short = 255 - self.transparency.indexed.length;
                            if (short > 0)
                            {
                                for (i = _j = 0; 0 <= short ? _j < short : _j > short; i = 0 <= short ? ++_j : --_j)
                                {
                                    self.transparency.indexed.push(255);
                                }
                            }
                            break;
                        case 0:
                            self.transparency.grayscale = readBytes(chunkSize, self.data, self)[0];
                            break;
                        case 2:
                            self.transparency.rgb = readBytes(chunkSize, self.data, self);
                    }
                    break;
                case 'tEXt':
                    text = readBytes(chunkSize, self.data, self);
                    index = text.indexOf(0);
                    key = String.fromCharCode.apply(String, text.slice(0, index));
                    self.text[key] = String.fromCharCode.apply(String, text.slice(index + 1));
                    break;
                case 'IEND':
                    if (frame)
                    {
                        self.animation.frames.push(frame);
                    }
                    self.colors = (function() {
                        switch (this.colorType)
                        {
                            case 0:
                            case 3:
                            case 4:
                                return 1;
                            case 2:
                            case 6:
                                return 3;
                        }
                    }).call(self);
                    self.hasAlphaChannel = (_ref = self.colorType) === 4 || _ref === 6;
                    colors = self.colors + (self.hasAlphaChannel ? 1 : 0);
                    self.pixelBitlength = self.bits * colors;
                    self.colorSpace = (function() {
                        switch (this.colors)
                        {
                            case 1:
                                return 'DeviceGray';
                            case 3:
                                return 'DeviceRGB';
                        }
                    }).call(self);
                    self.imgData = new Uint8Array(self.imgData);
                    return;
                default:
                    self.pos += chunkSize;
            }
            self.pos += 4;
            if (self.pos > self.data.length)
            {
                throw new Error("Incomplete or corrupt PNG file");
            }
        }
    },

    decodePixels: async function(data) {
        var self = this, byte, c, col, i, left, length,
            p, pa, paeth, pb, pc, pixelBytes, pixels, pos, row,
            scanlineLength, upper, upperLeft, _i, _j, _k, _l, _m;
        if (data == null)
        {
            data = self.imgData;
        }
        if (data.length === 0)
        {
            return new Uint8Array(0);
        }
        data = await inflate(data);
        pixelBytes = self.pixelBitlength / 8;
        scanlineLength = pixelBytes * self.width;
        pixels = new Uint8Array(scanlineLength * self.height);
        length = data.length;
        row = 0;
        pos = 0;
        c = 0;
        while (pos < length)
        {
            switch (data[pos++])
            {
                case 0:
                    for (i = _i = 0; _i < scanlineLength; i = _i += 1)
                    {
                        pixels[c++] = data[pos++];
                    }
                    break;
                case 1:
                    for (i = _j = 0; _j < scanlineLength; i = _j += 1)
                    {
                        byte = data[pos++];
                        left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                        pixels[c++] = (byte + left) % 256;
                    }
                    break;
                case 2:
                    for (i = _k = 0; _k < scanlineLength; i = _k += 1)
                    {
                        byte = data[pos++];
                        col = (i - (i % pixelBytes)) / pixelBytes;
                        upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                        pixels[c++] = (upper + byte) % 256;
                    }
                    break;
                case 3:
                    for (i = _l = 0; _l < scanlineLength; i = _l += 1)
                    {
                        byte = data[pos++];
                        col = (i - (i % pixelBytes)) / pixelBytes;
                        left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                        upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                        pixels[c++] = (byte + Math.floor((left + upper) / 2)) % 256;
                    }
                    break;
                case 4:
                    for (i = _m = 0; _m < scanlineLength; i = _m += 1)
                    {
                        byte = data[pos++];
                        col = (i - (i % pixelBytes)) / pixelBytes;
                        left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                        if (row === 0)
                        {
                            upper = upperLeft = 0;
                        }
                        else
                        {
                            upper = pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                            upperLeft = col && pixels[(row - 1) * scanlineLength + (col - 1) * pixelBytes + (i % pixelBytes)];
                        }
                        p = left + upper - upperLeft;
                        pa = Math.abs(p - left);
                        pb = Math.abs(p - upper);
                        pc = Math.abs(p - upperLeft);
                        if (pa <= pb && pa <= pc)
                        {
                            paeth = left;
                        }
                        else if (pb <= pc)
                        {
                            paeth = upper;
                        }
                        else
                        {
                            paeth = upperLeft;
                        }
                        pixels[c++] = (byte + paeth) % 256;
                    }
                    break;
                default:
                    throw new Error("Invalid filter algorithm: " + data[pos - 1]);
            }
            row++;
        }
        return pixels;
    },

    decodePalette: function() {
        var self = this, c, i, length, palette, pos, ret,
            transparency, _i, _ref, _ref1;
        palette = self.palette;
        transparency = self.transparency.indexed || [];
        ret = new Uint8Array((transparency.length || 0) + palette.length);
        pos = 0;
        length = palette.length;
        c = 0;
        for (i = _i = 0, _ref = palette.length; _i < _ref; i = _i += 3)
        {
            ret[pos++] = palette[i];
            ret[pos++] = palette[i + 1];
            ret[pos++] = palette[i + 2];
            ret[pos++] = (_ref1 = transparency[c++]) != null ? _ref1 : 255;
        }
        return ret;
    },

    copyToImageData: function(imageData, pixels) {
        var self = this, alpha, colors, data, i, input,
            j, k, length, palette, v, _ref;
        colors = self.colors;
        palette = null;
        alpha = self.hasAlphaChannel;
        if (self.palette.length)
        {
            palette = (_ref = self._decodedPalette) != null ? _ref : self._decodedPalette = self.decodePalette();
            colors = 4;
            alpha = true;
        }
        data = imageData.data || imageData;
        length = data.length;
        input = palette || pixels;
        i = j = 0;
        if (colors === 1)
        {
            while (i < length)
            {
                k = palette ? pixels[i / 4] * 4 : j;
                v = input[k++];
                data[i++] = v;
                data[i++] = v;
                data[i++] = v;
                data[i++] = alpha ? input[k++] : 255;
                j = k;
            }
        }
        else
        {
            while (i < length)
            {
                k = palette ? pixels[i / 4] * 4 : j;
                data[i++] = input[k++];
                data[i++] = input[k++];
                data[i++] = input[k++];
                data[i++] = alpha ? input[k++] : 255;
                j = k;
            }
        }
    },

    decode: async function() {
        var self = this, ret;
        ret = new Uint8Array((self.width * self.height) << 2);
        self.copyToImageData(ret, await self.decodePixels());
        return ret;
    }
};

// PNG utilities
var PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],

    TYPE_IHDR = 0x49484452,
    TYPE_gAMA = 0x67414d41,
    TYPE_tRNS = 0x74524e53,
    TYPE_PLTE = 0x504c5445,
    TYPE_IDAT = 0x49444154,
    TYPE_IEND = 0x49454e44,

    // color-type bits
    COLORTYPE_GRAYSCALE = 0,
    COLORTYPE_PALETTE = 1,
    COLORTYPE_COLOR = 2,
    COLORTYPE_ALPHA = 4, // e.g. grayscale and alpha

    // color-type combinations
    COLORTYPE_PALETTE_COLOR = 3,
    COLORTYPE_COLOR_ALPHA = 6,

    COLORTYPE_TO_BPP_MAP = {
        0: 1,
        2: 3,
        3: 1,
        4: 2,
        6: 4
    },

    GAMMA_DIVISION = 100000
;

function clampByte(value)
{
    return stdMath.max(0, stdMath.min(255, stdMath.round(value)));
}
function paethPredictor(left, above, upLeft)
{
    var paeth = left + above - upLeft,
        pLeft = stdMath.abs(paeth - left),
        pAbove = stdMath.abs(paeth - above),
        pUpLeft = stdMath.abs(paeth - upLeft)
    ;

    if (pLeft <= pAbove && pLeft <= pUpLeft) return left;
    if (pAbove <= pUpLeft) return above;
    return upLeft;
}
function filterNone(pxData, pxPos, byteWidth, rawData, rawPos)
{
    pxData.copy(rawData, rawPos, pxPos, pxPos + byteWidth);
}
function filterSumNone(pxData, pxPos, byteWidth)
{
    var sum = 0, i, length = pxPos + byteWidth;
    for (i = pxPos; i < length; i++)
    {
        sum += stdMath.abs(pxData[i]);
    }
    return sum;
}
function filterSub(pxData, pxPos, byteWidth, rawData, rawPos, bpp)
{
    for (var x = 0; x < byteWidth; x++)
    {
        var left = x >= bpp ? pxData[pxPos + x - bpp] : 0,
            val = pxData[pxPos + x] - left
        ;
        rawData[rawPos + x] = ubyte(val);
    }
}
function filterSumSub(pxData, pxPos, byteWidth, bpp)
{
    var sum = 0, x;
    for (x = 0; x < byteWidth; x++)
    {
        var left = x >= bpp ? pxData[pxPos + x - bpp] : 0,
            val = pxData[pxPos + x] - left
        ;
        sum += stdMath.abs(val);
    }
    return sum;
}
function filterUp(pxData, pxPos, byteWidth, rawData, rawPos)
{
    for (var x = 0; x < byteWidth; x++)
    {
        var up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0,
            val = pxData[pxPos + x] - up
        ;
        rawData[rawPos + x] = ubyte(val);
    }
}
function filterSumUp(pxData, pxPos, byteWidth)
{
    var sum = 0, x, length = pxPos + byteWidth;
    for (x = pxPos; x < length; x++)
    {
        var up = pxPos > 0 ? pxData[x - byteWidth] : 0,
            val = pxData[x] - up
        ;
        sum += stdMath.abs(val);
    }
    return sum;
}
function filterAvg(pxData, pxPos, byteWidth, rawData, rawPos, bpp)
{
    for (var x = 0; x < byteWidth; x++)
    {
        var left = x >= bpp ? pxData[pxPos + x - bpp] : 0,
            up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0,
            val = pxData[pxPos + x] - ((left + up) >> 1)
        ;
        rawData[rawPos + x] = ubyte(val);
    }
}
function filterSumAvg(pxData, pxPos, byteWidth, bpp)
{
    var sum = 0, x;
    for (x = 0; x < byteWidth; x++)
    {
        var left = x >= bpp ? pxData[pxPos + x - bpp] : 0,
            up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0,
            val = pxData[pxPos + x] - ((left + up) >> 1)
        ;
        sum += stdMath.abs(val);
    }
    return sum;
}
function filterPaeth(pxData, pxPos, byteWidth, rawData, rawPos, bpp)
{
    for (var x = 0; x < byteWidth; x++)
    {
        var left = x >= bpp ? pxData[pxPos + x - bpp] : 0,
            up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0,
            upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0,
            val = pxData[pxPos + x] - paethPredictor(left, up, upleft)
        ;
        rawData[rawPos + x] = ubyte(val);
    }
}
function filterSumPaeth(pxData, pxPos, byteWidth, bpp)
{
    var sum = 0, x;
    for (x = 0; x < byteWidth; x++)
    {
        var left = x >= bpp ? pxData[pxPos + x - bpp] : 0,
            up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0,
            upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0,
            val = pxData[pxPos + x] - paethPredictor(left, up, upleft)
        ;
        sum += stdMath.abs(val);
    }
    return sum;
}

async function deflate(data, compressionLevel, chunkSize)
{
    var opts = {
        chunkSize: null == chunkSize ? 16*1024 : chunkSize,
    };
    if (null != compressionLevel) opts.level = compressionLevel;
    return await (new Promise(function(resolve) {
        require('zlib').deflate(data instanceof Buffer ? data : Buffer.from(data), opts, function(err, zdata) {
            resolve(err ? null : zdata);
        });
    }));
}
async function inflate(data, chunkSize)
{
    var opts = {
        chunkSize: null == chunkSize ? 16*1024 : chunkSize,
    };
    return await (new Promise(function(resolve) {
        require('zlib').inflate(data instanceof Buffer ? data : Buffer.from(data), opts, function(err, zdata) {
            resolve(err ? null : zdata);
        });
    }));
}

var crcTable = null;
function getCRCTable()
{
    if (null == crcTable)
    {
        crcTable = new Int32Array(256);
        var i, j, currentCrc;
        for (i=0; i<256; ++i)
        {
            currentCrc = i;
            for (j=0; j<8; ++j)
            {
                currentCrc = currentCrc & 1 ? (0xedb88320 ^ (currentCrc >>> 1)) : (currentCrc >>> 1);
            }
            crcTable[i] = currentCrc;
        }
    }
    return crcTable;
}
function crc32(buffer)
{
    var crcTable = getCRCTable(), crc = -1, i, l;
    for (i=0,l=buffer.length; i<l; ++i)
    {
        crc = crcTable[(crc ^ buffer[i]) & 255] ^ (crc >>> 8);
    }
    return crc ^ (-1);
}
function ubyte(value)
{
    return value & 255;
}
function I1(value, buffer = null, pos = 0)
{
    if (null == buffer) buffer = Buffer.alloc(1);
    if (null == pos) pos = 0;
    buffer[pos] = value & 255;
    return buffer;
}
function I4(value, buffer = null, pos = 0)
{
    if (null == buffer) buffer = Buffer.alloc(4);
    if (null == pos) pos = 0;
    buffer.writeUInt32BE(value & 0xffffffff, pos);
    return buffer;
}
function i4(value, buffer = null, pos = 0)
{
    if (null == buffer) buffer = Buffer.alloc(4);
    if (null == pos) pos = 0;
    buffer.writeInt32BE(value, pos);
    return buffer;
}

function PNGPacker(options)
{
    options = options || {};

    options.deflateChunkSize = stdMath.max(1024, parseInt(options.deflateChunkSize || 32 * 1024));
    options.deflateLevel = stdMath.min(9, stdMath.max(0, parseInt(options.deflateLevel != null ? options.deflateLevel : 9)));
    options.deflateStrategy = stdMath.min(3, stdMath.max(0, parseInt(options.deflateStrategy != null ? options.deflateStrategy : 3)));
    options.inputHasAlpha = !!(options.inputHasAlpha != null ? options.inputHasAlpha : true);
    options.bitDepth = 8//options.bitDepth || 8;
    options.colorType = stdMath.min(6, stdMath.max(0, parseInt(('number' === typeof options.colorType) ? options.colorType : COLORTYPE_COLOR_ALPHA)));

    if (options.colorType !== COLORTYPE_COLOR && options.colorType !== COLORTYPE_COLOR_ALPHA)
    {
        throw new Error('option color type:' + options.colorType + ' is not supported at present');
    }
    /*if (options.bitDepth !== 8)
    {
        throw new Error('option bit depth:' + options.bitDepth + ' is not supported at present');
    }*/
    this._options = options;
}
PNGPacker[PROTO] = {
    _options: null,

    constructor: PNGPacker,

    toPNG: async function(data, width, height) {
        var png = [], filteredData, compressedData, deflateOpts;

        // Signature
        png.push(Buffer.from(PNG_SIGNATURE));

        // Header
        png.push(this.packIHDR(width, height));

        // gAMA
        if (this._options.gamma) png.push(this.packGAMA(this._options.gamma));

        // filter data
        filteredData = this.filterData(Buffer.from(data), width, height);

        // compress data
        deflateOpts = this.getDeflateOptions();
        compressedData = await deflate(filteredData, deflateOpts.level, deflateOpts.chuckSize);
        filteredData = null;

        if (!compressedData || !compressedData.length)
            throw new Error('bad png - invalid compressed data response');

        // Data
        png.push(this.packIDAT(Buffer.from(compressedData)));
        compressedData = null;

        // End
        png.push(this.packIEND());

        return Buffer.concat(png);
    },

    getDeflateOptions: function() {
        return {
            chunkSize: this._options.deflateChunkSize,
            level: this._options.deflateLevel,
            strategy: this._options.deflateStrategy
        };
    },

    filterData: function(data, width, height) {
        // convert to correct format for filtering (e.g. right bpp and bit depth)
        // and filter pixel data
        return this._filter(this._bitPack(data, width, height), width, height);
    },

    packIHDR: function(width, height) {
        var buffer = Buffer.alloc(13);
        I4(width, buffer, 0);
        I4(height, buffer, 4);
        I1(this._options.bitDepth, buffer, 8);  // bit depth
        I1(this._options.colorType, buffer, 9); // colorType
        I1(0, buffer, 10); // compression
        I1(0, buffer, 11); // filter
        I1(0, buffer, 12); // interlace
        return this._packChunk(TYPE_IHDR, buffer);
    },

    packGAMA: function(gamma) {
        return this._packChunk(TYPE_gAMA, I4(stdMath.floor(parseFloat(gamma) * GAMMA_DIVISION)));
    },

    packIDAT: function(data) {
        return this._packChunk(TYPE_IDAT, data);
    },

    packIEND: function() {
        return this._packChunk(TYPE_IEND, null);
    },

    _bitPack: function(data, width, height) {
        var inputHasAlpha = this._options.inputHasAlpha,
            outHasAlpha = this._options.colorType === COLORTYPE_COLOR_ALPHA;
        if (inputHasAlpha && outHasAlpha)
        {
            return data;
        }
        if (!inputHasAlpha && !outHasAlpha)
        {
            return data;
        }

        var outBpp = outHasAlpha ? 4 : 3,
            outData = Buffer.alloc(width * height * outBpp),
            inBpp = inputHasAlpha ? 4 : 3,
            inIndex = 0,
            outIndex = 0,
            bgColor = this._options.bgColor || {},
            x, y, red, green, blue, alpha,
            bgRed, bgGreen, bgBlue
        ;

        bgRed = clampByte(bgColor.red != null ? bgColor.red : 255);
        bgGreen = clampByte(bgColor.green != null ? bgColor.green : 255);
        bgBlue = clampByte(bgColor.blue != null ? bgColor.blue : 255);

        for (y = 0; y < height; y++)
        {
            for (x = 0; x < width; x++)
            {
                red = data[inIndex];
                green = data[inIndex + 1];
                blue = data[inIndex + 2];

                if (inputHasAlpha)
                {
                    alpha = data[inIndex + 3];
                    if (!outHasAlpha)
                    {
                        alpha /= 255.0;
                        red = (1 - alpha) * bgRed + alpha * red;
                        green = (1 - alpha) * bgGreen + alpha * green;
                        blue = (1 - alpha) * bgBlue + alpha * blue;
                    }
                }
                else
                {
                    alpha = 255;
                }

                outData[outIndex] = clampByte(red);
                outData[outIndex + 1] = clampByte(green);
                outData[outIndex + 2] = clampByte(blue);
                if (outHasAlpha) outData[outIndex + 3] = clampByte(alpha);

                inIndex += inBpp;
                outIndex += outBpp;
            }
        }
        return outData;
    },

    _filter: function(pxData, width, height) {
        var filters = [
            filterNone,
            filterSub,
            filterUp,
            filterAvg,
            filterPaeth
        ];
        var filterSums = [
            filterSumNone,
            filterSumSub,
            filterSumUp,
            filterSumAvg,
            filterSumPaeth
        ];
        var filterTypes = [0]; // make it default

        /*if ((null == this._options.filterType) || (-1 === this._options.filterType))
        {
            filterTypes = [0, 1, 2, 3, 4];
        }
        else if ('number' === typeof this._options.filterType)
        {
            filterTypes = [this._options.filterType];
        }
        else
        {
            throw new Error('unrecognised filter types');
        }*/

        var bpp = COLORTYPE_TO_BPP_MAP[this._options.colorType],
            byteWidth = width * bpp,
            rawPos = 0, pxPos = 0,
            rawData = Buffer.alloc((byteWidth + 1) * height),
            sel = filterTypes[0],
            y, i, n = filterTypes.length, min, sum
        ;

        for (y = 0; y < height; y++)
        {
            if (n > 1)
            {
                // find best filter for this line (with lowest sum of values)
                min = Infinity;
                for (i=0; i<n; i++)
                {
                    sum = filterSums[filterTypes[i]](pxData, pxPos, byteWidth, bpp);
                    if (sum < min)
                    {
                        sel = filterTypes[i];
                        min = sum;
                    }
                }
            }

            rawData[rawPos] = sel;
            rawPos++;
            filters[sel](pxData, pxPos, byteWidth, rawData, rawPos, bpp);
            rawPos += byteWidth;
            pxPos += byteWidth;
        }
        return rawData;
    },

    _packChunk: function(type, data) {
        var length = data ? data.length : 0,
            buffer = Buffer.alloc(length + 12)
        ;
        I4(length, buffer, 0);
        I4(type, buffer, 4);
        if (data) data.copy(buffer, 8);
        i4(crc32(buffer.slice(4, buffer.length - 4)), buffer, buffer.length - 4);
        return buffer;
    }
};

async function read_png(buffer, metaData)
{
    var png = new PNG();
    png.readData(new Uint8Array(buffer));
    return {
        width: png.width,
        height: png.height,
        data: await png.decode()
    };
}

async function imagepng(type, img, width, height, metaData)
{
    metaData = metaData || {};
    if ('base64' === type)
    {
        if (isNode)
        {
            return 'data:image/png;base64,' + (await (new PNGPacker(metaData)).toPNG(img, width, height)).toString('base64');
        }
        else if (isBrowser)
        {
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d'), imgData;

            canvas.width = width;
            canvas.height = height;

            ctx.createImageData(width, height);
            imgData = ctx.getImageData(0, 0, width, height);
            imgData.data.set(img, 0);
            ctx.putImageData(imgData, 0, 0);

            return canvas.toDataURL('image/png');
        }
    }
    else
    {
        return await (new PNGPacker(metaData)).toPNG(img, width, height);
    }
    return '';
}

function detect_image_type(buffer)
{
    // https://en.wikipedia.org/wiki/List_of_file_signatures
    var data = new Uint8Array(buffer[buffer.subarray ? 'subarray' : 'slice'](0, 8)),
        byteAt = function(offset) {return offset < data.length ? data[offset] : 0;};
    if (0x89 === byteAt(0)
        && 0x50 === byteAt(1)
        && 0x4e === byteAt(2)
        && 0x47 === byteAt(3)
        && 0x0d === byteAt(4)
        && 0x0a === byteAt(5)
        && 0x1a === byteAt(6)
        && 0x0a === byteAt(7)
    ) return 'PNG';
    else if (0x47 === byteAt(0)
        && 0x49 === byteAt(1)
        && 0x46 === byteAt(2)
        && 0x38 === byteAt(3)
        && (0x37 === byteAt(4) || 0x39 === byteAt(4))
        && 0x61 === byteAt(5)
    ) return 'GIF';
    else if (0xff === byteAt(0)
        && 0xd8 === byteAt(1)
        /*&& 0xff === byteAt(2)
        && 0xdb === byteAt(3)*/
    ) return 'JPG';
    return 'NOT_SUPPORTED';
}
function base64_decode(b64str)
{
    if ('undefined' !== typeof Buffer)
    {
        return Buffer.from(b64str, 'base64');
    }
    else if ('function' === typeof atob)
    {
        var binaryString = atob(b64str),
            i, n = binaryString.length,
            bytes = new Uint8Array(n);
        for (i=0; i<n; ++i) bytes[i] = binaryString.charCodeAt(i);
        return bytes.buffer;
    }
}

function Image()
{
    var self = this, src = '', width = 0, height = 0, imageData = null, error, load;

    error = function(e) {
        if (!e instanceof Error) e = new Error(String(e));
        if (self.onerror) self.onerror(e);
        else throw e;
    };
    load = function load(buffer) {
        if (!buffer) return;
        var imgReader = Image.Reader[Image.detectImageType(buffer)];
        if (!imgReader) return error('Image file type is not supported!');
        imgReader(buffer)
        .then(function(imgData) {
            imageData = imgData;
            width = imgData.width;
            height = imgData.height;
            if (self.onload) self.onload();
        })
        .catch(error);
    };

    def(self, 'width', {
        get: function() {
            return width;
        },
        set: function(w) {
        }
    });
    def(self, 'height', {
        get: function() {
            return height;
        },
        set: function(h) {
        }
    });
    def(self, 'naturalWidth', {
        get: function() {
            return width;
        },
        set: function(w) {
        }
    });
    def(self, 'naturalHeight', {
        get: function() {
            return height;
        },
        set: function(h) {
        }
    });
    def(self, 'src', {
        get: function() {
            return src;
        },
        set: function(file) {
            /*if (isBrowser)
            {
                var im = new window.Image();
                im.onload = function() {
                    var canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d'), imgData;

                    canvas.width = im.width;
                    canvas.height = im.height;
                    imgData = ctx.drawImage(im, 0, 0);
                    imgData = ctx.getImageData(0, 0, im.width, im.height);

                    imageData = imgData;
                    width = imgData.width;
                    height = imgData.height;
                    if (self.onload) self.onload();
                };
                im.onerror = error;
                im.src = file;
            }
            else
            {*/
                if ((('undefined' !== typeof ArrayBuffer) && (file instanceof ArrayBuffer))
                    || (('undefined' !== typeof Buffer) && (file instanceof Buffer)))
                {
                    // buffer passed
                    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
                    // https://nodejs.org/api/buffer.html#class-buffer
                    load(src = file);
                }
                else if ((('undefined' !== typeof Blob) && (file instanceof Blob))
                    || (('undefined' !== typeof Buffer) && (Buffer.Blob) && (file instanceof Buffer.Blob)))
                {
                    // blob passed
                    // https://developer.mozilla.org/en-US/docs/Web/API/Blob
                    // https://nodejs.org/api/buffer.html#class-blob
                    (src = file).arrayBuffer().then(load).catch(error);
                }
                else if (('string' === typeof file) || (file instanceof String))
                {
                    if (/^data:image\/[a-z]+;base64,/.test(file))
                    {
                        // base64 encoded image
                        load(base64_decode((src = file).slice(file.indexOf(';base64,')+8)));
                    }
                    else if (isNode)
                    {
                        // file path of image
                        require('fs').readFile(src = file, function(err, buffer) {
                            if (err) error(err);
                            else load(buffer);
                        });
                    }
                }
                /*else
                {
                    error('Unsupported src property');
                }*/
            /*}*/
        }
    });
    self.getImageData = function() {
        return imageData;
    };
}
Image[PROTO] = {
    constructor: Image,
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    src: '',
    onload: null,
    onerror: null,
    getImageData: null
};
Image.Reader = {
    'NOT_SUPPORTED': null,
    'GIF': read_gif,
    'JPG': read_jpg,
    'PNG': read_png
};
Image.detectImageType = detect_image_type;

function CanvasLite(width, height)
{
    var self = this, imageData, rasterizer, reset;
    if (!(self instanceof CanvasLite)) return new CanvasLite(width, height);

    reset = function() {
        width = width || 0;
        height = height || 0;
        if (rasterizer) rasterizer.dispose();
        imageData = {
            width: width,
            height: height,
            data: new ImArray((width*height) << 2)
        };
        rasterizer = new Rasterizer(width, height, Rasterizer.setRGBATo(imageData));
    };

    def(self, 'width', {
        get: function() {
            return width;
        },
        set: function(w) {
            w = +w;
            if (!is_nan(w) && is_finite(w) && 0 <= w)
            {
                if (width !== w)
                {
                    width = w;
                    reset();
                }
            }
        }
    });
    def(self, 'height', {
        get: function() {
            return height;
        },
        set: function(h) {
            h = +h;
            if (!is_nan(h) && is_finite(h) && 0 <= h)
            {
                if (height !== h)
                {
                    height = h;
                    reset();
                }
            }
        }
    });
    self.getContext = function(type) {
        return rasterizer.getContext(type);
    };
    self.toDataURL = async function(type, encoderOptions) {
        // only PNG output format
        return await imagepng('base64', imageData.data, imageData.width, imageData.height/*, encoderOptions*/);
    };
    self.toBlob = function(cb) {
        if ('function' === typeof cb)
        {
            var blobClass = 'undefined' !== typeof Blob ? Blob : (('undefined' !== typeof Buffer) && Buffer.Blob ? Buffer.Blob : null);
            if (blobClass)
            {
                // only PNG output format
                imagepng('binary', imageData.data, imageData.width, imageData.height)
                .then(function(png) {
                    cb(new blobClass([png], {type:'image/png'}));
                })
                .catch(NOOP);
            }
        }
    };
    self.toPNG = async function() {
        // only PNG output format
        return await imagepng('binary', imageData.data, imageData.width, imageData.height/*, {deflateLevel: 0}*/);
    };
    reset();
}
CanvasLite[PROTO] = {
    constructor: CanvasLite,
    width: 0,
    height: 0,
    getContext: null,
    toDataURL: null,
    toBlob: null,
    toPNG: null
};
CanvasLite.VERSION = "1.0.1";
CanvasLite.Image = Image;
CanvasLite.RenderingContext2D = Rasterizer.RenderingContext2D;

// export it
return CanvasLite;
});
