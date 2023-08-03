/**
*
* Blend Filter
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var HAS = 'hasOwnProperty', IMG = FILTER.ImArray, IMGcpy = FILTER.ImArrayCopy,
    stdMath = Math, Min = stdMath.min, Round = stdMath.round,
    hasArraySet = FILTER.Util.Array.hasArrayset, arrayset = FILTER.Util.Array.arrayset,
    notSupportClamp = FILTER._notSupportClamp, clamp = FILTER.Color.clampPixel, BLEND = FILTER.Color.Blend;

// Blend Filter, photoshop-like image blending
FILTER.Create({
    name: "BlendFilter"

    ,init: function BlendFilter(matrix) {
        var self = this;
        self.set(matrix);
    }

    ,path: FILTER.Path
    // parameters
    ,matrix: null
    ,hasInputs: true

    ,dispose: function() {
        var self = this;
        self.matrix = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
            matrix: self.matrix
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.matrix = params.matrix;
        return self;
    }

    ,set: function(matrix) {
        var self = this;
        if (matrix && matrix.length /*&& (matrix.length&3 === 0)*//*4N*/)
        {
            //self.resetInputs();
            self.matrix = matrix;
        }
        return self;
    }

    ,setInputValues: function(inputIndex, values) {
        var self = this, index, matrix = self.matrix;
        if (values)
        {
            if (!matrix) matrix = self.matrix = ["normal", 0, 0, 1];
            index = (inputIndex-1)*4;
            if (undef !== values.mode)    matrix[index  ] =  values.mode||"normal";
            if (null != values.startX)    matrix[index+1] = +values.startX;
            if (null != values.startY)    matrix[index+2] = +values.startY;
            if (null != values.enabled)   matrix[index+3] = !!values.enabled;
        }
        return self;
    }

    ,reset: function() {
        var self = this;
        self.matrix = null;
        self.resetInputs();
        return self;
    }

    ,_apply: function(im, w, h) {
        //"use asm";
        var self = this, matrix = self.matrix;
        if (!matrix || !matrix.length) return im;

        var i, j, j2, k, l = matrix.length, imLen = im.length, input,
            alpha, startX, startY, startX2, startY2, W, H, A, w2, h2,
            W1, W2, start, end, x, y, x2, y2, f, B,
            rb, gb, bb, ab, ra, ga, ba, aa, a;

        //B = im;
        // clone original image since same image may also blend with itself
        B = new IMG(imLen); if (hasArraySet) B.set(im); else arrayset(B, im);

        for (i=0,k=1; i<l; i+=4,++k)
        {
            if (!matrix[i+3]) continue; // not enabled, skip
            f = BLEND[matrix[i] || "normal"];
            if (!f) continue;

            input = self.input(k);
            if (!input) continue; // no input, skip
            A = input[0]; w2 = input[1]; h2 = input[2];

            startX = matrix[i+1]||0; startY = matrix[i+2]||0;
            startX2 = 0; startY2 = 0;
            if (startX < 0) {startX2 = -startX; startX = 0;}
            if (startY < 0) {startY2 = -startY; startY = 0;}
            if (startX >= w || startY >= h || startX2 >= w2 || startY2 >= h2) continue;

            startX = Round(startX); startY = Round(startY);
            startX2 = Round(startX2); startY2 = Round(startY2);
            W = Min(w-startX, w2-startX2); H = Min(h-startY, h2-startY2);
            if (W <= 0 || H <= 0) continue;

            // blend images
            x = startX; y = startY*w; x2 = startX2; y2 = startY2*w2; W1 = startX+W; W2 = startX2+W;
            if (notSupportClamp)
            {
                for (start=0,end=H*W; start<end; ++start)
                {
                    j = (x + y) << 2;
                    j2 = (x2 + y2) << 2;
                    rb = B[j  ];
                    gb = B[j+1];
                    bb = B[j+2];
                    ab = B[j+3]/255;
                    ra = A[j2  ];
                    ga = A[j2+1];
                    ba = A[j2+2];
                    aa = A[j2+3]/255;
                    a = aa + ab - aa*ab;
                    if (0 < a)
                    {
                        B[j  ] = clamp(Round(255*f(ab*rb/255, ab, aa*ra/255, aa)/a));
                        B[j+1] = clamp(Round(255*f(ab*gb/255, ab, aa*ga/255, aa)/a));
                        B[j+2] = clamp(Round(255*f(ab*bb/255, ab, aa*ba/255, aa)/a));
                        B[j+3] = clamp(Round(255*a));
                    }
                    else
                    {
                        B[j  ] = 0;
                        B[j+1] = 0;
                        B[j+2] = 0;
                        B[j+3] = 0;
                    }
                    // next pixels
                    if (++x >= W1) {x = startX; y += w;}
                    if (++x2 >= W2) {x2 = startX2; y2 += w2;}
                }
            }
            else
            {
                for (start=0,end=H*W; start<end; ++start)
                {
                    j = (x + y) << 2;
                    j2 = (x2 + y2) << 2;
                    rb = B[j  ];
                    gb = B[j+1];
                    bb = B[j+2];
                    ab = B[j+3]/255;
                    ra = A[j2  ];
                    ga = A[j2+1];
                    ba = A[j2+2];
                    aa = A[j2+3]/255;
                    a = aa + ab - aa*ab;
                    if (0 < a)
                    {
                        B[j  ] = Round(255*f(ab*rb/255, ab, aa*ra/255, aa)/a);
                        B[j+1] = Round(255*f(ab*gb/255, ab, aa*ga/255, aa)/a);
                        B[j+2] = Round(255*f(ab*bb/255, ab, aa*ba/255, aa)/a);
                        B[j+3] = Round(255*a);
                    }
                    else
                    {
                        B[j  ] = 0;
                        B[j+1] = 0;
                        B[j+2] = 0;
                        B[j+3] = 0;
                    }
                    // next pixels
                    if (++x >= W1) {x = startX; y += w;}
                    if (++x2 >= W2) {x2 = startX2; y2 += w2;}
                }
            }
        }
        return B;
    }
});
// aliases
FILTER.CombineFilter = FILTER.BlendFilter;

}(FILTER);