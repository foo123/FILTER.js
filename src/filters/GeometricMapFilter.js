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
    
    var IMG=FILTER.ImArray, PI=FILTER.CONSTANTS.PI,
        Sqrt=Math.sqrt, Atan2=Math.atan2,
        Sin=Math.sin, Cos=Math.cos,
        Asin=Math.asin, Tan=Math.tan, Abs=Math.abs,
        toRad=FILTER.CONSTANTS.toRad
        ;
    
    /*function trivialMap(im, w, h)
    {
        return im;
    }*/
    
    function flipXMap(im, w, h)
    {
        var x, y, yw, i, j, l=im.length, dst=new IMG(l);
        
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
        var x, y, yw2, i, j, l=im.length, dst=new IMG(l);
        
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
        var x, y, yw, yw2, i, j, l=im.length, dst=new IMG(l);
        
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
    
    function rotateCWMap(im, w, h)
    {
        var x, y, yw, xw, i, j, l=im.length, dst=new IMG(l),
            hw=h*w;
        
        i=0; x=0; y=0; xw=hw-1;
        while (i<l)
        {
            j=(y + xw)<<2;
            dst[i]=im[j];   dst[i+1]=im[j+1];
            dst[i+2]=im[j+2];  dst[i+3]=im[j+3];
            i+=4; x++; xw-=w; if (x>=w) { x=0; xw=hw-1; y++; }
        }
        return dst;
    }
    
    function rotateCCWMap(im, w, h)
    {
        var x, y, yw, xw, i, j, l=im.length, dst=new IMG(l),
            hw=h*w;
        
        i=0; x=0; y=0; xw=0;
        while (i<l)
        {
            j=(w-1-y + xw)<<2;
            dst[i]=im[j];   dst[i+1]=im[j+1];
            dst[i+2]=im[j+2];  dst[i+3]=im[j+3];
            i+=4; x++; xw+=w; if (x>=w) { x=0; xw=0; y++; }
        }
        return dst;
    }
    
    /*function rotateMap(im, w, h)
    {
        var x, y, yw, xw, i, j, l=im.length, dst=new IMG(l),
            hw=h*w, angle=this.angle, dx, dy, t;
        
        t=Tan(angle*toRad);
        dy=t*dx;
        i=0; x=0; y=0; xw=0;
        while (i<l)
        {
            j=(w-1-y + xw)<<2;
            dst[i]=im[j];   dst[i+1]=im[j+1];
            dst[i+2]=im[j+2];  dst[i+3]=im[j+3];
            i+=4; x++; xw+=w; if (x>=w) { x=0; xw=0; y++; }
        }
        return dst;
    }*/
    
    function genericMap(im, w, h)
    {
        var x, y, i, j, imLen=im.length, dst=new IMG(imLen),
            invTransform=this.inverseTransform, mode=this.mode,
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            t, tx, ty
        ;
        
        i=0; x=0; y=0;
        while (i<imLen)
        {
            t = invTransform([x, y], w, h); tx = ~~(t[0]); ty = ~~(t[1]);
            if (0>tx || tx>=w || 0>ty || ty>=h)
            {
                switch(mode)
                {
                    case _Wrap:
                        if (ty>=h) ty-=h;
                        else if (ty<0) ty+=h;
                        if (tx>=w) tx-=w;
                        else if (tx<0)  tx+=w;
                        break;
                        
                    case _Clamp:
                    default:
                        if (ty>=h)  ty=h-1;
                        else if (ty<0) ty=0;
                        if (tx>=w) tx=w-1;
                        else if (tx<0) tx=0;
                        break;
                }
            }
            j=(tx + ty*w)<<2;
            dst[i]=im[j];   dst[i+1]=im[j+1];
            dst[i+2]=im[j+2];  dst[i+3]=im[j+3];
            
            i+=4; x++; if (x>=w) { x=0; y++; }
        }
        return dst;
    }
    
    function affineMap(im, w, h)
    {
        var x, y, yw, i, j, imArea=w*h, imLen=im.length, dst=new IMG(imLen),
            mat=this.matrix, a=mat[0], b=mat[1], c=mat[3], d=mat[4], tx=mat[2], ty=mat[5], 
            tyw, cw, dw, mode=this.mode,
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            nx, ny, bx=w-1, by=imArea-w
        ;
        
        i=0; x=0; y=0; tyw=ty*w; cw=c*w; dw=d*w;
        while (i<imLen)
        {
            nx = ~~(a*x + b*y + tx); ny = ~~(cw*x + dw*y + tyw);
            if (0>nx || nx>bx || 0>ny || ny>by)
            {
                switch(mode)
                {
                    case _Wrap:
                        if (ny>by) ny-=imArea;
                        else if (ny<0) ny+=imArea;
                        if (nx>=w) nx-=w;
                        else if (nx<0)  nx+=w;
                        break;
                        
                    case _Clamp:
                    default:
                        if (ny>by)  ny=by;
                        else if (ny<0) ny=0;
                        if (nx>bx) nx=bx;
                        else if (nx<0) nx=0;
                        break;
                }
            }
            j=(nx + ny)<<2;
            dst[i]=im[j];   dst[i+1]=im[j+1];
            dst[i+2]=im[j+2];  dst[i+3]=im[j+3];
            
            i+=4; x++; if (x>=w) { x=0; y++; }
        }
        return dst;
    }
    
    // adapted from http://je2050.de/imageprocessing/ TwirlMap
    function twirlMap(im, w, h)
    {
        if (0>=this.radius) return im;
        
        var x, y, i, j, imLen=im.length, dst=new IMG(im),
            cX=this.centerX, cY=this.centerY, angle=this.angle, radius=this.radius, mode=this.mode, 
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            d, tx, ty, theta, fact=angle/radius,
            bx=w-1, by=h-1
        ;
        
        i=0; x=0; y=0;
        while (i<imLen)
        {
            tx = x-cX; ty = y-cY; 
            d = Sqrt(tx*tx + ty*ty);
            if (d < radius)
            {
                theta = Atan2(ty, tx) + fact*(radius-d);
                tx = ~~(cX + d*Cos(theta));  ty = ~~(cY + d*Sin(theta));
                if (0>tx || tx>bx || 0>ty || ty>by)
                {
                    switch(mode)
                    {
                        case _Wrap:
                            if (ty>by) ty-=h;
                            else if (ty<0) ty+=h;
                            if (tx>bx) tx-=w;
                            else if (tx<0)  tx+=w;
                            break;
                            
                        case _Clamp:
                        default:
                            if (ty>by)  ty=by;
                            else if (ty<0) ty=0;
                            if (tx>bx) tx=bx;
                            else if (tx<0) tx=0;
                            break;
                    }
                }
                j=(tx + ty*w)<<2;
                dst[i]=im[j];   dst[i+1]=im[j+1];
                dst[i+2]=im[j+2];  dst[i+3]=im[j+3];
            }
            i+=4; x++; if (x>=w) { x=0; y++; }
        }
        return dst;
    }
    
    // adapted from http://je2050.de/imageprocessing/ SphereMap
    function sphereMap(im, w, h)
    {
        if (0>=this.radius) return im;
        
        var x, y, i, j, imLen=im.length, dst=new IMG(im),
            cX=this.centerX, cY=this.centerY, radius=this.radius, mode=this.mode, 
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            d, tx, ty, theta, radius2=radius*radius,
            refraction = 0.555556, invrefraction=1-refraction,
            r2, thetax, thetay, d2, ds, tx2, ty2,
            bx=w-1, by=h-1
        ;
        
        i=0; x=0; y=0;
        while (i<imLen)
        {
            tx = x - cX;  ty = y - cY;
            tx2 = tx*tx; ty2 = ty*ty;
            r2 = tx2 + ty2;
            if (r2 < radius2)
            {
                d2 = radius2 - r2; ds = Sqrt(d2);
                thetax = Asin(tx / Sqrt(tx2 + d2)) * invrefraction;
                thetay = Asin(ty / Sqrt(ty2 + d2)) * invrefraction;
                tx = ~~(x - ds * Tan(thetax));  ty = ~~(y - ds * Tan(thetay));
                if (0>tx || tx>bx || 0>ty || ty>by)
                {
                    switch(mode)
                    {
                        case _Wrap:
                            if (ty>by) ty-=h;
                            else if (ty<0) ty+=h;
                            if (tx>bx) tx-=w;
                            else if (tx<0)  tx+=w;
                            break;
                            
                        case _Clamp:
                        default:
                            if (ty>by)  ty=by;
                            else if (ty<0) ty=0;
                            if (tx>bx) tx=bx;
                            else if (tx<0) tx=0;
                            break;
                    }
                }
                j=(tx + ty*w)<<2;
                dst[i]=im[j];   dst[i+1]=im[j+1];
                dst[i+2]=im[j+2];  dst[i+3]=im[j+3];
            }
            i+=4; x++; if (x>=w) { x=0; y++; }
        }
        return dst;
    }
    
    
    function polarMap(im, w, h)
    {
        // todo
        return im;
        
        /*
        var x, y, i, j, imLen=im.length, dst=new IMG(imLen),
            cX=this.centerX, cY=this.centerY, mode=this.mode, 
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            tx, ty, r, theta, sx=2/w, sy=2/h, f1=(w-1)/(2*w*h), f2=(h-1)/(PI+PI)
        ;
        
        cX=w/2; cY=h/2;
        i=0; x=0; y=0;
        while (i<imLen)
        {
            tx = sx*(x - cX);  ty = sy*(y - cY);
            r = Sqrt(tx*tx + ty*ty); theta = Atan2(ty, tx);
            tx = ~~(r * f1);  ty = ~~((PI + theta) * f2);
            
            if (0>tx || tx>=w || 0>ty || ty>=h)
            {
                switch(mode)
                {
                    case _Wrap:
                        if (ty>=h) ty-=h;
                        if (ty<0) ty+=h;
                        if (tx>=w) tx-=w;
                        if (tx<0)  tx+=w;
                        break;
                        
                    case _Clamp:
                    default:
                        if (ty>=h)  ty=h-1;
                        if (ty<0) ty=0;
                        if (tx>=w) tx=w-1;
                        if (tx<0) tx=0;
                        break;
                }
            }
            j=(tx + ty*w)<<2;
            dst[i]=im[j];   dst[i+1]=im[j+1];
            dst[i+2]=im[j+2];  dst[i+3]=im[j+3];
            i+=4; x++; if (x>=w) { x=0; y++; }
        }
        return dst;
        */
    }
    
    function cartesianMap(im, w, h)
    {
        // toto
        return im;
        
        /*
        var x, y, i, j, imLen=im.length, dst=new IMG(imLen),
            cX=this.centerX, cY=this.centerY, mode=this.mode, 
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            r, tx, ty, theta, PI2=PI+PI,
            sx=0.5*w, sy=0.5*h, f1=2*w*h/(w-1), f2=PI2/(h-1)
        ;
        
        cX=w/2; cY=h/2;
        i=0; x=0; y=0;
        while (i<imLen)
        {
            r = x*f1;  theta = y*f2 - PI;
            tx = r*Cos(theta); ty = r*Sin(theta);
            tx = ~~(sx*tx + cX); ty = ~~(sy*ty + cY);
            
            if (0>tx || tx>=w || 0>ty || ty>=h)
            {
                switch(mode)
                {
                    case _Wrap:
                        if (ty>=h) ty-=h;
                        if (ty<0) ty+=h;
                        if (tx>=w) tx-=w;
                        if (tx<0)  tx+=w;
                        break;
                        
                    case _Clamp:
                    default:
                        if (ty>=h)  ty=h-1;
                        if (ty<0) ty=0;
                        if (tx>=w) tx=w-1;
                        if (tx<0) tx=0;
                        break;
                }
            }
            j=(tx + ty*w)<<2;
            dst[i]=im[j];   dst[i+1]=im[j+1];
            dst[i+2]=im[j+2];  dst[i+3]=im[j+3];
            i+=4; x++; if (x>=w) { x=0; y++; }
        }
        return dst;
        */
    }
    
    FILTER.GeometricMapFilter=function(inverseTransform)
    {
        this.generic(inverseTransform);
    };

    FILTER.GeometricMapFilter.prototype={
    
        // parameters
        _map : null,
        
        inverseTransform : null,
        matrix : null,
        centerX : 0,
        centerY : 0,
        angle : 0,
        radius : 0,
        mode : FILTER.MODE.CLAMP,
        
        /*identity : function() {
            this._map=trivialMap;  return this;
        },*/
        
        generic : function(inverseTransform) {
            if (inverseTransform)
            {
                this.inverseTransform=inverseTransform;
                this._map=genericMap; 
            }
            return this;
        },
        
        affine : function(matrix) {
            if (matrix)
            {
                this.matrix=matrix; 
                this._map=affineMap;  
            }
            return this;
        },
        
        flipX : function() {
            this._map=flipXMap;  return this;
        },
        
        flipY : function() {
            this._map=flipYMap;  return this;
        },
        
        flipXY : function() {
            this._map=flipXYMap;  return this;
        },
        
        rotateCW : function() {
            this._map=rotateCWMap;  return this;
        },
        
        rotateCCW : function() {
            this._map=rotateCCWMap;  return this;
        },
        
        polar : function(centerX, centerY) {
            this.centerX=centerX||0; this.centerY=centerY||0;
            this._map=polarMap;  return this;
        },
        
        cartesian : function(centerX, centerY) {
            this.centerX=centerX||0; this.centerY=centerY||0;
            this._map=cartesianMap;  return this;
        },
        
        twirl : function(angle, radius, centerX, centerY) {
            this.angle=angle||0; this.radius=radius||0;
            this.centerX=centerX||0; this.centerY=centerY||0;
            this._map=twirlMap;  return this;
        },
        
        sphere : function(radius, centerX, centerY) {
            this.radius=radius||0; this.centerX=centerX||0; this.centerY=centerY||0;
            this._map=sphereMap;  return this;
        },
        
        combineWith : function(filt) {
            // todo ??
            return this;
        },
        
        getMap : function() {
            return this._map;
        },
        
        setMap : function(map) {
            this._map=map; return this;
        },
        
        // used for internal purposes
        _apply : function(im, w, h, image) {
            if (!this._map) return im;
            return this._map.call(this, im, w, h, image);
        },
        
        apply : function(image) {
            if (!this._map) return image;
            return image.setData(this._map.call(this, image.getData(), image.width, image.height, image));
        },
        
        reset : function() {
            this._map=null; return this;
        }
    };
    
})(FILTER);