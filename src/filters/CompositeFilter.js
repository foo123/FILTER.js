/**
*
* Composite Filter Class
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var OP = Object.prototype, FP = Function.prototype, AP = Array.prototype,
    slice = AP.slice, splice = AP.splice, concat = AP.push,
    TypedArray = FILTER.Util.Array.typed, TypedObj = FILTER.Util.Array.typed_obj;

// Composite Filter Stack  (a variation of Composite Design Pattern)
var CompositeFilter = FILTER.Create({
    name: "CompositeFilter"

    ,init: function CompositeFilter(filters) {
        var self = this;
        self.filters = filters && filters.length ? filters : [];
    }

    ,path: FILTER.Path
    ,filters: null
    ,hasInputs: true
    ,_stable: true

    ,dispose: function(withFilters) {
        var self = this, i, stack = self.filters;

        if (true === withFilters)
        {
            for (i=0; i<stack.length; ++i)
            {
                stack[i] && stack[i].dispose(withFilters);
                stack[i] = null;
            }
        }
        self.filters = null;
        self.$super('dispose');
        return self;
    }

    ,serializeInputs: function(curIm) {
        var self = this, i, stack = self.filters, l, inputs = [ ], hasInputs = false, input;
        for (i=0,l=stack.length; i<l; ++i)
        {
            inputs.push(input=stack[i].serializeInputs(curIm));
            if (input) hasInputs = true;
        }
        return hasInputs ? inputs : null;
    }

    ,unserializeInputs: function(inputs, curImData) {
        var self = this;
        if (!inputs) return self;
        var i, stack = self.filters, l;
        for (i=0,l=stack.length; i<l; ++i) if (inputs[i]) stack[i].unserializeInputs(inputs[i], curImData);
        return self;
    }

    ,serialize: function() {
        var self = this, i, stack = self.filters, l, filters = [];
        for (i=0,l=stack.length; i<l; ++i) filters.push(stack[i].serializeFilter());
        return {_stable: self._stable, filters: filters};
    }

    ,unserialize: function(params) {
        var self = this, i, l, ls, filters, filter, stack = self.filters;

        self._stable = params._stable;
        filters = params.filters || [];
        l = filters.length; ls = stack.length;

        if ((l !== ls) || (!self._stable))
        {
            // dispose any prev filters
            for (i=0; i<ls; ++i)
            {
                stack[i] && stack[i].dispose(true);
                stack[i] = null;
            }
            stack = [];

            for (i=0; i<l; ++i)
            {
                filter = filters[i] && filters[i].filter ? FILTER.Filter.get(filters[i].filter) : null;
                if (filter)
                {
                    stack.push((new filter()).unserializeFilter(filters[i]));
                }
                else
                {
                    throw new Error('Filter "' + filters[i].filter + '" could not be created');
                    return;
                }
            }
            self.filters = stack;
        }
        else
        {
            for (i=0; i<l; ++i) stack[i].unserializeFilter(filters[i]);
        }
        return self;
    }

    ,metaData: function(serialisation) {
        var self = this, stack = self.filters, i, l,
            meta = self.meta, meta_s = meta;
        if (serialisation && FILTER.isWorker)
        {
            if (meta && meta.filters)
            {
                l = meta.filters.length;
                meta_s = {filters:new Array(l)};
                for (i=0; i<l; ++i) meta_s.filters[i] = stack[meta.filters[i][0]].metaData(serialisation);
                if (null != meta._IMG_WIDTH)
                {
                    meta_s._IMG_WIDTH = meta._IMG_WIDTH;
                    meta_s._IMG_HEIGHT = meta._IMG_HEIGHT;
                }
            }
            return TypedObj(meta_s);
        }
        else
        {
            return meta;
        }
    }
    ,setMetaData: function(meta, serialisation) {
        var self = this, stack = self.filters, i, l;
        if (serialisation && ("string" === typeof meta)) meta = TypedObj(meta, 1);
        if (meta && meta.filters && (l=meta.filters.length) && stack.length)
            for (i=0; i<l; ++i) stack[meta.filters[i][0]].setMetaData(meta.filters[i][1], serialisation);
        if (meta && (null != meta._IMG_WIDTH))
        {
            self.meta = {_IMG_WIDTH: meta._IMG_WIDTH, _IMG_HEIGHT: meta._IMG_HEIGHT};
            self.hasMeta = true;
        }
        return self;
    }

    ,stable: function(bool) {
        if (!arguments.length) bool = true;
        this._stable = !!bool;
        return this;
    }

    // manipulate the filter chain, methods
    ,set: function(filters) {
        if (filters && filters.length) this.filters = filters;
        this._glsl = null;
        return this;
    }

    ,filter: function(i, filter) {
        if (arguments.length > 1)
        {
            if (this.filters.length > i) this.filters[i] = filter;
            else this.filters.push(filter);
            this._glsl = null;
            return this;
        }
        else
        {
            return this.filters.length > i ? this.filters[i] : null;
        }
    }
    ,get: null

    ,push: function(/* variable args here.. */) {
        if (arguments.length) concat.apply(this.filters, arguments);
        this._glsl = null;
        return this;
    }
    ,concat: null

    ,pop: function() {
        this._glsl = null;
        return this.filters.pop();
    }

    ,shift: function() {
        this._glsl = null;
        return this.filters.shift();
    }

    ,unshift: function(/* variable args here.. */) {
        if (arguments.length) splice.apply(this.filters, concat.apply([0, 0], arguments));
        this._glsl = null;
        return this;
    }

    ,insertAt: function(i /*, filter1, filter2, filter3..*/) {
        var args = slice.call(arguments), arglen = args.length;
        if (argslen > 1)
        {
            args.shift();
            splice.apply(this.filters, [i, 0].concat(args));
            this._glsl = null;
        }
        return this;
    }

    ,removeAt: function(i) {
        this._glsl = null;
        return this.filters.splice(i, 1);
    }

    ,remove: function(filter) {
        var i = this.filters.length;
        while (--i >= 0)
        {
            if (filter === this.filters[i])
                this.filters.splice(i, 1);
        }
        this._glsl = null;
        return this;
    }

    ,reset: function() {
        this.filters.length = 0;
        this._glsl = null;
        return this;
    }
    ,empty: null

    ,getGLSL: function() {
        return null;
    }

    ,getWASM: function() {
        return null;
    }

    ,isGLSL: function() {
        if (this._isGLSL) for (var f=this.filters,i=0,n=f.length; i<n; ++i) if (f[i] && f[i].isOn() && f[i].isGLSL()) return true;
        return false;
    }

    ,isWASM: function() {
        if (this._isWASM) for (var f=this.filters,i=0,n=f.length; i<n; ++i) if (f[i] && f[i].isOn() && f[i].isWASM()) return true;
        return false;
    }

    ,GLSLCode: function() {
        var filters = this.filters, filter, glsl = [], processor, i, n = filters.length;
        for (i=0; i<n; ++i)
        {
            filter = filters[i];
            if (!filter) continue;
            processor = filter.GLSLCode();
            if (!processor)
            {
                if (filter._apply)
                    glsl.push({instance: filter});
            }
            else if (processor.push)
            {
                glsl.push.apply(glsl, processor);
            }
            else
            {
                glsl.push(processor);
            }
        }
        return glsl;
    }

    // used for internal purposes
    ,_apply: function(im, w, h, metaData) {
        var self = this, runWASM = self._runWASM /*|| self.isWASM()*/,
            meta, filtermeta = null, metalen = 0,
            IMGW = null, IMGH = null;
        if (self.filters.length)
        {
            metaData = metaData || {};
            var filterstack = self.filters, stacklength = filterstack.length, fi, filter;
            filtermeta = new Array(stacklength);
            for (fi=0; fi<stacklength; ++fi)
            {
                filter = filterstack[fi];
                if (filter && filter.canRun())
                {
                    metaData.container = self;  metaData.index = fi;
                    im = runWASM ? filter._apply_wasm(im, w, h, metaData) : filter._apply(im, w, h, metaData);
                    if (filter.hasMeta)
                    {
                        filtermeta[metalen++] = [fi, meta=filter.metaData()];
                        if (null != meta._IMG_WIDTH)
                        {
                            // width/height changed during process, update and pass on
                            IMGW = w = meta._IMG_WIDTH;
                            IMGH = h = meta._IMG_HEIGHT;
                        }
                    }
                }
            }
        }
        if (metalen > 0)
        {
            if (filtermeta.length > metalen) filtermeta.length = metalen;
            self.hasMeta = true;
            self.meta = {filters: filtermeta};
            if (null != IMGW) {self.meta._IMG_WIDTH = IMGW; self.meta._IMG_HEIGHT = IMGH;}
        }
        else
        {
            self.hasMeta = false;
            self.meta = null;
        }
        return im;
    }

    ,canRun: function() {
        return this._isOn && this.filters.length;
    }

    ,toString: function() {
        var tab = "\t", s = this.filters, out = [], i, l = s.length;
        for (i=0; i<l; ++i) out.push(tab + s[i].toString().split("\n").join("\n"+tab));
        return [
             "[FILTER: " + this.name + "]"
             ,"[",out.join("\n"),"]",""
         ].join("\n");
    }
});
// aliases
CompositeFilter.prototype.get = CompositeFilter.prototype.filter;
CompositeFilter.prototype.empty = CompositeFilter.prototype.reset;
CompositeFilter.prototype.concat = CompositeFilter.prototype.push;
FILTER.CompositionFilter = FILTER.CompositeFilter;

}(FILTER);