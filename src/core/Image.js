/**
*
* Image Canvas Class
* @package FILTER.js
*
* NOTE: it won't work locally (at least with Firefox), only with server
**/
!function(FILTER, undef){
    
    @@USE_STRICT@@
    
    var devicePixelRatio = FILTER.devicePixelRatio,
        IMG = FILTER.ImArray, A32F = FILTER.Array32F,
        createCanvas = FILTER.createCanvas,
        notSupportTyped = FILTER._notSupportTypedArrays,
        Min = Math.min, Floor = Math.floor
    ;
    
    /**
     * JavaScript implementation of common blending modes, based on
     * http://stackoverflow.com/questions/5919663/how-does-photoshop-blend-two-images-together
     **/
    var blendModes = FILTER.blendModes = {
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
    
    var DATA = 1, SEL = 2, HIST = 4, SAT = 8;
    
    //
    //
    // Image (Proxy) Class
    var FImage = FILTER.Image = FILTER.Class({
        name: "Image"
        
        ,constructor: function( img, callback ) {
            this.width = 0;   
            this.height = 0;
            this.context = null;
            this.selection = null;
            this.imageData = null;
            this.imageDataSel = null;
            this.domElement = this.canvasElement = createCanvas(this.width, this.height);
            this.context = this.canvasElement.getContext('2d');
            this._tmpCanvas = null;
            this.webgl = null;
            this._histogram = null;
            this._integral = null;
            // lazy
            this._needsRefresh = 0;
            if ( img ) this.setImage( img, callback );
        }
        
        // properties
        ,width: 0
        ,height: 0
        ,canvasElement: null
        ,domElement: null
        ,context: null
        ,selection: null
        ,imageData: null
        ,imageDataSel: null
        ,webgl: null
        ,_histogram: null
        ,_integral: null
        ,_needsRefresh: 0
        ,_tmpCanvas: null
        
        ,select: function( x1, y1, x2, y2 ) {
            this.selection = [
                (undef===x1) ? 0 : x1,
                (undef===y1) ? 0 : y1,
                (undef===x2) ? 1 : x2,
                (undef===y2) ? 1 : y2
            ];
            this._needsRefresh |= SEL;
            return this;
        }
        
        ,deselect: function( ) {
            this.selection = null;
            this.imageDataSel = null;
            this._needsRefresh &= ~SEL;
            return this;
        }
        
        ,setWidth:  function( w ) {
            this._setWidth(w);
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,setHeight: function( h ) {
            this._setHeight(h);
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,setDimensions: function( w, h ) {
            this._setDimensions(w, h);
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,setImage: function( img, callback ) {
            if (!img) return this;
            
            var self = this, image, ctx, w, h;
            
            if (img instanceof Image || img instanceof HTMLCanvasElement || img instanceof HTMLVideoElement)
            {
                image = img;
                w = (image instanceof HTMLVideoElement) ? image.videoWidth : image.width;
                h = (image instanceof HTMLVideoElement) ? image.videoHeight : image.height;
                ctx = self.context = self._setDimensions(w, h).canvasElement.getContext('2d');
                ctx.drawImage(image, 0, 0);
                self._needsRefresh |= DATA | HIST | SAT;
                if (self.selection) self._needsRefresh |= SEL;
                self.webgl = (FILTER.useWebGL) ? new FILTER.WebGL(self.canvasElement) : null;
            }
            else // url string
            {
                image = new Image();
                image.onload = function(){
                    w = image.width;
                    h = image.height;
                    ctx = self.context = self._setDimensions(w, h).canvasElement.getContext('2d');
                    ctx.drawImage(image, 0, 0);
                    self._needsRefresh |= DATA | HIST | SAT;
                    if (self.selection) self._needsRefresh |= SEL;
                    self.webgl = (FILTER.useWebGL) ? new FILTER.WebGL(self.canvasElement) : null;
                    if (typeof callback != 'undefined') callback.call(self);
                };
                image.src = img; // load it
            }
            image.crossOrigin = '';
            return this;
        }
        
        ,getPixel: function( x, y ) {
            if (this._needsRefresh & DATA) this._refreshData();
            var off = ~~(y*this.width+x+0.5), im = this.imageData.data;
            return {
                r: im[off], 
                g: im[off+1], 
                b: im[off+2], 
                a: im[off+3]
            };
        }
        
        ,setPixel: function( x, y, r, g, b, a ) {
            var t = new IMG([r&255, g&255, b&255, a&255]);
            this.context.putImageData(t, x, y); 
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        // get direct data array
        ,getData: function( ) {
            if (this._needsRefresh & DATA) this._refreshData();
            // clone it
            return new IMG( this.imageData.data );
        }
        
        // get direct data array of selected part
        ,getSelectedData: function( ) {
            var sel;
            
            if (this.selection)  
            {
                if (this._needsRefresh & SEL) this._refreshDataSel();
                sel = this.imageDataSel;
            }
            else
            {
                if (this._needsRefresh & DATA) this._refreshData();
                sel = this.imageData;
            }
            
            // clone it
            return [new IMG( sel.data ), sel.width, sel.height];
        }
        
        // set direct data array
        ,setData: function(a/*, w, h*/) {
            if (this._needsRefresh & DATA) this._refreshData();
            this.imageData.data.set(a); // not supported in Opera, IE, Safari
            this.context.putImageData(this.imageData, 0, 0); 
            this._needsRefresh |= HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        // set direct data array of selected part
        ,setSelectedData: function(a/*, w, h*/) {
            if (this.selection /*this.imageDataSel*/)
            {
                var sel = this.selection, ow = this.width-1, oh = this.height-1,
                    xs = Floor(sel[0]*ow), ys = Floor(sel[1]*oh);
                if (this._needsRefresh & SEL) this._refreshDataSel();
                this.imageDataSel.data.set(a); // not supported in Opera, IE, Safari
                this.context.putImageData(this.imageDataSel, xs, ys); 
                this._needsRefresh |= DATA;
            }
            else
            {
                if (this._needsRefresh & DATA) this._refreshData();
                this.imageData.data.set(a); // not supported in Opera, IE, Safari
                this.context.putImageData(this.imageData, 0, 0); 
                if (this.selection) this._needsRefresh |= SEL;
            }
            this._needsRefresh |= HIST | SAT;
            return this;
        }
        
        // get the imageData object
        ,getPixelData: function( ) {
            if (this._needsRefresh & DATA) this._refreshData();
            return this.imageData;
        }
        
        // set the imageData object
        ,setPixelData: function( data ) {
            this.context.putImageData(data, 0, 0); 
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,createImageData: function( w, h ) {
            this.context = this._setDimensions(w, h).canvasElement.getContext('2d');
            this.context.createImageData(w, h);
            this._needsRefresh |= DATA;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        // fast copy another FILTER.Image
        ,copy: function( image ) {
            this.setData(image.getData());
            return this;
        }
        
        ,clone: function( ) {
            return new FImage(this.canvasElement);
        }
        
        ,scale: function( sx, sy ) {
            sx = sx||1; sy = sy||sx;
            if (1==sx && 1==sy) return this;
            // lazy
            this._tmpCanvas = this._tmpCanvas || this._getTmpCanvas();
            var ctx = this._tmpCanvas.getContext('2d');
            //ctx.save();
            ctx.scale(sx, sy);
            ctx.drawImage(this.canvasElement, 0, 0);
            this.width = ~~(sx*this.width+0.5);
            this.height = ~~(sy*this.height+0.5);
            this.canvasElement.style.width = this.width + 'px';
            this.canvasElement.style.height = this.height + 'px';
            this.canvasElement.width = this.width * devicePixelRatio;
            this.canvasElement.height = this.height * devicePixelRatio;
            this.context.drawImage(this._tmpCanvas, 0, 0);
            this._tmpCanvas.width = this.width;
            this._tmpCanvas.height = this.height;
            //ctx.restore();
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,flipHorizontal: function( ) {
            // lazy
            this._tmpCanvas = this._tmpCanvas || this._getTmpCanvas();
            var ctx = this._tmpCanvas.getContext('2d');
            ctx.translate(this.width, 0); 
            ctx.scale(-1, 1);
            ctx.drawImage(this.canvasElement, 0, 0);
            this.context.drawImage(this._tmpCanvas, 0, 0);
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,flipVertical: function( ) {
            // lazy
            this._tmpCanvas = this._tmpCanvas || this._getTmpCanvas();
            var ctx = this._tmpCanvas.getContext('2d');
            ctx.translate(0, this.height); 
            ctx.scale(1, -1);
            ctx.drawImage(this.canvasElement, 0, 0);
            this.context.drawImage(this._tmpCanvas, 0, 0);
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        // clear the image contents
        ,clear: function( ) {
            if (this.width && this.height)
            {
                var ctx = this.context;
                ctx.clearRect(0, 0, this.width, this.height);  
                this._needsRefresh |= DATA | HIST | SAT;
                if (this.selection) this._needsRefresh |= SEL;
            }
            return this;
        }
        
        // fill image region contents with a specific background color
        ,fill: function( color, x, y, w, h ) {
            if (!w && this.width && !h && this.height) return this;
            else if (w && !this.width && h && !this.height)
            {
                // create the image data if needed
                this.context = this._setDimensions(w, h).canvasElement.getContext('2d');
                this.context.createImageData(w, h);
            }
            color = color||0; 
            x = x||0; y = y||0; 
            w = w||this.width; h = h||this.height;
            var ctx = this.context;
            //ctx.save();
            ctx.fillStyle = color;  
            ctx.fillRect(x, y, w, h);
            //ctx.restore();
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,draw: function( drawable, x, y, blendMode ) {
            // todo
            return this;
        }
        
        // blend with another image using various blend modes
        ,blend: function( image, mode, amount, startX, startY ) {
            if (typeof mode == 'undefined') mode='normal';
            if (typeof amount == 'undefined') amount=1;
            if (amount>1) amount=1; else if (amount<0) amount=0;
            if (typeof startX == 'undefined')  startX=0;
            if (typeof startY == 'undefined')  startY=0;
            
            var sx=0,sy=0, ctx=this.context;
            
            if (startX<0) {  sx=-startX;  startX=0;  }
            if (startY<0)  { sy=-startY;  startY=0;  }
            
            if (startX>=this.width || startY>=this.height)   return this;
            
            var blendingMode = blendModes[mode] || null;
            if (!blendingMode) return this;
            
            var 
                width = Min(this.width, image.width-sx), height = Min(this.height, image.height-sy),
                imageData1 = this.context.getImageData(startX, startY, width, height),
                imageData2 = image.context.getImageData(sx, sy, width, height),
                /** @type Array */
                pixels1 = imageData1.data,
                /** @type Array */
                pixels2 = imageData2.data,
                r, g, b, oR, oG, oB, invamount = 1 - amount,
                len = pixels2.length, i
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
            this._needsRefresh |= DATA | HIST | SAT;
            if (this.selection) this._needsRefresh |= SEL;
            return this;
        }
        
        ,integral: function( ) {
            if (this._needsRefresh & SAT) this._computeIntegral();
            return this._integral;
        }
        
        ,histogram: function( ) {
            if (this._needsRefresh & HIST) this._computeHistogram();
            return this._histogram;
        }
        
        ,toString: function( ) {
            return "[" + "FILTER Image: " + this.name + "]";
        }
        
        // auxilliary methods
        ,_getTmpCanvas: function( ) {
            var cnv = createCanvas(this.width, this.height);
            cnv.width = this.width;
            cnv.height = this.height;
            return cnv;
        }
        
        ,_setDimensions: function( w, h ) {
            this.canvasElement.style.width = w + 'px';
            this.canvasElement.width = this.width = w * devicePixelRatio;
            this.canvasElement.style.height = h + 'px';
            this.canvasElement.height = this.height = h * devicePixelRatio;
            if (this._tmpCanvas)
            {
                this._tmpCanvas.style.width = this.canvasElement.style.width;
                this._tmpCanvas.width = this.canvasElement.width;
                this._tmpCanvas.style.height = this.canvasElement.style.height;
                this._tmpCanvas.height = this.canvasElement.height;
            }
            return this;
        }
        
        ,_setWidth: function( w ) {
            this.canvasElement.style.width = w + 'px';
            this.canvasElement.width = this.width = w * devicePixelRatio;
            if (this._tmpCanvas)
            {
                this._tmpCanvas.style.width = this.canvasElement.style.width;
                this._tmpCanvas.width = this.canvasElement.width;
            }
            return this;
        }
        
        ,_setHeight: function( h ) {
            this.canvasElement.style.height = h + 'px';
            this.canvasElement.height = this.height = h * devicePixelRatio;
            if (this._tmpCanvas)
            {
                this._tmpCanvas.style.height = this.canvasElement.style.height;
                this._tmpCanvas.height = this.canvasElement.height;
            }
            return this;
        }
        
        // compute integral image (sum of columns)
        ,_computeIntegral: function( ) {
            var w = this.width, h = this.height, rowLen = w<<2,
                integralR, integralG, integralB, colR, colG, colB,
                im = this.getPixelData().data, imLen = im.length, count = (imLen>>2), i, j, x
            ;
            // compute integral of image in one pass
            integralR = new A32F(count); integralG = new A32F(count); integralB = new A32F(count);
            // first row
            j=0; i=0; colR=colG=colB=0;
            for (x=0; x<w; x++, i+=4, j++)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integralR[j]=colR; integralG[j]=colG; integralB[j]=colB;
            }
            // other rows
            i=rowLen; x=0; j=0; colR=colG=colB=0;
            for (i=rowLen; i<imLen; i+=4, j++, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=0; }
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integralR[j+w]=integralR[j]+colR; integralG[j+w]=integralG[j]+colG; integralB[j+w]=integralB[j]+colB;
            }
            this._integral = [integralR, integralG, integralB];
            this._needsRefresh &= ~SAT;
            return this;
        }
        
        ,_computeHistogram: function( ) {
            var im = this.getPixelData().data, l = im.length,
                maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
                cdfR, cdfG, cdfB, r,g,b,
                accumR, accumG, accumB,
                i, n=1.0/(l>>2)
            ;
            
            // initialize the arrays
            cdfR=new A32F(256); cdfG=new A32F(256); cdfB=new A32F(256);
            for (i=0; i<256; i+=4) 
            { 
                // partial loop unrolling
                cdfR[i]=0; cdfG[i]=0; cdfB[i]=0;
                cdfR[i+1]=0; cdfG[i+1]=0; cdfB[i+1]=0;
                cdfR[i+2]=0; cdfG[i+2]=0; cdfB[i+2]=0;
                cdfR[i+3]=0; cdfG[i+3]=0; cdfB[i+3]=0;
            }
            
            // compute pdf and maxima/minima
            for (i=0; i<l; i+=4)
            {
                r = im[i]; g = im[i+1]; b = im[i+2];
                cdfR[r] += n; cdfG[g] += n; cdfB[b] += n;
                
                if (r>maxR) maxR=r;
                else if (r<minR) minR=r;
                if (g>maxG) maxG=g;
                else if (g<minG) minG=g;
                if (b>maxB) maxB=b;
                else if (b<minB) minB=b;
            }
            
            // compute cdf
            accumR=accumG=accumB=0;
            for (i=0; i<256; i+=4) 
            { 
                // partial loop unrolling
                accumR += cdfR[i]; cdfR[i] = accumR;
                accumG += cdfG[i]; cdfG[i] = accumG;
                accumB += cdfB[i]; cdfB[i] = accumB;
                accumR += cdfR[i+1]; cdfR[i+1] = accumR;
                accumG += cdfG[i+1]; cdfG[i+1] = accumG;
                accumB += cdfB[i+1]; cdfB[i+1] = accumB;
                accumR += cdfR[i+2]; cdfR[i+2] = accumR;
                accumG += cdfG[i+2]; cdfG[i+2] = accumG;
                accumB += cdfB[i+2]; cdfB[i+2] = accumB;
                accumR += cdfR[i+3]; cdfR[i+3] = accumR;
                accumG += cdfG[i+3]; cdfG[i+3] = accumG;
                accumB += cdfB[i+3]; cdfB[i+3] = accumB;
            }
            
            this._histogram = [cdfR, cdfG, cdfB];
            this._needsRefresh &= ~HIST;
            return this;
        }
        
        ,_refreshData: function( ) {
            this.imageData = this.context.getImageData(0, 0, this.width, this.height);
            this._needsRefresh &= ~DATA;
            return this;
        }
        
        ,_refreshDataSel: function( ) {
            if (this.selection)
            {
                var sel = this.selection, ow = this.width-1, oh = this.height-1,
                    xs = Floor(sel[0]*ow), ys = Floor(sel[1]*oh), 
                    ws = Floor(sel[2]*ow)-xs+1, hs = Floor(sel[3]*oh)-ys+1
                ;
                this.imageDataSel = this.context.getImageData(xs, ys, ws, hs);
            }
            this._needsRefresh &= ~SEL;
            return this;
        }
    });

    //
    //
    // Scaled Image (Proxy) Class
    var FSImage = FILTER.ScaledImage = FILTER.Class( FImage, {
        name: "ScaledImage"
        
        ,constructor: function( scalex, scaley, img, callback ) {
            this.scaleX = scalex || 1;
            this.scaleY = scaley || this.scaleX;
            this.$super('constructor', img, callback);
        }
        
        ,scaleX: 1
        ,scaleY: 1
        
        ,clone: function( ) {
            return new FSImage(this.scaleX, this.scaleY, this.canvasElement);
        }
        
        ,setScale: function( sx, sy ) {
            if (undef!==sx && null!==sx) this.scaleX = sx;
            if (undef===sy && undef!==sx && null!==sx) this.scaleY = sx;
            else if (null!==sy) this.scaleY = sy;
            return this;
        }
        
        ,setImage: function( img, callback ) {
            if (!img) return this;
            
            var self = this, image, ctx, w, h, sw, sh, sx = this.scaleX, sy = this.scaleY;
            
            if (img instanceof Image || img instanceof HTMLCanvasElement || img instanceof HTMLVideoElement)
            {
                image = img;
                w = (image instanceof HTMLVideoElement) ? image.videoWidth : image.width;
                h = (image instanceof HTMLVideoElement) ? image.videoHeight : image.height;
                sw = ~~(sx*w + 0.5);
                sh = ~~(sy*h + 0.5);
                ctx = self.context = self._setDimensions(sw, sh).canvasElement.getContext('2d');
                ctx.drawImage(image, 0, 0, w, h, 0, 0, sw, sh);
                self._needsRefresh |= DATA | HIST | SAT;
                if (self.selection) self._needsRefresh |= SEL;
                self.webgl = (FILTER.useWebGL) ? new FILTER.WebGL(self.canvasElement) : null;
            }
            else // url string
            {
                image = new Image();
                image.onload = function(){
                    w = image.width;
                    h = image.height;
                    sw = ~~(sx*w + 0.5);
                    sh = ~~(sy*h + 0.5);
                    ctx = self.context = self._setDimensions(w, h).canvasElement.getContext('2d');
                    ctx.drawImage(image, 0, 0, w, h, 0, 0, sw, sh);
                    self._needsRefresh |= DATA | HIST | SAT;
                    if (self.selection) self._needsRefresh |= SEL;
                    self.webgl = (FILTER.useWebGL) ? new FILTER.WebGL(self.canvasElement) : null;
                    if (typeof callback != 'undefined') callback.call(self);
                };
                image.src = img; // load it
            }
            image.crossOrigin = '';
            return this;
        }
    });
    
}(FILTER);