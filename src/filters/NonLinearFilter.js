/**
*
* Non-Linear Filter(s)
*
* Applies non-linear filtering/processing to target image
*
* @package FILTER.js
*
**/
(function(FILTER){
    
    // used for internal purposes
    var Min=Math.min, Max=Math.max;
    /*
    function split(a, n, x, i,j)
    {
        //do the left and right scan until the pointers cross
        do
        {
            //scan from the left then scan from the right
            while (a[i] < x) i++;
            while (x < a[j]) j--;
            //now swap values if they are in the wrong part:
            if (i <= j)
            {
                var t = a[i];
                a[i] = a[j];
                a[j] = t;
                i++; j--;
            }

            //and continue the scan until the pointers cross:
        } while (i <= j);
        return {a:a, i:i, j:j};
    }

    //A function that makes use of the basic split method to find the median is:

    function median(a/*, n, k* /)
    {
        var n=a.length, L = 0, R = n-1, k = ~~(0.5*n), i, j, x, ret;
        while (L < R)
        {
            x = a[k];  i = L; j = R;  
            ret=split(a, n, x, i, j);
            i.ret.i; j=ret.j;
            if (j < k)  L = i;
            if (k < i)  R = j; 
        }
        return x;
    }
    */
    
    var
        _MedianFilter = function(src, w, h) {
        
        var 
            matRadius=this.dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, hsw=matHalfSide*w,
            imageIndices=new FILTER.Array32I(matArea<<1),
            imArea=w*h, imLen=src.length, dst=new FILTER.ImArray(imLen),
            i, j, k, x, y, ty, ty2, xOff, yOff, srcOff, dstOff, rM=[], gM=[], bM=[],
            median, isOdd
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        i=0; j=0; x=0; y=0; ty=0;
        while (i<matArea)
        { 
            imageIndices[j] = x-matHalfSide; imageIndices[j+1] = ty-hsw;
            i++; j+=2; x++; if (x>=matRadius) { x=0; y++; ty+=w; }
        } 
        
        i=0; x=0; y=0; ty=0;
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            rM.length=0; gM.length=0; bM.length=0; 
            j=0; k=0;
            while (j < matArea)
            {
                xOff=x + imageIndices[k]; yOff=ty + imageIndices[k+1];
                if (xOff>=0 && xOff<w && yOff>=0 && yOff<imArea)
                {
                    srcOff=(xOff + yOff)<<2;
                    rM.push(src[srcOff]); gM.push(src[srcOff+1]); bM.push(src[srcOff+2]);
                }
                /*else
                {
                    rM.push(0); gM.push(0); bM.push(0);
                }*/
                j++; k+=2;
            }
            
            // sort them, this is SLOW, alternative implementation needed
            rM.sort(); gM.sort(); bM.sort();
            median=(rM.length>>1)+1; isOdd=rM.length%2;
            
            // output
            dstOff = i;
            if (isOdd)
            {
                dst[dstOff] = rM[median];  dst[dstOff+1] = gM[median];
                dst[dstOff+2] = bM[median];  dst[dstOff+3] = src[dstOff+3];
            }
            else
            {
                dst[dstOff] = ~~(0.5*(rM[median-1] + rM[median]));  dst[dstOff+1] = ~~(0.5*(gM[median-1] + gM[median]));
                dst[dstOff+2] = ~~(0.5*(bM[median-1] + bM[median]));  dst[dstOff+3] = src[dstOff+3];
            }
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; y++; ty+=w; }
        }
        return dst;
    },
    
    // used for internal purposes
    _MaximumFilter = function(src, w, h) {
        
        var 
            matRadius=this.dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, hsw=matHalfSide*w,
            imageIndices=new FILTER.Array32I(matArea<<1),
            imArea=w*h, imLen=src.length, dst=new FILTER.ImArray(imLen),
            i, j, k, x, y, ty, ty2, xOff, yOff, srcOff, dstOff, r, g, b, rM, gM, bM
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        i=0; j=0; x=0; y=0; ty=0;
        while (i<matArea)
        { 
            imageIndices[j] = x-matHalfSide; imageIndices[j+1] = ty-hsw;
            i++; j+=2; x++; if (x>=matRadius) { x=0; y++; ty+=w; }
        } 
        
        i=0; x=0; y=0; ty=0;
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            rM=0; gM=0; bM=0; 
            j=0; k=0;
            while (j < matArea)
            {
                xOff=x + imageIndices[k]; yOff=ty + imageIndices[k+1];
                if (xOff>=0 && xOff<w && yOff>=0 && yOff<imArea)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=src[srcOff]; g=src[srcOff+1]; b=src[srcOff+2];
                    if (r>rM) rM=r; if (g>gM) gM=g; if (b>bM) bM=b;
                }
                j++; k+=2;
            }
            
            // output
            dstOff = i;
            dst[dstOff] = rM;  dst[dstOff+1] = gM;
            dst[dstOff+2] = bM;  dst[dstOff+3] = src[dstOff+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; y++; ty+=w; }
        }
        return dst;
    },
    
    // used for internal purposes
    _MinimumFilter = function(src, w, h) {
        
        var 
            matRadius=this.dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, hsw=matHalfSide*w,
            imageIndices=new FILTER.Array32I(matArea<<1),
            imArea=w*h, imLen=src.length, dst=new FILTER.ImArray(imLen),
            i, j, k, x, y, ty, ty2, xOff, yOff, srcOff, dstOff, r, g, b, rM, gM, bM
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        i=0; j=0; x=0; y=0; ty=0;
        while (i<matArea)
        { 
            imageIndices[j] = x-matHalfSide; imageIndices[j+1] = ty-hsw;
            i++; j+=2; x++; if (x>=matRadius) { x=0; y++; ty+=w; }
        } 
        
        i=0; x=0; y=0; ty=0;
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            rM=255; gM=255; bM=255; 
            j=0; k=0;
            while (j < matArea)
            {
                xOff=x + imageIndices[k]; yOff=ty + imageIndices[k+1];
                if (xOff>=0 && xOff<w && yOff>=0 && yOff<imArea)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=src[srcOff]; g=src[srcOff+1]; b=src[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
                j++; k+=2;
            }
            
            // output
            dstOff = i;
            dst[dstOff] = rM;  dst[dstOff+1] = gM;
            dst[dstOff+2] = bM;  dst[dstOff+3] = src[dstOff+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; y++; ty+=w; }
        }
        return dst;
    },
    
    // used for internal purposes
    _dummy = function(src, sw, sh) {
        return src;
    }
    ;
        
    //
    //
    //  Non-Linear Filter
    FILTER.NonLinearFilter=function()
    {
        this.dim=0;
        this._apply=_dummy;
    };
    
    FILTER.NonLinearFilter.prototype={
        
        dim: 0,
        
        median : function(d) { 
            // allow only odd dimensions for median
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            this.dim=d; this._apply=_MedianFilter; return this;
        },
        
        erode : function(d) { 
            d=(typeof d == 'undefined') ? 3 : d;
            this.dim=d; this._apply=_MinimumFilter; return this; 
        },
        
        dilate : function(d) { 
            d=(typeof d == 'undefined') ? 3 : d;
            this.dim=d; this._apply=_MaximumFilter; return this; 
        },
        
        // used for internal purposes
        _apply : function(src, sw, sh) {
            return src;
        },
        
        apply : function(image) {
            if (!this.dim)  return image;
            return image.setData(this._apply(image.getData(), image.width, image.height));
        },
        
        reset : function() {
            this._apply=_dummy; this.dim=0; return this;
        }
    };
    
})(FILTER);