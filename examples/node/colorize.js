"use strict";

var args = require('./commargs.js')(),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!args.options['parallel'],
    colorize = F.ColorMatrixFilter().colorize(0xff0010);

console.log('Filter runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) colorize.worker(true);
console.log('Loading..');
fs.readFile(__dirname+'/che.jpg', function(err, buf) {
    if (err) console.log('error while reading image: ' + err.toString());
    F.Image.load(buf, function(img) {
        console.log('Procesing..');
        colorize.apply(img, function() {
            if (parallel) colorize.worker(false);
            console.log('Saving..');
            img.oCanvas.toPNG().then(function(png) {
                fs.writeFile(__dirname+'/che_colorize.png', png, function(err) {
                    if (err) console.log('error while saving image: ' + err.toString());
                    else console.log('image saved');
                })
            }).catch(function(err) {
                console.log('error while exporting image: ' + err.toString());
            });
        });
    });
});
