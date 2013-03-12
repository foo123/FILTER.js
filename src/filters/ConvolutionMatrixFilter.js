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
    FILTER.ConvolutionMatrixFilter=function(image,weights,opaque)
    {
        this.image=image;
        if (typeof weights != 'undefined')
            this.weights=weights;
        this.opaque=true;
        if (typeof opaque != 'undefined')
            this.opaque=opaque;
    };
    FILTER.ConvolutionMatrixFilter.prototype=new FILTER.Filter(); 
    FILTER.ConvolutionMatrixFilter.prototype.constructor=FILTER.ConvolutionMatrixFilter; 
    FILTER.ConvolutionMatrixFilter.prototype.apply=function() 
    {
      var side = Math.round(Math.sqrt(this.weights.length));
      var halfSide = Math.floor(side/2);
      var data=this.image.getPixelData();
      var src = data.data;
      var sw = data.width;
      var sh = data.height;
      var dst=this.image.clone().getPixelData();
      // pad output by the convolution matrix
      var w = sw;
      var h = sh;
      // go through the destination image pixels
      var alphaFac = this.opaque ? 1 : 0;
      for (var y=0; y<h; y++) {
        for (var x=0; x<w; x++) {
          var sy = y;
          var sx = x;
          var dstOff = (y*w+x)*4;
          // calculate the weighed sum of the source image pixels that
          // fall under the convolution matrix
          var r=0, g=0, b=0, a=0;
          for (var cy=0; cy<side; cy++) {
            for (var cx=0; cx<side; cx++) {
              var scy = sy + cy - halfSide;
              var scx = sx + cx - halfSide;
              if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                var srcOff = (scy*sw+scx)*4;
                var wt = this.weights[cy*side+cx];
                r += src[srcOff] * wt;
                g += src[srcOff+1] * wt;
                b += src[srcOff+2] * wt;
                a += src[srcOff+3] * wt;
              }
            }
          }
          dst.data[dstOff] = r;
          dst.data[dstOff+1] = g;
          dst.data[dstOff+2] = b;
          dst.data[dstOff+3] = a + alphaFac*(255-a);
        }
      }
      this.image.setPixelData(dst);
    };
    FILTER.ConvolutionMatrixFilter.prototype.blur=function()
    {
        var w=1/9;
        this.weights=[ w, w, w,
                        w, w, w,
                        w, w, w ];
        return this;
    }; 
    FILTER.ConvolutionMatrixFilter.prototype.blur4=function()
    {
        var w=1/16;
        this.weights=[ w, w, w, w,
                        w, w, w, w,
                        w, w, w, w,
                        w, w, w, w ];
        return this;
    }; 
    FILTER.ConvolutionMatrixFilter.prototype.sharpen=function()
    {
        this.weights=[  -1, -1,  -1,
                        -1,  9, -1,
                         -1, -1,  -1 ];
        return this;
    }; 
    FILTER.ConvolutionMatrixFilter.prototype.gauss=function()
    {
        this.weights=[ 1.0/16.0, 2.0/16.0, 1.0/16.0,
                    2.0/16.0, 4.0/16.0, 2.0/16.0,
                    1.0/16.0, 2.0/16.0, 1.0/16.0
                         ];
        return this;
    }; 
    FILTER.ConvolutionMatrixFilter.prototype.laplace=function()
    {
        this.weights=[ 0,   1,   0,
                        1,  -4,   1,
                        0,   1,   0
                         ];
        return this;
    }; 
    FILTER.ConvolutionMatrixFilter.prototype.emboss=function()
    {
        this.weights=[ -2,   -1,   0,
                        -1,  1,   1,
                        0,   1,   2
                         ];
        return this;
    }; 
    FILTER.ConvolutionMatrixFilter.prototype.edge=function()
    {
        this.weights=[ 0,   1,   0,
                        1,  -4,   1,
                        0,   1,   0
                         ];
        return this;
    }; 
    FILTER.ConvolutionMatrixFilter.prototype.motionblur=function(dir)
    {
        var w=1/9;
        var i,j;
        this.weights=[  0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0, 0
                         ];
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
    }; 
})(FILTER);