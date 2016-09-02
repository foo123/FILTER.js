/**
*
* Dimension Filter
*
* Filter that alters image dimensions by croping, sampling and padding or any combination thereof for further processing
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var max = Math.max, min = Math.min, round = Math.round;

//  Dimension (crop-sample-pad) Filter
FILTER.Create({
    name: "DimensionFilter"
    
    ,crop: null
    ,scale: null
    ,pad: null
    
    ,init: function DimensionFilter( crop, scale, pad ) {
        var self = this;
        self.crop = crop || null;
        self.scale = scale || null;
        self.pad = pad || null;
    }
    
    ,path: FILTER_FILTERS_PATH
    
    ,dispose: function( ) {
        var self = this;
        self.crop = null;
        self.scale = null;
        self.pad = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             crop: self.crop || null
            ,scale: self.scale || null
            ,pad: self.pad || null
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.crop = params.crop;
        self.scale = params.scale;
        self.pad = params.pad;
        return self;
    }
    
    ,_apply: function( im, w, h ) {
        var self = this, nw = w, nh = h,
            crop = null, scale = self.scale||null, pad = self.pad||null,
            sx, sy, sw, sh, interpolate, x1, y1, x2, y2,
            pad_right, pad_bot, pad_left, pad_top;
        
        if ( !self.crop && self.selection ) crop = self.selection;
        else if ( self.crop /*&& !self.selection*/ ) crop = self.crop;
        
        self.hasMeta = false; self.meta = null;
        if ( !crop && !scale && !pad ) return im;
        
        if ( crop )
        {
            if ( crop[4] )
            {
                // crop selection is relative, make absolute
                x1 = min(w-1,max(0, round( crop[0]*(w-1) )));
                y1 = min(h-1,max(0, round( crop[1]*(h-1) )));
                x2 = min(w-1,max(0, round( crop[2]*(w-1) )));
                y2 = min(h-1,max(0, round( crop[3]*(h-1) )));
            }
            else
            {
                // crop selection is absolute
                x1 = min(w-1,max(0, round( crop[0] )));
                y1 = min(h-1,max(0, round( crop[1] )));
                x2 = min(w-1,max(0, round( crop[2] )));
                y2 = min(h-1,max(0, round( crop[3] )));
            }
            if ( (0 === x1) && (0 === y1) && (nw === x2+1) && (nh === y2+1) )
            {
                /* nothing */
            }
            else
            {
                im = FILTER.Util.Image.get_data( im, nw, nh, x1, y1, x2, y2, true );
                nw = x2-x1+1; nh = y2-y1+1;
            }
        }
        if ( scale )
        {
            sx = scale[0];
            sy = scale[1];
            interpolate = FILTER.Interpolation[scale[2]||"bilinear"];
            
            if ( !interpolate || ((1 === sx) && (1 === sy)) )
            {
                /* nothing */
            }
            else
            {
                sw = round( sx*nw ); sh = round( sy*nh );
                im = interpolate( im, nw, nh, sw, sh );
                nw = sw; nh = sh;
            }
        }
        if ( pad )
        {
            pad_left  = round( pad[0]||0 );
            pad_right = round( pad[2]||0 );
            pad_top   = round( pad[1]||0 );
            pad_bot   = round( pad[3]||0 );
            
            if ( (0 === pad_left) && (0 === pad_right) && (0 === pad_top) && (0 === pad_bot) )
            {
                /* nothing */
            }
            else
            {
                im = FILTER.Util.Image.pad( im, nw, nh, pad_right, pad_bot, pad_left, pad_top );
                nw += pad_left+pad_right; nh += pad_bot+pad_top;
            }
        }
        if ( (nw !== w) || (nh !== h) )
        {
            self.hasMeta = true;
            self.meta = {_IMG_WIDTH: nw, _IMG_HEIGHT: nh};
        }
        return im;
    }
});
// aliases
FILTER.InterpolationFilter = FILTER.ResizeFilter = FILTER.RescaleFilter = FILTER.ResampleFilter = FILTER.PadFilter = FILTER.CropFilter = FILTER.SubSelectionFilter = FILTER.SelectionFilter = FILTER.SelectFilter = FILTER.DimensionFilter;

}(FILTER);