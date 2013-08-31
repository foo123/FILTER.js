/**
*
* Non-Linear Filter(s)
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
        this.dim=0;
    };
    
    FILTER.NonLinearFilter.prototype={
        
        median : function(d) { this.isMedian=true; this.dim=d; return this; },
        
        apply : function(image) {
            
            if (this.isMedian)
            {
                var side = this.dim, halfSide = side>>1, len=side*side,
                    data=image.getPixelData(),  src = data.data, sw = data.width, sh = data.height,
                    newi=FILTER.static.createImageData(sw,sh), dst=newi.data,
                    // pad output by the convolution matrix
                    w = sw, h = sh,
                    x, y, sx, sy, dstOff, r=[], g=[], b=[], a, cx, cy, scx, scy,
                    srcOff, wt, ty, yh, scyw, t
                    ;
                
                yh=0;
                for (y=0; y<h; y++) 
                {
                    //yh=y*w;
                    for (x=0; x<w; x++) 
                    {
                        sy = y; sx = x;  dstOff = (yh+x)<<2;
                        // calculate the weighed sum of the source image pixels that
                        // fall under the convolution matrix
                        r.length=0; g.length=0; b.length=0; ty=0;
                        for (cy=0; cy<side; cy++) 
                        {
                            //ty=cy*side;
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
                        if (r.length%2==1) // odd, take median
                        {
                            t=~~(0.5*r.length)+1;
                            dst[dstOff] = r[t];  dst[dstOff+1] = g[t];
                            dst[dstOff+2] = b[t];
                        }
                        else // even, take average
                        {
                            t=~~(0.5*r.length);
                            dst[dstOff] = ~~(0.5*(r[t]+r[t+1]));  dst[dstOff+1] = ~~(0.5*(g[t]+g[t+1]));
                            dst[dstOff+2] = ~~(0.5*(b[t]+b[t+1]));
                        }
                        dst[dstOff+3] = src[dstOff+3];
                    }
                    yh+=w;
                }
                image.setPixelData(newi);
            }
        }
    };
    
})(FILTER);