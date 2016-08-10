/**
*
* Canny Edges Detector Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var Float32 = FILTER.Array32F, Int32 = FILTER.Array32I, //gradient_xy = FILTER.Util.Filter.GRAD2,
    GAUSSIAN_CUT_OFF = 0.005, MAGNITUDE_SCALE = 100, MAGNITUDE_LIMIT = 1000,
    MAGNITUDE_MAX = MAGNITUDE_SCALE * MAGNITUDE_LIMIT, PI2 = 2*Math.PI,
    exp = Math.exp, abs = Math.abs, floor = Math.floor, round = Math.round
;

// private utility methods
function normalize_contrast( im )
{
    var histogram = new Int32(256), remap = new Int32(256),
        i, size = im.length, area = size>>>2, sum, j, k, target;

    for (i=0; i<size; i+=4) histogram[ im[i] ]++;

    sum = 0; j = 0;
    for (i = 0; i<256; i++) 
    {
        sum += histogram[ i ];
        target = sum*255/area;
        for (k = j+1; k <=target; k++) remap[ k ] = i;
        j = target;
    }
    for (i=0; i<size; i+=4)
    {
        k = remap[ im[i] ];
        im[i] = k; im[i+1] = k; im[i+2] = k;
    }        
}
function gradient_and_non_maximal_supression( im, width, height, magnitude ) 
{
    //generate the gaussian convolution masks
    var kernelRadius = 2, kernelWidth = 14,
        size = im.length, picsize = magnitude.length,
        xConv = new Float32(picsize),
        yConv = new Float32(picsize),
        xGradient = new Float32(picsize),
        yGradient = new Float32(picsize),
        kernel = new Float32(kernelWidth),
        diffKernel = new Float32(kernelWidth),
        sigma2 = kernelRadius*kernelRadius, sigma22 = 2 * sigma2,
        factor = (PI2 * /*kernelRadius * kernelRadius*/sigma2),
        kwidth, g1, g2, g3, x;
    for (kwidth = 0; kwidth < kernelWidth; kwidth++) 
    {
        g1 = exp(-(kwidth * kwidth) / sigma22); // gaussian
        if ( g1 <= GAUSSIAN_CUT_OFF && kwidth >= 2 ) break;
        g2 = exp(-((x=kwidth - 0.5) * x) / sigma22); // gaussian
        g3 = exp(-((x=kwidth + 0.5) * x) / sigma22); // gaussian
        kernel[kwidth] = (g1 + g2 + g3) / 3 / factor;
        diffKernel[kwidth] = g3 - g2;
    }

    var initX = kwidth - 1,
        maxX = width - (kwidth - 1),
        initY = width * (kwidth - 1),
        maxY = width * (height - (kwidth - 1)),
        x, y, index, sumX, sumY, xOffset, yOffset,
        sum, i
    ;
    
    //perform convolution in x and y directions
    for (x=initX,y=initY; x<maxX; y+=width) 
    {
        if ( y >= maxY) { y=initY; x++; }
        index = x + y;
        sumX = im[index<<2] * kernel[0];
        sumY = sumX;
        xOffset = 1;
        yOffset = width;
        for(; xOffset < kwidth ;) 
        {
            sumY += kernel[xOffset] * (im[(index - yOffset)<<2] + im[(index + yOffset)<<2]);
            sumX += kernel[xOffset] * (im[(index - xOffset)<<2] + im[(index + xOffset)<<2]);
            yOffset += width; xOffset++;
        }
        yConv[index] = sumY;
        xConv[index] = sumX;
    }

    for (x=initX,y=initY; x<maxX; y+=width) 
    {
        if ( y >= maxY) { y=initY; x++; }
        sum = 0;
        index = x + y;
        for (i = 1; i < kwidth; i++) sum += diffKernel[i] * (yConv[index - i] - yConv[index + i]);
        xGradient[index] = sum;
    }
    
    maxX = width - kwidth;
    for (x=kwidth,y=initY; x<maxX; y+=width) 
    {
        if ( y >= maxY) { y=initY; x++; }
        sum = 0.0;
        index = x + y;
        yOffset = width;
        for (i = 1; i < kwidth; i++) 
        {
            sum += diffKernel[i] * (xConv[index - yOffset] - xConv[index + yOffset]);
            yOffset += width;
        }
        yGradient[index] = sum;
    }

    initX = kwidth;
    maxX = width - kwidth;
    initY = width * kwidth;
    maxY = width * (height - kwidth);
    var indexN, indexS, indexE, indexW,
        indexNW, indexNE, indexSW, indexSE,
        xGrad, yGrad, gradMag, tmp,
        nMag, sMag, eMag, wMag,
        nwMag, neMag, swMag, seMag
    ;
    for (x=initX,y=initY; x<maxX; y+=width) 
    {
        if ( y >= maxY ) {y=initY; x++; }
        
        index = x + y;
        indexN = index - width;
        indexS = index + width;
        indexW = index - 1;
        indexE = index + 1;
        indexNW = indexN - 1;
        indexNE = indexN + 1;
        indexSW = indexS - 1;
        indexSE = indexS + 1;
        
        xGrad = xGradient[index];
        yGrad = yGradient[index];
        gradMag = abs(xGrad)+abs(yGrad);

        //perform non-maximal supression
        nMag = abs(xGradient[indexN])+abs(yGradient[indexN]);
        sMag = abs(xGradient[indexS])+abs(yGradient[indexS]);
        wMag = abs(xGradient[indexW])+abs(yGradient[indexW]);
        eMag = abs(xGradient[indexE])+abs(yGradient[indexE]);
        neMag = abs(xGradient[indexNE])+abs(yGradient[indexNE]);
        seMag = abs(xGradient[indexSE])+abs(yGradient[indexSE]);
        swMag = abs(xGradient[indexSW])+abs(yGradient[indexSW]);
        nwMag = abs(xGradient[indexNW])+abs(yGradient[indexNW]);
        //tmp;
        /*
         * An explanation of what's happening here, for those who want
         * to understand the source: This performs the "non-maximal
         * supression" phase of the Canny edge detection in which we
         * need to compare the gradient magnitude to that in the
         * direction of the gradient; only if the value is a local
         * maximum do we consider the point as an edge candidate.
         * 
         * We need to break the comparison into a number of different
         * cases depending on the gradient direction so that the
         * appropriate values can be used. To avoid computing the
         * gradient direction, we use two simple comparisons: first we
         * check that the partial derivatives have the same sign (1)
         * and then we check which is larger (2). As a consequence, we
         * have reduced the problem to one of four identical cases that
         * each test the central gradient magnitude against the values at
         * two points with 'identical support'; what this means is that
         * the geometry required to accurately interpolate the magnitude
         * of gradient function at those points has an identical
         * geometry (upto right-angled-rotation/reflection).
         * 
         * When comparing the central gradient to the two interpolated
         * values, we avoid performing any divisions by multiplying both
         * sides of each inequality by the greater of the two partial
         * derivatives. The common comparand is stored in a temporary
         * variable (3) and reused in the mirror case (4).
         * 
         */
        if (xGrad * yGrad <= 0 /*(1)*/
            ? abs(xGrad) >= abs(yGrad) /*(2)*/
                ? (tmp = abs(xGrad * gradMag)) >= abs(yGrad * neMag - (xGrad + yGrad) * eMag) /*(3)*/
                    && tmp > abs(yGrad * swMag - (xGrad + yGrad) * wMag) /*(4)*/
                : (tmp = abs(yGrad * gradMag)) >= abs(xGrad * neMag - (yGrad + xGrad) * nMag) /*(3)*/
                    && tmp > abs(xGrad * swMag - (yGrad + xGrad) * sMag) /*(4)*/
            : abs(xGrad) >= abs(yGrad) /*(2)*/
                ? (tmp = abs(xGrad * gradMag)) >= abs(yGrad * seMag + (xGrad - yGrad) * eMag) /*(3)*/
                    && tmp > abs(yGrad * nwMag + (xGrad - yGrad) * wMag) /*(4)*/
                : (tmp = abs(yGrad * gradMag)) >= abs(xGrad * seMag + (yGrad - xGrad) * sMag) /*(3)*/
                    && tmp > abs(xGrad * nwMag + (yGrad - xGrad) * nMag) /*(4)*/
        ) 
        {
            magnitude[index] = gradMag >= MAGNITUDE_LIMIT ? MAGNITUDE_MAX : floor(MAGNITUDE_SCALE * gradMag);
            //NOTE: The orientation of the edge is not employed by this
            //implementation. It is a simple matter to compute it at
            //this point as: Math.atan2(yGrad, xGrad);
        } 
        else 
        {
            magnitude[index] = 0;
        }
    }
}
function hysteresis_and_threshold( im, w, h, grad_magn, low, high )
{
    var i, j, y, x, size = im.length, area = size >>> 2;
    for (i=0; i<size; i+=4) { im[i] = im[i+1] = im[i+2] = 0; }

    for (x=0,y=0,j=0,i=0; j<area; j++,i=j<<2,x++) 
    {
        if ( x >= w ){ x=0; y++; }
        if ( (0 === im[i]) && (grad_magn[j] >= high) )
            follow_edge( im, w, h, grad_magn, x, y, i, low );
    }
}
function follow_edge( im, w, h, grad_magn, x1, y1, i1, thresh )
{
    var x0 = x1 === 0 ? x1 : x1 - 1,
        x2 = x1 === w - 1 ? x1 : x1 + 1,
        y0 = y1 === 0 ? y1 : y1 - 1,
        y2 = y1 === h -1 ? y1 : y1 + 1,
        x, y, y0w = y0*w, yw, i, j;

    // threshold here
    im[i1] = im[i1+1] = im[i1+2] = 255;
    
    x = x0, y = y0; yw = y0w;
    while (x <= x2 && y <= y2)
    {
        j = x + yw; i = j << 2;
        if ( (y !== y1 || x !== x1) && (0 === im[i]) && (grad_magn[j] >= thresh) ) 
        {
            follow_edge( im, w, h, grad_magn, x, y, i, thresh );
            return;
        }
        y++; yw+=w; if ( y>y2 ){y=y0; yw=y0w; x++;}
    }
}

