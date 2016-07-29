/**
*
*   FILTER.js
*   @version: 0.9.5
*   @built on 2016-07-29 17:32:20
*   @dependencies: Classy.js, Asynchronous.js
*
*   JavaScript Image Processing Library
*   https://github.com/foo123/FILTER.js
*
**/!function( root, name, factory ){
"use strict";
var deps = "Classy,Asynchronous".split(/\s*,\s*/);
function extract(obj,keys,index,load){return obj ? keys.map(function(k, i){return (index ? obj[i] : obj[k]) || (load?load(k):null); }) : [];}
if ( ('object'===typeof module) && module.exports ) /* CommonJS */
    (module.$deps = module.$deps||{}) && (module.exports = module.$deps[name] = factory.apply(root, extract(module.$deps,deps,false,function(k){return require("./"+k.toLowerCase());})));
else if ( ('function'===typeof define)&&define.amd&&('function'===typeof require)&&('function'===typeof require.specified)&&require.specified(name) /*&& !require.defined(name)*/ ) /* AMD */
    define(name,['module'].concat(deps),function(module){factory.moduleUri = module.uri; return factory.apply(root, extract(Array.prototype.slice.call(arguments,1),deps,true));});
else if ( !(name in root) ) /* Browser/WebWorker/.. */
    (root[name]=factory.apply(root, extract(root,deps)))&&('function'===typeof(define))&&define.amd&&define(function(){return root[name];} );
}(  /* current root */          this, 
    /* module name */           "FILTER",
    /* module factory */        function ModuleFactory__FILTER( Classy,Asynchronous ){
/* main code starts here */

/**
*
*   FILTER.js
*   @version: 0.9.5
*   @built on 2016-07-29 17:32:20
*   @dependencies: Classy.js, Asynchronous.js
*
*   JavaScript Image Processing Library
*   https://github.com/foo123/FILTER.js
*
**/
"use strict";
var FILTER = Classy.Merge({ 
    Classy: Classy, Asynchronous: Asynchronous, Path: Asynchronous.path( ModuleFactory__FILTER.moduleUri )
}, Classy); /* make Classy methods accessible as FILTER methods, like FILTER.Class and so on.. */
FILTER.VERSION = "0.9.5";
/**
*
* Filter SuperClass, Interfaces and Utilities
* @package FILTER.js
*
**/
!function(root, FILTER, undef){
"use strict";

// http://jsperf.com/math-floor-vs-math-round-vs-parseint/33

var PROTO = 'prototype', OP = Object[PROTO], FP = Function[PROTO], AP = Array[PROTO]
    
    ,FILTERPath = FILTER.Path, Merge = FILTER.Merge, Async = FILTER.Asynchronous
    
    ,isNode = Async.isPlatform( Async.Platform.NODE ), isBrowser = Async.isPlatform( Async.Platform.BROWSER )
    ,supportsThread = Async.supportsMultiThreading( )
    ,isThread = Async.isThread( null, true )
    ,isInsideThread = Async.isThread( )
    ,userAgent = "undefined" !== typeof navigator && navigator.userAgent ? navigator.userAgent : ""
    ,platform = "undefined" !== typeof navigator && navigator.platform ? navigator.platform : ""
    ,vendor = "undefined" !== typeof navigator && navigator.vendor ? navigator.vendor : ""
    
    ,toStringPlugin = function( ) { return "[FILTER Plugin: " + this.name + "]"; }
    ,applyPlugin = function( im, w, h, image ){ return im; }
    ,initPlugin = function( ) { }
    ,constructorPlugin = function( init ) {
        return function( ) {
            this.$super('constructor');
            init.apply( this, arguments );
        };
    }
    
    ,devicePixelRatio = FILTER.devicePixelRatio = (isBrowser && !isInsideThread ? window.devicePixelRatio : 1) || 1
    
    ,notSupportClamp = FILTER._notSupportClamp = "undefined" === typeof Uint8ClampedArray
    ,no_typed_array_set = ("undefined" === typeof Int16Array) || ("function" !== typeof Int16Array[PROTO].set)
    
    ,TypedArray, log, _uuid = 0
;

//
// Browser Sniffing support
var Browser = FILTER.Browser = {
// http://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
isNode                  : isNode,
isBrowser               : isBrowser,
isWorker                : isThread,
isInsideWorker          : isInsideThread,
supportsWorker          : supportsThread,
isPhantom               : /PhantomJS/.test(userAgent),

// http://www.quirksmode.org/js/detect.html
// http://my.opera.com/community/openweb/idopera/
// http://stackoverflow.com/questions/1998293/how-to-determine-the-opera-browser-using-javascript
isOpera                 : isBrowser && /Opera|OPR\//.test(userAgent),
isFirefox               : isBrowser && /Firefox\//.test(userAgent),
isChrome                : isBrowser && /Chrome\//.test(userAgent),
isSafari                : isBrowser && /Apple Computer/.test(vendor),
isKhtml                 : isBrowser && /KHTML\//.test(userAgent),
// IE 11 replaced the MSIE with Mozilla like gecko string, check for Trident engine also
isIE                    : isBrowser && (/MSIE \d/.test(userAgent) || /Trident\/\d/.test(userAgent)),

// adapted from Codemirror (https://github.com/marijnh/CodeMirror) browser sniffing
isGecko                 : isBrowser && /gecko\/\d/i.test(userAgent),
isWebkit                : isBrowser && /WebKit\//.test(userAgent),
isMac_geLion            : isBrowser && /Mac OS X 1\d\D([7-9]|\d\d)\D/.test(userAgent),
isMac_geMountainLion    : isBrowser && /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent),

isMobile                : false,
isIOS                   : /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent),
isWin                   : /windows/i.test(platform),
isMac                   : false,
isIE_lt8                : false,
isIE_lt9                : false,
isQtWebkit              : false
};
Browser.isMobile = Browser.isIOS || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
Browser.isMac = Browser.isIOS || /Mac/.test(platform);
Browser.isIE_lt8 = Browser.isIE  && !isInsideThread && (null == document.documentMode || document.documentMode < 8);
Browser.isIE_lt9 = Browser.isIE && !isInsideThread && (null == document.documentMode || document.documentMode < 9);
Browser.isQtWebkit = Browser.isWebkit && /Qt\/\d+\.\d+/.test(userAgent);

FILTER.getPath = Async.path;

FILTER.uuid = function( namespace ) { 
    return [namespace||'filter', new Date( ).getTime( ), ++_uuid].join('_'); 
};


//
// Typed Arrays Substitute(s)
FILTER.Array = Array;
FILTER.Array32F = (typeof Float32Array !== "undefined") ? Float32Array : Array;
FILTER.Array64F = (typeof Float64Array !== "undefined") ? Float64Array : Array;
FILTER.Array8I = (typeof Int8Array !== "undefined") ? Int8Array : Array;
FILTER.Array16I = (typeof Int16Array !== "undefined") ? Int16Array : Array;
FILTER.Array32I = (typeof Int32Array !== "undefined") ? Int32Array : Array;
FILTER.Array8U = (typeof Uint8Array !== "undefined") ? Uint8Array : Array;
FILTER.Array16U = (typeof Uint16Array !== "undefined") ? Uint16Array : Array;
FILTER.Array32U = (typeof Uint32Array !== "undefined") ? Uint32Array : Array;
FILTER.ImArray = notSupportClamp ? FILTER.Array8U : Uint8ClampedArray;
// opera seems to have a bug which copies Uint8ClampedArrays by reference instead by value (eg. as Firefox and Chrome)
// however Uint8 arrays are copied by value, so use that instead for doing fast copies of image arrays
FILTER.ImArrayCopy = Browser.isOpera ? FILTER.Array8U : FILTER.ImArray;
FILTER.ColorTable = FILTER.ImArrayCopy;
FILTER.ColorMatrix = FILTER.Array32F;
FILTER.ConvolutionMatrix = FILTER.Array32F;

//
// Constants
FILTER.CHANNEL = {
    R: 0, G: 1, B: 2, A: 3,
    RED: 0, GREEN: 1, BLUE: 2, ALPHA: 3,
    Y: 1, CB: 2, CR: 0,
    H: 0, S: 1, V: 2, I: 2,
    HUE: 0, SATURATION: 1, INTENSITY: 2
};
FILTER.MODE = {
    IGNORE: 0, WRAP: 1, CLAMP: 2,
    COLOR: 3, TILE: 4, STRETCH: 5,
    INTENSITY: 6, HUE: 7, SATURATION: 8,
    GRAY: 9, RGB: 10, HSV: 11
};
FILTER.LUMA = new FILTER.Array32F([
    0.212671, 0.71516, 0.072169
]);
FILTER.FORMAT = {
    IMAGE: 1024, DATA: 2048,
    PNG: 2, JPG: 3, JPEG: 4,
    GIF: 5, BMP: 6, TGA: 7, RGBE: 8
};
FILTER.MIME = {
     PNG    : "image/png"
    ,JPG    : "image/jpeg"
    ,JPEG   : "image/jpeg"
    ,GIF    : "image/gif"
    ,BMP    : "image/bmp"
};
FILTER.CONSTANTS = FILTER.CONST = {
     X: 0, Y: 1, Z: 2
    
    ,PI: Math.PI, PI2: 2*Math.PI, PI_2: Math.PI/2
    ,toRad: Math.PI/180, toDeg: 180/Math.PI
    
    ,SQRT2: Math.SQRT2
    ,LN2: Math.LN2
};

// packages
FILTER.IO = { };
FILTER.Codec = { };
FILTER.Interpolation = { };
FILTER.Transform = { };
FILTER.MachineLearning = FILTER.ML = { };
// utilities
FILTER.Util = {
    Math    : { },
    Array   : {
        arrayset: no_typed_array_set
            ? function( a, b, offset ) {
                offset = offset || 0;
                for(var i=0,n=b.length; i<n; i++) a[ i + offset ] = b[ i ];
            }
            : function( a, b, offset ){ a.set(b, offset||0); }

        ,subarray: !FILTER.Array32F[PROTO].subarray
            ? function( a, i1, i2 ){ return a.slice(i1, i2); }
            : function( a, i1, i2 ){ return a.subarray(i1, i2); }
        ,typed: TypedArray = (isNode
            ? function( a, A ) {
                if ( (null == a) || (a instanceof A) ) return a;
                else if ( Array.isArray( a ) ) return Array === A ? a : new A( a );
                if ( null == a.length ) a.length = Object.keys( a ).length;
                return Array === A ? Array.prototype.slice.call( a ) : new A( Array.prototype.slice.call( a ) );
            }
            : function( a, A ) { return a; })
        ,typed_obj: isNode
            ? function( o, unserialise ) { return null == o ? o : (unserialise ? JSON.parse( o ) : JSON.stringify( o )); }
            : function( o ) { return o; }
    },
    String  : { },
    IO      : { },
    Filter  : { },
    Image   : { }
};

// IE still does not support Uint8ClampedArray and some methods on it, add the method "set"
/*if ( notSupportClamp && ("undefined" !== typeof CanvasPixelArray) && ("function" !== CanvasPixelArray[PROTO].set) )
{
    // add the missing method to the array
    CanvasPixelArray[PROTO].set = typed_array_set;
}*/
notSupportClamp = FILTER._notSupportClamp = notSupportClamp || Browser.isOpera;

FILTER.NotImplemented = function( method ) {
    method = method || '';
    return function( ) { throw new Error('Method '+method+' not Implemented!'); };
};

//
// webgl support
FILTER.useWebGL = false;
FILTER.useWebGLSharedResources = false;
FILTER.useWebGLIfAvailable = function( bool ) { /* do nothing, override */  };
FILTER.useWebGLSharedResourcesIfAvailable = function( bool ) { /* do nothing, override */  };

//
// logging
log = FILTER.log = isThread ? Async.log : (("undefine" !== typeof console) && console.log ? function( s ) { console.log(s); } : function( s ) { /* do nothing*/ });
FILTER.warning = function( s ) { log( 'WARNING: ' + s ); }; 
FILTER.error = function( s, throwErr ) { log( 'ERROR: ' + s ); if ( throwErr ) throw new Error(s); };

var 
    //
    // Thread Filter Interface (internal)
    FilterThread = FILTER.FilterThread = FILTER.Class( Async, {
        
         path: FILTERPath
        ,name: null
        ,_listener: null
        
        ,constructor: function( ) {
            var self = this, filter = null;
            if ( isThread )
            {
                self.initThread( )
                    .listen('load', function( data ) {
                        if ( data && data.filter )
                        {
                            if ( filter ) 
                            {
                                filter.dispose( true );
                                filter = null;
                            }
                            filter = Async.load( 'FILTER.' + data.filter/*, data["import"] || data["imports"]*/ );
                        }
                    })
                    .listen('import', function( data ) {
                        if ( data && data["import"] && data["import"].length )
                        {
                            Async.importScripts( data["import"].join ? data["import"].join(',') : data["import"] );
                        }
                    })
                    .listen('params', function( data ) {
                        if ( filter ) filter.unserialize( data );
                    })
                    .listen('apply', function( data ) {
                        if ( filter && data && data.im )
                        {
                            if ( data.params ) filter.unserialize( data.params );
                            //log(data.im[0]);
                            var im = TypedArray( data.im[ 0 ], FILTER.ImArray );
                            // pass any filter metadata if needed
                            im = filter._apply( im, data.im[ 1 ], data.im[ 2 ] );
                            self.send( 'apply', {im: filter._update ? im : false, meta: filter.hasMeta ? filter.getMeta() : null} );
                        }
                        else
                        {
                            self.send( 'apply', {im: null} );
                        }
                    })
                    .listen('dispose', function( data ) {
                        if ( filter ) 
                        {
                            filter.dispose( true );
                            filter = null;
                        }
                        self.dispose( true );
                        //Async.close( );
                    })
                ;
            }
        }
        
        ,dispose: function( explicit ) {
            var self = this;
            self.path = null;
            self.name = null;
            if ( self._listener )
            {
                self._listener.cb = null;
                self._listener = null;
            }
            self.$super('dispose', explicit);
            return self;
        }
        
        // activate or de-activate thread/worker filter
        ,thread: function( enable, imports ) {
            var self = this;
            if ( !arguments.length ) enable = true;
            enable = !!enable;
            // activate worker
            if ( enable && !self.$thread ) 
            {
                self.fork( 'FILTER.FilterThread', FILTERPath.file !== self.path.file ? [ FILTERPath.file, self.path.file ] : self.path.file );
                if ( imports && imports.length )
                    self.send('import', {'import': imports.join ? imports.join(',') : imports});
                self.send('load', {filter: self.name});
                self.listen( 'apply', self._listener=function l( data ) { l.cb && l.cb( data ); } );
            }
            // de-activate worker (if was activated before)
            else if ( !enable && self.$thread )
            {
                self._listener.cb = null;
                self._listener = null;
                self.unfork( );
            }
            return self;
        }
        
        ,sources: function( ) {
            if ( !arguments.length ) return this;
            var sources = arguments[0] instanceof Array ? arguments[0] : AP.slice.call( arguments );
            if ( sources.length )
            {
                var blobs = [ ], i;
                for (i=0; i<sources.length; i++)
                {
                    if ( 'function' === typeof( sources[ i ] ) )
                        blobs.push( Async.blob( sources[ i ].toString( ) ) );
                    else
                        blobs.push( Async.blob( sources[ i ] ) );
                }
                this.send('import', {'import': blobs.join( ',' )});
            }
            return this;
        }
        
        ,scripts: function( ) {
            if ( !arguments.length ) return this;
            var scripts = arguments[0] instanceof Array ? arguments[0] : AP.slice.call( arguments );
            if ( scripts.length ) this.send('import', {'import': scripts.join( ',' )});
            return this;
        }
    }),
    
    //
    // Abstract Generic Filter (implements Async Worker/Thread Interface transparently)
    Filter = FILTER.Filter = FILTER.Class( FilterThread, {
        name: "Filter"
        
        ,constructor: function( ) {
            //var self = this;
            //self.$super('constructor', 100, false);
        }
        
        // filters can have id's
        ,id: null
        ,_isOn: true
        ,_update: true
        ,_onComplete: null
        ,hasMeta: false
        
        ,dispose: function( ) {
            var self = this;
            self.$super('dispose');
            self.name = null;
            self.id = null;
            self._isOn = null;
            self._update = null;
            self._onComplete = null;
            self.hasMeta = null;
            return self;
        }
        
        // alias of thread method
        ,worker: FilterThread[PROTO].thread
        
        
        // @override
        ,serialize: function( ) {
            var self = this;
            return { filter: self.name, _isOn: !!self._isOn, params: {} };
        }
        
        // @override
        ,unserialize: function( json ) {
            var self = this;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
            }
            return self;
        }
        
        ,complete: function( f ) {
            this._onComplete = f || null;
            return this;
        }
        
        // whether filter is ON
        ,isOn: function( ) {
            return this._isOn;
        }
        
        // whether filter updates output image or not
        ,update: function( bool ) {
            if ( !arguments.length ) bool = true;
            this._update = !!bool;
            return this;
        }
        
        // allow filters to be turned ON/OFF
        ,turnOn: function( bool ) {
            if ( !arguments.length ) bool = true;
            this._isOn = !!bool;
            return this;
        }
        
        // toggle ON/OFF state
        ,toggle: function( ) {
            this._isOn = !this._isOn;
            return this;
        }
        
        // @override
        ,reset: function( ) {
            return this;
        }
        
        // @override
        ,canRun: function( ) {
            return this._isOn;
        }
        
        // @override
        ,getMeta: function( ) {
        }
        
        // @override
        ,setMeta: function( meta ) {
            return this;
        }
        
        // @override
        ,combineWith: function( filter ) {
            return this;
        }
        
        // @override
        // for internal use, each filter overrides this
        ,_apply: function( im, w, h, image ) { 
            /* do nothing here, override */
            return im;
        }
        
        // generic apply a filter from an image (src) to another image (dest)
        // with optional callback (cb)
        ,apply: function( src, dst, cb ) {
            var self = this, im, im2;
            
            if ( !self.canRun( ) ) return src;
            
            if ( arguments.length < 3 )
            {
                if ( dst && dst.setSelectedData ) 
                {
                    // dest is an image and no callback
                    cb = null;
                }
                else if ( 'function' === typeof dst )
                {
                    // dst is callback, dst is same as src
                    cb = dst;
                    dst = src;
                }
                else
                {
                    dst = src;
                    cb = null;
                }
            }
            
            if ( src && dst )
            {
                cb = cb || self._onComplete;
                im = src.getSelectedData( );
                if ( self.$thread )
                {
                    self._listener.cb = function( data ) { 
                        //self.unlisten( 'apply' );
                        self._listener.cb = null;
                        if ( data ) 
                        {
                            // listen for metadata if needed
                            //if ( null != data.update ) self._update = !!data.update;
                            if ( data.meta ) self.setMeta( data.meta );
                            if ( data.im/*self._update*/ ) dst.setSelectedData( TypedArray( data.im, FILTER.ImArray ) );
                        }
                        if ( cb ) cb.call( self );
                    };
                    // process request
                    self.send( 'apply', {im: im, /*id: src.id,*/ params: self.serialize( )} );
                }
                else
                {
                    im2 = self._apply( im[ 0 ], im[ 1 ], im[ 2 ], src );
                    // update image only if needed
                    // some filters do not actually change the image data
                    // but instead process information from the data,
                    // no need to update in such a case
                    if ( self._update ) dst.setSelectedData( im2 );
                    if ( cb ) cb.call( self );
                }
            }
            return src;
        }
        
        ,toString: function( ) {
            return "[FILTER: " + this.name + "]";
        }
    })
;

