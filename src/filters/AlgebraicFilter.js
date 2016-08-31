/**
*
* Algebraic Filter
*
* Algebraicaly combines input images
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var min = Math.min, max = Math.max, floor = Math.floor,
    A32F = FILTER.Array32F, notSupportClamp = FILTER._notSupportClamp;

// Algebraic Filter
FILTER.Create({
    name: "AlgebraicFilter"
    
    ,init: function AlgebraicFilter( matrix ) {
        var self = this;
        self.set( matrix );
    }
    
    ,path: FILTER_FILTERS_PATH
    ,matrix: null
    ,raw: false
    ,hasInputs: true
    
    ,dispose: function( ) {
        var self = this;
        self.matrix = null;
        self.raw = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            matrix: self.matrix
           ,raw: self.raw
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.matrix = params.matrix;
        self.raw = params.raw;
        return self;
    }
    
    ,fastGradient: function( d ) {
        return this;
    }
    
    ,set: function( matrix ) {
        var self = this;
        if ( matrix && matrix.length /*&& (matrix.length%7 === 0)*//*7N*/ )
        {
            //self.resetInputs( );
            /*for(var i=0,l=matrix; i<l; i++)
                if ( matrix[i][0] ) self.setInput(String(i+1), matrix[i][0]);*/
            self.matrix = matrix;
        }
        return self;
    }
    
    ,setInputValues: function( inputIndex, values ) {
        var self = this, index, matrix = self.matrix;
        if ( values )
        {
            if ( !matrix ) matrix = self.matrix = [1, 0, 0, 0, 0, null, null];
            index = (inputIndex-1)*7;
            if ( null != values.a ) matrix[index] = +values.a;
            if ( null != values.b ) matrix[index+1] = +values.b;
            if ( null != values.c ) matrix[index+2] = +values.c;
            if ( null != values.tx ) matrix[index+3] = +values.tx;
            if ( null != values.ty ) matrix[index+4] = +values.ty;
            if ( undef !== values.co ) matrix[index+5] = values.co;
            if ( undef !== values.ci ) matrix[index+6] = values.ci;
        }
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self.matrix = null;
        //self.resetInputs( );
        return self;
    }
    
    ,_apply: function( im, w, h ) {
        //"use asm";
        var self = this, matrix = self.matrix;
        if ( !matrix || !matrix.length ) return im;
        var i, j, k, ii, kk, x1, y1, x2, y2, tx, ty, c, a, b, ci, co, im2, w2, h2, wm, hm,
            ra, ga, ba, aa, rb, gb, bb, ab, v, applyArea,
            l = matrix.length, imLen = im.length, imArea = imLen>>>2, res = new A32F(imLen);
        
        k = 0; w2 = w; h2 = h; im2 = im;
        for(j=0; j<l; j+=7)
        {
            wm = min(w, w2); hm = min(h, h2); applyArea = wm*hm;
            
            c = matrix[j+0]; a = matrix[j+1]; b = matrix[j+2]||0;
            // make them relative
            tx = ((matrix[j+3]||0)*(w-1))|0; ty = ((matrix[j+4]||0)*(h-1)*w)|0;
            // specific channels, leave null for all channels
            co = matrix[j+5]; ci = matrix[j+6];
            
            if ( null !== ci && null !== co )
            {
                for(x2=0,y1=ty,y2=0,i=0; i<applyArea; i++,x2++)
                {
                    if ( x2 >= wm ) { x2=0; y1+=w; y2+=w2; }
                    x1 = x2+tx;
                    if ( 0 > x1 || x1 >= w || 0 > y1 || y1 >= imArea ) continue;
                    ii = (x1+y1)<<2; kk = (x2+y2)<<2;
                    res[ii+co] = c*res[ii+co] + a*im2[kk+ci] + b;
                }
            }
            else if ( null !== ci )
            {
                for(x2=0,y1=ty,y2=0,i=0; i<applyArea; i++,x2++)
                {
                    if ( x2 >= wm ) { x2=0; y1+=w; y2+=w2; }
                    x1 = x2+tx;
                    if ( 0 > x1 || x1 >= w || 0 > y1 || y1 >= imArea ) continue;
                    ii = (x1+y1)<<2; kk = (x2+y2)<<2;
                    v = a*im2[kk+ci] + b;
                    res[ii  ] = c*res[ii  ] + v;
                    res[ii+1] = c*res[ii+1] + v;
                    res[ii+2] = c*res[ii+2] + v;
                    res[ii+3] = c*res[ii+3] + v;
                }
            }
            else if ( null !== co )
            {
                ra = ((a>>>16)&255)/255; ga = ((a>>>8)&255)/255; ba = ((a)&255)/255; aa = ((a>>>24)&255)/255;
                rb = (b>>>16)&255; gb = (b>>>8)&255; bb = (b)&255; ab = (b>>>24)&255;
                for(x2=0,y1=ty,y2=0,i=0; i<applyArea; i++,x2++)
                {
                    if ( x2 >= wm ) { x2=0; y1+=w; y2+=w2; }
                    x1 = x2+tx;
                    if ( 0 > x1 || x1 >= w || 0 > y1 || y1 >= imArea ) continue;
                    ii = (x1+y1)<<2; kk = (x2+y2)<<2;
                    res[ii+co] = c*res[ii+co] + ra*im2[kk  ]+rb + ga*im2[kk+1]+gb + ba*im2[kk+2]+bb + aa*im2[kk+3]+ab;
                }
            }
            else //if ( null === ci && null === co )
            {
                for(x2=0,y1=ty,y2=0,i=0; i<applyArea; i++,x2++)
                {
                    if ( x2 >= wm ) { x2=0; y1+=w; y2+=w2; }
                    x1 = x2+tx;
                    if ( 0 > x1 || x1 >= w || 0 > y1 || y1 >= imArea ) continue;
                    ii = (x1+y1)<<2; kk = (x2+y2)<<2;
                    res[ii  ] = c*res[ii  ] + a*im2[kk  ] + b;
                    res[ii+1] = c*res[ii+1] + a*im2[kk+1] + b;
                    res[ii+2] = c*res[ii+2] + a*im2[kk+2] + b;
                    res[ii+3] = c*res[ii+3] + a*im2[kk+3] + b;
                }
            }
            
            im2 = self.input(++k);
            w2 = im2[1]; h2 = im2[2]; im2 = im2[0];
        }
        //if ( self.raw ) return res;
        
        if ( notSupportClamp )
        {
            for(i=0; i<imLen; i+=4)
            {
                im[i  ] = min(255,max(0,res[i  ]|0));
                im[i+1] = min(255,max(0,res[i+1]|0));
                im[i+2] = min(255,max(0,res[i+2]|0));
                im[i+3] = min(255,max(0,res[i+3]|0));
            }
        }
        else
        {
            for(i=0; i<imLen; i+=4)
            {
                im[i  ] = res[i  ]|0;
                im[i+1] = res[i+1]|0;
                im[i+2] = res[i+2]|0;
                im[i+3] = res[i+3]|0;
            }
        }
        return im;
    }
});

}(FILTER);