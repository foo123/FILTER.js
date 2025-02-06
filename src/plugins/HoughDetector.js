/**
*
* Hough Detector
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var stdMath = Math, deg2rad = stdMath.PI/180,
    hypot = FILTER.Util.Math.hypot,
    nonzero = FILTER.Util.Image.nonzero_pixels,
    local_max = FILTER.Util.Filter.localmax,
    A32U = FILTER.Array32U, A32F = FILTER.Array32F,
    TypedObj = FILTER.Util.Array.typed_obj;

// https://en.wikipedia.org/wiki/Hough_transform
// Detector for lines, rectangles, circles and ellipses based on Hough Transform
FILTER.Create({
    name : "HoughDetectorFilter"

    ,path: FILTER.Path

    ,_update: false // filter by itself does not alter image data, just processes information
    ,hasMeta: true
    ,shape: 'lines'// or 'rectangles' or 'circles' or 'ellipses'
    ,threshold: 10
    ,radii: null
    ,thetas: null
    ,minsize: 10

    ,init: function(shape) {
        var self = this;
        if (null != shape) self.shape = String(shape);
        self.radii = null;
        self.thetas = arr(180, function(i) {return i;});
    }

    ,params: function(params) {
        var self = this;
        if (params)
        {
            if (null != params.threshold) self.threshold = +params.threshold;
            if (null != params.radii) self.radii = params.radii;
            if (null != params.thetas) self.thetas = params.thetas;
            if (null != params.minsize) self.minsize = +params.minsize;
        }
        return self;
    }

    ,serialize: function() {
        var self = this, json;
        json = {
             shape: self.shape
            ,threshold: self.threshold
            ,radii: self.radii ? self.radii.join(',') : null
            ,thetas: self.thetas ? self.thetas.join(',') : null
            ,minsize: self.minsize
        };
        return json;
    }

    ,unserialize: function(params) {
        var self = this;
        self.shape = params.shape;
        self.threshold = params.threshold;
        self.radii = params.radii ? params.radii.split(',').map(num) : null;
        self.thetas = params.thetas ? params.thetas.split(',').map(num) : null;
        self.minsize = params.minsize;
        return self;
    }

    // detected objects are passed as filter metadata (if filter is run in parallel thread)
    ,metaData: function(serialisation) {
        return serialisation && FILTER.isWorker ? TypedObj(this.meta) : this.meta;
    }

    ,setMetaData: function(meta, serialisation) {
        this.meta = serialisation && ("string" === typeof meta) ? TypedObj(meta, 1) : meta;
        return this;
    }

    ,apply: function(im, w, h) {
        var self = this, shape = self.shape;
        self.meta = {objects: []};
        if ('lines' === shape)
        {
            self.meta.objects = hough_lines(im, w, h, self.threshold, self.thetas);
        }
        else if ('rectangles' === shape)
        {
            self.meta.objects = hough_rectangles(im, w, h, self.threshold, self.thetas);
        }
        else if ('circles' === shape)
        {
            self.meta.objects = hough_circles(im, w, h, self.threshold, self.radii);
        }
        else if ('ellipses' === shape)
        {
            self.meta.objects = hough_ellipses(im, w, h, self.threshold, self.minsize);
        }
        return im;
    }
});

function hough_lines(im, w, h, threshold, thetas)
{
    // https://en.wikipedia.org/wiki/Hough_transform
    if (!thetas || !thetas.length) return [];
    var d = stdMath.round(hypot(w, h)),
        ox = w/2, oy = h/2,
        numrho = 2*d + 1,
        numangle = thetas.length,
        accum = new A32U(numangle*numrho),
        sin = new A32F(numangle),
        cos = new A32F(numangle),
        x, y, i, l, a, r;

    sincos(sin, cos, thetas);
    for (x=0,y=0,i=0,l=im.length; i<l; i+=4,++x)
    {
        if (x >= w) {x=0; ++y};
        if (im[i] && im[i+3])
        {
            for (a=0; a<numangle; ++a)
            {
                r = stdMath.round((x - ox)*cos[a] + (y - oy)*sin[a]) + d;
                ++accum[r*numangle + a];
            }
        }
    }
    return local_max([], accum, threshold, numrho, numangle, null).map(function(i) {
        return {
            shape: 'line',
            rho: stdMath.floor(i/numangle)-d,
            theta: thetas[i % numangle]
        };
    });
}
function hough_rectangles(im, w, h, threshold, thetas)
{
    var lines = hough_lines(im, w, h, threshold, thetas),
        unique_lines = [],
        parallel_lines = [],
        rectangles = [],
        eps_theta = 3, eps_alpha = 3,
        eps_rho = 0.025*(w+h), n, i, j,
        l1, l2, t1, t2, r1, r2,
        p1, p2, p3, p4, r;
    n = lines.length;
    for (i=0; i<n; ++i)
    {
        l1 = lines[i];
        if (0 > l1.theta) l1.theta += 360;
        if (360 < l1.theta) l1.theta -= 360;
        if (0 === i)
        {
            unique_lines.push(l1);
        }
        else
        {
            t1 = l1.theta;
            r1 = l1.rho;
            t2 = l2.theta;
            r2 = l2.rho;
            if (stdMath.abs(t1-t2) > eps_theta || stdMath.abs(r1-r1) > eps_rho)
            {
                unique_lines.push(l1);
            }
        }
        l2 = l1;
    }
    n = unique_lines.length;
    for (i=0; i<n; ++i)
    {
        l1 = unique_lines[i];
        for (j=i+1; j<n; ++j)
        {
            l2 = unique_lines[j];
            if (stdMath.abs(l1.theta-l2.theta) <= eps_theta)
            {
                parallel_lines.push([l1, l2, (l1.theta+l2.theta)/2, (l1.rho-l2.rho)/2]);
            }
        }
    }
    n = parallel_lines.length;
    for (i=0; i<n; ++i)
    {
        l1 = parallel_lines[i];
        for (j=i+1; j<n; ++j)
        {
            l2 = parallel_lines[j];
            if (stdMath.abs(stdMath.abs(l1[2]-l2[2])-90) < eps_alpha)
            {
                p1 = lines_intersection(l1[0], l2[0], w, h);
                p2 = lines_intersection(l1[0], l2[1], w, h);
                p3 = lines_intersection(l1[1], l2[0], w, h);
                p4 = lines_intersection(l1[1], l2[1], w, h);
                r = {
                    shape: 'rectangle',
                    pts: [p1,p2,p3,p4].sort(topocmp({x:(p1.x+p2.x+p3.x+p4.x)/4,y:(p1.y+p2.y+p3.y+p4.y)/4}))
                };
                r.area = stdMath.round(hypot(r.pts[1].x-r.pts[0].x,r.pts[1].y-r.pts[0].y)*hypot(r.pts[3].x-r.pts[0].x,r.pts[3].y-r.pts[0].y));
                rectangles.push(r);
            }
        }
    }
    return rectangles;
}
function hough_circles(im, w, h, threshold, radii)
{
    // https://en.wikipedia.org/wiki/Circle_Hough_Transform
    if (!radii || !radii.length) return [];
    var p = nonzero(im, w, h, 0),
        numpix = p.length,
        area = w*h,
        numrad = radii.length,
        numpts = stdMath.ceil(stdMath.max(60, 2*threshold)),
        thetas = arr(numpts, function(i) {return i*360/numpts;}),
        accum = new A32U(numrad*area),
        sin = new A32F(numpts),
        cos = new A32F(numpts),
        circle, r, i, x, y, c, tx, ty;

    circle = new Array(numpts);
    sincos(sin, cos, thetas);
    for (r=0; r<numrad; ++r)
    {
        circle_points(circle, sin, cos, radii[r]);
        for (i=0; i<numpix; ++i)
        {
            x = p[i].x; y = p[i].y;
            for (c=0; c<numpts; ++c)
            {
                tx = stdMath.round(x - circle[c].x);
                ty = stdMath.round(y - circle[c].y);
                if (0 <= tx && tx < w && 0 <= ty && ty < h)
                {
                    ++accum[r*area+ty*w+tx];
                }
            }
        }
    }
    return local_max([], accum, threshold, numrad, h, w).map(function(i) {
        return {
            shape: 'circle',
            cx: i % w,
            cy: stdMath.floor((i % area)/w),
            r: radii[stdMath.floor(i/area)]
        };
    });
}
function hough_ellipses(im, w, h, threshold, minsize)
{
    // “A new efficient ellipse detection method”, Y. Xie and Q. Ji, 2002
    // https://sites.ecse.rpi.edu/~cvrl/Publication/pdf/Xie2002.pdf
    var p = nonzero(im, w, h, 0),
        accum = new A32U(stdMath.max(w, h) >>> 1),
        k, ij1, ij2, ij3,
        x1, y1, x2, y2, x3, y3,
        dx, dy, d, f, g,
        m = stdMath.ceil(minsize/2),
        cos2_tau, sin2_tau,
        x0, y0, a, b, alpha,
        max, found = [];
    k = p.length - 1;
    for (ij1=0; ij1<k; ++ij1)
    {
        if (p[ij1].u) continue;
        for (ij2=k; ij2>ij1; --ij2)
        {
            if (p[ij2].u) continue;
            x1 = p[ij1].x;
            y1 = p[ij1].y;
            x2 = p[ij2].x;
            y2 = p[ij2].y;
            dx = x2 - x1;
            dy = y2 - y1;
            a = hypot(dx, dy);
            if (a > minsize)
            {
                p[ij1].u = 1;
                p[ij2].u = 1;
                zero(accum);
                a = a/2;
                x0 = (x1 + x2)/2;
                y0 = (y1 + y2)/2;
                for (ij3=0; ij3<=k; ++ij3)
                {
                    if (p[ij3].u || ((ij3 === ij1) && (ij3 === ij2))) continue;
                    x3 = p[ij3].x;
                    y3 = p[ij3].y;
                    d = hypot(x3-x0, y3-y0);
                    if (d <= minsize || d >= a) continue;
                    f = hypot(x3-x2, y3-y2);
                    g = (a*a + d*d - f*f) / (2 * a * d);
                    cos2_tau = g*g;
                    sin2_tau = 1.0 - cos2_tau;
                    b = stdMath.round(stdMath.sqrt((a*a * d*d * sin2_tau) / (a*a - d*d * cos2_tau))) - m;
                    if (b >= 0 && b < accum.length)
                    {
                        ++accum[b];
                        //if (accum[b] > threshold) p[ij3].u = 1;
                    }
                }
                max = local_max([], accum, threshold, accum.length, null, null);
                if (max.length)
                {
                    // Center
                    x0 = stdMath.round(x0);
                    y0 = stdMath.round(y0);
                    // Half-length of the major axis
                    a = stdMath.round(a);
                    // Half-length of the minor axis
                    // b
                    // Orientation
                    alpha = stdMath.atan2(dy, dx);
                    //if (0 > alpha) alpha += 360;
                    found.push.apply(found, max.map(function(b) {
                        return {
                            shape: 'ellipse',
                            cx: x0,
                            cy: y0,
                            rx: a,
                            ry: b+m,
                            angle: alpha
                        };
                        }));
                }
            }
        }
    }
    return found;
}
function num(x)
{
    return (+x) || 0;
}
function arr(n, f)
{
    for (var a=new Array(n),i=0; i<n; ++i) a[i] = f(i);
    return a;
}
function zero(a)
{
    for (var i=0,n=a.length; i<n; ++i) a[i] = 0;
    return a;
}
function sincos(sin, cos, thetas)
{
    for (var t=0,n=thetas.length; t<n; ++t)
    {
        sin[t] = stdMath.sin(thetas[t]*deg2rad);
        cos[t] = stdMath.cos(thetas[t]*deg2rad);
    }
}
function topocmp(p0)
{
    // topological sort
    return function(a, b) {
        var dax = a.x - p0.x, dbx = b.x - p0.x,
            day = a.y - p0.y, dby = b.y - p0.y;
        if (dax >= 0 && dbx < 0) return 1;
        if (dax < 0 && dbx >= 0) return -1;
        if (dax === 0 && dbx === 0) return (day >= 0 || dby >= 0) ? (a.y - b.y) : (b.y - a.y);

        var det = dax*dby - dbx*day;
        if (det < 0) return -1;
        if (det > 0) return 1;

        return dax*dax + day*day > dbx*dbx + dby*dby ? -1 : 1;
    };
}
function line_endpoints(l, w, h)
{
    var a = stdMath.cos(stdMath.PI*l.theta/180),
        b = stdMath.sin(stdMath.PI*l.theta/180),
        x0 = a*l.rho + w/2,
        y0 = b*l.rho + h/2;
    return [{
    x: stdMath.round(x0 + w*(-b)),
    y: stdMath.round(y0 + w*(a))
    }, {
    x: stdMath.round(x0 - w*(-b)),
    y: stdMath.round(y0 - w*(a)),
    }];
}
function lines_intersection(l1, l2, w, h)
{
    var p1 = line_endpoints(l1, w, h),
        p2 = line_endpoints(l2, w, h),
        x1 = p1[0].x, x2 = p1[1].x,
        y1 = p1[0].y, y2 = p1[1].y,
        x3 = p2[0].x, x4 = p2[1].x,
        y3 = p2[0].y, y4 = p2[1].y,
        D = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4)
    ;
    return {x: stdMath.round(((x1*y2-y1*x2)*(x3-x4)-(x1-x2)*(x3*y4-y3*x4))/D), y: stdMath.round(((x1*y2-y1*x2)*(y3-y4)-(y1-y2)*(x3*y4-y3*x4))/D)};
}
function circle_points(pt, sin, cos, r)
{
    for (var i=0,n=sin.length; i<n; ++i)
    {
        pt[i] = {x: r*cos[i], y: r*sin[i]};
    }
    return pt;
}
}(FILTER);