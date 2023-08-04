"use strict";

function FilterWithCanvas(FILTER, CanvasLite)
{
    // setup FILTER canvas for nodejs w/ CanvasLite
    FILTER.Canvas = function(w, h) {
        return new CanvasLite(w||0, h||0);
    };
    FILTER.Canvas.Image = function() {
        return new CanvasLite.Image();
    };
    FILTER.Canvas.ImageData = function(d, w, h) {
        return {data:d, width:w, height:h};
    };
    return FILTER;
}

module.exports = FilterWithCanvas(require('../../build/filter'), require('./CanvasLite'));
