/**
*
* HAAR Feature Detector Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Array32F = FILTER.Array32F, Array8U = FILTER.Array8U,
    Abs = Math.abs, Max = Math.max, Min = Math.min, 
    Floor = Math.floor, Round = Math.round, Sqrt = Math.sqrt,
    TypedArray = FILTER.Util.Array.typed, TypedObj = FILTER.Util.Array.typed_obj,
    HAS = 'hasOwnProperty', MAX_FEATURES = 10, push = Array.prototype.push,
    FilterUtil = FILTER.Util.Filter, sat_image = FilterUtil.SAT, sat_gradient = FilterUtil.GRAD
;

function haar_detect(feats, w, h, sel_x1, sel_y1, sel_x2, sel_y2, haar, baseScale, scaleIncrement, stepIncrement, SAT, RSAT, SAT2, EDGES, cL, cH)
{
    var doCannyEdges = null != EDGES,
        selw = sel_x2-sel_x1+1, selh = sel_y2-sel_y1+1,
        imSize = selw*selh, imArea1 = imSize-1,
        haar_stages = haar.stages, sl = haar_stages.length,
        sizex = haar.size1, sizey = haar.size2,
        scale, maxScale = Min(selw/sizex, selh/sizey),
        xstep, ystep, xsize, ysize,
        startx = sel_x1, starty = sel_y1, startty,
        x, y, ty, tyw, tys, p0, p1, p2, p3, xl, yl, s, t,
        bx1, bx2, by1, by2, swh, inv_area,
        total_x, total_x2, vnorm, edges_density, pass,
        
        stage, threshold, trees, tl,
        t, cur_node_ind, features, feature,
        rects, nb_rects, thresholdf, 
        rect_sum, kr, r, x1, y1, x2, y2,
        x3, y3, x4, y4, rw, rh, yw, yh, sum
    ;
    
    bx1=0; bx2=selw-1; by1=0; by2=imSize-selw;
    scale = baseScale;
    for(scale=baseScale; scale<=maxScale; scale*=scaleIncrement)
    {
        // Viola-Jones Single Scale Detector
        xsize = (scale * sizex)|0;
        xstep = (xsize * stepIncrement)|0;
        ysize = (scale * sizey)|0;
        ystep = (ysize * stepIncrement)|0;
        //ysize = xsize; ystep = xstep;
        tyw = ysize*selw; tys = ystep*selw; 
        startty = starty*tys; 
        xl = selw-xsize; yl = selh-ysize;
        swh = xsize*ysize; inv_area = 1.0/swh;
        
        for(y=starty,ty=startty; y<yl; y+=ystep,ty+=tys) 
        {
            for (x=startx; x<xl; x+=xstep) 
            {
                p0 = x-1 + ty-selw;  p1 = p0 + xsize;
                p2 = p0 + tyw;    p3 = p2 + xsize;
                
                // clamp
                p0 = p0<0 ? 0 : (p0>imArea1 ? imArea1 : p0);
                p1 = p1<0 ? 0 : (p1>imArea1 ? imArea1 : p1);
                p2 = p2<0 ? 0 : (p2>imArea1 ? imArea1 : p2);
                p3 = p3<0 ? 0 : (p3>imArea1 ? imArea1 : p3);
                
                if (doCannyEdges) 
                {
                    // avoid overflow
                    edges_density = inv_area * (EDGES[p3] - EDGES[p2] - EDGES[p1] + EDGES[p0]);
                    if (edges_density < cL || edges_density > cH) continue;
                }
                
                // pre-compute some values for speed
                
                // avoid overflow
                total_x = inv_area * (SAT[p3] - SAT[p2] - SAT[p1] + SAT[p0]);
                // avoid overflow
                total_x2 = inv_area * (SAT2[p3] - SAT2[p2] - SAT2[p1] + SAT2[p0]);
                
                vnorm = total_x2 - total_x * total_x;
                vnorm = 1 < vnorm ? Sqrt(vnorm) : /*vnorm*/  1 ;  
                
                pass = false;
                for(s=0; s<sl; s++) 
                {
                    // Viola-Jones HAAR-Stage evaluator
                    stage = haar_stages[s];
                    threshold = stage.thres;
                    trees = stage.trees; tl = trees.length;
                    sum=0;
                    
                    for(t=0; t<tl; t++) 
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
                                for(kr=0; kr<nb_rects; kr++) 
                                {
                                    r = rects[kr];
                                    
                                    // this produces better/larger features, possible rounding effects??
                                    x1 = x + (scale * r[0])|0;
                                    y1 = (y-1 + (scale * r[1])|0) * selw;
                                    x2 = x + (scale * (r[0] + r[2]))|0;
                                    y2 = (y-1 + (scale * (r[1] + r[2]))|0) * selw;
                                    x3 = x + (scale * (r[0] - r[3]))|0;
                                    y3 = (y-1 + (scale * (r[1] + r[3]))|0) * selw;
                                    x4 = x + (scale * (r[0] + r[2] - r[3]))|0;
                                    y4 = (y-1 + (scale * (r[1] + r[2] + r[3]))|0) * selw;
                                    
                                    // clamp
                                    x1 = x1<bx1 ? bx1 : (x1>bx2 ? bx2 : x1);
                                    x2 = x2<bx1 ? bx1 : (x2>bx2 ? bx2 : x2);
                                    x3 = x3<bx1 ? bx1 : (x3>bx2 ? bx2 : x3);
                                    x4 = x4<bx1 ? bx1 : (x4>bx2 ? bx2 : x4);
                                    y1 = y1<by1 ? by1 : (y1>by2 ? by2 : y1);
                                    y2 = y2<by1 ? by1 : (y2>by2 ? by2 : y2);
                                    y3 = y3<by1 ? by1 : (y3>by2 ? by2 : y3);
                                    y4 = y4<by1 ? by1 : (y4>by2 ? by2 : y4);
                                    
                                    // RSAT(x-h+w, y+w+h-1) + RSAT(x, y-1) - RSAT(x-h, y+h-1) - RSAT(x+w, y+w-1)
                                    //        x4     y4            x1  y1          x3   y3            x2   y2
                                    rect_sum += r[4] * (RSAT[x4 + y4] - RSAT[x3 + y3] - RSAT[x2 + y2] + RSAT[x1 + y1]);
                                }
                            }
                            else
                            {
                                // orthogonal rectangle feature, Viola-Jones original
                                for(kr=0; kr<nb_rects; kr++) 
                                {
                                    r = rects[kr];
                                    
                                    // this produces better/larger features, possible rounding effects??
                                    x1 = x-1 + (scale * r[0])|0; 
                                    x2 = x-1 + (scale * (r[0] + r[2]))|0;
                                    y1 = selw * (y-1 + (scale * r[1])|0); 
                                    y2 = selw * (y-1 + (scale * (r[1] + r[3]))|0);
                                    
                                    // clamp
                                    x1 = x1<bx1 ? bx1 : (x1>bx2 ? bx2 : x1);
                                    x2 = x2<bx1 ? bx1 : (x2>bx2 ? bx2 : x2);
                                    y1 = y1<by1 ? by1 : (y1>by2 ? by2 : y1);
                                    y2 = y2<by1 ? by1 : (y2>by2 ? by2 : y2);
                                    
                                    // SAT(x-1, y-1) + SAT(x+w-1, y+h-1) - SAT(x-1, y+h-1) - SAT(x+w-1, y-1)
                                    //      x1   y1         x2      y2          x1   y1            x2    y1
                                    rect_sum += r[4] * (SAT[x2 + y2]  - SAT[x1 + y2] - SAT[x2 + y1] + SAT[x1 + y1]);
                                }
                            }
                            
                            /*where = rect_sum * inv_area < thresholdf * vnorm ? 0 : 1;*/
                            // END Viola-Jones HAAR-Leaf evaluator
                            
                            if (rect_sum * inv_area < thresholdf * vnorm) 
                            {
                                if (feature.has_l) { sum += feature.l_val; break; } 
                                else { cur_node_ind = feature.l_node; }
                            } 
                            else 
                            {
                                if (feature.has_r) { sum += feature.r_val; break; } 
                                else { cur_node_ind = feature.r_node; }
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
                    if ( feats.count === feats.length ) push.apply(feats, new Array(MAX_FEATURES));
                    //                      x, y, width, height
                    feats[feats.count++] = [x, y, xsize, ysize];
                }
            }
        }
    }
}

