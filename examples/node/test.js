"use strict";

var path = require('path');
var F = require('../../build/filter.bundle'),
    grayscale = new F.ColorMatrixFilter( ).grayscale( ).contrast( 1 ),
    che_file = path.join(__dirname, './che.jpg')
;

console.log('Loading image..');
F.BinaryReader( F.Codec.JPG.decoder ).load(che_file, function( che ){
    console.log('./che.jpg' + ' loaded with dims: ' + che.width + ',' + che.height);
    console.log('Applying grayscale filter..');
    grayscale.apply( che );
    console.log('Saving grayscaled image..');
    F.BinaryWriter( F.Codec.JPG.encoder ).write(path.join(__dirname, './che_grayscale.jpg'), che,
    function( file ){
        console.log('grayscale image saved to: ' + './che_grayscale.jpg');
    }, function( err ){
        console.log('error while saving image: ' + err);
    });
});
