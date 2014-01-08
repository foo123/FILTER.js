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
(function(Class, FILTER, undef){
    
    var IMG=FILTER.ImArray, IMGcopy=FILTER.ImArrayCopy, 
        PI=FILTER.CONSTANTS.PI,
        Sqrt=Math.sqrt, Atan2=Math.atan2,
        Sin=Math.sin, Cos=Math.cos, 
        Floor=Math.floor, //Round=Math.round, Ceil=Math.ceil,
        Asin=Math.asin, Tan=Math.tan, Abs=Math.abs,
        toRad=FILTER.CONSTANTS.toRad
    ;
    
    
    //
    //
    // GeometricMapFilter
    var GeometricMapFilter = FILTER.GeometricMapFilter = Class( FILTER.Filter, {
        name : "GeometricMapFilter",
        
        constructor : function(inverseTransform) {
            this.generic(inverseTransform);
        },
        
        // parameters
        _map : null,
        
        inverseTransform : null,
        matrix : null,
        centerX : 0,
        centerY : 0,
        angle : 0,
        radius : 0,
        wavelength : 0,
        amplitude : 0,
        phase : 0,
        xAmplitude : 0,
        yAmplitude : 0,
        xWavelength : 0,
        yWavelength : 0,
        mode : FILTER.MODE.CLAMP,
        
        generic : function(inverseTransform) {
            if (inverseTransform)
            {
                this.inverseTransform = inverseTransform;
                this._map = genericMap; 
            }
            return this;
        },
        
        affine : function(matrix) {
            if (matrix)
            {
                this.matrix = matrix; 
                this._map = affineMap;  
            }
            return this;
        },
        
        flipX : function() {
            this._map = flipXMap;  
            return this;
        },
        
        flipY : function() {
            this._map = flipYMap;  
            return this;
        },
        
        flipXY : function() {
            this._map = flipXYMap;  
            return this;
        },
        
        rotateCW : function() {
            this._map = rotateCWMap;  
            return this;
        },
        
        rotateCCW : function() {
            this._map = rotateCCWMap;  
            return this;
        },
        
        polar : function(centerX, centerY) {
            this.centerX = centerX||0; this.centerY = centerY||0;
            this._map = polarMap;  
            return this;
        },
        
        cartesian : function(centerX, centerY) {
            this.centerX = centerX||0; this.centerY = centerY||0;
            this._map = cartesianMap;  
            return this;
        },
        
        twirl : function(angle, radius, centerX, centerY) {
            this.angle = angle||0; this.radius = radius||0;
            this.centerX = centerX||0; this.centerY = centerY||0;
            this._map = twirlMap;  
            return this;
        },
        
        sphere : function(radius, centerX, centerY) {
            this.radius = radius||0; this.centerX = centerX||0; this.centerY = centerY||0;
            this._map = sphereMap;  
            return this;
        },
        
        ripple : function(radius, wavelength, amplitude, phase, centerX, centerY) {
            this.radius = (radius!==undef) ? radius : 50; 
            this.centerX = centerX||0; 
            this.centerY = centerY||0;
            this.wavelength = (wavelength!==undef) ? wavelength : 16; 
            this.amplitude = (amplitude!==undef) ? amplitude : 10; 
            this.phase = phase||0;
            this._map = rippleMap;  
            return this;
        },
        
        combineWith : function(filt) {
            // todo ??
            return this;
        },
        
        reset : function() {
            this._map = null; 
            return this;
        },
        
        getMap : function() {
            return this._map;
        },
        
        setMap : function(map) {
            this._map = map; 
            return this;
        },
        
        // used for internal purposes
        _apply : function(im, w, h, image) {
            if ( !this._isOn || !this._map ) return im;
            return this._map.call(this, im, w, h, image);
        },
        
        apply : function(image) {
            if ( this._isOn && this._map )
            {
                var im = image.getSelectedData();
                return image.setSelectedData(this._map.call(this, im[0], im[1], im[2], image));
            }
            return image;
        }
    });
    
    
    //
    //
    // private geometric maps
    
    /*function trivialMap(im, w, h) { return im; },*/
    
    function genericMap(im, w, h) 
    {
        var x, y, i, j, imLen=im.length, dst=new IMG(imLen),
            invTransform=this.inverseTransform, mode=this.mode,
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            t, tx, ty
        ;
        
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
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
            j = (tx + ty*w)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    function affineMap(im, w, h) 
    {
        var x, y, yw, i, j, imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            mat=this.matrix, a=mat[0], b=mat[1], c=mat[3], d=mat[4], tx=mat[2], ty=mat[5], 
            tyw, cw, dw, mode=this.mode,
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            nx, ny, bx=w-1, by=imArea-w
        ;
        
        x=0; y=0; tyw=ty*w; cw=c*w; dw=d*w;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
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
            j = (nx + ny)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    function flipXMap(im, w, h) 
    {
        var x, y, yw, i, j, l=im.length, dst=new IMG(l);
        
        x=0; y=0; yw=0;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; yw+=w; }
            
            j = (w-1-x+yw)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    function flipYMap(im, w, h) 
    {
        var x, y, yw2, i, j, l=im.length, dst=new IMG(l);
        
        x=0; y=0; yw2=(h-1)*w;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; yw2-=w; }
            
            j = (x+yw2)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    function flipXYMap(im, w, h)  
    {
        var x, y, yw, yw2, i, j, l=im.length, dst=new IMG(l);
        
        x=0; y=0; yw2=(h-1)*w;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; yw+=w; yw2-=w; }
            
            j = (w-1-x+yw2)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    function rotateCWMap(im, w, h) 
    {
        var x, y, yw, xw, i, j, l=im.length, dst=new IMG(l),
            hw=(l>>2);
        
        x=0; y=0; xw=hw-1;
        for (i=0; i<l; i+=4, x++, xw-=w)
        {
            if (x>=w) { x=0; xw=hw-1; y++; }
            
            j = (y + xw)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    function rotateCCWMap(im, w, h) 
    {
        var x, y, yw, xw, i, j, l=im.length, dst=new IMG(l),
            hw=(l>>2);
        
        x=0; y=0; xw=0;
        for (i=0; i<l; i+=4, x++, xw+=w)
        {
            if (x>=w) { x=0; xw=0; y++; }
            
            j = (w-1-y + xw)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    // adapted from http://je2050.de/imageprocessing/ TwirlMap
    function twirlMap(im, w, h)  
    {
        if ( 0 >= this.radius ) return im;
        
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im), // in Opera this is by-reference, hence the previous discrepancies
            cX=this.centerX, cY=this.centerY, angle=this.angle, radius=this.radius, mode=this.mode, 
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            d, tx, ty, theta, fact=angle/radius,
            bx=w-1, by=h-1
        ;
        
        // make center relative
        cX = Floor(cX*(w-1));
        cY = Floor(cY*(h-1));
            
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
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
                j = (tx + ty*w)<<2;
                // swaping the arrays of input/output (together with Uint8Array for Opera)
                // solves the problem in all browsers (FF24, Chrome, Opera 12, IE10+)
                im[i] = imcopy[j];   im[i+1] = imcopy[j+1];
                im[i+2] = imcopy[j+2];  im[i+3] = imcopy[j+3];
            }
        }
        return im;
    }
    
    // adapted from http://je2050.de/imageprocessing/ SphereMap
    function sphereMap(im, w, h) 
    {
        if (0>=this.radius) return im;
        
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
            cX=this.centerX, cY=this.centerY, radius=this.radius, mode=this.mode, 
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            d, tx, ty, theta, radius2=radius*radius,
            refraction = 0.555556, invrefraction=1-refraction,
            r2, thetax, thetay, d2, ds, tx2, ty2,
            bx=w-1, by=h-1
        ;
        
        // make center relative
        cX = Floor(cX*(w-1));
        cY = Floor(cY*(h-1));
            
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
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
                j = (tx + ty*w)<<2;
                im[i] = imcopy[j];   im[i+1] = imcopy[j+1];
                im[i+2] = imcopy[j+2];  im[i+3] = imcopy[j+3];
            }
        }
        return im;
    }
    
    // adapted from https://github.com/JoelBesada/JSManipulate
    function rippleMap(im, w, h) 
    {
        if (0>=this.radius) return im;
        
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            d, tx, ty, amount, 
            r2, d2, ds, tx2, ty2,
            bx=w-1, by=h-1,
            cX=this.centerX, cY=this.centerY, radius=this.radius, mode=this.mode, 
            radius2=radius*radius,
            wavelength = this.wavelength,
            amplitude = this.amplitude,
            phase = this.phase
        ;
        
        // make center relative
        cX = Floor(cX*(w-1));
        cY = Floor(cY*(h-1));
            
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            tx = x - cX;  ty = y - cY;
            tx2 = tx*tx; ty2 = ty*ty;
            d2 = tx2 + ty2;
            if (d2 < radius2)
            {
                d = Sqrt(d2);
                amount = amplitude * Sin(d/wavelength * Math.PI * 2 - phase);
                amount *= (radius-d)/radius;
                if (d)  amount *= wavelength/d;
                tx = ~~(x + tx*amount);  ty = ~~(y + ty*amount);
                
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
                j = (tx + ty*w)<<2;
                im[i] = imcopy[j];   im[i+1] = imcopy[j+1];
                im[i+2] = imcopy[j+2];  im[i+3] = imcopy[j+3];
            }
        }
        return im;
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
    
})(Class, FILTER);