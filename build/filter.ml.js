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
    if ( q ) F(x[(i0<<stride)+offset], i0, i0, i1);
    for (i=q; i<r; i+=2)
    { 
        k=i0+i; F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
    }
    for (i=r; i<l; i+=16)
    {
        k=i0+i; F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
        ++k;    F(x[(k<<stride)+offset], k, i0, i1);
    }
    return x;
};

}(FILTER);/**
*
* Filter Utils, BLAS (Basic Linear Algebra Subroutines)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

if ( FILTER.Util.LOADED_BLAS ) return;
FILTER.Util.LOADED_BLAS = true;

var BLAS = FILTER.Util.BLAS = FILTER.Util.BLAS || {},
    fabs = Math.abs, fmax = Math.max, fmin = Math.min,
    sqrt = Math.sqrt/*, sign = Math.sign*/;

function sign( x )
{
    return 0 > x ? -1.0 : 1.0;
}

// BLAS 1
BLAS.axpy = function axpy( n, da, dx, dx0, incx, dy, dy0, incy ) {
    // AXPY computes constant times a vector plus a vector.
    var i, ix, iy, m;
    if ( 0 >= n || 0.0 === da ) return;
    ix = dx0 + (0 <= incx ? 0 : ( - n + 1 ) * incx);
    iy = dy0 + (0 <= incy ? 0 : ( - n + 1 ) * incy);
    m = n & 7;
    for(i=0; i<m; i++)
    {
        dy[iy] += da * dx[ix]; ix+=incx; iy+=incy;
    }
    for(i=m; i<n; i+=8)
    {
        dy[iy] += da * dx[ix]; ix+=incx; iy+=incy;
        dy[iy] += da * dx[ix]; ix+=incx; iy+=incy;
        dy[iy] += da * dx[ix]; ix+=incx; iy+=incy;
        dy[iy] += da * dx[ix]; ix+=incx; iy+=incy;
        dy[iy] += da * dx[ix]; ix+=incx; iy+=incy;
        dy[iy] += da * dx[ix]; ix+=incx; iy+=incy;
        dy[iy] += da * dx[ix]; ix+=incx; iy+=incy;
        dy[iy] += da * dx[ix]; ix+=incx; iy+=incy;
    }
};
BLAS.dot = function dot( n, dx, dx0, incx, dy, dy0, incy ) {
    // DOT forms the dot product of two vectors.
    var sum, i, ix, iy, m;
    if ( 0 >= n ) return 0.0;
    ix = dx0 + (0 <= incx ? 0 : ( - n + 1 ) * incx);
    iy = dy0 + (0 <= incy ? 0 : ( - n + 1 ) * incy);
    m = n & 7;
    for(sum=0.0,i=0; i<m; i++)
    {
        sum += dx[ix] * dy[iy]; ix+=incx; iy+=incy;
    }
    for(i=m; i<n; i+=8)
    {
        sum += dx[ix] * dy[iy]; ix+=incx; iy+=incy;
        sum += dx[ix] * dy[iy]; ix+=incx; iy+=incy;
        sum += dx[ix] * dy[iy]; ix+=incx; iy+=incy;
        sum += dx[ix] * dy[iy]; ix+=incx; iy+=incy;
        sum += dx[ix] * dy[iy]; ix+=incx; iy+=incy;
        sum += dx[ix] * dy[iy]; ix+=incx; iy+=incy;
        sum += dx[ix] * dy[iy]; ix+=incx; iy+=incy;
        sum += dx[ix] * dy[iy]; ix+=incx; iy+=incy;
    }
    return sum;
};
BLAS.asum = function asum( n, dx, dx0, incx ) {
    // ASUM takes the sum of the absolute values of a vector.
    var sum, i, ix, m;
    if ( 0 >= n ) return 0.0;
    ix = dx0 + (0 <= incx ? 0 : ( - n + 1 ) * incx);
    m = n & 7;
    for(sum=0.0,i=0; i<m; i++)
    {
        sum += fabs(dx[ix]); ix+=incx;
    }
    for(i=m; i<n; i+=8)
    {
        sum += fabs(dx[ix]); ix+=incx;
        sum += fabs(dx[ix]); ix+=incx;
        sum += fabs(dx[ix]); ix+=incx;
        sum += fabs(dx[ix]); ix+=incx;
        sum += fabs(dx[ix]); ix+=incx;
        sum += fabs(dx[ix]); ix+=incx;
        sum += fabs(dx[ix]); ix+=incx;
        sum += fabs(dx[ix]); ix+=incx;
    }
    return sum;
};
BLAS.nrm2 = function nrm2( n, x, x0, incx ) {
    // NRM2 returns the euclidean norm of a vector.
    var absxi, i, ix, norm, scale, ssq, value;

    if ( 1 > n || 1 > incx )
    {
        norm = 0.0;
    }
    else if ( 1 === n )
    {
        norm = fabs( x[x0] );
    }
    else
    {
        scale = 0.0; ssq = 1.0;
        for (i=0,ix=x0; i<n; i++,ix+=incx)
        {
            if ( 0.0 === x[ix] ) continue;
            absxi = fabs ( x[ix] );
            if ( scale < absxi )
            {
                ssq = 1.0 + ssq * ( scale / absxi ) * ( scale / absxi );
                scale = absxi;
            }
            else
            {
                ssq += ( absxi / scale ) * ( absxi / scale );
            }
        }
        norm  = scale * sqrt ( ssq );
    }
    return norm;
};
BLAS.scal = function scal( n, sa, x, x0, incx ) {
    // SCAL scales a vector by a constant.
    var i, ix, m;
    if ( 0 >= n ) return;
    ix = x0 + (0 <= incx ? 0 : ( - n + 1 ) * incx);
    m = n & 7;
    for(i=0; i<m; i++)
    {
        x[ix] *= sa; ix+=incx;
    }
    for(i=m; i<n; i+=8)
    {
        x[ix] *= sa; ix+=incx;
        x[ix] *= sa; ix+=incx;
        x[ix] *= sa; ix+=incx;
        x[ix] *= sa; ix+=incx;
        x[ix] *= sa; ix+=incx;
        x[ix] *= sa; ix+=incx;
        x[ix] *= sa; ix+=incx;
        x[ix] *= sa; ix+=incx;
    }
};
BLAS.swap = function swap( n, x, x0, incx, y, y0, incy ) {
    // SWAP interchanges two vectors.
    var i, ix, iy, m, tmp;
    if ( 0 >= n ) return;
    ix = x0 + ( 0 <= incx ? 0 : ( - n + 1 ) * incx);
    iy = y0 + (0 <= incy ? 0 : ( - n + 1 ) * incy);
    m = n & 7;
    for(i=0; i<m; i++)
    {
        tmp = x[ix]; x[ix] = y[iy]; y[iy] = tmp; ix+=incx; iy+=incy;
    }
    for(i=m; i<n; i+=8)
    {
        tmp = x[ix]; x[ix] = y[iy]; y[iy] = tmp; ix+=incx; iy+=incy;
        tmp = x[ix]; x[ix] = y[iy]; y[iy] = tmp; ix+=incx; iy+=incy;
        tmp = x[ix]; x[ix] = y[iy]; y[iy] = tmp; ix+=incx; iy+=incy;
        tmp = x[ix]; x[ix] = y[iy]; y[iy] = tmp; ix+=incx; iy+=incy;
        tmp = x[ix]; x[ix] = y[iy]; y[iy] = tmp; ix+=incx; iy+=incy;
        tmp = x[ix]; x[ix] = y[iy]; y[iy] = tmp; ix+=incx; iy+=incy;
        tmp = x[ix]; x[ix] = y[iy]; y[iy] = tmp; ix+=incx; iy+=incy;
        tmp = x[ix]; x[ix] = y[iy]; y[iy] = tmp; ix+=incx; iy+=incy;
    }
};
BLAS.copy = function copy( n, x, x0, incx, y, y0, incy ) {
    // COPY copies a vector into another vector.
    var i, ix, iy, m, tmp;
    if ( 0 >= n ) return;
    ix = x0 + ( 0 <= incx ? 0 : ( - n + 1 ) * incx);
    iy = y0 + (0 <= incy ? 0 : ( - n + 1 ) * incy);
    m = n & 7;
    for(i=0; i<m; i++)
    {
        y[iy] = x[ix]; ix+=incx; iy+=incy;
    }
    for(i=m; i<n; i+=8)
    {
        y[iy] = x[ix]; ix+=incx; iy+=incy;
        y[iy] = x[ix]; ix+=incx; iy+=incy;
        y[iy] = x[ix]; ix+=incx; iy+=incy;
        y[iy] = x[ix]; ix+=incx; iy+=incy;
        y[iy] = x[ix]; ix+=incx; iy+=incy;
        y[iy] = x[ix]; ix+=incx; iy+=incy;
        y[iy] = x[ix]; ix+=incx; iy+=incy;
        y[iy] = x[ix]; ix+=incx; iy+=incy;
    }
};
BLAS.rot = function rot( n, x, x0, incx, y, y0, incy, c,  s ) {
    // ROT applies a plane rotation.
    var i, ix, iy, xi, m;
    if ( 0 >= n ) return;
    ix = x0 + (0 <= incx ? 0 : ( - n + 1 ) * incx);
    iy = y0 + (0 <= incy ? 0 : ( - n + 1 ) * incy);
    m = n & 7;
    for(i=0; i<m; i++)
    {
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=incx; iy+=incy;
    }
    for(i=m; i<n; i+=8)
    {
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=incx; iy+=incy;
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=incx; iy+=incy;
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=incx; iy+=incy;
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=incx; iy+=incy;
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=incx; iy+=incy;
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=incx; iy+=incy;
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=incx; iy+=incy;
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=incx; iy+=incy;
    }
};
BLAS.rotg = function rotg( t /*sa, sb, c, s*/ ) {
    // ROTG constructs a Givens plane rotation.
    var r, roe, scale, z;

    roe = fabs( t[1] ) < fabs( t[0] ) ? t[0] : t[1];
    scale = fabs( t[0] ) + fabs( t[1] );

    if ( 0.0 === scale )
    {
        t[2] = 1.0;
        t[3] = 0.0;
        r = 0.0;
    }
    else
    {
        r = scale * sqrt ( ( t[0] / scale ) * ( t[0] / scale ) + ( t[1] / scale ) * ( t[1] / scale ) );
        r = sign ( roe ) * r;
        t[2] = t[0] / r;
        t[3] = t[1] / r;
    }
    z = 0.0 < fabs( t[2] ) && fabs( t[2] ) <= t[3] ? 1.0 / t[2] : t[3];
    t[0] = r; t[1] = z;
};

