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
(function(FILTER){

    var 
        // Color Matrix
        CM=FILTER.Array32F,
        toRad=FILTER.CONSTANTS.toRad, toDeg=FILTER.CONSTANTS.toDeg
    ;
    
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
        while (i < 20) { m[i] = (inv_amount * m1[i]) + (amount * m2[i]);  i++; };
        return m;
    }
    
    FILTER.ColorMatrixFilter=function(matrix)
    {
        if (typeof matrix != 'undefined' && matrix.length)
        {
            this.matrix=new CM(matrix);
        }    
        else
        {
            // identity matrix
            this.matrix=null;
        }
    };
    
    FILTER.ColorMatrixFilter.prototype={
    
        matrix: null,
        
        // get the image color channel as a new image
        channel : function(ch, asGray) {
            asGray=(typeof asGray=='undefined') ? false : asGray;
            var f=(asGray) ? 1 : 0;
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
                    return this.concat([
                                0, 0, f, 0, 0, 
                                0, 0, f, 0, 0, 
                                0, 0, 1, 0, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;
                
                case FILTER.CHANNEL.GREEN:
                    return this.concat([
                                0, f, 0, 0, 0, 
                                0, 1, 0, 0, 0, 
                                0, f, 0, 0, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;
                
                case FILTER.CHANNEL.RED:
                default:
                    return this.concat([
                                1, 0, 0, 0, 0, 
                                f, 0, 0, 0, 0, 
                                f, 0, 0, 0, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;
            }
        },
        
        // aliases
        // get the image red channel as a new image
        redChannel : function(asGray) {
            return this.channel(FILTER.CHANNEL.RED, asGray);
        },
        
        // get the image green channel as a new image
        greenChannel : function(asGray) {
            return this.channel(FILTER.CHANNEL.GREEN, asGray);
        },
        
        // get the image blue channel as a new image
        blueChannel : function(asGray) {
            return this.channel(FILTER.CHANNEL.BLUE, asGray);
        },
        
        // get the image alpha channel as a new image
        alphaChannel : function(asGray) {
            return this.channel(FILTER.CHANNEL.ALPHA, true);
        },
        
        maskChannel : function(ch) {
            switch(ch)
            {
                case FILTER.CHANNEL.ALPHA:
                    return this;
                    break;
                
                case FILTER.CHANNEL.BLUE:
                    return this.concat([
                                1, 0, 0, 0, 0, 
                                0, 1, 0, 0, 0, 
                                0, 0, 0, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                    break;
                
                case FILTER.CHANNEL.GREEN:
                    return this.concat([
                                1, 0, 0, 0, 0, 
                                0, 0, 0, 0, 0, 
                                0, 0, 1, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                    break;
                
                case FILTER.CHANNEL.RED:
                default:
                    return this.concat([
                                0, 0, 0, 0, 0, 
                                0, 1, 0, 0, 0, 
                                0, 0, 1, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                    break;
            }
        },
        
        swapChannels : function(ch1, ch2) {
            switch(ch1)
            {
                case FILTER.CHANNEL.ALPHA:
                    switch(ch2)
                    {
                        case FILTER.CHANNEL.ALPHA:
                            return this;
                            break;
                        
                        case FILTER.CHANNEL.BLUE:
                            return this.concat([
                                        1, 0, 0, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 0, 1, 0, 
                                        0, 0, 1, 0, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.GREEN:
                            return this.concat([
                                        1, 0, 0, 0, 0, 
                                        0, 0, 0, 1, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.RED:
                        default:
                            return this.concat([
                                        0, 0, 0, 1, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        1, 0, 0, 0, 0
                                    ]);
                            break;
                    }
                    break;
                
                case FILTER.CHANNEL.BLUE:
                    switch(ch2)
                    {
                        case FILTER.CHANNEL.ALPHA:
                            return this.concat([
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
                            return this.concat([
                                        1, 0, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.RED:
                        default:
                            return this.concat([
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        1, 0, 0, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                    }
                    break;
                
                case FILTER.CHANNEL.GREEN:
                    switch(ch2)
                    {
                        case FILTER.CHANNEL.ALPHA:
                            return this.concat([
                                        1, 0, 0, 0, 0, 
                                        0, 0, 0, 1, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.BLUE:
                            return this.concat([
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
                            return this.concat([
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
                    switch(ch2)
                    {
                        case FILTER.CHANNEL.ALPHA:
                            return this.concat([
                                        0, 0, 0, 1, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        1, 0, 0, 0, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.BLUE:
                            return this.concat([
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        1, 0, 0, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.GREEN:
                            return this.concat([
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
        },
        
        desaturate : function() {
            return this.concat([
                        FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
                        FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
                        FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
                        0, 0, 0, 1, 0
                    ]);
        },
        
        // aliases
        grayscale : function() { return this.desaturate(); },
        
        colorize : function(rgb, amount) {
            var r, g, b, inv_amount;
            if (typeof amount=='undefined') amount=1;
            r = (((rgb >> 16) & 255) * 0.0039215686274509803921568627451);  // / 255
            g = (((rgb >> 8) & 255) * 0.0039215686274509803921568627451);  // / 255
            b = ((rgb & 255) * 0.0039215686274509803921568627451);  // / 255
            inv_amount = (1 - amount);

            return this.concat([
                        (inv_amount + ((amount * r) * FILTER.LUMA[0])), ((amount * r) * FILTER.LUMA[1]), ((amount * r) * FILTER.LUMA[2]), 0, 0, 
                        ((amount * g) * FILTER.LUMA[0]), (inv_amount + ((amount * g) * FILTER.LUMA[1])), ((amount * g) * FILTER.LUMA[2]), 0, 0, 
                        ((amount * b) * FILTER.LUMA[0]), ((amount * b) * FILTER.LUMA[1]), (inv_amount + ((amount * b) * FILTER.LUMA[2])), 0, 0, 
                            0, 0, 0, 1, 0
                        ]);
        },
        
        invert : function() {
            return this.concat([
                    -1, 0,  0, 0, 255,
                    0, -1,  0, 0, 255,
                    0,  0, -1, 0, 255,
                    0,  0,  0, 1,   0
                ]);
        },
        
        invertAlpha : function() {
            return this.concat([
                    1,  0,  0, 0, 0,
                    0,  1,  0, 0, 0,
                    0,  0,  1, 0, 0,
                    0,  0,  0, -1, 255
                ]);
        },
        
        saturate : function( s ) {
            var sInv, irlum, iglum, iblum;
            sInv = (1 - s);  irlum = (sInv * FILTER.LUMA[0]);
            iglum = (sInv * FILTER.LUMA[1]);  iblum = (sInv * FILTER.LUMA[2]);
            
            return this.concat([
                    (irlum + s), iglum, iblum, 0, 0, 
                    irlum, (iglum + s), iblum, 0, 0, 
                    irlum, iglum, (iblum + s), 0, 0, 
                    0, 0, 0, 1, 0
                ]);
        },
        
        contrast : function(r, g, b) {
            if (typeof g == 'undefined')  g=r;
            if (typeof b == 'undefined')  b=r;
            r += 1; g += 1; b += 1;
            
            return this.concat([
                    r, 0, 0, 0, (128 * (1 - r)), 
                    0, g, 0, 0, (128 * (1 - g)), 
                    0, 0, b, 0, (128 * (1 - b)), 
                    0, 0, 0, 1, 0
                ]);
        },
        
        brightness : function(r, g, b) {
            if (typeof g == 'undefined')  g=r;
            if (typeof b == 'undefined')  b=r;
            
            return this.concat([
                    1, 0, 0, 0, r, 
                    0, 1, 0, 0, g, 
                    0, 0, 1, 0, b, 
                    0, 0, 0, 1, 0
                ]);
        },
        
        adjustHue : function( degrees ) {
            degrees *=toRad;
            var cos = Math.cos(degrees), sin = Math.sin(degrees);
            
            return this.concat([
                    ((FILTER.LUMA[0] + (cos * (1 - FILTER.LUMA[0]))) + (sin * -(FILTER.LUMA[0]))), ((FILTER.LUMA[1] + (cos * -(FILTER.LUMA[1]))) + (sin * -(FILTER.LUMA[1]))), ((FILTER.LUMA[2] + (cos * -(FILTER.LUMA[2]))) + (sin * (1 - FILTER.LUMA[2]))), 0, 0, 
                    ((FILTER.LUMA[0] + (cos * -(FILTER.LUMA[0]))) + (sin * 0.143)), ((FILTER.LUMA[1] + (cos * (1 - FILTER.LUMA[1]))) + (sin * 0.14)), ((FILTER.LUMA[2] + (cos * -(FILTER.LUMA[2]))) + (sin * -0.283)), 0, 0, 
                    ((FILTER.LUMA[0] + (cos * -(FILTER.LUMA[0]))) + (sin * -((1 - FILTER.LUMA[0])))), ((FILTER.LUMA[1] + (cos * -(FILTER.LUMA[1]))) + (sin * FILTER.LUMA[1])), ((FILTER.LUMA[2] + (cos * (1 - FILTER.LUMA[2]))) + (sin * FILTER.LUMA[2])), 0, 0, 
                    0, 0, 0, 1, 0
                ]);
        },
        
        average : function( r, g, b ) {
            if (typeof r == 'undefined') r=0.3333;
            if (typeof g == 'undefined') g=0.3333;
            if (typeof b == 'undefined') b=0.3334;
            
            return this.concat([
                    r, g, b, 0, 0, 
                    r, g, b, 0, 0, 
                    r, g, b, 0, 0, 
                    0, 0, 0, 1, 0
                ]);
        },
        
        quickContrastCorrection : function(contrast) {
            if (typeof contrast == 'undefined') contrast=1.2;
            
            return this.concat([
                contrast, 0, 0, 0, 0, 
                0, contrast, 0, 0, 0, 
                0, 0, contrast, 0, 0, 
                0, 0, 0, 1, 0
                ]);
        },
        
        quickSepia : function(amount) {
            if (typeof amount == 'undefined') amount=10;
            if (amount>100) amount=100;
            amount *= 2.55;
            return this.concat([
                FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 40, 
                FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 20, 
                FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, -amount, 
                0, 0, 0, 1, 0
            ]);
        },
        
        quickSepia2 : function(r, g, b) {
            if (typeof r == 'undefined') r=1;
            if (typeof g == 'undefined') g=r;
            if (typeof b == 'undefined') b=r;
            
            return this.concat([
                r*0.5, 0.5, 0.5, 0, 0, 
                0.33, g*0.33, 0.33, 0, 0, 
                0.25, 0.25, b*0.25, 0, 0, 
                0, 0, 0, 1, 0
            ]);
        },
        
        /*quickSepia2 : function(r, g, b) {
            if (typeof r == 'undefined') r=1;
            if (typeof g == 'undefined') g=r;
            if (typeof b == 'undefined') b=r;
            
            return this.concat([
                r*0.3930000066757202, 0.7689999938011169, 0.1889999955892563, 0, 0, 
                0.3490000069141388, g*0.6859999895095825, 0.1679999977350235, 0, 0, 
                0.2720000147819519, 0.5339999794960022, b*0.1309999972581863, 0, 0, 
                0, 0, 0, 1, 0
            ]);
        },*/
        
        threshold : function(threshold, factor) {
            if (typeof factor == 'undefined')  factor=256;
            
            return this.concat([
                    (FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
                    (FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
                    (FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
                    0, 0, 0, 1, 0
                ]);
        },
        
        threshold_rgb : function(threshold, factor) {
            if (typeof factor == 'undefined')  factor=256;
            
            return this.concat([
                    factor, 0, 0, 0, (-(factor-1) * threshold), 
                    0, factor, 0, 0, (-(factor-1) * threshold), 
                    0,  0, factor, 0, (-(factor-1) * threshold), 
                    0, 0, 0, 1, 0
                ]);
        },
        
        threshold_alpha : function(threshold, factor) {
            if (typeof threshold == 'undefined')  threshold=0.5;
            if (typeof factor == 'undefined') factor=256;
            
            return this.concat([
                    1, 0, 0, 0, 0, 
                    0, 1, 0, 0, 0, 
                    0, 0, 1, 0, 0, 
                    0, 0, 0, factor, (-factor * threshold)
                ]);
        },
        
        // blend with another filter
        blend : function( filt, amount ) {
            this.matrix=(this.matrix) ? CMblend(this.matrix, filt.matrix, amount) : new CM(filt.matrix);
            return this;
        },
        
        concat : function(mat) {
            this.matrix = (this.matrix) ? CMconcat(this.matrix, new CM(mat)) : new CM(mat);
            return this;
        },
        
        // used for internal purposes
        _apply : function(p, w, h) {
            if (!this.matrix)  return p;
            var pl=p.length, m=this.matrix, i=0, t0, t1, t2, t3;
            while (i<pl)
            {
                t0=p[i]; t1=p[i+1]; t2=p[i+2]; t3=p[i+3];
                p[i]    =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p[i+1]  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p[i+2]  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p[i+3]  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                i+=4;
            }
            return p;
        },
        
        apply : function(image) {
            if (!this.matrix) return image;
            return image.setData(this._apply(image.getData(), image.width, image.height));
        },
        
        reset : function() {
            this.matrix=null; return this;
        }
    };
    
})(FILTER);