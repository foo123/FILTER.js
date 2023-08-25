/**
*
* Displacement Map Filter
*
* Displaces/Distorts the target image according to displace map
*
* @param displaceMap Optional (an Image used as a  dimaplcement map)
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MODE = FILTER.MODE, CHANNEL = FILTER.CHANNEL,
    TypedArray = FILTER.Util.Array.typed, GLSL = FILTER.Util.GLSL,
    stdMath = Math, Min = stdMath.min, Max = stdMath.max, Floor = stdMath.floor;

// DisplacementMap Filter
var DisplacementMapFilter = FILTER.Create({
    name: "DisplacementMapFilter"

    ,init: function DisplacementMapFilter(displacemap) {
        var self = this;
        if (displacemap) self.setInput("map", displacemap);
    }

    ,path: FILTER.Path
    // parameters
    ,scaleX: 1
    ,scaleY: 1
    ,startX: 0
    ,startY: 0
    ,componentX: 0
    ,componentY: 0
    ,color: 0
    ,mode: MODE.CLAMP
    ,hasInputs: true

    ,dispose: function() {
        var self = this;
        self.scaleX = null;
        self.scaleY = null;
        self.startX = null;
        self.startY = null;
        self.componentX = null;
        self.componentY = null;
        self.color = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             scaleX: self.scaleX
            ,scaleY: self.scaleY
            ,startX: self.startX
            ,startY: self.startY
            ,componentX: self.componentX
            ,componentY: self.componentY
            ,color: self.color
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.scaleX = params.scaleX;
        self.scaleY = params.scaleY;
        self.startX = params.startX;
        self.startY = params.startY;
        self.componentX = params.componentX;
        self.componentY = params.componentY;
        self.color = params.color;
        return self;
    }

    ,reset: function() {
        this.unsetInput("map");
        return this;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return wasm(this);
    }

    // used for internal purposes
    ,_apply: function(im, w, h) {
        //"use asm";
        var self = this, Map;

        Map = self.input("map"); if (!Map) return im;

        var map, mapW, mapH, mapArea, displace, ww, hh,
            color = self.color||0, alpha, red, green, blue,
            sty, stx, styw, bx0, by0, bx, by, bxx = w-1, byy = h-1, rem,
            i, j, k, x, y, ty, ty2, yy, xx, mapOff, dstOff, srcOff,
            SX = self.scaleX*0.00390625, SY = self.scaleY*0.00390625,
            X = self.componentX, Y = self.componentY,
            applyArea, imArea, imLen, mapLen, imcpy, srcx, srcy,
            IGNORE = MODE.IGNORE, CLAMP = MODE.CLAMP,
            COLOR = MODE.COLOR, WRAP = MODE.WRAP,
            mode = self.mode||IGNORE,
            IMG = FILTER.ImArray, copy = FILTER.Util.Array.copy,
            A16I = FILTER.Array16I;

        map = Map[0]; mapW = Map[1]; mapH = Map[2];
        mapLen = map.length; mapArea = mapLen>>>2;
        ww = Min(mapW, w); hh = Min(mapH, h);
        imLen = im.length; applyArea = (ww*hh)<<2; imArea = imLen>>>2;

        // make start relative
        //bxx = w-1; byy = h-1;
        stx = Floor(self.startX*bxx);
        sty = Floor(self.startY*byy);
        styw = sty*w;
        bx0 = -stx; by0 = -sty;
        bx = bxx-stx; by = byy-sty;

        displace = new A16I(mapArea<<1);
        imcpy = copy(im);

        // pre-compute indices,
        // reduce redundant computations inside the main application loop (faster)
        // this is faster if mapArea <= imArea, else a reverse algorithm may be needed (todo)
        rem = (mapArea&15)<<2; j=0;
        for (i=0; i<rem; i+=4)
        {
            displace[j++] = Floor(( map[i   +X] - 128 ) * SX);
            displace[j++] = Floor(( map[i   +Y] - 128 ) * SY);
        }
        for (i=rem; i<mapLen; i+=64)
        {
            displace[j++] = Floor(( map[i   +X] - 128 ) * SX);
            displace[j++] = Floor(( map[i   +Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+4 +X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+4 +Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+8 +X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+8 +Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+12+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+12+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+16+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+16+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+20+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+20+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+24+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+24+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+28+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+28+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+32+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+32+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+36+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+36+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+40+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+40+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+44+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+44+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+48+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+48+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+52+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+52+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+56+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+56+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+60+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+60+Y] - 128 ) * SY);
        }

        // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
        if (COLOR === mode)
        {
            alpha = (color >>> 24) & 255;
            red = (color >>> 16) & 255;
            green = (color >>> 8) & 255;
            blue = color & 255;
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
        else if (IGNORE === mode)
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
        else if (WRAP === mode)
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
        else //if (CLAMP === mode)
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
});
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    displacementmapfilter: {inputs: [{arg:0,type:FILTER.ImArray},{arg:4,type:FILTER.ImArray}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
        DisplacementMapFilter.prototype._apply_wasm = function(im, w, h) {
            var self = this, map = self.input("map");
            if (!map) return im;
            return wasm.displacementmapfilter(im, w, h, self.mode||IGNORE, map[0], map[1], map[2], self.startX||0, self.startY||0, self.componentX||0, self.componentY||0, self.scaleX, self.scaleY, self.color||0);
        };
    }
    FILTER.unwaitFor(1);
});
}

function glsl(filter)
{
    var displaceMap = filter.input("map"), color = filter.color || 0;
    if (!displaceMap) return {instance: filter, shader: GLSL.DEFAULT};
    return {instance: filter, shader: [
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform sampler2D map;',
    'uniform vec2 mapSize;',
    'uniform vec2 start;',
    'uniform vec2 scale;',
    'uniform vec4 color;',
    'uniform ivec2 component;',
    '#define IGNORE '+MODE.IGNORE+'',
    '#define CLAMP '+MODE.CLAMP+'',
    '#define COLOR '+MODE.COLOR+'',
    '#define WRAP '+MODE.WRAP+'',
    '#define RED '+CHANNEL.R+'',
    '#define GREEN '+CHANNEL.G+'',
    '#define BLUE '+CHANNEL.B+'',
    '#define ALPHA '+CHANNEL.A+'',
    'uniform int mode;',
    'void main(void) {',
    '   if (pix.x < start.x || pix.x > min(1.0,start.x+mapSize.x) || pix.y < start.y || pix.y > min(1.0,start.y+mapSize.y)) {',
    '      gl_FragColor = texture2D(img, pix);',
    '   } else {',
    '       vec4 mc = texture2D(map, (pix-start)/mapSize);',
    '       vec2 p = vec2(pix.x, pix.y);',
    '       if (ALPHA == component.x) p.x += (mc.a - 0.5)*scale.x;',
    '       else if (BLUE == component.x) p.x += (mc.b - 0.5)*scale.x;',
    '       else if (GREEN == component.x) p.x += (mc.g - 0.5)*scale.x;',
    '       else p.x += (mc.r - 0.5)*scale.x;',
    '       if (ALPHA == component.y) p.y += (mc.a - 0.5)*scale.y;',
    '       else if (BLUE == component.y) p.y += (mc.b - 0.5)*scale.y;',
    '       else if (GREEN == component.y) p.y += (mc.g - 0.5)*scale.y;',
    '       else p.y += (mc.r - 0.5)*scale.y;',
    '       if (0.0 > p.x || 1.0 < p.x || 0.0 > p.y || 1.0 < p.y) {',
    '           if (COLOR == mode) {gl_FragColor = color;}',
    '           else if (CLAMP == mode) {gl_FragColor = texture2D(img, vec2(clamp(p.x, 0.0, 1.0),clamp(p.y, 0.0, 1.0)));}',
    '           else if (WRAP == mode) {',
    '               if (0.0 > p.x) p.x += 1.0;',
    '               if (1.0 < p.x) p.x -= 1.0;',
    '               if (0.0 > p.y) p.y += 1.0;',
    '               if (1.0 < p.y) p.y -= 1.0;',
    '               gl_FragColor = texture2D(img, p);',
    '           }',
    '           else {gl_FragColor = texture2D(img, pix);}',
    '       } else {',
    '           gl_FragColor = texture2D(img, p);',
    '       }',
    '   }',
    '}'
    ].join('\n'),
    textures: function(gl, w, h, program) {
        var displaceMap = filter.input("map");
        GLSL.uploadTexture(gl, displaceMap[0], displaceMap[1], displaceMap[2], 1);
    },
    vars: function(gl, w, h, program) {
        var displaceMap = filter.input("map");
        gl.uniform1i(program.uniform.map, 1);  // img unit 1
        gl.uniform2f(program.uniform.mapSize, displaceMap[1]/w, displaceMap[2]/h);
        gl.uniform2f(program.uniform.scale, 1.4*filter.scaleX/255, /*if UNPACK_FLIP_Y_WEBGL*//*-*/1.4*filter.scaleY/255);
        gl.uniform2f(program.uniform.start, filter.startX, filter.startY);
        gl.uniform2i(program.uniform.component, filter.componentX, filter.componentY);
        gl.uniform4f(program.uniform.color,
            ((color >>> 16) & 255)/255,
            ((color >>> 8) & 255)/255,
            (color & 255)/255,
            ((color >>> 24) & 255)/255
        );
    }
    };
}
function wasm()
{
    return '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';
}
}(FILTER);