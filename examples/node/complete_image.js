"use strict";

var parse_args = require('./commargs.js'),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!parse_args().options['parallel'],
    completer = F.PatchMatchFilter(),
    target = __dirname+'/t009.jpg',
    markup = __dirname+'/m009.png',
    source = null,
    output = __dirname+'/t009_inpainted.png';

console.log('Inpainting runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) completer.worker(true);
console.log('Loading images..');

F.Image.load(target, function(img) {
    F.Image.load(markup, function(mkup) {
        function inpaint(toSelection, fromSelection)
        {
            console.log('Inpainting image..')
            completer.params({
                patch: 5,
                alpha: 0.5,
                radius: 200,
                threshold: 0,
                delta: 1/100,
                epsilon: 0,
                strict: true,
                gradients: true,
                bidirectional: false,
                evaluate: "block",
                repeat: 1,
                multiscale: true,
                fromSelection: {x:0, y:0, width:img.width, height:img.height, points:fromSelection.points()},
                toSelection: {x:0, y:0, width:img.width, height:img.height, points:toSelection.points()}
            }).apply(img, function () {
                console.log('Inpainting completed', completer.meta.metric);
                if (parallel) completer.worker(false);
                img.oCanvas.toPNG().then(function(png) {
                    fs.writeFile(output, png, function(err) {
                        if (err) console.log('error while saving image: ' + err.toString());
                        else console.log('Inpainted image saved');
                    })
                }).catch(function(err) {
                    console.log('error while exporting image: ' + err.toString());
                });
            });
        }
        const removeSelection = new F.Util.Image.Selection(mkup.getData(), img.width, img.height, 4);
        if (source)
        {
            F.Image.load(source, function(src) {
                inpaint(removeSelection, new F.Util.Image.Selection(src.getData(), img.width, img.height, 4));
            });
        }
        else
        {
            inpaint(removeSelection, removeSelection.complement());
        }
    });
});
