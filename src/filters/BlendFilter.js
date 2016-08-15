/**
*
* Blend Filter
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var HAS = 'hasOwnProperty', IMG = FILTER.ImArray, IMGcpy = FILTER.ImArrayCopy,
    Min = Math.min, Round = Math.round, hasArraySet = FILTER.Util.Array.hasArrayset,
    arrayset = FILTER.Util.Array.arrayset, notSupportClamp = FILTER._notSupportClamp, BLEND = FILTER.Color.Blend;

//
// Blend Filter, photoshop-like image blending
FILTER.Create({
    name: "BlendFilter"
    
    ,init: function BlendFilter( matrix ) { 
        var self = this;
        self.set( matrix );
    }
    
    ,path: FILTER_FILTERS_PATH
    // parameters
    ,matrix: null
    ,hasInputs: true
    
    ,dispose: function( ) {
        var self = this;
        self.matrix = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            matrix: self.matrix
        };
    }
    
    ,unserialize: function( params ) {
        var self = this;
        self.matrix = params.matrix;
        return self;
    }
    
    ,set: function( matrix ) {
        var self = this;
        if ( matrix && matrix.length /*&& (matrix.length&3 === 0)*//*4N*/ )
        {
            //self.resetInputs( );
            self.matrix = matrix;
        }
        return self;
    }
    
    ,setInputValues: function( inputIndex, values ) {
        var self = this, index, matrix = self.matrix;
        if ( values )
        {
            if ( !matrix ) matrix = self.matrix = ["normal", 0, 0, 1, 1];
            index = (inputIndex-1)<<2;
            if ( undef !== values.mode )    matrix[index  ] =  values.mode||"normal";
            if ( null != values.startX )    matrix[index+1] = +values.startX;
            if ( null != values.startY )    matrix[index+2] = +values.startY;
            if ( null != values.alpha )     matrix[index+3] = +values.alpha;
            if ( null != values.enabled )   matrix[index+4] = !!values.enabled;
        }
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self.matrix = null;
        self.resetInputs( );
        return self;
    }
    
    ,_apply: function(im, w, h) {
        var self = this, matrix = self.matrix;
        if ( !matrix || !matrix.length ) return im;
        
        var i, k, l = matrix.length, imLen = im.length, input,
            alpha, startX, startY, startX2, startY2, W, H, im2, w2, h2, 
            W1, W2, start, end, x, y, x2, y2, pix2, blend, mode, blended;
        
        //blended = im;
        // clone original image since same image may also blend with itself
        blended = new IMG(imLen); if ( hasArraySet ) blended.set( im ); else arrayset(blended, im);
        
        for(i=0,k=1; i<l; i+=5,k++)
        {
            if ( !matrix[i+4] ) continue; // not enabled, skip
            alpha = matrix[i+3]||0; if ( 0 === alpha ) continue; // 0 alpha, skip
            mode = matrix[i]||"normal"; blend = BLEND[HAS](mode)?BLEND[mode]:null; if ( !blend ) continue;
            
            input = self.input(k); if ( !input ) continue; // no input, skip
            im2 = input[0]; w2 = input[1]; h2 = input[2];
            
            startX = matrix[i+1]||0; startY = matrix[i+2]||0;
            startX2 = 0; startY2 = 0;
            if ( startX < 0 ) { startX2 = -startX; startX = 0; }
            if ( startY < 0 ) { startY2 = -startY; startY = 0; }
            if ( startX >= w || startY >= h || startX2 >= w2 || startY2 >= h2 ) continue;
            
            startX = Round(startX); startY = Round(startY);
            startX2 = Round(startX2); startY2 = Round(startY2);
            W = Min(w-startX, w2-startX2); H = Min(h-startY, h2-startY2);
            if ( W <= 0 || H <= 0 ) continue;
            
            // blend images
            x = startX; y = startY*w; x2 = startX2; y2 = startY2*w2; W1 = startX+W; W2 = startX2+W;
            for(start=0,end=H*W; start<end; start++)
            {
                pix2 = (x2 + y2)<<2;
                // blend only if im2 has opacity in this point
                if ( 0 < im2[pix2+3] ) blend(blended, im2, (x + y)<<2, pix2, alpha, notSupportClamp);
                // next pixels
                if ( ++x >= W1 ) { x = startX; y += w; }
                if ( ++x2 >= W2 ) { x2 = startX2; y2 += w2; }
            }
        }
        return blended; 
    }
});
// aliases
FILTER.CombineFilter = FILTER.BlendFilter;

}(FILTER);