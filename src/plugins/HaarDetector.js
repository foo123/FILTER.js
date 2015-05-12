/**
*
* HAAR Feature Detector Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
@@USE_STRICT@@

var Array32F = FILTER.Array32F,
    Array8U = FILTER.Array8U,
    Abs = Math.abs, Max = Math.max, Min = Math.min, 
    Floor = Math.floor, Round = Math.round, Sqrt = Math.sqrt,
    HAS = 'hasOwnProperty'
;


// compute grayscale image, integral image (SAT) and squares image (Viola-Jones) and RSAT (Lienhart)
function integral_image(im, w, h, gray, integral, squares, tilted) 
{
    var imLen=im.length//, count=w*h
        , sum, sum2, i, j, k, y, g
        //, gray = new Array8U(count)
        // Viola-Jones
        //, integral = new Array32F(count), squares = new Array32F(count)
        // Lienhart et al. extension using tilted features
        //, tilted = new Array32F(count)
    ;
    
    // first row
    j=0; i=0; sum=sum2=0; 
    while (j<w)
    {
        // use fixed-point gray-scale transform, close to openCV transform
        // https://github.com/mtschirs/js-objectdetect/issues/3
        // 0,29901123046875  0,58697509765625  0,114013671875 with roundoff
        g = ((4899 * im[i] + 9617 * im[i + 1] + 1868 * im[i + 2]) + 8192) >>> 14;
        
        g &= 255;  
        sum += g;  
        sum2 += /*(*/(g*g); //&0xFFFFFFFF) >>> 0;
        
        // SAT(-1, y) = SAT(x, -1) = SAT(-1, -1) = 0
        // SAT(x, y) = SAT(x, y-1) + SAT(x-1, y) + I(x, y) - SAT(x-1, y-1)  <-- integral image
        
        // RSAT(-1, y) = RSAT(x, -1) = RSAT(x, -2) = RSAT(-1, -1) = RSAT(-1, -2) = 0
        // RSAT(x, y) = RSAT(x-1, y-1) + RSAT(x+1, y-1) - RSAT(x, y-2) + I(x, y) + I(x, y-1)    <-- rotated(tilted) integral image at 45deg
        gray[j] = g;
        integral[j] = sum;
        squares[j] = sum2;
        tilted[j] = g;
        
        j++; i+=4;
    }
    // other rows
    k=0; y=1; j=w; i=(w<<2); sum=sum2=0; 
    while (i<imLen)
    {
        // use fixed-point gray-scale transform, close to openCV transform
        // https://github.com/mtschirs/js-objectdetect/issues/3
        // 0,29901123046875  0,58697509765625  0,114013671875 with roundoff
        g = ((4899 * im[i] + 9617 * im[i + 1] + 1868 * im[i + 2]) + 8192) >>> 14;
        
        g &= 255;  
        sum += g;  
        sum2 += /*(*/(g*g); //&0xFFFFFFFF) >>> 0;
        
        // SAT(-1, y) = SAT(x, -1) = SAT(-1, -1) = 0
        // SAT(x, y) = SAT(x, y-1) + SAT(x-1, y) + I(x, y) - SAT(x-1, y-1)  <-- integral image
        
        // RSAT(-1, y) = RSAT(x, -1) = RSAT(x, -2) = RSAT(-1, -1) = RSAT(-1, -2) = 0
        // RSAT(x, y) = RSAT(x-1, y-1) + RSAT(x+1, y-1) - RSAT(x, y-2) + I(x, y) + I(x, y-1)    <-- rotated(tilted) integral image at 45deg
        gray[j] = g;
        integral[j] = integral[j-w] + sum;
        squares[j] = squares[j-w] + sum2;
        tilted[j] = tilted[j+1-w] + (g + gray[j-w]) + ((y>1) ? tilted[j-w-w] : 0) + ((k>0) ? tilted[j-1-w] : 0);
        
        k++; j++; i+=4; if (k>=w) { k=0; y++; sum=sum2=0; }
    }
}

