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
    HAS = 'hasOwnProperty', MAX_FEATURES = 10, push = Array.prototype.push
;

// compute grayscale image, integral image (SAT) and squares image (Viola-Jones) and RSAT (Lienhart)
function integral_image(im, w, h, gray, integral, squares, tilted) 
{
    var imLen=im.length, sum, sum2, i, j, k, y, g;
    
    // first row
    for(j=0,i=0,sum=sum2=0; j<w; j++,i+=4)
    {
        // use fixed-point gray-scale transform, close to openCV transform
        // https://github.com/mtschirs/js-objectdetect/issues/3
        g = (((4899 * im[i] + 9617 * im[i + 1] + 1868 * im[i + 2]) + 8192) >>> 14) & 255;
        
        sum += g;  
        sum2 += g*g;
        
        // SAT(-1, y) = SAT(x, -1) = SAT(-1, -1) = 0
        // SAT(x, y) = SAT(x, y-1) + SAT(x-1, y) + I(x, y) - SAT(x-1, y-1)  <-- integral image
        
        // RSAT(-1, y) = RSAT(x, -1) = RSAT(x, -2) = RSAT(-1, -1) = RSAT(-1, -2) = 0
        // RSAT(x, y) = RSAT(x-1, y-1) + RSAT(x+1, y-1) - RSAT(x, y-2) + I(x, y) + I(x, y-1)    <-- rotated(tilted) integral image at 45deg
        gray[j] = g;
        integral[j] = sum;
        squares[j] = sum2;
        tilted[j] = g;
    }
    // other rows
    for(k=0,y=1,j=w,i=w<<2,sum=sum2=0; i<imLen; i+=4,k++,j++)
    {
        if (k>=w) { k=0; y++; sum=sum2=0; }
        // use fixed-point gray-scale transform, close to openCV transform
        // https://github.com/mtschirs/js-objectdetect/issues/3
        g = (((4899 * im[i] + 9617 * im[i + 1] + 1868 * im[i + 2]) + 8192) >>> 14) & 255;
        
        sum += g;  
        sum2 += g*g;
        
        // SAT(-1, y) = SAT(x, -1) = SAT(-1, -1) = 0
        // SAT(x, y) = SAT(x, y-1) + SAT(x-1, y) + I(x, y) - SAT(x-1, y-1)  <-- integral image
        
        // RSAT(-1, y) = RSAT(x, -1) = RSAT(x, -2) = RSAT(-1, -1) = RSAT(-1, -2) = 0
        // RSAT(x, y) = RSAT(x-1, y-1) + RSAT(x+1, y-1) - RSAT(x, y-2) + I(x, y) + I(x, y-1)    <-- rotated(tilted) integral image at 45deg
        gray[j] = g;
        integral[j] = integral[j-w] + sum;
        squares[j] = squares[j-w] + sum2;
        tilted[j] = tilted[j+1-w] + (g + gray[j-w]) + ((y>1) ? tilted[j-w-w] : 0) + ((k>0) ? tilted[j-1-w] : 0);
    }
}

