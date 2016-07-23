/**
*
* Filter Fx, gradient, radial-gradient
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Image = FILTER.Image, floor = Math.floor, sqrt = Math.sqrt, abs = Math.abs,
    sin =Math.sin, cos = Math.cos,
    pi = Math.PI, pi2 = 2*pi, pi_2 = pi/2, pi_32 = 3*pi_2, min = Math.min;

Image.Gradient = function Gradient( w, h, colors, stops, angle ) {
    var Grad = new Image().restorable(false).createImageData(w, h),
        g = Grad.getData(), cl = colors.length, i, x, y, size = g.length,
        t, it, px, py, c1, c2, stop1, stop2, sn, cs, r;
    angle = angle || 0.0;
    if ( 0 > angle ) angle += pi2;
    if ( pi2 < angle ) angle -= pi2;
    sn = sin(angle); cs = cos(angle);
    r = cs*w + sn*h;
    if ( !stops )
    {
        if ( 1 === cl )
        {
            stops = [1.0];
        }
        else
        {
            stops = new Array(cl);
            for(i=0; i<cl; i++) stops[i] = i+1 === cl ? 1.0 : i/(cl-1);
        }
    }
    else if ( stops.length < cl )
    {
        var cstoplen = stops.length, cstop = stops[cstoplen-1];
        for(i=cstoplen; i<cl; i++) stops.push( i+1 === cl ? 1.0 : cstop+(i-cstoplen+1)/(cl-1) );
    }
    if ( 1.0 != stops[stops.length-1] )
    {
        stops.push( 1.0 );
        colors.push( colors[colors.length-1] );
    }
    for(x=0,y=0,i=0; i<size; i+=4,x++)
    {
        if ( x >= w ) { x=0; y++; }
        if ( (pi_2 < angle) && (angle <= pi) )
        {
            px = (w-1-x); py = y;
        }
        else if ( (pi < angle) && (angle <= pi_32) )
        {
            px = (w-1-x); py = (h-1-y);
        }
        else if ( (pi_32 < angle) && (angle < pi2) )
        {
            px = x; py = (h-1-y);
        }
        else //if ( (0 <= angle) && (angle <= pi_2) )
        {
            px = x; py = y;
        }
        t = min(1.0, abs((cs*px + sn*py) / r));
        stop1 = stop2 = 0;
        while ( t > stops[stop2] ) { stop1 = stop2; ++stop2; }
        c1 = colors[stop1]; c2 = colors[stop2];
        // warp the value if needed, between stop ranges
        t = stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t;
        it = 1.0-t;
        g[i  ] = (~~(c1[0]*it + c2[0]*t)) & 255;
        g[i+1] = (~~(c1[1]*it + c2[1]*t)) & 255;
        g[i+2] = (~~(c1[2]*it + c2[2]*t)) & 255;
        g[i+3] = (~~(c1[3]*it + c2[3]*t)) & 255;
    }
    Grad.setData( g );
    return Grad;
};

Image.RadialGradient = function RadialGradient( w, h, colors, stops, centerX, centerY ) {
    var Grad = new Image().restorable(false).createImageData(w, h),
        g = Grad.getData(), cl = colors.length, i, x, y, size = g.length,
        t, it, px, py, c1, c2, stop1, stop2;
    centerX = centerX || 0;
    centerY = centerY || 0;
    if ( !stops )
    {
        if ( 1 === cl )
        {
            stops = [1.0];
        }
        else
        {
            stops = new Array(cl);
            for(i=0; i<cl; i++) stops[i] = i+1 === cl ? 1.0 : i/(cl-1);
        }
    }
    else if ( stops.length < cl )
    {
        var cstoplen = stops.length, cstop = stops[cstoplen-1];
        for(i=cstoplen; i<cl; i++) stops.push( i+1 === cl ? 1.0 : cstop+(i-cstoplen+1)/(cl-1) );
    }
    if ( 1.0 != stops[stops.length-1] )
    {
        stops.push( 1.0 );
        colors.push( colors[colors.length-1] );
    }
    for(x=0,y=0,i=0; i<size; i+=4,x++)
    {
        if ( x >= w ) { x=0; y++; }
        px = (x-centerX)/(w-centerX); py = (y-centerY)/(h-centerY);
        t = min(1.0, sqrt(px*px + py*py));
        stop1 = stop2 = 0;
        while ( t > stops[stop2] ) { stop1 = stop2; ++stop2; }
        c1 = colors[stop1]; c2 = colors[stop2];
        // warp the value if needed, between stop ranges
        t = stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t;
        it = 1.0-t;
        g[i  ] = (~~(c1[0]*it + c2[0]*t)) & 255;
        g[i+1] = (~~(c1[1]*it + c2[1]*t)) & 255;
        g[i+2] = (~~(c1[2]*it + c2[2]*t)) & 255;
        g[i+3] = (~~(c1[3]*it + c2[3]*t)) & 255;
    }
    Grad.setData( g );
    return Grad;
};

}(FILTER);