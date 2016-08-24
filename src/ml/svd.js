/**
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