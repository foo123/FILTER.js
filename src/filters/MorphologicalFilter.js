/**
*
* Morphological Filter(s)
*
* Applies morphological processing to target image
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// used for internal purposes
var IMG = FILTER.ImArray, STRUCT = FILTER.Array8U, A32I = FILTER.Array32I,
    Sqrt = Math.sqrt, TypedArray = FILTER.Util.Array.typed,
    // return a box structure element
    box = function( d ) {
        var i, size=d*d, ones = new STRUCT(size);
        for (i=0; i<size; i++) ones[i]=1;
        return ones;
    },
    box3 = box(3), Filters
;


//
//
//  Morphological Filter
FILTER.Create({
    name: "MorphologicalFilter"
    
    ,init: function MorphologicalFilter( ) {
        var self = this;
        self._filterName = null;
        self._filter = null;
        self._dim = 0;
        self._structureElement = null;
        self._indices = null;
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_filterName: null
    ,_filter: null
    ,_dim: 0
    ,_structureElement: null
    ,_indices: null
    
    ,dispose: function( ) {
        var self = this;
        self._filterName = null;
        self._filter = null;
        self._dim = null;
        self._structureElement = null;
        self._indices = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            _filterName: self._filterName
            ,_dim: self._dim
            ,_structureElement: self._structureElement
            ,_indices: self._indices
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self._dim = params._dim;
        self._structureElement = TypedArray( params._structureElement, STRUCT );
        self._indices = TypedArray( params._indices, A32I );
        self._filterName = params._filterName;
        if ( self._filterName && Filters[ self._filterName ] )
            self._filter = Filters[ self._filterName ];
        return self;
    }
    
    ,erode: function( structureElement ) { 
        return this.set( structureElement, "erode" );
    }
    
    ,dilate: function( structureElement ) { 
        return this.set( structureElement, "dilate" );
    }
    
    ,opening: function( structureElement ) { 
        return this.set( structureElement, "open" );
    }
    
    ,closing: function( structureElement ) { 
        return this.set( structureElement, "close" );
    }
    
    ,set: function( structureElement, filtName ) {
        var self = this;
        self._filterName = filtName;
        self._filter = Filters[ filtName ];
        if ( structureElement && structureElement.length )
        {
            // structure Element given
            self._structureElement = new STRUCT( structureElement );
            self._dim = (Sqrt(self._structureElement.length)+0.5)|0;
        }
        else if (structureElement && (structureElement === +structureElement) )
        {
            // dimension given
            self._structureElement = box(structureElement);
            self._dim = structureElement;
        }
        else
        {
            // default
            self._structureElement = box3;
            self._dim = 3;
        }
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        var indices = [], i, x, y, structureElement = self._structureElement, 
            matArea = structureElement.length, matRadius = self._dim, matHalfSide = matRadius>>>1;
        for(x=0,y=0,i=0; i<matArea; i++,x++)
        { 
            if (x>=matRadius) { x=0; y++; }
            // allow a general structuring element instead of just a box
            if ( structureElement[i] )
            {
                indices.push(x-matHalfSide);
                indices.push(y-matHalfSide);
            }
        }
        self._indices = new A32I(indices);
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self._filterName = null; 
        self._filter = null; 
        self._dim = 0; 
        self._structureElement = null; 
        self._indices = null;
        return self;
    }
    
    ,_apply: function( im, w, h ) {
        var self = this;
        if ( !self._dim || !self._filter )  return im;
        return self._filter( self, im, w, h );
    }
        
    ,canRun: function( ) {
        return this._isOn && this._dim && this._filter;
    }
});

//
//
// private methods

Filters = {
    "dilate": function( self, im, w, h ) {
        var structureElement = self._structureElement,
            matArea = structureElement.length, //matRadius*matRadius,
            matRadius = self._dim, indices = self._indices,
            coverArea2 = indices.length, coverArea = coverArea2>>>1, imIndex = new A32I(coverArea2),
            imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen),
            i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM, bx=w-1, by=imArea-w;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        for (j=0; j<coverArea2; j+=2){ imIndex[j]=indices[j]; imIndex[j+1]=indices[j+1]*w; }
        
        for (x=0,ty=0,i=0; i<imLen; i+=4,x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            for (rM=gM=bM=0,j=0; j<coverArea; j+=2)
            {
                xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                srcOff = (xOff + yOff)<<2;
                r = im[srcOff]; g = im[srcOff+1]; b = im[srcOff+2];
                if ( r>rM ) rM = r; if ( g>gM ) gM = g; if ( b>bM ) bM = b;
            }
            // output
            dst[i] = rM; dst[i+1] = gM; dst[i+2] = bM; dst[i+3] = im[i+3];
        }
        return dst;
    }
    
    ,"erode": function( self, im, w, h ) {
        var structureElement = self._structureElement,
            matArea = structureElement.length, //matRadius*matRadius,
            matRadius = self._dim, indices = self._indices,
            coverArea2 = indices.length, coverArea = coverArea2>>>1, imIndex = new A32I(coverArea2),
            imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen),
            i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM, bx=w-1, by=imArea-w;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        for (j=0; j<coverArea2; j+=2){ imIndex[j]=indices[j]; imIndex[j+1]=indices[j+1]*w; }
        
        for (x=0,ty=0,i=0; i<imLen; i+=4,x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            for (rM=gM=bM=255,j=0; j<coverArea; j+=2)
            {
                xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                srcOff = (xOff + yOff)<<2;
                r = im[srcOff]; g = im[srcOff+1]; b = im[srcOff+2];
                if ( r<rM ) rM = r; if ( g<gM ) gM = g; if ( b<bM ) bM = b;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        return dst;
    }
    
    // dilation of erotion
    ,"open": function( self, im, w, h ) {
        var structureElement = self._structureElement,
            matArea = structureElement.length, //matRadius*matRadius,
            matRadius = self._dim, indices = self._indices,
            coverArea2 = indices.length, coverArea = coverArea2>>>1, imIndex = new A32I(coverArea2),
            imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen),
            i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM, bx=w-1, by=imArea-w;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        for (j=0; j<coverArea2; j+=2){ imIndex[j]=indices[j]; imIndex[j+1]=indices[j+1]*w; }
        
        // erode step
        for (x=0,ty=0,i=0; i<imLen; i+=4,x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            for (rM=gM=bM=255,j=0; j<coverArea; j+=2)
            {
                xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                srcOff = (xOff + yOff)<<2;
                r = im[srcOff]; g = im[srcOff+1]; b = im[srcOff+2];
                if ( r<rM ) rM = r; if ( g<gM ) gM = g; if ( b<bM ) bM = b;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        
        var tmp = im; im = dst; dst = tmp;
        
        // dilate step
        for (x=0,ty=0,i=0; i<imLen; i+=4,x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            for (rM=gM=bM=0,j=0; j<coverArea; j+=2)
            {
                xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                srcOff = (xOff + yOff)<<2;
                r = im[srcOff]; g = im[srcOff+1]; b = im[srcOff+2];
                if ( r>rM ) rM = r; if ( g>gM ) gM = g; if ( b>bM ) bM = b;
            }
            // output
            dst[i] = rM; dst[i+1] = gM; dst[i+2] = bM; dst[i+3] = im[i+3];
        }
        return dst;
    }
    
    // erotion of dilation
    ,"close": function( self, im, w, h ) {
        var structureElement = self._structureElement,
            matArea = structureElement.length, //matRadius*matRadius,
            matRadius = self._dim, indices = self._indices,
            coverArea2 = indices.length, coverArea = coverArea2>>>1, imIndex = new A32I(coverArea2),
            imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen),
            i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM, bx=w-1, by=imArea-w;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        for (j=0; j<coverArea2; j+=2){ imIndex[j]=indices[j]; imIndex[j+1]=indices[j+1]*w; }
        
        // dilate step
        for (x=0,ty=0,i=0; i<imLen; i+=4,x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            for (rM=gM=bM=0,j=0; j<coverArea; j+=2)
            {
                xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                srcOff = (xOff + yOff)<<2;
                r = im[srcOff]; g = im[srcOff+1]; b = im[srcOff+2];
                if ( r>rM ) rM = r; if ( g>gM ) gM = g; if ( b>bM ) bM = b;
            }
            // output
            dst[i] = rM; dst[i+1] = gM; dst[i+2] = bM; dst[i+3] = im[i+3];
        }
        
        var tmp = im; im = dst; dst = tmp;
        
        // erode step
        for (x=0,ty=0,i=0; i<imLen; i+=4,x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            for (rM=gM=bM=255,j=0; j<coverArea; j+=2)
            {
                xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                srcOff = (xOff + yOff)<<2;
                r = im[srcOff]; g = im[srcOff+1]; b = im[srcOff+2];
                if ( r<rM ) rM = r; if ( g<gM ) gM = g; if ( b<bM ) bM = b;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        return dst;
    }
};

}(FILTER);