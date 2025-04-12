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
// [PatchMatch: A Randomized Correspondence Algorithm for Structural Image Editing, Connelly Barnes, Eli Shechtman, Adam Finkelstein, Dan B Goldman 2009](https://gfx.cs.princeton.edu/pubs/Barnes_2009_PAR/patchmatch.pdf)
// [Space-Time Completion of Video, Yonatan Wexler, Eli Shechtman, Michal Irani 2007](https://www.cs.princeton.edu/courses/archive/fall16/cos526/papers/wexler07.pdf)
// [Video Inpainting of Complex Scenes, Alasdair Newson, Andrés Almansa, Matthieu Fradet, Yann Gousseau, Patrick Pérez 2015](https://arxiv.org/abs/1503.05528)
FILTER.Create({
    name: "PatchMatchFilter"

    ,_update: true
    ,hasMeta: true
    ,hasInputs: true

    // parameters
    ,patch: 5
    ,iterations: 5
    ,alpha: 0.5
    ,radius: 100
    ,threshold: 0
    ,delta: 0
    ,epsilon: 0
    ,ignore_excluded: false
    ,with_gradients: false
    ,with_texture: false
    ,with_distance_transform: false
    ,kernel: 0
    ,bidirectional: false
    ,evaluate: "block"
    ,repeat: 1
    ,multiscale: false
    ,layered: false
    ,fromSelection: null
    ,toSelection: null
    ,returnMatch: false

    ,init: function() {
        var self = this;
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,dispose: function() {
        var self = this;
        self.fromSelection = self.toSelection = null;
        self.$super('dispose');
        return self;
    }

    ,params: function(params) {
        var self = this;
        if (params)
        {
            if (null != params.patch) self.patch = +params.patch;
            if (null != params.iterations) self.iterations = +params.iterations;
            if (null != params.alpha) self.alpha = +params.alpha;
            if (null != params.radius) self.radius = +params.radius;
            if (null != params.threshold) self.threshold = +params.threshold;
            if (null != params.delta) self.delta = +params.delta;
            if (null != params.epsilon) self.epsilon = +params.epsilon;
            if (null != params.ignore_excluded) self.ignore_excluded = params.ignore_excluded;
            if (null != params.with_gradients) self.with_gradients = params.with_gradients;
            if (null != params.with_texture) self.with_texture = params.with_texture;
            if (null != params.with_distance_transform) self.with_distance_transform = params.with_distance_transform;
            if (null != params.kernel) self.kernel = params.kernel;
            if (null != params.bidirectional) self.bidirectional = params.bidirectional;
            if (null != params.evaluate) self.evaluate = params.evaluate;
            if (null != params.repeat) self.repeat = +params.repeat;
            if (null != params.multiscale) self.multiscale = params.multiscale;
            if (null != params.layered) self.layered = params.layered;
            if (null != params.fromSelection) self.fromSelection = params.fromSelection;
            if (null != params.toSelection) self.toSelection = params.toSelection;
            if (null != params.returnMatch) self.returnMatch = params.returnMatch;
        }
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
        patch: self.patch,
        iterations: self.iterations,
        alpha: self.alpha,
        radius: self.radius,
        threshold: self.threshold,
        delta: self.delta,
        epsilon: self.epsilon,
        ignore_excluded: self.ignore_excluded,
        with_gradients: self.with_gradients,
        with_texture: self.with_texture,
        with_distance_transform: self.with_distance_transform,
        kernel: self.kernel,
        bidirectional: self.bidirectional,
        evaluate: self.evaluate,
        repeat: self.repeat,
        multiscale: self.multiscale,
        layered: self.layered,
        fromSelection: toJSON(self.fromSelection),
        toSelection: toJSON(self.toSelection),
        returnMatch: self.returnMatch
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.patch = params.patch;
        self.iterations = params.iterations;
        self.alpha = params.alpha;
        self.radius = params.radius;
        self.threshold = params.threshold;
        self.delta = params.delta;
        self.epsilon = params.epsilon;
        self.ignore_excluded = params.ignore_excluded;
        self.with_gradients = params.with_gradients;
        self.with_texture = params.with_texture;
        self.with_distance_transform = params.with_distance_transform;
        self.kernel = params.kernel;
        self.bidirectional = params.bidirectional;
        self.evaluate = params.evaluate;
        self.repeat = params.repeat;
        self.multiscale = params.multiscale;
        self.layered = params.layered;
        self.fromSelection = fromJSON(params.fromSelection);
        self.toSelection = fromJSON(params.toSelection);
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

    ,apply: function(im_dst, w_dst, h_dst) {
        var self = this,
            fromSelection = self.fromSelection,
            toSelection = self.toSelection,
            patch = self.patch,
            iterations = self.iterations,
            alpha = self.alpha,
            radius = self.radius,
            ignore_excluded = self.ignore_excluded,
            with_gradients = self.with_gradients,
            with_texture = self.with_texture,
            with_distance_transform = self.with_distance_transform,
            kernel = self.kernel,
            multiscale = self.multiscale,
            layered = self.layered,
            repeats = self.repeat,
            delta = self.delta,
            eps = self.epsilon,
            bidirectional = self.bidirectional,
            returnMatch = self.returnMatch,
            meta, params, apply, level, repeat,
            source, im_src, w_src, h_src,
            nnf, nnf2x, dst, src,
            Selection = FILTER.Util.Image.Selection,
            Pyramid = FILTER.Util.Image.Pyramid;
        self._update = false;
        meta = returnMatch ? {match:null} : {metric:null};
        if (fromSelection && toSelection)
        {
            source = fromSelection.data ? self.input(fromSelection.data) : [im_dst, w_dst, h_dst];
            if (source)
            {
                im_src = source[0]; w_src = source[1]; h_src = source[2];
                if (im_src === im_dst) im_src = copy(im_src);
                params = {evaluate:self.evaluate, error:0, delta:0, threshold:self.threshold || 0};
                if (multiscale)
                {
                    dst = (new Pyramid(im_dst, w_dst, h_dst, 4, new Selection(im_dst, w_dst, h_dst, 4,   toSelection))).build(2*patch, false);
                    src = (new Pyramid(im_src, w_src, h_src, 4, new Selection(im_src, w_src, h_src, 4, fromSelection))).build(2*patch, true);
                    if (with_texture)
                    {
                        dst.levels[0].sel.attached.tex = NNF.computeTexture(dst.levels[0].sel, patch);
                        src.levels[0].sel.attached.tex = NNF.computeTexture(src.levels[0].sel, patch);
                        for (level=1; level<dst.levels.length; ++level)
                        {
                            dst.levels[level].sel.attached.tex = NNF.transferTexture(dst.levels[level-1].sel.attached.tex, dst.levels[level-1].sel, dst.levels[level].sel, 2);
                            src.levels[level].sel.attached.tex = NNF.transferTexture(src.levels[level-1].sel.attached.tex, src.levels[level-1].sel, src.levels[level].sel, 2);
                        }
                    }
                    for (level=dst.levels.length-1; level>=0; --level)
                    {
                        if (nnf)
                        {
                            nnf2x = nnf.scale(dst.levels[level].sel, src.levels[level].sel, 2);
                            nnf.dispose(true);
                            nnf = nnf2x;
                        }
                        else
                        {
                            nnf = patchmatch(
                                dst.levels[level].sel,
                                src.levels[level].sel,
                                patch,
                                iterations,
                                alpha,
                                radius,
                                ignore_excluded,
                                with_gradients || with_texture,
                                with_distance_transform,
                                kernel,
                                bidirectional,
                                layered
                            );
                        }
                        if (1 < repeats && 0 < level)
                        {
                            for (repeat=1; repeat<repeats; ++repeat)
                            {
                                nnf.apply(params);
                                if (params.delta <= delta || params.error <= eps)
                                {
                                    break;
                                }
                                nnf.optimization(iterations, alpha, radius);
                            }
                        }
                    }
                    apply = true;
                    for (repeat=1; repeat<repeats; ++repeat)
                    {
                        nnf.apply(params);
                        if (params.delta <= delta || params.error <= eps)
                        {
                            apply = false;
                            break;
                        }
                        nnf.optimization(iterations, alpha, radius);
                    }
                    if (returnMatch)
                    {
                        meta.match = nnf.getMatch();
                    }
                    else
                    {
                        if (apply) nnf.apply(params);
                        meta.metric = {delta:params.delta, error:params.error};
                        self._update = true;
                    }
                    nnf.dispose(true);
                    dst.dispose();
                    src.dispose();
                }
                else
                {
                    dst = new Selection(returnMatch ? copy(im_dst) : im_dst, w_dst, h_dst, 4,   toSelection);
                    src = new Selection(im_src, w_src, h_src, 4, fromSelection);
                    if (with_texture)
                    {
                        dst.attached.tex = NNF.computeTexture(dst, patch);
                        src.attached.tex = NNF.computeTexture(src, patch);
                    }
                    nnf = patchmatch(
                        dst, src,
                        patch,
                        iterations,
                        alpha,
                        radius,
                        ignore_excluded,
                        with_gradients || with_texture,
                        with_distance_transform,
                        kernel,
                        bidirectional,
                        layered
                    );
                    apply = true;
                    for (repeat=1; repeat<repeats; ++repeat)
                    {
                        nnf.apply(params);
                        if (params.delta <= delta || params.error <= eps)
                        {
                            apply = false;
                            break;
                        }
                        nnf.optimization(iterations, alpha, radius);
                    }
                    if (returnMatch)
                    {
                        meta.match = nnf.getMatch();
                    }
                    else
                    {
                        if (apply) nnf.apply(params);
                        meta.metric = {delta:params.delta, error:params.error};
                        self._update = true;
                    }
                    nnf.dispose(true);
                }
            }
        }
        self.hasMeta = true;
        self.meta = meta;
        return im_dst;
    }
});

function NNF(dst, src, patch, ignore_excluded, with_gradients, with_distance_transform, kernel)
{
    var self = this, other;
    if (dst instanceof NNF)
    {
        other = dst;
        self.dst = other.dst;
        self.src = other.src;
        self.patch = other.patch;
        self._ignore_excluded = other._ignore_excluded;
        self._with_gradients = other._with_gradients;
        self._with_distance_transform = other._with_distance_transform;
        self._kernel = other._kernel;
        self.field = other.field ? other.field.map(function(f) {return f.slice();}) : other.field;
        self.fieldr = other.fieldr ? other.fieldr.map(function(f) {return f.slice();}) : other.fieldr;
    }
    else
    {
        self.dst = dst;
        self.src = src;
        self.patch = patch;
        self._ignore_excluded = !!ignore_excluded;
        self._with_gradients = !!with_gradients;
        self._with_distance_transform = !!with_distance_transform;
        self._kernel = kernel;
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
    field: null,
    fieldr: null,
    patch: 5,
    _ignore_excluded: false,
    _with_gradients: false,
    _with_distance_transform: false,
    _kernel: 0,
    a: null,
    k: null,
    mu: 0.0,
    sigma: 1.0,
    q: 1.0,
    dispose: function(complete) {
        var self = this;
        if (true === complete)
        {
            if (self.dst) self.dst.dispose();
            if (self.src) self.src.dispose();
        }
        self.dstData = self.srcData = null;
        self.dst = self.src = null;
        self.field = self.fieldr = self.a = self.k = null;
    },
    getMatch: function() {
        var self = this, A = self.dst.points(), B = self.src.points();
        return (self.field||[]).map(function(f, a) {
            var b = f[0], d = f[1], ap = A[a], bp = B[b];
            return {src:{x:bp.x,y:bp.y}, dst:{x:ap.x,y:ap.y}, dist:d};
        });
    },
    clone: function() {
        return new NNF(this);
    },
    scale: function(dst, src, scaleX, scaleY) {
        if (null == scaleY) scaleY = scaleX;
        var self = this, A, B, AA, BB,
            scaled = new NNF(dst, src, self.patch, self._ignore_excluded, self._with_gradients, self._with_distance_transform, self._kernel);
        if (self.field ) scaled.initialize(+1).randomize(1, +1);
        if (self.fieldr) scaled.initialize(-1).randomize(1, -1);
        if (self.field && scaled.field)
        {
            A = self.dst.points();
            B = self.src.points();
            AA = scaled.dst.points();
            BB = scaled.src.points();
            scaled.field.forEach(function(f, aa) {
                var a, b, bb;
                a = self.dst.indexOf(stdMath.floor(AA[aa].x/scaleX), stdMath.floor(AA[aa].y/scaleY));
                if (-1 !== a)
                {
                    b = self.field[a][0];
                    bb = scaled.src.indexOf(stdMath.floor(B[b].x*scaleX), stdMath.floor(B[b].y*scaleY));
                    if (-1 !== bb) scaled.field[aa] = [bb, scaled.distance(aa, bb, +1)];
                    if (self.dst.attached.tex && scaled.dst.attached.tex)
                    {
                        scaled.dst.attached.tex[aa] = {gx:self.dst.attached.tex[a].gx, gy:self.dst.attached.tex[a].gy};
                    }
                }
            });
            if (scaled.fieldr) scaled.fieldr.forEach(function(f, bb) {
                var a, b, aa;
                b = self.src.indexOf(stdMath.floor(BB[bb].x/scaleX), stdMath.floor(BB[bb].y/scaleY));
                if (-1 !== b)
                {
                    a = self.fieldr[b][0];
                    aa = scaled.dst.indexOf(stdMath.floor(A[a].x*scaleX), stdMath.floor(A[a].y*scaleY));
                    if (-1 !== aa) scaled.fieldr[bb] = [aa, scaled.distance(bb, aa, -1)];
                    if (self.src.attached.tex && scaled.src.attached.tex)
                    {
                        scaled.src.attached.tex[bb] = {gx:self.src.attached.tex[b].gx, gy:self.src.attached.tex[b].gy};
                    }
                }
            });
        }
        return scaled;
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
    randomize: function(num_tries, dir) {
        if ((-1 === dir && !this.fieldr) || (-1 !== dir && !this.field)) return this;
        var self = this,
            field = -1 === dir ? self.fieldr : self.field,
            BB = -1 === dir ? self.dst : self.src,
            Blen = BB.points().length - 1,
            n = field.length,
            f, a, b, d, tries,
            best_b, best_d
        num_tries = num_tries || 1;
        for (a=0; a<n; ++a)
        {
            f = field[a];
            if (!f) field[a] = f = [0, 1.05];
            best_b = f[0];
            best_d = f[1];
            tries = 0;
            while (tries < num_tries)
            {
                ++tries;
                b = rand_int(0, Blen);
                d = self.distance(a, b, dir);
                if (num_tries < 2 || d < best_d)
                {
                    best_b = b;
                    best_d = d;
                }
            }
            f[0] = best_b;
            f[1] = best_d;
        }
        return self;
    },
    onionize: function(dir) {
        if ((-1 === dir && !this.fieldr) || (-1 !== dir && !this.field)) return this;
        var self = this,
            field = -1 === dir ? self.fieldr : self.field,
            AA = -1 === dir ? self.src : self.dst,
            BB = -1 === dir ? self.dst : self.src,
            texA = AA.attached.tex,
            AAc = AA, AAp = AAc.erode(3),
            AAb, pt, layer;
        if (AAp.empty()) return self.randomize(1, dir);
        while (!AAp.empty())
        {
            if (AAc.attached.tex) AAp.attached.tex = NNF.transferTexture(AAc.attached.tex, AAc, AAp);
            AAb = AAc.subtract(AAp);
            if (AAc.attached.tex) AAb.attached.tex = NNF.transferTexture(AAc.attached.tex, AAc, AAb);
            layer = (new NNF(AAb, BB, self.patch, self._ignore_excluded, self._with_gradients, true, 0)).initialize(+1).randomize(1,+1).optimize(10, 0.5, 20, +1).apply({evaluate:"block"});
            pt = AAb.points();
            layer.field.forEach(function(f, a) {
                var aa = AA.indexOf(pt[a].x, pt[a].y);
                field[aa] = [f[0], f[1]];
                if (texA) texA[aa] = {gx:AAb.attached.tex[a].gx, gy:AAb.attached.tex[a].gy};
            });
            layer.dispose();
            AAb.dispose();
            AAc = AAp;
            AAp = AAc.erode(3);
        }
        return self;
    },
    optimize: function(iterations, alpha, radius, dir) {
        if ((-1 === dir && !this.fieldr) || (-1 !== dir && !this.field)) return this;
        var self = this,
        field = -1 === dir ? self.fieldr : self.field,
        AA = -1 === dir ? self.src : self.dst, A = AA.points(),
        BB = -1 === dir ? self.dst : self.src, B = BB.points(),
        rectB = -1 === dir ? self.dstData : self.srcData,
        iter, i, n = field.length, start, step, f, d, r,
        a, b, ai, ap, ax, ay, bp, bx, by, best_b, best_d;
        radius = stdMath.min(radius, rectB.width, rectB.height);
        for (iter=1; iter<=iterations; ++iter)
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
    apply: function(params) {
        if (!this.field) return this;
        var self = this,
            field = self.field,
            fieldr = self.fieldr,
            size = self.patch*self.patch,
            output, dataA = self.dstData,
            pos = new A32U(size),
            weight = new A32F(size),
            op = params ? String(params.evaluate).toLowerCase() : "block";

        if (-1 === ["center","best","block"].indexOf(op)) op = "block";

        output = new A32F(field.length * (4 === dataA.channels ? 6 : 4));
        for (var i=0,l=output.length; i<l; ++i) output[i] = 0.0;
        if (!self.a || !self.k) self.preparation();

        if (fieldr)
        {
            self.statistics(-1).expectation(op, pos, weight, output, -1);
        }
        if (field )
        {
            self.statistics(+1).expectation(op, pos, weight, output, +1);
        }
        self.maximization(output, (params ? params.threshold : 0)||0, params);

        return self;
    },
    initialization: function() {
        var self = this;
        if (self.field ) self.initialize(+1);
        if (self.fieldr) self.initialize(-1);
        return self;
    },
    randomization: function(num_tries) {
        var self = this;
        if (self.field ) self.randomize(num_tries, +1);
        if (self.fieldr) self.randomize(num_tries, -1);
        return self;
    },
    onionization: function() {
        var self = this;
        if (self.field ) self.onionize(+1);
        if (self.fieldr) self.onionize(-1);
        return self;
    },
    optimization: function(iterations, alpha, radius) {
        var self = this;
        if (self.field ) self.optimize(iterations, alpha, radius, +1);
        if (self.fieldr) self.optimize(iterations, alpha, radius, -1);
        return self;
    },
    expectation: function(op, pos, weight, expected, dir) {
        var nnf = this,
            field = nnf.field,
            fieldr = nnf.fieldr,
            AA = nnf.dst,
            BB = nnf.src,
            dataA = nnf.dstData,
            dataB = nnf.srcData,
            A = AA.points(),
            B = BB.points(),
            widthA = dataA.width,
            heightA = dataA.height,
            widthB = dataB.width,
            heightB = dataB.height,
            n = -1 === dir ? fieldr.length : field.length,
            a, b, d, i, j, f, w,
            ap, bp, dx, dy,
            ax, ay, bx, by,
            cnt, p = nnf.patch >>> 1,
            alpha = nnf.a, k = nnf.k;
        if ("center" === op)
        {
            if (-1 === dir)
            {
                for (b=0; b<n; ++b)
                {
                    f = fieldr[b];
                    a = f[0];
                    d = f[1];
                    pos[0] = b;
                    weight[0] = alpha[a] * nnf.similarity(d);
                    cnt = 1;
                    nnf.accumulate(pos, weight, cnt, expected, a);
                }
            }
            else
            {
                for (a=0; a<n; ++a)
                {
                    f = field[a];
                    b = f[0];
                    d = f[1];
                    pos[0] = b;
                    weight[0] = alpha[a] * nnf.similarity(d);
                    cnt = 1;
                    nnf.accumulate(pos, weight, cnt, expected, a);
                }
            }
        }
        else if ("best" === op)
        {
            if (-1 === dir)
            {
                for (b=0; b<n; ++b)
                {
                    f = fieldr[b];
                    a = f[0];
                    d = f[1];
                    bp = B[b];
                    cnt = 1;
                    weight[0] = 0;
                    for (dy=-p; dy<=p; ++dy)
                    {
                        by = bp.y+dy;
                        if (0 > by || by >= heightB) continue;
                        for (dx=-p; dx<=p; ++dx)
                        {
                            bx = bp.x+dx;
                            if (0 > bx || bx >= widthB) continue;
                            j = BB.indexOf(bx, by);
                            if (-1 === j) continue;
                            ap = A[fieldr[j][0]];
                            ax = ap.x-dx; ay = ap.y-dy;
                            if (0 > ax || ax >= widthA || 0 > ay || ay >= heightA) continue;
                            i = AA.indexOf(ax, ay);
                            if (-1 === i) continue;
                            w = alpha[i] * k[p+dx]*k[p+dy] * nnf.similarity(fieldr[j][1]);
                            if (w > weight[0])
                            {
                                pos[0] = j;
                                weight[0] = w;
                            }
                        }
                    }
                    nnf.accumulate(pos, weight, cnt, expected, a);
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
                    cnt = 1;
                    weight[0] = 0;
                    for (dy=-p; dy<=p; ++dy)
                    {
                        ay = ap.y+dy;
                        if (0 > ay || ay >= heightA) continue;
                        for (dx=-p; dx<=p; ++dx)
                        {
                            ax = ap.x+dx;
                            if (0 > ax || ax >= widthA) continue;
                            i = AA.indexOf(ax, ay);
                            if (-1 === i) continue;
                            bp = B[field[i][0]];
                            bx = bp.x-dx; by = bp.y-dy;
                            if (0 > bx || bx >= widthB || 0 > by || by >= heightB) continue;
                            j = BB.indexOf(bx, by);
                            if (-1 === j) continue;
                            w = alpha[i] * k[p+dx]*k[p+dy] * nnf.similarity(field[i][1]);
                            if (w > weight[0])
                            {
                                pos[0] = j;
                                weight[0] = w;
                            }
                        }
                    }
                    nnf.accumulate(pos, weight, cnt, expected, a);
                }
            }
        }
        else // "block" === op
        {
            if (-1 === dir)
            {
                for (b=0; b<n; ++b)
                {
                    f = fieldr[b];
                    a = f[0];
                    d = f[1];
                    bp = B[b];
                    cnt = 0;
                    for (dy=-p; dy<=p; ++dy)
                    {
                        by = bp.y+dy;
                        if (0 > by || by >= heightB) continue;
                        for (dx=-p; dx<=p; ++dx)
                        {
                            bx = bp.x+dx;
                            if (0 > bx || bx >= widthB) continue;
                            j = BB.indexOf(bx, by);
                            if (-1 === j) continue;
                            ap = A[fieldr[j][0]];
                            ax = ap.x-dx; ay = ap.y-dy;
                            if (0 > ax || ax >= widthA || 0 > ay || ay >= heightA) continue;
                            i = AA.indexOf(ax, ay);
                            if (-1 === i) continue;
                            pos[cnt] = j;
                            weight[cnt] = alpha[i] * k[p+dx]*k[p+dy] * nnf.similarity(fieldr[j][1]);
                            ++cnt;
                        }
                    }
                    nnf.accumulate(pos, weight, cnt, expected, a);
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
                    cnt = 0;
                    for (dy=-p; dy<=p; ++dy)
                    {
                        ay = ap.y+dy;
                        if (0 > ay || ay >= heightA) continue;
                        for (dx=-p; dx<=p; ++dx)
                        {
                            ax = ap.x+dx;
                            if (0 > ax || ax >= widthA) continue;
                            i = AA.indexOf(ax, ay);
                            if (-1 === i) continue;
                            bp = B[field[i][0]];
                            bx = bp.x-dx; by = bp.y-dy;
                            if (0 > bx || bx >= widthB || 0 > by || by >= heightB) continue;
                            j = BB.indexOf(bx, by);
                            if (-1 === j) continue;
                            pos[cnt] = j;
                            weight[cnt] = alpha[i] * k[p+dx]*k[p+dy] * nnf.similarity(field[i][1]);
                            ++cnt;
                        }
                    }
                    nnf.accumulate(pos, weight, cnt, expected, a);
                }
            }
        }
        return nnf;
    },
    maximization: function(expected, threshold, metrics) {
        var nnf = this, field = nnf.field,
            A = nnf.dst.points(), n = field.length,
            dataA = nnf.dstData, imgA = dataA.data,
            texA = nnf.dst.attached.tex,
            i, ai, bi, dr, dg, db, sum, r, g, b,
            diff, nmse = 0, delta = 0;
        if (4 === dataA.channels)
        {
            for (i=0; i<n; ++i)
            {
                ai = A[i].index << 2;
                bi = i * 6;
                sum = expected[bi + 5];
                if (sum)
                {
                    r = clamp(stdMath.round(expected[bi + 0] / sum), 0, 255);
                    g = clamp(stdMath.round(expected[bi + 1] / sum), 0, 255);
                    b = clamp(stdMath.round(expected[bi + 2] / sum), 0, 255);
                    dr = imgA[ai + 0] - r;
                    dg = imgA[ai + 1] - g;
                    db = imgA[ai + 2] - b;
                    diff = (dr * dr + dg * dg + db * db) / 195075/*3*255*255*/;
                    nmse += diff;
                    if (diff > threshold) delta++;
                    imgA[ai + 0] = r;
                    imgA[ai + 1] = g;
                    imgA[ai + 2] = b;
                    if (texA)
                    {
                        texA[i].gx = expected[bi + 3] / sum;
                        texA[i].gy = expected[bi + 4] / sum;
                    }
                }
            }
        }
        else
        {
            for (i=0; i<n; ++i)
            {
                ai = A[i].index;
                bi = i * 4;
                sum = expected[bi + 3];
                if (sum)
                {
                    r = clamp(stdMath.round(expected[bi + 0] / sum), 0, 255);
                    dr = imgA[ai + 0] - r;
                    diff = (dr * dr) / 65025/*255*255*/;
                    nmse += diff;
                    if (diff > threshold) delta++;
                    imgA[ai + 0] = r;
                    if (texA)
                    {
                        texA[i].gx = expected[bi + 1] / sum;
                        texA[i].gy = expected[bi + 2] / sum;
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
    accumulate: function(pos, weight, cnt, output, outpos) {
        var nnf = this,
            B = nnf.src.points(),
            dataB = nnf.srcData,
            imgB = dataB.data,
            texB = nnf.src.attached.tex,
            r = 0.0, g = 0.0,
            b = 0.0, sum = 0.0,
            gx = 0.0, gy = 0.0,
            i, bi, index, w;

        if (4 === dataB.channels)
        {
            for (i=0; i<cnt; ++i)
            {
                w = weight[i];
                bi = pos[i];
                index = B[bi].index << 2;
                r += imgB[index + 0] * w;
                g += imgB[index + 1] * w;
                b += imgB[index + 2] * w;
                if (texB)
                {
                    gx += texB[bi].gx * w;
                    gy += texB[bi].gy * w;
                }
                sum += w;
            }
            outpos *= 6;
            output[outpos + 0] += r;
            output[outpos + 1] += g;
            output[outpos + 2] += b;
            output[outpos + 3] += gx;
            output[outpos + 4] += gy;
            output[outpos + 5] += sum;
        }
        else
        {
            for (i=0; i<cnt; ++i)
            {
                w = weight[i];
                bi = pos[i];
                index = B[bi].index;
                r += imgB[index] * w;
                if (texB)
                {
                    gx += texB[bi].gx * w;
                    gy += texB[bi].gy * w;
                }
                sum += w;
            }
            outpos *= 4;
            output[outpos + 0] += r;
            output[outpos + 1] += gx;
            output[outpos + 2] += gy;
            output[outpos + 3] += sum;
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
            factor, p = patch >>> 1,
            ssd = 0,
            completed = 0,
            excluded = 0,
            imgA = dataA.data,
            imgB = dataB.data,
            texA = AA.attached.tex,
            texB = BB.attached.tex,
            aw = dataA.width,
            ah = dataA.height,
            bw = dataB.width,
            bh = dataB.height,
            A = AA.points(),
            B = BB.points(),
            ax = A[a].x, ay = A[a].y,
            bx = B[b].x, by = B[b].y,
            ignore_excluded = self._ignore_excluded,
            with_gradients = self._with_gradients,
            has_textures = texA && texB,
            dx, dy, xa, ya, yaw, xb, yb, ybw,
            i, j, i1, i2, dr, dg, db, ta, tb,
            gar, gag, gab, gbr, gbg, gbb, dgx, dgy;

        if (4 === dataA.channels)
        {
            factor = with_gradients ? (has_textures ? 1950750/*10*3*255*255*/ : /*325125*//*5*255*255*/ 585225/*3*3*255*255*/) : 195075/*3*255*255*/;
            for (dy=-p; dy<=p; ++dy)
            {
                ya = ay+dy; yb = by+dy;
                if (0 > ya || 0 > yb || ya >= ah || yb >= bh) continue;
                if (ignore_excluded && (!AA.has(null, ya) || !BB.has(null, yb)))
                {
                    excluded += patch;
                    continue;
                }
                yaw = ya*aw; ybw = yb*bw;
                for (dx=-p; dx<=p; ++dx)
                {
                    xa = ax+dx; xb = bx+dx;
                    if (0 > xa || 0 > xb || xa >= aw || xb >= bw) continue;
                    if (ignore_excluded && (-1 === AA.indexOf(xa, ya) || -1 === BB.indexOf(xb, yb)))
                    {
                        excluded += 1;
                        continue;
                    }
                    i = (xa + yaw) << 2; j = (xb + ybw) << 2;
                    dr = imgA[i + 0] - imgB[j + 0];
                    dg = imgA[i + 1] - imgB[j + 1];
                    db = imgA[i + 2] - imgB[j + 2];
                    ssd += (dr * dr + dg * dg + db * db) / factor;

                    if (with_gradients)
                    {
                        if (has_textures)
                        {
                            ta = AA.indexOf(xa, ya);
                            tb = BB.indexOf(xb, yb);
                            if (-1 === ta || -1 === tb)
                            {
                                ssd += 9/10;
                            }
                            else
                            {

                                dgx = texA[ta].gx - texB[tb].gx;
                                dgy = texA[ta].gy - texB[tb].gy;
                                ssd += 9*(dgx * dgx + dgy * dgy)/20;
                            }
                        }
                        else
                        {
                            if (0 <= xa-1 && xa+1 < aw && 0 <= xb-1 && xb+1 < bw)
                            {
                                i1 = (xa-1 + yaw) << 2; i2 = (xa+1 + yaw) << 2;
                                gar = 128 + ((imgA[i2 + 0] - imgA[i1 + 0]) >> 1);
                                gag = 128 + ((imgA[i2 + 1] - imgA[i1 + 1]) >> 1);
                                gab = 128 + ((imgA[i2 + 2] - imgA[i1 + 2]) >> 1);
                                // intensity only
                                //gar = clamp(stdMath.round(0.2126*gar+0.7152*gag+0.0722*gab), 0, 255);
                                //gag = gab = 0;

                                i1 = (xb-1 + ybw) << 2; i2 = (xb+1 + ybw) << 2;
                                gbr = 128 + ((imgB[i2 + 0] - imgB[i1 + 0]) >> 1);
                                gbg = 128 + ((imgB[i2 + 1] - imgB[i1 + 1]) >> 1);
                                gbb = 128 + ((imgB[i2 + 2] - imgB[i1 + 2]) >> 1);
                                // intensity only
                                //gbr = clamp(stdMath.round(0.2126*gbr+0.7152*gbg+0.0722*gbb), 0, 255);
                                //gbg = gbb = 0;

                                dr = gar - gbr;
                                dg = gag - gbg;
                                db = gab - gbb;
                                ssd += (dr * dr + dg * dg + db * db) / factor;
                            }
                            else
                            {
                                ssd += 1/3;
                            }

                            if (0 <= ya-1 && ya+1 < ah && 0 <= yb-1 && yb+1 < bh)
                            {
                                i1 = (xa + (ya-1)*aw) << 2; i2 = (xa + (ya+1)*aw) << 2;
                                gar = 128 + ((imgA[i2 + 0] - imgA[i1 + 0]) >> 1);
                                gag = 128 + ((imgA[i2 + 1] - imgA[i1 + 1]) >> 1);
                                gab = 128 + ((imgA[i2 + 2] - imgA[i1 + 2]) >> 1);
                                // intensity only
                                //gar = clamp(stdMath.round(0.2126*gar+0.7152*gag+0.0722*gab), 0, 255);
                                //gag = gab = 0;

                                i1 = (xb + (yb-1)*bw) << 2; i2 = (xb + (yb+1)*bw) << 2;
                                gbr = 128 + ((imgB[i2 + 0] - imgB[i1 + 0]) >> 1);
                                gbg = 128 + ((imgB[i2 + 1] - imgB[i1 + 1]) >> 1);
                                gbb = 128 + ((imgB[i2 + 2] - imgB[i1 + 2]) >> 1);
                                // intensity only
                                //gbr = clamp(stdMath.round(0.2126*gbr+0.7152*gbg+0.0722*gbb), 0, 255);
                                //gbg = gbb = 0;

                                dr = gar - gbr;
                                dg = gag - gbg;
                                db = gab - gbb;
                                ssd += (dr * dr + dg * dg + db * db) / factor;
                            }
                            else
                            {
                                ssd += 1/3;
                            }
                        }
                    }
                    ++completed;
                }
            }
        }
        else
        {
            factor = with_gradients ? (has_textures ? 650250/*10*255*255*/ : 195075/*3*255*255*/) : 65025/*255*255*/;
            for (dy=-p; dy<=p; ++dy)
            {
                ya = ay+dy; yb = by+dy;
                if (0 > ya || 0 > yb || ya >= ah || yb >= bh) continue;
                if (ignore_excluded && (!AA.has(null, ya) || !BB.has(null, yb)))
                {
                    excluded += patch;
                    continue;
                }
                yaw = ya*aw; ybw = yb*bw;
                for (dx=-p; dx<=p; ++dx)
                {
                    xa = ax+dx; xb = bx+dx;
                    if (0 > xa || 0 > xb || xa >= aw || xb >= bw) continue;
                    if (ignore_excluded && (-1 === AA.indexOf(xa, ya) || -1 === BB.indexOf(xb, yb)))
                    {
                        excluded += 1;
                        continue;
                    }
                    i = (xa + yaw); j = (xb + ybw);
                    dr = imgA[i] - imgB[j];
                    ssd += (dr * dr) / factor;

                    if (with_gradients)
                    {
                        if (has_textures)
                        {
                            ta = AA.indexOf(xa, ya);
                            tb = BB.indexOf(xb, yb);
                            if (-1 === ta || -1 === tb)
                            {
                                ssd += 9/10;
                            }
                            else
                            {

                                dgx = texA[ta].gx - texB[tb].gx;
                                dgy = texA[ta].gy - texB[tb].gy;
                                ssd += 9*(dgx * dgx + dgy * dgy)/20;
                            }
                        }
                        else
                        {
                            if (0 <= xa-1 && xa+1 < aw && 0 <= xb-1 && xb+1 < bw)
                            {
                                i1 = (xa-1 + yaw) << 2; i2 = (xa+1 + yaw) << 2;
                                gar = 128 + ((imgA[i2 + 0] - imgA[i1 + 0]) >> 1);

                                i1 = (xb-1 + ybw) << 2; i2 = (xb+1 + ybw) << 2;
                                gbr = 128 + ((imgB[i2 + 0] - imgB[i1 + 0]) >> 1);

                                dr = gar - gbr;
                                ssd += (dr * dr) / factor;
                            }
                            else
                            {
                                ssd += 1/3;
                            }

                            if (0 <= ya-1 && ya+1 < ah && 0 <= yb-1 && yb+1 < bh)
                            {
                                i1 = (xa + (ya-1)*aw) << 2; i2 = (xa + (ya+1)*aw) << 2;
                                gar = 128 + ((imgA[i2 + 0] - imgA[i1 + 0]) >> 1);

                                i1 = (xb + (yb-1)*bw) << 2; i2 = (xb + (yb+1)*bw) << 2;
                                gbr = 128 + ((imgB[i2 + 0] - imgB[i1 + 0]) >> 1);

                                dr = gar - gbr;
                                ssd += (dr * dr) / factor;
                            }
                            else
                            {
                                ssd += 1/3;
                            }
                        }
                    }
                    ++completed;
                }
            }
        }
        return (completed ? (/*excluded ? 10 : */stdMath.min((ssd+excluded)/(completed+excluded), 1)) : 1);
    },
    similarity: function(distance) {
        // 0 <= distance <= 1
        var nnf = this;
        //return stdMath.pow(0.33373978049163078, stdMath.abs((distance - nnf.mu) / nnf.sigma));
        return stdMath.exp(-distance / (2*nnf.q));
        /*var base = [1.0, 0.99, 0.96, 0.83, 0.38, 0.11, 0.02, 0.005, 0.0006, 0.0001, 0];
        var t = distance, j = stdMath.floor(100*t), k = j+1, vj = j<11 ? base[j] : 0, vk = k<11 ? base[k] : 0;
        return vj + (100*t - j) * (vk - vj);*/
    },
    statistics: function(dir) {
        var nnf = this,
            field = -1 === dir ? nnf.fieldr : nnf.field,
            n, a, d, sum, mu, sigma, q1, q2, q3;
        if (field)
        {
            n = field.length;
            q2 = q3 = 0;
            q1 = field[0][1];
            //sum = q1;
            for (a=1; a<n; ++a)
            {
                d = field[a][1];
                //sum += d;
                if (d > q1)
                {
                    q3 = q2;
                    q2 = q1;
                    q1 = d;
                }
                else if (d > q2)
                {
                    q3 = q2;
                    q2 = d;
                }
                else if (d > q3)
                {
                    q3 = d;
                }
            }
            //mu = sum / n;
            /*sum = 0.0;
            for (a=0; a<n; ++a)
            {
                d = field[a][1] - mu;
                sum += d * d;
            }
            sigma = stdMath.sqrt(sum / (n - 1));*/

            nnf.mu = 0.0;//mu;
            nnf.sigma = 1.0;//sigma;
            nnf.q = (0.75*(q2+q3)/2) || 1e-3;
            //nnf.q = field.map(function(f) {return f[1];}).sort(function(a, b) {return a-b;})[stdMath.round(0.75*(n-1))] || 1e-3;
        }
        return nnf;
    },
    preparation: function() {
        var nnf = this, A = nnf.dst.points(),
            mapA = {}, n = A.length,
            width = nnf.dstData.width,
            height = nnf.dstData.height,
            res = new A32F(n),
            i, j, ii, v, vals,
            a = 1.0, b = 1.4,
            c = 1.5, gamma = 1.3,
            x, y, lx, ty, rx, by,
            ads, cs, cx, cy,
            p = nnf.patch >>> 1, w;

        nnf.k = new A32F(nnf.patch);
        if (nnf._kernel)
        {
            w = (true === nnf._kernel ? 1.0 : nnf._kernel) / (2*p*p);
            for (i=-p; i<=p; ++i)
            {
                nnf.k[p+i] = stdMath.exp(-w*i*i);
            }
        }
        else
        {
            for (i=-p; i<=p; ++i)
            {
                nnf.k[p+i] = 1.0;
            }
        }

        if (!nnf._with_distance_transform)
        {
            for (i=0; i<n; ++i)
            {
                res[i] = 1.0;
            }
        }
        else
        {
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
        }
        nnf.a = res;
        return nnf;
    }
};
NNF.serialize = function(nnf) {
    return {
    dst: FILTER.Util.Image.Selection.serialize(nnf.dst),
    src: FILTER.Util.Image.Selection.serialize(nnf.src),
    patch: nnf.patch,
    _ignore_excluded: nnf._ignore_excluded,
    _with_gradients: nnf._with_gradients,
    _with_distance_transform: nnf._with_distance_transform,
    _kernel: nnf._kernel,
    field: nnf.field,
    fieldr: nnf.fieldr
    };
};
NNF.unserialize = function(dst, src, obj) {
    var nnf = new NNF(
    FILTER.Util.Image.Selection.unserialize(dst, obj.dst),
    FILTER.Util.Image.Selection.unserialize(src, obj.src),
    obj.patch,
    obj._ignore_excluded,
    obj._with_gradients,
    obj._with_distance_transform,
    obj._kernel
    );
    nnf.field = obj.field;
    nnf.fieldr = obj.fieldr;
    return nnf;
};
NNF.computeTexture = function(selection, patch) {
    var p = patch >>> 1,
        data = selection.data(),
        w = data.width,
        h = data.height,
        img = data.data,
        isRGBA = 4 === data.channels,
        x, y, dx, dy, xx, yy,
        gx, gy, cx, cy, i, j, a, b,
        pts = selection.points(), l = pts.length,
        tex = new Array(l), pt;
    for (i=0; i<l; ++i)
    {
        pt = pts[i];
        x = pt.x; y = pt.y;
        gx = 0; gy = 0;
        cx = 0; cy = 0;
        for (dx=-p,dy=-p,j=0; j<patch; ++j,++dx)
        {
            if (dx > p) {dx=-p; ++dy;}
            xx = x+dx; yy = y+dy;
            if (
                (xx-1 >= 0) && (xx+1 < w) &&
                (yy >= 0) && (yy < h) &&
                (-1 !== selection.indexOf(xx-1, yy)) &&
                (-1 !== selection.indexOf(xx+1, yy))
            )
            {
                ++cx;
                a = xx-1 + yy*w; b = a+2;
                if (isRGBA)
                {
                    a = a << 2; b = b << 2;
                    gx += stdMath.abs(0.2126*(img[b+0] - img[a+0])+0.7152*(img[b+1] - img[a+1])+0.0722*(img[b+2] - img[a+2]))/255;
                }
                else
                {
                    gx += stdMath.abs(img[b] - img[a])/255;
                }
            }
            if (
                (xx >= 0) && (xx < w) &&
                (yy-1 >= 0) && (yy+1 < h) &&
                (-1 !== selection.indexOf(xx, yy-1)) &&
                (-1 !== selection.indexOf(xx, yy+1))
            )
            {
                ++cy;
                a = xx + (yy-1)*w; b = a+2*w;
                if (isRGBA)
                {
                    a = a << 2; b = b << 2;
                    gy += stdMath.abs(0.2126*(img[b+0] - img[a+0])+0.7152*(img[b+1] - img[a+1])+0.0722*(img[b+2] - img[a+2]))/255;
                }
                else
                {
                    gy += stdMath.abs(img[b] - img[a])/255;
                }
            }
        }
        tex[i] = {gx:cx?gx/cx:0, gy:cy?gy/cy:0};
    }
    return tex;
};
NNF.transferTexture = function(tex_a, a, b, scaleXforA, scaleYforA) {
    if (null == scaleXforA) scaleXforA = 1;
    if (null == scaleYforA) scaleYforA = scaleXforA;
    return b.points().map(function(pt) {
        var j = a.indexOf(stdMath.floor(scaleXforA*pt.x), stdMath.floor(scaleYforA*pt.y));
        return -1 === j ? {gx:0, gy:0} : {gx:tex_a[j].gx, gy:tex_a[j].gy};
    });
};
function patchmatch(dst, src, patch,
                    iterations, alpha, radius,
                    ignore_excluded, with_gradients,
                    with_distance_transform, kernel,
                    bidirectional, layered)
{
    var nnf = new patchmatch.NNF(dst, src, patch, ignore_excluded, with_gradients, with_distance_transform, kernel);
    nnf.initialize(+1); if (bidirectional) nnf.initialize(-1);
    if (layered) nnf.onionization();
    else nnf.randomization(2);
    nnf.optimization(iterations, alpha, radius);
    return nnf;
}
patchmatch.NNF = NNF;
patchmatch.NNF.patchmatch = patchmatch;
FILTER.Util.Filter.patchmatch = patchmatch;

function rand_int(a, b)
{
    return stdMath.round(stdMath.random()*(b-a)+a);
}
}(FILTER);