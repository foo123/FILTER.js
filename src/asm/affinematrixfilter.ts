// The entry file of your WebAssembly module.
export function affinematrixfilter(im:Uint8ClampedArray, w:i32, h:i32, mode:i32, T:Float32Array, color:i32):Uint8ClampedArray
{
    const IGNORE:i32 = 0, WRAP:i32 = 1, CLAMP:i32 = 2, COLOR:i32 = 3;
    const wf:f32 = f32(w), bx:f32 = wf-1, by:f32 = wf*f32(h-1),
        imLen:i32 = im.length, imArea = wf*f32(h),
        Ta:f32 = T[0], Tb:f32 = T[1], Tx:f32 = T[2]+T[3]*f32(w-1),
        Tcw:f32 = T[4]*wf, Td:f32 = T[5], Tyw:f32 = (T[6]+T[7]*f32(h-1))*wf;
    let i:i32, j:i32,
        x:f32, y:f32, yw:f32,
        nx:f32, ny:f32,
        dst = new Uint8ClampedArray(imLen),
        a:u8, r:u8, g:u8, b:u8;

    if (COLOR == mode)
    {
        a = u8((color >>> 24)&255);
        r = u8((color >>> 16)&255);
        g = u8((color >>> 8)&255);
        b = u8((color)&255);

        for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
        {
            if (x>=wf) {x=0; ++y; yw+=wf;}

            nx = Ta*x + Tb*y + Tx;
            ny = Tcw*x + Td*yw + Tyw;
            if (0>nx || nx>bx || 0>ny || ny>by)
            {
                // color
                dst[i  ] = r;
                dst[i+1] = g;
                dst[i+2] = b;
                dst[i+3] = a;
                continue;
            }
            j = (i32(nx) + i32(ny)) << 2;
            dst[i  ] = im[j  ];
            dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];
            dst[i+3] = im[j+3];
        }
    }
    else if (IGNORE == mode)
    {
        for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
        {
            if (x>=wf) {x=0; ++y; yw+=wf;}

            nx = Ta*x + Tb*y + Tx;
            ny = Tcw*x + Td*yw + Tyw;
            // ignore
            ny = ny > by || ny < 0 ? yw : ny;
            nx = nx > bx || nx < 0 ? x : nx;
            j = (i32(nx) + i32(ny)) << 2;
            dst[i  ] = im[j  ];
            dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];
            dst[i+3] = im[j+3];
        }
    }
    else if (WRAP == mode)
    {
        for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
        {
            if (x>=wf) {x=0; ++y; yw+=wf;}

            nx = Ta*x + Tb*y + Tx;
            ny = Tcw*x + Td*yw + Tyw;
            // wrap
            ny = ny > by ? ny-imArea : (ny < 0 ? ny+imArea : ny);
            nx = nx > bx ? nx-wf : (nx < 0 ? nx+wf : nx);
            j = (i32(nx) + i32(ny)) << 2;
            dst[i  ] = im[j  ];
            dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];
            dst[i+3] = im[j+3];
        }
    }
    else //if (CLAMP == mode)
    {
        for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
        {
            if (x>=wf) {x=0; ++y; yw+=wf;}

            nx = Ta*x + Tb*y + Tx;
            ny = Tcw*x + Td*yw + Tyw;
            // clamp
            ny = ny > by ? by : (ny < 0 ? 0 : ny);
            nx = nx > bx ? bx : (nx < 0 ? 0 : nx);
            j = (i32(nx) + i32(ny)) << 2;
            dst[i  ] = im[j  ];
            dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];
            dst[i+3] = im[j+3];
        }
    }
    return dst;
}
