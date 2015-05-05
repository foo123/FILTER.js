/**
*
*   FILTER.js Plugins
*   @version: 0.7-alpha2
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Plugins)
*   https://github.com/foo123/FILTER.js
*
**/!function ( root, name, deps, factory ) {
    "use strict";
    
    //
    // export the module umd-style (with deps bundled-in or external)
    
    // Get current filename/path
    function getPath( isNode, isWebWorker, isAMD, isBrowser, amdMod ) 
    {
        var f;
        if (isNode) return {file:__filename, path:__dirname};
        else if (isWebWorker) return {file:(f=self.location.href), path:f.split('/').slice(0, -1).join('/')};
        else if (isAMD&&amdMod&&amdMod.uri)  return {file:(f=amdMod.uri), path:f.split('/').slice(0, -1).join('/')};
        else if (isBrowser&&(f=document.getElementsByTagName('script'))&&f.length) return {file:(f=f[f.length - 1].src), path:f.split('/').slice(0, -1).join('/')};
        return {file:null,  path:null};
    }
    function getDeps( names, paths, deps, depsType, require/*offset*/ )
    {
        //offset = offset || 0;
        var i, dl = names.length, mods = new Array( dl );
        for (i=0; i<dl; i++) 
            mods[ i ] = (1 === depsType)
                    ? /* node */ (deps[ names[ i ] ] || require( paths[ i ] )) 
                    : (2 === depsType ? /* amd args */ /*(deps[ i + offset ])*/ (require( names[ i ] )) : /* globals */ (deps[ names[ i ] ]))
                ;
        return mods;
    }
    // load javascript(s) (a)sync using <script> tags if browser, or importScripts if worker
    function loadScripts( scope, base, names, paths, callback, imported )
    {
        var dl = names.length, i, rel, t, load, next, head, link;
        if ( imported )
        {
            for (i=0; i<dl; i++) if ( !(names[ i ] in scope) ) importScripts( base + paths[ i ] );
            return callback( );
        }
        head = document.getElementsByTagName("head")[ 0 ]; link = document.createElement( 'a' );
        rel = /^\./; t = 0; i = 0;
        load = function( url, cb ) {
            var done = 0, script = document.createElement('script');
            script.type = 'text/javascript'; script.language = 'javascript';
            script.onload = script.onreadystatechange = function( ) {
                if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete'))
                {
                    done = 1; script.onload = script.onreadystatechange = null;
                    cb( );
                    head.removeChild( script ); script = null;
                }
            }
            if ( rel.test( url ) ) 
            {
                // http://stackoverflow.com/a/14781678/3591273
                // let the browser generate abs path
                link.href = base + url;
                url = link.protocol + "//" + link.host + link.pathname + link.search + link.hash;
            }
            // load it
            script.src = url; head.appendChild( script );
        };
        next = function( ) {
            if ( names[ i ] in scope )
            {
                if ( ++i >= dl ) callback( );
                else if ( names[ i ] in scope ) next( ); 
                else load( paths[ i ], next );
            }
            else if ( ++t < 30 ) { setTimeout( next, 30 ); }
            else { t = 0; i++; next( ); }
        };
        while ( i < dl && (names[ i ] in scope) ) i++;
        if ( i < dl ) load( paths[ i ], next );
        else callback( );
    }
    
    deps = deps || [[],[]];
    
    var isNode = ("undefined" !== typeof global) && ("[object global]" === {}.toString.call(global)),
        isBrowser = !isNode && ("undefined" !== typeof navigator), 
        isWebWorker = !isNode && ("function" === typeof importScripts) && (navigator instanceof WorkerNavigator),
        isAMD = ("function" === typeof define) && define.amd,
        isCommonJS = isNode && ("object" === typeof module) && module.exports,
        currentGlobal = isWebWorker ? self : root, currentPath = getPath( isNode, isWebWorker, isAMD, isBrowser ), m,
        names = [].concat(deps[0]), paths = [].concat(deps[1]), dl = names.length, i, requireJSPath, ext_js = /\.js$/i
    ;
    
    // commonjs, node, etc..
    if ( isCommonJS ) 
    {
        module.$deps = module.$deps || {};
        module.exports = module.$deps[ name ] = factory.apply( root, [{NODE:module}].concat(getDeps( names, paths, module.$deps, 1, require )) ) || 1;
    }
    
    // amd, requirejs, etc..
    else if ( isAMD && ("function" === typeof require) && ("function" === typeof require.specified) &&
        require.specified(name) ) 
    {
        if ( !require.defined(name) )
        {
            requireJSPath = { };
            for (i=0; i<dl; i++) 
                require.specified( names[ i ] ) || (requireJSPath[ names[ i ] ] = paths[ i ].replace(ext_js, ''));
            //requireJSPath[ name ] = currentPath.file.replace(ext_js, '');
            require.config({ paths: requireJSPath });
            // named modules, require the module by name given
            define( name, ["require", "exports", "module"].concat( names ), function( require, exports, module ) {
                return factory.apply( root, [{AMD:module}].concat(getDeps( names, paths, arguments, 2, require )) );
            });
        }
    }
    
    // browser, web worker, other loaders, etc.. + AMD optional
    else if ( !(name in currentGlobal) )
    {
        loadScripts( currentGlobal, currentPath.path + '/', names, paths, function( ){ 
            currentGlobal[ name ] = m = factory.apply( root, [{}].concat(getDeps( names, paths, currentGlobal )) ) || 1; 
            isAMD && define( name, ["require"], function( ){ return m; } );
        }, isWebWorker);
    }


}(  /* current root */          this, 
    /* module name */           "FILTER_PLUGINS",
    /* module dependencies */   [ ['FILTER'], ['./filter.js'] ], 
    /* module factory */        function( exports, FILTER ) {
        
    /* main code starts here */

/**
*
*   FILTER.js Plugins
*   @version: 0.7-alpha2
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Plugins)
*   https://github.com/foo123/FILTER.js
*
**/
exports['FILTER_PLUGINS'] = FILTER;

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
FILTER.Create({
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
    ,path: FILTER.getPath( exports.AMD )
    
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
FILTER.Create({
    name : "HistogramEqualizeFilter"
    
    ,path: FILTER.getPath( exports.AMD )
    
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
FILTER.Create({
    name: "GrayscaleHistogramEqualizeFilter"
    
    ,path: FILTER.getPath( exports.AMD )
    
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
FILTER.Create({
    name: "RGBHistogramEqualizeFilter"
    
    ,path: FILTER.getPath( exports.AMD )
    
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
FILTER.Create({
    name: "PixelateFilter"
    
    // parameters
    ,scale: 1
    
    // this is the filter constructor
    ,init: function( scale ) {
        var self = this;
        self.scale = scale || 1;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
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
FILTER.Create({
    name: "TriangularPixelateFilter"
    
    // parameters
    ,scale: 1
    
    // this is the filter constructor
    ,init: function( scale ) {
        var self = this;
        self.scale = scale || 1;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
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
FILTER.Create({
    name: "HSVConverterFilter"
    
    ,path: FILTER.getPath( exports.AMD )
    
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
FILTER.Create({
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
    ,path: FILTER.getPath( exports.AMD )
    
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
FILTER.Create({
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
    ,path: FILTER.getPath( exports.AMD )
    
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
FILTER.Create({
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
    ,path: FILTER.getPath( exports.AMD )
    
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
FILTER.Create({
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
    ,path: FILTER.getPath( exports.AMD )
    
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
FILTER.Create({
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
    ,path: FILTER.getPath( exports.AMD )
    
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
FILTER.Create({
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
    ,path: FILTER.getPath( exports.AMD )
    
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

}(FILTER);/**
*
* FloodFill Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

// a fast flood fill filter using scanline algorithm
// adapted from: A Seed Fill Algorithm, by Paul Heckbert from "Graphics Gems", Academic Press, 1990
// http://en.wikipedia.org/wiki/Flood_fill
// http://www.codeproject.com/Articles/6017/QuickFill-An-efficient-flood-fill-algorithm
// http://www.codeproject.com/Articles/16405/Queue-Linear-Flood-Fill-A-Fast-Flood-Fill-Algorith
FILTER.Create({
    name : "FloodFillFilter"
    ,x: 0
    ,y: 0
    ,color: null
    ,tolerance: 0.0
    
    ,path: FILTER.getPath( exports.AMD )
    
    ,init: function( x, y, color, tolerance ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.color = color || [0,0,0];
        self.tolerance = tolerance || 0.0;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 color: self.color
                ,x: self.x
                ,y: self.y
                ,tolerance: self.tolerance
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.color = params.color;
            self.x = params.x;
            self.y = params.y;
            self.tolerance = params.tolerance;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        /* adapted from:
         * A Seed Fill Algorithm
         * by Paul Heckbert
         * from "Graphics Gems", Academic Press, 1990
         *
         */
        var self = this, 
            /* seems to have issues when tol is exactly 1.0*/
            tol = ~~(255*(self.tolerance>=1.0 ? 0.999 : self.tolerance)), 
            OC, NC = self.color, /*pix = 4,*/ dy = w<<2, 
            x0 = self.x, y0 = self.y, imSize = im.length, 
            ymin = 0, ymax = imSize-dy, xmin = 0, xmax = (w-1)<<2,
            l, i, x, x1, x2, yw, stack, segment, notdone, abs = Math.abs
        /*
         * Filled horizontal segment of scanline y for xl<=x<=xr.
         * Parent segment was on line y-dy.  dy=1 or -1
         */
        yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ||
            (im[x0+yw] === NC[0] && im[x0+yw+1] === NC[1] && im[x0+yw+2] === NC[2]) ) return im;
        
        // seed color is the image color at x0,y0 position
        OC = [im[x0+yw], im[x0+yw+1], im[x0+yw+2]];    
        stack = [];
        if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, x0, x0, dy]); /* needed in some cases */
        /*if ( yw >= ymin && yw <= ymax)*/ stack.push([yw+dy, x0, x0, -dy]); /* seed segment (popped 1st) */
        
        while ( stack.length ) 
        {
            /* pop segment off stack and fill a neighboring scan line */
            segment = stack.pop();
            yw = segment[0]+(dy=segment[3]); x1 = segment[1]; x2 = segment[2];
            
            /*
             * segment of scan line y-dy for x1<=x<=x2 was previously filled,
             * now explore adjacent pixels in scan line y
             */
            for (x=x1; x>=xmin; x-=4)
            {
                i = x+yw;
                if ( abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                }
                else
                {
                    break;
                }
            }
            if ( x >= x1 ) 
            {
                // goto skip:
                while ( x<=x2 && !(abs(OC[0]-im[x+yw])<=tol && abs(OC[1]-im[x+yw+1])<=tol && abs(OC[2]-im[x+yw+2])<=tol) ) 
                    x+=4;
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+4;
                if ( l < x1 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, l, x1-4, -dy]);  /* leak on left? */
                }
                x = x1+4;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                i = x+yw;
                while ( x<=xmax && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                    x+=4; i = x+yw;
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, l, x-4, dy]);
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, x2+4, x-4, -dy]);	/* leak on right? */
                }
    /*skip:*/   while ( x<=x2 && !(abs(OC[0]-im[x+yw])<=tol && abs(OC[1]-im[x+yw+1])<=tol && abs(OC[2]-im[x+yw+2])<=tol) ) 
                    x+=4;
                l = x;
                notdone = (x <= x2);
            }
        }
        
        // return the new image data
        return im;
    }
});
    
}(FILTER);/**
*
* Canny Edges Detector Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var Float32 = FILTER.Array32F, Int32 = FILTER.Array32I,
    GAUSSIAN_CUT_OFF = 0.005,
    MAGNITUDE_SCALE = 100,
    MAGNITUDE_LIMIT = 1000,
    MAGNITUDE_MAX = MAGNITUDE_SCALE * MAGNITUDE_LIMIT,
    hypot
;

// private utility methods
//NOTE: It is quite feasible to replace the implementation of this method
//with one which only loosely approximates the hypot function. I've tested
//simple approximations such as Math.abs(x) + Math.abs(y) and they work fine.
hypot = Math.hypot 
        ? Math.hypot 
        : /*function( x, y ){
            var absx = Math.abs(x), 
                absy = Math.abs(y),
                r, max;
            // avoid overflows
            if ( absx > absy )
            {
                max = absx;
                r = absy / max;
                
            }
            else
            {
                max = absy;
                if ( 0 == max ) return 0;
                r = absx / max;
            }
            return max*Math.sqrt(1.0 + r*r);
        }*/
        function(x, y){ return Math.abs(x)+Math.abs(y); };
        
function gaussian(x, sigma2) 
{
    return Math.exp(-(x * x) / (2 * sigma2/*sigma * sigma*/));
}

function computeGradients(data, width, height, magnitude, kernelRadius, kernelWidth) 
{
    
    //generate the gaussian convolution masks
    var picsize = data.length,
        xConv = new Float32(picsize),
        yConv = new Float32(picsize),
        xGradient = new Float32(picsize),
        yGradient = new Float32(picsize),
        kernel = new Float32(kernelWidth),
        diffKernel = new Float32(kernelWidth),
        sigma2 = kernelRadius*kernelRadius,
        factor = (2 *  Math.PI * /*kernelRadius * kernelRadius*/sigma2),
        kwidth, g1, g2, g3;
    for (kwidth = 0; kwidth < kernelWidth; kwidth++) 
    {
        g1 = gaussian(kwidth, sigma2);
        if ( g1 <= GAUSSIAN_CUT_OFF && kwidth >= 2 ) break;
        g2 = gaussian(kwidth - 0.5, sigma2);
        g3 = gaussian(kwidth + 0.5, sigma2);
        kernel[kwidth] = (g1 + g2 + g3) / 3 / factor;
        diffKernel[kwidth] = g3 - g2;
    }

    var initX = kwidth - 1,
        maxX = width - (kwidth - 1),
        initY = width * (kwidth - 1),
        maxY = width * (height - (kwidth - 1)),
        x, y, index, sumX, sumY, xOffset, yOffset,
        sum, i
    ;
    
    //perform convolution in x and y directions
    for (x = initX; x < maxX; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
            index = x + y;
            sumX = data[index] * kernel[0];
            sumY = sumX;
            xOffset = 1;
            yOffset = width;
            for(; xOffset < kwidth ;) 
            {
                sumY += kernel[xOffset] * (data[index - yOffset] + data[index + yOffset]);
                sumX += kernel[xOffset] * (data[index - xOffset] + data[index + xOffset]);
                yOffset += width;
                xOffset++;
            }
            
            yConv[index] = sumY;
            xConv[index] = sumX;
        }

    }

    for (x = initX; x < maxX; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
            sum = 0;
            index = x + y;
            for (i = 1; i < kwidth; i++)
                sum += diffKernel[i] * (yConv[index - i] - yConv[index + i]);

            xGradient[index] = sum;
        }

    }

    for (x = kwidth; x < width - kwidth; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
            sum = 0.0;
            index = x + y;
            yOffset = width;
            for (i = 1; i < kwidth; i++) 
            {
                sum += diffKernel[i] * (xConv[index - yOffset] - xConv[index + yOffset]);
                yOffset += width;
            }

            yGradient[index] = sum;
        }

    }

    initX = kwidth;
    maxX = width - kwidth;
    initY = width * kwidth;
    maxY = width * (height - kwidth);
    var indexN, indexS, indexE, indexW,
        indexNW, indexNE, indexSW, indexSE,
        xGrad, yGrad, gradMag, tmp,
        nMag, sMag, eMag, wMag,
        nwMag, neMag, swMag, seMag
    ;
    for (x = initX; x < maxX; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
            index = x + y;
            indexN = index - width;
            indexS = index + width;
            indexW = index - 1;
            indexE = index + 1;
            indexNW = indexN - 1;
            indexNE = indexN + 1;
            indexSW = indexS - 1;
            indexSE = indexS + 1;
            
            xGrad = xGradient[index];
            yGrad = yGradient[index];
            gradMag = hypot(xGrad, yGrad);

            //perform non-maximal supression
            nMag = hypot(xGradient[indexN], yGradient[indexN]);
            sMag = hypot(xGradient[indexS], yGradient[indexS]);
            wMag = hypot(xGradient[indexW], yGradient[indexW]);
            eMag = hypot(xGradient[indexE], yGradient[indexE]);
            neMag = hypot(xGradient[indexNE], yGradient[indexNE]);
            seMag = hypot(xGradient[indexSE], yGradient[indexSE]);
            swMag = hypot(xGradient[indexSW], yGradient[indexSW]);
            nwMag = hypot(xGradient[indexNW], yGradient[indexNW]);
            //tmp;
            /*
             * An explanation of what's happening here, for those who want
             * to understand the source: This performs the "non-maximal
             * supression" phase of the Canny edge detection in which we
             * need to compare the gradient magnitude to that in the
             * direction of the gradient; only if the value is a local
             * maximum do we consider the point as an edge candidate.
             * 
             * We need to break the comparison into a number of different
             * cases depending on the gradient direction so that the
             * appropriate values can be used. To avoid computing the
             * gradient direction, we use two simple comparisons: first we
             * check that the partial derivatives have the same sign (1)
             * and then we check which is larger (2). As a consequence, we
             * have reduced the problem to one of four identical cases that
             * each test the central gradient magnitude against the values at
             * two points with 'identical support'; what this means is that
             * the geometry required to accurately interpolate the magnitude
             * of gradient function at those points has an identical
             * geometry (upto right-angled-rotation/reflection).
             * 
             * When comparing the central gradient to the two interpolated
             * values, we avoid performing any divisions by multiplying both
             * sides of each inequality by the greater of the two partial
             * derivatives. The common comparand is stored in a temporary
             * variable (3) and reused in the mirror case (4).
             * 
             */
            if (xGrad * yGrad <= 0 /*(1)*/
                ? Math.abs(xGrad) >= Math.abs(yGrad) /*(2)*/
                    ? (tmp = Math.abs(xGrad * gradMag)) >= Math.abs(yGrad * neMag - (xGrad + yGrad) * eMag) /*(3)*/
                        && tmp > Math.abs(yGrad * swMag - (xGrad + yGrad) * wMag) /*(4)*/
                    : (tmp = Math.abs(yGrad * gradMag)) >= Math.abs(xGrad * neMag - (yGrad + xGrad) * nMag) /*(3)*/
                        && tmp > Math.abs(xGrad * swMag - (yGrad + xGrad) * sMag) /*(4)*/
                : Math.abs(xGrad) >= Math.abs(yGrad) /*(2)*/
                    ? (tmp = Math.abs(xGrad * gradMag)) >= Math.abs(yGrad * seMag + (xGrad - yGrad) * eMag) /*(3)*/
                        && tmp > Math.abs(yGrad * nwMag + (xGrad - yGrad) * wMag) /*(4)*/
                    : (tmp = Math.abs(yGrad * gradMag)) >= Math.abs(xGrad * seMag + (yGrad - xGrad) * sMag) /*(3)*/
                        && tmp > Math.abs(xGrad * nwMag + (yGrad - xGrad) * nMag) /*(4)*/
            ) 
            {
                magnitude[index] = gradMag >= MAGNITUDE_LIMIT ? MAGNITUDE_MAX : Math.floor(MAGNITUDE_SCALE * gradMag);
                //NOTE: The orientation of the edge is not employed by this
                //implementation. It is a simple matter to compute it at
                //this point as: Math.atan2(yGrad, xGrad);
            } 
            else 
            {
                magnitude[index] = 0;
            }
        }
    }
}

function performHysteresis(data, width, height, magnitude, low, high) 
{
    //NOTE: this implementation reuses the data array to store both
    //luminance data from the image, and edge intensity from the processing.
    //This is done for memory efficiency, other implementations may wish
    //to separate these functions.
    //Arrays.fill(data, 0);
    var offset = 0, i, y, x, size = data.length;
    for (i=0; i<size; i++) data[i] = 0;

    x = 0; y = 0;
    for (offset=0; offset<size; offset++,x++) 
    {
        if ( x >= width ){x=0; y++;}
        if ( 0 === data[offset] && magnitude[offset] >= high ) 
        {
            follow(data, width, height, magnitude, x, y, offset, low);
        }
    }
}

function follow(data, width, height, magnitude, x1, y1, i1, threshold) 
{
    var
        x0 = x1 == 0 ? x1 : x1 - 1,
        x2 = x1 == width - 1 ? x1 : x1 + 1,
        y0 = y1 == 0 ? y1 : y1 - 1,
        y2 = y1 == height -1 ? y1 : y1 + 1,
        x, y, i2
    ;
    
    data[i1] = magnitude[i1];
    x = x0, y = y0;
    while (x <= x2 && y <= y2)
    {
        i2 = x + y * width;
        if ((y != y1 || x != x1)
            && 0 === data[i2]
            && magnitude[i2] >= threshold
        ) 
        {
            follow(data, width, height, magnitude, x, y, i2, threshold);
            return;
        }
        y++; if ( y>y2 ){y=y0; x++;}
    }
}

function thresholdEdges(im, data) 
{
    var i, di, size = im.length, v;
    for (i=0,di=0; i<size; i+=4,di++) 
    {
        v = data[di] > 0 ? 255 : 0;
        im[i] = im[i+1] = im[i+2] = v;
        //im[i+3] = 255;
    }
}

/*function luminance(r, g, b) 
{
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}*/

function readLuminance(im, data) 
{
    var i, di, r, g, b, size = im.length;
    for (i=0,di=0; i<size; i+=4,di++) 
    {
        r = im[i]; g = im[i+1]; b = im[i+2];
        data[di] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);//luminance(r, g, b);
    }
}

function normalizeContrast(data) 
{
    var histogram = new Int32(256),
        i, size = data.length, remap,
        sum, j, k, target;
    for (i=0; i<size; i++) 
    {
        histogram[data[i]]++;
    }
    remap = new Int32(256);
    sum = 0; j = 0;
    for (i = 0; i<256; i++) 
    {
        sum += histogram[i];
        target = sum*255/size;
        for (k = j+1; k <=target; k++) 
        {
            remap[k] = i;
        }
        j = target;
    }
    
    for (i=0; i<size; i++) 
    {
        data[i] = remap[data[i]];
    }
}

// an efficient Canny Edges Detector
// adapted from Java: http://www.tomgibara.com/computer-vision/canny-edge-detector
// http://en.wikipedia.org/wiki/Canny_edge_detector
FILTER.Create({
    name : "CannyEdgesFilter"
    
    ,lowThreshold: 2.5
    ,highThreshold: 7.5
    ,gaussianKernelRadius: 2
    ,gaussianKernelWidth: 16
    ,contrastNormalized: false
    
    ,path: FILTER.getPath( exports.AMD )
    
    ,init: function( lowThreshold, highThreshold, gaussianKernelRadius, gaussianKernelWidth, contrastNormalized ) {
        var self = this;
		self.lowThreshold = arguments.length < 1 ? 2.5 : lowThreshold;
		self.highThreshold = arguments.length < 2 ? 7.5 : highThreshold;
		self.gaussianKernelRadius = arguments.length < 3 ? 2 : gaussianKernelRadius;
		self.gaussianKernelWidth = arguments.length < 4 ? 16 : gaussianKernelWidth;
        self.contrastNormalized = !!contrastNormalized;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 lowThreshold: self.lowThreshold
                ,highThreshold: self.highThreshold
                ,gaussianKernelRadius: self.gaussianKernelRadius
                ,gaussianKernelWidth: self.gaussianKernelWidth
                ,contrastNormalized: self.contrastNormalized
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.lowThreshold = params.lowThreshold;
            self.highThreshold = params.highThreshold;
            self.gaussianKernelRadius = params.gaussianKernelRadius;
            self.gaussianKernelWidth = params.gaussianKernelWidth;
            self.contrastNormalized = params.contrastNormalized;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this, picsize = im.length>>2, 
            low, high, data, magnitude;
        
        // init arrays
        data = new Int32(picsize);
        magnitude = new Int32(picsize);
        low = Math.round( self.lowThreshold * MAGNITUDE_SCALE );
        high = Math.round( self.highThreshold * MAGNITUDE_SCALE );
        
        readLuminance( im, data );
        
        if ( self.contrastNormalized ) normalizeContrast( data );
        
        computeGradients( 
            data, w, h, magnitude, 
            self.gaussianKernelRadius, self.gaussianKernelWidth 
        );
        
        performHysteresis( data, w, h, magnitude, low, high );
        
        thresholdEdges( im, data );
        
        return im;
    }
});
    
}(FILTER);/**
*
* Perlin Noise Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var PROTO = 'prototype';

function Grad( x, y, z ) 
{
    var self = this;
    self.x = x; self.y = y; self.z = z;
}
Grad[PROTO].dot2 = function(x, y) {
    return this.x*x + this.y*y;
};
Grad[PROTO].dot3 = function(x, y, z) {
    return this.x*x + this.y*y + this.z*z;
};

var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
           new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
           new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

var p = [151,160,137,91,90,15,
131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
// To remove the need for index wrapping, double the permutation table length
var perm = new Array(512);
var gradP = new Array(512);

// This isn't a very good seeding function, but it works ok. It supports 2^16
// different seed values. Write something better if you need more seeds.
function seed( seed ) 
{
    if ( seed > 0 && seed < 1 ) 
        // Scale the seed out
        seed *= 65536;

    seed = Math.floor( seed );
    if ( seed < 256 ) seed |= seed << 8;

    for (var i = 0; i < 256; i++) 
    {
        var v;
        if ( i & 1 ) 
        {
            v = p[i] ^ (seed & 255);
        } 
        else 
        {
            v = p[i] ^ ((seed>>8) & 255);
        }

        perm[i] = perm[i + 256] = v;
        gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
}
//seed(0);

// Skewing and unskewing factors for 2, 3, and 4 dimensions
var F2 = 0.5*(Math.sqrt(3)-1),
    G2 = (3-Math.sqrt(3))/6,
    F3 = 1/3,
    G3 = 1/6
;

// 2D simplex noise
function simplex2( xin, yin ) 
{
    var n0, n1, n2; // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin)*F2; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var t = (i+j)*G2;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if ( x0>y0 ) 
    { 
        // lower triangle, XY order: (0,0)->(1,0)->(1,1)
        i1=1; j1=0;
    } 
    else 
    {    
        // upper triangle, YX order: (0,0)->(0,1)->(1,1)
        i1=0; j1=1;
    }
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1 + 2 * G2;
    // Work out the hashed gradient indices of the three simplex corners
    i &= 255; j &= 255;
    var gi0 = gradP[i+perm[j]];
    var gi1 = gradP[i+i1+perm[j+j1]];
    var gi2 = gradP[i+1+perm[j+1]];
    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0*x0-y0*y0;
    if ( t0<0 ) 
    {
        n0 = 0;
    } 
    else 
    {
        t0 *= t0;
        n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.5 - x1*x1-y1*y1;
    if ( t1<0 ) 
    {
        n1 = 0;
    } 
    else 
    {
        t1 *= t1;
        n1 = t1 * t1 * gi1.dot2(x1, y1);
    }
    var t2 = 0.5 - x2*x2-y2*y2;
    if ( t2<0 ) 
    {
        n2 = 0;
    } 
    else 
    {
        t2 *= t2;
        n2 = t2 * t2 * gi2.dot2(x2, y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70 * (n0 + n1 + n2);
}

// ##### Perlin noise stuff

function fade( t ) 
{
    return t*t*t*(t*(t*6-15)+10);
}

function lerp( a, b, t ) 
{
    return (1-t)*a + t*b;
}

// 2D Perlin Noise
function perlin2( x, y ) 
{
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y);
    // Get relative xy coordinates of point within that cell
    x = x - X; y = y - Y;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255;

    // Calculate noise contributions from each of the four corners
    var n00 = gradP[X+perm[Y]].dot2(x, y);
    var n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
    var n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
    var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);

    // Compute the fade curve value for x
    var u = fade(x);

    // Interpolate the four results
    return lerp(
        lerp(n00, n10, u),
        lerp(n01, n11, u),
        fade(y)
    );
}


// an efficient perlin noise and simplex plugin
// adapted from: https://github.com/josephg/noisejs
// Based on example code by Stefan Gustavson (stegu@itn.liu.se).
// Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
// Better rank ordering method by Stefan Gustavson in 2012.
// Converted to Javascript by Joseph Gentle.
// http://en.wikipedia.org/wiki/Perlin_noise
FILTER.Create({
    name: "PerlinNoiseFilter"
    
    // parameters
    ,baseX: 1
    ,baseY: 1
    ,offsetX: 0
    ,offsetY: 0
    ,seed: 0
    ,colors: null
    ,perlin: false
    
    // constructor
    ,init: function( baseX, baseY, offsetX, offsetY, seed, colors, is_perlin ) {
        var self = this;
        self.baseX = baseX || 1;
        self.baseY = baseY || 1;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        self.seed = seed || 0;
        self.colors = colors || null;
        self.perlin = !!is_perlin;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 baseX: self.baseX
                ,baseY: self.baseY
                ,offsetX: self.offsetX
                ,offsetY: self.offsetY
                ,seed: self.seed
                ,colors: self.colors
                ,perlin: self.perlin
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.baseX = params.baseX;
            self.baseY = params.baseY;
            self.offsetX = params.offsetX;
            self.offsetY = params.offsetY;
            self.seed = params.seed;
            self.colors = params.colors;
            self.perlin = params.perlin;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this, baseX = self.baseX, baseY = self.baseY,
            offsetX = self.offsetX, offsetY = self.offsetY,
            colors = self.colors, floor = Math.floor,
            is_grayscale = !colors || !colors.length,
            is_perlin = self.perlin,
            i, l = im.length, x, y, n, c
        ;
        
        seed( self.seed );
        
        i=0; x=0; y=0;
        if ( is_perlin )
        {
            for (i=0; i<l; i+=4, x++)
            {
                if (x>=w) { x=0; y++; }
                n = 0.5*(1+perlin2( ((x+offsetX)%w)/baseX, ((y+offsetY)%h)/baseY ));
                if ( is_grayscale )
                {
                    im[i] = im[i+1] = im[i+2] = ~~(255*n);
                }
                else
                {
                    c = colors[floor(n*(colors.length-1))];
                    im[i] = c[0]; im[i+1] = c[1]; im[i+2] = c[2];
                }
            }
        }
        else
        {
            for (i=0; i<l; i+=4, x++)
            {
                if (x>=w) { x=0; y++; }
                n = 0.5*(1+simplex2( ((x+offsetX)%w)/baseX, ((y+offsetY)%h)/baseY ));
                if ( is_grayscale )
                {
                    im[i] = im[i+1] = im[i+2] = ~~(255*n);
                }
                else
                {
                    c = colors[floor(n*(colors.length-1))];
                    im[i] = c[0]; im[i+1] = c[1]; im[i+2] = c[2];
                }
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);    
    /* main code ends here */
    /* export the module */
    return exports["FILTER_PLUGINS"];
});