"use strict";

var FILTER = require('./filterwithcanvas'),
    colorize = FILTER.ColorMatrixFilter().colorize(0xff0010);

console.log('Loading image..');
require('fs').readFile(__dirname+'/che.jpg', function(err, buffer) {
    if (err) return console.log(err);
    var img = FILTER.Canvas.Image();
    img.onload = function() {
        var fimg = FILTER.Image(img);
        console.log('Processing..');
        colorize/*.worker(true)*/.apply(fimg, function() {
            console.log('Saving..');
            fimg.oCanvas.toPNG().then(function(png) {
                require('fs').writeFile(__dirname+'/checolor.png', png, function(err) {
                    if (err) return console.log('error while saving image: ' + err);
                    console.log('image saved to: ' + './checolor.png');
                    colorize.dispose();
                });
            }).catch(function(err) {
                console.log('error while saving image: ' + err);
                colorize.dispose();
            });
        });
    };
    img.src = buffer;
});
