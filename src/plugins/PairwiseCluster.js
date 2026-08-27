/**
*
* PairwiseCluster
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var stdMath = Math,
    //clamp = FILTER.Color.clampPixel,
    ImageUtil = FILTER.Util.Image,
    TypedObj = FILTER.Util.Array.typed_obj;

/*

original code based on:

1. [Pairwise Data Clustering by Deterministic Annealing, Thomas Hofmann, Joachim M. Buhmann, 1997](https://scispace.com/pdf/pairwise-data-clustering-by-deterministic-annealing-20cxpuy7es.pdf)

*/
FILTER.Create({
    name : "PairwiseClusterFilter"

    ,path: FILTER.Path

    ,k: 2
    ,knn: 1
    ,distance: "euclidean"
    ,alpha: 0.75
    ,iterations: 5

    ,init: function(k, knn) {
        var self = this;
        if (null != k) self.k = k || 2;
        if (null != knn) self.knn = knn || 0;
    }

    ,params: function(params) {
        var self = this;
        if (params)
        {
            if (null != params.k) self.k = +params.k;
            if (null != params.knn) self.knn = +params.knn;
            if (null != params.distance) self.distance = params.distance;
            if (null != params.alpha) self.alpha = +params.alpha;
            if (null != params.iterations) self.iterations = +params.iterations;
            if (null != params.selection) self.selection = params.selection || null;
        }
        return self;
    }

    ,serialize: function() {
        var self = this, json;
        json = {
            k: self.k,
            knn: self.knn,
            distance: "function" === typeof self.distance ? self.distance.toString() : self.distance,
            alpha: self.alpha,
            iterations: self.iterations
        };
        return json;
    }

    ,unserialize: function(params) {
        var self = this;
        self.k = params.k;
        self.knn = params.knn;
        self.distance = "function" === typeof ImageUtil.Distance[params.distance] ? params.distance : ((new Function("FILTER", '"use strict"; return ' + params.distance + ';'))(FILTER));
        self.alpha = params.alpha;
        self.iterations = params.iterations;
        return self;
    }

    ,apply: function(im, w, h) {
        var self = this,
            selection = self.selection || null,
            xf, yf, x1, y1, x2, y2, ww,
            D, M, map, qi, i, pi, n, c;
        if (selection)
        {
            if (selection[4])
            {
                // selection is relative, make absolute
                xf = w-1;
                yf = h-1;
            }
            else
            {
                // selection is absolute
                xf = 1;
                yf = 1;
            }
            x1 = stdMath.min(w-1, stdMath.max(0, selection[0]*xf))|0;
            y1 = stdMath.min(h-1, stdMath.max(0, selection[1]*yf))|0;
            x2 = stdMath.min(w-1, stdMath.max(0, selection[2]*xf))|0;
            y2 = stdMath.min(h-1, stdMath.max(0, selection[3]*yf))|0;
        }
        else
        {
            x1 = 0; y1 = 0;
            x2 = w-1; y2 = h-1;
        }
        D = "function" === typeof self.distance ? self.distance(im, im, w, h, self.knn, x1, y1, x2, y2) : (ImageUtil.Distance[self.distance](im, im, w, h, self.knn, x1, y1, x2, y2));
        M = pwcdanneal(D, self.k, self.alpha, self.iterations);
        M = array(M.length, function(i) {
            for (var Mi=M[i],cluster=0,c=1,k=self.k; c<k; ++c)
            {
                if (Mi[c] > Mi[cluster]) cluster = c;
            }
            return cluster;
        });
        map = array(self.k, function(k) {
            return {cnt:M.filter(function(mi) {return mi === k;}).length, cl:k};
        }).filter(function(mi) {
            return 0 < mi.cnt;
        }).sort(function(a, b) {
            return (b.cnt - a.cnt) || (a.cl - b.cl);
        }).reduce(function(map, mi, k) {
            map[mi.cl] = k;
            return map;
        }, {});
        qi = stdMath.ceil(255 / stdMath.max(1, Object.keys(map).length - 1));
        ww = x2-x1+1;
        for (i=0,n=M.length; i<n; ++i)
        {
            c = map[M[i]] * qi;
            pi = (x1 + (i % ww) + (y1 + stdMath.floor(i / ww)) * w) << 2;
            im[pi + 0] = c;
            im[pi + 1] = c;
            im[pi + 2] = c;
        }
        return im;
    }
});

