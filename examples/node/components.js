"use strict";

var args = require('./commargs.js')(),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!args.options['parallel'],
    connected_components = F.ConnectedComponentsFilter(8, null, null, true)/*.setMode(F.MODE.GRAY)*/;

console.log('Filter runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) connected_components.worker(true);
console.log('Loading..');
fs.readFile(__dirname+'/snoopy.gif', function(err, buf) {
    if (err) console.log('error while reading image: ' + err.toString());
    F.Image.load(buf, function(img) {
        console.log('Procesing..');
        connected_components.apply(img, function() {
            if (parallel) connected_components.worker(false);
            console.log('Saving..');
            img.oCanvas.toPNG().then(function(png) {
                fs.writeFile(__dirname+'/snoopy_components.png', png, function(err) {
                    if (err) console.log('error while saving image: ' + err.toString());
                    else console.log('image saved');
                })
            }).catch(function(err) {
                console.log('error while exporting image: ' + err.toString());
            });
        });
    });
});
