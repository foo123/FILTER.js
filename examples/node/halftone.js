"use strict";

var parse_args = require('./commargs.js'),
    path = require('path'),
    F = require('../../build/filter.bundle.js'),
    halftone = F.CompositeFilter([
        F.ColorMatrixFilter().grayscale(),
        F.HalftoneFilter(1).threshold(0.4)/*.setMode(F.MODE.GRAY)*/
    ]),
    binaryManager = F.IO.BinaryManager( F.Codec.JPG );

console.log('Loading image..');
binaryManager.read( path.join(__dirname,'./che.jpg'), function( che ){
    console.log('./che.jpg' + ' loaded with dims: ' + che.width + ',' + che.height);
    console.log('Processing..');
    halftone.apply( che, function( ){
        console.log('Saving..');
        binaryManager.write( path.join(__dirname,'./che_halfone.jpg'), che,
        function( file ){
            console.log('image saved to: ' + './che_halfone.jpg');
        }, function( err ){
            console.log('error while saving image: ' + err);
        });
    });
});