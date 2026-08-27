"use strict";

var args = require('./commargs.js')(),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!args.options['parallel'],
    type = (args.options['pattern'] || 'squ').toLowerCase().slice(0,3),
    scale = parseFloat(args.options['scale']||'5', 10),
    pattern = 'hex'===type ? 'hexagonal' : ('rho'===type ? 'rhomboidal' : ('tri'===type ? 'triangular' : 'rectangular')),
    pixelate = new F.PixelateFilter(scale, pattern);

console.log('Pixelation = "' + pattern + '" '+scale+'%');
console.log('Filter runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) pixelate.worker(true);
console.log('Loading..');
fs.readFile(__dirname+'/che.jpg', function(err, buf) {
    if (err) console.log('error while reading image: ' + err.toString());
    F.Image.load(buf, function(img) {
        console.log('Procesing..');
        pixelate.apply(img, function() {
            if (parallel) pixelate.worker(false);
            console.log('Saving..');
            img.oCanvas.toPNG().then(function(png) {
                fs.writeFile(__dirname+'/che_pixelate.png', png, function(err) {
                    if (err) console.log('error while saving image: ' + err.toString());
                    else console.log('image saved');
                })
            }).catch(function(err) {
                console.log('error while exporting image: ' + err.toString());
            });
        });
    });
});
