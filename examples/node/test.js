"use strict";

var parse_args = require('./commargs.js'),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    grayscale = new F.ColorMatrixFilter().grayscale().contrast(1),
    parallel = !!parse_args().options['parallel'];

console.log('Test runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) grayscale.worker(true);
console.log('Loading image..');
fs.readFile(__dirname+'/che.jpg', function(err, buffer) {
    if (err) console.log('error while reading image: ' + err.toString());
    else F.Image.load(buffer, function(img) {
        console.log('./che.jpg' + ' loaded with dims: ' + img.width + ',' + img.height);
        console.log('Applying grayscale filter..');
        grayscale.apply(img, function() {
            if (parallel) grayscale.worker(false);
            console.log('Saving grayscaled image..');
            img.oCanvas.toPNG().then(function(png) {
                fs.writeFile(__dirname+'/che_grayscale.png', png, function(err) {
                    if (err) console.log('error while saving image: ' + err.toString());
                    else console.log('grayscaled image saved');
                })
            }).catch(function(err) {
                console.log('error while saving image: ' + err.toString());
            });
        });
    });
});