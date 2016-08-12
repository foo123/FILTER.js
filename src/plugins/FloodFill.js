/**
*
* FloodFill, PatternFill Plugin(s)
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var TypedArray = FILTER.Util.Array.typed, abs = Math.abs,
    min = Math.min, max = Math.max, ceil = Math.ceil,
    MODE = FILTER.MODE, Array8U = FILTER.Array8U, Array32U = FILTER.Array32U;
    
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
    ,borderColor: null
    ,tolerance: 0.0
    
    ,path: FILTER_PLUGINS_PATH
    
    ,init: function( x, y, color, tolerance, borderColor ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.color = color || 0;
        self.tolerance = tolerance || 0.0;
        self.borderColor = borderColor === +borderColor ? +borderColor : null;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             color: self.color
            ,borderColor: self.borderColor
            ,x: self.x
            ,y: self.y
            ,tolerance: self.tolerance
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.color = params.color;
        self.borderColor = params.borderColor;
        self.x = params.x;
        self.y = params.y;
        self.tolerance = params.tolerance;
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
            color = self.color || 0, borderColor = self.borderColor,
            isBorderColor = borderColor === +borderColor, OC, NC, /*pix = 4,*/ dy = w<<2, 
            x0 = self.x, y0 = self.y, imSize = im.length,
            ymin = 0, ymax = imSize-dy, xmin = 0, xmax = (w-1)<<2,
            l, i, x, x1, x2, yw, stack, slen, segment, notdone
        ;
        /*
         * Filled horizontal segment of scanline y for xl<=x<=xr.
         * Parent segment was on line y-dy.  dy=1 or -1
         */
        yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ) return im;
        
        OC = new Array8U(3); NC = new Array8U(3);
        NC[0] = (color >>> 16) & 255; NC[1] = (color >>> 8) & 255; NC[2] = color & 255; //NC[3] = (color >>> 24) & 255;
        // seed color is the image color at x0,y0 position
        if ( isBorderColor )
        {
            OC[0] = (borderColor >>> 16) & 255; OC[1] = (borderColor >>> 8) & 255; OC[2] = borderColor & 255;
            if ( abs(OC[0]-im[x0+yw])<=tol && abs(OC[1]-im[x0+yw+1])<=tol && abs(OC[2]-im[x0+yw+2])<=tol ) return im;
        }
        else
        {
            if ( im[x0+yw] === NC[0] && im[x0+yw+1] === NC[1] && im[x0+yw+2] === NC[2] ) return im;
            OC[0] = im[x0+yw]; OC[1] = im[x0+yw+1]; OC[2] = im[x0+yw+2];
        }
        
        stack = new Array(imSize>>>2); slen = 0; // pre-allocate and soft push/pop for speed
        
        if ( yw+dy >= ymin && yw+dy <= ymax ) stack[slen++]=[yw, x0, x0, dy]; /* needed in some cases */
        /*if ( yw >= ymin && yw <= ymax)*/ stack[slen++]=[yw+dy, x0, x0, -dy]; /* seed segment (popped 1st) */
        
        while ( slen > 0 ) 
        {
            /* pop segment off stack and fill a neighboring scan line */
            segment = stack[--slen];
            yw = segment[0]+(dy=segment[3]); x1 = segment[1]; x2 = segment[2];
            
            /*
             * segment of scan line y-dy for x1<=x<=x2 was previously filled,
             * now explore adjacent pixels in scan line y
             */
            if ( isBorderColor )
            {
                for (x=x1; x>=xmin; x-=4)
                {
                    i = x+yw;
                    if ( abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                    {
                        break;
                    }
                    else
                    {
                        im[i  ] = NC[0];
                        im[i+1] = NC[1];
                        im[i+2] = NC[2];
                    }
                }
            }
            else
            {
                for (x=x1; x>=xmin; x-=4)
                {
                    i = x+yw;
                    if ( abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                    {
                        im[i  ] = NC[0];
                        im[i+1] = NC[1];
                        im[i+2] = NC[2];
                    }
                    else
                    {
                        break;
                    }
                }
            }
            if ( x >= x1 ) 
            {
                // goto skip:
                i = x+yw;
                if ( isBorderColor )
                {
                    while ( x<=x2 && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                else
                {
                    while ( x<=x2 && !(abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+4;
                if ( l < x1 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax ) stack[slen++]=[yw, l, x1-4, -dy];  /* leak on left? */
                }
                x = x1+4;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                i = x+yw;
                if ( isBorderColor )
                {
                    while ( x<=xmax && !(abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        im[i  ] = NC[0];
                        im[i+1] = NC[1];
                        im[i+2] = NC[2];
                        x+=4; i = x+yw;
                    }
                }
                else
                {
                    while ( x<=xmax && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                    {
                        im[i  ] = NC[0];
                        im[i+1] = NC[1];
                        im[i+2] = NC[2];
                        x+=4; i = x+yw;
                    }
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack[slen++]=[yw, l, x-4, dy];
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack[slen++]=[yw, x2+4, x-4, -dy];	/* leak on right? */
                }
        /*skip:*/   
                i = x+yw;
                if ( isBorderColor )
                {
                    while ( x<=x2 && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol ) 
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                else
                {
                    while ( x<=x2 && !(abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) ) 
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                l = x;
                notdone = (x <= x2);
            }
        }
        
        // return the new image data
        return im;
    }
});

FILTER.Create({
    name : "PatternFillFilter"
    ,x: 0
    ,y: 0
    ,offsetX: 0
    ,offsetY: 0
    ,tolerance: 0.0
    ,mode: MODE.TILE
    ,borderColor: null
    ,hasInputs: true
    
    ,path: FILTER_PLUGINS_PATH
    
    ,init: function( x, y, pattern, offsetX, offsetY, mode, tolerance, borderColor ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        if ( pattern ) self.setInput( "pattern", pattern );
        self.mode = mode || MODE.TILE;
        self.tolerance = tolerance || 0.0;
        self.borderColor = borderColor === +borderColor ? +borderColor : null;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.x = null;
        self.y = null;
        self.offsetX = null;
        self.offsetY = null;
        self.tolerance = null;
        self.mode = null;
        self.borderColor = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             x: self.x
            ,y: self.y
            ,offsetX: self.offsetX
            ,offsetY: self.offsetY
            ,tolerance: self.tolerance
            ,mode: self.mode
            ,borderColor: self.borderColor
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.x = params.x;
        self.y = params.y;
        self.offsetX = params.offsetX;
        self.offsetY = params.offsetY;
        self.tolerance = params.tolerance;
        self.mode = params.mode;
        self.borderColor = params.borderColor;
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this, Pat;
        
        if ( !self._isOn ) return im;
        
        Pat = self.input("pattern"); if ( !Pat ) return im;
        
        // seems to have issues when tol is exactly 1.0
        var tol = ~~(255*(self.tolerance>=1.0 ? 0.999 : self.tolerance)), mode = self.mode,
            borderColor = self.borderColor, isBorderColor = borderColor === +borderColor,
            OC, dy = w<<2, pattern = Pat[0], pw = Pat[1], ph = Pat[2], 
            x0 = self.x, y0 = self.y, px0 = self.offsetX||0, py0 = self.offsetY||0,
            imSize = im.length, size = imSize>>>2, ymin = 0, ymax = imSize-dy, xmin = 0, xmax = (w-1)<<2,
            l, i, x, y, x1, x2, yw, pi, px, py, stack, slen, visited, segment, notdone,
            STRETCH = MODE.STRETCH
        ;
        
        if ( 0 > px0 ) px0 += pw;
        if ( 0 > py0 ) py0 += ph;
        
        y = y0; yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ) return im;
        
        // seed color is the image color at x0,y0 position
        OC = new Array8U(3);
        if ( isBorderColor )
        {
            OC[0] = (borderColor >>> 16) & 255; OC[1] = (borderColor >>> 8) & 255; OC[2] = borderColor & 255;
            if ( abs(OC[0]-im[x0+yw])<=tol && abs(OC[1]-im[x0+yw+1])<=tol && abs(OC[2]-im[x0+yw+2])<=tol ) return im;
        }
        else
        {
            OC[0] = im[x0+yw]; OC[1] = im[x0+yw+1]; OC[2] = im[x0+yw+2];
        }
        
        stack = new Array(size); slen = 0; // pre-allocate and soft push/pop for speed
        visited = new Array32U(ceil(size/32));
        if ( yw+dy >= ymin && yw+dy <= ymax ) stack[slen++]=[yw, x0, x0, dy, y+1]; /* needed in some cases */
        /*if ( yw >= ymin && yw <= ymax)*/ stack[slen++]=[yw+dy, x0, x0, -dy, y]; /* seed segment (popped 1st) */
        
        while ( slen > 0 ) 
        {
            /* pop segment off stack and fill a neighboring scan line */
            segment = stack[--slen];
            yw = segment[0]+(dy=segment[3]); x1 = segment[1]; x2 = segment[2];
            y = segment[4];
            
            /*
             * segment of scan line y-dy for x1<=x<=x2 was previously filled,
             * now explore adjacent pixels in scan line y
             */
            if ( isBorderColor )
            {
                for (x=x1; x>=xmin; x-=4)
                {
                    i = x+yw;
                    if ( (visited[i>>>7]&(1<<((i>>>2)&31))) || (abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        break;
                    }
                    else
                    {
                        visited[i>>>7] |= 1<<((i>>>2)&31);
                        if ( STRETCH === mode )
                        {
                            px = ~~(pw*(x>>>2)/w);
                            py = ~~(ph*(y)/h);
                        }
                        else
                        {
                            px = ((x>>>2)+px0) % pw;
                            py = (y+py0) % ph;
                        }
                        pi = (px + py*pw) << 2;
                        im[i  ] = pattern[pi  ];
                        im[i+1] = pattern[pi+1];
                        im[i+2] = pattern[pi+2];
                    }
                }
            }
            else
            {
                for (x=x1; x>=xmin; x-=4)
                {
                    i = x+yw;
                    if ( !(visited[i>>>7]&(1<<((i>>>2)&31))) && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                    {
                        visited[i>>>7] |= 1<<((i>>>2)&31);
                        if ( STRETCH === mode )
                        {
                            px = ~~(pw*(x>>>2)/w);
                            py = ~~(ph*(y)/h);
                        }
                        else
                        {
                            px = ((x>>>2)+px0) % pw;
                            py = (y+py0) % ph;
                        }
                        pi = (px + py*pw) << 2;
                        im[i  ] = pattern[pi  ];
                        im[i+1] = pattern[pi+1];
                        im[i+2] = pattern[pi+2];
                    }
                    else
                    {
                        break;
                    }
                }
            }
            if ( x >= x1 ) 
            {
                // goto skip:
                i = x+yw;
                if ( isBorderColor )
                {
                    while ( (x<=x2 && (visited[i>>>7]&(1<<((i>>>2)&31)))) || (abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                else
                {
                    while ( x<=x2 && !(!(visited[i>>>7]&(1<<((i>>>2)&31))) && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+4;
                if ( l < x1 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack[slen++]=[yw, l, x1-4, -dy, 0 < dy ? y-1 : y+1];  /* leak on left? */
                }
                x = x1+4;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                i = x+yw;
                if ( isBorderColor )
                {
                    while ( x<=xmax && !(visited[i>>>7]&(1<<((i>>>2)&31))) && !(abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        visited[i>>>7] |= 1<<((i>>>2)&31);
                        if ( STRETCH === mode )
                        {
                            px = ~~(pw*(x>>>2)/w);
                            py = ~~(ph*(y)/h);
                        }
                        else
                        {
                            px = ((x>>>2)+px0) % pw;
                            py = (y+py0) % ph;
                        }
                        pi = (px + py*pw) << 2;
                        im[i  ] = pattern[pi  ];
                        im[i+1] = pattern[pi+1];
                        im[i+2] = pattern[pi+2];
                        x+=4; i = x+yw;
                    }
                }
                else
                {
                    while ( x<=xmax && !(visited[i>>>7]&(1<<((i>>>2)&31))) && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                    {
                        visited[i>>>7] |= 1<<((i>>>2)&31);
                        if ( STRETCH === mode )
                        {
                            px = ~~(pw*(x>>>2)/w);
                            py = ~~(ph*(y)/h);
                        }
                        else
                        {
                            px = ((x>>>2)+px0) % pw;
                            py = (y+py0) % ph;
                        }
                        pi = (px + py*pw) << 2;
                        im[i  ] = pattern[pi  ];
                        im[i+1] = pattern[pi+1];
                        im[i+2] = pattern[pi+2];
                        x+=4; i = x+yw;
                    }
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack[slen++]=[yw, l, x-4, dy, 0 < dy ? y+1 : y-1];
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack[slen++]=[yw, x2+4, x-4, -dy, 0 < dy ? y-1 : y+1];	/* leak on right? */
                }
      /*skip:*/   
                i = x+yw;
                if ( isBorderColor )
                {
                    while ( (x<=x2 && (visited[i>>>7]&(1<<((i>>>2)&31)))) || (abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                else
                {
                    while ( x<=x2 && !(!(visited[i>>>7]&(1<<((i>>>2)&31))) && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                    {
                        x+=4;
                        i = x+yw;
                    }
                }
                l = x;
                notdone = (x <= x2);
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);