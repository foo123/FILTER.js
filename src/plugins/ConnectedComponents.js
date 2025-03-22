/**
*
* Connected Components Extractor
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MODE = FILTER.MODE, A32F = FILTER.Array32F, IMG = FILTER.ImArray,
    FilterUtil = FILTER.Util.Filter,
    stdMath = Math, min = stdMath.min, max = stdMath.max,
    TypedObj = FILTER.Util.Array.typed_obj,
    abs = stdMath.abs, cos = stdMath.cos, toRad = FILTER.CONST.toRad;

FILTER.Create({
    name: "ConnectedComponentsFilter"

    // parameters
    ,connectivity: 4
    ,tolerance: 1e-6
    ,mode: MODE.COLOR
    ,color: null
    ,invert: false
    ,box: null
    //,hasMeta: true

    // this is the filter constructor
    ,init: function(connectivity, tolerance, color, invert) {
        var self = this;
        self.connectivity = 8 === connectivity ? 8 : 4;
        self.tolerance = null == tolerance ? 1e-6 : +tolerance;
        self.color = null == color ? null : +color;
        self.invert = !!invert;
        self.mode = MODE.COLOR;
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,serialize: function() {
        var self = this;
        return {
             connectivity: self.connectivity
            ,tolerance: self.tolerance
            ,color: self.color
            ,invert: self.invert
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.connectivity = params.connectivity;
        self.tolerance = params.tolerance;
        self.color = params.color;
        self.invert = params.invert;
        return self;
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this, imLen = im.length, imSize = imLen>>>2,
            mode = self.mode||MODE.COLOR, color = self.color,
            delta = min(0.999, max(0.0, self.tolerance||0.0)),
            D = new A32F(imSize), cc, i, c, CC, CR, CG, CB;

        if (null != color)
        {
            if (MODE.HUE === mode || MODE.COLORIZEHUE === mode)
            {
                color = cos(toRad*color);
            }
            else if (MODE.COLOR === mode || MODE.COLORIZE === mode)
            {
                var r = ((color >>> 16)&255)/255, g = ((color >>> 8)&255)/255, b = ((color)&255)/255;
                color = 10000*(r+g+b)/3 + 1000*(r+g)/2 + 100*(g+b)/2 + 10*(r+b)/2 + r;
            }
        }
        // compute an appropriate (relational) dissimilarity matrix, based on filter operation mode
        delta = dissimilarity_rgb_2(im, w, h, 2, D, delta, mode);
        if (MODE.COLORIZE === mode || MODE.COLORIZEHUE === mode)
        {
            cc = connected_components(new IMG(imLen), w, h, 2, D, self.connectivity, delta, color, self.invert);
            // colorize each component with average color of region
            CR = new A32F(256);
            CG = new A32F(256);
            CB = new A32F(256);
            CC = new A32F(256);
            for (i=0; i<imLen; i+=4)
            {
                c = cc[i];
                ++CC[c];
                CR[c] += im[i  ];
                CG[c] += im[i+1];
                CB[c] += im[i+2];
            }
            for (i=0; i<256; ++i)
            {
                if (!CC[i]) continue;
                c = CC[i];
                CR[i] /= c;
                CG[i] /= c;
                CB[i] /= c;
            }
            for (i=0; i<imLen; i+=4)
            {
                c = cc[i];
                im[i  ] = CR[c]|0;
                im[i+1] = CG[c]|0;
                im[i+2] = CB[c]|0;
            }
            return im;
        }
        else
        {
            return connected_components(im, w, h, 2, D, self.connectivity, delta, color, self.invert);
        }
    }
});

/*FILTER.Create({
    name: "ColorDetectorFilter"

    // parameters
    ,_update: false // filter by itself does not alter image data, just processes information
    ,hasMeta: true
    ,mode: MODE.COLOR
    ,tolerance: 1e-6
    ,minArea: 20//=Infinity
    ,maxArea: Infinity
    ,color: 0

    // this is the filter constructor
    ,init: function(color) {
        var self = this;
        self.color = color || 0;
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,params: function(params) {
        var self = this;
        if (params)
        {
            if (null != params.tolerance) self.tolerance = params.tolerance || 0;
            if (null != params.minArea) self.minArea = params.minArea;
            if (null != params.maxArea) self.maxArea = params.maxArea;
            if (null != params.color) self.color = params.color || 0;
            if (null != params.selection) self.selection = params.selection || null;
        }
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
            tolerance: self.tolerance
            ,minArea: self.minArea
            ,maxArea: self.maxArea
            ,color: self.color
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.tolerance = params.tolerance;
        self.minArea = params.minArea;
        self.maxArea = params.maxArea;
        self.color = params.color;
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
    ,apply: function(im, w, h) {
        var self = this, imLen = im.length, imSize = imLen>>>2,
            mode = self.mode||MODE.COLOR, color = self.color,
            delta = min(0.999, max(0.0, self.tolerance||0.0)),
            selection = self.selection || null,
            xf, yf, x1, y1, x2, y2, D,
            area, minArea, maxArea;

        self.meta = {matches: []};
        if (null == color) return im;

        if (MODE.HUE === mode)
        {
            color = cos(toRad*color);
        }
        else if (MODE.COLOR === mode)
        {
            var r = ((color >>> 16)&255)/255, g = ((color >>> 8)&255)/255, b = ((color)&255)/255;
            color = 10000*(r+g+b)/3 + 1000*(r+g)/2 + 100*(g+b)/2 + 10*(r+b)/2 + r;
        }
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
            x1 = stdMath.min(w-1, stdMath.max(0, selection[0]*xf));
            y1 = stdMath.min(h-1, stdMath.max(0, selection[1]*yf));
            x2 = stdMath.min(w-1, stdMath.max(0, selection[2]*xf));
            y2 = stdMath.min(h-1, stdMath.max(0, selection[3]*yf));
        }
        else
        {
            x1 = 0; y1 = 0;
            x2 = w-1; y2 = h-1;
        }
        area = (x2-x1+1)*(y2-y1+1);
        // areas can be given as percentages of total area as well
        minArea = 0 < self.minArea && self.minArea < 1 ? (self.minArea*area) : self.minArea;
        maxArea = 0 < self.maxArea && self.maxArea < 1 ? (self.maxArea*area) : self.minArea;
        D = new A32F(area);
        delta = dissimilarity_rgb_2(im, w, h, 2, D, delta, mode, x1, y1, x2, y2);
        self.meta = {matches: connected_components(null, x2-x1+1, y2-y1+1, 0, D, 8, delta, color, false, true, minArea, maxArea, x1, y1, x2, y2)};
        return im;
    }
});*/

