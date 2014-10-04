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
!function(FILTER, undef){
    
    @@USE_STRICT@@
    
    var IMG=FILTER.ImArray, IMGcopy=FILTER.ImArrayCopy, 
        PI=FILTER.CONSTANTS.PI,
        DoublePI=FILTER.CONSTANTS.PI2,
        HalfPI=FILTER.CONSTANTS.PI_2,
        ThreePI2 = 1.5 * PI,
        Sqrt=Math.sqrt, Atan2=Math.atan2, Atan = Math.atan,
        Sin=Math.sin, Cos=Math.cos, 
        Floor=Math.floor, //Round=Math.round, Ceil=Math.ceil,
        Asin=Math.asin, Tan=Math.tan, Abs=Math.abs, Max = Math.max,
        toRad=FILTER.CONSTANTS.toRad,
        Maps
    ;
    
    
    //
    //
    // GeometricMapFilter
    var GeometricMapFilter = FILTER.GeometricMapFilter = FILTER.Class( FILTER.Filter, {
        name: "GeometricMapFilter"
        
        ,constructor: function( inverseTransform ) {
            var self = this;
            self.$super('constructor');
            if ( inverseTransform ) self.generic( inverseTransform );
        }
        
        // parameters
        ,_map: null
        ,_mapName: null
        
        ,inverseTransform: null
        ,matrix: null
        ,centerX: 0
        ,centerY: 0
        ,angle: 0
        ,radius: 0
        ,wavelength: 0
        ,amplitude: 0
        ,phase: 0
        ,xAmplitude: 0
        ,yAmplitude: 0
        ,xWavelength: 0
        ,yWavelength: 0
        ,mode: FILTER.MODE.CLAMP
        
        ,dispose: function( ) {
            var self = this;
            
            self.$super('dispose');
            
            self._map = null;
            self._mapName = null;
            
            self.inverseTransform = null;
            self.matrix = null;
            self.centerX = null;
            self.centerY = null;
            self.angle = null;
            self.radius = null;
            self.wavelength = null;
            self.amplitude = null;
            self.phase = null;
            self.xAmplitude = null;
            self.yAmplitude = null;
            self.xWavelength = null;
            self.yWavelength = null;
            self.mode = null;
            
            return self;
        }
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    _mapName: self._mapName
                    ,inverseTransform: self.inverseTransform ? self.inverseTransform.toString( ) : null
                    ,matrix: self.matrix
                    ,centerX: self.centerX
                    ,centerY: self.centerY
                    ,angle: self.angle
                    ,radius: self.radius
                    ,wavelength: self.wavelength
                    ,amplitude: self.amplitude
                    ,phase: self.phase
                    ,xAmplitude: self.xAmplitude
                    ,yAmplitude: self.yAmplitude
                    ,xWavelength: self.xWavelength
                    ,yWavelength: self.yWavelength
                    ,mode: self.mode
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self.inverseTransform = null;
                
                self.matrix = params.matrix;
                self.centerX = params.centerX;
                self.centerY = params.centerY;
                self.angle = params.angle;
                self.radius = params.radius;
                self.wavelength = params.wavelength;
                self.amplitude = params.amplitude;
                self.phase = params.phase;
                self.xAmplitude = params.xAmplitude;
                self.yAmplitude = params.yAmplitude;
                self.xWavelength = params.xWavelength;
                self.yWavelength = params.yWavelength;
                self.mode = params.mode;
                
                if ( params.inverseTransform )
                {
                    // using bind makes the code become [native code] and thus unserializable
                    self.inverseTransform = eval( '(function(){ "use strict"; return ' + params.inverseTransform + '})();');
                }
                
                self._mapName = params._mapName;
                self._map = null;
                if ( self._mapName && Maps[ self._mapName ] )
                    self._map = Maps[ self._mapName ];
            }
            return self;
        }
        
        ,generic: function( inverseTransform ) {
            var self = this;
            if ( inverseTransform )
            {
                self.inverseTransform = inverseTransform;
                self._mapName = "generic"; 
                self._map = Maps.generic; 
            }
            return self;
        }
        
        ,affine: function( matrix ) {
            var self = this;
            if ( matrix )
            {
                self.matrix = matrix; 
                self._mapName = "affine";  
                self._map = Maps.affine; 
            }
            return self;
        }
        
        ,flipX: function( ) {
            var self = this;
            self._mapName = "flipX";  
            self._map = Maps.flipX; 
            return self;
        }
        
        ,flipY: function( ) {
            var self = this;
            self._mapName = "flipY";  
            self._map = Maps.flipY; 
            return self;
        }
        
        ,flipXY: function( ) {
            var self = this;
            self._mapName = "flipXY";  
            self._map = Maps.flipXY; 
            return self;
        }
        
        ,rotateCW: function( ) {
            var self = this;
            self._mapName = "rotateCW";  
            self._map = Maps.rotateCW; 
            return self;
        }
        
        ,rotateCCW: function( ) {
            var self = this;
            self._mapName = "rotateCCW";  
            self._map = Maps.rotateCCW; 
            return self;
        }
        
        ,polar: function( centerX, centerY ) {
            var self = this;
            self.centerX = centerX||0; self.centerY = centerY||0;
            self._mapName = "polar";  
            self._map = Maps.polar; 
            return self;
        }
        
        ,cartesian: function( centerX, centerY ) {
            var self = this;
            self.centerX = centerX||0; self.centerY = centerY||0;
            self._mapName = "cartesian";  
            self._map = Maps.cartesian; 
            return self;
        }
        
        ,twirl: function( angle, radius, centerX, centerY ) {
            var self = this;
            self.angle = angle||0; self.radius = radius||0;
            self.centerX = centerX||0; self.centerY = centerY||0;
            self._mapName = "twirl";  
            self._map = Maps.twirl; 
            return self;
        }
        
        ,sphere: function( radius, centerX, centerY ) {
            var self = this;
            self.radius = radius||0; self.centerX = centerX||0; self.centerY = centerY||0;
            self._mapName = "sphere";  
            self._map = Maps.sphere; 
            return self;
        }
        
        ,ripple: function( radius, wavelength, amplitude, phase, centerX, centerY ) {
            var self = this;
            self.radius = (radius!==undef) ? radius : 50; 
            self.centerX = centerX||0; 
            self.centerY = centerY||0;
            self.wavelength = (wavelength!==undef) ? wavelength : 16; 
            self.amplitude = (amplitude!==undef) ? amplitude : 10; 
            self.phase = phase||0;
            self._mapName = "ripple";  
            self._map = Maps.ripple; 
            return self;
        }
        
        ,reset: function( ) {
            var self = this;
            self._mapName = null; 
            self._map = null; 
            return self;
        }
        
        ,getMap: function( ) {
            return this._map;
        }
        
        ,setMap: function( map ) {
            var self = this;
            self._mapName = null; 
            self._map = map; 
            return self;
        }
        
        // used for internal purposes
        ,_apply: function( im, w, h, image ) {
            var self = this;
            if ( !self._isOn || !self._map ) return im;
            return self._map( self, im, w, h, image );
        }
            
        ,canRun: function( ) {
            return this._isOn && this._map;
        }
    });
    
    
    //
    //
    // private geometric maps
    
    /*function trivialMap(im, w, h) { return im; },*/
    Maps = {
        "generic": function( self, im, w, h )  {
            var x, y, i, j, imLen=im.length, dst=new IMG(imLen),
                invTransform=self.inverseTransform, mode=self.mode,
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
    
        ,"affine": function( self, im, w, h ) {
            var x, y, yw, i, j, imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
                mat=self.matrix, a=mat[0], b=mat[1], c=mat[3], d=mat[4], tx=mat[2], ty=mat[5], 
                tyw, cw, dw, mode=self.mode,
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
    
        ,"flipX": function( self, im, w, h ) {
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
        
        ,"flipY": function flipYMap( self, im, w, h ) {
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
        
        ,"flipXY": function( self, im, w, h )  {
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
        
        ,"rotateCW": function( self, im, w, h )  {
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
        
        ,"rotateCCW": function( self, im, w, h ) {
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
        ,"twirl": function( self, im, w, h )  {
            if ( 0 >= self.radius ) return im;
            
            var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im), // in Opera this is by-reference, hence the previous discrepancies
                cX=self.centerX, cY=self.centerY, angle=self.angle, radius=self.radius, mode=self.mode, 
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
        ,"sphere": function( self, im, w, h )  {
            if (0>=self.radius) return im;
            
            var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
                cX=self.centerX, cY=self.centerY, radius=self.radius, mode=self.mode, 
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
        ,"ripple": function( self, im, w, h ) {
            if (0>=self.radius) return im;
            
            var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
                _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
                d, tx, ty, amount, 
                r2, d2, ds, tx2, ty2,
                bx=w-1, by=h-1,
                cX=self.centerX, cY=self.centerY, radius=self.radius, mode=self.mode, 
                radius2=radius*radius,
                wavelength = self.wavelength,
                amplitude = self.amplitude,
                phase = self.phase
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
        
        // adapted from http://www.jhlabs.com/ip/filters/
        /*
        ,"circle": function( self, im, w, h ) {
            var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
                _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
                tx, ty, ix, iy, ip, d2,
                bx = w-1, by = h-1, 
                cX, cY, cX2, cY2,
                mode = this.mode
            ;
            
            cX = ~~(0.5*w + 0.5);
            cY = ~~(0.5*h + 0.5);
            cX2 = cX*cX;
            cY2 = cY*cY;
            
            x=0; y=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                if (x>=w) { x=0; y++; }
                
                tx = x-cX;
                ty = y-cY;
                d2 = tx*tx + ty*ty;
                ix = cX + cX2 * tx/d2;
                iy = cY + cY2 * ty/d2;
                // inverse transform
                if (0>ix || ix>bx || 0>iy || iy>by)
                {
                    switch(mode)
                    {
                        case _Wrap:
                            if (iy>by) iy-=h;
                            else if (iy<0) iy+=h;
                            if (ix>bx) ix-=w;
                            else if (ix<0)  ix+=w;
                            break;
                            
                        case _Clamp:
                        default:
                            if (iy>by)  iy=by;
                            else if (iy<0) iy=0;
                            if (ix>bx) ix=bx;
                            else if (ix<0) ix=0;
                            break;
                    }
                }
                ip = ( ~~(ix+0.5) + ~~(iy+0.5) )<<2;
                im[i] = imcopy[ ip ];
                im[i+1] = imcopy[ ip+1 ];
                im[i+2] = imcopy[ ip+2 ];
                im[i+3] = imcopy[ ip+3 ];
            }
            return im;
        }
        */
        ,"polar": function( self, im, w, h ) {
            var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
                _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
                tx, ty, ix, iy, ip,
                bx = w-1, by = h-1, 
                theta, r=0, radius, cX, cY, 
                mode = self.mode
            ;
            
            cX = ~~(0.5*w + 0.5);
            cY = ~~(0.5*h + 0.5);
            radius = Max(cY, cX);
                
            x=0; y=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                if (x>=w) { x=0; y++; }
                
                tx = x-cX;
                ty = y-cY;
                theta = 0;
                
                if (tx >= 0) 
                {
                    if (ty > 0) 
                    {
                        theta = PI - Atan(tx/ty);
                        r = Sqrt(tx*tx + ty*ty);
                    } 
                    else if (ty < 0) 
                    {
                        theta = Atan(tx/ty);
                        r = Sqrt(tx*tx + ty*ty);
                    } 
                    else 
                    {
                        theta = HalfPI;
                        r = tx;
                    }
                } 
                else if (tx < 0) 
                {
                    if (ty < 0) 
                    {
                        theta = DoublePI - Atan(tx/ty);
                        r = Sqrt(tx*tx + ty*ty);
                    } 
                    else if (ty > 0) 
                    {
                        theta = PI + Atan(tx/ty);
                        r = Sqrt(tx*tx + ty*ty);
                    } 
                    else 
                    {
                        theta = ThreePI2;
                        r = -tx;
                    }
                }
                // inverse transform
                ix = (w-1) - (w-1)/DoublePI * theta;
                iy = (h * r / radius);
                
                if (0>ix || ix>bx || 0>iy || iy>by)
                {
                    switch(mode)
                    {
                        case _Wrap:
                            if (iy>by) iy-=h;
                            else if (iy<0) iy+=h;
                            if (ix>bx) ix-=w;
                            else if (ix<0)  ix+=w;
                            break;
                            
                        case _Clamp:
                        default:
                            if (iy>by)  iy=by;
                            else if (iy<0) iy=0;
                            if (ix>bx) ix=bx;
                            else if (ix<0) ix=0;
                            break;
                    }
                }
                ip = ( ~~(ix+0.5) + ~~(iy+0.5)*w )<<2;
                im[i] = imcopy[ ip ];
                im[i+1] = imcopy[ ip+1 ];
                im[i+2] = imcopy[ ip+2 ];
                im[i+3] = imcopy[ ip+3 ];
            }
            return im;
        }
        
        // adapted from http://www.jhlabs.com/ip/filters/
        ,"cartesian": function( self, im, w, h ) {
            var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
                _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
                ix, iy, ip, nx, ny,
                bx = w-1, by = h-1, 
                theta, theta2, r=0, radius, cX, cY, 
                mode = self.mode
            ;
            
            cX = ~~(0.5*w + 0.5);
            cY = ~~(0.5*h + 0.5);
            radius = Max(cY, cX);
                
            x=0; y=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                if (x>=w) { x=0; y++; }
                
                theta = x / w * DoublePI;

                if (theta >= ThreePI2)
                    theta2 = DoublePI - theta;
                else if (theta >= PI)
                    theta2 = theta - PI;
                else if (theta >= HalfPI)
                    theta2 = PI - theta;
                else
                    theta2 = theta;
                r = radius * (y / h);

                nx = -r * Sin(theta2);
                ny = r * Cos(theta2);
                
                if (theta >= ThreePI2) 
                {
                    ix = cX - nx;
                    iy = cY - ny;
                } 
                else if (theta >= PI) 
                {
                    ix = cX - nx;
                    iy = cY + ny;
                } 
                else if (theta >= HalfPI) 
                {
                    ix = cX + nx;
                    iy = cY + ny;
                } 
                else 
                {
                    ix = cX + nx;
                    iy = cY - ny;
                }
                // inverse transform
                if (0>ix || ix>bx || 0>iy || iy>by)
                {
                    switch(mode)
                    {
                        case _Wrap:
                            if (iy>by) iy-=h;
                            else if (iy<0) iy+=h;
                            if (ix>bx) ix-=w;
                            else if (ix<0)  ix+=w;
                            break;
                            
                        case _Clamp:
                        default:
                            if (iy>by)  iy=by;
                            else if (iy<0) iy=0;
                            if (ix>bx) ix=bx;
                            else if (ix<0) ix=0;
                            break;
                    }
                }
                ip = ( ~~(ix+0.5) + ~~(iy+0.5)*w )<<2;
                im[i] = imcopy[ ip ];
                im[i+1] = imcopy[ ip+1 ];
                im[i+2] = imcopy[ ip+2 ];
                im[i+3] = imcopy[ ip+3 ];
            }
            return im;
        }
    };
    
}(FILTER);