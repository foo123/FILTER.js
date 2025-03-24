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
        const removeArea = new F.Util.Image.Selection(part_to_remove.getData(), img.width, img.height, 4, {x:0, y:0, width:img.width, height:img.height});
        const fromArea = removeArea.complement();
        console.log('Completing image..')
        completer.params({
            patch: 5,
            radius: 20,
            pyramid: {iterations:5, changedThreshold:0.02, diffThreshold:0.1},
            op: "patch",
            strict: true,
            fromArea: {x:0, y:0, width:img.width, height:img.height, points:fromArea.points()},
            toArea: {x:0, y:0, width:img.width, height:img.height, points:removeArea.points()}
        }).apply(img, function () {
            console.log('Editing completed');
            if (parallel) completer.worker(false);
            img.oCanvas.toPNG().then(function(png) {
                fs.writeFile(output, png, function(err) {
                    if (err) console.log('error while saving image: ' + err.toString());
                    else console.log('edited image saved');
                })
            }).catch(function(err) {
                console.log('error while saving image: ' + err.toString());
            });
        });
    });
});
