/**
*
* Geometric Map Filter
*
* Distorts the target image according to a geometric mapping function
*
* @param geoMap Optional (the geometric mapping function)
* @package FILTER.js
*
**/
(function(FILTER){
    
    /*function identityMap(im, w, h)
    {
        return im;
    }*/
    
    function affineMap(im, w, h)
    {
        var x, y, yw, i, j, imArea=w*h, imLen=im.length, dst=new FILTER.ImArray(im),
            a=this.a, b=this.b, c=this.c, d=this.d, dw
        ;
        
        i=0; x=0; y=0; yw=0; dw=d*w;
        while (i<imLen)
        {
            j=~~(a*x+c + b*yw+dw);
            if (j>=0 && j<imArea)
            {
                j<<=2;
                dst[i]=im[j];   dst[i+1]=im[j+1];
                dst[i+2]=im[j+2];  dst[i+3]=im[j+3];
            }
            i+=4; x++; if (x>=w) { x=0; y++; yw+=w; }
        }
        return dst;
    }
    
    function flipXMap(im, w, h)
    {
        var x, y, yw, i, j, l=im.length, dst=new FILTER.ImArray(l);
        
        i=0; x=0; y=0; yw=0;
        while (i<l)
        {
            j=(w-1-x+yw)<<2;
            dst[i]=im[j];   dst[i+1]=im[j+1];
            dst[i+2]=im[j+2];  dst[i+3]=im[j+3];
            i+=4; x++; if (x>=w) { x=0; y++; yw+=w; }
        }
        return dst;
    }
    
    function flipYMap(im, w, h)
    {
        var x, y, yw2, i, j, l=im.length, dst=new FILTER.ImArray(l);
        
        i=0; x=0; y=0; yw2=(h-1)*w;
        while (i<l)
        {
            j=(x+yw2)<<2;
            dst[i]=im[j];   dst[i+1]=im[j+1];
            dst[i+2]=im[j+2];  dst[i+3]=im[j+3];
            i+=4; x++; if (x>=w) { x=0; y++; yw2-=w; }
        }
        return dst;
    }
    
    function flipXYMap(im, w, h)
    {
        var x, y, yw, yw2, i, j, l=im.length, dst=new FILTER.ImArray(l);
        
        i=0; x=0; y=0; yw2=(h-1)*w;
        while (i<l)
        {
            j=(w-1-x+yw2)<<2;
            dst[i]=im[j];   dst[i+1]=im[j+1];
            dst[i+2]=im[j+2];  dst[i+3]=im[j+3];
            i+=4; x++; if (x>=w) { x=0; y++; yw+=w; yw2-=w; }
        }
        return dst;
    }
    
    function polarMap(im, w, h)
    {
        // todo
        return im;
    }
    
    function cartesianMap(im, w, h)
    {
        // todo
        return im;
    }
    
    function twirlMap(im, w, h)
    {
        // todo
        return im;
    }
    
    FILTER.GeometricMapFilter=function(map)
    {
        this.map=map;
    };

    FILTER.GeometricMapFilter.prototype={
    
        // parameters
        map : null,
        a : 1,
        b : 1,
        c : 0,
        d : 0,
        mode : FILTER.MODE.CLAMP,
        
        affine : function(a, b, c, d) {
            this.a=a; this.b=b; this.c=c; this.d=d;
            this.map=affineMap;  return this;
        },
        
        flipX : function() {
            this.map=flipXMap;  return this;
        },
        
        flipY : function() {
            this.map=flipYMap;  return this;
        },
        
        flipXY : function() {
            this.map=flipXYMap;  return this;
        },
        
        polar : function() {
            this.map=polarMap;  return this;
        },
        
        cartesian : function() {
            this.map=cartesianMap;  return this;
        },
        
        twirl : function() {
            this.map=twirlMap;  return this;
        },
        
        /*identity : function() {
            this.map=identityMap;
            return this;
        },*/
        
        // used for internal purposes
        _apply : function(im, w, h) {
            if (!this.map) return im;
            
            return this.map.call(this, im, w, h);
        },
        
        apply : function(image) {
            if (!this.map) return image;
            return image.setData(this.map.call(this, image.getData(), image.width, image.height));
        },
        
        reset : function() {
            this.map=null; return this;
        }
    };
    
})(FILTER);