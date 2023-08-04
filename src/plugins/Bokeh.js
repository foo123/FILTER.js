/**
*
* Bokeh (Depth-of-Field)
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var stdMath = Math, Sqrt = stdMath.sqrt,
    Exp = stdMath.exp, Log = stdMath.log,
    Abs = stdMath.abs, Floor = stdMath.floor,
    notSupportClamp = FILTER._notSupportClamp,
    A32F = FILTER.Array32F;

// a simple bokeh (depth-of-field) filter
FILTER.Create({
    name: "BokehFilter"

    // parameters
    ,centerX: 0.0
    ,centerY: 0.0
    ,radius: 10
    ,amount: 10

    // this is the filter constructor
    ,init: function(centerX, centerY, radius, amount) {
        var self = this;
        self.centerX = centerX || 0.0;
        self.centerY = centerY || 0.0;
        self.radius = null == radius ? 10 : radius;
        self.amount = null == amount ? 10 : amount;
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,serialize: function() {
        var self = this;
        return {
             centerX: self.centerX
            ,centerY: self.centerY
            ,radius: self.radius
            ,amount: self.amount
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.centerX = params.centerX;
        self.centerY = params.centerY;
        self.radius = params.radius;
        self.amount = params.amount;
        return self;
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        if (!self._isOn) return im;
        var imLen = im.length, imArea,
            integral, integralLen, colR, colG, colB,
            rowLen, i, j, x , y, ty,
            cX = self.centerX||0, cY = self.centerY||0,
            r = self.radius, m = self.amount,
            d, dx, dy, dm, dM, blur, blurw, wt,
            xOff1, yOff1, xOff2, yOff2,
            p1, p2, p3, p4, t0, t1, t2,
            bx1, bx2, by1, by2;

        if (m <= 0) return im;

        imArea = (imLen>>>2);
        bx1=0; bx2=w-1; by1=0; by2=imArea-w;

        // make center relative
        cX = Floor(cX*(w-1));
        cY = Floor(cY*(h-1));

        integralLen = (imArea<<1)+imArea;  rowLen = (w<<1)+w;
        integral = new A32F(integralLen);

        // compute integral of image in one pass
        // first row
        i=0; j=0; x=0; colR=colG=colB=0;
        for (x=0; x<w; ++x, i+=4, j+=3)
        {
            colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
            integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
        }
        // other rows
        i=rowLen+w; j=0; x=0; colR=colG=colB=0;
        for (i=rowLen+w; i<imLen; i+=4, j+=3, ++x)
        {
            if (x>=w) {x=0; colR=colG=colB=0;}
            colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
            integral[j+rowLen]=integral[j]+colR;
            integral[j+rowLen+1]=integral[j+1]+colG;
            integral[j+rowLen+2]=integral[j+2]+colB;
        }


        // bokeh (depth-of-field) effect
        // is a kind of adaptive blurring depending on distance from a center
        // like the camera/eye is focused on a specific area and everything else appears increasingly blurred

        x=0; y=0; ty=0;
        for (i=0; i<imLen; i+=4, ++x)
        {
            // update image coordinates
            if (x>=w) {x=0; ++y; ty+=w;}

            // compute distance
            dx = Abs(x-cX); dy = Abs(y-cY);
            //d = Sqrt(dx*dx + dy*dy);
            dM = stdMath.max(dx, dy);
            dm = stdMath.min(dx, dy);
            d = dM ? dM*(1 + 0.43*dm/dM*dm/dM) : 0;  // approximation

            // calculate amount(radius) of blurring
            // depending on distance from focus center
            blur = d>r ? Log((d-r)*m)|0 : (d/r+0.5)|0; // smooth it a bit, around the radius edge condition

            if (blur > 0)
            {
                 blurw = blur*w; wt = 0.25/(blur*blur);

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                xOff1 = x - blur; yOff1 = ty - blurw;
                xOff2 = x + blur; yOff2 = ty + blurw;

                // fix borders
                if (xOff1<bx1) xOff1=bx1;
                else if (xOff2>bx2) xOff2=bx2;
                if (yOff1<by1) yOff1=by1;
                else if (yOff2>by2) yOff2=by2;

                // compute integral positions
                p1 = xOff1 + yOff1; p4 = xOff2 + yOff2; p2 = xOff2 + yOff1; p3 = xOff1 + yOff2;
                // arguably faster way to write p1*=3; etc..
                p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;

                // apply a fast box-blur to these pixels
                // compute matrix sum of these elements
                // (trying to avoid possible overflow in the process, order of summation can matter)
                t0 = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                t1 = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                t2 = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);

                // output
                if (notSupportClamp)
                {
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                }
                im[i] = t0|0;  im[i+1] = t1|0;  im[i+2] = t2|0;
                // alpha channel is not transformed
                //im[i+3] = im[i+3];
            }
        }
        // return the new image data
        return im;
    }
});

}(FILTER);