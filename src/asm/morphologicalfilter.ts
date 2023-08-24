// The entry file of your WebAssembly module.
export function primitive_morphology_operator(mode:i32, inp:Uint8ClampedArray, out:Uint8ClampedArray, w:i32, h:i32, stride:i32, index:Int16Array, index2:Int16Array, op:i32, op0:u8, iter:i32):Uint8ClampedArray
{
    const GRAY:i32 = 9;
    let tmp:Uint8ClampedArray,
        it:i32, x:i32, ty:i32, i:i32, j:i32, k:i32,
        imLen:i32 = inp.length, imArea:i32 = imLen>>>stride,
        rM:u8, gM:u8, bM:u8, r:u8, g:u8, b:u8,
        xOff:i32, yOff:i32, srcOff:i32,
        bx:i32=w-1, by:i32=imArea-w, coverArea:i32;

    tmp = inp; inp = out; out = tmp;
    if (GRAY == mode)
    {
        coverArea = index.length;
        for (it=0; it<iter; ++it)
        {
            tmp = inp; inp = out; out = tmp;
            for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the image pixels that
                // fall under the structure matrix
                for (rM=op0,j=0; j<coverArea; j+=2)
                {
                    xOff = x+index[j]; yOff = ty+index[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    r = inp[srcOff];
                    if (0<op)
                    {
                        rM = r > rM ? r : rM;
                    }
                    else
                    {
                        rM = r < rM ? r : rM;
                    }
                }
                // output
                out[i] = rM; out[i+1] = rM; out[i+2] = rM; out[i+3] = inp[i+3];
            }
        }

        if (index2)
        {
            index = index2; coverArea = index.length;
            for (it=0; it<iter; ++it)
            {
                tmp = inp; inp = out; out = tmp;
                for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ty+=w;}

                    // calculate the image pixels that
                    // fall under the structure matrix
                    for (rM=op0,j=0; j<coverArea; j+=2)
                    {
                        xOff = x+index[j]; yOff = ty+index[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2;
                        r = inp[srcOff];
                        if (0<op)
                        {
                            rM = r > rM ? r : rM;
                        }
                        else
                        {
                            rM = r < rM ? r : rM;
                        }
                    }
                    // output
                    out[i] = rM; out[i+1] = rM; out[i+2] = rM; out[i+3] = inp[i+3];
                }
            }
        }
    }
    else
    {
        coverArea = index.length;
        for (it=0; it<iter; ++it)
        {
            tmp = inp; inp = out; out = tmp;
            for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the image pixels that
                // fall under the structure matrix
                for (rM=gM=bM=op0,j=0; j<coverArea; j+=2)
                {
                    xOff = x+index[j]; yOff = ty+index[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    r = inp[srcOff]; g = inp[srcOff+1]; b = inp[srcOff+2];
                    if (0<op)
                    {
                        rM = r > rM ? r : rM;
                        gM = g > gM ? g : gM;
                        bM = b > bM ? b : bM;
                    }
                    else
                    {
                        rM = r < rM ? r : rM;
                        gM = g < gM ? g : gM;
                        bM = b < bM ? b : bM;
                    }
                }
                // output
                out[i] = rM; out[i+1] = gM; out[i+2] = bM; out[i+3] = inp[i+3];
            }
        }
        if (index2)
        {
            index = index2; coverArea = index.length;
            for (it=0; it<iter; ++it)
            {
                tmp = inp; inp = out; out = tmp;
                for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ty+=w;}

                    // calculate the image pixels that
                    // fall under the structure matrix
                    for (rM=gM=bM=op0,j=0; j<coverArea; j+=2)
                    {
                        xOff = x+index[j]; yOff = ty+index[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2;
                        r = inp[srcOff]; g = inp[srcOff+1]; b = inp[srcOff+2];
                        if (0<op)
                        {
                            rM = r > rM ? r : rM;
                            gM = g > gM ? g : gM;
                            bM = b > bM ? b : bM;
                        }
                        else
                        {
                            rM = r < rM ? r : rM;
                            gM = g < gM ? g : gM;
                            bM = b < bM ? b : bM;
                        }
                    }
                    // output
                    out[i] = rM; out[i+1] = gM; out[i+2] = bM; out[i+3] = inp[i+3];
                }
            }
        }
    }
    return out;
}
