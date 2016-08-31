"use strict";

var parse_args = require('./commargs.js'),
    path = require('path'),
    F = require('../../build/filter.bundle.js'),
    parallel = !!parse_args().options['parallel'],
    edge_detector = F.CompositeFilter([
        F.ColorMatrixFilter().grayscale(),
        F.HistogramEqualizeFilter(F.MODE.GRAY),
        F.ConvolutionMatrixFilter().fastGauss(6, 3).setMode(F.MODE.GRAY),
        F.CannyEdgesFilter(35, 70, false)
    ]),
    binaryManager = F.IO.BinaryManager( F.Codec.JPG, {quality: 100} );

console.log('Detection runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if ( parallel ) edge_detector.worker( true );
console.log('Loading image..');
binaryManager.read( path.join(__dirname,'./che.jpg'), function( che ){
    console.log('./che.jpg' + ' loaded with dims: ' + che.width + ',' + che.height);
    console.log('Detecting..');
    edge_detector.apply( che, function( ){
        if ( parallel ) edge_detector.worker( false );
        console.log('Detection completed');
        binaryManager.write( path.join(__dirname,'./che_edges.jpg'), che,
        function( file ){
            console.log('image saved to: ' + './che_edges.jpg');
        }, function( err ){
            console.log('error while saving image: ' + err);
        });
    });
});