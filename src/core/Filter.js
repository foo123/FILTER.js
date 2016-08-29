/**
*
* Filter SuperClass, Interfaces and Utilities
* @package FILTER.js
*
**/
!function(root, FILTER, undef){
"use strict";

// http://jsperf.com/math-floor-vs-math-round-vs-parseint/33

var PROTO = 'prototype', HAS = 'hasOwnProperty', KEYS = Object.keys
    ,OP = Object[PROTO], FP = Function[PROTO], AP = Array[PROTO]
    
    ,FILTERPath = FILTER.Path, Merge = FILTER.Classy.Merge, Async = FILTER.Asynchronous
    
    ,isNode = Async.isPlatform( Async.Platform.NODE ), isBrowser = Async.isPlatform( Async.Platform.BROWSER )
    ,supportsThread = Async.supportsMultiThreading( ), isThread = Async.isThread( null, true ), isInsideThread = Async.isThread( )
    ,userAgent = "undefined" !== typeof navigator && navigator.userAgent ? navigator.userAgent : ""
    ,platform = "undefined" !== typeof navigator && navigator.platform ? navigator.platform : ""
    ,vendor = "undefined" !== typeof navigator && navigator.vendor ? navigator.vendor : ""
    
    //,toStringPlugin = function( ) { return "[FILTER: " + this.name + "]"; }
    //,applyPlugin = function( im, w, h, image ){ return im; }
    ,initPlugin = function( ) { }
    ,constructorPlugin = function( init ) {
        return function PluginFilter( ) {
            var self = this;
            // factory/constructor pattern
            if ( !(self instanceof PluginFilter) )
            {
                if ( arguments.length )
                {
                    arguments.__arguments__ = true;
                    return new PluginFilter(arguments);
                }
                else
                {
                    return new PluginFilter();
                }
            }
            self.$super('constructor');
            init.apply( self, (1===arguments.length) && (true===arguments[0].__arguments__) ? arguments[0] : arguments );
        };
    }
    ,devicePixelRatio = FILTER.devicePixelRatio = (isBrowser && !isInsideThread ? window.devicePixelRatio : 1) || 1
    ,notSupportClamp = FILTER._notSupportClamp = "undefined" === typeof Uint8ClampedArray
    ,log, _uuid = 0, Min = Math.min, Max = Math.max
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
FILTER.AffineMatrix = FILTER.ColorMatrix = FILTER.ConvolutionMatrix = FILTER.Array32F;

// Constants
FILTER.MODE = {
    IGNORE: 0, WRAP: 1, CLAMP: 2,
    COLOR: 3, COLOR32: 3, TILE: 4, STRETCH: 5,
    INTENSITY: 6, HUE: 7, SATURATION: 8,
    GRAY: 9, GRAYSCALE: 9, RGB: 10, RGBA: 11, HSV: 12, CMY: 13, CMYK: 13, PATTERN: 14,
    COLOR8: 15, COLORMASK: 16, COLORMASK32: 16, COLORMASK8: 17,
    MATRIX: 18, LINEAR: 19, RADIAL: 20, NONLINEAR: 21,
    STATISTICAL: 22, ADAPTIVE: 23, THRESHOLD: 24, HISTOGRAM: 25, MONO: 26
};
FILTER.CHANNEL = {
    R: 0, G: 1, B: 2, A: 3,
    RED: 0, GREEN: 1, BLUE: 2, ALPHA: 3,
    Y: 1, CB: 2, CR: 0, IP: 0, Q: 2,
    INPHASE: 0, QUADRATURE: 2,
    H: 0, S: 2, V: 1, I: 1, U: 2,
    HUE: 0, SATURATION: 2, INTENSITY: 1,
    CY: 2, MA: 0, YE: 1, K: 3,
    CYAN: 2, MAGENTA: 0, YELLOW: 1, BLACK: 3
};
FILTER.STRIDE = {
    CHANNEL: [0,0,1], X: [0,1,4], Y: [1,0,4],
    RGB: [0,1,2], ARGB: [3,0,1,2], RGBA: [0,1,2,3],
    BGR: [2,1,0], ABGR: [3,2,1,0], BGRA: [2,1,0,3]
};
FILTER.LUMA = FILTER.LUMA_YUV = FILTER.LUMA_YIQ = new FILTER.Array32F([
    //0.212671, 0.71516, 0.072169
    0.2126, 0.7152, 0.0722
]);
FILTER.LUMA_YCbCr = new FILTER.Array32F([
    //0.30, 0.59, 0.11
    0.299, 0.587, 0.114
]);
FILTER.LUMA_GREEN = new FILTER.Array32F([
    0, 1, 0
]);
FILTER.CONSTANTS = FILTER.CONST = {
     X: 0, Y: 1, Z: 2
    ,PI: Math.PI, PI2: 2*Math.PI, PI_2: Math.PI/2
    ,toRad: Math.PI/180, toDeg: 180/Math.PI
};
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

notSupportClamp = FILTER._notSupportClamp = notSupportClamp || Browser.isOpera;

// packages
FILTER.Util = {
    String  : { },
    Array   : {
        // IE still does not support Uint8ClampedArray and some methods on it, add the method "set"
         hasClampedArray: "undefined" !== typeof Uint8ClampedArray
        ,hasArrayset: ("undefined" !== typeof Int16Array) && ("function" === typeof Int16Array[PROTO].set)
        ,hasSubarray: "function" === typeof FILTER.Array32F[PROTO].subarray
    },
    IO      : { },
    Filter  : { },
    Image   : { },
    GLSL    : { }//,
    //SVG     : { }
};
FILTER.IO = { };
FILTER.Codec = { };
FILTER.Interpolation = { };
FILTER.Transform = { };
FILTER.MachineLearning = { };
FILTER.GLSL = { };
FILTER.SVG = { };

FILTER.NotImplemented = function( method ) {
    return method ? function( ) { throw new Error('Method "'+method+'" not Implemented!'); } : function( ) { throw new Error('Method not Implemented!'); };
};

//
// logging
log = FILTER.log = isThread ? Async.log : (("undefine" !== typeof console) && console.log ? function( s ) { console.log(s); } : function( s ) { /* do nothing*/ });
FILTER.warning = function( s ) { log( 'WARNING: ' + s ); }; 
FILTER.error = function( s, throwErr ) { log( 'ERROR: ' + s ); if ( throwErr ) throw new Error(s); };

// Thread Filter Interface (internal)
var FilterThread = FILTER.FilterThread = FILTER.Class( Async, {
    
     path: FILTERPath
    ,name: null
    ,_listener: null
    ,_rand: null
    
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
                /*.listen('params', function( data ) {
                    if ( filter ) filter.unserializeFilter( data );
                })
                .listen('inputs', function( data ) {
                    if ( filter ) filter.unserializeInputs( data );
                })*/
                .listen('apply', function( data ) {
                    if ( filter && data && data.im )
                    {
                        //log(data.im[0]);
                        var im = data.im; im[ 0 ] = FILTER.Util.Array.typed( im[ 0 ], FILTER.ImArray );
                        if ( data.params ) filter.unserializeFilter( data.params );
                        if ( data.inputs ) filter.unserializeInputs( data.inputs, im );
                        // pass any filter metadata if needed
                        im = filter._apply( im[ 0 ], im[ 1 ], im[ 2 ] );
                        self.send( 'apply', {im: filter._update ? im : false, meta: filter.hasMeta ? filter.metaData( true ) : null} );
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
        self._rand = null;
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
            if ( null === self._rand )
                self._rand = isNode ? '' : ((-1 === self.path.file.indexOf('?') ? '?' : '&') + (new Date().getTime()));
            self.fork( 'FILTER.FilterThread', FILTERPath.file !== self.path.file ? [ FILTERPath.file, self.path.file+self._rand ] : self.path.file+self._rand );
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
                blobs.push( Async.blob( "function" === typeof sources[ i ] ? sources[ i ].toString( ) : sources[ i ] ) );
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
});
// Abstract Generic Filter (implements Async Worker/Thread Interface transparently)
var Filter = FILTER.Filter = FILTER.Class( FilterThread, {
    name: "Filter"
    
    ,constructor: function Filter( ) {
        var self = this;
        //self.$super('constructor', 100, false);
        self.inputs = {};
        self.meta = null;
    }
    
    // filters can have id's
    ,_isOn: true
    ,_update: true
    ,id: null
    ,onComplete: null
    ,mode: 0
    ,selection: null
    ,inputs: null
    ,hasInputs: false
    ,meta: null
    ,hasMeta: false
    
    ,dispose: function( ) {
        var self = this;
        self.name = null;
        self.id = null;
        self._isOn = null;
        self._update = null;
        self.onComplete = null;
        self.mode = null;
        self.selection = null;
        self.inputs = null;
        self.hasInputs = null;
        self.meta = null;
        self.hasMeta = null;
        self.$super('dispose');
        return self;
    }
    
    // alias of thread method
    ,worker: FilterThread[PROTO].thread
    
    
    // @override
    ,metaData: function( meta, serialisation ) {
        return this.meta;
    }
    ,getMetaData: null
    
    // @override
    ,setMetaData: function( meta, serialisation ) {
        this.meta = meta;
        return this;
    }
    
    /* FIXED: by counting update references in image and comparing current ref count with image ref count
    
**NOTE** The way extra filter inputs are handled has a bug at present. If same image is used as extra input in more than one filter and image is updated through another filter, it is possible depending on order of application that some filters will get the previous version of the image as input (because it is cached and not resent to save bandwidth) while only the first filter will get the updated version. It is going to be fixed in a next update.
    */
    ,setInput: function( key, inputImage ) {
        var self = this;
        key = String(key);
        if ( null === inputImage )
        {
            if ( self.inputs[key] ) delete self.inputs[key];
        }
        else
        {
            self.inputs[key] = [null, inputImage, inputImage.nref];
        }
        return self;
    }
    
    ,unsetInput: function( key ) {
        var self = this;
        key = String(key);
        if ( self.inputs[key] ) delete self.inputs[key];
        return self;
    }
    ,delInput: null
    
    ,resetInputs: function( ) {
        this.inputs = {};
        return this;
    }
    
    ,input: function( key ) {
        var input = this.inputs[String(key)];
        if ( !input ) return null;
        if ( (null == input[0]) || (input[1] && (input[2] !== input[1].nref)) )
        {
            input[2] = input[1].nref; // compare and update current ref count with image ref count
            input[0] = input[1].getSelectedData( 1 );
        }
        return input[0] || null;
    }
    ,getInput: null
    
    // @override
    ,serialize: function( ) {
        return null;
    }
    
    // @override
    ,unserialize: function( params ) {
        return this;
    }
    
    ,serializeInputs: function( curIm ) {
        if ( !this.hasInputs ) return null;
        var inputs = this.inputs, input, k = KEYS(inputs), i, l = k.length, json;
        if ( !l ) return null;
        json = { };
        for(i=0; i<l; i++)
        {
            input = inputs[k[i]];
            if ( (null == input[0]) || (input[1] && (input[2] !== input[1].nref)) )
            {
                // save bandwidth if input is same as main current image being processed
                input[2] = input[1].nref; // compare and update current ref count with image ref count
                json[k[i]] = curIm === input[1] ? true : input[1].getSelectedData( 1 );
            }
        }
        return json;
    }
    
    ,unserializeInputs: function( json, curImData ) {
        var self = this;
        if ( !json || !self.hasInputs ) return self;
        var inputs = self.inputs, input, k = KEYS(json), i, l = k.length,
            IMG = FILTER.ImArray, TypedArray = FILTER.Util.Array.typed;
        for(i=0; i<l; i++)
        {
            input = json[k[i]];
            if ( !input ) continue;
            // save bandwidth if input is same as main current image being processed
            if ( true === input ) input = curImData;
            else input[0] = TypedArray( input[0], IMG )
            inputs[k[i]] = [input, null, 0];
        }
        return self;
    }
    
    ,serializeFilter: function( ) {
        var self = this;
        return { filter: self.name, _isOn: self._isOn, _update: self._update, mode: self.mode, selection: self.selection, params: self.serialize( ) };
    }
    
    ,unserializeFilter: function( json ) {
        var self = this;
        if ( json && (self.name === json.filter) )
        {
            self._isOn = json._isOn; self._update = json._update;
            self.mode = json.mode||0; self.selection = json.selection||null;
            if ( self._isOn && json.params ) self.unserialize( json.params );
        }
        return self;
    }
    
    ,select: function( x1, y1, x2, y2, absolute ) {
        var self = this;
        if ( false === x1 )
        {
            self.selection = null
        }
        else
        {
            self.selection = absolute ? [ 
                Max(0.0, x1||0),
                Max(0.0, y1||0),
                Max(0.0, x2||0),
                Max(0.0, y2||0),
                0
            ] : [
                Min(1.0, Max(0.0, x1||0)),
                Min(1.0, Max(0.0, y1||0)),
                Min(1.0, Max(0.0, x2||0)),
                Min(1.0, Max(0.0, y2||0)),
                1
            ];
        }
        return self;
    }

    ,deselect: function( ) {
        return this.select( false );
    }
    
    ,complete: function( f ) {
        this.onComplete = f || null;
        return this;
    }
    
    ,setMode: function( mode ) {
        this.mode = mode;
        return this;
    }

    ,getMode: function( ) {
        return this.mode;
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
        this.resetInputs( );
        return this;
    }
    
    // @override
    ,canRun: function( ) {
        return this._isOn;
    }
    
    // @override
    ,combineWith: function( filter ) {
        return this;
    }
    
    // @override
    // for internal use, each filter overrides this
    ,_apply: function( im, w, h, metaData ) { 
        /* do nothing here, override */
        return im;
    }
    
    // generic apply a filter from an image (src) to another image (dst) with optional callback (cb)
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
            cb = cb || self.onComplete;
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
                        if ( data.meta ) self.setMetaData( data.meta, true );
                        if ( data.im && self._update )
                        {
                            if ( self.hasMeta && (null != self.meta._IMG_WIDTH) )
                                dst.dimensions( self.meta._IMG_WIDTH, self.meta._IMG_HEIGHT );
                            dst.setSelectedData( FILTER.Util.Array.typed( data.im, FILTER.ImArray ) );
                        }
                    }
                    if ( cb ) cb.call( self );
                };
                // process request
                self.send( 'apply', {im: im, /*id: src.id,*/ params: self.serializeFilter( ), inputs: self.serializeInputs( src )} );
            }
            else
            {
                im2 = self._apply( im[ 0 ], im[ 1 ], im[ 2 ], {src:src, dst:dst} );
                // update image only if needed
                // some filters do not actually change the image data
                // but instead process information from the data,
                // no need to update in such a case
                if ( self._update )
                {
                    if ( self.hasMeta && (null != self.meta._IMG_WIDTH) )
                        dst.dimensions( self.meta._IMG_WIDTH, self.meta._IMG_HEIGHT );
                    dst.setSelectedData( im2 );
                }
                if ( cb ) cb.call( self );
            }
        }
        return src;
    }
    
    ,toString: function( ) {
        return "[FILTER: " + this.name + "]";
    }
});
FILTER.Filter[PROTO].getMetaData = FILTER.Filter[PROTO].metaData;
FILTER.Filter[PROTO].getInput = FILTER.Filter[PROTO].input;
FILTER.Filter[PROTO].delInput = FILTER.Filter[PROTO].unsetInput;
FILTER.Filter.get = function( filterClass ) {
    if ( !filterClass || !filterClass.length ) return null;
    if ( -1 < filterClass.indexOf('.') )
    {
        filterClass = filterClass.split('.');
        var i, l = filterClass.length, part, F = FILTER;
        for(i=0; i<l; i++)
        {
            part = filterClass[i];
            if ( !F[part] ) return null;
            F = F[part];
        }
        return F;
    }
    else
    {
        return FILTER[filterClass] || null;
    }
};