//x2-x1+1=w  x2 = w+x1-1
function similar(r1, r2, tolerance)
{
    // tolerance = 0.2
    var d1=Max(r2[2], r1[2])*tolerance, 
        d2=Max(r2[3], r1[3])*tolerance;
    return Abs(r1[0]-r2[0])<=d1 && Abs(r1[1]-r2[1])<=d2 && Abs(r1[2]-r2[2])<=d1 && Abs(r1[3]-r2[3])<=d2; 
}

function is_inside(r1, r2)
{
    return (r1.x1>=r2.x1) && (r1.y1>=r2.y1) && (r1.x2<=r2.x2) && (r1.y2<=r2.y2); 
}

function snap_to_grid(r)
{
    r.x1 = (r.x1+0.5)|0; r.y1 = (r.y1+0.5)|0;
    r.x2 = (r.x2+0.5)|0; r.y2 = (r.y2+0.5)|0;
}

function by_area(r1, r2) { return r2.area-r1.area; }

// merge the detected features if needed
function merge_features(rects, min_neighbors, tolerance) 
{
    var rlen=rects.length, ref = new Array(rlen), feats=[], 
        nb_classes = 0, neighbors, r, found=false, i, j, n, t, ri, x1, y1, w, h;
    
    // original code
    // find number of neighbour classes
    for (i=0; i<rlen; i++) ref[i] = 0;
    for (i=0; i<rlen; i++)
    {
        found = false;
        for (j=0; j<i; j++)
        {
            if ( similar(rects[j],rects[i],tolerance) )
            {
                found = true;
                ref[i] = ref[j];
            }
        }
        
        if (!found)
        {
            ref[i] = nb_classes;
            nb_classes++;
        }
    }        
    
    // merge neighbor classes
    neighbors = new Array(nb_classes); r = new Array(nb_classes);
    for (i=0; i<nb_classes; i++)
    {
        neighbors[i] = 0;
        r[i] = [0,0,0,0];
    }
    for (i=0; i<rlen; i++)
    {
        ri = ref[i];
        neighbors[ri]++;
        //add_feat(r[ri],rects[i]);
        r[ri][0] += rects[i][0]; 
        r[ri][1] += rects[i][1]; 
        r[ri][2] += rects[i][2]; 
        r[ri][3] += rects[i][3]; 
    }
    for (i=0; i<nb_classes; i++) 
    {
        n = neighbors[i];
        if (n >= min_neighbors) 
        {
            t = 1/(n + n);
            x1 = t*(r[i][0] * 2 + n);
            y1 = t*(r[i][1] * 2 + n);
            w = t*(r[i][2] * 2 + n);
            h = t*(r[i][3] * 2 + n);
            feats.push({
                x1: x1, y1: y1, x2: x1+w-1, y2: y1+h-1,
                x: x1, y: y1, width: w, height: h,
                area: 0, inside: 0
            });
        }
    }
    
    // filter inside rectangles
    rlen=feats.length;
    for (i=0; i<rlen; i++)
    {
        for (j=i+1; j<rlen; j++)
        {
            if (!feats[i].inside && is_inside(feats[i],feats[j])) { feats[i].inside=1; }
            else if (!feats[j].inside && is_inside(feats[j],feats[i])) { feats[j].inside=1; }
        }
    }
    i=rlen;
    while (--i >= 0) 
    { 
        if (feats[i].inside) // inside
        {
            feats.splice(i, 1); 
        }
        else 
        {
            snap_to_grid(feats[i]); 
            feats[i].area = feats[i].width*feats[i].height;
        }
    }
    
    // sort according to size 
    // (a deterministic way to present results under different cases)
    return feats.sort(by_area);
}

