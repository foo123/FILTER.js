/**
*
* Filter Utils, BLAS (Basic Linear Algebra Subroutines)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

if ( FILTER.Util.LOADED_BLAS ) return;
FILTER.Util.LOADED_BLAS = true;

// extended versions of C BLAS from: https://people.sc.fsu.edu/~jburkardt/
var BLAS = FILTER.Util.BLAS = FILTER.Util.BLAS || {},
    fabs = Math.abs, fmax = Math.max, fmin = Math.min,
    sqrt = Math.sqrt, sign = /*Math.sign*/function sign( x ){ return 0 > x ? -1.0 : 1.0; };

// utils
BLAS.SGN = sign;

// BLAS 1
BLAS.NRM2 = function NRM2( n, x, x0, dx ) {
    // NRM2 returns the L2 norm of a vector.
    var absxi, i, ix, norm, scale, ssq, value;

    if ( 1 > n || 1 > dx )
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
        for (i=0,ix=x0; i<n; i++,ix+=dx)
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
BLAS.SET = function SET( n, v, x, x0, dx ) {
    // SET sets a vector to a constant.
    var i, ix, m;
    if ( 0 >= n ) return;
    ix = x0; m = n & 7;
    for(i=0; i<m; i++)
    {
        x[ix] = v; ix+=dx;
    }
    for(i=m; i<n; i+=8)
    {
        x[ix] = v; ix+=dx;
        x[ix] = v; ix+=dx;
        x[ix] = v; ix+=dx;
        x[ix] = v; ix+=dx;
        x[ix] = v; ix+=dx;
        x[ix] = v; ix+=dx;
        x[ix] = v; ix+=dx;
        x[ix] = v; ix+=dx;
    }
};
BLAS.CPY = function CPY( n, x, x0, dx, y, y0, dy ) {
    // CPY copies a vector into another vector.
    var i, ix, iy, m, tmp;
    if ( 0 >= n ) return;
    ix = x0; iy = y0; m = n & 7;
    for(i=0; i<m; i++)
    {
        y[iy] = x[ix]; ix+=dx; iy+=dy;
    }
    for(i=m; i<n; i+=8)
    {
        y[iy] = x[ix]; ix+=dx; iy+=dy;
        y[iy] = x[ix]; ix+=dx; iy+=dy;
        y[iy] = x[ix]; ix+=dx; iy+=dy;
        y[iy] = x[ix]; ix+=dx; iy+=dy;
        y[iy] = x[ix]; ix+=dx; iy+=dy;
        y[iy] = x[ix]; ix+=dx; iy+=dy;
        y[iy] = x[ix]; ix+=dx; iy+=dy;
        y[iy] = x[ix]; ix+=dx; iy+=dy;
    }
};
BLAS.SWAP = function SWAP( n, x, x0, dx, y, y0, dy ) {
    // SWAP interchanges two vectors.
    var i, ix, iy, m, t;
    if ( 0 >= n ) return;
    ix = x0; iy = y0; m = n & 7;
    for(i=0; i<m; i++)
    {
        t = x[ix]; x[ix] = y[iy]; y[iy] = t; ix+=dx; iy+=dy;
    }
    for(i=m; i<n; i+=8)
    {
        t = x[ix]; x[ix] = y[iy]; y[iy] = t; ix+=dx; iy+=dy;
        t = x[ix]; x[ix] = y[iy]; y[iy] = t; ix+=dx; iy+=dy;
        t = x[ix]; x[ix] = y[iy]; y[iy] = t; ix+=dx; iy+=dy;
        t = x[ix]; x[ix] = y[iy]; y[iy] = t; ix+=dx; iy+=dy;
        t = x[ix]; x[ix] = y[iy]; y[iy] = t; ix+=dx; iy+=dy;
        t = x[ix]; x[ix] = y[iy]; y[iy] = t; ix+=dx; iy+=dy;
        t = x[ix]; x[ix] = y[iy]; y[iy] = t; ix+=dx; iy+=dy;
        t = x[ix]; x[ix] = y[iy]; y[iy] = t; ix+=dx; iy+=dy;
    }
};
BLAS.SCALE = function SCALE( n, s, x, x0, dx ) {
    // SCALE scales a vector by a constant.
    var i, ix, m;
    if ( 0 >= n || 1.0 === s ) return;
    ix = x0; m = n & 7;
    if ( 0.0 === s )
    {
        for(i=0; i<m; i++)
        {
            x[ix] = 0.0; ix+=dx;
        }
        for(i=m; i<n; i+=8)
        {
            x[ix] = 0.0; ix+=dx;
            x[ix] = 0.0; ix+=dx;
            x[ix] = 0.0; ix+=dx;
            x[ix] = 0.0; ix+=dx;
            x[ix] = 0.0; ix+=dx;
            x[ix] = 0.0; ix+=dx;
            x[ix] = 0.0; ix+=dx;
            x[ix] = 0.0; ix+=dx;
        }
    }
    else
    {
        for(i=0; i<m; i++)
        {
            x[ix] *= s; ix+=dx;
        }
        for(i=m; i<n; i+=8)
        {
            x[ix] *= s; ix+=dx;
            x[ix] *= s; ix+=dx;
            x[ix] *= s; ix+=dx;
            x[ix] *= s; ix+=dx;
            x[ix] *= s; ix+=dx;
            x[ix] *= s; ix+=dx;
            x[ix] *= s; ix+=dx;
            x[ix] *= s; ix+=dx;
        }
    }
};
BLAS.AXPY = function AXPY( n, a, x, x0, dx, y, y0, dy ) {
    // AXPY computes constant times a vector plus a vector.
    var i, ix, iy, m;
    if ( 0 >= n || 0.0 === a ) return;
    ix = x0; iy = y0; m = n & 7;
    if ( 1.0 === a )
    {
        for(i=0; i<m; i++)
        {
            y[iy] += x[ix]; ix+=dx; iy+=dy;
        }
        for(i=m; i<n; i+=8)
        {
            y[iy] += x[ix]; ix+=dx; iy+=dy;
            y[iy] += x[ix]; ix+=dx; iy+=dy;
            y[iy] += x[ix]; ix+=dx; iy+=dy;
            y[iy] += x[ix]; ix+=dx; iy+=dy;
            y[iy] += x[ix]; ix+=dx; iy+=dy;
            y[iy] += x[ix]; ix+=dx; iy+=dy;
            y[iy] += x[ix]; ix+=dx; iy+=dy;
            y[iy] += x[ix]; ix+=dx; iy+=dy;
        }
    }
    else
    {
        for(i=0; i<m; i++)
        {
            y[iy] += a * x[ix]; ix+=dx; iy+=dy;
        }
        for(i=m; i<n; i+=8)
        {
            y[iy] += a * x[ix]; ix+=dx; iy+=dy;
            y[iy] += a * x[ix]; ix+=dx; iy+=dy;
            y[iy] += a * x[ix]; ix+=dx; iy+=dy;
            y[iy] += a * x[ix]; ix+=dx; iy+=dy;
            y[iy] += a * x[ix]; ix+=dx; iy+=dy;
            y[iy] += a * x[ix]; ix+=dx; iy+=dy;
            y[iy] += a * x[ix]; ix+=dx; iy+=dy;
            y[iy] += a * x[ix]; ix+=dx; iy+=dy;
        }
    }
};
BLAS.DOTP = function DOTP( n, x, x0, dx, y, y0, dy ) {
    // DOTP forms the dot product of two vectors.
    var sum, i, ix, iy, m;
    if ( 0 >= n ) return 0.0;
    ix = x0; iy = y0; m = n & 7;
    for(sum=0.0,i=0; i<m; i++)
    {
        sum += x[ix] * y[iy]; ix+=dx; iy+=dy;
    }
    for(i=m; i<n; i+=8)
    {
        sum += x[ix] * y[iy]; ix+=dx; iy+=dy;
        sum += x[ix] * y[iy]; ix+=dx; iy+=dy;
        sum += x[ix] * y[iy]; ix+=dx; iy+=dy;
        sum += x[ix] * y[iy]; ix+=dx; iy+=dy;
        sum += x[ix] * y[iy]; ix+=dx; iy+=dy;
        sum += x[ix] * y[iy]; ix+=dx; iy+=dy;
        sum += x[ix] * y[iy]; ix+=dx; iy+=dy;
        sum += x[ix] * y[iy]; ix+=dx; iy+=dy;
    }
    return sum;
};
BLAS.ASUM = function ASUM( n, x, x0, dx ) {
    // ASUM takes the sum of the absolute values of a vector.
    var sum, i, ix, m;
    if ( 0 >= n ) return 0.0;
    ix = x0; m = n & 7;
    for(sum=0.0,i=0; i<m; i++)
    {
        sum += fabs(x[ix]); ix+=dx;
    }
    for(i=m; i<n; i+=8)
    {
        sum += fabs(x[ix]); ix+=dx;
        sum += fabs(x[ix]); ix+=dx;
        sum += fabs(x[ix]); ix+=dx;
        sum += fabs(x[ix]); ix+=dx;
        sum += fabs(x[ix]); ix+=dx;
        sum += fabs(x[ix]); ix+=dx;
        sum += fabs(x[ix]); ix+=dx;
        sum += fabs(x[ix]); ix+=dx;
    }
    return sum;
};
BLAS.PROT = function PROT( n, x, x0, dx, y, y0, dy, c,  s ) {
    // PROT applies a plane rotation.
    var i, ix, iy, xi, m;
    if ( 0 >= n ) return;
    ix = x0; iy = y0; m = n & 7;
    for(i=0; i<m; i++)
    {
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=dx; iy+=dy;
    }
    for(i=m; i<n; i+=8)
    {
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=dx; iy+=dy;
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=dx; iy+=dy;
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=dx; iy+=dy;
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=dx; iy+=dy;
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=dx; iy+=dy;
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=dx; iy+=dy;
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=dx; iy+=dy;
        xi=x[ix]; x[ix] = c*xi + s*y[iy]; y[iy] = c*y[iy] - s*xi; ix+=dx; iy+=dy;
    }
};
BLAS.PROTG = function PROTG( t /*sa, sb, c, s*/ ) {
    // PROTG constructs a Givens plane rotation.
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
BLAS.GEMV = function GEMV( transpose, m, n, alpha, a, lda, x, x0, dx, beta, y, y0, dy ) {
    // GEMV computes y := alpha * A * x + beta * y for general matrix A.
    var i, ix, iy, j, jx, jy, kx, ky, lenx, leny, temp;
    
    // Test the input parameters.
    if ( m < 0 ) return 2;
    else if ( n < 0 ) return 3;
    else if ( lda < fmax ( 1, m ) ) return 6;
    else if ( 0 === dx ) return 8;
    else if ( 0 === dy ) return 11;

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

    kx = x0; ky = y0;
    
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
                y[iy] = 0.0; iy += dy;
            }
        }
        else
        {
            for(i=0; i<leny; i++)
            {
                y[iy] = beta * y[iy]; iy += dy;
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
                ix += dx;
            }
            y[jy] += alpha * temp;
            jy += dy;
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
                    iy += dy;
                }
            }
            jx += dx;
        }
    }
    return 0;
};
BLAS.GER = function GER( m, n, alpha, x, x0, dx, y, y0, dy, a, lda ) {
    // GER computes A := alpha*x*y' + A.
    var i, ix, j, jy, kx, temp;
    
    // Test the input parameters.
    if ( m < 0 ) return 1;
    else if ( n < 0 ) return 2;
    else if ( 0 === dx ) return 5;
    else if ( 0 === dy ) return 7;
    else if ( lda < fmax ( 1, m ) ) return 9;

    // Quick return if possible.
    if ( 0 === m || 0 === n || 0.0 === alpha ) return 0;
    
    // Start the operations. In this version the elements of A are
    // accessed sequentially with one pass through A.
    
    jy = y0; kx = x0;
    for(j=0; j<n; j++)
    {
        if ( 0.0 !== y[jy] )
        {
            temp = alpha * y[jy];
            ix = kx;
            for(i=0; i<m; i++)
            {
                a[i+j*lda] += x[ix] * temp;
                ix += dx;
            }
        }
        jy += dy;
    }
    return 0;
};

// BLAS 3
BLAS.GEMM = function GEMM( transa, transb, m, n, k, alpha, a, lda, b, ldb, beta, c, ldc ) {
    // GEMM computes C = alpha * A * B and related operations.
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

}(FILTER);