// BLAS 2
BLAS.gemv = function gemv( transpose, m, n, alpha, a, lda, x, x0, incx, beta, y, y0, incy ) {
    // GEMV computes y := alpha * A * x + beta * y for general matrix A.
    var i, ix, iy, j, jx, jy, kx, ky, lenx, leny, temp;
    
    // Test the input parameters.
    if ( m < 0 ) return 2;
    else if ( n < 0 ) return 3;
    else if ( lda < fmax ( 1, m ) ) return 6;
    else if ( 0 === incx ) return 8;
    else if ( 0 === incy ) return 11;

    // Quick return if possible.
    if ( ( 0 === m ) || ( 0 === n ) || ( ( 0.0 === alpha ) && ( 1.0 === beta ) ) ) return 0;
    
    // Set LENX and LENY, the lengths of the vectors x and y, and set
    // up the start points in X and Y.
    if ( transpose )
    {
        lenx = m;
        leny = n;
    }
    else
    {
        lenx = n;
        leny = m;
    }

    kx = x0 + (0 < incx ? 0 : 0 - ( lenx - 1 ) * incx);
    ky = y0 + (0 < incy ? 0 : 0 - ( leny - 1 ) * incy);
    
    // Start the operations. In this version the elements of A are
    // accessed sequentially with one pass through A.

    // First form  y := beta*y.
    if ( 1.0 !== beta )
    {
        iy = ky;
        if ( 0.0 === beta )
        {
            for(i=0; i<leny; i++)
            {
                y[iy] = 0.0; iy += incy;
            }
        }
        else
        {
            for(i=0; i<leny; i++)
            {
                y[iy] = beta * y[iy]; iy += incy;
            }
        }
    }
    if ( 0.0 === alpha ) return 0;
    
    if ( transpose )
    {
        // Form y := alpha*A'*x + y.
        jy = ky;
        for(j=0; j<n; j++)
        {
            temp = 0.0;
            ix = kx;
            for(i=0; i<m; i++)
            {
                temp = temp + a[i+j*lda] * x[ix];
                ix += incx;
            }
            y[jy] += alpha * temp;
            jy += incy;
        }
    }
    else
    {
        // Form y := alpha*A*x + y.
        jx = kx;
        for(j=0; j<n; j++)
        {
            if ( 0.0 !== x[jx] )
            {
                temp = alpha * x[jx];
                iy = ky;
                for(i=0; i<m; i++)
                {
                    y[iy] += temp * a[i+j*lda];
                    iy += incy;
                }
            }
            jx += incx;
        }
    }
    return 0;
};
BLAS.ger = function ger( m, n, alpha, x, x0, incx, y, y0, incy, a, lda ) {
    //DGER computes A := alpha*x*y' + A.
    var i, ix, j, jy, kx, temp;
    
    // Test the input parameters.
    if ( m < 0 ) return 1;
    else if ( n < 0 ) return 2;
    else if ( 0 === incx ) return 5;
    else if ( 0 === incy ) return 7;
    else if ( lda < fmax ( 1, m ) ) return 9;

    // Quick return if possible.
    if ( 0 === m || 0 === n || 0.0 === alpha ) return 0;
    
    // Start the operations. In this version the elements of A are
    // accessed sequentially with one pass through A.
    
    jy = y0 + (0 < incy ? 0 : 0 - ( n - 1 ) * incy);
    kx = x0 + (0 < incx ? 0 : 0 - ( m - 1 ) * incx);
    for(j=0; j<n; j++)
    {
        if ( 0.0 !== y[jy] )
        {
            temp = alpha * y[jy];
            ix = kx;
            for(i=0; i<m; i++)
            {
                a[i+j*lda] += x[ix] * temp;
                ix += incx;
            }
        }
        jy += incy;
    }
    return 0;
};

