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
    
    @@USE_STRICT@@
    
    // used for internal purposes
    var IMG = FILTER.ImArray, STRUCT = FILTER.Array8U, A32I = FILTER.Array32I, Sqrt = Math.sqrt,
        
        // return a box structure element
        box = function(d) {
            var i, size=d*d, ones=new STRUCT(size);
            for (i=0; i<size; i++) ones[i]=1;
            return ones;
        },
        
        box3 = box(3),
        
        Filters
    ;
    
    
    //
    //
    //  Morphological Filter
    var MorphologicalFilter = FILTER.MorphologicalFilter = FILTER.Class( FILTER.Filter, {
        name: "MorphologicalFilter"
        
        ,constructor: function( ) {
            var self = this;
            self.$super('constructor');
            self._filterName = null;
            self._filter = null;
            self._dim = 0;
            self._structureElement = null;
            self._indices = null;
        }
        
        ,_filterName: null
        ,_filter: null
        ,_dim: 0
        ,_structureElement: null
        ,_indices: null
        
        ,dispose: function( ) {
            var self = this;
            
            self.$super('dispose');
            
            self._filterName = null;
            self._filter = null;
            self._dim = null;
            self._structureElement = null;
            self._indices = null;
            
            return self;
        }
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    _filterName: self._filterName
                    ,_dim: self._dim
                    ,_structureElement: self._structureElement
                    ,_indices: self._indices
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self._dim = params._dim;
                self._structureElement = params._structureElement;
                self._indices = params._indices;
                self._filterName = params._filterName;
                if ( self._filterName && Filters[ self._filterName ] )
                    self._filter = Filters[ self._filterName ];
            }
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
                self._dim = ~~(Sqrt(self._structureElement.length)+0.5);
            }
            else if (structureElement && structureElement===(structureElement-0))
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
            var Indices=[], k, x, y,
                structureElement=self._structureElement, 
                matArea=structureElement.length, matRadius=self._dim, matHalfSide=(matRadius>>1);
            x=0; y=0; k=0;
            while (k<matArea)
            { 
                // allow a general structuring element instead of just a box
                if (structureElement[k])
                {
                    Indices.push(x-matHalfSide); 
                    Indices.push(y-matHalfSide);
                }
                k++; x++; if (x>=matRadius) { x=0; y++; }
            }
            self._indices = new A32I(Indices);
            
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
        
        // used for internal purposes
        ,_apply: function( im, w, h ) {
            var self = this;
            if ( !self._isOn || !self._dim || !self._filter )  return im;
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
            var 
                structureElement=self._structureElement,
                matArea=structureElement.length, //matRadius*matRadius,
                matRadius=self._dim, imageIndices=new A32I(self._indices), 
                imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
                i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
                coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
                bx=w-1, by=imArea-w
            ;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            for (k=0; k<coverArea2; k+=2)
            { 
                // translate to image dimensions
                // the y coordinate
                imageIndices[k+1]*=w;
            }
            
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the image pixels that
                // fall under the structure matrix
                rM=0; gM=0; bM=0; 
                for (j=0; j<coverArea; j+=2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                        if (r>rM) rM=r; if (g>gM) gM=g; if (b>bM) bM=b;
                    }
                }
                
                // output
                dst[i] = rM;  dst[i+1] = gM;  dst[i+2] = bM;  dst[i+3] = im[i+3];
            }
            return dst;
        }
        
        ,"erode": function( self, im, w, h ) {
            var 
                structureElement=self._structureElement,
                matArea=structureElement.length, //matRadius*matRadius,
                matRadius=self._dim, imageIndices=new A32I(self._indices), 
                imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
                i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
                coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
                bx=w-1, by=imArea-w
            ;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            for (k=0; k<coverArea2; k+=2)
            { 
                // translate to image dimensions
                // the y coordinate
                imageIndices[k+1]*=w;
            }
            
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the image pixels that
                // fall under the structure matrix
                rM=255; gM=255; bM=255; 
                for (j=0; j<coverArea; j+=2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                        if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                    }
                }
                
                // output
                dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            }
            return dst;
        }
        
        // dilation of erotion
        ,"open": function( self, im, w, h ) {
            var 
                structureElement=self._structureElement,
                matArea=structureElement.length, //matRadius*matRadius,
                matRadius=self._dim, imageIndices=new A32I(self._indices), 
                imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
                i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
                coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
                bx=w-1, by=imArea-w
            ;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            for (k=0; k<coverArea2; k+=2)
            { 
                // translate to image dimensions
                // the y coordinate
                imageIndices[k+1]*=w;
            }
            
            // erode step
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the image pixels that
                // fall under the structure matrix
                rM=255; gM=255; bM=255; 
                for (j=0; j<coverArea; j+=2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                        if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                    }
                }
                
                // output
                dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            }
            
            im = dst; dst = new IMG(imLen);
            
            // dilate step
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the image pixels that
                // fall under the structure matrix
                rM=255; gM=255; bM=255; 
                for (j=0; j<coverArea; j+=2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                        if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                    }
                }
                
                // output
                dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            }
            return dst;
        }
        
        // erotion of dilation
        ,"close": function( self, im, w, h ) {
            var 
                structureElement=self._structureElement,
                matArea=structureElement.length, //matRadius*matRadius,
                matRadius=self._dim, imageIndices=new A32I(self._indices), 
                imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
                i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
                coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
                bx=w-1, by=imArea-w
            ;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            for (k=0; k<coverArea2; k+=2)
            { 
                // translate to image dimensions
                // the y coordinate
                imageIndices[k+1]*=w;
            }
            
            // dilate step
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the image pixels that
                // fall under the structure matrix
                rM=255; gM=255; bM=255; 
                for (j=0; j<coverArea; j+=2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                        if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                    }
                }
                
                // output
                dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            }
            
            im = dst; dst = new IMG(imLen);
            
            // erode step
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the image pixels that
                // fall under the structure matrix
                rM=255; gM=255; bM=255; 
                for (j=0; j<coverArea; j+=2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                        if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                    }
                }
                
                // output
                dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            }
            return dst;
        }
    };
    
}(FILTER);