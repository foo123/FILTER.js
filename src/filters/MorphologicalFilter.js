/**
*
* Morphological Filter(s)
*
* Applies morphological processing to target image
*
* @package FILTER.js
*
**/
(function(FILTER, undef){
    
    // used for internal purposes
    var IMG = FILTER.ImArray, STRUCT = FILTER.Array8U, A32I = FILTER.Array32I,
        /*Min=Math.min, Max=Math.max,*/ Sqrt=Math.sqrt;
        
    var
    // used for internal purposes
    _DilateFilter = function(im, w, h) {
        
        var 
            structureElement=this._structureElement,
            matArea=structureElement.length, //matRadius*matRadius,
            matRadius=this._dim, imageIndices=new A32I(this._indices), 
            imArea=w*h, imLen=im.length, dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
            bx=w-1, by=imArea-w
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        k=0;
        while (k<coverArea2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[k+1]*=w;
            k+=2;
        }
        
        i=0; x=0; ty=0;
        while (i<imLen)
        {
            // calculate the image pixels that
            // fall under the structure matrix
            rM=0; gM=0; bM=0; 
            j=0;
            while (j < coverArea)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r>rM) rM=r; if (g>gM) gM=g; if (b>bM) bM=b;
                }
                j+=2;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM;  dst[i+2] = bM;  dst[i+3] = im[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    },
    // used for internal purposes
    _ErodeFilter = function(im, w, h) {
        
        var 
            structureElement=this._structureElement,
            matArea=structureElement.length, //matRadius*matRadius,
            matRadius=this._dim, imageIndices=new A32I(this._indices), 
            imArea=w*h, imLen=im.length, dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
            bx=w-1, by=imArea-w
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        k=0;
        while (k<coverArea2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[k+1]*=w;
            k+=2;
        }
        
        i=0; x=0; ty=0;
        while (i<imLen)
        {
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            j=0;
            while (j < coverArea)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
                j+=2;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    },
    // dilation of erotion
    _OpenFilter=function(im, w, h){
        
        var 
            structureElement=this._structureElement,
            matArea=structureElement.length, //matRadius*matRadius,
            matRadius=this._dim, imageIndices=new A32I(this._indices), 
            imArea=w*h, imLen=im.length, dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
            bx=w-1, by=imArea-w
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        k=0;
        while (k<coverArea2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[k+1]*=w;
            k+=2;
        }
        
        // erode step
        i=0; x=0; ty=0;
        while (i<imLen)
        {
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            j=0;
            while (j < coverArea)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
                j+=2;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        
        im = dst; dst = new IMG(imLen);
        
        // dilate step
        i=0; x=0; ty=0;
        while (i<imLen)
        {
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            j=0;
            while (j < coverArea)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
                j+=2;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    },
    // erotion of dilation
    _CloseFilter=function(im, w, h){
        
        var 
            structureElement=this._structureElement,
            matArea=structureElement.length, //matRadius*matRadius,
            matRadius=this._dim, imageIndices=new A32I(this._indices), 
            imArea=w*h, imLen=im.length, dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
            bx=w-1, by=imArea-w
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        k=0;
        while (k<coverArea2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[k+1]*=w;
            k+=2;
        }
        
        // dilate step
        i=0; x=0; ty=0;
        while (i<imLen)
        {
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            j=0;
            while (j < coverArea)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
                j+=2;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        
        im = dst; dst = new IMG(imLen);
        
        // erode step
        i=0; x=0; ty=0;
        while (i<imLen)
        {
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            j=0;
            while (j < coverArea)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
                j+=2;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    },
    
    
    // return a box structure element
    box = function(d) {
        var i, size=d*d, ones=new STRUCT(size);
        for (i=0; i<size; i++) ones[i]=1;
        return ones;
    },
    
    box3 = box(3)
    ;
    
    
    //
    //
    //  Morphological Filter
    var MorphologicalFilter = FILTER.MorphologicalFilter = FILTER.Extends( FILTER.Filter,
    {
        
        name : "MorphologicalFilter",
        
        constructor : function() {
            this._filter = null;
            this._dim = 0;
            this._structureElement = null;
            this._indices = null;
        },
        
        _filter : null,
        _dim : 0,
        _structureElement : null, 
        _indices : null,
        
        erode : function(structureElement) { 
            return this.set(structureElement, _ErodeFilter);
        },
        
        dilate : function(structureElement) { 
            return this.set(structureElement, _DilateFilter);
        },
        
        opening : function(structureElement) { 
            return this.set(structureElement, _OpenFilter);
        },
        
        closing : function(structureElement) { 
            return this.set(structureElement, _CloseFilter);
        },
        
        set : function(structureElement, filt) {
            this._filter = filt;
            if (structureElement && structureElement.length)
            {
                // structure Element given
                this._structureElement = new STRUCT(structureElement);
                this._dim = ~~(Sqrt(this._structureElement.length)+0.5);
            }
            else if (structureElement && structureElement===(structureElement-0))
            {
                // dimension given
                this._structureElement = box(structureElement);
                this._dim = structureElement;
            }
            else
            {
                // default
                this._structureElement = box3;
                this._dim = 3;
            }
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            var Indices=[], k, x, y,
                structureElement=this._structureElement, 
                matArea=structureElement.length, matRadius=this._dim, matHalfSide=(matRadius>>1);
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
            this._indices=new A32I(Indices);
            
            return this;
        },
        
        reset : function() {
            this._filter = null; this._dim = 0; this._structureElement = null; this._indices = null;
            return this;
        },
        
        // used for internal purposes
        _apply : function(im, w, h) {
            if ( !this._isOn || !this._dim || !this._filter )  return im;
            return this._filter.call(this, im, w, h);
        },
        
        apply : function(image) {
            if ( this._isOn && this._dim && this._filter )
                return image.setData(this._filter.call(this, image.getData(), image.width, image.height, image));
            return image;
        }
    });
    
})(FILTER);