// compute Canny edges on gray-scale image to speed up detection if possible
function integral_canny(gray, w, h, canny) 
{
    var i, j, k, sum, grad_x, grad_y,
        ind0, ind1, ind2, ind_1, ind_2, count=gray.length, 
        lowpass = new Array8U(count)//, canny = new Array32F(count)
    ;
    
    // first, second rows, last, second-to-last rows
    for (i=0; i<w; i++)
    {
        lowpass[i]=0;
        lowpass[i+w]=0;
        lowpass[i+count-w]=0;
        lowpass[i+count-w-w]=0;
        
        canny[i]=0;
        canny[i+count-w]=0;
    }
    // first, second columns, last, second-to-last columns
    for (j=0, k=0; j<h; j++, k+=w)
    {
        lowpass[0+k]=0;
        lowpass[1+k]=0;
        lowpass[w-1+k]=0;
        lowpass[w-2+k]=0;
        
        canny[0+k]=0;
        canny[w-1+k]=0;
    }
    // gauss lowpass
    for (i=2; i<w-2; i++)
    {
        sum=0;
        for (j=2, k=(w<<1); j<h-2; j++, k+=w) 
        {
            ind0 = i+k;
            ind1 = ind0+w; 
            ind2 = ind1+w; 
            ind_1 = ind0-w; 
            ind_2 = ind_1-w; 
            
            /*
             Original Code
             
            sum = 0;
            sum += 2 * grayImage[- 2 + ind_2];
            sum += 4 * grayImage[- 2 + ind_1];
            sum += 5 * grayImage[- 2 + ind0];
            sum += 4 * grayImage[- 2 + ind1];
            sum += 2 * grayImage[- 2 + ind2];
            sum += 4 * grayImage[- 1 + ind_2];
            sum += 9 * grayImage[- 1 + ind_1];
            sum += 12 * grayImage[- 1 + ind0];
            sum += 9 * grayImage[- 1 + ind1];
            sum += 4 * grayImage[- 1 + ind2];
            sum += 5 * grayImage[0 + ind_2];
            sum += 12 * grayImage[0 + ind_1];
            sum += 15 * grayImage[0 + ind0];
            sum += 12 * grayImage[i + 0 + ind1];
            sum += 5 * grayImage[0 + ind2];
            sum += 4 * grayImage[1 + ind_2];
            sum += 9 * grayImage[1 + ind_1];
            sum += 12 * grayImage[1 + ind0];
            sum += 9 * grayImage[1 + ind1];
            sum += 4 * grayImage[1 + ind2];
            sum += 2 * grayImage[2 + ind_2];
            sum += 4 * grayImage[2 + ind_1];
            sum += 5 * grayImage[2 + ind0];
            sum += 4 * grayImage[2 + ind1];
            sum += 2 * grayImage[2 + ind2];
            */
            
            // use as simple fixed-point arithmetic as possible (only addition/subtraction and binary shifts)
            // http://stackoverflow.com/questions/11703599/unsigned-32-bit-integers-in-javascript
            // http://stackoverflow.com/questions/6232939/is-there-a-way-to-correctly-multiply-two-32-bit-integers-in-javascript/6422061#6422061
            // http://stackoverflow.com/questions/6798111/bitwise-operations-on-32-bit-unsigned-ints
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#%3E%3E%3E_%28Zero-fill_right_shift%29
            sum = /*(*/(0
                    + (gray[ind_2-2] << 1) + (gray[ind_1-2] << 2) + (gray[ind0-2] << 2) + (gray[ind0-2])
                    + (gray[ind1-2] << 2) + (gray[ind2-2] << 1) + (gray[ind_2-1] << 2) + (gray[ind_1-1] << 3)
                    + (gray[ind_1-1]) + (gray[ind0-1] << 4) - (gray[ind0-1] << 2) + (gray[ind1-1] << 3)
                    + (gray[ind1-1]) + (gray[ind2-1] << 2) + (gray[ind_2] << 2) + (gray[ind_2]) + (gray[ind_1] << 4)
                    - (gray[ind_1] << 2) + (gray[ind0] << 4) - (gray[ind0]) + (gray[ind1] << 4) - (gray[ind1] << 2)
                    + (gray[ind2] << 2) + (gray[ind2]) + (gray[ind_2+1] << 2) + (gray[ind_1+1] << 3) + (gray[ind_1+1])
                    + (gray[ind0+1] << 4) - (gray[ind0+1] << 2) + (gray[ind1+1] << 3) + (gray[ind1+1]) + (gray[ind2+1] << 2)
                    + (gray[ind_2+2] << 1) + (gray[ind_1+2] << 2) + (gray[ind0+2] << 2) + (gray[ind0+2])
                    + (gray[ind1+2] << 2) + (gray[ind2+2] << 1)
                    );// &0xFFFFFFFF ) >>> 0;
            
            /*
            Original Code
            
            grad[ind0] = sum/159 = sum*0.0062893081761006;
            */
            
            // sum of coefficients = 159, factor = 1/159 = 0,0062893081761006
            // 2^14 = 16384, 16384/2 = 8192
            // 2^14/159 = 103,0440251572322304 =~ 103 +/- 2^13
            //grad[ind0] = (( ((sum << 6)&0xFFFFFFFF)>>>0 + ((sum << 5)&0xFFFFFFFF)>>>0 + ((sum << 3)&0xFFFFFFFF)>>>0 + ((8192-sum)&0xFFFFFFFF)>>>0 ) >>> 14) >>> 0;
            lowpass[ind0] = ((((103*sum + 8192)&0xFFFFFFFF) >>> 14)&0xFF) >>> 0;
        }
    }
    
    // sobel gradient
    for (i=1; i<w-1 ; i++)
    {
        //sum=0; 
        for (j=1, k=w; j<h-1; j++, k+=w) 
        {
            // compute coords using simple add/subtract arithmetic (faster)
            ind0=k+i;
            ind1=ind0+w; 
            ind_1=ind0-w; 
            
            grad_x = ((0
                    - lowpass[ind_1-1] 
                    + lowpass[ind_1+1] 
                    - lowpass[ind0-1] - lowpass[ind0-1]
                    + lowpass[ind0+1] + lowpass[ind0+1]
                    - lowpass[ind1-1] 
                    + lowpass[ind1+1]
                    ))//&0xFFFFFFFF
                    ;
            grad_y = ((0
                    + lowpass[ind_1-1] 
                    + lowpass[ind_1] + lowpass[ind_1]
                    + lowpass[ind_1+1] 
                    - lowpass[ind1-1] 
                    - lowpass[ind1] - lowpass[ind1]
                    - lowpass[ind1+1]
                    ))//&0xFFFFFFFF
                    ;
            
            //sum += (Abs(grad_x) + Abs(grad_y))&0xFFFFFFFF;
            canny[ind0] = ( Abs(grad_x) + Abs(grad_y) );//&0xFFFFFFFF;
       }
    }
    
    // integral canny
    // first row
    i=0; sum=0;
    while (i<w)
    {
        sum += canny[i];
        canny[i] = sum;//&0xFFFFFFFF;
        i++;
    }
    // other rows
    i=w; k=0; sum=0;
    while (i<count)
    {
        sum += canny[i];
        canny[i] = (canny[i-w] + sum);//&0xFFFFFFFF;
        i++; k++; if (k>=w) { k=0; sum=0; }
    }
    
    return canny;
}

