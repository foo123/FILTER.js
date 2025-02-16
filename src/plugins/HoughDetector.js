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
    ,shape: 'lines'// or 'linesegments' or 'rectangles' or 'circles' or 'ellipses'
    ,threshold: 10
    ,gap: 4
    ,radii: null
    ,thetas: null
    ,amin: 10
    ,amax: null
    ,bmin: 3
    ,bmax: null

    ,init: function(shape) {
        var self = this;
        if (null != shape) self.shape = String(shape);
        self.radii = null;
        self.thetas = arr(60, function(i) {return 3*i;});
    }

    ,params: function(params) {
        var self = this;
        if (params)
        {
            if (null != params.threshold) self.threshold = +params.threshold;
            if (null != params.gap) self.gap = +params.gap;
            if (null != params.radii) self.radii = params.radii;
            if (null != params.thetas) self.thetas = params.thetas;
            if (null != params.amin) self.amin = +params.amin;
            if (undef !== params.amax) self.amax = params.amax;
            if (undef !== params.bmin) self.bmin = params.bmin;
            if (undef !== params.bmax) self.bmax = params.bmax;
            if (null != params.selection) self.selection = params.selection || null;
        }
        return self;
    }

    ,serialize: function() {
        var self = this, json;
        json = {
             shape: self.shape
            ,threshold: self.threshold
            ,gap: self.gap
            ,radii: self.radii ? self.radii.join(',') : null
            ,thetas: self.thetas ? self.thetas.join(',') : null
            ,amin: self.amin
            ,amax: self.amax
            ,bmin: self.bmin
            ,bmax: self.bmax
        };
        return json;
    }

    ,unserialize: function(params) {
        var self = this;
        self.shape = params.shape;
        self.threshold = params.threshold;
        self.gap = params.gap;
        self.radii = params.radii ? params.radii.split(',').map(num) : null;
        self.thetas = params.thetas ? params.thetas.split(',').map(num) : null;
        self.amin = params.amin;
        self.amax = params.amax;
        self.bmin = params.bmin;
        self.bmax = params.bmax;
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
        var self = this, shape = self.shape,
            selection = self.selection || null,
            x1, y1, x2, y2, xf, yf;
        self.hasMeta = true;
        self.meta = {objects: []};
        if (selection)
        {
            if (selection[4])
            {
                // selection is relative, make absolute
                xf = w-1;
                yf = h-1;
            }
            else
            {
                // selection is absolute
                xf = 1;
                yf = 1;
            }
            x1 = stdMath.min(w-1, stdMath.max(0, selection[0]*xf))|0;
            y1 = stdMath.min(h-1, stdMath.max(0, selection[1]*yf))|0;
            x2 = stdMath.min(w-1, stdMath.max(0, selection[2]*xf))|0;
            y2 = stdMath.min(h-1, stdMath.max(0, selection[3]*yf))|0;
        }
        else
        {
            x1 = 0; y1 = 0;
            x2 = w-1; y2 = h-1;
        }
        if ('lines' === shape)
        {
            self.meta.objects = hough_lines(im, w, h, 4, x1, y1, x2, y2, self.threshold, self.thetas);
        }
        else if ('linesegments' === shape)
        {
            self.meta.objects = hough_line_segments(im, w, h, 4, x1, y1, x2, y2, self.threshold, self.thetas, self.gap);
        }
        else if ('rectangles' === shape)
        {
            self.meta.objects = hough_rectangles(im, w, h, 4, x1, y1, x2, y2, self.threshold, self.thetas, self.gap);
        }
        else if ('circles' === shape)
        {
            self.meta.objects = hough_circles(im, w, h, 4, x1, y1, x2, y2, self.threshold, self.radii);
        }
        else if ('ellipses' === shape)
        {
            self.meta.objects = hough_ellipses(im, w, h, 4, x1, y1, x2, y2, self.threshold, self.amin, self.amax, self.bmin, self.bmax);
        }
        self._update = false;
        return im;
    }
});

