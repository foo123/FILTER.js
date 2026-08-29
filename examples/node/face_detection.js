"use strict";

var args = require('./commargs.js')(),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!args.options['parallel'],
    haarcascade_frontalface_alt = require('./haarcascade_frontalface_alt.js'),
    face_detector = F.CompositeFilter([
        F.ColorMatrixFilter().grayscale(),
        //F.HistogramEqualizeFilter(F.MODE.GRAY),
        F.HaarDetectorFilter(haarcascade_frontalface_alt, 1, 1.2, 0.25, 1, false, 0.2)
    ]).update(false);

console.log('Detection runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) face_detector.worker(true);
console.log('Loading..');
fs.readFile(__dirname+'/che.jpg', function(err, buffer) {
    if (err) console.log('error while reading image: ' + err.toString());
    else F.Image.load(buffer, function(img) {
        console.log('Detecting..');
        face_detector.apply(img, function() {
            if (parallel) face_detector.worker(false);
            var features = face_detector.filter(1).metaData().objects;
            console.log(features.length + (1 === features.length ? ' feature was found' : ' features were found'));
            if (features.length) console.log(JSON.stringify(features));
        });
    });
});
