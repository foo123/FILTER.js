"use strict";

var parse_args = require('./commargs.js'),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!parse_args().options['parallel'],
    inpainter = F.PatchMatchFilter(),
    target = __dirname+'/t067.jpg',
    markup = __dirname+'/m067.png',
    source = null,
    output = __dirname+'/r067.png';

console.log('Inpainting runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) inpainter.worker(true);
console.log('Loading images..');

F.Image.load(target, function(img) {
    F.Image.load(markup, function(mkup) {
        function inpaint(toSelection, fromSelection, fromInput)
        {
            console.log('Inpainting image..')
            if (fromInput) inpainter.setInput("input", fromInput);
            inpainter.params({
                patch: 11,
                iterations: 15,
                alpha: 0.5,
                radius: 50,
                threshold: 0,
                delta: 1/100,
                epsilon: 0,
                ignore_excluded: false,
                with_gradients: true,
                without_distance_transform: false,
                kernel: 0,
                bidirectional: false,
                evaluate: "block",
                repeat: 2,
                multiscale: true,
                fromSelection: {points:fromSelection.points(), data:fromInput?"input":null},
                toSelection: {points:toSelection.points()}
            }).apply(img, function () {
                console.log('Inpainting completed', inpainter.meta.metric.delta, inpainter.meta.metric.error);
                if (parallel) inpainter.worker(false);
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
        // eg remove part/complete image
        const removeSelection = new F.Util.Image.Selection(mkup.getData(), img.width, img.height, 4);
        if (source)
        {
            F.Image.load(source, function(src) {
                inpaint(removeSelection, new F.Util.Image.Selection(src.getData(), img.width, img.height, 4), src);
            });
        }
        else
        {
            inpaint(removeSelection, removeSelection.complement());
        }
    });
});
