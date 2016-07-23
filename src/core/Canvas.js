/**
*
* Canvas Proxy Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var CanvasProxy, CanvasProxyCtx, IMG = FILTER.ImArray, IMGcpy = FILTER.ImArrayCopy,
    Color = FILTER.Color, Min = Math.min, Max = Math.max, resize = FILTER.Interpolation.bilinear
;

function get( D, W, H, x0, y0, x1, y1, orig )
{
    x0 = Min(x0, W-1); y0 = Min(y0, H-1);
    x1 = Min(x1, W-1); y1 = Min(y1, H-1);
    if ( (0 === x0) && (0 === y0) && (W === x1+1) && (H === y1+1) ) return true === orig ? D : new IMGcpy( D );
    if ( !D.length || (x1 < x0) || (y1 < y0) ) return new IMG(0);
    var x, y, i, I, w = x1-x0+1, h = y1-y0+1, size = (w*h) << 2, d = new IMG(size);
    for(x=x0,y=y0,i=0; y<=y1; i+=4,x++)
    {
        if ( x>x1 ){ x=x0; y++; }
        I = (y*W + x) << 2;
        d[i  ] = D[I  ];
        d[i+1] = D[I+1];
        d[i+2] = D[I+2];
        d[i+3] = D[I+3];
    }
    return d;
}

function set( D, W, H, d, w, h, x0, y0, x1, y1, X0, Y0 )
{
    var i, I, x, y;
    if ( !D.length || !d.length || !w || !h || !W || !H ) return D;
    x0 = Min(x0, w-1); y0 = Min(y0, h-1);
    X0 = Min(X0, W-1); Y0 = Min(Y0, H-1);
    x1 = Min(x1, w-1); y1 = Min(y1, h-1);
    X0 -= x0; Y0 -= y0;
    for(x=x0,y=y0; y<=y1; x++)
    {
        if ( x>x1 ) { x=x0; y++; }
        if ( (y+Y0 >= H) || (x+X0 >= W) ) continue;
        i = (y*w + x) << 2;
        I = ((y+Y0)*W + x+X0) << 2;
        D[I  ] = d[i  ];
        D[I+1] = d[i+1];
        D[I+2] = d[i+2];
        D[I+3] = d[i+3];
    }
    return D;
}

function scale( d, w, h, nw, nh )
{
    return (w === nw) && (h === nh) ? d : resize( d, w, h, nw, nh );
}

function fill( D, W, H, c, x0, y0, x1, y1 )
{
    x0 = Min(x0, W-1); y0 = Min(y0, H-1);
    x1 = Min(x1, W-1); y1 = Min(y1, H-1);
    if ( !D.length || (x1 < x0) || (y1 < y0) ) return D;
    var x, y, i, r = c[0] & 255, g = c[1] & 255, b = c[2] & 255, a = 3 < c.length ? c[3] & 255 : 255;
    for(x=x0,y=y0; y<=y1; x++)
    {
        if ( x>x1 ) { x=x0; y++; }
        i = (y*W + x) << 2;
        D[i  ] = r;
        D[i+1] = g;
        D[i+2] = b;
        D[i+3] = a;
    }
    return D;
}

CanvasProxyCtx = FILTER.Class({
    constructor: function CanvasProxyCtx( canvas ) {
        var self = this;
        self._cnv = canvas;
        self._transform = {scale:[1,1], translate:[0,0], rotate:[0,0]};
        self._data = null;
    },
    
    _cnv: null,
    _w: 0, _h: 0,
    _transform: null,
    _data: null,
    fillStyle: null,
    
    dispose: function( ) {
        var self = this;
        self._cnv = null;
        self._data = null;
        self._transform = null;
        return self;
    },
    
    fillRect: function( x, y, w, h ) {
        var self = this, W = self._w, H = self._h, col, fillStyle = self.fillStyle;
        if ( null == x ) x = 0;
        if ( null == y ) y = 0;
        if ( null == w ) w = W;
        if ( null == h ) h = H;
        if ( fillStyle === +fillStyle )
        {
            col = Color.Color2RGBA( fillStyle );
        }
        else if ( fillStyle && fillStyle.substr )
        {
            col = Color.fromString( fillStyle ).toRGB( false );
            col[3] = ~~(255*col[3]);
        }
        else
        {
            col = fillStyle && (2 < fillStyle.length) ? fillStyle : [0,0,0,0];
        }
        fill( self._data, W, H, col, x, y, x+w-1, y+h-1 );
    },
    
    clearRect: function( x, y, w, h ) {
        var self = this, W = self._w, H = self._h;
        if ( null == x ) x = 0;
        if ( null == y ) y = 0;
        if ( null == w ) w = W;
        if ( null == h ) h = H;
        fill( self._data, W, H, [0,0,0,0], x, y, x+w-1, y+h-1 );
    },
    
    drawImage: function( canvas, sx, sy, sw, sh, dx, dy, dw, dh ) {
        var self = this, W = self._w, H = self._h,
            w = canvas._ctx._w, h = canvas._ctx._h,
            idata = canvas._ctx._data,
            argslen = arguments.length
        ;
        if ( 3 === argslen )
        {
            dx = sx; dy = sy;
            set( self._data, W, H, idata, w, h, 0, 0, w-1, h-1, dx, dy );
        }
        else if ( 5 === argslen )
        {
            dx = sx; dy = sy;
            dw = sw; dh = sh;
            set( self._data, W, H, scale( idata, w, h, dw, dh ), dw, dh, 0, 0, dw-1, dh-1, dx, dy );
        }
        else
        {
            set( self._data, W, H, scale( get( idata, w, h, sx, sy, sx+sw-1, sy+sh-1, true ), sw, sh, dw, dh ), dw, dh, 0, 0, dw-1, dh-1, dx, dy );
        }
    },
    
    createImageData: function( w, h ) {
        var self = this;
        self._data = new IMG((w*h)<<2);
        self._w = w; self._h = h;
        fill( self._data, w, h, [0,0,0,0], 0, 0, w-1, h-1 );
        return self;
    },
    
    putImageData: function( data, x, y ) {
        var self = this, W = self._w, H = self._h,
            w = data.width, h = data.height;
        if ( null == x ) x = 0;
        if ( null == y ) y = 0;
        set( self._data, W, H, data.data, w, h, 0, 0, w-1, h-1, x, y );
    },
    
    getImageData: function( x, y, w, h ) {
        var self = this, W = self._w, H = self._h, x1, y1, x2, y2;
        if ( null == x ) x = 0;
        if ( null == y ) y = 0;
        if ( null == w ) w = W;
        if ( null == h ) h = H;
        x1 = Max(0, Min(x, w-1, W-1));
        y1 = Max(0, Min(y, h-1, H-1));
        x2 = Min(x1+w-1, w-1, W-1);
        y2 = Min(y1+h-1, h-1, H-1);
        return {data: get( self._data, W, H, x1, y1, x2, y2 ), width: x2-x1+1, height: y2-y1+1};
    },
    
    scale: function( sx, sy ) {
        var self = this;
        self._transform.scale[0] = sx;
        self._transform.scale[1] = sy;
        return self;
    },
    
    translate: function( tx, ty ) {
        var self = this;
        self._transform.translate[0] = tx;
        self._transform.translate[1] = ty;
        return self;
    }
});

CanvasProxy = FILTER.CanvasProxy = FILTER.Class({
    constructor: function CanvasProxy( w, h ) {
        var self = this;
        self.width = w || 0;
        self.height = h || 0;
        self.style = { };
        self._ctx = new CanvasProxyCtx( self );
    },
    
    _ctx: null,
    width: null,
    height: null,
    style: null,
    
    dispose: function( ) {
        var self = this;
        self.width = null;
        self.height = null;
        self.style = null;
        self._ctx.dispose( );
        self._ctx = null;
        return self;
    },
    
    getContext: function( context ) {
        return this._ctx;
    },
    
    toDataURL: function( mime ) {
        return '';
    }
});

FILTER.Canvas = function( w, h ) {
    var canvas = FILTER.Browser.isNode ? new CanvasProxy( ) : document.createElement( 'canvas' );
    w = w || 0; h = h || 0;
    
    // set the display size of the canvas.
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
     
    // set the size of the drawingBuffer
    canvas.width = w * FILTER.devicePixelRatio;
    canvas.height = h * FILTER.devicePixelRatio;
    
    return canvas;
};

}(FILTER);