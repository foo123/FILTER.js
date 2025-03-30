/**
*
* PatchMatch Filter
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var stdMath = Math, INF = Infinity,
    A32U = FILTER.Array32U, A32F = FILTER.Array32F,
    copy = FILTER.Util.Array.copy,
    clamp = FILTER.Util.Math.clamp,
    toJSON = JSON.stringify,
    fromJSON = JSON.parse,
    TypedObj = FILTER.Util.Array.typed_obj;

// PatchMatch algorithm filter
// https://en.wikipedia.org/wiki/PatchMatch
// [PatchMatch: A Randomized Correspondence Algorithm for Structural Image Editing, Connelly Barnes, Eli Shechtman, Adam Finkelstein, Dan B Goldman, 2009](https://gfx.cs.princeton.edu/pubs/Barnes_2009_PAR/patchmatch.pdf)
// [Space-Time Completion of Video, Yonatan Wexler, Eli Shechtman, Michal Irani, 2007](https://www.cs.princeton.edu/courses/archive/fall16/cos526/papers/wexler07.pdf)
FILTER.Create({
    name: "PatchMatchFilter"

    ,_update: true
    ,hasMeta: true
    ,hasInputs: true

    // parameters
    ,iterations: 5
    ,patch: 5
    ,radius: 100
    ,alpha: 0.5
    ,multiscale: false
    ,repeat: 1
    ,threshold: 0
    ,delta: 0
    ,epsilon: 0
    ,evaluate: "block"
    ,strict: false
    ,gradients: false
    ,bidirectional: false
    ,fromArea: null
    ,toArea: null
    ,returnMatch: false

    ,init: function() {
        var self = this;
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,dispose: function() {
        var self = this;
        self.fromArea = self.toArea = null;
        self.$super('dispose');
        return self;
    }

    ,params: function(params) {
        var self = this;
        if (params)
        {
            if (null != params.iterations) self.iterations = +params.iterations;
            if (null != params.patch) self.patch = +params.patch;
            if (null != params.radius) self.radius = +params.radius;
            if (null != params.alpha) self.alpha = +params.alpha;
            if (null != params.multiscale) self.multiscale = params.multiscale;
            if (null != params.repeat) self.repeat = +params.repeat;
            if (null != params.threshold) self.threshold = +params.threshold;
            if (null != params.delta) self.delta = +params.delta;
            if (null != params.epsilon) self.epsilon = +params.epsilon;
            if (null != params.evaluate) self.evaluate = params.evaluate;
            if (null != params.strict) self.strict = params.strict;
            if (null != params.gradients) self.gradients = params.gradients;
            if (null != params.bidirectional) self.bidirectional = params.bidirectional;
            if (null != params.fromArea) self.fromArea = params.fromArea;
            if (null != params.toArea) self.toArea = params.toArea;
            if (null != params.returnMatch) self.returnMatch = params.returnMatch;
        }
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
        iterations: self.iterations,
        patch: self.patch,
        radius: self.radius,
        alpha: self.alpha,
        multiscale: self.multiscale,
        repeat: self.repeat,
        threshold: self.threshold,
        delta: self.delta,
        epsilon: self.epsilon,
        evaluate: self.evaluate,
        strict: self.strict,
        gradients: self.gradients,
        bidirectional: self.bidirectional,
        fromArea: toJSON(self.fromArea),
        toArea: toJSON(self.toArea),
        returnMatch: self.returnMatch
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.iterations = params.iterations;
        self.patch = params.patch;
        self.radius = params.radius;
        self.alpha = params.alpha;
        self.multiscale = params.multiscale;
        self.repeat = params.repeat;
        self.threshold = params.threshold;
        self.delta = params.delta;
        self.epsilon = params.epsilon;
        self.evaluate = params.evaluate;
        self.strict = params.strict;
        self.gradients = params.gradients;
        self.bidirectional = params.bidirectional;
        self.fromArea = fromJSON(params.fromArea);
        self.toArea = fromJSON(params.toArea);
        self.returnMatch = params.returnMatch;
        return self;
    }

    ,metaData: function(serialisation) {
        var self = this;
        if (serialisation && FILTER.isWorker)
        {
            return TypedObj(/*self.meta && self.meta.nnf ? {nnf:patchmatch.NNF.serialize(self.meta.nnf)} :*/ self.meta);
        }
        else
        {
            return self.meta;
        }
    }

    ,setMetaData: function(meta, serialisation) {
        var self = this;
        if (serialisation && ("string" === typeof meta))
        {
            self.meta = TypedObj(meta, 1);
            //if (self.meta.nnf) self.meta.nnf = patchmatch.NNF.unserialize(null, null, self.meta.nnf);
        }
        else
        {
            self.meta = meta;
        }
        return self;
    }

    ,apply: function(im, w, h) {
        var self = this,
            fromArea = self.fromArea,
            toArea = self.toArea,
            patch = self.patch,
            iterations = self.iterations,
            alpha = self.alpha,
            radius = self.radius,
            strict = self.strict,
            gradients = self.gradients,
            multiscale = self.multiscale,
            repeats = self.repeat,
            delta = self.delta,
            eps = self.epsilon,
            bidirectional = self.bidirectional,
            returnMatch = self.returnMatch,
            meta, input, params, apply,
            im2, w2, h2, level, repeat,
            nnf, nnf2x, dst, src,
            Selection = FILTER.Util.Image.Selection,
            Pyramid = FILTER.Util.Image.Pyramid;
        self._update = false;
        meta = returnMatch ? {match:null} : {metric:0};
        if (fromArea && toArea)
        {
            input = fromArea.data ? self.input(fromArea.data) : [im, w, h];
            if (input)
            {
                im2 = input[0]; w2 = input[1]; h2 = input[2];
                if (im2 === im) im2 = copy(im2);
                params = {evaluate:self.evaluate, error:0, delta:0, threshold:self.threshold || 0};
                if (multiscale)
                {
                    dst = (new Pyramid(im, w, h, 4, new Selection(im, w, h, 4, toArea))).build(patch, true);
                    src = (new Pyramid(im2, w2, h2, 4, new Selection(im2, w2, h2, 4, fromArea))).build(patch, true);
                    for (level=dst.levels.length-1; level>=0; --level)
                    {
                        nnf2x = patchmatch(
                            nnf
                            ? nnf.scale(dst.levels[level].sel, src.levels[level].sel, 2)
                            : dst.levels[level].sel,
                            nnf
                            ? null
                            : src.levels[level].sel,
                            patch,
                            iterations,
                            alpha,
                            radius,
                            strict,
                            gradients,
                            bidirectional
                        );
                        if (nnf) nnf.dispose(true);
                        nnf = nnf2x;
                        if (1 < repeats && 0 < level)
                        {
                            for (repeat=1; repeat<repeats; ++repeat)
                            {
                                nnf.apply(true, params);
                                if (params.delta <= delta || params.error <= eps)
                                {
                                    break;
                                }
                                patchmatch(
                                    nnf.reset(),
                                    null,
                                    iterations,
                                    alpha,
                                    radius
                                );
                            }
                        }
                    }
                    if (returnMatch)
                    {
                        meta.match = nnf.field;
                    }
                    else
                    {
                        apply = true;
                        for (repeat=1; repeat<repeats; ++repeat)
                        {
                            nnf.apply(true, params);
                            if (params.delta <= delta || params.error <= eps)
                            {
                                apply = false;
                                break;
                            }
                            patchmatch(
                                nnf.reset(),
                                null,
                                iterations,
                                alpha,
                                radius
                            );
                        }
                        if (apply) nnf.apply(true, params);
                        meta.metric = params.error;
                        self._update = true;
                    }
                    nnf.dispose(true);
                    dst.dispose();
                    src.dispose();
                }
                else
                {
                    nnf = patchmatch(
                        new Selection(im, w, h, 4, toArea),
                        new Selection(im2, w2, h2, 4, fromArea),
                        patch,
                        iterations,
                        alpha,
                        radius,
                        strict,
                        gradients,
                        bidirectional
                    );
                    if (returnMatch)
                    {
                        meta.match = nnf.field;
                    }
                    else
                    {
                        apply = true;
                        for (repeat=1; repeat<repeats; ++repeat)
                        {
                            nnf.apply(true, params);
                            if (params.delta <= delta || params.error <= eps)
                            {
                                apply = false;
                                break;
                            }
                            patchmatch(
                                nnf.reset(),
                                null,
                                iterations,
                                alpha,
                                radius
                            );
                        }
                        if (apply) nnf.apply(true, params);
                        meta.metric = params.error;
                        self._update = true;
                    }
                    nnf.dispose(true);
                }
            }
        }
        self.hasMeta = true;
        self.meta = meta;
        return im;
    }
});

