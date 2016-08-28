"use strict";

var parse_args = require('./commargs.js'),
    path = require('path'),
    F = require('../../build/filter.bundle.js'),
    perlin, binaryManager = F.IO.BinaryManager( F.Codec.JPG );

console.log('Generating perlin noise..');
perlin = F.Image.PerlinNoise(
    200 /* width */, 200 /* height */,
    Math.random( ),/* seed */
    false/* seamless pattern */,
    true/* grayscale */,
    80/* baseX */, 50/* baseY */,
    4/* num octaves */,
    [[0,0],[10,10],[20,10],[10,20]] /* octave offsets */
);
console.log('Saving perlin noise..');
binaryManager.write( path.join(__dirname,'./perlin.jpg'), perlin,
function( file ){
    console.log('perlin noise saved to: ' + './perlin.jpg');
}, function( err ){
    console.log('error while saving image: ' + err);
});
