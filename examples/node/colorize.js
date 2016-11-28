"use strict";

var parse_args = require('./commargs.js'),
    path = require('path'),
    F = require('../../build/filter.bundle.js'),
    colorize = F.ColorMatrixFilter().colorize(0xff0010),
    binaryManager = F.IO.BinaryManager( F.Codec.JPG, {quality: 100} );

console.log('Loading image..');
binaryManager.read( path.join(__dirname,'./fidel_halfone.jpg'), function( che ){
    console.log('./fidel_halfone.jpg' + ' loaded with dims: ' + che.width + ',' + che.height);
    console.log('Processing..');
    colorize.apply( che, function( ){
        console.log('Saving..');
        binaryManager.write( path.join(__dirname,'./fidel_halfone.jpg'), che,
        function( file ){
            console.log('image saved to: ' + './fidel_halfone.jpg');
        }, function( err ){
            console.log('error while saving image: ' + err);
        });
    });
});