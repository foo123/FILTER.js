"use strict";

var args = require('./commargs.js')(),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!args.options['parallel'],
    halftone = F.CompositeFilter([
        F.ColorMatrixFilter().grayscale(),
        F.HalftoneFilter(1).threshold(0.4)/*.setMode(F.MODE.GRAY)*/
    ]);

console.log('Filter runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) halftone.worker(true);
console.log('Loading..');
fs.readFile(__dirname+'/che.jpg', function(err, buf) {
    if (err) console.log('error while reading image: ' + err.toString());
    F.Image.load(buf, function(img) {
        console.log('Procesing..');
        halftone.apply(img, function() {
            if (parallel) halftone.worker(false);
            console.log('Saving..');
            img.oCanvas.toPNG().then(function(png) {
                fs.writeFile(__dirname+'/che_halfone.png', png, function(err) {
                    if (err) console.log('error while saving image: ' + err.toString());
                    else console.log('image saved');
                })
            }).catch(function(err) {
                console.log('error while exporting image: ' + err.toString());
            });
        });
    });
});
