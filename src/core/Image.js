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
        IMG = FILTER.ImArray, IMGcpy = FILTER.ImArrayCopy, A32F = FILTER.Array32F,
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
    
    // auxilliary (private) methods
    function _getTmpCanvas( scope ) 
    {
        var cnv = createCanvas(scope.width, scope.height);
        cnv.width = scope.width;
        cnv.height = scope.height;
        return cnv;
    }
    
    function _setDimensions( scope, w, h ) 
    {
        scope.canvasElement.style.width = w + 'px';
        scope.canvasElement.width = scope.width = w * devicePixelRatio;
        scope.canvasElement.style.height = h + 'px';
        scope.canvasElement.height = scope.height = h * devicePixelRatio;
        if (scope._tmpCanvas)
        {
            scope._tmpCanvas.style.width = scope.canvasElement.style.width;
            scope._tmpCanvas.width = scope.canvasElement.width;
            scope._tmpCanvas.style.height = scope.canvasElement.style.height;
            scope._tmpCanvas.height = scope.canvasElement.height;
        }
        return scope;
    }
    
    function _setWidth( scope, w ) 
    {
        scope.canvasElement.style.width = w + 'px';
        scope.canvasElement.width = scope.width = w * devicePixelRatio;
        if (scope._tmpCanvas)
        {
            scope._tmpCanvas.style.width = scope.canvasElement.style.width;
            scope._tmpCanvas.width = scope.canvasElement.width;
        }
        return scope;
    }
    
    function _setHeight( scope, h ) 
    {
        scope.canvasElement.style.height = h + 'px';
        scope.canvasElement.height = scope.height = h * devicePixelRatio;
        if (scope._tmpCanvas)
        {
            scope._tmpCanvas.style.height = scope.canvasElement.style.height;
            scope._tmpCanvas.height = scope.canvasElement.height;
        }
        return scope;
    }
    
    // compute integral image (sum of columns)
    function _computeIntegral( scope ) 
    {
        var w = scope.width, h = scope.height, rowLen = w<<2,
            integralR, integralG, integralB, colR, colG, colB,
            im = scope.getPixelData().data, imLen = im.length, count = (imLen>>2), i, j, x
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
        scope._integral = [integralR, integralG, integralB];
        scope._needsRefresh &= ~SAT;
        return scope;
    }
    
    function _computeHistogram( scope ) 
    {
        var im = scope.getPixelData().data, l = im.length,
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
        
        scope._histogram = [cdfR, cdfG, cdfB];
        scope._needsRefresh &= ~HIST;
        return scope;
    }
    
    function _refreshData( scope ) 
    {
        scope.imageData = scope.context.getImageData(0, 0, scope.width, scope.height);
        scope._needsRefresh &= ~DATA;
        return scope;
    }
    
    function _refreshDataSel( scope ) 
    {
        if (scope.selection)
        {
            var sel = scope.selection, ow = scope.width-1, oh = scope.height-1,
                xs = Floor(sel[0]*ow), ys = Floor(sel[1]*oh), 
                ws = Floor(sel[2]*ow)-xs+1, hs = Floor(sel[3]*oh)-ys+1
            ;
            scope.imageDataSel = scope.context.getImageData(xs, ys, ws, hs);
        }
        scope._needsRefresh &= ~SEL;
        return scope;
    }
        
    //
    //
    // Image (Proxy) Class
    var FilterImage = FILTER.Image = FILTER.Class({
        name: "Image"
        
        ,constructor: function( img, callback ) {
            var self = this;
            // factory-constructor pattern
            if ( img instanceof FilterImage ) return img;
            if ( !(self instanceof FilterImage) ) return new FilterImage(img, callback);
            self.width = 0;   
            self.height = 0;
            self.context = null;
            self.selection = null;
            self.imageData = null;
            self.imageDataSel = null;
            self.domElement = self.canvasElement = createCanvas(self.width, self.height);
            self.context = self.canvasElement.getContext('2d');
            self._tmpCanvas = null;
            self.webgl = null;
            self._histogram = null;
            self._integral = null;
            // lazy
            self._needsRefresh = 0;
            if ( img ) self.setImage( img, callback );
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
        
        ,dispose: function( ) {
            var self = this;
            self.width = null;   
            self.height = null;
            self.context = null;
            self.selection = null;
            self.imageData = null;
            self.imageDataSel = null;
            self.domElement = null;
            self.canvasElement = null;
            self.context = null;
            self._tmpCanvas = null;
            self.webgl = null;
            self._histogram = null;
            self._integral = null;
            self._needsRefresh = null;
            return self;
        }
        
        ,select: function( x1, y1, x2, y2 ) {
            var self = this, argslen = arguments.length;
            // default
            if ( argslen < 1 ) x1 = 0;
            if ( argslen < 2 ) y1 = 0;
            if ( argslen < 3 ) x2 = 1;
            if ( argslen < 4 ) y2 = 1;
            // clamp
            /*x1 = parseFloat(x1, 10);
            y1 = parseFloat(y1, 10);
            x2 = parseFloat(x2, 10);
            y2 = parseFloat(y2, 10);*/
            x1 = 0 > x1 ? 0 : (1 < x1 ? 1 : x1);
            y1 = 0 > y1 ? 0 : (1 < y1 ? 1 : y1);
            x2 = 0 > x2 ? 0 : (1 < x2 ? 1 : x2);
            y2 = 0 > y2 ? 0 : (1 < y2 ? 1 : y2);
            // select
            self.selection = [ x1, y1, x2, y2 ];
            self._needsRefresh |= SEL;
            return self;
        }
        
        ,deselect: function( ) {
            var self = this;
            self.selection = null;
            self.imageDataSel = null;
            self._needsRefresh &= ~SEL;
            return self;
        }
        
        // apply a filter (uses filter's own apply method)
        ,apply: function( filter, cb ) {
            filter.apply( this, this, cb || null );
            return this;
        }
        
        // apply2 a filter using another image as destination
        ,apply2: function( filter, destImg, cb ) {
            filter.apply( this, destImg, cb || null );
            return this;
        }
        
        ,setWidth:  function( w ) {
            var self = this;
            _setWidth(self, w);
            self._needsRefresh |= DATA | HIST | SAT;
            if (self.selection) self._needsRefresh |= SEL;
            return self;
        }
        
        ,setHeight: function( h ) {
            var self = this;
            _setHeight(self, h);
            self._needsRefresh |= DATA | HIST | SAT;
            if (self.selection) self._needsRefresh |= SEL;
            return self;
        }
        
        ,setDimensions: function( w, h ) {
            var self = this;
            _setDimensions(self, w, h);
            self._needsRefresh |= DATA | HIST | SAT;
            if (self.selection) self._needsRefresh |= SEL;
            return self;
        }
        
        ,setImage: function( img, callback ) {
            if ( !img ) return this;
            
            var self = this, image, ctx, w, h, 
                isVideo = img instanceof HTMLVideoElement,
                isCanvas = img instanceof HTMLCanvasElement,
                isImage = img instanceof Image,
                isString = "string" === typeof(img) || img instanceof String
            ;
            
            if ( isImage || isCanvas || isVideo )
            {
                image = img;
                if ( isVideo )
                {
                    w = image.videoWidth;
                    h = image.videoHeight;
                }
                else
                {
                    w = image.width;
                    h = image.height;
                }
                ctx = self.context = _setDimensions(self, w, h).canvasElement.getContext('2d');
                ctx.drawImage(image, 0, 0);
                self._needsRefresh |= DATA | HIST | SAT;
                if (self.selection) self._needsRefresh |= SEL;
                self.webgl = FILTER.useWebGL ? new FILTER.WebGL(self.canvasElement) : null;
                if ( callback ) callback.call( self );
            }
            else if ( isString ) // url string
            {
                image = new Image( );
                image.onerror = image.onload = function( ) {
                    if ( image.width && image.height )
                    {
                        w = image.width;
                        h = image.height;
                        ctx = self.context = _setDimensions(self, w, h).canvasElement.getContext('2d');
                        ctx.drawImage(image, 0, 0);
                        self._needsRefresh |= DATA | HIST | SAT;
                        if (self.selection) self._needsRefresh |= SEL;
                        self.webgl = (FILTER.useWebGL) ? new FILTER.WebGL(self.canvasElement) : null;
                    }
                    if ( callback ) callback.call( self );
                };
                image.crossOrigin = '';
                image.src = img; // load it
            }
            return self;
        }
        
        ,getPixel: function( x, y ) {
            var self = this;
            if (self._needsRefresh & DATA) _refreshData( self );
            var off = ~~(y*self.width+x+0.5), im = self.imageData.data;
            return {
                r: im[off], 
                g: im[off+1], 
                b: im[off+2], 
                a: im[off+3]
            };
        }
        
        ,setPixel: function( x, y, r, g, b, a ) {
            var self = this, t = new IMG([r&255, g&255, b&255, a&255]);
            self.context.putImageData(t, x, y); 
            self._needsRefresh |= DATA | HIST | SAT;
            if (self.selection) self._needsRefresh |= SEL;
            return self;
        }
        
        // get direct data array
        ,getData: function( ) {
            var self = this;
            if (self._needsRefresh & DATA) _refreshData( self );
            // clone it
            return new IMGcpy( self.imageData.data );
        }
        
        // get direct data array of selected part
        ,getSelectedData: function( ) {
            var self = this, sel;
            
            if (self.selection)  
            {
                if (self._needsRefresh & SEL) _refreshDataSel( self );
                sel = self.imageDataSel;
            }
            else
            {
                if (self._needsRefresh & DATA) _refreshData( self );
                sel = self.imageData;
            }
            
            // clone it
            return [new IMGcpy( sel.data ), sel.width, sel.height];
        }
        
        // set direct data array
        ,setData: function(a/*, w, h*/) {
            var self = this;
            if (self._needsRefresh & DATA) _refreshData( self );
            self.imageData.data.set(a); // not supported in Opera, IE, Safari
            self.context.putImageData(self.imageData, 0, 0); 
            self._needsRefresh |= HIST | SAT;
            if (self.selection) self._needsRefresh |= SEL;
            return self;
        }
        
        // set direct data array of selected part
        ,setSelectedData: function(a/*, w, h*/) {
            var self = this;
            if (self.selection /*this.imageDataSel*/)
            {
                var sel = self.selection, ow = self.width-1, oh = self.height-1,
                    xs = Floor(sel[0]*ow), ys = Floor(sel[1]*oh);
                if (self._needsRefresh & SEL) _refreshDataSel( self );
                self.imageDataSel.data.set(a); // not supported in Opera, IE, Safari
                self.context.putImageData(self.imageDataSel, xs, ys); 
                self._needsRefresh |= DATA;
            }
            else
            {
                if (self._needsRefresh & DATA) _refreshData( self );
                self.imageData.data.set(a); // not supported in Opera, IE, Safari
                self.context.putImageData(self.imageData, 0, 0); 
                if (self.selection) self._needsRefresh |= SEL;
            }
            self._needsRefresh |= HIST | SAT;
            return self;
        }
        
        // get the imageData object
        ,getPixelData: function( ) {
            if (this._needsRefresh & DATA) _refreshData( this );
            return this.imageData;
        }
        
        // set the imageData object
        ,setPixelData: function( data ) {
            var self = this;
            self.context.putImageData(data, 0, 0); 
            self._needsRefresh |= DATA | HIST | SAT;
            if (self.selection) self._needsRefresh |= SEL;
            return self;
        }
        
        ,createImageData: function( w, h ) {
            var self = this;
            self.context = _setDimensions(self, w, h).canvasElement.getContext('2d');
            self.context.createImageData(w, h);
            self._needsRefresh |= DATA;
            if (self.selection) self._needsRefresh |= SEL;
            return self;
        }
        
        // fast copy another FILTER.Image
        ,copy: function( image ) {
            this.setData(image.getData());
            return this;
        }
        
        ,clone: function( ) {
            return new FilterImage(this.canvasElement);
        }
        
        ,scale: function( sx, sy ) {
            var self = this;
            sx = sx||1; sy = sy||sx;
            if (1==sx && 1==sy) return self;
            // lazy
            self._tmpCanvas = self._tmpCanvas || _getTmpCanvas( self );
            var ctx = self._tmpCanvas.getContext('2d');
            //ctx.save();
            ctx.scale(sx, sy);
            ctx.drawImage(self.canvasElement, 0, 0);
            self.width = ~~(sx*self.width+0.5);
            self.height = ~~(sy*self.height+0.5);
            self.canvasElement.style.width = self.width + 'px';
            self.canvasElement.style.height = self.height + 'px';
            self.canvasElement.width = self.width * devicePixelRatio;
            self.canvasElement.height = self.height * devicePixelRatio;
            self.context.drawImage(self._tmpCanvas, 0, 0);
            self._tmpCanvas.width = self.width;
            self._tmpCanvas.height = self.height;
            //ctx.restore();
            self._needsRefresh |= DATA | HIST | SAT;
            if (self.selection) self._needsRefresh |= SEL;
            return self;
        }
        
        ,flipHorizontal: function( ) {
            var self = this;
            // lazy
            self._tmpCanvas = self._tmpCanvas || _getTmpCanvas( self );
            var ctx = self._tmpCanvas.getContext('2d');
            ctx.translate(self.width, 0); 
            ctx.scale(-1, 1);
            ctx.drawImage(self.canvasElement, 0, 0);
            self.context.drawImage(self._tmpCanvas, 0, 0);
            self._needsRefresh |= DATA | HIST | SAT;
            if (self.selection) self._needsRefresh |= SEL;
            return self;
        }
        
        ,flipVertical: function( ) {
            var self = this;
            // lazy
            self._tmpCanvas = self._tmpCanvas || _getTmpCanvas( self );
            var ctx = self._tmpCanvas.getContext('2d');
            ctx.translate(0, self.height); 
            ctx.scale(1, -1);
            ctx.drawImage(self.canvasElement, 0, 0);
            self.context.drawImage(self._tmpCanvas, 0, 0);
            self._needsRefresh |= DATA | HIST | SAT;
            if (self.selection) self._needsRefresh |= SEL;
            return self;
        }
        
        // clear the image contents
        ,clear: function( ) {
            var self = this;
            if (self.width && self.height)
            {
                var ctx = self.context;
                ctx.clearRect(0, 0, self.width, self.height);  
                self._needsRefresh |= DATA | HIST | SAT;
                if (self.selection) self._needsRefresh |= SEL;
            }
            return self;
        }
        
        // fill image region contents with a specific background color
        ,fill: function( color, x, y, w, h ) {
            var self = this;
            if (!w && self.width && !h && self.height) return self;
            else if (w && !self.width && h && !self.height)
            {
                // create the image data if needed
                self.context = _setDimensions(self, w, h).canvasElement.getContext('2d');
                self.context.createImageData(w, h);
            }
            color = color||0; 
            x = x||0; y = y||0; 
            w = w||self.width; h = h||self.height;
            var ctx = self.context;
            //ctx.save();
            ctx.fillStyle = color;  
            ctx.fillRect(x, y, w, h);
            //ctx.restore();
            self._needsRefresh |= DATA | HIST | SAT;
            if (self.selection) self._needsRefresh |= SEL;
            return self;
        }
        
        ,draw: function( drawable, x, y, blendMode ) {
            // todo
            return this;
        }
        
        // blend with another image using various blend modes
        ,blend: function( image, mode, amount, startX, startY ) {
            var self = this;
            if (typeof mode == 'undefined') mode='normal';
            if (typeof amount == 'undefined') amount=1;
            if (amount>1) amount=1; else if (amount<0) amount=0;
            if (typeof startX == 'undefined')  startX=0;
            if (typeof startY == 'undefined')  startY=0;
            
            var sx=0,sy=0, ctx=self.context;
            
            if (startX<0) {  sx=-startX;  startX=0;  }
            if (startY<0)  { sy=-startY;  startY=0;  }
            
            if (startX>=self.width || startY>=self.height) return self;
            
            var blendingMode = blendModes[mode] || null;
            if (!blendingMode) return self;
            
            var 
                width = Min(self.width, image.width-sx), height = Min(self.height, image.height-sy),
                imageData1 = self.context.getImageData(startX, startY, width, height),
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
            self._needsRefresh |= DATA | HIST | SAT;
            if (self.selection) self._needsRefresh |= SEL;
            return self;
        }
        
        ,integral: function( ) {
            if (this._needsRefresh & SAT) _computeIntegral( this );
            return this._integral;
        }
        
        ,histogram: function( ) {
            if (this._needsRefresh & HIST) _computeHistogram( this );
            return this._histogram;
        }
        
        ,toString: function( ) {
            return "[" + "FILTER Image: " + this.name + "]";
        }
    });

    //
    //
    // Scaled Image (Proxy) Class
    var FilterScaledImage = FILTER.ScaledImage = FILTER.Class( FilterImage, {
        name: "ScaledImage"
        
        ,constructor: function( scalex, scaley, img, callback ) {
            var self = this;
            // factory-constructor pattern
            if ( img instanceof FilterImage ) return img;
            if ( !(self instanceof FilterScaledImage) ) return new FilterScaledImage(scalex, scaley, img, callback);
            self.scaleX = scalex || 1;
            self.scaleY = scaley || self.scaleX;
            self.$super('constructor', img, callback);
        }
        
        ,scaleX: 1
        ,scaleY: 1
        
        ,dispose: function( ) {
            var self = this;
            self.scaleX = null;
            self.scaleY = null;
            self.$super('dispose');
            return self;
        }
        
        ,clone: function( ) {
            return new FilterScaledImage(this.scaleX, this.scaleY, this.canvasElement);
        }
        
        ,setScale: function( sx, sy ) {
            var self = this, argslen = arguments.length;
            if (argslen > 0 && null != sx) 
            {
                self.scaleX = sx;
                self.scaleY = sx;
            }
            if (argslen > 1 && null != sy) 
                self.scaleY = sy;
            return self;
        }
        
        ,setImage: function( img, callback ) {
            if ( !img ) return this;
            
            var self = this, image, ctx, w, h, 
                sw, sh, sx = self.scaleX, sy = self.scaleY,
                isVideo = img instanceof HTMLVideoElement,
                isCanvas = img instanceof HTMLCanvasElement,
                isImage = img instanceof Image,
                isString = "string" === typeof(img) || img instanceof String
            ;
            
            if ( isImage || isCanvas || isVideo )
            {
                image = img;
                if ( isVideo )
                {
                    w = image.videoWidth;
                    h = image.videoHeight;
                }
                else
                {
                    w = image.width;
                    h = image.height;
                }
                sw = ~~(sx*w + 0.5);
                sh = ~~(sy*h + 0.5);
                ctx = self.context = _setDimensions(self, sw, sh).canvasElement.getContext('2d');
                ctx.drawImage(image, 0, 0, w, h, 0, 0, sw, sh);
                self._needsRefresh |= DATA | HIST | SAT;
                if (self.selection) self._needsRefresh |= SEL;
                self.webgl = FILTER.useWebGL ? new FILTER.WebGL(self.canvasElement) : null;
                if ( callback ) callback.call( self );
            }
            else if ( isString ) // url string
            {
                image = new Image();
                image.onerror = image.onload = function( ) {
                    if ( image.width && image.height )
                    {
                        w = image.width;
                        h = image.height;
                        sw = ~~(sx*w + 0.5);
                        sh = ~~(sy*h + 0.5);
                        ctx = self.context = _setDimensions(self, w, h).canvasElement.getContext('2d');
                        ctx.drawImage(image, 0, 0, w, h, 0, 0, sw, sh);
                        self._needsRefresh |= DATA | HIST | SAT;
                        if (self.selection) self._needsRefresh |= SEL;
                        self.webgl = (FILTER.useWebGL) ? new FILTER.WebGL(self.canvasElement) : null;
                    }
                    if ( callback ) callback.call( self );
                };
                image.crossOrigin = '';
                image.src = img; // load it
            }
            return self;
        }
    });
    
}(FILTER);