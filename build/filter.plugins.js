/**
*
*   FILTER.js Plugins
*   @version: 0.6.14
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Plugins)
*   https://github.com/foo123/FILTER.js
*
**/!function ( root, name, deps, factory, undef ) {

    "use strict";
    var isNode = ("undefined" !== typeof global && "[object global]" === {}.toString.call(global)),
        isBrowser = (!isNode && "undefined" !== typeof navigator ), 
        isWorker = ("function" === typeof importScripts && navigator instanceof WorkerNavigator),
        A = Array, AP = A.prototype
    ;
    // Get current filename/path
    var getCurrentPath = function() {
            var file = null;
            if ( isNode ) 
            {
                // http://nodejs.org/docs/latest/api/globals.html#globals_filename
                // this should hold the current file in node
                file = __filename;
                return { path: __dirname, file: __filename };
            }
            else if ( isWorker )
            {
                // https://developer.mozilla.org/en-US/docs/Web/API/WorkerLocation
                // this should hold the current url in a web worker
                file = self.location.href;
            }
            else if ( isBrowser )
            {
                // get last script (should be the current one) in browser
                var scripts;
                if ((scripts = document.getElementsByTagName('script')) && scripts.length) 
                    file  = scripts[scripts.length - 1].src;
            }
            
            if ( file )
                return { path: file.split('/').slice(0, -1).join('/'), file: file };
            return { path: null, file: null };
        },
        thisPath = getCurrentPath(),
        makePath = function(base, dep) {
            if ( isNode )
            {
                //return require('path').join(base, dep);
                return dep;
            }
            if ( "." == dep.charAt(0) ) 
            {
                base = base.split('/');
                dep = dep.split('/'); 
                var index = 0, index2 = 0, i, l = dep.length, l2 = base.length;
                
                for (i=0; i<l; i++)
                {
                    if ( /^\.\./.test( dep[i] ) )
                    {
                        index++;
                        index2++;
                    }
                    else if ( /^\./.test( dep[i] ) )
                    {
                        index2++;
                    }
                    else
                    {
                        break;
                    }
                }
                index = ( index >= l2 ) ? 0 : l2-index;
                dep = base.slice(0, index).concat( dep.slice( index2 ) ).join('/');
            }
            return dep;
        }
    ;
    
    //
    // export the module in a umd-style generic way
    deps = ( deps ) ? [].concat(deps) : [];
    var i, dl = deps.length, ids = new A( dl ), paths = new A( dl ), fpaths = new A( dl ), mods = new A( dl ), _module_, head;
        
    for (i=0; i<dl; i++) { ids[i] = deps[i][0]; paths[i] = deps[i][1]; fpaths[i] = /\.js$/i.test(paths[i]) ? makePath(thisPath.path, paths[i]) : makePath(thisPath.path, paths[i]+'.js'); }
    
    // node, commonjs, etc..
    if ( "object" === typeof( module ) && module.exports ) 
    {
        if ( undef === module.exports[name] )
        {
            for (i=0; i<dl; i++)  mods[i] = module.exports[ ids[i] ] || require( fpaths[i] )[ ids[i] ];
            _module_ = factory.apply(root, mods );
            // allow factory just to add to existing modules without returning a new module
            module.exports[ name ] = _module_ || 1;
        }
    }
    
    // amd, etc..
    else if ( "function" === typeof( define ) && define.amd ) 
    {
        define( ['exports'].concat( paths ), function( exports ) {
            if ( undef === exports[name] )
            {
                var args = AP.slice.call( arguments, 1 ), dl = args.length;
                for (var i=0; i<dl; i++)   mods[i] = exports[ ids[i] ] || args[ i ];
                _module_ = factory.apply(root, mods );
                // allow factory just to add to existing modules without returning a new module
                exports[ name ] = _module_ || 1;
            }
        });
    }
    
    // web worker
    else if ( isWorker ) 
    {
        for (i=0; i<dl; i++)  
        {
            if ( !self[ ids[i] ] ) importScripts( fpaths[i] );
            mods[i] = self[ ids[i] ];
        }
        _module_ = factory.apply(root, mods );
        // allow factory just to add to existing modules without returning a new module
        self[ name ] = _module_ || 1;
    }
    
    // browsers, other loaders, etc..
    else
    {
        if ( undef === root[name] )
        {
            /*
            for (i=0; i<dl; i++)  mods[i] = root[ ids[i] ];
            _module_ = factory.apply(root, mods );
            // allow factory just to add to existing modules without returning a new module
            root[name] = _module_ || 1;
            */
            
            // load javascript async using <script> tags in browser
            var loadJs = function(url, callback) {
                head = head || document.getElementsByTagName("head")[0];
                var done = 0, script = document.createElement('script');
                
                script.type = 'text/javascript';
                script.language = 'javascript';
                script.onload = script.onreadystatechange = function( ) {
                    if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete'))
                    {
                        done = 1;
                        script.onload = script.onreadystatechange = null;
                        head.removeChild( script );
                        script = null;
                        if ( callback )  callback();
                    }
                }
                // load it
                script.src = url;
                head.appendChild( script );
            };

            var loadNext = function(id, url, callback) { 
                    if ( !root[ id ] ) 
                        loadJs( url, callback ); 
                    else
                        callback();
                },
                continueLoad = function( i ) {
                    return function() {
                        if ( i < dl )  mods[ i ] = root[ ids[ i ] ];
                        if ( ++i < dl )
                        {
                            loadNext( ids[ i ], fpaths[ i ], continueLoad( i ) );
                        }
                        else
                        {
                            _module_ = factory.apply(root, mods );
                            // allow factory just to add to existing modules without returning a new module
                            root[ name ] = _module_ || 1;
                        }
                    };
                }
            ;
            if ( dl ) 
            {
                loadNext( ids[ 0 ], fpaths[ 0 ], continueLoad( 0 ) );
            }
            else
            {
                _module_ = factory.apply(root, mods );
                // allow factory just to add to existing modules without returning a new module
                root[ name ] = _module_ || 1;
            }
        }
    }


}(  /* current root */          this.self || this, 
    /* module name */           "FILTER_PLUGINS",
    /* module dependencies */   [ ['FILTER', './filter'] ], 
    /* module factory */        function( FILTER ) {
        
        /* main code starts here */

/**
*
*   FILTER.js Plugins
*   @version: 0.6.14
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Plugins)
*   https://github.com/foo123/FILTER.js
*
**/
// not export just add plugins to FILTER
var FILTER_PLUGINS = null;
/**
*
* Noise Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    "use strict";
    
    var notSupportClamp=FILTER._notSupportClamp, rand=Math.random;
    
    // a sample noise filter
    // used for illustration purposes on how to create a plugin filter
    FILTER.NoiseFilter = FILTER.Create({
        name: "NoiseFilter"
        
        // parameters
        ,min: -127
        ,max: 127
        
        // this is the filter constructor
        ,init: function( min, max ) {
            var self = this;
            self.min = min||-127;
            self.max = max||127;
        }
        
        // support worker serialize/unserialize interface
        ,path: FILTER.getPath( )
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    min: self.min
                    ,max: self.max
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self.min = params.min;
                self.max = params.max;
            }
            return self;
        }
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            var self = this;
            if ( !self._isOn ) return im;
            var range=self.max-self.min, m=self.min,
                i, l=im.length, n, r, g, b, t0, t1, t2;
            
            // add noise
            if (notSupportClamp)
            {   
                for (i=0; i<l; i+=4)
                { 
                    r = im[i]; g = im[i+1]; b = im[i+2];
                    n = range*rand()+m;
                    t0 = r+n; t1 = g+n; t2 = b+n; 
                    // clamp them manually
                    if (t0<0) t0=0;
                    else if (t0>255) t0=255;
                    if (t1<0) t1=0;
                    else if (t1>255) t1=255;
                    if (t2<0) t2=0;
                    else if (t2>255) t2=255;
                    im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                { 
                    r = im[i]; g = im[i+1]; b = im[i+2];
                    n = range*rand()+m;
                    t0 = r+n; t1 = g+n; t2 = b+n; 
                    im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
                }
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);/**
*
* Histogram Equalize Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    "use strict";
    
    var notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F,
        RGB2YCbCr=FILTER.Color.RGB2YCbCr, YCbCr2RGB=FILTER.Color.YCbCr2RGB
        ;
    
    // a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
    FILTER.HistogramEqualizeFilter = FILTER.Create({
        name : "HistogramEqualizeFilter"
        
        ,path: FILTER.getPath( )
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            var self = this;
            if ( !self._isOn ) return im;
            var r,g,b, rangeI,  maxI = 0, minI = 255,
                cdfI, accum = 0, t0, t1, t2,
                i, y, l=im.length, l2=l>>2, n=1.0/(l2), ycbcr, rgba
            ;
            
            // initialize the arrays
            cdfI = new A32F(256);
            for (i=0; i<256; i+=4)
            { 
                // partial loop unrolling
                cdfI[i]=0; 
                cdfI[i+1]=0; 
                cdfI[i+2]=0; 
                cdfI[i+3]=0; 
            }
            
            // compute pdf and maxima/minima
            for (i=0; i<l; i+=4)
            {
                r = im[i]; g = im[i+1]; b = im[i+2];
                ycbcr = RGB2YCbCr({r:r, g:g, b:b});
                r = im[i] = ~~ycbcr.cr; g = im[i+1] = ~~ycbcr.y; b = im[i+2] = ~~ycbcr.cb;
                cdfI[ g ] += n;
                
                if ( g>maxI ) maxI=g;
                else if ( g<minI ) minI=g;
            }
            
            // compute cdf
            accum = 0;
            for (i=0; i<256; i+=4)
            { 
                // partial loop unrolling
                accum += cdfI[i]; cdfI[i] = accum;
                accum += cdfI[i+1]; cdfI[i+1] = accum;
                accum += cdfI[i+2]; cdfI[i+2] = accum;
                accum += cdfI[i+3]; cdfI[i+3] = accum;
            }
            
            // equalize only the intesity channel
            rangeI = maxI-minI;
            if (notSupportClamp)
            {   
                for (i=0; i<l; i+=4)
                { 
                    ycbcr = {cr : im[i], y : im[i+1], cb : im[i+2]};
                    ycbcr.y = cdfI[ycbcr.y]*rangeI + minI;
                    rgba = YCbCr2RGB(ycbcr);
                    t0 = rgba.r; t1 = rgba.g; t2 = rgba.b; 
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                    im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                { 
                    ycbcr = {cr : im[i], y : im[i+1], cb : im[i+2]};
                    ycbcr.y = cdfI[ycbcr.y]*rangeI + minI;
                    rgba = YCbCr2RGB(ycbcr);
                    im[i] = ~~rgba.r; im[i+1] = ~~rgba.g; im[i+2] = ~~rgba.b; 
                }
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);/**
*
* Histogram Equalize for grayscale images Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    "use strict";
    
    var notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F;
    
    // a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
    FILTER.GrayscaleHistogramEqualizeFilter = FILTER.Create({
        name: "GrayscaleHistogramEqualizeFilter"
        
        ,path: FILTER.getPath( )
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            var self = this;
            if ( !self._isOn ) return im;
            var c, g, rangeI, maxI=0, minI=255,
                cdfI, accum=0, t0, t1, t2,
                i, l=im.length, l2=l>>2, n=1.0/(l2)
                ;
            
            // initialize the arrays
            cdfI = new A32F(256);
            for (i=0; i<256; i+=4)
            { 
                // partial loop unrolling
                cdfI[i]=0; 
                cdfI[i+1]=0; 
                cdfI[i+2]=0; 
                cdfI[i+3]=0; 
            }
            
            // compute pdf and maxima/minima
            for (i=0; i<l; i+=4)
            {
                c = im[i];  // image is already grayscale
                cdfI[c] += n;
                
                if (c>maxI) maxI=c;
                else if (c<minI) minI=c;
            }
            
            // compute cdf
            accum = 0;
            for (i=0; i<256; i+=4)
            { 
                // partial loop unrolling
                accum += cdfI[i]; cdfI[i] = accum;
                accum += cdfI[i+1]; cdfI[i+1] = accum;
                accum += cdfI[i+2]; cdfI[i+2] = accum;
                accum += cdfI[i+3]; cdfI[i+3] = accum;
            }
            
            // equalize the grayscale/intesity channels
            rangeI = maxI-minI;
            if (notSupportClamp)
            {   
                for (i=0; i<l; i+=4)
                { 
                    c = im[i]; // grayscale image has same value in all channels
                    g = cdfI[c]*rangeI + minI;
                    // clamp them manually
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    g = ~~g;
                    im[i] = g; im[i+1] = g; im[i+2] = g; 
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                { 
                    c = im[i]; // grayscale image has same value in all channels
                    g = ~~( cdfI[c]*rangeI + minI );
                    im[i] = g; im[i+1] = g; im[i+2] = g; 
                }
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);/**
*
* RGB Histogram Equalize Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    "use strict";
    
    var notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F;
    
    // a sample histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
    // not the best implementation
    // used for illustration purposes on how to create a plugin filter
    FILTER.RGBHistogramEqualizeFilter = FILTER.Create({
        name: "RGBHistogramEqualizeFilter"
        
        ,path: FILTER.getPath( )
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            var self = this;
            if ( !self._isOn ) return im;
            var r,g,b, rangeR, rangeG, rangeB,
                maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
                cdfR, cdfG, cdfB,
                accumR, accumG, accumB, t0, t1, t2,
                i, l=im.length, l2=l>>2, n=1.0/(l2)
            ;
            
            // initialize the arrays
            cdfR=new A32F(256); cdfG=new A32F(256); cdfB=new A32F(256);
            for (i=0; i<256; i+=4)
            { 
                // partial loop unrolling
                cdfR[i]=0; cdfG[i]=0; cdfB[i]=0; 
                cdfR[i+1]=0; cdfG[i+1]=0; cdfB[i+1]=0; 
                cdfR[i+2]=0; cdfG[i+2]=0; cdfB[i+2]=0; 
                cdfR[i+3]=0; cdfG[i+3]=0; cdfB[i+3]=0; 
            }
            
            // compute pdf and maxima/minima
            for (i=0; i<l; i+=4)
            {
                r = im[i]; g = im[i+1]; b = im[i+2];
                cdfR[r] += n; cdfG[g] += n; cdfB[b] += n;
                
                if (r>maxR) maxR=r;
                else if (r<minR) minR=r;
                if (g>maxG) maxG=g;
                else if (g<minG) minG=g;
                if (b>maxB) maxB=b;
                else if (b<minB) minB=b;
            }
            
            // compute cdf
            accumR=accumG=accumB=0;
            for (i=0; i<256; i+=4)
            { 
                // partial loop unrolling
                accumR+=cdfR[i]; cdfR[i]=accumR; 
                accumG+=cdfG[i]; cdfG[i]=accumG; 
                accumB+=cdfB[i]; cdfB[i]=accumB; 
                accumR+=cdfR[i+1]; cdfR[i+1]=accumR; 
                accumG+=cdfG[i+1]; cdfG[i+1]=accumG; 
                accumB+=cdfB[i+1]; cdfB[i+1]=accumB; 
                accumR+=cdfR[i+2]; cdfR[i+2]=accumR; 
                accumG+=cdfG[i+2]; cdfG[i+2]=accumG; 
                accumB+=cdfB[i+2]; cdfB[i+2]=accumB; 
                accumR+=cdfR[i+3]; cdfR[i+3]=accumR; 
                accumG+=cdfG[i+3]; cdfG[i+3]=accumG; 
                accumB+=cdfB[i+3]; cdfB[i+3]=accumB; 
            }
            
            // equalize each channel separately
            rangeR=maxR-minR; rangeG=maxG-minG; rangeB=maxB-minB;
            if (notSupportClamp)
            {   
                for (i=0; i<l; i+=4)
                { 
                    r = im[i]; g = im[i+1]; b = im[i+2]; 
                    t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                    im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                { 
                    r = im[i]; g = im[i+1]; b = im[i+2]; 
                    t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                    im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
                }
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);/**
*
* Pixelate Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    "use strict";
    
    var Sqrt=Math.sqrt,
        notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F;
    
    
    // a sample fast pixelate filter
    FILTER.PixelateFilter = FILTER.Create({
        name: "PixelateFilter"
        
        // parameters
        ,scale: 1
        
        // this is the filter constructor
        ,init: function( scale ) {
            var self = this;
            self.scale = scale || 1;
        }
        
        // support worker serialize/unserialize interface
        ,path: FILTER.getPath( )
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    scale: self.scale
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self.scale = params.scale;
            }
            return self;
        }
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            var self = this;
            if (!self._isOn || self.scale<=1) return im;
            if (self.scale>100) self.scale=100;
            
            var imLen = im.length, imArea = (imLen>>2),
                step, stepw, hstep, wstep, hstepw, wRem, hRem,
                inv_size, inv_size1, inv_size1w, inv_size1h, inv_size1hw, 
                inv_sizes, inv_sizew, inv_sizeh, inv_sizewh,
                integral, colR, colG, colB,
                rowLen = (w<<1) + w, imageIndicesX, imageIndicesY,
                i, j, x, y, yw, px, py, pyw, pi,
                xOff1, yOff1, xOff2, yOff2, 
                bx1, by1, bx2, by2, 
                p1, p2, p3, p4, r, g, b
            ;
            
            step = ~~(Sqrt(imArea)*self.scale*0.01);
            stepw = w*step; hstep = (h%step); wstep = (w%step); hstepw = (hstep-1)*w;
            inv_size1 = 1.0/(step*step); inv_size1w = 1.0/(wstep*step); inv_size1h = 1.0/(hstep*step); inv_size1hw = 1.0/(wstep*hstep);
            inv_sizes = inv_size1; inv_sizew = inv_size1w; inv_sizeh = inv_size1h; inv_sizewh = inv_size1hw;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            imageIndicesX = step-1; imageIndicesY = (step-1)*w;
            bx1=0; bx2=w-1; by1=0; by2=imArea-w;
            
            // compute integral image in one pass
            integral = new A32F(imArea*3);
            // first row
            i=0; j=0; x=0; colR=colG=colB=0;
            for (x=0; x<w; x++, i+=4, j+=3)
            {
                colR += im[i]; colG += im[i+1]; colB += im[i+2];
                integral[j] = colR; integral[j+1] = colG; integral[j+2] = colB;
            }
            // other rows
            j=0; x=0; colR=colG=colB=0;
            for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=0; }
                colR += im[i]; colG += im[i+1]; colB += im[i+2];
                integral[j+rowLen] = integral[j] + colR; 
                integral[j+rowLen+1] = integral[j+1] + colG;  
                integral[j+rowLen+2] = integral[j+2] + colB;
            }
            
            // first block
            x=0; y=0; yw=0;
            // calculate the weighed sum of the source image pixels that
            // fall under the pixelate convolution matrix
            xOff1 = x; yOff1 = yw;  
            xOff2 = xOff1 + imageIndicesX; yOff2 = yOff1 + imageIndicesY;
            
            // fix borders
            xOff2 = (xOff2>bx2) ? bx2 : xOff2;
            yOff2 = (yOff2>by2) ? by2 : yOff2;
            
            // compute integral positions
            p1=(xOff1 + yOff1); p4=(xOff2+yOff2); p2=(xOff2 + yOff1); p3=(xOff1 + yOff2);
            p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
            
            // compute matrix sum of these elements
            // maybe using a gaussian average could be better (but more computational) ??
            inv_size = inv_sizes;
            r = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
            g = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
            b = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
            
            if (notSupportClamp)
            {   
                // clamp them manually
                r = (r<0) ? 0 : ((r>255) ? 255 : r);
                g = (g<0) ? 0 : ((g>255) ? 255 : g);
                b = (b<0) ? 0 : ((b>255) ? 255 : b);
            }
            r = ~~r;  g = ~~g;  b = ~~b; // alpha channel is not transformed
            
            // do direct pixelate convolution
            px=0; py=0; pyw=0;
            for (i=0; i<imLen; i+=4)
            {
                // output
                // replace the area equal to the given pixelate size
                // with the average color, computed in previous step
                pi = (px+x + pyw+yw)<<2;
                im[pi] = r;  im[pi+1] = g;  im[pi+2] = b; 
                
                // next pixel
                px++; if ( px+x >= w || px >= step ) { px=0; py++; pyw+=w; }
                
                // next block
                if (py+y >= h || py >= step)
                {
                    // update image coordinates
                    x+=step; if ( x>=w ) { x=0; y+=step; yw+=stepw; }
                    px=0; py=0; pyw=0;
                    
                    // calculate the weighed sum of the source image pixels that
                    // fall under the pixelate convolution matrix
                    xOff1 = x; yOff1 = yw;  
                    xOff2 = xOff1 + imageIndicesX; yOff2 = yOff1 + imageIndicesY;
                    
                    // fix borders
                    xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                    yOff2 = (yOff2>by2) ? by2 : yOff2;
                    
                    // compute integral positions
                    p1=(xOff1 + yOff1); p4=(xOff2+yOff2); p2=(xOff2 + yOff1); p3=(xOff1 + yOff2);
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                    
                    // get correct area size
                    wRem = (0==xOff2-xOff1-wstep+1);
                    hRem = (0==yOff2-yOff1-hstepw);
                    inv_size = (wRem && hRem) ? inv_sizewh : ((wRem) ? inv_sizew : ((hRem) ? inv_sizeh : inv_sizes));
                    
                    // compute matrix sum of these elements
                    r = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                    g = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                    b = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                    if (notSupportClamp)
                    {   
                        // clamp them manually
                        r = (r<0) ? 0 : ((r>255) ? 255 : r);
                        g = (g<0) ? 0 : ((g>255) ? 255 : g);
                        b = (b<0) ? 0 : ((b>255) ? 255 : b);
                    }
                    r = ~~r;  g = ~~g;  b = ~~b; // alpha channel is not transformed
                }
            }
            
            // return the pixelated image data
            return im;
        }
    });
    
}(FILTER);/**
*
* Triangular Pixelate Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    "use strict";
    
    var Sqrt = Math.sqrt, sqrt2 = Math.SQRT2, Min = Math.min,
        notSupportClamp = FILTER._notSupportClamp, A32F = FILTER.Array32F;
    
    // a simple fast Triangular Pixelate filter
    FILTER.TriangularPixelateFilter = FILTER.Create({
        name: "TriangularPixelateFilter"
        
        // parameters
        ,scale: 1
        
        // this is the filter constructor
        ,init: function( scale ) {
            var self = this;
            self.scale = scale || 1;
        }
        
        // support worker serialize/unserialize interface
        ,path: FILTER.getPath( )
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    scale: self.scale
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self.scale = params.scale;
            }
            return self;
        }
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            var self = this;
            if ( !self._isOn || self.scale <= 1 ) return im;
            if ( self.scale > 100 ) self.scale = 100;
            
            var imLen = im.length, imArea = (imLen>>2), 
                step, step_2, step_1, stepw, hstep, wstep, hstepw, wRem, hRem,
                inv_size, inv_size1, inv_size1w, inv_size1h, inv_size1hw, 
                inv_sizes, inv_sizew, inv_sizeh, inv_sizewh,
                integral, colR, colG, colB,
                rowLen = (w<<1)+w, imageIndicesX, imageIndicesY,
                i, j, x, y, yw, px, py, pyw, pi,
                xOff1, yOff1, xOff2, yOff2, 
                bx1, by1, bx2, by2, 
                p1, p2, p3, p4, 
                r, g, b, r1, g1, b1, r2, g2, b2
            ;
            
        
            step = ~~(Sqrt(imArea)*self.scale*0.01);
            step_2 = step>>1; step_1 = step-1;
            stepw = w*step; hstep = (h%step); wstep = (w%step); hstepw = (hstep-1)*w;
            inv_size1 = 1.0/(step*step); inv_size1w = 1.0/(wstep*step); inv_size1h = 1.0/(hstep*step); inv_size1hw = 1.0/(wstep*hstep);
            inv_sizes = 2*inv_size1; inv_sizew = 2*inv_size1w; inv_sizeh = 2*inv_size1h; inv_sizewh = 2*inv_size1hw;
            
            // pre-compute indices, 
            imageIndicesX = step_1; imageIndicesY = step_1*w;
            // borders
            bx1=0; bx2=w-1; by1=0; by2=imArea-w;
            
            // compute integral image in one pass (enables fast pixelation in linear time)
            integral = new A32F(imArea*3);
            
            // first row
            i=0; j=0; x=0; colR=colG=colB=0;
            for (x=0; x<w; x++, i+=4, j+=3)
            {
                colR += im[i]; colG += im[i+1]; colB += im[i+2];
                integral[j] = colR; integral[j+1] = colG; integral[j+2] = colB;
            }
            // other rows
            j=0; x=0; colR=colG=colB=0;
            for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=0; }
                colR += im[i]; colG += im[i+1]; colB += im[i+2];
                integral[j+rowLen] = integral[j] + colR; 
                integral[j+rowLen+1] = integral[j+1] + colG;  
                integral[j+rowLen+2] = integral[j+2] + colB;
            }
            
            // first block
            x = 0; y = 0; yw = 0;
            // calculate the weighed sum of the source image pixels that
            // fall under the pixelate convolution matrix
            
            // first triangle
            xOff1 = x; yOff1 = yw;
            xOff2 = x-step_2 + imageIndicesX; yOff2 = yw+imageIndicesY;
            
            // fix borders
            xOff2 = (xOff2>bx2) ? bx2 : xOff2;
            yOff2 = (yOff2>by2) ? by2 : yOff2;
            
            // compute integral positions
            p1 = (xOff1 + yOff1); p4 = (xOff2+yOff2); p2 = (xOff2 + yOff1); p3 = (xOff1 + yOff2);
            p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
            
            inv_size = inv_sizes;
            // compute matrix sum of these elements
            r1 = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
            g1 = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
            b1 = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
            
            // second triangle
            xOff1 = x+step_2;
            xOff2 = x+imageIndicesX;
            
            // fix borders
            xOff2 = (xOff2>bx2) ? bx2 : xOff2;
            
            // compute integral positions
            p1 = (xOff1 + yOff1); p4 = (xOff2+yOff2); p2 = (xOff2 + yOff1); p3 = (xOff1 + yOff2);
            p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
            
            // compute matrix sum of these elements
            r2 = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
            g2 = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
            b2 = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
            
            if (notSupportClamp)
            {   
                // clamp them manually
                r1 = (r1<0) ? 0 : ((r1>255) ? 255 : r1);
                g1 = (g1<0) ? 0 : ((g1>255) ? 255 : g1);
                b1 = (b1<0) ? 0 : ((b1>255) ? 255 : b1);
                r2 = (r2<0) ? 0 : ((r2>255) ? 255 : r2);
                g2 = (g2<0) ? 0 : ((g2>255) ? 255 : g2);
                b2 = (b2<0) ? 0 : ((b2>255) ? 255 : b2);
            }
            r1 = ~~r1;  g1 = ~~g1;  b1 = ~~b1; // alpha channel is not transformed
            r2 = ~~r2;  g2 = ~~g2;  b2 = ~~b2; // alpha channel is not transformed
            
            // render first triangle
            r = r1; g = g1; b = b1;
            
            // do direct pixelate convolution
            px = 0; py = 0; pyw = 0;
            for (i=0; i<imLen; i+=4)
            {
                // output
                // replace the area equal to the given pixelate size
                // with the average color, computed in previous step
                pi = (px+x + pyw+yw)<<2;
                im[pi] = r;  im[pi+1] = g;  im[pi+2] = b; 
                
                // next pixel
                px++; 
                if ( px+x >= w || px >= step ) 
                { 
                    px=0; py++; pyw+=w; 
                    // render first triangle, faster if put here
                    r = r1; g = g1; b = b1;
                }
                // these edge conditions create the various triangular patterns
                if ( px > step_1-py ) 
                { 
                    // render second triangle
                    r = r2; g = g2; b = b2;
                }
                /*else
                {
                     // render first triangle
                    r = r1; g = g1; b = b1;
                }*/
                
                
                // next block
                if (py + y >= h || py >= step)
                {
                    // update image coordinates
                    x += step; if (x >= w)  { x=0; y+=step; yw+=stepw; }
                    px = 0; py = 0; pyw = 0;
                    
                    // calculate the weighed sum of the source image pixels that
                    // fall under the pixelate convolution matrix
                    
                    // first triangle
                    xOff1 = x; yOff1 = yw;  
                    xOff2 = x - step_2 + imageIndicesX; yOff2 = yw + imageIndicesY;
                    
                    // fix borders
                    xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                    yOff2 = (yOff2>by2) ? by2 : yOff2;
                    
                    // compute integral positions
                    p1 = (xOff1 + yOff1); p4 = (xOff2+yOff2); p2 = (xOff2 + yOff1); p3 = (xOff1 + yOff2);
                    p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
                    
                    // get correct area size
                    wRem = (0==xOff2-xOff1+step_2-wstep+1);
                    hRem = (0==yOff2-yOff1-hstepw);
                    inv_size = (wRem && hRem) ? inv_sizewh : ((wRem) ? inv_sizew : ((hRem) ? inv_sizeh : inv_sizes));
                    
                    // compute matrix sum of these elements
                    r1 = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                    g1 = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                    b1 = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                    
                    // second triangle
                    xOff1 = x + step_2;
                    xOff2 = x + imageIndicesX;
                    
                    // fix borders
                    xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                    
                    // compute integral positions
                    p1 = (xOff1 + yOff1); p4 = (xOff2+yOff2); p2 = (xOff2 + yOff1); p3 = (xOff1 + yOff2);
                    p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
                    
                    // get correct area size
                    wRem = (0==xOff2-xOff1+step_2-wstep+1);
                    inv_size = (wRem && hRem) ? inv_sizewh : ((wRem) ? inv_sizew : ((hRem) ? inv_sizeh : inv_sizes));
                    
                    // compute matrix sum of these elements
                    r2 = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                    g2 = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                    b2 = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                    
                    if (notSupportClamp)
                    {   
                        // clamp them manually
                        r1 = (r1<0) ? 0 : ((r1>255) ? 255 : r1);
                        g1 = (g1<0) ? 0 : ((g1>255) ? 255 : g1);
                        b1 = (b1<0) ? 0 : ((b1>255) ? 255 : b1);
                        r2 = (r2<0) ? 0 : ((r2>255) ? 255 : r2);
                        g2 = (g2<0) ? 0 : ((g2>255) ? 255 : g2);
                        b2 = (b2<0) ? 0 : ((b2>255) ? 255 : b2);
                    }
                    r1 = ~~r1;  g1 = ~~g1;  b1 = ~~b1; // alpha channel is not transformed
                    r2 = ~~r2;  g2 = ~~g2;  b2 = ~~b2; // alpha channel is not transformed
                    
                    // render first triangle
                    r = r1; g = g1; b = b1;
                }
            }
            
            // return the pixelated image data
            return im;
        }
    });
    
}(FILTER);/**
*
* HSV Converter Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    "use strict";
    
    var notSupportClamp=FILTER._notSupportClamp, RGB2HSV=FILTER.Color.RGB2HSV,                 
        toCol = 0.70833333333333333333333333333333 // 255/360
    ;
    
    // a plugin to convert an RGB Image to an HSV Image
    FILTER.HSVConverterFilter = FILTER.Create({
        name: "HSVConverterFilter"
        
        ,path: FILTER.getPath( )
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            var self = this;
            if ( !self._isOn ) return im;
            var r,g,b, i, l=im.length, hsv, t0, t1, t2;
            
            if ( notSupportClamp )
            {   
                for (i=0; i<l; i+=4)
                {
                    r = im[i]; g = im[i+1]; b = im[i+2];
                    hsv = RGB2HSV({r:r, g:g, b:b});
                    t0 = hsv.h*toCol; t2 = hsv.s*255; t1 = hsv.v;
                    // clamp them manually
                    if (t0<0) t0=0;
                    else if (t0>255) t0=255;
                    if (t1<0) t1=0;
                    else if (t1>255) t1=255;
                    if (t2<0) t2=0;
                    else if (t2>255) t2=255;
                    im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                {
                    r = im[i]; g = im[i+1]; b = im[i+2];
                    hsv = RGB2HSV({r:r, g:g, b:b});
                    t0 = hsv.h*toCol; t2 = hsv.s*255; t1 = hsv.v;
                    im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
                }
            }
            // return the new image data
            return im;
        }
    });
    
}(FILTER);/**
*
* Hue Extractor Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    "use strict";
    
    var notSupportClamp=FILTER._notSupportClamp,
        IMG=FILTER.ImArray, clamp=FILTER.Color.clampPixel,
        RGB2HSV=FILTER.Color.RGB2HSV, HSV2RGB=FILTER.Color.HSV2RGB, Color2RGBA=FILTER.Color.Color2RGBA
        ;
    
    // a plugin to extract regions based on a HUE range
    FILTER.HueExtractorFilter = FILTER.Create({
        name: "HueExtractorFilter"
        
        // filter parameters
        ,range : null
        ,background : 0
        
        // constructor
        ,init : function( range, background ) {
            var self = this;
            self.range = range;
            self.background = background || 0;
        }
        
        // support worker serialize/unserialize interface
        ,path: FILTER.getPath( )
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    range: self.range
                    ,background: self.background
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self.range = params.range;
                self.background = params.background;
            }
            return self;
        }
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            var self = this;
            if (!self._isOn || !self.range || !self.range.length) return im;
            
            var r, g, b, br, bg, bb, ba,
                i, l=im.length, background, hue,
                hMin=self.range[0], hMax=self.range[self.range.length-1]
                ;
            
            background = Color2RGBA(self.background||0);
            br = ~~clamp(background.r); 
            bg = ~~clamp(background.g); 
            bb = ~~clamp(background.b); 
            ba = ~~clamp(background.a);
            
            for (i=0; i<l; i+=4)
            {
                r = im[i]; g = im[i+1]; b = im[i+2];
                hue = RGB2HSV({r:r, g:g, b:b}).h;
                
                if (hue<hMin || hue>hMax) 
                {  
                    im[i] = br; im[i+1] = bg; im[i+2] = bb; im[i+3] = ba; 
                }
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);/**
*
* Channel Copy Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    "use strict";
    
    var notSupportClamp=FILTER._notSupportClamp, Min=Math.min, Floor=Math.floor,
        R=FILTER.CHANNEL.RED, G=FILTER.CHANNEL.GREEN, B=FILTER.CHANNEL.BLUE, A=FILTER.CHANNEL.ALPHA;
    
    // a plugin to copy a channel of an image to a channel of another image
    FILTER.ChannelCopyFilter = FILTER.Create({
        name: "ChannelCopyFilter"
        
        // parameters
        ,_srcImg: null
        ,srcImg: null
        ,centerX: 0
        ,centerY: 0
        ,srcChannel: 0
        ,dstChannel: 0
        
        // constructor
        ,init: function( srcImg, srcChannel, dstChannel, centerX, centerY ) {
            var self = this;
            self._srcImg = null;
            self.srcImg = null;
            self.srcChannel = srcChannel || R;
            self.dstChannel = dstChannel || R;
            self.centerX = centerX || 0;
            self.centerY = centerY || 0;
            if ( srcImg ) self.setSrc( srcImg );
        }
        
        // support worker serialize/unserialize interface
        ,path: FILTER.getPath( )
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    _srcImg: self._srcImg
                    ,centerX: self.centerX
                    ,centerY: self.centerY
                    ,srcChannel: self.srcChannel
                    ,dstChannel: self.dstChannel
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self._srcImg = params._srcImg;
                self.centerX = params.centerX;
                self.centerY = params.centerY;
                self.srcChannel = params.srcChannel;
                self.dstChannel = params.dstChannel;
            }
            return self;
        }
        
        ,setSrc: function( srcImg ) {
            var self = this;
            if ( srcImg )
            {
                self.srcImg = srcImg;
                self._srcImg = { data: srcImg.getData( ), width: srcImg.width, height: srcImg.height };
            }
            return self;
        }
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            var self = this;
            if ( !self._isOn || !self._srcImg ) return im;
            
            var src = self._srcImg.data,
                i, l = im.length, l2 = src.length, 
                w2 = self._srcImg.width, 
                h2 = self._srcImg.height,
                sC = self.srcChannel, tC = self.dstChannel,
                x, x2, y, y2, off, xc, yc, 
                wm = Min(w,w2), hm = Min(h, h2),  
                cX = self.centerX||0, cY = self.centerY||0, 
                cX2 = (w2>>1), cY2 = (h2>>1)
            ;
            
            
            // make center relative
            cX = Floor(cX*(w-1)) - cX2;
            cY = Floor(cY*(h-1)) - cY2;
            
            i=0; x=0; y=0;
            for (i=0; i<l; i+=4, x++)
            {
                if (x>=w) { x=0; y++; }
                
                xc = x - cX; yc = y - cY;
                if (xc>=0 && xc<wm && yc>=0 && yc<hm)
                {
                    // copy channel
                    off = (xc + yc*w2)<<2;
                    im[i + tC] = src[off + sC];
                }
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);/**
*
* Alpha Mask Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    "use strict";
    
    var notSupportClamp = FILTER._notSupportClamp, Min = Math.min, Floor=Math.floor;
    
    // a plugin to mask an image using the alpha channel of another image
    FILTER.AlphaMaskFilter = FILTER.Create({
        name: "AlphaMaskFilter"
        
        // parameters
        ,_alphaMask: null
        ,alphaMask: null
        ,centerX: 0
        ,centerY: 0
        
        // constructor
        ,init: function( alphaMask, centerX, centerY ) {
            var self = this;
            self.centerX = centerX||0;
            self.centerY = centerY||0;
            self._alphaMask = null;
            self.alphaMask = null;
            if ( alphaMask ) self.setMask( alphaMask );
        }
        
        // support worker serialize/unserialize interface
        ,path: FILTER.getPath( )
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    _alphaMask: self._alphaMask
                    ,centerX: self.centerX
                    ,centerY: self.centerY
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self._alphaMask = params._alphaMask;
                self.centerX = params.centerX;
                self.centerY = params.centerY;
            }
            return self;
        }
        
        ,setMask: function( alphaMask ) {
            var self = this;
            if ( alphaMask )
            {
                self.alphaMask = alphaMask;
                self._alphaMask = { data: alphaMask.getData( ), width: alphaMask.width, height: alphaMask.height };
            }
            return self;
        }
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            
            var self = this;
            if ( !self._isOn || !self._alphaMask ) return im;
            
            var alpha = self._alphaMask.data,
                w2 = self._alphaMask.width, h2 = self._alphaMask.height,
                i, l = im.length, l2 = alpha.length, 
                x, x2, y, y2, off, xc, yc, 
                wm = Min(w, w2), hm = Min(h, h2),  
                cX = self.centerX||0, cY = self.centerY||0, 
                cX2 = (w2>>1), cY2 = (h2>>1)
            ;
            
            
            // make center relative
            cX = Floor(cX*(w-1)) - cX2;
            cY = Floor(cY*(h-1)) - cY2;
            
            x=0; y=0;
            for (i=0; i<l; i+=4, x++)
            {
                if (x>=w) { x=0; y++; }
                
                xc = x - cX; yc = y - cY;
                if (xc>=0 && xc<wm && yc>=0 && yc<hm)
                {
                    // copy alpha channel
                    off = (xc + yc*w2)<<2;
                    im[i+3] = alpha[off+3];
                }
                else
                {
                    // better to remove the alpha channel if mask dimensions are different??
                    im[i+3] = 0;
                }
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);/**
*
* Image Blend Filter Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){

    "use strict";
    
    var Min = Math.min, Max = Math.max, 
        Round = Math.round, Floor=Math.floor, Abs = Math.abs,
        notSupportClamp = FILTER._notSupportClamp,
        blendModes
    ;
    
    //
    //
    // a photoshop-like Blend Filter Plugin
    FILTER.BlendFilter = FILTER.Create({
        name: "BlendFilter"
        
        // parameters
        ,_blendMode: null
        ,_blendImage: null
        ,blendMode: null
        ,blendImage: null
        ,startX: 0
        ,startY: 0
        ,amount: 1
        
        // constructor
        ,init: function( blendImage, blendMode, amount ) { 
            var self = this;
            self.startX = 0;
            self.startY = 0;
            self.amount = 1;
            self._blendImage = null;
            self.blendImage = null;
            self._blendMode = null;
            self.blendMode = null;
            if ( blendImage ) self.setImage( blendImage );
            if ( blendMode ) self.setMode( blendMode, amount );
        }
        
        // support worker serialize/unserialize interface
        ,path: FILTER.getPath( )
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    _blendImage: self._blendImage
                    ,_blendMode: self._blendMode
                    ,startX: self.startX
                    ,startY: self.startY
                    ,amount: self.amount
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self._blendImage = params._blendImage;
                self.startX = params.startX;
                self.startY = params.startY;
                self.setMode( params._blendMode, params.amount );
            }
            return self;
        }
        
        // set blend image auxiliary method
        ,setImage: function( blendImage ) {
            var self = this;
            if ( blendImage )
            {
                self.blendImage = blendImage;
                self._blendImage = { data: blendImage.getData( ), width: blendImage.width, height: blendImage.height };
            }
            return self;
        }
        
        // set blend mode auxiliary method
        ,setMode: function( blendMode, amount ) {
            var self = this;
            if ( blendMode )
            {
                self._blendMode = (''+blendMode).toLowerCase();
                self.blendMode = blendModes[self._blendMode] || null;
                self.amount = Max( 0, Min( 1, (undef===amount) ? 1 : amount ) );
            }
            else
            {
                self._blendMode = null;
                self.blendMode = null;
            }
            return self;
        }
        
        ,reset: function( ) {
            var self = this;
            self.startX = 0;
            self.startY = 0;
            self.amount = 1;
            self._blendMode = null;
            self.blendMode = null;
            return self;
        }
        
        // main apply routine
        ,apply: function(im, w, h/*, image*/) {
            var self = this;
            if ( !self._isOn || !self.blendMode || !self._blendImage ) return im;
            
            var startX = self.startX||0, startY = self.startY||0, 
                startX2 = 0, startY2 = 0, W, H, 
                im2, w2, h2, image2 = self._blendImage,
                amount = self.amount||1
            ;
            
            w2 = image2.width; h2 = image2.height;
            
            if (startX < 0) { startX2 = -startX;  startX = 0; }
            if (startY < 0) { startY2 = -startY;  startY = 0; }
            
            if (startX >= w || startY >= h) return im;
            if (startX2 >= w2 || startY2 >= h2) return im;
            
            startX = Round(startX); startY = Round(startY);
            startX2 = Round(startX2); startY2 = Round(startY2);
            W = Min(w-startX, w2-startX2); H = Min(h-startY, h2-startY2);
            
            if (W <= 0 || H <= 0) return im;
            
            im2 = image2.data;
            
            return self.blendMode(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount);
        }
    });
    
    // JavaScript implementations of common image blending modes, based on
    // http://stackoverflow.com/questions/5919663/how-does-photoshop-blend-two-images-together
    blendModes = {
        
        normal: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // normal mode
                rb = r2;  
                gb = g2;  
                bb = b2;
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        lighten: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // lighten mode
                rb = (r > r2) ? r : r2; 
                gb = (g > g2) ? g : g2; 
                bb = (b > b2) ? b : b2; 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        darken: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // darken mode
                rb = (r > r2) ? r2 : r; 
                gb = (g > g2) ? g2 : g; 
                bb = (b > b2) ? b2 : b; 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        multiply: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // multiply mode
                rb = (r * r2 * 0.003921568627451);
                gb = (g * g2 * 0.003921568627451);
                bb = (b * b2 * 0.003921568627451);
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        average: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // average mode
                rb = 0.5*(r + r2); 
                gb = 0.5*(g + g2); 
                bb = 0.5*(b + b2); 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        add: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // add mode
                rb = r + r2; 
                gb = g + g2; 
                bb = b + b2; 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        subtract: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // subtract mode
                rb = (r + r2 < 255) ? 0 : r + r2 - 255;  
                gb = (g + g2 < 255) ? 0 : g + g2 - 255;  
                bb = (b + b2 < 255) ? 0 : b + b2 - 255;  
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        difference: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // difference mode
                rb = Abs(r2 - r); 
                gb = Abs(g2 - g); 
                bb = Abs(b2 - b); 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        negation: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // negation mode
                rb = 255 - Abs(255 - r2 - r);
                gb = 255 - Abs(255 - g2 - g);
                bb = 255 - Abs(255 - b2 - b);
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        screen: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // screen mode
                rb = 255 - (((255 - r2) * (255 - r)) >> 8); 
                gb = 255 - (((255 - g2) * (255 - g)) >> 8); 
                bb = 255 - (((255 - b2) * (255 - b)) >> 8); 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        exclusion: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // exclusion mode
                rb = r2 + r - 2 * r2 * r * 0.003921568627451; 
                gb = g2 + g - 2 * g2 * g * 0.003921568627451; 
                bb = b2 + b - 2 * b2 * b * 0.003921568627451; 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        overlay: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // overlay mode
                rb = r < 128 ? (2 * r2 * r * 0.003921568627451) : (255 - 2 * (255 - r2) * (255 - r) * 0.003921568627451); 
                gb = g < 128 ? (2 * g2 * g * 0.003921568627451) : (255 - 2 * (255 - g2) * (255 - g) * 0.003921568627451); 
                rb = b < 128 ? (2 * b2 * b * 0.003921568627451) : (255 - 2 * (255 - b2) * (255 - b) * 0.003921568627451); 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        softlight: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // softlight mode
                rb = r < 128 ? (2 * ((r2 >> 1) + 64)) * (r * 0.003921568627451) : 255 - (2 * (255 - (( r2 >> 1) + 64)) * (255 - r) * 0.003921568627451); 
                gb = g < 128 ? (2 * ((g2 >> 1) + 64)) * (g * 0.003921568627451) : 255 - (2 * (255 - (( g2 >> 1) + 64)) * (255 - g) * 0.003921568627451); 
                bb = b < 128 ? (2 * ((b2 >> 1) + 64)) * (b * 0.003921568627451) : 255 - (2 * (255 - (( b2 >> 1) + 64)) * (255 - b) * 0.003921568627451); 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        // reverse of overlay
        hardlight: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // hardlight mode, reverse of overlay
                rb = r2 < 128 ? (2 * r * r2 * 0.003921568627451) : (255 - 2 * (255 - r) * (255 - r2) * 0.003921568627451); 
                gb = g2 < 128 ? (2 * g * g2 * 0.003921568627451) : (255 - 2 * (255 - g) * (255 - g2) * 0.003921568627451); 
                bb = b2 < 128 ? (2 * b * b2 * 0.003921568627451) : (255 - 2 * (255 - b) * (255 - b2) * 0.003921568627451); 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        colordodge: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // colordodge mode
                rb = (255 == r) ? r : Min(255, ((r2 << 8 ) / (255 - r))); 
                gb = (255 == g) ? g : Min(255, ((g2 << 8 ) / (255 - g))); 
                bb = (255 == b) ? r : Min(255, ((b2 << 8 ) / (255 - b))); 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        colorburn: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // colorburn mode
                rb = (0 == r) ? r : Max(0, (255 - ((255 - r2) << 8 ) / r)); 
                gb = (0 == g) ? g : Max(0, (255 - ((255 - g2) << 8 ) / g)); 
                bb = (0 == b) ? b : Max(0, (255 - ((255 - b2) << 8 ) / b)); 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        linearlight: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            var tmp;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // linearlight mode
                if (r < 128)
                {
                    tmp = r*2;
                    rb = (tmp + r2 < 255) ? 0 : tmp + r2 - 255; //blendModes.linearBurn(a, 2 * b)
                }
                else
                {
                    tmp = 2 * (r - 128);
                    rb = tmp + r2; //blendModes.linearDodge(a, (2 * (b - 128)))
                }
                if (g < 128)
                {
                    tmp = g*2;
                    gb = (tmp + g2 < 255) ? 0 : tmp + g2 - 255; //blendModes.linearBurn(a, 2 * b)
                }
                else
                {
                    tmp = 2 * (g - 128);
                    gb = tmp + g2; //blendModes.linearDodge(a, (2 * (b - 128)))
                }
                if (b < 128)
                {
                    tmp = b*2;
                    bb = (tmp + b2 < 255) ? 0 : tmp + b2 - 255; //blendModes.linearBurn(a, 2 * b)
                }
                else
                {
                    tmp = 2 * (b - 128);
                    bb = tmp + b2; //blendModes.linearDodge(a, (2 * (b - 128)))
                }
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        reflect: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // reflect mode
                rb = (255 == r) ? r : Min(255, (r2 * r2 / (255 - r))); 
                gb = (255 == g) ? g : Min(255, (g2 * g2 / (255 - g))); 
                bb = (255 == b) ? b : Min(255, (b2 * b2 / (255 - b))); 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        // reverse of reflect
        glow: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // glow mode, reverse of reflect
                rb = (255 == r2) ? r2 : Min(255, (r * r / (255 - r2))); 
                gb = (255 == g2) ? g2 : Min(255, (g * g / (255 - g2))); 
                bb = (255 == b2) ? b2 : Min(255, (b * b / (255 - b2))); 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        phoenix: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // phoenix mode
                rb = Min(r2, r) - Max(r2, r) + 255; 
                gb = Min(g2, g) - Max(g2, g) + 255; 
                bb = Min(b2, b) - Max(b2, b) + 255; 
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        vividlight: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            var tmp;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // vividlight mode
                if (r < 128)
                {
                    tmp = 2*r;
                    rb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - r2) << 8 ) / tmp));  //blendModes.colorBurn(a, 2 * b)
                }
                else
                {
                    tmp = 2 * (r-128);
                    rb = (255 == tmp) ? tmp : Min(255, ((r2 << 8 ) / (255 - tmp)));  // blendModes.colorDodge(a, (2 * (b - 128)))
                }
                if (g < 128)
                {
                    tmp = 2*g;
                    gb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - g2) << 8 ) / tmp));  //blendModes.colorBurn(a, 2 * b)
                }
                else
                {
                    tmp = 2 * (g-128);
                    gb = (255 == tmp) ? tmp : Min(255, ((g2 << 8 ) / (255 - tmp)));  // blendModes.colorDodge(a, (2 * (b - 128)))
                }
                if (b < 128)
                {
                    tmp = 2*b;
                    bb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - b2) << 8 ) / tmp));  //blendModes.colorBurn(a, 2 * b)
                }
                else
                {
                    tmp = 2 * (g-128);
                    bb = (255 == tmp) ? tmp : Min(255, ((b2 << 8 ) / (255 - tmp)));  // blendModes.colorDodge(a, (2 * (b - 128)))
                }
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        pinlight: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            var tmp;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // pinlight mode
                if (r < 128)
                {
                    tmp = 2*r;
                    rb = (tmp > r2) ? tmp : r2;  //blendModes.darken(a, 2 * b)
                }
                else
                {
                    tmp = 2 * (r-128);
                    rb = (tmp > r2) ? r2 : tmp;  // blendModes.lighten(a, (2 * (b - 128)))
                }
                if (g < 128)
                {
                    tmp = 2*g;
                    gb = (tmp > g2) ? tmp : g2;  //blendModes.darken(a, 2 * b)
                }
                else
                {
                    tmp = 2 * (r-128);
                    gb = (tmp > g2) ? g2 : tmp;  // blendModes.lighten(a, (2 * (b - 128)))
                }
                if (b < 128)
                {
                    tmp = 2*b;
                    bb = (tmp > b2) ? tmp : b2;  //blendModes.darken(a, 2 * b)
                }
                else
                {
                    tmp = 2 * (b-128);
                    bb = (tmp > b2) ? b2 : tmp;  // blendModes.lighten(a, (2 * (b - 128)))
                }
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        },

        hardmix: function(im, w, h, im2, w2, h2, startX, startY, startX2, startY2, W, H, amount) { 
            var W1, W2, start, end, i, i2, x, y, x2, y2,
                r, g, b, r2, g2, b2, rb, gb, bb, invamount
            ;
            
            // blend images
            invamount = 1-amount;
            x = startX; y = startY*w;
            x2 = startX2; y2 = startY2*w2;
            W1 = startX+W; W2 = startX2+W;
            start = 0; end = H*W;
            var tmp;
            while (start<end)
            {
                i = (x + y)<<2; i2 = (x2 + y2)<<2;
                r = im[i];  g = im[i + 1];  b = im[i + 2];
                r2 = im2[i2];  g2 = im2[i2 + 1];  b2 = im2[i2 + 2];
                
                // calculate blended color
                //rb = blendingMode(r2, r);  gb = blendingMode(g2, g);  bb = blendingMode(b2, b);
                // hardmix mode, blendModes.vividLight(a, b) < 128 ? 0 : 255;
                if (r < 128)
                {
                    tmp = 2*r;
                    rb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - r2) << 8 ) / tmp));
                }
                else
                {
                    tmp = 2 * (r-128);
                    rb = (255 == tmp) ? tmp : Min(255, ((r2 << 8 ) / (255 - tmp)));
                }
                rb = (rb < 128) ? 0 : 255;
                if (g < 128)
                {
                    tmp = 2*g;
                    gb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - g2) << 8 ) / tmp));
                }
                else
                {
                    tmp = 2 * (g-128);
                    gb = (255 == tmp) ? tmp : Min(255, ((g2 << 8 ) / (255 - tmp)));
                }
                gb = (gb < 128) ? 0 : 255;
                if (b < 128)
                {
                    tmp = 2*b;
                    bb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - b2) << 8 ) / tmp));
                }
                else
                {
                    tmp = 2 * (b-128);
                    bb = (255 == tmp) ? tmp : Min(255, ((b2 << 8 ) / (255 - tmp)));
                }
                bb = (bb < 128) ? 0 : 255;
                
                // amount compositing
                r = rb * amount + r * invamount;  
                g = gb * amount + g * invamount;  
                b = bb * amount + b * invamount;
                
                if (notSupportClamp)
                {
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                
                // output
                im[i] = ~~r; im[i+1] = ~~g; im[i+2] = ~~b;
                
                // next pixels
                start++;
                x++; if (x>=W1) { x = startX; y += w; }
                x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
            }
            return im; 
        }
    };
    // aliases
    blendModes.lineardodge = blendModes.add;
    blendModes.linearburn = blendModes.subtract;

}(FILTER);/**
*
* Threshold Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    "use strict";
    
    var notSupportClamp=FILTER._notSupportClamp,
        RGBA2Color=FILTER.Color.RGBA2Color, Color2RGBA=FILTER.Color.Color2RGBA
        ;
    
    // a plugin to apply a general threshold filtering to an image
    FILTER.ThresholdFilter = FILTER.Create({
        name: "ThresholdFilter"
        
        // filter parameters
        ,thresholds: null
        // NOTE: quantizedColors should contain 1 more element than thresholds
        ,quantizedColors: null
        
        // constructor
        ,init: function( thresholds, quantizedColors ) {
            var self = this;
            self.thresholds = thresholds;
            self.quantizedColors = quantizedColors || null;
        }
        
        // support worker serialize/unserialize interface
        ,path: FILTER.getPath( )
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    thresholds: self.thresholds
                    ,quantizedColors: self.quantizedColors
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self.thresholds = params.thresholds;
                self.quantizedColors = params.quantizedColors;
            }
            return self;
        }
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            var self = this;
            if (!self._isOn || !self.thresholds || !self.thresholds.length || 
                !self.quantizedColors || !self.quantizedColors.length) return im;
            
            var t0, t1, t2, t3, color, rgba,
                i, j, l=im.length,
                thresholds=self.thresholds, tl=thresholds.length, colors=self.quantizedColors, cl=colors.length
                ;
            
            for (i=0; i<l; i+=4)
            {
                color = RGBA2Color({r:im[i], g:im[i+1], b:im[i+2], a:im[i+3]});
                
                // maybe use sth faster here ??
                j=0; while (j<tl && color>thresholds[j]) j++;
                color = (j<cl) ? colors[j] : 255;
                
                rgba = Color2RGBA(color);
                t0 = rgba.r; t1 = rgba.g; t2 = rgba.b; t3 = rgba.a;
                
                im[i] = t0; im[i+1] = t1; im[i+2] = t2; im[i+3] = t3;
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);/**
*
* Bokeh (Depth-of-Field) Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    "use strict";
    
    var Sqrt=Math.sqrt, Exp=Math.exp, Log=Math.log, 
        Abs=Math.abs, Floor=Math.floor,
        notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F;
    
    // a simple bokeh (depth-of-field) filter
    FILTER.BokehFilter = FILTER.Create({
        name: "BokehFilter"
        
        // parameters
        ,centerX: 0
        ,centerY: 0
        ,radius: 10
        ,amount: 10
        
        // this is the filter constructor
        ,init: function( centerX, centerY, radius, amount ) {
            var self = this;
            self.centerX = centerX || 0;
            self.centerY = centerY || 0;
            self.radius = radius || 10;
            self.amount = amount || 10;
        }
        
        // support worker serialize/unserialize interface
        ,path: FILTER.getPath( )
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    centerX: self.centerX
                    ,centerY: self.centerY
                    ,radius: self.radius
                    ,amount: self.amount
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self.centerX = params.centerX;
                self.centerY = params.centerY;
                self.radius = params.radius;
                self.amount = params.amount;
            }
            return self;
        }
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            var self = this;
            if ( !self._isOn ) return im;
            var imLen = im.length, imArea, 
                integral, integralLen, colR, colG, colB,
                rowLen, i, j, x , y, ty, 
                cX = self.centerX||0, cY = self.centerY||0, 
                r = self.radius, m = self.amount,
                d, dx, dy, blur, blurw, wt,
                xOff1, yOff1, xOff2, yOff2,
                p1, p2, p3, p4, t0, t1, t2,
                bx1, bx2, by1, by2
            ;
            
            if ( m<=0 ) return im;
            
            imArea = (imLen>>2);
            bx1=0; bx2=w-1; by1=0; by2=imArea-w;
            
            // make center relative
            cX = Floor(cX*(w-1));
            cY = Floor(cY*(h-1));
            
            integralLen = (imArea<<1)+imArea;  rowLen = (w<<1)+w;
            integral = new A32F(integralLen);
            
            // compute integral of image in one pass
            // first row
            i=0; j=0; x=0; colR=colG=colB=0;
            for (x=0; x<w; x++, i+=4, j+=3)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
            }
            // other rows
            i=rowLen+w; j=0; x=0; colR=colG=colB=0;
            for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=0; }
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j+rowLen]=integral[j]+colR; 
                integral[j+rowLen+1]=integral[j+1]+colG; 
                integral[j+rowLen+2]=integral[j+2]+colB;
            }
            
            
            // bokeh (depth-of-field) effect 
            // is a kind of adaptive blurring depending on distance from a center
            // like the camera/eye is focused on a specific area and everything else appears increasingly blurred
            
            x=0; y=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; y++; ty+=w; }
                
                // compute distance
                dx = x-cX; dy = y-cY;
                //d = Sqrt(dx*dx + dy*dy);
                d = Abs(dx) + Abs(dy);  // approximation
                
                // calculate amount(radius) of blurring 
                // depending on distance from focus center
                blur = (d>r) ? ~~Log((d-r)*m) : ~~(d/r+0.5); // smooth it a bit, around the radius edge condition
                
                if (blur>0)
                {
                     blurw = blur*w; wt = 0.25/(blur*blur);
                     
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1 = x - blur; yOff1 = ty - blurw;
                    xOff2 = x + blur; yOff2 = ty + blurw;
                    
                    // fix borders
                    if (xOff1<bx1) xOff1=bx1;
                    else if (xOff2>bx2) xOff2=bx2;
                    if (yOff1<by1) yOff1=by1;
                    else if (yOff2>by2) yOff2=by2;
                    
                    // compute integral positions
                    p1 = xOff1 + yOff1; p4 = xOff2 + yOff2; p2 = xOff2 + yOff1; p3 = xOff1 + yOff2;
                    // arguably faster way to write p1*=3; etc..
                    p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
                    
                    // apply a fast box-blur to these pixels
                    // compute matrix sum of these elements 
                    // (trying to avoid possible overflow in the process, order of summation can matter)
                    t0 = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                    t1 = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                    t2 = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                    
                    // output
                    if (notSupportClamp)
                    {   
                        // clamp them manually
                        t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                        t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                        t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                    }
                    im[i] = ~~t0;  im[i+1] = ~~t1;  im[i+2] = ~~t2;
                    // alpha channel is not transformed
                    //im[i+3] = im[i+3];
                }
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);

    /* main code ends here */
    
    /* export the module "FILTER_PLUGINS" */
    return FILTER_PLUGINS;
});