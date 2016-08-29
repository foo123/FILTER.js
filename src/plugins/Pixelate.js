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
            scale: self.scale
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.scale = params.scale;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        if ( self.scale <= 1 ) return im;
        if ( self.scale > 100 ) self.scale = 100;
        
        var dst, imLen = im.length, imArea = imLen>>>2,
            step, stepx, stepy,
            bx = w-1, by = imArea-w, p1, p2, p3, p4, p5, r, g, b,
            i, x, yw, sx, sy, syw, pxa, pya, pxb, pyb, pxc, pyc;
        
        dst = new IMG(imLen);
        step = (sqrt(imArea)*self.scale*0.01)|0;
        stepx = step-1; stepy = w*stepx;
        
        // do pixelation via interpolation on 5 points of a certain rectangle
        x=yw=sx=sy=syw=0;
        for (i=0; i<imLen; i+=4)
        {
            pxa = x-sx; pya = yw-syw;
            pxb = min(bx, pxa+stepx); pyb = min(by, pya+stepy);
            pxc = min(bx, pxa+((0.5*step)|0)); pyc = min(by, pya+((0.5*step)|0)*w);
            
            // these edge conditions create the rectangular pattern
            p1 = (pxa + pya) << 2;
            p2 = (pxa + pyb) << 2;
            p3 = (pxb + pya) << 2;
            p4 = (pxb + pyb) << 2;
            p5 = (pxc + pyc) << 2;
            
            // compute rectangular interpolation
            r = 0.2*(im[p1  ]+im[p2  ]+im[p3  ]+im[p4  ]+im[p5  ]);
            g = 0.2*(im[p1+1]+im[p2+1]+im[p3+1]+im[p4+1]+im[p5+1]);
            b = 0.2*(im[p1+2]+im[p2+2]+im[p3+2]+im[p4+2]+im[p5+2]);
            dst[i] = r|0; dst[i+1] = g|0; dst[i+2] = b|0; dst[i+3] = im[i+3];
            
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
            scale: self.scale
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.scale = params.scale;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        if ( self.scale <= 1 ) return im;
        if ( self.scale > 100 ) self.scale = 100;
        
        var dst, imLen = im.length, imArea = (imLen>>>2),
            step, stepx, stepy,
            bx = w-1, by = imArea-w, p1, p2, p3, p4, r, g, b,
            i, x, yw, sx, sy, syw, pxa, pya, pxb, pyb, pxc, pyc;
        
        dst = new IMG(imLen);
        step = (sqrt(imArea)*self.scale*0.01)|0;
        stepx = step-1; stepy = w*stepx;
        
        // do pixelation via interpolation on 4 points of a certain triangle
        x=yw=sx=sy=syw=0;
        for (i=0; i<imLen; i+=4)
        {
            pxa = x-sx; pya = yw-syw;
            pxb = min(bx, pxa+stepx); pyb = min(by, pya+stepy);
            
            // these edge conditions create the various triangular patterns
            if ( sx+sy > stepx ) 
            { 
                // second triangle
                pxc = min(bx, pxa+((0.666*step)|0)); pyc = min(by, pya+((0.5*step)|0)*w);
                p1 = (pxb + pya) << 2;
                p2 = (pxb + pyb) << 2;
                p3 = (pxa + pya) << 2;
                p4 = (pxc + pyc) << 2;
            }
            else
            {
                // first triangle
                pxc = min(bx, pxa+((0.333*step)|0)); pyc = min(by, pya+((0.5*step)|0)*w);
                p1 = (pxa + pya) << 2;
                p2 = (pxa + pyb) << 2;
                p3 = (pxb + pya) << 2;
                p4 = (pxc + pyc) << 2;
            }
            
            // compute triangular interpolation
            r = 0.25*(im[p1  ]+im[p2  ]+im[p3  ]+im[p4  ]);
            g = 0.25*(im[p1+1]+im[p2+1]+im[p3+1]+im[p4+1]);
            b = 0.25*(im[p1+2]+im[p2+2]+im[p3+2]+im[p4+2]);
            dst[i] = r|0; dst[i+1] = g|0; dst[i+2] = b|0; dst[i+3] = im[i+3];
            
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
            scale: self.scale
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.scale = params.scale;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        if ( self.scale <= 1 ) return im;
        if ( self.scale > 100 ) self.scale = 100;
        
        var dst, imLen = im.length, imArea = (imLen>>>2),
            step, step_1, step_2, stepx, stepy, stepx_2, stepy_2,
            bx = w-1, by = imArea-w,
            p1, p2, p3, p4, p5, p6, p7, d, r, g, b, s, swap,
            i, x, yw, sx, sy, syw, sx2, sy2, pxa, pya, pxb, pyb, pxc, pyc, pxd;
        
        dst = new IMG(imLen);
        step = (sqrt(imArea)*self.scale*0.01)|0; d = (SQRT_3/2-1)*step;
        step_1 = step-1; step_2 = step >>> 1; stepx = step_1;
        stepy_2 = w*step_2; stepy = w*step_1;
        s = step + d + d; swap = 1;
        
        // do pixelation via interpolation on 5 points of a certain ractangle
        x=yw=0; sx=sy=syw=0;
        for (i=0; i<imLen; i+=4)
        {
            // these edge conditions create the various hexagonal patterns
            if ( 2*SQRT_3*sx+2*sy < s ) 
            { 
                // top left hexagon
                pxa = max(0, x-sx-stepx); pya = max(0, yw-syw-stepy_2);
            }
            else if ( 2*SQRT_3*sx+sy < s ) 
            { 
                // bottom left hexagon
                pxa = max(0, x-sx-stepx); pya = min(by, yw-syw+stepy_2);
            }
            else if ( SQRT_3*sx+2*sy < s ) 
            { 
                // top right hexagon
                pxa = min(bx, x-sx+stepx); pya = max(0, yw-syw-stepy_2);
            }
            else if ( SQRT_3*sx+sy < s ) 
            { 
                // bottom right hexagon
                pxa = min(bx, x-sx+stepx); pya = min(by, yw-syw+stepy_2);
            }
            else
            { 
                // center hexagon
                pxa = min(bx, x-sx); pya = max(0, yw-syw);
            }
            
            pxb = min(bx, pxa+stepx); pyb = min(by, pya+stepy);
            pxc = min(bx, pxa+((0.5*step)|0)); pyc = min(by, pya+((0.5*step)|0)*w);
            
            p1 = (pxa + pya) << 2;
            p2 = (pxb + pya) << 2;
            p3 = (pxb + pyb) << 2;
            p4 = (pxa + pyb) << 2;
            p5 = (pxc + pyc) << 2;
            
            // compute hexagonal interpolation
            r = 0.2*(im[p1  ]+im[p2  ]+im[p3  ]+im[p4  ]+im[p5  ]);
            g = 0.2*(im[p1+1]+im[p2+1]+im[p3+1]+im[p4+1]+im[p5+1]);
            b = 0.2*(im[p1+2]+im[p2+2]+im[p3+2]+im[p4+2]+im[p5+2]);
            dst[i] = r|0; dst[i+1] = g|0; dst[i+2] = b|0; dst[i+3] = im[i+3];
            
            // next pixel
            x++; sx++; 
            if ( x >= w ) 
            { 
                sx = swap*d; swap = 1-swap;
                x=0; sy++; syw+=w; yw+=w;
                if ( sy > step_1 ) { sy=0; syw=0; }
            }
            if ( sx >= s ) { sx = 0; }
        }
        // return the pixelated image data
        return dst;
    }
});*/

}(FILTER);