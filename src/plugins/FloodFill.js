/**
*
* FloodFill, PatternFill Plugin(s)
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var TypedArray = FILTER.TypedArray, abs = Math.abs,
    min = Math.min, max = Math.max, ceil = Math.ceil,
    TILE = FILTER.MODE.TILE, STRETCH = FILTER.MODE.STRETCH,
    Array8U = FILTER.Array8U, Array32U = FILTER.Array32U;
    
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
            
            self.color = TypedArray( params.color, Array );
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
            l, i, x, x1, x2, yw, stack, slen, segment, notdone
        ;
        /*
         * Filled horizontal segment of scanline y for xl<=x<=xr.
         * Parent segment was on line y-dy.  dy=1 or -1
         */
        yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ||
            (im[x0+yw] === NC[0] && im[x0+yw+1] === NC[1] && im[x0+yw+2] === NC[2]) ) return im;
        
        // seed color is the image color at x0,y0 position
        OC = new Array8U(3);
        OC[0] = im[x0+yw]; OC[1] = im[x0+yw+1]; OC[2] = im[x0+yw+2];    
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
            if ( x >= x1 ) 
            {
                // goto skip:
                i = x+yw;
                while ( x<=x2 && !(abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                {
                    x+=4;
                    i = x+yw;
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
                while ( x<=xmax && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i  ] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                    x+=4; i = x+yw;
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack[slen++]=[yw, l, x-4, dy];
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack[slen++]=[yw, x2+4, x-4, -dy];	/* leak on right? */
                }
                i = x+yw;
    /*skip:*/   while ( x<=x2 && !(abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) ) 
                {
                    x+=4;
                    i = x+yw;
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
    ,pattern: null
    ,_pattern: null
    ,mode: TILE // FILTER.MODE.TILE, FILTER.MODE.STRETCH
    
    ,path: FILTER.getPath( ModuleFactory__FILTER_PLUGINS.moduleUri )
    
    ,init: function( x, y, pattern, offsetX, offsetY, mode, tolerance ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        if ( pattern ) self.setPattern( pattern );
        self.mode = mode || TILE;
        self.tolerance = tolerance || 0.0;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.pattern = null;
        self._pattern = null;
        self.x = null;
        self.y = null;
        self.offsetX = null;
        self.offsetY = null;
        self.tolerance = null;
        self.mode = null;
        self.$super('dispose');
        return self;
    }
    
    ,setPattern: function( pattern ) {
        var self = this;
        if ( pattern )
        {
            self.pattern = pattern;
            self._pattern = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, Pat = self.pattern;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 x: self.x
                ,y: self.y
                ,offsetX: self.offsetX
                ,offsetY: self.offsetY
                ,tolerance: self.tolerance
                ,mode: self.mode
                ,_pattern: self._pattern || (Pat ? { data: Pat.getData( ), width: Pat.width, height: Pat.height } : null)
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
            self.offsetX = params.offsetX;
            self.offsetY = params.offsetY;
            self.tolerance = params.tolerance;
            self.mode = params.mode;
            self.pattern = null;
            self._pattern = params._pattern;
            if ( self._pattern ) self._pattern.data = TypedArray( self._pattern.data, FILTER.ImArray );
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this, Pat = self.pattern;
        
        if ( !self._isOn || !(Pat || self._pattern) ) return im;
        
        // seems to have issues when tol is exactly 1.0
        var _pat = self._pattern || { data: Pat.getData( ), width: Pat.width, height: Pat.height },
            tol = ~~(255*(self.tolerance>=1.0 ? 0.999 : self.tolerance)), mode = self.mode,
            OC, dy = w<<2, pattern = _pat.data, pw = _pat.width, ph = _pat.height, 
            x0 = self.x, y0 = self.y, px0 = self.offsetX||0, py0 = self.offsetY||0,
            imSize = im.length, size = imSize>>>2, ymin = 0, ymax = imSize-dy, xmin = 0, xmax = (w-1)<<2,
            l, i, x, y, x1, x2, yw, pi, px, py, stack, slen, visited, segment, notdone
        ;
        
        if ( 0 > px0 ) px0 += pw;
        if ( 0 > py0 ) py0 += ph;
        
        y = y0; yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ) return im;
        
        // seed color is the image color at x0,y0 position
        OC = new Array8U(3);
        OC[0] = im[x0+yw]; OC[1] = im[x0+yw+1]; OC[2] = im[x0+yw+2];    
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
            if ( x >= x1 ) 
            {
                // goto skip:
                i = x+yw;
                while ( x<=x2 && !(!(visited[i>>>7]&(1<<((i>>>2)&31))) && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                {
                    x+=4;
                    i = x+yw;
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
                if ( yw+dy >= ymin && yw+dy <= ymax) stack[slen++]=[yw, l, x-4, dy, 0 < dy ? y+1 : y-1];
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack[slen++]=[yw, x2+4, x-4, -dy, 0 < dy ? y-1 : y+1];	/* leak on right? */
                }
                i = x+yw;
    /*skip:*/   while ( x<=x2 && !(!(visited[i>>>7]&(1<<((i>>>2)&31))) && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                {
                    x+=4;
                    i = x+yw;
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