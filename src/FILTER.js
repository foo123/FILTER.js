/**
*
*   FILTER.js
*   @version: @@VERSION@@
*   @built on @@DATE@@
*   @dependencies: Classy.js, Asynchronous.js
*
*   JavaScript Image Processing Library
*   https://github.com/foo123/FILTER.js
*
**/
"use strict";
var FILTER = Classy.Merge({ 
    Classy: Classy, Asynchronous: Asynchronous, Path: Asynchronous.path( ModuleFactory__FILTER.moduleUri )
}, Classy); /* make Classy methods accessible as FILTER methods, like FILTER.Class and so on.. */
FILTER.VERSION = "@@VERSION@@";
