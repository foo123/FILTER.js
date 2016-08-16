/**
*
* Connected Components Extractor Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var A32U = FILTER.Array32U, MODE = FILTER.MODE,
    HUE = FILTER.Color.hue, INTENSITY = FILTER.Color.intensity,
    min = Math.min, max = Math.max, abs = Math.abs, NUM_LABELS = 20;

// adapted from http://xenia.media.mit.edu/~rahimi/connected/

function root_of( id, labels )
{
    while( labels[id][1] !== id )
    {
        // link this node to its parent's parent, just to shorten the tree.
        //merge_box( labels[id][1], labels[labels[id][1]][1], labels );
        //merge_box( id, labels[id][1], labels );
        labels[id][1] = labels[labels[id][1]][1];
        id = labels[id][1];
    }
    return id;
}

function merge( id1, id2, labels )
{
    var r1 = root_of(id1, labels), r2 = root_of(id2, labels);
    if ( r1 !== r2 )
    {
        labels[r1][1] = r2;
        //merge_box( r1, r2, labels );
    }
}

/*function merge_box( id1, id2, labels )
{
    var x1 = min(labels[id1][3],labels[id2][3]),
        y1 = min(labels[id1][4],labels[id2][4]),
        x2 = max(labels[id1][5],labels[id2][5]),
        y2 = max(labels[id1][6],labels[id2][6]);

    labels[id1][3] = x1;
    labels[id1][4] = y1;
    labels[id1][5] = x2;
    labels[id1][6] = y2;
    
    labels[id2][3] = x1;
    labels[id2][4] = y1;
    labels[id2][5] = x2;
    labels[id2][6] = y2;
}*/

function new_label( x, y, labels )
{
    var current = labels.next;
    if ( current+1 > labels.length )
    {
        //if ( labels.highest > 0 ) labels.length = highest_label*2;
        //else labels.length = labels.highest+10;
        Array.prototype.push.apply(labels, new Array(NUM_LABELS));
    }
    labels[current] = [current, current, 0/*, x, y, x, y*/];
    ++labels.next;
    return current;
}

function copy_label( id, x, y, labels )
{
    /*labels[id][3] = min(labels[id][3],x);
    labels[id][4] = min(labels[id][4],y);
    labels[id][5] = max(labels[id][5],x);
    labels[id][6] = max(labels[id][6],y);*/
    return id;
}

function similar_color( im, p1, p2, delta, memo )
{
    return (0===im[p1+3] && 0===im[p2+3]) || (abs(im[p1]-im[p2])<=delta && abs(im[p1+1]-im[p2+1])<=delta && abs(im[p1+2]-im[p2+2])<=delta);
}

function similar_to_color( col, im, p1, delta, memo )
{
    return abs(im[p1]-col[0])<=delta && abs(im[p1+1]-col[1])<=delta && abs(im[p1+2]-col[2])<=delta;
}

function similar_intensity( im, p1, p2, delta, memo )
{
    if ( 0===im[p1+3] && 0===im[p2+3] ) return true;
    var i1 = p1 >>> 2, i2 = p2 >>> 2;
    if ( null == memo[i1] ) memo[i1] = INTENSITY(im[p1],im[p1+1],im[p1+2]);
    if ( null == memo[i2] ) memo[i2] = INTENSITY(im[p2],im[p2+1],im[p2+2]);
    return abs(memo[i1],memo[i2])<=delta;
}

function similar_to_intensity( col, im, p1, delta, memo )
{
    var i1 = p1 >>> 2;
    if ( null == memo[i1] ) memo[i1] = INTENSITY(im[p1],im[p1+1],im[p1+2]);
    return abs(memo[i1],col)<=delta;
}

function similar_hue( im, p1, p2, delta, memo )
{
    if ( 0===im[p1+3] && 0===im[p2+3] ) return true;
    var i1 = p1 >>> 2, i2 = p2 >>> 2;
    if ( null == memo[i1] ) memo[i1] = HUE(im[p1],im[p1+1],im[p1+2]);
    if ( null == memo[i2] ) memo[i2] = HUE(im[p2],im[p2+1],im[p2+2]);
    return abs(memo[i1],memo[i2])<=delta;
}

function similar_to_hue( col, im, p1, delta, memo )
{
    var i1 = p1 >>> 2;
    if ( null == memo[i1] ) memo[i1] = HUE(im[p1],im[p1+1],im[p1+2]);
    return abs(memo[i1],col)<=delta;
}

