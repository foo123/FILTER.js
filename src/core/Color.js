/**
*
* Color Transforms
* @package FILTER.js
*
**/
(function(FILTER){

    var Sqrt=Math.sqrt;
    
    // static color transform methods
    FILTER.Color={
        
		blend : function(rgb1, rgb2, p) {
            return {
                red: rgb1.red - ~~((rgb1.red - rgb2.red) * p + 0.5), 
                green:rgb1.green - ~~((rgb1.green - rgb2.green) * p + 0.5), 
                blue: rgb1.blue - ~~((rgb1.blue - rgb2.blue) * p + 0.5)
            };
        },
        
        toGray : function(r,g,b) {
            return ~~(FILTER.LUMA[0]*r + FILTER.LUMA[1]*g + FILTER.LUMA[2]*b);
        }, 
        
        distance : function(rgb1, rgb2) {
            var dr=rgb1.red-rgb2.red, dg=rgb1.green-rgb2.green, db=rgb1.blue-rgb2.blue;
            return Sqrt(dr*dr + dg*dg + db*db);
        },
        
        RGB2Color : function(rgb) {
            return ((rgb.red << 16) + (rgb.green << 8) + rgb.blue);
        },
        
        RGBA2Color : function(rgb) {
            return ((rgb.alpha << 24) + (rgb.red << 16) + (rgb.green << 8) + rgb.blue);
        },
        
        Color2RGBA : function(c) {
            c=~~c;
            return {
                red : (c >> 16) & 255,
                green : (c >> 8) & 255,
                blue : (c & 255),
                alpha : (c >> 24) & 255
            };
        },

        RGB2YCbCr : function(rgb) {
			var y, cb, cr, r=rgb.red, g=rgb.green, b=rgb.blue;
			
			y=~~(0.299*r +0.587*g +0.114*b);
			cb=~~(128-0.169*r -0.331*g +0.500*b);
			cr=~~(128 +0.500*r -0.42*g -0.080*b);
			return {Y:y, Cb:cb, Cr:cr};
		},
        
        YCbCr2RGB : function(ycbcr) {
            var r, g, b, y=ycbcr.Y, cb=ycbcr.Cb, cr=ycbcr.Cr;
			
            r=~~(y + 1.4*(cr-128));
			g=~~(y-0.343*(cb-128)-0.711*(cr-128));
			b=~~(y+1.765*(cb-128));
			return {red:r, green:g, blue:b};
        },
        
        RGB2HSV :function(rgb) {
            var rr=rgb.red*0.0039215686274509803921568627451, // / 255
                gg=rgb.green*0.0039215686274509803921568627451,  // / 255
                bb=rgb.blue*0.0039215686274509803921568627451, // / 255
                H, S, V, t1, t2, t3
            ;
            t1= rr < gg ? (rr < bb ? (rr) : (bb)) : (gg < bb ? (gg) : (bb));
            V = rr > gg ? (rr > bb ? (rr) : (bb)) : (gg > bb ? (gg) : (bb));
            if (t1 == V)
            {
                return {H:NaN, S:0, V:V};
            }
            t2 = rr == t1 ? (gg - bb) : (gg == t1 ? (bb - rr) : (rr - gg));
            t3 = rr == t1 ? (3) : (gg == t1 ? (5) : (1));
            H = ((rr == t1 ? (3) : (gg == t1 ? (5) : (1))) - t2 / (V - t1)) * 60;
            if (H >= 360)
            {
                H -= 360;
            }
            else if (H < 0)
            {
                H += 360;
            }
            $ = (V - t1) / V;
            return {H:H, S:S, V:V};
        }
    };
    
})(FILTER);