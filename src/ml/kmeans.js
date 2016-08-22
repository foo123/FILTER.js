/**
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