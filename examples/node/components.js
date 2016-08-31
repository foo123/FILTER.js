"use strict";

var parse_args = require('./commargs.js'),
    path = require('path'),
    F = require('../../build/filter.bundle.js'),
    connected_components = F.ConnectedComponentsFilter(),
    binaryManager = F.IO.BinaryManager();

binaryManager.codec( F.Codec.GIF ).read( path.join(__dirname,'./snoopy.gif'), function( snoopy ){
    console.log('./snoopy.gif' + ' loaded with dims: ' + snoopy.width + ',' + snoopy.height);
    console.log('Finding connected components..');
    connected_components.apply( snoopy, function( ){
        console.log('Saving connected components image..');
        binaryManager.codec( F.Codec.JPG ).options({quality: 100}).write( path.join(__dirname,'./snoopy_components.jpg'), snoopy,
        function( file ){
            console.log('image saved to: ' + './snoopy_components.jpg');
        }, function( err ){
            console.log('error while saving image: ' + err);
        });
    });
});