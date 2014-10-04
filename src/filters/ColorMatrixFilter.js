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

    @@USE_STRICT@@
    
    var Sin=Math.sin, Cos=Math.cos,
        // Color Matrix
        CM=FILTER.Array32F,
        toRad=FILTER.CONSTANTS.toRad, toDeg=FILTER.CONSTANTS.toDeg,
        notSupportClamp=FILTER._notSupportClamp
    ;
    
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
            
            if ( FILTER.useWebGL )
            {
                self._webglInstance = FILTER.WebGLColorMatrixFilterInstance || null;
            }
        }
        
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
                
                self._matrix = params._matrix;
            }
            return self;
        }
        
        // get the image color channel as a new image
        ,channel: function( ch, asGray ) {
            asGray = ( asGray === undef ) ? false : asGray;
            var f = ( asGray ) ? 1 : 0;
            switch(ch)
            {
                case FILTER.CHANNEL.ALPHA:
                    return this.concat([
                                0, 0, 0, 1, 0, 
                                0, 0, 0, 1, 0, 
                                0, 0, 0, 1, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;
                
                case FILTER.CHANNEL.BLUE:
                    return this.set([
                                0, 0, f, 0, 0, 
                                0, 0, f, 0, 0, 
                                0, 0, 1, 0, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;
                
                case FILTER.CHANNEL.GREEN:
                    return this.set([
                                0, f, 0, 0, 0, 
                                0, 1, 0, 0, 0, 
                                0, f, 0, 0, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;
                
                case FILTER.CHANNEL.RED:
                default:
                    return this.set([
                                1, 0, 0, 0, 0, 
                                f, 0, 0, 0, 0, 
                                f, 0, 0, 0, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;
            }
        }
        
        // aliases
        // get the image red channel as a new image
        ,redChannel: function( asGray ) {
            return this.channel(FILTER.CHANNEL.RED, asGray);
        }
        
        // get the image green channel as a new image
        ,greenChannel: function( asGray ) {
            return this.channel(FILTER.CHANNEL.GREEN, asGray);
        }
        
        // get the image blue channel as a new image
        ,blueChannel: function( asGray ) {
            return this.channel(FILTER.CHANNEL.BLUE, asGray);
        }
        
        // get the image alpha channel as a new image
        ,alphaChannel: function( asGray ) {
            return this.channel(FILTER.CHANNEL.ALPHA, true);
        }
        
        ,maskChannel: function( ch ) {
            switch( ch )
            {
                case FILTER.CHANNEL.ALPHA:
                    return this;
                    break;
                
                case FILTER.CHANNEL.BLUE:
                    return this.set([
                                1, 0, 0, 0, 0, 
                                0, 1, 0, 0, 0, 
                                0, 0, 0, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                    break;
                
                case FILTER.CHANNEL.GREEN:
                    return this.set([
                                1, 0, 0, 0, 0, 
                                0, 0, 0, 0, 0, 
                                0, 0, 1, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                    break;
                
                case FILTER.CHANNEL.RED:
                default:
                    return this.set([
                                0, 0, 0, 0, 0, 
                                0, 1, 0, 0, 0, 
                                0, 0, 1, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                    break;
            }
        }
        
        ,swapChannels: function( ch1, ch2 ) {
            switch( ch1 )
            {
                case FILTER.CHANNEL.ALPHA:
                    switch( ch2 )
                    {
                        case FILTER.CHANNEL.ALPHA:
                            return this;
                            break;
                        
                        case FILTER.CHANNEL.BLUE:
                            return this.set([
                                        1, 0, 0, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 0, 1, 0, 
                                        0, 0, 1, 0, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.GREEN:
                            return this.set([
                                        1, 0, 0, 0, 0, 
                                        0, 0, 0, 1, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.RED:
                        default:
                            return this.set([
                                        0, 0, 0, 1, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        1, 0, 0, 0, 0
                                    ]);
                            break;
                    }
                    break;
                
                case FILTER.CHANNEL.BLUE:
                    switch( ch2 )
                    {
                        case FILTER.CHANNEL.ALPHA:
                            return this.set([
                                        1, 0, 0, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 0, 1, 0, 
                                        0, 0, 1, 0, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.BLUE:
                            return this;
                            break;
                        
                        case FILTER.CHANNEL.GREEN:
                            return this.set([
                                        1, 0, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.RED:
                        default:
                            return this.set([
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        1, 0, 0, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                    }
                    break;
                
                case FILTER.CHANNEL.GREEN:
                    switch( ch2 )
                    {
                        case FILTER.CHANNEL.ALPHA:
                            return this.set([
                                        1, 0, 0, 0, 0, 
                                        0, 0, 0, 1, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.BLUE:
                            return this.set([
                                        1, 0, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.GREEN:
                            return this;
                            break;
                        
                        case FILTER.CHANNEL.RED:
                        default:
                            return this.set([
                                        0, 1, 0, 0, 0, 
                                        1, 0, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                    }
                    break;
                
                case FILTER.CHANNEL.RED:
                default:
                    switch( ch2 )
                    {
                        case FILTER.CHANNEL.ALPHA:
                            return this.set([
                                        0, 0, 0, 1, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        1, 0, 0, 0, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.BLUE:
                            return this.set([
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        1, 0, 0, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.GREEN:
                            return this.set([
                                        0, 1, 0, 0, 0, 
                                        1, 0, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.RED:
                        default:
                            return this;
                            break;
                    }
                    break;
            }
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,desaturate: function( ) {
            return this.set([
                        FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
                        FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
                        FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
                        0, 0, 0, 1, 0
                    ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,colorize: function( rgb, amount ) {
            var r, g, b, inv_amount;
            if ( amount === undef ) amount = 1;
            r = (((rgb >> 16) & 255) * 0.0039215686274509803921568627451);  // / 255
            g = (((rgb >> 8) & 255) * 0.0039215686274509803921568627451);  // / 255
            b = ((rgb & 255) * 0.0039215686274509803921568627451);  // / 255
            inv_amount = 1 - amount;

            return this.set([
                        (inv_amount + ((amount * r) * FILTER.LUMA[0])), ((amount * r) * FILTER.LUMA[1]), ((amount * r) * FILTER.LUMA[2]), 0, 0, 
                        ((amount * g) * FILTER.LUMA[0]), (inv_amount + ((amount * g) * FILTER.LUMA[1])), ((amount * g) * FILTER.LUMA[2]), 0, 0, 
                        ((amount * b) * FILTER.LUMA[0]), ((amount * b) * FILTER.LUMA[1]), (inv_amount + ((amount * b) * FILTER.LUMA[2])), 0, 0, 
                            0, 0, 0, 1, 0
                        ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,invert: function( ) {
            return this.set([
                    -1, 0,  0, 0, 255,
                    0, -1,  0, 0, 255,
                    0,  0, -1, 0, 255,
                    0,  0,  0, 1,   0
                ]);
        }
        
        ,invertAlpha: function( ) {
            return this.set([
                    1,  0,  0, 0, 0,
                    0,  1,  0, 0, 0,
                    0,  0,  1, 0, 0,
                    0,  0,  0, -1, 255
                ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,saturate: function( s ) {
            var sInv, irlum, iglum, iblum;
            sInv = (1 - s);  irlum = (sInv * FILTER.LUMA[0]);
            iglum = (sInv * FILTER.LUMA[1]);  iblum = (sInv * FILTER.LUMA[2]);
            
            return this.set([
                    (irlum + s), iglum, iblum, 0, 0, 
                    irlum, (iglum + s), iblum, 0, 0, 
                    irlum, iglum, (iblum + s), 0, 0, 
                    0, 0, 0, 1, 0
                ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,contrast: function( r, g, b ) {
            if ( g === undef )  g = r;
            if ( b === undef )  b = r;
            r += 1.0; g += 1.0; b += 1.0;
            return this.set([
                    r, 0, 0, 0, (128 * (1 - r)), 
                    0, g, 0, 0, (128 * (1 - g)), 
                    0, 0, b, 0, (128 * (1 - b)), 
                    0, 0, 0, 1, 0
                ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,brightness: function( r, g, b ) {
            if ( g === undef )  g = r;
            if ( b === undef )  b = r;
            
            return this.set([
                    1, 0, 0, 0, r, 
                    0, 1, 0, 0, g, 
                    0, 0, 1, 0, b, 
                    0, 0, 0, 1, 0
                ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,adjustHue: function( degrees ) {
            degrees *= toRad;
            var cos = Cos(degrees), sin = Sin(degrees);
            
            return this.set([
                    ((FILTER.LUMA[0] + (cos * (1 - FILTER.LUMA[0]))) + (sin * -(FILTER.LUMA[0]))), ((FILTER.LUMA[1] + (cos * -(FILTER.LUMA[1]))) + (sin * -(FILTER.LUMA[1]))), ((FILTER.LUMA[2] + (cos * -(FILTER.LUMA[2]))) + (sin * (1 - FILTER.LUMA[2]))), 0, 0, 
                    ((FILTER.LUMA[0] + (cos * -(FILTER.LUMA[0]))) + (sin * 0.143)), ((FILTER.LUMA[1] + (cos * (1 - FILTER.LUMA[1]))) + (sin * 0.14)), ((FILTER.LUMA[2] + (cos * -(FILTER.LUMA[2]))) + (sin * -0.283)), 0, 0, 
                    ((FILTER.LUMA[0] + (cos * -(FILTER.LUMA[0]))) + (sin * -((1 - FILTER.LUMA[0])))), ((FILTER.LUMA[1] + (cos * -(FILTER.LUMA[1]))) + (sin * FILTER.LUMA[1])), ((FILTER.LUMA[2] + (cos * (1 - FILTER.LUMA[2]))) + (sin * FILTER.LUMA[2])), 0, 0, 
                    0, 0, 0, 1, 0
                ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,average: function( r, g, b ) {
            if ( r === undef ) r = 0.3333;
            if ( g === undef ) g = 0.3333;
            if ( b === undef ) b = 0.3334;
            
            return this.set([
                    r, g, b, 0, 0, 
                    r, g, b, 0, 0, 
                    r, g, b, 0, 0, 
                    0, 0, 0, 1, 0
                ]);
        }
        
        ,quickContrastCorrection: function( contrast ) {
            if ( contrast === undef ) contrast = 1.2;
            
            return this.set([
                contrast, 0, 0, 0, 0, 
                0, contrast, 0, 0, 0, 
                0, 0, contrast, 0, 0, 
                0, 0, 0, 1, 0
                ]);
        }
        
        // adapted from glfx.js
        // Gives the image a reddish-brown monochrome tint that imitates an old photograph.
        // 0 to 1 (0 for no effect, 1 for full sepia coloring)
        ,sepia: function( amount ) {
            if ( amount === undef ) amount = 0.5;
            if ( amount > 1 ) amount = 1;
            else if ( amount < 0 ) amount = 0;
            return this.set([
                1.0 - (0.607 * amount), 0.769 * amount, 0.189 * amount, 0, 0, 
                0.349 * amount, 1.0 - (0.314 * amount), 0.168 * amount, 0, 0, 
                0.272 * amount, 0.534 * amount, 1.0 - (0.869 * amount), 0, 0, 
                0, 0, 0, 1, 0
            ]);
        }
        
        ,sepia2: function( amount ) {
            if ( amount === undef ) amount = 10;
            if ( amount > 100 ) amount = 100;
            amount *= 2.55;
            return this.set([
                FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 40, 
                FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 20, 
                FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, -amount, 
                0, 0, 0, 1, 0
            ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,threshold: function( threshold, factor ) {
            if ( factor === undef )  factor = 256;
            
            return this.set([
                    (FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
                    (FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
                    (FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
                    0, 0, 0, 1, 0
                ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,threshold_rgb: function( threshold, factor ) {
            if ( factor === undef )  factor = 256;
            
            return this.set([
                    factor, 0, 0, 0, (-(factor-1) * threshold), 
                    0, factor, 0, 0, (-(factor-1) * threshold), 
                    0,  0, factor, 0, (-(factor-1) * threshold), 
                    0, 0, 0, 1, 0
                ]);
        }
        
        ,threshold_alpha: function( threshold, factor ) {
            if ( threshold === undef )  threshold = 0.5;
            if ( factor === undef ) factor = 256;
            
            return this.set([
                    1, 0, 0, 0, 0, 
                    0, 1, 0, 0, 0, 
                    0, 0, 1, 0, 0, 
                    0, 0, 0, factor, (-factor * threshold)
                ]);
        }
        
        // RGB to YCbCr
        ,RGB2YCbCr: function( ) {
            return this.set([
                    0.5, -0.418688, -0.081312, 0, 128,  // Cr component in RED channel
                    0.299, 0.587, 0.114, 0, 0,   // Y component in GREEN channel
                    -0.168736, -0.331264, 0.5, 0, 128,  // Cb component in BLUE channel
                    0, 0, 0, 1, 0
                ]);
        }
        
        // YCbCr to RGB
        ,YCbCr2RGB: function( ) {
            return this.set([
                    1.402, 1, 0, 0, -179.456,  
                    -0.71414, 1, -0.34414, 0, 135.45984,
                    0, 1, 1.772, 0, -226.816,
                    0, 0, 0, 1, 0
                ]);
        }
        
        // blend with another filter
        ,blend: function( filt, amount ) {
            this._matrix = ( this._matrix ) ? CMblend(this._matrix, filt.getMatrix(), amount) : new CM(filt.getMatrix());
            return this;
        }
        
        ,set: function( mat ) {
            this._matrix = ( this._matrix ) ? CMconcat(this._matrix, new CM(mat)) : new CM(mat);
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
        ,_apply: function(p, w, h/*, image*/) {
            var self = this;
            if ( self._isOn && self._matrix )
            {
                var pl = p.length, m = self._matrix,
                    i, rem = (pl>>2)%4,
                    p0, p1, p2, p3, 
                    p4, p5, p6, p7, 
                    p8, p9, p10, p11,
                    p12, p13, p14, p15,
                    t0, t1, t2, t3
                ;
                
                // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
                // linearize array
                // partial loop unrolling (quarter iterations)
                for (i=0; i<pl; i+=16)
                {
                    t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                    p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                    p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                    p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                    p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                    
                    t0 = p[i+4]; t1 = p[i+5]; t2 = p[i+6]; t3 = p[i+7];
                    p4  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                    p5  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                    p6  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                    p7  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                    
                    t0 = p[i+8]; t1 = p[i+9]; t2 = p[i+10]; t3 = p[i+11];
                    p8  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                    p9  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                    p10  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                    p11  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                    
                    t0 = p[i+12]; t1 = p[i+13]; t2 = p[i+14]; t3 = p[i+15];
                    p12  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                    p13  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                    p14  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                    p15  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                    
                    p[i] = ~~p0; p[i+1] = ~~p1; p[i+2] = ~~p2; p[i+3] = ~~p3;
                    p[i+4] = ~~p4; p[i+5] = ~~p5; p[i+6] = ~~p6; p[i+7] = ~~p7;
                    p[i+8] = ~~p8; p[i+9] = ~~p9; p[i+10] = ~~p10; p[i+11] = ~~p11;
                    p[i+12] = ~~p12; p[i+13] = ~~p13; p[i+14] = ~~p14; p[i+15] = ~~p15;
                }
                
                // loop unrolling remainder
                if (rem)
                {
                    rem <<= 2;
                    for (i=pl-rem; i<pl; i+=4)
                    {
                        t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                        p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                        p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                        p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                        p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                        
                        p[i] = ~~p0; p[i+1] = ~~p1; p[i+2] = ~~p2; p[i+3] = ~~p3;
                    }
                }
            }
            return p;
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
    if (notSupportClamp)
    {   
        ColorMatrixFilter.prototype._apply = function(p, w, h/*, image*/) {
            var self = this;
            if ( self._isOn && self._matrix )
            {
                var pl = p.length, m = self._matrix,
                    i, rem = (pl>>2)%4,
                    p0, p1, p2, p3, 
                    p4, p5, p6, p7, 
                    p8, p9, p10, p11,
                    p12, p13, p14, p15,
                    t0, t1, t2, t3
                ;
                
                // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
                // linearize array
                // partial loop unrolling (quarter iterations)
                for (i=0; i<pl; i+=16)
                {
                    t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                    p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                    p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                    p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                    p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                    
                    t0 = p[i+4]; t1 = p[i+5]; t2 = p[i+6]; t3 = p[i+7];
                    p4  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                    p5  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                    p6  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                    p7  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                    
                    t0 = p[i+8]; t1 = p[i+9]; t2 = p[i+10]; t3 = p[i+11];
                    p8  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                    p9  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                    p10  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                    p11  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                    
                    t0 = p[i+12]; t1 = p[i+13]; t2 = p[i+14]; t3 = p[i+15];
                    p12  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                    p13  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                    p14  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                    p15  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                    
                    // clamp them manually
                    p0 = (p0<0) ? 0 : ((p0>255) ? 255 : p0);
                    p1 = (p1<0) ? 0 : ((p1>255) ? 255 : p1);
                    p2 = (p2<0) ? 0 : ((p2>255) ? 255 : p2);
                    p3 = (p3<0) ? 0 : ((p3>255) ? 255 : p3);
                    p4 = (p4<0) ? 0 : ((p4>255) ? 255 : p4);
                    p5 = (p5<0) ? 0 : ((p5>255) ? 255 : p5);
                    p6 = (p6<0) ? 0 : ((p6>255) ? 255 : p6);
                    p7 = (p7<0) ? 0 : ((p7>255) ? 255 : p7);
                    p8 = (p8<0) ? 0 : ((p8>255) ? 255 : p8);
                    p9 = (p9<0) ? 0 : ((p9>255) ? 255 : p9);
                    p10 = (p10<0) ? 0 : ((p10>255) ? 255 : p10);
                    p11 = (p11<0) ? 0 : ((p11>255) ? 255 : p11);
                    p12 = (p12<0) ? 0 : ((p12>255) ? 255 : p12);
                    p13 = (p13<0) ? 0 : ((p13>255) ? 255 : p13);
                    p14 = (p14<0) ? 0 : ((p14>255) ? 255 : p14);
                    p15 = (p15<0) ? 0 : ((p15>255) ? 255 : p15);
                    
                    p[i] = ~~p0; p[i+1] = ~~p1; p[i+2] = ~~p2; p[i+3] = ~~p3;
                    p[i+4] = ~~p4; p[i+5] = ~~p5; p[i+6] = ~~p6; p[i+7] = ~~p7;
                    p[i+8] = ~~p8; p[i+9] = ~~p9; p[i+10] = ~~p10; p[i+11] = ~~p11;
                    p[i+12] = ~~p12; p[i+13] = ~~p13; p[i+14] = ~~p14; p[i+15] = ~~p15;
                }
                
                // loop unrolling remainder
                if (rem)
                {
                    rem <<= 2;
                    for (i=pl-rem; i<pl; i+=4)
                    {
                        t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                        p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                        p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                        p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                        p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                        
                        // clamp them manually
                        p0 = (p0<0) ? 0 : ((p0>255) ? 255 : p0);
                        p1 = (p1<0) ? 0 : ((p1>255) ? 255 : p1);
                        p2 = (p2<0) ? 0 : ((p2>255) ? 255 : p2);
                        p3 = (p3<0) ? 0 : ((p3>255) ? 255 : p3);
                        
                        p[i] = ~~p0; p[i+1] = ~~p1; p[i+2] = ~~p2; p[i+3] = ~~p3;
                    }
                }
            }
            return p;
        };
    }
    
    //
    //
    // private methods
    function eye()
    {
        return new CM([
            1,0,0,0,0,
            0,1,0,0,0,
            0,0,1,0,0,
            0,0,0,1,0
        ]);
    }
     
     // concatenate 2 Color Matrices (kind of Color Matrix multiplication)
     function CMconcat(tm, mat) 
     {
        var t=new CM(20), m0, m1, m2, m3, m4;
        
        // unroll the loop completely
        // i=0
        m0=mat[0]; m1=mat[1]; m2=mat[2]; m3=mat[3]; m4=mat[4];
        t[ 0 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
        t[ 1 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
        t[ 2 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
        t[ 3 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
        t[ 4 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;

        // i=5
        m0=mat[5]; m1=mat[6]; m2=mat[7]; m3=mat[8]; m4=mat[9];
        t[ 5 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
        t[ 6 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
        t[ 7 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
        t[ 8 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
        t[ 9 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;
        
        // i=10
        m0=mat[10]; m1=mat[11]; m2=mat[12]; m3=mat[13]; m4=mat[14];
        t[ 10 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
        t[ 11 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
        t[ 12 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
        t[ 13 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
        t[ 14 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;
        
        // i=15
        m0=mat[15]; m1=mat[16]; m2=mat[17]; m3=mat[18]; m4=mat[19];
        t[ 15 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
        t[ 16 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
        t[ 17 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
        t[ 18 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
        t[ 19 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;
        
        return t;
    }
   
    function CMblend(m1, m2, amount)
    {
        var inv_amount = (1 - amount), i = 0, m=new CM(20);
        
        // unroll the loop completely
        m[ 0 ] = (inv_amount * m1[0]) + (amount * m2[0]);
        m[ 1 ] = (inv_amount * m1[1]) + (amount * m2[1]);
        m[ 2 ] = (inv_amount * m1[2]) + (amount * m2[2]);
        m[ 3 ] = (inv_amount * m1[3]) + (amount * m2[3]);
        m[ 4 ] = (inv_amount * m1[4]) + (amount * m2[4]);

        m[ 5 ] = (inv_amount * m1[5]) + (amount * m2[5]);
        m[ 6 ] = (inv_amount * m1[6]) + (amount * m2[6]);
        m[ 7 ] = (inv_amount * m1[7]) + (amount * m2[7]);
        m[ 8 ] = (inv_amount * m1[8]) + (amount * m2[8]);
        m[ 9 ] = (inv_amount * m1[9]) + (amount * m2[9]);
        
        m[ 10 ] = (inv_amount * m1[10]) + (amount * m2[10]);
        m[ 11 ] = (inv_amount * m1[11]) + (amount * m2[11]);
        m[ 12 ] = (inv_amount * m1[12]) + (amount * m2[12]);
        m[ 13 ] = (inv_amount * m1[13]) + (amount * m2[13]);
        m[ 14 ] = (inv_amount * m1[14]) + (amount * m2[14]);
        
        m[ 15 ] = (inv_amount * m1[15]) + (amount * m2[15]);
        m[ 16 ] = (inv_amount * m1[16]) + (amount * m2[16]);
        m[ 17 ] = (inv_amount * m1[17]) + (amount * m2[17]);
        m[ 18 ] = (inv_amount * m1[18]) + (amount * m2[18]);
        m[ 19 ] = (inv_amount * m1[19]) + (amount * m2[19]);
        
        //while (i < 20) { m[i] = (inv_amount * m1[i]) + (amount * m2[i]);  i++; };
        
        return m;
    }
    
}(FILTER);