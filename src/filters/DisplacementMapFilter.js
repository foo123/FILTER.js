// Displacement Map Filter
// accepts an image as target
// and displaces/distorts the target image according to another map image data
FILTER.DisplacementMapFilter=function(target,displacemap)
{
	this.scaleX=1;
	this.scaleY=1;
	this.startX=0;
	this.startY=0;
	this.componentX=0;
	this.componentY=0;
	this.color=0;
	this.mode=FILTER.DisplacementMapFilter.CLAMP;
	this.image=target;
	this.map=displacemap;
};
FILTER.CHANNEL_RED=0;
FILTER.CHANNEL_GREEN=1;
FILTER.CHANNEL_BLUE=2;
FILTER.CHANNEL_ALPHA=3;
FILTER.MODE_IGNORE=0;
FILTER.MODE_WRAP=1;
FILTER.MODE_CLAMP=2;
FILTER.MODE_COLOR=4;

FILTER.DisplacementMapFilter.prototype=new FILTER.Filter();
FILTER.DisplacementMapFilter.prototype.constructor=FILTER.DisplacementMapFilter;
FILTER.DisplacementMapFilter.prototype.apply=function()
{
  var data=this.image.getPixelData();
  var w = data.width;
  var h = data.height;
  // allow image to be map of itself
  var mapdata=this.map.clone().getPixelData();
  var map=mapdata.data;
  var mw = mapdata.width;
  var mh = mapdata.height;
  // create new image for copy manipulations
  var newd=this.image.clone().getPixelData();
  
  var sx=this.scaleX/256;
  var sy=this.scaleY/256;
  var alpha=this.color >> 24 & 255;
  var red=this.color >> 16 & 255;
  var green=this.color >> 8 & 255;
  var blue=this.color & 255;
  
  // apply filter
  for (var y=0; y<mh; y++) {
    for (var x=0; x<mw; x++) {
      var dstoff = ((y+this.startY)*w+(x+this.startX))*4;
	  var mapoff= (y*mw+x)*4;
	  var srcy=y+this.startY+Math.floor((map[mapoff+this.componentY]-128)*sy);
	  var srcx=x+this.startX+Math.floor((map[mapoff+this.componentX]-128)*sx);
	  
	  if (srcy>=data.height || srcy<0 || srcx>=data.width || srcx<0)
	  {
		switch(this.mode)
		{
			case FILTER.MODE_IGNORE:
				continue;
				break;
			case FILTER.MODE_COLOR:
			  newd.data[dstoff]=red;
			  newd.data[dstoff+1]=green;
			  newd.data[dstoff+2]=blue;
			  newd.data[dstoff+3]=alpha;
			  continue;
				break;
			case FILTER.MODE_WRAP:
			  if (srcy>=data.height)
				srcy-=data.height;
			  if (srcy<0)
				srcy+=data.height;
			  if (srcx>=data.width)
				srcx-=data.width;
			  if (srcx<0)
				srcx+=data.width;
				break;
			case FILTER.MODE_CLAMP:
			default:
			  if (srcy>=data.height)
				srcy=data.height-1;
			  if (srcy<0)
				srcy=0;
			  if (srcx>=data.width)
				srcx=data.width-1;
			  if (srcx<0)
				srcx=0;
				break;
		}
	  }
	  var dispoff=((srcy)*w+(srcx))*4;
	  
	  // new pixel values
	  newd.data[dstoff]=data.data[dispoff];
	  newd.data[dstoff+1]=data.data[dispoff+1];
	  newd.data[dstoff+2]=data.data[dispoff+2];
	  newd.data[dstoff+3]=data.data[dispoff+3];
     }
  }
  this.image.setPixelData(newd);
};
