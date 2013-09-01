#FILTER.js 

__A Javascript Library for Image Processing and Filtering using HTML5 Canvas__

This is a library for filtering images in javascript using canvas element.  

[![Filter.js](/examples/filters-che-new.png)](http://foo123.github.com/examples/filter-three/)


###Contents

* [Live Example](#live-example)
* [How to Use](#how-to-use)
* [API Reference](#api-reference)
* [Todo](#todo)
* [ChangeLog](#changelog)

###Live Example
* [Filters with Three.js](http://foo123.github.com/examples/filter-three/)



###How to Use
It defines an Image class which represents and Image and 4 generic filters  

* __ColorMatrixFilter__ (analogous to the actionscript version)
* __ConvolutionMatrixFilter__ (analogous to the actionscript version)
* __DisplacementMapFilter__ (analogous to actionscript version)
* __Image Blending Modes__ (analogous to Photoshop blends)

each generic filter is prototype but it also includes basic implementation filters like 
_grayscale_ , _colorize_ , _threshold_ , _gauss_ , _laplace_ , _emboss_ , etc..  


###API Reference

__Image Class__

````javascript
new FILTER.Image(imageOrURLOrCanvasOrVideo);
````

This is a placeholder for an image, along with basic methods to access the image data
and alter them. Image methods:

* _setImage()_  Sets/Alters the underlying image
* _setData()_ sets the image pixel data
* _getData()_ gets a copy of image pixel data
* _integral()_  Computes (and caches) the image integral (not used at this time)
* _histogram()_  Computes (and caches) the image histogram
* *_refresh()*  Refreshes the internal image pointers



__Color Matrix Filter__

````javascript
new FILTER.ColorMatrixFilter(weights);
````

This filter is analogous to the ActionScript filter of same name. 
The (optional) weights parameter is an array of 20 numbers which define the multipliers and bias terms
for the RGBA components of each pixel in an image.

The filter scans an image and changes the coloring of each pixel by mixing the RGBA channels of the pixel according to the matrix.

The class has many pre-defined filters which can be combined in any order.

* _desaturate/grayscale()_  Applies grayscaling to an image
* _colorize()_ Applies pseudo-color to an image
* _invert()_ Inverts image colors to their complementary
* _saturate()_  Saturates the image (each color to maximum degree)
* _contrast()_  Increase/Decrease image contrast
* _brightness()_  Increase image brightness
* _adjustHue()_  adjust image hue
* _average()_   color image to an average color (similar to grayscale)
* _quickContrastCorrection()_  
* _quickSepia()_   applies a quick pseudo-sepia effect
* _threshold()_  applies a color threshod to the image
* *threshold_rgb()*  applies a threshod to the image only to the RGB channels
* *threshold_alpha()*  applies a threshod to the image only to the Alpha channel
* _blend()_  blend this filter with another color matrix filter
* _reset()_  reset the filter matrix to identity

These filters are pre-computed, however any custom filter can be created by setting the filter weights manually (in the constructor).

Color Matrix Filters can be combined very easily since they operate only on a single pixel at a time

So in order to use both a grayscale and a contrast filter the following chaining can be used:

````javascript
var grc=new FILTER.ColorMatrixFilter().grayscale().contrast(1);
````

To apply the filter to an image use (this is NEW in 0.3+ version)

````javascript
grc.apply(image);   // image is a FILTER.Image instance, see examples
````

NOTE: The filter apply method will actually change the image to which it is applied


__Convolution Matrix Filter__

````javascript
new FILTER.ConvolutionMatrixFilter(weights, factor);
````

This filter is analogous to the ActionScript filter of same name. 
The (optional) weights parameter is a square matrix of convolution coefficients represented as an array.
The (optional) factor is the normalization factor for the convoltuon matrix. The matrix elements should sum up to 1,
in order for the filtered image to have same brightness as original.

The filter scans an image and changes the current pixel by mixing the RGBA channels of the pixel and the pixels in its neighborhood according to the convolution matrix.

A convolution matrix with large dimesions (NxN) will use pixels from a larger neighborhood and hence it is slower.

Convolution matrices usually have odd dimensions (3x3, 5x5, 7x7, 9x9, etc..) This is related to the fact that the matrix must define a unique center
element (ie. current pixel)  which only odd dimensions allow.

The class has many pre-defined filters to use.

* _lowPass/boxBlur()_  Generic (box) lowpass filter (ie. box blur)
* _highPass()_ Generic high pass filter (derived from the associated low pass filter)
* _binomialLowPass/gaussBlur()_ Generic (pseudo-gaussian) lowpass filter (ie. gauss blur)
* _binomialHighPass()_ Generic high pass filter (derived from the associated low pass filter)
* _sharpen()_  Sharpen the image
* _prewittX/gradX()_  X-gradient of the image (similar to horizontal edges)
* _prewittY/gradY()_  Y-gradient of the image (similar to vertical edges)
* _prewittDirectional/gradDirectional()_  Directional-gradient of the image (similar to edges along a direction)
* _prewitt/grad()_  Total gradient of the image (similar to edges/prewitt operator)
* _sobelX()_  X-gradient using Sobel operator (similar to horizontal edges)
* _sobelY()_  Y-gradient using Sobel operator (similar to vertical edges)
* _sobelDirectional()_  Directional-gradient using Sobel operator (similar to edges along a direction)
* _sobel()_  Total gradient of the image using Sobel operator
* _laplace()_  Total second gradient of the image (Laplacian)
* _emboss()_   Apply emboss effect to the image
* _edges()_  Apply an edge filter to the image
* _motionblur()_  Apply a horizontal/vertical or diagonal motion blur to the image
* _reset()_  reset the filter matrix to identity

These filters are pre-computed, however any custom filter can be created by setting the filter weights manually (in the constructor).

Convolution  Filters cannot be combined very easily since they operate on multiple pixels at a time. However using a composite filter,
filters can be combined into a filter stack which apply one at a time (see below)

In order to use an emboss filter the following can be used:

````javascript
var emboss=new FILTER.ConvolutionMatrixFilter().emboss();
````

To apply the filter to an image use (this is NEW in 0.3+ version)

````javascript
emboss.apply(image);   // image is a FILTER.Image instance, see examples
````

NOTE: The filter apply method will actually change the image to which it is applied

__Displacement Map Filter__

````javascript
new FILTER.DisplacementMapFilter(displaceMap);
````

This filter is analogous to the ActionScript filter of same name. 
The displaceMap parameter is a (FILTER.Image instance) image that acts as the displacement Map. 

The filter scans an image and changes the current pixel by displacing it according to the coloring of the displacement map image



Displacement Map  Filters cannot be combined very easily since they operate on multiple pixels at a time. However using a composite filter,
filters can be combined into a filter stack which apply one at a time (see below)

In order to use an displace filter the following can be used:

````javascript
var dF=new FILTER.DisplacementMapFilter(displaceMap);
````

To apply the filter to an image use (this is NEW in 0.3+ version)

````javascript
// set any filter parameters if needed
dF.scaleX=100;  // amount of scaling in the x-direction
dF.scaleY=100;  // amount of scaling in the y-direction
df.startX=0; // x coordinate of filter application point
df.startY=0; // y coordinate of filter application point
df.componentX=FILTER.CHANNEL.GREEN; // use the map green channel for the x displacement
dF.mode=FILTER.MODE.WRAP; // any values outside image should be wrapped around
dF.apply(image);   // image is a FILTER.Image instance, see examples
````

NOTE: The filter apply method will actually change the image to which it is applied


__Non Linear Filter__

````javascript
new FILTER.NonLinearFilter();
````

This filter implements some non-linear processing like median filters and erode/dilate filters

The class has some pre-defined filters to use.

* _median()_  Apply median (ie. lowpass/remove noise) filter
* _erode()_ Apply erode filter
* _dilate()_ Apply dilate filter

Non Linear Filters cannot be combined very easily since they operate on multiple pixels at a time. However using a composite filter,
filters can be combined into a filter stack which apply one at a time (see below)

In order to use a median filter the following can be used:

````javascript
var median=new FILTER.NonLinearFilter().median(3);  // 3x3 median
````

To apply the filter to an image use (this is NEW in 0.3+ version)

````javascript
median.apply(image);   // image is a FILTER.Image instance, see examples
````

NOTE: The filter apply method will actually change the image to which it is applied

__Composite Filter__


````javascript
new FILTER.CompositeFilter([filter1, filter2, filter3, etc..]);
````

This filter implements a filter stack which enables multiple filters (even other composite filters) to be applied
more easily (and slightly faster) to an image, than to apply them one-by-one manually

The class has theme methods to use.

* _push()_  add a filter to the end of stack
* _pop()_ remove a filter from the end of stack
* _remove()_ remove a filter by instance 
* _filters()_ set the filters stack at once


In order to use a composite filter the following can be used:

````javascript
var grc=new FILTER.ColorMatrixFilter().grayscale().contrast(1);
var emboss=new FILTER.ConvolutionMatrixFilter().emboss();
var combo=new FILTER.CompositeFilter([grc, emboss]);
````

To apply the filter to an image use (this is NEW in 0.3+ version)

````javascript
combo.apply(image);   // image is a FILTER.Image instance, see examples
combo.remove(emboss);  // remove the emboss filter
````

NOTE: The filter apply method will actually change the image to which it is applied


###Todo
* make convolutions faster
* use fixed-point arithmetic and/or micro-optimizations where possible
* add more filters (eg adaptive/statistical etc..)

###ChangeLog

__0.3__
* Add new filters (eg Gradients, Gaussian, Median, Erode, etc..)
* Refactor the filter API (filter apply function accepts a FILTER.Image now)
* Optimise the image and filters classes (cache data if possible, minimise copies, optimise loops etc..)
* Minor math optimizations and micro-optimizations
* Add Composite filters stack (applyin multiple filters on same image is faster and easier this way)
* Add Color Transforms class (to/from Hex/RGB, to/from RGB/YCbCr etc..)
* update examples/readme

__0.2__
* Refactored Code to use closures (more modular)
* Added exCanvas script for Browsers that do not support Canvas
* minimum math optimizations

__0.1__
* initial release

*URL* [Nikos Web Development](http://nikos-web-development.netai.net/ "Nikos Web Development")  
*URL* [FILTER.js blog post](http://nikos-web-development.netai.net/blog/image-processing-in-javascript-and-html5-canvas/ "FILTER.js blog post")  
*URL* [WorkingClassCode](http://workingclasscode.uphero.com/ "Working Class Code")  