// TODO: add bounding boxes, so it can be used as connected color/hue detector/tracker as well efficiently
FILTER.Create({
    name: "ConnectedComponentsFilter"
    
    // parameters
    ,connectivity: 4
    ,tolerance: 0.0
    ,mode: MODE.COLOR
    ,color: null
    ,invert: false
    ,box: null
    //,hasMeta: true
    
    // this is the filter constructor
    ,init: function( connectivity, tolerance, mode, color, invert ) {
        var self = this;
        self.connectivity = 8 === connectivity ? 8 : 4;
        self.tolerance = tolerance || 0.0;
        self.mode = mode || MODE.COLOR;
        self.color = null == color ? null : color;
        self.invert = !!invert;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
             connectivity: self.connectivity
            ,tolerance: self.tolerance
            ,color: self.color
            ,invert: self.invert
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.connectivity = params.connectivity;
        self.tolerance = params.tolerance;
        self.color = params.color;
        self.invert = params.invert;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        if ( !self._isOn ) return im;
        
        var i, j, k, imLen = im.length, imSize = imLen>>>2, w4 = w<<2,
            mode = self.mode||MODE.COLOR, invert = self.invert, color = self.color,
            tolerance = min(0.999, max(0.0, self.tolerance||0.0)),
            connectivity = 8 === self.connectivity ? 8 : 4,
            K8_CONNECTIVITY = 8 === connectivity, d0 = K8_CONNECTIVITY ? -1 : 0, k0 = d0<<2,
            mylab, c, r, d, row, labels, labelimg,
            SIMILAR = null, memo = null, SIMILAR_TO = null, background_label = null,
            need_match = null != color, highest, tag//, box
        ;
        
        labels = new Array(NUM_LABELS);
        labels.next = 0;
        labelimg = new A32U(imSize);
        
        if ( MODE.HUE === mode )
        {
            tolerance *= 360;
            SIMILAR = similar_hue;
            memo = new Array(imSize);
            if ( need_match ) SIMILAR_TO = similar_to_hue;
        }
        else if ( MODE.INTENSITY === mode )
        {
            tolerance *= 255;
            SIMILAR = similar_intensity;
            memo = new Array(imSize);
            if ( need_match ) SIMILAR_TO = similar_to_intensity;
        }
        else //if ( MODE.COLOR === mode )
        {
            tolerance *= 255;
            SIMILAR = similar_color;
            if ( need_match )
            {
                color = [(color >>> 16)&255, (color >>> 8)&255, color&255];
                SIMILAR_TO = similar_to_color;
            }
        }
        background_label = need_match ? new_label(0, 0, labels) : null;
        
        labelimg[0] = need_match && !SIMILAR_TO(color, im, 0, tolerance, memo) ? background_label : new_label(0, 0, labels);
        
        // label the first row.
        for(c=1,i=4; c<w; c++,i+4)
            labelimg[c] = need_match && !SIMILAR_TO(color, im, i, tolerance, memo) ? background_label : (SIMILAR(im, i, i-4, tolerance, memo) ? copy_label(labelimg[c-1], c, 0, labels) : new_label(c, 0, labels));

        // label subsequent rows.
        for(r=1,row=w,i=w4; r<h; r++,row+=w,i+=w4)
        {
            // label the first pixel on this row.
            labelimg[row] = need_match && !SIMILAR_TO(color, im, i, tolerance, memo) ? background_label : (SIMILAR(im, i, i-w4, tolerance, memo) ? copy_label(labelimg[row-w], 0, r, labels) : new_label(0, r, labels));

            // label subsequent pixels on this row.
            for(c=1,j=4; c<w; c++,j+=4)
            {
                if ( need_match && !SIMILAR_TO(color, im, i+j, tolerance, memo) )
                {
                    labelimg[row+c] = background_label;
                    continue;
                }
                // inherit label from pixel on the left if we're in the same blob.
                mylab = background_label === labelimg[row+c-1] ? -1 : (SIMILAR(im, i+j, i+j-4, tolerance, memo) ? copy_label(labelimg[row+c-1], c, r, labels) : -1);

                for(d=d0,k=k0; d<1; d++,k+=4)
                {
                    // if we're in the same blob, inherit value from above pixel.
                    // if we've already been assigned, merge its label with ours.
                    if( (background_label !== labelimg[row-w+c+d]) && SIMILAR(im, i+j, i-w4+j+k, tolerance, memo) )
                    {
                        if( mylab >= 0 ) merge(mylab, labelimg[row-w+c+d], labels);
                        else mylab = copy_label(labelimg[row-w+c+d], c+d, r, labels);
                    }
                }
                labelimg[row+c] = mylab >= 0 ? copy_label(mylab, c, r, labels) : new_label(c, r, labels);

                if( K8_CONNECTIVITY && 
                    (background_label !== labelimg[row+c-1]) && 
                    (background_label !== labelimg[row-w+c]) && 
                    SIMILAR(im, i+j-4, i-w4+j, tolerance, memo)
                )
                    merge(labelimg[row+c-1], labelimg[row-w+c], labels);
            }
        }
        
        // relabel image
        if ( 0 === background_label )
        {
            for(i=0,highest=labels.next,tag=0; i<highest; i++)
                if ( i === labels[i][1] ) labels[i][2] = 0 === labels[i][1] ? 0 : ++tag;
        }
        else
        {
            for(i=0,highest=labels.next,tag=0; i<highest; i++)
                if ( i === labels[i][1] ) labels[i][2] = tag++;
        }

        //box = {};
        tag = tag > 0 ? tag : 1;
        if ( invert )
        {
            for(c=0,i=0; i<imLen; i+=4,c++)
            {
                color = labels[root_of(labelimg[c], labels)][2];
                color = (255-255*color/tag)|0;
                im[i] = color; im[i+1] = color; im[i+2] = color; //im[i+3] = 255;
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
        else
        {
            for(c=0,i=0; i<imLen; i+=4,c++)
            {
                color = labels[root_of(labelimg[c], labels)][2];
                color = (255*color/tag)|0;
                im[i] = color; im[i+1] = color; im[i+2] = color; //im[i+3] = 255;
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
        // return the connected image data
        return im;
    }
});

}(FILTER);