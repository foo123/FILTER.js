/**
*
* Perlin Noise Plugin
* @package FILTER.js
*
**/
!function(FILTER){
@@USE_STRICT@@

var PROTO = 'prototype';

function Grad( x, y, z ) 
{
    var self = this;
    self.x = x; self.y = y; self.z = z;
}
Grad[PROTO].dot2 = function(x, y) {
    return this.x*x + this.y*y;
};
Grad[PROTO].dot3 = function(x, y, z) {
    return this.x*x + this.y*y + this.z*z;
};

var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
           new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
           new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

var p = [151,160,137,91,90,15,
131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
// To remove the need for index wrapping, double the permutation table length
var perm = new Array(512);
var gradP = new Array(512);

// This isn't a very good seeding function, but it works ok. It supports 2^16
// different seed values. Write something better if you need more seeds.
function seed( seed ) 
{
    if ( seed > 0 && seed < 1 ) 
        // Scale the seed out
        seed *= 65536;

    seed = Math.floor( seed );
    if ( seed < 256 ) seed |= seed << 8;

    for (var i = 0; i < 256; i++) 
    {
        var v;
        if ( i & 1 ) 
        {
            v = p[i] ^ (seed & 255);
        } 
        else 
        {
            v = p[i] ^ ((seed>>8) & 255);
        }

        perm[i] = perm[i + 256] = v;
        gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
}
//seed(0);

// Skewing and unskewing factors for 2, 3, and 4 dimensions
var F2 = 0.5*(Math.sqrt(3)-1),
    G2 = (3-Math.sqrt(3))/6,
    F3 = 1/3,
    G3 = 1/6
;

// 2D simplex noise
function simplex2( xin, yin ) 
{
    var n0, n1, n2; // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin)*F2; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var t = (i+j)*G2;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if ( x0>y0 ) 
    { 
        // lower triangle, XY order: (0,0)->(1,0)->(1,1)
        i1=1; j1=0;
    } 
    else 
    {    
        // upper triangle, YX order: (0,0)->(0,1)->(1,1)
        i1=0; j1=1;
    }
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1 + 2 * G2;
    // Work out the hashed gradient indices of the three simplex corners
    i &= 255; j &= 255;
    var gi0 = gradP[i+perm[j]];
    var gi1 = gradP[i+i1+perm[j+j1]];
    var gi2 = gradP[i+1+perm[j+1]];
    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0*x0-y0*y0;
    if ( t0<0 ) 
    {
        n0 = 0;
    } 
    else 
    {
        t0 *= t0;
        n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.5 - x1*x1-y1*y1;
    if ( t1<0 ) 
    {
        n1 = 0;
    } 
    else 
    {
        t1 *= t1;
        n1 = t1 * t1 * gi1.dot2(x1, y1);
    }
    var t2 = 0.5 - x2*x2-y2*y2;
    if ( t2<0 ) 
    {
        n2 = 0;
    } 
    else 
    {
        t2 *= t2;
        n2 = t2 * t2 * gi2.dot2(x2, y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70 * (n0 + n1 + n2);
}

// ##### Perlin noise stuff

function fade( t ) 
{
    return t*t*t*(t*(t*6-15)+10);
}

function lerp( a, b, t ) 
{
    return (1-t)*a + t*b;
}

// 2D Perlin Noise
function perlin2( x, y ) 
{
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y);
    // Get relative xy coordinates of point within that cell
    x = x - X; y = y - Y;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255;

    // Calculate noise contributions from each of the four corners
    var n00 = gradP[X+perm[Y]].dot2(x, y);
    var n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
    var n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
    var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);

    // Compute the fade curve value for x
    var u = fade(x);

    // Interpolate the four results
    return lerp(
        lerp(n00, n10, u),
        lerp(n01, n11, u),
        fade(y)
    );
}


// an efficient perlin noise and simplex plugin
// adapted from: https://github.com/josephg/noisejs
// Based on example code by Stefan Gustavson (stegu@itn.liu.se).
// Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
// Better rank ordering method by Stefan Gustavson in 2012.
// Converted to Javascript by Joseph Gentle.
// http://en.wikipedia.org/wiki/Perlin_noise
FILTER.Create({
    name: "PerlinNoiseFilter"
    
    // parameters
    ,baseX: 1
    ,baseY: 1
    ,offsetX: 0
    ,offsetY: 0
    ,seed: 0
    ,colors: null
    ,perlin: false
    
    // constructor
    ,init: function( baseX, baseY, offsetX, offsetY, seed, colors, is_perlin ) {
        var self = this;
        self.baseX = baseX || 1;
        self.baseY = baseY || 1;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        self.seed = seed || 0;
        self.colors = colors || null;
        self.perlin = !!is_perlin;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 baseX: self.baseX
                ,baseY: self.baseY
                ,offsetX: self.offsetX
                ,offsetY: self.offsetY
                ,seed: self.seed
                ,colors: self.colors
                ,perlin: self.perlin
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.baseX = params.baseX;
            self.baseY = params.baseY;
            self.offsetX = params.offsetX;
            self.offsetY = params.offsetY;
            self.seed = params.seed;
            self.colors = params.colors;
            self.perlin = params.perlin;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this, baseX = self.baseX, baseY = self.baseY,
            offsetX = self.offsetX, offsetY = self.offsetY,
            colors = self.colors, floor = Math.floor,
            is_grayscale = !colors || !colors.length,
            is_perlin = self.perlin,
            i, l = im.length, x, y, n, c
        ;
        
        seed( self.seed );
        
        i=0; x=0; y=0;
        if ( is_perlin )
        {
            for (i=0; i<l; i+=4, x++)
            {
                if (x>=w) { x=0; y++; }
                n = 0.5*(1+perlin2( ((x+offsetX)%w)/baseX, ((y+offsetY)%h)/baseY ));
                if ( is_grayscale )
                {
                    im[i] = im[i+1] = im[i+2] = ~~(255*n);
                }
                else
                {
                    c = colors[floor(n*(colors.length-1))];
                    im[i] = c[0]; im[i+1] = c[1]; im[i+2] = c[2];
                }
            }
        }
        else
        {
            for (i=0; i<l; i+=4, x++)
            {
                if (x>=w) { x=0; y++; }
                n = 0.5*(1+simplex2( ((x+offsetX)%w)/baseX, ((y+offsetY)%h)/baseY ));
                if ( is_grayscale )
                {
                    im[i] = im[i+1] = im[i+2] = ~~(255*n);
                }
                else
                {
                    c = colors[floor(n*(colors.length-1))];
                    im[i] = c[0]; im[i+1] = c[1]; im[i+2] = c[2];
                }
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);