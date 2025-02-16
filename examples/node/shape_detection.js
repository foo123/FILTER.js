"use strict";

var parse_args = require('./commargs.js'),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!parse_args().options['parallel'],
    shape_detector = F.CompositeFilter([
        //F.HoughDetectorFilter('lines').params({threshold:45,thetas:[0, 45, 90, 135]}),
        F.HoughDetectorFilter('linesegments').params({threshold:50,gap:1,thetas:[0, 45, 90, 135]}),
        F.HoughDetectorFilter('circles').select(0, 0, 0.5, 0.5).params({threshold:25,radii:[20, 25, 30]}),
        F.HoughDetectorFilter('rectangles').params({threshold:45,thetas:[75, 165, 255, 345]/*[0, 45, 90, 135]*/}),
        F.HoughDetectorFilter('ellipses').params({threshold:150,amin:40,amax:100,bmin:20}),
    ]).update(false);

console.log('Detection runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if (parallel) shape_detector.worker(true);
console.log('Loading image..');
fs.readFile(__dirname+'/shapes.png', function(err, buffer) {
    if (err) console.log('error while reading image: ' + err.toString());
    else F.Image.load(buffer, function(img) {
        console.log('./shapes.png' + ' loaded with dims: ' + img.width + ',' + img.height);
        console.log('Detecting..');
        shape_detector.apply(img, function() {
            if (parallel) shape_detector.worker(false);
            console.log('Detection completed');
            var features = []
                .concat(shape_detector.filter(0).metaData().objects)
                .concat(shape_detector.filter(1).metaData().objects)
                .concat(shape_detector.filter(2).metaData().objects)
                .concat(shape_detector.filter(3).metaData().objects)
            ;
            if (features.length)
            {
                var ctx = img.oCanvas.getContext('2d');
                console.log(JSON.stringify(features.map(function(f, i) {
                    if ('line' === f.shape)
                    {
                        ctx.beginPath();
                        ctx.moveTo(f.x0, f.y0);
                        ctx.lineTo(f.x1, f.y1);
                        ctx.strokeStyle = '#f00';
                        ctx.stroke();
                    }
                    else if ('circle' === f.shape)
                    {
                        ctx.beginPath();
                        ctx.arc(f.cx, f.cy, f.r, 0, 2*Math.PI);
                        ctx.closePath();
                        ctx.strokeStyle = '#0f0';
                        ctx.stroke();
                    }
                    else if ('rectangle' === f.shape)
                    {
                        ctx.beginPath();
                        ctx.moveTo(f.x0, f.y0);
                        ctx.lineTo(f.x1, f.y1);
                        ctx.lineTo(f.x2, f.y2);
                        ctx.lineTo(f.x3, f.y3);
                        ctx.closePath();
                        ctx.strokeStyle = '#00f';
                        ctx.stroke();
                    }
                    else if ('ellipse' === f.shape)
                    {
                        ctx.beginPath();
                        ctx.ellipse(f.cx, f.cy, f.rx, f.ry, Math.PI*f.angle/180, 0, 2*Math.PI);
                        ctx.closePath();
                        ctx.strokeStyle = '#f0f';
                        ctx.stroke();
                    }
                    return f;
                })));
                img.oCanvas.toPNG().then(function(png) {
                    fs.writeFile(__dirname+'/shapes_detected.png', png, function(err) {
                        if (err) console.log('error while saving image: ' + err.toString());
                        else console.log('feature image saved');
                    })
                }).catch(function(err) {
                    console.log('error while saving image: ' + err.toString());
                });
            }
            console.log(String(features.length) + ' features were found');
        });
    });
});
