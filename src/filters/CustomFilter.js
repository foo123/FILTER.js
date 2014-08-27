/**
*
* Custom Filter(s)
*
* Allows to create an filter on-the-fly using an inline function
*
* @param handler Optional (the filter apply routine)
* @package FILTER.js
*
**/
!function(FILTER, undef){
    
    @@USE_STRICT@@
    
    //
    //
    //  Custom Filter 
    //  used as a placeholder for constructing filters inline with an anonymous function
    var CustomFilter = FILTER.CustomFilter = FILTER.Class( FILTER.Filter, {
        name: "CustomFilter"
        
        ,constructor: function( handler ) {
            var self = this;
            self.$super('constructor');
            // using bind makes the code become [native code] and thus unserializable
            self._handler = handler && 'function' === typeof(handler) ? handler : null;
        }
        
        ,_handler: null
        
        ,dispose: function( ) {
            var self = this;
            self.$super('dispose');
            self._handler = null;
            return self;
        }
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    _handler: self._handler ? self._handler.toString( ) : null
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
                    self._handler = eval( '(function(){ "use strict"; return ' + params._handler + '})();');
                }
            }
            return self;
        }
        
        ,_apply: function( im, w, h, image ) {
            var self = this;
            if ( !self._isOn || !self._handler ) return im;
            return self._handler( self, im, w, h, image );
        }
        
        ,apply2: function( src, dest, cb ) {
            var self = this, im;
            if ( src && dest && self._isOn && self._handler )
            {
                im = src.getSelectedData( );
                if ( self.$thread )
                {
                    if ( cb ) self.one('apply', function( ){ cb( self ); } );
                    self
                        .listen( 'apply', function( data ) { 
                            self.unlisten( 'apply' );
                            if ( data && data.im )
                                dest.setSelectedData( data.im );
                            self.trigger( 'apply', self );
                        })
                        // process request
                        .send( 'apply', {im: im, params: self.serialize( )} )
                    ;
                }
                else
                {
                    dest.setSelectedData( self._handler( self, im[ 0 ], im[ 1 ], im[ 2 ], src ) );
                }
            }
            return src;
        }
    });
    
}(FILTER);