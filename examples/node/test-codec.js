"use strict";

var parse_args = require('./commargs.js'),
    path = require('path'),
    F = require('../../build/filter.bundle.js'),
    imgFormat = F.IO.BinaryManager( F.Codec.PNG, {deflateLevel: 9} );

console.log('Loading image..');
imgFormat.read( path.join(__dirname,'./yin_yang_blank.png'), function( yin_yang ){
    console.log('./yin_yang.png' + ' loaded with dims: ' + yin_yang.width + ',' + yin_yang.height);
    console.log('Saving image..');
    imgFormat.write( path.join(__dirname,'./yin_yang_copy.png'), yin_yang,
    function( file ){
        console.log('image saved to: ' + './yin_yang_copy.png');
    }, function( err ){
        console.log('error while saving image: ' + err);
    });
}, function( err ){
    console.log( err.toString() );
});