// private methods
function dissimilarity_rgb_2(im, w, h, stride, D, delta, mode, x0, y0, x1, y1)
{
    if (null == x0) {x0 = 0; y0 = 0; x1 = w-1; y1 = h-1;}
    var MODE = FILTER.MODE, HUE = FILTER.Color.hue, INTENSITY = FILTER.Color.intensity,
        cos = stdMath.cos, toRad = FILTER.CONST.toRad, i, j, imLen = im.length, dLen = D.length,
        ww = x1 - x0 + 1, hh = y1 - y0 + 1, x, y, yw;

    if (0 < stride)
    {
        if (MODE.HUE === mode || MODE.COLORIZEHUE === mode)
        {
            //delta *= 360;
            for (x=x0,y=y0,yw=y*w,j=0; j<dLen; ++j,++x)
            {
                if (x >= ww) {x=x0; ++y; yw+=w;}
                i = (x + yw) << stride;
                D[j] = 0 === im[i+3] ? 10000 : cos(toRad*HUE(im[i],im[i+1],im[i+2]));
            }
        }
        else if (MODE.INTENSITY === mode)
        {
            delta *= 255;
            for (x=x0,y=y0,yw=y*w,j=0; j<dLen; ++j,++x)
            {
                if (x >= ww) {x=x0; ++y; yw+=w;}
                i = (x + yw) << stride;
                D[j] = 0 === im[i+3] ? 10000 : INTENSITY(im[i],im[i+1],im[i+2]);
            }
        }
        else if (MODE.GRAY === mode)
        {
            delta *= 255;
            for (x=x0,y=y0,yw=y*w,j=0; j<dLen; ++j,++x)
            {
                if (x >= ww) {x=x0; ++y; yw+=w;}
                i = (x + yw) << stride;
                D[j] = 0 === im[i+3] ? 10000 : im[i];
            }
        }
        else //if (MODE.COLOR === mode || MODE.COLORIZE === mode)
        {
            delta = 10000*delta + 1000*delta + 100*delta + 10*delta + delta;
            for (x=x0,y=y0,yw=y*w,j=0; j<dLen; ++j,++x)
            {
                if (x >= ww) {x=x0; ++y; yw+=w;}
                i = (x + yw) << stride;
                D[j] = 0 === im[i+3] ? 100000 : 10000*(im[i]+im[i+1]+im[i+2])/3/255 + 1000*(im[i]+im[i+1])/2/255 + 100*(im[i+1]+im[i+2])/2/255 + 10*(im[i]+im[i+2])/2/255 + im[i]/255;
            }
        }
    }
    else
    {
        if (MODE.HUE === mode || MODE.COLORIZEHUE === mode)
        {
            //delta *= 360;
            for (x=x0,y=y0,yw=y*w,j=0; j<dLen; ++j,++x)
            {
                if (x >= ww) {x=x0; ++y; yw+=w;}
                i = (x + yw);
                D[j] = cos(toRad*im[i]);
            }
        }
        else //if (MODE.INTENSITY === mode || MODE.GRAY === mode || MODE.COLOR === mode || MODE.COLORIZE === mode)
        {
            delta *= 255;
            for (x=x0,y=y0,yw=y*w,j=0; j<dLen; ++j,++x)
            {
                if (x >= ww) {x=x0; ++y; yw+=w;}
                i = (x + yw);
                D[j] = im[i];
            }
        }
    }
    return delta;
}
// adapted from http://xenia.media.mit.edu/~rahimi/connected/
function Label(x, y, root)
{
    var self = this;
    self.id = -1;
    self.root = root || self;
    self.x1 = x; self.y1 = y;
    self.x2 = x; self.y2 = y;
}
Label.prototype = {
    constructor: Label,
    id: 0,
    root: null,
    x1:0,
    y1:0,
    x2:0,
    y2:0,
};
function root_of(label)
{
    var x1 = label.x1, y1 = label.y1, x2 = label.x2, y2 = label.y2;
    while (label !== label.root)
    {
        label = label.root;
        x1 = min(x1, label.x1);
        y1 = min(y1, label.y1);
        x2 = max(x2, label.x2);
        y2 = max(y2, label.y2);
        label.x1 = x1; label.y1 = y1;
        label.x2 = x2; label.y2 = y2;
    }
    return label;
}
function merge(l1, l2)
{
    l1 = root_of(l1); l2 = root_of(l2);
    if (l1 !== l2)
    {
        l1.x1 = l2.x1 = min(l2.x1, l1.x1);
        l1.y1 = l2.y1 = min(l2.y1, l1.y1);
        l1.x2 = l2.x2 = max(l2.x2, l1.x2);
        l1.y2 = l2.y2 = max(l2.y2, l1.y2);
        l1.root = l2;
    }
}

