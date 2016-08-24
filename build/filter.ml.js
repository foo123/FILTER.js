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

var A32U = FILTER.Array32U, A8U = FILTER.Array8U,
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
function connected_components( stride, labeled, D, w, h, connectivity, invert, delta, V0 )
{
    var i, j, k, imLen = labeled.length, imSize = imLen>>>stride,
        K8_CONNECTIVITY = 8 === connectivity, d0 = K8_CONNECTIVITY ? -1 : 0,
        mylab, c, r, d, row, labels, labelimg, background_label = null,
        need_match = null != V0, highest, tag, color;//, box
    
    labels = new Array(NUM_LABELS);
    labels.next = 0;
    labelimg = new A32U(imSize);
    background_label = need_match ? new_label(0, 0, labels) : null;

    labelimg[0] = need_match && (abs(D[0]-V0)>delta) ? background_label : new_label(0, 0, labels);

    // label the first row.
    for(c=1; c<w; c++)
        labelimg[c] = need_match && (abs(D[c]-V0)>delta) ? background_label : (abs(D[c]-D[c-1])<=delta ? labelimg[c-1]/*copy_label(labelimg[c-1], c, 0, labels)*/ : new_label(c, 0, labels));

    // label subsequent rows.
    for(r=1,row=w; r<h; r++,row+=w)
    {
        // label the first pixel on this row.
        labelimg[row] = need_match && (abs(D[row]-V0)>delta) ? background_label : (abs(D[row]-D[row-w])<=delta ? labelimg[row-w]/*copy_label(labelimg[row-w], 0, r, labels)*/ : new_label(0, r, labels));

        // label subsequent pixels on this row.
        for(c=1; c<w; c++)
        {
            if ( need_match && (abs(D[row+c]-V0)>delta) )
            {
                labelimg[row+c] = background_label;
                continue;
            }
            // inherit label from pixel on the left if we're in the same blob.
            mylab = background_label === labelimg[row+c-1] ? -1 : (abs(D[row+c]-D[row+c-1])<=delta ? labelimg[row+c-1]/*copy_label(labelimg[row+c-1], c, r, labels)*/ : -1);

            for(d=d0; d<1; d++)
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
        if ( stride )
        {
            for(c=0,i=0; i<imLen; i+=4,c++)
            {
                color = labels[root_of(labelimg[c], labels)][2];
                color = (255-255*color/tag)|0;
                labeled[i] = labeled[i+1] = labeled[i+2] = color;
                //labeled[i+3] = im[i+3];
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
        else
        {
            for(c=0; c<imLen; c++)
            {
                color = labels[root_of(labelimg[c], labels)][2];
                color = (255-255*color/tag)|0;
                labeled[c] = color;
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
    }
    else
    {
        if ( stride )
        {
            for(c=0,i=0; i<imLen; i+=4,c++)
            {
                color = labels[root_of(labelimg[c], labels)][2];
                color = (255*color/tag)|0;
                labeled[i] = labeled[i+1] = labeled[i+2] = color;
                //labeled[i+3] = im[i+3];
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
        else
        {
            for(c=0; c<imLen; c++)
            {
                color = labels[root_of(labelimg[c], labels)][2];
                color = (255*color/tag)|0;
                labeled[c] = color;
                //box[tag] = [mylab[2], mylab[3], mylab[4], mylab[5]];
            }
        }
    }
    return labeled;
}
function connected_component( x0, y0, r0, g0, b0, bounding_box, im, w, h, delta )
{
    var imLen = im.length, imSize = imLen>>>2, xm, ym, xM, yM,
        y, yy, dy = w<<2, ymin = 0, ymax = imLen-dy, xmin = 0, xmax = (w-1)<<2,
        l, i, k, x, x1, x2, yw, stack, slen, segment, notdone, labeled;
        
    xm = x0; ym = y0; xM = x0; yM = y0; 
    labeled = new A8U(imSize);
    stack = new Array(imSize); slen = 0; // pre-allocate and soft push/pop for speed
    
    labeled[(x0+y0)>>>2] = 255;
    if ( y0+dy >= ymin && y0+dy <= ymax ) stack[slen++]=[y0, x0, x0, dy]; /* needed in some cases */
    /*if ( y0 >= ymin && y0 <= ymax)*/ stack[slen++]=[y0+dy, x0, x0, -dy]; /* seed segment (popped 1st) */
    
    while ( 0 < slen ) 
    {
        /* pop segment off stack and fill a neighboring scan line */
        segment = stack[--slen];
        yw = segment[0]+(dy=segment[3]); x1 = segment[1]; x2 = segment[2];
        ym = min(ym, yw); yM = max(yM, yw);
        xm = min(xm, x1); xM = max(xM, x2);
        
        /*
         * segment of scan line y-dy for x1<=x<=x2 was previously filled,
         * now explore adjacent pixels in scan line y
         */
        for (x=x1; x>=xmin; x-=4)
        {
            i = x+yw; k = i>>>2;
            if ( 0===labeled[k] && abs(r0-im[i])<=delta && abs(g0-im[i+1])<=delta && abs(b0-im[i+2])<=delta )
            {
                labeled[k] = 255;
                xm = min(xm, x);
            }
            else break;
        }
        if ( x >= x1 ) 
        {
            // goto skip:
            i = x+yw; k = i>>>2;
            while ( x<=x2 && (0!==labeled[k] || abs(r0-im[i])>delta || abs(g0-im[i+1])>delta || abs(b0-im[i+2])>delta) )
            {
                x+=4;
                i = x+yw; k = i>>>2;
            }
            l = x;
            notdone = (x <= x2);
        }
        else
        {
            l = x+4;
            if ( l < x1 ) 
            {
                if ( yw-dy >= ymin && yw-dy <= ymax ) stack[slen++]=[yw, l, x1-4, -dy];  /* leak on left? */
            }
            x = x1+4;
            notdone = true;
        }
        
        while ( notdone ) 
        {
            i = x+yw; k = i>>>2;
            while ( x<=xmax && 0===labeled[k] && abs(r0-im[i])<=delta && abs(g0-im[i+1])<=delta && abs(b0-im[i+2])<=delta )
            {
                labeled[k] = 255;
                xM = max(xM, x);
                x+=4; i = x+yw; k = i>>>2;
            }
            if ( yw+dy >= ymin && yw+dy <= ymax) stack[slen++]=[yw, l, x-4, dy];
            if ( x > x2+4 ) 
            {
                if ( yw-dy >= ymin && yw-dy <= ymax) stack[slen++]=[yw, x2+4, x-4, -dy];	/* leak on right? */
            }
    /*skip:*/   
            i = x+yw; k = i>>>2;
            while ( x<=x2 && (0!==labeled[k] || abs(r0-im[i])>delta || abs(g0-im[i+1])>delta || abs(b0-im[i+2])>delta) ) 
            {
                x+=4;
                i = x+yw; k = i>>>2;
            }
            l = x;
            notdone = (x <= x2);
        }
    }
    bounding_box[0] = xm; bounding_box[1] = ym;
    bounding_box[2] = xM; bounding_box[3] = yM;
    return labeled;
}

FILTER.MachineLearning.connected_components = connected_components;
FILTER.MachineLearning.connected_component = connected_component;

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

}(FILTER);/**
*
* Filter Machine Learning SVD (Singular Value Decomposition)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// http://numerical.recipes/webnotes/nr3web2.pdf
// http://www.public.iastate.edu/~dicook/JSS/paper/code/svd.c
/* 
 * svdcomp - SVD decomposition routine. 
 * Takes an mxn matrix a and decomposes it into udv, where u,v are
 * left and right orthogonal transformation matrices, and d is a 
 * diagonal matrix of singular values.
 *
 * This routine is adapted from svdecomp.c in XLISP-STAT 2.1 which is 
 * code from Numerical Recipes adapted by Luke Tierney and David Betz.
 *
 * Input to dsvd is as follows:
 *   a = mxn matrix to be decomposed, gets overwritten with u
 *   m = row dimension of a
 *   n = column dimension of a
 *   w = returns the vector of singular values of a
 *   v = returns the right orthogonal transformation matrix
*/

var fabs = Math.abs, sqrt = Math.sqrt, MAX = Math.max, A32F = FILTER.Array32F;

function PYTHAG( a, b )
{
    var at = fabs(a), bt = fabs(b);
    if ( at > bt )       { bt /= at; return at * sqrt(1.0 + bt*bt); }
    else if ( bt > 0.0 ) { at /= bt; return bt * sqrt(1.0 + at*at); }
    else return 0.0;
}
function SIGN( a, b )
{
    return 0 <= b ? fabs(a) : -fabs(a);
}

function svd( a, m, n )
{
    if ( m < n )
    {
        throw "SVD: #rows must be >= #cols";
        return;
    }
    
    var w, u, v, flag, i, its, j, jj, k, l, nm,
        c, f, h, s, x, y, z, maxd,
        anorm = 0.0, g = 0.0, scale = 0.0, rv1;

    maxd = m < n ? n : m;
    rv1 = new A32F(maxd);
    w = new Array(maxd); for(i=0; i<maxd; i++) w[i] = 0;
    for(v=new Array(n),i=0; i<n; i++) for(v[i]=new Array(n),j=0; j<n; j++) v[i][j] = 0;
    for(u=new Array(m),i=0; i<m; i++) for(u[i]=new Array(m),j=0; j<m; j++) u[i][j] = j < n ? a[i][j] : 0;

    /* Householder reduction to bidiagonal form */
    for(i=0; i<n; i++) 
    {
        /* left-hand reduction */
        l = i + 1;
        rv1[i] = scale * g;
        g = s = scale = 0.0;
        if ( i < m ) 
        {
            for(k=i; k<m; k++) scale += fabs(u[k][i]);
            if ( scale )
            {
                for(k=i; k<m; k++) 
                {
                    u[k][i] = u[k][i]/scale;
                    s += u[k][i] * u[k][i];
                }
                f = u[i][i];
                g = -SIGN(sqrt(s), f);
                h = f * g - s;
                u[i][i] = f - g;
                if ( i+1 !== n ) 
                {
                    for(j=l; j<n; j++) 
                    {
                        for(s=0.0,k=i; k<m; k++) s += u[k][i] * u[k][j];
                        f = s / h;
                        for(k=i; k<m; k++) u[k][j] += f * u[k][i];
                    }
                }
                for(k=i; k<m; k++) u[k][i] = u[k][i]*scale;
            }
        }
        w[i] = scale * g;

        /* right-hand reduction */
        g = s = scale = 0.0;
        if ( i < m && i+1 !== n ) 
        {
            for(k=l; k<n; k++) scale += fabs(u[i][k]);
            if ( scale )
            {
                for(k=l; k<n; k++) 
                {
                    u[i][k] = u[i][k]/scale;
                    s += u[i][k] * u[i][k];
                }
                f = u[i][l];
                g = -SIGN(sqrt(s), f);
                h = f * g - s;
                u[i][l] = f - g;
                for(k=l; k<n; k++) rv1[k] = u[i][k] / h;
                if ( i+1 !== m ) 
                {
                    for(j=l; j<m; j++) 
                    {
                        for(s=0.0,k=l; k<n; k++) s += u[j][k] * u[i][k];
                        for(k=l; k<n; k++) u[j][k] += s * rv1[k];
                    }
                }
                for(k=l; k<n; k++) u[i][k] = u[i][k]*scale;
            }
        }
        anorm = MAX(anorm, fabs(w[i])+fabs(rv1[i]));
    }

    /* accumulate the right-hand transformation */
    for(i=n-1; i>=0; i--) 
    {
        if ( i+1 < n ) 
        {
            if ( g ) 
            {
                for(j=l; j<n; j++) v[j][i] = (u[i][j] / u[i][l]) / g;
                /* double division to avoid underflow */
                for(j=l; j<n; j++)
                {
                    for(s=0.0,k=l; k<n; k++) s += u[i][k] * v[k][j];
                    for(k=l; k<n; k++) v[k][j] += s * v[k][i];
                }
            }
            for(j=l; j<n; j++) v[i][j] = v[j][i] = 0.0;
        }
        v[i][i] = 1.0;
        g = rv1[i];
        l = i;
    }

    /* accumulate the left-hand transformation */
    for(i=n-1; i>=0; i--) 
    {
        l = i + 1;
        g = w[i];
        if ( i+1 < n ) for(j=l; j<n; j++) u[i][j] = 0.0;
        if ( g ) 
        {
            g = 1.0 / g;
            if ( i+1 !== n ) 
            {
                for(j=l; j<n; j++) 
                {
                    for(s=0.0,k=l; k<m; k++) s += u[k][i] * u[k][j];
                    f = (s / u[i][i]) * g;
                    for(k=i; k<m; k++) u[k][j] += f * u[k][i];
                }
            }
            for(j=i; j<m; j++) u[j][i] = u[j][i]*g;
        }
        else 
        {
            for(j=i; j<m; j++) u[j][i] = 0.0;
        }
        ++u[i][i];
    }

    /* diagonalize the bidiagonal form */
    for(k=n-1; k>=0; k--) 
    {                             /* loop over singular values */
        for(its=0; its<30; its++) 
        {                         /* loop over allowed iterations */
            flag = 1;
            for(l=k; l>=0; l--) 
            {                     /* test for splitting */
                nm = l - 1;
                if ( fabs(rv1[l]) + anorm === anorm )
                {
                    flag = 0;
                    break;
                }
                if ( fabs(w[nm]) + anorm === anorm ) break;
            }
            if ( flag )
            {
                c = 0.0; s = 1.0;
                for (i=l; i<=k; i++) 
                {
                    f = s * rv1[i];
                    if ( fabs(f) + anorm !== anorm ) 
                    {
                        g = w[i];
                        h = PYTHAG(f, g);
                        w[i] = h; 
                        h = 1.0 / h;
                        c = g * h;
                        s = - f * h;
                        for(j=0; j<m; j++) 
                        {
                            y = u[j][nm];
                            z = u[j][i];
                            u[j][nm] = y * c + z * s;
                            u[j][i] = z * c - y * s;
                        }
                    }
                }
            }
            z = w[k];
            if ( l === k )
            {                  /* convergence */
                if ( z < 0.0 )
                {              /* make singular value nonnegative */
                    w[k] = -z;
                    for(j=0; j<n; j++) v[j][k] = -v[j][k];
                }
                break;
            }
            if ( its >= 30 )
            {
                throw "SVD: No convergence after 30,000! iterations";
                return;
            }

            /* shift from bottom 2 x 2 minor */
            x = w[l];
            nm = k - 1;
            y = w[nm];
            g = rv1[nm];
            h = rv1[k];
            f = ((y - z) * (y + z) + (g - h) * (g + h)) / (2.0 * h * y);
            g = PYTHAG(f, 1.0);
            f = ((x - z) * (x + z) + h * ((y / (f + SIGN(g, f))) - h)) / x;

            /* next QR transformation */
            c = s = 1.0;
            for(j=l; j<=nm; j++) 
            {
                i = j + 1;
                g = rv1[i];
                y = w[i];
                h = s * g;
                g = c * g;
                z = PYTHAG(f, h);
                rv1[j] = z;
                c = f / z;
                s = h / z;
                f = x * c + g * s;
                g = g * c - x * s;
                h = y * s;
                y = y * c;
                for(jj=0; jj<n; jj++) 
                {
                    x = v[jj][j];
                    z = v[jj][i];
                    v[jj][j] = x * c + z * s;
                    v[jj][i] = z * c - x * s;
                }
                z = PYTHAG(f, h);
                w[j] = z;
                if ( z ) 
                {
                    z = 1.0 / z;
                    c = f * z;
                    s = h * z;
                }
                f = (c * g) + (s * y);
                x = (c * y) - (s * g);
                for(jj=0; jj<m; jj++) 
                {
                    y = u[jj][j];
                    z = u[jj][i];
                    u[jj][j] = y * c + z * s;
                    u[jj][i] = z * c - y * s;
                }
            }
            rv1[l] = 0.0;
            rv1[k] = f;
            w[k] = x;
        }
    }
    return [w, u, v];
}
FILTER.MachineLearning.svd = FILTER.MachineLearning.singular_value_decomposition = svd;

}(FILTER);
/* main code ends here */
/* export the module */
return FILTER;
});