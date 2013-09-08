/**
*
* Filter SuperClass
* @package FILTER.js
*
**/
(function(FILTER){

    // http://jsperf.com/math-floor-vs-math-round-vs-parseint/33
    
    // typed arrays substitute 
    FILTER.Array32F = (typeof Float32Array !== "undefined") ? Float32Array : Array;
    FILTER.Array64F = (typeof Float64Array !== "undefined") ? Float64Array : Array;
    FILTER.Array8I = (typeof Int8Array !== "undefined") ? Int8Array : Array;
    FILTER.Array16I = (typeof Int16Array !== "undefined") ? Int16Array : Array;
    FILTER.Array32I = (typeof Int32Array !== "undefined") ? Int32Array : Array;
    FILTER.Array8U = (typeof Uint8Array !== "undefined") ? Uint8Array : Array;
    FILTER.Array16U = (typeof Uint16Array !== "undefined") ? Uint16Array : Array;
    FILTER.Array32U = (typeof Uint32Array !== "undefined") ? Uint32Array : Array;
    //FILTER.ImArray = (typeof Uint8ClampedArray !== "undefined") ? Uint8ClampedArray : ((typeof CanvasPixelArray !== "undefined") ? CanvasPixelArray : FILTER.Array8U);
    FILTER.ImArray = (typeof Uint8ClampedArray !== "undefined") ? Uint8ClampedArray : FILTER.Array8U;
    FILTER._notSupportTypedArrays=(!FILTER.ImArray.set);
    
    // Constants
    FILTER.CONSTANTS={
        PI : Math.PI,
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
    FILTER.LUMA=new FILTER.Array32F([0.212671, 0.71516, 0.072169]);
    
    //
    //
    // Abstract Generic Filter
    FILTER.Filter=function() { /* do nothing here, override */ };
    FILTER.Filter.prototype={
        _apply : function(im, w, h) { /* do nothing here, override */ },
        apply : function(image) { /* do nothing here, override */ },
        reset : function() { /* do nothing here, override */ }
    };
    
    //
    //
    // Composite Filter Stack  (a variation of Composite Design Pattern)
    FILTER.CompositeFilter=function(filters) 
    { 
        this._stack=(typeof filters!='undefined' && filters.length) ? filters : [];
    };
    
    FILTER.CompositeFilter.prototype={
        _stack : [],
        
        // used for internal purposes
        _apply : function(im, w, h) {
            
            if (!this._stack.length) return im;
            
            var _filterstack=this._stack, _stacklength=_filterstack.length, fi=0, filter;
                
            while (fi<_stacklength)
            {
                filter=_filterstack[fi++]; 
                if (filter) im=filter._apply(im, w, h);
            }
            return im;
        },
        
        // make it so other composite filters can be  used as simple filter components in the stack
        apply : function(image) {
            if (!this._stack.length) return image;
            return image.setData(this._apply(im=image.getData(), image.width, image.height));
        },
        
        filters : function(f) {
            if (f) this._stack=f;
            return this;
        },
        
        push : function(filter) {
            this._stack.push(filter);
            return this;
        },
        
        pop : function() {
            return this._stack.pop();
        },
        
        shift : function() {
            return this._stack.shift();
        },
        
        unshift : function(filter) {
            this._stack.unshift(filter);
            return this;
        },
        
        concat : function(filter) {
            return this.push(filter);
        },
        
        getAt : function(i) {
            return (this._stack.length>i) ? this._stack[i] : null;
        },
        
        setAt : function(i, filter) {
            if (this._stack.length>i) this._stack[i]=filter;
            return this;
        },
        
        insertAt : function(i, filter) {
            this._stack.splice(i, 0, filter);
            return this;
        },
        
        removeAt : function(i) {
            this._stack.splice(i, 1);
            return this;
        },
        
        remove : function(filter) {
            var i=this._stack.length;
            while (--i>=0) { if (filter===this._stack[i]) this._stack.splice(i,1); }
            return this;
        },
        
        reset : function() {
            this._stack.length=0;
            return this;
        }
    };
    
    // allow plugin creation
    FILTER.Create=function(options)
    {
        var filterClass=function() { this.init.apply(this, Array.prototype.slice.call(arguments)); };
        
        options=Fextend({
            init: function() {},
            reset: function() { return this; },
            apply: function(im, w, h){ return im; }
        }, options);
        options._apply=options.apply;
        options.apply=function(image) { return image.setData(this._apply(image.getData(), image.width, image.height)); }
        
        filterClass.prototype=Fextend(filterClass.prototype, options);
        return filterClass;
    };
    
    // private helper functons
    function FhasOwn(o, p) { return o && Object.prototype.hasOwnProperty.call(o, p); }
    function Fextend(o1, o2) { o1=o1||{}; for (var p in o2) { if (FhasOwn(o2, p))  o1[p]=o2[p];  }  return o1; }
    
    //var _canvas=null, _ctx=null;
    
    // static methods
    /*FILTER._static={
        createImageData : function(w, h) {
            if (!_canvas)
            {
                _canvas=document.createElement('canvas');
                _ctx=_canvas.getContext('2d');
            }
            return _ctx.createImageData(w, h);
        }
    };*/
    
})(FILTER);