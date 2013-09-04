/**
*
* Combine Filter
*
* Combines Spatially Multiple Filters into One
*
* @param filters
* @package FILTER.js
*
**/
(function(FILTER){
    
    // todo: add blend modes
    FILTER.CombineFilter=function(s1, s2, a, b)
    {
        this.stream1=s1 || null;
        this.stream2=s2 || null;
        this.a=a || 1;
        this.b=b || 1;
    };

    FILTER.CombineFilter.prototype={
    
        // parameters
        stream1 : null,
        stream2 : null,
        a : 1,
        b : 1,
        
        // used for internal purposes
        _apply : function(src1, src2, a, b) {
            var i, l=src1.length;
            i=0; while (i<l) { src1[i]=a*src1[i] + b*src2[i]; i++; }
            return src1;
        },
        
        apply : function(image) {
            if (!this.stream1) return image;
            return image.setData(this._apply(this.stream1, this.stream2, this.a, this.b));
        },
        
        reset : function() {
            this.stream1=null; this.stream2=null; return this;
        }
    };
    
})(FILTER);