/**
*
* PatchMatch Filter
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var stdMath = Math, INF = Infinity,
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
    ,fromArea: null
    ,toArea: null
    ,pyramid: null//{iterations:1,diffThreshold:1,changedThreshold:0}
    ,op: "default"
    ,strict: false
    ,returnNNF: false

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
            if (null != params.pyramid) self.pyramid = params.pyramid;
            if (null != params.op) self.op = params.op;
            if (null != params.strict) self.strict = params.strict;
            if (null != params.fromArea) self.fromArea = params.fromArea;
            if (null != params.toArea) self.toArea = params.toArea;
            if (null != params.returnNNF) self.returnNNF = params.returnNNF;
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
        pyramid: toJSON(self.pyramid),
        op: self.op,
        strict: self.strict,
        fromArea: toJSON(self.fromArea),
        toArea: toJSON(self.toArea),
        returnNNF: self.returnNNF
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.iterations = params.iterations;
        self.patch = params.patch;
        self.radius = params.radius;
        self.alpha = params.alpha;
        self.gamma = params.gamma;
        self.pyramid = fromJSON(params.pyramid);
        self.op = params.op;
        self.strict = params.strict;
        self.fromArea = fromJSON(params.fromArea);
        self.toArea = fromJSON(params.toArea);
        self.returnNNF = params.returnNNF;
        return self;
    }

    ,metaData: function(serialisation) {
        var self = this;
        if (serialisation && FILTER.isWorker)
        {
            return TypedObj(self.meta && self.meta.nnf ? {nnf:patchmatch.NNF.serialize(self.meta.nnf)} : self.meta);
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
            if (self.meta.nnf) self.meta.nnf = patchmatch.NNF.unserialize(null, null, self.meta.nnf);
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
            im2, w2, h2, i, j, jn,
            Selection = FILTER.Util.Image.Selection,
            Pyramid = FILTER.Util.Image.Pyramid;
        self._update = false;
        self.hasMeta = true;
        if (self.returnNNF)
        {
            self.meta = {nnf:null};
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
                if (self.pyramid)
                {
                    dst = (new Pyramid()).build(im, w, h, 4, self.patch, new Selection(im, w, h, 4, toArea));
                    src = (new Pyramid()).build(im2, w2, h2, 4, self.patch, new Selection(im2, w2, h2, 4, fromArea));
                    for (i=dst.levels.length-1; i>=0; --i)
                    {
                        nnf2 = nnf ? patchmatch(
                            nnf.scale(dst.levels[i].sel, src.levels[i].sel, 2),
                            null,
                            self.patch,
                            self.iterations,
                            self.alpha,
                            self.radius,
                            self.strict
                        ) : patchmatch(
                            dst.levels[i].sel,
                            src.levels[i].sel,
                            self.patch,
                            self.iterations,
                            self.alpha,
                            self.radius,
                            self.strict
                        );
                        if (nnf) nnf.dispose(true);
                        nnf = nnf2;
                        for (j=1,jn=self.pyramid.iterations||0; j<jn; ++j)
                        {
                            metrics = {error:0, changed:0, threshold:self.pyramid.diffThreshold||0, gamma:self.gamma, op:self.op};
                            nnf.apply(true, metrics);
                            if (metrics.changed <= (self.pyramid.changedThreshold||0)) break;
                            patchmatch(nnf.init(), null, self.iterations, self.alpha, self.radius);
                        }
                    }
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
                        self.strict
                    );
                }
                if (self.returnNNF)
                {
                    self.meta.nnf = nnf;
                }
                else
                {
                    metrics = {error:0, changed:0, threshold:0, gamma:self.gamma, op:self.op};
                    nnf.apply(true, metrics).dispose(true);
                    self.meta.metric = metrics.error;
                    self._update = true;
                }
            }
        }
        return im;
    }
});

function patchmatch(dst, src, patch, iterations, alpha, radius, strict)
{
    if (dst instanceof patchmatch.NNF)
    {
        return dst.run(iterations, alpha, radius);
    }
    else
    {
        /*var srcData = src.data(), srcRect = src.rect();
        if (dst.data().data === srcData.data)
        {
            // dst === src, make copy to avoid distortions
            src = new FILTER.Util.Image.Selection(
                copy(srcData.data), srcData.width, srcData.height, srcData.channels,
                {
                x:srcRect.from.x, y:srcRect.from.y, width:srcRect.width, height:srcRect.height,
                points:src.points()
                }
            );
        }*/
        return (new patchmatch.NNF(dst, src, patch, strict)).init().run(iterations, alpha, radius);
    }
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
        self._ = other._ ? other._.slice() : other._;
    }
    else
    {
        self.dst = dst;
        self.src = src;
        self.patch = patch;
        self.strict = !!strict;
        self._ = null;
    }
    self.dstImg = self.dst.data();
    self.dstImg.rect = self.dst.rect();
    self.srcImg = self.src.data();
    self.srcImg.rect = self.src.rect();
}
NNF.prototype = {
    constructor: NNF,
    dst: null,
    src: null,
    dstImg: null,
    srcImg: null,
    patch: 0,
    strict: false,
    _: null,
    dispose: function(complete) {
        var self = this;
        if (true === complete)
        {
            if (self.dst) self.dst.dispose();
            if (self.src) self.src.dispose();
        }
        self.dstImg = self.srcImg = null;
        self.dst = self.src = self._ = null;
    },
    clone: function() {
        return new NNF(this);
    },
    scale: function(dst, src, scaleX, scaleY) {
        if (null ==scaleY) scaleY = scaleX;
        var self = this, A, B,
            nX = stdMath.floor(scaleX),
            nY = stdMath.floor(scaleY),
            scaled = (new NNF(dst, src, self.patch, self.strict)).init();
        if (self._ && (0 < nX) && (0 < nY))
        {
            A = self.dst.points(); B = self.src.points();
            self._.forEach(function(f, a) {
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
                            if (-1 !== aa /*&& -1 !== bb*/) scaled._[aa] = [bb, d];
                        }
                    }
                }
            });
        }
        return scaled;
    },
    dist: function(a, b) {
        var self = this,
            AA = self.dst,
            BB = self.src,
            dataA = self.dstImg,
            dataB = self.srcImg,
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
            i, j, dr, dg, db, isRGBA;
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
                    i = (xa + yaw) << 2;
                    j = (xb + ybw) << 2;
                    dr = imgA[i + 0] - imgB[j + 0];
                    dg = imgA[i + 1] - imgB[j + 1];
                    db = imgA[i + 2] - imgB[j + 2];
                    diff += (dr * dr + dg * dg + db * db) / 195075/*3*255*255*/;
                }
                else
                {
                    i = (xa + yaw);
                    j = (xb + ybw);
                    dr = imgA[i] - imgB[j];
                    diff += (dr * dr) / 65025/*255*255*/;
                }
                ++completed;
            }
        }
        return strict && (20*excluded >= patch*patch) ? false : (completed ? (diff/*+excluded*65025/*255*255* /*(isRGBA?3:1)*/)/(completed/*+excluded*/) : 1);
    },
    init: function() {
        var self = this, _,
            AA = self.dst,
            BB = self.src,
            A = AA.points(),
            B = BB.points(),
            n = A.length, a, b,
            res, tries;
        if (!A.length || !B.length) {self._ = null; return self;}
        if (!self._) self._ = new Array(A.length);
        _ = self._;
        for (a=0; a<n; ++a)
        {
            res = false; tries = 0;
            while (false === res && tries < 10)
            {
                ++tries;
                b = randInt(0, B.length-1);
                res = self.dist(a, b);
            }
            _[a] = [b, false === res ? 1 : res];
        }
        return self;
    },
    propagation: function(a, is_odd) {
        var self = this, _ = self._, AA = self.dst,
            rectA = self.dstImg.rect, A = AA.points(),
            ap = A[a], x = ap.x, y = ap.y, i, j, res,
            left, up, down, right, current;
        current = _[a][1];
        res = false;
        if (is_odd)
        {
            i = AA.indexOf(stdMath.max(rectA.from.x, x-1), y);
            j = AA.indexOf(x, stdMath.max(rectA.from.y, y-1));
            left = -1 === i ? 1 : _[i][1];
            up = -1 === j ? 1 : _[j][1];
            if (false === res && left < current && left <= up)
            {
                res = self.dist(a, _[i][0]);
                if (false !== res) _[a] = [_[i][0], res];
            }
            if (false === res && up < current && up <= left)
            {
                res = self.dist(a, _[j][0]);
                if (false !== res) _[a] = [_[j][0], res];
            }
        }
        else
        {
            i = AA.indexOf(stdMath.min(x+1, rectA.to.x), y);
            j = AA.indexOf(x, stdMath.min(y+1, rectA.to.y));
            right = -1 === i ? 1 : _[i][1];
            down = -1 === j ? 1 : _[j][1];
            if (false === res && right < current && right <= down)
            {
                res = self.dist(a, _[i][0]);
                if (false !== res) _[a] = [_[i][0], res];
            }
            if (false === res && down < current && down <= right)
            {
                res = self.dist(a, _[j][0]);
                if (false !== res) _[a] = [_[j][0], res];
            }
        }
        return self;
    },
    random_search: function(a, alpha, radius) {
        var self = this, _ = self._,
            AA = self.dst, BB = self.src, B = BB.points(),
            dataA = self.dstImg, dataB = self.srcImg,
            rectA = dataA.rect, rectB = dataB.rect,
            b, bp, bx, by, rx, ry, d, tries, best;
        b = _[a][0];
        bp = B[b];
        bx = bp.x; by = bp.y;
        best = {b:b, d:_[a][1]};
        while (radius >= 1)
        {
            d = false; tries = 0;
            while (false === d && tries < 5)
            {
                ++tries;
                rx = clamp(bx + randInt(-radius, radius), rectB.from.x, rectB.to.x);
                ry = clamp(by + randInt(-radius, radius), rectB.from.y, rectB.to.y);
                b = BB.indexOf(rx, ry);
                if (-1 === b) continue;
                d = b === best.b ? best.d : self.dist(a, b);
            }
            if (false !== d && d < best.d)
            {
                best.b = b;
                best.d = d;
            }
            radius *= alpha;
        }
        _[a] = [best.b, best.d];
        return self;
    },
    run: function(iters, alpha, radius) {
        if (!this._) return this;
        var self = this, n = self._.length, rectB = self.srcImg.rect, i, a;
        radius = stdMath.min(radius, rectB.width/2, rectB.height/2);
        for (i=0; i<iters; ++i)
        {
            if (i & 1)
            {
                for (a=0; a<n; ++a)
                {
                    self.propagation(a, true).random_search(a, alpha, radius);
                }
            }
            else
            {
                for (a=n-1; a>=0; --a)
                {
                    self.propagation(a, false).random_search(a, alpha, radius);
                }
            }
        }
        return self;
    },
    apply: function(apply, metrics) {
        if (!this._) return this;
        var self = this,
            _ = self._,
            AA = self.dst,
            BB = self.src,
            A = AA.points(),
            B = BB.points(),
            dataA = self.dstImg,
            dataB = self.srcImg,
            // should be imgA !== imgB else distortion can result
            imgA = dataA.data,
            imgB = dataB.data,
            widthA = dataA.width,
            heightA = dataA.height,
            widthB = dataB.width,
            heightB = dataB.height,
            n = _.length, i, ii, cnt,
            patch = self.patch,
            p = patch >>> 1,
            pos, weight, conf,
            mu, sigma, stats,
            a, b, ap, bp, ai, bj,
            ax, ay, bx, by, d,
            x, y, dx, dy, dr, dg, db,
            color, diff, nmse = 0, changed = 0,
            op = metrics ? metrics.op : "default",
            gamma = metrics ? metrics.gamma : 1.3,
            threshold = (metrics ? metrics.threshold : 0)||0;

        apply = false !== apply;
        if ("resolve" === op)
        {
            pos = new Array(patch*patch);
            weight = new Array(patch*patch);
            conf = confidence(self, stdMath.pow(gamma, -1));
            statistics(self, stats=[0.0, 1.0]);
            mu = stats[0]; sigma = stats[1];
        }
        else if ("smooth" === op)
        {
            weight = new Array(patch);
            sigma = 2*p*p;
            for (i=-p; i<=p; ++i) weight[i+p] = stdMath.exp(-(i*i)/sigma);
        }
        if (4 === dataA.channels)
        {
            if ("resolve" === op)
            {
                color = [0,0,0,0];
                for (i=0; i<n; ++i)
                {
                    ap = A[i];
                    ax = ap.x; ay = ap.y;
                    ai = ap.index << 2;
                    cnt = 0;
                    for (dy=-p; dy<=p; ++dy)
                    {
                        y = ay+dy;
                        if (0 > y || y >= heightA) continue;
                        for (dx=-p; dx<=p; ++dx)
                        {
                            x = ax+dx;
                            if (0 > x || x >= widthA) continue;
                            ii = AA.indexOf(x, y);
                            if (-1 === ii) continue;
                            b = _[ii][0];
                            bp = B[b];
                            d = _[ii][1];
                            pos[cnt] = bp.index;
                            weight[cnt] = conf[i] * stdMath.pow(0.3337, stdMath.abs((d - mu) / sigma));
                            ++cnt;
                        }
                    }
                    color_result(self, pos, weight, cnt, color);
                    dr = imgA[ai + 0] - color[0];
                    dg = imgA[ai + 1] - color[1];
                    db = imgA[ai + 2] - color[2];
                    diff = (dr * dr + dg * dg + db * db) / 195075/*3*255*255*/;
                    nmse += diff;
                    if (diff > threshold) changed++;
                    if (apply)
                    {
                        imgA[ai + 0] = color[0];
                        imgA[ai + 1] = color[1];
                        imgA[ai + 2] = color[2];
                    }
                }
            }
            else if ("smooth" === op)
            {
                color = [0,0,0,0];
                for (i=0; i<n; ++i)
                {
                    ap = A[i];
                    bp = B[_[i][0]];
                    ai = ap.index << 2;
                    color_avg(self, bp, color, weight);
                    dr = imgA[ai + 0] - color[0];
                    dg = imgA[ai + 1] - color[1];
                    db = imgA[ai + 2] - color[2];
                    diff = (dr * dr + dg * dg + db * db) / 195075/*3*255*255*/;
                    nmse += diff;
                    if (diff > threshold) changed++;
                    if (apply)
                    {
                        imgA[ai + 0] = color[0];
                        imgA[ai + 1] = color[1];
                        imgA[ai + 2] = color[2];
                    }
                }
            }
            else
            {
                for (i=0; i<n; ++i)
                {
                    ap = A[i];
                    bp = B[_[i][0]];
                    ai = ap.index << 2;
                    bj = bp.index << 2;
                    dr = imgA[ai + 0] - imgB[bj + 0];
                    dg = imgA[ai + 1] - imgB[bj + 1];
                    db = imgA[ai + 2] - imgB[bj + 2];
                    diff = (dr * dr + dg * dg + db * db) / 195075/*3*255*255*/;
                    nmse += diff;
                    if (diff > threshold) changed++;
                    if (apply)
                    {
                        imgA[ai + 0] = imgB[bj + 0];
                        imgA[ai + 1] = imgB[bj + 1];
                        imgA[ai + 2] = imgB[bj + 2];
                    }
                }
            }
        }
        else
        {
            if ("resolve" === op)
            {
                color = [0];
                for (i=0; i<n; ++i)
                {
                    ap = A[i];
                    ax = ap.x; ay = ap.y;
                    ai = ap.index;
                    cnt = 0;
                    for (dy=-p; dy<=p; ++dy)
                    {
                        y = ay+dy;
                        if (0 > y || y >= heightA) continue;
                        for (dx=-p; dx<=p; ++dx)
                        {
                            x = ax+dx;
                            if (0 > x || x >= widthA) continue;
                            ii = AA.indexOf(x, y);
                            if (-1 === ii) continue;
                            b = _[ii][0];
                            bp = B[b];
                            d = _[ii][1];
                            pos[cnt] = bp.index;
                            weight[cnt] = conf[i] * stdMath.pow(0.3337, stdMath.abs((d - mu) / sigma));
                            ++cnt;
                        }
                    }
                    color_result(self, pos, weight, cnt, color);
                    dr = imgA[ai] - color[0];
                    diff = (dr * dr) / 65025/*255*255*/;
                    nmse += diff;
                    if (diff > threshold) changed++;
                    if (apply)
                    {
                        imgA[ai] = color[0];
                    }
                }
            }
            else if ("smooth" === op)
            {
                color = [0];
                for (i=0; i<n; ++i)
                {
                    ap = A[i];
                    bp = B[_[i][0]];
                    ai = ap.index;
                    color_avg(self, bp, color, weight);
                    dr = imgA[ai] - color[0];
                    diff = (dr * dr) / 65025/*255*255*/;
                    nmse += diff;
                    if (diff > threshold) changed++;
                    if (apply)
                    {
                        imgA[ai] = color[0];
                    }
                }
            }
            else
            {
                for (i=0; i<n; ++i)
                {
                    ap = A[i];
                    bp = B[_[i][0]];
                    ai = ap.index;
                    bj = bp.index;
                    dr = imgA[ai] - imgB[bj];
                    diff = (dr * dr) / 65025/*255*255*/;
                    nmse += diff;
                    if (diff > threshold) changed++;
                    if (apply)
                    {
                        imgA[ai] = imgB[bj];
                    }
                }
            }
        }
        if (metrics)
        {
            metrics.changed = changed / n;
            metrics.error = nmse / n;
        }
        return self;
    }
};
NNF.serialize = function(nnf) {
    return {
    dst: FILTER.Util.Image.Selection.serialize(nnf.dst),
    src: FILTER.Util.Image.Selection.serialize(nnf.src),
    patch: nnf.patch,
    strict: nnf.strict,
    _: nnf._
    };
};
NNF.unserialize = function(dst, src, obj) {
    var nnf = new NNF(
    FILTER.Util.Image.Selection.unserialize(dst, obj.dst),
    FILTER.Util.Image.Selection.unserialize(src, obj.src),
    obj.patch,
    obj.strict
    );
    nnf._ = obj._;
    return nnf;
};
patchmatch.NNF = NNF;

