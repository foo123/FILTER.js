/**
*
* Color Methods / Transforms
* @package FILTER.js
*
**/
(function(FILTER){

    var Sqrt=Math.sqrt, Min=Math.min, Max=Math.max;
    
    // static Color Methods and Transforms
    // http://en.wikipedia.org/wiki/Color_space
    FILTER.Color={
        
        ubyteToFloat: function(ub) { return ub * 0.0039215686274509803921568627451; /* 1 / 255; */ },

        ubyteColorToFloatColor: function(color) {
            var ii, cL=color.length, floatColor=new Array(cL);
            for (i=0; i<cL; i++)  floatColor[i] = color[i] * 0.0039215686274509803921568627451;
            return floatColor;
        },
        
        hexColorToFloatColor: function(color) {
            var r, g, b,a;
            r = (color>>16)&255;
            g = (color>>8)&255;
            b = (color)&255;
            a = (color>>24)&255;

            return [
                r * 0.0039215686274509803921568627451,
                g * 0.0039215686274509803921568627451,
                b * 0.0039215686274509803921568627451,
                a * 0.0039215686274509803921568627451
            ];
        },
		
        blend : function(rgb1, rgb2, p) {
            return {
                r: rgb1.r - ~~((rgb1.r - rgb2.r) * p + 0.5), 
                g:rgb1.g - ~~((rgb1.g - rgb2.g) * p + 0.5), 
                b: rgb1.b - ~~((rgb1.b - rgb2.b) * p + 0.5)
            };
        },
        
        toGray : function(r, g, b) {
            var LUMA=FILTER.LUMA;  return ~~(LUMA[0]*r + LUMA[1]*g + LUMA[2]*b);
        }, 
        
        distance : function(rgb1, rgb2) {
            var dr=rgb1.r-rgb2.r, dg=rgb1.g-rgb2.g, db=rgb1.b-rgb2.b;
            return Sqrt(dr*dr + dg*dg + db*db);
        },
        
        RGB2Color : function(rgb) {
            return ((rgb.r << 16) | (rgb.g << 8) | (rgb.b)&255);
        },
        
        RGBA2Color : function(rgb) {
            return ((rgb.a << 24) | (rgb.r << 16) | (rgb.g << 8) | (rgb.b)&255);
        },
        
        Color2RGBA : function(c) {
            c=~~c;
            return {
                r : (c >>> 16) & 255,
                g : (c >>> 8) & 255,
                b : (c & 255),
                a : (c >>> 24) & 255
            };
        },

        // http://en.wikipedia.org/wiki/YCbCr
        RGB2YCbCr : function(rgb) {
			var y, cb, cr, r=rgb.r, g=rgb.g, b=rgb.b;
			
			// each take full range from 0-255
            y = ~~( 0   + 0.299*r    + 0.587*g     + 0.114*b    );
			cb= ~~( 128 - 0.168736*r - 0.331264*g  + 0.5*b      );
			cr= ~~( 128 + 0.5*r      - 0.418688*g  - 0.081312*b );
			return {y:y, cb:cb, cr:cr};
		},
        
        // http://en.wikipedia.org/wiki/YCbCr
        YCbCr2RGB : function(ycbcr) {
            var r, g, b, y=ycbcr.y, cb=ycbcr.cb, cr=ycbcr.cr;
			
			// each take full range from 0-255
            r = ~~( y                      + 1.402   * (cr-128) );
			g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
			b = ~~( y + 1.772   * (cb-128) );
			return {r:r, g:g, b:b};
        },
        
        // http://en.wikipedia.org/wiki/HSL_color_space
        // adapted from http://www.cs.rit.edu/~ncs/colo
        RGB2HSV : function(rgb)  {
            var min, max, delta, 
                r, g, b, h, s, v
            ;

            r=rgb.r; g=rgb.g; b=rgb.b;
            
            min = Min( r, g, b );  max = Max( r, g, b );  delta = max - min;
            v = max;				// v

            if( max != 0 )
            {
                s = delta / max;		// s
            }
            else 
            {
                // r = g = b = 0		// s = 0, v is undefined
                s = 0;  h = 0; //h = -1;
                return { h:h, s:s, v:v };
            }

            if( r == max )    h = ( g - b ) / delta;		// between yellow & magenta
            else if ( g == max )  h = 2 + ( b - r ) / delta;	// between cyan & yellow
            else   h = 4 + ( r - g ) / delta;	// between magenta & cyan

            h *= 60;				// degrees
            if( h < 0 )  h += 360;
            
            return { h:h, s:s, v:v };
        },
        
        // http://en.wikipedia.org/wiki/HSL_color_space
        // adapted from http://www.cs.rit.edu/~ncs/color/t_convert.html
        HSV2RGB : function( hsv ) {
            var i,
                f, p, q, t,
                r, g, b, h, s, v
            ;
            
            h=hsv.h; s=hsv.s; v=hsv.v;
            
            if( s == 0 ) 
            {
                // achromatic (grey)
                r = g = b = v;
                return {r:r, g:g, b:b};
            }

            h /= 60;			// sector 0 to 5
            i = ~~( h );
            f = h - i;			// factorial part of h
            p = v * ( 1 - s );   q = v * ( 1 - s * f );  t = v * ( 1 - s * ( 1 - f ) );

            switch( i ) 
            {
                case 0:  r = v;   g = t;   b = p;
                    break;
                case 1: r = q;  g = v;   b = p;
                    break;
                case 2: r = p;  g = v;  b = t;
                    break;
                case 3: r = p;  g = q;  b = v;
                    break;
                case 4: r = t;  g = p;  b = v;
                    break;
                default:		// case 5:
                    r = v;  g = p;  b = q;
                    break;
            }
            
            return {r:r, g:g, b:b};
        }
    };
    
})(FILTER);