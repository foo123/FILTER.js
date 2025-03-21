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
    TypedArray = FILTER.Util.Array.typed, TypedObj = FILTER.Util.Array.typed_obj;

// PatchMatch algorithm filter
// https://en.wikipedia.org/wiki/PatchMatch
// [PatchMatch: A Randomized Correspondence Algorithm for Structural Image Editing, Connelly Barnes, Eli Shechtman, Adam Finkelstein, Dan B Goldman, 2009](https://gfx.cs.princeton.edu/pubs/Barnes_2009_PAR/patchmatch.pdf)
FILTER.Create({
    name: "PatchMatchFilter"

    ,_update: true
    ,hasMeta: false
    ,hasInputs: true

    // parameters
    // The iterations amount
    ,iters: 5
    // The patch size (should be odd)
    ,patch: 11
    // The radius of the area for the random search
    ,radius: 200
    // The random search alpha
    ,alpha: 0.5
    // patch areas/selections
    ,areas: null
    ,returnNNF: false

    ,init: function() {
        var self = this;
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,params: function(params) {
        var self = this;
        if (params)
        {
            if (null != params.iters) self.iters = +params.iters;
            if (null != params.patch) self.patch = +params.patch;
            if (null != params.radius) self.radius = +params.radius;
            if (null != params.alpha) self.alpha = +params.alpha;
            if (null != params.areas) self.areas = params.areas;
            if (null != params.returnNNF) self.returnNNF = params.returnNNF;
        }
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
        iters: self.iters,
        patch: self.patch,
        radius: self.radius,
        alpha: self.alpha,
        areas: JSON.stringify(self.areas),
        returnNNF: self.returnNNF
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.iters = params.iters;
        self.patch = params.patch;
        self.radius = params.radius;
        self.alpha = params.alpha;
        self.areas = JSON.parse(params.areas);
        self.returnNNF = params.returnNNF;
        return self;
    }

    ,metaData: function(serialisation) {
        if (serialisation && FILTER.isWorker)
        {
            return TypedObj(this.meta && this.meta.nnf ? {nnf:this.meta.nnf.map(function(nnf) {
                return patchmatch.NNF.serialize(nnf);
            })} : this.meta);
        }
        else
        {
            return this.meta;
        }
    }

    ,setMetaData: function(meta, serialisation) {
        if (serialisation && ("string" === typeof meta))
        {
            this.meta = TypedObj(meta, 1);
            if (this.meta.nnf) this.meta.nnf = this.meta.nnf.map(function(nnf) {
                return patchmatch.NNF.unserialize(null, null, nnf);
            });
        }
        else
        {
            this.meta = meta;
        }
        return this;
    }

    ,apply: function(im, w, h) {
        var self = this, areas = self.areas,
            Area = FILTER.Util.Image.Selection;
        if (self.returnNNF)
        {
            self._update = false;
            self.hasMeta = true;
            self.meta = {nnf:[]};
        }
        else
        {
            self._update = true;
            self.hasMeta = true;
            self.meta = {metrics:[]};
        }
        if (areas && areas.length) areas.forEach(function(selection) {
            if (!selection['from'] || !selection['to']) return;
            var srcInput = self.input(selection['from'].data), dst, src, nnf, metrics;
            if (!srcInput) return;
            src = new Area(srcInput[0], srcInput[1], srcInput[2], 4, selection['from']);
            dst = new Area(im, w, h, 4, selection['to']);
            nnf = patchmatch(dst, src, self.patch, self.iters, self.alpha, self.radius);
            if (self.returnNNF)
            {
                self.meta.nnf.push(nnf);
            }
            else
            {
                nnf.apply(metrics={error:0,mode:selection.mode||"default"}).dispose(true);
                self.meta.metrics.push(metrics.error);
            }
        });
        return im;
    }
});

function NNF(dst, src, patch)
{
    var self = this, other;
    if (dst instanceof NNF)
    {
        other = dst;
        self.dst = other.dst;
        self.src = other.src;
        self.patch = other.patch;
        self._ = other._ ? other._.slice() : other._;
    }
    else
    {
        self.dst = dst;
        self.src = src;
        self.patch = patch;
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
    normalize: function() {
        var self = this,
            _ = self._, n = _.length,
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
        for (a=0; a<n; ++a)
        {
            b = _[a][0];
            d = stdMath.abs((_[a][1] - mu) / sigma);
            _[a] = [b, d];
        }
        return self;
    },
    dist: function(a, b) {
        var self = this,
            AA = self.dst,
            BB = self.src,
            dataA = self.dstImg,
            dataB = self.srcImg,
            patch = self.patch,
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
            x, y, xa, ya, yaw, xb, yb, ybw,
            i, j, r, g, b, isRGBA;
        isRGBA = 4 === dataA.channels;
        for (y=-p; y<=p; ++y)
        {
            ya = ay+y; yb = by+y;
            if (0 > ya || 0 > yb || ya >= ah || yb >= bh) continue;
            if (!AA.has(null, ya) || !BB.has(null, yb))
            {
                excluded += patch;
                continue;
            }
            yaw = ya*aw; ybw = yb*bw;
            for (x=-p; x<=p; ++x)
            {
                xa = ax+x; xb = bx+x;
                if (0 > xa || 0 > xb || xa >= aw || xb >= bw) continue;
                if (!AA.has(xa, null) || !BB.has(xb, null))
                {
                    excluded += 1;
                    continue;
                }
                if (isRGBA)
                {
                    i = (xa + yaw) << 2;
                    j = (xb + ybw) << 2;
                    r = imgA[i + 0] - imgB[j + 0];
                    g = imgA[i + 1] - imgB[j + 1];
                    b = imgA[i + 2] - imgB[j + 2];
                    diff += r*r + g*g + b*b;
                }
                else
                {
                    i = (xa + yaw);
                    j = (xb + ybw);
                    r = imgA[i] - imgB[j];
                    diff += r*r;
                }
                ++completed;
            }
        }
        return /*20*excluded >= patch*patch ? false :*/ (completed ? (diff+excluded*65025/*255*255*/*(isRGBA?3:1))/(completed+excluded) : INF);
    },
    avg: function(bp, output) {
        var self = this,
            B = self.src,
            dataB = self.srcImg,
            imgB = dataB.data,
            width = dataB.width,
            height = dataB.height,
            patch = self.patch,
            bx = bp.x, by = bp.y,
            dx, dy, x, y, yw,
            r = 0.0, g = 0.0,
            b = 0.0, sum = 0.0,
            i, index, p = patch >>> 1;
        if (4 === dataB.channels)
        {
            for (dy=-p; dy<=p; ++dy)
            {
                y = by+dy;
                if (0 > y || y >= height || !B.has(null, y)) continue;
                yw = y*width;
                for (dx=-p; dx<=p; ++dx)
                {
                    x = bx+dx;
                    if (0 > x || x >= width || !B.has(x, null)) continue;
                    index = (x + yw) << 2;
                    r += imgB[index + 0];
                    g += imgB[index + 1];
                    b += imgB[index + 2];
                    sum += 1;
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
                yw = y*width;
                for (dx=-p; dx<=p; ++dx)
                {
                    x = bx+dx;
                    if (0 > x || x >= width || !B.has(x, null)) continue;
                    index = (x + yw);
                    r += imgB[index];
                    sum += 1;
                }
            }
            output[0] = clamp(stdMath.round(r / sum), 0, 255);
        }
        return output;
    },
    init: function() {
        var self = this, _,
            AA = self.dst,
            BB = self.src,
            A = AA.points(),
            B = BB.points(),
            n = A.length, a, b,
            res, tries;
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
            _[a] = [b, false === res ? INF : res];
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
            left = -1 === i ? INF : _[i][1];
            up = -1 === j ? INF : _[j][1];
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
            right = -1 === i ? INF : _[i][1];
            down = -1 === j ? INF : _[j][1];
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
    apply: function(metrics) {
        var self = this,
            _ = self._,
            dataA = self.dstImg,
            dataB = self.srcImg,
            // should be imgA !== imgB else distortion can result
            imgA = dataA.data,
            imgB = dataB.data,
            A = self.dst.points(),
            B = self.src.points(),
            n = _.length, i,
            ap, bp, ai, bj,
            dr, dg, db,
            color, nmse = 0,
            mode = metrics ? metrics.mode : "default";

        if (4 === dataA.channels)
        {
            if ("average" === mode)
            {
                color = [0,0,0,0];
                for (i=0; i<n; ++i)
                {
                    ap = A[i];
                    bp = B[_[i][0]];
                    ai = ap.index << 2;
                    self.avg(bp, color);
                    dr = imgA[ai + 0] - color[0];
                    dg = imgA[ai + 1] - color[1];
                    db = imgA[ai + 2] - color[2];
                    nmse += (dr * dr + dg * dg + db * db) / 195075/*3*255*255*/;
                    imgA[ai + 0] = color[0];
                    imgA[ai + 1] = color[1];
                    imgA[ai + 2] = color[2];
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
                    nmse += (dr * dr + dg * dg + db * db) / 195075/*3*255*255*/;
                    imgA[ai + 0] = imgB[bj + 0];
                    imgA[ai + 1] = imgB[bj + 1];
                    imgA[ai + 2] = imgB[bj + 2];
                }
            }
        }
        else
        {
            if ("average" === mode)
            {
                color = [0];
                for (i=0; i<n; ++i)
                {
                    ap = A[i];
                    bp = B[_[i][0]];
                    ai = ap.index;
                    self.avg(bp, color);
                    dr = imgA[ai] - color[0];
                    nmse += (dr * dr) / 65025/*255*255*/;
                    imgA[ai] = color[0];
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
                    nmse += (dr * dr) / 65025/*255*255*/;
                    imgA[ai] = imgB[bj];
                }
            }
        }
        if (metrics) metrics.error = nmse / n;
        return self;
    }
};
NNF.serialize = function(nnf) {
    return {
    dst: FILTER.Util.Image.Selection.serialize(nnf.dst),
    src: FILTER.Util.Image.Selection.serialize(nnf.src),
    patch: nnf.patch,
    _: nnf._
    };
};
NNF.unserialize = function(dst, src, obj) {
    var nnf = new NNF(
    FILTER.Util.Image.Selection.unserialize(dst, obj.dst),
    FILTER.Util.Image.Selection.unserialize(src, obj.src),
    obj.patch
    );
    nnf._ = obj._;
    return nnf;
};

function patchmatch(dst, src, patch, iters, alpha, radius)
{
    var srcData = src.data(), srcRect = src.rect();
    if (dst.data().data === srcData.data)
    {
        // use same image data, copy to avoid distortions
        src = new FILTER.Util.Image.Selection(
            copy(srcData.data), srcData.width, srcData.height, srcData.channels,
            {
            x:srcRect.from.x, y:srcRect.from.y, width:srcRect.width, height:srcRect.height,
            points:src.points()
            }
        );
    }
    return (new patchmatch.NNF(dst, src, patch)).init().run(iters, alpha, radius);
}
patchmatch.NNF = NNF;
FILTER.Util.Filter.patchmatch = patchmatch;

function randInt(a, b)
{
    return stdMath.round(stdMath.random()*(b-a)+a);
}
}(FILTER);