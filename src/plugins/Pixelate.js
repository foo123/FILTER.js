/**
*
* Rectangular Pixelate Filter, Triangular Pixelate Filter, Hexagonal Pixelate Filter Plugins
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var IMG = FILTER.ImArray, sqrt = Math.sqrt, min = Math.min, max = Math.max, SQRT_3 = sqrt(3.0);

// a simple fast Rectangular Pixelate filter
FILTER.Create({
    name: "PixelateFilter"
    
    // parameters
    ,scale: 1
    
    // this is the filter constructor
    ,init: function( scale ) {
        var self = this;
        self.scale = scale || 1;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                scale: self.scale
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.scale = params.scale;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || self.scale <= 1 ) return im;
        if ( self.scale > 100 ) self.scale = 100;
        
        var dst, imLen = im.length, imArea = imLen>>>2,
            step, stepx, stepy,
            bx = w-1, by = imArea-w, p1, p2, p3, p4, p5, r, g, b,
            i, x, yw, sx, sy, syw, pxa, pya, pxb, pyb, pxc, pyc
        ;
        
        dst = new IMG(imLen);
        step = ~~(sqrt(imArea)*self.scale*0.01);
        stepx = step-1; stepy = w*stepx;
        
        // do pixelation via interpolation on 5 points of a certain rectangle
        x=yw=sx=sy=syw=0;
        for (i=0; i<imLen; i+=4)
        {
            pxa = x-sx; pya = yw-syw;
            pxb = min(bx, pxa+stepx); pyb = min(by, pya+stepy);
            //pxc = (pxa>>>1)+(pxb>>>1); pyc = (pya>>>1)+(pyb>>>1);
            
            // these edge conditions create the rectangular pattern
            p1 = (pxa + pya) << 2;
            p2 = (pxa + pyb) << 2;
            p3 = (pxb + pya) << 2;
            p4 = (pxb + pyb) << 2;
            //p5 = (pxc + pyc) << 2;
            
            // compute rectangular interpolation
            r = im[p1  ]+im[p2  ]+im[p3  ]+im[p4  ]/*+im[p5  ]*/;
            g = im[p1+1]+im[p2+1]+im[p3+1]+im[p4+1]/*+im[p5+1]*/;
            b = im[p1+2]+im[p2+2]+im[p3+2]+im[p4+2]/*+im[p5+2]*/;
            dst[i] = ~~(0.25*r); dst[i+1] = ~~(0.25*g); dst[i+2] = ~~(0.25*b); dst[i+3] = im[i+3];
            
            // next pixel
            x++; sx++; 
            if ( x >= w ) 
            { 
                sx=0; x=0; sy++; syw+=w; yw+=w;
                if ( sy >= step ) { sy=0; syw=0; }
            }
            if ( sx >= step ) { sx=0; }
        }
        // return the pixelated image data
        return dst;
    }
});

// a simple fast Triangular Pixelate filter
FILTER.Create({
    name: "TriangularPixelateFilter"
    
    // parameters
    ,scale: 1
    
    // this is the filter constructor
    ,init: function( scale ) {
        var self = this;
        self.scale = scale || 1;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                scale: self.scale
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.scale = params.scale;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || self.scale <= 1 ) return im;
        if ( self.scale > 100 ) self.scale = 100;
        
        var dst, imLen = im.length, imArea = (imLen>>>2),
            step, stepx, stepy,
            bx = w-1, by = imArea-w, p1, p2, p3, p4, r, g, b,
            i, x, yw, sx, sy, syw, pxa, pya, pxb, pyb, pxc, pyc
        ;
        
        dst = new IMG(imLen);
        step = ~~(sqrt(imArea)*self.scale*0.01);
        stepx = step-1; stepy = w*stepx;
        
        // do pixelation via interpolation on 4 points of a certain triangle
        x=yw=sx=sy=syw=0;
        for (i=0; i<imLen; i+=4)
        {
            pxa = x-sx; pya = yw-syw;
            pxb = min(bx, pxa+stepx); pyb = min(by, pya+stepy);
            //pxc = (pxa>>>1)+(pxb>>>1); pyc = (pya>>>1)+(pyb>>>1);
            
            // these edge conditions create the various triangular patterns
            if ( sx+sy > stepx ) 
            { 
                // second triangle
                p1 = (pxb + pya) << 2;
                p2 = (pxb + pyb) << 2;
                p3 = (pxa + pya) << 2;
                //p4 = (pxc + pyc) << 2;
            }
            else
            {
                // first triangle
                p1 = (pxa + pya) << 2;
                p2 = (pxa + pyb) << 2;
                p3 = (pxb + pya) << 2;
                //p4 = (pxc + pyc) << 2;
            }
            
            // compute triangular interpolation
            r = im[p1  ]+im[p2  ]+im[p3  ]/*+im[p4  ]*/;
            g = im[p1+1]+im[p2+1]+im[p3+1]/*+im[p4+1]*/;
            b = im[p1+2]+im[p2+2]+im[p3+2]/*+im[p4+2]*/;
            dst[i] = ~~(0.333*r); dst[i+1] = ~~(0.333*g); dst[i+2] = ~~(0.333*b); dst[i+3] = im[i+3];
            
            // next pixel
            x++; sx++; 
            if ( x >= w ) 
            { 
                sx=0; x=0; sy++; syw+=w; yw+=w;
                if ( sy >= step ) { sy=0; syw=0; }
            }
            if ( sx >= step ) { sx=0; }
        }
        // return the pixelated image data
        return dst;
    }
});

