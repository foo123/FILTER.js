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
var InlineFilter = FILTER.InlineFilter = FILTER.CustomFilter = FILTER.Class( FILTER.Filter, {
    name: "InlineFilter"
    
    ,constructor: function( handler ) {
        var self = this;
        self.$super('constructor');
        // using bind makes the code become [native code] and thus unserializable
        self._handler = handler && ('function' === typeof handler) ? handler : null;
        self._params = {};
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_handler: null
    ,_params: null
    
    ,dispose: function( ) {
        var self = this;
        self.$super('dispose');
        self._handler = null;
        self._params = null;
        return self;
    }
    
    ,params: function( params ) {
        var self = this;
        if ( arguments.length )
        {
            for (var p in params)
            {
                if ( params[HAS](p) ) self._params[p] = params[p];
            }
            return self;
        }
        return self._params;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _handler: self._handler ? self._handler.toString( ) : null
                ,_params: self._params
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._handler = null;
            if ( params._handler )
            {
                // using bind makes the code become [native code] and thus unserializable
                // make FILTER namespace accessible to the function code
                self._handler = new Function( "FILTER", '"use strict"; return ' + params._handler + ';')( FILTER );
            }
            self._params = params._params || {};
        }
        return self;
    }
    
    ,_apply: function( im, w, h, image ) {
        var self = this;
        if ( !self._isOn || !self._handler ) return im;
        return self._handler( self, im, w, h, image );
    }
        
    ,canRun: function( ) {
        return this._isOn && this._handler;
    }
});

}(FILTER);