/**
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

var BLAS = FILTER.Util.BLAS, ArrayUtil = FILTER.Util.Array,
    A32F = FILTER.Array32F, sqrt = Math.sqrt, ABS = Math.abs, MAX = Math.max, MIN = Math.min,
    array_c = BLAS.ARY, array_t = BLAS.TRANSP, SIGN = FILTER.Util.Math.sign,
    CPY = BLAS.CPY, SET = BLAS.SET, SWAP = BLAS.SWAP, SCALE = BLAS.SCALE, AXPY = BLAS.AXPY,
    DOTP = BLAS.DOTP, NRM2 = BLAS.NRM2, PROT = BLAS.PROT, PROTG = BLAS.PROTG;

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
                err = MAX( err, ABS( a1[ci+j] - a[i][j] ) );
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
                err = MAX( err, ABS( a1[ci+j] - a[ci+j] ) );
        }
    }
    return err;
}

function svdc( a, lda, m, n, s, e, u, ldu, v, ldv, work, col_maj, row_vec, compute_u, compute_v )
{
    //"use asm";
    // SVDC computes the singular value decomposition of a real rectangular matrix.
    var givens, b, c, cs, el, emm1, f, g, iter, maxit = 30,
        i, j, k, kase, kk, l, ll, lls, ls, lu,
        mm, mm1, mn, mp1, nct, nctp1, ncu, nrt, nrtp1,
        scale, shift, sl, sm, smm1, sn, t, t1, test, ztest,
        RA, RU, RV, CA, CU, CV, SA, SU, SV, SRA, SRU, SRV, SCA, SCU, SCV,
        r1, c1, r2, c2, r3, c3, r4, c4;
    
    // Determine what is to be computed.
    if ( col_maj )
    {
        // column-major order
        RA = RU = RV = 1;
        CA = lda; CU = ldu; CV = ldv;
    }
    else
    {
        // row-major order
        CA = CU = CV = 1;
        RA = lda; RU = ldu; RV = ldv;
    }
    if ( row_vec )
    {
        // row vector representation
        SRA = CA; SRU = CU; SRV = CV;
        SCA = RA; SCU = RU; SCV = RV;
    }
    else
    {
        // column vector representation
        SRA = RA; SRU = RU; SRV = RV;
        SCA = CA; SCU = CU; SCV = CV;
    }
    SA = SCA; SU = SCU; SV = SCV;
    
    ncu = compute_u ? m : MIN( m, n );
    // Reduce A to bidiagonal form, storing the diagonal elements
    // in S and the super-diagonal elements in E.
    nct = MIN( m-1, n ); nrt = MAX( 0, MIN( m, n-2 ) ); lu = MAX( nct, nrt );
    
    givens = new A32F(4);
    
    for(l=1,r1=0,c1=0; l<=lu; l++,r1+=CA,c1+=RA)
    {
        // Compute the transformation for the L-th column and
        // place the L-th diagonal in S(L).
        if ( l <= nct )
        {
            s[l-1] = NRM2( m-l+1, a, r1+c1, SA );

            if ( 0.0 !== s[l-1] )
            {
                if ( 0.0 !== a[r1+c1] ) s[l-1] = SIGN( a[r1+c1] ) * ABS( s[l-1] );
                SCALE( m-l+1, 1.0 / s[l-1], a, r1+c1, SA );
                a[r1+c1] += 1.0;
            }
            s[l-1] = -s[l-1];
        }
        
        for(j=l+1,r2=l*CA; j<=n; j++,r2+=CA)
        {
            // Apply the transformation.
            if ( (l <= nct) && (0.0 !== s[l-1]) )
            {
                t = -DOTP( m-l+1, a, r1+c1, SA, a, r2+c1, SA ) / a[r1+c1];
                AXPY( m-l+1, t, a, r1+c1, SA, a, r2+c1, SA );
            }
            // Place the L-th row of A into E for the
            // subsequent calculation of the row transformation.
            //e[j-1] = a[l-1+(j-1)*lda];
            e[j-1] = a[r2+c1];
        }
        
        // Place the transformation in U for subsequent back multiplication.
        // copy row or column here? assume column
        if ( compute_u && (l <= nct) ) CPY( m-l+1, a, r1+c1, SA, u, (l-1)*CU+(l-1)*RU, SU );

        if ( l <= nrt )
        {
            // Compute the L-th row transformation and place the
            // L-th superdiagonal in E(L).
            e[l-1] = NRM2( n-l, e, l, 1 );

            if ( 0.0 !== e[l-1] )
            {
                if ( 0.0 !== e[l] ) e[l-1] = SIGN( e[l] ) * ABS( e[l-1] );
                SCALE( n-l, 1.0 / e[l-1], e, l, 1 );
                e[l] += 1.0;
            }

            e[l-1] = -e[l-1];
            
            // Apply the transformation.
            if ( (l+1 <= m) && (0.0 !== e[l-1]) )
            {
                SET( m-l, 0.0, work, l, 1 );

                for(j=l+1,c2=l*RA; j<=n; j++,c2+=RA)
                    AXPY( m-l, e[j-1], a, r1+CA+c2, SA, work, l, 1 );

                for(j=l+1,r2=l*CA; j<=n; j++,r2+=CA)
                    AXPY( m-l, -e[j-1]/e[l], work, l, 1, a, r2+c1+RA, SA );
            }
            
            // Place the transformation in V for subsequent back multiplication.
            // copy row or column here? assume column
            if ( compute_v ) CPY( n-l, e, l, 1, v, l*RV+(l-1)*CV, SV );
        }
    }
    
    // Set up the final bidiagonal matrix of order MN.
    mn = MIN( m + 1, n ); nctp1 = nct + 1; nrtp1 = nrt + 1;

    if ( nct < n )
    {
        s[nctp1-1] = a[nctp1-1+(nctp1-1)*lda];
    }

    if ( m < mn )
    {
        s[mn-1] = 0.0;
    }

    if ( nrtp1 < mn )
    {
        //e[nrtp1-1] = a[nrtp1-1+(mn-1)*lda];
        e[nrtp1-1] = a[(nrtp1-1)*lda+mn-1];
    }

    e[mn-1] = 0.0;
    
    // If required, generate U.
    if ( compute_u )
    {
        for(i=1; i<=m; i++)
        {
            // scale row or column here? assume column
            //for(j=nctp1; j<=ncu; j++) u[(i-1)+(j-1)*ldu] = 0.0;
            SET( ncu-nctp1+1, 0.0, u, (i-1)+(nctp1-1)*ldu, sdu );
        }

        //for(j=nctp1; j<=ncu; j++) u[j-1+(j-1)*ldu] = 1.0;
        SET( ncu-nct, 1.0, u, nct+nct*ldu, 1+ldu );

        for(ll=1; ll<=nct; ll++)
        {
            l = nct - ll + 1;

            if ( 0.0 !== s[l-1] )
            {
                // operate on row or column here? assume column
                for(j=l+1; j<=ncu; j++)
                {
                    t = -DOTP( m-l+1, u, (l-1)+(l-1)*ldu, sdu, u, (l-1)+(j-1)*ldu, sdu ) / u[l-1+(l-1)*ldu];
                    AXPY( m-l+1, t, u, (l-1)+(l-1)*ldu, sdu, u, (l-1)+(j-1)*ldu, sdu );
                }

                SALE( m-l+1, -1.0, u, (l-1)+(l-1)*ldu, sdu );
                u[l-1+(l-1)*ldu] += 1.0;
                //for(i=1; i<=l-1; i++) u[i-1+(l-1)*ldu] = 0.0;
                SET( l-1, 0.0, u, (l-1)*ldu, sdu );
            }
            else
            {
                // scale row or column here? assume column
                //for(i=1; i<=m; i++) u[i-1+(l-1)*ldu] = 0.0;
                SCALE( m, 0.0, u, (l-1)/**ldu*/, sdu );
                u[l-1+(l-1)*ldu] = 1.0;
            }
        }
    }
    
    // If it is required, generate V.
    if ( compute_v )
    {
        for(ll=1; ll<=n; ll++)
        {
            l = n - ll + 1;

            if ( l <= nrt && 0.0 !== e[l-1] )
            {
                // operate on row or column here? assume column
                for(j=l+1; j<=n; j++)
                {
                    t = -DOTP( n-l, v, l+(l-1)*ldv, sdv, v, l+(j-1)*ldv, sdv ) / v[l+(l-1)*ldv];
                    AXPY( n-l, t, v, l+(l-1)*ldv, sdv, v, l+(j-1)*ldv, sdv );
                }
            }
            // scale row or column here? assume column
            //for(i=1; i<=n; i++) v[i-1+(l-1)*ldv] = 0.0;
            SET( n, 0.0, v, (l-1)/**ldv*/, sdv );
            v[l-1+(l-1)*ldv] = 1.0;
        }
    }
    
    // Main iteration loop for the singular values.
    mm = mn; iter = 0;

    while ( 0 < mn )
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

            test = ABS( s[l-1] ) + ABS( s[l] );
            ztest = test + ABS( e[l-1] );

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
                if ( ls !== mn ) test += ABS( e[ls-1] );
                if ( ls !== l + 1 ) test += ABS( e[ls-2] );
                ztest = test + ABS( s[ls-1] );

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

        l++;
        
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
                PROTG( givens );
                t1 = givens[0]; f = givens[1]; cs = givens[2]; sn = givens[3];
                s[k-1] = t1;

                if ( k !== l )
                {
                    f = -sn * e[k-2];
                    e[k-2] *= cs;
                }

                // rotate by rows or columns here? assume rows
                if ( compute_v ) PROT( n, v, (k-1)*ldv, 1/*sdv*/, v, (mn-1)*ldv, 1/*sdv*/, cs, sn );
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
                PROTG( givens );
                t1 = givens[0]; f = givens[1]; cs = givens[2]; sn = givens[3];
                s[k-1] = t1;
                f = - sn * e[k-1];
                e[k-1] *= cs;
                // rotate by rows or columns here? assume rows
                if ( compute_u ) PROT( m, u, (k-1)*ldu, 1/*sdu*/, u, (l-2)*ldu, 1/*sdu*/, cs, sn );
            }
        }
        else if ( 3 === kase )
        {
            // Perform one QR step.
            
            // Calculate the shift.
            scale = MAX( ABS( s[mn-1] ), ABS( s[mn-2] ), ABS( e[mn-2] ), ABS( s[l-1] ), ABS( e[l-1] ) );

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
                shift = sqrt ( b * b + c );
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
                PROTG( givens );
                f = givens[0]; g = givens[1]; cs = givens[2]; sn = givens[3];

                if ( k !== l ) e[k-2] = f;

                f = cs * s[k-1] + sn * e[k-1];
                e[k-1] = cs * e[k-1] - sn * s[k-1];
                g = sn * s[k];
                s[k] *= cs;

                // rotate by rows or columns here? assume rows
                if ( compute_v ) PROT( n, v, (k-1)*ldv, 1/*sdv*/, v, k*ldv, 1/*sdv*/, cs, sn );

                givens[0] = f; givens[1] = g; givens[2] = cs; givens[3] = sn;
                PROTG( givens );
                f = givens[0]; g = givens[1]; cs = givens[2]; sn = givens[3];
                s[k-1] = f;
                f = cs * e[k-1] + sn * s[k];
                s[k] = -sn * e[k-1] + cs * s[k];
                g = sn * e[k];
                e[k] *= cs;

                // rotate by rows or columns here? assume rows
                if ( compute_u && k < m ) PROT( m, u, (k-1)*ldu, 1/*sdu*/, u, k*ldu, 1/*sdu*/, cs, sn );
            }
            e[mn-2] = f;
            iter++;
        }
        else if ( 4 === kase )
        {
            // Convergence.
            
            // Make the singular value nonnegative.
            if ( s[l-1] < 0.0 )
            {
                s[l-1] = -s[l-1];
                if ( compute_v ) SCALE( n, -1.0, v, (l-1)*ldv, sdv );
            }
            // Order the singular value.
            /*if ( sorted )
            {*/
                for(;;)
                {
                    if ( l === mm || s[l] <= s[l-1] ) break;

                    t = s[l-1]; s[l-1] = s[l]; s[l] = t;

                    // swap rows or columns here? assume rows
                    if ( compute_v && l < n ) SWAP( n, v, (l-1)*ldv, 1/*sdv*/, v, l*ldv, 1/*sdv*/ );
                    if ( compute_u && l < m ) SWAP( m, u, (l-1)*ldu, 1/*sdu*/, u, l*ldu, 1/*sdu*/ );

                    l++;
                }
            /*}*/
            iter = 0; mn--;
        }
    }
    return 0;
}

