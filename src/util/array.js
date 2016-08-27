/**
*
* Filter Utils, Array / List utils
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

if ( FILTER.Util.LOADED_ARRAY ) return;
FILTER.Util.LOADED_ARRAY = true;

var ArrayUtil = FILTER.Util.Array = FILTER.Util.Array || {},
    ListUtil = FILTER.Util.List = FILTER.Util.List || {};

ArrayUtil.stride = function array_stride( a, m, n, A, stride, transpose ) {
    A = A||Array; stride = stride||0;
    var i, j, k, size = n*m, b = new A(size<<stride);
    if ( transpose )
    {
        for (k=0,i=0,j=0; k<size; k++,j++)
        {
            if ( j >= n ){ j=0; i++; }
            b[k<<stride] = a[j][i];
        }
    }
    else
    {
        for (k=0,i=0,j=0; k<size; k++,j++)
        {
            if ( j >= n ){ j=0; i++; }
            b[k<<stride] = a[i][j];
        }
    }
    return b;
};

ArrayUtil.unstride = function array_unstride( a, m, n, stride, transpose ) {
    stride = stride||0;
    var i, j, k, size = a.length>>>stride, b;
    if ( transpose )
    {
        for (b=new Array(n),i=0; i<n; i++)
            for(b[i]=new Array(m),k=0,j=0; j<m; j++,k+=n) b[i][j] = a[(k+i)<<stride];
    }
    else
    {
        for (b=new Array(m),k=0,i=0; i<m; i++,k+=n)
            for(b[i]=new Array(n),j=0; j<n; j++) b[i][j] = a[(k+j)<<stride];
    }
    return b;
};

ArrayUtil.copy = function array_copy( ao, ro, co, ai, ri, ci, v0, stride ) {
    var i, j, ko, ki;
    
    v0 = v0 || 0.0;
    if ( null != stride )
    {
        for(i=0,ko=0,ki=0; i<ro; i++,ko+=co,ki+=ci)
            for(j=0; j<co; j++)
                ao[ko+j] = i < ri && j < ci ? ai[(ki+j)<<stride] : v0;
    }
    else
    {
        for(i=0,ko=0,ki=0; i<ro; i++,ko+=co,ki+=ci)
            for(j=0; j<co; j++)
                ao[ko+j] = i < ri && j < ci ? ai[i][j] : v0;
    }
    return ao;
};

ArrayUtil.transpose = function array_transpose( ta, a, r, c, stride ) {
    var i, j, ko, ki;
    if ( null != stride )
    {
        for(i=0,ko=0; i<c; i++,ko+=r)
            for(j=0,ki=0; j<r; j++,ki+=c)
                ta[ko+j] = a[(ki+i)<<stride];
    }
    else
    {
        for(i=0,ko=0; i<c; i++,ko+=r)
            for(j=0; j<r; j++)
                ta[ko+j] = a[j][i];
    }
    return ta;
};

ListUtil.each = function each( x, F, i0, i1, stride, offset ) {
    offset = offset || 0; stride = stride || 0;
    var len = x.length>>>stride;
    if ( arguments.length < 4 ) i1 = len-1;
    if ( 0 > i1 ) i1 += len;
    if ( arguments.length < 3 ) i0 = 0;
    if ( i0 > i1 ) return x;
    var i, j, k, l=i1-i0+1, l1, lr, r=l&15, q=r&1;
    if ( q ) F(x[(i0<<stride)+offset], i0, x, i0, i1);
    for (i=q; i<r; i+=2)
    { 
        k=i0+i; F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
    }
    for (i=r; i<l; i+=16)
    {
        k=i0+i; F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, x, i0, i1);
    }
    return x;
};

}(FILTER);