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
    ImageUtil = FILTER.Util.Image, Canvas = FILTER.Canvas, CanvasProxy = FILTER.CanvasProxy,
    FORMAT = FILTER.FORMAT, MIME = FILTER.MIME, ID = 0,
    notSupportTyped = FILTER._notSupportTypedArrays,
    arrayset = FILTER.Util.Array.arrayset, subarray = FILTER.Util.Array.subarray,
    Min = Math.min, Floor = Math.floor,

    IDATA = 1, ODATA = 2, ISEL = 4, OSEL = 8, HIST = 16, SAT = 32, SPECTRUM = 64,
    WIDTH = 2, HEIGHT = 4, WIDTH_AND_HEIGHT = WIDTH | HEIGHT,
    SEL = ISEL|OSEL, DATA = IDATA|ODATA,
    CLEAR_DATA = ~DATA, CLEAR_SEL = ~SEL,
    CLEAR_HIST = ~HIST, CLEAR_SAT = ~SAT, CLEAR_SPECTRUM = ~SPECTRUM
;

// auxilliary (private) methods
function tmp_canvas( scope ) 
{
    var w = scope.width, h = scope.height, cnv = Canvas( w, h );
    cnv.width = w * devicePixelRatio;
    cnv.height = h * devicePixelRatio;
    return cnv;
}

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
    return scope;
}

function refresh_data( scope, what ) 
{
    var w = scope.width, h = scope.height;
    what = what || 255;
    if ( scope._restorable && (what & IDATA) && (scope._needsRefresh & IDATA) )
    {
        scope.iData = scope.ictx.getImageData(0, 0, w, h);
        scope._needsRefresh &= ~IDATA;
    }
    if ( (what & ODATA) && (scope._needsRefresh & ODATA) )
    {
        scope.oData = scope.octx.getImageData(0, 0, w, h);
        scope._needsRefresh &= ~ODATA;
    }
    //scope._needsRefresh &= CLEAR_DATA;
    return scope;
}

