##API Reference

The library dependencies are:

* [Classy.js](https://github.com/foo123/classy.js) micro Object-Oriented framework.
* [Asynchronous](https://github.com/foo123/asynchronous.js) simple manager for async/parallel tasks.


**TIP:**  You can create your custom build of the library with the filters/plugins you choose. 
Each filter and plugin is independent and can be used in a mix-n-match manner, as long as the core classes are always included. 
Change the dependencies file(s) to include your own selection of filters and plugins for your custom build


###Image Class

````javascript
new FILTER.Image(uRLOrImageOrCanvasOrVideo);
````

This is a placeholder for an image, along with basic methods to access the image data
and alter them. 

__Methods:__

* _setImage(uRLOrImageOrCanvasOrVideo [, callback])_  Sets/Alters the underlying image
* _select(x1, y1, x2, y2)_  set a rectangle as selected part of image (any filters will be applied only to that part)
* _deselect()_  remove previous selection (selected part becomes whole image)
* _apply(filter [, callback])_ shorthand to apply method of a FILTER.Filter instance, image will change after application
* _apply2(filter, destImage [, callback])_ shorthand to apply2 method of a FILTER.Filter instance, to a destination image destImage will change after application
* _clone()_ gets a clone of the image as a new FILTER.Image instance
* _copy(image)_ fast copy of the data of another FILTER.Image instance
* _clear()_  clear the image data
* _fill()_  fill the image area with a specific color
* _scale(sx, sy)_  scale the image in x/y directions
* _flipHorizontal()_  flip image horizontally
* _flipVertical()_  flip image vertically
* _setData()_ sets the image pixel data
* _getData()_ gets a copy of image pixel data
* _setSelectedData()_ sets the image pixel data for the current selection
* _getSelectedData()_ gets a copy of the pixel data of current image selection region
* _integral()_  Computes (and caches) the image integral (not used at this time)
* _histogram()_  Computes (and caches) the image histogram (not used at this time)

###ScaledImage Class

````javascript
new FILTER.ScaledImage(scaleX, scaleY, imageOrURLOrCanvasOrVideo);
````

This is a placeholder for an image, which is automatically up/down scaled (for faster processing). It is a subclass of FILTER.Image and shares the same common methods.

__Methods:__

* _setScale(sx, sy)_  Sets/Alters the scaling ratios


###Generic Abstract Filter

Each filter (and plugin) is an extension of the generic abstract filter, which provides some common methods.

__Properties:__

* _name_   the (class) name of the filter (should be the exact class name, since this is also used by worker filters to instantiate the appropriate filter)


__Methods:__

* _reset( )_   reset the filter to identity (trivial)
* _dispose( )_   dispose the filter (disposes associated filter worker also if needed)
* _turnOn( [bool=true] )_  turn the filter ON/OFF 
* _toggle( )_  toggle the filter's ON/OFF status
* _isOn( )_   check if filter is ON or OFF
* _combineWith( similarFilterInstance )_   for any filter that supports combination of a similar filter with itself, else does nothing
* _serialize( )_   serialize filter's parameters (for use with parallel worker filters)
* _unserialize( data )_   unserialize filter's parameters (for use with parallel worker filters)
* _worker( [enable=true] )_   enable/disable parallel filter worker for this filter (each filter can have its own worker filter transparently)
* _apply( srcImg [, destImg=srcImg] [, callback] )_   apply the filter to a dest Image instance using imageData from srcImage (the destImage will be changed after the filter application)


###Color Matrix Filter

````javascript
new FILTER.ColorMatrixFilter( weights );
````

This filter is analogous to the ActionScript filter of same name. 
The (optional) weights parameter is an array of 20 numbers which define the multipliers and bias terms
for the RGBA components of each pixel in an image.

The filter scans an image and changes the coloring of each pixel by mixing the RGBA channels of the pixel according to the matrix.

The class has various pre-defined filters which can be combined in any order.

* _redChannel() / greenChannel() / blueChannel() / alphaChannel()_  Get the R/G/B/A channel of the image as a new image
* _swapChannels()_  swap 2 image channels (eg FILTER.CHANNEL.GREEN, FILTER.CHANNEL.BLUE)
* _maskChannel()_  mask (remove) an image channel
* _desaturate() / grayscale()_  Applies grayscaling to an image
* _colorize()_ Applies pseudo-color to an image
* _invert()_ Inverts image colors to their complementary
* _invertAlpha()_ Inverts ALPHA channel of image
* _saturate()_  Saturates the image (each color to maximum degree)
* _contrast()_  Increase/Decrease image contrast
* _brightness()_  Adjust image brightness
* _adjustHue()_  adjust image hue
* _average()_   color image to an average color (similar to grayscale)
* _quickContrastCorrection()_  
* _sepia()_   applies a quick sepia effect
* _sepia2()_   applies an alternative quick sepia effect
* _threshold()_  applies a color threshod to the image
* *threshold_rgb()*  applies a threshod to the image only to the RGB channels
* *threshold_alpha()*  applies a threshod to the image only to the Alpha channel
* _blend()_  blend this filter with another color matrix filter

These filters are pre-computed, however any custom filter can be created by setting the filter weights manually (in the constructor).

Color Matrix Filters can be combined very easily since they operate only on a single pixel at a time

In order to use both a grayscale and a contrast filter use the following chaining:

````javascript

var grc = new FILTER.ColorMatrixFilter( ).grayscale( ).contrast( 1 );

// if you want to make this filter work in another thread in parallel through a worker, do:
grc.worker( );

// if you want to stop and dispose the worker for this filter, do:
grc.worker( false );

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
grc.apply( image );   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply( grc );   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image to which it is applied


###Table Lookup Filter

````javascript
new FILTER.TableLookupFilter(colorTable [, colorTableG, colorTableB]);
````

The (optional) colorTable(s) parameter(s) are array(s) of 256 numbers which define the color lookup map(s) (separately for Green and Blue channels if specified, else same table for all RGB channels).

The filter scans an image and changes the coloring of each pixel according to the color map table

The class has various pre-defined filters which can be combined in any order.

* _invert()_ Inverts image colors to their complementary
* _mask()_ Apply a bit-mask to the image pixels
* _replace()_ Replace a color with another color
* _extract()_ Extract a color range from a specific color channel and set all rest to a background color
* _gammaCorrection()_ Apply gamma correction to image channels
* _exposure()_ Alter image exposure
* _solarize()_  Apply a solarize effect
* _solarize2()_  Apply alternative solarize effect
* _posterize() / quantize()_  Quantize uniformly the image colors
* _binarize()_  Quantize uniformly the image colors in 2 levels
* _thresholds()_  Quantize non-uniformly the image colors according to given thresholds
* _threshold()_  Quantize non-uniformly the image colors in 2 levels according to given threshold

These filters are pre-computed, however any custom filter can be created by setting the color table manually (in the constructor).

Lookup Table Filters can be combined very easily since they operate only on a single pixel at a time

In order to use both an invert and a posterize filter use the following chaining:

````javascript

var invertPosterize = new FILTER.TableLookupFilter( ).invert( ).posterize( 4 );

// if you want to make this filter work in another thread in parallel through a worker, do:
invertPosterize.worker( );

// if you want to stop and dispose the worker for this filter, do:
invertPosterize.worker( false );

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
invertPosterize.apply( image );   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply( invertPosterize );   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image to which it is applied


###Convolution Matrix Filter

````javascript
new FILTER.ConvolutionMatrixFilter( weights, factor );
````

This filter is analogous to the ActionScript filter of same name. 
The (optional) weights parameter is a square matrix of convolution coefficients represented as an array.
The (optional) factor is the normalization factor for the convoltuon matrix. The matrix elements should sum up to 1,
in order for the filtered image to have same brightness as original.

The filter scans an image and changes the current pixel by mixing the RGBA channels of the pixel and the pixels in its neighborhood according to the convolution matrix.

A convolution matrix with large dimesions (NxN) will use pixels from a larger neighborhood and hence it is slower.

Convolution matrices usually have odd dimensions (3x3, 5x5, 7x7, 9x9, etc..) This is related to the fact that the matrix must define a unique center
element (ie. current pixel)  which only odd dimensions allow.

The class has various pre-defined filters to use.

* _fastGauss()_  A faster implementation of an arbitrary gaussian low pass filter
* _lowPass() / boxBlur()_  Generic (box) fast lowpass filter (ie. box blur)
* _highPass()_ Generic fast high pass filter (derived from the associated low pass filter)
* _binomialLowPass() / gaussBlur()_ Generic (pseudo-gaussian) lowpass filter (ie. gauss blur)
* _binomialHighPass()_ Generic high pass filter (derived from the associated low pass filter)
* _horizontalBlur()_  apply a fast blur only to horizontal direction
* _verticalBlur()_  apply a fast blur only to vertical direction
* _directionalBlur()_  apply a fast blur to an arbitrary direction (at present supports only horizontal/vertical and diagonal blurs)
* _glow()_  apply a fast glow effect
* _sharpen()_  Sharpen the image fast
* _prewittX() / gradX()_  X-gradient of the image using the Prewitt Operator (similar to horizontal edges)
* _prewittY() / gradY()_  Y-gradient of the image using the Prewitt Operator  (similar to vertical edges)
* _prewittDirectional() / gradDirectional()_  Directional-gradient of the image using the Prewitt Operator  (similar to edges along a direction)
* _prewitt() / grad()_  Total gradient of the image (similar to edges/prewitt operator)
* _sobelX()_  X-gradient using Sobel operator (similar to horizontal edges)
* _sobelY()_  Y-gradient using Sobel operator (similar to vertical edges)
* _sobelDirectional()_  Directional-gradient using Sobel operator (similar to edges along a direction)
* _sobel()_  Total gradient of the image using Sobel operator
* _laplace()_  Total second gradient of the image (fast Laplacian)
* _emboss()_   Apply emboss effect to the image
* _edges()_  Apply an edge filter to the image
* _motionblur()_  __deprecated__  (use directionalBlur)

These filters are pre-computed, however any custom filter can be created by setting the filter weights manually (in the constructor).

Convolution  Filters cannot be combined very easily since they operate on multiple pixels at a time. Using a composite filter,
filters can be combined into a filter stack which apply one at a time (see below)

In order to use an emboss filter do the following:

````javascript

var emboss = new FILTER.ConvolutionMatrixFilter( ).emboss( );

// if you want to make this filter work in another thread in parallel through a worker, do:
emboss.worker( );

// if you want to stop and dispose the worker for this filter, do:
emboss.worker( false );

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
emboss.apply( image );   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply( emboss );   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image to which it is applied


###Displacement Map Filter

````javascript
new FILTER.DisplacementMapFilter( displaceMap );
````

This filter is analogous to the ActionScript filter of same name. 
The displaceMap parameter is a (FILTER.Image instance) image that acts as the displacement Map. 

The filter scans an image and changes the current pixel by displacing it according to the coloring of the displacement map image


Displacement Map  Filters cannot be combined very easily. Use a composite filter (see below)

In order to use an displace filter do the following:

````javascript

var dF = new FILTER.DisplacementMapFilter( displaceMap );

// set any filter parameters if needed
dF.scaleX=100;  // amount of scaling in the x-direction
dF.scaleY=100;  // amount of scaling in the y-direction
df.startX=0; // x coordinate of filter application point
df.startY=0; // y coordinate of filter application point
df.componentX=FILTER.CHANNEL.GREEN; // use the map green channel for the x displacement
dF.mode=FILTER.MODE.WRAP; // any values outside image should be wrapped around

// if you want to make this filter work in another thread in parallel through a worker, do:
dF.worker( );

// if you want to stop and dispose the worker for this filter, do:
dF.worker( false );

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
dF.apply( image );   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply( dF );   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image to which it is applied


###Geometric Map Filter

````javascript
new FILTER.GeomatricMapFilter( geometricMapFunction );
````

The filter scans an image and changes the current pixel by distorting it according to the geometric map function
The optional geometricMap parameter is a function that implements a geometric mapping of pixels (see examples)

The class has some pre-defined filters to use.

* _flipX( )_  Flip the target image wrt to X axis
* _flipY( )_  Flip the target image wrt to Y axis
* _flipXY( )_  Flip the target image wrt to both X and Y axis
* _rotateCW( )_  Rotate target image clockwise 90 degrees
* _rotateCCW( )_  Rotate target image counter-clockwise 90 degrees
* _generic( )_ Apply a a user-defined generic geometric mapping to the image
* _affine( )_ Apply an affine transformation (using an affine transform matrix) to the target image
* _twirl( )_  Apply a twirling map
* _sphere( )_  Apply a spherical map
* _ripple( )_  Apply a wave ripple map
* _polar( )_  Transform image to polar coords (TODO)
* _cartesian( )_  Inverse of polar (TODO)

Geometric Map  Filters cannot be combined very easily. Use a composite filter (see below)

In order to use a geometric filter do the following:

````javascript

var gF = new FILTER.GeometricMapFilter( ).flipX( );

// if you want to make this filter work in another thread in parallel through a worker, do:
gF.worker( );

// if you want to stop and dispose the worker for this filter, do:
gF.worker( false );

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
gF.apply( image );   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply( gF );   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image to which it is applied


###Morphological Filter

````javascript
new FILTER.MorphologicalFilter( );
````

This filter implements basic morphological processing like erode and dilate filters with arbitrary structure elements (given as matrix array)

The class has some pre-defined filters to use.

* _erode( )_ Apply erode operation
* _dilate( )_ Apply dilate operation
* _opening( )_ Apply opening operation
* _closing( )_ Apply closing operation

Morphological Filters cannot be combined very easily since they operate on multiple pixels at a time with non-linear processing. Use a composite filter (see below)

In order to use a dilate filter do the following:

````javascript

var dilate = new FILTER.MorphologicalFilter( ).dilate([
        0, 0, 1,
        0, 1, 0,
        1, 1, 0
]);  // dilate with a 3x3 diagonal structure element

// if you want to make this filter work in another thread in parallel through a worker, do:
dilate.worker( );

// if you want to stop and dispose the worker for this filter, do:
dilate.worker( false );

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
dilate.apply( image );   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply( dilate );   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image to which it is applied


###Statistical Filter

````javascript
new FILTER.StatisticalFilter( );
````

__NOTE:__  *This was in previous versions called NonLinearFilter*

This filter implements some statistical processing like median filters and erode/dilate (maximum/minimum) filters which use statistics and kth-order statistics concepts.

The class has some pre-defined filters to use.

* _median( )_  Apply median (ie. lowpass/remove noise) filter
* _minimum( )/erode( )_ Apply minimum (erode) filter
* _maximum( )/dilate( )_ Apply maximum (dilate) filter

Statistical Filters cannot be combined very easily since they operate on multiple pixels at a time. Use a composite filter (see below)

In order to use a median filter do the following:

````javascript

var median = new FILTER.StatisticalFilter( ).median( 3 );  // 3x3 median

// if you want to make this filter work in another thread in parallel through a worker, do:
median.worker( );

// if you want to stop and dispose the worker for this filter, do:
median.worker( false );

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
median.apply( image );   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply( median );   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image to which it is applied



###Composite Filter


````javascript
new FILTER.CompositeFilter([ filter1, filter2, filter3/*, etc..*/ ]);
````

This filter implements a filter stack which enables multiple filters (even other composite filters) to be applied
more easily (and slightly faster) to an image, than to apply them one-by-one manually

The class implements these methods:

* _push( )/concat( )_  add filter(s) to the end of stack
* _pop( )_ remove a filter from the end of stack
* _shift( )_  remove a filter from the start of stack
* _unshift( )_ add filter(s) to the start of stack
* _remove( )_ remove a filter by instance 
* _insertAt( )_ insert filter(s) at specified location/order
* _removeAt( )_ remove the filter at specified location/order
* _getAt( )_ get the filter at this location
* _setAt( )_ replace the filter at this location
* _filters( )_ set all the filters stack at once
* _stable( [bool] )_ whether the filter is stable (meaning no filters will be added or removed), this makes serialization faster
* _reset( )/empty( )_ reset the filter to identity


In order to use a composite filter do the following:

````javascript

var grc = new FILTER.ColorMatrixFilter( ).grayscale( ).contrast( 1 );
var emboss = new FILTER.ConvolutionMatrixFilter( ).emboss( );
var combo = new FILTER.CompositeFilter([ grc, emboss ]);

// if you want to make this filter work in another thread in parallel through a worker, do:
// NOTE: a composite filter uses its own worker and all constituting filters will be accordingly transfered
// each constituting filter can also use its own worker for other tasks
// but is not needed for the composite worker
combo.worker( );

// if you want to stop and dispose the worker for this filter, do:
combo.worker( false );

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
combo.apply( image );   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply( combo );   // image is a FILTER.Image instance, see examples

combo.remove( emboss );  // remove the emboss filter from the chain
// or also
emboss.turnOn( false );    // turn off the emboss filter while on the chain without losing its settings

````

NOTE: The (filter) apply method will actually change the image to which it is applied

###Plugins and Inline Filters

The library can be extended by custom plugins which add new filters.
A comprehensive framework is provided for creating plugins that function the same as built-in filters (see examples at /src/plugins/Noise.js etc..)

**NOTE** Included Plugins **DO SUPPORT** parallel worker filters (see code and examples)

For creating Inline Filters a custom class is provided _FILTER.CustomFilter_ .

**NOTE2** Custom Filters **DO SUPPORT** parallel filter workers (make sure the custom function does not reference external data so it can be serialized correctly)

Example:

````javascript

var inlinefilter = new FILTER.CustomFilter(function( inst, im, w, h ){
    // this is the inline filter apply method
    // do your stuff here..
    // "inst"   is the (custom) filter instance
    // "im"     is (a copy of) the image pixel data,
    // "w"      is the image width, 
    // "h"      is the image height
    // make sure to return the data back
    return im;
});

// use it alone
inlinefilter.apply( image );
// or use it with any composite filter
new FILTER.CompositeFilter([filter1, filter2, inlinefilter]).apply(image);
// this will also work:
image.apply( inlinefilter );   // image is a FILTER.Image instance, see examples
image.apply(new FILTER.CompositeFilter([filter1, filter2, inlinefilter]);

````

__Included Plugins__ (see examples for how to use)

* __Noise__ : generate uniform noise
* __Equalize__ : apply histogram equalization
* __GrayscaleEqualize__ : apply a faster histogram equalization only for grayscale images
* __RGBEqualize__ : apply histogram equalization per separate color channel
* __Pixelate__ : fast pixelate the image to the given scale
* __TriangularPixelate__ : fast triangular pixelate the image to the given scale
* __HSVConverter__ : convert the image to HSV color space
* __YCbCrConverter__ : convert the image to YCbCr color space (similar filter exists also in __ColorMatrixFilter__ )
* __HueExtractor__ : extract a range of hues from the image
* __AlphaMask__ : apply another image as an alpha mask to the target image
* __Blend__ : apply photoshop-like image blending as a filter (similar method exists also in __Image__ class)
* __ChannelCopy__ : copy a channel from an image to another channel on target image
* __Threshold__ : apply general (full 32bit thresholds) thresholding to an image
* __Bokeh__ : apply a fast Bokeh (Depth-of-Field) effect to an image
