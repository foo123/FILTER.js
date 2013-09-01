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
    
    //
    //
    //  Non-Linear Filter
    FILTER.NonLinearFilter=function(func)
    {
        this.func=func;
        this.isMedian=false;
        this.isMinimum=false;
        this.isMaximum=false;
        this.dim=0;
    };
    
    FILTER.NonLinearFilter.prototype={
        
        median : function(d) { 
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            this.isMedian=true; this.isMinimum=false; this.isMaximum=false; this.dim=d; return this; 
        },
        
        erode : function(d) { 
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            this.isMedian=false; this.isMinimum=true; this.isMaximum=false; this.dim=d; return this; 
        },
        
        dilate : function(d) { 
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            this.isMedian=false; this.isMinimum=false; this.isMaximum=true; this.dim=d; return this; 
        },
        
        // used for internal purposes
        _apply : function(src, sw, sh) {
            
            var side = this.dim, halfSide = side>>1, len=side*side,
                dst=new FILTER.ImArray(src.length),
                // pad output by the convolution matrix
                w = sw, h = sh,
                x, y, sx, sy, dstOff, a, cx, cy, scx, scy,
                srcOff, wt, ty, yh, scyw, r, g, b, rinit, ginit, binit, lenodd, t
                ;
                
            // init some values
            if (this.isMedian)
            {
                r=[]; g=[]; b=[];
                lenodd=len%2; t=~~(0.5*len)+lenodd
            }
            else if (this.isMaximum)
            {
                rinit=0; ginit=0; binit=0;
            }
            else if (this.isMinimum)
            {
                rinit=255; ginit=255; binit=255;
            }
            
            // apply the filter
            if (this.isMedian)
            {
                yh=0;
                for (y=0; y<h; y++) 
                {
                    for (x=0; x<w; x++) 
                    {
                        sy = y; sx = x;  dstOff = (yh+x)<<2;
                        // calculate the weighed sum of the source image pixels that
                        // fall under the convolution matrix
                        r.length=0; g.length=0; b.length=0; ty=0;
                        for (cy=0; cy<side; cy++) 
                        {
                            scy = sy + cy - halfSide;
                            if (scy >= 0 && scy < sh)
                            {
                                scyw=scy*sw;
                                for (cx=0; cx<side; cx++) 
                                {
                                    scx = sx + cx - halfSide;
                                    if (scx >= 0 && scx < sw) 
                                    {
                                        srcOff = (scyw + scx)<<2;
                                        r.push(src[srcOff]); g.push(src[srcOff+1]); b.push(src[srcOff+2]);
                                    }
                                }
                            }
                            ty+=side;
                        }
                        // take the median
                        r.sort(); g.sort(); b.sort();
                        if (lenodd) // odd, take median
                        {
                            dst[dstOff] = r[t];  dst[dstOff+1] = g[t];
                            dst[dstOff+2] = b[t];
                        }
                        else // even, take average
                        {
                            dst[dstOff] = ~~(0.5*(r[t]+r[t+1]));  dst[dstOff+1] = ~~(0.5*(g[t]+g[t+1]));
                            dst[dstOff+2] = ~~(0.5*(b[t]+b[t+1]));
                        }
                        dst[dstOff+3] = src[dstOff+3];
                    }
                    yh+=w;
                }
                return dst;
            }
            else if (this.isMinimum || this.isMaximum)
            {
                yh=0;
                for (y=0; y<h; y++) 
                {
                    for (x=0; x<w; x++) 
                    {
                        sy = y; sx = x;  dstOff = (yh+x)<<2;
                        // calculate the weighed sum of the source image pixels that
                        // fall under the convolution matrix
                        r=rinit; g=ginit; b=binit;  ty=0;
                        for (cy=0; cy<side; cy++) 
                        {
                            scy = sy + cy - halfSide;
                            if (scy >= 0 && scy < sh)
                            {
                                scyw=scy*sw;
                                for (cx=0; cx<side; cx++) 
                                {
                                    scx = sx + cx - halfSide;
                                    if (scx >= 0 && scx < sw) 
                                    {
                                        srcOff = (scyw + scx)<<2;
                                        if (this.isMaximum)
                                        {
                                            if (src[srcOff]>r) r=src[srcOff];
                                            if (src[srcOff+1]>g) g=src[srcOff+1];
                                            if (src[srcOff+2]>b) b=src[srcOff+2];
                                        }
                                        else
                                        {
                                            if (src[srcOff]<r) r=src[srcOff];
                                            if (src[srcOff+1]<g) g=src[srcOff+1];
                                            if (src[srcOff+2]<b) b=src[srcOff+2];
                                        }
                                    }
                                }
                            }
                            ty+=side;
                        }
                        dst[dstOff] = r;  dst[dstOff+1] = g;
                        dst[dstOff+2] = b;
                        dst[dstOff+3] = src[dstOff+3];
                    }
                    yh+=w;
                }
                return dst;
            }
            return src;
        },
        
        apply : function(image) {
            return image.setData(this._apply(image.getData(), image.width, image.height));
        },
        
        reset : function() {
            this.isMedian=false; this.isMinimum=false; this.isMaximum=false; this.dim=0; return this;
        }
    };
    
})(FILTER);