FILTER.MachineLearning.svdc = svdc;
FILTER.MachineLearning.svd_err = svd_err;

//FILTER.MachineLearning.tsvd = FILTER.MachineLearning.truncated_singular_value_decomposition = function tsvd( ){ };

FILTER.MachineLearning.svd = FILTER.MachineLearning.singular_value_decomposition = function svd( a, m/*tows*/, n/*columns*/, compute_u, compute_v, strided ){
    var err, s, u, v, nm, aa, e, w, lda, ldu, ldv, col_maj, row_vec, transposed = 0;
    
    if ( 0 >= m || 0 >= n ) { throw "SVD: Dimensions out of range!"; return null; }
    
    compute_v = false === compute_v ? 0 : 1;
    compute_u = false === compute_u ? 0 : 1;
    //sorted = false === sorted ? 0 : 1;
    
    if ( m < n ) { nm = n; n = m; m = nm; transposed = 1; /* transpose to row-major order */}
    
    aa = transposed ? array_t(new A32F(m * n), a, n, m, strided) : array_c(new A32F(m * n), m, n, a, m, n, 0.0, strided);
    // The correct size of E and SDIAG is min ( m+1, n).
    e = new A32F(m); s = new A32F(m); w = new A32F(m);
    // Compute the eigenvalues and eigenvectors.
    v = compute_v ? new A32F(n * n) : null;
    u = compute_u ? new A32F(m * m) : null;
    // column vectors in row-major order
    lda = n; ldu = m; ldv = n; col_maj = 0; row_vec = 0;
    
    err = svdc( aa, lda, m, n, s, e, u, ldu, v, ldv, w, col_maj, row_vec, compute_u, compute_v );
    if ( err ) { throw "SVD: No convergence!"; return null; }
    return compute_u||compute_v ? (transposed ? [s, v, u] : [s, u, v]) : s;
};

}(FILTER);