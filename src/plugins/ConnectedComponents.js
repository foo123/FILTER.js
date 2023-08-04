/**
*
* Connected Components Extractor
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MODE = FILTER.MODE, A32F = FILTER.Array32F,
    stdMath = Math, min = stdMath.min, max = stdMath.max,
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
            D = new A32F(imSize);

        if (null != color)
        {
            if (MODE.HUE === mode)
            {
                color = cos(toRad*color);
            }
            else if (MODE.COLOR === mode)
            {
                var r = ((color >>> 16)&255)/255, g = ((color >>> 8)&255)/255, b = ((color)&255)/255;
                color = 10000*(r+g+b)/3 + 1000*(r+g)/2 + 100*(g+b)/2 + 10*(r+b)/2 + r;
            }
        }
        // compute an appropriate (relational) dissimilarity matrix, based on filter operation mode
        delta = dissimilarity_rgb_2(im, w, h, 2, D, delta, mode);
        // return the connected image data
        return connected_components(im, w, h, 2, D, self.connectivity, delta, color, self.invert);
    }
});

// private methods
function dissimilarity_rgb_2(im, w, h, stride, D, delta, mode)
{
    var MODE = FILTER.MODE, HUE = FILTER.Color.hue, INTENSITY = FILTER.Color.intensity,
        cos = stdMath.cos, toRad = FILTER.CONST.toRad, i, j, imLen = im.length, dLen = D.length;

    if (0 < stride)
    {
        if (MODE.HUE === mode)
        {
            for (i=0,j=0; j<dLen; i+=4,++j)
                D[j] = 0 === im[i+3] ? 10000 : cos(toRad*HUE(im[i],im[i+1],im[i+2]));
        }
        else if (MODE.INTENSITY === mode)
        {
            delta *= 255;
            for (i=0,j=0; j<dLen; i+=4,++j)
                D[j] = 0 === im[i+3] ? 10000 : INTENSITY(im[i],im[i+1],im[i+2]);
        }
        else if (MODE.GRAY === mode)
        {
            delta *= 255;
            for (i=0,j=0; j<dLen; i+=4,++j)
                D[j] = 0 === im[i+3] ? 10000 : im[i];
        }
        else //if (MODE.COLOR === mode)
        {
            delta = 10000*delta + 1000*delta + 100*delta + 10*delta + delta;
            for (i=0,j=0; j<dLen; i+=4,++j)
                D[j] = 0 === im[i+3] ? 100000 : 10000*(im[i]+im[i+1]+im[i+2])/3/255 + 1000*(im[i]+im[i+1])/2/255 + 100*(im[i+1]+im[i+2])/2/255 + 10*(im[i]+im[i+2])/2/255 + im[i]/255;
        }
    }
    else
    {
        if (MODE.HUE === mode)
        {
            for (i=0,j=0; j<dLen; ++i,++j)
                D[j] = cos(toRad*im[i]);
        }
        else //if ((MODE.INTENSITY === mode) || (MODE.GRAY === mode) || (MODE.COLOR === mode))
        {
            delta *= 255;
            for (i=0,j=0; j<dLen; ++i,++j)
                D[j] = im[i];
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
}
Label.prototype = {
    constructor: Label,
    id: 0,
    root: null
};
function root_of(label)
{
    while (label !== label.root) label = label.root;
    return label;
}
function merge(l1, l2)
{
    l1 = root_of(l1); l2 = root_of(l2);
    if (l1 !== l2) l1.root = l2;
}

// TODO: add bounding boxes, so it can be used as connected color/hue detector/tracker as well efficiently
function connected_components(output, w, h, stride, D, K, delta, V0, invert)
{
    stride = stride|0;
    var i, j, k, len = output.length, size = len>>>stride, K8_CONNECTIVITY = 8 === K,
        mylab, c, r, d, row, numlabels, label, background_label = null,
        need_match = null != V0, color, a, b, delta2 = 2*delta;

    label = new Array(size);
    background_label = need_match ? new Label(0, 0) : null;

    label[0] = need_match && (abs(delta+D[0]-V0)>delta2) ? background_label : new Label(0, 0);

    // label the first row.
    for (c=1; c<w; ++c)
    {
        label[c] = need_match && (abs(delta+D[c]-V0)>delta2) ? background_label : (abs(delta+D[c]-D[c-1])<=delta2 ? label[c-1] : new Label(c, 0));
    }

    // label subsequent rows.
    for (r=1,row=w; r<h; ++r,row+=w)
    {
        // label the first pixel on this row.
        label[row] = need_match && (abs(delta+D[row]-V0)>delta2) ? background_label : (abs(delta+D[row]-D[row-w])<=delta2 ? label[row-w] : new Label(0, r));

        // label subsequent pixels on this row.
        for (c=1; c<w; ++c)
        {
            if (need_match && (abs(delta+D[row+c]-V0)>delta2))
            {
                label[row+c] = background_label;
                continue;
            }
            // inherit label from pixel on the left if we're in the same blob.
            mylab = background_label === label[row+c-1] ? null : (abs(delta+D[row+c]-D[row+c-1])<=delta2 ? label[row+c-1] : null);

            //for(d=d0; d<1; d++)
            // full loop unrolling
            // if we're in the same blob, inherit value from above pixel.
            // if we've already been assigned, merge its label with ours.
            if (K8_CONNECTIVITY)
            {
                //d = -1;
                if((background_label !== label[row-w+c-1/*+d*/]) && (abs(delta+D[row+c]-D[row-w+c-1/*+d*/])<=delta2))
                {
                    if (null != mylab) merge(mylab, label[row-w+c-1/*+d*/]);
                    else mylab = label[row-w+c-1/*+d*/];
                }
            }
            //d = 0;
            if((background_label !== label[row-w+c/*+d*/]) && (abs(delta+D[row+c]-D[row-w+c/*+d*/])<=delta2))
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

            if(K8_CONNECTIVITY &&
                (background_label !== label[row+c-1]) && (background_label !== label[row-w+c]) &&
                (abs(delta+D[row+c-1]-D[row-w+c])<=delta2))
                merge(label[row+c-1], label[row-w+c]);
        }
    }

    if (invert) {a = -255; b = 255;}
    else {a = 255; b = 0;}
    // compute num of distinct labels and assign ids
    if (null != background_label) {background_label.id = 0; numlabels = 1;}
    else {numlabels = 0;}
    for (c=0; c<size; ++c)
    {
        label[c] = root_of(label[c]);
        if (0 > label[c].id) label[c].id = numlabels++;
    }
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
    return output;
}

}(FILTER);