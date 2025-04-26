"use strict";

var parse_args = require('./commargs.js'),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    filter, input, output, selection,
    args = parse_args(),
    parallel = !!args.options['parallel'],
    wasm = !!args.options['wasm'];

console.log('Test runs "' + (parallel ? 'parallel' : 'synchronous') + (wasm ? ' in assembly' : ' in javascript') + '"');

filter = new F.ColorMatrixFilter().grayscale().contrast(1);
/*filter = new F.FrequencyFilter(function(re, im, i, j, w, h){
    //if (i > 0.2*w || j > 0.2*h) {re = 0; im = 0;}
    return [re, im];
}).setMode(F.MODE.GRAY);*/
input = __dirname+'/che.jpg';
output = __dirname+'/che_selection.png';
selection = __dirname+'/che_mask.png';
if (wasm) filter.makeWASM(true);
if (parallel) filter.worker(true);

console.log('Loading image..');
fs.readFile(input, function(err, buffer) {
    if (err) console.log('error while reading image: ' + err.toString());
    else F.Image.load(buffer, function(img) {
        console.log('image loaded with dims: ' + img.width + ',' + img.height);
        F.Image.load(selection, function(mask) {
            console.log('Applying filter to selection..');
            filter.apply(img.select(new F.Util.Image.Selection(mask.getData(), img.width, img.height, 4)), function() {
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
});