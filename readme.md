# FILTER.js


__A pure JavaScript Library for Image/Video Processing, Filtering and Computer Vision__


This is a library for processing images/video in pure JavaScript using HTML5 features like `Canvas`, Web Workers or alternatives in Node.js (eg `CanvasLite`, `node-canvas`, node processes).


**version 1.0.0** (189 kB minified)


### Contents

* [Live Examples](#live-examples)
* [Browser Support](#browser-support)
* [Credits](#credits)
* [References](/references.md)
* [Features](#features)
* [API Reference](/api-reference.md)
* [ChangeLog](/changelog.md)
* [Todo](#todo)


[![Filter.js](/screenshots/filters-image-process.png)](https://foo123.github.io/examples/filter/)
[![Filter.js](/screenshots/filters-video-process.png)](https://foo123.github.io/examples/filter-video/)
[![Filter.js](/screenshots/filter-sound-vis.png)](https://foo123.github.io/examples/filter-sound/)



### Live Examples
* [Image Processing with `Filter.js`](https://foo123.github.io/examples/filter/)
* [Video Processing with `Filter.js`](https://foo123.github.io/examples/filter-video/)
* [Sound Visualization with `Filter.js` (Trioptic)](https://foo123.github.io/examples/filter-sound/)
* [`Filter.js` with `Three.js`](https://foo123.github.io/examples/filter-three/)
* [`Filter.js` in `Node.js`](/examples/node)


### Browser Support

![firefox](/screenshots/firefox.png) ![chrome](/screenshots/chrome.png) ![opera](/screenshots/opera.png) ![ie](/screenshots/ie.png) ![nodejs](/screenshots/node.png)


### Credits

Some filters code has been adapted from open source libraries, see the comments in the code for details.

* [**Image Processing Library in Java**](http://www.jhlabs.com/ip/filters/)
* [**AS3 Image Processing Library**](http://je2050.de/imageprocessing/)
* [**AS3 ColorMatrix**](http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html) **by @GSkinner**
* [**Simplex Noise**](https://github.com/kev009/craftd/blob/master/plugins/survival/mapgen/noise/simplexnoise1234.c) and [**Perlin Noise**](https://github.com/kev009/craftd/blob/master/plugins/survival/mapgen/noise/noise1234.c) by **Stefan Gustavson**
* [**glfx.js**](https://github.com/evanw/glfx.js)
* [**HAAR.js**](https://github.com/foo123/HAAR.js)


### Features

The framework defines an [`Image`](/api-reference.md#image-class) class, which represents a proxy for an Image, a number of utilities like `Color` class and 13 generic `Filter` types plus various Plugins and Extra filters (with support for parallel processing transparently both for `browser` and `nodejs`)

0. [__AbstractFilter__](/api-reference.md#generic-abstract-filter)
1. [__ColorTableFilter__](/api-reference.md#color-table-filter)
2. [__ColorMatrixFilter__](/api-reference.md#color-matrix-filter) (analogous to the ActionScript filter)
3. [__ColorMapFilter__](/api-reference.md#color-map-filter)
4. [__AffineMatrixFilter__](/api-reference.md#affine-matrix-filter)
5. [__GeometricMapFilter__](/api-reference.md#geometric-map-filter)
6. [__DisplacementMapFilter__](/api-reference.md#displacement-map-filter) (analogous to ActionScript filter)
7. [__ConvolutionMatrixFilter__](/api-reference.md#convolution-matrix-filter) (analogous to the ActionScript filter)
8. [__MorphologicalFilter__](/api-reference.md#morphological-filter)
9. [__StatisticalFilter__](/api-reference.md#statistical-filter)
10. [__BlendFilter__](/api-reference.md#blend-filter)
11. [__DimensionFilter__](/api-reference.md#dimension-filter)
12. [__CompositeFilter__](/api-reference.md#composite-filter) (an abstraction of a container for multiple filters)
13. [__InlineFilter__](/api-reference.md#inline-filter) (create inline filters dynamicaly at run-time using your custom functions)
14. [__Plugins__](/api-reference.md#plugins-and-extra-filters) (plugin filters which cover a wider range of functionality and use cases)


Each of the generic filters is prototype but it also includes a number of implementation filters like  `grayscale` , `colorize` , `threshold` , `gaussBlur` , `laplace` , `emboss` , `gamma`, `twirl` and so on.. (depending on type of filter)


__Parallel Processing Support (browser and node)__ (support parallel procesing/filtering with filter workers in an intuitive and transparent way, see examples)

__Image Blending Modes__ (analogous to SVG blend modes)


**TIP:**  You can create your custom build of the library with the filters/plugins you choose.
Each filter and plugin is independent and can be used in a mix-n-match manner, as long as the core classes are always included.
Change the dependencies file to include your own selection of filters and plugins for your custom build

### Todo
* make convolutions/statistics faster [DONE partially]
* add full support for `Node.js` [DONE]
* add support for `Parallel Processing` using `Web Workers` and/or `Asynchronous Processing` [DONE]
* use fixed-point arithmetic, micro-optimizations where possible [DONE]
* add caching of filter parameters where applicable [DONE]
* increase performance for `Opera`, `IE`  [DONE]

**see also:**

* [Abacus](https://github.com/foo123/Abacus) advanced Combinatorics and Algebraic Number Theory Symbolic Computation library for JavaScript, Python
* [Plot.js](https://github.com/foo123/Plot.js) simple and small library which can plot graphs of functions and various simple charts and can render to Canvas, SVG and plain HTML
* [HAAR.js](https://github.com/foo123/HAAR.js) image feature detection based on Haar Cascades in JavaScript (Viola-Jones-Lienhart et al Algorithm)
* [HAARPHP](https://github.com/foo123/HAARPHP) image feature detection based on Haar Cascades in PHP (Viola-Jones-Lienhart et al Algorithm)
* [FILTER.js](https://github.com/foo123/FILTER.js) video and image processing and computer vision Library in pure JavaScript (browser and node)
* [Xpresion](https://github.com/foo123/Xpresion) a simple and flexible eXpression parser engine (with custom functions and variables support), based on [GrammarTemplate](https://github.com/foo123/GrammarTemplate), for PHP, JavaScript, Python
* [Regex Analyzer/Composer](https://github.com/foo123/RegexAnalyzer) Regular Expression Analyzer and Composer for PHP, JavaScript, Python
* [GrammarTemplate](https://github.com/foo123/GrammarTemplate) grammar-based templating for PHP, JavaScript, Python
* [codemirror-grammar](https://github.com/foo123/codemirror-grammar) transform a formal grammar in JSON format into a syntax-highlight parser for CodeMirror editor
* [ace-grammar](https://github.com/foo123/ace-grammar) transform a formal grammar in JSON format into a syntax-highlight parser for ACE editor
* [prism-grammar](https://github.com/foo123/prism-grammar) transform a formal grammar in JSON format into a syntax-highlighter for Prism code highlighter
* [highlightjs-grammar](https://github.com/foo123/highlightjs-grammar) transform a formal grammar in JSON format into a syntax-highlight mode for Highlight.js code highlighter
* [syntaxhighlighter-grammar](https://github.com/foo123/syntaxhighlighter-grammar) transform a formal grammar in JSON format to a highlight brush for SyntaxHighlighter code highlighter
* [SortingAlgorithms](https://github.com/foo123/SortingAlgorithms) implementations of Sorting Algorithms in JavaScript
* [PatternMatchingAlgorithms](https://github.com/foo123/PatternMatchingAlgorithms) implementations of Pattern Matching Algorithms in JavaScript
* [CanvasLite](https://github.com/foo123/CanvasLite) an html canvas implementation in pure JavaScript
* [Rasterizer](https://github.com/foo123/Rasterizer) stroke and fill lines, rectangles, curves and paths, without canvas
* [Gradient](https://github.com/foo123/Gradient) create linear, radial, conic and elliptic gradients and image patterns without canvas
* [Geometrize](https://github.com/foo123/Geometrize) Computational Geometry and Rendering Library for JavaScript
* [MOD3](https://github.com/foo123/MOD3) 3D Modifier Library in JavaScript
* [css-color](https://github.com/foo123/css-color) simple class to parse and manipulate colors in various formats

