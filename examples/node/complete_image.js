"use strict";

var parse_args = require('./commargs.js'),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!parse_args().options['parallel'],
    completer = F.PatchMatchFilter(),
    image = __dirname+'/t009.jpg',
    markup = __dirname+'/m009.png',
    output = __dirname+'/t009_completed.png';

console.log('Editing runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) completer.worker(true);
console.log('Loading images..');

F.Image.load(image, function(img) {
    F.Image.load(markup, function(part_to_remove) {
        const removeArea = new F.Util.Image.Selection(part_to_remove.getData(), img.width, img.height, 4);
        const fromArea = removeArea.complement();
        console.log('Completing image..')
        completer.params({
            patch: 5,
            radius: 100,
            alpha: 0.7,
            threshold: 0.05,
            delta: 0.0012,
            epsilon: 0.0012,
            repeat: 10,
            evaluate: "block",
            pyramid: true,
            strict: true,
            bidirectional: false,
            fromArea: {x:0, y:0, width:img.width, height:img.height, points:fromArea.points()},
            toArea: {x:0, y:0, width:img.width, height:img.height, points:removeArea.points()}
        }).apply(img, function () {
            console.log('Editing completed', completer.meta.metric);
            if (parallel) completer.worker(false);
            img.oCanvas.toPNG().then(function(png) {
                fs.writeFile(output, png, function(err) {
                    if (err) console.log('error while saving image: ' + err.toString());
                    else console.log('Edited image saved');
                })
            }).catch(function(err) {
                console.log('error while saving image: ' + err.toString());
            });
        });
    });
});
