##ChangeLog

__0.9.6__

* new morphological filters (methods), `gradient`, `laplacian`
* some new methods (pre-computed filters) in `colortable` filter, which are similar to `colormatrix` filter
* faster canny gradient algorithm with fixed gaussian filter (faster but different quality from previous version), optional (eg gausian or deriche) blur pre-processing can also be applied (set pre-blur parameter to `false`, see examples)
* optimise and fix some typos in `connectedcomponents` filter and machinelearning method
* fix `container` meta parameter in `compositefilter` after each `apply` call (could be overwritten deeper in apply chain)
* canny gradient pruning in haar detector computed using wrong indices in previous optimisations, fixed
* the way extra filter inputs were handled has a bug, if same image is used as extra input in more than one filter and image is updated through another filter, it is possible depending on order of application that some filters will get the previous version of the image as input (because it is cached and not resent to save bandwidth) while only the first filter will get the updated (correct) version, fixed
* add initial versions of some machine learning algorithms, `kmeans`, `kmedoids`, `svd`, move `connected_components` algorithm under `machinelearning` package
* re-implement `FloodFill`, `PatternFill` as scanline `connected_component` with seed algorithm
* make image/filter selections accept both relative and absolute coordinates (default relative)
* update references, examples


__0.9.5__

* fix any nodejs portability emulation and parallel threads issues
* make parallel thread calls faster (both browser and nodejs), update asynchronous
* fix some typos in `Color` utility and plugins
* add extra static utilities in `Color` class (`.intensity`, `.hue`, `.saturation`, `blend` modes, ..)
* color space conversions made faster and more generic
* restructure utiltiies and folders (e.g `Math`, `String`, `Array`, `Image`, `Filter` utils, ..)
* filters and created plugins automaticaly support the `constructor-factory` pattern to be able to be instantiated without the explicit `new Filter()` operator instead simply using `Filter()`, see updated examples
* handle uniformly and more efficiently multiple extra input images in filters, simplify filters' `serialize`/`unserialize` methods (there is a bug to be fixed in how the inputs are handled, see api-reference)
* make filters pass generic `metaData` in `apply` method instead of just the `src` image (e.g useful in composite filters to adjust parameters of filters at run-time based on previous filter outputs etc..)
* a number of filters/plugins have been combined or extended to support various modes of operation defined in `FILTER.MODE` (see examples)
* two new generic filters (which replace multiple plugins, see updated examples) `AffineMatrixFilter` (i.e linear geometric map filtering) and `ColorMapFilter` (i.e non-linear color transformation filtering) instead of having multiple filters and plugins with similar functionalities scattered around, plus dynamicaly optimise them, parametrise them and also have GLSL analogs more easily
* remove `AlphaMaskFilter`, `ChannelCopyFilter` has been extended with same functionality
* new effects utilities and plugins `gradient`, `radial-gradient` (nodejs support), extra static part of `Filter.Image`
* new plugin `PatternFillFilter` (in `FloodFillFilter` plugin file)
* new plugin `DropShadowFilter` (analogous to ActionScript filter)
* new plugin `ConnectedComponentsFilter`
* add new filters `ResampleFilter`, `SelectionFilter`
* move `BlendFilter` into generic filters instead of plugins, new `AlgebraicFilter` (instead of `CombinatorFilter`), in progress
* make `BlendFilter` accept multiple inputs, plus extra alpha (opacity) parameter and enabled/disabled flag (per input), via `BlendMatrix` (see examples)
* new and faster approximate algorithm for `Pixelate`, `TriangularPixelate`, `HexagonalPixelate`, all included in `Pixelate` plugin file
* make histogram equalisation faster, some convolutions and statistics faster and fix some typos, hue extraction faster, .. (up to consistent 60 fps processing)
* have faster convolutions and statistics for grayscale images via `FILTER.MODE.GRAY` parameter (i.e `.setMode(FILTER.MODE.GRAY)`)
* histogram equalize filter is now one filter with mode parameter (defined in `FILTER.MODE`) for type of equalisation (i.e `MODE.INTENSITY`, `MODE.GRAY`, `MODE.RGB`)
* add custom <del>`selection`</del> option `tolerance` to `HaarDetector` plugin so it can detect in a region of image instead of whole (useful for combining detectors to detect different feaures consecutively, where one detects in region detected previously..)
* `selection` option is added to generic `Filter` so all filter instances can have custom selections for any purpose needed
* simplify and make somewhat faster `CannyEdges` and `HaarDetector` plugins
* fix `tensor_product` utility from previous update (produced incorrect convolution kernels)
* fix `Image.image` method issue when loading an image without initializing `imageData` in nodejs
* heavy refactoring and optimisations
* update examples (both live browser and nodejs)
* prepare support for glsl-based filters (`webgl`/`node-gl`) and svg-based filters