/*
TO BE ADDED
// a simple fast Hexagonal Pixelate filter
FILTER.Create({
    name: "HexagonalPixelateFilter"
    
    // parameters
    ,scale: 1
    
    // this is the filter constructor
    ,init: function( scale ) {
        var self = this;
        self.scale = scale || 1;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                scale: self.scale
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.scale = params.scale;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image* /) {
        var self = this;
        if ( !self._isOn || self.scale <= 1 ) return im;
        if ( self.scale > 100 ) self.scale = 100;
        
        var dst, imLen = im.length, imArea = (imLen>>>2),
            step, step_1, step_2, stepx, stepy, stepx_2, stepy_2,
            bx = w-1, by = imArea-w,
            p1, p2, p3, p4, p5, p6, p7, d, r, g, b,
            i, x, yw, sx, sy, syw, sx2, sy2, pxa, pya, pxb, pyb, pxc, pyc, pxd
        ;
        
        dst = new IMG(imLen);
        step = ~~(sqrt(imArea)*self.scale*0.01); d = ~~(step/SQRT_3);
        step_1 = step-1; step_2 = step >>> 1;
        stepx_2 = (step/*+d+d* /) >>> 1; stepx = step_1/*+d+d* /;
        stepy_2 = w*step_2; stepy = w*step_1;
        
        // do pixelation via interpolation on 4 points of a certain ractangle
        x=yw=0; sx=sy=syw=0;
        for (i=0; i<imLen; i+=4)
        {
            // these edge conditions create the various hexagonal patterns
            if ( 2*(step_2-sy) > SQRT_3*sx ) 
            { 
                // top left hexagon
                pxa = max(0, x-sx-stepx); pya = max(0, yw-syw-stepy_2);
            }
            else if ( 2*sy > SQRT_3*sx ) 
            { 
                // bottom left hexagon
                pxa = max(0, x-sx-stepx); pya = min(by, yw-syw+stepy_2);
            }
            else if ( 2*(step_2-sy) > SQRT_3*(stepx+d+d-sx) ) 
            { 
                // top right hexagon
                pxa = min(bx, x-sx+stepx); pya = max(0, yw-syw-stepy_2);
            }
            else if ( 2*sy > SQRT_3*(stepx+d+d-sx) ) 
            { 
                // bottom right hexagon
                pxa = min(bx, x-sx+stepx); pya = min(by, yw-syw+stepy_2);
            }
            else
            { 
                // center hexagon
                pxa = min(bx, x-sx); pya = max(0, yw-syw);
            }
            
            pxb = min(bx, pxa+step_1); pyb = min(by, pya+stepy);
            
            p1 = (pxa + pya) << 2;
            p2 = (pxb + pya) << 2;
            p3 = (pxb + pyb) << 2;
            p4 = (pxa + pyb) << 2;
            
            // compute hexagonal interpolation
            r = im[p1  ]+im[p2  ]+im[p3  ]+im[p4  ];
            g = im[p1+1]+im[p2+1]+im[p3+1]+im[p4+1];
            b = im[p1+2]+im[p2+2]+im[p3+2]+im[p4+2];
            dst[i] = ~~(0.25*r); dst[i+1] = ~~(0.25*g); dst[i+2] = ~~(0.25*b); dst[i+3] = im[i+3];
            
            // next pixel
            x++; sx++; 
            if ( x >= w ) 
            { 
                sx=0; x=0; sy++; syw+=w; yw+=w;
                if ( sy > step_1 ) { sy=0; syw=0; }
            }
            if ( sx > stepx ) { sx=0; }
        }
        
        // return the pixelated image data
        return dst;
    }
});*/

}(FILTER);