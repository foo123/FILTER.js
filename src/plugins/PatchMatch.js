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
    clamp = FILTER.Util.Math.clamp;

// PatchMatch algorithm filter
// https://en.wikipedia.org/wiki/PatchMatch
// [PatchMatch: A Randomized Correspondence Algorithm for Structural Image Editing, Connelly Barnes, Eli Shechtman, Adam Finkelstein, Dan B Goldman, 2009](https://gfx.cs.princeton.edu/pubs/Barnes_2009_PAR/patchmatch.pdf)
FILTER.Create({
    name: "PatchMatchFilter"

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

    ,init: function() {
        var self = this;
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path
    ,hasInputs: true

    ,params: function(params) {
        var self = this;
        if (params)
        {
            if (null != params.iters) self.iters = +params.iters;
            if (null != params.patch) self.patch = +params.patch;
            if (null != params.radius) self.radius = +params.radius;
            if (null != params.alpha) self.alpha = +params.alpha;
            if (null != params.areas) self.areas = params.areas;
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
        areas: JSON.stringify(self.areas)
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.iters = params.iters;
        self.patch = params.patch;
        self.radius = params.radius;
        self.alpha = params.alpha;
        self.areas = JSON.parse(params.areas);
        return self;
    }

    ,apply: function(im, w, h) {
        var self = this, areas = self.areas,
            Area = FILTER.Util.Image.Selection;
        if (areas && areas.length) areas.forEach(function(area) {
            var src = self.input(area.src);
            if (!src) return;
            patchmatch(new Area(im, w, h, 4, area.selectionDst || {x:0, y:0, width:w, height:h}), new Area(src[0], src[1], src[2], 4, area.selectionSrc || {x:0, y:0, width:src[1], height:src[2]}), self.patch, self.iters, self.alpha, self.radius).apply().dispose(true);
        });
        return im;
    }
});

function NNF(dst, src)
{
    var self = this, other;
    if (dst instanceof NNF)
    {
        other = dst;
        self.dst = other.dst;
        self.src = other.src;
        self._ = other._ ? other._.slice() : other._;
    }
    else
    {
        self.dst = dst;
        self.src = src;
        self._ = null;
    }
}
NNF.prototype = {
    constructor: NNF,
    dst: null,
    src: null,
    _: null,
    dispose: function(complete) {
        var self = this;
        if (true === complete)
        {
            if (self.dst) self.dst.dispose();
            if (self.src) self.src.dispose();
        }
        self.dst = self.src = self._ = null;
    },
    clone: function() {
        return new NNF(this);
    },
    dist: function(a, b, patch, dataA, dataB) {
        var self = this,
            AA = self.dst,
            BB = self.src,
            p = patch >>> 1,
            diff = 0,
            completed = 0,
            excluded = 0,
            imgA, imgB,
            aw, ah, bw, bh,
            A = AA.points(),
            B = BB.points(),
            ax = A[a].x, ay = A[a].y,
            bx = B[b].x, by = B[b].y,
            x, y, xa, ya, yaw, xb, yb, ybw,
            i, j, r, g, b, isRGBA;
        if (null == dataA)
        {
            dataA = AA.data();
            dataB = BB.data();
            imgA = dataA.data;
            imgB = dataB.data;
            aw = dataA.width;
            ah = dataA.height;
            bw = dataB.width;
            bh = dataB.height;
        }
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
        return 20*excluded >= P*P ? false : (completed ? diff/completed : Infinity);
    },
    init: function(patch) {
        var self = this, _,
            AA = self.dst,
            BB = self.src,
            A = AA.points(),
            B = BB.points(),
            dataA = AA.data(),
            dataB = BB.data(),
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
                res = self.dist(a, b, patch, dataA, dataB);
            }
            _[a] = [b, false === res ? INF : res];
        }
        return self;
    },
    propagation: function(a, patch, is_odd) {
        var self = this, _ = self._, AA = self.dst,
            rectA = AA.rect(), A = AA.points(),
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
                res = self.dist(a, _[i][0], patch);
                if (false !== res) _[a] = [_[i][0], res];
            }
            if (false === res && up < current && up <= left)
            {
                res = self.dist(a, _[j][0], patch);
                if (false !== res) _[a] = [_[j][0], res];
            }
        else
        {
            i = AA.indexOf(stdMath.min(x+1, rectA.to.x), y);
            j = AA.indexOf(x, stdMath.min(y+1, rectA.to.y));
            right = -1 === i ? INF : _[i][1];
            down = -1 === j ? INF : _[j][1];
            if (false === res && right < current && right <= down)
            {
                res = self.dist(a, _[i][0], patch);
                if (false !== res) _[a] = [_[i][0], res];
            }
            if (false === res && down < current && down <= right)
            {
                res = self.dist(a, _[j][0], patch);
                if (false !== res) _[a] = [_[j][0], res];
            }
        }
        return self;
    },
    random_search: function(a, patch, alpha, radius) {
        var self = this, _ = self._,
            AA = self.dst, BB = self.src,
            dataA = AA.data(), dataB = BB.data(),
            rectA = AA.rect(), rectB = BB.rect(),
            A = AA.points(), B = BB.points(),
            ap, bp, ax, ay, bx, by, rx, ry,
            alphai = 1, win, res, tries, best;
        radius = stdMath.min(radius, rectB.width/2, rectB.height/2);
        ap = A[a];
        ax = ap.x; ay = ap.y;
        bp = B[_[a][0]];
        bx = bp.x; by = bp.y;
        best = {b:_[a][0], d:_[a][1]};
        while (radius >= 1)
        {
            res = false; tries = 0;
            while (false === res && tries < 5)
            {
                ++tries;
                rx = clamp(bx + randInt(-radius, radius), rectB.from.x, rectB.to.x);
                ry = clamp(by + randInt(-radius, radius), rectB.from.y, rectB.to.y);
                b = BB.indexOf(rx, ry);
                if (-1 === b) continue;
                res = self.dist(a, b, patch, dataA, dataB);
                if (false !== res && res < best.d) break;
            }
            if .(false !== res && res < best.d)
            {
                best.b = b;
                best.d = res;
                bx = B[b].x;
                by = B[b].y;
            }
            radius *= alpha;
        }
        _[a] = [best.b, best.d];
        return self;
    },
    run: function(iters, patch, alpha, radius) {
        var self = this, n = self._.length;
        for (i=0; i<iters; ++i)
        {
            if (0 === (i & 1))
            {
                for (a=n-1; a>=0; --a)
                {
                    self.propagation(a, patch, false).random_search(a, patch, alpha, radius);
                }
            }
            else
            {
                for (a=0; a<n; ++a)
                {
                    self.propagation(a, patch, true).random_search(a, patch, alpha, radius);
                }
            }
        }
        return self;
    },
    apply: function() {
        var self = this,
            _ = self._,
            dataA = self.dst.data(),
            dataB = self.src.data(),
            // should be imgA !== imgB else distortion can result
            imgA = dataA.data,
            imgB = dataB.data,
            A = self.dst.points(),
            B = self.src.points(),
            al = A.length,
            bl = B.length,
            ap, bp,, ai, bj,
            isRGBA = 4 === dataA.channels;

        for (i=0; i<al; ++i)
        {
            ap = A[i];
            bp = B[_[i][0]];
            if (isRGBA)
            {
                ai = ap.index << 2;
                bj = bp.index << 2;
                imgA[ai + 0] = imgB[bj + 0];
                imgA[ai + 1] = imgB[bj + 1];
                imgA[ai + 2] = imgB[bj + 2];
            }
            else
            {
                imgA[ap.index] = imgB[bp.index];
            }
        }
        return self;
    }
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
    return (new patchmatch.NNF(dst, src)).init(patch).run(iters, patch, alpha, radius);
}
patchmatch.NNF = NNF;
FILTER.Util.Filter.patchmatch = patchmatch;
function randInt(a, b)
{
    return stdMath.round(stdMath.random()*(b-a)+a);
}
}(FILTER);