function patchmatch(dst, src, patch, iterations, alpha, radius, strict, gradients, bidirectional)
{
    var nnf;
    if (dst instanceof patchmatch.NNF)
    {
        nnf = dst;
    }
    else
    {
        nnf = new patchmatch.NNF(dst, src, patch, strict, gradients);
        nnf.initialize(1); if (bidirectional) nnf.initialize(-1);
    }
    if (nnf.field ) nnf.randomize( 1).optimize(iterations, alpha, radius,  1);
    if (nnf.fieldr) nnf.randomize(-1).optimize(iterations, alpha, radius, -1);
    return nnf;
}
FILTER.Util.Filter.patchmatch = patchmatch;

function NNF(dst, src, patch, strict, gradients)
{
    var self = this, other;
    if (dst instanceof NNF)
    {
        other = dst;
        self.dst = other.dst;
        self.src = other.src;
        self.patch = other.patch;
        self.strict = other.strict;
        self.gradients = other.gradients;
        self.field = other.field ? other.field.map(function(f) {return f.slice();}) : other.field;
        self.fieldr = other.fieldr ? other.fieldr.map(function(f) {return f.slice();}) : other.fieldr;
    }
    else
    {
        self.dst = dst;
        self.src = src;
        self.patch = patch;
        self.strict = !!strict;
        self.gradients = !!gradients;
        self.field = self.fieldr = null;
    }
    if (self.dst)
    {
        self.dstData = self.dst.data();
        self.dstData.rect = self.dst.rect();
    }
    if (self.src)
    {
        self.srcData = self.src.data();
        self.srcData.rect = self.src.rect();
    }
}
NNF.prototype = {
    constructor: NNF,
    dst: null,
    src: null,
    dstData: null,
    srcData: null,
    patch: 3,
    strict: false,
    gradients: false,
    field: null,
    fieldr: null,
    alphai: null,
    mu: 0.0,
    sigma: 1.0,
    percentile: 0.0,
    dispose: function(complete) {
        var self = this;
        if (true === complete)
        {
            if (self.dst) self.dst.dispose();
            if (self.src) self.src.dispose();
        }
        self.dstData = self.srcData = null;
        self.dst = self.src = null;
        self.field = self.fieldr = self.alphai = null;
    },
    clone: function() {
        return new NNF(this);
    },
    scale: function(dst, src, scaleX, scaleY) {
        if (null == scaleY) scaleY = scaleX;
        var self = this, A, B,
            nX = stdMath.floor(scaleX),
            nY = stdMath.floor(scaleY),
            scaled = new NNF(dst, src, self.patch, self.strict, self.gradients);
        if (self.field ) scaled.initialize( 1);
        if (self.fieldr) scaled.initialize(-1);
        if (self.field && scaled.field && (0 < nX) && (0 < nY))
        {
            A = self.dst.points(); B = self.src.points();
            self.field.forEach(function(f, a) {
                var dx, dy, aa, bb, bb0, b = f[0], d = f[1],
                    ax = stdMath.floor(scaleX*A[a].x),
                    ay = stdMath.floor(scaleY*A[a].y),
                    bx = stdMath.floor(scaleX*B[b].x),
                    by = stdMath.floor(scaleY*B[b].y);
                bb0 = scaled.src.indexOf(bx + 0, by + 0);
                if (-1 !== bb0)
                {
                    for (dy=0; dy<nY; ++dy)
                    {
                        for (dx=0; dx<nX; ++dx)
                        {
                            aa = scaled.dst.indexOf(ax + dx, ay + dy);
                            bb = scaled.src.indexOf(bx + dx, by + dy);
                            if (-1 !== aa) scaled.field[aa] = [-1 !== bb ? bb : bb0, /*d*/scaled.distance(aa, -1 !== bb ? bb : bb0, 1)];
                        }
                    }
                }
            });
            if (self.fieldr) self.fieldr.forEach(function(f, a) {
                var dx, dy, aa, bb, bb0, b = f[0], d = f[1],
                    ax = stdMath.floor(scaleX*B[a].x),
                    ay = stdMath.floor(scaleY*B[a].y),
                    bx = stdMath.floor(scaleX*A[b].x),
                    by = stdMath.floor(scaleY*A[b].y);
                bb0 = scaled.dst.indexOf(bx + 0, by + 0);
                if (-1 !== bb0)
                {
                    for (dy=0; dy<nY; ++dy)
                    {
                        for (dx=0; dx<nX; ++dx)
                        {
                            aa = scaled.src.indexOf(ax + dx, ay + dy);
                            bb = scaled.dst.indexOf(bx + dx, by + dy);
                            if (-1 !== aa) scaled.fieldr[aa] = [-1 !== bb ? bb : bb0, /*d*/scaled.distance(aa, -1 !== bb ? bb : bb0, -1)];
                        }
                    }
                }
            });
        }
        return scaled;
    },
    reset: function() {
        var self = this;
        if (self.field ) self.initialize( 1);
        if (self.fieldr) self.initialize(-1);
        return self;
    },
    initialize: function(dir) {
        var self = this, field,
            AA = -1 ===dir ? self.src : self.dst,
            BB = -1 ===dir ? self.dst : self.src,
            A = AA.points(), B = BB.points(), n = A.length, a;
        if (!A.length || !B.length) {self.field = self.fieldr = null; return self;}
        if (-1 === dir)
        {
            if (!self.fieldr) self.fieldr = new Array(n);
            field = self.fieldr;
        }
        else
        {
            if (!self.field) self.field = new Array(n);
            field = self.field;
        }
        for (a=0; a<n; ++a) field[a] = [0, 1.05];
        return self;
    },
    randomize: function(dir) {
        if ((-1 === dir && !this.fieldr) || (-1 !== dir && !this.field)) return this;
        var self = this,
            field = -1 === dir ? self.fieldr : self.field,
            BB = -1 === dir ? self.dst : self.src, B = BB.points(),
            n = field.length, f, a, b, d, best = {b:0, d:1}, tries, maxtries = 2;
        for (a=0; a<n; ++a)
        {
            f = field[a];
            if (!f) field[a] = f = [0, 1.05];
            best.b = f[0];
            best.d = f[1];
            tries = 0;
            while (tries < maxtries)
            {
                ++tries;
                b = rand_int(0, B.length-1);
                d = self.distance(a, b, dir);
                if (maxtries < 2 || d < best.d)
                {
                    best.b = b;
                    best.d = d;
                }
            }
            f[0] = best.b;
            f[1] = best.d;
        }
        return self;
    },
    optimize: function(iterations, alpha, radius, dir) {
        if ((-1 === dir && !this.fieldr) || (-1 !== dir && !this.field)) return this;
        var self = this,
        field = -1 === dir ? self.fieldr : self.field,
        AA = -1 === dir ? self.src : self.dst, A = AA.points(),
        BB = -1 === dir ? self.dst : self.src, B = BB.points(),
        rectB = (-1 === dir ? self.dstData : self.srcData).rect,
        iter, i, n = field.length, start, step, f, d, r,
        a, b, ai, ap, ax, ay, bp, bx, by, best_b, best_d;
        radius = stdMath.min(radius, rectB.width, rectB.height);
        for (iter=0; iter<iterations; ++iter)
        {
            if (iter & 1)
            {
                start = n-1;
                step = -1;
            }
            else
            {
                start = 0;
                step = 1;
            }
            for (i=0,a=start; i<n; ++i,a+=step)
            {
                ap = A[a];
                ax = ap.x;
                ay = ap.y;
                f = field[a];
                best_b = f[0];
                best_d = f[1];

                // propagate
                ai = AA.indexOf(ax-step, ay);
                d = -1 === ai ? 2 : self.distance(a, field[ai][0], dir);
                if (d < best_d)
                {
                    best_b = field[ai][0];
                    best_d = d;
                }
                ai = AA.indexOf(ax, ay-step);
                d = -1 === ai ? 2 : self.distance(a, field[ai][0], dir);
                if (d < best_d)
                {
                    best_b = field[ai][0];
                    best_d = d;
                }

                // local random search
                bp = B[best_b];
                bx = bp.x;
                by = bp.y;
                r = radius;
                while (r >= 1)
                {
                    b = BB.indexOf(bx + rand_int(-r, r), by + rand_int(-r, r));
                    if (-1 !== b)
                    {
                        d = b === best_b ? best_d : self.distance(a, b, dir);
                        if (d < best_d) {best_b = b; best_d = d;}
                        if (alpha >= 1) break;
                    }
                    r *= alpha;
                }

                // update
                f[0] = best_b;
                f[1] = best_d;
            }
        }
        return self;
    },
    apply: function(apply, params) {
        if (!this.field) return this;
        var self = this,
            field = self.field, fieldr = self.fieldr,
            AA = self.dst, BB = self.src,
            size = self.patch*self.patch, output,
            dataA = self.dstData, dataB = self.srcData,
            pos = new A32U(size), weight = new A32F(size),
            op = params ? String(params.evaluate).toLowerCase() : "block";

        if (-1 === ["center","block"].indexOf(op)) op = "block";

        output = new A32F(field.length * (4 === dataA.channels ? 4 : 2));
        for (var i=0,l=output.length; i<l; ++i) output[i] = 0.0;
        if (!self.alphai) self.alphai = self.distance_transform();
        self.statistics();

        if (field ) self.expectation(op, field,  fieldr, AA, dataA, BB, dataB, pos, weight, output,  1);
        if (fieldr) self.expectation(op, fieldr, field,  BB, dataB, AA, dataA, pos, weight, output, -1);
        self.maximization(arguments.length ? apply : true, op, output, (params ? params.threshold : 0)||0, params);

        return self;
    },
    expectation: function(op, field, fieldr, AA, dataA, BB, dataB, pos, weight, expected, dir) {
        var nnf = this, n = field.length, alpha = nnf.alphai,
            A = AA.points(), B = BB.points(),
            widthA = dataA.width, heightA = dataA.height,
            widthB = dataB.width, heightB = dataB.height,
            a, b, d, i, f, ap, bp, dx, dy, ax, ay, bx, by,
            cnt, p = nnf.patch >>> 1;
        if ("center" === op)
        {
            if (-1 === dir)
            {
                for (a=0; a<n; ++a)
                {
                    f = field[a];
                    b = f[0];
                    d = f[1];
                    cnt = 1;
                    pos[0] = A[a].index;
                    weight[0] = alpha[b] * nnf.similarity(d);
                    nnf.accumulate(op, pos, weight, cnt, expected, b);
                }
            }
            else
            {
                for (a=0; a<n; ++a)
                {
                    f = field[a];
                    b = f[0];
                    d = f[1];
                    cnt = 1;
                    pos[0] = B[b].index;
                    weight[0] = alpha[a] * nnf.similarity(d);
                    nnf.accumulate(op, pos, weight, cnt, expected, a);
                }
            }
        }
        else // "block" === op
        {
            if (-1 === dir)
            {
                for (a=0; a<n; ++a)
                {
                    f = field[a];
                    b = f[0];
                    d = f[1];
                    ap = A[a];
                    bp = B[b];
                    cnt = 0;
                    for (dy=-p; dy<=p; ++dy)
                    {
                        ay = ap.y+dy; by = bp.y+dy;
                        if (0 > ay || ay >= heightA || 0 > by || by >= heightB) continue;
                        for (dx=-p; dx<=p; ++dx)
                        {
                            ax = ap.x+dx; bx = bp.x+dx;
                            if (0 > ax || ax >= widthA || 0 > bx || bx >= widthB) continue;
                            i = BB.indexOf(bx, by);
                            if (-1 === i) continue;
                            pos[cnt] = A[fieldr[i][0]].index;
                            weight[cnt] = alpha[b] * nnf.similarity(fieldr[i][1]);
                            ++cnt;
                        }
                    }
                    nnf.accumulate(op, pos, weight, cnt, expected, b);
                }
            }
            else
            {
                for (a=0; a<n; ++a)
                {
                    f = field[a];
                    b = f[0];
                    d = f[1];
                    ap = A[a];
                    bp = B[b];
                    cnt = 0;
                    for (dy=-p; dy<=p; ++dy)
                    {
                        ay = ap.y+dy; by = bp.y+dy;
                        if (0 > ay || ay >= heightA || 0 > by || by >= heightB) continue;
                        for (dx=-p; dx<=p; ++dx)
                        {
                            ax = ap.x+dx; bx = bp.x+dx;
                            if (0 > ax || ax >= widthA || 0 > bx || bx >= widthB) continue;
                            i = AA.indexOf(ax, ay);
                            if (-1 === i) continue;
                            pos[cnt] = B[field[i][0]].index;
                            weight[cnt] = alpha[a] * nnf.similarity(field[i][1]);
                            ++cnt;
                        }
                    }
                    nnf.accumulate(op, pos, weight, cnt, expected, a);
                }
            }
        }
        return nnf;
    },
    maximization: function(apply, op, expected, threshold, metrics) {
        var nnf = this, field = nnf.field, n = field.length,
            A = nnf.dst.points(), B = nnf.src.points(),
            dataA = nnf.dstData, imgA = dataA.data,
            i, ai, bi, dr, dg, db, sum, res, r, g, b,
            diff, nmse = 0, delta = 0;
        if (4 === dataA.channels)
        {
            for (i=0; i<n; ++i)
            {
                ai = A[i].index << 2;
                bi = i << 2;
                sum = expected[bi + 3];
                if (sum)
                {
                    r = clamp(stdMath.round(expected[bi+ 0] / sum), 0, 255);
                    g = clamp(stdMath.round(expected[bi+ 1] / sum), 0, 255);
                    b = clamp(stdMath.round(expected[bi+ 2] / sum), 0, 255);
                    dr = imgA[ai + 0] - r;
                    dg = imgA[ai + 1] - g;
                    db = imgA[ai + 2] - b;
                    diff = (dr * dr + dg * dg + db * db) / 195075/*3*255*255*/;
                    nmse += diff;
                    if (diff > threshold) delta++;
                    if (apply)
                    {
                        imgA[ai + 0] = r;
                        imgA[ai + 1] = g;
                        imgA[ai + 2] = b;
                    }
                }
            }
        }
        else
        {
            for (i=0; i<n; ++i)
            {
                ai = A[i].index;
                bi = i << 1;
                sum = expected[bi + 1];
                if (sum)
                {
                    r = clamp(stdMath.round(expected[bi + 0] / sum), 0, 255);
                    dr = imgA[ai + 0] - r;
                    diff = (dr * dr) / 65025/*255*255*/;
                    nmse += diff;
                    if (diff > threshold) delta++;
                    if (apply)
                    {
                        imgA[ai + 0] = r;
                    }
                }
            }
        }
        if (metrics)
        {
            metrics.delta = delta / n;
            metrics.error = nmse / n;
        }
        return nnf;
    },
    accumulate: function(op, pos, weight, cnt, output, outpos) {
        var nnf = this, dataB = nnf.srcData,
            imgB = dataB.data,
            r = 0.0, g = 0.0,
            b = 0.0, sum = 0.0,
            i, index, w, o;

        if (4 === dataB.channels)
        {
            for (i=0; i<cnt; ++i)
            {
                w = weight[i];
                index = pos[i] << 2;
                r += imgB[index + 0] * w;
                g += imgB[index + 1] * w;
                b += imgB[index + 2] * w;
                sum += w;
            }
            outpos <<= 2;
            output[outpos + 0] += r;
            output[outpos + 1] += g;
            output[outpos + 2] += b;
            output[outpos + 3] += sum;
        }
        else
        {
            for (i=0; i<cnt; ++i)
            {
                w = weight[i];
                index = pos[i];
                r += imgB[index] * w;
                sum += w;
            }
            outpos <<= 1;
            output[outpos + 0] += r;
            output[outpos + 1] += sum;
        }
        return nnf;
    },
    distance: function(a, b, dir) {
        var self = this,
            AA = -1 === dir ? self.src : self.dst,
            BB = -1 === dir ? self.dst : self.src,
            dataA = -1 === dir ? self.srcData : self.dstData,
            dataB = -1 === dir ? self.dstData : self.srcData,
            patch = self.patch,
            strict = self.strict,
            gradients = self.gradients,
            factor, p = patch >>> 1,
            diff = 0,
            completed = 0,
            excluded = 0,
            imgA = dataA.data,
            imgB = dataB.data,
            aw = dataA.width,
            ah = dataA.height,
            bw = dataB.width,
            bh = dataB.height,
            A = AA.points(),
            B = BB.points(),
            ax = A[a].x, ay = A[a].y,
            bx = B[b].x, by = B[b].y,
            dx, dy, xa, ya, yaw, xb, yb, ybw,
            i, j, i1, i2, dr, dg, db,
            gar, gag, gab, gbr, gbg, gbb;

        if (4 === dataA.channels)
        {
            factor = gradients ? 585225/*3*3*255*255*/ : 195075/*3*255*255*/;
            for (dy=-p; dy<=p; ++dy)
            {
                ya = ay+dy; yb = by+dy;
                if (0 > ya || 0 > yb || ya >= ah || yb >= bh) continue;
                if (strict && (!AA.has(null, ya) || !BB.has(null, yb)))
                {
                    excluded += patch;
                    continue;
                }
                yaw = ya*aw; ybw = yb*bw;
                for (dx=-p; dx<=p; ++dx)
                {
                    xa = ax+dx; xb = bx+dx;
                    if (0 > xa || 0 > xb || xa >= aw || xb >= bw) continue;
                    if (strict && (!AA.has(xa, null) || !BB.has(xb, null)))
                    {
                        excluded += 1;
                        continue;
                    }
                    i = (xa + yaw) << 2; j = (xb + ybw) << 2;
                    dr = imgA[i + 0] - imgB[j + 0];
                    dg = imgA[i + 1] - imgB[j + 1];
                    db = imgA[i + 2] - imgB[j + 2];
                    diff += (dr * dr + dg * dg + db * db) / factor;

                    if (gradients)
                    {
                        if (0 <= xa-1 && xa+1 < aw && 0 <= xb-1 && xb+1 < bw)
                        {
                            i1 = (xa-1 + yaw) << 2; i2 = (xa+1 + yaw) << 2;
                            gar = 128 + ((imgA[i2 + 0] - imgA[i1 + 0]) >> 1);
                            gag = 128 + ((imgA[i2 + 1] - imgA[i1 + 1]) >> 1);
                            gab = 128 + ((imgA[i2 + 2] - imgA[i1 + 2]) >> 1);

                            i1 = (xb-1 + ybw) << 2; i2 = (xb+1 + ybw) << 2;
                            gbr = 128 + ((imgB[i2 + 0] - imgB[i1 + 0]) >> 1);
                            gbg = 128 + ((imgB[i2 + 1] - imgB[i1 + 1]) >> 1);
                            gbb = 128 + ((imgB[i2 + 2] - imgB[i1 + 2]) >> 1);

                            dr = gar - gbr;
                            dg = gag - gbg;
                            db = gab - gbb;
                            diff += (dr * dr + dg * dg + db * db) / factor;
                        }
                        else
                        {
                            diff += 1/3;
                        }

                        if (0 <= ya-1 && ya+1 < ah && 0 <= yb-1 && yb+1 < bh)
                        {
                            i1 = (xa + (ya-1)*aw) << 2; i2 = (xa + (ya+1)*aw) << 2;
                            gar = 128 + ((imgA[i2 + 0] - imgA[i1 + 0]) >> 1);
                            gag = 128 + ((imgA[i2 + 1] - imgA[i1 + 1]) >> 1);
                            gab = 128 + ((imgA[i2 + 2] - imgA[i1 + 2]) >> 1);

                            i1 = (xb + (yb-1)*bw) << 2; i2 = (xb + (yb+1)*bw) << 2;
                            gbr = 128 + ((imgB[i2 + 0] - imgB[i1 + 0]) >> 1);
                            gbg = 128 + ((imgB[i2 + 1] - imgB[i1 + 1]) >> 1);
                            gbb = 128 + ((imgB[i2 + 2] - imgB[i1 + 2]) >> 1);

                            dr = gar - gbr;
                            dg = gag - gbg;
                            db = gab - gbb;
                            diff += (dr * dr + dg * dg + db * db) / factor;
                        }
                        else
                        {
                            diff += 1/3;
                        }
                    }
                    ++completed;
                }
            }
        }
        else
        {
            factor = gradients ? 195075/*3*255*255*/ : 65025/*255*255*/;
            for (dy=-p; dy<=p; ++dy)
            {
                ya = ay+dy; yb = by+dy;
                if (0 > ya || 0 > yb || ya >= ah || yb >= bh) continue;
                if (strict && (!AA.has(null, ya) || !BB.has(null, yb)))
                {
                    excluded += patch;
                    continue;
                }
                yaw = ya*aw; ybw = yb*bw;
                for (dx=-p; dx<=p; ++dx)
                {
                    xa = ax+dx; xb = bx+dx;
                    if (0 > xa || 0 > xb || xa >= aw || xb >= bw) continue;
                    if (strict && (!AA.has(xa, null) || !BB.has(xb, null)))
                    {
                        excluded += 1;
                        continue;
                    }
                    i = (xa + yaw); j = (xb + ybw);
                    dr = imgA[i] - imgB[j];
                    diff += (dr * dr) / factor;

                    if (gradients)
                    {
                        if (0 <= xa-1 && xa+1 < aw && 0 <= xb-1 && xb+1 < bw)
                        {
                            i1 = (xa-1 + yaw) << 2; i2 = (xa+1 + yaw) << 2;
                            gar = 128 + ((imgA[i2 + 0] - imgA[i1 + 0]) >> 1);

                            i1 = (xb-1 + ybw) << 2; i2 = (xb+1 + ybw) << 2;
                            gbr = 128 + ((imgB[i2 + 0] - imgB[i1 + 0]) >> 1);

                            dr = gar - gbr;
                            diff += (dr * dr) / factor;
                        }
                        else
                        {
                            diff += 1/3;
                        }

                        if (0 <= ya-1 && ya+1 < ah && 0 <= yb-1 && yb+1 < bh)
                        {
                            i1 = (xa + (ya-1)*aw) << 2; i2 = (xa + (ya+1)*aw) << 2;
                            gar = 128 + ((imgA[i2 + 0] - imgA[i1 + 0]) >> 1);

                            i1 = (xb + (yb-1)*bw) << 2; i2 = (xb + (yb+1)*bw) << 2;
                            gbr = 128 + ((imgB[i2 + 0] - imgB[i1 + 0]) >> 1);

                            dr = gar - gbr;
                            diff += (dr * dr) / factor;
                        }
                        else
                        {
                            diff += 1/3;
                        }
                    }
                    ++completed;
                }
            }
        }
        return (completed ? stdMath.min((diff+excluded)/(completed+excluded), 1) : 1);
    },
    similarity: function(distance) {
        // 0 <= distance <= 1
        var nnf = this;
        return stdMath.exp(-distance / (2*nnf.percentile));
        //return stdMath.pow(0.33373978049163078, stdMath.abs((distance - nnf.mu) / nnf.sigma));
        /*var base = [1.0, 0.99, 0.96, 0.83, 0.38, 0.11, 0.02, 0.005, 0.0006, 0.0001, 0];
        var t = distance, j = stdMath.floor(100*t), k = j+1, vj = j<11 ? base[j] : 0, vk = k<11 ? base[k] : 0;
        return vj + (100*t - j) * (vk - vj);*/
    },
    statistics: function() {
        var nnf = this;
        if (nnf.field)
        {
            var field = nnf.field, n = field.length,
                a, b, d, sum, mu, sigma,
                percentile75, dist = new Array(n);
            sum = 0.0;
            for (a=0; a<n; ++a)
            {
                d = field[a][1];
                sum += d;
                dist[a] = d;
            }
            mu = sum / n;
            sum = 0.0;
            for (a=0; a<n; ++a)
            {
                d = field[a][1] - mu;
                sum += d * d;
            }
            sigma = stdMath.sqrt(sum / (n - 1));

            percentile75 = dist.sort(function(a, b) {return a-b;})[stdMath.round(0.75*(n-1))];

            nnf.mu = mu;
            nnf.sigma = sigma;
            nnf.percentile = percentile75;
        }
        return nnf;
    },
    distance_transform: function() {
        var nnf = this, A = nnf.dst.points(),
            mapA = {}, n = A.length,
            width = nnf.dstData.width,
            height = nnf.dstData.height,
            res = new A32F(n),
            i, j, ii, v, vals,
            a = 1.0, b = 1.4,
            c = 1.5, gamma = 1.3,
            x, y, lx, ty, rx, by,
            ads, cs, cx, cy;
        vals = [0,0,0,0];
        ads = [b, a, b, a];
        cs = [null,null,null,null];
        for (i=0; i<n; ++i) mapA[A[i].index] = i;
        for (i=0; i<n; ++i)
        {
            x = A[i].x;
            y = A[i].y;
            lx = x - 1;
            ty = y - 1;
            rx = x + 1;
            cs[0] = [lx, ty];
            cs[1] = [x, ty];
            cs[2] = [rx, ty];
            cs[3] = [lx, y];
            for (j=0; j<4; ++j)
            {
                cx = cs[j][0]; cy = cs[j][1];
                if (0 <= cx && cx < width && 0 <= cy && cy < height)
                {
                    ii = mapA[(cx + cy * width)];
                    v = null != ii ? (res[ii]||0) : 0;
                    vals[j] = v + ads[j];
                }
                else
                {
                    vals[j] = a;
                }
            }
            res[i] = stdMath.min.apply(stdMath, vals);
        }
        vals = [0,0,0,0,0];
        for (i=n-1; i>=0; --i)
        {
            x = A[i].x;
            y = A[i].y;
            lx = x - 1;
            by = y + 1;
            rx = x + 1;
            cs[0] = [lx, by];
            cs[1] = [x, by];
            cs[2] = [rx, by];
            cs[3] = [rx, y];
            for (j=0; j<4; ++j)
            {
                cx = cs[j][0]; cy = cs[j][1];
                if (0 <= cx && cx < width && 0 <= cy && cy < height)
                {
                    ii = mapA[(cx + cy * width)];
                    v = null != ii ? (res[ii]||0) : 0;
                    vals[j] = v + ads[j];
                }
                else
                {
                    vals[j] = a;
                }
            }
            vals[4] = res[i];
            res[i] = stdMath.min.apply(stdMath, vals);
        }
        for (i=0; i<n; ++i)
        {
            res[i] = 0 == res[i] ? c : stdMath.pow(gamma, -res[i]);
        }
        return res;
    }
};
NNF.serialize = function(nnf) {
    return {
    dst: FILTER.Util.Image.Selection.serialize(nnf.dst),
    src: FILTER.Util.Image.Selection.serialize(nnf.src),
    patch: nnf.patch,
    strict: nnf.strict,
    gradients: nnf.gradients,
    field: nnf.field,
    fieldr: nnf.fieldr
    };
};
NNF.unserialize = function(dst, src, obj) {
    var nnf = new NNF(
    FILTER.Util.Image.Selection.unserialize(dst, obj.dst),
    FILTER.Util.Image.Selection.unserialize(src, obj.src),
    obj.patch,
    obj.strict,
    obj.gradients
    );
    nnf.field = obj.field;
    nnf.fieldr = obj.fieldr;
    return nnf;
};
patchmatch.NNF = NNF;

function rand_int(a, b)
{
    return stdMath.round(stdMath.random()*(b-a)+a);
}
}(FILTER);