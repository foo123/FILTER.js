/**
*
* CompositeFilter Class
* @package FILTER.js
*
**/
!function(FILTER, undef){

    @@USE_STRICT@@
    
    var OP = Object.prototype, FP = Function.prototype, AP = Array.prototype
        ,slice = FP.call.bind( AP.slice ), toString = FP.call.bind( OP.toString )
        ,splice = AP.splice, concat = AP.concat
    ;
    
    //
    //
    // Composite Filter Stack  (a variation of Composite Design Pattern)
    var CompositeFilter = FILTER.CompositeFilter = FILTER.Class( FILTER.Filter, {
        name: "CompositeFilter"
        
        ,constructor: function( filters ) { 
            var self = this;
            self.$super('constructor');
            self._stack = ( filters && filters.length ) ? filters.slice( ) : [ ];
        }
        
        ,_stack: null
        ,_stable: true
        
        ,dispose: function( withFilters ) {
            var self = this, i, stack = self._stack;
            
            self.$super('dispose');
            
            if ( true === withFilters )
            {
                for (i=0; i<stack.length; i++)
                {
                    stack[ i ] && stack[ i ].dispose( withFilters );
                    stack[ i ] = null;
                }
            }
            self._stack = null;
            
            return self;
        }
        
        ,serialize: function( ) {
            var self = this, json = { filter: self.name, _isOn: !!self._isOn, _stable: !!self._stable, filters: [ ] }, i, stack = self._stack;
            for (i=0; i<stack.length; i++)
            {
                json.filters.push( stack[ i ].serialize( ) );
            }
            return json;
        }
        
        ,unserialize: function( json ) {
            var self = this, i, l, ls, filters, filter, stack = self._stack;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                self._stable = !!json._stable;
                
                filters = json.filters || [ ];
                l = filters.length;
                ls = stack.length;
                if ( l !== ls || !self._stable )
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
                }
                else
                {
                    for (i=0; i<l; i++)
                    {
                        stack[ i ] = stack[ i ].unserialize( filters[ i ] );
                    }
                }
                
                self._stack = stack;
            }
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
            var self = this;
            if ( self._isOn && self._stack.length )
            {
                var _filterstack = self._stack, _stacklength = _filterstack.length, 
                    fi, filter;
                    
                for ( fi=0; fi<_stacklength; fi++ )
                {
                    filter = _filterstack[fi]; 
                    if ( filter && filter._isOn ) im = filter._apply(im, w, h, image);
                }
            }
            return im;
        }
            
        ,canRun: function( ) {
            return this._isOn && this._stack.length;
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
    
}(FILTER);