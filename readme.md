# FILTER.js 


__A pure JavaScript Library for Image/Video Processing, Filtering and Computer Vision__


This is a library for processing images/video in pure JavaScript using HTML5 features like Canvas, WebWorkers, WebGL and SVG (in progress) or analogs in Node.js.  


**version 0.9.6**


* [filter.core.js](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.core.js) / [filter.core.min.js](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.core.min.js)
* [filter.io.js](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.io.js) / [filter.io.min.js](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.io.min.js)
* [filter.codecs.js](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.codecs.js) / [filter.codecs.min.js](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.codecs.min.js)
* [filter.filters.js](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.filters.js) / [filter.filters.min.js](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.filters.min.js)
* [filter.plugins.js](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.plugins.js) / [filter.plugins.min.js](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.plugins.min.js)
* [filter.bundle.js, filter+io+codecs+filters+plugins+dependencies](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.bundle.js)


**see also:**  

* [Contemplate](https://github.com/foo123/Contemplate) a light-weight template engine for Node/XPCOM/JS, PHP, Python, ActionScript
* [HtmlWidget](https://github.com/foo123/HtmlWidget) html widgets used as (template) plugins and/or standalone for PHP, Node/XPCOM/JS, Python (can be used as plugins for Contemplate engine as well)
* [Tao](https://github.com/foo123/Tao.js) A simple, tiny, isomorphic, precise and fast template engine for handling both string and live dom based templates
* [ModelView](https://github.com/foo123/modelview.js) a light-weight and flexible MVVM framework for JavaScript/HTML5
* [ModelView MVC jQueryUI Widgets](https://github.com/foo123/modelview-widgets) plug-n-play, state-full, full-MVC widgets for jQueryUI using modelview.js (e.g calendars, datepickers, colorpickers, tables/grids, etc..) (in progress)
* [Dromeo](https://github.com/foo123/Dromeo) a flexible, agnostic router for Node/XPCOM/JS, PHP, Python, ActionScript
* [PublishSubscribe](https://github.com/foo123/PublishSubscribe) a simple and flexible publish-subscribe pattern implementation for Node/XPCOM/JS, PHP, Python, ActionScript
* [Regex Analyzer/Composer](https://github.com/foo123/RegexAnalyzer) Regular Expression Analyzer and Composer for Node/XPCOM/JS, PHP, Python, ActionScript
* [Xpresion](https://github.com/foo123/Xpresion) a simple and flexible eXpression parser engine (with custom functions and variables support) for PHP, Python, Node/XPCOM/JS, ActionScript
* [GrammarTemplate](https://github.com/foo123/GrammarTemplate) versatile and intuitive grammar-based templating for PHP, Python, Node/XPCOM/JS, ActionScript
* [Dialect](https://github.com/foo123/Dialect) a simple cross-platform SQL construction for PHP, Python, Node/XPCOM/JS
* [Abacus](https://github.com/foo123/Abacus) a fast combinatorics and computation library for Node/XPCOM/JS, PHP, Python, ActionScript
* [Asynchronous](https://github.com/foo123/asynchronous.js) a simple manager for async, linearised, parallelised, interleaved and sequential tasks for JavaScript
* [RT](https://github.com/foo123/RT) client-side real-time communication for Node/XPCOM/JS with support for Poll/BOSH/WebSockets


### Contents

* [Live Examples](#live-examples)
* [Browser Support](#browser-support)
* [Credits](#credits)
* [References](/references.md)
* [Features](#features)
* [API Reference](/api-reference.md)
* [ChangeLog](/changelog.md)
* [Todo](#todo)


[![Filter.js](/screenshots/filters-image-process.png)](http://foo123.github.com/examples/filter/)
[![Filter.js](/screenshots/filters-video-process.png)](http://foo123.github.com/examples/filter-video/)
[![Filter.js](/screenshots/filter-sound-vis.png)](http://foo123.github.com/examples/filter-sound/)



### Live Examples
* [Image Processing with `Filter.js`](http://foo123.github.com/examples/filter/)
* [Video Processing with `Filter.js`](http://foo123.github.com/examples/filter-video/)
* [Sound Visualization with `Filter.js` (Trioptic)](http://foo123.github.com/examples/filter-sound/)
* [`Filter.js` with `Three.js`](http://foo123.github.com/examples/filter-three/)
* [`Filter.js` in `Node.js`](/examples/node)


### Browser Support

![firefox](/screenshots/firefox.png) ![chrome](/screenshots/chrome.png) ![opera](/screenshots/opera.png) ![ie](/screenshots/ie.png) ![nodejs](/screenshots/node.png)


### Credits

Some filters code has been adapted from open source libraries (mostly `c`, `java` and `flash`, plus a couple from `javascript` libraries), see the comments in the code for details.


* [**Image Processing Library in Java**](http://www.jhlabs.com/ip/filters/)
* [**AS3 Image Processing Library**](http://je2050.de/imageprocessing/)
* [**AS3 ColorMatrix**](http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html) **by @GSkinner**
* [**Simplex Noise**](https://github.com/kev009/craftd/blob/master/plugins/survival/mapgen/noise/simplexnoise1234.c) and [**Perlin Noise**](https://github.com/kev009/craftd/blob/master/plugins/survival/mapgen/noise/noise1234.c) by **Stefan Gustavson**
* [**glfx.js**](https://github.com/evanw/glfx.js)
* [**JViolaJones**](http://code.google.com/p/jviolajones/), [**HAAR.js**](https://github.com/foo123/HAAR.js)
* [**OpenCV, HAAR cascades**](http://opencv.org/)
* [**zlib**](http://www.zlib.net/) ([`asm.js` emscripten version](https://github.com/ukyo/zlib-asm))
* [**ffmpeg**](https://ffmpeg.org/) ([`asm.js` emscripten version](https://github.com/bgrins/videoconverter.js))


Some image processing/computer vision theory, basics and tutorials (see [references](/references.md)):


* [light, color, perception and color space theory](https://www.cs.unm.edu/~williams/cs422/color.pdf)
* [the influence of history &amp; culture on visual perception](https://bin.sc/Collection/Net/allanmc/web/socialperception14.pdf)
* [a beginners guide to bitmaps](http://paulbourke.net/dataformats/bitmaps/) **by Paul Burke**
* [OpenCV, open source computer vision](http://opencv.org/)
* [General-purpose GPU Scientific Computing](https://en.wikipedia.org/wiki/General-purpose_computing_on_graphics_processing_units) (..moving towards)


### Features

The library dependencies are:

* [Classy.js](https://github.com/foo123/classy.js) micro Object-Oriented framework.
* [Asynchronous](https://github.com/foo123/asynchronous.js) simple manager for async/parallel tasks.

The framework defines an [Image Proxy class](/api-reference.md#image-class), which represents an Image, a number of utilities like `Color` Class, [Image Loader classes](/api-reference.md#file-input-output), [Image Codecs](/api-reference.md#codecs), and 17 generic `Filter` types (some having `glsl`/`svg` analogs) plus various Plugins and Extra filters (with support for parallel processing transparently both for `browser` and `nodejs`)

0. [__AbstractFilter__](/api-reference.md#generic-abstract-filter)
1. [__ColorTableFilter__](/api-reference.md#color-table-filter) 
2. [__ColorMatrixFilter__](/api-reference.md#color-matrix-filter) (analogous to the ActionScript filter)
3. [__ColorMapFilter__](/api-reference.md#color-map-filter)
4. [__AffineMatrixFilter__](/api-reference.md#affine-matrix-filter)
5. [__GeometricMapFilter__](/api-reference.md#geometric-map-filter)
6. [__DisplacementMapFilter__](/api-reference.md#displacement-map-filter) (analogous to ActionScript filter)
7. [__ConvolutionMatrixFilter__](/api-reference.md#convolution-matrix-filter) (analogous to the ActionScript filter)
8. [__MorphologicalFilter__](/api-reference.md#morphological-filter)
9. [__StatisticalFilter__](/api-reference.md#statistical-filter)  (previously called `NonLinearFilter`)
10. [__BlendFilter__](/api-reference.md#blend-filter)
11. [__CompositeFilter__](/api-reference.md#composite-filter) (an abstraction of a container stack for multiple filters)
12. [__AlgebraicFilter__](/api-reference.md#algebraic-filter) (an abstraction of algebraic combination of images or other filter outputs into an output image, to be added)
13. [__InlineFilter__](/api-reference.md#inline-filter) (create inline filters dynamicaly at run-time using your custom functions)
14. [__DimensionFilter__](/api-reference.md#dimension-filter)
15. [__GLSLFilter__](/api-reference.md#glsl-filter) glsl-based (`webgl`/`node-gl`) analogs of at least some of the generic filters (in progress, possibly in next update)
16. [__SVGFilter__](/api-reference.md#svg-filter) svg-based filters (todo)
17. [__Plugins__](/api-reference.md#plugins-and-extra-filters) (a number of plugin filters which cover a wide(r) range of functionality and use cases)


Each of the generic filters is prototype but it also includes a number of implementation filters like  `grayscale` , `colorize` , `threshold` , `gaussBlur` , `laplace` , `emboss` , `gamma`, `twirl` and so on.. (depending on type of filter)


__Parallel Processing Support (browser and node)__ (support parallel procesing/filtering with filter workers in an intuitive and transparent way, see examples)

__GPU Processing Support (browser and node, in progress)__ (support GPU-based parallel procesing/filtering with glsl filters in an intuitive and transparent way)


__Image Blending Modes__ (analogous to PhotoShop blend modes)


The filters, and the way they operate, naturaly represent a system of interconnected nodes which process and interchange (image) data (not necesarily synchronously), a.k.a *a signal processing graph system*. The result is a streamlined flow for image processing and computer vision in JavaScript.


**TIP:**  You can create your custom build of the library with the filters/plugins you choose. 
Each filter and plugin is independent and can be used in a mix-n-match manner, as long as the core classes are always included. 
Change the dependencies file(s) to include your own selection of filters and plugins for your custom build



### Todo
* add `GLSL` (`webgl`/`node-gl`) support for various generic Filters (in progress, possibly in next update)
* add some needed signal processing graph node filters (eg `algebraic`, `switch`, `delay`  etc..) (in progress)
* add active-shape geometric filters, color/histogram-detector filters, .. (todo)
* add `2d-fft` routines, frequency-domain filtering (todo)
* add `SVG`, `CSS` Filters interface support for some Filters (todo)
* add machine learning (image) segmentation/clustering algorithms (e.g `kmeans`, `kmedoids`, `connected components`, `deterministic annealing`, `svd`, `jade`, ..) [DONE partially]
* implement some numeric routines (e.g `blas`, `filter` routines) using faster [`asm.js`](http://asmjs.org/spec/latest/) (browser &amp; nodejs) and/or [`simd.js`](https://hacks.mozilla.org/2014/10/introducing-simd-js/) [DONE partially]
* make convolutions/statistics faster [DONE partially]
* add full support for `Node.js` [DONE]
* add (generic/native) codec support for image formats, e.g `.TGA`, `.HDR`/`.RGBE`, `.GIF`, `.BMP`, `.PNG`, `.JPG`/`.JPEG` etc.. [DONE]
* add support for `Parallel Processing` using `Web Workers` and/or `Asynchronous Processing` [DONE]
* use fixed-point arithmetic, micro-optimizations where possible [DONE]
* add caching of filter parameters where applicable [DONE]
* increase performance for `Opera`, `IE`  [DONE partially]


*URL* [Nikos Web Development](http://nikos-web-development.netai.net/ "Nikos Web Development")  
*URL* [FILTER.js blog post](http://nikos-web-development.netai.net/blog/image-processing-in-javascript-and-html5-canvas/ "FILTER.js blog post")  
*URL* [WorkingClassCode](http://workingclasscode.uphero.com/ "Working Class Code")  
