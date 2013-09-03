/**
*
* Table Lookup Filter
*
* Changes target image colors according to color lookup tables for each channel
*
* @param tableR Optional (a lookup table of 256 color values for red channel)
* @param tableG Optional (a lookup table of 256 color values for green channel)
* @param tableB Optional (a lookup table of 256 color values for blue channel)
* @package FILTER.js
*
**/
(function(FILTER){
    
    var Power=Math.pow, nF=1/255;
    
    function eye()
    {
        var t=new FILTER.ImArray(256), i=0;
        while (i<256) { t[i]=i; i++; }
        return t;
    }
    
    function clone(t)
    {
        if (t) return new FILTER.ImArray(t);
        return null;
    }
    
    FILTER.TableLookupFilter=function(tableR, tableG, tableB)
    {
        this.tableR=tableR || null;
        this.tableG=tableG || clone(this.tableR);
        this.tableB=tableB || clone(this.tableG);
    };

    FILTER.TableLookupFilter.prototype={
    
        // parameters
        tableR : null,
        tableG : null,
        tableB : null,
        
        thresholds : function(thresholds) {
            // assume thresholds are given in pointwise scheme as pointcuts
            // not in cumulative scheme
            // [ 0.5 ] => [0, 1]
            // [ 0.3, 0.3, 0.3 ] => [0, 0.3, 0.6, 1]
            if (!thresholds.length) thresholds=[thresholds];
            /*
            // sort them into ascending order
            thresholds.sort();
            thresholds.shift(0);
            */
            var tL=thresholds.length, numLevels=tL+1, 
                t=new FILTER.ImArray(256), q=new FILTER.ImArray(numLevels), 
                i, j, nL=255/(numLevels-1)
            ;
            i=0; while (i<numLevels) { q[i] = ~~(nL * i); i++; }
            thresholds[0]=~~(255*thresholds[0]);
            i=1; while (i<tL) { thresholds[i]=thresholds[i-1] + ~~(255*thresholds[i]); i++; }
            /*q[0]=0;
            i=1; while (i<numLevels-1) { thresholds[i-1]=~~(255*thresholds[i-1]); q[i] = q[i-1] + thresholds[i-1]; i++; }
            q[numLevels-1]=255;*/
            //i=0; while (i<numLevels) { q[i] = ~~(255*thresholds[i]); i++; }
            i=0; 
            while (i<256) 
            { 
                // the non-linear mapping is here
                j=0; while (j<tL && i>thresholds[j]) j++;
                t[ i ] = q[ j ]; i++; 
            }
            return this.concat(t);
        },
        
        threshold : function(threshold) {
            threshold=threshold || 0.5;
            return this.thresholds([threshold]);
        },
        
        quantize : function(numLevels) {
            if (typeof numLevels == 'undefined') numLevels=64;
            if (numLevels<2) numLevels=2;
            /*var n=~~(255/numLevels), qL=0, t=new FILTER.Array8U(256), i=0;
            while (i<256) { if (0==i%n) qL+=n; t[i]=qL; i++; }
            return this.set(t, t, t);*/
            var t=new FILTER.ImArray(256), q=new FILTER.ImArray(numLevels), i, nL=255/(numLevels-1), nR=numLevels/256;
            i=0; while (i<numLevels) { q[i] = ~~(nL * i); i++; }
            i=0; while (i<256) { t[i] = q[ ~~(nR * i) ]; i++; }
            return this.concat(t);
        },
        
        // aliases
        levels : function(numLevels) {
            return this.quantize(numLevels);
        },
        
        posterize : function(numLevels) {
            return this.quantize(numLevels);
        },
        
        binarize : function() {
            return this.quantize(2);
        },
        
        solarize : function(threshold) {
            if (typeof threshold == 'undefined') threshold=0.5;
            var i=0, t=new FILTER.ImArray(256);
            //var q, c, n=2/255;
            //i=0; while (i<256) { q=n*i; c=(q>threshold) ? ~~(255-255*q) : ~~(255*q-255); t[i]=c;  i++; }
            threshold=~~(threshold*256)-1; 
            i=0; while (i<256) { t[i]=(i>threshold) ? 255-(i<<1) : (i<<1)-255; i++; }
            return this.concat(t);
        },
        
        invert : function() {
            var i=0, t=new FILTER.ImArray(256);
            i=0; while (i<256) { t[i]=255-i; i++; }
            return this.concat(t);
        },
        
        gammaCorrection : function(gammaR, gammaG, gammaB) {
            gammaR=gammaR || 1;
            gammaG=gammaG || gammaR;
            gammaB=gammaB || gammaG;
            
            // gamma correction uses inverse gamma
            gammaR=1.0/gammaR; gammaG=1.0/gammaG; gammaB=1.0/gammaB;
            
            var tR=new FILTER.ImArray(256), tG=new FILTER.ImArray(256), tB=new FILTER.ImArray(256), i=0;
            while (i<256) { tR[i]=~~(255*Power(nF*i, gammaR)); tG[i]=~~(255*Power(nF*i, gammaG)); tB[i]=~~(255*Power(nF*i, gammaB));  i++; }
            return this.concat(tR, tG, tB);
        },
        
        concat : function(_tR, _tG, _tB) {
            if (!_tR) return this;
            
            _tG=_tG || _tR; _tB=_tB || _tG;
            var 
                tR=this.tableR || eye(), tG=this.tableG || clone(tR), tB=this.tableB || clone(tG), 
                tR2=clone(tR), tG2=clone(tG), tB2=clone(tB), 
                i;
            
            // concat/compose the filter's tables, same as composing the filters
            i=0; while (i<256) { tR[i]=_tR[tR2[i]]; tG[i]=_tG[tG2[i]]; tB[i]=_tB[tB2[i]]; i++; }
            
            this.tableR=tR; this.tableG=tG; this.tableB=tB;
            return this;
        },
        
        // used for internal purposes
        _apply : function(im, w, h) {
            if (!this.tableR) return im;
            
            var l=im.length, i=0, r, g, b, tR=this.tableR, tG=this.tableG, tB=this.tableB;
            while (i<l)
            {
                r=im[i]; g=im[i+1]; b=im[i+2];
                im[i]=tR[r]; im[i+1]=tG[g]; im[i+2]=tB[b];
                i+=4;
            }
            return im;
        },
        
        apply : function(image) {
            if (!this.tableR) return image;
            return image.setData(this._apply(image.getData(), image.width, image.height));
        },
        
        reset : function() {
            this.tableR=null; this.tableG=null; this.tableB=null; return this;
        }
    };
    
})(FILTER);