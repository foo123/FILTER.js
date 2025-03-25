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
FILTER.Create({
    name: "PatchMatchFilter"

    ,_update: true
    ,hasMeta: true
    ,hasInputs: true

    // parameters
    ,iterations: 5
    ,patch: 11
    ,radius: 100
    ,alpha: 0.5
    ,gamma: 1.3
    ,confident: 1.5
    ,fromArea: null
    ,toArea: null
    ,pyramid: null//{iterations:1,diffThreshold:1,changedThreshold:0}
    ,op: "pixel"
    ,strict: false
    ,bidirectional: false
    ,returnMatch: false

    ,init: function() {
        var self = this;
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,dispose: function() {
        var self = this;
        self.fromArea = self.toArea = self.pyramid = null;
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
            if (null != params.gamma) self.gamma = +params.gamma;
            if (null != params.confident) self.confident = +params.confident;
            if (null != params.pyramid) self.pyramid = params.pyramid;
            if (null != params.op) self.op = params.op;
            if (null != params.strict) self.strict = params.strict;
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
        gamma: self.gamma,
        confident: self.confident,
        pyramid: toJSON(self.pyramid),
        op: self.op,
        strict: self.strict,
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
        self.gamma = params.gamma;
        self.confident = params.confident;
        self.pyramid = fromJSON(params.pyramid);
        self.op = params.op;
        self.strict = params.strict;
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
            input, metrics, dst, src, nnf, nnf2,
            im2, w2, h2, level, iter, iters, apply,
            Selection = FILTER.Util.Image.Selection,
            Pyramid = FILTER.Util.Image.Pyramid;
        self._update = false;
        self.hasMeta = true;
        if (self.returnMatch)
        {
            self.meta = {match:null};
        }
        else
        {
            self.meta = {metric:0};
        }
        if (fromArea && toArea)
        {
            input = fromArea.data ? self.input(fromArea.data) : [im, w, h];
            if (input)
            {
                im2 = input[0]; w2 = input[1]; h2 = input[2];
                if (im2 === im) im2 = copy(im2);
                metrics = {op:self.op, error:0, changed:0, threshold:0, gamma:self.gamma, confident:self.confident};
                if (self.pyramid)
                {
                    metrics.threshold = self.pyramid.diffThreshold || 0;
                    iters = self.pyramid.iterations || 0;
                    dst = (new Pyramid()).build(im, w, h, 4, self.patch, new Selection(im, w, h, 4, toArea));
                    src = (new Pyramid()).build(im2, w2, h2, 4, self.patch, new Selection(im2, w2, h2, 4, fromArea));
                    for (level=dst.levels.length-1; level>=0; --level)
                    {
                        nnf2 = nnf ? patchmatch(
                            nnf.scale(dst.levels[level].sel, src.levels[level].sel, 2),
                            null,
                            self.patch,
                            self.iterations,
                            self.alpha,
                            self.radius,
                            self.strict,
                            self.bidirectional
                        ) : patchmatch(
                            dst.levels[level].sel,
                            src.levels[level].sel,
                            self.patch,
                            self.iterations,
                            self.alpha,
                            self.radius,
                            self.strict,
                            self.bidirectional
                        );
                        if (nnf) nnf.dispose(true);
                        nnf = nnf2;
                        if (1 < iters && 0 < level)
                        {
                            for (iter=1; iter<iters; ++iter)
                            {
                                nnf.apply(true, metrics);
                                if (metrics.changed <= (self.pyramid.changedThreshold||0)) break;
                                patchmatch(
                                    nnf,
                                    null,
                                    self.iterations,
                                    self.alpha,
                                    self.radius,
                                    self.strict,
                                    self.bidirectional
                                );
                            }
                        }
                    }
                    if (self.returnMatch)
                    {
                        self.meta.match = nnf.field;
                    }
                    else
                    {
                        apply = true;
                        for (iter=1; iter<iters; ++iter)
                        {
                            nnf.apply(true, metrics);
                            if (metrics.changed <= (self.pyramid.changedThreshold||0))
                            {
                                apply = false;
                                break;
                            }
                            patchmatch(
                                nnf,
                                null,
                                self.iterations,
                                self.alpha,
                                self.radius,
                                self.strict,
                                self.bidirectional
                            );
                        }
                        if (apply) nnf.apply(true, metrics);
                        self.meta.metric = metrics.error;
                        self._update = true;
                    }
                    nnf.dispose(true);
                    dst.dispose(); src.dispose();
                }
                else
                {
                    nnf = patchmatch(
                        new Selection(im, w, h, 4, toArea),
                        new Selection(im2, w2, h2, 4, fromArea),
                        self.patch,
                        self.iterations,
                        self.alpha,
                        self.radius,
                        self.strict,
                        self.bidirectional
                    );
                    if (self.returnMatch)
                    {
                        self.meta.match = nnf.field;
                    }
                    else
                    {
                        nnf.apply(true, metrics);
                        self.meta.metric = metrics.error;
                        self._update = true;
                    }
                    nnf.dispose(true);
                }
            }
        }
        return im;
    }
});

function patchmatch(dst, src, patch, iterations, alpha, radius, strict, bidirectional)
{
    var nnf;
    if (dst instanceof patchmatch.NNF)
    {
        nnf = dst;
    }
    else
    {
        nnf = new patchmatch.NNF(dst, src, patch, strict);
        nnf.initialize(1); if (bidirectional) nnf.initialize(-1);
    }
    if (nnf.field ) nnf.randomize( 1).optimize(iterations, alpha, radius,  1);
    if (nnf.fieldr) nnf.randomize(-1).optimize(iterations, alpha, radius, -1);
    return nnf;
}
FILTER.Util.Filter.patchmatch = patchmatch;

function NNF(dst, src, patch, strict)
{
    var self = this, other;
    if (dst instanceof NNF)
    {
        other = dst;
        self.dst = other.dst;
        self.src = other.src;
        self.patch = other.patch;
        self.strict = other.strict;
        self.field = other.field ? other.field.map(function(f) {return f.slice();}) : other.field;
        self.fieldr = other.fieldr ? other.fieldr.map(function(f) {return f.slice();}) : other.fieldr;
    }
    else
    {
        self.dst = dst;
        self.src = src;
        self.patch = patch;
        self.strict = !!strict;
        self.field = self.fieldr = null;
    }
    if (self.dst)
    {
        self.dstImg = self.dst.data();
        self.dstImg.rect = self.dst.rect();
    }
    if (self.src)
    {
        self.srcImg = self.src.data();
        self.srcImg.rect = self.src.rect();
    }
}
NNF.prototype = {
    constructor: NNF,
    dst: null,
    src: null,
    dstImg: null,
    srcImg: null,
    patch: 5,
    strict: false,
    field: null,
    fieldr: null,
    dispose: function(complete) {
        var self = this;
        if (true === complete)
        {
            if (self.dst) self.dst.dispose();
            if (self.src) self.src.dispose();
        }
        self.dstImg = self.srcImg = null;
        self.dst = self.src = null;
        self.field = self.fieldr = null;
    },
    clone: function() {
        return new NNF(this);
    },
    scale: function(dst, src, scaleX, scaleY) {
        if (null == scaleY) scaleY = scaleX;
        var self = this, A, B,
            nX = stdMath.floor(scaleX),
            nY = stdMath.floor(scaleY),
            scaled = new NNF(dst, src, self.patch, self.strict);
        if (self.field ) scaled.initialize( 1);
        if (self.fieldr) scaled.initialize(-1);
        if (self.field && scaled.field && (0 < nX) && (0 < nY))
        {
            A = self.dst.points(); B = self.src.points();
            self.field.forEach(function(f, a) {
                var dx, dy, aa, bb, b = f[0], d = f[1],
                    ax = stdMath.floor(scaleX*A[a].x),
                    ay = stdMath.floor(scaleY*A[a].y),
                    bx = stdMath.floor(scaleX*B[b].x),
                    by = stdMath.floor(scaleY*B[b].y);
                bb = scaled.src.indexOf(bx + 0, by + 0);
                if (-1 !== bb)
                {
                    for (dy=0; dy<nY; ++dy)
                    {
                        for (dx=0; dx<nX; ++dx)
                        {
                            aa = scaled.dst.indexOf(ax + dx, ay + dy);
                            //bb = scaled.src.indexOf(bx + dx, by + dy);
                            if (-1 !== aa /*&& -1 !== bb*/) scaled.field[aa] = [bb, d];
                        }
                    }
                }
            });
            if (self.fieldr) self.fieldr.forEach(function(f, a) {
                var dx, dy, aa, bb, b = f[0], d = f[1],
                    ax = stdMath.floor(scaleX*B[a].x),
                    ay = stdMath.floor(scaleY*B[a].y),
                    bx = stdMath.floor(scaleX*A[b].x),
                    by = stdMath.floor(scaleY*A[b].y);
                bb = scaled.dst.indexOf(bx + 0, by + 0);
                if (-1 !== bb)
                {
                    for (dy=0; dy<nY; ++dy)
                    {
                        for (dx=0; dx<nX; ++dx)
                        {
                            aa = scaled.src.indexOf(ax + dx, ay + dy);
                            //bb = scaled.dst.indexOf(bx + dx, by + dy);
                            if (-1 !== aa /*&& -1 !== bb*/) scaled.fieldr[aa] = [bb, d];
                        }
                    }
                }
            });
        }
        return scaled;
    },
    dist: function(a, b, dir) {
        var self = this,
            AA = -1 === dir ? self.src : self.dst,
            BB = -1 === dir ? self.dst : self.src,
            dataA = -1 === dir ? self.srcImg : self.dstImg,
            dataB = -1 === dir ? self.dstImg : self.srcImg,
            patch = self.patch,
            strict = self.strict,
            p = patch >>> 1,
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
            gar, gag, gab, gbr, gbg, gbb,
            isRGBA = 4 === dataA.channels;

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
                if (isRGBA)
                {
                    i = (xa + yaw) << 2; j = (xb + ybw) << 2;
                    dr = imgA[i + 0] - imgB[j + 0];
                    dg = imgA[i + 1] - imgB[j + 1];
                    db = imgA[i + 2] - imgB[j + 2];
                    diff += (dr * dr + dg * dg + db * db) / 585225/*3*3*255*255*/;

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
                        diff += (dr * dr + dg * dg + db * db) / 585225/*3*3*255*255*/;
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
                        diff += (dr * dr + dg * dg + db * db) / 585225/*3*3*255*255*/;
                    }
                    else
                    {
                        diff += 1/3;
                    }
                }
                else
                {
                    i = (xa + yaw); j = (xb + ybw);
                    dr = imgA[i] - imgB[j];
                    diff += (dr * dr) / 195075/*3*255*255*/;

                    if (0 <= xa-1 && xa+1 < aw && 0 <= xb-1 && xb+1 < bw)
                    {
                        i1 = (xa-1 + yaw) << 2; i2 = (xa+1 + yaw) << 2;
                        gar = 128 + ((imgA[i2 + 0] - imgA[i1 + 0]) >> 1);

                        i1 = (xb-1 + ybw) << 2; i2 = (xb+1 + ybw) << 2;
                        gbr = 128 + ((imgB[i2 + 0] - imgB[i1 + 0]) >> 1);

                        dr = gar - gbr;
                        diff += (dr * dr) / 195075/*3*255*255*/;
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
                        diff += (dr * dr) / 195075/*3*255*255*/;
                    }
                    else
                    {
                        diff += 1/3;
                    }
                }
                ++completed;
            }
        }
        return (completed ? stdMath.min((diff+excluded)/(completed+excluded), 1) : 1);
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
        for (a=0; a<n; ++a) field[a] = [0, 1];
        return self;
    },
    randomize: function(dir) {
        if ((-1 === dir && !this.fieldr) || (-1 !== dir && !this.field)) return this;
        var self = this,
            field = -1 === dir ? self.fieldr : self.field,
            AA = -1 === dir ? self.src : self.dst,
            BB = -1 === dir ? self.dst : self.src,
            A = AA.points(), B = BB.points(),
            n = field.length, f, a, b, d,
            best = {b:0, d:1}, tries, maxtries = 3;
        for (a=0; a<n; ++a)
        {
            f = field[a];
            best.b = f[0];
            best.d = f[1];
            tries = 0;
            while (tries < maxtries)
            {
                ++tries;
                b = rand_int(0, B.length-1);
                d = self.dist(a, b, dir);
                if (d < best.d)
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
    propagation: function(a, is_odd, dir) {
        var self = this,
            field = -1 === dir ? self.fieldr : self.field,
            AA = -1 === dir ? self.src : self.dst,
            rectA = (-1 === dir ? self.srcImg : self.dstImg).rect,
            A = AA.points(), ap = A[a], x = ap.x, y = ap.y, i, j, f = field[a],
            left, up, down, right, current = f[1], b = f[0];
        if (is_odd)
        {
            i = AA.indexOf(stdMath.max(rectA.from.x, x-1), y);
            j = AA.indexOf(x, stdMath.max(rectA.from.y, y-1));
            left = -1 === i ? current : self.dist(a, field[i][0], dir);
            up = -1 === j ? current : self.dist(a, field[j][0], dir);
            if (left < current && left <= up)
            {
                b = field[i][0];
                current = left;
            }
            if (up < current && up <= left)
            {
                b = field[j][0];
                current = up;
            }
        }
        else
        {
            i = AA.indexOf(stdMath.min(x+1, rectA.to.x), y);
            j = AA.indexOf(x, stdMath.min(y+1, rectA.to.y));
            right = -1 === i ? current : self.dist(a, field[i][0], dir);
            down = -1 === j ? current : self.dist(a, field[j][0], dir);
            if (right < current && right <= down)
            {
                b = field[i][0];
                current = right;
            }
            if (down < current && down <= right)
            {
                b = field[j][0];
                current = down;
            }
        }
        f[0] = b; f[1] = current;
        return self;
    },
    random_search: function(a, alpha, radius, dir) {
        var self = this,
            field = -1 === dir ? self.fieldr : self.field,
            AA = -1 === dir ? self.src : self.dst,
            BB = -1 === dir ? self.dst : self.src,
            dataA = -1 === dir ? self.srcImg : self.dstImg,
            dataB = -1 === dir ? self.dstImg : self.srcImg,
            B = BB.points(), rectA = dataA.rect, rectB = dataB.rect,
            f = field[a], d = f[1], b = f[0],
            bp = B[b], bx = bp.x, by = bp.y,
            best = {b:b, d:d};
        while (radius >= 1)
        {
            b = BB.indexOf(
                clamp(bx + rand_int(-radius, radius), rectB.from.x, rectB.to.x),
                clamp(by + rand_int(-radius, radius), rectB.from.y, rectB.to.y)
            );
            if (-1 !== b)
            {
                d = b === best.b ? best.d : self.dist(a, b, dir);
                if (d < best.d) {best.b = b; best.d = d;}
                if (alpha >= 1) break;
            }
            radius *= alpha;
        }
        f[0] = best.b; f[1] = best.d;
        return self;
    },
    optimize: function(iterations, alpha, radius, dir) {
        if ((-1 === dir && !this.fieldr) || (-1 !== dir && !this.field)) return this;
        var self = this, n = (-1 === dir ? self.fieldr : self.field).length,
        rectB = (-1 === dir ? self.dstImg : self.srcImg).rect, i, a;
        radius = stdMath.min(radius, rectB.width/2, rectB.height/2);
        for (i=0; i<iterations; ++i)
        {
            if (i & 1)
            {
                for (a=0; a<n; ++a)
                {
                    self.propagation(a, true, dir).random_search(a, alpha, radius, dir);
                }
            }
            else
            {
                for (a=n-1; a>=0; --a)
                {
                    self.propagation(a, false, dir).random_search(a, alpha, radius, dir);
                }
            }
        }
        return self;
    },
    apply: function(apply, metrics) {
        if (!this.field) return this;
        var self = this,
            field = self.field, fieldr = self.fieldr,
            AA = self.dst, BB = self.src,
            dataA = self.dstImg, dataB = self.srcImg,
            patch = self.patch, p = patch >>> 1,
            pos = new A32U(patch*patch),
            weight = new A32F(patch*patch),
            output = new A32F(field.length * (4 === dataA.channels ? 4 : 2)),
            factor, op = metrics ? metrics.op : "pixel";

        if (-1 === ["pixel","patch","patch_nested"].indexOf(op)) op = "pixel";

        for (var i=0,l=output.length; i<l; ++i) output[i] = 0.0;
        //factor = compute_confidence(self, metrics ? metrics.confident : 1.5, stdMath.pow(metrics ? metrics.gamma : 1.3));

        if (field ) expectation(self, op, field,  fieldr, AA, dataA, BB, dataB, pos, weight, factor, output,  1);
        if (fieldr) expectation(self, op, fieldr, field,  BB, dataB, AA, dataA, pos, weight, factor, output, -1);
        maximization(self, arguments.length ? apply : true, output, (metrics ? metrics.threshold : 0)||0, metrics);

        return self;
    }
};
NNF.serialize = function(nnf) {
    return {
    dst: FILTER.Util.Image.Selection.serialize(nnf.dst),
    src: FILTER.Util.Image.Selection.serialize(nnf.src),
    patch: nnf.patch,
    strict: nnf.strict,
    field: nnf.field,
    fieldr: nnf.fieldr
    };
};
NNF.unserialize = function(dst, src, obj) {
    var nnf = new NNF(
    FILTER.Util.Image.Selection.unserialize(dst, obj.dst),
    FILTER.Util.Image.Selection.unserialize(src, obj.src),
    obj.patch,
    obj.strict
    );
    nnf.field = obj.field;
    nnf.fieldr = obj.fieldr;
    return nnf;
};
patchmatch.NNF = NNF;

function expectation(nnf, op, field, fieldr, AA, dataA, BB, dataB, pos, weight, factor, expected, dir)
{
    var n = field.length, cnt,
        patch = nnf.patch, p = patch >>> 1,
        A = AA.points(), B = BB.points(),
        imgA = dataA.data, imgB = dataB.data,
        widthA = dataA.width, heightA = dataA.height,
        widthB = dataB.width, heightB = dataB.height,
        a, b, d, i, f, ap, bp, dx, dy, ax, ay, bx, by;
    if ("pixel" === op)
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
                weight[0] = /*factor[b] **/ compute_similarity(d);
                accumulate_result(nnf, pos, weight, cnt, expected, b);
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
                weight[0] = /*factor[a] **/ compute_similarity(d);
                accumulate_result(nnf, pos, weight, cnt, expected, a);
            }
        }
    }
    else
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
                        if ("patch" === op)
                        {
                            if (-1 === AA.indexOf(ax, ay)) continue;
                            pos[cnt] = ax + ay*widthA;
                            weight[cnt] = /*factor[b] **/ compute_similarity(d);
                            ++cnt;
                        }
                        else // "patch_nested" === op
                        {
                            i = BB.indexOf(bx, by);
                            if (-1 === i) continue;
                            pos[cnt] = A[fieldr[i][0]].index;
                            weight[cnt] = /*factor[b] **/ compute_similarity(fieldr[i][1]);
                            ++cnt;
                        }
                    }
                }
                accumulate_result(nnf, pos, weight, cnt, expected, b);
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
                        if ("patch" === op)
                        {
                            if (-1 === BB.indexOf(bx, by)) continue;
                            pos[cnt] = bx + by*widthB;
                            weight[cnt] = /*factor[a] **/ compute_similarity(d);
                            ++cnt;
                        }
                        else // "patch_nested" === op
                        {
                            i = AA.indexOf(ax, ay);
                            if (-1 === i) continue;
                            pos[cnt] = B[field[i][0]].index;
                            weight[cnt] = /*factor[a] **/ compute_similarity(field[i][1]);
                            ++cnt;
                        }
                    }
                }
                accumulate_result(nnf, pos, weight, cnt, expected, a);
            }
        }
    }
}
function maximization(nnf, apply, expected, threshold, metrics)
{
    var field = nnf.field, n = field.length,
        A = nnf.dst.points(), B = nnf.src.points(),
        dataA = nnf.dstImg, imgA = dataA.data,
        i, ai, bi, dr, dg, db, sum, r, g, b,
        diff, nmse = 0, changed = 0;
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
                if (diff > threshold) changed++;
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
                if (diff > threshold) changed++;
                if (apply)
                {
                    imgA[ai + 0] = r;
                }
            }
        }
    }
    if (metrics)
    {
        metrics.changed = changed / n;
        metrics.error = nmse / n;
    }
}
function accumulate_result(nnf, pos, weight, cnt, output, outpos)
{
    var dataB = nnf.srcImg,
        imgB = dataB.data,
        r = 0.0, g = 0.0,
        b = 0.0, sum = 0.0,
        i, index, w;

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
}
var base = [1.0, 0.99, 0.96, 0.83, 0.38, 0.11, 0.02, 0.005, 0.0006, 0.0001, 0];
function compute_similarity(distance, mu, sigma)
{
    // 0 <= distance <= 1
    //return stdMath.exp(distance);
    //return stdMath.pow(0.337, stdMath.abs((distance - mu) / sigma));
    var t = distance, j = stdMath.floor(100*t), k = j+1,
        vj = j<11 ? base[j] : 0, vk = k<11 ? base[k] : 0;
    return vj + (100*t - j) * (vk - vj); //base[stdMath.round(distance * 10)];
}
function compute_confidence(nnf, confident_value, gamma)
{
    var field = nnf.field,
        A = nnf.dst.points(),
        n = field.length, mapA = {},
        width = nnf.dstImg.width,
        height = nnf.dstImg.height,
        i, j, ii, v, vals, ads,
        a = 1.0, b = 1.5,
        result = new A32F(n),
        x, y, lx, ty, rx, by,
        cs, cx, cy;
    vals = [0,0,0,0];
    ads = [b, a, b, a];
    for (i=0; i<n; ++i) mapA[A[i].index] = i;
    for (i=0; i<n; ++i)
    {
        x = A[i].x;
        y = A[i].y;
        lx = x - 1;
        ty = y - 1;
        rx = x + 1;
        cs = [[lx, ty], [x, ty], [rx, ty], [lx, y]];
        for (j=0; j<4; ++j)
        {
            cx = cs[j][0]; cy = cs[j][1];
            if (0 <= cx && cx < width && 0 <= cy && cy < height)
            {
                ii = mapA[(cx + cy * width)];
                v = null != ii ? (result[ii]||0) : 0;
                vals[j] = v + ads[j];
            }
            else
            {
                vals[j] = a;
            }
        }
        result[i] = stdMath.min.apply(stdMath, vals);
    }
    vals = [0,0,0,0,0];
    for (i=n-1; i>=0; --i)
    {
        x = A[i].x;
        y = A[i].y;
        lx = x - 1;
        by = y + 1;
        rx = x + 1;
        cs = [[lx, by], [x, by], [rx, by], [rx, y]];
        for (j=0; j<4; ++j)
        {
            cx = cs[j][0]; cy = cs[j][1];
            if (0 <= cx && cx < width && 0 <= cy && cy < height)
            {
                ii = mapA[(cx + cy * width)];
                v = null != ii ? (result[ii]||0) : 0;
                vals[j] = v + ads[j];
            }
            else
            {
                vals[j] = a;
            }
        }
        vals[4] = result[i];
        result[i] = stdMath.min.apply(stdMath, vals);
    }
    for (i=0; i<n; ++i)
    {
        result[i] = 0 == result[i] ? confident_value : stdMath.pow(gamma, result[i]);
    }
    return result;
}
/*function compute_statistics(nnf, stats)
{
    if (nnf.field)
    {
        if (!stats) stats = {mu:0, sigma:1};
        var field = nnf.field, n = field.length,
            a, b, d, sum, mu, sigma;
        sum = 0.0;
        for (a=0; a<n; ++a)
        {
            d = field[a][1];
            sum += d;
        }
        mu = sum / n;
        sum = 0.0;
        for (a=0; a<n; ++a)
        {
            d = field[a][1] - mu;
            sum += d * d;
        }
        sigma = stdMath.sqrt(sum / (n - 1));

        stats.mu = mu;
        stats.sigma = sigma;
    }
    return stats;
}*/
function rand_int(a, b)
{
    return stdMath.round(stdMath.random()*(b-a)+a);
}
}(FILTER);