/**
*
*   FILTER.js
*   @version: 1.9.4
*   @built on 2024-01-17 18:30:58
*   @dependencies: Asynchronous.js
*
*   JavaScript Image Processing Library
*   https://github.com/foo123/FILTER.js
*
**//**
*
*   FILTER.js
*   @version: 1.9.4
*   @built on 2024-01-17 18:30:58
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
var FILTER = {VERSION: "1.9.4"};
/**
*
*   Asynchronous.js
*   @version: 0.5.1
*
*   Simple JavaScript class to manage asynchronous, parallel, linear, sequential and interleaved tasks
*   https://github.com/foo123/asynchronous.js
*
**/
!function(root_, FILTER, undef) {
"use strict";

var  PROTO = "prototype" 
    ,Obj = Object, Arr = Array, Func = Function
    ,FP = Func[PROTO], OP = Obj[PROTO], AP = Arr[PROTO]
    ,fromJSON = JSON.parse, toJSON = JSON.stringify
    ,HAS = OP.hasOwnProperty
    ,NOP = function() {}
    ,curry = function(f, x) {return function() {return f(x);};}
    ,slice = FP.call.bind(AP.slice), toString = OP.toString
    ,is_function = function(f) {return "function" === typeof f;}
    ,is_instance = function(o, t) {return o instanceof t;}
    ,SetTime = setTimeout, ClearTime = clearTimeout
    ,UNDEFINED = undef, UNKNOWN = 0, NODE = 1, BROWSER = 2
    ,DEFAULT_INTERVAL = 60, NONE = 0, INTERLEAVED = 1, LINEARISED = 2, PARALLELISED = 3, SEQUENCED = 4
    ,isXPCOM = ("undefined" !== typeof Components) && ("object" === typeof Components.classes) && ("object" === typeof Components.classesByID) && Components.utils && ("function" === typeof Components.utils["import"])
    ,isNode = ("undefined" !== typeof global) && ("[object global]" === toString.call(global))
    // http://nodejs.org/docs/latest/api/all.html#all_cluster
    ,isNodeProcess = isNode && ("undefined" !== typeof process.send)
    ,isSharedWorker = !isXPCOM && !isNode && ("undefined" !== typeof SharedWorkerGlobalScope) && ("function" === typeof importScripts)
    ,isWebWorker = !isXPCOM && !isNode && ("undefined" !== typeof WorkerGlobalScope) && ("function" === typeof importScripts) && (navigator instanceof WorkerNavigator)
    ,isBrowser = !isXPCOM && !isNode && !isWebWorker && !isSharedWorker && ("undefined" !== typeof navigator) && ("undefined" !== typeof document)
    ,isBrowserWindow = isBrowser && !!window.opener
    ,isBrowserFrame = isBrowser && (window.self !== window.top)
    ,isAMD = ("function" === typeof define ) && define.amd
    ,supportsMultiThread = isNode || ("function" === typeof Worker) || ("function" === typeof SharedWorker)
    ,root = isNode ? root_ : (isSharedWorker || isWebWorker ? self||root_ : window||root_)
    ,scope = isNode ? module.$deps : (isSharedWorker || isWebWorker ? self||this : window||this)
    ,globalScope = isNode ? global : (isSharedWorker || isWebWorker ? self||this : window||this)
    ,isThread = isNodeProcess || isSharedWorker || isWebWorker
    ,isInstantiatedThread = (isNodeProcess && (0 === process.listenerCount('message'))) || (isSharedWorker && !root.onconnect) || (isWebWorker && !root.onmessage)
    ,Listener = isInstantiatedThread ? function Listener( msg ) { if ( Listener.handler ) Listener.handler( isNodeProcess ? msg : msg.data );  } : NOP
    ,Thread, component = null, LOADED = {}, numProcessors = isNode ? require('os').cpus( ).length : 4
    
    ,URL = !isNode ? ("undefined" !== typeof root.webkitURL ? root.webkitURL : ("undefined" !== typeof root.URL ? root.URL : null)) : null
    ,blobURL = function(src, options) {
        return src && URL
            ? URL.createObjectURL(new Blob(src.push ? src : [src], options || {type: "text/javascript"}))
            : src
        ;
    }
    
    // Get current filename/path
    ,path = function path(moduleUri) {
        var f;
        if (isNode)
        {
            return {file: __filename, path: __dirname};
        }
        else if (isSharedWorker || isWebWorker)
        {
            return {file: (f=self.location.href), path: f.split('/').slice(0, -1).join('/')};
        }
        else if (isAMD && moduleUri)
        {
            return {file: (f=moduleUri), path: f.split('/').slice(0, -1).join('/')};
        }
        else if (isBrowser && (f = document.getElementsByTagName('script')) && f.length)
        {
            if (!path.link) path.link = document.createElement('a');
            path.link.href = f[f.length - 1].src;
            f = path.link.href; // make sure absolute uri
            return {file: f, path: f.split('/').slice(0, -1).join('/')};
        }
        return {path: null, file: null};
    }
    
    ,thisPath = path(ModuleFactory__FILTER.moduleUri), tpf = thisPath.file
    
    ,extend = function(o1, o2) {
        o1 = o1 || {};
        if (o2)
        {
            for (var k in o2) 
                if (HAS.call(o2, k)) o1[k] = o2[k];
        }
        return o1;
    }
    
    ,_uuid = 0
;

LOADED[tpf] = 1;

if (isNode)
{
    // adapted from https://github.com/adambom/parallel.js
    // https://nodejs.org/api/child_process.html#child_process_child_process_fork_modulepath_args_options
    Thread = function Thread(path) {
        var self = this;
        self.process = require('child_process').fork(path/*, [], {silent: true}*/);
        self.process.on('message', function(msg) {
            if (self.onmessage) self.onmessage(msg);
        });
        self.process.on('error', function(err) {
            if (self.onerror) self.onerror(err);
        });
    };
    Thread.Shared = Thread;
    Thread[PROTO] = {
        constructor: Thread,
        process: null,
        
        onmessage: null,
        onerror: null,

        postMessage: function(data) {
            if (this.process)
            {
                this.process.send(data);
            }
            return this;
        },

        terminate: function() {
            if (this.process)
            {
                this.process.kill();
                this.process = null;
            }
            return this;
        }
    };
}
else
{
    Thread = function(path) {
        var self = this;
        self.process = new Worker(path);
        self.process.onmessage = function(evt) {
            if (self.onmessage) self.onmessage(evt.data);
        };
        self.process.onerror = function(err) {
            if (self.onerror) self.onerror(err);
        };
    };
    Thread.Shared = Thread;
    Thread[PROTO] = {
        constructor: Thread,
        process: null,
        
        onmessage: null,
        onerror: null,

        postMessage: function(data) {
            if (this.process)
            {
                this.process.postMessage(data);
            }
            return this;
        },

        terminate: function() {
            if (this.process)
            {
                this.process.terminate();
                this.process = null;
            }
            return this;
        }
    };
    if ("function" === typeof SharedWorker)
    {
        Thread.Shared = function(path) {
            var self = this;
            self.process = new SharedWorker(path);
            self.process.port.start();
            self.process.port.onmessage = function(evt) {
                if (self.onmessage) self.onmessage(evt.data);
            };
            self.process.port.onerror = self.process.onerror = function(err) {
                if (self.onerror) self.onerror(err);
            };
        };
        Thread.Shared[PROTO] = {
            constructor: Thread.Shared,
            process: null,
            
            onmessage: null,
            onerror: null,

            postMessage: function(data) {
                if (this.process)
                {
                    this.process.port.postMessage(data);
                }
                return this;
            },

            terminate: function() {
                if (this.process)
                {
                    this.process.port.close();
                    this.process = null;
                }
                return this;
            }
        };
    }
}

if (isInstantiatedThread)
{
if (isSharedWorker)
{
    root.close = NOP;
    root.postMessage = NOP;
    root.onconnect = function(e) {
        var shared_port = e.ports[0];
        root.close = function() {shared_port.close();};
        root.postMessage = function(data) {shared_port.postMessage(data);};
        shared_port.addEventListener('message', Listener);
        shared_port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
    };
}
else if (isWebWorker)
{
    root.onmessage = Listener;
}
else if (isNodeProcess)
{
    root.close = function() {process.exit();};
    root.postMessage = function(data) {process.send(data);};
    root.importScripts = function(script)  {
        try { new Function("",  require('fs').readFileSync(script).toString()).call(scope); }
        catch (e) { throw e; }
    };
    process.on('message', Listener);
}
}

// Proxy to communication/asyc to another browser window
function formatOptions(o) 
{
    var s = [], k;
    if (o)
    {
        for (k in o)
            if (HAS.call(o, k))
                s.push(k + '=' + (true===o[k]||1===o[k]?'yes':(false===o[k]||0===o[k]?'no':o[k])));
    }
    return s.join(",");
}
var BrowserWindow = function BrowserWindow(options) {
    var self = this;
    if (!( self instanceof BrowserWindow)) return new BrowserWindow(options);
    self.$id = (++_uuid).toString(16);
    self.options = extend({
        width: 400,
        height: 400,
        toolbar: 0,
        location: 0,
        directories: 0,
        status: 0,
        menubar: 0,
        scrollbars: 1,
        resizable: 1
    }, options);
};
BrowserWindow[PROTO] = {
    constructor: BrowserWindow
    
    ,options: null
    ,$id: null
    ,$window: null
    
    ,dispose: function() {
        var self = this;
        if (self.$window) self.close();
        self.$window = null;
        self.$id = null;
        self.options = null;
        return self;
    }
    
    ,close: function() {
        var self = this;
        if (self.$window)
        {
            if (!self.$window.closed) self.$window.close();
            self.$window = null;
        }
        return self;
    }
    
    ,ready: function(variable, cb) {
        var self = this, 
            on_window_ready = function on_window_ready() {
                if (!self.$window || (!!variable && !self.$window[variable]))
                    setTimeout(on_window_ready, 60);
                else cb();
            };
        setTimeout(on_window_ready, 0);
        return self;
    }
    
    ,open: function(url_or_html) {
        var self = this;
        if (!self.$window && !!url_or_html)
        {
            self.$window = window.open( 
                url_or_html.push // dynamic content as blob array (with utf-8 BOM prepended)
                    ? blobURL(["\ufeff"].concat(url_or_html), {type: 'text/html;charset=utf-8'})
                    : url_or_html, 
                self.$id, 
                formatOptions(self.options)
            );
            /*if (autoDispose)
            {
                self.$window.onbeforeunload = function() {
                   setTimeout(function() {self.dispose();}, 1500);
                };
            }*/
        }
        return self;
    }
    
    ,write: function(html) {
        var self = this;
        if (self.$window && html)
            self.$window.document.write(html);
        return self;
    }
};

// Task class/combinator
var Task = function Task(aTask) {
    if (aTask instanceof Task) return aTask;
    if (!(this instanceof Task)) return new Task(aTask);
    
    var self = this, aqueue = null, task = null,
        onComplete = null, run_once = false,
        times = false, loop = false, recurse = false,
        until = false, untilNot = false, 
        loopObject = null, repeatCounter = 0,
        repeatIncrement = 1, repeatTimes = null,
        repeatUntil = null, repeatUntilNot = null,
        lastResult = undef, run
    ;
    
    self.queue = function(q) {
        if (arguments.length)
        {
            aqueue = q;
            return self;
        }
        return aqueue;
    };
    
    self.jumpNext = function(offset) { 
        if (aqueue) aqueue.jumpNext(false, offset); 
    };
    
    self.abort = function(dispose) {
        if (aqueue) 
        {
            aqueue.abort(false);
            if (dispose) 
            {
                aqueue.dispose();
                aqueue = null;
            }
        }
    };
    
    self.dispose = function() { 
        if (aqueue) 
        {
            aqueue.dispose(); 
            aqueue = null;
        }
    };
    
    self.task = function(t) {
        task = t;
        return self;
    };
    
    if (aTask) self.task(aTask);
    
    self.run = run = function() {
        // add queue/task methods on task func itself
        // instead of passing "this" as task param
        // use task as "nfe" or "arguments.callee" or whatelse,
        task.jumpNext = self.jumpNext;
        task.abort = self.abort;
        task.dispose = self.dispose;
        lastResult = task(/*self*/);
        run_once = true;
        task.jumpNext = null;
        task.abort = null;
        task.dispose = null;
        return lastResult;
    };
    
    self.runWithArgs = function(args) {
        task.jumpNext = self.jumpNext;
        task.abort = self.abort;
        task.dispose = self.dispose;
        lastResult = task.apply(null, args);
        run_once = true;
        task.jumpNext = null;
        task.abort = null;
        task.dispose = null;
        return lastResult;
    };
    
    self.canRun = function() {
        if (!task) return false;
        if (run_once && !times && !loop && !recurse && !until && !untilNot) return false;
        if ((times || loop) && repeatCounter >= repeatTimes) return false;
        if (loop && !loopObject) return false;
        if ((recurse || until) && lastResult === repeatUntil) return false;
        return true;
    };
    
    self.iif = function(cond, if_true_task, else_task) {
        if (is_function(cond)) cond = cond();
        if (cond) self.task(if_true_task);
        else if (arguments.length > 2) self.task(else_task);
        return self;
    };
    
    self.until = function(result) {
        lastResult = undef;
        loopObject = null;
        repeatUntil = result;
        until = true;
        untilNot = false;
        times = false;
        loop = false;
        recurse = false;
        self.run = run;
        return self;
    };
    
    self.untilNot = function(result) {
        lastResult = undef;
        loopObject = null;
        repeatUntilNot = result;
        untilNot = true;
        until = false;
        times = false;
        loop = false;
        recurse = false;
        self.run = run;
        return self;
    };
    
    self.loop = function(numTimes, startCounter, increment) {
        lastResult = undef;
        loopObject = null;
        repeatCounter = startCounter || 0;
        repeatIncrement = increment || 1;
        repeatTimes = numTimes;
        times = true;
        until = false;
        untilNot = false;
        loop = false;
        recurse = false;
        self.run = function() {
            var result;
            result = task(repeatCounter);
            repeatCounter += repeatIncrement;
            lastResult = result;
            run_once = true;
            return result;
        };
        return self;
    };
    
    self.each = function(loopObj) {
        lastResult = undef;
        loopObject = loopObj;
        repeatCounter = 0;
        repeatIncrement = 1;
        repeatTimes = loopObj ? (loopObj.length || 0) : 0;
        loop = true;
        until = false;
        untilNot = false;
        times = false;
        recurse = false;
        self.run = function() {
            var result;
            result = task(loopObject[repeatCounter], repeatCounter);
            ++repeatCounter;
            lastResult = result;
            run_once = true;
            return result;
        };
        return self;
    };
    
    self.recurse = function(initialVal, finalVal) {
        loopObject = null;
        lastResult = initialVal;
        repeatUntil = finalVal;
        recurse = true;
        until = false;
        untilNot = false;
        times = false;
        loop = false;
        self.run = function() {
            var result;
            result = task(lastResult);
            lastResult = result;
            run_once = true;
            return result;
        };
        return self;
    };
    
    self.isFinished = function() {
        var notfinished = !run_once || untilNot || until || times || loop || recurse;
        if (notfinished && (until||recurse) && lastResult === repeatUntil) notfinished = false;
        if (notfinished && untilNot && lastResult !== repeatUntilNot) notfinished = false;
        if (notfinished && (times||loop) && repeatCounter >= repeatTimes) notfinished = false;
        return !notfinished;
    };
    
    self.onComplete = function(callback) {
        onComplete = callback || null;
        return self;
    };
    
    self.complete = function() {
        if (onComplete && is_function(onComplete)) onComplete();
        return self;
    };
};

// run tasks in parallel threads (eg. web workers, child processes)
function runParallelised(scope, args) 
{ 
    scope.$runmode = PARALLELISED;
    scope.$running = false;
}

// serialize async-tasks that are non-blocking/asynchronous in a quasi-sequential manner
function runLinearised(scope, args) 
{ 
    var self = scope, queue = self.$queue, task;
    self.$runmode = LINEARISED;
    if (queue)
    {
        while (queue.length && (!queue[0] || !queue[0].canRun())) queue.shift();
        // first task should call next tasks upon completion, via "in-place callback templates"
        if (queue.length) 
        {
            self.$running = true;
            task = queue.shift();
            if (args) task.runWithArgs(args); else task.run();
            task.complete();
        }
        else
        {
            self.$running = false;
        }
    }
}

// interleave async-tasks in background in quasi-parallel manner
function runInterleaved(scope, args) 
{ 
    var self = scope, queue = self.$queue, task, index = 0;
    self.$runmode = INTERLEAVED;
    if (queue && queue.length)
    {
        self.$running = true;
        while (index < queue.length)
        {
            task = queue[index];
            
            if (task && task.canRun())
            {
                if (args) task.runWithArgs(args); else task.run();
                if (task.isFinished())
                {
                    queue.shift();
                    task.complete();
                }
                else
                {
                    ++index;
                }
            }
            else
            {
                queue.shift();
            }
        }
        self.$running = false;
        self.$timer = SetTime(curry(runInterleaved, self), self.$interval);
    }
}

// run tasks in a quasi-asynchronous manner (avoid blocking the thread)
function runSequenced(scope, args) 
{
    var self = scope, queue = self.$queue, task;
    self.$runmode = SEQUENCED;
    if (queue && queue.length)
    {
        task = queue[0];
        
        if (task && task.canRun())
        {
            self.$running = true;
            if (args) task.runWithArgs(args); else task.run();
            if (task.isFinished())
            {
                queue.shift();
                task.complete();
            }
        }
        else
        {
            queue.shift();
        }
        self.$running = false;
        self.$timer = SetTime(curry(runSequenced, self), self.$interval);
    }
}

// manage tasks which may run in steps and tasks which are asynchronous
function Asynchronous(interval, initThread)
{
    // can be used as factory-constructor for both Async and Task classes
    if (is_instance(interval, Task)) return interval;
    if (is_function(interval)) return new Task(interval);
    if (!is_instance(this, Asynchronous)) return new Asynchronous(interval, initThread);
    var self = this;
    self.$interval = arguments.length ? parseInt(interval, 10)||DEFAULT_INTERVAL : DEFAULT_INTERVAL;
    self.$timer = null;
    self.$runmode = NONE;
    self.$running = false;
    self.$queue = [ ];
    if (isInstantiatedThread && (false !== initThread)) self.initThread();
};
Asynchronous.VERSION = "0.5.2";
Asynchronous.Thread = Thread;
Asynchronous.Task = Task;
Asynchronous.BrowserWindow = BrowserWindow;
Asynchronous.MODE = {NONE: NONE, INTERLEAVE: INTERLEAVED, LINEAR: LINEARISED, PARALLEL: PARALLELISED, SEQUENCE: SEQUENCED};
Asynchronous.Platform = {UNDEFINED: UNDEFINED, UNKNOWN: UNKNOWN, NODE: NODE, BROWSER: BROWSER};
Asynchronous.supportsMultiThreading = function() {return supportsMultiThread;};
Asynchronous.isPlatform = function(platform) { 
    if (NODE === platform) return isNode;
    else if (BROWSER === platform) return isBrowser;
};
Asynchronous.isThread = function(platform, instantiated) { 
    instantiated = true === instantiated ? isInstantiatedThread : true;
    if (NODE === platform) return instantiated && isNodeProcess;
    else if (BROWSER === platform) return instantiated && (isSharedWorker || isWebWorker);
    return instantiated && isThread; 
};
Asynchronous.path = path;
Asynchronous.blob = blobURL;
Asynchronous.load = function(component, imports, asInstance) {
    if (component)
    {
        var initComponent = function() {
            // init the given component if needed
            component = component.split('.'); 
            var o = scope;
            while (component.length)
            {
                if (component[0] && component[0].length && o[component[0]]) 
                    o = o[component[0]];
                component.shift();
            }
            if (o && (root !== o))
            {
                if (is_function(o)) return (false !== asInstance) ? new o() : o();
                return o;
            }
        };
        
        // do any imports if needed
        if (imports && imports.length)
        {
            /*if ( isBrowserWindow ) 
            {
                Asynchronous.importScripts( imports.join( ',' ), initComponent );
            }
            else
            {*/
                Asynchronous.importScripts(imports.join ? imports.join( ',' ) : imports);
            /*}*/
        }
       return initComponent();
    }
    return null;
};
Asynchronous.listen = isInstantiatedThread ? function(handler) {Listener.handler = handler;} : NOP;
Asynchronous.send = isInstantiatedThread ? function(data) {root.postMessage(data);} : NOP;
Asynchronous.importScripts = isInstantiatedThread
? function(scripts) {
    if (scripts && scripts.length)
    {
        if (scripts.split) scripts = scripts.split(',');
        for (var i=0,l=scripts.length; i<l; ++i)
        {
            var src = scripts[i];
            if (src && src.length && (1 !== LOADED[src]))
            {
                root.importScripts(src);
                LOADED[src] = 1;
            }
        }
    }
}
: NOP;
Asynchronous.close = isInstantiatedThread ? function() {root.close();} : NOP;
Asynchronous.log = "undefined" !== typeof console ? function(s) {console.log(s||'');} : NOP;

// async queue as serializer
Asynchronous.serialize = function(queue) {
    queue = queue || new Asynchronous(0, false);
    var serialize = function(func) {
        var serialized = function() {
            var scope = this, args = arguments;
            queue.step(function() {func.apply(scope, args);});
            if (!queue.$running) queue.run(LINEARISED);
        };
        // free the serialized func
        serialized.free = function() {return func;};
        return serialized;
    };
    // free the queue
    serialize.free = function() {if (queue) queue.dispose(); queue = null;};
    return serialize;
};
Asynchronous[PROTO] = {

    constructor: Asynchronous
    
    ,$interval: DEFAULT_INTERVAL
    ,$timer: null
    ,$queue: null
    ,$thread: null
    ,$events: null
    ,$runmode: NONE
    ,$running: false
    
    ,dispose: function(thread) {
        var self = this;
        self.unfork(true);
        if (self.$timer) ClearTime(self.$timer);
        self.$thread = null;
        self.$timer = null;
        self.$interval = null;
        self.$queue = null;
        self.$runmode = NONE;
        self.$running = false;
        if (isInstantiatedThread && (true === thread)) Asynchronous.close();
        return self;
    }
    
    ,empty: function() {
        var self = this;
        if (self.$timer) ClearTime(self.$timer);
        self.$timer = null;
        self.$queue = [];
        self.$runmode = NONE;
        self.$running = false;
        return self;
    }
    
    ,interval: function(interval) {
        if (arguments.length) 
        {
            this.$interval = parseInt(interval, 10)||this.$interval;
            return this;
        }
        return this.$interval;
    }
    
    // fork a new process/thread (e.g WebWorker, NodeProcess etc..)
    ,fork: function(component, imports, asInstance, shared) {
        var self = this, thread, msgLog, msgErr;
        
        if (!self.$thread)
        {
            if (!supportsMultiThread)
            {
                self.$thread = null;
                throw new Error('Asynchronous: Multi-Threading is NOT supported!');
                return self;
            }
            
            if (isNode)
            {
                msgLog = 'Asynchronous: Thread (Process): ';
                msgErr = 'Asynchronous: Thread (Process) Error: ';
            }
            else
            {
                msgLog = 'Asynchronous: Thread (Worker): ';
                msgErr = 'Asynchronous: Thread (Worker) Error: ';
            }
            
            self.$events = self.$events || {};
            thread = self.$thread = true === shared ? new Thread.Shared(tpf) : new Thread(tpf);
            thread.onmessage = function(msg) {
                if (msg.event)
                {
                    var event = msg.event, data = msg.data || null;
                    if (self.$events && self.$events[event]) 
                    {
                        self.$events[event](data);
                    }
                    else if ("console.log" === event || "console.error" === event)
                    {
                        Asynchronous.log(("console.error" === event ? msgErr : msgLog) + (data||''));
                    }
                }
            };
            thread.onerror = function(err) {
                if (self.$events && self.$events.error)
                {
                    self.$events.error(err);
                }
                else
                {
                    throw new Error(msgErr + err.toString()/*err.message + ' file: ' + err.filename + ' line: ' + err.lineno*/);
                }
            };
            self.send('initThread', {component: component||null, asInstance: false !== asInstance, imports: imports ? [].concat(imports).join(',') : null});
        }
        return self;
    }
    
    ,unfork: function(explicit) {
        var self = this;
        if (self.$thread)
        {
            if (true === explicit) self.$thread.terminate();
            else self.send('dispose');
        }
        self.$thread = null;
        self.$events = null;
        return self;
    }
    
    ,initThread: function() {
        var self = this;
        if (isInstantiatedThread)
        {
            self.$events = {};
            Asynchronous.listen(function(msg) {
                var event = msg.event, data = msg.data || null;
                if (event && self.$events[event])
                {
                    self.$events[event](data);
                }
                else if ('dispose' === event)
                {
                    self.dispose();
                    Asynchronous.close();
                }
            });
        }
        return self;
    }
    
    ,listen: function(event, handler) {
        if (event && is_function(handler) && this.$events)
        {
            this.$events[event] = handler;
        }
        return this;
    }
    
    ,unlisten: function(event, handler) {
        if (event && this.$events && this.$events[event])
        {
            if (2 > arguments.length || handler === this.$events[event])
                delete this.$events[event];
        }
        return this;
    }
    
    ,send: function(event, data) {
        if (event)
        {
            if (isInstantiatedThread)
                Asynchronous.send({event: event, data: data || null});
            else if (this.$thread)
                this.$thread.postMessage({event: event, data: data || null});
        }
        return this;
    }
    
    ,task: function(task) {
        if (is_instance(task, Task)) return task;
        else if (is_function(task)) return Task(task);
    }
    
    ,iif: function() { 
        var args = arguments, T = new Task(); 
        return T.iif.apply(T, args); 
    }
    
    ,until: function() { 
        var args = slice(arguments), T = new Task(args.pop()); 
        return T.until.apply(T, args); 
    }
    
    ,untilNot: function() { 
        var args = slice(arguments), T = new Task(args.pop()); 
        return T.untilNot.apply(T, args); 
    }
    
    ,loop: function() { 
        var args = slice(arguments), T = new Task(args.pop()); 
        return T.loop.apply(T, args); 
    }
    
    ,each: function() { 
        var args = slice(arguments), T = new Task(args.pop()); 
        return T.each.apply(T, args); 
    }
    
    ,recurse: function() { 
        var args = slice(arguments), T = new Task(args.pop()); 
        return T.recurse.apply(T, args); 
    }
    
    ,step: function(task) {
        var self = this;
        if (task) self.$queue.push(self.task(task).queue(self));
        return self;
    }
    
    ,steps: function() {
        var self = this, tasks = arguments, i, l;
        l = tasks.length;
        for (i=0; i<l; ++i) self.step(tasks[i]);
        return self;
    }
    
    // callback template for use as "inverted-control in-place callbacks"
    ,jumpNext: function(returnCallback, offset) {
        var self = this, queue = self.$queue;
        offset = offset || 0;
        if (false !== returnCallback)
        {
            return function() {
                if (offset < queue.length)
                {
                    if (offset > 0) queue.splice(0, offset);
                    self.run(self.$runmode);
                }
                return self;
            };
        }
        else
        {
            if (offset < queue.length)
            {
                if (offset > 0) queue.splice(0, offset);
                self.run(self.$runmode);
            }
            return self;
        }
    }
    
    // callback template for use as "inverted-control in-place callbacks"
    ,jumpNextWithArgs: function(returnCallback, offset, args) {
        var self = this, queue = self.$queue;
        offset = offset || 0;
        if (false !== returnCallback)
        {
            return function() {
                if (offset < queue.length)
                {
                    if (offset > 0) queue.splice(0, offset);
                    self.run(self.$runmode, arguments);
                }
                return self;
            };
        }
        else
        {
            if (offset < queue.length)
            {
                if (offset > 0) queue.splice(0, offset);
                self.run(self.$runmode, args);
            }
            return self;
        }
    }
    
    ,abort: function(returnCallback, delayed) {
        var self = this;
        if (false !== returnCallback)
        {
            return function() {
                if (delayed && delayed > 0)
                {
                    SetTime(function() {
                        self.empty();
                    }, delayed);
                }
                else
                {
                    self.empty();
                }
                return self;
            };
        }
        else
        {
            if (delayed && delayed > 0)
            {
                SetTime(function() {
                    self.empty();
                }, delayed);
            }
            else
            {
                self.empty();
            }
            return self;
        }
    }
    
    ,run: function(run_mode, args) {
        var self = this;
        if (arguments.length) self.$runmode = run_mode;
        else run_mode = self.$runmode;
        args = args || null;
        if (SEQUENCED === run_mode) runSequenced(self, args);
        else if (INTERLEAVED === run_mode) runInterleaved(self, args);
        else if (LINEARISED === run_mode) runLinearised(self, args);
        else if (PARALLELISED === run_mode) runParallelised(self, args);
        return self;
    }
};

if (isInstantiatedThread)
{
    /*globalScope.console = {
        log: function( s ){
            Asynchronous.send({event: 'console.log', data: s||''});
        },
        error: function( s ){
            Asynchronous.send({event: 'console.error', data: s||''});
        }
    };*/
    //Asynchronous.log = function( o ){ globalScope.console.log( "string" !== typeof o ? toJSON( o ) : o); };
    Asynchronous.log = function(o) {
        Asynchronous.send({event: 'console.log', data: "string" !== typeof o ? toJSON(o) : o});
    };
    
    Asynchronous.listen(function(msg) {
        var event = msg.event, data = msg.data || null;
        switch (event)
        {
            case 'initThread':
                if (data && data.component)
                {
                    if (component)
                    {
                        // optionally call Component.dispose method if exists
                        if (is_function(component.dispose)) component.dispose();
                        component = null;
                    }
                    component = Asynchronous.load(data.component, data.imports, data.asInstance);
                }
                break;
            case 'dispose':
            //default:
                if (component)
                {
                    // optionally call Component.dispsoe method if exists
                    if (is_function(component.dispose)) component.dispose();
                    component = null;
                }
                Asynchronous.close();
                break;
        }
    });        
}

// export it
FILTER.Asynchronous = Asynchronous;

}(this, FILTER);!function(FILTER, undef) {
"use strict";
var PROTO = 'prototype',
    HAS = Object[PROTO].hasOwnProperty,
    toString = Object[PROTO].toString,
    def = Object.defineProperty,
    stdMath = Math, NOOP = function() {},
    _uuid = 0
;

// basic backwards-compatible "class" construction
function makeSuper(superklass)
{
    var called = {};
    return function $super(method, args) {
        var self = this, m = ':'+method, ret;
        if (1 === called[m]) return (superklass[PROTO].$super || NOOP).call(self, method, args);
        called[m] = 1;
        ret = ('constructor' === method ? superklass : (superklass[PROTO][method] || NOOP)).apply(self, args || []);
        called[m] = 0;
        return ret;
    };
}
function makeClass(superklass, klass, statik)
{
    if (arguments.length < 2)
    {
        klass = superklass;
        superklass = null;
    }
    if (HAS.call(klass, '__static__'))
    {
        statik = klass.__static__;
        delete klass.__static__;
    }
    var C = HAS.call(klass, 'constructor') ? klass.constructor : function() {}, p;
    if (superklass)
    {
        C[PROTO] = Object.create(superklass[PROTO]);
        C[PROTO].$super = makeSuper(superklass);
    }
    else
    {
        C[PROTO].$super = NOOP;
    }
    C[PROTO].constructor = C;
    for (p in klass)
    {
        if (HAS.call(klass, p) && ('constructor' !== p))
        {
            C[PROTO][p] = klass[p];
        }
    }
    if (statik)
    {
        for (p in statik)
        {
            if (HAS.call(statik, p))
            {
                C[p] = statik[p];
            }
        }
    }
    return C;
}
function merge(/*args*/)
{
    var n = arguments.length,
        a = n ? arguments[0] : null,
        i, j, b;
    for (i=1; i<n; ++i)
    {
        b = arguments[i];
        for (j in b)
        {
            if (HAS.call(b, j))
            {
                a[j] = b[j];
            }
        }
    }
    return a;
}
makeClass.Merge = merge;

FILTER.Class = makeClass;
FILTER.Path = FILTER.Asynchronous.path(ModuleFactory__FILTER.moduleUri);
FILTER.uuid = function(namespace) {
    return [namespace||'filter', new Date().getTime(), ++_uuid].join('_');
};
FILTER.NotImplemented = function(method) {
    return method ? function() {
        throw new Error('Method "'+method+'" not Implemented!');
    } : function() {
        throw new Error('Method not Implemented!');
    };
};
var Async = FILTER.Asynchronous
    ,isNode = Async.isPlatform(Async.Platform.NODE)
    ,isBrowser = Async.isPlatform(Async.Platform.BROWSER)
    ,supportsThread = Async.supportsMultiThreading()
    ,isThread = Async.isThread(null, true)
    ,isInsideThread = Async.isThread()
    ,userAgent = "undefined" !== typeof navigator && navigator.userAgent ? navigator.userAgent : ""
    ,platform = "undefined" !== typeof navigator && navigator.platform ? navigator.platform : ""
    ,vendor = "undefined" !== typeof navigator && navigator.vendor ? navigator.vendor : ""
;

FILTER.global = isNode ? global : (isInsideThread ? self : window);

// Browser Sniffing support
var Browser = FILTER.Browser = {
// http://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
isNode                  : isNode,
isBrowser               : isBrowser,
isWorker                : isThread,
isInsideWorker          : isInsideThread,
supportsWorker          : supportsThread,
isPhantom               : /PhantomJS/.test(userAgent),

// http://www.quirksmode.org/js/detect.html
// http://my.opera.com/community/openweb/idopera/
// http://stackoverflow.com/questions/1998293/how-to-determine-the-opera-browser-using-javascript
isOpera                 : isBrowser && /Opera|OPR\//.test(userAgent),
isFirefox               : isBrowser && /Firefox\//.test(userAgent),
isChrome                : isBrowser && /Chrome\//.test(userAgent),
isSafari                : isBrowser && /Apple Computer/.test(vendor),
isKhtml                 : isBrowser && /KHTML\//.test(userAgent),
// IE 11 replaced the MSIE with Mozilla like gecko string, check for Trident engine also
isIE                    : isBrowser && (/MSIE \d/.test(userAgent) || /Trident\/\d/.test(userAgent)),
isEdge                  : isBrowser && /Edg/.test(userAgent),
// adapted from Codemirror (https://github.com/marijnh/CodeMirror) browser sniffing
isGecko                 : isBrowser && /gecko\/\d/i.test(userAgent),
isWebkit                : isBrowser && /WebKit\//.test(userAgent),
isMac_geLion            : isBrowser && /Mac OS X 1\d\D([7-9]|\d\d)\D/.test(userAgent),
isMac_geMountainLion    : isBrowser && /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent),

isMobile                : false,
isIOS                   : /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent),
isWin                   : /windows/i.test(platform),
isMac                   : false,
isIE_lt8                : false,
isIE_lt9                : false,
isQtWebkit              : false
};
Browser.isMobile = Browser.isIOS || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
Browser.isMac = Browser.isIOS || /Mac/.test(platform);
Browser.isIE_lt8 = Browser.isIE  && !isInsideThread && (null == document.documentMode || document.documentMode < 8);
Browser.isIE_lt9 = Browser.isIE && !isInsideThread && (null == document.documentMode || document.documentMode < 9);
Browser.isQtWebkit = Browser.isWebkit && /Qt\/\d+\.\d+/.test(userAgent);

FILTER.getPath = Async.path;

// logging
FILTER.log = isThread ? Async.log : (("undefined" !== typeof console) && console.log ? function(s) {console.log(s);} : function(s) {/* do nothing*/});
FILTER.warning = function(s) {FILTER.log('WARNING: ' + s);};
FILTER.error = function(s, throwErr) {FILTER.log('ERROR: ' + s); if (throwErr) throw new Error(String(s));};

// devicePixelRatio
FILTER.devicePixelRatio = (isBrowser && !isInsideThread ? window.devicePixelRatio : 1) || 1;

// Typed Arrays Substitute(s)
FILTER._notSupportClamp = ("undefined" === typeof Uint8ClampedArray) || Browser.isOpera;
FILTER.Array = Array;
FILTER.Array32F = typeof Float32Array !== "undefined" ? Float32Array : Array;
FILTER.Array64F = typeof Float64Array !== "undefined" ? Float64Array : Array;
FILTER.Array8I = typeof Int8Array !== "undefined" ? Int8Array : Array;
FILTER.Array16I = typeof Int16Array !== "undefined" ? Int16Array : Array;
FILTER.Array32I = typeof Int32Array !== "undefined" ? Int32Array : Array;
FILTER.Array8U = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
FILTER.Array16U = typeof Uint16Array !== "undefined" ? Uint16Array : Array;
FILTER.Array32U = typeof Uint32Array !== "undefined" ? Uint32Array : Array;
FILTER.ArrayBuffer = typeof ArrayBuffer !== "undefined" ? ArrayBuffer : (typeof Buffer !== "undefined" ? Buffer : Array);
FILTER.ColorTable = FILTER.ImArray = FILTER._notSupportClamp ? FILTER.Array8U : Uint8ClampedArray;
FILTER.AffineMatrix = FILTER.ColorMatrix = FILTER.ConvolutionMatrix = FILTER.Array32F;

// Constants
FILTER.MODE = {
    IGNORE: 0, WRAP: 1, CLAMP: 2,
    COLOR: 3, COLOR32: 3, TILE: 4, STRETCH: 5,
    INTENSITY: 6, HUE: 7, SATURATION: 8,
    GRAY: 9, GRAYSCALE: 9, RGB: 10, RGBA: 11,
    HSV: 12, HSL: 19, HWB: 27, CMY: 13, CMYK: 13,
    XYZ: 28, ILL: 29, PATTERN: 14,
    COLOR8: 15, COLORMASK: 16, COLORMASK32: 16, COLORMASK8: 17,
    MATRIX: 18, NONLINEAR: 20, STATISTICAL: 21, ADAPTIVE: 22,
    THRESHOLD: 23, HISTOGRAM: 24, MONO: 25, MASK: 26,
    COLORIZE: 30, COLORIZEHUE: 31, CHANNEL: 32
};
FILTER.CHANNEL = {
    R: 0, G: 1, B: 2, A: 3,
    RED: 0, GREEN: 1, BLUE: 2, ALPHA: 3,
    Y: 1, CB: 2, CR: 0, IP: 0, Q: 2,
    INPHASE: 0, QUADRATURE: 2,
    H: 0, S: 2, V: 1, L: 1, I: 1, U: 2, WH: 1, BL: 2,
    HUE: 0, SATURATION: 2, INTENSITY: 1,
    CY: 2, MA: 0, YE: 1, K: 3,
    CYAN: 2, MAGENTA: 0, YELLOW: 1, BLACK: 3,
    XX: 0, YY: 1, ZZ: 2,
    ILL1: 0, ILL2: 1, ILL3: 2
};
FILTER.POS = {
    X: 0, Y: 1
};
FILTER.STRIDE = {
    CHANNEL: [0,0,1], X: [0,1,4], Y: [1,0,4],
    RGB: [0,1,2], ARGB: [3,0,1,2], RGBA: [0,1,2,3],
    BGR: [2,1,0], ABGR: [3,2,1,0], BGRA: [2,1,0,3]
};
FILTER.LUMA = FILTER.LUMA_YUV = FILTER.LUMA_YIQ = new FILTER.Array32F([
    //0.212671, 0.71516, 0.072169
    0.2126, 0.7152, 0.0722
]);
FILTER.LUMA_YCbCr = new FILTER.Array32F([
    //0.30, 0.59, 0.11
    0.299, 0.587, 0.114
]);
FILTER.LUMA_GREEN = new FILTER.Array32F([
    0, 1, 0
]);
FILTER.CONSTANTS = FILTER.CONST = {
     X: 0, Y: 1, Z: 2
    ,PI: stdMath.PI, PI2: 2*stdMath.PI, PI_2: stdMath.PI/2
    ,toRad: stdMath.PI/180, toDeg: 180/stdMath.PI
};
FILTER.FORMAT = {
    IMAGE: 1024, DATA: 2048
};

// packages
FILTER.Util = {
    String  : {},
    Array   : {
        // IE still does not support Uint8ClampedArray and some methods on it, add the method "set"
         hasClampedArray: "undefined" !== typeof Uint8ClampedArray
        ,hasArrayset: ("undefined" !== typeof Int16Array) && ("function" === typeof Int16Array[PROTO].set)
        ,hasSubarray: "function" === typeof FILTER.Array32F[PROTO].subarray
    },
    Math    : {},
    Filter  : {},
    Image   : {},
    GLSL    : {isSupported:false, isLoaded:false},
    WASM    : {isSupported:false, isLoaded:false}
};

// Canvas for Browser, override if needed to provide alternative for Nodejs
FILTER.Canvas = function(w, h) {
    var canvas = document.createElement('canvas'),
        dpr = 1;// / (FILTER.devicePixelRatio || 1);
    w = w || 0;
    h = h || 0;
    // set the size of the drawingBuffer
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    /*if (canvas.style)
    {
        // set the display size of the canvas if displayed
        canvas.style.width = String(canvas.width) + 'px';
        canvas.style.height = String(canvas.height) + 'px';
        canvas.style.transformOrigin = 'top left';
        canvas.style.transform = 'scale('+(1/dpr)+','+(1/dpr)+')';
    }*/
    return canvas;
};
// Image for Browser, override if needed to provide alternative for Nodejs
FILTER.Canvas.Image = function() {
    return new Image();
};
// ImageData for Browser, override if needed to provide alternative for Nodejs
FILTER.Canvas.ImageData = function(data, width, height) {
    return 'undefined' !== typeof ImageData ? (new ImageData(data, width, height)) : {data:data, width:width, height:height};
};

var supportsGLSL = null, glctx = null;
FILTER.supportsGLSL = function() {
    if (null == supportsGLSL)
    {
        var canvas = null,
            gl = null,
            ctxs = ['webgl', 'experimental-webgl'],
            ctx = null, i;
        try {
            canvas = FILTER.Canvas(1, 1);
        } catch(e) {
            canvas = null;
        }
        if (canvas)
        {
            for (i=0; i<ctxs.length; ++i)
            {
                ctx = ctxs[i];
                gl = null;
                try {
                    gl = canvas.getContext(ctx);
                } catch(e) {
                    gl = null;
                }
                if (gl) break;
            }
        }
        supportsGLSL = !!gl;
        if (supportsGLSL) glctx = ctx;
        gl = null;
        canvas = null;
    }
    return supportsGLSL;
};
FILTER.setGLDimensions = function(img, w, h) {
    if (img && img.gl)
    {
        if (img.gl.width !== w) img.gl.width = w;
        if (img.gl.height !== h) img.gl.height = h;
    }
    return img;
};
function contextLostHandler(evt)
{
    evt.preventDefault && evt.preventDefault();
}
FILTER.getGL = function(img, w, h) {
    if (img && FILTER.supportsGLSL())
    {
        if (!img.gl)
        {
            img.gl = FILTER.Canvas(w, h);
            if (isBrowser && img.gl && img.gl.addEventListener)
            {
                img.gl.addEventListener('webglcontextlost', contextLostHandler, false);
            }
        }
        FILTER.setGLDimensions(img, w, h);
        return img.gl.getContext(glctx);
    }
};
FILTER.disposeGL = function(img) {
    if (img && img.gl)
    {
        if (isBrowser && img.gl.removeEventListener)
        {
            img.gl.removeEventListener('webglcontextlost', contextLostHandler, false);
        }
    }
};
var supportsWASM = null;
FILTER.supportsWASM = function() {
    if (null == supportsWASM)
    {
        supportsWASM = false;
        var module = null;
        try {
            if ("object" === typeof WebAssembly && "function" === typeof WebAssembly.instantiate && "undefined" !== typeof Uint8Array)
            {
                module = new WebAssembly.Module(Uint8Array.of(0x0,0x61,0x73,0x6d,0x01,0x00,0x00,0x00));
                supportsWASM = (module instanceof WebAssembly.Module) && ((new WebAssembly.Instance(module)) instanceof WebAssembly.Instance);
            }
        } catch (e) {
            supportsWASM = false;
        }
        module = null;
    }
    return supportsWASM;
};
var waitList = 0;
FILTER.waitFor = function(ntasks) {
    waitList += (ntasks||0);
};
FILTER.unwaitFor = function(ntasks) {
    waitList -= (ntasks||0);
};
FILTER.onReady = function(cb) {
    var checkDone = function checkDone() {
        if (0 < waitList) setTimeout(checkDone, 100);
        else cb();
    };
    checkDone();
};
}(FILTER);
/**
*
* Filter Core Utils
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MODE = FILTER.MODE, notSupportClamp = FILTER._notSupportClamp,
    IMG = FILTER.ImArray, copy,
    A32F = FILTER.Array32F, A64F = FILTER.Array64F,
    A32I = FILTER.Array32I, A16I = FILTER.Array16I, A8U = FILTER.Array8U,
    ColorTable = FILTER.ColorTable, ColorMatrix = FILTER.ColorMatrix,
    AffineMatrix = FILTER.AffineMatrix, ConvolutionMatrix = FILTER.ConvolutionMatrix,
    ArrayUtil = FILTER.Util.Array = FILTER.Util.Array || {},
    StringUtil = FILTER.Util.String = FILTER.Util.String || {},
    MathUtil = FILTER.Util.Math = FILTER.Util.Math || {},
    ImageUtil = FILTER.Util.Image = FILTER.Util.Image || {},
    FilterUtil = FILTER.Util.Filter = FILTER.Util.Filter || {},
    stdMath = Math, Exp = stdMath.exp, Sqrt = stdMath.sqrt,
    Pow = stdMath.pow, Ceil = stdMath.ceil, Floor = stdMath.floor,
    Log = stdMath.log, Sin = stdMath.sin, Cos = stdMath.cos,
    Min = stdMath.min, Max = stdMath.max, Abs = stdMath.abs,
    PI = stdMath.PI, PI2 = PI+PI, PI_2 = PI/2,
    pi = PI, pi2 = PI2, pi_2 = PI_2, pi_32 = 3*pi_2,
    SQRT1_2 = stdMath.SQRT1_2,
    Log2 = stdMath.log2 || function(x) {return Log(x) / stdMath.LN2;},
    esc_re = /([.*+?^${}()|\[\]\/\\\-])/g, trim_re = /^\s+|\s+$/g,
    func_body_re = /^function[^{]+{([\s\S]*)}$/;

function esc(s)
{
    return s.replace(esc_re, '\\$1');
}
function function_body(func)
{
    return /*Function.prototype.toString.call(*/func.toString().match(func_body_re)[1] || '';
}

function clamp(x, m, M)
{
    return x > M ? M : (x < m ? m : x);
}
function hypot(a, b, c)
{
    c = c || 0;
    b = b || 0;
    var m = Max(Abs(a), Abs(b), Abs(c));
    if (0 === m) return 0;
    a /= m;
    b /= m;
    c /= m;
    return m*Sqrt(a*a + b*b + c*c);
}

function arrayset_shim(a, b, offset, b0, b1)
{
    //"use asm";
    offset = offset || 0; b0 = b0 || 0;
    var j, i, n = b1 ? b1-b0+1 : b.length, rem = n&31;
    for (i=0; i<rem; ++i)
    {
        a[i + offset] = b[b0 + i];
    }
    for (j=rem; j<n; j+=32)
    {
        i = j;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
        a[i + offset] = b[b0 + i]; ++i;
    }
}

function crop(im, w, h, x1, y1, x2, y2)
{
    x2 = Min(x2, w-1); y2 = Min(y2, h-1);
    var nw = x2-x1+1, nh = y2-y1+1,
        croppedSize = (nw*nh)<<2, cropped = new IMG(croppedSize),
        y, yw, nw4 = nw<<2, pixel, pixel2;

    for (y=y1,yw=y1*w,pixel=0; y<=y2; ++y,yw+=w,pixel+=nw4)
    {
        pixel2 = (yw+x1) << 2;
        cropped.set(im.subarray(pixel2, pixel2+nw4), pixel);
    }
    return cropped;
}
function crop_shim(im, w, h, x1, y1, x2, y2)
{
    x2 = Min(x2, w-1); y2 = Min(y2, h-1);
    var nw = x2-x1+1, nh = y2-y1+1,
        croppedSize = (nw*nh)<<2, cropped = new IMG(croppedSize),
        y, yw, nw4 = nw<<2, pixel, pixel2;

    for (y=y1,yw=y1*w,pixel=0; y<=y2; ++y,yw+=w,pixel+=nw4)
    {
        pixel2 = (yw+x1)<<2;
        arrayset_shim(cropped, im, pixel, pixel2, pixel2+nw4);
    }
    return cropped;
}
function pad(im, w, h, pad_right, pad_bot, pad_left, pad_top)
{
    pad_right = pad_right || 0; pad_bot = pad_bot || 0;
    pad_left = pad_left || 0; pad_top = pad_top || 0;
    var nw = w+pad_left+pad_right, nh = h+pad_top+pad_bot,
        paddedSize = ((nw*nh)<<2), padded = new IMG(paddedSize),
        y, w4 = (w<<2), nw4 = (nw<<2), pixel, pixel2,
        offtop = pad_top*nw4, offleft = (pad_left<<2);

    for (y=0,pixel2=0,pixel=offtop; y<h; ++y,pixel2+=w4,pixel+=nw4)
    {
        padded.set(im.subarray(pixel2, pixel2+w4), pixel+offleft);
    }
    return padded;
}
function pad_shim(im, w, h, pad_right, pad_bot, pad_left, pad_top)
{
    pad_right = pad_right || 0; pad_bot = pad_bot || 0;
    pad_left = pad_left || 0; pad_top = pad_top || 0;
    var nw = w+pad_left+pad_right, nh = h+pad_top+pad_bot,
        paddedSize = (nw*nh)<<2, padded = new IMG(paddedSize),
        y, w4 = w<<2, nw4 = nw<<2, pixel, pixel2,
        offtop = pad_top*nw4, offleft = pad_left<<2;

    for (y=0,pixel2=0,pixel=offtop; y<h; ++y,pixel2+=w4,pixel+=nw4)
    {
        arrayset_shim(padded, im, pixel+offleft, pixel2, pixel2+w4);
    }
    return padded;
}
function interpolate_nearest(im, w, h, nw, nh)
{
    var size = (nw*nh) << 2,
        interpolated = new IMG(size),
        x, y, xn, yn, nearest, pixel,
        round = stdMath.round
    ;
    for (x=0,y=0,pixel=0; pixel<size; pixel+=4,++x)
    {
        if (x >= nw) {x=0; ++y;}

        xn = clamp(round(x/nw*w), 0, w-1);
        yn = clamp(round(y/nh*h), 0, h-1);
        nearest = (yn*w + xn) << 2;

        interpolated[pixel  ] = im[nearest  ];
        interpolated[pixel+1] = im[nearest+1];
        interpolated[pixel+2] = im[nearest+2];
        interpolated[pixel+3] = im[nearest+3];
    }
    return interpolated;
}
function interpolate_bilinear(im, w, h, nw, nh)
{
    // http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
    // http://tech-algorithm.com/articles/bilinear-image-scaling/
    var size = (nw*nh) << 2,
        interpolated = new IMG(size),
        rx = (w-1)/nw, ry = (h-1)/nh,
        A, B, C, D, a, b, c, d,
        i, j, x, y, xi, yi, pixel, index,
        yw, dx, dy, w4 = w << 2,
        round = stdMath.round
    ;
    i=0; j=0; x=0; y=0; yi=0; yw=0; dy=0;
    for (index=0; index<size; index+=4,++j,x+=rx)
    {
        if (j >= nw) {j=0; x=0; ++i; y+=ry; yi=y|0; dy=y - yi; yw=yi*w;}

        xi = x|0; dx = x - xi;

        // Y = A(1-w)(1-h) + B(w)(1-h) + C(h)(1-w) + Dwh
        a = (1-dx)*(1-dy); b = dx*(1-dy);
        c = dy*(1-dx); d = dx*dy;

        pixel = (yw + xi)<<2;

        A = im[pixel]; B = im[pixel+4];
        C = im[pixel+w4]; D = im[pixel+w4+4];
        interpolated[index] = clamp(round(A*a +  B*b + C*c  +  D*d), 0, 255);

        A = im[pixel+1]; B = im[pixel+5];
        C = im[pixel+w4+1]; D = im[pixel+w4+5];
        interpolated[index+1] = clamp(round(A*a +  B*b + C*c  +  D*d), 0, 255);

        A = im[pixel+2]; B = im[pixel+6];
        C = im[pixel+w4+2]; D = im[pixel+w4+6];
        interpolated[index+2] = clamp(round(A*a +  B*b + C*c  +  D*d), 0, 255);

        A = im[pixel+3]; B = im[pixel+7];
        C = im[pixel+w4+3]; D = im[pixel+w4+7];
        interpolated[index+3] = clamp(round(A*a +  B*b + C*c  +  D*d), 0, 255);
    }
    return interpolated;
}
ArrayUtil.copy = copy = ArrayUtil.hasArrayset ? function(a) {
    var b = new a.constructor(a.length);
    b.set(a, 0);
    return b;
} : function(a) {
    //var b = a.slice(0);
    var b = new a.constructor(a.length);
    arrayset_shim(b, a, 0, 0, a.length-1);
    return b;
};

function integral2(im, w, h, stride, channel, sat, sat2, rsat)
{
    //"use asm";
    var len = im.length, size = len>>>stride, rowLen = w<<stride,
        rem = (w&31)<<stride, sum, sum2, c, i, i0, j, i32 = 32<<stride, ii = 1<<stride, x, y;

    // compute sat(integral), sat2(square) and rsat(tilted integral) of image in one pass
    // SAT(-1, y) = SAT(x, -1) = SAT(-1, -1) = 0
    // SAT(x, y) = SAT(x, y-1) + SAT(x-1, y) + I(x, y) - SAT(x-1, y-1)  <-- integral image

    // RSAT(-1, y) = RSAT(x, -1) = RSAT(x, -2) = RSAT(-1, -1) = RSAT(-1, -2) = 0
    // RSAT(x, y) = RSAT(x-1, y-1) + RSAT(x+1, y-1) - RSAT(x, y-2) + I(x, y) + I(x, y-1)    <-- rotated(tilted) integral image at 45deg

    // first row
    sum=sum2=0;
    for (i=0+channel,j=0; i<rowLen; i+=ii,++j)
    {
        c = im[i];
        sum += c; sat[j] = sum;
        if (sat2) {sum2 += c*c; sat2[j] = sum2;}
        if (rsat) {rsat[j] = c;}
    }

    // other rows
    x=0; y=1; sum=sum2=0;
    for (i=rowLen+channel,j=0; i<len; i+=ii,++j)
    {
        c = im[i]; sum += c; sat[j+w] = sat[j]+sum;
        if (sat2) {sum2 += c*c; sat2[j+w] = sat2[j]+sum2;}
        if (rsat) {rsat[j+w] = (rsat[j+1-w]||0) + (c+(im[(j-w)<<stride]||0)) + (y>1?(rsat[j-w-w]||0):0) + (x>0?(rsat[j-1-w]||0):0);}
        if (++x >= w) {x=0; ++y; sum=sum2=0;}
    }
}
function gaussian(dx, dy, sigma)
{
    var rx = dx >>> 1,
        ry = dy >>> 1,
        l = dx*dy,
        f = -1/(2*sigma*sigma),
        m = new A32F(l),
        x, y, i, s, exp = stdMath.exp;
    for (s=0,x=-rx,y=-ry,i=0; i<l; ++i,++x)
    {
        if (x > rx) {x=-rx; ++y;}
        m[i] = exp(f*(x*x+y*y));
        s += m[i];
    }
    for (i=0; i<l; ++i) m[i] /= s;
    return m;
}
var gauss_5_14 = gaussian(5, 5, 1.4);
function gradient(im, w, h, stride, channel, do_lowpass, do_sat,
                    low, high, MAGNITUDE_SCALE, MAGNITUDE_LIMIT, MAGNITUDE_MAX)
{
    //"use asm";
    var stride0 = stride,
        imSize = im.length, count = imSize>>>stride,
        index, i, j, k, sum, w_1 = w-1, h_1 = h-1,
        w_2, h_2, w2, w4 = w<<stride,
        dx = 1<<stride, dx2 = dx<<1, dy = w4,
        i0, i1s, i2s, i1n, i2n,
        i1w, i1e, ine, inw, ise, isw,
        sobelX, sobelY,
        gX = new A32F(count),
        gY = new A32F(count),
        g, lowpassed;

    if (do_lowpass)
    {
        w_2 = w-2; h_2 = h-2; w2 = w<<1;
        lowpassed = new A32F(count);
        //f = 1.0/159.0;
        // pre-bluring is optional, e.g a deriche pre-blur filtering can be used
        /*
        gauss lowpass 5x5 with sigma = 1.4
                       | 2  4  5  4 2 |
                 1     | 4  9 12  9 4 |
        Gauss = ---  * | 5 12 15 12 5 |
                159    | 4  9 12  9 4 |
                       | 2  4  5  4 2 |
        */
        /*
        // first, second rows, last, second-to-last rows
        for (i=0; i<w; i++)
        {
            lowpassed[i] = 0; lowpassed[i+w] = 0;
            lowpassed[i+count-w] = 0; lowpassed[i+count-w2] = 0;
        }
        // first, second columns, last, second-to-last columns
        for (i=0,k=0; i<h; i++,k+=w)
        {
            lowpassed[k] = 0; lowpassed[1+k] = 0;
            lowpassed[w_1+k] = 0; lowpassed[w_2+k] = 0;
        }
        */
        g = gauss_5_14;
        for (i=2,j=2,k=w2; j<h_2; ++i)
        {
            if (i >= w_2) {i=2; k+=w; ++j; if (j>=h_2) break;}
            index = i+k; i0 = (index<<stride);
            if (0 < stride && 0 === im[i0+3])
            {
                lowpassed[index] = 0;
            }
            else
            {
                i0 += channel;
                i1s = i0+dy; i2s = i1s+dy; i1n = i0-dy; i2n = i1n-dy;
                lowpassed[index] = (
                g[0]*im[i2n-dx2] + g[1]*im[i2n-dx] + g[2]*im[i2n] + g[3]*im[i2n+dx] + g[4]*im[i2n+dx2]
               +g[5]*im[i1n-dx2] + g[6]*im[i1n-dx] + g[7]*im[i1n] + g[8]*im[i1n+dx] + g[9]*im[i1n+dx2]
               +g[10]*im[i0 -dx2] + g[11]*im[i0 -dx] + g[12]*im[i0 ] + g[13]*im[i0 +dx] + g[14]*im[i0 +dx2]
               +g[15]*im[i1s-dx2] +  g[16]*im[i1s-dx] + g[17]*im[i1s] + g[18]*im[i1s+dx] + g[19]*im[i1s+dx2]
               +g[20]*im[i2s-dx2] + g[21]*im[i2s-dx] + g[22]*im[i2s] + g[23]*im[i2s+dx] + g[24]*im[i2s+dx2]
                );
            }
        }
        dx = 1; dx2 = 2; dy = w; stride = 0; channel = 0;
    }
    else
    {
        lowpassed = im;
    }

    /*
    separable sobel gradient 3x3 in X,Y directions
             | −1  0  1 |
    sobelX = | −2  0  2 |
             | −1  0  1 |

             |  1  2  1 |
    sobelY = |  0  0  0 |
             | −1 -2 -1 |
    */
    for (i=1,j=1,k=w; j<h_1; ++i)
    {
        if (i >= w_1) {i=1; k+=w; ++j; if (j>=h_1) break;}
        index = k+i; i0 = (index<<stride)+channel;
        i1s = i0+dy; i1n = i0-dy;
        gX[index] = (lowpassed[i1n+dx]-lowpassed[i1n-dx])+2*(lowpassed[i0+dx]-lowpassed[i0-dx])+(lowpassed[i1s+dx]-lowpassed[i1s-dx]);
        gY[index] = (lowpassed[i1n-dx]-lowpassed[i1s-dx])+2*(lowpassed[i1n]-lowpassed[i1s])+(lowpassed[i1n+dx]-lowpassed[i1s+dx]);
    }
    // do the next stages of canny edge processing
    return optimum_gradient(gX, gY, im, w, h, stride0, do_sat, low, high, MAGNITUDE_SCALE, MAGNITUDE_LIMIT, MAGNITUDE_MAX);
}
function optimum_gradient(gX, gY, im, w, h, stride, sat, low, high, MAGNITUDE_SCALE, MAGNITUDE_LIMIT, MAGNITUDE_MAX)
{
    //"use asm";
    if (null == MAGNITUDE_SCALE)
    {
        MAGNITUDE_SCALE = 1; MAGNITUDE_LIMIT = 510; // 2*255
        MAGNITUDE_MAX = MAGNITUDE_SCALE * MAGNITUDE_LIMIT;
    }
    var imSize = im.length,
        count = imSize>>>stride,
        index, i, j, k, sum,
        w_1 = w-1, h_1 = h-1,
        i0, i1s, i2s, i1n, i2n,
        i1w, i1e, ine, inw, ise, isw,
        g = new A32F(count), xGrad, yGrad,
        absxGrad, absyGrad, gradMag, tmp,
        nMag, sMag, wMag, eMag,
        neMag, seMag, swMag, nwMag, gg,
        x0, x1, x2, y0, y1, y2,
        x, y, y0w, yw, jj, ii,
        followedge, tm, tM;

    // non-maximal supression
    for (i=1,j=1,k=w; j<h_1; ++i)
    {
        if (i >= w_1) {i=1; k+=w; ++j; if (j>=h_1) break;}

        i0 = i + k;
        i1n = i0 - w;
        i1s = i0 + w;
        i1w = i0 - 1;
        i1e = i0 + 1;
        inw = i1n - 1;
        ine = i1n + 1;
        isw = i1s - 1;
        ise = i1s + 1;

        xGrad = gX[i0]; yGrad = gY[i0];
        absxGrad = Abs(xGrad); absyGrad = Abs(yGrad);
        tM = Max(absxGrad, absyGrad);
        tm = Min(absxGrad, absyGrad);
        gradMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[i1n]),Abs(gY[i1n]));
        tm = Min(Abs(gX[i1n]),Abs(gY[i1n]));
        nMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[i1s]),Abs(gY[i1s]));
        tm = Min(Abs(gX[i1s]),Abs(gY[i1s]));
        sMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[i1w]),Abs(gY[i1w]));
        tm = Min(Abs(gX[i1w]),Abs(gY[i1w]));
        wMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[i1e]),Abs(gY[i1e]));
        tm = Min(Abs(gX[i1e]),Abs(gY[i1e]));
        eMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[ine]),Abs(gY[ine]));
        tm = Min(Abs(gX[ine]),Abs(gY[ine]));
        neMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[ise]),Abs(gY[ise]));
        tm = Min(Abs(gX[ise]),Abs(gY[ise]));
        seMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[isw]),Abs(gY[isw]));
        tm = Min(Abs(gX[isw]),Abs(gY[isw]));
        swMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation
        tM = Max(Abs(gX[inw]),Abs(gY[inw]));
        tm = Min(Abs(gX[inw]),Abs(gY[inw]));
        nwMag = tM ? (tM*(1+0.43*tm/tM*tm/tM)) : 0; // approximation

        gg = xGrad * yGrad <= 0
            ? (absxGrad >= absyGrad
                ? ((tmp = absxGrad * gradMag) >= Abs(yGrad * neMag - (xGrad + yGrad) * eMag)
                    && tmp > Abs(yGrad * swMag - (xGrad + yGrad) * wMag))
                : ((tmp = absyGrad * gradMag) >= Abs(xGrad * neMag - (yGrad + xGrad) * nMag)
                    && tmp > Abs(xGrad * swMag - (yGrad + xGrad) * sMag)))
            : (absxGrad >= absyGrad
                ? ((tmp = absxGrad * gradMag) >= Abs(yGrad * seMag + (xGrad - yGrad) * eMag)
                    && tmp > Abs(yGrad * nwMag + (xGrad - yGrad) * wMag))
                : ((tmp = absyGrad * gradMag) >= Abs(xGrad * seMag + (yGrad - xGrad) * sMag)
                    && tmp > Abs(xGrad * nwMag + (yGrad - xGrad) * nMag)));
        g[i0] = gg ? (gradMag >= MAGNITUDE_LIMIT ? MAGNITUDE_MAX : MAGNITUDE_SCALE * gradMag) : 0;
    }
    if (sat)
    {
        // integral (canny) gradient
        // first row
        for (i=0,sum=0; i<w; ++i) {sum += g[i]; g[i] = sum;}
        // other rows
        for (i=w,k=0,sum=0; i<count; ++i,++k)
        {
            if (k>=w) {k=0; sum=0;}
            sum += g[i]; g[i] = g[i-w] + sum;
        }
        return g;
    }
    else
    {
        // full (canny) gradient
        // reset image
        if (stride) for (i=0; i<imSize; i+=4) {im[i] = im[i+1] = im[i+2] = 0;}
        else for (i=0; i<imSize; ++i) {im[i] = 0;}

        //hysteresis and double-threshold, inlined
        for (i=0,j=0,index=0,k=0; index<count; ++index,k=index<<stride,++i)
        {
            if (i >= w) {i=0; ++j;}
            /*if ((0 === im[k]) && (g[index] >= high))
            {
                follow(im, w, h, g, i, j, index, stride, low);
            }*/
            if ((0 < im[k]) || (g[index] < high)) continue;
            x1 = i; y1 = j; ii = k; jj = index;
            do {
                // threshold here
                if (stride) {im[ii] = im[ii+1] = im[ii+2] = /*g[jj]*/255;}
                else {im[ii] = /*g[jj]*/255;}

                x0 = x1 === 0 ? x1 : x1-1;
                x2 = x1 === w_1 ? x1 : x1+1;
                y0 = y1 === 0 ? y1 : y1-1;
                y2 = y1 === h_1 ? y1 : y1+1;
                y0w = y0*w;
                x = x0; y = y0; yw = y0w = y0*w; followedge = 0;
                while (x <= x2 && y <= y2)
                {
                    jj = x + yw; ii = jj << stride;
                    if ((y !== y1 || x !== x1) && (0 === im[ii]) && (g[jj] >= low))
                    {
                        x1 = x; y1 = y;
                        followedge = 1; break;
                    }
                    ++y; yw+=w; if (y>y2) {y=y0; yw=y0w; ++x;}
                }
            } while (followedge);
        }
        return im;
    }
}
/*function follow(im, w, h, g, x1, y1, i1, stride, low)
{
    var
        x0 = x1 === 0 ? x1 : x1 - 1,
        x2 = x1 === w - 1 ? x1 : x1 + 1,
        y0 = y1 === 0 ? y1 : y1 - 1,
        y2 = y1 === h -1 ? y1 : y1 + 1,
        x, y, yw, y0w, i2, j2
    ;

    j2 = i1 << stride;
    im[j2] = g[i1];
    if (0 < stride) im[j2+1] = im[j2+2] = im[j2];
    x = x0, y = y0; y0w = yw = y0*w;
    while (x <= x2 && y <= y2)
    {
        i2 = x + yw; j2 = i2 << stride;
        if ((y !== y1 || x !== x1) && 0 === im[j2] && g[i2] >= low)
        {
            follow(im, w, h, g, x, y, i2, stride, low);
            return;
        }
        ++y; if (y>y2) {y=y0; yw=y0w; ++x;}
    }
}*/
function gradient_glsl()
{
var toFloat = FILTER.Util.GLSL.formatFloat,
g = function(i, notsigned) {return toFloat(gauss_5_14[i], !notsigned);};
return {
'lowpass': [
'vec4 lowpass(sampler2D img, vec2 pix, vec2 dp) {',
'   float a = texture2D(img, pix).a;',
'   if (0.0 == a || 0.0 > pix.x-2.0*dp.x || 0.0 > pix.y-2.0*dp.y || 1.0 < pix.x+2.0*dp.x || 1.0 < pix.y+2.0*dp.y) return vec4(0.0, 0.0, 0.0, a);',
'   return vec4('+g(0,1)+'*texture2D(img, pix+vec2(-2.0,-2.0)*dp).rgb'+g(1)+'*texture2D(img, pix+vec2(-1.0,-2.0)*dp).rgb'+g(2)+'*texture2D(img, pix+vec2(0.0,-2.0)*dp).rgb'+g(3)+'*texture2D(img, pix+vec2(1.0,-2.0)*dp).rgb'+g(4)+'*texture2D(img, pix+vec2(2.0,-2.0)*dp).rgb'+g(5)+'*texture2D(img, pix+vec2(-2.0,-1.0)*dp).rgb'+g(6)+'*texture2D(img, pix+vec2(-1.0,-1.0)*dp).rgb'+g(7)+'*texture2D(img, pix+vec2(0.0,-1.0)*dp).rgb'+g(8)+'*texture2D(img, pix+vec2(1.0,-1.0)*dp).rgb'+g(9)+'*texture2D(img, pix+vec2(2.0,-1.0)*dp).rgb'+g(10)+'*texture2D(img, pix+vec2(-2.0,0.0)*dp).rgb'+g(11)+'*texture2D(img, pix+vec2(-1.0,0.0)*dp).rgb'+g(12)+'*texture2D(img, pix+vec2(0.0,0.0)*dp).rgb'+g(13)+'*texture2D(img, pix+vec2(1.0,0.0)*dp).rgb'+g(14)+'*texture2D(img, pix+vec2(2.0,0.0)*dp).rgb'+g(15)+'*texture2D(img, pix+vec2(-2.0,1.0)*dp).rgb'+g(16)+'*texture2D(img, pix+vec2(-1.0,1.0)*dp).rgb'+g(17)+'*texture2D(img, pix+vec2(0.0,1.0)*dp).rgb'+g(18)+'*texture2D(img, pix+vec2(1.0,1.0)*dp).rgb'+g(19)+'*texture2D(img, pix+vec2(2.0,1.0)*dp).rgb'+g(20)+'*texture2D(img, pix+vec2(-2.0,2.0)*dp).rgb'+g(21)+'*texture2D(img, pix+vec2(-1.0,2.0)*dp).rgb'+g(22)+'*texture2D(img, pix+vec2(0.0,2.0)*dp).rgb'+g(23)+'*texture2D(img, pix+vec2(1.0,2.0)*dp).rgb'+g(24)+'*texture2D(img, pix+vec2(2.0,2.0)*dp).rgb, a);',
'}'
].join('\n'),
'gradient': [
'vec2 sobel_gradient(sampler2D i, vec2 p, vec2 d) {',
'   if (0.0 > pix.x-d.x || 0.0 > pix.y-d.y || 1.0 < pix.x+d.x || 1.0 < pix.y+d.y) return vec2(0.0);',
'    return vec2(',
'    (texture2D(i, p+vec2(1.0,-1.0)*d).r-texture2D(i, p+vec2(-1.0,-1.0)*d).r)',
'    +2.0*(texture2D(i, p+vec2(1.0,0.0)*d).r-texture2D(i, p+vec2(-1.0,0.0)*d).r)',
'    +(texture2D(i, p+vec2(1.0,1.0)*d).r-texture2D(i, p+vec2(-1.0,1.0)*d).r)',
'    ,',
'    (texture2D(i, p+vec2(-1.0,-1.0)*d).r-texture2D(i, p+vec2(-1.0,1.0)*d).r)',
'    +2.0*(texture2D(i, p+vec2(0.0,-1.0)*d).r-texture2D(i, p+vec2(0.0,1.0)*d).r)',
'    +(texture2D(i, p+vec2(1.0,-1.0)*d).r-texture2D(i, p+vec2(1.0,1.0)*d).r)',
'    );',
'}',
'float gradient_suppressed(sampler2D img, vec2 pix, vec2 dp, float magnitude_scale, float magnitude_limit, float magnitude_max) {',
'    vec2 g = sobel_gradient(img, pix, dp);',
'    vec2 gn = sobel_gradient(img, pix+vec2(0.0,-1.0)*dp, dp);',
'    vec2 gs = sobel_gradient(img, pix+vec2(0.0,1.0)*dp, dp);',
'    vec2 gw = sobel_gradient(img, pix+vec2(-1.0,0.0)*dp, dp);',
'    vec2 ge = sobel_gradient(img, pix+vec2(1.0,0.0)*dp, dp);',
'    vec2 gnw = sobel_gradient(img, pix+vec2(-1.0,-1.0)*dp, dp);',
'    vec2 gne = sobel_gradient(img, pix+vec2(1.0,-1.0)*dp, dp);',
'    vec2 gsw = sobel_gradient(img, pix+vec2(-1.0,1.0)*dp, dp);',
'    vec2 gse = sobel_gradient(img, pix+vec2(1.0,1.0)*dp, dp);',
'    float gM = length(g);',
'    float gnM = length(gn);',
'    float gsM = length(gs);',
'    float gwM = length(gw);',
'    float geM = length(ge);',
'    float gnwM = length(gnw);',
'    float gneM = length(gne);',
'    float gswM = length(gsw);',
'    float gseM = length(gse);',
'    float gg = 0.0; float tmp;',
'    if (g.x*g.y <= 0.0)',
'    {',
'        if (abs(g.x) >= abs(g.y))',
'        {',
'            tmp = abs(g.x)*gM;',
'            if (tmp >= abs(g.y * gneM - (g.x + g.y) * geM) && tmp > abs(g.y * gswM - (g.x + g.y) * gwM))',
'            {',
'                gg = 1.0;',
'            }',
'        }',
'        else',
'        {',
'            tmp = abs(g.y)*gM;',
'            if (tmp >= abs(g.x * gneM - (g.y + g.x) * gnM) && tmp > abs(g.x * gswM - (g.y + g.x) * gsM))',
'            {',
'                gg = 1.0;',
'            }',
'        }',
'    }',
'    else',
'    {',
'        if (abs(g.x) >= abs(g.y))',
'        {',
'            tmp = abs(g.x)*gM;',
'            if (tmp >= abs(g.y * gseM + (g.x - g.y) * geM) && tmp > abs(g.y * gnwM + (g.x - g.y) * gwM))',
'            {',
'                gg = 1.0;',
'            }',
'        }',
'        else',
'        {',
'            tmp = abs(g.y)*gM;',
'            if (tmp >= abs(g.x * gseM + (g.y - g.x) * gsM)',
'                && tmp > abs(g.x * gnwM + (g.y - g.x) * gnM))',
'            {',
'                gg = 1.0;',
'            }',
'        }',
'    }',
'    if (0.0 < gg)',
'    {',
'        if (gM >= magnitude_limit)',
'        {',
'            gg = magnitude_max;',
'        }',
'        else',
'        {',
'            gg = magnitude_scale * gM;',
'        }',
'    }',
'    return gg;',
'}',
'vec4 gradient(sampler2D img, vec2 pix, vec2 dp, float low, float high, float magnitude_scale, float magnitude_limit, float magnitude_max) {',
'    float a = texture2D(img, pix).a;',
'    if (0.0 == a) return vec4(0.0);',
'    float g = gradient_suppressed(img, pix, dp, magnitude_scale, magnitude_limit, magnitude_max);',
'    if (g >= high) return vec4(vec3(1.0), a);',
'    else if (g < low) return vec4(vec3(0.0), a);',
'    return vec4(vec3(/*clamp((g-low)/(high-low)-0.1, 0.0, 0.9)/0.9*/0.01), a);',
'}'
].join('\n'),
'hysteresis': [
'vec4 hysteresis(sampler2D img, vec2 pix, vec2 dp) {',
'   vec4 g = texture2D(img, pix);',
'   float x; float y; vec4 gg;',
'   if (0.0 < g.r && 1.0 > g.r) {',
'       for (int i=-1; i<=1; ++i) { x = float(i);',
'           if (0.0 > pix.x+x*dp.x || 1.0 < pix.x+x*dp.x) continue;',
'           for (int j=-1; j<=1; ++j) { y = float(j);',
'               if (0==i && 0==j) continue;',
'               if (0.0 > pix.y+y*dp.y || 1.0 < pix.y+y*dp.y) continue;',
'               gg = texture2D(img, pix+vec2(x,y)*dp);',
'               if (1.0 == gg.r) return vec4(vec3(1.0), g.a);',
'           }',
'       }',
'   }',
'   return g;',
'}'
].join('\n')
};
}
function image_glsl()
{
return {
'crop': [
'vec4 crop(vec2 pix, sampler2D img, vec2 wh, vec2 nwh, float x1, float y1, float x2, float y2) {',
'   vec2 start = vec2(x1, y1)/wh; vec2 end = vec2(x2, y2)/wh;',
'   return texture2D(img, start + pix*(end-start));',
'}'
].join('\n'),
'pad': [
'vec4 pad(vec2 pix, sampler2D img, vec2 wh, vec2 nwh, float pad_right, float pad_bot, float pad_left, float pad_top) {',
'   vec2 p = pix*nwh - vec2(pad_left, pad_top);',
'   if (p.x < 0.0 || p.x > wh.x || p.y < 0.0 || p.y > wh.y) return vec4(0.0);',
'   return texture2D(img, p/wh);',
'}'
].join('\n'),
'interpolate': [
'vec4 interpolate_nearest(vec2 pix, sampler2D img, vec2 wh, vec2 nwh) {',
'   return texture2D(img, pix);',
'}',
'vec4 interpolate_bilinear(vec2 pix, sampler2D img, vec2 wh, vec2 nwh) {',
'   if (wh.x == nwh.x && wh.y == nwh.y) return texture2D(img, pix);',
'   vec2 xy = pix*wh /*+ vec2(0.5)*/;',
'   vec2 xyi = floor(xy);',
'   vec2 x1yi = xyi + vec2(1.0, 0.0);',
'   vec2 xy1i = xyi + vec2(0.0, 1.0);',
'   vec2 x1y1i = xyi + vec2(1.0, 1.0);',
'   vec2 d = (xy - xyi);',
'   return (1.0-d.x)*(1.0-d.y)*texture2D(img, xyi/wh) + (d.x)*(1.0-d.y)*texture2D(img, x1yi/wh) + (1.0-d.x)*(d.y)*texture2D(img, xy1i/wh) + (d.x)*(d.y)*texture2D(img, x1y1i/wh);',
'}',
'vec4 interpolate(vec2 pix, sampler2D img, vec2 wh, vec2 nwh) {',
'   return interpolate_bilinear(pix, img, wh, nwh);',
'}'
].join('\n')
};
}
// speed-up convolution for special kernels like moving-average
function integral_convolution(mode, im, w, h, stride, matrix, matrix2, dimX, dimY, dimX2, dimY2, coeff1, coeff2, numRepeats)
{
    //"use asm";
    var imLen=im.length, imArea=imLen>>>stride, integral, integralLen,
        colR, colG, colB,
        matRadiusX=dimX, matRadiusY=dimY, matArea, matArea2,
        matHalfSideX, matHalfSideY, matHalfSideX2, matHalfSideY2,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        matOffsetLeft2, matOffsetRight2, matOffsetTop2, matOffsetBottom2,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2,
        r, g, b, r2, g2, b2, repeat, tmp, w4 = w<<stride, ii = 1<<stride;

    // convolution speed-up based on the integral image concept and symmetric / separable kernels

    // pre-compute indices,
    // reduce redundant computations inside the main convolution loop (faster)
    matArea = matRadiusX*matRadiusY;
    matHalfSideX = matRadiusX>>>1;  matHalfSideY = w*(matRadiusY>>>1);
    // one additional offest needed due to integral computation
    matOffsetLeft = -matHalfSideX-1; matOffsetTop = -matHalfSideY-w;
    matOffsetRight = matHalfSideX; matOffsetBottom = matHalfSideY;
    matArea2 = dimX2*dimY2;
    matHalfSideX2 = dimX2>>>1;  matHalfSideY2 = w*(dimY2>>>1);
    matOffsetLeft2 = -matHalfSideX2-1; matOffsetTop2 = -matHalfSideY2-w;
    matOffsetRight2 = matHalfSideX2; matOffsetBottom2 = matHalfSideY2;
    bx1 = 0; bx2 = w-1; by1 = 0; by2 = imArea-w;

    dst = im; im = new IMG(imLen);
    numRepeats = numRepeats||1;

    if (MODE.GRAY === mode)
    {
        integralLen = imArea;  rowLen = w;
        integral = new A32F(integralLen);

        if (matrix2) // allow to compute a second matrix in-parallel
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea2>>>1]; centerOffset2 = wtCenter2-wt2;

            // do this multiple times??
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=0;
                for (x=0; x<w; ++x, i+=ii, ++j)
                {
                    colR+=im[i]; integral[j]=colR;
                }
                // other rows
                j=0; x=0; colR=0;
                for (i=w4; i<imLen; i+=ii, ++j, ++x)
                {
                    if (x>=w) {x=0; colR=0;}
                    colR+=im[i]; integral[j+rowLen]=integral[j]+colR;
                }


                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                    xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;

                    // fix borders
                     xOff1 = xOff1<bx1 ? bx1 : xOff1;
                     xOff2 = xOff2>bx2 ? bx2 : xOff2;
                     yOff1 = yOff1<by1 ? by1 : yOff1;
                     yOff2 = yOff2>by2 ? by2 : yOff2;

                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;

                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft2; yOff1=ty + matOffsetTop2;
                    xOff2=x + matOffsetRight2; yOff2=ty + matOffsetBottom2;

                    // fix borders
                     xOff1 = xOff1<bx1 ? bx1 : xOff1;
                     xOff2 = xOff2>bx2 ? bx2 : xOff2;
                     yOff1 = yOff1<by1 ? by1 : yOff1;
                     yOff2 = yOff2>by2 ? by2 : yOff2;

                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;

                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    r2 = wt2 * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset2 * im[i  ]);

                    // output
                    t0 = coeff1*r + coeff2*r2;
                    dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                // do another pass??
            }
        }
        else
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;

            // do this multiple times??
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=0;
                for (x=0; x<w; x++, i+=ii,++j)
                {
                    colR+=im[i]; integral[j]=colR;
                }
                // other rows
                j=0; x=0; colR=0;
                for (i=w4; i<imLen; i+=ii, ++j, ++x)
                {
                    if (x>=w) {x=0; colR=0;}
                    colR+=im[i]; integral[j+rowLen  ]=integral[j  ]+colR;
                }

                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                    xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;

                    // fix borders
                    xOff1 = xOff1<bx1 ? bx1 : xOff1;
                    xOff2 = xOff2>bx2 ? bx2 : xOff2;
                    yOff1 = yOff1<by1 ? by1 : yOff1;
                    yOff2 = yOff2>by2 ? by2 : yOff2;

                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;

                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);

                    // output
                    t0 = coeff1*r + coeff2;
                    dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                // do another pass??
            }
        }
    }
    else
    {
        integralLen = (imArea<<1)+imArea;  rowLen = (w<<1)+w;
        integral = new A32F(integralLen);

        if (matrix2) // allow to compute a second matrix in-parallel
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea2>>>1]; centerOffset2 = wtCenter2-wt2;

            // do this multiple times??
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=colG=colB=0;
                for (x=0; x<w; ++x, i+=ii, j+=3)
                {
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                }
                // other rows
                j=0; x=0; colR=colG=colB=0;
                for (i=w4; i<imLen; i+=ii, j+=3, ++x)
                {
                    if (x>=w) {x=0; colR=colG=colB=0;}
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j+rowLen]=integral[j]+colR;
                    integral[j+rowLen+1]=integral[j+1]+colG;
                    integral[j+rowLen+2]=integral[j+2]+colB;
                }


                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                    xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;

                    // fix borders
                    xOff1 = xOff1<bx1 ? bx1 : xOff1;
                    xOff2 = xOff2>bx2 ? bx2 : xOff2;
                    yOff1 = yOff1<by1 ? by1 : yOff1;
                    yOff2 = yOff2>by2 ? by2 : yOff2;

                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                    // arguably faster way to write p1*=3; etc..
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;

                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                    g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                    b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft2; yOff1=ty + matOffsetTop2;
                    xOff2=x + matOffsetRight2; yOff2=ty + matOffsetBottom2;

                    // fix borders
                    xOff1 = xOff1<bx1 ? bx1 : xOff1;
                    xOff2 = xOff2>bx2 ? bx2 : xOff2;
                    yOff1 = yOff1<by1 ? by1 : yOff1;
                    yOff2 = yOff2>by2 ? by2 : yOff2;

                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                    // arguably faster way to write p1*=3; etc..
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;

                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r2 = wt2 * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset2 * im[i  ]);
                    g2 = wt2 * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset2 * im[i+1]);
                    b2 = wt2 * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset2 * im[i+2]);

                    // output
                    t0 = coeff1*r + coeff2*r2; t1 = coeff1*g + coeff2*g2; t2 = coeff1*b + coeff2*b2;
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }

                // do another pass??
            }
        }
        else
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;

            // do this multiple times??
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=colG=colB=0;
                for (x=0; x<w; ++x, i+=ii, j+=3)
                {
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                }
                // other rows
                j=0; x=0; colR=colG=colB=0;
                for (i=w4; i<imLen; i+=ii, j+=3, ++x)
                {
                    if (x>=w) {x=0; colR=colG=colB=0;}
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j+rowLen  ]=integral[j  ]+colR;
                    integral[j+rowLen+1]=integral[j+1]+colG;
                    integral[j+rowLen+2]=integral[j+2]+colB;
                }

                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                    xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;

                    // fix borders
                    xOff1 = xOff1<bx1 ? bx1 : xOff1;
                    xOff2 = xOff2>bx2 ? bx2 : xOff2;
                    yOff1 = yOff1<by1 ? by1 : yOff1;
                    yOff2 = yOff2>by2 ? by2 : yOff2;

                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                    // arguably faster way to write p1*=3; etc..
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;

                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                    g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                    b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);

                    // output
                    t0 = coeff1*r + coeff2; t1 = coeff1*g + coeff2; t2 = coeff1*b + coeff2;
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                // do another pass??
            }
        }
    }
    return dst;
}
function integral_convolution_clamp(mode, im, w, h, stride, matrix, matrix2, dimX, dimY, dimX2, dimY2, coeff1, coeff2, numRepeats)
{
    //"use asm";
    var imLen=im.length, imArea=imLen>>>stride, integral, integralLen,
        colR, colG, colB,
        matRadiusX=dimX, matRadiusY=dimY, matArea, matArea2,
        matHalfSideX, matHalfSideY, matHalfSideX2, matHalfSideY2,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        matOffsetLeft2, matOffsetRight2, matOffsetTop2, matOffsetBottom2,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2,
        r, g, b, r2, g2, b2, repeat, tmp, w4 = w<<stride, ii = 1<<stride;

    // convolution speed-up based on the integral image concept and symmetric / separable kernels

    // pre-compute indices,
    // reduce redundant computations inside the main convolution loop (faster)
    matArea = matRadiusX*matRadiusY;
    matHalfSideX = matRadiusX>>>1;  matHalfSideY = w*(matRadiusY>>>1);
    // one additional offest needed due to integral computation
    matOffsetLeft = -matHalfSideX-1; matOffsetTop = -matHalfSideY-w;
    matOffsetRight = matHalfSideX; matOffsetBottom = matHalfSideY;
    matArea2 = dimX2*dimY2;
    matHalfSideX2 = dimX2>>>1;  matHalfSideY2 = w*(dimY2>>>1);
    matOffsetLeft2 = -matHalfSideX2-1; matOffsetTop2 = -matHalfSideY2-w;
    matOffsetRight2 = matHalfSideX2; matOffsetBottom2 = matHalfSideY2;
    bx1 = 0; bx2 = w-1; by1 = 0; by2 = imArea-w;

    dst = im; im = new IMG(imLen);
    numRepeats = numRepeats||1;

    if (MODE.GRAY === mode)
    {
        integralLen = imArea;  rowLen = w;
        integral = new A32F(integralLen);

        if (matrix2) // allow to compute a second matrix in-parallel
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea2>>>1]; centerOffset2 = wtCenter2-wt2;

            // do this multiple times??
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=0;
                for (x=0; x<w; x++, i+=ii, ++j)
                {
                    colR+=im[i]; integral[j]=colR;
                }
                // other rows
                j=0; x=0; colR=0;
                for (i=w4; i<imLen; i+=ii, ++j, ++x)
                {
                    if (x>=w) {x=0; colR=0;}
                    colR+=im[i]; integral[j+rowLen]=integral[j]+colR;
                }


                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                    xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;

                    // fix borders
                     xOff1 = xOff1<bx1 ? bx1 : xOff1;
                     xOff2 = xOff2>bx2 ? bx2 : xOff2;
                     yOff1 = yOff1<by1 ? by1 : yOff1;
                     yOff2 = yOff2>by2 ? by2 : yOff2;

                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;

                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft2; yOff1=ty + matOffsetTop2;
                    xOff2=x + matOffsetRight2; yOff2=ty + matOffsetBottom2;

                    // fix borders
                    xOff1 = xOff1<bx1 ? bx1 : xOff1;
                    xOff2 = xOff2>bx2 ? bx2 : xOff2;
                    yOff1 = yOff1<by1 ? by1 : yOff1;
                    yOff2 = yOff2>by2 ? by2 : yOff2;

                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;

                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    r2 = wt2 * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset2 * im[i  ]);

                    // output
                    t0 = coeff1*r + coeff2*r2;
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                // do another pass??
            }
        }
        else
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;

            // do this multiple times??
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=0;
                for (x=0; x<w; x++, i+=ii,++j)
                {
                    colR+=im[i]; integral[j]=colR;
                }
                // other rows
                j=0; x=0; colR=0;
                for (i=w4; i<imLen; i+=ii, ++j, ++x)
                {
                    if (x>=w) {x=0; colR=0;}
                    colR+=im[i]; integral[j+rowLen  ]=integral[j  ]+colR;
                }

                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                    xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;

                    // fix borders
                    xOff1 = xOff1<bx1 ? bx1 : xOff1;
                    xOff2 = xOff2>bx2 ? bx2 : xOff2;
                    yOff1 = yOff1<by1 ? by1 : yOff1;
                    yOff2 = yOff2>by2 ? by2 : yOff2;

                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;

                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);

                    // output
                    t0 = coeff1*r + coeff2;
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
                // do another pass??
            }
        }
    }
    else
    {
        integralLen = (imArea<<1)+imArea;  rowLen = (w<<1)+w;
        integral = new A32F(integralLen);

        if (matrix2) // allow to compute a second matrix in-parallel
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;
            wt2 = matrix2[0]; wtCenter2 = matrix2[matArea2>>>1]; centerOffset2 = wtCenter2-wt2;

            // do this multiple times??
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=colG=colB=0;
                for (x=0; x<w; ++x, i+=ii, j+=3)
                {
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                }
                // other rows
                j=0; x=0; colR=colG=colB=0;
                for (i=w4; i<imLen; i+=ii, j+=3, ++x)
                {
                    if (x>=w) {x=0; colR=colG=colB=0;}
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j+rowLen]=integral[j]+colR;
                    integral[j+rowLen+1]=integral[j+1]+colG;
                    integral[j+rowLen+2]=integral[j+2]+colB;
                }


                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                    xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;

                    // fix borders
                    xOff1 = xOff1<bx1 ? bx1 : xOff1;
                    xOff2 = xOff2>bx2 ? bx2 : xOff2;
                    yOff1 = yOff1<by1 ? by1 : yOff1;
                    yOff2 = yOff2>by2 ? by2 : yOff2;

                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                    // arguably faster way to write p1*=3; etc..
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;

                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                    g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                    b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft2; yOff1=ty + matOffsetTop2;
                    xOff2=x + matOffsetRight2; yOff2=ty + matOffsetBottom2;

                    // fix borders
                    xOff1 = xOff1<bx1 ? bx1 : xOff1;
                    xOff2 = xOff2>bx2 ? bx2 : xOff2;
                    yOff1 = yOff1<by1 ? by1 : yOff1;
                    yOff2 = yOff2>by2 ? by2 : yOff2;

                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                    // arguably faster way to write p1*=3; etc..
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;

                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r2 = wt2 * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset2 * im[i  ]);
                    g2 = wt2 * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset2 * im[i+1]);
                    b2 = wt2 * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset2 * im[i+2]);

                    // output
                    t0 = coeff1*r + coeff2*r2; t1 = coeff1*g + coeff2*g2; t2 = coeff1*b + coeff2*b2;
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }

                // do another pass??
            }
        }
        else
        {
            wt = matrix[0]; wtCenter = matrix[matArea>>>1]; centerOffset = wtCenter-wt;

            // do this multiple times??
            for (repeat=0; repeat<numRepeats; ++repeat)
            {
                //dst = new IMG(imLen); integral = new A32F(integralLen);
                tmp = im; im = dst; dst = tmp;

                // compute integral of image in one pass

                // first row
                i=0; j=0; colR=colG=colB=0;
                for (x=0; x<w; ++x, i+=ii, j+=3)
                {
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
                }
                // other rows
                j=0; x=0; colR=colG=colB=0;
                for (i=w4; i<imLen; i+=ii, j+=3, ++x)
                {
                    if (x>=w) {x=0; colR=colG=colB=0;}
                    colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                    integral[j+rowLen  ]=integral[j  ]+colR;
                    integral[j+rowLen+1]=integral[j+1]+colG;
                    integral[j+rowLen+2]=integral[j+2]+colB;
                }

                // now can compute any symmetric convolution kernel in constant time
                // depending only on image dimensions, regardless of matrix radius

                // do direct convolution
                x=0; y=0; ty=0;
                for (i=0; i<imLen; i+=ii, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ++y; ty+=w;}

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                    xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;

                    // fix borders
                    xOff1 = xOff1<bx1 ? bx1 : xOff1;
                    xOff2 = xOff2>bx2 ? bx2 : xOff2;
                    yOff1 = yOff1<by1 ? by1 : yOff1;
                    yOff2 = yOff2>by2 ? by2 : yOff2;

                    // compute integral positions
                    p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                    // arguably faster way to write p1*=3; etc..
                    p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;

                    // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                    // also fix the center element (in case it is different)
                    r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                    g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                    b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);

                    // output
                    t0 = coeff1*r + coeff2; t1 = coeff1*g + coeff2; t2 = coeff1*b + coeff2;
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }

                // do another pass??
            }
        }
    }
    return dst;
}
// speed-up convolution for separable kernels
function separable_convolution(mode, im, w, h, stride, matrix, matrix2, ind1, ind2, coeff1, coeff2)
{
    //"use asm";
    var imLen=im.length, imArea=imLen>>>stride,
        matArea, mat, indices, matArea2,
        dst, imageIndices, imageIndices1, imageIndices2,
        i, j, k, x, ty, ty2, ii = 1<<stride,
        xOff, yOff, srcOff, bx, by, t0, t1, t2, t3, wt,
        r, g, b, a, coeff, numPasses, tmp;

    // pre-compute indices,
    // reduce redundant computations inside the main convolution loop (faster)
    bx = w-1; by = imArea-w;
    // pre-compute indices,
    // reduce redundant computations inside the main convolution loop (faster)
    imageIndices1 = new A16I(ind1);
    for (k=0,matArea2=ind1.length; k<matArea2; k+=2) imageIndices1[k+1] *= w;
    imageIndices2 = new A16I(ind2);
    for (k=0,matArea2=ind2.length; k<matArea2; k+=2) imageIndices2[k+1] *= w;

    // one horizontal and one vertical pass
    numPasses = 2;
    mat = matrix;
    indices = ind1;
    coeff = coeff1;
    imageIndices = imageIndices1;
    dst = im; im = new IMG(imLen);

    if (MODE.GRAY === mode)
    {
        while (numPasses--)
        {
            tmp = im; im = dst; dst = tmp;
            matArea = mat.length;
            matArea2 = indices.length;

            // do direct convolution
            x=0; ty=0;
            for (i=0; i<imLen; i+=ii, ++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; ++k, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt;
                    }
                }

                // output
                t0 = coeff * r;
                dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            // do another pass??
            mat = matrix2;
            indices = ind2;
            coeff = coeff2;
            imageIndices = imageIndices2;
        }
    }
    else
    {
        while (numPasses--)
        {
            tmp = im; im = dst; dst = tmp;
            matArea = mat.length;
            matArea2 = indices.length;

            // do direct convolution
            x=0; ty=0;
            for (i=0; i<imLen; i+=ii, ++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; ++k, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        //a += im[srcOff+3] * wt;
                    }
                }

                // output
                t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            // do another pass??
            mat = matrix2;
            indices = ind2;
            coeff = coeff2;
            imageIndices = imageIndices2;
        }
    }
    return dst;
}
function separable_convolution_clamp(mode, im, w, h, stride, matrix, matrix2, ind1, ind2, coeff1, coeff2)
{
    //"use asm";
    var imLen=im.length, imArea=imLen>>>stride,
        matArea, mat, indices, matArea2,
        dst, imageIndices, imageIndices1, imageIndices2,
        i, j, k, x, ty, ty2, ii = 1<<stride,
        xOff, yOff, srcOff, bx, by, t0, t1, t2, t3, wt,
        r, g, b, a, coeff, numPasses, tmp;

    // pre-compute indices,
    // reduce redundant computations inside the main convolution loop (faster)
    bx = w-1; by = imArea-w;
    // pre-compute indices,
    // reduce redundant computations inside the main convolution loop (faster)
    imageIndices1 = new A16I(ind1);
    for (k=0,matArea2=ind1.length; k<matArea2; k+=2) imageIndices1[k+1] *= w;
    imageIndices2 = new A16I(ind2);
    for (k=0,matArea2=ind2.length; k<matArea2; k+=2) imageIndices2[k+1] *= w;

    // one horizontal and one vertical pass
    numPasses = 2;
    mat = matrix;
    indices = ind1;
    coeff = coeff1;
    imageIndices = imageIndices1;
    dst = im; im = new IMG(imLen);

    if (MODE.GRAY === mode)
    {
        while (numPasses--)
        {
            tmp = im; im = dst; dst = tmp;
            matArea = mat.length;
            matArea2 = indices.length;

            // do direct convolution
            x=0; ty=0;
            for (i=0; i<imLen; i+=ii, ++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; ++k, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt;
                    }
                }

                // output
                t0 = coeff * r;
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            // do another pass??
            mat = matrix2;
            indices = ind2;
            coeff = coeff2;
            imageIndices = imageIndices2;
        }
    }
    else
    {
        while (numPasses--)
        {
            tmp = im; im = dst; dst = tmp;
            matArea = mat.length;
            matArea2 = indices.length;

            // do direct convolution
            x=0; ty=0;
            for (i=0; i<imLen; i+=ii, ++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; ++k, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        //a += im[srcOff+3] * wt;
                    }
                }

                // output
                t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            // do another pass??
            mat = matrix2;
            indices = ind2;
            coeff = coeff2;
            imageIndices = imageIndices2;
        }
    }
    return dst;
}
function histogram(im, channel, cdf)
{
    channel = channel || 0;
    var h = new A32F(256), v, i, l = im.length,
        accum = 0, min = 255, max = 0;
    for (i=0; i<l; i+=4)
    {
        v = im[i+channel];
        ++h[v];
        min = Min(v, min);
        max = Max(v, max);
    }
    if (cdf)
    {
        for (i=0; i<256; )
        {
            // partial loop unrolling
            accum += h[i]; h[i++] = accum;
            accum += h[i]; h[i++] = accum;
            accum += h[i]; h[i++] = accum;
            accum += h[i]; h[i++] = accum;
        }
    }
    return {bin:h, channel:channel, min:min, max:max, total:l>>>2};
}
function otsu(bin, tot, min, max)
{
    var omega0, omega1,
        mu0, mu1, mu,
        sigmat, sigma,
        sum0, isum0, i, t;

    if (null == min) min = 0;
    if (null == max) max = 255;
    for (mu=0,i=min; i<=max; ++i) mu += i*bin[i]/tot;
    t = min;
    sum0 = bin[min];
    isum0 = min*bin[min]/tot;
    omega0 = sum0/tot;
    omega1 = 1-omega0;
    mu0 = isum0/omega0;
    mu1 = (mu - isum0)/omega1;
    sigmat = omega0*omega1*Pow(mu1 - mu0, 2);
    for (i=min+1; i<=max; ++i)
    {
        sum0 += bin[i];
        isum0 += i*bin[i]/tot;
        omega0 = sum0/tot;
        omega1 = 1-omega0;
        mu0 = isum0/omega0;
        mu1 = (mu - isum0)/omega1;
        sigma = omega0*omega1*Pow(mu1 - mu0, 2);
        if (sigma > sigmat)
        {
            sigmat = sigma;
            t = i;
        }
    }
    return t;
}
var SIN = {}, COS = {};
function sine(i)
{
    var sin_i;
    /*if (i < 500)
    {*/
        sin_i = SIN[i];
        if (null == sin_i) SIN[i] = sin_i = stdMath.sin(PI/i);
        return sin_i;
    /*}
    return stdMath.sin(PI/i);*/
}
function cosine(i)
{
    var cos_i;
    /*if (i < 500)
    {*/
        cos_i = COS[i];
        if (null == cos_i) COS[i] = cos_i = stdMath.cos(PI/i);
        return cos_i;
    /*}
    return stdMath.cos(PI/i);*/
}
function bitrevidx(idx, n)
{
    var rev_idx = 0;

    while (1 < n)
    {
        rev_idx <<= 1;
        rev_idx += idx & 1;
        idx >>= 1;
        n >>= 1;
    }
    return rev_idx;
}
function bitrev(re, im, re2, im2, n)
{
    var done = {}, i, j, t;

    for (i = 0; i < n; ++i)
    {
        if (1 === done[i]) continue;

        j = bitrevidx(i, n);

        t = re[j];
        re2[j] = re[i];
        re2[i] = t;
        t = im[j];
        im2[j] = im[i];
        im2[i] = t;

        done[j] = 1;
    }
}
function first_odd_fac(n)
{
    var sqrt_n = stdMath.sqrt(n), f = 3;

    while (f <= sqrt_n)
    {
        if (0 === (n % f)) return f;
        f += 2;
    }
    return n;
}
function _fft1(re, im, n, inv, output_re, output_im)
{
    // adapted from https://github.com/dntj/jsfft
    if (0 >= n) return;
    var ret = false;
    if (null == output_re)
    {
        output_re = (new re.constructor(n));
        output_im = (new im.constructor(n));
        ret = true;
    }
    if (n & (n - 1)) _fft1_r(re, im, n, inv, output_re, output_im)
    else _fft1_i(re, im, n, inv, output_re, output_im);
    if (ret) return {r:output_re, i:output_im};
}
function _fft1_r(re, im, n, inv, output_re, output_im)
{
    var i, j, t;
    if (1 === n)
    {

        output_re[0] = (re[0] || 0);
        output_im[0] = (im[0] || 0);
        return;
    }
    for (i = 0; i < n; ++i)
    {
        output_re[i] = 0/*re[i]*/;
        output_im[i] = 0/*im[i]*/;
    }

    // Use the lowest odd factor, so we are able to use _fft_i in the
    // recursive transforms optimally.
    var p = first_odd_fac(n), m = n / p,
        normalisation = 1 / stdMath.sqrt(p),
        recursive_result_re = new re.constructor(m),
        recursive_result_im = new im.constructor(m),
        recursive_result2_re = new re.constructor(m),
        recursive_result2_im = new im.constructor(m),
        del_f_r, del_f_i, f_r, f_i, _real, _imag;

    // Loops go like O(n Σ p_i), where p_i are the prime factors of n.
    // for a power of a prime, p, this reduces to O(n p log_p n)
    for (j = 0; j < p; ++j)
    {
        for (i = 0; i < m; ++i)
        {
            recursive_result_re[i] = (re[i * p + j] || 0);
            recursive_result_im[i] = (im[i * p + j] || 0);
        }
        // Don't go deeper unless necessary to save allocs.
        if (m > 1)
        {
            _fft1(recursive_result_re, recursive_result_im, m, inv, recursive_result2_re, recursive_result2_im);
            t = recursive_result_re;
            recursive_result_re = recursive_result2_re;
            recursive_result2_re = t;
            t = recursive_result_im;
            recursive_result_im = recursive_result2_im;
            recursive_result2_im = t;
        }

        del_f_r = stdMath.cos(2*PI*j/n);
        del_f_i = (inv ? -1 : 1) * stdMath.sin(2*PI*j/n);
        f_r = 1;
        f_i = 0;

        for (i = 0; i < n; ++i)
        {
            _real = normalisation * recursive_result_re[i % m];
            _imag = normalisation * recursive_result_im[i % m];

            output_re[i] += (f_r * _real - f_i * _imag);
            output_im[i] += (f_r * _imag + f_i * _real);

            _real = f_r * del_f_r - f_i * del_f_i;
            _imag = f_i = f_r * del_f_i + f_i * del_f_r;
            f_r = _real;
            f_i = _imag;
        }
    }

    /*for (i = 0; i < n; ++i)
    {
        output_re[i] *= normalisation;
        output_im[i] *= normalisation;
    }*/
}
function _fft1_i(re, im, n, inv, output_re, output_im)
{
    // Loops go like O(n log n):
    //   w ~ log n; i,j ~ n
    var w = 1, del_f_r, del_f_i, i, k, j, t, s,
        f_r, f_i, l_index, r_index,
        left_r, left_i, right_r, right_i;
    bitrev(re, im, output_re, output_im, n);
    while (w < n)
    {
        del_f_r = cosine(w);
        del_f_i = (inv ? -1 : 1) * sine(w);
        k = n/(2*w);
        for (i = 0; i < k; ++i)
        {
            f_r = 1;
            f_i = 0;
            for (j = 0; j < w; ++j)
            {
                l_index = 2*i*w + j;
                r_index = l_index + w;

                left_r = (output_re[l_index] || 0);
                left_i = (output_im[l_index] || 0);
                t = (output_re[r_index] || 0);
                s = (output_im[r_index] || 0);
                right_r = f_r * t - f_i * s;
                right_i = f_i * t + f_r * s;

                output_re[l_index] = SQRT1_2 * (left_r + right_r);
                output_im[l_index] = SQRT1_2 * (left_i + right_i);
                output_re[r_index] = SQRT1_2 * (left_r - right_r);
                output_im[r_index] = SQRT1_2 * (left_i - right_i);

                t = f_r * del_f_r - f_i * del_f_i;
                s = f_r * del_f_i + f_i * del_f_r;
                f_r = t;
                f_i = s;
            }
        }
        w <<= 1;
    }
}
function _fft2(re, im, nx, ny, inv, output_re, output_im)
{
    // adapted from https://github.com/dntj/jsfft
    if (0 >= nx || 0 >= ny) return;
    var ret = false,
        RE = re.constructor, IM = im.constructor,
        n = nx * ny, i, j, jn,
        row_re = new RE(nx), row_im = new IM(nx),
        col_re = new RE(ny), col_im = new IM(ny),
        frow_re = new RE(nx), frow_im = new IM(nx),
        fcol_re = new RE(ny), fcol_im = new IM(ny);

    if (null == output_re)
    {
        output_re = new RE(n);
        output_im = new IM(n);
        ret = true;
    }
    for (j = 0,jn = 0; j < ny; ++j,jn+=nx)
    {
        for (i = 0; i < nx; ++i)
        {
            row_re[i] = (re[i + jn] || 0);
            row_im[i] = (im[i + jn] || 0);
        }
        _fft1(row_re, row_im, nx, inv, frow_re, frow_im);
        for (i = 0; i < nx; ++i)
        {
            output_re[i + jn] = frow_re[i];
            output_im[i + jn] = frow_im[i];
        }
    }
    for (i = 0; i < nx; ++i)
    {
        for (j = 0,jn = 0; j < ny; ++j,jn+=nx)
        {
            col_re[j] = output_re[i + jn];
            col_im[j] = output_im[i + jn];
        }
        _fft1(col_re, col_im, ny, inv, fcol_re, fcol_im);
        for (j = 0,jn = 0; j < ny; ++j,jn+=nx)
        {
            output_re[i + jn] = fcol_re[j];
            output_im[i + jn] = fcol_im[j];
        }
    }

    if (ret) return {r:output_re, i:output_im};
}
function min_max_loc(data, w, h, tlo, thi, stride, offset)
{
    stride = stride || 1;
    offset = offset || 0;
    var k, l = data.length, x, y, d, minmax = {min:Infinity, max:-Infinity, minpos:[], maxpos:[]};
    for (k=0,y=0,x=0; k<l; k+=stride,++x)
    {
        if (x >= w) {x=0; ++y};
        d = data[k+offset];
        if ((d <= minmax.min) && (null == tlo || d <= tlo))
        {
            if (d < minmax.min)
            {
                minmax.min = d;
                minmax.minpos = [];
            }
            minmax.minpos.push({x:x, y:y});
        }
        if ((d >= minmax.max) && (null == thi || d >= thi))
        {
            if (d > minmax.max)
            {
                minmax.max = d;
                minmax.maxpos = [];
            }
            minmax.maxpos.push({x:x, y:y});
        }
    }
    return minmax;
}

function ct_eye(c1, c0)
{
    if (null == c0) c0 = 0;
    if (null == c1) c1 = 1;
    var i, t = new ColorTable(256);
    if ("function" === typeof c1)
    {
        for (i=0; i<256; ++i)
        {
            t[i   ] = clamp(c1(i   ),0,255)|0;
        }
    }
    else
    {
        for (i=0; i<256; ++i)
        {
            t[i   ] = clamp(c0 + c1*(i   ),0,255)|0;
        }
    }
    return t;
}
// multiply (functionaly compose) 2 Color Tables
function ct_multiply(ct2, ct1)
{
    var i, ct12 = new ColorTable(256);
    for (i=0; i<256; ++i)
    {
        ct12[i   ] = clamp(ct2[clamp(ct1[i   ],0,255)],0,255);
    }
    return ct12;
}
function cm_eye()
{
    return new ColorMatrix([
    1,0,0,0,0,
    0,1,0,0,0,
    0,0,1,0,0,
    0,0,0,1,0
    ]);
}
// multiply (functionaly compose, matrix multiply) 2 Color Matrices
/*
[ rr rg rb ra roff
  gr gg gb ga goff
  br bg bb ba boff
  ar ag ab aa aoff
  0  0  0  0  1 ]
*/
function cm_multiply(cm1, cm2)
{
    var cm12 = new ColorMatrix(20), i;

    for (i=0; i<20; i+=5)
    {
        cm12[i+0] = cm2[i]*cm1[0] + cm2[i+1]*cm1[5] + cm2[i+2]*cm1[10] + cm2[i+3]*cm1[15];
        cm12[i+1] = cm2[i]*cm1[1] + cm2[i+1]*cm1[6] + cm2[i+2]*cm1[11] + cm2[i+3]*cm1[16];
        cm12[i+2] = cm2[i]*cm1[2] + cm2[i+1]*cm1[7] + cm2[i+2]*cm1[12] + cm2[i+3]*cm1[17];
        cm12[i+3] = cm2[i]*cm1[3] + cm2[i+1]*cm1[8] + cm2[i+2]*cm1[13] + cm2[i+3]*cm1[18];
        cm12[i+4] = cm2[i]*cm1[4] + cm2[i+1]*cm1[9] + cm2[i+2]*cm1[14] + cm2[i+3]*cm1[19] + cm2[i+4];
    }
    return cm12;
}
function cm_rechannel(m, Ri, Gi, Bi, Ai, Ro, Go, Bo, Ao)
{
    var cm = new ColorMatrix(20), RO = Ro*5, GO = Go*5, BO = Bo*5, AO = Ao*5;
    cm[RO+Ri] = m[0 ]; cm[RO+Gi] = m[1 ]; cm[RO+Bi] = m[2 ]; cm[RO+Ai] = m[3 ]; cm[RO+4] = m[4 ];
    cm[GO+Ri] = m[5 ]; cm[GO+Gi] = m[6 ]; cm[GO+Bi] = m[7 ]; cm[GO+Ai] = m[8 ]; cm[GO+4] = m[9 ];
    cm[BO+Ri] = m[10]; cm[BO+Gi] = m[11]; cm[BO+Bi] = m[12]; cm[BO+Ai] = m[13]; cm[BO+4] = m[14];
    cm[AO+Ri] = m[15]; cm[AO+Gi] = m[16]; cm[AO+Bi] = m[17]; cm[AO+Ai] = m[18]; cm[AO+4] = m[19];
    return cm;
}
/*
[ 0xx 1xy 2xo 3xor
  4yx 5yy 6yo 7yor
  0   0   1   0
  0   0   0   1 ]
*/
function am_multiply(am1, am2)
{
    var am12 = new AffineMatrix(8);
    am12[0] = am1[0]*am2[0] + am1[1]*am2[4];
    am12[1] = am1[0]*am2[1] + am1[1]*am2[5];
    am12[2] = am1[0]*am2[2] + am1[1]*am2[6] + am1[2];
    am12[3] = am1[0]*am2[3] + am1[1]*am2[7] + am1[3];

    am12[4] = am1[4]*am2[0] + am1[5]*am2[4];
    am12[5] = am1[4]*am2[1] + am1[5]*am2[5];
    am12[6] = am1[4]*am2[2] + am1[5]*am2[6] + am1[6];
    am12[7] = am1[4]*am2[3] + am1[5]*am2[7] + am1[7];
    return am12;
}
function am_eye()
{
    return new AffineMatrix([
    1,0,0,0,
    0,1,0,0
    ]);
}
function cm_combine(m1, m2, a1, a2, matrix)
{
    matrix = matrix || Array; a1 = a1 || 1; a2 = a2 || 1;
    for (var i=0,d=m1.length,m12=new matrix(d); i<d; ++i) m12[i] = a1 * m1[i] + a2 * m2[i];
    return m12;
}
function cm_convolve(cm1, cm2, matrix)
{
    matrix = matrix || Array/*ConvolutionMatrix*/;
    if (cm2 === +cm2) cm2 = [cm2];
    var i, j, p, d1 = cm1.length, d2 = cm2.length, cm12 = new matrix(d1*d2);
    for (i=0,j=0; i<d1; )
    {
        cm12[i*d2+j] = cm1[i]*cm2[j];
        if (++j >= d2) {j=0; ++i;}
    }
    return cm12;
}

ArrayUtil.typed = FILTER.Browser.isNode ? function(a, A) {
    if ((null == a) || (a instanceof A)) return a;
    else if (Array.isArray(a)) return Array === A ? a : new A(a);
    if (null == a.length) a.length = Object.keys(a).length;
    return Array === A ? Array.prototype.slice.call(a) : new A(Array.prototype.slice.call(a));
} : function(a, A) {return a;};
ArrayUtil.typed_obj = FILTER.Browser.isNode ? function(o, unserialise) {
    return null == o ? o : (unserialise ? JSON.parse(o) : JSON.stringify(o));
} : function(o) {return o;};
ArrayUtil.arrayset_shim = arrayset_shim;
ArrayUtil.arrayset = ArrayUtil.hasArrayset ? function(a, b, offset) {a.set(b, offset||0);} : arrayset_shim;
ArrayUtil.subarray = ArrayUtil.hasSubarray ? function(a, i1, i2) {return a.subarray(i1, i2);} : function(a, i1, i2){ return a.slice(i1, i2); };


MathUtil.clamp = clamp;
MathUtil.hypot = hypot;

StringUtil.esc = esc;
StringUtil.trim = String.prototype.trim
? function(s) {return s.trim();}
: function(s) {return s.replace(trim_re, '');};
StringUtil.function_body = function_body;

ImageUtil.crop = ArrayUtil.hasArrayset ? crop : crop_shim;
ImageUtil.pad = ArrayUtil.hasArrayset ? pad : pad_shim;
ImageUtil.interpolate_nearest = interpolate_nearest;
ImageUtil.interpolate = ImageUtil.interpolate_bilinear = interpolate_bilinear;
ImageUtil.glsl = image_glsl;

FilterUtil.ct_eye = ct_eye;
FilterUtil.ct_multiply = ct_multiply;
FilterUtil.cm_eye = cm_eye;
FilterUtil.cm_multiply = cm_multiply;
FilterUtil.cm_rechannel = cm_rechannel;
FilterUtil.am_eye = am_eye;
FilterUtil.am_multiply = am_multiply;
FilterUtil.cm_combine = cm_combine;
FilterUtil.cm_convolve = cm_convolve;
FilterUtil.gaussian = gaussian;
FilterUtil.integral_convolution = notSupportClamp ? integral_convolution_clamp : integral_convolution;
FilterUtil.separable_convolution = notSupportClamp ? separable_convolution_clamp : separable_convolution;
FilterUtil.gradient = gradient;
FilterUtil.optimum_gradient = optimum_gradient;
FilterUtil.gradient_glsl = gradient_glsl;
FilterUtil.sat = integral2;
FilterUtil.histogram = histogram;
FilterUtil.otsu = otsu;
FilterUtil.fft1d = function(re, im, n) {return _fft1(re, im, n, false);};
FilterUtil.ifft1d = function(re, im, n) {return _fft1(re, im, n, true);};
FilterUtil.fft2d = function(re, im, nx, ny) {return _fft2(re, im, nx, ny, false);};
FilterUtil.ifft2d = function(re, im, nx, ny) {return _fft2(re, im, nx, ny, true);};
FilterUtil.minmaxloc = min_max_loc;
FilterUtil._wasm = function() {
    return {imports:{},exports:{
        interpolate_nearest:{inputs: [{arg:0,type:FILTER.ImArray}], output: {type:FILTER.ImArray}},
        interpolate_bilinear:{inputs: [{arg:0,type:FILTER.ImArray}], output: {type:FILTER.ImArray}},
        integral_convolution:{inputs: [{arg:1,type:FILTER.ImArray},{arg:5,type:FILTER.Array32F},{arg:6,type:FILTER.Array32F}], output: {type:FILTER.ImArray}},
        separable_convolution:{inputs: [{arg:1,type:FILTER.ImArray},{arg:5,type:FILTER.Array32F},{arg:6,type:FILTER.Array32F},{arg:7,type:FILTER.Array16I},{arg:8,type:FILTER.Array16I}], output: {type:FILTER.ImArray}},
        histogram:{inputs: [{arg:0,type:FILTER.ImArray}], output: {struct:{
            bin: {type:FILTER.A32F, offset:0},
            channel: {type:'i32', offset:4},
            min: {type:'i32', offset:8},
            max: {type:'i32', offset:12},
            total: {type:'i32', offset:16}
        }}},
        gaussian:{inputs: [], output: {type:FILTER.Array32F}},
        gradient:{inputs: [{arg:0,type:FILTER.ImArray}], output: {type:FILTER.ImArray}},
        optimum_gradient:{inputs: [{arg:0,type:FILTER.Array32F},{arg:1,type:FILTER.Array32F},{arg:2,type:FILTER.ImArray}], output: {type:FILTER.ImArray}}
    },wasm:'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'};
};
}(FILTER);/**
*
* Filter GLSL Utils
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var proto = 'prototype',
    stdMath = Math,
    HAS = Object.prototype.hasOwnProperty,
    trim = FILTER.Util.String.trim,
    GLSL = FILTER.Util.GLSL || {},
    A32F = FILTER.Array32F, A32I = FILTER.Array32I,
    VERTEX_DEAULT = trim([
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'attribute vec2 pos;',
    'attribute vec2 uv;',
    'uniform vec2 resolution;',
    '/*uniform float flipY;*/',
    'varying vec2 pix;',
    'void main(void) {',
        'vec2 zeroToOne = pos / resolution;',
        'vec2 zeroToTwo = zeroToOne * 2.0;',
        'vec2 clipSpace = zeroToTwo - 1.0;',
        'gl_Position = vec4(clipSpace * vec2(1.0, /*flipY*/1.0), 0.0, 1.0);',
        'pix = uv;',
    '}'
    ].join('\n')),
    FRAGMENT_DEFAULT = trim([
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'void main(void) {',
        'gl_FragColor = texture2D(img, pix);',
    '}',
    ].join('\n')),
    PRECISION = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif'
    ].join('\n'),
    COMMENTS = /\/\*.*?\*\//gmi,
    LINE_COMMENTS = /\/\/.*?$/gmi,
    ATTRIBUTE = /\battribute\s+(\w+)\s+(\w+)\s*(\[)?/gi,
    UNIFORM = /\buniform\s+(\w+)\s+(\w+)\s*(\[)?/gi
;

GLSL.DEFAULT = FRAGMENT_DEFAULT;

function extract(source, type, store)
{
    var r = type/*new RegExp('\\b' + type + '\\s+(\\w+)\\s+(\\w+)\\s*(\\[)?', 'ig')*/;
    source.replace(COMMENTS, '').replace(LINE_COMMENTS, '').replace(r, function(match, typeName, varName, bracket) {
        store[varName] = {name:varName, type:typeName+(bracket||''), loc:0};
        return match;
    });
    return store;
}
function compile(gl, source, type)
{
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    /*if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        FILTER.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }*/
    return shader;
}
function GLSLProgram(fragmentSource, gl)
{
    var self = this, vsh, fsh, a, u;

    if (-1 === fragmentSource.indexOf('precision '))
        fragmentSource = PRECISION + '\n' + fragmentSource;
    self.vertexSource = VERTEX_DEAULT;
    self.fragmentSource = fragmentSource;

    vsh = compile(gl, self.vertexSource, gl.VERTEX_SHADER);
    fsh = compile(gl, self.fragmentSource, gl.FRAGMENT_SHADER);
    self.id = gl.createProgram();
    gl.attachShader(self.id, vsh);
    gl.attachShader(self.id, fsh);
    gl.linkProgram(self.id);
    if (!gl.getProgramParameter(self.id, gl.LINK_STATUS) && !gl.isContextLost())
    {
        FILTER.error(gl.getProgramInfoLog(self.id));
        FILTER.error(gl.getShaderInfoLog(vsh));
        FILTER.error(gl.getShaderInfoLog(fsh));
        FILTER.log(fragmentSource);
        gl.deleteShader(vsh);
        gl.deleteShader(fsh);
        gl.deleteProgram(self.id);
        self.id = null;
    }
    else
    {
        self.uniform = {};
        self.attribute = {};
        // extract attributes
        extract(self.vertexSource, ATTRIBUTE, self.attribute);
        // extract uniforms
        extract(self.vertexSource, UNIFORM, self.uniform);
        extract(self.fragmentSource, UNIFORM, self.uniform);
        for (a in self.attribute) self.attribute[a].loc = gl.getAttribLocation(self.id, a);
        for (u in self.uniform) self.uniform[u].loc = gl.getUniformLocation(self.id, u);
    }
    // release references
    vsh = fsh = gl = null;
}
GLSLProgram[proto] = {
    constructor: GLSLProgram,
    id: null,
    uniform: null,
    attribute: null,
    vertexSource: null,
    fragmentSource: null
};
function getProgram(gl, shader, programCache)
{
    shader = trim(shader);
    var program = programCache ? programCache[shader] : null;
    // new program
    if (!program)
    {
        program = new GLSLProgram(shader, gl);
        if (programCache) programCache[shader] = program;
    }
    return program;
}
function GLSLFilter(filter)
{
    var self = this, glsls = [], glsl = null, shaders = {}, io = {},
        prev_output = function(glsl) {
            return glsl._prev && glsl._prev._output && HAS.call(io, glsl._prev._output) ? io[glsl._prev._output] : null;
        };
    self.begin = function() {
        glsl = {
        _prev: null,
        _next: null,
        _save: null,
        _inputs: {},
        _input: 'img', // main input (texture) is named 'img' by default
        _output: null,
        io: function() {return io;},
        iterations: 1,
        instance: filter,
        shader: null,
        program: null,
        /*getProgram: function(gl, cache) {
            this.program = this.shader ? getProgram(gl, this.shader, cache) : null;
            return this.program;
        },*/
        init: function(gl, im, wi, hi, fromshader, cache) {
            this.program = this.shader && this.shader.substring ? getProgram(gl, this.shader, cache) : null;
            if (this.program && this.program.id)
            {
                if (this._save) io[this._save] = prev_output(this) || {name:this._save, tex:null, data:fromshader ? getPixels(gl, wi, hi) : FILTER.Util.Array.copy(im), width:wi, height:hi};
            }
        },
        inputs: function(gl, w, h, wi, hi, input) {
            var this_ = this,
                inputs = this_._inputs || {},
                main_input = this_._input,
                program = this_.program,
                uniform = program.uniform,
                unit = 0;
            Object.keys(inputs).forEach(function(i) {
                if (('*' === i) && inputs['*'].setter)
                {
                    input = inputs['*'].setter(filter, w, h, wi, hi, io, gl, program, input) || input;
                }
                else if (HAS.call(uniform, i) || HAS.call(uniform, inputs[i].iname))
                {
                    var inp = inputs[i], name = HAS.call(uniform, inp.name) ? inp.name : inp.iname,
                        type = uniform[name].type, loc = uniform[name].loc,
                        value = !inp.setter && HAS.call(io, inp.name) ? io[inp.name] : inp.setter(filter, w, h, wi, hi, io);
                    if ('sampler2D' === type)
                    {
                        // texture
                        if (main_input === inp.iname)
                        {
                            if (!inp.setter && this_._prev && (inp.name === this_._prev._output))
                            {
                                /* prev output is passed as main input by default */
                            }
                            else
                            {
                                // upload data
                                if (!value.tex) value.tex = uploadTexture(gl, value.data, value.width, value.height);
                                input = {fbo:null, tex:value.tex, w:value.width, h:value.height};
                            }
                            //gl.uniform1i(loc, 0);
                        }
                        else
                        {
                            ++unit;
                            if (!value.tex)
                            {
                                value.tex = uploadTexture(gl, value.data, value.width, value.height, unit);
                            }
                            else
                            {
                                gl.activeTexture(gl.TEXTURE0 + unit);
                                gl.bindTexture(gl.TEXTURE_2D, value.tex);
                            }
                            gl.uniform1i(loc, unit);
                        }
                    }
                    else
                    {
                        // other uniform
                        switch (type)
                        {
                            case 'ivec4':
                            gl.uniform4iv(loc, new A32I(value || [0,0,0,0]));
                            break;
                            case 'vec4':
                            gl.uniform4fv(loc, new A32F(value || [0,0,0,0]));
                            break;
                            case 'ivec3':
                            gl.uniform3iv(loc, new A32I(value || [0,0,0]));
                            break;
                            case 'vec3':
                            gl.uniform3fv(loc, new A32F(value || [0,0,0]));
                            break;
                            case 'ivec2':
                            gl.uniform2iv(loc, new A32I(value || [0,0]));
                            break;
                            case 'vec2':
                            gl.uniform2fv(loc, new A32F(value || [0,0]));
                            break;
                            case 'int[':
                            gl.uniform1iv(loc, new A32I(value || [0]));
                            break;
                            case 'float[':
                            gl.uniform1fv(loc, new A32F(value || [0]));
                            break;
                            case 'int':
                            gl.uniform1i(loc, value || 0);
                            break;
                            case 'float':
                            default:
                            gl.uniform1f(loc, value || 0);
                            break;
                        }
                    }
                }
            });
            return input;
        },
        output: function(gl, output) {
            if (this._islast)
            {
                for (var i in io) if (io[i].name && io[i].data) {deleteTexture(gl, io[i].tex); io[i].tex = null; io[i].data = null;}
                io = {};
            }
            else if (this._output)
            {
                io[this._output] = {name:this._output, tex:null, data:getPixels(gl, output.w, output.h), width:output.w, height:output.h};
            }
        },
        _islast: true
        };
        return self;
    };
    self.shader = function(shader, iterations, name) {
        if (glsl)
        {
            if (shader && HAS.call(shaders, shader)) shader = shaders[shader];
            if (name && shader) shaders[name] = shader;
            glsl.shader = shader || null;
            glsl.iterations = iterations || 1;
        }
        return self;
    };
    self.dimensions = function(df) {
        if (glsl && df) glsl.dimensions = function(w, h) {return df(w, h, io);};
        return self;
    };
    self.save = function(name) {
        if (glsl && name) glsl._save = name;
        return self;
    };
    self.input = function(name, setter, iname) {
        if (glsl && name)
        {
            if (true === setter) glsl._input = name; // set main input name if other than the default
            else glsl._inputs[name] = {name:name, setter:setter, iname:iname||name};
        }
        return self;
    };
    self.output = function(name) {
        if (glsl && name) glsl._output = name;
        return self;
    };
    self.end = function() {
        if (glsl)
        {
            if (glsls.length)
            {
                glsl._prev = glsls[glsls.length-1];
                glsls[glsls.length-1]._next = glsl;
                glsls[glsls.length-1]._islast = false;
            }
            glsls.push(glsl);
        }
        glsl = null;
        return self;
    };
    self.code = function() {
        return glsls;
    };
}
GLSLFilter[proto] = {
    constructor: GLSLFilter,
    begin: null,
    shader: null,
    dimensions: null,
    save: null,
    input: null,
    output: null,
    end: null,
    code: null
};
function createTexture(gl, width, height)
{
    var tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (width && height) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    return tex;
}
function deleteTexture(gl, tex)
{
    if (tex)
    {
        gl.deleteTexture(tex);
        tex = null;
    }
}
function copyTexture(gl, width, height)
{
    var tex = createTexture(gl, width, height);
    gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, width, height, 0);
    return tex;
}
function uploadDataToTexture(gl, pixels, width, height, tex)
{
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    //gl.bindTexture(gl.TEXTURE_2D, null);
    return tex;
}
function uploadTexture(gl, pixels, width, height, index, useSub, _tex)
{
    var tex = null != _tex ? _tex : createTexture(gl, width, height);
    if (null != index)
    {
        gl.activeTexture(gl.TEXTURE0 + index);
        gl.bindTexture(gl.TEXTURE_2D, tex);
    }
    else if (null != _tex)
    {
        gl.bindTexture(gl.TEXTURE_2D, tex);
    }
    if (useSub)
    {
                    // target, level, xoffset, yoffset, width, height, format, type, pixels
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }
    else
    {
                    // target, level, internalformat, width, height, border, format, type, pixels
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    }
    /*if (null != index)
    {
        gl.bindTexture(gl.TEXTURE_2D, null);
    }*/
    return tex;
}
function createFramebufferTexture(gl, width, height)
{
    var tex = createTexture(gl, width, height);

    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);

    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return {fbo: fbo, tex: tex, w: width, h: height};
}
function unbindFramebufferTexture(gl, buf)
{
    if (buf.fbo)
    {
        gl.bindFramebuffer(gl.FRAMEBUFFER, buf.fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, null, 0);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    return buf;
}
function deleteFramebuffer(gl, fbo)
{
    if (fbo)
    {
        gl.deleteFramebuffer(fbo);
        fbo = null;
    }
}
function deleteFramebufferTexture(gl, buf)
{
    if (buf)
    {
        if (buf.fbo)
        {
            unbindFramebufferTexture(gl, buf);
            deleteFramebuffer(gl, buf.fbo);
        }
        if (buf.tex) deleteTexture(gl, buf.tex);
        buf.fbo = null;
        buf.tex = null;
        //buf = null;
    }
}
function createBuffer(gl, data)
{
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, data || null, gl.STATIC_DRAW);
    return buf;
}
function deleteBuffer(gl, buf)
{
    if (buf)
    {
        gl.deleteBuffer(buf);
        buf = null;
    }
}
function getPixels(gl, width, height, pixels)
{
    pixels = pixels || new FILTER.ImArray((width * height) << 2);
                    //x, y, width, height, format, type, pixels
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return pixels;
}
function prepareGL(img, ws, hs)
{
    var DPR = 1/*FILTER.devicePixelRatio*/;
    if (null == ws && null == hs)
    {
        if (img.selection)
        {
            var sel = img.selection,
                ow = img.width-1,
                oh = img.height-1,
                xs = sel[0],
                ys = sel[1],
                xf = sel[2],
                yf = sel[3],
                fx = sel[4] ? ow : 1,
                fy = sel[4] ? oh : 1;
            xs = DPR*stdMath.floor(xs*fx); ys = DPR*stdMath.floor(ys*fy);
            xf = DPR*stdMath.floor(xf*fx); yf = DPR*stdMath.floor(yf*fy);
            ws = xf-xs+DPR; hs = yf-ys+DPR;
        }
        else
        {
            ws = img.oCanvas.width;
            hs = img.oCanvas.height;
        }
    }
    return FILTER.getGL(img, ws, hs);
}
function runOne(gl, glsl, pos, uv, input, output, buf /*, flipY*/)
{
    var w = output.w, h = output.h,
        wi = input.w, hi = input.h,
        iterations = ('function' === typeof glsl.iterations ? glsl.iterations(w, h, wi, hi) : glsl.iterations) || 1,
        program = glsl.program,
        uniform = program.uniform,
        attribute = program.attribute,
        i, src, dst, t, flip = false, last = iterations - 1;

    if (gl.isContextLost && gl.isContextLost()) return true;

    gl.useProgram(glsl.program.id);
    if (HAS.call(attribute, 'pos'))
    {
        gl.enableVertexAttribArray(attribute.pos.loc);
        gl.bindBuffer(gl.ARRAY_BUFFER, pos);
        gl.vertexAttribPointer(attribute.pos.loc, 2, gl.FLOAT, false, 0, 0);
    }
    if (HAS.call(attribute, 'uv'))
    {
        gl.enableVertexAttribArray(attribute.uv.loc);
        gl.bindBuffer(gl.ARRAY_BUFFER, uv);
        gl.vertexAttribPointer(attribute.uv.loc, 2, gl.FLOAT, false, 0, 0);
    }
    if (HAS.call(uniform, 'resolution') && ('vec2' === uniform.resolution.type))
    {
        gl.uniform2f(uniform.resolution.loc, w, h);
    }
    if (HAS.call(uniform, 'dp') && ('vec2' === uniform.dp.type))
    {
        gl.uniform2f(uniform.dp.loc, 1/w, 1/h);
    }
    if (glsl.instance && HAS.call(uniform, 'mode') && ('int' === uniform.mode.type))
    {
        gl.uniform1i(uniform.mode.loc, glsl.instance.mode);
    }
    if (glsl.inputs)
    {
        input = glsl.inputs(gl, w, h, wi, hi, input);
    }

    if (iterations > 1)
    {
        buf[0] = buf[0] || createFramebufferTexture(gl, w, h);
        buf[1] = buf[1] || createFramebufferTexture(gl, w, h);
    }
    for (i=0; i<iterations; ++i)
    {
        if (gl.isContextLost && gl.isContextLost()) return true;
        if (0 === i)
        {
            src = input;
        }
        else
        {
            //buf[0] = buf[0] || createFramebufferTexture(gl, w, h);
            src = buf[0];
        }
        if (i === last)
        {
            dst = output;
            //flip = flipY;
        }
        else
        {
            //buf[1] = buf[1] || createFramebufferTexture(gl, w, h);
            dst = buf[1];
        }
        if (HAS.call(uniform, glsl._input))
        {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, src.tex);
            gl.uniform1i(uniform[glsl._input].loc, 0);
        }
        //gl.uniform1f(uniform.flipY.loc, flip ? -1 : 1);
        gl.bindFramebuffer(gl.FRAMEBUFFER, dst.fbo);
        gl.viewport(0, 0, w, h);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
        // swap buffers
        t = buf[0]; buf[0] = buf[1]; buf[1] = t;
        flip = false;
    }
    if (glsl.output)
    {
        glsl.output(gl, output);
    }
}
GLSL.run = function(img, filter, glsls, im, w, h, metaData) {
    var gl = prepareGL(img, w, h),
        input = null, output = null,
        i, n = glsls.length, glsl,
        pos, uv, src, dst,
        buf0, buf1, buf = [null, null],
        program, cache, im0, t,
        canRun, isContextLost,
        cleanUp, lost, resize, refreshBuffers,
        first = -1, last = -1,
        nw, nh, wi, hi, d, iter,
        fromshader = false, flipY = false;
    if (!gl) return;
    cleanUp = function() {
        // clean up
        deleteBuffer(gl, pos);
        deleteBuffer(gl, uv);
        deleteTexture(gl, input);
        deleteFramebufferTexture(gl, output);
        deleteFramebufferTexture(gl, buf[0]);
        deleteFramebufferTexture(gl, buf[1]);
        deleteFramebufferTexture(gl, buf0);
        deleteFramebufferTexture(gl, buf1);
        pos = null;
        uv = null;
        input = null;
        output = null;
        buf = null;
        buf0 = null;
        buf1 = null;
    };
    lost = function() {
        cleanUp();
        img.cache = {}; // need to recompile programs?
        FILTER.log('GL context lost on #'+img.id);
    };
    refreshBuffers = function(w, h, keepbuf, keepothers) {
        if (buf0 !== keepbuf) deleteFramebufferTexture(gl, buf0);
        if (buf1 !== keepbuf) deleteFramebufferTexture(gl, buf1);
        if (!keepothers)
        {
            deleteFramebufferTexture(gl, buf[0]);
            deleteFramebufferTexture(gl, buf[1]);
            buf = [null, null];
        }
        if (last > first && last > i)
        {
            if (buf0 !== keepbuf) buf0 = createFramebufferTexture(gl, w, h);
            if (buf1 !== keepbuf) buf1 = createFramebufferTexture(gl, w, h);
        }
    };
    resize = function(nw, nh, withBuffers) {
        if (w === nw && h === nh)  return;
        wi = w;
        hi = h;
        w = nw;
        h = nh;
        FILTER.setGLDimensions(img, w, h);
        deleteBuffer(gl, pos);
        pos = createBuffer(gl, new FILTER.Array32F([
            0, 0,
            w, 0,
            0, h,
            0, h,
            w, 0,
            w, h
        ]));
        gl.viewport(0, 0, w, h);
        if (withBuffers) refreshBuffers(w, h, null, false);
        if (filter.hasMeta)
        {
            filter.meta = filter.meta || {};
            filter.meta._IMG_WIDTH = w;
            filter.meta._IMG_HEIGHT = h;
        }
    };
    if (gl.isContextLost && gl.isContextLost()) return lost();
    for (i=0; i<n; ++i)
    {
        if (glsls[i].shader && 0 > first) first = i;
        if (glsls[n-1-i].shader && 0 > last) last = n-1-i;
        if (0 <= first && 0 <= last) break;
    }
    cache = img.cache;
    pos = createBuffer(gl, new FILTER.Array32F([
        0, 0,
        w, 0,
        0, h,
        0, h,
        w, 0,
        w, h
    ]));
    uv = createBuffer(gl, new FILTER.Array32F([
        0, 0,
        1, 0,
        0, 1,
        0, 1,
        1, 0,
        1, 1
    ]));
    gl.viewport(0, 0, w, h);
    if (last > first)
    {
        buf0 = createFramebufferTexture(gl, w, h);
        buf1 = createFramebufferTexture(gl, w, h);
    }
    wi = w; hi = h;
    for (i=0; i<n; ++i)
    {
        canRun = false;
        glsl = glsls[i];
        if (glsl.init) glsl.init(gl, im, wi, hi, fromshader, cache);
        if (glsl.program && glsl.program.id) canRun = true;
        if (canRun)
        {
            // gpu shader
            //if (wi !== w || hi !== h) refreshBuffers(w, h, buf1, true);
            iter = glsl.iterations || 0;
            if ('function' === typeof iter) iter = iter(w, h, wi, hi) || 0;
            if (1 > iter) continue;
            if (null != glsl.dimensions)
            {
                d = 'function' === typeof glsl.dimensions ? glsl.dimensions(w, h) : glsl.dimensions;
                nw = d[0]; nh = d[1];
                resize(nw, nh, false);
                if (wi !== w || hi !== h) refreshBuffers(w, h, buf0, false);
            }
            else
            {
                wi = w;
                hi = h;
            }
            if ((i === first) || !input)
            {
                if (!input) input = uploadTexture(gl, im, wi, hi, 0);
                src = {fbo:null, tex:input, w:wi, h:hi};
            }
            else
            {
                src = buf0;
            }
            if (i === last)
            {
                if (!output) output = createFramebufferTexture(gl, w, h);
                dst = output;
            }
            else
            {
                if (buf1.w !== w || buf1.h !== h)
                {
                    deleteFramebufferTexture(gl, buf1);
                    buf1 = createFramebufferTexture(gl, w, h);
                }
                dst = buf1;
            }
            if (!fromshader && (i > first) && src.fbo) uploadTexture(gl, im, src.w, src.h, 0, 0, src.tex);
            isContextLost = runOne(gl, glsl, pos, uv, src, dst, buf /*, false*/);
            if (isContextLost || (gl.isContextLost && gl.isContextLost())) return lost();
            // swap buffers
            t = buf0; buf0 = buf1; buf1 = t;
            fromshader = true;
        }
        else if ('function' === typeof glsl.shader)
        {
            // cpu shader
            im0 = fromshader ? getPixels(gl, w, h) : im;
            im = glsl.shader(glsl, im0, w, h);
            fromshader = false;
        }
        else if (glsl.instance && (glsl._apply || glsl.instance._apply_wasm || glsl.instance._apply))
        {
            // no glsl program, run js/wasm code instead
            im0 = fromshader ? getPixels(gl, w, h) : im;
            if (glsl._apply) im = glsl._apply(im0, w, h, metaData);
            else if (glsl.instance._apply_wasm) im = glsl.instance._apply_wasm(im0, w, h, metaData);
            else im = glsl.instance._apply(im0, w, h, metaData);
            if (glsl.instance.hasMeta && null != glsl.instance.meta._IMG_WIDTH && null != glsl.instance.meta._IMG_HEIGHT)
            {
                resize(glsl.instance.meta._IMG_WIDTH, glsl.instance.meta._IMG_HEIGHT, true);
            }
            fromshader = false;
        }
    }
    if (fromshader)
    {
        n = (w*h) << 2;
        if (im.length !== n) im = new FILTER.ImArray(n);
        getPixels(gl, w, h, im);
    }
    cleanUp();
    return im;
};
GLSL.uploadTexture = uploadTexture;
GLSL.getPixels = getPixels;
GLSL.formatFloat = function(x, signed) {
    var s = x.toString();
    return (signed ? (0 > x ? '' : '+') : '') + s + (-1 === s.indexOf('.') ? '.0' : '');
};
GLSL.formatInt = function(x, signed) {
    x = stdMath.floor(x);
    return (signed ? (0 > x ? '' : '+') : '') + x.toString();
};
function staticSwap(a, b, temp, output)
{
    return 'if ('+a+'>'+b+') {'+temp+'='+a+';'+a+'='+b+';'+b+'='+temp+';}';
}
GLSL.staticSort = function(items, temp, swap) {
    temp = temp || 'temp';
    swap = swap || staticSwap;
    var n = items.length, p, p2, k, k2, j, i, l, code = [];
    for (p=1; p<n; p=(p<<1))
    {
        p2 = (p << 1);
        for (k=p; k>=1; k=(k>>>1))
        {
            k2 = (k<<1);
            for (j=k%p; j<=(n-1-k); j+=k2)
            {
                for (i=0,l=stdMath.min(k-1, n-j-k-1); i<=l; ++i)
                {
                    if (stdMath.floor((i+j) / p2) === stdMath.floor((i+j+k) / p2))
                    {
                        code.push(swap(items[i+j], items[i+j+k], temp));
                    }
                }
            }
        }
    }
    return code;
};
GLSL.Filter = GLSLFilter;
GLSL.isSupported = FILTER.supportsGLSL();
GLSL.isLoaded = true;
FILTER.Util.GLSL = GLSL;
}(FILTER);/**
*
* Filter WASM Utils
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var WASM = FILTER.Util.WASM || {};

function base64ToArrayBuffer(base64)
{
    if (FILTER.Browser.isNode) return Buffer.from(base64, 'base64');
    var binaryString = atob(base64), bytes = new FILTER.Array8U(binaryString.length), i, l;
    for (i=0,l=binaryString.length; i<l; ++i) bytes[i] = binaryString.charCodeAt(i);
    return bytes.buffer;
}
function instantiate(base64, _imports, _exports)
{
    var imports, exports, memory,
        refcounts, __dataview;

    // helpers from assemblyscript
    function __liftRecord(struct, pointer)
    {
        // Hint: Opt-out from lifting as a record by providing an empty constructor
        if (!pointer) return null;
        var obj = {}, field;
        for (field in struct)
        {
            switch (struct[field].type)
            {
                case 'i32':
                obj[field] = __getI32(pointer + struct[field].offset);
                break;
                case 'f32':
                obj[field] = __getF32(pointer + struct[field].offset);
                break;
                default:
                if (FILTER.Array32F === struct[field].type || FILTER.Array32I === struct[field].type || FILTER.Array16I === struct[field].type || FILTER.Array8U === struct[field].type || FILTER.ImArray === struct[field].type)
                {
                    obj[field] = __liftTypedArray(struct[field].type, __getU32(pointer + struct[field].offset));
                }
                break;
            }
        }
        return obj;
    }
    function __liftTypedArray(constructor, pointer)
    {
        if (!pointer) return null;
        return (new constructor(
            memory.buffer,
            __getU32(pointer + 4),
            __dataview.getUint32(pointer + 8, true) / constructor.BYTES_PER_ELEMENT
        )).slice();
    }
    function __lowerTypedArray(constructor/*,id, align*/, values)
    {
        if (null == values) return 0;
        // id unique for each input class, bytesize<i32> = <32> + 7 >>> 3 = 4, align = 31 - (clz<i32>(byteSize)=32-3=29)=2 same for each input class
        var id = 4, align = 0;
        if (FILTER.Array16I === constructor)
        {
            id = 6; align = 1;
        }
        else if (FILTER.Array32I === constructor)
        {
            id = 5; align = 2;
        }
        else if (FILTER.Array32F === constructor)
        {
            id = 5; align = 2;
        }
        else //if (FILTER.ImArray === constructor || FILTER.Array8U === constructor)
        {
            id = 4; align = 0;
        }
        var length = values.length,
            buffer = exports.__pin(exports.__new(length << align, 1)) >>> 0,
            header = exports.__new(12, id) >>> 0;
        __setU32(header + 0, buffer);
        __dataview.setUint32(header + 4, buffer, true);
        __dataview.setUint32(header + 8, length << align, true);
        (new constructor(memory.buffer, buffer, length)).set(values);
        exports.__unpin(buffer);
        return header;
    }
    function __lowerArray(/*lowerElement,*/ type/*id, align*/, values)
    {
        if (null == values) return 0;
        var id = 4, align = 0, lowerElement;
        if ('f32' === type)
        {
            id = 5; align = 2;
            lowerElement = __setF32;
        }
        else if ('i32' === type)
        {
            id = 7; align = 2;
            lowerElement = __setU32;
        }
        else
        {
            id = 6; align = 2;
            lowerElement = function(pointer, value) {
                __setU32(pointer, __lowerTypedArray(type, value) || __notnull());
            };
        }
        var length = values.length,
            buffer = exports.__pin(exports.__new(length << align, 1)) >>> 0,
            header = exports.__pin(exports.__new(16, id)) >>> 0;
        __setU32(header + 0, buffer);
        __dataview.setUint32(header + 4, buffer, true);
        __dataview.setUint32(header + 8, length << align, true);
        __dataview.setUint32(header + 12, length, true);
        for (var i=0; i<length; ++i) lowerElement(buffer + (i << align >>> 0), values[i]);
        exports.__unpin(buffer);
        exports.__unpin(header);
        return header;
    }
    function __liftString(pointer)
    {
        if (!pointer) return null;
        var end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
            memoryU16 = new Uint16Array(memory.buffer);
        var start = pointer >>> 1, string = "";
        while (end - start > 1024) string += String.fromCharCode.apply(String, memoryU16.subarray(start, start += 1024));
        return string + String.fromCharCode.apply(String, memoryU16.subarray(start, end));
    }
    function __retain(pointer)
    {
        if (pointer)
        {
            var refcount = refcounts.get(pointer);
            if (refcount) refcounts.set(pointer, refcount + 1);
            else refcounts.set(exports.__pin(pointer), 1);
        }
        return pointer;
    }
    function __release(pointer)
    {
        if (pointer)
        {
            var refcount = refcounts.get(pointer);
            if (1 === refcount) {exports.__unpin(pointer); refcounts.delete(pointer);}
            else if (refcount) {refcounts.set(pointer, refcount - 1);}
            else {throw Error('invalid refcount "'+refcount+'" for reference "'+pointer+'"');}
        }
    }
    function __notnull()
    {
        throw TypeError("value must not be null");
    }
    function __setU32(pointer, value)
    {
        try {
            __dataview.setUint32(pointer, value, true);
        } catch {
            __dataview = new DataView(memory.buffer);
            __dataview.setUint32(pointer, value, true);
        }
    }
    function __setF32(pointer, value)
    {
        try {
            __dataview.setFloat32(pointer, value, true);
        } catch {
            __dataview = new DataView(memory.buffer);
            __dataview.setFloat32(pointer, value, true);
        }
    }
    function __getI32(pointer)
    {
        try {
            return __dataview.getInt32(pointer, true);
        } catch {
            __dataview = new DataView(memory.buffer);
            return __dataview.getInt32(pointer, true);
        }
    }
    function __getU32(pointer)
    {
        try {
            return __dataview.getUint32(pointer, true);
        } catch {
            __dataview = new DataView(memory.buffer);
            return __dataview.getUint32(pointer, true);
        }
    }
    function __getF32(pointer)
    {
        try {
            return __dataview.getFloat32(pointer, true);
        } catch {
            __dataview = new DataView(memory.buffer);
            return __dataview.getFloat32(pointer, true);
        }
    }

    _exports = _exports || {};
    _imports = _imports || {};
    _imports.env = _imports.env || {};
    imports = {
        env: Object.assign(Object.create(FILTER.global), _imports.env, {
            abort: function(message, fileName, lineNumber, columnNumber) {
                message = __liftString(message >>> 0);
                fileName = __liftString(fileName >>> 0);
                lineNumber = lineNumber >>> 0;
                columnNumber = columnNumber >>> 0;
                (function() {throw Error(message+' in '+fileName+':'+lineNumber+':'+columnNumber);})();
            }
        })
    };
    refcounts = new Map();

    return WebAssembly.compile(base64ToArrayBuffer(base64))
    .then(function(module) {
        return module ? WebAssembly.instantiate(module, imports) : Promise.resolve(null);
    })
    .catch(function(err) {
        FILTER.error(err);
        return Promise.resolve(null);
    })
    .then(function(wasm) {
        if (!wasm) return null;
        exports = wasm.exports;
        memory = exports.memory || _imports.env.memory;
        __dataview = new DataView(memory.buffer);
        var exported = {}, e;
        for (e in _exports)
        {
            exported[e] = (function(inp, outp, func) {return function(/*...args*/) {
                var args = Array.prototype.slice.call(arguments), ret;
                inp.forEach(function(i, j) {
                    if (j+1 < inp.length)
                    {
                        if (i.array) args[i.arg] = __retain(__lowerArray(i.type, args[i.arg]) || __notnull());
                        else args[i.arg] = __retain(__lowerTypedArray(i.type, args[i.arg]) || __notnull());
                    }
                    else
                    {
                        if (i.array) args[i.arg] = __lowerArray(i.type, args[i.arg]) || __notnull();
                        else args[i.arg] = __lowerTypedArray(i.type, args[i.arg]) || __notnull();
                    }
                });
                if (exports.__setArgumentsLength) exports.__setArgumentsLength(args.length);
                ret = func.apply(exports, args);
                if (outp.struct) ret = __liftRecord(outp.struct, (ret >>> 0));
                else if (outp.type) ret = __liftTypedArray(outp.type, (ret >>> 0));
                inp.forEach(function(i, j) {
                    if (j+1 < inp.length)
                        __release(args[i.arg]);
                });
                return ret;
            };})(_exports[e].inputs, _exports[e].output, exports[e]);
        }
        return Object.setPrototypeOf(exported, exports);
    });
}
WASM.base64ToArrayBuffer = base64ToArrayBuffer;
WASM.instantiate = instantiate;
WASM.isSupported = FILTER.supportsWASM();
WASM.isLoaded = true;
FILTER.Util.WASM = WASM;
if (WASM.isSupported && FILTER.Util.Filter._wasm)
{
    FILTER.waitFor(1);
    var module = FILTER.Util.Filter._wasm();
    instantiate(module.wasm, module.imports, module.exports).then(function(wasm) {
        if (wasm)
        {
            FILTER.Util.Image.wasm = {
                interpolate_nearest: wasm.interpolate_nearest,
                interpolate_bilinear: wasm.interpolate_bilinear,
                interpolate: wasm.interpolate_bilinear
            };
            FILTER.Util.Filter.wasm = {
                integral_convolution: wasm.integral_convolution,
                separable_convolution: wasm.separable_convolution,
                histogram: wasm.histogram,
                gaussian: wasm.gaussian,
                gradient: wasm.gradient,
                optimum_gradient: wasm.optimum_gradient
            };
        }
        /*else
        {
            FILTER.Util.Image.wasm = {};
            FILTER.Util.Filter.wasm = {};
        }*/
        FILTER.unwaitFor(1);
    });
}
}(FILTER);/**
*
* Filter SuperClass, Interfaces and Utilities
* @package FILTER.js
*
**/
!function(FILTER) {
"use strict";

var PROTO = 'prototype'
    ,OP = Object[PROTO], FP = Function[PROTO], AP = Array[PROTO]
    ,HAS = OP.hasOwnProperty, KEYS = Object.keys, stdMath = Math
    ,Async = FILTER.Asynchronous
    ,isNode = Async.isPlatform(Async.Platform.NODE)
    ,isBrowser = Async.isPlatform(Async.Platform.BROWSER)
    ,supportsThread = Async.supportsMultiThreading()
    ,isThread = Async.isThread(null, true)
    ,isInsideThread = Async.isThread()
    ,FILTERPath = FILTER.Path
    ,Merge = FILTER.Class.Merge
    ,GLSL = FILTER.Util.GLSL
    ,WASM = FILTER.Util.WASM
    ,initPlugin = function() {}
    ,constructorPlugin = function(init) {
        return function PluginFilter() {
            var self = this;
            // factory/constructor pattern
            if (!(self instanceof PluginFilter))
            {
                if (arguments.length)
                {
                    arguments.__arguments__ = true;
                    return new PluginFilter(arguments);
                }
                else
                {
                    return new PluginFilter();
                }
            }
            self.$super('constructor');
            init.apply(self, (1===arguments.length) && (true===arguments[0].__arguments__) ? arguments[0] : arguments);
        };
    }
    ,notSupportClamp = FILTER._notSupportClamp
    ,log = FILTER.log, Min = stdMath.min, Max = stdMath.max
    ,ID = 0
    ,validEntry = function(entry) {return entry && entry.instance && entry.instance.isOn();}
;


// Thread Filter Interface (internal)
var FilterThread = FILTER.FilterThread = FILTER.Class(Async, {

     path: FILTERPath
    ,name: null
    ,_listener: null
    ,_rand: null

    ,constructor: function() {
        var self = this, filter = null;
        if (isThread)
        {
            self.initThread()
                .listen('load', function(data) {
                    if (data && data.filter)
                    {
                        if (filter)
                        {
                            filter.dispose(true);
                            filter = null;
                        }
                        filter = Async.load('FILTER.' + data.filter/*, data["import"] || data["imports"]*/);
                    }
                })
                .listen('import', function(data) {
                    if (data && data["import"] && data["import"].length)
                    {
                        Async.importScripts(data["import"].join ? data["import"].join(',') : data["import"]);
                    }
                })
                /*.listen('params', function(data) {
                    if (filter) filter.unserializeFilter(data);
                })
                .listen('inputs', function(data) {
                    if (filter) filter.unserializeInputs(data);
                })*/
                .listen('apply', function(data) {
                    if (filter && data && data.im)
                    {
                        FILTER.onReady(function() {
                        var im = data.im; im[0] = FILTER.Util.Array.typed(im[0], FILTER.ImArray);
                        if (data.params) filter.unserializeFilter(data.params);
                        if (data.inputs) filter.unserializeInputs(data.inputs, im);
                        // pass any filter metadata if needed
                        im = filter._apply(im[0], im[1], im[2]);
                        self.send('apply', {im: filter._update ? im : false, meta: filter.hasMeta ? filter.metaData(true) : null});
                        });
                    }
                    else
                    {
                        self.send('apply', {im: null});
                    }
                })
                .listen('apply_wasm', function(data) {
                    if (filter && data && data.im)
                    {
                        FILTER.onReady(function() {
                        var im = data.im; im[0] = FILTER.Util.Array.typed(im[0], FILTER.ImArray);
                        if (data.params) filter.unserializeFilter(data.params);
                        if (data.inputs) filter.unserializeInputs(data.inputs, im);
                        // pass any filter metadata if needed
                        im = filter._apply_wasm(im[0], im[1], im[2]);
                        self.send('apply', {im: filter._update ? im : false, meta: filter.hasMeta ? filter.metaData(true) : null});
                        });
                    }
                    else
                    {
                        self.send('apply', {im: null});
                    }
                })
                .listen('dispose', function(data) {
                    if (filter)
                    {
                        filter.dispose(true);
                        filter = null;
                    }
                    self.dispose(true);
                    //Async.close();
                })
            ;
        }
    }

    ,dispose: function(explicit) {
        var self = this;
        self.path = null;
        self.name = null;
        self._rand = null;
        if (self._listener)
        {
            self._listener.cb = null;
            self._listener = null;
        }
        self.$super('dispose', [explicit]);
        return self;
    }

    // activate or de-activate thread/worker filter
    ,thread: function(enable, imports) {
        var self = this;
        if (!arguments.length) enable = true;
        enable = !!enable;
        // activate worker
        if (enable && !self.$thread)
        {
            if (null === self._rand)
                self._rand = isNode ? '' : ((-1 === self.path.file.indexOf('?') ? '?' : '&') + (new Date().getTime()));
            self.fork('FILTER.FilterThread', FILTERPath.file !== self.path.file ? [FILTERPath.file, self.path.file+self._rand] : self.path.file+self._rand);
            if (imports && imports.length)
                self.send('import', {'import': imports.join ? imports.join(',') : imports});
            self.send('load', {filter: self.name});
            self.listen('apply', self._listener=function l(data) {l.cb && l.cb(data);});
        }
        // de-activate worker (if was activated before)
        else if (!enable && self.$thread)
        {
            self._listener.cb = null;
            self._listener = null;
            self.unfork();
        }
        return self;
    }

    ,sources: function() {
        if (!arguments.length) return this;
        var sources = arguments[0] instanceof Array ? arguments[0] : AP.slice.call(arguments);
        if (sources.length)
        {
            var blobs = [], i;
            for (i=0; i<sources.length; ++i)
                blobs.push(Async.blob("function" === typeof sources[i] ? FP.toString.call(sources[i]) : sources[i]));
            this.send('import', {'import': blobs.join(',')});
        }
        return this;
    }

    ,scripts: function() {
        if (!arguments.length) return this;
        var scripts = arguments[0] instanceof Array ? arguments[0] : AP.slice.call(arguments);
        if (scripts.length) this.send('import', {'import': scripts.join(',')});
        return this;
    }
});

// Abstract Generic Filter (implements Async Worker/Thread Interface transparently)
var Filter = FILTER.Filter = FILTER.Class(FilterThread, {
    name: "Filter"

    ,constructor: function Filter() {
        var self = this;
        //self.$super('constructor', [100, false]);
        self.id = ++ID;
        self.inputs = {};
        self.meta = null;
    }

    // filters can have id's
    ,_isOn: true
    ,_isGLSL: false
    ,_isWASM: false
    ,_glsl: null
    ,_wasm: null
    ,_runWASM: false
    ,_update: true
    ,id: null
    ,onComplete: null
    ,mode: 0
    ,selection: null
    ,inputs: null
    ,hasInputs: false
    ,meta: null
    ,hasMeta: false

    ,dispose: function() {
        var self = this;
        self.name = null;
        self.id = null;
        self._isOn = null;
        self._isGLSL = self._isWASM = null;
        self._update = null;
        self.onComplete = null;
        self.mode = null;
        self.selection = null;
        self.inputs = null;
        self.hasInputs = null;
        self.meta = null;
        self.hasMeta = null;
        self._glsl = self._wasm = null;
        self.$super('dispose');
        return self;
    }

    // alias of thread method
    ,worker: FilterThread[PROTO].thread


    ,getParam: function(param) {
        var self = this;
        if (param && ('_' !== param.charAt(0)) && HAS.call(self.constructor[PROTO], param))
        {
            return self[param];
        }
    }
    ,setParam: function(param, value) {
        var self = this;
        if (param && ('_' !== param.charAt(0)) && HAS.call(self.constructor[PROTO], param))
        {
            self[param] = value;
        }
        return self;
    }

    // @override
    ,metaData: function(meta, serialisation) {
        return this.meta;
    }
    ,getMetaData: function(meta, serialisation) {
        return this.metaData(meta, serialisation);
    }
    // @override
    ,setMetaData: function(meta, serialisation) {
        this.meta = meta;
        return this;
    }

    ,setInput: function(key, inputImage) {
        var self = this;
        key = String(key);
        if (null === inputImage)
        {
            if (self.inputs[key])
            {
                delete self.inputs[key];
                self._glsl = null;
            }
        }
        else
        {
            self.inputs[key] = [null, inputImage, inputImage.nref];
            self._glsl = null;
        }
        return self;
    }

    ,unsetInput: function(key) {
        var self = this;
        key = String(key);
        if (self.inputs[key])
        {
            delete self.inputs[key];
            self._glsl = null;
        }
        return self;
    }
    ,delInput: null

    ,resetInputs: function() {
        this.inputs = {};
        return this;
    }

    ,input: function(key) {
        var input = this.inputs[String(key)];
        if (!input) return null;
        if ((null == input[0]) || (input[1] && (input[2] !== input[1].nref)))
        {
            input[2] = input[1].nref; // compare and update current ref count with image ref count
            input[0] = input[1].getSelectedData(1);
        }
        return input[0] || null;
    }
    ,getInput: null

    ,isInputUpdated: function(key) {
        var input = this.inputs[String(key)];
        if (input && ((true === input[3]) || (null == input[0]) || (input[1] && (input[2] !== input[1].nref)))) return true;
        return false;
    }

    // @override
    ,serialize: function() {
        return null;
    }

    // @override
    ,unserialize: function(params) {
        return this;
    }

    ,serializeInputs: function(curIm) {
        if (!this.hasInputs) return null;
        var inputs = this.inputs, input, k = KEYS(inputs), i, l = k.length, json;
        if (!l) return null;
        json = {_updated:{}};
        for (i=0; i<l; ++i)
        {
            input = inputs[k[i]];
            if ((null == input[0]) || (input[1] && (input[2] !== input[1].nref)))
            {
                // save bandwidth if input is same as main current image being processed
                json._updated[k[i]] = true;
                input[2] = input[1].nref; // compare and update current ref count with image ref count
                json[k[i]] = curIm === input[1] ? true : input[1].getSelectedData(1);
            }
        }
        return json;
    }

    ,unserializeInputs: function(json, curImData) {
        var self = this;
        if (!json || !self.hasInputs) return self;
        var _updated = json._updated || {};
        if (json._updated) delete json._updated;
        var inputs = self.inputs, input, k = KEYS(json), i, l = k.length,
            IMG = FILTER.ImArray, TypedArray = FILTER.Util.Array.typed;
        for (i=0; i<l; ++i)
        {
            input = json[k[i]];
            if (!input) continue;
            // save bandwidth if input is same as main current image being processed
            if (true === input) input = curImData;
            else input[0] = TypedArray(input[0], IMG)
            inputs[k[i]] = [input, null, 0, _updated[k[i]] || false];
        }
        return self;
    }

    ,serializeFilter: function() {
        var self = this;
        return {filter: self.name, _isOn: self._isOn, _update: self._update, mode: self.mode, selection: self.selection, params: self.serialize()};
    }

    ,unserializeFilter: function(json) {
        var self = this;
        if (json && (self.name === json.filter))
        {
            self._isOn = json._isOn; self._update = json._update;
            self.mode = json.mode||0; self.selection = json.selection||null;
            if (self._isOn && json.params) self.unserialize(json.params);
        }
        return self;
    }

    ,select: function(x1, y1, x2, y2, absolute) {
        var self = this;
        if (false === x1)
        {
            self.selection = null
        }
        else
        {
            self.selection = absolute ? [
                Max(0.0, x1||0),
                Max(0.0, y1||0),
                Max(0.0, x2||0),
                Max(0.0, y2||0),
                0
            ] : [
                Min(1.0, Max(0.0, x1||0)),
                Min(1.0, Max(0.0, y1||0)),
                Min(1.0, Max(0.0, x2||0)),
                Min(1.0, Max(0.0, y2||0)),
                1
            ];
        }
        return self;
    }

    ,deselect: function() {
        return this.select(false);
    }

    ,complete: function(f) {
        this.onComplete = f || null;
        return this;
    }

    ,setMode: function(mode) {
        this.mode = mode;
        return this;
    }

    ,getMode: function() {
        return this.mode;
    }

    // whether filter is ON
    ,isOn: function() {
        return this._isOn;
    }

    // whether filter is GLSL
    ,isGLSL: function() {
        return this._isGLSL;
    }

    // whether filter is WASM
    ,isWASM: function() {
        return this._isWASM;
    }

    // whether filter updates output image or not
    ,update: function(bool) {
        if (!arguments.length) bool = true;
        this._update = !!bool;
        return this;
    }

    // allow filters to be turned ON/OFF
    ,turnOn: function(bool) {
        if (!arguments.length) bool = true;
        this._isOn = !!bool;
        return this;
    }

    // toggle ON/OFF state
    ,toggle: function() {
        this._isOn = !this._isOn;
        return this;
    }

    // allow filters to be GLSL
    ,makeGLSL: function(bool) {
        if (!arguments.length) bool = true;
        this._isGLSL = (!!bool) && GLSL.isLoaded && FILTER.supportsGLSL();
        return this;
    }

    // get GLSL code and variables, override
    ,GLSLCode: function() {
        var self = this;
        if (null == self._glsl) self._glsl = self.getGLSL();
        return self._glsl;
    }
    ,getGLSL: function() {
        return {instance: this};
    }

    // allow filters to be WASM
    ,makeWASM: function(bool) {
        if (!arguments.length) bool = true;
        this._isWASM = (!!bool) && WASM.isLoaded && FILTER.supportsWASM();
        return this;
    }

    // get WASM code and variables, override
    ,WASMCode: function() {
        var self = this;
        if (null == self._wasm) self._wasm = self.getWASM();
        return self._wasm;
    }
    ,getWASM: function() {
        return '';
    }

    // @override
    ,reset: function() {
        this.resetInputs();
        return this;
    }

    // @override
    ,canRun: function() {
        return this._isOn;
    }

    // @override
    ,combineWith: function(filter) {
        return this;
    }

    // @override if using wasm
    // for internal use, each filter overrides this
    ,_apply_wasm: function(im, w, h, metaData) {
        /* by default use javascript _apply, override */
        var self = this, ret;
        self._runWASM = true;
        ret = self._apply(im, w, h, metaData);
        self._runWASM = false;
        return ret;
    }

    // @override
    // for internal use, each filter overrides this
    ,_apply: function(im, w, h, metaData) {
        /* do nothing here, override */
        return im;
    }

    ,apply_: function(img, im, w, h, cb) {
        var self = this, im2, glsl;

        if (!self.canRun())
        {
            cb(im, self);
        }
        else if (self.$thread)
        {
            self._listener.cb = function(data) {
                self._listener.cb = null;
                if (data && data.im) im = FILTER.Util.Array.typed(data.im, FILTER.ImArray);
                cb(im, self);
            };
            self.send(self.isWASM() ? 'apply_wasm' : 'apply', {im: [im, w, h, 2], params: self.serializeFilter(), inputs: self.serializeInputs(img)});
        }
        else if (!isInsideThread && self.isGLSL())
        {
            if (glsl = self.GLSLCode())
            {
                if (!glsl.push && !glsl.pop) glsl = [glsl];
                glsl = glsl.filter(validEntry);
                if (glsl.length)
                {
                    im2 = GLSL.run(img, self, glsl, im, w, h, {src:img, dst:img});
                    if (im2) im = im2;
                }
            }
            cb(im, self);
        }
        else
        {
            im = self.isWASM() ? self._apply_wasm(im, w, h, {src:img, dst:img}) : self._apply(im, w, h, {src:img, dst:img});
            cb(im, self);
        }
        return self;
    }

    // generic apply a filter from an image (src) to another image (dst) with optional callback (cb)
    ,apply: function(src, dst, cb) {
        var self = this, im, im2, w, h, glsl;

        if (!self.canRun()) return src;

        if (arguments.length < 3)
        {
            if (dst && dst.setSelectedData)
            {
                // dest is an image and no callback
                cb = null;
            }
            else if ('function' === typeof dst)
            {
                // dst is callback, dst is same as src
                cb = dst;
                dst = src;
            }
            else
            {
                dst = src;
                cb = null;
            }
        }

        if (src && dst)
        {
            cb = cb || self.onComplete;
            im = src.getSelectedData();
            w = im[1]; h = im[2];
            if (self.$thread)
            {
                self._listener.cb = function(data) {
                    //self.unlisten('apply');
                    self._listener.cb = null;
                    if (data)
                    {
                        // listen for metadata if needed
                        //if (null != data.update) self._update = !!data.update;
                        if (data.meta) self.setMetaData(data.meta, true);
                        if (data.im && self._update)
                        {
                            if (self.hasMeta && (
                                (null != self.meta._IMG_WIDTH && w !== self.meta._IMG_WIDTH)
                             || (null != self.meta._IMG_HEIGHT && h !== self.meta._IMG_HEIGHT)
                            ))
                                dst.dimensions(self.meta._IMG_WIDTH, self.meta._IMG_HEIGHT);
                            dst.setSelectedData(FILTER.Util.Array.typed(data.im, FILTER.ImArray));
                        }
                    }
                    if (cb) cb.call(self);
                };
                // process request
                self.send(self.isWASM() ? 'apply_wasm' : 'apply', {im: im, /*id: src.id,*/ params: self.serializeFilter(), inputs: self.serializeInputs(src)});
            }
            else if (!isInsideThread && self.isGLSL())
            {
                if (glsl = self.GLSLCode())
                {
                    // make array, composite filters return array anyway
                    if (!glsl.push && !glsl.pop) glsl = [glsl];
                    // remove disabled and invalid filters
                    glsl = glsl.filter(validEntry);
                    if (glsl.length)
                    {
                        im2 = GLSL.run(dst, self, glsl, im[0], w, h, {src:src, dst:dst});
                        if (self._update)
                        {
                            if (self.hasMeta && (
                                (null != self.meta._IMG_WIDTH && w !== self.meta._IMG_WIDTH)
                             || (null != self.meta._IMG_HEIGHT && h !== self.meta._IMG_HEIGHT)
                            ))
                                dst.dimensions(self.meta._IMG_WIDTH, self.meta._IMG_HEIGHT);
                            if (im2) dst.setSelectedData(im2);
                        }
                    }
                }
                if (cb) cb.call(self);
            }
            else
            {
                im2 = self.isWASM() ? self._apply_wasm(im[0], w, h, {src:src, dst:dst}) : self._apply(im[0], w, h, {src:src, dst:dst});
                // update image only if needed
                // some filters do not actually change the image data
                // but instead process information from the data,
                // no need to update in such a case
                if (self._update)
                {
                    if (self.hasMeta && (
                        (null != self.meta._IMG_WIDTH && w !== self.meta._IMG_WIDTH)
                     || (null != self.meta._IMG_HEIGHT && h !== self.meta._IMG_HEIGHT)
                    ))
                        dst.dimensions(self.meta._IMG_WIDTH, self.meta._IMG_HEIGHT);
                    dst.setSelectedData(im2);
                }
                if (cb) cb.call(self);
            }
        }
        return src;
    }

    ,toString: function() {
        return "[FILTER: " + this.name + "(" + this.id + ")]";
    }
});
FILTER.Filter[PROTO].getInput = FILTER.Filter[PROTO].input;
FILTER.Filter[PROTO].delInput = FILTER.Filter[PROTO].unsetInput;
FILTER.Filter.get = function(filterClass) {
    if (!filterClass || !filterClass.length) return null;
    if (-1 < filterClass.indexOf('.'))
    {
        filterClass = filterClass.split('.');
        var i, l = filterClass.length, part, F = FILTER;
        for (i=0; i<l; ++i)
        {
            part = filterClass[i];
            if (!F[part]) return null;
            F = F[part];
        }
        return F;
    }
    else
    {
        return FILTER[filterClass] || null;
    }
};

// filter plugin creation micro-framework
FILTER.Create = function(methods) {
    methods = Merge({
         init: initPlugin
        ,name: "PluginFilter"
    }, methods);
    var filterName = methods.name;
    methods.constructor = constructorPlugin(methods.init);
    if ((null == methods._apply) && ("function" === typeof methods.apply)) methods._apply = methods.apply;
    // add some aliases
    if (("function" === typeof methods.metaData) && (methods.metaData !== Filter[PROTO].metaData)) methods.getMetaData = methods.metaData;
    else if (("function" === typeof methods.getMetaData) && (methods.getMetaData !== Filter[PROTO].getMetaData)) methods.metaData = methods.getMetaData;
    delete methods.init;
    if (HAS.call(methods, 'apply')) delete methods.apply;
    return FILTER[filterName] = FILTER.Class(Filter, methods);
};
}(FILTER);/**
*
* Color Methods / Transforms
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

// adapted from https://github.com/foo123/css-color
var // utils
    stdMath = Math,
    sqrt = stdMath.sqrt, round = stdMath.round, floor = stdMath.floor,
    min = stdMath.min, max = stdMath.max, abs = stdMath.abs,
    sin = stdMath.sin, cos = stdMath.cos,
    pi = stdMath.PI, pi2 = 2*pi, pi_2 = pi/2, pi_32 = 3*pi_2,
    //notSupportClamp = FILTER._notSupportClamp,
    clamp = FILTER.Util.Math.clamp,
    esc = FILTER.Util.String.esc,
    trim = FILTER.Util.String.trim,

    LUMA = FILTER.LUMA, CHANNEL = FILTER.CHANNEL,
    //RED = CHANNEL.RED, GREEN = CHANNEL.GREEN, BLUE = CHANNEL.BLUE, ALPHA = CHANNEL.ALPHA,
    C2F = 1/255, C2P = 100/255, P2C = 2.55
;

// adapted from https://github.com/foo123/css-color
function hsl2rgb(h, s, l)
{
    var c, hp, d, x, m, r, g, b;
    s /= 100;
    l /= 100;
    c = (1 - stdMath.abs(2*l - 1))*s;
    hp = h/60;
    d = stdMath.floor(hp / 2);
    x = c*(1 - stdMath.abs(hp - 2*d - 1));
    m = l - c/2;
    if (hp >= 0 && hp < 1)
    {
        r = c + m;
        g = x + m;
        b = 0 + m;
    }
    else if (hp >= 1 && hp < 2)
    {
        r = x + m;
        g = c + m;
        b = 0 + m;
    }
    else if (hp >= 2 && hp < 3)
    {
        r = 0 + m;
        g = c + m;
        b = x + m;
    }
    else if (hp >= 3 && hp < 4)
    {
        r = 0 + m;
        g = x + m;
        b = c + m;
    }
    else if (hp >= 4 && hp < 5)
    {
        r = x + m;
        g = 0 + m;
        b = c + m;
    }
    else //if (hp >= 5 && hp < 6)
    {
        r = c + m;
        g = 0 + m;
        b = x + m;
    }
    return [
    clamp(stdMath.round(r*255), 0, 255),
    clamp(stdMath.round(g*255), 0, 255),
    clamp(stdMath.round(b*255), 0, 255)
    ];
}
function hsv2rgb(h, s, v)
{
    v /= 100;
    var l = v*(1 - s/200), lm = stdMath.min(l, 1-l);
    return hsl2rgb(h, 0 === lm ? 0 : 100*(v-l)/lm, 100*l);
}
function hwb2rgb(h, w, b)
{
    var b1 = 1 - b/100;
    return hsv2rgb(h, 100 - w/b1, 100*b1);
}
function rgb2hslvwb(r, g, b, asPercent, type)
{
    // https://en.wikipedia.org/wiki/HSL_and_HSV#From_RGB
    // https://en.wikipedia.org/wiki/HWB_color_model
    var h, sl, sv, l, v, c, xmax, xmin, wh, bl;

    if (asPercent)
    {
        r /= 100;
        g /= 100;
        b /= 100;
    }
    else
    {
        r /= 255;
        g /= 255;
        b /= 255;
    }
    v = xmax = stdMath.max(r, g, b);
    wh = xmin = stdMath.min(r, g, b);
    bl = 1 - xmax;
    c = xmax - xmin;
    l = (xmax + xmin)/2;
    if (0 === c)
    {
        h = 0;
    }
    else if (v === r)
    {
        h = 60*(0 + (g - b)/c);
    }
    else if (v === g)
    {
        h = 60*(2 + (b - r)/c);
    }
    else //if (v === b)
    {
        h = 60*(4 + (r - g)/c);
    }
    if (0 === l || 1 === l)
    {
        sl = 0;
    }
    else
    {
        sl = (v - l)/stdMath.min(l, 1 - l);
    }
    if (0 === v)
    {
        sv = 0;
    }
    else
    {
        sv = c/v;
    }
    return 'hwb' === type ? [
    clamp(stdMath.round(h), 0, 360),
    clamp(wh*100, 0, 100),
    clamp(bl*100, 0, 100)
    ] : ('hsv' === type ? [
    clamp(stdMath.round(h), 0, 360),
    clamp(sv*100, 0, 100),
    clamp(v*100, 0, 100)
    ] : /*'hsl' === type*/[
    clamp(stdMath.round(h), 0, 360),
    clamp(sl*100, 0, 100),
    clamp(l*100, 0, 100)
    ]);
}
function rgb2hue(r, g, b, asPercent)
{
    var h, c, v, xmax, xmin;

    if (asPercent)
    {
        r /= 100;
        g /= 100;
        b /= 100;
    }
    else
    {
        r /= 255;
        g /= 255;
        b /= 255;
    }
    v = xmax = stdMath.max(r, g, b);
    xmin = stdMath.min(r, g, b);
    c = xmax - xmin;
    if (0 === c)
    {
        h = 0;
    }
    else if (v === r)
    {
        h = 60*(0 + (g - b)/c);
    }
    else if (v === g)
    {
        h = 60*(2 + (b - r)/c);
    }
    else //if (v === b)
    {
        h = 60*(4 + (r - g)/c);
    }
    return clamp(stdMath.round(h), 0, 360);
}
function rgb2sat(r, g, b, asPercent, type)
{
    var sl, sv, l, v, c, xmax, xmin;

    if (asPercent)
    {
        r /= 100;
        g /= 100;
        b /= 100;
    }
    else
    {
        r /= 255;
        g /= 255;
        b /= 255;
    }
    v = xmax = stdMath.max(r, g, b);
    xmin = stdMath.min(r, g, b);
    c = xmax - xmin;
    l = (xmax + xmin)/2;
    if (0 === l || 1 === l)
    {
        sl = 0;
    }
    else
    {
        sl = (v - l)/stdMath.min(l, 1 - l);
    }
    if (0 === v)
    {
        sv = 0;
    }
    else
    {
        sv = c/v;
    }
    return 'hsv' === type ? clamp(sv*100, 0, 100) : /*'hsl' === type*/clamp(sl*100, 0, 100);
}
function rgb2hsl(r, g, b, asPercent)
{
    return rgb2hslvwb(r, g, b, asPercent, 'hsl');
}
function rgb2hsv(r, g, b, asPercent)
{
    return rgb2hslvwb(r, g, b, asPercent, 'hsv');
}
function rgb2hwb(r, g, b, asPercent)
{
    return rgb2hslvwb(r, g, b, asPercent, 'hwb');
}
function rgb2cmyk(r, g, b, asPercent)
{
    var c = 0, m = 0, y = 0, k = 0, minCMY, invCMY;

    if (asPercent)
    {
        r = clamp(round(r*P2C), 0, 255);
        g = clamp(round(g*P2C), 0, 255);
        b = clamp(round(b*P2C), 0, 255);
    }

    // BLACK, k=1
    if (0 === r && 0 === g && 0 === b) return [0, 0, 0, 1];

    c = 1 - (r*C2F);
    m = 1 - (g*C2F);
    y = 1 - (b*C2F);

    minCMY = min(c, m, y);
    invCMY = 1 / (1 - minCMY);
    c = (c - minCMY) * invCMY;
    m = (m - minCMY) * invCMY;
    y = (y - minCMY) * invCMY;
    k = minCMY;

    return [c, m, y, k];
}
function cmyk2rgb(c, m, y, k)
{
    var r = 0, g = 0, b = 0, minCMY, invCMY;

    // BLACK
    if (0 === c && 0 === m && 0 === y) return [0, 0, 0];

    minCMY = k;
    invCMY = 1 - minCMY;
    c = c*invCMY + minCMY;
    m = m*invCMY + minCMY;
    y = y*invCMY + minCMY;

    r = (1 - c)*255;
    g = (1 - m)*255;
    b = (1 - y)*255;

    return [
        clamp(round(r), 0, 255),
        clamp(round(g), 0, 255),
        clamp(round(b), 0, 255)
    ];
}
var GLSL = [
'#define FORMAT_HWB 3',
'#define FORMAT_HSV 2',
'#define FORMAT_HSL 1',
'vec4 hsl2rgb(float h, float s, float l) {',
'   float c = (1.0 - abs(2.0*l - 1.0))*s;',
'   float hp = h/60.0;',
'   float d = float(floor(hp / 2.0));',
'   float x = c*(1.0 - abs(hp - 2.0*d - 1.0));',
'   float m = l - c/2.0;',
'   vec4 rgb = vec4(0.0,0.0,0.0,1.0);',
'   if (hp >= 0.0 && hp < 1.0) {',
'       rgb.r = c + m;',
'       rgb.g = x + m;',
'       rgb.b = m;',
'   } else if (hp >= 1.0 && hp < 2.0) {',
'       rgb.r = x + m;',
'       rgb.g = c + m;',
'       rgb.b = m;',
'   } else if (hp >= 2.0 && hp < 3.0) {',
'       rgb.r = m;',
'       rgb.g = c + m;',
'       rgb.b = x + m;',
'   } else if (hp >= 3.0 && hp < 4.0) {',
'       rgb.r = m;',
'       rgb.g = x + m;',
'       rgb.b = c + m;',
'   } else if (hp >= 4.0 && hp < 5.0) {',
'       rgb.r = x + m;',
'       rgb.g = m;',
'       rgb.b = c + m;',
'   } else {',
'       rgb.r = c + m;',
'       rgb.g = m;',
'       rgb.b = x + m;',
'   }',
'   return clamp(rgb, 0.0, 1.0);',
'}',
'vec4 hsv2rgb(float h, float s, float v) {',
'    float l = v*(1.0 - s/2.0);',
'    float lm = min(l, 1.0-l);',
'    if (0.0 == lm) return hsl2rgb(h, 0.0, l);',
'    else return hsl2rgb(h, (v-l)/lm, l);',
'}',
'vec4 hwb2rgb(float h, float w, float b) {',
'    float b1 = 1.0 - b;',
'    return hsv2rgb(h, 1.0 - w/b1, b1);',
'}',
'vec4 rgb2hslvwb(float r, float g, float b, int type) {',
'    float xmax = max(r, max(g, b));',
'    float xmin = min(r, min(g, b));',
'    float v = xmax;',
'    float c = xmax - xmin;',
'    float l = clamp((xmax + xmin)/2.0, 0.0, 1.0);',
'    float wh = clamp(xmin, 0.0, 1.0);',
'    float bl = clamp(1.0 - xmax, 0.0, 1.0);',
'    float h = 0.0;',
'    if (0.0 == c) {',
'        h = 0.0;',
'    } else if (v == r) {',
'        h = 60.0*((g - b)/c);',
'    } else if (v == g) {',
'        h = 60.0*(2.0 + (b - r)/c);',
'    } else {',
'        h = 60.0*(4.0 + (r - g)/c);',
'    }',
'    h = clamp(h, 0.0, 360.0);',
'   float sl; float sv;',
'    if (0.0 == l || 1.0 == l) {',
'        sl = 0.0;',
'    } else {',
'        sl = clamp((v - l)/min(l, 1.0 - l), 0.0, 1.0);',
'    }',
'    if (0.0 == v) {',
'        sv = 0.0;',
'    } else {',
'        sv = clamp(c/v, 0.0, 1.0);',
'    }',
'    v = clamp(v, 0.0, 1.0);',
'    if (FORMAT_HWB == type) return vec4(h, wh, bl, 1.0);',
'    else if (FORMAT_HSV == type) return vec4(h, sv, v, 1.0);',
'    return vec4(h, sl, l, 1.0);',
'}',
'vec4 rgb2hsl(float r, float g, float b) {',
'    return rgb2hslvwb(r, g, b, FORMAT_HSL);',
'}',
'vec4 rgb2hsv(float r, float g, float b) {',
'    return rgb2hslvwb(r, g, b, FORMAT_HSV);',
'}',
'vec4 rgb2hwb(float r, float g, float b) {',
'    return rgb2hslvwb(r, g, b, FORMAT_HWB);',
'}',
'vec4 rgb2cmyk(float r, float g, float b) {',
'    if (0.0 == r && 0.0 == g && 0.0 == b) {',
'       return vec4(0.0, 0.0, 0.0, 1.0);',
'    }',
'    float c = 1.0 - r;',
'    float m = 1.0 - g;',
'    float y = 1.0 - b;',
'    float minCMY = min(c, min(m, y));',
'    float invCMY = 1.0 / (1.0 - minCMY);',
'    return vec4(',
'        (c - minCMY) * invCMY,',
'        (m - minCMY) * invCMY,',
'        (y - minCMY) * invCMY,',
'        minCMY',
'    );',
'}',
'vec4 cmyk2rgb(float c, float m, float y, float k) {',
'    if (0.0 == c && 0.0 == m && 0.0 == y) {',
'        return vec4(0.0, 0.0, 0.0, 1.0);',
'    }',
'    float minCMY = k;',
'    float invCMY = 1.0 - minCMY;',
'    c = c*invCMY + minCMY;',
'    m = m*invCMY + minCMY;',
'    y = y*invCMY + minCMY;',
'    return vec4(',
'        1.0 - c,',
'        1.0 - m,',
'        1.0 - y,',
'        1.0',
'    );',
'}',
'vec4 rgb2ycbcr(float r, float g, float b) {',
'    return clamp(vec4(',
'    0.0 + 0.299*r    + 0.587*g     + 0.114*b,',
'    0.5 - 0.168736*r - 0.331264*g  + 0.5*b,',
'    0.5 + 0.5*r      - 0.418688*g  - 0.081312*b,',
'    1.0',
'    ), 0.0, 1.0);',
'}',
'vec4 ycbcr2rgb(float y, float cb, float cr) {',
'    return clamp(vec4(',
'    y                      + 1.402   * (cr-0.5),',
'    y - 0.34414 * (cb-0.5) - 0.71414 * (cr-0.5),',
'    y + 1.772   * (cb-0.5),',
'    1.0',
'    ), 0.0, 1.0);',
'}',
'float rgb2hue(float r, float g, float b) {',
'    return rgb2hslvwb(r, g, b, FORMAT_HSL).x;',
'}',
'float rgb2sat(float r, float g, float b, int type) {',
'    return rgb2hslvwb(r, g, b, type).y;',
'}',
'float intensity(float r, float g, float b) {',
'    return clamp('+LUMA[0]+'*r + '+LUMA[1]+'*g + '+LUMA[2]+'*b, 0.0, 1.0);',
'}'
].join('\n');
//
// Color Class and utils
var Color = FILTER.Color = FILTER.Class({

    //
    // static
    __static__: {

        GLSLCode: function() {
            return GLSL;
        },
        clamp: clamp,

        clampPixel: function(v) {
            return min(255, max(v, 0));
        },

        color24: function(r, g, b) {
            return ((r&255) << 16) | ((g&255) << 8) | (b&255);
        },

        color32: function(r, g, b, a) {
            return ((a&255) << 24) | ((r&255) << 16) | ((g&255) << 8) | (b&255);
        },

        rgb24: function(color) {
            return [(color >>> 16)&255, (color >>> 8)&255, color&255];
        },

        rgba32: function(color) {
            return [(color >>> 16)&255, (color >>> 8)&255, color&255, (color >>> 24)&255];
        },

        rgb24GL: function(color) {
            var toFloat = FILTER.Util.GLSL.formatFloat;
            return 'vec3('+[toFloat(((color >>> 16)&255)/255), toFloat(((color >>> 8)&255)/255), toFloat((color&255)/255)].join(',')+');';
        },

        rgba32GL: function(color) {
            var toFloat = FILTER.Util.GLSL.formatFloat;
            return 'vec4('+[toFloat(((color >>> 16)&255)/255), toFloat(((color >>> 8)&255)/255), toFloat((color&255)/255), toFloat(((color >>> 24)&255)/255)].join(',')+');';
        },

        intensity: function(r, g, b) {
            return ~~(LUMA[0]*r + LUMA[1]*g + LUMA[2]*b);
        },

        hue: function(r, g, b) {
            return rgb2hue(r, g, b);
        },

        saturation: function(r, g, b) {
            return rgb2sat(r, g, b, false, 'hsv')*2.55;
        },

        dist: function(ccc1, ccc2, p1, p2) {
            //p1 = p1 || 0; p2 = p2 || 0;
            var d0 = ccc1[p1+0]-ccc2[p2+0], d1 = ccc1[p1+1]-ccc2[p2+1], d2 = ccc1[p1+2]-ccc2[p2+2];
            return sqrt(d0*d0 + d1*d1 + d2*d2);
        },

        RGB2Gray: function(rgb, p) {
            //p = p || 0;
            var g = (LUMA[0]*rgb[p+0] + LUMA[1]*rgb[p+1] + LUMA[2]*rgb[p+2])|0;
            rgb[p+0] = g; rgb[p+1] = g; rgb[p+2] = g;
            return rgb;
        },

        RGB2Color: function(rgb, p) {
            //p = p || 0;
            return ((rgb[p+0]&255) << 16) | ((rgb[p+1]&255) << 8) | (rgb[p+2]&255);
        },

        RGBA2Color: function(rgba, p) {
            //p = p || 0;
            return ((rgba[p+3]&255) << 24) | ((rgba[p+0]&255) << 16) | ((rgba[p+1]&255) << 8) | (rgba[p+2]&255);
        },

        Color2RGBA: function(c, rgba, p) {
            /*p = p || 0;*/ c = c|0;
            rgba[p+0] = (c >>> 16) & 255;
            rgba[p+1] = (c >>> 8) & 255;
            rgba[p+2] = (c & 255);
            rgba[p+3] = (c >>> 24) & 255;
            return rgba;
        },

        // https://www.cs.rit.edu/~ncs/color/t_convert.html#RGB%20to%20XYZ%20&%20XYZ%20to%20RGB
        RGB2XYZ: function(ccc, p) {
            //p = p || 0;
            var r = ccc[p+0], g = ccc[p+1], b = ccc[p+2];
            // each take full range from 0-255
            ccc[p+0] = ( 0.412453*r + 0.357580*g + 0.180423*b )|0;
            ccc[p+1] = ( 0.212671*r + 0.715160*g + 0.072169*b )|0;
            ccc[p+2] = ( 0.019334*r + 0.119193*g + 0.950227*b )|0;
            return ccc;
        },

        // https://www.cs.rit.edu/~ncs/color/t_convert.html#RGB%20to%20XYZ%20&%20XYZ%20to%20RGB
        XYZ2RGB: function(ccc, p) {
            //p = p || 0;
            var x = ccc[p+0], y = ccc[p+1], z = ccc[p+2];
            // each take full range from 0-255
            ccc[p+0] = ( 3.240479*x - 1.537150*y - 0.498535*z )|0;
            ccc[p+1] = (-0.969256*x + 1.875992*y + 0.041556*z )|0;
            ccc[p+2] = ( 0.055648*x - 0.204043*y + 1.057311*z )|0;
            return ccc;
        },

        // https://www.cs.harvard.edu/~sjg/papers/cspace.pdf
        RGB2ILL: function(ccc, p) {
            //p = p || 0;
            var r = ccc[p+0]/255, g = ccc[p+1]/255, b = ccc[p+2]/255, x, y, z, xi, yi, zi, ln = Math.log;
            // RGB to XYZ
            // each take full range from 0-255
            x = ( 0.412453*r + 0.357580*g + 0.180423*b );
            y = ( 0.212671*r + 0.715160*g + 0.072169*b );
            z = ( 0.019334*r + 0.119193*g + 0.950227*b );
            // B matrix and logarithm transformation
            xi = ln( 0.9465229*x + 0.2946927*y - 0.1313419*z );
            yi = ln(-0.1179179*x + 0.9929960*y + 0.007371554*z );
            zi = ln( 0.09230461*x - 0.04645794*y + 0.9946464*z );
            // A matrix
            ccc[p+0] = ( 27.07439*xi - 22.80783*yi - 1.806681*zi );
            ccc[p+1] = (-5.646736*xi - 7.722125*yi + 12.86503*zi );
            ccc[p+2] = (-4.163133*xi - 4.579428*yi - 4.576049*zi );
            return ccc;
        },

        // https://www.cs.harvard.edu/~sjg/papers/cspace.pdf
        // http://matrix.reshish.com/inverCalculation.php
        ILL2RGB: function(ccc, p) {
            //p = p || 0;
            var r = ccc[p+0], g = ccc[p+1], b = ccc[p+2], x, y, z, xi, yi, zi, exp = Math.exp;
            // inverse A matrix and inverse logarithm
            xi = exp( 0.021547742011105847*r - 0.021969518919866274*g - 0.07027206572176435*b );
            yi = exp(-0.018152109501074376*r - 0.03004415376911152*g - 0.07729896865586937*b );
            zi = exp(-0.0014378861182725712*r + 0.050053456205559545*g - 0.07724195758868482*b );
            // inverse B matrix
            x = ( 1.0068824301911365*xi - 0.2924918682640871*yi + 0.13512537828457516*zi );
            y = ( 0.12021888110585245*xi + 0.9717816461525606*yi + 0.008672665360769691*zi );
            z = (-0.08782494811157235*xi + 0.07253363731909634*yi + 0.9932476695469974*zi );
            // XYZ to RGB
            ccc[p+0] = ( 3.240479*x - 1.537150*y - 0.498535*z )|0;
            ccc[p+1] = (-0.969256*x + 1.875992*y + 0.041556*z )|0;
            ccc[p+2] = ( 0.055648*x - 0.204043*y + 1.057311*z )|0;
            return ccc;
        },

        // http://en.wikipedia.org/wiki/YCbCr
        RGB2YCbCr: function(ccc, p) {
            //p = p || 0;
            var r = ccc[p+0], g = ccc[p+1], b = ccc[p+2];
            // each take full range from 0-255
            ccc[p+0] = ( 0   + 0.299*r    + 0.587*g     + 0.114*b    )|0;
            ccc[p+1] = ( 128 - 0.168736*r - 0.331264*g  + 0.5*b      )|0;
            ccc[p+2] = ( 128 + 0.5*r      - 0.418688*g  - 0.081312*b )|0;
            return ccc;
        },

        // http://en.wikipedia.org/wiki/YCbCr
        YCbCr2RGB: function(ccc, p) {
            //p = p || 0;
            var y = ccc[p+0], cb = ccc[p+1], cr = ccc[p+2];
            // each take full range from 0-255
            ccc[p+0] = ( y                      + 1.402   * (cr-128) )|0;
            ccc[p+1] = ( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) )|0;
            ccc[p+2] = ( y + 1.772   * (cb-128) )|0;
            return ccc;
        },

        RGB2HSV: function(ccc, p, unscaled)  {
            //p = p || 0;
            var hsv = rgb2hsv(ccc[p+0], ccc[p+1], ccc[p+2]);
            ccc[p+0] = unscaled ? hsv[0] : hsv[0]*255/360;
            ccc[p+1] = unscaled ? hsv[1] : hsv[1]*2.55;
            ccc[p+2] = unscaled ? hsv[2] : hsv[2]*2.55;
            return ccc;
        },

        RGB2HSL: function(ccc, p, unscaled)  {
            //p = p || 0;
            var hsl = rgb2hsl(ccc[p+0], ccc[p+1], ccc[p+2]);
            ccc[p+0] = unscaled ? hsl[0] : hsl[0]*255/360;
            ccc[p+1] = unscaled ? hsl[1] : hsl[1]*2.55;
            ccc[p+2] = unscaled ? hsl[2] : hsl[2]*2.55;
            return ccc;
        },

        RGB2HWB: function(ccc, p, unscaled)  {
            //p = p || 0;
            var hsl = rgb2hwb(ccc[p+0], ccc[p+1], ccc[p+2]);
            ccc[p+0] = unscaled ? hsl[0] : hsl[0]*255/360;
            ccc[p+1] = unscaled ? hsl[1] : hsl[1]*2.55;
            ccc[p+2] = unscaled ? hsl[2] : hsl[2]*2.55;
            return ccc;
        },

        HSV2RGB: function(ccc, p, unscaled) {
            //p = p || 0;
            var rgb = hsv2rgb(ccc[p+0]*(unscaled ? 1 : 360/255), ccc[p+1]*(unscaled ? 1 : 100/255), ccc[p+2]*(unscaled ? 1 : 100/255));
            ccc[p+0] = rgb[0];
            ccc[p+1] = rgb[1];
            ccc[p+2] = rgb[2];
            return ccc;
        },

        HSL2RGB: function(ccc, p, unscaled) {
            //p = p || 0;
            var rgb = hsl2rgb(ccc[p+0]*(unscaled ? 1 : 360/255), ccc[p+1]*(unscaled ? 1 : 100/255), ccc[p+2]*(unscaled ? 1 : 100/255));
            ccc[p+0] = rgb[0];
            ccc[p+1] = rgb[1];
            ccc[p+2] = rgb[2];
            return ccc;
        },

        HWB2RGB: function(ccc, p, unscaled) {
            //p = p || 0;
            var rgb = hwb2rgb(ccc[p+0]*(unscaled ? 1 : 360/255), ccc[p+1]*(unscaled ? 1 : 100/255), ccc[p+2]*(unscaled ? 1 : 100/255));
            ccc[p+0] = rgb[0];
            ccc[p+1] = rgb[1];
            ccc[p+2] = rgb[2];
            return ccc;
        },

        RGB2CMYK: function(ccc, p)  {
            //p = p || 0;
            var c = 0, m = 0, y = 0, k = 0, invCMY,
                r = ccc[p+0], g = ccc[p+1], b = ccc[p+2];

            // BLACK, k=255
            if (0 === r && 0 === g && 0 === b) return ccc;

            c = 255 - r;
            m = 255 - g;
            y = 255 - b;

            k = min(c, m, y);
            invCMY = 255 === k ? 0 : 255 / (255 - k);
            ccc[p+0] = (c - k) * invCMY;
            ccc[p+1] = (m - k) * invCMY;
            ccc[p+2] = (y - k) * invCMY;

            return ccc;
        },

        toString: function() {
            return "[" + "FILTER: " + this.name + "]";
        },

        C2F: C2F,
        C2P: C2P,
        P2C: P2C,

        // color format regexes
        hexieRE: /^#([0-9a-fA-F]{8})\b/,
        hexRE: /^#([0-9a-fA-F]{3,6})\b/,
        rgbRE: /^(rgba?)\b\s*\(([^\)]*)\)/i,
        hslRE: /^(hsla?)\b\s*\(([^\)]*)\)/i,
        colorstopRE: /^\s+(\d+(\.\d+)?%?)/,

        // color format conversions
        // http://www.rapidtables.com/convert/color/index.htm
        col2per: function(c, suffix) {
            return (c*C2P)+(suffix||'');
        },
        per2col: function(c) {
            return c*P2C;
        },

        rgb2hex: function(r, g, b, condenced, asPercent) {
            var hex;
            if (asPercent)
            {
                r = clamp(round(r*P2C), 0, 255);
                g = clamp(round(g*P2C), 0, 255);
                b = clamp(round(b*P2C), 0, 255);
            }
            r = r < 16 ? '0'+r.toString(16) : r.toString(16);
            g = g < 16 ? '0'+g.toString(16) : g.toString(16);
            b = b < 16 ? '0'+b.toString(16) : b.toString(16);
            hex = condenced && (r[0]===r[1] && g[0]===g[1] && b[0]===b[1]) ? ('#'+r[0]+g[0]+b[0]) : ('#'+r+g+b);
            return hex;
        },
        rgb2hexIE: function(r, g, b, a, asPercent) {
            var hex;
            if (asPercent)
            {
                r = clamp(round(r*P2C), 0, 255);
                g = clamp(round(g*P2C), 0, 255);
                b = clamp(round(b*P2C), 0, 255);
                a = clamp(round(a*P2C), 0, 255);
            }

            r = r < 16 ? '0'+r.toString(16) : r.toString(16);
            g = g < 16 ? '0'+g.toString(16) : g.toString(16);
            b = b < 16 ? '0'+b.toString(16) : b.toString(16);
            a = a < 16 ? '0'+a.toString(16) : a.toString(16);
            hex = '#' + a + r + g + b;

            return hex;
        },
        hex2rgb: function(h/*, asPercent*/) {
            if (!h || 3 > h.length) return [0, 0, 0];

            return 6 > h.length ? [
                clamp(parseInt(h[0]+h[0], 16), 0, 255),
                clamp(parseInt(h[1]+h[1], 16), 0, 255),
                clamp(parseInt(h[2]+h[2], 16), 0, 255)
            ] : [
                clamp(parseInt(h[0]+h[1], 16), 0, 255),
                clamp(parseInt(h[2]+h[3], 16), 0, 255),
                clamp(parseInt(h[4]+h[5], 16), 0, 255)
            ];
            /*if (asPercent)
                rgb = [
                    (rgb[0]*C2P)+'%',
                    (rgb[1]*C2P)+'%',
                    (rgb[2]*C2P)+'%'
                ];*/
        },
        hue2rgb: function(p, q, t) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        },
        hsl2rgb: function(h, s, l) {
            return hsl2rgb(h, s, l);
        },
        hsv2rgb: function(h, s, v) {
            return hsv2rgb(h, s, v);
        },
        hwb2rgb: function(h, w, b) {
            return hwb2rgb(h, w, b);
        },
        rgb2hsl: function(r, g, b, asPercent) {
            return rgb2hsl(r, g, b, asPercent);
        },
        rgb2hsv: function(r, g, b, asPercent) {
            return rgb2hsv(r, g, b, asPercent);
        },
        rgb2hwb: function(r, g, b, asPercent) {
            return rgb2hwb(r, g, b, asPercent);
        },
        rgb2cmyk: function(r, g, b, asPercent) {
            return rgb2cmyk(r, g, b, asPercent);
        },
        cmyk2rgb: function(c, m, y, k) {
            return cmyk2rgb(c, m, y, k);
        },

        parse: function(s, parsed, onlyColor) {
            var m, m2, s2, end = 0, end2 = 0, c, hasOpacity;

            if ('hsl' === parsed ||
                (!parsed && (m = s.match(Color.hslRE)))
            )
            {
                // hsl(a)
                if ('hsl' === parsed)
                {
                    hasOpacity = 'hsla' === s[0].toLowerCase();
                    var col = s[1].split(',').map(trim);
                }
                else
                {
                    end = m[0].length;
                    end2 = 0;
                    hasOpacity = 'hsla' === m[1].toLowerCase();
                    var col = m[2].split(',').map(trim);
                }

                var h = col[0] ? col[0] : '0';
                var s = col[1] ? col[1] : '0';
                var l = col[2] ? col[2] : '0';
                var a = hasOpacity && null!=col[3] ? col[3] : '1';

                h = parseFloat(h, 10);
                s = ('%'===s.slice(-1)) ? parseFloat(s, 10) : parseFloat(s, 10)*C2P;
                l = ('%'===l.slice(-1)) ? parseFloat(l, 10) : parseFloat(l, 10)*C2P;
                a = parseFloat(a, 10);

                c = new Color().fromHSL([h, s, l, a]);

                return onlyColor ? c : [c, 0, end+end2];
            }
            if ('rgb' === parsed ||
                (!parsed && (m = s.match(Color.rgbRE)))
            )
            {
                // rgb(a)
                if ('rgb' === parsed)
                {
                    hasOpacity = 'rgba' === s[0].toLowerCase();
                    var col = s[1].split(',').map(trim);
                }
                else
                {
                    end = m[0].length;
                    end2 = 0;
                    hasOpacity = 'rgba' === m[1].toLowerCase();
                    var col = m[2].split(',').map(trim);
                }

                var r = col[0] ? col[0] : '0';
                var g = col[1] ? col[1] : '0';
                var b = col[2] ? col[2] : '0';
                var a = hasOpacity && null!=col[3] ? col[3] : '1';

                r = ('%'===r.slice(-1)) ? parseFloat(r, 10)*2.55 : parseFloat(r, 10);
                g = ('%'===g.slice(-1)) ? parseFloat(g, 10)*2.55 : parseFloat(g, 10);
                b = ('%'===b.slice(-1)) ? parseFloat(b, 10)*2.55 : parseFloat(b, 10);
                a = parseFloat(a, 10);

                c = new Color().fromRGB([r, g, b, a]);

                return onlyColor ? c : [c, 0, end+end2];
            }
            if ('hex' === parsed ||
                (!parsed && (m = s.match(Color.hexRE)))
            )
            {
                // hex
                if ('hex' === parsed)
                {
                    var col = Color.hex2rgb(s[0]);
                }
                else
                {
                    end = m[0].length;
                    end2 = 0;
                    var col = Color.hex2rgb(m[1]);
                }

                var h1 = col[0] ? col[0] : 0x00;
                var h2 = col[1] ? col[1] : 0x00;
                var h3 = col[2] ? col[2] : 0x00;
                var a = null!=col[3] ? col[3] : 0xff;

                c = new Color().fromHEX([h1, h2, h3, a]);

                return onlyColor ? c : [c, 0, end+end2];
            }
            return null;
        },
        fromString: function(s, parsed) {
            return Color.parse(s, parsed, 1);
        },
        fromRGB: function(rgb) {
            return new Color().fromRGB(rgb);
        },
        fromHSL: function(hsl) {
            return new Color().fromHSL(hsl);
        },
        fromHSV: function(hsv) {
            return new Color().fromHSV(hsv);
        },
        fromHWB: function(hwb) {
            return new Color().fromHWB(hwb);
        },
        fromCMYK: function(cmyk) {
            return new Color().fromCMYK(cmyk);
        },
        fromHEX: function(hex) {
            return new Color().fromHEX(hex);
        },
        fromPixel: function(pixCol) {
            return new Color().fromPixel(pixCol);
        }
    },

    constructor: function Color(color) {
        // constructor factory pattern used here also
        if (this instanceof Color)
        {
            this.reset();
            if (color) this.set(color);
        }
        else
        {
            return new Color(color);
        }
    },

    name: "Color",
    col: null,
    kword: null,

    clone: function() {
        var c = new Color();
        c.col = this.col.slice();
        c.kword = this.kword;
        return c;
    },

    reset: function() {
        this.col = [0, 0, 0, 1];
        this.kword = null;
        return this;
    },

    set: function(color) {
        if (color)
        {
            if (null != color[0])
                this.col[0] = clamp(color[0], 0, 255);
            if (null != color[1])
                this.col[1] = clamp(color[1], 0, 255);
            if (null != color[2])
                this.col[2] = clamp(color[2], 0, 255);
            if (null != color[3])
                this.col[3] = clamp(color[3], 0, 1);
            else
                this.col[3] = 1;

            this.kword = null;
        }
        return this;
    },

    isTransparent: function() {
        return 1 > this.col[3];
    },

    fromPixel: function(color) {
        color = color || 0;
        this.col = [
            clamp((color>>16)&255, 0, 255),
            clamp((color>>8)&255, 0, 255),
            clamp((color)&255, 0, 255),
            clamp(((color>>24)&255)*C2F, 0, 1)
        ];
        this.kword = null;

        return this;
    },

    fromHEX: function(hex) {

        this.col[0] = hex[0] ? clamp(parseInt(hex[0], 10), 0, 255) : 0;
        this.col[1] = hex[1] ? clamp(parseInt(hex[1], 10), 0, 255) : 0;
        this.col[2] = hex[2] ? clamp(parseInt(hex[2], 10), 0, 255) : 0;
        this.col[3] = null!=hex[3] ? clamp(parseInt(hex[3], 10)*C2F, 0, 1) : 1;

        this.kword = null;

        return this;
    },

    fromRGB: function(rgb) {

        this.col[0] = rgb[0] ? clamp(round(rgb[0]), 0, 255) : 0;
        this.col[1] = rgb[1] ? clamp(round(rgb[1]), 0, 255) : 0;
        this.col[2] = rgb[2] ? clamp(round(rgb[2]), 0, 255) : 0;
        this.col[3] = null!=rgb[3] ? clamp(rgb[3], 0, 1) : 1;

        this.kword = null;

        return this;
    },

    fromCMYK: function(cmyk) {
        var rgb = cmyk2rgb(cmyk[0]||0, cmyk[1]||0, cmyk[2]||0, cmyk[3]||0);

        this.col[0] = rgb[0];
        this.col[1] = rgb[1];
        this.col[2] = rgb[2];
        this.col[3] = null!=cmyk[4] ? clamp(cmyk[4], 0, 1) : 1;

        this.kword = null;

        return this;
    },

    fromHSL: function(hsl) {
        var rgb = hsl2rgb(hsl[0]||0, hsl[1]||0, hsl[2]||0);

        this.col[0] = rgb[0];
        this.col[1] = rgb[1];
        this.col[2] = rgb[2];
        this.col[3] = null!=hsl[3] ? clamp(hsl[3], 0, 1) : 1;

        this.kword = null;

        return this;
    },

    fromHSV: function(hsv) {
        var rgb = hsv2rgb(hsv[0]||0, hsv[1]||0, hsv[2]||0);

        this.col[0] = rgb[0];
        this.col[1] = rgb[1];
        this.col[2] = rgb[2];
        this.col[3] = null!=hsv[3] ? clamp(hsv[3], 0, 1) : 1;

        this.kword = null;

        return this;
    },

    fromHWB: function(hwb) {
        var rgb = hwb2rgb(hwb[0]||0, hwb[1]||0, hwb[2]||0);

        this.col[0] = rgb[0];
        this.col[1] = rgb[1];
        this.col[2] = rgb[2];
        this.col[3] = null!=hwb[3] ? clamp(hwb[3], 0, 1) : 1;

        this.kword = null;

        return this;
    },

    toPixel: function(withTransparency) {
        if (withTransparency)
            return ((clamp(this.col[3]*255, 0, 255) << 24) | (this.col[0] << 16) | (this.col[1] << 8) | (this.col[2])&255);
        else
            return ((this.col[0] << 16) | (this.col[1] << 8) | (this.col[2])&255);
    },

    toCMYK: function(asString, condenced, noTransparency) {
        var cmyk = rgb2cmyk(this.col[0], this.col[1], this.col[2]);
        if (noTransparency)
            return cmyk;
        else
            return cmyk.concat(this.col[3]);
    },

    toHEX: function(asString, condenced, withTransparency) {
        if (withTransparency)
            return Color.rgb2hexIE(this.col[0], this.col[1], this.col[2], clamp(round(255*this.col[3]), 0, 255));
        else
            return Color.rgb2hex(this.col[0], this.col[1], this.col[2], condenced);
    },

    toRGB: function(asString, condenced, noTransparency) {
        var opcty = this.col[3];
        if (asString)
        {
            if (condenced)
            {
                opcty =  ((1 > opcty && opcty > 0) ? opcty.toString().slice(1) : opcty);
            }

            if (noTransparency || 1 == this.col[3])
                return 'rgb(' + this.col.slice(0, 3).join(',') + ')';
            else
                return 'rgba(' + this.col.slice(0, 3).concat(opcty).join(',') + ')';
        }
        else
        {
            if (noTransparency)
                return this.col.slice(0, 3);
            else
                return this.col.slice();
        }
    },

    toHSL: function(asString, condenced, noTransparency) {
        var opcty = this.col[3];
        var hsl = rgb2hsl(this.col[0], this.col[1], this.col[2]);

        if (asString)
        {
            if (condenced)
            {
                hsl[1] = (0==hsl[1] ? hsl[1] : (hsl[1]+'%'));
                hsl[2] = (0==hsl[2] ? hsl[2] : (hsl[2]+'%'));
                opcty =  ((1 > opcty && opcty > 0) ? opcty.toString().slice(1) : opcty );
            }

            if (noTransparency || 1 == this.col[3])
                return 'hsl(' + [hsl[0], hsl[1], hsl[2]].join(',') + ')';
            else
                return 'hsla(' + [hsl[0], hsl[1], hsl[2], opcty].join(',') + ')';
        }
        else
        {
            if (noTransparency)
                return hsl;
            else
                return hsl.concat(this.col[3]);
        }
    },

    toString: function(format, condenced) {
        format = format ? format.toLowerCase() : 'hex';
        if ('rgb' == format || 'rgba' == format)
        {
            return this.toRGB(1, false!==condenced, 'rgb' == format);
        }
        else if ('hsl' == format || 'hsla' == format)
        {
            return this.toHSL(1, false!==condenced, 'hsl' == format);
        }
        return this.toHEX(1, false!==condenced, 'hexie' == format);
    }
});
// aliases and utilites
Color.toGray = Color.intensity;

}(FILTER);/**
*
* Image Proxy Class
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var PROTO = 'prototype', DPR = 1,// / FILTER.devicePixelRatio,
    IMG = FILTER.ImArray,
    CHANNEL = FILTER.CHANNEL,
    Color = FILTER.Color,
    copy = FILTER.Util.Array.copy,
    subarray = FILTER.Util.Array.subarray,
    clamp = FILTER.Util.Math.clamp,
    stdMath = Math, Min = stdMath.min,
    Floor = stdMath.floor,

    ID = 0,
    RED = 1 << CHANNEL.R,
    GREEN = 1 << CHANNEL.G,
    BLUE = 1 << CHANNEL.B,
    ALPHA = 1 << CHANNEL.A,
    ALL_CHANNELS = RED | GREEN | BLUE | ALPHA,
    IDATA = 1, ODATA = 2, ISEL = 4, OSEL = 8,
    WIDTH = 2, HEIGHT = 4, WIDTH_AND_HEIGHT = WIDTH | HEIGHT,
    SEL = ISEL | OSEL, DATA = IDATA | ODATA,
    CLEAR_DATA = ~DATA, CLEAR_SEL = ~SEL
;

// Image (Proxy) Class
var FilterImage = FILTER.Image = FILTER.Class({
    name: "Image"

    ,constructor: function FilterImage(img) {
        var self = this, w = 0, h = 0;
        // factory-constructor pattern
        if (!(self instanceof FilterImage)) return new FilterImage(img);
        self.id = ++ID;
        self.width = w;
        self.height = h;
        self.iCanvas = FILTER.Canvas(w, h);
        self.oCanvas = FILTER.Canvas(w, h);
        self.domElement = self.oCanvas;
        self.iData = null;
        self.iDataSel = null;
        self.oData = null;
        self.oDataSel = null;
        self._restorable = true;
        self.gray = false;
        self.selection = null;
        self._refresh = 0;
        self.nref = 0;
        self.cache = {};
        self._refresh |= DATA | SEL;
        if (img) self.image(img);
    }

    // properties
    ,id: null
    ,width: 0
    ,height: 0
    ,gray: false
    ,selection: null
    ,iCanvas: null
    ,oCanvas: null
    ,gl: null
    ,iData: null
    ,iDataSel: null
    ,oData: null
    ,oDataSel: null
    ,domElement: null
    ,_restorable: true
    ,_refresh: 0
    ,nref: 0
    ,cache: null

    ,dispose: function() {
        var self = this;
        FILTER.disposeGL(self);
        self.id = null;
        self.width = self.height = null;
        self.selection = self.gray = null;
        self.iData = self.iDataSel = self.oData = self.oDataSel = null;
        self.domElement = self.iCanvas = self.oCanvas = self.gl = null;
        self._restorable = null;
        self._refresh = self.nref = null;
        self.cache = null;
        return self;
    }

    ,clone: function(original) {
        return new FilterImage(true === original ? this.iCanvas : this.oCanvas);
    }

    ,grayscale: function(bool) {
        var self = this;
        if (!arguments.length) return self.gray;
        self.gray = !!bool;
        return self;
    }

    ,restorable: function(enabled) {
        var self = this;
        if (!arguments.length) enabled = true;
        self._restorable = !!enabled;
        return self;
    }

    // apply a filter (uses filter's own apply method)
    ,apply: function(filter, cb) {
        filter.apply(this, this, cb);
        return this;
    }

    // apply2 a filter using another image as destination
    ,apply2: function(filter, destImg, cb) {
        filter.apply(this, destImg, cb);
        return this;
    }

    ,select: function(x1, y1, x2, y2, absolute) {
        var self = this, argslen = arguments.length;
        if (false === x1)
        {
            // deselect
            self.selection = null;
            self.iDataSel = null;
            self.oDataSel = null;
            self._refresh &= CLEAR_SEL;
        }
        else
        {
            // default
            if (argslen < 1) x1 = 0;
            if (argslen < 2) y1 = 0;
            if (argslen < 3) x2 = 1;
            if (argslen < 4) y2 = 1;
            // select
            self.selection = absolute ? [
                // clamp
                0 > x1 ? 0 : x1,
                0 > y1 ? 0 : y1,
                0 > x2 ? 0 : x2,
                0 > y2 ? 0 : y2,
                0
            ] : [
                // clamp
                0 > x1 ? 0 : (1 < x1 ? 1 : x1),
                0 > y1 ? 0 : (1 < y1 ? 1 : y1),
                0 > x2 ? 0 : (1 < x2 ? 1 : x2),
                0 > y2 ? 0 : (1 < y2 ? 1 : y2),
                1
            ];
            self._refresh |= SEL;
        }
        self.nref = (self.nref+1) % 1000;
        return self;
    }

    ,deselect: function() {
        return this.select(false);
    }

    // store the processed/filtered image as the original image
    // make the processed image the original image
    ,store: function() {
        var self = this;
        if (self._restorable)
        {
            self.iCanvas.getContext('2d').drawImage(self.oCanvas, 0, 0);
            self._refresh |= IDATA;
            if (self.selection) self._refresh |= ISEL;
            self.nref = (self.nref+1) % 1000;
        }
        return self;
    }

    // restore the original image
    // remove any filters applied to original image
    ,restore: function() {
        var self = this;
        if (self._restorable)
        {
            self.oCanvas.getContext('2d').drawImage(self.iCanvas, 0, 0);
            self._refresh |= ODATA;
            if (self.selection) self._refresh |= OSEL;
            self.nref = (self.nref+1) % 1000;
        }
        return self;
    }

    ,dimensions: function(w, h) {
        var self = this;
        if (set_dimensions(self, w, h, WIDTH_AND_HEIGHT))
        {
            self._refresh |= DATA;
            if (self.selection) self._refresh |= SEL;
            self.nref = (self.nref+1) % 1000;
        }
        return self;
    }
    ,setDimensions: null

    ,scale: function(sx, sy) {
        var self = this, w = self.width, h = self.height;
        sx = sx || 1; sy = sy || sx;
        if ((1 === sx) && (1 === sy)) return self;

        // lazy
        var tmpCanvas = FILTER.Canvas(DPR*w, DPR*h),
            ctx = tmpCanvas.getContext('2d');

        ctx.scale(sx, sy);
        w = self.width = stdMath.round(sx*w);
        h = self.height = stdMath.round(sy*h);

        ctx.drawImage(self.oCanvas, 0, 0);
        self.oCanvas.width = DPR*w;
        self.oCanvas.height = DPR*h;
        /*if (self.oCanvas.style)
        {
            self.oCanvas.style.width = String(w) + 'px';
            self.oCanvas.style.height = String(h) + 'px';
        }*/
        self.oCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);

        if (self._restorable)
        {
            ctx.drawImage(self.iCanvas, 0, 0);
            self.iCanvas.width = self.oCanvas.width;
            self.iCanvas.height = self.oCanvas.height;
            /*if (self.iCanvas.style)
            {
                self.iCanvas.style.width = self.oCanvas.style.width;
                self.iCanvas.style.height = self.oCanvas.style.height;
            }*/
            self.iCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);
        }

        self._refresh |= DATA;
        if (self.selection) self._refresh |= SEL;
        self.nref = (self.nref+1) % 1000;
        return self;
    }

    ,flipHorizontal: function() {
        var self = this, w = self.oCanvas.width, h = self.oCanvas.height;
        // lazy
        var tmpCanvas = FILTER.Canvas(w, h),
            ctx = tmpCanvas.getContext('2d');

        ctx.translate(w, 0);
        ctx.scale(-1, 1);

        ctx.drawImage(self.oCanvas, 0, 0);
        self.oCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);

        if (self._restorable)
        {
            ctx.drawImage(self.iCanvas, 0, 0);
            self.iCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);
        }

        self._refresh |= DATA;
        if (self.selection) self._refresh |= SEL;
        self.nref = (self.nref+1) % 1000;
        return self;
    }

    ,flipVertical: function() {
        var self = this, w = self.oCanvas.width, h = self.oCanvas.height;
        // lazy
        var tmpCanvas = FILTER.Canvas(w, h),
            ctx = tmpCanvas.getContext('2d');

        ctx.translate(0, h);
        ctx.scale(1, -1);

        ctx.drawImage(self.oCanvas, 0, 0);
        self.oCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);

        if (self._restorable)
        {
            ctx.drawImage(self.iCanvas, 0, 0);
            self.iCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);
        }

        self._refresh |= DATA;
        if (self.selection) self._refresh |= SEL;
        self.nref = (self.nref+1) % 1000;
        return self;
    }

    // clear the image contents
    ,clear: function() {
        var self = this, w = self.oCanvas.width, h = self.oCanvas.height;
        if (w && h)
        {
            if (self._restorable) self.iCanvas.getContext('2d').clearRect(0, 0, w, h);
            self.oCanvas.getContext('2d').clearRect(0, 0, w, h);
            self._refresh |= DATA;
            if (self.selection) self._refresh |= SEL;
            self.nref = (self.nref+1) % 1000;
        }
        return self;
    }

    // crop image region
    ,crop: function(x1, y1, x2, y2) {
        var self = this, sel = self.selection,
            W = self.width, H = self.height,
            xf, yf, x, y, w, h;
        if (!arguments.length)
        {
            if (sel)
            {
                if (sel[4])
                {
                    xf = W - 1;
                    yf = H - 1;
                }
                else
                {
                    xf = 1;
                    yf = 1;
                }
                x = Floor(sel[0]*xf);
                y = Floor(sel[1]*yf);
                w = Floor(sel[2]*xf)-x+1;
                h = Floor(sel[3]*yf)-y+1;
                sel[0] = 0; sel[1] = 0;
                sel[2] = 1; sel[3] = 1;
                sel[4] = 1;
            }
            else
            {
                return self;
            }
        }
        else
        {
            x = x1;
            y = y1;
            w = x2-x1+1;
            h = y2-y1+1;
        }

        self.width = w;
        self.height = h;
        x *= DPR;
        y *= DPR;
        w *= DPR;
        h *= DPR;
        // lazy
        var tmpCanvas = FILTER.Canvas(w, h),
            ctx = tmpCanvas.getContext('2d');

        ctx.drawImage(self.oCanvas, x, y, w, h, 0, 0, w, h);
        self.oCanvas.width = w;
        self.oCanvas.height = h;
        /*if (self.oCanvas.style)
        {
            self.oCanvas.style.width = String(self.width) + 'px';
            self.oCanvas.style.height = String(self.height) + 'px';
        }*/
        self.oCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);
        if (self._restorable)
        {
            ctx.drawImage(self.iCanvas, x, y, w, h, 0, 0, w, h);
            self.iCanvas.width = self.oCanvas.width;
            self.iCanvas.height = self.oCanvas.height;
            /*if (self.iCanvas.style)
            {
                self.iCanvas.style.width = self.oCanvas.style.width;
                self.iCanvas.style.height = self.oCanvas.style.height;
            }*/
            self.iCanvas.getContext('2d').drawImage(tmpCanvas, 0, 0);
        }

        self._refresh |= DATA;
        if (sel) self._refresh |= SEL;
        self.nref = (self.nref+1) % 1000;
        return self;
    }

    // fill image region with a specific (background) color
    ,fill: function(color, x, y, w, h) {
        var self = this, sel = self.selection,
            W = self.width,
            H = self.height,
            xf, yf, xs, ys, ws, hs;

        if ((w && !W) || (h && !H))
        {
            set_dimensions(self, x+w, y+h, WIDTH_AND_HEIGHT);
            W = self.width;
            H = self.height;
        }

        if (sel)
        {
            if (sel[4])
            {
                xf = W - 1;
                yf = H - 1;
            }
            else
            {
                xf = 1;
                yf = 1;
            }
            xs = Floor(sel[0]*xf);
            ys = Floor(sel[1]*yf);
            ws = Floor(sel[2]*xf)-xs+1;
            hs = Floor(sel[3]*yf)-ys+1;
        }
        else
        {
            xs = 0; ys = 0;
            ws = W; hs = H;
        }
        if (null == x) x = xs;
        if (null == y) y = ys;
        if (null == w) w = ws;
        if (null == h) h = hs;

        if (w > ws) w = ws;
        if (h > hs) h = hs;
        x = clamp(x, xs, ws);
        y = clamp(y, ys, hs);

        var octx = self.oCanvas.getContext('2d'),
            ictx = self.iCanvas.getContext('2d');

        x *= DPR;
        y *= DPR;
        w *= DPR;
        h *= DPR;
        color = color || 0;
        if (self._restorable)
        {
            ictx.fillStyle = color;
            ictx.fillRect(x, y, w, h);
        }
        octx.fillStyle = color;
        octx.fillRect(x, y, w, h);

        self._refresh |= DATA;
        if (sel) self._refresh |= SEL;
        self.nref = (self.nref+1) % 1000;
        return self;
    }

    // get direct data array
    ,getData: function(processed) {
        var self = this, data;
        if (self._restorable && !processed)
        {
            if (self._refresh & IDATA) refresh_data(self, IDATA);
            data = self.iData;
        }
        else
        {
            if (self._refresh & ODATA) refresh_data(self, ODATA);
            data = self.oData;
        }
        // clone it
        return copy(data.data);
    }

    // get direct data array of selected part
    ,getSelectedData: function(processed) {
        var self = this, sel;

        if (self.selection)
        {
            if (self._restorable && !processed)
            {
                if (self._refresh & ISEL) refresh_selected_data(self, ISEL);
                sel = self.iDataSel;
            }
            else
            {
                if (self._refresh & OSEL) refresh_selected_data(self, OSEL);
                sel = self.oDataSel;
            }
        }
        else
        {
            if (self._restorable && !processed)
            {
                if (self._refresh & IDATA) refresh_data(self, IDATA);
                sel = self.iData;
            }
            else
            {
                if (self._refresh & ODATA) refresh_data(self, ODATA);
                sel = self.oData;
            }
        }
        // clone it
        return [copy(sel.data), sel.width, sel.height, 2];
    }

    // set direct data array
    ,setData: function(a) {
        var self = this;
        self.oCanvas.getContext('2d').putImageData(FILTER.Canvas.ImageData(a, self.oCanvas.width, self.oCanvas.height), 0, 0);
        self._refresh |= ODATA;
        if (self.selection) self._refresh |= OSEL;
        self.nref = (self.nref+1) % 1000;
        return self;
    }

    // set direct data array of selected part
    ,setSelectedData: function(a) {
        var self = this, sel = self.selection,
            w = self.width, h = self.height,
            xs, ys, ws, hs, xf, yf;
        if (sel)
        {
            if (sel[4])
            {
                xf = w - 1;
                yf = h - 1;
            }
            else
            {
                xf = 1;
                yf = 1;
            }
            xs = Floor(sel[0]*xf);
            ys = Floor(sel[1]*yf);
            ws = Floor(sel[2]*xf)-xs+1;
            hs = Floor(sel[3]*yf)-ys+1;
            self.oCanvas.getContext('2d').putImageData(FILTER.Canvas.ImageData(a, DPR*ws, DPR*hs), DPR*xs, DPR*ys);
        }
        else
        {
            self.oCanvas.getContext('2d').putImageData(FILTER.Canvas.ImageData(a, DPR*w, DPR*h), 0, 0);
        }
        self._refresh |= ODATA;
        if (self.selection) self._refresh |= OSEL;
        self.nref = (self.nref+1) % 1000;
        return self;
    }
    ,getDataFromSelection: function(x1, y1, x2, y2, absolute) {
        var self = this,
            ow = self.width-1,
            oh = self.height-1,
            fx = !absolute ? ow : 1,
            fy = !absolute ? oh : 1,
            ws, hs, data;
        x1 = DPR*Floor(x1*fx); y1 = DPR*Floor(y1*fy);
        x2 = DPR*Floor(x2*fx); y2 = DPR*Floor(y2*fy);
        ws = x2-x1+DPR; hs = y2-y1+DPR;
        data = self.oCanvas.getContext('2d').getImageData(x1, y1, ws, hs);
        if (!data) data = self.oCanvas.getContext('2d').createImageData(0, 0, ws, hs);
        return [copy(data.data), data.width, data.height, 2];
    }
    ,setDataToSelection: function(data, x1, y1, x2, y2, absolute) {
        var self = this,
            ow = self.width-1,
            oh = self.height-1,
            fx = !absolute ? ow : 1,
            fy = !absolute ? oh : 1,
            ws, hs, data;
        x1 = DPR*Floor(x1*fx); y1 = DPR*Floor(y1*fy);
        x2 = DPR*Floor(x2*fx); y2 = DPR*Floor(y2*fy);
        ws = x2-x1+DPR; hs = y2-y1+DPR;
        self.oCanvas.getContext('2d').putImageData(FILTER.Canvas.ImageData(data, ws, hs), x1, y1);
        self._refresh |= ODATA;
        if (self.selection) self._refresh |= OSEL;
        self.nref = (self.nref+1) % 1000;
        return self;
    }
    ,mapReduce: function(mappings, reduce, done) {
        var self = this, completed = 0, missing = 0;
        mappings.forEach(function(mapping, index) {
            if (!mapping || !mapping.filter) {++missing; return;}
            var from = mapping.from || {x:0, y:0},
                to = mapping.to || {x:self.width-1, y:self.height-1},
                absolute = mapping.absolute,
                data = self.getDataFromSelection(from.x, from.y, to.x, to.y, absolute);
            mapping.filter.apply_(self, data[0], data[1], data[2], function(resultData, processorFilter) {
                ++completed;
                reduce(self, resultData, from, to, absolute, processorFilter, index);
                if ((completed+missing === mappings.length) && done) done(self);
            });
        });
        if ((missing === mappings.length) && done) done(self);
        return self;
    }

    ,image: function(img, sw, sh, sx, sy, dx, dy) {
        if (!img) return this;
        if (arguments.length > 1) return this.image_s(img, sw, sh, sx, sy, dx, dy);

        var self = this, w, h,
            isVideo, isCanvas, isImage//, isImageData
        ;

        if (img instanceof FilterImage) img = img.oCanvas;
        isVideo = ("undefined" !== typeof HTMLVideoElement) && (img instanceof HTMLVideoElement);
        isCanvas = (img instanceof self.oCanvas.constructor);
        isImage = (img instanceof FILTER.Canvas.Image().constructor);
        //isImageData = (null != img.data && null != img.width && null != img.height);

        if (isVideo)
        {
            w = img.videoWidth;
            h = img.videoHeight;
        }
        else
        {
            w = img.width;
            h = img.height;
        }

        set_dimensions(self, w, h, WIDTH_AND_HEIGHT);
        if (isImage || isCanvas || isVideo)
        {
            if (self._restorable) self.iCanvas.getContext('2d').drawImage(img, 0, 0, self.iCanvas.width, self.iCanvas.height);
            self.oCanvas.getContext('2d').drawImage(img, 0, 0, self.oCanvas.width, self.oCanvas.height);
        }
        else
        {
            if (self._restorable) self.iCanvas.getContext('2d').putImageData(img, 0, 0);
            self.oCanvas.getContext('2d').putImageData(img, 0, 0);
        }
        self._refresh |= DATA;
        if (self.selection) self._refresh |= SEL;
        self.nref = (self.nref+1) % 1000;
        return self;
    }
    ,image_s: function(img, sw, sh, sx, sy, dx, dy, dw, dh) {
        if (!img) return this;

        var self = this, w, h,
            isVideo, isCanvas, isImage//, isImageData
        ;

        if (img instanceof FilterImage) img = img.oCanvas;
        isVideo = ("undefined" !== typeof HTMLVideoElement) && (img instanceof HTMLVideoElement);
        isCanvas = (img instanceof self.oCanvas.constructor);
        isImage = (img instanceof FILTER.Canvas.Image().constructor);
        //isImageData = (null != img.data && null != img.width && null != img.height);

        sx = sx || 0;
        sy = sy || 0;
        dx = dx || 0;
        dy = dy || 0;
        if (isImage || isCanvas || isVideo)
        {
            if (self._restorable) self.iCanvas.getContext('2d').drawImage(img, sx, sy, sw, sh, dx, dy, self.iCanvas.width, self.iCanvas.height);
            self.oCanvas.getContext('2d').drawImage(img, sx, sy, sw, sh, dx, dy, self.oCanvas.width, self.oCanvas.height);
        }
        else
        {
            if (self._restorable) self.iCanvas.getContext('2d').putImageData(img, dx, dy, sx, sy, sw, sh);
            self.oCanvas.getContext('2d').putImageData(img, dx, dy, sx, sy, sw, sh);
        }
        self._refresh |= DATA;
        if (self.selection) self._refresh |= SEL;
        self.nref = (self.nref+1) % 1000;
        return self;
    }
    ,setImage: null

    ,toImage: function(cb, type) {
        // only PNG image, toDataURL may return a promise
        var uri = this.oCanvas.toDataURL('image/png'),
            ret = function(uri) {
                    if ('uri' !== type)
                    {
                        var img = FILTER.Canvas.Image();
                        img.src = uri;
                        cb(img);
                    }
                    else
                    {
                        cb(uri);
                    }
            };
        if (('function' === typeof uri.then) && ('function' === typeof uri.catch))
        {
            // promise
            uri.then(ret).catch(function() {});
        }
        else
        {
            ret(uri);
        }
    }

    ,toString: function( ) {
        return "[" + "FILTER Image: " + this.name + "(" + this.id + ")]";
    }
});
FilterImage.load = function(src, done) {
    // instantiate and load Filter.Image from src
    var im = FILTER.Canvas.Image(), img = new FilterImage();
    if ('onload' in im)
    {
        im.onload = function() {
            img.image(im);
            if ('function' === typeof done) done(img);
        };
        /*im.onerror = function() {
            if ('function' === typeof done) done();
        };*/
    }
    im.src = src;
    return img;
};
// aliases
FilterImage[PROTO].setImage = FilterImage[PROTO].image;
FilterImage[PROTO].setDimensions = FilterImage[PROTO].dimensions;

// auxilliary (private) methods
function set_dimensions(scope, w, h, what)
{
    what = what || WIDTH_AND_HEIGHT;
    var ws, hs, ret = false, is_selection = !!scope.selection;
    if (is_selection)
    {
        var sel = scope.selection,
            ow = scope.width-1,
            oh = scope.height-1,
            xs = sel[0],
            ys = sel[1],
            xf = sel[2],
            yf = sel[3],
            fx = sel[4] ? ow : 1,
            fy = sel[4] ? oh : 1;
        xs = DPR*Floor(xs*fx); ys = DPR*Floor(ys*fy);
        xf = DPR*Floor(xf*fx); yf = DPR*Floor(yf*fy);
        ws = xf-xs+DPR; hs = yf-ys+DPR;
    }
    else
    {
        ws = scope.width; hs = scope.height;
    }
    if ((what & WIDTH) && (ws !== w))
    {
        scope.width = stdMath.round(is_selection ? (scope.width/ws*w) : w);
        scope.oCanvas.width = DPR*scope.width;
        //if (scope.oCanvas.style) scope.oCanvas.style.width = String(scope.width) + 'px';
        if (scope._restorable)
        {
            scope.iCanvas.width = scope.oCanvas.width;
            //if (scope.iCanvas.style) scope.iCanvas.style.width = scope.oCanvas.style.width;
        }
        ret = true;
    }
    if ((what & HEIGHT) && (hs !== h))
    {
        scope.height = stdMath.round(is_selection ? (scope.height/hs*h) : h);
        scope.oCanvas.height = DPR*scope.height;
        //if (scope.oCanvas.style) scope.oCanvas.style.height = String(scope.height) + 'px';
        if (scope._restorable)
        {
            scope.iCanvas.height = scope.oCanvas.height;
            //if (scope.iCanvas.style) scope.iCanvas.style.height = scope.oCanvas.style.height;
        }
        ret = true;
    }
    return ret;
}
function refresh_data(scope, what)
{
    var w = scope.oCanvas.width, h = scope.oCanvas.height;
    what = what || 255;
    if (scope._restorable && (what & IDATA) && (scope._refresh & IDATA))
    {
        scope.iData = scope.iCanvas.getContext('2d').getImageData(0, 0, w, h);
        if (!scope.iData) scope.iData = scope.iCanvas.getContext('2d').createImageData(0, 0, w, h);
        scope._refresh &= ~IDATA;
    }
    if ((what & ODATA) && (scope._refresh & ODATA))
    {
        scope.oData = scope.oCanvas.getContext('2d').getImageData(0, 0, w, h);
        if (!scope.oData) scope.oData = scope.oCanvas.getContext('2d').createImageData(0, 0, w, h);
        scope._refresh &= ~ODATA;
    }
    return scope;
}
function refresh_selected_data(scope, what)
{
    if (scope.selection)
    {
        var sel = scope.selection,
            ow = scope.width-1,
            oh = scope.height-1,
            xs = sel[0],
            ys = sel[1],
            xf = sel[2],
            yf = sel[3],
            fx = sel[4] ? ow : 1,
            fy = sel[4] ? oh : 1,
            ws, hs;
        xs = DPR*Floor(xs*fx); ys = DPR*Floor(ys*fy);
        xf = DPR*Floor(xf*fx); yf = DPR*Floor(yf*fy);
        ws = xf-xs+DPR; hs = yf-ys+DPR;
        what = what || 255;
        if (scope._restorable && (what & ISEL) && (scope._refresh & ISEL))
        {
            scope.iDataSel = scope.iCanvas.getContext('2d').getImageData(xs, ys, ws, hs);
            if (!scope.iDataSel) scope.iDataSel = scope.iCanvas.getContext('2d').createImageData(0, 0, ws, hs);
            scope._refresh &= ~ISEL;
        }
        if ((what & OSEL) && (scope._refresh & OSEL))
        {
            scope.oDataSel = scope.oCanvas.getContext('2d').getImageData(xs, ys, ws, hs);
            if (!scope.oDataSel) scope.oDataSel = scope.oCanvas.getContext('2d').createImageData(0, 0, ws, hs);
            scope._refresh &= ~OSEL;
        }
    }
    return scope;
}
}(FILTER);/**
*
* Composite Filter Class
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var OP = Object.prototype, FP = Function.prototype, AP = Array.prototype,
    slice = AP.slice, splice = AP.splice, concat = AP.push;

// Composite Filter Stack  (a variation of Composite Design Pattern)
var CompositeFilter = FILTER.Create({
    name: "CompositeFilter"

    ,init: function CompositeFilter(filters) {
        var self = this;
        self.filters = filters && filters.length ? filters : [];
    }

    ,path: FILTER.Path
    ,filters: null
    ,hasInputs: true
    ,_stable: true

    ,dispose: function(withFilters) {
        var self = this, i, stack = self.filters;

        if (true === withFilters)
        {
            for (i=0; i<stack.length; ++i)
            {
                stack[i] && stack[i].dispose(withFilters);
                stack[i] = null;
            }
        }
        self.filters = null;
        self.$super('dispose');
        return self;
    }

    ,serializeInputs: function(curIm) {
        var self = this, i, stack = self.filters, l, inputs = [ ], hasInputs = false, input;
        for (i=0,l=stack.length; i<l; ++i)
        {
            inputs.push(input=stack[i].serializeInputs(curIm));
            if (input) hasInputs = true;
        }
        return hasInputs ? inputs : null;
    }

    ,unserializeInputs: function(inputs, curImData) {
        var self = this;
        if (!inputs) return self;
        var i, stack = self.filters, l;
        for (i=0,l=stack.length; i<l; ++i) if (inputs[i]) stack[i].unserializeInputs(inputs[i], curImData);
        return self;
    }

    ,serialize: function() {
        var self = this, i, stack = self.filters, l, filters = [];
        for (i=0,l=stack.length; i<l; ++i) filters.push(stack[i].serializeFilter());
        return {_stable: self._stable, filters: filters};
    }

    ,unserialize: function(params) {
        var self = this, i, l, ls, filters, filter, stack = self.filters;

        self._stable = params._stable;
        filters = params.filters || [];
        l = filters.length; ls = stack.length;

        if ((l !== ls) || (!self._stable))
        {
            // dispose any prev filters
            for (i=0; i<ls; ++i)
            {
                stack[i] && stack[i].dispose(true);
                stack[i] = null;
            }
            stack = [];

            for (i=0; i<l; ++i)
            {
                filter = filters[i] && filters[i].filter ? FILTER.Filter.get(filters[i].filter) : null;
                if (filter)
                {
                    stack.push((new filter()).unserializeFilter(filters[i]));
                }
                else
                {
                    throw new Error('Filter "' + filters[i].filter + '" could not be created');
                    return;
                }
            }
            self.filters = stack;
        }
        else
        {
            for (i=0; i<l; ++i) stack[i].unserializeFilter(filters[i]);
        }
        return self;
    }

    ,setMetaData: function(meta, serialisation) {
        var self = this, stack = self.filters, i, l;
        if (meta && meta.filters && (l=meta.filters.length) && stack.length)
            for (i=0; i<l; ++i) stack[meta.filters[i][0]].setMetaData(meta.filters[i][1], serialisation);
        if (meta && (null != meta._IMG_WIDTH))
        {
            self.meta = {_IMG_WIDTH: meta._IMG_WIDTH, _IMG_HEIGHT: meta._IMG_HEIGHT};
            self.hasMeta = true;
        }
        return self;
    }

    ,stable: function(bool) {
        if (!arguments.length) bool = true;
        this._stable = !!bool;
        return this;
    }

    // manipulate the filter chain, methods
    ,set: function(filters) {
        if (filters && filters.length) this.filters = filters;
        this._glsl = null;
        return this;
    }

    ,filter: function(i, filter) {
        if (arguments.length > 1)
        {
            if (this.filters.length > i) this.filters[i] = filter;
            else this.filters.push(filter);
            this._glsl = null;
            return this;
        }
        else
        {
            return this.filters.length > i ? this.filters[i] : null;
        }
    }
    ,get: null

    ,push: function(/* variable args here.. */) {
        if (arguments.length) concat.apply(this.filters, arguments);
        this._glsl = null;
        return this;
    }
    ,concat: null

    ,pop: function() {
        this._glsl = null;
        return this.filters.pop();
    }

    ,shift: function() {
        this._glsl = null;
        return this.filters.shift();
    }

    ,unshift: function(/* variable args here.. */) {
        if (arguments.length) splice.apply(this.filters, concat.apply([0, 0], arguments));
        this._glsl = null;
        return this;
    }

    ,insertAt: function(i /*, filter1, filter2, filter3..*/) {
        var args = slice.call(arguments), arglen = args.length;
        if (argslen > 1)
        {
            args.shift();
            splice.apply(this.filters, [i, 0].concat(args));
            this._glsl = null;
        }
        return this;
    }

    ,removeAt: function(i) {
        this._glsl = null;
        return this.filters.splice(i, 1);
    }

    ,remove: function(filter) {
        var i = this.filters.length;
        while (--i >= 0)
        {
            if (filter === this.filters[i])
                this.filters.splice(i, 1);
        }
        this._glsl = null;
        return this;
    }

    ,reset: function() {
        this.filters.length = 0;
        this._glsl = null;
        return this;
    }
    ,empty: null

    ,GLSLCode: function() {
        var filters = this.filters, filter, glsl = [], processor, i, n = filters.length;
        for (i=0; i<n; ++i)
        {
            filter = filters[i];
            if (!filter) continue;
            processor = filter.GLSLCode();
            if (!processor)
            {
                if (filter._apply)
                    glsl.push({instance: filter});
            }
            else if (processor.push)
            {
                glsl.push.apply(glsl, processor);
            }
            else
            {
                glsl.push(processor);
            }
        }
        return glsl;
    }

    // used for internal purposes
    ,_apply: function(im, w, h, metaData) {
        var self = this, runWASM = self._runWASM /*|| self.isWASM()*/,
            meta, filtermeta = null, metalen = 0,
            IMGW = null, IMGH = null;
        if (self.filters.length)
        {
            metaData = metaData || {};
            var filterstack = self.filters, stacklength = filterstack.length, fi, filter;
            filtermeta = new Array(stacklength);
            for (fi=0; fi<stacklength; ++fi)
            {
                filter = filterstack[fi];
                if (filter && filter.canRun())
                {
                    metaData.container = self;  metaData.index = fi;
                    im = runWASM ? filter._apply_wasm(im, w, h, metaData) : filter._apply(im, w, h, metaData);
                    if (filter.hasMeta)
                    {
                        filtermeta[metalen++] = [fi, meta=filter.metaData()];
                        if (null != meta._IMG_WIDTH)
                        {
                            // width/height changed during process, update and pass on
                            IMGW = w = meta._IMG_WIDTH;
                            IMGH = h = meta._IMG_HEIGHT;
                        }
                    }
                }
            }
        }
        if (metalen > 0)
        {
            if (filtermeta.length > metalen) filtermeta.length = metalen;
            self.hasMeta = true;
            self.meta = {filters: filtermeta};
            if (null != IMGW) {self.meta._IMG_WIDTH = IMGW; self.meta._IMG_HEIGHT = IMGH;}
        }
        else
        {
            self.hasMeta = false;
            self.meta = null;
        }
        return im;
    }

    ,canRun: function() {
        return this._isOn && this.filters.length;
    }

    ,toString: function() {
        var tab = "\t", s = this.filters, out = [], i, l = s.length;
        for (i=0; i<l; ++i) out.push(tab + s[i].toString().split("\n").join("\n"+tab));
        return [
             "[FILTER: " + this.name + "]"
             ,"[",out.join("\n"),"]",""
         ].join("\n");
    }
});
// aliases
CompositeFilter.prototype.get = CompositeFilter.prototype.filter;
CompositeFilter.prototype.empty = CompositeFilter.prototype.reset;
CompositeFilter.prototype.concat = CompositeFilter.prototype.push;
FILTER.CompositionFilter = FILTER.CompositeFilter;

}(FILTER);/**
*
* Blend Filter
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var IMG = FILTER.ImArray, copy = FILTER.Util.Array.copy,
    GLSL = FILTER.Util.GLSL,
    stdMath = Math, Min = stdMath.min, Round = stdMath.round,
    notSupportClamp = FILTER._notSupportClamp,
    clamp = FILTER.Color.clampPixel;

// Blend Filter, svg-like image blending
var BlendFilter = FILTER.Create({
    name: "BlendFilter"

    ,init: function BlendFilter(matrix) {
        var self = this;
        self.set(matrix);
    }

    ,path: FILTER.Path
    // parameters
    ,matrix: null
    ,hasInputs: true

    ,dispose: function() {
        var self = this;
        self.matrix = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
            matrix: self.matrix
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.matrix = params.matrix;
        return self;
    }

    ,set: function(matrix) {
        var self = this;
        if (matrix && matrix.length /*&& (matrix.length&3 === 0)*//*4N*/)
        {
            //self.resetInputs();
            self.matrix = matrix;
        }
        self._glsl = null;
        return self;
    }

    ,setInputValues: function(inputIndex, values) {
        var self = this, index, matrix = self.matrix;
        if (values)
        {
            if (!matrix) matrix = self.matrix = ["normal", 0, 0, 1];
            index = (inputIndex-1)*4;
            if (null != values.mode)      matrix[index  ] =  values.mode||"normal";
            if (null != values.startX)    matrix[index+1] = +values.startX;
            if (null != values.startY)    matrix[index+2] = +values.startY;
            if (null != values.enabled)   matrix[index+3] = !!values.enabled;
        }
        return self;
    }

    ,reset: function() {
        var self = this;
        self.matrix = null;
        self.resetInputs();
        self._glsl = null;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return wasm(this);
    }

    ,_apply: function(im, w, h) {
        //"use asm";
        var self = this, matrix = self.matrix;
        if (!matrix || !matrix.length) return im;

        var i, j, j2, k, l = matrix.length, imLen = im.length, input,
            startX, startY, startX2, startY2, W, H, A, w2, h2,
            W1, W2, start, end, x, y, x2, y2, f, B, mode,
            rb, gb, bb, ab, ra, ga, ba, aa, a;

        //B = im;
        // clone original image since same image may also blend with itself
        B = copy(im);

        for (i=0,k=1; i<l; i+=4,++k)
        {
            if (!matrix[i+3]) continue; // not enabled, skip
            mode = matrix[i] || 'normal';
            f = BLEND[mode];
            if (!f) continue;

            input = self.input(k);
            if (!input) continue; // no input, skip
            A = input[0]; w2 = input[1]; h2 = input[2];

            startX = matrix[i+1]||0; startY = matrix[i+2]||0;
            startX2 = 0; startY2 = 0;
            if (startX < 0) {startX2 = -startX; startX = 0;}
            if (startY < 0) {startY2 = -startY; startY = 0;}
            if (startX >= w || startY >= h || startX2 >= w2 || startY2 >= h2) continue;

            startX = Round(startX); startY = Round(startY);
            startX2 = Round(startX2); startY2 = Round(startY2);
            W = Min(w-startX, w2-startX2); H = Min(h-startY, h2-startY2);
            if (W <= 0 || H <= 0) continue;

            // blend images
            x = startX; y = startY*w; x2 = startX2; y2 = startY2*w2; W1 = startX+W; W2 = startX2+W;
            if (notSupportClamp)
            {
                for (start=0,end=H*W; start<end; ++start)
                {
                    j = (x + y) << 2;
                    j2 = (x2 + y2) << 2;
                    rb = B[j  ];
                    gb = B[j+1];
                    bb = B[j+2];
                    ab = B[j+3]/255;
                    ra = A[j2  ];
                    ga = A[j2+1];
                    ba = A[j2+2];
                    aa = A[j2+3]/255;
                    a = 'normal' !== mode ? (aa + ab - aa*ab) : (aa + ab * (1 - aa));
                    if (0 < a)
                    {
                        B[j  ] = clamp(Round(255*f(ab*rb/255, ab, aa*ra/255, aa)/a));
                        B[j+1] = clamp(Round(255*f(ab*gb/255, ab, aa*ga/255, aa)/a));
                        B[j+2] = clamp(Round(255*f(ab*bb/255, ab, aa*ba/255, aa)/a));
                        B[j+3] = clamp(Round(255*a));
                    }
                    else
                    {
                        B[j  ] = 0;
                        B[j+1] = 0;
                        B[j+2] = 0;
                        B[j+3] = 0;
                    }
                    // next pixels
                    if (++x >= W1) {x = startX; y += w;}
                    if (++x2 >= W2) {x2 = startX2; y2 += w2;}
                }
            }
            else
            {
                for (start=0,end=H*W; start<end; ++start)
                {
                    j = (x + y) << 2;
                    j2 = (x2 + y2) << 2;
                    rb = B[j  ];
                    gb = B[j+1];
                    bb = B[j+2];
                    ab = B[j+3]/255;
                    ra = A[j2  ];
                    ga = A[j2+1];
                    ba = A[j2+2];
                    aa = A[j2+3]/255;
                    a = 'normal' !== mode ? (aa + ab - aa*ab) : (aa + ab * (1 - aa));
                    if (0 < a)
                    {
                        B[j  ] = Round(255*f(ab*rb/255, ab, aa*ra/255, aa)/a);
                        B[j+1] = Round(255*f(ab*gb/255, ab, aa*ga/255, aa)/a);
                        B[j+2] = Round(255*f(ab*bb/255, ab, aa*ba/255, aa)/a);
                        B[j+3] = Round(255*a);
                    }
                    else
                    {
                        B[j  ] = 0;
                        B[j+1] = 0;
                        B[j+2] = 0;
                        B[j+3] = 0;
                    }
                    // next pixels
                    if (++x >= W1) {x = startX; y += w;}
                    if (++x2 >= W2) {x2 = startX2; y2 += w2;}
                }
            }
        }
        return B;
    }
});
// aliases
FILTER.CombineFilter = FILTER.BlendFilter;
var BLEND = FILTER.Color.Blend = {
//https://dev.w3.org/SVG/modules/compositing/master/
'normal': function(Dca, Da, Sca, Sa){return Sca + Dca * (1 - Sa);},
'multiply': function(Dca, Da, Sca, Sa){return Sca*Dca + Sca*(1 - Da) + Dca*(1 - Sa);},
'screen': function(Dca, Da, Sca, Sa){return Sca + Dca - Sca * Dca;},
'overlay': function(Dca, Da, Sca, Sa){return 2*Dca <= Da ? (2*Sca * Dca + Sca * (1 - Da) + Dca * (1 - Sa)) : (Sca * (1 + Da) + Dca * (1 + Sa) - 2 * Dca * Sca - Da * Sa);},
'darken': function(Dca, Da, Sca, Sa){return stdMath.min(Sca * Da, Dca * Sa) + Sca * (1 - Da) + Dca * (1 - Sa);},
'lighten': function(Dca, Da, Sca, Sa){return stdMath.max(Sca * Da, Dca * Sa) + Sca * (1 - Da) + Dca * (1 - Sa);},
'color-dodge': function(Dca, Da, Sca, Sa){return Sca === Sa && 0 === Dca ? (Sca * (1 - Da)) : (Sca === Sa ? (Sa * Da + Sca * (1 - Da) + Dca * (1 - Sa)) : (Sa * Da * stdMath.min(1, Dca/Da * Sa/(Sa - Sca)) + Sca * (1 - Da) + Dca * (1 - Sa)));},
'color-burn': function(Dca, Da, Sca, Sa){var m = Da ? Dca/Da : 0; return 0 === Sca && Dca === Da ? (Sa * Da + Dca * (1 - Sa)) : (0 === Sca ? (Dca * (1 - Sa)) : (Sa * Da * (1 - stdMath.min(1, (1 - m) * Sa/Sca)) + Sca * (1 - Da) + Dca * (1 - Sa)));},
'hard-light': function(Dca, Da, Sca, Sa){return 2 * Sca <= Sa ? (2 * Sca * Dca + Sca * (1 - Da) + Dca * (1 - Sa)) : (Sca * (1 + Da) + Dca * (1 + Sa) - Sa * Da - 2 * Sca * Dca);},
'soft-light': function(Dca, Da, Sca, Sa){var m = Da ? Dca/Da : 0; return 2 * Sca <= Sa ? (Dca * (Sa + (2 * Sca - Sa) * (1 - m)) + Sca * (1 - Da) + Dca * (1 - Sa)) : (2 * Sca > Sa && 4 * Dca <= Da ? (Da * (2 * Sca - Sa) * (16 * stdMath.pow(m, 3) - 12 * stdMath.pow(m, 2) - 3 * m) + Sca - Sca * Da + Dca) : (Da * (2 * Sca - Sa) * (stdMath.pow(m, 0.5) - m) + Sca - Sca * Da + Dca));},
'difference': function(Dca, Da, Sca, Sa){return Sca + Dca - 2 * stdMath.min(Sca * Da, Dca * Sa);},
'exclusion': function(Dca, Da, Sca, Sa){return (Sca * Da + Dca * Sa - 2 * Sca * Dca) + Sca * (1 - Da) + Dca * (1 - Sa);},
'average': function(Dca, Da, Sca, Sa){return (Sca + Dca) / 2;},
// linear-dodge
'add': function(Dca, Da, Sca, Sa){return stdMath.min(1, Sca + Dca);},
// linear-burn
'subtract': function(Dca, Da, Sca, Sa){return stdMath.max(0, Dca + Sca - 1);},
'negation': function(Dca, Da, Sca, Sa){return 1 - stdMath.abs(1 - Sca - Dca);},
'linear-light': function(Dca, Da, Sca, Sa){return Sca < 0.5 ? BLEND.subtract(Dca, Da, 2*Sca, Sa) : BLEND.add(Dca, Da, 2*(1 - Sca), Sa);}
};
// aliases
BLEND['lineardodge'] = BLEND['linear-dodge'] = BLEND['add'];
BLEND['linearburn'] = BLEND['linear-burn'] = BLEND['subtract'];
BLEND['linearlight'] = BLEND['linear-light'];
BLEND['hardlight'] = BLEND['hard-light'];
BLEND['softlight'] = BLEND['soft-light'];
BLEND['colordodge'] = BLEND['color-dodge'];
BLEND['colorburn'] = BLEND['color-burn'];
var modes = [
    'NORMAL',
    'MULTIPLY',
    'SCREEN',
    'OVERLAY',
    'DARKEN',
    'LIGHTEN',
    'COLORDODGE',
    'COLORBURN',
    'HARDLIGHT',
    'SOFTLIGHT',
    'DIFFERENCE',
    'EXCLUSION',
    'AVERAGE',
    'LINEARDODGE',
    'LINEARBURN',
    'NEGATION',
    'LINEARLIGHT'
], same = {
    'ADD' : 'LINEARDODGE',
    'SUBTRACT': 'LINEARBURN'
};
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {env:{
      "BLEND.multiply": BLEND.multiply,
      "BLEND.screen": BLEND.screen,
      "BLEND.overlay": BLEND.overlay,
      "BLEND.darken": BLEND.darken,
      "BLEND.lighten": BLEND.lighten,
      "BLEND.colordodge": BLEND.colordodge,
      "BLEND.colorburn": BLEND.colorburn,
      "BLEND.hardlight": BLEND.hardlight,
      "BLEND.softlight": BLEND.softlight,
      "BLEND.difference": BLEND.difference,
      "BLEND.exclusion": BLEND.exclusion,
      "BLEND.average": BLEND.average,
      "BLEND.lineardodge": BLEND.lineardodge,
      "BLEND.linearburn": BLEND.linearburn,
      "BLEND.negation": BLEND.negation,
      "BLEND.linearlight": BLEND.linearlight,
      "BLEND.normal": BLEND.normal
}}, {
    blendfilter: {inputs: [{arg:0,type:FILTER.ImArray},{arg:3,type:'f32',array:1},{arg:4,type:FILTER.ImArray,array:1},{arg:5,type:'i32',array:1}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
    BlendFilter.prototype._apply_wasm = function(im, w, h) {
        var self = this, matrix = self.matrix, inputs, inputSizes, input, m, i, j, l, mode;
        if (!matrix || !matrix.length) return im;
        m = matrix.slice();
        inputs = new Array(matrix.length >>> 2);
        inputSizes = new Array(matrix.length >>> 1);
        for (i=0,j=0,l=matrix.length; i<l; i+=4,++j)
        {
            mode = (matrix[i]||'normal').toUpperCase().replace('-', '');
            if (same[mode]) mode = same[mode];
            m[i] = modes.indexOf(mode);
            input = self.input(j+1);
            if (!input)
            {
                m[i+3] = 0;
                inputs[j] = [];
                inputSizes[2*j] = 0;
                inputSizes[2*j+1] = 0;
            }
            else
            {
                inputs[j] = input[0] || [];
                inputSizes[2*j] = input[1] || 0;
                inputSizes[2*j+1] = input[2] || 0;
            }
        }
        return wasm.blendfilter(im, w, h, m, inputs, inputSizes);
    };
    }
    FILTER.unwaitFor(1);
});
}

function glsl(filter)
{
    if (!filter.matrix || !filter.matrix.length) return (new GLSL.Filter(filter)).begin().shader(GLSL.DEFAULT).end().code();
    var matrix = filter.matrix, inputs = '', code = '', i, j, glslcode;
    for (j=1,i=0; i<matrix.length; i+=4,++j)
    {
        inputs += (inputs.length ? '\n' : '')+'uniform sampler2D input'+j+';\n'+'uniform vec2 inputSize'+j+';\n'+'uniform int inputMode'+j+';\n'+'uniform vec2 inputStart'+j+';\n'+'uniform int inputEnabled'+j+';';
        code += (code.length ? '\n' : '')+'col = doblend(col, pix, input'+j+', inputSize'+j+', inputStart'+j+', inputMode'+j+', inputEnabled'+j+');';
    }
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader([
    modes.map(function(m, i) {
        if ('LINEARDODGE' === m)
        {
            return '#define LINEARDODGE '+i+'\n'+'#define ADD '+i;
        }
        else if ('LINEARBURN' === m)
        {
            return '#define LINEARBURN '+i+'\n'+'#define SUBTRACT '+i;
        }
        return '#define '+m+' '+i;
    }).join('\n'),
    Object.keys(BLEND_GLSL).map(function(m) {
        return BLEND_GLSL[m];
    }).join('\n'),
    'float blend(int mode, float Dca, float Da, float Sca, float Sa) {',
    '    if (MULTIPLY == mode) return multiply(Dca, Da, Sca, Sa);',
    '    else if (SCREEN == mode) return screen(Dca, Da, Sca, Sa);',
    '    else if (OVERLAY == mode) return overlay(Dca, Da, Sca, Sa);',
    '    else if (DARKEN == mode) return darken(Dca, Da, Sca, Sa);',
    '    else if (LIGHTEN == mode) return lighten(Dca, Da, Sca, Sa);',
    '    else if (COLORDODGE == mode) return colordodge(Dca, Da, Sca, Sa);',
    '    else if (COLORBURN == mode) return colorburn(Dca, Da, Sca, Sa);',
    '    else if (HARDLIGHT == mode) return hardlight(Dca, Da, Sca, Sa);',
    '    else if (SOFTLIGHT == mode) return softlight(Dca, Da, Sca, Sa);',
    '    else if (DIFFERENCE == mode) return difference(Dca, Da, Sca, Sa);',
    '    else if (EXCLUSION == mode) return exclusion(Dca, Da, Sca, Sa);',
    '    else if (AVERAGE == mode) return average(Dca, Da, Sca, Sa);',
    '    else if (LINEARDODGE == mode) return lineardodge(Dca, Da, Sca, Sa);',
    '    else if (LINEARBURN == mode) return linearburn(Dca, Da, Sca, Sa);',
    '    else if (NEGATION == mode) return negation(Dca, Da, Sca, Sa);',
    '    else if (LINEARLIGHT == mode) return linearlight(Dca, Da, Sca, Sa);',
    '    return normal(Dca, Da, Sca, Sa);',
    '}',
    'vec4 doblend(vec4 B, vec2 pix, sampler2D Atex, vec2 size, vec2 start, int mode, int enabled) {',
    '    if (0 == enabled || pix.x < start.x || pix.y < start.y || pix.x > start.x+size.x || pix.y > start.y+size.y) return B;',
    '    vec4 A = texture2D(Atex, (pix-start)/size);',
    '    float a = 1.0;',
    '    if (NORMAL != mode) a = clamp(A.a + B.a - A.a*B.a, 0.0, 1.0);',
    '    else a = clamp(A.a + B.a*(1.0 - A.a), 0.0, 1.0);',
    '    if (0.0 < a) return vec4(',
    '        clamp(blend(mode, B.r*B.a, B.a, A.r*A.a, A.a)/a, 0.0, 1.0),',
    '        clamp(blend(mode, B.g*B.a, B.a, A.g*A.a, A.a)/a, 0.0, 1.0),',
    '        clamp(blend(mode, B.b*B.a, B.a, A.b*A.a, A.a)/a, 0.0, 1.0),',
    '        a',
    '    );',
    '    return vec4(0.0);',
    '}',
    'varying vec2 pix;',
    'uniform sampler2D img;',
    inputs,
    'void main(void) {',
    'vec4 col = texture2D(img, pix);',
    code,
    'gl_FragColor = col;',
    '}'
    ].join('\n'))
    .input('*', function(filter, w, h, wi, hi, io, gl, program) {
        var matrix = filter.matrix, i, j, input, mode;
        for (j=1,i=0; i<matrix.length; i+=4,++j)
        {
            mode = (matrix[i]||'normal').toUpperCase().replace('-', '');
            if (same[mode]) mode = same[mode];
            input = filter.input(j);
            GLSL.uploadTexture(gl, input[0], input[1], input[2], j);
            gl.uniform1i(program.uniform['input'+j].loc, j);
            gl.uniform2f(program.uniform['inputSize'+j].loc, input[1]/w, input[2]/h);
            gl.uniform1i(program.uniform['inputMode'+j].loc, modes.indexOf(mode));
            gl.uniform2f(program.uniform['inputStart'+j].loc, matrix[i+1]/w, matrix[i+2]/h);
            gl.uniform1i(program.uniform['inputEnabled'+j].loc, matrix[i+3] ? 1 : 0);
        }
    })
    .end();
    return glslcode.code();
}
var BLEND_GLSL = {
'normal': 'float normal(float Dca, float Da, float Sca, float Sa){return Sca + Dca * (1.0 - Sa);}',
'multiply': 'float multiply(float Dca, float Da, float Sca, float Sa){return Sca*Dca + Sca*(1.0 - Da) + Dca*(1.0 - Sa);}',
'screen': 'float screen(float Dca, float Da, float Sca, float Sa){return Sca + Dca - Sca * Dca;}',
'overlay': 'float overlay(float Dca, float Da, float Sca, float Sa){if (2.0*Dca <= Da) return (2.0*Sca * Dca + Sca * (1.0 - Da) + Dca * (1.0 - Sa)); else return (Sca * (1.0 + Da) + Dca * (1.0 + Sa) - 2.0 * Dca * Sca - Da * Sa);}',
'darken': 'float darken(float Dca, float Da, float Sca, float Sa){return min(Sca * Da, Dca * Sa) + Sca * (1.0 - Da) + Dca * (1.0 - Sa);}',
'lighten': 'float lighten(float Dca, float Da, float Sca, float Sa){return max(Sca * Da, Dca * Sa) + Sca * (1.0 - Da) + Dca * (1.0 - Sa);}',
'color-dodge': 'float colordodge(float Dca, float Da, float Sca, float Sa){if (Sca == Sa && 0.0 == Dca) return (Sca * (1.0 - Da)); else if (Sca == Sa) return (Sa * Da + Sca * (1.0 - Da) + Dca * (1.0 - Sa)); else return (Sa * Da * min(1.0, Dca/Da * Sa/(Sa - Sca)) + Sca * (1.0 - Da) + Dca * (1.0 - Sa));}',
'color-burn': 'float colorburn(float Dca, float Da, float Sca, float Sa){float m = 0.0; if (0.0 != Da) m = Dca/Da; if (0.0 == Sca && Dca == Da) return (Sa * Da + Dca * (1.0 - Sa)); else if (0.0 == Sca) return (Dca * (1.0 - Sa)); else return (Sa * Da * (1.0 - min(1.0, (1.0 - m) * Sa/Sca)) + Sca * (1.0 - Da) + Dca * (1.0 - Sa));}',
'hard-light': 'float hardlight(float Dca, float Da, float Sca, float Sa){if (2.0 * Sca <= Sa) return (2.0 * Sca * Dca + Sca * (1.0 - Da) + Dca * (1.0 - Sa)); else return (Sca * (1.0 + Da) + Dca * (1.0 + Sa) - Sa * Da - 2.0 * Sca * Dca);}',
'soft-light': 'float softlight(float Dca, float Da, float Sca, float Sa){float m = 0.0; if (0.0 != Da) m = Dca/Da; if (2.0 * Sca <= Sa) return (Dca * (Sa + (2.0 * Sca - Sa) * (1.0 - m)) + Sca * (1.0 - Da) + Dca * (1.0 - Sa)); else if (2.0 * Sca > Sa && 4.0 * Dca <= Da) return (Da * (2.0 * Sca - Sa) * (16.0 * pow(m, 3.0) - 12.0 * pow(m, 2.0) - 3.0 * m) + Sca - Sca * Da + Dca); else return (Da * (2.0 * Sca - Sa) * (pow(m, 0.5) - m) + Sca - Sca * Da + Dca);}',
'difference': 'float difference(float Dca, float Da, float Sca, float Sa){return Sca + Dca - 2.0 * min(Sca * Da, Dca * Sa);}',
'exclusion': 'float exclusion(float Dca, float Da, float Sca, float Sa){return (Sca * Da + Dca * Sa - 2.0 * Sca * Dca) + Sca * (1.0 - Da) + Dca * (1.0 - Sa);}',
'average': 'float average(float Dca, float Da, float Sca, float Sa){return (Sca + Dca) / 2.0;}',
// linear-dodge
'add': 'float lineardodge(float Dca, float Da, float Sca, float Sa){return min(1.0, Sca + Dca);}',
// linear-burn
'subtract': 'float linearburn(float Dca, float Da, float Sca, float Sa){return max(0.0, Dca + Sca - 1.0);}',
'negation': 'float negation(float Dca, float Da, float Sca, float Sa){return 1.0 - abs(1.0 - Sca - Dca);}',
'linear-light': 'float linearlight(float Dca, float Da, float Sca, float Sa){if (Sca < 0.5) return linearburn(Dca, Da, 2.0*Sca, Sa); else return lineardodge(Dca, Da, 2.0*(1.0 - Sca), Sa);}'
};
function wasm()
{
    return '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';
}
}(FILTER);/**
*
* Dimension Filter
*
* Changes the dimensions of the image by either (re-)scaling, cropping or padding
*
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var stdMath = Math, ImageUtil = FILTER.Util.Image, GLSL = FILTER.Util.GLSL;

// Dimension Filter, change image dimension
FILTER.Create({
    name: "DimensionFilter"

    ,init: function DimensionFilter(mode, a, b, c, d) {
        var self = this;
        self.set(mode, a, b, c, d);
    }

    ,path: FILTER.Path
    // parameters
    ,m: null
    ,a: 0
    ,b: 0
    ,c: 0
    ,d: 0
    ,meta: null
    ,hasMeta: true

    ,dispose: function() {
        var self = this;
        self.m = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
            m: self.m,
            a: self.a,
            b: self.b,
            c: self.c,
            d: self.d
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.set(params.m, params.a, params.b, params.c, params.d);
        return self;
    }

    ,metaData: function(serialisation) {
        return serialisation ? JSON.stringify(this.meta) : this.meta;
    }

    ,setMetaData: function(meta, serialisation) {
        this.meta = serialisation ? JSON.parse(meta) : meta;
        return this;
    }

    ,set: function(m, a, b, c, d) {
        var self = this;
        if (m)
        {
            self.m = String(m || 'scale').toLowerCase();
            self.a = a || 0;
            self.b = b || 0;
            self.c = c || 0;
            self.d = d || 0;
        }
        else
        {
            self.m = null;
            self.a = 0;
            self.b = 0;
            self.c = 0;
            self.d = 0;
        }
        self._glsl = null;
        return self;
    }

    ,reset: function() {
        return this.set(null);
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,_apply: function(im, w, h, metaData) {
        var self = this, isWASM = self._runWASM, mode = self.m,
            a = self.a, b = self.b, c = self.c, d = self.d;
        if (!mode)
        {
            self.meta = null;
            self.hasMeta = false;
            return im;
        }
        self.hasMeta = true;
        switch (mode)
        {
            case 'set':
                if (c && d)
                {
                    // scale given
                    a = stdMath.round(c*w);
                    b = stdMath.round(d*h);
                }
                else
                {
                    // dimensions given
                    a = stdMath.round(a);
                    b = stdMath.round(b);
                }
                im = new FILTER.ImArray((a*b) << 2);
                self.meta = {_IMG_WIDTH:a, _IMG_HEIGHT:b};
            break;
            case 'pad':
                a = stdMath.round(a);
                b = stdMath.round(b);
                c = stdMath.round(c);
                d = stdMath.round(d);
                im = ImageUtil.pad(im, w, h, c, d, a, b);
                self.meta = {_IMG_WIDTH:a + c + w, _IMG_HEIGHT:b + d + h};
            break;
            case 'crop':
                a = stdMath.round(a);
                b = stdMath.round(b);
                c = stdMath.round(c);
                d = stdMath.round(d);
                im = ImageUtil.crop(im, w, h, a, b, a+c-1, b+d-1);
                self.meta = {_IMG_WIDTH:c, _IMG_HEIGHT:d};
            break;
            case 'scale':
            default:
                if (c && d)
                {
                    // scale given
                    a = stdMath.round(c*w);
                    b = stdMath.round(d*h);
                }
                else
                {
                    // dimensions given
                    a = stdMath.round(a);
                    b = stdMath.round(b);
                }
                im = isWASM ? (ImageUtil.wasm||ImageUtil)['interpolate'](im, w, h, a, b) : ImageUtil.interpolate(im, w, h, a, b);
                self.meta = {_IMG_WIDTH:a, _IMG_HEIGHT:b};
            break;
        }
        return im;
    }
});

function glsl(filter)
{
    var img_util = ImageUtil.glsl();
    var get = function(filter, w, h) {
        var modeCode,
            a = filter.a,
            b = filter.b,
            c = filter.c,
            d = filter.d,
            nw, nh;
        switch (filter.m)
        {
            case 'set':
            modeCode = 1;
            if (c && d)
            {
                // scale given
                a = c*w;
                b = d*h;
            }
            nw = a;
            nh = b;
            break;
            case 'pad':
            modeCode = 2;
            nw = w+a+c;
            nh = h+b+d;
            break;
            case 'crop':
            modeCode = 3;
            nw = c;
            nh = d;
            break;
            case 'scale':
            default:
            modeCode = 4;
            if (c && d)
            {
                // scale given
                a = c*w;
                b = d*h;
            }
            nw = a;
            nh = b;
            break;
        }
        return {
        m: modeCode,
        a: filter.a, b: filter.b,
        c: filter.c, d: filter.d,
        w: w, h: h,
        nw: stdMath.round(nw), nh: stdMath.round(nh)
        };
    };
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader(!filter.m ? GLSL.DEFAULT : [
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform vec2 wh;',
    'uniform vec2 nwh;',
    'uniform int m;',
    'uniform float a;',
    'uniform float b;',
    'uniform float c;',
    'uniform float d;',
    'vec4 set(vec2 pix, sampler2D img) {',
    '   return vec4(0.0);',
    '}',
    img_util['crop'],
    img_util['pad'],
    img_util['interpolate'],
    'void main(void) {',
    '    if (1 == m) gl_FragColor = set(pix, img);',
    '    else if (2 == m) gl_FragColor = pad(pix, img, wh, nwh, c, d, a, b);',
    '    else if (3 == m) gl_FragColor = crop(pix, img, wh, nwh, a, b, a+c-1.0, b+d-1.0);',
    '    else gl_FragColor = interpolate(pix, img, wh, nwh);',
    '}'
    ].join('\n'))
    .dimensions(function(w, h, io) {io.params = get(filter, w, h); return [io.params.nw, io.params.nh];})
    .input('wh', function(filter, nw, nh, w, h) {return [w, h];})
    .input('nwh', function(filter, nw, nh, w, h) {return [nw, nh];})
    .input('m', function(filter, nw, nh, w, h, io) {return io.params.m;})
    .input('a', function(filter, nw, nh, w, h, io) {return io.params.a;})
    .input('b', function(filter, nw, nh, w, h, io) {return io.params.b;})
    .input('c', function(filter, nw, nh, w, h, io) {return io.params.c;})
    .input('d', function(filter, nw, nh, w, h, io) {return io.params.d;})
    .end();
    return glslcode.code();
}

}(FILTER);/**
*
* Table Lookup Filter
*
* Changes target image colors according to color lookup tables for each channel
*
* @param tableR Optional (a lookup table of 256 color values for red channel)
* @param tableG Optional (a lookup table of 256 color values for green channel)
* @param tableB Optional (a lookup table of 256 color values for blue channel)
* @param tableA Optional (a lookup table of 256 color values for alpha channel, NOT USED YET)
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

// color table
var CHANNEL = FILTER.CHANNEL, CT = FILTER.ColorTable, clamp = FILTER.Color.clampPixel,
    stdMath = Math, Floor = stdMath.floor, Power = stdMath.pow, Exponential = stdMath.exp, nF = 1.0/255,
    TypedArray = FILTER.Util.Array.typed, eye = FILTER.Util.Filter.ct_eye, ct_mult = FILTER.Util.Filter.ct_multiply, GLSL = FILTER.Util.GLSL;

// ColorTableFilter
var ColorTableFilter = FILTER.Create({
    name: "ColorTableFilter"

    ,init: function ColorTableFilter(tR, tG, tB, tA) {
        var self = this;
        self.table = [null, null, null, null];
        tR = tR || null;
        tG = tG || tR;
        tB = tB || tG;
        tA = tA || null;
        self.table[CHANNEL.R] = tR;
        self.table[CHANNEL.G] = tG;
        self.table[CHANNEL.B] = tB;
        self.table[CHANNEL.A] = tA;
    }

    ,path: FILTER.Path
    // parameters
    ,table: null
    ,img: null

    ,dispose: function() {
        var self = this;
        self.table = null;
        self.img = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             tableR: self.table[CHANNEL.R]
            ,tableG: self.table[CHANNEL.G]
            ,tableB: self.table[CHANNEL.B]
            ,tableA: self.table[CHANNEL.A]
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.table[CHANNEL.R] = TypedArray(params.tableR, CT);
        self.table[CHANNEL.G] = TypedArray(params.tableG, CT);
        self.table[CHANNEL.B] = TypedArray(params.tableB, CT);
        self.table[CHANNEL.A] = TypedArray(params.tableA, CT);
        return self;
    }

    ,functional: function(fR, fG, fB) {
        if ("function" !== typeof fR) return this;
        var tR = eye(fR), tG = fG ? eye(fG) : tR, tB = fB ? eye(fB) : tG;
        return this.set(tR, tG, tB);
    }

    ,channel: function(channel) {
        if (null == channel) return this;
        var tR, tG, tB;
        switch (channel || CHANNEL.R)
        {
            case CHANNEL.B:
                tR = eye(0,0); tG = eye(0,0); tB = eye();
                break;

            case CHANNEL.G:
                tR = eye(0,0); tG = eye(); tB = eye(0,0);
                break;

            case CHANNEL.R:
            default:
                tR = eye(); tG = eye(0,0); tB = eye(0,0);
                break;

        }
        return this.set(tR, tG, tB);
    }

    ,redChannel: function() {
        return this.channel(CHANNEL.R);
    }

    ,greenChannel: function() {
        return this.channel(CHANNEL.G);
    }

    ,blueChannel: function() {
        return this.channel(CHANNEL.B);
    }

    ,channelInvert: function(channel) {
        if (null == channel) return this;
        var tR, tG, tB;
        switch (channel || CHANNEL.R)
        {
            case CHANNEL.B:
                tR = eye(); tG = eye(); tB = eye(-1,255);
                break;

            case CHANNEL.G:
                tR = eye(); tG = eye(-1,255); tB = eye();
                break;

            case CHANNEL.R:
            default:
                tR = eye(-1,255); tG = eye(); tB = eye();
                break;

        }
        return this.set(tR, tG, tB);
    }

    ,redInvert: function() {
        return this.channelInvert(CHANNEL.R);
    }

    ,greenInvert: function() {
        return this.channelInvert(CHANNEL.G);
    }

    ,blueInvert: function() {
        return this.channelInvert(CHANNEL.B);
    }

    ,invert: function() {
        return this.set(FILTER.Util.Filter.ct_eye(-1,255));
    }

    ,thresholds: function(thresholdsR, thresholdsG, thresholdsB) {
        // assume thresholds are given in pointwise scheme as pointcuts
        // not in cumulative scheme
        // [ 0.5 ] => [0, 1]
        // [ 0.3, 0.3, 0.3 ] => [0, 0.3, 0.6, 1]
        if (!thresholdsR.length) thresholdsR = [thresholdsR];
        if (!thresholdsG) thresholdsG = thresholdsR;
        if (!thresholdsB) thresholdsB = thresholdsG;

        var tLR = thresholdsR.length, numLevelsR = tLR+1,
            tLG = thresholdsG.length, numLevelsG = tLG+1,
            tLB = thresholdsB.length, numLevelsB = tLB+1,
            tR = new CT(256), qR = new CT(numLevelsR),
            tG = new CT(256), qG = new CT(numLevelsG),
            tB = new CT(256), qB = new CT(numLevelsB),
            i, j, nLR=255/(numLevelsR-1), nLG=255/(numLevelsG-1), nLB=255/(numLevelsB-1);
        for (i=0; i<numLevelsR; ++i) qR[i] = (nLR * i)|0;
        thresholdsR[0] = (255*thresholdsR[0])|0;
        for (i=1; i<tLR; ++i) thresholdsR[i] = thresholdsR[i-1] + (255*thresholdsR[i])|0;
        for (i=0; i<numLevelsG; ++i) qG[i] = (nLG * i)|0;
        thresholdsG[0] = (255*thresholdsG[0])|0;
        for (i=1; i<tLG; ++i) thresholdsG[i] = thresholdsG[i-1] + (255*thresholdsG[i])|0;
        for (i=0; i<numLevelsB; ++i) qB[i] = (nLB * i)|0;
        thresholdsB[0] = (255*thresholdsB[0])|0;
        for (i=1; i<tLB; ++i) thresholdsB[i] = thresholdsB[i-1] + (255*thresholdsB[i])|0;
        for (i=0; i<256; ++i)
        {
            // the non-linear mapping is here
            j=0; while (j<tLR && i>thresholdsR[j]) ++j;
            tR[i] = clamp(qR[j]);
            j=0; while (j<tLG && i>thresholdsG[j]) ++j;
            tG[i] = clamp(qG[j]);
            j=0; while (j<tLB && i>thresholdsB[j]) ++j;
            tB[i] = clamp(qB[j]);
        }
        return this.set(tR, tG, tB);
    }

    ,threshold: function(thresholdR, thresholdG, thresholdB) {
        thresholdR = null == thresholdR ? 0.5 : thresholdR;
        thresholdG = null == thresholdG ? thresholdR : thresholdG;
        thresholdB = null == thresholdB ? thresholdG : thresholdB;
        return this.thresholds([thresholdR], [thresholdG], [thresholdB]);
    }

    ,quantize: function(numLevels) {
        if (null == numLevels) numLevels = 64;
        if (numLevels < 2) numLevels = 2;
        var j, q=new CT(numLevels), nL=255/(numLevels-1), nR=numLevels/256;
        for (j=0; j<numLevels; ++j) q[j] = clamp(nL * j)|0;
        return this.set(eye(function(i) {return q[(nR * i)|0];}));
    }
    ,posterize: null

    ,binarize: function() {
        return this.quantize(2);
    }

    // adapted from http://www.jhlabs.com/ip/filters/
    ,solarize: function(threshold, type) {
        if (null == type) type = 1;
        if (null == threshold) threshold = 0.5;

        var solar;
        if (-1 === type) // inverse
        {
            threshold *= 256;
            solar = function(i) {return i>threshold ? (255-i) : i;};
        }
        else
        {
            if (2 === type) // variation
            {
                threshold = 1 - threshold;
            }
            solar = function(i) {
                var q = 2*i/255;
                return q<threshold ? (255-255*q) : (255*q-255);
            };
        }
        return this.set(eye(solar));
    }

    ,solarize2: function(threshold) {
        return this.solarize(threshold, 2);
    }

    ,solarizeInverse: function(threshold) {
        return this.solarize(threshold, -1);
    }

    // apply a binary mask to the image color channels
    ,mask: function(mask) {
        var maskR = (mask>>>16)&255, maskG = (mask>>>8)&255, maskB = mask&255;
        return this.set(eye(function(i) {return i & maskR;}), eye(function(i) {return i & maskG;}), eye(function(i) {return i & maskB;}));
    }

    // replace a color with another
    ,replace: function(color, replacecolor) {
        if (color == replacecolor) return this;
        var tR = eye(), tG = eye(), tB = eye();
        tR[(color>>>16)&255] = (replacecolor>>>16)&255;
        tG[(color>>>8)&255] = (replacecolor>>>8)&255;
        tB[(color)&255] = (replacecolor)&255;
        return this.set(tR, tG, tB);
    }

    // extract a range of color values from a specific color channel and set the rest to background color
    ,extract: function(channel, range, background) {
        if (!range || !range.length) return this;
        background = background||0;
        var tR = eye(0,(background>>>16)&255), tG = eye(0,(background>>>8)&255), tB = eye(0,background&255);
        switch (channel || CHANNEL.R)
        {
            case CHANNEL.B:
                for (s=range[0],f=range[1]; s<=f; ++s) tB[s] = clamp(s);
                break;

            case CHANNEL.G:
                for (s=range[0],f=range[1]; s<=f; ++s) tG[s] = clamp(s);
                break;

            case CHANNEL.R:
            default:
                for (s=range[0],f=range[1]; s<=f; ++s) tR[s] = clamp(s);
                break;
        }
        return this.set(tR, tG, tB);
    }

    // adapted from http://www.jhlabs.com/ip/filters/
    ,gammaCorrection: function(gammaR, gammaG, gammaB) {
        gammaR = gammaR || 1;
        gammaG = gammaG || gammaR;
        gammaB = gammaB || gammaG;
        // gamma correction uses inverse gamma
        gammaR = 1.0/gammaR; gammaG = 1.0/gammaG; gammaB = 1.0/gammaB;
        return this.set(eye(function(i) {return 255*Power(nF*i, gammaR);}), eye(function(i) {return 255*Power(nF*i, gammaG);}), eye(function(i) {return 255*Power(nF*i, gammaB);}));
    }

    // adapted from http://www.jhlabs.com/ip/filters/
    ,exposure: function(exposure) {
        if (null == exposure) exposure = 1;
        return this.set(eye(function(i) {return 255 * (1 - Exponential(-exposure * i *nF));}));
    }

    ,contrast: function(r, g, b) {
        if (null == g) g = r;
        if (null == b) b = r;
        r += 1.0; g += 1.0; b += 1.0;
        return this.set(eye(r, 128*(1 - r)), eye(g, 128*(1 - g)), eye(b, 128*(1 - b)));
    }

    ,brightness: function(r, g, b) {
        if (null == g) g = r;
        if (null == b) b = r;
        return this.set(eye(1, r), eye(1, g), eye(1, b));
    }

    ,quickContrastCorrection: function(contrast) {
        return this.set(eye(null == contrast ? 1.2 : +contrast));
    }

    ,set: function(tR, tG, tB, tA) {
        var self = this;
        if (!tR) return self;

        var i, T = self.table, R = T[CHANNEL.R] || eye(), G, B, A;

        if (tG || tB)
        {
            tG = tG || tR; tB = tB || tG;
            G = T[CHANNEL.G] || R; B = T[CHANNEL.B] || G;
            T[CHANNEL.R] = ct_mult(tR, R);
            T[CHANNEL.G] = ct_mult(tG, G);
            T[CHANNEL.B] = ct_mult(tB, B);
        }
        else
        {
            T[CHANNEL.R] = ct_mult(tR, R);
            T[CHANNEL.G] = T[CHANNEL.R];
            T[CHANNEL.B] = T[CHANNEL.R];
        }
        self.img = null;
        self._glsl = null;
        return self;
    }

    ,reset: function() {
        var self = this;
        self.table = [null, null, null, null];
        self.img = null;
        self._glsl = null;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return wasm(this);
    }

    ,combineWith: function(filt) {
        return this.set(filt.getTable(CHANNEL.R), filt.getTable(CHANNEL.G), filt.getTable(CHANNEL.B));
    }

    ,getTable: function(channel) {
        return this.table[channel || CHANNEL.R] || null;
    }

    ,setTable: function(table, channel) {
        this.table[channel || CHANNEL.R] = table || null;
        this.img = null;
        return this;
    }

    ,getImage: function() {
        var self = this, table = self.table;
        if (table && table[CHANNEL.R] && !self.img)
        {
            var R = table[CHANNEL.R], G = table[CHANNEL.G] || R,
                B = table[CHANNEL.B] || G, A = table[CHANNEL.A],
                n = (256 << 2), t = new FILTER.Array8U(n), i, j;
            for (i=0,j=0; i<n; i+=4,++j)
            {
                t[i  ] = R[j];
                t[i+1] = G[j];
                t[i+2] = B[j];
                t[i+3] = A ? A[j] : 255;
            }
            self.img = t;
        }
        return self.img;
    }

    // used for internal purposes
    ,_apply: function(im, w, h) {
        //"use asm";
        var self = this, T = self.table;
        if (!T || !T[CHANNEL.R]) return im;

        var i, j, l=im.length, l2=l>>>2, rem=(l2&15)<<2,
            R = T[CHANNEL.R],
            G = T[CHANNEL.G] || R,
            B = T[CHANNEL.B] || G,
            A = T[CHANNEL.A];

        // apply filter (algorithm implemented directly based on filter definition)
        if (A)
        {
            // array linearization
            for (i=0; i<rem; i+=4)
            {
                im[i   ] = R[im[i   ]]; im[i+1] = G[im[i+1]]; im[i+2] = B[im[i+2]]; im[i+3] = A[im[i+3]];
            }
            // partial loop unrolling (4 iterations)
            for (j=rem; j<l; j+=64)
            {
                i = j;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; im[i] = A[im[i++]];
            }
        }
        else
        {
            // array linearization
            for (i=0; i<rem; i+=4)
            {
                im[i   ] = R[im[i   ]]; im[i+1] = G[im[i+1]]; im[i+2] = B[im[i+2]];
            }
            // partial loop unrolling (4 iterations)
            for (j=rem; j<l; j+=64)
            {
                i = j;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
                im[i] = R[im[i++]]; im[i] = G[im[i++]]; im[i] = B[im[i++]]; ++i;
            }
        }
        return im;
    }

    ,canRun: function() {
        return this._isOn && this.table && this.table[CHANNEL.R];
    }
});
// aliases
ColorTableFilter.prototype.posterize = ColorTableFilter.prototype.levels = ColorTableFilter.prototype.quantize;
FILTER.TableLookupFilter = FILTER.ColorTableFilter;
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    colortablefilter_RGB: {inputs: [{arg:0,type:FILTER.ImArray},{arg:3,type:FILTER.ImArray},{arg:4,type:FILTER.ImArray},{arg:5,type:FILTER.ImArray}], output: {type:FILTER.ImArray}},
    colortablefilter_RGBA: {inputs: [{arg:0,type:FILTER.ImArray},{arg:3,type:FILTER.ImArray},{arg:4,type:FILTER.ImArray},{arg:5,type:FILTER.ImArray},{arg:6,type:FILTER.ImArray}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
    ColorTableFilter.prototype._apply_wasm = function(im, w, h) {
        var self = this;
        if (!self.table || !self.table[CHANNEL.R]) return im;
        var R = self.table[CHANNEL.R],
            G = self.table[CHANNEL.G] || R,
            B = self.table[CHANNEL.B] || G,
            A = self.table[CHANNEL.A];
        return A ? wasm.colortablefilter_RGBA(im, w, h, R, G, B, A) : wasm.colortablefilter_RGB(im, w, h, R, G, B);
    };
    }
    FILTER.unwaitFor(1);
});
}

function glsl(filter)
{
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader(!filter.table || !filter.table[CHANNEL.R] ? GLSL.DEFAULT : [
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform sampler2D map;',
    'uniform int hasAlpha;',
    'void main(void) {',
    '   vec4 col = texture2D(img, pix);',
    '   if (1 == hasAlpha) gl_FragColor = vec4(texture2D(map, vec2(col.r, 0.0)).r,texture2D(map, vec2(col.g, 0.0)).g,texture2D(map, vec2(col.b, 0.0)).b,texture2D(map, vec2(col.a, 0.0)).a);',
    '   else gl_FragColor = vec4(texture2D(map, vec2(col.r, 0.0)).r,texture2D(map, vec2(col.g, 0.0)).g,texture2D(map, vec2(col.b, 0.0)).b,col.a);',
    '}'
    ].join('\n'))
    .input('hasAlpha', function(filter) {return filter.table[CHANNEL.A] ? 1 : 0;})
    .input('map', function(filter) {return {data:filter.getImage(), width:256, height:1};})
    .end();
    return glslcode.code();
}
function wasm()
{
    return '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';
}
}(FILTER);/**
*
* Color Matrix Filter(s)
*
* Changes target coloring combining current pixel color values according to Matrix
*
* (matrix is 4x5 array of values which are (eg for row 1: Red value):
* New red Value=Multiplier for red value, multiplier for Green value, multiplier for Blue Value, Multiplier for Alpha Value,constant  bias term
* other rows are similar but for new Green, Blue and Alpha values respectively)
*
* @param colorMatrix Optional (a color matrix as an array of values)
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var CHANNEL = FILTER.CHANNEL, CM = FILTER.ColorMatrix, A8U = FILTER.Array8U,
    stdMath = Math, Sin = stdMath.sin, Cos = stdMath.cos,
    toRad = FILTER.CONST.toRad, toDeg = FILTER.CONST.toDeg,
    TypedArray = FILTER.Util.Array.typed,
    notSupportClamp = FILTER._notSupportClamp,
    cm_rechannel = FILTER.Util.Filter.cm_rechannel,
    cm_combine = FILTER.Util.Filter.cm_combine,
    cm_multiply = FILTER.Util.Filter.cm_multiply,
    GLSL = FILTER.Util.GLSL
    ;

// ColorMatrixFilter
var ColorMatrixFilter = FILTER.Create({
    name: "ColorMatrixFilter"

    ,init: function ColorMatrixFilter(matrix) {
        var self = this;
        self.matrix = matrix && matrix.length ? new CM(matrix) : null;
    }

    ,path: FILTER.Path
    ,matrix: null

    ,dispose: function() {
        var self = this;
        self.matrix = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
            matrix: self.matrix
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.matrix = TypedArray(params.matrix, CM);
        return self;
    }

    // get the image color channel as a new image
    ,channel: function(channel, grayscale) {
        channel = channel || 0;
        var m = [
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 0,
            0, 0, 0, 0, 255
        ], f = (CHANNEL.A === channel) || grayscale ? 1 : 0;
        m[CHANNEL.R*5+channel] = CHANNEL.R === channel ? 1 : f;
        m[CHANNEL.G*5+channel] = CHANNEL.G === channel ? 1 : f;
        m[CHANNEL.B*5+channel] = CHANNEL.B === channel ? 1 : f;
        return this.set(m);
    }

    // aliases
    // get the image red channel as a new image
    ,redChannel: function(grayscale) {
        return this.channel(CHANNEL.R, grayscale);
    }

    // get the image green channel as a new image
    ,greenChannel: function(grayscale) {
        return this.channel(CHANNEL.G, grayscale);
    }

    // get the image blue channel as a new image
    ,blueChannel: function(grayscale) {
        return this.channel(CHANNEL.B, grayscale);
    }

    // get the image alpha channel as a new image
    ,alphaChannel: function(grayscale) {
        return this.channel(CHANNEL.A, true);
    }

    ,maskChannel: function(channel) {
        channel = channel || 0;
        if (CHANNEL.A === channel) return this;
        var m = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];
        m[channel*5+channel] = 0;
        return this.set(m);
    }

    ,swapChannels: function(channel1, channel2) {
        if (channel1 === channel2) return this;
        var m = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];
        m[channel1*5+channel1] = 0;
        m[channel2*5+channel2] = 0;
        m[channel1*5+channel2] = 1;
        m[channel2*5+channel1] = 1;
        return this.set(m);
    }

    ,invertChannel: function(channel) {
        channel = channel || 0;
        if (CHANNEL.A === channel) return this;
        var m = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];
        m[channel*5+channel] = -1;
        m[channel*5+4] = 255;
        return this.set(m);
    }

    ,invertRed: function() {
        return this.invertChannel(CHANNEL.R);
    }

    ,invertGreen: function() {
        return this.invertChannel(CHANNEL.G);
    }

    ,invertBlue: function() {
        return this.invertChannel(CHANNEL.B);
    }

    ,invertAlpha: function() {
        return this.invertChannel(CHANNEL.A);
    }

    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,invert: function() {
        return this.set(cm_rechannel([
            -1, 0,  0, 0, 255,
            0, -1,  0, 0, 255,
            0,  0, -1, 0, 255,
            0,  0,  0, 1,   0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }

    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,desaturate: function(LUMA) {
        var L = LUMA || FILTER.LUMA;
        return this.set(cm_rechannel([
            L[0], L[1], L[2], 0, 0,
            L[0], L[1], L[2], 0, 0,
            L[0], L[1], L[2], 0, 0,
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    ,grayscale: null

    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,saturate: function(s, LUMA) {
        var sInv, irlum, iglum, iblum, L = LUMA || FILTER.LUMA;
        sInv = 1 - s;  irlum = sInv * L[0];
        iglum = sInv * L[1];  iblum = sInv * L[2];
        return this.set(cm_rechannel([
            (irlum + s), iglum, iblum, 0, 0,
            irlum, (iglum + s), iblum, 0, 0,
            irlum, iglum, (iblum + s), 0, 0,
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }

    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,colorize: function(rgb, amount, LUMA) {
        var r, g, b, inv_amount, L = LUMA || FILTER.LUMA;
        if ( null == amount ) amount = 1;
        r = ((rgb >> 16) & 255) / 255;
        g = ((rgb >> 8) & 255) / 255;
        b = (rgb & 255) / 255;
        inv_amount = 1 - amount;
        return this.set(cm_rechannel([
            (inv_amount + ((amount * r) * L[0])), ((amount * r) * L[1]), ((amount * r) * L[2]), 0, 0,
            ((amount * g) * L[0]), (inv_amount + ((amount * g) * L[1])), ((amount * g) * L[2]), 0, 0,
            ((amount * b) * L[0]), ((amount * b) * L[1]), (inv_amount + ((amount * b) * L[2])), 0, 0,
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }

    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,contrast: function(r, g, b) {
        if (null == g) g = r;
        if (null == b) b = r;
        r += 1.0; g += 1.0; b += 1.0;
        return this.set(cm_rechannel([
            r, 0, 0, 0, (128 * (1 - r)),
            0, g, 0, 0, (128 * (1 - g)),
            0, 0, b, 0, (128 * (1 - b)),
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }

    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,brightness: function(r, g, b) {
        if (null == g) g = r;
        if (null == b) b = r;
        return this.set(cm_rechannel([
            1, 0, 0, 0, r,
            0, 1, 0, 0, g,
            0, 0, 1, 0, b,
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }

    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,adjustHue: function(degrees, LUMA) {
        degrees *= toRad;
        var cos = Cos(degrees), sin = Sin(degrees), L = LUMA || FILTER.LUMA;
        return this.set(cm_rechannel([
            ((L[0] + (cos * (1 - L[0]))) + (sin * -(L[0]))), ((L[1] + (cos * -(L[1]))) + (sin * -(L[1]))), ((L[2] + (cos * -(L[2]))) + (sin * (1 - L[2]))), 0, 0,
            ((L[0] + (cos * -(L[0]))) + (sin * 0.143)), ((L[1] + (cos * (1 - L[1]))) + (sin * 0.14)), ((L[2] + (cos * -(L[2]))) + (sin * -0.283)), 0, 0,
            ((L[0] + (cos * -(L[0]))) + (sin * -((1 - L[0])))), ((L[1] + (cos * -(L[1]))) + (sin * L[1])), ((L[2] + (cos * (1 - L[2]))) + (sin * L[2])), 0, 0,
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }
    ,rotateHue: null

    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,average: function(r, g, b) {
        if (null == r) r = 0.3333;
        if (null == g) g = 0.3333;
        if (null == b) b = 0.3333;
        return this.set(cm_rechannel([
            r, g, b, 0, 0,
            r, g, b, 0, 0,
            r, g, b, 0, 0,
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }

    ,quickContrastCorrection: function(contrast) {
        if (null == contrast) contrast = 1.2;
        return this.set(cm_rechannel([
            contrast, 0, 0, 0, 0,
            0, contrast, 0, 0, 0,
            0, 0, contrast, 0, 0,
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }

    // adapted from glfx.js
    // Gives the image a reddish-brown monochrome tint that imitates an old photograph.
    // 0 to 1 (0 for no effect, 1 for full sepia coloring)
    ,sepia: function(amount) {
        if (null == amount) amount = 0.5;
        if (amount > 1) amount = 1;
        else if (amount < 0) amount = 0;
        return this.set(cm_rechannel([
            1.0 - (0.607 * amount), 0.769 * amount, 0.189 * amount, 0, 0,
            0.349 * amount, 1.0 - (0.314 * amount), 0.168 * amount, 0, 0,
            0.272 * amount, 0.534 * amount, 1.0 - (0.869 * amount), 0, 0,
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }

    ,sepia2: function(amount, LUMA) {
        if (null == amount) amount = 10;
        if (amount > 100) amount = 100;
        amount *= 2.55;
        var L = LUMA || FILTER.LUMA;
        return this.set(cm_rechannel([
            L[0], L[1], L[2], 0, 40,
            L[0], L[1], L[2], 0, 20,
            L[0], L[1], L[2], 0, -amount,
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }

    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,threshold: function(threshold, factor, LUMA) {
        if (null == factor) factor = 256;
        var L = LUMA || FILTER.LUMA;
        return this.set(cm_rechannel(false !== LUMA
        ? [
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold),
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold),
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold),
            0, 0, 0, 1, 0
        ]
        : [
            factor, 0, 0, 0, (-(factor-1) * threshold),
            0, factor, 0, 0, (-(factor-1) * threshold),
            0,  0, factor, 0, (-(factor-1) * threshold),
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }

    ,thresholdRGB: function(threshold, factor) {
        return this.threshold(threshold, factor, false);
    }
    ,threshold_rgb: null

    ,thresholdChannel: function(channel, threshold, factor, LUMA) {
        if (null == factor) factor = 256;
        var m = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ], L = LUMA || FILTER.LUMA;
        if (CHANNEL.A === channel)
        {
            m[channel*5+channel] = factor;
            m[channel*5+4] = -factor * threshold;
        }
        else if (false !== LUMA)
        {
            m[channel*5+CHANNEL.R] = L[0] * factor;
            m[channel*5+CHANNEL.G] = L[1] * factor;
            m[channel*5+CHANNEL.B] = L[2] * factor;
            m[channel*5+4] = -(factor-1) * threshold;
        }
        else
        {
            m[channel*5+CHANNEL.R] = factor;
            m[channel*5+CHANNEL.G] = factor;
            m[channel*5+CHANNEL.B] = factor;
            m[channel*5+4] = -(factor-1) * threshold;
        }
        return this.set(m);
    }

    ,thresholdRed: function(threshold, factor, lumia) {
        return this.thresholdChannel(CHANNEL.R, threshold, factor, lumia);
    }

    ,thresholdGreen: function(threshold, factor, lumia) {
        return this.thresholdChannel(CHANNEL.G, threshold, factor, lumia);
    }

    ,thresholdBlue: function(threshold, factor, lumia) {
        return this.thresholdChannel(CHANNEL.B, threshold, factor, lumia);
    }

    ,thresholdAlpha: function(threshold, factor, lumia) {
        return this.thresholdChannel(CHANNEL.A, threshold, factor, lumia);
    }
    ,threshold_alpha: null

    // RGB to XYZ
    ,RGB2XYZ: function() {
        return this.set(cm_rechannel([
            0.412453, 0.357580, 0.180423, 0, 0,
            0.212671, 0.715160, 0.072169, 0, 0,
            0.019334, 0.119193, 0.950227, 0, 0,
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.XX, CHANNEL.YY, CHANNEL.ZZ, CHANNEL.A
        ));
    }

    // XYZ to RGB
    ,XYZ2RGB: function() {
        return this.set(cm_rechannel([
            3.240479, -1.537150, -0.498535, 0, 0,
            -0.969256, 1.875992, 0.041556, 0, 0,
            0.055648, -0.204043, 1.057311, 0, 0,
            0, 0, 0, 1, 0
        ],
            CHANNEL.XX, CHANNEL.YY, CHANNEL.ZZ, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }

    // RGB to YCbCr
    ,RGB2YCbCr: function() {
        return this.set(cm_rechannel([
            0.299, 0.587, 0.114, 0, 0,
            -0.168736, -0.331264, 0.5, 0, 128,
            0.5, -0.418688, -0.081312, 0, 128,
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.Y, CHANNEL.CB, CHANNEL.CR, CHANNEL.A
        ));
    }

    // YCbCr to RGB
    ,YCbCr2RGB: function() {
        return this.set(cm_rechannel([
            1, 0, 1.402, 0, -179.456,
            1, -0.34414, -0.71414, 0, 135.45984,
            1, 1.772, 0, 0, -226.816,
            0, 0, 0, 1, 0
        ],
            CHANNEL.Y, CHANNEL.CB, CHANNEL.CR, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }

    // RGB to YIQ
    ,RGB2YIQ: function() {
        return this.set(cm_rechannel([
            0.299, 0.587, 0.114, 0, 0,
            0.701, -0.587, -0.114, 0, 0,
            -0.299, -0.587, 0.886, 0, 0,
            0, 0, 0, 1, 0
        ],
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A,
            CHANNEL.Y, CHANNEL.IP, CHANNEL.Q, CHANNEL.A
        ));
    }

    // YIQ to RGB
    ,YIQ2RGB: function() {
        return this.set(cm_rechannel([
            1, 1, 0, 0, 0,
            1, -0.509, -0.194, 0, 0,
            1, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ],
            CHANNEL.Y, CHANNEL.IP, CHANNEL.Q, CHANNEL.A,
            CHANNEL.R, CHANNEL.G, CHANNEL.B, CHANNEL.A
        ));
    }

    // blend with another filter
    ,blend: function(filt, amount) {
        var self = this;
        self.matrix = self.matrix ? cm_combine(self.matrix, filt.matrix, 1-amount, amount, CM) : new CM(filt.matrix);
        return self;
    }

    ,set: function(matrix) {
        var self = this;
        self.matrix = self.matrix ? cm_multiply(self.matrix, matrix) : new CM(matrix);
        self._glsl = null;
        return self;
    }

    ,reset: function() {
        this.matrix = null;
        this._glsl = null;
        return this;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return wasm(this);
    }

    ,combineWith: function(filt) {
        return this.set(filt.matrix);
    }

    // used for internal purposes
    ,_apply: notSupportClamp ? function(im, w, h) {
        //"use asm";
        var self = this, M = self.matrix;
        if (!M) return im;

        var imLen = im.length, i, imArea = imLen>>>2, rem = (imArea&7)<<2,
            p = new CM(32), t = new A8U(4), pr = new CM(4);

        // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
        // linearize array
        for (i=0; i<rem; i+=4)
        {
            t[0]   =  im[i]; t[1] = im[i+1]; t[2] = im[i+2]; t[3] = im[i+3];
            pr[0]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4];
            pr[1]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9];
            pr[2]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            pr[3]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            // clamp them manually
            pr[0] = pr[0]<0 ? 0 : (pr[0]>255 ? 255 : pr[0]);
            pr[1] = pr[1]<0 ? 0 : (pr[1]>255 ? 255 : pr[1]);
            pr[2] = pr[2]<0 ? 0 : (pr[2]>255 ? 255 : pr[2]);
            pr[3] = pr[3]<0 ? 0 : (pr[3]>255 ? 255 : pr[3]);

            im[i  ] = pr[0]|0; im[i+1] = pr[1]|0; im[i+2] = pr[2]|0; im[i+3] = pr[3]|0;
        }
        // partial loop unrolling (1/8 iterations)
        for (i=rem; i<imLen; i+=32)
        {
            t[0]   =  im[i  ]; t[1] = im[i+1]; t[2] = im[i+2]; t[3] = im[i+3];
            p[0 ]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[1 ]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[2 ]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[3 ]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+4]; t[1] = im[i+5]; t[2] = im[i+6]; t[3] = im[i+7];
            p[4 ]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[5 ]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[6 ]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[7 ]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+8]; t[1] = im[i+9]; t[2] = im[i+10]; t[3] = im[i+11];
            p[8 ]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[9 ]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[10]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[11]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+12]; t[1] = im[i+13]; t[2] = im[i+14]; t[3] = im[i+15];
            p[12]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[13]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[14]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[15]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+16]; t[1] = im[i+17]; t[2] = im[i+18]; t[3] = im[i+19];
            p[16]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[17]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[18]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[19]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+20]; t[1] = im[i+21]; t[2] = im[i+22]; t[3] = im[i+23];
            p[20]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[21]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[22]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[23]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+24]; t[1] = im[i+25]; t[2] = im[i+26]; t[3] = im[i+27];
            p[24]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[25]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[26]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[27]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+28]; t[1] = im[i+29]; t[2] = im[i+30]; t[3] = im[i+31];
            p[28]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[29]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[30]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[31]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            // clamp them manually
            p[0 ] = p[0 ]<0 ? 0 : (p[0 ]>255 ? 255 : p[0 ]);
            p[1 ] = p[1 ]<0 ? 0 : (p[1 ]>255 ? 255 : p[1 ]);
            p[2 ] = p[2 ]<0 ? 0 : (p[2 ]>255 ? 255 : p[2 ]);
            p[3 ] = p[3 ]<0 ? 0 : (p[3 ]>255 ? 255 : p[3 ]);
            p[4 ] = p[4 ]<0 ? 0 : (p[4 ]>255 ? 255 : p[4 ]);
            p[5 ] = p[5 ]<0 ? 0 : (p[5 ]>255 ? 255 : p[5 ]);
            p[6 ] = p[6 ]<0 ? 0 : (p[6 ]>255 ? 255 : p[6 ]);
            p[7 ] = p[7 ]<0 ? 0 : (p[7 ]>255 ? 255 : p[7 ]);
            p[8 ] = p[8 ]<0 ? 0 : (p[8 ]>255 ? 255 : p[8 ]);
            p[9 ] = p[9 ]<0 ? 0 : (p[9 ]>255 ? 255 : p[9 ]);
            p[10] = p[10]<0 ? 0 : (p[10]>255 ? 255 : p[10]);
            p[11] = p[11]<0 ? 0 : (p[11]>255 ? 255 : p[11]);
            p[12] = p[12]<0 ? 0 : (p[12]>255 ? 255 : p[12]);
            p[13] = p[13]<0 ? 0 : (p[13]>255 ? 255 : p[13]);
            p[14] = p[14]<0 ? 0 : (p[14]>255 ? 255 : p[14]);
            p[15] = p[15]<0 ? 0 : (p[15]>255 ? 255 : p[15]);
            p[16] = p[16]<0 ? 0 : (p[16]>255 ? 255 : p[16]);
            p[17] = p[17]<0 ? 0 : (p[17]>255 ? 255 : p[17]);
            p[18] = p[18]<0 ? 0 : (p[18]>255 ? 255 : p[18]);
            p[19] = p[19]<0 ? 0 : (p[19]>255 ? 255 : p[19]);
            p[20] = p[20]<0 ? 0 : (p[20]>255 ? 255 : p[20]);
            p[21] = p[21]<0 ? 0 : (p[21]>255 ? 255 : p[21]);
            p[22] = p[22]<0 ? 0 : (p[22]>255 ? 255 : p[22]);
            p[23] = p[23]<0 ? 0 : (p[23]>255 ? 255 : p[23]);
            p[24] = p[24]<0 ? 0 : (p[24]>255 ? 255 : p[24]);
            p[25] = p[25]<0 ? 0 : (p[25]>255 ? 255 : p[25]);
            p[26] = p[26]<0 ? 0 : (p[26]>255 ? 255 : p[26]);
            p[27] = p[27]<0 ? 0 : (p[27]>255 ? 255 : p[27]);
            p[28] = p[28]<0 ? 0 : (p[28]>255 ? 255 : p[28]);
            p[29] = p[29]<0 ? 0 : (p[29]>255 ? 255 : p[29]);
            p[30] = p[30]<0 ? 0 : (p[30]>255 ? 255 : p[30]);
            p[31] = p[31]<0 ? 0 : (p[31]>255 ? 255 : p[31]);

            im[i   ] = p[0 ]|0; im[i+1 ] = p[1 ]|0; im[i+2 ] = p[2 ]|0; im[i+3 ] = p[3 ]|0;
            im[i+4 ] = p[4 ]|0; im[i+5 ] = p[5 ]|0; im[i+6 ] = p[6 ]|0; im[i+7 ] = p[7 ]|0;
            im[i+8 ] = p[8 ]|0; im[i+9 ] = p[9 ]|0; im[i+10] = p[10]|0; im[i+11] = p[11]|0;
            im[i+12] = p[12]|0; im[i+13] = p[13]|0; im[i+14] = p[14]|0; im[i+15] = p[15]|0;
            im[i+16] = p[16]|0; im[i+17] = p[17]|0; im[i+18] = p[18]|0; im[i+19] = p[19]|0;
            im[i+20] = p[20]|0; im[i+21] = p[21]|0; im[i+22] = p[22]|0; im[i+23] = p[23]|0;
            im[i+24] = p[24]|0; im[i+25] = p[25]|0; im[i+26] = p[26]|0; im[i+27] = p[27]|0;
            im[i+28] = p[28]|0; im[i+29] = p[29]|0; im[i+30] = p[30]|0; im[i+31] = p[31]|0;
        }
        return im;
    } : function(im, w, h) {
        //"use asm";
        var self = this, M = self.matrix;
        if (!M) return im;

        var imLen = im.length, i, imArea = imLen>>>2, rem = (imArea&7)<<2,
            p = new CM(32), t = new A8U(4), pr = new CM(4);

        // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
        // linearize array
        for (i=0; i<rem; i+=4)
        {
            t[0]   =  im[i]; t[1] = im[i+1]; t[2] = im[i+2]; t[3] = im[i+3];
            pr[0]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4];
            pr[1]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9];
            pr[2]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            pr[3]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            im[i  ] = pr[0]|0; im[i+1] = pr[1]|0; im[i+2] = pr[2]|0; im[i+3] = pr[3]|0;
        }
        // partial loop unrolling (1/8 iterations)
        for (i=rem; i<imLen; i+=32)
        {
            t[0]   =  im[i  ]; t[1] = im[i+1]; t[2] = im[i+2]; t[3] = im[i+3];
            p[0 ]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[1 ]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[2 ]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[3 ]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+4]; t[1] = im[i+5]; t[2] = im[i+6]; t[3] = im[i+7];
            p[4 ]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[5 ]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[6 ]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[7 ]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+8]; t[1] = im[i+9]; t[2] = im[i+10]; t[3] = im[i+11];
            p[8 ]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[9 ]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[10]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[11]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+12]; t[1] = im[i+13]; t[2] = im[i+14]; t[3] = im[i+15];
            p[12]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[13]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[14]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[15]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+16]; t[1] = im[i+17]; t[2] = im[i+18]; t[3] = im[i+19];
            p[16]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[17]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[18]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[19]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+20]; t[1] = im[i+21]; t[2] = im[i+22]; t[3] = im[i+23];
            p[20]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[21]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[22]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[23]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+24]; t[1] = im[i+25]; t[2] = im[i+26]; t[3] = im[i+27];
            p[24]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[25]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[26]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[27]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            t[0]   =  im[i+28]; t[1] = im[i+29]; t[2] = im[i+30]; t[3] = im[i+31];
            p[28]  =  M[0 ]*t[0] +  M[1 ]*t[1] +  M[2 ]*t[2] +  M[3 ]*t[3] +  M[4 ];
            p[29]  =  M[5 ]*t[0] +  M[6 ]*t[1] +  M[7 ]*t[2] +  M[8 ]*t[3] +  M[9 ];
            p[30]  =  M[10]*t[0] +  M[11]*t[1] +  M[12]*t[2] +  M[13]*t[3] +  M[14];
            p[31]  =  M[15]*t[0] +  M[16]*t[1] +  M[17]*t[2] +  M[18]*t[3] +  M[19];

            im[i   ] = p[0 ]|0; im[i+1 ] = p[1 ]|0; im[i+2 ] = p[2 ]|0; im[i+3 ] = p[3 ]|0;
            im[i+4 ] = p[4 ]|0; im[i+5 ] = p[5 ]|0; im[i+6 ] = p[6 ]|0; im[i+7 ] = p[7 ]|0;
            im[i+8 ] = p[8 ]|0; im[i+9 ] = p[9 ]|0; im[i+10] = p[10]|0; im[i+11] = p[11]|0;
            im[i+12] = p[12]|0; im[i+13] = p[13]|0; im[i+14] = p[14]|0; im[i+15] = p[15]|0;
            im[i+16] = p[16]|0; im[i+17] = p[17]|0; im[i+18] = p[18]|0; im[i+19] = p[19]|0;
            im[i+20] = p[20]|0; im[i+21] = p[21]|0; im[i+22] = p[22]|0; im[i+23] = p[23]|0;
            im[i+24] = p[24]|0; im[i+25] = p[25]|0; im[i+26] = p[26]|0; im[i+27] = p[27]|0;
            im[i+28] = p[28]|0; im[i+29] = p[29]|0; im[i+30] = p[30]|0; im[i+31] = p[31]|0;
        }
        return im;
    }

    ,canRun: function() {
        return this._isOn && this.matrix;
    }
});
// aliases
ColorMatrixFilter.prototype.grayscale = ColorMatrixFilter.prototype.desaturate;
ColorMatrixFilter.prototype.rotateHue = ColorMatrixFilter.prototype.adjustHue;
ColorMatrixFilter.prototype.threshold_rgb = ColorMatrixFilter.prototype.thresholdRGB;
ColorMatrixFilter.prototype.threshold_alpha = ColorMatrixFilter.prototype.thresholdAlpha;
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    colormatrixfilter: {inputs: [{arg:0,type:FILTER.ImArray},{arg:3,type:FILTER.ColorMatrix}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
    ColorMatrixFilter.prototype._apply_wasm = function(im, w, h) {
        if (!this.matrix) return im;
        return wasm.colormatrixfilter(im, w, h, this.matrix);
    };
    }
    FILTER.unwaitFor(1);
});
}

// private
function glsl(filter)
{
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader(filter.matrix ? [
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform float cm[20];',
    'void main(void) {',
    '   vec4 col = texture2D(img, pix);',
    '   gl_FragColor.r = clamp(cm[0 ]*col.r+cm[1 ]*col.g+cm[2 ]*col.b+cm[3 ]*col.a+cm[4 ],0.0,1.0);',
    '   gl_FragColor.g = clamp(cm[5 ]*col.r+cm[6 ]*col.g+cm[7 ]*col.b+cm[8 ]*col.a+cm[9 ],0.0,1.0);',
    '   gl_FragColor.b = clamp(cm[10]*col.r+cm[11]*col.g+cm[12]*col.b+cm[13]*col.a+cm[14],0.0,1.0);',
    '   gl_FragColor.a = clamp(cm[15]*col.r+cm[16]*col.g+cm[17]*col.b+cm[18]*col.a+cm[19],0.0,1.0);',
    '}'
    ].join('\n') : GLSL.DEFAULT)
    .input('cm', function(filter) {
        var m = filter.matrix;
        return [
        m[0 ], m[1 ], m[2 ], m[3 ], m[4 ]/255,
        m[5 ], m[6 ], m[7 ], m[8 ], m[9 ]/255,
        m[10], m[11], m[12], m[13], m[14]/255,
        m[15], m[16], m[17], m[18], m[19]/255
        ];
    })
    .end();
    return glslcode.code();
}
function wasm()
{
    return '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';
}
}(FILTER);/**
*
* Color Map Filter(s)
*
* Changes target coloring combining current pixel color values according to non-linear color map
*
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MAP, CHANNEL = FILTER.CHANNEL, MODE = FILTER.MODE,
    GLSL = FILTER.Util.GLSL, Color = FILTER.Color, CM = FILTER.ColorMatrix,
    TypedArray = FILTER.Util.Array.typed, notSupportClamp = FILTER._notSupportClamp,
    function_body = FILTER.Util.String.function_body, HAS = Object.prototype.hasOwnProperty;

// ColorMapFilter
var ColorMapFilter = FILTER.Create({
    name: "ColorMapFilter"

    ,init: function ColorMapFilter(M, init) {
        var self = this;
        if (M) self.set(M, init);
    }

    ,path: FILTER.Path
    ,_map: null
    ,_mapInit: null
    ,_mapName: null
    ,_mapChanged: false
    // parameters
    ,thresholds: null
    // NOTE: quantizedColors should contain 1 more element than thresholds
    ,quantizedColors: null
    ,mode: MODE.COLOR

    ,dispose: function() {
        var self = this;
        self._map = null;
        self._mapInit = null;
        self._mapName = null;
        self._mapChanged = null;
        self.thresholds = null;
        self.quantizedColors = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this, json;
        json = {
            _mapName: self._mapName || null
            ,_map: ("generic" === self._mapName) && self._map && self._mapChanged ? (self._map.filter || self._map).toString() : null
            ,_mapInit: ("generic" === self._mapName) && self._mapInit && self._mapChanged ? self._mapInit.toString() : null
            ,thresholds: self.thresholds
            ,quantizedColors: self.quantizedColors
        };
        self._mapChanged = false;
        return json;
    }

    ,unserialize: function(params) {
        var self = this;
        self.thresholds = TypedArray(params.thresholds, Array);
        self.quantizedColors = TypedArray(params.quantizedColors, Array);

        //self._mapName = params._mapName;
        //self._map = params._map;
        if (!params._map && params._mapName && HAS.call(MAP, params._mapName))
        {
            self.set(params._mapName);
        }
        else if (params._map && ("generic" === params._mapName))
        {
            // using bind makes the code become [native code] and thus unserializable
            /*self._map = new Function("FILTER", '"use strict"; return ' + params._map)( FILTER );
            if ( params._mapInit )
                self._mapInit = new Function("FILTER", '"use strict"; return ' + params._mapInit)( FILTER );*/
            self.set(params._map, params._mapInit||null);
        }
        /*else
        {
            self._map = null;
        }*/
        return self;
    }

    ,RGB2HSV: function() {
        return this.set("rgb2hsv");
    }

    ,HSV2RGB: function() {
        return this.set("hsv2rgb");
    }

    ,RGB2HSL: function() {
        return this.set("rgb2hsl");
    }

    ,HSL2RGB: function() {
        return this.set("hsl2rgb");
    }

    ,RGB2HWB: function() {
        return this.set("rgb2hwb");
    }

    ,HWB2RGB: function() {
        return this.set("hwb2rgb");
    }

    ,RGB2CMYK: function() {
        return this.set("rgb2cmyk");
    }

    /*,RGB2ILL: function() {
        return this.set("rgb2ill");
    }*/

    ,hue: function() {
        return this.set("hue");
    }

    ,saturation: function() {
        return this.set("saturation");
    }

    ,quantize: function(thresholds, quantizedColors) {
        var self = this;
        self.thresholds = thresholds;
        self.quantizedColors = quantizedColors;
        return self.set("quantize");
    }
    ,threshold: null

    ,mask: function(min, max, background) {
        var self = this;
        self.thresholds = [min, max];
        self.quantizedColors = [background || 0];
        return self.set("mask");
    }
    ,extract: null

    ,set: function(M, preample) {
        var self = this;
        if (M && HAS.call(MAP, String(M)))
        {
            if (self._mapName !== String(M))
            {
                self._mapName = String(M);
                self._map = MAP[self._mapName];
                self._mapInit = MAP["init__" + self._mapName];
                self._apply = apply__(self._map, self._mapInit);
            }
            self._mapChanged = false;
        }
        else if (M)
        {
            self._mapName = "generic";
            self._map = T;
            self._mapInit = preample || null;
            self._apply = apply__(self._map, self._mapInit);
            self._mapChanged = true;
        }
        self._glsl = null;
        return self;
    }

    ,reset: function() {
        var self = this;
        self._mapName = null;
        self._map = null;
        self._mapInit = null;
        self._mapChanged = false;
        self._glsl = null;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    // used for internal purposes
    /*,_apply: apply*/

    ,canRun: function() {
        return this._isOn && this._map;
    }
});
// aliases
ColorMapFilter.prototype.threshold = ColorMapFilter.prototype.quantize;
ColorMapFilter.prototype.extract = ColorMapFilter.prototype.mask;

// private methods
function glsl(filter)
{
    if (!filter._map) return (new GLSL.Filter(filter)).begin().shader(GLSL.DEFAULT).end().code();
    if ('quantize' === filter._mapName)
    {
        var toFloat = GLSL.formatFloat,
            thresholds = filter.thresholds || [],
            colors = filter.quantizedColors || [],
            formatThresh = function(t) {
                t = t || 0;
                if (MODE.COLOR === filter.mode)
                    return toFloat(100*((t >> 16)&255)/255+10*((t >> 8)&255)/255+((t)&255)/255);
                else
                    return toFloat(t/255);
            };
        var glslcode = (new GLSL.Filter(filter))
        .begin()
        .shader([
        'varying vec2 pix;',
        'uniform sampler2D img;',
        '#define HUE '+MODE.HUE+'',
        '#define SATURATION '+MODE.SATURATION+'',
        '#define INTENSITY '+MODE.INTENSITY+'',
        '#define COLOR '+MODE.COLOR+'',
        'uniform int mode;',
        Color.GLSLCode(),
        'float col24(float r, float g, float b) {',
        '   return 100.0*r + 10.0*g + 1.0*b;',
        '}',
        'void main(void) {',
            'vec4 i = texture2D(img, pix);',
            'vec4 o = vec4(i.r, i.g, i.b, i.a);',
            'float v;',
            'int found = 0;',
            'if (0.0 != i.a) {',
                'if (mode == HUE) v = rgb2hue(i.r, i.g, i.b)/360.0;',
                'else if (mode == SATURATION) v = rgb2sat(i.r, i.g, i.b, FORMAT_HSV);',
                'else if (mode == INTENSITY) v = intensity(i.r, i.g, i.b);',
                'else v = col24(i.r, i.g, i.b);',
                thresholds.map(function(t, i) {
                    return 'if (0 == found && v <= '+formatThresh(t)+') {found = 1; o.rgb = '+(i<colors.length ? Color.rgb24GL(colors[i]) : 'vec3(1.0,1.0,1.0)')+';}';
                }).join('\n'),
                'gl_FragColor = o;',
            '} else {',
                'gl_FragColor = i;',
            '}',
        '}'
        ].join('\n'))
        .end();
        return glslcode.code();
    }
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    '#define HUE '+MODE.HUE+'',
    '#define SATURATION '+MODE.SATURATION+'',
    '#define INTENSITY '+MODE.INTENSITY+'',
    '#define COLOR '+MODE.COLOR+'',
    'uniform vec4 color;',
    'uniform float minval;',
    'uniform float maxval;',
    'uniform int mapping;',
    'uniform int mode;',
    Color.GLSLCode(),
    'float col24(float r, float g, float b) {',
    '   return 100.0*r + 10.0*g + 1.0*b;',
    '}',
    'vec4 mask(vec4 i, float minval, float maxval, vec4 color) {',
    '    float v = 0.0;',
    '    if (0.0 != i.a) {',
    '        if (mode == HUE) v = rgb2hue(i.r, i.g, i.b);',
    '        else if (mode == SATURATION) v = rgb2sat(i.r, i.g, i.b, FORMAT_HSV);',
    '        else if (mode == INTENSITY) v = intensity(i.r, i.g, i.b);',
    '        else v = col24(i.r, i.g, i.b);',
    '        if (v < minval || v > maxval) return color;',
    '        else return i;',
    '    } else {',
    '        return i;',
    '    }',
    '}',
    (HAS.call(MAP, filter._mapName) || !filter._map.shader
    ? 'vec3 map(vec3 rgb) {return rgb;}'
    : filter._map.shader.toString()),
    'void main(void) {',
        'vec4 c = texture2D(img, pix);',
        'vec4 o = vec4(c.r, c.g, c.b, c.a);',
        'float v;',
        'if (1 == mapping)      {o.xyz = rgb2hsv(c.r, c.g, c.b).xyz; o.x /= 360.0;}',
        'else if (2 == mapping) {o.rgb = hsv2rgb(c.r, c.g, c.b).rgb;}',
        'else if (3 == mapping) {o.xyz = rgb2hsl(c.r, c.g, c.b).xyz; o.x /= 360.0;}',
        'else if (4 == mapping) {o.rgb = hsl2rgb(c.r, c.g, c.b).rgb;}',
        'else if (5 == mapping) {o.xyz = rgb2hwb(c.r, c.g, c.b).xyz; o.x /= 360.0;}',
        'else if (6 == mapping) {o.rgb = hwb2rgb(c.r, c.g, c.b).rgb;}',
        'else if (7 == mapping) {o.xyz = rgb2cmyk(c.r, c.g, c.b).xyz;}',
        'else if (8 == mapping) {v=rgb2hue(c.r, c.g, c.b)/360.0; o=vec4(v,v,v,c.a);}',
        'else if (9 == mapping) {v=rgb2sat(c.r, c.g, c.b, FORMAT_HSV); o=vec4(v,v,v,c.a);}',
        'else if (10 == mapping){o = mask(c, minval, maxval, color);}',
        'else                   {o.rgb = map(c.rgb);}',
        'gl_FragColor = o;',
    '}'
    ].join('\n'))
    .input('mapping', function(filter) {
        return "rgb2hsv" === filter._mapName ? 1 : (
                "hsv2rgb" === filter._mapName ? 2 : (
                "rgb2hsl" === filter._mapName ? 3 : (
                "hsl2rgb" === filter._mapName ? 4 : (
                "rgb2hwb" === filter._mapName ? 5 : (
                "hwb2rgb" === filter._mapName ? 6 : (
                "rgb2cmyk" === filter._mapName ? 7 : (
                "hue" === filter._mapName ? 8 : (
                "saturation" === filter._mapName ? 9 : (
                "mask" === filter._mapName ? 10 : 0
                )
                )
                )
                )
                )
                )
                )
            )
        );
    })
    .input('color', function(filter) {
        var cols = filter.quantizedColors || [0],
            color = cols[0] || 0;
        return [
        ((color >>> 16) & 255)/255,
        ((color >>> 8) & 255)/255,
        (color & 255)/255,
        ((color >>> 24) & 255)/255
        ];
    })
    .input('minval', function(filter) {
        var thresh = filter.thresholds || [0, 0],
            t0 = thresh[0] || 0,
            t1 = thresh[1] || 0;
        return MODE.COLOR === filter.mode ? (
            100*((t0 >> 16)&255)/255+10*((t0 >> 8)&255)/255+((t0)&255)/255
            ) :
            (t0);
    })
    .input('maxval', function(filter) {
        var thresh = filter.thresholds || [0, 0],
            t0 = thresh[0] || 0,
            t1 = thresh[1] || 0;
        return MODE.COLOR === filter.mode ? (
            100*((t1 >> 16)&255)/255+10*((t1 >> 8)&255)/255+((t1)&255)/255
            ) :
            (t1);
    });
    if (filter._map.shader && filter._map.inputs) filter._map.inputs.forEach(function(i) {
        if (i.name) glslcode.input(i.name, i.setter, i.iname);
    });
    return glslcode.end().code();
}
function apply__(map, preample)
{
    var __INIT__ = preample ? function_body(preample) : '', __APPLY__ = function_body(map.filter || map),
        __CLAMP__ = notSupportClamp ? "c[0] = 0>c[0] ? 0 : (255<c[0] ? 255: c[0]); c[1] = 0>c[1] ? 0 : (255<c[1] ? 255: c[1]); c[2] = 0>c[2] ? 0 : (255<c[2] ? 255: c[2]); c[3] = 0>c[3] ? 0 : (255<c[3] ? 255: c[3]);" : '';
        //"use asm";
    return (new Function("FILTER", "\"use strict\"; return function(im, w, h){\
    var self = this;\
    if (!self._map) return im;\
    var x, y, i, i0, imLen = im.length, imArea = imLen>>>2, rem = (imArea&7)<<2, c = new FILTER.ColorMatrix(4);\
\
    "+__INIT__+";\
    \
    x=0; y=0;\
    for (i=0; i<rem; i+=4)\
    {\
        c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        if (++x>=w) {x=0; ++y;}\
    }\
    for (i0=rem; i0<imLen; i0+=32)\
    {\
        i=i0; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
        i+=4; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
        i+=4; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
        i+=4; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
        i+=4; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
        i+=4; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
        i+=4; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
        i+=4; c[0] = im[i]; c[1] = im[i+1]; c[2] = im[i+2]; c[3] = im[i+3];\
        "+__APPLY__+";\
        "+__CLAMP__+";\
        im[i] = c[0]|0; im[i+1] = c[1]|0; im[i+2] = c[2]|0; im[i+3] = c[3]|0;\
        \
        if (++x>=w) {x=0; ++y;}\
    }\
    return im;\
};"))(FILTER);
}


//
// private color maps
MAP = {

    "rgb2hsv": "function() {\
        if (0 !== c[3])\
        {\
            RGB2HSV(c, 0);\
            C0 = c[0]; C1 = c[1]; C2 = c[2];\
            c[CH] = C0; c[CS] = C1; c[CV] = C2;\
        }\
    }"
    ,"init__rgb2hsv": "function() {\
        var C0, C1, C2, CH = FILTER.CHANNEL.H, CS = FILTER.CHANNEL.S, CV = FILTER.CHANNEL.V, RGB2HSV = FILTER.Color.RGB2HSV;\
    }"

    ,"rgb2hsl": "function() {\
        if (0 !== c[3])\
        {\
            RGB2HSL(c, 0);\
            C0 = c[0]; C1 = c[1]; C2 = c[2];\
            c[CH] = C0; c[CS] = C1; c[CL] = C2;\
        }\
    }"
    ,"init__rgb2hsl": "function() {\
        var C0, C1, C2, CH = FILTER.CHANNEL.H, CS = FILTER.CHANNEL.S, CL = FILTER.CHANNEL.L, RGB2HSL = FILTER.Color.RGB2HSL;\
    }"

    ,"rgb2hwb": "function() {\
        if (0 !== c[3])\
        {\
            RGB2HWB(c, 0);\
            C0 = c[0]; C1 = c[1]; C2 = c[2];\
            c[CH] = C0; c[CW] = C1; c[CB] = C2;\
        }\
    }"
    ,"init__rgb2hwb": "function() {\
        var C0, C1, C2, CH = FILTER.CHANNEL.H, CW = FILTER.CHANNEL.WH, CB = FILTER.CHANNEL.BL, RGB2HWB = FILTER.Color.RGB2HWB;\
    }"

    ,"hsv2rgb": "function() {\
        if (0 !== c[3])\
        {\
            C0 = c[CH]; C1 = c[CS]; C2 = c[CV];\
            c[0] = C0; c[1] = C1; c[2] = C2;\
            HSV2RGB(c, 0);\
        }\
    }"
    ,"init__hsv2rgb": "function() {\
        var C0, C1, C2, CH = FILTER.CHANNEL.H, CS = FILTER.CHANNEL.S, CV = FILTER.CHANNEL.V, HSV2RGB = FILTER.Color.HSV2RGB;\
    }"

    ,"hsl2rgb": "function() {\
        if (0 !== c[3])\
        {\
            C0 = c[CH]; C1 = c[CS]; C2 = c[CL];\
            c[0] = C0; c[1] = C1; c[2] = C2;\
            HSL2RGB(c, 0);\
        }\
    }"
    ,"init__hsl2rgb": "function() {\
        var C0, C1, C2, CH = FILTER.CHANNEL.H, CS = FILTER.CHANNEL.S, CL = FILTER.CHANNEL.L, HSL2RGB = FILTER.Color.HSL2RGB;\
    }"

    ,"hwb2rgb": "function() {\
        if (0 !== c[3])\
        {\
            C0 = c[CH]; C1 = c[CW]; C2 = c[CB];\
            c[0] = C0; c[1] = C1; c[2] = C2;\
            HWB2RGB(c, 0);\
        }\
    }"
    ,"init__hwb2rgb": "function() {\
        var C0, C1, C2, CH = FILTER.CHANNEL.H, CW = FILTER.CHANNEL.WH, CB = FILTER.CHANNEL.BL, HWB2RGB = FILTER.Color.HWB2RGB;\
    }"

    ,"rgb2cmyk": "function() {\
        if (0 !== c[3])\
        {\
            RGB2CMYK(c, 0);\
            C0 = c[0]; C1 = c[1]; C2 = c[2];\
            c[CY] = C0; c[MA] = C1; c[YE] = C2;\
        }\
    }"
    ,"init__rgb2cmyk": "function() {\
        var C0, C1, C2, CY = FILTER.CHANNEL.CY, MA = FILTER.CHANNEL.MA, YE = FILTER.CHANNEL.YE, RGB2CMYK = FILTER.Color.RGB2CMYK;\
    }"

    ,"rgb2ill": "function() {\
        if (0 !== c[3])\
        {\
            RGB2ILL(c, 0);\
            C0 = c[0]; C1 = c[1]; C2 = c[2];\
            c[ILL1] = min(255, max(0, 255-127*C0)); c[ILL2] = min(255, max(0, 255-127*C1)); c[ILL3] = min(255, max(0, 255-127*C2));\
        }\
    }"
    ,"init__rgb2ill": "function() {\
        var C0, C1, C2, ILL1 = FILTER.CHANNEL.ILL1, ILL2 = FILTER.CHANNEL.ILL2, ILL3 = FILTER.CHANNEL.ILL3, RGB2ILL = FILTER.Color.RGB2ILL, min = Math.min, max = Math.max;\
    }"

    ,"hue": "function() {\
        if (0 !== c[3])\
        {\
            HHH = HUE(c[0], c[1], c[2])*0.7083333333333333/*255/360*/;\
            c[0] = HHH; c[1] = HHH; c[2] = HHH;\
        }\
    }"
    ,"init__hue": "function() {\
        var HUE = FILTER.Color.hue, HHH;\
    }"

    ,"saturation": "function() {\
        if (0 !== c[3])\
        {\
            SSS = SATURATION(c[0], c[1], c[2]);\
            c[0] = SSS; c[1] = SSS; c[2] = SSS;\
        }\
    }"
    ,"init__saturation": "function() {\
        var SATURATION = FILTER.Color.saturation, SSS;\
    }"

    ,"quantize": "function() {\
        if (0 !== c[3])\
        {\
            J = 0; V = VALUE(c[0], c[1], c[2])*FACTOR;\
            while (J<THRESH_LEN && V>THRESH[J]) ++J;\
            COLVAL = J < COLORS_LEN ? COLORS[j] : 0xffffff;\
            c[0] = (COLVAL >>> 16) & 255; c[1] = (COLVAL >>> 8) & 255; c[2] = COLVAL & 255;\
        }\
    }"
    ,"init__quantize": "function() {\
        var FACTOR = 1, VALUE = FILTER.MODE.HUE === self.mode ? FILTER.Color.hue : (FILTER.MODE.SATURATION === self.mode ? FILTER.Color.saturation : (FILTER.MODE.INTENSITY === self.mode ? FILTER.Color.intensity : FILTER.Color.color24)),\
            THRESH = self.thresholds, THRESH_LEN = THRESH.length,\
            COLORS = self.quantizedColors, COLORS_LEN = COLORS.length, J, COLVAL, V;\
        //if (FILTER.MODE.HUE === self.mode) FACTOR = 0.7083333333333333/*255/360*/;\
    }"

    ,"mask": "function() {\
        if (0 !== c[3])\
        {\
            V = VALUE(c[0], c[1], c[2]);\
            if ((V < MIN_VALUE) || (V > MAX_VALUE))\
            {\
                c[0] = COLVAL[0];\
                c[1] = COLVAL[1];\
                c[2] = COLVAL[2];\
                c[3] = COLVAL[3];\
            }\
        }\
    }"
    ,"init__mask": "function() {\
        var VALUE = FILTER.MODE.HUE === self.mode ? FILTER.Color.hue : (FILTER.MODE.SATURATION === self.mode ? FILTER.Color.saturation : (FILTER.MODE.INTENSITY === self.mode ? FILTER.Color.intensity : FILTER.Color.color24)),\
            MIN_VALUE = self.thresholds[0], MAX_VALUE = self.thresholds[self.thresholds.length-1],\
            COLVAL = [(self.quantizedColors[0] >>> 16) & 255, (self.quantizedColors[0] >>> 8) & 255, self.quantizedColors[0] & 255, (self.quantizedColors[0] >>> 24) & 255], V;\
    }"
};

}(FILTER);/**
*
* Affine Matrix Filter
*
* Distorts the target image according to an linear affine matrix mapping function
*
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var IMG = FILTER.ImArray, AM = FILTER.AffineMatrix, TypedArray = FILTER.Util.Array.typed,
    GLSL = FILTER.Util.GLSL,
    MODE = FILTER.MODE, toRad = FILTER.CONST.toRad,
    stdMath = Math, Sin = stdMath.sin, Cos = stdMath.cos, Tan = stdMath.tan,
    am_multiply = FILTER.Util.Filter.am_multiply;

// AffineMatrixFilter
var AffineMatrixFilter = FILTER.Create({
    name: "AffineMatrixFilter"

    ,init: function AffineMatrixFilter(matrix) {
        var self = this;
        self.matrix = matrix && matrix.length ? new AM(matrix) : null;
    }

    ,path: FILTER.Path
    // parameters
    ,matrix: null
    ,mode: MODE.CLAMP
    ,color: 0

    ,dispose: function() {
        var self = this;
        self.matrix = null;
        self.color = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             matrix: self.matrix
            ,color: self.color
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.matrix = TypedArray(params.matrix, AM);
        self.color = params.color;
        return self;
    }

    ,flipX: function() {
        return this.set([
            -1, 0, 0, 1,
            0, 1, 0, 0
        ]);
    }

    ,flipY: function() {
        return this.set([
            1, 0, 0, 0,
            0, -1, 0, 1
        ]);
    }

    ,flipXY: function() {
        return this.set([
            -1, 0, 0, 1,
            0, -1, 0, 1
        ]);
    }

    ,translate: function(tx, ty, rel) {
        return this.set(rel
        ? [
            1, 0, 0, tx,
            0, 1, 0, ty
        ]
        : [
            1, 0, tx, 0,
            0, 1, ty, 0
        ]);
    }
    ,shift: null

    ,rotate: function(theta) {
        var s = Sin(theta), c = Cos(theta);
        return this.set([
            c, -s, 0, 0,
            s, c, 0, 0
        ]);
    }

    ,scale: function(sx, sy) {
        return this.set([
            sx, 0, 0, 0,
            0, sy, 0, 0
        ]);
    }

    ,skew: function(thetax, thetay) {
        return this.set([
            1, thetax ? Tan(thetax) : 0, 0, 0,
            thetay ? Tan(thetay) : 0, 1, 0, 0
        ]);
    }

    ,set: function(matrix) {
        var self = this;
        self.matrix = self.matrix ? am_multiply(self.matrix, matrix) : new AM(matrix);
        self._glsl = null;
        return self;
    }

    ,reset: function() {
        this.matrix = null;
        this._glsl = null;
        return this;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return wasm(this);
    }

    ,combineWith: function(filt) {
        return this.set(filt.matrix);
    }

    // used for internal purposes
    ,_apply: function(im, w, h) {
        //"use asm";
        var self = this, T = self.matrix;
        if (!T) return im;
        var x, y, yw, nx, ny, i, j, imLen = im.length,
            imArea = imLen>>>2, bx = w-1, by = imArea-w,
            dst = new IMG(imLen), color = self.color||0, r, g, b, a,
            COLOR = MODE.COLOR, CLAMP = MODE.CLAMP, WRAP = MODE.WRAP, IGNORE = MODE.IGNORE,
            Ta = T[0], Tb = T[1], Tx = T[2]+T[3]*bx,
            Tcw = T[4]*w, Td = T[5], Tyw = T[6]*w+T[7]*by,
            mode = self.mode || IGNORE
        ;

        if (COLOR === mode)
        {
            a = (color >>> 24)&255;
            r = (color >>> 16)&255;
            g = (color >>> 8)&255;
            b = (color)&255;

            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ++y; yw+=w;}

                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;
                if (0>nx || nx>bx || 0>ny || ny>by)
                {
                    // color
                    dst[i] = r;   dst[i+1] = g;
                    dst[i+2] = b;  dst[i+3] = a;
                    continue;
                }
                j = ((nx|0) + (ny|0)) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        else if (IGNORE === mode)
        {
            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ++y; yw+=w;}

                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;

                // ignore
                ny = ny > by || ny < 0 ? yw : ny;
                nx = nx > bx || nx < 0 ? x : nx;

                j = ((nx|0) + (ny|0)) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        else if (WRAP === mode)
        {
            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ++y; yw+=w;}

                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;

                // wrap
                ny = ny > by ? ny-imArea : (ny < 0 ? ny+imArea : ny);
                nx = nx > bx ? nx-w : (nx < 0 ? nx+w : nx);

                j = ((nx|0) + (ny|0)) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        else //if (CLAMP === mode)
        {
            for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ++y; yw+=w;}

                nx = Ta*x + Tb*y + Tx; ny = Tcw*x + Td*yw + Tyw;

                // clamp
                ny = ny > by ? by : (ny < 0 ? 0 : ny);
                nx = nx > bx ? bx : (nx < 0 ? 0 : nx);

                j = ((nx|0) + (ny|0)) << 2;
                dst[i] = im[j];   dst[i+1] = im[j+1];
                dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
            }
        }
        return dst;
    }

    ,canRun: function() {
        return this._isOn && this.matrix;
    }
});
// aliases
AffineMatrixFilter.prototype.shift = AffineMatrixFilter.prototype.translate;
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    affinematrixfilter: {inputs: [{arg:0,type:FILTER.ImArray},{arg:4,type:FILTER.AffineMatrix}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
    AffineMatrixFilter.prototype._apply_wasm = function(im, w, h) {
        var self = this;
        if (!self.matrix) return im;
        return wasm.affinematrixfilter(im, w, h, self.mode||0, self.matrix, self.color||0);
    };
    }
    FILTER.unwaitFor(1);
});
}

function glsl(filter)
{
    var m = filter.matrix, glslcode = new GLSL.Filter(filter);
    glslcode
    .begin()
    .shader(m ? [
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform float am[6];',
    'uniform vec4 color;',
    '#define IGNORE '+MODE.IGNORE+'',
    '#define CLAMP '+MODE.CLAMP+'',
    '#define COLOR '+MODE.COLOR+'',
    '#define WRAP '+MODE.WRAP+'',
    'uniform int mode;',
    'void main(void) {',
    '   vec2 p = vec2(am[0]*pix.x+am[1]*pix.y+am[2], am[3]*pix.x+am[4]*pix.y+am[5]);',
    '   if (0.0 > p.x || 1.0 < p.x || 0.0 > p.y || 1.0 < p.y) {',
    '       if (COLOR == mode) {gl_FragColor = color;}',
    '       else if (CLAMP == mode) {gl_FragColor = texture2D(img, vec2(clamp(p.x, 0.0, 1.0),clamp(p.y, 0.0, 1.0)));}',
    '       else if (WRAP == mode) {',
    '           if (0.0 > p.x) p.x += 1.0;',
    '           if (1.0 < p.x) p.x -= 1.0;',
    '           if (0.0 > p.y) p.y += 1.0;',
    '           if (1.0 < p.y) p.y -= 1.0;',
    '           gl_FragColor = texture2D(img, p);',
    '       }',
    '       else {gl_FragColor = texture2D(img, pix);}',
    '   } else {',
    '       gl_FragColor = texture2D(img, p);',
    '   }',
    '}'
    ].join('\n') : GLSL.DEFAULT);
    if (m)
    {
        glslcode.input('color', function(filter) {
            var color = filter.color || 0;
            return [
            ((color >>> 16) & 255)/255,
            ((color >>> 8) & 255)/255,
            (color & 255)/255,
            ((color >>> 24) & 255)/255
            ];
        }).input('am', function(filter, w, h) {
            var m = filter.matrix;
            return [
            m[0], m[1], m[2]/w+m[3],
            m[4], m[5], m[6]/h+m[7]
            ];
        });
    }
    return glslcode.end().code();
}
function wasm()
{
    return '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';
}
}(FILTER);/**
*
* Displacement Map Filter
*
* Displaces/Distorts the target image according to displace map
*
* @param displaceMap Optional (an Image used as a  dimaplcement map)
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MODE = FILTER.MODE, CHANNEL = FILTER.CHANNEL,
    TypedArray = FILTER.Util.Array.typed, GLSL = FILTER.Util.GLSL,
    stdMath = Math, Min = stdMath.min, Max = stdMath.max, Floor = stdMath.floor;

// DisplacementMap Filter
var DisplacementMapFilter = FILTER.Create({
    name: "DisplacementMapFilter"

    ,init: function DisplacementMapFilter(displacemap) {
        var self = this;
        if (displacemap) self.setInput("map", displacemap);
    }

    ,path: FILTER.Path
    // parameters
    ,scaleX: 1
    ,scaleY: 1
    ,startX: 0
    ,startY: 0
    ,componentX: 0
    ,componentY: 0
    ,color: 0
    ,mode: MODE.CLAMP
    ,hasInputs: true

    ,dispose: function() {
        var self = this;
        self.scaleX = null;
        self.scaleY = null;
        self.startX = null;
        self.startY = null;
        self.componentX = null;
        self.componentY = null;
        self.color = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             scaleX: self.scaleX
            ,scaleY: self.scaleY
            ,startX: self.startX
            ,startY: self.startY
            ,componentX: self.componentX
            ,componentY: self.componentY
            ,color: self.color
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.scaleX = params.scaleX;
        self.scaleY = params.scaleY;
        self.startX = params.startX;
        self.startY = params.startY;
        self.componentX = params.componentX;
        self.componentY = params.componentY;
        self.color = params.color;
        return self;
    }

    ,reset: function() {
        this.unsetInput("map");
        return this;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return wasm(this);
    }

    // used for internal purposes
    ,_apply: function(im, w, h) {
        //"use asm";
        var self = this, Map;

        Map = self.input("map"); if (!Map) return im;

        var map, mapW, mapH, mapArea, displace, ww, hh,
            color = self.color||0, alpha, red, green, blue,
            sty, stx, styw, bx0, by0, bx, by, bxx = w-1, byy = h-1, rem,
            i, j, k, x, y, ty, ty2, yy, xx, mapOff, dstOff, srcOff,
            SX = self.scaleX*0.00390625, SY = self.scaleY*0.00390625,
            X = self.componentX, Y = self.componentY,
            applyArea, imArea, imLen, mapLen, imcpy, srcx, srcy,
            IGNORE = MODE.IGNORE, CLAMP = MODE.CLAMP,
            COLOR = MODE.COLOR, WRAP = MODE.WRAP,
            mode = self.mode||IGNORE,
            IMG = FILTER.ImArray, copy = FILTER.Util.Array.copy,
            A16I = FILTER.Array16I;

        map = Map[0]; mapW = Map[1]; mapH = Map[2];
        mapLen = map.length; mapArea = mapLen>>>2;
        ww = Min(mapW, w); hh = Min(mapH, h);
        imLen = im.length; applyArea = (ww*hh)<<2; imArea = imLen>>>2;

        // make start relative
        //bxx = w-1; byy = h-1;
        stx = Floor(self.startX*bxx);
        sty = Floor(self.startY*byy);
        styw = sty*w;
        bx0 = -stx; by0 = -sty;
        bx = bxx-stx; by = byy-sty;

        displace = new A16I(mapArea<<1);
        imcpy = copy(im);

        // pre-compute indices,
        // reduce redundant computations inside the main application loop (faster)
        // this is faster if mapArea <= imArea, else a reverse algorithm may be needed (todo)
        rem = (mapArea&15)<<2; j=0;
        for (i=0; i<rem; i+=4)
        {
            displace[j++] = Floor(( map[i   +X] - 128 ) * SX);
            displace[j++] = Floor(( map[i   +Y] - 128 ) * SY);
        }
        for (i=rem; i<mapLen; i+=64)
        {
            displace[j++] = Floor(( map[i   +X] - 128 ) * SX);
            displace[j++] = Floor(( map[i   +Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+4 +X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+4 +Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+8 +X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+8 +Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+12+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+12+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+16+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+16+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+20+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+20+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+24+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+24+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+28+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+28+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+32+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+32+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+36+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+36+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+40+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+40+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+44+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+44+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+48+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+48+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+52+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+52+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+56+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+56+Y] - 128 ) * SY);
            displace[j++] = Floor(( map[i+60+X] - 128 ) * SX);
            displace[j++] = Floor(( map[i+60+Y] - 128 ) * SY);
        }

        // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
        if (COLOR === mode)
        {
            alpha = (color >>> 24) & 255;
            red = (color >>> 16) & 255;
            green = (color >>> 8) & 255;
            blue = color & 255;
            for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,++x)
            {
                // update image coordinates
                if (x>=ww) {x=0; ++y; ty+=w; ty2+=mapW;}

                // if inside the application area
                if (y<by0 || y>by || x<bx0 || x>bx) continue;

                xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;

                j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];

                // color
                if (srcy>byy || srcy<0 || srcx>bxx || srcx<0)
                {
                    im[dstOff] = red;  im[dstOff+1] = green;
                    im[dstOff+2] = blue;  im[dstOff+3] = alpha;
                    continue;
                }

                srcOff = (srcx + srcy*w)<<2;
                // new pixel values
                im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
                im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
            }
        }
        else if (IGNORE === mode)
        {
            for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,++x)
            {
                // update image coordinates
                if (x>=ww) {x=0; ++y; ty+=w; ty2+=mapW;}

                // if inside the application area
                if (y<by0 || y>by || x<bx0 || x>bx) continue;

                xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;

                j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];

                // ignore
                if (srcy>byy || srcy<0 || srcx>bxx || srcx<0) continue;

                srcOff = (srcx + srcy*w)<<2;
                // new pixel values
                im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
                im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
            }
        }
        else if (WRAP === mode)
        {
            for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,++x)
            {
                // update image coordinates
                if (x>=ww) {x=0; ++y; ty+=w; ty2+=mapW;}

                // if inside the application area
                if (y<by0 || y>by || x<bx0 || x>bx) continue;

                xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;

                j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];

                // wrap
                srcy = srcy>byy ? srcy-h : (srcy<0 ? srcy+h : srcy);
                srcx = srcx>bxx ? srcx-w : (srcx<0 ? srcx+w : srcx);

                srcOff = (srcx + srcy*w)<<2;
                // new pixel values
                im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
                im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
            }
        }
        else //if (CLAMP === mode)
        {
            for (x=0,y=0,ty=0,ty2=0,i=0; i<applyArea; i+=4,++x)
            {
                // update image coordinates
                if (x>=ww) {x=0; ++y; ty+=w; ty2+=mapW;}

                // if inside the application area
                if (y<by0 || y>by || x<bx0 || x>bx) continue;

                xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;

                j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];

                // clamp
                srcy = srcy>byy ? byy : (srcy<0 ? 0 : srcy);
                srcx = srcx>bxx ? bxx : (srcx<0 ? 0 : srcx);

                srcOff = (srcx + srcy*w)<<2;
                // new pixel values
                im[dstOff] = imcpy[srcOff];   im[dstOff+1] = imcpy[srcOff+1];
                im[dstOff+2] = imcpy[srcOff+2];  im[dstOff+3] = imcpy[srcOff+3];
            }
        }
        return im;
    }
});
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    displacementmapfilter: {inputs: [{arg:0,type:FILTER.ImArray},{arg:4,type:FILTER.ImArray}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
        DisplacementMapFilter.prototype._apply_wasm = function(im, w, h) {
            var self = this, map = self.input("map");
            if (!map) return im;
            return wasm.displacementmapfilter(im, w, h, self.mode||IGNORE, map[0], map[1], map[2], self.startX||0, self.startY||0, self.componentX||0, self.componentY||0, self.scaleX, self.scaleY, self.color||0);
        };
    }
    FILTER.unwaitFor(1);
});
}

function glsl(filter)
{
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader(!filter.input("map") ? GLSL.DEFAULT : [
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform sampler2D map;',
    'uniform vec2 mapSize;',
    'uniform vec2 start;',
    'uniform vec2 scale;',
    'uniform vec4 color;',
    'uniform ivec2 component;',
    '#define IGNORE '+MODE.IGNORE+'',
    '#define CLAMP '+MODE.CLAMP+'',
    '#define COLOR '+MODE.COLOR+'',
    '#define WRAP '+MODE.WRAP+'',
    '#define RED '+CHANNEL.R+'',
    '#define GREEN '+CHANNEL.G+'',
    '#define BLUE '+CHANNEL.B+'',
    '#define ALPHA '+CHANNEL.A+'',
    'uniform int mode;',
    'void main(void) {',
    '   if (pix.x < start.x || pix.x > min(1.0,start.x+mapSize.x) || pix.y < start.y || pix.y > min(1.0,start.y+mapSize.y)) {',
    '      gl_FragColor = texture2D(img, pix);',
    '   } else {',
    '       vec4 mc = texture2D(map, (pix-start)/mapSize);',
    '       vec2 p = vec2(pix.x, pix.y);',
    '       if (ALPHA == component.x) p.x += (mc.a - 0.5)*scale.x;',
    '       else if (BLUE == component.x) p.x += (mc.b - 0.5)*scale.x;',
    '       else if (GREEN == component.x) p.x += (mc.g - 0.5)*scale.x;',
    '       else p.x += (mc.r - 0.5)*scale.x;',
    '       if (ALPHA == component.y) p.y += (mc.a - 0.5)*scale.y;',
    '       else if (BLUE == component.y) p.y += (mc.b - 0.5)*scale.y;',
    '       else if (GREEN == component.y) p.y += (mc.g - 0.5)*scale.y;',
    '       else p.y += (mc.r - 0.5)*scale.y;',
    '       if (0.0 > p.x || 1.0 < p.x || 0.0 > p.y || 1.0 < p.y) {',
    '           if (COLOR == mode) {gl_FragColor = color;}',
    '           else if (CLAMP == mode) {gl_FragColor = texture2D(img, vec2(clamp(p.x, 0.0, 1.0),clamp(p.y, 0.0, 1.0)));}',
    '           else if (WRAP == mode) {',
    '               if (0.0 > p.x) p.x += 1.0;',
    '               if (1.0 < p.x) p.x -= 1.0;',
    '               if (0.0 > p.y) p.y += 1.0;',
    '               if (1.0 < p.y) p.y -= 1.0;',
    '               gl_FragColor = texture2D(img, p);',
    '           }',
    '           else {gl_FragColor = texture2D(img, pix);}',
    '       } else {',
    '           gl_FragColor = texture2D(img, p);',
    '       }',
    '   }',
    '}'
    ].join('\n'))
    .input('map', function(filter) {
        var displaceMap = filter.input("map");
        return {data:displaceMap[0], width:displaceMap[1], height:displaceMap[2]};
    })
    .input('mapSize', function(filter, w, h) {
        var displaceMap = filter.input("map");
        return [displaceMap[1]/w, displaceMap[2]/h];
    })
    .input('scale', function(filter) {return [1.4*filter.scaleX/255, /*if UNPACK_FLIP_Y_WEBGL*//*-*/1.4*filter.scaleY/255];})
    .input('start', function(filter) {return [filter.startX, filter.startY];})
    .input('component', function(filter) {return [filter.componentX, filter.componentY];})
    .input('color', function(filter) {
        var color = filter.color || 0;
        return [
        ((color >>> 16) & 255)/255,
        ((color >>> 8) & 255)/255,
        (color & 255)/255,
        ((color >>> 24) & 255)/255
        ];
    })
    .end();
    return glslcode.code();
}
function wasm()
{
    return 'AGFzbQEAAAABSAtgAX8AYAAAYAJ/fwF/YAJ/fwBgAX8Bf2ADf39/AGAOf39/f39/f319f399fX8Bf2AEf39/fwBgA39/fgBgAAF/YAN/f38BfwINAQNlbnYFYWJvcnQABwMaGQEAAAMDCAEJAgIDBAABAAEECgIFAgUGBgAFAwEAAQZADH8BQQALfwFBAAt/AUEAC38BQQALfwFBAAt/AUEAC38BQQALfwFBAAt/AUEAC38BQQALfwBB0A0LfwFB7I0CCwdWBwVfX25ldwAKBV9fcGluAAwHX191bnBpbgANCV9fY29sbGVjdAAOC19fcnR0aV9iYXNlAwoGbWVtb3J5AgAVZGlzcGxhY2VtZW50bWFwZmlsdGVyABgIARAMARUK4DAZYgECf0HQChAZQaAIEBlBkAkQGUHgDBAZQaANEBkjBCIBKAIEQXxxIQADQCAAIAFHBEAgACgCBEEDcUEDRwRAQQBB0AlBoAFBEBAAAAsgAEEUahAPIAAoAgRBfHEhAAwBCwsLYQEBfyAAKAIEQXxxIgFFBEAgACgCCEUgAEHsjQJJcUUEQEEAQdAJQYABQRIQAAALDwsgACgCCCIARQRAQQBB0AlBhAFBEBAAAAsgASAANgIIIAAgASAAKAIEQQNxcjYCBAufAQEDfyAAIwVGBEAgACgCCCIBRQRAQQBB0AlBlAFBHhAAAAsgASQFCyAAEAIjBiEBIAAoAgwiAkECTQR/QQEFIAJB0A0oAgBLBEBB0ApBkAtBFUEcEAAACyACQQJ0QdQNaigCAEEgcQshAyABKAIIIQIgACMHRUECIAMbIAFyNgIEIAAgAjYCCCACIAAgAigCBEEDcXI2AgQgASAANgIIC5QCAQR/IAEoAgAiAkEBcUUEQEEAQeALQYwCQQ4QAAALIAJBfHEiAkEMSQRAQQBB4AtBjgJBDhAAAAsgAkGAAkkEfyACQQR2BUEfQfz///8DIAIgAkH8////A08bIgJnayIEQQdrIQMgAiAEQQRrdkEQcwsiAkEQSSADQRdJcUUEQEEAQeALQZwCQQ4QAAALIAEoAgghBSABKAIEIgQEQCAEIAU2AggLIAUEQCAFIAQ2AgQLIAEgACADQQR0IAJqQQJ0aigCYEYEQCAAIANBBHQgAmpBAnRqIAU2AmAgBUUEQCAAIANBAnRqIgEoAgRBfiACd3EhAiABIAI2AgQgAkUEQCAAIAAoAgBBfiADd3E2AgALCwsLwwMBBX8gAUUEQEEAQeALQckBQQ4QAAALIAEoAgAiA0EBcUUEQEEAQeALQcsBQQ4QAAALIAFBBGogASgCAEF8cWoiBCgCACICQQFxBEAgACAEEAQgASADQQRqIAJBfHFqIgM2AgAgAUEEaiABKAIAQXxxaiIEKAIAIQILIANBAnEEQCABQQRrKAIAIgEoAgAiBkEBcUUEQEEAQeALQd0BQRAQAAALIAAgARAEIAEgBkEEaiADQXxxaiIDNgIACyAEIAJBAnI2AgAgA0F8cSICQQxJBEBBAEHgC0HpAUEOEAAACyAEIAFBBGogAmpHBEBBAEHgC0HqAUEOEAAACyAEQQRrIAE2AgAgAkGAAkkEfyACQQR2BUEfQfz///8DIAIgAkH8////A08bIgJnayIDQQdrIQUgAiADQQRrdkEQcwsiAkEQSSAFQRdJcUUEQEEAQeALQfsBQQ4QAAALIAAgBUEEdCACakECdGooAmAhAyABQQA2AgQgASADNgIIIAMEQCADIAE2AgQLIAAgBUEEdCACakECdGogATYCYCAAIAAoAgBBASAFdHI2AgAgACAFQQJ0aiIAIAAoAgRBASACdHI2AgQLzwEBAn8gAiABrVQEQEEAQeALQf4CQQ4QAAALIAFBE2pBcHFBBGshASAAKAKgDCIEBEAgBEEEaiABSwRAQQBB4AtBhQNBEBAAAAsgAUEQayAERgRAIAQoAgAhAyABQRBrIQELBSAAQaQMaiABSwRAQQBB4AtBkgNBBRAAAAsLIAKnQXBxIAFrIgRBFEkEQA8LIAEgA0ECcSAEQQhrIgNBAXJyNgIAIAFBADYCBCABQQA2AgggAUEEaiADaiIDQQI2AgAgACADNgKgDCAAIAEQBQuXAQECfz8AIgFBAEwEf0EBIAFrQABBAEgFQQALBEAAC0HwjQJBADYCAEGQmgJBADYCAANAIABBF0kEQCAAQQJ0QfCNAmpBADYCBEEAIQEDQCABQRBJBEAgAEEEdCABakECdEHwjQJqQQA2AmAgAUEBaiEBDAELCyAAQQFqIQAMAQsLQfCNAkGUmgI/AKxCEIYQBkHwjQIkCQvwAwEDfwJAAkACQAJAIwIOAwABAgMLQQEkAkEAJAMQASMGJAUjAw8LIwdFIQEjBSgCBEF8cSEAA0AgACMGRwRAIAAkBSABIAAoAgRBA3FHBEAgACAAKAIEQXxxIAFyNgIEQQAkAyAAQRRqEA8jAw8LIAAoAgRBfHEhAAwBCwtBACQDEAEjBiMFKAIEQXxxRgRAIwshAANAIABB7I0CSQRAIAAoAgAiAgRAIAIQGQsgAEEEaiEADAELCyMFKAIEQXxxIQADQCAAIwZHBEAgASAAKAIEQQNxRwRAIAAgACgCBEF8cSABcjYCBCAAQRRqEA8LIAAoAgRBfHEhAAwBCwsjCCEAIwYkCCAAJAYgASQHIAAoAgRBfHEkBUECJAILIwMPCyMFIgAjBkcEQCAAKAIEIgFBfHEkBSMHRSABQQNxRwRAQQBB0AlB5QFBFBAAAAsgAEHsjQJJBEAgAEEANgIEIABBADYCCAUjACAAKAIAQXxxQQRqayQAIABBBGoiAEHsjQJPBEAjCUUEQBAHCyMJIQEgAEEEayECIABBD3FBASAAGwR/QQEFIAIoAgBBAXELBEBBAEHgC0GyBEEDEAAACyACIAIoAgBBAXI2AgAgASACEAULC0EKDwsjBiIAIAA2AgQgACAANgIIQQAkAgtBAAvUAQECfyABQYACSQR/IAFBBHYFQR8gAUEBQRsgAWdrdGpBAWsgASABQf7///8BSRsiAWdrIgNBB2shAiABIANBBGt2QRBzCyIBQRBJIAJBF0lxRQRAQQBB4AtBzgJBDhAAAAsgACACQQJ0aigCBEF/IAF0cSIBBH8gACABaCACQQR0akECdGooAmAFIAAoAgBBfyACQQFqdHEiAQR/IAAgAWgiAUECdGooAgQiAkUEQEEAQeALQdsCQRIQAAALIAAgAmggAUEEdGpBAnRqKAJgBUEACwsLwQQBBX8gAEHs////A08EQEGQCUHQCUGFAkEfEAAACyMAIwFPBEACQEGAECECA0AgAhAIayECIwJFBEAjAK1CyAF+QuQAgKdBgAhqJAEMAgsgAkEASg0ACyMAIgIgAiMBa0GACElBCnRqJAELCyMJRQRAEAcLIwkhBCAAQRBqIgJB/P///wNLBEBBkAlB4AtBzQNBHRAAAAsgBEEMIAJBE2pBcHFBBGsgAkEMTRsiBRAJIgJFBEA/ACICIAVBgAJPBH8gBUEBQRsgBWdrdGpBAWsgBSAFQf7///8BSRsFIAULQQQgBCgCoAwgAkEQdEEEa0d0akH//wNqQYCAfHFBEHYiAyACIANKG0AAQQBIBEAgA0AAQQBIBEAACwsgBCACQRB0PwCsQhCGEAYgBCAFEAkiAkUEQEEAQeALQfMDQRAQAAALCyAFIAIoAgBBfHFLBEBBAEHgC0H1A0EOEAAACyAEIAIQBCACKAIAIQMgBUEEakEPcQRAQQBB4AtB6QJBDhAAAAsgA0F8cSAFayIGQRBPBEAgAiAFIANBAnFyNgIAIAJBBGogBWoiAyAGQQRrQQFyNgIAIAQgAxAFBSACIANBfnE2AgAgAkEEaiACKAIAQXxxaiIDIAMoAgBBfXE2AgALIAIgATYCDCACIAA2AhAjCCIBKAIIIQMgAiABIwdyNgIEIAIgAzYCCCADIAIgAygCBEEDcXI2AgQgASACNgIIIwAgAigCAEF8cUEEamokACACQRRqIgFBACAA/AsAIAELXwAgACABNgIAIAEEQCAARQRAQQBB0AlBpwJBDhAAAAsjByABQRRrIgEoAgRBA3FGBEAgAEEUaygCBEEDcSIAIwdFRgRAIAEQAwUjAkEBRiAAQQNGcQRAIAEQAwsLCwsLYQEDfyAABEAgAEEUayIBKAIEQQNxQQNGBEBB4AxB0AlB0gJBBxAAAAsgARACIwQiAygCCCECIAEgA0EDcjYCBCABIAI2AgggAiABIAIoAgRBA3FyNgIEIAMgATYCCAsgAAtuAQJ/IABFBEAPCyAAQRRrIgEoAgRBA3FBA0cEQEGgDUHQCUHgAkEFEAAACyMCQQFGBEAgARADBSABEAIjCCIAKAIIIQIgASAAIwdyNgIEIAEgAjYCCCACIAEgAigCBEEDcXI2AgQgACABNgIICws5ACMCQQBKBEADQCMCBEAQCBoMAQsLCxAIGgNAIwIEQBAIGgwBCwsjAK1CyAF+QuQAgKdBgAhqJAELOAACQAJAAkACQAJAAkAgAEEIaygCAA4GAAECBQUFBAsPCw8LDwsACwALIAAoAgAiAARAIAAQGQsLVgA/AEEQdEHsjQJrQQF2JAFBhApBgAo2AgBBiApBgAo2AgBBgAokBEGkCkGgCjYCAEGoCkGgCjYCAEGgCiQGQbQLQbALNgIAQbgLQbALNgIAQbALJAgLQwEBfyMLQQRrJAsjC0HsDUgEQEGAjgJBsI4CQQFBARAAAAsjCyIBQQA2AgAgASAANgIAIAAoAgghACABQQRqJAsgAAvWAQEBfyMLQRBrJAsjC0HsDUgEQEGAjgJBsI4CQQFBARAAAAsjCyIDQgA3AwAgA0IANwMIIABFBEAjC0EMQQMQCiIANgIACyMLIAA2AgQgAEEAEAsjCyAANgIEIABBADYCBCMLIAA2AgQgAEEANgIIIAFB/P///wMgAnZLBEBBoAhB0AhBE0E5EAAACyMLIAEgAnQiAUEBEAoiAjYCCCMLIAA2AgQjCyACNgIMIAAgAhALIwsgADYCBCAAIAI2AgQjCyAANgIEIAAgATYCCCMLQRBqJAsgAAtrAQF/IwtBBGskCyMLQewNSARAQYCOAkGwjgJBAUEBEAAACyMLIgJBADYCACACIAA2AgAgASAAKAIITwRAQdAKQaAMQbUCQS0QAAALIwsiAiAANgIAIAEgACgCBGotAAAhACACQQRqJAsgAAtwAQF/IwtBBGskCyMLQewNSARAQYCOAkGwjgJBAUEBEAAACyMLIgNBADYCACADIAA2AgAgASAAKAIIQQF2TwRAQdAKQaAMQc8DQcAAEAAACyMLIgMgADYCACAAKAIEIAFBAXRqIAI7AQAgA0EEaiQLC3IBAX8jC0EEayQLIwtB7A1IBEBBgI4CQbCOAkEBQQEQAAALIwsiAkEANgIAIAIgADYCACABIAAoAghBAXZPBEBB0ApBoAxBxANBwAAQAAALIwsiAiAANgIAIAAoAgQgAUEBdGouAQAhACACQQRqJAsgAAt8AQF/IwtBBGskCyMLQewNSARAQYCOAkGwjgJBAUEBEAAACyMLIgNBADYCACADIAA2AgAgASAAKAIITwRAQdAKQaAMQcACQS0QAAALIwsiAyAANgIAIAEgACgCBGpB/wEgAmtBH3UgAnIgAkEfdUF/c3E6AAAgA0EEaiQLC8UQARN/IwtBEGskCwJAIwtB7A1IDQAjCyIQQgA3AwAgEEIANwMIIBAgADYCACAAEBEhFSMLIAQ2AgAgBBARIhZBAnYhFyAFIAEgASAFShsiESAGIAIgAiAGShtsQQJ0IRIgCCACQQFrIhiylPwAIhkgAWwhE0EAIAcgAUEBayIGspT8ACIQayEUIwshGiMLQQhrJAsjC0HsDUgNACMLIhtCADcDACAbQQxBBBAKIhs2AgAjCyIcIBs2AgQgHCAbIBVBABASIhU2AgAjC0EIaiQLIBogFTYCBCMLIBU2AgAjCyAANgIIIwtBDGskCyMLQewNSA0AIwsiGkIANwMAIBpBADYCCCAaIBU2AgAgGiAANgIEIBogADYCCCAAEBEhGiMLIBU2AgggFRARIBpIBEBB0ApBoAxB7g5BBRAAAAsjCyIbIBU2AgggFSgCBCEcIBsgADYCCCAcIAAoAgQgGvwKAAAgG0EMaiQLIwshGiMLQQhrJAsjC0HsDUgNACALQwAAgDuUIQcgDEMAAIA7lCEIQQAgGWshGyAGIBBrIRwgGCAZayEdIwsiHkIANwMAIB5BDEEFEAoiHjYCACMLIh8gHjYCBCAfIB4gF0EBdEEBEBIiFzYCACMLQQhqJAsgGiAXNgIMA0AgDyAWSARAIwsiGiAXNgIAIBogBDYCCCAXIA4gBCAJIA9qEBNBgAFrsyAHlPwAwRAUIwsgFzYCACAOQQFqIhpBAWohDiMLIAQ2AgggFyAaIAQgCiAPahATQYABa7MgCJT8AMEQFCAPQQRqIQ8MAQsLIANBA0YEQCANQRh2IQogDUEQdkH/AXEhDiANQQh2Qf8BcSEWIA1B/wFxIRpBACEDQQAhBEEAIQ1BACEJQQAhDwNAIA8gEkgEQCADIBFOBEAgBEEBaiEEIAEgDWohDSAFIAlqIQlBACEDCwJAIAQgG0ggBCAdSnIgAyAUSHIgAyAcSnINACADIBBqIgIgDWogE2pBAnQhHiMLIBc2AgAgFyADIAlqQQF0Ih8QFSACaiEgIwsgFzYCACAXIB9BAWoQFSAEIBlqaiIfQQBIIBggH0hyIAYgIEhyICBBAEhyBEAjCyAANgIAIAAgHiAOEBYjCyAANgIAIAAgHkEBaiAWEBYjCyAANgIAIAAgHkECaiAaEBYjCyAANgIAIAAgHkEDaiAKEBYMAQsjCyICIAA2AgAgAiAVNgIIIAAgHiAVICAgASAfbGpBAnQiAhATEBYjCyAANgIAIwsgFTYCCCAAIB5BAWogFSACQQFqEBMQFiMLIAA2AgAjCyAVNgIIIAAgHkECaiAVIAJBAmoQExAWIwsgADYCACMLIBU2AgggACAeQQNqIBUgAkEDahATEBYLIA9BBGohDyADQQFqIQMMAQsLBSADBEAgA0EBRgRAQQAhA0EAIQRBACENQQAhCUEAIQ8DQCAPIBJIBEAgAyARTgRAIARBAWohBCABIA1qIQ0gBSAJaiEJQQAhAwsgBCAbSCAEIB1KciADIBRIciADIBxKckUEQCADIBBqIgogDWogE2pBAnQhDiMLIBc2AgAgFyADIAlqQQF0IhYQFSAKaiEKIwsgFzYCACAXIBZBAWoQFSAEIBlqaiIWIAJrIAIgFmogFiAWQQBIGyAWIBhKGyABbCAKIAFrIAEgCmogCiAKQQBIGyAGIApIG2pBAnQhCiMLIAA2AgAjCyAVNgIIIAAgDiAVIAoQExAWIwsgADYCACMLIBU2AgggACAOQQFqIBUgCkEBahATEBYjCyAANgIAIwsgFTYCCCAAIA5BAmogFSAKQQJqEBMQFiMLIAA2AgAjCyAVNgIIIAAgDkEDaiAVIApBA2oQExAWCyAPQQRqIQ8gA0EBaiEDDAELCwVBACEDQQAhBEEAIQ1BACEJQQAhDwNAIA8gEkgEQCADIBFOBEAgBEEBaiEEIAEgDWohDSAFIAlqIQlBACEDCyAEIBtIIAQgHUpyIAMgFEhyIAMgHEpyRQRAIAMgEGoiAiANaiATakECdCEKIwsgFzYCACAXIAMgCWpBAXQiDhAVIAJqIQIjCyAXNgIAIBggFyAOQQFqEBUgBCAZamoiDkEAIA5BAE4bIA4gGEobIAFsIAYgAkEAIAJBAE4bIAIgBkobakECdCECIwsgADYCACMLIBU2AgggACAKIBUgAhATEBYjCyAANgIAIwsgFTYCCCAAIApBAWogFSACQQFqEBMQFiMLIAA2AgAjCyAVNgIIIAAgCkECaiAVIAJBAmoQExAWIwsgADYCACMLIBU2AgggACAKQQNqIBUgAkEDahATEBYLIA9BBGohDyADQQFqIQMMAQsLCwVBACEDQQAhBEEAIQ1BACEJQQAhDwNAIA8gEkgEQCADIBFOBEAgBEEBaiEEIAEgDWohDSAFIAlqIQlBACEDCwJAIAQgG0ggBCAdSnIgAyAUSHIgAyAcSnINACADIBBqIgIgDWogE2pBAnQhCiMLIBc2AgAgFyADIAlqQQF0Ig4QFSACaiECIwsgFzYCACAXIA5BAWoQFSAEIBlqaiIOQQBIIA4gGEpyIAIgBkpyIAJBAEhyDQAjCyIWIAA2AgAgFiAVNgIIIAAgCiAVIAIgASAObGpBAnQiAhATEBYjCyAANgIAIwsgFTYCCCAAIApBAWogFSACQQFqEBMQFiMLIAA2AgAjCyAVNgIIIAAgCkECaiAVIAJBAmoQExAWIwsgADYCACMLIBU2AgggACAKQQNqIBUgAkEDahATEBYLIA9BBGohDyADQQFqIQMMAQsLCwsjC0EQaiQLIAAPC0GAjgJBsI4CQQFBARAAAAtcAQF/IwtBCGskCyMLQewNSARAQYCOAkGwjgJBAUEBEAAACyMLIg4gADYCACAOIAQ2AgQgACABIAIgAyAEIAUgBiAHIAggCSAKIAsgDCANEBchACMLQQhqJAsgAAsgACMHIABBFGsiACgCBEEDcUYEQCAAEAMjA0EBaiQDCwsLvwQVAEGMCAsBLABBmAgLIwIAAAAcAAAASQBuAHYAYQBsAGkAZAAgAGwAZQBuAGcAdABoAEG8CAsBPABByAgLLQIAAAAmAAAAfgBsAGkAYgAvAGEAcgByAGEAeQBiAHUAZgBmAGUAcgAuAHQAcwBB/AgLATwAQYgJCy8CAAAAKAAAAEEAbABsAG8AYwBhAHQAaQBvAG4AIAB0AG8AbwAgAGwAYQByAGcAZQBBvAkLATwAQcgJCycCAAAAIAAAAH4AbABpAGIALwByAHQALwBpAHQAYwBtAHMALgB0AHMAQbwKCwE8AEHICgsrAgAAACQAAABJAG4AZABlAHgAIABvAHUAdAAgAG8AZgAgAHIAYQBuAGcAZQBB/AoLASwAQYgLCxsCAAAAFAAAAH4AbABpAGIALwByAHQALgB0AHMAQcwLCwE8AEHYCwslAgAAAB4AAAB+AGwAaQBiAC8AcgB0AC8AdABsAHMAZgAuAHQAcwBBjAwLATwAQZgMCysCAAAAJAAAAH4AbABpAGIALwB0AHkAcABlAGQAYQByAHIAYQB5AC4AdABzAEHMDAsBPABB2AwLMQIAAAAqAAAATwBiAGoAZQBjAHQAIABhAGwAcgBlAGEAZAB5ACAAcABpAG4AbgBlAGQAQYwNCwE8AEGYDQsvAgAAACgAAABPAGIAagBlAGMAdAAgAGkAcwAgAG4AbwB0ACAAcABpAG4AbgBlAGQAQdANCxoGAAAAIAAAACAAAAAgAAAAAAAAAEEAAACBCA==';
}
}(FILTER);/**
*
* Geometric Map Filter
*
* Distorts the target image according to a geometric mapping function
*
* @param geoMap Optional (the geometric mapping function)
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MAP, GLSLMAP, MODE = FILTER.MODE,
    function_body = FILTER.Util.String.function_body,
    stdMath = Math, floor = stdMath.floor, round = stdMath.round,
    sqrt = stdMath.sqrt, atan = stdMath.atan2,
    sin = stdMath.sin, cos = stdMath.cos,
    max = stdMath.max, min = stdMath.min,
    PI = stdMath.PI, TWOPI = 2*PI,
    clamp = FILTER.Util.Math.clamp,
    X = FILTER.POS.X, Y = FILTER.POS.Y,
    HAS = Object.prototype.hasOwnProperty,
    GLSL = FILTER.Util.GLSL;

// GeometricMapFilter
var GeometricMapFilter = FILTER.Create({
    name: "GeometricMapFilter"

    ,init: function GeometricMapFilter(T, init) {
        var self = this;
        if (T) self.set(T, init);
    }

    ,path: FILTER.Path
    ,_map: null
    ,_mapInit: null
    ,_mapName: null
    ,_mapChanged: false
    // parameters
    ,color: 0
    ,centerX: 0
    ,centerY: 0
    ,posX: 0
    ,posY: 1
    ,angle: 0
    ,radius: 0
    ,mode: MODE.CLAMP

    ,dispose: function() {
        var self = this;

        self._map = null;
        self._mapInit = null;
        self._mapName = null;
        self._mapChanged = null;

        self.color = 0;
        self.centerX = null;
        self.centerY = null;
        self.angle = null;
        self.radius = null;
        self.$super('dispose');

        return self;
    }

    ,serialize: function() {
        var self = this, json;
        json = {
            _mapName: self._mapName || null
            ,_map: ("generic" === self._mapName) && self._map && self._mapChanged ? (self._map.filter || self._map).toString() : null
            ,_mapInit: ("generic" === self._mapName) && self._mapInit && self._mapChanged ? self._mapInit.toString() : null
            ,color: self.color
            ,centerX: self.centerX
            ,centerY: self.centerY
            ,posX: self.posX
            ,posY: self.posY
            ,angle: self.angle
            ,radius: self.radius
        };
        self._mapChanged = false;
        return json;
    }

    ,unserialize: function(params) {
        var self = this;
        self.color = params.color;
        self.centerX = params.centerX;
        self.centerY = params.centerY;
        self.posX = params.posX;
        self.posY = params.posY;
        self.angle = params.angle;
        self.radius = params.radius;

        if (!params._map && params._mapName && HAS.call(MAP, params._mapName))
        {
            self.set(params._mapName);
        }
        else if (params._map && ("generic" === params._mapName))
        {
            // using bind makes the code become [native code] and thus unserializable
            /*self._map = new Function("FILTER", '"use strict"; return ' + params._map)( FILTER );
            if ( params._mapInit )
            self._mapInit = new Function("FILTER", '"use strict"; return ' + params._mapInit)( FILTER );*/
            self.set(params._map, params._mapInit||null);
        }
        /*else
        {
            self._map = null;
        }*/
        return self;
    }

    ,twirl: function(angle, radius, centerX, centerY) {
        var self = this;
        self.angle = angle||0; self.radius = radius||0;
        self.centerX = centerX||0; self.centerY = centerY||0;
        return self.set("twirl");
    }

    ,sphere: function(radius, centerX, centerY) {
        var self = this;
        self.radius = radius||0; self.centerX = centerX||0; self.centerY = centerY||0;
        return self.set("sphere");
    }

    ,polar: function(centerX, centerY, posX, posY) {
        var self = this;
        self.centerX = centerX||0; self.centerY = centerY||0;
        self.posX = posX||0; self.posY = posY||0;
        return self.set("polar");
    }

    ,cartesian: function(centerX, centerY, posX, posY) {
        var self = this;
        self.centerX = centerX||0; self.centerY = centerY||0;
        self.posX = posX||0; self.posY = posY||0;
        return self.set("cartesian");
    }

    ,set: function(T, preample) {
        var self = this;
        if (T && HAS.call(MAP, String(T)))
        {
            if (self._mapName !== String(T))
            {
                self._mapName = String(T);
                self._map = MAP[self._mapName];
                self._mapInit = MAP["init__"+self._mapName];
                self._apply = apply__(self._map, self._mapInit);
            }
            self._mapChanged = false;
        }
        else if (T)
        {
            self._mapName = "generic";
            self._map = T;
            self._mapInit = preample || null;
            self._apply = apply__(self._map, self._mapInit);
            self._mapChanged = true;
        }
        self._glsl = null;
        return self;
    }

    ,reset: function() {
        var self = this;
        self._mapName = null;
        self._map = null;
        self._mapInit = null;
        self._mapChanged = false;
        self._glsl = null;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return wasm(this);
    }

    ,canRun: function() {
        return this._isOn && this._map;
    }
});
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    geometricmapfilter: {inputs: [{arg:0,type:FILTER.ImArray},{arg:5,type:FILTER.Array32F}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
        GeometricMapFilter.prototype._apply_wasm = function(im, w, h) {
            var self = this, map = self._mapName, mapCode;
            if (!map) return im;
            mapCode = 'twirl' === map ? 1 : (
                    'sphere' === map ? 2 : (
                    'polar' === map ? 3 : (
                    'cartesian' === map ? 4 : 0
                    )
                )
            );
            // custom
            if (0 === mapCode) return self._apply(im, w, h);
            return wasm.geometricmapfilter(im, w, h, self.mode||0, mapCode, [self.centerX||0, self.centerY||0,self.radius||0,self.angle||0,self.posX||0,self.posY||0], self.color||0);
        };
    }
    FILTER.unwaitFor(1);
});
}

// private methods
function apply__(map, preample)
{
    var __INIT__ = preample ? function_body(preample) : '', __APPLY__ = function_body(map.filter || map);
        //"use asm";
    return new Function("FILTER", "\"use strict\"; return function(im, w, h) {\
    var self = this;\
    if (!self._map) return im;\
    var x, y, i, j, imLen = im.length, dst = new FILTER.ImArray(imLen), t = new FILTER.Array32F(2),\
        COLOR = FILTER.MODE.COLOR, CLAMP = FILTER.MODE.CLAMP, WRAP = FILTER.MODE.WRAP, IGNORE = FILTER.MODE.IGNORE,\
        mode = self.mode||IGNORE, color = self.color||0, r, g, b, a, bx = w-1, by = h-1;\
\
    "+__INIT__+";\
    \
    if (COLOR === mode)\
    {\
        a = (color >>> 24)&255;\
        r = (color >>> 16)&255;\
        g = (color >>> 8)&255;\
        b = (color)&255;\
    \
        for (x=0,y=0,i=0; i<imLen; i+=4,++x)\
        {\
            if (x>=w) {x=0; ++y;}\
            \
            t[0] = x; t[1] = y;\
            \
            "+__APPLY__+";\
            \
            if (0>t[0] || t[0]>bx || 0>t[1] || t[1]>by)\
            {\
                /* color */\
                dst[i] = r;   dst[i+1] = g;\
                dst[i+2] = b;  dst[i+3] = a;\
                continue;\
            }\
            \
            j = ((t[0]|0) + (t[1]|0)*w) << 2;\
            dst[i] = im[j];   dst[i+1] = im[j+1];\
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];\
        }\
    }\
    else if (IGNORE === mode)\
    {\
        for (x=0,y=0,i=0; i<imLen; i+=4,++x)\
        {\
            if (x>=w) {x=0; ++y;}\
            \
            t[0] = x; t[1] = y;\
            \
            "+__APPLY__+";\
            \
            /* ignore */\
            t[1] = t[1] > by || t[1] < 0 ? y : t[1];\
            t[0] = t[0] > bx || t[0] < 0 ? x : t[0];\
            \
            j = ((t[0]|0) + (t[1]|0)*w) << 2;\
            dst[i] = im[j];   dst[i+1] = im[j+1];\
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];\
        }\
    }\
    else if (WRAP === mode)\
    {\
        for (x=0,y=0,i=0; i<imLen; i+=4,++x)\
        {\
            if (x>=w) {x=0; ++y;}\
            \
            t[0] = x; t[1] = y;\
            \
            "+__APPLY__+";\
            \
            /* wrap */\
            t[1] = t[1] > by ? t[1]-h : (t[1] < 0 ? t[1]+h : t[1]);\
            t[0] = t[0] > bx ? t[0]-w : (t[0] < 0 ? t[0]+w : t[0]);\
            \
            j = ((t[0]|0) + (t[1]|0)*w) << 2;\
            dst[i] = im[j];   dst[i+1] = im[j+1];\
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];\
        }\
    }\
    else /*if (CLAMP === mode)*/\
    {\
        for (x=0,y=0,i=0; i<imLen; i+=4,++x)\
        {\
            if (x>=w) {x=0; ++y;}\
            \
            t[0] = x; t[1] = y;\
            \
            "+__APPLY__+";\
            \
            /* clamp */\
            t[1] = t[1] > by ? by : (t[1] < 0 ? 0 : t[1]);\
            t[0] = t[0] > bx ? bx : (t[0] < 0 ? 0 : t[0]);\
            \
            j = ((t[0]|0) + (t[1]|0)*w) << 2;\
            dst[i] = im[j];   dst[i+1] = im[j+1];\
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];\
        }\
    }\
    return dst;\
};")(FILTER);
}
function glsl(filter)
{
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader(!filter._map ? GLSL.DEFAULT : [
    'varying vec2 pix;',
    'uniform sampler2D img;',
    '#define TWOPI  6.283185307179586',
    '#define IGNORE '+MODE.IGNORE+'',
    '#define CLAMP '+MODE.CLAMP+'',
    '#define COLOR '+MODE.COLOR+'',
    '#define WRAP '+MODE.WRAP+'',
    'uniform int mode;',
    'uniform int swap;',
    'uniform vec2 size;',
    'uniform vec2 center;',
    'uniform float angle;',
    'uniform float radius;',
    'uniform float radius2;',
    'uniform float AMAX;',
    'uniform float RMAX;',
    'uniform vec4 color;',
    'uniform int mapping;',
    GLSLMAP['twirl'],
    GLSLMAP['sphere'],
    GLSLMAP['polar'],
    GLSLMAP['cartesian'],
    (HAS.call(GLSLMAP, filter._mapName) || !filter._map.shader
    ? 'vec2 map(vec2 pix) {return pix;}'
    : filter._map.shader.toString()),
    'void main(void) {',
        'vec2 p = pix;',
        'if (1 == mapping)      p = twirl(pix, center, radius, angle, size);',
        'else if (2 == mapping) p = sphere(pix, center, radius2, size);',
        'else if (3 == mapping) p = polar(pix, center, RMAX, AMAX, size, swap);',
        'else if (4 == mapping) p = cartesian(pix, center, RMAX, AMAX, size, swap);',
        'else                   p = map(pix);',
        'if (0.0 > p.x || 1.0 < p.x || 0.0 > p.y || 1.0 < p.y) {',
            'if (COLOR == mode) {gl_FragColor = color;}',
            'else if (CLAMP == mode) {gl_FragColor = texture2D(img, vec2(clamp(p.x, 0.0, 1.0),clamp(p.y, 0.0, 1.0)));}',
            'else if (WRAP == mode) {',
                'if (0.0 > p.x) p.x += 1.0;',
                'if (1.0 < p.x) p.x -= 1.0;',
                'if (0.0 > p.y) p.y += 1.0;',
                'if (1.0 < p.y) p.y -= 1.0;',
                'gl_FragColor = texture2D(img, p);',
            '}',
            'else {gl_FragColor = texture2D(img, pix);}',
        '} else {',
            'gl_FragColor = texture2D(img, p);',
        '}',
    '}'
    ].join('\n'))
    .input('size', function(filter, w, h) {return [w, h];})
    .input('center', function(filter) {return [filter.centerX, filter.centerY];})
    .input('angle', function(filter) {return filter.angle;})
    .input('radius', function(filter) {return filter.radius;})
    .input('radius2', function(filter) {return filter.radius*filter.radius;})
    .input('AMAX', function(filter) {return TWOPI;})
    .input('RMAX', function(filter, w, h) {
        var cx = filter.centerX,
            cy = filter.centerY,
            fx = (w-1)*(w-1), fy = (h-1)*(h-1);
        return max(
        sqrt(fx * (cx - 0) * (cx - 0) + fy * (cy - 0) * (cy - 0)),
        sqrt(fx * (cx - 1) * (cx - 1) + fy * (cy - 0) * (cy - 0)),
        sqrt(fx * (cx - 0) * (cx - 0) + fy * (cy - 1) * (cy - 1)),
        sqrt(fx * (cx - 1) * (cx - 1) + fy * (cy - 1) * (cy - 1))
        );
    })
    .input('swap', function(filter) {return filter.posX === Y ? 1 : 0;})
    .input('color', function(filter) {
        var color = filter.color || 0;
        return [
        ((color >>> 16) & 255)/255,
        ((color >>> 8) & 255)/255,
        (color & 255)/255,
        ((color >>> 24) & 255)/255
        ];
    })
    .input('mapping', function(filter) {
        return 'twirl' === filter._mapName ? 1 : (
        'sphere' === filter._mapName ? 2 : (
        'polar' === filter._mapName ? 3 : (
        'cartesian' === filter._mapName ? 4 : 0
        )
        )
        );
    });
    if (filter._map.shader && filter._map.inputs) filter._map.inputs.forEach(function(i) {
        if (i.name) glslcode.input(i.name, i.setter, i.iname);
    });
    return glslcode.end().code();
}
// geometric maps
MAP = {
    // adapted from http://je2050.de/imageprocessing/ TwirlMap
     "twirl": "function() {\
        TX = t[0]-CX; TY = t[1]-CY;\
        D = Sqrt(TX*TX + TY*TY);\
        if (D < R)\
        {\
            theta = Atan2(TY, TX) + fact*(R-D);\
            t[0] = CX + D*Cos(theta);  t[1] = CY + D*Sin(theta);\
        }\
    }"
    ,"init__twirl": "function() {\
        var Sqrt = Math.sqrt, Atan2 = Math.atan2, Sin = Math.sin, Cos = Math.cos,\
            CX = self.centerX*(w-1), CY = self.centerY*(h-1),\
            angle = self.angle, R = self.radius, fact = angle/R,\
            D, TX, TY, theta;\
    }"

    // adapted from http://je2050.de/imageprocessing/ SphereMap
    ,"sphere": "function() {\
        TX = t[0]-CX;  TY = t[1]-CY;\
        TX2 = TX*TX; TY2 = TY*TY;\
        D2 = TX2 + TY2;\
        if (D2 < R2)\
        {\
            D2 = R2 - D2; D = Sqrt(D2);\
            thetax = Asin(TX / Sqrt(TX2 + D2)) * invrefraction;\
            thetay = Asin(TY / Sqrt(TY2 + D2)) * invrefraction;\
            t[0] = t[0] - D * Tan(thetax);  t[1] = t[1] - D * Tan(thetay);\
        }\
    }"
    ,"init__sphere": "function() {\
        var Sqrt = Math.sqrt, Asin = Math.asin, Tan = Math.tan,\
            CX = self.centerX*(w-1), CY = self.centerY*(h-1),\
            invrefraction = 1-0.555556,\
            R = self.radius, R2 = R*R,\
            D, TX, TY, TX2, TY2, R2, D2, thetax, thetay;\
    }"
    ,"polar": "function() {\
        if (px === Y)\
        {\
            r = rMax*t[1]/H;\
            a = aMax*t[0]/W;\
            t[1] = round(r*cos(a) + cy);\
            t[0] = round(r*sin(a) + cx);\
        }\
        else\
        {\
            r = rMax*t[0]/W;\
            a = aMax*t[1]/H;\
            t[0] = round(r*cos(a) + cx);\
            t[1] = round(r*sin(a) + cy);\
        }\
    }"
    ,"init__polar": "function() {\
        var sqrt = Math.sqrt, sin = Math.sin, cos = Math.cos,\
            floor = Math.floor, round = Math.round, max = Math.max,\
            W = w-1, H = h-1, Y = 1,\
            cx = self.centerX*W, cy = self.centerY*H,\
            px = self.posX, py = self.posY,\
            aMax = 6.283185307179586,\
            rMax = round(max(\
            sqrt((cx - 0) * (cx - 0) + (cy - 0) * (cy - 0)),\
            sqrt((cx - W) * (cx - W) + (cy - 0) * (cy - 0)),\
            sqrt((cx - 0) * (cx - 0) + (cy - H) * (cy - H)),\
            sqrt((cx - W) * (cx - W) + (cy - H) * (cy - H))\
            )), r, a\
        ;\
    }"
    ,"cartesian": "function() {\
        if (px === Y)\
        {\
            ty = t[0] - cx;\
            tx = t[1] - cy;\
        }\
        else\
        {\
            tx = t[0] - cx;\
            ty = t[1] - cy;\
        }\
        r = sqrt(tx*tx + ty*ty);\
        a = atan(ty, tx);\
        if (0 > a) a += 6.283185307179586;\
        if (px === Y)\
        {\
            t[1] = round(H*r/rMax);\
            t[0] = round(W*a/aMax);\
        }\
        else\
        {\
            t[0] = round(W*r/rMax);\
            t[1] = round(H*a/aMax);\
        }\
    }"
    ,"init__cartesian": "function() {\
        var sqrt = Math.sqrt, atan = Math.atan2,\
            floor = Math.floor, round = Math.round, max = Math.max,\
            W = w-1, H = h-1, Y = 1,\
            cx = self.centerX*W, cy = self.centerY*H,\
            px = self.posX, py = self.posY,\
            aMax = 6.283185307179586,\
            rMax = round(max(\
            sqrt((cx - 0) * (cx - 0) + (cy - 0) * (cy - 0)),\
            sqrt((cx - W) * (cx - W) + (cy - 0) * (cy - 0)),\
            sqrt((cx - 0) * (cx - 0) + (cy - H) * (cy - H)),\
            sqrt((cx - W) * (cx - W) + (cy - H) * (cy - H))\
            )), r, a, tx, ty\
        ;\
    }"
};

GLSLMAP = {
     "twirl": [
     'vec2 twirl(vec2 pix, vec2 center, float R, float angle, vec2 size) {',
        'vec2 T = size*(pix - center);',
        'float D = length(T);',
        'if (D < R) {',
            'float theta = atan(T.y, T.x) + (R-D)*angle/R;',
            'pix = (size*center + vec2(D*cos(theta),  D*sin(theta)))/size;',
        '}',
        'return pix;',
    '}'
    ].join('\n')
    ,"sphere": [
    'vec2 sphere(vec2 pix, vec2 center, float R2, vec2 size) {',
        'vec2 T = size*(pix - center);',
        'float TX2 = T.x*T.x; float TY2 = T.y*T.y;',
        'float D2 = TX2 + TY2;',
        'if (D2 < R2) {',
            'D2 = R2 - D2;',
            'float D = sqrt(D2);',
            'float thetax = asin(T.x / sqrt(TX2 + D2)) * (1.0-0.555556);',
            'float thetay = asin(T.y / sqrt(TY2 + D2)) * (1.0-0.555556);',
            'pix = pix - vec2(D * tan(thetax), D * tan(thetay))/size;',
        '}',
        'return pix;',
    '}'
    ].join('\n')
    ,"polar": [
    'vec2 polar(vec2 pix, vec2 center, float rMax, float aMax, vec2 size, int swap) {',
        'float r = 0.0;',
        'float a = 0.0;',
        '/*pix *= size;*/',
        'if (1 == swap) {',
            'r = pix.y*rMax;',
            'a = pix.x*aMax;',
            'return (size*center + vec2(r*sin(a), r*cos(a)))/size;',
        '} else {',
            'r = pix.x*rMax;',
            'a = pix.y*aMax;',
            'return (size*center + vec2(r*cos(a), r*sin(a)))/size;',
        '}',
    '}'
    ].join('\n')
    ,"cartesian": [
    'vec2 cartesian(vec2 pix, vec2 center, float rMax, float aMax, vec2 size, int swap) {',
        'vec2 xy = size* (pix - center);',
        'float r = 0.0;',
        'float a = 0.0;',
        'if (1 == swap) {',
            'xy = xy.yx;',
            'r = length(xy);',
            'a = atan(xy.y, xy.x);',
            'if (0.0 > a) a += TWOPI;',
            'return vec2(a/aMax, r/rMax);',
        '} else {',
            'r = length(xy);',
            'a = atan(xy.y, xy.x);',
            'if (0.0 > a) a += TWOPI;',
            'return vec2(r/rMax, a/aMax);',
        '}',
    '}'
    ].join('\n')
};
function wasm()
{
    return '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';
}
}(FILTER);/**
*
* Convolution Matrix Filter(s)
*
* Convolves the target image with a matrix filter
*
* @param weights Optional (a convolution matrix as an array of values)
* @param factor Optional (filter normalizer factor)
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MODE = FILTER.MODE, CM = FILTER.ConvolutionMatrix, IMG = FILTER.ImArray,
    A32F = FILTER.Array32F, A16I = FILTER.Array16I, A8U = FILTER.Array8U,
    FilterUtil = FILTER.Util.Filter,
    convolve = FilterUtil.cm_convolve,
    combine = FilterUtil.cm_combine,
    gaussian = FilterUtil.gaussian,
    TypedArray = FILTER.Util.Array.typed,
    notSupportClamp = FILTER._notSupportClamp,
    GLSL = FILTER.Util.GLSL,

    stdMath = Math, sqrt2 = stdMath.SQRT2, toRad = FILTER.CONST.toRad, toDeg = FILTER.CONST.toDeg,
    Abs = stdMath.abs, Sqrt = stdMath.sqrt, Sin = stdMath.sin, Cos = stdMath.cos,
    Min = stdMath.min, Max = stdMath.max,

    // hardcode Pascal numbers, used for binomial kernels
    _pascal = [
        [1],
        [1, 1],
        [1, 2,  1],
        [1, 3,  3,  1],
        [1, 4,  6,  4,  1],
        [1, 5,  10, 10, 5,  1],
        [1, 6,  15, 20, 15, 6,  1],
        [1, 7,  21, 35, 35, 21, 7,  1],
        [1, 8,  28, 56, 70, 56, 28, 8,  1]
    ]
;

//
//  Convolution Matrix Filter
var ConvolutionMatrixFilter = FILTER.Create({
    name: "ConvolutionMatrixFilter"

    ,init: function ConvolutionMatrixFilter(weights, factor, bias, mode) {
        var self = this, d;
        self._coeff = new CM([1.0, 0.0]);
        if (weights && weights.length)
        {
            d = (Sqrt(weights.length)+0.5)|0;
            self.set(weights, d, d, factor||1.0, bias||0.0);
        }
        self.mode = mode || MODE.RGB;
    }

    ,path: FILTER.Path
    ,dimx: 0
    ,dimy: 0
    ,dimx2: 0
    ,dimy2: 0
    ,matrix: null
    ,matrix2: null
    ,_mat: null
    ,_mat2: null
    ,_coeff: null
    ,_isGrad: false
    ,_doIntegral: 0
    ,_doSeparable: false
    ,_doIntegralSeparable: null
    ,_indices: null
    ,_indices2: null
    ,_indicesf: null
    ,_indicesf2: null
    ,_w: null
    ,mode: MODE.RGB

    ,dispose: function() {
        var self = this;
        self.dimx = self.dimy = null;
        self.dimx2 = self.dimy2 = null;
        self.matrix = null;
        self.matrix2 = null;
        self._mat = null;
        self._mat2 = null;
        self._coeff = null;
        self._isGrad = null;
        self._doIntegral = null;
        self._doSeparable = null;
        self._doIntegralSeparable = null;
        self._indices = null;
        self._indices2 = null;
        self._indicesf = null;
        self._indicesf2 = null;
        self._w = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             dimx: self.dimx
            ,dimy: self.dimy
            ,dimx2: self.dimx2
            ,dimy2: self.dimy2
            ,matrix: self.matrix
            ,matrix2: self.matrix2
            ,_mat: self._mat
            ,_mat2: self._mat2
            ,_coeff: self._coeff
            ,_isGrad: self._isGrad
            ,_doIntegral: self._doIntegral
            ,_doSeparable: self._doSeparable
            ,_indices: self._indices
            ,_indices2: self._indices2
            ,_indicesf: self._indicesf
            ,_indicesf2: self._indicesf2
            ,_w: self._w
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.dimx = params.dimx;
        self.dimy = params.dimy;
        self.dimx2 = params.dimx2;
        self.dimy2 = params.dimy2;
        self.matrix = TypedArray(params.matrix, CM);
        self.matrix2 = TypedArray(params.matrix2, CM);
        self._mat = TypedArray(params._mat, CM);
        self._mat2 = TypedArray(params._mat2, CM);
        self._coeff = TypedArray(params._coeff, CM);
        self._isGrad = params._isGrad;
        self._doIntegral = params._doIntegral;
        self._doSeparable = params._doSeparable;
        self._indices = TypedArray(params._indices, A16I);
        self._indices2 = TypedArray(params._indices2, A16I);
        self._indicesf = TypedArray(params._indicesf, A16I);
        self._indicesf2 = TypedArray(params._indicesf2, A16I);
        self._w = params._w ? [TypedArray(params._w[0], CM), +params._w[1], +params._w[2], +params._w[3]] : null;
        return self;
    }

    // generic functional-based kernel filter
    ,functional: function(f, d, separable) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        if (separable)
        {
            // separable
            self.set(functional(d, 1, f), d, 1, 1, 1, 1, d, functional(1, d, f));
            self._doSeparable = true;
        }
        else
        {
            self.set(functional(d, d, f), d, d, 1, 0);
        }
        return self;
    }

    // fast gauss filter
    ,fastGauss: function(quality, d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        quality = (quality||1)|0;
        if (quality < 1) quality = 1;
        else if (quality > 7) quality = 7;
        self.set(ones(d), d, d, 1/(d*d), 0.0);
        self._doIntegralSeparable = [average1(d), d, 1, 1/d, 0, average1(d), 1, d, 1/d, 0];
        self._doIntegral = quality; return self;
    }

    // gauss filter
    ,gauss: function(sigma, d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        self.set(gaussian(d, 1, sigma), d, 1, 1, 1, 1, d, gaussian(1, d, sigma));
        self._doSeparable = true; return self;
    }

    // generic box low-pass filter
    ,lowPass: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        self.set(ones(d), d, d, 1/(d*d), 0.0);
        self._doIntegral = 1; return self;
    }
    ,boxBlur: null

    // generic box high-pass filter (I-LP)
    ,highPass: function(d, f) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        f = null == f ? 1 : f;
        // HighPass Filter = I - (respective)LowPass Filter
        var fact = -f/(d*d);
        self.set(ones(d, fact, 1+fact), d, d, 1.0, 0.0);
        self._doIntegral = 1; return self;
    }

    ,glow: function(f, d) {
        f = null == f ? 0.5 : f;
        return this.highPass(d, -f);
    }

    ,sharpen: function(f, d) {
        f = null == f ? 0.5 : f;
        return this.highPass(d, f);
    }

    ,verticalBlur: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        self.set(average1(d), 1, d, 1/d, 0.0);
        self._doIntegral = 1; return self;
    }

    ,horizontalBlur: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        self.set(average1(d), d, 1, 1/d, 0.0);
        self._doIntegral = 1; return self;
    }

    // supports only vertical, horizontal, diagonal
    ,directionalBlur: function(theta, d) {
        d = null == d ? 3 : (d&1 ? d : d+1);
        theta *= toRad;
        return this.set(twos2(d, Cos(theta), -Sin(theta), 1/d), d, d, 1.0, 0.0);
    }

    // generic binomial(quasi-gaussian) low-pass filter
    ,binomialLowPass: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        /*var filt=binomial(d);
        return this.set(filt.kernel, d, 1/filt.sum); */
        var kernel = binomial1(d), fact = 1/(1<<(d-1));
        self.set(kernel, d, 1, fact, fact, 1, d, kernel);
        self._doSeparable = true; return self;
    }
    ,gaussBlur: null

    // generic binomial(quasi-gaussian) high-pass filter
    ,binomialHighPass: function(d) {
        d = null == d ? 3 : (d&1 ? d : d+1);
        var kernel = binomial2(d);
        // HighPass Filter = I - (respective)LowPass Filter
        return this.set(combine(ones(d), kernel, 1, -1/summa(kernel)), d, d, 1.0, 0.0);
    }

    // X-gradient, partial X-derivative (Prewitt)
    ,prewittX: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(prewitt(d, 0), d, 1.0, 0.0);
        self.set(derivative1(d,1), d, 1, 1, 1, 1, d, average1(d));
        self._doSeparable = true; return self;
    }
    ,gradX: null

    // Y-gradient, partial Y-derivative (Prewitt)
    ,prewittY: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(prewitt(d, 1), d, 1.0, 0.0);
        self.set(average1(d), d, 1, 1, 1, 1, d, derivative1(d,1));
        self._doSeparable = true; return self;
    }
    ,gradY: null

    // directional gradient (Prewitt)
    ,prewittDirectional: function(theta, d) {
        d = null == d ? 3 : (d&1 ? d : d+1);
        theta *= toRad;
        return this.set(combine(prewitt(d, 0), prewitt(d, 1), Cos(theta), Sin(theta)), d, d, 1.0, 0.0);
    }
    ,gradDirectional: null

    // gradient magnitude (Prewitt)
    ,prewitt: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        self.set(prewitt(d, 0), d, d, 1.0, 0.0, d, d, prewitt(d, 1));
        self._isGrad = true; return self;
    }
    ,grad: null

    // partial X-derivative (Sobel)
    ,sobelX: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(sobel(d, 0), d, 1.0, 0.0);
        self.set(derivative1(d,1), d, 1, 1, 1, 1, d, binomial1(d));
        self._doSeparable = true; return self;
    }

    // partial Y-derivative (Sobel)
    ,sobelY: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        // this can be separable
        //return this.set(sobel(d, 1), d, 1.0, 0.0);
        self.set(binomial1(d), d, 1, 1, 1, 1, d, derivative1(d,1));
        self._doSeparable = true; return self;
    }

    // directional gradient (Sobel)
    ,sobelDirectional: function(theta, d) {
        d = null == d ? 3 : (d&1 ? d : d+1);
        theta *= toRad;
        return this.set(combine(sobel(d, 0), sobel(d, 1), Cos(theta), Sin(theta)), d, d, 1.0, 0.0);
    }

    // gradient magnitude (Sobel)
    ,sobel: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        self.set(sobel(d, 0), d, d, 1.0, 0.0, d, d, sobel(d, 1));
        self._isGrad = true; return self;
    }

    ,laplace: function(d) {
        var self = this;
        d = null == d ? 3 : (d&1 ? d : d+1);
        self.set(ones(d, -1, d*d-1), d, d, 1.0, 0.0);
        self._doIntegral = 1; return self;
    }

    ,emboss: function(angle, amount, d) {
        d = null == d ? 3 : (d&1 ? d : d+1);
        angle = null == angle ? -0.25*stdMath.PI : angle*toRad;
        amount = amount || 1;
        return this.set(twos(d, amount*Cos(angle), -amount*Sin(angle), 1), d, d, 1.0, 0.0);
    }
    ,bump: null

    ,edges: function(m) {
        m = m || 1;
        return this.set([
            0,   m,   0,
            m,  -4*m, m,
            0,   m,   0
         ], 3, 3, 1.0, 0.0);
    }
    ,bilateral: function(d, sigmaSpatial, sigmaColor) {
        d = null == d ? 3 : (d&1 ? d : d+1);
        var self = this;
        self.set(ones(d), d, d, 1, 0);
        self._w = bilateral(d, sigmaSpatial||1, sigmaColor||1);
        return self;
    }

    ,set: function(m, dx, dy, f, b, dx2, dy2, m2) {
        var self = this, tmp;

        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        self._doIntegralSeparable = null;
        self.matrix2 = null;
        self.dimx2 = self.dimy2 = 0;
        self._indices2 = self._indicesf2 = null;
        self._mat2 = self._w = null;

        self.matrix = new CM(m);
        if (null == dy) dy = dx;
        self.dimx = dx; self.dimy = dy;
        if (null == f) {f = 1; b = 0;}
        self._coeff[0] = f; self._coeff[1] = b||0;
        tmp = indices(self.matrix, self.dimx, self.dimy);
        self._indices = tmp[0]; self._indicesf = tmp[1]; self._mat = tmp[2];

        if (m2)
        {
            self.matrix2 = new CM(m2);
            self.dimx2 = dx2; self.dimy2 = dy2;
            tmp = indices(self.matrix2, self.dimx2, self.dimy2);
            self._indices2 = tmp[0]; self._indicesf2 = tmp[1]; self._mat2 = tmp[2];
        }
        else if (null != dx2)
        {
            self.dimx2 = dx2;
            self.dimy2 = dy2;
        }

        self._glsl = null;
        return self;
    }

    ,reset: function() {
        var self = this;
        self.matrix = self.matrix2 = null;
        self.dimx = self.dimy = self.dimx2 = self.dimy2 = 0;
        self._mat = self._mat2 = self._w = null;
        self._indices = self._indices2 = self._indicesf = self._indicesf2 = null;
        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        self._doIntegralSeparable = null;
        self._glsl = null;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return wasm(this);
    }

    ,combineWith: function(filt) {
        var self = this;
        if (!filt.matrix) return self;
        return self.matrix ? self.set(convolve(self.matrix, filt.matrix), self.dimx*filt.dimx, self.dimy*filt.dimy, self._coeff[0]*filt._coeff[0]) : self.set(filt.matrix, filt.dimx, filt.dimy, filt._coeff[0], filt._coeff[1]);
    }

    // used for internal purposes
    ,_apply_weighted: function(im, w, h, d, wS, fC) {
        var self = this,
            imLen = im.length,
            dst = new IMG(imLen),
            x, y, yw, xx, yy, yyw,
            r, g, b, r2, g2, b2,
            sr, sg, sb, dr, dg, db,
            bx = w-1, by = h-1, i, j, k,
            radius = d >>>1, l = d*d, f, s,
            exp = stdMath.exp, is_gray = MODE.GRAY === self.mode;
        for (x=0,y=0,yw=0,i=0; i<imLen; i+=4,++x)
        {
            if (x >= w) {x=0; ++y; yw+=w;}
            r = im[i]; g = im[i+1]; b = im[i+2];
            for (s=0,sr=0,sg=0,sb=0,xx=-radius,yy=-radius,yyw=yy*w,k=0; k<l; ++k,++xx)
            {
                if (xx > radius) {xx=-radius; ++yy; yyw+=w;}
                if (0 > x+xx || x+xx > bx || 0 > y+yy || y+yy > by)
                {
                    r2 = r; g2 = g; b2 = b;
                }
                else
                {
                    j = (x+xx + yw+yyw) << 2;
                    r2 = im[j]; g2 = im[j+1]; b2 = im[j+2];
                }
                dr = (r2-r); dg = (g2-g); db = (b2-b);
                f = wS[k]*exp(fC*(dr*dr+dg*dg+db*db));
                s += f;
                sr += f*r2;
                sg += f*g2;
                sb += f*b2;
            }
            sr /= s; sg /= s; sb /= s;
            if (notSupportClamp)
            {
                // clamp them manually
                sr = sr<0 ? 0 : (sr>255 ? 255 : sr);
                sg = sg<0 ? 0 : (sg>255 ? 255 : sg);
                sb = sb<0 ? 0 : (sb>255 ? 255 : sb);
            }
            dst[i  ] = sr|0;
            dst[i+1] = sg|0;
            dst[i+2] = sb|0;
            dst[i+3] = im[i+3];
        }
        return dst;
    }
    ,_apply: function(im, w, h) {
        //"use asm";
        var self = this, mode = self.mode;
        if (!self.matrix) return im;
        if (self._w)
        {
            return self._apply_weighted(im, w, h, self.dimx, self._w[0], self._w[1]);
        }
        // do a faster convolution routine if possible
        else if (self._doIntegral)
        {
            return self.matrix2 ? FilterUtil.integral_convolution(mode, im, w, h, 2, self.matrix, self.matrix2, self.dimx, self.dimy, self.dimx2, self.dimy2, self._coeff[0], self._coeff[1], self._doIntegral) : FilterUtil.integral_convolution(mode, im, w, h, 2, self.matrix, null, self.dimx, self.dimy, self.dimx, self.dimy, self._coeff[0], self._coeff[1], self._doIntegral);
        }
        else if (self._doSeparable)
        {
            return FilterUtil.separable_convolution(mode, im, w, h, 2, self._mat, self._mat2, self._indices, self._indices2, self._coeff[0], self._coeff[1]);
        }

        var imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen),
            t0, t1, t2, t3, i, j, k, x, ty, ty2, tm, tM,
            xOff, yOff, srcOff, r, g, b, a, r2, g2, b2, a2,
            bx = w-1, by = imArea-w, coeff1 = self._coeff[0], coeff2 = self._coeff[1],
            mat = self._mat, mat2 = self._mat2, wt, wt2, _isGrad = self._isGrad,
            mArea, matArea, imageIndices,
            mArea2, matArea2, imageIndices2, ma;

        // apply filter (algorithm direct implementation based on filter definition with some optimizations)
        if (MODE.GRAY === mode)
        {
            if (mat2) // allow to compute a second matrix in-parallel in same pass
            {
                // pre-compute indices,
                // reduce redundant computations inside the main convolution loop (faster)
                mArea = self._indices.length;
                imageIndices = new A16I(self._indices);
                for (k=0; k<mArea; k+=2) imageIndices[k+1] *= w;
                matArea = mat.length;
                mArea2 = self._indices2.length;
                imageIndices2 = new A16I(self._indices2);
                for (k=0; k<mArea2; k+=2) imageIndices2[k+1] *= w;
                matArea2 = mat2.length;

                // do direct convolution
                x=0; ty=0; ma = Max(matArea,matArea2);
                for (i=0; i<imLen; i+=4, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ty+=w;}

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=g=b=a=r2=g2=b2=a2=0;
                    for (k=0, j=0; k<ma; ++k, j+=2)
                    {
                        if (k<matArea)
                        {
                            xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                            if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                            {
                                srcOff = (xOff + yOff)<<2;
                                wt = mat[k]; r += im[srcOff] * wt;
                            }
                        }
                        if (k<matArea2)
                        {
                            xOff = x + imageIndices2[j]; yOff = ty + imageIndices2[j+1];
                            if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                            {
                                srcOff = (xOff + yOff)<<2;
                                wt = mat2[k]; r2 += im[srcOff] * wt;
                            }
                        }
                    }

                    // output
                    if (_isGrad)
                    {
                        r = Abs(r);
                        r2 = Abs(r2);
                        tM = Max(r, r2);
                        if (tM)
                        {
                            // approximation
                            tm = Min(r, r2);
                            t0 = tM*(1+0.43*tm/tM*tm/tM);
                        }
                        else
                        {
                            t0 = 0;
                        }
                    }
                    else
                    {
                        t0 = coeff1*r + coeff2*r2;
                    }
                    if (notSupportClamp)
                    {
                        // clamp them manually
                        t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    }
                    dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
            else
            {
                // pre-compute indices,
                // reduce redundant computations inside the main convolution loop (faster)
                mArea = self._indices.length;
                imageIndices = new A16I(self._indices);
                for (k=0; k<mArea; k+=2) imageIndices[k+1] *= w;
                matArea = mat.length;

                // do direct convolution
                x=0; ty=0;
                for (i=0; i<imLen; i+=4, ++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ty+=w;}

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=g=b=a=0;
                    for (k=0, j=0; k<matArea; ++k, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt;
                    }

                    // output
                    t0 = coeff1*r+coeff2;
                    if (notSupportClamp)
                    {
                        // clamp them manually
                        t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    }
                    dst[i] = t0|0;  dst[i+1] = t0|0;  dst[i+2] = t0|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
        }
        else
        {
            if (mat2) // allow to compute a second matrix in-parallel in same pass
            {
                // pre-compute indices,
                // reduce redundant computations inside the main convolution loop (faster)
                mArea = self._indices.length;
                imageIndices = new A16I(self._indices);
                for (k=0; k<mArea; k+=2) imageIndices[k+1] *= w;
                matArea = mat.length;
                mArea2 = self._indices2.length;
                imageIndices2 = new A16I(self._indices2);
                for (k=0; k<mArea2; k+=2) imageIndices2[k+1] *= w;
                matArea2 = mat2.length;

                // do direct convolution
                x=0; ty=0; ma = Max(matArea,matArea2);
                for (i=0; i<imLen; i+=4, ++x)
                {
                    // update image coordinates
                    if (x>=w) { x=0; ty+=w; }

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=g=b=a=r2=g2=b2=a2=0;
                    for (k=0, j=0; k<ma; ++k, j+=2)
                    {
                        if (k<matArea)
                        {
                            xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                            if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                            {
                                srcOff = (xOff + yOff)<<2;
                                wt = mat[k]; r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                            }
                        }
                        // allow to apply a second similar matrix in-parallel (eg for total gradients)
                        if (k<matArea2)
                        {
                            xOff = x + imageIndices2[j]; yOff = ty + imageIndices2[j+1];
                            if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                            {
                                srcOff = (xOff + yOff)<<2;
                                wt2 = mat2[k]; r2 += im[srcOff] * wt2; g2 += im[srcOff+1] * wt2;  b2 += im[srcOff+2] * wt2;
                            }
                        }
                    }

                    // output
                    if (_isGrad)
                    {
                        r = Abs(r);
                        r2 = Abs(r2);
                        tM = Max(r, r2);
                        if (tM)
                        {
                            // approximation
                            tm = Min(r, r2);
                            t0 = tM*(1+0.43*tm/tM*tm/tM);
                        }
                        else
                        {
                            t0 = 0;
                        }
                        g = Abs(g);
                        g2 = Abs(g2);
                        tM = Max(g, g2);
                        if (tM)
                        {
                            // approximation
                            tm = Min(g, g2);
                            t1 = tM*(1+0.43*tm/tM*tm/tM);
                        }
                        else
                        {
                            t1 = 0;
                        }
                        b = Abs(b);
                        b2 = Abs(b2);
                        tM = Max(b, b2);
                        if (tM)
                        {
                            // approximation
                            tm = Min(b, b2);
                            t2 = tM*(1+0.43*tm/tM*tm/tM);
                        }
                        else
                        {
                            t2 = 0;
                        }
                    }
                    else
                    {
                        t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                    }
                    if (notSupportClamp)
                    {
                        // clamp them manually
                        t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                        t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                        t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    }
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
            else
            {
                // pre-compute indices,
                // reduce redundant computations inside the main convolution loop (faster)
                mArea = self._indices.length;
                imageIndices = new A16I(self._indices);
                for (k=0; k<mArea; k+=2) imageIndices[k+1] *= w;
                matArea = mat.length;

                // do direct convolution
                x=0; ty=0;
                for (i=0; i<imLen; i+=4, x++)
                {
                    // update image coordinates
                    if (x>=w) { x=0; ty+=w; }

                    // calculate the weighed sum of the source image pixels that
                    // fall under the convolution matrix
                    r=g=b=a=0;
                    for (k=0, j=0; k<matArea; k++, j+=2)
                    {
                        xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        //a += im[srcOff+3] * wt;
                    }

                    // output
                    t0 = coeff1*r+coeff2;  t1 = coeff1*g+coeff2;  t2 = coeff1*b+coeff2;
                    if (notSupportClamp)
                    {
                        // clamp them manually
                        t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                        t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                        t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    }
                    dst[i] = t0|0;  dst[i+1] = t1|0;  dst[i+2] = t2|0;
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
        }
        return dst;
    }
});
// aliases
ConvolutionMatrixFilter.prototype.gradX = ConvolutionMatrixFilter.prototype.prewittX;
ConvolutionMatrixFilter.prototype.gradY = ConvolutionMatrixFilter.prototype.prewittY;
ConvolutionMatrixFilter.prototype.gradDirectional = ConvolutionMatrixFilter.prototype.prewittDirectional;
ConvolutionMatrixFilter.prototype.grad = ConvolutionMatrixFilter.prototype.prewitt;
ConvolutionMatrixFilter.prototype.bump = ConvolutionMatrixFilter.prototype.emboss;
ConvolutionMatrixFilter.prototype.boxBlur = ConvolutionMatrixFilter.prototype.lowPass;
ConvolutionMatrixFilter.prototype.gaussBlur = ConvolutionMatrixFilter.prototype.gauss/*binomialLowPass*/;
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    convolutionmatrixfilter: {inputs: [{arg:0,type:FILTER.ImArray},{arg:4,type:FILTER.ConvolutionMatrix},{arg:5,type:FILTER.ConvolutionMatrix},{arg:6,type:FILTER.Array16I},{arg:7,type:FILTER.Array16I}], output: {type:FILTER.ImArray}},
    weighted: {inputs: [{arg:0,type:FILTER.ImArray},{arg:4,type:FILTER.Array32F}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
    ConvolutionMatrixFilter.prototype._apply_wasm = function(im, w, h) {
        var self = this, mode = self.mode;
        if (!self.matrix) return im;
        if (self._w)
        {
            return wasm.weighted(im, w, h, self.dimx, self._w[0], self._w[1]);
        }
        // do a faster convolution routine if possible
        else if (self._doIntegral)
        {
            return self.matrix2 ? FilterUtil.wasm.integral_convolution(mode, im, w, h, 2, self.matrix, self.matrix2, self.dimx, self.dimy, self.dimx2, self.dimy2, self._coeff[0], self._coeff[1], self._doIntegral, 1) : FilterUtil.wasm.integral_convolution(mode, im, w, h, 2, self.matrix, [], self.dimx, self.dimy, self.dimx, self.dimy, self._coeff[0], self._coeff[1], self._doIntegral, 0);
        }
        else if (self._doSeparable)
        {
            return FilterUtil.wasm.separable_convolution(mode, im, w, h, 2, self._mat, self._mat2, self._indices, self._indices2, self._coeff[0], self._coeff[1]);
        }
        return wasm.convolutionmatrixfilter(im, w, h, mode, self._mat, self._mat2 ? self._mat2 : [], self._indices, self._indices2 ? self._indices2 : [], self._coeff[0], self._coeff[1], self._isGrad, self._mat2 ? 1 : 0);
    };
    }
    FILTER.unwaitFor(1);
});
}

//  Private methods
function glsl(filter)
{
    var matrix_code = function(m, m2, dx, dy, dx2, dy2, f, b, isGrad) {
        var def = [], calc = [], calc2 = [],
            k, i, j, matArea = m.length,
            rx = dx>>>1, ry = dy>>>1;
        def.push('vec4 col=texture2D(img,  pix);');
        i=-rx; j=-ry; k=0;
        while (k<matArea)
        {
            if (m[k])
            {
                if (i || j)
                {
                    def.push('vec2 p'+k+'=vec2(pix.x'+toFloat(i, 1)+'*dp.x, pix.y'+toFloat(j, 1)+'*dp.y); vec3 c'+k+'=vec3(0.0); if (0.0 <= p'+k+'.x && 1.0 >= p'+k+'.x && 0.0 <= p'+k+'.y && 1.0 >= p'+k+'.y) c'+k+'=texture2D(img,  p'+k+').rgb;');
                }
                else
                {
                    def.push('vec3 c'+k+'=col.rgb;');
                }
                calc.push(toFloat(m[k], calc.length)+'*c'+k);
            }
            ++k; ++i; if (i>rx) {i=-rx; ++j;}
        }
        if (m2)
        {
            matArea = m2.length;
            rx = dx2>>>1; ry = dy2>>>1;
            i=-rx; j=-ry; k=0;
            while (k<matArea)
            {
                if (m2[k])
                {
                    if (i || j)
                    {
                        def.push('vec2 pp'+k+'=vec2(pix.x'+toFloat(i, 1)+'*dp.x, pix.y'+toFloat(j, 1)+'*dp.y); vec3 cc'+k+'=vec3(0.0); if (0.0 <= pp'+k+'.x && 1.0 >= pp'+k+'.x && 0.0 <= pp'+k+'.y && 1.0 >= pp'+k+'.y) cc'+k+'=texture2D(img,  pp'+k+').rgb;');
                    }
                    else
                    {
                        def.push('vec3 cc'+k+'=col.rgb;');
                    }
                    calc2.push(toFloat(m2[k], calc2.length)+'*cc'+k);
                }
                ++k; ++i; if (i>rx) {i=-rx; ++j;}
            }
            if (isGrad)
            {
                def.push('vec3 o1='+toFloat(f)+'*('+calc.join('')+');')
                def.push('vec3 o2='+toFloat(f)+'*('+calc2.join('')+');')
                return [def.join('\n'), 'vec4(sqrt(o1.x*o1.x+o2.x*o2.x),sqrt(o1.y*o1.y+o2.y*o2.y),sqrt(o1.z*o1.z+o2.z*o2.z),col.a)'];
            }
            else
            {
                def.push('vec3 o1='+calc.join('')+';')
                def.push('vec3 o2='+calc2.join('')+';')
                return [def.join('\n'), 'vec4(('+toFloat(f)+'*o1'+toFloat(b,1)+'*o2),col.a)'];
            }
        }
        else
        {
            return [def.join('\n'), 'vec4(('+toFloat(f)+'*('+calc.join('')+')+vec3('+toFloat(b)+')),col.a)'];
        }
    };
    var bilateral_code = function(d) {
        var def = [], calc = [],
            k, i, j, matArea = d*d, r = d>>>1;
        def.push('vec4 col=texture2D(img,  pix);');
        def.push('float f=0.0; float w; vec3 o=vec3(0.0);');
        i=-r; j=-r; k=0;
        while (k<matArea)
        {
            if (0===i && 0===j)
            {
                def.push('vec3 c'+k+'=col.rgb;');
            }
            else
            {
                def.push('vec2 p'+k+'=vec2(pix.x'+toFloat(i, 1)+'*dp.x, pix.y'+toFloat(j, 1)+'*dp.y); vec3 c'+k+'=col.rgb; if (0.0 <= p'+k+'.x && 1.0 >= p'+k+'.x && 0.0 <= p'+k+'.y && 1.0 >= p'+k+'.y) c'+k+'=texture2D(img,  p'+k+').rgb;');
            }
            calc.push('float wS'+k+'=wS['+k+']; float wC'+k+'=wC(c'+k+'.x-c0.x,c'+k+'.y-c0.y,c'+k+'.z-c0.z); w = wS'+k+'*wC'+k+'; f += w; o += w*c'+k+';');
            ++k; ++i; if (i>r) {i=-r; ++j;}
        }
        return [def.join('\n')+'\n'+calc.join('\n'), 'vec4(o/f,col.a)'];
    };
    var toFloat = GLSL.formatFloat, code, glslcode,
        m = filter.matrix, m2 = filter.matrix2, t;
    if (!m) return (new GLSL.Filter(filter)).begin().shader(GLSL.DEFAULT).end().code();
    if (filter._w)
    {
        code = bilateral_code(filter.dimx);
        glslcode = (new GLSL.Filter(filter))
        .begin()
        .shader([
        'varying vec2 pix;',
        'uniform sampler2D img;',
        'uniform vec2 dp;',
        'uniform float wS['+filter.matrix.length+'];',
        'uniform float fC;',
        'float wC(float r, float g, float b) {return exp(fC*(r*r+g*g+b*b));}',
        'void main(void) {',
        code[0],
        'gl_FragColor = '+code[1]+';',
        '}'
        ].join('\n'))
        .input('wS', function(filter) {return filter._w[0];})
        .input('fC', function(filter) {return filter._w[1]*255*255;})
        .end();
        return glslcode.code();
    }
    else if (t = filter._doIntegralSeparable)
    {
        glslcode = new GLSL.Filter(filter);
        code = matrix_code(t[0], null, t[1], t[2], t[1], t[2], t[3], t[4], false);
        glslcode
        .begin()
        .shader([
        'varying vec2 pix;',
        'uniform sampler2D img;',
        'uniform vec2 dp;',
        'void main(void) {',
        code[0],
        'gl_FragColor = '+code[1]+';',
        '}'
        ].join('\n'), filter._doIntegral || 1)
        .end();
        code = matrix_code(t[5], null, t[6], t[7], t[6], t[7], t[8], t[9], false);
        glslcode
        .begin()
        .shader([
        'varying vec2 pix;',
        'uniform sampler2D img;',
        'uniform vec2 dp;',
        'void main(void) {',
        code[0],
        'gl_FragColor = '+code[1]+';',
        '}'
        ].join('\n'), filter._doIntegral || 1)
        .end();
        return glslcode.code();
    }
    else if (filter._doSeparable && m2)
    {
        glslcode = new GLSL.Filter(filter);
        code = matrix_code(m, null, filter.dimx, filter.dimy, filter.dimx, filter.dimy, filter._coeff[0], 0, false);
        glslcode
        .begin()
        .shader([
        'varying vec2 pix;',
        'uniform sampler2D img;',
        'uniform vec2 dp;',
        'void main(void) {',
        code[0],
        'gl_FragColor = '+code[1]+';',
        '}'
        ].join('\n'))
        .end();
        code = matrix_code(m2, null, filter.dimx2, filter.dimy2, filter.dimx2, filter.dimy2, filter._coeff[1], 0, false);
        glslcode
        .begin()
        .shader([
        'varying vec2 pix;',
        'uniform sampler2D img;',
        'uniform vec2 dp;',
        'void main(void) {',
        code[0],
        'gl_FragColor = '+code[1]+';',
        '}'
        ].join('\n'))
        .end();
        return glslcode.code();
    }
    else
    {
        /*dx = filter.dimx; dy = filter.dimy;
        f = filter._coeff;
        if (filter._doSeparable && m2)
        {
            m = convolve(m, m2);
            dx = filter.dimx*filter.dimx2;
            dy = filter.dimy*filter.dimy2;
            f = [1, 0]
            m2 = null;
        }*/
        code = matrix_code(m, m2, filter.dimx, filter.dimy, filter.dimx2, filter.dimy2, filter._coeff[0], filter._coeff[1], filter._isGrad);
        glslcode = (new GLSL.Filter(filter))
        .begin()
        .shader([
        'varying vec2 pix;',
        'uniform sampler2D img;',
        'uniform vec2 dp;',
        'void main(void) {',
        code[0],
        'gl_FragColor = '+code[1]+';',
        '}'
        ].join('\n'), filter._doIntegral || 1)
        .end();
        return glslcode.code();
    }
}
function wasm()
{
    return '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';
}
function indices(m, dx, dy)
{
    if (null == dy) dy = dx;
    // pre-compute indices,
    // reduce redundant computations inside the main convolution loop (faster)
    var indices = [], indices2 = [], mat = [], k, x, y,
        matArea = m.length, rx = dx >>> 1, ry = dy >>> 1;
    x=-rx; y=-ry; k=0;
    while (k<matArea)
    {
        indices2.push(x);
        indices2.push(y);
        if (m[k])
        {
            indices.push(x);
            indices.push(y);
            mat.push(m[k]);
        }
        ++k; ++x; if (x>rx) {x=-rx; ++y;}
    }
    return [new A16I(indices), new A16I(indices2), new CM(mat)];
}
function summa(kernel)
{
    for (var sum=0,i=0,l=kernel.length; i<l; ++i) sum += kernel[i];
    return sum;
}
function bilateral(d, sigmaSpatial, sigmaColor)
{
    return [gaussian(d, d, sigmaSpatial), -1/(2*sigmaColor*sigmaColor), sigmaSpatial, sigmaColor];
}
function identity1(d)
{
    var i, ker = new Array(d);
    for (i=0; i<d; i++) ker[i] = 0;
    ker[d>>>1] = 1;
    return ker;
}
function average1(d)
{
    var i, ker = new Array(d);
    for (i=0; i<d; ++i) ker[i] = 1;
    return ker;
}
function derivative1(d, rev)
{
    var i, half = d>>>1, ker = new Array(d);
    if (rev) for (i=0; i<d; ++i) ker[d-1-i] = i-half;
    else for (i=0; i<d; ++i) ker[i] = i-half;
    return ker;
}

// pascal numbers (binomial coefficients) are used to get coefficients for filters that resemble gaussian distributions
// eg Sobel, Canny, gradients etc..
function binomial1(d)
{
    var l = _pascal.length, row, uprow, i, il;
    --d;
    if (d < l)
    {
        row = _pascal[d];
    }
    else
    {
        // else compute them iteratively
        row = _pascal[l-1];
        while (l<=d)
        {
            uprow=row; row=new Array(uprow.length+1); row[0]=1;
            for (i=0,il=uprow.length-1; i<il; ++i) row[i+1] = uprow[i]+uprow[i+1]; row[uprow.length]=1;
            if (l<20) _pascal.push(row); // save it for future dynamically
            ++l;
        }
    }
    return row.slice();
}
function functional(dx, dy, f)
{
    var x, y, rx = dx>>>1, ry=dy>>>1, l=dx*dy, i,
        kernel = new Array(l), sum;
    for (sum=0,x=-rx,y=-ry,i=0; i<d; ++i,++x)
    {
        if (x > rx) {x=-rx; ++y;}
        kernel[i] = f(x, y, dx, dy);
        //sum += kernel[i];
    }
    //if (sum) for (i=0; i<l; ++i) kernel[i] /= sum;
    return kernel;
}
function binomial2(d)
{
    var binomial = binomial1(d);
    // convolve with itself
    return convolve(binomial, binomial);
}
function vertical2(d)
{
    return convolve(average1(d), identity1(d));
}
function horizontal2(d)
{
    return convolve(identity1(d), average1(d));
}
function sobel(d, dir)
{
    return 1===dir ? /*y*/convolve(derivative1(d,1), binomial1(d)) : /*x*/convolve(binomial1(d), derivative1(d,0));
}
function prewitt(d, dir)
{
    return 1===dir ? /*y*/convolve(derivative1(d,1), average1(d)) : /*x*/convolve(average1(d), derivative1(d,0));
}
function ones(d, f, c)
{
    f = f||1; c = c||f;
    var l = d*d, i, o = new CM(l);
    for (i=0; i<l; ++i) o[i] = f;
    o[l>>>1] = c;
    return o;
}
function twos(d, dx, dy, c)
{
    var l=d*d, half=d>>>1, center=l>>>1, i, k, j, o=new CM(l), tx, ty;
    for (tx=0,i=0; i<=half; ++i,tx+=dx)
    {
        for (k=0,ty=0,j=0; j<=half; ++j,k+=d,ty+=dy)
        {
            //tx=i*dx;  ty=j*dy;
            o[center + i + k]=   tx + ty;
            o[center - i - k]= - tx - ty;
            o[center - i + k]= - tx + ty;
            o[center + i - k]=   tx - ty;
        }
    }
    o[center] = c||1;
    return o;
}
function twos2(d, c, s, cf)
{
    var l=d*d, half=d>>1, center=l>>1, i, j, k,
        o=new CM(l), T=new CM(l),
        tx, ty, dx, dy, f=1/d,
        delta=1e-8;

    if (Abs(c)>delta) {dx=1; dy=s/c;}
    else  {dx=c/s; dy=1;}

    i=0; tx=0; ty=0; k=dy*d;
    while (i<=half)
    {
        // compute the transformation of the (diagonal) line
        T[center + i]= (center + tx + ty + 0.5)|0;
        T[center - i]= (center - tx - ty + 0.5)|0;
        ++i; tx+=dx; ty+=k;
    }
    i=0;
    while (i<=half)
    {
        // do the mapping of the base line to the transformed one
        o[T[center + i]] = o[T[center - i]] = f;
        // anti-aliasing ??..
        ++i;
    }
    o[center] = cf||1;
    return o;
}

}(FILTER);/**
*
* Morphological Filter(s)
*
* Applies morphological processing to target image
*
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

// used for internal purposes
var MORPHO, MODE = FILTER.MODE, IMG = FILTER.ImArray, copy = FILTER.Util.Array.copy,
    GLSL = FILTER.Util.GLSL,
    STRUCT = FILTER.Array8U, A32I = FILTER.Array32I,
    Sqrt = Math.sqrt, TypedArray = FILTER.Util.Array.typed,
    primitive_morphology_operator = FILTER.Util.Filter.primitive_morphology_operator,
    // return a box structure element
    box = function(d) {
        var i, size=d*d, ones = new STRUCT(size);
        for (i=0; i<size; ++i) ones[i] = 1;
        return ones;
    },
    box3 = box(3);

//  Morphological Filter
FILTER.Create({
    name: "MorphologicalFilter"

    ,init: function MorphologicalFilter() {
        var self = this;
        self._filterName = null;
        self._filter = null;
        self._dim = 0;
        self._dim2 = 0;
        self._iter = 1;
        self._structureElement = null;
        self._indices = null;
        self._structureElement2 = null;
        self._indices2 = null;
        self.mode = MODE.RGB;
    }

    ,path: FILTER.Path
    ,_filterName: null
    ,_filter: null
    ,_dim: 0
    ,_dim2: 0
    ,_iter: 1
    ,_structureElement: null
    ,_indices: null
    ,_structureElement2: null
    ,_indices2: null
    ,mode: MODE.RGB

    ,dispose: function() {
        var self = this;
        self._filterName = null;
        self._filter = null;
        self._dim = null;
        self._dim2 = null;
        self._iter = null;
        self._structureElement = null;
        self._indices = null;
        self._structureElement2 = null;
        self._indices2 = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             _filterName: self._filterName
            ,_dim: self._dim
            ,_dim2: self._dim2
            ,_iter: self._iter
            ,_structureElement: self._structureElement
            ,_indices: self._indices
            ,_structureElement2: self._structureElement2
            ,_indices2: self._indices2
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self._dim = params._dim;
        self._dim2 = params._dim2;
        self._iter = params._iter;
        self._structureElement = TypedArray(params._structureElement, STRUCT);
        self._indices = TypedArray(params._indices, A32I);
        self._structureElement2 = TypedArray(params._structureElement2, STRUCT);
        self._indices2 = TypedArray(params._indices2, A32I);
        self._filterName = params._filterName;
        if (self._filterName && MORPHO[self._filterName])
            self._filter = MORPHO[self._filterName];
        return self;
    }

    ,erode: function(structureElement, structureElement2, iterations) {
        return this.set("erode", structureElement, structureElement2||null, iterations);
    }

    ,dilate: function(structureElement, structureElement2, iterations) {
        return this.set("dilate", structureElement, structureElement2||null, iterations);
    }

    ,opening: function(structureElement, structureElement2, iterations) {
        return this.set("open", structureElement, structureElement2||null, iterations);
    }

    ,closing: function(structureElement, structureElement2, iterations) {
        return this.set("close", structureElement, structureElement2||null, iterations);
    }

    ,gradient: function(structureElement) {
        return this.set("gradient", structureElement);
    }

    ,laplacian: function(structureElement) {
        return this.set("laplacian", structureElement);
    }

    ,set: function(filtName, structureElement, structureElement2, iterations) {
        var self = this;
        self._dim2 = 0;
        self._structureElement2 = null;
        self._indices2 = null;
        self._iter = (iterations|0) || 1;
        self._filterName = filtName;
        self._filter = MORPHO[filtName];

        if (structureElement && structureElement.length)
        {
            // structure Element given
            self._structureElement = new STRUCT(structureElement);
            self._dim = (Sqrt(self._structureElement.length)+0.5)|0;
        }
        else if (structureElement && (structureElement === +structureElement))
        {
            // dimension given
            self._structureElement = box(structureElement);
            self._dim = structureElement;
        }
        else
        {
            // default
            self._structureElement = box3;
            self._dim = 3;
        }

        if (structureElement2 && structureElement2.length)
        {
            // structure Element given
            self._structureElement2 = new STRUCT(structureElement2);
            self._dim2 = (Sqrt(self._structureElement2.length)+0.5)|0;
        }
        else if (structureElement2 && (structureElement2 === +structureElement2))
        {
            // dimension given
            self._structureElement2 = box(structureElement2);
            self._dim2 = structureElement2;
        }

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        var indices = [], i, x, y, structureElement = self._structureElement,
            matArea = structureElement.length, matRadius = self._dim, matHalfSide = matRadius>>>1;
        for (x=0,y=0,i=0; i<matArea; ++i,++x)
        {
            if (x>=matRadius) {x=0; ++y;}
            // allow a general structuring element instead of just a box
            if (structureElement[i])
            {
                indices.push(x-matHalfSide);
                indices.push(y-matHalfSide);
            }
        }
        self._indices = new A32I(indices);

        if (self._structureElement2)
        {
            var indices = [], i, x, y, structureElement = self._structureElement2,
                matArea = structureElement.length, matRadius = self._dim2, matHalfSide = matRadius>>>1;
            for (x=0,y=0,i=0; i<matArea; ++i,++x)
            {
                if (x>=matRadius) {x=0; ++y;}
                // allow a general structuring element instead of just a box
                if (structureElement[i])
                {
                    indices.push(x-matHalfSide);
                    indices.push(y-matHalfSide);
                }
            }
            self._indices2 = new A32I(indices);
        }
        self._glsl = null;
        return self;
    }

    ,reset: function() {
        var self = this;
        self._filterName = null;
        self._filter = null;
        self._dim = 0;
        self._dim2 = 0;
        self._iter = 1;
        self._structureElement = null;
        self._indices = null;
        self._structureElement2 = null;
        self._indices2 = null;
        self._glsl = null;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,_apply: function(im, w, h) {
        var self = this;
        if (!self._dim || !self._filter)  return im;
        return self._filter(self, im, w, h);
    }

    ,canRun: function() {
        return this._isOn && this._dim && this._filter;
    }
});

// private methods
function morph_prim_op(mode, inp, out, w, h, stride, index, index2, op, op0, iter)
{
    //"use asm";
    var tmp, it, x, ty, i, j, k, imLen = inp.length, imArea = imLen>>>stride,
        rM, gM, bM, r, g, b, xOff, yOff, srcOff, bx=w-1, by=imArea-w, coverArea;

    tmp = inp; inp = out; out = tmp;
    if (FILTER.MODE.GRAY === mode)
    {
        coverArea = index.length;
        for (it=0; it<iter; ++it)
        {
            tmp = inp; inp = out; out = tmp;
            for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the image pixels that
                // fall under the structure matrix
                for (rM=op0,j=0; j<coverArea; j+=2)
                {
                    xOff = x+index[j]; yOff = ty+index[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    r = inp[srcOff];
                    rM = op(r, rM);
                }
                // output
                //rM = (fa*out[i]+fb*rM+fc*inp[i])|0;
                out[i] = rM; out[i+1] = rM; out[i+2] = rM; out[i+3] = inp[i+3];
            }
        }

        if (index2)
        {
            index = index2; coverArea = index.length;
            for (it=0; it<iter; ++it)
            {
                tmp = inp; inp = out; out = tmp;
                for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ty+=w;}

                    // calculate the image pixels that
                    // fall under the structure matrix
                    for (rM=op0,j=0; j<coverArea; j+=2)
                    {
                        xOff = x+index[j]; yOff = ty+index[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2;
                        r = inp[srcOff];
                        rM = op(r, rM);
                    }
                    // output
                    //rM = (fa*out[i]+fb*rM+fc*inp[i])|0;
                    out[i] = rM; out[i+1] = rM; out[i+2] = rM; out[i+3] = inp[i+3];
                }
            }
        }
    }
    else
    {
        coverArea = index.length;
        for (it=0; it<iter; ++it)
        {
            tmp = inp; inp = out; out = tmp;
            for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
            {
                // update image coordinates
                if (x>=w) {x=0; ty+=w;}

                // calculate the image pixels that
                // fall under the structure matrix
                for (rM=gM=bM=op0,j=0; j<coverArea; j+=2)
                {
                    xOff = x+index[j]; yOff = ty+index[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    r = inp[srcOff]; g = inp[srcOff+1]; b = inp[srcOff+2];
                    rM = op(r, rM); gM = op(g, gM); bM = op(b, bM);
                }
                // output
                //rM = (fa*out[i]+fb*rM+fc*inp[i])|0; gM = (fa*out[i+1]+fb*gM+fc*inp[i+1])|0; bM = (fa*out[i+2]+fb*bM+fc*inp[i+2])|0;
                out[i] = rM; out[i+1] = gM; out[i+2] = bM; out[i+3] = inp[i+3];
            }
        }
        if (index2)
        {
            index = index2; coverArea = index.length;
            for (it=0; it<iter; ++it)
            {
                tmp = inp; inp = out; out = tmp;
                for (x=0,ty=0,i=0; i<imLen; i+=4,++x)
                {
                    // update image coordinates
                    if (x>=w) {x=0; ty+=w;}

                    // calculate the image pixels that
                    // fall under the structure matrix
                    for (rM=gM=bM=op0,j=0; j<coverArea; j+=2)
                    {
                        xOff = x+index[j]; yOff = ty+index[j+1];
                        if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                        srcOff = (xOff + yOff)<<2;
                        r = inp[srcOff]; g = inp[srcOff+1]; b = inp[srcOff+2];
                        rM = op(r, rM); gM = op(g, gM); bM = op(b, bM);
                    }
                    // output
                    //rM = (fa*out[i]+fb*rM+fc*inp[i])|0; gM = (fa*out[i+1]+fb*gM+fc*inp[i+1])|0; bM = (fa*out[i+2]+fb*bM+fc*inp[i+2])|0;
                    out[i] = rM; out[i+1] = gM; out[i+2] = bM; out[i+3] = inp[i+3];
                }
            }
        }
    }
    return out;
}
FILTER.Util.Filter.primitive_morphology_operator = morph_prim_op;
MORPHO = {
    "dilate": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null, dst = new IMG(im.length),
            morph = (self._runWASM ? morph_prim_op.wasm : morph_prim_op) || morph_prim_op;

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        indices = self._indices; coverArea = indices.length; index = new A32I(coverArea);
        for (j=0; j<coverArea; j+=2) {index[j]=indices[j]; index[j+1]=indices[j+1]*w;}
        if (self._indices2)
        {
            indices = self._indices2; coverArea = indices.length; index2 = new A32I(coverArea);
            for (j=0; j<coverArea; j+=2) {index2[j]=indices[j]; index2[j+1]=indices[j+1]*w;}
        }

        dst = morph(self.mode, im, dst, w, h, 2, index, index2, Math.max, 0, self._iter);

        return dst;
    }
    ,"erode": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null, dst = new IMG(im.length),
            morph = (self._runWASM ? morph_prim_op.wasm : morph_prim_op) || morph_prim_op;

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        indices = self._indices; coverArea = indices.length; index = new A32I(coverArea);
        for (j=0; j<coverArea; j+=2) {index[j]=indices[j]; index[j+1]=indices[j+1]*w;}
        if (self._indices2)
        {
            indices = self._indices2; coverArea = indices.length; index2 = new A32I(coverArea);
            for (j=0; j<coverArea; j+=2) {index2[j]=indices[j]; index2[j+1]=indices[j+1]*w;}
        }

        dst = morph(self.mode, im, dst, w, h, 2, index, index2, Math.min, 255, self._iter);

        return dst;
    }
    // dilation of erotion
    ,"open": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null, dst = new IMG(im.length),
            morph = (self._runWASM ? morph_prim_op.wasm : morph_prim_op) || morph_prim_op;

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        indices = self._indices; coverArea = indices.length; index = new A32I(coverArea);
        for (j=0; j<coverArea; j+=2) {index[j]=indices[j]; index[j+1]=indices[j+1]*w;}
        if (self._indices2)
        {
            indices = self._indices2; coverArea = indices.length; index2 = new A32I(coverArea);
            for (j=0; j<coverArea; j+=2) {index2[j]=indices[j]; index2[j+1]=indices[j+1]*w;}
        }

        // erode
        dst = morph(self.mode, im, dst, w, h, 2, index, index2, Math.min, 255, self._iter);
        // dilate
        var tmp = im; im = dst; dst = tmp;
        dst = morph(self.mode, im, dst, w, h, 2, index, index2, Math.max, 0, self._iter);

        return dst;
    }
    // erotion of dilation
    ,"close": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null, dst = new IMG(im.length),
            morph = (self._runWASM ? morph_prim_op.wasm : morph_prim_op) || morph_prim_op;

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        indices = self._indices; coverArea = indices.length; index = new A32I(coverArea2);
        for (j=0; j<coverArea; j+=2) {index[j]=indices[j]; index[j+1]=indices[j+1]*w;}
        if (self._indices2)
        {
            indices = self._indices2; coverArea = indices.length; index2 = new A32I(coverArea);
            for (j=0; j<coverArea; j+=2) {index2[j]=indices[j]; index2[j+1]=indices[j+1]*w;}
        }

        // dilate
        dst = morph(self.mode, im, dst, w, h, 2, index, index2, Math.max, 0, self._iter);
        // erode
        var tmp = im; im = dst; dst = tmp;
        dst = morph(self.mode, im, dst, w, h, 2, index, index2, Math.min, 255, self._iter);

        return dst;
    }
    // 1/2 (dilation - erosion)
    ,"gradient": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null,
            imLen = im.length, imcpy, dst = new IMG(imLen),
            morph = (self._runWASM ? morph_prim_op.wasm : morph_prim_op) || morph_prim_op;

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        indices = self._indices; coverArea = indices.length; index = new A32I(coverArea);
        for (j=0; j<coverArea; j+=2) {index[j]=indices[j]; index[j+1]=indices[j+1]*w;}
        if (self._indices2)
        {
            indices = self._indices2; coverArea = indices.length; index2 = new A32I(coverArea);
            for (j=0; j<coverArea; j+=2) {index2[j]=indices[j]; index2[j+1]=indices[j+1]*w;}
        }

        // dilate
        imcpy = copy(im);
        dst = morph(self.mode, imcpy, dst, w, h, 2, index, index2, Math.max, 0, self._iter);
        // erode
        imcpy = morph(self.mode, im, imcpy, w, h, 2, index, index2, Math.min, 255, self._iter);
        for (j=0; j<imLen; j+=4)
        {
            dst[j  ] = ((dst[j  ]-imcpy[j  ])/2)|0;
            dst[j+1] = ((dst[j+1]-imcpy[j+1])/2)|0;
            dst[j+2] = ((dst[j+2]-imcpy[j+2])/2)|0;
        }
        return dst;
    }
    // 1/2 (dilation + erosion -2IM)
    ,"laplacian": function(self, im, w, h) {
        var j, indices, coverArea, index, index2 = null,
            imLen = im.length, imcpy, dst = new IMG(imLen), dst2 = new IMG(imLen),
            morph = (self._runWASM ? morph_prim_op.wasm : morph_prim_op) || morph_prim_op;

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        indices = self._indices; coverArea = indices.length; index = new A32I(coverArea);
        for (j=0; j<coverArea; j+=2) {index[j]=indices[j]; index[j+1]=indices[j+1]*w;}
        if (self._indices2)
        {
            indices = self._indices2; coverArea = indices.length; index2 = new A32I(coverArea);
            for (j=0; j<coverArea; j+=2) {index2[j]=indices[j]; index2[j+1]=indices[j+1]*w;}
        }

        // dilate
        imcpy = copy(im);
        dst2 = morph(self.mode, imcpy, dst2, w, h, 2, index, index2, Math.max, 0, self._iter);
        // erode
        imcpy = copy(im);
        dst = morph(self.mode, imcpy, dst, w, h, 2, index, index2, Math.min, 255, self._iter);
        for (j=0; j<imLen; j+=4)
        {
            dst[j  ] = ((dst[j  ]+dst2[j  ]-2*im[j  ])/2)|0;
            dst[j+1] = ((dst[j+1]+dst2[j+1]-2*im[j+1])/2)|0;
            dst[j+2] = ((dst[j+2]+dst2[j+2]-2*im[j+2])/2)|0;
        }
        return dst;
    }
};
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    primitive_morphology_operator: {inputs: [{arg:1,type:FILTER.ImArray},{arg:2,type:FILTER.ImArray},{arg:6,type:FILTER.Array32I},{arg:7,type:FILTER.Array32I}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
    morph_prim_op.wasm = function(mode, inp, out, w, h, stride, index, index2, op, op0, iter) {
        return wasm.primitive_morphology_operator(mode, inp, out, w, h, stride, index, index2 || [], Math.min === op ? -1 : 1, Math.min === op ? 255 : 0, iter||1);
    };
    }
    FILTER.unwaitFor(1);
});
}
function glsl(filter)
{
    var matrix_code = function(m, d, op, op0, img) {
        var toFloat = GLSL.formatFloat,
            code = [], ca = false,
            x, y, k, i, j,
            matArea = m.length, matRadius = d,
            matHalfSide = matRadius>>>1;
        code.push('int apply=1;');
        code.push('vec4 res=vec4('+op0+');');
        code.push('float alpha=1.0;');
        x=0; y=0; k=0;
        img = img || 'img';
        while (k<matArea)
        {
            i = x-matHalfSide;
            j = y-matHalfSide;
            if (m[k])
            {
                code.push('if (1==apply){vec2 p'+k+'=vec2(pix.x'+toFloat(i, 1)+'*dp.x, pix.y'+toFloat(j, 1)+'*dp.y); vec4 c'+k+'=vec4(0.0); if (0.0 <= p'+k+'.x && 1.0 >= p'+k+'.x && 0.0 <= p'+k+'.y && 1.0 >= p'+k+'.y) {c'+k+'=texture2D('+img+',p'+k+');} else {apply=0;} res='+op+'(res, c'+k+');'+(0===i && 0===j?(' alpha=c'+k+'.a;'):'')+'}');
                if (0===i && 0===j) ca = true;
            }
            ++k; ++x; if (x>=matRadius) {x=0; ++y;}
        }
        code.push('if (1==apply) {'+(!ca ? ('alpha = texture2D('+img+',pix).a; ') : '')+'gl_FragColor = vec4(res.rgb,alpha);} else {gl_FragColor = texture2D('+img+',pix);}');
        return code.join('\n');
    };
    var morph = function(op) {
        return glslcode.shader([
        'varying vec2 pix;',
        'uniform sampler2D '+('img')+';',
        'uniform vec2 dp;',
        'void main(void) {',
        'dilate' === op ? matrix_code(filter._structureElement, filter._dim, 'max', '0.0', 'img') : matrix_code(filter._structureElement, filter._dim, 'min', '1.0', 'img'),
        '}'
        ].join('\n'), filter._iter || 1);
    };
    var glslcode = new GLSL.Filter(filter);
    if (!filter._dim) return glslcode.begin().shader(GLSL.DEFAULT).end().code();
    switch (filter._filterName)
    {
        case 'dilate':
        glslcode.begin();
        morph('dilate');
        glslcode.end();
        break;
        case 'erode':
        glslcode.begin();
        morph('erode')
        glslcode.end();
        break;
        case 'open':
        glslcode.begin();
        morph('erode')
        glslcode.end();
        glslcode.begin();
        morph('dilate');
        glslcode.end();
        break;
        case 'close':
        glslcode.begin();
        morph('dilate');
        glslcode.end();
        glslcode.begin();
        morph('erode')
        glslcode.end();
        break;
        case 'gradient':
        glslcode.begin();
        morph('dilate');
        glslcode.save('image');
        glslcode.output('dilated');
        glslcode.end();
        glslcode.begin();
        morph('erode');
        glslcode.input('image', null, 'img');
        //glslcode.output('eroded');
        glslcode.end();
        glslcode.begin();
        glslcode.shader([
        'varying vec2 pix;',
        'uniform sampler2D eroded;',
        'uniform sampler2D dilated;',
        'void main(void) {',
        'vec4 erode = texture2D(eroded, pix);',
        'vec4 dilate = texture2D(dilated, pix);',
        'gl_FragColor = vec4(((dilate-erode)*0.5).rgb, erode.a);',
        '}'
        ].join('\n'));
        glslcode.input('eroded', true);
        glslcode.input('dilated');
        glslcode.end();
        break;
        case 'laplacian':
        glslcode.begin();
        morph('dilate');
        glslcode.save('image');
        glslcode.output('dilated');
        glslcode.end();
        glslcode.begin();
        morph('erode');
        glslcode.input('image', null, 'img');
        //glslcode.output('eroded');
        glslcode.end();
        glslcode.begin();
        glslcode.shader([
        'varying vec2 pix;',
        'uniform sampler2D eroded;',
        'uniform sampler2D dilated;',
        'uniform sampler2D image;',
        'void main(void) {',
        'vec4 erode = texture2D(eroded, pix);',
        'vec4 dilate = texture2D(dilated, pix);',
        'vec4 im = texture2D(image, pix);',
        'gl_FragColor = vec4(((dilate+erode-2.0*im)*0.5).rgb, im.a);',
        '}'
        ].join('\n'));
        glslcode.input('eroded', true);
        glslcode.input('dilated');
        glslcode.input('image');
        glslcode.end();
        break;
        default:
        //glslcode.begin().end();
        break;
    }
    return glslcode.code();
}
function wasm()
{
    return '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';
}

}(FILTER);/**
*
* Statistical Filter(s)
*
* Applies statistical filtering/processing to target image
*
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

// used for internal purposes
var STAT, MODE = FILTER.MODE,IMG = FILTER.ImArray,
    A32I = FILTER.Array32I, A32U = FILTER.Array32U,
    GLSL = FILTER.Util.GLSL, TypedArray = FILTER.Util.Array.typed,
    stdMath = Math, Min = stdMath.min, Max = stdMath.max;

//  Statistical Filter
var StatisticalFilter = FILTER.Create({
    name: "StatisticalFilter"

    ,init: function StatisticalFilter() {
        var self = this;
        self.d = 0;
        self.k = 0;
        self._gray = false;
        self._filter = null;
        self._indices = null;
        self.mode = MODE.RGB;
    }

    ,path: FILTER.Path
    ,d: 0
    ,k: 0
    ,_filter: null
    ,_indices: null
    ,mode: MODE.RGB

    ,dispose: function() {
        var self = this;
        self.d = null;
        self.k = null;
        self._filter = null;
        self._indices = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             d: self.d
            ,k: self.k
            ,_filter: self._filter
            ,_indices: self._indices
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.d = params.d;
        self.k = params.k;
        self._filter = params._filter;
        self._indices = TypedArray(params._indices, A32I);
        return self;
    }

    ,kth: function(k, d) {
        return this.set(null == d ? 3 : (d&1 ? d : d+1), k);
    }

    ,median: function(d) {
        // allow only odd dimensions for median
        return this.set(null == d ? 3 : (d&1 ? d : d+1), 0.5);
    }

    ,minimum: function(d) {
        return this.set(null == d ? 3 : (d&1 ? d : d+1), 0);
    }
    ,erode: null

    ,maximum: function(d) {
        return this.set(null == d ? 3 : (d&1 ? d : d+1), 1);
    }
    ,dilate: null

    ,set: function(d, k) {
        var self = this;
        self.d = d = d||0;
        self.k = k = Min(1, Max(0, k||0));
        self._filter = 0 === k ? "0th" : (1 === k ? "1th" : "kth");
        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        var i, x, y, matArea2 = (d*d)<<1, dHalf = d>>>1, indices = new A32I(matArea2);
        for (x=0,y=0,i=0; i<matArea2; i+=2,++x)
        {
            if (x>=d) {x=0; ++y;}
            indices[i  ] = x-dHalf; indices[i+1] = y-dHalf;
        }
        self._indices = indices;
        self._glsl = null;
        return self;
    }

    ,reset: function() {
        var self = this;
        self.d = 0;
        self.k = 0;
        self._filter = null;
        self._indices = null;
        self._glsl = null;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    // used for internal purposes
    ,_apply: function(im, w, h) {
        var self = this;
        if (!self.d)  return im;
        if ('0th' === self._filter || '1th' === self._filter) return STAT["01th"](self, im, w, h);
        return STAT[self._filter](self, im, w, h);
    }

    ,canRun: function() {
        return this._isOn && this.d;
    }
});
// aliiases
StatisticalFilter.prototype.erode = StatisticalFilter.prototype.minimum;
StatisticalFilter.prototype.dilate = StatisticalFilter.prototype.maximum;

// private methods
function glsl(filter)
{
    var minmax_code = function(d, op, op0) {
        var code = [], ca = 'c0',
            x, y, k, i, j,
            matArea = d*d, matRadius = d,
            matHalfSide = matRadius>>>1;
        code.push('int apply=1;');
        code.push('vec4 res=vec4('+op0+');');
        code.push('float alpha=1.0;');
        x=0; y=0; k=0;
        while (k<matArea)
        {
            i = x-matHalfSide;
            j = y-matHalfSide;
            code.push('if (1==apply){vec2 p'+k+'=vec2(pix.x'+toFloat(i, 1)+'*dp.x, pix.y'+toFloat(j, 1)+'*dp.y); vec4 c'+k+'=vec4(0.0); if (0.0 <= p'+k+'.x && 1.0 >= p'+k+'.x && 0.0 <= p'+k+'.y && 1.0 >= p'+k+'.y) {c'+k+'=texture2D(img,p'+k+');} else {apply=0;} res='+op+'(res, c'+k+');'+(0===i && 0===j?(' alpha=c'+k+'.a;'):'')+'}');
            ++k; ++x; if (x>=matRadius) {x=0; ++y;}
        }
        code.push('if (1==apply) gl_FragColor = vec4(res.rgb,alpha); else gl_FragColor = texture2D(img,pix);');
        return code.join('\n');
    };
    var kth_code = function(d, kth) {
        var code = [], r = [], g = [], b = [], ca = 'c0',
            x, y, k, i, j, kthr, kthg, kthb,
            matArea = d*d, matRadius = d,
            matHalfSide = matRadius>>>1;
        x=0; y=0; k=0;
        /*code.push('float totr=0.0;');
        code.push('float totg=0.0;');
        code.push('float totb=0.0;');*/
        while (k<matArea)
        {
            i = x-matHalfSide;
            j = y-matHalfSide;
            code.push('vec2 p'+k+'=vec2(pix.x'+toFloat(i, 1)+'*dp.x, pix.y'+toFloat(j, 1)+'*dp.y); vec4 c'+k+'=vec4(0.0); if (0.0 <= p'+k+'.x && 1.0 >= p'+k+'.x && 0.0 <= p'+k+'.y && 1.0 >= p'+k+'.y) c'+k+'=texture2D(img,  p'+k+'); float c'+k+'r=c'+k+'.r; float c'+k+'g=c'+k+'.g; float c'+k+'b=c'+k+'.b;'/*+' totr += c'+k+'r; totg += c'+k+'g; totb += c'+k+'b;'*/);
            r.push('c'+k+'r');
            g.push('c'+k+'g');
            b.push('c'+k+'b');
            if (0===i && 0===j) ca = 'c'+k+'.a';
            ++k; ++x; if (x>=matRadius) {x=0; ++y;}
        }
        code.push('float t=0.0;');
        code.push(staticSort(r, 't').join('\n'));
        code.push('if (1==isColored) {');
        code.push(staticSort(g, 't').join('\n'));
        code.push(staticSort(b, 't').join('\n'));
        code.push('}');
        /*code.push('totr *= kth;');
        code.push('totg *= kth;');
        code.push('totb *= kth;');
        code.push('float rkth=c0r;');
        code.push('float gkth=c0g;');
        code.push('float bkth=c0g;');
        code.push('float sr=rkth;');
        code.push('float sg=gkth;');
        code.push('float sb=bkth;');
        kthr = ''; kthg = ''; kthb = '';
        for (k=1,i=0; k<matArea; ++k)
        {
            kthr += 'if (sr < totr){rkth=c'+k+'r;sr+=rkth;';
            kthg += 'if (sg < totg){gkth=c'+k+'g;sg+=gkth;';
            kthb += 'if (sb < totb){bkth=c'+k+'b;sb+=bkth;';
            ++i;
        }
        while (0 < i) {--i; kthr += '}'; kthg += '}'; kthb += '}';}
        code.push(kthr);
        code.push(kthg);
        code.push(kthb);*/
        code.push('float rkth=c'+stdMath.round(kth*(matArea-1))+'r;');
        code.push('float gkth=rkth;');
        code.push('float bkth=rkth;');
        code.push('if (1==isColored) {');
        code.push('gkth=c'+stdMath.round(kth*(matArea-1))+'g;');
        code.push('bkth=c'+stdMath.round(kth*(matArea-1))+'b;');
        code.push('}');
        code.push('gl_FragColor = vec4(rkth,gkth,bkth,'+ca+');');
        return code.join('\n');
    };
    var toFloat = GLSL.formatFloat, staticSort = GLSL.staticSort, glslcode = new GLSL.Filter(filter);
    return !filter.d ? glslcode.begin().shader(GLSL.DEFAULT).end().code() : glslcode.begin().shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform vec2 dp;',
    'uniform int isColored;',
    //'uniform float kth;',
    'void main(void) {',
    '1th' === filter._filter ? minmax_code(filter.d, 'max', '0.0') : ('0th' === filter._filter ? minmax_code(filter.d, 'min', '1.0') : kth_code(filter.d, filter.k)),
    '}'
    ].join('\n')).input('isColored', function(filter) {return MODE.GRAY !== filter.mode ? 1 : 0;}).end().code();
}
STAT = {
     "01th": function(self, im, w, h) {
        //"use asm";
        var matRadius = self.d, matHalfSide = matRadius>>1,
            imLen = im.length, imArea = imLen>>>2, dst = new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM, bx = w-1, by = imArea-w,
            indices = self._indices, matArea2 = indices.length,
            matArea = matArea2>>>1, imIndex = new A32I(matArea2),
            op, op0 ;

        if ('0th' === self._filter)
        {
            op = Min;
            op0 = 255;
        }
        else
        {
            op = Max;
            op0 = 0;
        }
        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        for (j=0; j<matArea2; j+=2) {imIndex[j]=indices[j]; imIndex[j+1]=indices[j+1]*w;}
        if (MODE.GRAY === self.mode)
        {
            for (i=0,x=0,ty=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ty+=w;}
                for (gM=op0,j=0; j<matArea2; j+=2)
                {
                    xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    gM = op(im[srcOff], gM);
                }
                // output
                dst[i] = gM; dst[i+1] = gM; dst[i+2] = gM; dst[i+3] = im[i+3];
            }
        }
        else
        {
            for (i=0,x=0,ty=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ty+=w;}
                for (rM=gM=bM=op0,j=0; j<matArea2; j+=2)
                {
                    xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    r = im[srcOff]; g = im[srcOff+1]; b = im[srcOff+2];
                    rM = op(r, rM); gM = op(g, gM); bM = op(b, bM);
                }
                // output
                dst[i] = rM; dst[i+1] = gM; dst[i+2] = bM; dst[i+3] = im[i+3];
            }
        }
        return dst;
    }
    ,"kth": function(self, im, w, h) {
        //"use asm";
        var matRadius = self.d, kth = self.k,
            matHalfSide = matRadius>>1,
            imLen = im.length, imArea = imLen>>>2,
            dst = new IMG(imLen),
            i, j, x, ty, xOff, yOff,
            srcOff, bx = w-1, by = imArea-w,
            r, g, b, kthR, kthG, kthB,
            rh, gh, bh, rhc, ghc, bhc,
            rhist, ghist, bhist, tot, sum,
            indices = self._indices, matArea2 = indices.length,
            matArea = matArea2>>>1, imIndex = new A32I(matArea2);

        // pre-compute indices,
        // reduce redundant computations inside the main convolution loop (faster)
        // translate to image dimensions the y coordinate
        for (j=0; j<matArea2; j+=2) {imIndex[j]=indices[j]; imIndex[j+1]=indices[j+1]*w;}

        if (MODE.GRAY === self.mode)
        {
            gh = new IMG(matArea);
            ghist = new A32U(256);
            for (i=0,x=0,ty=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ty+=w;}

                tot=0;
                ghc=0;
                for (j=0; j<matArea2; j+=2)
                {
                    xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    g = im[srcOff];
                    // compute histogram, similar to counting sort
                    ++tot; ++ghist[g];
                    // maintain min-heap
                    if (1 === ghist[g]) heap_push(gh, ghc++, g);
                }

                // search histogram for kth statistic
                // and also reset histogram for next round
                // can it be made faster?? (used min-heap)
                tot *= kth;
                for (sum=0,kthG=-1,j=ghc; j>0; --j)
                {
                    g = heap_pop(gh, j); sum += ghist[g]; ghist[g] = 0;
                    if (0 > kthG && sum >= tot) kthG = g;
                }

                // output
                dst[i] = kthG; dst[i+1] = kthG; dst[i+2] = kthG; dst[i+3] = im[i+3];
            }
        }
        else
        {
            rh = new IMG(matArea);
            gh = new IMG(matArea);
            bh = new IMG(matArea);
            rhist = new A32U(256);
            ghist = new A32U(256);
            bhist = new A32U(256);
            for (i=0,x=0,ty=0; i<imLen; i+=4,++x)
            {
                if (x>=w) {x=0; ty+=w;}

                tot=0;
                rhc=ghc=bhc=0;
                for (j=0; j<matArea2; j+=2)
                {
                    xOff = x+imIndex[j]; yOff = ty+imIndex[j+1];
                    if (xOff<0 || xOff>bx || yOff<0 || yOff>by) continue;
                    srcOff = (xOff + yOff)<<2;
                    r = im[srcOff]; g = im[srcOff+1]; b = im[srcOff+2];
                    // compute histogram, similar to counting sort
                    ++rhist[r]; ++ghist[g]; ++bhist[b]; ++tot;
                    // maintain min-heap
                    if (1 === rhist[r]) heap_push(rh, rhc++, r);
                    if (1 === ghist[g]) heap_push(gh, ghc++, g);
                    if (1 === bhist[b]) heap_push(bh, bhc++, b);
                }

                // search histogram for kth statistic
                // and also reset histogram for next round
                // can it be made faster?? (used min-heap)
                tot *= kth;
                for (sum=0,kthR=-1,j=rhc; j>0; --j)
                {
                    r = heap_pop(rh, j); sum += rhist[r]; rhist[r] = 0;
                    if (0 > kthR && sum >= tot) kthR = r;
                }
                for (sum=0,kthG=-1,j=ghc; j>0; --j)
                {
                    g = heap_pop(gh, j); sum += ghist[g]; ghist[g] = 0;
                    if (0 > kthG && sum >= tot) kthG = g;
                }
                for (sum=0,kthB=-1,j=bhc; j>0; --j)
                {
                    b = heap_pop(bh, j); sum += bhist[b]; bhist[b] = 0;
                    if (0 > kthB && sum >= tot) kthB = b;
                }

                // output
                dst[i] = kthR; dst[i+1] = kthG; dst[i+2] = kthB; dst[i+3] = im[i+3];
            }
        }
        return dst;
    }
};
function heap_push(heap, items, item)
{
    // Push item onto heap, maintaining the heap invariant.
    heap[items] = item;
    _siftdown(heap, 0, items);
}
function heap_pop(heap, items)
{
    // Pop the smallest item off the heap, maintaining the heap invariant.
    var lastelt = heap[items-1], returnitem;
    if (items-1)
    {
        returnitem = heap[0];
        heap[0] = lastelt;
        _siftup(heap, 0, items-1);
        return returnitem;
    }
    return lastelt;
}
function _siftdown(heap, startpos, pos)
{
    var newitem = heap[pos], parentpos, parent;
    while (pos > startpos)
    {
        parentpos = (pos - 1) >>> 1;
        parent = heap[parentpos];
        if (newitem < parent)
        {
            heap[pos] = parent;
            pos = parentpos;
            continue;
        }
        break;
    }
    heap[pos] = newitem;
}
function _siftup(heap, pos, numitems)
{
    var endpos = numitems, startpos = pos, newitem = heap[pos], childpos, rightpos;
    childpos = 2*pos + 1;
    while (childpos < endpos)
    {
        rightpos = childpos + 1;
        if (rightpos < endpos && heap[childpos] >= heap[rightpos])
            childpos = rightpos;
        heap[pos] = heap[childpos];
        pos = childpos;
        childpos = 2*pos + 1;
    }
    heap[pos] = newitem;
    _siftdown(heap, startpos, pos);
}

}(FILTER);/**
*
* Inline Filter(s)
*
* Allows to create an filter on-the-fly using an inline function
*
* @param handler Optional (the filter apply routine)
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var GLSL = FILTER.Util.GLSL, HAS = Object.prototype.hasOwnProperty;

//
//  Inline Filter
//  used as a placeholder for constructing filters inline with an anonymous function and/or webgl shader
FILTER.Create({
    name: "InlineFilter"

    ,init: function InlineFilter(filter, params) {
        var self = this;
        self._params = {};
        self.set(filter, params);
    }

    ,path: FILTER.Path
    ,_filter: null
    ,_params: null
    ,_changed: false

    ,dispose: function() {
        var self = this;
        self._filter = null;
        self._params = null;
        self._changed = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this, json;
        json = {
             _filter: false === self._filter ? false : (self._changed && self._filter ? (self._filter.filter || self._filter).toString() : null)
            ,_params: self._params
        };
        self._changed = false;
        return json;
    }

    ,unserialize: function(params) {
        var self = this;
        if (null != params._filter)
            // using bind makes the code become [native code] and thus unserializable
            // make FILTER namespace accessible to the function code
            self._filter = false === params._filter ? null : ((new Function("FILTER", '"use strict"; return ' + params._filter + ';'))(FILTER));
        self._params = params._params || {};
        return self;
    }

    ,params: function(params) {
        var self = this;
        if (arguments.length)
        {
            for (var p in params) if (HAS.call(params, p)) self._params[p] = params[p];
            return self;
        }
        return self._params;
    }

    ,getParam: function(param) {
        var self = this;
        if (param && HAS.call(self._params, param))
        {
            return self._params[param];
        }
    }
    ,setParam: function(param, value) {
        var self = this;
        if (param && HAS.call(self._params, param))
        {
            self._params[param] = value;
        }
        return self;
    }

    ,set: function(filter, params) {
        var self = this;
        if (false === filter)
        {
            self._filter = false;
            self._changed = true;
            self._glsl = null;
        }
        else
        {
            if (filter && (("function" === typeof filter) || ("function" === typeof filter.filter)))
            {
                self._filter = filter;
                self._changed = true;
                self._glsl = null;
            }
            if (params) self.params(params);
        }
        return self;
    }

    ,getGLSL: function() {
        var self = this, filter = self._filter, glslcode;
        if (filter && filter.shader)
        {
            glslcode = (new GLSL.Filter(self)).begin().shader(filter.shader);
            if (filter.inputs) filter.inputs.forEach(function(i) {
                if (i.name) glslcode.input(i.name, i.setter, i.iname);
            });
            return glslcode.end().code();
        }
        return (new GLSL.Filter(self)).begin().shader(filter ? null : GLSL.DEFAULT).end().code();
    }

    ,_apply: function(im, w, h, metaData) {
        var self = this, filter = self._filter;
        if (!filter) return im;
        if ('function' === typeof filter.filter) filter = filter.filter;
        return filter(self._params, im, w, h, metaData);
    }

    ,canRun: function() {
        return this._isOn && this._filter;
    }
});
FILTER.CustomFilter = FILTER.InlineFilter;

}(FILTER);/**
*
* Frequency Filter
*
* Filter inputs in the Fourier Frequency Domain
*
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MODE = FILTER.MODE, A32F = FILTER.Array32F,
    fft = FILTER.Util.Filter.fft2d,
    ifft = FILTER.Util.Filter.ifft2d;

//
//  Frequency Filter
FILTER.Create({
    name: "FrequencyFilter"

    ,init: function FrequencyFilter(filterR, filterG, filterB) {
        var self = this;
        self.set(filterR, filterG, filterB);
    }

    ,path: FILTER.Path
    ,_filterE: null
    ,_filterG: null
    ,_filterB: null
    ,_changed: false

    ,dispose: function() {
        var self = this;
        self._filterR = null;
        self._filterG = null;
        self._filterB = null;
        self._changed = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this, json;
        json = {
             _filterR: false === self._filterR ? false : (self._changed && self._filterR ? self._filterR.toString() : null)
             ,_filterG: false === self._filterG ? false : (self._changed && self._filterG ? self._filterG.toString() : null)
             ,_filterB: false === self._filterB ? false : (self._changed && self._filterB ? self._filterB.toString() : null)
        };
        self._changed = false;
        return json;
    }

    ,unserialize: function(params) {
        var self = this;
        if (null != params._filterR)
            self._filterR = false === params._filterR ? null : ((new Function("FILTER", '"use strict"; return ' + params._filterR + ';'))(FILTER));
        if (null != params._filterG)
            self._filterG = false === params._filterG ? null : ((new Function("FILTER", '"use strict"; return ' + params._filterG + ';'))(FILTER));
        if (null != params._filterB)
            self._filterB = false === params._filterB ? null : ((new Function("FILTER", '"use strict"; return ' + params._filterB + ';'))(FILTER));
        return self;
    }

    ,set: function(filterR, filterG, filterB) {
        var self = this;
        if (false === filterR)
        {
            self._filterR = false;
            self._changed = true;
        }
        else
        {
            if (filterR && ("function" === typeof filterR))
            {
                self._filterR = filterR;
                self._changed = true;
            }
        }
        if (false === filterG)
        {
            self._filterG = false;
        }
        else
        {
            if (filterG && ("function" === typeof filterG))
            {
                self._filterG = filterG;
            }
        }
        if (false === filterB)
        {
            self._filterG = false;
        }
        else
        {
            if (filterB && ("function" === typeof filterB))
            {
                self._filterB = filterB;
            }
        }
        return self;
    }

    ,_apply: function(im, w, h) {
        var self = this,
            gray = MODE.GRAY === self.mode,
            filterR = self._filterR,
            filterG = self._filterG,
            filterB = self._filterB,
            R_r, G_r, B_r,
            R_i, G_i, B_i,
            R, G, B,
            i, j, v,
            n = w*h, l = im.length;
        if (!filterR && !filterG && !filterB) return im;
        if (filterR)
        {
            R_r = new A32F(n); R_i = new A32F(n);
        }
        if (filterG && !gray)
        {
            G_r = new A32F(n); G_i = new A32F(n);
        }
        if (filterB && !gray)
        {
            B_r = new A32F(n); B_i = new A32F(n);
        }
        for (i=0,j=0; i<l; i+=4,++j)
        {
           if (filterR) R_r[j] = im[i  ]/255;
           if (filterG && !gray) G_r[j] = im[i+1]/255;
           if (filterB && !gray) B_r[j] = im[i+2]/255;
        }
        if (filterR)
        {
            R = filter(fft(R_r, R_i, w, h), filterR, w, h);
            R = ifft(R.r, R.i, w, h).r;
        }
        if (filterG && !gray)
        {
            G = filter(fft(G_r, G_i, w, h), filterG, w, h);
            G = ifft(G.r, G.i, w, h).r;
        }
        if (filterB && !gray)
        {
            B = filter(fft(B_r, B_i, w, h), filterB, w, h);
            B = ifft(B.r, B.i, w, h).r;
        }
        if (gray)
        {
            R = R || G || B;
            for (i=0,j=0; i<l; i+=4,++j)
            {
               v = (255*R[j])|0;
               im[i  ] = v;
               im[i+1] = v;
               im[i+2] = v;
            }
        }
        else
        {
            for (i=0,j=0; i<l; i+=4,++j)
            {
               if (R)
               {
                   v = (255*R[j])|0;
                   im[i  ] = v;
               }
               if (G)
               {
                   v = (255*G[j])|0;
                   im[i+1] = v;
               }
               if (B)
               {
                   v = (255*B[j])|0;
                   im[i+2] = v;
               }
            }
        }
        return im;
    }

    ,canRun: function() {
        return this._isOn && (this._filterR || this._filterG || this._filterB);
    }
});
FILTER.FourierFilter = FILTER.FrequencyFilter;

function filter(fft, map, w, h)
{
    for (var O=[0,0],i=0; i<w; ++i)
    {
        for (var j=0,jw=0; j<h; ++j,jw+=w)
        {
            var k = i+jw, o = map(fft.r[k], fft.i[k], i, j, w, h, fft) || O;
            fft.r[k] = o[0] || 0;  fft.i[k] = o[1] || 0;
        }
    }
    return fft;
}
}(FILTER);/**
*
* Noise
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp = FILTER._notSupportClamp;

// a sample noise filter
// used for illustration purposes on how to create a plugin filter
var NoiseFilter = FILTER.Create({
    name: "NoiseFilter"

    // parameters
    ,min: -127
    ,max: 127

    // this is the filter constructor
    ,init: function(min, max) {
        var self = this;
        if (null == min) min = -127;
        if (null == max) max = 127;
        self.min = min||0;
        self.max = max||0;
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,serialize: function() {
        var self = this;
        return {
             min: self.min
            ,max: self.max
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.min = params.min;
        self.max = params.max;
        return self;
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        var rand = NoiseFilter.random, range = self.max-self.min,
            m = self.min, i, l = im.length, n, r, g, b, t0, t1, t2;

        // add noise
        if (notSupportClamp)
        {
            for (i=0; i<l; i+=4)
            {
                r = im[i]; g = im[i+1]; b = im[i+2];
                n = range*rand()+m;
                t0 = r+n; t1 = g+n; t2 = b+n;
                // clamp them manually
                if (t0<0) t0=0;
                else if (t0>255) t0=255;
                if (t1<0) t1=0;
                else if (t1>255) t1=255;
                if (t2<0) t2=0;
                else if (t2>255) t2=255;
                im[i] = t0|0; im[i+1] = t1|0; im[i+2] = t2|0;
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                r = im[i]; g = im[i+1]; b = im[i+2];
                n = range*rand()+m;
                t0 = r+n; t1 = g+n; t2 = b+n;
                im[i] = t0|0; im[i+1] = t1|0; im[i+2] = t2|0;
            }
        }

        // return the new image data
        return im;
    }
});
NoiseFilter.random = Math.random;

}(FILTER);/**
*
* Perlin Noise
* @package FILTER.js
*
**/
!function(FILTER) {
"use strict";

var MODE = FILTER.MODE;

// an efficient perlin noise and simplex noise plugin
// http://en.wikipedia.org/wiki/Perlin_noise
FILTER.Create({
    name: "PerlinNoiseFilter"

    // parameters
    ,mode: MODE.GRAY
    ,_baseX: 1
    ,_baseY: 1
    ,_octaves: 1
    ,_offsets: null
    ,_seed: 0
    ,_stitch: false
    ,_fractal: true
    ,_perlin: false

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    // constructor
    ,init: function(baseX, baseY, octaves, stitch, fractal, offsets, seed, use_perlin) {
        var self = this;
        self.mode = MODE.GRAY;
        self._baseX = baseX || 1;
        self._baseY = baseY || 1;
        self._seed = seed || 0;
        self._stitch = !!stitch;
        self._fractal = false !== fractal;
        self._perlin = !!use_perlin;
        self.octaves(octaves||1, offsets);
    }

    ,seed: function(randSeed) {
        var self = this;
        self._seed = randSeed || 0;
        return self;
    }

    ,octaves: function(octaves, offsets) {
        var self = this;
        self._octaves = octaves || 1;
        self._offsets = !offsets ? [] : offsets.slice(0);
        while (self._offsets.length < self._octaves) self._offsets.push([0, 0]);
        return self;
    }

    ,seamless: function(enabled) {
        if (!arguments.length) enabled = true;
        this._stitch = !!enabled;
        return this;
    }

    ,colors: function(enabled) {
        if (!arguments.length) enabled = true;
        this.mode = !!enabled ? MODE.COLOR : MODE.GRAY;
        return this;
    }

    ,turbulence: function(enabled) {
        if (!arguments.length) enabled = true;
        this._fractal = !enabled;
        return this;
    }

    ,simplex: function() {
        this._perlin = false;
        return this;
    }

    ,perlin: function() {
        this._perlin = true;
        return this;
    }

    ,serialize: function() {
        var self = this;
        return {
             _baseX: self._baseX
            ,_baseY: self._baseY
            ,_octaves: self._octaves
            ,_offsets: self._offsets
            ,_seed: self._seed || 0
            ,_stitch: self._stitch
            ,_fractal: self._fractal
            ,_perlin: self._perlin
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self._baseX = params._baseX;
        self._baseY = params._baseY;
        self._octaves = params._octaves;
        self._offsets = params._offsets;
        self._seed = params._seed || 0;
        self._stitch = params._stitch;
        self._fractal = params._fractal;
        self._perlin = params._perlin;
        return self;
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        if (self._seed)
        {
            perlin.seed(self._seed);
            self._seed = 0;
        }
        return perlin(im, w, h, self._stitch, MODE.COLOR !== self.mode, self._baseX, self._baseY, self._octaves, self._offsets, 1.0, 0.5, self._perlin);
    }
});

var stdMath = Math, FLOOR = stdMath.floor, sin = stdMath.sin, cos = stdMath.cos,
    PI2 = FILTER.CONST.PI2, Array8U = FILTER.Array8U;

// adapted from:

// https://github.com/kev009/craftd/blob/master/plugins/survival/mapgen/noise/simplexnoise1234.c
/* SimplexNoise1234, Simplex noise with true analytic
 * derivative in 1D to 4D.
 *
 * Author: Stefan Gustavson, 2003-2005
 * Contact: stegu@itn.liu.se
 *
 * This code was GPL licensed until February 2011.
 * As the original author of this code, I hereby
 * release it into the public domain.
 * Please feel free to use it for whatever you want.
 * Credit is appreciated where appropriate, and I also
 * appreciate being told where this code finds any use,
 * but you may do as you like.
 */

 // https://github.com/kev009/craftd/blob/master/plugins/survival/mapgen/noise/noise1234.c
/* noise1234
 *
 * Author: Stefan Gustavson, 2003-2005
 * Contact: stegu@itn.liu.se
 *
 * This code was GPL licensed until February 2011.
 * As the original author of this code, I hereby
 * release it into the public domain.
 * Please feel free to use it for whatever you want.
 * Credit is appreciated where appropriate, and I also
 * appreciate being told where this code finds any use,
 * but you may do as you like.
 */

/*
 * Permutation table. This is just a random jumble of all numbers 0-255,
 * repeated twice to avoid wrapping the index at 255 for each lookup.
 * This needs to be exactly the same for all instances on all platforms,
 * so it's easiest to just keep it as static explicit data.
 * This also removes the need for any initialisation of this class.
 *
 * Note that making this an int[] instead of a char[] might make the
 * code run faster on platforms with a high penalty for unaligned single
 * byte addressing. Intel x86 is generally single-byte-friendly, but
 * some other CPUs are faster with 4-aligned reads.
 * However, a char[] is smaller, which avoids cache trashing, and that
 * is probably the most important aspect on most architectures.
 * This array is accessed a *lot* by the noise functions.
 * A vector-valued noise over 3D accesses it 96 times, and a
 * float-valued 4D noise 64 times. We want this to fit in the cache!
 */
var p = new Array8U([151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180,
  151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
]), perm = new Array8U(p); // copy it initially

// This isn't a very good seeding function, but it works ok. It supports 2^16
// different seed values. Write something better if you need more seeds.
function seed(seed)
{
    var v, i;
    // Scale the seed out
    if (seed > 0 && seed < 1) seed *= 65536;

    seed = FLOOR(seed);
    if (seed < 256) seed |= seed << 8;
    for (i = 0; i < 256; ++i)
    {
        v = (i & 1) ? (p[i] ^ (seed & 255)) : (p[i] ^ ((seed>>8) & 255));
        perm[i] = perm[i + 256] = v;
    }
}
//seed(0);

/*
 * Helper functions to compute gradients-dot-residualvectors (1D to 4D)
 * Note that these generate gradients of more than unit length. To make
 * a close match with the value range of classic Perlin noise, the final
 * noise values need to be rescaled to fit nicely within [-1,1].
 * (The simplex noise functions as such also have different scaling.)
 * Note also that these noise functions are the most practical and useful
 * signed version of Perlin noise. To return values according to the
 * RenderMan specification from the SL noise() and pnoise() functions,
 * the noise values need to be scaled and offset to [0,1], like this:
 * float SLnoise = (noise(x,y,z) + 1.0) * 0.5;
 */

function grad1(hash, x)
{
    var h = hash & 15;
    var grad = 1.0 + (h & 7);   // Gradient value 1.0, 2.0, ..., 8.0
    if (h&8) grad = -grad;         // Set a random sign for the gradient
    return (grad * x);           // Multiply the gradient with the distance
}

function grad2(hash, x, y)
{
    var h = hash & 7;      // Convert low 3 bits of hash code
    var u = h<4 ? x : y;  // into 8 simple gradient directions,
    var v = h<4 ? y : x;  // and compute the dot product with (x,y).
    return ((h&1)? -u : u) + ((h&2)? -2.0*v : 2.0*v);
}

function grad3(hash, x, y, z)
{
    var h = hash & 15;     // Convert low 4 bits of hash code into 12 simple
    var u = h<8 ? x : y; // gradient directions, and compute dot product.
    var v = h<4 ? y : h==12||h==14 ? x : z; // Fix repeats at h = 12 to 15
    return ((h&1)? -u : u) + ((h&2)? -v : v);
}

function grad4(hash, x, y, z, t)
{
    var h = hash & 31;      // Convert low 5 bits of hash code into 32 simple
    var u = h<24 ? x : y; // gradient directions, and compute dot product.
    var v = h<16 ? y : z;
    var w = h<8 ? z : t;
    return ((h&1)? -u : u) + ((h&2)? -v : v) + ((h&4)? -w : w);
}

// A lookup table to traverse the simplex around a given point in 4D.
// Details can be found where this table is used, in the 4D noise method.
/* TODO: This should not be required, backport it from Bill's GLSL code! */
var simplex = [
[0,1,2,3],[0,1,3,2],[0,0,0,0],[0,2,3,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,2,3,0],
[0,2,1,3],[0,0,0,0],[0,3,1,2],[0,3,2,1],[0,0,0,0],[0,0,0,0],[0,0,0,0],[1,3,2,0],
[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
[1,2,0,3],[0,0,0,0],[1,3,0,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,3,0,1],[2,3,1,0],
[1,0,2,3],[1,0,3,2],[0,0,0,0],[0,0,0,0],[0,0,0,0],[2,0,3,1],[0,0,0,0],[2,1,3,0],
[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0],
[2,0,1,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,0,1,2],[3,0,2,1],[0,0,0,0],[3,1,2,0],
[2,1,0,3],[0,0,0,0],[0,0,0,0],[0,0,0,0],[3,1,0,2],[0,0,0,0],[3,2,0,1],[3,2,1,0]
];

// 2D simplex noise
function simplex2(x, y)
{
    var F2 = 0.366025403; // F2 = 0.5*(sqrt(3.0)-1.0)
    var G2 = 0.211324865; // G2 = (3.0-Math.sqrt(3.0))/6.0

    var n0, n1, n2; // Noise contributions from the three corners

    // Skew the input space to determine which simplex cell we're in
    var s = (x+y)*F2; // Hairy factor for 2D
    var xs = x + s;
    var ys = y + s;
    var i = FLOOR(xs);
    var j = FLOOR(ys);

    var t = (i+j)*G2;
    var X0 = i-t; // Unskew the cell origin back to (x,y) space
    var Y0 = j-t;
    var x0 = x-X0; // The x,y distances from the cell origin
    var y0 = y-Y0;

    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if (x0>y0) {i1=1; j1=0;} // lower triangle, XY order: (0,0)->(1,0)->(1,1)
    else {i1=0; j1=1;}      // upper triangle, YX order: (0,0)->(0,1)->(1,1)

    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6

    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1.0 + 2.0 * G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1.0 + 2.0 * G2;

    // Wrap the integer indices at 256, to avoid indexing perm[] out of bounds
    var ii = i & 0xff;
    var jj = j & 0xff;

    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0*x0-y0*y0;
    if (t0 < 0.0) n0 = 0.0;
    else
    {
        t0 *= t0;
        n0 = t0 * t0 * grad2(perm[ii+perm[jj]], x0, y0);
    }

    var t1 = 0.5 - x1*x1-y1*y1;
    if (t1 < 0.0) n1 = 0.0;
    else
    {
        t1 *= t1;
        n1 = t1 * t1 * grad2(perm[ii+i1+perm[jj+j1]], x1, y1);
    }

    var t2 = 0.5 - x2*x2-y2*y2;
    if(t2 < 0.0) n2 = 0.0;
    else
    {
        t2 *= t2;
        n2 = t2 * t2 * grad2(perm[ii+1+perm[jj+1]], x2, y2);
    }

    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 40.0 * (n0 + n1 + n2); // TODO: The scale factor is preliminary!
}

// This is the new and improved, C(2) continuous interpolant
function FADE(t) {return t * t * t * ( t * ( t * 6 - 15 ) + 10 );}
function LERP(t, a, b) {return a + t*(b-a);}

// 2D float Perlin noise.
function perlin2(x, y)
{
    var ix0, iy0, ix1, iy1;
    var fx0, fy0, fx1, fy1;
    var s, t, nx0, nx1, n0, n1;

    ix0 = FLOOR(x); // Integer part of x
    iy0 = FLOOR(y); // Integer part of y
    fx0 = x - ix0;        // Fractional part of x
    fy0 = y - iy0;        // Fractional part of y
    fx1 = fx0 - 1.0;
    fy1 = fy0 - 1.0;
    ix1 = (ix0 + 1) & 0xff;  // Wrap to 0..255
    iy1 = (iy0 + 1) & 0xff;
    ix0 = ix0 & 0xff;
    iy0 = iy0 & 0xff;

    t = FADE(fy0);
    s = FADE(fx0);

    nx0 = grad2(perm[ix0 + perm[iy0]], fx0, fy0);
    nx1 = grad2(perm[ix0 + perm[iy1]], fx0, fy1);
    n0 = LERP(t, nx0, nx1);

    nx0 = grad2(perm[ix1 + perm[iy0]], fx1, fy0);
    nx1 = grad2(perm[ix1 + perm[iy1]], fx1, fy1);
    n1 = LERP(t, nx0, nx1);

    return 0.507 * LERP(s, n0, n1);
}

function octaved(data, index, noise, x, y, w, h, ibx, iby, octaves, offsets, scale, roughness)
{
    var noiseSum = 0, layerFrequency = scale, layerWeight = 1, weightSum = 0,
        octave, nx, ny, w2 = w>>>1, h2 = h>>>1, v;

    for (octave=0; octave<octaves; ++octave)
    {
        nx = (x + offsets[octave][0]) % w; ny = (y + offsets[octave][1]) % h;
        noiseSum += noise(layerFrequency*nx*ibx, layerFrequency*ny*iby) * layerWeight;
        layerFrequency *= 2;
        weightSum += layerWeight;
        layerWeight *= roughness;
    }
    v = ~~(0xff*(0.5*noiseSum/weightSum+0.5));
    data[index  ] = v;
    data[index+1] = v;
    data[index+2] = v;
    data[index+3] = 255;
}
function octaved_rgb(data, index, noise, x, y, w, h, ibx, iby, octaves, offsets, scale, roughness)
{
    var noiseSum = 0, layerFrequency = scale, layerWeight = 1, weightSum = 0,
        octave, nx, ny, w2 = w>>>1, h2 = h>>>1, v;

    for (octave=0; octave<octaves; ++octave)
    {
        nx = (x + offsets[octave][0]) % w; ny = (y + offsets[octave][1]) % h;
        noiseSum += noise(layerFrequency*nx*ibx, layerFrequency*ny*iby) * layerWeight;
        layerFrequency *= 2;
        weightSum += layerWeight;
        layerWeight *= roughness;
    }
    v = ~~(0xffffff*(0.5*noiseSum/weightSum+0.5));
    data[index  ] = (v >>> 16) & 255;
    data[index+1] = (v >>> 8) & 255;
    data[index+2] = (v) & 255;
    data[index+3] = 255;
}

/*function turbulence()
{
}*/
function perlin(n, w, h, seamless, grayscale, baseX, baseY, octaves, offsets, scale, roughness, use_perlin)
{
    var invBaseX = 1.0/baseX, invBaseY = 1.0/baseY,
        noise = use_perlin ? perlin2 : simplex2,
        generate = grayscale ? octaved : octaved_rgb,
        x, y, nx, ny, i, j, size = n.length, w2 = w>>>1, h2 = h>>>1;
    scale = scale || 1.0; roughness = roughness || 0.5;
    octaves = octaves || 1; offsets = offsets || [[0,0]];
    if (seamless)
    {
        for (x=0,y=0,i=0; i<size; i+=4,++x)
        {
            if (x >= w) {x=0; ++y;}
            // simulate seamless stitching, i.e circular/tileable symmetry
            nx = x > w2 ? w-1-x : x;
            ny = y > h2 ? h-1-y : y;
            if ((nx < x) || (ny < y))
            {
                j = (ny*w + nx) << 2;
                n[ i   ] = n[ j   ];
                n[ i+1 ] = n[ j+1 ];
                n[ i+2 ] = n[ j+2 ];
                n[ i+3 ] = 255;
            }
            else
            {
                generate(n, i, noise, nx, ny, w, h, invBaseX, invBaseY, octaves, offsets, scale, roughness);
            }
        }
    }
    else
    {
        for (x=0,y=0,i=0; i<size; i+=4,++x)
        {
            if (x >= w) {x=0; ++y;}
            generate(n, i, noise, x, y, w, h, invBaseX, invBaseY, octaves, offsets, scale, roughness);
        }
    }
    return n;
};
perlin.seed = seed;

}(FILTER);/**
*
* Channel Copy
* @package FILTER.js
*
**/
!function(FILTER) {
"use strict";

var stdMath = Math, Min = stdMath.min, Floor = stdMath.floor,
    GLSL = FILTER.Util.GLSL,
    CHANNEL = FILTER.CHANNEL, MODE = FILTER.MODE;

// a plugin to copy a channel of an image to a channel of another image
var ChannelCopyFilter = FILTER.Create({
    name: "ChannelCopyFilter"

    // parameters
    ,srcChannel: CHANNEL.R
    ,dstChannel: CHANNEL.R
    ,centerX: 0
    ,centerY: 0
    ,color: 0
    ,hasInputs: true

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    // constructor
    ,init: function(srcChannel, dstChannel, centerX, centerY, color) {
        var self = this;
        self.srcChannel = srcChannel || CHANNEL.R;
        self.dstChannel = dstChannel || CHANNEL.R;
        self.centerX = centerX || 0;
        self.centerY = centerY || 0;
        self.color = color || 0;
    }

    ,dispose: function() {
        var self = this;
        self.srcChannel = null;
        self.dstChannel = null;
        self.centerX = null;
        self.centerY = null;
        self.color = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             srcChannel: self.srcChannel
            ,dstChannel: self.dstChannel
            ,centerX: self.centerX
            ,centerY: self.centerY
            ,color: self.color
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.srcChannel = params.srcChannel;
        self.dstChannel = params.dstChannel;
        self.centerX = params.centerX;
        self.centerY = params.centerY;
        self.color = params.color;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return wasm(this);
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this, Src;
        Src = self.input("source"); if (!Src) return im;

        var src = Src[0], w2 = Src[1], h2 = Src[2],
            i, l = im.length, l2 = src.length,
            sC = self.srcChannel, tC = self.dstChannel,
            x, x2, y, y2, off, xc, yc,
            cX = self.centerX||0, cY = self.centerY||0, cX2 = w2>>>1, cY2 = h2>>>1,
            wm = Min(w,w2), hm = Min(h, h2),
            color = self.color||0, r, g, b, a,
            mode = self.mode, COLOR32 = MODE.COLOR32, COLOR8 = MODE.COLOR8,
            MASK32 = MODE.COLORMASK32, MASK8 = MODE.COLORMASK8;

        if (COLOR32 === mode || MASK32 === mode)
        {
            a = (color >>> 24)&255;
            r = (color >>> 16)&255;
            g = (color >>> 8)&255;
            b = (color)&255;
        }
        else if (COLOR8 === mode || MASK8 === mode)
        {
            color &= 255;
        }

        // make center relative
        cX = Floor(cX*(w-1)) - cX2;
        cY = Floor(cY*(h-1)) - cY2;

        for (x=0,y=0,i=0; i<l; i+=4,++x)
        {
            if (x>=w) {x=0; ++y;}

            xc = x - cX; yc = y - cY;
            if (xc<0 || xc>=w2 || yc<0 || yc>=h2)
            {
                if (COLOR32 === mode) {im[i  ] = r; im[i+1] = g; im[i+2] = b; im[i+3] = a;}
                else if (MASK32 === mode) {im[i  ] = r & im[i  ]; im[i+1] = g & im[i+1]; im[i+2] = b & im[i+2]; im[i+3] = a & im[i+3];}
                else if (COLOR8 === mode) im[i+tC] = color;
                else if (MASK8 === mode) im[i+tC] = color & im[i+sC];
                // else ignore
            }
            else
            {
                // copy channel
                off = (xc + yc*w2)<<2;
                im[i + tC] = src[off + sC];
            }
        }
        // return the new image data
        return im;
    }
});
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    channelcopyfilter: {inputs: [{arg:0,type:FILTER.ImArray},{arg:4,type:FILTER.ImArray}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
    ChannelCopyFilter.prototype._apply_wasm = function(im, w, h) {
        var self = this, src;
        src = self.input("source"); if (!src) return im;
        return wasm.channelcopyfilter(im, w, h, self.mode||0, src[0], src[1], src[2], self.centerX||0, self.centerY||0, self.srcChannel||0, self.dstChannel||0, self.color||0);
    };
    }
    FILTER.unwaitFor(1);
});
}

function glsl(filter)
{
    if (!filter.input("source")) return (new GLSL.Filter(filter)).begin().shader(GLSL.DEFAULT).end().code();
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform sampler2D src;',
    'uniform vec2 srcSize;',
    'uniform vec2 center;',
    'uniform vec4 color;',
    'uniform int sC;',
    'uniform int tC;',
    '#define COLOR32 '+MODE.COLOR32+'',
    '#define COLOR8 '+MODE.COLOR8+'',
    '#define MASK32 '+MODE.COLORMASK32+'',
    '#define MASK8 '+MODE.COLORMASK8+'',
    '#define RED '+CHANNEL.R+'',
    '#define GREEN '+CHANNEL.G+'',
    '#define BLUE '+CHANNEL.B+'',
    '#define ALPHA '+CHANNEL.A+'',
    'uniform int mode;',
    'float get_channel(vec4 col, int channel) {',
    '   if (ALPHA == channel) return col.a;',
    '   if (BLUE == channel) return col.b;',
    '   if (GREEN == channel) return col.g;',
    '   if (RED == channel) return col.r;',
    '   return 0.0;',
    '}',
    'vec4 set_channel(vec4 col, float val, int channel) {',
    '   vec4 ret = vec4(col.r, col.g, col.b, col.a);',
    '   if (ALPHA == channel) ret.a = val;',
    '   else if (BLUE == channel) ret.b = val;',
    '   else if (GREEN == channel) ret.g = val;',
    '   else if (RED == channel) ret.r = val;',
    '   return ret;',
    '}',
    'void main(void) {',
    '   vec4 tCol = texture2D(img, pix);',
    '   vec2 p = (pix - (center - 0.5*srcSize))/srcSize;',
    '   if (0.0 > p.x || 1.0 < p.x || 0.0 > p.y || 1.0 < p.y) {',
    '       if (MASK32 == mode) {tCol *= color;}',
    '       else if (COLOR32 == mode) {tCol = color;}',
    '       else if (MASK8 == mode) {',
    '           if (ALPHA == tC) tCol.a *= color.a;',
    '           else if (BLUE == tC) tCol.b *= color.b;',
    '           else if (GREEN == tC) tCol.g *= color.g;',
    '           else tCol.r *= color.r;',
    '       }',
    '       else if (COLOR8 == mode) {',
    '           if (ALPHA == tC) tCol.a = color.a;',
    '           else if (BLUE == tC) tCol.b = color.b;',
    '           else if (GREEN == tC) tCol.g = color.g;',
    '           else tCol.r = color.r;',
    '       }',
    '   } else {',
    '       vec4 sCol = texture2D(src, p);',
    '       tCol = set_channel(tCol, get_channel(sCol, sC), tC);',
    '   }',
    '   gl_FragColor = tCol;',
    '}'
    ].join('\n'))
    .input('src', function(filter) {
        var src = filter.input("source");
        return {data:src[0], width:src[1], height:src[2]};
    })
    .input('srcSize', function(filter, w, h) {
        var src = filter.input("source");
        return [src[1]/w, src[2]/h];
    })
    .input('center', function(filter) {
        return [filter.centerX, filter.centerY];
    })
    .input('sC', function(filter) {
        return filter.srcChannel;
    })
    .input('tC', function(filter) {
        return filter.dstChannel;
    })
    .input('color', function(filter) {
        var color = filter.color||0;
        if (MODE.COLOR8 === filter.mode || MODE.MASK8 === filter.mode)
        {
            color = (color & 255)/255;
            return [
            color,
            color,
            color,
            color
            ];
        }
        else
        {
            return [
            ((color >>> 16) & 255)/255,
            ((color >>> 8) & 255)/255,
            (color & 255)/255,
            ((color >>> 24) & 255)/255
            ];
        }
    })
    .end();
    return glslcode.code();
}
function wasm()
{
    return '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';
}
}(FILTER);/**
*
* Pixelate: Rectangular, Triangular, Rhomboid, Hexagonal
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var stdMath = Math, hypot = FILTER.Util.Math.hypot,
    sqrt = stdMath.sqrt, abs = stdMath.abs,
    min = stdMath.min, max = stdMath.max,
    floor = stdMath.floor, ceil = stdMath.ceil;

// a simple and fast Pixelate filter for various patterns
// TODO: add some smoothing/dithering in patterns which have diagonal lines separating cells, e.g triangular,..
var PixelateFilter = FILTER.Create({
    name: "PixelateFilter"

    // parameters
    ,scale: 1
    ,pattern: "rectangular"

    ,init: function(scale, pattern) {
        var self = this;
        self.scale = scale || 1;
        self.pattern = pattern || "rectangular";
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,serialize: function() {
        var self = this;
        return {
             scale: self.scale
            ,pattern: self.pattern
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.scale = params.scale;
        self.pattern = params.pattern;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,getWASM: function() {
        return wasm(this);
    }

    ,apply: function(im, w, h) {
        var self = this, pattern = self.pattern;
        if (self.scale <= 1  || !pattern || !PIXELATION[pattern]) return im;
        if (self.scale > 100) self.scale = 100;
        return PIXELATION[pattern](im, w, h, self.scale);
    }
});
if (FILTER.Util.WASM.isSupported)
{
FILTER.waitFor(1);
FILTER.Util.WASM.instantiate(wasm(), {}, {
    rectangular: {inputs: [{arg:0,type:FILTER.ImArray}], output: {type:FILTER.ImArray}},
    triangular: {inputs: [{arg:0,type:FILTER.ImArray}], output: {type:FILTER.ImArray}},
    rhomboidal: {inputs: [{arg:0,type:FILTER.ImArray}], output: {type:FILTER.ImArray}},
    hexagonal: {inputs: [{arg:0,type:FILTER.ImArray}], output: {type:FILTER.ImArray}}
}).then(function(wasm) {
    if (wasm)
    {
    PixelateFilter.prototype._apply_wasm = function(im, w, h) {
        var self = this, pattern = self.pattern;
        if (self.scale <= 1  || !pattern || !PIXELATION[pattern]) return im;
        if (self.scale > 100) self.scale = 100;
        return (wasm[pattern] || PIXELATION[pattern])(im, w, h, self.scale);
    };
    }
    FILTER.unwaitFor(1);
});
}

// private methods
var PIXELATION = PixelateFilter.PATTERN = {
    "rectangular": function rectangular(input, w, h, scale) {
        var imLen = input.length, imArea = imLen>>>2,
            step, step_2, stepw, stepw_2,
            bx = w-1, by = imArea-w, p0,
            i, x, yw, sx, sy, syw, pxa, pya, pxc, pyc,
            output = new FILTER.ImArray(imLen);

        step = (sqrt(imArea)*scale*1e-2)|0;
        step_2 = (0.5*step)|0; stepw = step*w; stepw_2 = step_2*w;

        x=yw=sx=sy=syw=0;
        for (i=0; i<imLen; i+=4)
        {
            pxa = x-sx; pya = yw-syw;
            pxc = max(0, min(bx, pxa+step_2));
            pyc = max(0, min(by, pya+stepw_2));

            p0 = (pxc + pyc) << 2;

            output[i  ] = input[p0  ];
            output[i+1] = input[p0+1];
            output[i+2] = input[p0+2];
            output[i+3] = input[i+3];

            // next pixel
            ++x; ++sx;
            if (x >= w)
            {
                sx=0; x=0; ++sy; syw+=w; yw+=w;
                if (sy >= step) {sy=0; syw=0;}
            }
            if (sx >= step) {sx=0;}
        }
        return output;
    },
    "triangular": function triangular(input, w, h, scale) {
        var imLen = input.length, imArea = imLen>>>2,
            step, step_2, step1_3, step2_3, stepw, stepw_2,
            bx = w-1, by = imArea-w, p0,
            i, x, yw, sx, sy, syw, pxa, pya, pxc, pyc,
            output = new FILTER.ImArray(imLen);

        step = (sqrt(imArea)*scale*1.25e-2)|0;
        step_2 = (0.5*step)|0; step1_3 = (0.333*step)|0; step2_3 = (0.666*step)|0;
        stepw = step*w; stepw_2 = step_2*w;

        x=yw=sx=sy=syw=0;
        for (i=0; i<imLen; i+=4)
        {
            pxa = x-sx; pya = yw-syw;

            // these edge conditions create the various triangular patterns
            if (sx+sy > step)
            {
                // second (right) triangle
                pxc = max(0, min(bx, pxa+step2_3));
                pyc = max(0, min(by, pya+stepw_2));
                p0 = (pxc + pyc) << 2;
            }
            else
            {
                // first (left) triangle
                pxc = max(0, min(bx, pxa+step1_3));
                pyc = max(0, min(by, pya+stepw_2));
                p0 = (pxc + pyc) << 2;
            }

            output[i  ] = input[p0  ];
            output[i+1] = input[p0+1];
            output[i+2] = input[p0+2];
            output[i+3] = input[i+3];

            // next pixel
            ++x; ++sx;
            if (x >= w)
            {
                sx=0; x=0; ++sy; syw+=w; yw+=w;
                if (sy >= step) {sy=0; syw=0;}
            }
            if (sx >= step) {sx=0;}
        }
        return output;
    },
    "rhomboidal": function rhomboidal(input, w, h, scale) {
        var imLen = input.length, imArea = imLen>>>2,
            step, step2, stepw, stepw2, odd,
            bx = w-1, by = imArea-w, p0,
            i, x, yw, sx, sy, syw, pxa, pya, pxc, pyc,
            output = new FILTER.ImArray(imLen);

        step = (sqrt(imArea)*scale*7e-3)|0;
        step2 = 2*step; stepw = step*w; stepw2 = step2*w;

        x=yw=sx=sy=syw=0; odd = 0;
        for (i=0; i<imLen; i+=4)
        {
            // these edge conditions create the various rhomboid patterns
            if (odd)
            {
                // second row, bottom half of rhombii
                if (sx+sy > step2)
                {
                    // third triangle /\.
                    pxa = min(bx, x-sx+step); pya = yw-syw;
                }
                else if (sx+step-sy > step)
                {
                    // second triangle \/.
                    pxa = x-sx; pya = max(0, yw-syw-stepw);
                }
                else
                {
                    // first triangle /\.
                    pxa = max(0, x-sx-step); pya = yw-syw;
                }
            }
            else
            {
                // first row, top half of rhombii
                if (sx+step-sy > step2)
                {
                    // third triangle \/.
                    pxa = min(bx, x-sx+step); pya = max(0, yw-syw-stepw);
                }
                else if (sx+sy > step)
                {
                    // second triangle /\.
                    pxa = x-sx; pya = yw-syw;
                }
                else
                {
                    // first triangle \/.
                    pxa = max(0, x-sx-step); pya = max(0, yw-syw-stepw);
                }
            }
            pxc = max(0, min(bx, pxa+step));
            pyc = max(0, min(by, pya+stepw));

            p0 = (pxc + pyc) << 2;

            output[i  ] = input[p0  ];
            output[i+1] = input[p0+1];
            output[i+2] = input[p0+2];
            output[i+3] = input[i+3];

            // next pixel
            ++x; ++sx;
            if (x >= w)
            {
                sx=0; x=0; ++sy; syw+=w; yw+=w;
                if (sy >= step) {sy=0; syw=0; odd = 1-odd;}
            }
            if (sx >= step2) {sx=0;}
        }
        return output;
    },
    "hexagonal": function hexagonal(input, w, h, scale) {
        var imLen = input.length, imArea = imLen>>>2,
            bx = w-1, by = imArea-w, p0, i, x, y, xn, yn,
            t_x, t_y, it_x, it_y, ct_x, ct_y,
            a_x, a_y, b_x, b_y, c_x, c_y,
            A_x, A_y, A_z, B_x, B_y, B_z, C_x, C_y, C_z,
            T_x, T_y, T_z, alen, blen, clen, ch_x, ch_y,
            output = new FILTER.ImArray(imLen);

        scale = sqrt(imArea)*scale*1e-2;
        x=y=0;
        for (i=0; i<imLen; i+=4)
        {
            //xn = x/w;
            //yn = y/h;
            t_x = x / scale;
            t_y = y / scale;
            t_y /= 0.866025404;
            t_x -= t_y * 0.5;
            it_x = floor(t_x);
            it_y = floor(t_y);
            ct_x = ceil(t_x);
            ct_y = ceil(t_y);
            if (t_x + t_y - it_x - it_y < 1.0)
            {
                a_x = it_x;
                a_y = it_y;
            }
            else
            {
                a_x = ct_x;
                a_y = ct_y;
            }
            b_x = ct_x;
            b_y = it_y;
            c_x = it_x;
            c_y = ct_y;

            T_x = t_x;
            T_y = t_y;
            T_z = 1.0 - t_x - t_y;
            A_x = a_x;
            A_y = a_y;
            A_z = 1.0 - a_x - a_y;
            B_x = b_x;
            B_y = b_y;
            B_z = 1.0 - b_x - b_y;
            C_x = c_x;
            C_y = c_y;
            C_z = 1.0 - c_x - c_y;

            alen = hypot(T_x - A_x, T_y - A_y, T_z - A_z);
            blen = hypot(T_x - B_x, T_y - B_y, T_z - B_z);
            clen = hypot(T_x - C_x, T_y - C_y, T_z - C_z);
            if (alen < blen)
            {
                if (alen < clen) {ch_x = a_x; ch_y = a_y;}
                else {ch_x = c_x; ch_y = c_y;}
            }
            else
            {
                if (blen < clen) {ch_x = b_x; ch_y = b_y;}
                else {ch_x = c_x; ch_y = c_y;}
            }

            ch_x += ch_y * 0.5;
            ch_y *= 0.866025404;
            ch_x *= scale;
            ch_y *= scale;
            p0 = (max(0, min(bx, ch_x|0)) + max(0, min(by, (ch_y|0)*w))) << 2;
            output[i  ] = input[p0  ];
            output[i+1] = input[p0+1];
            output[i+2] = input[p0+2];
            output[i+3] = input[i+3];

            // next pixel
            ++x;
            if (x >= w) {x=0; ++y;}
        }
        return output;
    },
    "rectangular_glsl": [
    'vec2 rectangular(vec2 p, vec2 imgsize, float tilesize) {',
    '    return clamp((tilesize*floor(imgsize * p / tilesize) + 0.5*tilesize)/imgsize, 0.0, 1.0);',
    '}'
    ].join('\n'),
    "triangular_glsl": [
    'vec2 triangular(vec2 p, vec2 imgsize, float tilesize) {',
    '   tilesize *= 1.25;',
    '   vec2 tile = tilesize*floor(imgsize * p / tilesize);',
    '   vec2 t = mod(imgsize * p, tilesize);',
    '   if (t.x+t.y > tilesize) return clamp((tile + vec2(0.66*tilesize, 0.5*tilesize))/imgsize, 0.0, 1.0);',
    '   else return clamp((tile + vec2(0.33*tilesize, 0.5*tilesize))/imgsize, 0.0, 1.0);',
    '}'
    ].join('\n'),
    'rhomboidal_glsl': [
    'vec2 rhomboidal(vec2 p, vec2 imgsize, float tilesize) {',
    '   tilesize *= 0.7;',
    '   vec2 xy = imgsize * p;',
    '   vec2 xyi = floor(xy / tilesize);',
    '   vec2 tile = tilesize*xyi;',
    '   vec2 s = vec2(mod(xy.x, 2.0*tilesize), mod(xy.y, tilesize));',
    '   vec2 a;',
    '   if (0.0 < mod(xyi.y, 2.0)) {',
    '       if (s.x+s.y > 2.0*tilesize) {',
    '           a = vec2(xy.x-s.x+tilesize, xy.y-s.y);',
    '       } else if (s.x+tilesize-s.y > tilesize) {',
    '           a = vec2(xy.x-s.x, xy.y-s.y-tilesize);',
    '       } else {',
    '           a = vec2(xy.x-s.x-tilesize, xy.y-s.y);',
    '       }',
    '   } else {',
    '       if (s.x+tilesize-s.y > 2.0*tilesize) {',
    '           a = vec2(xy.x-s.x+tilesize, xy.y-s.y-tilesize);',
    '       } else if (s.x+s.y > tilesize) {',
    '           a = vec2(xy.x-s.x, xy.y-s.y);',
    '       } else {',
    '           a = vec2(xy.x-s.x-tilesize, xy.y-s.y-tilesize);',
    '       }',
    '   }',
    '   a = vec2(clamp(a.x, 0.0, imgsize.x), clamp(a.y, 0.0, imgsize.y));',
    '   return clamp((a + vec2(tilesize))/imgsize, 0.0, 1.0);',
    '}'
    ].join('\n'),
    "hexagonal_glsl": [
    'vec2 hexagonal(vec2 p, vec2 imgsize, float tilesize) {',
    '    vec2 t = imgsize * p / tilesize;',
    '    t.y /= 0.866025404;',
    '    t.x -= t.y * 0.5;',
    '    vec2 it = vec2(floor(t.x), floor(t.y));',
    '    vec2 ct = vec2(ceil(t.x), ceil(t.y));',
    '    vec2 a;',
    '    if (t.x + t.y - it.x - it.y < 1.0) a = it;',
    '    else a = ct;',
    '    vec2 b = vec2(ct.x, it.y);',
    '    vec2 c = vec2(it.x, ct.y);',
    '    vec3 T = vec3(t.x, t.y, 1.0 - t.x - t.y);',
    '    vec3 A = vec3(a.x, a.y, 1.0 - a.x - a.y);',
    '    vec3 B = vec3(b.x, b.y, 1.0 - b.x - b.y);',
    '    vec3 C = vec3(c.x, c.y, 1.0 - c.x - c.y);',
    '    float alen = length(T - A);',
    '    float blen = length(T - B);',
    '    float clen = length(T - C);',
    '    vec2 ch;',
    '    if (alen < blen) {',
    '        if (alen < clen) ch = a;',
    '        else ch = c;',
    '    } else {',
    '        if (blen < clen) ch = b;',
    '        else ch = c;',
    '    }',
    '    ch.x += ch.y * 0.5;',
    '    ch.y *= 0.866025404;',
    '    ch *= tilesize / imgsize;',
    '    return clamp(ch, 0.0, 1.0);',
    '}'
    ].join('\n')
};
function glsl(filter)
{
    var GLSL = FILTER.Util.GLSL, glslcode;
    if (filter.scale <= 1 || !filter.pattern || !PIXELATION[filter.pattern]) return (new GLSL.Filter(filter)).begin().shader(GLSL.DEFAULT).end().code();
    glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform vec2 imgSize;',
    'uniform float tileSize;',
    'uniform int pixelate;',
    PIXELATION['rectangular_glsl'],
    PIXELATION['triangular_glsl'],
    PIXELATION['rhomboidal_glsl'],
    PIXELATION['hexagonal_glsl'],
    'void main(void) {',
        'vec2 p = pix;',
        'if (1 == pixelate) p = triangular(p, imgSize, tileSize);',
        'else if (2 == pixelate) p = rhomboidal(p, imgSize, tileSize);',
        'else if (3 == pixelate) p = hexagonal(p, imgSize, tileSize);',
        'else p = rectangular(p, imgSize, tileSize);',
        'gl_FragColor = vec4(texture2D(img, p).rgb, texture2D(img, pix).a);',
    '}'
    ].join('\n'))
    .input('imgSize', function(filter, w, h) {return [w, h];})
    .input('tileSize', function(filter, w, h) {return sqrt(w*h)*(filter.scale||1)*1e-2;})
    .input('pixelate', function(filter) {
        return 'triangular' === filter.pattern ? 1 : (
            'rhomboidal' === filter.pattern ? 2 : (
            'hexagonal' === filter.pattern ? 3 : 0
            )
        );
    })
    .end();
    return glslcode.code();
}
function wasm()
{
    return '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';
}
}(FILTER);/**
*
* Halftone
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var f1 = 7/16, f2 = 3/16, f3 = 5/16, f4 = 1/16,
    MODE = FILTER.MODE, A32F = FILTER.Array32F, clamp = FILTER.Color.clamp,
    intensity = FILTER.Color.intensity;

// http://en.wikipedia.org/wiki/Halftone
// http://en.wikipedia.org/wiki/Error_diffusion
// http://www.visgraf.impa.br/Courses/ip00/proj/Dithering1/average_dithering.html
// http://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering
FILTER.Create({
    name: "HalftoneFilter"

    // parameters
    ,size: 1
    ,thresh: 0.4
    ,mode: MODE.GRAY
    //,inverse: false

    // this is the filter constructor
    ,init: function(size, threshold, mode/*, inverse*/) {
        var self = this;
        self.size = size || 1;
        self.thresh = clamp(null == threshold ? 0.4 : threshold,0,1);
        self.mode = mode || MODE.GRAY;
        //self.inverse = !!inverse
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,threshold: function(t) {
        this.thresh = clamp(t, 0, 1);
        return this;
    }

    /*,invert: function(bool) {
        if (!arguments.length) bool = true;
        this.inverse = !!bool;
        return this;
    }*/

    ,serialize: function() {
        var self = this;
        return {
             size: self.size
            ,thresh: self.thresh
            //,inverse: self.inverse
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.size = params.size;
        self.thresh = params.thresh;
        //self.inverse = params.inverse;
        return self;
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this, l = im.length, imSize = l>>>2,
            err = new A32F(imSize*3), pixel, index, t, rgb, ycbcr,
            size = self.size, area = size*size, invarea = 1.0/area,
            threshold = 255*self.thresh, size2 = size2<<1,
            colored = MODE.RGB === self.mode, x, y, yw, sw = size*w, i, j, jw,
            sum_r, sum_g, sum_b, r, g, b, qr, qg, qb, qrf, qgf, qbf
            //,inverse = self.inverse,one = inverse?0:255, zero = inverse?255:0
            ,f11 = /*area**/f1, f22 = /*area**/f2
            ,f33 = /*area**/f3, f44 = /*area**/f4
        ;

        for (y=0,yw=0,x=0; y<h;)
        {
            sum_r = sum_g = sum_b = 0;
            if (colored)
            {
                for (i=0,j=0,jw=0; j<size;)
                {
                    pixel = (x+yw+i+jw)<<2; index = (x+yw+i+jw)*3;
                    sum_r += im[pixel  ] + err[index  ];
                    sum_g += im[pixel+1] + err[index+1];
                    sum_b += im[pixel+2] + err[index+2];
                    if (++i >= size) {i=0; ++j; jw+=w;}
                }
                sum_r *= invarea; sum_g *= invarea; sum_b *= invarea;
                t = intensity(sum_r, sum_g, sum_b);
                if (t > threshold)
                {
                    r = sum_r|0; g = sum_g|0; b = sum_b|0;
                }
                else
                {
                    r = 0; g = 0; b = 0;
                }
            }
            else
            {
                for (i=0,j=0,jw=0; j<size;)
                {
                    pixel = (x+yw+i+jw)<<2; index = (x+yw+i+jw)*3;
                    sum_r += im[pixel  ] + err[index  ];
                    if (++i >= size) {i=0; ++j; jw+=w;}
                }
                t = sum_r * invarea;
                if (t > threshold)
                {
                    r = 255; g = 255; b = 255;
                }
                else
                {
                    r = 0; g = 0; b = 0;
                }
            }

            pixel = (x+yw)<<2;
            qr = im[pixel  ] - r;
            qg = im[pixel+1] - g;
            qb = im[pixel+2] - b;

            if (x+size < w)
            {
                qrf = f11*qr; qgf = f11*qg; qbf = f11*qb;
                for (i=size,j=0,jw=0; j<size;)
                {
                    index = (x+yw+i+jw)*3;
                    err[index  ] += qrf;
                    err[index+1] += qgf;
                    err[index+2] += qbf;
                    if (++i >= size2) {i=size; ++j; jw+=w;}
                }
            }
            if (y+size < h && x > size)
            {
                qrf = f22*qr; qgf = f22*qg; qbf = f22*qb;
                for (i=-size,j=size,jw=0; j<size2;)
                {
                    index = (x+yw+i+jw)*3;
                    err[index  ] += qrf;
                    err[index+1] += qgf;
                    err[index+2] += qbf;
                    if (++i >= 0) {i=-size; ++j; jw+=w;}
                }
            }
            if (y+size < h)
            {
                qrf = f33*qr; qgf = f33*qg; qbf = f33*qb;
                for (i=0,j=size,jw=0; j<size2;)
                {
                    index = (x+yw+i+jw)*3;
                    err[index  ] += qrf;
                    err[index+1] += qgf;
                    err[index+2] += qbf;
                    if (++i >= size) {i=0; ++j; jw+=w;}
                }
            }
            if (y+size < h && x+size < w)
            {
                qrf = f44*qr; qgf = f44*qg; qbf = f44*qb;
                for (i=size,j=size,jw=0; j<size2;)
                {
                    index = (x+yw+i+jw)*3;
                    err[index  ] += qrf;
                    err[index+1] += qgf;
                    err[index+2] += qbf;
                    if (++i >= size2) {i=size; ++j; jw+=w;}
                }
            }

            for (i=0,j=0,jw=0; j<size;)
            {
                pixel = (x+yw+i+jw)<<2;
                im[pixel  ] = r;
                im[pixel+1] = g;
                im[pixel+2] = b;
                if (++i >= size) {i=0; ++j; jw+=w;}
            }

            x+=size; if (x >= w) {x=0; y+=size; yw+=sw;}
        }
        return im;
    }
});

}(FILTER);/**
*
* Bokeh (Depth-of-Field)
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var stdMath = Math, Sqrt = stdMath.sqrt,
    Exp = stdMath.exp, Log = stdMath.log,
    Abs = stdMath.abs, Floor = stdMath.floor,
    notSupportClamp = FILTER._notSupportClamp,
    A32F = FILTER.Array32F;

// a simple bokeh (depth-of-field) filter
FILTER.Create({
    name: "BokehFilter"

    // parameters
    ,centerX: 0.0
    ,centerY: 0.0
    ,radius: 10
    ,amount: 10

    // this is the filter constructor
    ,init: function(centerX, centerY, radius, amount) {
        var self = this;
        self.centerX = centerX || 0.0;
        self.centerY = centerY || 0.0;
        self.radius = null == radius ? 10 : radius;
        self.amount = null == amount ? 10 : amount;
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,serialize: function() {
        var self = this;
        return {
             centerX: self.centerX
            ,centerY: self.centerY
            ,radius: self.radius
            ,amount: self.amount
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.centerX = params.centerX;
        self.centerY = params.centerY;
        self.radius = params.radius;
        self.amount = params.amount;
        return self;
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        if (!self._isOn) return im;
        var imLen = im.length, imArea,
            integral, integralLen, colR, colG, colB,
            rowLen, i, j, x , y, ty,
            cX = self.centerX||0, cY = self.centerY||0,
            r = self.radius, m = self.amount,
            d, dx, dy, dm, dM, blur, blurw, wt,
            xOff1, yOff1, xOff2, yOff2,
            p1, p2, p3, p4, t0, t1, t2,
            bx1, bx2, by1, by2;

        if (m <= 0) return im;

        imArea = (imLen>>>2);
        bx1=0; bx2=w-1; by1=0; by2=imArea-w;

        // make center relative
        cX = Floor(cX*(w-1));
        cY = Floor(cY*(h-1));

        integralLen = (imArea<<1)+imArea;  rowLen = (w<<1)+w;
        integral = new A32F(integralLen);

        // compute integral of image in one pass
        // first row
        i=0; j=0; x=0; colR=colG=colB=0;
        for (x=0; x<w; ++x, i+=4, j+=3)
        {
            colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
            integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
        }
        // other rows
        i=rowLen+w; j=0; x=0; colR=colG=colB=0;
        for (i=rowLen+w; i<imLen; i+=4, j+=3, ++x)
        {
            if (x>=w) {x=0; colR=colG=colB=0;}
            colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
            integral[j+rowLen]=integral[j]+colR;
            integral[j+rowLen+1]=integral[j+1]+colG;
            integral[j+rowLen+2]=integral[j+2]+colB;
        }


        // bokeh (depth-of-field) effect
        // is a kind of adaptive blurring depending on distance from a center
        // like the camera/eye is focused on a specific area and everything else appears increasingly blurred

        x=0; y=0; ty=0;
        for (i=0; i<imLen; i+=4, ++x)
        {
            // update image coordinates
            if (x>=w) {x=0; ++y; ty+=w;}

            // compute distance
            dx = Abs(x-cX); dy = Abs(y-cY);
            //d = Sqrt(dx*dx + dy*dy);
            dM = stdMath.max(dx, dy);
            dm = stdMath.min(dx, dy);
            d = dM ? dM*(1 + 0.43*dm/dM*dm/dM) : 0;  // approximation

            // calculate amount(radius) of blurring
            // depending on distance from focus center
            blur = d>r ? Log((d-r)*m)|0 : (d/r+0.5)|0; // smooth it a bit, around the radius edge condition

            if (blur > 0)
            {
                 blurw = blur*w; wt = 0.25/(blur*blur);

                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                xOff1 = x - blur; yOff1 = ty - blurw;
                xOff2 = x + blur; yOff2 = ty + blurw;

                // fix borders
                if (xOff1<bx1) xOff1=bx1;
                else if (xOff2>bx2) xOff2=bx2;
                if (yOff1<by1) yOff1=by1;
                else if (yOff2>by2) yOff2=by2;

                // compute integral positions
                p1 = xOff1 + yOff1; p4 = xOff2 + yOff2; p2 = xOff2 + yOff1; p3 = xOff1 + yOff2;
                // arguably faster way to write p1*=3; etc..
                p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;

                // apply a fast box-blur to these pixels
                // compute matrix sum of these elements
                // (trying to avoid possible overflow in the process, order of summation can matter)
                t0 = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                t1 = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                t2 = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);

                // output
                if (notSupportClamp)
                {
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                }
                im[i] = t0|0;  im[i+1] = t1|0;  im[i+2] = t2|0;
                // alpha channel is not transformed
                //im[i+3] = im[i+3];
            }
        }
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Drop Shadow Filter
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MODE = FILTER.MODE,
    boxKernel_3x3 = new FILTER.ConvolutionMatrix([
    1/9,1/9,1/9,
    1/9,1/9,1/9,
    1/9,1/9,1/9
    ]),
    stdMath = Math, IMG = FILTER.ImArray,
    FilterUtil = FILTER.Util.Filter,
    ImageUtil = FILTER.Util.Image,
    GLSL = FILTER.Util.GLSL;

// adapted from http://www.jhlabs.com/ip/filters/
// analogous to ActionScript filter
FILTER.Create({
     name: "DropShadowFilter"

    // parameters
    ,offsetX: null
    ,offsetY: null
    ,color: 0
    ,opacity: 1
    ,quality: 1
    ,pad: true
    ,onlyShadow: false

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    // constructor
    ,init: function(offsetX, offsetY, color, opacity, quality, pad, onlyShadow) {
        var self = this;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        self.color = color || 0;
        self.opacity = null == opacity ? 1.0 : +opacity;
        self.quality = (quality || 1)|0;
        self.pad = null == pad ? true : !!pad;
        self.onlyShadow = !!onlyShadow;
    }

    ,dispose: function() {
        var self = this;
        self.offsetX = null;
        self.offsetY = null;
        self.color = null;
        self.opacity = null;
        self.quality = null;
        self.pad = null;
        self.onlyShadow = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             offsetX: self.offsetX
            ,offsetY: self.offsetY
            ,color: self.color
            ,opacity: self.opacity
            ,quality: self.quality
            ,pad: self.pad
            ,onlyShadow: self.onlyShadow
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.offsetX = params.offsetX;
        self.offsetY = params.offsetY;
        self.color = params.color;
        self.opacity = params.opacity;
        self.quality = params.quality;
        self.pad = params.pad;
        self.onlyShadow = params.onlyShadow;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this;
        self.hasMeta = false;
        if (!self._isOn) return im;
        var max = stdMath.max, color = self.color||0,
            a = self.opacity, quality = self.quality,
            pad = self.pad, onlyShadow = self.onlyShadow,
            offX = self.offsetX||0, offY = self.offsetY||0,
            r, g, b, imSize = im.length, imArea = imSize>>>2, shSize = imSize,
            i, x, y, sw = w, sh = h, sx, sy, si, ai, aa, shadow;

        if (0.0 > a) a = 0.0;
        if (1.0 < a) a = 1.0;
        if (0.0 === a) return im;

        r = (color>>>16)&255; g = (color>>>8)&255; b = (color)&255;

        if (0 >= quality) quality = 1;
        if (3 < quality) quality = 3;

        shadow = new IMG(shSize);

        // generate shadow from image alpha channel
        var maxx = 0, maxy = 0;
        for (i=0,x=0,y=0; i<shSize; i+=4,++x)
        {
            if (x >= sw) {x=0; ++y;}
            ai = im[i+3];
            if (ai > 0)
            {
                shadow[i  ] = r;
                shadow[i+1] = g;
                shadow[i+2] = b;
                shadow[i+3] = (a*ai)|0;
                maxx = max(maxx, x);
                maxy = max(maxy, y);
            }
            else
            {
                shadow[i  ] = 0;
                shadow[i+1] = 0;
                shadow[i+2] = 0;
                shadow[i+3] = 0;
            }
        }

        // blur shadow, quality is applied multiple times for smoother effect
        shadow = FilterUtil.integral_convolution(r===g && g===b ? MODE.GRAY : MODE.RGB, shadow, w, h, 2, boxKernel_3x3, null, 3, 3, 1.0, 0.0, quality);

        // pad image to fit whole offseted shadow
        maxx += offX; maxy += offY;
        if (pad && (maxx >= w || maxx < 0 || maxy >= h || maxy < 0))
        {
            var pad_left = maxx < 0 ? -maxx : 0, pad_right = maxx >= w ? maxx-w : 0,
                pad_top = maxy < 0 ? -maxy : 0, pad_bot = maxy >= h ? maxy-h : 0;
            if (onlyShadow) im = new IMG(((w + pad_left + pad_right)*(h + pad_top + pad_bot)) << 2);
            else im = ImageUtil.pad(im, w, h, pad_right, pad_bot, pad_left, pad_top);
            w += pad_left + pad_right; h += pad_top + pad_bot;
            imArea = w * h; imSize = imArea << 2;
            self.hasMeta = true;
            self.meta = {_IMG_WIDTH: w, _IMG_HEIGHT: h};
        }
        else if (pad && onlyShadow)
        {
            im = new IMG(imSize);
        }
        // offset and combine with original image
        offY *= w;
        if (onlyShadow)
        {
            // return only the shadow
            for (x=0,y=0,si=0; si<shSize; si+=4,++x)
            {
                if (x >= sw) {x=0; y+=w;}
                sx = x+offX; sy = y+offY;
                if (0 > sx || sx >= w || 0 > sy || sy >= imArea /*|| 0 === shadow[si+3]*/) continue;
                i = (sx + sy) << 2;
                im[i  ] = shadow[si  ]; im[i+1] = shadow[si+1]; im[i+2] = shadow[si+2]; im[i+3] = shadow[si+3];
            }
        }
        else
        {
            // return image with shadow
            for (x=0,y=0,si=0; si<shSize; si+=4,++x)
            {
                if (x >= sw) {x=0; y+=w;}
                sx = x+offX; sy = y+offY;
                if (0 > sx || sx >= w || 0 > sy || sy >= imArea) continue;
                i = (sx + sy) << 2; ai = im[i+3]; a = shadow[si+3];
                if ((255 === ai) || (0 === a)) continue;
                a /= 255; //ai /= 255; //aa = ai + a*(1.0-ai);
                // src over composition
                // https://en.wikipedia.org/wiki/Alpha_compositing
                /*im[i  ] = (im[i  ]*ai + shadow[si  ]*a*(1.0-ai))/aa;
                im[i+1] = (im[i+1]*ai + shadow[si+1]*a*(1.0-ai))/aa;
                im[i+2] = (im[i+2]*ai + shadow[si+2]*a*(1.0-ai))/aa;*/
                //im[i+3] = aa*255;
                r = im[i  ] + (shadow[si  ]-im[i  ])*a;
                g = im[i+1] + (shadow[si+1]-im[i+1])*a;
                b = im[i+2] + (shadow[si+2]-im[i+2])*a;
                im[i  ] = r|0; im[i+1] = g|0; im[i+2] = b|0;
            }
        }
        return im;
    }
});

function glsl(filter)
{
    var matrix_code = function(m, dx, dy, f, b) {
        var def = [], calc = [],
            k, i, j, matArea = m.length,
            rx = dx>>>1, ry = dy>>>1,
            toFloat = GLSL.formatFloat;
        def.push('vec4 col=texture2D(img,  pix);');
        i=-rx; j=-ry; k=0;
        while (k<matArea)
        {
            if (m[k])
            {
                if (i || j)
                {
                    def.push('vec2 p'+k+'=vec2(pix.x'+toFloat(i, 1)+'*dp.x, pix.y'+toFloat(j, 1)+'*dp.y); vec3 c'+k+'=vec3(0.0); if (0.0 <= p'+k+'.x && 1.0 >= p'+k+'.x && 0.0 <= p'+k+'.y && 1.0 >= p'+k+'.y) c'+k+'=texture2D(img,  p'+k+').rgb;');
                }
                else
                {
                    def.push('vec3 c'+k+'=col.rgb;');
                }
                calc.push(toFloat(m[k], calc.length)+'*c'+k);
            }
            ++k; ++i; if (i>rx) {i=-rx; ++j;}
        }
        return [def.join('\n'), 'vec4(('+toFloat(f||1)+'*('+calc.join('')+')+vec3('+toFloat(b||0)+')),col.a)'];
    };
    var code = matrix_code(boxKernel_3x3, 3, 3, 1, 0);
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform vec2 wh;',
    'uniform vec2 nwh;',
    'uniform float pad_right;',
    'uniform float pad_bot;',
    'uniform float pad_left;',
    'uniform float pad_top;',
    ImageUtil.glsl()['pad'],
    'void main(void) {',
    '    gl_FragColor = pad(pix, img, wh, nwh, pad_right, pad_bot, pad_left, pad_top);',
    '}'
    ].join('\n'), function() {return filter.pad ? 1 : 0;})
    .dimensions(function(w, h) {return [w+stdMath.abs(filter.offsetX||0), h+stdMath.abs(filter.offsetY||0)];})
    .input('wh', function(filter, nw, nh, w, h) {return [w, h];})
    .input('nwh', function(filter, nw, nh, w, h) {return [nw, nh];})
    .input('pad_right', function(filter) {return (filter.offsetX||0) > 0 ? (filter.offsetX||0) : 0;})
    .input('pad_bot', function(filter) {return (filter.offsetY||0) > 0 ? (filter.offsetY||0) : 0;})
    .input('pad_left', function(filter) {return (filter.offsetX||0) < 0 ? -(filter.offsetX||0) : 0;})
    .input('pad_top', function(filter) {return (filter.offsetY||0) < 0 ? -(filter.offsetY||0) : 0;})
    .end()
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform vec4 c;',
    'void main(void) {',
    '   vec4 im = texture2D(img, pix);',
    '   gl_FragColor = im.a > 0.0 ? vec4(c.rgb, c.a*im.a) : vec4(0.0);',
    '}'
    ].join('\n'))
    .save('image')
    .input('c', function(filter) {
        var color = filter.color || 0;
        return [((color>>>16)&255)/255, ((color>>>8)&255)/255, ((color)&255)/255, stdMath.min(stdMath.max(filter.opacity, 0.0), 1.0)];
    })
    .end()
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform vec2 dp;',
    'void main(void) {',
    code[0],
    'gl_FragColor = '+code[1]+';',
    '}'
    ].join('\n'), function() {return stdMath.min(stdMath.max(filter.quality, 1), 3);})
    .end()
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform vec2 offset;',
    'uniform int onlyShadow;',
    'uniform sampler2D shadow;',
    'uniform sampler2D image;',
    'void main(void) {',
    '   vec2 pixo = pix - offset;',
    '   vec4 sh = pixo.x < 0.0 || pixo.y < 0.0 ? vec4(0.0) : texture2D(shadow, pixo);',
    '   vec4 im = onlyShadow ? vec4(0.0) : texture2D(image, pix);',
    '   if (1 == onlyShadow)',
    '   {',
    '       gl_FragColor = sh;',
    '   }',
    '   else',
    '   {',
    '       if ((1.0 == im.a) || (0.0 == sh.a)) gl_FragColor = im;',
    '       else gl_FragColor = vec4(mix(im.rgb, sh.rgb, sh.a), im.a);',
    '   }',
    '}'
    ].join('\n'))
    .input('offset', function(filter, w, h) {return [(filter.offsetX||0)/w, (filter.offsetY||0)/h];})
    .input('onlyShadow', function(filter) {return filter.onlyShadow ? 1 : 0;})
    .input('shadow', true)
    .input('image')
    .end();
    return glslcode.code();
}

}(FILTER);/**
*
* Seamless Tile Plugin
* @package FILTER.js
*
**/
!function(FILTER) {
"use strict";

var stdMath = Math, GLSL = FILTER.Util.GLSL, ImageUtil = FILTER.Util.Image;

// a plugin to create a seamless tileable pattern from an image
// adapted from: http://www.blitzbasic.com/Community/posts.php?topic=43846
FILTER.Create({
    name: "SeamlessTileFilter"

    ,type: 2 // 0 radial, 1 linear 1, 2 linear 2

    // constructor
    ,init: function(mode) {
        var self = this;
        self.type = null == mode ? 2 : (mode||0);
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,serialize: function() {
        var self = this;
        return {
            type: self.type
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.type = params.type;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    // this is the filter actual apply method routine
    // adapted from: http://www.blitzbasic.com/Community/posts.php?topic=43846
    ,apply: function(im, w, h) {
        var self = this,
            resize = (self._runWASM ? (ImageUtil.wasm||ImageUtil) : ImageUtil).interpolate,
            //needed arrays
            tile, diagonal, mask,
            a1, a2, a3, i, j, w2, h2,
            index, indexd, N, N2, imSize;

        //find largest side of the image
        //and resize the image to become square
        //if (w !== h) im = resize(im, w, h, N = w > h ? w : h, N);
        //else  N = w;
        //N2 = stdMath.round(N/2);
        w2 = stdMath.round(w/2);
        h2 = stdMath.round(h/2);
        imSize = im.length;
        tile = new FILTER.ImArray(imSize);
        //diagonal = getdiagonal(im, N, N2);
        mask = getmask(self.type, w, h, w2, h2);

        //Create the tile
        for (j=0,i=0; j<h; ++i)
        {
            if (i >= w) {i=0; ++j;}
            index = i+j*w;
            indexd = ((i+w2) % w) + ((j+h2) % h)*w;
            a1 = mask[index]; a2 = mask[indexd];
            a3 = a1+a2; a1 /= a3; a2 /= a3;
            index <<= 2; indexd <<= 2;
            tile[index  ] = ~~(a1*im[index  ] + a2*im[indexd  ]/*diagonal[index  ]*/);
            tile[index+1] = ~~(a1*im[index+1] + a2*im[indexd+1]/*diagonal[index+1]*/);
            tile[index+2] = ~~(a1*im[index+2] + a2*im[indexd+2]/*diagonal[index+2]*/);
            tile[index+3] = im[index+3];
        }

        //create the new tileable image
        //if it wasn't a square image, resize it back to the original scale
        //if (w !== h) tile = resize(tile, N, N, w, h);

        // return the new image data
        return tile;
    }
});

/*function getdiagonal(im, N, N2)
{
    var imSize = im.length,
        diagonal = new FILTER.ImArray(imSize),
        i, j, k, index;

    for (i=0,j=0,k=0; k<imSize; k+=4,++i)
    {
        if (i >= N) {i=0; ++j;}
        index = ((i+N2)%N + ((j+N2)%N)*N)<<2;
        diagonal[index  ] = im[k  ];
        diagonal[index+1] = im[k+1];
        diagonal[index+2] = im[k+2];
        diagonal[index+3] = im[k+3];
    }
    return diagonal;
}*/
function getmask(masktype, w, h, w2, h2)
{
    var size = w*h, mask = new FILTER.Array8U(size),
        length = FILTER.Util.Math.hypot, i, j, d, NN;
    //try to make your own masktypes here
    if (0 === masktype) //RADIAL
    {
        //Create the mask
        NN = stdMath.sqrt(w2*h2);
        for (i=0,j=0; i<w2; ++j)
        {
            if (j >= h2) {j=0; ++i;}

            //Scale d To range from 1 To 255
            d = 255 - (255 / NN * length((w2 - i), (h2 - j)));
            d = ~~(d < 1 ? 1 : (d > 255 ? 255 : d));

            //Form the mask in Each quadrant
            mask[i     + j*w      ] = d;
            mask[i     + (h-1-j)*w] = d;
            mask[w-1-i + j*w      ] = d;
            mask[w-1-i + (h-1-j)*w] = d;
        }
    }
    else if (1 === masktype) //LINEAR 1
    {
        //Create the mask
        for (i=0,j=0; i<w2; ++j)
        {
            if (j >= h2) {j=0; ++i;}

            //Scale d To range from 1 To 255
            d = 255 - (255 * (j < i ? ((h2 - j)/h2) : ((w2 - i)/w2)));
            d = ~~(d < 1 ? 1 : (d > 255 ? 255 : d));

            //Form the mask in Each quadrant
            mask[i     + j*w      ] = d;
            mask[i     + (h-1-j)*w] = d;
            mask[w-1-i + j*w      ] = d;
            mask[w-1-i + (h-1-j)*w] = d;
        }
    }
    else //if (2 === masktype) //LINEAR 2
    {
        //Create the mask
        NN = stdMath.sqrt(w*h);
        for (i=0,j=0; i<w2; ++j)
        {
            if (j >= h2) {j=0; ++i;}

            //Scale d To range from 1 To 255
            d = 255 - (255 / (1.13*NN) * (/*j < i ? length(N - j, N - i) :*/ length((w - i), (h - j))));
            d = ~~(d < 1 ? 1 : (d > 255 ? 255 : d));

            //Form the mask in Each quadrant
            mask[i     + j*w      ] = d;
            mask[i     + (h-1-j)*w] = d;
            mask[w-1-i + j*w      ] = d;
            mask[w-1-i + (h-1-j)*w] = d;
        }
    }
    return mask;
}
function glsl(filter)
{
    var glslcode = (new GLSL.Filter(filter))
    /*.begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform vec2 wh;',
    'uniform vec2 nwh;',
    ImageUtil.glsl()['interpolate'],
    'void main(void) {',
    '   gl_FragColor = interpolate(pix, img, wh, nwh);',
    '}'
    ].join('\n'), 1, 'resize')
    .dimensions(function(w, h, io) {io.w = w; io.h = h; w = stdMath.max(w, h); return [w, w];})
    .input('wh', function(filter, nw, nh, w, h) {return [w, h];})
    .input('nwh', function(filter, nw, nh, w, h) {return [nw, nh];})
    .output('image')
    .end()*/
    /*.begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'vec4 diagonal(vec2 pix, sampler2D img) {',
    '   vec2 ij = pix - vec2(0.5);',
    '   if (ij.x < 0.0) ij.x += 1.0;',
    '   if (ij.y < 0.0) ij.y += 1.0;',
    '   return texture2D(img, ij);',
    '}',
    'void main(void) {',
    '   gl_FragColor = diagonal(pix, img);',
    '}'
    ].join('\n'))
    .output('diagonal')
    .end()*/
    /*.begin()
    .shader([
    'varying vec2 pix;',
    'uniform vec2 wh;',
    'uniform float NN;',
    'uniform int masktype;',
    'vec4 mask(vec2 pix, float w, float h, NN, int masktype) {',
    '   vec2 ij = vec2(pix.x, pix.y);',
    '   //float NN = sqrt(wh.x*wh.y);',
    '   float d = 0.0;',
    '   if (ij.x > 0.5) ij.x = 1.0 - ij.x;',
    '   if (ij.y > 0.5) ij.y = 1.0 - ij.y;',
    '   if (0 == masktype) //RADIAL',
    '   {',
    '       d = 1.0 - length(wh*(vec2(0.5) - ij)) * 2.0 / NN;',
    '   }',
    '   else if (1 == masktype) //LINEAR 1',
    '   {',
    '       d = 1.0 - (ij.y < ij.x ? (0.5 - ij.y) : (0.5 - ij.x)) * 2.0;',
    '   }',
    '   else //if (2 == masktype) //LINEAR 2',
    '   {',
    '       d = 1.0 - (/*ij.y < ij.x ? length(wh*(vec2(1.0) - ij)) :* / length(wh*(vec2(1.0) - ij))) / (1.13*NN);',
    '   }',
    '   return vec4(clamp(d, 0.003921569/*1/255* /, 1.0));',
    '}',
    'void main(void) {',
    '   gl_FragColor = mask(pix, N, masktype);',
    '}'
    ].join('\n'))
    .input('wh', function(filter, w, h) {return [w, h];})
    .input('NN', function(filter, w, h) {return stdMath.sqrt(w*h);})
    .input('masktype', function(filter) {return filter.type;})
    //.output('mask')
    .end()*/
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform vec2 wh;',
    'uniform float NN;',
    'uniform int masktype;',
    'uniform sampler2D img;',
    '/*uniform sampler2D diagonal;*/',
    'vec4 mask(vec2 pix, vec2 wh, float NN, int masktype) {',
    '   vec2 ij = vec2(pix.x, pix.y);',
    '   float d = 0.0;',
    '   if (ij.x > 0.5) ij.x = 1.0 - ij.x;',
    '   if (ij.y > 0.5) ij.y = 1.0 - ij.y;',
    '   if (0 == masktype) //RADIAL',
    '   {',
    '       d = 1.0 - length(wh*(vec2(0.5) - ij)) * 2.0 / NN;',
    '   }',
    '   else if (1 == masktype) //LINEAR 1',
    '   {',
    '       d = 1.0 - (ij.y < ij.x ? (0.5 - ij.y) : (0.5 - ij.x)) * 2.0;',
    '   }',
    '   else //if (2 == masktype) //LINEAR 2',
    '   {',
    '       d = 1.0 - (/*ij.y < ij.x ? length(wh*(vec2(1.0) - ij)) :*/ length(wh*(vec2(1.0) - ij))) / (1.13*NN);',
    '   }',
    '   return vec4(clamp(d, 0.003921569/*1/255*/, 1.0));',
    '}',
    'void main(void) {',
    '   vec4 im = texture2D(img, pix);',
    '   vec2 pixd = pix - vec2(0.5);',
    '   if (pixd.x < 0.0) pixd.x += 1.0;',
    '   if (pixd.y < 0.0) pixd.y += 1.0;',
    '   vec2 pixm = pix + vec2(0.5);',
    '   if (pixm.x > 1.0) pixm.x -= 1.0;',
    '   if (pixm.y > 1.0) pixm.y -= 1.0;',
    '   float a1 = mask(pix, wh, NN, masktype).a;',
    '   float a2 = mask(pixm, wh, NN, masktype).a;',
    '   gl_FragColor = vec4(mix(im.rgb, /*texture2D(diagonal, pix)*/texture2D(img, pixd).rgb, a2/(a1+a2)), im.a);',
    '}'
    ].join('\n'))
    .input('wh', function(filter, w, h) {return [w, h];})
    .input('NN', function(filter, w, h) {return stdMath.sqrt(w*h);})
    .input('masktype', function(filter) {return filter.type;})
    //.input('diagonal')
    .end()
    /*.begin()
    .shader('resize')
    .dimensions(function(w, h, io) {return [io.w, io.h];})
    .input('wh', function(filter, nw, nh, w, h) {return [w, h];})
    .input('nwh', function(filter, nw, nh, w, h) {return [nw, nh];})
    .end()*/;
    return glslcode.code();
}

}(FILTER);/**
*
* FloodFill, PatternFill
* @package FILTER.js
*
**/
!function(FILTER) {
"use strict";

var MODE = FILTER.MODE, stdMath = Math, FilterUtil = FILTER.Util.Filter;

// an extended and fast flood fill and flood pattern fill filter using scanline algorithm
// adapted from: A Seed Fill Algorithm, by Paul Heckbert from "Graphics Gems", Academic Press, 1990
// http://en.wikipedia.org/wiki/Flood_fill
FILTER.Create({
    name : "ColorFillFilter"
    ,x: 0
    ,y: 0
    ,color: null
    ,border: null
    ,tolerance: 1e-6
    ,mode: MODE.COLOR

    ,path: FILTER.Path

    ,init: function(x, y, color, tolerance, border) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.color = color || 0;
        self.tolerance = null == tolerance ? 1e-6 : +tolerance;
        self.border = null != border ? border||0 : null;
        self.mode = MODE.COLOR;
    }

    ,serialize: function() {
        var self = this, isfunc = 'function' === typeof self.color;
        return {
             isfunc: isfunc
            ,color: isfunc ? self.color.toString() : self.color
            ,border: self.border
            ,x: self.x
            ,y: self.y
            ,tolerance: self.tolerance
        };
    }

    ,unserialize: function(params) {
        var self = this;
        if (params.isfunc) self.color = (new Function('FILTER', 'return '+params.color+';'))(FILTER);
        else self.color = params.color;
        self.border = params.border;
        self.x = params.x;
        self.y = params.y;
        self.tolerance = params.tolerance;
        return self;
    }

    ,apply: function(im, w, h) {
        var self = this, mode = self.mode || MODE.COLOR,
            color = self.color||0, border = self.border, exterior = null != border,
            x0 = self.x||0, y0 = self.y||0, x, y, yy, x1, y1, x2, y2, k, i, l,
            r, g, b, a, r0, g0, b0, rb, gb, bb, col, dist, D0, D1, region, box, mask, block_mask,
            RGB2HSV = FILTER.Color.RGB2HSV, HSV2RGB = FILTER.Color.HSV2RGB,
            c, isfunc = 'function' === typeof color;

        if (x0 < 0 || x0 >= w || y0 < 0 || y0 >= h) return im;

        if (!isfunc)
        {
            r = (color>>>16)&255; g = (color>>>8)&255; b = color&255;
        }
        x0 = x0<<2; y0 = (y0*w)<<2; i = x0+y0;
        r0 = im[i]; g0 = im[i+1]; b0 = im[i+2]; D0 = 0; D1 = 1;
        if (exterior)
        {
           rb = (border>>>16)&255; gb = (border>>>8)&255; bb = (border)&255;
           if (r0 === rb && g0 === gb && b0 === bb) return im;
           r0 = rb; g0 = gb; b0 = bb; D0 = 1; D1 = 0;
        }
        else if (MODE.COLOR === mode && !isfunc && r0 === r && g0 === g && b0 === b)
        {
            return im;
        }

        /* seems to have issues when tolerance is exactly 1.0 */
        dist = dissimilarity_rgb(r0, g0, b0, D0, D1, 255*(self.tolerance>=1.0 ? 0.999 : self.tolerance));
        region = flood_region(im, w, h, 2, dist, 8, x0, y0);
        // mask is a packed bit array for efficiency
        mask = region.mask;

        if ((MODE.MASK === mode) || (MODE.COLORMASK === mode))
        {
            // MODE.MASK returns the region mask, rest image is put blank
            block_mask = MODE.MASK === mode;
            x=0; y=yy=0;
            for (i=0,l=im.length; i<l; i+=4,++x)
            {
                if (x>=w) {x=0; ++yy; y+=w;}
                k = x+y;
                if (mask[k>>>5]&(1<<(k&31)))
                {
                    // use mask color
                    if (block_mask)
                    {
                        if (isfunc)
                        {
                            c = color(x, yy);
                            r = c[0]; g = c[1]; b = c[2];
                            a = 3 < c.length ? c[3] : im[i+3]
                        }
                        else
                        {
                            a = im[i+3];
                        }
                        im[i  ] = r;
                        im[i+1] = g;
                        im[i+2] = b;
                        im[i+3] = a;
                    }
                    // else leave original color
                }
                else
                {
                    im[i  ] = 0; im[i+1] = 0; im[i+2] = 0;
                }
            }
        }
        else if (MODE.HUE === mode)
        {
            // MODE.HUE enables to fill/replace color gradients in a connected region
            box = region.box;
            x1 = box[0]>>>2; y1 = box[1]>>>2; x2 = box[2]>>2; y2 = box[3]>>>2;
            col = new A32F(3);

            for (x=x1,y=y1,yy=y/w; y<=y2;)
            {
                k = x+y;
                if (mask[k>>>5]&(1<<(k&31)))
                {
                    i = k << 2;
                    col[0] = im[i  ];
                    col[1] = im[i+1];
                    col[2] = im[i+2];
                    RGB2HSV(col, 0, 1);
                    if (isfunc)
                    {
                        c = color(x, yy);
                    }
                    else
                    {
                        c = color;
                    }
                    col[0] = c;
                    HSV2RGB(col, 0, 1);
                    im[i  ] = col[0]|0;
                    im[i+1] = col[1]|0;
                    im[i+2] = col[2]|0;
                }
                if (++x > x2) {x=x1; ++yy; y+=w;}
            }
        }
        else //if (MODE.COLOR === mode)
        {
            // fill/replace color in region
            box = region.box;
            x1 = box[0]>>>2; y1 = box[1]>>>2; x2 = box[2]>>2; y2 = box[3]>>>2;
            for (x=x1,y=y1,yy=y/w; y<=y2;)
            {
                k = x+y;
                if (mask[k>>>5]&(1<<(k&31)))
                {
                    i = k << 2;
                    if (isfunc)
                    {
                        c = color(x, yy);
                        r = c[0]; g = c[1]; b = c[2];
                        a = 3 < c.length ? c[3] : im[i+3]
                    }
                    else
                    {
                        a = im[i+3];
                    }
                    im[i  ] = r;
                    im[i+1] = g;
                    im[i+2] = b;
                    im[i+3] = a;
                }
                if (++x > x2) {x=x1; ++yy; y+=w;}
            }
        }
        // return the new image data
        return im;
    }
});
FILTER.FloodFillFilter = FILTER.ColorFillFilter;

FILTER.Create({
    name : "PatternFillFilter"
    ,x: 0
    ,y: 0
    ,offsetX: 0
    ,offsetY: 0
    ,tolerance: 1e-6
    ,border: null
    ,mode: MODE.TILE
    ,hasInputs: true

    ,path: FILTER.Path

    ,init: function(x, y, pattern, offsetX, offsetY, tolerance, border) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        if (pattern) self.setInput("pattern", pattern);
        self.tolerance = null == tolerance ? 1e-6 : +tolerance;
        self.border = null != border ? border||0 : null;
        self.mode = MODE.TILE;
    }

    ,dispose: function() {
        var self = this;
        self.x = null;
        self.y = null;
        self.offsetX = null;
        self.offsetY = null;
        self.tolerance = null;
        self.border = null;
        self.$super('dispose');
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             x: self.x
            ,y: self.y
            ,offsetX: self.offsetX
            ,offsetY: self.offsetY
            ,tolerance: self.tolerance
            ,border: self.border
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.x = params.x;
        self.y = params.y;
        self.offsetX = params.offsetX;
        self.offsetY = params.offsetY;
        self.tolerance = params.tolerance;
        self.border = params.border;
        return self;
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this, x0 = self.x||0, y0 = self.y||0, Pat;

        if (x0 < 0 || x0 >= w || y0 < 0 || y0 >= h) return im;
        Pat = self.input("pattern"); if (!Pat) return im;

        var mode = self.mode||MODE.TILE, border = self.border, exterior = null != border, delta,
            pattern = Pat[0], pw = Pat[1], ph = Pat[2], px0 = self.offsetX||0, py0 = self.offsetY||0,
            r0, g0, b0, rb, gb, bb, x, y, k, i, pi, px, py, x1, y1, x2, y2, sx, sy,
            dist, D0, D1, region, box, mask, yy;

        x0 = x0<<2; y0 = (y0*w)<<2; i = x0+y0;
        r0 = im[i]; g0 = im[i+1]; b0 = im[i+2]; D0 = 0; D1 = 1;
        if (exterior)
        {
           rb = (border>>>16)&255; gb = (border>>>8)&255; bb = (border)&255;
           if (r0 === rb && g0 === gb && b0 === bb) return im;
           r0 = rb; g0 = gb; b0 = bb; D0 = 1; D1 = 0;
        }

        /* seems to have issues when tolerance is exactly 1.0 */
        dist = dissimilarity_rgb(r0, g0, b0, D0, D1, 255*(self.tolerance>=1.0 ? 0.999 : self.tolerance));
        region = flood_region(im, w, h, 2, dist, 8, x0, y0);
        // mask is a packed bit array for efficiency
        mask = region.mask; box = region.box;
        x1 = box[0]>>>2; y1 = box[1]>>>2; x2 = box[2]>>>2; y2 = box[3]>>>2;

        if (MODE.STRETCH === mode)
        {
            // MODE.STRETCH stretches (rescales) pattern to fit and fill region
            sx = pw/(x2-x1+1); sy = ph/(y2-y1+w);
            for (x=x1,y=y1; y<=y2;)
            {
                k = x+y;
                if (mask[k>>>5]&(1<<(k&31)))
                {
                    i = k << 2;
                    // stretch here
                    px = (sx*(x-x1))|0;
                    py = (sy*(y-y1))|0;
                    // pattern fill here
                    pi = (px + py*pw) << 2;
                    im[i  ] = pattern[pi  ];
                    im[i+1] = pattern[pi+1];
                    im[i+2] = pattern[pi+2];
                }
                if (++x > x2) {x=x1; y+=w;}
            }
        }
        else //if (MODE.TILE === mode)
        {
            // MODE.TILE tiles (repeats) pattern to fit and fill region
            while (0 > px0) px0 += pw;
            while (0 > py0) py0 += ph;
            x2 = x2-x1+1;
            for (x=0,y=0,yy=y1; yy<=y2;)
            {
                k = x+x1 + yy;
                if (mask[k>>>5]&(1<<(k&31)))
                {
                    i = k << 2;
                    // tile here
                    px = (x + px0) % pw;
                    py = (y + py0) % ph;
                    // pattern fill here
                    pi = (px + py*pw) << 2;
                    im[i  ] = pattern[pi  ];
                    im[i+1] = pattern[pi+1];
                    im[i+2] = pattern[pi+2];
                }
                if (++x >= x2) {x=0; yy+=w; ++y;}
            }
        }
        // return the new image data
        return im;
    }
});

var A32I = FILTER.Array32I, A32U = FILTER.Array32U, A32F = FILTER.Array32F, A8U = FILTER.Array8U,
    ceil = stdMath.ceil, min = stdMath.min, max = stdMath.max, abs = stdMath.abs;

function dissimilarity_rgb(r, g, b, O, I, delta)
{
    //"use asm";
    O = O|0; I = I|0; delta = delta|0;
    // a fast rgb (dis-)similarity matrix
    var D = new A8U(256), c = 0;
    // full loop unrolling
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    D[c] = ((abs(b-c)<=delta?O:I)<<2)|((abs(g-c)<=delta?O:I)<<1)|((abs(r-c)<=delta?O:I)<<0); ++c;
    return D;
}
// adapted from: A Seed Fill Algorithm, by Paul Heckbert from "Graphics Gems", Academic Press, 1990
// http://www.codeproject.com/Articles/6017/QuickFill-An-efficient-flood-fill-algorithm
// http://www.codeproject.com/Articles/16405/Queue-Linear-Flood-Fill-A-Fast-Flood-Fill-Algorith
function flood_region(im, w, h, stride, D, K, x0, y0)
{
    stride = stride|0;
    var imLen = im.length, imSize = imLen>>>stride, xm, ym, xM, yM,
        y, yy, dx = 1<<stride, dy = w<<stride,
        ymin = 0, ymax = imLen-dy, xmin = 0, xmax = (w-1)<<stride,
        l, i, k, x, x1, x2, yw, stack, slen, notdone, labeled, diff;

    xm = x0; ym = y0; xM = x0; yM = y0;
    // mask is a packed bit array for efficiency
    labeled = new A32U(ceil(imSize/32));
    stack = new A32I(imSize<<2); slen = 0; // pre-allocate and soft push/pop for speed

    k = (x0+y0)>>>stride; labeled[k>>>5] |= 1<<(k&31);
    if (y0+dy >= ymin && y0+dy <= ymax)
    {
        /* needed in some cases */
        stack[slen  ]=y0;
        stack[slen+1]=x0;
        stack[slen+2]=x0;
        stack[slen+3]=dy;
        slen += 4;
    }
    /*if ( y0 >= ymin && y0 <= ymax)*/
    /* seed segment (popped 1st) */
    stack[slen  ]=y0+dy;
    stack[slen+1]=x0;
    stack[slen+2]=x0;
    stack[slen+3]=-dy;
    slen += 4;

    if (stride)
    {
        while (0 < slen)
        {
            /* pop segment off stack and fill a neighboring scan line */
            slen -= 4;
            dy = stack[slen+3];
            yw = stack[slen  ]+dy;
            x1 = stack[slen+1];
            x2 = stack[slen+2];
            ym = min(ym, yw); yM = max(yM, yw);
            xm = min(xm, x1); xM = max(xM, x2);

            /*
             * segment of scan line y-dy for x1<=x<=x2 was previously filled,
             * now explore adjacent pixels in scan line y
             */
            for (x=x1; x>=xmin; x-=dx)
            {
                i = x+yw; k = i>>>stride;
                diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                if (!diff && !(labeled[k>>>5]&(1<<(k&31))))
                {
                    labeled[k>>>5] |= 1<<(k&31);
                    xm = min(xm, x);
                }
                else break;
            }

            if (x >= x1)
            {
                // goto skip:
                i = x+yw; k = i>>>stride;
                diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                while (x <= x2 && (diff || (labeled[k>>>5]&(1<<(k&31)))))
                {
                    x+=dx;
                    i = x+yw; k = i>>>stride;
                    diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                }
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+dx;
                if (l < x1)
                {
                    if (yw >= ymin+dy && yw <= ymax+dy)
                    {
                        //stack[slen++]=[yw, l, x1-4, -dy];  /* leak on left? */
                        stack[slen  ]=yw;
                        stack[slen+1]=l;
                        stack[slen+2]=x1-dx;
                        stack[slen+3]=-dy;
                        slen += 4;
                    }
                }
                x = x1+dx;
                notdone = true;
            }

            while (notdone)
            {
                i = x+yw; k = i>>>stride;
                diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                while (x<=xmax && !diff && !(labeled[k>>>5]&(1<<(k&31))))
                {
                    labeled[k>>>5] |= 1<<(k&31);
                    xM = max(xM, x);
                    x+=dx; i = x+yw; k = i>>>stride;
                    diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                }
                if (yw+dy >= ymin && yw+dy <= ymax)
                {
                    //stack[slen++]=[yw, l, x-4, dy];
                    stack[slen  ]=yw;
                    stack[slen+1]=l;
                    stack[slen+2]=x-dx;
                    stack[slen+3]=dy;
                    slen += 4;
                }
                if (x > x2+dx)
                {
                    if (yw-dy >= ymin && yw-dy <= ymax)
                    {
                        //stack[slen++]=[yw, x2+4, x-4, -dy];	/* leak on right? */
                        stack[slen  ]=yw;
                        stack[slen+1]=x2+dx;
                        stack[slen+2]=x-dx;
                        stack[slen+3]=-dy;
                        slen += 4;
                    }
                }
        /*skip:*/
                i = x+yw; k = i>>>stride;
                diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                while (x<=x2 && (diff || (labeled[k>>>5]&(1<<(k&31)))))
                {
                    x+=dx;
                    i = x+yw; k = i>>>stride;
                    diff = (D[im[i  ]] & 1) | (D[im[i+1]] & 2) | (D[im[i+2]] & 4);
                }
                l = x;
                notdone = (x <= x2);
            }
        }
    }
    else
    {
        while (0 < slen)
        {
            /* pop segment off stack and fill a neighboring scan line */
            slen -= 4;
            dy = stack[slen+3];
            yw = stack[slen  ]+dy;
            x1 = stack[slen+1];
            x2 = stack[slen+2];
            ym = min(ym, yw); yM = max(yM, yw);
            xm = min(xm, x1); xM = max(xM, x2);

            /*
             * segment of scan line y-dy for x1<=x<=x2 was previously filled,
             * now explore adjacent pixels in scan line y
             */
            for (x=x1; x>=xmin; x-=dx)
            {
                i = x+yw; k = i;
                if (!(D[im[i]] & 1) && !(labeled[k>>>5]&(1<<(k&31))))
                {
                    labeled[k>>>5] |= 1<<(k&31);
                    xm = min(xm, x);
                }
                else break;
            }

            if (x >= x1)
            {
                // goto skip:
                i = x+yw; k = i;
                while (x<=x2 && ((D[im[i]] & 1) || (labeled[k>>>5]&(1<<(k&31)))))
                {
                    x+=dx;
                    i = x+yw; k = i;
                }
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+dx;
                if (l < x1)
                {
                    if (yw >= ymin+dy && yw <= ymax+dy)
                    {
                        //stack[slen++]=[yw, l, x1-4, -dy];  /* leak on left? */
                        stack[slen  ]=yw;
                        stack[slen+1]=l;
                        stack[slen+2]=x1-dx;
                        stack[slen+3]=-dy;
                        slen += 4;
                    }
                }
                x = x1+dx;
                notdone = true;
            }

            while (notdone)
            {
                i = x+yw; k = i;
                while (x<=xmax && !(D[im[i]] & 1) && !(labeled[k>>>5]&(1<<(k&31))))
                {
                    labeled[k>>>5] |= 1<<(k&31);
                    xM = max(xM, x);
                    x+=dx; i = x+yw; k = i;
                }
                if (yw+dy >= ymin && yw+dy <= ymax)
                {
                    //stack[slen++]=[yw, l, x-4, dy];
                    stack[slen  ]=yw;
                    stack[slen+1]=l;
                    stack[slen+2]=x-dx;
                    stack[slen+3]=dy;
                    slen += 4;
                }
                if (x > x2+dx)
                {
                    if (yw-dy >= ymin && yw-dy <= ymax)
                    {
                        //stack[slen++]=[yw, x2+4, x-4, -dy];	/* leak on right? */
                        stack[slen  ]=yw;
                        stack[slen+1]=x2+dx;
                        stack[slen+2]=x-dx;
                        stack[slen+3]=-dy;
                        slen += 4;
                    }
                }
        /*skip:*/
                i = x+yw; k = i;
                while (x<=x2 && ((D[im[i]] & 1) || (labeled[k>>>5]&(1<<(k&31)))))
                {
                    x+=dx;
                    i = x+yw; k = i;
                }
                l = x;
                notdone = (x <= x2);
            }
        }
    }
    return {mask:labeled, box:[xm, ym, xM, yM]};
}
FilterUtil.dissimilarity_rgb = dissimilarity_rgb;
FilterUtil.floodRegion = flood_region;
}(FILTER);/**
*
* Connected Components Extractor
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var MODE = FILTER.MODE, A32F = FILTER.Array32F, IMG = FILTER.ImArray,
    FilterUtil = FILTER.Util.Filter,
    stdMath = Math, min = stdMath.min, max = stdMath.max,
    abs = stdMath.abs, cos = stdMath.cos, toRad = FILTER.CONST.toRad;

FILTER.Create({
    name: "ConnectedComponentsFilter"

    // parameters
    ,connectivity: 4
    ,tolerance: 1e-6
    ,mode: MODE.COLOR
    ,color: null
    ,invert: false
    ,box: null
    //,hasMeta: true

    // this is the filter constructor
    ,init: function(connectivity, tolerance, color, invert) {
        var self = this;
        self.connectivity = 8 === connectivity ? 8 : 4;
        self.tolerance = null == tolerance ? 1e-6 : +tolerance;
        self.color = null == color ? null : +color;
        self.invert = !!invert;
        self.mode = MODE.COLOR;
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,serialize: function() {
        var self = this;
        return {
             connectivity: self.connectivity
            ,tolerance: self.tolerance
            ,color: self.color
            ,invert: self.invert
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.connectivity = params.connectivity;
        self.tolerance = params.tolerance;
        self.color = params.color;
        self.invert = params.invert;
        return self;
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this, imLen = im.length, imSize = imLen>>>2,
            mode = self.mode||MODE.COLOR, color = self.color,
            delta = min(0.999, max(0.0, self.tolerance||0.0)),
            D = new A32F(imSize), cc, i, c, CC, CR, CG, CB;

        if (null != color)
        {
            if (MODE.HUE === mode || MODE.COLORIZEHUE === mode)
            {
                color = cos(toRad*color);
            }
            else if (MODE.COLOR === mode || MODE.COLORIZE === mode)
            {
                var r = ((color >>> 16)&255)/255, g = ((color >>> 8)&255)/255, b = ((color)&255)/255;
                color = 10000*(r+g+b)/3 + 1000*(r+g)/2 + 100*(g+b)/2 + 10*(r+b)/2 + r;
            }
        }
        // compute an appropriate (relational) dissimilarity matrix, based on filter operation mode
        delta = dissimilarity_rgb_2(im, w, h, 2, D, delta, mode);
        if (MODE.COLORIZE === mode || MODE.COLORIZEHUE === mode)
        {
            cc = connected_components(new IMG(imLen), w, h, 2, D, self.connectivity, delta, color, self.invert);
            // colorize each component with average color of region
            CR = new A32F(256);
            CG = new A32F(256);
            CB = new A32F(256);
            CC = new A32F(256);
            for (i=0; i<imLen; i+=4)
            {
                c = cc[i];
                ++CC[c];
                CR[c] += im[i  ];
                CG[c] += im[i+1];
                CB[c] += im[i+2];
            }
            for (i=0; i<256; ++i)
            {
                if (!CC[i]) continue;
                c = CC[i];
                CR[i] /= c;
                CG[i] /= c;
                CB[i] /= c;
            }
            for (i=0; i<imLen; i+=4)
            {
                c = cc[i];
                im[i  ] = CR[c]|0;
                im[i+1] = CG[c]|0;
                im[i+2] = CB[c]|0;
            }
            return im;
        }
        else
        {
            return connected_components(im, w, h, 2, D, self.connectivity, delta, color, self.invert);
        }
    }
});

// private methods
function dissimilarity_rgb_2(im, w, h, stride, D, delta, mode)
{
    var MODE = FILTER.MODE, HUE = FILTER.Color.hue, INTENSITY = FILTER.Color.intensity,
        cos = stdMath.cos, toRad = FILTER.CONST.toRad, i, j, imLen = im.length, dLen = D.length;

    if (0 < stride)
    {
        if (MODE.HUE === mode || MODE.COLORIZEHUE === mode)
        {
            for (i=0,j=0; j<dLen; i+=4,++j)
                D[j] = 0 === im[i+3] ? 10000 : cos(toRad*HUE(im[i],im[i+1],im[i+2]));
        }
        else if (MODE.INTENSITY === mode)
        {
            delta *= 255;
            for (i=0,j=0; j<dLen; i+=4,++j)
                D[j] = 0 === im[i+3] ? 10000 : INTENSITY(im[i],im[i+1],im[i+2]);
        }
        else if (MODE.GRAY === mode)
        {
            delta *= 255;
            for (i=0,j=0; j<dLen; i+=4,++j)
                D[j] = 0 === im[i+3] ? 10000 : im[i];
        }
        else //if (MODE.COLOR === mode || MODE.COLORIZE === mode)
        {
            delta = 10000*delta + 1000*delta + 100*delta + 10*delta + delta;
            for (i=0,j=0; j<dLen; i+=4,++j)
                D[j] = 0 === im[i+3] ? 100000 : 10000*(im[i]+im[i+1]+im[i+2])/3/255 + 1000*(im[i]+im[i+1])/2/255 + 100*(im[i+1]+im[i+2])/2/255 + 10*(im[i]+im[i+2])/2/255 + im[i]/255;
        }
    }
    else
    {
        if (MODE.HUE === mode || MODE.COLORIZEHUE === mode)
        {
            for (i=0,j=0; j<dLen; ++i,++j)
                D[j] = cos(toRad*im[i]);
        }
        else //if (MODE.INTENSITY === mode || MODE.GRAY === mode || MODE.COLOR === mode || MODE.COLORIZE === mode)
        {
            delta *= 255;
            for (i=0,j=0; j<dLen; ++i,++j)
                D[j] = im[i];
        }
    }
    return delta;
}
// adapted from http://xenia.media.mit.edu/~rahimi/connected/
function Label(x, y, root)
{
    var self = this;
    self.id = -1;
    self.root = root || self;
}
Label.prototype = {
    constructor: Label,
    id: 0,
    root: null
};
function root_of(label)
{
    while (label !== label.root) label = label.root;
    return label;
}
function merge(l1, l2)
{
    l1 = root_of(l1); l2 = root_of(l2);
    if (l1 !== l2) l1.root = l2;
}

// TODO: add bounding boxes, so it can be used as connected color/hue detector/tracker as well efficiently
function connected_components(output, w, h, stride, D, K, delta, V0, invert)
{
    stride = stride|0;
    var i, j, k, len = output.length, size = len>>>stride, K8_CONNECTIVITY = 8 === K,
        mylab, c, r, d, row, numlabels, label, background_label = null,
        need_match = null != V0, color, a, b, delta2 = 2*delta;

    label = new Array(size);
    background_label = need_match ? new Label(0, 0) : null;

    label[0] = need_match && (abs(delta+D[0]-V0)>delta2) ? background_label : new Label(0, 0);

    // label the first row.
    for (c=1; c<w; ++c)
    {
        label[c] = need_match && (abs(delta+D[c]-V0)>delta2) ? background_label : (abs(delta+D[c]-D[c-1])<=delta2 ? label[c-1] : new Label(c, 0));
    }

    // label subsequent rows.
    for (r=1,row=w; r<h; ++r,row+=w)
    {
        // label the first pixel on this row.
        label[row] = need_match && (abs(delta+D[row]-V0)>delta2) ? background_label : (abs(delta+D[row]-D[row-w])<=delta2 ? label[row-w] : new Label(0, r));

        // label subsequent pixels on this row.
        for (c=1; c<w; ++c)
        {
            if (need_match && (abs(delta+D[row+c]-V0)>delta2))
            {
                label[row+c] = background_label;
                continue;
            }
            // inherit label from pixel on the left if we're in the same blob.
            mylab = background_label === label[row+c-1] ? null : (abs(delta+D[row+c]-D[row+c-1])<=delta2 ? label[row+c-1] : null);

            //for(d=d0; d<1; d++)
            // full loop unrolling
            // if we're in the same blob, inherit value from above pixel.
            // if we've already been assigned, merge its label with ours.
            if (K8_CONNECTIVITY)
            {
                //d = -1;
                if((background_label !== label[row-w+c-1/*+d*/]) && (abs(delta+D[row+c]-D[row-w+c-1/*+d*/])<=delta2))
                {
                    if (null != mylab) merge(mylab, label[row-w+c-1/*+d*/]);
                    else mylab = label[row-w+c-1/*+d*/];
                }
            }
            //d = 0;
            if((background_label !== label[row-w+c/*+d*/]) && (abs(delta+D[row+c]-D[row-w+c/*+d*/])<=delta2))
            {
                if (null != mylab) merge(mylab, label[row-w+c/*+d*/]);
                else mylab = label[row-w+c/*+d*/];
            }

            if (null != mylab)
            {
                label[row+c] = mylab;
                /*mylab.root.x2 = max(mylab.root.x2,c);
                mylab.root.y2 = max(mylab.root.y2,r);*/
            }
            else
            {
                label[row+c] = new Label(c, r);
            }

            if(K8_CONNECTIVITY &&
                (background_label !== label[row+c-1]) && (background_label !== label[row-w+c]) &&
                (abs(delta+D[row+c-1]-D[row-w+c])<=delta2))
                merge(label[row+c-1], label[row-w+c]);
        }
    }

    if (invert) {a = -255; b = 255;}
    else {a = 255; b = 0;}
    // compute num of distinct labels and assign ids
    if (null != background_label) {background_label.id = 0; numlabels = 1;}
    else {numlabels = 0;}
    for (c=0; c<size; ++c)
    {
        label[c] = root_of(label[c]);
        if (0 > label[c].id) label[c].id = numlabels++;
    }
    // relabel output
    if (stride)
    {
        for (c=0,i=0; i<len; i+=4,++c)
        {
            color = (b+a*label[c].id/numlabels)|0;
            output[i] = output[i+1] = output[i+2] = color;
            //output[i+3] = output[i+3];
        }
    }
    else
    {
        for (c=0; c<len; ++c)
        {
            color = (b+a*label[c].id/numlabels)|0;
            output[c] = color;
        }
    }
    return output;
}
FilterUtil.dissimilarity_rgb_2 = dissimilarity_rgb_2;
FilterUtil.connectedComponents = connected_components;
}(FILTER);/**
*
* Histogram Equalize,
* Histogram Equalize for grayscale images,
* RGB Histogram Equalize
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var notSupportClamp = FILTER._notSupportClamp,
    CHANNEL = FILTER.CHANNEL, MODE = FILTER.MODE,
    FilterUtil = FILTER.Util.Filter,
    stdMath = Math, Min = stdMath.min, Max = stdMath.max;

// a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
FILTER.Create({
    name : "HistogramEqualizeFilter"

    ,path: FILTER.Path

    ,mode: MODE.INTENSITY
    ,channel: 0
    ,factor: 0.0

    ,init: function(mode, channel, factor) {
        var self = this;
        self.mode = mode || MODE.INTENSITY;
        self.channel = channel || 0;
        if (null != factor) self.factor = (+factor) || 0;
    }

    ,serialize: function() {
        var self = this;
        return {
             channel: self.channel,
             factor: self.factor
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.channel = params.channel;
        self.factor = params.factor;
        return self;
    }

    ,_apply_rgb: function(im, w, h) {
        var self = this,
            r ,g, b,
            rangeR, rangeG, rangeB,
            cdfR, cdfG, cdfB,
            f = self.factor || 0,
            t0, t1, t2, v,
            i, l=im.length;

        cdfR = FilterUtil.histogram(im, CHANNEL.R, true);
        cdfG = FilterUtil.histogram(im, CHANNEL.G, true);
        cdfB = FilterUtil.histogram(im, CHANNEL.B, true);
        // equalize each channel separately
        f = 1 - Min(Max(f, 0), 1);
        rangeR = (cdfR.max - cdfR.min)/cdfR.total;
        rangeG = (cdfG.max - cdfG.min)/cdfG.total;
        rangeB = (cdfB.max - cdfB.min)/cdfB.total;
        if (notSupportClamp)
        {
            for (i=0; i<l; i+=4)
            {
                r = im[i  ];
                g = im[i+1];
                b = im[i+2];
                v = cdf.binR[r]*rangeR;
                t0 = ((f)*(v + cdfR.min) + (1-f)*(cdfR.max - v));
                v = cdf.binG[g]*rangeG;
                t1 = ((f)*(v + cdfG.min) + (1-f)*(cdfG.max - v));
                v = cdf.binB[b]*rangeB;
                t2 = ((f)*(v + cdfB.min) + (1-f)*(cdfB.max - v));
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                im[i  ] = t0|0;
                im[i+1] = t1|0;
                im[i+2] = t2|0;
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                r = im[i  ];
                g = im[i+1];
                b = im[i+2];
                v = cdf.binR[r]*rangeR;
                t0 = ((f)*(v + cdfR.min) + (1-f)*(cdfR.max - v));
                v = cdf.binG[g]*rangeG;
                t1 = ((f)*(v + cdfG.min) + (1-f)*(cdfG.max - v));
                v = cdf.binB[b]*rangeB;
                t2 = ((f)*(v + cdfB.min) + (1-f)*(cdfB.max - v));
                im[i  ] = t0|0;
                im[i+1] = t1|0;
                im[i+2] = t2|0;
            }
        }
        // return the new image data
        return im;
    }

    ,apply: function(im, w, h) {
        var self = this;

        if (MODE.RGB === self.mode) return self._apply_rgb(im, w, h);

        var r, g, b, y, cb, cr,
            range, cdf, i, v,
            l = im.length, f = self.factor || 0,
            channel = self.channel || 0,
            mode = self.mode;

        if (MODE.GRAY === mode || MODE.CHANNEL === mode)
        {
            cdf = FilterUtil.histogram(im, channel, true);
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                r = im[i  ];
                g = im[i+1];
                b = im[i+2];
                y  = (0   + 0.299*r    + 0.587*g     + 0.114*b)|0;
                cb = (128 - 0.168736*r - 0.331264*g  + 0.5*b)|0;
                cr = (128 + 0.5*r      - 0.418688*g  - 0.081312*b)|0;
                // clamp them manually
                cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                y = y<0 ? 0 : (y>255 ? 255 : y);
                cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                im[i  ] = cr;
                im[i+1] = y;
                im[i+2] = cb;
            }
            cdf = FilterUtil.histogram(im, CHANNEL.G, true);
        }
        // equalize only the intesity channel
        f = 1 - Min(Max(f, 0), 1);
        range = (cdf.max - cdf.min)/cdf.total;
        if (notSupportClamp)
        {
            if (MODE.GRAY === mode)
            {
                for (i=0; i<l; i+=4)
                {
                    v = cdf.bin[im[i+channel]]*range;
                    r = ((f)*(v + cdf.min) + (1-f)*(cdf.max - v));
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    r = r|0;
                    im[i] = r; im[i+1] = r; im[i+2] = r;
                }
            }
            else if (MODE.CHANNEL === mode)
            {
                for (i=0; i<l; i+=4)
                {
                    v = cdf.bin[im[i+channel]]*range;
                    r = ((f)*(v + cdf.min) + (1-f)*(cdf.max - v));
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    im[i+channel] = r|0;
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                {
                    v = cdf.bin[im[i+1]]*range;
                    y = ((f)*(v + cdf.min) + (1-f)*(cdf.max - v));
                    cb = im[i+2];
                    cr = im[i  ];
                    r = (y                      + 1.402   * (cr-128));
                    g = (y - 0.34414 * (cb-128) - 0.71414 * (cr-128));
                    b = (y + 1.772   * (cb-128));
                    // clamp them manually
                    r = r<0 ? 0 : (r>255 ? 255 : r);
                    g = g<0 ? 0 : (g>255 ? 255 : g);
                    b = b<0 ? 0 : (b>255 ? 255 : b);
                    im[i  ] = r|0;
                    im[i+1] = g|0;
                    im[i+2] = b|0;
                }
            }
        }
        else
        {
            if (MODE.GRAY === mode)
            {
                for (i=0; i<l; i+=4)
                {
                    v = cdf.bin[im[i+channel]]*range;
                    r = ((f)*(v + cdf.min) + (1-f)*(cdf.max - v))|0;
                    im[i] = r; im[i+1] = r; im[i+2] = r;
                }
            }
            else if (MODE.CHANNEL === mode)
            {
                for (i=0; i<l; i+=4)
                {
                    v = cdf.bin[im[i+channel]]*range;
                    r = ((f)*(v + cdf.min) + (1-f)*(cdf.max - v))|0;
                    im[i+channel] = r;
                }
            }
            else
            {
                for (i=0; i<l; i+=4)
                {
                    v = cdf.bin[im[i+1]]*range;
                    y = ((f)*(v + cdf.min) + (1-f)*(cdf.max - v));
                    cb = im[i+2];
                    cr = im[i  ];
                    r = (y                      + 1.402   * (cr-128));
                    g = (y - 0.34414 * (cb-128) - 0.71414 * (cr-128));
                    b = (y + 1.772   * (cb-128));
                    im[i  ] = r|0;
                    im[i+1] = g|0;
                    im[i+2] = b|0;
                }
            }
        }
        return im;
    }
});

}(FILTER);/**
*
* Automatic Threshold (Otsu)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var notSupportClamp = FILTER._notSupportClamp,
    CHANNEL = FILTER.CHANNEL, MODE = FILTER.MODE,
    FilterUtil = FILTER.Util.Filter;

// https://en.wikipedia.org/wiki/Thresholding_(image_processing)
// https://en.wikipedia.org/wiki/Otsu%27s_method
FILTER.Create({
    name : "OtsuThresholdFilter"

    ,path: FILTER.Path

    ,hasMeta: true
    ,mode: MODE.INTENSITY
    ,color0: 0
    ,color1: null
    ,channel: 0

    ,init: function(mode, color0, color1, channel) {
        var self = this;
        self.mode = mode || MODE.INTENSITY;
        self.color0 = color0 || 0;
        if (null != color1) self.color1 = color1;
        self.channel = channel || 0;
    }

    ,serialize: function() {
        var self = this;
        return {
             color0: self.color0
            ,color1: self.color1
            ,channel: self.channel
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.color0 = params.color0;
        self.color1 = params.color1;
        self.channel = params.channel;
        return self;
    }

    ,_apply_rgb: function(im, w, h) {
        var self = this,
            r, g, b,
            binR, binG, binB,
            tR, tG, tB,
            color0 = self.color0 || 0,
            r0 = (color0 >>> 16)&255,
            g0 = (color0 >>> 8)&255,
            b0 = (color0)&255,
            //a0 = (color0 >>> 24)&255,
            color1 = self.color1,
            r1, g1, b1, //a1,
            i, l=im.length;

        if (null != color1)
        {
            r1 = (color1 >>> 16)&255;
            g1 = (color1 >>> 8)&255;
            b1 = (color1)&255;
        }
        binR = FilterUtil.histogram(im, CHANNEL.R);
        binG = FilterUtil.histogram(im, CHANNEL.G);
        binB = FilterUtil.histogram(im, CHANNEL.B);
        tR = FilterUtil.otsu(binR.bin, binR.total, binR.min, binR.max);
        tG = FilterUtil.otsu(binG.bin, binG.total, binG.min, binG.max);
        tB = FilterUtil.otsu(binB.bin, binB.total, binB.min, binB.max);
        for (i=0; i<l; i+=4)
        {
            if (im[i  ] < tR) im[i  ] = r0;
            else if (null != color1) im[i  ] = r1;
            if (im[i+1] < tG) im[i+1] = g0;
            else if (null != color1) im[i+1] = g1;
            if (im[i+2] < tB) im[i+2] = b0;
            else if (null != color1) im[i+2] = b1;
        }
        // return thresholds as meta
        self.meta = [tR, tG, tB];
        return im;
    }

    ,apply: function(im, w, h) {
        var self = this;

        if (MODE.RGB === self.mode) return self._apply_rgb(im, w, h);

        var r, g, b, t, y, cb, cr,
            color0 = self.color0 || 0,
            r0 = (color0 >>> 16)&255,
            g0 = (color0 >>> 8)&255,
            b0 = (color0)&255,
            //a0 = (color0 >>> 24)&255,
            color1 = self.color1,
            r1, g1, b1, //a1,
            bin, i, t, l = im.length,
            channel = self.channel || 0,
            mode = self.mode;

        if (null != color1)
        {
            r1 = (color1 >>> 16)&255;
            g1 = (color1 >>> 8)&255;
            b1 = (color1)&255;
        }
        if (MODE.GRAY === mode || MODE.CHANNEL === mode)
        {
            bin = FilterUtil.histogram(im, channel);
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                r = im[i  ];
                g = im[i+1];
                b = im[i+2];
                y  = (0   + 0.299*r    + 0.587*g     + 0.114*b);
                cb = (128 - 0.168736*r - 0.331264*g  + 0.5*b);
                cr = (128 + 0.5*r      - 0.418688*g  - 0.081312*b);
                if (notSupportClamp)
                {
                    // clamp them manually
                    cr = cr<0 ? 0 : (cr>255 ? 255 : cr);
                    y = y<0 ? 0 : (y>255 ? 255 : y);
                    cb = cb<0 ? 0 : (cb>255 ? 255 : cb);
                }
                im[i  ] = cr|0;
                im[i+1] = y|0;
                im[i+2] = cb|0;
            }
            bin = FilterUtil.histogram(im, CHANNEL.G);
        }
        t = FilterUtil.otsu(bin.bin, bin.total, bin.min, bin.max);
        if (MODE.GRAY === mode)
        {
            for (i=0; i<l; i+=4)
            {
                if (im[i+channel] < t)
                {
                    im[i  ] = r0;
                    im[i+1] = g0;
                    im[i+2] = b0;
                }
                else if (null != color1)
                {
                    im[i  ] = r1;
                    im[i+1] = g1;
                    im[i+2] = b1;
                }
            }
        }
        else if (MODE.CHANNEL === mode)
        {
            for (i=0; i<l; i+=4)
            {
                if (im[i+channel] < t)
                {
                    im[i+channel] = 2 === channel ? b0 : (1 === channel ? g0 : r0);
                }
                else if (null != color1)
                {
                    im[i+channel] = 2 === channel ? b1 : (1 === channel ? g1 : r1);
                }
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                cr = im[i  ];
                y  = im[i+1];
                cb = im[i+2];
                if (y < t)
                {
                    im[i  ] = r0;
                    im[i+1] = g0;
                    im[i+2] = b0;
                }
                else if (null != color1)
                {
                    im[i  ] = r1;
                    im[i+1] = g1;
                    im[i+2] = b1;
                }
                else
                {
                    r = (y                      + 1.402   * (cr-128));
                    g = (y - 0.34414 * (cb-128) - 0.71414 * (cr-128));
                    b = (y + 1.772   * (cb-128));
                    if (notSupportClamp)
                    {
                        // clamp them manually
                        r = r<0 ? 0 : (r>255 ? 255 : r);
                        g = g<0 ? 0 : (g>255 ? 255 : g);
                        b = b<0 ? 0 : (b>255 ? 255 : b);
                    }
                    im[i  ] = r|0;
                    im[i+1] = g|0;
                    im[i+2] = b|0;
                }
            }
        }
        // return thresholds as meta
        self.meta = [t];
        return im;
    }
});
}(FILTER);/**
*
* Canny Edges Detector
* @package FILTER.js
*
**/
!function(FILTER) {
"use strict";

var MAGNITUDE_SCALE = 1, MAGNITUDE_LIMIT = 510,
    MAGNITUDE_MAX = MAGNITUDE_SCALE * MAGNITUDE_LIMIT;

// an efficient Canny Edges Detector
// http://en.wikipedia.org/wiki/Canny_edge_detector
FILTER.Create({
    name : "CannyEdgesFilter"

    ,low: 25
    ,high: 75
    ,lowpass: true

    ,path: FILTER.Path

    ,init: function(lowThreshold, highThreshold, lowpass) {
        var self = this;
        self.low = arguments.length < 1 ? 25 : +lowThreshold;
        self.high = arguments.length < 2 ? 75 : +highThreshold;
        self.lowpass = arguments.length < 3 ? true : !!lowpass;
    }

    ,thresholds: function(low, high, lowpass) {
        var self = this;
        self.low = +low;
        self.high = +high;
        if (arguments.length > 2) self.lowpass = !!lowpass;
        return self;
    }

    ,serialize: function() {
        var self = this;
        return {
             low: self.low
            ,high: self.high
            ,lowpass: self.lowpass
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.low = params.low;
        self.high = params.high;
        self.lowpass = params.lowpass;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this)
    }


    // this is the filter actual apply method routine
    ,_apply: function(im, w, h) {
        var self = this;
        // NOTE: assume image is already grayscale (and contrast-normalised if needed)
        return (self._runWASM ? (FILTER.Util.Filter.wasm||FILTER.Util.Filter) : FILTER.Util.Filter)['gradient'](im, w, h, 2, 0, self.lowpass ? 1 : 0, 0, self.low*MAGNITUDE_SCALE, self.high*MAGNITUDE_SCALE, MAGNITUDE_SCALE, MAGNITUDE_LIMIT, MAGNITUDE_MAX);
    }
});

function glsl(filter)
{
    var code = FILTER.Util.Filter.gradient_glsl(), glslcode = new FILTER.Util.GLSL.Filter(filter);
    if (filter.lowpass)
    {
        glslcode
        .begin()
        .shader([
        'varying vec2 pix;',
        'uniform vec2 dp;',
        'uniform sampler2D img;',
        code.lowpass,
        'void main(void) {',
        '    gl_FragColor = lowpass(img, pix, dp);',
        '}'
        ].join('\n'))
        .end();
    }
    glslcode
    .begin()
    .shader([
    '#define MAGNITUDE_SCALE 1.0',
    '#define MAGNITUDE_LIMIT 510.0',
    '#define MAGNITUDE_MAX 510.0',
    'varying vec2 pix;',
    'uniform vec2 dp;',
    'uniform sampler2D img;',
    'uniform float low;',
    'uniform float high;',
    code.gradient,
    'void main(void) {',
    '    gl_FragColor = gradient(img, pix, dp, low, high, MAGNITUDE_SCALE, MAGNITUDE_LIMIT, MAGNITUDE_MAX);',
    '}'
    ].join('\n'))
    .input('low', function(filter) {return filter.low*MAGNITUDE_SCALE/255;})
    .input('high', function(filter) {return filter.high*MAGNITUDE_SCALE/255;})
    .end()
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform vec2 dp;',
    'uniform sampler2D img;',
    code.hysteresis,
    'void main(void) {',
    '    gl_FragColor = hysteresis(img, pix, dp);',
    '}'
    ].join('\n'), 50)
    .end();
    return glslcode.code();
}
}(FILTER);/**
*
* HAAR Feature Detector
* @package FILTER.js
*
**/
!function(FILTER, undef) {
"use strict";

var stdMath = Math, Abs = stdMath.abs, Max = stdMath.max, Min = stdMath.min,
    Floor = stdMath.floor, Round = stdMath.round, Sqrt = stdMath.sqrt,
    TypedArray = FILTER.Util.Array.typed, TypedObj = FILTER.Util.Array.typed_obj,
    MAX_FEATURES = 10, push = Array.prototype.push;

// HAAR Feature Detector (Viola-Jones-Lienhart algorithm)
// adapted from: https://github.com/foo123/HAAR.js
// references:
// 1. Viola, Jones 2001 http://www.cs.cmu.edu/~efros/courses/LBMV07/Papers/viola-cvpr-01.pdf
// 2. Lienhart et al 2002 http://www.lienhart.de/Prof._Dr._Rainer_Lienhart/Source_Code_files/ICIP2002.pdf
FILTER.Create({
    name: "HaarDetectorFilter"

    // parameters
    ,_update: false // filter by itself does not alter image data, just processes information
    ,hasMeta: true
    ,haardata: null
    ,tolerance: 0.2
    ,baseScale: 1.0
    ,scaleIncrement: 1.25
    ,stepIncrement: 0.5
    ,minNeighbors: 1
    ,doCannyPruning: true
    ,cannyLow: 20
    ,cannyHigh: 100
    ,_haarchanged: false

    // this is the filter constructor
    ,init: function(haardata, baseScale, scaleIncrement, stepIncrement, minNeighbors, doCannyPruning, tolerance) {
        var self = this;
        self.haardata = haardata || null;
        self.baseScale = null == baseScale ? 1.0 : (+baseScale);
        self.scaleIncrement = null == scaleIncrement ? 1.25 : (+scaleIncrement);
        self.stepIncrement = null == stepIncrement ? 0.5 : (+stepIncrement);
        self.minNeighbors = null == minNeighbors ? 1 : (+minNeighbors);
        self.doCannyPruning = undef === doCannyPruning ? true : (!!doCannyPruning);
        self.tolerance = null == tolerance ? 0.2 : (+tolerance);
        self._haarchanged = !!self.haardata;
    }

    // support worker serialize/unserialize interface
    ,path: FILTER.Path

    ,dispose: function() {
        var self = this;
        self.haardata = null;
        self.$super('dispose');
        return self;
    }

    ,haar: function(haardata) {
        var self = this;
        self.haardata = haardata;
        self._haarchanged = true;
        return self;
    }

    ,params: function(params) {
        var self = this;
        if (params)
        {
            if (params.haardata)
            {
                self.haardata = params.haardata;
                self._haarchanged = true;
            }
            if (null != params.baseScale) self.baseScale = +params.baseScale;
            if (null != params.scaleIncrement) self.scaleIncrement = +params.scaleIncrement;
            if (null != params.stepIncrement) self.stepIncrement = +params.stepIncrement;
            if (null != params.minNeighbors) self.minNeighbors = +params.minNeighbors;
            if (undef !== params.doCannyPruning) self.doCannyPruning = !!params.doCannyPruning;
            if (null != params.tolerance) self.tolerance = +params.tolerance;
            if (null != params.cannyLow) self.cannyLow = +params.cannyLow;
            if (null != params.cannyHigh) self.cannyHigh = +params.cannyHigh;
            if (null != params.selection) self.selection = params.selection || null;
        }
        return self;
    }

    ,serialize: function() {
        var self = this, json;
        json = {
             //haardata: null
             baseScale: self.baseScale
            ,scaleIncrement: self.scaleIncrement
            ,stepIncrement: self.stepIncrement
            ,minNeighbors: self.minNeighbors
            ,doCannyPruning: self.doCannyPruning
            ,tolerance: self.tolerance
            ,cannyLow: self.cannyLow
            ,cannyHigh: self.cannyHigh
        };
        // avoid unnecessary (large) data transfer
        if (self._haarchanged)
        {
            json.haardata = TypedObj(self.haardata);
            self._haarchanged = false;
        }
        return json;
    }

    ,unserialize: function(params) {
        var self = this;
        if (params.haardata) self.haardata = TypedObj(params.haardata, 1);
        self.baseScale = params.baseScale;
        self.scaleIncrement = params.scaleIncrement;
        self.stepIncrement = params.stepIncrement;
        self.minNeighbors = params.minNeighbors;
        self.doCannyPruning = params.doCannyPruning;
        self.tolerance = params.tolerance;
        self.cannyLow = params.cannyLow;
        self.cannyHigh = params.cannyHigh;
        return self;
    }

    // detected objects are passed as filter metadata (if filter is run in parallel thread)
    ,metaData: function(serialisation) {
        return serialisation && FILTER.isWorker ? TypedObj(this.meta) : this.meta;
    }

    ,setMetaData: function(meta, serialisation) {
        this.meta = serialisation && ("string" === typeof meta) ? TypedObj(meta, 1) : meta;
        return this;
    }

    // this is the filter actual apply method routine
    ,apply: function(im, w, h, metaData) {
        var self = this;
        if (!self.haardata) return im;

        var imLen = im.length, imSize = imLen>>>2,
            selection = self.selection || null,
            A32F = FILTER.Array32F, SAT=null, SAT2=null, RSAT=null, GSAT=null,
            x1, y1, x2, y2, xf, yf,
            features, FilterUtil = FILTER.Util.Filter;

        if (selection)
        {
            if (selection[4])
            {
                // selection is relative, make absolute
                xf = w-1;
                yf = h-1;
            }
            else
            {
                // selection is absolute
                xf = 1;
                yf = 1;
            }
            x1 = Min(w-1, Max(0, selection[0]*xf));
            y1 = Min(h-1, Max(0, selection[1]*yf));
            x2 = Min(w-1, Max(0, selection[2]*xf));
            y2 = Min(h-1, Max(0, selection[3]*yf));
        }
        else
        {
            x1 = 0; y1 = 0;
            x2 = w-1; y2 = h-1;
        }

        // NOTE: assume image is already grayscale
        if (metaData && metaData.haarfilter_SAT)
        {
            SAT = metaData.haarfilter_SAT;
            SAT2 = metaData.haarfilter_SAT2;
            RSAT = metaData.haarfilter_RSAT;
        }
        else
        {
            // pre-compute <del>grayscale,</del> SAT, RSAT and SAT2
            FilterUtil.sat(im, w, h, 2, 0, SAT=new A32F(imSize), SAT2=new A32F(imSize), RSAT=new A32F(imSize));
            if (metaData)
            {
                metaData.haarfilter_SAT = SAT;
                metaData.haarfilter_SAT2 = SAT2;
                metaData.haarfilter_RSAT = RSAT;
            }
        }

        // pre-compute integral canny gradient edges if needed
        if (self.doCannyPruning)
        {
            if (metaData && metaData.haarfilter_GSAT)
            {
                GSAT = metaData.haarfilter_GSAT;
            }
            else
            {
                GSAT = FilterUtil.gradient(im, w, h, 2, 0, 1, 1);
                if (metaData) metaData.haarfilter_GSAT = GSAT;
            }
        }

        // synchronous detection loop
        features = new Array(MAX_FEATURES); features.count = 0;
        FilterUtil.haar_detect(features, w, h, x1, y1, x2, y2, self.haardata, self.baseScale, self.scaleIncrement, self.stepIncrement, SAT, RSAT, SAT2, GSAT, self.cannyLow, self.cannyHigh);
        // truncate if needed
        if (features.length > features.count) features.length = features.count;

        // return results as meta
        self.meta = {objects: FilterUtil.merge_features(features, self.minNeighbors, self.tolerance)};

        // return im back
        return im;
    }
});

// private methods
function haar_detect(feats, w, h, sel_x1, sel_y1, sel_x2, sel_y2,
                    haar, baseScale, scaleIncrement, stepIncrement,
                    SAT, RSAT, SAT2, GSAT, cL, cH)
{
    var thresholdEdgesDensity = null != GSAT,
        selw = (sel_x2-sel_x1+1)|0, selh = (sel_y2-sel_y1+1)|0,
        imSize = w*h, imArea1 = imSize-1,
        haar_stages = haar.stages, sl = haar_stages.length,
        sizex = haar.size1, sizey = haar.size2,
        scale, maxScale, xstep, ystep, xsize, ysize,
        startx, starty, startty, //minScale,
        x, y, ty, tyw, tys, p0, p1, p2, p3, xl, yl, s, t,
        bx, by, swh, inv_area,
        total_x, total_x2, vnorm, edges_density, pass,

        stage, threshold, trees, tl,
        t, cur_node_ind, features, feature,
        rects, nb_rects, thresholdf,
        rect_sum, kr, r, x1, y1, x2, y2,
        x3, y3, x4, y4, rw, rh, yw, yh, sum
    ;

    bx=w-1; by=imSize-w;
    startx = sel_x1|0; starty = sel_y1|0;
    maxScale = Min(selw/*w*//sizex, selh/*h*//sizey);
    //minScale = Max(selw/w, selh/h);
    for (scale=baseScale/* *minScale*/; scale<=maxScale; scale*=scaleIncrement)
    {
        // Viola-Jones Single Scale Detector
        xsize = (scale * sizex)|0;
        xstep = (xsize * stepIncrement)|0;
        ysize = (scale * sizey)|0;
        ystep = (ysize * stepIncrement)|0;
        //ysize = xsize; ystep = xstep;
        tyw = ysize*w; tys = ystep*w;
        startty = starty*tys;
        xl = startx+selw-xsize; yl = starty+selh-ysize;
        swh = xsize*ysize; inv_area = 1.0/swh;

        for (y=starty,ty=startty; y<yl; y+=ystep,ty+=tys)
        {
            for (x=startx; x<xl; x+=xstep)
            {
                p0 = x-1 + ty-w;  p1 = p0 + xsize;
                p2 = p0 + tyw;    p3 = p2 + xsize;

                // clamp
                p0 = Min(imArea1,Max(0,p0));
                p1 = Min(imArea1,Max(0,p1));
                p2 = Min(imArea1,Max(0,p2));
                p3 = Min(imArea1,Max(0,p3));

                if (thresholdEdgesDensity)
                {
                    // prune search space based on canny edges density
                    // i.e too few = no feature, too much = noise
                    // avoid overflow
                    edges_density = inv_area * (GSAT[p3] - GSAT[p2] - GSAT[p1] + GSAT[p0]);
                    if (edges_density < cL || edges_density > cH) continue;
                }

                // pre-compute some values for speed

                // avoid overflow
                total_x = inv_area * (SAT[p3] - SAT[p2] - SAT[p1] + SAT[p0]);
                // avoid overflow
                total_x2 = inv_area * (SAT2[p3] - SAT2[p2] - SAT2[p1] + SAT2[p0]);

                vnorm = total_x2 - total_x * total_x;
                //vnorm = 1 < vnorm ? Sqrt(vnorm) : vnorm /*1*/;
                if (0 >= vnorm) continue;
                vnorm = Sqrt(vnorm);

                pass = false;
                for (s=0; s<sl; ++s)
                {
                    // Viola-Jones HAAR-Stage evaluator
                    stage = haar_stages[s];
                    threshold = stage.thres;
                    trees = stage.trees; tl = trees.length;
                    sum=0;

                    for (t=0; t<tl; ++t)
                    {
                        //
                        // inline the tree and leaf evaluators to avoid function calls per-loop (faster)
                        //

                        // Viola-Jones HAAR-Tree evaluator
                        features = trees[t].feats;
                        cur_node_ind = 0;
                        while (true)
                        {
                            feature = features[cur_node_ind];

                            // Viola-Jones HAAR-Leaf evaluator
                            rects = feature.rects;
                            nb_rects = rects.length;
                            thresholdf = feature.thres;
                            rect_sum = 0;

                            if (feature.tilt)
                            {
                                // tilted rectangle feature, Lienhart et al. extension
                                for (kr=0; kr<nb_rects; ++kr)
                                {
                                    r = rects[kr];

                                    // this produces better/larger features, possible rounding effects??
                                    x1 = x + (scale * r[0])|0;
                                    y1 = (y-1 + (scale * r[1])|0) * w;
                                    x2 = x + (scale * (r[0] + r[2]))|0;
                                    y2 = (y-1 + (scale * (r[1] + r[2]))|0) * w;
                                    x3 = x + (scale * (r[0] - r[3]))|0;
                                    y3 = (y-1 + (scale * (r[1] + r[3]))|0) * w;
                                    x4 = x + (scale * (r[0] + r[2] - r[3]))|0;
                                    y4 = (y-1 + (scale * (r[1] + r[2] + r[3]))|0) * w;

                                    // clamp
                                    x1 = Min(bx,Max(0,x1));
                                    x2 = Min(bx,Max(0,x2));
                                    x3 = Min(bx,Max(0,x3));
                                    x4 = Min(bx,Max(0,x4));
                                    y1 = Min(by,Max(0,y1));
                                    y2 = Min(by,Max(0,y2));
                                    y3 = Min(by,Max(0,y3));
                                    y4 = Min(by,Max(0,y4));

                                    // RSAT(x-h+w, y+w+h-1) + RSAT(x, y-1) - RSAT(x-h, y+h-1) - RSAT(x+w, y+w-1)
                                    //        x4     y4            x1  y1          x3   y3            x2   y2
                                    rect_sum += r[4] * (RSAT[x4 + y4] - RSAT[x3 + y3] - RSAT[x2 + y2] + RSAT[x1 + y1]);
                                }
                            }
                            else
                            {
                                // orthogonal rectangle feature, Viola-Jones original
                                for (kr=0; kr<nb_rects; ++kr)
                                {
                                    r = rects[kr];

                                    // this produces better/larger features, possible rounding effects??
                                    x1 = x-1 + (scale * r[0])|0;
                                    x2 = x-1 + (scale * (r[0] + r[2]))|0;
                                    y1 = w * (y-1 + (scale * r[1])|0);
                                    y2 = w * (y-1 + (scale * (r[1] + r[3]))|0);

                                    // clamp
                                    x1 = Min(bx,Max(0,x1));
                                    x2 = Min(bx,Max(0,x2));
                                    y1 = Min(by,Max(0,y1));
                                    y2 = Min(by,Max(0,y2));

                                    // SAT(x-1, y-1) + SAT(x+w-1, y+h-1) - SAT(x-1, y+h-1) - SAT(x+w-1, y-1)
                                    //      x1   y1         x2      y2          x1   y1            x2    y1
                                    rect_sum += r[4] * (SAT[x2 + y2]  - SAT[x1 + y2] - SAT[x2 + y1] + SAT[x1 + y1]);
                                }
                            }

                            /*where = rect_sum * inv_area < thresholdf * vnorm ? 0 : 1;*/
                            // END Viola-Jones HAAR-Leaf evaluator

                            if (rect_sum * inv_area < thresholdf * vnorm)
                            {
                                if (feature.has_l) {sum += feature.l_val; break;}
                                else {cur_node_ind = feature.l_node;}
                            }
                            else
                            {
                                if (feature.has_r) {sum += feature.r_val; break;}
                                else {cur_node_ind = feature.r_node;}
                            }
                        }
                        // END Viola-Jones HAAR-Tree evaluator
                    }
                    pass = sum > threshold;
                    // END Viola-Jones HAAR-Stage evaluator

                    if (!pass) break;
                }

                if (pass)
                {
                    // expand
                    if (feats.count === feats.length) push.apply(feats, new Array(MAX_FEATURES));
                    //                      x, y, width, height
                    feats[feats.count++] = {x:x, y:y, width:xsize, height:ysize};
                }
            }
        }
    }
}
function equals(r1, r2, eps)
{
    var delta = eps * (Min(r1.width, r2.width) + Min(r1.height, r2.height)) * 0.5;
    return Abs(r1.x - r2.x) <= delta &&
        Abs(r1.y - r2.y) <= delta &&
        Abs(r1.x + r1.width - r2.x - r2.width) <= delta &&
        Abs(r1.y + r1.height - r2.y - r2.height) <= delta;
}
function is_inside(r1, r2, eps)
{
    var dx = r2.width * eps, dy = r2.height * eps;
    return (r1.x >= r2.x - dx) &&
        (r1.y >= r2.y - dy) &&
        (r1.x + r1.width <= r2.x + r2.width + dx) &&
        (r1.y + r1.height <= r2.y + r2.height + dy);
}
function add(r1, r2)
{
    r1.x += r2.x;
    r1.y += r2.y;
    r1.width += r2.width;
    r1.height += r2.height;
    return r1;
}
function snap_to_grid(r)
{
    r.x = Round(r.x);
    r.y = Round(r.y);
    r.width = Round(r.width);
    r.height = Round(r.height);
    r.area = r.width*r.height;
    return r;
}
function by_area(r1, r2) {return r2.area-r1.area;}
// merge the detected features if needed
function merge_features(rects, min_neighbors, epsilon)
{
    var rlen = rects.length, ref = new Array(rlen), feats = [],
        nb_classes = 0, neighbors, r, found = false, i, j, n, t, ri;

    // original code
    // find number of neighbour classes
    for (i = 0; i < rlen; ++i) ref[i] = 0;
    for (i = 0; i < rlen; ++i)
    {
        found = false;
        for (j = 0; j < i; ++j)
        {
            if (equals(rects[j], rects[i], epsilon))
            {
                found = true;
                ref[i] = ref[j];
            }
        }

        if (!found)
        {
            ref[i] = nb_classes;
            ++nb_classes;
        }
    }

    // merge neighbor classes
    neighbors = new Array(nb_classes);  r = new Array(nb_classes);
    for (i = 0; i < nb_classes; ++i) {neighbors[i] = 0;  r[i] = {x:0,y:0,width:0,height:0};}
    for (i = 0; i < rlen; ++i) {ri=ref[i]; ++neighbors[ri]; add(r[ri], rects[i]);}
    for (i = 0; i < nb_classes; ++i)
    {
        n = neighbors[i];
        if (n >= min_neighbors)
        {
            t = 1/(n + n);
            ri = {
                x:t*(r[i].x * 2 + n),  y:t*(r[i].y * 2 + n),
                width:t*(r[i].width * 2 + n),  height:t*(r[i].height * 2 + n)
            };

            feats.push(ri);
        }
    }

    // filter inside rectangles
    rlen = feats.length;
    for (i=0; i<rlen; ++i)
    {
        for (j=i+1; j<rlen; ++j)
        {
            if (!feats[i].isInside && is_inside(feats[i], feats[j], epsilon))
                feats[i].isInside = true;
            if (!feats[j].isInside && is_inside(feats[j], feats[i], epsilon))
                feats[j].isInside = true;
        }
    }
    i = rlen;
    while (--i >= 0)
    {
        if (feats[i].isInside) feats.splice(i, 1);
        else snap_to_grid(feats[i]);
    }

    return feats.sort(by_area);
}

// expose as static utility methods, can be overriden
FILTER.Util.Filter.haar_detect = haar_detect;
FILTER.Util.Filter.merge_features = merge_features;

}(FILTER);/**
*
* TemplateMatcher
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var GLSL = FILTER.Util.GLSL, FilterUtil = FILTER.Util.Filter,
    sat = FilterUtil.sat, minmax = FilterUtil.minmaxloc,
    stdMath = Math, clamp = FILTER.Util.Math.clamp,
    A32F = FILTER.Array32F;

// Template matching using fast normalized cross correlation, Briechle, Hanebeck, 2001
// https://www.semanticscholar.org/paper/Template-matching-using-fast-normalized-cross-Briechle-Hanebeck/3632776737dc58adf0e278f9a7cafbeb6c1ec734)
FILTER.Create({
    name : "TemplateMatcherFilter"

    ,path: FILTER.Path

    ,_update: false // filter by itself does not alter image data, just processes information
    ,hasMeta: true
    ,hasInputs: true
    ,scale: 1
    ,rotation: 0
    ,_q: 0.98
    ,_s: 3
    ,_tpldata: null
    ,_draw: false

    ,init: function(tpl, scale, rotation) {
        var self = this;
        if (tpl) self.setInput("template", tpl);
        self.scale = scale || 1;
        self.rotation = rotation || 0;
    }

    ,dispose: function() {
        var self = this;
        self._tpldata = null;
        self.$super('dispose');
        return self;
    }

    ,quality: function(quality, size) {
        var self = this;
        self._q = null == quality ? 0.98 : (quality || 0);
        self._s = null == size ? 3 : (size || 0);
        self._tpldata = null;
        return self;
    }

    ,tpldata: function(withBasis, channel) {
        var self = this, needsUpdate = self.isInputUpdated("template"), tpl = self.input("template");
        if (!tpl)
        {
            self._tpldata = null;
        }
        else if (withBasis)
        {
            if (needsUpdate || !self._tpldata || !self._tpldata.basis)
                self._tpldata = preprocess_tpl(tpl[0], tpl[1], tpl[2], 1 - self._q, self._s, channel);
        }
        else
        {
            if (needsUpdate || !self._tpldata)
                self._tpldata = preprocess_tpl(tpl[0], tpl[1], tpl[2]);
        }
        return self._tpldata;
    }

    ,serialize: function() {
        var self = this;
        return {
             scale: self.scale
            ,rotation: self.rotation
            ,_q: self._q
            ,_s: self._s
        };
    }

    ,unserialize: function(params) {
        var self = this;
        self.scale = params.scale;
        self.rotation = params.rotation;
        self._q = params._q;
        self._s = params._s;
        return self;
    }

    ,getGLSL: function() {
        return glsl(this);
    }

    ,apply: function(im, w, h) {
        var self = this, tpldata = self.tpldata(true), t = self.input("template");

        self.meta = [];
        if (!t || !tpldata) return im;

        var tpl = t[0], tw = t[1], th = t[2],
            sc = self.scale, rot = self.rotation,
            tws = stdMath.round(sc*tw),
            ths = stdMath.round(sc*th),
            m = im.length, n = tpl.length,
            mm = w*h, nn = tw*th,
            tpldata, sat1, sat2, out,
            k, x, y;

        if (self._draw)
        {
            self._update = true;
            for (var c=0; c<3; ++c)
            {
                var bb = tpldata.basis[c];
                for (var k=0,K=bb.length; k<K; ++k)
                {
                    var bk = bb[k];
                    for (var yk=bk.y0,wyk=w*yk; yk<bk.y1; ++yk,wyk+=w)
                    {
                        for (var xk=bk.x0; xk<bk.x1; ++xk)
                        {
                            im[((xk + wyk) << 2) + c] = bk.k;
                        }
                    }
                }
            }
        }
        else
        {
            self._update = false;
            out = new A32F(mm);
            sat1 = [new A32F(mm), new A32F(mm), new A32F(mm)];
            sat2 = [new A32F(mm), new A32F(mm), new A32F(mm)];
            sat(im, w, h, 2, 0, sat1[0], sat2[0]); // R
            sat(im, w, h, 2, 1, sat1[1], sat2[1]); // G
            sat(im, w, h, 2, 2, sat1[2], sat2[2]); // B

            for (k=0,x=0,y=0; k<m; k+=4,++x)
            {
                if (x >= w) {x=0; ++y;}
                if (x + tws >= w || y + ths >= h)
                {
                    out[k>>>2] = 0;
                }
                else
                {
                    out[k>>>2] = (
                      ncc(x, y, sat1[0], sat2[0], tpldata.basis[0], w, h, tw, th, sc, rot) // R
                    + ncc(x, y, sat1[1], sat2[1], tpldata.basis[1], w, h, tw, th, sc, rot) // G
                    + ncc(x, y, sat1[2], sat2[2], tpldata.basis[2], w, h, tw, th, sc, rot) // B
                    );
                }
            }

            self.meta = minmax(out, w, h).maxpos.map(function(p) {return {x:p.x, y:p.y, width:tws, height:ths};});
            out = null; sat1 = null; sat2 = null;
        }
        return im;
    }
});
function ncc(x, y, sat1, sat2, basis, w, h, tw, th, sc, rot)
{
    var tws = stdMath.round(sc*tw),
        ths = stdMath.round(sc*th),
        //area = tws*ths,
        k, K, bk,
        x0 = clamp(x-1, 0, w-1),
        x1 = clamp(x0+tws, 0, w-1),
        y0 = clamp(y-1, 0, h-1),
        y1 = clamp(y0+ths, 0, h-1),
        wy0 = w*y0, wy1 = w*y1,
        sum1 = sat1[x1 + wy1] - sat1[x0 + wy1] - sat1[x1 + wy0] + sat1[x0 + wy0],
        sum2 = sat2[x1 + wy1] - sat2[x0 + wy1] - sat2[x1 + wy0] + sat2[x0 + wy0],
        denom = stdMath.sqrt(stdMath.abs(sum2 - sum1*sum1)/* / area*/) /** (nrg)*/, // template energy is constant, can be left out
        nom = 0;
    for (k=0,K=basis.length; k<K; ++k)
    {
        bk = basis[k];
        x0 = clamp(x-1+stdMath.round(sc*bk.x0), 0, w-1);
        x1 = clamp(x+stdMath.round(sc*bk.x1), 0, w-1);
        y0 = clamp(y-1+stdMath.round(sc*bk.y0), 0, h-1);
        y1 = clamp(y+stdMath.round(sc*bk.y1), 0, h-1);
        wy0 = w*y0; wy1 = w*y1;
        nom += bk.k * (sat1[x1 + wy1] - sat1[x1 + wy0] - sat1[x0 + wy1] + sat1[x0 + wy0]);
    }
    return (nom / denom);
}
function preprocess_tpl(t, w, h, Jmax, minSz, channel)
{
    var tr = 0, tg = 0, tb = 0, a, b, s,
        l = t.length, n = w*h, p;
    for (p=0; p<l; p+=4)
    {
        tr += t[p  ]/n;
        tg += t[p+1]/n;
        tb += t[p+2]/n;
    }
    a = [tr, tg, tb];
    if (null != Jmax)
    {
        b = [[], [], []];
        s = [null, null, null];
        if (null != channel)
        {
            sat(t, w, h, 2, channel, s[channel] = new A32F(n));
            b[channel] = approximate(t, s[channel], [{k:a[channel],x0:0,x1:w-1,y0:0,y1:h-1}], w, h, channel, Jmax, minSz);
        }
        else
        {
            sat(t, w, h, 2, 0, s[0] = new A32F(n));
            sat(t, w, h, 2, 1, s[1] = new A32F(n));
            sat(t, w, h, 2, 2, s[2] = new A32F(n));
            b = [
            approximate(t, s[0], [{k:a[0],x0:0,x1:w-1,y0:0,y1:h-1}], w, h, 0, Jmax, minSz),
            approximate(t, s[1], [{k:a[1],x0:0,x1:w-1,y0:0,y1:h-1}], w, h, 1, Jmax, minSz),
            approximate(t, s[2], [{k:a[2],x0:0,x1:w-1,y0:0,y1:h-1}], w, h, 2, Jmax, minSz)
            ];
        }
    }
    return {avg:a, basis:b||null, sat:s||null};
}
function approximate(t, s, b, w, h, c, Jmax, minSz)
{
    var J = 0, J2, Jmin, bmin,
        x0, x1, y0, y1, ww, hh,
        x, y, xx, yy, yw, avg1, avg2,
        p, l = t.length, n = w*h,
        v, k, K = b.length, bk, bb;
    for (p=0,x=0,y=0; p<l; p+=4,++x)
    {
        if (x >= w) {x=0; ++y;}
        v = t[p+c] / 255;
        for (k=0; k<K; ++k)
        {
            bk = b[k];
            if (bk.x0 <= x && bk.x1 >= x && bk.y0 <= y && bk.y1 >= y)
                v -= bk.k / 255;
        }
        J += v*v / n;
    }
    while (J > Jmax)
    {
        Jmin = J;
        bmin = b;
        K = b.length;
        for (k=0; k<K; ++k)
        {
            bk = b[k];
            if (minSz >= bk.x1 - bk.x0 + 1 && minSz >= bk.y1 - bk.y0 + 1) continue;
            for (x=bk.x0+1; x+1<bk.x1; ++x)
            {
                J2 = J;
                hh = bk.y1-bk.y0+1;
                y0 = clamp(bk.y0-1, 0, bk.y1);
                y1 = clamp(bk.y1, 0, bk.y1);
                x0 = clamp(bk.x0-1, 0, bk.x1);
                x1 = clamp(x, 0, bk.x1);
                ww = x-bk.x0+1;
                avg1 = (s[x1 + w*y1] - s[x1 + w*y0] - s[x0 + w*y1] + s[x0 + w*y0]) / (ww*hh);
                x0 = clamp(x, 0, bk.x1);
                x1 = clamp(bk.x1, 0, bk.x1);
                ww = bk.x1-(x+1)+1;
                avg2 = (s[x1 + w*y1] - s[x1 + w*y0] - s[x0 + w*y1] + s[x0 + w*y0]) / (ww*hh);
                for (xx=bk.x0; xx<=x; ++xx)
                {
                    for (yy=bk.y0,yw=yy*w; yy<=bk.y1; ++yy,yw+=w)
                    {
                        p = (x + yw) << 2;
                        v = (t[p+c] - bk.k)/255;
                        J2 -= v*v/n;
                        v = (t[p+c] - avg1)/255;
                        J2 += v*v/n;
                    }
                }
                for (xx=x+1; xx<=bk.x1; ++xx)
                {
                    for (yy=bk.y0,yw=yy*w; yy<=bk.y1; ++yy,yw+=w)
                    {
                        p = (x + yw) << 2;
                        v = (t[p+c] - bk.k)/255;
                        J2 -= v*v/n;
                        v = (t[p+c] - avg2)/255;
                        J2 += v*v/n;
                    }
                }
                if (J2 < Jmin)
                {
                    Jmin = J2;
                    bmin = b.slice(0, k);
                    bmin.push({k:avg1, x0:bk.x0, x1:x, y0:bk.y0, y1:bk.y1});
                    bmin.push({k:avg2, x0:x+1, x1:bk.x1, y0:bk.y0, y1:bk.y1});
                    bmin.push.apply(bmin, b.slice(k+1));
                }
            }
            for (y=bk.y0+1; y+1<bk.y1; ++y)
            {
                J2 = J;
                ww = bk.x1-bk.yx0+1;
                x0 = clamp(bk.x0-1, 0, bk.x1);
                x1 = clamp(bk.x1, 0, bk.x1);
                y0 = clamp(bk.y0-1, 0, bk.y1);
                y1 = clamp(y, 0, bk.y1);
                hh = y-bk.y0+1;
                avg1 = (s[x1 + w*y1] - s[x1 + w*y0] - s[x0 + w*y1] + s[x0 + w*y0]) / (ww*hh);
                y0 = clamp(y, 0, bk.y1);
                y1 = clamp(bk.y1, 0, bk.y1);
                hh = bk.y1-(y+1)+1;
                avg2 = (s[x1 + w*y1] - s[x1 + w*y0] - s[x0 + w*y1] + s[x0 + w*y0]) / (ww*hh);
                for (yy=bk.y0,yw=yy*w; yy<=y; ++yy,yw+=w)
                {
                    for (xx=bk.x0; xx<=bk.x1; ++xx)
                    {
                        p = (x + yw) << 2;
                        v = (t[p+c] - bk.k)/255;
                        J2 -= v*v/n;
                        v = (t[p+c] - avg1)/255;
                        J2 += v*v/n;
                    }
                }
                for (yy=y+1,yw=yy*w; yy<=bk.y1; ++yy,yw+=w)
                {
                    for (xx=bk.x0; xx<=bk.x1; ++xx)
                    {
                        p = (x + yw) << 2;
                        v = (t[p+c] - bk.k)/255;
                        J2 -= v*v/n;
                        v = (t[p+c] - avg2)/255;
                        J2 += v*v/n;
                    }
                }
                if (J2 < Jmin)
                {
                    Jmin = J2;
                    bmin = b.slice(0, k);
                    bmin.push({k:avg1, x0:bk.x0, x1:x, y0:bk.y0, y1:bk.y1});
                    bmin.push({k:avg2, x0:x+1, x1:bk.x1, y0:bk.y0, y1:bk.y1});
                    bmin.push.apply(bmin, b.slice(k+1));
                }
            }
        }
        if (bmin === b) break;
        J = Jmin;
        b = bmin;
    }
    return b;
}
function glsl(filter)
{
    var glslcode = (new GLSL.Filter(filter))
    .begin()
    .shader(function(glsl, im) {
        var tpldata = filter.tpldata(), tpl = filter.input("template");
        filter.meta = [];
        glsl.io().im = im;
        glsl.io().tpl = {data:tpl[0], width:tpl[1], height:tpl[2]};
        glsl.io().avgT = [tpldata.avg[0]/255, tpldata.avg[1]/255, tpldata.avg[2]/255];
        return im;
    })
    .end()
    .begin()
    .shader([
    'varying vec2 pix;',
    'uniform sampler2D img;',
    'uniform sampler2D tpl;',
    'uniform vec2 imgSize;',
    'uniform vec2 tplSize;',
    'uniform vec3 avgT;',
    'uniform float scale;',
    'uniform float rotation;',
    'void main(void) {',
    '    vec2 tplSizeScaled = tplSize * scale;',
    '    if (pix.y*imgSize.y + tplSizeScaled.y > imgSize.y || pix.x*imgSize.x + tplSizeScaled.x > imgSize.x)',
    '    {',
    '        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
    '    }',
    '    else',
    '    {',
    '        int tplW = int(tplSizeScaled.x); int tplH = int(tplSizeScaled.y);',
    '        float N = tplSizeScaled.x*tplSizeScaled.y;',
    '        vec4 F; vec4 T;',
    '        vec3 avgF = vec3(0.0); /*vec3 avgT = vec3(0.0);*/',
    '        vec3 dF; vec3 dT;',
    '        vec3 sumFF = vec3(0.0); vec3 sumTT = vec3(0.0); vec3 sumFT = vec3(0.0);',
    '        float ii; float jj;',
    '        for (int i = 0; i < 1000; i++)',
    '        {',
    '            if (i >= tplH) break;',
    '            ii = float(i);',
    '            for (int j = 0; j < 1000; j++)',
    '            {',
    '                if (j >= tplW) break;',
    '                jj = float(j);',
    '                F = texture2D(img, pix + vec2(jj, ii) / imgSize);',
    '                /*T = texture2D(tpl, vec2(jj, ii) / tplSizeScaled);*/',
    '                avgF.rgb += F.rgb; /*avgT.rgb += T.rgb;*/',
    '            }',
    '        }',
    '        avgF /= N; /*avgT /= N;*/',
    '        for (int i = 0; i < 1000; i++)',
    '        {',
    '            if (i >= tplH) break;',
    '            ii = float(i);',
    '            for (int j = 0; j < 1000; j++)',
    '            {',
    '                if (j >= tplW) break;',
    '                jj = float(j);',
    '                F = texture2D(img, pix + vec2(jj, ii) / imgSize);',
    '                T = texture2D(tpl, vec2(jj, ii) / tplSizeScaled);',
    '                dF.rgb = F.rgb - avgF.rgb; dT.rgb = T.rgb - avgT.rgb;',
    '                sumFF += dF * dF;',
    '                sumTT += dT * dT;',
    '                sumFT += dF * dT;',
    '            }',
    '        }',
    '        vec3 ncc = vec3(0.0 < sumFF.r && 0.0 < sumTT.r ? (sumFT.r/sqrt(sumFF.r*sumTT.r)) : 1.0,0.0 < sumFF.g && 0.0 < sumTT.g ? (sumFT.g/sqrt(sumFF.g*sumTT.g)) : 1.0,0.0 < sumFF.b && 0.0 < sumTT.b ? (sumFT.b/sqrt(sumFF.b*sumTT.b)) : 1.0);',
    '        float score = min(max((abs(ncc.r) + abs(ncc.g) + abs(ncc.b)) / 3.0, 0.0), 1.0);',
    '        gl_FragColor = vec4(score, score, score, 1.0);',
    '    }',
    '}'
    ].join('\n'))
    .input('tpl', function(filter, w, h, w2, h2, io) {
        return io.tpl;
    })
    .input('imgSize', function(filter, w, h) {
        return [w, h];
    })
    .input('tplSize', function(filter, w, h, w2, h2, io) {
        return [io.tpl.width, io.tpl.height];
    })
    .input('avgT', function(filter, w, h, w2, h2, io) {
        return io.avgT;
    })
    .input('scale', function(filter) {return filter.scale || 1;})
    .input('rotation', function(filter) {return filter.rotation || 0;})
    .end()
    .begin()
    .shader(function(glsl, im, w, h) {
        var tw = glsl.io().tpl.width, th = glsl.io().tpl.height,
            tws = stdMath.round(filter.scale*tw),
            ths = stdMath.round(filter.scale*th);
        filter.meta = minmax(im, w, h, null, null, 4, 0).maxpos.map(function(p) {return {x:p.x, y:p.y, width:tws, height:ths};});
        return glsl.io().im;
    })
    .end();
    return glslcode.code();
}
}(FILTER);/* main code ends here */
/* export the module */
return FILTER;
});