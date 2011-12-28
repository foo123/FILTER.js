// Color Matrix Filter
// matrix is 4x5 array of values which are (eg for row 1: Red value): 
// New red Value=Multiplier for red value, multiplier for Green value, multiplier for Blue Value, Multiplier for Alpha Value,constant  bias term
// other rows are similar but for new Green, Blue and Alpha values respectively 
FILTER.ColorMatrixFilter=function(image,matrix)
{
	this.matrix=[1,0,0,0,0,
				0,1,0,0,0,
				0,0,1,0,0,
				0,0,0,1,0];
	this.image=image;
	if (typeof matrix != 'undefined')
		this.concat(matrix);
};
FILTER.ColorMatrixFilter.prototype=new FILTER.Filter();
FILTER.ColorMatrixFilter.prototype.constructor=FILTER.ColorMatrixFilter;
FILTER.ColorMatrixFilter.prototype.concat=function(mat)
{
	var temp = [];
	var i = 0;
	var x, y;
	for (y = 0; y < 4; y++ )
	{
		
		for (x = 0; x < 5; x++ )
		{
			temp[ ( i + x) ] =  (mat[i  ])      * (this.matrix[x]) + 
								   (mat[(i+1)]) * (this.matrix[(x +  5)]) + 
								   (mat[(i+2)]) * (this.matrix[(x + 10)]) + 
								   (mat[(i+3)]) * (this.matrix[(x + 15)]) +
								   (x == 4 ? (mat[(i+4)]) : 0);
		}
		i+=5;
	}
	
	this.matrix = temp;
			
};
FILTER.ColorMatrixFilter.prototype.apply=function()
{
	var pd=this.image.getPixelData();
	var p=pd.data;
	var m=this.matrix;
	for (var i=0; i<p.length; i+=4)
	{
		var tmp=[p[i],p[i+1],p[i+2],p[i+3]];
		p[i]=m[0]*tmp[0]+m[1]*tmp[1]+m[2]*tmp[2]+m[3]*tmp[3]+m[4];
		p[i+1]=m[5]*tmp[0]+m[6]*tmp[1]+m[7]*tmp[2]+m[8]*tmp[3]+m[9];
		p[i+2]=m[10]*tmp[0]+m[11]*tmp[1]+m[12]*tmp[2]+m[13]*tmp[3]+m[14];
		p[i+3]=m[15]*tmp[0]+m[16]*tmp[1]+m[17]*tmp[2]+m[18]*tmp[3]+m[19];
	}
	this.image.setPixelData(pd);
};
FILTER.LUMA_R = 0.212671;
FILTER.LUMA_G = 0.71516;
FILTER.LUMA_B = 0.072169;
FILTER.ColorMatrixFilter.prototype.grayscale=function()
{
    var r=FILTER.LUMA_R;
	var g=FILTER.LUMA_G;
	var b=FILTER.LUMA_B;
	var matrix= [r, g, b, 0, 0, 
				r, g, b, 0, 0, 
				r, g, b, 0, 0, 
				0, 0, 0, 1, 0];
	this.concat(matrix);
	return this;
};
FILTER.ColorMatrixFilter.prototype.desaturate=function()
{
	var matrix= [FILTER.LUMA_R, FILTER.LUMA_G, FILTER.LUMA_B, 0, 0, 
				FILTER.LUMA_R, FILTER.LUMA_G, FILTER.LUMA_B, 0, 0, 
				FILTER.LUMA_R, FILTER.LUMA_G, FILTER.LUMA_B, 0, 0, 
				0, 0, 0, 1, 0];
	this.concat(matrix);
	return this;
};
FILTER.ColorMatrixFilter.prototype.colorize=function(rgb, amount)
{
	var r;
	var g;
	var b;
	var inv_amount;
	if (typeof amount=='undefined')
		amount=1;
	r = (((rgb >> 16) & 0xFF) / 0xFF);
	g = (((rgb >> 8) & 0xFF) / 0xFF);
	b = ((rgb & 0xFF) / 0xFF);
	inv_amount = (1 - amount);

	var matrix=[(inv_amount + ((amount * r) * FILTER.LUMA_R)), ((amount * r) * FILTER.LUMA_G), ((amount * r) * FILTER.LUMA_B), 0, 0, 
				((amount * g) * FILTER.LUMA_R), (inv_amount + ((amount * g) * FILTER.LUMA_G)), ((amount * g) * FILTER.LUMA_B), 0, 0, 
				((amount * b) * FILTER.LUMA_R), ((amount * b) * FILTER.LUMA_G), (inv_amount + ((amount * b) * FILTER.LUMA_B)), 0, 0, 
					0, 0, 0, 1, 0];
	this.concat(matrix);
	return this;
};
FILTER.ColorMatrixFilter.prototype.invert=function()
{
	this.concat([ -1 ,  0,  0, 0, 255,
				0 , -1,  0, 0, 255,
				0 ,  0, -1, 0, 255,
				0,   0,  0, 1,   0]);
	 return this;
};
FILTER.ColorMatrixFilter.prototype.saturation=function( s )
{
	var sInv;
	var irlum;
	var iglum;
	var iblum;
	
	sInv = (1 - s);
	irlum = (sInv * FILTER.LUMA_R);
	iglum = (sInv * FILTER.LUMA_G);
	iblum = (sInv * FILTER.LUMA_B);
	
	this.concat([(irlum + s), iglum, iblum, 0, 0, 
			irlum, (iglum + s), iblum, 0, 0, 
			irlum, iglum, (iblum + s), 0, 0, 
			0, 0, 0, 1, 0]);

	return this;
};
FILTER.ColorMatrixFilter.prototype.contrast=function(r, g, b)
{
	if (typeof g == 'undefined')
	g=r;
	if (typeof b == 'undefined')
	b=r;
	r += 1;
	g += 1;
	b += 1;
	
	this.concat([r, 0, 0, 0, (128 * (1 - r)), 
			0, g, 0, 0, (128 * (1 - g)), 
			0, 0, b, 0, (128 * (1 - b)), 
			0, 0, 0, 1, 0]);
	return this;
};
FILTER.ColorMatrixFilter.prototype.brightness=function(r, g, b)
{
	if (typeof g == 'undefined')
	g=r;
	if (typeof b == 'undefined')
	b=r;
	this.concat([1, 0, 0, 0, r, 
			0, 1, 0, 0, g, 
			0, 0, 1, 0, b, 
			0, 0, 0, 1, 0]);
	return this;
};
FILTER.ColorMatrixFilter.prototype.adjustHue=function( degrees )
{
	degrees *= Math.PI/180;
	var cos = Math.cos(degrees);
	var sin = Math.sin(degrees);
	this.concat([((FILTER.LUMA_R + (cos * (1 - FILTER.LUMA_R))) + (sin * -(FILTER.LUMA_R))), ((FILTER.LUMA_G + (cos * -(FILTER.LUMA_G))) + (sin * -(FILTER.LUMA_G))), ((FILTER.LUMA_B + (cos * -(FILTER.LUMA_B))) + (sin * (1 - FILTER.LUMA_B))), 0, 0, 
			((FILTER.LUMA_R + (cos * -(FILTER.LUMA_R))) + (sin * 0.143)), ((FILTER.LUMA_G + (cos * (1 - FILTER.LUMA_G))) + (sin * 0.14)), ((FILTER.LUMA_B + (cos * -(FILTER.LUMA_B))) + (sin * -0.283)), 0, 0, 
			((FILTER.LUMA_R + (cos * -(FILTER.LUMA_R))) + (sin * -((1 - FILTER.LUMA_R)))), ((FILTER.LUMA_G + (cos * -(FILTER.LUMA_G))) + (sin * FILTER.LUMA_G)), ((FILTER.LUMA_B + (cos * (1 - FILTER.LUMA_B))) + (sin * FILTER.LUMA_B)), 0, 0, 
			0, 0, 0, 1, 0]);
	return this;
};
FILTER.ColorMatrixFilter.prototype.blend=function( mat, amount )
{
	var inv_amount = (1 - amount);
	var i = 0;
	while (i < 20) 
	{
		this.matrix[i] = ((inv_amount * (this.matrix[i])) + (amount * (mat.matrix[i])));
		i++;
	};
};
FILTER.ColorMatrixFilter.prototype.average=function( r, g, b )
{
	if (typeof r == 'undefined')
		r=1/3;
	if (typeof g == 'undefined')
		g=1/3;
	if (typeof b == 'undefined')
		b=1/3;
	
	this.concat([r, g, b, 0, 0, 
			r, g, b, 0, 0, 
			r, g, b, 0, 0, 
			0, 0, 0, 1, 0]);
};
FILTER.ColorMatrixFilter.prototype.threshold=function(threshold, factor)
{
	if (typeof factor == 'undefined')
		factor=256;
	this.concat([(FILTER.LUMA_R * factor), (FILTER.LUMA_G * factor), (FILTER.LUMA_B * factor), 0, (-(factor-1) * threshold), 
			(FILTER.LUMA_R * factor), (FILTER.LUMA_G * factor), (FILTER.LUMA_B * factor), 0, (-(factor-1) * threshold), 
			(FILTER.LUMA_R * factor), (FILTER.LUMA_G * factor), (FILTER.LUMA_B * factor), 0, (-(factor-1) * threshold), 
			0, 0, 0, 1, 0]);
};
FILTER.ColorMatrixFilter.prototype.threshold_rgb=function(threshold, factor)
{
	if (typeof factor == 'undefined')
		factor=256;
	this.concat([factor, 0, 0, 0, (-(factor-1) * threshold), 
			0, factor, 0, 0, (-(factor-1) * threshold), 
			0,  0, factor, 0, (-(factor-1) * threshold), 
			0, 0, 0, 1, 0]);
};
FILTER.ColorMatrixFilter.prototype.threshold_alpha=function(threshold, factor)
{
	if (typeof threshold == 'undefined')
		threshold=0.5;
	if (typeof factor == 'undefined')
		factor=256;
	this.concat([1, 0, 0, 0, 0, 
			0, 1, 0, 0, 0, 
			0, 0, 1, 0, 0, 
			0, 0, 0, factor, (-factor * threshold)]);
};
