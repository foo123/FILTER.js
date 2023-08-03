## API Reference


The library dependencies are:

* [Asynchronous](https://github.com/foo123/asynchronous.js) simple manager for async/parallel tasks.


**TIP:**  You can create your custom build of the library with the filters/plugins you choose.
Each filter and plugin is independent and can be used in a mix-n-match manner, as long as the core classes are always included.
Change the dependencies file(s) to include your own selection of filters and plugins for your custom build


### Contents

* [Image](#image-class)
* [Abstract Filter](#generic-abstract-filter)
* [Color Table Filter](#color-table-filter)
* [Color Matrix Filter](#color-matrix-filter) (analogous to the ActionScript filter)
* [Color Map Filter](#color-map-filter)
* [Affine Matrix Filter](#affine-matrix-filter)
* [Geometric Map Filter](#geometric-map-filter)
* [Displacement Map Filter](#displacement-map-filter) (analogous to ActionScript filter)
* [Convolution Matrix Filter](#convolution-matrix-filter) (analogous to the ActionScript filter)
* [Morphological Filter](#morphological-filter)
* [Statistical Filter](#statistical-filter)
* [Blend Filter](#blend-filter)
* [Dimension Filter](#dimension-filter)
* [Composite Filter](#composite-filter) (an abstraction of a container for multiple filters)
* [Inline Filter](#inline-filter) (create dynamic filters at run-time while having the full power of `Filter`s)
* [Plugins / Extra Filters](#plugins-and-extra-filters)


### Image Class

````javascript
new FILTER.Image(image:Image|Video|Canvas|FILTER.Image|ImageData = null);
````

This is a placeholder for an image, along with basic methods to access the image data
and alter them.

__Methods:__

* `image(image:Image|Video|Canvas|FILTER.Image|ImageData)`  Sets/Alters the underlying image
* `select(x1:Number, y1:Number, x2:Number, y2:Number, absolute:Boolean=false)`  set a (relative or absolute) rectangle as selected part of image (any filters will be applied only to that part)
* `select(false)/deselect()`  remove previous selection (selected part becomes whole image)
* `store()`  store the current filtered/processed image as the original image
* `restore()` restore the original image, remove any filters applied to this image
* `restorable(bool:Boolean)` whether the image is restorable (it can be faster if not)
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
* `getData(processed:Boolean=false)` gets a copy of image (original or processed/filtered) pixel data
* `setSelectedData()` sets the image pixel data for the current selection
* `getSelectedData(processed:Boolean=false)` gets a copy of the (original or processed/filtered) pixel data of current image selection region
* `toImage(callback:Function, type:String="image")` call callback with an Image object or a data uri of the current image according to type ("uri" or "image")


### Generic Abstract Filter

Each filter (and plugin) is an extension of the generic abstract filter, which provides some common methods.

**Note:** Built-in and plugin filters implement the `constructor-factory` pattern meaning one can instantiate them without the explicit `new Filter()` operator.


__Properties:__

* `name`   the (class) name of the filter (should be the exact class name, since this is also used by worker filters to instantiate the appropriate filter)
* `hasMeta`  whether the filter has meta data passed between processes (except the current image data), for example bounding boxes or other data (for example the `HaarDetectorFilter` returns the detected regions as metaData, while the passed image data are left unchanged)
* `meta` the (optional) filter's metadata object or null if filter has no metadata
* `hasInputs`  whether the filter has multiple extra inputs (except the current image data input), for example blend filters or displacement map filters or alpha mask filters have an extra image input (the blending image or displacement image or mask image respectively)
* `inputs` the extra filter's inputs object (by key)

__Methods:__

* `reset()`   reset the filter to identity (trivial)
* `dispose()`   dispose the filter (disposes associated filter thread also if needed)
* `turnOn([bool:Boolean=true])`  turn the filter `ON`/`OFF`
* `toggle()`  toggle the filter's `ON`/`OFF` status
* `isOn()`   check if filter is `ON` or `OFF`
* `combineWith(similarFilterInstance:Filter)`  for any filter that supports combination of a similar filter with itself, else does nothing
* `setMode(mode:FILTER.MODE)` Set the filter mode, each filter may use this parameter as it sees fit (for example see below)
* `setInput(key:String, inputImage:Image)`  for filters that accept multiple extra inputs (e.g `blend` filters) this method sets various extra inputs by key and manages the extra inputs more efficiently and transparently
* `unsetInput(key)`  for filters that accept multiple extra inputs (e.g `blend` filters) this method unsets inputs by key (see above)
* `input(key)/getInput(key)`  for filters that accept multiple extra inputs (except the main image input e.g `blend` filters) the extra inputs are available to the filter via this method by inputKey (see above)
* `serialize()`  serialize filter's parameters (for use during parallel processing)
* `unserialize(data:Object)`  unserialize filter's parameters (for use during parallel processing)
* `metaData()/getMetadata()`  access filter's metadada (if filter supports process metaData, e.g `featureDetection` filters)
* `select(x1:Number, y1:Number, x2:Number, y2:Number, absolute:Boolean=false)` define a (relative or absolute) rectangular area as filter selection (this is available to each filter to handle as it sees fit, see for example the `SelectionFilter` below and the `HaarDetectorFilter` plugin)
* `select(false)/deselect()` deselect any selection made previously
* `worker/thread([enabled:Boolean=true [, import_extra_scripts:Array]])`  enable/disable parallel filter thread/worker for this filter (each filter can have its own worker filter in another thread transparently)
* `apply(srcImg:Image [, destImg:Image=srcImg] [, callback:Function])`   apply the filter to a dest `Image` instance using imageData from `srcImage` (the `destImage` output will be changed after the filter application, the filters can be removed if image is restorable)


### Color Table Filter

````javascript
new FILTER.ColorTableFilter(colorTable:ImageArray [, colorTableG:ImageArray, colorTableB:ImageArray]);
````

The (optional) colorTable(s) parameter(s) are array(s) of 256 numbers which define the color lookup map(s) (separately for Green and Blue channels if specified, else same table for all RGB channels).

The filter scans an image and maps each pixel color according to the color table map per color

The class has various pre-defined filters which can be combined in any order.

* `functional(fR:Function, fG:Function=fR, fB:Function=fG)` set color tables via functionals per color channel (or same for all channels)
* `invert()` Inverts image colors to their complementary
* `mask(mask:HEX)` Apply a bit-mask to the image pixels
* `replace(color:HEX, replacecolor:HEX)` Replace a color with another color
* `extract(channel:FILTER.CHANNEL, range:Array, background:HEX)` Extract a color range from a specific color channel and set all rest to a background color
* `gammaCorrection(gammaR:Number, gammaG:Number=gammaR, gammaB:Number=gammaG)` Apply gamma correction to image channels
* `exposure(exposure:Number)` Alter image exposure
* `solarize(threshold:Number, type:Integer=1)`  Apply a solarize effect
* `solarize2()`  Apply alternative solarize effect (`type=2`)
* `posterize(numLevels:Integer) / quantize(numLevels:Integer)`  Quantize uniformly the image colors
* `binarize()`  Quantize uniformly the image colors in 2 levels
* `thresholds(thresholdsR:Array, thresholdsG:Array, thresholdsB:Array)`  Quantize non-uniformly the image colors according to given thresholds
* `threshold()`  Quantize non-uniformly the image colors in 2 levels according to given threshold
* `contrast(r:Number, g:Number=r, b:Number=g)`  Increase/Decrease image contrast
* `brightness(r:Number, g:Number=r, b:Number=g)`  Adjust image brightness
* `quickContrastCorrection(contrast:Number=1.2)`

These filters are pre-computed, however any custom filter can be created by setting the color table manually (in the constructor).

Color Table Filters can be combined very easily since they operate only **on mapping a single pixel color** at a time.

In order to use both an invert and a posterize filter use the following chaining:

````javascript

var invertPosterize = new FILTER.ColorTableFilter().invert().posterize(4);
// this also works
var invertPosterize = FILTER.ColorTableFilter().invert().posterize(4);

// if you want to make this filter work in another thread in parallel through a worker, do:
invertPosterize.worker();

// if you want to stop and dispose the worker for this filter, do:
invertPosterize.worker(false);

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
invertPosterize.apply(image);   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply(invertPosterize);   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


### Color Matrix Filter

````javascript
new FILTER.ColorMatrixFilter(colorMatrix:Array);
````

This filter is analogous to the ActionScript filter of same name.
The (optional) `colorMatrix` parameter is an array of 20 numbers which define the multipliers and bias terms
for the RGBA components of each pixel in an image.

The filter scans an image and maps each pixel colors linearly according to the color matrix.

The class has various pre-defined filters which can be combined in any order.

* `redChannel() / greenChannel() / blueChannel() / alphaChannel()`  Get the R/G/B/A channel of the image as a new image
* `swapChannels(ch1:FILTER.CHANNEL, ch2:FILTER.CHANNEL)`  swap 2 image channels (eg `FILTER.CHANNEL.GREEN`, `FILTER.CHANNEL.BLUE`)
* `maskChannel(ch:FILTER.CHANNEL)`  mask (remove) an image channel
* `desaturate() / grayscale()`  Applies grayscaling to an image
* `colorize(color:HEX, amount:Number=1)` Applies pseudo-color to an image
* `invert()` Inverts image colors to their complementary
* `invertAlpha()` Inverts ALPHA channel of image
* `saturate(saturation:Number)`  Saturates the image (each color to maximum degree)
* `contrast(r:Number, g:Number=r, b:Number=g)`  Increase/Decrease image contrast
* `brightness(r:Number, g:Number=r, b:Number=g)`  Adjust image brightness
* `adjustHue(degrees:Number)`  adjust image hue by degrees
* `average(r:Number=1/3, g:Number=r, b:Number=g)`   color image to an average color (similar to grayscale)
* `quickContrastCorrection(contrast:Number=1.2)`
* `sepia(amount:Number=0.5)`   applies a quick sepia effect
* `sepia2(amount:Number=10)`   applies an alternative quick sepia effect
* `threshold(threshold:Number)`  applies a color threshod to the image
* `thresholdRGB(threshold:Number)`  applies a threshod to the image only to the RGB channels
* `thresholdAlpha()`  applies a threshod to the image only to the Alpha channel
* `blend()`  blend this filter with another color matrix filter

These filters are pre-computed, however any custom filter can be created by setting the filter weights manually (in the constructor).

Color Matrix Filters can be combined very easily since they operate only **on mapping single pixel colors linearly**.

In order to use both a grayscale and a contrast filter use the following chaining:

````javascript

var grc = new FILTER.ColorMatrixFilter().grayscale().contrast(1);
// this also works
var grc = FILTER.ColorMatrixFilter().grayscale().contrast(1);

// if you want to make this filter work in another thread in parallel through a worker, do:
grc.worker();

// if you want to stop and dispose the worker for this filter, do:
grc.worker(false);

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
grc.apply(image);   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply(grc);   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


### Color Map Filter

````javascript
new FILTER.ColorMapFilter(colorMap:Function);
````

The filter scans an image and maps each pixel colors non-linearly according to the color mapping function.

The class has various pre-defined filters.

* `threshold/quantize(thresholds:Array, quantizedcolors:Array)`  applies a full 32-bit threshods to the image with quantized colors
* `extract/mask(min:Number, max:Number, background:HEX)`  applies a color mask to (i.e extracts range of colors from) image
* `RGB2HSV()`  transforms RGB to HSV color space
* `HSV2RGB()`  transforms HSV to RGB color space
* `RGB2HSL()`  transforms RGB to HSL color space
* `HSL2RGB()`  transforms HSL to RGB color space
* `RGB2HWB()`  transforms RGB to HWB color space
* `HWB2RGB()`  transforms HWB to RGB color space
* `RGB2CMYK()`  transforms RGB to CMY(K) color space
* `hue()`  transforms to grayscale based on hue
* `saturation()`  transforms to grayscale based on saturation

These filters are pre-computed, however any custom filter can be created by setting the color mapping function manually (in the constructor).

Color Map Filters cannot be combined very easily since they operate **on mapping single pixel colors non-linearly**.

To apply the filter to an image do:

````javascript

var hsv = new FILTER.ColorMapFilter().RGB2HSV();
// this also works
var hsv = FILTER.ColorMapFilter().RGB2HSV();

// if you want to make this filter work in another thread in parallel through a worker, do:
hsv.worker();

// if you want to stop and dispose the worker for this filter, do:
hsv.worker(false);
// this is same even if filter uses a parallel worker filter
hsv.apply(image);   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply(hsv);   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


### Affine Matrix Filter

````javascript
new FILTER.AffineMatrixFilter(affineMatrix:Array);
````

The filter scans an image and maps each pixel position linearly according to the affine transformation matrix.

The optional transformMatrix parameter is an array of numbers that defines the linear geometric mapping of pixels (see examples)

The class has some pre-defined filters to use.

* `flipX()`  Flip the target image wrt to `X` axis
* `flipY()`  Flip the target image wrt to `Y` axis
* `flipXY()`  Flip the target image wrt to both `X` and `Y` axis
* `translate(dx:Number, dy:Number, relative:Boolean)`  Translate target image by `dx`, `dy` (relative) offsets
* `rotate(theta:Number)`  Rotate target image by `theta` radians
* `scale(sx:Number, sy:Number)`  Scale target image by `sx, sy` amount
* `skew(thetax:Number, thetay:Number)`  Skew target image by `thetax, thetay` amounts in each direction

Affine Matrix Filters can be combined very easily since they operate **on mapping single pixels positions linearly**.

In order to use an affine matrix filter do the following:

````javascript

var flipX = new FILTER.AffineMatrixFilter().flipX();
// this also works
var flipX = FILTER.AffineMatrixFilter().flipX();

// if you want to make this filter work in another thread in parallel through a worker, do:
flipX.worker();

// if you want to stop and dispose the worker for this filter, do:
flipX.worker(false);

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
flipX.apply(image);   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply(flipX);   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


### Geometric Map Filter

````javascript
new FILTER.GeometricMapFilter(geometricMap:Function);
````

The filter scans an image and maps each pixel position non-linearly according to the geometric transformation map function.

The optional geometricMap parameter is a function that implements a geometric mapping of pixels (see examples)

The class has some pre-defined filters to use.

* `generic()` Apply a a user-defined generic geometric mapping to the image
* `twirl()`  Apply a twirling map
* `sphere()`  Apply a spherical map
* `polar()`  Transform image to polar coords (not implemented yet)
* `cartesian()`  Inverse of polar (not implemented yet)

Geometric Map  Filters cannot be combined very easily since they operate **on mapping single pixels positions non-linearly**. Use a composite filter (see below)

In order to use a geometric filter do the following:

````javascript

var twirl = new FILTER.GeometricMapFilter().twirl();
// this also works
var twirl = FILTER.GeometricMapFilter().twirl();

// if you want to make this filter work in another thread in parallel through a worker, do:
twirl.worker();

// if you want to stop and dispose the worker for this filter, do:
twirl.worker(false);

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
twirl.apply(image);   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply(twirl);   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


### Displacement Map Filter

````javascript
new FILTER.DisplacementMapFilter(displaceMap:Image);
````

This filter is analogous to the ActionScript filter of same name.
The displaceMap parameter is a (FILTER.Image instance) image that acts as the displacement Map.

The filter scans an image and maps each pixel position non-linearly according to the (coloring of the) displacement map image.


Displacement Map  Filters cannot be combined very easily since they operate **on mapping single pixels positions non-linearly**. Use a composite filter (see below)

In order to use an displace filter do the following:

````javascript

var dF = new FILTER.DisplacementMapFilter(displaceMap);
// this also works
var dF = FILTER.DisplacementMapFilter(displaceMap);

// set any filter parameters if needed
dF.scaleX = 100;  // amount of scaling in the x-direction
dF.scaleY = 100;  // amount of scaling in the y-direction
df.startX = 0; // x coordinate of filter application point
df.startY = 0; // y coordinate of filter application point
df.componentX = FILTER.CHANNEL.GREEN; // use the map green channel for the x displacement
dF.mode = FILTER.MODE.WRAP; // any values outside image should be wrapped around

// if you want to make this filter work in another thread in parallel through a worker, do:
dF.worker();

// if you want to stop and dispose the worker for this filter, do:
dF.worker(false);

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
dF.apply(image);   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply(dF);   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


### Convolution Matrix Filter

````javascript
new FILTER.ConvolutionMatrixFilter(convolutionMatrix:Array, factor:Number);
````

This filter is analogous to the ActionScript filter of same name.
The (optional) convolutionMatrix parameter is a square matrix of convolution coefficients represented as an array.
The (optional) factor is the normalization factor for the convoltuon matrix. The matrix elements should sum up to 1,
in order for the filtered image to have same brightness as original.

The filter scans an image and changes the current pixel by mixing the RGBA channels of the pixel and the pixels in its neighborhood according to the convolution matrix.

A convolution matrix with large dimesions (NxN) will use pixels from a larger neighborhood and hence it is slower.

Convolution matrices usually have odd dimensions (3x3, 5x5, 7x7, 9x9, etc..) This is related to the fact that the matrix must define a unique center element (ie. current pixel)  which only odd dimensions allow.

The class has various pre-defined filters to use.

* `fastGauss()`  A fast implementation of an arbitrary gaussian low pass filter approximation
* `functional(kernelFunc:Function)`  generic functional-based convolution kernel, e.g use a real gaussian kernel function etc..
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
* `emboss() / bump()`   Apply emboss effect to the image
* `edges()`  Apply an edge filter to the image
* `setMode(FILTER.MODE.GRAY)` Use faster convolution filters for grayscale images

These filters are pre-computed, however any custom filter can be created by setting the filter weights manually (in the constructor).

Convolution  Filters cannot be combined very easily since they operate **on varying pixel neighborhoods** at a time. Using a composite filter, filters can be combined into a filter stack which apply one at a time (see below)

In order to use an emboss filter do the following:

````javascript

var emboss = new FILTER.ConvolutionMatrixFilter().emboss();
// this also works
var emboss = FILTER.ConvolutionMatrixFilter().emboss();

// if you want to make this filter work in another thread in parallel through a worker, do:
emboss.worker();

// if you want to stop and dispose the worker for this filter, do:
emboss.worker(false);

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
emboss.apply(image);   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply(emboss);   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


### Morphological Filter

````javascript
new FILTER.MorphologicalFilter();
````

This filter implements basic morphological processing like erode and dilate filters with arbitrary structure elements (given as matrix array)

The class has some pre-defined filters to use.

* `erode()` Apply morphological erode operation
* `dilate()` Apply morphological dilate operation
* `opening()` Apply morphological opening operation
* `closing()` Apply morphological closing operation
* `gradient()` Apply morphological gradient operation
* `laplacian()` Apply morphological laplacian (2nd-order gradient) operation
* `smoothing()` Apply morphological smoothing operation (not implemented yet)
* `setMode(FILTER.MODE.GRAY)` Use faster morphological filters for grayscale images

Morphological Filters cannot be combined very easily since they operate **on varying pixel neighborhoods** at a time with non-linear processing. Use a composite filter (see below)

In order to use a dilate filter do the following:

````javascript

var dilate = new FILTER.MorphologicalFilter().dilate([
        0, 0, 1,
        0, 1, 0,
        1, 0, 0
]);  // dilate with a 3x3 diagonal structure element
// this also works
var dilate = FILTER.MorphologicalFilter().dilate([
        0, 0, 1,
        0, 1, 0,
        1, 0, 0
]);  // dilate with a 3x3 diagonal structure element

// if you want to make this filter work in another thread in parallel through a worker, do:
dilate.worker();

// if you want to stop and dispose the worker for this filter, do:
dilate.worker(false);

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
dilate.apply(image);   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply(dilate);   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


### Statistical Filter

````javascript
new FILTER.StatisticalFilter();
````

This filter implements some statistical processing like median filters and erode/dilate (maximum/minimum) filters which use statistics and `kth`-order statistics concepts.

The class has some pre-defined filters to use.

* `median(dimension:Integer=3)`  Apply median (ie. lowpass/remove noise) filter, same as `kth(0.5)`
* `minimum(dimension:Integer=3)/erode(dimension:Integer=3)` Apply minimum (erode) filter, same as `kth(0)`
* `maximum(dimension:Integer=3)/dilate(dimension:Integer=3)` Apply maximum (dilate) filter, same as `kth(1)`
* `kth(k:Number, dimension:Integer=3)`  Apply kth statistic for arbitarry `k` in `0..1` range
* `setMode(FILTER.MODE.GRAY)` Use faster statistical filters for grayscale images

Statistical Filters cannot be combined very easily since they operate **on varying pixel neighborhoods** at a time with non-linear processing. Use a composite filter (see below)

In order to use a median filter do the following:

````javascript

var median = new FILTER.StatisticalFilter().median(3);  // 3x3 median
// this also works
var median = FILTER.StatisticalFilter().median(3);  // 3x3 median

// if you want to make this filter work in another thread in parallel through a worker, do:
median.worker();

// if you want to stop and dispose the worker for this filter, do:
median.worker(false);

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
median.apply(image);   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply(median);   // image is a FILTER.Image instance, see examples

````

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


### Blend Filter

````javascript
new FILTER.BlendFilter(blendMatrix:Array);
````

The filter blends multiple images together with svg-like blending modes using a `blendMatrix` that is a (flat) array of rows (each row having `4` items, total = `4N` for `N` images) describing the `blendMode`, start `x,y` positions and `enabled` flag for each of the blend images to be blended with the main image (see below).

**Supported Blend Modes:**

* normal
* multiply
* screen
* overlay
* darken
* lighten
* color-dodge
* color-burn
* hard-light
* soft-light
* difference
* exclusion
* average
* linear-dodge/add
* linear-burn/subtract
* negation
* linear-light

In order to use a blend filter do the following:

````javascript
                                          /* blendMode, startX, startY, enabled, .. */
var blend3Images = new FILTER.BlendFilter(["screen",    0,      0,      1,/*input1*/
                                            "overlay",   10,    10,      1 /*input2*/]).setInput(1, blendImg).setInput(2, anotherBlendImg);
// this also works
var blend3Images = FILTER.BlendFilter.setInput(1, blendImg).setInput(2, anotherBlendImg).set(["screen", 0, 0, 1,
                                                                     "overlay", 10, 10, 1]);

// if you want to make this filter work in another thread in parallel through a worker, do:
blend3Images.worker();

// if you want to stop and dispose the worker for this filter, do:
blend3Images.worker(false);

// this is same even if filter uses a parallel worker filter
blend3Images.apply(image);   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply(blend3Images);   // image is a FILTER.Image instance, see examples

````

### Dimension Filter

````javascript
new FILTER.DimensionFilter(mode:String, a:Number, b:Number, c:Number, d:Number);
````

The filter changes the dimension of the image by (re-)scaling, cropping, or padding the image.
if `mode` is `"pad"`, `a` is left padding, `b` is top padding, `c` is right padding and `d` is bottom padding.
if `mode` is `"crop"`, `a` is left offset, `b` is top offset, `c` is width and `d` is height.
if `mode` is `"scale"`, `a` is horizontal scaling and `b` is vertical scaling.

If complicated cropping, padding and scaling is needed use multiple Dimension Filters.


### Composite Filter


````javascript
new FILTER.CompositeFilter([filter1:Filter, filter2:Filter, filter3:Filter /*, etc..*/]:Array);
````

This filter implements a filter stack which enables multiple filters (even other composite filters) to be applied
more easily (and slightly faster) to an image, than to apply them one-by-one manually

The class implements these methods:

* `push()/concat()`  add filter(s) to the end of stack
* `pop()` remove a filter from the end of stack
* `shift()`  remove a filter from the start of stack
* `unshift()` add filter(s) to the start of stack
* `remove()` remove a filter by instance
* `removeAt()` remove the filter at specified location/order
* `insertAt()` insert filter(s) at specified location/order
* `filter()` get/set the filter at this location
* `stable(bool:Boolean)` whether the filter is stable (meaning no filters will be added and/or removed), this makes serialization faster
* `reset()/empty()` reset the filter to identity


In order to use a composite filter do the following:

````javascript

var grc = new FILTER.ColorMatrixFilter().grayscale().contrast(1);
var emboss = new FILTER.ConvolutionMatrixFilter().emboss();
var combo = new FILTER.CompositeFilter([grc, emboss]);
// this also works
var grc = FILTER.ColorMatrixFilter().grayscale().contrast(1);
var emboss = FILTER.ConvolutionMatrixFilter().emboss();
var combo = FILTER.CompositeFilter([grc, emboss]);

// if you want to make this filter work in another thread in parallel through a worker, do:
// NOTE: a composite filter uses its own worker and all constituting filters will be accordingly transfered
// each constituting filter can also use its own worker for other tasks
// but is not needed for the composite worker
combo.worker();

// if you want to stop and dispose the worker for this filter, do:
combo.worker(false);

````

To apply the filter to an image do:

````javascript

// this is same even if filter uses a parallel worker filter
combo.apply(image);   // image is a FILTER.Image instance, see examples
// this will also work:
image.apply(combo);   // image is a FILTER.Image instance, see examples

combo.remove(emboss);  // remove the emboss filter from the chain
// or also
emboss.turnOn(false);    // turn off the emboss filter while on the chain without losing its settings

````

NOTE: The (filter) apply method will actually change the image output to which it is applied, the filters can be removed if image is restorable


### Inline Filter

````javascript
new FILTER.InlineFilter(filterFunc:Function);
````

This filter creates inline filters dynamicaly at run-time using your custom functions with the full power of `Filter` (including parallel processing transparently).

Inline Filters support parallel filter threads/workers (make sure the custom function does not reference other external data, except the `FILTER` namespace which will be available literaly at instantiation, so it can be serialized correctly)


Example:

````javascript

var inlinefilter = new FILTER.InlineFilter(function(filterParameters, im, w, h, metaData) {
    // this is the inline filter apply method
    // do your stuff here..
    // "filterParameters"  are custom parameters added to inline filter instance, useful if you need to use extra parameters
    // for example extra/custom parameters are available as `filterParameters.myCustomColorParameter`
    // "im"     is (a copy of) the image pixel data,
    // "w"      is the image width,
    // "h"      is the image height
    // "metaData" is an optional object containing information about `src` and `dst` images (can also be used to pass information between filters inside a filter chain)
    // make sure to return the data back
    return im;
});
// this also works
var inlinefilter = FILTER.InlineFilter(function(filterParameters, im, w, h, metaData) {
    // this is the inline filter apply method
    // do your stuff here..
    // make sure to return the data back
    return im;
});

// use it alone
inlinefilter.apply(image);
// or use it with any composite filter
new FILTER.CompositeFilter([filter1, filter2, inlinefilter]).apply(image);
// this will also work:
image.apply(inlinefilter);   // image is a FILTER.Image instance, see examples
image.apply(FILTER.CompositeFilter([filter1, filter2, inlinefilter]));

````

### Plugins and Extra Filters

The library can be extended by custom plugins which add new filters.
A comprehensive framework is provided for creating plugins that function the same as built-in filters (see examples at `/src/plugins/Noise.js` etc..)

Included Plugins support parallel thread/worker filters (see code and examples)


__Included Plugins__ (see examples for how to use)

<table>
<thead>
<tr><td>Plugin</td> <td>Description</td></tr>
</thead>
<tbody>
<tr><td>Noise</td>    <td>generate uniform noise</td></tr>
<tr><td>PerlinNoise</td>  <td>generate perlin noise</td></tr>
<tr><td>HistogramEqualize</td>    <td>apply fast histogram equalization (intensity-based, grayscale-based or per separate rgb channel)</td></tr>
<tr><td>Pixelate</td>  <td>fast pixelate the image to the given scale using various patterns<br />"rectangular" (default)<br />"triangular"<br />"rhomboidal"<br />"hexagonal"</td></tr>
<tr><td>Halftone</td> <td>create a halftone/dithered black-white or colored image from target image</td></tr>
<tr><td>Bokeh</td>    <td>apply a fast Bokeh (Depth-of-Field) effect to an image</td></tr>
<tr><td>ColorFill<br />PatternFill</td> <td>apply a (fast) color flood-fill (scanline seed fill) to paint a connected region of an image (with given tolerance factor)<br />apply a (fast) pattern flood-fill to a connected region of an image using another image as pattern</td></tr>
<tr><td>ChannelCopy</td>  <td>copy a channel from an image to another channel on target image (can also act as `AlphaMask` depending on operation mode)</td></tr>
<tr><td>DropShadow</td>   <td>generate drop shadow(s) with opacity on image (analogous to ActionScript filter)</td></tr>
<tr><td>SeamlessTile</td> <td>create a seamless tileable pattern from target image</td></tr>
<tr><td>ConnectedComponents</td>  <td>extract fast all or only those matching Color/Intensity/Hue connected components of an image (and their bounding boxes)</td></tr>
<tr><td>CannyEdges</td>   <td>an efficient Canny Edges Detector/Extractor</td></tr>
<tr><td>HaarDetector</td> <td>detect features and their bounding boxes in image (selection) using Viola-Jones-Lienhart openCV algorithm with `HAAR` cascades (adapted from <a href="https://github.com/foo123/HAAR.js">HAAR.js</a>)</td></tr>
</tbody>
</table>
