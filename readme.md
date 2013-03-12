#FILTER.js A Javascript Library for Image Processing and Filtering using HTML5 Canvas

This is a library for filtering images in javascript using canvas element.  
It defines an Image class which represents and Image and 4 generic filters  

* ColorMatrixFilter (analogous to the actionscript version)
* ConvolutionMatrixFilter (analogous to the actionscript version)
* DisplacementMapFilter (analogous to actionscript version)
* Image Blending Modes (analogous to Photoshop blends)

each generic filter is prototype but it also includes basic implementation filters like grayscale, colorize, threshold, gauss, laplace, emboss, etc..  

also a SobelFilter is defined which is a composite filter (composition of generic filters)

source code, minified version and build tools are included  
also 2 examples are included a basic and an example with three.js

version 0.2 Changes
* Refactored Code to use closures (more modular)
* Added exCanvas script for Browsers that do not support Canvas

*Contributor* Nikos M.  
*URL* [Nikos Web Development](http://nikos-web-development.netai.net/ "Nikos Web Development")  
*URL* [FILTER.js blog post](http://nikos-web-development.netai.net/blog/image-processing-in-javascript-and-html5-canvas/ "FILTER.js blog post")  
*URL* [WorkingClassCode](http://workingclasscode.uphero.com/ "Working Class Code")  
