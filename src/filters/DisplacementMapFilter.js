/**
*
* Displacement Map Filter
* accepts an image as displace map
* displaces/distorts the target image according to displace map
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
        this.scaleX=1;
        this.scaleY=1;
        this.startX=0;
        this.startY=0;
        this.componentX=0;
        this.componentY=0;
        this.color=0;
        this.mode=FILTER.MODE.CLAMP;
        this.map=displacemap;
    };

    FILTER.DisplacementMapFilter.prototype={
    
        apply : function(image) {
            var data=image.getPixelData(), w = data.width, h = data.height, im=data.data,
                mapdata=this.map.getPixelData(), map=mapdata.data, mw = mapdata.width, mh = mapdata.height, ww=Min(mw, w), hh=Min(mh, h),
                sx=this.scaleX*0.00390625 /* /256 */, sy=this.scaleY*0.00390625, /* /256 */
                alpha=(this.color >> 24) & 255, red=(this.color >> 16) & 255,
                green=(this.color >> 8) & 255, blue=this.color & 255,
                sty=~~(this.startY), stx=~~(this.startX),
                comx=this.componentX, comy=this.componentY, mode=this.mode,
                xx,yy,dstoff,mapoff,srcy,srcx,dispoff,x,y,ymw, yyw, styw=sty*w,
                // create new image for copy manipulations
                newi=FILTER.static.createImageData(w,h), newd=newi.data
                ;

            // apply filter
            ymw=0; yyw=styw;
            for (y=0; y<hh; y++) 
            {
                yy=y+sty;
                if (yy>=0 && yy<h)
                {
                    for (x=0; x<ww; x++) 
                    {
                        xx=x+stx;
                        if (xx<0 || xx>=w) continue;
                        
                        dstoff = (yyw+xx)<<2;  mapoff = (ymw+x)<<2;
                        srcy = yy + ~~((map[mapoff+comy]-128)*sy);
                        srcx = xx + ~~((map[mapoff+comx]-128)*sx);

                        if (srcy>=h || srcy<0 || srcx>=w || srcx<0)
                        {
                            switch(mode)
                            {
                                case FILTER.MODE.IGNORE: 
                                    continue;  break;
                                
                                case FILTER.MODE.COLOR:
                                    newd.data[dstoff]=red;  newd.data[dstoff+1]=green;
                                    newd.data[dstoff+2]=blue;  newd.data[dstoff+3]=alpha;
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
                        newd[dstoff]=im[dispoff];
                        newd[dstoff+1]=im[dispoff+1];
                        newd[dstoff+2]=im[dispoff+2];
                        newd[dstoff+3]=im[dispoff+3];
                    }
                }
                ymw+=mw; yyw+=styw;
            }
            // update image
            image.setPixelData(newi);
        }
    };
    
})(FILTER);