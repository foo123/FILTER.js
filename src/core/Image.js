/**
*
* Image Canvas Class
* @package FILTER.js
*
* NOTE: it won't work locally (at least with Firefox), only with server
**/
(function(FILTER){
    
    var 
        blendModes,
        Min=Math.min
    ;
    
    /**
     * JavaScript implementation of common blending modes, based on
     * http://stackoverflow.com/questions/5919663/how-does-photoshop-blend-two-images-together
     **/
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

        //linearDodge: blendModes.add,

        //linearBurn: blendModes.substract,

        linearLight: function(a, b) { return b < 128 ? blendModes.linearBurn(a, 2 * b) : blendModes.linearDodge(a, (2 * (b - 128))); },

        vividLight: function(a, b) { return b < 128 ? blendModes.colorBurn(a, 2 * b) : blendModes.colorDodge(a, (2 * (b - 128))); },

        pinLight: function(a, b) { return b < 128 ? blendModes.darken(a, 2 * b) : blendModes.lighten(a, (2 * (b - 128))); },

        hardMix: function(a, b) { return blendModes.vividLight(a, b) < 128 ? 0 : 255; },

        reflect: function(a, b) { return b == 255 ? b : Math.min(255, (a * a / (255 - b))); },

        // reverse of reflect
        glow: function(b, a) { return b == 255 ? b : Math.min(255, (a * a / (255 - b))); },

        phoenix: function(a, b) { return Math.min(a, b) - Math.max(a, b) + 255; }
    };
    blendModes.linearDodge= blendModes.add;
    blendModes.linearBurn= blendModes.substract;
    
    FILTER.blendModes=blendModes;
    
    //
    //
    // Image Class
    FILTER.Image=function(img, callback)
    {
        this.width=0;
        this.height=0;
        this.context=null;
        this.imageData=null;
        this.canvasElement=document.createElement('canvas');
        this.canvasElement.width=0;
        this.canvasElement.height=0;
        this.context=this.canvasElement.getContext('2d');
        this._histogram=null;
        this._integral=null;
        this._histogramRefresh=true;
        this._integralRefresh=true;
        this.setImage(img, callback);
    };
    
    FILTER.Image.prototype={
    
        getData : function() {
            // clone it
            return new FILTER.ImArray(this.imageData.data);
        },
        
        setData : function(a) {
            this.imageData.data.set(a);
            this.context.putImageData(this.imageData, 0, 0); 
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        getPixelData : function() {
            return this.imageData;
        },
        
        setPixelData : function(data) {
            this.context.putImageData(data,0,0); 
            this.imageData=this.context.getImageData(0,0,this.width,this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        setWidth : function(w) {
            this.width=w;
            this.canvasElement.width=this.width;
            this.context=this.canvasElement.getContext('2d');
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        setHeight : function(h) {
            this.height=h;
            this.canvasElement.height=this.height;
            this.context=this.canvasElement.getContext('2d');
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        setImage : function(img, callback) {
            if (typeof img=='undefined' || img==null) return this;
            var thiss=this, image;
            if (img instanceof Image || img instanceof HTMLCanvasElement || img instanceof HTMLVideoElement)
            {
                image=img;
                this.width=img.width;
                this.height=img.height;
                this.canvasElement.width=this.width;
                this.canvasElement.height=this.height;
                this.context=this.canvasElement.getContext('2d');
                this.context.drawImage(image,0,0);
                this.imageData=this.context.getImageData(0, 0, this.width, this.height);
                this._histogramRefresh=true;
                this._integralRefresh=true;
            }
            else // url string
            {
                image=new Image();
                image.onload=function(){
                    thiss.width=image.width;
                    thiss.height=image.height;
                    //thiss.canvasElement=document.createElement('canvas');
                    thiss.canvasElement.width=thiss.width;
                    thiss.canvasElement.height=thiss.height;
                    thiss.context=thiss.canvasElement.getContext('2d');
                    thiss.context.drawImage(image,0,0);
                    thiss.imageData=thiss.context.getImageData(0, 0, thiss.width, thiss.height);
                    thiss._histogramRefresh=true;
                    thiss._integralRefresh=true;
                    if (typeof callback != 'undefined') callback.call(thiss);
                };
                image.src=img; // load it
            }
            image.crossOrigin = '';
            return this;
        },
        
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
            
            var 
                width = Min(this.width, image.width-sx), height = Min(this.height, image.height-sy),
                imageData1 = this.context.getImageData(startX,startY,width,height),
                imageData2 = image.context.getImageData(sx, sy, width, height),
                /** @type Array */
                pixels1 = imageData1.data,
                /** @type Array */
                pixels2 = imageData2.data,
                r, g, b, oR, oG, oB, invamount = 1 - amount,
                len=pixels2.length, i
            ;

            
            
            // blend images
            for (i = 0; i < len; i += 4) {
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
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        _refresh : function() {
            this.context=this.canvasElement.getContext('2d');
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            return this;
        },
        
        clone : function() {
            return new FILTER.Image(this.canvasElement);
        },
        
        integral : function() {
            if (this._integralRefresh) this._computeIntegral();
            return this._integral;
        },
        
        // compute integral image (sum of columns)
        _computeIntegral : function() 
        {
            var w=this.width,h=this.height, count=w*h, integral = new FILTER.Array32U(count),
                im=this.getPixelData().data, i, j, k, col, pix, gray
            ;
            // use one while loop instead of 2 for loops (arguably faster)
            i=0; j=0; k=0; col=0;
            while (i<w)
            {
                ii=i+k;  pix=ii << 2;
                gray = ((4899 * im[pix] + 9617 * im[pix + 1] + 1868 * im[pix + 2]) + 8192) >>> 14;
                col += (gray&0xFF) >>> 0;
                if (i>0) integral[ii] = integral[ii-1] + col;
                else  integral[ii] = col;
                j++; k+=w;
                if (h==j) { i++; j=0; k=0; col=0; }
            }
            this._integral=integral;
            this._integralRefresh=false;
        },
        
        histogram : function() {
            if (this._histogramRefresh) this._computeHistogram();
            return this._histogram;
        },
        
        _computeHistogram : function() {
            var im=this.getPixelData().data, i=0, l=im.length,
                _histogramR=new FILTER.ImArray(256), 
                _histogramG=new FILTER.ImArray(256), 
                _histogramB=new FILTER.ImArray(256),
                r,g,b
            ;
            i=0; while (i<256) { _histogramR[i]=0; _histogramG[i]=0; _histogramB[i]=0; i++; }
            i=0;
            while (i<l)
            {
                r=im[i]; g=im[i+1]; b=im[i+2];
                _histogramR[r]++; _histogramG[g]++; _histogramB[b]++;
                i+=4;
            }
            this._histogram=[_histogramR, _histogramG, _histogramB];
            this._histogramRefresh=false;
        },
        
        createImageData : function(w,h) {
            this.width=w;
            this.height=h;
            this.canvasElement.width=this.width;
            this.canvasElement.height=this.height;
            this.context=this.canvasElement.getContext('2d');
            this.context.createImageData(w,h);
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            return this.imageData;
        },
        
        scale : function(sx, sy) {
            // todo
            return this;
        }
    };
    
})(FILTER);