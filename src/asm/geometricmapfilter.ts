// The entry file of your WebAssembly module.
function hypot(x:f32, y:f32):f32
{
    let m:f32 = Mathf.max(Mathf.abs(x), Mathf.abs(y));
    if (0==m) return 0;
    x /= m; y /= m;
    return m*Mathf.sqrt(x*x + y*y);
}
const Y:f32 = 1;
function init_twirl(p:Float32Array, w:f32, h:f32):Float32Array
{
    p[0] *= (w-1);
    p[1] *= (h-1);
    //R = self.radius,
    //angle = self.angle,
    //fact = angle/R
    return p;
}
function init_sphere(p:Float32Array, w:f32, h:f32):Float32Array
{
    p[0] *= (w-1);
    p[1] *= (h-1);
    //R = self.radius,
    //R2 = R*R,
    p[2] *= p[2];
    return p;
}
function init_polar(p:Float32Array, w:f32, h:f32):Float32Array
{
    let W:f32 = (w-1), H:f32 = (h-1),
        cx:f32 = p[0]*W, cy:f32 = p[1]*H;
    p[0] = cx;
    p[1] = cy;
    p[2] = Mathf.max(
        Mathf.max(
            hypot((cx - 0), (cy - 0)),
            hypot((cx - W), (cy - 0))
        ),
        Mathf.max(
            hypot((cx - 0), (cy - H)),
            hypot((cx - W), (cy - H))
        )
    );
    p[3] = 6.283185307179586;
    return p;
}
function init_cartesian(p:Float32Array, w:f32, h:f32):Float32Array
{
    let W:f32 = (w-1), H:f32 = (h-1),
        cx:f32 = p[0]*W, cy:f32 = p[1]*H;
    p[0] = cx;
    p[1] = cy;
    p[2] = Mathf.max(
        Mathf.max(
            hypot((cx - 0), (cy - 0)),
            hypot((cx - W), (cy - 0))
        ),
        Mathf.max(
            hypot((cx - 0), (cy - H)),
            hypot((cx - W), (cy - H))
        )
    );
    p[3] = 6.283185307179586;
    return p;
}
function twirl(t:Float32Array, p:Float32Array, w:f32, h:f32):Float32Array
{
    let TX:f32 = t[0]-p[0], TY:f32 = t[1]-p[1],
        D:f32 = hypot(TX, TY), theta:f32;
    if (D < p[2])
    {
        theta = Mathf.atan2(TY, TX) + p[3]*(p[2]-D)/p[2];
        t[0] = p[0] + D*Mathf.cos(theta);
        t[1] = p[1] + D*Mathf.sin(theta);
    }
    return t;
}
function sphere(t:Float32Array, p:Float32Array, w:f32, h:f32):Float32Array
{
    let TX:f32 = t[0]-p[0], TY:f32 = t[1]-p[1],
        TX2:f32 = TX*TX, TY2:f32 = TY*TY,
        D2:f32 = TX2 + TY2, D:f32,
        thetax:f32, thetay:f32;
    if (D2 < p[2])
    {
        D2 = p[2] - D2;
        D = Mathf.sqrt(D2);
        thetax = Mathf.asin(TX / Mathf.sqrt(TX2 + D2)) * (1-0.555556);
        thetay = Mathf.asin(TY / Mathf.sqrt(TY2 + D2)) * (1-0.555556);
        t[0] = t[0] - D * Mathf.tan(thetax);
        t[1] = t[1] - D * Mathf.tan(thetay);
    }
    return t;
}
function polar(t:Float32Array, p:Float32Array, w:f32, h:f32):Float32Array
{
    let r:f32, a:f32;
    if (p[4] == Y)
    {
        r = p[2]*t[1]/(h-1);
        a = p[3]*t[0]/(w-1);
        t[1] = r*Mathf.cos(a) + p[1];
        t[0] = r*Mathf.sin(a) + p[0];
    }
    else
    {
        r = p[2]*t[0]/(w-1);
        a = p[3]*t[1]/(h-1);
        t[0] = r*Mathf.cos(a) + p[0];
        t[1] = r*Mathf.sin(a) + p[1];
    }
    return t;
}
function cartesian(t:Float32Array, p:Float32Array, w:f32, h:f32):Float32Array
{
    let x:f32 = p[4] == Y ? (t[1] - p[1]) : (t[0] - p[0]),
        y:f32 = p[4] == Y ? (t[0] - p[0]) : (t[1] - p[1]),
        r:f32 = hypot(x, y),
        a:f32 = Mathf.atan2(y, x);
    if (p[4] == Y)
    {
        t[1] = (h-1)*r/p[2];
        t[0] = (w-1)*a/p[3];
    }
    else
    {
        t[0] = (w-1)*r/p[2];
        t[1] = (h-1)*a/p[3];
    }
    return t;
}
function init(map:i32, p:Float32Array, w:f32, h:f32):Float32Array
{
    if (1==map) return init_twirl(p, w, h);
    else if (2==map) return init_sphere(p, w, h);
    else if (3==map) return init_polar(p, w, h);
    else if (4==map) return init_cartesian(p, w, h);
    return p;
}
function apply(map:i32, t:Float32Array, p:Float32Array, w:f32, h:f32):Float32Array
{
    if (1==map) return twirl(t, p, w, h);
    else if (2==map) return sphere(t, p, w, h);
    else if (3==map) return polar(t, p, w, h);
    else if (4==map) return cartesian(t, p, w, h);
    return t;
}
export function geometricmapfilter(im:Uint8ClampedArray, w:i32, h:i32, mode:i32, map:i32, params:Float32Array, color:i32=0):Uint8ClampedArray
{
    const IGNORE:i32 = 0, WRAP:i32 = 1, CLAMP:i32 = 2, COLOR:i32 = 3;
    var x:i32, y:i32, i:i32, j:i32, imLen:i32 = im.length,
        dst:Uint8ClampedArray = new Uint8ClampedArray(imLen),
        t:Float32Array = new Float32Array(2),
        r:u8, g:u8, b:u8, a:u8,
        wf:f32 = f32(w), hf:f32 = f32(h),
        bx:f32 = wf-1, by:f32 = hf-1;

    params = init(map, params, wf, hf);

    if (COLOR == mode)
    {
        a = u8((color >>> 24)&255);
        r = u8((color >>> 16)&255);
        g = u8((color >>> 8)&255);
        b = u8((color)&255);

        for (x=0,y=0,i=0; i<imLen; i+=4,++x)
        {
            if (x>=w) {x=0; ++y;}

            t[0] = f32(x); t[1] = f32(y);

            t = apply(map, t, params, wf, hf);

            if (0>t[0] || t[0]>bx || 0>t[1] || t[1]>by)
            {
                /* color */
                dst[i] = r;   dst[i+1] = g;
                dst[i+2] = b;  dst[i+3] = a;
                continue;
            }

            j = (i32(t[0]) + i32(t[1])*w) << 2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
    }
    else if (IGNORE == mode)
    {
        for (x=0,y=0,i=0; i<imLen; i+=4,++x)
        {
            if (x>=w) {x=0; ++y;}

            t[0] = f32(x); t[1] = f32(y);

            t = apply(map, t, params, wf, hf);

            /* ignore */
            t[1] = t[1] > by || t[1] < 0 ? f32(y) : t[1];
            t[0] = t[0] > bx || t[0] < 0 ? f32(x) : t[0];

            j = (i32(t[0]) + i32(t[1])*w) << 2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
    }
    else if (WRAP == mode)
    {
        for (x=0,y=0,i=0; i<imLen; i+=4,++x)
        {
            if (x>=w) {x=0; ++y;}

            t[0] = f32(x); t[1] = f32(y);

            t = apply(map, t, params, wf, hf);

            /* wrap */
            t[1] = t[1] > by ? t[1]-hf : (t[1] < 0 ? t[1]+hf : t[1]);
            t[0] = t[0] > bx ? t[0]-wf : (t[0] < 0 ? t[0]+wf : t[0]);

            j = (i32(t[0]) + i32(t[1])*w) << 2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
    }
    else /*if (CLAMP == mode)*/
    {
        for (x=0,y=0,i=0; i<imLen; i+=4,++x)
        {
            if (x>=w) {x=0; ++y;}

            t[0] = f32(x); t[1] = f32(y);

            t = apply(map, t, params, wf, hf);

            /* clamp */
            t[1] = t[1] > by ? by : (t[1] < 0 ? 0 : t[1]);
            t[0] = t[0] > bx ? bx : (t[0] < 0 ? 0 : t[0]);

            j = (i32(t[0]) + i32(t[1])*w) << 2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
    }
    return dst;
}
