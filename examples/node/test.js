"use strict";

var parse_args = require('./commargs.js'),
    path = require('path'),
    F = require('../../build/filter.bundle.js'),
    parallel = !!parse_args().options['parallel'],
    binaryManager = F.IO.BinaryManager( F.Codec.JPG, {quality: 100} );

console.log('Test runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
var grayscale = new F.ColorMatrixFilter( ).grayscale( ).contrast( 1 );
if ( parallel ) grayscale.worker( true );
console.log('Loading image..');
binaryManager.read( path.join(__dirname,'./che.jpg'), function( che ){
    console.log('./che.jpg' + ' loaded with dims: ' + che.width + ',' + che.height);
    console.log('Applying grayscale filter..');
    grayscale.apply( che, function( ){
        if ( parallel ) grayscale.worker( false );
        console.log('Saving grayscaled image..');
        binaryManager.write( path.join(__dirname,'./che_grayscale.jpg'), che,
        function( file ){
            console.log('grayscale image saved to: ' + './che_grayscale.jpg');
        }, function( err ){
            console.log('error while saving image: ' + err);
        });
    });
});