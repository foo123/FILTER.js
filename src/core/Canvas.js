/**
*
* Canvas Proxy Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var CanvasProxy, CanvasProxyCtx, IMG = FILTER.ImArray, ImageUtil = FILTER.Util.Image,
    Color = FILTER.Color, Min = Math.min, Max = Math.max, resize = FILTER.Interpolation.bilinear,
    get = ImageUtil.get_data, set = ImageUtil.set_data, fill = ImageUtil.fill
;

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
            col = Color.Color2RGBA( fillStyle, [0,0,0,0], 0 );
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
            if ( !self._data )
            {
                W = self._w = w;
                H = self._h = h;
                self._data = new IMG((W*H)<<2);
            }
            dx = sx; dy = sy;
            set( self._data, W, H, idata, w, h, 0, 0, w-1, h-1, dx, dy );
        }
        else if ( 5 === argslen )
        {
            if ( !self._data )
            {
                W = self._w = sw;
                H = self._h = sh;
                self._data = new IMG((W*H)<<2);
            }
            dx = sx; dy = sy;
            dw = sw; dh = sh;
            if ( (w === dw) && (h === dh) )
                set( self._data, W, H, idata, dw, dh, 0, 0, dw-1, dh-1, dx, dy );
            else
                set( self._data, W, H, resize( idata, w, h, dw, dh ), dw, dh, 0, 0, dw-1, dh-1, dx, dy );
        }
        else
        {
            if ( !self._data )
            {
                W = self._w = dw;
                H = self._h = dh;
                self._data = new IMG((W*H)<<2);
            }
            if ( (sw === dw) && (sh === dh) )
                set( self._data, W, H, get( idata, w, h, sx, sy, sx+sw-1, sy+sh-1, true ), dw, dh, 0, 0, dw-1, dh-1, dx, dy );
            else
                set( self._data, W, H, resize( get( idata, w, h, sx, sy, sx+sw-1, sy+sh-1, true ), sw, sh, dw, dh ), dw, dh, 0, 0, dw-1, dh-1, dx, dy );
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
        var self = this, W = self._w, H = self._h, w = data.width, h = data.height;
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
        self._ctx = null;
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
        if ( self._ctx )
        {
            self._ctx.dispose( );
            self._ctx = null;
        }
        return self;
    },
    
    getContext: function( ctx, options ) {
        var self = this;
        if ( -1 < ctx.indexOf("webgl") ) return FILTER.GL( self, options );
        if ( !self._ctx ) self._ctx = new CanvasProxyCtx( self );
        return self._ctx;
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
//
// glsl (webgl/node-gl) support, override this for node-gl support
var GLExt = null;
FILTER.GL = FILTER.Browser.isNode
? function( canvas, options ){ return null; }
: function( canvas, options ){
    options = options || {
        depth: false,
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
        stencil: false,
        preserveDrawingBuffer: false
    };
    var gl = null;
    if ( !GLExt )
    {
        var names = ["webgl2", "experimental-webgl2", "webgl", "experimental-webgl", "webkit-3d", "moz-webgl"],
            nl = names.length, i;

        for(i=0; i<nl; ++i) 
        {
            try {
                gl = canvas.getContext(names[i], options);
            } catch(e) {
                gl = null;
            }
            if ( gl )  { GLExt = names[i]; break; }
        }
    }
    else
    {
        gl = canvas.getContext(GLExt, options);
    }
    return gl;
};

}(FILTER);