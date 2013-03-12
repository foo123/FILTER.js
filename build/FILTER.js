/** http://github.com/foo123/FILTER.js
**
** Image Processing Filter Library for javascript and HTML5 canvas element by Nikos M.
** http://nikos-web-development-netai.net/
**/
var FILTER=FILTER||{};FILTER.Filter=function(a){this.image=a};FILTER.Filter.prototype.apply=function(){};FILTER.Image=function(a,b){this.height=this.width=0;this.type="undefined";this.context=this.canvasElement=this.image=null;this.canvasElement=document.createElement("canvas");this.canvasElement.width=0;this.canvasElement.height=0;this.context=this.canvasElement.getContext("2d");this.setImage(a,b)};
FILTER.blendModes={normal:function(a){return a},lighten:function(a,b){return b>a?b:a},darken:function(a,b){return b>a?a:b},multiply:function(a,b){return a*b/255},average:function(a,b){return(a+b)/2},add:function(a,b){return Math.min(255,a+b)},substract:function(a,b){return a+b<255?0:a+b-255},difference:function(a,b){return Math.abs(a-b)},negation:function(a,b){return 255-Math.abs(255-a-b)},screen:function(a,b){return 255-((255-a)*(255-b)>>8)},exclusion:function(a,b){return a+b-2*a*b/255},overlay:function(a,
b){return b<128?2*a*b/255:255-2*(255-a)*(255-b)/255},softLight:function(a,b){return b<128?2*((a>>1)+64)*(b/255):255-2*(255-((a>>1)+64))*(255-b)/255},hardLight:function(a,b){return FILTER.blendModes.overlay(b,a)},colorDodge:function(a,b){return b==255?b:Math.min(255,(a<<8)/(255-b))},colorBurn:function(a,b){return b==0?b:Math.max(0,255-(255-a<<8)/b)},linearDodge:function(a,b){return FILTER.blendModes.add(a,b)},linearBurn:function(a,b){return FILTER.blendModes.substract(a,b)},linearLight:function(a,
b){return b<128?FILTER.blendModes.linearBurn(a,2*b):FILTER.blendModes.linearDodge(a,2*(b-128))},vividLight:function(a,b){return b<128?FILTER.blendModes.colorBurn(a,2*b):FILTER.blendModes.colorDodge(a,2*(b-128))},pinLight:function(a,b){return b<128?FILTER.blendModes.darken(a,2*b):FILTER.blendModes.lighten(a,2*(b-128))},hardMix:function(a,b){return FILTER.blendModes.vividLight(a,b)<128?0:255},reflect:function(a,b){return b==255?b:Math.min(255,a*a/(255-b))},glow:function(a,b){return FILTER.blendModes.reflect(b,
a)},phoenix:function(a,b){return Math.min(a,b)-Math.max(a,b)+255}};
FILTER.Image.prototype.blend=function(a,b,c,d,e){typeof b=="undefined"&&(b="normal");typeof c=="undefined"&&(c=1);c>1&&(c=1);c<0&&(c=0);typeof d=="undefined"&&(d=0);typeof e=="undefined"&&(e=0);var g=0,j=0;d<0&&(g=-d,d=0);e<0&&(j=-e,e=0);if(!(d>=this.width||e>=this.height)){b=FILTER.blendModes[b];if(b==void 0||b==null)return this;for(var k=Math.min(this.width,a.width-g),l=Math.min(this.height,a.height-j),r=this.context.getImageData(d,e,k,l),g=a.context.getImageData(g,j,k,l),a=r.data,g=g.data,q,m,
o,p=1-c,s=g.length,i=0;i<s;i+=4)q=a[i],m=a[i+1],o=a[i+2],j=b(g[i],q),k=b(g[i+1],m),l=b(g[i+2],o),a[i]=j*c+q*p,a[i+1]=k*c+m*p,a[i+2]=l*c+o*p;this.context.putImageData(r,d,e);return this}};FILTER.Image.prototype.clone=function(a){typeof a=="undefined"&&(a=!1);return a&&this.image&&this.image.src?new FILTER.Image(this.image.src):new FILTER.Image(this.canvasElement)};
FILTER.Image.prototype.createImageData=function(a,b){this.width=a;this.height=b;this.canvasElement.width=this.width;this.canvasElement.height=this.height;this.context=this.canvasElement.getContext("2d");return this.context.createImageData(a,b)};FILTER.Image.prototype.getPixelData=function(){return this.context.getImageData(0,0,this.width,this.height)};FILTER.Image.prototype.setPixelData=function(a){this.context.putImageData(a,0,0)};
FILTER.Image.prototype.setWidth=function(a){this.width=a;this.canvasElement.width=this.width;this.context=this.canvasElement.getContext("2d")};FILTER.Image.prototype.setHeight=function(a){this.height=a;this.canvasElement.height=this.height;this.context=this.canvasElement.getContext("2d")};
FILTER.Image.prototype.setImage=function(a,b){if(!(typeof a=="undefined"||a==null)){var c=this;if(a instanceof Image||a instanceof HTMLCanvasElement||a instanceof HTMLVideoElement){this.image=a;this.width=a.width;this.height=a.height;this.canvasElement.width=this.width;this.canvasElement.height=this.height;this.context=this.canvasElement.getContext("2d");this.context.drawImage(this.image,0,0);if(a instanceof Image)this.type="image";if(a instanceof HTMLCanvasElement)this.type="canvas";if(a instanceof
HTMLVideoElement)this.type="video"}else this.image=new Image,this.type="image-url",this.image.onload=function(){c.width=c.image.width;c.height=c.image.height;c.canvasElement.width=c.width;c.canvasElement.height=c.height;c.context=c.canvasElement.getContext("2d");c.context.drawImage(c.image,0,0);typeof b!="undefined"&&b.call(c)},this.image.src=a;this.image.crossOrigin=""}};
FILTER.ColorMatrixFilter=function(a,b){this.matrix=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0];this.image=a;typeof b!="undefined"&&this.concat(b)};FILTER.ColorMatrixFilter.prototype=new FILTER.Filter;FILTER.ColorMatrixFilter.prototype.constructor=FILTER.ColorMatrixFilter;
FILTER.ColorMatrixFilter.prototype.concat=function(a){var b=[],c=0,d,e;for(e=0;e<4;e++){for(d=0;d<5;d++)b[c+d]=a[c]*this.matrix[d]+a[c+1]*this.matrix[d+5]+a[c+2]*this.matrix[d+10]+a[c+3]*this.matrix[d+15]+(d==4?a[c+4]:0);c+=5}this.matrix=b};
FILTER.ColorMatrixFilter.prototype.apply=function(){for(var a=this.image.getPixelData(),b=a.data,c=this.matrix,d=0;d<b.length;d+=4){var e=[b[d],b[d+1],b[d+2],b[d+3]];b[d]=c[0]*e[0]+c[1]*e[1]+c[2]*e[2]+c[3]*e[3]+c[4];b[d+1]=c[5]*e[0]+c[6]*e[1]+c[7]*e[2]+c[8]*e[3]+c[9];b[d+2]=c[10]*e[0]+c[11]*e[1]+c[12]*e[2]+c[13]*e[3]+c[14];b[d+3]=c[15]*e[0]+c[16]*e[1]+c[17]*e[2]+c[18]*e[3]+c[19]}this.image.setPixelData(a)};FILTER.LUMA={};FILTER.LUMA.R=0.212671;FILTER.LUMA.G=0.71516;FILTER.LUMA.B=0.072169;
FILTER.ColorMatrixFilter.prototype.grayscale=function(){var a=FILTER.LUMA.R,b=FILTER.LUMA.G,c=FILTER.LUMA.B;this.concat([a,b,c,0,0,a,b,c,0,0,a,b,c,0,0,0,0,0,1,0]);return this};FILTER.ColorMatrixFilter.prototype.desaturate=function(){this.concat([FILTER.LUMA.R,FILTER.LUMA.G,FILTER.LUMA.B,0,0,FILTER.LUMA.R,FILTER.LUMA.G,FILTER.LUMA.B,0,0,FILTER.LUMA.R,FILTER.LUMA.G,FILTER.LUMA.B,0,0,0,0,0,1,0]);return this};
FILTER.ColorMatrixFilter.prototype.colorize=function(a,b){var c,d,e,g;typeof b=="undefined"&&(b=1);c=(a>>16&255)/255;d=(a>>8&255)/255;e=(a&255)/255;g=1-b;this.concat([g+b*c*FILTER.LUMA.R,b*c*FILTER.LUMA.G,b*c*FILTER.LUMA.B,0,0,b*d*FILTER.LUMA.R,g+b*d*FILTER.LUMA.G,b*d*FILTER.LUMA.B,0,0,b*e*FILTER.LUMA.R,b*e*FILTER.LUMA.G,g+b*e*FILTER.LUMA.B,0,0,0,0,0,1,0]);return this};FILTER.ColorMatrixFilter.prototype.invert=function(){this.concat([-1,0,0,0,255,0,-1,0,0,255,0,0,-1,0,255,0,0,0,1,0]);return this};
FILTER.ColorMatrixFilter.prototype.saturation=function(a){var b,c,d;b=1-a;c=b*FILTER.LUMA.R;d=b*FILTER.LUMA.G;b*=FILTER.LUMA.B;this.concat([c+a,d,b,0,0,c,d+a,b,0,0,c,d,b+a,0,0,0,0,0,1,0]);return this};FILTER.ColorMatrixFilter.prototype.contrast=function(a,b,c){typeof b=="undefined"&&(b=a);typeof c=="undefined"&&(c=a);a+=1;b+=1;c+=1;this.concat([a,0,0,0,128*(1-a),0,b,0,0,128*(1-b),0,0,c,0,128*(1-c),0,0,0,1,0]);return this};
FILTER.ColorMatrixFilter.prototype.brightness=function(a,b,c){typeof b=="undefined"&&(b=a);typeof c=="undefined"&&(c=a);this.concat([1,0,0,0,a,0,1,0,0,b,0,0,1,0,c,0,0,0,1,0]);return this};
FILTER.ColorMatrixFilter.prototype.adjustHue=function(a){a*=Math.PI/180;var b=Math.cos(a),a=Math.sin(a);this.concat([FILTER.LUMA.R+b*(1-FILTER.LUMA.R)+a*-FILTER.LUMA.R,FILTER.LUMA.G+b*-FILTER.LUMA.G+a*-FILTER.LUMA.G,FILTER.LUMA.B+b*-FILTER.LUMA.B+a*(1-FILTER.LUMA.B),0,0,FILTER.LUMA.R+b*-FILTER.LUMA.R+a*0.143,FILTER.LUMA.G+b*(1-FILTER.LUMA.G)+a*0.14,FILTER.LUMA.B+b*-FILTER.LUMA.B+a*-0.283,0,0,FILTER.LUMA.R+b*-FILTER.LUMA.R+a*-(1-FILTER.LUMA.R),FILTER.LUMA.G+b*-FILTER.LUMA.G+a*FILTER.LUMA.G,FILTER.LUMA.B+
b*(1-FILTER.LUMA.B)+a*FILTER.LUMA.B,0,0,0,0,0,1,0]);return this};FILTER.ColorMatrixFilter.prototype.blend=function(a,b){for(var c=1-b,d=0;d<20;)this.matrix[d]=c*this.matrix[d]+b*a.matrix[d],d++};FILTER.ColorMatrixFilter.prototype.average=function(a,b,c){typeof a=="undefined"&&(a=1/3);typeof b=="undefined"&&(b=1/3);typeof c=="undefined"&&(c=1/3);this.concat([a,b,c,0,0,a,b,c,0,0,a,b,c,0,0,0,0,0,1,0])};
FILTER.ColorMatrixFilter.prototype.threshold=function(a,b){typeof b=="undefined"&&(b=256);this.concat([FILTER.LUMA.R*b,FILTER.LUMA.G*b,FILTER.LUMA.B*b,0,-(b-1)*a,FILTER.LUMA.R*b,FILTER.LUMA.G*b,FILTER.LUMA.B*b,0,-(b-1)*a,FILTER.LUMA.R*b,FILTER.LUMA.G*b,FILTER.LUMA.B*b,0,-(b-1)*a,0,0,0,1,0])};FILTER.ColorMatrixFilter.prototype.threshold_rgb=function(a,b){typeof b=="undefined"&&(b=256);this.concat([b,0,0,0,-(b-1)*a,0,b,0,0,-(b-1)*a,0,0,b,0,-(b-1)*a,0,0,0,1,0])};
FILTER.ColorMatrixFilter.prototype.threshold_alpha=function(a,b){typeof a=="undefined"&&(a=0.5);typeof b=="undefined"&&(b=256);this.concat([1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,b,-b*a])};FILTER.ConvolutionMatrixFilter=function(a,b,c){this.image=a;if(typeof b!="undefined")this.weights=b;this.opaque=!0;if(typeof c!="undefined")this.opaque=c};FILTER.ConvolutionMatrixFilter.prototype=new FILTER.Filter;FILTER.ConvolutionMatrixFilter.prototype.constructor=FILTER.ConvolutionMatrixFilter;
FILTER.ConvolutionMatrixFilter.prototype.apply=function(){for(var a=Math.round(Math.sqrt(this.weights.length)),b=Math.floor(a/2),c=this.image.getPixelData(),d=c.data,e=c.width,c=c.height,g=this.image.clone().getPixelData(),j=this.opaque?1:0,k=0;k<c;k++)for(var l=0;l<e;l++){for(var r=k,q=l,m=(k*e+l)*4,o=0,p=0,s=0,i=0,t=0;t<a;t++)for(var u=0;u<a;u++){var f=r+t-b,h=q+u-b;f>=0&&f<c&&h>=0&&h<e&&(f=(f*e+h)*4,h=this.weights[t*a+u],o+=d[f]*h,p+=d[f+1]*h,s+=d[f+2]*h,i+=d[f+3]*h)}g.data[m]=o;g.data[m+1]=p;
g.data[m+2]=s;g.data[m+3]=i+j*(255-i)}this.image.setPixelData(g)};FILTER.ConvolutionMatrixFilter.prototype.blur=function(){var a=1/9;this.weights=[a,a,a,a,a,a,a,a,a];return this};FILTER.ConvolutionMatrixFilter.prototype.blur4=function(){this.weights=[0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625,0.0625];return this};FILTER.ConvolutionMatrixFilter.prototype.sharpen=function(){this.weights=[-1,-1,-1,-1,9,-1,-1,-1,-1];return this};
FILTER.ConvolutionMatrixFilter.prototype.gauss=function(){this.weights=[0.0625,0.125,0.0625,0.125,0.25,0.125,0.0625,0.125,0.0625];return this};FILTER.ConvolutionMatrixFilter.prototype.laplace=function(){this.weights=[0,1,0,1,-4,1,0,1,0];return this};FILTER.ConvolutionMatrixFilter.prototype.emboss=function(){this.weights=[-2,-1,0,-1,1,1,0,1,2];return this};FILTER.ConvolutionMatrixFilter.prototype.edge=function(){this.weights=[0,1,0,1,-4,1,0,1,0];return this};
FILTER.ConvolutionMatrixFilter.prototype.motionblur=function(a){var b=1/9;this.weights=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];if(a==0)for(a=0;a<9;a++)this.weights[36+a]=b;else if(a==2)for(a=0;a<9;a++)this.weights[9*a+5]=b;else if(a==1)for(a=0;a<9;a++)this.weights[9*Math.round(a)+Math.round(a)]=b;return this};FILTER.CHANNEL={};FILTER.CHANNEL.RED=0;FILTER.CHANNEL.GREEN=1;
FILTER.CHANNEL_BLUE=2;FILTER.CHANNEL.ALPHA=3;FILTER.MODE={};FILTER.MODE.IGNORE=0;FILTER.MODE.WRAP=1;FILTER.MODE.CLAMP=2;FILTER.MODE.COLOR=4;FILTER.DisplacementMapFilter=function(a,b){this.scaleY=this.scaleX=1;this.color=this.componentY=this.componentX=this.startY=this.startX=0;this.mode=FILTER.MODE.CLAMP;this.image=a;this.map=b};FILTER.DisplacementMapFilter.prototype=new FILTER.Filter;FILTER.DisplacementMapFilter.prototype.constructor=FILTER.DisplacementMapFilter;
FILTER.DisplacementMapFilter.prototype.apply=function(){var a=this.image.getPixelData(),b=a.width,c=a.height,d=this.map.clone().getPixelData(),e=d.data,g=d.width,j=d.height,d=this.image.clone().getPixelData(),k=this.scaleX/256,l=this.scaleY/256,r=this.color>>24&255,q=this.color>>16&255,m=this.color>>8&255,o=this.color&255,p=Math.min(g,b),j=Math.min(j,c),s=Math.floor(this.startY),i=Math.floor(this.startX),t=this.componentX,u=this.componentY,f,h,n,x,v,w,y=this.mode;for(w=0;w<j;w++)for(v=0;v<p;v++)if(h=
w+s,f=v+i,!(h<0||h>=c||f<0||f>=b)){n=(h*b+f)*4;x=(w*g+v)*4;h+=Math.floor((e[x+u]-128)*l);f+=Math.floor((e[x+t]-128)*k);if(h>=c||h<0||f>=b||f<0)switch(y){case FILTER.MODE.IGNORE:continue;case FILTER.MODE.COLOR:d.data[n]=q;d.data[n+1]=m;d.data[n+2]=o;d.data[n+3]=r;continue;case FILTER.MODE.WRAP:h>=c&&(h-=c);h<0&&(h+=c);f>=b&&(f-=b);f<0&&(f+=b);break;default:h>=c&&(h=c-1),h<0&&(h=0),f>=b&&(f=b-1),f<0&&(f=0)}f=(h*b+f)*4;d.data[n]=a.data[f];d.data[n+1]=a.data[f+1];d.data[n+2]=a.data[f+2];d.data[n+3]=a.data[f+
3]}this.image.setPixelData(d)};FILTER.SobelFilter=function(a){this.image=a};FILTER.SobelFilter.prototype=new FILTER.Filter;FILTER.SobelFilter.prototype.constructor=FILTER.SobelFilter;
FILTER.SobelFilter.prototype.apply=function(){(new FILTER.ColorMatrixFilter(this.image)).grayscale().apply();var a=this.image.getPixelData();(new FILTER.ConvolutionMatrixFilter(this.image,[-1,0,1,-2,0,2,-1,0,1])).apply();var b=this.image.getPixelData();this.image.setPixelData(a);(new FILTER.ConvolutionMatrixFilter(this.image,[-1,-2,-1,0,0,0,1,2,1])).apply();for(var c=this.image.getPixelData(),d=[],e=0;e<a.data.length;e+=4){var g=Math.abs(b.data[e]);d[e]=g;var j=Math.abs(c.data[e]);d[e+1]=j;d[e+2]=
(g+j)/4;d[e+3]=255}a=this.image.getPixelData();for(e=0;e<a.data.length;e++)a.data[e]=d[e];this.image.setPixelData(a,0,0)};