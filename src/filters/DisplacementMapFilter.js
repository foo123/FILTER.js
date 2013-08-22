/**
*
* Displacement Map Filter
* accepts an image as target
* and displaces/distorts the target image according to another map image data
*
* @param Target (Image)
* @param displaceMap (Image)
* @package FILTER.js
*
**/
(function(FILTER){
    
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

    FILTER.DisplacementMapFilter=function(target, displacemap)
    {
        this.scaleX=1;
        this.scaleY=1;
        this.startX=0;
        this.startY=0;
        this.componentX=0;
        this.componentY=0;
        this.color=0;
        this.mode=FILTER.MODE.CLAMP;
        this.image=target;
        this.map=displacemap;
    };

    FILTER.DisplacementMapFilter.prototype={
    
        constructor : FILTER.DisplacementMapFilter,
        
        apply : function() {
            var data=this.image.getPixelData(),
                w = data.width, h = data.height,
            // allow image to be map of itself
                mapdata=this.map.clone().getPixelData(),
                map=mapdata.data,
                mw = mapdata.width, mh = mapdata.height,
            // create new image for copy manipulations
                newd=this.image.clone().getPixelData(),
                sx=this.scaleX/256, sy=this.scaleY/256,
                alpha=this.color >> 24 & 255, red=this.color >> 16 & 255,
                green=this.color >> 8 & 255, blue=this.color & 255,
                ww=Math.min(mw,w), hh=Math.min(mh,h),
                sty=Math.floor(this.startY), stx=Math.floor(this.startX),
                comx=this.componentX, comy=this.componentY,
                xx,yy,dstoff,mapoff,srcy,srcx,dispoff,x,y,
                mode=this.mode
                ;

            // apply filter
            for (y=0; y<hh; y++) 
            {
                for (x=0; x<ww; x++) 
                {
                    yy=y+sty;  xx=x+stx;
                    if (yy<0 || yy>=h || xx<0 || xx>=w) continue;
                    dstoff = ((yy)*w+(xx))*4;  mapoff= (y*mw+x)*4;
                    srcy=yy+Math.floor((map[mapoff+comy]-128)*sy);
                    srcx=xx+Math.floor((map[mapoff+comx]-128)*sx);

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
                    dispoff=((srcy)*w+(srcx))*4;

                    // new pixel values
                    newd.data[dstoff]=data.data[dispoff];
                    newd.data[dstoff+1]=data.data[dispoff+1];
                    newd.data[dstoff+2]=data.data[dispoff+2];
                    newd.data[dstoff+3]=data.data[dispoff+3];
                }
            }
            this.image.setPixelData(newd);
        }
    };
    
})(FILTER);