// IO Manager class
FILTER.IO.Manager = FILTER.Class({
    name: "IO.Manager",
    
    __static__: {
        // accessible as "$class.read" (extendable and with "late static binding")
        read: FILTER.Classy.Method(function($super, $private, $class){
              // $super is the direct reference to the superclass itself (NOT the prototype)
              // $private is the direct reference to the private methods of this class (if any)
              // $class is the direct reference to this class itself (NOT the prototype)
              return function( path, onComplete, onError ) {
                return new $class().read(path, onComplete, onError);
            }
        }, FILTER.Classy.LATE|FILTER.Classy.STATIC ),
        
        // accessible as "$class.write" (extendable and with "late static binding")
        write: FILTER.Classy.Method(function($super, $private, $class){
              // $super is the direct reference to the superclass itself (NOT the prototype)
              // $private is the direct reference to the private methods of this class (if any)
              // $class is the direct reference to this class itself (NOT the prototype)
              return function( path, data, onComplete, onError ) {
                return new $class().write(path, data, onComplete, onError);
            }
        }, FILTER.Classy.LATE|FILTER.Classy.STATIC ),
        
        load: FILTER.Classy.Method(function($super, $private, $class){
              // $super is the direct reference to the superclass itself (NOT the prototype)
              // $private is the direct reference to the private methods of this class (if any)
              // $class is the direct reference to this class itself (NOT the prototype)
              return function( path, onComplete, onError ) {
                return new $class().read(path, onComplete, onError);
            }
        }, FILTER.Classy.LATE|FILTER.Classy.STATIC ),
        
        // accessible as "$class.write" (extendable and with "late static binding")
        save: FILTER.Classy.Method(function($super, $private, $class){
              // $super is the direct reference to the superclass itself (NOT the prototype)
              // $private is the direct reference to the private methods of this class (if any)
              // $class is the direct reference to this class itself (NOT the prototype)
              return function( path, data, onComplete, onError ) {
                return new $class().write(path, data, onComplete, onError);
            }
        }, FILTER.Classy.LATE|FILTER.Classy.STATIC )
    },
    
    constructor: function Manager( ){
        /*var self = this;
        if ( !(self instanceof Manager) )
            return new Manager( );*/
    },
    
    _crossOrigin: null,
    _responseType: null,
    _encoding: null,
    
    dispose: function( ){
        var self = this;
        self._crossOrigin = null;
        self._responseType = null;
        self._encoding = null;
        return self;
    },
    
    // override in sub-classes
    read: function( path, onComplete, onError ){
        return null;
    },
    write: function( path, data, onComplete, onError ){
        return null;
    },
    
    // aliases
    load: function( path, onComplete, onError ){
        return this.read( path, onComplete, onError );
    },
    save: function( path, data, onComplete, onError ){
        return this.write( path, data, onComplete, onError );
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
// aliases
FILTER.IO.Loader = FILTER.IO.Reader = FILTER.IO.Writer = FILTER.IO.Manager;
// a default raw codec
FILTER.Codec.RAW = {
    encoder: function( imgData, metaData ) {
        return new Buffer( imgData );
    },
    decoder: function( buffer, metaData ) {
        return {
            width: metaData.width || 1,
            height: metaData.height || 1,
            data: new Uint8Array( buffer )
        };
    }
};

// filter plugin creation micro-framework
FILTER.Create = function( methods ) {
    methods = Merge({
             init: initPlugin
            ,name: "PluginFilter"
    }, methods);
    var filterName = methods.name;
    methods.constructor = constructorPlugin( methods.init );
    if ( (null == methods._apply) && ("function" === typeof methods.apply) ) methods._apply = methods.apply;
    // add some aliases
    if ( ("function" === typeof methods.metaData) && (methods.metaData !== Filter[PROTO].metaData) ) methods.getMetaData = methods.metaData;
    else if ( ("function" === typeof methods.getMetaData) && (methods.getMetaData !== Filter[PROTO].getMetaData) ) methods.metaData = methods.getMetaData;
    delete methods.init; if ( methods[HAS]('apply') ) delete methods.apply;
    return FILTER[filterName] = FILTER.Class( Filter, methods );
};

}(this, FILTER);