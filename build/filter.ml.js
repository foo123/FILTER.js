/**
*
*   FILTER.js MachineLearning Routines
*   @version: 0.9.6
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Machine Learning Routines)
*   https://github.com/foo123/FILTER.js
*
**/!function( root, factory ){
"use strict";
if ( ('object'===typeof module) && module.exports ) /* CommonJS */
    module.exports = factory.call(root,(module.$deps && module.$deps["FILTER"]) || require("./FILTER".toLowerCase()));
else if ( ("function"===typeof define) && define.amd && ("function"===typeof require) && ("function"===typeof require.specified) && require.specified("FILTER_ML") /*&& !require.defined("FILTER_ML")*/ ) 
    define("FILTER_ML",['module',"FILTER"],function(mod,module){factory.moduleUri = mod.uri; factory.call(root,module); return module;});
else /* Browser/WebWorker/.. */
    (factory.call(root,root["FILTER"])||1)&&('function'===typeof define)&&define.amd&&define(function(){return root["FILTER"];} );
}(  /* current root */          this, 
    /* module factory */        function ModuleFactory__FILTER_ML( FILTER ){
/* main code starts here */

/**
*
*   FILTER.js MachineLearning Routines
*   @version: 0.9.6
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Machine Learning Routines)
*   https://github.com/foo123/FILTER.js
*
**/

/**
*
* Filter Machine Learning Connected Components
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var A32U = FILTER.Array32U, min = Math.min, max = Math.max, NUM_LABELS = 20;

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
function connected_components( labeled_im, im, w, h, connectivity, invert, SIMILAR, SIMILAR_TO, ARGS )
{
    var i, j, k, imLen = im.length, imSize = imLen>>>2, w4 = w<<2,
        K8_CONNECTIVITY = 8 === connectivity, d0 = K8_CONNECTIVITY ? -1 : 0, k0 = 4*d0,
        mylab, c, r, d, row, labels, labelimg, background_label = null,
        need_match = null != SIMILAR_TO, highest, tag, color;//, box
    
    labels = new Array(NUM_LABELS);
    labels.next = 0;
    labelimg = new A32U(imSize);
    background_label = need_match ? new_label(0, 0, labels) : null;

    labelimg[0] = need_match && !SIMILAR_TO(im, 0, ARGS) ? background_label : new_label(0, 0, labels);

    // label the first row.
    for(c=1,i=4; c<w; c++,i+=4)
        labelimg[c] = need_match && !SIMILAR_TO(im, i, ARGS) ? background_label : (SIMILAR(im, i, i-4, ARGS) ? labelimg[c-1]/*copy_label(labelimg[c-1], c, 0, labels)*/ : new_label(c, 0, labels));

    // label subsequent rows.
    for(r=1,row=w,i=w4; r<h; r++,row+=w,i+=w4)
    {
        // label the first pixel on this row.
        labelimg[row] = need_match && !SIMILAR_TO(im, i, ARGS) ? background_label : (SIMILAR(im, i, i-w4, ARGS) ? labelimg[row-w]/*copy_label(labelimg[row-w], 0, r, labels)*/ : new_label(0, r, labels));

        // label subsequent pixels on this row.
        for(c=1,j=4; c<w; c++,j+=4)
        {
            if ( need_match && !SIMILAR_TO(im, i+j, ARGS) )
            {
                labelimg[row+c] = background_label;
                continue;
            }
            // inherit label from pixel on the left if we're in the same blob.
            mylab = background_label === labelimg[row+c-1] ? -1 : (SIMILAR(im, i+j, i+j-4, ARGS) ? labelimg[row+c-1]/*copy_label(labelimg[row+c-1], c, r, labels)*/ : -1);

            for(d=d0,k=k0; d<1; d++,k+=4)
            {
                // if we're in the same blob, inherit value from above pixel.
                // if we've already been assigned, merge its label with ours.
                if( (background_label !== labelimg[row-w+c+d]) && SIMILAR(im, i+j, i-w4+j+k, ARGS) )
                {
                    if( mylab >= 0 ) merge(mylab, labelimg[row-w+c+d], labels);
                    else mylab = labelimg[row-w+c+d]/*copy_label(labelimg[row-w+c+d], c+d, r, labels)*/;
                }
            }
            labelimg[row+c] = mylab >= 0 ? mylab/*copy_label(mylab, c, r, labels)*/ : new_label(c, r, labels);

            if( K8_CONNECTIVITY && 
                (background_label !== labelimg[row+c-1]) && 
                (background_label !== labelimg[row-w+c]) && 
                SIMILAR(im, i+j-4, i-w4+j, ARGS)
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

}(FILTER);/**
*
* Filter Machine Learning K-Means, K-Medoids
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var abs = Math.abs;

// https://en.wikipedia.org/wiki/K-means_clustering
// K = number of clusters
// V = data vectors
// V0 = initial centroids, holds final centroids at the end
// D = dissimilarity/distance measure
// M = merging functional
// epsilon =  accuracy threshold
// return L = Labels for each data vector to associated cluster
FILTER.MachineLearning.kmeans = function kmeans( K, V, V0, D, M, epsilon ){
    epsilon = epsilon || 0.0;
    var k, n, d, d0, v, c, N = V.length, L = new Array(N), DD0, DD;
    while( true )
    {
        // assignment E-step
        for(DD0=0,n=0; n<N; n++)
        {
            v = V[n]; d0 = D(V0[0], v); c = 0;
            for(k=1; k<K; k++)
            {
                d = D(V0[k], v);
                // estimate cluster label
                if ( d < d0 ) { d0 = d; c = k; }
            }
            L[n] = c; DD0 += d0;
        }
        // update M-step
        for(k=0; k<K; k++) V0[k] = null;
        for(n=0; n<N; n++)
        {
            v = V[n]; c = L[n];
            // estimate new centroid
            V0[c] = M(V0[c], v);
        }
        for(DD=0,n=0; n<N; n++) DD += D(V0[L[n]], V[n]);
        // convergence condition
        if ( abs(DD-DD0) <= epsilon ) break;
    }
    return L;
};

// https://en.wikipedia.org/wiki/K-medoids
// K = number of clusters
// V = data vectors
// V0 = indexes of initial medoids, holds indexes to final medoids at the end
// D = dissimilarity/distance measure
// epsilon =  accuracy threshold
// return L = Labels for each data vector to index of associated medoid cluster
FILTER.MachineLearning.kmedoids = function kmedoids( K, V, V0, D, epsilon ){
    epsilon = epsilon || 0.0;
    var k, n, nn, d, d0, v, v0, vn, c, N = V.length, L = new Array(N), DD0, DD, medoid_changed;
    while( true )
    {
        // assignment E-step
        for(DD0=0,n=0; n<N; n++)
        {
            v = V[n]; d0 = D(V0[0], v); c = 0;
            for(k=1; k<K; k++)
            {
                d = D(V0[k], v);
                // estimate cluster medoid index
                if ( d < d0 ) { d0 = d; c = k; }
            }
            L[n] = c; DD0 += d0;
        }
        // update M-step
        k = 0; medoid_changed = false;
        while( k < K && !medoid_changed )
        {
            v0 = V0[k];
            for(n=0; n<N; n++)
            {
                vn = V[n];
                if ( vn === V0[L[n]] ) continue; // it is a medoid, bypass
                // swap medoid
                V0[k] = vn;
                for(DD=0,nn=0; nn<N; nn++) DD += D(V0[L[nn]], V[nn]);
                
                if ( abs(DD)+epsilon < abs(DD0) )
                {
                    medoid_changed = true;
                    break;
                }
                else
                {
                    // restore
                    V0[k] = v0;
                }
            }
            k++;
        }
        // convergence condition
        if ( !medoid_changed ) break;
    }
    return L;
};

}(FILTER);
/* main code ends here */
/* export the module */
return FILTER;
});