function refresh_selected_data( scope, what ) 
{
    if ( scope.selection )
    {
        var sel = scope.selection, ow = scope.width-1, oh = scope.height-1,
            xs = Floor(sel[0]*ow), ys = Floor(sel[1]*oh), 
            ws = Floor(sel[2]*ow)-xs+1, hs = Floor(sel[3]*oh)-ys+1
        ;
        what = what || 255;
        if ( scope._restorable && (what & ISEL) && (scope._needsRefresh & ISEL) )
        {
            scope.iDataSel = scope.ictx.getImageData(xs, ys, ws, hs);
            scope._needsRefresh &= ~ISEL;
        }
        if ( (what & OSEL) && (scope._needsRefresh & OSEL) )
        {
            scope.oDataSel = scope.octx.getImageData(xs, ys, ws, hs);
            scope._needsRefresh &= ~OSEL;
        }
    }
    //scope._needsRefresh &= CLEAR_SEL;
    return scope;
}
    
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
        self.iData = null; self.iDataSel = null;
        self.oData = null; self.oDataSel = null;
        self.iCanvas = Canvas(w, h);
        self.oCanvas = Canvas(w, h);
        self.tmpCanvas = null;
        self.domElement = self.oCanvas;
        self.ictx = self.iCanvas.getContext('2d');
        self.octx = self.oCanvas.getContext('2d');
        self.webgl = null;
        self._histogram = [null, null, null, null];
        self._integral = [null, null, null, null];
        self._spectrum = [null, null, null, null];
        self._histogramRefresh = [0, 0, 0, 0];
        self._integralRefresh = [0, 0, 0, 0];
        self._spectrumRefresh = [0, 0, 0, 0];
        // lazy
        self.selection = null;
        self._needsRefresh = 0;
        self._restorable = true;
        self._grayscale = false;
        if ( img ) self.image( img );
    }
    
    // properties
    ,id: null
    ,width: 0
    ,height: 0
    ,selection: null
    ,iCanvas: null
    ,oCanvas: null
    ,tmpCanvas: null
    ,ictx: null
    ,octx: null
    ,iData: null
    ,iDataSel: null
    ,oData: null
    ,oDataSel: null
    ,domElement: null
    ,webgl: null
    ,_histogram: null
    ,_integral: null
    ,_spectrum: null
    ,_needsRefresh: 0
    ,_restorable: true
    ,_grayscale: false
    
    ,dispose: function( ) {
        var self = this;
        self.id = null;
        self.width = null;
        self.height = null;
        self.selection = null;
        self.ictx = null;
        self.octx = null;
        self.iData = null;
        self.iDataSel = null;
        self.oData = null;
        self.oDataSel = null;
        self.iCanvas = null;
        self.oCanvas = null;
        self.tmpCanvas = null;
        self.domElement = null;
        self.webgl = null;
        self._histogram = null;
        self._integral = null;
        self._spectrum = null;
        self._histogramRefresh = null;
        self._integralRefresh = null;
        self._spectrumRefresh = null;
        self._needsRefresh = null;
        self._restorable = null;
        self._grayscale = null;
        return self;
    }
    
    ,clone: function( original ) {
        return new FilterImage(true === original ? this.iCanvas : this.oCanvas);
    }
    
    ,grayscale: function( bool ) {
        var self = this;
        if ( !arguments.length )  return self._grayscale;
        self._grayscale = !!bool;
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
    
    ,select: function( x1, y1, x2, y2 ) {
        var self = this, argslen = arguments.length;
        // default
        if ( argslen < 1 ) x1 = 0;
        if ( argslen < 2 ) y1 = 0;
        if ( argslen < 3 ) x2 = 1;
        if ( argslen < 4 ) y2 = 1;
        // select
        self.selection = [ 
            // clamp
            0 > x1 ? 0 : (1 < x1 ? 1 : x1),
            0 > y1 ? 0 : (1 < y1 ? 1 : y1),
            0 > x2 ? 0 : (1 < x2 ? 1 : x2),
            0 > y2 ? 0 : (1 < y2 ? 1 : y2)
        ];
        self._needsRefresh |= SEL;
        return self;
    }
    
    ,deselect: function( ) {
        var self = this;
        self.selection = null;
        self.iDataSel = null;
        self.oDataSel = null;
        self._needsRefresh &= CLEAR_SEL;
        return self;
    }
    
    // store the processed/filtered image as the original image
    // make the processed image the original image
    ,store: function( ) {
        var self = this;
        if ( self._restorable )
        {
            self.ictx.drawImage(self.oCanvas, 0, 0); 
            self._needsRefresh |= IDATA;
            if (self.selection) self._needsRefresh |= ISEL;
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
            self._needsRefresh |= ODATA | HIST | SAT | SPECTRUM;
            self._histogramRefresh = [1, 1, 1, 1];
            self._integralRefresh = [1, 1, 1, 1];
            self._spectrumRefresh = [1, 1, 1, 1];
            if (self.selection) self._needsRefresh |= OSEL;
        }
        return self;
    }
    
    ,dimensions: function( w, h ) {
        var self = this;
        set_dimensions(self, w, h, WIDTH_AND_HEIGHT);
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,scale: function( sx, sy ) {
        var self = this;
        sx = sx||1; sy = sy||sx;
        if ( 1==sx && 1==sy ) return self;
        
        // lazy
        self.tmpCanvas = self.tmpCanvas || tmp_canvas( self );
        var ctx = self.tmpCanvas.getContext('2d'),
            w = self.width, h = self.height;
        
        //ctx.save();
        ctx.scale(sx, sy);
        w = self.width = ~~(sx*w+0.5);
        h = self.height = ~~(sy*h+0.5);
        
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
        
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,flipHorizontal: function( ) {
        var self = this;
        // lazy
        self.tmpCanvas = self.tmpCanvas || tmp_canvas( self );
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
        
        self._needsRefresh |= DATA | SAT | SPECTRUM;
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,flipVertical: function( ) {
        var self = this;
        // lazy
        self.tmpCanvas = self.tmpCanvas || tmp_canvas( self );
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
        
        self._needsRefresh |= DATA | SAT | SPECTRUM;
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    // TODO
    ,draw: function( drawable, x, y, blendMode ) {
        return this;
    }
    
    // clear the image contents
    ,clear: function( ) {
        var self = this, w = self.width, h = self.height;
        if ( w && h )
        {
            if ( self._restorable ) self.ictx.clearRect(0, 0, w, h);
            self.octx.clearRect(0, 0, w, h);
            self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
            self._histogramRefresh = [1, 1, 1, 1];
            self._integralRefresh = [1, 1, 1, 1];
            self._spectrumRefresh = [1, 1, 1, 1];
            if (self.selection) self._needsRefresh |= SEL;
        }
        return self;
    }
    
    // crop image region
    ,crop: function( x1, y1, x2, y2 ) {
        var self = this, sel = self.selection, 
            W = self.width, H = self.height, xs, ys, ws, hs,
            x, y, w, h
        ;
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
        self.tmpCanvas = self.tmpCanvas || tmp_canvas( self );
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
        
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (sel) self._needsRefresh |= SEL;
        return self;
    }
        
    // fill image region with a specific (background) color
    ,fill: function( color, x, y, w, h ) {
        var self = this, sel = self.selection, 
            W = self.width, H = self.height, xs, ys, ws, hs
        ;
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
        
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (sel) self._needsRefresh |= SEL;
        return self;
    }
    
    // get direct data array
    ,getData: function( ) {
        var self = this, Data;
        if ( self._restorable )
        {
        if (self._needsRefresh & IDATA) refresh_data( self, IDATA );
        Data = self.iData;
        }
        else
        {
        if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
        Data = self.oData;
        }
        // clone it
        return new IMGcpy( Data.data );
    }
    
    // get direct data array of selected part
    ,getSelectedData: function( ) {
        var self = this, sel;
        
        if (self.selection)  
        {
            if ( self._restorable )
            {
            if (self._needsRefresh & ISEL) refresh_selected_data( self, ISEL );
            sel = self.iDataSel;
            }
            else
            {
            if (self._needsRefresh & OSEL) refresh_selected_data( self, OSEL );
            sel = self.oDataSel;
            }
        }
        else
        {
            if ( self._restorable )
            {
            if (self._needsRefresh & IDATA) refresh_data( self, IDATA );
            sel = self.iData;
            }
            else
            {
            if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
            sel = self.oData;
            }
        }
        // clone it
        return [new IMGcpy( sel.data ), sel.width, sel.height];
    }
    
    // get processed data array
    ,getProcessedData: function( ) {
        var self = this;
        if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
        // clone it
        return new IMGcpy( self.oData.data );
    }
    
    // get processed data array of selected part
    ,getProcessedSelectedData: function( ) {
        var self = this, sel;
        
        if (self.selection)  
        {
            if (self._needsRefresh & OSEL) refresh_selected_data( self, OSEL );
            sel = self.oDataSel;
        }
        else
        {
            if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
            sel = self.oData;
        }
        // clone it
        return [new IMGcpy( sel.data ), sel.width, sel.height];
    }
    
    // set direct data array
    ,setData: function(a) {
        var self = this;
        if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
        arrayset(self.oData.data, a); // not supported in Opera, IE, Safari
        self.octx.putImageData(self.oData, 0, 0); 
        self._needsRefresh |= HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= OSEL;
        return self;
    }
    
    // set direct data array of selected part
    ,setSelectedData: function(a) {
        var self = this;
        if (self.selection)
        {
            var sel = self.selection, ow = self.width-1, oh = self.height-1,
                xs = Floor(sel[0]*ow), ys = Floor(sel[1]*oh);
            if (self._needsRefresh & OSEL) refresh_selected_data( self, OSEL );
            arrayset(self.oDataSel.data, a); // not supported in Opera, IE, Safari
            self.octx.putImageData(self.oDataSel, xs, ys); 
            self._needsRefresh |= ODATA;
        }
        else
        {
            if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
            arrayset(self.oData.data, a); // not supported in Opera, IE, Safari
            self.octx.putImageData(self.oData, 0, 0); 
        }
        self._needsRefresh |= HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
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
        self._needsRefresh |= DATA;
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,image: function( img ) {
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
            self._needsRefresh |= DATA;
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
            //self._needsRefresh &= CLEAR_DATA;
        }
        //self.webgl = FILTER.useWebGL ? new FILTER.WebGL(self.domElement) : null;
        self._needsRefresh |= HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,getPixel: function( x, y ) {
        var self = this;
        if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
        var off = (~~(y*self.width+x+0.5))<<2, im = self.oData.data;
        return {
            r: im[off], 
            g: im[off+1], 
            b: im[off+2], 
            a: im[off+3]
        };
    }
    
    ,setPixel: function( x, y, r, g, b, a ) {
        var self = this;
        self.octx.putImageData(new IMG([r&255, g&255, b&255, a&255]), x, y); 
        self._needsRefresh |= ODATA | HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= OSEL;
        return self;
    }
    
    // get the imageData object
    ,getPixelData: function( ) {
        if (this._needsRefresh & ODATA) refresh_data( this, ODATA );
        return this.oData;
    }
    
    // set the imageData object
    ,setPixelData: function( data ) {
        var self = this;
        self.octx.putImageData(data, 0, 0); 
        self._needsRefresh |= ODATA | HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= OSEL;
        return self;
    }
    
    ,integral: function( channel ) {
        var self = this, integral = ImageUtil.integral, grayscale = self._grayscale;
        if ( null == channel )
        {
            if ( self._needsRefresh & SAT )
            {
                var data = self.getPixelData().data, w = self.width, h = self.height,
                    i0 = integral(data, w, h, 0);
                self._integral = [
                    i0,
                    grayscale ? i0 : integral(data, w, h, 1),
                    grayscale ? i0 : integral(data, w, h, 2),
                    integral(data, w, h, 3)
                ];
                self._integralRefresh = [0, 0, 0, 0];
                self._needsRefresh &= CLEAR_SAT;
            }
        }
        else
        {
            channel = channel || 0;
            if ( (self._needsRefresh & SAT) || self._integralRefresh[channel] )
            {
                if ( grayscale && !self._integralRefresh[0] )
                    self._integral[channel] = self._integral[0];
                else
                    self._integral[channel] = integral(self.getPixelData().data, self.width, self.height, channel);
                self._integralRefresh[channel] = 0;
                self._needsRefresh &= CLEAR_SAT;
            }
        }
        return null == channel ? self._integral : self._integral[channel||0];
    }
    
    ,histogram: function( channel ) {
        var self = this, hist = ImageUtil.histogram, grayscale = self._grayscale;
        if ( null == channel )
        {
            if ( self._needsRefresh & HIST )
            {
                var data = self.getPixelData().data, w = self.width, h = self.height,
                    h0 = hist(data, w, h, 0);
                self._histogram = [
                    h0,
                    grayscale ? h0 : hist(data, w, h, 1),
                    grayscale ? h0 : hist(data, w, h, 2),
                    null//hist(data, w, h, 3)
                ];
                self._histogramRefresh = [0, 0, 0, 0];
                self._needsRefresh &= CLEAR_HIST;
            }
        }
        else
        {
            channel = channel || 0;
            if ( (self._needsRefresh & HIST) || self._histogramRefresh[channel] )
            {
                if ( grayscale && !self._histogramRefresh[0] )
                    self._histogram[channel] = self._histogram[0];
                else
                    self._histogram[channel] = hist(self.getPixelData().data, self.width, self.height, channel);
                self._histogramRefresh[channel] = 0;
                self._needsRefresh &= CLEAR_HIST;
            }
        }
        return null == channel ? self._histogram : self._histogram[channel||0];
    }
    
    // TODO
    ,spectrum: function( channel ) {
        var self = this, spec = ImageUtil.spectrum;
        /*
        if (self._needsRefresh & SPECTRUM) 
        {
                channel = channel || 0;
            var data = self.getPixelData().data, w = self.width, h = self.height;
            self._spectrum[channel] = spec(data, w, h, channel);
            self._needsRefresh &= CLEAR_SPECTRUM;
        }
        */
        return null == channel ? self._spectrum : self._spectrum[channel||0];
    }
    
    ,toImage: function( format ) {
        var canvas = this.oCanvas, uri, quality = 1.0;
        if ( FORMAT.JPG === (format & 16) )
        {
            uri = canvas.toDataURL( MIME.JPG, quality );
        }
        else if ( FORMAT.GIF === (format & 16) )
        {
            uri = canvas.toDataURL( MIME.GIF, quality );
        }
        else/* if( FORMAT.PNG === (format & 16) )*/
        {
            uri = canvas.toDataURL( MIME.PNG, quality );
        }
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
//
// aliases
FilterImage[PROTO].setImage = FilterImage[PROTO].image;
FilterImage[PROTO].setDimensions = FilterImage[PROTO].dimensions;

// static
FilterImage.Gradient = function Gradient( w, h, colors, stops, angle, interpolate ) {
    var Grad = new FilterImage().restorable(false).createImageData(w, h), c = ImageUtil.colors_stops( colors, stops );
    Grad.setData( ImageUtil.gradient( Grad.getData(), w, h, c[0], c[1], angle, interpolate||ImageUtil.lerp ) );
    return Grad;
};
FilterImage.RadialGradient = function RadialGradient( w, h, colors, stops, centerX, centerY, radiusX, radiusY, interpolate ) {
    var Grad = new FilterImage().restorable(false).createImageData(w, h), c = ImageUtil.colors_stops( colors, stops );
    Grad.setData( ImageUtil.radial_gradient( Grad.getData(), w, h, c[0], c[1], centerX, centerY, radiusX, radiusY, interpolate||ImageUtil.lerp ) );
    return Grad;
};
FilterImage.PerlinNoise = function PerlinNoise( w, h, seed, seamless, grayscale, baseX, baseY, octaves, offsets, scale, roughness, use_perlin ) {
    var perlinNoise = new FilterImage().restorable(false).createImageData(w, h);
    if ( ImageUtil.perlin )
    {
        if ( seed ) ImageUtil.perlin.seed( seed );
        perlinNoise.setData( ImageUtil.perlin(perlinNoise.getData(), w, h, seamless, grayscale, baseX, baseY, octaves, offsets, scale, roughness, use_perlin) );
    }
    return perlinNoise;
};

// resize/scale/interpolate image data
ImageUtil.scale = ImageUtil.resize = FILTER.Interpolation.bilinear;

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
            sw = ~~(sx*w + 0.5);
            sh = ~~(sy*h + 0.5);
            set_dimensions(self, sw, sh, WIDTH_AND_HEIGHT);
            if ( self._restorable ) 
            {
            ictx = self.ictx = self.iCanvas.getContext('2d');
            ictx.drawImage(img, 0, 0, w, h, 0, 0, sw, sh);
            }
            octx = self.octx = self.oCanvas.getContext('2d');
            octx.drawImage(img, 0, 0, w, h, 0, 0, sw, sh);
            self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
            self._histogramRefresh = [1, 1, 1, 1];
            self._integralRefresh = [1, 1, 1, 1];
            self._spectrumRefresh = [1, 1, 1, 1];
            if (self.selection) self._needsRefresh |= SEL;
        }
        //self.webgl = FILTER.useWebGL ? new FILTER.WebGL(self.domElement) : null;
        return self;
    }
});
// aliases
FilterScaledImage[PROTO].setImage = FilterScaledImage[PROTO].image;

}(FILTER);