//
// filter plugin creation micro-framework
FILTER.Create = function( methods ) {
    methods = Merge({
             init: initPlugin
            ,name: "PluginFilter"
            ,toString: toStringPlugin
            ,apply: applyPlugin
    }, methods);
    methods.constructor = constructorPlugin( methods.init );
    methods._apply = methods.apply;
    delete methods.init; delete methods.apply;
    var filterName = methods.name;
    return FILTER[filterName] = FILTER.Class( Filter, methods );
};

}(this, FILTER);/**
*
* Filter Core Utils (Filter, Image, Math, Geometry)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var IMG = FILTER.ImArray, IMGcpy = FILTER.ImArrayCopy,
    A32F = FILTER.Array32F, A64F = FILTER.Array64F,
    A16I = FILTER.Array16I, A8U = FILTER.Array8U,
    ColorTable = FILTER.ColorTable, ColorMatrix = FILTER.ColorMatrix, //ConvolutionMatrix = FILTER.ConvolutionMatrix,
    MathUtil = FILTER.Util.Math, StringUtil = FILTER.Util.String,
    ImageUtil = FILTER.Util.Image, FilterUtil = FILTER.Util.Filter,
    Sqrt = Math.sqrt, Pow = Math.pow, Ceil = Math.ceil,
    Log = Math.log, Sin = Math.sin, Cos = Math.cos,
    Min = Math.min, Max = Math.max, Abs = Math.abs,
    PI = Math.PI, PI2 = PI+PI, PI_2 = 0.5*PI, 
    pi = PI, pi2 = PI2, pi_2 = PI_2, pi_32 = 3*pi_2,
    Log2 = Math.log2 || function( x ) { return Log(x) / Math.LN2; },
    arrayset = FILTER.Util.Array.arrayset, subarray = FILTER.Util.Array.subarray,
    MODE = FILTER.MODE, notSupportClamp = FILTER._notSupportClamp,
    esc_re = /([.*+?^${}()|\[\]\/\\\-])/g, trim_re = /^\s+|\s+$/g
;

function clamp( x, m, M )
{ 
    return x > M ? M : (x < m ? m : x); 
}

function closest_power_of_two( x )
{ 
    return Pow( 2, Ceil( Log2(x) ) ); 
}

function point2( x, y )
{
    var p = new A32F( 2 );
    p[0] = x||0.0; p[1] = y||0.0;
    return p;
}

function point3( x, y, z )
{
    var p = new A32F( 3 );
    p[0] = x||0.0; p[1] = y||0.0; p[2] = z||0.0;
    return p;
}

function interpolate2( p0, p1, t ) 
{
    return point2( p0[0]+t*(p1[0]-p0[0]), p0[1]+t*(p1[1]-p0[1]) );
}

function interpolate3( p0, p1, t ) 
{
    return point3( p0[0]+t*(p1[0]-p0[0]), p0[1]+t*(p1[1]-p0[1]), p0[2]+t*(p1[2]-p0[2]) );
}

function cross2( p0, p1 )
{ 
    return p0[0]*p1[1] - p1[0]*p0[1]; 
}

function enorm2( x, y ) 
{
    // avoid oveflows
    var t;
    if ( 0 > x ) x = -x;
    if ( 0 > y ) y = -y;
    if ( 0 === x )  
    {
        return y;
    }
    else if ( 0 === y )  
    {
        return x;
    }
    else if ( x > y ) 
    {
        t = y / x;  
        return x *Sqrt( 1.0 + t*t ); 
    }
    else 
    { 
        t = x / y;
        return y * Sqrt( 1.0 + t*t ); 
    }
}

function normal2( p1, p0 ) 
{
    var d, n, lamda, normallamda, l;

    d = point2( p1[0]-p0[0], p1[1]-p0[1] );
    
    if ( 0 === d[1] && 0 === d[0] )  // same point infinite normals
    {
        return null;
    }
    
    n = point2( 0, 0 );
    
    if ( 0 === d[0] ) // lamda=Inf
    {
        n[0] = 10;
    }
    if ( 0 === d[1] )  // normallamda=Inf
    {
        n[1] = 10;
    }
    
    if ( 0 !== d[1] && 0 !== d[0] )
    {
        lamda = d[1] / d[0];
        normallamda = -d[0] / d[1];
        n[0] = 10;
        n[1] = normallamda*n[0];
    }
    
    // normalize
    l = enorm2( n[0], n[1] );
    n[0] /= l; n[1] /= l;
    if ( 0 > cross2( d, n ) )
    {
        n[0] = -n[0];
        n[1] = -n[1];
    }
    return n;
}

function crop( im, w, h, x1, y1, x2, y2 )
{
    x2 = Min(x2, w-1); y2 = Min(y2, h-1);
    var nw = x2-x1+1, nh = y2-y1+1, 
        croppedSize = (nw*nh)<<2, cropped = new IMG(croppedSize), 
        y, yw, nw4 = nw<<2, pixel, pixel2;

    for (y=y1,yw=y1*w,pixel=0; y<=y2; y++,yw+=w,pixel+=nw4)
    {
        pixel2 = (yw+x1)<<2;
        arrayset(cropped, subarray(im, pixel2, pixel2+nw4), pixel);
    }
    return cropped;
}

function pad( im, w, h, pad_right, pad_bot, pad_left, pad_top )
{
    pad_right = pad_right || 0; pad_bot = pad_bot || 0;
    pad_left = pad_left || 0; pad_top = pad_top || 0;
    var nw = w+pad_left+pad_right, nh = h+pad_top+pad_bot, 
        paddedSize = (nw*nh)<<2, padded = new IMG(paddedSize), 
        y, yw, w4 = w<<2, nw4 = nw<<2, pixel, pixel2,
        offtop = pad_top*nw4, offleft = pad_left<<2;

    for (y=0,yw=0,pixel=offtop; y<h; y++,yw+=w,pixel+=nw4)
    {
        pixel2 = yw<<2;
        arrayset(padded, subarray(im, pixel2, pixel2+w4), offleft+pixel);
    }
    return padded;
}

function get_data( D, W, H, x0, y0, x1, y1, orig )
{
    x0 = Min(x0, W-1); y0 = Min(y0, H-1);
    x1 = Min(x1, W-1); y1 = Min(y1, H-1);
    if ( (0 === x0) && (0 === y0) && (W === x1+1) && (H === y1+1) ) return true === orig ? D : new IMGcpy( D );
    if ( !D.length || (x1 < x0) || (y1 < y0) ) return new IMG(0);
    var x, y, i, I, w = x1-x0+1, h = y1-y0+1, size = (w*h) << 2, d = new IMG(size);
    for(x=x0,y=y0,i=0; y<=y1; i+=4,x++)
    {
        if ( x>x1 ){ x=x0; y++; }
        I = (y*W + x) << 2;
        d[i  ] = D[I  ];
        d[i+1] = D[I+1];
        d[i+2] = D[I+2];
        d[i+3] = D[I+3];
    }
    return d;
}

function set_data( D, W, H, d, w, h, x0, y0, x1, y1, X0, Y0 )
{
    var i, I, x, y;
    if ( !D.length || !d.length || !w || !h || !W || !H ) return D;
    x0 = Min(x0, w-1); y0 = Min(y0, h-1);
    X0 = Min(X0, W-1); Y0 = Min(Y0, H-1);
    x1 = Min(x1, w-1); y1 = Min(y1, h-1);
    X0 -= x0; Y0 -= y0;
    for(x=x0,y=y0; y<=y1; x++)
    {
        if ( x>x1 ) { x=x0; y++; }
        if ( (y+Y0 >= H) || (x+X0 >= W) ) continue;
        i = (y*w + x) << 2;
        I = ((y+Y0)*W + x+X0) << 2;
        D[I  ] = d[i  ];
        D[I+1] = d[i+1];
        D[I+2] = d[i+2];
        D[I+3] = d[i+3];
    }
    return D;
}

function fill_data( D, W, H, c, x0, y0, x1, y1 )
{
    x0 = Min(x0, W-1); y0 = Min(y0, H-1);
    x1 = Min(x1, W-1); y1 = Min(y1, H-1);
    if ( !D.length || (x1 < x0) || (y1 < y0) ) return D;
    var x, y, i, r = c[0] & 255, g = c[1] & 255, b = c[2] & 255, a = 3 < c.length ? c[3] & 255 : 255;
    for(x=x0,y=y0; y<=y1; x++)
    {
        if ( x>x1 ) { x=x0; y++; }
        i = (y*W + x) << 2;
        D[i  ] = r;
        D[i+1] = g;
        D[i+2] = b;
        D[i+3] = a;
    }
    return D;
}

function generic_transform( im, w, h, T, mode )
{
    var x, y, i, j, imLen=im.length, dst=new IMG(imLen), t, tx, ty,
        CLAMP = MODE.CLAMP, WRAP = MODE.WRAP;
    mode = mode || CLAMP;

    x=0; y=0;
    for (i=0; i<imLen; i+=4, x++)
    {
        if (x>=w) { x=0; y++; }
        
        t = T([x, y], w, h); tx = ~~(t[0]); ty = ~~(t[1]);
        if ( 0>tx || tx>=w || 0>ty || ty>=h )
        {
            if ( WRAP === mode )
            {
                if ( ty >= h ) ty -= h;
                else if ( ty < 0 ) ty += h;
                if ( tx >= w ) tx -= w;
                else if ( tx < 0 )  tx += w;
            }
            else //if ( CLAMP === mode )
            {
                if ( ty >= h )  ty = h-1;
                else if ( ty < 0 ) ty = 0;
                if ( tx >= w ) tx = w-1;
                else if ( tx < 0 ) tx = 0;
            }
        }
        j = (tx + ty*w) << 2;
        dst[i] = im[j];   dst[i+1] = im[j+1];
        dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
    }
    return dst;
}
function affine_transform( im, w, h, a, b, c, d, tx, ty, mode )
{
    var x, y, yw, i, j, imLen=im.length, imArea=imLen>>>2, dst=new IMG(imLen),
        tyw, cw, dw, CLAMP = MODE.CLAMP, WRAP = MODE.WRAP, nx, ny, bx=w-1, by=imArea-w
    ;
    mode = mode || CLAMP;
    
    x=0; y=0; tyw=ty*w; cw=c*w; dw=d*w;
    for (i=0; i<imLen; i+=4,x++)
    {
        if (x>=w) { x=0; y++; }
        
        nx = ~~(a*x + b*y + tx); ny = ~~(cw*x + dw*y + tyw);
        if ( 0>nx || nx>bx || 0>ny || ny>by )
        {
            if ( WRAP === mode )
            {
                if ( ny > by ) ny -= imArea;
                else if ( ny < 0 ) ny += imArea;
                if ( nx >= w ) nx -= w;
                else if ( nx < 0 )  nx += w;
            }
            else //if ( CLAMP === mode )
            {
                if ( ny > by )  ny = by;
                else if ( ny < 0 ) ny = 0;
                if ( nx > bx ) nx = bx;
                else if ( nx < 0 ) nx = 0;
            }
        }
        j = (nx + ny) << 2;
        dst[i] = im[j];   dst[i+1] = im[j+1];
        dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
    }
    return dst;
}
function cyclic_shift( im, w, h, dx, dy )
{
    var x, y, yw, i, j, l = im.length, dst = new IMG(l);
    
    if ( dx < 0 ) dx += w;
    if ( dy < 0 ) dy += h;
    
    x=0; y=0; yw=0;
    for (i=0; i<l; i+=4, x++)
    {
        if (x>=w) { x=0; y++; yw+=w; }
        
        j = ( (x+dx) % w + ((y+dy) % h) * w ) << 2;
        dst[i] = im[j];   dst[i+1] = im[j+1];
        dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
    }
    return dst;
}
function flip_x( im, w, h )
{
    var x, y, yw, i, j, l = im.length, dst = new IMG(l);
    
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
function flip_y( im, w, h )
{
    var x, y, yw2, i, j, l = im.length, dst = new IMG(l);
    
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
function flip_xy( im, w, h )
{
    var x, y, yw, yw2, i, j, l = im.length, dst = new IMG(l);
    
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
/*
// adapted from http://www.jhlabs.com/ip/filters/
function polar_transform( im, w, h, mode )
{
    var x, y, i, j, imLen=im.length, imcopy=new IMGcpy(im),
        tx, ty, ix, iy, ip, bx = w-1, by = h-1, theta, r=0, radius, cX, cY,
        CLAMP = MODE.CLAMP, WRAP = MODE.WRAP;
    mode = mode || CLAMP;
    
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
        ix = Round(ix); iy = Round(iy);
        if (0>ix || ix>bx || 0>iy || iy>by)
        {
            switch(mode)
            {
                case WRAP:
                    if (iy>by) iy-=h;
                    else if (iy<0) iy+=h;
                    if (ix>bx) ix-=w;
                    else if (ix<0)  ix+=w;
                    break;
                    
                case CLAMP:
                default:
                    if (iy>by)  iy=by;
                    else if (iy<0) iy=0;
                    if (ix>bx) ix=bx;
                    else if (ix<0) ix=0;
                    break;
            }
        }
        ip = ( ix + iy*w ) << 2;
        im[i] = imcopy[ ip ];
        im[i+1] = imcopy[ ip+1 ];
        im[i+2] = imcopy[ ip+2 ];
        im[i+3] = imcopy[ ip+3 ];
    }
    return im;
}
function cartesian( im, w, h, mode )
{
    var x, y, i, j, imLen=im.length, imcopy=new IMGcpy(im),
        ix, iy, ip, nx, ny, bx = w-1, by = h-1, 
        theta, theta2, r=0, radius, cX, cY, 
        CLAMP = MODE.CLAMP, WRAP = MODE.WRAP;
    mode = mode || CLAMP;
    
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
        ix = Round(ix); iy = Round(iy);
        if (0>ix || ix>bx || 0>iy || iy>by)
        {
            switch(mode)
            {
                case WRAP:
                    if (iy>by) iy-=h;
                    else if (iy<0) iy+=h;
                    if (ix>bx) ix-=w;
                    else if (ix<0)  ix+=w;
                    break;
                    
                case CLAMP:
                default:
                    if (iy>by)  iy=by;
                    else if (iy<0) iy=0;
                    if (ix>bx) ix=bx;
                    else if (ix<0) ix=0;
                    break;
            }
        }
        ip = ( ix + iy*w ) << 2;
        im[i] = imcopy[ ip ];
        im[i+1] = imcopy[ ip+1 ];
        im[i+2] = imcopy[ ip+2 ];
        im[i+3] = imcopy[ ip+3 ];
    }
    return im;
}*/

// compute integral image (Summed Area Table, SAT) (for a given channel)
function integral( im, w, h, channel ) 
{
    var rowLen = w<<2, integ, sum,
        imLen = im.length, count = imLen>>2, i, j, x
    ;
    // compute integral of image in one pass
    channel = channel || 0;
    integ = new A32F(count); 
    // first row
    for (x=0,j=0,i=0,sum=0; x<w; x++, i+=4, j++)
    {
        sum+=im[i+channel]; integ[j]=sum; 
    }
    // other rows
    for (x=0,j=0,sum=0,i=rowLen; i<imLen; i+=4, j++, x++)
    {
        if ( x >=w ) { x=0; sum=0; }
        sum+=im[i+channel]; integ[j+w]=integ[j]+sum; 
    }
    return integ;
}

// compute image histogram (for a given channel)
function histogram( im, w, h, channel ) 
{
    var i, l = im.length, cdf, accum, n = 1.0 / (l>>2);
    
    // initialize the arrays
    channel = channel || 0;
    cdf = new A32F( 256 ); 
    /*for (i=0; i<256; i+=32) 
    { 
        // partial loop unrolling
        cdf[i   ]=0;
        cdf[i+1 ]=0;
        cdf[i+2 ]=0;
        cdf[i+3 ]=0;
        cdf[i+4 ]=0;
        cdf[i+5 ]=0;
        cdf[i+6 ]=0;
        cdf[i+7 ]=0;
        cdf[i+8 ]=0;
        cdf[i+9 ]=0;
        cdf[i+10]=0;
        cdf[i+11]=0;
        cdf[i+12]=0;
        cdf[i+13]=0;
        cdf[i+14]=0;
        cdf[i+15]=0;
        cdf[i+16]=0;
        cdf[i+17]=0;
        cdf[i+18]=0;
        cdf[i+19]=0;
        cdf[i+20]=0;
        cdf[i+21]=0;
        cdf[i+22]=0;
        cdf[i+23]=0;
        cdf[i+24]=0;
        cdf[i+25]=0;
        cdf[i+26]=0;
        cdf[i+27]=0;
        cdf[i+28]=0;
        cdf[i+29]=0;
        cdf[i+30]=0;
        cdf[i+31]=0;
    }*/
    // compute pdf and maxima/minima
    for (i=0; i<l; i+=4)
    {
        cdf[ im[i+channel] ] += n;
    }
    
    // compute cdf
    for (accum=0,i=0; i<256; i+=32) 
    { 
        // partial loop unrolling
        accum += cdf[i   ]; cdf[i   ] = accum;
        accum += cdf[i+1 ]; cdf[i+1 ] = accum;
        accum += cdf[i+2 ]; cdf[i+2 ] = accum;
        accum += cdf[i+3 ]; cdf[i+3 ] = accum;
        accum += cdf[i+4 ]; cdf[i+4 ] = accum;
        accum += cdf[i+5 ]; cdf[i+5 ] = accum;
        accum += cdf[i+6 ]; cdf[i+6 ] = accum;
        accum += cdf[i+7 ]; cdf[i+7 ] = accum;
        accum += cdf[i+8 ]; cdf[i+8 ] = accum;
        accum += cdf[i+9 ]; cdf[i+9 ] = accum;
        accum += cdf[i+10]; cdf[i+10] = accum;
        accum += cdf[i+11]; cdf[i+11] = accum;
        accum += cdf[i+12]; cdf[i+12] = accum;
        accum += cdf[i+13]; cdf[i+13] = accum;
        accum += cdf[i+14]; cdf[i+14] = accum;
        accum += cdf[i+15]; cdf[i+15] = accum;
        accum += cdf[i+16]; cdf[i+16] = accum;
        accum += cdf[i+17]; cdf[i+17] = accum;
        accum += cdf[i+18]; cdf[i+18] = accum;
        accum += cdf[i+19]; cdf[i+19] = accum;
        accum += cdf[i+20]; cdf[i+20] = accum;
        accum += cdf[i+21]; cdf[i+21] = accum;
        accum += cdf[i+22]; cdf[i+22] = accum;
        accum += cdf[i+23]; cdf[i+23] = accum;
        accum += cdf[i+24]; cdf[i+24] = accum;
        accum += cdf[i+25]; cdf[i+25] = accum;
        accum += cdf[i+26]; cdf[i+26] = accum;
        accum += cdf[i+27]; cdf[i+27] = accum;
        accum += cdf[i+28]; cdf[i+28] = accum;
        accum += cdf[i+29]; cdf[i+29] = accum;
        accum += cdf[i+30]; cdf[i+30] = accum;
        accum += cdf[i+31]; cdf[i+31] = accum;
    }
    return cdf;
}

function spectrum( im, w, h, channel ) 
{
    // TODO
    return null;
}

