"use strict";

var parse_args = require('./commargs.js'),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!parse_args().options['parallel'],
    completer = F.PatchMatchFilter(),
    image = __dirname+'/che.jpg',
    markup = __dirname+'/che_mask.png',
    donor = __dirname+'/che_donor.png',
    output = __dirname+'/che_inpainted.png';

console.log('Editing runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) completer.worker(true);
console.log('Loading images..');

F.Image.load(image, function(img) {
    F.Image.load(markup, function(part_to_remove) {
        function inpaint(toArea, fromArea)
        {
            console.log('Completing image..')
            completer.params({
                patch: 45,
                radius: 50,
                alpha: 0.5,
                threshold: 0.05,
                delta: 0.0001,
                epsilon: 0.0002,
                repeat: 5,
                evaluate: "center",
                pyramid: true,
                strict: false,
                bidirectional: false,
                fromArea: {x:0, y:0, width:img.width, height:img.height, points:fromArea.points()},
                toArea: {x:0, y:0, width:img.width, height:img.height, points:toArea.points()}
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
        const removeArea = new F.Util.Image.Selection(part_to_remove.getData(), img.width, img.height, 4);
        if (donor)
        {
            F.Image.load(donor, function(donor_part) {
                inpaint(removeArea, new F.Util.Image.Selection(donor_part.getData(), img.width, img.height, 4));
            });
        }
        else
        {
            inpaint(removeArea, removeArea.complement());
        }
    });
});