// compute integral of gradient edges on gray-scale image to speed up detection if possible with Canny pruning
function integral_gradient(w, h, gray, canny) 
{
    var i, j, k, sum, grad_x, grad_y,
        ind0, ind1, ind2, ind_1, ind_2, count=gray.length, 
        lowpass = new Array8U(count)
    ;
    
    // first, second rows, last, second-to-last rows
    for (i=0; i<w; i++)
    {
        lowpass[i]=0; lowpass[i+w]=0;
        lowpass[i+count-w]=0; lowpass[i+count-w-w]=0;
        
        canny[i]=0; canny[i+count-w]=0;
    }
    // first, second columns, last, second-to-last columns
    for (j=0,k=0; j<h; j++,k+=w)
    {
        lowpass[0+k]=0; lowpass[1+k]=0;
        lowpass[w-1+k]=0; lowpass[w-2+k]=0;
        
        canny[0+k]=0; canny[w-1+k]=0;
    }
    // gauss lowpass
    for (i=2; i<w-2; i++)
    {
        for (j=2,k=(w<<1); j<h-2; j++,k+=w) 
        {
            ind0 = i+k; ind1 = ind0+w; ind2 = ind1+w; 
            ind_1 = ind0-w; ind_2 = ind_1-w; 
            
            // use as simple fixed-point arithmetic as possible (only addition/subtraction and binary shifts)
            // http://stackoverflow.com/questions/11703599/unsigned-32-bit-integers-in-javascript
            // http://stackoverflow.com/questions/6232939/is-there-a-way-to-correctly-multiply-two-32-bit-integers-in-javascript/6422061#6422061
            // http://stackoverflow.com/questions/6798111/bitwise-operations-on-32-bit-unsigned-ints
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#%3E%3E%3E_%28Zero-fill_right_shift%29
            sum = (0
                    + (gray[ind_2-2] << 1) + (gray[ind_1-2] << 2) + (gray[ind0-2] << 2) + (gray[ind0-2])
                    + (gray[ind1-2] << 2) + (gray[ind2-2] << 1) + (gray[ind_2-1] << 2) + (gray[ind_1-1] << 3)
                    + (gray[ind_1-1]) + (gray[ind0-1] << 4) - (gray[ind0-1] << 2) + (gray[ind1-1] << 3)
                    + (gray[ind1-1]) + (gray[ind2-1] << 2) + (gray[ind_2] << 2) + (gray[ind_2]) + (gray[ind_1] << 4)
                    - (gray[ind_1] << 2) + (gray[ind0] << 4) - (gray[ind0]) + (gray[ind1] << 4) - (gray[ind1] << 2)
                    + (gray[ind2] << 2) + (gray[ind2]) + (gray[ind_2+1] << 2) + (gray[ind_1+1] << 3) + (gray[ind_1+1])
                    + (gray[ind0+1] << 4) - (gray[ind0+1] << 2) + (gray[ind1+1] << 3) + (gray[ind1+1]) + (gray[ind2+1] << 2)
                    + (gray[ind_2+2] << 1) + (gray[ind_1+2] << 2) + (gray[ind0+2] << 2) + (gray[ind0+2])
                    + (gray[ind1+2] << 2) + (gray[ind2+2] << 1)
                    );
            
            lowpass[ind0] = ((((103*sum + 8192)&0xFFFFFFFF) >>> 14)&0xFF) >>> 0;
        }
    }
    
    // sobel gradient
    for (i=1; i<w-1 ; i++)
    {
        for (j=1, k=w; j<h-1; j++, k+=w) 
        {
            // compute coords using simple add/subtract arithmetic (faster)
            ind0=k+i; ind1=ind0+w; ind_1=ind0-w; 
            
            grad_x = ((0
                    - lowpass[ind_1-1] 
                    + lowpass[ind_1+1] 
                    - lowpass[ind0-1] - lowpass[ind0-1]
                    + lowpass[ind0+1] + lowpass[ind0+1]
                    - lowpass[ind1-1] 
                    + lowpass[ind1+1]
                    ))
                ;
            grad_y = ((0
                    + lowpass[ind_1-1] 
                    + lowpass[ind_1] + lowpass[ind_1]
                    + lowpass[ind_1+1] 
                    - lowpass[ind1-1] 
                    - lowpass[ind1] - lowpass[ind1]
                    - lowpass[ind1+1]
                    ))
                ;
            
            canny[ind0] = Abs(grad_x) + Abs(grad_y);
        }
    }
    
    // integral gradient
    // first row
    for(i=0,sum=0; i<w; i++)
    {
        sum += canny[i];
        canny[i] = sum;
    }
    // other rows
    for(i=w,k=0,sum=0; i<count; i++,k++)
    {
        if (k>=w) { k=0; sum=0; }
        sum += canny[i];
        canny[i] = canny[i-w] + sum;
    }
}