function color_avg(nnf, bp, output, kernel)
{
    var B = nnf.src,
        dataB = nnf.srcImg,
        imgB = dataB.data,
        width = dataB.width,
        height = dataB.height,
        bx = bp.x, by = bp.y,
        dx, dy, x, y, yw,
        r = 0.0, g = 0.0,
        b = 0.0, sum = 0.0,
        index, w, ky, kx,
        p = nnf.patch >>> 1;

    if (4 === dataB.channels)
    {
        for (dy=-p; dy<=p; ++dy)
        {
            y = by+dy;
            if (0 > y || y >= height || !B.has(null, y)) continue;
            ky = kernel ? kernel[dy+p] : 1;
            yw = y*width;
            for (dx=-p; dx<=p; ++dx)
            {
                x = bx+dx;
                if (0 > x || x >= width || !B.has(x, null)) continue;
                kx = kernel ? kernel[dx+p] : 1;
                w = kx*ky;
                index = (x + yw) << 2;
                r += imgB[index + 0] * w;
                g += imgB[index + 1] * w;
                b += imgB[index + 2] * w;
                sum += w;
            }
        }
        output[0] = clamp(stdMath.round(r / sum), 0, 255);
        output[1] = clamp(stdMath.round(g / sum), 0, 255);
        output[2] = clamp(stdMath.round(b / sum), 0, 255);
    }
    else
    {
        for (dy=-p; dy<=p; ++dy)
        {
            y = by+dy;
            if (0 > y || y >= height || !B.has(null, y)) continue;
            ky = kernel ? kernel[dy+p] : 1;
            yw = y*width;
            for (dx=-p; dx<=p; ++dx)
            {
                x = bx+dx;
                if (0 > x || x >= width || !B.has(x, null)) continue;
                kx = kernel ? kernel[dx+p] : 1;
                w = kx*ky;
                index = (x + yw);
                r += imgB[index] * w;
                sum += w;
            }
        }
        output[0] = clamp(stdMath.round(r / sum), 0, 255);
    }
    return output;
}
function color_result(nnf, pos, weight, cnt, output)
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
        output[0] = clamp(stdMath.round(r / sum), 0, 255);
        output[1] = clamp(stdMath.round(g / sum), 0, 255);
        output[2] = clamp(stdMath.round(b / sum), 0, 255);
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
        output[0] = clamp(stdMath.round(r / sum), 0, 255);
    }
    return output;
}
function confidence(nnf, gamma)
{
    var _ = nnf._,
        A = nnf.dst.points(),
        n = _.length, mapA = {},
        width = nnf.dstImg.width,
        height = nnf.dstImg.height,
        i, j, ii, v, vals, ads,
        value = 1.50, a = 1.0, b = 1.5,
        result = new Array(n),
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
        result[i] = 0 == result[i] ? value : stdMath.pow(gamma, result[i]);
    }
    return result;
}
function statistics(nnf, stats)
{
    if (!nnf._) return stats;
    var _ = nnf._, n = _.length,
        a, b, d, sum, mu, sigma;
    sum = 0.0;
    for (a=0; a<n; ++a)
    {
        d = _[a][1];
        sum += d;
    }
    mu = sum / n;
    sum = 0.0;
    for (a=0; a<n; ++a)
    {
        d = _[a][1] - mu;
        sum += d * d;
    }
    sigma = stdMath.sqrt(sum / (n - 1));
    stats[0] = mu; stats[1] = sigma;
    return stats;
}
function randInt(a, b)
{
    return stdMath.round(stdMath.random()*(b-a)+a);
}
}(FILTER);