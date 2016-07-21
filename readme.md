#FILTER.js 


__A pure JavaScript Library for Image/Video Processing, Filtering and Computer Vision__


This is a library for processing images/video in pure JavaScript using HTML5 features like Canvas, WebWorkers, WebGL and SVG (in progress) or analogs in Node.js.  


**version 0.9.0**


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
* [Dialect](https://github.com/foo123/Dialect) a simple cross-platform SQL construction for PHP, Python, Node/XPCOM/JS
* [Abacus](https://github.com/foo123/Abacus) a fast combinatorics and computation library for Node/XPCOM/JS, PHP, Python, ActionScript
* [Asynchronous](https://github.com/foo123/asynchronous.js) a simple manager for async, linearised, parallelised, interleaved and sequential tasks for JavaScript
* [RT](https://github.com/foo123/RT) client-side real-time communication for Node/XPCOM/JS with support for Poll/BOSH/WebSockets


###Contents

* [Live Examples](#live-examples)
* [Browser Support](#browser-support)
* [Credits](#credits)
* [Features](#features)
* [API Reference](/api-reference.md)
* [ChangeLog](/changelog.md)
* [Todo](#todo)


[![Filter.js](/screenshots/filters-image-process.png)](http://foo123.github.com/examples/filter/)
[![Filter.js](/screenshots/filters-video-process.png)](http://foo123.github.com/examples/filter-video/)
[![Filter.js](/screenshots/filter-sound-vis.png)](http://foo123.github.com/examples/filter-sound/)



###Live Examples
* [Image Processing with Filter.js](http://foo123.github.com/examples/filter/)
* [Video Processing with Filter.js](http://foo123.github.com/examples/filter-video/)
* [Sound Visualization with Filter.js](http://foo123.github.com/examples/filter-sound/)
* [Filter.js with Three.js](http://foo123.github.com/examples/filter-three/)
* [Filter.js Image Codecs test](http://foo123.github.com/examples/filter-codecs/)
* [Filter.js in Node.js](/examples/node)


###Browser Support

![firefox](/screenshots/firefox.png) ![chrome](/screenshots/chrome.png) ![opera](/screenshots/opera.png) ![ie](/screenshots/ie.png) ![nodejs](/screenshots/node.png)


###Credits

Some filters code has been adapted from open source libraries (mostly `c`, `java` and `flash`, plus a couple from `javascript` libraries), see the comments in the code for details.


* [**Image Processing Library in Java**](http://www.jhlabs.com/ip/filters/)
* [**AS3 Image Processing Library**](http://je2050.de/imageprocessing/)
* [**AS3 ColorMatrix**](http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html) **by @GSkinner**
* [**Simplex Noise**](https://github.com/kev009/craftd/blob/master/plugins/survival/mapgen/noise/simplexnoise1234.c) and [**Perlin Noise**](https://github.com/kev009/craftd/blob/master/plugins/survival/mapgen/noise/noise1234.c) by **Stefan Gustavson**
* [**JSManipulate**](https://github.com/JoelBesada/JSManipulate)
* [**glfx.js**](https://github.com/evanw/glfx.js)
* [**JViolaJones**](http://code.google.com/p/jviolajones/)
* [**OpenCV, HAAR cascades**](http://opencv.org/)



Some image processing/computer vision theory, basics and tutorials:


* [a beginners guide to bitmaps](http://paulbourke.net/dataformats/bitmaps/) **by Paul Burke**
* [digital image filtering (with emphasis on imagemagick)](http://www.fmwconcepts.com/imagemagick/digital_image_filtering.pdf)
* [image processing basics](http://www.csd.uwo.ca/courses/CS4487a/Lectures/lec03_image_proc.pdf)
* [fundamentals of image processing]( http://www.tnw.tudelft.nl/fileadmin/Faculteit/TNW/Over_de_faculteit/Afdelingen/Imaging_Science_and_Technology/Research/Research_Groups/Quantitative_Imaging/Education/doc/FIP2_3.pdf)
* [fundamentals of image processing](http://www.cs.dartmouth.edu/farid/downloads/tutorials/fip.pdf)
* [image filtering basics for machine vision](http://www.cse.usf.edu/~r1k/MachineVisionBook/MachineVision.files/MachineVision_Chapter4.pdf)
* [image segmentation techniques](http://www.bioss.ac.uk/people/chris/ch4.pdf)
* [simplex noise demystified tutorial](http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf)
* [fast almost-Gaussian filtering using integral filters](http://www.csse.uwa.edu.au/~pk/research/pkpapers/FastGaussianSmoothing.pdf)
* [image processing in C](http://homepages.inf.ed.ac.uk/rbf/BOOKS/PHILLIPS/)
* [computer vision: algorithms and applications (draft)](http://szeliski.org/Book/)
* [OpenCV, open source computer vision](http://opencv.org/)




###Features

The library dependencies are:

* [Classy.js](https://github.com/foo123/classy.js) micro Object-Oriented framework.
* [Asynchronous](https://github.com/foo123/asynchronous.js) simple manager for async/parallel tasks.

The framework defines an [Image Proxy class](/api-reference.md#image-class), which represents an Image, a Color Class, [Image Loader classes](/api-reference.md#loader--binaryloader--htmlimageloader-classes), [Image Codecs](/api-reference.md#codecs), and 8 generic Filter types plus various Plugins (with support for parallel processing transparently both for browser and nodejs)

0. [__AbstractFilter__](/api-reference.md#generic-abstract-filter)
1. [__ColorMatrixFilter__](/api-reference.md#color-matrix-filter) (analogous to the ActionScript filter)
2. [__TableLookupFilter__](/api-reference.md#table-lookup-filter) 
3. [__ConvolutionMatrixFilter__](/api-reference.md#convolution-matrix-filter) (analogous to the ActionScript filter)
4. [__DisplacementMapFilter__](/api-reference.md#displacement-map-filter) (analogous to ActionScript filter)
5. [__GeometricMapFilter__](/api-reference.md#geometric-map-filter)
6. [__MorphologicalFilter__](/api-reference.md#morphological-filter)
7. [__StatisticalFilter__](/api-reference.md#statistical-filter)  (previously called `NonLinearFilter`)
8. [__CompositeFilter__](/api-reference.md#composite-filter) (an abstraction of a container for multiple filters)
9. [__CombinatorFilter__](/api-reference.md#combinator-filter) (combine/blend multiple processed inputs into one output)


__Parallel Processing Support (browser and node)__ (support parallel procesing/filtering with filter workers in an intuitive and transparent way, see examples)


The filters, and the way they operate, naturaly represent a system of interconnected nodes which process and interchange (image) data (not necesarily synchronously), a.k.a *a signal processing graph system*. The result is a streamlined flow for image processing and computer vision in JavaScript.


[__Extension by Plugins / Inline Filters__](/api-reference.md#plugins-and-inline-filters) 


__Image Blending Modes__ (analogous to PhotoShop blend modes)


Each generic filter is prototype but it also includes basic implementation filters like  `grayscale` , `colorize` , `threshold` , `gaussBlur` , `laplace` , `emboss` , and so on..


**TIP:**  You can create your custom build of the library with the filters/plugins you choose. 
Each filter and plugin is independent and can be used in a mix-n-match manner, as long as the core classes are always included. 
Change the dependencies file(s) to include your own selection of filters and plugins for your custom build



###Todo
* add full support for `Node.js` [DONE]
* add `WebGL` support for various pre-built and custom Filters (todo, in progress)
* add `SVG` Filters interface support for various pre-built and custom Filters (todo, in progress)
* add `CSS` Filters interface support for various pre-built and custom Filters (todo, in progress)
* add (generic/native) codec support for image formats, e.g `.TGA`, `.HDR`/`.RGBE`, `.GIF`, `.BMP`, `.PNG`, `.JPG`/`.JPEG` etc.. [DONE]
* add `2d-fft` routines, frequency-domain filtering [DONE partially]
* add image segmentation/classification algorithms (e.g `kmeans`, `em`, `meanshift`) (todo)
* add support for `Parallel Processing` using `Web Workers` and/or `Asynchronous Processing` [DONE partially]
* make convolutions/statistics faster [DONE partially]
* use fixed-point arithmetic, micro-optimizations where possible [DONE partially]
* add caching of filter parameters where applicable [DONE partially]
* add more filters/plugins (eg `split`/`combine`/`adaptive`/`nonlinear` etc..) [DONE partially]
* increase support/performance for `Opera`, `IE`  [DONE partially]


*URL* [Nikos Web Development](http://nikos-web-development.netai.net/ "Nikos Web Development")  
*URL* [FILTER.js blog post](http://nikos-web-development.netai.net/blog/image-processing-in-javascript-and-html5-canvas/ "FILTER.js blog post")  
*URL* [WorkingClassCode](http://workingclasscode.uphero.com/ "Working Class Code")  
