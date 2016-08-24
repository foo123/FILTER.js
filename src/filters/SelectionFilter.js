/**
*
* Selection Filter
*
* Filter that selects part of image data for further processing
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var max = Math.max, min = Math.min, select = FILTER.Util.Image.get_data;

//
//  Selection Filter 
FILTER.Create({
    name: "SelectionFilter"
    
    ,init: function SelectionFilter( selection ) {
        var self = this;
        self.selection = selection || null;
    }
    
    ,path: FILTER_FILTERS_PATH
    
    ,_apply: function( im, w, h ) {
        var self = this, selection = self.selection, x1, y1, x2, y2;
        self.hasMeta = false; self.meta = null;
        
        if ( !selection ) return im;
        if ( selection[4] )
        {
            // selection is relative, make absolute
            x1 = min(w-1,max(0, selection[0]*(w-1)))|0;
            y1 = min(h-1,max(0, selection[1]*(h-1)))|0;
            x2 = min(w-1,max(0, selection[2]*(w-1)))|0;
            y2 = min(h-1,max(0, selection[3]*(h-1)))|0;
        }
        else
        {
            // selection is absolute
            x1 = min(w-1,max(0, selection[0]))|0;
            y1 = min(h-1,max(0, selection[1]))|0;
            x2 = min(w-1,max(0, selection[2]))|0;
            y2 = min(h-1,max(0, selection[3]))|0;
        }
        if ( (0 === x1) && (0 === y1) && (w === x2+1) && (h === y2+1) ) return im;
        
        self.hasMeta = true; self.meta = {_IMG_WIDTH: x2-x1+1, _IMG_HEIGHT: y2-y1+1};
        return select( im, w, h, x1, y1, x2, y2, true );
    }
});
FILTER.CropFilter = FILTER.SubSelectionFilter = FILTER.SelectionFilter;

}(FILTER);