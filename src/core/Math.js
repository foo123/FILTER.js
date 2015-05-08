/**
*
* Filter Math
* @package FILTER.js
*
**/
!function(FILTER, undef){
@@USE_STRICT@@

var FMath = FILTER.Math = { };

Math.log2 = Math.log2 || function(x) { return Math.log(x) / Math.LN2; };

var sliceTyped = 'function' === typeof FILTER.Array64F.prototype.slice ? 'slice' : 'subarray';

//
//
// Constants
var PI = Math.PI, PI2 = 2.0*PI, PI_2 = 0.5*PI, 
sin = Math.sin, cos = Math.cos;
FILTER.CONSTANTS = {
     PI:    PI
    ,PI2:   PI2
    ,PI_2:  PI_2
    ,SQRT2: Math.SQRT2
    ,toRad: PI/180
    ,toDeg: 180/PI
};
function clamp(v, m, M) { return v > M ? M : (v < m ? m : v); }

function closest_power_of_two(x){ return Math.pow(2, Math.ceil(Math.log2(x))); }

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

var IMG = FILTER.ImArray;

FMath.clamp = clamp;
FMath.closestPower2 = closest_power_of_two;

// http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
FMath.nearest = function( im, w, h, nw, nh ) {
    var size = (nw*nh)<<2, interpolated = new IMG(size),
        x, y, pixel, index,
        x_ratio = (w-1)/nw, y_ratio = (h-1)/nh, 
        x_int, y_int, yw, x_off, y_off,
        i, j, w4 = w<<2
    ;
    i=0; j=0; y = 0; y_int = 0; yw = 0; y_off = 0;
    for (index=0; index<size; index+=4,j++) 
    {
        if ( j >= nw ) { j=0; i++; y = y_ratio * i; y_int = ~~y; yw = y_int*w; y_off = y - y_int<0.5 ? 0 : w4; }
        
        x = x_ratio * j; x_int = ~~x; x_off = x - x_int<0.5 ? 0 : 4;
        
        pixel = ((yw + x_int)<<2) + x_off + y_off;

        interpolated[index]      = im[pixel];
        interpolated[index+1]    = im[pixel+1];
        interpolated[index+2]    = im[pixel+2];
        interpolated[index+3]    = im[pixel+3];
    }
    return interpolated;
};

// http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
// http://tech-algorithm.com/articles/bilinear-image-scaling/
FMath.bilinear = function( im, w, h, nw, nh ) {
    var size = (nw*nh)<<2, interpolated = new IMG(size),
        A, B, C, D, a, b, c, d, 
        x, y, pixel, index,
        x_ratio = (w-1)/nw, y_ratio = (h-1)/nh, 
        x_int, y_int, yw, x_diff, y_diff, 
        i, j, w4 = w<<2
    ;
    i=0; j=0; y = 0; y_int = 0; yw = 0; y_diff = 0;
    for (index=0; index<size; index+=4,j++) 
    {
        if ( j >= nw ) { j=0; i++; y = y_ratio * i; y_int = ~~y; y_diff = y - y_int; yw = y_int*w; }
        
        x = x_ratio * j; x_int = ~~x; x_diff = x - x_int;
        
        // Y = A(1-w)(1-h) + B(w)(1-h) + C(h)(1-w) + Dwh
        a = (1-x_diff)*(1-y_diff); b = (x_diff)*(1-y_diff);
        c = (y_diff)*(1-x_diff); d = (x_diff*y_diff);
        
        pixel = (yw + x_int)<<2;

        A = im[pixel]; B = im[pixel+4];
        C = im[pixel+w4]; D = im[pixel+w4+4];
        interpolated[index] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);
        
        A = im[pixel+1]; B = im[pixel+5];
        C = im[pixel+w4+1]; D = im[pixel+w4+5];
        interpolated[index+1] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);

        A = im[pixel+2]; B = im[pixel+6];
        C = im[pixel+w4+2]; D = im[pixel+w4+6];
        interpolated[index+2] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);

        A = im[pixel+3]; B = im[pixel+7];
        C = im[pixel+w4+3]; D = im[pixel+w4+7];
        interpolated[index+3] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);
    }
    return interpolated;
};

