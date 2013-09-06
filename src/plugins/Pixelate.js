/**
*
* Pixelate Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    var Sqrt=Math.sqrt;
    
    // a sample pixelate filter
    FILTER.PixelateFilter=FILTER.Create({
        // parameters
        scale: 1,
        
        // this is the filter constructor
        init: function(scale) {
            this.scale=scale || 1;
        },
        
        // this is the filter actual apply method routine
        apply: function(im, w, h) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            if (this.scale<=1) return im;
            if (this.scale>100) this.scale=100;
            
            var imLen=im.length, imArea=w*h, step=~~(Sqrt(imArea)*this.scale*0.01), 
                size=step*step, inv_size=1.0/size, step4=step<<2, stepw=w*step, size4=size<<2,
                integral=new FILTER.Array32F(imArea*3), colR, colG, colB,
                matRadiusX=step, matRadiusY=step, matHalfSideX=matRadiusX>>1, matHalfSideY=matRadiusY>>1, matArea=matRadiusX*matRadiusY,
                rowLen=(w<<1) + w, imageIndicesX, imageIndicesY,
                i, j, jend, x, ty, px, py, pi, pbx,
                xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4,
                r, g, b
                ;
            
        
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            imageIndicesX = matRadiusX-1; imageIndicesY = (matRadiusY-1)*w;
            bx1=0; bx2=w-1; by1=0; by2=imArea-w;
            
            // compute integral image in one pass
            // first row
            i=0; j=0; x=0; /*y=0;*/ colR=colG=colB=0;
            while (x<w)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                i+=4; j+=3; x++;
            }
            // other rows
            i=rowLen+w; j=rowLen; x=0; /*y=1;*/ colR=colG=colB=0;
            while (i<imLen)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j]=integral[j-rowLen]+colR; integral[j+1]=integral[j-rowLen+1]+colG;  integral[j+2]=integral[j-rowLen+2]+colB;
                i+=4; j+=3; x++; if (x>=w) { x=0; colR=colG=colB=0; }
            }
            
            // do direct pixelate convolution
            i=0; x=0; ty=0;
            while (i<imLen)
            {
                // calculate the weighed sum of the source image pixels that
                // fall under the pixelate convolution matrix
                xOff1=x; yOff1=ty;  xOff2=x + imageIndicesX; yOff2=ty + imageIndicesY;
                
                // fix borders
                if (xOff2>bx2) xOff2=bx2;
                if (yOff2>by2) yOff2=by2;
                
                // compute integral positions
                p1=(xOff1 + yOff1); p4=(xOff2+yOff2); p2=(xOff2 + yOff1); p3=(xOff1 + yOff2);
                p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                
                // compute matrix sum of these elements
                // maybe using a gaussian average could be better (but more computational) ??
                r = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                g = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                b = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                
                // output
                r = ~~r;  g = ~~g;  b = ~~b; // alpha channel is not transformed
                j=i; px=x; py=ty; pbx=x+step;
                jend=i+size4; if (jend>imLen) jend=imLen;
                while (j<jend) 
                { 
                    // replace the an area equal to the given pixelate size
                    // with the average color, computed in previous step
                    pi=(px + py)<<2;
                    im[pi] = r;  im[pi+1] = g;  im[pi+2] = b; 
                    j+=4; px++; if (px>=w || px>=pbx) { px=x; py+=w; }
                }
                
                // update image coordinates
                i+=step4; x+=step; if (x>=w) { x=0; ty+=stepw; }
            }
            
            // return the pixelated image data
            return im;
        }
    });
    
})(FILTER);