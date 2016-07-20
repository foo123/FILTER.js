/**
*
* FloodFill Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

// a fast flood fill filter using scanline algorithm
// adapted from: A Seed Fill Algorithm, by Paul Heckbert from "Graphics Gems", Academic Press, 1990
// http://en.wikipedia.org/wiki/Flood_fill
// http://www.codeproject.com/Articles/6017/QuickFill-An-efficient-flood-fill-algorithm
// http://www.codeproject.com/Articles/16405/Queue-Linear-Flood-Fill-A-Fast-Flood-Fill-Algorith
FILTER.Create({
    name : "FloodFillFilter"
    ,x: 0
    ,y: 0
    ,color: null
    ,tolerance: 0.0
    
    ,path: FILTER.getPath( ModuleFactory__FILTER_PLUGINS.moduleUri )
    
    ,init: function( x, y, color, tolerance ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.color = color || [0,0,0];
        self.tolerance = tolerance || 0.0;
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
    /* adapted from:
     * A Seed Fill Algorithm
     * by Paul Heckbert
     * from "Graphics Gems", Academic Press, 1990
     */
    ,apply: function(im, w, h/*, image*/) {
        var self = this, 
            /* seems to have issues when tol is exactly 1.0*/
            tol = ~~(255*(self.tolerance>=1.0 ? 0.999 : self.tolerance)), 
            OC, NC = self.color, /*pix = 4,*/ dy = w<<2, 
            x0 = self.x, y0 = self.y, imSize = im.length, 
            ymin = 0, ymax = imSize-dy, xmin = 0, xmax = (w-1)<<2,
            l, i, x, x1, x2, yw, stack, segment, notdone, abs = Math.abs
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
                i = x+yw;
                if ( abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                }
                else
                {
                    break;
                }
            }
            if ( x >= x1 ) 
            {
                // goto skip:
                while ( x<=x2 && !(abs(OC[0]-im[x+yw])<=tol && abs(OC[1]-im[x+yw+1])<=tol && abs(OC[2]-im[x+yw+2])<=tol) ) 
                    x+=4;
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
                i = x+yw;
                while ( x<=xmax && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                    x+=4; i = x+yw;
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, l, x-4, dy]);
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, x2+4, x-4, -dy]);	/* leak on right? */
                }
    /*skip:*/   while ( x<=x2 && !(abs(OC[0]-im[x+yw])<=tol && abs(OC[1]-im[x+yw+1])<=tol && abs(OC[2]-im[x+yw+2])<=tol) ) 
                    x+=4;
                l = x;
                notdone = (x <= x2);
            }
        }
        
        // return the new image data
        return im;
    }
});

/*    
FILTER.Create({
    name : "PatternFillFilter"
    ,x: 0
    ,y: 0
    ,tolerance: 0.0
    ,pattern: null
    ,_pattern: null
    ,mode: 0 // 0 tile, 1 stretch
    
    ,path: FILTER.getPath( ModuleFactory__FILTER_PLUGINS.moduleUri )
    
    ,init: function( x, y, pattern, mode, tolerance ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.setPattern( pattern );
        self.mode = mode || 0;
        self.tolerance = tolerance || 0.0;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.pattern = null;
        self._pattern = null;
        self.$super('dispose');
        return self;
    }
    
    ,setPattern( pattern ) {
        var self = this;
        if ( pattern instanceof FILTER.Image )
        {
            self.pattern = pattern;
            self._pattern = {data:pattern.getData(), width:pattern.width, height:pattern.height};
        }
        else
        {
            self.pattern = null;
            self._pattern = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 x: self.x
                ,y: self.y
                ,tolerance: self.tolerance
                ,mode: self.mode
                ,_pattern: self._pattern
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.x = params.x;
            self.y = params.y;
            self.tolerance = params.tolerance;
            self.mode = params.mode;
            self._pattern = params._pattern;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
         if ( !this._pattern ) return im;
        var self = this, 
            // seems to have issues when tol is exactly 1.0
            tol = ~~(255*(self.tolerance>=1.0 ? 0.999 : self.tolerance)), 
            OC, dy = w<<2, pattern = self._pattern.data,
            pw = self._pattern.width, ph = self._pattern.height, 
            x0 = self.x, y0 = self.y, imSize = im.length, 
            ymin = 0, ymax = imSize-dy, xmin = 0, xmax = (w-1)<<2,
            l, i, x, x1, x2, yw, stack, segment, notdone, abs = Math.abs

            yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ) return im;
        
        stack = [];
        if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, x0, x0, dy]); // needed in some cases 
        stack.push([yw+dy, x0, x0, -dy]); // seed segment (popped 1st)
        
        while ( stack.length ) 
        {
            // pop segment off stack and fill a neighboring scan line 
            segment = stack.pop();
            yw = segment[0]+(dy=segment[3]); x1 = segment[1]; x2 = segment[2];
            
            // segment of scan line y-dy for x1<=x<=x2 was previously filled,
            // now explore adjacent pixels in scan line y
            for (x=x1; x>=xmin; x-=4)
            {
                i = x+yw;
                if ( abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                }
                else
                {
                    break;
                }
            }
            if ( x >= x1 ) 
            {
                // goto skip:
                while ( x<=x2 && !(abs(OC[0]-im[x+yw])<=tol && abs(OC[1]-im[x+yw+1])<=tol && abs(OC[2]-im[x+yw+2])<=tol) ) 
                    x+=4;
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+4;
                if ( l < x1 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, l, x1-4, -dy]);  // leak on left?
                }
                x = x1+4;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                i = x+yw;
                while ( x<=xmax && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                    x+=4; i = x+yw;
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, l, x-4, dy]);
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, x2+4, x-4, -dy]);	// leak on right?
                }
    /*skip:* /   while ( x<=x2 && !(abs(OC[0]-im[x+yw])<=tol && abs(OC[1]-im[x+yw+1])<=tol && abs(OC[2]-im[x+yw+2])<=tol) ) 
                    x+=4;
                l = x;
                notdone = (x <= x2);
            }
        }
        
        // return the new image data
        return im;
    }
});
*/
}(FILTER);