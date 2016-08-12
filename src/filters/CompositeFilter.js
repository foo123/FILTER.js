/**
*
* Composite Filter Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var OP = Object.prototype, FP = Function.prototype, AP = Array.prototype
    ,slice = AP.slice, splice = AP.splice, concat = AP.push, getFilter = FILTER.Filter.get;

//
// Composite Filter Stack  (a variation of Composite Design Pattern)
var CompositeFilter = FILTER.CompositeFilter = FILTER.Class( FILTER.Filter, {
    name: "CompositeFilter"
    
    ,constructor: function CompositeFilter( filters ) { 
        var self = this;
        if ( !(self instanceof CompositeFilter) ) return new CompositeFilter(filters);
        self.$super('constructor');
        self._stack = filters && filters.length ? filters.slice( ) : [ ];
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_stack: null
    ,_meta: null
    ,_stable: true
    ,hasInputs: true
    
    ,dispose: function( withFilters ) {
        var self = this, i, stack = self._stack;
        
        if ( true === withFilters )
        {
            for (i=0; i<stack.length; i++)
            {
                stack[ i ] && stack[ i ].dispose( withFilters );
                stack[ i ] = null;
            }
        }
        self._stack = null;
        self._meta = null;
        self.$super('dispose');
        return self;
    }
    
    ,serializeInputs: function( ) {
        var self = this, i, stack = self._stack, l, inputs = [ ], hasInputs = false, input;
        for (i=0,l=stack.length; i<l; i++)
        {
            inputs.push( input=stack[ i ].serializeInputs( ) );
            if ( input ) hasInputs = true;
        }
        return hasInputs ? inputs : null;
    }
    
    ,unserializeInputs: function( inputs ) {
        var self = this;
        if ( !inputs ) return self;
        var i, stack = self._stack, l;
        for (i=0,l=stack.length; i<l; i++) if ( inputs[ i ] ) stack[ i ].unserializeInputs( inputs[ i ] );
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, i, stack = self._stack, l, filters = [ ];
        for (i=0,l=stack.length; i<l; i++) filters.push( stack[ i ].serializeFilter( ) );
        return {_stable: self._stable, filters: filters};
    }
    
    ,unserialize: function( params ) {
        var self = this, i, l, ls, filters, filter, stack = self._stack;
        
        self._stable = params._stable;
        filters = params.filters || [ ];
        l = filters.length; ls = stack.length;
        
        if ( (l !== ls) || (!self._stable) )
        {
            // dispose any prev filters
            for (i=0; i<ls; i++)
            {
                stack[ i ] && stack[ i ].dispose( true );
                stack[ i ] = null;
            }
            stack = [ ];
            
            for (i=0; i<l; i++)
            {
                filter = filters[ i ] && filters[ i ].filter ? getFilter( filters[ i ].filter ) : null;
                if ( filter )
                {
                    stack.push( new filter( ).unserializeFilter( filters[ i ] ) );
                }
                else
                {
                    throw new Error('Filter "' + filters[ i ].filter + '" could not be created');
                    return;
                }
            }
            self._stack = stack;
        }
        else
        {
            for (i=0; i<l; i++) stack[ i ].unserializeFilter( filters[ i ] );
        }
        return self;
    }
    
    ,getMeta: function( ) {
        return this._meta;
    }
    
    ,setMeta: function( meta ) {
        var self = this, stack = self._stack, i, l;
        if ( meta && (l=meta.length) && stack.length )
            for (i=0; i<l; i++) stack[ meta[i][0] ].setMeta( meta[i][1] );
        return self;
    }
    
    ,stable: function( bool ) {
        if ( !arguments.length ) bool = true;
        this._stable = !!bool;
        return this;
    }
    
    // manipulate the filter chain, methods
    ,filters: function( f ) {
        if ( arguments.length )
        {
            this._stack = f.slice( );
            return this;
        }
        return this._stack.slice( );
    }
    
    ,push: function(/* variable args here.. */) {
        if ( arguments.length ) concat.apply(this._stack, arguments);
        return this;
    }
    ,concat: null
    
    ,pop: function( ) {
        return this._stack.pop( );
    }
    
    ,shift: function( ) {
        return this._stack.shift( );
    }
    
    ,unshift: function(/* variable args here.. */) {
        if ( arguments.length ) splice.apply(this._stack, concat.apply([0, 0], arguments));
        return this;
    }
    
    ,getAt: function( i ) {
        return this._stack.length > i ? this._stack[ i ] : null;
    }
    ,get: null
    
    ,setAt: function( i, filter ) {
        if ( this._stack.length > i ) this._stack[ i ] = filter;
        else this._stack.push( filter );
        return this;
    }
    ,set: null
    
    ,insertAt: function( i /*, filter1, filter2, filter3..*/) {
        var args = slice.call(arguments), arglen = args.length;
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
    ,empty: null
    
    // used for internal purposes
    ,_apply: function( im, w, h, image ) {
        var self = this, scratchpad = {}/*, update = false*/;
        self._meta = [];
        if ( self._isOn && self._stack.length )
        {
            var filterstack = self._stack, stacklength = filterstack.length, fi, filter;
            for (fi=0; fi<stacklength; fi++)
            {
                filter = filterstack[fi]; 
                if ( filter && filter._isOn ) 
                {
                    im = filter._apply(im, w, h, image, scratchpad);
                    if ( filter.hasMeta ) self._meta.push([fi, filter.getMeta()]);
                    //update = update || filter._update;
                }
            }
        }
        //self._update = update;
        self.hasMeta = self._meta.length > 0;
        return im;
    }
        
    ,canRun: function( ) {
        return this._isOn && this._stack.length;
    }
    
    ,toString: function( ) {
        var tab = "  ", s = this._stack, out = [], i, l = s.length;
        for (i=0; i<l; i++) out.push( tab + s[i].toString( ).split("\n").join("\n"+tab) );
        return [
             "[FILTER: " + this.name + "]"
             ,"[",out.join( "\n" ),"]",""
         ].join("\n");
    }
});
// aliases
CompositeFilter.prototype.get = CompositeFilter.prototype.getAt;
CompositeFilter.prototype.set = CompositeFilter.prototype.setAt;
CompositeFilter.prototype.empty = CompositeFilter.prototype.reset;
CompositeFilter.prototype.concat = CompositeFilter.prototype.push;
FILTER.CompositionFilter = FILTER.CompositeFilter;

}(FILTER);