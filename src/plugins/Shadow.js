/**
*
* Drop Shadow Filter Plugin  (INCOMPLETE)
* @package FILTER.js
*
**/
(function(FILTER){

    var Atan2=Math.atan2, Sqrt=Math.sqrt, Cos=Math.cos, Sin=Math.sin
        ;
        
    // a sample shadow filter  (adapted from http://www.jhlabs.com/ip/filters/ShadowFilter.html)
    // not the best implementation
    // used for illustration purposes on how to create a plugin filter
    FILTER.DropShadowFilter=FILTER.Create({
        // parameters
        dx: 2,
        dy: 2,
        color: 0,
        radius: 3,
        opacity: 0.5,
        
        // this is the filter constructor
        init: function(dx, dy, radius, color, opacity) {
            this.dx=dx || 2;
            this.dy=dy || 2;
            this.radius=radius || 3;
            this.color=color || 0;
            this.opacity=opacity || 0.5;
            
            this.angle=Atan2(this.dy, this.dx);
            this.distance=Sqrt(this.dx*this.dx + this.dy*this.dy);
            this.colorR=(this.color>>16)&255;
            this.colorG=(this.color>>8)&255;
            this.colorB=(this.color)&255;
            
            this.gaussFilter=new FILTER.ConvolutionMatrixFilter();
            this.colorFilter=new FILTER.ColorMatrixFilter();
            this.affineFilter=new FILTER.GeometricMapFilter().affine();
        },
        
        // this is the filter actual apply method routine
        apply: function(im, w, h) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // for this filter, no need to clone the image data, operate in-place
            var xOffset = this.distance*Cos(this.angle), yOffset = -this.distance*Sin(this.angle),
                l=im.length, shadow=new FILTER.ImArray(im), i
            ;
            
            // get the alpha channel
            // Make a black mask from the image's alpha channel 
            this.colorFilter.reset().concat([
                0, 0, 0, this.colorR, 0,
                0, 0, 0, this.colorG, 0,
                0, 0, 0, this.colorB, 0,
                0, 0, 0, this.opacity, 0
            ]);
            this.gaussFilter.gaussBlur(this.radius);
            this.affineFilter.a=1; this.affineFilter.b=1; this.affineFilter.c=xOffset; this.affineFilter.d=yOffset;
            
            shadow = this.affineFilter._apply(
                                this.gaussFilter._apply(
                                        this.colorFilter._apply(shadow, w, h)
                                , w, h)
                    , w, h);
            // combine shadow with original image
            i=0; while (i<l) { if (im[i+3]<255) { im[i]+=shadow[i]; im[i+1]+=shadow[i+1]; im[i+2]+=shadow[i+2]; } i+=4; }
            return im;
        }
    });
    
})(FILTER);