// speed-up convolution for special kernels like moving-average
function integral_convolution_rgb(rgba, im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats) 
{
    var imLen=im.length, imArea=(imLen>>2), integral, integralLen, colR, colG, colB,
        matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2,
        r, g, b, r2, g2, b2, repeat, tmp
    ;
    
    // convolution speed-up based on the integral image concept and symmetric / separable kernels
    
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    matArea = matRadiusX*matRadiusY;
    matHalfSideX = matRadiusX>>1;  matHalfSideY = w*(matRadiusY>>1);
    // one additional offest needed due to integral computation
    matOffsetLeft = -matHalfSideX-1; matOffsetTop = -matHalfSideY-w;
    matOffsetRight = matHalfSideX; matOffsetBottom = matHalfSideY;
    bx1 = 0; bx2 = w-1; by1 = 0; by2 = imArea-w;
    
    integralLen = (imArea<<1)+imArea;  rowLen = (w<<1)+w;
    dst = im; im = new IMG(imLen); integral = new A32F(integralLen);
    
    numRepeats = numRepeats||1;
    
    if (matrix2) // allow to compute a second matrix in-parallel
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
        wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>1]; centerOffset2 = wtCenter2-wt2;
        
        // do this multiple times??
        for(repeat=0; repeat<numRepeats; repeat++)
        {
            //dst = new IMG(imLen); integral = new A32F(integralLen);
            tmp = im; im = dst; dst = tmp;

            // compute integral of image in one pass
            
            // first row
            i=0; j=0; colR=colG=colB=0;
            for (x=0; x<w; x++, i+=4, j+=3)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
            }
            // other rows
            j=0; x=0; colR=colG=colB=0;
            for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=0; }
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j+rowLen]=integral[j]+colR; 
                integral[j+rowLen+1]=integral[j+1]+colG; 
                integral[j+rowLen+2]=integral[j+2]+colB;
            }
            
            
            // now can compute any symmetric convolution kernel in constant time 
            // depending only on image dimensions, regardless of matrix radius
            
            // do direct convolution
            x=0; y=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; y++; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;
                
                // fix borders
                 xOff1 = xOff1<bx1 ? bx1 : xOff1;
                 xOff2 = xOff2>bx2 ? bx2 : xOff2;
                 yOff1 = yOff1<by1 ? by1 : yOff1;
                 yOff2 = yOff2>by2 ? by2 : yOff2;
                
                // compute integral positions
                p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                // arguably faster way to write p1*=3; etc..
                p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                
                // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                // also fix the center element (in case it is different)
                r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                
                r2 = wt2 * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset2 * im[i  ]);
                g2 = wt2 * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset2 * im[i+1]);
                b2 = wt2 * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset2 * im[i+2]);
                
                // output
                t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            
            // do another pass??
        }
    }
    else
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
    
        // do this multiple times??
        for(repeat=0; repeat<numRepeats; repeat++)
        {
            //dst = new IMG(imLen); integral = new A32F(integralLen);
            tmp = im; im = dst; dst = tmp;
            
            // compute integral of image in one pass
            
            // first row
            i=0; j=0; colR=colG=colB=0;
            for (x=0; x<w; x++, i+=4, j+=3)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
            }
            // other rows
            j=0; x=0; colR=colG=colB=0;
            for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=0; }
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j+rowLen  ]=integral[j  ]+colR; 
                integral[j+rowLen+1]=integral[j+1]+colG; 
                integral[j+rowLen+2]=integral[j+2]+colB;
            }
            
            // now can compute any symmetric convolution kernel in constant time 
            // depending only on image dimensions, regardless of matrix radius
            
            // do direct convolution
            x=0; y=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; y++; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;
                
                // fix borders
                 xOff1 = xOff1<bx1 ? bx1 : xOff1;
                 xOff2 = xOff2>bx2 ? bx2 : xOff2;
                 yOff1 = yOff1<by1 ? by1 : yOff1;
                 yOff2 = yOff2>by2 ? by2 : yOff2;
                
                // compute integral positions
                p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                // arguably faster way to write p1*=3; etc..
                p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                
                // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                // also fix the center element (in case it is different)
                r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                
                // output
                t0 = coeff1*r + coeff2;  t1 = coeff1*g + coeff2;  t2 = coeff1*b + coeff2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            
            // do another pass??
        }
    }
    return dst;
}
/*function integral_convolution_rgba(rgba, im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats) 
{
    var imLen=im.length, imArea=(imLen>>2), integral, integralLen, colR, colG, colB, colA,
        matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2, t3,
        r, g, b, a, r2, g2, b2, a2, repeat, tmp
    ;
    
    // convolution speed-up based on the integral image concept and symmetric / separable kernels
    
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    matArea = matRadiusX*matRadiusY;
    matHalfSideX = matRadiusX>>1;  matHalfSideY = w*(matRadiusY>>1);
    // one additional offest needed due to integral computation
    matOffsetLeft = -matHalfSideX-1; matOffsetTop = -matHalfSideY-w;
    matOffsetRight = matHalfSideX; matOffsetBottom = matHalfSideY;
    bx1 = 0; bx2 = w-1; by1 = 0; by2 = imArea-w;
    
    integralLen = imLen;  rowLen = w<<2;
    dst = im; im = new IMG(imLen); integral = new A32F(integralLen);
    
    numRepeats = numRepeats||1;
    
    if (matrix2) // allow to compute a second matrix in-parallel
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
        wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>1]; centerOffset2 = wtCenter2-wt2;
        
        // do this multiple times??
        for(repeat=0; repeat<numRepeats; repeat++)
        {
            //dst = new IMG(imLen); integral = new A32F(integralLen);
            tmp = im; im = dst; dst = tmp;
            
            // compute integral of image in one pass
            
            // first row
            i=0; colR=colG=colB=colA=0;
            for (x=0; x<w; x++, i+=4)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2]; colA+=im[i+3];
                integral[i]=colR; integral[i+1]=colG; integral[i+2]=colB; integral[i+3]=colA;
            }
            // other rows
            x=0; colR=colG=colB=colA=0;
            for (i=rowLen+w; i<imLen; i+=4, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=colA=0; }
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2]; colA+=im[i+3];
                integral[i+rowLen  ]=integral[i  ]+colR; 
                integral[i+rowLen+1]=integral[i+1]+colG; 
                integral[i+rowLen+2]=integral[i+2]+colB;
                integral[i+rowLen+3]=integral[i+3]+colA;
            }
            
            
            // now can compute any symmetric convolution kernel in constant time 
            // depending only on image dimensions, regardless of matrix radius
            
            // do direct convolution
            x=0; y=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; y++; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;
                
                // fix borders
                 xOff1 = xOff1<bx1 ? bx1 : xOff1;
                 xOff2 = xOff2>bx2 ? bx2 : xOff2;
                 yOff1 = yOff1<by1 ? by1 : yOff1;
                 yOff2 = yOff2>by2 ? by2 : yOff2;
                
                // compute integral positions
                p1=(xOff1 + yOff1)<<2; p4=(xOff2 + yOff2)<<2; p2=(xOff2 + yOff1)<<2; p3=(xOff1 + yOff2)<<2;
                
                // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                // also fix the center element (in case it is different)
                r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                a = wt * (integral[p4+3] - integral[p2+3] - integral[p3+3] + integral[p1+3])  +  (centerOffset * im[i+3]);
                
                r2 = wt2 * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset2 * im[i  ]);
                g2 = wt2 * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset2 * im[i+1]);
                b2 = wt2 * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset2 * im[i+2]);
                a2 = wt2 * (integral[p4+3] - integral[p2+3] - integral[p3+3] + integral[p1+3])  +  (centerOffset2 * im[i+3]);
                
                // output
                t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;  t3 = coeff1*a + coeff2*a2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;  dst[i+3] = ~~t3;
            }
            
            // do another pass??
        }
    }
    else
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
    
        // do this multiple times??
        for(repeat=0; repeat<numRepeats; repeat++)
        {
            //dst = new IMG(imLen); integral = new A32F(integralLen);
            tmp = im; im = dst; dst = tmp;
            
            // compute integral of image in one pass
            
            // first row
            i=0; colR=colG=colB=colA=0;
            for (x=0; x<w; x++, i+=4)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2]; colA+=im[i+3];
                integral[i]=colR; integral[i+1]=colG; integral[i+2]=colB; integral[i+3]=colA;
            }
            // other rows
            x=0; colR=colG=colB=colA=0;
            for (i=rowLen+w; i<imLen; i+=4, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=colA=0; }
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2]; colA+=im[i+3];
                integral[i+rowLen  ]=integral[i  ]+colR; 
                integral[i+rowLen+1]=integral[i+1]+colG; 
                integral[i+rowLen+2]=integral[i+2]+colB;
                integral[i+rowLen+3]=integral[i+3]+colA;
            }
            
            // now can compute any symmetric convolution kernel in constant time 
            // depending only on image dimensions, regardless of matrix radius
            
            // do direct convolution
            x=0; y=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; y++; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;
                
                // fix borders
                 xOff1 = xOff1<bx1 ? bx1 : xOff1;
                 xOff2 = xOff2>bx2 ? bx2 : xOff2;
                 yOff1 = yOff1<by1 ? by1 : yOff1;
                 yOff2 = yOff2>by2 ? by2 : yOff2;
                
                // compute integral positions
                p1=(xOff1 + yOff1)<<2; p4=(xOff2 + yOff2)<<2; p2=(xOff2 + yOff1)<<2; p3=(xOff1 + yOff2)<<2;
                
                // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                // also fix the center element (in case it is different)
                r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                a = wt * (integral[p4+3] - integral[p2+3] - integral[p3+3] + integral[p1+3])  +  (centerOffset * im[i+3]);
                
                // output
                t0 = coeff1*r + coeff2;  t1 = coeff1*g + coeff2;  t2 = coeff1*b + coeff2;  t3 = coeff1*a + coeff2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;  dst[i+3] = ~~t3;
            }
            
            // do another pass??
        }
    }
    return dst;
}
function integral_convolution(rgba, im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats)
{
    return rgba
    ? integral_convolution_rgba(im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats)
    : integral_convolution_rgb(im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats)
    ;
}
*/
// speed-up convolution for separable kernels
function separable_convolution(rgba, im, w, h, matrix, matrix2, ind1, ind2, coeff1, coeff2) 
{
    var imLen=im.length, imArea=(imLen>>2),
        matArea, mat, indices, matArea2,
        dst, imageIndices, imageIndices1, imageIndices2,
        i, j, k, x, ty, ty2,
        xOff, yOff, bx, by, t0, t1, t2, t3, wt,
        r, g, b, a, coeff, numPasses, tmp
    ;
    
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    bx = w-1; by = imArea-w;
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    imageIndices1 = new A16I(ind1);
    for (k=0,matArea2=ind1.length; k<matArea2; k+=2) imageIndices1[k+1] *= w;
    imageIndices2 = new A16I(ind2);
    for (k=0,matArea2=ind2.length; k<matArea2; k+=2) imageIndices2[k+1] *= w;

    // one horizontal and one vertical pass
    numPasses = 2;
    mat = matrix;
    indices = ind1;
    coeff = coeff1;
    imageIndices = imageIndices1;
    dst = im; im = new IMG(imLen);
    
    while (numPasses--)
    {
        tmp = im; im = dst; dst = tmp;
        matArea = mat.length;
        matArea2 = indices.length;
        
        // do direct convolution
        if (notSupportClamp)
        {   
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        //a += im[srcOff+3] * wt;
                    }
                }
                
                // output
                t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                /*if ( rgba )
                {
                    t3 = coeff * a;
                    t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                    dst[i+3] = ~~t3;
                }
                else
                {*/
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                /*}*/
            }
        }
        else
        {
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        //a += im[srcOff+3] * wt;
                    }
                }
                
                // output
                t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                /*if ( rgba )
                {
                    t3 = coeff * a;
                    dst[i+3] = ~~t3;
                }
                else
                {*/
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                /*}*/
            }
        }
        
        // do another pass??
        mat = matrix2;
        indices = ind2;
        coeff = coeff2;
        imageIndices = imageIndices2;
    }
    return dst;
}
function ct_eye( c1, c0 )
{
    if ( null == c0 ) c0 = 0;
    if ( null == c1 ) c1 = 1;
    var i, t = new ColorTable(256);
    for(i=0; i<256; i+=32)
    {
        t[i   ] = c0 + c1*(i   );
        t[i+1 ] = c0 + c1*(i+1 );
        t[i+2 ] = c0 + c1*(i+2 );
        t[i+3 ] = c0 + c1*(i+3 );
        t[i+4 ] = c0 + c1*(i+4 );
        t[i+5 ] = c0 + c1*(i+5 );
        t[i+6 ] = c0 + c1*(i+6 );
        t[i+7 ] = c0 + c1*(i+7 );
        t[i+8 ] = c0 + c1*(i+8 );
        t[i+9 ] = c0 + c1*(i+9 );
        t[i+10] = c0 + c1*(i+10);
        t[i+11] = c0 + c1*(i+11);
        t[i+12] = c0 + c1*(i+12);
        t[i+13] = c0 + c1*(i+13);
        t[i+14] = c0 + c1*(i+14);
        t[i+15] = c0 + c1*(i+15);
        t[i+16] = c0 + c1*(i+16);
        t[i+17] = c0 + c1*(i+17);
        t[i+18] = c0 + c1*(i+18);
        t[i+19] = c0 + c1*(i+19);
        t[i+20] = c0 + c1*(i+20);
        t[i+21] = c0 + c1*(i+21);
        t[i+22] = c0 + c1*(i+22);
        t[i+23] = c0 + c1*(i+23);
        t[i+24] = c0 + c1*(i+24);
        t[i+25] = c0 + c1*(i+25);
        t[i+26] = c0 + c1*(i+26);
        t[i+27] = c0 + c1*(i+27);
        t[i+28] = c0 + c1*(i+28);
        t[i+29] = c0 + c1*(i+29);
        t[i+30] = c0 + c1*(i+30);
        t[i+31] = c0 + c1*(i+31);
    }
    return t;
}
// multiply (functionaly compose) 2 Color Tables
function ct_multiply( ct2, ct1 )
{
    var i, ct12 = new ColorTable(256);
    for(i=0; i<256; i+=32)
    { 
        ct12[i   ] = clamp(ct2[ clamp(ct1[i   ],0,255) ],0,255); 
        ct12[i+1 ] = clamp(ct2[ clamp(ct1[i+1 ],0,255) ],0,255); 
        ct12[i+2 ] = clamp(ct2[ clamp(ct1[i+2 ],0,255) ],0,255); 
        ct12[i+3 ] = clamp(ct2[ clamp(ct1[i+3 ],0,255) ],0,255); 
        ct12[i+4 ] = clamp(ct2[ clamp(ct1[i+4 ],0,255) ],0,255); 
        ct12[i+5 ] = clamp(ct2[ clamp(ct1[i+5 ],0,255) ],0,255); 
        ct12[i+6 ] = clamp(ct2[ clamp(ct1[i+6 ],0,255) ],0,255); 
        ct12[i+7 ] = clamp(ct2[ clamp(ct1[i+7 ],0,255) ],0,255); 
        ct12[i+8 ] = clamp(ct2[ clamp(ct1[i+8 ],0,255) ],0,255); 
        ct12[i+9 ] = clamp(ct2[ clamp(ct1[i+9 ],0,255) ],0,255); 
        ct12[i+10] = clamp(ct2[ clamp(ct1[i+10],0,255) ],0,255); 
        ct12[i+11] = clamp(ct2[ clamp(ct1[i+11],0,255) ],0,255); 
        ct12[i+12] = clamp(ct2[ clamp(ct1[i+12],0,255) ],0,255); 
        ct12[i+13] = clamp(ct2[ clamp(ct1[i+13],0,255) ],0,255); 
        ct12[i+14] = clamp(ct2[ clamp(ct1[i+14],0,255) ],0,255); 
        ct12[i+15] = clamp(ct2[ clamp(ct1[i+15],0,255) ],0,255); 
        ct12[i+16] = clamp(ct2[ clamp(ct1[i+16],0,255) ],0,255); 
        ct12[i+17] = clamp(ct2[ clamp(ct1[i+17],0,255) ],0,255); 
        ct12[i+18] = clamp(ct2[ clamp(ct1[i+18],0,255) ],0,255); 
        ct12[i+19] = clamp(ct2[ clamp(ct1[i+19],0,255) ],0,255); 
        ct12[i+20] = clamp(ct2[ clamp(ct1[i+20],0,255) ],0,255); 
        ct12[i+21] = clamp(ct2[ clamp(ct1[i+21],0,255) ],0,255); 
        ct12[i+22] = clamp(ct2[ clamp(ct1[i+22],0,255) ],0,255); 
        ct12[i+23] = clamp(ct2[ clamp(ct1[i+23],0,255) ],0,255); 
        ct12[i+24] = clamp(ct2[ clamp(ct1[i+24],0,255) ],0,255); 
        ct12[i+25] = clamp(ct2[ clamp(ct1[i+25],0,255) ],0,255); 
        ct12[i+26] = clamp(ct2[ clamp(ct1[i+26],0,255) ],0,255); 
        ct12[i+27] = clamp(ct2[ clamp(ct1[i+27],0,255) ],0,255); 
        ct12[i+28] = clamp(ct2[ clamp(ct1[i+28],0,255) ],0,255); 
        ct12[i+29] = clamp(ct2[ clamp(ct1[i+29],0,255) ],0,255); 
        ct12[i+30] = clamp(ct2[ clamp(ct1[i+30],0,255) ],0,255); 
        ct12[i+31] = clamp(ct2[ clamp(ct1[i+31],0,255) ],0,255); 
    }
    return ct12;
}
function cm_eye( )
{
    return new ColorMatrix([
    1,0,0,0,0,
    0,1,0,0,0,
    0,0,1,0,0,
    0,0,0,1,0
    ]);
}
// multiply (functionaly compose, matrix multiply) 2 Color Matrices
function cm_multiply(cm1, cm2) 
{
    var cm12 = new ColorMatrix(20);

    // unroll the loop completely
    // i=0
    cm12[ 0 ] = cm2[0]*cm1[0] + cm2[1]*cm1[5] + cm2[2]*cm1[10] + cm2[3]*cm1[15];
    cm12[ 1 ] = cm2[0]*cm1[1] + cm2[1]*cm1[6] + cm2[2]*cm1[11] + cm2[3]*cm1[16];
    cm12[ 2 ] = cm2[0]*cm1[2] + cm2[1]*cm1[7] + cm2[2]*cm1[12] + cm2[3]*cm1[17];
    cm12[ 3 ] = cm2[0]*cm1[3] + cm2[1]*cm1[8] + cm2[2]*cm1[13] + cm2[3]*cm1[18];
    cm12[ 4 ] = cm2[0]*cm1[4] + cm2[1]*cm1[9] + cm2[2]*cm1[14] + cm2[3]*cm1[19] + cm2[4];

    // i=5
    cm12[ 5 ] = cm2[5]*cm1[0] + cm2[6]*cm1[5] + cm2[7]*cm1[10] + cm2[8]*cm1[15];
    cm12[ 6 ] = cm2[5]*cm1[1] + cm2[6]*cm1[6] + cm2[7]*cm1[11] + cm2[8]*cm1[16];
    cm12[ 7 ] = cm2[5]*cm1[2] + cm2[6]*cm1[7] + cm2[7]*cm1[12] + cm2[8]*cm1[17];
    cm12[ 8 ] = cm2[5]*cm1[3] + cm2[6]*cm1[8] + cm2[7]*cm1[13] + cm2[8]*cm1[18];
    cm12[ 9 ] = cm2[5]*cm1[4] + cm2[6]*cm1[9] + cm2[7]*cm1[14] + cm2[8]*cm1[19] + cm2[9];

    // i=10
    cm12[ 10 ] = cm2[10]*cm1[0] + cm2[11]*cm1[5] + cm2[12]*cm1[10] + cm2[13]*cm1[15];
    cm12[ 11 ] = cm2[10]*cm1[1] + cm2[11]*cm1[6] + cm2[12]*cm1[11] + cm2[13]*cm1[16];
    cm12[ 12 ] = cm2[10]*cm1[2] + cm2[11]*cm1[7] + cm2[12]*cm1[12] + cm2[13]*cm1[17];
    cm12[ 13 ] = cm2[10]*cm1[3] + cm2[11]*cm1[8] + cm2[12]*cm1[13] + cm2[13]*cm1[18];
    cm12[ 14 ] = cm2[10]*cm1[4] + cm2[11]*cm1[9] + cm2[12]*cm1[14] + cm2[13]*cm1[19] + cm2[14];

    // i=15
    cm12[ 15 ] = cm2[15]*cm1[0] + cm2[16]*cm1[5] + cm2[17]*cm1[10] + cm2[18]*cm1[15];
    cm12[ 16 ] = cm2[15]*cm1[1] + cm2[16]*cm1[6] + cm2[17]*cm1[11] + cm2[18]*cm1[16];
    cm12[ 17 ] = cm2[15]*cm1[2] + cm2[16]*cm1[7] + cm2[17]*cm1[12] + cm2[18]*cm1[17];
    cm12[ 18 ] = cm2[15]*cm1[3] + cm2[16]*cm1[8] + cm2[17]*cm1[13] + cm2[18]*cm1[18];
    cm12[ 19 ] = cm2[15]*cm1[4] + cm2[16]*cm1[9] + cm2[17]*cm1[14] + cm2[18]*cm1[19] + cm2[19];

    return cm12;
}
function cm_rechannel( m, Ri, Gi, Bi, Ai, Ro, Go, Bo, Ao )
{
    var cm = new ColorMatrix(20);
    cm[Ro*5+Ri] = m[0 ]; cm[Ro*5+Gi] = m[1 ]; cm[Ro*5+Bi] = m[2 ]; cm[Ro*5+Ai] = m[3 ]; cm[Ro*5+4] = m[4 ];
    cm[Go*5+Ri] = m[5 ]; cm[Go*5+Gi] = m[6 ]; cm[Go*5+Bi] = m[7 ]; cm[Go*5+Ai] = m[8 ]; cm[Go*5+4] = m[9 ];
    cm[Bo*5+Ri] = m[10]; cm[Bo*5+Gi] = m[11]; cm[Bo*5+Bi] = m[12]; cm[Bo*5+Ai] = m[13]; cm[Bo*5+4] = m[14];
    cm[Ao*5+Ri] = m[15]; cm[Ao*5+Gi] = m[16]; cm[Ao*5+Bi] = m[17]; cm[Ao*5+Ai] = m[18]; cm[Ao*5+4] = m[19];
    return cm;
}

function lerp( data, index, c1, c2, t )
{
    data[index  ] = (~~(c1[0] + t*(c2[0]-c1[0]))) & 255;
    data[index+1] = (~~(c1[1] + t*(c2[1]-c1[1]))) & 255;
    data[index+2] = (~~(c1[2] + t*(c2[2]-c1[2]))) & 255;
    data[index+3] = (~~(c1[3] + t*(c2[3]-c1[3]))) & 255;
}

function colors_stops( colors, stops )
{
    stops = stops ? stops.slice() : stops;
    colors = colors ? colors.slice() : colors;
    var cl = colors.length, i;
    if ( !stops )
    {
        if ( 1 === cl )
        {
            stops = [1.0];
        }
        else
        {
            stops = new Array(cl);
            for(i=0; i<cl; i++) stops[i] = i+1 === cl ? 1.0 : i/(cl-1);
        }
    }
    else if ( stops.length < cl )
    {
        var cstoplen = stops.length, cstop = stops[cstoplen-1];
        for(i=cstoplen; i<cl; i++) stops.push( i+1 === cl ? 1.0 : cstop+(i-cstoplen+1)/(cl-1) );
    }
    if ( 1.0 != stops[stops.length-1] )
    {
        stops.push( 1.0 );
        colors.push( colors[colors.length-1] );
    }
    return [colors, stops];
}

