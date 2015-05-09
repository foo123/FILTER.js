/**
*
* Filter Math
* @package FILTER.js
*
**/
!function(FILTER, undef){
@@USE_STRICT@@

var sliceTyped = 'function' === typeof FILTER.Array64F.prototype.slice ? 'slice' : 'subarray',
    IMG = FILTER.ImArray, A32F = FILTER.Array32F, A64F = FILTER.Array64F,
    PI = Math.PI, PI2 = 2.0*PI, PI_2 = 0.5*PI, 
    sin = Math.sin, cos = Math.cos
;
Math.log2 = Math.log2 || function(x) { return Math.log(x) / Math.LN2; };

//
//
// Constants
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



FILTER.Math = {
    
    clamp: clamp,
    
    closestPower2: closest_power_of_two
};



FILTER.Interpolate = {
    
    // http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
    nearest: function( im, w, h, nw, nh ) {
        var size = (nw*nh)<<2, interpolated = new IMG(size),
            rx = (w-1)/nw, ry = (h-1)/nh, 
            i, j, x, y, xi, yi, pixel, index,
            yw, xoff, yoff, w4 = w<<2
        ;
        i=0; j=0; x=0; y=0; yi=0; yw=0; yoff=0;
        for (index=0; index<size; index+=4,j++,x+=rx) 
        {
            if ( j >= nw ) { j=0; x=0; i++; y+=ry; yi=~~y; yw=yi*w; yoff=y - yi<0.5 ? 0 : w4; }
            
            xi = ~~x; xoff = x - xi<0.5 ? 0 : 4;
            
            pixel = ((yw + xi)<<2) + xoff + yoff;

            interpolated[index]      = im[pixel];
            interpolated[index+1]    = im[pixel+1];
            interpolated[index+2]    = im[pixel+2];
            interpolated[index+3]    = im[pixel+3];
        }
        return interpolated;
    }

    // http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
    // http://tech-algorithm.com/articles/bilinear-image-scaling/
    ,bilinear: function( im, w, h, nw, nh ) {
        var size = (nw*nh)<<2, interpolated = new IMG(size),
            rx = (w-1)/nw, ry = (h-1)/nh, 
            A, B, C, D, a, b, c, d, 
            i, j, x, y, xi, yi, pixel, index,
            yw, dx, dy, w4 = w<<2
        ;
        i=0; j=0; x=0; y=0; yi=0; yw=0; dy=0;
        for (index=0; index<size; index+=4,j++,x+=rx) 
        {
            if ( j >= nw ) { j=0; x=0; i++; y+=ry; yi=~~y; dy=y - yi; yw=yi*w; }
            
            xi = ~~x; dx = x - xi;
            
            // Y = A(1-w)(1-h) + B(w)(1-h) + C(h)(1-w) + Dwh
            a = (1-dx)*(1-dy); b = (dx)*(1-dy);
            c = (dy)*(1-dx); d = (dx*dy);
            
            pixel = (yw + xi)<<2;

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
    }

    // http://www.gamedev.net/topic/229145-bicubic-interpolation-for-image-resizing/
    ,bicubic: function( im, w, h, nw, nh ) {
        var size = (nw*nh)<<2, interpolated = new IMG(size),
            rx = (w-1)/nw, ry = (h-1)/nh, 
            i, j, x, y, xi, yi, pixel, index,
            rgba = new IMG(4), 
            rgba0 = new A32F(4), rgba1 = new A32F(4), 
            rgba2 = new A32F(4), rgba3 = new A32F(4),
            yw, dx, dy, dx2, dx3, dy2, dy3, w4 = w<<2,
            B, BL, BR, BRR, BB, BBL, BBR, BBRR, C, L, R, RR, T, TL, TR, TRR,
            p, q, r, s
        ;
        i=0; j=0; x=0; y=0; yi=0; yw=0; dy=dy2=dy3=0;
        for (index=0; index<size; index+=4,j++,x+=rx) 
        {
            if ( j >= nw ) { j=0; x=0; i++; y+=ry; yi=~~y; dy=y - yi; dy2=dy*dy; dy3=dy2*dy3; yw=yi*w; }
            
            xi = ~~x; dx = x - xi; dx2 = dx*dx; dx3 = dx2*dx;
            
            pixel = (yw + xi)<<2;
            
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
            
            /*function interpolate_pixel(n, p0, p1, p2, p3, t)
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
            }*/
            //interpolate_pixel(rgba0, TL, T, TR, TRR, dx);
            p = (TRR[0] - TR[0]) - (TL[0] - T[0]);
            q = (TL[0] - T[0]) - p;
            r = TR[0] - TL[0];
            s = T[0];
            rgba0[0] = p * dx3 + q * dx2 + r * dx + s;
            p = (TRR[1] - TR[1]) - (TL[1] - T[1]);
            q = (TL[1] - T[1]) - p;
            r = TR[1] - TL[1];
            s = T[1];
            rgba0[1] = p * dx3 + q * dx2 + r * dx + s;
            p = (TRR[2] - TR[2]) - (TL[2] - T[2]);
            q = (TL[2] - T[2]) - p;
            r = TR[2] - TL[2];
            s = T[2];
            rgba0[2] = p * dx3 + q * dx2 + r * dx + s;
            p = (TRR[3] - TR[3]) - (TL[3] - T[3]);
            q = (TL[3] - T[3]) - p;
            r = TR[3] - TL[3];
            s = T[3];
            rgba0[3] = p * dx3 + q * dx2 + r * dx + s;
            
            //interpolate_pixel(rgba1, L, C, R, RR, dx);
            p = (RR[0] - R[0]) - (L[0] - C[0]);
            q = (L[0] - C[0]) - p;
            r = R[0] - L[0];
            s = C[0];
            rgba1[0] = p * dx3 + q * dx2 + r * dx + s;
            p = (RR[1] - R[1]) - (L[1] - C[1]);
            q = (L[1] - C[1]) - p;
            r = R[1] - L[1];
            s = C[1];
            rgba1[1] = p * dx3 + q * dx2 + r * dx + s;
            p = (RR[2] - R[2]) - (L[2] - C[2]);
            q = (L[2] - C[2]) - p;
            r = R[2] - L[2];
            s = C[2];
            rgba1[2] = p * dx3 + q * dx2 + r * dx + s;
            p = (RR[3] - R[3]) - (L[3] - C[3]);
            q = (L[3] - C[3]) - p;
            r = R[3] - L[3];
            s = C[3];
            rgba1[3] = p * dx3 + q * dx2 + r * dx + s;
            
            //interpolate_pixel(rgba2, BL, B, BR, BRR, dx);
            p = (BRR[0] - BR[0]) - (BL[0] - B[0]);
            q = (BL[0] - B[0]) - p;
            r = BR[0] - BL[0];
            s = B[0];
            rgba2[0] = p * dx3 + q * dx2 + r * dx + s;
            p = (BRR[1] - BR[1]) - (BL[1] - B[1]);
            q = (BL[1] - B[1]) - p;
            r = BR[1] - BL[1];
            s = B[1];
            rgba2[1] = p * dx3 + q * dx2 + r * dx + s;
            p = (BRR[2] - BR[2]) - (BL[2] - B[2]);
            q = (BL[2] - B[2]) - p;
            r = BR[2] - BL[2];
            s = B[2];
            rgba2[2] = p * dx3 + q * dx2 + r * dx + s;
            p = (BRR[3] - BR[3]) - (BL[3] - B[3]);
            q = (BL[3] - B[3]) - p;
            r = BR[3] - BL[3];
            s = B[3];
            rgba2[3] = p * dx3 + q * dx2 + r * dx + s;
            
            //interpolate_pixel(rgba3, BBL, BB, BBR, BBRR, dx);
            p = (BBRR[0] - BBR[0]) - (BBL[0] - BB[0]);
            q = (BBL[0] - BB[0]) - p;
            r = BBR[0] - BBL[0];
            s = BB[0];
            rgba3[0] = p * dx3 + q * dx2 + r * dx + s;
            p = (BBRR[1] - BBR[1]) - (BBL[1] - BB[1]);
            q = (BBL[1] - BB[1]) - p;
            r = BBR[1] - BBL[1];
            s = BB[1];
            rgba3[1] = p * dx3 + q * dx2 + r * dx + s;
            p = (BBRR[2] - BBR[2]) - (BBL[2] - BB[2]);
            q = (BBL[2] - BB[2]) - p;
            r = BBR[2] - BBL[2];
            s = BB[2];
            rgba3[2] = p * dx3 + q * dx2 + r * dx + s;
            p = (BBRR[3] - BBR[3]) - (BBL[3] - BB[3]);
            q = (BBL[3] - BB[3]) - p;
            r = BBR[3] - BBL[3];
            s = BB[3];
            rgba3[3] = p * dx3 + q * dx2 + r * dx + s;
            
            // Then we interpolate those 4 pixels to get a single pixel that is a composite of 4 * 4 pixels, 16 pixels
            //interpolate_pixel(rgba, rgba0, rgba1, rgba2, rgba3, dy);
            p = (rgba3[0] - rgba2[0]) - (rgba0[0] - rgba1[0]);
            q = (rgba0[0] - rgba1[0]) - p;
            r = rgba2[0] - rgba0[0];
            s = rgba1[0];
            rgba[0] = clamp(~~(p * dy3 + q * dy2 + r * dy + s + 0.5), 0, 255);
            p = (rgba3[1] - rgba2[1]) - (rgba0[1] - rgba1[1]);
            q = (rgba0[1] - rgba1[1]) - p;
            r = rgba2[1] - rgba0[1];
            s = rgba1[1];
            rgba[1] = clamp(~~(p * dy3 + q * dy2 + r * dy + s + 0.5), 0, 255);
            p = (rgba3[2] - rgba2[2]) - (rgba0[2] - rgba1[2]);
            q = (rgba0[2] - rgba1[2]) - p;
            r = rgba2[2] - rgba0[2];
            s = rgba1[2];
            rgba[2] = clamp(~~(p * dy3 + q * dy2 + r * dy + s + 0.5), 0, 255);
            p = (rgba3[3] - rgba2[3]) - (rgba0[3] - rgba1[3]);
            q = (rgba0[3] - rgba1[3]) - p;
            r = rgba2[3] - rgba0[3];
            s = rgba1[3];
            rgba[3] = clamp(~~(p * dy3 + q * dy2 + r * dy + s + 0.5), 0, 255);
            
            interpolated[index]      = rgba[0];
            interpolated[index+1]    = rgba[1];
            interpolated[index+2]    = rgba[2];
            interpolated[index+3]    = rgba[3];
        }
        return interpolated;
    }
    
    /*
    // https://code.google.com/a/eclipselabs.org/p/bicubic-interpolation-image-processing/source/browse/trunk/libimage.c
    ,biquadric: function( im, w, h, nw, nh ) {
    // TODO
    }
    */

    /*
    // http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
    ,lanczos: function( im, w, h, nw, nh ){
    // TODO
    }
    */
};


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



FILTER.Transform = {
    
    fft1d: function fft1d(in_array, N, dir) {
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
            out_array = transform[sliceTyped](0, N);
        }
        else
        {
            out_array = transform;
        }
        
        return out_array;
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
    ,fft2d: function(im, w, h, dir, channel) {
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
    }
};

}(FILTER);