function connected_components(output, w, h, stride, D, K, delta, V0, invert, return_bb, minArea, maxArea, x0, y0, x1, y1)
{
    if (null == x0) {x0 = 0; y0 = 0; x1 = w-1; y1 = h-1;}
    stride = stride|0;
    var i, j, k, len = output ? output.length : ((w*h)<<stride),
        size = len>>>stride,  K8_CONNECTIVITY = 8 === K,
        mylab, c, r, d, row, numlabels, label, background_label = null,
        need_match = null != V0, color, a, b, delta2 = 2*delta,
        /*ww = x1 - x0 + 1, hh = y1 - y0 + 1,*/ total, bb, bbw, bbh, bbarea;

    label = new Array(size);
    background_label = need_match ? new Label(0, 0) : null;

    label[0] = need_match && (abs(D[0]-V0)>delta) ? background_label : new Label(0, 0);

    // label the first row.
    for (c=1; c<w; ++c)
    {
        label[c] = need_match && (abs(D[c]-V0)>delta) ? background_label : (abs(D[c]-D[c-1])<=delta ? label[c-1] : new Label(c, 0));
    }

    // label subsequent rows.
    for (r=1,row=w; r<h; ++r,row+=w)
    {
        // label the first pixel on this row.
        label[row] = need_match && (abs(D[row]-V0)>delta) ? background_label : (abs(D[row]-D[row-w])<=delta ? label[row-w] : new Label(0, r));

        // label subsequent pixels on this row.
        for (c=1; c<w; ++c)
        {
            if (need_match && (abs(D[row+c]-V0)>delta))
            {
                label[row+c] = background_label;
                continue;
            }
            // inherit label from pixel on the left if we're in the same blob.
            mylab = background_label === label[row+c-1] ? null : (abs(D[row+c]-D[row+c-1])<=delta ? label[row+c-1] : null);

            //for(d=d0; d<1; d++)
            // full loop unrolling
            // if we're in the same blob, inherit value from above pixel.
            // if we've already been assigned, merge its label with ours.
            if (K8_CONNECTIVITY)
            {
                //d = -1;
                if ((background_label !== label[row-w+c-1/*+d*/]) && (abs(D[row+c]-D[row-w+c-1/*+d*/])<=delta))
                {
                    if (null != mylab) merge(mylab, label[row-w+c-1/*+d*/]);
                    else mylab = label[row-w+c-1/*+d*/];
                }
            }
            //d = 0;
            if ((background_label !== label[row-w+c/*+d*/]) && (abs(D[row+c]-D[row-w+c/*+d*/])<=delta))
            {
                if (null != mylab) merge(mylab, label[row-w+c/*+d*/]);
                else mylab = label[row-w+c/*+d*/];
            }

            if (null != mylab)
            {
                label[row+c] = mylab;
                /*mylab.root.x2 = max(mylab.root.x2,c);
                mylab.root.y2 = max(mylab.root.y2,r);*/
            }
            else
            {
                label[row+c] = new Label(c, r);
            }

            if (K8_CONNECTIVITY &&
                (background_label !== label[row+c-1]) && (background_label !== label[row-w+c]) &&
                (abs(D[row+c-1]-D[row-w+c])<=delta))
                merge(label[row+c-1], label[row-w+c]);
        }
    }

    if (invert) {a = -255; b = 255;}
    else {a = 255; b = 0;}
    // compute num of distinct labels and assign ids
    if (null != background_label) {background_label.id = 0; numlabels = 1;}
    else {numlabels = 0;}
    if (return_bb) output = {};
    for (c=0; c<size; ++c)
    {
        label[c] = root_of(label[c]);
        if (0 > label[c].id) label[c].id = numlabels++;
        if (return_bb && (background_label !== label[c]))
        {
            bb = output[label[c].id];
            if (!bb)
            {
                output[label[c].id] = {x1:label[c].x1, y1:label[c].y1, x2:label[c].x2, y2:label[c].y2, k:abs(D[c]-V0)};
            }
            else
            {
                bb.x1 = min(bb.x1, label[c].x1);
                bb.y1 = min(bb.y1, label[c].y1);
                bb.x2 = max(bb.x2, label[c].x2);
                bb.y2 = max(bb.y2, label[c].y2);
                bb.k = max(bb.k, abs(D[c]-V0));
            }
        }
    }
    if (return_bb)
    {
        total = w*h;
        output = Object.keys(output).reduce(function(out, id) {
            var bb = output[id], w = bb.x2-bb.x1+1, h = bb.y2-bb.y1+1, area = w*h;
            if ((area < minArea) || (area > maxArea)) return out;
            out.push({x:x0+bb.x1, y:y0+bb.y1, width:w, height:h, area:area, score:bb.k/delta});
            return out;
        }, []);
    }
    else
    {
        // relabel output
        if (stride)
        {
            for (c=0,i=0; i<len; i+=4,++c)
            {
                color = (b+a*label[c].id/numlabels)|0;
                output[i] = output[i+1] = output[i+2] = color;
                //output[i+3] = output[i+3];
            }
        }
        else
        {
            for (c=0; c<len; ++c)
            {
                color = (b+a*label[c].id/numlabels)|0;
                output[c] = color;
            }
        }
    }
    return output;
}
FilterUtil.dissimilarity_rgb_2 = dissimilarity_rgb_2;
FilterUtil.connectedComponents = connected_components;
}(FILTER);