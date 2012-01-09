// Displacement Map Filter
// accepts an image as target
// and displaces/distorts the target image according to another map image data
FILTER.CHANNEL={};
FILTER.CHANNEL.RED=0;
FILTER.CHANNEL.GREEN=1;
FILTER.CHANNEL_BLUE=2;
FILTER.CHANNEL.ALPHA=3;
FILTER.MODE={};
FILTER.MODE.IGNORE=0;
FILTER.MODE.WRAP=1;
FILTER.MODE.CLAMP=2;
FILTER.MODE.COLOR=4;

FILTER.DisplacementMapFilter=function(target,displacemap)
{
	this.scaleX=1;
	this.scaleY=1;
	this.startX=0;
	this.startY=0;
	this.componentX=0;
	this.componentY=0;
	this.color=0;
	this.mode=FILTER.MODE.CLAMP;
	this.image=target;
	this.map=displacemap;
};

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
  var ww=Math.min(mw,w);
  var hh=Math.min(mh,h);
  var sty=Math.floor(this.startY);
  var stx=Math.floor(this.startX);
  var comx=this.componentX;
  var comy=this.componentY;
  var xx,yy,dstoff,mapoff,srcy,srcx,dispoff,x,y;
  var mode=this.mode;
  
  // apply filter
  for (y=0; y<hh; y++) {
    for (x=0; x<ww; x++) {
      yy=y+sty;
	  xx=x+stx;
	  if (yy<0 || yy>=h || xx<0 || xx>=w) continue;
	  dstoff = ((yy)*w+(xx))*4;
	  mapoff= (y*mw+x)*4;
	  srcy=yy+Math.floor((map[mapoff+comy]-128)*sy);
	  srcx=xx+Math.floor((map[mapoff+comx]-128)*sx);
	  
	  if (srcy>=h || srcy<0 || srcx>=w || srcx<0)
	  {
		switch(mode)
		{
			case FILTER.MODE.IGNORE:
				continue;
				break;
			case FILTER.MODE.COLOR:
			  newd.data[dstoff]=red;
			  newd.data[dstoff+1]=green;
			  newd.data[dstoff+2]=blue;
			  newd.data[dstoff+3]=alpha;
			  continue;
				break;
			case FILTER.MODE.WRAP:
			  if (srcy>=h)
				srcy-=h;
			  if (srcy<0)
				srcy+=h;
			  if (srcx>=w)
				srcx-=w;
			  if (srcx<0)
				srcx+=w;
				break;
			case FILTER.MODE.CLAMP:
			default:
			  if (srcy>=h)
				srcy=h-1;
			  if (srcy<0)
				srcy=0;
			  if (srcx>=w)
				srcx=w-1;
			  if (srcx<0)
				srcx=0;
				break;
		}
	  }
	  dispoff=((srcy)*w+(srcx))*4;
	  
	  // new pixel values
	  newd.data[dstoff]=data.data[dispoff];
	  newd.data[dstoff+1]=data.data[dispoff+1];
	  newd.data[dstoff+2]=data.data[dispoff+2];
	  newd.data[dstoff+3]=data.data[dispoff+3];
     }
  }
  this.image.setPixelData(newd);
};
