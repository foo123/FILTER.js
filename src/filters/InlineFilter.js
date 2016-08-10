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
!function(FILTER, undef){
"use strict";

var HAS = 'hasOwnProperty';

//
//  Inline Filter 
//  used as a placeholder for constructing filters inline with an anonymous function
var InlineFilter = FILTER.InlineFilter = FILTER.Class( FILTER.Filter, {
    name: "InlineFilter"
    
    ,constructor: function InlineFilter( filter, params ) {
        var self = this;
        if ( !(self instanceof InlineFilter) ) return new InlineFilter(filter, params);
        self.$super('constructor');
        self._params = {};
        self.set( filter, params );
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_filter: null
    ,_params: null
    ,_changed: false
    
    ,dispose: function( ) {
        var self = this;
        self._filter = null;
        self._params = null;
        self._changed = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, json;
        json = {
            filter: self.name
            ,_isOn: !!self._isOn
            ,_update: self._update
            
            ,params: {
                 _filter: false === self._filter ? false : (self._changed && self._filter ? self._filter.toString( ) : null)
                ,_params: self._params
            }
        };
        self._changed = false;
        return json;
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            self._update = json._update;
            
            params = json.params;
            
            if ( null != params._filter )
                // using bind makes the code become [native code] and thus unserializable
                // make FILTER namespace accessible to the function code
                self._filter = false === params._filter ? null : new Function( "FILTER", '"use strict"; return ' + params._filter + ';')( FILTER );
            self._params = params._params || {};
        }
        return self;
    }
    
    ,params: function( params ) {
        var self = this;
        if ( arguments.length )
        {
            for (var p in params) if ( params[HAS](p) ) self._params[p] = params[p];
            return self;
        }
        return self._params;
    }
    
    ,set: function( filter, params ) {
        var self = this;
        if ( false === filter )
        {
            self._filter = false;
            self._changed = true;
        }
        else
        {
            if ( "function" === typeof filter )
            {
                self._filter = filter;
                self._changed = true;
            }
            if ( params ) self.params( params );
        }
        return self;
    }
    
    ,_apply: function( im, w, h, image ) {
        var self = this;
        if ( !self._isOn || !self._filter ) return im;
        return self._filter( self._params, im, w, h, image );
    }
        
    ,canRun: function( ) {
        return this._isOn && this._filter;
    }
});
FILTER.CustomFilter = FILTER.InlineFilter;

}(FILTER);