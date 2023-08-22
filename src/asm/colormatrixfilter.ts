// The entry file of your WebAssembly module.
export function colormatrixfilter(im:Uint8ClampedArray, w:i32, h:i32, M:Float32Array):Uint8ClampedArray
{
    let imLen:i32 = im.length, i:i32,
        r0:f32, g0:f32, b0:f32, a0:f32,
        r:f32, g:f32, b:f32, a:f32;

    for (i=0; i<imLen; i+=4)
    {
        r0 = f32(im[i  ]);
        g0 = f32(im[i+1]);
        b0 = f32(im[i+2]);
        a0 = f32(im[i+3]);
        r =  M[0 ]*r0 + M[1 ]*g0 + M[2 ]*b0 + M[3 ]*a0 + M[4 ];
        g =  M[5 ]*r0 + M[6 ]*g0 + M[7 ]*b0 + M[8 ]*a0 + M[9 ];
        b =  M[10]*r0 + M[11]*g0 + M[12]*b0 + M[13]*a0 + M[14];
        a =  M[15]*r0 + M[16]*g0 + M[17]*b0 + M[18]*a0 + M[19];
        // clamp them manually
        r = (r<0. ? 0. : (r>255. ? 255. : r));
        g = (g<0. ? 0. : (g>255. ? 255. : g));
        b = (b<0. ? 0. : (b>255. ? 255. : b));
        a = (a<0. ? 0. : (a>255. ? 255. : a));
        im[i  ] = u8(r);
        im[i+1] = u8(g);
        im[i+2] = u8(b);
        im[i+3] = u8(a);
    }
    return im;
}
