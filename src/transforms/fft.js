/**
*
* Filter Transforms FFT
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var IMG = FILTER.ImArray, A32F = FILTER.Array32F, A64F = FILTER.Array64F,
    PI = FILTER.CONST.PI, PI2 = FILTER.CONST.PI2, PI_2 = FILTER.CONST.PI_2, 
    sin = Math.sin, cos = Math.cos, min = Math.min, max = Math.max,
    closest_power_of_two = FILTER.Util.Math.closest_power_of_two
;

function precompute_trigonometric_tables(sine, cosn, N, dir)
{
    // allocate and initialize trigonometric tables 
    var k, phi;
    for (k=0; k<N; k++)
    {
        phi = PI2 * k/N;
        sine[ k ] = dir * sin( phi );
        cosn[ k ] = cos( phi );
    }
}

// fft1d and fft2d
// adapted from: http://www.ltrr.arizona.edu/~mmunro/tclsadiedoc/html/fft2d_8c-source.html
// http://en.wikipedia.org/wiki/Fourier_transform#Signal_processing
// http://en.wikipedia.org/wiki/Fast_Fourier_transform
function fft_butterfly(array, N, dir, sine, cosn)
{
    var n, m, l, k, j, i, jc, kc, i2, j2, N_2 = N >>> 1;
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
        for (k = N_2; 1 <= k && k <= i; i -= k, k >>>= 1);
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
}



FILTER.Transform.fft1d = function(in_array, N, dir) {
    if ( !dir ) dir = 1;
    var Npow2 = closest_power_of_two(N), Npow2_complex = Npow2 << 1,
        sine, cosn, transform, out_array,
        k, i;
    
    transform = new A64F(Npow2_complex);
    
    // allocate and initialize trigonometric tables 
    precompute_trigonometric_tables(sine=new A64F(Npow2), cosn=new A64F(Npow2), Npow2, dir);
    
    // from real to complex, zero-pad if needed
    if ( 1 === dir )
    {
        for (k=0; k<Npow2_complex; k+=2) 
        {
            i = k >>> 1;
            transform[k] = i < N ? in_array[i] : 0; // zero-pad if needed
            transform[k+1] = 0; // complex part
        }
    }
    else
    {
        transform.set(in_array);
    }
    
    // compute fft butterfly
    fft_butterfly(transform, Npow2, dir, sine, cosn);
    
    // from complex to real
    if ( -1 === dir )
    {
        for (k=0; k<Npow2_complex; k+=2) transform[k >>> 1] = transform[k]; /* in-place */
        out_array = transform.subarray(0, N);
    }
    else
    {
        out_array = transform;
    }
    
    return out_array;
};

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
FILTER.Transform.fft2d = function(im, w, h, dir, channel) {
    // Number of rows/cols must be a power of two
    /*
    if ( !dir ) dir = 1;
    if ( undef === channel ) channel = FILTER.CHANNEL.RED;
    
    var i, j, k, nchannels = 3, w2, h2, N2, N22; 
    var sine, cosn, array;
    var temp, img, im2, Array64F = FILTER.Array64F;

    w2 = closest_power_of_two( w );
    h2 = closest_power_of_two( h );
    N2 = Math.max(w2, h2);

    // allocate and initialize trigonometric tables 
    precompute_trigonometric_tables(sine=new Array64F(N2), cosn=new Array64F(N2), N2, dir);
    
    N22 = N2 << 1;
    array = new FILTER.Array64F(N22);

    // create image of appropriate size 
    fourier = new Array64F(w2*h2*(1 === dir ? 2 : 0.5));
    img = 1 === dir ? im2 : im;

    // Fourier transform each image channel (bands) 
    //for (i = 0; i < nchannels; i++)
    // convert from real to "complex" 
    if ( 1 === dir )
    {
        for (j = 0; j < h2; j += 1)
        {
            for (k = 0; k < w2; k += 2)
            {
                im2[i][j][k] = im[j*k / 2];
                im2data[i][j][k + 1] = (PIXEL) 0;
            }
        }
    }

    // fold 
    for (j = 0; j < h / 2; j++)
    {
        for (k = 0; k < w / 2; k++)
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
    for (j = 0; j < h; j++)
    {
        for (k = 0; k < w; k++)
        {
            array[k] = img->data[i][j][k];
        }
        
        fft( array, w / 2, dir, sine, cosn );
        
        /*for (k = 0; k < w; k++)
        {
            img->data[i][j][k] = (PIXEL) array[k];
        }* /
        fourier.set(array, j*w);
    }

    // Fourier transform columns 
    for (k = 0; k < w; k += 2)
    {
        for (j = 0; j < h; j += 1)
        {
            array[2 * j] = img->data[i][j][k];
            array[2 * j + 1] = img->data[i][j][k + 1];
        }
        
        fft( array, h, dir, sine, cosn );
        
        for (j = 0; j < h; j += 1)
        {
            img->data[i][j][k] = (PIXEL) array[2 * j];
            img->data[i][j][k + 1] = (PIXEL) array[2 * j + 1];
        }
    }

    // unfold 
    for (j = 0; j < h / 2; j++)
    {
        for (k = 0; k < w / 2; k++)
        {
            temp = img->data[i][j][k];
            img->data[i][j][k] = img->data[i][img->nlin / 2 + j][img->npix / 2 + k];
            img->data[i][img->nlin / 2 + j][img->npix / 2 + k] = temp;
            temp = img->data[i][img->nlin / 2 + j][k];
            img->data[i][img->nlin / 2 + j][k] = img->data[i][j][img->npix / 2 + k];
            img->data[i][j][img->npix / 2 + k] = temp;
        }
    }

    // convert from "complex" to real 
    if ( -1 === dir )
    {
        for (j = 0; j < h; j += 1)
        {
            for (k = 0; k < w; k += 2)
            {
                (*out)->data[i][j][k / 2] = in->data[i][j][k];
            }
        }
    }
    */
};

}(FILTER);