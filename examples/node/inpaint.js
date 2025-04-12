"use strict";

var parse_args = require('./commargs.js'),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!parse_args().options['parallel'];

function process(target, markup, source, output, params)
{
    const inpainter = F.PatchMatchFilter();
    console.log('Inpainting runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
    if (parallel) inpainter.worker(true);
    console.log('Loading images..');

    F.Image.load(target, function(img) {
        F.Image.load(markup, function(mkup) {
            function inpaint(toSelection, fromSelection, fromInput)
            {
                console.log('Inpainting image..')
                if (fromInput) inpainter.setInput("input", fromInput);
                params = params || {};
                params.fromSelection = {points:fromSelection.points(), data:fromInput?"input":null};
                params.toSelection = {points:toSelection.points()};
                inpainter.params(params).apply(img, function () {
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
}

/*process(
    __dirname+'/che.jpg',
    __dirname+'/che_mask.png',
    __dirname+'/che_donor.png',
    __dirname+'/che_inpainted.png',
    {
    patch: 101,
    iterations: 6,
    alpha: 0.5,
    radius: 50,
    threshold: 1/(255*255),
    delta: 1/10000,
    epsilon: 0,
    ignore_excluded: false,
    with_gradients: true,
    with_distance_transform: true,
    kernel: 0,
    bidirectional: false,
    evaluate: "block",
    repeat: 5,
    multiscale: false
    }
);*/
process(
    __dirname+'/t067.jpg',
    __dirname+'/m067.png',
    null,
    __dirname+'/r067.png',
    {
    patch: 11,
    iterations: 10,
    alpha: 0.5,
    radius: 50,
    threshold: 1/(255*255),
    delta: 1/100,
    epsilon: 0,
    ignore_excluded: false,
    with_gradients: true,
    with_distance_transform: false,
    kernel: 0,
    bidirectional: false,
    evaluate: "block",
    repeat: 10,
    multiscale: true,
    layered: true
    }
);
/*process(
    __dirname+'/t009.jpg',
    __dirname+'/m009.png',
    null,
    __dirname+'/r009.png',
    {
    patch: 11,
    iterations: 10,
    alpha: 0.5,
    radius: 50,
    threshold: 1/(255*255),
    delta: 1/100,
    epsilon: 0,
    ignore_excluded: false,
    with_gradients: true,
    with_distance_transform: false,
    kernel: 0,
    bidirectional: false,
    evaluate: "block",
    repeat: 10,
    multiscale: true,
    layered: true
    }
);*/