function gradient( g, w, h, colors, stops, angle, interpolate )
{
    var i, x, y, size = g.length, t, px, py, stop1, stop2, sin, cos, r;
    //interpolate = interpolate || lerp;
    angle = angle || 0.0;
    if ( 0 > angle ) angle += pi2;
    if ( pi2 < angle ) angle -= pi2;
    sin = Abs(Sin(angle)); cos = Abs(Cos(angle));
    r = cos*w + sin*h;
    if ( (pi_2 < angle) && (angle <= pi) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = w-1-x; py = y;
            t = Min(1.0, (cos*px + sin*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    else if ( (pi < angle) && (angle <= pi_32) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = w-1-x; py = h-1-y;
            t = Min(1.0, (cos*px + sin*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    else if ( (pi_32 < angle) && (angle < pi2) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = x; py = h-1-y;
            t = Min(1.0, (cos*px + sin*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    else //if ( (0 <= angle) && (angle <= pi_2) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = x; py = y;
            t = Min(1.0, (cos*px + sin*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    return g;
}

function radial_gradient( g, w, h, colors, stops, centerX, centerY, radiusX, radiusY, interpolate )
{
    var i, x, y, size = g.length, t, px, py, stop1, stop2;
    //interpolate = interpolate || lerp;
    centerX = centerX || 0; centerY = centerY || 0;
    radiusX = radiusX || 1.0; radiusY = radiusY || 1.0;
    //relative radii to generate elliptical gradient instead of circular (rX=rY=1)
    if ( radiusY > radiusX )
    {
        radiusX = radiusX/radiusY;
        radiusY = 1.0;
    }
    else if ( radiusX > radiusY )
    {
        radiusY = radiusY/radiusX;
        radiusX = 1.0;
    }
    else
    {
        radiusY = 1.0;
        radiusX = 1.0;
    }
    for(x=0,y=0,i=0; i<size; i+=4,x++)
    {
        if ( x >= w ) { x=0; y++; }
        px = radiusX*(x-centerX)/(w-centerX); py = radiusY*(y-centerY)/(h-centerY);
        t = Min(1.0, Sqrt(px*px + py*py));
        stop2 = 0; while ( t > stops[stop2] ) ++stop2;
        stop1 = 0 === stop2 ? 0 : stop2-1;
        interpolate(
            g, i,
            colors[stop1], colors[stop2],
            // warp the value if needed, between stop ranges
            stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
        );
    }
    return g;
}

function esc( s )
{
    return s.replace(esc_re, '\\$1');
}

MathUtil.clamp = clamp;
MathUtil.closest_power2 = closest_power_of_two;
MathUtil.Geometry = {
     Point2: point2
    ,Point3: point3
    ,enorm2: enorm2
    ,cross2: cross2
    ,normal2: normal2
    ,interpolate2: interpolate2
    ,interpolate3: interpolate3
};

StringUtil.esc = esc;
StringUtil.trim = String.prototype.trim 
? function( s ){ return s.trim(); }
: function( s ){ return s.replace(trim_re, ''); };

ImageUtil.crop = FILTER.Interpolation.crop = crop;
ImageUtil.pad = FILTER.Interpolation.pad = pad;
ImageUtil.get_data = get_data;
ImageUtil.set_data = set_data;
ImageUtil.fill = fill_data;
ImageUtil.integral = integral;
ImageUtil.histogram = histogram;
ImageUtil.spectrum = spectrum;
ImageUtil.gradient = gradient;
ImageUtil.radial_gradient = radial_gradient;
ImageUtil.lerp = lerp;
ImageUtil.colors_stops = colors_stops;

FilterUtil.ct_eye = ct_eye;
FilterUtil.ct_multiply = ct_multiply;
FilterUtil.cm_eye = cm_eye;
FilterUtil.cm_multiply = cm_multiply;
//FilterUtil.cm_apply = cm_apply;
FilterUtil.cm_rechannel = cm_rechannel;
FilterUtil.integral_convolution = integral_convolution_rgb;
FilterUtil.separable_convolution = separable_convolution;
FilterUtil.generic_transform = generic_transform;
FilterUtil.affine_transform = affine_transform;
FilterUtil.cyclic_shift = cyclic_shift;
FilterUtil.flip_x = flip_x;
FilterUtil.flip_y = flip_y;
FilterUtil.flip_xy = flip_xy;

}(FILTER);/**
*
* Filter Interpolation methods
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var clamp = FILTER.Util.Math.clamp, IMG = FILTER.ImArray;

// http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
// http://tech-algorithm.com/articles/bilinear-image-scaling/
FILTER.Interpolation.bilinear = function( im, w, h, nw, nh ) {
    var size = (nw*nh)<<2, interpolated = new IMG(size),
        rx = (w-1)/nw, ry = (h-1)/nh, 
        A, B, C, D, a, b, c, d, 
        i, j, x, y, xi, yi, pixel, index,
        yw, dx, dy, w4 = w<<2
    ;
    i=0; j=0; x=0; y=0; yi=0; yw=0; dy=0;
    for (index=0; index<size; index+=4,j++,x+=rx) 
    {
        if ( j >= nw ) { j=0; x=0; i++; y+=ry; yi=~~y; dy=y - yi; yw=yi*w; }
        
        xi = ~~x; dx = x - xi;
        
        // Y = A(1-w)(1-h) + B(w)(1-h) + C(h)(1-w) + Dwh
        a = (1-dx)*(1-dy); b = dx*(1-dy);
        c = dy*(1-dx); d = dx*dy;
        
        pixel = (yw + xi)<<2;

        A = im[pixel]; B = im[pixel+4];
        C = im[pixel+w4]; D = im[pixel+w4+4];
        interpolated[index] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);
        
        A = im[pixel+1]; B = im[pixel+5];
        C = im[pixel+w4+1]; D = im[pixel+w4+5];
        interpolated[index+1] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);

        A = im[pixel+2]; B = im[pixel+6];
        C = im[pixel+w4+2]; D = im[pixel+w4+6];
        interpolated[index+2] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);

        A = im[pixel+3]; B = im[pixel+7];
        C = im[pixel+w4+3]; D = im[pixel+w4+7];
        interpolated[index+3] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);
    }
    return interpolated;
};

}(FILTER);/**
*
* Filter Interpolation methods
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var clamp = FILTER.Util.Math.clamp, IMG = FILTER.ImArray;

// http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
FILTER.Interpolation.nearest = function( im, w, h, nw, nh ) {
    var size = (nw*nh)<<2, interpolated = new IMG(size),
        rx = (w-1)/nw, ry = (h-1)/nh, 
        i, j, x, y, xi, yi, pixel, index,
        yw, xoff, yoff, w4 = w<<2
    ;
    i=0; j=0; x=0; y=0; yi=0; yw=0; yoff=0;
    for (index=0; index<size; index+=4,j++,x+=rx) 
    {
        if ( j >= nw ) { j=0; x=0; i++; y+=ry; yi=~~y; yw=yi*w; yoff=y - yi<0.5 ? 0 : w4; }
        
        xi = ~~x; xoff = x - xi<0.5 ? 0 : 4;
        
        pixel = ((yw + xi)<<2) + xoff + yoff;

        interpolated[index]      = im[pixel];
        interpolated[index+1]    = im[pixel+1];
        interpolated[index+2]    = im[pixel+2];
        interpolated[index+3]    = im[pixel+3];
    }
    return interpolated;
};

}(FILTER);/**
*
* Filter Interpolation methods
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var clamp = FILTER.Util.Math.clamp, IMG = FILTER.ImArray, A32F = FILTER.Array32F,
    subarray = FILTER.Util.Array.subarray;

// http://www.gamedev.net/topic/229145-bicubic-interpolation-for-image-resizing/
FILTER.Interpolation.bicubic = function( im, w, h, nw, nh ) {
    var size = (nw*nh)<<2, interpolated = new IMG(size),
        rx = (w-1)/nw, ry = (h-1)/nh, 
        i, j, x, y, xi, yi, pixel, index,
        rgba = new IMG(4), 
        rgba0 = new A32F(4), rgba1 = new A32F(4), 
        rgba2 = new A32F(4), rgba3 = new A32F(4),
        yw, dx, dy, dx2, dx3, dy2, dy3, w4 = w<<2,
        B, BL, BR, BRR, BB, BBL, BBR, BBRR, C, L, R, RR, T, TL, TR, TRR,
        p, q, r, s, T_EDGE, B_EDGE, L_EDGE, R_EDGE
    ;
    i=0; j=0; x=0; y=0; yi=0; yw=0; dy=dy2=dy3=0; 
    for (index=0; index<size; index+=4,j++,x+=rx) 
    {
        if ( j >= nw ) {j=0; x=0; i++; y+=ry; yi=~~y; dy=y - yi; dy2=dy*dy; dy3=dy2*dy3; yw=yi*w;}
        xi = ~~x; dx = x - xi; dx2 = dx*dx; dx3 = dx2*dx;
        
        pixel = (yw + xi)<<2;
        T_EDGE = 0 === yi; B_EDGE = h-1 === yi; L_EDGE = 0 === xi; R_EDGE = w-1 === xi;
        
        // handle edge cases
        C = subarray(im, pixel, pixel+4);
        L = L_EDGE ? C : subarray(im, pixel-4, pixel);
        R = R_EDGE ? C : subarray(im, pixel+4, pixel+8);
        RR = R_EDGE ? C : subarray(im, pixel+8, pixel+12);
        B = B_EDGE ? C : subarray(im, pixel+w4, pixel+w4+4);
        BB = B_EDGE ? C : subarray(im, pixel+w4+w4, pixel+w4+w4+4);
        BL = B_EDGE||L_EDGE ? C : subarray(im, pixel+w4-4, pixel+w4);
        BR = B_EDGE||R_EDGE ? C : subarray(im, pixel+w4+4, pixel+w4+8);
        BRR = B_EDGE||R_EDGE ? C : subarray(im, pixel+w4+8, pixel+w4+12);
        BBL = B_EDGE||L_EDGE ? C : subarray(im, pixel+w4+w4-4, pixel+w4+w4);
        BBR = B_EDGE||R_EDGE ? C : subarray(im, pixel+w4+w4+4, pixel+w4+w4+8);
        BBRR = B_EDGE||R_EDGE ? C : subarray(im, pixel+w4+w4+8, pixel+w4+w4+12);
        T = T_EDGE ? C : subarray(im, pixel-w4, pixel-w4+4);
        TL = T_EDGE||L_EDGE ? C : subarray(im, pixel-w4-4, pixel-w4);
        TR = T_EDGE||R_EDGE ? C : subarray(im, pixel-w4+4, pixel-w4+8);
        TRR = T_EDGE||R_EDGE ? C : subarray(im, pixel-w4+8, pixel-w4+12);
        
        /*function interpolate_pixel(n, p0, p1, p2, p3, t)
        {
            var p, q, r, s, t2 = t*t, t3 = t2 * t, v;
            
            p = (p3[0] - p2[0]) - (p0[0] - p1[0]);
            q = (p0[0] - p1[0]) - p;
            r = p2[0] - p0[0];
            s = p1[0];
            n[0] = clamp(~~(p * t3 + q * t2 + r * t + s + 0.5), 0, 255);

            p = (p3[1] - p2[1]) - (p0[1] - p1[1]);
            q = (p0[1] - p1[1]) - p;
            r = p2[1] - p0[1];
            s = p1[1];
            n[1] = clamp(~~(p * t3 + q * t2 + r * t + s + 0.5), 0, 255);

            p = (p3[2] - p2[2]) - (p0[2] - p1[2]);
            q = (p0[2] - p1[2]) - p;
            r = p2[2] - p0[2];
            s = p1[2];
            n[2] = clamp(~~(p * t3 + q * t2 + r * t + s + 0.5), 0, 255);

            p = (p3[3] - p2[3]) - (p0[3] - p1[3]);
            q = (p0[3] - p1[3]) - p;
            r = p2[3] - p0[3];
            s = p1[3];
            n[3] = clamp(~~(p * t3 + q * t2 + r * t + s + 0.5), 0, 255);
        }*/
        //interpolate_pixel(rgba0, TL, T, TR, TRR, dx);
        p = (TRR[0] - TR[0]) - (TL[0] - T[0]);
        q = (TL[0] - T[0]) - p;
        r = TR[0] - TL[0];
        s = T[0];
        rgba0[0] = p * dx3 + q * dx2 + r * dx + s;
        p = (TRR[1] - TR[1]) - (TL[1] - T[1]);
        q = (TL[1] - T[1]) - p;
        r = TR[1] - TL[1];
        s = T[1];
        rgba0[1] = p * dx3 + q * dx2 + r * dx + s;
        p = (TRR[2] - TR[2]) - (TL[2] - T[2]);
        q = (TL[2] - T[2]) - p;
        r = TR[2] - TL[2];
        s = T[2];
        rgba0[2] = p * dx3 + q * dx2 + r * dx + s;
        p = (TRR[3] - TR[3]) - (TL[3] - T[3]);
        q = (TL[3] - T[3]) - p;
        r = TR[3] - TL[3];
        s = T[3];
        rgba0[3] = p * dx3 + q * dx2 + r * dx + s;
        
        //interpolate_pixel(rgba1, L, C, R, RR, dx);
        p = (RR[0] - R[0]) - (L[0] - C[0]);
        q = (L[0] - C[0]) - p;
        r = R[0] - L[0];
        s = C[0];
        rgba1[0] = p * dx3 + q * dx2 + r * dx + s;
        p = (RR[1] - R[1]) - (L[1] - C[1]);
        q = (L[1] - C[1]) - p;
        r = R[1] - L[1];
        s = C[1];
        rgba1[1] = p * dx3 + q * dx2 + r * dx + s;
        p = (RR[2] - R[2]) - (L[2] - C[2]);
        q = (L[2] - C[2]) - p;
        r = R[2] - L[2];
        s = C[2];
        rgba1[2] = p * dx3 + q * dx2 + r * dx + s;
        p = (RR[3] - R[3]) - (L[3] - C[3]);
        q = (L[3] - C[3]) - p;
        r = R[3] - L[3];
        s = C[3];
        rgba1[3] = p * dx3 + q * dx2 + r * dx + s;
        
        //interpolate_pixel(rgba2, BL, B, BR, BRR, dx);
        p = (BRR[0] - BR[0]) - (BL[0] - B[0]);
        q = (BL[0] - B[0]) - p;
        r = BR[0] - BL[0];
        s = B[0];
        rgba2[0] = p * dx3 + q * dx2 + r * dx + s;
        p = (BRR[1] - BR[1]) - (BL[1] - B[1]);
        q = (BL[1] - B[1]) - p;
        r = BR[1] - BL[1];
        s = B[1];
        rgba2[1] = p * dx3 + q * dx2 + r * dx + s;
        p = (BRR[2] - BR[2]) - (BL[2] - B[2]);
        q = (BL[2] - B[2]) - p;
        r = BR[2] - BL[2];
        s = B[2];
        rgba2[2] = p * dx3 + q * dx2 + r * dx + s;
        p = (BRR[3] - BR[3]) - (BL[3] - B[3]);
        q = (BL[3] - B[3]) - p;
        r = BR[3] - BL[3];
        s = B[3];
        rgba2[3] = p * dx3 + q * dx2 + r * dx + s;
        
        //interpolate_pixel(rgba3, BBL, BB, BBR, BBRR, dx);
        p = (BBRR[0] - BBR[0]) - (BBL[0] - BB[0]);
        q = (BBL[0] - BB[0]) - p;
        r = BBR[0] - BBL[0];
        s = BB[0];
        rgba3[0] = p * dx3 + q * dx2 + r * dx + s;
        p = (BBRR[1] - BBR[1]) - (BBL[1] - BB[1]);
        q = (BBL[1] - BB[1]) - p;
        r = BBR[1] - BBL[1];
        s = BB[1];
        rgba3[1] = p * dx3 + q * dx2 + r * dx + s;
        p = (BBRR[2] - BBR[2]) - (BBL[2] - BB[2]);
        q = (BBL[2] - BB[2]) - p;
        r = BBR[2] - BBL[2];
        s = BB[2];
        rgba3[2] = p * dx3 + q * dx2 + r * dx + s;
        p = (BBRR[3] - BBR[3]) - (BBL[3] - BB[3]);
        q = (BBL[3] - BB[3]) - p;
        r = BBR[3] - BBL[3];
        s = BB[3];
        rgba3[3] = p * dx3 + q * dx2 + r * dx + s;
        
        // Then we interpolate those 4 pixels to get a single pixel that is a composite of 4 * 4 pixels, 16 pixels
        //interpolate_pixel(rgba, rgba0, rgba1, rgba2, rgba3, dy);
        p = (rgba3[0] - rgba2[0]) - (rgba0[0] - rgba1[0]);
        q = (rgba0[0] - rgba1[0]) - p;
        r = rgba2[0] - rgba0[0];
        s = rgba1[0];
        rgba[0] = clamp(~~(p * dy3 + q * dy2 + r * dy + s + 0.5), 0, 255);
        p = (rgba3[1] - rgba2[1]) - (rgba0[1] - rgba1[1]);
        q = (rgba0[1] - rgba1[1]) - p;
        r = rgba2[1] - rgba0[1];
        s = rgba1[1];
        rgba[1] = clamp(~~(p * dy3 + q * dy2 + r * dy + s + 0.5), 0, 255);
        p = (rgba3[2] - rgba2[2]) - (rgba0[2] - rgba1[2]);
        q = (rgba0[2] - rgba1[2]) - p;
        r = rgba2[2] - rgba0[2];
        s = rgba1[2];
        rgba[2] = clamp(~~(p * dy3 + q * dy2 + r * dy + s + 0.5), 0, 255);
        p = (rgba3[3] - rgba2[3]) - (rgba0[3] - rgba1[3]);
        q = (rgba0[3] - rgba1[3]) - p;
        r = rgba2[3] - rgba0[3];
        s = rgba1[3];
        rgba[3] = clamp(~~(p * dy3 + q * dy2 + r * dy + s + 0.5), 0, 255);
        
        interpolated[index]      = rgba[0];
        interpolated[index+1]    = rgba[1];
        interpolated[index+2]    = rgba[2];
        interpolated[index+3]    = rgba[3];
    }
    return interpolated;
};

}(FILTER);/**
*
* Color Methods / Transforms
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// adapted from https://github.com/foo123/css-color
var // utils
    Sqrt = Math.sqrt, round = Math.round, floor = Math.floor, 
    min = Math.min, max = Math.max, abs = Math.abs,
    //notSupportClamp = FILTER._notSupportClamp,
    clamp = FILTER.Util.Math.clamp,
    esc = FILTER.Util.String.esc,
    trim = FILTER.Util.String.trim,
    
    LUMA = FILTER.LUMA, CHANNEL = FILTER.CHANNEL,
    //RED = CHANNEL.RED, GREEN = CHANNEL.GREEN, BLUE = CHANNEL.BLUE, ALPHA = CHANNEL.ALPHA,
    C2F = 1/255, C2P = 100/255, P2C = 2.55,

    Keywords = {
        // http://www.w3.org/wiki/CSS/Properties/color/keywords
        // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
        /* extended */
         'transparent'         : [  0,0,0        ,0]
        ,'aliceblue'           : [  240,248,255  ,1]
        ,'antiquewhite'        : [  250,235,215  ,1]
        ,'aqua'                : [  0,255,255    ,1]
        ,'aquamarine'          : [  127,255,212  ,1]
        ,'azure'               : [  240,255,255  ,1]
        ,'beige'               : [  245,245,220  ,1]
        ,'bisque'              : [  255,228,196  ,1]
        ,'black'               : [  0,0,0    ,    1]
        ,'blanchedalmond'      : [  255,235,205  ,1]
        ,'blue'                : [  0,0,255  ,    1]
        ,'blueviolet'          : [  138,43,226   ,1]
        ,'brown'               : [  165,42,42    ,1]
        ,'burlywood'           : [  222,184,135  ,1]
        ,'cadetblue'           : [  95,158,160   ,1]
        ,'chartreuse'          : [  127,255,0    ,1]
        ,'chocolate'           : [  210,105,30   ,1]
        ,'coral'               : [  255,127,80   ,1]
        ,'cornflowerblue'      : [  100,149,237  ,1]
        ,'cornsilk'            : [  255,248,220  ,1]
        ,'crimson'             : [  220,20,60    ,1]
        ,'cyan'                : [  0,255,255    ,1]
        ,'darkblue'            : [  0,0,139  ,    1]
        ,'darkcyan'            : [  0,139,139    ,1]
        ,'darkgoldenrod'       : [  184,134,11   ,1]
        ,'darkgray'            : [  169,169,169  ,1]
        ,'darkgreen'           : [  0,100,0  ,    1]
        ,'darkgrey'            : [  169,169,169  ,1]
        ,'darkkhaki'           : [  189,183,107  ,1]
        ,'darkmagenta'         : [  139,0,139    ,1]
        ,'darkolivegreen'      : [  85,107,47    ,1]
        ,'darkorange'          : [  255,140,0    ,1]
        ,'darkorchid'          : [  153,50,204   ,1]
        ,'darkred'             : [  139,0,0  ,    1]
        ,'darksalmon'          : [  233,150,122  ,1]
        ,'darkseagreen'        : [  143,188,143  ,1]
        ,'darkslateblue'       : [  72,61,139    ,1]
        ,'darkslategray'       : [  47,79,79 ,    1]
        ,'darkslategrey'       : [  47,79,79 ,    1]
        ,'darkturquoise'       : [  0,206,209    ,1]
        ,'darkviolet'          : [  148,0,211    ,1]
        ,'deeppink'            : [  255,20,147   ,1]
        ,'deepskyblue'         : [  0,191,255    ,1]
        ,'dimgray'             : [  105,105,105  ,1]
        ,'dimgrey'             : [  105,105,105  ,1]
        ,'dodgerblue'          : [  30,144,255   ,1]
        ,'firebrick'           : [  178,34,34    ,1]
        ,'floralwhite'         : [  255,250,240  ,1]
        ,'forestgreen'         : [  34,139,34    ,1]
        ,'fuchsia'             : [  255,0,255    ,1]
        ,'gainsboro'           : [  220,220,220  ,1]
        ,'ghostwhite'          : [  248,248,255  ,1]
        ,'gold'                : [  255,215,0    ,1]
        ,'goldenrod'           : [  218,165,32   ,1]
        ,'gray'                : [  128,128,128  ,1]
        ,'green'               : [  0,128,0  ,    1]
        ,'greenyellow'         : [  173,255,47   ,1]
        ,'grey'                : [  128,128,128  ,1]
        ,'honeydew'            : [  240,255,240  ,1]
        ,'hotpink'             : [  255,105,180  ,1]
        ,'indianred'           : [  205,92,92    ,1]
        ,'indigo'              : [  75,0,130 ,    1]
        ,'ivory'               : [  255,255,240  ,1]
        ,'khaki'               : [  240,230,140  ,1]
        ,'lavender'            : [  230,230,250  ,1]
        ,'lavenderblush'       : [  255,240,245  ,1]
        ,'lawngreen'           : [  124,252,0    ,1]
        ,'lemonchiffon'        : [  255,250,205  ,1]
        ,'lightblue'           : [  173,216,230  ,1]
        ,'lightcoral'          : [  240,128,128  ,1]
        ,'lightcyan'           : [  224,255,255  ,1]
        ,'lightgoldenrodyellow': [  250,250,210  ,1]
        ,'lightgray'           : [  211,211,211  ,1]
        ,'lightgreen'          : [  144,238,144  ,1]
        ,'lightgrey'           : [  211,211,211  ,1]
        ,'lightpink'           : [  255,182,193  ,1]
        ,'lightsalmon'         : [  255,160,122  ,1]
        ,'lightseagreen'       : [  32,178,170   ,1]
        ,'lightskyblue'        : [  135,206,250  ,1]
        ,'lightslategray'      : [  119,136,153  ,1]
        ,'lightslategrey'      : [  119,136,153  ,1]
        ,'lightsteelblue'      : [  176,196,222  ,1]
        ,'lightyellow'         : [  255,255,224  ,1]
        ,'lime'                : [  0,255,0  ,    1]
        ,'limegreen'           : [  50,205,50    ,1]
        ,'linen'               : [  250,240,230  ,1]
        ,'magenta'             : [  255,0,255    ,1]
        ,'maroon'              : [  128,0,0  ,    1]
        ,'mediumaquamarine'    : [  102,205,170  ,1]
        ,'mediumblue'          : [  0,0,205  ,    1]
        ,'mediumorchid'        : [  186,85,211   ,1]
        ,'mediumpurple'        : [  147,112,219  ,1]
        ,'mediumseagreen'      : [  60,179,113   ,1]
        ,'mediumslateblue'     : [  123,104,238  ,1]
        ,'mediumspringgreen'   : [  0,250,154    ,1]
        ,'mediumturquoise'     : [  72,209,204   ,1]
        ,'mediumvioletred'     : [  199,21,133   ,1]
        ,'midnightblue'        : [  25,25,112    ,1]
        ,'mintcream'           : [  245,255,250  ,1]
        ,'mistyrose'           : [  255,228,225  ,1]
        ,'moccasin'            : [  255,228,181  ,1]
        ,'navajowhite'         : [  255,222,173  ,1]
        ,'navy'                : [  0,0,128  ,    1]
        ,'oldlace'             : [  253,245,230  ,1]
        ,'olive'               : [  128,128,0    ,1]
        ,'olivedrab'           : [  107,142,35   ,1]
        ,'orange'              : [  255,165,0    ,1]
        ,'orangered'           : [  255,69,0 ,    1]
        ,'orchid'              : [  218,112,214  ,1]
        ,'palegoldenrod'       : [  238,232,170  ,1]
        ,'palegreen'           : [  152,251,152  ,1]
        ,'paleturquoise'       : [  175,238,238  ,1]
        ,'palevioletred'       : [  219,112,147  ,1]
        ,'papayawhip'          : [  255,239,213  ,1]
        ,'peachpuff'           : [  255,218,185  ,1]
        ,'peru'                : [  205,133,63   ,1]
        ,'pink'                : [  255,192,203  ,1]
        ,'plum'                : [  221,160,221  ,1]
        ,'powderblue'          : [  176,224,230  ,1]
        ,'purple'              : [  128,0,128    ,1]
        ,'red'                 : [  255,0,0  ,    1]
        ,'rosybrown'           : [  188,143,143  ,1]
        ,'royalblue'           : [  65,105,225   ,1]
        ,'saddlebrown'         : [  139,69,19    ,1]
        ,'salmon'              : [  250,128,114  ,1]
        ,'sandybrown'          : [  244,164,96   ,1]
        ,'seagreen'            : [  46,139,87    ,1]
        ,'seashell'            : [  255,245,238  ,1]
        ,'sienna'              : [  160,82,45    ,1]
        ,'silver'              : [  192,192,192  ,1]
        ,'skyblue'             : [  135,206,235  ,1]
        ,'slateblue'           : [  106,90,205   ,1]
        ,'slategray'           : [  112,128,144  ,1]
        ,'slategrey'           : [  112,128,144  ,1]
        ,'snow'                : [  255,250,250  ,1]
        ,'springgreen'         : [  0,255,127    ,1]
        ,'steelblue'           : [  70,130,180   ,1]
        ,'tan'                 : [  210,180,140  ,1]
        ,'teal'                : [  0,128,128    ,1]
        ,'thistle'             : [  216,191,216  ,1]
        ,'tomato'              : [  255,99,71    ,1]
        ,'turquoise'           : [  64,224,208   ,1]
        ,'violet'              : [  238,130,238  ,1]
        ,'wheat'               : [  245,222,179  ,1]
        ,'white'               : [  255,255,255  ,1]
        ,'whitesmoke'          : [  245,245,245  ,1]
        ,'yellow'              : [  255,255,0    ,1]
        ,'yellowgreen'         : [  154,205,50   ,1]    
    }
;

// adapted from https://github.com/foo123/css-color

// static Color Methods and Transforms
// http://en.wikipedia.org/wiki/Color_space

//
// Color Class and utils
var Color = FILTER.Color = FILTER.Class({
    
    //
    // static
    __static__: {
    
        clamp: clamp,
        
        clampPixel: function( v ) {
            return min(255, max(v, 0));
        },
        
        intensity: function( r, g, b ) {
            return ~~(LUMA[0]*r + LUMA[1]*g + LUMA[2]*b);
        }, 
        
        hue: function( r, g, b ) {
            var M = max( r, g, b );
            return r === g && g === b
            ? 0
            : (r === M
            ? 60 * abs( g - b ) / (M - min( r, g, b ))
            : (g === M
            ? 120 + 60 * abs( b - r ) / (M - min( r, g, b ))
            : 240 + 60 * abs( r - g ) / (M - min( r, g, b ))))
            ;
        },
        
        saturation: function( r, g, b ) {
            var M = max( r, g, b );
            return r === g && g === b ? 0 : 255 * (M-min( r, g, b )) / M;
        },
        
        dist: function( ccc1, ccc2, p1, p2 ) {
            //p1 = p1 || 0; p2 = p2 || 0;
            var d0 = ccc1[p1+0]-ccc2[p2+0], d1 = ccc1[p1+1]-ccc2[p2+1], d2 = ccc1[p1+2]-ccc2[p2+2];
            return Sqrt(d0*d0 + d1*d1 + d2*d2);
        },
        
        RGB2Color: function( rgb, p ) {
            //p = p || 0;
            return ((rgb[p+0]&255) << 16) | ((rgb[p+1]&255) << 8) | (rgb[p+2]&255);
        },
        
        RGBA2Color: function( rgba, p ) {
            //p = p || 0;
            return ((rgba[p+3]&255) << 24) | ((rgba[p+0]&255) << 16) | ((rgba[p+1]&255) << 8) | (rgba[p+2]&255);
        },
        
        Color2RGBA: function( c, rgba, p ) {
            /*p = p || 0;*/ c = ~~c;
            rgba[p+0] = (c >>> 16) & 255;
            rgba[p+1] = (c >>> 8) & 255;
            rgba[p+2] = (c & 255);
            rgba[p+3] = (c >>> 24) & 255;
            return rgba;
        },

        // http://en.wikipedia.org/wiki/YCbCr
        RGB2YCbCr: function( ccc, p ) {
            //p = p || 0;
            var r = ccc[p+0], g = ccc[p+1], b = ccc[p+2];
            // each take full range from 0-255
            ccc[p+0] = ~~( 0   + 0.299*r    + 0.587*g     + 0.114*b    );
            ccc[p+1] = ~~( 128 - 0.168736*r - 0.331264*g  + 0.5*b      );
            ccc[p+2] = ~~( 128 + 0.5*r      - 0.418688*g  - 0.081312*b );
            return ccc;
        },
        
        // http://en.wikipedia.org/wiki/YCbCr
        YCbCr2RGB: function( ccc, p ) {
            //p = p || 0;
            var y = ccc[p+0], cb = ccc[p+1], cr = ccc[p+2];
            // each take full range from 0-255
            ccc[p+0] = ~~( y                      + 1.402   * (cr-128) );
            ccc[p+1] = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
            ccc[p+2] = ~~( y + 1.772   * (cb-128) );
            return ccc;
        },
        
        // http://en.wikipedia.org/wiki/HSL_color_space
        // adapted from http://www.cs.rit.edu/~ncs/colo
        RGB2HSV: function( ccc, p )  {
            //p = p || 0;
            var m, M, delta, r = ccc[p+0], g = ccc[p+1], b = ccc[p+2], h, s, v;
            
            M = max( r, g, b );
            v = M;                // v

            if ( r === g && g === b )
            {
                // r = g = b = 0        // s = 0, v is undefined
                s = 0; h = 0; //h = -1;
            }
            else
            {
                m = min( r, g, b );
                delta = M - m;
                s = delta / M;        // s

                if ( r === M )      h = 60 * abs( g - b ) / delta;        // between yellow & magenta
                else if ( g === M ) h = 120 + 60 * abs( b - r ) / delta;    // between cyan & yellow
                else                h = 240 + 60 * abs( r - g ) / delta;   // between magenta & cyan
                //h *= 60;                // degrees
                //if( h < 0 )  h += 360;
            }
            ccc[p+0] = h; ccc[p+1] = s; ccc[p+2] = v
            return ccc;
        },
        
        // http://en.wikipedia.org/wiki/HSL_color_space
        // adapted from http://www.cs.rit.edu/~ncs/color/t_convert.html
        HSV2RGB: function( ccc, p ) {
            //p = p || 0;
            var i, f, o, q, t, r, g, b, h = ccc[p+0], s = ccc[p+1], v = ccc[p+2];
            
            if( 0 === s ) 
            {
                // achromatic (grey)
                r = g = b = v;
            }
            else
            {
                h /= 60;            // sector 0 to 5
                i = ~~h;
                f = h - i;          // fractional part of h
                o = v * ( 1 - s );
                q = v * ( 1 - s * f );
                t = v * ( 1 - s * ( 1 - f ) );

                if ( 0 === i )      { r = v; g = t; b = o; }
                else if ( 1 === i ) { r = q;  g = v; b = o; }
                else if ( 2 === i ) { r = o; g = v; b = t; }
                else if ( 3 === i ) { r = o; g = q; b = v; }
                else if ( 4 === i ) { r = t; g = o; b = v; }
                else /* case 5: */  { r = v; g = o; b = q; }
            }
            ccc[p+0] = r; ccc[p+1] = g; ccc[p+2] = b;
            return ccc;
        },
        
        toString: function() {
            return "[" + "FILTER: " + this.name + "]";
        },
    
        C2F: C2F,
        C2P: C2P,
        P2C: P2C,
        
        Keywords: Keywords,
        
        // color format regexes
        hexieRE: /^#([0-9a-fA-F]{8})\b/,
        hexRE: /^#([0-9a-fA-F]{3,6})\b/,
        rgbRE: /^(rgba?)\b\s*\(([^\)]*)\)/i,
        hslRE: /^(hsla?)\b\s*\(([^\)]*)\)/i,
        keywordRE: new RegExp('^(' + Object.keys(Keywords).map(esc).join('|') + ')\\b', 'i'),
        colorstopRE: /^\s+(\d+(\.\d+)?%?)/,
        
        // color format conversions
        // http://www.rapidtables.com/convert/color/index.htm
        col2per: function( c, suffix ) {
            return (c*C2P)+(suffix||'');
        },
        per2col: function( c ) {
            return c*P2C;
        },
        
        // http://www.javascripter.net/faq/rgb2cmyk.htm
        rgb2cmyk: function( r, g, b, asPercent ) {
            var c = 0, m = 0, y = 0, k = 0, minCMY, invCMY;

            if ( asPercent )
            {
                r = clamp(round(r*P2C), 0, 255);
                g = clamp(round(g*P2C), 0, 255);
                b = clamp(round(b*P2C), 0, 255);
            }
            
            // BLACK
            if ( 0==r && 0==g && 0==b ) 
            {
                k = 1;
                return [0, 0, 0, 1];
            }

            c = 1 - (r*C2F);
            m = 1 - (g*C2F);
            y = 1 - (b*C2F);

            minCMY = min( c, m, y );
            invCMY = 1 / (1 - minCMY);
            c = (c - minCMY) * invCMY;
            m = (m - minCMY) * invCMY;
            y = (y - minCMY) * invCMY;
            k = minCMY;

            return [c, m, y, k];
        },
        cmyk2rgb: function( c, m, y, k ) {
            var r = 0, g = 0, b = 0, minCMY, invCMY
            ;

            // BLACK
            if ( 0==c && 0==m && 0==y ) 
            {
                return [0, 0, 0];
            }
            
            minCMY = k;
            invCMY = 1 - minCMY;
            c = c*invCMY + minCMY;
            m = m*invCMY + minCMY;
            y = y*invCMY + minCMY;
            
            r = (1 - c)*255;
            g = (1 - m)*255;
            b = (1 - y)*255;

            return [
                clamp(round(r), 0, 255),
                clamp(round(g), 0, 255),
                clamp(round(b), 0, 255)
            ];
        },
        rgb2hex: function( r, g, b, condenced, asPercent ) { 
            var hex;
            if ( asPercent )
            {
                r = clamp(round(r*P2C), 0, 255);
                g = clamp(round(g*P2C), 0, 255);
                b = clamp(round(b*P2C), 0, 255);
            }
            
            r = ( r < 16 ) ? '0'+r.toString(16) : r.toString(16);
            g = ( g < 16 ) ? '0'+g.toString(16) : g.toString(16);
            b = ( b < 16 ) ? '0'+b.toString(16) : b.toString(16);
            
            if ( condenced && (r[0]==r[1] && g[0]==g[1] && b[0]==b[1]) )
                hex = '#' + r[0] + g[0] + b[0];
            else
                hex = '#' + r + g + b;
            
            return hex;
        },
        rgb2hexIE: function( r, g, b, a, asPercent ) { 
            var hex;
            if ( asPercent )
            {
                r = clamp(round(r*P2C), 0, 255);
                g = clamp(round(g*P2C), 0, 255);
                b = clamp(round(b*P2C), 0, 255);
                a = clamp(round(a*P2C), 0, 255);
            }
            
            r = ( r < 16 ) ? '0'+r.toString(16) : r.toString(16);
            g = ( g < 16 ) ? '0'+g.toString(16) : g.toString(16);
            b = ( b < 16 ) ? '0'+b.toString(16) : b.toString(16);
            a = ( a < 16 ) ? '0'+a.toString(16) : a.toString(16);
            hex = '#' + a + r + g + b;
            
            return hex;
        },
        hex2rgb: function( h/*, asPercent*/ ) {  
            if ( !h || 3 > h.length )
                return [0, 0, 0];
                
            if ( 6 > h.length )
                return [
                    clamp( parseInt(h[0]+h[0], 16), 0, 255 ), 
                    clamp( parseInt(h[1]+h[1], 16), 0, 255 ), 
                    clamp( parseInt(h[2]+h[2], 16), 0, 255 )
                ];
            
            else
                return [
                    clamp( parseInt(h[0]+h[1], 16), 0, 255 ), 
                    clamp( parseInt(h[2]+h[3], 16), 0, 255 ), 
                    clamp( parseInt(h[4]+h[5], 16), 0, 255 )
                ];
            
            /*if ( asPercent )
                rgb = [
                    (rgb[0]*C2P)+'%', 
                    (rgb[1]*C2P)+'%', 
                    (rgb[2]*C2P)+'%'
                ];*/
        },
        // http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
        /**
         * Converts an HSL color value to RGB. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
         * Assumes h, s, and l are contained in the set [0, 1] and
         * returns r, g, and b in the set [0, 255].
         */
        hue2rgb: function( p, q, t ) {
            if ( t < 0 ) t += 1;
            if ( t > 1 ) t -= 1;
            if ( t < 1/6 ) return p + (q - p) * 6 * t;
            if ( t < 1/2 ) return q;
            if ( t < 2/3 ) return p + (q - p) * (2/3 - t) * 6;
            return p;
        },
        hsl2rgb: function( h, s, l ) {
            var r, g, b, p, q, hue2rgb = Color.hue2rgb;

            // convert to [0, 1] range
            h = ((h + 360)%360)/360;
            s *= 0.01;
            l *= 0.01;
            
            if ( 0 == s )
            {
                // achromatic
                r = 1;
                g = 1;
                b = 1;
            }
            else
            {

                q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                p = 2 * l - q;
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }

            return [
                clamp( round(r * 255), 0, 255 ), 
                clamp( round(g * 255), 0, 255 ),  
                clamp( round(b * 255), 0, 255 )
            ];
        },
        /**
        * Converts an RGB color value to HSL. Conversion formula
        * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
        * Assumes r, g, and b are contained in the set [0, 255] and
        * returns h, s, and l in the set [0, 1].
        */
        rgb2hsl: function( r, g, b, asPercent ) {
            var m, M, h, s, l, d;
            
            if ( asPercent )
            {
                r *= 0.01;
                g *= 0.01;
                b *= 0.01;
            }
            else
            {
                r *= C2F; 
                g *= C2F; 
                b *= C2F;
            }
            M = max(r, g, b); 
            m = min(r, g, b);
            l = 0.5*(M + m);

            if ( M == m )
            {
                h = s = 0; // achromatic
            }
            else
            {
                d = M - m;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                if ( M == r )
                    h = (g - b) / d + (g < b ? 6 : 0);
                
                else if ( M == g )
                    h = (b - r) / d + 2;
                
                else
                    h = (r - g) / d + 4;
                
                h /= 6;
            }
            
            return [
                round( h*360 ) % 360, 
                clamp(s*100, 0, 100), 
                clamp(l*100, 0, 100)
            ];
        },
        
        parse: function( s, withColorStops, parsed, onlyColor ) {
            var m, m2, s2, end = 0, end2 = 0, c, hasOpacity;
            
            if ( 'hsl' === parsed || 
                ( !parsed && (m = s.match(Color.hslRE)) ) 
            )
            {
                // hsl(a)
                if ( 'hsl' === parsed )
                {
                    hasOpacity = 'hsla' === s[0].toLowerCase();
                    var col = s[1].split(',').map(trim);
                }
                else
                {
                    end = m[0].length;
                    end2 = 0;
                    hasOpacity = 'hsla' === m[1].toLowerCase();
                    var col = m[2].split(',').map(trim);
                }    
                
                var h = col[0] ? col[0] : '0';
                var s = col[1] ? col[1] : '0';
                var l = col[2] ? col[2] : '0';
                var a = hasOpacity && null!=col[3] ? col[3] : '1';
                
                h = parseFloat(h, 10);
                s = ('%'===s.slice(-1)) ? parseFloat(s, 10) : parseFloat(s, 10)*C2P;
                l = ('%'===l.slice(-1)) ? parseFloat(l, 10) : parseFloat(l, 10)*C2P;
                a = parseFloat(a, 10);
                
                c = new Color().fromHSL([h, s, l, a]);

                if ( withColorStops )
                {
                    s2 = s.substr( end );
                    if ( m2 = s2.match(Color.colorstopRE) )
                    {
                        c.colorStop( m2[1] );
                        end2 = m2[0].length;
                    }
                }
                return onlyColor ? c : [c, 0, end+end2];
            }
            if ( 'rgb' === parsed || 
                ( !parsed && (m = s.match(Color.rgbRE)) ) 
            )
            {
                // rgb(a)
                if ( 'rgb' === parsed )
                {
                    hasOpacity = 'rgba' === s[0].toLowerCase();
                    var col = s[1].split(',').map(trim);
                }
                else
                {
                    end = m[0].length;
                    end2 = 0;
                    hasOpacity = 'rgba' === m[1].toLowerCase();
                    var col = m[2].split(',').map(trim);
                }    
                    
                var r = col[0] ? col[0] : '0';
                var g = col[1] ? col[1] : '0';
                var b = col[2] ? col[2] : '0';
                var a = hasOpacity && null!=col[3] ? col[3] : '1';
                
                r = ('%'===r.slice(-1)) ? parseFloat(r, 10)*2.55 : parseFloat(r, 10);
                g = ('%'===g.slice(-1)) ? parseFloat(g, 10)*2.55 : parseFloat(g, 10);
                b = ('%'===b.slice(-1)) ? parseFloat(b, 10)*2.55 : parseFloat(b, 10);
                a = parseFloat(a, 10);
                
                c = new Color().fromRGB([r, g, b, a]);

                if ( withColorStops )
                {
                    s2 = s.substr( end );
                    if ( m2 = s2.match(Color.colorstopRE) )
                    {
                        c.colorStop( m2[1] );
                        end2 = m2[0].length;
                    }
                }
                return onlyColor ? c : [c, 0, end+end2];
            }
            if ( 'hex' === parsed || 
                ( !parsed && (m = s.match(Color.hexRE)) ) 
            )
            {
                // hex
                if ( 'hex' === parsed )
                {
                    var col = Color.hex2rgb( s[0] );
                }
                else
                {
                    end = m[0].length;
                    end2 = 0;
                    var col = Color.hex2rgb( m[1] );
                }    
                    
                var h1 = col[0] ? col[0] : 0x00;
                var h2 = col[1] ? col[1] : 0x00;
                var h3 = col[2] ? col[2] : 0x00;
                var a = null!=col[3] ? col[3] : 0xff;
                
                c = new Color().fromHEX([h1, h2, h3, a]);

                if ( withColorStops )
                {
                    s2 = s.substr( end );
                    if ( m2 = s2.match(Color.colorstopRE) )
                    {
                        c.colorStop( m2[1] );
                        end2 = m2[0].length;
                    }
                }
                return onlyColor ? c : [c, 0, end+end2];
            }
            if ( 'keyword' === parsed || 
                ( !parsed && (m = s.match(Color.keywordRE)) ) 
            )
            {
                // keyword
                if ( 'keyword' === parsed )
                {
                    var col = s[0];
                }
                else
                {
                    end = m[0].length;
                    end2 = 0;
                    var col = m[1];
                }    
                    
                c = new Color().fromKeyword(col);

                if ( withColorStops )
                {
                    s2 = s.substr( end );
                    if ( m2 = s2.match(Color.colorstopRE) )
                    {
                        c.colorStop( m2[1] );
                        end2 = m2[0].length;
                    }
                }
                return onlyColor ? c : [c, 0, end+end2];
            }
            return null;
        },
        fromString: function( s, withColorStops, parsed ) {
            return Color.parse(s, withColorStops, parsed, 1);
        },
        fromRGB: function( rgb ) {
            return new Color().fromRGB(rgb);
        },
        fromHSL: function( hsl ) {
            return new Color().fromHSL(hsl);
        },
        fromCMYK: function( cmyk ) {
            return new Color().fromCMYK(cmyk);
        },
        fromHEX: function( hex ) {
            return new Color().fromHEX(hex);
        },
        fromKeyword: function( keyword ) {
            return new Color().fromKeyword(keyword);
        },
        fromPixel: function(pixCol) {
            return new Color().fromPixel(pixCol);
        }
    },
    
    constructor: function Color( color, cstop ) {
        // constructor factory pattern used here also
        if ( this instanceof Color ) 
        {
            this.reset( );
            if ( color ) this.set( color, cstop );
        } 
        else 
        {
            return new Color( color, cstop );
        }
    },
    
    name: "Color",
    col: null,
    cstop: null,
    kword: null,
    
    clone: function( ) {
        var c = new Color();
        c.col = this.col.slice();
        c.cstop = this.cstop+'';
        c.kword = this.kword;
        return c;
    },
    
    reset: function( ) {
        this.col = [0, 0, 0, 1];
        this.cstop = '';
        this.kword = null;
        return this;
    },
    
    set: function( color, cstop ) {
        if ( color )
        {
            if ( undef !== color[0] )
                this.col[0] = clamp(color[0], 0, 255);
            if ( undef !== color[1] )
                this.col[1] = clamp(color[1], 0, 255);
            if ( undef !== color[2] )
                this.col[2] = clamp(color[2], 0, 255);
            if ( undef !== color[3] )
                this.col[3] = clamp(color[3], 0, 1);
            else
                this.col[3] = 1;
                
            if (cstop)
                this.cstop = cstop;
                
            this.kword = null;
        }
        return this;
    },
    
    colorStop: function( cstop ) {
        this.cstop = cstop;
        return this;
    },
    
    isTransparent: function( ) {
        return 1 > this.col[3];
    },
    
    isKeyword: function( ) {
        return this.kword ? true : false;
    },
    
    fromPixel: function( color ) {
        color = color || 0;
        this.col = [
            clamp((color>>16)&255, 0, 255),
            clamp((color>>8)&255, 0, 255),
            clamp((color)&255, 0, 255),
            clamp(((color>>24)&255)*C2F, 0, 1)
        ];
        this.kword = null;
        
        return this;
    },
    
    fromKeyword: function( kword ) {
        
        kword = kword.toLowerCase();
        if ( Color.Keywords[kword] )
        {
            this.col = Color.Keywords[kword].slice();
            this.kword = kword;
        }
        return this;
    },
    
    fromHEX: function( hex ) {
        
        this.col[0] = hex[0] ? clamp(parseInt(hex[0], 10), 0, 255) : 0;
        this.col[1] = hex[1] ? clamp(parseInt(hex[1], 10), 0, 255) : 0;
        this.col[2] = hex[2] ? clamp(parseInt(hex[2], 10), 0, 255) : 0;
        this.col[3] = undef!==hex[3] ? clamp(parseInt(hex[3], 10)*C2F, 0, 1) : 1;
        
        this.kword = null;
        
        return this;
    },
    
    fromRGB: function( rgb ) {
        
        this.col[0] = rgb[0] ? clamp(round(rgb[0]), 0, 255) : 0;
        this.col[1] = rgb[1] ? clamp(round(rgb[1]), 0, 255) : 0;
        this.col[2] = rgb[2] ? clamp(round(rgb[2]), 0, 255) : 0;
        this.col[3] = undef!==rgb[3] ? clamp(rgb[3], 0, 1) : 1;
        
        this.kword = null;
        
        return this;
    },
    
    fromCMYK: function( cmyk ) {
        var rgb = Color.cmyk2rgb(cmyk[0]||0, cmyk[1]||0, cmyk[2]||0, cmyk[3]||0);
        
        this.col[0] = rgb[0];
        this.col[1] = rgb[1];
        this.col[2] = rgb[2];
        this.col[3] = undef!==cmyk[4] ? clamp(cmyk[4], 0, 1) : 1;
        
        this.kword = null;
        
        return this;
    },
    
    fromHSL: function( hsl ) {
        var rgb = Color.hsl2rgb(hsl[0]||0, hsl[1]||0, hsl[2]||0);
        
        this.col[0] = rgb[0];
        this.col[1] = rgb[1];
        this.col[2] = rgb[2];
        this.col[3] = undef!==hsl[3] ? clamp(hsl[3], 0, 1) : 1;
        
        this.kword = null;
        
        return this;
    },
    
    toPixel: function( withTransparency ) {
        if ( withTransparency )
            return ((clamp(this.col[3]*255, 0, 255) << 24) | (this.col[0] << 16) | (this.col[1] << 8) | (this.col[2])&255);
        else
            return ((this.col[0] << 16) | (this.col[1] << 8) | (this.col[2])&255);
    },
    
    toCMYK: function( asString, condenced, noTransparency ) {
        var cmyk = Color.rgb2cmyk(this.col[0], this.col[1], this.col[2]);
        if (noTransparency)
            return cmyk;
        else
            return cmyk.concat(this.col[3]);
    },
    
    toKeyword: function( asString, condenced, withTransparency ) {
        if ( this.kword )
            return this.kword;
        else
            return this.toHEX(1, condenced, withTransparency);
    },
    
    toHEX: function( asString, condenced, withTransparency ) {
        if ( withTransparency )
            return Color.rgb2hexIE( this.col[0], this.col[1], this.col[2], clamp(round(255*this.col[3]), 0, 255) );
        else
            return Color.rgb2hex( this.col[0], this.col[1], this.col[2], condenced );
    },
    
    toRGB: function( asString, condenced, noTransparency ) {
        var opcty = this.col[3];
        if ( asString )
        {
            if ( condenced )
            {
                opcty =  ((1 > opcty && opcty > 0) ? opcty.toString().slice(1) : opcty );
            }
            
            if ( noTransparency || 1 == this.col[3] )
                return 'rgb(' + this.col.slice(0, 3).join(',') + ')';
            else
                return 'rgba(' + this.col.slice(0, 3).concat(opcty).join(',') + ')';
        }
        else
        {
            if ( noTransparency )
                return this.col.slice(0, 3);
            else
                return this.col.slice();
        }
    },
    
    toHSL: function( asString, condenced, noTransparency ) {
        var opcty = this.col[3];
        var hsl = Color.rgb2hsl(this.col[0], this.col[1], this.col[2]);
        
        if ( asString )
        {
            if ( condenced )
            {
                hsl[1] = (0==hsl[1] ? hsl[1] : (hsl[1]+'%'));
                hsl[2] = (0==hsl[2] ? hsl[2] : (hsl[2]+'%'));
                opcty =  ((1 > opcty && opcty > 0) ? opcty.toString().slice(1) : opcty );
            }
            
            if ( noTransparency || 1 == this.col[3] )
                return 'hsl(' + [hsl[0], hsl[1], hsl[2]].join(',') + ')';
            else
                return 'hsla(' + [hsl[0], hsl[1], hsl[2], opcty].join(',') + ')';
        }
        else
        {
            if ( noTransparency )
                return hsl;
            else
                return hsl.concat( this.col[3] );
        }
    },
    
    toColorStop: function( compatType ) {
        var cstop = this.cstop;
        if ( compatType )
        {
            cstop = cstop.length ? (cstop+',') : '';
            if ( 1 > this.col[3] )
                return 'color-stop(' + cstop + this.toRGB(1,1) + ')';
            else
                return 'color-stop(' + cstop + this.toHEX(1,1) + ')';
        }
        else
        {
            cstop = cstop.length ? (' '+cstop) : '';
            if ( 1 > this.col[3] )
                return this.toRGB(1,1) + cstop;
            else
                return this.toHEX(1,1) + cstop;
        }
    },
    
    toString: function( format, condenced ) {
        format = format ? format.toLowerCase() : 'hex';
        if ( 'rgb' == format || 'rgba' == format )
        {
            return this.toRGB(1, false!==condenced, 'rgb' == format);
        }
        else if ( 'hsl' == format || 'hsla' == format )
        {
            return this.toHSL(1, false!==condenced, 'hsl' == format);
        }
        else if ( 'keyword' == format )
        {
            return this.toKeyword(1);
        }
        return this.toHEX(1, false!==condenced, 'hexie' == format);
    }
});

Color.toGray = Color.intensity;
// JavaScript implementations of common image blending modes, based on
// http://stackoverflow.com/questions/5919663/how-does-photoshop-blend-two-images-together
Color.Blend = Color.Combine = {
    //p1 = p1 || 0; p2 = p2 || 0;
    
    normal: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
        
        // normal mode
        rb = r2;  
        gb = g2;  
        bb = b2;
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    lighten: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
        
        // lighten mode
        rb = r > r2 ? r : r2; 
        gb = g > g2 ? g : g2; 
        bb = b > b2 ? b : b2; 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    darken: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // darken mode
        rb = r > r2 ? r2 : r; 
        gb = g > g2 ? g2 : g; 
        bb = b > b2 ? b2 : b; 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    multiply: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // multiply mode
        rb = r * r2 * 0.003921568627451;
        gb = g * g2 * 0.003921568627451;
        bb = b * b2 * 0.003921568627451;
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    average: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // average mode
        rb = 0.5*(r + r2); 
        gb = 0.5*(g + g2); 
        bb = 0.5*(b + b2); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    add: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // add mode
        rb = r + r2; 
        gb = g + g2; 
        bb = b + b2; 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    subtract: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // subtract mode
        rb = r + r2 < 255 ? 0 : r + r2 - 255;  
        gb = g + g2 < 255 ? 0 : g + g2 - 255;  
        bb = b + b2 < 255 ? 0 : b + b2 - 255;  
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    difference: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // difference mode
        rb = abs(r2 - r); 
        gb = abs(g2 - g); 
        bb = abs(b2 - b); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    negation: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // negation mode
        rb = 255 - abs(255 - r2 - r);
        gb = 255 - abs(255 - g2 - g);
        bb = 255 - abs(255 - b2 - b);
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    screen: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // screen mode
        rb = 255 - (((255 - r2) * (255 - r)) >> 8); 
        gb = 255 - (((255 - g2) * (255 - g)) >> 8); 
        bb = 255 - (((255 - b2) * (255 - b)) >> 8); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    exclusion: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // exclusion mode
        rb = r2 + r - 2 * r2 * r * 0.003921568627451; 
        gb = g2 + g - 2 * g2 * g * 0.003921568627451; 
        bb = b2 + b - 2 * b2 * b * 0.003921568627451; 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    overlay: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // overlay mode
        rb = r < 128 ? (2 * r2 * r * 0.003921568627451) : (255 - 2 * (255 - r2) * (255 - r) * 0.003921568627451); 
        gb = g < 128 ? (2 * g2 * g * 0.003921568627451) : (255 - 2 * (255 - g2) * (255 - g) * 0.003921568627451); 
        rb = b < 128 ? (2 * b2 * b * 0.003921568627451) : (255 - 2 * (255 - b2) * (255 - b) * 0.003921568627451); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    softlight: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // softlight mode
        rb = r < 128 ? (2 * ((r2 >> 1) + 64)) * (r * 0.003921568627451) : 255 - (2 * (255 - (( r2 >> 1) + 64)) * (255 - r) * 0.003921568627451); 
        gb = g < 128 ? (2 * ((g2 >> 1) + 64)) * (g * 0.003921568627451) : 255 - (2 * (255 - (( g2 >> 1) + 64)) * (255 - g) * 0.003921568627451); 
        bb = b < 128 ? (2 * ((b2 >> 1) + 64)) * (b * 0.003921568627451) : 255 - (2 * (255 - (( b2 >> 1) + 64)) * (255 - b) * 0.003921568627451); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    // reverse of overlay
    hardlight: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // hardlight mode, reverse of overlay
        rb = r2 < 128 ? (2 * r * r2 * 0.003921568627451) : (255 - 2 * (255 - r) * (255 - r2) * 0.003921568627451); 
        gb = g2 < 128 ? (2 * g * g2 * 0.003921568627451) : (255 - 2 * (255 - g) * (255 - g2) * 0.003921568627451); 
        bb = b2 < 128 ? (2 * b * b2 * 0.003921568627451) : (255 - 2 * (255 - b) * (255 - b2) * 0.003921568627451); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    colordodge: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // colordodge mode
        rb = 255 === r ? r : min(255, ((r2 << 8 ) / (255 - r))); 
        gb = 255 === g ? g : min(255, ((g2 << 8 ) / (255 - g))); 
        bb = 255 === b ? b : min(255, ((b2 << 8 ) / (255 - b))); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    colorburn: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // colorburn mode
        rb = 0 === r ? r : max(0, (255 - ((255 - r2) << 8 ) / r)); 
        gb = 0 === g ? g : max(0, (255 - ((255 - g2) << 8 ) / g)); 
        bb = 0 === b ? b : max(0, (255 - ((255 - b2) << 8 ) / b)); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    linearlight: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb, tmp,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // linearlight mode
        if ( r < 128 )
        {
            tmp = r*2;
            rb = tmp + r2 < 255 ? 0 : tmp + r2 - 255; //linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r - 128);
            rb = tmp + r2; //linearDodge(a, (2 * (b - 128)))
        }
        if ( g < 128 )
        {
            tmp = g*2;
            gb = tmp + g2 < 255 ? 0 : tmp + g2 - 255; //linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g - 128);
            gb = tmp + g2; //linearDodge(a, (2 * (b - 128)))
        }
        if ( b < 128 )
        {
            tmp = b*2;
            bb = tmp + b2 < 255 ? 0 : tmp + b2 - 255; //linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (b - 128);
            bb = tmp + b2; //linearDodge(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    reflect: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // reflect mode
        rb = 255 === r ? r : min(255, (r2 * r2 / (255 - r))); 
        gb = 255 === g ? g : min(255, (g2 * g2 / (255 - g))); 
        bb = 255 === b ? b : min(255, (b2 * b2 / (255 - b))); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    // reverse of reflect
    glow: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // glow mode, reverse of reflect
        rb = 255 === r2 ? r2 : min(255, (r * r / (255 - r2))); 
        gb = 255 === g2 ? g2 : min(255, (g * g / (255 - g2))); 
        bb = 255 === b2 ? b2 : min(255, (b * b / (255 - b2))); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    phoenix: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // phoenix mode
        rb = min(r2, r) - max(r2, r) + 255; 
        gb = min(g2, g) - max(g2, g) + 255; 
        bb = min(b2, b) - max(b2, b) + 255; 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    vividlight: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb, tmp,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // vividlight mode
        if ( r < 128 )
        {
            tmp = 2*r;
            rb = 0 === tmp ? tmp : max(0, (255 - ((255 - r2) << 8 ) / tmp));  //colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            rb = 255 === tmp ? tmp : min(255, ((r2 << 8 ) / (255 - tmp)));  // colorDodge(a, (2 * (b - 128)))
        }
        if ( g < 128 )
        {
            tmp = 2*g;
            gb = 0 === tmp ? tmp : max(0, (255 - ((255 - g2) << 8 ) / tmp));  //colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g-128);
            gb = 255 === tmp ? tmp : min(255, ((g2 << 8 ) / (255 - tmp)));  // colorDodge(a, (2 * (b - 128)))
        }
        if ( b < 128 )
        {
            tmp = 2*b;
            bb = 0 === tmp ? tmp : max(0, (255 - ((255 - b2) << 8 ) / tmp));  //colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g-128);
            bb = 255 === tmp ? tmp : min(255, ((b2 << 8 ) / (255 - tmp)));  // colorDodge(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    pinlight: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb, tmp,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // pinlight mode
        if ( r < 128 )
        {
            tmp = 2*r;
            rb = tmp > r2 ? tmp : r2;  //darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            rb = tmp > r2 ? r2 : tmp;  // lighten(a, (2 * (b - 128)))
        }
        if ( g < 128 )
        {
            tmp = 2*g;
            gb = tmp > g2 ? tmp : g2;  //darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            gb = tmp > g2 ? g2 : tmp;  // lighten(a, (2 * (b - 128)))
        }
        if ( b < 128 )
        {
            tmp = 2*b;
            bb = tmp > b2 ? tmp : b2;  //darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (b-128);
            bb = tmp > b2 ? b2 : tmp;  // lighten(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    hardmix: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb, tmp,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // hardmix mode, blendModes.vividLight(a, b) < 128 ? 0 : 255;
        if ( r < 128 )
        {
            tmp = 2*r;
            rb = 0 === tmp ? tmp : max(0, (255 - ((255 - r2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (r-128);
            rb = 255 === tmp ? tmp : min(255, ((r2 << 8 ) / (255 - tmp)));
        }
        rb = rb < 128 ? 0 : 255;
        if ( g < 128 )
        {
            tmp = 2*g;
            gb = 0 === tmp ? tmp : max(0, (255 - ((255 - g2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (g-128);
            gb = 255 === tmp ? tmp : min(255, ((g2 << 8 ) / (255 - tmp)));
        }
        gb = gb < 128 ? 0 : 255;
        if ( b < 128 )
        {
            tmp = 2*b;
            bb = 0 === tmp ? tmp : max(0, (255 - ((255 - b2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (b-128);
            bb = 255 === tmp ? tmp : min(255, ((b2 << 8 ) / (255 - tmp)));
        }
        bb = bb < 128 ? 0 : 255;
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    }
};
// aliases
Color.Blend.lineardodge = Color.Blend.add;
Color.Blend.linearburn = Color.Blend.subtract;
 
}(FILTER);/**
*
* Canvas Proxy Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var CanvasProxy, CanvasProxyCtx, IMG = FILTER.ImArray, ImageUtil = FILTER.Util.Image,
    Color = FILTER.Color, Min = Math.min, Max = Math.max, resize = FILTER.Interpolation.bilinear,
    get = ImageUtil.get_data, set = ImageUtil.set_data, fill = ImageUtil.fill
;

function scale( d, w, h, nw, nh )
{
    return (w === nw) && (h === nh) ? d : resize( d, w, h, nw, nh );
}

CanvasProxyCtx = FILTER.Class({
    constructor: function CanvasProxyCtx( canvas ) {
        var self = this;
        self._cnv = canvas;
        self._transform = {scale:[1,1], translate:[0,0], rotate:[0,0]};
        self._data = null;
    },
    
    _cnv: null,
    _w: 0, _h: 0,
    _transform: null,
    _data: null,
    fillStyle: null,
    
    dispose: function( ) {
        var self = this;
        self._cnv = null;
        self._data = null;
        self._transform = null;
        return self;
    },
    
    fillRect: function( x, y, w, h ) {
        var self = this, W = self._w, H = self._h, col, fillStyle = self.fillStyle;
        if ( null == x ) x = 0;
        if ( null == y ) y = 0;
        if ( null == w ) w = W;
        if ( null == h ) h = H;
        if ( fillStyle === +fillStyle )
        {
            col = Color.Color2RGBA( fillStyle, [0,0,0,0], 0 );
        }
        else if ( fillStyle && fillStyle.substr )
        {
            col = Color.fromString( fillStyle ).toRGB( false );
            col[3] = ~~(255*col[3]);
        }
        else
        {
            col = fillStyle && (2 < fillStyle.length) ? fillStyle : [0,0,0,0];
        }
        fill( self._data, W, H, col, x, y, x+w-1, y+h-1 );
    },
    
    clearRect: function( x, y, w, h ) {
        var self = this, W = self._w, H = self._h;
        if ( null == x ) x = 0;
        if ( null == y ) y = 0;
        if ( null == w ) w = W;
        if ( null == h ) h = H;
        fill( self._data, W, H, [0,0,0,0], x, y, x+w-1, y+h-1 );
    },
    
    drawImage: function( canvas, sx, sy, sw, sh, dx, dy, dw, dh ) {
        var self = this, W = self._w, H = self._h,
            w = canvas._ctx._w, h = canvas._ctx._h,
            idata = canvas._ctx._data,
            argslen = arguments.length
        ;
        if ( 3 === argslen )
        {
            dx = sx; dy = sy;
            set( self._data, W, H, idata, w, h, 0, 0, w-1, h-1, dx, dy );
        }
        else if ( 5 === argslen )
        {
            dx = sx; dy = sy;
            dw = sw; dh = sh;
            set( self._data, W, H, scale( idata, w, h, dw, dh ), dw, dh, 0, 0, dw-1, dh-1, dx, dy );
        }
        else
        {
            set( self._data, W, H, scale( get( idata, w, h, sx, sy, sx+sw-1, sy+sh-1, true ), sw, sh, dw, dh ), dw, dh, 0, 0, dw-1, dh-1, dx, dy );
        }
    },
    
    createImageData: function( w, h ) {
        var self = this;
        self._data = new IMG((w*h)<<2);
        self._w = w; self._h = h;
        fill( self._data, w, h, [0,0,0,0], 0, 0, w-1, h-1 );
        return self;
    },
    
    putImageData: function( data, x, y ) {
        var self = this, W = self._w, H = self._h,
            w = data.width, h = data.height;
        if ( null == x ) x = 0;
        if ( null == y ) y = 0;
        set( self._data, W, H, data.data, w, h, 0, 0, w-1, h-1, x, y );
    },
    
    getImageData: function( x, y, w, h ) {
        var self = this, W = self._w, H = self._h, x1, y1, x2, y2;
        if ( null == x ) x = 0;
        if ( null == y ) y = 0;
        if ( null == w ) w = W;
        if ( null == h ) h = H;
        x1 = Max(0, Min(x, w-1, W-1));
        y1 = Max(0, Min(y, h-1, H-1));
        x2 = Min(x1+w-1, w-1, W-1);
        y2 = Min(y1+h-1, h-1, H-1);
        return {data: get( self._data, W, H, x1, y1, x2, y2 ), width: x2-x1+1, height: y2-y1+1};
    },
    
    scale: function( sx, sy ) {
        var self = this;
        self._transform.scale[0] = sx;
        self._transform.scale[1] = sy;
        return self;
    },
    
    translate: function( tx, ty ) {
        var self = this;
        self._transform.translate[0] = tx;
        self._transform.translate[1] = ty;
        return self;
    }
});

CanvasProxy = FILTER.CanvasProxy = FILTER.Class({
    constructor: function CanvasProxy( w, h ) {
        var self = this;
        self.width = w || 0;
        self.height = h || 0;
        self.style = { };
        self._ctx = new CanvasProxyCtx( self );
    },
    
    _ctx: null,
    width: null,
    height: null,
    style: null,
    
    dispose: function( ) {
        var self = this;
        self.width = null;
        self.height = null;
        self.style = null;
        self._ctx.dispose( );
        self._ctx = null;
        return self;
    },
    
    getContext: function( context ) {
        return this._ctx;
    },
    
    toDataURL: function( mime ) {
        return '';
    }
});

FILTER.Canvas = function( w, h ) {
    var canvas = FILTER.Browser.isNode ? new CanvasProxy( ) : document.createElement( 'canvas' );
    w = w || 0; h = h || 0;
    
    // set the display size of the canvas.
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
     
    // set the size of the drawingBuffer
    canvas.width = w * FILTER.devicePixelRatio;
    canvas.height = h * FILTER.devicePixelRatio;
    
    return canvas;
};

}(FILTER);/**
*
* Image Proxy Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var PROTO = 'prototype', devicePixelRatio = FILTER.devicePixelRatio,
    IMG = FILTER.ImArray, IMGcpy = FILTER.ImArrayCopy, A32F = FILTER.Array32F,
    ImageUtil = FILTER.Util.Image, Canvas = FILTER.Canvas, CanvasProxy = FILTER.CanvasProxy,
    FORMAT = FILTER.FORMAT, MIME = FILTER.MIME, ID = 0,
    notSupportTyped = FILTER._notSupportTypedArrays,
    arrayset = FILTER.Util.Array.arrayset, subarray = FILTER.Util.Array.subarray,
    Min = Math.min, Floor = Math.floor,

    IDATA = 1, ODATA = 2, ISEL = 4, OSEL = 8, HIST = 16, SAT = 32, SPECTRUM = 64,
    WIDTH = 2, HEIGHT = 4, WIDTH_AND_HEIGHT = WIDTH | HEIGHT,
    SEL = ISEL|OSEL, DATA = IDATA|ODATA,
    CLEAR_DATA = ~DATA, CLEAR_SEL = ~SEL,
    CLEAR_HIST = ~HIST, CLEAR_SAT = ~SAT, CLEAR_SPECTRUM = ~SPECTRUM
;

// auxilliary (private) methods
function tmp_canvas( scope ) 
{
    var w = scope.width, h = scope.height, cnv = Canvas( w, h );
    cnv.width = w * devicePixelRatio;
    cnv.height = h * devicePixelRatio;
    return cnv;
}

function set_dimensions( scope, w, h, what ) 
{
    what = what || WIDTH_AND_HEIGHT;
    if ( what & WIDTH )
    {
        scope.width = w;
        scope.oCanvas.style.width = w + 'px';
        scope.oCanvas.width = w * devicePixelRatio;
        if ( scope._restorable ) 
        {
        scope.iCanvas.style.width = scope.oCanvas.style.width;
        scope.iCanvas.width = scope.oCanvas.width;
        }
        if ( scope.tmpCanvas )
        {
            scope.tmpCanvas.style.width = scope.oCanvas.style.width;
            scope.tmpCanvas.width = scope.oCanvas.width;
        }
    }
    if ( what & HEIGHT )
    {
        scope.height = h;
        scope.oCanvas.style.height = h + 'px';
        scope.oCanvas.height = h * devicePixelRatio;
        if ( scope._restorable ) 
        {
        scope.iCanvas.style.height = scope.oCanvas.style.height;
        scope.iCanvas.height = scope.oCanvas.height;
        }
        if ( scope.tmpCanvas )
        {
            scope.tmpCanvas.style.height = scope.oCanvas.style.height;
            scope.tmpCanvas.height = scope.oCanvas.height;
        }
    }
    return scope;
}

function refresh_data( scope, what ) 
{
    var w = scope.width, h = scope.height;
    what = what || 255;
    if ( scope._restorable && (what & IDATA) && (scope._needsRefresh & IDATA) )
    {
        scope.iData = scope.ictx.getImageData(0, 0, w, h);
        scope._needsRefresh &= ~IDATA;
    }
    if ( (what & ODATA) && (scope._needsRefresh & ODATA) )
    {
        scope.oData = scope.octx.getImageData(0, 0, w, h);
        scope._needsRefresh &= ~ODATA;
    }
    //scope._needsRefresh &= CLEAR_DATA;
    return scope;
}

function refresh_selected_data( scope, what ) 
{
    if ( scope.selection )
    {
        var sel = scope.selection, ow = scope.width-1, oh = scope.height-1,
            xs = Floor(sel[0]*ow), ys = Floor(sel[1]*oh), 
            ws = Floor(sel[2]*ow)-xs+1, hs = Floor(sel[3]*oh)-ys+1
        ;
        what = what || 255;
        if ( scope._restorable && (what & ISEL) && (scope._needsRefresh & ISEL) )
        {
            scope.iDataSel = scope.ictx.getImageData(xs, ys, ws, hs);
            scope._needsRefresh &= ~ISEL;
        }
        if ( (what & OSEL) && (scope._needsRefresh & OSEL) )
        {
            scope.oDataSel = scope.octx.getImageData(xs, ys, ws, hs);
            scope._needsRefresh &= ~OSEL;
        }
    }
    //scope._needsRefresh &= CLEAR_SEL;
    return scope;
}
    
//
// Image (Proxy) Class
var FilterImage = FILTER.Image = FILTER.Class({
    name: "Image"
    
    ,constructor: function FilterImage( img ) {
        var self = this, w = 0, h = 0;
        // factory-constructor pattern
        if ( !(self instanceof FilterImage) ) return new FilterImage(img);
        self.id = ++ID;
        self.width = w; self.height = h;
        self.iData = null; self.iDataSel = null;
        self.oData = null; self.oDataSel = null;
        self.iCanvas = Canvas(w, h);
        self.oCanvas = Canvas(w, h);
        self.tmpCanvas = null;
        self.domElement = self.oCanvas;
        self.ictx = self.iCanvas.getContext('2d');
        self.octx = self.oCanvas.getContext('2d');
        self.webgl = null;
        self._histogram = [null, null, null, null];
        self._integral = [null, null, null, null];
        self._spectrum = [null, null, null, null];
        self._histogramRefresh = [0, 0, 0, 0];
        self._integralRefresh = [0, 0, 0, 0];
        self._spectrumRefresh = [0, 0, 0, 0];
        // lazy
        self.selection = null;
        self._needsRefresh = 0;
        self._restorable = true;
        self._grayscale = false;
        if ( img ) self.image( img );
    }
    
    // properties
    ,id: null
    ,width: 0
    ,height: 0
    ,selection: null
    ,iCanvas: null
    ,oCanvas: null
    ,tmpCanvas: null
    ,ictx: null
    ,octx: null
    ,iData: null
    ,iDataSel: null
    ,oData: null
    ,oDataSel: null
    ,domElement: null
    ,webgl: null
    ,_histogram: null
    ,_integral: null
    ,_spectrum: null
    ,_needsRefresh: 0
    ,_restorable: true
    ,_grayscale: false
    
    ,dispose: function( ) {
        var self = this;
        self.id = null;
        self.width = null;
        self.height = null;
        self.selection = null;
        self.ictx = null;
        self.octx = null;
        self.iData = null;
        self.iDataSel = null;
        self.oData = null;
        self.oDataSel = null;
        self.iCanvas = null;
        self.oCanvas = null;
        self.tmpCanvas = null;
        self.domElement = null;
        self.webgl = null;
        self._histogram = null;
        self._integral = null;
        self._spectrum = null;
        self._histogramRefresh = null;
        self._integralRefresh = null;
        self._spectrumRefresh = null;
        self._needsRefresh = null;
        self._restorable = null;
        self._grayscale = null;
        return self;
    }
    
    ,clone: function( original ) {
        return new FilterImage(true === original ? this.iCanvas : this.oCanvas);
    }
    
    ,grayscale: function( bool ) {
        var self = this;
        if ( !arguments.length )  return self._grayscale;
        self._grayscale = !!bool;
        return self;
    }
    
    ,restorable: function( enabled ) {
        var self = this;
        if ( !arguments.length ) enabled = true;
        self._restorable = !!enabled;
        return self;
    }
    
    // apply a filter (uses filter's own apply method)
    ,apply: function( filter, cb ) {
        filter.apply( this, this, cb || null );
        return this;
    }
    
    // apply2 a filter using another image as destination
    ,apply2: function( filter, destImg, cb ) {
        filter.apply( this, destImg, cb || null );
        return this;
    }
    
    ,select: function( x1, y1, x2, y2 ) {
        var self = this, argslen = arguments.length;
        // default
        if ( argslen < 1 ) x1 = 0;
        if ( argslen < 2 ) y1 = 0;
        if ( argslen < 3 ) x2 = 1;
        if ( argslen < 4 ) y2 = 1;
        // select
        self.selection = [ 
            // clamp
            0 > x1 ? 0 : (1 < x1 ? 1 : x1),
            0 > y1 ? 0 : (1 < y1 ? 1 : y1),
            0 > x2 ? 0 : (1 < x2 ? 1 : x2),
            0 > y2 ? 0 : (1 < y2 ? 1 : y2)
        ];
        self._needsRefresh |= SEL;
        return self;
    }
    
    ,deselect: function( ) {
        var self = this;
        self.selection = null;
        self.iDataSel = null;
        self.oDataSel = null;
        self._needsRefresh &= CLEAR_SEL;
        return self;
    }
    
    // store the processed/filtered image as the original image
    // make the processed image the original image
    ,store: function( ) {
        var self = this;
        if ( self._restorable )
        {
            self.ictx.drawImage(self.oCanvas, 0, 0); 
            self._needsRefresh |= IDATA;
            if (self.selection) self._needsRefresh |= ISEL;
        }
        return self;
    }
    
    // restore the original image
    // remove any filters applied to original image
    ,restore: function( ) {
        var self = this;
        if ( self._restorable )
        {
            self.octx.drawImage(self.iCanvas, 0, 0); 
            self._needsRefresh |= ODATA | HIST | SAT | SPECTRUM;
            self._histogramRefresh = [1, 1, 1, 1];
            self._integralRefresh = [1, 1, 1, 1];
            self._spectrumRefresh = [1, 1, 1, 1];
            if (self.selection) self._needsRefresh |= OSEL;
        }
        return self;
    }
    
    ,dimensions: function( w, h ) {
        var self = this;
        set_dimensions(self, w, h, WIDTH_AND_HEIGHT);
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,scale: function( sx, sy ) {
        var self = this;
        sx = sx||1; sy = sy||sx;
        if ( 1==sx && 1==sy ) return self;
        
        // lazy
        self.tmpCanvas = self.tmpCanvas || tmp_canvas( self );
        var ctx = self.tmpCanvas.getContext('2d'),
            w = self.width, h = self.height;
        
        //ctx.save();
        ctx.scale(sx, sy);
        w = self.width = ~~(sx*w+0.5);
        h = self.height = ~~(sy*h+0.5);
        
        ctx.drawImage(self.oCanvas, 0, 0);
        self.oCanvas.style.width = w + 'px';
        self.oCanvas.style.height = h + 'px';
        self.oCanvas.width = w * devicePixelRatio;
        self.oCanvas.height = h * devicePixelRatio;
        self.octx.drawImage(self.tmpCanvas, 0, 0);
        
        if ( self._restorable )
        {
        ctx.drawImage(self.iCanvas, 0, 0);
        self.iCanvas.style.width = self.oCanvas.style.width;
        self.iCanvas.style.height = self.oCanvas.style.height;
        self.iCanvas.width = self.oCanvas.width;
        self.iCanvas.height = self.oCanvas.height;
        self.ictx.drawImage(self.tmpCanvas, 0, 0);
        }
        
        self.tmpCanvas.width = self.oCanvas.width;
        self.tmpCanvas.height = self.oCanvas.height;
        //ctx.restore();
        
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,flipHorizontal: function( ) {
        var self = this;
        // lazy
        self.tmpCanvas = self.tmpCanvas || tmp_canvas( self );
        var ctx = self.tmpCanvas.getContext('2d');
        
        ctx.translate(self.width, 0); 
        ctx.scale(-1, 1);
        
        ctx.drawImage(self.oCanvas, 0, 0);
        self.octx.drawImage(self.tmpCanvas, 0, 0);
        
        if ( self._restorable )
        {
        ctx.drawImage(self.iCanvas, 0, 0);
        self.ictx.drawImage(self.tmpCanvas, 0, 0);
        }
        
        self._needsRefresh |= DATA | SAT | SPECTRUM;
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,flipVertical: function( ) {
        var self = this;
        // lazy
        self.tmpCanvas = self.tmpCanvas || tmp_canvas( self );
        var ctx = self.tmpCanvas.getContext('2d');
        
        ctx.translate(0, self.height); 
        ctx.scale(1, -1);
        
        ctx.drawImage(self.oCanvas, 0, 0);
        self.octx.drawImage(self.tmpCanvas, 0, 0);
        
        if ( self._restorable )
        {
        ctx.drawImage(self.iCanvas, 0, 0);
        self.ictx.drawImage(self.tmpCanvas, 0, 0);
        }
        
        self._needsRefresh |= DATA | SAT | SPECTRUM;
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    // TODO
    ,draw: function( drawable, x, y, blendMode ) {
        return this;
    }
    
    // clear the image contents
    ,clear: function( ) {
        var self = this, w = self.width, h = self.height;
        if ( w && h )
        {
            if ( self._restorable ) self.ictx.clearRect(0, 0, w, h);
            self.octx.clearRect(0, 0, w, h);
            self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
            self._histogramRefresh = [1, 1, 1, 1];
            self._integralRefresh = [1, 1, 1, 1];
            self._spectrumRefresh = [1, 1, 1, 1];
            if (self.selection) self._needsRefresh |= SEL;
        }
        return self;
    }
    
    // crop image region
    ,crop: function( x1, y1, x2, y2 ) {
        var self = this, sel = self.selection, 
            W = self.width, H = self.height, xs, ys, ws, hs,
            x, y, w, h
        ;
        if ( !arguments.length )
        {
            if (sel)
            {
                xs = Floor(sel[0]*(W-1)); ys = Floor(sel[1]*(H-1));
                ws = Floor(sel[2]*(W-1))-xs+1; hs = Floor(sel[3]*(H-1))-ys+1;
                x = xs; y = ys;
                w = ws; h = hs;
                sel[0] = 0; sel[1] = 0;
                sel[2] = 1; sel[3] = 1;
            }
            else
            {
                return self;
            }
        }
        else
        {
            x = x1; y = y1;
            w = x2-x1+1; h = y2-y1+1;
        }
        
        // lazy
        self.tmpCanvas = self.tmpCanvas || tmp_canvas( self );
        var ctx = self.tmpCanvas.getContext('2d');
        
        ctx.drawImage(self.oCanvas, 0, 0, W, H, x, y, w, h);
        self.oCanvas.style.width = w + 'px';
        self.oCanvas.style.height = h + 'px';
        self.oCanvas.width = w * devicePixelRatio;
        self.oCanvas.height = h * devicePixelRatio;
        self.octx.drawImage(self.tmpCanvas, 0, 0);
        
        if ( self._restorable )
        {
        ctx.drawImage(self.iCanvas, 0, 0, W, H, x, y, w, h);
        self.iCanvas.style.width = self.oCanvas.style.width;
        self.iCanvas.style.height = self.oCanvas.style.height;
        self.iCanvas.width = self.oCanvas.width;
        self.iCanvas.height = self.oCanvas.height;
        self.ictx.drawImage(self.tmpCanvas, 0, 0);
        }
        
        self.tmpCanvas.width = self.oCanvas.width;
        self.tmpCanvas.height = self.oCanvas.height;
        
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (sel) self._needsRefresh |= SEL;
        return self;
    }
        
    // fill image region with a specific (background) color
    ,fill: function( color, x, y, w, h ) {
        var self = this, sel = self.selection, 
            W = self.width, H = self.height, xs, ys, ws, hs
        ;
        if (sel)
        {
            xs = Floor(sel[0]*(W-1)); ys = Floor(sel[1]*(H-1));
            ws = Floor(sel[2]*(W-1))-xs+1; hs = Floor(sel[3]*(H-1))-ys+1;
        }
        else
        {
            xs = 0; ys = 0;
            ws = W; hs = H;
        }
        if ( undef === x ) x = xs;
        if ( undef === y ) y = ys;
        if ( undef === w ) w = ws;
        if ( undef === h ) h = hs;
        
        // create the image data if needed
        if (w && !W && h && !H) self.createImageData(w, h);
        
        var ictx = self.ictx, octx = self.octx;
        color = color||0; 
        /*x = x||0; y = y||0; 
        w = w||W; h = h||H;*/
        
        if ( self._restorable )
        {
        ictx.fillStyle = color;  
        ictx.fillRect(x, y, w, h);
        }
        
        octx.fillStyle = color;  
        octx.fillRect(x, y, w, h);
        
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (sel) self._needsRefresh |= SEL;
        return self;
    }
    
    // get direct data array
    ,getData: function( ) {
        var self = this, Data;
        if ( self._restorable )
        {
        if (self._needsRefresh & IDATA) refresh_data( self, IDATA );
        Data = self.iData;
        }
        else
        {
        if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
        Data = self.oData;
        }
        // clone it
        return new IMGcpy( Data.data );
    }
    
    // get direct data array of selected part
    ,getSelectedData: function( ) {
        var self = this, sel;
        
        if (self.selection)  
        {
            if ( self._restorable )
            {
            if (self._needsRefresh & ISEL) refresh_selected_data( self, ISEL );
            sel = self.iDataSel;
            }
            else
            {
            if (self._needsRefresh & OSEL) refresh_selected_data( self, OSEL );
            sel = self.oDataSel;
            }
        }
        else
        {
            if ( self._restorable )
            {
            if (self._needsRefresh & IDATA) refresh_data( self, IDATA );
            sel = self.iData;
            }
            else
            {
            if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
            sel = self.oData;
            }
        }
        // clone it
        return [new IMGcpy( sel.data ), sel.width, sel.height];
    }
    
    // get processed data array
    ,getProcessedData: function( ) {
        var self = this;
        if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
        // clone it
        return new IMGcpy( self.oData.data );
    }
    
    // get processed data array of selected part
    ,getProcessedSelectedData: function( ) {
        var self = this, sel;
        
        if (self.selection)  
        {
            if (self._needsRefresh & OSEL) refresh_selected_data( self, OSEL );
            sel = self.oDataSel;
        }
        else
        {
            if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
            sel = self.oData;
        }
        // clone it
        return [new IMGcpy( sel.data ), sel.width, sel.height];
    }
    
    // set direct data array
    ,setData: function(a) {
        var self = this;
        if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
        arrayset(self.oData.data, a); // not supported in Opera, IE, Safari
        self.octx.putImageData(self.oData, 0, 0); 
        self._needsRefresh |= HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= OSEL;
        return self;
    }
    
    // set direct data array of selected part
    ,setSelectedData: function(a) {
        var self = this;
        if (self.selection)
        {
            var sel = self.selection, ow = self.width-1, oh = self.height-1,
                xs = Floor(sel[0]*ow), ys = Floor(sel[1]*oh);
            if (self._needsRefresh & OSEL) refresh_selected_data( self, OSEL );
            arrayset(self.oDataSel.data, a); // not supported in Opera, IE, Safari
            self.octx.putImageData(self.oDataSel, xs, ys); 
            self._needsRefresh |= ODATA;
        }
        else
        {
            if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
            arrayset(self.oData.data, a); // not supported in Opera, IE, Safari
            self.octx.putImageData(self.oData, 0, 0); 
        }
        self._needsRefresh |= HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        return self;
    }
    
    ,createImageData: function( w, h ) {
        var self = this, ictx, octx;
        set_dimensions(self, w, h, WIDTH_AND_HEIGHT);
        if ( self._restorable ) 
        {
        ictx = self.ictx = self.iCanvas.getContext('2d');
        ictx.createImageData(w, h);
        }
        octx = self.octx = self.oCanvas.getContext('2d');
        octx.createImageData(w, h);
        self._needsRefresh |= DATA;
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,image: function( img ) {
        if ( !img ) return this;
        
        var self = this, ictx, octx, w, h, 
            isVideo, isCanvas, isImage//, isImageData
        ;
        
        if ( img instanceof FilterImage ) img = img.oCanvas;
        isVideo = ("undefined" !== typeof HTMLVideoElement) && (img instanceof HTMLVideoElement);
        isCanvas = (("undefined" !== typeof HTMLCanvasElement) && (img instanceof HTMLCanvasElement)) || (img instanceof CanvasProxy);
        isImage = ("undefined" !== typeof Image) && (img instanceof Image);
        //isImageData = img instanceof Object || "object" === typeof img;
        
        if ( isVideo )
        {
            w = img.videoWidth;
            h = img.videoHeight;
        }
        else
        {
            w = img.width;
            h = img.height;
        }
        
        if ( isImage || isCanvas || isVideo ) 
        {
            set_dimensions(self, w, h, WIDTH_AND_HEIGHT);
            if ( self._restorable ) 
            {
            ictx = self.ictx = self.iCanvas.getContext('2d');
            ictx.drawImage(img, 0, 0);
            }
            octx = self.octx = self.oCanvas.getContext('2d');
            octx.drawImage(img, 0, 0);
            self._needsRefresh |= DATA;
        }
        else
        {
            if ( !self.oData ) 
            {
                self.createImageData(w, h);
                refresh_data(self, DATA);
            }
            
            if ( self._restorable )
            {
            ictx = self.ictx = self.iCanvas.getContext('2d');
            arrayset(self.iData.data, img.data); // not supported in Opera, IE, Safari
            ictx.putImageData(self.iData, 0, 0); 
            }
            
            octx = self.octx = self.oCanvas.getContext('2d');
            arrayset(self.oData.data, img.data); // not supported in Opera, IE, Safari
            octx.putImageData(self.oData, 0, 0); 
            //self._needsRefresh &= CLEAR_DATA;
        }
        //self.webgl = FILTER.useWebGL ? new FILTER.WebGL(self.domElement) : null;
        self._needsRefresh |= HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,getPixel: function( x, y ) {
        var self = this;
        if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
        var off = (~~(y*self.width+x+0.5))<<2, im = self.oData.data;
        return {
            r: im[off], 
            g: im[off+1], 
            b: im[off+2], 
            a: im[off+3]
        };
    }
    
    ,setPixel: function( x, y, r, g, b, a ) {
        var self = this;
        self.octx.putImageData(new IMG([r&255, g&255, b&255, a&255]), x, y); 
        self._needsRefresh |= ODATA | HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= OSEL;
        return self;
    }
    
    // get the imageData object
    ,getPixelData: function( ) {
        if (this._needsRefresh & ODATA) refresh_data( this, ODATA );
        return this.oData;
    }
    
    // set the imageData object
    ,setPixelData: function( data ) {
        var self = this;
        self.octx.putImageData(data, 0, 0); 
        self._needsRefresh |= ODATA | HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= OSEL;
        return self;
    }
    
    ,integral: function( channel ) {
        var self = this, integral = ImageUtil.integral, grayscale = self._grayscale;
        if ( null == channel )
        {
            if ( self._needsRefresh & SAT )
            {
                var data = self.getPixelData().data, w = self.width, h = self.height,
                    i0 = integral(data, w, h, 0);
                self._integral = [
                    i0,
                    grayscale ? i0 : integral(data, w, h, 1),
                    grayscale ? i0 : integral(data, w, h, 2),
                    integral(data, w, h, 3)
                ];
                self._integralRefresh = [0, 0, 0, 0];
                self._needsRefresh &= CLEAR_SAT;
            }
        }
        else
        {
            channel = channel || 0;
            if ( (self._needsRefresh & SAT) || self._integralRefresh[channel] )
            {
                if ( grayscale && !self._integralRefresh[0] )
                    self._integral[channel] = self._integral[0];
                else
                    self._integral[channel] = integral(self.getPixelData().data, self.width, self.height, channel);
                self._integralRefresh[channel] = 0;
                self._needsRefresh &= CLEAR_SAT;
            }
        }
        return null == channel ? self._integral : self._integral[channel||0];
    }
    
    ,histogram: function( channel ) {
        var self = this, hist = ImageUtil.histogram, grayscale = self._grayscale;
        if ( null == channel )
        {
            if ( self._needsRefresh & HIST )
            {
                var data = self.getPixelData().data, w = self.width, h = self.height,
                    h0 = hist(data, w, h, 0);
                self._histogram = [
                    h0,
                    grayscale ? h0 : hist(data, w, h, 1),
                    grayscale ? h0 : hist(data, w, h, 2),
                    null//hist(data, w, h, 3)
                ];
                self._histogramRefresh = [0, 0, 0, 0];
                self._needsRefresh &= CLEAR_HIST;
            }
        }
        else
        {
            channel = channel || 0;
            if ( (self._needsRefresh & HIST) || self._histogramRefresh[channel] )
            {
                if ( grayscale && !self._histogramRefresh[0] )
                    self._histogram[channel] = self._histogram[0];
                else
                    self._histogram[channel] = hist(self.getPixelData().data, self.width, self.height, channel);
                self._histogramRefresh[channel] = 0;
                self._needsRefresh &= CLEAR_HIST;
            }
        }
        return null == channel ? self._histogram : self._histogram[channel||0];
    }
    
    // TODO
    ,spectrum: function( channel ) {
        var self = this, spec = ImageUtil.spectrum;
        /*
        if (self._needsRefresh & SPECTRUM) 
        {
                channel = channel || 0;
            var data = self.getPixelData().data, w = self.width, h = self.height;
            self._spectrum[channel] = spec(data, w, h, channel);
            self._needsRefresh &= CLEAR_SPECTRUM;
        }
        */
        return null == channel ? self._spectrum : self._spectrum[channel||0];
    }
    
    ,toImage: function( format ) {
        var canvas = this.oCanvas, uri, quality = 1.0;
        if ( FORMAT.JPG === (format & 16) )
        {
            uri = canvas.toDataURL( MIME.JPG, quality );
        }
        else if ( FORMAT.GIF === (format & 16) )
        {
            uri = canvas.toDataURL( MIME.GIF, quality );
        }
        else/* if( FORMAT.PNG === (format & 16) )*/
        {
            uri = canvas.toDataURL( MIME.PNG, quality );
        }
        if ( format & FORMAT.IMAGE )
        {
            var img = new Image( );
            img.src = uri;
            return img;
        }
        return uri;
    }
    
    ,toString: function( ) {
        return "[" + "FILTER Image: " + this.name + "]";
    }
});
//
// aliases
FilterImage[PROTO].setImage = FilterImage[PROTO].image;
FilterImage[PROTO].setDimensions = FilterImage[PROTO].dimensions;

// static
FilterImage.Gradient = function Gradient( w, h, colors, stops, angle, interpolate ) {
    var Grad = new FilterImage().restorable(false).createImageData(w, h), c = ImageUtil.colors_stops( colors, stops );
    Grad.setData( ImageUtil.gradient( Grad.getData(), w, h, c[0], c[1], angle, interpolate||ImageUtil.lerp ) );
    return Grad;
};
FilterImage.RadialGradient = function RadialGradient( w, h, colors, stops, centerX, centerY, radiusX, radiusY, interpolate ) {
    var Grad = new FilterImage().restorable(false).createImageData(w, h), c = ImageUtil.colors_stops( colors, stops );
    Grad.setData( ImageUtil.radial_gradient( Grad.getData(), w, h, c[0], c[1], centerX, centerY, radiusX, radiusY, interpolate||ImageUtil.lerp ) );
    return Grad;
};
FilterImage.PerlinNoise = function PerlinNoise( w, h, seed, seamless, grayscale, baseX, baseY, octaves, offsets, scale, roughness, use_perlin ) {
    var perlinNoise = new FilterImage().restorable(false).createImageData(w, h);
    if ( ImageUtil.perlin )
    {
        if ( seed ) ImageUtil.perlin.seed( seed );
        perlinNoise.setData( ImageUtil.perlin(perlinNoise.getData(), w, h, seamless, grayscale, baseX, baseY, octaves, offsets, scale, roughness, use_perlin) );
    }
    return perlinNoise;
};

// resize/scale/interpolate image data
ImageUtil.scale = ImageUtil.resize = FILTER.Interpolation.bilinear;

//
// Scaled Image (Proxy) Class
var FilterScaledImage = FILTER.ScaledImage = FILTER.Class( FilterImage, {
    name: "ScaledImage"
    
    ,constructor: function FilterScaledImage( scalex, scaley, img ) {
        var self = this;
        // factory-constructor pattern
        if ( !(self instanceof FilterScaledImage) ) return new FilterScaledImage(scalex, scaley, img);
        self.scaleX = scalex || 1;
        self.scaleY = scaley || self.scaleX;
        self.$super('constructor', img);
    }
    
    ,scaleX: 1
    ,scaleY: 1
    
    ,dispose: function( ) {
        var self = this;
        self.scaleX = null;
        self.scaleY = null;
        self.$super('dispose');
        return self;
    }
    
    ,clone: function( original ) {
        var self = this;
        return new FilterScaledImage(self.scaleX, self.scaleY, true === original ? self.iCanvas : self.oCanvas);
    }
    
    ,setScale: function( sx, sy ) {
        var self = this, argslen = arguments.length;
        if (argslen > 0 && null != sx) 
        {
            self.scaleX = sx;
            self.scaleY = sx;
        }
        if (argslen > 1 && null != sy) 
            self.scaleY = sy;
        return self;
    }
    
    ,image: function( img ) {
        if ( !img ) return this;
        
        var self = this, ictx, octx, w, h, 
            sw, sh, sx = self.scaleX, sy = self.scaleY,
            isVideo, isCanvas, isImage//, isImageData
        ;
        
        if ( img instanceof FilterImage ) img = img.oCanvas;
        isVideo = ("undefined" !== typeof HTMLVideoElement) && (img instanceof HTMLVideoElement);
        isCanvas = (("undefined" !== typeof HTMLCanvasElement) && (img instanceof HTMLCanvasElement)) || (img instanceof CanvasProxy);
        isImage = ("undefined" !== typeof Image) && (img instanceof Image);
        //isImageData = img instanceof Object || "object" === typeof img;
        
        if ( isVideo )
        {
            w = img.videoWidth;
            h = img.videoHeight;
        }
        else
        {
            w = img.width;
            h = img.height;
        }
        
        if ( isImage || isCanvas || isVideo ) 
        {
            sw = ~~(sx*w + 0.5);
            sh = ~~(sy*h + 0.5);
            set_dimensions(self, sw, sh, WIDTH_AND_HEIGHT);
            if ( self._restorable ) 
            {
            ictx = self.ictx = self.iCanvas.getContext('2d');
            ictx.drawImage(img, 0, 0, w, h, 0, 0, sw, sh);
            }
            octx = self.octx = self.oCanvas.getContext('2d');
            octx.drawImage(img, 0, 0, w, h, 0, 0, sw, sh);
            self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
            self._histogramRefresh = [1, 1, 1, 1];
            self._integralRefresh = [1, 1, 1, 1];
            self._spectrumRefresh = [1, 1, 1, 1];
            if (self.selection) self._needsRefresh |= SEL;
        }
        //self.webgl = FILTER.useWebGL ? new FILTER.WebGL(self.domElement) : null;
        return self;
    }
});
// aliases
FilterScaledImage[PROTO].setImage = FilterScaledImage[PROTO].image;

}(FILTER);/**
*
* Filter Loader/Reader/Writer I/O Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

FILTER.IO.Loader = FILTER.IO.Reader = FILTER.Class({
    name: "IO.Loader",
    
    __static__: {
        // accessible as "$class.load" (extendable and with "late static binding")
        load: FILTER.Method(function($super, $private, $class){
              // $super is the direct reference to the superclass itself (NOT the prototype)
              // $private is the direct reference to the private methods of this class (if any)
              // $class is the direct reference to this class itself (NOT the prototype)
              return function( url, onLoad, onError ) {
                return new $class().load(url, onLoad, onError);
            }
        }, FILTER.LATE|FILTER.STATIC )
    },
    
    constructor: function Loader() {
        /*var self = this;
        if ( !(self instanceof Loader) )
            return new Loader( );*/
    },
    
    _crossOrigin: null,
    _responseType: null,
    
    dispose: function( ) {
        var self = this;
        self._crossOrigin = null;
        self._responseType = null;
        return self;
    },
    
    // override in sub-classes
    load: function( url, onLoad, onError ){
        return null;
    },

    responseType: function ( value ) {
        var self = this;
        if ( arguments.length )
        {
            self._responseType = value;
            return self;
        }
        return self._responseType;
    },

    crossOrigin: function ( value ) {
        var self = this;
        if ( arguments.length )
        {
            self._crossOrigin = value;
            return self;
        }
        return self._crossOrigin;
    }
});
// aliases
FILTER.IO.Loader.prototype.read = FILTER.IO.Loader.prototype.load;

FILTER.IO.Writer = FILTER.Class({
    name: "IO.Writer",
    
    __static__: {
        // accessible as "$class.load" (extendable and with "late static binding")
        write: FILTER.Method(function($super, $private, $class){
              // $super is the direct reference to the superclass itself (NOT the prototype)
              // $private is the direct reference to the private methods of this class (if any)
              // $class is the direct reference to this class itself (NOT the prototype)
              return function( file, data, onWrite, onError ) {
                return new $class().write(file, data, onWrite, onError);
            }
        }, FILTER.LATE|FILTER.STATIC )
    },
    
    constructor: function Writer() {
        /*var self = this;
        if ( !(self instanceof Writer) )
            return new Writer( );*/
    },
    
    _encoding: null,
    
    dispose: function( ) {
        var self = this;
        self._encoding = null;
        return self;
    },
    
    // override in sub-classes
    write: function( file, data, onWrite, onError ){
        return null;
    },

    encoding: function ( value ) {
        var self = this;
        if ( arguments.length )
        {
            self._encoding = value;
            return self;
        }
        return self._encoding;
    }
});

}(FILTER);/**
*
* Filter Fx, perlin/simplex noise
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var ImageUtil = FILTER.Util.Image, Image = FILTER.Image, FLOOR = Math.floor,
    sin = Math.sin, cos = Math.cos, PI2 = FILTER.CONST.PI2, Array8U = FILTER.Array8U;
 
// adapted from:

// https://github.com/kev009/craftd/blob/master/plugins/survival/mapgen/noise/simplexnoise1234.c
/* SimplexNoise1234, Simplex noise with true analytic
 * derivative in 1D to 4D.
 *
 * Author: Stefan Gustavson, 2003-2005
 * Contact: stegu@itn.liu.se
 *
 * This code was GPL licensed until February 2011.
 * As the original author of this code, I hereby
 * release it into the public domain.
 * Please feel free to use it for whatever you want.
 * Credit is appreciated where appropriate, and I also
 * appreciate being told where this code finds any use,
 * but you may do as you like.
 */

 // https://github.com/kev009/craftd/blob/master/plugins/survival/mapgen/noise/noise1234.c
/* noise1234
 *
 * Author: Stefan Gustavson, 2003-2005
 * Contact: stegu@itn.liu.se
 *
 * This code was GPL licensed until February 2011.
 * As the original author of this code, I hereby
 * release it into the public domain.
 * Please feel free to use it for whatever you want.
 * Credit is appreciated where appropriate, and I also
 * appreciate being told where this code finds any use,
 * but you may do as you like.
 */

/*
 * Permutation table. This is just a random jumble of all numbers 0-255,
 * repeated twice to avoid wrapping the index at 255 for each lookup.
 * This needs to be exactly the same for all instances on all platforms,
 * so it's easiest to just keep it as static explicit data.
 * This also removes the need for any initialisation of this class.
 *
 * Note that making this an int[] instead of a char[] might make the
 * code run faster on platforms with a high penalty for unaligned single
 * byte addressing. Intel x86 is generally single-byte-friendly, but
 * some other CPUs are faster with 4-aligned reads.
 * However, a char[] is smaller, which avoids cache trashing, and that
 * is probably the most important aspect on most architectures.
 * This array is accessed a *lot* by the noise functions.
 * A vector-valued noise over 3D accesses it 96 times, and a
 * float-valued 4D noise 64 times. We want this to fit in the cache!
 */
var p = new Array8U([151,160,137,91,90,15,
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
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180,
  151,160,137,91,90,15,
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
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180 
]), perm = new Array8U(p); // copy it initially

// This isn't a very good seeding function, but it works ok. It supports 2^16
// different seed values. Write something better if you need more seeds.
function seed( seed ) 
{
    var v, i;
    // Scale the seed out
    if ( seed > 0 && seed < 1 ) seed *= 65536;

    seed = FLOOR( seed );
    if ( seed < 256 ) seed |= seed << 8;
    for (i = 0; i < 256; i++) 
    {
        v = ( i & 1 ) ? (p[i] ^ (seed & 255)) : (p[i] ^ ((seed>>8) & 255));
        perm[i] = perm[i + 256] = v;
    }
}
//seed(0);

/*
 * Helper functions to compute gradients-dot-residualvectors (1D to 4D)
 * Note that these generate gradients of more than unit length. To make
 * a close match with the value range of classic Perlin noise, the final
 * noise values need to be rescaled to fit nicely within [-1,1].
 * (The simplex noise functions as such also have different scaling.)
 * Note also that these noise functions are the most practical and useful
 * signed version of Perlin noise. To return values according to the
 * RenderMan specification from the SL noise() and pnoise() functions,
 * the noise values need to be scaled and offset to [0,1], like this:
 * float SLnoise = (noise(x,y,z) + 1.0) * 0.5;
 */

function grad1( hash, x ) 
{
    var h = hash & 15;
    var grad = 1.0 + (h & 7);   // Gradient value 1.0, 2.0, ..., 8.0
    if (h&8) grad = -grad;         // Set a random sign for the gradient
    return ( grad * x );           // Multiply the gradient with the distance
}

function grad2( hash, x, y ) 
{
    var h = hash & 7;      // Convert low 3 bits of hash code
    var u = h<4 ? x : y;  // into 8 simple gradient directions,
    var v = h<4 ? y : x;  // and compute the dot product with (x,y).
    return ((h&1)? -u : u) + ((h&2)? -2.0*v : 2.0*v);
}

function grad3( hash, x, y, z ) 
{
    var h = hash & 15;     // Convert low 4 bits of hash code into 12 simple
    var u = h<8 ? x : y; // gradient directions, and compute dot product.
    var v = h<4 ? y : h==12||h==14 ? x : z; // Fix repeats at h = 12 to 15
    return ((h&1)? -u : u) + ((h&2)? -v : v);
}

function grad4( hash, x, y, z, t ) 
{
    var h = hash & 31;      // Convert low 5 bits of hash code into 32 simple
    var u = h<24 ? x : y; // gradient directions, and compute dot product.
    var v = h<16 ? y : z;
    var w = h<8 ? z : t;
    return ((h&1)? -u : u) + ((h&2)? -v : v) + ((h&4)? -w : w);
}

// A lookup table to traverse the simplex around a given point in 4D.
// Details can be found where this table is used, in the 4D noise method.
/* TODO: This should not be required, backport it from Bill's GLSL code! */
var simplex = [
[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],
[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],
[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],
[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],
[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],
[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]
];

// 2D simplex noise
function simplex2( x, y ) 
{
    var F2 = 0.366025403; // F2 = 0.5*(sqrt(3.0)-1.0)
    var G2 = 0.211324865; // G2 = (3.0-Math.sqrt(3.0))/6.0
    
    var n0, n1, n2; // Noise contributions from the three corners

    // Skew the input space to determine which simplex cell we're in
    var s = (x+y)*F2; // Hairy factor for 2D
    var xs = x + s;
    var ys = y + s;
    var i = FLOOR(xs);
    var j = FLOOR(ys);

    var t = (i+j)*G2;
    var X0 = i-t; // Unskew the cell origin back to (x,y) space
    var Y0 = j-t;
    var x0 = x-X0; // The x,y distances from the cell origin
    var y0 = y-Y0;

    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if ( x0>y0 ) {i1=1; j1=0;} // lower triangle, XY order: (0,0)->(1,0)->(1,1)
    else {i1=0; j1=1;}      // upper triangle, YX order: (0,0)->(0,1)->(1,1)

    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6

    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1.0 + 2.0 * G2;

    // Wrap the integer indices at 256, to avoid indexing perm[] out of bounds
    var ii = i & 0xff;
    var jj = j & 0xff;

    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0*x0-y0*y0;
    if ( t0 < 0.0 ) n0 = 0.0;
    else 
    {
        t0 *= t0;
        n0 = t0 * t0 * grad2(perm[ii+perm[jj]], x0, y0); 
    }

    var t1 = 0.5 - x1*x1-y1*y1;
    if (t1 < 0.0) n1 = 0.0;
    else 
    {
        t1 *= t1;
        n1 = t1 * t1 * grad2(perm[ii+i1+perm[jj+j1]], x1, y1);
    }

    var t2 = 0.5 - x2*x2-y2*y2;
    if(t2 < 0.0) n2 = 0.0;
    else 
    {
        t2 *= t2;
        n2 = t2 * t2 * grad2(perm[ii+1+perm[jj+1]], x2, y2);
    }

    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 40.0 * (n0 + n1 + n2); // TODO: The scale factor is preliminary!
}

// This is the new and improved, C(2) continuous interpolant
function FADE(t) { return t * t * t * ( t * ( t * 6 - 15 ) + 10 ); }
function LERP(t, a, b) { return a + t*(b-a); }

// 2D float Perlin noise.
function perlin2( x, y )
{
    var ix0, iy0, ix1, iy1;
    var fx0, fy0, fx1, fy1;
    var s, t, nx0, nx1, n0, n1;

    ix0 = FLOOR( x ); // Integer part of x
    iy0 = FLOOR( y ); // Integer part of y
    fx0 = x - ix0;        // Fractional part of x
    fy0 = y - iy0;        // Fractional part of y
    fx1 = fx0 - 1.0;
    fy1 = fy0 - 1.0;
    ix1 = (ix0 + 1) & 0xff;  // Wrap to 0..255
    iy1 = (iy0 + 1) & 0xff;
    ix0 = ix0 & 0xff;
    iy0 = iy0 & 0xff;
    
    t = FADE( fy0 );
    s = FADE( fx0 );

    nx0 = grad2(perm[ix0 + perm[iy0]], fx0, fy0);
    nx1 = grad2(perm[ix0 + perm[iy1]], fx0, fy1);
    n0 = LERP( t, nx0, nx1 );

    nx0 = grad2(perm[ix1 + perm[iy0]], fx1, fy0);
    nx1 = grad2(perm[ix1 + perm[iy1]], fx1, fy1);
    n1 = LERP(t, nx0, nx1);

    return 0.507 * ( LERP( s, n0, n1 ) );
}

// adapted from: http://www.java-gaming.org/index.php?topic=31637.0
/*function octaved(seamless, noise, x, y, w, h, ibx, iby, octaves, offsets, scale, roughness)
{
    var noiseSum = 0, layerFrequency = scale, layerWeight = 1, weightSum = 0, 
        octave, nx, ny, w2 = w>>>1, h2 = h>>>1;

    for (octave=0; octave<octaves; octave++) 
    {
        nx = (x + offsets[octave][0]) % w; ny = (y + offsets[octave][1]) % h;
        if ( seamless )
        {
            // simulate seamless stitching, i.e circular/tileable symmetry
            if ( nx > w2 ) nx = w-1-nx;
            if ( ny > h2 ) ny = h-1-ny;
        }
        noiseSum += noise( layerFrequency*nx*ibx, layerFrequency*ny*iby ) * layerWeight;
        layerFrequency *= 2;
        weightSum += layerWeight;
        layerWeight *= roughness;
    }
    return noiseSum / weightSum;
}*/
function octaved(data, index, noise, x, y, w, h, ibx, iby, octaves, offsets, scale, roughness)
{
    var noiseSum = 0, layerFrequency = scale, layerWeight = 1, weightSum = 0, 
        octave, nx, ny, w2 = w>>>1, h2 = h>>>1, v;

    for (octave=0; octave<octaves; octave++) 
    {
        nx = (x + offsets[octave][0]) % w; ny = (y + offsets[octave][1]) % h;
        noiseSum += noise( layerFrequency*nx*ibx, layerFrequency*ny*iby ) * layerWeight;
        layerFrequency *= 2;
        weightSum += layerWeight;
        layerWeight *= roughness;
    }
    v = ~~(0xff*(0.5*noiseSum/weightSum+0.5));
    data[index  ] = v;
    data[index+1] = v;
    data[index+2] = v;
    data[index+3] = 255;
}
function octaved_rgb(data, index, noise, x, y, w, h, ibx, iby, octaves, offsets, scale, roughness)
{
    var noiseSum = 0, layerFrequency = scale, layerWeight = 1, weightSum = 0, 
        octave, nx, ny, w2 = w>>>1, h2 = h>>>1, v;

    for (octave=0; octave<octaves; octave++) 
    {
        nx = (x + offsets[octave][0]) % w; ny = (y + offsets[octave][1]) % h;
        noiseSum += noise( layerFrequency*nx*ibx, layerFrequency*ny*iby ) * layerWeight;
        layerFrequency *= 2;
        weightSum += layerWeight;
        layerWeight *= roughness;
    }
    v = ~~(0xffffff*(0.5*noiseSum/weightSum+0.5));
    data[index  ] = (v >>> 16) & 255;
    data[index+1] = (v >>> 8) & 255;
    data[index+2] = (v) & 255;
    data[index+3] = 255;
}

/*function turbulence()
{
}*/

ImageUtil.perlin = function perlin( n, w, h, seamless, grayscale, baseX, baseY, octaves, offsets, scale, roughness, use_perlin ) {
    var invBaseX = 1.0/baseX, invBaseY = 1.0/baseY,
        noise = use_perlin ? perlin2 : simplex2,
        generate = grayscale ? octaved : octaved_rgb,
        x, y, nx, ny, i, j, size = n.length, w2 = w>>>1, h2 = h>>>1;
    scale = scale || 1.0; roughness = roughness || 0.5;
    octaves = octaves || 1; offsets = offsets || [[0,0]];
    if ( seamless )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            // simulate seamless stitching, i.e circular/tileable symmetry
            nx = x > w2 ? w-1-x : x;
            ny = y > h2 ? h-1-y : y;
            if ( (nx < x) || (ny < y) )
            {
                j = (ny*w + nx) << 2;
                n[ i   ] = n[ j   ];
                n[ i+1 ] = n[ j+1 ];
                n[ i+2 ] = n[ j+2 ];
                n[ i+3 ] = 255;
            }
            else
            {
                generate(n, i, noise, nx, ny, w, h, invBaseX, invBaseY, octaves, offsets, scale, roughness);
            }
        }
    }
    else
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            generate(n, i, noise, x, y, w, h, invBaseX, invBaseY, octaves, offsets, scale, roughness);
        }
    }
    return n;
};
ImageUtil.perlin.seed = seed;

}(FILTER);
/* main code ends here */
/* export the module */
return FILTER;
});