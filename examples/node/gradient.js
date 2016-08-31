"use strict";

var parse_args = require('./commargs.js'),
    path = require('path'),
    F = require('../../build/filter.bundle.js'),
    radial = !!parse_args().options['radial'], gradient,
    binaryManager = F.IO.BinaryManager( F.Codec.JPG, {quality: 100} );

console.log('Generating '+(radial?'radial':'linear')+' gradient..');
gradient = radial ? F.Image.RadialGradient(
    200, 200, /* width,height */
    [[255,0,0,255],[0,255,0,255],[0,0,255,255]], /* colors rgba */
    [0, 0.2, 1], /* color stops, leave empty/null for uniform stops */
    100, 100, /* centerX,centerY, default 0,0 */
    0.5, 1 /* radiusX,radiusY, default 1,1 */
) : F.Image.LinearGradient(
    200, 200, /* width,height */
    [[255,0,0,255],[0,255,0,255],[0,0,255,255]], /* colors rgba */
    [0, 0.7, 1], /* color stops, leave empty/null for uniform stops */
    -Math.PI/4 /* angle 0 - 2Math.PI, default 0 */
);
console.log('Saving gradient..');
binaryManager.write( path.join(__dirname,'./gradient.jpg'), gradient,
function( file ){
    console.log('gradient image saved to: ' + './gradient.jpg');
}, function( err ){
    console.log('error while saving image: ' + err);
});
