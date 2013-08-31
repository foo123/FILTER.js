/**
*
* Filter SuperClass
* @package FILTER.js
*
**/
(function(FILTER){
    FILTER.Filter=function(image)
    {
        this.image=image;
    };
    FILTER.Filter.prototype.apply=function()
    {
        // do nothing here, override
    };
})(FILTER);