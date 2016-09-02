"use strict";

var path = require('path'),
    parse_args = require('./commargs.js'),
    F = require('../../build/filter.bundle.js'),
    args = parse_args(),
    type = (args.options['pattern'] || 'squ').toLowerCase().slice(0,3),
    scale = parseFloat(args.options['scale']||'5', 10),
    pattern = 'hex'===type ? 'hexagonal' : ('rho'===type ? 'rhomboidal' : ('tri'===type ? 'triangular' : 'rectangular')),
    pixelate = new F.PixelateFilter( scale, pattern ),
    binaryManager = F.IO.BinaryManager( F.Codec.JPG, {quality: 100} );

console.log('Pixelation = "' + pattern + '" '+scale+'%');
console.log('Loading..');
binaryManager.read( path.join(__dirname,'./che.jpg'), function( che ){
    console.log('Procesing..');
    pixelate.apply( che, function( ){
        console.log('Saving..');
        binaryManager.write( path.join(__dirname,'./che_pixelate.jpg'), che,
        function( file ){
            console.log('image saved to: ' + './che_pixelate.jpg');
        }, function( err ){
            console.log('error while saving image: ' + err);
        });
    });
}, function( err ){
    console.log('error while loading image: ' + err);
});

