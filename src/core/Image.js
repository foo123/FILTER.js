/**
*
* Image Canvas Class
* @package FILTER.js
*
* NOTE: it won't work locally (at least with Firefox), only with server
**/
(function(FILTER, undef){
    
    var 
        devicePixelRatio = FILTER.devicePixelRatio,
        IMG=FILTER.ImArray, A32F=FILTER.Array32F,
        createCanvas=FILTER.createCanvas,
        notSupportTyped=FILTER._notSupportTypedArrays,
        blendModes,  Min=Math.min
    ;
    
    /**
     * JavaScript implementation of common blending modes, based on
     * http://stackoverflow.com/questions/5919663/how-does-photoshop-blend-two-images-together
     **/
    blendModes = FILTER.blendModes = {
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
    // aliases
    blendModes.linearDodge = blendModes.add;
    blendModes.linearBurn = blendModes.substract;
    
    
    //
    //
    // Image (Proxy) Class
    var FImage = FILTER.Image = FILTER.Extends( Object,
    {
        
        name : "ImageProxy",
        
        constructor : function(img, callback) {
            this.width=0;   
            this.height=0;
            this.context=null;
            this.imageData=null;
            this.domElement=this.canvasElement=createCanvas(this.width, this.height);
            this.context=this.canvasElement.getContext('2d');
            this._tmpCanvas=createCanvas(this.width, this.height);
            this.webgl=null;
            this._histogram=null;
            this._integral=null;
            this._histogramRefresh=true;
            this._integralRefresh=true;
            this.setImage(img, callback);
        },
        
        // properties
        width : 0,
        height : 0,
        canvasElement : null,
        domElement : null,
        context: null,
        webgl: null,
        
        setWidth : function(w) {
            this.imageData=this._setDimensions(w).context.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        setHeight : function(h) {
            this.imageData=this._setDimensions(h).context.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        setDimensions : function(w, h) {
            this.imageData=this._setDimensions(w, h).context.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        setImage : function(img, callback) {
            if (typeof img=='undefined' || img==null) return this;
            var self=this, image, ctx, w, h;
            if (img instanceof Image || img instanceof HTMLCanvasElement || img instanceof HTMLVideoElement)
            {
                image=img;
                w=(image instanceof HTMLVideoElement) ? image.videoWidth : image.width;
                h=(image instanceof HTMLVideoElement) ? image.videoHeight : image.height;
                ctx=self.context=self._setDimensions(w, h).canvasElement.getContext('2d');
                ctx.drawImage(image, 0, 0);
                self.imageData=ctx.getImageData(0, 0, w, h);
                self._histogramRefresh=true;
                self._integralRefresh=true;
                self.webgl=(FILTER.useWebGL) ? new FILTER.WebGL(self.canvasElement) : null;
            }
            else // url string
            {
                image=new Image();
                image.onload=function(){
                    w=image.width;
                    h=image.height;
                    ctx=self.context=self._setDimensions(w, h).canvasElement.getContext('2d');
                    ctx.drawImage(image, 0, 0);
                    self.imageData=ctx.getImageData(0, 0, w, h);
                    self._histogramRefresh=true;
                    self._integralRefresh=true;
                    self.webgl=(FILTER.useWebGL) ? new FILTER.WebGL(self.canvasElement) : null;
                    if (typeof callback != 'undefined') callback.call(self);
                };
                image.src=img; // load it
            }
            image.crossOrigin = '';
            return this;
        },
        
        getPixel : function(x, y) {
            var off=~~(y*this.width+x+0.5), data=this.imageData.data;
            return {
                r: data[off], 
                g: data[off+1], 
                b: data[off+2], 
                a: data[off+3]
            };
        },
        
        setPixel : function(x, y, r, g, b, a) {
            var t=new IMG([r&255, g&255, b&255, a&255]);
            this.context.putImageData(t, x, y); 
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        // get direct data array
        getData : function() {
            // clone it
            return new IMG(this.imageData.data);
        },
        
        // set direct data array
        setData : function(a) {
            /*if (notSupportTyped) this._setData(a);
            else*/ this.imageData.data.set(a); // not supported in Opera, IE, Safari
            this.context.putImageData(this.imageData, 0, 0); 
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        // get the imageData object
        getPixelData : function() {
            return this.imageData;
        },
        
        // set the imageData object
        setPixelData : function(data) {
            this.context.putImageData(data, 0, 0); 
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        createImageData : function(w, h) {
            this.context=this._setDimensions(w, h).canvasElement.getContext('2d');
            this.context.createImageData(w,h);
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            return this.imageData;
        },
        
        // fast copy another FILTER.Image
        copy : function(image) {
            this.setData(image.getData());
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            return this;
        },
        
        clone : function() {
            return new FImage(this.canvasElement);
        },
        
        scale : function(sx, sy) {
            sx=sx||1; sy=sy||sx;
            if (1==sx && 1==sy) return this;
            // lazy
            //this._tmpCanvas=this._tmpCanvas || createCanvas(this.width, this.height);
            var ctx=this._tmpCanvas.getContext('2d');
            //ctx.save();
            ctx.scale(sx, sy);
            ctx.drawImage(this.canvasElement, 0, 0);
            this.width=~~(sx*this.width+0.5);
            this.height=~~(sy*this.height+0.5);
            this.canvasElement.style.width=this.width + 'px';
            this.canvasElement.style.height=this.height + 'px';
            this.canvasElement.width=this.width * devicePixelRatio;
            this.canvasElement.height=this.height * devicePixelRatio;
            this.context.drawImage(this._tmpCanvas, 0, 0);
            this._tmpCanvas.width=this.width;
            this._tmpCanvas.height=this.height;
            //ctx.restore();
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        flipHorizontal : function() {
            // lazy
            //this._tmpCanvas=this._tmpCanvas || createCanvas(this.width, this.height);
            var ctx=this._tmpCanvas.getContext('2d');
            ctx.translate(this.width, 0); ctx.scale(-1, 1);
            ctx.drawImage(this.canvasElement, 0, 0);
            this.context.drawImage(this._tmpCanvas, 0, 0);
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        flipVertical : function() {
            // lazy
            //this._tmpCanvas=this._tmpCanvas || createCanvas(this.width, this.height);
            var ctx=this._tmpCanvas.getContext('2d');
            ctx.translate(0, this.height); ctx.scale(1, -1);
            ctx.drawImage(this.canvasElement, 0, 0);
            this.context.drawImage(this._tmpCanvas, 0, 0);
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        // clear the image contents
        clear: function() {
            if (this.width && this.height)
            {
                var ctx=this.context;
                ctx.clearRect(0, 0, this.width, this.height);  
                this.imageData=ctx.getImageData(0, 0, this.width, this.height);
            }
            return this;
        },
        
        // fill image region contents with a specific background color
        fill: function(color, x, y, w, h) {
            if (!w && this.width && !h && this.height) return this
            else if (w && !this.width && h && !this.height)
            {
                // create the image data if needed
                this.context=this._setDimensions(w, h).canvasElement.getContext('2d');
                this.context.createImageData(w, h);
                this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            }
            color=color||0; x=x||0; y=y||0; w=w||this.width; h=h||this.height;
            var ctx=this.context;
            //ctx.save();
            ctx.fillStyle = color;  ctx.fillRect(x, y, w, h);
            //ctx.restore();
            this.imageData=ctx.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        draw : function(drawable, x, y, blendMode) {
            // todo
            return this;
        },
        
        // blend with another image using various blend modes
        blend : function(image, mode, amount, startX, startY) {
            if (typeof mode == 'undefined') mode='normal';
            if (typeof amount == 'undefined') amount=1;
            if (amount>1) amount=1;
            else if (amount<0) amount=0;
            if (typeof startX == 'undefined')  startX=0;
            if (typeof startY == 'undefined')  startY=0;
            
            var sx=0,sy=0, ctx=this.context;
            
            if (startX<0) {  sx=-startX;  startX=0;  }
            if (startY<0)  { sy=-startY;  startY=0;  }
            
            if (startX>=this.width || startY>=this.height)   return this;
            
            var blendingMode = blendModes[mode];
            if (blendingMode==undefined || blendingMode==null) return this;
            
            var 
                width = Min(this.width, image.width-sx), height = Min(this.height, image.height-sy),
                imageData1 = this.context.getImageData(startX, startY, width, height),
                imageData2 = image.context.getImageData(sx, sy, width, height),
                /** @type Array */
                pixels1 = imageData1.data,
                /** @type Array */
                pixels2 = imageData2.data,
                r, g, b, oR, oG, oB, invamount = 1 - amount,
                len=pixels2.length, i
            ;

            // blend images
            for (i = 0; i < len; i += 4) 
            {
                oR = pixels1[i];  oG = pixels1[i + 1];  oB = pixels1[i + 2];

                // calculate blended color
                r = blendingMode(pixels2[i], oR);  g = blendingMode(pixels2[i + 1], oG);  b = blendingMode(pixels2[i + 2], oB);

                // amount compositing
                pixels1[i] = r * amount + oR * invamount;  pixels1[i + 1] = g * amount + oG * invamount;  pixels1[i + 2] = b * amount + oB * invamount;
            }
            ctx.putImageData(imageData1, startX, startY);
            this.imageData=ctx.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        integral : function() {
            if (this._integralRefresh) this._computeIntegral();
            return this._integral;
        },
        
        histogram : function() {
            if (this._histogramRefresh) this._computeHistogram();
            return this._histogram;
        },
        
        toString : function() {
            return "[" + "FILTER Image: " + this.name + "]";
        },
        
        // auxilliary methods
        /*_setData : function(a) {
            var data=this.imageData.data, l=a.length, i=0, t;
            while (i<l) { data[i]=a[i]; i++; }
        },*/
        
        _setDimensions : function(w, h) {
            this._tmpCanvas.style.width=this.canvasElement.style.width=w + 'px';
            this._tmpCanvas.width=this.canvasElement.width=this.width=w * devicePixelRatio;
            this._tmpCanvas.style.height=this.canvasElement.style.height=h + 'px';
            this._tmpCanvas.height=this.canvasElement.height=this.height=h * devicePixelRatio;
            return this;
        },
        
        _setWidth : function(w) {
            this._tmpCanvas.style.width=this.canvasElement.style.width=w + 'px';
            this._tmpCanvas.width=this.canvasElement.width=this.width=w * devicePixelRatio;
            return this;
        },
        
        _setHeight : function(h) {
            this._tmpCanvas.style.height=this.canvasElement.style.height=h + 'px';
            this._tmpCanvas.height=this.canvasElement.height=this.height=h * devicePixelRatio;
            return this;
        },
        
        // compute integral image (sum of columns)
        _computeIntegral : function() 
        {
            var w=this.width,h=this.height, count=w*h, rowLen=w<<2,
                integralR = new A32F(count), integralG = new A32F(count), integralB = new A32F(count),
                im=this.getPixelData().data, i, j, x, colR, colG, colB, pix
            ;
            // compute integral of image in one pass
            // first row
            i=0; j=0; x=0; colR=colG=colB=0;
            while (x<w)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integralR[j]=colR; integralG[j]=colG; integralB[j]=colB;
                i+=4; j++; x++;
            }
            // other rows
            i=rowLen; x=0; colR=colG=colB=0;
            while (i<imLen)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integralR[j]=integralR[j-w]+colR; integralG[j]=integralG[j-w]+colG; integralB[j]=integralB[j-w]+colB;
                i+=4; j++; x++; if (x>=w) { x=0; colR=colG=colB=0; }
            }
            this._integral=[integralR, integralG, integralB];
            this._integralRefresh=false;
        },
        
        _computeHistogram : function() {
            var im=this.getPixelData().data, i=0, l=im.length,
                r,g,b, //rangeR, rangeG, rangeB,
                maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
                pdfR=new A32F(256), pdfG=new A32F(256), pdfB=new A32F(256),
                //cdfR=new A32F(257), cdfG=new A32F(257), cdfB=new A32F(257),
                i, n=1.0/(l>>2)
                ;
            
            // initialize the arrays
            i=0; while (i<256) { pdfR[i]=0; pdfG[i]=0; pdfB[i]=0; /*cdfR[i]=0; cdfG[i]=0; cdfB[i]=0;*/ i++; }
            //cdfR[256]=0; cdfG[256]=0; cdfB[256]=0;
            
            // compute pdf and maxima/minima
            i=0;
            while (i<l)
            {
                r=im[i]; g=im[i+1]; b=im[i+2];
                pdfR[r]+=n; pdfG[g]+=n; pdfB[b]+=n;
                
                if (r>maxR) maxR=r;
                if (r<minR) minR=r;
                if (g>maxG) maxG=g;
                if (g<minG) minG=g;
                if (b>maxB) maxB=b;
                if (b<minB) minB=b;
                i+=4;
            }
            
            // compute cdf
            //i=0; while (i<256) { cdfR[i+1]=cdfR[i]+pdfR[i]; cdfG[i+1]=cdfG[i]+pdfG[i]; cdfB[i+1]=cdfB[i]+pdfB[i]; i++; }
            
            this._histogram=[pdfR, pdfG, pdfB];
            this._histogramRefresh=false;
        },
        
        _refresh : function() {
            this.context=this.canvasElement.getContext('2d');
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            return this;
        }
    });
    
})(FILTER);