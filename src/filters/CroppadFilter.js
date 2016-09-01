/**
*
* Croppad Filter
*
* Filter that crops and/or pads part of image data for further processing
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var max = Math.max, min = Math.min;

//  Croppad (Crop-Pad) Filter
FILTER.Create({
    name: "CroppadFilter"
    
    ,crop: null
    ,pad: null
    
    ,init: function CroppadFilter( crop, pad ) {
        var self = this;
        self.crop = crop || null;
        self.pad = pad || null;
    }
    
    ,path: FILTER_FILTERS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
             crop: self.crop || null
            ,pad: self.pad || null
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.crop = params.crop;
        self.pad = params.pad;
        return self;
    }
    
    ,_apply: function( im, w, h ) {
        var self = this, nw = w, nh = h, crop = null, pad = self.pad,
            x1, y1, x2, y2, pad_right, pad_bot, pad_left, pad_top;
        
        if ( !self.crop && self.selection ) crop = self.selection;
        else if ( self.crop /*&& !self.selection*/ ) crop = self.crop;
        
        self.hasMeta = false; self.meta = null;
        if ( !crop && !pad ) return im;
        
        if ( crop )
        {
            if ( crop[4] )
            {
                // crop selection is relative, make absolute
                x1 = min(w-1,max(0, crop[0]*(w-1)))|0;
                y1 = min(h-1,max(0, crop[1]*(h-1)))|0;
                x2 = min(w-1,max(0, crop[2]*(w-1)))|0;
                y2 = min(h-1,max(0, crop[3]*(h-1)))|0;
            }
            else
            {
                // crop selection is absolute
                x1 = min(w-1,max(0, crop[0]))|0;
                y1 = min(h-1,max(0, crop[1]))|0;
                x2 = min(w-1,max(0, crop[2]))|0;
                y2 = min(h-1,max(0, crop[3]))|0;
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
        if ( pad )
        {
            pad_left  = pad[0]||0;
            pad_right = pad[2]||0;
            pad_top   = pad[1]||0;
            pad_bot   = pad[3]||0;
            
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
FILTER.PadFilter = FILTER.CropFilter = FILTER.SubSelectionFilter = FILTER.SelectionFilter;

}(FILTER);