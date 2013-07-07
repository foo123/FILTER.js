#FILTER.js 

__A Javascript Library for Image Processing and Filtering using HTML5 Canvas__

This is a library for filtering images in javascript using canvas element.  

[![Filter.js](/examples/filters-che.png)](http://foo123.github.com/examples/filter-three/)

###Live Example
* [Filters with Three.js](http://foo123.github.com/examples/filter-three/)

It defines an Image class which represents and Image and 4 generic filters  

* __ColorMatrixFilter__ (analogous to the actionscript version)
* __ConvolutionMatrixFilter__ (analogous to the actionscript version)
* __DisplacementMapFilter__ (analogous to actionscript version)
* __Image Blending Modes__ (analogous to Photoshop blends)

each generic filter is prototype but it also includes basic implementation filters like 
_grayscale_ , _colorize_ , _threshold_ , _gauss_ , _laplace_ , _emboss_ , etc..  

A _SobelFilter_ is defined which is a __composite__ filter (composition of generic filters)

source code, minified version and build tools are included  
2 examples are included: a basic and an example with three.js

###ChangeLog

__0.2__
* Refactored Code to use closures (more modular)
* Added exCanvas script for Browsers that do not support Canvas
* minimum math optimizations

__0.1__
* initial release

*Contributor* Nikos M.  
*URL* [Nikos Web Development](http://nikos-web-development.netai.net/ "Nikos Web Development")  
*URL* [FILTER.js blog post](http://nikos-web-development.netai.net/blog/image-processing-in-javascript-and-html5-canvas/ "FILTER.js blog post")  
*URL* [WorkingClassCode](http://workingclasscode.uphero.com/ "Working Class Code")  
