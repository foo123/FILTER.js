// The entry file of your WebAssembly module.
function clamp(x:i32, min:i32, max:i32):i32
{
    return x < min ? min : (x > max ? max : x);
}
export function rectangular(input:Uint8ClampedArray, w:i32, h:i32, scale:f32):Uint8ClampedArray
{
    let imLen:i32 = input.length, imArea:i32 = imLen>>>2,
        step:i32, step_2:i32, stepw:i32, stepw_2:i32,
        bx:i32 = w-1, by:i32 = imArea-w, p0:i32,
        i:i32, x:i32, yw:i32, sx:i32, sy:i32, syw:i32, pxa:i32, pya:i32, pxc:i32, pyc:i32;

    let output:Uint8ClampedArray = new Uint8ClampedArray(imLen);
    step = i32(Mathf.sqrt(f32(imArea))*scale*1e-2);
    step_2 = i32(0.5*f32(step)); stepw = step*w; stepw_2 = step_2*w;

    x=yw=sx=sy=syw=0;
    for (i=0; i<imLen; i+=4)
    {
        pxa = x-sx; pya = yw-syw;
        pxc = clamp(pxa+step_2, 0, bx);
        pyc = clamp(pya+stepw_2, 0, by);

        p0 = (pxc + pyc) << 2;

        output[i  ] = input[p0  ];
        output[i+1] = input[p0+1];
        output[i+2] = input[p0+2];
        output[i+3] = input[i+3];

        // next pixel
        ++x; ++sx;
        if (x >= w)
        {
            sx=0; x=0; ++sy; syw+=w; yw+=w;
            if (sy >= step) {sy=0; syw=0;}
        }
        if (sx >= step) {sx=0;}
    }
    return output;
}
export function triangular(input:Uint8ClampedArray, w:i32, h:i32, scale:f32):Uint8ClampedArray
{
    let imLen:i32 = input.length, imArea:i32 = imLen>>>2,
        step:i32, step_2:i32, step1_3:i32, step2_3:i32, stepw:i32, stepw_2:i32,
        bx:i32 = w-1, by:i32 = imArea-w, p0:i32,
        i:i32, x:i32, yw:i32, sx:i32, sy:i32, syw:i32, pxa:i32, pya:i32, pxc:i32, pyc:i32;

    let output:Uint8ClampedArray = new Uint8ClampedArray(imLen);
    step = i32(Mathf.sqrt(f32(imArea))*scale*1.25e-2);
    step_2 = i32(0.5*f32(step)); step1_3 = i32(0.333*f32(step)); step2_3 = i32(0.666*f32(step));
    stepw = step*w; stepw_2 = step_2*w;

    x=yw=sx=sy=syw=0;
    for (i=0; i<imLen; i+=4)
    {
        pxa = x-sx; pya = yw-syw;

        // these edge conditions create the various triangular patterns
        if (sx+sy > step)
        {
            // second (right) triangle
            pxc = clamp(pxa+step2_3, 0, bx);
            pyc = clamp(pya+stepw_2, 0, by);
            p0 = (pxc + pyc) << 2;
        }
        else
        {
            // first (left) triangle
            pxc = clamp(pxa+step1_3, 0, bx);
            pyc = clamp(pya+stepw_2, 0, by);
            p0 = (pxc + pyc) << 2;
        }

        output[i  ] = input[p0  ];
        output[i+1] = input[p0+1];
        output[i+2] = input[p0+2];
        output[i+3] = input[i+3];

        // next pixel
        ++x; ++sx;
        if (x >= w)
        {
            sx=0; x=0; ++sy; syw+=w; yw+=w;
            if (sy >= step) {sy=0; syw=0;}
        }
        if (sx >= step) {sx=0;}
    }
    return output;
}
export function rhomboidal(input:Uint8ClampedArray, w:i32, h:i32, scale:f32):Uint8ClampedArray
{
    let imLen:i32 = input.length, imArea:i32 = imLen>>>2,
        step:i32, step2:i32, stepw:i32, stepw2:i32, odd:i32,
        bx:i32 = w-1, by:i32 = imArea-w, p0:i32,
        i:i32, x:i32, yw:i32, sx:i32, sy:i32, syw:i32,
        pxa:i32, pya:i32, pxc:i32, pyc:i32;

    let output:Uint8ClampedArray = new Uint8ClampedArray(imLen);
    step = i32(Mathf.sqrt(f32(imArea))*scale*7e-3);
    step2 = 2*step; stepw = step*w; stepw2 = step2*w;

    x=yw=sx=sy=syw=0; odd = 0;
    for (i=0; i<imLen; i+=4)
    {
        // these edge conditions create the various rhomboid patterns
        if (1 == odd)
        {
            // second row, bottom half of rhombii
            if (sx+sy > step2)
            {
                // third triangle /\.
                pxa = clamp(x-sx+step, 0, bx); pya = yw-syw;
            }
            else if (sx+step-sy > step)
            {
                // second triangle \/.
                pxa = x-sx; pya = clamp(yw-syw-stepw, 0, by);
            }
            else
            {
                // first triangle /\.
                pxa = clamp(x-sx-step, 0, bx); pya = yw-syw;
            }
        }
        else
        {
            // first row, top half of rhombii
            if (sx+step-sy > step2)
            {
                // third triangle \/.
                pxa = clamp(x-sx+step, 0, bx); pya = clamp(yw-syw-stepw, 0, by);
            }
            else if (sx+sy > step)
            {
                // second triangle /\.
                pxa = x-sx; pya = yw-syw;
            }
            else
            {
                // first triangle \/.
                pxa = clamp(x-sx-step, 0, bx); pya = clamp(yw-syw-stepw, 0, by);
            }
        }
        pxc = clamp(pxa+step, 0, bx);
        pyc = clamp(pya+stepw, 0, by);

        p0 = (pxc + pyc) << 2;

        output[i  ] = input[p0  ];
        output[i+1] = input[p0+1];
        output[i+2] = input[p0+2];
        output[i+3] = input[i+3];

        // next pixel
        ++x; ++sx;
        if (x >= w)
        {
            sx=0; x=0; ++sy; syw+=w; yw+=w;
            if (sy >= step) {sy=0; syw=0; odd = 1-odd;}
        }
        if (sx >= step2) {sx=0;}
    }
    return output;
}
function hypot(x:f32, y:f32, z:f32):f32
{
    let m:f32 = Mathf.max(Mathf.max(Mathf.abs(x), Mathf.abs(y)), Mathf.abs(z));
    if (0==m) return 0;
    x /= m; y /= m; z /= m;
    return m*Mathf.sqrt(x*x + y*y + z*z);
}
export function hexagonal(input:Uint8ClampedArray, w:i32, h:i32, scale:f32):Uint8ClampedArray
{
    let imLen:i32 = input.length, imArea:i32 = imLen>>>2,
        bx:i32 = w-1, by:i32 = imArea-w, p0:i32, i:i32,
        x:i32, y:i32, xn:i32, yn:i32,
        t_x:f32, t_y:f32, it_x:f32, it_y:f32, ct_x:f32, ct_y:f32,
        a_x:f32, a_y:f32, b_x:f32, b_y:f32, c_x:f32, c_y:f32,
        A_x:f32, A_y:f32, A_z:f32,
        B_x:f32, B_y:f32, B_z:f32,
        C_x:f32, C_y:f32, C_z:f32,
        T_x:f32, T_y:f32, T_z:f32,
        alen:f32, blen:f32, clen:f32,
        ch_x:f32, ch_y:f32;

    let output:Uint8ClampedArray = new Uint8ClampedArray(imLen);
    scale = Mathf.sqrt(f32(imArea))*scale*1e-2;
    x=y=0;
    for (i=0; i<imLen; i+=4)
    {
        //xn = x/w;
        //yn = y/h;
        t_x = f32(x) / scale;
        t_y = f32(y) / scale;
        t_y /= 0.866025404;
        t_x -= t_y * 0.5;
        it_x = Mathf.floor(t_x);
        it_y = Mathf.floor(t_y);
        ct_x = Mathf.ceil(t_x);
        ct_y = Mathf.ceil(t_y);
        if (t_x + t_y - it_x - it_y < 1.0)
        {
            a_x = it_x;
            a_y = it_y;
        }
        else
        {
            a_x = ct_x;
            a_y = ct_y;
        }
        b_x = ct_x;
        b_y = it_y;
        c_x = it_x;
        c_y = ct_y;

        T_x = t_x;
        T_y = t_y;
        T_z = 1.0 - t_x - t_y;
        A_x = a_x;
        A_y = a_y;
        A_z = 1.0 - a_x - a_y;
        B_x = b_x;
        B_y = b_y;
        B_z = 1.0 - b_x - b_y;
        C_x = c_x;
        C_y = c_y;
        C_z = 1.0 - c_x - c_y;

        alen = hypot(T_x - A_x, T_y - A_y, T_z - A_z);
        blen = hypot(T_x - B_x, T_y - B_y, T_z - B_z);
        clen = hypot(T_x - C_x, T_y - C_y, T_z - C_z);
        if (alen < blen)
        {
            if (alen < clen) {ch_x = a_x; ch_y = a_y;}
            else {ch_x = c_x; ch_y = c_y;}
        }
        else
        {
            if (blen < clen) {ch_x = b_x; ch_y = b_y;}
            else {ch_x = c_x; ch_y = c_y;}
        }

        ch_x += ch_y * 0.5;
        ch_y *= 0.866025404;
        ch_x *= scale;
        ch_y *= scale;
        p0 = (clamp(i32(ch_x), 0, bx) + clamp(i32(ch_y)*w, 0, by)) << 2;
        output[i  ] = input[p0  ];
        output[i+1] = input[p0+1];
        output[i+2] = input[p0+2];
        output[i+3] = input[i+3];

        // next pixel
        ++x;
        if (x >= w) {x=0; ++y;}
    }
    return output;
}
