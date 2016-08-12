#FILTER.js 


__A pure JavaScript Library for Image/Video Processing, Filtering and Computer Vision__


This is a library for processing images/video in pure JavaScript using HTML5 features like Canvas, WebWorkers, WebGL and SVG (in progress) or analogs in Node.js.  


**version 0.9.5**


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
* [Procedural Noise](https://en.wikipedia.org/wiki/Procedural_generation)
* [Perlin Noise](https://en.wikipedia.org/wiki/Perlin_noise)
* [Simplex Noise](https://en.wikipedia.org/wiki/Simplex_noise)
* [simplex noise demystified tutorial](http://staffwww.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf)
* [fast almost-Gaussian filtering using integral filters](http://www.csse.uwa.edu.au/~pk/research/pkpapers/FastGaussianSmoothing.pdf)
* [image processing in C](http://homepages.inf.ed.ac.uk/rbf/BOOKS/PHILLIPS/)
* [computer vision: algorithms and applications (draft)](http://szeliski.org/Book/)
* [(Blind) Source Separation](https://en.wikipedia.org/wiki/Blind_signal_separation)
* [Independent Component Analysis](https://en.wikipedia.org/wiki/Independent_component_analysis)
* [OpenCV, open source computer vision](http://opencv.org/)
* [General-purpose GPU Scientific Computing](https://en.wikipedia.org/wiki/General-purpose_computing_on_graphics_processing_units) (..moving towards)


Advanced references:

* [An Image Synthesizer, Ken Perlin 1985](https://design.osu.edu/carlson/history/PDFs/p287-perlin.pdf)
* [Improving Noise, Ken Perlin 2001](http://mrl.nyu.edu/~perlin/paper445.pdf)
* [Optimizations in perlin noise-generated procedural terrain, Marinescu 2012](http://www.cs.ubbcluj.ro/~studia-i/2012-2/05-Marinescu.pdf)
* [Efficient computational noise in GLSL, McEwan, Sheets, Gustavson, Richardson 2012](http://arxiv.org/pdf/1204.1461.pdf)
* [Singular Value Decomposition on GPU using CUDA, Lahabar, Narayanan 2009](http://www.pascal-man.com/navigation/faq-java-browser/GPU/Sheetal09Singular.pdf)
* [Efficient Integral Image Computation on the GPU, Bilgic, Horn, Masaki 2010](http://dspace.mit.edu/openaccess-disseminate/1721.1/71883)
* [Rapid Object Detection using a Boosted Cascade of Simple Features, Viola, Jones 2001](http://www.cs.cmu.edu/~efros/courses/LBMV07/Papers/viola-cvpr-01.pdf)
* [An Extended Set of Haar-like Features for Rapid Object Detection, Lienhart, Maydt 2002](http://www.lienhart.de/Prof._Dr._Rainer_Lienhart/Source_Code_files/ICIP2002.pdf)
* [Automatic and Accurate Lip Tracking, Eveno et al 2004](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.95.6646&rep=rep1&type=pdf)
* [Method for Image Source Separation by Means of Independent Component Analysis: ICA, Maximum Entory Method: MEM, and Wavelet Based Method:
WBM](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.675.4494&rep=rep1&type=pdf)
* [Natural Gradient works efficiently in Learning, Amari 1998](http://www.maths.tcd.ie/~mnl/store/Amari1998a.pdf)
* [Adaptive On-Line Learning algorithms for Blind Separation, Yang, Amari 1997](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.37.7984&rep=rep1&type=pdf)
* [Blind signal separation and identification of mixtures of images, Carmo, Teixeira de Assis, Estrela, Coelho 2009](https://arxiv.org/ftp/arxiv/papers/1603/1603.08095.pdf)



###Features

The library dependencies are:

* [Classy.js](https://github.com/foo123/classy.js) micro Object-Oriented framework.
* [Asynchronous](https://github.com/foo123/asynchronous.js) simple manager for async/parallel tasks.

The framework defines an [Image Proxy class](/api-reference.md#image-class), which represents an Image, a number of utilities like `Color` Class, [Image Loader classes](/api-reference.md#loader--binaryloader--htmlimageloader-classes), [Image Codecs](/api-reference.md#codecs), and 15 generic `Filter` types (some having `glsl`/`svg` analogs) plus various Plugins and Extra filters (with support for parallel processing transparently both for `browser` and `nodejs`)

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
14. [__GLSLFilter__](/api-reference.md#glsl-filter) glsl-based (`webgl`/`node-gl`) analogs of at least some of the generic filters (in progress, possibly in next update)
15. [__SVGFilter__](/api-reference.md#svg-filter) svg-based filters (todo)
16. [__Plugins__](/api-reference.md#plugins-and-extra-filters) (a number of plugin filters which cover a wide(r) range of functionality and use cases)


Each of the generic filters is prototype but it also includes a number of implementation filters like  `grayscale` , `colorize` , `threshold` , `gaussBlur` , `laplace` , `emboss` , `gamma`, `twirl` and so on.. (depending on type of filter)


__Parallel Processing Support (browser and node)__ (support parallel procesing/filtering with filter workers in an intuitive and transparent way, see examples)

__GPU Processing Support (browser and node, in progress)__ (support GPU-based parallel procesing/filtering with glsl filters in an intuitive and transparent way)


__Image Blending Modes__ (analogous to PhotoShop blend modes)


The filters, and the way they operate, naturaly represent a system of interconnected nodes which process and interchange (image) data (not necesarily synchronously), a.k.a *a signal processing graph system*. The result is a streamlined flow for image processing and computer vision in JavaScript.


**TIP:**  You can create your custom build of the library with the filters/plugins you choose. 
Each filter and plugin is independent and can be used in a mix-n-match manner, as long as the core classes are always included. 
Change the dependencies file(s) to include your own selection of filters and plugins for your custom build



###Todo
* add `GLSL` (`webgl`/`node-gl`) support for various generic Filters (in progress, possibly in next update)
* add some needed signal processing graph node filters (eg `algebraic`, `switch`, `delay`  etc..) (in progress)
* add active-shape geometric filters, color/histogram-detector filters, .. (todo)
* add `2d-fft` routines, frequency-domain filtering (todo)
* add machine learning (image) segmentation/classification algorithms (e.g `svd`, `jade`, `kmeans`, `camshift`) (todo)
* add `SVG`, `CSS` Filters interface support for some Filters (todo)
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
