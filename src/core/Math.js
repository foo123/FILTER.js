/**
*
* Filter Math
* @package FILTER.js
*
**/
!function(FILTER, undef){
@@USE_STRICT@@

//
//
// Constants
var PI = Math.PI, PI2 = 2.0*PI, PI_2 = 0.5*PI;
FILTER.CONSTANTS = {
     PI:    PI
    ,PI2:   PI2
    ,PI_2:  PI_2
    ,SQRT2: Math.SQRT2
    ,toRad: PI/180
    ,toDeg: 180/PI
};
Math.log2 = Math.log2 || function(x) { return Math.log(x) / Math.LN2; };
function closest_power_of_two(x){ return Math.pow(2, Math.ceil(Math.log2(x)));}
var FMath = FILTER.Math = {};

// fft1d and fft2d
// adapted from: http://www.ltrr.arizona.edu/~mmunro/tclsadiedoc/html/fft2d_8c-source.html
// http://en.wikipedia.org/wiki/Fourier_transform#Signal_processing
// http://en.wikipedia.org/wiki/Fast_Fourier_transform
function fft(array, N, dir, sine, cosn)
{
    var n, m, l, k, j, i, jc, kc, i2, j2;
    var temp, e_real, e_imag, o_real, o_imag;

    /* scramble the array */
    for (i = j = 0; j < N; j += 1, i += k)
    {
        if ( i > j )
        {
            i2 = i << 1; j2 = j << 1;
            temp = array[i2];
            array[i2] = array[j2];
            array[j2] = temp;
            temp = array[i2 + 1];
            array[i2 + 1] = array[j2 + 1];
            array[j2 + 1] = temp;
        }
        for (k = N >>> 1; 1 <= k && k <= i; i -= k, k >>>= 1);
    }

    /* compute Fourier coefficients */
    for (i = 2; i <= N; i <<= 1)
    {
        for (j = 0,jc = N/i; j < jc; j++)
        {
            for (k = 0,kc = i >>> 1; k < kc; k++)
            {
                l = (j * i + k) << 1;
                m = (j * i + (i >>> 1) + k) << 1;
                n = (k * /*N / i*/jc);
                e_real = array[l];
                e_imag = array[l + 1];
                o_real = array[m] * cosn[n] - array[m + 1] * sine[n];
                o_imag = array[m] * sine[n] + array[m + 1] * cosn[n];
                array[l] = (e_real + o_real) / 2.0;
                array[l + 1] = (e_imag + o_imag) / 2.0;
                array[m] = (e_real - o_real) / 2.0;
                array[m + 1] = (e_imag - o_imag) / 2.0;
            }
        }
    }
    if ( -1 === dir /*== INVERSE*/) for (i = 0,jc = N << 1; i < jc; array[i++] *= N);
    return array;
}

function fft1d(array, N, dir)
{
    if ( !dir ) dir = 1;
    var N2 = closest_power_of_two(N),
        sine, cosn, fourier,
        k, i, sin = Math.sin, cos = Math.cos, phi;
    
    sine = new FILTER.Array64F(N2); 
    cosn = new FILTER.Array64F(N2);
    for (k=0; k<N2; i++)
    {
        phi = PI2 * k/N2;
        sine[ k ] = dir * sin( phi );
        cosn[ k ] = cos( phi );
    }
    
    // from real to complex, zero-pad if needed
    if ( 1 === dir )
    {
        fourier = new FILTER.Array64F(N2<<1);
        for (k=0; k<N2; k+=2) 
        {
            i = k >>> 1;
            fourier[k] = i < N ? array[i] : 0;
            fourier[k+1] = 0;
        }
    }
    else
    {
        fourier = new FILTER.Array64F(N2);
    }
    
    fourier = fft(fourier, N2, dir, sine, cosn);
    
    // from complex to real
    if ( -1 === dir )
    {
        var array2 = new FILTER.Array64F(N2);
        for (k=0; k<N2; k+=2) 
        {
            array2[k >>> 1] = fourier[k];
        }
        return array2;
    }
    return fourier;
}

/*-Copyright Information------------------------------------------------------*/
/* Copyright (c) 1988 by the University of Arizona Digital Image Analysis Lab */
/*----------------------------------------------------------------------------*/
/*-General Information--------------------------------------------------------*/
/*                                                                            */
/*   This function computes the Fourier transform of an image.                */
/*                                                                            */
/*----------------------------------------------------------------------------*/
/*-Background Information-----------------------------------------------------*/
/*                                                                            */
/*   Bergland, G.D.:                                                          */
/*   "A guided tour of the fast Fourier transform."                           */
/*   IEEE Spectrum, Vol. 6, No. 7, July 1969                                  */
/*                                                                            */
/*----------------------------------------------------------------------------*/
function fft2d(im, w, h, dir, channel) // Number of rows/cols must be a power of two
{
    /*
    if ( !dir ) dir = 1;
    if ( undef === channel ) channel = FILTER.CHANNEL.RED;
    
    var i, j, k, nchannels = 3, w2, h2, N2; 
    var sine, cosn, array, sin = Math.sin, cos = Math.cos, phi;
    var temp, img, im2;

    w2 = closest_power_of_two( w );
    h2 = closest_power_of_two( h );
    N2 = closest_power_of_two( Math.max(w2, h2) );

    // create image of appropriate size 
    im2 = new FILTER.Array64F(w2*h2*(1 === dir ? 2 : 0.5));
    img = 1 === dir ? im2 : im;

    // allocate and initialize trigonometric tables 
    for (k = 0; k < N2; k++)
    {
        phi = PI2 * k / N2;
        sine[ k ] = dir * sin( phi );
        cosn[ k ] = cos( phi );
    }
    array = new FILTER.Array64F(2*N2);

    // Fourier transform each image channel (bands) 
    for (i = 0; i < nchannels; i++)
    {
        // convert from real to "complex" 
        if ( 1 === dir )
        {
            for (j = 0; j < h2; j += 1)
            {
                for (k = 0; k < w2; k += 2)
                {
                    im2[i][j][k] = in->data[i][j][k / 2];
                    im2data[i][j][k + 1] = (PIXEL) 0;
                }
            }
        }

        // fold 
        for (j = 0; j < img->nlin / 2; j++)
        {
            for (k = 0; k < img->npix / 2; k++)
            {
                temp = img->data[i][j][k];
                img->data[i][j][k] = img->data[i][img->nlin / 2 + j][img->npix / 2 + k];
                img->data[i][img->nlin / 2 + j][img->npix / 2 + k] = temp;
                temp = img->data[i][img->nlin / 2 + j][k];
                img->data[i][img->nlin / 2 + j][k] = img->data[i][j][img->npix / 2 + k];
                img->data[i][j][img->npix / 2 + k] = temp;
            }
        }

        // Fourier transform rows 
        for (j = 0; j < img->nlin; j++)
        {
            for (k = 0; k < img->npix; k++)
            {
                array[k] = (double) img->data[i][j][k];
            }
            
            fft( array, img->npix / 2, dir, sine, cosn );
            
            for (k = 0; k < img->npix; k++)
            {
                img->data[i][j][k] = (PIXEL) array[k];
            }
        }

        // Fourier transform columns 
        for (k = 0; k < img->npix; k += 2)
        {
            for (j = 0; j < img->nlin; j += 1)
            {
                array[2 * j] = (double) img->data[i][j][k];
                array[2 * j + 1] = (double) img->data[i][j][k + 1];
            }
            
            fft( array, img->nlin, dir, sine, cosn );
            
            for (j = 0; j < img->nlin; j += 1)
            {
                img->data[i][j][k] = (PIXEL) array[2 * j];
                img->data[i][j][k + 1] = (PIXEL) array[2 * j + 1];
            }
        }

        // unfold 
        for (j = 0; j < img->nlin / 2; j++)
        {
            for (k = 0; k < img->npix / 2; k++)
            {
                temp = img->data[i][j][k];
                img->data[i][j][k] =
                img->data[i][img->nlin / 2 + j][img->npix / 2 + k];
                img->data[i][img->nlin / 2 + j][img->npix / 2 + k] = temp;
                temp = img->data[i][img->nlin / 2 + j][k];
                img->data[i][img->nlin / 2 + j][k] =
                img->data[i][j][img->npix / 2 + k];
                img->data[i][j][img->npix / 2 + k] = temp;
            }
        }

        // convert from "complex" to real 
        if ( -1 === dir )
        {
            for (j = 0; j < in->nlin; j += 1)
            {
                for (k = 0; k < in->npix; k += 2)
                {
                    (*out)->data[i][j][k / 2] = in->data[i][j][k];
                }
            }
        }
    }
    */
    return im;
}
FMath.fft1d = fft1d;
FMath.fft2d = fft2d;

}(FILTER);