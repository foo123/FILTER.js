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
            // using bind makes the code become [native code] and thus unserializable
            this._handler = handler && 'function' === typeof(handler) ? handler/*.bind( this )*/ : null;
        }
        
        ,_handler: null
        
        ,dispose: function( ) {
            this.disposeWorker( );
            this._handler = null;
            return this;
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
                    self._handler = eval( '(function(){ "use strict"; return ' + params._handler + '})();')/*.bind( self )*/;
                }
            }
            return self;
        }
        
        ,_apply: function( im, w, h, image ) {
            if ( !this._isOn || !this._handler ) return im;
            return this._handler.call( this, im, w, h, image );
        }
        
        ,apply: function( image, cb ) {
            if ( this._isOn && this._handler )
            {
                var im = image.getSelectedData( );
                if ( this._worker )
                {
                    this
                        .bind( 'apply', function( data ) { 
                            this.unbind( 'apply' );
                            if ( data && data.im )
                                image.setSelectedData( data.im );
                            if ( cb ) cb.call( this );
                        })
                        // process request
                        .send( 'apply', {im: im, params: this.serialize( )} )
                    ;
                }
                else
                {
                    image.setSelectedData( this._handler.call( this, im[ 0 ], im[ 1 ], im[ 2 ], image ) );
                    if ( cb ) cb.call( this );
                }
            }
            return image;
        }
    });
    
}(FILTER);