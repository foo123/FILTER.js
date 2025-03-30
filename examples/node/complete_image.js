"use strict";

var parse_args = require('./commargs.js'),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!parse_args().options['parallel'],
    completer = F.PatchMatchFilter(),
    image = __dirname+'/t009.jpg',
    markup = __dirname+'/m009.png',
    donor = null,
    output = __dirname+'/t009_inpainted.png';

console.log('Editing runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) completer.worker(true);
console.log('Loading images..');

F.Image.load(image, function(img) {
    F.Image.load(markup, function(part_to_remove) {
        function inpaint(toSelection, fromSelection)
        {
            console.log('Completing image..')
            completer.params({
                patch: 3,
                radius: 200,
                alpha: 0.5,
                threshold: 0,
                delta: 1e-4,
                epsilon: 0,
                repeat: 10000,
                evaluate: "block",
                multiscale: true,
                strict: true,
                gradients: true,
                bidirectional: false,
                fromSelection: {x:0, y:0, width:img.width, height:img.height, points:fromSelection.points(), data:fromSelection.input||null},
                toSelection: {x:0, y:0, width:img.width, height:img.height, points:toSelection.points()}
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
        }
        const removeSelection = new F.Util.Image.Selection(part_to_remove.getData(), img.width, img.height, 4);
        if (donor)
        {
            F.Image.load(donor, function(donor_part) {
                inpaint(removeSelection, new F.Util.Image.Selection(donor_part.getData(), img.width, img.height, 4));
            });
        }
        else
        {
            inpaint(removeSelection, removeSelection.complement());
        }
    });
});
