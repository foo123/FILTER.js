/**
*
* Image Proxy Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var PROTO = 'prototype', devicePixelRatio = FILTER.devicePixelRatio,
    IMG = FILTER.ImArray, IMGcpy = FILTER.ImArrayCopy, A32F = FILTER.Array32F,
    CHANNEL = FILTER.CHANNEL, FORMAT = FILTER.FORMAT, MIME = FILTER.MIME, ID = 0,
    Color = FILTER.Color, Gradient = Color.Gradient, ImageUtil = FILTER.Util.Image,
    Canvas = FILTER.Canvas, CanvasProxy = FILTER.CanvasProxy,
    ArrayUtil = FILTER.Util.Array, arrayset = ArrayUtil.arrayset, subarray = ArrayUtil.subarray,
    Min = Math.min, Floor = Math.floor,

    RED = 1, GREEN = 2, BLUE = 4, ALPHA = 8, ALL_CHANNELS = RED|GREEN|BLUE|ALPHA,
    IDATA = 1, ODATA = 2, ISEL = 4, OSEL = 8, HIST = 16, SAT = 32, SPECTRUM = 64,
    WIDTH = 2, HEIGHT = 4, WIDTH_AND_HEIGHT = WIDTH | HEIGHT, SEL = ISEL|OSEL, DATA = IDATA|ODATA,
    CLEAR_DATA = ~DATA, CLEAR_SEL = ~SEL, CLEAR_HIST = ~HIST, CLEAR_SAT = ~SAT, CLEAR_SPECTRUM = ~SPECTRUM
;

// resize/scale/interpolate image data
ImageUtil.scale = ImageUtil.resize = FILTER.Interpolation.bilinear;

//
// Image (Proxy) Class
var FilterImage = FILTER.Image = FILTER.Class({
    name: "Image"
    
    ,constructor: function FilterImage( img ) {
        var self = this, w = 0, h = 0;
        // factory-constructor pattern
        if ( !(self instanceof FilterImage) ) return new FilterImage(img);
        self.id = ++ID;
        self.width = w; self.height = h;
        self.tmpCanvas = null;
        self.iCanvas = Canvas(w, h);
        self.oCanvas = Canvas(w, h);
        self.iData = null; self.iDataSel = null;
        self.oData = null; self.oDataSel = null;
        self.ictx = self.iCanvas.getContext('2d');
        self.octx = self.oCanvas.getContext('2d');
        self.domElement = self.oCanvas;
        self._gl = null;
        self._restorable = true;
        self.gray = false;
        self.selection = null;
        self._histogram = [null, null, null, null];
        self._integral = [null, null, null, null];
        self._spectrum = [null, null, null, null];
        // lazy
        self._refresh = 0;
        self._hstRefresh = 0;
        self._intRefresh = 0;
        self._spcRefresh = 0;
        self.nref = 0;
        if ( img ) self.image( img );
    }
    
    // properties
    ,id: null
    ,width: 0
    ,height: 0
    ,gray: false
    ,selection: null
    ,tmpCanvas: null
    ,iCanvas: null
    ,oCanvas: null
    ,ictx: null
    ,octx: null
    ,iData: null
    ,iDataSel: null
    ,oData: null
    ,oDataSel: null
    ,domElement: null
    ,_restorable: true
    ,_gl: undef
    ,_histogram: null
    ,_integral: null
    ,_spectrum: null
    ,_refresh: 0
    ,_hstRefresh: 0
    ,_intRefresh: 0
    ,_spcRefresh: 0
    ,nref: 0
    
    ,dispose: function( ) {
        var self = this;
        self.id = null;
        self.width = self.height = null;
        self.selection = self.gray = null;
        self.iData = self.iDataSel = self.oData = self.oDataSel = null;
        self.domElement = self.tmpCanvas = self.iCanvas = self.oCanvas = self.ictx = self.octx = null;
        self._restorable = self._gl = null;
        self._histogram = self._integral = self._spectrum = null;
        self._hstRefresh = self._intRefresh = self._spcRefresh = self._refresh = self.nref = null;
        return self;
    }
    
    ,clone: function( original ) {
        return new FilterImage(true === original ? this.iCanvas : this.oCanvas);
    }
    
    ,gl: function( options ) {
        if ( undef === this._gl ) this._gl = FILTER.GL( this.oCanvas, options );
        return this._gl;
    }
    
    ,grayscale: function( bool ) {
        var self = this;
        if ( !arguments.length )  return self.gray;
        self.gray = !!bool;
        return self;
    }
    
    ,restorable: function( enabled ) {
        var self = this;
        if ( !arguments.length ) enabled = true;
        self._restorable = !!enabled;
        return self;
    }
    
    // apply a filter (uses filter's own apply method)
    ,apply: function( filter, cb ) {
        filter.apply( this, this, cb || null );
        return this;
    }
    
    // apply2 a filter using another image as destination
    ,apply2: function( filter, destImg, cb ) {
        filter.apply( this, destImg, cb || null );
        return this;
    }
    
    ,select: function( x1, y1, x2, y2, absolute ) {
        var self = this, argslen = arguments.length;
        if ( false === x1 )
        {
            // deselect
            self.selection = null;
            self.iDataSel = null;
            self.oDataSel = null;
            self._refresh &= CLEAR_SEL;
        }
        else
        {
            // default
            if ( argslen < 1 ) x1 = 0;
            if ( argslen < 2 ) y1 = 0;
            if ( argslen < 3 ) x2 = 1;
            if ( argslen < 4 ) y2 = 1;
            // select
            self.selection = absolute ? [ 
                // clamp
                0 > x1 ? 0 : x1,
                0 > y1 ? 0 : y1,
                0 > x2 ? 0 : x2,
                0 > y2 ? 0 : y2,
                0
            ] : [
                // clamp
                0 > x1 ? 0 : (1 < x1 ? 1 : x1),
                0 > y1 ? 0 : (1 < y1 ? 1 : y1),
                0 > x2 ? 0 : (1 < x2 ? 1 : x2),
                0 > y2 ? 0 : (1 < y2 ? 1 : y2),
                1
            ];
            self._refresh |= SEL;
        }
        self.nref++;
        return self;
    }
    
    ,deselect: function( ) {
        return this.select( false );
    }
    
    // store the processed/filtered image as the original image
    // make the processed image the original image
    ,store: function( ) {
        var self = this;
        if ( self._restorable )
        {
            self.ictx.drawImage(self.oCanvas, 0, 0); 
            self._refresh |= IDATA;
            if (self.selection) self._refresh |= ISEL;
            self.nref++;
        }
        return self;
    }
    
    // restore the original image
    // remove any filters applied to original image
    ,restore: function( ) {
        var self = this;
        if ( self._restorable )
        {
            self.octx.drawImage(self.iCanvas, 0, 0); 
            self._refresh |= ODATA | HIST | SAT | SPECTRUM;
            self._hstRefresh = ALL_CHANNELS;
            self._intRefresh = ALL_CHANNELS;
            self._spcRefresh = ALL_CHANNELS;
            if (self.selection) self._refresh |= OSEL;
            self.nref++;
        }
        return self;
    }
    
    ,dimensions: function( w, h, refresh ) {
        var self = this;
        self._refresh |= DATA | HIST | SAT | SPECTRUM;
        self._hstRefresh = ALL_CHANNELS;
        self._intRefresh = ALL_CHANNELS;
        self._spcRefresh = ALL_CHANNELS;
        if (self.selection) self._refresh |= SEL;
        self.nref++;
        set_dimensions(self, w, h, WIDTH_AND_HEIGHT);
        return self;
    }
    ,setDimensions: null
    
    ,scale: function( sx, sy ) {
        var self = this;
        sx = sx||1; sy = sy||sx;
        if ( (1===sx) && (1===sy) ) return self;
        
        // lazy
        self.tmpCanvas = self.tmpCanvas || Canvas( self.width, self.height );
        var ctx = self.tmpCanvas.getContext('2d'), w = self.width, h = self.height;
        
        //ctx.save();
        ctx.scale(sx, sy);
        w = self.width = (sx*w+0.5)|0;
        h = self.height = (sy*h+0.5)|0;
        
        ctx.drawImage(self.oCanvas, 0, 0);
        self.oCanvas.style.width = w + 'px';
        self.oCanvas.style.height = h + 'px';
        self.oCanvas.width = w * devicePixelRatio;
        self.oCanvas.height = h * devicePixelRatio;
        self.octx.drawImage(self.tmpCanvas, 0, 0);
        
        if ( self._restorable )
        {
        ctx.drawImage(self.iCanvas, 0, 0);
        self.iCanvas.style.width = self.oCanvas.style.width;
        self.iCanvas.style.height = self.oCanvas.style.height;
        self.iCanvas.width = self.oCanvas.width;
        self.iCanvas.height = self.oCanvas.height;
        self.ictx.drawImage(self.tmpCanvas, 0, 0);
        }
        
        self.tmpCanvas.width = self.oCanvas.width;
        self.tmpCanvas.height = self.oCanvas.height;
        //ctx.restore();
        
        self._refresh |= DATA | HIST | SAT | SPECTRUM;
        self._hstRefresh = ALL_CHANNELS;
        self._intRefresh = ALL_CHANNELS;
        self._spcRefresh = ALL_CHANNELS;
        if (self.selection) self._refresh |= SEL;
        self.nref++;
        return self;
    }
    
    ,flipHorizontal: function( ) {
        var self = this;
        // lazy
        self.tmpCanvas = self.tmpCanvas || Canvas( self.width, self.height );
        var ctx = self.tmpCanvas.getContext('2d');
        
        ctx.translate(self.width, 0); 
        ctx.scale(-1, 1);
        
        ctx.drawImage(self.oCanvas, 0, 0);
        self.octx.drawImage(self.tmpCanvas, 0, 0);
        
        if ( self._restorable )
        {
        ctx.drawImage(self.iCanvas, 0, 0);
        self.ictx.drawImage(self.tmpCanvas, 0, 0);
        }
        
        self._refresh |= DATA | SAT | SPECTRUM;
        self._intRefresh = ALL_CHANNELS;
        //self._spcRefresh = ALL_CHANNELS;
        if (self.selection) self._refresh |= SEL;
        self.nref++;
        return self;
    }
    
    ,flipVertical: function( ) {
        var self = this;
        // lazy
        self.tmpCanvas = self.tmpCanvas || Canvas( self.width, self.height );
        var ctx = self.tmpCanvas.getContext('2d');
        
        ctx.translate(0, self.height); 
        ctx.scale(1, -1);
        
        ctx.drawImage(self.oCanvas, 0, 0);
        self.octx.drawImage(self.tmpCanvas, 0, 0);
        
        if ( self._restorable )
        {
        ctx.drawImage(self.iCanvas, 0, 0);
        self.ictx.drawImage(self.tmpCanvas, 0, 0);
        }
        
        self._refresh |= DATA | SAT | SPECTRUM;
        self._intRefresh = ALL_CHANNELS;
        //self._spcRefresh = ALL_CHANNELS;
        if (self.selection) self._refresh |= SEL;
        self.nref++;
        return self;
    }
    
    // TODO
    /*,draw: function( drawable, x, y, blendMode ) {
        return this;
    }*/
    
    // clear the image contents
    ,clear: function( ) {
        var self = this, w = self.width, h = self.height;
        if ( w && h )
        {
            if ( self._restorable ) self.ictx.clearRect(0, 0, w, h);
            self.octx.clearRect(0, 0, w, h);
            self._refresh |= DATA | HIST | SAT | SPECTRUM;
            self._hstRefresh = ALL_CHANNELS;
            self._intRefresh = ALL_CHANNELS;
            self._spcRefresh = ALL_CHANNELS;
            if (self.selection) self._refresh |= SEL;
            self.nref++;
        }
        return self;
    }
    
    // crop image region
    ,crop: function( x1, y1, x2, y2 ) {
        var self = this, sel = self.selection, 
            W = self.width, H = self.height, xs, ys, ws, hs, x, y, w, h;
        if ( !arguments.length )
        {
            if (sel)
            {
                xs = Floor(sel[0]*(W-1)); ys = Floor(sel[1]*(H-1));
                ws = Floor(sel[2]*(W-1))-xs+1; hs = Floor(sel[3]*(H-1))-ys+1;
                x = xs; y = ys;
                w = ws; h = hs;
                sel[0] = 0; sel[1] = 0;
                sel[2] = 1; sel[3] = 1;
            }
            else
            {
                return self;
            }
        }
        else
        {
            x = x1; y = y1;
            w = x2-x1+1; h = y2-y1+1;
        }
        
        // lazy
        self.tmpCanvas = self.tmpCanvas || Canvas( self.width, self.height );
        var ctx = self.tmpCanvas.getContext('2d');
        
        ctx.drawImage(self.oCanvas, 0, 0, W, H, x, y, w, h);
        self.oCanvas.style.width = w + 'px';
        self.oCanvas.style.height = h + 'px';
        self.oCanvas.width = w * devicePixelRatio;
        self.oCanvas.height = h * devicePixelRatio;
        self.octx.drawImage(self.tmpCanvas, 0, 0);
        
        if ( self._restorable )
        {
        ctx.drawImage(self.iCanvas, 0, 0, W, H, x, y, w, h);
        self.iCanvas.style.width = self.oCanvas.style.width;
        self.iCanvas.style.height = self.oCanvas.style.height;
        self.iCanvas.width = self.oCanvas.width;
        self.iCanvas.height = self.oCanvas.height;
        self.ictx.drawImage(self.tmpCanvas, 0, 0);
        }
        
        self.tmpCanvas.width = self.oCanvas.width;
        self.tmpCanvas.height = self.oCanvas.height;
        
        self._refresh |= DATA | HIST | SAT | SPECTRUM;
        self._hstRefresh = ALL_CHANNELS;
        self._intRefresh = ALL_CHANNELS;
        self._spcRefresh = ALL_CHANNELS;
        if (sel) self._refresh |= SEL;
        self.nref++;
        return self;
    }
        
    // fill image region with a specific (background) color
    ,fill: function( color, x, y, w, h ) {
        var self = this, sel = self.selection, 
            W = self.width, H = self.height, xs, ys, ws, hs;
        if (sel)
        {
            xs = Floor(sel[0]*(W-1)); ys = Floor(sel[1]*(H-1));
            ws = Floor(sel[2]*(W-1))-xs+1; hs = Floor(sel[3]*(H-1))-ys+1;
        }
        else
        {
            xs = 0; ys = 0;
            ws = W; hs = H;
        }
        if ( undef === x ) x = xs;
        if ( undef === y ) y = ys;
        if ( undef === w ) w = ws;
        if ( undef === h ) h = hs;
        
        // create the image data if needed
        if (w && !W && h && !H) self.createImageData(w, h);
        
        var ictx = self.ictx, octx = self.octx;
        color = color||0; 
        /*x = x||0; y = y||0; 
        w = w||W; h = h||H;*/
        
        if ( self._restorable )
        {
        ictx.fillStyle = color;  
        ictx.fillRect(x, y, w, h);
        }
        
        octx.fillStyle = color;  
        octx.fillRect(x, y, w, h);
        
        self._refresh |= DATA | HIST | SAT | SPECTRUM;
        self._hstRefresh = ALL_CHANNELS;
        self._intRefresh = ALL_CHANNELS;
        self._spcRefresh = ALL_CHANNELS;
        if (sel) self._refresh |= SEL;
        self.nref++;
        return self;
    }
    
    // get direct data array
    ,getData: function( processed ) {
        var self = this, Data;
        if ( self._restorable && !processed )
        {
        if (self._refresh & IDATA) refresh_data( self, IDATA );
        Data = self.iData;
        }
        else
        {
        if (self._refresh & ODATA) refresh_data( self, ODATA );
        Data = self.oData;
        }
        // clone it
        return new IMGcpy( Data.data );
    }
    
    // get direct data array of selected part
    ,getSelectedData: function( processed ) {
        var self = this, sel;
        
        if (self.selection)  
        {
            if ( self._restorable && !processed )
            {
            if (self._refresh & ISEL) refresh_selected_data( self, ISEL );
            sel = self.iDataSel;
            }
            else
            {
            if (self._refresh & OSEL) refresh_selected_data( self, OSEL );
            sel = self.oDataSel;
            }
        }
        else
        {
            if ( self._restorable && !processed )
            {
            if (self._refresh & IDATA) refresh_data( self, IDATA );
            sel = self.iData;
            }
            else
            {
            if (self._refresh & ODATA) refresh_data( self, ODATA );
            sel = self.oData;
            }
        }
        // clone it
        return [new IMGcpy( sel.data ), sel.width, sel.height];
    }
    
    // set direct data array
    ,setData: ArrayUtil.hasArrayset ? function( a ) {
        var self = this;
        if (self._refresh & ODATA) refresh_data( self, ODATA );
        self.oData.data.set(a);
        self.octx.putImageData(self.oData, 0, 0); 
        self._refresh |= HIST | SAT | SPECTRUM;
        self._hstRefresh = ALL_CHANNELS;
        self._intRefresh = ALL_CHANNELS;
        self._spcRefresh = ALL_CHANNELS;
        if (self.selection) self._refresh |= OSEL;
        self.nref++;
        return self;
    } : function( a ) {
        var self = this;
        if (self._refresh & ODATA) refresh_data( self, ODATA );
        arrayset(self.oData.data, a); // not supported in Opera, IE, Safari
        self.octx.putImageData(self.oData, 0, 0); 
        self._refresh |= HIST | SAT | SPECTRUM;
        self._hstRefresh = ALL_CHANNELS;
        self._intRefresh = ALL_CHANNELS;
        self._spcRefresh = ALL_CHANNELS;
        if (self.selection) self._refresh |= OSEL;
        self.nref++;
        return self;
    }
    
    // set direct data array of selected part
    ,setSelectedData: ArrayUtil.hasArrayset ? function( a ) {
        var self = this, sel = self.selection;
        if ( sel )
        {
            var xs = sel[0], ys = sel[1];
            if ( sel[4] )
            {
                // relative
                xs = Floor(xs*(self.width-1));
                ys = Floor(ys*(self.height-1));
            }
            if (self._refresh & OSEL) refresh_selected_data( self, OSEL );
            self.oDataSel.data.set(a);
            self.octx.putImageData(self.oDataSel, xs, ys); 
            self._refresh |= ODATA;
        }
        else
        {
            if (self._refresh & ODATA) refresh_data( self, ODATA );
            self.oData.data.set(a);
            self.octx.putImageData(self.oData, 0, 0); 
        }
        self._refresh |= HIST | SAT | SPECTRUM;
        self._hstRefresh = ALL_CHANNELS;
        self._intRefresh = ALL_CHANNELS;
        self._spcRefresh = ALL_CHANNELS;
        self.nref++;
        return self;
    } : function( a ) {
        var self = this, sel = self.selection;
        if ( sel )
        {
            var xs = sel[0], ys = sel[1];
            if ( sel[4] )
            {
                // relative
                xs = Floor(xs*(self.width-1));
                ys = Floor(ys*(self.height-1));
            }
            if (self._refresh & OSEL) refresh_selected_data( self, OSEL );
            arrayset(self.oDataSel.data, a); // not supported in Opera, IE, Safari
            self.octx.putImageData(self.oDataSel, xs, ys); 
            self._refresh |= ODATA;
        }
        else
        {
            if (self._refresh & ODATA) refresh_data( self, ODATA );
            arrayset(self.oData.data, a); // not supported in Opera, IE, Safari
            self.octx.putImageData(self.oData, 0, 0); 
        }
        self._refresh |= HIST | SAT | SPECTRUM;
        self._hstRefresh = ALL_CHANNELS;
        self._intRefresh = ALL_CHANNELS;
        self._spcRefresh = ALL_CHANNELS;
        self.nref++;
        return self;
    }
    
    
    ,createImageData: function( w, h ) {
        var self = this, ictx, octx;
        set_dimensions(self, w, h, WIDTH_AND_HEIGHT);
        if ( self._restorable ) 
        {
        ictx = self.ictx = self.iCanvas.getContext('2d');
        ictx.createImageData(w, h);
        }
        octx = self.octx = self.oCanvas.getContext('2d');
        octx.createImageData(w, h);
        self._refresh |= DATA;
        if (self.selection) self._refresh |= SEL;
        self.nref++;
        return self;
    }
    
    ,image: ArrayUtil.hasArrayset ? function( img ) {
        if ( !img ) return this;
        
        var self = this, ictx, octx, w, h, 
            isVideo, isCanvas, isImage//, isImageData
        ;
        
        if ( img instanceof FilterImage ) img = img.oCanvas;
        isVideo = ("undefined" !== typeof HTMLVideoElement) && (img instanceof HTMLVideoElement);
        isCanvas = (("undefined" !== typeof HTMLCanvasElement) && (img instanceof HTMLCanvasElement)) || (img instanceof CanvasProxy);
        isImage = ("undefined" !== typeof Image) && (img instanceof Image);
        //isImageData = img instanceof Object || "object" === typeof img;
        
        if ( isVideo )
        {
            w = img.videoWidth;
            h = img.videoHeight;
        }
        else
        {
            w = img.width;
            h = img.height;
        }
        
        if ( isImage || isCanvas || isVideo ) 
        {
            set_dimensions(self, w, h, WIDTH_AND_HEIGHT);
            if ( self._restorable ) 
            {
            ictx = self.ictx = self.iCanvas.getContext('2d');
            ictx.drawImage(img, 0, 0);
            }
            octx = self.octx = self.oCanvas.getContext('2d');
            octx.drawImage(img, 0, 0);
            self._refresh |= DATA;
        }
        else
        {
            if ( !self.oData ) 
            {
                self.createImageData(w, h);
                refresh_data(self, DATA);
            }
            
            if ( self._restorable )
            {
            ictx = self.ictx = self.iCanvas.getContext('2d');
            self.iData.data.set(img.data);
            ictx.putImageData(self.iData, 0, 0); 
            }
            
            octx = self.octx = self.oCanvas.getContext('2d');
            self.oData.data.set(img.data);
            octx.putImageData(self.oData, 0, 0); 
            //self._refresh &= CLEAR_DATA;
        }
        self._refresh |= HIST | SAT | SPECTRUM;
        self._hstRefresh = ALL_CHANNELS;
        self._intRefresh = ALL_CHANNELS;
        self._spcRefresh = ALL_CHANNELS;
        if (self.selection) self._refresh |= SEL;
        self.nref++;
        return self;
    } : function( img ) {
        if ( !img ) return this;
        
        var self = this, ictx, octx, w, h, 
            isVideo, isCanvas, isImage//, isImageData
        ;
        
        if ( img instanceof FilterImage ) img = img.oCanvas;
        isVideo = ("undefined" !== typeof HTMLVideoElement) && (img instanceof HTMLVideoElement);
        isCanvas = (("undefined" !== typeof HTMLCanvasElement) && (img instanceof HTMLCanvasElement)) || (img instanceof CanvasProxy);
        isImage = ("undefined" !== typeof Image) && (img instanceof Image);
        //isImageData = img instanceof Object || "object" === typeof img;
        
        if ( isVideo )
        {
            w = img.videoWidth;
            h = img.videoHeight;
        }
        else
        {
            w = img.width;
            h = img.height;
        }
        
        if ( isImage || isCanvas || isVideo ) 
        {
            set_dimensions(self, w, h, WIDTH_AND_HEIGHT);
            if ( self._restorable ) 
            {
            ictx = self.ictx = self.iCanvas.getContext('2d');
            ictx.drawImage(img, 0, 0);
            }
            octx = self.octx = self.oCanvas.getContext('2d');
            octx.drawImage(img, 0, 0);
            //self._refresh |= DATA;
        }
        else
        {
            if ( !self.oData ) 
            {
                self.createImageData(w, h);
                refresh_data(self, DATA);
            }
            
            if ( self._restorable )
            {
            ictx = self.ictx = self.iCanvas.getContext('2d');
            arrayset(self.iData.data, img.data); // not supported in Opera, IE, Safari
            ictx.putImageData(self.iData, 0, 0); 
            }
            
            octx = self.octx = self.oCanvas.getContext('2d');
            arrayset(self.oData.data, img.data); // not supported in Opera, IE, Safari
            octx.putImageData(self.oData, 0, 0); 
            //self._refresh &= CLEAR_DATA;
        }
        self._refresh |= HIST | SAT | SPECTRUM;
        self._hstRefresh = ALL_CHANNELS;
        self._intRefresh = ALL_CHANNELS;
        self._spcRefresh = ALL_CHANNELS;
        if (self.selection) self._refresh |= SEL;
        self.nref++;
        return self;
    }
    ,setImage: null
    
    ,getPixel: function( x, y ) {
        var self = this, w = self.width, h = self.height, offset;
        if ( 0 > x || x >= w || 0 > y || y >= h ) return null;
        if (self._refresh & ODATA) refresh_data( self, ODATA );
        offset = ((y*w+x)|0)<<2;
        return subarray(self.oData.data, offset, offset+4);
    }
    
    ,setPixel: function( x, y, rgba ) {
        var self = this, w = self.width, h = self.height;
        if ( 0 > x || x >= w || 0 > y || y >= h ) return self;
        //p = new IMG(4); p[0] = r&255; p[1] = g&255; p[2] = b&255; p[3] = a&255;
        self.octx.putImageData(rgba, x, y); 
        self._refresh |= ODATA | HIST | SAT | SPECTRUM;
        self._hstRefresh = ALL_CHANNELS;
        self._intRefresh = ALL_CHANNELS;
        self._spcRefresh = ALL_CHANNELS;
        if (self.selection) self._refresh |= OSEL;
        self.nref++;
        return self;
    }
    
    // get the imageData object
    ,getPixelData: function( ) {
        if (this._refresh & ODATA) refresh_data( this, ODATA );
        return this.oData;
    }
    
    // set the imageData object
    ,setPixelData: function( data ) {
        var self = this;
        self.octx.putImageData(data, 0, 0); 
        self._refresh |= ODATA | HIST | SAT | SPECTRUM;
        self._hstRefresh = ALL_CHANNELS;
        self._intRefresh = ALL_CHANNELS;
        self._spcRefresh = ALL_CHANNELS;
        if (self.selection) self._refresh |= OSEL;
        self.nref++;
        return self;
    }
    
    ,integral: function( channel ) {
        var self = this, gray = self.gray, CHANNEL,
            integ = ImageUtil.integral, integral = self._integral;
        if ( null == channel )
        {
            if ( self._refresh & SAT )
            {
                var data = self.getPixelData().data, w = self.width, h = self.height, i0;
                integral[0] = i0 = integ(data, w, h, 0);
                integral[1] = gray ? i0 : integ(data, w, h, 1);
                integral[2] = gray ? i0 : integ(data, w, h, 2);
                integral[3] = null;
                self._intRefresh = 0; self._refresh &= CLEAR_SAT;
            }
        }
        else
        {
            channel = channel || 0; CHANNEL = 1 << channel;
            if ( (self._refresh & SAT) || (self._intRefresh & CHANNEL) )
            {
                if ( gray && !(self._intRefresh & RED) )
                    integral[channel] = integral[0];
                else if ( gray && !(self._intRefresh & GREEN) )
                    integral[channel] = integral[1];
                else if ( gray && !(self._intRefresh & BLUE) )
                    integral[channel] = integral[2];
                else
                    integral[channel] = integ(self.getPixelData().data, self.width, self.height, channel);
                self._intRefresh &= ~CHANNEL; self._refresh &= CLEAR_SAT;
            }
        }
        return null == channel ? integral : integral[channel||0];
    }
    ,sat: null
    
    ,histogram: function( channel, pdf ) {
        var self = this, gray = self.gray, CHANNEL,
            hist = ImageUtil.histogram, histogram = self._histogram;
        if ( null == channel )
        {
            if ( self._refresh & HIST )
            {
                var data = self.getPixelData().data, w = self.width, h = self.height, h0;
                histogram[0] = h0 = hist(data, w, h, 0, pdf);
                histogram[1] = gray ? h0 : hist(data, w, h, 1, pdf);
                histogram[2] = gray ? h0 : hist(data, w, h, 2, pdf);
                histogram[3] = null;
                self._hstRefresh = 0; self._refresh &= CLEAR_HIST;
            }
        }
        else
        {
            channel = channel || 0; CHANNEL = 1 << channel;
            if ( (self._refresh & HIST) || (self._hstRefresh & CHANNEL) )
            {
                if ( gray && !(self._hstRefresh & RED) )
                    histogram[channel] = histogram[0];
                else if ( gray && !(self._hstRefresh & GREEN) )
                    histogram[channel] = histogram[1];
                else if ( gray && !(self._hstRefresh & BLUE) )
                    histogram[channel] = histogram[2];
                else
                    histogram[channel] = hist(self.getPixelData().data, self.width, self.height, channel, pdf);
                self._hstRefresh &= ~CHANNEL; self._refresh &= CLEAR_HIST;
            }
        }
        return null == channel ? histogram : histogram[channel||0];
    }
    
    // TODO
    ,spectrum: function( channel ) {
        var self = this, /*spec = ImageUtil.spectrum,*/ spectrum = self._spectrum;
        return null == channel ? spectrum : spectrum[channel||0];
    }
    ,fft: null
    
    ,linearGradient: function( colors, stops, angle, interpolate ) {
        var self = this, w = self.width, h = self.height, c = Gradient.stops( colors, stops );
        /*if ( FILTER.Browser.isNode )
        {*/
            self.setData( Gradient.linear( new IMG((w*h)<<2), w, h, c[0], c[1], angle, interpolate||Gradient.interpolate ) );
        /*}
        else
        {
            var t = Math.tan(angle), ctx = self.octx, grd = ctx.createLinearGradient(0, 0, (1-t)*(w-1), t*(h-1));
            for(var i=0,l=c[0].length; i<l; i++) grd.addColorStop(c[1][i], "rgba("+c[0][i].join(",")+")");
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, w, h);
        }*/
        return self;
    }
    
    ,radialGradient: function( colors, stops, centerX, centerY, radiusX, radiusY, interpolate ) {
        var self = this, w = self.width, h = self.height, c = Gradient.stops( colors, stops );
        /*if ( FILTER.Browser.isNode )
        {*/
            self.setData( Gradient.radial( new IMG((w*h)<<2), w, h, c[0], c[1], centerX, centerY, radiusX, radiusY, interpolate||Gradient.interpolate ) );
        /*}
        else
        {
            var ctx = self.octx, grd = ctx.createRadialGradient(centerX, centerY, radiusX*w, centerX, centerY, radiusY*h);
            for(var i=0,l=c[0].length; i<l; i++) grd.addColorStop(c[1][i], "rgba("+c[0][i].join(",")+")");
            ctx.fillStyle = grd;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radiusX*w, 0, Math.PI*2, true);
            ctx.fill();
        }*/
        return self;
    }
    
    ,perlinNoise: function( seed, seamless, grayscale, baseX, baseY, octaves, offsets, scale, roughness, use_perlin ) {
        var self = this, w = self.width, h = self.height;
        if ( ImageUtil.perlin )
        {
            if ( seed ) ImageUtil.perlin.seed( seed );
            self.setData( ImageUtil.perlin(new IMG((w*h)<<2), w, h, seamless, grayscale, baseX, baseY, octaves, offsets, scale, roughness, use_perlin) );
            self.gray = !!grayscale;
        }
        return self;
    }
    
    ,toImage: function( format, quality ) {
        format = format || 0; quality = quality || 1;
        var canvas = this.oCanvas, uri = null, CODEC = format & 16;
        if ( FORMAT.JPG === CODEC )         uri = canvas.toDataURL( MIME.JPG, quality );
        else if ( FORMAT.GIF === CODEC )    uri = canvas.toDataURL( MIME.GIF, quality );
        else/* if( FORMAT.PNG === CODEC )*/ uri = canvas.toDataURL( MIME.PNG, quality );
        if ( format & FORMAT.IMAGE )
        {
            var img = new Image( );
            img.src = uri;
            return img;
        }
        return uri;
    }
    
    ,toString: function( ) {
        return "[" + "FILTER Image: " + this.name + "]";
    }
});
// aliases
FilterImage[PROTO].setImage = FilterImage[PROTO].image;
FilterImage[PROTO].setDimensions = FilterImage[PROTO].dimensions;
FilterImage[PROTO].sat = FilterImage[PROTO].integral;
FilterImage[PROTO].fft = FilterImage[PROTO].spectrum;
// static
FilterImage.LinearGradient = FilterImage.Gradient = function LinearGradient( w, h, colors, stops, angle, interpolate ) {
    return new FilterImage().restorable(false).createImageData(w, h).linearGradient(colors, stops, angle, interpolate||Gradient.interpolate);
};
FilterImage.RadialGradient = function RadialGradient( w, h, colors, stops, centerX, centerY, radiusX, radiusY, interpolate ) {
    return new FilterImage().restorable(false).createImageData(w, h).radialGradient(colors, stops, centerX, centerY, radiusX, radiusY, interpolate||Gradient.interpolate);
};
FilterImage.PerlinNoise = function PerlinNoise( w, h, seed, seamless, grayscale, baseX, baseY, octaves, offsets, scale, roughness, use_perlin ) {
    return new FilterImage().restorable(false).createImageData(w, h).perlinNoise(seed, seamless, grayscale, baseX, baseY, octaves, offsets, scale, roughness, use_perlin);
};

