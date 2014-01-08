/**
*
* Filter SuperClass and Utilities
* @package FILTER.js
*
**/
(function(Class, FILTER, undef){

    // http://jsperf.com/math-floor-vs-math-round-vs-parseint/33
    
    //
    //
    // Some browser detection hacks
    var isNode = (typeof global !== "undefined" && {}.toString.call(global) == '[object global]') ? true : false,
        isBrowser = (!isNode && window && window.document && window.navigator) ? true : false, isWorker = false,
        userAgent = (navigator) ? navigator.userAgent : ""
    ;
    var Browser = FILTER.Browser = {

        // http://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
        isNode                  : isNode,
        isBrowser               : isBrowser,
        isWorker                : isWorker,
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
    Browser.isIE_lt8 = Browser.isIE  && (null == document.documentMode || document.documentMode < 8);
    Browser.isIE_lt9 = Browser.isIE && (null == document.documentMode || document.documentMode < 9);
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
    
    var notSupportClamp = FILTER._notSupportClamp = (typeof Uint8ClampedArray === "undefined");
    FILTER.ImArray = (notSupportClamp) ? FILTER.Array8U : Uint8ClampedArray;
    // opera seems to have a bug which copies Uint8ClampedArrays by reference instead by value (eg. as Firefox and Chrome)
    // however Uint8 arrays are copied by value, so use that instead for doing fast copies of image arrays
    FILTER.ImArrayCopy = (Browser.isOpera) ? FILTER.Array8U : FILTER.ImArray;
        
    // IE still does not support Uint8ClampedArray and some methods on it, add the method "set"
    if (notSupportClamp && (typeof CanvasPixelArray !== "undefined") && !CanvasPixelArray.prototype.set)
    {
        var _set = function(a, index) {
                var l=a.length, i=l;
                //index=index||0;
                while (--i) { this[i/*+index*/]=a[i]; /*i++;*/ }
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
    // Extending/Subclassing Framework
    var Merge = Classy.Merge, hasOwn = Object.prototype.hasOwnProperty,        
        hasProperty = Object.prototype.hasOwnProperty, propertyIsEnum = Object.prototype.propertyIsEnumerable,
        slice = Array.prototype.slice, splice = Array.prototype.splice, concat = Array.prototype.concat
    ;
    
    //
    //
    // logging
    var log = FILTER.log = (console && console.log) ? console.log : function(s) { /* do nothing*/ };
    FILTER.warning = function(s) { log('WARNING: '+s); }; 
    FILTER.error = function(s) { log('ERROR: '+s); };
    
    //
    //
    // webgl support
    FILTER.useWebGL = false;
    FILTER.useWebGLSharedResources = false;
    FILTER.useWebGLIfAvailable = function(bool) { /* do nothing, override */  };
    FILTER.useWebGLSharedResourcesIfAvailable = function(bool) { /* do nothing, override */  };
    
    //
    //
    // for WebGL Support
    var devicePixelRatio = FILTER.devicePixelRatio = window.devicePixelRatio || 1;
    
    FILTER.getCanvas = FILTER.createCanvas = function(w, h) {
        var canvas = document.createElement('canvas');
        w = w || 0; h = h || 0;
        
        // set the display size of the canvas.
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
         
        // set the size of the drawingBuffer
        canvas.width = w * devicePixelRatio;
        canvas.height = h * devicePixelRatio;
        
        return canvas;
    };
    
    var _filterId = 0;
    FILTER.getId = function() { return ++_filterId; };
    
    //
    //
    // Abstract Generic Filter
    var Filter = FILTER.Filter = Class({
        name : "AbstractFilter",
        
        // dummy
        constructor : function() {
        },
        
        // filters can have id's
        id : null,
        
        _isOn : true,
        
        // whether filter is ON
        isOn : function() {
            return this._isOn;
        },
        
        // allow filters to be turned ON
        turnOn : function() {
            this._isOn = true;
            return this;
        },
        
        // allow filters to be turned OFF
        turnOff : function() {
            this._isOn = false;
            return this;
        },
        
        // toggle ON/OFF state
        toggle : function() {
            this._isOn = !this._isOn;
            return this;
        },
        
        // override
        reset : function() {
            return this;
        },
        
        // override
        combineWith : function(filter) {
            return this;
        },
        
        toString : function() {
            return "[" + "FILTER: " + this.name + "]";
        },
        
        // for internal use, each filter overrides this
        _apply : function(im, w, h, image) { /* do nothing here, override */ 
            return im;
        },
        
        // generic apply method, maybe ovewritten
        apply : function(image) {
            if ( this._isOn )
            {
                var im = image.getSelectedData();
                return image.setSelectedData(this._apply(im[0], im[1], im[2], image));
            }
            return image;
        }
    });
    
    //
    //
    // Composite Filter Stack  (a variation of Composite Design Pattern)
    var CompositeFilter = FILTER.CompositeFilter = Class( Filter, {
        name : "CompositeFilter",
        
        constructor : function(filters) { 
            this._stack = ( filters && filters.length ) ? filters.slice() : [];
        },
        
        _stack : null,
        
        // manipulate the filter chain, methods
        getFilters : function() {
            return this._stack.slice();
        },
        
        setFilters : function(f) {
            if ( f ) this._stack = f.slice();
            return this;
        },
        
        push : function(/* variable args here.. */) {
            var args = slice.call(arguments), argslen = args.length;
            if (argslen)
                this._stack = concat.apply( this._stack, args );
            return this;
        },
        
        pop : function() {
            return this._stack.pop();
        },
        
        shift : function() {
            return this._stack.shift();
        },
        
        unshift : function(/* variable args here.. */) {
            var args = slice.call(arguments), argslen = args.length;
            if (argslen)
                splice.apply( this._stack, [0, 0].concat(args) );
            return this;
        },
        
        getAt : function(i) {
            return ( this._stack.length > i ) ? this._stack[i] : null;
        },
        
        setAt : function(i, filter) {
            if ( this._stack.length > i ) this._stack[i] = filter;
            else this._stack.push( filter );
            return this;
        },
        
        insertAt : function(i /*, filter1, filter2, filter3..*/) {
            var args = slice.call(arguments), arglen = args.length;
            if ( argslen > 1 )
            {
                args.shift();
                splice.apply( this._stack, [i, 0].concat(args) );
            }
            return this;
        },
        
        removeAt : function(i) {
            return this._stack.splice(i, 1);
        },
        
        remove : function(filter) {
            var i = this._stack.length;
            while ( --i>=0 ) 
            { 
                if ( filter===this._stack[i] ) this._stack.splice(i, 1); 
            }
            return this;
        },
        
        reset : function() {
            this._stack.length = 0;  
            return this;
        },
        
        toString : function() {
            var s = "", st = this._stack;
            
            s += "[" + "FILTER: " + this.name + "]" + "\n";
            s += "[\n";
            s += "    " + st.join("\n    ") + "\n";
            s += "]\n";
            
            return s;
        },
        
        // used for internal purposes
        _apply : function(im, w, h, image) {
            
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
        },
        
        // make it so other composite filters can be  used as simple filter components in the stack
        apply : function(image) {
            if ( this._isOn && this._stack.length )
            {
                var im = image.getSelectedData();
                return image.setSelectedData(this._apply(im[0], im[1], im[2], image));
            }
            return image;
        }
    });
    // aliases
    CompositeFilter.prototype.empty = CompositeFilter.prototype.reset;
    CompositeFilter.prototype.concat = CompositeFilter.prototype.push;
    
    var toStringPlugin = function() { return "[" + "FILTER Plugin: " + this.name + "]"; };
        
    //
    //
    // allow plugin creation
    FILTER.Create = function(methods) {
        
        methods = Merge({
                init : function() {},
                name : "PluginFilter",
                toString : toStringPlugin,
                apply : function(im, w, h, image){ return im; }
        }, methods);
        methods.constructor = methods.init;
        methods._apply = methods.apply;
        delete methods.init;
        delete methods.apply;
        return Class(Filter, methods);
    };
    
})(Class, FILTER);