/**
*
* FloodFill, PatternFill
* @package FILTER.js
*
**/
!function(FILTER) {
"use strict";

var MODE = FILTER.MODE, stdMath = Math;

// an extended and fast flood fill and flood pattern fill filter using scanline algorithm
// adapted from: A Seed Fill Algorithm, by Paul Heckbert from "Graphics Gems", Academic Press, 1990
// http://en.wikipedia.org/wiki/Flood_fill
FILTER.Create({
    name : "ColorFillFilter"
    ,x: 0
    ,y: 0
    ,color: null
    ,border: null
    ,tolerance: 1e-6
    ,mode: MODE.COLOR

    ,path: FILTER.Path

    ,init: function(x, y, color, tolerance, border) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.color = color || 0;
        self.tolerance = null == tolerance ? 1e-6 : +tolerance;
        self.border = null != border ? border||0 : null;
        self.mode = MODE.COLOR;
    }

    ,serialize: function() {
        var self = this;
        return {
             color: self.color
            ,border: self.border
            ,x: self.x
            ,y: self.y
            ,tolerance: self.tolerance
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.color = params.color;
        self.border = params.border;
        self.x = params.x;
        self.y = params.y;
        self.tolerance = params.tolerance;
        return self;
    }

    ,apply: function(im, w, h) {
        var self = this, mode = self.mode || MODE.COLOR,
            color = self.color||0, border = self.border, exterior = null != border,
            x0 = self.x||0, y0 = self.y||0, x, y, x1, y1, x2, y2, k, i, l,
            r, g, b, r0, g0, b0, rb, gb, bb, col, dist, D0, D1, region, box, mask, block_mask,
            RGB2HSV = FILTER.Color.RGB2HSV, HSV2RGB = FILTER.Color.HSV2RGB;

        if (x0 < 0 || x0 >= w || y0 < 0 || y0 >= h) return im;

        x0 = x0<<2; y0 = (y0*w)<<2; i = x0+y0;
        r0 = im[i]; g0 = im[i+1]; b0 = im[i+2]; D0 = 0; D1 = 1;
        r = (color>>>16)&255; g = (color>>>8)&255; b = color&255;
        if (exterior)
        {
           rb = (border>>>16)&255; gb = (border>>>8)&255; bb = (border)&255;
           if (r0 === rb && g0 === gb && b0 === bb) return im;
           r0 = rb; g0 = gb; b0 = bb; D0 = 1; D1 = 0;
        }
        else if (MODE.COLOR === mode && r0 === r && g0 === g && b0 === b)
        {
            return im;
        }

        /* seems to have issues when tolerance is exactly 1.0 */
        dist = dissimilarity_rgb(r0, g0, b0, D0, D1, 255*(self.tolerance>=1.0 ? 0.999 : self.tolerance));
        region = flood_region(im, w, h, 2, dist, 8, x0, y0);
        // mask is a packed bit array for efficiency
        mask = region.mask;

        if ((MODE.MASK === mode) || (MODE.COLORMASK === mode))
        {
            // MODE.MASK returns the region mask, rest image is put blank
            block_mask = MODE.MASK === mode;
            x=0; y=0;
            for (i=0,l=im.length; i<l; i+=4,++x)
            {
                if (x>=w) {x=0; y+=w;}
                k = x+y;
                if (mask[k>>>5]&(1<<(k&31)))
                {
                    // use mask color
                    if (block_mask) {im[i  ] = r; im[i+1] = g; im[i+2] = b;}
                    // else leave original color
                }
                else
                {
                    im[i  ] = 0; im[i+1] = 0; im[i+2] = 0;
                }
            }
        }
        else if (MODE.HUE === mode)
        {
            // MODE.HUE enables to fill/replace color gradients in a connected region
            box = region.box;
            x1 = box[0]>>>2; y1 = box[1]>>>2; x2 = box[2]>>2; y2 = box[3]>>>2;
            col = new A32F(3);

            for (x=x1,y=y1; y<=y2;)
            {
                k = x+y;
                if (mask[k>>>5]&(1<<(k&31)))
                {
                    i = k << 2;
                    col[0] = im[i  ];
                    col[1] = im[i+1];
                    col[2] = im[i+2];
                    RGB2HSV(col, 0, 1);
                    col[0] = color;
                    HSV2RGB(col, 0, 1);
                    im[i  ] = col[0]|0; im[i+1] = col[1]|0; im[i+2] = col[2]|0;
                }
                if (++x > x2) {x=x1; y+=w;}
            }
        }
        else //if (MODE.COLOR === mode)
        {
            // fill/replace color in region
            box = region.box;
            x1 = box[0]>>>2; y1 = box[1]>>>2; x2 = box[2]>>2; y2 = box[3]>>>2;
            for (x=x1,y=y1; y<=y2;)
            {
                k = x+y;
                if (mask[k>>>5]&(1<<(k&31)))
                {
                    i = k << 2;
                    im[i  ] = r;
                    im[i+1] = g;
                    im[i+2] = b;
                }
                if (++x > x2) {x=x1; y+=w;}
            }
        }
        // return the new image data
        return im;
    }
});
FILTER.FloodFillFilter = FILTER.ColorFillFilter;

FILTER.Create({
    name : "PatternFillFilter"
    ,x: 0
    ,y: 0
    ,offsetX: 0
    ,offsetY: 0
    ,tolerance: 1e-6
    ,border: null
    ,mode: MODE.TILE
    ,hasInputs: true

    ,path: FILTER.Path

    ,init: function(x, y, pattern, offsetX, offsetY, tolerance, border) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        if (pattern) self.setInput("pattern", pattern);
        self.tolerance = null == tolerance ? 1e-6 : +tolerance;
        self.border = null != border ? border||0 : null;
        self.mode = MODE.TILE;
    }

    ,dispose: function() {
        var self = this;
        self.x = null;
        self.y = null;
        self.offsetX = null;
        self.offsetY = null;
        self.tolerance = null;
        self.border = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             x: self.x
            ,y: self.y
            ,offsetX: self.offsetX
            ,offsetY: self.offsetY
            ,tolerance: self.tolerance
            ,border: self.border
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.x = params.x;
        self.y = params.y;
        self.offsetX = params.offsetX;
        self.offsetY = params.offsetY;
        self.tolerance = params.tolerance;
        self.border = params.border;
        return self;
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this, x0 = self.x||0, y0 = self.y||0, Pat;

        if (x0 < 0 || x0 >= w || y0 < 0 || y0 >= h) return im;
        Pat = self.input("pattern"); if (!Pat) return im;

        var mode = self.mode||MODE.TILE, border = self.border, exterior = null != border, delta,
            pattern = Pat[0], pw = Pat[1], ph = Pat[2], px0 = self.offsetX||0, py0 = self.offsetY||0,
            r0, g0, b0, rb, gb, bb, x, y, k, i, pi, px, py, x1, y1, x2, y2, sx, sy,
            dist, D0, D1, region, box, mask, yy;

        x0 = x0<<2; y0 = (y0*w)<<2; i = x0+y0;
        r0 = im[i]; g0 = im[i+1]; b0 = im[i+2]; D0 = 0; D1 = 1;
        if (exterior)
        {
           rb = (border>>>16)&255; gb = (border>>>8)&255; bb = (border)&255;
           if (r0 === rb && g0 === gb && b0 === bb) return im;
           r0 = rb; g0 = gb; b0 = bb; D0 = 1; D1 = 0;
        }

        /* seems to have issues when tolerance is exactly 1.0 */
        dist = dissimilarity_rgb(r0, g0, b0, D0, D1, 255*(self.tolerance>=1.0 ? 0.999 : self.tolerance));
        region = flood_region(im, w, h, 2, dist, 8, x0, y0);
        // mask is a packed bit array for efficiency
        mask = region.mask; box = region.box;
        x1 = box[0]>>>2; y1 = box[1]>>>2; x2 = box[2]>>>2; y2 = box[3]>>>2;

        if (MODE.STRETCH === mode)
        {
            // MODE.STRETCH stretches (rescales) pattern to fit and fill region
            sx = pw/(x2-x1+1); sy = ph/(y2-y1+w);
            for (x=x1,y=y1; y<=y2;)
            {
                k = x+y;
                if (mask[k>>>5]&(1<<(k&31)))
                {
                    i = k << 2;
                    // stretch here
                    px = (sx*(x-x1))|0;
                    py = (sy*(y-y1))|0;
                    // pattern fill here
                    pi = (px + py*pw) << 2;
                    im[i  ] = pattern[pi  ];
                    im[i+1] = pattern[pi+1];
                    im[i+2] = pattern[pi+2];
                }
                if (++x > x2) {x=x1; y+=w;}
            }
        }
        else //if (MODE.TILE === mode)
        {
            // MODE.TILE tiles (repeats) pattern to fit and fill region
            while (0 > px0) px0 += pw;
            while (0 > py0) py0 += ph;
            x2 = x2-x1+1;
            for (x=0,y=0,yy=y1; yy<=y2;)
            {
                k = x+x1 + yy;
                if (mask[k>>>5]&(1<<(k&31)))
                {
                    i = k << 2;
                    // tile here
                    px = (x + px0) % pw;
                    py = (y + py0) % ph;
                    // pattern fill here
                    pi = (px + py*pw) << 2;
                    im[i  ] = pattern[pi  ];
                    im[i+1] = pattern[pi+1];
                    im[i+2] = pattern[pi+2];
                }
                if (++x >= x2) {x=0; yy+=w; ++y;}
            }
        }
        // return the new image data
        return im;
    }
});

