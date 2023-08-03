/**
*
* Dimension Filter
*
* Changes the dimensions of the image by either (re-)scaling, cropping or padding
*
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var ImArrayCopy = FILTER.ImArrayCopy, stdMath = Math;

// Dimension Filter, change image dimension
// does not work in worker because it uses canvas
FILTER.Create({
    name: "DimensionFilter"

    ,init: function DimensionFilter(mode, a, b, c, d) {
        var self = this;
        self.set(mode, a, b, c, d);
    }

    ,path: FILTER.Path
    // parameters
    ,mode: null
    ,a: 0
    ,b: 0
    ,c: 0
    ,d: 0
    ,cnv: null
    ,cnv2: null
    ,meta: null
    ,hasMeta: false

    ,dispose: function() {
        var self = this;
        self.cnv = null;
        self.cnv2 = null;
        self.mode = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
            mode: self.mode,
            a: self.a,
            b: self.b,
            c: self.c,
            d: self.d
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.set(null/*params.mode, params.a, params.b, params.c, params.d*/);
        return self;
    }

    ,metaData: function(serialisation) {
        return this.meta;
    }

    ,setMetaData: function(meta, serialisation) {
        return this;
    }

    ,set: function(mode, a, b, c, d) {
        var self = this;
        if (mode)
        {
            self.mode = String(mode || 'scale').toLowerCase();
            self.a = a || 0;
            self.b = b || 0;
            self.c = c || 0;
            self.d = d || 0;
        }
        else
        {
            self.mode = null;
        }
        return self;
    }

    ,reset: function() {
        var self = this;
        self.mode = null;
        return self;
    }

    ,_apply: function(im, w, h, metaData) {
        var self = this, mode = self.mode,
            canvas, canvas2, ctx, ctx2, out,
            Canvas = FILTER.Canvas, ImageData = FILTER.Canvas.ImageData
            a = self.a, b = self.b, c = self.c, d = self.d;
        self.meta = null;
        self.hasMeta = false;
        if (!mode) return im;
        if (!self.cnv) self.cnv = Canvas();
        canvas = self.cnv;
        switch (mode)
        {
            case 'pad':
                canvas.width = a + c + w;
                canvas.height = b + d + h;
                ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.putImageData(ImageData(im, w, h), a, b);
                out = ctx.getImageData();
                im = new ImArrayCopy(out.data);
                self.meta = {_IMG_WIDTH:out.width, _IMG_HEIGHT:out.height};
                self.hasMeta = true;
            break;
            case 'crop':
                canvas.width = w;
                canvas.height = h;
                ctx = canvas.getContext('2d');
                ctx.putImageData(ImageData(im, w, h), 0, 0);
                out = ctx.getImageData(a, b, c, d);
                im = new ImArrayCopy(out.data);
                self.meta = {_IMG_WIDTH:out.width, _IMG_HEIGHT:out.height};
                self.hasMeta = true;
            break;
            case 'scale':
            default:
                if (!self.cnv2) self.cnv2 = Canvas();
                canvas2 = self.cnv2;
                canvas2.width = w;
                canvas2.height = h;
                ctx2 = canvas2.getContext('2d');
                ctx2.putImageData(ImageData(im, w, h), 0, 0);
                canvas.width = stdMath.round(a*w);
                canvas.height = stdMath.round(b*h);
                ctx = canvas2.getContext('2d');
                ctx.drawImage(canvas2, 0, 0, canvas2.width, canvas2.height, 0, 0, canvas.width, canvas.height);
                out = ctx.getImageData(0, 0, canvas.width, canvas.height);
                self.meta = {_IMG_WIDTH:out.width, _IMG_HEIGHT:out.height};
                self.hasMeta = true;
            break;
        }
        return im;
    }
});

}(FILTER);