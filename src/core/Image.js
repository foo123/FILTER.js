/**
*
* Image Canvas Class
* @package FILTER.js
*
* NOTE: it won't work locally (at least with Firefox), only with server
**/
(function(FILTER){
    
    /**
     * JavaScript implementation of common blending modes, based on
     * http://stackoverflow.com/questions/5919663/how-does-photoshop-blend-two-images-together
     **/
    var blendModes;
    blendModes = {
        normal: function(a, b) { return a; },

        lighten: function(a, b) { return (b > a) ? b : a; },

        darken: function(a, b) { return (b > a) ? a : b; },

        multiply: function(a, b) { return (a * b * 0.003921568627451); },

        average: function(a, b) { return 0.5*(a + b); },

        add: function(a, b) { return Math.min(255, a + b); },

        substract: function(a, b) {  return (a + b < 255) ? 0 : a + b - 255; },

        difference: function(a, b) { return Math.abs(a - b); },

        negation: function(a, b) { return 255 - Math.abs(255 - a - b); },

        screen: function(a, b) { return 255 - (((255 - a) * (255 - b)) >> 8); },

        exclusion: function(a, b) { return a + b - 2 * a * b * 0.003921568627451; },

        overlay: function(a, b) { return b < 128 ? (2 * a * b * 0.003921568627451) : (255 - 2 * (255 - a) * (255 - b) * 0.003921568627451); },

        softLight: function(a, b) { return b < 128 ? (2 * ((a >> 1) + 64)) * (b * 0.003921568627451) : 255 - (2 * (255 - (( a >> 1) + 64)) * (255 - b) * 0.003921568627451); },

        // reverse of overlay
        hardLight: function(b, a) { return b < 128 ? (2 * a * b * 0.003921568627451) : (255 - 2 * (255 - a) * (255 - b) * 0.003921568627451); },

        colorDodge: function(a, b) { return b == 255 ? b : Math.min(255, ((a << 8 ) / (255 - b))); },

        colorBurn: function(a, b) { return b == 0 ? b : Math.max(0, (255 - ((255 - a) << 8 ) / b)); },

        linearDodge: blendModes.add,

        linearBurn: blendModes.substract,

        linearLight: function(a, b) { return b < 128 ? blendModes.linearBurn(a, 2 * b) : blendModes.linearDodge(a, (2 * (b - 128))); },

        vividLight: function(a, b) { return b < 128 ? blendModes.colorBurn(a, 2 * b) : blendModes.colorDodge(a, (2 * (b - 128))); },

        pinLight: function(a, b) { return b < 128 ? blendModes.darken(a, 2 * b) : blendModes.lighten(a, (2 * (b - 128))); },

        hardMix: function(a, b) { return blendModes.vividLight(a, b) < 128 ? 0 : 255; },

        reflect: function(a, b) { return b == 255 ? b : Math.min(255, (a * a / (255 - b))); },

        // reverse of reflect
        glow: function(b, a) { return b == 255 ? b : Math.min(255, (a * a / (255 - b))); },

        phoenix: function(a, b) { return Math.min(a, b) - Math.max(a, b) + 255; }
    };
    
    FILTER.blendModes=blendModes;
    
    //
    // Image Class
    //
    FILTER.Image=function(img, callback)
    {
        this.width=0;
        this.height=0;
        this.type='undefined';
        this.image=null;
        this.canvasElement=null;
        this.context=null;
        this.canvasElement=document.createElement('canvas');
        this.canvasElement.width=0;
        this.canvasElement.height=0;
        this.context=this.canvasElement.getContext('2d');
        this.setImage(img,callback);
    };
    
    FILTER.Image.prototype={
    
        constructor : FILTER.Image,
        
        blend : function(image, mode, amount, startX, startY) {
            if (typeof mode == 'undefined') mode='normal';
            if (typeof amount == 'undefined') amount=1;
            if (amount>1) amount=1;
            if (amount<0) amount=0;
            if (typeof startX == 'undefined')  startX=0;
            if (typeof startY == 'undefined')  startY=0;
            var sx=0,sy=0;
            if (startX<0)
            {
                sx=-startX;
                startX=0;
            }
            if (startY<0)
            {
                sy=-startY;
                startY=0;
            }
            if (startX>=this.width || startY>=this.height)
            {
                return;
            }
            
            var blendingMode = blendModes[mode];
            if (blendingMode==undefined || blendingMode==null) return this;
            
            var width =  Math.min(this.width, image.width-sx);
            var height = Math.min(this.height, image.height-sy);
            
            var imageData1 = this.context.getImageData(startX,startY,width,height);
            var imageData2 = image.context.getImageData(sx, sy, width, height);
            

            /** @type Array */
            var pixels1 = imageData1.data;
            /** @type Array */
            var pixels2 = imageData2.data;

            var r, g, b, oR, oG, oB, invamount = 1 - amount;
            
            var len=pixels2.length;
            
            // blend images
            for (var i = 0; i < len; i += 4) {
                oR = pixels1[i];
                oG = pixels1[i + 1];
                oB = pixels1[i + 2];

                // calculate blended color
                r = blendingMode(pixels2[i], oR);
                g = blendingMode(pixels2[i + 1], oG);
                b = blendingMode(pixels2[i + 2], oB);

                // amount compositing
                pixels1[i] =     r * amount + oR * invamount;
                pixels1[i + 1] = g * amount + oG * invamount;
                pixels1[i + 2] = b * amount + oB * invamount;
            }
            this.context.putImageData(imageData1, startX, startY);
            return this;
        },
        
        clone : function(withimage) {
            if (typeof withimage == 'undefined') withimage=false;
            if (withimage && this.image && this.image.src)  return new FILTER.Image(this.image.src);
            else  return new FILTER.Image(this.canvasElement);
        },
        
        createImageData : function(w,h) {
            this.width=w;
            this.height=h;
            this.canvasElement.width=this.width;
            this.canvasElement.height=this.height;
            this.context=this.canvasElement.getContext('2d');
            return this.context.createImageData(w,h);
        },
        
        getPixelData : function() {
            return this.context.getImageData(0,0,this.width,this.height);
        },
        
        setPixelData : function(data) {
            this.context.putImageData(data,0,0); 
            return this;
        },
        
        setWidth : function(w) {
            this.width=w;
            this.canvasElement.width=this.width;
            this.context=this.canvasElement.getContext('2d');
            return this;
        },
        
        setHeight : function(h) {
            this.height=h;
            this.canvasElement.height=this.height;
            this.context=this.canvasElement.getContext('2d');
            return this;
        },
        
        setImage : function(img,callback) {
            if (typeof img=='undefined' || img==null) return;
            var thiss=this;
            if (img instanceof Image || img instanceof HTMLCanvasElement || img instanceof HTMLVideoElement)
            {
                this.image=img;
                this.width=img.width;
                this.height=img.height;
                //this.canvasElement=document.createElement('canvas');
                this.canvasElement.width=this.width;
                this.canvasElement.height=this.height;
                this.context=this.canvasElement.getContext('2d');
                this.context.drawImage(this.image,0,0);
                if (img instanceof Image) this.type='image';
                if (img instanceof HTMLCanvasElement)  this.type='canvas';
                if (img instanceof HTMLVideoElement) this.type='video';
            }
            else // url string
            {
                this.image=new Image();
                //this.canvasElement=document.createElement('canvas');
                this.type='image-url';
                this.image.onload=function(){
                    thiss.width=thiss.image.width;
                    thiss.height=thiss.image.height;
                    //thiss.canvasElement=document.createElement('canvas');
                    thiss.canvasElement.width=thiss.width;
                    thiss.canvasElement.height=thiss.height;
                    thiss.context=thiss.canvasElement.getContext('2d');
                    thiss.context.drawImage(thiss.image,0,0);
                    if (typeof callback != 'undefined') callback.call(thiss);
                };
                this.image.src=img; // load it
            }
            this.image.crossOrigin = '';
            return this;
        }
    };
    
})(FILTER);