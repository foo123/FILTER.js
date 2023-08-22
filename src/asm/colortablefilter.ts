// The entry file of your WebAssembly module.
export function colortablefilter_RGB(im:Uint8ClampedArray, w:i32, h:i32, R:Uint8ClampedArray, G:Uint8ClampedArray, B:Uint8ClampedArray):Uint8ClampedArray
{
    let imLen:i32 = im.length, i:i32;
    for (i=0; i<imLen; i+=4)
    {
        im[i  ] = R[im[i  ]];
        im[i+1] = G[im[i+1]];
        im[i+2] = B[im[i+2]];
    }
    return im;
}
export function colortablefilter_RGBA(im:Uint8ClampedArray, w:i32, h:i32, R:Uint8ClampedArray, G:Uint8ClampedArray, B:Uint8ClampedArray, A:Uint8ClampedArray):Uint8ClampedArray
{
    let imLen:i32 = im.length, i:i32;
    for (i=0; i<imLen; i+=4)
    {
        im[i  ] = R[im[i  ]];
        im[i+1] = G[im[i+1]];
        im[i+2] = B[im[i+2]];
        im[i+3] = A[im[i+3]];
    }
    return im;
}