var A32I = FILTER.Array32I, A32U = FILTER.Array32U, A32F = FILTER.Array32F, A8U = FILTER.Array8U,
    ceil = stdMath.ceil, min = stdMath.min, max = stdMath.max, abs = stdMath.abs;

function dissimilarity_rgb(r, g, b, O, I, delta)
{
    //"use asm";
    O = O|0; I = I|0; delta = delta|0;
    // a fast rgb (dis-)similarity matrix
    var D = new A8U(256), c = 0;
    // full loop unrolling
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    return D;
}
// adapted from: A Seed Fill Algorithm, by Paul Heckbert from "Graphics Gems", Academic Press, 1990
// http://www.codeproject.com/Articles/6017/QuickFill-An-efficient-flood-fill-algorithm
// http://www.codeproject.com/Articles/16405/Queue-Linear-Flood-Fill-A-Fast-Flood-Fill-Algorith
function flood_region(im, w, h, stride, D, K, x0, y0)
{
    stride = stride|0;
    var imLen = im.length, imSize = imLen>>>stride, xm, ym, xM, yM,
        y, yy, dx = 1<<stride, dy = w<<stride,
        ymin = 0, ymax = imLen-dy, xmin = 0, xmax = (w-1)<<stride,
        l, i, k, x, x1, x2, yw, stack, slen, notdone, labeled, diff;

    xm = x0; ym = y0; xM = x0; yM = y0;
    // mask is a packed bit array for efficiency
    labeled = new A32U(ceil(imSize/32));
    stack = new A32I(imSize<<2); slen = 0; // pre-allocate and soft push/pop for speed

    k = (x0+y0)>>>stride; labeled[k>>>5] |= 1<<(k&31);
    if (y0+dy >= ymin && y0+dy <= ymax)
    {
        /* needed in some cases */
        stack[slen  ]=y0;
        stack[slen+1]=x0;
        stack[slen+2]=x0;
        stack[slen+3]=dy;
        slen += 4;
    }
    /*if ( y0 >= ymin && y0 <= ymax)*/
    /* seed segment (popped 1st) */
    stack[slen  ]=y0+dy;
    stack[slen+1]=x0;
    stack[slen+2]=x0;
    stack[slen+3]=-dy;
    slen += 4;

    if (stride)
    {
        while (0 < slen)
        {
            /* pop segment off stack and fill a neighboring scan line */
            slen -= 4;
            dy = stack[slen+3];
            yw = stack[slen  ]+dy;
            x1 = stack[slen+1];
            x2 = stack[slen+2];
            ym = min(ym, yw); yM = max(yM, yw);
            xm = min(xm, x1); xM = max(xM, x2);

            /*
             * segment of scan line y-dy for x1<=x<=x2 was previously filled,
             * now explore adjacent pixels in scan line y
             */
            for (x=x1; x>=xmin; x-=dx)
            {
                i = x+yw; k = i>>>stride;
                diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                if (!diff && !(labeled[k>>>5]&(1<<(k&31))))
                {
                    labeled[k>>>5] |= 1<<(k&31);
                    xm = min(xm, x);
                }
                else break;
            }

            if (x >= x1)
            {
                // goto skip:
                i = x+yw; k = i>>>stride;
                diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                while (x <= x2 && (diff || (labeled[k>>>5]&(1<<(k&31)))))
                {
                    x+=dx;
                    i = x+yw; k = i>>>stride;
                    diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                }
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+dx;
                if (l < x1)
                {
                    if (yw >= ymin+dy && yw <= ymax+dy)
                    {
                        //stack[slen++]=[yw, l, x1-4, -dy];  /* leak on left? */
                        stack[slen  ]=yw;
                        stack[slen+1]=l;
                        stack[slen+2]=x1-dx;
                        stack[slen+3]=-dy;
                        slen += 4;
                    }
                }
                x = x1+dx;
                notdone = true;
            }

            while (notdone)
            {
                i = x+yw; k = i>>>stride;
                diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                while (x<=xmax && !diff && !(labeled[k>>>5]&(1<<(k&31))))
                {
                    labeled[k>>>5] |= 1<<(k&31);
                    xM = max(xM, x);
                    x+=dx; i = x+yw; k = i>>>stride;
                    diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                }
                if (yw+dy >= ymin && yw+dy <= ymax)
                {
                    //stack[slen++]=[yw, l, x-4, dy];
                    stack[slen  ]=yw;
                    stack[slen+1]=l;
                    stack[slen+2]=x-dx;
                    stack[slen+3]=dy;
                    slen += 4;
                }
                if (x > x2+dx)
                {
                    if (yw-dy >= ymin && yw-dy <= ymax)
                    {
                        //stack[slen++]=[yw, x2+4, x-4, -dy];	/* leak on right? */
                        stack[slen  ]=yw;
                        stack[slen+1]=x2+dx;
                        stack[slen+2]=x-dx;
                        stack[slen+3]=-dy;
                        slen += 4;
                    }
                }
        /*skip:*/
                i = x+yw; k = i>>>stride;
                diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                while (x<=x2 && (diff || (labeled[k>>>5]&(1<<(k&31)))))
                {
                    x+=dx;
                    i = x+yw; k = i>>>stride;
                    diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                }
                l = x;
                notdone = (x <= x2);
            }
        }
    }
    else
    {
        while (0 < slen)
        {
            /* pop segment off stack and fill a neighboring scan line */
            slen -= 4;
            dy = stack[slen+3];
            yw = stack[slen  ]+dy;
            x1 = stack[slen+1];
            x2 = stack[slen+2];
            ym = min(ym, yw); yM = max(yM, yw);
            xm = min(xm, x1); xM = max(xM, x2);

            /*
             * segment of scan line y-dy for x1<=x<=x2 was previously filled,
             * now explore adjacent pixels in scan line y
             */
            for (x=x1; x>=xmin; x-=dx)
            {
                i = x+yw; k = i;
                if (!(D[im[i]] & 1) && !(labeled[k>>>5]&(1<<(k&31))))
                {
                    labeled[k>>>5] |= 1<<(k&31);
                    xm = min(xm, x);
                }
                else break;
            }

            if (x >= x1)
            {
                // goto skip:
                i = x+yw; k = i;
                while (x<=x2 && ((D[im[i]] & 1) || (labeled[k>>>5]&(1<<(k&31)))))
                {
                    x+=dx;
                    i = x+yw; k = i;
                }
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+dx;
                if (l < x1)
                {
                    if (yw >= ymin+dy && yw <= ymax+dy)
                    {
                        //stack[slen++]=[yw, l, x1-4, -dy];  /* leak on left? */
                        stack[slen  ]=yw;
                        stack[slen+1]=l;
                        stack[slen+2]=x1-dx;
                        stack[slen+3]=-dy;
                        slen += 4;
                    }
                }
                x = x1+dx;
                notdone = true;
            }

            while (notdone)
            {
                i = x+yw; k = i;
                while (x<=xmax && !(D[im[i]] & 1) && !(labeled[k>>>5]&(1<<(k&31))))
                {
                    labeled[k>>>5] |= 1<<(k&31);
                    xM = max(xM, x);
                    x+=dx; i = x+yw; k = i;
                }
                if (yw+dy >= ymin && yw+dy <= ymax)
                {
                    //stack[slen++]=[yw, l, x-4, dy];
                    stack[slen  ]=yw;
                    stack[slen+1]=l;
                    stack[slen+2]=x-dx;
                    stack[slen+3]=dy;
                    slen += 4;
                }
                if (x > x2+dx)
                {
                    if (yw-dy >= ymin && yw-dy <= ymax)
                    {
                        //stack[slen++]=[yw, x2+4, x-4, -dy];	/* leak on right? */
                        stack[slen  ]=yw;
                        stack[slen+1]=x2+dx;
                        stack[slen+2]=x-dx;
                        stack[slen+3]=-dy;
                        slen += 4;
                    }
                }
        /*skip:*/
                i = x+yw; k = i;
                while (x<=x2 && ((D[im[i]] & 1) || (labeled[k>>>5]&(1<<(k&31)))))
                {
                    x+=dx;
                    i = x+yw; k = i;
                }
                l = x;
                notdone = (x <= x2);
            }
        }
    }
    return {mask:labeled, box:[xm, ym, xM, yM]};
}

}(FILTER);