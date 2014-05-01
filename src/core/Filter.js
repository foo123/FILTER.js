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
        ,splice = AP.splice, concat = AP.concat
        
        ,Merge = FILTER.Merge, log
        
        ,isNode = "undefined" !== typeof( global ) && '[object global]' === toString( global )
        ,isBrowser = !isNode && "undefined" !== typeof( navigator )
        ,isWorker = "function" === typeof( importScripts ) && navigator instanceof WorkerNavigator
        ,supportsWorker = "function" === typeof( Worker )
        
        ,userAgent = navigator ? navigator.userAgent : ""
    ;
    
    //
    //
    // Browser support
    var Browser = FILTER.Browser = {
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
    };
    Browser.isMobile = Browser.isIOS || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
    Browser.isMac = Browser.isIOS || /Mac/.test(navigator.platform);
    Browser.isIE_lt8 = Browser.isIE  && !isWorker && (null == document.documentMode || document.documentMode < 8);
    Browser.isIE_lt9 = Browser.isIE && !isWorker && (null == document.documentMode || document.documentMode < 9);
    Browser.isQtWebkit = Browser.isWebkit && /Qt\/\d+\.\d+/.test(userAgent);
    
    // Get current filename/path
    FILTER.getPath = function( ) {
        var file = null, scripts;
        
        if ( isNode ) 
        {
            // http://nodejs.org/docs/latest/api/globals.html#globals_filename
            // this should hold the current file in node
            return { path: __dirname, file: __filename };
        }
        else if ( isWorker )
        {
            // https://developer.mozilla.org/en-US/docs/Web/API/WorkerLocation
            // this should hold the current url in a web worker
            file = self.location.href;
        }
        else if ( isBrowser && (scripts = document.getElementsByTagName('script')) && scripts.length )
        {
            // get last script (should be the current one) in browser
            file  = scripts[ scripts.length - 1 ].src;
        }
        
        return file 
                ? { path: file.split('/').slice(0, -1).join('/'), file: ''+file }
                : { path: null, file: null }
        ;
    };
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
    FILTER.uuid = function( namespace ) { 
        return [namespace||'fuuid', new Date().getTime(), ++_uuid].join('_'); 
    };
    var URL = FILTER.URL = root.webkitURL || root.URL,
        blobURL = function( src ) {
            return URL.createObjectURL( new Blob( [ src || '' ], { type: "text/javascript" }) );
        }
    ;
    
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
    // Worker Interface Filter
    var FilterWorkerInterface = FILTER.FilterWorkerInterface = FILTER.Class({
        
        path: FILTER.getPath( )
        ,name: null
        
        ,_worker: null
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
            
            if ( !arguments.length ) bool = true;
            bool = !!bool;
            
            // de-activate worker (if was activated before)
            if ( false === bool )
            {
                if ( self._worker ) self.disposeWorker( );
                return self;
            }
            
            if ( !self._worker )
            {
                if ( !supportsWorker )
                {
                    throw new Error('Worker is not supported');
                    return;
                }
                
                self._workerListeners = { };
                
                worker = self._worker = new Worker( this.path.file );
                
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
        
        // dummy
        ,constructor: function( ) {
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
            return "[FILTER: " + this.name + "]";
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
                 "[FILTER: " + this.name + "]"
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
    
    var toStringPlugin = function( ) { return "[FILTER Plugin: " + this.name + "]"; };
        
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
        return FILTER.Class( Filter, methods );
    };
    
}(this, FILTER);