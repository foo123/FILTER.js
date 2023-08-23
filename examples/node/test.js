"use strict";

var parse_args = require('./commargs.js'),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    filter, input, output,
    args = parse_args(),
    parallel = !!args.options['parallel'],
    wasm = !!args.options['wasm'];

console.log('Test runs "' + (parallel ? 'parallel' : 'synchronous') + (wasm ? ' in assembly' : ' in javascript') + '"');

filter = new F.ColorMatrixFilter().grayscale().contrast(1);
input = __dirname+'/che.jpg';
output = __dirname+'/che_grayscale.png';
if (wasm) filter.makeWASM(true);
if (parallel) filter.worker(true);

console.log('Loading image..');
fs.readFile(input, function(err, buffer) {
    if (err) console.log('error while reading image: ' + err.toString());
    else F.Image.load(buffer, function(img) {
        console.log('image loaded with dims: ' + img.width + ',' + img.height);
        console.log('Applying filter..');
        filter.apply(img, function() {
            if (parallel) filter.worker(false);
            console.log('Saving filtered image..');
            img.oCanvas.toPNG().then(function(png) {
                fs.writeFile(output, png, function(err) {
                    if (err) console.log('error while saving image: ' + err.toString());
                    else console.log('filtered image saved');
                })
            }).catch(function(err) {
                console.log('error while saving image: ' + err.toString());
            });
        });
    });
});