/*function interpolate_value(v0, v1, v2, v3, t)
{
	var p = (v3 - v2) - (v0 - v1),
        q = (v0 - v1) - p,
        r = v2 - v0,
        s = v1,
        tSqrd = t * t;
	return (p * (tSqrd * t)) + (q * tSqrd) + (r * t) + s;
	//return (p * (tSqrd * t) + 0.5f) + (q * tSqrd + 0.5f) + (r * t + 0.5f) + s; // Use this one for nicer interpolation, it rounds instead of truncates.
}*/
function interpolate_pixel(n, p0, p1, p2, p3, t)
{
	var p, q, r, s, t2 = t*t, t3 = t2 * t, v;
    
	p = (p3[0] - p2[0]) - (p0[0] - p1[0]);
    q = (p0[0] - p1[0]) - p;
    r = p2[0] - p0[0];
    s = p1[0];
    n[0] = clamp(~~(p * t3 + q * t2 + r * t + s + 0.5), 0, 255);

	p = (p3[1] - p2[1]) - (p0[1] - p1[1]);
    q = (p0[1] - p1[1]) - p;
    r = p2[1] - p0[1];
    s = p1[1];
    n[1] = clamp(~~(p * t3 + q * t2 + r * t + s + 0.5), 0, 255);

	p = (p3[2] - p2[2]) - (p0[2] - p1[2]);
    q = (p0[2] - p1[2]) - p;
    r = p2[2] - p0[2];
    s = p1[2];
    n[2] = clamp(~~(p * t3 + q * t2 + r * t + s + 0.5), 0, 255);

	p = (p3[3] - p2[3]) - (p0[3] - p1[3]);
    q = (p0[3] - p1[3]) - p;
    r = p2[3] - p0[3];
    s = p1[3];
    n[3] = clamp(~~(p * t3 + q * t2 + r * t + s + 0.5), 0, 255);
}
// http://www.gamedev.net/topic/229145-bicubic-interpolation-for-image-resizing/
FMath.bicubic = function( im, w, h, nw, nh ) {
    var size = (nw*nh)<<2, interpolated = new IMG(size),
        x, y, pixel, index,
        rgba = new IMG(4), rgba0 = new IMG(4), rgba1 = new IMG(4), 
        rgba2 = new IMG(4), rgba3 = new IMG(4),
        x_ratio = (w-1)/nw, y_ratio = (h-1)/nh, 
        x_int, y_int, yw, x_diff, y_diff, 
        i, j, w4 = w<<2,
        B, BL, BR, BRR, BB, BBL, BBR, BBRR, C, L, R, RR, T, TL, TR, TRR
    ;
    i=0; j=0; y = 0; y_int = 0; yw = 0; y_diff = 0;
    for (index=0; index<size; index+=4,j++) 
    {
        if ( j >= nw ) { j=0; i++; y = y_ratio * i; y_int = ~~y; y_diff = y - y_int; yw = y_int*w; }
        
        x = x_ratio * j; x_int = ~~x; x_diff = x - x_int;
        
        pixel = (yw + x_int)<<2;
        
        // handle edge cases
        C = im.subarray(pixel, pixel+4);
        L = (0===x) ? C : im.subarray(pixel-4, pixel);
        R = (w-1===x) ? C : im.subarray(pixel+4, pixel+8);
        RR = (w-1===x) ? C : im.subarray(pixel+8, pixel+12);
        B = (h-1===y) ? C : im.subarray(pixel+w4, pixel+w4+4);
        BB = (h-1===y) ? C : im.subarray(pixel+w4+w4, pixel+w4+w4+4);
        BL = (h-1===y||0===x) ? C : im.subarray(pixel+w4-4, pixel+w4);
        BR = (h-1===y||w-1===x) ? C : im.subarray(pixel+w4+4, pixel+w4+8);
        BRR = (h-1===y||w-1===x) ? C : im.subarray(pixel+w4+8, pixel+w4+12);
        BBL = (h-1===y||0===x) ? C : im.subarray(pixel+w4+w4-4, pixel+w4+w4);
        BBR = (h-1===y||w-1===x) ? C : im.subarray(pixel+w4+w4+4, pixel+w4+w4+8);
        BBRR = (h-1===y||w-1===x) ? C : im.subarray(pixel+w4+w4+8, pixel+w4+w4+12);
        T = (0===y) ? C : im.subarray(pixel-w4, pixel-w4+4);
        TL = (0===y||0===x) ? C : im.subarray(pixel-w4-4, pixel-w4);
        TR = (0===y||w-1===x) ? C : im.subarray(pixel-w4+4, pixel-w4+8);
        TRR = (0===y||w-1===x) ? C : im.subarray(pixel-w4+8, pixel-w4+12);
        
        interpolate_pixel(rgba0, TL, T, TR, TRR, x_diff);
        interpolate_pixel(rgba1, L, C, R, RR, x_diff);
        interpolate_pixel(rgba2, BL, B, BR, BRR, x_diff);
        interpolate_pixel(rgba3, BBL, BB, BBR, BBRR, x_diff);
        // Then we interpolate those 4 pixels to get a single pixel that is a composite of 4 * 4 pixels, 16 pixels
        interpolate_pixel(rgba, rgba0, rgba1, rgba2, rgba3, y_diff);
        
        interpolated[index]      = rgba[0];
        interpolated[index+1]    = rgba[1];
        interpolated[index+2]    = rgba[2];
        interpolated[index+3]    = rgba[3];
    }
    return interpolated;
};

// https://code.google.com/a/eclipselabs.org/p/bicubic-interpolation-image-processing/source/browse/trunk/libimage.c
/*FMath.biquadric = function( im, w, h, nw, nh ){
};*/

// http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
// TODO
/*FMath.lanczos = function( im, w, h, nw, nh ){
};*/


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

FMath.fft1d = function fft1d(in_array, N, dir) {
    if ( !dir ) dir = 1;
    var Array64F = FILTER.Array64F,
        Npow2 = closest_power_of_two(N), Npow2_complex = Npow2 << 1,
        sine, cosn, transform, out_array,
        k, i;
    
    transform = new Array64F(Npow2_complex);
    
    // allocate and initialize trigonometric tables 
    precompute_trigonometric_tables(sine=new Array64F(Npow2), cosn=new Array64F(Npow2), Npow2, dir);
    
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
        out_array = transform[sliceTyped](0, N);
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
FMath.fft2d = function fft2d(im, w, h, dir, channel) {
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