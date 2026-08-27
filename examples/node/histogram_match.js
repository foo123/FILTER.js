"use strict";

var args = require('./commargs.js')(),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!args.options['parallel'],
    histogram_matcher = F.HistogramMatchFilter(F.MODE.RGB);

console.log('Loading..');
F.Image.load(__dirname+'/tint_target.jpg', function(target) {
    var targetdata = target.getData();
    histogram_matcher.cdf = [
    F.Util.Filter.histogram(targetdata, F.CHANNEL.R, true, true).bin,
    F.Util.Filter.histogram(targetdata, F.CHANNEL.G, true, true).bin,
    F.Util.Filter.histogram(targetdata, F.CHANNEL.B, true, true).bin
    ];
    F.Image.load(__dirname+'/source.jpg', function(img) {
        console.log('Procesing..');
        histogram_matcher.apply(img);
        console.log('Saving..');
        img.oCanvas.toPNG().then(function(png) {
            fs.writeFile(__dirname+'/tint_source.png', png, function(err) {
                if (err) console.log('error while saving image: ' + err.toString());
            })
        }).catch(function(err) {
            console.log('error while saving image: ' + err.toString());
        });
    });
});
