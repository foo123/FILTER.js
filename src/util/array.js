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

var A32U = FILTER.Array32U, ceil = Math.ceil,
    ArrayUtil = FILTER.Util.Array = FILTER.Util.Array || {},
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

ArrayUtil.pack = function array_pack( a, stride ) {
    stride = stride||0;
    var i, k, ii = 1<<stride, size = a.length, psize = ceil((size>>>stride)/32), p = new A32U(psize);
    for (i=0; i<size; i+=ii)
    {
        if ( 0 < a[i] )
        {
            k = i>>>stride;
            p[k>>>5] |= 1<<(k&31);
        }
    }
    return p;
};

ArrayUtil.unpack = function array_unpack( p, a, size, stride, v0, v1 ) {
    stride = stride||0; v0 = v0||0; v1 = v1||255;
    var i, k, ii = 1<<stride;
    for (i=0; i<size; i+=ii)
    {
        k = i>>>stride;
        a[i] = p[k>>>5] & (1<<(k&31)) ? v1 : v0;
    }
    return a;
};

ArrayUtil.packed_isset = function packed_isset( packed, index ){
    return packed[index>>>5] & (1<<(index&31));
};

ArrayUtil.packed_set = function packed_set( packed, index ){
    packed[index>>>5] |= 1<<(index&31);
};

ArrayUtil.packed_unset = function packed_set( packed, index ){
    packed[index>>>5] &= ~(1<<(index&31));
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