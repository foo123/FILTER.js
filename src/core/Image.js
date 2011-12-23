// Image Canvas Class
// note it won't work locally (at least with Firefox), only with server
FILTER.Image=function(img,callback)
{
	this.width=0;
	this.height=0;
	this.image=null;
	this.canvasElement=document.createElement('canvas');
	this.context=this.canvasElement.getContext('2d');
	if (typeof img != undefined)
		this.setImage(img,callback);
};
FILTER.Image.prototype.createImageData=function(w,h)
{
	this.width=w;
	this.height=h;
	this.canvasElement.width=this.width;
	this.canvasElement.height=this.height;
	this.context=this.canvasElement.getContext('2d');
	return this.context.createImageData(w,h);
};
FILTER.Image.prototype.getPixelData=function()
{
	  return this.context.getImageData(0,0,this.image.width,this.image.height);
};
FILTER.Image.prototype.setPixelData=function(data)
{
	this.context.putImageData(data,0,0);
};
FILTER.Image.prototype.setWidth=function(w)
{
	this.width=w;
	this.canvasElement.width=this.width;
	this.context=this.canvasElement.getContext('2d');
};
FILTER.Image.prototype.setHeight=function(h)
{
	this.height=h;
	this.canvasElement.height=this.height;
	this.context=this.canvasElement.getContext('2d');
};
FILTER.Image.prototype.setImage=function(img,callback)
{
	var thiss=this;
	if (img instanceof Image)
	{
		this.image=img;
		this.width=img.width;
		this.height=img.height;
		this.canvasElement.width=this.width;
		this.canvasElement.height=this.height;
		this.context=this.canvasElement.getContext('2d');
		this.context.drawImage(this.image,0,0);
	}
	else
	{
		this.image=new Image();
		this.image.onload=function(){
			thiss.width=thiss.image.width;
			thiss.height=thiss.image.height;
			thiss.canvasElement.width=thiss.width;
			thiss.canvasElement.height=thiss.height;
			thiss.context=thiss.canvasElement.getContext('2d');
			thiss.context.drawImage(thiss.image,0,0);
			if (typeof callback != 'undefined')
				callback.call(this);
		};
		this.image.src=img; // load it
	}
	this.image.crossOrigin = '';
};
