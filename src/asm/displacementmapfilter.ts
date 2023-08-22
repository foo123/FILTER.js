// The entry file of your WebAssembly module.
export function displacementmapfilter(im:Uint8ClampedArray, w:i32, h:i32, mode:i32, map:Uint8ClampedArray, mapW:i32, mapH:i32, startX:f32, startY:f32, X:i32, Y:i32, SX:f32, SY:f32, color:i32):Uint8ClampedArray
{
    const IGNORE:i32 = 0, WRAP:i32 = 1, CLAMP:i32 = 2, COLOR:i32 = 3;
    let alpha:u8, red:u8, green:u8, blue:u8,
        bxx:i32 = w-1, byy:i32 = h-1,
        i:i32, j:i32, k:i32,
        x:i32, y:i32, ty:i32, ty2:i32, yy:i32, xx:i32,
        mapOff:i32, dstOff:i32, srcOff:i32,
        imLen:i32=im.length, srcx:i32, srcy:i32,
        mapLen:i32 = map.length, mapArea:i32 = mapLen>>>2,
        ww:i32 = mapW < w ? mapW : w,
        hh:i32 = mapH < h ? mapH : h,
        applyArea:i32 = (ww*hh)<<2;


    SX *= 0.00390625; SY *= 0.00390625;
    let stx:i32 = i32(startX*f32(bxx));
    let sty:i32 = i32(startY*f32(byy));
    let styw:i32 = sty*w;
    let bx0:i32 = -stx, by0 = -sty;
    let bx:i32 = bxx-stx, by:i32 = byy-sty;

    let imcpy:Uint8ClampedArray = new Uint8ClampedArray(imLen);
    imcpy.set(im);
    //for (i=0; i<imLen; ++i) imcpy[i] = im[i];

    let displace:Int16Array = new Int16Array(mapArea<<1);
    for (j=0,i=0; i<mapLen; i+=4)
    {
        displace[j++] = i16(f32( (map[i   +X]) - 128 ) * SX);
        displace[j++] = i16(f32( (map[i   +Y]) - 128 ) * SY);
    }

    if (COLOR == mode)
    {
        alpha = u8((color >>> 24) & 255);
        red = u8((color >>> 16) & 255);
        green = u8((color >>> 8) & 255);
        blue = u8(color & 255);
        for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,++x)
        {
            // update image coordinates
            if (x>=ww) {x=0; ++y; ty+=w; ty2+=mapW;}

            // if inside the application area
            if (y<by0 || y>by || x<bx0 || x>bx) continue;

            xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;

            j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];

            // color
            if (srcy>byy || srcy<0 || srcx>bxx || srcx<0)
            {
                im[dstOff] = red;  im[dstOff+1] = green;
                im[dstOff+2] = blue;  im[dstOff+3] = alpha;
                continue;
            }

            srcOff = (srcx + srcy*w)<<2;
            // new pixel values
            im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
            im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
        }
    }
    else if (IGNORE == mode)
    {
        for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,++x)
        {
            // update image coordinates
            if (x>=ww) {x=0; ++y; ty+=w; ty2+=mapW;}

            // if inside the application area
            if (y<by0 || y>by || x<bx0 || x>bx) continue;

            xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;

            j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];

            // ignore
            if (srcy>byy || srcy<0 || srcx>bxx || srcx<0) continue;

            srcOff = (srcx + srcy*w)<<2;
            // new pixel values
            im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
            im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
        }
    }
    else if (WRAP == mode)
    {
        for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,++x)
        {
            // update image coordinates
            if (x>=ww) {x=0; ++y; ty+=w; ty2+=mapW;}

            // if inside the application area
            if (y<by0 || y>by || x<bx0 || x>bx) continue;

            xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;

            j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];

            // wrap
            srcy = srcy>byy ? srcy-h : (srcy<0 ? srcy+h : srcy);
            srcx = srcx>bxx ? srcx-w : (srcx<0 ? srcx+w : srcx);

            srcOff = (srcx + srcy*w)<<2;
            // new pixel values
            im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
            im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
        }
    }
    else //if (CLAMP == mode)
    {
        for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,++x)
        {
            // update image coordinates
            if (x>=ww) {x=0; ++y; ty+=w; ty2+=mapW;}

            // if inside the application area
            if (y<by0 || y>by || x<bx0 || x>bx) continue;

            xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;

            j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];

            // clamp
            srcy = srcy>byy ? byy : (srcy<0 ? 0 : srcy);
            srcx = srcx>bxx ? bxx : (srcx<0 ? 0 : srcx);

            srcOff = (srcx + srcy*w)<<2;
            // new pixel values
            im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
            im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
        }
    }
    return im;
}
