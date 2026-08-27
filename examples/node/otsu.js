"use strict";

var args = require('./commargs.js')(),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    filter, input, output,
    parallel = !!args.options['parallel'],
    wasm = !!args.options['wasm'];

console.log('Test runs "' + (parallel ? 'parallel' : 'synchronous') /*+ (wasm ? ' in assembly' : ' in javascript')*/ + '"');

filter = F.CompositeFilter([
//F.ColorMatrixFilter().grayscale(),
F.OtsuThresholdFilter(F.MODE.RGB, 0, 0xffffff, 0, 10)
]);
input = __dirname+'/che.jpg';
output = __dirname+'/che_otsu.png';
//if (wasm) filter.makeWASM(true);
if (parallel) filter.worker(true);

console.log('Loading..');
fs.readFile(input, function(err, buffer) {
    if (err) console.log('error while reading image: ' + err.toString());
    else F.Image.load(buffer, function(img) {
        console.log('Processing..');
        filter.apply(img, function() {
            if (parallel) filter.worker(false);
            console.log('Saving..');
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