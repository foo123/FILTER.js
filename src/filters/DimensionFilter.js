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

var stdMath = Math,
    crop = FILTER.Util.Image.crop,
    pad = FILTER.Util.Image.pad,
    resize = FILTER.Util.Image.interpolate
;

// Dimension Filter, change image dimension
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
    ,meta: null
    ,hasMeta: false

    ,dispose: function() {
        var self = this;
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
        self.set(params.mode, params.a, params.b, params.c, params.d);
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
            self.a = 0;
            self.b = 0;
            self.c = 0;
            self.d = 0;
        }
        return self;
    }

    ,reset: function() {
        return this.set(null);
    }

    ,_apply: function(im, w, h, metaData) {
        var self = this, mode = self.mode,
            a = self.a, b = self.b, c = self.c, d = self.d;
        self.meta = null;
        self.hasMeta = false;
        if (!mode) return im;
        switch (mode)
        {
            case 'set':
                if (c && d)
                {
                    // scale given
                    a = stdMath.round(c*w);
                    b = stdMath.round(d*h);
                }
                else
                {
                    // dimensions given
                    a = stdMath.round(a);
                    b = stdMath.round(b);
                }
                im = new FILTER.ImArray((a*b) << 2);
                self.meta = {_IMG_WIDTH:a, _IMG_HEIGHT:b};
                self.hasMeta = true;
            break;
            case 'pad':
                a = stdMath.round(a);
                b = stdMath.round(b);
                c = stdMath.round(c);
                d = stdMath.round(d);
                im = pad(im, w, h, c, d, a, b);
                self.meta = {_IMG_WIDTH:b + d + h, _IMG_HEIGHT:a + c + w};
                self.hasMeta = true;
            break;
            case 'crop':
                a = stdMath.round(a);
                b = stdMath.round(b);
                c = stdMath.round(c);
                d = stdMath.round(d);
                im = crop(im, w, h, a, b, a+c-1, b+d-1);
                self.meta = {_IMG_WIDTH:c, _IMG_HEIGHT:d};
                self.hasMeta = true;
            break;
            case 'scale':
            default:
                if (c && d)
                {
                    // scale given
                    a = stdMath.round(c*w);
                    b = stdMath.round(d*h);
                }
                else
                {
                    // dimensions given
                    a = stdMath.round(a);
                    b = stdMath.round(b);
                }
                im = resize(im, w, h, a, b);
                self.meta = {_IMG_WIDTH:a, _IMG_HEIGHT:b};
                self.hasMeta = true;
            break;
        }
        return im;
    }
});

}(FILTER);