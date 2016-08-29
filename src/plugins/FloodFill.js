/**
*
* FloodFill, PatternFill Plugin(s)
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var TypedArray = FILTER.Util.Array.typed, abs = Math.abs,
    min = Math.min, max = Math.max, ceil = Math.ceil,
    MODE = FILTER.MODE, connected_component = FILTER.MachineLearning.connected_component;
    
// a fast flood fill filter using scanline algorithm
// adapted from: A Seed Fill Algorithm, by Paul Heckbert from "Graphics Gems", Academic Press, 1990
// http://en.wikipedia.org/wiki/Flood_fill
// http://www.codeproject.com/Articles/6017/QuickFill-An-efficient-flood-fill-algorithm
// http://www.codeproject.com/Articles/16405/Queue-Linear-Flood-Fill-A-Fast-Flood-Fill-Algorith
FILTER.Create({
    name : "FloodFillFilter"
    ,x: 0
    ,y: 0
    ,color: null
    ,border: null
    ,tolerance: 1e-6
    
    ,path: FILTER_PLUGINS_PATH
    
    ,init: function( x, y, color, tolerance, border ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.color = color || 0;
        self.tolerance = null == tolerance ? 1e-6 : +tolerance;
        self.border = null != border ? border||0 : null;
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
    
    // this is the filter actual apply method routine
    /* adapted from:
     * A Seed Fill Algorithm
     * by Paul Heckbert
     * from "Graphics Gems", Academic Press, 1990
     */
    ,apply: function( im, w, h ) {
        var self = this, //borderColor = self.borderColor,
            color = self.color||0, x0 = self.x||0, y0 = self.y||0,
            r, g, b, r0, g0, b0, r1, g1, b1, x, y, k, i, bb, mask, x1, y1, x2, y2,
            border = self.border;
            
        if ( x0 < 0 || x0 >= w || y0 < 0 || y0 >= h ) return im;
        
        x0 = x0<<2; y0 = (y0*w)<<2; i = x0+y0;
        r0 = im[i]; g0 = im[i+1]; b0 = im[i+2];
        r = (color>>>16)&255; g = (color>>>8)&255; b = color&255;
        if ( null != border )
        {
           r1 = (border>>>16)&255;
           g1 = (border>>>8)&255;
           b1 = (border)&255;
           if ( r0 === r1 && g0 === g1 && b0 === b1 ) return im;
           r0 = r1; g0 = g1; b0 = b1;
        }
        else
        {
            if ( r === r0 && g === g0 && b === b0 ) return im;
        }
        
        bb = [0,0,0,0];
        /* seems to have issues when tolerance is exactly 1.0*/
        mask = connected_component(x0, y0, r0, g0, b0, bb, im, w, h, (255*(self.tolerance>=1.0 ? 0.999 : self.tolerance))|0, null != border);
        
        x1 = bb[0]>>>2; y1 = bb[1]>>>2; x2 = bb[2]>>2; y2 = bb[3]>>>2;
        for(x=x1,y=y1; y<=y2; )
        {
            k = x+y;
            if ( /*0 < mask[k]*/mask[k>>>5]&(1<<(k&31)) )
            {
                i = k << 2;
                im[i  ] = r;
                im[i+1] = g;
                im[i+2] = b;
            }
            if ( ++x>x2 ){ x=x1; y+=w; }
        }
        // return the new image data
        return im;
    }
});
//FILTER.ColorFillFilter = FILTER.FloodFillFilter;

FILTER.Create({
    name : "PatternFillFilter"
    ,x: 0
    ,y: 0
    ,offsetX: 0
    ,offsetY: 0
    ,tolerance: 1e-6
    ,mode: MODE.TILE
    ,border: null
    ,hasInputs: true
    
    ,path: FILTER_PLUGINS_PATH
    
    ,init: function( x, y, pattern, offsetX, offsetY, mode, tolerance, border ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        if ( pattern ) self.setInput( "pattern", pattern );
        self.mode = mode || MODE.TILE;
        self.tolerance = null == tolerance ? 1e-6 : +tolerance;
        self.border = null != border ? border||0 : null;
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
        
        var STRETCH = MODE.STRETCH, mode = self.mode, pattern = Pat[0],
            pw = Pat[1], ph = Pat[2], px0 = self.offsetX||0, py0 = self.offsetY||0,
            r0, g0, b0, r, g, b, x, y, k, i, pi, px, py, bb, mask, x1, y1, x2, y2, sx, sy,
            border = self.border;
        
        x0 = x0<<2; y0 = (y0*w)<<2; i = x0+y0;
        r0 = im[i]; g0 = im[i+1]; b0 = im[i+2];
        if ( null != border )
        {
           r = (border>>>16)&255;
           g = (border>>>8)&255;
           b = (border)&255;
           if ( r0 === r && g0 === g && b0 === b ) return im;
           r0 = r; g0 = g; b0 = b;
        }
        bb = [0,0,0,0];
        /* seems to have issues when tolerance is exactly 1.0*/
        mask = connected_component(x0, y0, r0, g0, b0, bb, im, w, h, (255*(self.tolerance>=1.0 ? 0.999 : self.tolerance))|0, null != border);
        
        x1 = bb[0]>>>2; y1 = bb[1]>>>2; x2 = bb[2]>>>2; y2 = bb[3]>>>2;
        if ( STRETCH === mode )
        {
            sx = pw/(x2-x1+1); sy = ph/(y2-y1+w);
            for(x=x1,y=y1; y<=y2; )
            {
                k = x+y;
                if ( /*0 < mask[k]*/mask[k>>>5]&(1<<(k&31)) )
                {
                    i = k << 2;
                    //px = (pw*(x-x1)/(x2-x1+1))|0; py = (ph*(y-y1)/(y2-y1+w))|0;
                    px = (sx*(x-x1))|0; py = (sy*(y-y1))|0;
                    pi = (px + py*pw) << 2;
                    im[i  ] = pattern[pi  ];
                    im[i+1] = pattern[pi+1];
                    im[i+2] = pattern[pi+2];
                }
                if ( ++x>x2 ){ x=x1; y+=w; }
            }
        }
        else //if ( TILE === mode )
        {
            if ( 0 > px0 ) px0 += pw;
            if ( 0 > py0 ) py0 += ph;
            for(x=x1,y=y1; y<=y2; )
            {
                k = x+y;
                if ( /*0 < mask[k]*/mask[k>>>5]&(1<<(k&31)) )
                {
                    i = k << 2;
                    px = (x-x1+px0) % pw;
                    py = (y-y1+py0) % ph;
                    pi = (px + py*pw) << 2;
                    im[i  ] = pattern[pi  ];
                    im[i+1] = pattern[pi+1];
                    im[i+2] = pattern[pi+2];
                }
                if ( ++x>x2 ){ x=x1; y+=w; }
            }
        }
        // return the new image data
        return im;
    }
});

}(FILTER);