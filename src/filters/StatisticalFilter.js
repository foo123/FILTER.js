/**
*
* Statistical Filter(s)
*
* Applies statistical filtering/processing to target image
*
* @package FILTER.js
*
**/
(function(FILTER){
    
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
    
    /*function peek() { return this[0]; }
    function peekReverse() { return this[this.length-1]; }*/
    /*function empty() { this.length=0; return this; }
    function poll() { return this.shift(); }
    function pollReverse() { return this.pop(); }
    function bisectInsert(val)
    {
        var l=this.length, middle, upper, lower;
        
        if (0==l) { this.push(val); return this; }
        else if (1==l) { if (val>=this[0]) this.push(val); else this.unshift(val); return this; }
        
        lower=0; upper=l; middle=((upper-lower)>>1) + lower;
        while (lower<upper)
        {
            if (val>this[middle])   lower=middle+1;
            else  upper=middle;
            middle=((upper-lower)>>1) + lower;
        }
        if (middle>=l) this.push(val);
        else this.splice(middle, 0, val);
        return this;
    }
    function bisectInsertReverse(val)
    {
        var l=this.length, middle, upper, lower;
        
        if (0==l) { this.push(val); return this; }
        else if (1==l) { if (val<this[0]) this.push(val); else this.unshift(val); return this; }
        
        lower=0; upper=l; middle=((upper-lower)>>1) + lower;
        while (lower<upper)
        {
            if (val<this[middle])   lower=middle+1;
            else  upper=middle;
            middle=((upper-lower)>>1) + lower;
        }
        if (middle>=l) this.push(val);
        else this.splice(middle, 0, val);
        return this;
    }
    */
    // used for internal purposes
    var IMG = FILTER.ImArray, 
        Min=Math.min, Max=Math.max;
        
    var
        _MedianFilter = function(src, w, h) {
        
        var 
            matRadius=this._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, hsw=matHalfSide*w,
            imageIndices=new FILTER.Array32I(matArea<<1),
            imArea=w*h, imLen=src.length, dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, 
            rM=[], gM=[], bM=[], r, g, b,
            medianR, medianG, medianB, len, len2,
            isOdd, matArea2=matArea<<1, bx=w-1, by=imArea-w
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        j=0; x=0; ty=0;
        while (j<matArea2)
        { 
            imageIndices[j] = x-matHalfSide; imageIndices[j+1] = ty-hsw;
            j+=2; x++; if (x>=matRadius) { x=0; ty+=w; }
        } 
        
        i=0; x=0; ty=0; 
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            rM.length=0; gM.length=0; bM.length=0; 
            j=0;
            while (j < matArea2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=src[srcOff]; g=src[srcOff+1]; b=src[srcOff+2]; 
                    rM.push(r); gM.push(g); bM.push(b);
                }
                j+=2;
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
            dst[i+3] = src[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    },
    /*
    _MedianFilter2 = function(src, w, h) {
        
        var 
            matRadius=this._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, hsw=matHalfSide*w,
            imageIndices=new FILTER.Array32I(matArea<<1),
            imArea=w*h, imLen=src.length, dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, 
            rL=[], gL=[], bL=[], rH=[], gH=[], bH=[], r, g, b,
            medianR, medianG, medianB, low, upper, diff,
            /*isOdd,* / matArea2=matArea<<1, bx=w-1, by=imArea-w
            ;
        
        // add extra methods
        rL.insert=bisectInsertReverse; gL.insert=bisectInsertReverse;   bL.insert=bisectInsertReverse;
        rH.insert=bisectInsert;  gH.insert=bisectInsert;  bH.insert=bisectInsert;
        rL.remove=pollReverse; gL.remove=pollReverse;  bL.remove=pollReverse;
        rH.remove=poll; gH.remove=poll;  bH.remove=poll;
        rL.empty=empty; gL.empty=empty; bL.empty=empty; 
        rH.empty=empty; gH.empty=empty; bH.empty=empty; 
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        j=0; x=0; ty=0;
        while (j<matArea2)
        { 
            imageIndices[j] = x-matHalfSide; imageIndices[j+1] = ty-hsw;
            j+=2; x++; if (x>=matRadius) { x=0; ty+=w; }
        } 
        
        i=0; x=0; ty=0; 
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            rL.length=0; gL.length=0; bL.length=0; 
            rH.length=0; gH.length=0; bH.length=0;
            init=true;  j=0;
            while (j < matArea2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=src[srcOff]; g=src[srcOff+1]; b=src[srcOff+2]; 
                    if (init)
                    {
                        rH.push(r); gH.push(g); bH.push(b);
                        init=false;
                    }
                    else
                    {
                        // maintain sorted lists of higher and lower values
                        if (r>=rH[0]) rH.insert(r); else rL.insert(r);
                        if (g>=gH[0]) gH.insert(g); else gL.insert(g);
                        if (b>=bH[0]) bH.insert(b); else bL.insert(b);
                        
                        // balance the lists if needed
                        diff=rH.length-rL.length;
                        if (diff>=2)  rL.insert(rH.remove());
                        else if (diff<=-2)  rH.insert(rL.remove());
                        
                        diff=gH.length-gL.length;
                        if (diff>=2)  gL.insert(gH.remove());
                        else if (diff<=-2)  gH.insert(gL.remove());
                        
                        diff=bH.length-bL.length;
                        if (diff>=2)  bL.insert(bH.remove());
                        else if (diff<=-2)  bH.insert(bL.remove());
                    }
                }
                j+=2;
            }
            
            // sort them, this is SLOW, alternative implementation needed
            //rM.sort(); gM.sort(); bM.sort();
            //median=(rM.length>>1)+1; isOdd=rM.length%2;
            
            low=rL.length; upper=rH.length;
            if (upper==low)  medianR=~~(0.5*(rL[low-1] + rH[0]));
            else if (upper>low) medianR=rH[0];
            else medianR=rL[low-1];
            
            low=gL.length; upper=gH.length;
            if (upper==low)  medianG=~~(0.5*(gL[low-1] + gH[0]));
            else if (upper>low) medianG=gH[0];
            else medianG=gL[low-1];
            
            low=bL.length; upper=bH.length;
            if (upper==low)  medianB=~~(0.5*(bL[low-1] + bH[0]));
            else if (upper>low) medianB=bH[0];
            else medianB=bL[low-1];
            
            // output
            dst[i] = medianR;  dst[i+1] = medianG;   dst[i+2] = medianB;  
            dst[i+3] = src[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    },
    */
    // used for internal purposes
    _MaximumFilter = function(src, w, h) {
        
        var 
            matRadius=this._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, hsw=matHalfSide*w,
            imageIndices=new FILTER.Array32I(matArea<<1),
            imArea=w*h, imLen=src.length, dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            matArea2=matArea<<1, bx=w-1, by=imArea-w
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        x=0; ty=0; j=0;
        while (j<matArea2)
        { 
            imageIndices[j] = (x-matHalfSide); imageIndices[j+1] = (ty-hsw);
            j+=2; x++; if (x>=matRadius) { x=0; ty+=w; }
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
    /*
    // used for internal purposes
    _MaximumFilter2 = function(src, w, h) {
        
        var 
            matRadius=this._dim, matArea=matRadius*matRadius, 
            matHalfSideX, matHalfSideY, matOffsetLeft, matOffsetTop, matOffsetRight, matOffsetBottom,
            imArea=w*h, imLen=src.length, dst=new IMG(imLen),
            i, j, x, ty, xOff1, yOff1, xOff2, yOff2, srcOff, rM, gM, bM,
            p1, p2, p3, p4, bx1, by1, bx2, by2,
            integralmax, intLen, mR, mG, mB
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        matHalfSideX=matRadius>>1;  matHalfSideY=w*(matRadius>>1);
        // one additional offest needed due to integral computation
        matOffsetLeft = -matHalfSideX-1; matOffsetTop = -matHalfSideY-w;
        matOffsetRight = matHalfSideX; matOffsetBottom = matHalfSideY;

        intLen=(imArea<<1)+imArea;  rowLen=(w<<1)+w;
        integralmax=new FILTER.Array32F(intLen);
        bx1=0; bx2=w-1; by1=0; by2=imArea-w;
        
        // compute maximum integral image in one pass
        // first row
        i=0; j=0; x=0;  mR=mG=mB=0;
        while (x<w)
        {
            if (src[i]>mR) mR=src[i];
            if (src[i+1]>mG) mG=src[i+1];
            if (src[i+2]>mB) mB=src[i+2];
            
            if (x>0)
            {
                integralmax[j]=mR - integralmax[j-3]; 
                integralmax[j+1]=mG - integralmax[j-2]; 
                integralmax[j+2]=mB - integralmax[j-1];
            }
            else
            {
                integralmax[j]=mR; 
                integralmax[j+1]=mG; 
                integralmax[j+2]=mB;
            }
            i+=4; j+=3; x++;
        }
        // other rows
        i=rowLen+w; j=rowLen; x=0; mR=mG=mB=0;
        while (i<imLen)
        {
            if (src[i]>mR) mR=src[i];
            if (src[i+1]>mG) mG=src[i+1];
            if (src[i+2]>mB) mB=src[i+2];
            
            if (x>0)
            {
                integralmax[j]=mR - integralmax[j-rowLen] - integralmax[j-3]; 
                integralmax[j+1]=mG - integralmax[j-rowLen+1] - integralmax[j-2]; 
                integralmax[j+2]=mB - integralmax[j-rowLen+2] - integralmax[j-1];
            }
            else
            {
                integralmax[j]=mR - integralmax[j-rowLen]; 
                integralmax[j+1]=mG - integralmax[j-rowLen+1]; 
                integralmax[j+2]=mB - integralmax[j-rowLen+2];
            }
            i+=4; j+=3; x++; if (x>=w) { x=0; mR=mG=mB=0; }
        }
        
        i=0; x=0; ty=0;
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
            xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;
            
            // fix borders
            if (xOff1<bx1) xOff1=bx1;
            else if (xOff2>bx2) xOff2=bx2;
            if (yOff1<by1) yOff1=by1;
            else if (yOff2>by2) yOff2=by2;
            
            // compute integral positions
            p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
            // arguably faster way to write p1*=3; etc..
            p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
            rM = integralmax[p4] - integralmax[p2] - integralmax[p3] + integralmax[p1];
            gM = integralmax[p4+1] - integralmax[p2+1] - integralmax[p3+1] + integralmax[p1+1];
            bM = integralmax[p4+2] - integralmax[p2+2] - integralmax[p3+2] + integralmax[p1+2];            
            // output
            dst[i] = ~~rM;  dst[i+1] = ~~gM;  dst[i+2] = ~~bM;  dst[i+3] = src[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    },
    */
    // used for internal purposes
    _MinimumFilter = function(src, w, h) {
        
        var 
            matRadius=this._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, hsw=matHalfSide*w,
            imageIndices=new FILTER.Array32I(matArea<<1),
            imArea=w*h, imLen=src.length, dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            matArea2=matArea<<1, bx=w-1, by=imArea-w
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        x=0; ty=0; j=0;
        while (j<matArea2)
        { 
            imageIndices[j] = (x-matHalfSide); imageIndices[j+1] = (ty-hsw);
            j+=2; x++; if (x>=matRadius) { x=0; ty+=w; }
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
    /*
    // used for internal purposes
    _MinimumFilter2 = function(src, w, h) {
        
        var 
            matRadius=this._dim, matArea=matRadius*matRadius, 
            matHalfSideX, matHalfSideY, matOffsetLeft, matOffsetTop, matOffsetRight, matOffsetBottom,
            imArea=w*h, imLen=src.length, dst=new IMG(imLen),
            i, j, x, ty, xOff1, yOff1, xOff2, yOff2, srcOff, rM, gM, bM,
            p1, p2, p3, p4, bx1, by1, bx2, by2,
            integralmax, intLen, mR, mG, mB
            ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        matHalfSideX=matRadius>>1;  matHalfSideY=w*(matRadius>>1);
        // one additional offest needed due to integral computation
        matOffsetLeft = -matHalfSideX-1; matOffsetTop = -matHalfSideY-w;
        matOffsetRight = matHalfSideX; matOffsetBottom = matHalfSideY;

        intLen=(imArea<<1)+imArea;  rowLen=(w<<1)+w;
        integralmax=new FILTER.Array32F(intLen);
        bx1=0; bx2=w-1; by1=0; by2=imArea-w;
        
        // compute maximum integral image in one pass
        // first row
        i=0; j=0; x=0;  mR=mG=mB=255;
        while (x<w)
        {
            if (src[i]<mR) mR=src[i];
            if (src[i+1]<mG) mG=src[i+1];
            if (src[i+2]<mB) mB=src[i+2];
            
            if (x>0)
            {
                integralmax[j]=mR - integralmax[j-3]; 
                integralmax[j+1]=mG - integralmax[j-2]; 
                integralmax[j+2]=mB - integralmax[j-1];
            }
            else
            {
                integralmax[j]=mR; 
                integralmax[j+1]=mG; 
                integralmax[j+2]=mB;
            }
            i+=4; j+=3; x++;
        }
        // other rows
        i=rowLen+w; j=rowLen; x=0; mR=mG=mB=255;
        while (i<imLen)
        {
            if (src[i]<mR) mR=src[i];
            if (src[i+1]<mG) mG=src[i+1];
            if (src[i+2]<mB) mB=src[i+2];
            
            if (x>0)
            {
                integralmax[j]=mR - integralmax[j-rowLen] - integralmax[j-3]; 
                integralmax[j+1]=mG - integralmax[j-rowLen+1] - integralmax[j-2]; 
                integralmax[j+2]=mB - integralmax[j-rowLen+2] - integralmax[j-1];
            }
            else
            {
                integralmax[j]=mR - integralmax[j-rowLen]; 
                integralmax[j+1]=mG - integralmax[j-rowLen+1]; 
                integralmax[j+2]=mB - integralmax[j-rowLen+2];
            }
            i+=4; j+=3; x++; if (x>=w) { x=0; mR=mG=mB=255; }
        }
        
        i=0; x=0; ty=0;
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
            xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;
            
            // fix borders
            if (xOff1<bx1) xOff1=bx1;
            else if (xOff2>bx2) xOff2=bx2;
            if (yOff1<by1) yOff1=by1;
            else if (yOff2>by2) yOff2=by2;
            
            // compute integral positions
            p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
            // arguably faster way to write p1*=3; etc..
            p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
            rM = integralmax[p4] - integralmax[p2] - integralmax[p3] + integralmax[p1];
            gM = integralmax[p4+1] - integralmax[p2+1] - integralmax[p3+1] + integralmax[p1+1];
            bM = integralmax[p4+2] - integralmax[p2+2] - integralmax[p3+2] + integralmax[p1+2];            
            // output
            dst[i] = ~~rM;  dst[i+1] = ~~gM;  dst[i+2] = ~~bM;  dst[i+3] = src[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    },
    */
    // used for internal purposes
    _dummy = function(src, sw, sh) {
        return src;
    }
    ;
        
    //
    //
    //  Statistical Filter
    FILTER.StatisticalFilter=function()
    {
        this._dim=0;
        this._apply=_dummy;
    };
    
    FILTER.StatisticalFilter.prototype={
        
        constructor: FILTER.StatisticalFilter,
        
        _dim: 0,
        
        median : function(d) { 
            // allow only odd dimensions for median
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            this._dim=d; this._apply=_MedianFilter; return this;
        },
        
        /*median2 : function(d) { 
            // allow only odd dimensions for median
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            this._dim=d; this._apply=_MedianFilter2; return this;
        },*/
        
        minimum : function(d) { 
            d=(typeof d == 'undefined') ? 3 : d;
            this._dim=d; this._apply=_MinimumFilter; return this; 
        },
        
        maximum : function(d) { 
            d=(typeof d == 'undefined') ? 3 : d;
            this._dim=d; this._apply=_MaximumFilter; return this; 
        },
        
        // used for internal purposes
        _apply : function(src, sw, sh) {
            return src;
        },
        
        apply : function(image) {
            if (!this._dim)  return image;
            return image.setData(this._apply(image.getData(), image.width, image.height, image));
        },
        
        reset : function() {
            this._apply=_dummy; this._dim=0; return this;
        }
    };
    
})(FILTER);