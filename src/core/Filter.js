/**
*
* Filter SuperClass
* @package FILTER.js
*
**/
(function(FILTER, undef){

    //
    //
    // Some browser detection hacks
    // http://www.quirksmode.org/js/detect.html
    // http://my.opera.com/community/openweb/idopera/
    // http://stackoverflow.com/questions/1998293/how-to-determine-the-opera-browser-using-javascript
    //var isOpera = Object.prototype.toString.call(window.opera) == '[object Opera]';
    var isOpera = (navigator.userAgent.match(/Opera|OPR\//) ? true : false);
    
    // http://jsperf.com/math-floor-vs-math-round-vs-parseint/33
    
    //
    //
    // Typed Arrays Substitute 
    FILTER.Array32F = (typeof Float32Array !== "undefined") ? Float32Array : Array;
    FILTER.Array64F = (typeof Float64Array !== "undefined") ? Float64Array : Array;
    FILTER.Array8I = (typeof Int8Array !== "undefined") ? Int8Array : Array;
    FILTER.Array16I = (typeof Int16Array !== "undefined") ? Int16Array : Array;
    FILTER.Array32I = (typeof Int32Array !== "undefined") ? Int32Array : Array;
    FILTER.Array8U = (typeof Uint8Array !== "undefined") ? Uint8Array : Array;
    FILTER.Array16U = (typeof Uint16Array !== "undefined") ? Uint16Array : Array;
    FILTER.Array32U = (typeof Uint32Array !== "undefined") ? Uint32Array : Array;
    
    var notSupportClamp = FILTER._notSupportClamp = (typeof Uint8ClampedArray === "undefined");
    //FILTER.ImArray = (!notSupportClamp) ? Uint8ClampedArray : ((typeof CanvasPixelArray !== "undefined") ? CanvasPixelArray : FILTER.Array8U);
    FILTER.ImArray = (!notSupportClamp) ? Uint8ClampedArray : FILTER.Array8U;
    
    // opera seems to have a bug which copies Uint8ClampedArrays by reference instead by value (eg. as Firefox and Chrome)
    // however Uint8 arrays are copied by value, so use that instead for doing fast copies of image arrays
    if (isOpera)  FILTER.ImArrayCopy = FILTER.Array8U;
    else FILTER.ImArrayCopy = FILTER.ImArray;
        
    // IE still does not support Uint8ClampedArray and some methods on it, add the method "set"
    if (notSupportClamp && (typeof CanvasPixelArray !== "undefined"))
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
    FILTER.CONSTANTS={
        PI : Math.PI,
        PI2 : 2*Math.PI,
        SQRT2 : Math.SQRT2,
        toRad : Math.PI/180, 
        toDeg : 180/Math.PI
    };
    FILTER.CHANNEL={
        RED : 0,
        GREEN : 1,
        BLUE : 2,
        ALPHA : 3
    };
    FILTER.MODE={
        IGNORE : 0,
        WRAP : 1,
        CLAMP : 2,
        COLOR : 4
    };
    FILTER.LUMA=new FILTER.Array32F([ 
        0.212671, 
        0.71516, 
        0.072169 
    ]);
    
    
    //
    //
    // SubClassing/Extending Methods
    var 
        hasOwn=Object.prototype.hasOwnProperty,
        
        slice = Array.prototype.slice, splice = Array.prototype.splice,
        
        superCall = function() { 
            var args=slice.call( arguments ), argslen=args.length;
            
            if ( argslen )
            {
                var method = args.shift();
                if ( this.__super__[method] )
                {
                    return this.__super__[method].apply(this, args);
                }
            }
            
            return null;
        },
        
        Merge = FILTER.Merge = function(o1, o2) { 
            o1 = o1 || {}; 
            for (var p in o2) 
                if ( hasOwn.call(o2, p) )  o1[p] = o2[p];  
            
            return o1; 
        },
        
        // http://javascript.crockford.com/prototypal.html
        // http://stackoverflow.com/questions/12592913/what-is-the-reason-to-use-the-new-keyword-here
        // http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
        Extends = FILTER.Extends = function(Parent, ChildProto) {
            var F = function(){}; 
            var C = ChildProto.constructor;
            //ChildProto.constructor=null;
            //delete ChildProto.constructor;
            F.prototype = Parent.prototype;
            C.prototype = new F();
            C.prototype.constructor = C;
            C.prototype = Merge( C.prototype, ChildProto );
            C.prototype.__super__ = Parent.prototype;
            C.prototype.superCall = superCall;
            return C;
        }
    ;
    
    //
    //
    // logging
    var log = FILTER.log = (window.console && window.console.log) ? window.console.log : function(s) { /* do nothing*/ };
    FILTER.warning = function(s) { log('WARNING: '+s); }; FILTER.error = function(s) { log('ERROR: '+s); };
    
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
    
    FILTER.createCanvas = function(w, h) {
        var canvas=document.createElement('canvas');
        w=w||0; h=h||0; //canvas.width=w||0; canvas.height=h||0;
        
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
    var Filter = FILTER.Filter = FILTER.Extends( Object,
    {
        name : "GenericFilter",
        
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
        
        // override
        reset : function() {
            return this;
        },
        
        // override
        combineWith : function(filter) {
            return this;
        },
        
        // for internal use, each filter overrides this
        _apply : function(im, w, h, image) { /* do nothing here, override */ 
            return im;
        },
        
        // generic apply method, maybe ovewritten
        apply : function(image) {
            if ( this._isOn )
                return image.setData( this._apply( image.getData(), image.width, image.height, image ) );
            return image;
        }
    });
    
    //
    //
    // Composite Filter Stack  (a variation of Composite Design Pattern)
    var CompositeFilter = FILTER.CompositeFilter = FILTER.Extends( Filter,
    {
        
        name : "CompositeFilter",
        
        constructor : function(filters) { 
            this._stack=( filters && filters.length ) ? filters.slice() : [];
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
        
        push : function(filter) {
            this._stack.push( filter );
            return this;
        },
        
        pop : function() {
            return this._stack.pop();
        },
        
        shift : function() {
            return this._stack.shift();
        },
        
        unshift : function(filter) {
            this._stack.unshift( filter );
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
        
        // used for internal purposes
        _apply : function(im, w, h, image) {
            
            if ( this._isOn && this._stack.length )
            {
                var _filterstack = this._stack, _stacklength = _filterstack.length, 
                    fi = 0, filter;
                    
                while ( fi<_stacklength )
                {
                    filter = _filterstack[fi++]; 
                    if ( filter && filter._isOn ) im = filter._apply(im, w, h, image);
                }
            }
            return im;
        },
        
        // make it so other composite filters can be  used as simple filter components in the stack
        apply : function(image) {
            if ( this._isOn && this._stack.length )
                return image.setData( this._apply( image.getData(), image.width, image.height, image ) );
            return image;
        }
    });
    // aliases
    CompositeFilter.prototype.empty = CompositeFilter.prototype.reset;
    CompositeFilter.prototype.concat = CompositeFilter.prototype.push;
    
    //
    //
    // allow plugin creation
    FILTER.Create = function(methods) {
        
        //methods.constructor = methods.constructor || methods.init || function() {};
        methods = Merge({
                        init : function() {},
                        name : "PluginFilter",
                        apply : function(im, w, h, image){ return im; }
                    }, 
                    methods);
        
        methods = Merge(methods, { 
                        constructor: methods.init, 
                        _apply: methods.apply, 
                        apply: function(image) { 
                            if ( this._isOn )
                                return image.setData(this._apply(image.getData(), image.width, image.height, image)); 
                            return image;
                        }
                    });
        if (methods.init) { methods.init = null; delete methods.init;  }
        
        return Extends( Filter, methods);
    };
    /*FILTER.Create=function(methods) {
        var filterClass=function() { this.init.apply( this, slice.call(arguments) ); };
        
        methods=extend({
            init: function() {},
            reset: function() { return this; },
            apply: function(im, w, h, image){ return im; }
        }, methods);
        methods._apply=methods.apply;
        methods.apply=function(image) { return image.setData(this._apply(image.getData(), image.width, image.height, image)); }
        
        filterClass.prototype=extend(filterClass.prototype, methods);
        return filterClass;
    };*/
    
})(FILTER);