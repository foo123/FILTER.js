##ChangeLog

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
