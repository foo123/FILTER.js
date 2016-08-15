/**
*
* Resample Filter
*
* Allows to resample the image data up or down with various interpolation methods
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Interpolation = FILTER.Interpolation;

//
//  Resample Filter 
FILTER.Create({
    name: "ResampleFilter"
    
    ,init: function ResampleFilter( sX, sY, interpolate ) {
        var self = this;
        self.sX = sX || 1;
        self.sY = sY || 1;
        self.interpolation = interpolate;
    }
    
    ,path: FILTER_FILTERS_PATH
    ,sX: 1
    ,sY: 1
    ,interpolation: null
    ,hasMeta: true
    
    ,dispose: function( ) {
        var self = this;
        self.sX = null;
        self.sY = null;
        self.interpolation = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             sX: self.sX
            ,sY: self.sY
            ,interpolation: self.interpolation
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.sX = params.sX;
        self.sY = params.sY;
        self.interpolation = params.interpolation;
        return self;
    }
    
    ,_apply: function( im, w, h ) {
        var self = this, sX = self.sX, sY = self.sY, nw, nh, interpolate;
        self.hasMeta = false; self._meta = null;
        if ( 1 === sX && 1 === sY ) return im;
        
        interpolate = Interpolation[self.interpolation||"bilinear"];
        if ( !interpolate ) return im;
        
        nw = (self.sX*w)|0; nh = (self.sY*h)|0;
        self.hasMeta = true; self._meta = {_IMG_WIDTH: nw, _IMG_HEIGHT: nh};
        return interpolate( im, w, h, nw, nh );
    }
});
FILTER.InterpolationFilter = FILTER.ResizeFilter = FILTER.RescaleFilter = FILTER.ResampleFilter;

}(FILTER);