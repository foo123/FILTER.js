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
        Min=Math.min,
        ImArray=FILTER.ImArray
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
    
    
    function  createCanvas(w, h)
    {
        var cnv=document.createElement('canvas');
        cnv.width=w||0; cnv.height=h||0;
        return cnv;
    }
    
    //
    //
    // Image Class
    FILTER.Image=function(img, callback)
    {
        this.width=0;
        this.height=0;
        this.context=null;
        this.imageData=null;
        this.domElement=this.canvasElement=createCanvas(this.width, this.height);
        this.context=this.canvasElement.getContext('2d');
        this._tmpCanvas=createCanvas(this.width, this.height);
        this._histogram=null;
        this._integral=null;
        this._histogramRefresh=true;
        this._integralRefresh=true;
        this.setImage(img, callback);
    };
    
    FILTER.Image.prototype={
    
        // properties
        width : 0,
        height : 0,
        canvasElement : null,
        domElement : null,
        
        clear: function() {
          this.context.clearRect(0, 0, this.width, this.height);  return this;
        },
        
        fill: function(color, x, y, w, h) {
            color=color||0; x=x||0; y=y||0; w=w||this.width; h=h||this.height;
            var ctx=this.context;
            //ctx.save();
            //ctx.lineWidth = 30;
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
            //ctx.restore();
            return this;
        },
        
        draw : function(drawable, x, y, blendMode) {
            // todo
            return this;
        },
        
        getPixel : function(x, y) {
            var off=~~(y*this.width+x+0.5);
            return {
                red: this.imageData.data[off], 
                green: this.imageData.data[off+1], 
                blue: this.imageData.data[off+2], 
                alpha: this.imageData.data[off+3]
            };
        },
        
        setPixel : function(x, y, r, g, b, a) {
            var t=new ImArray([r, g, b, a]);
            this.context.putImageData(t, x, y); 
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        getData : function() {
            // clone it
            return new ImArray(this.imageData.data);
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
            this.context.putImageData(data, 0, 0); 
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        setWidth : function(w) {
            this._tmpCanvas.width=this.canvasElement.width=this.width=w;
            this.context=this.canvasElement.getContext('2d');
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            this._histogramRefresh=true;
            this._integralRefresh=true;
            return this;
        },
        
        setHeight : function(h) {
            this._tmpCanvas.height=this.canvasElement.height=this.height=h;
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
                this.width=(img instanceof HTMLVideoElement) ? img.videoWidth : img.width;
                this.height=(img instanceof HTMLVideoElement) ? img.videoHeight : img.height;
                this._tmpCanvas.width=this.canvasElement.width=this.width;
                this._tmpCanvas.height=this.canvasElement.height=this.height;
                this.context=this.canvasElement.getContext('2d');
                this.context.drawImage(image, 0, 0);
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
                    thiss._tmpCanvas.width=thiss.canvasElement.width=thiss.width;
                    thiss._tmpCanvas.height=thiss.canvasElement.height=thiss.height;
                    thiss.context=thiss.canvasElement.getContext('2d');
                    thiss.context.drawImage(image, 0, 0);
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
            var w=this.width,h=this.height, count=w*h, 
                integralR = new FILTER.Array32U(count), integralG = new FILTER.Array32U(count), integralB = new FILTER.Array32U(count),
                im=this.getPixelData().data, i, j, k, ii, colR, colG, colB, pix
            ;
            // use one while loop instead of 2 for loops (arguably faster)
            i=0; j=0; k=0; colR=colG=colB=0;
            while (j<h)
            {
                ii=i+k;  pix=ii << 2;
                colR += im[pix]; colG += im[pix+1]; colB += im[pix+2];
                if (i>0) 
                { 
                    integralR[ii] = integralR[ii-1] + colR; 
                    integralG[ii] = integralG[ii-1] + colG; 
                    integralB[ii] = integralB[ii-1] + colB; 
                }
                else  
                {
                    integralR[ii] = colR;
                    integralG[ii] = colG;
                    integralB[ii] = colB;
                }
                
                i++; if (i>=w) { i=0; j++; k+=w; colR=colG=colB=0; }
            }
            this._integral=[integralR, integralG, integralB];
            this._integralRefresh=false;
        },
        
        histogram : function() {
            if (this._histogramRefresh) this._computeHistogram();
            return this._histogram;
        },
        
        _computeHistogram : function() {
            var im=this.getPixelData().data, i=0, l=im.length,
                r,g,b, //rangeR, rangeG, rangeB,
                maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
                pdfR=new FILTER.Array32F(256), pdfG=new FILTER.Array32F(256), pdfB=new FILTER.Array32F(256),
                //cdfR=new FILTER.Array32F(257), cdfG=new FILTER.Array32F(257), cdfB=new FILTER.Array32F(257),
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
        
        createImageData : function(w,h) {
            this._tmpCanvas.width=this.canvasElement.width=this.width=w;
            this._tmpCanvas.height=this.canvasElement.height=this.height=h;
            this.context=this.canvasElement.getContext('2d');
            this.context.createImageData(w,h);
            this.imageData=this.context.getImageData(0, 0, this.width, this.height);
            return this.imageData;
        },
        
        scale : function(sx, sy) {
            sx=sx||1; sy=sy||sx;
            // lazy
            //this._tmpCanvas=this._tmpCanvas || createCanvas(this.width, this.height);
            var ctx=this._tmpCanvas.getContext('2d');
            ctx.scale(sx, sy);
            ctx.drawImage(this.canvasElement, 0, 0);
            this.canvasElement.width=this.width=~~(sx*this.width+0.5);
            this.canvasElement.height=this.height=~~(sy*this.height+0.5);
            this.context.drawImage(this._tmpCanvas, 0, 0);
            this._tmpCanvas.width=this.width;
            this._tmpCanvas.height=this.height;
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
        }
    };
    
})(FILTER);