__0.9.0__

* restructure folders, separate builds for core, io, fx, util, codecs, filters, plugins, bundle
* full support for nodejs (including parallel processing through forked processes)
* various fixes and refactorings (esp. for nodejs support)
* new effects: `gradient`, `radial-gradient` (nodejs support), extra static part of `Filter,Image` (fx/ folder)
* new plugin `PatternFillFilter` (in `FloodFillFilter` plugin file)
* `PerlinNoise` is **not** a plugin anymore, it is extra static part of `Filter,Image` (fx/ folder)
* update examples, dependencies (asynchronous), add advanced references


__0.8.0__

* update classy, asynchronous dependencies, examples
* update buildtools, UMD templates, filter add-ons are better bundled
* various optimisations, refactorings
* CustomFilter renamed to InlineFilter
* some modifications towards node.js support

__0.7.2__

* add image encoders for `JPG`, `BMP`, `RGBE`
* fix `BMP` decoder
* add `Canvas` polyfill (to be used if in `Node`)
* refactoring/changes


__0.7.1__

* use one binary loader and multiple image codecs instead of separate image loaders per image format (more flexible)
* add image codecs (currently decoders only) for `PNG`,`JPG`,`BMP`,`GIF`,`TGA`,`RGBE` formats (see references)
* minor refactoring/changes


__0.7__

