# FILTER.js


**A pure JavaScript Library for Image/Video Processing, Filtering and Computer Vision**


This is a library for processing images/video in pure JavaScript using HTML5 features like `Canvas`, **Web Workers, WebAssembly and WebGL** or alternatives in Node.js (eg `CanvasLite`, `node-canvas`, `node-gl`, node `processes`).


**version 1.14.0 in progress** (321 kB minified)


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
* [Image Processing with `Filter.js` (synchronous/parallel/webgl/wasm)](https://foo123.github.io/examples/filter/)
* [Video Processing with `Filter.js` (synchronous/webgl/wasm)](https://foo123.github.io/examples/filter-video/)
* [Sound Visualization with `Filter.js` (Trioptic)](https://foo123.github.io/examples/filter-sound/)
* [Cartoonify Yourself with `Filter.js`](https://foo123.github.io/examples/cartoonify-yourself/?webgl=1)
* [`Filter.js` with `Three.js`](https://foo123.github.io/examples/filter-three/)
* [`Filter.js` in `Node.js`](/examples/node)


### Browser Support

![firefox](/screenshots/firefox.png) ![chrome](/screenshots/chrome.png) ![opera](/screenshots/opera.png) ![ie](/screenshots/ie.png) ![nodejs](/screenshots/node.png)


### Credits

Some filters code has been adapted from open source libraries and/or public domain code, see comments in source code for details.

* [**Image Processing Library in Java**](http://www.jhlabs.com/ip/filters/)
* [**AS3 Image Processing Library**](http://je2050.de/imageprocessing/)
* [**OpenCV**](https://github.com/opencv)
* [**HAAR.js**](https://github.com/foo123/HAAR.js)


### Features

The framework defines an [`Image`](/api-reference.md#image-class) class, which represents a proxy for an Image, a number of utilities like `Color` class and 14 generic `Filter` types plus various Plugins and Extra filters (with support for **(low-level) CPU and GPU parallel processing** transparently both for `browser` and `nodejs`)

0. [**AbstractFilter**](/api-reference.md#generic-abstract-filter)
1. [**ColorTableFilter**](/api-reference.md#color-table-filter)
2. [**ColorMatrixFilter**](/api-reference.md#color-matrix-filter) (analogous to the ActionScript filter)
3. [**ColorMapFilter**](/api-reference.md#color-map-filter)
4. [**AffineMatrixFilter**](/api-reference.md#affine-matrix-filter)
5. [**GeometricMapFilter**](/api-reference.md#geometric-map-filter)
6. [**DisplacementMapFilter**](/api-reference.md#displacement-map-filter) (analogous to ActionScript filter)
7. [**ConvolutionMatrixFilter**](/api-reference.md#convolution-matrix-filter) (analogous to the ActionScript filter)
8. [**MorphologicalFilter**](/api-reference.md#morphological-filter)
9. [**StatisticalFilter**](/api-reference.md#statistical-filter)
10. [**BlendFilter**](/api-reference.md#blend-filter)
11. [**DimensionFilter**](/api-reference.md#dimension-filter)
12. [**CompositeFilter**](/api-reference.md#composite-filter) (an abstraction of a container for multiple filters)
13. [**InlineFilter**](/api-reference.md#inline-filter) (create inline filters dynamically at run-time using your custom functions)
14. [**FrequencyFilter**](/api-reference.md#frequency-filter) (frequency domain filters)
15. [**Extra Filters**](/api-reference.md#plugins-and-extra-filters) (extra filters which cover a wider range of functionality and use cases)


Each of the generic filters is prototype but it also includes a number of implementation filters like  `grayscale` , `colorize` , `threshold` , `gaussBlur` , `laplace` , `emboss` , `gamma`, `twirl` and so on.. (depending on type of filter)


**CPU Parallel Processing for browser and nodejs**: support CPU parallel procesing with filter Workers in an intuitive and transparent way, see examples.

**GPU Parallel Processing for browser and nodejs**: support GPU/WebGL parallel procesing with GLSL filters in an intuitive and transparent way, see examples.

**Mix CPU/GPU filters transparently**

**Fast CPU Assembly Code for browser and nodejs**: support assembly coded filters, see examples.

**Map/Reduce functionality**

**Image Blending Modes** (analogous to SVG blend modes)


**TIP:**  You can create your custom build of the library with the filters/plugins you choose.
Each filter and plugin is independent and can be used in a mix-n-match manner, as long as the core classes are always included.
Change the dependencies file to include your own selection of filters and plugins for your custom build

### Todo
* make WASM versions of filters where possible [DONE]
* make GLSL versions of filters where possible [DONE]
* make convolutions/statistics faster [DONE partially]
* add full support for `Node.js` [DONE]
* add support for `Parallel Processing` using `Web Workers` and/or `Asynchronous Processing` [DONE]
* use fixed-point arithmetic, micro-optimizations where possible [DONE]
* add caching of filter parameters where applicable [DONE]
* increase performance for `Opera`, `IE`  [DONE]

**see also:**

* [Abacus](https://github.com/foo123/Abacus) Computer Algebra and Symbolic Computation System for Combinatorics and Algebraic Number Theory for JavaScript and Python
* [TensorView](https://github.com/foo123/TensorView) view array data as multidimensional tensors of various shapes efficiently
* [Geometrize](https://github.com/foo123/Geometrize) Computational Geometry and Rendering Library for JavaScript
* [Plot.js](https://github.com/foo123/Plot.js) simple and small library which can plot graphs of functions and various simple charts and can render to Canvas, SVG and plain HTML
* [CanvasLite](https://github.com/foo123/CanvasLite) an html canvas implementation in pure JavaScript
* [Rasterizer](https://github.com/foo123/Rasterizer) stroke and fill lines, rectangles, curves and paths, without canvas
* [Gradient](https://github.com/foo123/Gradient) create linear, radial, conic and elliptic gradients and image patterns without canvas
* [css-color](https://github.com/foo123/css-color) simple class to parse and manipulate colors in various formats
* [MOD3](https://github.com/foo123/MOD3) 3D Modifier Library in JavaScript
* [HAAR.js](https://github.com/foo123/HAAR.js) image feature detection based on Haar Cascades in JavaScript (Viola-Jones-Lienhart et al Algorithm)
* [HAARPHP](https://github.com/foo123/HAARPHP) image feature detection based on Haar Cascades in PHP (Viola-Jones-Lienhart et al Algorithm)
* [FILTER.js](https://github.com/foo123/FILTER.js) video and image processing and computer vision Library in pure JavaScript (browser and nodejs)
* [Xpresion](https://github.com/foo123/Xpresion) a simple and flexible eXpression parser engine (with custom functions and variables support), based on [GrammarTemplate](https://github.com/foo123/GrammarTemplate), for PHP, JavaScript, Python
* [Regex Analyzer/Composer](https://github.com/foo123/RegexAnalyzer) Regular Expression Analyzer and Composer for PHP, JavaScript, Python
* [GrammarTemplate](https://github.com/foo123/GrammarTemplate) grammar-based templating for PHP, JavaScript, Python
* [codemirror-grammar](https://github.com/foo123/codemirror-grammar) transform a formal grammar in JSON format into a syntax-highlight parser for CodeMirror editor
* [ace-grammar](https://github.com/foo123/ace-grammar) transform a formal grammar in JSON format into a syntax-highlight parser for ACE editor
* [prism-grammar](https://github.com/foo123/prism-grammar) transform a formal grammar in JSON format into a syntax-highlighter for Prism code highlighter
* [highlightjs-grammar](https://github.com/foo123/highlightjs-grammar) transform a formal grammar in JSON format into a syntax-highlight mode for Highlight.js code highlighter
* [syntaxhighlighter-grammar](https://github.com/foo123/syntaxhighlighter-grammar) transform a formal grammar in JSON format to a highlight brush for SyntaxHighlighter code highlighter
* [Fuzzion](https://github.com/foo123/Fuzzion) a library of fuzzy / approximate string metrics for PHP, JavaScript, Python
* [Matchy](https://github.com/foo123/Matchy) a library of string matching algorithms for PHP, JavaScript, Python
* [PatternMatchingAlgorithms](https://github.com/foo123/PatternMatchingAlgorithms) library of Pattern Matching Algorithms in JavaScript using [Matchy](https://github.com/foo123/Matchy)
* [SortingAlgorithms](https://github.com/foo123/SortingAlgorithms) library of Sorting Algorithms in JavaScript

