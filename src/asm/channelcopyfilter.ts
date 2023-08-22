// The entry file of your WebAssembly module.
export function channelcopyfilter(im:Uint8ClampedArray, w:i32, h:i32, mode:i32, src:Uint8ClampedArray, w2:i32, h2:i32, cX:f32, cY:f32, sC:i32, tC:i32, color:i32=0):Uint8ClampedArray
{
    const COLOR32:i32 = 3, COLOR8:i32 = 15,
        COLORMASK32:i32 = 16, COLORMASK8:i32 = 17;
    let i:i32, l:i32 = im.length, l2:i32 = src.length,
        x:i32, x2:i32, y:i32, y2:i32, off:i32, xc:i32, yc:i32,
        cX2:i32 = w2>>>1, cY2:i32 = h2>>>1,
        cXi:i32, cYi:i32,
        wm:i32 = w > w2 ? w2 : w,
        hm:i32 = h > h2 ? h2 : h,
        r:u8=0, g:u8=0, b:u8=0, a:u8=0;

    if (COLOR32 == mode || COLORMASK32 == mode)
    {
        a = u8((color >>> 24)&255);
        r = u8((color >>> 16)&255);
        g = u8((color >>> 8)&255);
        b = u8((color)&255);
    }
    else if (COLOR8 == mode || COLORMASK8 == mode)
    {
        r = u8(color&255);
    }

    // make center relative
    cXi = i32(cX*f32(w-1)) - cX2;
    cYi = i32(cY*f32(h-1)) - cY2;

    for (x=0,y=0,i=0; i<l; i+=4,++x)
    {
        if (x>=w) {x=0; ++y;}

        xc = x - cXi; yc = y - cYi;
        if (xc<0 || xc>=w2 || yc<0 || yc>=h2)
        {
            if (COLOR32 == mode) {im[i  ] = r; im[i+1] = g; im[i+2] = b; im[i+3] = a;}
            else if (COLORMASK32 == mode) {im[i  ] = r & im[i  ]; im[i+1] = g & im[i+1]; im[i+2] = b & im[i+2]; im[i+3] = a & im[i+3];}
            else if (COLOR8 == mode) im[i+tC] = r;
            else if (COLORMASK8 == mode) im[i+tC] = r & im[i+sC];
            // else ignore
        }
        else
        {
            // copy channel
            off = (xc + yc*w2)<<2;
            im[i + tC] = src[off + sC];
        }
    }
    // return the new image data
    return im;
}
