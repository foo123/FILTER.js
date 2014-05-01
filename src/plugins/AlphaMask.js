/**
*
* Alpha Mask Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    @@USE_STRICT@@
    
    var notSupportClamp = FILTER._notSupportClamp, Min = Math.min, Floor=Math.floor;
    
    // a plugin to mask an image using the alpha channel of another image
    FILTER.AlphaMaskFilter = FILTER.Create({
        name: "AlphaMaskFilter"
        
        // parameters
        ,_alphaMask: null
        ,alphaMask: null
        ,centerX: 0
        ,centerY: 0
        
        // constructor
        ,init: function( alphaMask, centerX, centerY ) {
            this.centerX = centerX||0;
            this.centerY = centerY||0;
            this._alphaMask = null;
            this.alphaMask = null;
            if ( alphaMask ) this.setMask( alphaMask );
        }
        
        // support worker serialize/unserialize interface
        ,path: FILTER.getPath( )
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                
                ,params: {
                    _alphaMask: self._alphaMask
                    ,centerX: self.centerX
                    ,centerY: self.centerY
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                params = json.params;
                
                self._alphaMask = params._alphaMask;
                self.centerX = params.centerX;
                self.centerY = params.centerY;
            }
            return self;
        }
        
        ,setMask: function( alphaMask ) {
            if ( alphaMask )
            {
                this.alphaMask = alphaMask;
                this._alphaMask = { data: alphaMask.getData( ), width: alphaMask.width, height: alphaMask.height };
            }
            return this;
        }
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            
            if ( !this._alphaMask ) return im;
            
            var alpha = this._alphaMask.data,
                w2 = this._alphaMask.width, h2 = this._alphaMask.height,
                i, l = im.length, l2 = alpha.length, 
                x, x2, y, y2, off, xc, yc, 
                wm = Min(w, w2), hm = Min(h, h2),  
                cX = this.centerX||0, cY = this.centerY||0, 
                cX2 = (w2>>1), cY2 = (h2>>1)
            ;
            
            
            // make center relative
            cX = Floor(cX*(w-1)) - cX2;
            cY = Floor(cY*(h-1)) - cY2;
            
            x=0; y=0;
            for (i=0; i<l; i+=4, x++)
            {
                if (x>=w) { x=0; y++; }
                
                xc = x - cX; yc = y - cY;
                if (xc>=0 && xc<wm && yc>=0 && yc<hm)
                {
                    // copy alpha channel
                    off = (xc + yc*w2)<<2;
                    im[i+3] = alpha[off+3];
                }
                else
                {
                    // better to remove the alpha channel if mask dimensions are different??
                    im[i+3] = 0;
                }
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);