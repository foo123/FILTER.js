/**
*
* Displacement Map Filter
*
* Displaces/Distorts the target image according to displace map
*
* @param displaceMap (Image)
* @package FILTER.js
*
**/
(function(FILTER){
    
    // Constants
    FILTER.CHANNEL={
        RED : 0,
        GREEN : 1,
        BLUE : 2,
        ALPHA : 3
    };
    FILTER.MODE={
        IGNORE : 0,
        WRAP : 1,
        CLAMP : 2,
        COLOR : 4
    };

    var 
        Min=Math.min, Max=Math.max
    ;
    
    FILTER.DisplacementMapFilter=function(displacemap)
    {
        this.map=displacemap;
    };

    FILTER.DisplacementMapFilter.prototype={
    
        // parameters
        scaleX : 1,
        scaleY : 1,
        startX: 0,
        startY: 0,
        componentX : 0,
        componentY : 0,
        color : 0,
        mode : FILTER.MODE.CLAMP,
        map : null,
        
        // used for internal purposes
        _apply : function(im, w, h) {
            
            if (!this.map) return im;
            
            var map=this.map.getData(), mw = this.map.width, mh = this.map.height, 
                ww=Min(mw, w), hh=Min(mh, h),
                sx=this.scaleX*0.00390625, /* /256 */ sy=this.scaleY*0.00390625, /* /256 */
                alpha=(this.color >> 24) & 255, red=(this.color >> 16) & 255,
                green=(this.color >> 8) & 255, blue=this.color & 255,
                sty=~~(this.startY), stx=~~(this.startX),
                comx=this.componentX, comy=this.componentY, mode=this.mode,
                xx,yy,dstoff,mapoff,srcy,srcx,dispoff,x,y,ymw, yyw, styw=sty*w,
                // create new image for copy manipulations
                dst=new FILTER.ImArray(im.length)
                ;
            
            // apply filter
            ymw=0; yyw=0;
            for (y=0; y<hh; y++) 
            {
                yy=y+sty;
                if (yy>=0 && yy<h)
                {
                    for (x=0; x<ww; x++) 
                    {
                        xx=x+stx;
                        if (xx<0 || xx>=w) continue;
                        
                        dstoff = (yyw+styw+xx)<<2;  mapoff = (ymw+x)<<2;
                        srcy = yy + ~~((map[mapoff+comy]-128)*sy);
                        srcx = xx + ~~((map[mapoff+comx]-128)*sx);

                        if (srcy>=h || srcy<0 || srcx>=w || srcx<0)
                        {
                            switch(mode)
                            {
                                case FILTER.MODE.IGNORE: 
                                    continue;  break;
                                
                                case FILTER.MODE.COLOR:
                                    dst[dstoff]=red;  dst[dstoff+1]=green;
                                    dst[dstoff+2]=blue;  dst[dstoff+3]=alpha;
                                    continue;  break;
                                    
                                case FILTER.MODE.WRAP:
                                    if (srcy>=h) srcy-=h;
                                    if (srcy<0) srcy+=h;
                                    if (srcx>=w) srcx-=w;
                                    if (srcx<0)  srcx+=w;
                                    break;
                                    
                                case FILTER.MODE.CLAMP:
                                default:
                                    if (srcy>=h)  srcy=h-1;
                                    if (srcy<0) srcy=0;
                                    if (srcx>=w) srcx=w-1;
                                    if (srcx<0) srcx=0;
                                    break;
                            }
                        }
                        dispoff=(srcy*w + srcx)<<2;

                        // new pixel values
                        dst[dstoff]=im[dispoff];
                        dst[dstoff+1]=im[dispoff+1];
                        dst[dstoff+2]=im[dispoff+2];
                        dst[dstoff+3]=im[dispoff+3];
                    }
                }
                ymw+=mw; yyw+=w;
            }
            return dst;
        },
        
        apply : function(image) {
            if (!this.map) return image;
            return image.setData(this._apply(image.getData(), image.width, image.height));
        }
    };
    
})(FILTER);