/**
*
* Inline Filter(s)
*
* Allows to create an filter on-the-fly using an inline function
*
* @param handler Optional (the filter apply routine)
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var GLSL = FILTER.Util.GLSL, HAS = Object.prototype.hasOwnProperty;

//
//  Inline Filter
//  used as a placeholder for constructing filters inline with an anonymous function and/or webgl shader
FILTER.Create({
    name: "InlineFilter"

    ,init: function InlineFilter(filter, params) {
        var self = this;
        self._params = {};
        self.set(filter, params);
    }

    ,path: FILTER.Path
    ,_filter: null
    ,_params: null
    ,_changed: false

    ,dispose: function() {
        var self = this;
        self._filter = null;
        self._params = null;
        self._changed = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this, json;
        json = {
             _filter: false === self._filter ? false : (self._changed && self._filter ? (self._filter.filter || self._filter).toString() : null)
            ,_params: self._params
        };
        self._changed = false;
        return json;
    }

    ,unserialize: function(params) {
        var self = this;
        if (null != params._filter)
            // using bind makes the code become [native code] and thus unserializable
            // make FILTER namespace accessible to the function code
            self._filter = false === params._filter ? null : ((new Function("FILTER", '"use strict"; return ' + params._filter + ';'))(FILTER));
        self._params = params._params || {};
        return self;
    }

    ,params: function(params) {
        var self = this;
        if (arguments.length)
        {
            for (var p in params) if (HAS.call(params, p)) self._params[p] = params[p];
            return self;
        }
        return self._params;
    }

    ,getParam: function(param) {
        var self = this;
        if (param && HAS.call(self._params, param))
        {
            return self._params[param];
        }
    }
    ,setParam: function(param, value) {
        var self = this;
        if (param && HAS.call(self._params, param))
        {
            self._params[param] = value;
        }
        return self;
    }

    ,set: function(filter, params) {
        var self = this;
        if (false === filter)
        {
            self._filter = false;
            self._changed = true;
            self._glsl = null;
        }
        else
        {
            if (filter && (("function" === typeof filter) || ("function" === typeof filter.filter)))
            {
                self._filter = filter;
                self._changed = true;
                self._glsl = null;
            }
            if (params) self.params(params);
        }
        return self;
    }

    ,getGLSL: function() {
        var self = this, filter = self._filter, glslcode;
        if (filter && filter.shader)
        {
            glslcode = (new GLSL.Filter(self)).begin().shader(filter.shader);
            if (filter.inputs) filter.inputs.forEach(function(i) {
                if (i.name && i.setter) glslcode.input(i.name, i.setter, i.iname);
            });
            return glslcode.end().code();
        }
        return (new GLSL.Filter(self)).begin().shader(filter ? null : GLSL.DEFAULT).end().code();
    }

    ,_apply: function(im, w, h, metaData) {
        var self = this, filter = self._filter;
        if (!filter) return im;
        if ('function' === typeof filter.filter) filter = filter.filter;
        return filter(self._params, im, w, h, metaData);
    }

    ,canRun: function() {
        return this._isOn && this._filter;
    }
});
FILTER.CustomFilter = FILTER.InlineFilter;

}(FILTER);