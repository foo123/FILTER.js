/**
*
* Filter Machine Learning Connected Components
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var A32U = FILTER.Array32U, min = Math.min, max = Math.max, abs = Math.abs, NUM_LABELS = 20;

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
    if ( current+1 > labels.length ) Array.prototype.push.apply(labels, new Array(NUM_LABELS));
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
// TODO: add bounding boxes, so it can be used as connected color/hue detector/tracker as well efficiently
function connected_components( labeled_im, im, w, h, connectivity, invert, D, delta, V0 )
{
    var i, j, k, imLen = im.length, imSize = imLen>>>2, w4 = w<<2,
        K8_CONNECTIVITY = 8 === connectivity, d0 = K8_CONNECTIVITY ? -1 : 0, k0 = 4*d0,
        mylab, c, r, d, row, labels, labelimg, background_label = null,
        need_match = null != V0, highest, tag, color;//, box
    
    labels = new Array(NUM_LABELS);
    labels.next = 0;
    labelimg = new A32U(imSize);
    background_label = need_match ? new_label(0, 0, labels) : null;

    labelimg[0] = need_match && (abs(D[0]-V0)>delta) ? background_label : new_label(0, 0, labels);

    // label the first row.
    for(c=1,i=4; c<w; c++,i+=4)
        labelimg[c] = need_match && (abs(D[c]-V0)>delta) ? background_label : (abs(D[c]-D[c-1])<=delta ? labelimg[c-1]/*copy_label(labelimg[c-1], c, 0, labels)*/ : new_label(c, 0, labels));

    // label subsequent rows.
    for(r=1,row=w,i=w4; r<h; r++,row+=w,i+=w4)
    {
        // label the first pixel on this row.
        labelimg[row] = need_match && (abs(D[row]-V0)>delta) ? background_label : (abs(D[row]-D[row-w])<=delta ? labelimg[row-w]/*copy_label(labelimg[row-w], 0, r, labels)*/ : new_label(0, r, labels));

        // label subsequent pixels on this row.
        for(c=1,j=4; c<w; c++,j+=4)
        {
            if ( need_match && (abs(D[row+c]-V0)>delta) )
            {
                labelimg[row+c] = background_label;
                continue;
            }
            // inherit label from pixel on the left if we're in the same blob.
            mylab = background_label === labelimg[row+c-1] ? -1 : (abs(D[row+c]-D[row+c-1])<=delta ? labelimg[row+c-1]/*copy_label(labelimg[row+c-1], c, r, labels)*/ : -1);

            for(d=d0,k=k0; d<1; d++,k+=4)
            {
                // if we're in the same blob, inherit value from above pixel.
                // if we've already been assigned, merge its label with ours.
                if( (background_label !== labelimg[row-w+c+d]) && (abs(D[row+c]-D[row-w+c+d])<=delta) )
                {
                    if( mylab >= 0 ) merge(mylab, labelimg[row-w+c+d], labels);
                    else mylab = labelimg[row-w+c+d]/*copy_label(labelimg[row-w+c+d], c+d, r, labels)*/;
                }
            }
            labelimg[row+c] = mylab >= 0 ? mylab/*copy_label(mylab, c, r, labels)*/ : new_label(c, r, labels);

            if( K8_CONNECTIVITY && 
                (background_label !== labelimg[row+c-1]) && 
                (background_label !== labelimg[row-w+c]) && 
                (abs(D[row+c-1]-D[row-w+c])<=delta)
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
            labeled_im[i] = color; labeled_im[i+1] = color; labeled_im[i+2] = color;
            labeled_im[i+3] = im[i+3];
            //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
        }
    }
    else
    {
        for(c=0,i=0; i<imLen; i+=4,c++)
        {
            color = labels[root_of(labelimg[c], labels)][2];
            color = (255*color/tag)|0;
            labeled_im[i] = color; labeled_im[i+1] = color; labeled_im[i+2] = color;
            labeled_im[i+3] = im[i+3];
            //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
        }
    }
    return labeled_im;
}
FILTER.MachineLearning.connected_components = connected_components;

}(FILTER);