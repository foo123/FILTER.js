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

var CHANNEL = FILTER.CHANNEL, CM = FILTER.ColorMatrix, eye = FILTER.Util.Filter.cm_eye,
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
        /*swap = m[channel1*5+channel2];
        m[channel1*5+channel2] = m[channel2*5+channel1];
        m[channel2*5+channel1] = swap;*/
        return this.set(m);
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
    ,colorize: function( rgb, amount ) {
        var r, g, b, inv_amount, L = FILTER.LUMA;
        if ( amount === undef ) amount = 1;
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
    
    ,invertAlpha: function( ) {
        return this.set(rechannel([
            1,  0,  0, 0, 0,
            0,  1,  0, 0, 0,
            0,  0,  1, 0, 0,
            0,  0,  0, -1, 255
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
    ,contrast: function( r, g, b ) {
        if ( g === undef )  g = r;
        if ( b === undef )  b = r;
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
        if ( g === undef )  g = r;
        if ( b === undef )  b = r;
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
        if ( r === undef ) r = 0.3333;
        if ( g === undef ) g = 0.3333;
        if ( b === undef ) b = 0.3334;
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
        if ( contrast === undef ) contrast = 1.2;
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
        if ( amount === undef ) amount = 0.5;
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
        if ( amount === undef ) amount = 10;
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
    ,threshold: function( threshold, factor ) {
        if ( factor === undef )  factor = 256;
        var L = FILTER.LUMA;
        return this.set(rechannel([
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,threshold_rgb: function( threshold, factor ) {
        if ( factor === undef )  factor = 256;
        return this.set(rechannel([
            factor, 0, 0, 0, (-(factor-1) * threshold), 
            0, factor, 0, 0, (-(factor-1) * threshold), 
            0,  0, factor, 0, (-(factor-1) * threshold), 
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    
    ,threshold_alpha: function( threshold, factor ) {
        if ( threshold === undef )  threshold = 0.5;
        if ( factor === undef ) factor = 256;
        return this.set(rechannel([
            1, 0, 0, 0, 0, 
            0, 1, 0, 0, 0, 
            0, 0, 1, 0, 0, 
            0, 0, 0, factor, (-factor * threshold)
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
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
        
        var imLen = im.length, i, rem = (imLen>>>2)%4,
            p0, p1, p2, p3, p4, p5, p6, p7, 
            p8, p9, p10, p11,  p12, p13, p14, p15,
            t0, t1, t2, t3;

        // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
        // linearize array
        // partial loop unrolling (quarter iterations)
        for (i=0; i<imLen; i+=16)
        {
            t0   =  im[i  ]; t1 = im[i+1]; t2 = im[i+2]; t3 = im[i+3];
            p0   =  m[0 ]*t0 +  m[1 ]*t1 +  m[2 ]*t2 +  m[3 ]*t3 +  m[4 ];
            p1   =  m[5 ]*t0 +  m[6 ]*t1 +  m[7 ]*t2 +  m[8 ]*t3 +  m[9 ];
            p2   =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
            p3   =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];

            t0   =  im[i+4]; t1 = im[i+5]; t2 = im[i+6]; t3 = im[i+7];
            p4   =  m[0 ]*t0 +  m[1 ]*t1 +  m[2 ]*t2 +  m[3 ]*t3 +  m[4 ];
            p5   =  m[5 ]*t0 +  m[6 ]*t1 +  m[7 ]*t2 +  m[8 ]*t3 +  m[9 ];
            p6   =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
            p7   =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];

            t0   =  im[i+8]; t1 = im[i+9]; t2 = im[i+10]; t3 = im[i+11];
            p8   =  m[0 ]*t0 +  m[1 ]*t1 +  m[2 ]*t2 +  m[3 ]*t3 +  m[4 ];
            p9   =  m[5 ]*t0 +  m[6 ]*t1 +  m[7 ]*t2 +  m[8 ]*t3 +  m[9 ];
            p10  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
            p11  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];

            t0   =  im[i+12]; t1 = im[i+13]; t2 = im[i+14]; t3 = im[i+15];
            p12  =  m[0 ]*t0 +  m[1 ]*t1 +  m[2 ]*t2 +  m[3 ]*t3 +  m[4 ];
            p13  =  m[5 ]*t0 +  m[6 ]*t1 +  m[7 ]*t2 +  m[8 ]*t3 +  m[9 ];
            p14  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
            p15  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
            
            // clamp them manually
            p0 = p0<0 ? 0 : (p0>255 ? 255 : p0);
            p1 = p1<0 ? 0 : (p1>255 ? 255 : p1);
            p2 = p2<0 ? 0 : (p2>255 ? 255 : p2);
            p3 = p3<0 ? 0 : (p3>255 ? 255 : p3);
            p4 = p4<0 ? 0 : (p4>255 ? 255 : p4);
            p5 = p5<0 ? 0 : (p5>255 ? 255 : p5);
            p6 = p6<0 ? 0 : (p6>255 ? 255 : p6);
            p7 = p7<0 ? 0 : (p7>255 ? 255 : p7);
            p8 = p8<0 ? 0 : (p8>255 ? 255 : p8);
            p9 = p9<0 ? 0 : (p9>255 ? 255 : p9);
            p10 = p10<0 ? 0 : (p10>255 ? 255 : p10);
            p11 = p11<0 ? 0 : (p11>255 ? 255 : p11);
            p12 = p12<0 ? 0 : (p12>255 ? 255 : p12);
            p13 = p13<0 ? 0 : (p13>255 ? 255 : p13);
            p14 = p14<0 ? 0 : (p14>255 ? 255 : p14);
            p15 = p15<0 ? 0 : (p15>255 ? 255 : p15);
            
            im[i   ] = ~~p0;  im[i+1 ] = ~~p1;  im[i+2 ] = ~~p2;  im[i+3 ] = ~~p3;
            im[i+4 ] = ~~p4;  im[i+5 ] = ~~p5;  im[i+6 ] = ~~p6;  im[i+7 ] = ~~p7;
            im[i+8 ] = ~~p8;  im[i+9 ] = ~~p9;  im[i+10] = ~~p10; im[i+11] = ~~p11;
            im[i+12] = ~~p12; im[i+13] = ~~p13; im[i+14] = ~~p14; im[i+15] = ~~p15;
        }

        // loop unrolling remainder
        if ( rem )
        {
            for (i=imLen-(rem<<2); i<imLen; i+=4)
            {
                t0  =  im[i]; t1 = im[i+1]; t2 = im[i+2]; t3 = im[i+3];
                p0  =  m[0 ]*t0 +  m[1 ]*t1 +  m[2 ]*t2 +  m[3 ]*t3 +  m[4];
                p1  =  m[5 ]*t0 +  m[6 ]*t1 +  m[7 ]*t2 +  m[8 ]*t3 +  m[9];
                p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                // clamp them manually
                p0 = p0<0 ? 0 : (p0>255 ? 255 : p0);
                p1 = p1<0 ? 0 : (p1>255 ? 255 : p1);
                p2 = p2<0 ? 0 : (p2>255 ? 255 : p2);
                p3 = p3<0 ? 0 : (p3>255 ? 255 : p3);
                
                im[i  ] = ~~p0; im[i+1] = ~~p1; im[i+2] = ~~p2; im[i+3] = ~~p3;
            }
        }
        return im;
    }
    : function( im, w, h/*, image*/ ) {
        var self = this, m = self._matrix;
        if ( !self._isOn || !m ) return im;
        
        var imLen = im.length, i, rem = (imLen>>>2)%4,
            p0, p1, p2, p3, p4, p5, p6, p7, 
            p8, p9, p10, p11,  p12, p13, p14, p15,
            t0, t1, t2, t3;

        // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
        // linearize array
        // partial loop unrolling (quarter iterations)
        for (i=0; i<imLen; i+=16)
        {
            t0   =  im[i  ]; t1 = im[i+1]; t2 = im[i+2]; t3 = im[i+3];
            p0   =  m[0 ]*t0 +  m[1 ]*t1 +  m[2 ]*t2 +  m[3 ]*t3 +  m[4 ];
            p1   =  m[5 ]*t0 +  m[6 ]*t1 +  m[7 ]*t2 +  m[8 ]*t3 +  m[9 ];
            p2   =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
            p3   =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];

            t0   =  im[i+4]; t1 = im[i+5]; t2 = im[i+6]; t3 = im[i+7];
            p4   =  m[0 ]*t0 +  m[1 ]*t1 +  m[2 ]*t2 +  m[3 ]*t3 +  m[4 ];
            p5   =  m[5 ]*t0 +  m[6 ]*t1 +  m[7 ]*t2 +  m[8 ]*t3 +  m[9 ];
            p6   =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
            p7   =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];

            t0   =  im[i+8]; t1 = im[i+9]; t2 = im[i+10]; t3 = im[i+11];
            p8   =  m[0 ]*t0 +  m[1 ]*t1 +  m[2 ]*t2 +  m[3 ]*t3 +  m[4 ];
            p9   =  m[5 ]*t0 +  m[6 ]*t1 +  m[7 ]*t2 +  m[8 ]*t3 +  m[9 ];
            p10  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
            p11  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];

            t0   =  im[i+12]; t1 = im[i+13]; t2 = im[i+14]; t3 = im[i+15];
            p12  =  m[0 ]*t0 +  m[1 ]*t1 +  m[2 ]*t2 +  m[3 ]*t3 +  m[4 ];
            p13  =  m[5 ]*t0 +  m[6 ]*t1 +  m[7 ]*t2 +  m[8 ]*t3 +  m[9 ];
            p14  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
            p15  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];

            im[i   ] = ~~p0;  im[i+1 ] = ~~p1;  im[i+2 ] = ~~p2;  im[i+3 ] = ~~p3;
            im[i+4 ] = ~~p4;  im[i+5 ] = ~~p5;  im[i+6 ] = ~~p6;  im[i+7 ] = ~~p7;
            im[i+8 ] = ~~p8;  im[i+9 ] = ~~p9;  im[i+10] = ~~p10; im[i+11] = ~~p11;
            im[i+12] = ~~p12; im[i+13] = ~~p13; im[i+14] = ~~p14; im[i+15] = ~~p15;
        }

        // loop unrolling remainder
        if ( rem )
        {
            for (i=imLen-(rem<<2); i<imLen; i+=4)
            {
                t0  =  im[i]; t1 = im[i+1]; t2 = im[i+2]; t3 = im[i+3];
                p0  =  m[0 ]*t0 +  m[1 ]*t1 +  m[2 ]*t2 +  m[3 ]*t3 +  m[4];
                p1  =  m[5 ]*t0 +  m[6 ]*t1 +  m[7 ]*t2 +  m[8 ]*t3 +  m[9];
                p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];

                im[i  ] = ~~p0; im[i+1] = ~~p1; im[i+2] = ~~p2; im[i+3] = ~~p3;
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
ColorMatrixFilter.prototype.thresholdRgb = ColorMatrixFilter.prototype.threshold_rgb;
ColorMatrixFilter.prototype.thresholdAlpha = ColorMatrixFilter.prototype.threshold_alpha;
ColorMatrixFilter.blend = cm_blend;

}(FILTER);