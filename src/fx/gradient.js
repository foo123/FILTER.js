/**
*
* Filter Fx, gradient, radial-gradient
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var floor = Math.floor;

FILTER.Image.Gradient = function Gradient( w, h, colors, stops, angle ) {
    var G = new FILTER.Image().restorable(false).createImageData(w, h),
        g = G.getData(), cl = colors.length, i, x, y, size = g.length,
        t, it, px, py, c1, c2, stop1, stop2, sin, cos;
    angle = angle || 0.0;
    sin = Math.sin(angle); cos = Math.cos(angle);
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
    stop1=stop2=0;
    for(x=0,y=0,i=0; i<size; i+=4,x++)
    {
        if ( x >= w ) { x=0; stop1=stop2=0; y++; }
        if ( 0 <= angle && angle <= Math.PI/2 )
        {
            px = x; py = y;
        }
        else if ( Math.PI/2 < angle && angle <= Math.PI )
        {
            px = w-1-x; py = y;
        }
        else if ( 0 > angle && angle >= -Math.PI/2 )
        {
            px = x; py = h-1-y;
        }
        else if ( -Math.PI/2 > angle && angle > -Math.PI )
        {
            px = w-1-x; py = h-1-y;
        }
        t = (cos*px + sin*py) / (cos*w + sin*h);
        if ( t > 1.0 ) t = 1.0;
        if ( t > stops[stop2] ) { stop1 = stop2; ++stop2; }
        c1 = colors[stop1]; c2 = colors[stop2];
        // warp the value if needed, between stop ranges
        t = stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t;
        it = 1.0-t;
        g[i  ] = (~~(c1[0]*it + c2[0]*t)) & 255;
        g[i+1] = (~~(c1[1]*it + c2[1]*t)) & 255;
        g[i+2] = (~~(c1[2]*it + c2[2]*t)) & 255;
        g[i+3] = (~~(c1[3]*it + c2[3]*t)) & 255;
    }
    G.setData( g );
    return G;
};

FILTER.Image.RadialGradient = function RadialGradient( w, h, colors, stops, centerX, centerY ) {
    var G = new FILTER.Image().restorable(false).createImageData(w, h),
        g = G.getData(), cl = colors.length, i, x, y, size = g.length,
        t, it, px, py, c1, c2, stop1, stop2, sqrt = Math.sqrt, atan2 = Math.atan2;
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
        t = sqrt(px*px + py*py);
        if ( t > 1.0 ) t = 1.0;
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
    G.setData( g );
    return G;
};

}(FILTER);