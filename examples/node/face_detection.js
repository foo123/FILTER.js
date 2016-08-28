"use strict";

var parse_args = require('./commargs.js'),
    path = require('path'),
    F = require('../../build/filter.bundle.js'),
    parallel = !!parse_args().options['parallel'],
    haarcascade_frontalface_alt = require('./haarcascade_frontalface_alt.js'),
    face_detector = F.CompositeFilter([
        F.ColorMatrixFilter().grayscale(),
        F.HaarDetectorFilter(haarcascade_frontalface_alt)
    ]),
    binaryManager = F.IO.BinaryManager( F.Codec.JPG );

console.log('Detection runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if ( parallel ) face_detector.worker( true );
console.log('Loading image..');
binaryManager.read( path.join(__dirname,'./che.jpg'), function( che ){
    console.log('./che.jpg' + ' loaded with dims: ' + che.width + ',' + che.height);
    console.log('Detecting..');
    face_detector.apply( che, function( ){
        if ( parallel ) face_detector.worker( false );
        console.log('Detection completed');
        var features = face_detector.filter(1).metaData().objects;
        console.log(features.length + (1 === features.length ? ' feature was found' : ' features were found'));
        if ( features.length )
        {
            console.log('1st feature is found at x1:' + features[0].x1 + ',y1:' + features[0].y1 + ',x2:' + features[0].x2 + ',y2:' + features[0].y2);
        }
    });
});