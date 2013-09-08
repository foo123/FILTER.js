/**
*
* Displacement Map Filter
*
* Displaces/Distorts the target image according to displace map
*
* @param displaceMap Optional (an Image used as a  dimaplcement map)
* @package FILTER.js
*
**/
(function(FILTER){
    
    var IMG = FILTER.ImArray,
        Min=Math.min, Max=Math.max
    ;
    
    FILTER.DisplacementMapFilter=function(displacemap)
    {
        if (displacemap) this.setMap(displacemap);
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
        _map : null,
        
        combineWith : function(filt) {
            // todo ??
            return this;
        },
        
        getMap : function() {
            return this._map;
        },
        
        setMap : function(m) {
            this._map=m; return this;
        },
        
        // used for internal purposes
        _apply : function(im, w, h/*, image*/) {
            
            if (!this._map) return im;
            
            var map=this._map.getData(), mapW = this._map.width, mapH = this._map.height, mapArea=mapW*mapH,
                displace=new FILTER.Array16I(mapArea<<1), ww=Min(mapW, w), hh=Min(mapH, h),
                sx=this.scaleX*0.00390625, sy=this.scaleY*0.00390625, comx=this.componentX, comy=this.componentY, 
                alpha=(this.color >> 24) & 255, red=(this.color >> 16) & 255, green=(this.color >> 8) & 255, blue=this.color & 255,
                sty=~~(this.startY), stx=~~(this.startX), mode=this.mode, styw=sty*w, 
                bx0=-stx, by0=-sty, bx=w-stx-1, by=h-sty-1,
                i, j, k, x, y, ty, yy, xx, mapOff, dstOff, srcOff,
                applyArea=(ww*hh)<<2, imArea=w*h, imLen=im.length, dst=new IMG(im),
                _Ignore=FILTER.MODE.IGNORE, _Clamp=FILTER.MODE.CLAMP, _Color=FILTER.MODE.COLOR, _Wrap=FILTER.MODE.WRAP
                ;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main application loop (faster)
            // this is faster if mapArea <= imArea, else a reverse algorithm is needed (todo)
            i=0; j=0; x=0; y=0; ty=0;
            while (i<mapArea)
            { 
                mapOff=(x + ty)<<2;
                displace[j] = ~~((map[mapOff+comx]-128)*sx); displace[j+1] = ~~((map[mapOff+comy]-128)*sy);
                i++; j+=2; x++; if (x>=mapW) { x=0; y++; ty+=mapW; }
            } 
            
            // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
            i=-4; x=-1; y=0; ty=0; ty2=0;
            while (i<applyArea)
            {
                // update image coordinates
                i+=4; x++; if (x>=ww) { x=0; y++; ty+=w; ty2+=mapW; }
                
                // if inside the application area
                if (y<by0 || y>by || x<bx0 || x>bx) continue;
                
                xx=x + stx; yy=y + sty; dstOff=(xx + ty+styw)<<2;  
                
                j=(x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];
                
                if (srcy>=h || srcy<0 || srcx>=w || srcx<0)
                {
                    switch(mode)
                    {
                        case _Ignore: 
                            continue;  break;
                        
                        case _Color:
                            dst[dstOff]=red;  dst[dstOff+1]=green;
                            dst[dstOff+2]=blue;  dst[dstOff+3]=alpha;
                            continue;  break;
                            
                        case _Wrap:
                            if (srcy>by) srcy-=h;
                            if (srcy<0) srcy+=h;
                            if (srcx>bx) srcx-=w;
                            if (srcx<0)  srcx+=w;
                            break;
                            
                        case _Clamp:
                        default:
                            if (srcy>by)  srcy=by;
                            if (srcy<0) srcy=0;
                            if (srcx>bx) srcx=bx;
                            if (srcx<0) srcx=0;
                            break;
                    }
                }
                srcOff=(srcx + srcy*w)<<2;
                // new pixel values
                dst[dstOff]=im[srcOff];   dst[dstOff+1]=im[srcOff+1];
                dst[dstOff+2]=im[srcOff+2];  dst[dstOff+3]=im[srcOff+3];
            }
            return dst;
        },
        
        apply : function(image) {
            if (!this._map) return image;
            return image.setData(this._apply(image.getData(), image.width, image.height, image));
        },
        
        reset : function() {
            this._map=null; return this;
        }
    };
    
})(FILTER);