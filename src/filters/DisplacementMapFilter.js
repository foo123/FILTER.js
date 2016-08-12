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
!function(FILTER, undef){
"use strict";

var IMG = FILTER.ImArray, IMGcopy = FILTER.ImArrayCopy, TypedArray = FILTER.Util.Array.typed,
    MODE = FILTER.MODE, A16I = FILTER.Array16I, Min = Math.min, Max = Math.max, Floor = Math.floor
;

//
//
// DisplacementMapFilter
var DisplacementMapFilter = FILTER.DisplacementMapFilter = FILTER.Class( FILTER.Filter, {
    name: "DisplacementMapFilter"
    
    ,constructor: function DisplacementMapFilter( displacemap ) {
        var self = this;
        if ( !(self instanceof DisplacementMapFilter) ) return new DisplacementMapFilter(displacemap);
        self.$super('constructor');
        if ( displacemap ) self.setInput( "map", displacemap );
    }
    
    ,path: FILTER_FILTERS_PATH
    // parameters
    ,scaleX: 1
    ,scaleY: 1
    ,startX: 0
    ,startY: 0
    ,componentX: 0
    ,componentY: 0
    ,color: 0
    ,mode: MODE.CLAMP
    ,hasInputs: true
    
    ,dispose: function( ) {
        var self = this;
        
        self.scaleX = null;
        self.scaleY = null;
        self.startX = null;
        self.startY = null;
        self.componentX = null;
        self.componentY = null;
        self.color = null;
        self.$super('dispose');
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             scaleX: self.scaleX
            ,scaleY: self.scaleY
            ,startX: self.startX
            ,startY: self.startY
            ,componentX: self.componentX
            ,componentY: self.componentY
            ,color: self.color
            ,mode: self.mode
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.scaleX = params.scaleX;
        self.scaleY = params.scaleY;
        self.startX = params.startX;
        self.startY = params.startY;
        self.componentX = params.componentX;
        self.componentY = params.componentY;
        self.color = params.color;
        self.mode = params.mode;
        return self;
    }
    
    ,reset: function( ) {
        this.delInput("map"); 
        return this;
    }
    
    // used for internal purposes
    ,_apply: function( im, w, h/*, image*/ ) {
        var self = this, Map;
        
        if ( !self._isOn ) return im;
        
        Map = self.input("map"); if ( !Map ) return im;
        
        var map, mapW, mapH, mapArea, displace, ww, hh,
            color = self.color||0, alpha, red, green, blue,
            sty, stx, styw, bx0, by0, bx, by, bxx = w-1, byy = h-1, rem,
            i, j, k, x, y, ty, ty2, yy, xx, mapOff, dstOff, srcOff,
            SX = self.scaleX*0.00390625, SY = self.scaleY*0.00390625, X = self.componentX, Y = self.componentY, 
            applyArea, imArea, imLen, mapLen, imcpy, srcx, srcy,
            IGNORE = MODE.IGNORE, CLAMP = MODE.CLAMP, COLOR = MODE.COLOR, WRAP = MODE.WRAP,
            mode = self.mode||CLAMP
        ;
        
        map = Map[0]; mapW = Map[1]; mapH = Map[2]; 
        mapLen = map.length; mapArea = mapLen>>>2;
        ww = Min(mapW, w); hh = Min(mapH, h);
        imLen = im.length; applyArea = (ww*hh)<<2; imArea = imLen>>>2;
        
        // make start relative
        //bxx = w-1; byy = h-1;
        stx = Floor(self.startX*bxx);
        sty = Floor(self.startY*byy);
        styw = sty*w;
        bx0 = -stx; by0 = -sty;
        bx = bxx-stx; by = byy-sty;
        
        displace = new A16I(mapArea<<1);
        imcpy = new IMGcopy(im);
        
        // pre-compute indices, 
        // reduce redundant computations inside the main application loop (faster)
        // this is faster if mapArea <= imArea, else a reverse algorithm may be needed (todo)
        rem = (mapArea&15)<<2;
        for (j=0,i=0; i<mapLen; i+=64)
        { 
            displace[j++] = Floor( ( map[i   +X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i   +Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+4 +X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+4 +Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+8 +X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+8 +Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+12+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+12+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+16+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+16+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+20+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+20+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+24+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+24+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+28+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+28+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+32+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+32+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+36+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+36+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+40+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+40+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+44+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+44+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+48+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+48+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+52+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+52+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+56+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+56+Y] - 128 ) * SY );
            displace[j++] = Floor( ( map[i+60+X] - 128 ) * SX );
            displace[j++] = Floor( ( map[i+60+Y] - 128 ) * SY );
        }
        if ( rem )
        {
            for (i=mapLen-rem; i<mapLen; i+=4)
            { 
                displace[j++] = Floor( ( map[i   +X] - 128 ) * SX );
                displace[j++] = Floor( ( map[i   +Y] - 128 ) * SY );
            }
        }
        
        // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
        if ( COLOR === mode )
        {
            alpha = (color >>> 24) & 255; 
            red = (color >>> 16) & 255; 
            green = (color >>> 8) & 255; 
            blue = color & 255;
            for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,x++)
            {
                // update image coordinates
                if (x>=ww) { x=0; y++; ty+=w; ty2+=mapW; }
                
                // if inside the application area
                if (y<by0 || y>by || x<bx0 || x>bx) continue;
                
                xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;  
                
                j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];
                
                // color
                if (srcy>byy || srcy<0 || srcx>bxx || srcx<0)
                {
                    im[dstOff] = red;  im[dstOff+1] = green;
                    im[dstOff+2] = blue;  im[dstOff+3] = alpha;
                    continue;
                }
                
                srcOff = (srcx + srcy*w)<<2;
                // new pixel values
                im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
                im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
            }
        }
        else if ( IGNORE === mode )
        {
            for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,x++)
            {
                // update image coordinates
                if (x>=ww) { x=0; y++; ty+=w; ty2+=mapW; }
                
                // if inside the application area
                if (y<by0 || y>by || x<bx0 || x>bx) continue;
                
                xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;  
                
                j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];
                
                // ignore
                if (srcy>byy || srcy<0 || srcx>bxx || srcx<0) continue;
                
                srcOff = (srcx + srcy*w)<<2;
                // new pixel values
                im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
                im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
            }
        }
        else if ( WRAP === mode )
        {
            for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,x++)
            {
                // update image coordinates
                if (x>=ww) { x=0; y++; ty+=w; ty2+=mapW; }
                
                // if inside the application area
                if (y<by0 || y>by || x<bx0 || x>bx) continue;
                
                xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;  
                
                j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];
                
                // wrap
                srcy = srcy>byy ? srcy-h : (srcy<0 ? srcy+h : srcy);
                srcx = srcx>bxx ? srcx-w : (srcx<0 ? srcx+w : srcx);
                
                srcOff = (srcx + srcy*w)<<2;
                // new pixel values
                im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
                im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
            }
        }
        else //if ( CLAMP === mode )
        {
            for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,x++)
            {
                // update image coordinates
                if (x>=ww) { x=0; y++; ty+=w; ty2+=mapW; }
                
                // if inside the application area
                if (y<by0 || y>by || x<bx0 || x>bx) continue;
                
                xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;  
                
                j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];
                
                // clamp
                srcy = srcy>byy ? byy : (srcy<0 ? 0 : srcy);
                srcx = srcx>bxx ? bxx : (srcx<0 ? 0 : srcx);
                
                srcOff = (srcx + srcy*w)<<2;
                // new pixel values
                im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
                im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
            }
        }
        return im;
    }
});

}(FILTER);