// HAAR Feature Detector (Viola-Jones-Lienhart algorithm)
// adapted from: https://github.com/foo123/HAAR.js
// references:
// 1. Viola, Jones 2001 http://www.cs.cmu.edu/~efros/courses/LBMV07/Papers/viola-cvpr-01.pdf
// 2. Lienhart et al 2002 http://www.lienhart.de/Prof._Dr._Rainer_Lienhart/Source_Code_files/ICIP2002.pdf
// expose as static utility methods
FilterUtil.haar_detect = haar_detect;
FilterUtil.merge_features = merge_features;
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
    ,init: function( haardata, baseScale, scaleIncrement, stepIncrement, minNeighbors, doCannyPruning, tolerance ) {
        var self = this;
        self.haardata = haardata || null;
        self.baseScale = undef === baseScale ? 1.0 : baseScale;
        self.scaleIncrement = undef === scaleIncrement ? 1.25 : scaleIncrement;
        self.stepIncrement = undef === stepIncrement ? 0.5 : stepIncrement;
        self.minNeighbors = undef === minNeighbors ? 1 : minNeighbors;
        self.doCannyPruning = undef === doCannyPruning ? true : !!doCannyPruning;
        self.tolerance = null == tolerance ? 0.2 : +tolerance;
        self._haarchanged = !!self.haardata;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,dispose: function( ) {
        var self = this;
        self.haardata = null;
        self.$super('dispose');
        return self;
    }
    
    ,haar: function( haardata ) {
        var self = this;
        self.haardata = haardata;
        self._haarchanged = true;
        return self;
    }
    
    ,params: function( params ) {
        var self = this;
        if ( params )
        {
        if ( params[HAS]('haardata') )
        {
            self.haardata = params.haardata;
            self._haarchanged = true;
        }
        if ( params[HAS]('baseScale') ) self.baseScale = params.baseScale;
        if ( params[HAS]('scaleIncrement') ) self.scaleIncrement = params.scaleIncrement;
        if ( params[HAS]('stepIncrement') ) self.stepIncrement = params.stepIncrement;
        if ( params[HAS]('minNeighbors') ) self.minNeighbors = params.minNeighbors;
        if ( params[HAS]('doCannyPruning') ) self.doCannyPruning = params.doCannyPruning;
        if ( params[HAS]('tolerance') ) self.tolerance = params.tolerance;
        if ( params[HAS]('cannyLow') ) self.cannyLow = params.cannyLow;
        if ( params[HAS]('cannyHigh') ) self.cannyHigh = params.cannyHigh;
        if ( params[HAS]('selection') ) self.selection = params.selection || null;
        }
        return self;
    }
    
    ,serialize: function( ) {
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
        if ( self._haarchanged )
        {
            json.haardata = TypedObj( self.haardata );
            self._haarchanged = false;
        }
        return json;
    }
    
    ,unserialize: function( params ) {
        var self = this;
        if ( params[HAS]('haardata') ) self.haardata = TypedObj( params.haardata, 1 );
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
    ,meta: function( serialisation ) {
        return serialisation && FILTER.isWorker ? TypedObj( this._meta ) : this._meta;
    }
    
    ,setMeta: function( meta, serialisation ) {
        this._meta = serialisation && "string" === typeof meta ? TypedObj( meta, 1 ) : meta;
        return this;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h, metaData) {
        var self = this;
        if ( !self.haardata ) return im;
        
        var imSize = im.length>>>2,
            selection = self.selection || null,
            SAT=null, SAT2=null, RSAT=null, EDGES=null, 
            x1, y1, x2, y2, features,
            haar_detect = FilterUtil.haar_detect,
            merge_features = FilterUtil.merge_features;
        
        if ( selection )
        {
            // selection is relative, make absolute
            x1 = Min(w-1, Max(0, selection[0]*(w-1)));
            y1 = Min(h-1, Max(0, selection[1]*(h-1)));
            x2 = Min(w-1, Max(0, selection[2]*(w-1)));
            y2 = Min(h-1, Max(0, selection[3]*(h-1)));
        }
        else
        {
            x1 = 0; y1 = 0;
            x2 = w-1; y2 = h-1;
        }
        
        // NOTE: assume image is already grayscale
        if ( metaData && metaData.haarfilter_SAT )
        {
            SAT = metaData.haarfilter_SAT; SAT2 = metaData.haarfilter_SAT2; RSAT = metaData.haarfilter_RSAT;
        }
        else
        {
            // pre-compute <del>grayscale,</del> SAT, RSAT and SAT2
            sat_image(im, w, h, SAT=new Array32F(imSize), SAT2=new Array32F(imSize), RSAT=new Array32F(imSize));
            if ( metaData ) { metaData.haarfilter_SAT = SAT; metaData.haarfilter_SAT2 = SAT2; metaData.haarfilter_RSAT = RSAT; }
        }
        
        // pre-compute integral gradient edges if needed
        if ( self.doCannyPruning )
        {
            if ( metaData && metaData.haarfilter_EDGES )
            {
                EDGES = metaData.haarfilter_EDGES;
            }
            else
            {
                sat_gradient(im, w, h, EDGES=new Array32F(imSize), null, 1);
                if ( metaData ) { metaData.haarfilter_EDGES = EDGES; }
            }
        }
        
        // synchronous detection loop
        features = new Array(MAX_FEATURES); features.count = 0;
        haar_detect(features, w, h, x1, y1, x2, y2, self.haardata, self.baseScale, self.scaleIncrement, self.stepIncrement, SAT, RSAT, SAT2, EDGES, self.cannyLow, self.cannyHigh);
        // truncate if needed
        if ( features.length > features.count ) features.length = features.count;
        
        // return results as meta
        self._meta = {objects: merge_features(features, self.minNeighbors, self.tolerance)};
        
        // return im back
        return im;
    }
});

}(FILTER);