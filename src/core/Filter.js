/**
*
* Filter SuperClass, Interfaces and Utilities
* @package FILTER.js
*
**/
!function(root, FILTER, undef){

    @@USE_STRICT@@
    
    // http://jsperf.com/math-floor-vs-math-round-vs-parseint/33
    
    var OP = Object.prototype, FP = Function.prototype, AP = Array.prototype
        ,slice = FP.call.bind( AP.slice ), toString = FP.call.bind( OP.toString )
        ,splice = AP.splice, concat = AP.concat, log
        
        ,FILTERPath = FILTER.Path
        
        ,Merge = FILTER.Merge, Async = FILTER.Asynchronous
        
        ,isNode = Async.isPlatform( Async.Platform.NODE ), isBrowser = Async.isPlatform( Async.Platform.BROWSER )
        ,supportsThread = Async.supportsMultiThreading( ), isThread = Async.isThread( )
        ,userAgent = navigator ? navigator.userAgent : ""
        
        ,devicePixelRatio = FILTER.devicePixelRatio = root.devicePixelRatio || 1
        
        ,notSupportClamp = FILTER._notSupportClamp = "undefined" === typeof(Uint8ClampedArray)
        
        ,toStringPlugin = function( ) { return "[FILTER Plugin: " + this.name + "]"; }
        ,applyPlugin = function( im, w, h, image ){ return im; }
        ,initPlugin = function( ) { }
        ,constructorPlugin = function( init ) {
            return function( ) {
                this.$super('constructor');
                init.apply( this, slice(arguments) );
            };
        }
        
        ,_uuid = 0
    ;
    
    //
    //
    // Browser Sniffing support
    var Browser = FILTER.Browser = {
        // http://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
        isNode                  : isNode,
        isBrowser               : isBrowser,
        isWorker                : isThread,
        supportsWorker          : supportsThread,
        isPhantom               : /PhantomJS/.test(userAgent),
        
        // http://www.quirksmode.org/js/detect.html
        // http://my.opera.com/community/openweb/idopera/
        // http://stackoverflow.com/questions/1998293/how-to-determine-the-opera-browser-using-javascript
        isOpera                 : isBrowser && /Opera|OPR\//.test(userAgent),
        isFirefox               : isBrowser && /Firefox\//.test(userAgent),
        isChrome                : isBrowser && /Chrome\//.test(userAgent),
        isSafari                : isBrowser && /Apple Computer/.test(navigator.vendor),
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
        isWin                   : /windows/i.test(navigator.platform),
        isMac                   : false,
        isIE_lt8                : false,
        isIE_lt9                : false,
        isQtWebkit              : false
    };
    Browser.isMobile = Browser.isIOS || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
    Browser.isMac = Browser.isIOS || /Mac/.test(navigator.platform);
    Browser.isIE_lt8 = Browser.isIE  && !isThread && (null == document.documentMode || document.documentMode < 8);
    Browser.isIE_lt9 = Browser.isIE && !isThread && (null == document.documentMode || document.documentMode < 9);
    Browser.isQtWebkit = Browser.isWebkit && /Qt\/\d+\.\d+/.test(userAgent);
    
    FILTER.getPath = Async.path;
    
    FILTER.getCanvas = FILTER.createCanvas = function( w, h ) {
        var canvas = document.createElement( 'canvas' );
        w = w || 0; h = h || 0;
        
        // set the display size of the canvas.
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
         
        // set the size of the drawingBuffer
        canvas.width = w * devicePixelRatio;
        canvas.height = h * devicePixelRatio;
        
        return canvas;
    };
    
    FILTER.uuid = function( namespace ) { 
        return [namespace||'filter', new Date( ).getTime( ), ++_uuid].join('_'); 
    };
    
    //
    //
    // webgl support
    FILTER.useWebGL = false;
    FILTER.useWebGLSharedResources = false;
    FILTER.useWebGLIfAvailable = function( bool ) { /* do nothing, override */  };
    FILTER.useWebGLSharedResourcesIfAvailable = function( bool ) { /* do nothing, override */  };
    
    //
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
        
    // IE still does not support Uint8ClampedArray and some methods on it, add the method "set"
    if ( notSupportClamp && "undefined" !== typeof(CanvasPixelArray) && !CanvasPixelArray.prototype.set )
    {
        var _set = function( a, offset ) {
                var i = a.length;
                offset = offset || 0;
                while ( --i >= 0 ) this[ i + offset ] = a[ i ];
                return this;
        };
        // add the missing method to the array
        CanvasPixelArray.prototype.set = _set;
    }
    notSupportClamp = FILTER._notSupportClamp = notSupportClamp || Browser.isOpera;
    
    //
    //
    // Constants
    FILTER.CONSTANTS = {
        PI: Math.PI,
        PI2: 2*Math.PI,
        PI_2: 0.5*Math.PI,
        SQRT2: Math.SQRT2,
        toRad: Math.PI/180, 
        toDeg: 180/Math.PI
    };
    FILTER.CHANNEL = {
        RED: 0,
        GREEN: 1,
        BLUE: 2,
        ALPHA: 3
    };
    FILTER.MODE = {
        IGNORE: 0,
        WRAP: 1,
        CLAMP: 2,
        COLOR: 4
    };
    FILTER.LUMA = new FILTER.Array32F([ 
        0.212671, 
        0.71516, 
        0.072169 
    ]);
    
    //
    //
    // logging
    log = FILTER.log = (console && console.log) ? console.log : function( s ) { /* do nothing*/ };
    FILTER.warning = function( s ) { log( 'WARNING: ' + s ); }; 
    FILTER.error = function( s ) { log( 'ERROR: ' + s ); };
    
    var 
        //
        //
        // Thread Filter Interface (internal)
        FilterThread = FILTER.FilterThread = FILTER.Class( Async, {
            
            path: FILTER.getPath( )
            ,name: null
            
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
                                filter = Async.load( 'FILTER.' + data.filter );
                            }
                        })
                        .listen('import', function( data ) {
                            if ( data && data["import"] && data["import"].length )
                            {
                                importScripts( data["import"]/*.join(',')*/ );
                            }
                        })
                        .listen('params', function( data ) {
                            if ( filter ) filter.unserialize( data );
                        })
                        .listen('apply', function( data ) {
                            if ( filter && data && data.im )
                            {
                                if ( data.params ) filter.unserialize( data.params );
                                self.send( 'apply', {im: filter._apply( data.im[ 0 ], data.im[ 1 ], data.im[ 2 ] )} );
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
                            close( );
                        })
                    ;
                }
            }
            
            // activate or de-activate thread/worker filter
            ,thread: function( enable ) {
                var self = this;
                if ( !arguments.length ) enable = true;
                enable = !!enable;
                // activate worker
                if ( enable && !self.$thread ) 
                {
                    self.fork( 'FILTER.FilterThread', (FILTERPath.file !== self.path.file) ? [ FILTERPath.file, self.path.file ] : self.path.file );
                    self.send('load', {filter: self.name});
                }
                // de-activate worker (if was activated before)
                else if ( !enable && self.$thread )
                {
                    self.unfork( );
                }
                return self;
            }
            
            ,sources: function( ) {
                var sources = slice( arguments );
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
                var scripts = slice( arguments );
                if ( scripts.length ) this.send('import', {'import': scripts.join( ',' )});
                return this;
            }
            
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
        }),
       
        //
        //
        // Abstract Generic Filter (implements Async Worker/Thread Interface transparently)
        Filter = FILTER.Filter = FILTER.Class( FilterThread, {
            name: "Filter"
            
            ,constructor: function( ) {
                var self = this;
                //self.$super('constructor', 100, false);
            }
            
            // filters can have id's
            ,id: null
            ,_isOn: true
            
            ,dispose: function( ) {
                var self = this;
                self.$super('dispose');
                return self;
            }
            
            // alias of thread method
            ,worker: FilterThread.prototype.thread
            
            // whether filter is ON
            ,isOn: function( ) {
                return this._isOn;
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
            ,apply: function( src, dest, cb ) {
                var self = this, im;
                
                if ( !self.canRun( ) ) return src;
                
                if ( arguments.length < 3 )
                {
                    if ( dest && dest.setSelectedData ) 
                    {
                        // dest is an image and no callback
                        cb = null;
                    }
                    else if ( 'function' === typeof(dest) )
                    {
                        // dest is callback, dest is same as src
                        cb = dest;
                        dest = src;
                    }
                    else
                    {
                        dest = src;
                        cb = null;
                    }
                }
                
                if ( src && dest )
                {
                    im = src.getSelectedData( );
                    if ( self.$thread )
                    {
                        self
                            .listen( 'apply', function( data ) { 
                                self.unlisten( 'apply' );
                                if ( data && data.im ) dest.setSelectedData( data.im );
                                if ( cb ) cb.call( self );
                            })
                            // process request
                            .send( 'apply', {im: im, params: self.serialize( )} )
                        ;
                    }
                    else
                    {
                        dest.setSelectedData( self._apply( im[ 0 ], im[ 1 ], im[ 2 ], src ) );
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
        return FILTER.Class( Filter, methods );
    };
    
}(this, FILTER);