// an efficient Canny Edges Detector
// adapted from Java: http://www.tomgibara.com/computer-vision/canny-edge-detector
// http://en.wikipedia.org/wiki/Canny_edge_detector
FILTER.Create({
    name : "CannyEdgesFilter"
    
    ,low: 2.5
    ,high: 7.5
    ,contrastNormalized: false
    
    ,path: FILTER_PLUGINS_PATH
    
    ,init: function( lowThreshold, highThreshold, contrastNormalized ) {
        var self = this;
		self.low = arguments.length < 1 ? 2.5 : lowThreshold;
		self.high = arguments.length < 2 ? 7.5 : highThreshold;
        self.contrastNormalized = !!contrastNormalized;
    }
    
    ,thresholds: function( low, high ) {
        var self = this;
        self.low = low;
        self.high = high;
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 low: self.low
                ,high: self.high
                ,contrastNormalized: self.contrastNormalized
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.low = params.low;
            self.high = params.high;
            self.contrastNormalized = params.contrastNormalized;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this, area = im.length>>2, gradient_magnitude;
        
        // NOTE: assume image is already grayscale
        if ( self.contrastNormalized ) normalize_contrast( im );
        gradient_and_non_maximal_supression( im, w, h, gradient_magnitude=new Int32(area) );
        hysteresis_and_threshold( im, w, h, gradient_magnitude, round( self.low*MAGNITUDE_SCALE ), round( self.high*MAGNITUDE_SCALE ) );
        
        return im;
    }
});
    
}(FILTER);