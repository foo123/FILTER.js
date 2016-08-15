/**
*
* Affine Matrix Filter
*
* Distorts the target image according to an linear affine matrix mapping function
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var IMG = FILTER.ImArray, AM = FILTER.AffineMatrix, TypedArray = FILTER.Util.Array.typed,
    FUtil = FILTER.Util.Filter, eye = FUtil.am_eye, mult = FUtil.am_multiply,
    MODE = FILTER.MODE, toRad = FILTER.CONST.toRad, Sin = Math.sin, Cos = Math.cos, Tan = Math.tan
;

//
// AffineMatrixFilter
var AffineMatrixFilter = FILTER.Create({
    name: "AffineMatrixFilter"
    
    ,init: function AffineMatrixFilter( matrix ) {
        var self = this;
        self.matrix = matrix && matrix.length ? new AM(matrix) : null;
    }
    
    ,path: FILTER_FILTERS_PATH
    // parameters
    ,matrix: null
    ,mode: MODE.CLAMP
    ,color: 0
    
    ,dispose: function( ) {
        var self = this;
        self.matrix = null;
        self.color = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
             matrix: self.matrix
            ,mode: self.mode
            ,color: self.color
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.matrix = TypedArray( params.matrix, AM );
        self.mode = params.mode;
        self.color = params.color;
        return self;
    }
    
    ,flipX: function( ) {
        return this.set([
            -1, 0, 0, 1,
            0, 1, 0, 0
        ]);
    }
    
    ,flipY: function( ) {
        return this.set([
            1, 0, 0, 0,
            0, -1, 0, 1
        ]);
    }
    
    ,flipXY: function( ) {
        return this.set([
            -1, 0, 0, 1,
            0, -1, 0, 1
        ]);
    }
    
    ,translate: function( tx, ty, rel ) {
        return this.set(rel
        ? [
            1, 0, 0, tx,
            0, 1, 0, ty
        ]
        : [
            1, 0, tx, 0,
            0, 1, ty, 0
        ]);
    }
    ,shift: null
    
    ,rotate: function( theta ) {
        var s = Sin(theta), c = Cos(theta);
        return this.set([
            c, -s, 0, 0,
            s, c, 0, 0
        ]);
    }
    
    ,scale: function( sx, sy ) {
        return this.set([
            sx, 0, 0, 0,
            0, sy, 0, 0
        ]);
    }
    
    ,skew: function( thetax, thetay ) {
        return this.set([
            1, thetax ? Tan(thetax) : 0, 0, 0,
            thetay ? Tan(thetay) : 0, 1, 0, 0
        ]);
    }
    
    ,set: function( matrix ) {
        var self = this;
        self.matrix = self.matrix ? mult(self.matrix, matrix) : new AM(matrix); 
        return self;
    }
    
    ,reset: function( ) {
        this.matrix = null; 
        return this;
    }
    
    ,combineWith: function( filt ) {
        return this.set( filt.matrix );
    }
    
    // used for internal purposes
    ,_apply: function( im, w, h ) {
        var self = this, T = self.matrix;
        if ( !T ) return im;
        var x, y, yw, nx, ny, i, j, imLen = im.length,
            imArea = imLen>>>2, bx = w-1, by = imArea-w,
            dst = new IMG(imLen), color = self.color||0, r, g, b, a,
            COLOR = MODE.COLOR, CLAMP = MODE.CLAMP, WRAP = MODE.WRAP, IGNORE = MODE.IGNORE,
            Ta = T[0], Tb = T[1], Tx = T[2]+T[3]*bx,
            Tcw = T[4]*w, Td = T[5], Tyw = T[6]*w+T[7]*by,
            mode = self.mode || CLAMP
        ;
        
        if ( COLOR === mode )
        {
            a = (color >>> 24)&255;
            r = (color >>> 16)&255;
            g = (color >>> 8)&255;
            b = (color)&255;
            
            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,x++)
            {
                if (x>=w) { x=0; y++; yw+=w; }
                
                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;
                if ( 0>nx || nx>bx || 0>ny || ny>by )
                {
                    // color
                    dst[i] = r;   dst[i+1] = g;
                    dst[i+2] = b;  dst[i+3] = a;
                    continue;
                }
                j = ((nx|0) + (ny|0)) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        else if ( IGNORE === mode )
        {
            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,x++)
            {
                if (x>=w) { x=0; y++; yw+=w; }
                
                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;
                
                // ignore
                ny = ny > by || ny < 0 ? yw : ny;
                nx = nx > bx || nx < 0 ? x : nx;
                
                j = ((nx|0) + (ny|0)) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        else if ( WRAP === mode )
        {
            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,x++)
            {
                if (x>=w) { x=0; y++; yw+=w; }
                
                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;
                
                // wrap
                ny = ny > by ? ny-imArea : (ny < 0 ? ny+imArea : ny);
                nx = nx > bx ? nx-w : (nx < 0 ? nx+w : nx);
                
                j = ((nx|0) + (ny|0)) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        else //if ( CLAMP === mode )
        {
            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,x++)
            {
                if (x>=w) { x=0; y++; yw+=w; }
                
                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;
                
                // clamp
                ny = ny > by ? by : (ny < 0 ? 0 : ny);
                nx = nx > bx ? bx : (nx < 0 ? 0 : nx);
                
                j = ((nx|0) + (ny|0)) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        return dst;
    }
        
    ,canRun: function( ) {
        return this._isOn && this.matrix;
    }
});
// aliases
AffineMatrixFilter.prototype.shift = AffineMatrixFilter.prototype.translate;

}(FILTER);