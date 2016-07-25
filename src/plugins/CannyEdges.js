/**
*
* Canny Edges Detector Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var Float32 = FILTER.Array32F, Int32 = FILTER.Array32I,
    GAUSSIAN_CUT_OFF = 0.005,
    MAGNITUDE_SCALE = 100,
    MAGNITUDE_LIMIT = 1000,
    MAGNITUDE_MAX = MAGNITUDE_SCALE * MAGNITUDE_LIMIT,
    PI2 = FILTER.CONST.PI2, abs = Math.abs, exp = Math.exp,
    hypot
;

// private utility methods
//NOTE: It is quite feasible to replace the implementation of this method
//with one which only loosely approximates the hypot function. I've tested
//simple approximations such as Math.abs(x) + Math.abs(y) and they work fine.
hypot = Math.hypot 
        ? Math.hypot 
        : /*function( x, y ){
            var absx = abs(x), 
                absy = abs(y),
                r, max;
            // avoid overflows
            if ( absx > absy )
            {
                max = absx;
                r = absy / max;
                
            }
            else
            {
                max = absy;
                if ( 0 == max ) return 0;
                r = absx / max;
            }
            return max*Math.sqrt(1.0 + r*r);
        }*/
        function(x, y){ return abs(x)+abs(y); };
        
/*function gaussian(x, sigma2) 
{
    return exp(-(x * x) / (2 * sigma2)); //sigma * sigma
}*/

