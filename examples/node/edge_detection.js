"use strict";

var args = require('./commargs.js')(),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!args.options['parallel'],
    edge_detector = F.CompositeFilter([
        F.ColorMatrixFilter().grayscale(),
        //F.HistogramEqualizeFilter(F.MODE.GRAY),
        F.ConvolutionMatrixFilter().fastGauss(6, 3).setMode(F.MODE.GRAY),
        F.CannyEdgesFilter(35, 70, false)
    ]);

console.log('Detection runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) edge_detector.worker(true);
console.log('Loading..');
fs.readFile(__dirname+'/che.jpg', function(err, buffer) {
    if (err) console.log('error while reading image: ' + err.toString());
    else F.Image.load(buffer, function(img) {
        console.log('Detecting..');
        edge_detector.apply(img, function() {
            if (parallel) edge_detector.worker(false);
            console.log('Saving..');
            img.oCanvas.toPNG().then(function(png) {
                fs.writeFile(__dirname+'/che_edges.png', png, function(err) {
                    if (err) console.log('error while saving image: ' + err.toString());
                    else console.log('image saved');
                })
            }).catch(function(err) {
                console.log('error while exporting image: ' + err.toString());
            });
        });
    });
});
