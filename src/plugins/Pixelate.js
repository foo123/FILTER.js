/**
*
* (Rectangular) Pixelate, Triangular Pixelate, Rhomboid Pixelate, Hexagonal Pixelate Filter Plugins
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var PIXELATION, sqrt = Math.sqrt, min = Math.min, max = Math.max, SQRT_3 = sqrt(3);

// a simple and fast Pixelate filter for various patterns
// TODO: add some smoothing/dithering in patterns which have diagonal lines separating cells, e.g triangular,..
FILTER.Create({
    name: "PixelateFilter"
    
    // parameters
    ,scale: 1
    ,pattern: "rectangular"
    
    ,init: function( scale, pattern ) {
        var self = this;
        self.scale = scale || 1;
        self.pattern = pattern || "rectangular";
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,serialize: function( ) {
        var self = this;
        return {
             scale: self.scale
            ,pattern: self.pattern
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.scale = params.scale;
        self.pattern = params.pattern;
        return self;
    }
    
    ,apply: function( im, w, h ) {
        var self = this, pattern = self.pattern;
        if ( self.scale <= 1  || !pattern || !PIXELATION[pattern] ) return im;
        if ( self.scale > 100 ) self.scale = 100;
        
        var output = new FILTER.ImArray(im.length);
        PIXELATION[pattern]( self.scale, output, im, w, h );
        return output;
    }
});
// aliases and compatibility to prev versions
FILTER.RectangularPixelateFilter = function( scale ){ return new FILTER.PixelateFilter( scale, 'rectangular'); };
FILTER.TriangularPixelateFilter = function( scale ){ return new FILTER.PixelateFilter( scale, 'triangular'); };
FILTER.RhomboidPixelateFilter = function( scale ){ return new FILTER.PixelateFilter( scale, 'rhomboidal'); };
FILTER.HexagonalPixelateFilter = function( scale ){ return new FILTER.PixelateFilter( scale, 'hexagonal'); };

FILTER.PixelateFilter.PATTERN = PIXELATION = {
    "rectangular": function rectangular( scale, output, input, w, h ){
        var imLen = input.length, imArea = imLen>>>2,
            step, step, step_2, stepw, stepw_2,
            bx = w-1, by = imArea-w, p0, p1, p2, p3, p4, r, g, b,
            i, x, yw, sx, sy, syw, pxa, pya, pxb, pyb, pxc, pyc;
        
        step = (sqrt(imArea)*scale*1e-2)|0;
        step_2 = (0.5*step)|0; stepw = step*w; stepw_2 = step_2*w;
        
        // do pixelation via interpolation on 5 points of a certain rectangle
        x=yw=sx=sy=syw=0;
        for (i=0; i<imLen; i+=4)
        {
            pxa = x-sx; pya = yw-syw;
            pxb = min(bx, pxa+step); pyb = min(by, pya+stepw);
            pxc = min(bx, pxa+step_2); pyc = min(by, pya+stepw_2);
            
            // these edge conditions create the rectangular pattern
            p0 = (pxc + pyc) << 2;
            p1 = (pxa + pya) << 2;
            p2 = (pxa + pyb) << 2;
            p3 = (pxb + pya) << 2;
            p4 = (pxb + pyb) << 2;
            
            // compute rectangular interpolation
            // base interpolated color on center pixel plus corner pixels
            r = 0.125*(input[p1  ]+input[p2  ]+input[p3  ]+input[p4  ]+4*input[p0  ]);
            g = 0.125*(input[p1+1]+input[p2+1]+input[p3+1]+input[p4+1]+4*input[p0+1]);
            b = 0.125*(input[p1+2]+input[p2+2]+input[p3+2]+input[p4+2]+4*input[p0+2]);
            output[i] = r|0; output[i+1] = g|0; output[i+2] = b|0; output[i+3] = input[i+3];
            
            // next pixel
            x++; sx++; 
            if ( x >= w ) 
            { 
                sx=0; x=0; sy++; syw+=w; yw+=w;
                if ( sy >= step ) { sy=0; syw=0; }
            }
            if ( sx >= step ) { sx=0; }
        }
        //return output;
    },
    "triangular": function triangular( scale, output, input, w, h ){
        var imLen = input.length, imArea = imLen>>>2,
            step, step_2, step1_3, step2_3, stepw, stepw_2,
            bx = w-1, by = imArea-w, p0, p1, p2, p3, r, g, b,
            i, x, yw, sx, sy, syw, pxa, pya, pxb, pyb, pxc, pyc;

        step = (sqrt(imArea)*scale*1.25e-2)|0;
        step_2 = (0.5*step)|0; step1_3 = (0.333*step)|0; step2_3 = (0.666*step)|0;
        stepw = step*w; stepw_2 = step_2*w;

        // do pixelation via interpolation on 4 points of a certain triangle
        x=yw=sx=sy=syw=0;
        for (i=0; i<imLen; i+=4)
        {
            pxa = x-sx; pya = yw-syw;
            pxb = min(bx, pxa+step); pyb = min(by, pya+stepw);
            
            // these edge conditions create the various triangular patterns
            if ( sx+sy > step ) 
            { 
                // second (right) triangle
                pxc = min(bx, pxa+step2_3); pyc = min(by, pya+stepw_2);
                p0 = (pxc + pyc) << 2;
                p1 = (pxb + pyb) << 2;
            }
            else
            {
                // first (left) triangle
                pxc = min(bx, pxa+step1_3); pyc = min(by, pya+stepw_2);
                p0 = (pxc + pyc) << 2;
                p1 = (pxa + pyb) << 2;
            }
            
            p2 = (pxa + pya) << 2;
            p3 = (pxb + pya) << 2;
            
            // compute triangular interpolation
            // base interpolated color on center pixel plus corner pixels
            r = 0.2*(input[p1  ]+input[p2  ]+input[p3  ]+2*input[p0  ]);
            g = 0.2*(input[p1+1]+input[p2+1]+input[p3+1]+2*input[p0+1]);
            b = 0.2*(input[p1+2]+input[p2+2]+input[p3+2]+2*input[p0+2]);
            output[i] = r|0; output[i+1] = g|0; output[i+2] = b|0; output[i+3] = input[i+3];
            
            // next pixel
            x++; sx++; 
            if ( x >= w ) 
            { 
                sx=0; x=0; sy++; syw+=w; yw+=w;
                if ( sy >= step ) { sy=0; syw=0; }
            }
            if ( sx >= step ) { sx=0; }
        }
        //return output;
    },
    "rhomboidal": function rhomboidal( scale, output, input, w, h ){
        var imLen = input.length, imArea = imLen>>>2,
            step, step2, stepw, stepw2, odd,
            bx = w-1, by = imArea-w, p0, p1, p2, p3, p4, r, g, b,
            i, x, yw, sx, sy, syw, pxa, pya, pxb, pyb, pxc, pyc;
        
        step = (sqrt(imArea)*scale*7e-3)|0;
        step2 = 2*step; stepw = step*w; stepw2 = step2*w;
         
        // do pixelation via interpolation on 5 points of a certain rhomboid
        x=yw=sx=sy=syw=0; odd = 0;
        for (i=0; i<imLen; i+=4)
        {
            // these edge conditions create the various rhomboid patterns
            if ( odd )
            {
                // second row, bottom half of rhombii
                if ( sx+sy > step2 ) 
                { 
                    // third triangle /\.
                    pxa = min(bx, x-sx+step); pya = yw-syw;
                }
                else if ( sx+step-sy > step ) 
                { 
                    // second triangle \/.
                    pxa = x-sx; pya = max(0, yw-syw-stepw);
                }
                else
                {
                    // first triangle /\.
                    pxa = max(0, x-sx-step); pya = yw-syw;
                }
            }
            else
            {
                // first row, top half of rhombii
                if ( sx+step-sy > step2 ) 
                { 
                    // third triangle \/.
                    pxa = min(bx, x-sx+step); pya = max(0, yw-syw-stepw);
                }
                else if ( sx+sy > step ) 
                { 
                    // second triangle /\.
                    pxa = x-sx; pya = yw-syw;
                }
                else
                {
                    // first triangle \/.
                    pxa = max(0, x-sx-step); pya = max(0, yw-syw-stepw);
                }
            }
            pxb = min(bx, pxa+step2); pyb = min(by, pya+stepw2);
            pxc = min(bx, pxa+step); pyc = min(by, pya+stepw);
            
            p0 = (pxc + pyc) << 2;
            p1 = (pxc + pya) << 2;
            p2 = (pxa + pyc) << 2;
            p3 = (pxb + pyc) << 2;
            p4 = (pxc + pyb) << 2;
            
            // compute rhomboidal interpolation
            // base interpolated color on center pixel plus corner pixels
            r = 0.125*(input[p1  ]+input[p2  ]+input[p3  ]+input[p4  ]+4*input[p0  ]);
            g = 0.125*(input[p1+1]+input[p2+1]+input[p3+1]+input[p4+1]+4*input[p0+1]);
            b = 0.125*(input[p1+2]+input[p2+2]+input[p3+2]+input[p4+2]+4*input[p0+2]);
            output[i] = r|0; output[i+1] = g|0; output[i+2] = b|0; output[i+3] = input[i+3];
            
            // next pixel
            x++; sx++; 
            if ( x >= w ) 
            { 
                sx=0; x=0; sy++; syw+=w; yw+=w;
                if ( sy >= step ) { sy=0; syw=0; odd = 1-odd; }
            }
            if ( sx >= step2 ) { sx=0; }
        }
        //return output;
    },
    "hexagonal": function hexagonal( scale, output, input, w, h ){
        var imLen = input.length, imArea = imLen>>>2,
            xstep, xstep2, xstep_2, xstep3_2, ystep, ystepw,
            bx = w-1, by = imArea-w, p0, p1, p2, p3, p4, p5, p6, r, g, b,
            i, x, yw, sx, sy, syw, pxa, pya, pxb, pyb, pxc, pyc, pxd, pyd, pxe,
            xparity, yparity;
        
        xstep2 = (SQRT_3*scale*sqrt(imArea)*1.2e-2)|0;
        xstep = (0.5*xstep2)|0; xstep_2 = (0.25*xstep2)|0; xstep3_2 = xstep2-xstep_2;
        ystep = (0.25*xstep2)|0; ystepw = ystep*w;
         
        // do pixelation via interpolation on 7 points of a certain hexagon
        x=yw=sx=sy=syw=0; xparity=yparity=1;
        for (i=0; i<imLen; i+=4)
        {
            // these edge conditions create the various hexagonal patterns
            if ( yparity )
            {
                if ( 2===xparity )
                {
                    // center hexagon bottom
                    pxa = max(0, x-sx-xstep_2); pya = yw-syw;
                }
                else if ( 1===xparity )
                {
                    if ( SQRT_3*sx+ystep-sy > xstep )
                    {
                        // top right hexagon
                        pxa = min(bx, x-sx+xstep_2); pya = yw-syw;
                    }
                    else
                    {
                        // center hexagon
                        pxa = max(0, x-sx-xstep); pya = min(by, yw-syw+ystepw);
                    }
                }
                else
                {
                    if ( SQRT_3*sx+sy < xstep )
                    {
                        // top left hexagon
                        pxa = max(0, x-sx-xstep3_2); pya = yw-syw;
                    }
                    else
                    {
                        // center hexagon
                        pxa = x-sx; pya = min(by, yw-syw+ystepw);
                    }
                }
            }
            else
            {
                if ( 2===xparity )
                {
                    // center hexagon top
                    pxa = max(0, x-sx-xstep_2); pya = min(by, yw-syw+ystepw);
                }
                else if ( 1===xparity )
                {
                    if ( SQRT_3*sx+sy > xstep )
                    {
                        // bottom right hexagon
                        pxa = min(bx, x-sx+xstep_2); pya = min(by, yw-syw+ystepw);
                    }
                    else
                    {
                        // center hexagon
                        pxa = max(0, x-sx-xstep); pya = yw-syw;
                    }
                }
                else
                {
                    if ( SQRT_3*sx+ystep-sy < xstep )
                    {
                        // bottom left hexagon
                        pxa = max(0, x-sx-xstep3_2); pya = min(by, yw-syw+ystepw);
                    }
                    else
                    {
                        // center hexagon
                        pxa = x-sx; pya = yw-syw;
                    }
                }
            }
            pxb = min(bx, pxa+xstep_2); pyb = max(0, pya-ystepw);
            pxc = min(bx, pxa+xstep); pyc = pya;
            pxd = min(bx, pxa+xstep2); pyd = min(by, pya+ystepw);
            pxe = min(bx, pxa+xstep3_2);
            
            p0 = (pxc + pyc) << 2;
            p1 = (pxa + pya) << 2;
            p2 = (pxb + pyb) << 2;
            p3 = (pxe + pyb) << 2;
            p4 = (pxd + pya) << 2;
            p5 = (pxe + pyd) << 2;
            p6 = (pxb + pyd) << 2;
            
            // compute hexagonal interpolation
            // base interpolated color on center pixel plus corner pixels
            r = 0.125*(input[p1  ]+input[p2  ]+input[p3  ]+input[p4  ]+input[p5  ]+input[p6  ]+2*input[p0  ]);
            g = 0.125*(input[p1+1]+input[p2+1]+input[p3+1]+input[p4+1]+input[p5+1]+input[p6+1]+2*input[p0+1]);
            b = 0.125*(input[p1+2]+input[p2+2]+input[p3+2]+input[p4+2]+input[p5+2]+input[p6+2]+2*input[p0+2]);
            output[i] = r|0; output[i+1] = g|0; output[i+2] = b|0; output[i+3] = input[i+3];
            
            // next pixel
            x++; sx++; 
            if ( x >= w ) 
            { 
                sx=0; x=0; sy++; syw+=w; yw+=w; xparity=0;
                if ( sy >= ystep ) { sy=0; syw=0; yparity=1-yparity; }
            }
            if ( sx >= xstep ) { sx=0; xparity=(xparity+1)%3; }
        }
        //return output;
    }
};

}(FILTER);