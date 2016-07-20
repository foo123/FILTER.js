/**
*
* Filter Interpolation methods
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var clamp = FILTER.Math.clamp, IMG = FILTER.ImArray, A32F = FILTER.Array32F;

// http://www.gamedev.net/topic/229145-bicubic-interpolation-for-image-resizing/
FILTER.Interpolation.bicubic = function( im, w, h, nw, nh ) {
    var size = (nw*nh)<<2, interpolated = new IMG(size),
        rx = (w-1)/nw, ry = (h-1)/nh, 
        i, j, x, y, xi, yi, pixel, index,
        rgba = new IMG(4), 
        rgba0 = new A32F(4), rgba1 = new A32F(4), 
        rgba2 = new A32F(4), rgba3 = new A32F(4),
        yw, dx, dy, dx2, dx3, dy2, dy3, w4 = w<<2,
        B, BL, BR, BRR, BB, BBL, BBR, BBRR, C, L, R, RR, T, TL, TR, TRR,
        p, q, r, s, T_EDGE, B_EDGE, L_EDGE, R_EDGE
    ;
    i=0; j=0; x=0; y=0; yi=0; yw=0; dy=dy2=dy3=0; 
    for (index=0; index<size; index+=4,j++,x+=rx) 
    {
        if ( j >= nw ) {j=0; x=0; i++; y+=ry; yi=~~y; dy=y - yi; dy2=dy*dy; dy3=dy2*dy3; yw=yi*w;}
        xi = ~~x; dx = x - xi; dx2 = dx*dx; dx3 = dx2*dx;
        
        pixel = (yw + xi)<<2;
        T_EDGE = 0 === yi; B_EDGE = h-1 === yi; L_EDGE = 0 === xi; R_EDGE = w-1 === xi;
        
        // handle edge cases
        C = im.subarray(pixel, pixel+4);
        L = L_EDGE ? C : im.subarray(pixel-4, pixel);
        R = R_EDGE ? C : im.subarray(pixel+4, pixel+8);
        RR = R_EDGE ? C : im.subarray(pixel+8, pixel+12);
        B = B_EDGE ? C : im.subarray(pixel+w4, pixel+w4+4);
        BB = B_EDGE ? C : im.subarray(pixel+w4+w4, pixel+w4+w4+4);
        BL = B_EDGE||L_EDGE ? C : im.subarray(pixel+w4-4, pixel+w4);
        BR = B_EDGE||R_EDGE ? C : im.subarray(pixel+w4+4, pixel+w4+8);
        BRR = B_EDGE||R_EDGE ? C : im.subarray(pixel+w4+8, pixel+w4+12);
        BBL = B_EDGE||L_EDGE ? C : im.subarray(pixel+w4+w4-4, pixel+w4+w4);
        BBR = B_EDGE||R_EDGE ? C : im.subarray(pixel+w4+w4+4, pixel+w4+w4+8);
        BBRR = B_EDGE||R_EDGE ? C : im.subarray(pixel+w4+w4+8, pixel+w4+w4+12);
        T = T_EDGE ? C : im.subarray(pixel-w4, pixel-w4+4);
        TL = T_EDGE||L_EDGE ? C : im.subarray(pixel-w4-4, pixel-w4);
        TR = T_EDGE||R_EDGE ? C : im.subarray(pixel-w4+4, pixel-w4+8);
        TRR = T_EDGE||R_EDGE ? C : im.subarray(pixel-w4+8, pixel-w4+12);
        
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
};

}(FILTER);