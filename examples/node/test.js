"use strict";

var parse_args = require('./commargs.js'),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!parse_args().options['parallel'];

console.log('Test runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
var grayscale = new F.ColorMatrixFilter().grayscale().contrast(1);
if (parallel) grayscale.worker(true);
console.log('Loading image..');
fs.readFile(__dirname+'/che.jpg', function(err, buffer) {
    var che = F.Canvas.Image();
    che.onload = function() {
        console.log('./che.jpg' + ' loaded with dims: ' + che.width + ',' + che.height);
        console.log('Applying grayscale filter..');
        var img = F.Image(che);
        grayscale.apply(img, function() {
            if (parallel) grayscale.worker(false);
            console.log('Saving grayscaled image..');
            img.oCanvas.toPNG().then(function(png) {
                fs.writeFile(__dirname+'/che_grayscale.png', png, function(err) {
                    if (err) console.log('error while saving image: ' + err);
                    else console.log('grayscaled image saved');
                })
            }).catch(function(err) {
                console.log('error while saving image: ' + err);
            });
        });
    };
    che.src = buffer;
});