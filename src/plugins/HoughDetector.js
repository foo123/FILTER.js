/**
*
* Generalized Hough Detector (in progress)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var TypedObj = FILTER.Util.Array.typed_obj;

FILTER.Create({
    name : "HoughDetectorFilter"

    ,path: FILTER.Path

    ,_update: false // filter by itself does not alter image data, just processes information
    ,hasMeta: true
    ,_shapedata: null

    ,init: function(shape) {
    }

    ,dispose: function() {
        var self = this;
        self._shapedata = null;
        self.$super('dispose');
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

});
}(FILTER);