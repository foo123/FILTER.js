/**
*
* Connected Components Extractor Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var A32U = FILTER.Array32U, NUM_LABELS = 20;

// adapted from http://xenia.media.mit.edu/~rahimi/connected/

/*
function Similarity( id, sameas, tag )
{
    /*var self = this;
    self.id = id;
    self.sameas = sameas || null;
    self.tag = tag || null;* /
    return [id, sameas || null, tag || null];
}
function is_root_label( id, labels )
{
    return labels[id][1] === id;
}
function is_equivalent( id, sameas, labels )
{
    return root_of(id, labels) === root_of(sameas, labels);
}
*/

function root_of( id, labels )
{
    while( labels[id][1] !== id )
    {
        // link this node to its parent's parent, just to shorten
        // the tree.
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
        //return false;
    }
    //return true;
}

function new_label( labels )
{
    var current = labels.highest;
    if ( current+1 > labels.length )
    {
        //if ( labels.highest > 0 ) labels.length = highest_label*2;
        //else labels.length = labels.highest+10;
        Array.prototype.push.apply(labels, new Array(NUM_LABELS));
    }
    //labels.length = labels.highest+1;
    labels[current] = [current, current/*, null*/]; //Similarity( labels.highest );
    ++labels.highest;
    return current;
}

function SAME( im, p1, p2 )
{
    return (0===im[p1+3] && 0===im[p2+3]) || ((im[p1]===im[p2]) && (im[p1+1]===im[p2+1]) && (im[p1+2]===im[p2+2]) && (im[p1+3]===im[p2+3]));
}

FILTER.Create({
    name: "ConnectedComponentsFilter"
    
    // parameters
    ,connectivity: 4
    
    // this is the filter constructor
    ,init: function( connectivity ) {
        var self = this;
        self.connectivity = 8 === connectivity ? 8 : 4;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                connectivity: self.connectivity
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.connectivity = params.connectivity;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn ) return im;
        
        var i, j, k, imLen = im.length, imSize = imLen>>>2, w4 = w<<2,
            connectivity = 8 === self.connectivity ? 8 : 4,
            K8_CONNECTIVITY = 8 === connectivity, d0 = K8_CONNECTIVITY ? -1 : 0, k0 = d0*4,
            mylab, last_row = 0, c, r, d, row, id, labels, labelimg, tag;
        
        labels = new Array(NUM_LABELS); labels.highest = 0;
        labelimg = new A32U(imSize);
        
        labelimg[0] = new_label( labels );

        // label the first row.
        for(c=1,i=4; c<w; c++,i+4) labelimg[c] = SAME(im, i, i-4) ? labelimg[c-1] : new_label( labels );

        // label subsequent rows.
        for(r=1,row=w,i=w4; r<h; r++,row+=w,i+=w4)
        {
            // label the first pixel on this row.
            labelimg[row] = SAME(im, i, i-w4) ? labelimg[row-w] : new_label( labels );

            // label subsequent pixels on this row.
            for(c=1,j=4; c<w; c++,j+=4)
            {
                // inherit label from pixel on the left if we're in the same blob.
                mylab = SAME(im, i+j, i+j-4) ? labelimg[row+c-1] : -1;

                for(d=d0,k=k0; d<1; d++,k+=4)
                {
                    // if we're in the same blob, inherit value from above pixel.
                    // if we've already been assigned, merge its label with ours.
                    if( SAME(im, i+j, i-w4+j+k) )
                    {
                        if( mylab >= 0 ) merge( mylab, labelimg[row-w+c+d], labels );
                        else mylab = labelimg[row-w+c+d];
                    }
                }
                labelimg[row+c] = mylab >= 0 ? mylab : new_label( labels );

                if( K8_CONNECTIVITY && SAME(im, i+j-4, i-w4+j) )
                    merge( labelimg[row+c-1], labelimg[row-w+c], labels );
            }
        }
        
        // relabel image
        //for(id=0; id<sl; ++id) if(is_root_label(id)) labels[id].tag = newtag++;
        var highest = labels.highest > 0 ? labels.highest-1 : 1;
        for(c=0,i=0; i<imLen; i+=4,c++)
        {
            tag = ~~(255-255*labels[root_of(labelimg[c], labels)][0]/highest);
            im[i] = tag; im[i+1] = tag; im[i+2] = tag; im[i+3] = 255;
        }

        // return the labeled image data
        return im;
    }
});

}(FILTER);