//
// Scaled Image (Proxy) Class
var FilterScaledImage = FILTER.ScaledImage = FILTER.Class( FilterImage, {
    name: "ScaledImage"
    
    ,constructor: function FilterScaledImage( scalex, scaley, img ) {
        var self = this;
        // factory-constructor pattern
        if ( !(self instanceof FilterScaledImage) ) return new FilterScaledImage(scalex, scaley, img);
        self.scaleX = scalex || 1;
        self.scaleY = scaley || self.scaleX;
        self.$super('constructor', img);
    }
    
    ,scaleX: 1
    ,scaleY: 1
    
    ,dispose: function( ) {
        var self = this;
        self.scaleX = null;
        self.scaleY = null;
        self.$super('dispose');
        return self;
    }
    
    ,clone: function( original ) {
        var self = this;
        return new FilterScaledImage(self.scaleX, self.scaleY, true === original ? self.iCanvas : self.oCanvas);
    }
    
    ,setScale: function( sx, sy ) {
        var self = this, argslen = arguments.length;
        if (argslen > 0 && null != sx) 
        {
            self.scaleX = sx;
            self.scaleY = sx;
        }
        if (argslen > 1 && null != sy) 
            self.scaleY = sy;
        return self;
    }
    
    ,image: function( img ) {
        if ( !img ) return this;
        
        var self = this, ictx, octx, w, h, 
            sw, sh, sx = self.scaleX, sy = self.scaleY,
            isVideo, isCanvas, isImage//, isImageData
        ;
        
        if ( img instanceof FilterImage ) img = img.oCanvas;
        isVideo = ("undefined" !== typeof HTMLVideoElement) && (img instanceof HTMLVideoElement);
        isCanvas = (("undefined" !== typeof HTMLCanvasElement) && (img instanceof HTMLCanvasElement)) || (img instanceof CanvasProxy);
        isImage = ("undefined" !== typeof Image) && (img instanceof Image);
        //isImageData = img instanceof Object || "object" === typeof img;
        
        if ( isVideo )
        {
            w = img.videoWidth;
            h = img.videoHeight;
        }
        else
        {
            w = img.width;
            h = img.height;
        }
        
        if ( isImage || isCanvas || isVideo ) 
        {
            sw = (sx*w + 0.5)|0;
            sh = (sy*h + 0.5)|0;
            set_dimensions(self, sw, sh, WIDTH_AND_HEIGHT);
            if ( self._restorable ) 
            {
            ictx = self.ictx = self.iCanvas.getContext('2d');
            ictx.drawImage(img, 0, 0, w, h, 0, 0, sw, sh);
            }
            octx = self.octx = self.oCanvas.getContext('2d');
            octx.drawImage(img, 0, 0, w, h, 0, 0, sw, sh);
            self._refresh |= DATA | HIST | SAT | SPECTRUM;
            self._hstRefresh = ALL_CHANNELS;
            self._intRefresh = ALL_CHANNELS;
            self._spcRefresh = ALL_CHANNELS;
            if (self.selection) self._refresh |= SEL;
            self.nref++;
        }
        return self;
    }
});
// aliases
FilterScaledImage[PROTO].setImage = FilterScaledImage[PROTO].image;

