/**
*
* Image Proxy Class
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var PROTO = 'prototype', devicePixelRatio = FILTER.devicePixelRatio,
    IMG = FILTER.ImArray, IMGcpy = FILTER.ImArrayCopy, A32F = FILTER.Array32F,
    CHANNEL = FILTER.CHANNEL, FORMAT = FILTER.FORMAT, MIME = FILTER.MIME, ID = 0,
    Color = FILTER.Color,
    ImageUtil = FILTER.Util.Image,
    FilterUtil = FILTER.Util.Filter,
    ArrayUtil = FILTER.Util.Array,
    arrayset = ArrayUtil.arrayset,
    subarray = ArrayUtil.subarray,
    stdMath = Math, Min = stdMath.min, Floor = stdMath.floor,

    RED = 1 << CHANNEL.R,
    GREEN = 1 << CHANNEL.G,
    BLUE = 1 << CHANNEL.B,
    ALPHA = 1 << CHANNEL.A,
    ALL_CHANNELS = RED | GREEN | BLUE | ALPHA,
    IDATA = 1, ODATA = 2, ISEL = 4, OSEL = 8,
    WIDTH = 2, HEIGHT = 4, WIDTH_AND_HEIGHT = WIDTH | HEIGHT,
    SEL = ISEL | OSEL, DATA = IDATA | ODATA,
    CLEAR_DATA = ~DATA, CLEAR_SEL = ~SEL
;

// Image (Proxy) Class
var FilterImage = FILTER.Image = FILTER.Class({
    name: "Image"

    ,constructor: function FilterImage(img) {
        var self = this, w = 0, h = 0;
        // factory-constructor pattern
        if (!(self instanceof FilterImage)) return new FilterImage(img);
        self.id = ++ID;
        self.width = w;
        self.height = h;
        self.iCanvas = FILTER.Canvas(w, h);
        self.oCanvas = FILTER.Canvas(w, h);
        self.iData = null;
        self.iDataSel = null;
        self.oData = null;
        self.oDataSel = null;
        self.domElement = self.oCanvas;
        self._restorable = true;
        self.gray = false;
        self.selection = null;
        self._refresh = 0;
        self.nref = 0;
        if (img) self.image(img);
    }

    // properties
    ,id: null
    ,width: 0
    ,height: 0
    ,gray: false
    ,selection: null
    ,iCanvas: null
    ,oCanvas: null
    ,iData: null
    ,iDataSel: null
    ,oData: null
    ,oDataSel: null
    ,domElement: null
    ,_restorable: true
    ,_refresh: 0
    ,nref: 0

    ,dispose: function() {
        var self = this;
        self.id = null;
        self.width = self.height = null;
        self.selection = self.gray = null;
        self.iData = self.iDataSel = self.oData = self.oDataSel = null;
        self.domElement = self.iCanvas = self.oCanvas = null;
        self._restorable = null;
        self._refresh = self.nref = null;
        return self;
    }

    ,clone: function(original) {
        return new FilterImage(true === original ? this.iCanvas : this.oCanvas);
    }

    ,grayscale: function(bool) {
        var self = this;
        if (!arguments.length) return self.gray;
        self.gray = !!bool;
        return self;
    }

    ,restorable: function(enabled) {
        var self = this;
        if (!arguments.length) enabled = true;
        self._restorable = !!enabled;
        return self;
    }

    // apply a filter (uses filter's own apply method)
    ,apply: function(filter, cb) {
        filter.apply(this, this, cb);
        return this;
    }

    // apply2 a filter using another image as destination
    ,apply2: function(filter, destImg, cb) {
        filter.apply(this, destImg, cb);
        return this;
    }

    ,select: function(x1, y1, x2, y2, absolute) {
        var self = this, argslen = arguments.length;
        if (false === x1)
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
            if (argslen < 1) x1 = 0;
            if (argslen < 2) y1 = 0;
            if (argslen < 3) x2 = 1;
            if (argslen < 4) y2 = 1;
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
        ++self.nref;
        return self;
    }

    ,deselect: function() {
        return this.select(false);
    }

    // store the processed/filtered image as the original image
    // make the processed image the original image
    ,store: function() {
        var self = this;
        if (self._restorable)
        {
            self.iCanvas.getContext('2d').drawImage(self.oCanvas, 0, 0);
            self._refresh |= IDATA;
            if (self.selection) self._refresh |= ISEL;
            ++self.nref;
        }
        return self;
    }

    // restore the original image
    // remove any filters applied to original image
    ,restore: function() {
        var self = this;
        if (self._restorable)
        {
            self.oCanvas.getContext('2d').drawImage(self.iCanvas, 0, 0);
            self._refresh |= ODATA;
            if (self.selection) self._refresh |= OSEL;
            ++self.nref;
        }
        return self;
    }

    ,dimensions: function(w, h, refresh) {
        var self = this;
        self._refresh |= DATA;
        if (self.selection) self._refresh |= SEL;
        ++self.nref;
        set_dimensions(self, w, h, WIDTH_AND_HEIGHT);
        return self;
    }
    ,setDimensions: null

    ,scale: function(sx, sy) {
        var self = this, w = self.oCanvas.width, h = self.oCanvas.height;
        sx = sx || 1; sy = sy || sx;
        if ((1 === sx) && (1 === sy)) return self;

        // lazy
        var tmpCanvas = FILTER.Canvas(w, h),
            ctx = tmpCanvas.getContext('2d');

        ctx.scale(sx, sy);
        w = self.width = stdMath.round(sx*self.width);
        h = self.height = stdMath.round(sy*self.height);

        ctx.drawImage(self.oCanvas, 0, 0);
        self.oCanvas.width = w * devicePixelRatio;
        self.oCanvas.height = h * devicePixelRatio;
        if (self.oCanvas.style)
        {
            self.oCanvas.style.width = String(w) + 'px';
            self.oCanvas.style.height = String(h) + 'px';
        }
        self.oCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);

        if (self._restorable)
        {
            ctx.drawImage(self.iCanvas, 0, 0);
            self.iCanvas.width = self.oCanvas.width;
            self.iCanvas.height = self.oCanvas.height;
            if (self.iCanvas.style)
            {
                self.iCanvas.style.width = self.oCanvas.style.width;
                self.iCanvas.style.height = self.oCanvas.style.height;
            }
            self.iCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);
        }

        self._refresh |= DATA;
        if (self.selection) self._refresh |= SEL;
        ++self.nref;
        return self;
    }

    ,flipHorizontal: function() {
        var self = this, w = self.oCanvas.width, h = self.oCanvas.height;
        // lazy
        var tmpCanvas = FILTER.Canvas(w, h),
            ctx = tmpCanvas.getContext('2d');

        ctx.translate(w, 0);
        ctx.scale(-1, 1);

        ctx.drawImage(self.oCanvas, 0, 0);
        self.oCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);

        if (self._restorable)
        {
            ctx.drawImage(self.iCanvas, 0, 0);
            self.iCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);
        }

        self._refresh |= DATA;
        if (self.selection) self._refresh |= SEL;
        ++self.nref;
        return self;
    }

    ,flipVertical: function() {
        var self = this, w = self.oCanvas.width, h = self.oCanvas.height;
        // lazy
        var tmpCanvas = FILTER.Canvas(w, h),
            ctx = tmpCanvas.getContext('2d');

        ctx.translate(0, h);
        ctx.scale(1, -1);

        ctx.drawImage(self.oCanvas, 0, 0);
        self.oCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);

        if (self._restorable)
        {
            ctx.drawImage(self.iCanvas, 0, 0);
            self.iCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);
        }

        self._refresh |= DATA;
        if (self.selection) self._refresh |= SEL;
        ++self.nref;
        return self;
    }

    // clear the image contents
    ,clear: function() {
        var self = this, w = self.oCanvas.width, h = self.oCanvas.height;
        if (w && h)
        {
            if (self._restorable) self.iCanvas.getContext('2d').clearRect(0, 0, w, h);
            self.oCanvas.getContext('2d').clearRect(0, 0, w, h);
            self._refresh |= DATA;
            if (self.selection) self._refresh |= SEL;
            ++self.nref;
        }
        return self;
    }

    // crop image region
    ,crop: function(x1, y1, x2, y2) {
        var self = this, sel = self.selection,
            W = self.oCanvas.width, H = self.oCanvas.height,
            xf, yf, x, y, w, h;
        if (!arguments.length)
        {
            if (sel)
            {
                if (sel[4])
                {
                    xf = W - 1;
                    yf = H - 1;
                }
                else
                {
                    xf = 1;
                    yf = 1;
                }
                x = Floor(sel[0]*xf);
                y = Floor(sel[1]*yf);
                w = Floor(sel[2]*xf)-x+1;
                h = Floor(sel[3]*yf)-y+1;
                sel[0] = 0; sel[1] = 0;
                sel[2] = 1; sel[3] = 1;
                sel[4] = 1;
            }
            else
            {
                return self;
            }
        }
        else
        {
            x = x1;
            y = y1;
            w = x2-x1+1;
            h = y2-y1+1;
        }

        // lazy
        var tmpCanvas = FILTER.Canvas(w, h),
            ctx = tmpCanvas.getContext('2d');

        ctx.drawImage(self.oCanvas, x, y, w, h, 0, 0, w, h);
        self.oCanvas.width = w * devicePixelRatio;
        self.oCanvas.height = h * devicePixelRatio;
        if (self.oCanvas.style)
        {
            self.oCanvas.style.width = String(w) + 'px';
            self.oCanvas.style.height = String(h) + 'px';
        }
        self.oCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);
        if (self._restorable)
        {
            ctx.drawImage(self.iCanvas, x, y, w, h, 0, 0, w, h);
            self.iCanvas.width = self.oCanvas.width;
            self.iCanvas.height = self.oCanvas.height;
            if (self.iCanvas.style)
            {
                self.iCanvas.style.width = self.oCanvas.style.width;
                self.iCanvas.style.height = self.oCanvas.style.height;
            }
            self.iCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);
        }
        self.width = w;
        self.height = h;

        self._refresh |= DATA;
        if (sel) self._refresh |= SEL;
        ++self.nref;
        return self;
    }

    // fill image region with a specific (background) color
    ,fill: function(color, x, y, w, h) {
        var self = this, sel = self.selection,
            W = self.oCanvas.width,
            H = self.oCanvas.height,
            xf, yf, xs, ys, ws, hs;

        if ((w && !W) || (h && !H))
        {
            set_dimensions(self, x+w, y+h, WIDTH_AND_HEIGHT);
            W = self.oCanvas.width;
            H = self.oCanvas.height;
        }

        if (sel)
        {
            if (sel[4])
            {
                xf = W - 1;
                yf = H - 1;
            }
            else
            {
                xf = 1;
                yf = 1;
            }
            xs = Floor(sel[0]*xf);
            ys = Floor(sel[1]*yf);
            ws = Floor(sel[2]*xf)-xs+1;
            hs = Floor(sel[3]*yf)-ys+1;
        }
        else
        {
            xs = 0; ys = 0;
            ws = W; hs = H;
        }
        if (null == x) x = xs;
        if (null == y) y = ys;
        if (null == w) w = ws;
        if (null == h) h = hs;

        var octx = self.oCanvas.getContext('2d'),
            ictx = self.iCanvas.getContext('2d');

        color = color || 0;
        if (self._restorable)
        {
            ictx.fillStyle = color;
            ictx.fillRect(x, y, w, h);
        }
        octx.fillStyle = color;
        octx.fillRect(x, y, w, h);

        self._refresh |= DATA;
        if (sel) self._refresh |= SEL;
        ++self.nref;
        return self;
    }

    ,draw: function(img, x, y/*, blendMode*/) {
        if (!img) return this;
        var self = this, isVideo, isCanvas, isImage;

        if (img instanceof FilterImage) img = img.oCanvas;
        isVideo = ("undefined" !== typeof HTMLVideoElement) && (img instanceof HTMLVideoElement);
        isCanvas = (img instanceof self.oCanvas.constructor);
        isImage = (img instanceof FILTER.Canvas.Image().constructor);
        if (!isImage && !isCanvas && !isVideo) return self;

        if (self._restorable) self.iCanvas.getContext('2d').drawImage(img, x|0, y|0);
        self.oCanvas.getContext('2d').drawImage(img, x|0, y|0);
        self._refresh |= DATA;
        if (self.selection) self._refresh |= SEL;
        ++self.nref;
        return self;
    }
    ,paste: null

    // get direct data array
    ,getData: function(processed) {
        var self = this, data;
        if (self._restorable && !processed)
        {
            if (self._refresh & IDATA) refresh_data(self, IDATA);
            data = self.iData;
        }
        else
        {
            if (self._refresh & ODATA) refresh_data(self, ODATA);
            data = self.oData;
        }
        // clone it
        return new IMGcpy(data.data);
    }

    // get direct data array of selected part
    ,getSelectedData: function(processed) {
        var self = this, sel;

        if (self.selection)
        {
            if (self._restorable && !processed)
            {
                if (self._refresh & ISEL) refresh_selected_data(self, ISEL);
                sel = self.iDataSel;
            }
            else
            {
                if (self._refresh & OSEL) refresh_selected_data(self, OSEL);
                sel = self.oDataSel;
            }
        }
        else
        {
            if (self._restorable && !processed)
            {
                if (self._refresh & IDATA) refresh_data(self, IDATA);
                sel = self.iData;
            }
            else
            {
                if (self._refresh & ODATA) refresh_data(self, ODATA);
                sel = self.oData;
            }
        }
        // clone it
        return [new IMGcpy(sel.data), sel.width, sel.height, 2];
    }

    // set direct data array
    ,setData: function(a) {
        var self = this;
        self.oCanvas.getContext('2d').putImageData(FILTER.Canvas.ImageData(a, self.oCanvas.width, self.oCanvas.height), 0, 0);
        self._refresh |= ODATA;
        if (self.selection) self._refresh |= OSEL;
        ++self.nref;
        return self;
    }

    // set direct data array of selected part
    ,setSelectedData: function(a) {
        var self = this, sel = self.selection,
            w = self.oCanvas.width, h = self.oCanvas.height;
        if (sel)
        {
            var xs, ys, ws, hs, xf, yf;
            if (sel[4])
            {
                xf = W - 1;
                yf = H - 1;
            }
            else
            {
                xf = 1;
                yf = 1;
            }
            xs = Floor(sel[0]*xf);
            ys = Floor(sel[1]*yf);
            ws = Floor(sel[2]*xf)-xs+1;
            hs = Floor(sel[3]*yf)-ys+1;
            self.oCanvas.getContext('2d').putImageData(FILTER.Canvas.ImageData(a, ws, hs), xs, ys);
        }
        else
        {
            self.oCanvas.getContext('2d').putImageData(FILTER.Canvas.ImageData(a, w, h), 0, 0);
        }
        self._refresh |= ODATA;
        if (self.selection) self._refresh |= OSEL;
        ++self.nref;
        return self;
    }

    ,image: function(img) {
        if (!img) return this;

        var self = this, w, h,
            isVideo, isCanvas, isImage//, isImageData
        ;

        if (img instanceof FilterImage) img = img.oCanvas;
        isVideo = ("undefined" !== typeof HTMLVideoElement) && (img instanceof HTMLVideoElement);
        isCanvas = (img instanceof self.oCanvas.constructor);
        isImage = (img instanceof FILTER.Canvas.Image().constructor);
        //isImageData = (null != img.data && null != img.width && null != img.height);

        if (isVideo)
        {
            w = img.videoWidth;
            h = img.videoHeight;
        }
        else
        {
            w = img.width;
            h = img.height;
        }

        set_dimensions(self, w, h, WIDTH_AND_HEIGHT);
        if (isImage || isCanvas || isVideo)
        {
            if (self._restorable) self.iCanvas.getContext('2d').drawImage(img, 0, 0, self.iCanvas.width, self.iCanvas.height);
            self.oCanvas.getContext('2d').drawImage(img, 0, 0, self.oCanvas.width, self.oCanvas.height);
        }
        else
        {
            if (self._restorable) self.iCanvas.getContext('2d').putImageData(img, 0, 0);
            self.oCanvas.getContext('2d').putImageData(img, 0, 0);
        }
        self._refresh |= DATA;
        if (self.selection) self._refresh |= SEL;
        ++self.nref;
        return self;
    }
    ,setImage: null

    ,getPixel: function(x, y) {
        var self = this, w = self.oCanvas.width, h = self.oCanvas.height, offset;
        if (0 > x || x >= w || 0 > y || y >= h) return null;
        if (self._refresh & ODATA) refresh_data(self, ODATA);
        offset = ((y*w+x)|0) << 2;
        return subarray(self.oData.data, offset, offset+4);
    }

    ,setPixel: function(x, y, rgba) {
        var self = this, w = self.oCanvas.width, h = self.oCanvas.height;
        if (0 > x || x >= w || 0 > y || y >= h) return self;
        self.oCanvas.getContext('2d').putImageData(FILTER.Canvas.ImageData(rgba, 1, 1), x, y);
        self._refresh |= ODATA;
        if (self.selection) self._refresh |= OSEL;
        ++self.nref;
        return self;
    }

    // get the imageData object
    ,getPixelData: function() {
        if (this._refresh & ODATA) refresh_data(this, ODATA);
        return this.oData;
    }

    // set the imageData object
    ,setPixelData: function(data) {
        var self = this;
        self.oCanvas.getContext('2d').putImageData(data, 0, 0);
        self._refresh |= ODATA;
        if (self.selection) self._refresh |= OSEL;
        ++self.nref;
        return self;
    }

    ,toImage: function(cb, type) {
        // only PNG image, toDataURL may return a promise
        var uri = this.oCanvas.toDataURL('image/png'),
            ret = function(uri) {
                    if ('uri' !== type)
                    {
                        var img = FILTER.Canvas.Image();
                        img.src = uri;
                        cb(img);
                    }
                    else
                    {
                        cb(uri);
                    }
            };
        if (('function' === typeof uri.then) && ('function' === typeof uri.catch))
        {
            // promise
            uri.then(ret).catch(function() {});
        }
        else
        {
            ret(uri);
        }
    }

    ,toString: function( ) {
        return "[" + "FILTER Image: " + this.name + "]";
    }
});
// aliases
FilterImage[PROTO].setImage = FilterImage[PROTO].image;
FilterImage[PROTO].setDimensions = FilterImage[PROTO].dimensions;
FilterImage[PROTO].paste = FilterImage[PROTO].draw;

