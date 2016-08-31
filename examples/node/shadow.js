"use strict";

var parse_args = require('./commargs.js'),
    path = require('path'),
    F = require('../../build/filter.bundle.js'),
    shadow_only = !!parse_args().options['shadow'],
    image = F.Image().restorable(false).fill(0, 0, 0, 200, 200),
    shadow = F.CompositeFilter([
        F.GradientFilter( ).radial( [[255,0,0,255], [255,255,255,0]], [0.2,0.3], 0.4, 0.4 ),
        F.DropShadowFilter( 10, 10, shadow_only ? 0xffffff : 0x0, 0.5, 1, shadow_only )
    ]),
    binaryManager = F.IO.BinaryManager( F.Codec.JPG, {quality: 100} )
;

console.log('Applying ..');
shadow.apply( image, function( ){
    console.log('Saving ..');
    binaryManager.write( path.join(__dirname,'./shadow'+(shadow_only?'_only':'')+'.jpg'), image,
    function( file ){
        console.log('image saved to: ' + './shadow'+(shadow_only?'_only':'')+'.jpg');
    }, function( err ){
        console.log('error while saving image: ' + err);
    });
});
