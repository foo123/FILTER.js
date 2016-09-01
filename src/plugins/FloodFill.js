/**
*
* FloodFill, PatternFill Plugin(s)
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var MODE = FILTER.MODE;
    
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
    
    ,path: FILTER_PLUGINS_PATH
    
    ,init: function( x, y, color, tolerance, border ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.color = color || 0;
        self.tolerance = null == tolerance ? 1e-6 : +tolerance;
        self.border = null != border ? border||0 : null;
        self.mode = MODE.COLOR;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             color: self.color
            ,border: self.border
            ,x: self.x
            ,y: self.y
            ,tolerance: self.tolerance
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.color = params.color;
        self.border = params.border;
        self.x = params.x;
        self.y = params.y;
        self.tolerance = params.tolerance;
        return self;
    }
    
    ,apply: function( im, w, h ) {
        var self = this, mode = self.mode || MODE.COLOR,
            color = self.color||0, border = self.border, exterior = null != border,
            x0 = self.x||0, y0 = self.y||0, x, y, x1, y1, x2, y2, k, i, l, 
            r, g, b, r0, g0, b0, rb, gb, bb, hsv, dist, D0, D1, region, box, mask, block_mask,
            RGB2HSV = FILTER.Color.RGB2HSV, HSV2RGB = FILTER.Color.HSV2RGB;
            
        if ( x0 < 0 || x0 >= w || y0 < 0 || y0 >= h ) return im;
        
        x0 = x0<<2; y0 = (y0*w)<<2; i = x0+y0;
        r0 = im[i]; g0 = im[i+1]; b0 = im[i+2]; D0 = 0; D1 = 1;
        r = (color>>>16)&255; g = (color>>>8)&255; b = color&255;
        if ( exterior )
        {
           rb = (border>>>16)&255; gb = (border>>>8)&255; bb = (border)&255;
           if ( r0 === rb && g0 === gb && b0 === bb ) return im;
           r0 = rb; g0 = gb; b0 = bb; D0 = 1; D1 = 0;
        }
        else if ( MODE.COLOR === mode && r0 === r && g0 === g && b0 === b )
        {
            return im;
        }
        
        /* seems to have issues when tolerance is exactly 1.0 */
        dist = FILTER.Util.Filter.dissimilarity_rgb(r0, g0, b0, D0, D1, 255*(self.tolerance>=1.0 ? 0.999 : self.tolerance));
        region = FILTER.MachineLearning.flood_region(im, w, h, 2, dist, 8, x0, y0);
        // mask is a packed bit array for efficiency
        mask = region.mask;
        
        if ( (MODE.MASK === mode) || (MODE.COLORMASK === mode) )
        {
            // MODE.MASK returns the region mask, rest image is put blank
            block_mask = MODE.MASK === mode;
            x=0; y=0;
            for(i=0,l=im.length; i<l; i+=4,x++)
            {
                if ( x>=w ) { x=0; y+=w; }
                k = x+y;
                if ( mask[k>>>5]&(1<<(k&31)) )
                {
                    // use mask color
                    if ( block_mask ) { im[i  ] = r; im[i+1] = g; im[i+2] = b; }
                    // else leave original color
                }
                else
                {
                    im[i  ] = 0; im[i+1] = 0; im[i+2] = 0;
                }
            }
        }
        else if ( MODE.HUE === mode )
        {
            // MODE.HUE enables to fill/replace color gradients in a connected region
            box = region.box;
            x1 = box[0]>>>2; y1 = box[1]>>>2; x2 = box[2]>>2; y2 = box[3]>>>2;
            hsv = new FILTER.Array32F(3);
            
            for(x=x1,y=y1; y<=y2; )
            {
                k = x+y;
                if ( mask[k>>>5]&(1<<(k&31)) )
                {
                    i = k << 2;
                    hsv[0] = im[i  ]; hsv[1] = im[i+1]; hsv[2] = im[i+2];
                    RGB2HSV(hsv, 0, 1); hsv[0] = color; HSV2RGB(hsv, 0, 1);
                    im[i  ] = hsv[0]|0; im[i+1] = hsv[1]|0; im[i+2] = hsv[2]|0;
                }
                if ( ++x>x2 ){ x=x1; y+=w; }
            }
        }
        else //if ( MODE.COLOR === mode )
        {
            // fill/replace color in region
            box = region.box;
            x1 = box[0]>>>2; y1 = box[1]>>>2; x2 = box[2]>>2; y2 = box[3]>>>2;
            for(x=x1,y=y1; y<=y2; )
            {
                k = x+y;
                if ( mask[k>>>5]&(1<<(k&31)) )
                {
                    i = k << 2;
                    im[i  ] = r;
                    im[i+1] = g;
                    im[i+2] = b;
                }
                if ( ++x>x2 ){ x=x1; y+=w; }
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
    
    ,path: FILTER_PLUGINS_PATH
    
    ,init: function( x, y, pattern, offsetX, offsetY, tolerance, border ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        if ( pattern ) self.setInput( "pattern", pattern );
        self.tolerance = null == tolerance ? 1e-6 : +tolerance;
        self.border = null != border ? border||0 : null;
        self.mode = MODE.TILE;
    }
    
    ,dispose: function( ) {
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
    
    ,serialize: function( ) {
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
    
    ,unserialize: function( params ) {
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
    ,apply: function( im, w, h ) {
        var self = this, x0 = self.x||0, y0 = self.y||0, Pat;
        
        if ( x0 < 0 || x0 >= w || y0 < 0 || y0 >= h ) return im;
        Pat = self.input("pattern"); if ( !Pat ) return im;
        
        var mode = self.mode||MODE.TILE, border = self.border, exterior = null != border, delta,
            pattern = Pat[0], pw = Pat[1], ph = Pat[2], px0 = self.offsetX||0, py0 = self.offsetY||0,
            r0, g0, b0, rb, gb, bb, x, y, k, i, pi, px, py, x1, y1, x2, y2, sx, sy,
            dist, D0, D1, region, box, mask, yy;
        
        x0 = x0<<2; y0 = (y0*w)<<2; i = x0+y0;
        r0 = im[i]; g0 = im[i+1]; b0 = im[i+2]; D0 = 0; D1 = 1;
        if ( exterior )
        {
           rb = (border>>>16)&255; gb = (border>>>8)&255; bb = (border)&255;
           if ( r0 === rb && g0 === gb && b0 === bb ) return im;
           r0 = rb; g0 = gb; b0 = bb; D0 = 1; D1 = 0;
        }
        
        /* seems to have issues when tolerance is exactly 1.0 */
        dist = FILTER.Util.Filter.dissimilarity_rgb(r0, g0, b0, D0, D1, 255*(self.tolerance>=1.0 ? 0.999 : self.tolerance));
        region = FILTER.MachineLearning.flood_region(im, w, h, 2, dist, 8, x0, y0);
        // mask is a packed bit array for efficiency
        mask = region.mask; box = region.box;
        x1 = box[0]>>>2; y1 = box[1]>>>2; x2 = box[2]>>>2; y2 = box[3]>>>2;
        
        if ( MODE.STRETCH === mode )
        {
            // MODE.STRETCH stretches (rescales) pattern to fit and fill region
            sx = pw/(x2-x1+1); sy = ph/(y2-y1+w);
            for(x=x1,y=y1; y<=y2; )
            {
                k = x+y;
                if ( mask[k>>>5]&(1<<(k&31)) )
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
                if ( ++x>x2 ){ x=x1; y+=w; }
            }
        }
        else //if ( MODE.TILE === mode )
        {
            // MODE.TILE tiles (repeats) pattern to fit and fill region
            if ( 0 > px0 ) px0 += pw;
            if ( 0 > py0 ) py0 += ph;
            x2 = x2-x1+1;
            for(x=0,y=0,yy=y1; yy<=y2; )
            {
                k = x+x1 + yy;
                if ( mask[k>>>5]&(1<<(k&31)) )
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
                if ( ++x>=x2 ){ x=0; yy+=w; y++; }
            }
        }
        // return the new image data
        return im;
    }
});

}(FILTER);