// auxilliary (private) methods
function set_dimensions(scope, w, h, what)
{
    what = what || WIDTH_AND_HEIGHT;
    if (what & WIDTH)
    {
        scope.width = w;
        if (scope.oCanvas.style) scope.oCanvas.style.width = String(w) + 'px';
        scope.oCanvas.width = w * devicePixelRatio;
        if (scope._restorable)
        {
            if (scope.iCanvas.style) scope.iCanvas.style.width = scope.oCanvas.style.width;
            scope.iCanvas.width = scope.oCanvas.width;
        }
    }
    if (what & HEIGHT)
    {
        scope.height = h;
        if (scope.oCanvas.style) scope.oCanvas.style.height = String(h) + 'px';
        scope.oCanvas.height = h * devicePixelRatio;
        if (scope._restorable)
        {
            if (scope.iCanvas.style) scope.iCanvas.style.height = scope.oCanvas.style.height;
            scope.iCanvas.height = scope.oCanvas.height;
        }
    }
    return scope;
}
function refresh_data(scope, what)
{
    var w = scope.oCanvas.width, h = scope.oCanvas.height;
    what = what || 255;
    if (scope._restorable && (what & IDATA) && (scope._refresh & IDATA))
    {
        scope.iData = scope.iCanvas.getContext('2d').getImageData(0, 0, w, h);
        scope._refresh &= ~IDATA;
    }
    if ((what & ODATA) && (scope._refresh & ODATA))
    {
        scope.oData = scope.oCanvas.getContext('2d').getImageData(0, 0, w, h);
        scope._refresh &= ~ODATA;
    }
    return scope;
}
function refresh_selected_data(scope, what)
{
    if (scope.selection)
    {
        var sel = scope.selection, ow = scope.oCanvas.width-1, oh = scope.oCanvas.height-1,
            xs = sel[0], ys = sel[1], xf = sel[2], yf = sel[3],
            fx = sel[4] ? ow : 1, fy = sel[4] ? oh : 1, ws, hs;
        xs = Floor(xs*fx); ys = Floor(ys*fy);
        xf = Floor(xf*fx); yf = Floor(yf*fy);
        ws = xf-xs+1; hs = yf-ys+1;
        what = what || 255;
        if (scope._restorable && (what & ISEL) && (scope._refresh & ISEL))
        {
            scope.iDataSel = scope.iCanvas.getContext('2d').getImageData(xs, ys, ws, hs);
            scope._refresh &= ~ISEL;
        }
        if ((what & OSEL) && (scope._refresh & OSEL))
        {
            scope.oDataSel = scope.oCanvas.getContext('2d').getImageData(xs, ys, ws, hs);
            scope._refresh &= ~OSEL;
        }
    }
    return scope;
}

}(FILTER);