// pairwise clustering by deterministic annealing
function pwcdanneal(D, k, alpha, max_iter)
{
    // D is the square distance or dissimilarity matrix
    // M is the assignment matrix which consists of the
    // a posteriori probabilities of a component zi for a given class ck

    if (null == max_iter) max_iter = 5;
    if (null == alpha) alpha = 0.75;

    var n = D.length, M, prevE, E,
        T, Tstart, Tfinal, i, j, v,
        tmp, iter, delta, eps = 1e-6,
        m, e, f, summa, sum, DM;

    // how to choose initial temperature? [corresponds to initial energy==>max eigenvalue]
    Tstart = stdMath.abs(10*max(D)); // max eig estimate

    if (!Tstart)
    {
        //console.log('exited', Tstart);
        // trivial
        return matrix(n, k, function(i, j) {
            return 0 === j ? 1 : 0;
        });
    }

    // initialize in (0,1) uniformly
    M = matrix(n, k, function() {return stdMath.random();});
    // normalize each row to sum to unity
    for (i=0; i<n; ++i)
    {
        for (summa=0,v=0; v<k; ++v) summa += M[i][v];
        for (v=0; v<k; ++v) M[i][v] /= summa;
    }
    E = matrix(n, k, function() {return stdMath.random();});
    prevE = matrix(n, k, 0);

    DM = matrix(n, k, 0);
    sum = array(k, 0);
    Tfinal = Tstart/100;
    T = Tstart;
    while ((alpha < 1) && (T > 0) && (T > Tfinal))
    {
        //console.log('temperature T '+T);
        for (iter=1; iter<=max_iter; ++iter)
        {
            tmp = prevE;
            prevE = E;
            E = tmp;
            for (i=0; i<n; ++i)
            {
                m = M[i];
                e = prevE[i];
                for (summa=0,v=0; v<k; ++v)
                {
                    summa += stdMath.exp(-e[v] / T);
                }
                for (v=0; v<k; ++v)
                {
                    // E-lke step: estimate M(t+1) from E(t) eq.(25)
                    m[v] = stdMath.exp(-e[v] / T) / summa;
                }
            }

            for (v=0; v<k; ++v)
            {
                for (summa=0,j=0; j<n; ++j) summa += M[j][v];
                sum[v] = summa;
            }
            for (i=0; i<n; ++i)
            {
                m = DM[i];
                for (v=0; v<k; ++v)
                {
                    for (summa=0,j=0; j<n; ++j) summa += D[i][j]*M[j][v];
                    m[v] = summa;
                }
            }

            delta = 0;

            for (i=0; i<n; ++i)
            {
                m = M[i];
                e = E[i];
                for (v=0; v<k; ++v)
                {
                    f = sum[v] - m[v];
                    for (summa=0,j=0; j<n; ++j)
                    {
                        summa += M[j][v] * (D[i][j] - DM[j][v]/(2*f));
                    }
                    // M-like step: calculate new E(t+1) from M(t+1) eq.(26)
                    e[v] = summa / (f + 1);

                    delta = stdMath.max(delta, stdMath.abs(e[v] - prevE[i][v]));
                }
            }

            if (delta <= eps) break; // converged
        }
        T = alpha*T;   // decrease temperature exponentially
    }
    return M;
}
FILTER.Util.Filter.pairwise_cluster_det_anneal = pwcdanneal;

// utils
function max(mat)
{
    return stdMath.max.apply(stdMath, mat.map(function(row) {return stdMath.max.apply(stdMath, row);}));
}
function array(n, v)
{
    var arr = new Array(n);
    for (var i=0; i<n; ++i)
    {
        arr[i] = "function" === typeof v ? v(i, arr) : v;
    }
    return arr;
}
function matrix(n, m, v)
{
    return array(n, function(i, mat) {
        return array(m, function(j) {
            return "function" === typeof v ? v(i, j, mat) : v;
        });
    });
}
}(FILTER);