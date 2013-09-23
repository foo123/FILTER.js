/**
*
* Morphological Filter(s)
*
* Applies morphological processing to target image
*
* @package FILTER.js
*
**/
(function(FILTER){
    
    // used for internal purposes
    var IMG = FILTER.ImArray, STRUCT = FILTER.Array8U,
        Min=Math.min, Max=Math.max, Sqrt=Math.sqrt;
        
    var
    // used for internal purposes
    _DilateFilter = function(src, w, h) {
        
        var 
            matRadius=this._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, hsw=matHalfSide*w,
            imageIndices, structureElement=this.structureElement,
            imArea=w*h, imLen=src.length, dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            coverArea, bx=w-1, by=imArea-w
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        imageIndices=[];
        x=0; ty=0; k=0;
        while (k<matArea)
        { 
            // allow a general structuring element instead of just a box
            if (structureElement[k])
            {
                imageIndices.push(x-matHalfSide); imageIndices.push(ty-hsw);
            }
            k++; x++; if (x>=matRadius) { x=0; ty+=w; }
        }
        imageIndices=new FILTER.Array32I(imageIndices);
        coverArea=imageIndices.length;
        
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
                    r=src[srcOff]; g=src[srcOff+1]; b=src[srcOff+2];
                    if (r>rM) rM=r; if (g>gM) gM=g; if (b>bM) bM=b;
                }
                j+=2;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM;  dst[i+2] = bM;  dst[i+3] = src[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    },
    // used for internal purposes
    _ErodeFilter = function(src, w, h) {
        
        var 
            matRadius=this._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, hsw=matHalfSide*w,
            imageIndices, structureElement=this.structureElement,
            imArea=w*h, imLen=src.length, dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            coverArea, bx=w-1, by=imArea-w
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        imageIndices=[];
        x=0; ty=0; k=0;
        while (k<matArea)
        { 
            // allow a general structuring element instead of just a box
            if (structureElement[k])
            {
                imageIndices.push(x-matHalfSide); imageIndices.push(ty-hsw);
            }
            k++; x++; if (x>=matRadius) { x=0; ty+=w; }
        }
        imageIndices=new FILTER.Array32I(imageIndices);
        coverArea=imageIndices.length;
        
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
                    r=src[srcOff]; g=src[srcOff+1]; b=src[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
                j+=2;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = src[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    },
    // used for internal purposes
    _dummy = function(src, sw, sh) {
        return src;
    }
    ;
    
    // return a box structure element
    function box(d)
    {
        var i, size=d*d, ones=new STRUCT(size);
        for (i=0; i<size; i++) ones[i]=1;
        return ones;
    }
    
    var box3=box(3);
    
    //
    //
    //  Morphological Filter
    FILTER.MorphologicalFilter=function()
    {
        this._dim=0;
        this.structureElement=null;
        this._apply=_dummy;
    };
    
    FILTER.MorphologicalFilter.prototype={
        
        constructor: FILTER.MorphologicalFilter,
        
        _dim: 0,
        
        structureElement: null, 
        
        erode : function(structureElement) { 
            this.set(structureElement);
            this._apply=_ErodeFilter; return this; 
        },
        
        dilate : function(structureElement) { 
            this.set(structureElement);
            this._apply=_DilateFilter; return this; 
        },
        
        // used for internal purposes
        _apply : function(src, sw, sh) {
            return src;
        },
        
        apply : function(image) {
            if (!this._dim)  return image;
            return image.setData(this._apply(image.getData(), image.width, image.height, image));
        },
        
        set: function(structureElement) {
            if (structureElement && structureElement.length)
            {
                // structure Element given
                this.structureElement = new STRUCT(structureElement);
                this._dim=~~(Sqrt(this.structureElement.length)+0.5);
            }
            else if (structureElement && structureElement===(structureElement-0))
            {
                // dimension given
                this.structureElement = box(structureElement);
                this._dim=structureElement;
            }
            else
            {
                // default
                this.structureElement = box3;
                this._dim=3;
            }
            return this;
        },
        
        reset : function() {
            this._apply=_dummy; this._dim=0; this.structureElement=null; return this;
        }
    };
    
})(FILTER);