function hough_lines(im, w, h, ch, xa, ya, xb, yb, threshold, thetas)
{
    // https://en.wikipedia.org/wiki/Hough_transform
    if (!thetas || !thetas.length) return [];
    var ww = xb-xa+1, hh = yb-ya+1,
        ox = ww/2, oy = hh/2,
        d = stdMath.ceil(hypot(ww, hh)),
        numrho = 2*d+1,
        numangle = thetas.length,
        size = numangle*numrho,
        accum = new A32U(size),
        acc = new Array(size),
        sin = new A32F(numangle),
        cos = new A32F(numangle),
        alpha = 4 === ch ? 3 : 0,
        x, y, yw, i, j, l, a, r, index, mm;

    sincos(sin, cos, thetas);
    for (x=xa,y=ya,yw=y*w,j=0,l=((ww*hh)*ch); j<l; j+=ch,++x)
    {
        if (x > xb) {x=xa; ++y; yw+=w;};
        i = (yw + x) * ch;
        if (im[i] && im[i+alpha])
        {
            for (a=0; a<numangle; ++a)
            {
                r = stdMath.round((x - ox)*cos[a] + (y - oy)*sin[a]) + d;
                index = r*numangle + a;
                ++accum[index];
                mm = acc[index];
                if (!mm)
                {
                    acc[index] = {xmin:x,ymin:y,xmax:x,ymax:y,xminy:y,xmaxy:y};
                }
                else
                {
                    if (mm.xmin > x) mm.xminy = y;
                    if (mm.xmax < x) mm.xmaxy = y;
                    mm.xmin = stdMath.min(x, mm.xmin);
                    mm.xmax = stdMath.max(x, mm.xmax);
                    mm.ymin = stdMath.min(y, mm.ymin);
                    mm.ymax = stdMath.max(y, mm.ymax);
                }
            }
        }
    }
    return local_max([], accum, threshold, numrho, numangle, null).map(function(i) {
        var mm = acc[i];
        return {
            shape: 'line',
            rho: stdMath.floor(i/numangle)-d,
            theta: thetas[i % numangle],
            x0: mm.xmin, y0: mm.xmin === mm.xmax ? mm.ymin : mm.xminy,
            x1: mm.xmax, y1: mm.xmin === mm.xmax ? mm.ymax : mm.xmaxy
        };
    });
}
function hough_line_segments(im, w, h, ch, xa, ya, xb, yb, threshold, thetas, gap)
{
    return hough_lines(im, w, h, ch, xa, ya, xb, yb, threshold, thetas).reduce(function(segments, line) {
        segments.push.apply(segments, line_to_segments(line, im, w, h, ch, threshold, gap));
        return segments;
    }, []);
}
function hough_rectangles(im, w, h, ch, xa, ya, xb, yb, threshold, thetas, gap)
{
    var lines = hough_lines(im, w, h, ch, xa, ya, xb, yb, threshold, thetas),
        unique_lines, unique_segments, parallel_lines, rectangles,
        ww = xb-xa+1, hh = yb-ya+1,
        eps_theta = 3, eps_alpha = 3, eps_p = 5,
        eps_rho = 0.025*stdMath.min(ww,hh), n, i, j,
        l1, l2, p1, p2, p3, p4, m1, m2, m3, m4, corners, r,
        eq3 = function(x0, y0, x1, y1, x2, y2) {
            return eq(x0, x1, eps_p) && eq(y0, y1, eps_p) && eq(x0, x2, eps_p) && eq(y0, y2, eps_p);
        },
        meet_at = function(l1, l2, p) {
            for (var i=0,ic=l1._segments.length; i<ic; ++i)
            {
                for (var j=0,jc=l2._segments.length; j<jc; ++j)
                {
                    if (
                    eq3(p.x, p.y, l1._segments[i].x0, l1._segments[i].y0, l2._segments[j].x0, l2._segments[j].y0) ||
                    eq3(p.x, p.y, l1._segments[i].x0, l1._segments[i].y0, l2._segments[j].x1, l2._segments[j].y1) ||
                    eq3(p.x, p.y, l1._segments[i].x1, l1._segments[i].y1, l2._segments[j].x0, l2._segments[j].y0) ||
                    eq3(p.x, p.y, l1._segments[i].x1, l1._segments[i].y1, l2._segments[j].x1, l2._segments[j].y1)
                    ) return [i, j];
                }
            }
        };
    lines.sort(function(a, b) {return (a.theta-b.theta) || (a.rho-b.rho);});
    n = lines.length;
    unique_lines = [];
    for (i=0; i<n; ++i)
    {
        l1 = lines[i];
        if ((0 === i) || (!eq(l1.theta, l2.theta, eps_theta) && !eq(l1.rho, l2.rho, eps_rho)))
        {
            unique_lines.push(l1);
            l1._segments = line_to_segments(l1, im, w, h, ch, threshold, gap).map(function(seg) {seg._line = l1; return seg;});
        }
        l2 = l1;
    }
    n = unique_lines.length;
    parallel_lines = [];
    for (i=0; i<n; ++i)
    {
        l1 = unique_lines[i];
        for (j=i+1; j<n; ++j)
        {
            l2 = unique_lines[j];
            if (
                /*(
                l1._line !== l2._line
                ) &&*/
                (
                stdMath.abs(l1.theta-l2.theta) <= eps_theta ||
                stdMath.abs(stdMath.abs(l1.theta-l2.theta)-180) <= eps_theta
                )
            )
            {
                parallel_lines.push([l1, l2, stdMath.min(l1.theta,l2.theta)]);
            }
        }
    }
    n = parallel_lines.length;
    rectangles = [];
    for (i=0; i<n; ++i)
    {
        l1 = parallel_lines[i];
        for (j=i+1; j<n; ++j)
        {
            l2 = parallel_lines[j];
            if (stdMath.abs(stdMath.abs(l1[2]-l2[2])-90) <= eps_alpha || stdMath.abs(stdMath.abs(l1[2]-l2[2])-270) <= eps_alpha)
            {
                p1 = lines_intersection(l1[0], l2[0], w, h);
                p2 = lines_intersection(l1[0], l2[1], w, h);
                p3 = lines_intersection(l1[1], l2[0], w, h);
                p4 = lines_intersection(l1[1], l2[1], w, h);
                m1 = meet_at(l1[0], l2[0], p1);
                m2 = meet_at(l1[0], l2[1], p2);
                m3 = meet_at(l1[1], l2[0], p3);
                m4 = meet_at(l1[1], l2[1], p4);
                if (
                    (m1 && m2 && m3 && m4) &&
                    (m1[0] === m2[0] && m1[1] === m3[1] && m3[0] === m4[0] && m2[1] === m4[1])
                )
                {
                    corners = [p1,p2,p3,p4].sort(topological_sort({x:(p1.x+p2.x+p3.x+p4.x)/4,y:(p1.y+p2.y+p3.y+p4.y)/4}));
                    r = {
                        shape: 'rectangle',
                        x0: corners[0].x, y0: corners[0].y,
                        x1: corners[1].x, y1: corners[1].y,
                        x2: corners[2].x, y2: corners[2].y,
                        x3: corners[3].x, y3: corners[3].y
                    };
                    //r.area = stdMath.round(hypot(r.x1-r.x0,r.y1-r.y0)*hypot(r.x3-r.x0,r.y3-r.y0));
                    rectangles.push(r);
                }
            }
        }
    }
    return rectangles;
}
function hough_circles(im, w, h, ch, xa, ya, xb, yb, threshold, radii)
{
    // https://en.wikipedia.org/wiki/Circle_Hough_Transform
    if (!radii || !radii.length) return [];
    var p = nonzero(im, w, h, 0, ch, xa, ya, xb, yb),
        numpix = p.length,
        ww = xb-xa+1, hh = yb-ya+1, area = ww*hh,
        numrad = radii.length,
        numpts = stdMath.ceil(stdMath.max(60, 2*threshold)),
        thetas = arr(numpts, function(i) {return i*360/numpts;}),
        accum = new A32U(numrad*area),
        sin = new A32F(numpts),
        cos = new A32F(numpts),
        circle, r, i, x, y, c, cx, cy;

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
                cx = stdMath.round(x - circle[c].x);
                cy = stdMath.round(y - circle[c].y);
                if (xa <= cx && cx <= xb && ya <= cy && cy <= yb)
                {
                    ++accum[r*area+(cy-ya)*ww+(cx-xa)];
                }
            }
        }
    }
    return local_max([], accum, threshold, numrad, hh, ww).map(function(i) {
        return {
            shape: 'circle',
            cx: (i % ww) + xa,
            cy: stdMath.floor((i % area)/ww) + ya,
            r: radii[stdMath.floor(i/area)]
        };
    });
}
function hough_ellipses(im, w, h, ch, xa, ya, xb, yb, threshold, amin, amax, bmin, bmax)
{
    // “A new efficient ellipse detection method”, Y. Xie and Q. Ji, 2002
    // https://sites.ecse.rpi.edu/~cvrl/Publication/pdf/Xie2002.pdf
    var ww = xb-xa+1, hh = yb-ya+1;
    if (null == amin) amin = 10;
    if (null == amax) amax = stdMath.max(ww, hh) >>> 1;
    if (amin > amax) return [];
    if (null == bmin) bmin = 3;
    bmax = null == bmax ? amax : stdMath.min(amax, bmax);
    if (bmin > bmax) return [];
    var p = nonzero(im, w, h, 0, ch, xa, ya, xb, yb),
        maxsize = bmax-bmin+1,
        accum = new A32U(maxsize),
        acc = new Array(maxsize),
        hash, k, i1, i2, i3,
        x1, y1, x2, y2, x3, y3, x0, y0,
        dx, dy, d, f, g, cos2,
        a, b, alpha,
        max, found = [];
    for (i1=0; i1<p.length; ++i1)
    {
        x1 = p[i1].x;
        y1 = p[i1].y;
        for (i2=0; i2<i1; ++i2)
        {
            x2 = p[i2].x;
            y2 = p[i2].y;
            dx = x1 - x2;
            dy = y1 - y2;
            a = hypot(dx, dy)/2;
            if (a < amin || a > amax) continue;
            x0 = (x1 + x2)/2;
            y0 = (y1 + y2)/2;
            zero(accum, 0);
            zero(acc, null);
            for (i3=0,k=p.length; i3<k; ++i3)
            {
                if ((i3 === i1) || (i3 === i2)) continue;
                x3 = p[i3].x;
                y3 = p[i3].y;
                d = hypot(x3-x0, y3-y0);
                if (d >= a) continue;
                f = x3-x1;
                g = y3-y1;
                cos2 = (a*a + d*d - f*f - g*g) / (2 * a * d);
                cos2 = cos2*cos2;
                b = stdMath.round(stdMath.sqrt((a*a * d*d * (1.0 - cos2)) / (a*a - d*d * cos2)));
                if (b >= bmin && b <= bmax)
                {
                    b -= bmin;
                    ++accum[b];
                    if (!acc[b]) acc[b] = [];
                    acc[b].push(i3);
                }
            }
            max = local_max([], accum, threshold, maxsize, null, null);
            if (max.length)
            {
                hash = {};
                hash[i1] = 1;
                hash[i2] = 1;
                x0 = stdMath.round(x0);
                y0 = stdMath.round(y0);
                a = stdMath.round(a);
                alpha = stdMath.round(180*stdMath.atan2(dy, dx)/stdMath.PI);
                found.push.apply(found, max.map(function(b) {
                    acc[b].forEach(function(i) {
                        hash[i] = 1;
                    });
                    return {
                        shape: 'ellipse',
                        cx: x0,
                        cy: y0,
                        rx: a,
                        ry: b+bmin,
                        angle: alpha
                    };
                }));
                Object.keys(hash)
                .map(function(i) {
                    return +i;
                })
                .sort(function(i, j) {
                    return j-i; // desc
                })
                .forEach(function(i) {
                    p.splice(i, 1);
                    if (i < i1) --i1;
                    if (i < i2) --i2;
                });
            }
        }
    }
    return found;
}
FILTER.Util.Filter.hough_lines = hough_lines;
FILTER.Util.Filter.hough_line_segments = hough_line_segments;
FILTER.Util.Filter.hough_rectangles = hough_rectangles;
FILTER.Util.Filter.hough_circles = hough_circles;
FILTER.Util.Filter.hough_ellipses = hough_ellipses;

