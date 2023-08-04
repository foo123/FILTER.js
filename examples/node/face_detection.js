"use strict";

var parse_args = require('./commargs.js'),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!parse_args().options['parallel'],
    haarcascade_frontalface_alt = require('./haarcascade_frontalface_alt.js'),
    face_detector = F.CompositeFilter([
        F.ColorMatrixFilter().grayscale(),
        F.HistogramEqualizeFilter(F.MODE.GRAY),
        F.HaarDetectorFilter(haarcascade_frontalface_alt, 1, 1.1, 0.12, 1, 0.2, true)
    ]).update(false);

console.log('Detection runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) face_detector.worker(true);
console.log('Test runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
console.log('Loading image..');
fs.readFile(__dirname+'/che.jpg', function(err, buffer) {
    var che = F.Canvas.Image();
    che.onload = function() {
        console.log('./che.jpg' + ' loaded with dims: ' + che.width + ',' + che.height);
        console.log('Detecting..');
        var img = F.Image(che);
        face_detector.apply(img, function() {
            if (parallel) face_detector.worker(false);
            console.log('Detection completed');
            var features = face_detector.filter(2).metaData().objects;
            console.log(features.length + (1 === features.length ? ' feature was found' : ' features were found'));
            if (features.length) console.log('1st feature is found at :' + JSON.stringify(features[0]));
        });
    };
    che.src = buffer;
});
