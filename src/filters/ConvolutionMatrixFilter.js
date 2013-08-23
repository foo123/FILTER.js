/**
*
* Convolution Matrix Filter
*
* @param Target (Image)
* @param weights (Array)
* @param opaque (Bool)
* @package FILTER.js
*
**/
(function(FILTER){
    
    var 
        ConvolutionMatrix=FILTER.Array32F
    ;
    
    function padMatrix(m, d, dnew) 
    {
        // todo
        return m;
    }
    
    function addMatrix(m1. m2)
    {
        var l= m1.length, i, m=new ConvolutionMatrix(m1.length);
        for (i=0; i<l; i++) m[i]=m1[i]+m2[i];
        return m;
    }
    
    function subtractMatrix(m1. m2)
    {
        var l= m1.length, i, m=new ConvolutionMatrix(m1.length);
        for (i=0; i<l; i++) m[i]=m1[i]-m2[i];
        return m;
    }
    
    function multiplyMatrix(m1, m2, d) 
    {
        var i, j, k, m=new ConvolutionMatrix(m1.length), sum, ind1, ind2, ind;
        for (i=0; i<d; i++)
        {
            for (j=0; j<d; j++)
            {
                sum=0;
                for (k=0; k<d; k++) { sum+=m1[i*d + k]*m2[k*d + j];}
                m[i*d + j]=sum;
            }
        }
        return m;
    }
    
    function eye(d) 
    { 
        // todo
        return new ConvolutionMatrix(
            0, 0 ,0,
            0, 1, 0,
            0, 0, 0
        ); 
    }
    
    FILTER.ConvolutionMatrixFilter=function(image, weights, opaque)
    {
        this.opaque=true;
        if (typeof opaque != 'undefined') this.opaque=opaque;
        
        this.image=image;
        
        if (typeof weights != 'undefined' && weights.length)
        {
            this.weights=new ConvolutionMatrix(weights);
            this.dim = Math.round(Math.sqrt(weights.length));
        }
        else 
        {
            this.weights=eye(3);
            this.dim = 3;
        }
    };
    
    FILTER.ConvolutionMatrixFilter.prototype={
        
        apply : function() {
            var side = this.dim, halfSide = side>>1,
                data=this.image.getPixelData(),
                src = data.data, sw = data.width, sh = data.height,
                dst=this.image.clone().getPixelData(),
                // pad output by the convolution matrix
                w = sw, h = sh,
                // go through the destination image pixels
                alphaFac = this.opaque ? 1 : 0,
                x, y, sx, sy, dstOff, r=0, g=0, b=0, a=0, cx, cy, scx, scy,
                srcOff, wt, ty, yh
                ;
            
            for (y=0; y<h; y++) 
            {
                yh=y*w;
                for (x=0; x<w; x++) 
                {
                    sy = y; sx = x;  dstOff = (yh+x)<<2;
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=0; g=0; b=0; a=0;
                    for (cy=0; cy<side; cy++) 
                    {
                        ty=cy*side;
                        for (cx=0; cx<side; cx++) 
                        {
                            scy = sy + cy - halfSide;  scx = sx + cx - halfSide;
                            if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) 
                            {
                                srcOff = (scy*sw+scx)<<2; wt = this.weights[ty+cx];
                                r += src[srcOff] * wt; g += src[srcOff+1] * wt;
                                b += src[srcOff+2] * wt; a += src[srcOff+3] * wt;
                            }
                        }
                    }
                    dst.data[dstOff] = r;  dst.data[dstOff+1] = g;
                    dst.data[dstOff+2] = b;  dst.data[dstOff+3] = a + alphaFac*(255-a);
                }
            }
            this.image.setPixelData(dst);
        },
        
        // generic low-pass filter
        lowPass : function(d) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            var size=d*d, w=new ConvolutionMatrix(size), fact=1/size, i;
            for (i=0; i<size; i++) w[i]=fact; 
            this.weights=multiplyMatrix(this.weights, w); this.dim=d;
            return this;
        },

        // generic high-pass filter (I-LP)
        highPass : function(d, f) {
            d=(typeof d == 'undefined') ? 3 : ((d%2) ? d : d+1);
            f=(typeof f == 'undefined') ? 1 : f;
            var size=d*d, w=new ConvolutionMatrix(size), fact=-f/size, i;
            for (i=0; i<size; i++) w[i]=fact; w[size>>1 +1]=1+fact;
            this.weights=multiplyMatrix(this.weights, w); this.dim=d;
            return this;
        },

        // generic binomial low-pass filter
        binomialLowPass : function(d) {
            d=3;
            var size=d*d, f=0.0625, i;
            this.weights=multiplyMatrix(this.weights, new ConvolutionMatrix(
                            f, 2*f, f,
                            2*f, 4*f, 2*f,
                            f, 2*f, f
                        )); 
            this.dim=d;
            return this;
        },

        // generic binomial high-pass filter
        binomialHighPass : function(d) {
            d=3;
            var size=d*d, f=0.0625, i;
            this.weights=multiplyMatrix(this.weights, new ConvolutionMatrix(
                            -f, -2*f, -f,
                            -2*f, 12*f, -2*f,
                            -f, -2*f, -f
                        )); 
            this.dim=d;
            return this;
        },
        
        // X-gradient, partial X-derivative (Prewitt)
        gradX : function() {
            var sqrt2=Math.sqrt(2.0);
            this.weights=multiplyMatrix(this.weights, new ConvolutionMatrix( 
                            -1,   0,   1,
                            -sqrt2,  0,   sqrt2,
                            -1,   0,   1
                        );
            this.dim=3;
            return this;
        },
        
        // Y-gradient, partial Y-derivative (Prewitt)
        gradY : function() {
            var sqrt2=Math.sqrt(2.0);
            this.weights=multiplyMatrix(this.weights, new ConvolutionMatrix(
                            1,   sqrt2,   1,
                            0,  0,   0,
                           -1,   -sqrt2,  -1
                        ));
            this.dim=3;
            return this;
        },
        
        // directional gradient (Prewitt)
        gradTheta : function(theta) {
            var c=Math.cos(theta), s=Math.sin(theta);
            this.weights=multiplyMatrix(this.weights, new ConvolutionMatrix(
                            -c+s,   s,   c+s,
                            -c,  0,   s,
                           -c-s,   -s,  c-s
                       ));
            this.dim=3;
            return this;
        },
        
        // partial X-derivative (Sobel)
        sobelGradX : function() {
            this.weights=multiplyMatrix(this.weights, new ConvolutionMatrix(
                            -1,   0,   1,
                            -2,  0,   2,
                            -1,   0,   1
                        ));
            this.dim=3;
            return this;
        },
        
        // partial Y-derivative (Sobel)
        sobelGradY : function() {
            this.weights=multiplyMatrix(this.weights, new ConvolutionMatrix(
                            1,   2,   1,
                            0,  0,   0,
                            -1,   -2,   -1
                        ));
            this.dim=3;
            return this;
        },
        
        laplacian : function() {
            this.weights=multiplyMatrix(this.weights, new ConvolutionMatrix(
                            0,   -1,   0,
                            -1,  4,   -1,
                            0,   -1,   0
                        ));
            this.dim=3;
            return this;
        },
        
        emboss : function() {
            this.weights=multiplyMatrix(this.weights, new ConvolutionMatrix(
                            -2,   -1,   0,
                            -1,  1,   1,
                            0,   1,   2
                         ));
            this.dim=3;
            return this;
        },
        
        /*edge : function() {
            this.weights=[ 0,   1,   0,
                            1,  -4,   1,
                            0,   1,   0
                             ];
            return this;
        },*/
        
        motionblur : function(dir) {
            var w=1/9;
            var i,j;
            this.weights=multiplyMatrix(this.weights, new ConvolutionMatrix(
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0,
                            0, 0, 0, 0, 0, 0, 0, 0, 0
                         ));
            if (dir==0)
            {
                for (i=0;i<9;i++)
                {
                    this.weights[4*9+i]=w;
                }
            }
            else if (dir==2)
            {
                for (i=0;i<9;i++)
                {
                    this.weights[9*i+5]=w;
                }
            }
            else if (dir==1)
            {
                for (i=0;i<9;i++)
                {
                    this.weights[9*Math.round(i)+Math.round(i)]=w;
                }
            }
            return this;
        } ,
        
        blur : function(d) { return this.lowPass(d); },
        
        sharpen : function(d, f) { f=(typeof f == 'undefined') ? 0.5 : f;  return this.highPass(d, f); },
        
        gauss : function(d) { return this.binomialLowPass(d); }
    };
    
})(FILTER);