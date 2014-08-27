/**
*
* Channel Copy Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    @@USE_STRICT@@
    
    var notSupportClamp=FILTER._notSupportClamp, Min=Math.min, Floor=Math.floor,
        R=FILTER.CHANNEL.RED, G=FILTER.CHANNEL.GREEN, B=FILTER.CHANNEL.BLUE, A=FILTER.CHANNEL.ALPHA;
    
    // a plugin to copy a channel of an image to a channel of another image
    FILTER.ChannelCopyFilter = FILTER.Create({
        name: "ChannelCopyFilter"
        
        // parameters
        ,_srcImg: null
        ,srcImg: null
        ,centerX: 0
        ,centerY: 0
        ,srcChannel: 0
        ,dstChannel: 0
        
        // constructor
        ,init: function( srcImg, srcChannel, dstChannel, centerX, centerY ) {
            var self = this;
            self._srcImg = null;
            self.srcImg = null;
            self.srcChannel = srcChannel || R;
            self.dstChannel = dstChannel || R;
            self.centerX = centerX || 0;
            self.centerY = centerY || 0;
            if ( srcImg ) self.setSrc( srcImg );
        }
        
        // support worker serialize/unserialize interface
        ,path: FILTER.getPath( )
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    _srcImg: self._srcImg
                    ,centerX: self.centerX
                    ,centerY: self.centerY
                    ,srcChannel: self.srcChannel
                    ,dstChannel: self.dstChannel
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self._srcImg = params._srcImg;
                self.centerX = params.centerX;
                self.centerY = params.centerY;
                self.srcChannel = params.srcChannel;
                self.dstChannel = params.dstChannel;
            }
            return self;
        }
        
        ,setSrc: function( srcImg ) {
            var self = this;
            if ( srcImg )
            {
                self.srcImg = srcImg;
                self._srcImg = { data: srcImg.getData( ), width: srcImg.width, height: srcImg.height };
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
            if ( !self._isOn || !self._srcImg ) return im;
            
            var src = self._srcImg.data,
                i, l = im.length, l2 = src.length, 
                w2 = self._srcImg.width, 
                h2 = self._srcImg.height,
                sC = self.srcChannel, tC = self.dstChannel,
                x, x2, y, y2, off, xc, yc, 
                wm = Min(w,w2), hm = Min(h, h2),  
                cX = self.centerX||0, cY = self.centerY||0, 
                cX2 = (w2>>1), cY2 = (h2>>1)
            ;
            
            
            // make center relative
            cX = Floor(cX*(w-1)) - cX2;
            cY = Floor(cY*(h-1)) - cY2;
            
            i=0; x=0; y=0;
            for (i=0; i<l; i+=4, x++)
            {
                if (x>=w) { x=0; y++; }
                
                xc = x - cX; yc = y - cY;
                if (xc>=0 && xc<wm && yc>=0 && yc<hm)
                {
                    // copy channel
                    off = (xc + yc*w2)<<2;
                    im[i + tC] = src[off + sC];
                }
            }
            
            // return the new image data
            return im;
        }
    });
    
}(FILTER);