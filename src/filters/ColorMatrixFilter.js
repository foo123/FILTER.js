/**
*
* Color Matrix Filter
* matrix is 4x5 array of values which are (eg for row 1: Red value): 
* New red Value=Multiplier for red value, multiplier for Green value, multiplier for Blue Value, Multiplier for Alpha Value,constant  bias term
* other rows are similar but for new Green, Blue and Alpha values respectively 
*
* @param Target (Image)
* @param colorMatrix (Matrix)
* @package FILTER.js
*
**/
(function(FILTER){

    FILTER.LUMA={
        R : 0.212671,
        G : 0.71516,
        B : 0.072169
    };
    
    
    var 
        ColorMatrix=FILTER.Array32F,
        toRad=Math.PI/180, toDeg=180/Math.PI
    ;
    
    
    
    FILTER.ColorMatrixFilter=function(image, matrix)
    {
        this.matrix=new ColorMatrix(
                    1,0,0,0,0,
                    0,1,0,0,0,
                    0,0,1,0,0,
                    0,0,0,1,0
                );
        this.image=image;
        if (typeof matrix != 'undefined' && matrix.length) this.concat(new ColorMatrix(matrix));
    };
    
    FILTER.ColorMatrixFilter.prototype={
    
        /*concat : function(mat) {
            var temp = [];
            var i = 0;
            var x, y;
            for (y = 0; y < 4; y++ )
            {
                
                for (x = 0; x < 5; x++ )
                {
                    temp[ ( i + x) ] = (mat[i ]) * (this.matrix[x]) +
                                           (mat[(i+1)]) * (this.matrix[(x + 5)]) +
                                           (mat[(i+2)]) * (this.matrix[(x + 10)]) +
                                           (mat[(i+3)]) * (this.matrix[(x + 15)]) +
                                           (x == 4 ? (mat[(i+4)]) : 0);
                }
                i+=5;
            }
            
            this.matrix = temp;
                    
        },*/
        
        concat : function(mat) {
            var t=new ColorMatrix(20), tm=this.matrix, i= 0, k, m0, m1, m2, m3, m4;
            
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
            
            tm=null; this.matrix = t;
        },
        
        apply : function() {
            var pd=this.image.getPixelData(), p=pd.data, pl=p.length, m=this.matrix, i, t0, t1, t2, t3;
            for (i=0; i<pl; i+=4)
            {
                t0=p[i]; t1=p[i+1]; t2=p[i+2]; t3=p[i+3];
                p[i]    =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p[i+1]  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p[i+2]  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p[i+3]  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
            }
            this.image.setPixelData(pd);
        },
        
        desaturate : function() {
            this.concat(new ColorMatrix(
                        FILTER.LUMA.R, FILTER.LUMA.G, FILTER.LUMA.B, 0, 0, 
                        FILTER.LUMA.R, FILTER.LUMA.G, FILTER.LUMA.B, 0, 0, 
                        FILTER.LUMA.R, FILTER.LUMA.G, FILTER.LUMA.B, 0, 0, 
                        0, 0, 0, 1, 0
                    ));
            return this;
        },
        
        grayscale : function() { return this.desaturate(); },
        
        colorize : function(rgb, amount) {
            var r, g, b, inv_amount;
            if (typeof amount=='undefined') amount=1;
            r = (((rgb >> 16) & 0xFF) / 0xFF);
            g = (((rgb >> 8) & 0xFF) / 0xFF);
            b = ((rgb & 0xFF) / 0xFF);
            inv_amount = (1 - amount);

            this.concat(new ColorMatrix(
                        (inv_amount + ((amount * r) * FILTER.LUMA.R)), ((amount * r) * FILTER.LUMA.G), ((amount * r) * FILTER.LUMA.B), 0, 0, 
                        ((amount * g) * FILTER.LUMA.R), (inv_amount + ((amount * g) * FILTER.LUMA.G)), ((amount * g) * FILTER.LUMA.B), 0, 0, 
                        ((amount * b) * FILTER.LUMA.R), ((amount * b) * FILTER.LUMA.G), (inv_amount + ((amount * b) * FILTER.LUMA.B)), 0, 0, 
                            0, 0, 0, 1, 0
                        ));
            return this;
        },
        
        invert : function() {
            this.concat(new ColorMatrix(
                        -1 ,  0,  0, 0, 255,
                        0 , -1,  0, 0, 255,
                        0 ,  0, -1, 0, 255,
                        0,   0,  0, 1,   0
                    ));
             return this;
        },
        
        saturation : function( s ) {
            var sInv. irlum, iglum, iblum;
            sInv = (1 - s);  irlum = (sInv * FILTER.LUMA.R);
            iglum = (sInv * FILTER.LUMA.G);  iblum = (sInv * FILTER.LUMA.B);
            
            this.concat(new ColorMatrix(
                    (irlum + s), iglum, iblum, 0, 0, 
                    irlum, (iglum + s), iblum, 0, 0, 
                    irlum, iglum, (iblum + s), 0, 0, 
                    0, 0, 0, 1, 0
                ));
            return this;
        },
        
        contrast : function(r, g, b) {
            if (typeof g == 'undefined')  g=r;
            if (typeof b == 'undefined')  b=r;
            r += 1; g += 1; b += 1;
            
            this.concat(new ColorMatrix(
                    r, 0, 0, 0, (128 * (1 - r)), 
                    0, g, 0, 0, (128 * (1 - g)), 
                    0, 0, b, 0, (128 * (1 - b)), 
                    0, 0, 0, 1, 0
                ));
            return this;
        },
        
        brightness : function(r, g, b) {
            if (typeof g == 'undefined')  g=r;
            if (typeof b == 'undefined')  b=r;
            
            this.concat(new ColorMatrix(
                    1, 0, 0, 0, r, 
                    0, 1, 0, 0, g, 
                    0, 0, 1, 0, b, 
                    0, 0, 0, 1, 0
                ));
            return this;
        },
        
        adjustHue : function( degrees ) {
            degrees *=toRad;
            var cos = Math.cos(degrees), sin = Math.sin(degrees);
            
            this.concat(new ColorMatrix(
                    ((FILTER.LUMA.R + (cos * (1 - FILTER.LUMA.R))) + (sin * -(FILTER.LUMA.R))), ((FILTER.LUMA.G + (cos * -(FILTER.LUMA.G))) + (sin * -(FILTER.LUMA.G))), ((FILTER.LUMA.B + (cos * -(FILTER.LUMA.B))) + (sin * (1 - FILTER.LUMA.B))), 0, 0, 
                    ((FILTER.LUMA.R + (cos * -(FILTER.LUMA.R))) + (sin * 0.143)), ((FILTER.LUMA.G + (cos * (1 - FILTER.LUMA.G))) + (sin * 0.14)), ((FILTER.LUMA.B + (cos * -(FILTER.LUMA.B))) + (sin * -0.283)), 0, 0, 
                    ((FILTER.LUMA.R + (cos * -(FILTER.LUMA.R))) + (sin * -((1 - FILTER.LUMA.R)))), ((FILTER.LUMA.G + (cos * -(FILTER.LUMA.G))) + (sin * FILTER.LUMA.G)), ((FILTER.LUMA.B + (cos * (1 - FILTER.LUMA.B))) + (sin * FILTER.LUMA.B)), 0, 0, 
                    0, 0, 0, 1, 0
                ));
            return this;
        },
        
        blend : function( filt, amount ) {
            var inv_amount = (1 - amount), i = 0;
            while (i < 20) { this.matrix[i] = ((inv_amount * (this.matrix[i])) + (amount * (filt.matrix[i])));  i++; };
            return this;
        },
        
        average : function( r, g, b ) {
            if (typeof r == 'undefined') r=0.3333;
            if (typeof g == 'undefined') g=0.3333;
            if (typeof b == 'undefined') b=0.3334;
            
            this.concat(new ColorMatrix(
                    r, g, b, 0, 0, 
                    r, g, b, 0, 0, 
                    r, g, b, 0, 0, 
                    0, 0, 0, 1, 0
                ));
            return this;
        },
        
        threshold : function(threshold, factor) {
            if (typeof factor == 'undefined')  factor=256;
            this.concat(new ColorMatrix(
                    (FILTER.LUMA.R * factor), (FILTER.LUMA.G * factor), (FILTER.LUMA.B * factor), 0, (-(factor-1) * threshold), 
                    (FILTER.LUMA.R * factor), (FILTER.LUMA.G * factor), (FILTER.LUMA.B * factor), 0, (-(factor-1) * threshold), 
                    (FILTER.LUMA.R * factor), (FILTER.LUMA.G * factor), (FILTER.LUMA.B * factor), 0, (-(factor-1) * threshold), 
                    0, 0, 0, 1, 0
                ));
            return this;
        },
        
        threshold_rgb : function(threshold, factor) {
            if (typeof factor == 'undefined')  factor=256;
            this.concat(new ColorMatrix(
                    factor, 0, 0, 0, (-(factor-1) * threshold), 
                    0, factor, 0, 0, (-(factor-1) * threshold), 
                    0,  0, factor, 0, (-(factor-1) * threshold), 
                    0, 0, 0, 1, 0
                ));
            return this;
        },
        
        threshold_alpha : function(threshold, factor) {
            if (typeof threshold == 'undefined')  threshold=0.5;
            if (typeof factor == 'undefined') factor=256;
            this.concat(new ColorMatrix(
                    1, 0, 0, 0, 0, 
                    0, 1, 0, 0, 0, 
                    0, 0, 1, 0, 0, 
                    0, 0, 0, factor, (-factor * threshold)
                ));
            return this;
        }
    };
    
})(FILTER);