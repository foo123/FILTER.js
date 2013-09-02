/**
*
* Sobel  Filter (Composite Filter)
*
* @param Target (Image)
* @package FILTER.js
*
**/
(function(FILTER){
    FILTER.SobelFilter=function(image)
    {
        this.image=image;
    };
    FILTER.SobelFilter.prototype=new FILTER.Filter(); 
    FILTER.SobelFilter.prototype.constructor=FILTER.SobelFilter; 
    FILTER.SobelFilter.prototype.apply=function() 
    {
        // grayscale
        new FILTER.ColorMatrixFilter(this.image).grayscale().apply();
        var grayscale = this.image.getPixelData();
        // vertical gradient
        new FILTER.ConvolutionMatrixFilter(this.image).sobelGradX().apply();
        
        var vertical = this.image.getPixelData();
        // restore
        this.image.setPixelData(grayscale);
        // horizontal gradient
        new FILTER.ConvolutionMatrixFilter(this.image).sobelGradY().apply();
        
        var horizontal = this.image.getPixelData();
        var dst=[];
        for (var i=0; i<grayscale.data.length; i+=4) {
          // make the vertical gradient red
          var v = Math.abs(vertical.data[i]);
          dst[i] = v;
          // make the horizontal gradient green
          var h = Math.abs(horizontal.data[i]);
          dst[i+1] = h;
          // and mix in some blue for aesthetics
          dst[i+2] = (v+h)/4;
          dst[i+3] = 255; // opaque alpha
        }
        var data = this.image.getPixelData();
        for (var i=0;i<data.data.length;i++)
        data.data[i]=dst[i];
      this.image.setPixelData(data,0,0);
    };
    
})(FILTER);