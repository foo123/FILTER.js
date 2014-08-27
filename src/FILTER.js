/**
*
*   FILTER.js
*   @version: @@VERSION@@
*   @@DEPENDENCIES@@
*
*   JavaScript Image Processing Library
*   https://github.com/foo123/FILTER.js
*
**/
var FILTER = this.FILTER || { 
    VERSION: "@@VERSION@@", 
    Class: Classy.Class, 
    Merge: Classy.Merge, 
    PublishSubscribe: PublishSubscribe, 
    Asynchronous: Asynchronous, 
    getPath: Asynchronous.currentPath, 
    isNode: Asynchronous.isPlatform( Asynchronous.Platform.NODE ),
    isBrowser: Asynchronous.isPlatform( Asynchronous.Platform.BROWSER ),
    supportsWorker: Asynchronous.supportsMultiThreading( ),
    isWorker: Asynchronous.isThread( )
};
    
