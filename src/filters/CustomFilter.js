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
            this._handler = handler ? handler.bind( this ) : null;
        }
        
        ,_handler: null
        
        ,dispose: function( ) {
            this._worker = null;
            this._workerListeners = null;
            this._handler = null;
            return this;
        }
        
        ,worker: function( bool ) {
            // no worker support for custom filters (yet??)
            this._worker = null;
            this._workerListeners = null;
            return this;
        }
        
        ,_apply: function( im, w, h, image ) {
            if ( !this._isOn || !this._handler ) return im;
            return this._handler( im, w, h, image );
        }
        
        ,apply: function( image ) {
            if ( this._isOn && this._handler )
            {
                var im = image.getSelectedData( );
                image.setSelectedData( this._handler( im[ 0 ], im[ 1 ], im[ 2 ], image ) );
            }
            return image;
        }
    });
    
}(FILTER);