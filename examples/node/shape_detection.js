"use strict";

function line_endpoints(l, w, h)
{
    var a = Math.cos(Math.PI*l.theta/180),
        b = Math.sin(Math.PI*l.theta/180),
        x0 = a*l.rho + w/2,
        y0 = b*l.rho + h/2;
    return [{
    x: Math.round(x0 + w*(-b)),
    y: Math.round(y0 + w*(a))
    }, {
    x: Math.round(x0 - w*(-b)),
    y: Math.round(y0 - w*(a)),
    }];
}
var parse_args = require('./commargs.js'),
    fs = require('fs'),
    F = require('./filterwithcanvas.js'),
    parallel = !!parse_args().options['parallel'],
    shape_detector = F.CompositeFilter([
        F.HoughDetectorFilter('lines').params({threshold:50,thetas:[0, 45, 90]}),
        F.HoughDetectorFilter('circles').params({threshold:25,radii:[20, 25, 30]}),
        F.HoughDetectorFilter('rectangles').params({threshold:50,thetas:[75, 165, 255, 345]}),
        F.HoughDetectorFilter('ellipses').params({threshold:120, minsize:15}),
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
            var features = shape_detector.filter(0).metaData().objects.concat(shape_detector.filter(1).metaData().objects).concat(shape_detector.filter(2).metaData().objects).concat(shape_detector.filter(3).metaData().objects);
            if (features.length)
            {
                var ctx = img.oCanvas.getContext('2d');
                console.log(JSON.stringify(features.map(function(f, i) {
                    if ('line' === f.shape)
                    {
                        var endpts = line_endpoints(f, img.width, img.height);
                        ctx.strokeStyle = '#f00';
                        ctx.beginPath();
                        ctx.moveTo(endpts[0].x, endpts[0].y);
                        ctx.lineTo(endpts[1].x, endpts[1].y);
                        ctx.stroke();
                    }
                    else if ('circle' === f.shape)
                    {
                        ctx.strokeStyle = '#0f0';
                        ctx.beginPath();
                        ctx.arc(f.cx, f.cy, f.r, 0, 2*Math.PI);
                        ctx.closePath();
                        ctx.stroke();
                    }
                    else if ('rectangle' === f.shape)
                    {
                        ctx.strokeStyle = '#00f';
                        ctx.beginPath();
                        ctx.moveTo(f.pts[0].x, f.pts[0].y);
                        ctx.lineTo(f.pts[1].x, f.pts[1].y);
                        ctx.lineTo(f.pts[2].x, f.pts[2].y);
                        ctx.lineTo(f.pts[3].x, f.pts[3].y);
                        ctx.closePath();
                        ctx.stroke();
                    }
                    else if ('ellipse' === f.shape)
                    {
                        ctx.strokeStyle = '#00f';
                        ctx.beginPath();
                        ctx.ellipse(f.cx, f.cy, f.rx, f.ry, f.angle, 0, 2*Math.PI);
                        ctx.closePath();
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