* add `FILTER.Math` routines and algorithms (interpolation, fourier transforms etc..)
* add `fft1d`, `fft2d` fast fourier transform routines, image spectrum, frequency domain filtering
* add `nearest neighbor`, `bilinear`, `bicubic` interpolation/resizing routines
* add `TGALoader`, `RGBELoader`, `GIFLoader` generic/native image parsers/loaders
* new plugin: `SeamlessTileFilter`, create a seamless tileable pattern from an image
* new plugin: `HaarDetector`, detect image features using Viola-Jones-Lienhart `openCV` `HAAR` cascades algorithm (adapted from [HAAR.js](https://github.com/foo123/HAR.js))
* new plugin: `HalftoneFilter`, create a halftoned/dithered image from target image
* `PerlinNoiseFilter` plugin enhancement enable fractal noise and turbulence, octave noise and seamless noise
* filters/plugins can transmit `metadata` (e.g `HaarDetector`) to pass additional information which is not necessarily an image
* refactor/optimise


__0.7-alpha__, __0.7-alpha2__

* images can be restorable
* add image loaders, remove image loading from `FILTER.Image` class
* new plugin: `FloodFillFilter`, fast flood filling using scanline algorithm with tolerance factor
* new plugin: `CannyEdgesFilter`, efficient Canny Edges Detector
* new plugin: `PerlinNoiseFilter` efficient `Perlin Noise` and `Simplex Noise` implementations
* new geometric filter: `GeometricMapFilter.shift`, fast circular shift/translation of image
* update dependencies (e.g `classy.js`), update examples
* refactoring, optimisations


__0.6.17__ , __0.6.18__

* update buildtools/dependencies
* minor changes

__0.6.15__ , __0.6.16__

* update buildtools/dependencies
* remove `FILTER.Image.blend` method (there is filter plugin for this), add `FILTER.Image.toImage` method

__0.6.14__

* remove `PublishSubscribe` for implementing generic filter/image events
* heavy refactor/optimise/minimise


__0.6.13__

* use `Asynchronous.js` for parallel/async filter tasks
* use `PublishSubscribe` for implementing generic filter/image events
* heavy refactor/optimise

__0.6.12__

* use `Color` Class from (https://github.com/foo123/css-color) to enhance `FILTER.Color`
* (re-)add `apply` method to `Image` Class (shorthand to `Filter.apply` method)

__0.6.11__

* serialization changes (more options, transparently)
* enable customFilters to be used in parallel (see api-reference)
* edits/optimizations

__0.6.10__

* more parallel options, external script path options
* typos/edits

__0.6.9__

* support parallel filtering/procesing with filter workers transparently
* new filters polar/cartesian/directionalBlur/zoomBlur (**in progress**)
* code refactor, optimisations, edits
* update [`classy.js`](https://github.com/foo123/classy.js) OO framework
* update live examples / docs


__0.6.7, 0.6.8__

* code refactor, various optimisations, edits, tidy up
* add `ScaledImage` class, represents an image that can be automatically down/up scaled
* add image `select` / `deselect` methods, allow filters to be applied only to selected part of image if set
* add `geometric ripple filter`
* add `channel copy plugin` , `triangular pixelate plugin` , `blend filter plugin` , `grayscale equalize plugin`
* most point parameters in filters (eg. `centerX` , `centerY` , etc..) are now relative percentages (ie. in [0, 1] ) instead of absolute values (see examples)
* use [`classy.js`](https://github.com/foo123/classy.js) for `OO`
* update `buildtools` / live examples / docs


__0.6.6__

* fix some issues with `Opera`, `IE` (eg. `GeometricMap` filter)
* add alternative `solarize` effects 
* minor refactoring, optimisations, inheritance mechanism
* add `turnOn()`, `turnOff()`, `isOn()`, methods for filters/plugins
* typos/edits


__0.6.5__

* some tidy up of the repo and files


__0.6.4__

* fix `affineMap` filter of the `GeometricMap` class (was defined in wrong way)
* add `YCbCrConverter` plugin filter
* add `Bokeh` (Depth-of-Field) plugin filter
* add `Glow` convolution filter
* add another `Sepia` effect in `ColorMatrixFilter` (`sepia`)
* use optimised convolutions for `3x3`, `5x5` common cases
* minor edits/optimizations


__0.6.3__

* add new plugin `Threshold`
* minor fixes for cross-browser support
* typos/edits
* add `Sound Visualization` example
* update examples with new filters
* update readme


__0.6.2__

* compatibility fixes for `IE9`, `IE10`
* minor edits


__0.6.1__

* new plugin `AlphaMask`
* add support for `Opera`, `IE9`(slower) (browsers tested `Firefox`, `Chrome`, `IE9+`, `Opera`)
* minor fixes/edits
* add sound visualization example with `Filter.js`
* 3 different builds: `filter.min.js` (full), `filter.basic.min.js` (core and filters only), `filter.plugins.min.js` (plugins only)


__0.6__

* faster convolution algorithm for specific (symmetric) convolution kernels (eg `laplace` kernel, `box blur` kernel, `box highpass` kernel etc..)
* rename `NonLinearFilter` to `StatisticalFilter` (make sure to change that in your code if a `NonLinearFilter` was used)
* add new image methods (`clear`, `fill` etc..)
* add new `composite` filter methods (`removeAt`, `insertAt`, etc..)
* add new `geometric` maps (`twirl`, `sphere`, `rotateCW`, `rotateCCW`)
* add new `color matrix` methods (`YcbCr2RGB`, `RGB2YCbCr`)
* add new `lookup table` methods (`extract`, `replace`, `mask`)
* add new color transforms (`HSV2RGB`, `RGB2HSV`)
* add new plugins (`HueExtractor`, `HSVConverter`)
* optimise `Pixelate` plugin
* minor other optimizations
* naming changes for some internal variables


__0.5__

* add new generic filters (`GeometricMap`, `Combine`, `Split`)
* add new plugin (`Pixelate`)
* heavy convolution and loops optimizations, refactoring
* update examples / readme


__0.4.1__

* add new filters implementations (`exposure`, `mask` etc..)


__0.4__

* add new `Image` methods ( `scale`, `flipHorizontal`, `flipVertical` )
* add new generic filter type `FILTER.TableLookupFilter` and some pre-computed filters ( `posterize`, `solarize`, etc..)
* minor edits/optimizations
* update readme / examples


__0.3.3.1__

* load a video as `FILTER.Image` (fixed)
* add new interactive real-time video post-process example with `Filter.js`


__0.3.3__

* allow framework to be extended by custom plugins (both as `Classes` and `Inline`)
* add some sample custom plugins (`Equalize.js`, `RGBEqualize.js`, `Noise.js`)
* add more methods to `Image` Class (`getPixel`, `setPixel`)
* minor optimizations
* new build tool
* update examples / readme

__0.3.2__

* add new `ColorMatrixFilters`, `channel()` : get a generic color channel as an image,  `swapChannels()` : swap two image channels (eg `FILTER.CHANNEL.GREEN`, `FILTER.CHANNEL.BLUE`)


__0.3.1__

* add more methods to `Composite` Filter (`shift`/`unshift` etc..)
* allow other composite filters to be used as simple filter components in other composite filters (fixed)
* add new `ColorMatrixFilters`: `redChannel`, `greenChannel`, `blueChannel`, `alphaChannel`
* minor optimizations


__0.3__

* Add new filters (eg `Gradients`, `Gaussian`, `Median`, `Erode`, etc..)
* Refactor the filter API (filter `apply` function accepts a `FILTER.Image` now)
* Optimise the image and filters classes (cache data if possible, minimise copies, optimise loops etc..)
* Minor math optimizations and micro-optimizations
* Add `Composite` filters stack (applyin multiple filters on same image is faster and easier this way)
* Add `Color` Transforms class (to/from `Hex`/`RGB`, to/from `RGB`/`YCbCr` etc..)
* update examples/readme


__0.2__

* Refactored Code to use closures (more modular)
* Added `exCanvas` script for Browsers that do not support Canvas
* minimum math optimizations


__0.1__

* initial release
