/**
*
* Pixelate Plugin
* @package FILTER.js
*
**/
!function(FILTER){

    @@USE_STRICT@@
    
    var Sqrt=Math.sqrt,
        notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F;
    
    
    // a sample fast pixelate filter
    FILTER.PixelateFilter = FILTER.Create({
        name: "PixelateFilter"
        
        // parameters
        ,scale: 1
        
        // this is the filter constructor
        ,init: function( scale ) {
            var self = this;
            self.scale = scale || 1;
        }
        
        // support worker serialize/unserialize interface
        ,path: FILTER.getPath( )
        
        ,serialize: function( ) {
            var self = this;
            return {
                filter: self.name
                ,_isOn: !!self._isOn
                
                ,params: {
                    scale: self.scale
                }
            };
        }
        
        ,unserialize: function( json ) {
            var self = this, params;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
                
                params = json.params;
                
                self.scale = params.scale;
            }
            return self;
        }
        
        // this is the filter actual apply method routine
        ,apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            var self = this;
            if (!self._isOn || self.scale<=1) return im;
            if (self.scale>100) self.scale=100;
            
            var imLen = im.length, imArea = (imLen>>2),
                step, stepw, hstep, wstep, hstepw, wRem, hRem,
                inv_size, inv_size1, inv_size1w, inv_size1h, inv_size1hw, 
                inv_sizes, inv_sizew, inv_sizeh, inv_sizewh,
                integral, colR, colG, colB,
                rowLen = (w<<1) + w, imageIndicesX, imageIndicesY,
                i, j, x, y, yw, px, py, pyw, pi,
                xOff1, yOff1, xOff2, yOff2, 
                bx1, by1, bx2, by2, 
                p1, p2, p3, p4, r, g, b
            ;
            
            step = ~~(Sqrt(imArea)*self.scale*0.01);
            stepw = w*step; hstep = (h%step); wstep = (w%step); hstepw = (hstep-1)*w;
            inv_size1 = 1.0/(step*step); inv_size1w = 1.0/(wstep*step); inv_size1h = 1.0/(hstep*step); inv_size1hw = 1.0/(wstep*hstep);
            inv_sizes = inv_size1; inv_sizew = inv_size1w; inv_sizeh = inv_size1h; inv_sizewh = inv_size1hw;
            
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            imageIndicesX = step-1; imageIndicesY = (step-1)*w;
            bx1=0; bx2=w-1; by1=0; by2=imArea-w;
            
            // compute integral image in one pass
            integral = new A32F(imArea*3);
            // first row
            i=0; j=0; x=0; colR=colG=colB=0;
            for (x=0; x<w; x++, i+=4, j+=3)
            {
                colR += im[i]; colG += im[i+1]; colB += im[i+2];
                integral[j] = colR; integral[j+1] = colG; integral[j+2] = colB;
            }
            // other rows
            j=0; x=0; colR=colG=colB=0;
            for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=0; }
                colR += im[i]; colG += im[i+1]; colB += im[i+2];
                integral[j+rowLen] = integral[j] + colR; 
                integral[j+rowLen+1] = integral[j+1] + colG;  
                integral[j+rowLen+2] = integral[j+2] + colB;
            }
            
            // first block
            x=0; y=0; yw=0;
            // calculate the weighed sum of the source image pixels that
            // fall under the pixelate convolution matrix
            xOff1 = x; yOff1 = yw;  
            xOff2 = xOff1 + imageIndicesX; yOff2 = yOff1 + imageIndicesY;
            
            // fix borders
            xOff2 = (xOff2>bx2) ? bx2 : xOff2;
            yOff2 = (yOff2>by2) ? by2 : yOff2;
            
            // compute integral positions
            p1=(xOff1 + yOff1); p4=(xOff2+yOff2); p2=(xOff2 + yOff1); p3=(xOff1 + yOff2);
            p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
            
            // compute matrix sum of these elements
            // maybe using a gaussian average could be better (but more computational) ??
            inv_size = inv_sizes;
            r = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
            g = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
            b = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
            
            if (notSupportClamp)
            {   
                // clamp them manually
                r = (r<0) ? 0 : ((r>255) ? 255 : r);
                g = (g<0) ? 0 : ((g>255) ? 255 : g);
                b = (b<0) ? 0 : ((b>255) ? 255 : b);
            }
            r = ~~r;  g = ~~g;  b = ~~b; // alpha channel is not transformed
            
            // do direct pixelate convolution
            px=0; py=0; pyw=0;
            for (i=0; i<imLen; i+=4)
            {
                // output
                // replace the area equal to the given pixelate size
                // with the average color, computed in previous step
                pi = (px+x + pyw+yw)<<2;
                im[pi] = r;  im[pi+1] = g;  im[pi+2] = b; 
                
                // next pixel
                px++; if ( px+x >= w || px >= step ) { px=0; py++; pyw+=w; }
                
                // next block
                if (py+y >= h || py >= step)
                {
                    // update image coordinates
                    x+=step; if ( x>=w ) { x=0; y+=step; yw+=stepw; }
                    px=0; py=0; pyw=0;
                    
                    // calculate the weighed sum of the source image pixels that
                    // fall under the pixelate convolution matrix
                    xOff1 = x; yOff1 = yw;  
                    xOff2 = xOff1 + imageIndicesX; yOff2 = yOff1 + imageIndicesY;
                    
                    // fix borders
                    xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                    yOff2 = (yOff2>by2) ? by2 : yOff2;
                    
                    // compute integral positions
                    p1=(xOff1 + yOff1); p4=(xOff2+yOff2); p2=(xOff2 + yOff1); p3=(xOff1 + yOff2);
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                    
                    // get correct area size
                    wRem = (0==xOff2-xOff1-wstep+1);
                    hRem = (0==yOff2-yOff1-hstepw);
                    inv_size = (wRem && hRem) ? inv_sizewh : ((wRem) ? inv_sizew : ((hRem) ? inv_sizeh : inv_sizes));
                    
                    // compute matrix sum of these elements
                    r = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                    g = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                    b = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                    if (notSupportClamp)
                    {   
                        // clamp them manually
                        r = (r<0) ? 0 : ((r>255) ? 255 : r);
                        g = (g<0) ? 0 : ((g>255) ? 255 : g);
                        b = (b<0) ? 0 : ((b>255) ? 255 : b);
                    }
                    r = ~~r;  g = ~~g;  b = ~~b; // alpha channel is not transformed
                }
            }
            
            // return the pixelated image data
            return im;
        }
    });
    
}(FILTER);