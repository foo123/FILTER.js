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

}(this, FILTER);