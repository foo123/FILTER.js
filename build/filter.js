/**
*
*   FILTER.js
*   @version: 0.6.9
*   @dependencies: Classy.js
*
*   JavaScript Image Processing Library
*   https://github.com/foo123/FILTER.js
*
**/!function ( root, name, deps, factory, undef ) {

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


}(  /* current root */          this, 
    /* module name */           "FILTER",
    /* module dependencies */   [ ['Classy', './classy'] ], 
    /* module factory */        function( Classy ) {
        
        /* main code starts here */

/**
*
*   FILTER.js
*   @version: 0.6.9
*   @dependencies: Classy.js
*
*   JavaScript Image Processing Library
*   https://github.com/foo123/FILTER.js
*
**/
var FILTER = FILTER || { VERSION: "0.6.9", Class: Classy.Class, Merge: Classy.Merge };
    
/**
*
* Filter SuperClass, Interfaces and Utilities
* @package FILTER.js
*
**/
!function(root, FILTER, undef){

    "use strict";
    
    // http://jsperf.com/math-floor-vs-math-round-vs-parseint/33
    
    //
    //
    // Some browser detection hacks
    var isNode = "undefined" !== typeof(global) && '[object global]' === {}.toString.call(global),
        isBrowser = !isNode && "undefined" !== typeof(navigator), 
        isWorker = "function" === typeof(importScripts) && navigator instanceof WorkerNavigator,
        supportsWorker = "function" === typeof(Worker),
        userAgent = navigator ? navigator.userAgent : "",
        Browser = FILTER.Browser = {
            // http://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
            isNode                  : isNode,
            isBrowser               : isBrowser,
            isWorker                : isWorker,
            supportsWorker          : supportsWorker,
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
        },

        Merge = FILTER.Merge, FP = Function.prototype, AP = Array.prototype,
        slice = FP.call.bind( AP.slice ), splice = AP.splice, concat = AP.concat,
        log
    ;
    Browser.isMobile = Browser.isIOS || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
    Browser.isMac = Browser.isIOS || /Mac/.test(navigator.platform);
    Browser.isIE_lt8 = Browser.isIE  && !isWorker && (null == document.documentMode || document.documentMode < 8);
    Browser.isIE_lt9 = Browser.isIE && !isWorker && (null == document.documentMode || document.documentMode < 9);
    Browser.isQtWebkit = Browser.isWebkit && /Qt\/\d+\.\d+/.test(userAgent);
    
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
    
    var notSupportClamp = FILTER._notSupportClamp = "undefined" === typeof(Uint8ClampedArray);
    FILTER.ImArray = notSupportClamp ? FILTER.Array8U : Uint8ClampedArray;
    // opera seems to have a bug which copies Uint8ClampedArrays by reference instead by value (eg. as Firefox and Chrome)
    // however Uint8 arrays are copied by value, so use that instead for doing fast copies of image arrays
    FILTER.ImArrayCopy = Browser.isOpera ? FILTER.Array8U : FILTER.ImArray;
        
    // IE still does not support Uint8ClampedArray and some methods on it, add the method "set"
    if ( notSupportClamp && "undefined" !== typeof(CanvasPixelArray) && !CanvasPixelArray.prototype.set )
    {
        var _set = function( a, ind ) {
                var i = a.length;
                ind = parseInt( ind, 10 ) || 0;
                while ( --i >= 0 ) this[ i + ind ] = a[ i ];
                return this;
        };
        // add the missing method to the array
        CanvasPixelArray.prototype.set = _set;
    }
    
    //
    //
    // Constants
    FILTER.CONSTANTS = {
        PI : Math.PI,
        PI2 : 2*Math.PI,
        PI_2 : 0.5*Math.PI,
        SQRT2 : Math.SQRT2,
        toRad : Math.PI/180, 
        toDeg : 180/Math.PI
    };
    FILTER.CHANNEL = {
        RED : 0,
        GREEN : 1,
        BLUE : 2,
        ALPHA : 3
    };
    FILTER.MODE = {
        IGNORE : 0,
        WRAP : 1,
        CLAMP : 2,
        COLOR : 4
    };
    FILTER.LUMA = new FILTER.Array32F([ 
        0.212671, 
        0.71516, 
        0.072169 
    ]);
    
    //
    //
    // logging
    if ( isWorker )
    {
        var filter = null;
        
        root.console = {
            log: function(s){
                postMessage({event: 'console.log', data: {output: s||''}});
            },
            error: function(s){
                postMessage({event: 'console.error', data: {output: s||''}});
            },
        };
        
        onmessage = function( evt ) {
            var event = evt.data.event, data = evt.data.data || null;
            switch( event )
            {
                case 'init':
                    if ( data && data.filter && FILTER[ data.filter ] )
                    {
                        if ( filter ) filter.dispose( true );
                        filter = new FILTER[ data.filter ]( );
                    }
                    else
                    {
                        throw new Error('Filter "' + data.filter + '" could not be created');
                    }
                    break;
                case 'import':
                    if ( data && data["import"] && data["import"].length )
                    {
                        importScripts( data["import"].join(',') );
                    }
                    break;
                case 'params':
                    if ( filter )
                    {
                        filter.unserialize( data );
                    }
                    break;
                case 'apply':
                    if ( filter )
                    {
                        if ( data && data.im )
                        {
                            if ( data.params ) filter.unserialize( data.params );
                            filter.send( 'apply', {im: filter._apply( data.im[ 0 ], data.im[ 1 ], data.im[ 2 ] )} );
                        }
                        else
                        {
                            filter.send( 'apply', {im: null} );
                        }
                    }
                    break;
                case 'dispose':
                default:
                    if ( filter )
                    {
                        filter.dispose( true );
                    }
                    close( );
                    break;
            }
        };        
    }
         
    log = FILTER.log = (console && console.log) ? console.log : function( s ) { /* do nothing*/ };
    FILTER.warning = function( s ) { log( 'WARNING: ' + s ); }; 
    FILTER.error = function( s ) { log( 'ERROR: ' + s ); };
    
    //
    //
    // webgl support
    FILTER.useWebGL = false;
    FILTER.useWebGLSharedResources = false;
    FILTER.useWebGLIfAvailable = function( bool ) { /* do nothing, override */  };
    FILTER.useWebGLSharedResourcesIfAvailable = function( bool ) { /* do nothing, override */  };
    
    //
    //
    // for WebGL Support
    var devicePixelRatio = FILTER.devicePixelRatio = root.devicePixelRatio || 1;
    
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
    
    var _uuid = 0;
    FILTER.uuid = function( namespace ) { return [namespace||'fuuid', new Date().getTime(), ++_uuid].join('_'); };
    
    // Get current filename/path
    function getCurrentPath( ) 
    {
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
    }
        
    FILTER.Path = getCurrentPath( );
    
    //
    //
    // Worker Interface Filter
    var URL = FILTER.URL = root.webkitURL || root.URL,
        blobURL = function( src ) {
            return URL.createObjectURL( new Blob( [ src || '' ], { type: "text/javascript" }) );
        }
    ;
        
    var FilterWorkerInterface = FILTER.FilterWorkerInterface = FILTER.Class({
        
        _worker: null
        ,_workerListeners: null
        
        ,disposeWorker: function( ) {
            var self = this;
            if ( self._worker )
            {
                self.send( 'dispose' );
                //self._worker.terminate( );
                self._worker = null;
                self._workerListeners = null;
            }
            /*if ( isWorker )
            {
                close( );
            }*/
            return self;
        }
        
        // @override
        ,serialize: function( ) {
            return { filter: this.name || null };
        }
        
        // @override
        ,unserialize: function( json ) {
            return this;
        }
        
        ,sources: function( ) {
            var sources = slice( arguments );
            if ( sources.length )
            {
                var blobs = [ ], i;
                for (i=0; i<sources.length; i++)
                {
                    if ( 'function' === typeof( sources[ i ] ) )
                    {
                        blobs.push( blobURL( sources[ i ].toString( ) ) );
                    }
                    else
                    {
                        blobs.push( blobURL( sources[ i ] ) );
                    }
                }
                this.send('import', {'import': blobs});
            }
            return this;
        }
        
        ,scripts: function( ) {
            var scripts = slice( arguments );
            if ( scripts.length )
            {
                this.send('import', {'import': scripts});
            }
            return this;
        }
        
        // get or de-activate a worker filter
        ,worker: function( bool ) {
            var self = this, worker;
            
            if ( undef === bool ) bool = true;
            bool = !!bool;
            
            // de-activate worker (if was activated before)
            if ( false === bool )
            {
                if ( self._worker ) self.disposeWorker( );
                return self;
            }
            
            //if ( self._worker ) self.disposeWorker( );
            
            if ( !self._worker )
            {
                if ( !supportsWorker )
                {
                    throw new Error('Worker is not supported');
                    return;
                }
                
                self._workerListeners = { };
                
                worker = self._worker = new Worker( this.Path.file );
                
                worker.onmessage = function( evt ) {
                    if ( evt.data.event )
                    {
                        var event = evt.data.event, data = evt.data.data || null;
                        if ( self._workerListeners && self._workerListeners[ event ] ) 
                        {
                            self._workerListeners[ event ]( data );
                        }
                        
                        if ( "console.log" === event || "console.error" === event )
                        {
                            log( 'Worker: ' + data.output );
                        }
                    }
                };
                
                worker.onerror = function( evt ) {
                    if ( self._workerListeners && self._workerListeners.error )
                    {
                        self._workerListeners.error( evt );
                    }
                    else
                    {
                        throw new Error( 'Worker Error: ' + evt.message + ' file: ' + evt.filename + ' line: ' + evt.lineno );
                    }
                };
                
                self.send( 'init', { filter: self.name } );
            }
            
            return self;
        }
        
        ,bind: function( event, handler ) {
            if ( event && handler && this._workerListeners )
            {
                this._workerListeners[ event ] = handler.bind( this );
            }
            return this;
        }
        
        ,unbind: function( event ) {
            if ( event && this._workerListeners && this._workerListeners[ event ] )
            {
                delete this._workerListeners[ event ];
            }
            return this;
        }
        
        ,send: function( event, data ) {
            if ( event )
            {
                if ( isWorker )
                {
                    postMessage({event: event, data: data || null});
                }
                else if ( this._worker )
                {
                    this._worker.postMessage({event: event, data: data || null});
                }
            }
            return this;
        }
    });
   
    //
    //
    // Abstract Generic Filter
    var Filter = FILTER.Filter = FILTER.Class( FilterWorkerInterface, {
        name: "Filter"
        
        ,Path: { file: FILTER.Path.file, path: FILTER.Path.path}
        
        // dummy
        ,constructor: function() {
        }
        
        // filters can have id's
        ,id: null
        
        ,_isOn: true
        
        // @override
        ,dispose: function( ) {
            this.disposeWorker( );
            return this;
        }
        
        // whether filter is ON
        ,isOn: function( ) {
            return this._isOn;
        }
        
        // allow filters to be turned ON/OFF
        ,turnOn: function( bool ) {
            if ( undef === bool ) bool = true;
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
        ,combineWith: function( filter ) {
            return this;
        }
        
        // @override
        // for internal use, each filter overrides this
        ,_apply: function( im, w, h, image ) { 
            /* do nothing here, override */
            return im;
        }
        
        // generic apply method, maybe overwritten
        ,apply: function( image, cb ) {
            if ( image && this._isOn )
            {
                var im = image.getSelectedData( );
                if ( this._worker )
                {
                    this
                        .bind( 'apply', function( data ) { 
                            this.unbind( 'apply' );
                            if ( data && data.im )
                                image.setSelectedData( data.im );
                            if ( cb ) cb.call( this );
                        })
                        // send filter params to worker
                        //.send( 'params', this.serialize( ) )
                        // process request
                        .send( 'apply', {im: im, params: this.serialize( )} )
                    ;
                }
                else
                {
                    image.setSelectedData( this._apply( im[ 0 ], im[ 1 ], im[ 2 ], image ) );
                    if ( cb ) cb.call( this );
                }
            }
            return image;
        }
        
        ,toString: function() {
            return "[" + "FILTER: " + this.name + "]";
        }
    });
    
    //
    //
    // Composite Filter Stack  (a variation of Composite Design Pattern)
    var CompositeFilter = FILTER.CompositeFilter = FILTER.Class( Filter, {
        name: "CompositeFilter"
        
        ,constructor: function( filters ) { 
            this._stack = ( filters && filters.length ) ? filters.slice( ) : [ ];
        }
        
        ,_stack: null
        
        ,dispose: function( withFilters ) {
            var i, stack = this._stack;
            
            this.disposeWorker( );
            
            if ( true === withFilters )
            {
                for (i=0; i<stack.length; i++)
                {
                    stack[ i ] && stack[ i ].dispose( withFilters );
                    stack[ i ] = null;
                }
            }
            this._stack = null;
            
            return this;
        }
        
        ,serialize: function( ) {
            var json = { filter: this.name, filters: [ ] }, i, stack = this._stack;
            for (i=0; i<stack.length; i++)
            {
                json.filters.push( stack[ i ].serialize( ) );
            }
            return json;
        }
        
        ,unserialize: function( json ) {
            if ( json && this.name === json.filter )
            {
                var i, filters = json.filters || [ ], stack = [ ], filter;
                
                for (i=0; i<filters.length; i++)
                {
                    filter = (filters[ i ] && filters[ i ].filter) ? FILTER[ filters[ i ].filter ] : null;
                    if ( filter )
                    {
                        stack.push( new filter( ).unserialize( filters[ i ] ) );
                    }
                    else
                    {
                        throw new Error('Filter "' + filters[ i ].filter + '" could not be created');
                        return;
                    }
                }
                
                // dispose any prev filters
                if ( this._stack )
                {
                    for (i=0; i<this._stack.length; i++)
                    {
                        this._stack[ i ] && this._stack[ i ].dispose( true );
                        this._stack[ i ] = null;
                    }
                }
                
                this._stack = stack;
            }
            return this;
        }
        
        // manipulate the filter chain, methods
        ,filters: function( f ) {
            if ( undef !== f )
            {
                this._stack = f.slice( );
                return this;
            }
            return this._stack.slice( );
        }
        
        ,push: function(/* variable args here.. */) {
            var args = slice(arguments), argslen = args.length;
            if ( argslen )
            {
                this._stack = concat.apply( this._stack, args );
            }
            return this;
        }
        
        ,pop: function( ) {
            return this._stack.pop( );
        }
        
        ,shift: function( ) {
            return this._stack.shift( );
        }
        
        ,unshift: function(/* variable args here.. */) {
            var args = slice(arguments), argslen = args.length;
            if ( argslen )
            {
                splice.apply( this._stack, [0, 0].concat( args ) );
            }
            return this;
        }
        
        ,getAt: function( i ) {
            return ( this._stack.length > i ) ? this._stack[ i ] : null;
        }
        
        ,setAt: function( i, filter ) {
            if ( this._stack.length > i ) this._stack[ i ] = filter;
            else this._stack.push( filter );
            return this;
        }
        
        ,insertAt: function( i /*, filter1, filter2, filter3..*/) {
            var args = slice(arguments), arglen = args.length;
            if ( argslen > 1 )
            {
                args.shift( );
                splice.apply( this._stack, [i, 0].concat( args ) );
            }
            return this;
        }
        
        ,removeAt: function( i ) {
            return this._stack.splice( i, 1 );
        }
        
        ,remove: function( filter ) {
            var i = this._stack.length;
            while ( --i >= 0 ) 
            { 
                if ( filter === this._stack[i] ) 
                    this._stack.splice( i, 1 ); 
            }
            return this;
        }
        
        ,reset: function( ) {
            this._stack.length = 0;  
            return this;
        }
        
        // used for internal purposes
        ,_apply: function( im, w, h, image ) {
            
            if ( this._isOn && this._stack.length )
            {
                var _filterstack = this._stack, _stacklength = _filterstack.length, 
                    fi, filter;
                    
                for ( fi=0; fi<_stacklength; fi++ )
                {
                    filter = _filterstack[fi]; 
                    if ( filter && filter._isOn ) im = filter._apply(im, w, h, image);
                }
            }
            return im;
        }
        
        // make it so other composite filters can be  used as simple filter components in the stack
        ,apply: function( image, cb ) {
            if ( image && this._isOn && this._stack.length )
            {
                var im = image.getSelectedData( );
                if ( this._worker )
                {
                    this
                        .bind( 'apply', function( data ) { 
                            this.unbind( 'apply' );
                            if ( data && data.im )
                                image.setSelectedData( data.im );
                            if ( cb ) cb.call( this );
                        })
                        // send filter params to worker
                        //.send( 'params', this.serialize( ) )
                        // process request
                        .send( 'apply', {im: im, params: this.serialize( )} )
                    ;
                }
                else
                {
                    image.setSelectedData( this._apply( im[ 0 ], im[ 1 ], im[ 2 ], image ) );
                    if ( cb ) cb.call( this );
                }
            }
            return image;
        }
        
        ,toString: function( ) {
            return [
                 "[" + "FILTER: " + this.name + "]"
                 ,"["
                 ,"    " + this._stack.join("\n    ")
                 ,"]"
                 ,""
             ].join("\n");
        }
    });
    // aliases
    CompositeFilter.prototype.empty = CompositeFilter.prototype.reset;
    CompositeFilter.prototype.concat = CompositeFilter.prototype.push;
    
    var toStringPlugin = function( ) { return "[" + "FILTER Plugin: " + this.name + "]"; };
        
    //
    //
    // plugin creation framework
    FILTER.Create = function( methods ) {
        
        methods = Merge({
                init: function( ) { }
                ,name: "PluginFilter"
                ,toString: toStringPlugin
                ,apply: function( im, w, h, image ){ return im; }
        }, methods);
        methods.constructor = methods.init;
        methods._apply = methods.apply;
        delete methods.init;
        delete methods.apply;
        return FILTER.Class(Filter, methods);
    };
    
}(this, FILTER);/**
*
* Color Methods / Transforms
* @package FILTER.js
*
**/
!function(FILTER){

    "use strict";
    
    var Sqrt=Math.sqrt, Min=Math.min, Max=Math.max;
    
    // static Color Methods and Transforms
    // http://en.wikipedia.org/wiki/Color_space
    FILTER.Color = {
        
        name : "ColorTransforms",
        
        clamp : function(v, m, M) { return Min(M, Max(v, m)); },
        
        clampPixel : function(v) { return Min(255, Max(v, 0)); },
        
        ubyteToFloat: function(ub) { return ub * 0.0039215686274509803921568627451; /* 1 / 255; */ },

        ubyteColorToFloatColor: function(color) {
            var ii, cL=color.length, floatColor=new Array(cL);
            for (i=0; i<cL; i++)  floatColor[i] = color[i] * 0.0039215686274509803921568627451;
            return floatColor;
        },
        
        hexColorToFloatColor: function(color) {
            var r, g, b,a;
            r = (color>>16)&255;
            g = (color>>8)&255;
            b = (color)&255;
            a = (color>>24)&255;

            return [
                r * 0.0039215686274509803921568627451,
                g * 0.0039215686274509803921568627451,
                b * 0.0039215686274509803921568627451,
                a * 0.0039215686274509803921568627451
            ];
        },
        
        blend : function(rgb1, rgb2, p) {
            return {
                r: rgb1.r - ~~((rgb1.r - rgb2.r) * p + 0.5), 
                g:rgb1.g - ~~((rgb1.g - rgb2.g) * p + 0.5), 
                b: rgb1.b - ~~((rgb1.b - rgb2.b) * p + 0.5)
            };
        },
        
        toGray : function(r, g, b) {
            var LUMA=FILTER.LUMA;  return ~~(LUMA[0]*r + LUMA[1]*g + LUMA[2]*b);
        }, 
        
        distance : function(rgb1, rgb2) {
            var dr=rgb1.r-rgb2.r, dg=rgb1.g-rgb2.g, db=rgb1.b-rgb2.b;
            return Sqrt(dr*dr + dg*dg + db*db);
        },
        
        RGB2Color : function(rgb) {
            return ((rgb.r << 16) | (rgb.g << 8) | (rgb.b)&255);
        },
        
        RGBA2Color : function(rgb) {
            return ((rgb.a << 24) | (rgb.r << 16) | (rgb.g << 8) | (rgb.b)&255);
        },
        
        Color2RGBA : function(c) {
            c=~~c;
            return {
                r : (c >>> 16) & 255,
                g : (c >>> 8) & 255,
                b : (c & 255),
                a : (c >>> 24) & 255
            };
        },

        // http://en.wikipedia.org/wiki/YCbCr
        RGB2YCbCr : function(rgb) {
            var y, cb, cr, r=rgb.r, g=rgb.g, b=rgb.b;
            
            // each take full range from 0-255
            y = ~~( 0   + 0.299*r    + 0.587*g     + 0.114*b    );
            cb= ~~( 128 - 0.168736*r - 0.331264*g  + 0.5*b      );
            cr= ~~( 128 + 0.5*r      - 0.418688*g  - 0.081312*b );
            return {y:y, cb:cb, cr:cr};
        },
        
        // http://en.wikipedia.org/wiki/YCbCr
        YCbCr2RGB : function(ycbcr) {
            var r, g, b, y=ycbcr.y, cb=ycbcr.cb, cr=ycbcr.cr;
            
            // each take full range from 0-255
            r = ~~( y                      + 1.402   * (cr-128) );
            g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
            b = ~~( y + 1.772   * (cb-128) );
            return {r:r, g:g, b:b};
        },
        
        // http://en.wikipedia.org/wiki/HSL_color_space
        // adapted from http://www.cs.rit.edu/~ncs/colo
        RGB2HSV : function(rgb)  {
            var min, max, delta, 
                r, g, b, h, s, v
            ;

            r=rgb.r; g=rgb.g; b=rgb.b;
            
            min = Min( r, g, b );  max = Max( r, g, b );  delta = max - min;
            v = max;                // v

            if( max != 0 )
            {
                s = delta / max;        // s
            }
            else 
            {
                // r = g = b = 0        // s = 0, v is undefined
                s = 0;  h = 0; //h = -1;
                return { h:h, s:s, v:v };
            }

            if( r == max )    h = ( g - b ) / delta;        // between yellow & magenta
            else if ( g == max )  h = 2 + ( b - r ) / delta;    // between cyan & yellow
            else   h = 4 + ( r - g ) / delta;   // between magenta & cyan

            h *= 60;                // degrees
            if( h < 0 )  h += 360;
            
            return { h:h, s:s, v:v };
        },
        
        // http://en.wikipedia.org/wiki/HSL_color_space
        // adapted from http://www.cs.rit.edu/~ncs/color/t_convert.html
        HSV2RGB : function( hsv ) {
            var i,
                f, p, q, t,
                r, g, b, h, s, v
            ;
            
            h=hsv.h; s=hsv.s; v=hsv.v;
            
            if( s == 0 ) 
            {
                // achromatic (grey)
                r = g = b = v;
                return {r:r, g:g, b:b};
            }

            h /= 60;            // sector 0 to 5
            i = ~~( h );
            f = h - i;          // factorial part of h
            p = v * ( 1 - s );   q = v * ( 1 - s * f );  t = v * ( 1 - s * ( 1 - f ) );

            switch( i ) 
            {
                case 0:  r = v;   g = t;   b = p;
                    break;
                case 1: r = q;  g = v;   b = p;
                    break;
                case 2: r = p;  g = v;  b = t;
                    break;
                case 3: r = p;  g = q;  b = v;
                    break;
                case 4: r = t;  g = p;  b = v;
                    break;
                default:        // case 5:
                    r = v;  g = p;  b = q;
                    break;
            }
            
            return {r:r, g:g, b:b};
        },
        
        toString : function() {
            return "[" + "FILTER: " + this.name + "]";
        }
    };
    
}(FILTER);/**
*
* Image Canvas Class
* @package FILTER.js
*
* NOTE: it won't work locally (at least with Firefox), only with server
**/
!function(FILTER, undef){
    
    "use strict";
    
    var devicePixelRatio = FILTER.devicePixelRatio,
        IMG = FILTER.ImArray, A32F = FILTER.Array32F,
        createCanvas = FILTER.createCanvas,
        notSupportTyped = FILTER._notSupportTypedArrays,
        Min = Math.min, Floor = Math.floor
    ;
    
    /**
     * JavaScript implementation of common blending modes, based on
     * http://stackoverflow.com/questions/5919663/how-does-photoshop-blend-two-images-together
     **/
    var blendModes = FILTER.blendModes = {
        normal: function(a, b) { return a; },

        lighten: function(a, b) { return (b > a) ? b : a; },

        darken: function(a, b) { return (b > a) ? a : b; },

        multiply: function(a, b) { return (a * b * 0.003921568627451); },

        average: function(a, b) { return 0.5*(a + b); },

        add: function(a, b) { return Math.min(255, a + b); },

        substract: function(a, b) {  return (a + b < 255) ? 0 : a + b - 255; },

        difference: function(a, b) { return Math.abs(a - b); },

        negation: function(a, b) { return 255 - Math.abs(255 - a - b); },

        screen: function(a, b) { return 255 - (((255 - a) * (255 - b)) >> 8); },

        exclusion: function(a, b) { return a + b - 2 * a * b * 0.003921568627451; },

        overlay: function(a, b) { return b < 128 ? (2 * a * b * 0.003921568627451) : (255 - 2 * (255 - a) * (255 - b) * 0.003921568627451); },

        softLight: function(a, b) { return b < 128 ? (2 * ((a >> 1) + 64)) * (b * 0.003921568627451) : 255 - (2 * (255 - (( a >> 1) + 64)) * (255 - b) * 0.003921568627451); },

        // reverse of overlay
        hardLight: function(b, a) { return b < 128 ? (2 * a * b * 0.003921568627451) : (255 - 2 * (255 - a) * (255 - b) * 0.003921568627451); },

        colorDodge: function(a, b) { return b == 255 ? b : Math.min(255, ((a << 8 ) / (255 - b))); },

        colorBurn: function(a, b) { return b == 0 ? b : Math.max(0, (255 - ((255 - a) << 8 ) / b)); },

        //linearDodge: blendModes.add,

        //linearBurn: blendModes.substract,

        linearLight: function(a, b) { return b < 128 ? blendModes.linearBurn(a, 2 * b) : blendModes.linearDodge(a, (2 * (b - 128))); },

        vividLight: function(a, b) { return b < 128 ? blendModes.colorBurn(a, 2 * b) : blendModes.colorDodge(a, (2 * (b - 128))); },

        pinLight: function(a, b) { return b < 128 ? blendModes.darken(a, 2 * b) : blendModes.lighten(a, (2 * (b - 128))); },

        hardMix: function(a, b) { return blendModes.vividLight(a, b) < 128 ? 0 : 255; },

        reflect: function(a, b) { return b == 255 ? b : Math.min(255, (a * a / (255 - b))); },

        // reverse of reflect
        glow: function(b, a) { return b == 255 ? b : Math.min(255, (a * a / (255 - b))); },

        phoenix: function(a, b) { return Math.min(a, b) - Math.max(a, b) + 255; }
    };
    // aliases
    blendModes.linearDodge = blendModes.add;
    blendModes.linearBurn = blendModes.substract;
    
    var DATA = 1, SEL = 2, HIST = 4, SAT = 8;
    
    //
    //
    // Image (Proxy) Class
    var FImage = FILTER.Image = FILTER.Class({
        name: "Image"
        
        ,constructor: function( img, callback ) {
            this.width = 0;   
            this.height = 0;
            this.context = null;
            this.selection = null;
            this.imageData = null;
            this.imageDataSel = null;
            this.domElement = this.canvasElement = createCanvas(this.width, this.height);
            this.context = this.canvasElement.getContext('2d');
            this._tmpCanvas = null;
            this.webgl = null;
            this._histogram = null;
            this._integral = null;
            // lazy
            this._needsRefresh = 0;
            if ( img ) this.setImage( img, callback );
        }
        
        // properties
        ,width: 0
        ,height: 0
        ,canvasElement: null
        ,domElement: null
        ,context: null
        ,selection: null
        ,imageData: null
        ,imageDataSel: null
        ,webgl: null
        ,_histogram: null
        ,_integral: null
        ,_needsRefresh: 0
        ,_tmpCanvas: null
        
        ,select: function( x1, y1, x2, y2 ) {
            this.selection = [
                (undef===x1) ? 0 : x1,
                (undef===y1) ? 0 : y1,
                (undef===x2) ? 1 : x2,
                (undef===y2) ? 1 : y2
            ];
            this._needsRefresh |= SEL;
            return this;
        }
        
        ,deselect: function( ) {
            this.selection = null;
            this.imageDataSel = null;
            this._needsRefresh &= ~SEL;
            return this;
        }
        
        ,setWidth:  function( w ) {
            this._setWidth(w);
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,setHeight: function( h ) {
            this._setHeight(h);
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,setDimensions: function( w, h ) {
            this._setDimensions(w, h);
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,setImage: function( img, callback ) {
            if (!img) return this;
            
            var self = this, image, ctx, w, h;
            
            if (img instanceof Image || img instanceof HTMLCanvasElement || img instanceof HTMLVideoElement)
            {
                image = img;
                w = (image instanceof HTMLVideoElement) ? image.videoWidth : image.width;
                h = (image instanceof HTMLVideoElement) ? image.videoHeight : image.height;
                ctx = self.context = self._setDimensions(w, h).canvasElement.getContext('2d');
                ctx.drawImage(image, 0, 0);
                self._needsRefresh |= DATA | HIST | SAT;
                if (self.selection) self._needsRefresh |= SEL;
                self.webgl = (FILTER.useWebGL) ? new FILTER.WebGL(self.canvasElement) : null;
            }
            else // url string
            {
                image = new Image();
                image.onload = function(){
                    w = image.width;
                    h = image.height;
                    ctx = self.context = self._setDimensions(w, h).canvasElement.getContext('2d');
                    ctx.drawImage(image, 0, 0);
                    self._needsRefresh |= DATA | HIST | SAT;
                    if (self.selection) self._needsRefresh |= SEL;
                    self.webgl = (FILTER.useWebGL) ? new FILTER.WebGL(self.canvasElement) : null;
                    if (typeof callback != 'undefined') callback.call(self);
                };
                image.src = img; // load it
            }
            image.crossOrigin = '';
            return this;
        }
        
        ,getPixel: function( x, y ) {
            if (this._needsRefresh & DATA) this._refreshData();
            var off = ~~(y*this.width+x+0.5), im = this.imageData.data;
            return {
                r: im[off], 
                g: im[off+1], 
                b: im[off+2], 
                a: im[off+3]
            };
        }
        
        ,setPixel: function( x, y, r, g, b, a ) {
            var t = new IMG([r&255, g&255, b&255, a&255]);
            this.context.putImageData(t, x, y); 
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        // get direct data array
        ,getData: function( ) {
            if (this._needsRefresh & DATA) this._refreshData();
            // clone it
            return new IMG( this.imageData.data );
        }
        
        // get direct data array of selected part
        ,getSelectedData: function( ) {
            var sel;
            
            if (this.selection)  
            {
                if (this._needsRefresh & SEL) this._refreshDataSel();
                sel = this.imageDataSel;
            }
            else
            {
                if (this._needsRefresh & DATA) this._refreshData();
                sel = this.imageData;
            }
            
            // clone it
            return [new IMG( sel.data ), sel.width, sel.height];
        }
        
        // set direct data array
        ,setData: function(a/*, w, h*/) {
            if (this._needsRefresh & DATA) this._refreshData();
            this.imageData.data.set(a); // not supported in Opera, IE, Safari
            this.context.putImageData(this.imageData, 0, 0); 
            this._needsRefresh |= HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        // set direct data array of selected part
        ,setSelectedData: function(a/*, w, h*/) {
            if (this.selection /*this.imageDataSel*/)
            {
                var sel = this.selection, ow = this.width-1, oh = this.height-1,
                    xs = Floor(sel[0]*ow), ys = Floor(sel[1]*oh);
                if (this._needsRefresh & SEL) this._refreshDataSel();
                this.imageDataSel.data.set(a); // not supported in Opera, IE, Safari
                this.context.putImageData(this.imageDataSel, xs, ys); 
                this._needsRefresh |= DATA;
            }
            else
            {
                if (this._needsRefresh & DATA) this._refreshData();
                this.imageData.data.set(a); // not supported in Opera, IE, Safari
                this.context.putImageData(this.imageData, 0, 0); 
                if (this.selection) this._needsRefresh |= SEL;
            }
            this._needsRefresh |= HIST | SAT;
            return this;
        }
        
        // get the imageData object
        ,getPixelData: function( ) {
            if (this._needsRefresh & DATA) this._refreshData();
            return this.imageData;
        }
        
        // set the imageData object
        ,setPixelData: function( data ) {
            this.context.putImageData(data, 0, 0); 
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,createImageData: function( w, h ) {
            this.context = this._setDimensions(w, h).canvasElement.getContext('2d');
            this.context.createImageData(w, h);
            this._needsRefresh |= DATA;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        // fast copy another FILTER.Image
        ,copy: function( image ) {
            this.setData(image.getData());
            return this;
        }
        
        ,clone: function( ) {
            return new FImage(this.canvasElement);
        }
        
        ,scale: function( sx, sy ) {
            sx = sx||1; sy = sy||sx;
            if (1==sx && 1==sy) return this;
            // lazy
            this._tmpCanvas = this._tmpCanvas || this._getTmpCanvas();
            var ctx = this._tmpCanvas.getContext('2d');
            //ctx.save();
            ctx.scale(sx, sy);
            ctx.drawImage(this.canvasElement, 0, 0);
            this.width = ~~(sx*this.width+0.5);
            this.height = ~~(sy*this.height+0.5);
            this.canvasElement.style.width = this.width + 'px';
            this.canvasElement.style.height = this.height + 'px';
            this.canvasElement.width = this.width * devicePixelRatio;
            this.canvasElement.height = this.height * devicePixelRatio;
            this.context.drawImage(this._tmpCanvas, 0, 0);
            this._tmpCanvas.width = this.width;
            this._tmpCanvas.height = this.height;
            //ctx.restore();
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,flipHorizontal: function( ) {
            // lazy
            this._tmpCanvas = this._tmpCanvas || this._getTmpCanvas();
            var ctx = this._tmpCanvas.getContext('2d');
            ctx.translate(this.width, 0); 
            ctx.scale(-1, 1);
            ctx.drawImage(this.canvasElement, 0, 0);
            this.context.drawImage(this._tmpCanvas, 0, 0);
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,flipVertical: function( ) {
            // lazy
            this._tmpCanvas = this._tmpCanvas || this._getTmpCanvas();
            var ctx = this._tmpCanvas.getContext('2d');
            ctx.translate(0, this.height); 
            ctx.scale(1, -1);
            ctx.drawImage(this.canvasElement, 0, 0);
            this.context.drawImage(this._tmpCanvas, 0, 0);
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        // clear the image contents
        ,clear: function( ) {
            if (this.width && this.height)
            {
                var ctx = this.context;
                ctx.clearRect(0, 0, this.width, this.height);  
                this._needsRefresh |= DATA | HIST | SAT;
                if (this.selection) this._needsRefresh |= SEL;
            }
            return this;
        }
        
        // fill image region contents with a specific background color
        ,fill: function( color, x, y, w, h ) {
            if (!w && this.width && !h && this.height) return this;
            else if (w && !this.width && h && !this.height)
            {
                // create the image data if needed
                this.context = this._setDimensions(w, h).canvasElement.getContext('2d');
                this.context.createImageData(w, h);
            }
            color = color||0; 
            x = x||0; y = y||0; 
            w = w||this.width; h = h||this.height;
            var ctx = this.context;
            //ctx.save();
            ctx.fillStyle = color;  
            ctx.fillRect(x, y, w, h);
            //ctx.restore();
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,draw: function( drawable, x, y, blendMode ) {
            // todo
            return this;
        }
        
        // blend with another image using various blend modes
        ,blend: function( image, mode, amount, startX, startY ) {
            if (typeof mode == 'undefined') mode='normal';
            if (typeof amount == 'undefined') amount=1;
            if (amount>1) amount=1; else if (amount<0) amount=0;
            if (typeof startX == 'undefined')  startX=0;
            if (typeof startY == 'undefined')  startY=0;
            
            var sx=0,sy=0, ctx=this.context;
            
            if (startX<0) {  sx=-startX;  startX=0;  }
            if (startY<0)  { sy=-startY;  startY=0;  }
            
            if (startX>=this.width || startY>=this.height)   return this;
            
            var blendingMode = blendModes[mode] || null;
            if (!blendingMode) return this;
            
            var 
                width = Min(this.width, image.width-sx), height = Min(this.height, image.height-sy),
                imageData1 = this.context.getImageData(startX, startY, width, height),
                imageData2 = image.context.getImageData(sx, sy, width, height),
                /** @type Array */
                pixels1 = imageData1.data,
                /** @type Array */
                pixels2 = imageData2.data,
                r, g, b, oR, oG, oB, invamount = 1 - amount,
                len = pixels2.length, i
            ;

            // blend images
            for (i = 0; i < len; i += 4) 
            {
                oR = pixels1[i];  oG = pixels1[i + 1];  oB = pixels1[i + 2];

                // calculate blended color
                r = blendingMode(pixels2[i], oR);  g = blendingMode(pixels2[i + 1], oG);  b = blendingMode(pixels2[i + 2], oB);

                // amount compositing
                pixels1[i] = r * amount + oR * invamount;  pixels1[i + 1] = g * amount + oG * invamount;  pixels1[i + 2] = b * amount + oB * invamount;
            }
            ctx.putImageData(imageData1, startX, startY);
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,integral: function( ) {
            if (this._needsRefresh & SAT) this._computeIntegral();
            return this._integral;
        }
        
        ,histogram: function( ) {
            if (this._needsRefresh & HIST) this._computeHistogram();
            return this._histogram;
        }
        
        ,toString: function( ) {
            return "[" + "FILTER Image: " + this.name + "]";
        }
        
        // auxilliary methods
        ,_getTmpCanvas: function( ) {
            var cnv = createCanvas(this.width, this.height);
            cnv.width = this.width;
            cnv.height = this.height;
            return cnv;
        }
        
        ,_setDimensions: function( w, h ) {
            this.canvasElement.style.width = w + 'px';
            this.canvasElement.width = this.width = w * devicePixelRatio;
            this.canvasElement.style.height = h + 'px';
            this.canvasElement.height = this.height = h * devicePixelRatio;
            if (this._tmpCanvas)
            {
                this._tmpCanvas.style.width = this.canvasElement.style.width;
                this._tmpCanvas.width = this.canvasElement.width;
                this._tmpCanvas.style.height = this.canvasElement.style.height;
                this._tmpCanvas.height = this.canvasElement.height;
            }
            return this;
        }
        
        ,_setWidth: function( w ) {
            this.canvasElement.style.width = w + 'px';
            this.canvasElement.width = this.width = w * devicePixelRatio;
            if (this._tmpCanvas)
            {
                this._tmpCanvas.style.width = this.canvasElement.style.width;
                this._tmpCanvas.width = this.canvasElement.width;
            }
            return this;
        }
        
        ,_setHeight: function( h ) {
            this.canvasElement.style.height = h + 'px';
            this.canvasElement.height = this.height = h * devicePixelRatio;
            if (this._tmpCanvas)
            {
                this._tmpCanvas.style.height = this.canvasElement.style.height;
                this._tmpCanvas.height = this.canvasElement.height;
            }
            return this;
        }
        
        // compute integral image (sum of columns)
        ,_computeIntegral: function( ) {
            var w = this.width, h = this.height, rowLen = w<<2,
                integralR, integralG, integralB, colR, colG, colB,
                im = this.getPixelData().data, imLen = im.length, count = (imLen>>2), i, j, x
            ;
            // compute integral of image in one pass
            integralR = new A32F(count); integralG = new A32F(count); integralB = new A32F(count);
            // first row
            j=0; i=0; colR=colG=colB=0;
            for (x=0; x<w; x++, i+=4, j++)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integralR[j]=colR; integralG[j]=colG; integralB[j]=colB;
            }
            // other rows
            i=rowLen; x=0; j=0; colR=colG=colB=0;
            for (i=rowLen; i<imLen; i+=4, j++, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=0; }
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integralR[j+w]=integralR[j]+colR; integralG[j+w]=integralG[j]+colG; integralB[j+w]=integralB[j]+colB;
            }
            this._integral = [integralR, integralG, integralB];
            this._needsRefresh &= ~SAT;
            return this;
        }
        
        ,_computeHistogram: function( ) {
            var im = this.getPixelData().data, l = im.length,
                maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
                cdfR, cdfG, cdfB, r,g,b,
                accumR, accumG, accumB,
                i, n=1.0/(l>>2)
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
                accumR += cdfR[i]; cdfR[i] = accumR;
                accumG += cdfG[i]; cdfG[i] = accumG;
                accumB += cdfB[i]; cdfB[i] = accumB;
                accumR += cdfR[i+1]; cdfR[i+1] = accumR;
                accumG += cdfG[i+1]; cdfG[i+1] = accumG;
                accumB += cdfB[i+1]; cdfB[i+1] = accumB;
                accumR += cdfR[i+2]; cdfR[i+2] = accumR;
                accumG += cdfG[i+2]; cdfG[i+2] = accumG;
                accumB += cdfB[i+2]; cdfB[i+2] = accumB;
                accumR += cdfR[i+3]; cdfR[i+3] = accumR;
                accumG += cdfG[i+3]; cdfG[i+3] = accumG;
                accumB += cdfB[i+3]; cdfB[i+3] = accumB;
            }
            
            this._histogram = [cdfR, cdfG, cdfB];
            this._needsRefresh &= ~HIST;
            return this;
        }
        
        ,_refreshData: function( ) {
            this.imageData = this.context.getImageData(0, 0, this.width, this.height);
            this._needsRefresh &= ~DATA;
            return this;
        }
        
        ,_refreshDataSel: function( ) {
            if (this.selection)
            {
                var sel = this.selection, ow = this.width-1, oh = this.height-1,
                    xs = Floor(sel[0]*ow), ys = Floor(sel[1]*oh), 
                    ws = Floor(sel[2]*ow)-xs+1, hs = Floor(sel[3]*oh)-ys+1
                ;
                this.imageDataSel = this.context.getImageData(xs, ys, ws, hs);
            }
            this._needsRefresh &= ~SEL;
            return this;
        }
    });

    //
    //
    // Scaled Image (Proxy) Class
    var FSImage = FILTER.ScaledImage = FILTER.Class( FImage, {
        name: "ScaledImage"
        
        ,constructor: function( scalex, scaley, img, callback ) {
            this.scaleX = scalex || 1;
            this.scaleY = scaley || this.scaleX;
            this.$super('constructor', img, callback);
        }
        
        ,scaleX: 1
        ,scaleY: 1
        
        ,clone: function( ) {
            return new FSImage(this.scaleX, this.scaleY, this.canvasElement);
        }
        
        ,setScale: function( sx, sy ) {
            if (undef!==sx && null!==sx) this.scaleX = sx;
            if (undef===sy && undef!==sx && null!==sx) this.scaleY = sx;
            else if (null!==sy) this.scaleY = sy;
            return this;
        }
        
        ,setImage: function( img, callback ) {
            if (!img) return this;
            
            var self = this, image, ctx, w, h, sw, sh, sx = this.scaleX, sy = this.scaleY;
            
            if (img instanceof Image || img instanceof HTMLCanvasElement || img instanceof HTMLVideoElement)
            {
                image = img;
                w = (image instanceof HTMLVideoElement) ? image.videoWidth : image.width;
                h = (image instanceof HTMLVideoElement) ? image.videoHeight : image.height;
                sw = ~~(sx*w + 0.5);
                sh = ~~(sy*h + 0.5);
                ctx = self.context = self._setDimensions(sw, sh).canvasElement.getContext('2d');
                ctx.drawImage(image, 0, 0, w, h, 0, 0, sw, sh);
                self._needsRefresh |= DATA | HIST | SAT;
                if (self.selection) self._needsRefresh |= SEL;
                self.webgl = (FILTER.useWebGL) ? new FILTER.WebGL(self.canvasElement) : null;
            }
            else // url string
            {
                image = new Image();
                image.onload = function(){
                    w = image.width;
                    h = image.height;
                    sw = ~~(sx*w + 0.5);
                    sh = ~~(sy*h + 0.5);
                    ctx = self.context = self._setDimensions(w, h).canvasElement.getContext('2d');
                    ctx.drawImage(image, 0, 0, w, h, 0, 0, sw, sh);
                    self._needsRefresh |= DATA | HIST | SAT;
                    if (self.selection) self._needsRefresh |= SEL;
                    self.webgl = (FILTER.useWebGL) ? new FILTER.WebGL(self.canvasElement) : null;
                    if (typeof callback != 'undefined') callback.call(self);
                };
                image.src = img; // load it
            }
            image.crossOrigin = '';
            return this;
        }
    });
    
}(FILTER);/**
*
* Custom Filter(s)
*
* Allows to create an filter on-the-fly using an inline function
*
* @param handler Optional (the filter apply routine)
* @package FILTER.js
*
**/
!function(FILTER, undef){
    
    "use strict";
    
    //
    //
    //  Custom Filter 
    //  used as a placeholder for constructing filters inline with an anonymous function
    var CustomFilter = FILTER.CustomFilter = FILTER.Class( FILTER.Filter, {
        name: "CustomFilter"
        
        ,constructor: function( handler ) {
            this._handler = handler ? handler.bind( this ) : null;
        }
        
        ,_handler: null
        
        ,dispose: function( ) {
            this._worker = null;
            this._workerListeners = null;
            this._handler = null;
            return this;
        }
        
        ,worker: function( bool ) {
            // no worker support for custom filters (yet??)
            this._worker = null;
            this._workerListeners = null;
            return this;
        }
        
        ,_apply: function(im, w, h, image) {
            if ( !this._isOn || !this._handler ) return im;
            return this._handler( im, w, h, image );
        }
        
        ,apply: function( image ) {
            if ( this._isOn && this._handler )
            {
                var im = image.getSelectedData( );
                image.setSelectedData( this._handler( im[ 0 ], im[ 1 ], im[ 2 ], image ) );
            }
            return image;
        }
    });
    
}(FILTER);/**
*
* Color Matrix Filter(s)
*
* Changes target coloring combining current pixel color values according to Matrix
*
* (matrix is 4x5 array of values which are (eg for row 1: Red value): 
* New red Value=Multiplier for red value, multiplier for Green value, multiplier for Blue Value, Multiplier for Alpha Value,constant  bias term
* other rows are similar but for new Green, Blue and Alpha values respectively) 
*
* @param colorMatrix Optional (a color matrix as an array of values)
* @package FILTER.js
*
**/
!function(FILTER, undef){

    "use strict";
    
    var Sin=Math.sin, Cos=Math.cos,
        // Color Matrix
        CM=FILTER.Array32F,
        toRad=FILTER.CONSTANTS.toRad, toDeg=FILTER.CONSTANTS.toDeg,
        notSupportClamp=FILTER._notSupportClamp
    ;
    
    //
    //
    // ColorMatrixFilter
    var ColorMatrixFilter = FILTER.ColorMatrixFilter = FILTER.Class( FILTER.Filter, {
        name: "ColorMatrixFilter"
        
        ,constructor: function( matrix ) {
            if ( matrix && matrix.length )
            {
                this._matrix = new CM(matrix);
            }    
            else
            {
                // identity matrix
                this._matrix = null;
            }
            
            if ( FILTER.useWebGL ) 
                this._webglInstance = FILTER.WebGLColorMatrixFilterInstance || null;
        }
        
        ,_matrix: null
        ,_webglInstance: null
        
        ,dispose: function( ) {
            var self = this;
            
            self.disposeWorker( );
            
            self._webglInstance = null;
            self._matrix = null;
            
            return self;
        }
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                
                ,params: {
                    _matrix: self._matrix
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                params = json.params;
                
                self._matrix = params._matrix;
            }
            return self;
        }
        
        // get the image color channel as a new image
        ,channel: function( ch, asGray ) {
            asGray = ( asGray === undef ) ? false : asGray;
            var f = ( asGray ) ? 1 : 0;
            switch(ch)
            {
                case FILTER.CHANNEL.ALPHA:
                    return this.concat([
                                0, 0, 0, 1, 0, 
                                0, 0, 0, 1, 0, 
                                0, 0, 0, 1, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;
                
                case FILTER.CHANNEL.BLUE:
                    return this.set([
                                0, 0, f, 0, 0, 
                                0, 0, f, 0, 0, 
                                0, 0, 1, 0, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;
                
                case FILTER.CHANNEL.GREEN:
                    return this.set([
                                0, f, 0, 0, 0, 
                                0, 1, 0, 0, 0, 
                                0, f, 0, 0, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;
                
                case FILTER.CHANNEL.RED:
                default:
                    return this.set([
                                1, 0, 0, 0, 0, 
                                f, 0, 0, 0, 0, 
                                f, 0, 0, 0, 0, 
                                0, 0, 0, 0, 255
                            ]);
                    break;
            }
        }
        
        // aliases
        // get the image red channel as a new image
        ,redChannel: function( asGray ) {
            return this.channel(FILTER.CHANNEL.RED, asGray);
        }
        
        // get the image green channel as a new image
        ,greenChannel: function( asGray ) {
            return this.channel(FILTER.CHANNEL.GREEN, asGray);
        }
        
        // get the image blue channel as a new image
        ,blueChannel: function( asGray ) {
            return this.channel(FILTER.CHANNEL.BLUE, asGray);
        }
        
        // get the image alpha channel as a new image
        ,alphaChannel: function( asGray ) {
            return this.channel(FILTER.CHANNEL.ALPHA, true);
        }
        
        ,maskChannel: function( ch ) {
            switch( ch )
            {
                case FILTER.CHANNEL.ALPHA:
                    return this;
                    break;
                
                case FILTER.CHANNEL.BLUE:
                    return this.set([
                                1, 0, 0, 0, 0, 
                                0, 1, 0, 0, 0, 
                                0, 0, 0, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                    break;
                
                case FILTER.CHANNEL.GREEN:
                    return this.set([
                                1, 0, 0, 0, 0, 
                                0, 0, 0, 0, 0, 
                                0, 0, 1, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                    break;
                
                case FILTER.CHANNEL.RED:
                default:
                    return this.set([
                                0, 0, 0, 0, 0, 
                                0, 1, 0, 0, 0, 
                                0, 0, 1, 0, 0, 
                                0, 0, 0, 1, 0
                            ]);
                    break;
            }
        }
        
        ,swapChannels: function( ch1, ch2 ) {
            switch( ch1 )
            {
                case FILTER.CHANNEL.ALPHA:
                    switch( ch2 )
                    {
                        case FILTER.CHANNEL.ALPHA:
                            return this;
                            break;
                        
                        case FILTER.CHANNEL.BLUE:
                            return this.set([
                                        1, 0, 0, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 0, 1, 0, 
                                        0, 0, 1, 0, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.GREEN:
                            return this.set([
                                        1, 0, 0, 0, 0, 
                                        0, 0, 0, 1, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.RED:
                        default:
                            return this.set([
                                        0, 0, 0, 1, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        1, 0, 0, 0, 0
                                    ]);
                            break;
                    }
                    break;
                
                case FILTER.CHANNEL.BLUE:
                    switch( ch2 )
                    {
                        case FILTER.CHANNEL.ALPHA:
                            return this.set([
                                        1, 0, 0, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 0, 1, 0, 
                                        0, 0, 1, 0, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.BLUE:
                            return this;
                            break;
                        
                        case FILTER.CHANNEL.GREEN:
                            return this.set([
                                        1, 0, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.RED:
                        default:
                            return this.set([
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        1, 0, 0, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                    }
                    break;
                
                case FILTER.CHANNEL.GREEN:
                    switch( ch2 )
                    {
                        case FILTER.CHANNEL.ALPHA:
                            return this.set([
                                        1, 0, 0, 0, 0, 
                                        0, 0, 0, 1, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.BLUE:
                            return this.set([
                                        1, 0, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.GREEN:
                            return this;
                            break;
                        
                        case FILTER.CHANNEL.RED:
                        default:
                            return this.set([
                                        0, 1, 0, 0, 0, 
                                        1, 0, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                    }
                    break;
                
                case FILTER.CHANNEL.RED:
                default:
                    switch( ch2 )
                    {
                        case FILTER.CHANNEL.ALPHA:
                            return this.set([
                                        0, 0, 0, 1, 0, 
                                        0, 1, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        1, 0, 0, 0, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.BLUE:
                            return this.set([
                                        0, 0, 1, 0, 0, 
                                        0, 1, 0, 0, 0, 
                                        1, 0, 0, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.GREEN:
                            return this.set([
                                        0, 1, 0, 0, 0, 
                                        1, 0, 0, 0, 0, 
                                        0, 0, 1, 0, 0, 
                                        0, 0, 0, 1, 0
                                    ]);
                            break;
                        
                        case FILTER.CHANNEL.RED:
                        default:
                            return this;
                            break;
                    }
                    break;
            }
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,desaturate: function( ) {
            return this.set([
                        FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
                        FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
                        FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
                        0, 0, 0, 1, 0
                    ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,colorize: function( rgb, amount ) {
            var r, g, b, inv_amount;
            if ( amount === undef ) amount = 1;
            r = (((rgb >> 16) & 255) * 0.0039215686274509803921568627451);  // / 255
            g = (((rgb >> 8) & 255) * 0.0039215686274509803921568627451);  // / 255
            b = ((rgb & 255) * 0.0039215686274509803921568627451);  // / 255
            inv_amount = 1 - amount;

            return this.set([
                        (inv_amount + ((amount * r) * FILTER.LUMA[0])), ((amount * r) * FILTER.LUMA[1]), ((amount * r) * FILTER.LUMA[2]), 0, 0, 
                        ((amount * g) * FILTER.LUMA[0]), (inv_amount + ((amount * g) * FILTER.LUMA[1])), ((amount * g) * FILTER.LUMA[2]), 0, 0, 
                        ((amount * b) * FILTER.LUMA[0]), ((amount * b) * FILTER.LUMA[1]), (inv_amount + ((amount * b) * FILTER.LUMA[2])), 0, 0, 
                            0, 0, 0, 1, 0
                        ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,invert: function( ) {
            return this.set([
                    -1, 0,  0, 0, 255,
                    0, -1,  0, 0, 255,
                    0,  0, -1, 0, 255,
                    0,  0,  0, 1,   0
                ]);
        }
        
        ,invertAlpha: function( ) {
            return this.set([
                    1,  0,  0, 0, 0,
                    0,  1,  0, 0, 0,
                    0,  0,  1, 0, 0,
                    0,  0,  0, -1, 255
                ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,saturate: function( s ) {
            var sInv, irlum, iglum, iblum;
            sInv = (1 - s);  irlum = (sInv * FILTER.LUMA[0]);
            iglum = (sInv * FILTER.LUMA[1]);  iblum = (sInv * FILTER.LUMA[2]);
            
            return this.set([
                    (irlum + s), iglum, iblum, 0, 0, 
                    irlum, (iglum + s), iblum, 0, 0, 
                    irlum, iglum, (iblum + s), 0, 0, 
                    0, 0, 0, 1, 0
                ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,contrast: function( r, g, b ) {
            if ( g === undef )  g = r;
            if ( b === undef )  b = r;
            r += 1.0; g += 1.0; b += 1.0;
            return this.set([
                    r, 0, 0, 0, (128 * (1 - r)), 
                    0, g, 0, 0, (128 * (1 - g)), 
                    0, 0, b, 0, (128 * (1 - b)), 
                    0, 0, 0, 1, 0
                ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,brightness: function( r, g, b ) {
            if ( g === undef )  g = r;
            if ( b === undef )  b = r;
            
            return this.set([
                    1, 0, 0, 0, r, 
                    0, 1, 0, 0, g, 
                    0, 0, 1, 0, b, 
                    0, 0, 0, 1, 0
                ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,adjustHue: function( degrees ) {
            degrees *= toRad;
            var cos = Cos(degrees), sin = Sin(degrees);
            
            return this.set([
                    ((FILTER.LUMA[0] + (cos * (1 - FILTER.LUMA[0]))) + (sin * -(FILTER.LUMA[0]))), ((FILTER.LUMA[1] + (cos * -(FILTER.LUMA[1]))) + (sin * -(FILTER.LUMA[1]))), ((FILTER.LUMA[2] + (cos * -(FILTER.LUMA[2]))) + (sin * (1 - FILTER.LUMA[2]))), 0, 0, 
                    ((FILTER.LUMA[0] + (cos * -(FILTER.LUMA[0]))) + (sin * 0.143)), ((FILTER.LUMA[1] + (cos * (1 - FILTER.LUMA[1]))) + (sin * 0.14)), ((FILTER.LUMA[2] + (cos * -(FILTER.LUMA[2]))) + (sin * -0.283)), 0, 0, 
                    ((FILTER.LUMA[0] + (cos * -(FILTER.LUMA[0]))) + (sin * -((1 - FILTER.LUMA[0])))), ((FILTER.LUMA[1] + (cos * -(FILTER.LUMA[1]))) + (sin * FILTER.LUMA[1])), ((FILTER.LUMA[2] + (cos * (1 - FILTER.LUMA[2]))) + (sin * FILTER.LUMA[2])), 0, 0, 
                    0, 0, 0, 1, 0
                ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,average: function( r, g, b ) {
            if ( r === undef ) r = 0.3333;
            if ( g === undef ) g = 0.3333;
            if ( b === undef ) b = 0.3334;
            
            return this.set([
                    r, g, b, 0, 0, 
                    r, g, b, 0, 0, 
                    r, g, b, 0, 0, 
                    0, 0, 0, 1, 0
                ]);
        }
        
        ,quickContrastCorrection: function( contrast ) {
            if ( contrast === undef ) contrast = 1.2;
            
            return this.set([
                contrast, 0, 0, 0, 0, 
                0, contrast, 0, 0, 0, 
                0, 0, contrast, 0, 0, 
                0, 0, 0, 1, 0
                ]);
        }
        
        // adapted from glfx.js
        // Gives the image a reddish-brown monochrome tint that imitates an old photograph.
        // 0 to 1 (0 for no effect, 1 for full sepia coloring)
        ,sepia: function( amount ) {
            if ( amount === undef ) amount = 0.5;
            if ( amount > 1 ) amount = 1;
            else if ( amount < 0 ) amount = 0;
            return this.set([
                1.0 - (0.607 * amount), 0.769 * amount, 0.189 * amount, 0, 0, 
                0.349 * amount, 1.0 - (0.314 * amount), 0.168 * amount, 0, 0, 
                0.272 * amount, 0.534 * amount, 1.0 - (0.869 * amount), 0, 0, 
                0, 0, 0, 1, 0
            ]);
        }
        
        ,sepia2: function( amount ) {
            if ( amount === undef ) amount = 10;
            if ( amount > 100 ) amount = 100;
            amount *= 2.55;
            return this.set([
                FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 40, 
                FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 20, 
                FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, -amount, 
                0, 0, 0, 1, 0
            ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,threshold: function( threshold, factor ) {
            if ( factor === undef )  factor = 256;
            
            return this.set([
                    (FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
                    (FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
                    (FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
                    0, 0, 0, 1, 0
                ]);
        }
        
        // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
        ,threshold_rgb: function( threshold, factor ) {
            if ( factor === undef )  factor = 256;
            
            return this.set([
                    factor, 0, 0, 0, (-(factor-1) * threshold), 
                    0, factor, 0, 0, (-(factor-1) * threshold), 
                    0,  0, factor, 0, (-(factor-1) * threshold), 
                    0, 0, 0, 1, 0
                ]);
        }
        
        ,threshold_alpha: function( threshold, factor ) {
            if ( threshold === undef )  threshold = 0.5;
            if ( factor === undef ) factor = 256;
            
            return this.set([
                    1, 0, 0, 0, 0, 
                    0, 1, 0, 0, 0, 
                    0, 0, 1, 0, 0, 
                    0, 0, 0, factor, (-factor * threshold)
                ]);
        }
        
        // RGB to YCbCr
        ,RGB2YCbCr: function( ) {
            return this.set([
                    0.5, -0.418688, -0.081312, 0, 128,  // Cr component in RED channel
                    0.299, 0.587, 0.114, 0, 0,   // Y component in GREEN channel
                    -0.168736, -0.331264, 0.5, 0, 128,  // Cb component in BLUE channel
                    0, 0, 0, 1, 0
                ]);
        }
        
        // YCbCr to RGB
        ,YCbCr2RGB: function( ) {
            return this.set([
                    1.402, 1, 0, 0, -179.456,  
                    -0.71414, 1, -0.34414, 0, 135.45984,
                    0, 1, 1.772, 0, -226.816,
                    0, 0, 0, 1, 0
                ]);
        }
        
        // blend with another filter
        ,blend: function( filt, amount ) {
            this._matrix = ( this._matrix ) ? CMblend(this._matrix, filt.getMatrix(), amount) : new CM(filt.getMatrix());
            return this;
        }
        
        ,set: function( mat ) {
            this._matrix = ( this._matrix ) ? CMconcat(this._matrix, new CM(mat)) : new CM(mat);
            return this;
        }
        
        ,reset: function( ) {
            this._matrix = null; 
            return this;
        }
        
        ,combineWith: function( filt ) {
            return this.set( filt.getMatrix() );
        }
        
        ,getMatrix: function( ) {
            return this._matrix;
        }
        
        ,setMatrix: function( m ) {
            this._matrix = new CM(m); 
            return this;
        }
        
        // used for internal purposes
        ,_apply: function(p, w, h/*, image*/) {
            if ( this._isOn && this._matrix )
            {
                var pl = p.length, m = this._matrix,
                    i, rem = (pl>>2)%4,
                    p0, p1, p2, p3, 
                    p4, p5, p6, p7, 
                    p8, p9, p10, p11,
                    p12, p13, p14, p15,
                    t0, t1, t2, t3
                ;
                
                // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
                if (notSupportClamp)
                {   
                    // linearize array
                    // partial loop unrolling (quarter iterations)
                    for (i=0; i<pl; i+=16)
                    {
                        t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                        p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                        p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                        p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                        p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                        
                        t0 = p[i+4]; t1 = p[i+5]; t2 = p[i+6]; t3 = p[i+7];
                        p4  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                        p5  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                        p6  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                        p7  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                        
                        t0 = p[i+8]; t1 = p[i+9]; t2 = p[i+10]; t3 = p[i+11];
                        p8  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                        p9  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                        p10  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                        p11  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                        
                        t0 = p[i+12]; t1 = p[i+13]; t2 = p[i+14]; t3 = p[i+15];
                        p12  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                        p13  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                        p14  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                        p15  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                        
                        // clamp them manually
                        p0 = (p0<0) ? 0 : ((p0>255) ? 255 : p0);
                        p1 = (p1<0) ? 0 : ((p1>255) ? 255 : p1);
                        p2 = (p2<0) ? 0 : ((p2>255) ? 255 : p2);
                        p3 = (p3<0) ? 0 : ((p3>255) ? 255 : p3);
                        p4 = (p4<0) ? 0 : ((p4>255) ? 255 : p4);
                        p5 = (p5<0) ? 0 : ((p5>255) ? 255 : p5);
                        p6 = (p6<0) ? 0 : ((p6>255) ? 255 : p6);
                        p7 = (p7<0) ? 0 : ((p7>255) ? 255 : p7);
                        p8 = (p8<0) ? 0 : ((p8>255) ? 255 : p8);
                        p9 = (p9<0) ? 0 : ((p9>255) ? 255 : p9);
                        p10 = (p10<0) ? 0 : ((p10>255) ? 255 : p10);
                        p11 = (p11<0) ? 0 : ((p11>255) ? 255 : p11);
                        p12 = (p12<0) ? 0 : ((p12>255) ? 255 : p12);
                        p13 = (p13<0) ? 0 : ((p13>255) ? 255 : p13);
                        p14 = (p14<0) ? 0 : ((p14>255) ? 255 : p14);
                        p15 = (p15<0) ? 0 : ((p15>255) ? 255 : p15);
                        
                        p[i] = ~~p0; p[i+1] = ~~p1; p[i+2] = ~~p2; p[i+3] = ~~p3;
                        p[i+4] = ~~p4; p[i+5] = ~~p5; p[i+6] = ~~p6; p[i+7] = ~~p7;
                        p[i+8] = ~~p8; p[i+9] = ~~p9; p[i+10] = ~~p10; p[i+11] = ~~p11;
                        p[i+12] = ~~p12; p[i+13] = ~~p13; p[i+14] = ~~p14; p[i+15] = ~~p15;
                    }
                    
                    // loop unrolling remainder
                    if (rem)
                    {
                        rem <<= 2;
                        for (i=pl-rem; i<pl; i+=4)
                        {
                            t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                            p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                            p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                            p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                            p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                            
                            // clamp them manually
                            p0 = (p0<0) ? 0 : ((p0>255) ? 255 : p0);
                            p1 = (p1<0) ? 0 : ((p1>255) ? 255 : p1);
                            p2 = (p2<0) ? 0 : ((p2>255) ? 255 : p2);
                            p3 = (p3<0) ? 0 : ((p3>255) ? 255 : p3);
                            
                            p[i] = ~~p0; p[i+1] = ~~p1; p[i+2] = ~~p2; p[i+3] = ~~p3;
                        }
                    }
                }
                else
                {
                    // linearize array
                    // partial loop unrolling (quarter iterations)
                    for (i=0; i<pl; i+=16)
                    {
                        t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                        p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                        p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                        p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                        p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                        
                        t0 = p[i+4]; t1 = p[i+5]; t2 = p[i+6]; t3 = p[i+7];
                        p4  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                        p5  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                        p6  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                        p7  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                        
                        t0 = p[i+8]; t1 = p[i+9]; t2 = p[i+10]; t3 = p[i+11];
                        p8  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                        p9  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                        p10  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                        p11  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                        
                        t0 = p[i+12]; t1 = p[i+13]; t2 = p[i+14]; t3 = p[i+15];
                        p12  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                        p13  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                        p14  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                        p15  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                        
                        p[i] = ~~p0; p[i+1] = ~~p1; p[i+2] = ~~p2; p[i+3] = ~~p3;
                        p[i+4] = ~~p4; p[i+5] = ~~p5; p[i+6] = ~~p6; p[i+7] = ~~p7;
                        p[i+8] = ~~p8; p[i+9] = ~~p9; p[i+10] = ~~p10; p[i+11] = ~~p11;
                        p[i+12] = ~~p12; p[i+13] = ~~p13; p[i+14] = ~~p14; p[i+15] = ~~p15;
                    }
                    
                    // loop unrolling remainder
                    if (rem)
                    {
                        rem <<= 2;
                        for (i=pl-rem; i<pl; i+=4)
                        {
                            t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                            p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                            p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                            p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                            p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                            
                            p[i] = ~~p0; p[i+1] = ~~p1; p[i+2] = ~~p2; p[i+3] = ~~p3;
                        }
                    }
                }
            }
            return p;
        }
        
        ,apply: function( image, cb ) {
            if ( this._isOn && this._matrix )
            {
                /*if (this._webglInstance)
                {
                    var w=image.width, h=image.height;
                    this._webglInstance.filterParams=[
                        new CM([w, h]),
                        1.0,
                        new CM([w, h]),
                        this._matrix
                    ];
                    this._webglInstance._apply(image.webgl, w, h);
                    return image;
                }*/
                if ( this._worker )
                {
                    this
                        .bind( 'apply', function( data ) { 
                            this.unbind( 'apply' );
                            if ( data && data.im )
                                image.setSelectedData( data.im );
                            if ( cb ) cb.call( this );
                        })
                        // send filter params to worker
                        //.send( 'params', this.serialize( ) )
                        // process request
                        .send( 'apply', {im: image.getSelectedData( ), params: this.serialize( )} )
                    ;
                }
                else
                {
                    var im = image.getSelectedData( );
                    image.setSelectedData( this._apply( im[ 0 ], im[ 1 ], im[ 2 ], image ) );
                    if ( cb ) cb.call( this );
                }
            }
            return image;
        }
    });
    // aliases
    ColorMatrixFilter.prototype.grayscale = ColorMatrixFilter.prototype.desaturate;
    ColorMatrixFilter.prototype.rotateHue = ColorMatrixFilter.prototype.adjustHue;
    ColorMatrixFilter.prototype.thresholdRgb = ColorMatrixFilter.prototype.threshold_rgb;
    ColorMatrixFilter.prototype.thresholdAlpha = ColorMatrixFilter.prototype.threshold_alpha;
        
    //
    //
    // private methods
    function eye()
    {
        return new CM([
            1,0,0,0,0,
            0,1,0,0,0,
            0,0,1,0,0,
            0,0,0,1,0
        ]);
    }
     
     // concatenate 2 Color Matrices (kind of Color Matrix multiplication)
     function CMconcat(tm, mat) 
     {
        var t=new CM(20), m0, m1, m2, m3, m4;
        
        // unroll the loop completely
        // i=0
        m0=mat[0]; m1=mat[1]; m2=mat[2]; m3=mat[3]; m4=mat[4];
        t[ 0 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
        t[ 1 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
        t[ 2 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
        t[ 3 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
        t[ 4 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;

        // i=5
        m0=mat[5]; m1=mat[6]; m2=mat[7]; m3=mat[8]; m4=mat[9];
        t[ 5 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
        t[ 6 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
        t[ 7 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
        t[ 8 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
        t[ 9 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;
        
        // i=10
        m0=mat[10]; m1=mat[11]; m2=mat[12]; m3=mat[13]; m4=mat[14];
        t[ 10 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
        t[ 11 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
        t[ 12 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
        t[ 13 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
        t[ 14 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;
        
        // i=15
        m0=mat[15]; m1=mat[16]; m2=mat[17]; m3=mat[18]; m4=mat[19];
        t[ 15 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
        t[ 16 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
        t[ 17 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
        t[ 18 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
        t[ 19 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;
        
        return t;
    }
   
    function CMblend(m1, m2, amount)
    {
        var inv_amount = (1 - amount), i = 0, m=new CM(20);
        
        // unroll the loop completely
        m[ 0 ] = (inv_amount * m1[0]) + (amount * m2[0]);
        m[ 1 ] = (inv_amount * m1[1]) + (amount * m2[1]);
        m[ 2 ] = (inv_amount * m1[2]) + (amount * m2[2]);
        m[ 3 ] = (inv_amount * m1[3]) + (amount * m2[3]);
        m[ 4 ] = (inv_amount * m1[4]) + (amount * m2[4]);

        m[ 5 ] = (inv_amount * m1[5]) + (amount * m2[5]);
        m[ 6 ] = (inv_amount * m1[6]) + (amount * m2[6]);
        m[ 7 ] = (inv_amount * m1[7]) + (amount * m2[7]);
        m[ 8 ] = (inv_amount * m1[8]) + (amount * m2[8]);
        m[ 9 ] = (inv_amount * m1[9]) + (amount * m2[9]);
        
        m[ 10 ] = (inv_amount * m1[10]) + (amount * m2[10]);
        m[ 11 ] = (inv_amount * m1[11]) + (amount * m2[11]);
        m[ 12 ] = (inv_amount * m1[12]) + (amount * m2[12]);
        m[ 13 ] = (inv_amount * m1[13]) + (amount * m2[13]);
        m[ 14 ] = (inv_amount * m1[14]) + (amount * m2[14]);
        
        m[ 15 ] = (inv_amount * m1[15]) + (amount * m2[15]);
        m[ 16 ] = (inv_amount * m1[16]) + (amount * m2[16]);
        m[ 17 ] = (inv_amount * m1[17]) + (amount * m2[17]);
        m[ 18 ] = (inv_amount * m1[18]) + (amount * m2[18]);
        m[ 19 ] = (inv_amount * m1[19]) + (amount * m2[19]);
        
        //while (i < 20) { m[i] = (inv_amount * m1[i]) + (amount * m2[i]);  i++; };
        
        return m;
    }
    
}(FILTER);/**
*
* Table Lookup Filter
*
* Changes target image colors according to color lookup tables for each channel
*
* @param tableR Optional (a lookup table of 256 color values for red channel)
* @param tableG Optional (a lookup table of 256 color values for green channel)
* @param tableB Optional (a lookup table of 256 color values for blue channel)
* @param tableA Optional (a lookup table of 256 color values for alpha channel, NOT USED YET)
* @package FILTER.js
*
**/
!function(FILTER, undef){
    
    "use strict";
    
    // color table
    var CT=FILTER.ImArrayCopy, clamp = FILTER.Color.clampPixel,
    
        eye = function(inv) {
            var t=new CT(256), i=0;
            if (inv)  while (i<256) { t[i]=255-i; i++; }
            else   while (i<256) { t[i]=i; i++; }
            return t;
        },
    
        ones = function(col) {
            var t=new CT(256), i=0;
            while (i<256) { t[i]=col; i++; }
            return t;
        },
        
        clone = function(t) {
            if (t) return new CT(t);
            return null;
        },
        
        Power=Math.pow, Exponential=Math.exp, nF=1/255, trivial=eye(), inverce=eye(1)
    ;
    
    //
    //
    // TableLookupFilter
    var TableLookupFilter = FILTER.TableLookupFilter = FILTER.Class( FILTER.Filter, {
        name: "TableLookupFilter"
        
        ,constructor: function( tR, tG, tB, tA ) {
            this._tableR = tR || null;
            this._tableG = tG || this._tableR;
            this._tableB = tB || this._tableG;
            this._tableA = tA || null;
        }
        
        // parameters
        ,_tableR: null
        ,_tableG: null
        ,_tableB: null
        ,_tableA: null
        
        ,dispose: function( ) {
            var self = this;
            
            self.disposeWorker( );
            
            self._tableR = null;
            self._tableG = null;
            self._tableB = null;
            self._tableA = null;
            
            return self;
        }
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                
                ,params: {
                    _tableR: self._tableR
                    ,_tableG: self._tableG
                    ,_tableB: self._tableB
                    ,_tableA: self._tableA
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                params = json.params;
                
                self._tableR = params._tableR;
                self._tableG = params._tableG;
                self._tableB = params._tableB;
                self._tableA = params._tableA;
            }
            return self;
        }
        
        ,thresholds: function( thresholdsR, thresholdsG, thresholdsB ) {
            // assume thresholds are given in pointwise scheme as pointcuts
            // not in cumulative scheme
            // [ 0.5 ] => [0, 1]
            // [ 0.3, 0.3, 0.3 ] => [0, 0.3, 0.6, 1]
            if (!thresholdsR.length) thresholdsR=[thresholdsR];
            if (!thresholdsG) thresholdsG=thresholdsR;
            if (!thresholdsB) thresholdsB=thresholdsG;

            var tLR=thresholdsR.length, numLevelsR=tLR+1, 
                tLG=thresholdsG.length, numLevelsG=tLG+1, 
                tLB=thresholdsB.length, numLevelsB=tLB+1, 
                tR=new CT(256), qR=new CT(numLevelsR), 
                tG=new CT(256), qG=new CT(numLevelsG), 
                tB=new CT(256), qB=new CT(numLevelsB), 
                i, j, nLR=255/(numLevelsR-1), nLG=255/(numLevelsG-1), nLB=255/(numLevelsB-1)
            ;
            i=0; while (i<numLevelsR) { qR[i] = ~~(nLR * i); i++; }
            thresholdsR[0]=~~(255*thresholdsR[0]);
            i=1; while (i<tLR) { thresholdsR[i]=thresholdsR[i-1] + ~~(255*thresholdsR[i]); i++; }
            i=0; while (i<numLevelsG) { qG[i] = ~~(nLG * i); i++; }
            thresholdsG[0]=~~(255*thresholdsG[0]);
            i=1; while (i<tLG) { thresholdsG[i]=thresholdsG[i-1] + ~~(255*thresholdsG[i]); i++; }
            i=0; while (i<numLevelsB) { qB[i] = ~~(nLB * i); i++; }
            thresholdsB[0]=~~(255*thresholdsB[0]);
            i=1; while (i<tLB) { thresholdsB[i]=thresholdsB[i-1] + ~~(255*thresholdsB[i]); i++; }

            i=0; 
            while (i<256) 
            { 
                // the non-linear mapping is here
                j=0; while (j<tLR && i>thresholdsR[j]) j++;
                tR[ i ] = clamp(qR[ j ]); 
                j=0; while (j<tLG && i>thresholdsG[j]) j++;
                tG[ i ] = clamp(qG[ j ]); 
                j=0; while (j<tLB && i>thresholdsB[j]) j++;
                tB[ i ] = clamp(qB[ j ]); 
                i++; 
            }
            return this.set(tR, tG, tB);
        }
        
        ,threshold: function( thresholdR, thresholdG, thresholdB ) {
            thresholdR=thresholdR || 0.5;
            thresholdG=thresholdG || thresholdR;
            thresholdB=thresholdB || thresholdG;
            return this.thresholds([thresholdR], [thresholdG], [thresholdB]);
        }
        
        ,quantize: function( numLevels ) {
            if ( numLevels === undef ) numLevels=64;
            if (numLevels<2) numLevels=2;

            var t=new CT(256), q=new CT(numLevels), i, nL=255/(numLevels-1), nR=numLevels/256;
            i=0; while (i<numLevels) { q[i] = ~~(nL * i); i++; }
            i=0; while (i<256) { t[i] = clamp(q[ ~~(nR * i) ]); i++; }
            return this.set(t);
        }
        
        ,binarize: function( ) {
            return this.quantize(2);
        }
        
        // adapted from http://www.jhlabs.com/ip/filters/
        ,solarize: function( threshold ) {
            if ( threshold === undef ) threshold=0.5;
            
            var i=0, t=new CT(256)
                ,q, c, n=2/255
            ;
            
            i=0; 
            while (i<256) 
            { 
                q = n*i; 
                c = (q>threshold) ? (255-255*q) : (255*q-255); 
                t[i] = ~~(clamp( c ));
                i++; 
            }
            return this.set(t);
        }
        
        ,solarize2: function( threshold ) {
            if ( threshold === undef ) threshold=0.5;
            threshold=1-threshold;
            var i=0, t=new CT(256)
                ,q, c, n=2/255
            ;
            
            i=0; 
            while (i<256) 
            { 
                q = n*i; 
                c = (q<threshold) ? (255-255*q) : (255*q-255); 
                t[i] = ~~(clamp( c ));
                i++; 
            }
            return this.set(t);
        }
        
        ,solarizeInverse: function( threshold ) {
            if ( threshold === undef ) threshold=0.5;
            threshold*=256; 
            
            var i=0, t=new CT(256);
            i=0; 
            while (i<256) 
            { 
                t[i] = (i>threshold) ? 255-i : i; 
                i++; 
            }
            return this.set(t);
        }
        
        ,invert: function( ) {
            return this.set(inverce);
        }
        
        // apply a binary mask to the image color channels
        ,mask: function( mask ) {
            var i=0, maskR=(mask>>16)&255, maskG=(mask>>8)&255, maskB=mask&255;
                tR=new CT(256), tG=new CT(256), tB=new CT(256)
                ;
            i=0; while (i<256) 
            { 
                tR[i]=clamp(i & maskR); 
                tG[i]=clamp(i & maskG); 
                tB[i]=clamp(i & maskB); 
                i++; 
            }
            return this.set(tR, tG, tB);
        }
        
        // replace a color with another
        ,replace: function( color, replacecolor ) {
            if (color==replacecolor) return this;
            var  
                c1R=(color>>16)&255, c1G=(color>>8)&255, c1B=(color)&255, 
                c2R=(replacecolor>>16)&255, c2G=(replacecolor>>8)&255, c2B=(replacecolor)&255, 
                tR=clone(trivial), tG=clone(trivial), tB=clone(trivial)
                ;
                tR[c1R]=c2R; tG[c1G]=c2G; tB[c1B]=c2B;
            return this.set(tR, tG, tB);
        }
        
        // extract a range of color values from a specific color channel and set the rest to background color
        ,extract: function( channel, range, background ) {
            if (!range || !range.length) return this;
            
            background=background||0;
            var  
                bR=(background>>16)&255, bG=(background>>8)&255, bB=(background)&255, 
                tR=ones(bR), tG=ones(bG), tB=ones(bB),
                s, f
                ;
            switch(channel)
            {
                case FILTER.CHANNEL.BLUE: 
                    s=range[0]; f=range[1];
                    while (s<=f) { tB[s]=clamp(s); s++; }
                    break;
                
                case FILTER.CHANNEL.GREEN: 
                    s=range[0]; f=range[1];
                    while (s<=f) { tG[s]=clamp(s); s++; }
                    break;
                
                case FILTER.CHANNEL.RED: 
                default:
                    s=range[0]; f=range[1];
                    while (s<=f) { tR[s]=clamp(s); s++; }
                    break;
                
            }
            return this.set(tR, tG, tB);
        }
        
        // adapted from http://www.jhlabs.com/ip/filters/
        ,gammaCorrection: function( gammaR, gammaG, gammaB ) {
            gammaR=gammaR || 1;
            gammaG=gammaG || gammaR;
            gammaB=gammaB || gammaG;
            
            // gamma correction uses inverse gamma
            gammaR=1.0/gammaR; gammaG=1.0/gammaG; gammaB=1.0/gammaB;
            
            var tR=new CT(256), tG=new CT(256), tB=new CT(256), i=0;
            while (i<256) 
            { 
                tR[i]=clamp(~~(255*Power(nF*i, gammaR))); 
                tG[i]=clamp(~~(255*Power(nF*i, gammaG))); 
                tB[i]=clamp(~~(255*Power(nF*i, gammaB)));  
                i++; 
            }
            return this.set(tR, tG, tB);
        }
        
        // adapted from http://www.jhlabs.com/ip/filters/
        ,exposure: function( exposure ) {
            if ( exposure === undef ) exposure=1;
            var i=0, t=new CT(256);
            i=0; while (i<256) 
            { 
                t[i]=clamp(~~(255 * (1 - Exponential(-exposure * i *nF)))); 
                i++; 
            }
            return this.set(t);
        }
        
        ,set: function( _tR, _tG, _tB, _tA ) {
            if (!_tR) return this;
            
            _tG=_tG || _tR; _tB=_tB || _tG;
            var 
                tR=this._tableR || eye(), tG, tB, tA,
                tR2=clone(tR), tG2, tB2, tA2,
                i;
            
            if (_tG && _tB)
            {
                tG=this._tableG || clone(tR); tB=this._tableB || clone(tG);
                tG2=clone(tG); tB2=clone(tB);
                // concat/compose the filter's tables, same as composing the filters
                i=0; 
                while (i<256) 
                { 
                    tR[i]=clamp( _tR[clamp( tR2[i] )] ); 
                    tG[i]=clamp( _tG[clamp( tG2[i] )] ); 
                    tB[i]=clamp( _tB[clamp( tB2[i] )] ); 
                    i++; 
                }
                this._tableR=tR; this._tableG=tG; this._tableB=tB;
            }
            else
            {
                // concat/compose the filter's tables, same as composing the filters
                i=0; 
                while (i<256) 
                { 
                    tR[i]=clamp( _tR[clamp( tR2[i] )] ); 
                    i++; 
                }
                this._tableR=tR; this._tableG=this._tableR; this._tableB=this._tableR;
            }
            
            return this;
        }
        
        ,reset: function( ) {
            this._tableR = this._tableG = this._tableB = this._tableA = null; 
            return this;
        }
        
        ,combineWith: function( filt ) {
            return this.set(filt.getTable(0), filt.getTable(1), filt.getTable(2));
        }
        
        ,getTable: function ( channel ) {
            channel = channel || FILTER.CHANNEL.RED;
            switch (channel)
            {
                case FILTER.CHANNEL.ALPHA: return this._tableA;
                case FILTER.CHANNEL.BLUE: return this._tableB;
                case FILTER.CHANNEL.GREEN: return this._tableG;
                case FILTER.CHANNEL.RED: 
                default: return this._tableR;
            }
        }
        
        ,setTable: function ( table, channel ) {
            channel = channel || FILTER.CHANNEL.RED;
            switch (channel)
            {
                case FILTER.CHANNEL.ALPHA: this._tableA=table; return this;
                case FILTER.CHANNEL.BLUE: this._tableB=table; return this;
                case FILTER.CHANNEL.GREEN: this._tableG=table; return this;
                case FILTER.CHANNEL.RED: 
                default: this._tableR=table; return this;
            }
        }
        
        // used for internal purposes
        ,_apply: function(im, w, h/*, image*/) {
            
            if ( !this._isOn || !this._tableR ) return im;
            
            var l=im.length, rem = (l>>2)%4,
                i, r, g, b, a,
                tR=this._tableR, tG=this._tableG, tB=this._tableB, tA=this._tableA;
            
            // apply filter (algorithm implemented directly based on filter definition)
            if ( tA )
            {
                // array linearization
                // partial loop unrolling (quarter iterations)
                for ( i=0; i<l; i+=16 )
                {
                    r = im[i]; g = im[i+1]; b = im[i+2]; a = im[i+3];
                    im[i] = tR[r]; im[i+1] = tG[g]; im[i+2] = tB[b]; im[i+3] = tA[a];
                    r = im[i+4]; g = im[i+5]; b = im[i+6]; a = im[i+7];
                    im[i+4] = tR[r]; im[i+5] = tG[g]; im[i+6] = tB[b]; im[i+7] = tA[a];
                    r = im[i+8]; g = im[i+9]; b = im[i+10]; a = im[i+11];
                    im[i+8] = tR[r]; im[i+9] = tG[g]; im[i+10] = tB[b]; im[i+11] = tA[a];
                    r = im[i+12]; g = im[i+13]; b = im[i+14]; a = im[i+15];
                    im[i+12] = tR[r]; im[i+13] = tG[g]; im[i+14] = tB[b]; im[i+15] = tA[a];
                }
                
                // loop unrolling remainder
                if ( rem )
                {
                    rem <<= 2;
                    for (i=l-rem; i<l; i+=4)
                    {
                        r = im[i]; g = im[i+1]; b = im[i+2]; a = im[i+3];
                        im[i] = tR[r]; im[i+1] = tG[g]; im[i+2] = tB[b]; im[i+3] = tA[a];
                    }
                }
            }
            else
            {
                // array linearization
                // partial loop unrolling (quarter iterations)
                for (i=0; i<l; i+=16)
                {
                    r = im[i]; g = im[i+1]; b = im[i+2];
                    im[i] = tR[r]; im[i+1] = tG[g]; im[i+2] = tB[b];
                    r = im[i+4]; g = im[i+5]; b = im[i+6];
                    im[i+4] = tR[r]; im[i+5] = tG[g]; im[i+6] = tB[b];
                    r = im[i+8]; g = im[i+9]; b = im[i+10];
                    im[i+8] = tR[r]; im[i+9] = tG[g]; im[i+10] = tB[b];
                    r = im[i+12]; g = im[i+13]; b = im[i+14];
                    im[i+12] = tR[r]; im[i+13] = tG[g]; im[i+14] = tB[b];
                }
                
                // loop unrolling remainder
                if ( rem )
                {
                    rem <<= 2;
                    for (i=l-rem; i<l; i+=4)
                    {
                        r = im[i]; g = im[i+1]; b = im[i+2];
                        im[i] = tR[r]; im[i+1] = tG[g]; im[i+2] = tB[b];
                    }
                }
            }
            return im;
        }
        
        ,apply: function( image, cb ) {
            if ( this._isOn && this._tableR )
            {
                var im = image.getSelectedData( );
                if ( this._worker )
                {
                    this
                        .bind( 'apply', function( data ) { 
                            this.unbind( 'apply' );
                            if ( data && data.im )
                                image.setSelectedData( data.im );
                            if ( cb ) cb.call( this );
                        })
                        // send filter params to worker
                        //.send( 'params', this.serialize( ) )
                        // process request
                        .send( 'apply', {im: im, params: this.serialize( )} )
                    ;
                }
                else
                {
                    image.setSelectedData( this._apply( im[ 0 ], im[ 1 ], im[ 2 ], image ) );
                    if ( cb ) cb.call( this );
                }
            }
            return image;
        },
    });
    // aliases
    TableLookupFilter.prototype.posterize = TableLookupFilter.prototype.levels = TableLookupFilter.prototype.quantize;
    
}(FILTER);/**
*
* Displacement Map Filter
*
* Displaces/Distorts the target image according to displace map
*
* @param displaceMap Optional (an Image used as a  dimaplcement map)
* @package FILTER.js
*
**/
!function(FILTER, undef){
    
    "use strict";
    
    var IMG = FILTER.ImArray, IMGcopy = FILTER.ImArrayCopy, 
        A16I = FILTER.Array16I,
        Min = Math.min, Max = Math.max, Floor = Math.floor
    ;
    
    //
    //
    // DisplacementMapFilter
    var DisplacementMapFilter = FILTER.DisplacementMapFilter = FILTER.Class( FILTER.Filter, {
        name: "DisplacementMapFilter"
        
        ,constructor: function( displacemap ) {
            if ( displacemap ) this.setMap( displacemap );
        }
        
        ,map: null
        ,_map: null
        // parameters
        ,scaleX: 1
        ,scaleY: 1
        ,startX: 0
        ,startY: 0
        ,componentX: 0
        ,componentY: 0
        ,color: 0
        ,red: 0
        ,green: 0
        ,blue: 0
        ,alpha: 0
        ,mode: FILTER.MODE.CLAMP
        
        ,dispose: function( ) {
            var self = this;
            
            self.disposeWorker( );
            
            self.map = null;
            self._map = null;
            self.scaleX = null;
            self.scaleY = null;
            self.startX = null;
            self.startY = null;
            self.componentX = null;
            self.componentY = null;
            self.color = null;
            self.red = null;
            self.green = null;
            self.blue = null;
            self.alpha = null;
            self.mode = null;
            
            return self;
        }
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                
                ,params: {
                    _map: self.map ? { data: self.map.getData( ), width: self.map.width, height: self.map.height } : null
                    ,scaleX: self.scaleX
                    ,scaleY: self.scaleY
                    ,startX: self.startX
                    ,startY: self.startY
                    ,componentX: self.componentX
                    ,componentY: self.componentY
                    ,color: self.color
                    ,red: self.red
                    ,green: self.green
                    ,blue: self.blue
                    ,alpha: self.alpha
                    ,mode: self.mode
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                params = json.params;
                
                self.map = null;
                self._map = params._map;
                self.scaleX = params.scaleX;
                self.scaleY = params.scaleY;
                self.startX = params.startX;
                self.startY = params.startY;
                self.componentX = params.componentX;
                self.componentY = params.componentY;
                self.color = params.color;
                self.red = params.red;
                self.green = params.green;
                self.blue = params.blue;
                self.alpha = params.alpha;
                self.mode = params.mode;
            }
            return self;
        }
        
        ,reset: function( ) {
            this.map = null; 
            this._map = null; 
            return this;
        }
        
        ,getMap: function( ) {
            return this.map;
        }
        
        ,setMap: function( m)  {
            this._map = null; 
            this.map = m; 
            return this;
        }
        
        ,setColor: function( c ) {
            this.color = c;
            this.alpha = (c >> 24) & 255; 
            this.red = (c >> 16) & 255; 
            this.green = (c >> 8) & 255; 
            this.blue = c & 255;
            return this;
        }
        
        // used for internal purposes
        ,_apply: function( im, w, h/*, image*/ ) {
            
            if ( !this._isOn || (!this.map && !this._map) ) return im;
            
            var map, mapW, mapH, mapArea, displace, ww, hh,
                sx = this.scaleX*0.00390625, sy = this.scaleY*0.00390625, 
                comx = this.componentX, comy = this.componentY, 
                alpha = this.alpha, red = this.red, 
                green = this.green, blue = this.blue, mode = this.mode,
                sty, stx, styw, bx0, by0, bx, by,
                i, j, k, x, y, ty, ty2, yy, xx, mapOff, dstOff, srcOff,
                applyArea, imArea, imLen, imcopy, srcx, srcy,
                _Ignore = FILTER.MODE.IGNORE, _Clamp = FILTER.MODE.CLAMP, _Color = FILTER.MODE.COLOR, _Wrap = FILTER.MODE.WRAP
            ;
            
            map = this._map ? this._map.data : this.map.getData( );
            mapW = this._map ? this._map.width : this.map.width; mapH = this._map ? this._map.height : this.map.height; 
            mapArea = (map.length>>2); ww = Min(mapW, w); hh = Min(mapH, h);
            imLen = im.length; applyArea = (ww*hh)<<2; imArea = (imLen>>2);
            
            // make start relative
            stx = Floor(this.startX*(w-1));
            sty = Floor(this.startY*(h-1));
            styw = sty*w;
            bx0 = -stx; by0 = -sty; bx = w-stx-1; by = h-sty-1;
            
            displace = new A16I(mapArea<<1);
            imcopy = new IMGcopy(im);
            
            // pre-compute indices, 
            // reduce redundant computations inside the main application loop (faster)
            // this is faster if mapArea <= imArea, else a reverse algorithm may be needed (todo)
            j=0; x=0; y=0; ty=0;
            for (i=0; i<mapArea; i++, j+=2, x++)
            { 
                if (x>=mapW) { x=0; y++; ty+=mapW; }
                mapOff = (x + ty)<<2;
                displace[j] = Floor( ( map[mapOff+comx] - 128 ) * sx ); 
                displace[j+1] = Floor( ( map[mapOff+comy] - 128 ) * sy );
            } 
            
            // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
            x=0; y=0; ty=0; ty2=0;
            for (i=0; i<applyArea; i+=4, x++)
            {
                // update image coordinates
                if (x>=ww) { x=0; y++; ty+=w; ty2+=mapW; }
                
                // if inside the application area
                if (y<by0 || y>by || x<bx0 || x>bx) continue;
                
                xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;  
                
                j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];
                
                if (srcy>=h || srcy<0 || srcx>=w || srcx<0)
                {
                    if (mode == _Ignore) 
                    {
                        continue;
                    }
                    
                    else if (mode == _Color)
                    {
                        im[dstOff] = red;  im[dstOff+1] = green;
                        im[dstOff+2] = blue;  im[dstOff+3] = alpha;
                        continue;
                    }
                        
                    else if (mode == _Wrap)
                    {
                        if (srcy>by) srcy-=h;
                        else if (srcy<0) srcy+=h;
                        if (srcx>bx) srcx-=w;
                        else if (srcx<0)  srcx+=w;
                    }
                        
                    else
                    {
                        if (srcy>by)  srcy=by;
                        else if (srcy<0) srcy=0;
                        if (srcx>bx) srcx=bx;
                        else if (srcx<0) srcx=0;
                    }
                }
                srcOff = (srcx + srcy*w)<<2;
                // new pixel values
                im[dstOff] = imcopy[srcOff];   im[dstOff+1] = imcopy[srcOff+1];
                im[dstOff+2] = imcopy[srcOff+2];  im[dstOff+3] = imcopy[srcOff+3];
            }
            return im;
        }
        
        ,apply: function( image, cb ) {
            if ( this._isOn && (this._map || this.map) )
            {
                var im = image.getSelectedData( );
                if ( this._worker )
                {
                    this
                        .bind( 'apply', function( data ) { 
                            this.unbind( 'apply' );
                            if ( data && data.im )
                                image.setSelectedData( data.im );
                            if ( cb ) cb.call( this );
                        })
                        // send filter params to worker
                        //.send( 'params', this.serialize( ) )
                        // process request
                        .send( 'apply', {im: im, params: this.serialize( )} )
                    ;
                }
                else
                {
                    image.setSelectedData( this._apply( im[ 0 ], im[ 1 ], im[ 2 ], image ) );
                    if ( cb ) cb.call( this );
                }
            }
            return image;
        }
    });
    
}(FILTER);/**
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
    
    "use strict";
    
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
            if ( inverseTransform )
                this.generic( inverseTransform );
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
            
            self.disposeWorker( );
            
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
                
                ,params: {
                    _mapName: self._mapName
                    
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
                
                self._mapName = params._mapName;
                self._map = null;
                if ( self._mapName && Maps[ self._mapName ] )
                    self._map = Maps[ self._mapName ].bind( self );
            }
            return self;
        }
        
        ,generic: function( inverseTransform ) {
            if ( inverseTransform )
            {
                this.inverseTransform = inverseTransform;
                this._mapName = "generic"; 
                this._map = Maps.generic.bind( this ); 
            }
            return this;
        }
        
        ,affine: function( matrix ) {
            if ( matrix )
            {
                this.matrix = matrix; 
                this._mapName = "affine";  
                this._map = Maps.affine.bind( this ); 
            }
            return this;
        }
        
        ,flipX: function( ) {
            this._mapName = "flipX";  
            this._map = Maps.flipX.bind( this ); 
            return this;
        }
        
        ,flipY: function( ) {
            this._mapName = "flipY";  
            this._map = Maps.flipY.bind( this ); 
            return this;
        }
        
        ,flipXY: function( ) {
            this._mapName = "flipXY";  
            this._map = Maps.flipXY.bind( this ); 
            return this;
        }
        
        ,rotateCW: function( ) {
            this._mapName = "rotateCW";  
            this._map = Maps.rotateCW.bind( this ); 
            return this;
        }
        
        ,rotateCCW: function( ) {
            this._mapName = "rotateCCW";  
            this._map = Maps.rotateCCW.bind( this ); 
            return this;
        }
        
        ,polar: function( centerX, centerY ) {
            this.centerX = centerX||0; this.centerY = centerY||0;
            this._mapName = "polar";  
            this._map = Maps.polar.bind( this ); 
            return this;
        }
        
        ,cartesian: function( centerX, centerY ) {
            this.centerX = centerX||0; this.centerY = centerY||0;
            this._mapName = "cartesian";  
            this._map = Maps.cartesian.bind( this ); 
            return this;
        }
        
        ,twirl: function( angle, radius, centerX, centerY ) {
            this.angle = angle||0; this.radius = radius||0;
            this.centerX = centerX||0; this.centerY = centerY||0;
            this._mapName = "twirl";  
            this._map = Maps.twirl.bind( this ); 
            return this;
        }
        
        ,sphere: function( radius, centerX, centerY ) {
            this.radius = radius||0; this.centerX = centerX||0; this.centerY = centerY||0;
            this._mapName = "sphere";  
            this._map = Maps.sphere.bind( this ); 
            return this;
        }
        
        ,ripple: function( radius, wavelength, amplitude, phase, centerX, centerY ) {
            this.radius = (radius!==undef) ? radius : 50; 
            this.centerX = centerX||0; 
            this.centerY = centerY||0;
            this.wavelength = (wavelength!==undef) ? wavelength : 16; 
            this.amplitude = (amplitude!==undef) ? amplitude : 10; 
            this.phase = phase||0;
            this._mapName = "ripple";  
            this._map = Maps.ripple.bind( this ); 
            return this;
        }
        
        ,reset: function( ) {
            this._mapName = null; 
            this._map = null; 
            return this;
        }
        
        ,getMap: function( ) {
            return this._map;
        }
        
        ,setMap: function( map ) {
            this._mapName = null; 
            this._map = map; 
            return this;
        }
        
        // used for internal purposes
        ,_apply: function( im, w, h, image ) {
            if ( !this._isOn || !this._map ) return im;
            return this._map( im, w, h, image );
        }
        
        ,apply: function( image, cb ) {
            if ( this._isOn && this._map )
            {
                var im = image.getSelectedData( );
                if ( this._worker )
                {
                    this
                        .bind( 'apply', function( data ) { 
                            this.unbind( 'apply' );
                            if ( data && data.im )
                                image.setSelectedData( data.im );
                            if ( cb ) cb.call( this );
                        })
                        // send filter params to worker
                        //.send( 'params', this.serialize( ) )
                        // process request
                        .send( 'apply', {im: im, params: this.serialize( )} )
                    ;
                }
                else
                {
                    image.setSelectedData( this._map( im[ 0 ], im[ 1 ], im[ 2 ], image ) );
                    if ( cb ) cb.call( this );
                }
            }
            return image;
        }
    });
    
    
    //
    //
    // private geometric maps
    
    /*function trivialMap(im, w, h) { return im; },*/
    Maps = {
        "generic": function( im, w, h )  {
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
    
        ,"affine": function( im, w, h ) {
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
    
        ,"flipX": function( im, w, h ) {
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
        
        ,"flipY": function flipYMap( im, w, h ) {
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
        
        ,"flipXY": function( im, w, h )  {
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
        
        ,"rotateCW": function( im, w, h )  {
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
        
        ,"rotateCCW": function( im, w, h ) {
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
        ,"twirl": function( im, w, h )  {
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
        ,"sphere": function( im, w, h )  {
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
        ,"ripple": function( im, w, h ) {
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
        
        // adapted from http://www.jhlabs.com/ip/filters/
        /*
        ,"circle": function( im, w, h ) {
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
        ,"polar": function( im, w, h ) {
            var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
                _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
                tx, ty, ix, iy, ip,
                bx = w-1, by = h-1, 
                theta, r=0, radius, cX, cY, 
                mode = this.mode
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
        ,"cartesian": function( im, w, h ) {
            var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
                _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
                ix, iy, ip, nx, ny,
                bx = w-1, by = h-1, 
                theta, theta2, r=0, radius, cX, cY, 
                mode = this.mode
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
    
}(FILTER);/**
*
* Convolution Matrix Filter(s)
*
* Convolves the target image with a matrix filter
*
* @param weights Optional (a convolution matrix as an array of values)
* @param factor Optional (filter normalizer factor)
* @package FILTER.js
*
**/
!function(FILTER, undef){
    
    "use strict";
    
    var 
        sqrt2=FILTER.CONSTANTS.SQRT2, toRad=FILTER.CONSTANTS.toRad, toDeg=FILTER.CONSTANTS.toDeg,
        Abs=Math.abs, Sqrt=Math.sqrt, Sin=Math.sin, Cos=Math.cos,
        
        // Convolution Matrix
        CM=FILTER.Array32F, 
        IMG = FILTER.ImArray, //IMGcopy = FILTER.ImArrayCopy,
        A32F=FILTER.Array32F, A16I=FILTER.Array16I, A8U=FILTER.Array8U,
        notSupportClamp=FILTER._notSupportClamp,
        
        // hardcode Pascal numbers, used for binomial kernels
        _pascal=[
            [1],
            [1, 1],
            [1, 2,  1],
            [1, 3,  3,  1],
            [1, 4,  6,  4,  1],
            [1, 5,  10, 10, 5,  1],
            [1, 6,  15, 20, 15, 6,  1],
            [1, 7,  21, 35, 35, 21, 7,  1],
            [1, 8,  28, 56, 70, 56, 28, 8,  1]
        ]
    ;
    
    //
    //
    //  Convolution Matrix Filter
    var ConvolutionMatrixFilter = FILTER.ConvolutionMatrixFilter = FILTER.Class( FILTER.Filter, {
        name: "ConvolutionMatrixFilter"
        
        ,constructor: function( weights, factor, bias ) {
            this._coeff = new CM([1.0, 0.0]);
            
            if ( weights && weights.length)
            {
                this.set(weights, ~~(Sqrt(weights.length)+0.5), factor||1.0, bias||0.0);
            }
            else 
            {
                this._matrix = null; this._dim = 0;
            }
            this._matrix2 = null;  this._dim2 = 0;
            this._isGrad = false; this._doIntegral = 0; this._doSeparable = false;
            
            if ( FILTER.useWebGL )  
                this._webglInstance = FILTER.WebGLConvolutionMatrixFilterInstance || null;
        }
        
        ,_dim: 0
        ,_dim2: 0
        ,_matrix: null
        ,_matrix2: null
        ,_mat: null
        ,_mat2: null
        ,_coeff: null
        ,_isGrad: false
        ,_doIntegral: 0
        ,_doSeparable: false
        ,_indices: null
        ,_indices2: null
        ,_indicesf: null
        ,_indicesf2: null
        ,_webglInstance: null
        
        ,dispose: function( ) {
            var self = this;
            
            self.disposeWorker( );
            
            self._webglInstance = null;
            self._dim = null;
            self._dim2 = null;
            self._matrix = null;
            self._matrix2 = null;
            self._mat = null;
            self._mat2 = null;
            self._coeff = null;
            self._isGrad = null;
            self._doIntegral = null;
            self._doSeparable = null;
            self._indices = null;
            self._indices2 = null;
            self._indicesf = null;
            self._indicesf2 = null;
            
            return self;
        }
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                
                ,params: {
                    _dim: self._dim
                    ,_dim2: self._dim2
                    ,_matrix: self._matrix
                    ,_matrix2: self._matrix2
                    ,_mat: self._mat
                    ,_mat2: self._mat2
                    ,_coeff: self._coeff
                    ,_isGrad: self._isGrad
                    ,_doIntegral: self._doIntegral
                    ,_doSeparable: self._doSeparable
                    ,_indices: self._indices
                    ,_indices2: self._indices2
                    ,_indicesf: self._indicesf
                    ,_indicesf2: self._indicesf2
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                params = json.params;
                
                self._dim = params._dim;
                self._dim2 = params._dim2;
                self._matrix = params._matrix;
                self._matrix2 = params._matrix2;
                self._mat = params._mat;
                self._mat2 = params._mat2;
                self._coeff = params._coeff;
                self._isGrad = params._isGrad;
                self._doIntegral = params._doIntegral;
                self._doSeparable = params._doSeparable;
                self._indices = params._indices;
                self._indices2 = params._indices2;
                self._indicesf = params._indicesf;
                self._indicesf2 = params._indicesf2;
            }
            return self;
        }
        
        // generic low-pass filter
        ,lowPass: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            this.set(ones(d), d, 1/(d*d), 0.0);
            this._doIntegral = 1; return this;
        }

        // generic high-pass filter (I-LP)
        ,highPass: function( d, f ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            f = ( f === undef ) ? 1 : f;
            // HighPass Filter = I - (respective)LowPass Filter
            var size=d*d, fact=-f/size, w=ones(d, fact, 1+fact);
            this.set(w, d, 1.0, 0.0);
            this._doIntegral = 1; return this;
        }

        ,glow: function( f, d ) { 
            f = ( f === undef ) ? 0.5 : f;  
            return this.highPass(d, -f); 
        }
        
        ,sharpen: function( f, d ) { 
            f = ( f === undef ) ? 0.5 : f;  
            return this.highPass(d, f); 
        }
        
        ,verticalBlur: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            this.set(average1DKernel(d), 1, 1/d, 0.0); 
            this._dim2 = d; this._doIntegral = 1; return this;
        }
        
        ,horizontalBlur: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            this.set(average1DKernel(d), d, 1/d, 0.0); 
            this._dim2 = 1; this._doIntegral = 1; return this;
        }
        
        // supports only vertical, horizontal, diagonal
        ,directionalBlur: function( theta, d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            theta *= toRad;
            var c = Cos(theta), s = -Sin(theta), filt = twos2(d, c, s, 1/d);
            return this.set(filt, d, 1.0, 0.0);
        }
        
        // fast gauss filter
        ,fastGauss: function( quality, d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            quality = ~~(quality||1);
            if ( quality < 1 ) quality = 1;
            else if ( quality > 3 ) quality = 3;
            this.set(ones(d), d, 1/(d*d), 0.0);
            this._doIntegral = quality; return this;
        }
        
        // generic binomial(quasi-gaussian) low-pass filter
        ,binomialLowPass: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            /*var filt=gaussKernel(d);
            return this.set(filt.kernel, d, 1/filt.sum); */
            var kernel = binomial1DKernel(d), sum=1<<(d-1), fact=1/sum;
            this.set(kernel, d, fact, fact);
            this._matrix2 = new CM(kernel);
            var tmp = this._computeIndices(this._matrix2, this._dim2);
            this._indices2 = tmp[0]; this._indicesf2 = tmp[1]; this._mat2 = tmp[2];
            this._doSeparable = true; return this;
        }

        // generic binomial(quasi-gaussian) high-pass filter
        ,binomialHighPass: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt = gaussKernel(d);
            // HighPass Filter = I - (respective)LowPass Filter
            return this.set(blendMatrix(ones(d), new CM(filt.kernel), 1, -1/filt.sum), d, 1.0, 0.0); 
        }
        
        // X-gradient, partial X-derivative (Prewitt)
        ,prewittX: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt = prewittKernel(d, 0);
            // this can be separable
            return this.set(filt.kernel, d, 1.0, 0.0);
        }
        
        // Y-gradient, partial Y-derivative (Prewitt)
        ,prewittY: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt = prewittKernel(d, 1);
            // this can be separable
            return this.set(filt.kernel, d, 1.0, 0.0);
        }
        
        // directional gradient (Prewitt)
        ,prewittDirectional: function( theta, d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            theta*=toRad;
            var c = Cos(theta), s = Sin(theta), gradx = prewittKernel(d, 0), grady = prewittKernel(d, 1);
            return this.set(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), d, 1.0, 0.0);
        }
        
        // gradient magnitude (Prewitt)
        ,prewitt: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var gradx = prewittKernel(d, 0), grady = prewittKernel(d, 1);
            this.set(gradx.kernel, d, 1.0, 0.0);
            this._isGrad = true;
            this._matrix2 = new CM(grady.kernel);
            var tmp = this._computeIndices(this._matrix2, this._dim2);
            this._indices2 = tmp[0]; this._indicesf2 = tmp[1]; this._mat2 = tmp[2];
            return this;
        }
        
        // partial X-derivative (Sobel)
        ,sobelX: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt = sobelKernel(d, 0);
            // this can be separable
            return this.set(filt.kernel, d, 1.0, 0.0);
        }
        
        // partial Y-derivative (Sobel)
        ,sobelY: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var filt = sobelKernel(d, 1);
            // this can be separable
            return this.set(filt.kernel, d, 1.0, 0.0);
        }
        
        // directional gradient (Sobel)
        ,sobelDirectional: function( theta, d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            theta*=toRad;
            var c = Cos(theta), s = Sin(theta), gradx = sobelKernel(d, 0), grady = sobelKernel(d, 1);
            return this.set(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), d, 1.0, 0.0);
        }
        
        // gradient magnitude (Sobel)
        ,sobel: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var gradx = sobelKernel(d, 0), grady = sobelKernel(d, 1);
            this.set(gradx.kernel, d, 1.0, 0.0);
            this._matrix2 = new CM(grady.kernel);
            var tmp = this._computeIndices(this._matrix2, this._dim2);
            this._indices2 = tmp[0]; this._indicesf2 = tmp[1]; this._mat2 = tmp[2];
            this._isGrad = true;
            return this;
        }
        
        ,laplace: function( d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            var size = d*d, laplacian = ones(d, -1, size-1);
            this.set(laplacian, d, 1.0, 0.0);
            this._doIntegral = 1; return this;
        }
        
        ,emboss: function( angle, amount, d ) {
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            angle = ( angle === undef ) ? (-0.25*Math.PI) : (angle*toRad);
            amount = amount||1;
            var dx = amount*Cos(angle), dy = -amount*Sin(angle), filt = twos(d, dx, dy, 1);
            return this.set(filt, d, 1.0, 0.0);
        }
        
        ,edges: function( m ) {
            m = m||1;
            return this.set([
                    0,   m,   0,
                    m,  -4*m, m,
                    0,   m,   0
                 ], 3, 1.0, 0.0);
        }
        
        ,set: function( m, d, f, b ) {
            this._matrix2 = null; this._dim2 = 0; this._indices2 = this._indicesf2 = null; this._mat2 = null;
            this._isGrad = false; this._doIntegral = 0; this._doSeparable = false;
            this._matrix = new CM(m); this._dim = d; this._coeff[0] = f||1; this._coeff[1] = b||0;
            var tmp  = this._computeIndices(this._matrix, this._dim);
            this._indices = tmp[0]; this._indicesf = tmp[1]; this._mat = tmp[2];
            return this;
        }
        
        ,_computeIndices: function( m, d ) {
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            var indices = [], indices2 = [], mat = [], k, x, y,  matArea = m.length, matRadius = d, matHalfSide = (matRadius>>1);
            x=0; y=0; k=0;
            while (k<matArea)
            { 
                indices2.push(x-matHalfSide); 
                indices2.push(y-matHalfSide);
                if (m[k])
                {
                    indices.push(x-matHalfSide); 
                    indices.push(y-matHalfSide);
                    mat.push(m[k]);
                }
                k++; x++; if (x>=matRadius) { x=0; y++; }
            }
            return [new A16I(indices), new A16I(indices2), new CM(mat)];
        }
        
        ,reset: function( ) {
            this._matrix = this._matrix2 = null; 
            this._mat = this._mat2 = null; 
            this._dim = this._dim2 = 0;
            this._indices = this._indices2 = this._indicesf = this._indicesf2 = null;
            this._isGrad = false; this._doIntegral = 0; this._doSeparable = false;
            return this;
        }
        
        ,combineWith: function( filt ) {
            // matrices/kernels need to be convolved -> larger kernel->tensor in order to be actually combined
            // todo??
            return this;
        }
        
        ,getMatrix: function( ) {
            return this._matrix;
        }
        
        ,setMatrix: function( m, d ) {
            return this.set(m, d);
        }
        
        // used for internal purposes
        ,_apply: function(im, w, h/*, image*/) {
            
            if ( !this._isOn || !this._matrix ) return im;
            
            // do a faster convolution routine if possible
            if ( this._doIntegral ) 
            {
                if (this._matrix2)
                    return integralConvolution(im, w, h, this._matrix, this._matrix2, this._dim, this._dim2, this._coeff[0], this._coeff[1], this._doIntegral);
                else
                    return integralConvolution(im, w, h, this._matrix, null, this._dim, this._dim, this._coeff[0], this._coeff[1], this._doIntegral);
            }
            else if ( this._doSeparable )
            {
                return separableConvolution(im, w, h, this._mat, this._mat2, this._indices, this._indices2, this._coeff[0], this._coeff[1]);
            }
            // handle some common cases fast
            /*else if (3==this._dim)
            {
                return convolution3(im, w, h, this._matrix, this._matrix2, this._dim, this._dim, this._coeff[0], this._coeff[1], this._isGrad);
            }*/
            
            var imLen = im.length, imArea = (imLen>>2), 
                dst = new IMG(imLen), 
                t0, t1, t2,
                i, j, k, x, ty, ty2, 
                xOff, yOff, srcOff, 
                r, g, b, r2, g2, b2,
                bx = w-1, by = imArea-w,
                coeff1 = this._coeff[0], coeff2 = this._coeff[1],
                mat = this._matrix, mat2 = this._matrix2, wt, wt2, _isGrad = this._isGrad,                
                mArea, matArea, imageIndices
                ;
            
            // apply filter (algorithm direct implementation based on filter definition with some optimizations)
            if (mat2) // allow to compute a second matrix in-parallel in same pass
            {
                // pre-compute indices, 
                // reduce redundant computations inside the main convolution loop (faster)
                mArea = this._indicesf.length; 
                imageIndices = new A16I(this._indicesf);
                for (k=0; k<mArea; k+=2)
                { 
                    imageIndices[k+1] *= w;
                } 
                matArea = mat.length;
                
                // do direct convolution
                x=0; ty=0;
                for (i=0; i<imLen; i+=4, x++)
                {
                    // update image coordinates
                    if (x>=w) { x=0; ty+=w; }
                    
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=0; g=0; b=0; r2=0; g2=0; b2=0; 
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                        {
                            srcOff = (xOff + yOff)<<2; 
                            wt = mat[k]; r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                            // allow to apply a second similar matrix in-parallel (eg for total gradients)
                            wt2 = mat2[k]; r2 += im[srcOff] * wt2; g2 += im[srcOff+1] * wt2;  b2 += im[srcOff+2] * wt2;
                        }
                    }
                    
                    // output
                    if (_isGrad)
                    {
                        t0 = Abs(r)+Abs(r2);  t1 = Abs(g)+Abs(g2);  t2 = Abs(b)+Abs(b2);
                    }
                    else
                    {
                        t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                    }
                    if (notSupportClamp)
                    {   
                        // clamp them manually
                        t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                        t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                        t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                    }
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
            else
            {
                // pre-compute indices, 
                // reduce redundant computations inside the main convolution loop (faster)
                mArea = this._indices.length; 
                imageIndices = new A16I(this._indices);
                for (k=0; k<mArea; k+=2)
                { 
                    imageIndices[k+1] *= w;
                }
                mat = this._mat;
                matArea = mat.length;
                
                // do direct convolution
                x=0; ty=0;
                for (i=0; i<imLen; i+=4, x++)
                {
                    // update image coordinates
                    if (x>=w) { x=0; ty+=w; }
                    
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=0; g=0; b=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                        {
                            srcOff = (xOff + yOff)<<2; wt = mat[k];
                            r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        }
                    }
                    
                    // output
                    t0 = coeff1*r+coeff2;  t1 = coeff1*g+coeff2;  t2 = coeff1*b+coeff2;
                    if (notSupportClamp)
                    {   
                        // clamp them manually
                        t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                        t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                        t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                    }
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
            return dst;
        }
        
        ,apply: function( image, cb ) {
            if ( this._isOn && this._matrix )
            {
                /*if (this._webglInstance)
                {
                    var w=image.width, h=image.height;
                    this._webglInstance.filterParams=[
                        new CM([w, h]),
                        1.0,
                        new CM([w, h]),
                        this._coeff, 
                        (this._matrix2) ? 1 : 0,
                        (this._isGrad) ? 1 : 0,
                        this._dim>>1,
                        this._dim2>>1,
                        this._matrix.length,
                        this._matrix,
                        (this._matrix2) ? this._matrix2 : new CM([0])
                    ];
                    this._webglInstance._apply(image.webgl, w, h);
                    return image;
                }*/
                if ( this._worker )
                {
                    this
                        .bind( 'apply', function( data ) { 
                            this.unbind( 'apply' );
                            if ( data && data.im )
                                image.setSelectedData( data.im );
                            if ( cb ) cb.call( this );
                        })
                        // send filter params to worker
                        //.send( 'params', this.serialize( ) )
                        // process request
                        .send( 'apply', {im: image.getSelectedData( ), params: this.serialize( )} )
                    ;
                }
                else
                {
                    var im = image.getSelectedData( );
                    image.setSelectedData( this._apply( im[ 0 ], im[ 1 ], im[ 2 ], image) );
                    if ( cb ) cb.call( this );
                }
            }
            return image;
        }
    });
    // aliases
    ConvolutionMatrixFilter.prototype.bump = ConvolutionMatrixFilter.prototype.emboss;
    ConvolutionMatrixFilter.prototype.boxBlur = ConvolutionMatrixFilter.prototype.lowPass;
    ConvolutionMatrixFilter.prototype.gaussBlur = ConvolutionMatrixFilter.prototype.binomialLowPass;
    ConvolutionMatrixFilter.prototype.gradX = ConvolutionMatrixFilter.prototype.prewittX;
    ConvolutionMatrixFilter.prototype.gradY = ConvolutionMatrixFilter.prototype.prewittY;
    ConvolutionMatrixFilter.prototype.gradDirectional = ConvolutionMatrixFilter.prototype.prewittDirectional;
    ConvolutionMatrixFilter.prototype.grad = ConvolutionMatrixFilter.prototype.prewitt;

    
    //
    //
    //  Private methods
    
    function addMatrix(m1, m2)
    {
        var l=m1.length, i, m=new CM(m1.length);
        i=0; while (i<l) { m[i]=m1[i] + m2[i]; i++; }
        return m;
    }
    
    function subtractMatrix(m1, m2)
    {
        var l=m1.length, i, m=new CM(m1.length);
        i=0; while (i<l) { m[i]=m1[i]-m2[i]; i++; }
        return m;
    }
    
    function multiplyScalar(m1, s)
    {
        if (1==s) return new CM(m1);
        var l=m1.length, i, m=new CM(m1.length);
        i=0; while (i<l) { m[i]=m1[i]*s; i++; }
        return m;
    }
    
    function blendMatrix(m1, m2, a, b)
    {
        var l=m1.length, i, m=new CM(m1.length);
        a=a||1; b=b||1;
        i=0; while (i<l) { m[i]=a*m1[i] + b*m2[i]; i++; }
        return m;
    }
    
    function convolveKernels(k1, k2)
    {
        var i, j, kl=k1.length, k, ker=[], sum=0;
        for (i=0; i<kl; i++) { for (j=0; j<kl; j++) { k=k1[i]*k2[j];  sum+=k;  ker.push(k); } }
        return {kernel:ker, sum:sum};
    }
    
    function identity1DKernel(d)
    {
        var i, center=(d>>1), ker=new Array(d);
        i=0; while (i<d) { ker[i]=0; i++; }
        ker[center]=1;  return ker;
    }

    function average1DKernel(d)
    {
        var i, ker=new Array(d);
        i=0; while (i<d) { ker[i]=1; i++; }
        return ker;
    }
    
    // pascal numbers (binomial coefficients) are used to get coefficients for filters that resemble gaussian distributions
    // eg Sobel, Canny, gradients etc..
    function binomial1DKernel(d) 
    {
        var l=_pascal.length, row, uprow, i, il;
        d--;
        if (d<l)
        {
            row=new CM(_pascal[d]);
        }
        else
        {
            // else compute them iteratively
            row=new CM(_pascal[l-1]);
            while (l<=d)
            {
                uprow=row; row=new CM(uprow.length+1); row[0]=1;
                for (i=0, il=uprow.length-1; i<il; i++) { row[i+1]=(uprow[i]+uprow[i+1]); } row[uprow.length]=1;
                if (l<40) _pascal.push(new Array(row)); // save it for future dynamically
                l++;
            }
        }
        return row;
    }
    
    function derivative1DKernel(d)
    {
        var i, half=d>>1, k=-half, ker=new Array(d);
        i=0; while (i<d) { ker[i] = k; k++; i++; }
        return ker;
    }
    
    function gaussKernel(d)
    {
        var binomial=binomial1DKernel(d);
        // convolve with itself
        return convolveKernels(binomial, binomial);
    }
    
    function verticalKernel(d)
    {
        var eye=identity1DKernel(d), average=average1DKernel(d);
        // convolve with itself
        return convolveKernels(average, eye);
    }
    
    function horizontalKernel(d)
    {
        var eye=identity1DKernel(d), average=average1DKernel(d);
        // convolve with itself
        return convolveKernels(eye, average);
    }
    
    function sobelKernel(d, dir)
    {
        var binomial=binomial1DKernel(d), derivative=derivative1DKernel(d);
        if (1==dir) // y
            return convolveKernels(derivative.reverse(), binomial);
        else  // x
            return convolveKernels(binomial, derivative);
    }
    
    function prewittKernel(d, dir)
    {
        var average=average1DKernel(d), derivative=derivative1DKernel(d);
        if (1==dir) // y
            return convolveKernels(derivative.reverse(), average);
        else // x
            return convolveKernels(average, derivative);
    }
    
    function ones(d, f, c) 
    { 
        f=f||1; c=c||f;
        var l=d*d, center=l>>1, i, o=new CM(l);
        i=0; while(i<l) { o[i]=f; i++; } o[center]=c;
        return o;
    }
    
    function twos(d, dx, dy, c)
    {
        var l=d*d, half=d>>1, center=l>>1, i, k, j, o=new CM(l), tx, ty;
        tx = 0;
        for (i=0; i<=half; i++)
        {
            k = 0; ty = 0;
            for (j=0; j<=half; j++)
            {
                //tx=i*dx;  ty=j*dy;
                o[center + i + k]=   tx + ty;
                o[center - i - k]= - tx - ty;
                o[center - i + k]= - tx + ty;
                o[center + i - k]=   tx - ty;
                k += d; ty += dy;
            }
            tx += dx;
        }
        o[center] = c||1;
        return o;
    }
    
    function twos2(d, c, s, cf)
    {
        var l=d*d, half=d>>1, center=l>>1, i, j, k, 
            o=new CM(l), T=new CM(l), 
            tx, ty, dx, dy, f=1/d, 
            delta=1e-8;
        
        if (Abs(c)>delta) { dx=1; dy=s/c; }
        else  { dx=c/s; dy=1; }
        
        i=0; tx=0; ty=0; k=dy*d;
        while (i<=half)
        {
            // compute the transformation of the (diagonal) line
            T[center + i]= ~~(center + tx + ty + 0.5);
            T[center - i]= ~~(center - tx - ty + 0.5);
            i++; tx+=dx; ty+=k;
        }
        i=0;
        while (i<=half)
        {
            // do the mapping of the base line to the transformed one
            o[T[center + i]]=o[T[center - i]]=f;
            // anti-aliasing ??..
            i++;
        }
        o[center] = cf||1;
        return o;
    }
    
    // speed-up convolution for special kernels like moving-average
    function integralConvolution(im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats) 
    {
        var imLen=im.length, imArea=(imLen>>2), integral, integralLen, colR, colG, colB,
            matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
            dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
            i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
            xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2,
            r, g, b, r2, g2, b2, repeat
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
        
        numRepeats = numRepeats||1;  repeat = 0;
        
        if (matrix2) // allow to compute a second matrix in-parallel
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>1]; centerOffset2 = wtCenter2-wt2;
            
            // do this multiple times??
            while (repeat<numRepeats)
            {
                dst = new IMG(imLen); integral = new A32F(integralLen);
                
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
                     xOff1 = (xOff1<bx1) ? bx1 : xOff1;
                     xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                     yOff1 = (yOff1<by1) ? by1 : yOff1;
                     yOff2 = (yOff2>by2) ? by2 : yOff2;
                    
                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                    // arguably faster way to write p1*=3; etc..
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                    
                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1])  +  (centerOffset * im[i]);
                    g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                    b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                    
                    r2 = wt2 * (integral[p4] - integral[p2] - integral[p3] + integral[p1])  +  (centerOffset2 * im[i]);
                    g2 = wt2 * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset2 * im[i+1]);
                    b2 = wt2 * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset2 * im[i+2]);
                    
                    // output
                    t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                    if (notSupportClamp)
                    {   
                        // clamp them manually
                        t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                        t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                        t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                    }
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                
                // do another pass??
                im = dst;  repeat++;
            }
        }
        else
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
        
            // do this multiple times??
            while (repeat<numRepeats)
            {
                dst = new IMG(imLen); integral = new A32F(integralLen);
                
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
                     xOff1 = (xOff1<bx1) ? bx1 : xOff1;
                     xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                     yOff1 = (yOff1<by1) ? by1 : yOff1;
                     yOff2 = (yOff2>by2) ? by2 : yOff2;
                    
                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                    // arguably faster way to write p1*=3; etc..
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                    
                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1])  +  (centerOffset * im[i]);
                    g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                    b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                    
                    // output
                    t0 = coeff1*r + coeff2;  t1 = coeff1*g + coeff2;  t2 = coeff1*b + coeff2;
                    if (notSupportClamp)
                    {   
                        // clamp them manually
                        t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                        t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                        t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                    }
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                
                // do another pass??
                im = dst;  repeat++;
            }
        }
        return dst;
    }
    
    // speed-up convolution for separable kernels
    function separableConvolution(im, w, h, matrix, matrix2, ind1, ind2, coeff1, coeff2) 
    {
        var imLen=im.length, imArea=(imLen>>2),
            matA, indA,
            matArea, mat, indices, matArea2,
            dst, imageIndices,
            i, j, k, x, ty, ty2,
            xOff, yOff, bx, by, t0, t1, t2, wt,
            r, g, b, coeffs, coeff,
            numPasses
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        matA = [matrix2, matrix];
        indA = [ind2, ind1];
        coeffs = [coeff2, coeff1];
        
        bx = w-1; by = imArea-w;
        
        // one horizontal and one vertical pass
        numPasses = 2;
        while (numPasses--)
        {
            dst = new IMG(imLen);
            
            mat = matA[numPasses];
            indices = indA[numPasses];
            matArea = mat.length;
            matArea2 = indices.length;
            coeff = coeffs[numPasses];
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            imageIndices = new A16I(indices);
            for (k=0; k<matArea2; k+=2)
            { 
                imageIndices[k+1] *= w;
            } 
        
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
                    r=0; g=0; b=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                        {
                            srcOff = (xOff + yOff)<<2; wt = mat[k];
                            r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        }
                    }
                    
                    // output
                    t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                    
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                    
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
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
                    r=0; g=0; b=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                        {
                            srcOff = (xOff + yOff)<<2; wt = mat[k];
                            r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        }
                    }
                    
                    // output
                    t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                    
                    dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
            
            // do another pass??
            im = dst;
        }
        return dst;
    }
    /*
    // some common convolution cases can be handled faster (3x3)
    function convolution3(im, w, h, matrix, matrix2, coeff1, coeff2, _isGrad) 
    {
        return im;
    }
    */
}(FILTER);/**
*
* Morphological Filter(s)
*
* Applies morphological processing to target image
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
    
    "use strict";
    
    // used for internal purposes
    var IMG = FILTER.ImArray, STRUCT = FILTER.Array8U, A32I = FILTER.Array32I, Sqrt = Math.sqrt,
        
        // return a box structure element
        box = function(d) {
            var i, size=d*d, ones=new STRUCT(size);
            for (i=0; i<size; i++) ones[i]=1;
            return ones;
        },
        
        box3 = box(3),
        
        Filters
    ;
    
    
    //
    //
    //  Morphological Filter
    var MorphologicalFilter = FILTER.MorphologicalFilter = FILTER.Class( FILTER.Filter, {
        name: "MorphologicalFilter"
        
        ,constructor: function( ) {
            this._filterName = null;
            this._filter = null;
            this._dim = 0;
            this._structureElement = null;
            this._indices = null;
        }
        
        ,_filterName: null
        ,_filter: null
        ,_dim: 0
        ,_structureElement: null
        ,_indices: null
        
        ,dispose: function( ) {
            var self = this;
            
            self.disposeWorker( );
            
            self._filterName = null;
            self._filter = null;
            self._dim = null;
            self._structureElement = null;
            self._indices = null;
            
            return self;
        }
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                
                ,params: {
                    _filterName: self._filterName
                    ,_dim: self._dim
                    ,_structureElement: self._structureElement
                    ,_indices: self._indices
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                params = json.params;
                
                self._dim = params._dim;
                self._structureElement = params._structureElement;
                self._indices = params._indices;
                self._filterName = params._filterName;
                if ( self._filterName && Filters[ self._filterName ] )
                    self._filter = Filters[ self._filterName ].bind( self );
            }
            return self;
        }
        
        ,erode: function( structureElement ) { 
            return this.set( structureElement, "erode" );
        }
        
        ,dilate: function( structureElement ) { 
            return this.set( structureElement, "dilate" );
        }
        
        ,opening: function( structureElement ) { 
            return this.set( structureElement, "open" );
        }
        
        ,closing: function( structureElement ) { 
            return this.set( structureElement, "close" );
        }
        
        ,set: function( structureElement, filtName ) {
            this._filterName = filtName;
            this._filter = Filters[ filtName ].bind( this );
            if ( structureElement && structureElement.length )
            {
                // structure Element given
                this._structureElement = new STRUCT( structureElement );
                this._dim = ~~(Sqrt(this._structureElement.length)+0.5);
            }
            else if (structureElement && structureElement===(structureElement-0))
            {
                // dimension given
                this._structureElement = box(structureElement);
                this._dim = structureElement;
            }
            else
            {
                // default
                this._structureElement = box3;
                this._dim = 3;
            }
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            var Indices=[], k, x, y,
                structureElement=this._structureElement, 
                matArea=structureElement.length, matRadius=this._dim, matHalfSide=(matRadius>>1);
            x=0; y=0; k=0;
            while (k<matArea)
            { 
                // allow a general structuring element instead of just a box
                if (structureElement[k])
                {
                    Indices.push(x-matHalfSide); 
                    Indices.push(y-matHalfSide);
                }
                k++; x++; if (x>=matRadius) { x=0; y++; }
            }
            this._indices = new A32I(Indices);
            
            return this;
        }
        
        ,reset: function( ) {
            this._filterName = null; 
            this._filter = null; 
            this._dim = 0; 
            this._structureElement = null; 
            this._indices = null;
            return this;
        }
        
        // used for internal purposes
        ,_apply: function( im, w, h ) {
            if ( !this._isOn || !this._dim || !this._filter )  return im;
            return this._filter( im, w, h );
        }
        
        ,apply: function( image, cb ) {
            if ( this._isOn && this._dim && this._filter )
            {
                var im = image.getSelectedData();
                if ( this._worker )
                {
                    this
                        .bind( 'apply', function( data ) { 
                            this.unbind( 'apply' );
                            if ( data && data.im )
                                image.setSelectedData( data.im );
                            if ( cb ) cb.call( this );
                        })
                        // send filter params to worker
                        //.send( 'params', this.serialize( ) )
                        // process request
                        .send( 'apply', {im: im, params: this.serialize( )} )
                    ;
                }
                else
                {
                    image.setSelectedData( this._filter( im[ 0 ], im[ 1 ], im[ 2 ], image ) );
                    if ( cb ) cb.call( this );
                }
            }
            return image;
        }
    });

    //
    //
    // private methods
    
    Filters = {
        "dilate": function( im, w, h ) {
            var 
                structureElement=this._structureElement,
                matArea=structureElement.length, //matRadius*matRadius,
                matRadius=this._dim, imageIndices=new A32I(this._indices), 
                imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
                i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
                coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
                bx=w-1, by=imArea-w
            ;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            for (k=0; k<coverArea2; k+=2)
            { 
                // translate to image dimensions
                // the y coordinate
                imageIndices[k+1]*=w;
            }
            
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the image pixels that
                // fall under the structure matrix
                rM=0; gM=0; bM=0; 
                for (j=0; j<coverArea; j+=2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                        if (r>rM) rM=r; if (g>gM) gM=g; if (b>bM) bM=b;
                    }
                }
                
                // output
                dst[i] = rM;  dst[i+1] = gM;  dst[i+2] = bM;  dst[i+3] = im[i+3];
            }
            return dst;
        }
        
        ,"erode": function( im, w, h ) {
            var 
                structureElement=this._structureElement,
                matArea=structureElement.length, //matRadius*matRadius,
                matRadius=this._dim, imageIndices=new A32I(this._indices), 
                imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
                i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
                coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
                bx=w-1, by=imArea-w
            ;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            for (k=0; k<coverArea2; k+=2)
            { 
                // translate to image dimensions
                // the y coordinate
                imageIndices[k+1]*=w;
            }
            
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the image pixels that
                // fall under the structure matrix
                rM=255; gM=255; bM=255; 
                for (j=0; j<coverArea; j+=2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                        if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                    }
                }
                
                // output
                dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            }
            return dst;
        }
        
        // dilation of erotion
        ,"open": function( im, w, h ) {
            var 
                structureElement=this._structureElement,
                matArea=structureElement.length, //matRadius*matRadius,
                matRadius=this._dim, imageIndices=new A32I(this._indices), 
                imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
                i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
                coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
                bx=w-1, by=imArea-w
            ;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            for (k=0; k<coverArea2; k+=2)
            { 
                // translate to image dimensions
                // the y coordinate
                imageIndices[k+1]*=w;
            }
            
            // erode step
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the image pixels that
                // fall under the structure matrix
                rM=255; gM=255; bM=255; 
                for (j=0; j<coverArea; j+=2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                        if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                    }
                }
                
                // output
                dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            }
            
            im = dst; dst = new IMG(imLen);
            
            // dilate step
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the image pixels that
                // fall under the structure matrix
                rM=255; gM=255; bM=255; 
                for (j=0; j<coverArea; j+=2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                        if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                    }
                }
                
                // output
                dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            }
            return dst;
        }
        
        // erotion of dilation
        ,"close": function( im, w, h ) {
            var 
                structureElement=this._structureElement,
                matArea=structureElement.length, //matRadius*matRadius,
                matRadius=this._dim, imageIndices=new A32I(this._indices), 
                imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
                i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
                coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
                bx=w-1, by=imArea-w
            ;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            for (k=0; k<coverArea2; k+=2)
            { 
                // translate to image dimensions
                // the y coordinate
                imageIndices[k+1]*=w;
            }
            
            // dilate step
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the image pixels that
                // fall under the structure matrix
                rM=255; gM=255; bM=255; 
                for (j=0; j<coverArea; j+=2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                        if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                    }
                }
                
                // output
                dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            }
            
            im = dst; dst = new IMG(imLen);
            
            // erode step
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the image pixels that
                // fall under the structure matrix
                rM=255; gM=255; bM=255; 
                for (j=0; j<coverArea; j+=2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                        if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                    }
                }
                
                // output
                dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            }
            return dst;
        }
    };
    
}(FILTER);/**
*
* Statistical Filter(s)
*
* Applies statistical filtering/processing to target image
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
    
    "use strict";
    
    // used for internal purposes
    var IMG=FILTER.ImArray, A32I=FILTER.Array32I,
        Min=Math.min, Max=Math.max, Filters;
        
    //
    //
    //  Statistical Filter
    var StatisticalFilter = FILTER.StatisticalFilter = FILTER.Class( FILTER.Filter, {
        name: "StatisticalFilter"
        
        ,constructor: function( ) {
            this._dim = 0;
            this._indices = null;
            this._filterName = null;
            this._filter = null;
        }
        
        ,_dim: 0
        ,_indices: null
        ,_filter: null
        ,_filterName: null
        
        ,dispose: function( ) {
            var self = this;
            
            self.disposeWorker( );
            
            self._dim = null;
            self._indices = null;
            self._filter = null;
            self._filterName = null;
            
            return self;
        }
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                
                ,params: {
                    _filterName: self._filterName
                    ,_dim: self._dim
                    ,_indices: self._indices
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                params = json.params;
                
                self._dim = params._dim;
                self._indices = params._indices;
                self._filterName = params._filterName;
                if ( self._filterName && Filters[ self._filterName ] )
                    self._filter = Filters[ self._filterName ].bind( self );
            }
            return self;
        }
        
        ,median: function( d ) { 
            // allow only odd dimensions for median
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            return this.set( d, "median" );
        }
        
        ,minimum: function( d ) { 
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            return this.set( d, "minimum" );
        }
        
        ,maximum: function( d ) { 
            d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
            return this.set( d, "maximum" );
        }
        
        ,set: function( d, filt ) {
            this._filterName = filt; 
            this._filter = Filters[ filt ].bind( this ); 
            this._dim = d; 
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            var Indices=[], k, x, y,
                matArea=d*d, matRadius=d, matHalfSide=(matRadius>>1);
            x=0; y=0; k=0;
            while (k<matArea)
            { 
                Indices.push(x-matHalfSide); 
                Indices.push(y-matHalfSide);
                k++; x++; if (x>=matRadius) { x=0; y++; }
            }
            this._indices = new A32I(Indices);
            
            return this;
        }
        
        ,reset: function( ) {
            this._filterName = null; 
            this._filter = null; 
            this._dim = 0; 
            this._indices = null;
            return this;
        }
        
        // used for internal purposes
        ,_apply: function(im, w, h) {
            if ( !this._isOn || !this._dim )  return im;
            return this._filter( im, w, h );
        }
        
        ,apply: function( image, cb ) {
            if ( this._isOn && this._dim )
            {
                var im = image.getSelectedData( );
                if ( this._worker )
                {
                    this
                        .bind( 'apply', function( data ) { 
                            this.unbind( 'apply' );
                            if ( data && data.im )
                                image.setSelectedData( data.im );
                            if ( cb ) cb.call( this );
                        })
                        // send filter params to worker
                        //.send( 'params', this.serialize( ) )
                        // process request
                        .send( 'apply', {im: im, params: this.serialize( )} )
                    ;
                }
                else
                {
                    image.setSelectedData( this._filter( im[0], im[1], im[2], image ) );
                    if ( cb ) cb.call( this );
                }
            }
            return image;
        }
    });
    // aliiases
    StatisticalFilter.prototype.erode = StatisticalFilter.prototype.minimum;
    StatisticalFilter.prototype.dilate = StatisticalFilter.prototype.maximum;
    
    
    //
    //
    // private methods
    Filters = {
        "median": function( im, w, h ) {
            var 
                matRadius=this._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, 
                imageIndices=new A32I(this._indices),
                imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
                i, j, j2, x, ty, xOff, yOff, srcOff, 
                rM, gM, bM, r, g, b,
                medianR, medianG, medianB, len, len2,
                isOdd, matArea2=matArea<<1, bx=w-1, by=imArea-w
            ;
            
            rM = []; //new Array(matArea);
            gM = []; //new Array(matArea);
            bM = []; //new Array(matArea);
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            for (j=0; j<matArea2; j+=2)
            { 
                // translate to image dimensions
                // the y coordinate
                imageIndices[j+1]*=w;
            }
            
            i=0; x=0; ty=0; 
            while (i<imLen)
            {
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                rM.length=0; gM.length=0; bM.length=0; 
                j=0; //j2=0;
                while (j < matArea2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2]; 
                        rM.push(r); gM.push(g); bM.push(b);
                    }
                    j+=2; //j2+=1;
                }
                
                // sort them, this is SLOW, alternative implementation needed
                rM.sort(); gM.sort(); bM.sort();
                len=rM.length; len2=len>>1;
                medianR=(len%2) ? rM[len2+1] : ~~(0.5*(rM[len2] + rM[len2+1]));
                len=gM.length; len2=len>>1;
                medianG=(len%2) ? gM[len2+1] : ~~(0.5*(gM[len2] + gM[len2+1]));
                len=bM.length; len2=len>>1;
                medianB=(len%2) ? bM[len2+1] : ~~(0.5*(bM[len2] + bM[len2+1]));
                
                // output
                dst[i] = medianR;  dst[i+1] = medianG;   dst[i+2] = medianB;  
                dst[i+3] = im[i+3];
                
                // update image coordinates
                i+=4; x++; if (x>=w) { x=0; ty+=w; }
            }
            return dst;
        }
        
        ,"maximum": function( im, w, h ) {
            var 
                matRadius=this._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, 
                imageIndices=new A32I(this._indices),
                imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
                i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
                matArea2=matArea<<1, bx=w-1, by=imArea-w
            ;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            for (j=0; j<matArea2; j+=2)
            { 
                // translate to image dimensions
                // the y coordinate
                imageIndices[j+1]*=w;
            }
            
            i=0; x=0; ty=0;
            while (i<imLen)
            {
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                rM=0; gM=0; bM=0; 
                j=0;
                while (j < matArea2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                        if (r>rM) rM=r; if (g>gM) gM=g; if (b>bM) bM=b;
                    }
                    j+=2;
                }
                
                // output
                dst[i] = rM;  dst[i+1] = gM;  dst[i+2] = bM;  dst[i+3] = im[i+3];
                
                // update image coordinates
                i+=4; x++; if (x>=w) { x=0; ty+=w; }
            }
            return dst;
        }
        
        ,"minimum": function( im, w, h ) {
            var 
                matRadius=this._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, 
                imageIndices=new A32I(this._indices),
                imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
                i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
                matArea2=matArea<<1, bx=w-1, by=imArea-w
            ;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            for (j=0; j<matArea2; j+=2)
            { 
                // translate to image dimensions
                // the y coordinate
                imageIndices[j+1]*=w;
            }
            
            i=0; x=0; ty=0;
            while (i<imLen)
            {
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                rM=255; gM=255; bM=255; 
                j=0;
                while (j < matArea2)
                {
                    xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff=(xOff + yOff)<<2;
                        r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                        if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                    }
                    j+=2;
                }
                
                // output
                dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
                
                // update image coordinates
                i+=4; x++; if (x>=w) { x=0; ty+=w; }
            }
            return dst;
        }
    };
    
}(FILTER);

    /* main code ends here */
    
    /* export the module "FILTER" */
    return FILTER;
});