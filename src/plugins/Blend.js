/**
*
* Image Blend Filter Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var HAS = 'hasOwnProperty', Min = Math.min, Max = Math.max, 
    Round = Math.round, Floor=Math.floor, Abs = Math.abs,
    notSupportClamp = FILTER._notSupportClamp,
    blend_functions
;

// JavaScript implementations of common image blending modes, based on
// http://stackoverflow.com/questions/5919663/how-does-photoshop-blend-two-images-together
blend_functions = {
    
    normal: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
        
        // normal mode
        rb = r2;  
        gb = g2;  
        bb = b2;
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    lighten: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
        
        // lighten mode
        rb = (r > r2) ? r : r2; 
        gb = (g > g2) ? g : g2; 
        bb = (b > b2) ? b : b2; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    darken: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // darken mode
        rb = (r > r2) ? r2 : r; 
        gb = (g > g2) ? g2 : g; 
        bb = (b > b2) ? b2 : b; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    multiply: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // multiply mode
        rb = (r * r2 * 0.003921568627451);
        gb = (g * g2 * 0.003921568627451);
        bb = (b * b2 * 0.003921568627451);
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    average: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // average mode
        rb = 0.5*(r + r2); 
        gb = 0.5*(g + g2); 
        bb = 0.5*(b + b2); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    add: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // add mode
        rb = r + r2; 
        gb = g + g2; 
        bb = b + b2; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    subtract: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // subtract mode
        rb = (r + r2 < 255) ? 0 : r + r2 - 255;  
        gb = (g + g2 < 255) ? 0 : g + g2 - 255;  
        bb = (b + b2 < 255) ? 0 : b + b2 - 255;  
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    difference: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // difference mode
        rb = Abs(r2 - r); 
        gb = Abs(g2 - g); 
        bb = Abs(b2 - b); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    negation: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // negation mode
        rb = 255 - Abs(255 - r2 - r);
        gb = 255 - Abs(255 - g2 - g);
        bb = 255 - Abs(255 - b2 - b);
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    screen: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // screen mode
        rb = 255 - (((255 - r2) * (255 - r)) >> 8); 
        gb = 255 - (((255 - g2) * (255 - g)) >> 8); 
        bb = 255 - (((255 - b2) * (255 - b)) >> 8); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    exclusion: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // exclusion mode
        rb = r2 + r - 2 * r2 * r * 0.003921568627451; 
        gb = g2 + g - 2 * g2 * g * 0.003921568627451; 
        bb = b2 + b - 2 * b2 * b * 0.003921568627451; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    overlay: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // overlay mode
        rb = r < 128 ? (2 * r2 * r * 0.003921568627451) : (255 - 2 * (255 - r2) * (255 - r) * 0.003921568627451); 
        gb = g < 128 ? (2 * g2 * g * 0.003921568627451) : (255 - 2 * (255 - g2) * (255 - g) * 0.003921568627451); 
        rb = b < 128 ? (2 * b2 * b * 0.003921568627451) : (255 - 2 * (255 - b2) * (255 - b) * 0.003921568627451); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    softlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // softlight mode
        rb = r < 128 ? (2 * ((r2 >> 1) + 64)) * (r * 0.003921568627451) : 255 - (2 * (255 - (( r2 >> 1) + 64)) * (255 - r) * 0.003921568627451); 
        gb = g < 128 ? (2 * ((g2 >> 1) + 64)) * (g * 0.003921568627451) : 255 - (2 * (255 - (( g2 >> 1) + 64)) * (255 - g) * 0.003921568627451); 
        bb = b < 128 ? (2 * ((b2 >> 1) + 64)) * (b * 0.003921568627451) : 255 - (2 * (255 - (( b2 >> 1) + 64)) * (255 - b) * 0.003921568627451); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    // reverse of overlay
    hardlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // hardlight mode, reverse of overlay
        rb = r2 < 128 ? (2 * r * r2 * 0.003921568627451) : (255 - 2 * (255 - r) * (255 - r2) * 0.003921568627451); 
        gb = g2 < 128 ? (2 * g * g2 * 0.003921568627451) : (255 - 2 * (255 - g) * (255 - g2) * 0.003921568627451); 
        bb = b2 < 128 ? (2 * b * b2 * 0.003921568627451) : (255 - 2 * (255 - b) * (255 - b2) * 0.003921568627451); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    colordodge: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // colordodge mode
        rb = (255 == r) ? r : Min(255, ((r2 << 8 ) / (255 - r))); 
        gb = (255 == g) ? g : Min(255, ((g2 << 8 ) / (255 - g))); 
        bb = (255 == b) ? r : Min(255, ((b2 << 8 ) / (255 - b))); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    colorburn: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // colorburn mode
        rb = (0 == r) ? r : Max(0, (255 - ((255 - r2) << 8 ) / r)); 
        gb = (0 == g) ? g : Max(0, (255 - ((255 - g2) << 8 ) / g)); 
        bb = (0 == b) ? b : Max(0, (255 - ((255 - b2) << 8 ) / b)); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    linearlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb, tmp,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // linearlight mode
        if (r < 128)
        {
            tmp = r*2;
            rb = (tmp + r2 < 255) ? 0 : tmp + r2 - 255; //blendModes.linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r - 128);
            rb = tmp + r2; //blendModes.linearDodge(a, (2 * (b - 128)))
        }
        if (g < 128)
        {
            tmp = g*2;
            gb = (tmp + g2 < 255) ? 0 : tmp + g2 - 255; //blendModes.linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g - 128);
            gb = tmp + g2; //blendModes.linearDodge(a, (2 * (b - 128)))
        }
        if (b < 128)
        {
            tmp = b*2;
            bb = (tmp + b2 < 255) ? 0 : tmp + b2 - 255; //blendModes.linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (b - 128);
            bb = tmp + b2; //blendModes.linearDodge(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    reflect: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // reflect mode
        rb = (255 == r) ? r : Min(255, (r2 * r2 / (255 - r))); 
        gb = (255 == g) ? g : Min(255, (g2 * g2 / (255 - g))); 
        bb = (255 == b) ? b : Min(255, (b2 * b2 / (255 - b))); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    // reverse of reflect
    glow: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // glow mode, reverse of reflect
        rb = (255 == r2) ? r2 : Min(255, (r * r / (255 - r2))); 
        gb = (255 == g2) ? g2 : Min(255, (g * g / (255 - g2))); 
        bb = (255 == b2) ? b2 : Min(255, (b * b / (255 - b2))); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    phoenix: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // phoenix mode
        rb = Min(r2, r) - Max(r2, r) + 255; 
        gb = Min(g2, g) - Max(g2, g) + 255; 
        bb = Min(b2, b) - Max(b2, b) + 255; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    vividlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb, tmp,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // vividlight mode
        if (r < 128)
        {
            tmp = 2*r;
            rb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - r2) << 8 ) / tmp));  //blendModes.colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            rb = (255 == tmp) ? tmp : Min(255, ((r2 << 8 ) / (255 - tmp)));  // blendModes.colorDodge(a, (2 * (b - 128)))
        }
        if (g < 128)
        {
            tmp = 2*g;
            gb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - g2) << 8 ) / tmp));  //blendModes.colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g-128);
            gb = (255 == tmp) ? tmp : Min(255, ((g2 << 8 ) / (255 - tmp)));  // blendModes.colorDodge(a, (2 * (b - 128)))
        }
        if (b < 128)
        {
            tmp = 2*b;
            bb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - b2) << 8 ) / tmp));  //blendModes.colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g-128);
            bb = (255 == tmp) ? tmp : Min(255, ((b2 << 8 ) / (255 - tmp)));  // blendModes.colorDodge(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    pinlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb, tmp,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // pinlight mode
        if (r < 128)
        {
            tmp = 2*r;
            rb = (tmp > r2) ? tmp : r2;  //blendModes.darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            rb = (tmp > r2) ? r2 : tmp;  // blendModes.lighten(a, (2 * (b - 128)))
        }
        if (g < 128)
        {
            tmp = 2*g;
            gb = (tmp > g2) ? tmp : g2;  //blendModes.darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            gb = (tmp > g2) ? g2 : tmp;  // blendModes.lighten(a, (2 * (b - 128)))
        }
        if (b < 128)
        {
            tmp = 2*b;
            bb = (tmp > b2) ? tmp : b2;  //blendModes.darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (b-128);
            bb = (tmp > b2) ? b2 : tmp;  // blendModes.lighten(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    hardmix: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb, tmp,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // hardmix mode, blendModes.vividLight(a, b) < 128 ? 0 : 255;
        if (r < 128)
        {
            tmp = 2*r;
            rb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - r2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (r-128);
            rb = (255 == tmp) ? tmp : Min(255, ((r2 << 8 ) / (255 - tmp)));
        }
        rb = (rb < 128) ? 0 : 255;
        if (g < 128)
        {
            tmp = 2*g;
            gb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - g2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (g-128);
            gb = (255 == tmp) ? tmp : Min(255, ((g2 << 8 ) / (255 - tmp)));
        }
        gb = (gb < 128) ? 0 : 255;
        if (b < 128)
        {
            tmp = 2*b;
            bb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - b2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (b-128);
            bb = (255 == tmp) ? tmp : Min(255, ((b2 << 8 ) / (255 - tmp)));
        }
        bb = (bb < 128) ? 0 : 255;
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    }
};
// aliases
blend_functions.lineardodge = blend_functions.add;
blend_functions.linearburn = blend_functions.subtract;

//
//
// a photoshop-like Blend Filter Plugin
FILTER.Create({
    name: "BlendFilter"
    
    // parameters
    ,_blendMode: null
    ,_blendImage: null
    ,blendImage: null
    ,startX: 0
    ,startY: 0
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( ModuleFactory__FILTER_PLUGINS.moduleUri )
    
    // constructor
    ,init: function( blendImage, blendMode ) { 
        var self = this;
        self.startX = 0;
        self.startY = 0;
        self._blendImage = null;
        self.blendImage = null;
        self._blendMode = null;
        if ( blendImage ) self.setImage( blendImage );
        if ( blendMode ) self.setMode( blendMode );
    }
    
    ,dispose: function( ) {
        var self = this;
        self.blendImage = null;
        self._blendImage = null;
        self._blendMode = null;
        self.$super('dispose');
        return self;
    }
    
    // set blend image auxiliary method
    ,setImage: function( blendImage ) {
        var self = this;
        if ( blendImage )
        {
            self.blendImage = blendImage;
            self._blendImage = { data: blendImage.getData( ), width: blendImage.width, height: blendImage.height };
        }
        else
        {
            self.blendImage = null;
            self._blendImage = null;
        }
        return self;
    }
    
    // set blend mode auxiliary method
    ,setMode: function( blendMode ) {
        var self = this;
        if ( blendMode )
        {
            self._blendMode = (''+blendMode).toLowerCase();
            if ( !blend_functions[HAS](self._blendMode) ) self._blendMode = null;
        }
        else
        {
            self._blendMode = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _blendImage: self._blendImage
                ,_blendMode: self._blendMode
                ,startX: self.startX
                ,startY: self.startY
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.startX = params.startX;
            self.startY = params.startY;
            self._blendImage = params._blendImage;
            self.setMode( params._blendMode );
        }
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self.startX = 0;
        self.startY = 0;
        self._blendMode = null;
        return self;
    }
    
    // main apply routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !self._blendMode || !self._blendImage ) return im;
        
        var startX = self.startX||0, startY = self.startY||0, 
            startX2 = 0, startY2 = 0, W, H, im2, w2, h2, 
            W1, W2, start, end, x, y, x2, y2,
            image2 = self._blendImage, pix2,
            blend = blend_functions[ self._blendMode ]
        ;
        
        //if ( !blend ) return im;
        
        if (startX < 0) { startX2 = -startX;  startX = 0; }
        if (startY < 0) { startY2 = -startY;  startY = 0; }
        
        w2 = image2.width; h2 = image2.height;
        if (startX >= w || startY >= h) return im;
        if (startX2 >= w2 || startY2 >= h2) return im;
        
        startX = Round(startX); startY = Round(startY);
        startX2 = Round(startX2); startY2 = Round(startY2);
        W = Min(w-startX, w2-startX2); H = Min(h-startY, h2-startY2);
        if (W <= 0 || H <= 0) return im;
        
        im2 = image2.data;
        
        // blend images
        x = startX; y = startY*w;
        x2 = startX2; y2 = startY2*w2;
        W1 = startX+W; W2 = startX2+W;
        start = 0; end = H*W;
        while (start<end)
        {
            pix2 = (x2 + y2)<<2;
            // blend only if im2 has opacity in this point
            if ( im2[pix2+3] ) 
                // calculate and assign blended color
                blend(im, (x + y)<<2, im2, pix2);
            
            // next pixels
            start++;
            x++; if (x>=W1) { x = startX; y += w; }
            x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
        }
        return im; 
    }
});

}(FILTER);