// utils
function num(x)
{
    return (+x) || 0;
}
function arr(n, f)
{
    for (var a=new Array(n),i=0; i<n; ++i) a[i] = f(i);
    return a;
}
function eq(a, b, eps)
{
    return stdMath.abs(a-b) <= (eps || 0);
}
function zero(a, z)
{
    for (var i=0,n=a.length; i<n; ++i) a[i] = z;
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
function line_to_segments(line, im, w, h, channels, thresh, gap)
{
    var right = channels, down = w*channels, segments = [],
        alpha = 4 === channels ? 3 : 0,
        dx = line.x1 - line.x0, dy = line.y1 - line.y0, on_segment,
        xs, ys, xe, ye, x, y, st, s, g, i, u, d, l, r, lu, ru, ld, rd;
    if (stdMath.abs(dx) >= stdMath.abs(dy))
    {
        for (s=0,g=0,st=line.x1>=line.x0?1:-1,xs=x=line.x0,ys=y=line.y0;x!==line.x1;x+=st)
        {
            y = stdMath.round(dy*(x-line.x0)/dx) + line.y0;
            if (0 <= y && y < h)
            {
                i = (y*w + x) * channels;
                r = x+1 < w ? (i+right) : i;
                l = x-1 >= 0 ? (i-right) : i;
                u = y-1 >= 0 ? (i-down) : i;
                d = y+1 < h ? (i+down) : i;
                ru = x+1 < w && y-1 >= 0 ? (i+right-down) : i;
                lu = x-1 >= 0 && y-1 >= 0 ? (i-right-down) : i;
                rd = x+1 < w && y+1 < h ? (i+right+down) : i;
                ld = x-1 >= 0 && y+1 < h ? (i-right+down) : i;
                on_segment = ((im[i] && im[i+alpha]) ||
                (im[l] && im[l+alpha]) ||
                (im[r] && im[r+alpha]) ||
                (im[u] && im[u+alpha]) ||
                (im[d] && im[d+alpha]) ||
                (im[lu] && im[lu+alpha]) ||
                (im[ru] && im[ru+alpha]) ||
                (im[ld] && im[ld+alpha]) ||
                (im[rd] && im[rd+alpha]));
            }
            else
            {
                on_segment = 0;
            }
            if (on_segment)
            {
                ++s; // segment continues
                g = 0;
                xe = x;
                ye = y;
            }
            else
            {
                ++g; // segment breaks
                if (g > gap)
                {
                    if (s > thresh)
                    {
                        segments.push({
                            shape: 'line',
                            rho: line.rho,
                            theta: line.theta,
                            x0: xs, y0: ys,
                            x1: xe, y1: ye
                        });
                    }
                    s = 0;
                    xs = x;
                    ys = y;
                }
            }
        }
    }
    else
    {
        for (s=0,g=0,st=line.y1>=line.y0?1:-1,xs=x=line.x0,ys=y=line.y0;y!==line.y1;y+=st)
        {
            x = stdMath.round(dx*(y-line.y0)/dy) + line.x0;
            if (0 <= x && x < w)
            {
                i = (y*w + x) * channels;
                r = x+1 < w ? (i+right) : i;
                l = x-1 >= 0 ? (i-right) : i;
                u = y-1 >= 0 ? (i-down) : i;
                d = y+1 < h ? (i+down) : i;
                ru = x+1 < w && y-1 >= 0 ? (i+right-down) : i;
                lu = x-1 >= 0 && y-1 >= 0 ? (i-right-down) : i;
                rd = x+1 < w && y+1 < h ? (i+right+down) : i;
                ld = x-1 >= 0 && y+1 < h ? (i-right+down) : i;
                on_segment = ((im[i] && im[i+alpha]) ||
                (im[l] && im[l+alpha]) ||
                (im[r] && im[r+alpha]) ||
                (im[u] && im[u+alpha]) ||
                (im[d] && im[d+alpha]) ||
                (im[lu] && im[lu+alpha]) ||
                (im[ru] && im[ru+alpha]) ||
                (im[ld] && im[ld+alpha]) ||
                (im[rd] && im[rd+alpha]));
            }
            else
            {
                on_segment = 0;
            }
            if (on_segment)
            {
                ++s; // segment continues
                g = 0;
                xe = x;
                ye = y;
            }
            else
            {
                ++g; // segment breaks
                if (g > gap)
                {
                    if (s > thresh)
                    {
                        segments.push({
                            shape: 'line',
                            rho: line.rho,
                            theta: line.theta,
                            x0: xs, y0: ys,
                            x1: xe, y1: ye
                        });
                    }
                    s = 0;
                    xs = x;
                    ys = y;
                }
            }
        }
    }
    if (s > thresh)
    {
        segments.push({
            shape: 'line',
            rho: line.rho,
            theta: line.theta,
            x0: xs, y0: ys,
            x1: xe, y1: ye
        });
    }
    return segments;
}
/*function line_endpoints(p, q, l, w, h)
{
    var c = stdMath.cos(stdMath.PI*l.theta/180),
        s = stdMath.sin(stdMath.PI*l.theta/180),
        x0 = c*l.rho + w/2, y0 = s*l.rho + h/2;
    p.x = x0 - w*s; p.y = y0 + w*c;
    q.x = x0 + w*s; q.y = y0 - w*c;
}*/
function lines_intersection(l1, l2, w, h)
{
    var p1 = {x:l1.x0,y:l1.y0}, p2 = {x:l1.x1,y:l1.y1},
        q1 = {x:l2.x0,y:l2.y0}, q2 = {x:l2.x1,y:l2.y1};
    //line_endpoints(p1, p2, l1, w, h);
    //line_endpoints(q1, q2, l2, w, h);
    var x1 = p1.x, x2 = p2.x,
        y1 = p1.y, y2 = p2.y,
        x3 = q1.x, x4 = q2.x,
        y3 = q1.y, y4 = q2.y,
        f = x1*y2 - y1*x2, g = x3*y4 - y3*x4,
        D = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4)
    ;
    return {x: stdMath.round((f*(x3-x4)-(x1-x2)*g)/D), y: stdMath.round((f*(y3-y4)-(y1-y2)*g)/D)};
}
function circle_points(pt, sin, cos, r)
{
    for (var i=0,n=sin.length; i<n; ++i)
    {
        pt[i] = {x: r*cos[i], y: r*sin[i]};
    }
    return pt;
}
function topological_sort(p0)
{
    // topological sort
    return function(a, b) {
        var dax = a.x - p0.x, dbx = b.x - p0.x,
            day = a.y - p0.y, dby = b.y - p0.y;
        if (dax >= 0 && dbx < 0) return 1;
        if (dax < 0 && dbx >= 0) return -1;
        if (dax === 0 && dbx === 0) return (day >= 0 || dby >= 0) ? (b.y - a.y) : (a.y - b.y);

        var det = dax*dby - dbx*day;
        if (det < 0) return -1;
        if (det > 0) return 1;

        return (dbx*dbx + dby*dby) - (dax*dax + day*day);
    };
}
}(FILTER);