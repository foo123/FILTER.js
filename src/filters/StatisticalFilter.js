/**
*
* Statistical Filter(s)
*
* Applies statistical filtering/processing to target image
*
* @package FILTER.js
*
**/
(function(Class, FILTER, undef){
    
    // used for internal purposes
    var IMG=FILTER.ImArray, A32I=FILTER.Array32I,
        Min=Math.min, Max=Math.max;
        
    //
    //
    //  Statistical Filter
    var StatisticalFilter = FILTER.StatisticalFilter = Class( FILTER.Filter, {
        name : "StatisticalFilter",
        
        constructor : function() {
            this._dim = 0;
            this._indices = null;
            this._filter = null;
        },
        
        _dim : 0,
        _indices : null,
        _filter : null,
        
        median : function(d) { 
            // allow only odd dimensions for median
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            return this.set(d, MedianFilter);
        },
        
        minimum : function(d) { 
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            return this.set(d, MinimumFilter);
        },
        
        maximum : function(d) { 
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            return this.set(d, MaximumFilter);
        },
        
        set : function(d, filt) {
            this._filter = filt; 
            this._dim = d; 
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            var Indices=[], k, x, y,
                matArea=d*d, matRadius=d, matHalfSide=(matRadius>>1);
            x=0; y=0; k=0;
            while (k<matArea)
            { 
                Indices.push(x-matHalfSide); 
                Indices.push(y-matHalfSide);
                k++; x++; if (x>=matRadius) { x=0; y++; }
            }
            this._indices = new A32I(Indices);
            
            return this;
        },
        
        reset : function() {
            this._filter = null; this._dim = 0; this._indices = null;
            return this;
        },
        
        // used for internal purposes
        _apply : function(im, w, h) {
            if ( !this._isOn || !this._dim )  return im;
            return this._filter.call(this, im, w, h);
        },
        
        apply : function(image) {
            if ( this._isOn && this._dim )
            {
                var im = image.getSelectedData();
                return image.setSelectedData(this._filter.call(this, im[0], im[1], im[2], image));
            }
            return image;
        }
    });
    // aliiases
    StatisticalFilter.prototype.erode = StatisticalFilter.prototype.minimum;
    StatisticalFilter.prototype.dilate = StatisticalFilter.prototype.maximum;
    
    
    //
    //
    // private methods
    
    function MedianFilter(im, w, h) 
    {
        var 
            matRadius=this._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, 
            imageIndices=new A32I(this._indices),
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, j2, x, ty, xOff, yOff, srcOff, 
            rM, gM, bM, r, g, b,
            medianR, medianG, medianB, len, len2,
            isOdd, matArea2=matArea<<1, bx=w-1, by=imArea-w
        ;
        
        rM = []; //new Array(matArea);
        gM = []; //new Array(matArea);
        bM = []; //new Array(matArea);
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (j=0; j<matArea2; j+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[j+1]*=w;
        }
        
        i=0; x=0; ty=0; 
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            rM.length=0; gM.length=0; bM.length=0; 
            j=0; //j2=0;
            while (j < matArea2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2]; 
                    rM.push(r); gM.push(g); bM.push(b);
                }
                j+=2; //j2+=1;
            }
            
            // sort them, this is SLOW, alternative implementation needed
            rM.sort(); gM.sort(); bM.sort();
            len=rM.length; len2=len>>1;
            medianR=(len%2) ? rM[len2+1] : ~~(0.5*(rM[len2] + rM[len2+1]));
            len=gM.length; len2=len>>1;
            medianG=(len%2) ? gM[len2+1] : ~~(0.5*(gM[len2] + gM[len2+1]));
            len=bM.length; len2=len>>1;
            medianB=(len%2) ? bM[len2+1] : ~~(0.5*(bM[len2] + bM[len2+1]));
            
            // output
            dst[i] = medianR;  dst[i+1] = medianG;   dst[i+2] = medianB;  
            dst[i+3] = im[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    }
    
    function MaximumFilter(im, w, h) 
    {
        var 
            matRadius=this._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, 
            imageIndices=new A32I(this._indices),
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            matArea2=matArea<<1, bx=w-1, by=imArea-w
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (j=0; j<matArea2; j+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[j+1]*=w;
        }
        
        i=0; x=0; ty=0;
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            rM=0; gM=0; bM=0; 
            j=0;
            while (j < matArea2)
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
    }
    
    function MinimumFilter(im, w, h) 
    {
        var 
            matRadius=this._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, 
            imageIndices=new A32I(this._indices),
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            matArea2=matArea<<1, bx=w-1, by=imArea-w
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (j=0; j<matArea2; j+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[j+1]*=w;
        }
        
        i=0; x=0; ty=0;
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            rM=255; gM=255; bM=255; 
            j=0;
            while (j < matArea2)
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
    }
    
})(Class, FILTER);