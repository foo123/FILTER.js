/**
*
* Statistical Filter(s)
*
* Applies statistical filtering/processing to target image
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// used for internal purposes
var IMG = FILTER.ImArray, A32I = FILTER.Array32I, TypedArray = FILTER.Util.Array.typed,
    Min = Math.min, Max = Math.max, Filters;
    
//
//  Statistical Filter
var StatisticalFilter = FILTER.Create({
    name: "StatisticalFilter"
    
    ,init: function StatisticalFilter( ) {
        var self = this;
        self.d = 0;
        self.k = 0;
        self._gray = false;
        self._filter = null;
        self._indices = null;
    }
    
    ,path: FILTER_FILTERS_PATH
    ,d: 0
    ,k: 0
    ,_gray: false
    ,_filter: null
    ,_indices: null
    
    ,dispose: function( ) {
        var self = this;
        self.d = null;
        self.k = null;
        self._gray = null;
        self._filter = null;
        self._indices = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             d: self.d
            ,k: self.k
            ,_gray: self._gray
            ,_filter: self._filter
            ,_indices: self._indices
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.d = params.d;
        self.k = params.k;
        self._gray = params._gray;
        self._filter = params._filter;
        self._indices = TypedArray( params._indices, A32I );
        return self;
    }
    
    ,kth: function( k, d ) { 
        return this.set( null == d ? 3 : (d&1 ? d : d+1), k );
    }
    
    ,median: function( d ) { 
        // allow only odd dimensions for median
        return this.set( null == d ? 3 : (d&1 ? d : d+1), 0.5 );
    }
    
    ,minimum: function( d ) { 
        return this.set( null == d ? 3 : (d&1 ? d : d+1), 0 );
    }
    ,erode: null
    
    ,maximum: function( d ) { 
        return this.set( null == d ? 3 : (d&1 ? d : d+1), 1 );
    }
    ,dilate: null
    
    ,grayscale: function( bool ) {
        if ( !arguments.length ) bool = true;
        this._gray = !!bool;
        return this;
    }
    
    ,set: function( d, k ) {
        var self = this;
        self.d = d = d||3;
        self.k = k = Min(1, Max(0, k||0));
        self._filter = 0 === k ? "0th" : (1 === k ? "1th" : "kth"); 
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        var i, x, y, matArea2 = (d*d)<<1, dHalf = d>>>1, indices = new A32I(matArea2);
        for(x=0,y=0,i=0; i<matArea2; i+=2,x++)
        { 
            if ( x>=d ) { x=0; y++; }
            indices[i  ] = x-dHalf; indices[i+1] = y-dHalf;
        }
        self._indices = indices;
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self.d = 0; 
        self.k = 0; 
        //self._gray = false; 
        self._filter = null; 
        self._indices = null;
        return self;
    }
    
    // used for internal purposes
    ,_apply: function(im, w, h) {
        var self = this;
        if ( !self.d )  return im;
        return Filters[self._filter+(self._gray?'_gray':'')]( self, im, w, h );
    }
        
    ,canRun: function( ) {
        return this._isOn && this.d;
    }
});
// aliiases
StatisticalFilter.prototype.erode = StatisticalFilter.prototype.minimum;
StatisticalFilter.prototype.dilate = StatisticalFilter.prototype.maximum;

//
// private methods
Filters = {
     "1th": function( self, im, w, h ) {
        var matRadius = self.d, matHalfSide = matRadius>>1,
            imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM, bx = w-1, by = imArea-w,
            indices = self._indices, matArea2 = indices.length,
            matArea = matArea2>>>1, imIndex = new A32I(matArea2);
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        for (j=0; j<matArea2; j+=2) { imIndex[j]=indices[j]; imIndex[j+1]=indices[j+1]*w; }
        
        for (i=0,x=0,ty=0; i<imLen; i+=4,x++)
        {
            if (x>=w) { x=0; ty+=w; }
            for(rM=gM=bM=0,j=0; j<matArea2; j+=2)
            {
                xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                srcOff = (xOff + yOff)<<2;
                r = im[srcOff]; g = im[srcOff+1]; b = im[srcOff+2];
                // get max
                if ( r > rM ) rM = r; if ( g > gM ) gM = g; if ( b > bM ) bM = b;
            }
            // output
            dst[i] = rM; dst[i+1] = gM; dst[i+2] = bM; dst[i+3] = im[i+3];
        }
        return dst;
    }
    ,"0th": function( self, im, w, h ) {
        var matRadius = self.d, matHalfSide = matRadius>>1,
            imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM, bx = w-1, by = imArea-w,
            indices = self._indices, matArea2 = indices.length,
            matArea = matArea2>>>1, imIndex = new A32I(matArea2);
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        for (j=0; j<matArea2; j+=2) { imIndex[j]=indices[j]; imIndex[j+1]=indices[j+1]*w; }
        
        for (i=0,x=0,ty=0; i<imLen; i+=4,x++)
        {
            if (x>=w) { x=0; ty+=w; }
            for(rM=gM=bM=255,j=0; j<matArea2; j+=2)
            {
                xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                srcOff = (xOff + yOff)<<2;
                r = im[srcOff]; g = im[srcOff+1]; b = im[srcOff+2];
                // get min
                if ( r < rM ) rM = r; if ( g < gM ) gM = g; if ( b < bM ) bM = b;
            }
            // output
            dst[i] = rM; dst[i+1] = gM; dst[i+2] = bM; dst[i+3] = im[i+3];
        }
        return dst;
    }
    ,"kth": function( self, im, w, h ) {
        var matRadius = self.d, kth = self.k, matHalfSide = matRadius>>1,
            imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, bx = w-1, by = imArea-w,
            r, g, b, rmin, gmin, bmin, rmax, gmax, bmax, kthR, kthG, kthB,
            rhist, ghist, bhist, rtot, gtot, btot, rsum, gsum, bsum, min, max,
            indices = self._indices, matArea2 = indices.length,
            matArea = matArea2>>>1, imIndex = new A32I(matArea2);
        
        rhist = new Uint32Array(matArea);
        ghist = new Uint32Array(matArea);
        bhist = new Uint32Array(matArea);
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        for (j=0; j<matArea2; j+=2) { imIndex[j]=indices[j]; imIndex[j+1]=indices[j+1]*w; }
        
        for (i=0,x=0,ty=0; i<imLen; i+=4,x++)
        {
            if (x>=w) { x=0; ty+=w; }

            rtot=gtot=btot=0;
            rmin=gmin=bmin=255;
            rmax=gmax=bmax=0;
            for(j=0; j<matArea2; j+=2)
            {
                xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                srcOff = (xOff + yOff)<<2;
                r = im[srcOff]; g = im[srcOff+1]; b = im[srcOff+2]; 
                // compute histogram, similar to counting sort
                rhist[r]++; ghist[g]++; bhist[b]++;
                rtot++; gtot++; btot++;
                if ( r < rmin ) rmin = r; if ( g < gmin ) gmin = g; if ( b < bmin ) bmin = b;
                if ( r > rmax ) rmax = r; if ( g > gmax ) gmax = g; if ( b > bmax ) bmax = b;
            }
            
            // search histogram for kth statistic
            // and also reset histogram for next round
            // can it be made faster??
            min = Min(rmin, gmin, gmax); max = Max(rmax, gmax, bmax);
            rtot *= kth; gtot *= kth; btot *= kth;
            kthR = kthG = kthB = -1; rsum = gsum = bsum = 0;
            for(j=min; j<=max; j++)
            {
                rsum += rhist[j]; rhist[j] = 0;
                gsum += ghist[j]; ghist[j] = 0;
                bsum += bhist[j]; bhist[j] = 0;
                if ( 0 > kthR && rsum >= rtot ) kthR = j;
                if ( 0 > kthG && gsum >= gtot ) kthG = j;
                if ( 0 > kthB && bsum >= btot ) kthB = j;
            }
            
            // output
            dst[i] = kthR; dst[i+1] = kthG; dst[i+2] = kthB; dst[i+3] = im[i+3];
        }
        return dst;
    }
    ,"1th_gray": function( self, im, w, h ) {
        var matRadius = self.d, matHalfSide = matRadius>>1,
            imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, g, gM, bx = w-1, by = imArea-w,
            indices = self._indices, matArea2 = indices.length,
            matArea = matArea2>>>1, imIndex = new A32I(matArea2);
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        for (j=0; j<matArea2; j+=2) { imIndex[j]=indices[j]; imIndex[j+1]=indices[j+1]*w; }
        
        for (i=0,x=0,ty=0; i<imLen; i+=4,x++)
        {
            if (x>=w) { x=0; ty+=w; }
            for(gM=0,j=0; j<matArea2; j+=2)
            {
                xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                srcOff = (xOff + yOff)<<2;
                g = im[srcOff];
                // get max
                if ( g > gM ) gM = g;
            }
            // output
            dst[i] = gM; dst[i+1] = gM; dst[i+2] = gM; dst[i+3] = im[i+3];
        }
        return dst;
    }
    ,"0th_gray": function( self, im, w, h ) {
        var matRadius = self.d, matHalfSide = matRadius>>1,
            imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, g, gM, bx = w-1, by = imArea-w,
            indices = self._indices, matArea2 = indices.length,
            matArea = matArea2>>>1, imIndex = new A32I(matArea2);
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        for (j=0; j<matArea2; j+=2) { imIndex[j]=indices[j]; imIndex[j+1]=indices[j+1]*w; }
        
        for (i=0,x=0,ty=0; i<imLen; i+=4,x++)
        {
            if (x>=w) { x=0; ty+=w; }
            for(gM=255,j=0; j<matArea2; j+=2)
            {
                xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                srcOff = (xOff + yOff)<<2;
                g = im[srcOff];
                // get min
                if ( g < gM ) gM = g;
            }
            // output
            dst[i] = gM; dst[i+1] = gM; dst[i+2] = gM; dst[i+3] = im[i+3];
        }
        return dst;
    }
    ,"kth_gray": function( self, im, w, h ) {
        var matRadius = self.d, kth = self.k, matHalfSide = matRadius>>1,
            imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, bx = w-1, by = imArea-w,
            g, gmin, gmax, kthG, ghist, gtot, gsum,
            indices = self._indices, matArea2 = indices.length,
            matArea = matArea2>>>1, imIndex = new A32I(matArea2);
        
        ghist = new Uint32Array(matArea);
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        for (j=0; j<matArea2; j+=2) { imIndex[j]=indices[j]; imIndex[j+1]=indices[j+1]*w; }
        
        for (i=0,x=0,ty=0; i<imLen; i+=4,x++)
        {
            if (x>=w) { x=0; ty+=w; }

            gtot=0; gmin=255; gmax=0;
            for(j=0; j<matArea2; j+=2)
            {
                xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                srcOff = (xOff + yOff)<<2;
                g = im[srcOff];
                if ( g < gmin ) gmin = g; if ( g > gmax ) gmax = g;
                // compute histogram, similar to counting sort
                gtot++; ghist[g]++;
            }
            
            // search histogram for kth statistic
            // and also reset histogram for next round
            // can it be made faster??
            gtot *= kth; gsum = 0; kthG = -1;
            for(j=gmin; j<=gmax; j++)
            {
                gsum += ghist[j]; ghist[j] = 0;
                if ( 0 > kthG && gsum >= gtot ) kthG = j;
            }
            
            // output
            dst[i] = kthG; dst[i+1] = kthG; dst[i+2] = kthG; dst[i+3] = im[i+3];
        }
        return dst;
    }
};

}(FILTER);