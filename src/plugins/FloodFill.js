/**
*
* FloodFill Plugin
* @package FILTER.js
*
**/
!function(FILTER){
@@USE_STRICT@@

// a fast flood fill filter  http://en.wikipedia.org/wiki/Flood_fill
// http://www.codeproject.com/Articles/6017/QuickFill-An-efficient-flood-fill-algorithm
// http://www.codeproject.com/Articles/16405/Queue-Linear-Flood-Fill-A-Fast-Flood-Fill-Algorith
FILTER.Create({
    name : "FloodFillFilter"
    ,x: 0
    ,y: 0
    ,color: null
    ,tolerance: 0
    
    ,path: FILTER.getPath( exports.AMD )
    
    ,init: function( x, y, color, tolerance ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.color = color || [0,0,0];
        self.tolerance = tolerance || 0;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 color: self.color
                ,x: self.x
                ,y: self.y
                ,tolerance: self.tolerance
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.color = params.color;
            self.x = params.x;
            self.y = params.y;
            self.tolerance = params.tolerance;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        /* adapted from:
         * A Seed Fill Algorithm
         * by Paul Heckbert
         * from "Graphics Gems", Academic Press, 1990
         *
         */
        var self = this, tol = self.tolerance,
            OC, NC = self.color, /*pix = 4,*/ dy = w<<2, 
            x0 = self.x, y0 = self.y, imSize = im.length, 
            ymin = 0, ymax = imSize-dy, xmin = 0, xmax = (w-1)<<2,
            l, x, x1, x2, yw, stack, segment, notdone
        /*
         * Filled horizontal segment of scanline y for xl<=x<=xr.
         * Parent segment was on line y-dy.  dy=1 or -1
         */
        yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ||
            (im[x0+yw] === NC[0] && im[x0+yw+1] === NC[1] && im[x0+yw+2] === NC[2]) ) return im;
        
        // seed color is the image color at x0,y0 position
        OC = [im[x0+yw], im[x0+yw+1], im[x0+yw+2]];    
        stack = [];
        if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, x0, x0, dy]); /* needed in some cases */
        /*if ( yw >= ymin && yw <= ymax)*/ stack.push([yw+dy, x0, x0, -dy]); /* seed segment (popped 1st) */
        
        while ( stack.length ) 
        {
            /* pop segment off stack and fill a neighboring scan line */
            segment = stack.pop();
            yw = segment[0]+(dy=segment[3]); x1 = segment[1]; x2 = segment[2];
            
            /*
             * segment of scan line y-dy for x1<=x<=x2 was previously filled,
             * now explore adjacent pixels in scan line y
             */
            for (x=x1; x>=xmin; x-=4)
            {
                if ( OC[0] === im[x+yw] && OC[1] === im[x+yw+1] && OC[2] === im[x+yw+2] )
                {
                    im[x+yw] = NC[0];
                    im[x+yw+1] = NC[1];
                    im[x+yw+2] = NC[2];
                }
                else
                {
                    break;
                }
            }
            if ( x >= x1 ) 
            {
                // goto skip:
                while ( x<=x2 && !(OC[0] === im[x+yw] && OC[1] === im[x+yw+1] && OC[2] === im[x+yw+2]) ) x+=4;
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+4;
                if ( l < x1 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, l, x1-4, -dy]);  /* leak on left? */
                }
                x = x1+4;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                while ( x<=xmax && (OC[0] === im[x+yw] && OC[1] === im[x+yw+1] && OC[2] === im[x+yw+2]) )
                {
                    im[x+yw] = NC[0];
                    im[x+yw+1] = NC[1];
                    im[x+yw+2] = NC[2];
                    x+=4;
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, l, x-4, dy]);
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, x2+4, x-4, -dy]);	/* leak on right? */
                }
    /*skip:*/   while ( x<=x2 && !(OC[0] === im[x+yw] && OC[1] === im[x+yw+1] && OC[2] === im[x+yw+2]) ) x+=4;
                l = x;
                notdone = (x <= x2);
            }
        }
        
        // return the new image data
        return im;
    }
});
    
}(FILTER);