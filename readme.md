#FILTER.js 


__A JavaScript Library for Image/Video Processing and Filtering using HTML5 APIs__


This is a library for filtering images/video in JavaScript using HTML5 features like Canvas, WebWorkers, WebGL and SVG (in progress).  


**version 0.7** **IN PROGRESS DO NOT USE**


* [filter.js](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.js)
* [filter.min.js](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.min.js)
* [filter.plugins.js](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.plugins.js)
* [filter.plugins.min.js](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.plugins.min.js)
* [filter.bundle.js, filter+plugins+dependencies](https://raw.githubusercontent.com/foo123/FILTER.js/master/build/filter.bundle.js)


**see also:**  

* [Contemplate](https://github.com/foo123/Contemplate) a light-weight template engine for Node/JS, PHP, Python, ActionScript
* [Tao](https://github.com/foo123/Tao.js) A simple, tiny, isomorphic, precise and fast template engine for handling both string and live dom based templates
* [ModelView](https://github.com/foo123/modelview.js) a light-weight and flexible MVVM framework for JavaScript/HTML5
* [ModelView MVC jQueryUI Widgets](https://github.com/foo123/modelview-widgets) plug-n-play, state-full, full-MVC widgets for jQueryUI using modelview.js (e.g calendars, datepickers, colorpickers, tables/grids, etc..) (in progress)
* [Dromeo](https://github.com/foo123/Dromeo) a flexible, agnostic router for Node/JS, PHP, Python, ActionScript
* [PublishSubscribe](https://github.com/foo123/PublishSubscribe) a simple and flexible publish-subscribe pattern implementation for Node/JS, PHP, Python, ActionScript
* [Regex Analyzer/Composer](https://github.com/foo123/RegexAnalyzer) Regular Expression Analyzer and Composer for Node/JS, PHP, Python, ActionScript
* [Xpresion](https://github.com/foo123/Xpresion) a simple and flexible eXpression parser engine (with custom functions and variables support) for PHP, Python, Node/JS, ActionScript
* [Dialect](https://github.com/foo123/Dialect) a simple cross-platform SQL construction for PHP, Python, Node/JS, ActionScript (in progress)
* [Simulacra](https://github.com/foo123/Simulacra) a simulation, algebraic, probability and combinatorics PHP package for scientific computations
* [Asynchronous](https://github.com/foo123/asynchronous.js) a simple manager for async, linearised, parallelised, interleaved and sequential tasks for JavaScript


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


###Browser Support

![firefox](/screenshots/firefox.png) ![chrome](/screenshots/chrome.png) ![opera](/screenshots/opera.png) ![ie](/screenshots/ie.png)


###Credits

Some filters code has been adapted from open source libraries (mostly java and flash, plus a couple from javascript libraries), see the comments in the code for details.


* **Image Processing Library in Java** (http://www.jhlabs.com/ip/filters/)
* **AS3 Image Processing Library** (http://je2050.de/imageprocessing/)
* **AS3 ColorMatrix by GSkinner** (http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html)
* **Simplex and Perlin Noise by Stefan Gustavson** (https://github.com/kev009/craftd/blob/master/plugins/survival/mapgen/noise/simplexnoise1234.c, https://github.com/kev009/craftd/blob/master/plugins/survival/mapgen/noise/noise1234.c)
* **JSManipulate** (https://github.com/JoelBesada/JSManipulate)
* **glfx.js** (https://github.com/evanw/glfx.js)



Some image processing theory, basics and tutorials:


* [digital image filtering (with emphasis on imagemagick)](http://www.fmwconcepts.com/imagemagick/digital_image_filtering.pdf)
* [image processing basics](http://www.csd.uwo.ca/courses/CS4487a/Lectures/lec03_image_proc.pdf)
* [fundamentals of image processing]( http://www.tnw.tudelft.nl/fileadmin/Faculteit/TNW/Over_de_faculteit/Afdelingen/Imaging_Science_and_Technology/Research/Research_Groups/Quantitative_Imaging/Education/doc/FIP2_3.pdf)
* [fundamentals of image processing](http://www.cs.dartmouth.edu/farid/downloads/tutorials/fip.pdf)
* [image filtering basics for machine vision](http://www.cse.usf.edu/~r1k/MachineVisionBook/MachineVision.files/MachineVision_Chapter4.pdf)
* [simplex noise demystified tutorial](http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf)




###Features

The library dependencies are:

* [Classy.js](https://github.com/foo123/classy.js) micro Object-Oriented framework.
* [Asynchronous](https://github.com/foo123/asynchronous.js) simple manager for async/parallel tasks.

The framework defines an [Image Proxy class](/api-reference.md#image-class), which represents an Image, a Color Utilities Class, [Image Loader classes](/api-reference.md#loader--htmlimageloader-classes),  and 8 generic Filter types plus various Plugins (with support for parallel processing transparently)

0. [__AbstractFilter__](/api-reference.md#generic-abstract-filter)
1. [__ColorMatrixFilter__](/api-reference.md#color-matrix-filter) (analogous to the ActionScript filter)
2. [__TableLookupFilter__](/api-reference.md#table-lookup-filter) 
3. [__ConvolutionMatrixFilter__](/api-reference.md#convolution-matrix-filter) (analogous to the ActionScript filter)
4. [__DisplacementMapFilter__](/api-reference.md#displacement-map-filter) (analogous to ActionScript filter)
5. [__GeometricMapFilter__](/api-reference.md#geometric-map-filter)
6. [__MorphologicalFilter__](/api-reference.md#morphological-filter)
7. [__StatisticalFilter__](/api-reference.md#statistical-filter)  (previously called NonLinearFilter)
8. [__CompositeFilter__](/api-reference.md#composite-filter) (an abstraction of a container for multiple filters)


__Parallel Workers Support__ (support parallel procesing/filtering with filter workers in an intuitive and transparent way)


[__Extension by Plugins / Inline Filters__](/api-reference.md#plugins-and-inline-filters) 


__Image Blending Modes__ (analogous to PhotoShop blend modes)


Each generic filter is prototype but it also includes basic implementation filters like  _grayscale_ , _colorize_ , _threshold_ , _gaussBlur_ , _laplace_ , _emboss_ , etc..  


**TIP:**  You can create your custom build of the library with the filters/plugins you choose. 
Each filter and plugin is independent and can be used in a mix-n-match manner, as long as the core classes are always included. 
Change the dependencies file(s) to include your own selection of filters and plugins for your custom build



###Todo
* add WebGL support for various pre-built and custom Filters (in progress)
* add SVG Filters interface support for various pre-built and custom Filters (in progress)
* add CSS Filters interface support for various pre-built and custom Filters (in progress)
* add (generic/native) loader support for other image formats, e.g .TGA, .HDR/.RGBE, .GIF, .BMP, .PNG, .JPG etc.. [DONE partially]
* add full support for Node.js (todo)
* add 2d-fft routines, frequency-domain filtering [DONE partially]
* add support for Parallel Processing using Web Workers and/or Asynchronous Processing [DONE partially]
* make convolutions/statistics faster [DONE partially]
* use fixed-point arithmetic, micro-optimizations where possible [DONE partially]
* add caching of filter parameters where applicable [DONE partially]
* add more filters (eg split/combine/adaptive/nonlinear etc..) [DONE partially]
* increase support/performance for Opera, IE  [DONE partially]


*URL* [Nikos Web Development](http://nikos-web-development.netai.net/ "Nikos Web Development")  
*URL* [FILTER.js blog post](http://nikos-web-development.netai.net/blog/image-processing-in-javascript-and-html5-canvas/ "FILTER.js blog post")  
*URL* [WorkingClassCode](http://workingclasscode.uphero.com/ "Working Class Code")  
