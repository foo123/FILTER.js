"use strict";

var args = require('./commargs.js')(),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!args.options['parallel'],
    template_matcher = F.TemplateMatcherFilter().params({threshold:0.9,maxMatchesOnly:false});

console.log('Detection runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) template_matcher.worker(true);
console.log('Loading..');
fs.readFile(__dirname+'/kitty.png', function(err, tplbuf) {
    if (err) console.log('error while reading template: ' + err.toString());
    F.Image.load(tplbuf, function(tpl) {
        template_matcher.setInput("template", tpl);
        /*template_matcher.tpldata(true)['areas'].forEach(function(area) {
            var ctx = tpl.oCanvas.getContext('2d');
            ctx.strokeWidth = 1;
            ctx.strokeStyle = '#0f0';
            ctx.strokeRect(area.x0, area.y0, area.x1-area.x0+1, area.y1-area.y0+1);
        });
        tpl.oCanvas.toPNG().then(function(png) {
            fs.writeFile(__dirname+'/kitty_tpl2.png', png, function(err) {
                if (err) console.log('error while saving tpl: ' + err.toString());
                else console.log('tpl saved');
            })
        }).catch(function(err) {
            console.log('error while exporting image: ' + err.toString());
        });
        return;*/
        fs.readFile(__dirname+'/fractal.jpg', function(err, buffer) {
            if (err) console.log('error while reading image: ' + err.toString());
            else F.Image.load(buffer, function(img) {
                console.log('Matching..');
                template_matcher.apply(img, function() {
                    if (parallel) template_matcher.worker(false);
                    var matches = template_matcher.metaData().matches;
                    console.log(matches.length + (1 === matches.length ? ' match was found' : ' matches were found'));
                    if (matches.length) console.log(JSON.stringify(matches));
                });
            });
        });
    });
});
