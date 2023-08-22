// The entry file of your WebAssembly module.
@external("env", "BLEND.normal")
declare function normal(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.multiply")
declare function multiply(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.screen")
declare function screen(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.overlay")
declare function overlay(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.darken")
declare function darken(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.lighten")
declare function lighten(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.colordodge")
declare function colordodge(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.colorburn")
declare function colorburn(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.hardlight")
declare function hardlight(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.softlight")
declare function softlight(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.difference")
declare function difference(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.exclusion")
declare function exclusion(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.average")
declare function average(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.lineardodge")
declare function lineardodge(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.linearburn")
declare function linearburn(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.negation")
declare function negation(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;
@external("env", "BLEND.linearlight")
declare function linearlight(Dca:f32, Da:f32, Sca:f32, Sa:f32):f32;

const NORMAL:i32 = 0,
    MULTIPLY:i32 = 1,
    SCREEN:i32 = 2,
    OVERLAY:i32 = 3,
    DARKEN:i32 = 4,
    LIGHTEN:i32 = 5,
    COLORDODGE:i32 = 6,
    COLORBURN:i32 = 7,
    HARDLIGHT:i32 = 8,
    SOFTLIGHT:i32 = 9,
    DIFFERENCE:i32 = 10,
    EXCLUSION:i32 = 11,
    AVERAGE:i32 = 12,
    LINEARDODGE:i32 = 13, ADD:i32 = 13,
    LINEARBURN:i32 = 14, SUBTRACT:i32 = 14,
    NEGATION:i32 = 15,
    LINEARLIGHT:i32 = 16
;

function clamp(x:f32):u8
{
    return u8(Mathf.min(Mathf.max(0.0, Mathf.round(x)), 255.0));
}

function doblend(mode:i32, Dca:f32, Da:f32, Sca:f32, Sa:f32):f32
{
    if (MULTIPLY == mode) return multiply(Dca, Da, Sca, Sa);
    else if (SCREEN == mode) return screen(Dca, Da, Sca, Sa);
    else if (OVERLAY == mode) return overlay(Dca, Da, Sca, Sa);
    else if (DARKEN == mode) return darken(Dca, Da, Sca, Sa);
    else if (LIGHTEN == mode) return lighten(Dca, Da, Sca, Sa);
    else if (COLORDODGE == mode) return colordodge(Dca, Da, Sca, Sa);
    else if (COLORBURN == mode) return colorburn(Dca, Da, Sca, Sa);
    else if (HARDLIGHT == mode) return hardlight(Dca, Da, Sca, Sa);
    else if (SOFTLIGHT == mode) return softlight(Dca, Da, Sca, Sa);
    else if (DIFFERENCE == mode) return difference(Dca, Da, Sca, Sa);
    else if (EXCLUSION == mode) return exclusion(Dca, Da, Sca, Sa);
    else if (AVERAGE == mode) return average(Dca, Da, Sca, Sa);
    else if (LINEARDODGE == mode) return lineardodge(Dca, Da, Sca, Sa);
    else if (LINEARBURN == mode) return linearburn(Dca, Da, Sca, Sa);
    else if (NEGATION == mode) return negation(Dca, Da, Sca, Sa);
    else if (LINEARLIGHT == mode) return linearlight(Dca, Da, Sca, Sa);
    else return normal(Dca, Da, Sca, Sa);
}

export function blendfilter(im:Uint8ClampedArray, w:i32, h:i32, matrix:Array<f32>, inputs:Array<Uint8ClampedArray>, inputSizes:Array<i32>):Uint8ClampedArray
{
    let i:i32, j:i32, j2:i32, k:i32,
        l:i32 = matrix.length, imLen:i32 = im.length,
        A:Uint8ClampedArray, B:Uint8ClampedArray,
        startX:i32, startY:i32, startX2:i32, startY2:i32,
        W:i32, H:i32, w2:i32, h2:i32,
        W1:i32, W2:i32, start:i32, end:i32,
        x:i32, y:i32, x2:i32, y2:i32, mode:i32,
        rb:f32, gb:f32, bb:f32, ab:f32, ra:f32, ga:f32, ba:f32, aa:f32, a:f32;

    // clone original image since same image may also blend with itself
    B = new Uint8ClampedArray(imLen);
    B.set(im);
    //for (i=0; i<imLen; ++i) B[i] = im[i];

    for (i=0,k=0; i<l; i+=4,++k)
    {
        if (0==matrix[i+3]) continue; // not enabled, skip
        mode = i32(matrix[i]);

        A = inputs[k];
        w2 = i32(inputSizes[2*k]); h2 = i32(inputSizes[2*k+1]);

        startX = i32(Mathf.round(f32(matrix[i+1])));
        startY = i32(Mathf.round(f32(matrix[i+2])));
        startX2 = 0; startY2 = 0;
        if (startX < 0) {startX2 = -startX; startX = 0;}
        if (startY < 0) {startY2 = -startY; startY = 0;}
        if (startX >= w || startY >= h || startX2 >= w2 || startY2 >= h2) continue;

        W = i32(Mathf.min(f32(w-startX), f32(w2-startX2)));
        H = i32(Mathf.min(f32(h-startY), f32(h2-startY2)));
        if (W <= 0 || H <= 0) continue;

        // blend images
        x = startX; y = startY*w; x2 = startX2; y2 = startY2*w2; W1 = startX+W; W2 = startX2+W;
        for (start=0,end=H*W; start<end; ++start)
        {
            j = (x + y) << 2;
            j2 = (x2 + y2) << 2;
            rb =f32(B[j  ]);
            gb =f32(B[j+1]);
            bb =f32(B[j+2]);
            ab =f32(B[j+3])/255.0;
            ra =f32(A[j2  ]);
            ga =f32(A[j2+1]);
            ba =f32(A[j2+2]);
            aa =f32(A[j2+3])/255.0;
            a = NORMAL != mode ? (aa + ab - aa*ab) : (aa + ab * (1 - aa));
            if (0 < a)
            {
                B[j  ] = clamp((255*doblend(mode, ab*rb/255, ab, aa*ra/255, aa)/a));
                B[j+1] = clamp((255*doblend(mode, ab*gb/255, ab, aa*ga/255, aa)/a));
                B[j+2] = clamp((255*doblend(mode, ab*bb/255, ab, aa*ba/255, aa)/a));
                B[j+3] = clamp((255*a));
            }
            else
            {
                B[j  ] = 0;
                B[j+1] = 0;
                B[j+2] = 0;
                B[j+3] = 0;
            }
            // next pixels
            if (++x >= W1) {x = startX; y += w;}
            if (++x2 >= W2) {x2 = startX2; y2 += w2;}
        }
    }
    return B;
}
