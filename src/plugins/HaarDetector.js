/**
*
* HAAR Feature Detector
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var stdMath = Math, Abs = stdMath.abs, Max = stdMath.max, Min = stdMath.min,
    Floor = stdMath.floor, Round = stdMath.round, Sqrt = stdMath.sqrt,
    TypedArray = FILTER.Util.Array.typed, TypedObj = FILTER.Util.Array.typed_obj,
    MAX_FEATURES = 10, push = Array.prototype.push;

// HAAR Feature Detector (Viola-Jones-Lienhart algorithm)
// adapted from: https://github.com/foo123/HAAR.js
// references:
// 1. Viola, Jones 2001 http://www.cs.cmu.edu/~efros/courses/LBMV07/Papers/viola-cvpr-01.pdf
// 2. Lienhart et al 2002 http://www.lienhart.de/Prof._Dr._Rainer_Lienhart/Source_Code_files/ICIP2002.pdf
FILTER.Create({
    name: "HaarDetectorFilter"

    // parameters
    ,_update: false // filter by itself does not alter image data, just processes information
    ,hasMeta: true
    ,haardata: null
    ,tolerance: 0.2
    ,baseScale: 1.0
    ,scaleIncrement: 1.25
    ,stepIncrement: 0.5
    ,minNeighbors: 1
    ,doCannyPruning: true
    ,cannyLow: 20
    ,cannyHigh: 100
    ,_haarchanged: false

    // this is the filter constructor
    ,init: function(haardata, baseScale, scaleIncrement, stepIncrement, minNeighbors, doCannyPruning, tolerance) {
        var self = this;
        self.haardata = haardata || null;
        self.baseScale = null == baseScale ? 1.0 : (+baseScale);
        self.scaleIncrement = null == scaleIncrement ? 1.25 : (+scaleIncrement);
        self.stepIncrement = null == stepIncrement ? 0.5 : (+stepIncrement);
        self.minNeighbors = null == minNeighbors ? 1 : (+minNeighbors);
        self.doCannyPruning = undef === doCannyPruning ? true : (!!doCannyPruning);
        self.tolerance = null == tolerance ? 0.2 : (+tolerance);
        self._haarchanged = !!self.haardata;
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,dispose: function() {
        var self = this;
        self.haardata = null;
        self.$super('dispose');
        return self;
    }

    ,haar: function(haardata) {
        var self = this;
        self.haardata = haardata;
        self._haarchanged = true;
        return self;
    }

    ,params: function(params) {
        var self = this;
        if (params)
        {
            if (params.haardata)
            {
                self.haardata = params.haardata;
                self._haarchanged = true;
            }
            if (null != params.baseScale) self.baseScale = +params.baseScale;
            if (null != params.scaleIncrement) self.scaleIncrement = +params.scaleIncrement;
            if (null != params.stepIncrement) self.stepIncrement = +params.stepIncrement;
            if (null != params.minNeighbors) self.minNeighbors = +params.minNeighbors;
            if (undef !== params.doCannyPruning) self.doCannyPruning = !!params.doCannyPruning;
            if (null != params.tolerance) self.tolerance = +params.tolerance;
            if (null != params.cannyLow) self.cannyLow = +params.cannyLow;
            if (null != params.cannyHigh) self.cannyHigh = +params.cannyHigh;
            if (null != params.selection) self.selection = params.selection || null;
        }
        return self;
    }

    ,serialize: function() {
        var self = this, json;
        json = {
             //haardata: null
             baseScale: self.baseScale
            ,scaleIncrement: self.scaleIncrement
            ,stepIncrement: self.stepIncrement
            ,minNeighbors: self.minNeighbors
            ,doCannyPruning: self.doCannyPruning
            ,tolerance: self.tolerance
            ,cannyLow: self.cannyLow
            ,cannyHigh: self.cannyHigh
        };
        // avoid unnecessary (large) data transfer
        if (self._haarchanged)
        {
            json.haardata = TypedObj(self.haardata);
            self._haarchanged = false;
        }
        return json;
    }

    ,unserialize: function(params) {
        var self = this;
        if (params.haardata) self.haardata = TypedObj(params.haardata, 1);
        self.baseScale = params.baseScale;
        self.scaleIncrement = params.scaleIncrement;
        self.stepIncrement = params.stepIncrement;
        self.minNeighbors = params.minNeighbors;
        self.doCannyPruning = params.doCannyPruning;
        self.tolerance = params.tolerance;
        self.cannyLow = params.cannyLow;
        self.cannyHigh = params.cannyHigh;
        return self;
    }

    // detected objects are passed as filter metadata (if filter is run in parallel thread)
    ,metaData: function(serialisation) {
        return serialisation && FILTER.isWorker ? TypedObj(this.meta) : this.meta;
    }

    ,setMetaData: function(meta, serialisation) {
        this.meta = serialisation && ("string" === typeof meta) ? TypedObj(meta, 1) : meta;
        return this;
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h, metaData) {
        var self = this;
        if (!self.haardata) return im;

        var imLen = im.length, imSize = imLen>>>2,
            selection = self.selection || null,
            A32F = FILTER.Array32F, SAT=null, SAT2=null, RSAT=null, GSAT=null,
            x1, y1, x2, y2, xf, yf,
            features, FilterUtil = FILTER.Util.Filter;

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
            x1 = Min(w-1, Max(0, selection[0]*xf));
            y1 = Min(h-1, Max(0, selection[1]*yf));
            x2 = Min(w-1, Max(0, selection[2]*xf));
            y2 = Min(h-1, Max(0, selection[3]*yf));
        }
        else
        {
            x1 = 0; y1 = 0;
            x2 = w-1; y2 = h-1;
        }

        // NOTE: assume image is already grayscale
        if (metaData && metaData.haarfilter_SAT)
        {
            SAT = metaData.haarfilter_SAT;
            SAT2 = metaData.haarfilter_SAT2;
            RSAT = metaData.haarfilter_RSAT;
        }
        else
        {
            // pre-compute <del>grayscale,</del> SAT, RSAT and SAT2
            FilterUtil.sat(im, w, h, 2, 0, SAT=new A32F(imSize), SAT2=new A32F(imSize), RSAT=new A32F(imSize));
            if (metaData)
            {
                metaData.haarfilter_SAT = SAT;
                metaData.haarfilter_SAT2 = SAT2;
                metaData.haarfilter_RSAT = RSAT;
            }
        }

        // pre-compute integral canny gradient edges if needed
        if (self.doCannyPruning)
        {
            if (metaData && metaData.haarfilter_GSAT)
            {
                GSAT = metaData.haarfilter_GSAT;
            }
            else
            {
                GSAT = FilterUtil.gradient(im, w, h, 2, 0, 1, 1);
                if (metaData) metaData.haarfilter_GSAT = GSAT;
            }
        }

        // synchronous detection loop
        features = new Array(MAX_FEATURES); features.count = 0;
        FilterUtil.haar_detect(features, w, h, x1, y1, x2, y2, self.haardata, self.baseScale, self.scaleIncrement, self.stepIncrement, SAT, RSAT, SAT2, GSAT, self.cannyLow, self.cannyHigh);
        // truncate if needed
        if (features.length > features.count) features.length = features.count;

        // return results as meta
        self.meta = {objects: FilterUtil.merge_features(features, self.minNeighbors, self.tolerance)};

        // return im back
        return im;
    }
});

// private methods
function haar_detect(feats, w, h, sel_x1, sel_y1, sel_x2, sel_y2,
                    haar, baseScale, scaleIncrement, stepIncrement,
                    SAT, RSAT, SAT2, GSAT, cL, cH)
{
    var thresholdEdgesDensity = null != GSAT,
        selw = (sel_x2-sel_x1+1)|0, selh = (sel_y2-sel_y1+1)|0,
        imSize = w*h, imArea1 = imSize-1,
        haar_stages = haar.stages, sl = haar_stages.length,
        sizex = haar.size1, sizey = haar.size2,
        scale, maxScale, xstep, ystep, xsize, ysize,
        startx, starty, startty, //minScale,
        x, y, ty, tyw, tys, p0, p1, p2, p3, xl, yl, s, t,
        bx, by, swh, inv_area,
        total_x, total_x2, vnorm, edges_density, pass,

        stage, threshold, trees, tl,
        t, cur_node_ind, features, feature,
        rects, nb_rects, thresholdf,
        rect_sum, kr, r, x1, y1, x2, y2,
        x3, y3, x4, y4, rw, rh, yw, yh, sum
    ;

    bx=w-1; by=imSize-w;
    startx = sel_x1|0; starty = sel_y1|0;
    maxScale = Min(/*selw*/w/sizex, /*selh*/h/sizey);
    //minScale = Max(selw/w, selh/h);
    for (scale=baseScale/* *minScale*/; scale<=maxScale; scale*=scaleIncrement)
    {
        // Viola-Jones Single Scale Detector
        xsize = (scale * sizex)|0;
        xstep = (xsize * stepIncrement)|0;
        ysize = (scale * sizey)|0;
        ystep = (ysize * stepIncrement)|0;
        //ysize = xsize; ystep = xstep;
        tyw = ysize*w; tys = ystep*w;
        startty = starty*tys;
        xl = startx+selw-xsize; yl = starty+selh-ysize;
        swh = xsize*ysize; inv_area = 1.0/swh;

        for (y=starty,ty=startty; y<yl; y+=ystep,ty+=tys)
        {
            for (x=startx; x<xl; x+=xstep)
            {
                p0 = x-1 + ty-w;  p1 = p0 + xsize;
                p2 = p0 + tyw;    p3 = p2 + xsize;

                // clamp
                p0 = Min(imArea1,Max(0,p0));
                p1 = Min(imArea1,Max(0,p1));
                p2 = Min(imArea1,Max(0,p2));
                p3 = Min(imArea1,Max(0,p3));

                if (thresholdEdgesDensity)
                {
                    // prune search space based on canny edges density
                    // i.e too few = no feature, too much = noise
                    // avoid overflow
                    edges_density = inv_area * (GSAT[p3] - GSAT[p2] - GSAT[p1] + GSAT[p0]);
                    if (edges_density < cL || edges_density > cH) continue;
                }

                // pre-compute some values for speed

                // avoid overflow
                total_x = inv_area * (SAT[p3] - SAT[p2] - SAT[p1] + SAT[p0]);
                // avoid overflow
                total_x2 = inv_area * (SAT2[p3] - SAT2[p2] - SAT2[p1] + SAT2[p0]);

                vnorm = total_x2 - total_x * total_x;
                vnorm = 1 < vnorm ? Sqrt(vnorm) : vnorm /*1*/;

                pass = false;
                for (s=0; s<sl; ++s)
                {
                    // Viola-Jones HAAR-Stage evaluator
                    stage = haar_stages[s];
                    threshold = stage.thres;
                    trees = stage.trees; tl = trees.length;
                    sum=0;

                    for (t=0; t<tl; ++t)
                    {
                        //
                        // inline the tree and leaf evaluators to avoid function calls per-loop (faster)
                        //

                        // Viola-Jones HAAR-Tree evaluator
                        features = trees[t].feats;
                        cur_node_ind = 0;
                        while (true)
                        {
                            feature = features[cur_node_ind];

                            // Viola-Jones HAAR-Leaf evaluator
                            rects = feature.rects;
                            nb_rects = rects.length;
                            thresholdf = feature.thres;
                            rect_sum = 0;

                            if (feature.tilt)
                            {
                                // tilted rectangle feature, Lienhart et al. extension
                                for (kr=0; kr<nb_rects; ++kr)
                                {
                                    r = rects[kr];

                                    // this produces better/larger features, possible rounding effects??
                                    x1 = x + (scale * r[0])|0;
                                    y1 = (y-1 + (scale * r[1])|0) * w;
                                    x2 = x + (scale * (r[0] + r[2]))|0;
                                    y2 = (y-1 + (scale * (r[1] + r[2]))|0) * w;
                                    x3 = x + (scale * (r[0] - r[3]))|0;
                                    y3 = (y-1 + (scale * (r[1] + r[3]))|0) * w;
                                    x4 = x + (scale * (r[0] + r[2] - r[3]))|0;
                                    y4 = (y-1 + (scale * (r[1] + r[2] + r[3]))|0) * w;

                                    // clamp
                                    x1 = Min(bx,Max(0,x1));
                                    x2 = Min(bx,Max(0,x2));
                                    x3 = Min(bx,Max(0,x3));
                                    x4 = Min(bx,Max(0,x4));
                                    y1 = Min(by,Max(0,y1));
                                    y2 = Min(by,Max(0,y2));
                                    y3 = Min(by,Max(0,y3));
                                    y4 = Min(by,Max(0,y4));

                                    // RSAT(x-h+w, y+w+h-1) + RSAT(x, y-1) - RSAT(x-h, y+h-1) - RSAT(x+w, y+w-1)
                                    //        x4     y4            x1  y1          x3   y3            x2   y2
                                    rect_sum += r[4] * (RSAT[x4 + y4] - RSAT[x3 + y3] - RSAT[x2 + y2] + RSAT[x1 + y1]);
                                }
                            }
                            else
                            {
                                // orthogonal rectangle feature, Viola-Jones original
                                for (kr=0; kr<nb_rects; ++kr)
                                {
                                    r = rects[kr];

                                    // this produces better/larger features, possible rounding effects??
                                    x1 = x-1 + (scale * r[0])|0;
                                    x2 = x-1 + (scale * (r[0] + r[2]))|0;
                                    y1 = w * (y-1 + (scale * r[1])|0);
                                    y2 = w * (y-1 + (scale * (r[1] + r[3]))|0);

                                    // clamp
                                    x1 = Min(bx,Max(0,x1));
                                    x2 = Min(bx,Max(0,x2));
                                    y1 = Min(by,Max(0,y1));
                                    y2 = Min(by,Max(0,y2));

                                    // SAT(x-1, y-1) + SAT(x+w-1, y+h-1) - SAT(x-1, y+h-1) - SAT(x+w-1, y-1)
                                    //      x1   y1         x2      y2          x1   y1            x2    y1
                                    rect_sum += r[4] * (SAT[x2 + y2]  - SAT[x1 + y2] - SAT[x2 + y1] + SAT[x1 + y1]);
                                }
                            }

                            /*where = rect_sum * inv_area < thresholdf * vnorm ? 0 : 1;*/
                            // END Viola-Jones HAAR-Leaf evaluator

                            if (rect_sum * inv_area < thresholdf * vnorm)
                            {
                                if (feature.has_l) {sum += feature.l_val; break;}
                                else {cur_node_ind = feature.l_node;}
                            }
                            else
                            {
                                if (feature.has_r) {sum += feature.r_val; break;}
                                else {cur_node_ind = feature.r_node;}
                            }
                        }
                        // END Viola-Jones HAAR-Tree evaluator
                    }
                    pass = sum > threshold;
                    // END Viola-Jones HAAR-Stage evaluator

                    if (!pass) break;
                }

                if (pass)
                {
                    // expand
                    if (feats.count === feats.length) push.apply(feats, new Array(MAX_FEATURES));
                    //                      x, y, width, height
                    feats[feats.count++] = {x:x, y:y, width:xsize, height:ysize};
                }
            }
        }
    }
}
function equals(r1, r2, eps)
{
    var delta = eps * (Min(r1.width, r2.width) + Min(r1.height, r2.height)) * 0.5;
    return Abs(r1.x - r2.x) <= delta &&
        Abs(r1.y - r2.y) <= delta &&
        Abs(r1.x + r1.width - r2.x - r2.width) <= delta &&
        Abs(r1.y + r1.height - r2.y - r2.height) <= delta;
}
function is_inside(r1, r2, eps)
{
    var dx = r2.width * eps, dy = r2.height * eps;
    return (r1.x >= r2.x - dx) &&
        (r1.y >= r2.y - dy) &&
        (r1.x + r1.width <= r2.x + r2.width + dx) &&
        (r1.y + r1.height <= r2.y + r2.height + dy);
}
function add(r1, r2)
{
    r1.x += r2.x;
    r1.y += r2.y;
    r1.width += r2.width;
    r1.height += r2.height;
    return r1;
}
function snap_to_grid(r)
{
    r.x = Round(r.x);
    r.y = Round(r.y);
    r.width = Round(r.width);
    r.height = Round(r.height);
    r.area = r.width*r.height;
    return r;
}
function by_area(r1, r2) {return r2.area-r1.area;}
// merge the detected features if needed
function merge_features(rects, min_neighbors, epsilon)
{
    var rlen = rects.length, ref = new Array(rlen), feats = [],
        nb_classes = 0, neighbors, r, found = false, i, j, n, t, ri;

    // original code
    // find number of neighbour classes
    for (i = 0; i < rlen; ++i) ref[i] = 0;
    for (i = 0; i < rlen; ++i)
    {
        found = false;
        for (j = 0; j < i; ++j)
        {
            if (equals(rects[j], rects[i], epsilon))
            {
                found = true;
                ref[i] = ref[j];
            }
        }

        if (!found)
        {
            ref[i] = nb_classes;
            ++nb_classes;
        }
    }

    // merge neighbor classes
    neighbors = new Array(nb_classes);  r = new Array(nb_classes);
    for (i = 0; i < nb_classes; ++i) {neighbors[i] = 0;  r[i] = {x:0,y:0,width:0,height:0};}
    for (i = 0; i < rlen; ++i) {ri=ref[i]; ++neighbors[ri]; add(r[ri], rects[i]);}
    for (i = 0; i < nb_classes; ++i)
    {
        n = neighbors[i];
        if (n >= min_neighbors)
        {
            t = 1/(n + n);
            ri = {
                x:t*(r[i].x * 2 + n),  y:t*(r[i].y * 2 + n),
                width:t*(r[i].width * 2 + n),  height:t*(r[i].height * 2 + n)
            };

            feats.push(ri);
        }
    }

    // filter inside rectangles
    rlen = feats.length;
    for (i=0; i<rlen; ++i)
    {
        for (j=i+1; j<rlen; ++j)
        {
            if (!feats[i].isInside && is_inside(feats[i], feats[j], epsilon))
                feats[i].isInside = true;
            if (!feats[j].isInside && is_inside(feats[j], feats[i], epsilon))
                feats[j].isInside = true;
        }
    }
    i = rlen;
    while (--i >= 0)
    {
        if (feats[i].isInside) feats.splice(i, 1);
        else snap_to_grid(feats[i]);
    }

    return feats.sort(by_area);
}

// expose as static utility methods, can be overriden
FILTER.Util.Filter.haar_detect = haar_detect;
FILTER.Util.Filter.merge_features = merge_features;

}(FILTER);