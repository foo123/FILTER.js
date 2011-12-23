// Filters
// Basic Filter SuperClass
FILTER.Filter=function(image)
{
	this.image=image;
};
FILTER.Filter.prototype.apply=function()
{
	// do nothing here, override
};
