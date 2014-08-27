/**
*
* Noise Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    @@USE_STRICT@@
    
    var notSupportClamp=FILTER._notSupportClamp, rand=Math.random;
    
    // a sample noise filter
    // used for illustration purposes on how to create a plugin filter
    FILTER.NoiseFilter = FILTER.Create({
        name: "NoiseFilter"
        
        // parameters
        ,min: -127
        ,max: 127
        
        // this is the filter constructor
        ,init: function( min, max ) {
            var self = this;
            self.min = min||-127;
            self.max = max||127;
        }
        
        // support worker serialize/unserialize interface
        ,path: FILTER.getPath( )
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    min: self.min
                    ,max: self.max
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self.min = params.min;
                self.max = params.max;
            }
            return self;
        }
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            // for this filter, no need to clone the image data, operate in-place
            var self = this;
            if ( !self._isOn ) return im;
            var range=self.max-self.min, m=self.min,
                i, l=im.length, n, r, g, b, t0, t1, t2;
            
            // add noise
            if (notSupportClamp)
            {   
                for (i=0; i<l; i+=4)
                { 
                    r = im[i]; g = im[i+1]; b = im[i+2];
                    n = range*rand()+m;
                    t0 = r+n; t1 = g+n; t2 = b+n; 
                    // clamp them manually
                    if (t0<0) t0=0;
                    else if (t0>255) t0=255;
                    if (t1<0) t1=0;
                    else if (t1>255) t1=255;
                    if (t2<0) t2=0;
                    else if (t2>255) t2=255;
                    im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                { 
                    r = im[i]; g = im[i+1]; b = im[i+2];
                    n = range*rand()+m;
                    t0 = r+n; t1 = g+n; t2 = b+n; 
                    im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
                }
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);