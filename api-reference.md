##API Reference


The library dependencies are:

* [Classy.js](https://github.com/foo123/classy.js) micro Object-Oriented framework.
* [Asynchronous](https://github.com/foo123/asynchronous.js) simple manager for async/parallel tasks.


**TIP:**  You can create your custom build of the library with the filters/plugins you choose. 
Each filter and plugin is independent and can be used in a mix-n-match manner, as long as the core classes are always included. 
Change the dependencies file(s) to include your own selection of filters and plugins for your custom build


###Contents

* [Image](#image-class)
* [Image Loader](#loader--binaryloader--htmlimageloader-classes)
* [Abstract Filter](#generic-abstract-filter)
* [Color Table Filter](#color-table-filter) 
* [Color Matrix Filter](#color-matrix-filter) (analogous to the ActionScript filter)
* [Displacement Map Filter](#displacement-map-filter) (analogous to ActionScript filter)
* [Geometric Map Filter](#geometric-map-filter)
* [Convolution Matrix Filter](#convolution-matrix-filter) (analogous to the ActionScript filter)
* [Morphological Filter](#morphological-filter)
* [Statistical Filter](#statistical-filter)  (previously called `NonLinearFilter`)
* [Composite Filter](#composite-filter) (an abstraction of a container for multiple filters)
* [GLSL Filter](#glsl-filter) (glsl-based filters i.e webgl/node-gl)
* [SVG Filter](#svg-filter) (svg-based filters)
* [Plugins / Inline Filters](#plugins-and-inline-filters) 
* [Codecs](#codecs) 



###Image Class

````javascript
new FILTER.Image([ImageOrCanvasOrVideoOrFilterImageInstance]);
````

This is a placeholder for an image, along with basic methods to access the image data
and alter them. 

__Methods:__

* `image(ImageOrCanvasOrVideoOrFilterImageInstance)`  Sets/Alters the underlying image
* `select(x1:Number, y1:Number, x2:Number, y2:Number)`  set a rectangle as selected part of image (any filters will be applied only to that part)
* `deselect()`  remove previous selection (selected part becomes whole image)
* `store()`  store the current filtered/processed image as the original image
* `restore()` restore the original image, remove any filters applied to this image
* `restorable( Boolean )` whether the image is restorable (it can be faster if not)
* `apply(filter:Filter [, callback:Function])` shorthand to apply method of a FILTER.Filter instance, image will change after application
* `apply2(filter:Filter, destImage:Image [, callback:Function])` shorthand to apply2 method of a FILTER.Filter instance, to a destination image destImage will change after application
* `clone(original:Boolean)` gets a clone of the image as a new FILTER.Image instance (if true=original clones the un-processed image)
* `clear()`  clear the image data
* `fill(color:Color, x:Integer, y:Integer, w:Integer, h:Integer)`  fill the image area with a specific color
* `crop(x1:Integer,y1:Integer,x2:Integer,y2:Integer)`  crop image area
* `scale(sx:Number, sy:Number)`  scale the image in x/y directions
* `dimensions(w:Integer, h:Integer)`  set image dimensions
* `flipHorizontal()`  flip image horizontally
* `flipVertical()`  flip image vertically
* `setData()` sets the image pixel data
* `getData()` gets a copy of image pixel data
* `getProcessedData()` gets a copy of image processed/filtered data
* `setSelectedData()` sets the image pixel data for the current selection
* `getSelectedData()` gets a copy of the pixel data of current image selection region
* `getProcessedSelectedData()` gets a copy of the processed/filtered data of current image selection region
* `integral(channel:FILTER.CHANNEL)`  Computes (and caches) the image integral (SAT image)
* `histogram(channel:FILTER.CHANNEL)`  Computes (and caches) the image histogram
* `spectrum(channel:FILTER.CHANNEL)`  Computes (and caches) the image fourier frequency spectrum (TODO)
* `toImage(format:FILTER.FORMAT)`  return a data uri or an HTMLImage object of the current image according tol format (default FILTER.FORMAT.PNG)

###ScaledImage Class

````javascript
new FILTER.ScaledImage(scaleX, scaleY [, ImageOrCanvasOrVideoOrFilterImageInstance]);
````

This is a placeholder for an image, which is automatically up/down scaled (for faster processing). It is a subclass of FILTER.Image and shares the same common methods.

__Methods:__

* `setScale(sx, sy)`  Sets/Alters the scaling ratios



###Loader / BinaryLoader / HTMLImageLoader Classes

````javascript
filterImageInstance = FILTER.IO.HTMLImageLoader.load( imageUrl [, onLoad, onError] );

// this is same as (factory-constructor pattern):

filterImageInstance = new FILTER.IO.HTMLImageLoader( ).load( imageUrl [, onLoad, onError] );
````

Loads an image url into a `FILTER.Image` instance. 

The same functionality to load a url into a `FILTER.Image` has been **removed from the FILTER.Image Class**

Use the `FILTER.IO.HTMLImageLoader` instead. In order to use the `FILTER.IO.BinaryLoader` to load and decode a custom image format, see below.


###Generic Abstract Filter

Each filter (and plugin) is an extension of the generic abstract filter, which provides some common methods.

__Properties:__

* `name`   the (class) name of the filter (should be the exact class name, since this is also used by worker filters to instantiate the appropriate filter)


__Methods:__

* `reset( )`   reset the filter to identity (trivial)
* `dispose( )`   dispose the filter (disposes associated filter worker also if needed)
* `turnOn( [bool:Boolean=true] )`  turn the filter ON/OFF 
* `toggle( )`  toggle the filter's ON/OFF status
* `isOn( )`   check if filter is ON or OFF
* `combineWith( similarFilterInstance )`   for any filter that supports combination of a similar filter with itself, else does nothing
* `serialize( )`   serialize filter's parameters (for use with parallel worker filters)
* `unserialize( data:Object )`   unserialize filter's parameters (for use with parallel worker filters)
* `worker/thread( [enabled:Boolean=true [, import_extra_scripts:Array]] )`  enable/disable parallel filter thread/worker for this filter (each filter can have its own worker filter in another thread transparently)
* `apply( srcImg:Image [, destImg:Image=srcImg] [, callback:Function] )`   apply the filter to a dest Image instance using imageData from srcImage (the destImage output will be changed after the filter application, the filters can be removed if image is restorable)

###Color Table Filter

````javascript
new FILTER.ColorTableFilter(colorTable:ImageArray [, colorTableG:ImageArray, colorTableB:ImageArray]);
````

The (optional) colorTable(s) parameter(s) are array(s) of 256 numbers which define the color lookup map(s) (separately for Green and Blue channels if specified, else same table for all RGB channels).

The filter scans an image and changes the coloring of each pixel according to the color map table

The class has various pre-defined filters which can be combined in any order.

* `invert()` Inverts image colors to their complementary
* `mask()` Apply a bit-mask to the image pixels
* `replace()` Replace a color with another color
* `extract()` Extract a color range from a specific color channel and set all rest to a background color
* `gammaCorrection()` Apply gamma correction to image channels
* `exposure()` Alter image exposure
* `solarize()`  Apply a solarize effect
* `solarize2()`  Apply alternative solarize effect
* `posterize() / quantize()`  Quantize uniformly the image colors
* `binarize()`  Quantize uniformly the image colors in 2 levels
* `thresholds()`  Quantize non-uniformly the image colors according to given thresholds
* `threshold()`  Quantize non-uniformly the image colors in 2 levels according to given threshold

These filters are pre-computed, however any custom filter can be created by setting the color table manually (in the constructor).

Color Table Filters can be combined very easily since they operate only **on a single color of a single pixel** at a time

In order to use both an invert and a posterize filter use the following chaining:

````javascript

var invertPosterize = new FILTER.ColorTableFilter( ).invert( ).posterize( 4 );

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

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


###Color Matrix Filter

````javascript
new FILTER.ColorMatrixFilter( weights:Array );
````

This filter is analogous to the ActionScript filter of same name. 
The (optional) weights parameter is an array of 20 numbers which define the multipliers and bias terms
for the RGBA components of each pixel in an image.

The filter scans an image and changes the coloring of each pixel by mixing the RGBA channels of the pixel according to the matrix.

The class has various pre-defined filters which can be combined in any order.

* `redChannel() / greenChannel() / blueChannel() / alphaChannel()`  Get the R/G/B/A channel of the image as a new image
* `swapChannels()`  swap 2 image channels (eg `FILTER.CHANNEL.GREEN`, `FILTER.CHANNEL.BLUE`)
* `maskChannel()`  mask (remove) an image channel
* `desaturate() / grayscale()`  Applies grayscaling to an image
* `colorize()` Applies pseudo-color to an image
* `invert()` Inverts image colors to their complementary
* `invertAlpha()` Inverts ALPHA channel of image
* `saturate()`  Saturates the image (each color to maximum degree)
* `contrast()`  Increase/Decrease image contrast
* `brightness()`  Adjust image brightness
* `adjustHue()`  adjust image hue
* `average()`   color image to an average color (similar to grayscale)
* `quickContrastCorrection()`  
* `sepia()`   applies a quick sepia effect
* `sepia2()`   applies an alternative quick sepia effect
* `threshold()`  applies a color threshod to the image
* `threshold_rgb()`  applies a threshod to the image only to the RGB channels
* `threshold_alpha()`  applies a threshod to the image only to the Alpha channel
* `blend()`  blend this filter with another color matrix filter

These filters are pre-computed, however any custom filter can be created by setting the filter weights manually (in the constructor).

Color Matrix Filters can be combined very easily since they operate only **on mixing the colors of a single pixel** at a time

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

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


###Displacement Map Filter

````javascript
new FILTER.DisplacementMapFilter( displaceMap:Image );
````

This filter is analogous to the ActionScript filter of same name. 
The displaceMap parameter is a (FILTER.Image instance) image that acts as the displacement Map. 

The filter scans an image and changes the current pixel by displacing it according to the coloring of the displacement map image


Displacement Map  Filters cannot be combined very easily since they operate **on mapping single pixels non-linearly**. Use a composite filter (see below)

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

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


###Geometric Map Filter

````javascript
new FILTER.GeometricMapFilter( inverseGeometricMap:Function );
````

The filter scans an image and changes the current pixel by distorting it according to the geometric map function
The optional geometricMap parameter is a function that implements a geometric mapping of pixels (see examples)

The class has some pre-defined filters to use.

* `flipX( )`  Flip the target image wrt to `X` axis
* `flipY( )`  Flip the target image wrt to `Y` axis
* `flipXY( )`  Flip the target image wrt to both `X` and `Y` axis
* `rotateCW( )`  Rotate target image clockwise `90` degrees
* `rotateCCW( )`  Rotate target image counter-clockwise `90` degrees
* `generic( )` Apply a a user-defined generic geometric mapping to the image
* `affine( )` Apply an affine transformation (using an affine transform matrix) to the target image
* `twirl( )`  Apply a twirling map
* `sphere( )`  Apply a spherical map
* `ripple( )`  Apply a wave ripple map
* `shift( )/translate( )`  Apply (circular) translation / shifting of target image by specified `dx` / `dy` offsets
* `polar( )`  Transform image to polar coords (TODO)
* `cartesian( )`  Inverse of polar (TODO)

Geometric Map  Filters cannot be combined very easily since they operate **on mapping single pixels non-linearly**. Use a composite filter (see below)

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

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


###Convolution Matrix Filter

````javascript
new FILTER.ConvolutionMatrixFilter( weights:Array, factor:Number );
````

This filter is analogous to the ActionScript filter of same name. 
The (optional) weights parameter is a square matrix of convolution coefficients represented as an array.
The (optional) factor is the normalization factor for the convoltuon matrix. The matrix elements should sum up to 1,
in order for the filtered image to have same brightness as original.

The filter scans an image and changes the current pixel by mixing the RGBA channels of the pixel and the pixels in its neighborhood according to the convolution matrix.

A convolution matrix with large dimesions (NxN) will use pixels from a larger neighborhood and hence it is slower.

Convolution matrices usually have odd dimensions (3x3, 5x5, 7x7, 9x9, etc..) This is related to the fact that the matrix must define a unique center element (ie. current pixel)  which only odd dimensions allow.

The class has various pre-defined filters to use.

* `fastGauss()`  A fast implementation of an arbitrary gaussian low pass filter approximation
* `lowPass() / boxBlur()`  Generic (box) fast lowpass filter (ie. box blur)
* `highPass()` Generic fast high pass filter (derived from the associated low pass filter)
* `binomialLowPass() / gaussBlur()` Generic (pseudo-gaussian) lowpass filter (ie. gauss blur)
* `binomialHighPass()` Generic high pass filter (derived from the associated low pass filter)
* `horizontalBlur()`  apply a fast blur only to horizontal direction
* `verticalBlur()`  apply a fast blur only to vertical direction
* `directionalBlur()`  apply a fast blur to an arbitrary direction (at present supports only horizontal/vertical and diagonal blurs)
* `glow()`  apply a fast glow effect
* `sharpen()`  Sharpen the image fast
* `prewittX() / gradX()`  X-gradient of the image using the Prewitt Operator (similar to horizontal edges)
* `prewittY() / gradY()`  Y-gradient of the image using the Prewitt Operator  (similar to vertical edges)
* `prewittDirectional() / gradDirectional()`  Directional-gradient of the image using the Prewitt Operator  (similar to edges along a direction)
* `prewitt() / grad()`  Total gradient of the image (similar to edges/prewitt operator)
* `sobelX()`  X-gradient using Sobel operator (similar to horizontal edges)
* `sobelY()`  Y-gradient using Sobel operator (similar to vertical edges)
* `sobelDirectional()`  Directional-gradient using Sobel operator (similar to edges along a direction)
* `sobel()`  Total gradient of the image using Sobel operator
* `laplace()`  Total second gradient of the image (fast Laplacian)
* `emboss()`   Apply emboss effect to the image
* `edges()`  Apply an edge filter to the image
* `motionblur()`  __deprecated__  (use `directionalBlur`)

These filters are pre-computed, however any custom filter can be created by setting the filter weights manually (in the constructor).

Convolution  Filters cannot be combined very easily since they operate **on varying pixel neighborhoods** at a time. Using a composite filter, filters can be combined into a filter stack which apply one at a time (see below)

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

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


###Morphological Filter

````javascript
new FILTER.MorphologicalFilter( );
````

This filter implements basic morphological processing like erode and dilate filters with arbitrary structure elements (given as matrix array)

The class has some pre-defined filters to use.

* `erode( )` Apply erode operation
* `dilate( )` Apply dilate operation
* `opening( )` Apply opening operation
* `closing( )` Apply closing operation

Morphological Filters cannot be combined very easily since they operate **on varying pixel neighborhoods** at a time with non-linear processing. Use a composite filter (see below)

In order to use a dilate filter do the following:

````javascript

var dilate = new FILTER.MorphologicalFilter( ).dilate([
        0, 0, 1,
        0, 1, 0,
        1, 0, 0
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

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


###Statistical Filter

````javascript
new FILTER.StatisticalFilter( );
````

__NOTE:__  *This was in older versions called `NonLinearFilter`*

This filter implements some statistical processing like median filters and erode/dilate (maximum/minimum) filters which use statistics and `kth`-order statistics concepts.

The class has some pre-defined filters to use.

* `median( )`  Apply median (ie. lowpass/remove noise) filter
* `minimum( )/erode( )` Apply minimum (erode) filter
* `maximum( )/dilate( )` Apply maximum (dilate) filter

Statistical Filters cannot be combined very easily since they operate **on varying pixel neighborhoods** at a time with non-linear processing. Use a composite filter (see below)

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

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


###Composite Filter


````javascript
new FILTER.CompositeFilter([ filter1:Filter, filter2:Filter, filter3:Filter /*, etc..*/ ]:Array);
````

This filter implements a filter stack which enables multiple filters (even other composite filters) to be applied
more easily (and slightly faster) to an image, than to apply them one-by-one manually

The class implements these methods:

* `push( )/concat( )`  add filter(s) to the end of stack
* `pop( )` remove a filter from the end of stack
* `shift( )`  remove a filter from the start of stack
* `unshift( )` add filter(s) to the start of stack
* `remove( )` remove a filter by instance 
* `insertAt( )` insert filter(s) at specified location/order
* `removeAt( )` remove the filter at specified location/order
* `getAt( )` get the filter at this location
* `setAt( )` replace the filter at this location
* `filters( )` set all the filters stack at once
* `stable( [bool] )` whether the filter is stable (meaning no filters will be added or removed), this makes serialization faster
* `reset( )/empty( )` reset the filter to identity


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

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


###Combinator Filter

*to be added*


###GLSL Filter

glsl-based filters for `webgl`/`node-gl` (todp)


###SVG Filter

svg-based filters for `svg` (todp)


###Plugins and Inline Filters

The library can be extended by custom plugins which add new filters.
A comprehensive framework is provided for creating plugins that function the same as built-in filters (see examples at /src/plugins/Noise.js etc..)

**NOTE** Included Plugins **DO SUPPORT** parallel thread/worker filters (see code and examples)

For creating Inline Filters a custom class is provided `FILTER.InlineFilter` .

**NOTE2** Inline Filters **DO SUPPORT** parallel filter threads/workers (make sure the custom function does not reference external data so it can be serialized correctly)

Example:

````javascript

var inlinefilter = new FILTER.InlineFilter(function( inst, im, w, h ){
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

* `Noise` : generate uniform noise
* `PerlinNoise` : perlin noise also as filter plugin
* `Gradient` : gradient image effect also as filter plugin
* `RadialGradient` : radial-gradient image effect also as filter plugin
* `Equalize` : apply fast histogram equalization
* `GrayscaleEqualize` : apply faster histogram equalization only for grayscale images
* `RGBEqualize` : apply fast histogram equalization per separate color channel
* `Pixelate` : fast (rectangular) pixelate the image to the given scale
* `TriangularPixelate` : fast triangular pixelate the image to the given scale
* `HexagonalPixelate` : fast hexagonal pixelate the image to the given scale (TO BE ADDED)
* `Halftone` : create a halftone/dithered black-white or colored image from target image
* `Bokeh` : apply a fast Bokeh (Depth-of-Field) effect to an image
* `FloodFill` : apply a (fast) flood fill (scanline seed fill) to paint an (connected) area of an image (with given tolerance factor)
* `PatternFill` : apply a (fast) pattern fill to an (connected) area of an image using another image as pattern
* `ChannelCopy` : copy a channel from an image to another channel on target image
* `AlphaMask` : apply another image as an alpha mask to the target image
* `ColorMask` : replace a color or use a color as mask for another image pattern (e.g *green screen* effects) (TO BE ADDED)
* `Blend` : apply photoshop-like image blending as a filter <del>(similar method exists also in `Image` class)</del>
* `DropShadow` : generate drop shadow(s) with opacity on image (analogous to ActionScript filter)
* `SeamlessTile` : create a seamless tileable pattern from target image
* `HSVConverter` : convert the image to `HSV` color space or Hue only converted to grayscale
* `YCbCrConverter` : convert the image to `YCbCr` color space (similar filter exists in `ColorMatrixFilter`)
* `Threshold` : apply general (full `32bit` thresholds) thresholding to an image based on `Color`, `Intensity` or `Hue` mode
* `HueExtractor` : extract a range of hues from the image (same functionality has been added to general `ThresholdFilter` see above)
* `ConnectedComponents` : extract fast all or only those matching Color/Intensity/Hue connected components of an image (and their bounding boxes) 
* `CannyEdges` : an efficient Canny Edges Detector/Extractor
* `HaarDetector` : detect features and their bounding boxes in image (selection) using Viola-Jones-Lienhart openCV algorithm with `HAAR` cascades (adapted from [HAAR.js](https://github.com/foo123/HAAR.js))
* `ColorDetector` : fast detect and track color regions and their statistics (centroid, bounding box, histogram, ..) (TO BE ADDED)
* `ActiveShapeExtractor` : adapt and extract active shapes/contours from image using gradient fields (TO BE ADDED)
* `LipContourExtractor` : extract lip shape contour using Enevo's Jumping Snake (active shape) algorithm (TO BE ADDED)


###Codecs


Native javascript `codecs` (`encoders` / `decoders`) are included for various `image` formats:

1. `PNG` (adapted from https://github.com/devongovett/png.js/) (**decoder only**)
2. `JPG`/`JPEG` (adapted from https://github.com/eugeneware/jpeg-js) (**encoder + decoder**)
3. `BMP` (adapted from https://github.com/shaozilee/bmp-js) (**encoder + decoder**)
4. `GIF` (adapted from: https://github.com/buzzfeed/libgif-js) (**decoder only**)
5. `TGA` (adapted from: https://github.com/vthibault/roBrowser/blob/master/src/Loaders/Targa.js) (**decoder only**)
6. `RGBE`/`HDR` (adapted from: http://www.graphics.cornell.edu/~bjw/rgbe.html) (**encoder + decoder**)

Instead of separate loaders per image format, only one `binary loader` is used, with the appropriate codecs as parameters.
This makes code more flexible and shorter, loaders can be adapted for nodejs easier and custom codecs can be used on the fly.

**`PNG` example**
Loads an image url in PNG format into a `FILTER.Image` instance. 

````javascript
filterImageInstance = FILTER.IO.BinaryLoader( FILTER.Codec.PNG.decoder ).load( imageUrl [, onLoad, onError] );
````

**`JPG` example**
Loads an image url in JPG format into a `FILTER.Image` instance. 

````javascript
filterImageInstance = FILTER.IO.BinaryLoader( FILTER.Codec.JPG.decoder ).load( imageUrl [, onLoad, onError] );
````

**`GIF` example**
Loads an image url in GIF format into a `FILTER.Image` instance. 

````javascript
filterImageInstance = FILTER.IO.BinaryLoader( FILTER.Codec.GIF.decoder ).load( imageUrl [, onLoad, onError] );
````

**`BMP` example**
Loads an image url in BMP format into a `FILTER.Image` instance. 

````javascript
filterImageInstance = FILTER.IO.BinaryLoader( FILTER.Codec.BMP.decoder ).load( imageUrl [, onLoad, onError] );
````

**`TGA` example**
Loads an image url in TGA format into a `FILTER.Image` instance. 

````javascript
filterImageInstance = FILTER.IO.BinaryLoader( FILTER.Codec.TGA.decoder ).load( imageUrl [, onLoad, onError] );
````

**`RGBE` example**
Loads an image url in RGBE format into a `FILTER.Image` instance. 

````javascript
filterImageInstance = FILTER.IO.BinaryLoader( FILTER.Codec.RGBE.decoder ).load( imageUrl [, onLoad, onError] );
````
