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
/**
 * JavaScript implementation of common blending modes, based on
 * http://stackoverflow.com/questions/5919663/how-does-photoshop-blend-two-images-together
 **/
FILTER.blendModes = {
	normal: function(a, b) {
		return a;
	},

	lighten: function(a, b) {
		return (b > a) ? b : a;
	},

	darken: function(a, b) {
		return (b > a) ? a : b;
	},

	multiply: function(a, b) {
		return (a * b) / 255;
	},

	average: function(a, b) {
		return (a + b) / 2;
	},

	add: function(a, b) {
		return Math.min(255, a + b);
	},

	substract: function(a, b) {
		return (a + b < 255) ? 0 : a + b - 255;
	},

	difference: function(a, b) {
		return Math.abs(a - b);
	},

	negation: function(a, b) {
		return 255 - Math.abs(255 - a - b);
	},

	screen: function(a, b) {
		return 255 - (((255 - a) * (255 - b)) >> 8);
	},

	exclusion: function(a, b) {
		return a + b - 2 * a * b / 255;
	},

	overlay: function(a, b) {
		return b < 128
			? (2 * a * b / 255)
			: (255 - 2 * (255 - a) * (255 - b) / 255);
	},

	softLight: function(a, b) {
		return b < 128
			? (2 * ((a >> 1) + 64)) * (b / 255)
			: 255 - (2 * (255 - (( a >> 1) + 64)) * (255 - b) / 255);
	},

	hardLight: function(a, b) {
		return FILTER.blendModes.overlay(b, a);
	},

	colorDodge: function(a, b) {
		return b == 255 ? b : Math.min(255, ((a << 8 ) / (255 - b)));
	},

	colorBurn: function(a, b) {
		return b == 0 ? b : Math.max(0, (255 - ((255 - a) << 8 ) / b));
	},

	linearDodge: function(a, b) {
		return FILTER.blendModes.add(a, b);
	},

	linearBurn: function(a, b) {
		return FILTER.blendModes.substract(a, b);
	},

	linearLight: function(a, b) {
		return b < 128
			? FILTER.blendModes.linearBurn(a, 2 * b)
			: FILTER.blendModes.linearDodge(a, (2 * (b - 128)));
	},

	vividLight: function(a, b) {
		return b < 128
			? FILTER.blendModes.colorBurn(a, 2 * b)
			: FILTER.blendModes.colorDodge(a, (2 * (b - 128)));
	},

	pinLight: function(a, b) {
		return b < 128
			? FILTER.blendModes.darken(a, 2 * b)
			: FILTER.blendModes.lighten(a, (2 * (b - 128)));
	},

	hardMix: function(a, b) {
		return FILTER.blendModes.vividLight(a, b) < 128 ? 0 : 255;
	},

	reflect: function(a, b) {
		return b == 255 ? b : Math.min(255, (a * a / (255 - b)));
	},

	glow: function(a, b) {
		return FILTER.blendModes.reflect(b, a);
	},

	phoenix: function(a, b) {
		return Math.min(a, b) - Math.max(a, b) + 255;
	}
};
FILTER.Image.prototype.blend=function(image,mode,amount,startX,startY)
{
	if (typeof mode == 'undefined')
		mode='normal';
	if (typeof amount == 'undefined')
		amount=1;
	if (amount>1) amount=1;
	if (amount<0) amount=0;
	if (typeof startX == 'undefined')
		startX=0;
	if (typeof startY == 'undefined')
		startY=0;
	var sx=0,sy=0;
	if (startX<0)
	{
		sx=-startX;
		startX=0;
	}
	if (startY<0)
	{
		sy=-startY;
		startY=0;
	}
	if (startX>=this.width || startY>=this.height)
	{
		return;
	}
	
	var blendingMode = FILTER.blendModes[mode];
	var width =  Math.min(this.width, image.width-sx);
	var height = Math.min(this.height, image.height-sy);
	
	var imageData1 = this.context.getImageData(startX,startY,width,height);
	var imageData2 = image.context.getImageData(sx, sy, width, height);
	

	/** @type Array */
	var pixels1 = imageData1.data;
	/** @type Array */
	var pixels2 = imageData2.data;

	var r, g, b, oR, oG, oB, invamount = 1 - amount;
	
	var len=pixels2.length;
	
	// blend images
	for (var i = 0; i < len; i += 4) {
		oR = pixels1[i];
		oG = pixels1[i + 1];
		oB = pixels1[i + 2];

		// calculate blended color
		r = blendingMode(pixels2[i], oR);
		g = blendingMode(pixels2[i + 1], oG);
		b = blendingMode(pixels2[i + 2], oB);

		// amount compositing
		pixels1[i] =     r * amount + oR * invamount;
		pixels1[i + 1] = g * amount + oG * invamount;
		pixels1[i + 2] = b * amount + oB * invamount;
	}
	this.context.putImageData(imageData1,startX,startY);
};
FILTER.Image.prototype.clone=function(withimage)
{
	if (typeof withimage == 'undefined')
		withimage=false;
	var im=new FILTER.Image();
	if (this.image != undefined && this.image != null && withimage)
	  im.setImage(this.image.src);
	else
	{
		im.setWidth(this.width);
		im.setHeight(this.height);
		im.setPixelData(this.getPixelData());
	}
	return im;
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
	  return this.context.getImageData(0,0,this.width,this.height);
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