// auxilliary (private) methods
function set_dimensions( scope, w, h, what ) 
{
    what = what || WIDTH_AND_HEIGHT;
    if ( what & WIDTH )
    {
        scope.width = w;
        scope.oCanvas.style.width = w + 'px';
        scope.oCanvas.width = w * devicePixelRatio;
        if ( scope._restorable ) 
        {
        scope.iCanvas.style.width = scope.oCanvas.style.width;
        scope.iCanvas.width = scope.oCanvas.width;
        }
        if ( scope.tmpCanvas )
        {
            scope.tmpCanvas.style.width = scope.oCanvas.style.width;
            scope.tmpCanvas.width = scope.oCanvas.width;
        }
    }
    if ( what & HEIGHT )
    {
        scope.height = h;
        scope.oCanvas.style.height = h + 'px';
        scope.oCanvas.height = h * devicePixelRatio;
        if ( scope._restorable ) 
        {
        scope.iCanvas.style.height = scope.oCanvas.style.height;
        scope.iCanvas.height = scope.oCanvas.height;
        }
        if ( scope.tmpCanvas )
        {
            scope.tmpCanvas.style.height = scope.oCanvas.style.height;
            scope.tmpCanvas.height = scope.oCanvas.height;
        }
    }
    /*if ( false !== refresh )
    {
        refresh_data( scope, DATA );
        if (scope.selection) refresh_selected_data( scope, SEL );
    }*/
    return scope;
}
function refresh_data( scope, what ) 
{
    var w = scope.width, h = scope.height;
    what = what || 255;
    if ( scope._restorable && (what & IDATA) && (scope._refresh & IDATA) )
    {
        scope.iData = scope.ictx.getImageData(0, 0, w, h);
        //scope.iData.cpy = new IMGcpy( scope.iData.data );
        scope._refresh &= ~IDATA;
    }
    if ( (what & ODATA) && (scope._refresh & ODATA) )
    {
        scope.oData = scope.octx.getImageData(0, 0, w, h);
        //scope.oData.cpy = new IMGcpy( scope.oData.data );
        scope._refresh &= ~ODATA;
    }
    //scope._refresh &= CLEAR_DATA;
    return scope;
}
function refresh_selected_data( scope, what ) 
{
    if ( scope.selection )
    {
        var sel = scope.selection, ow = scope.width-1, oh = scope.height-1,
            xs = sel[0], ys = sel[1], xf = sel[2], yf = sel[3], ws, hs;
        if ( sel[4] )
        {
            // relative
            xs = Floor(xs*ow); ys = Floor(ys*oh);
            xf = Floor(xf*ow); yf = Floor(sel[3]*oh);
        }
        ws = xf-xs+1; hs = yf-ys+1;
        what = what || 255;
        if ( scope._restorable && (what & ISEL) && (scope._refresh & ISEL) )
        {
            scope.iDataSel = scope.ictx.getImageData(xs, ys, ws, hs);
            //scope.iDataSel.cpy = new IMGcpy( scope.iDataSel.data );
            scope._refresh &= ~ISEL;
        }
        if ( (what & OSEL) && (scope._refresh & OSEL) )
        {
            scope.oDataSel = scope.octx.getImageData(xs, ys, ws, hs);
            //scope.oDataSel.cpy = new IMGcpy( scope.oDataSel.data );
            scope._refresh &= ~OSEL;
        }
    }
    //scope._refresh &= CLEAR_SEL;
    return scope;
}

}(FILTER);