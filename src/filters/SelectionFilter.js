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
    
    ,init: function SelectionFilter( x1, y1, x2, y2 ) {
        var self = this;
        self.x1 = null == x1 ? 0 : +x1;
        self.y1 = null == y1 ? 0 : +y1;
        self.x2 = null == x2 ? 1 : +x2;
        self.y2 = null == y2 ? 1 : +y2;
    }
    
    ,path: FILTER_FILTERS_PATH
    ,x1: 0, y1: 0, x2: 1, y2: 1
    ,hasMeta: true
    
    ,dispose: function( ) {
        var self = this;
        self.x1 = null;
        self.y1 = null;
        self.x2 = null;
        self.y2 = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             x1: self.x1
            ,y1: self.y1
            ,x2: self.x2
            ,y2: self.y2
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.x1 = params.x1;
        self.y1 = params.y1;
        self.x2 = params.x2;
        self.y2 = params.y2;
        return self;
    }
    
    ,_apply: function( im, w, h ) {
        var self = this, x1, y1, x2, y2;
        self.hasMeta = false; self._meta = null;
        
        x1 = (min(1,max(0, +self.x1))*(w-1))|0;
        y1 = (min(1,max(0, +self.y1))*(h-1))|0;
        x2 = (min(1,max(0, +self.x2))*(w-1))|0;
        y2 = (min(1,max(0, +self.y2))*(h-1))|0;
        if ( (0 === x1) && (0 === y1) && (w === x2+1) && (h === y2+1) ) return im;
        
        self.hasMeta = true; self._meta = {_IMG_WIDTH: x2-x1+1, _IMG_HEIGHT: y2-y1+1};
        return select( im, w, h, x1, y1, x2, y2, true );
    }
});
FILTER.CropFilter = FILTER.SubSelectionFilter = FILTER.SelectionFilter;

}(FILTER);