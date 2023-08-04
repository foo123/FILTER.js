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

}(this, FILTER);