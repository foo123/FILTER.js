/**
*
* Bokeh (Depth-of-Field) Plugin
* @package FILTER.js
*
**/
(function(FILTER){

    var Sqrt=Math.sqrt, Exp=Math.exp, Log=Math.log, Abs=Math.abs, 
        notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F;
    
    // a simple bokeh (depth-of-field) filter
    FILTER.BokehFilter=FILTER.Create({
        // parameters
        centerX: 0,
        centerY: 0,
        radius: 10,
        amount: 10,
        
        // this is the filter constructor
        init: function(centerX, centerY, radius, amount) {
            this.centerX=centerX||0;
            this.centerY=centerY||0;
            this.radius=radius||10;
            this.amount=amount||10;
        },
        
        // this is the filter actual apply method routine
        apply: function(im, w, h/*, image*/) {
            // im is a copy of the image data as an image array
            // w is image width, h is image height
            // image is the original image instance reference, generally not needed
            var imLen=im.length, imArea, integral, integralLen, colR, colG, colB,
                rowLen, i, j, x , y, ty, 
                cX=this.centerX, cY=this.centerY, 
                r=this.radius, m=this.amount,
                d, dx, dy, blur, blurw, wt,
                xOff1, yOff1, xOff2, yOff2,
                p1, p2, p3, p4, t0, t1, t2,
                bx1, bx2, by1, by2
                ;
            
            if (m<=0) return im;
            
            imArea=w*h;
            bx1=0; bx2=w-1; by1=0; by2=imArea-w;
            
            integralLen=(imArea<<1)+imArea;  rowLen=(w<<1)+w;
            integral=new A32F(integralLen);
            
            // compute integral of image in one pass
            // first row
            i=0; j=0; x=0; colR=colG=colB=0;
            while (x<w)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                i+=4; j+=3; x++;
            }
            // other rows
            i=rowLen+w; j=rowLen; x=0; colR=colG=colB=0;
            while (i<imLen)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j]=integral[j-rowLen]+colR; 
                integral[j+1]=integral[j-rowLen+1]+colG; 
                integral[j+2]=integral[j-rowLen+2]+colB;
                i+=4; j+=3; x++; if (x>=w) { x=0; colR=colG=colB=0; }
            }
            
            
            // bokeh (depth-of-field) effect 
            // is a kind of adaptive blurring depending on distance from a center
            // like the camera/eye is focused on a specific area and everything else appears increasingly blurred
            
            //r=r||1; m/=r;
            i=0; x=0; y=0; ty=0;
            while (i<imLen)
            {
                // compute distance
                dx=x-cX; dy=y-cY;
                //d=Sqrt(dx*dx + dy*dy);
                d=Abs(dx) + Abs(dy);  // approximation
                
                // calculate amount(radius) of blurring 
                // depending on distance from focus center
                blur=(d>r) ? ~~Log((d-r)*m) : ~~(d/r+0.5); // smooth it a bit, around the radius edge condition
                
                if (blur>0)
                {
                     blurw=blur*w; wt=0.25/(blur*blur);
                     
                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x - blur; yOff1=ty - blurw;
                    xOff2=x + blur; yOff2=ty + blurw;
                    
                    // fix borders
                    if (xOff1<bx1) xOff1=bx1;
                    else if (xOff2>bx2) xOff2=bx2;
                    if (yOff1<by1) yOff1=by1;
                    else if (yOff2>by2) yOff2=by2;
                    
                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                    // arguably faster way to write p1*=3; etc..
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                    
                    // apply a fast box-blur to these pixels
                    // compute matrix sum of these elements 
                    // (trying to avoid possible overflow in the process, order of summation can matter)
                    t0 = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                    t1 = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                    t2 = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                    
                    // output
                    if (notSupportClamp)
                    {   
                        // clamp them manually
                        if (t0<0) t0=0;
                        else if (t0>255) t0=255;
                        if (t1<0) t1=0;
                        else if (t1>255) t1=255;
                        if (t2<0) t2=0;
                        else if (t2>255) t2=255;
                    }
                    im[i] = ~~t0;  im[i+1] = ~~t1;  im[i+2] = ~~t2;
                    // alpha channel is not transformed
                    //im[i+3] = im[i+3];
                }

                
                // update image coordinates
                i+=4; x++; if (x>=w) { x=0; y++; ty+=w; }
            }
            
            // return the new image data
            return im;
        }
    });
    
})(FILTER);