// BLAS 3
BLAS.gemm = function gemm( transa, transb, m, n, k, alpha, a, lda, b, ldb, beta, c, ldc ) {
    // DGEMM computes C = alpha * A * B and related operations.
    var i, j, l, ncola, nrowa, nrowb, nota, notb, temp;
    /*
    Set NOTA and NOTB as true if A and B respectively are not
    transposed and set NROWA, NCOLA and NROWB as the number of rows
    and columns of A and the number of rows of B respectively.
    */
    nota = !transa;
    if ( nota )
    {
        nrowa = m;
        ncola = k;
    }
    else
    {
        nrowa = k;
        ncola = m;
    }

    notb = !transb;
    if ( notb )
    {
        nrowb = k;
    }
    else
    {
        nrowb = n;
    }
    
    // Test the input parameters.
    if ( m < 0 ) return 1;
    if ( n < 0 ) return 2;
    if ( k  < 0 ) return 3;
    if ( lda < fmax ( 1, nrowa ) ) return 4;
    if ( ldb < fmax ( 1, nrowb ) ) return 5;
    if ( ldc < fmax ( 1, m ) ) return 6;
    
    // Quick return if possible.
    if ( 0 === m || 0 === n || ( ( 0.0 === alpha || 0 === k ) && ( 1.0 === beta ) ) ) return 0;
    
    // And if alpha is 0.0.
    if ( 0.0 === alpha )
    {
        if ( 0.0 === beta )
        {
            for(j=0; j<n; j++)for(i=0; i<m; i++)
                c[i+j*ldc] = 0.0;
        }
        else
        {
            for(j=0; j<n; j++)for(i=0; i<m; i++)
                c[i+j*ldc] *= beta;
        }
        return 0;
    }
    
    // Start the operations.
    if ( notb )
    {
        if ( nota )
        {
            // Form  C := alpha*A*B + beta*C.
            for(j=0; j<n; j++)
            {
                if ( 0.0 === beta )
                {
                    for(i=0; i<m; i++)
                        c[i+j*ldc] = 0.0;
                }
                else if ( 0.0 !== beta )
                {
                    for(i=0; i<m; i++)
                        c[i+j*ldc] *= beta;
                }

                for(l=0; l<k; l++)
                {
                    temp = b[l+j*ldb];
                    if ( 0.0 !== temp )
                    {
                        temp *= alpha;
                        for(i=0; i<m; i++)
                            c[i+j*ldc] += temp * a[i+l*lda];
                    }
                }
            }
        }
        else
        {
            // Form  C := alpha*A'*B + beta*C
            for(j=0; j<n; j++)
            {
                for(i=0; i<m; i++)
                {
                    temp = 0.0;
                    for(l=0; l<k; l++) temp += a[l+i*lda] * b[l+j*ldb];

                    if ( 0.0 === beta )
                    {
                        c[i+j*ldc] = alpha * temp;
                    }
                    else
                    {
                        c[i+j*ldc] = alpha * temp + beta * c[i+j*ldc];
                    }
                }
            }
        }
    }
    else
    {
        if ( nota )
        {
            // Form  C := alpha*A*B' + beta*C
            for(j=0; j<n; j++)
            {
                if ( 0.0 === beta )
                {
                    for ( i = 0; i < m; i++ )
                        c[i+j*ldc] = 0.0;
                }
                else if ( 1.0 !== beta )
                {
                    for ( i = 0; i < m; i++ )
                        c[i+j*ldc] *= beta;
                }

                for(l=0; l<k; l++)
                {
                    temp = b[j+l*ldb];
                    if ( 0.0 !== temp )
                    {
                        temp *= alpha;
                        for(i=0; i<m; i++)
                            c[i+j*ldc] += temp * a[i+l*lda];
                    }
                }
            }
        }
        else
        {
            // Form  C := alpha*A'*B' + beta*C
            for(j=0; j<n; j++)
            {
                for(i=0; i<m; i++)
                {
                    temp = 0.0;
                    for(l=0; l<k; l++) temp += a[l+i*lda] * b[j+l*ldb];
                    if ( 0.0 === beta )
                    {
                        c[i+j*ldc] = alpha * temp;
                    }
                    else
                    {
                        c[i+j*ldc] = alpha * temp + beta * c[i+j*ldc];
                    }
                }
            }
        }
    }
    return 0;
};

}(FILTER);/**
*
* Filter Machine Learning Connected Components
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var A32I = FILTER.Array32I, A32U = FILTER.Array32U, A8U = FILTER.Array8U,
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
        l, i, k, x, x1, x2, yw, stack, slen, notdone, labeled;
        
    xm = x0; ym = y0; xM = x0; yM = y0; 
    labeled = new A8U(imSize);
    stack = new A32I(imSize<<2); slen = 0; // pre-allocate and soft push/pop for speed
    
    labeled[(x0+y0)>>>2] = 255;
    if ( y0+dy >= ymin && y0+dy <= ymax )
    {
        /* needed in some cases */
        stack[slen  ]=y0;
        stack[slen+1]=x0;
        stack[slen+2]=x0;
        stack[slen+3]=dy;
        slen += 4;
    }
    /*if ( y0 >= ymin && y0 <= ymax)*/
    /* seed segment (popped 1st) */
    stack[slen  ]=y0+dy;
    stack[slen+1]=x0;
    stack[slen+2]=x0;
    stack[slen+3]=-dy;
    slen += 4;
    
    while ( 0 < slen ) 
    {
        /* pop segment off stack and fill a neighboring scan line */
        slen -= 4;
        dy = stack[slen+3];
        yw = stack[slen  ]+dy;
        x1 = stack[slen+1];
        x2 = stack[slen+2];
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
                if ( yw-dy >= ymin && yw-dy <= ymax )
                {
                    //stack[slen++]=[yw, l, x1-4, -dy];  /* leak on left? */
                    stack[slen  ]=yw;
                    stack[slen+1]=l;
                    stack[slen+2]=x1-4;
                    stack[slen+3]=-dy;
                    slen += 4;
                }
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
            if ( yw+dy >= ymin && yw+dy <= ymax)
            {
                //stack[slen++]=[yw, l, x-4, dy];
                stack[slen  ]=yw;
                stack[slen+1]=l;
                stack[slen+2]=x-4;
                stack[slen+3]=dy;
                slen += 4;
            }
            if ( x > x2+4 ) 
            {
                if ( yw-dy >= ymin && yw-dy <= ymax)
                {
                    //stack[slen++]=[yw, x2+4, x-4, -dy];	/* leak on right? */
                    stack[slen  ]=yw;
                    stack[slen+1]=x2+4;
                    stack[slen+2]=x-4;
                    stack[slen+3]=-dy;
                    slen += 4;
                }
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

// adapted from:
// http://numerical.recipes/webnotes/nr3web2.pdf
// https://people.sc.fsu.edu/~jburkardt/c_src/svd_truncated/svd_truncated.html

var A32F = FILTER.Array32F, fabs = Math.abs, sqrt = Math.sqrt, MAX = Math.max, MIN = Math.min, //sign = Math.sign,
    BLAS = FILTER.Util.BLAS, array_copy = FILTER.Util.Array.copy, array_transpose = FILTER.Util.Array.transpose,
    daxpy = BLAS.axpy, ddot = BLAS.dot, dnrm2 = BLAS.nrm2, dscal = BLAS.scal, dswap = BLAS.swap, drot = BLAS.rot,
    drotg = BLAS.rotg;

function sign( x )
{
    return 0 > x ? -1.0 : 1.0;
}

function svd_err( norm, r, c, a, s, u, v )
{
    // Check the factorization by computing A = U * S * V'
    var i, j, k, ri, ci, rj, cj, rk, ck, rc = MIN(r, c),
        err = 0.0, e, a1 = new A32F(r*c);
    
    for(i=0,ri=0,ci=0; i<r; i++,ri+=r,ci+=c)
        for(j=0,rj=0,cj=0; j<c; j++,rj+=r,cj+=c)
            for(a1[ci+j]=0.0,k=0,rk=0,ck=0; k<rc; k++,rk+=r,ck+=c)
                a1[ci+j] += u[ri+k] * s[k] * v[ck+j];
    
    if ( a[0].push )
    {
        if ( 2 === norm )
        {
            for(i=0,ci=0; i<r; i++,ci+=c) for(j=0; j<c; j++)
                err += (e = a1[ci+j] - a[i][j]) * e;
            err = sqrt(err);
        }
        else
        {
            for(i=0,ci=0; i<r; i++,ci+=c) for(j=0; j<c; j++)
                err = MAX( err, fabs( a1[ci+j] - a[i][j] ) );
        }
    }
    else
    {
        if ( 2 === norm )
        {
            for(i=0,ci=0; i<r; i++,ci+=c) for(j=0; j<c; j++)
                err += ( e = a1[ci+j] - a[ci+j] ) * e;
            err = sqrt(err);
        }
        else
        {
            for(i=0,ci=0; i<r; i++,ci+=c) for(j=0; j<c; j++)
                err = MAX( err, fabs( a1[ci+j] - a[ci+j] ) );
        }
    }
    return err;
}

// SVDC computes the singular value decomposition of a real rectangular matrix.
function svdc( a, lda, m, n, s, e, u, ldu, v, ldv, work, wantu, wantv, dosort )
{
    var b, c, cs, el, emm1, f, g, i, iter, j, k, kase,
    kk, l, ll, lls, ls, lu, mm, mm1, mn, mp1, nct, nctp1, givens,
    ncu, nrt, nrtp1, scale, shift, sl, sm, smm1, sn, t, t1, test, ztest,
    maxit = 30;
    
    // Determine what is to be computed.
    ncu = wantu ? MIN( m, n ) : m;
    // Reduce A to bidiagonal form, storing the diagonal elements
    // in S and the super-diagonal elements in E.
    nct = MIN( m-1, n ); nrt = MAX( 0, MIN ( m, n-2 ) );
    lu = MAX( nct, nrt );
    givens = new A32F(4);

    for(l=1; l<=lu; l++)
    {
        // Compute the transformation for the L-th column and
        // place the L-th diagonal in S(L).
        if ( l <= nct )
        {
            s[l-1] = dnrm2( m-l+1, a, l-1+(l-1)*lda, 1 );

            if ( 0.0 !== s[l-1] )
            {
                if ( 0.0 !== a[l-1+(l-1)*lda] )
                    s[l-1] = sign( a[l-1+(l-1)*lda] ) * fabs( s[l-1] );
                dscal( m-l+1, 1.0 / s[l-1], a, l-1+(l-1)*lda, 1 );
                a[l-1+(l-1)*lda] = 1.0 + a[l-1+(l-1)*lda];
            }
            s[l-1] = -s[l-1];
        }

        for(j=l+1; j<=n; j++)
        {
            // Apply the transformation.
            if ( l <= nct && 0.0 !== s[l-1] )
            {
                t = -ddot( m-l+1, a, l-1+(l-1)*lda, 1, a, l-1+(j-1)*lda, 1 ) 
                / a[l-1+(l-1)*lda];
                daxpy( m-l+1, t, a, l-1+(l-1)*lda, 1, a, l-1+(j-1)*lda, 1 );
            }
            // Place the L-th row of A into E for the
            // subsequent calculation of the row transformation.
            e[j-1] = a[l-1+(j-1)*lda];
        }
        // Place the transformation in U for subsequent back multiplication.
        if ( wantu && l <= nct ) for ( i = l; i <= m; i++ ) u[i-1+(l-1)*ldu] = a[i-1+(l-1)*lda];

        if ( l <= nrt )
        {
            // Compute the L-th row transformation and place the
            // L-th superdiagonal in E(L).
            e[l-1] = dnrm2( n-l, e, l, 1 );

            if ( 0.0 !== e[l-1] )
            {
                if ( 0.0 !== e[l] )  e[l-1] = sign( e[l] ) * fabs( e[l-1] );
                dscal( n-l, 1.0 / e[l-1], e, l, 1 );
                e[l] = 1.0 + e[l];
            }

            e[l-1] = -e[l-1];
            // Apply the transformation.
            if ( l+1 <= m && 0.0 !== e[l-1] )
            {
                for(j=l+1; j<=m; j++) work[j-1] = 0.0;
                for(j=l+1; j<=n; j++) daxpy( m-l, e[j-1], a, l+(j-1)*lda, 1, work, l, 1 );
                for(j=l+1; j<=n; j++) daxpy( m-l, -e[j-1]/e[l], work, l, 1, a, l+(j-1)*lda, 1 );
            }
            // Place the transformation in V for subsequent back multiplication.
            if ( wantv ) for ( j = l+1; j <= n; j++ ) v[j-1+(l-1)*ldv] = e[j-1];
        }
    }
    
    // Set up the final bidiagonal matrix of order MN.
    mn = MIN( m + 1, n );
    nctp1 = nct + 1;
    nrtp1 = nrt + 1;

    if ( nct < n ) s[nctp1-1] = a[nctp1-1+(nctp1-1)*lda];
    if ( m < mn ) s[mn-1] = 0.0;
    if ( nrtp1 < mn ) e[nrtp1-1] = a[nrtp1-1+(mn-1)*lda];

    e[mn-1] = 0.0;
    
    // If required, generate U.
    if ( wantu )
    {
        for(i=1; i<=m; i++) for(j=nctp1; j<=ncu; j++)
            u[(i-1)+(j-1)*ldu] = 0.0;

        for(j=nctp1; j<=ncu; j++) u[j-1+(j-1)*ldu] = 1.0;

        for(ll=1; ll<=nct; ll++)
        {
            l = nct - ll + 1;

            if ( 0.0 !== s[l-1] )
            {
                for(j=l+1; j<=ncu; j++)
                {
                    t = -ddot( m-l+1, u, (l-1)+(l-1)*ldu, 1, u, (l-1)+(j-1)*ldu, 1 ) 
                    / u[l-1+(l-1)*ldu];
                    daxpy( m-l+1, t, u, (l-1)+(l-1)*ldu, 1, u, (l-1)+(j-1)*ldu, 1 );
                }

                dscal( m-l+1, -1.0, u, (l-1)+(l-1)*ldu, 1 );
                u[l-1+(l-1)*ldu] = 1.0 + u[l-1+(l-1)*ldu];
                for(i=1; i<=l-1; i++) u[i-1+(l-1)*ldu] = 0.0;
            }
            else
            {
                for(i=1; i<=m; i++) u[i-1+(l-1)*ldu] = 0.0;
                u[l-1+(l-1)*ldu] = 1.0;
            }
        }
    }
    
    // If it is required, generate V.
    if ( wantv )
    {
        for(ll=1; ll<=n; ll++)
        {
            l = n - ll + 1;

            if ( l <= nrt && 0.0 !== e[l-1] )
            {
                for(j=l+1; j<=n; j++)
                {
                    t = -ddot( n-l, v, l+(l-1)*ldv, 1, v, l+(j-1)*ldv, 1 ) 
                    / v[l+(l-1)*ldv];
                    daxpy( n-l, t, v, l+(l-1)*ldv, 1, v, l+(j-1)*ldv, 1 );
                }
            }
            for(i=1; i<=n; i++) v[i-1+(l-1)*ldv] = 0.0;
            v[l-1+(l-1)*ldv] = 1.0;
        }
    }
    
    // Main iteration loop for the singular values.
    mm = mn; iter = 0;

    while( 0 < mn )
    {
        // If too many iterations have been performed, set flag and return.
        if ( maxit <= iter ) return mn;
        
        /*
        This section of the program inspects for
        negligible elements in the S and E arrays.

        On completion the variables KASE and L are set as follows:

        KASE = 1     if S(MN) and E(L-1) are negligible and L < MN
        KASE = 2     if S(L) is negligible and L < MN
        KASE = 3     if E(L-1) is negligible, L < MN, and
        S(L), ..., S(MN) are not negligible (QR step).
        KASE = 4     if E(MN-1) is negligible (convergence).
        */
        for(ll=1; ll<=mn; ll++)
        {
            l = mn - ll;
            if ( 0 === l ) break;
            test = fabs( s[l-1] ) + fabs( s[l] );
            ztest = test + fabs( e[l-1] );
            if ( ztest === test )
            {
                e[l-1] = 0.0;
                break;
            }
        }

        if ( l+1 === mn )
        {
            kase = 4;
        }
        else
        {
            mp1 = mn + 1;

            for(lls=l+1; lls<=mn+1; lls++)
            {
                ls = mn - lls + l + 1;
                if ( ls === l ) break;

                test = 0.0;
                if ( ls !== mn ) test += fabs( e[ls-1] );
                if ( ls !== l + 1 ) test += fabs( e[ls-2] );
                ztest = test + fabs( s[ls-1] );
                if ( ztest === test )
                {
                    s[ls-1] = 0.0;
                    break;
                }
            }

            if ( ls === l )
            {
                kase = 3;
            }
            else if ( ls === mn )
            {
                kase = 1;
            }
            else
            {
                kase = 2;
                l = ls;
            }
        }

        l = l + 1;
        
        if ( 1 === kase )
        {
            // Deflate negligible S(MN).
            mm1 = mn - 1;
            f = e[mn-2];
            e[mn-2] = 0.0;

            for(kk=1; kk<=mm1; kk++)
            {
                k = mm1 - kk + l;
                t1 = s[k-1];
                givens[0] = t1; givens[1] = f; givens[2] = cs; givens[3] = sn;
                drotg( givens );
                t1 = givens[0]; f = givens[1]; cs = givens[2]; sn = givens[3];
                s[k-1] = t1;

                if ( k !== l )
                {
                    f = -sn * e[k-2];
                    e[k-2] = cs * e[k-2];
                }

                if ( wantv ) drot( n, v, 0+(k-1)*ldv, 1, v, 0+(mn-1)*ldv, 1, cs, sn );
            }
        }
        else if ( 2 === kase )
        {
            // Split at negligible S(L).
            f = e[l-2];
            e[l-2] = 0.0;

            for(k=l; k<=mn; k++)
            {
                t1 = s[k-1];
                givens[0] = t1; givens[1] = f; givens[2] = cs; givens[3] = sn;
                drotg( givens );
                t1 = givens[0]; f = givens[1]; cs = givens[2]; sn = givens[3];
                s[k-1] = t1;
                f = - sn * e[k-1];
                e[k-1] = cs * e[k-1];
                
                if ( wantu ) drot( m, u, 0+(k-1)*ldu, 1, u, 0+(l-2)*ldu, 1, cs, sn );
            }
        }
        else if ( 3 === kase )
        {
            // Perform one QR step.
            // Calculate the shift.
            scale = MAX( fabs( s[mn-1] ), 
                    MAX( fabs( s[mn-2] ), 
                    MAX( fabs( e[mn-2] ), 
                    MAX( fabs( s[l-1] ), fabs( e[l-1] ) ) ) ) );

            sm = s[mn-1] / scale;
            smm1 = s[mn-2] / scale;
            emm1 = e[mn-2] / scale;
            sl = s[l-1] / scale;
            el = e[l-1] / scale;
            b = ( ( smm1 + sm ) * ( smm1 - sm ) + emm1 * emm1 ) / 2.0;
            c = ( sm * emm1 ) * ( sm * emm1 );
            shift = 0.0;

            if ( 0.0 !== b || 0.0 !== c )
            {
                shift = sqrt( b * b + c );
                if ( b < 0.0 ) shift = -shift;
                shift = c / ( b + shift );
            }

            f = ( sl + sm ) * ( sl - sm ) - shift;
            g = sl * el;
            
            // Chase zeros.
            mm1 = mn - 1;

            for(k=l; k<=mm1; k++)
            {
                givens[0] = f; givens[1] = g; givens[2] = cs; givens[3] = sn;
                drotg( givens );
                f = givens[0]; g = givens[1]; cs = givens[2]; sn = givens[3];

                if ( k !== l ) e[k-2] = f;

                f = cs * s[k-1] + sn * e[k-1];
                e[k-1] = cs * e[k-1] - sn * s[k-1];
                g = sn * s[k];
                s[k] = cs * s[k];

                if ( wantv ) drot( n, v, 0+(k-1)*ldv, 1, v, 0+k*ldv, 1, cs, sn );

                givens[0] = f; givens[1] = g; givens[2] = cs; givens[3] = sn;
                drotg( givens );
                f = givens[0]; g = givens[1]; cs = givens[2]; sn = givens[3];
                s[k-1] = f;
                f = cs * e[k-1] + sn * s[k];
                s[k] = -sn * e[k-1] + cs * s[k];
                g = sn * e[k];
                e[k] = cs * e[k];

                if ( wantu && k < m ) drot( m, u, 0+(k-1)*ldu, 1, u, 0+k*ldu, 1, cs, sn );
            }
            e[mn-2] = f;
            iter = iter + 1;
        }
        else if ( 4 === kase )
        {
            // Convergence.
            
            // Make the singular value nonnegative.
            if ( 0.0 > s[l-1] )
            {
                s[l-1] = -s[l-1];
                if ( wantv ) dscal( n, -1.0, v, 0+(l-1)*ldv, 1 );
            }
            
            // Order the singular value.
            if ( dosort )
            {
                for ( ; ; )
                {
                    if ( l === mm || s[l] <= s[l-1] ) break;

                    t = s[l-1]; s[l-1] = s[l]; s[l] = t;

                    if ( wantv && l < n ) dswap( n, v, 0+(l-1)*ldv, 1, v, 0+l*ldv, 1 );
                    if ( wantu && l < m ) dswap( m, u, 0+(l-1)*ldu, 1, u, 0+l*ldu, 1 );

                    l = l + 1;
                }
            }
            
            iter = 0;
            mn = mn - 1;
        }
    }
    return 0;
}

FILTER.MachineLearning.svdc = svdc;
FILTER.MachineLearning.svd_err = svd_err;

//FILTER.MachineLearning.tsvd = FILTER.MachineLearning.truncated_singular_value_decomposition = function tsvd( ){ };

FILTER.MachineLearning.svd = FILTER.MachineLearning.singular_value_decomposition = function svd( a, m/*tows*/, n/*columns*/, compute_u, compute_v, sorted, strided ){
    var err, s, u=null, v=null, nm, i, aa, e, work, lda, ldu, ldv, transposed = 0;
    
    if ( 0 >= m || 0 >= n ) { throw "SVD: Dimensions out of range!"; return null; }
    
    compute_v = false === compute_v ? 0 : 1;
    compute_u = false === compute_u ? 0 : 1;
    sorted = false === sorted ? 0 : 1;
    
    if ( m < n ) { nm = n; n = m; m = nm; transposed = 1; /* transpose to row-major order */}
    
    aa = transposed ? array_transpose(new A32F(m * n), a, n, m, strided) : array_copy(new A32F(m * n), m, n, a, m, n, 0.0, strided);
    // The correct size of E and SDIAG is min ( m+1, n).
    e = new A32F( m + n ); s = new A32F( m + n ); work = new A32F( m );
    // Compute the eigenvalues and eigenvectors.
    if ( compute_v ) v = new A32F( n * n );
    if ( compute_u ) u = new A32F( m * n ); 
    lda = m; ldu = m; ldv = n;
    
    err = svdc( aa, lda, m, n, s, e, u, ldu, v, ldv, work, compute_u, compute_v, sorted );
    if ( err ) { throw "SVD: No convergence!"; return null; }
    return compute_u||compute_v ? (transposed ? [s, v, u] : [s, u, v]) : s;
};

}(FILTER);
/* main code ends here */
/* export the module */
return FILTER;
});