function almost_equal(r1, r2)
{
    var d1=Max(r2.width, r1.width)*0.2, 
        d2=Max(r2.height, r1.height)*0.2;
    //var d1=Max(f.width, this.width)*0.5, d2=Max(f.height, this.height)*0.5;
    //var d2=d1=Max(f.width, this.width, f.height, this.height)*0.4;
    return !!( 
        Abs(r1.x-r2.x) <= d1 && 
        Abs(r1.y-r2.y) <= d2 && 
        Abs(r1.width-r2.width) <= d1 && 
        Abs(r1.height-r2.height) <= d2 
    ); 
}
function add_feat(r1, r2)
{
    r1.x += r2.x; 
    r1.y += r2.y; 
    r1.width += r2.width; 
    r1.height += r2.height; 
}
function is_inside(r1, r2)
{
    return !!( 
        (r1.x >= r2.x) && 
        (r1.y >= r2.y) && 
        (r1.x+r1.width <= r2.x+r2.width) && 
        (r1.y+r1.height <= r2.y+r2.height)
    ); 
}
function snap_to_grid(r)
{
    r.x = ~~(r.x+0.5); 
    r.y = ~~(r.y+0.5); 
    r.width = ~~(r.width+0.5); 
    r.height = ~~(r.height+0.5); 
}
function by_area(r1, r2)
{
    return r2.area-r1.area;
}
// merge the detected features if needed
function merge_features(rects, min_neighbors) 
{
    var rlen=rects.length, ref = new Array(rlen), feats=[], 
        nb_classes = 0, neighbors, r, found=false, i, j, n, t, ri;
    
    // original code
    // find number of neighbour classes
    for (i = 0; i < rlen; i++) ref[i] = 0;
    for (i = 0; i < rlen; i++)
    {
        found = false;
        for (j = 0; j < i; j++)
        {
            if ( almost_equal(rects[j],rects[i]) )
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
    neighbors = new Array(nb_classes);  r = new Array(nb_classes);
    for (i = 0; i < nb_classes; i++) { neighbors[i] = 0;  r[i] = {x:0, y:0, width:0, height: 0}; }
    for (i = 0; i < rlen; i++) { ri=ref[i]; neighbors[ri]++; add_feat(r[ri],rects[i]); }
    for (i = 0; i < nb_classes; i++) 
    {
        n = neighbors[i];
        if (n >= min_neighbors) 
        {
            t=1/(n + n);
            ri = {
                x: t*(r[i].x * 2 + n),  y: t*(r[i].y * 2 + n),
                width: t*(r[i].width * 2 + n),  height: t*(r[i].height * 2 + n)
            };
            
            feats.push(ri);
        }
    }
    
    // filter inside rectangles
    rlen=feats.length;
    for (i=0; i<rlen; i++)
    {
        for (j=i+1; j<rlen; j++)
        {
            if (!feats[i].inside && is_inside(feats[i],feats[j])) { feats[i].inside=true; }
            else if (!feats[j].inside && is_inside(feats[j],feats[i])) { feats[j].inside=true; }
        }
    }
    i=rlen;
    while (--i >= 0) 
    { 
        if (feats[i].inside) 
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
FILTER.Create({
    name: "HaarDetectorFilter"
    
    // parameters
    ,_update: false // filter by itself does not alter image data, just processes information
    ,hasMeta: true
    ,haardata: null
    ,objects: null
    ,baseScale: 1.0
    ,scaleIncrement: 1.25
    ,stepIncrement: 0.5
    ,minNeighbors: 1
    ,doCannyPruning: true
    ,cannyLow: 20
    ,cannyHigh: 100
    ,_haarchanged: false
    
    // this is the filter constructor
    ,init: function( haardata, baseScale, scaleIncrement, stepIncrement, minNeighbors, doCannyPruning ) {
        var self = this;
        self.objects = null;
        self.haardata = haardata || null;
        self.baseScale = undef === baseScale ? 1.0 : baseScale;
        self.scaleIncrement = undef === scaleIncrement ? 1.25 : scaleIncrement;
        self.stepIncrement = undef === stepIncrement ? 0.5 : stepIncrement;
        self.minNeighbors = undef === minNeighbors ? 1 : minNeighbors;
        self.doCannyPruning = undef === doCannyPruning ? true : !!doCannyPruning;
        self._haarchanged = !!self.haardata;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,dispose: function( ) {
        var self = this;
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
    
    ,params: function( params ) {
        var self = this;
        if ( params )
        {
        if ( params[HAS]('baseScale') ) self.baseScale = params.baseScale;
        if ( params[HAS]('scaleIncrement') ) self.scaleIncrement = params.scaleIncrement;
        if ( params[HAS]('stepIncrement') ) self.stepIncrement = params.stepIncrement;
        if ( params[HAS]('minNeighbors') ) self.minNeighbors = params.minNeighbors;
        if ( params[HAS]('doCannyPruning') ) self.doCannyPruning = params.doCannyPruning;
        if ( params[HAS]('cannyLow') ) self.cannyLow = params.cannyLow;
        if ( params[HAS]('cannyHigh') ) self.cannyHigh = params.cannyHigh;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        var json = {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 baseScale: self.baseScale
                ,scaleIncrement: self.scaleIncrement
                ,stepIncrement: self.stepIncrement
                ,minNeighbors: self.minNeighbors
                ,doCannyPruning: self.doCannyPruning
                ,cannyLow: self.cannyLow
                ,cannyHigh: self.cannyHigh
            }
        };
        // avoid unnecessary (large) data transfer
        if ( self._haarchanged )
        {
            json.params.haardata = self.haardata;
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
            
            if ( params[HAS]('haardata') ) self.haardata = params.haardata;
            self.baseScale = params.baseScale;
            self.scaleIncrement = params.scaleIncrement;
            self.stepIncrement = params.stepIncrement;
            self.minNeighbors = params.minNeighbors;
            self.doCannyPruning = params.doCannyPruning;
            self.cannyLow = params.cannyLow;
            self.cannyHigh = params.cannyHigh;
        }
        return self;
    }
    
    // detected objects are passed as filter metadata (if filter is run in parallel thread)
    ,getMeta: function( ) {
        return this.objects;
    }
    
    ,setMeta: function( meta ) {
        this.objects = meta;
        return this;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this, imSize = im.length>>>2
            ,haar = self.haardata, haar_stages = haar.stages
            ,baseScale = self.baseScale
            ,scaleIncrement = self.scaleIncrement
            ,stepIncrement = self.stepIncrement
            ,minNeighbors = self.minNeighbors
            ,doCanny = self.doCannyPruning
            ,cL = self.cannyLow, cH = self.cannyHigh
            ,sizex = haar.size1, sizey = haar.size2
            ,scale, maxScale = Min(w/sizex, h/sizey)
            ,gray, integral, squares, tilted, canny, feats = []
        
            ,imArea1=imSize-1,
            xstep, ystep, xsize, ysize,
            startx = 0, starty = 0, startty,
            x, y, ty, tyw, tys, sl = haar_stages.length,
            p0, p1, p2, p3, xl, yl, s, t,
            bx1, bx2, by1, by2,
            swh, inv_area, total_x, total_x2, vnorm,
            edges_density, pass,
            
            stage, threshold, trees, tl,
            t, cur_node_ind, where, features, feature, rects, nb_rects, thresholdf, 
            rect_sum, kr, r, x1, y1, x2, y2, x3, y3, x4, y4, rw, rh, yw, yh, sum
        ;
        
        integral_image(im, w, h, 
            gray=new Array8U(imSize), 
            integral=new Array32F(imSize), 
            squares=new Array32F(imSize), 
            tilted=new Array32F(imSize)
        );
        if ( doCanny ) 
            integral_canny(gray, w, h, 
                canny=new Array32F(imSize)
            );
        
        // synchronous detection loop
        bx1=0; bx2=w-1; by1=0; by2=imSize-w;
        scale = baseScale;
        while (scale <= maxScale) 
        {
            // Viola-Jones Single Scale Detector
            xsize = ~~(scale * sizex); 
            xstep = ~~(xsize * stepIncrement); 
            ysize = ~~(scale * sizey); 
            ystep = ~~(ysize * stepIncrement);
            //ysize = xsize; ystep = xstep;
            tyw = ysize*w; tys = ystep*w; 
            startty = starty*tys; 
            xl = w-xsize; yl = h-ysize;
            swh = xsize*ysize; inv_area = 1.0/swh;
            
            for (y=starty, ty=startty; y<yl; y+=ystep, ty+=tys) 
            {
                for (x=startx; x<xl; x+=xstep) 
                {
                    p0 = x-1 + ty-w;    p1 = p0 + xsize;
                    p2 = p0 + tyw;    p3 = p2 + xsize;
                    
                    // clamp
                    p0 = (p0<0) ? 0 : (p0>imArea1) ? imArea1 : p0;
                    p1 = (p1<0) ? 0 : (p1>imArea1) ? imArea1 : p1;
                    p2 = (p2<0) ? 0 : (p2>imArea1) ? imArea1 : p2;
                    p3 = (p3<0) ? 0 : (p3>imArea1) ? imArea1 : p3;
                    
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
                    vnorm = (vnorm > 1) ? Sqrt(vnorm) : /*vnorm*/  1 ;  
                    
                    pass = true;
                    for (s = 0; s < sl; s++) 
                    {
                        // Viola-Jones HAAR-Stage evaluator
                        stage = haar_stages[s];
                        threshold = stage.thres;
                        trees = stage.trees; tl = trees.length;
                        sum=0;
                        
                        for (t = 0; t < tl; t++) 
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
                                    for (kr = 0; kr < nb_rects; kr++) 
                                    {
                                        r = rects[kr];
                                        
                                        // this produces better/larger features, possible rounding effects??
                                        x1 = x + ~~(scale * r[0]);
                                        y1 = (y-1 + ~~(scale * r[1])) * w;
                                        x2 = x + ~~(scale * (r[0] + r[2]));
                                        y2 = (y-1 + ~~(scale * (r[1] + r[2]))) * w;
                                        x3 = x + ~~(scale * (r[0] - r[3]));
                                        y3 = (y-1 + ~~(scale * (r[1] + r[3]))) * w;
                                        x4 = x + ~~(scale * (r[0] + r[2] - r[3]));
                                        y4 = (y-1 + ~~(scale * (r[1] + r[2] + r[3]))) * w;
                                        
                                        // clamp
                                        x1 = (x1<bx1) ? bx1 : (x1>bx2) ? bx2 : x1;
                                        x2 = (x2<bx1) ? bx1 : (x2>bx2) ? bx2 : x2;
                                        x3 = (x3<bx1) ? bx1 : (x3>bx2) ? bx2 : x3;
                                        x4 = (x4<bx1) ? bx1 : (x4>bx2) ? bx2 : x4;
                                        y1 = (y1<by1) ? by1 : (y1>by2) ? by2 : y1;
                                        y2 = (y2<by1) ? by1 : (y2>by2) ? by2 : y2;
                                        y3 = (y3<by1) ? by1 : (y3>by2) ? by2 : y3;
                                        y4 = (y4<by1) ? by1 : (y4>by2) ? by2 : y4;
                                        
                                        // RSAT(x-h+w, y+w+h-1) + RSAT(x, y-1) - RSAT(x-h, y+h-1) - RSAT(x+w, y+w-1)
                                        //        x4     y4            x1  y1          x3   y3            x2   y2
                                        rect_sum+= r[4] * (tilted[x4 + y4] - tilted[x3 + y3] - tilted[x2 + y2] + tilted[x1 + y1]);
                                    }
                                }
                                else
                                {
                                    // orthogonal rectangle feature, Viola-Jones original
                                    for (kr = 0; kr < nb_rects; kr++) 
                                    {
                                        r = rects[kr];
                                        
                                        // this produces better/larger features, possible rounding effects??
                                        x1 = x-1 + ~~(scale * r[0]); 
                                        x2 = x-1 + ~~(scale * (r[0] + r[2]));
                                        y1 = (w) * (y-1 + ~~(scale * r[1])); 
                                        y2 = (w) * (y-1 + ~~(scale * (r[1] + r[3])));
                                        
                                        // clamp
                                        x1 = (x1<bx1) ? bx1 : (x1>bx2) ? bx2 : x1;
                                        x2 = (x2<bx1) ? bx1 : (x2>bx2) ? bx2 : x2;
                                        y1 = (y1<by1) ? by1 : (y1>by2) ? by2 : y1;
                                        y2 = (y2<by1) ? by1 : (y2>by2) ? by2 : y2;
                                        
                                        // SAT(x-1, y-1) + SAT(x+w-1, y+h-1) - SAT(x-1, y+h-1) - SAT(x+w-1, y-1)
                                        //      x1   y1         x2      y2          x1   y1            x2    y1
                                        rect_sum+= r[4] * (integral[x2 + y2]  - integral[x1 + y2] - integral[x2 + y1] + integral[x1 + y1]);
                                    }
                                }
                                
                                where = (rect_sum * inv_area < thresholdf * vnorm) ? 0 : 1;
                                // END Viola-Jones HAAR-Leaf evaluator
                                
                                if (where) 
                                {
                                    if (feature.has_r) { sum += feature.r_val; break; } 
                                    else { cur_node_ind = feature.r_node; }
                                } 
                                else 
                                {
                                    if (feature.has_l) { sum += feature.l_val; break; } 
                                    else { cur_node_ind = feature.l_node; }
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
                        feats.push({
                            x: x, y: y,
                            width: xsize,  height: ysize
                        });
                    }
                }
            }
                    
            // increase scale
            scale *= scaleIncrement;
        }
        
        // return results as meta
        self.objects = merge_features(feats, minNeighbors); 
        
        // return im back
        return im;
    }
});

}(FILTER);