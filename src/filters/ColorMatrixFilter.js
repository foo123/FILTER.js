/**
*
* Color Matrix Filter(s)
*
* Changes target coloring combining current pixel color values according to Matrix
*
* (matrix is 4x5 array of values which are (eg for row 1: Red value): 
* New red Value=Multiplier for red value, multiplier for Green value, multiplier for Blue Value, Multiplier for Alpha Value,constant  bias term
* other rows are similar but for new Green, Blue and Alpha values respectively) 
*
* @param colorMatrix Optional (a color matrix as an array of values)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var CHANNEL = FILTER.CHANNEL, CM = FILTER.ColorMatrix, A8U = FILTER.Array8U, eye = FILTER.Util.Filter.cm_eye,
    cm_mult = FILTER.Util.Filter.cm_multiply, rechannel = FILTER.Util.Filter.cm_rechannel,
    Sin = Math.sin, Cos = Math.cos, toRad = FILTER.CONST.toRad, toDeg = FILTER.CONST.toDeg,
    TypedArray = FILTER.Util.Array.typed, notSupportClamp = FILTER._notSupportClamp
;

function cm_blend( m1, m2, amount )
{
    var m = new CM(20);
    
    // unroll the loop completely
    m[ 0 ] = m1[0] + amount * (m2[0]-m1[0]);
    m[ 1 ] = m1[1] + amount * (m2[1]-m1[1]);
    m[ 2 ] = m1[2] + amount * (m2[2]-m1[2]);
    m[ 3 ] = m1[3] + amount * (m2[3]-m1[3]);
    m[ 4 ] = m1[4] + amount * (m2[4]-m1[4]);

    m[ 5 ] = m1[5] + amount * (m2[5]-m1[5]);
    m[ 6 ] = m1[6] + amount * (m2[6]-m1[6]);
    m[ 7 ] = m1[7] + amount * (m2[7]-m1[7]);
    m[ 8 ] = m1[8] + amount * (m2[8]-m1[0]);
    m[ 9 ] = m1[9] + amount * (m2[9]-m1[9]);
    
    m[ 10 ] = m1[10] + amount * (m2[10]-m1[10]);
    m[ 11 ] = m1[11] + amount * (m2[11]-m1[11]);
    m[ 12 ] = m1[12] + amount * (m2[12]-m1[12]);
    m[ 13 ] = m1[13] + amount * (m2[13]-m1[13]);
    m[ 14 ] = m1[14] + amount * (m2[14]-m1[14]);
    
    m[ 15 ] = m1[15] + amount * (m2[15]-m1[15]);
    m[ 16 ] = m1[16] + amount * (m2[16]-m1[16]);
    m[ 17 ] = m1[17] + amount * (m2[17]-m1[17]);
    m[ 18 ] = m1[18] + amount * (m2[18]-m1[18]);
    m[ 19 ] = m1[19] + amount * (m2[19]-m1[19]);
    
    //while (i < 20) { m[i] = (inv_amount * m1[i]) + (amount * m2[i]);  i++; };
    return m;
}

//
//
// ColorMatrixFilter
var ColorMatrixFilter = FILTER.ColorMatrixFilter = FILTER.Class( FILTER.Filter, {
    name: "ColorMatrixFilter"
    
    ,constructor: function( matrix ) {
        var self = this;
        self.$super('constructor');
        if ( matrix && matrix.length )
        {
            self._matrix = new CM(matrix);
        }    
        else
        {
            // identity matrix
            self._matrix = null;
        }
        
        /*if ( FILTER.useWebGL )
        {
            self._webglInstance = FILTER.WebGLColorMatrixFilterInstance || null;
        }*/
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_matrix: null
    ,_webglInstance: null
    
    ,dispose: function( ) {
        var self = this;
        
        self.$super('dispose');
        
        self._webglInstance = null;
        self._matrix = null;
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _matrix: self._matrix
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._matrix = TypedArray( params._matrix, CM );
        }
        return self;
    }
    
    // get the image color channel as a new image
    ,channel: function( channel, grayscale ) {
        channel = channel || 0;
        var m = [
            0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 
            0, 0, 0, 0, 255
        ], f = (CHANNEL.A === channel) || grayscale ? 1 : 0;
        m[CHANNEL.R*5+channel] = CHANNEL.R === channel ? 1 : f;
        m[CHANNEL.G*5+channel] = CHANNEL.G === channel ? 1 : f;
        m[CHANNEL.B*5+channel] = CHANNEL.B === channel ? 1 : f;
        return this.set(m);
    }
    
    // aliases
    // get the image red channel as a new image
    ,redChannel: function( grayscale ) {
        return this.channel(CHANNEL.R, grayscale);
    }
    
    // get the image green channel as a new image
    ,greenChannel: function( grayscale ) {
        return this.channel(CHANNEL.G, grayscale);
    }
    
    // get the image blue channel as a new image
    ,blueChannel: function( grayscale ) {
        return this.channel(CHANNEL.B, grayscale);
    }
    
    // get the image alpha channel as a new image
    ,alphaChannel: function( grayscale ) {
        return this.channel(CHANNEL.A, true);
    }
    
    ,maskChannel: function( channel ) {
        channel = channel || 0;
        if ( CHANNEL.A === channel ) return this;
        var m = [
            1, 0, 0, 0, 0, 
            0, 1, 0, 0, 0, 
            0, 0, 1, 0, 0, 
            0, 0, 0, 1, 0
        ];
        m[channel*5+channel] = 0;
        return this.set(m);
    }
    
    ,swapChannels: function( channel1, channel2 ) {
        if ( channel1 === channel2 ) return this;
        var m = [
            1, 0, 0, 0, 0, 
            0, 1, 0, 0, 0, 
            0, 0, 1, 0, 0, 
            0, 0, 0, 1, 0
        ];
        m[channel1*5+channel1] = 0;
        m[channel2*5+channel2] = 0;
        m[channel1*5+channel2] = 1;
        m[channel2*5+channel1] = 1;
        return this.set(m);
    }
    
    ,invertChannel: function( channel ) {
        channel = channel || 0;
        if ( CHANNEL.A === channel ) return this;
        var m = [
            1, 0, 0, 0, 0, 
            0, 1, 0, 0, 0, 
            0, 0, 1, 0, 0, 
            0, 0, 0, 1, 0
        ];
        m[channel*5+channel] = -1;
        m[channel*5+4] = 255;
        return this.set(m);
    }
    
    ,invertRed: function( ) {
        return this.invertChannel(CHANNEL.R);
    }
    
    ,invertGreen: function( ) {
        return this.invertChannel(CHANNEL.G);
    }
    
    ,invertBlue: function( ) {
        return this.invertChannel(CHANNEL.B);
    }
    
    ,invertAlpha: function( ) {
        return this.invertChannel(CHANNEL.A);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,invert: function( ) {
        return this.set(rechannel([
            -1, 0,  0, 0, 255,
            0, -1,  0, 0, 255,
            0,  0, -1, 0, 255,
            0,  0,  0, 1,   0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,desaturate: function( ) {
        var L = FILTER.LUMA;
        return this.set(rechannel([
            L[0], L[1], L[2], 0, 0, 
            L[0], L[1], L[2], 0, 0, 
            L[0], L[1], L[2], 0, 0, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,saturate: function( s ) {
        var sInv, irlum, iglum, iblum, L = FILTER.LUMA;
        sInv = 1 - s;  irlum = sInv * L[0];
        iglum = sInv * L[1];  iblum = sInv * L[2];
        return this.set(rechannel([
            (irlum + s), iglum, iblum, 0, 0, 
            irlum, (iglum + s), iblum, 0, 0, 
            irlum, iglum, (iblum + s), 0, 0, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,colorize: function( rgb, amount ) {
        var r, g, b, inv_amount, L = FILTER.LUMA;
        if ( null == amount ) amount = 1;
        r = (((rgb >> 16) & 255) * 0.0039215686274509803921568627451);  // / 255
        g = (((rgb >> 8) & 255) * 0.0039215686274509803921568627451);  // / 255
        b = ((rgb & 255) * 0.0039215686274509803921568627451);  // / 255
        inv_amount = 1 - amount;
        return this.set(rechannel([
            (inv_amount + ((amount * r) * L[0])), ((amount * r) * L[1]), ((amount * r) * L[2]), 0, 0, 
            ((amount * g) * L[0]), (inv_amount + ((amount * g) * L[1])), ((amount * g) * L[2]), 0, 0, 
            ((amount * b) * L[0]), ((amount * b) * L[1]), (inv_amount + ((amount * b) * L[2])), 0, 0, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,contrast: function( r, g, b ) {
        if ( null == g ) g = r;
        if ( null == b ) b = r;
        r += 1.0; g += 1.0; b += 1.0;
        return this.set(rechannel([
            r, 0, 0, 0, (128 * (1 - r)), 
            0, g, 0, 0, (128 * (1 - g)), 
            0, 0, b, 0, (128 * (1 - b)), 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,brightness: function( r, g, b ) {
        if ( null == g ) g = r;
        if ( null == b ) b = r;
        return this.set(rechannel([
            1, 0, 0, 0, r, 
            0, 1, 0, 0, g, 
            0, 0, 1, 0, b, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,adjustHue: function( degrees ) {
        degrees *= toRad;
        var cos = Cos(degrees), sin = Sin(degrees), L = FILTER.LUMA;
        return this.set(rechannel([
            ((L[0] + (cos * (1 - L[0]))) + (sin * -(L[0]))), ((L[1] + (cos * -(L[1]))) + (sin * -(L[1]))), ((L[2] + (cos * -(L[2]))) + (sin * (1 - L[2]))), 0, 0, 
            ((L[0] + (cos * -(L[0]))) + (sin * 0.143)), ((L[1] + (cos * (1 - L[1]))) + (sin * 0.14)), ((L[2] + (cos * -(L[2]))) + (sin * -0.283)), 0, 0, 
            ((L[0] + (cos * -(L[0]))) + (sin * -((1 - L[0])))), ((L[1] + (cos * -(L[1]))) + (sin * L[1])), ((L[2] + (cos * (1 - L[2]))) + (sin * L[2])), 0, 0, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,average: function( r, g, b ) {
        if ( null == r ) r = 0.3333;
        if ( null == g ) g = 0.3333;
        if ( null == b ) b = 0.3334;
        return this.set(rechannel([
            r, g, b, 0, 0, 
            r, g, b, 0, 0, 
            r, g, b, 0, 0, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    ,quickContrastCorrection: function( contrast ) {
        if ( null == contrast ) contrast = 1.2;
        return this.set(rechannel([
            contrast, 0, 0, 0, 0, 
            0, contrast, 0, 0, 0, 
            0, 0, contrast, 0, 0, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from glfx.js
    // Gives the image a reddish-brown monochrome tint that imitates an old photograph.
    // 0 to 1 (0 for no effect, 1 for full sepia coloring)
    ,sepia: function( amount ) {
        if ( null == amount ) amount = 0.5;
        if ( amount > 1 ) amount = 1;
        else if ( amount < 0 ) amount = 0;
        return this.set(rechannel([
            1.0 - (0.607 * amount), 0.769 * amount, 0.189 * amount, 0, 0, 
            0.349 * amount, 1.0 - (0.314 * amount), 0.168 * amount, 0, 0, 
            0.272 * amount, 0.534 * amount, 1.0 - (0.869 * amount), 0, 0, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    ,sepia2: function( amount ) {
        if ( null == amount ) amount = 10;
        if ( amount > 100 ) amount = 100;
        amount *= 2.55;
        var L = FILTER.LUMA;
        return this.set(rechannel([
            L[0], L[1], L[2], 0, 40, 
            L[0], L[1], L[2], 0, 20, 
            L[0], L[1], L[2], 0, -amount, 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,threshold: function( threshold, factor, lumia ) {
        if ( null == factor ) factor = 256;
        var L = FILTER.LUMA;
        return this.set(rechannel(false !== lumia
        ? [
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
            0, 0, 0, 1, 0
        ]
        : [
            factor, 0, 0, 0, (-(factor-1) * threshold), 
            0, factor, 0, 0, (-(factor-1) * threshold), 
            0,  0, factor, 0, (-(factor-1) * threshold), 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    ,thresholdRGB: function( threshold, factor ) {
        return this.threshold(threshold, factor, false);
    }
    
    ,thresholdChannel: function( channel, threshold, factor, lumia ) {
        if ( null == factor ) factor = 256;
        var m = [
            1, 0, 0, 0, 0, 
            0, 1, 0, 0, 0, 
            0, 0, 1, 0, 0, 
            0, 0, 0, 1, 0
        ], L = FILTER.LUMA;
        if ( CHANNEL.A === channel )
        {
            m[channel*5+channel] = factor;
            m[channel*5+4] = -factor * threshold;
        }
        else if ( false !== lumia )
        {
            m[channel*5+CHANNEL.R] = L[0] * factor;
            m[channel*5+CHANNEL.G] = L[1] * factor;
            m[channel*5+CHANNEL.B] = L[2] * factor;
            m[channel*5+4] = -(factor-1) * threshold;
        }
        else
        {
            m[channel*5+CHANNEL.R] = factor;
            m[channel*5+CHANNEL.G] = factor;
            m[channel*5+CHANNEL.B] = factor;
            m[channel*5+4] = -(factor-1) * threshold;
        }
        return this.set(m);
    }
    
    ,thresholdRed: function( threshold, factor, lumia ) {
        return this.thresholdChannel(CHANNEL.R, threshold, factor, lumia);
    }
    
    ,thresholdGreen: function( threshold, factor, lumia ) {
        return this.thresholdChannel(CHANNEL.G, threshold, factor, lumia);
    }
    
    ,thresholdBlue: function( threshold, factor, lumia ) {
        return this.thresholdChannel(CHANNEL.B, threshold, factor, lumia);
    }
    
    ,thresholdAlpha: function( threshold, factor, lumia ) {
        return this.thresholdChannel(CHANNEL.A, threshold, factor, lumia);
    }
    
    // RGB to YCbCr
    ,RGB2YCbCr: function( ) {
        return this.set(rechannel([
            0.299, 0.587, 0.114, 0, 0,
            -0.168736, -0.331264, 0.5, 0, 128,
            0.5, -0.418688, -0.081312, 0, 128,
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.Y, CHANNEL.CB, CHANNEL.CR, CHANNEL.A
        ));
    }
    
    // YCbCr to RGB
    ,YCbCr2RGB: function( ) {
        return this.set(rechannel([
            1, 0, 1.402, 0, -179.456,
            1, -0.34414, -0.71414, 0, 135.45984,
            1, 1.772, 0, 0, -226.816,
            0, 0, 0, 1, 0
        ],
            CHANNEL.Y, CHANNEL.CB, CHANNEL.CR, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // blend with another filter
    ,blend: function( filt, amount ) {
        this._matrix = this._matrix ? cm_blend(this._matrix, filt.getMatrix(), amount) : new CM(filt.getMatrix());
        return this;
    }
    
    ,set: function( mat ) {
        this._matrix = this._matrix ? cm_mult(this._matrix, new CM(mat)) : new CM(mat);
        return this;
    }
    
    ,reset: function( ) {
        this._matrix = null; 
        return this;
    }
    
    ,combineWith: function( filt ) {
        return this.set( filt.getMatrix() );
    }
    
    ,getMatrix: function( ) {
        return this._matrix;
    }
    
    ,setMatrix: function( m ) {
        this._matrix = new CM(m); 
        return this;
    }
    
    // used for internal purposes
    ,_apply: notSupportClamp
    ? function( im, w, h/*, image*/ ) {
        var self = this, m = self._matrix;
        if ( !self._isOn || !m ) return im;
        
        var imLen = im.length, i, rem = (imLen>>>2)%8,
            p = new CM(32), t = new A8U(4), pr = new CM(4);

        // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
        // linearize array
        // partial loop unrolling (1/8 iterations)
        for (i=0; i<imLen; i+=32)
        {
            t[0]   =  im[i  ]; t[1] = im[i+1]; t[2] = im[i+2]; t[3] = im[i+3];
            p[0 ]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[1 ]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[2 ]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[3 ]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];

            t[0]   =  im[i+4]; t[1] = im[i+5]; t[2] = im[i+6]; t[3] = im[i+7];
            p[4 ]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[5 ]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[6 ]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[7 ]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];

            t[0]   =  im[i+8]; t[1] = im[i+9]; t[2] = im[i+10]; t[3] = im[i+11];
            p[8 ]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[9 ]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[10]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[11]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];

            t[0]   =  im[i+12]; t[1] = im[i+13]; t[2] = im[i+14]; t[3] = im[i+15];
            p[12]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[13]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[14]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[15]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];
            
            t[0]   =  im[i+16]; t[1] = im[i+17]; t[2] = im[i+18]; t[3] = im[i+19];
            p[16]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[17]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[18]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[19]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];

            t[0]   =  im[i+20]; t[1] = im[i+21]; t[2] = im[i+22]; t[3] = im[i+23];
            p[20]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[21]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[22]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[23]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];

            t[0]   =  im[i+24]; t[1] = im[i+25]; t[2] = im[i+26]; t[3] = im[i+27];
            p[24]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[25]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[26]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[27]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];

            t[0]   =  im[i+28]; t[1] = im[i+29]; t[2] = im[i+30]; t[3] = im[i+31];
            p[28]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[29]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[30]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[31]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];
            
            // clamp them manually
            p[0 ] = p[0 ]<0 ? 0 : (p[0 ]>255 ? 255 : p[0 ]);
            p[1 ] = p[1 ]<0 ? 0 : (p[1 ]>255 ? 255 : p[1 ]);
            p[2 ] = p[2 ]<0 ? 0 : (p[2 ]>255 ? 255 : p[2 ]);
            p[3 ] = p[3 ]<0 ? 0 : (p[3 ]>255 ? 255 : p[3 ]);
            p[4 ] = p[4 ]<0 ? 0 : (p[4 ]>255 ? 255 : p[4 ]);
            p[5 ] = p[5 ]<0 ? 0 : (p[5 ]>255 ? 255 : p[5 ]);
            p[6 ] = p[6 ]<0 ? 0 : (p[6 ]>255 ? 255 : p[6 ]);
            p[7 ] = p[7 ]<0 ? 0 : (p[7 ]>255 ? 255 : p[7 ]);
            p[8 ] = p[8 ]<0 ? 0 : (p[8 ]>255 ? 255 : p[8 ]);
            p[9 ] = p[9 ]<0 ? 0 : (p[9 ]>255 ? 255 : p[9 ]);
            p[10] = p[10]<0 ? 0 : (p[10]>255 ? 255 : p[10]);
            p[11] = p[11]<0 ? 0 : (p[11]>255 ? 255 : p[11]);
            p[12] = p[12]<0 ? 0 : (p[12]>255 ? 255 : p[12]);
            p[13] = p[13]<0 ? 0 : (p[13]>255 ? 255 : p[13]);
            p[14] = p[14]<0 ? 0 : (p[14]>255 ? 255 : p[14]);
            p[15] = p[15]<0 ? 0 : (p[15]>255 ? 255 : p[15]);
            p[16] = p[16]<0 ? 0 : (p[16]>255 ? 255 : p[16]);
            p[17] = p[17]<0 ? 0 : (p[17]>255 ? 255 : p[17]);
            p[18] = p[18]<0 ? 0 : (p[18]>255 ? 255 : p[18]);
            p[19] = p[19]<0 ? 0 : (p[19]>255 ? 255 : p[19]);
            p[20] = p[20]<0 ? 0 : (p[20]>255 ? 255 : p[20]);
            p[21] = p[21]<0 ? 0 : (p[21]>255 ? 255 : p[21]);
            p[22] = p[22]<0 ? 0 : (p[22]>255 ? 255 : p[22]);
            p[23] = p[23]<0 ? 0 : (p[23]>255 ? 255 : p[23]);
            p[24] = p[24]<0 ? 0 : (p[24]>255 ? 255 : p[24]);
            p[25] = p[25]<0 ? 0 : (p[25]>255 ? 255 : p[25]);
            p[26] = p[26]<0 ? 0 : (p[26]>255 ? 255 : p[26]);
            p[27] = p[27]<0 ? 0 : (p[27]>255 ? 255 : p[27]);
            p[28] = p[28]<0 ? 0 : (p[28]>255 ? 255 : p[28]);
            p[29] = p[29]<0 ? 0 : (p[29]>255 ? 255 : p[29]);
            p[30] = p[30]<0 ? 0 : (p[30]>255 ? 255 : p[30]);
            p[31] = p[31]<0 ? 0 : (p[31]>255 ? 255 : p[31]);
            
            im[i   ] = ~~p[0 ]; im[i+1 ] = ~~p[1 ]; im[i+2 ] = ~~p[2 ]; im[i+3 ] = ~~p[3 ];
            im[i+4 ] = ~~p[4 ]; im[i+5 ] = ~~p[5 ]; im[i+6 ] = ~~p[6 ]; im[i+7 ] = ~~p[7 ];
            im[i+8 ] = ~~p[8 ]; im[i+9 ] = ~~p[9 ]; im[i+10] = ~~p[10]; im[i+11] = ~~p[11];
            im[i+12] = ~~p[12]; im[i+13] = ~~p[13]; im[i+14] = ~~p[14]; im[i+15] = ~~p[15];
            im[i+16] = ~~p[16]; im[i+17] = ~~p[17]; im[i+18] = ~~p[18]; im[i+19] = ~~p[19];
            im[i+20] = ~~p[20]; im[i+21] = ~~p[21]; im[i+22] = ~~p[22]; im[i+23] = ~~p[23];
            im[i+24] = ~~p[24]; im[i+25] = ~~p[25]; im[i+26] = ~~p[26]; im[i+27] = ~~p[27];
            im[i+28] = ~~p[28]; im[i+29] = ~~p[29]; im[i+30] = ~~p[30]; im[i+31] = ~~p[31];
        }
        // loop unrolling remainder
        if ( rem )
        {
            for (i=imLen-(rem<<2); i<imLen; i+=4)
            {
                t[0]   =  im[i]; t[1] = im[i+1]; t[2] = im[i+2]; t[3] = im[i+3];
                pr[0]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4];
                pr[1]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9];
                pr[2]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
                pr[3]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];
                
                // clamp them manually
                pr[0] = pr[0]<0 ? 0 : (pr[0]>255 ? 255 : pr[0]);
                pr[1] = pr[1]<0 ? 0 : (pr[1]>255 ? 255 : pr[1]);
                pr[2] = pr[2]<0 ? 0 : (pr[2]>255 ? 255 : pr[2]);
                pr[3] = pr[3]<0 ? 0 : (pr[3]>255 ? 255 : pr[3]);
                
                im[i  ] = ~~pr[0]; im[i+1] = ~~pr[1]; im[i+2] = ~~pr[2]; im[i+3] = ~~pr[3];
            }
        }
        return im;
    }
    : function( im, w, h/*, image*/ ) {
        var self = this, m = self._matrix;
        if ( !self._isOn || !m ) return im;
        
        var imLen = im.length, i, rem = (imLen>>>2)%8,
            p = new CM(32), t = new A8U(4), pr = new CM(4);

        // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
        // linearize array
        // partial loop unrolling (1/8 iterations)
        for (i=0; i<imLen; i+=32)
        {
            t[0]   =  im[i  ]; t[1] = im[i+1]; t[2] = im[i+2]; t[3] = im[i+3];
            p[0 ]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[1 ]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[2 ]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[3 ]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];

            t[0]   =  im[i+4]; t[1] = im[i+5]; t[2] = im[i+6]; t[3] = im[i+7];
            p[4 ]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[5 ]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[6 ]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[7 ]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];

            t[0]   =  im[i+8]; t[1] = im[i+9]; t[2] = im[i+10]; t[3] = im[i+11];
            p[8 ]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[9 ]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[10]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[11]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];

            t[0]   =  im[i+12]; t[1] = im[i+13]; t[2] = im[i+14]; t[3] = im[i+15];
            p[12]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[13]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[14]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[15]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];
            
            t[0]   =  im[i+16]; t[1] = im[i+17]; t[2] = im[i+18]; t[3] = im[i+19];
            p[16]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[17]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[18]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[19]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];

            t[0]   =  im[i+20]; t[1] = im[i+21]; t[2] = im[i+22]; t[3] = im[i+23];
            p[20]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[21]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[22]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[23]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];

            t[0]   =  im[i+24]; t[1] = im[i+25]; t[2] = im[i+26]; t[3] = im[i+27];
            p[24]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[25]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[26]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[27]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];

            t[0]   =  im[i+28]; t[1] = im[i+29]; t[2] = im[i+30]; t[3] = im[i+31];
            p[28]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4 ];
            p[29]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9 ];
            p[30]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
            p[31]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];
            
            im[i   ] = ~~p[0 ]; im[i+1 ] = ~~p[1 ]; im[i+2 ] = ~~p[2 ]; im[i+3 ] = ~~p[3 ];
            im[i+4 ] = ~~p[4 ]; im[i+5 ] = ~~p[5 ]; im[i+6 ] = ~~p[6 ]; im[i+7 ] = ~~p[7 ];
            im[i+8 ] = ~~p[8 ]; im[i+9 ] = ~~p[9 ]; im[i+10] = ~~p[10]; im[i+11] = ~~p[11];
            im[i+12] = ~~p[12]; im[i+13] = ~~p[13]; im[i+14] = ~~p[14]; im[i+15] = ~~p[15];
            im[i+16] = ~~p[16]; im[i+17] = ~~p[17]; im[i+18] = ~~p[18]; im[i+19] = ~~p[19];
            im[i+20] = ~~p[20]; im[i+21] = ~~p[21]; im[i+22] = ~~p[22]; im[i+23] = ~~p[23];
            im[i+24] = ~~p[24]; im[i+25] = ~~p[25]; im[i+26] = ~~p[26]; im[i+27] = ~~p[27];
            im[i+28] = ~~p[28]; im[i+29] = ~~p[29]; im[i+30] = ~~p[30]; im[i+31] = ~~p[31];
        }
        // loop unrolling remainder
        if ( rem )
        {
            for (i=imLen-(rem<<2); i<imLen; i+=4)
            {
                t[0]   =  im[i]; t[1] = im[i+1]; t[2] = im[i+2]; t[3] = im[i+3];
                pr[0]  =  m[0 ]*t[0] +  m[1 ]*t[1] +  m[2 ]*t[2] +  m[3 ]*t[3] +  m[4];
                pr[1]  =  m[5 ]*t[0] +  m[6 ]*t[1] +  m[7 ]*t[2] +  m[8 ]*t[3] +  m[9];
                pr[2]  =  m[10]*t[0] +  m[11]*t[1] +  m[12]*t[2] +  m[13]*t[3] +  m[14];
                pr[3]  =  m[15]*t[0] +  m[16]*t[1] +  m[17]*t[2] +  m[18]*t[3] +  m[19];
                
                im[i  ] = ~~pr[0]; im[i+1] = ~~pr[1]; im[i+2] = ~~pr[2]; im[i+3] = ~~pr[3];
            }
        }
        return im;
    }
        
    ,canRun: function( ) {
        return this._isOn && this._matrix;
    }
});
// aliases
ColorMatrixFilter.prototype.grayscale = ColorMatrixFilter.prototype.desaturate;
ColorMatrixFilter.prototype.rotateHue = ColorMatrixFilter.prototype.adjustHue;
ColorMatrixFilter.prototype.threshold_rgb = ColorMatrixFilter.prototype.thresholdRGB;
ColorMatrixFilter.prototype.threshold_alpha = ColorMatrixFilter.prototype.thresholdAlpha;
ColorMatrixFilter.blend = cm_blend;

}(FILTER);