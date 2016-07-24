/**
*
* Filter Fx, gradient, radial-gradient
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Image = FILTER.Image, floor = Math.floor, sqrt = Math.sqrt,
    TypedArray = FILTER.TypedArray, abs = Math.abs, sin =Math.sin, cos = Math.cos,
    pi = Math.PI, pi2 = 2*pi, pi_2 = pi/2, pi_32 = 3*pi_2, min = Math.min;

function lerp( data, index, c1, c2, t )
{
    data[index  ] = (~~(c1[0] + t*(c2[0]-c1[0]))) & 255;
    data[index+1] = (~~(c1[1] + t*(c2[1]-c1[1]))) & 255;
    data[index+2] = (~~(c1[2] + t*(c2[2]-c1[2]))) & 255;
    data[index+3] = (~~(c1[3] + t*(c2[3]-c1[3]))) & 255;
}

/*function lerp_rgb( data, index, c1, c2, t )
{
    data[index  ] = (~~(c1[0] + t*(c2[0]-c1[0]))) & 255;
    data[index+1] = (~~(c1[1] + t*(c2[1]-c1[1]))) & 255;
    data[index+2] = (~~(c1[2] + t*(c2[2]-c1[2]))) & 255;
    //data[index+3] = (~~(c1[3] + t*(c2[3]-c1[3]))) & 255;
}*/

function colors_stops( colors, stops )
{
    stops = stops ? stops.slice() : stops;
    colors = colors ? colors.slice() : colors;
    var cl = colors.length, i;
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
    return [colors, stops];
}

function gradient( g, w, h, colors, stops, angle, interpolate )
{
    var i, x, y, size = g.length, t, px, py, stop1, stop2, sn, cs, r;
    //interpolate = interpolate || lerp;
    angle = angle || 0.0;
    if ( 0 > angle ) angle += pi2;
    if ( pi2 < angle ) angle -= pi2;
    sn = abs(sin(angle)); cs = abs(cos(angle));
    r = cs*w + sn*h;
    if ( (pi_2 < angle) && (angle <= pi) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = w-1-x; py = y;
            t = min(1.0, (cs*px + sn*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    else if ( (pi < angle) && (angle <= pi_32) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = w-1-x; py = h-1-y;
            t = min(1.0, (cs*px + sn*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    else if ( (pi_32 < angle) && (angle < pi2) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = x; py = h-1-y;
            t = min(1.0, (cs*px + sn*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    else //if ( (0 <= angle) && (angle <= pi_2) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = x; py = y;
            t = min(1.0, (cs*px + sn*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    return g;
}

function radial_gradient( g, w, h, colors, stops, centerX, centerY, radiusX, radiusY, interpolate )
{
    var i, x, y, size = g.length, t, px, py, stop1, stop2;
    //interpolate = interpolate || lerp;
    centerX = centerX || 0; centerY = centerY || 0;
    radiusX = radiusX || 1.0; radiusY = radiusY || 1.0;
    //relative radii to generate elliptical gradient instead of circular (rX=rY=1)
    if ( radiusY > radiusX )
    {
        radiusX = radiusX/radiusY;
        radiusY = 1.0;
    }
    else if ( radiusX > radiusY )
    {
        radiusY = radiusY/radiusX;
        radiusX = 1.0;
    }
    else
    {
        radiusY = 1.0;
        radiusX = 1.0;
    }
    for(x=0,y=0,i=0; i<size; i+=4,x++)
    {
        if ( x >= w ) { x=0; y++; }
        px = radiusX*(x-centerX)/(w-centerX); py = radiusY*(y-centerY)/(h-centerY);
        t = min(1.0, sqrt(px*px + py*py));
        stop2 = 0; while ( t > stops[stop2] ) ++stop2;
        stop1 = 0 === stop2 ? 0 : stop2-1;
        interpolate(
            g, i,
            colors[stop1], colors[stop2],
            // warp the value if needed, between stop ranges
            stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
        );
    }
    return g;
}

Image.Gradient = function Gradient( w, h, colors, stops, angle, interpolate ) {
    var Grad = new Image().restorable(false).createImageData(w, h), c = colors_stops( colors, stops );
    Grad.setData( gradient( Grad.getData(), w, h, c[0], c[1], angle, interpolate||lerp ) );
    return Grad;
};

Image.RadialGradient = function RadialGradient( w, h, colors, stops, centerX, centerY, radiusX, radiusY, interpolate ) {
    var Grad = new Image().restorable(false).createImageData(w, h), c = colors_stops( colors, stops );
    Grad.setData( radial_gradient( Grad.getData(), w, h, c[0], c[1], centerX, centerY, radiusX, radiusY, interpolate||lerp ) );
    return Grad;
};

// make plugins as well
FILTER.Create({
     name: "GradientFilter"
    
    // parameters
    ,colors: null
    ,stops: null
    ,angle: 0
    
    // constructor
    ,init: function( colors, stops, angle ) {
        var self = this;
        self.setColors( colors, stops );
        self.angle = angle||0;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.colors = null;
        self.stops = null;
        self.angle = null;
        self.$super('dispose');
        return self;
    }
    
    ,setColors: function( colors, stops ) {
        var self = this;
        if ( colors && colors.length )
        {
            var c = colors_stops( colors, stops );
            self.colors = c[0]; self.stops = c[1];
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, Mask = self.alphaMask;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 angle: self.angle
                ,colors: self.colors
                ,stops: self.stops
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.angle = params.angle;
            self.colors = TypedArray( params.colors, Array );
            self.stops = TypedArray( params.stops, Array );
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !self.colors ) return im;
        return gradient( im, w, h, self.colors, self.stops, self.angle, lerp );
    }
});

FILTER.Create({
     name: "RadialGradientFilter"
    
    // parameters
    ,colors: null
    ,stops: null
    ,centerX: 0
    ,centerY: 0
    ,radiusX: 1.0
    ,radiusY: 1.0
    
    // constructor
    ,init: function( colors, stops, centerX, centerY, radiusX, radiusY ) {
        var self = this;
        self.setColors( colors, stops );
        self.centerX = centerX||0;
        self.centerY = centerY||0;
        self.radiusX = radiusX||1.0;
        self.radiusY = radiusY||1.0;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.colors = null;
        self.stops = null;
        self.centerX = null;
        self.centerY = null;
        self.radiusX = null;
        self.radiusY = null;
        self.$super('dispose');
        return self;
    }
    
    ,setColors: function( colors, stops ) {
        var self = this;
        if ( colors && colors.length )
        {
            var c = colors_stops( colors, stops );
            self.colors = c[0]; self.stops = c[1];
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, Mask = self.alphaMask;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 centerX: self.centerX
                ,centerY: self.centerY
                ,radiusX: self.radiusX
                ,radiusY: self.radiusY
                ,colors: self.colors
                ,stops: self.stops
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.centerX = params.centerX || 0;
            self.centerY = params.centerY || 0;
            self.radiusX = params.radiusX || 1.0;
            self.radiusY = params.radiusY || 1.0;
            self.colors = TypedArray( params.colors, Array );
            self.stops = TypedArray( params.stops, Array );
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !self.colors ) return im;
        return radial_gradient( im, w, h, self.colors, self.stops, self.centerX, self.centerY, self.radiusX, self.radiusY, lerp );
    }
});

}(FILTER);