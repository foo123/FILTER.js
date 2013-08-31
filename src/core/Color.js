/**
*
* Color Transforma
* @package FILTER.js
*
**/
(function(FILTER){

    // static color transform methods
    FILTER.Color={
        
		blend : function(rgb1, rgb2, p) {
            return {
                red: rgb1.red - ~~((rgb1.red - rgb2.red) * p + 0.5), 
                green:rgb1.green - ~~((rgb1.green - rgb2.green) * p + 0.5), 
                blue: rgb1.blue - ~~((rgb1.blue - rgb2.blue) * p + 0.5)
            };
        },
        
        distance : function(rgb1, rgb2) {
            var dr=rgb1.red-rgb2.red, dg=rgb1.green-rgb2.green, db=rgb1.blue-rgb2.blue;
            return Math.sqrt(dr*dr + dg*dg + db*db);
        },
        
        RGBA2Color : function(rgb) {
            return (typeof rgb.alpha !='undefined') ? 
                ((rgb.alpha << 24) + (rgb.red << 16) + (rgb.green << 8) + rgb.blue) : 
                ((rgb.red << 16) + (rgb.green << 8) + rgb.blue);
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
			
            r=~~(y + 1.4(cr-128));
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

        /*HSV2RGB : function(hsv) {
            var _loc_5 = NaN;
            var _loc_6 = NaN;
            var _loc_7 = NaN;
            var _loc_1;
            if (brt == 0)
            {
                return _loc_1;
            }
            if (isNaN(hue))
            {
                var _loc_8:* = int(brt * 255);
                _loc_1.blue = int(brt * 255);
                _loc_1.green = _loc_8;
                _loc_1.red = _loc_8;
                return _loc_1;
            }
            var _loc_2:* = hue / 60;
            var _loc_3:* = int(_loc_2);
            var _loc_4:* = _loc_2 - _loc_3;
            if (_loc_3 == 0)
            {
                _loc_5 = brt;
                _loc_6 = brt * (1 - sat * (1 - _loc_4));
                _loc_7 = brt * (1 - sat);
            }
            else if (_loc_3 == 1)
            {
                _loc_5 = brt * (1 - sat * _loc_4);
                _loc_6 = brt;
                _loc_7 = brt * (1 - sat);
            }
            else if (_loc_3 == 2)
            {
                _loc_5 = brt * (1 - sat);
                _loc_6 = brt;
                _loc_7 = brt * (1 - sat * (1 - _loc_4));
            }
            else if (_loc_3 == 3)
            {
                _loc_5 = brt * (1 - sat);
                _loc_6 = brt * (1 - sat * _loc_4);
                _loc_7 = brt;
            }
            else if (_loc_3 == 4)
            {
                _loc_5 = brt * (1 - sat * (1 - _loc_4));
                _loc_6 = brt * (1 - sat);
                _loc_7 = brt;
            }
            else if (_loc_3 == 5)
            {
                _loc_5 = brt;
                _loc_6 = brt * (1 - sat);
                _loc_7 = brt * (1 - sat * _loc_4);
            }
            _loc_1.red = int(_loc_5 * 255 + 0.5);
            _loc_1.green = int(_loc_6 * 255 + 0.5);
            _loc_1.blue = int(_loc_7 * 255 + 0.5);
            return _loc_1;
        },*/
    };
    
})(FILTER);