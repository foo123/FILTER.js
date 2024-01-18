"use strict";

var parse_args = require('./commargs.js'),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!parse_args().options['parallel'],
    template_matcher = F.TemplateMatcherFilter();

console.log('Detection runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) template_matcher.worker(true);
console.log('Loading images..');
fs.readFile(__dirname+'/che_tpl.png', function(err, tplbuf) {
    if (err) console.log('error while reading template: ' + err.toString());
    F.Image.load(tplbuf, function(tpl) {
        template_matcher.setInput("template", tpl);
        fs.readFile(__dirname+'/che.jpg', function(err, buffer) {
            if (err) console.log('error while reading image: ' + err.toString());
            else F.Image.load(buffer, function(img) {
                console.log('./che.jpg' + ' loaded with dims: ' + img.width + ',' + img.height);
                console.log('Matching..');
                template_matcher.apply(img, function() {
                    if (parallel) template_matcher.worker(false);
                    console.log('Matching completed');
                    var matches = template_matcher.metaData().matches;
                    console.log(matches.length + (1 === matches.length ? ' match was found' : ' matches were found'));
                    if (matches.length) console.log('1st match is found at :' + JSON.stringify(matches[0]));
                });
            });
        });
    });
});