function haar_detect(feats, w, h, sel_x1, sel_y1, sel_x2, sel_y2, haar, baseScale, scaleIncrement, stepIncrement, integral, tilted, squares, canny, cL, cH)
{
    var doCanny = null != canny,
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
        xsize = ~~(scale * sizex); 
        xstep = ~~(xsize * stepIncrement); 
        ysize = ~~(scale * sizey); 
        ystep = ~~(ysize * stepIncrement);
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
                
                if (doCanny) 
                {
                    // avoid overflow
                    edges_density = inv_area * (canny[p3] - canny[p2] - canny[p1] + canny[p0]);
                    if (edges_density < cL || edges_density > cH) continue;
                }
                
                // pre-compute some values for speed
                
                // avoid overflow
                total_x = inv_area * (integral[p3] - integral[p2] - integral[p1] + integral[p0]);
                // avoid overflow
                total_x2 = inv_area * (squares[p3] - squares[p2] - squares[p1] + squares[p0]);
                
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
                                    x1 = x + ~~(scale * r[0]);
                                    y1 = (y-1 + ~~(scale * r[1])) * selw;
                                    x2 = x + ~~(scale * (r[0] + r[2]));
                                    y2 = (y-1 + ~~(scale * (r[1] + r[2]))) * selw;
                                    x3 = x + ~~(scale * (r[0] - r[3]));
                                    y3 = (y-1 + ~~(scale * (r[1] + r[3]))) * selw;
                                    x4 = x + ~~(scale * (r[0] + r[2] - r[3]));
                                    y4 = (y-1 + ~~(scale * (r[1] + r[2] + r[3]))) * selw;
                                    
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
                                    rect_sum += r[4] * (tilted[x4 + y4] - tilted[x3 + y3] - tilted[x2 + y2] + tilted[x1 + y1]);
                                }
                            }
                            else
                            {
                                // orthogonal rectangle feature, Viola-Jones original
                                for(kr=0; kr<nb_rects; kr++) 
                                {
                                    r = rects[kr];
                                    
                                    // this produces better/larger features, possible rounding effects??
                                    x1 = x-1 + ~~(scale * r[0]); 
                                    x2 = x-1 + ~~(scale * (r[0] + r[2]));
                                    y1 = selw * (y-1 + ~~(scale * r[1])); 
                                    y2 = selw * (y-1 + ~~(scale * (r[1] + r[3])));
                                    
                                    // clamp
                                    x1 = x1<bx1 ? bx1 : (x1>bx2 ? bx2 : x1);
                                    x2 = x2<bx1 ? bx1 : (x2>bx2 ? bx2 : x2);
                                    y1 = y1<by1 ? by1 : (y1>by2 ? by2 : y1);
                                    y2 = y2<by1 ? by1 : (y2>by2 ? by2 : y2);
                                    
                                    // SAT(x-1, y-1) + SAT(x+w-1, y+h-1) - SAT(x-1, y+h-1) - SAT(x+w-1, y-1)
                                    //      x1   y1         x2      y2          x1   y1            x2    y1
                                    rect_sum += r[4] * (integral[x2 + y2]  - integral[x1 + y2] - integral[x2 + y1] + integral[x1 + y1]);
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
    r.x1 = ~~(r.x1+0.5); r.y1 = ~~(r.y1+0.5); 
    r.x2 = ~~(r.x2+0.5); r.y2 = ~~(r.y2+0.5); 
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
FILTER.Create({
    name: "HaarDetectorFilter"
    
    // parameters
    ,_update: false // filter by itself does not alter image data, just processes information
    ,hasMeta: true
    ,haardata: null
    ,objects: null
    ,selection: null
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
        self.objects = null;
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
        self.selection = null;
        self.objects = null;
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
    
    ,select: function( x1, y1, x2, y2) {
        var self = this;
        if ( false === x1 )
        {
            self.selection = null
        }
        else
        {
            self.selection = [
            Min(1.0, Max(0.0, x1||0)),
            Min(1.0, Max(0.0, y1||0)),
            Min(1.0, Max(0.0, x2||0)),
            Min(1.0, Max(0.0, y2||0))
            ];
        }
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
        var self = this;
        var json = {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 //haardata: null
                 baseScale: self.baseScale
                ,scaleIncrement: self.scaleIncrement
                ,stepIncrement: self.stepIncrement
                ,minNeighbors: self.minNeighbors
                ,doCannyPruning: self.doCannyPruning
                ,tolerance: self.tolerance
                ,cannyLow: self.cannyLow
                ,cannyHigh: self.cannyHigh
                ,selection: self.selection
            }
        };
        // avoid unnecessary (large) data transfer
        if ( self._haarchanged )
        {
            json.params.haardata = TypedObj( self.haardata );
            self._haarchanged = false;
        }
        return json;
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            if ( params[HAS]('haardata') ) self.haardata = TypedObj( params.haardata, 1 );
            self.baseScale = params.baseScale;
            self.scaleIncrement = params.scaleIncrement;
            self.stepIncrement = params.stepIncrement;
            self.minNeighbors = params.minNeighbors;
            self.doCannyPruning = params.doCannyPruning;
            self.tolerance = params.tolerance;
            self.cannyLow = params.cannyLow;
            self.cannyHigh = params.cannyHigh;
            self.selection = TypedArray(params.selection, Array);
        }
        return self;
    }
    
    // detected objects are passed as filter metadata (if filter is run in parallel thread)
    ,getMeta: function( ) {
        return FILTER.isWorker ? TypedObj( this.objects ) : this.objects;
    }
    
    ,setMeta: function( meta ) {
        this.objects = "string" === typeof meta ? TypedObj( meta, 1 ) : meta;
        return this;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !self.haardata ) return im;
        
        var imSize = im.length>>>2,
            selection = self.selection || null,
            gray=null, integral=null, squares=null,
            tilted=null, canny=null, 
            x1, y1, x2, y2, features;
        
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
        
        // pre-compute grayscale, integral image, tilted and squares image
        integral_image(im, w, h,
        gray=new Array8U(imSize), integral=new Array32F(imSize), squares=new Array32F(imSize), tilted=new Array32F(imSize));
        
        // pre-compute integral gradient edges if needed
        if ( self.doCannyPruning ) integral_gradient(w, h, gray, canny=new Array32F(imSize));
        
        // synchronous detection loop
        features = new Array(MAX_FEATURES); features.count = 0;
        haar_detect(features, w, h, x1, y1, x2, y2, self.haardata, self.baseScale, self.scaleIncrement, self.stepIncrement, integral, tilted, squares, canny, self.cannyLow, self.cannyHigh);
        // truncate if needed
        if ( features.length > features.count ) features.length = features.count;
        
        // return results as meta
        self.objects = merge_features(features, self.minNeighbors, self.tolerance); 
        
        // return im back
        return im;
    }
});
// expose as static utility methods
FILTER.HaarDetectorFilter.detect = haar_detect;
FILTER.HaarDetectorFilter.merge = merge_features;

}(FILTER);