/**
*
*   FILTER.js
*   @version: @@VERSION@@
*   @built on @@DATE@@
*   @dependencies: Asynchronous.js
*
*   JavaScript Image Processing Library
*   https://github.com/foo123/FILTER.js
*
**/
!function(root, name, factory) {
"use strict";
if (('object' === typeof module) && module.exports) /* CommonJS */
    (module.$deps = module.$deps||{}) && (module.exports = module.$deps[name] = factory.call(root));
else if (('function' === typeof define) && define.amd && ('function' === typeof require) && ('function' === typeof require.specified) && require.specified(name) /*&& !require.defined(name)*/ ) /* AMD */
    define(name, ['module'], function(module) {factory.moduleUri = module.uri; return factory.call(root);});
else if (!(name in root)) /* Browser/WebWorker/.. */
    (root[name] = factory.call(root)||1) && ('function' ===typeof define) && define.amd && define(function() {return root[name];});
}(  /* current root */          'undefined' !== typeof self ? self : this, 
    /* module name */           "FILTER",
    /* module factory */        function ModuleFactory__FILTER() {
/* main code starts here */
"use strict";
var FILTER = {VERSION: "@@VERSION@@"};