function computeGradients(data, width, height, magnitude, kernelRadius, kernelWidth) 
{
    
    //generate the gaussian convolution masks
    var picsize = data.length,
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
    for (x = initX; x < maxX; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
            index = x + y;
            sumX = data[index] * kernel[0];
            sumY = sumX;
            xOffset = 1;
            yOffset = width;
            for(; xOffset < kwidth ;) 
            {
                sumY += kernel[xOffset] * (data[index - yOffset] + data[index + yOffset]);
                sumX += kernel[xOffset] * (data[index - xOffset] + data[index + xOffset]);
                yOffset += width;
                xOffset++;
            }
            
            yConv[index] = sumY;
            xConv[index] = sumX;
        }

    }

    for (x = initX; x < maxX; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
            sum = 0;
            index = x + y;
            for (i = 1; i < kwidth; i++)
                sum += diffKernel[i] * (yConv[index - i] - yConv[index + i]);

            xGradient[index] = sum;
        }

    }

    for (x = kwidth; x < width - kwidth; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
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
    for (x = initX; x < maxX; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
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
            gradMag = hypot(xGrad, yGrad);

            //perform non-maximal supression
            nMag = hypot(xGradient[indexN], yGradient[indexN]);
            sMag = hypot(xGradient[indexS], yGradient[indexS]);
            wMag = hypot(xGradient[indexW], yGradient[indexW]);
            eMag = hypot(xGradient[indexE], yGradient[indexE]);
            neMag = hypot(xGradient[indexNE], yGradient[indexNE]);
            seMag = hypot(xGradient[indexSE], yGradient[indexSE]);
            swMag = hypot(xGradient[indexSW], yGradient[indexSW]);
            nwMag = hypot(xGradient[indexNW], yGradient[indexNW]);
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
                : abs(xGrad) >= Math.abs(yGrad) /*(2)*/
                    ? (tmp = abs(xGrad * gradMag)) >= abs(yGrad * seMag + (xGrad - yGrad) * eMag) /*(3)*/
                        && tmp > abs(yGrad * nwMag + (xGrad - yGrad) * wMag) /*(4)*/
                    : (tmp =abs(yGrad * gradMag)) >= abs(xGrad * seMag + (yGrad - xGrad) * sMag) /*(3)*/
                        && tmp > abs(xGrad * nwMag + (yGrad - xGrad) * nMag) /*(4)*/
            ) 
            {
                magnitude[index] = gradMag >= MAGNITUDE_LIMIT ? MAGNITUDE_MAX : Math.floor(MAGNITUDE_SCALE * gradMag);
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
}

function performHysteresis(data, width, height, magnitude, low, high) 
{
    //NOTE: this implementation reuses the data array to store both
    //luminance data from the image, and edge intensity from the processing.
    //This is done for memory efficiency, other implementations may wish
    //to separate these functions.
    //Arrays.fill(data, 0);
    var offset = 0, i, y, x, size = data.length;
    for (i=0; i<size; i++) data[i] = 0;

    x = 0; y = 0;
    for (offset=0; offset<size; offset++,x++) 
    {
        if ( x >= width ){x=0; y++;}
        if ( 0 === data[offset] && magnitude[offset] >= high ) 
        {
            follow(data, width, height, magnitude, x, y, offset, low);
        }
    }
}

function follow(data, width, height, magnitude, x1, y1, i1, threshold) 
{
    var
        x0 = x1 == 0 ? x1 : x1 - 1,
        x2 = x1 == width - 1 ? x1 : x1 + 1,
        y0 = y1 == 0 ? y1 : y1 - 1,
        y2 = y1 == height -1 ? y1 : y1 + 1,
        x, y, i2
    ;
    
    data[i1] = magnitude[i1];
    x = x0, y = y0;
    while (x <= x2 && y <= y2)
    {
        i2 = x + y * width;
        if ((y != y1 || x != x1)
            && 0 === data[i2]
            && magnitude[i2] >= threshold
        ) 
        {
            follow(data, width, height, magnitude, x, y, i2, threshold);
            return;
        }
        y++; if ( y>y2 ){y=y0; x++;}
    }
}

/*function luminance(r, g, b) 
{
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}*/

function readLuminance(im, data) 
{
    var i, di, r, g, b, size = im.length, 
        LR = FILTER.LUMA[0], LG = FILTER.LUMA[1], LB = FILTER.LUMA[2];
    for (i=0,di=0; i<size; i+=4,di++) 
    {
        r = im[i]; g = im[i+1]; b = im[i+2];
        data[di] = ~~(LR * r + LG * g + LB * b + 0.5);//luminance(r, g, b);
    }
}

function normalizeContrast(data) 
{
    var histogram = new Int32(256),
        remap = new Int32(256),
        i, size = data.length, 
        sum, j, k, target;
    
    for (i=0; i<size; i++) histogram[data[i]]++;
    
    sum = 0; j = 0;
    for (i = 0; i<256; i++) 
    {
        sum += histogram[i];
        target = sum*255/size;
        for (k = j+1; k <=target; k++) remap[k] = i;
        j = target;
    }
    
    for (i=0; i<size; i++) data[i] = remap[data[i]];
}

function thresholdEdges(im, data) 
{
    var i, di, size = im.length, v;
    for (i=0,di=0; i<size; i+=4,di++) 
    {
        v = data[di] > 0 ? 255 : 0;
        im[i] = im[i+1] = im[i+2] = v;
        //im[i+3] = 255;
    }
}

// an efficient Canny Edges Detector
// adapted from Java: http://www.tomgibara.com/computer-vision/canny-edge-detector
// http://en.wikipedia.org/wiki/Canny_edge_detector
FILTER.Create({
    name : "CannyEdgesFilter"
    
    ,low: 2.5
    ,high: 7.5
    ,gaussRadius: 2
    ,gaussWidth: 16
    ,contrastNormalized: false
    
    ,path: FILTER_PLUGINS_PATH
    
    ,init: function( lowThreshold, highThreshold, gaussianKernelRadius, gaussianKernelWidth, contrastNormalized ) {
        var self = this;
		self.low = arguments.length < 1 ? 2.5 : lowThreshold;
		self.high = arguments.length < 2 ? 7.5 : highThreshold;
		self.gaussRadius = arguments.length < 3 ? 2 : gaussianKernelRadius;
		self.gaussWidth = arguments.length < 4 ? 16 : gaussianKernelWidth;
        self.contrastNormalized = !!contrastNormalized;
    }
    
    ,thresholds: function( low, high ) {
        var self = this;
        self.low = low;
        self.high = high;
        return self;
    }
    
    ,kernel: function( radius, width ) {
        var self = this;
        self.gaussRadius = radius;
        self.gaussWidth = width;
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
                ,gaussRadius: self.gaussRadius
                ,gaussWidth: self.gaussWidth
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
            self.gaussRadius = params.gaussRadius;
            self.gaussWidth = params.gaussWidth;
            self.contrastNormalized = params.contrastNormalized;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this, picsize = im.length>>2, 
            low, high, data, magnitude;
        
        // init arrays
        data = new Int32(picsize);
        magnitude = new Int32(picsize);
        low = Math.round( self.low * MAGNITUDE_SCALE );
        high = Math.round( self.high * MAGNITUDE_SCALE );
        
        readLuminance( im, data );
        
        if ( self.contrastNormalized ) normalizeContrast( data );
        
        computeGradients( 
            data, w, h, magnitude, 
            self.gaussRadius, self.gaussWidth 
        );
        
        performHysteresis( data, w, h, magnitude, low, high );
        
        thresholdEdges( im, data );
        
        return im;
    }
});
    
}(FILTER);