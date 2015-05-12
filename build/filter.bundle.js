/**
*
*   Classy.js
*   @version: 0.9.3
*   @built on 2015-04-26 17:56:03
*
*   Object-Oriented micro-framework for JavaScript
*   https://github.com/foo123/classy.js
*
**/!function(e,n,t){"use strict";var i,r="object"==typeof module&&module.exports,l="function"==typeof define&&define.amd;r?module.exports=(module.$deps=module.$deps||{})[n]=module.$deps[n]||t.call(e,{NODE:module})||1:l&&"function"==typeof require&&"function"==typeof require.specified&&require.specified(n)?define(n,["require","exports","module"],function(n,i,r){return t.call(e,{AMD:r})}):n in e||(e[n]=i=t.call(e,{})||1)&&l&&define(n,[],function(){return i})}(this,"Classy",function(e){return!function(e,n){"use strict";var t="constructor",i="prototype",r="__proto__",l="__static__",u="__private__",a="$super",o="$static",f="$latestatic",c="$class",s=2,b=4,m=8,d=256,p=Object,v=p[i],g=Function,h=g[i],y=String,x=Number,w=RegExp,E=Array,j=v.toString,_=(h.call.bind(h.toString),"hasOwnProperty"),q="propertyIsEnumerable",I=p.keys,$=p.defineProperty,A=function(e){return typeof e},C=function(e){throw new TypeError(e)},M=2,N=3,O=4,P=8,S=9,T=16,R=32,D=64,F=128,L=256,V=512,k=1024,B={"[object Array]":T,"[object RegExp]":F,"[object Number]":M,"[object String]":P,"[object Function]":D,"[object Object]":R},U=function(e){var t;return null===e?L:!0===e||!1===e?O:n===e?V:(t=j.call(e),t=B[t]||k,M===t||e instanceof x?isNaN(e)?N:M:P===t||e instanceof y?1===e.length?S:P:T===t||e instanceof E?T:F===t||e instanceof w?F:D===t||e instanceof g?D:R===t?R:k)},z=function(e,n){var t,i=n.length,r=[].concat(e);for(t=0;i>t;t++)-1<r.indexOf(n[t])||r.push(n[t]);return r},G=function(e,n){R!==U(e)&&C("bad desc");var t={};if(e[_]("enumerable")&&(t.enumerable=!!n.enumerable),e[_]("configurable")&&(t.configurable=!!n.configurable),e[_]("value")&&(t.value=n.value),e[_]("writable")&&(t.writable=!!e.writable),e[_]("get")){var i=e.get;D!==U(i)&&"undefined"!==i&&C("bad get"),t.get=i}if(e[_]("set")){var r=e.set;D!==U(r)&&"undefined"!==r&&C("bad set"),t.set=r}return("get"in t||"set"in t)&&("value"in t||"writable"in t)&&C("identity-confused descriptor"),t},H=p.defineProperties||function(e,n){("object"!==A(e)||null===e)&&C("bad obj"),n=p(n);for(var t=I(n),i=[],r=0;r<t.length;r++)i.push([t[r],G(n[t[r]],e)]);for(var r=0;r<i.length;r++)$(e,i[r][0],i[r][1]);return e},J=function(){},K=p.create||function(e,n){var t,l=function(){};return l[i]=e,t=new l,t[r]=e,"object"===A(n)&&H(t,n),t},Q=function(){var e,n,t,i,r,l,u,a=arguments;for(n=a[0]||{},e=a.length,l=1;e>l;l++)if(t=a[l],R===U(t))for(r in t)t[_](r)&&t[q](r)&&(i=t[r],u=U(i),n[r]=M&u?0+i:(P|T)&u?i.slice(0):i);return n},W=function(e,n,i){var r,l,u=!!n;if(u||i)if(r={},n=u?n+"$":n,i&&D===U(i))for(l in e)e[_](l)&&(t!==l?(u&&D===U(e[l])&&(r[n+l]=e[l]),r[i(l,e[l])]=e[l]):r[l]=e[l]);else for(l in e)e[_](l)&&(t!==l?(u&&D===U(e[l])&&(r[n+l]=e[l]),i&&l in i?r[i[l]]=e[l]:r[l]=e[l]):r[l]=e[l]);else r=e;return r},X=function(e){var n=e[a]||J,t=e[a+"v"]||J,i=null;return[function(t,r,l,u,a,o,f,c,s,b,m){var d,p;return i===t?d=n.call(this,t,r,l,u,a,o,f,c,s,b,m):(p=e[t])&&(i=t,d=p.call(this,r,l,u,a,o,f,c,s,b,m),i=null),d},function(n,r){var l,u;return i===n?l=t.call(this,n,r):(u=e[n])&&(i=n,l=r&&r.length?u.apply(this,r):u.call(this),i=null),l}]},Y=function(e,n){return this instanceof Y?(this.factory=e,void(this.qualifier=(M===U(n)?n:0)|s)):new Y(e,n)},Z=function(e,n){return this instanceof Z?(this.prop=e,void(this.qualifier=(M===U(n)?n:0)|s)):new Z(e,n)},en=function(e,r,s,v){e=e||p,r=r||{};var g,h,y,x,w,E,j,q,$,A,C=e[o]||null,N=e[f]||{},O=e[i],S=null,F=Q({},N),L=null,V={};r[_](t)||(r[t]=function(){}),g=r[t],r[_](u)&&(V=r[u]||{},delete r[u]),r[_](l)&&(S=r[l],L=I(S),delete r[l]);for($ in r)if(r[_]($)){if(A=r[$],A instanceof Y){if(m&A.qualifier){d&A.qualifier?F[$]=A:((S=S||{})[$]=A.factory(e,V,g),(L=L||[]).push($)),delete r[$];continue}if(b&A.qualifier){V[$]=A,delete r[$];continue}A=r[$]=A.factory(O,V,g)}D===U(A)&&(A[a]=O[$]||J)}for($ in V)V[_]($)&&(A=V[$],A instanceof Y&&(A=V[$]=A.factory(O,V,g)),D!==U(A)&&delete V[$]);if(g[i]=W(K(O),s,v),g[i]=Q(g[i],r),h=X(O),w={},w[c]=w[t]={value:g,enumerable:!1,writable:!0,configurable:!0},w[a]={value:h[0],enumerable:!1,writable:!0,configurable:!0},w[a+"v"]={value:h[1],enumerable:!1,writable:!0,configurable:!0},H(g[i],w),w={},C||L)for(C=z(C||[],L||[]),x=C.length,y=0;x>y;y++){if(E=C[y],j=null,S&&n!==S[E]){if((A=S[E])instanceof Y){if((m|d)&A.qualifier){F[E]=A;continue}j=A.factory(e,V,g)}else{if(F[_](E))continue;j=S[E]}D===U(j)&&(j[a]=e[E]||J)}else n!==e[E]&&(q=U(e[E]),j=R===q?Q(null,e[E]):(P|T)&q?e[E].slice(0):M&q?0+e[E]:e[E]);w[E]={value:j,enumerable:!1,writable:!0,configurable:!0}}for(E in F)F[_](E)&&(j=F[E].factory(e,V,g),w[E]={value:j,enumerable:!1,writable:!0,configurable:!0});return w[o]={value:C,enumerable:!1,writable:!0,configurable:!0},w[f]={value:F,enumerable:!1,writable:!0,configurable:!0},w[a]={value:e,enumerable:!1,writable:!0,configurable:!0},H(g,w),g},nn=Q,tn=Q,rn=function(e){var t,r,l,u;if(D===U(e)){if(a in e&&(e[a]=n),c in e&&(e[c]=n),f in e&&(e[f]=n),o in e){for(l=e[o],t=0,r=l.length;r>t;t++)u=l[t],u in e&&(D===U(e[u])&&e[u][a]&&(e[u][a]=n),e[u]=n);e[o]=n}l=e[i];for(u in l)D===U(l[u])&&(l[u][a]&&(l[u][a]=n),l[u]=n);l[a]=n,l[a+"v"]=n}},ln=function(){var e=arguments,n=e.length,t=null;if(m===e[0])return e[1]||{};if(n>=2){var r=U(e[0]);r=D===r?{Extends:e[0]}:R===r?e[0]:{Extends:p};var l,u,a=e[1]||{},o={},f=r[_]("Extends")?r.Extends:r[_]("extends")?r["extends"]:p,c=r[_]("Implements")?r.Implements:r[_]("implements")?r["implements"]:null,s=r[_]("Mixin")?r.Mixin:r[_]("mixin")?r.mixin:null,b=null;if(c=c?[].concat(c):null,s=s?[].concat(s):null)for(l=0,u=s.length;u>l;l++)R===U(s[l])?s[l][_]("mixin")&&s[l].mixin&&s[l].mixin[i]&&(b=W(s[l].mixin[i],s[l].namespace||null,s[l].as||null),o=tn(o,b)):s[l][i]&&(b=s[l][i],o=tn(o,b));if(c)for(l=0,u=c.length;u>l;l++)R===U(c[l])?c[l][_]("implements")&&c[l]["implements"]&&c[l]["implements"][i]&&(b=W(c[l].implements[i],c[l].namespace||null,c[l].as||null),o=nn(o,b)):c[l][i]&&(b=c[l][i],o=nn(o,b));t=R===U(f)?en(f.extends||p,Q(o,a),f.namespace||null,f.as||null):en(f,Q(o,a))}else t=en(p,e[0]);return t};e.Classy={VERSION:"0.9.3",PUBLIC:s,STATIC:m,LATE:d,PRIVATE:b,Type:U,Create:K,Merge:Q,Alias:W,Implements:nn,Mixin:tn,Extends:en,Dispose:rn,Method:Y,Prop:Z,Class:ln}}(e),e.Classy});
/**
*
*   Asynchronous.js
*   @version: 0.4.5
*
*   Simple JavaScript class to manage asynchronous, parallel, linear, sequential and interleaved tasks
*   https://github.com/foo123/asynchronous.js
*
**/!function(n,e,t){"use strict";var r,o="object"==typeof module&&module.exports,s="function"==typeof define&&define.amd;o?module.exports=(module.$deps=module.$deps||{})[e]=module.$deps[e]||t.call(n,{NODE:module})||1:s&&"function"==typeof require&&"function"==typeof require.specified&&require.specified(e)?define(e,["require","exports","module"],function(e,r,o){return t.call(n,{AMD:o})}):e in n||(n[e]=r=t.call(n,{})||1)&&s&&define(e,[],function(){return r})}(this,"Asynchronous",function(exports){return!function(root,exports,undef){"use strict";function formatOptions(n){var e,t=[];if(n)for(e in n)t.push(e+"="+n[e]);return t.join(",")}function runParallelised(n){n.$runmode=PARALLELISED,n.$running=!1}function runLinearised(n,e){var t,r=n,o=r.$queue;if(r.$runmode=LINEARISED,o){for(;o.length&&(!o[0]||!o[0].canRun());)o.shift();o.length?(r.$running=!0,t=o.shift(),e?t.runWithArgs(e):t.run(),t.complete()):r.$running=!1}}function runInterleaved(n,e){var t,r=n,o=r.$queue,s=0;if(r.$runmode=INTERLEAVED,o&&o.length){for(r.$running=!0;s<o.length;)t=o[s],t&&t.canRun()?(e?t.runWithArgs(e):t.run(),t.isFinished()?(o.shift(),t.complete()):s++):o.shift();r.$running=!1,r.$timer=SetTime(curry(runInterleaved,r),r.$interval)}}function runSequenced(n,e){var t,r=n,o=r.$queue;r.$runmode=SEQUENCED,o&&o.length&&(t=o[0],t&&t.canRun()?(r.$running=!0,e?t.runWithArgs(e):t.run(),t.isFinished()&&(o.shift(),t.complete())):o.shift(),r.$running=!1,r.$timer=SetTime(curry(runSequenced,r),r.$interval))}var PROTO="prototype",HAS="hasOwnProperty",Obj=Object,Arr=Array,Func=Function,FP=Func[PROTO],OP=Obj[PROTO],AP=Arr[PROTO],slice=FP.call.bind(AP.slice),toString=OP.toString,is_function=function(n){return"function"==typeof n},is_instance=function(n,e){return n instanceof e},SetTime=setTimeout,ClearTime=clearTimeout,UNDEFINED=undef,UNKNOWN=0,NODE=1,BROWSER=2,DEFAULT_INTERVAL=60,NONE=0,INTERLEAVED=1,LINEARISED=2,PARALLELISED=3,SEQUENCED=4,isNode="undefined"!=typeof global&&"[object global]"===toString.call(global),isNodeProcess=!(!isNode||!process.env.NODE_UNIQUE_ID),isBrowser=!isNode&&"undefined"!=typeof navigator,isWebWorker=isBrowser&&"function"==typeof importScripts&&is_instance(navigator,WorkerNavigator),isBrowserWindow=isBrowser&&!isWebWorker&&!!root.opener,isAMD="function"==typeof define&&define.amd,supportsMultiThread=isNode||"function"==typeof Worker,isThread=isNodeProcess||isWebWorker,Thread,numProcessors=isNode?require("os").cpus().length:4,fromJSON=JSON.parse,toJSON=JSON.stringify,onMessage,curry=function(n,e){return function(){return n(e)}},URL="undefined"!=typeof root.webkitURL?root.webkitURL:"undefined"!=typeof root.URL?root.URL:null,blobURL=function(n,e){return n&&URL?URL.createObjectURL(new Blob(n.push?n:[n],e||{type:"text/javascript"})):n},path=function(n){var e;return isNode?{file:__filename,path:__dirname}:isWebWorker?{file:e=self.location.href,path:e.split("/").slice(0,-1).join("/")}:isAMD&&n&&n.uri?{file:e=n.uri,path:e.split("/").slice(0,-1).join("/")}:isBrowser&&(e=document.getElementsByTagName("script"))&&e.length?{file:e=e[e.length-1].src,path:e.split("/").slice(0,-1).join("/")}:{path:null,file:null}},thisPath=path(exports.AMD),tpf=thisPath.file,notThisPath=function(n){return!(!n||!n.length||n===tpf)},extend=function(n,e){if(n=n||{},e)for(var t in e)e[HAS](t)&&(n[t]=e[t]);return n},_uuid=0;if(onMessage=isWebWorker?function(n){n&&(onmessage=n)}:isNodeProcess?function(n){n&&process.on("message",function(e){n(fromJSON(e))})}:function(){},isNode){var fs=require("fs"),ps=require("child_process");root.close=function(){process.exit()},root.postMessage=function(n){process.send(toJSON({data:n}))},root.importScripts=function(scripts){if(scripts&&(scripts=scripts.split(",")).length)for(var i=0,src,ok;i<scripts.length;){ok=!0;try{src=fs.readFileSync(scripts[i++]),eval(src)}catch(e){ok=e}if(!0!==ok)throw ok}},Thread=function(n){var e=this;e.process=ps.fork(n),e.process.on("message",function(n){e.onmessage&&e.onmessage(fromJSON(n))}),e.process.on("error",function(n){e.onerror&&e.onerror(n)})},Thread[PROTO]={constructor:Thread,process:null,onmessage:null,onerror:null,postMessage:function(n){return this.process&&this.process.send(toJSON({data:n})),this},terminate:function(){return this.process&&(this.process.kill(),this.process=null),this}}}else Thread=root.Worker;var BrowserWindow=function(n){var e=this;return e instanceof BrowserWindow?(e.$id=(++_uuid).toString(16),void(e.options=extend({width:400,height:400,toolbar:"no",location:"no",directories:"no",status:"no",menubar:"no",scrollbars:"yes",resizable:"yes"},n))):new BrowserWindow(n)};BrowserWindow[PROTO]={constructor:BrowserWindow,options:null,$id:null,$window:null,dispose:function(){var n=this;return n.$window&&n.close(),n.$window=null,n.$id=null,n.options=null,n},close:function(){var n=this;return n.$window&&(n.$window.closed||n.$window.close(),n.$window=null),n},ready:function(n,e){var t=this,r=function o(){!t.$window||n&&!t.$window[n]?setTimeout(o,40):e()};return setTimeout(r,0),t},open:function(n){var e=this;return!e.$window&&n&&(e.$window=window.open(n.push?blobURL(["﻿"].concat(n),{type:"text/html;charset=utf-8"}):n,e.$id,formatOptions(e.options))),e},write:function(n){var e=this;return e.$window&&n&&e.$window.document.write(n),e}};var Task=function(n){if(n instanceof Task)return n;if(!(this instanceof Task))return new Task(n);var e,t=this,r=null,o=null,s=null,i=!1,u=!1,a=!1,l=!1,c=!1,f=!1,p=null,d=0,h=1,m=null,$=null,v=null,g=undef;t.queue=function(n){return arguments.length?(r=n,t):r},t.jumpNext=function(n){r&&r.jumpNext(!1,n)},t.abort=function(n){r&&(r.abort(!1),n&&(r.dispose(),r=null))},t.dispose=function(){r&&(r.dispose(),r=null)},t.task=function(n){return o=n,t},n&&t.task(n),t.run=e=function(){return o.jumpNext=t.jumpNext,o.abort=t.abort,o.dispose=t.dispose,g=o(),i=!0,o.jumpNext=null,o.abort=null,o.dispose=null,g},t.runWithArgs=function(n){return o.jumpNext=t.jumpNext,o.abort=t.abort,o.dispose=t.dispose,g=o.apply(null,n),i=!0,o.jumpNext=null,o.abort=null,o.dispose=null,g},t.canRun=function(){return o&&(!i||u||a||l||c||f)?(u||a)&&d>=m?!1:a&&!p?!1:(l||c)&&g===$?!1:!0:!1},t.iif=function(n,e,r){return n?t.task(e):arguments.length>2&&t.task(r),t},t.until=function(n){return g=undef,p=null,$=n,c=!0,f=!1,u=!1,a=!1,l=!1,t.run=e,t},t.untilNot=function(n){return g=undef,p=null,v=n,f=!0,c=!1,u=!1,a=!1,l=!1,t.run=e,t},t.loop=function(n,e,r){return g=undef,p=null,d=e||0,h=r||1,m=n,u=!0,c=!1,f=!1,a=!1,l=!1,t.run=function(){var n;return n=o(d),d+=h,g=n,i=!0,n},t},t.each=function(n){return g=undef,p=n,d=0,h=1,m=n?n.length||0:0,a=!0,c=!1,f=!1,u=!1,l=!1,t.run=function(){var n;return n=o(p[d],d),d++,g=n,i=!0,n},t},t.recurse=function(n,e){return p=null,g=n,$=e,l=!0,c=!1,f=!1,u=!1,a=!1,t.run=function(){var n;return n=o(g),g=n,i=!0,n},t},t.isFinished=function(){var n=!i||f||c||u||a||l;return n&&(c||l)&&g===$&&(n=!1),n&&f&&g!==v&&(n=!1),n&&(u||a)&&d>=m&&(n=!1),!n},t.onComplete=function(n){return s=n||null,t},t.complete=function(){return s&&is_function(s)&&s(),t}},Asynchronous=exports.Asynchronous=function(n,e){if(is_instance(n,Task))return n;if(is_function(n))return new Task(n);if(!is_instance(this,Asynchronous))return new Asynchronous(n);var t=this;t.$interval=arguments.length?parseInt(n,10):DEFAULT_INTERVAL,t.$timer=null,t.$runmode=NONE,t.$running=!1,t.$queue=[],isThread&&!1!==e&&t.initThread()};if(Asynchronous.VERSION="0.4.5",Asynchronous.Thread=Thread,Asynchronous.Task=Task,Asynchronous.BrowserWindow=BrowserWindow,Asynchronous.MODE={NONE:NONE,INTERLEAVE:INTERLEAVED,LINEAR:LINEARISED,PARALLEL:PARALLELISED,SEQUENCE:SEQUENCED},Asynchronous.Platform={UNDEFINED:UNDEFINED,UNKNOWN:UNKNOWN,NODE:NODE,BROWSER:BROWSER},Asynchronous.supportsMultiThreading=function(){return supportsMultiThread},Asynchronous.isPlatform=function(n){return NODE===n?isNode:BROWSER===n?isBrowser:undef},Asynchronous.isThread=function(n){return NODE===n?isNodeProcess:BROWSER===n?isWebWorker:isThread},Asynchronous.path=path,Asynchronous.blob=blobURL,Asynchronous.load=function(n,e,t){if(n){var r=function(){n=n.split(".");for(var e=root;n.length;)n[0]&&n[0].length&&e[n[0]]&&(e=e[n[0]]),n.shift();return e&&root!==e?is_function(e)?!1!==t?new e:e():e:void 0};return e&&e.length&&(e=e.filter(notThisPath),e.length&&importScripts(e.join(","))),r()}return null},Asynchronous.serialize=function(n){n=n||new Asynchronous;var e=function(e){var t=function(){var t=this,r=arguments;n.step(function(){e.apply(t,r)}),n.$running||n.run(LINEARISED)};return t.free=function(){return e},t};return e.free=function(){n&&n.dispose(),n=null},e},Asynchronous[PROTO]={constructor:Asynchronous,$interval:DEFAULT_INTERVAL,$timer:null,$queue:null,$thread:null,$events:null,$runmode:NONE,$running:!1,dispose:function(){var n=this;return n.unfork(!0),n.$timer&&ClearTime(n.$timer),n.$thread=null,n.$timer=null,n.$interval=null,n.$queue=null,n.$runmode=NONE,n.$running=!1,n},empty:function(){var n=this;return n.$timer&&ClearTime(n.$timer),n.$timer=null,n.$queue=[],n.$runmode=NONE,n.$running=!1,n},interval:function(n){return arguments.length?(this.$interval=parseInt(n,10),this):this.$interval},fork:function(n,e,t){var r,o,s,i=this;if(!i.$thread){if(!supportsMultiThread)throw i.$thread=null,new Error("Asynchronous: Multi-Threading is NOT supported!");isNode?(o="Asynchronous: Thread (Process): ",s="Asynchronous: Thread (Process) Error: "):(o="Asynchronous: Thread (Worker): ",s="Asynchronous: Thread (Worker) Error: "),i.$events=i.$events||{},r=i.$thread=new Thread(tpf),r.onmessage=function(n){if(n.data.event){var e=n.data.event,t=n.data.data||null;i.$events&&i.$events[e]?i.$events[e](t):("console.log"===e||"console.error"===e)&&console.log(o+(t.output||""))}},r.onerror=function(n){if(!i.$events||!i.$events.error)throw new Error(s+n.message+" file: "+n.filename+" line: "+n.lineno);i.$events.error(n)},i.send("initThread",{component:n||null,asInstance:!1!==t,imports:e?[].concat(e):null})}return i},unfork:function(n){var e=this;return e.$thread&&(e.send("dispose"),!0===n&&e.$thread.terminate()),e.$thread=null,e.$events=null,e},initThread:function(){var n=this;return isThread&&(n.$events={},onMessage(function(e){var t=e.data.event,r=e.data.data||null;t&&n.$events[t]?n.$events[t](r):"dispose"===t&&(n.dispose(),close())})),n},listen:function(n,e){return n&&is_function(e)&&this.$events&&(this.$events[n]=e),this},unlisten:function(n,e){return n&&this.$events&&this.$events[n]&&(2>arguments.length||e===this.$events[n])&&delete this.$events[n],this},send:function(n,e){return n&&(isThread?postMessage({event:n,data:e||null}):this.$thread&&this.$thread.postMessage({event:n,data:e||null})),this},task:function(n){return is_instance(n,Task)?n:is_function(n)?Task(n):void 0},iif:function(){var n=arguments,e=new Task;return e.iif.apply(e,n)},until:function(){var n=slice(arguments),e=new Task(n.pop());return e.until.apply(e,n)},untilNot:function(){var n=slice(arguments),e=new Task(n.pop());return e.untilNot.apply(e,n)},loop:function(){var n=slice(arguments),e=new Task(n.pop());return e.loop.apply(e,n)},each:function(){var n=slice(arguments),e=new Task(n.pop());return e.each.apply(e,n)},recurse:function(){var n=slice(arguments),e=new Task(n.pop());return e.recurse.apply(e,n)},step:function(n){var e=this;return n&&e.$queue.push(e.task(n).queue(e)),e},steps:function(){var n,e,t=this,r=arguments;for(e=r.length,n=0;e>n;n++)t.step(r[n]);return t},jumpNext:function(n,e){var t=this,r=t.$queue;return e=e||0,!1!==n?function(){return e<r.length&&(e>0&&r.splice(0,e),t.run(t.$runmode)),t}:(e<r.length&&(e>0&&r.splice(0,e),t.run(t.$runmode)),t)},jumpNextWithArgs:function(n,e,t){var r=this,o=r.$queue;return e=e||0,!1!==n?function(){return e<o.length&&(e>0&&o.splice(0,e),r.run(r.$runmode,arguments)),r}:(e<o.length&&(e>0&&o.splice(0,e),r.run(r.$runmode,t)),r)},abort:function(n,e){var t=this;return!1!==n?function(){return e&&e>0?SetTime(function(){t.empty()},e):t.empty(),t}:(e&&e>0?SetTime(function(){t.empty()},e):t.empty(),t)},run:function(n,e){var t=this;return arguments.length?t.$runmode=n:n=t.$runmode,e=e||null,SEQUENCED===n?runSequenced(t,e):INTERLEAVED===n?runInterleaved(t,e):LINEARISED===n?runLinearised(t,e):PARALLELISED===n&&runParallelised(t,e),t}},isThread){var Component=null;root.console={log:function(n){postMessage({event:"console.log",data:{output:n||""}})},error:function(n){postMessage({event:"console.error",data:{output:n||""}})}},onMessage(function(n){var e=n.data.event,t=n.data.data||null;switch(e){case"initThread":t&&t.component&&(Component&&(is_function(Component.dispose)&&Component.dispose(),Component=null),Component=Asynchronous.load(t.component,t.imports,t.asInstance));break;case"dispose":default:Component&&(is_function(Component.dispose)&&Component.dispose(),Component=null),close()}})}}(this,exports),exports.Asynchronous});
/**
*
*   FILTER.js
*   @version: 0.7
*   @built on 2015-05-12 04:46:27
*   @dependencies: Classy.js, Asynchronous.js
*
*   JavaScript Image Processing Library
*   https://github.com/foo123/FILTER.js
*
**/!function ( root, name, deps, factory ) {
    "use strict";
    
    //
    // export the module umd-style (with deps bundled-in or external)
    
    // Get current filename/path
    function getPath( isNode, isWebWorker, isAMD, isBrowser, amdMod ) 
    {
        var f;
        if (isNode) return {file:__filename, path:__dirname};
        else if (isWebWorker) return {file:(f=self.location.href), path:f.split('/').slice(0, -1).join('/')};
        else if (isAMD&&amdMod&&amdMod.uri)  return {file:(f=amdMod.uri), path:f.split('/').slice(0, -1).join('/')};
        else if (isBrowser&&(f=document.getElementsByTagName('script'))&&f.length) return {file:(f=f[f.length - 1].src), path:f.split('/').slice(0, -1).join('/')};
        return {file:null,  path:null};
    }
    function getDeps( names, paths, deps, depsType, require/*offset*/ )
    {
        //offset = offset || 0;
        var i, dl = names.length, mods = new Array( dl );
        for (i=0; i<dl; i++) 
            mods[ i ] = (1 === depsType)
                    ? /* node */ (deps[ names[ i ] ] || require( paths[ i ] )) 
                    : (2 === depsType ? /* amd args */ /*(deps[ i + offset ])*/ (require( names[ i ] )) : /* globals */ (deps[ names[ i ] ]))
                ;
        return mods;
    }
    // load javascript(s) (a)sync using <script> tags if browser, or importScripts if worker
    function loadScripts( scope, base, names, paths, callback, imported )
    {
        var dl = names.length, i, rel, t, load, next, head, link;
        if ( imported )
        {
            for (i=0; i<dl; i++) if ( !(names[ i ] in scope) ) importScripts( base + paths[ i ] );
            return callback( );
        }
        head = document.getElementsByTagName("head")[ 0 ]; link = document.createElement( 'a' );
        rel = /^\./; t = 0; i = 0;
        load = function( url, cb ) {
            var done = 0, script = document.createElement('script');
            script.type = 'text/javascript'; script.language = 'javascript';
            script.onload = script.onreadystatechange = function( ) {
                if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete'))
                {
                    done = 1; script.onload = script.onreadystatechange = null;
                    cb( );
                    head.removeChild( script ); script = null;
                }
            }
            if ( rel.test( url ) ) 
            {
                // http://stackoverflow.com/a/14781678/3591273
                // let the browser generate abs path
                link.href = base + url;
                url = link.protocol + "//" + link.host + link.pathname + link.search + link.hash;
            }
            // load it
            script.src = url; head.appendChild( script );
        };
        next = function( ) {
            if ( names[ i ] in scope )
            {
                if ( ++i >= dl ) callback( );
                else if ( names[ i ] in scope ) next( ); 
                else load( paths[ i ], next );
            }
            else if ( ++t < 30 ) { setTimeout( next, 30 ); }
            else { t = 0; i++; next( ); }
        };
        while ( i < dl && (names[ i ] in scope) ) i++;
        if ( i < dl ) load( paths[ i ], next );
        else callback( );
    }
    
    deps = deps || [[],[]];
    
    var isNode = ("undefined" !== typeof global) && ("[object global]" === {}.toString.call(global)),
        isBrowser = !isNode && ("undefined" !== typeof navigator), 
        isWebWorker = !isNode && ("function" === typeof importScripts) && (navigator instanceof WorkerNavigator),
        isAMD = ("function" === typeof define) && define.amd,
        isCommonJS = isNode && ("object" === typeof module) && module.exports,
        currentGlobal = isWebWorker ? self : root, currentPath = getPath( isNode, isWebWorker, isAMD, isBrowser ), m,
        names = [].concat(deps[0]), paths = [].concat(deps[1]), dl = names.length, i, requireJSPath, ext_js = /\.js$/i
    ;
    
    // commonjs, node, etc..
    if ( isCommonJS ) 
    {
        module.$deps = module.$deps || {};
        module.exports = module.$deps[ name ] = factory.apply( root, [{NODE:module}].concat(getDeps( names, paths, module.$deps, 1, require )) ) || 1;
    }
    
    // amd, requirejs, etc..
    else if ( isAMD && ("function" === typeof require) && ("function" === typeof require.specified) &&
        require.specified(name) ) 
    {
        if ( !require.defined(name) )
        {
            requireJSPath = { };
            for (i=0; i<dl; i++) 
                require.specified( names[ i ] ) || (requireJSPath[ names[ i ] ] = paths[ i ].replace(ext_js, ''));
            //requireJSPath[ name ] = currentPath.file.replace(ext_js, '');
            require.config({ paths: requireJSPath });
            // named modules, require the module by name given
            define( name, ["require", "exports", "module"].concat( names ), function( require, exports, module ) {
                return factory.apply( root, [{AMD:module}].concat(getDeps( names, paths, arguments, 2, require )) );
            });
        }
    }
    
    // browser, web worker, other loaders, etc.. + AMD optional
    else if ( !(name in currentGlobal) )
    {
        loadScripts( currentGlobal, currentPath.path + '/', names, paths, function( ){ 
            currentGlobal[ name ] = m = factory.apply( root, [{}].concat(getDeps( names, paths, currentGlobal )) ) || 1; 
            isAMD && define( name, ["require"], function( ){ return m; } );
        }, isWebWorker);
    }


}(  /* current root */          this, 
    /* module name */           "FILTER",
    /* module dependencies */   [ ['Classy', 'Asynchronous'], ['./classy.js', './asynchronous.js'] ], 
    /* module factory */        function( exports, Classy, Asynchronous ) {
        
    /* main code starts here */

/**
*
*   FILTER.js
*   @version: 0.7
*   @built on 2015-05-12 04:46:27
*   @dependencies: Classy.js, Asynchronous.js
*
*   JavaScript Image Processing Library
*   https://github.com/foo123/FILTER.js
*
**/
var FILTER = exports['FILTER'] = Classy.Merge({ 
    Classy: Classy, Asynchronous: Asynchronous, Path: Asynchronous.path( exports.AMD )
}, Classy); /* make Classy methods accessible as FILTER methods, like FILTER.Class and so on.. */
FILTER.VERSION = "0.7";
/**
*
* Filter SuperClass, Interfaces and Utilities
* @package FILTER.js
*
**/
!function(root, FILTER, undef){
"use strict";

// http://jsperf.com/math-floor-vs-math-round-vs-parseint/33

var PROTO = 'prototype', OP = Object[PROTO], FP = Function[PROTO], AP = Array[PROTO]
    
    ,FILTERPath = FILTER.Path, Merge = FILTER.Merge, Async = FILTER.Asynchronous
    
    ,isNode = Async.isPlatform( Async.Platform.NODE ), isBrowser = Async.isPlatform( Async.Platform.BROWSER )
    ,supportsThread = Async.supportsMultiThreading( ), isThread = Async.isThread( )
    ,userAgent = navigator ? navigator.userAgent : ""
    
    ,toStringPlugin = function( ) { return "[FILTER Plugin: " + this.name + "]"; }
    ,applyPlugin = function( im, w, h, image ){ return im; }
    ,initPlugin = function( ) { }
    ,constructorPlugin = function( init ) {
        return function( ) {
            this.$super('constructor');
            init.apply( this, arguments );
        };
    }
    
    ,devicePixelRatio = FILTER.devicePixelRatio = root.devicePixelRatio || 1
    
    ,notSupportClamp = FILTER._notSupportClamp = "undefined" === typeof(Uint8ClampedArray)
    ,no_typed_array_set = ('undefined' === typeof Int16Array) || !Int16Array[PROTO].set
    ,typed_array_set = function( a, offset ) {
        var i = a.length;
        offset = offset || 0;
        while ( --i >= 0 ) this[ i + offset ] = a[ i ];
    }
    ,typed_array_subarray = AP.slice
    
    ,log, _uuid = 0
;

//
//
// Browser Sniffing support
var Browser = FILTER.Browser = {
// http://stackoverflow.com/questions/4224606/how-to-check-whether-a-script-is-running-under-node-js
isNode                  : isNode,
isBrowser               : isBrowser,
isWorker                : isThread,
supportsWorker          : supportsThread,
isPhantom               : /PhantomJS/.test(userAgent),

// http://www.quirksmode.org/js/detect.html
// http://my.opera.com/community/openweb/idopera/
// http://stackoverflow.com/questions/1998293/how-to-determine-the-opera-browser-using-javascript
isOpera                 : isBrowser && /Opera|OPR\//.test(userAgent),
isFirefox               : isBrowser && /Firefox\//.test(userAgent),
isChrome                : isBrowser && /Chrome\//.test(userAgent),
isSafari                : isBrowser && /Apple Computer/.test(navigator.vendor),
isKhtml                 : isBrowser && /KHTML\//.test(userAgent),
// IE 11 replaced the MSIE with Mozilla like gecko string, check for Trident engine also
isIE                    : isBrowser && (/MSIE \d/.test(userAgent) || /Trident\/\d/.test(userAgent)),

// adapted from Codemirror (https://github.com/marijnh/CodeMirror) browser sniffing
isGecko                 : isBrowser && /gecko\/\d/i.test(userAgent),
isWebkit                : isBrowser && /WebKit\//.test(userAgent),
isMac_geLion            : isBrowser && /Mac OS X 1\d\D([7-9]|\d\d)\D/.test(userAgent),
isMac_geMountainLion    : isBrowser && /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent),

isMobile                : false,
isIOS                   : /AppleWebKit/.test(userAgent) && /Mobile\/\w+/.test(userAgent),
isWin                   : /windows/i.test(navigator.platform),
isMac                   : false,
isIE_lt8                : false,
isIE_lt9                : false,
isQtWebkit              : false
};
Browser.isMobile = Browser.isIOS || /Android|webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
Browser.isMac = Browser.isIOS || /Mac/.test(navigator.platform);
Browser.isIE_lt8 = Browser.isIE  && !isThread && (null == document.documentMode || document.documentMode < 8);
Browser.isIE_lt9 = Browser.isIE && !isThread && (null == document.documentMode || document.documentMode < 9);
Browser.isQtWebkit = Browser.isWebkit && /Qt\/\d+\.\d+/.test(userAgent);

FILTER.getPath = Async.path;

FILTER.getCanvas = FILTER.createCanvas = function( w, h ) {
    var canvas = document.createElement( 'canvas' );
    w = w || 0; h = h || 0;
    
    // set the display size of the canvas.
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
     
    // set the size of the drawingBuffer
    canvas.width = w * devicePixelRatio;
    canvas.height = h * devicePixelRatio;
    
    return canvas;
};

FILTER.uuid = function( namespace ) { 
    return [namespace||'filter', new Date( ).getTime( ), ++_uuid].join('_'); 
};


//
// Typed Arrays Substitute(s)
FILTER.Array = Array;
FILTER.Array32F = (typeof Float32Array !== "undefined") ? Float32Array : Array;
FILTER.Array64F = (typeof Float64Array !== "undefined") ? Float64Array : Array;
FILTER.Array8I = (typeof Int8Array !== "undefined") ? Int8Array : Array;
FILTER.Array16I = (typeof Int16Array !== "undefined") ? Int16Array : Array;
FILTER.Array32I = (typeof Int32Array !== "undefined") ? Int32Array : Array;
FILTER.Array8U = (typeof Uint8Array !== "undefined") ? Uint8Array : Array;
FILTER.Array16U = (typeof Uint16Array !== "undefined") ? Uint16Array : Array;
FILTER.Array32U = (typeof Uint32Array !== "undefined") ? Uint32Array : Array;

if ( !FILTER.Array32F[PROTO].set )
{
    FILTER.Array32F[PROTO].set = typed_array_set;
    FILTER.Array64F[PROTO].set = typed_array_set;
    FILTER.Array8I[PROTO].set = typed_array_set;
    FILTER.Array16I[PROTO].set = typed_array_set;
    FILTER.Array32I[PROTO].set = typed_array_set;
    FILTER.Array8U[PROTO].set = typed_array_set;
    FILTER.Array16U[PROTO].set = typed_array_set;
    FILTER.Array32U[PROTO].set = typed_array_set;
}
if ( !FILTER.Array32F[PROTO].subarray )
{
    FILTER.Array32F[PROTO].subarray = typed_array_subarray;
    FILTER.Array64F[PROTO].subarray = typed_array_subarray;
    FILTER.Array8I[PROTO].subarray = typed_array_subarray;
    FILTER.Array16I[PROTO].subarray = typed_array_subarray;
    FILTER.Array32I[PROTO].subarray = typed_array_subarray;
    FILTER.Array8U[PROTO].subarray = typed_array_subarray;
    FILTER.Array16U[PROTO].subarray = typed_array_subarray;
    FILTER.Array32U[PROTO].subarray = typed_array_subarray;
}

FILTER.ImArray = notSupportClamp ? FILTER.Array8U : Uint8ClampedArray;
// opera seems to have a bug which copies Uint8ClampedArrays by reference instead by value (eg. as Firefox and Chrome)
// however Uint8 arrays are copied by value, so use that instead for doing fast copies of image arrays
FILTER.ImArrayCopy = Browser.isOpera ? FILTER.Array8U : FILTER.ImArray;

// IE still does not support Uint8ClampedArray and some methods on it, add the method "set"
if ( notSupportClamp && "undefined" !== typeof(CanvasPixelArray) && !CanvasPixelArray[PROTO].set )
{
    // add the missing method to the array
    CanvasPixelArray[PROTO].set = typed_array_set;
}
notSupportClamp = FILTER._notSupportClamp = notSupportClamp || Browser.isOpera;

//
// webgl support
FILTER.useWebGL = false;
FILTER.useWebGLSharedResources = false;
FILTER.useWebGLIfAvailable = function( bool ) { /* do nothing, override */  };
FILTER.useWebGLSharedResourcesIfAvailable = function( bool ) { /* do nothing, override */  };

//
// Constants
FILTER.CHANNEL = {
     RED:   0
    ,GREEN: 1
    ,BLUE:  2
    ,ALPHA: 3
};
FILTER.MODE = {
     IGNORE:    0
    ,WRAP:      1
    ,CLAMP:     2
    ,COLOR:     4
};
FILTER.LUMA = new FILTER.Array32F([ 
     0.212671
    ,0.71516 
    ,0.072169 
]);
FILTER.FORMAT = {
     IMAGE:     1
    ,DATA:      4
    ,PNG:       8
    ,JPG:       16
    ,GIF:       32
};
FILTER.MIME = {
     PNG:       "image/png"
    ,JPG:       "image/jpeg"
    ,GIF:       "image/gif"
};
FILTER.FORMAT.JPEG = FILTER.FORMAT.JPG;
FILTER.MIME.JPEG = FILTER.MIME.JPG;

//
// logging
log = FILTER.log = (console && console.log) ? function( s ) { console.log(s); } : function( s ) { /* do nothing*/ };
FILTER.warning = function( s ) { log( 'WARNING: ' + s ); }; 
FILTER.error = function( s, throwErr ) { log( 'ERROR: ' + s ); if ( throwErr ) throw new Error(s); };

var 
    //
    // Thread Filter Interface (internal)
    FilterThread = FILTER.FilterThread = FILTER.Class( Async, {
        
        path: FILTER.getPath( exports.AMD )
        ,name: null
        
        ,constructor: function( ) {
            var self = this, filter = null;
            if ( isThread )
            {
                self.initThread( )
                    .listen('load', function( data ) {
                        if ( data && data.filter )
                        {
                            if ( filter ) 
                            {
                                filter.dispose( true );
                                filter = null;
                            }
                            filter = Async.load( 'FILTER.' + data.filter );
                        }
                    })
                    .listen('import', function( data ) {
                        if ( data && data["import"] && data["import"].length )
                        {
                            importScripts( data["import"]/*.join(',')*/ );
                        }
                    })
                    .listen('params', function( data ) {
                        if ( filter ) filter.unserialize( data );
                    })
                    .listen('apply', function( data ) {
                        if ( filter && data && data.im )
                        {
                            if ( data.params ) filter.unserialize( data.params );
                            var ret = {im: filter._apply( data.im[ 0 ], data.im[ 1 ], data.im[ 2 ] )};
                            // pass any filter metadata if needed
                            if ( filter.hasMeta ) ret.meta = filter.getMeta();/*self.send( 'meta', filter.getMeta() );*/
                            self.send( 'apply', ret );
                        }
                        else
                        {
                            self.send( 'apply', {im: null} );
                        }
                    })
                    .listen('dispose', function( data ) {
                        if ( filter ) 
                        {
                            filter.dispose( true );
                            filter = null;
                        }
                        self.dispose( true );
                        close( );
                    })
                ;
            }
        }
        
        // activate or de-activate thread/worker filter
        ,thread: function( enable ) {
            var self = this;
            if ( !arguments.length ) enable = true;
            enable = !!enable;
            // activate worker
            if ( enable && !self.$thread ) 
            {
                self.fork( 'FILTER.FilterThread', (FILTERPath.file !== self.path.file) ? [ FILTERPath.file, self.path.file ] : self.path.file );
                self.send('load', {filter: self.name});
            }
            // de-activate worker (if was activated before)
            else if ( !enable && self.$thread )
            {
                self.unfork( );
            }
            return self;
        }
        
        ,sources: function( ) {
            var sources = AP.slice.call( arguments );
            if ( sources.length )
            {
                var blobs = [ ], i;
                for (i=0; i<sources.length; i++)
                {
                    if ( 'function' === typeof( sources[ i ] ) )
                        blobs.push( Async.blob( sources[ i ].toString( ) ) );
                    else
                        blobs.push( Async.blob( sources[ i ] ) );
                }
                this.send('import', {'import': blobs.join( ',' )});
            }
            return this;
        }
        
        ,scripts: function( ) {
            var scripts = AP.slice.call( arguments );
            if ( scripts.length ) this.send('import', {'import': scripts.join( ',' )});
            return this;
        }
        
        // @override
        ,serialize: function( ) {
            var self = this;
            return { filter: self.name, _isOn: !!self._isOn, params: {} };
        }
        
        // @override
        ,unserialize: function( json ) {
            var self = this;
            if ( json && self.name === json.filter )
            {
                self._isOn = !!json._isOn;
            }
            return self;
        }
    }),
    
    //
    // Abstract Generic Filter (implements Async Worker/Thread Interface transparently)
    Filter = FILTER.Filter = FILTER.Class( FilterThread, {
        name: "Filter"
        
        ,constructor: function( ) {
            var self = this;
            //self.$superv('constructor', [100, false]);
        }
        
        // filters can have id's
        ,id: null
        ,_isOn: true
        ,_update: true
        ,_onComplete: null
        ,hasMeta: false
        
        ,dispose: function( ) {
            var self = this;
            self.$super('dispose');
            self.name = null;
            self.id = null;
            self._isOn = null;
            self._update = null;
            self._onComplete = null;
            self.hasMeta = null;
            return self;
        }
        
        // alias of thread method
        ,worker: FilterThread[PROTO].thread
        
        ,complete: function( f ) {
            this._onComplete = f || null;
            return this;
        }
        
        // whether filter is ON
        ,isOn: function( ) {
            return this._isOn;
        }
        
        // whether filter updates output image or not
        ,update: function( bool ) {
            if ( !arguments.length ) bool = true;
            this._update = !!bool;
            return this;
        }
        
        // allow filters to be turned ON/OFF
        ,turnOn: function( bool ) {
            if ( !arguments.length ) bool = true;
            this._isOn = !!bool;
            return this;
        }
        
        // toggle ON/OFF state
        ,toggle: function( ) {
            this._isOn = !this._isOn;
            return this;
        }
        
        // @override
        ,reset: function( ) {
            return this;
        }
        
        // @override
        ,canRun: function( ) {
            return this._isOn;
        }
        
        // @override
        ,getMeta: function( ) {
        }
        
        // @override
        ,setMeta: function( meta ) {
            return this;
        }
        
        // @override
        ,combineWith: function( filter ) {
            return this;
        }
        
        // @override
        // for internal use, each filter overrides this
        ,_apply: function( im, w, h, image ) { 
            /* do nothing here, override */
            return im;
        }
        
        // generic apply a filter from an image (src) to another image (dest)
        // with optional callback (cb)
        ,apply: function( src, dest, cb ) {
            var self = this, im, im2;
            
            if ( !self.canRun( ) ) return src;
            
            if ( arguments.length < 3 )
            {
                if ( dest && dest.setSelectedData ) 
                {
                    // dest is an image and no callback
                    cb = null;
                }
                else if ( 'function' === typeof(dest) )
                {
                    // dest is callback, dest is same as src
                    cb = dest;
                    dest = src;
                }
                else
                {
                    dest = src;
                    cb = null;
                }
            }
            
            if ( src && dest )
            {
                cb = cb || self._onComplete;
                im = src.getSelectedData( );
                if ( self.$thread )
                {
                    self
                        // listen for metadata if needed
                        /*.listen( 'meta', function( data ) { 
                            self.unlisten( 'meta' );
                            self.setMeta( data );
                        })*/
                        .listen( 'apply', function( data ) { 
                            self/*.unlisten( 'meta' )*/.unlisten( 'apply' );
                            if ( data && data.im ) 
                            {
                                // listen for metadata if needed
                                if ( data.meta ) self.setMeta( data.meta );
                                if ( self._update ) dest.setSelectedData( data.im );
                            }
                            if ( cb ) cb.call( self );
                        })
                        // process request
                        .send( 'apply', {im: im, params: self.serialize( )} )
                    ;
                }
                else
                {
                    im2 = self._apply( im[ 0 ], im[ 1 ], im[ 2 ], src );
                    // update image only if needed
                    // some filters do not actually change the image data
                    // but instead process information from the data,
                    // no need to update in such a case
                    if ( self._update ) dest.setSelectedData( im2 );
                    if ( cb ) cb.call( self );
                }
            }
            return src;
        }
        
        ,toString: function( ) {
            return "[FILTER: " + this.name + "]";
        }
    })
;

//
// filter plugin creation micro-framework
FILTER.Create = function( methods ) {
    methods = Merge({
            init: initPlugin
            ,name: "PluginFilter"
            ,toString: toStringPlugin
            ,apply: applyPlugin
    }, methods);
    methods.constructor = constructorPlugin( methods.init );
    methods._apply = methods.apply;
    delete methods.init; delete methods.apply;
    var filterName = methods.name;
    return FILTER[filterName] = FILTER.Class( Filter, methods );
};

}(this, FILTER);/**
*
* Filter Math
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var sliceTyped = 'function' === typeof FILTER.Array64F.prototype.slice ? 'slice' : 'subarray',
    IMG = FILTER.ImArray, A32F = FILTER.Array32F, A64F = FILTER.Array64F,
    PI = Math.PI, PI2 = 2.0*PI, PI_2 = 0.5*PI, 
    sin = Math.sin, cos = Math.cos, min = Math.min, max = Math.max
;
Math.log2 = Math.log2 || function(x) { return Math.log(x) / Math.LN2; };

//
//
// Constants
FILTER.CONSTANTS = {
     PI:    PI
    ,PI2:   PI2
    ,PI_2:  PI_2
    ,SQRT2: Math.SQRT2
    ,toRad: PI/180
    ,toDeg: 180/PI
};

function clamp(v, m, M) { return v > M ? M : (v < m ? m : v); }
function closest_power_of_two(x){ return Math.pow(2, Math.ceil(Math.log2(x))); }
function precompute_trigonometric_tables(sine, cosn, N, dir)
{
    // allocate and initialize trigonometric tables 
    var k, phi;
    for (k=0; k<N; k++)
    {
        phi = PI2 * k/N;
        sine[ k ] = dir * sin( phi );
        cosn[ k ] = cos( phi );
    }
}



FILTER.Math = {
    
    clamp: clamp,
    
    closestPower2: closest_power_of_two
};

FILTER.Interpolate = {
    
     pad: function( im, w, h, pad_right, pad_bot, pad_left, pad_top ) {
         pad_right = pad_right || 0; pad_bot = pad_bot || 0;
         pad_left = pad_left || 0; pad_top = pad_top || 0;
         var nw = w+pad_left+pad_right, nh = h+pad_top+pad_bot, 
            paddedSize = (nw*nh)<<2, padded = new IMG(paddedSize), 
            y, yw, w4 = w<<2, nw4 = nw<<2, pixel, pixel2,
            offtop = pad_top*nw4, offleft = pad_left<<2;
            
            for (y=0,yw=0,pixel=offtop; y<h; y++,yw+=w,pixel+=nw4)
            {
                pixel2 = yw<<2;
                padded.set(im.subarray(pixel2,pixel2+w4),offleft+pixel);
            }
         return padded;
    }
    
    ,crop: function( im, w, h, x1, y1, x2, y2 ) {
         x2 = min(x2,w-1); y2 = min(y2,h-1);
         var nw = x2-x1+1, nh = y2-y1+1, 
            croppedSize = (nw*nh)<<2, cropped = new IMG(croppedSize), 
            y, yw, nw4 = nw<<2, pixel, pixel2;
            
            for (y=y1,yw=y1*w,pixel=0; y<=y2; y++,yw+=w,pixel+=nw4)
            {
                pixel2 = (yw+x1)<<2;
                cropped.set(im.subarray(pixel2,pixel2+nw4),pixel);
            }
         return cropped;
    }
    
    // http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
    ,nearest: function( im, w, h, nw, nh ) {
        var size = (nw*nh)<<2, interpolated = new IMG(size),
            rx = (w-1)/nw, ry = (h-1)/nh, 
            i, j, x, y, xi, yi, pixel, index,
            yw, xoff, yoff, w4 = w<<2
        ;
        i=0; j=0; x=0; y=0; yi=0; yw=0; yoff=0;
        for (index=0; index<size; index+=4,j++,x+=rx) 
        {
            if ( j >= nw ) { j=0; x=0; i++; y+=ry; yi=~~y; yw=yi*w; yoff=y - yi<0.5 ? 0 : w4; }
            
            xi = ~~x; xoff = x - xi<0.5 ? 0 : 4;
            
            pixel = ((yw + xi)<<2) + xoff + yoff;

            interpolated[index]      = im[pixel];
            interpolated[index+1]    = im[pixel+1];
            interpolated[index+2]    = im[pixel+2];
            interpolated[index+3]    = im[pixel+3];
        }
        return interpolated;
    }

    // http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
    // http://tech-algorithm.com/articles/bilinear-image-scaling/
    ,bilinear: function( im, w, h, nw, nh ) {
        var size = (nw*nh)<<2, interpolated = new IMG(size),
            rx = (w-1)/nw, ry = (h-1)/nh, 
            A, B, C, D, a, b, c, d, 
            i, j, x, y, xi, yi, pixel, index,
            yw, dx, dy, w4 = w<<2
        ;
        i=0; j=0; x=0; y=0; yi=0; yw=0; dy=0;
        for (index=0; index<size; index+=4,j++,x+=rx) 
        {
            if ( j >= nw ) { j=0; x=0; i++; y+=ry; yi=~~y; dy=y - yi; yw=yi*w; }
            
            xi = ~~x; dx = x - xi;
            
            // Y = A(1-w)(1-h) + B(w)(1-h) + C(h)(1-w) + Dwh
            a = (1-dx)*(1-dy); b = dx*(1-dy);
            c = dy*(1-dx); d = dx*dy;
            
            pixel = (yw + xi)<<2;

            A = im[pixel]; B = im[pixel+4];
            C = im[pixel+w4]; D = im[pixel+w4+4];
            interpolated[index] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);
            
            A = im[pixel+1]; B = im[pixel+5];
            C = im[pixel+w4+1]; D = im[pixel+w4+5];
            interpolated[index+1] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);

            A = im[pixel+2]; B = im[pixel+6];
            C = im[pixel+w4+2]; D = im[pixel+w4+6];
            interpolated[index+2] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);

            A = im[pixel+3]; B = im[pixel+7];
            C = im[pixel+w4+3]; D = im[pixel+w4+7];
            interpolated[index+3] = clamp(~~(A*a +  B*b + C*c  +  D*d + 0.5), 0, 255);
        }
        return interpolated;
    }

    // http://www.gamedev.net/topic/229145-bicubic-interpolation-for-image-resizing/
    ,bicubic: function( im, w, h, nw, nh ) {
        var size = (nw*nh)<<2, interpolated = new IMG(size),
            rx = (w-1)/nw, ry = (h-1)/nh, 
            i, j, x, y, xi, yi, pixel, index,
            rgba = new IMG(4), 
            rgba0 = new A32F(4), rgba1 = new A32F(4), 
            rgba2 = new A32F(4), rgba3 = new A32F(4),
            yw, dx, dy, dx2, dx3, dy2, dy3, w4 = w<<2,
            B, BL, BR, BRR, BB, BBL, BBR, BBRR, C, L, R, RR, T, TL, TR, TRR,
            p, q, r, s, T_EDGE, B_EDGE, L_EDGE, R_EDGE
        ;
        i=0; j=0; x=0; y=0; yi=0; yw=0; dy=dy2=dy3=0; 
        for (index=0; index<size; index+=4,j++,x+=rx) 
        {
            if ( j >= nw ) {j=0; x=0; i++; y+=ry; yi=~~y; dy=y - yi; dy2=dy*dy; dy3=dy2*dy3; yw=yi*w;}
            xi = ~~x; dx = x - xi; dx2 = dx*dx; dx3 = dx2*dx;
            
            pixel = (yw + xi)<<2;
            T_EDGE = 0 === yi; B_EDGE = h-1 === yi; L_EDGE = 0 === xi; R_EDGE = w-1 === xi;
            
            // handle edge cases
            C = im.subarray(pixel, pixel+4);
            L = L_EDGE ? C : im.subarray(pixel-4, pixel);
            R = R_EDGE ? C : im.subarray(pixel+4, pixel+8);
            RR = R_EDGE ? C : im.subarray(pixel+8, pixel+12);
            B = B_EDGE ? C : im.subarray(pixel+w4, pixel+w4+4);
            BB = B_EDGE ? C : im.subarray(pixel+w4+w4, pixel+w4+w4+4);
            BL = B_EDGE||L_EDGE ? C : im.subarray(pixel+w4-4, pixel+w4);
            BR = B_EDGE||R_EDGE ? C : im.subarray(pixel+w4+4, pixel+w4+8);
            BRR = B_EDGE||R_EDGE ? C : im.subarray(pixel+w4+8, pixel+w4+12);
            BBL = B_EDGE||L_EDGE ? C : im.subarray(pixel+w4+w4-4, pixel+w4+w4);
            BBR = B_EDGE||R_EDGE ? C : im.subarray(pixel+w4+w4+4, pixel+w4+w4+8);
            BBRR = B_EDGE||R_EDGE ? C : im.subarray(pixel+w4+w4+8, pixel+w4+w4+12);
            T = T_EDGE ? C : im.subarray(pixel-w4, pixel-w4+4);
            TL = T_EDGE||L_EDGE ? C : im.subarray(pixel-w4-4, pixel-w4);
            TR = T_EDGE||R_EDGE ? C : im.subarray(pixel-w4+4, pixel-w4+8);
            TRR = T_EDGE||R_EDGE ? C : im.subarray(pixel-w4+8, pixel-w4+12);
            
            /*function interpolate_pixel(n, p0, p1, p2, p3, t)
            {
                var p, q, r, s, t2 = t*t, t3 = t2 * t, v;
                
                p = (p3[0] - p2[0]) - (p0[0] - p1[0]);
                q = (p0[0] - p1[0]) - p;
                r = p2[0] - p0[0];
                s = p1[0];
                n[0] = clamp(~~(p * t3 + q * t2 + r * t + s + 0.5), 0, 255);

                p = (p3[1] - p2[1]) - (p0[1] - p1[1]);
                q = (p0[1] - p1[1]) - p;
                r = p2[1] - p0[1];
                s = p1[1];
                n[1] = clamp(~~(p * t3 + q * t2 + r * t + s + 0.5), 0, 255);

                p = (p3[2] - p2[2]) - (p0[2] - p1[2]);
                q = (p0[2] - p1[2]) - p;
                r = p2[2] - p0[2];
                s = p1[2];
                n[2] = clamp(~~(p * t3 + q * t2 + r * t + s + 0.5), 0, 255);

                p = (p3[3] - p2[3]) - (p0[3] - p1[3]);
                q = (p0[3] - p1[3]) - p;
                r = p2[3] - p0[3];
                s = p1[3];
                n[3] = clamp(~~(p * t3 + q * t2 + r * t + s + 0.5), 0, 255);
            }*/
            //interpolate_pixel(rgba0, TL, T, TR, TRR, dx);
            p = (TRR[0] - TR[0]) - (TL[0] - T[0]);
            q = (TL[0] - T[0]) - p;
            r = TR[0] - TL[0];
            s = T[0];
            rgba0[0] = p * dx3 + q * dx2 + r * dx + s;
            p = (TRR[1] - TR[1]) - (TL[1] - T[1]);
            q = (TL[1] - T[1]) - p;
            r = TR[1] - TL[1];
            s = T[1];
            rgba0[1] = p * dx3 + q * dx2 + r * dx + s;
            p = (TRR[2] - TR[2]) - (TL[2] - T[2]);
            q = (TL[2] - T[2]) - p;
            r = TR[2] - TL[2];
            s = T[2];
            rgba0[2] = p * dx3 + q * dx2 + r * dx + s;
            p = (TRR[3] - TR[3]) - (TL[3] - T[3]);
            q = (TL[3] - T[3]) - p;
            r = TR[3] - TL[3];
            s = T[3];
            rgba0[3] = p * dx3 + q * dx2 + r * dx + s;
            
            //interpolate_pixel(rgba1, L, C, R, RR, dx);
            p = (RR[0] - R[0]) - (L[0] - C[0]);
            q = (L[0] - C[0]) - p;
            r = R[0] - L[0];
            s = C[0];
            rgba1[0] = p * dx3 + q * dx2 + r * dx + s;
            p = (RR[1] - R[1]) - (L[1] - C[1]);
            q = (L[1] - C[1]) - p;
            r = R[1] - L[1];
            s = C[1];
            rgba1[1] = p * dx3 + q * dx2 + r * dx + s;
            p = (RR[2] - R[2]) - (L[2] - C[2]);
            q = (L[2] - C[2]) - p;
            r = R[2] - L[2];
            s = C[2];
            rgba1[2] = p * dx3 + q * dx2 + r * dx + s;
            p = (RR[3] - R[3]) - (L[3] - C[3]);
            q = (L[3] - C[3]) - p;
            r = R[3] - L[3];
            s = C[3];
            rgba1[3] = p * dx3 + q * dx2 + r * dx + s;
            
            //interpolate_pixel(rgba2, BL, B, BR, BRR, dx);
            p = (BRR[0] - BR[0]) - (BL[0] - B[0]);
            q = (BL[0] - B[0]) - p;
            r = BR[0] - BL[0];
            s = B[0];
            rgba2[0] = p * dx3 + q * dx2 + r * dx + s;
            p = (BRR[1] - BR[1]) - (BL[1] - B[1]);
            q = (BL[1] - B[1]) - p;
            r = BR[1] - BL[1];
            s = B[1];
            rgba2[1] = p * dx3 + q * dx2 + r * dx + s;
            p = (BRR[2] - BR[2]) - (BL[2] - B[2]);
            q = (BL[2] - B[2]) - p;
            r = BR[2] - BL[2];
            s = B[2];
            rgba2[2] = p * dx3 + q * dx2 + r * dx + s;
            p = (BRR[3] - BR[3]) - (BL[3] - B[3]);
            q = (BL[3] - B[3]) - p;
            r = BR[3] - BL[3];
            s = B[3];
            rgba2[3] = p * dx3 + q * dx2 + r * dx + s;
            
            //interpolate_pixel(rgba3, BBL, BB, BBR, BBRR, dx);
            p = (BBRR[0] - BBR[0]) - (BBL[0] - BB[0]);
            q = (BBL[0] - BB[0]) - p;
            r = BBR[0] - BBL[0];
            s = BB[0];
            rgba3[0] = p * dx3 + q * dx2 + r * dx + s;
            p = (BBRR[1] - BBR[1]) - (BBL[1] - BB[1]);
            q = (BBL[1] - BB[1]) - p;
            r = BBR[1] - BBL[1];
            s = BB[1];
            rgba3[1] = p * dx3 + q * dx2 + r * dx + s;
            p = (BBRR[2] - BBR[2]) - (BBL[2] - BB[2]);
            q = (BBL[2] - BB[2]) - p;
            r = BBR[2] - BBL[2];
            s = BB[2];
            rgba3[2] = p * dx3 + q * dx2 + r * dx + s;
            p = (BBRR[3] - BBR[3]) - (BBL[3] - BB[3]);
            q = (BBL[3] - BB[3]) - p;
            r = BBR[3] - BBL[3];
            s = BB[3];
            rgba3[3] = p * dx3 + q * dx2 + r * dx + s;
            
            // Then we interpolate those 4 pixels to get a single pixel that is a composite of 4 * 4 pixels, 16 pixels
            //interpolate_pixel(rgba, rgba0, rgba1, rgba2, rgba3, dy);
            p = (rgba3[0] - rgba2[0]) - (rgba0[0] - rgba1[0]);
            q = (rgba0[0] - rgba1[0]) - p;
            r = rgba2[0] - rgba0[0];
            s = rgba1[0];
            rgba[0] = clamp(~~(p * dy3 + q * dy2 + r * dy + s + 0.5), 0, 255);
            p = (rgba3[1] - rgba2[1]) - (rgba0[1] - rgba1[1]);
            q = (rgba0[1] - rgba1[1]) - p;
            r = rgba2[1] - rgba0[1];
            s = rgba1[1];
            rgba[1] = clamp(~~(p * dy3 + q * dy2 + r * dy + s + 0.5), 0, 255);
            p = (rgba3[2] - rgba2[2]) - (rgba0[2] - rgba1[2]);
            q = (rgba0[2] - rgba1[2]) - p;
            r = rgba2[2] - rgba0[2];
            s = rgba1[2];
            rgba[2] = clamp(~~(p * dy3 + q * dy2 + r * dy + s + 0.5), 0, 255);
            p = (rgba3[3] - rgba2[3]) - (rgba0[3] - rgba1[3]);
            q = (rgba0[3] - rgba1[3]) - p;
            r = rgba2[3] - rgba0[3];
            s = rgba1[3];
            rgba[3] = clamp(~~(p * dy3 + q * dy2 + r * dy + s + 0.5), 0, 255);
            
            interpolated[index]      = rgba[0];
            interpolated[index+1]    = rgba[1];
            interpolated[index+2]    = rgba[2];
            interpolated[index+3]    = rgba[3];
        }
        return interpolated;
    }
    
    /*
    // https://code.google.com/a/eclipselabs.org/p/bicubic-interpolation-image-processing/source/browse/trunk/libimage.c
    ,biquadric: function( im, w, h, nw, nh ) {
    // TODO
    }
    */

    /*
    // http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
    ,lanczos: function( im, w, h, nw, nh ){
    // TODO
    }
    */
};


// fft1d and fft2d
// adapted from: http://www.ltrr.arizona.edu/~mmunro/tclsadiedoc/html/fft2d_8c-source.html
// http://en.wikipedia.org/wiki/Fourier_transform#Signal_processing
// http://en.wikipedia.org/wiki/Fast_Fourier_transform
function fft_butterfly(array, N, dir, sine, cosn)
{
    var n, m, l, k, j, i, jc, kc, i2, j2, N_2 = N >>> 1;
    var temp, e_real, e_imag, o_real, o_imag;

    /* scramble the array */
    for (i = j = 0; j < N; j += 1, i += k)
    {
        if ( i > j )
        {
            i2 = i << 1; j2 = j << 1;
            temp = array[i2];
            array[i2] = array[j2];
            array[j2] = temp;
            temp = array[i2 + 1];
            array[i2 + 1] = array[j2 + 1];
            array[j2 + 1] = temp;
        }
        for (k = N_2; 1 <= k && k <= i; i -= k, k >>>= 1);
    }

    /* compute Fourier coefficients */
    for (i = 2; i <= N; i <<= 1)
    {
        for (j = 0,jc = N/i; j < jc; j++)
        {
            for (k = 0,kc = i >>> 1; k < kc; k++)
            {
                l = (j * i + k) << 1;
                m = (j * i + (i >>> 1) + k) << 1;
                n = (k * /*N / i*/jc);
                e_real = array[l];
                e_imag = array[l + 1];
                o_real = array[m] * cosn[n] - array[m + 1] * sine[n];
                o_imag = array[m] * sine[n] + array[m + 1] * cosn[n];
                array[l] = (e_real + o_real) / 2.0;
                array[l + 1] = (e_imag + o_imag) / 2.0;
                array[m] = (e_real - o_real) / 2.0;
                array[m + 1] = (e_imag - o_imag) / 2.0;
            }
        }
    }
    if ( -1 === dir /*== INVERSE*/) for (i = 0,jc = N << 1; i < jc; array[i++] *= N);
}



FILTER.Transform = {
    
    fft1d: function fft1d(in_array, N, dir) {
        if ( !dir ) dir = 1;
        var Npow2 = closest_power_of_two(N), Npow2_complex = Npow2 << 1,
            sine, cosn, transform, out_array,
            k, i;
        
        transform = new A64F(Npow2_complex);
        
        // allocate and initialize trigonometric tables 
        precompute_trigonometric_tables(sine=new A64F(Npow2), cosn=new A64F(Npow2), Npow2, dir);
        
        // from real to complex, zero-pad if needed
        if ( 1 === dir )
        {
            for (k=0; k<Npow2_complex; k+=2) 
            {
                i = k >>> 1;
                transform[k] = i < N ? in_array[i] : 0; // zero-pad if needed
                transform[k+1] = 0; // complex part
            }
        }
        else
        {
            transform.set(in_array);
        }
        
        // compute fft butterfly
        fft_butterfly(transform, Npow2, dir, sine, cosn);
        
        // from complex to real
        if ( -1 === dir )
        {
            for (k=0; k<Npow2_complex; k+=2) transform[k >>> 1] = transform[k]; /* in-place */
            out_array = transform[sliceTyped](0, N);
        }
        else
        {
            out_array = transform;
        }
        
        return out_array;
    }

    /*-Copyright Information------------------------------------------------------*/
    /* Copyright (c) 1988 by the University of Arizona Digital Image Analysis Lab */
    /*----------------------------------------------------------------------------*/
    /*-General Information--------------------------------------------------------*/
    /*                                                                            */
    /*   This function computes the Fourier transform of an image.                */
    /*                                                                            */
    /*----------------------------------------------------------------------------*/
    /*-Background Information-----------------------------------------------------*/
    /*                                                                            */
    /*   Bergland, G.D.:                                                          */
    /*   "A guided tour of the fast Fourier transform."                           */
    /*   IEEE Spectrum, Vol. 6, No. 7, July 1969                                  */
    /*                                                                            */
    /*----------------------------------------------------------------------------*/
    ,fft2d: function(im, w, h, dir, channel) {
        // Number of rows/cols must be a power of two
        /*
        if ( !dir ) dir = 1;
        if ( undef === channel ) channel = FILTER.CHANNEL.RED;
        
        var i, j, k, nchannels = 3, w2, h2, N2, N22; 
        var sine, cosn, array;
        var temp, img, im2, Array64F = FILTER.Array64F;

        w2 = closest_power_of_two( w );
        h2 = closest_power_of_two( h );
        N2 = Math.max(w2, h2);

        // allocate and initialize trigonometric tables 
        precompute_trigonometric_tables(sine=new Array64F(N2), cosn=new Array64F(N2), N2, dir);
        
        N22 = N2 << 1;
        array = new FILTER.Array64F(N22);

        // create image of appropriate size 
        fourier = new Array64F(w2*h2*(1 === dir ? 2 : 0.5));
        img = 1 === dir ? im2 : im;

        // Fourier transform each image channel (bands) 
        //for (i = 0; i < nchannels; i++)
        // convert from real to "complex" 
        if ( 1 === dir )
        {
            for (j = 0; j < h2; j += 1)
            {
                for (k = 0; k < w2; k += 2)
                {
                    im2[i][j][k] = im[j*k / 2];
                    im2data[i][j][k + 1] = (PIXEL) 0;
                }
            }
        }

        // fold 
        for (j = 0; j < h / 2; j++)
        {
            for (k = 0; k < w / 2; k++)
            {
                temp = img->data[i][j][k];
                img->data[i][j][k] = img->data[i][img->nlin / 2 + j][img->npix / 2 + k];
                img->data[i][img->nlin / 2 + j][img->npix / 2 + k] = temp;
                temp = img->data[i][img->nlin / 2 + j][k];
                img->data[i][img->nlin / 2 + j][k] = img->data[i][j][img->npix / 2 + k];
                img->data[i][j][img->npix / 2 + k] = temp;
            }
        }

        // Fourier transform rows 
        for (j = 0; j < h; j++)
        {
            for (k = 0; k < w; k++)
            {
                array[k] = img->data[i][j][k];
            }
            
            fft( array, w / 2, dir, sine, cosn );
            
            /*for (k = 0; k < w; k++)
            {
                img->data[i][j][k] = (PIXEL) array[k];
            }* /
            fourier.set(array, j*w);
        }

        // Fourier transform columns 
        for (k = 0; k < w; k += 2)
        {
            for (j = 0; j < h; j += 1)
            {
                array[2 * j] = img->data[i][j][k];
                array[2 * j + 1] = img->data[i][j][k + 1];
            }
            
            fft( array, h, dir, sine, cosn );
            
            for (j = 0; j < h; j += 1)
            {
                img->data[i][j][k] = (PIXEL) array[2 * j];
                img->data[i][j][k + 1] = (PIXEL) array[2 * j + 1];
            }
        }

        // unfold 
        for (j = 0; j < h / 2; j++)
        {
            for (k = 0; k < w / 2; k++)
            {
                temp = img->data[i][j][k];
                img->data[i][j][k] = img->data[i][img->nlin / 2 + j][img->npix / 2 + k];
                img->data[i][img->nlin / 2 + j][img->npix / 2 + k] = temp;
                temp = img->data[i][img->nlin / 2 + j][k];
                img->data[i][img->nlin / 2 + j][k] = img->data[i][j][img->npix / 2 + k];
                img->data[i][j][img->npix / 2 + k] = temp;
            }
        }

        // convert from "complex" to real 
        if ( -1 === dir )
        {
            for (j = 0; j < h; j += 1)
            {
                for (k = 0; k < w; k += 2)
                {
                    (*out)->data[i][j][k / 2] = in->data[i][j][k];
                }
            }
        }
        */
    }
};

FILTER.Compute = {
    
    // compute integral image (Summed Area Table, SAT)
    integral: function( im, w, h, grayscale ) {
        var rowLen = w<<2, integralR, integralG, integralB, colR, colG, colB,
            imLen = im.length, count = (imLen>>2), i, j, x, rgb
        ;
        grayscale = true === grayscale; rgb = !grayscale;
        // compute integral of image in one pass
        integralR = new A32F(count); 
        if ( rgb )
        {
            integralG = new A32F(count); 
            integralB = new A32F(count);
        }
        // first row
        j=0; i=0; colR=colG=colB=0;
        for (x=0; x<w; x++, i+=4, j++)
        {
            colR+=im[i]; integralR[j]=colR; 
            
            if ( rgb )
            {
                colG+=im[i+1]; colB+=im[i+2];
                integralG[j]=colG; integralB[j]=colB;
            }
        }
        // other rows
        i=rowLen; x=0; j=0; colR=colG=colB=0;
        for (i=rowLen; i<imLen; i+=4, j++, x++)
        {
            if (x>=w) { x=0; colR=colG=colB=0; }
            colR+=im[i]; 
            integralR[j+w]=integralR[j]+colR; 
            
            if ( rgb )
            {
                colG+=im[i+1]; colB+=im[i+2];
                integralG[j+w]=integralG[j]+colG; integralB[j+w]=integralB[j]+colB;
            }
        }
        return rgb ? [integralR, integralG, integralB] : [integralR, integralR, integralR];
    }
    
    // compute image histogram
    ,histogram: function( im, w, h, grayscale ) {
        var l = im.length,
            maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
            cdfR, cdfG, cdfB, r,g,b,
            accumR, accumG, accumB,
            i, n=1.0/(l>>2), rgb
        ;
        
        grayscale = true === grayscale; rgb = !grayscale;
        // initialize the arrays
        cdfR=new A32F(256); 
        if ( rgb )
        {
            cdfG=new A32F(256); 
            cdfB=new A32F(256);
        }
        for (i=0; i<256; i+=4) 
        { 
            // partial loop unrolling
            cdfR[i]=0;
            cdfR[i+1]=0;
            cdfR[i+2]=0;
            cdfR[i+3]=0;
            if ( rgb )
            {
                cdfG[i]=0; cdfB[i]=0;
                cdfG[i+1]=0; cdfB[i+1]=0;
                cdfG[i+2]=0; cdfB[i+2]=0;
                cdfG[i+3]=0; cdfB[i+3]=0;
            }
        }
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            r = im[i];
            cdfR[r] += n;
            
            if (r>maxR) maxR=r;
            else if (r<minR) minR=r;
            
            if ( rgb )
            {
                g = im[i+1]; b = im[i+2];
                cdfG[g] += n; cdfB[b] += n;
                if (g>maxG) maxG=g;
                else if (g<minG) minG=g;
                if (b>maxB) maxB=b;
                else if (b<minB) minB=b;
            }
        }
        
        // compute cdf
        accumR=accumG=accumB=0;
        for (i=0; i<256; i+=4) 
        { 
            // partial loop unrolling
            accumR += cdfR[i]; cdfR[i] = accumR;
            accumR += cdfR[i+1]; cdfR[i+1] = accumR;
            accumR += cdfR[i+2]; cdfR[i+2] = accumR;
            accumR += cdfR[i+3]; cdfR[i+3] = accumR;
            
            if ( rgb )
            {
                accumG += cdfG[i]; cdfG[i] = accumG;
                accumB += cdfB[i]; cdfB[i] = accumB;
                accumG += cdfG[i+1]; cdfG[i+1] = accumG;
                accumB += cdfB[i+1]; cdfB[i+1] = accumB;
                accumG += cdfG[i+2]; cdfG[i+2] = accumG;
                accumB += cdfB[i+2]; cdfB[i+2] = accumB;
                accumG += cdfG[i+3]; cdfG[i+3] = accumG;
                accumB += cdfB[i+3]; cdfB[i+3] = accumB;
            }
        }
        
        return rgb ? [cdfR, cdfG, cdfB] : [cdfR, cdfR, cdfR];
    }
    
    ,spectrum: function( im, w, h, grayscale ) {
        // TODO
        return null;
    }
};

FILTER.Classify = {
     kmeans: function(){}
    ,em: function(){}
    ,meanshift: function(){}
};

}(FILTER);/**
*
* Color Methods / Transforms
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var // utils
    Sqrt = Math.sqrt, 
    round = Math.round, floor = Math.floor, min = Math.min, max = Math.max, abs = Math.abs,
    
    clamp = FILTER.Math.clamp,
    
    esc = function(s) { return s.replace(/([.*+?^${}()|\[\]\/\\\-])/g, '\\$1'); },
    
    trim = function(s) { return s.replace(/^\s+/gm, '').replace(/\s+$/gm, ''); },
    
    C2F = 1/255,
    C2P = 100/255,
    P2C = 2.55,

    Keywords = {
        // http://www.w3.org/wiki/CSS/Properties/color/keywords
        // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value
        /* extended */
        'transparent'         : [  0,0,0        ,0]
        ,'aliceblue'           : [  240,248,255  ,1]
        ,'antiquewhite'        : [  250,235,215  ,1]
        ,'aqua'                : [  0,255,255    ,1]
        ,'aquamarine'          : [  127,255,212  ,1]
        ,'azure'               : [  240,255,255  ,1]
        ,'beige'               : [  245,245,220  ,1]
        ,'bisque'              : [  255,228,196  ,1]
        ,'black'               : [  0,0,0    ,    1]
        ,'blanchedalmond'      : [  255,235,205  ,1]
        ,'blue'                : [  0,0,255  ,    1]
        ,'blueviolet'          : [  138,43,226   ,1]
        ,'brown'               : [  165,42,42    ,1]
        ,'burlywood'           : [  222,184,135  ,1]
        ,'cadetblue'           : [  95,158,160   ,1]
        ,'chartreuse'          : [  127,255,0    ,1]
        ,'chocolate'           : [  210,105,30   ,1]
        ,'coral'               : [  255,127,80   ,1]
        ,'cornflowerblue'      : [  100,149,237  ,1]
        ,'cornsilk'            : [  255,248,220  ,1]
        ,'crimson'             : [  220,20,60    ,1]
        ,'cyan'                : [  0,255,255    ,1]
        ,'darkblue'            : [  0,0,139  ,    1]
        ,'darkcyan'            : [  0,139,139    ,1]
        ,'darkgoldenrod'       : [  184,134,11   ,1]
        ,'darkgray'            : [  169,169,169  ,1]
        ,'darkgreen'           : [  0,100,0  ,    1]
        ,'darkgrey'            : [  169,169,169  ,1]
        ,'darkkhaki'           : [  189,183,107  ,1]
        ,'darkmagenta'         : [  139,0,139    ,1]
        ,'darkolivegreen'      : [  85,107,47    ,1]
        ,'darkorange'          : [  255,140,0    ,1]
        ,'darkorchid'          : [  153,50,204   ,1]
        ,'darkred'             : [  139,0,0  ,    1]
        ,'darksalmon'          : [  233,150,122  ,1]
        ,'darkseagreen'        : [  143,188,143  ,1]
        ,'darkslateblue'       : [  72,61,139    ,1]
        ,'darkslategray'       : [  47,79,79 ,    1]
        ,'darkslategrey'       : [  47,79,79 ,    1]
        ,'darkturquoise'       : [  0,206,209    ,1]
        ,'darkviolet'          : [  148,0,211    ,1]
        ,'deeppink'            : [  255,20,147   ,1]
        ,'deepskyblue'         : [  0,191,255    ,1]
        ,'dimgray'             : [  105,105,105  ,1]
        ,'dimgrey'             : [  105,105,105  ,1]
        ,'dodgerblue'          : [  30,144,255   ,1]
        ,'firebrick'           : [  178,34,34    ,1]
        ,'floralwhite'         : [  255,250,240  ,1]
        ,'forestgreen'         : [  34,139,34    ,1]
        ,'fuchsia'             : [  255,0,255    ,1]
        ,'gainsboro'           : [  220,220,220  ,1]
        ,'ghostwhite'          : [  248,248,255  ,1]
        ,'gold'                : [  255,215,0    ,1]
        ,'goldenrod'           : [  218,165,32   ,1]
        ,'gray'                : [  128,128,128  ,1]
        ,'green'               : [  0,128,0  ,    1]
        ,'greenyellow'         : [  173,255,47   ,1]
        ,'grey'                : [  128,128,128  ,1]
        ,'honeydew'            : [  240,255,240  ,1]
        ,'hotpink'             : [  255,105,180  ,1]
        ,'indianred'           : [  205,92,92    ,1]
        ,'indigo'              : [  75,0,130 ,    1]
        ,'ivory'               : [  255,255,240  ,1]
        ,'khaki'               : [  240,230,140  ,1]
        ,'lavender'            : [  230,230,250  ,1]
        ,'lavenderblush'       : [  255,240,245  ,1]
        ,'lawngreen'           : [  124,252,0    ,1]
        ,'lemonchiffon'        : [  255,250,205  ,1]
        ,'lightblue'           : [  173,216,230  ,1]
        ,'lightcoral'          : [  240,128,128  ,1]
        ,'lightcyan'           : [  224,255,255  ,1]
        ,'lightgoldenrodyellow': [  250,250,210  ,1]
        ,'lightgray'           : [  211,211,211  ,1]
        ,'lightgreen'          : [  144,238,144  ,1]
        ,'lightgrey'           : [  211,211,211  ,1]
        ,'lightpink'           : [  255,182,193  ,1]
        ,'lightsalmon'         : [  255,160,122  ,1]
        ,'lightseagreen'       : [  32,178,170   ,1]
        ,'lightskyblue'        : [  135,206,250  ,1]
        ,'lightslategray'      : [  119,136,153  ,1]
        ,'lightslategrey'      : [  119,136,153  ,1]
        ,'lightsteelblue'      : [  176,196,222  ,1]
        ,'lightyellow'         : [  255,255,224  ,1]
        ,'lime'                : [  0,255,0  ,    1]
        ,'limegreen'           : [  50,205,50    ,1]
        ,'linen'               : [  250,240,230  ,1]
        ,'magenta'             : [  255,0,255    ,1]
        ,'maroon'              : [  128,0,0  ,    1]
        ,'mediumaquamarine'    : [  102,205,170  ,1]
        ,'mediumblue'          : [  0,0,205  ,    1]
        ,'mediumorchid'        : [  186,85,211   ,1]
        ,'mediumpurple'        : [  147,112,219  ,1]
        ,'mediumseagreen'      : [  60,179,113   ,1]
        ,'mediumslateblue'     : [  123,104,238  ,1]
        ,'mediumspringgreen'   : [  0,250,154    ,1]
        ,'mediumturquoise'     : [  72,209,204   ,1]
        ,'mediumvioletred'     : [  199,21,133   ,1]
        ,'midnightblue'        : [  25,25,112    ,1]
        ,'mintcream'           : [  245,255,250  ,1]
        ,'mistyrose'           : [  255,228,225  ,1]
        ,'moccasin'            : [  255,228,181  ,1]
        ,'navajowhite'         : [  255,222,173  ,1]
        ,'navy'                : [  0,0,128  ,    1]
        ,'oldlace'             : [  253,245,230  ,1]
        ,'olive'               : [  128,128,0    ,1]
        ,'olivedrab'           : [  107,142,35   ,1]
        ,'orange'              : [  255,165,0    ,1]
        ,'orangered'           : [  255,69,0 ,    1]
        ,'orchid'              : [  218,112,214  ,1]
        ,'palegoldenrod'       : [  238,232,170  ,1]
        ,'palegreen'           : [  152,251,152  ,1]
        ,'paleturquoise'       : [  175,238,238  ,1]
        ,'palevioletred'       : [  219,112,147  ,1]
        ,'papayawhip'          : [  255,239,213  ,1]
        ,'peachpuff'           : [  255,218,185  ,1]
        ,'peru'                : [  205,133,63   ,1]
        ,'pink'                : [  255,192,203  ,1]
        ,'plum'                : [  221,160,221  ,1]
        ,'powderblue'          : [  176,224,230  ,1]
        ,'purple'              : [  128,0,128    ,1]
        ,'red'                 : [  255,0,0  ,    1]
        ,'rosybrown'           : [  188,143,143  ,1]
        ,'royalblue'           : [  65,105,225   ,1]
        ,'saddlebrown'         : [  139,69,19    ,1]
        ,'salmon'              : [  250,128,114  ,1]
        ,'sandybrown'          : [  244,164,96   ,1]
        ,'seagreen'            : [  46,139,87    ,1]
        ,'seashell'            : [  255,245,238  ,1]
        ,'sienna'              : [  160,82,45    ,1]
        ,'silver'              : [  192,192,192  ,1]
        ,'skyblue'             : [  135,206,235  ,1]
        ,'slateblue'           : [  106,90,205   ,1]
        ,'slategray'           : [  112,128,144  ,1]
        ,'slategrey'           : [  112,128,144  ,1]
        ,'snow'                : [  255,250,250  ,1]
        ,'springgreen'         : [  0,255,127    ,1]
        ,'steelblue'           : [  70,130,180   ,1]
        ,'tan'                 : [  210,180,140  ,1]
        ,'teal'                : [  0,128,128    ,1]
        ,'thistle'             : [  216,191,216  ,1]
        ,'tomato'              : [  255,99,71    ,1]
        ,'turquoise'           : [  64,224,208   ,1]
        ,'violet'              : [  238,130,238  ,1]
        ,'wheat'               : [  245,222,179  ,1]
        ,'white'               : [  255,255,255  ,1]
        ,'whitesmoke'          : [  245,245,245  ,1]
        ,'yellow'              : [  255,255,0    ,1]
        ,'yellowgreen'         : [  154,205,50   ,1]    
    }
;

// adapted from https://github.com/foo123/css-color

// static Color Methods and Transforms
// http://en.wikipedia.org/wiki/Color_space

//
// Color Class and utils
var Color = FILTER.Color = FILTER.Class({
    
    //
    // static
    __static__: {
    
        clamp: clamp,
        
        clampPixel: function( v ) { return min(255, max(v, 0)); },
        
        toGray: function(r, g, b) {
            var LUMA=FILTER.LUMA;  return ~~(LUMA[0]*r + LUMA[1]*g + LUMA[2]*b);
        }, 
        
        distance: function(rgb1, rgb2) {
            var dr=rgb1[0]-rgb2[0], dg=rgb1[1]-rgb2[1], db=rgb1[2]-rgb2[2];
            return Sqrt(dr*dr + dg*dg + db*db);
        },
        
        RGB2Color: function(rgb) {
            return ((rgb[0] << 16) | (rgb[1] << 8) | (rgb[2])&255);
        },
        
        RGBA2Color: function(rgba) {
            return ((rgba[3] << 24) | (rgba[0] << 16) | (rgba[1] << 8) | (rgba[2])&255);
        },
        
        Color2RGBA: function(c) {
            c=~~c;
            return [
                (c >>> 16) & 255,
                (c >>> 8) & 255,
                (c & 255),
                (c >>> 24) & 255
            ];
        },

        // http://en.wikipedia.org/wiki/YCbCr
        RGB2YCbCr: function(rgb) {
            var y, cb, cr, r=rgb[0], g=rgb[1], b=rgb[2];
            
            // each take full range from 0-255
            y = ~~( 0   + 0.299*r    + 0.587*g     + 0.114*b    );
            cb= ~~( 128 - 0.168736*r - 0.331264*g  + 0.5*b      );
            cr= ~~( 128 + 0.5*r      - 0.418688*g  - 0.081312*b );
            return [y, cb, cr];
        },
        
        // http://en.wikipedia.org/wiki/YCbCr
        YCbCr2RGB: function(ycbcr) {
            var r, g, b, y=ycbcr[0], cb=ycbcr[1], cr=ycbcr[2];
            
            // each take full range from 0-255
            r = ~~( y                      + 1.402   * (cr-128) );
            g = ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) );
            b = ~~( y + 1.772   * (cb-128) );
            return [r, g, b];
        },
        
        // http://en.wikipedia.org/wiki/HSL_color_space
        // adapted from http://www.cs.rit.edu/~ncs/colo
        RGB2HSV: function(rgb)  {
            var m, M, delta, 
                r, g, b, h, s, v
            ;

            r=rgb[0]; g=rgb[1]; b=rgb[2];
            
            m = min( r, g, b );  M = max( r, g, b );  delta = M - m;
            v = M;                // v

            if( M != 0 )
            {
                s = delta / M;        // s
            }
            else 
            {
                // r = g = b = 0        // s = 0, v is undefined
                s = 0;  h = 0; //h = -1;
                return [h, s, v];
            }

            if( r == M )    h = ( g - b ) / delta;        // between yellow & magenta
            else if ( g == M )  h = 2 + ( b - r ) / delta;    // between cyan & yellow
            else   h = 4 + ( r - g ) / delta;   // between magenta & cyan

            h *= 60;                // degrees
            if( h < 0 )  h += 360;
            
            return [h, s, v];
        },
        
        // http://en.wikipedia.org/wiki/HSL_color_space
        // adapted from http://www.cs.rit.edu/~ncs/color/t_convert.html
        HSV2RGB: function( hsv ) {
            var i,
                f, p, q, t,
                r, g, b, h, s, v
            ;
            
            h=hsv[0]; s=hsv[1]; v=hsv[2];
            
            if( s == 0 ) 
            {
                // achromatic (grey)
                r = g = b = v;
                return [r, g, b];
            }

            h /= 60;            // sector 0 to 5
            i = ~~( h );
            f = h - i;          // factorial part of h
            p = v * ( 1 - s );   q = v * ( 1 - s * f );  t = v * ( 1 - s * ( 1 - f ) );

            switch( i ) 
            {
                case 0:  r = v;   g = t;   b = p;
                    break;
                case 1: r = q;  g = v;   b = p;
                    break;
                case 2: r = p;  g = v;  b = t;
                    break;
                case 3: r = p;  g = q;  b = v;
                    break;
                case 4: r = t;  g = p;  b = v;
                    break;
                default:        // case 5:
                    r = v;  g = p;  b = q;
                    break;
            }
            
            return [r, g, b];
        },
        
        toString: function() {
            return "[" + "FILTER: " + this.name + "]";
        },
    
        C2F: C2F,
        C2P: C2P,
        P2C: P2C,
        
        Keywords: Keywords,
        
        // color format regexes
        hexieRE: /^#([0-9a-fA-F]{8})\b/,
        hexRE: /^#([0-9a-fA-F]{3,6})\b/,
        rgbRE: /^(rgba?)\b\s*\(([^\)]*)\)/i,
        hslRE: /^(hsla?)\b\s*\(([^\)]*)\)/i,
        keywordRE: new RegExp('^(' + Object.keys(Keywords).map(esc).join('|') + ')\\b', 'i'),
        colorstopRE: /^\s+(\d+(\.\d+)?%?)/,
        
        // color format conversions
        // http://www.rapidtables.com/convert/color/index.htm
        col2per: function(c, suffix) {
            return (c*C2P)+(suffix||'');
        },
        per2col: function(c) {
            return c*P2C;
        },
        
        // http://www.javascripter.net/faq/rgb2cmyk.htm
        rgb2cmyk: function(r, g, b, asPercent) {
            var c = 0, m = 0, y = 0, k = 0,
                minCMY, invCMY
            ;

            if ( asPercent )
            {
                r = clamp(round(r*P2C), 0, 255);
                g = clamp(round(g*P2C), 0, 255);
                b = clamp(round(b*P2C), 0, 255);
            }
            
            // BLACK
            if ( 0==r && 0==g && 0==b ) 
            {
                k = 1;
                return [0, 0, 0, 1];
            }

            c = 1 - (r*C2F);
            m = 1 - (g*C2F);
            y = 1 - (b*C2F);

            minCMY = min( c, m, y );
            invCMY = 1 / (1 - minCMY);
            c = (c - minCMY) * invCMY;
            m = (m - minCMY) * invCMY;
            y = (y - minCMY) * invCMY;
            k = minCMY;

            return [c, m, y, k];
        },
        cmyk2rgb: function(c, m, y, k) {
            var r = 0, g = 0, b = 0,
                minCMY, invCMY
            ;

            // BLACK
            if ( 0==c && 0==m && 0==y ) 
            {
                return [0, 0, 0];
            }
            
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
        },
        rgb2hex: function(r, g, b, condenced, asPercent) { 
            var hex;
            if ( asPercent )
            {
                r = clamp(round(r*P2C), 0, 255);
                g = clamp(round(g*P2C), 0, 255);
                b = clamp(round(b*P2C), 0, 255);
            }
            
            r = ( r < 16 ) ? '0'+r.toString(16) : r.toString(16);
            g = ( g < 16 ) ? '0'+g.toString(16) : g.toString(16);
            b = ( b < 16 ) ? '0'+b.toString(16) : b.toString(16);
            
            if ( condenced && (r[0]==r[1] && g[0]==g[1] && b[0]==b[1]) )
                hex = '#' + r[0] + g[0] + b[0];
            else
                hex = '#' + r + g + b;
            
            return hex;
        },
        rgb2hexIE: function(r, g, b, a, asPercent) { 
            var hex;
            if ( asPercent )
            {
                r = clamp(round(r*P2C), 0, 255);
                g = clamp(round(g*P2C), 0, 255);
                b = clamp(round(b*P2C), 0, 255);
                a = clamp(round(a*P2C), 0, 255);
            }
            
            r = ( r < 16 ) ? '0'+r.toString(16) : r.toString(16);
            g = ( g < 16 ) ? '0'+g.toString(16) : g.toString(16);
            b = ( b < 16 ) ? '0'+b.toString(16) : b.toString(16);
            a = ( a < 16 ) ? '0'+a.toString(16) : a.toString(16);
            hex = '#' + a + r + g + b;
            
            return hex;
        },
        hex2rgb: function(h/*, asPercent*/) {  
            if ( !h || 3 > h.length )
                return [0, 0, 0];
                
            if ( 6 > h.length )
                return [
                    clamp( parseInt(h[0]+h[0], 16), 0, 255 ), 
                    clamp( parseInt(h[1]+h[1], 16), 0, 255 ), 
                    clamp( parseInt(h[2]+h[2], 16), 0, 255 )
                ];
            
            else
                return [
                    clamp( parseInt(h[0]+h[1], 16), 0, 255 ), 
                    clamp( parseInt(h[2]+h[3], 16), 0, 255 ), 
                    clamp( parseInt(h[4]+h[5], 16), 0, 255 )
                ];
            
            /*if ( asPercent )
                rgb = [
                    (rgb[0]*C2P)+'%', 
                    (rgb[1]*C2P)+'%', 
                    (rgb[2]*C2P)+'%'
                ];*/
        },
        // http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
        /**
         * Converts an HSL color value to RGB. Conversion formula
         * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
         * Assumes h, s, and l are contained in the set [0, 1] and
         * returns r, g, and b in the set [0, 255].
         */
        hue2rgb: function(p, q, t) {
            if ( t < 0 ) t += 1;
            if ( t > 1 ) t -= 1;
            if ( t < 1/6 ) return p + (q - p) * 6 * t;
            if ( t < 1/2 ) return q;
            if ( t < 2/3 ) return p + (q - p) * (2/3 - t) * 6;
            return p;
        },
        hsl2rgb: function(h, s, l) {
            var r, g, b, p, q;

            // convert to [0, 1] range
            h = ((h + 360)%360)/360;
            s *= 0.01;
            l *= 0.01;
            
            if ( 0 == s )
            {
                // achromatic
                r = 1;
                g = 1;
                b = 1;
            }
            else
            {

                q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                p = 2 * l - q;
                r = Color.hue2rgb(p, q, h + 1/3);
                g = Color.hue2rgb(p, q, h);
                b = Color.hue2rgb(p, q, h - 1/3);
            }

            return [
                clamp( round(r * 255), 0, 255 ), 
                clamp( round(g * 255), 0, 255 ),  
                clamp( round(b * 255), 0, 255 )
            ];
        },
        /**
        * Converts an RGB color value to HSL. Conversion formula
        * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
        * Assumes r, g, and b are contained in the set [0, 255] and
        * returns h, s, and l in the set [0, 1].
        */
        rgb2hsl: function(r, g, b, asPercent) {
            var m, M, h, s, l, d;
            
            if ( asPercent )
            {
                r *= 0.01;
                g *= 0.01;
                b *= 0.01;
            }
            else
            {
                r *= C2F; 
                g *= C2F; 
                b *= C2F;
            }
            M = max(r, g, b); 
            m = min(r, g, b);
            l = 0.5*(M + m);

            if ( M == m )
            {
                h = s = 0; // achromatic
            }
            else
            {
                d = M - m;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                if ( M == r )
                    h = (g - b) / d + (g < b ? 6 : 0);
                
                else if ( M == g )
                    h = (b - r) / d + 2;
                
                else
                    h = (r - g) / d + 4;
                
                h /= 6;
            }
            
            return [
                round( h*360 ) % 360, 
                clamp(s*100, 0, 100), 
                clamp(l*100, 0, 100)
            ];
        },
        
        parse: function(s, withColorStops, parsed, onlyColor) {
            var m, m2, s2, end = 0, end2 = 0, c, hasOpacity;
            
            if ( 'hsl' == parsed || 
                ( !parsed && (m = s.match(Color.hslRE)) ) 
            )
            {
                // hsl(a)
                if ( 'hsl' == parsed )
                {
                    hasOpacity = 'hsla' == s[0].toLowerCase();
                    var col = s[1].split(',').map(trim);
                }
                else
                {
                    end = m[0].length;
                    end2 = 0;
                    hasOpacity = 'hsla' == m[1].toLowerCase();
                    var col = m[2].split(',').map(trim);
                }    
                
                var h = col[0] ? col[0] : '0';
                var s = col[1] ? col[1] : '0';
                var l = col[2] ? col[2] : '0';
                var a = hasOpacity && null!=col[3] ? col[3] : '1';
                
                h = parseFloat(h, 10);
                s = ('%'==s.slice(-1)) ? parseFloat(s, 10) : parseFloat(s, 10)*C2P;
                l = ('%'==l.slice(-1)) ? parseFloat(l, 10) : parseFloat(l, 10)*C2P;
                a = parseFloat(a, 10);
                
                c = new Color().fromHSL([h, s, l, a]);

                if ( withColorStops )
                {
                    s2 = s.substr( end );
                    if ( m2 = s2.match(Color.colorstopRE) )
                    {
                        c.colorStop( m2[1] );
                        end2 = m2[0].length;
                    }
                }
                return onlyColor ? c : [c, 0, end+end2];
            }
            if ( 'rgb' == parsed || 
                ( !parsed && (m = s.match(Color.rgbRE)) ) 
            )
            {
                // rgb(a)
                if ( 'rgb' == parsed )
                {
                    hasOpacity = 'rgba' == s[0].toLowerCase();
                    var col = s[1].split(',').map(trim);
                }
                else
                {
                    end = m[0].length;
                    end2 = 0;
                    hasOpacity = 'rgba' == m[1].toLowerCase();
                    var col = m[2].split(',').map(trim);
                }    
                    
                var r = col[0] ? col[0] : '0';
                var g = col[1] ? col[1] : '0';
                var b = col[2] ? col[2] : '0';
                var a = hasOpacity && null!=col[3] ? col[3] : '1';
                
                r = ('%'==r.slice(-1)) ? parseFloat(r, 10)*2.55 : parseFloat(r, 10);
                g = ('%'==g.slice(-1)) ? parseFloat(g, 10)*2.55 : parseFloat(g, 10);
                b = ('%'==b.slice(-1)) ? parseFloat(b, 10)*2.55 : parseFloat(b, 10);
                a = parseFloat(a, 10);
                
                c = new Color().fromRGB([r, g, b, a]);

                if ( withColorStops )
                {
                    s2 = s.substr( end );
                    if ( m2 = s2.match(Color.colorstopRE) )
                    {
                        c.colorStop( m2[1] );
                        end2 = m2[0].length;
                    }
                }
                return onlyColor ? c : [c, 0, end+end2];
            }
            if ( 'hex' == parsed || 
                ( !parsed && (m = s.match(Color.hexRE)) ) 
            )
            {
                // hex
                if ( 'hex' == parsed )
                {
                    var col = Color.hex2rgb( s[0] );
                }
                else
                {
                    end = m[0].length;
                    end2 = 0;
                    var col = Color.hex2rgb( m[1] );
                }    
                    
                var h1 = col[0] ? col[0] : 0x00;
                var h2 = col[1] ? col[1] : 0x00;
                var h3 = col[2] ? col[2] : 0x00;
                var a = null!=col[3] ? col[3] : 0xff;
                
                c = new Color().fromHEX([h1, h2, h3, a]);

                if ( withColorStops )
                {
                    s2 = s.substr( end );
                    if ( m2 = s2.match(Color.colorstopRE) )
                    {
                        c.colorStop( m2[1] );
                        end2 = m2[0].length;
                    }
                }
                return onlyColor ? c : [c, 0, end+end2];
            }
            if ( 'keyword' == parsed || 
                ( !parsed && (m = s.match(Color.keywordRE)) ) 
            )
            {
                // keyword
                if ( 'keyword' == parsed )
                {
                    var col = s[0];
                }
                else
                {
                    end = m[0].length;
                    end2 = 0;
                    var col = m[1];
                }    
                    
                c = new Color().fromKeyword(col);

                if ( withColorStops )
                {
                    s2 = s.substr( end );
                    if ( m2 = s2.match(Color.colorstopRE) )
                    {
                        c.colorStop( m2[1] );
                        end2 = m2[0].length;
                    }
                }
                return onlyColor ? c : [c, 0, end+end2];
            }
            return null;
        },
        fromString: function(s, withColorStops, parsed) {
            return Color.parse(s, withColorStops, parsed, 1);
        },
        fromRGB: function(rgb) {
            return new Color().fromRGB(rgb);
        },
        fromHSL: function(hsl) {
            return new Color().fromHSL(hsl);
        },
        fromCMYK: function(cmyk) {
            return new Color().fromCMYK(cmyk);
        },
        fromHEX: function(hex) {
            return new Color().fromHEX(hex);
        },
        fromKeyword: function(keyword) {
            return new Color().fromKeyword(keyword);
        },
        fromPixel: function(pixCol) {
            return new Color().fromPixel(pixCol);
        }
    },
    
    constructor: function( color, cstop ) {
        // constructor factory pattern used here also
        if ( this instanceof Color ) 
        {
            this.reset();
            if ( color ) this.set( color, cstop );
        } 
        else 
        {
            return new Color( color, cstop );
        }
    },
    
    name: "Color",
    col: null,
    cstop: null,
    kword: null,
    
    clone: function() {
        var c = new Color();
        c.col = this.col.slice();
        c.cstop = this.cstop+'';
        c.kword = this.kword;
        return c;
    },
    
    reset: function() {
        this.col = [0, 0, 0, 1];
        this.cstop = '';
        this.kword = null;
        return this;
    },
    
    set: function(color, cstop) {
        if ( color )
        {
            if ( undef !== color[0] )
                this.col[0] = clamp(color[0], 0, 255);
            if ( undef !== color[1] )
                this.col[1] = clamp(color[1], 0, 255);
            if ( undef !== color[2] )
                this.col[2] = clamp(color[2], 0, 255);
            if ( undef !== color[3] )
                this.col[3] = clamp(color[3], 0, 1);
            else
                this.col[3] = 1;
                
            if (cstop)
                this.cstop = cstop;
                
            this.kword = null;
        }
        return this;
    },
    
    colorStop: function(cstop) {
        this.cstop = cstop;
        return this;
    },
    
    isTransparent: function() {
        return 1 > this.col[3];
    },
    
    isKeyword: function() {
        return this.kword ? true : false;
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
    
    fromKeyword: function(kword) {
        
        kword = kword.toLowerCase();
        if ( Color.Keywords[kword] )
        {
            this.col = Color.Keywords[kword].slice();
            this.kword = kword;
        }
        return this;
    },
    
    fromHEX: function(hex) {
        
        this.col[0] = hex[0] ? clamp(parseInt(hex[0], 10), 0, 255) : 0;
        this.col[1] = hex[1] ? clamp(parseInt(hex[1], 10), 0, 255) : 0;
        this.col[2] = hex[2] ? clamp(parseInt(hex[2], 10), 0, 255) : 0;
        this.col[3] = undef!==hex[3] ? clamp(parseInt(hex[3], 10)*C2F, 0, 1) : 1;
        
        this.kword = null;
        
        return this;
    },
    
    fromRGB: function(rgb) {
        
        this.col[0] = rgb[0] ? clamp(round(rgb[0]), 0, 255) : 0;
        this.col[1] = rgb[1] ? clamp(round(rgb[1]), 0, 255) : 0;
        this.col[2] = rgb[2] ? clamp(round(rgb[2]), 0, 255) : 0;
        this.col[3] = undef!==rgb[3] ? clamp(rgb[3], 0, 1) : 1;
        
        this.kword = null;
        
        return this;
    },
    
    fromCMYK: function(cmyk) {
        var rgb = Color.cmyk2rgb(cmyk[0]||0, cmyk[1]||0, cmyk[2]||0, cmyk[3]||0);
        
        this.col[0] = rgb[0];
        this.col[1] = rgb[1];
        this.col[2] = rgb[2];
        this.col[3] = undef!==cmyk[4] ? clamp(cmyk[4], 0, 1) : 1;
        
        this.kword = null;
        
        return this;
    },
    
    fromHSL: function(hsl) {
        var rgb = Color.hsl2rgb(hsl[0]||0, hsl[1]||0, hsl[2]||0);
        
        this.col[0] = rgb[0];
        this.col[1] = rgb[1];
        this.col[2] = rgb[2];
        this.col[3] = undef!==hsl[3] ? clamp(hsl[3], 0, 1) : 1;
        
        this.kword = null;
        
        return this;
    },
    
    toPixel: function(withTransparency) {
        if ( withTransparency )
            return ((clamp(this.col[3]*255, 0, 255) << 24) | (this.col[0] << 16) | (this.col[1] << 8) | (this.col[2])&255);
        else
            return ((this.col[0] << 16) | (this.col[1] << 8) | (this.col[2])&255);
    },
    
    toCMYK: function(asString, condenced, noTransparency) {
        var cmyk = Color.rgb2cmyk(this.col[0], this.col[1], this.col[2]);
        if (noTransparency)
            return cmyk;
        else
            return cmyk.concat(this.col[3]);
    },
    
    toKeyword: function(asString, condenced, withTransparency) {
        if ( this.kword )
            return this.kword;
        else
            return this.toHEX(1, condenced, withTransparency);
    },
    
    toHEX: function(asString, condenced, withTransparency) {
        if ( withTransparency )
            return Color.rgb2hexIE( this.col[0], this.col[1], this.col[2], clamp(round(255*this.col[3]), 0, 255) );
        else
            return Color.rgb2hex( this.col[0], this.col[1], this.col[2], condenced );
    },
    
    toRGB: function(asString, condenced, noTransparency) {
        var opcty = this.col[3];
        if ( asString )
        {
            if ( condenced )
            {
                opcty =  ((1 > opcty && opcty > 0) ? opcty.toString().slice(1) : opcty );
            }
            
            if ( noTransparency || 1 == this.col[3] )
                return 'rgb(' + this.col.slice(0, 3).join(',') + ')';
            else
                return 'rgba(' + this.col.slice(0, 3).concat(opcty).join(',') + ')';
        }
        else
        {
            if ( noTransparency )
                return this.col.slice(0, 3);
            else
                return this.col.slice();
        }
    },
    
    toHSL: function(asString, condenced, noTransparency) {
        var opcty = this.col[3];
        var hsl = Color.rgb2hsl(this.col[0], this.col[1], this.col[2]);
        
        if ( asString )
        {
            if ( condenced )
            {
                hsl[1] = (0==hsl[1] ? hsl[1] : (hsl[1]+'%'));
                hsl[2] = (0==hsl[2] ? hsl[2] : (hsl[2]+'%'));
                opcty =  ((1 > opcty && opcty > 0) ? opcty.toString().slice(1) : opcty );
            }
            
            if ( noTransparency || 1 == this.col[3] )
                return 'hsl(' + [hsl[0], hsl[1], hsl[2]].join(',') + ')';
            else
                return 'hsla(' + [hsl[0], hsl[1], hsl[2], opcty].join(',') + ')';
        }
        else
        {
            if ( noTransparency )
                return hsl;
            else
                return hsl.concat( this.col[3] );
        }
    },
    
    toColorStop: function(compatType) {
        var cstop = this.cstop;
        if ( compatType )
        {
            cstop = cstop.length ? (cstop+',') : '';
            if ( 1 > this.col[3] )
                return 'color-stop(' + cstop + this.toRGB(1,1) + ')';
            else
                return 'color-stop(' + cstop + this.toHEX(1,1) + ')';
        }
        else
        {
            cstop = cstop.length ? (' '+cstop) : '';
            if ( 1 > this.col[3] )
                return this.toRGB(1,1) + cstop;
            else
                return this.toHEX(1,1) + cstop;
        }
    },
    
    toString: function( format, condenced ) {
        format = format ? format.toLowerCase() : 'hex';
        if ( 'rgb' == format || 'rgba' == format )
        {
            return this.toRGB(1, false!==condenced, 'rgb' == format);
        }
        else if ( 'hsl' == format || 'hsla' == format )
        {
            return this.toHSL(1, false!==condenced, 'hsl' == format);
        }
        else if ( 'keyword' == format )
        {
            return this.toKeyword(1);
        }
        return this.toHEX(1, false!==condenced, 'hexie' == format);
    }
});
    
}(FILTER);/**
*
* Image Proxy Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var PROTO = 'prototype', devicePixelRatio = FILTER.devicePixelRatio,
    IMG = FILTER.ImArray, IMGcpy = FILTER.ImArrayCopy, A32F = FILTER.Array32F,
    createCanvas = FILTER.createCanvas,
    notSupportTyped = FILTER._notSupportTypedArrays,
    Min = Math.min, Floor = Math.floor,
    FORMAT = FILTER.FORMAT,
    MIME = FILTER.MIME,

    IDATA = 1, ODATA = 2, ISEL = 4, OSEL = 8, HIST = 16, SAT = 32, SPECTRUM = 64,
    WIDTH = 2, HEIGHT = 4, WIDTH_AND_HEIGHT = WIDTH | HEIGHT,
    SEL = ISEL|OSEL, DATA = IDATA|ODATA,
    CLEAR_DATA = ~DATA, CLEAR_SEL = ~SEL,
    CLEAR_HIST = ~HIST, CLEAR_SAT = ~SAT, CLEAR_SPECTRUM = ~SPECTRUM
;

// auxilliary (private) methods
function _getTmpCanvas( scope ) 
{
    var w = scope.width, h = scope.height,
        cnv = createCanvas(w, h);
    cnv.width = w * devicePixelRatio;
    cnv.height = h * devicePixelRatio;
    return cnv;
}

function _setDimensions( scope, w, h, what ) 
{
    what = what || WIDTH_AND_HEIGHT;
    if ( what & WIDTH )
    {
        scope.width = w;
        scope.oCanvas.style.width = w + 'px';
        scope.oCanvas.width = w * devicePixelRatio;
        if ( scope._restorable ) 
        {
        scope.iCanvas.style.width = scope.oCanvas.style.width;
        scope.iCanvas.width = scope.oCanvas.width;
        }
        if ( scope.tmpCanvas )
        {
            scope.tmpCanvas.style.width = scope.oCanvas.style.width;
            scope.tmpCanvas.width = scope.oCanvas.width;
        }
    }
    if ( what & HEIGHT )
    {
        scope.height = h;
        scope.oCanvas.style.height = h + 'px';
        scope.oCanvas.height = h * devicePixelRatio;
        if ( scope._restorable ) 
        {
        scope.iCanvas.style.height = scope.oCanvas.style.height;
        scope.iCanvas.height = scope.oCanvas.height;
        }
        if ( scope.tmpCanvas )
        {
            scope.tmpCanvas.style.height = scope.oCanvas.style.height;
            scope.tmpCanvas.height = scope.oCanvas.height;
        }
    }
    return scope;
}

function _refreshData( scope, what ) 
{
    var w = scope.width, h = scope.height;
    what = what || 255;
    if ( scope._restorable && (what & IDATA) && (scope._needsRefresh & IDATA) )
    {
        scope.iData = scope.ictx.getImageData(0, 0, w, h);
        scope._needsRefresh &= ~IDATA;
    }
    if ( (what & ODATA) && (scope._needsRefresh & ODATA) )
    {
        scope.oData = scope.octx.getImageData(0, 0, w, h);
        scope._needsRefresh &= ~ODATA;
    }
    //scope._needsRefresh &= CLEAR_DATA;
    return scope;
}

function _refreshSelectedData( scope, what ) 
{
    if ( scope.selection )
    {
        var sel = scope.selection, ow = scope.width-1, oh = scope.height-1,
            xs = Floor(sel[0]*ow), ys = Floor(sel[1]*oh), 
            ws = Floor(sel[2]*ow)-xs+1, hs = Floor(sel[3]*oh)-ys+1
        ;
        what = what || 255;
        if ( scope._restorable && (what & ISEL) && (scope._needsRefresh & ISEL) )
        {
            scope.iDataSel = scope.ictx.getImageData(xs, ys, ws, hs);
            scope._needsRefresh &= ~ISEL;
        }
        if ( (what & OSEL) && (scope._needsRefresh & OSEL) )
        {
            scope.oDataSel = scope.octx.getImageData(xs, ys, ws, hs);
            scope._needsRefresh &= ~OSEL;
        }
    }
    //scope._needsRefresh &= CLEAR_SEL;
    return scope;
}
    
//
// Image (Proxy) Class
var FilterImage = FILTER.Image = FILTER.Class({
    name: "Image"
    
    ,constructor: function FilterImage( img ) {
        var self = this, w = 0, h = 0;
        // factory-constructor pattern
        if ( !(self instanceof FilterImage) ) return new FilterImage(img);
        self.width = w; self.height = h;
        self.iData = null; self.iDataSel = null;
        self.oData = null; self.oDataSel = null;
        self.iCanvas = createCanvas(w, h);
        self.oCanvas = createCanvas(w, h);
        self.tmpCanvas = null;
        self.domElement = self.oCanvas;
        self.ictx = self.iCanvas.getContext('2d');
        self.octx = self.oCanvas.getContext('2d');
        self.webgl = null;
        self._histogram = null;
        self._integral = null;
        self._spectrum = null;
        // lazy
        self.selection = null;
        self._needsRefresh = 0;
        self._restorable = true;
        self._grayscale = false;
        if ( img ) self.image( img );
    }
    
    // properties
    ,width: 0
    ,height: 0
    ,selection: null
    ,iCanvas: null
    ,oCanvas: null
    ,tmpCanvas: null
    ,ictx: null
    ,octx: null
    ,iData: null
    ,iDataSel: null
    ,oData: null
    ,oDataSel: null
    ,domElement: null
    ,webgl: null
    ,_histogram: null
    ,_integral: null
    ,_spectrum: null
    ,_needsRefresh: 0
    ,_restorable: true
    ,_grayscale: false
    
    ,dispose: function( ) {
        var self = this;
        self.width = null;
        self.height = null;
        self.selection = null;
        self.ictx = null;
        self.octx = null;
        self.iData = null;
        self.iDataSel = null;
        self.oData = null;
        self.oDataSel = null;
        self.iCanvas = null;
        self.oCanvas = null;
        self.tmpCanvas = null;
        self.domElement = null;
        self.webgl = null;
        self._histogram = null;
        self._integral = null;
        self._spectrum = null;
        self._needsRefresh = null;
        self._restorable = null;
        self._grayscale = null;
        return self;
    }
    
    ,clone: function( original ) {
        return new FilterImage(true === original ? this.iCanvas : this.oCanvas);
    }
    
    ,grayscale: function( bool ) {
        var self = this;
        if ( !arguments.length )  return self._grayscale;
        self._grayscale = !!bool;
        return self;
    }
    
    ,restorable: function( enabled ) {
        var self = this;
        if ( !arguments.length ) enabled = true;
        self._restorable = !!enabled;
        return self;
    }
    
    // apply a filter (uses filter's own apply method)
    ,apply: function( filter, cb ) {
        filter.apply( this, this, cb || null );
        return this;
    }
    
    // apply2 a filter using another image as destination
    ,apply2: function( filter, destImg, cb ) {
        filter.apply( this, destImg, cb || null );
        return this;
    }
    
    ,select: function( x1, y1, x2, y2 ) {
        var self = this, argslen = arguments.length;
        // default
        if ( argslen < 1 ) x1 = 0;
        if ( argslen < 2 ) y1 = 0;
        if ( argslen < 3 ) x2 = 1;
        if ( argslen < 4 ) y2 = 1;
        // select
        self.selection = [ 
            // clamp
            0 > x1 ? 0 : (1 < x1 ? 1 : x1),
            0 > y1 ? 0 : (1 < y1 ? 1 : y1),
            0 > x2 ? 0 : (1 < x2 ? 1 : x2),
            0 > y2 ? 0 : (1 < y2 ? 1 : y2)
        ];
        self._needsRefresh |= SEL;
        return self;
    }
    
    ,deselect: function( ) {
        var self = this;
        self.selection = null;
        self.iDataSel = null;
        self.oDataSel = null;
        self._needsRefresh &= CLEAR_SEL;
        return self;
    }
    
    // store the processed/filtered image as the original image
    // make the processed image the original image
    ,store: function( ) {
        var self = this;
        if ( self._restorable )
        {
            self.ictx.drawImage(self.oCanvas, 0, 0); 
            self._needsRefresh |= IDATA;
            if (self.selection) self._needsRefresh |= ISEL;
        }
        return self;
    }
    
    // restore the original image
    // remove any filters applied to original image
    ,restore: function( ) {
        var self = this;
        if ( self._restorable )
        {
            self.octx.drawImage(self.iCanvas, 0, 0); 
            self._needsRefresh |= ODATA | HIST | SAT | SPECTRUM;
            if (self.selection) self._needsRefresh |= OSEL;
        }
        return self;
    }
    
    ,dimensions: function( w, h ) {
        var self = this;
        _setDimensions(self, w, h, WIDTH_AND_HEIGHT);
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,scale: function( sx, sy ) {
        var self = this;
        sx = sx||1; sy = sy||sx;
        if ( 1==sx && 1==sy ) return self;
        
        // lazy
        self.tmpCanvas = self.tmpCanvas || _getTmpCanvas( self );
        var ctx = self.tmpCanvas.getContext('2d'),
            w = self.width, h = self.height;
        
        //ctx.save();
        ctx.scale(sx, sy);
        w = self.width = ~~(sx*w+0.5);
        h = self.height = ~~(sy*h+0.5);
        
        ctx.drawImage(self.oCanvas, 0, 0);
        self.oCanvas.style.width = w + 'px';
        self.oCanvas.style.height = h + 'px';
        self.oCanvas.width = w * devicePixelRatio;
        self.oCanvas.height = h * devicePixelRatio;
        self.octx.drawImage(self.tmpCanvas, 0, 0);
        
        if ( self._restorable )
        {
        ctx.drawImage(self.iCanvas, 0, 0);
        self.iCanvas.style.width = self.oCanvas.style.width;
        self.iCanvas.style.height = self.oCanvas.style.height;
        self.iCanvas.width = self.oCanvas.width;
        self.iCanvas.height = self.oCanvas.height;
        self.ictx.drawImage(self.tmpCanvas, 0, 0);
        }
        
        self.tmpCanvas.width = self.oCanvas.width;
        self.tmpCanvas.height = self.oCanvas.height;
        //ctx.restore();
        
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,flipHorizontal: function( ) {
        var self = this;
        // lazy
        self.tmpCanvas = self.tmpCanvas || _getTmpCanvas( self );
        var ctx = self.tmpCanvas.getContext('2d');
        
        ctx.translate(self.width, 0); 
        ctx.scale(-1, 1);
        
        ctx.drawImage(self.oCanvas, 0, 0);
        self.octx.drawImage(self.tmpCanvas, 0, 0);
        
        if ( self._restorable )
        {
        ctx.drawImage(self.iCanvas, 0, 0);
        self.ictx.drawImage(self.tmpCanvas, 0, 0);
        }
        
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,flipVertical: function( ) {
        var self = this;
        // lazy
        self.tmpCanvas = self.tmpCanvas || _getTmpCanvas( self );
        var ctx = self.tmpCanvas.getContext('2d');
        
        ctx.translate(0, self.height); 
        ctx.scale(1, -1);
        
        ctx.drawImage(self.oCanvas, 0, 0);
        self.octx.drawImage(self.tmpCanvas, 0, 0);
        
        if ( self._restorable )
        {
        ctx.drawImage(self.iCanvas, 0, 0);
        self.ictx.drawImage(self.tmpCanvas, 0, 0);
        }
        
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    // TODO
    ,draw: function( drawable, x, y, blendMode ) {
        return this;
    }
    
    // clear the image contents
    ,clear: function( ) {
        var self = this, w = self.width, h = self.height;
        if ( w && h )
        {
            if ( self._restorable ) self.ictx.clearRect(0, 0, w, h);
            self.octx.clearRect(0, 0, w, h);
            self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
            if (self.selection) self._needsRefresh |= SEL;
        }
        return self;
    }
    
    // crop image region
    ,crop: function( x1, y1, x2, y2 ) {
        var self = this, sel = self.selection, 
            W = self.width, H = self.height, xs, ys, ws, hs,
            x, y, w, h
        ;
        if ( !arguments.length )
        {
            if (sel)
            {
                xs = Floor(sel[0]*(W-1)); ys = Floor(sel[1]*(H-1));
                ws = Floor(sel[2]*(W-1))-xs+1; hs = Floor(sel[3]*(H-1))-ys+1;
                x = xs; y = ys;
                w = ws; h = hs;
                sel[0] = 0; sel[1] = 0;
                sel[2] = 1; sel[3] = 1;
            }
            else
            {
                return self;
            }
        }
        else
        {
            x = x1; y = y1;
            w = x2-x1+1; h = y2-y1+1;
        }
        
        // lazy
        self.tmpCanvas = self.tmpCanvas || _getTmpCanvas( self );
        var ctx = self.tmpCanvas.getContext('2d');
        
        ctx.drawImage(self.oCanvas, 0, 0, W, H, x, y, w, h);
        self.oCanvas.style.width = w + 'px';
        self.oCanvas.style.height = h + 'px';
        self.oCanvas.width = w * devicePixelRatio;
        self.oCanvas.height = h * devicePixelRatio;
        self.octx.drawImage(self.tmpCanvas, 0, 0);
        
        if ( self._restorable )
        {
        ctx.drawImage(self.iCanvas, 0, 0, W, H, x, y, w, h);
        self.iCanvas.style.width = self.oCanvas.style.width;
        self.iCanvas.style.height = self.oCanvas.style.height;
        self.iCanvas.width = self.oCanvas.width;
        self.iCanvas.height = self.oCanvas.height;
        self.ictx.drawImage(self.tmpCanvas, 0, 0);
        }
        
        self.tmpCanvas.width = self.oCanvas.width;
        self.tmpCanvas.height = self.oCanvas.height;
        
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        if (sel) self._needsRefresh |= SEL;
        return self;
    }
        
    // fill image region with a specific (background) color
    ,fill: function( color, x, y, w, h ) {
        var self = this, sel = self.selection, 
            W = self.width, H = self.height, xs, ys, ws, hs
        ;
        if (sel)
        {
            xs = Floor(sel[0]*(W-1)); ys = Floor(sel[1]*(H-1));
            ws = Floor(sel[2]*(W-1))-xs+1; hs = Floor(sel[3]*(H-1))-ys+1;
        }
        else
        {
            xs = 0; ys = 0;
            ws = W; hs = H;
        }
        if ( undef === x ) x = xs;
        if ( undef === y ) y = ys;
        if ( undef === w ) w = ws;
        if ( undef === h ) h = hs;
        
        // create the image data if needed
        if (w && !W && h && !H) self.createImageData(w, h);
        
        var ictx = self.ictx, octx = self.octx;
        color = color||0; 
        /*x = x||0; y = y||0; 
        w = w||W; h = h||H;*/
        
        if ( self._restorable )
        {
        ictx.fillStyle = color;  
        ictx.fillRect(x, y, w, h);
        }
        
        octx.fillStyle = color;  
        octx.fillRect(x, y, w, h);
        
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        if (sel) self._needsRefresh |= SEL;
        return self;
    }
    
    // get direct data array
    ,getData: function( ) {
        var self = this, Data;
        if ( self._restorable )
        {
        if (self._needsRefresh & IDATA) _refreshData( self, IDATA );
        Data = self.iData;
        }
        else
        {
        if (self._needsRefresh & ODATA) _refreshData( self, ODATA );
        Data = self.oData;
        }
        // clone it
        return new IMGcpy( Data.data );
    }
    
    // get direct data array of selected part
    ,getSelectedData: function( ) {
        var self = this, sel;
        
        if (self.selection)  
        {
            if ( self._restorable )
            {
            if (self._needsRefresh & ISEL) _refreshSelectedData( self, ISEL );
            sel = self.iDataSel;
            }
            else
            {
            if (self._needsRefresh & OSEL) _refreshSelectedData( self, OSEL );
            sel = self.oDataSel;
            }
        }
        else
        {
            if ( self._restorable )
            {
            if (self._needsRefresh & IDATA) _refreshData( self, IDATA );
            sel = self.iData;
            }
            else
            {
            if (self._needsRefresh & ODATA) _refreshData( self, ODATA );
            sel = self.oData;
            }
        }
        // clone it
        return [new IMGcpy( sel.data ), sel.width, sel.height];
    }
    
    // get processed data array
    ,getProcessedData: function( ) {
        var self = this;
        if (self._needsRefresh & ODATA) _refreshData( self, ODATA );
        // clone it
        return new IMGcpy( self.oData.data );
    }
    
    // get processed data array of selected part
    ,getProcessedSelectedData: function( ) {
        var self = this, sel;
        
        if (self.selection)  
        {
            if (self._needsRefresh & OSEL) _refreshSelectedData( self, OSEL );
            sel = self.oDataSel;
        }
        else
        {
            if (self._needsRefresh & ODATA) _refreshData( self, ODATA );
            sel = self.oData;
        }
        // clone it
        return [new IMGcpy( sel.data ), sel.width, sel.height];
    }
    
    // set direct data array
    ,setData: function(a) {
        var self = this;
        if (self._needsRefresh & ODATA) _refreshData( self, ODATA );
        self.oData.data.set( a ); // not supported in Opera, IE, Safari
        self.octx.putImageData(self.oData, 0, 0); 
        self._needsRefresh |= HIST | SAT | SPECTRUM;
        if (self.selection) self._needsRefresh |= OSEL;
        return self;
    }
    
    // set direct data array of selected part
    ,setSelectedData: function(a) {
        var self = this;
        if (self.selection)
        {
            var sel = self.selection, ow = self.width-1, oh = self.height-1,
                xs = Floor(sel[0]*ow), ys = Floor(sel[1]*oh);
            if (self._needsRefresh & OSEL) _refreshSelectedData( self, OSEL );
            self.oDataSel.data.set(a); // not supported in Opera, IE, Safari
            self.octx.putImageData(self.oDataSel, xs, ys); 
            self._needsRefresh |= ODATA;
        }
        else
        {
            if (self._needsRefresh & ODATA) _refreshData( self, ODATA );
            self.oData.data.set( a ); // not supported in Opera, IE, Safari
            self.octx.putImageData(self.oData, 0, 0); 
        }
        self._needsRefresh |= HIST | SAT | SPECTRUM;
        return self;
    }
    
    ,createImageData: function( w, h ) {
        var self = this, ictx, octx;
        _setDimensions(self, w, h, WIDTH_AND_HEIGHT);
        if ( self._restorable ) 
        {
        ictx = self.ictx = self.iCanvas.getContext('2d');
        ictx.createImageData(w, h);
        }
        octx = self.octx = self.oCanvas.getContext('2d');
        octx.createImageData(w, h);
        self._needsRefresh |= DATA;
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,image: function( img ) {
        if ( !img ) return this;
        
        var self = this, ictx, octx, w, h, 
            isFilterImage, isVideo, isCanvas, isImage//, isImageData
        ;
        
        isFilterImage = img instanceof FilterImage;
        if ( isFilterImage ) img = img.oCanvas;
        isVideo = img instanceof HTMLVideoElement;
        isCanvas = img instanceof HTMLCanvasElement;
        isImage = img instanceof Image;
        //isImageData = img instanceof Object || "object" === typeof img;
        
        if ( isVideo )
        {
            w = img.videoWidth;
            h = img.videoHeight;
        }
        else
        {
            w = img.width;
            h = img.height;
        }
        
        if ( isImage || isCanvas || isVideo ) 
        {
            _setDimensions(self, w, h, WIDTH_AND_HEIGHT);
            if ( self._restorable ) 
            {
            ictx = self.ictx = self.iCanvas.getContext('2d');
            ictx.drawImage(img, 0, 0);
            }
            octx = self.octx = self.oCanvas.getContext('2d');
            octx.drawImage(img, 0, 0);
            self._needsRefresh |= DATA;
        }
        else
        {
            if ( !self.oData ) 
            {
                self.createImageData(w, h);
                _refreshData(self, DATA);
            }
            
            if ( self._restorable )
            {
            ictx = self.ictx = self.iCanvas.getContext('2d');
            self.iData.data.set(img.data); // not supported in Opera, IE, Safari
            ictx.putImageData(self.iData, 0, 0); 
            }
            
            octx = self.octx = self.oCanvas.getContext('2d');
            self.oData.data.set(img.data); // not supported in Opera, IE, Safari
            octx.putImageData(self.oData, 0, 0); 
            //self._needsRefresh &= CLEAR_DATA;
        }
        //self.webgl = FILTER.useWebGL ? new FILTER.WebGL(self.domElement) : null;
        self._needsRefresh |= HIST | SAT | SPECTRUM;
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,getPixel: function( x, y ) {
        var self = this;
        if (self._needsRefresh & ODATA) _refreshData( self, ODATA );
        var off = (~~(y*self.width+x+0.5))<<2, im = self.oData.data;
        return {
            r: im[off], 
            g: im[off+1], 
            b: im[off+2], 
            a: im[off+3]
        };
    }
    
    ,setPixel: function( x, y, r, g, b, a ) {
        var self = this;
        self.octx.putImageData(new IMG([r&255, g&255, b&255, a&255]), x, y); 
        self._needsRefresh |= ODATA | HIST | SAT | SPECTRUM;
        if (self.selection) self._needsRefresh |= OSEL;
        return self;
    }
    
    // get the imageData object
    ,getPixelData: function( ) {
        if (this._needsRefresh & ODATA) _refreshData( this, ODATA );
        return this.oData;
    }
    
    // set the imageData object
    ,setPixelData: function( data ) {
        var self = this;
        self.octx.putImageData(data, 0, 0); 
        self._needsRefresh |= ODATA | HIST | SAT | SPECTRUM;
        if (self.selection) self._needsRefresh |= OSEL;
        return self;
    }
    
    ,integral: function( ) {
        var self = this;
        if (self._needsRefresh & SAT) 
        {
            self._integral = FilterImage.integral(self.getPixelData().data, self.width, self.height, self._grayscale);
            self._needsRefresh &= CLEAR_SAT;
        }
        return self._integral;
    }
    
    ,histogram: function( ) {
        var self = this;
        if (self._needsRefresh & HIST) 
        {
            self._histogram = FilterImage.histogram(self.getPixelData().data, self.width, self.height, self._grayscale);
            self._needsRefresh &= CLEAR_HIST;
        }
        return self._histogram;
    }
    
    // TODO
    ,spectrum: function( ) {
        var self = this;
        /*
        if (self._needsRefresh & SPECTRUM) 
        {
            self._spectrum = FilterImage.spectrum(self.getPixelData().data, self.width, self.height, self._grayscale);
            self._needsRefresh &= CLEAR_SPECTRUM;
        }
        */
        return self._spectrum;
    }
    
    ,toImage: function( format ) {
        var canvas = this.oCanvas, uri, quality = 1.0;
        if ( format & FORMAT.JPG )
        {
            uri = canvas.toDataURL( MIME.JPG, quality );
        }
        else if ( format & FORMAT.GIF )
        {
            uri = canvas.toDataURL( MIME.GIF, quality );
        }
        else/* if( format & FORMAT.PNG )*/
        {
            uri = canvas.toDataURL( MIME.PNG, quality );
        }
        if ( format & FORMAT.IMAGE )
        {
            var img = new Image( );
            img.src = uri;
            return img;
        }
        return uri;
    }
    
    ,toString: function( ) {
        return "[" + "FILTER Image: " + this.name + "]";
    }
});
//
// aliases
FilterImage[PROTO].setImage = FilterImage[PROTO].image;
FilterImage[PROTO].setDimensions = FilterImage[PROTO].dimensions;

// static
// resize/scale/interpolate image data
FilterImage.scale = FilterImage.resize = FILTER.Interpolate.bilinear;

// crop image data
FilterImage.crop = FILTER.Interpolate.crop;

// pad image data
FilterImage.pad = FILTER.Interpolate.pad;

// compute integral image (summed area table, SAT)
FilterImage.integral = FILTER.Compute.integral;

// compute image histogram
FilterImage.histogram = FILTER.Compute.histogram;

// compute image spectrum
FilterImage.spectrum = FILTER.Compute.spectrum;

//
// Scaled Image (Proxy) Class
var FilterScaledImage = FILTER.ScaledImage = FILTER.Class( FilterImage, {
    name: "ScaledImage"
    
    ,constructor: function FilterScaledImage( scalex, scaley, img ) {
        var self = this;
        // factory-constructor pattern
        if ( !(self instanceof FilterScaledImage) ) return new FilterScaledImage(scalex, scaley, img);
        self.scaleX = scalex || 1;
        self.scaleY = scaley || self.scaleX;
        self.$super('constructor', img);
    }
    
    ,scaleX: 1
    ,scaleY: 1
    
    ,dispose: function( ) {
        var self = this;
        self.scaleX = null;
        self.scaleY = null;
        self.$super('dispose');
        return self;
    }
    
    ,clone: function( original ) {
        var self = this;
        return new FilterScaledImage(self.scaleX, self.scaleY, true === original ? self.iCanvas : self.oCanvas);
    }
    
    ,setScale: function( sx, sy ) {
        var self = this, argslen = arguments.length;
        if (argslen > 0 && null != sx) 
        {
            self.scaleX = sx;
            self.scaleY = sx;
        }
        if (argslen > 1 && null != sy) 
            self.scaleY = sy;
        return self;
    }
    
    ,image: function( img ) {
        if ( !img ) return this;
        
        var self = this, ictx, octx, w, h, 
            sw, sh, sx = self.scaleX, sy = self.scaleY,
            isFilterImage, isVideo, isCanvas, isImage//, isImageData
        ;
        
        isFilterImage = img instanceof FilterImage;
        if ( isFilterImage ) img = img.oCanvas;
        isVideo = img instanceof HTMLVideoElement;
        isCanvas = img instanceof HTMLCanvasElement;
        isImage = img instanceof Image;
        //isImageData = img instanceof Object || "object" === typeof img;
        
        if ( isVideo )
        {
            w = img.videoWidth;
            h = img.videoHeight;
        }
        else
        {
            w = img.width;
            h = img.height;
        }
        
        if ( isImage || isCanvas || isVideo ) 
        {
            sw = ~~(sx*w + 0.5);
            sh = ~~(sy*h + 0.5);
            _setDimensions(self, sw, sh, WIDTH_AND_HEIGHT);
            if ( self._restorable ) 
            {
            ictx = self.ictx = self.iCanvas.getContext('2d');
            ictx.drawImage(img, 0, 0, w, h, 0, 0, sw, sh);
            }
            octx = self.octx = self.oCanvas.getContext('2d');
            octx.drawImage(img, 0, 0, w, h, 0, 0, sw, sh);
            self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
            if (self.selection) self._needsRefresh |= SEL;
        }
        //self.webgl = FILTER.useWebGL ? new FILTER.WebGL(self.domElement) : null;
        return self;
    }
});
// aliases
FilterScaledImage[PROTO].setImage = FilterScaledImage[PROTO].image;

}(FILTER);/**
*
* Filter Loader Class(es)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var FilterImage = FILTER.Image, Class = FILTER.Class, ON = 'addEventListener';

var Loader = FILTER.Loader = Class({
    name: "Loader",
    
    __static__: {
        // accessible as "$class.load" (extendable and with "late static binding")
        load: FILTER.Method(function($super, $private, $class){
              // $super is the direct reference to the superclass itself (NOT the prototype)
              // $private is the direct reference to the private methods of this class (if any)
              // $class is the direct reference to this class itself (NOT the prototype)
              return function( url, onLoad, onProgress, onError ) {
                return new $class().load(url, onLoad, onProgress, onError);
            }
        }, FILTER.LATE|FILTER.STATIC )
    },
    
    constructor: function Loader() {
        if ( !(this instanceof Loader) )
            return new Loader();
    },
    
    dispose: function( ) {
        // override
        return this;
    },
    
    // override in sub-classes
    load: function( url, onLoad, onProgress, onError ){
        return null;
    },

    _crossOrigin: null,
    _responseType: null,
    
    responseType: function ( value ) {
        if ( arguments.length )
        {
            this._responseType = value;
            return this;
        }
        return this._responseType;
    },

    crossOrigin: function ( value ) {
        if ( arguments.length )
        {
            this._crossOrigin = value;
            return this;
        }
        return this._crossOrigin;
    }
});

var XHRLoader = FILTER.XHRLoader = Class(Loader, {
    name: "XHRLoader",
    
    constructor: function XHRLoader() {
        if ( !(this instanceof XHRLoader) )
            return new XHRLoader();
    },
    
    load: function ( url, onLoad, onProgress, onError ) {
        var scope = this, request = new XMLHttpRequest( );
        request.open( 'GET', url, true );
        request[ON]('load', function ( event ) {
            if ( onLoad ) onLoad( this.response );
        }, false);
        if ( 'function' === typeof onProgress ) request[ON]('progress', onProgress, false);
        if ( 'function' === typeof onError ) request[ON]('error', onError, false);
        if ( scope._crossOrigin ) request.crossOrigin = scope._crossOrigin;
        if ( scope._responseType ) request.responseType = scope._responseType;
        request.send( null );
        return scope;
    }
});

FILTER.BinaryLoader = Class(Loader, {
    name: "BinaryLoader",
    
    constructor: function BinaryLoader() {
        if ( !(this instanceof BinaryLoader) )
            return new BinaryLoader();
    },
    
    _parser: null,
    
    load: function( url, onLoad, onProgress, onError ){
        var loader = this, xhrloader, 
            image = new FilterImage( )
        ;
        
        if ( 'function' === typeof loader._parser )
        {
            xhrloader = new XHRLoader( )
                .responseType( loader._responseType || 'arraybuffer' )
                .load( url, function( buffer ) {
                    var imData = loader._parser( buffer );
                    if ( !imData ) return;
                    image.image(imData);
                    if ( 'function' === typeof onLoad ) onLoad(image, imData);
                }, onProgress, onError )
            ;
        }
        return image;
    }

});    
}(FILTER);/**
*
* Filter (HTML)ImageLoader Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var FilterImage = FILTER.Image/*, ON = 'addEventListener'*/;

FILTER.HTMLImageLoader = FILTER.Class(FILTER.Loader, {
    name: "HTMLImageLoader",
    
    constructor: function HTMLImageLoader() {
        if ( !(this instanceof HTMLImageLoader) )
            return new HTMLImageLoader();
        this.$super('constructor');
    },
    
    load: function( url, onLoad, onProgress, onError ){
        var scope = this, loader, 
            image = new FilterImage( )
        ;
        
        loader = new Image( );
        
        loader.onload = function( event ){
            image.setImage( loader );
            if ( 'function' === typeof onLoad ) onLoad(image, loader);
        };
        loader.onerror = function( event ){
            if ( 'function' === typeof onError ) onError(image, loader);
        };
        
        if ( scope._crossOrigin ) loader.crossOrigin = scope._crossOrigin;
        else  loader.crossOrigin = "";
        
        loader.src = url;
        
        return image;
    }
});
}(FILTER);/**
*
* CompositeFilter Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var OP = Object.prototype, FP = Function.prototype, AP = Array.prototype
    ,slice = AP.slice, splice = AP.splice, concat = AP.concat
;

//
//
// Composite Filter Stack  (a variation of Composite Design Pattern)
var CompositeFilter = FILTER.CompositeFilter = FILTER.Class( FILTER.Filter, {
    name: "CompositeFilter"
    
    ,constructor: function( filters ) { 
        var self = this;
        self.$super('constructor');
        self._stack = ( filters && filters.length ) ? filters.slice( ) : [ ];
    }
    
    ,_stack: null
    ,_meta: null
    ,_stable: true
    
    ,dispose: function( withFilters ) {
        var self = this, i, stack = self._stack;
        
        self.$super('dispose');
        
        if ( true === withFilters )
        {
            for (i=0; i<stack.length; i++)
            {
                stack[ i ] && stack[ i ].dispose( withFilters );
                stack[ i ] = null;
            }
        }
        self._stack = null;
        self._meta = null;
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, json = { filter: self.name, _isOn: !!self._isOn, _stable: !!self._stable, filters: [ ] }, i, stack = self._stack;
        for (i=0; i<stack.length; i++)
        {
            json.filters.push( stack[ i ].serialize( ) );
        }
        return json;
    }
    
    ,unserialize: function( json ) {
        var self = this, i, l, ls, filters, filter, stack = self._stack;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            self._stable = !!json._stable;
            
            filters = json.filters || [ ];
            l = filters.length;
            ls = stack.length;
            if ( l !== ls || !self._stable )
            {
                // dispose any prev filters
                for (i=0; i<ls; i++)
                {
                    stack[ i ] && stack[ i ].dispose( true );
                    stack[ i ] = null;
                }
                stack = [ ];
                
                for (i=0; i<l; i++)
                {
                    filter = (filters[ i ] && filters[ i ].filter) ? FILTER[ filters[ i ].filter ] : null;
                    if ( filter )
                    {
                        stack.push( new filter( ).unserialize( filters[ i ] ) );
                    }
                    else
                    {
                        throw new Error('Filter "' + filters[ i ].filter + '" could not be created');
                        return;
                    }
                }
            }
            else
            {
                for (i=0; i<l; i++)
                {
                    stack[ i ] = stack[ i ].unserialize( filters[ i ] );
                }
            }
            
            self._stack = stack;
        }
        return self;
    }
    
    ,getMeta: function( ) {
        return this._meta;
    }
    
    ,setMeta: function( meta ) {
        var self = this, stack = self._stack, i, l;
        if ( meta && (l=meta.length) && stack.length )
        {
            for (i=0; i<l; i++) stack[meta[i][0]].setMeta(meta[i][1]);
        }
        return self;
    }
    
    ,stable: function( bool ) {
        if ( !arguments.length ) bool = true;
        this._stable = !!bool;
        return this;
    }
    
    // manipulate the filter chain, methods
    ,filters: function( f ) {
        if ( arguments.length )
        {
            this._stack = f.slice( );
            return this;
        }
        return this._stack.slice( );
    }
    
    ,push: function(/* variable args here.. */) {
        var args = slice.call(arguments), argslen = args.length;
        if ( argslen )
        {
            this._stack = concat.apply( this._stack, args );
        }
        return this;
    }
    
    ,pop: function( ) {
        return this._stack.pop( );
    }
    
    ,shift: function( ) {
        return this._stack.shift( );
    }
    
    ,unshift: function(/* variable args here.. */) {
        var args = slice.call(arguments), argslen = args.length;
        if ( argslen )
        {
            splice.apply( this._stack, [0, 0].concat( args ) );
        }
        return this;
    }
    
    ,getAt: function( i ) {
        return ( this._stack.length > i ) ? this._stack[ i ] : null;
    }
    
    ,setAt: function( i, filter ) {
        if ( this._stack.length > i ) this._stack[ i ] = filter;
        else this._stack.push( filter );
        return this;
    }
    
    ,insertAt: function( i /*, filter1, filter2, filter3..*/) {
        var args = slice.call(arguments), arglen = args.length;
        if ( argslen > 1 )
        {
            args.shift( );
            splice.apply( this._stack, [i, 0].concat( args ) );
        }
        return this;
    }
    
    ,removeAt: function( i ) {
        return this._stack.splice( i, 1 );
    }
    
    ,remove: function( filter ) {
        var i = this._stack.length;
        while ( --i >= 0 ) 
        { 
            if ( filter === this._stack[i] ) 
                this._stack.splice( i, 1 ); 
        }
        return this;
    }
    
    ,reset: function( ) {
        this._stack.length = 0;  
        return this;
    }
    
    // used for internal purposes
    ,_apply: function( im, w, h, image ) {
        var self = this;
        self.hasMeta = false; self._meta = [];
        if ( self._isOn && self._stack.length )
        {
            var _filterstack = self._stack, _stacklength = _filterstack.length, 
                fi, filter;
                
            for ( fi=0; fi<_stacklength; fi++ )
            {
                filter = _filterstack[fi]; 
                if ( filter && filter._isOn ) 
                {
                    im = filter._apply(im, w, h, image);
                    if ( filter.hasMeta ) self._meta.push([fi, filter.getMeta()]);
                }
            }
        }
        self.hasMeta = self._meta.length > 0;
        return im;
    }
        
    ,canRun: function( ) {
        return this._isOn && this._stack.length;
    }
    
    ,toString: function( ) {
        var tab = arguments.length && arguments[0].substr ? arguments[0] : "  ",
            tab_tab = tab + tab, s = this._stack,
            out = [], i, l = s.length
        ;
        for (i=0; i<l; i++) out.push(s[i].toString(tab_tab));
        return [
             "[FILTER: " + this.name + "]"
             ,"["
             ,"  " + out.join("\n  ")
             ,"]"
             ,""
         ].join("\n");
    }
});
// aliases
CompositeFilter.prototype.empty = CompositeFilter.prototype.reset;
CompositeFilter.prototype.concat = CompositeFilter.prototype.push;

}(FILTER);/**
*
* Custom Filter(s)
*
* Allows to create an filter on-the-fly using an inline function
*
* @param handler Optional (the filter apply routine)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

//
//
//  Custom Filter 
//  used as a placeholder for constructing filters inline with an anonymous function
var CustomFilter = FILTER.CustomFilter = FILTER.Class( FILTER.Filter, {
    name: "CustomFilter"
    
    ,constructor: function( handler ) {
        var self = this;
        self.$super('constructor');
        // using bind makes the code become [native code] and thus unserializable
        self._handler = handler && 'function' === typeof(handler) ? handler : null;
    }
    
    ,_handler: null
    
    ,dispose: function( ) {
        var self = this;
        self.$super('dispose');
        self._handler = null;
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _handler: self._handler ? self._handler.toString( ) : null
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._handler = null;
            if ( params._handler )
            {
                // using bind makes the code become [native code] and thus unserializable
                self._handler = new Function( "", '"use strict"; return ' + params._handler + ';')( );
            }
        }
        return self;
    }
    
    ,_apply: function( im, w, h, image ) {
        var self = this;
        if ( !self._isOn || !self._handler ) return im;
        return self._handler( self, im, w, h, image );
    }
        
    ,canRun: function( ) {
        return this._isOn && this._handler;
    }
});

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
!function(FILTER, undef){
"use strict";

var Sin=Math.sin, Cos=Math.cos,
    // Color Matrix
    CM=FILTER.Array32F,
    toRad=FILTER.CONSTANTS.toRad, toDeg=FILTER.CONSTANTS.toDeg,
    notSupportClamp=FILTER._notSupportClamp
;

//
//
// ColorMatrixFilter
var ColorMatrixFilter = FILTER.ColorMatrixFilter = FILTER.Class( FILTER.Filter, {
    name: "ColorMatrixFilter"
    
    ,constructor: function( matrix ) {
        var self = this;
        self.$super('constructor');
        if ( matrix && matrix.length )
        {
            self._matrix = new CM(matrix);
        }    
        else
        {
            // identity matrix
            self._matrix = null;
        }
        
        if ( FILTER.useWebGL )
        {
            self._webglInstance = FILTER.WebGLColorMatrixFilterInstance || null;
        }
    }
    
    ,_matrix: null
    ,_webglInstance: null
    
    ,dispose: function( ) {
        var self = this;
        
        self.$super('dispose');
        
        self._webglInstance = null;
        self._matrix = null;
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _matrix: self._matrix
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._matrix = params._matrix;
        }
        return self;
    }
    
    // get the image color channel as a new image
    ,channel: function( ch, asGray ) {
        asGray = ( asGray === undef ) ? false : asGray;
        var f = ( asGray ) ? 1 : 0;
        switch(ch)
        {
            case FILTER.CHANNEL.ALPHA:
                return this.concat([
                            0, 0, 0, 1, 0, 
                            0, 0, 0, 1, 0, 
                            0, 0, 0, 1, 0, 
                            0, 0, 0, 0, 255
                        ]);
                break;
            
            case FILTER.CHANNEL.BLUE:
                return this.set([
                            0, 0, f, 0, 0, 
                            0, 0, f, 0, 0, 
                            0, 0, 1, 0, 0, 
                            0, 0, 0, 0, 255
                        ]);
                break;
            
            case FILTER.CHANNEL.GREEN:
                return this.set([
                            0, f, 0, 0, 0, 
                            0, 1, 0, 0, 0, 
                            0, f, 0, 0, 0, 
                            0, 0, 0, 0, 255
                        ]);
                break;
            
            case FILTER.CHANNEL.RED:
            default:
                return this.set([
                            1, 0, 0, 0, 0, 
                            f, 0, 0, 0, 0, 
                            f, 0, 0, 0, 0, 
                            0, 0, 0, 0, 255
                        ]);
                break;
        }
    }
    
    // aliases
    // get the image red channel as a new image
    ,redChannel: function( asGray ) {
        return this.channel(FILTER.CHANNEL.RED, asGray);
    }
    
    // get the image green channel as a new image
    ,greenChannel: function( asGray ) {
        return this.channel(FILTER.CHANNEL.GREEN, asGray);
    }
    
    // get the image blue channel as a new image
    ,blueChannel: function( asGray ) {
        return this.channel(FILTER.CHANNEL.BLUE, asGray);
    }
    
    // get the image alpha channel as a new image
    ,alphaChannel: function( asGray ) {
        return this.channel(FILTER.CHANNEL.ALPHA, true);
    }
    
    ,maskChannel: function( ch ) {
        switch( ch )
        {
            case FILTER.CHANNEL.ALPHA:
                return this;
                break;
            
            case FILTER.CHANNEL.BLUE:
                return this.set([
                            1, 0, 0, 0, 0, 
                            0, 1, 0, 0, 0, 
                            0, 0, 0, 0, 0, 
                            0, 0, 0, 1, 0
                        ]);
                break;
            
            case FILTER.CHANNEL.GREEN:
                return this.set([
                            1, 0, 0, 0, 0, 
                            0, 0, 0, 0, 0, 
                            0, 0, 1, 0, 0, 
                            0, 0, 0, 1, 0
                        ]);
                break;
            
            case FILTER.CHANNEL.RED:
            default:
                return this.set([
                            0, 0, 0, 0, 0, 
                            0, 1, 0, 0, 0, 
                            0, 0, 1, 0, 0, 
                            0, 0, 0, 1, 0
                        ]);
                break;
        }
    }
    
    ,swapChannels: function( ch1, ch2 ) {
        switch( ch1 )
        {
            case FILTER.CHANNEL.ALPHA:
                switch( ch2 )
                {
                    case FILTER.CHANNEL.ALPHA:
                        return this;
                        break;
                    
                    case FILTER.CHANNEL.BLUE:
                        return this.set([
                                    1, 0, 0, 0, 0, 
                                    0, 1, 0, 0, 0, 
                                    0, 0, 0, 1, 0, 
                                    0, 0, 1, 0, 0
                                ]);
                        break;
                    
                    case FILTER.CHANNEL.GREEN:
                        return this.set([
                                    1, 0, 0, 0, 0, 
                                    0, 0, 0, 1, 0, 
                                    0, 0, 1, 0, 0, 
                                    0, 1, 0, 0, 0
                                ]);
                        break;
                    
                    case FILTER.CHANNEL.RED:
                    default:
                        return this.set([
                                    0, 0, 0, 1, 0, 
                                    0, 1, 0, 0, 0, 
                                    0, 0, 1, 0, 0, 
                                    1, 0, 0, 0, 0
                                ]);
                        break;
                }
                break;
            
            case FILTER.CHANNEL.BLUE:
                switch( ch2 )
                {
                    case FILTER.CHANNEL.ALPHA:
                        return this.set([
                                    1, 0, 0, 0, 0, 
                                    0, 1, 0, 0, 0, 
                                    0, 0, 0, 1, 0, 
                                    0, 0, 1, 0, 0
                                ]);
                        break;
                    
                    case FILTER.CHANNEL.BLUE:
                        return this;
                        break;
                    
                    case FILTER.CHANNEL.GREEN:
                        return this.set([
                                    1, 0, 0, 0, 0, 
                                    0, 0, 1, 0, 0, 
                                    0, 1, 0, 0, 0, 
                                    0, 0, 0, 1, 0
                                ]);
                        break;
                    
                    case FILTER.CHANNEL.RED:
                    default:
                        return this.set([
                                    0, 0, 1, 0, 0, 
                                    0, 1, 0, 0, 0, 
                                    1, 0, 0, 0, 0, 
                                    0, 0, 0, 1, 0
                                ]);
                        break;
                }
                break;
            
            case FILTER.CHANNEL.GREEN:
                switch( ch2 )
                {
                    case FILTER.CHANNEL.ALPHA:
                        return this.set([
                                    1, 0, 0, 0, 0, 
                                    0, 0, 0, 1, 0, 
                                    0, 0, 1, 0, 0, 
                                    0, 1, 0, 0, 0
                                ]);
                        break;
                    
                    case FILTER.CHANNEL.BLUE:
                        return this.set([
                                    1, 0, 0, 0, 0, 
                                    0, 0, 1, 0, 0, 
                                    0, 1, 0, 0, 0, 
                                    0, 0, 0, 1, 0
                                ]);
                        break;
                    
                    case FILTER.CHANNEL.GREEN:
                        return this;
                        break;
                    
                    case FILTER.CHANNEL.RED:
                    default:
                        return this.set([
                                    0, 1, 0, 0, 0, 
                                    1, 0, 0, 0, 0, 
                                    0, 0, 1, 0, 0, 
                                    0, 0, 0, 1, 0
                                ]);
                        break;
                }
                break;
            
            case FILTER.CHANNEL.RED:
            default:
                switch( ch2 )
                {
                    case FILTER.CHANNEL.ALPHA:
                        return this.set([
                                    0, 0, 0, 1, 0, 
                                    0, 1, 0, 0, 0, 
                                    0, 0, 1, 0, 0, 
                                    1, 0, 0, 0, 0
                                ]);
                        break;
                    
                    case FILTER.CHANNEL.BLUE:
                        return this.set([
                                    0, 0, 1, 0, 0, 
                                    0, 1, 0, 0, 0, 
                                    1, 0, 0, 0, 0, 
                                    0, 0, 0, 1, 0
                                ]);
                        break;
                    
                    case FILTER.CHANNEL.GREEN:
                        return this.set([
                                    0, 1, 0, 0, 0, 
                                    1, 0, 0, 0, 0, 
                                    0, 0, 1, 0, 0, 
                                    0, 0, 0, 1, 0
                                ]);
                        break;
                    
                    case FILTER.CHANNEL.RED:
                    default:
                        return this;
                        break;
                }
                break;
        }
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,desaturate: function( ) {
        return this.set([
                    FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
                    FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
                    FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 0, 
                    0, 0, 0, 1, 0
                ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,colorize: function( rgb, amount ) {
        var r, g, b, inv_amount;
        if ( amount === undef ) amount = 1;
        r = (((rgb >> 16) & 255) * 0.0039215686274509803921568627451);  // / 255
        g = (((rgb >> 8) & 255) * 0.0039215686274509803921568627451);  // / 255
        b = ((rgb & 255) * 0.0039215686274509803921568627451);  // / 255
        inv_amount = 1 - amount;

        return this.set([
                    (inv_amount + ((amount * r) * FILTER.LUMA[0])), ((amount * r) * FILTER.LUMA[1]), ((amount * r) * FILTER.LUMA[2]), 0, 0, 
                    ((amount * g) * FILTER.LUMA[0]), (inv_amount + ((amount * g) * FILTER.LUMA[1])), ((amount * g) * FILTER.LUMA[2]), 0, 0, 
                    ((amount * b) * FILTER.LUMA[0]), ((amount * b) * FILTER.LUMA[1]), (inv_amount + ((amount * b) * FILTER.LUMA[2])), 0, 0, 
                        0, 0, 0, 1, 0
                    ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,invert: function( ) {
        return this.set([
                -1, 0,  0, 0, 255,
                0, -1,  0, 0, 255,
                0,  0, -1, 0, 255,
                0,  0,  0, 1,   0
            ]);
    }
    
    ,invertAlpha: function( ) {
        return this.set([
                1,  0,  0, 0, 0,
                0,  1,  0, 0, 0,
                0,  0,  1, 0, 0,
                0,  0,  0, -1, 255
            ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,saturate: function( s ) {
        var sInv, irlum, iglum, iblum;
        sInv = (1 - s);  irlum = (sInv * FILTER.LUMA[0]);
        iglum = (sInv * FILTER.LUMA[1]);  iblum = (sInv * FILTER.LUMA[2]);
        
        return this.set([
                (irlum + s), iglum, iblum, 0, 0, 
                irlum, (iglum + s), iblum, 0, 0, 
                irlum, iglum, (iblum + s), 0, 0, 
                0, 0, 0, 1, 0
            ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,contrast: function( r, g, b ) {
        if ( g === undef )  g = r;
        if ( b === undef )  b = r;
        r += 1.0; g += 1.0; b += 1.0;
        return this.set([
                r, 0, 0, 0, (128 * (1 - r)), 
                0, g, 0, 0, (128 * (1 - g)), 
                0, 0, b, 0, (128 * (1 - b)), 
                0, 0, 0, 1, 0
            ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,brightness: function( r, g, b ) {
        if ( g === undef )  g = r;
        if ( b === undef )  b = r;
        
        return this.set([
                1, 0, 0, 0, r, 
                0, 1, 0, 0, g, 
                0, 0, 1, 0, b, 
                0, 0, 0, 1, 0
            ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,adjustHue: function( degrees ) {
        degrees *= toRad;
        var cos = Cos(degrees), sin = Sin(degrees);
        
        return this.set([
                ((FILTER.LUMA[0] + (cos * (1 - FILTER.LUMA[0]))) + (sin * -(FILTER.LUMA[0]))), ((FILTER.LUMA[1] + (cos * -(FILTER.LUMA[1]))) + (sin * -(FILTER.LUMA[1]))), ((FILTER.LUMA[2] + (cos * -(FILTER.LUMA[2]))) + (sin * (1 - FILTER.LUMA[2]))), 0, 0, 
                ((FILTER.LUMA[0] + (cos * -(FILTER.LUMA[0]))) + (sin * 0.143)), ((FILTER.LUMA[1] + (cos * (1 - FILTER.LUMA[1]))) + (sin * 0.14)), ((FILTER.LUMA[2] + (cos * -(FILTER.LUMA[2]))) + (sin * -0.283)), 0, 0, 
                ((FILTER.LUMA[0] + (cos * -(FILTER.LUMA[0]))) + (sin * -((1 - FILTER.LUMA[0])))), ((FILTER.LUMA[1] + (cos * -(FILTER.LUMA[1]))) + (sin * FILTER.LUMA[1])), ((FILTER.LUMA[2] + (cos * (1 - FILTER.LUMA[2]))) + (sin * FILTER.LUMA[2])), 0, 0, 
                0, 0, 0, 1, 0
            ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,average: function( r, g, b ) {
        if ( r === undef ) r = 0.3333;
        if ( g === undef ) g = 0.3333;
        if ( b === undef ) b = 0.3334;
        
        return this.set([
                r, g, b, 0, 0, 
                r, g, b, 0, 0, 
                r, g, b, 0, 0, 
                0, 0, 0, 1, 0
            ]);
    }
    
    ,quickContrastCorrection: function( contrast ) {
        if ( contrast === undef ) contrast = 1.2;
        
        return this.set([
            contrast, 0, 0, 0, 0, 
            0, contrast, 0, 0, 0, 
            0, 0, contrast, 0, 0, 
            0, 0, 0, 1, 0
            ]);
    }
    
    // adapted from glfx.js
    // Gives the image a reddish-brown monochrome tint that imitates an old photograph.
    // 0 to 1 (0 for no effect, 1 for full sepia coloring)
    ,sepia: function( amount ) {
        if ( amount === undef ) amount = 0.5;
        if ( amount > 1 ) amount = 1;
        else if ( amount < 0 ) amount = 0;
        return this.set([
            1.0 - (0.607 * amount), 0.769 * amount, 0.189 * amount, 0, 0, 
            0.349 * amount, 1.0 - (0.314 * amount), 0.168 * amount, 0, 0, 
            0.272 * amount, 0.534 * amount, 1.0 - (0.869 * amount), 0, 0, 
            0, 0, 0, 1, 0
        ]);
    }
    
    ,sepia2: function( amount ) {
        if ( amount === undef ) amount = 10;
        if ( amount > 100 ) amount = 100;
        amount *= 2.55;
        return this.set([
            FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 40, 
            FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, 20, 
            FILTER.LUMA[0], FILTER.LUMA[1], FILTER.LUMA[2], 0, -amount, 
            0, 0, 0, 1, 0
        ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,threshold: function( threshold, factor ) {
        if ( factor === undef )  factor = 256;
        
        return this.set([
                (FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
                (FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
                (FILTER.LUMA[0] * factor), (FILTER.LUMA[1] * factor), (FILTER.LUMA[2] * factor), 0, (-(factor-1) * threshold), 
                0, 0, 0, 1, 0
            ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,threshold_rgb: function( threshold, factor ) {
        if ( factor === undef )  factor = 256;
        
        return this.set([
                factor, 0, 0, 0, (-(factor-1) * threshold), 
                0, factor, 0, 0, (-(factor-1) * threshold), 
                0,  0, factor, 0, (-(factor-1) * threshold), 
                0, 0, 0, 1, 0
            ]);
    }
    
    ,threshold_alpha: function( threshold, factor ) {
        if ( threshold === undef )  threshold = 0.5;
        if ( factor === undef ) factor = 256;
        
        return this.set([
                1, 0, 0, 0, 0, 
                0, 1, 0, 0, 0, 
                0, 0, 1, 0, 0, 
                0, 0, 0, factor, (-factor * threshold)
            ]);
    }
    
    // RGB to YCbCr
    ,RGB2YCbCr: function( ) {
        return this.set([
                0.5, -0.418688, -0.081312, 0, 128,  // Cr component in RED channel
                0.299, 0.587, 0.114, 0, 0,   // Y component in GREEN channel
                -0.168736, -0.331264, 0.5, 0, 128,  // Cb component in BLUE channel
                0, 0, 0, 1, 0
            ]);
    }
    
    // YCbCr to RGB
    ,YCbCr2RGB: function( ) {
        return this.set([
                1.402, 1, 0, 0, -179.456,  
                -0.71414, 1, -0.34414, 0, 135.45984,
                0, 1, 1.772, 0, -226.816,
                0, 0, 0, 1, 0
            ]);
    }
    
    // blend with another filter
    ,blend: function( filt, amount ) {
        this._matrix = ( this._matrix ) ? CMblend(this._matrix, filt.getMatrix(), amount) : new CM(filt.getMatrix());
        return this;
    }
    
    ,set: function( mat ) {
        this._matrix = ( this._matrix ) ? CMconcat(this._matrix, new CM(mat)) : new CM(mat);
        return this;
    }
    
    ,reset: function( ) {
        this._matrix = null; 
        return this;
    }
    
    ,combineWith: function( filt ) {
        return this.set( filt.getMatrix() );
    }
    
    ,getMatrix: function( ) {
        return this._matrix;
    }
    
    ,setMatrix: function( m ) {
        this._matrix = new CM(m); 
        return this;
    }
    
    // used for internal purposes
    ,_apply: function(p, w, h/*, image*/) {
        var self = this;
        if ( self._isOn && self._matrix )
        {
            var pl = p.length, m = self._matrix,
                i, rem = (pl>>2)%4,
                p0, p1, p2, p3, 
                p4, p5, p6, p7, 
                p8, p9, p10, p11,
                p12, p13, p14, p15,
                t0, t1, t2, t3
            ;
            
            // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
            // linearize array
            // partial loop unrolling (quarter iterations)
            for (i=0; i<pl; i+=16)
            {
                t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = p[i+4]; t1 = p[i+5]; t2 = p[i+6]; t3 = p[i+7];
                p4  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p5  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p6  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p7  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = p[i+8]; t1 = p[i+9]; t2 = p[i+10]; t3 = p[i+11];
                p8  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p9  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p10  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p11  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = p[i+12]; t1 = p[i+13]; t2 = p[i+14]; t3 = p[i+15];
                p12  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p13  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p14  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p15  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                p[i] = ~~p0; p[i+1] = ~~p1; p[i+2] = ~~p2; p[i+3] = ~~p3;
                p[i+4] = ~~p4; p[i+5] = ~~p5; p[i+6] = ~~p6; p[i+7] = ~~p7;
                p[i+8] = ~~p8; p[i+9] = ~~p9; p[i+10] = ~~p10; p[i+11] = ~~p11;
                p[i+12] = ~~p12; p[i+13] = ~~p13; p[i+14] = ~~p14; p[i+15] = ~~p15;
            }
            
            // loop unrolling remainder
            if (rem)
            {
                rem <<= 2;
                for (i=pl-rem; i<pl; i+=4)
                {
                    t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                    p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                    p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                    p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                    p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                    
                    p[i] = ~~p0; p[i+1] = ~~p1; p[i+2] = ~~p2; p[i+3] = ~~p3;
                }
            }
        }
        return p;
    }
        
    ,canRun: function( ) {
        return this._isOn && this._matrix;
    }
});
// aliases
ColorMatrixFilter.prototype.grayscale = ColorMatrixFilter.prototype.desaturate;
ColorMatrixFilter.prototype.rotateHue = ColorMatrixFilter.prototype.adjustHue;
ColorMatrixFilter.prototype.thresholdRgb = ColorMatrixFilter.prototype.threshold_rgb;
ColorMatrixFilter.prototype.thresholdAlpha = ColorMatrixFilter.prototype.threshold_alpha;
if (notSupportClamp)
{   
    ColorMatrixFilter.prototype._apply = function(p, w, h/*, image*/) {
        var self = this;
        if ( self._isOn && self._matrix )
        {
            var pl = p.length, m = self._matrix,
                i, rem = (pl>>2)%4,
                p0, p1, p2, p3, 
                p4, p5, p6, p7, 
                p8, p9, p10, p11,
                p12, p13, p14, p15,
                t0, t1, t2, t3
            ;
            
            // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
            // linearize array
            // partial loop unrolling (quarter iterations)
            for (i=0; i<pl; i+=16)
            {
                t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = p[i+4]; t1 = p[i+5]; t2 = p[i+6]; t3 = p[i+7];
                p4  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p5  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p6  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p7  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = p[i+8]; t1 = p[i+9]; t2 = p[i+10]; t3 = p[i+11];
                p8  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p9  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p10  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p11  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                t0 = p[i+12]; t1 = p[i+13]; t2 = p[i+14]; t3 = p[i+15];
                p12  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                p13  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                p14  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                p15  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                
                // clamp them manually
                p0 = (p0<0) ? 0 : ((p0>255) ? 255 : p0);
                p1 = (p1<0) ? 0 : ((p1>255) ? 255 : p1);
                p2 = (p2<0) ? 0 : ((p2>255) ? 255 : p2);
                p3 = (p3<0) ? 0 : ((p3>255) ? 255 : p3);
                p4 = (p4<0) ? 0 : ((p4>255) ? 255 : p4);
                p5 = (p5<0) ? 0 : ((p5>255) ? 255 : p5);
                p6 = (p6<0) ? 0 : ((p6>255) ? 255 : p6);
                p7 = (p7<0) ? 0 : ((p7>255) ? 255 : p7);
                p8 = (p8<0) ? 0 : ((p8>255) ? 255 : p8);
                p9 = (p9<0) ? 0 : ((p9>255) ? 255 : p9);
                p10 = (p10<0) ? 0 : ((p10>255) ? 255 : p10);
                p11 = (p11<0) ? 0 : ((p11>255) ? 255 : p11);
                p12 = (p12<0) ? 0 : ((p12>255) ? 255 : p12);
                p13 = (p13<0) ? 0 : ((p13>255) ? 255 : p13);
                p14 = (p14<0) ? 0 : ((p14>255) ? 255 : p14);
                p15 = (p15<0) ? 0 : ((p15>255) ? 255 : p15);
                
                p[i] = ~~p0; p[i+1] = ~~p1; p[i+2] = ~~p2; p[i+3] = ~~p3;
                p[i+4] = ~~p4; p[i+5] = ~~p5; p[i+6] = ~~p6; p[i+7] = ~~p7;
                p[i+8] = ~~p8; p[i+9] = ~~p9; p[i+10] = ~~p10; p[i+11] = ~~p11;
                p[i+12] = ~~p12; p[i+13] = ~~p13; p[i+14] = ~~p14; p[i+15] = ~~p15;
            }
            
            // loop unrolling remainder
            if (rem)
            {
                rem <<= 2;
                for (i=pl-rem; i<pl; i+=4)
                {
                    t0 = p[i]; t1 = p[i+1]; t2 = p[i+2]; t3 = p[i+3];
                    p0  =  m[0]*t0  +  m[1]*t1  +  m[2]*t2  +  m[3]*t3  +  m[4];
                    p1  =  m[5]*t0  +  m[6]*t1  +  m[7]*t2  +  m[8]*t3  +  m[9];
                    p2  =  m[10]*t0 +  m[11]*t1 +  m[12]*t2 +  m[13]*t3 +  m[14];
                    p3  =  m[15]*t0 +  m[16]*t1 +  m[17]*t2 +  m[18]*t3 +  m[19];
                    
                    // clamp them manually
                    p0 = (p0<0) ? 0 : ((p0>255) ? 255 : p0);
                    p1 = (p1<0) ? 0 : ((p1>255) ? 255 : p1);
                    p2 = (p2<0) ? 0 : ((p2>255) ? 255 : p2);
                    p3 = (p3<0) ? 0 : ((p3>255) ? 255 : p3);
                    
                    p[i] = ~~p0; p[i+1] = ~~p1; p[i+2] = ~~p2; p[i+3] = ~~p3;
                }
            }
        }
        return p;
    };
}

//
//
// private methods
function eye()
{
    return new CM([
        1,0,0,0,0,
        0,1,0,0,0,
        0,0,1,0,0,
        0,0,0,1,0
    ]);
}
 
 // concatenate 2 Color Matrices (kind of Color Matrix multiplication)
 function CMconcat(tm, mat) 
 {
    var t=new CM(20), m0, m1, m2, m3, m4;
    
    // unroll the loop completely
    // i=0
    m0=mat[0]; m1=mat[1]; m2=mat[2]; m3=mat[3]; m4=mat[4];
    t[ 0 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
    t[ 1 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
    t[ 2 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
    t[ 3 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
    t[ 4 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;

    // i=5
    m0=mat[5]; m1=mat[6]; m2=mat[7]; m3=mat[8]; m4=mat[9];
    t[ 5 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
    t[ 6 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
    t[ 7 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
    t[ 8 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
    t[ 9 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;
    
    // i=10
    m0=mat[10]; m1=mat[11]; m2=mat[12]; m3=mat[13]; m4=mat[14];
    t[ 10 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
    t[ 11 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
    t[ 12 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
    t[ 13 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
    t[ 14 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;
    
    // i=15
    m0=mat[15]; m1=mat[16]; m2=mat[17]; m3=mat[18]; m4=mat[19];
    t[ 15 ] = m0*tm[0] + m1*tm[5] + m2*tm[10] + m3*tm[15];
    t[ 16 ] = m0*tm[1] + m1*tm[6] + m2*tm[11] + m3*tm[16];
    t[ 17 ] = m0*tm[2] + m1*tm[7] + m2*tm[12] + m3*tm[17];
    t[ 18 ] = m0*tm[3] + m1*tm[8] + m2*tm[13] + m3*tm[18];
    t[ 19 ] = m0*tm[4] + m1*tm[9] + m2*tm[14] + m3*tm[19] + m4;
    
    return t;
}

function CMblend(m1, m2, amount)
{
    var inv_amount = (1 - amount), i = 0, m=new CM(20);
    
    // unroll the loop completely
    m[ 0 ] = (inv_amount * m1[0]) + (amount * m2[0]);
    m[ 1 ] = (inv_amount * m1[1]) + (amount * m2[1]);
    m[ 2 ] = (inv_amount * m1[2]) + (amount * m2[2]);
    m[ 3 ] = (inv_amount * m1[3]) + (amount * m2[3]);
    m[ 4 ] = (inv_amount * m1[4]) + (amount * m2[4]);

    m[ 5 ] = (inv_amount * m1[5]) + (amount * m2[5]);
    m[ 6 ] = (inv_amount * m1[6]) + (amount * m2[6]);
    m[ 7 ] = (inv_amount * m1[7]) + (amount * m2[7]);
    m[ 8 ] = (inv_amount * m1[8]) + (amount * m2[8]);
    m[ 9 ] = (inv_amount * m1[9]) + (amount * m2[9]);
    
    m[ 10 ] = (inv_amount * m1[10]) + (amount * m2[10]);
    m[ 11 ] = (inv_amount * m1[11]) + (amount * m2[11]);
    m[ 12 ] = (inv_amount * m1[12]) + (amount * m2[12]);
    m[ 13 ] = (inv_amount * m1[13]) + (amount * m2[13]);
    m[ 14 ] = (inv_amount * m1[14]) + (amount * m2[14]);
    
    m[ 15 ] = (inv_amount * m1[15]) + (amount * m2[15]);
    m[ 16 ] = (inv_amount * m1[16]) + (amount * m2[16]);
    m[ 17 ] = (inv_amount * m1[17]) + (amount * m2[17]);
    m[ 18 ] = (inv_amount * m1[18]) + (amount * m2[18]);
    m[ 19 ] = (inv_amount * m1[19]) + (amount * m2[19]);
    
    //while (i < 20) { m[i] = (inv_amount * m1[i]) + (amount * m2[i]);  i++; };
    
    return m;
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
!function(FILTER, undef){
"use strict";

// color table
var CT=FILTER.ImArrayCopy, clamp = FILTER.Color.clampPixel,

    eye = function(inv) {
        var t=new CT(256), i=0;
        if (inv)  while (i<256) { t[i]=255-i; i++; }
        else   while (i<256) { t[i]=i; i++; }
        return t;
    },

    ones = function(col) {
        var t=new CT(256), i=0;
        while (i<256) { t[i]=col; i++; }
        return t;
    },
    
    clone = function(t) {
        if (t) return new CT(t);
        return null;
    },
    
    Power=Math.pow, Exponential=Math.exp, nF=1/255, trivial=eye(), inverce=eye(1)
;

//
//
// TableLookupFilter
var TableLookupFilter = FILTER.TableLookupFilter = FILTER.Class( FILTER.Filter, {
    name: "TableLookupFilter"
    
    ,constructor: function( tR, tG, tB, tA ) {
        var self = this;
        self.$super('constructor');
        self._tableR = tR || null;
        self._tableG = tG || self._tableR;
        self._tableB = tB || self._tableG;
        self._tableA = tA || null;
    }
    
    // parameters
    ,_tableR: null
    ,_tableG: null
    ,_tableB: null
    ,_tableA: null
    
    ,dispose: function( ) {
        var self = this;
        
        self.$super('dispose');
        
        self._tableR = null;
        self._tableG = null;
        self._tableB = null;
        self._tableA = null;
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _tableR: self._tableR
                ,_tableG: self._tableG
                ,_tableB: self._tableB
                ,_tableA: self._tableA
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._tableR = params._tableR;
            self._tableG = params._tableG;
            self._tableB = params._tableB;
            self._tableA = params._tableA;
        }
        return self;
    }
    
    ,thresholds: function( thresholdsR, thresholdsG, thresholdsB ) {
        // assume thresholds are given in pointwise scheme as pointcuts
        // not in cumulative scheme
        // [ 0.5 ] => [0, 1]
        // [ 0.3, 0.3, 0.3 ] => [0, 0.3, 0.6, 1]
        if (!thresholdsR.length) thresholdsR=[thresholdsR];
        if (!thresholdsG) thresholdsG=thresholdsR;
        if (!thresholdsB) thresholdsB=thresholdsG;

        var tLR=thresholdsR.length, numLevelsR=tLR+1, 
            tLG=thresholdsG.length, numLevelsG=tLG+1, 
            tLB=thresholdsB.length, numLevelsB=tLB+1, 
            tR=new CT(256), qR=new CT(numLevelsR), 
            tG=new CT(256), qG=new CT(numLevelsG), 
            tB=new CT(256), qB=new CT(numLevelsB), 
            i, j, nLR=255/(numLevelsR-1), nLG=255/(numLevelsG-1), nLB=255/(numLevelsB-1)
        ;
        i=0; while (i<numLevelsR) { qR[i] = ~~(nLR * i); i++; }
        thresholdsR[0]=~~(255*thresholdsR[0]);
        i=1; while (i<tLR) { thresholdsR[i]=thresholdsR[i-1] + ~~(255*thresholdsR[i]); i++; }
        i=0; while (i<numLevelsG) { qG[i] = ~~(nLG * i); i++; }
        thresholdsG[0]=~~(255*thresholdsG[0]);
        i=1; while (i<tLG) { thresholdsG[i]=thresholdsG[i-1] + ~~(255*thresholdsG[i]); i++; }
        i=0; while (i<numLevelsB) { qB[i] = ~~(nLB * i); i++; }
        thresholdsB[0]=~~(255*thresholdsB[0]);
        i=1; while (i<tLB) { thresholdsB[i]=thresholdsB[i-1] + ~~(255*thresholdsB[i]); i++; }

        i=0; 
        while (i<256) 
        { 
            // the non-linear mapping is here
            j=0; while (j<tLR && i>thresholdsR[j]) j++;
            tR[ i ] = clamp(qR[ j ]); 
            j=0; while (j<tLG && i>thresholdsG[j]) j++;
            tG[ i ] = clamp(qG[ j ]); 
            j=0; while (j<tLB && i>thresholdsB[j]) j++;
            tB[ i ] = clamp(qB[ j ]); 
            i++; 
        }
        return this.set(tR, tG, tB);
    }
    
    ,threshold: function( thresholdR, thresholdG, thresholdB ) {
        thresholdR=thresholdR || 0.5;
        thresholdG=thresholdG || thresholdR;
        thresholdB=thresholdB || thresholdG;
        return this.thresholds([thresholdR], [thresholdG], [thresholdB]);
    }
    
    ,quantize: function( numLevels ) {
        if ( numLevels === undef ) numLevels=64;
        if (numLevels<2) numLevels=2;

        var t=new CT(256), q=new CT(numLevels), i, nL=255/(numLevels-1), nR=numLevels/256;
        i=0; while (i<numLevels) { q[i] = ~~(nL * i); i++; }
        i=0; while (i<256) { t[i] = clamp(q[ ~~(nR * i) ]); i++; }
        return this.set(t);
    }
    
    ,binarize: function( ) {
        return this.quantize(2);
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,solarize: function( threshold ) {
        if ( threshold === undef ) threshold=0.5;
        
        var i=0, t=new CT(256)
            ,q, c, n=2/255
        ;
        
        i=0; 
        while (i<256) 
        { 
            q = n*i; 
            c = (q>threshold) ? (255-255*q) : (255*q-255); 
            t[i] = ~~(clamp( c ));
            i++; 
        }
        return this.set(t);
    }
    
    ,solarize2: function( threshold ) {
        if ( threshold === undef ) threshold=0.5;
        threshold=1-threshold;
        var i=0, t=new CT(256)
            ,q, c, n=2/255
        ;
        
        i=0; 
        while (i<256) 
        { 
            q = n*i; 
            c = (q<threshold) ? (255-255*q) : (255*q-255); 
            t[i] = ~~(clamp( c ));
            i++; 
        }
        return this.set(t);
    }
    
    ,solarizeInverse: function( threshold ) {
        if ( threshold === undef ) threshold=0.5;
        threshold*=256; 
        
        var i=0, t=new CT(256);
        i=0; 
        while (i<256) 
        { 
            t[i] = (i>threshold) ? 255-i : i; 
            i++; 
        }
        return this.set(t);
    }
    
    ,invert: function( ) {
        return this.set(inverce);
    }
    
    // apply a binary mask to the image color channels
    ,mask: function( mask ) {
        var i=0, maskR=(mask>>16)&255, maskG=(mask>>8)&255, maskB=mask&255;
            tR=new CT(256), tG=new CT(256), tB=new CT(256)
            ;
        i=0; while (i<256) 
        { 
            tR[i]=clamp(i & maskR); 
            tG[i]=clamp(i & maskG); 
            tB[i]=clamp(i & maskB); 
            i++; 
        }
        return this.set(tR, tG, tB);
    }
    
    // replace a color with another
    ,replace: function( color, replacecolor ) {
        if (color==replacecolor) return this;
        var  
            c1R=(color>>16)&255, c1G=(color>>8)&255, c1B=(color)&255, 
            c2R=(replacecolor>>16)&255, c2G=(replacecolor>>8)&255, c2B=(replacecolor)&255, 
            tR=clone(trivial), tG=clone(trivial), tB=clone(trivial)
            ;
            tR[c1R]=c2R; tG[c1G]=c2G; tB[c1B]=c2B;
        return this.set(tR, tG, tB);
    }
    
    // extract a range of color values from a specific color channel and set the rest to background color
    ,extract: function( channel, range, background ) {
        if (!range || !range.length) return this;
        
        background=background||0;
        var  
            bR=(background>>16)&255, bG=(background>>8)&255, bB=(background)&255, 
            tR=ones(bR), tG=ones(bG), tB=ones(bB),
            s, f
            ;
        switch(channel)
        {
            case FILTER.CHANNEL.BLUE: 
                s=range[0]; f=range[1];
                while (s<=f) { tB[s]=clamp(s); s++; }
                break;
            
            case FILTER.CHANNEL.GREEN: 
                s=range[0]; f=range[1];
                while (s<=f) { tG[s]=clamp(s); s++; }
                break;
            
            case FILTER.CHANNEL.RED: 
            default:
                s=range[0]; f=range[1];
                while (s<=f) { tR[s]=clamp(s); s++; }
                break;
            
        }
        return this.set(tR, tG, tB);
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,gammaCorrection: function( gammaR, gammaG, gammaB ) {
        gammaR=gammaR || 1;
        gammaG=gammaG || gammaR;
        gammaB=gammaB || gammaG;
        
        // gamma correction uses inverse gamma
        gammaR=1.0/gammaR; gammaG=1.0/gammaG; gammaB=1.0/gammaB;
        
        var tR=new CT(256), tG=new CT(256), tB=new CT(256), i=0;
        while (i<256) 
        { 
            tR[i]=clamp(~~(255*Power(nF*i, gammaR))); 
            tG[i]=clamp(~~(255*Power(nF*i, gammaG))); 
            tB[i]=clamp(~~(255*Power(nF*i, gammaB)));  
            i++; 
        }
        return this.set(tR, tG, tB);
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,exposure: function( exposure ) {
        if ( exposure === undef ) exposure=1;
        var i=0, t=new CT(256);
        i=0; while (i<256) 
        { 
            t[i]=clamp(~~(255 * (1 - Exponential(-exposure * i *nF)))); 
            i++; 
        }
        return this.set(t);
    }
    
    ,set: function( _tR, _tG, _tB, _tA ) {
        if (!_tR) return this;
        
        _tG=_tG || _tR; _tB=_tB || _tG;
        var 
            tR=this._tableR || eye(), tG, tB, tA,
            tR2=clone(tR), tG2, tB2, tA2,
            i;
        
        if (_tG && _tB)
        {
            tG=this._tableG || clone(tR); tB=this._tableB || clone(tG);
            tG2=clone(tG); tB2=clone(tB);
            // concat/compose the filter's tables, same as composing the filters
            i=0; 
            while (i<256) 
            { 
                tR[i]=clamp( _tR[clamp( tR2[i] )] ); 
                tG[i]=clamp( _tG[clamp( tG2[i] )] ); 
                tB[i]=clamp( _tB[clamp( tB2[i] )] ); 
                i++; 
            }
            this._tableR=tR; this._tableG=tG; this._tableB=tB;
        }
        else
        {
            // concat/compose the filter's tables, same as composing the filters
            i=0; 
            while (i<256) 
            { 
                tR[i]=clamp( _tR[clamp( tR2[i] )] ); 
                i++; 
            }
            this._tableR=tR; this._tableG=this._tableR; this._tableB=this._tableR;
        }
        
        return this;
    }
    
    ,reset: function( ) {
        this._tableR = this._tableG = this._tableB = this._tableA = null; 
        return this;
    }
    
    ,combineWith: function( filt ) {
        return this.set(filt.getTable(0), filt.getTable(1), filt.getTable(2));
    }
    
    ,getTable: function ( channel ) {
        channel = channel || FILTER.CHANNEL.RED;
        switch (channel)
        {
            case FILTER.CHANNEL.ALPHA: return this._tableA;
            case FILTER.CHANNEL.BLUE: return this._tableB;
            case FILTER.CHANNEL.GREEN: return this._tableG;
            case FILTER.CHANNEL.RED: 
            default: return this._tableR;
        }
    }
    
    ,setTable: function ( table, channel ) {
        channel = channel || FILTER.CHANNEL.RED;
        switch (channel)
        {
            case FILTER.CHANNEL.ALPHA: this._tableA=table; return this;
            case FILTER.CHANNEL.BLUE: this._tableB=table; return this;
            case FILTER.CHANNEL.GREEN: this._tableG=table; return this;
            case FILTER.CHANNEL.RED: 
            default: this._tableR=table; return this;
        }
    }
    
    // used for internal purposes
    ,_apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !self._tableR ) return im;
        
        var l=im.length, rem = (l>>2)%4,
            i, r, g, b, a,
            tR=self._tableR, tG=self._tableG, tB=self._tableB, tA=self._tableA;
        
        // apply filter (algorithm implemented directly based on filter definition)
        if ( tA )
        {
            // array linearization
            // partial loop unrolling (quarter iterations)
            for ( i=0; i<l; i+=16 )
            {
                r = im[i]; g = im[i+1]; b = im[i+2]; a = im[i+3];
                im[i] = tR[r]; im[i+1] = tG[g]; im[i+2] = tB[b]; im[i+3] = tA[a];
                r = im[i+4]; g = im[i+5]; b = im[i+6]; a = im[i+7];
                im[i+4] = tR[r]; im[i+5] = tG[g]; im[i+6] = tB[b]; im[i+7] = tA[a];
                r = im[i+8]; g = im[i+9]; b = im[i+10]; a = im[i+11];
                im[i+8] = tR[r]; im[i+9] = tG[g]; im[i+10] = tB[b]; im[i+11] = tA[a];
                r = im[i+12]; g = im[i+13]; b = im[i+14]; a = im[i+15];
                im[i+12] = tR[r]; im[i+13] = tG[g]; im[i+14] = tB[b]; im[i+15] = tA[a];
            }
            
            // loop unrolling remainder
            if ( rem )
            {
                rem <<= 2;
                for (i=l-rem; i<l; i+=4)
                {
                    r = im[i]; g = im[i+1]; b = im[i+2]; a = im[i+3];
                    im[i] = tR[r]; im[i+1] = tG[g]; im[i+2] = tB[b]; im[i+3] = tA[a];
                }
            }
        }
        else
        {
            // array linearization
            // partial loop unrolling (quarter iterations)
            for (i=0; i<l; i+=16)
            {
                r = im[i]; g = im[i+1]; b = im[i+2];
                im[i] = tR[r]; im[i+1] = tG[g]; im[i+2] = tB[b];
                r = im[i+4]; g = im[i+5]; b = im[i+6];
                im[i+4] = tR[r]; im[i+5] = tG[g]; im[i+6] = tB[b];
                r = im[i+8]; g = im[i+9]; b = im[i+10];
                im[i+8] = tR[r]; im[i+9] = tG[g]; im[i+10] = tB[b];
                r = im[i+12]; g = im[i+13]; b = im[i+14];
                im[i+12] = tR[r]; im[i+13] = tG[g]; im[i+14] = tB[b];
            }
            
            // loop unrolling remainder
            if ( rem )
            {
                rem <<= 2;
                for (i=l-rem; i<l; i+=4)
                {
                    r = im[i]; g = im[i+1]; b = im[i+2];
                    im[i] = tR[r]; im[i+1] = tG[g]; im[i+2] = tB[b];
                }
            }
        }
        return im;
    }
        
    ,canRun: function( ) {
        return this._isOn && this._tableR;
    }
});
// aliases
TableLookupFilter.prototype.posterize = TableLookupFilter.prototype.levels = TableLookupFilter.prototype.quantize;

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
!function(FILTER, undef){
"use strict";

var IMG = FILTER.ImArray, IMGcopy = FILTER.ImArrayCopy, 
    A16I = FILTER.Array16I,
    Min = Math.min, Max = Math.max, Floor = Math.floor
;

//
//
// DisplacementMapFilter
var DisplacementMapFilter = FILTER.DisplacementMapFilter = FILTER.Class( FILTER.Filter, {
    name: "DisplacementMapFilter"
    
    ,constructor: function( displacemap ) {
        var self = this;
        self.$super('constructor');
        if ( displacemap ) self.setMap( displacemap );
    }
    
    ,_map: null
    ,map: null
    // parameters
    ,scaleX: 1
    ,scaleY: 1
    ,startX: 0
    ,startY: 0
    ,componentX: 0
    ,componentY: 0
    ,color: 0
    ,red: 0
    ,green: 0
    ,blue: 0
    ,alpha: 0
    ,mode: FILTER.MODE.CLAMP
    
    ,dispose: function( ) {
        var self = this;
        
        self.$super('dispose');
        
        self._map = null;
        self.map = null;
        self.scaleX = null;
        self.scaleY = null;
        self.startX = null;
        self.startY = null;
        self.componentX = null;
        self.componentY = null;
        self.color = null;
        self.red = null;
        self.green = null;
        self.blue = null;
        self.alpha = null;
        self.mode = null;
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _map: self._map
                ,scaleX: self.scaleX
                ,scaleY: self.scaleY
                ,startX: self.startX
                ,startY: self.startY
                ,componentX: self.componentX
                ,componentY: self.componentY
                ,color: self.color
                ,red: self.red
                ,green: self.green
                ,blue: self.blue
                ,alpha: self.alpha
                ,mode: self.mode
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.map = null;
            self._map = params._map;
            self.scaleX = params.scaleX;
            self.scaleY = params.scaleY;
            self.startX = params.startX;
            self.startY = params.startY;
            self.componentX = params.componentX;
            self.componentY = params.componentY;
            self.color = params.color;
            self.red = params.red;
            self.green = params.green;
            self.blue = params.blue;
            self.alpha = params.alpha;
            self.mode = params.mode;
        }
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self._map = null; 
        self.map = null; 
        return self;
    }
    
    ,getMap: function( ) {
        return this.map;
    }
    
    ,setMap: function( map )  {
        var self = this;
        if ( map )
        {
            self.map = map; 
            self._map = { data: map.getData( ), width: map.width, height: map.height }; 
        }
        return self;
    }
    
    ,setColor: function( c ) {
        var self = this;
        self.color = c;
        self.alpha = (c >> 24) & 255; 
        self.red = (c >> 16) & 255; 
        self.green = (c >> 8) & 255; 
        self.blue = c & 255;
        return self;
    }
    
    // used for internal purposes
    ,_apply: function( im, w, h/*, image*/ ) {
        var self = this;
        if ( !self._isOn || !self._map ) return im;
        
        var map, mapW, mapH, mapArea, displace, ww, hh,
            sx = self.scaleX*0.00390625, sy = self.scaleY*0.00390625, 
            comx = self.componentX, comy = self.componentY, 
            alpha = self.alpha, red = self.red, 
            green = self.green, blue = self.blue, mode = self.mode,
            sty, stx, styw, bx0, by0, bx, by,
            i, j, k, x, y, ty, ty2, yy, xx, mapOff, dstOff, srcOff,
            applyArea, imArea, imLen, imcopy, srcx, srcy,
            _Ignore = FILTER.MODE.IGNORE, _Clamp = FILTER.MODE.CLAMP, _Color = FILTER.MODE.COLOR, _Wrap = FILTER.MODE.WRAP
        ;
        
        map = self._map.data;
        mapW = self._map.width; mapH = self._map.height; 
        mapArea = (map.length>>2); ww = Min(mapW, w); hh = Min(mapH, h);
        imLen = im.length; applyArea = (ww*hh)<<2; imArea = (imLen>>2);
        
        // make start relative
        stx = Floor(self.startX*(w-1));
        sty = Floor(self.startY*(h-1));
        styw = sty*w;
        bx0 = -stx; by0 = -sty; bx = w-stx-1; by = h-sty-1;
        
        displace = new A16I(mapArea<<1);
        imcopy = new IMGcopy(im);
        
        // pre-compute indices, 
        // reduce redundant computations inside the main application loop (faster)
        // this is faster if mapArea <= imArea, else a reverse algorithm may be needed (todo)
        j=0; x=0; y=0; ty=0;
        for (i=0; i<mapArea; i++, j+=2, x++)
        { 
            if (x>=mapW) { x=0; y++; ty+=mapW; }
            mapOff = (x + ty)<<2;
            displace[j] = Floor( ( map[mapOff+comx] - 128 ) * sx ); 
            displace[j+1] = Floor( ( map[mapOff+comy] - 128 ) * sy );
        } 
        
        // apply filter (algorithm implemented directly based on filter definition, with some optimizations)
        x=0; y=0; ty=0; ty2=0;
        for (i=0; i<applyArea; i+=4, x++)
        {
            // update image coordinates
            if (x>=ww) { x=0; y++; ty+=w; ty2+=mapW; }
            
            // if inside the application area
            if (y<by0 || y>by || x<bx0 || x>bx) continue;
            
            xx = x + stx; yy = y + sty; dstOff = (xx + ty + styw)<<2;  
            
            j = (x + ty2)<<1; srcx = xx + displace[j];  srcy = yy + displace[j+1];
            
            if (srcy>=h || srcy<0 || srcx>=w || srcx<0)
            {
                if (mode == _Ignore) 
                {
                    continue;
                }
                
                else if (mode == _Color)
                {
                    im[dstOff] = red;  im[dstOff+1] = green;
                    im[dstOff+2] = blue;  im[dstOff+3] = alpha;
                    continue;
                }
                    
                else if (mode == _Wrap)
                {
                    if (srcy>by) srcy-=h;
                    else if (srcy<0) srcy+=h;
                    if (srcx>bx) srcx-=w;
                    else if (srcx<0)  srcx+=w;
                }
                    
                else
                {
                    if (srcy>by)  srcy=by;
                    else if (srcy<0) srcy=0;
                    if (srcx>bx) srcx=bx;
                    else if (srcx<0) srcx=0;
                }
            }
            srcOff = (srcx + srcy*w)<<2;
            // new pixel values
            im[dstOff] = imcopy[srcOff];   im[dstOff+1] = imcopy[srcOff+1];
            im[dstOff+2] = imcopy[srcOff+2];  im[dstOff+3] = imcopy[srcOff+3];
        }
        return im;
    }
        
    ,canRun: function( ) {
        return this._isOn && (this._map || this.map);
    }
});

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
!function(FILTER, undef){
"use strict";

var IMG=FILTER.ImArray, IMGcopy=FILTER.ImArrayCopy, 
    PI=FILTER.CONSTANTS.PI,
    DoublePI=FILTER.CONSTANTS.PI2,
    HalfPI=FILTER.CONSTANTS.PI_2,
    ThreePI2 = 1.5 * PI,
    Sqrt=Math.sqrt, Atan2=Math.atan2, Atan = Math.atan,
    Sin=Math.sin, Cos=Math.cos, 
    Floor=Math.floor, //Round=Math.round, Ceil=Math.ceil,
    Asin=Math.asin, Tan=Math.tan, Abs=Math.abs, Max = Math.max,
    toRad=FILTER.CONSTANTS.toRad,
    Maps
;


//
//
// GeometricMapFilter
var GeometricMapFilter = FILTER.GeometricMapFilter = FILTER.Class( FILTER.Filter, {
    name: "GeometricMapFilter"
    
    ,constructor: function( inverseTransform ) {
        var self = this;
        self.$super('constructor');
        if ( inverseTransform ) self.generic( inverseTransform );
    }
    
    // parameters
    ,_map: null
    ,_mapName: null
    
    ,inverseTransform: null
    ,matrix: null
    ,centerX: 0
    ,centerY: 0
    ,dx: 0
    ,dy: 0
    ,angle: 0
    ,radius: 0
    ,wavelength: 0
    ,amplitude: 0
    ,phase: 0
    ,xAmplitude: 0
    ,yAmplitude: 0
    ,xWavelength: 0
    ,yWavelength: 0
    ,mode: FILTER.MODE.CLAMP
    
    ,dispose: function( ) {
        var self = this;
        
        self.$super('dispose');
        
        self._map = null;
        self._mapName = null;
        
        self.inverseTransform = null;
        self.matrix = null;
        self.centerX = null;
        self.centerY = null;
        self.dx = null;
        self.dy = null;
        self.angle = null;
        self.radius = null;
        self.wavelength = null;
        self.amplitude = null;
        self.phase = null;
        self.xAmplitude = null;
        self.yAmplitude = null;
        self.xWavelength = null;
        self.yWavelength = null;
        self.mode = null;
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _mapName: self._mapName
                ,inverseTransform: self.inverseTransform ? self.inverseTransform.toString( ) : null
                ,matrix: self.matrix
                ,centerX: self.centerX
                ,centerY: self.centerY
                ,dx: self.dx
                ,dy: self.dy
                ,angle: self.angle
                ,radius: self.radius
                ,wavelength: self.wavelength
                ,amplitude: self.amplitude
                ,phase: self.phase
                ,xAmplitude: self.xAmplitude
                ,yAmplitude: self.yAmplitude
                ,xWavelength: self.xWavelength
                ,yWavelength: self.yWavelength
                ,mode: self.mode
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.inverseTransform = null;
            
            self.matrix = params.matrix;
            self.centerX = params.centerX;
            self.centerY = params.centerY;
            self.dx = params.dx;
            self.dy = params.dy;
            self.angle = params.angle;
            self.radius = params.radius;
            self.wavelength = params.wavelength;
            self.amplitude = params.amplitude;
            self.phase = params.phase;
            self.xAmplitude = params.xAmplitude;
            self.yAmplitude = params.yAmplitude;
            self.xWavelength = params.xWavelength;
            self.yWavelength = params.yWavelength;
            self.mode = params.mode;
            
            if ( params.inverseTransform )
            {
                // using bind makes the code become [native code] and thus unserializable
                self.inverseTransform = eval( '(function(){ "use strict"; return ' + params.inverseTransform + '})();');
            }
            
            self._mapName = params._mapName;
            self._map = null;
            if ( self._mapName && Maps[ self._mapName ] )
                self._map = Maps[ self._mapName ];
        }
        return self;
    }
    
    ,generic: function( inverseTransform ) {
        var self = this;
        if ( inverseTransform )
        {
            self.inverseTransform = inverseTransform;
            self._mapName = "generic"; 
            self._map = Maps.generic; 
        }
        return self;
    }
    
    ,affine: function( matrix ) {
        var self = this;
        if ( matrix )
        {
            self.matrix = matrix; 
            self._mapName = "affine";  
            self._map = Maps.affine; 
        }
        return self;
    }
    
    ,flipX: function( ) {
        var self = this;
        self._mapName = "flipX";  
        self._map = Maps.flipX; 
        return self;
    }
    
    ,flipY: function( ) {
        var self = this;
        self._mapName = "flipY";  
        self._map = Maps.flipY; 
        return self;
    }
    
    ,flipXY: function( ) {
        var self = this;
        self._mapName = "flipXY";  
        self._map = Maps.flipXY; 
        return self;
    }
    
    ,rotateCW: function( ) {
        var self = this;
        self._mapName = "rotateCW";  
        self._map = Maps.rotateCW; 
        return self;
    }
    
    ,rotateCCW: function( ) {
        var self = this;
        self._mapName = "rotateCCW";  
        self._map = Maps.rotateCCW; 
        return self;
    }
    
    ,polar: function( centerX, centerY ) {
        var self = this;
        self.centerX = centerX||0; self.centerY = centerY||0;
        self._mapName = "polar";  
        self._map = Maps.polar; 
        return self;
    }
    
    ,cartesian: function( centerX, centerY ) {
        var self = this;
        self.centerX = centerX||0; self.centerY = centerY||0;
        self._mapName = "cartesian";  
        self._map = Maps.cartesian; 
        return self;
    }
    
    ,twirl: function( angle, radius, centerX, centerY ) {
        var self = this;
        self.angle = angle||0; self.radius = radius||0;
        self.centerX = centerX||0; self.centerY = centerY||0;
        self._mapName = "twirl";  
        self._map = Maps.twirl; 
        return self;
    }
    
    ,sphere: function( radius, centerX, centerY ) {
        var self = this;
        self.radius = radius||0; self.centerX = centerX||0; self.centerY = centerY||0;
        self._mapName = "sphere";  
        self._map = Maps.sphere; 
        return self;
    }
    
    ,ripple: function( radius, wavelength, amplitude, phase, centerX, centerY ) {
        var self = this;
        self.radius = (radius!==undef) ? radius : 50; 
        self.centerX = centerX||0; 
        self.centerY = centerY||0;
        self.wavelength = (wavelength!==undef) ? wavelength : 16; 
        self.amplitude = (amplitude!==undef) ? amplitude : 10; 
        self.phase = phase||0;
        self._mapName = "ripple";  
        self._map = Maps.ripple; 
        return self;
    }
    
    ,shift: function( dx, dy ) {
        var self = this;
        self.dx = (dx!==undef) ? dx : 0; 
        self.dy = (dy!==undef) ? dy : self.dx; 
        self._mapName = "shift";  
        self._map = Maps.shift; 
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self._mapName = null; 
        self._map = null; 
        return self;
    }
    
    ,getMap: function( ) {
        return this._map;
    }
    
    ,setMap: function( map ) {
        var self = this;
        self._mapName = null; 
        self._map = map; 
        return self;
    }
    
    // used for internal purposes
    ,_apply: function( im, w, h, image ) {
        var self = this;
        if ( !self._isOn || !self._map ) return im;
        return self._map( self, im, w, h, image );
    }
        
    ,canRun: function( ) {
        return this._isOn && this._map;
    }
});
// aliases
GeometricMapFilter.prototype.translate = GeometricMapFilter.prototype.shift;

//
//
// private geometric maps

/*function trivialMap(im, w, h) { return im; },*/
Maps = {
    "generic": function( self, im, w, h )  {
        var x, y, i, j, imLen=im.length, dst=new IMG(imLen),
            invTransform=self.inverseTransform, mode=self.mode,
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            t, tx, ty
        ;
        
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            t = invTransform([x, y], w, h); tx = ~~(t[0]); ty = ~~(t[1]);
            if (0>tx || tx>=w || 0>ty || ty>=h)
            {
                switch(mode)
                {
                    case _Wrap:
                        if (ty>=h) ty-=h;
                        else if (ty<0) ty+=h;
                        if (tx>=w) tx-=w;
                        else if (tx<0)  tx+=w;
                        break;
                        
                    case _Clamp:
                    default:
                        if (ty>=h)  ty=h-1;
                        else if (ty<0) ty=0;
                        if (tx>=w) tx=w-1;
                        else if (tx<0) tx=0;
                        break;
                }
            }
            j = (tx + ty*w)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }

    ,"affine": function( self, im, w, h ) {
        var x, y, yw, i, j, imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            mat=self.matrix, a=mat[0], b=mat[1], c=mat[3], d=mat[4], tx=mat[2], ty=mat[5], 
            tyw, cw, dw, mode=self.mode,
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            nx, ny, bx=w-1, by=imArea-w
        ;
        
        x=0; y=0; tyw=ty*w; cw=c*w; dw=d*w;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            nx = ~~(a*x + b*y + tx); ny = ~~(cw*x + dw*y + tyw);
            if (0>nx || nx>bx || 0>ny || ny>by)
            {
                switch(mode)
                {
                    case _Wrap:
                        if (ny>by) ny-=imArea;
                        else if (ny<0) ny+=imArea;
                        if (nx>=w) nx-=w;
                        else if (nx<0)  nx+=w;
                        break;
                        
                    case _Clamp:
                    default:
                        if (ny>by)  ny=by;
                        else if (ny<0) ny=0;
                        if (nx>bx) nx=bx;
                        else if (nx<0) nx=0;
                        break;
                }
            }
            j = (nx + ny)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }

    ,"shift": function( self, im, w, h ) {
        var x, y, yw, i, j, l=im.length, dst=new IMG(l),
            dx = -self.dx, dy = -self.dy;
        
        if ( dx < 0 ) dx += w;
        if ( dy < 0 ) dy += h;
        
        x=0; y=0; yw=0;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; yw+=w; }
            
            j = ((x+dx)%w + ((y+dy)%h)*w)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    ,"flipX": function( self, im, w, h ) {
        var x, y, yw, i, j, l=im.length, dst=new IMG(l);
        
        x=0; y=0; yw=0;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; yw+=w; }
            
            j = (w-1-x+yw)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    ,"flipY": function flipYMap( self, im, w, h ) {
        var x, y, yw2, i, j, l=im.length, dst=new IMG(l);
        
        x=0; y=0; yw2=(h-1)*w;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; yw2-=w; }
            
            j = (x+yw2)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    ,"flipXY": function( self, im, w, h )  {
        var x, y, yw, yw2, i, j, l=im.length, dst=new IMG(l);
        
        x=0; y=0; yw2=(h-1)*w;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; yw+=w; yw2-=w; }
            
            j = (w-1-x+yw2)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    ,"rotateCW": function( self, im, w, h )  {
        var x, y, yw, xw, i, j, l=im.length, dst=new IMG(l),
            hw=(l>>2);
        
        x=0; y=0; xw=hw-1;
        for (i=0; i<l; i+=4, x++, xw-=w)
        {
            if (x>=w) { x=0; xw=hw-1; y++; }
            
            j = (y + xw)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    ,"rotateCCW": function( self, im, w, h ) {
        var x, y, yw, xw, i, j, l=im.length, dst=new IMG(l),
            hw=(l>>2);
        
        x=0; y=0; xw=0;
        for (i=0; i<l; i+=4, x++, xw+=w)
        {
            if (x>=w) { x=0; xw=0; y++; }
            
            j = (w-1-y + xw)<<2;
            dst[i] = im[j];   dst[i+1] = im[j+1];
            dst[i+2] = im[j+2];  dst[i+3] = im[j+3];
        }
        return dst;
    }
    
    // adapted from http://je2050.de/imageprocessing/ TwirlMap
    ,"twirl": function( self, im, w, h )  {
        if ( 0 >= self.radius ) return im;
        
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im), // in Opera this is by-reference, hence the previous discrepancies
            cX=self.centerX, cY=self.centerY, angle=self.angle, radius=self.radius, mode=self.mode, 
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            d, tx, ty, theta, fact=angle/radius,
            bx=w-1, by=h-1
        ;
        
        // make center relative
        cX = Floor(cX*(w-1));
        cY = Floor(cY*(h-1));
            
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            tx = x-cX; ty = y-cY; 
            d = Sqrt(tx*tx + ty*ty);
            if (d < radius)
            {
                theta = Atan2(ty, tx) + fact*(radius-d);
                tx = ~~(cX + d*Cos(theta));  ty = ~~(cY + d*Sin(theta));
                if (0>tx || tx>bx || 0>ty || ty>by)
                {
                    switch(mode)
                    {
                        case _Wrap:
                            if (ty>by) ty-=h;
                            else if (ty<0) ty+=h;
                            if (tx>bx) tx-=w;
                            else if (tx<0)  tx+=w;
                            break;
                            
                        case _Clamp:
                        default:
                            if (ty>by)  ty=by;
                            else if (ty<0) ty=0;
                            if (tx>bx) tx=bx;
                            else if (tx<0) tx=0;
                            break;
                    }
                }
                j = (tx + ty*w)<<2;
                // swaping the arrays of input/output (together with Uint8Array for Opera)
                // solves the problem in all browsers (FF24, Chrome, Opera 12, IE10+)
                im[i] = imcopy[j];   im[i+1] = imcopy[j+1];
                im[i+2] = imcopy[j+2];  im[i+3] = imcopy[j+3];
            }
        }
        return im;
    }
    
    // adapted from http://je2050.de/imageprocessing/ SphereMap
    ,"sphere": function( self, im, w, h )  {
        if (0>=self.radius) return im;
        
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
            cX=self.centerX, cY=self.centerY, radius=self.radius, mode=self.mode, 
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            d, tx, ty, theta, radius2=radius*radius,
            refraction = 0.555556, invrefraction=1-refraction,
            r2, thetax, thetay, d2, ds, tx2, ty2,
            bx=w-1, by=h-1
        ;
        
        // make center relative
        cX = Floor(cX*(w-1));
        cY = Floor(cY*(h-1));
            
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            tx = x - cX;  ty = y - cY;
            tx2 = tx*tx; ty2 = ty*ty;
            r2 = tx2 + ty2;
            if (r2 < radius2)
            {
                d2 = radius2 - r2; ds = Sqrt(d2);
                thetax = Asin(tx / Sqrt(tx2 + d2)) * invrefraction;
                thetay = Asin(ty / Sqrt(ty2 + d2)) * invrefraction;
                tx = ~~(x - ds * Tan(thetax));  ty = ~~(y - ds * Tan(thetay));
                if (0>tx || tx>bx || 0>ty || ty>by)
                {
                    switch(mode)
                    {
                        case _Wrap:
                            if (ty>by) ty-=h;
                            else if (ty<0) ty+=h;
                            if (tx>bx) tx-=w;
                            else if (tx<0)  tx+=w;
                            break;
                            
                        case _Clamp:
                        default:
                            if (ty>by)  ty=by;
                            else if (ty<0) ty=0;
                            if (tx>bx) tx=bx;
                            else if (tx<0) tx=0;
                            break;
                    }
                }
                j = (tx + ty*w)<<2;
                im[i] = imcopy[j];   im[i+1] = imcopy[j+1];
                im[i+2] = imcopy[j+2];  im[i+3] = imcopy[j+3];
            }
        }
        return im;
    }
    
    // adapted from https://github.com/JoelBesada/JSManipulate
    ,"ripple": function( self, im, w, h ) {
        if (0>=self.radius) return im;
        
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            d, tx, ty, amount, 
            r2, d2, ds, tx2, ty2,
            bx=w-1, by=h-1,
            cX=self.centerX, cY=self.centerY, radius=self.radius, mode=self.mode, 
            radius2=radius*radius,
            wavelength = self.wavelength,
            amplitude = self.amplitude,
            phase = self.phase
        ;
        
        // make center relative
        cX = Floor(cX*(w-1));
        cY = Floor(cY*(h-1));
            
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            tx = x - cX;  ty = y - cY;
            tx2 = tx*tx; ty2 = ty*ty;
            d2 = tx2 + ty2;
            if (d2 < radius2)
            {
                d = Sqrt(d2);
                amount = amplitude * Sin(d/wavelength * Math.PI * 2 - phase);
                amount *= (radius-d)/radius;
                if (d)  amount *= wavelength/d;
                tx = ~~(x + tx*amount);  ty = ~~(y + ty*amount);
                
                if (0>tx || tx>bx || 0>ty || ty>by)
                {
                    switch(mode)
                    {
                        case _Wrap:
                            if (ty>by) ty-=h;
                            else if (ty<0) ty+=h;
                            if (tx>bx) tx-=w;
                            else if (tx<0)  tx+=w;
                            break;
                            
                        case _Clamp:
                        default:
                            if (ty>by)  ty=by;
                            else if (ty<0) ty=0;
                            if (tx>bx) tx=bx;
                            else if (tx<0) tx=0;
                            break;
                    }
                }
                j = (tx + ty*w)<<2;
                im[i] = imcopy[j];   im[i+1] = imcopy[j+1];
                im[i+2] = imcopy[j+2];  im[i+3] = imcopy[j+3];
            }
        }
        return im;
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    /*
    ,"circle": function( self, im, w, h ) {
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            tx, ty, ix, iy, ip, d2,
            bx = w-1, by = h-1, 
            cX, cY, cX2, cY2,
            mode = this.mode
        ;
        
        cX = ~~(0.5*w + 0.5);
        cY = ~~(0.5*h + 0.5);
        cX2 = cX*cX;
        cY2 = cY*cY;
        
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            tx = x-cX;
            ty = y-cY;
            d2 = tx*tx + ty*ty;
            ix = cX + cX2 * tx/d2;
            iy = cY + cY2 * ty/d2;
            // inverse transform
            if (0>ix || ix>bx || 0>iy || iy>by)
            {
                switch(mode)
                {
                    case _Wrap:
                        if (iy>by) iy-=h;
                        else if (iy<0) iy+=h;
                        if (ix>bx) ix-=w;
                        else if (ix<0)  ix+=w;
                        break;
                        
                    case _Clamp:
                    default:
                        if (iy>by)  iy=by;
                        else if (iy<0) iy=0;
                        if (ix>bx) ix=bx;
                        else if (ix<0) ix=0;
                        break;
                }
            }
            ip = ( ~~(ix+0.5) + ~~(iy+0.5) )<<2;
            im[i] = imcopy[ ip ];
            im[i+1] = imcopy[ ip+1 ];
            im[i+2] = imcopy[ ip+2 ];
            im[i+3] = imcopy[ ip+3 ];
        }
        return im;
    }
    */
    ,"polar": function( self, im, w, h ) {
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            tx, ty, ix, iy, ip,
            bx = w-1, by = h-1, 
            theta, r=0, radius, cX, cY, 
            mode = self.mode
        ;
        
        cX = ~~(0.5*w + 0.5);
        cY = ~~(0.5*h + 0.5);
        radius = Max(cY, cX);
            
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            tx = x-cX;
            ty = y-cY;
            theta = 0;
            
            if (tx >= 0) 
            {
                if (ty > 0) 
                {
                    theta = PI - Atan(tx/ty);
                    r = Sqrt(tx*tx + ty*ty);
                } 
                else if (ty < 0) 
                {
                    theta = Atan(tx/ty);
                    r = Sqrt(tx*tx + ty*ty);
                } 
                else 
                {
                    theta = HalfPI;
                    r = tx;
                }
            } 
            else if (tx < 0) 
            {
                if (ty < 0) 
                {
                    theta = DoublePI - Atan(tx/ty);
                    r = Sqrt(tx*tx + ty*ty);
                } 
                else if (ty > 0) 
                {
                    theta = PI + Atan(tx/ty);
                    r = Sqrt(tx*tx + ty*ty);
                } 
                else 
                {
                    theta = ThreePI2;
                    r = -tx;
                }
            }
            // inverse transform
            ix = (w-1) - (w-1)/DoublePI * theta;
            iy = (h * r / radius);
            
            if (0>ix || ix>bx || 0>iy || iy>by)
            {
                switch(mode)
                {
                    case _Wrap:
                        if (iy>by) iy-=h;
                        else if (iy<0) iy+=h;
                        if (ix>bx) ix-=w;
                        else if (ix<0)  ix+=w;
                        break;
                        
                    case _Clamp:
                    default:
                        if (iy>by)  iy=by;
                        else if (iy<0) iy=0;
                        if (ix>bx) ix=bx;
                        else if (ix<0) ix=0;
                        break;
                }
            }
            ip = ( ~~(ix+0.5) + ~~(iy+0.5)*w )<<2;
            im[i] = imcopy[ ip ];
            im[i+1] = imcopy[ ip+1 ];
            im[i+2] = imcopy[ ip+2 ];
            im[i+3] = imcopy[ ip+3 ];
        }
        return im;
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,"cartesian": function( self, im, w, h ) {
        var x, y, i, j, imLen=im.length, imcopy=new IMGcopy(im),
            _Clamp=FILTER.MODE.CLAMP, _Wrap=FILTER.MODE.WRAP,
            ix, iy, ip, nx, ny,
            bx = w-1, by = h-1, 
            theta, theta2, r=0, radius, cX, cY, 
            mode = self.mode
        ;
        
        cX = ~~(0.5*w + 0.5);
        cY = ~~(0.5*h + 0.5);
        radius = Max(cY, cX);
            
        x=0; y=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            theta = x / w * DoublePI;

            if (theta >= ThreePI2)
                theta2 = DoublePI - theta;
            else if (theta >= PI)
                theta2 = theta - PI;
            else if (theta >= HalfPI)
                theta2 = PI - theta;
            else
                theta2 = theta;
            r = radius * (y / h);

            nx = -r * Sin(theta2);
            ny = r * Cos(theta2);
            
            if (theta >= ThreePI2) 
            {
                ix = cX - nx;
                iy = cY - ny;
            } 
            else if (theta >= PI) 
            {
                ix = cX - nx;
                iy = cY + ny;
            } 
            else if (theta >= HalfPI) 
            {
                ix = cX + nx;
                iy = cY + ny;
            } 
            else 
            {
                ix = cX + nx;
                iy = cY - ny;
            }
            // inverse transform
            if (0>ix || ix>bx || 0>iy || iy>by)
            {
                switch(mode)
                {
                    case _Wrap:
                        if (iy>by) iy-=h;
                        else if (iy<0) iy+=h;
                        if (ix>bx) ix-=w;
                        else if (ix<0)  ix+=w;
                        break;
                        
                    case _Clamp:
                    default:
                        if (iy>by)  iy=by;
                        else if (iy<0) iy=0;
                        if (ix>bx) ix=bx;
                        else if (ix<0) ix=0;
                        break;
                }
            }
            ip = ( ~~(ix+0.5) + ~~(iy+0.5)*w )<<2;
            im[i] = imcopy[ ip ];
            im[i+1] = imcopy[ ip+1 ];
            im[i+2] = imcopy[ ip+2 ];
            im[i+3] = imcopy[ ip+3 ];
        }
        return im;
    }
};

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
!function(FILTER, undef){
"use strict";

var 
    sqrt2=FILTER.CONSTANTS.SQRT2, toRad=FILTER.CONSTANTS.toRad, toDeg=FILTER.CONSTANTS.toDeg,
    Abs=Math.abs, Sqrt=Math.sqrt, Sin=Math.sin, Cos=Math.cos,
    
    // Convolution Matrix
    CM=FILTER.Array32F, 
    IMG = FILTER.ImArray, //IMGcopy = FILTER.ImArrayCopy,
    A32F=FILTER.Array32F, A16I=FILTER.Array16I, A8U=FILTER.Array8U,
    notSupportClamp=FILTER._notSupportClamp,
    
    // hardcode Pascal numbers, used for binomial kernels
    _pascal=[
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
//
//  Convolution Matrix Filter
var ConvolutionMatrixFilter = FILTER.ConvolutionMatrixFilter = FILTER.Class( FILTER.Filter, {
    name: "ConvolutionMatrixFilter"
    
    ,constructor: function( weights, factor, bias ) {
        var self = this;
        self.$super('constructor');
        self._coeff = new CM([1.0, 0.0]);
        
        if ( weights && weights.length)
        {
            self.set(weights, ~~(Sqrt(weights.length)+0.5), factor||1.0, bias||0.0);
        }
        else 
        {
            self._matrix = null; self._dim = 0;
        }
        self._matrix2 = null;  self._dim2 = 0;
        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        
        if ( FILTER.useWebGL ) 
        {
            self._webglInstance = FILTER.WebGLConvolutionMatrixFilterInstance || null;
        }
    }
    
    ,_dim: 0
    ,_dim2: 0
    ,_matrix: null
    ,_matrix2: null
    ,_mat: null
    ,_mat2: null
    ,_coeff: null
    ,_isGrad: false
    ,_doIntegral: 0
    ,_doSeparable: false
    ,_indices: null
    ,_indices2: null
    ,_indicesf: null
    ,_indicesf2: null
    ,_webglInstance: null
    
    ,dispose: function( ) {
        var self = this;
        
        self.$super('dispose');
        
        self._webglInstance = null;
        self._dim = null;
        self._dim2 = null;
        self._matrix = null;
        self._matrix2 = null;
        self._mat = null;
        self._mat2 = null;
        self._coeff = null;
        self._isGrad = null;
        self._doIntegral = null;
        self._doSeparable = null;
        self._indices = null;
        self._indices2 = null;
        self._indicesf = null;
        self._indicesf2 = null;
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _dim: self._dim
                ,_dim2: self._dim2
                ,_matrix: self._matrix
                ,_matrix2: self._matrix2
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
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._dim = params._dim;
            self._dim2 = params._dim2;
            self._matrix = params._matrix;
            self._matrix2 = params._matrix2;
            self._mat = params._mat;
            self._mat2 = params._mat2;
            self._coeff = params._coeff;
            self._isGrad = params._isGrad;
            self._doIntegral = params._doIntegral;
            self._doSeparable = params._doSeparable;
            self._indices = params._indices;
            self._indices2 = params._indices2;
            self._indicesf = params._indicesf;
            self._indicesf2 = params._indicesf2;
        }
        return self;
    }
    
    // generic low-pass filter
    ,lowPass: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        this.set(ones(d), d, 1/(d*d), 0.0);
        this._doIntegral = 1; return this;
    }

    // generic high-pass filter (I-LP)
    ,highPass: function( d, f ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        f = ( f === undef ) ? 1 : f;
        // HighPass Filter = I - (respective)LowPass Filter
        var size=d*d, fact=-f/size, w=ones(d, fact, 1+fact);
        this.set(w, d, 1.0, 0.0);
        this._doIntegral = 1; return this;
    }

    ,glow: function( f, d ) { 
        f = ( f === undef ) ? 0.5 : f;  
        return this.highPass(d, -f); 
    }
    
    ,sharpen: function( f, d ) { 
        f = ( f === undef ) ? 0.5 : f;  
        return this.highPass(d, f); 
    }
    
    ,verticalBlur: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        this.set(average1DKernel(d), 1, 1/d, 0.0); 
        this._dim2 = d; this._doIntegral = 1; return this;
    }
    
    ,horizontalBlur: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        this.set(average1DKernel(d), d, 1/d, 0.0); 
        this._dim2 = 1; this._doIntegral = 1; return this;
    }
    
    // supports only vertical, horizontal, diagonal
    ,directionalBlur: function( theta, d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        theta *= toRad;
        var c = Cos(theta), s = -Sin(theta), filt = twos2(d, c, s, 1/d);
        return this.set(filt, d, 1.0, 0.0);
    }
    
    // fast gauss filter
    ,fastGauss: function( quality, d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        quality = ~~(quality||1);
        if ( quality < 1 ) quality = 1;
        else if ( quality > 3 ) quality = 3;
        this.set(ones(d), d, 1/(d*d), 0.0);
        this._doIntegral = quality; return this;
    }
    
    // generic binomial(quasi-gaussian) low-pass filter
    ,binomialLowPass: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        /*var filt=gaussKernel(d);
        return this.set(filt.kernel, d, 1/filt.sum); */
        var kernel = binomial1DKernel(d), sum=1<<(d-1), fact=1/sum;
        this.set(kernel, d, fact, fact);
        this._matrix2 = new CM(kernel);
        var tmp = this._computeIndices(this._matrix2, this._dim2);
        this._indices2 = tmp[0]; this._indicesf2 = tmp[1]; this._mat2 = tmp[2];
        this._doSeparable = true; return this;
    }

    // generic binomial(quasi-gaussian) high-pass filter
    ,binomialHighPass: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var filt = gaussKernel(d);
        // HighPass Filter = I - (respective)LowPass Filter
        return this.set(blendMatrix(ones(d), new CM(filt.kernel), 1, -1/filt.sum), d, 1.0, 0.0); 
    }
    
    // X-gradient, partial X-derivative (Prewitt)
    ,prewittX: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var filt = prewittKernel(d, 0);
        // this can be separable
        return this.set(filt.kernel, d, 1.0, 0.0);
    }
    
    // Y-gradient, partial Y-derivative (Prewitt)
    ,prewittY: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var filt = prewittKernel(d, 1);
        // this can be separable
        return this.set(filt.kernel, d, 1.0, 0.0);
    }
    
    // directional gradient (Prewitt)
    ,prewittDirectional: function( theta, d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        theta*=toRad;
        var c = Cos(theta), s = Sin(theta), gradx = prewittKernel(d, 0), grady = prewittKernel(d, 1);
        return this.set(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), d, 1.0, 0.0);
    }
    
    // gradient magnitude (Prewitt)
    ,prewitt: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var gradx = prewittKernel(d, 0), grady = prewittKernel(d, 1);
        this.set(gradx.kernel, d, 1.0, 0.0);
        this._isGrad = true;
        this._matrix2 = new CM(grady.kernel);
        var tmp = this._computeIndices(this._matrix2, this._dim2);
        this._indices2 = tmp[0]; this._indicesf2 = tmp[1]; this._mat2 = tmp[2];
        return this;
    }
    
    // partial X-derivative (Sobel)
    ,sobelX: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var filt = sobelKernel(d, 0);
        // this can be separable
        return this.set(filt.kernel, d, 1.0, 0.0);
    }
    
    // partial Y-derivative (Sobel)
    ,sobelY: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var filt = sobelKernel(d, 1);
        // this can be separable
        return this.set(filt.kernel, d, 1.0, 0.0);
    }
    
    // directional gradient (Sobel)
    ,sobelDirectional: function( theta, d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        theta*=toRad;
        var c = Cos(theta), s = Sin(theta), gradx = sobelKernel(d, 0), grady = sobelKernel(d, 1);
        return this.set(blendMatrix(new CM(gradx.kernel), new CM(grady.kernel), c, s), d, 1.0, 0.0);
    }
    
    // gradient magnitude (Sobel)
    ,sobel: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var gradx = sobelKernel(d, 0), grady = sobelKernel(d, 1);
        this.set(gradx.kernel, d, 1.0, 0.0);
        this._matrix2 = new CM(grady.kernel);
        var tmp = this._computeIndices(this._matrix2, this._dim2);
        this._indices2 = tmp[0]; this._indicesf2 = tmp[1]; this._mat2 = tmp[2];
        this._isGrad = true;
        return this;
    }
    
    ,laplace: function( d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        var size = d*d, laplacian = ones(d, -1, size-1);
        this.set(laplacian, d, 1.0, 0.0);
        this._doIntegral = 1; return this;
    }
    
    ,emboss: function( angle, amount, d ) {
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        angle = ( angle === undef ) ? (-0.25*Math.PI) : (angle*toRad);
        amount = amount||1;
        var dx = amount*Cos(angle), dy = -amount*Sin(angle), filt = twos(d, dx, dy, 1);
        return this.set(filt, d, 1.0, 0.0);
    }
    
    ,edges: function( m ) {
        m = m||1;
        return this.set([
                0,   m,   0,
                m,  -4*m, m,
                0,   m,   0
             ], 3, 1.0, 0.0);
    }
    
    ,set: function( m, d, f, b ) {
        var self = this;
        self._matrix2 = null; self._dim2 = 0; self._indices2 = self._indicesf2 = null; self._mat2 = null;
        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        self._matrix = new CM(m); self._dim = d; self._coeff[0] = f||1; self._coeff[1] = b||0;
        var tmp  = self._computeIndices(self._matrix, self._dim);
        self._indices = tmp[0]; self._indicesf = tmp[1]; self._mat = tmp[2];
        return self;
    }
    
    ,_computeIndices: function( m, d ) {
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        var indices = [], indices2 = [], mat = [], k, x, y,  matArea = m.length, matRadius = d, matHalfSide = (matRadius>>1);
        x=0; y=0; k=0;
        while (k<matArea)
        { 
            indices2.push(x-matHalfSide); 
            indices2.push(y-matHalfSide);
            if (m[k])
            {
                indices.push(x-matHalfSide); 
                indices.push(y-matHalfSide);
                mat.push(m[k]);
            }
            k++; x++; if (x>=matRadius) { x=0; y++; }
        }
        return [new A16I(indices), new A16I(indices2), new CM(mat)];
    }
    
    ,reset: function( ) {
        var self = this;
        self._matrix = self._matrix2 = null; 
        self._mat = self._mat2 = null; 
        self._dim = self._dim2 = 0;
        self._indices = self._indices2 = self._indicesf = self._indicesf2 = null;
        self._isGrad = false; self._doIntegral = 0; self._doSeparable = false;
        return self;
    }
    
    ,combineWith: function( filt ) {
        // matrices/kernels need to be convolved -> larger kernel->tensor in order to be actually combined
        // todo??
        return this;
    }
    
    ,getMatrix: function( ) {
        return this._matrix;
    }
    
    ,setMatrix: function( m, d ) {
        return this.set(m, d);
    }
    
    // used for internal purposes
    ,_apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !self._matrix ) return im;
        
        // do a faster convolution routine if possible
        if ( self._doIntegral ) 
        {
            if (self._matrix2)
                return integralConvolution(im, w, h, self._matrix, self._matrix2, self._dim, self._dim2, self._coeff[0], self._coeff[1], self._doIntegral);
            else
                return integralConvolution(im, w, h, self._matrix, null, self._dim, self._dim, self._coeff[0], self._coeff[1], self._doIntegral);
        }
        else if ( self._doSeparable )
        {
            return separableConvolution(im, w, h, self._mat, self._mat2, self._indices, self._indices2, self._coeff[0], self._coeff[1]);
        }
        // handle some common cases fast
        /*else if (3==this._dim)
        {
            return convolution3(im, w, h, this._matrix, this._matrix2, this._dim, this._dim, this._coeff[0], this._coeff[1], this._isGrad);
        }*/
        
        var imLen = im.length, imArea = (imLen>>2), 
            dst = new IMG(imLen), 
            t0, t1, t2,
            i, j, k, x, ty, ty2, 
            xOff, yOff, srcOff, 
            r, g, b, r2, g2, b2,
            bx = w-1, by = imArea-w,
            coeff1 = self._coeff[0], coeff2 = self._coeff[1],
            mat = self._matrix, mat2 = self._matrix2, wt, wt2, _isGrad = self._isGrad,
            mArea, matArea, imageIndices
            ;
        
        // apply filter (algorithm direct implementation based on filter definition with some optimizations)
        if (mat2) // allow to compute a second matrix in-parallel in same pass
        {
            // pre-compute indices, 
            // reduce redundant computations inside the main convolution loop (faster)
            mArea = self._indicesf.length; 
            imageIndices = new A16I(self._indicesf);
            for (k=0; k<mArea; k+=2)
            { 
                imageIndices[k+1] *= w;
            } 
            matArea = mat.length;
            
            // do direct convolution
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=0; g=0; b=0; r2=0; g2=0; b2=0; 
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; 
                        wt = mat[k]; r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        // allow to apply a second similar matrix in-parallel (eg for total gradients)
                        wt2 = mat2[k]; r2 += im[srcOff] * wt2; g2 += im[srcOff+1] * wt2;  b2 += im[srcOff+2] * wt2;
                    }
                }
                
                // output
                if (_isGrad)
                {
                    t0 = Abs(r)+Abs(r2);  t1 = Abs(g)+Abs(g2);  t2 = Abs(b)+Abs(b2);
                }
                else
                {
                    t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                }
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
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
            for (k=0; k<mArea; k+=2)
            { 
                imageIndices[k+1] *= w;
            }
            mat = self._mat;
            matArea = mat.length;
            
            // do direct convolution
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=0; g=0; b=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                    }
                }
                
                // output
                t0 = coeff1*r+coeff2;  t1 = coeff1*g+coeff2;  t2 = coeff1*b+coeff2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
        }
        return dst;
    }
        
    ,canRun: function( ) {
        return this._isOn && this._matrix;
    }
});
// aliases
ConvolutionMatrixFilter.prototype.bump = ConvolutionMatrixFilter.prototype.emboss;
ConvolutionMatrixFilter.prototype.boxBlur = ConvolutionMatrixFilter.prototype.lowPass;
ConvolutionMatrixFilter.prototype.gaussBlur = ConvolutionMatrixFilter.prototype.binomialLowPass;
ConvolutionMatrixFilter.prototype.gradX = ConvolutionMatrixFilter.prototype.prewittX;
ConvolutionMatrixFilter.prototype.gradY = ConvolutionMatrixFilter.prototype.prewittY;
ConvolutionMatrixFilter.prototype.gradDirectional = ConvolutionMatrixFilter.prototype.prewittDirectional;
ConvolutionMatrixFilter.prototype.grad = ConvolutionMatrixFilter.prototype.prewitt;


//
//
//  Private methods

function addMatrix(m1, m2)
{
    var l=m1.length, i, m=new CM(m1.length);
    i=0; while (i<l) { m[i]=m1[i] + m2[i]; i++; }
    return m;
}

function subtractMatrix(m1, m2)
{
    var l=m1.length, i, m=new CM(m1.length);
    i=0; while (i<l) { m[i]=m1[i]-m2[i]; i++; }
    return m;
}

function multiplyScalar(m1, s)
{
    if (1==s) return new CM(m1);
    var l=m1.length, i, m=new CM(m1.length);
    i=0; while (i<l) { m[i]=m1[i]*s; i++; }
    return m;
}

function blendMatrix(m1, m2, a, b)
{
    var l=m1.length, i, m=new CM(m1.length);
    a=a||1; b=b||1;
    i=0; while (i<l) { m[i]=a*m1[i] + b*m2[i]; i++; }
    return m;
}

function convolveKernels(k1, k2)
{
    var i, j, kl=k1.length, k, ker=[], sum=0;
    for (i=0; i<kl; i++) { for (j=0; j<kl; j++) { k=k1[i]*k2[j];  sum+=k;  ker.push(k); } }
    return {kernel:ker, sum:sum};
}

function identity1DKernel(d)
{
    var i, center=(d>>1), ker=new Array(d);
    i=0; while (i<d) { ker[i]=0; i++; }
    ker[center]=1;  return ker;
}

function average1DKernel(d)
{
    var i, ker=new Array(d);
    i=0; while (i<d) { ker[i]=1; i++; }
    return ker;
}

// pascal numbers (binomial coefficients) are used to get coefficients for filters that resemble gaussian distributions
// eg Sobel, Canny, gradients etc..
function binomial1DKernel(d) 
{
    var l=_pascal.length, row, uprow, i, il;
    d--;
    if (d<l)
    {
        row=new CM(_pascal[d]);
    }
    else
    {
        // else compute them iteratively
        row=new CM(_pascal[l-1]);
        while (l<=d)
        {
            uprow=row; row=new CM(uprow.length+1); row[0]=1;
            for (i=0, il=uprow.length-1; i<il; i++) { row[i+1]=(uprow[i]+uprow[i+1]); } row[uprow.length]=1;
            if (l<40) _pascal.push(new Array(row)); // save it for future dynamically
            l++;
        }
    }
    return row;
}

function derivative1DKernel(d)
{
    var i, half=d>>1, k=-half, ker=new Array(d);
    i=0; while (i<d) { ker[i] = k; k++; i++; }
    return ker;
}

function gaussKernel(d)
{
    var binomial=binomial1DKernel(d);
    // convolve with itself
    return convolveKernels(binomial, binomial);
}

function verticalKernel(d)
{
    var eye=identity1DKernel(d), average=average1DKernel(d);
    // convolve with itself
    return convolveKernels(average, eye);
}

function horizontalKernel(d)
{
    var eye=identity1DKernel(d), average=average1DKernel(d);
    // convolve with itself
    return convolveKernels(eye, average);
}

function sobelKernel(d, dir)
{
    var binomial=binomial1DKernel(d), derivative=derivative1DKernel(d);
    if (1==dir) // y
        return convolveKernels(derivative.reverse(), binomial);
    else  // x
        return convolveKernels(binomial, derivative);
}

function prewittKernel(d, dir)
{
    var average=average1DKernel(d), derivative=derivative1DKernel(d);
    if (1==dir) // y
        return convolveKernels(derivative.reverse(), average);
    else // x
        return convolveKernels(average, derivative);
}

function ones(d, f, c) 
{ 
    f=f||1; c=c||f;
    var l=d*d, center=l>>1, i, o=new CM(l);
    i=0; while(i<l) { o[i]=f; i++; } o[center]=c;
    return o;
}

function twos(d, dx, dy, c)
{
    var l=d*d, half=d>>1, center=l>>1, i, k, j, o=new CM(l), tx, ty;
    tx = 0;
    for (i=0; i<=half; i++)
    {
        k = 0; ty = 0;
        for (j=0; j<=half; j++)
        {
            //tx=i*dx;  ty=j*dy;
            o[center + i + k]=   tx + ty;
            o[center - i - k]= - tx - ty;
            o[center - i + k]= - tx + ty;
            o[center + i - k]=   tx - ty;
            k += d; ty += dy;
        }
        tx += dx;
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
    
    if (Abs(c)>delta) { dx=1; dy=s/c; }
    else  { dx=c/s; dy=1; }
    
    i=0; tx=0; ty=0; k=dy*d;
    while (i<=half)
    {
        // compute the transformation of the (diagonal) line
        T[center + i]= ~~(center + tx + ty + 0.5);
        T[center - i]= ~~(center - tx - ty + 0.5);
        i++; tx+=dx; ty+=k;
    }
    i=0;
    while (i<=half)
    {
        // do the mapping of the base line to the transformed one
        o[T[center + i]]=o[T[center - i]]=f;
        // anti-aliasing ??..
        i++;
    }
    o[center] = cf||1;
    return o;
}

// speed-up convolution for special kernels like moving-average
function integralConvolution(im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats) 
{
    var imLen=im.length, imArea=(imLen>>2), integral, integralLen, colR, colG, colB,
        matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2,
        r, g, b, r2, g2, b2, repeat
    ;
    
    // convolution speed-up based on the integral image concept and symmetric / separable kernels
    
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    matArea = matRadiusX*matRadiusY;
    matHalfSideX = matRadiusX>>1;  matHalfSideY = w*(matRadiusY>>1);
    // one additional offest needed due to integral computation
    matOffsetLeft = -matHalfSideX-1; matOffsetTop = -matHalfSideY-w;
    matOffsetRight = matHalfSideX; matOffsetBottom = matHalfSideY;
    bx1 = 0; bx2 = w-1; by1 = 0; by2 = imArea-w;
    
    integralLen = (imArea<<1)+imArea;  rowLen = (w<<1)+w;
    
    numRepeats = numRepeats||1;  repeat = 0;
    
    if (matrix2) // allow to compute a second matrix in-parallel
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
        wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>1]; centerOffset2 = wtCenter2-wt2;
        
        // do this multiple times??
        while (repeat<numRepeats)
        {
            dst = new IMG(imLen); integral = new A32F(integralLen);
            
            // compute integral of image in one pass
            
            // first row
            i=0; j=0; colR=colG=colB=0;
            for (x=0; x<w; x++, i+=4, j+=3)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
            }
            // other rows
            j=0; x=0; colR=colG=colB=0;
            for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=0; }
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j+rowLen]=integral[j]+colR; 
                integral[j+rowLen+1]=integral[j+1]+colG; 
                integral[j+rowLen+2]=integral[j+2]+colB;
            }
            
            
            // now can compute any symmetric convolution kernel in constant time 
            // depending only on image dimensions, regardless of matrix radius
            
            // do direct convolution
            x=0; y=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; y++; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;
                
                // fix borders
                 xOff1 = (xOff1<bx1) ? bx1 : xOff1;
                 xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                 yOff1 = (yOff1<by1) ? by1 : yOff1;
                 yOff2 = (yOff2>by2) ? by2 : yOff2;
                
                // compute integral positions
                p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                // arguably faster way to write p1*=3; etc..
                p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                
                // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                // also fix the center element (in case it is different)
                r = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1])  +  (centerOffset * im[i]);
                g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                
                r2 = wt2 * (integral[p4] - integral[p2] - integral[p3] + integral[p1])  +  (centerOffset2 * im[i]);
                g2 = wt2 * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset2 * im[i+1]);
                b2 = wt2 * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset2 * im[i+2]);
                
                // output
                t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            
            // do another pass??
            im = dst;  repeat++;
        }
    }
    else
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
    
        // do this multiple times??
        while (repeat<numRepeats)
        {
            dst = new IMG(imLen); integral = new A32F(integralLen);
            
            // compute integral of image in one pass
            
            // first row
            i=0; j=0; colR=colG=colB=0;
            for (x=0; x<w; x++, i+=4, j+=3)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
            }
            // other rows
            j=0; x=0; colR=colG=colB=0;
            for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=0; }
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
                integral[j+rowLen]=integral[j]+colR; 
                integral[j+rowLen+1]=integral[j+1]+colG; 
                integral[j+rowLen+2]=integral[j+2]+colB;
            }
            
            // now can compute any symmetric convolution kernel in constant time 
            // depending only on image dimensions, regardless of matrix radius
            
            // do direct convolution
            x=0; y=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; y++; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                xOff1=x + matOffsetLeft; yOff1=ty + matOffsetTop;
                xOff2=x + matOffsetRight; yOff2=ty + matOffsetBottom;
                
                // fix borders
                 xOff1 = (xOff1<bx1) ? bx1 : xOff1;
                 xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                 yOff1 = (yOff1<by1) ? by1 : yOff1;
                 yOff2 = (yOff2>by2) ? by2 : yOff2;
                
                // compute integral positions
                p1=xOff1 + yOff1; p4=xOff2 + yOff2; p2=xOff2 + yOff1; p3=xOff1 + yOff2;
                // arguably faster way to write p1*=3; etc..
                p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                
                // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                // also fix the center element (in case it is different)
                r = wt * (integral[p4] - integral[p2] - integral[p3] + integral[p1])  +  (centerOffset * im[i]);
                g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                
                // output
                t0 = coeff1*r + coeff2;  t1 = coeff1*g + coeff2;  t2 = coeff1*b + coeff2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                    t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                    t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            
            // do another pass??
            im = dst;  repeat++;
        }
    }
    return dst;
}

// speed-up convolution for separable kernels
function separableConvolution(im, w, h, matrix, matrix2, ind1, ind2, coeff1, coeff2) 
{
    var imLen=im.length, imArea=(imLen>>2),
        matA, indA,
        matArea, mat, indices, matArea2,
        dst, imageIndices,
        i, j, k, x, ty, ty2,
        xOff, yOff, bx, by, t0, t1, t2, wt,
        r, g, b, coeffs, coeff,
        numPasses
    ;
    
    // pre-compute indices, 
    // reduce redundant computations inside the main convolution loop (faster)
    matA = [matrix2, matrix];
    indA = [ind2, ind1];
    coeffs = [coeff2, coeff1];
    
    bx = w-1; by = imArea-w;
    
    // one horizontal and one vertical pass
    numPasses = 2;
    while (numPasses--)
    {
        dst = new IMG(imLen);
        
        mat = matA[numPasses];
        indices = indA[numPasses];
        matArea = mat.length;
        matArea2 = indices.length;
        coeff = coeffs[numPasses];
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        imageIndices = new A16I(indices);
        for (k=0; k<matArea2; k+=2)
        { 
            imageIndices[k+1] *= w;
        } 
    
        // do direct convolution
        if (notSupportClamp)
        {   
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=0; g=0; b=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                    }
                }
                
                // output
                t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                
                // clamp them manually
                t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
        }
        else
        {
            x=0; ty=0;
            for (i=0; i<imLen; i+=4, x++)
            {
                // update image coordinates
                if (x>=w) { x=0; ty+=w; }
                
                // calculate the weighed sum of the source image pixels that
                // fall under the convolution matrix
                r=0; g=0; b=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                    }
                }
                
                // output
                t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
        }
        
        // do another pass??
        im = dst;
    }
    return dst;
}
/*
// some common convolution cases can be handled faster (3x3)
function convolution3(im, w, h, matrix, matrix2, coeff1, coeff2, _isGrad) 
{
    return im;
}
*/
}(FILTER);/**
*
* Morphological Filter(s)
*
* Applies morphological processing to target image
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// used for internal purposes
var IMG = FILTER.ImArray, STRUCT = FILTER.Array8U, A32I = FILTER.Array32I, Sqrt = Math.sqrt,
    
    // return a box structure element
    box = function(d) {
        var i, size=d*d, ones=new STRUCT(size);
        for (i=0; i<size; i++) ones[i]=1;
        return ones;
    },
    
    box3 = box(3),
    
    Filters
;


//
//
//  Morphological Filter
var MorphologicalFilter = FILTER.MorphologicalFilter = FILTER.Class( FILTER.Filter, {
    name: "MorphologicalFilter"
    
    ,constructor: function( ) {
        var self = this;
        self.$super('constructor');
        self._filterName = null;
        self._filter = null;
        self._dim = 0;
        self._structureElement = null;
        self._indices = null;
    }
    
    ,_filterName: null
    ,_filter: null
    ,_dim: 0
    ,_structureElement: null
    ,_indices: null
    
    ,dispose: function( ) {
        var self = this;
        
        self.$super('dispose');
        
        self._filterName = null;
        self._filter = null;
        self._dim = null;
        self._structureElement = null;
        self._indices = null;
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _filterName: self._filterName
                ,_dim: self._dim
                ,_structureElement: self._structureElement
                ,_indices: self._indices
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._dim = params._dim;
            self._structureElement = params._structureElement;
            self._indices = params._indices;
            self._filterName = params._filterName;
            if ( self._filterName && Filters[ self._filterName ] )
                self._filter = Filters[ self._filterName ];
        }
        return self;
    }
    
    ,erode: function( structureElement ) { 
        return this.set( structureElement, "erode" );
    }
    
    ,dilate: function( structureElement ) { 
        return this.set( structureElement, "dilate" );
    }
    
    ,opening: function( structureElement ) { 
        return this.set( structureElement, "open" );
    }
    
    ,closing: function( structureElement ) { 
        return this.set( structureElement, "close" );
    }
    
    ,set: function( structureElement, filtName ) {
        var self = this;
        self._filterName = filtName;
        self._filter = Filters[ filtName ];
        if ( structureElement && structureElement.length )
        {
            // structure Element given
            self._structureElement = new STRUCT( structureElement );
            self._dim = ~~(Sqrt(self._structureElement.length)+0.5);
        }
        else if (structureElement && structureElement===(structureElement-0))
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
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        var Indices=[], k, x, y,
            structureElement=self._structureElement, 
            matArea=structureElement.length, matRadius=self._dim, matHalfSide=(matRadius>>1);
        x=0; y=0; k=0;
        while (k<matArea)
        { 
            // allow a general structuring element instead of just a box
            if (structureElement[k])
            {
                Indices.push(x-matHalfSide); 
                Indices.push(y-matHalfSide);
            }
            k++; x++; if (x>=matRadius) { x=0; y++; }
        }
        self._indices = new A32I(Indices);
        
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self._filterName = null; 
        self._filter = null; 
        self._dim = 0; 
        self._structureElement = null; 
        self._indices = null;
        return self;
    }
    
    // used for internal purposes
    ,_apply: function( im, w, h ) {
        var self = this;
        if ( !self._isOn || !self._dim || !self._filter )  return im;
        return self._filter( self, im, w, h );
    }
        
    ,canRun: function( ) {
        return this._isOn && this._dim && this._filter;
    }
});

//
//
// private methods

Filters = {
    "dilate": function( self, im, w, h ) {
        var 
            structureElement=self._structureElement,
            matArea=structureElement.length, //matRadius*matRadius,
            matRadius=self._dim, imageIndices=new A32I(self._indices), 
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
            bx=w-1, by=imArea-w
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (k=0; k<coverArea2; k+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[k+1]*=w;
        }
        
        x=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            rM=0; gM=0; bM=0; 
            for (j=0; j<coverArea; j+=2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r>rM) rM=r; if (g>gM) gM=g; if (b>bM) bM=b;
                }
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM;  dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        return dst;
    }
    
    ,"erode": function( self, im, w, h ) {
        var 
            structureElement=self._structureElement,
            matArea=structureElement.length, //matRadius*matRadius,
            matRadius=self._dim, imageIndices=new A32I(self._indices), 
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
            bx=w-1, by=imArea-w
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (k=0; k<coverArea2; k+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[k+1]*=w;
        }
        
        x=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            for (j=0; j<coverArea; j+=2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        return dst;
    }
    
    // dilation of erotion
    ,"open": function( self, im, w, h ) {
        var 
            structureElement=self._structureElement,
            matArea=structureElement.length, //matRadius*matRadius,
            matRadius=self._dim, imageIndices=new A32I(self._indices), 
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
            bx=w-1, by=imArea-w
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (k=0; k<coverArea2; k+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[k+1]*=w;
        }
        
        // erode step
        x=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            for (j=0; j<coverArea; j+=2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        
        im = dst; dst = new IMG(imLen);
        
        // dilate step
        x=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            for (j=0; j<coverArea; j+=2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        return dst;
    }
    
    // erotion of dilation
    ,"close": function( self, im, w, h ) {
        var 
            structureElement=self._structureElement,
            matArea=structureElement.length, //matRadius*matRadius,
            matRadius=self._dim, imageIndices=new A32I(self._indices), 
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, k, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            coverArea2=imageIndices.length, coverArea=(coverArea2>>1), 
            bx=w-1, by=imArea-w
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (k=0; k<coverArea2; k+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[k+1]*=w;
        }
        
        // dilate step
        x=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            for (j=0; j<coverArea; j+=2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        
        im = dst; dst = new IMG(imLen);
        
        // erode step
        x=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; ty+=w; }
            
            // calculate the image pixels that
            // fall under the structure matrix
            rM=255; gM=255; bM=255; 
            for (j=0; j<coverArea; j+=2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
        }
        return dst;
    }
};

}(FILTER);/**
*
* Statistical Filter(s)
*
* Applies statistical filtering/processing to target image
*
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// used for internal purposes
var IMG=FILTER.ImArray, A32I=FILTER.Array32I,
    Min=Math.min, Max=Math.max, Filters;
    
//
//
//  Statistical Filter
var StatisticalFilter = FILTER.StatisticalFilter = FILTER.Class( FILTER.Filter, {
    name: "StatisticalFilter"
    
    ,constructor: function( ) {
        var self = this;
        self.$super('constructor');
        self._dim = 0;
        self._indices = null;
        self._filterName = null;
        self._filter = null;
    }
    
    ,_dim: 0
    ,_indices: null
    ,_filter: null
    ,_filterName: null
    
    ,dispose: function( ) {
        var self = this;
        
        self.$super('dispose');
        
        self._dim = null;
        self._indices = null;
        self._filter = null;
        self._filterName = null;
        
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _filterName: self._filterName
                ,_dim: self._dim
                ,_indices: self._indices
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._dim = params._dim;
            self._indices = params._indices;
            self._filterName = params._filterName;
            if ( self._filterName && Filters[ self._filterName ] )
                self._filter = Filters[ self._filterName ];
        }
        return self;
    }
    
    ,median: function( d ) { 
        // allow only odd dimensions for median
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        return this.set( d, "median" );
    }
    
    ,minimum: function( d ) { 
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        return this.set( d, "minimum" );
    }
    
    ,maximum: function( d ) { 
        d = ( d === undef ) ? 3 : ((d%2) ? d : d+1);
        return this.set( d, "maximum" );
    }
    
    ,set: function( d, filt ) {
        var self = this;
        self._filterName = filt; 
        self._filter = Filters[ filt ]; 
        self._dim = d; 
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        var Indices=[], k, x, y,
            matArea=d*d, matRadius=d, matHalfSide=(matRadius>>1);
        x=0; y=0; k=0;
        while (k<matArea)
        { 
            Indices.push(x-matHalfSide); 
            Indices.push(y-matHalfSide);
            k++; x++; if (x>=matRadius) { x=0; y++; }
        }
        self._indices = new A32I(Indices);
        
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self._filterName = null; 
        self._filter = null; 
        self._dim = 0; 
        self._indices = null;
        return self;
    }
    
    // used for internal purposes
    ,_apply: function(im, w, h) {
        var self = this;
        if ( !self._isOn || !self._dim )  return im;
        return self._filter( self, im, w, h );
    }
        
    ,canRun: function( ) {
        return this._isOn && this._dim;
    }
});
// aliiases
StatisticalFilter.prototype.erode = StatisticalFilter.prototype.minimum;
StatisticalFilter.prototype.dilate = StatisticalFilter.prototype.maximum;


//
//
// private methods
Filters = {
    "median": function( self, im, w, h ) {
        var 
            matRadius=self._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, 
            imageIndices=new A32I(self._indices),
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, j2, x, ty, xOff, yOff, srcOff, 
            rM, gM, bM, r, g, b,
            medianR, medianG, medianB, len, len2,
            isOdd, matArea2=matArea<<1, bx=w-1, by=imArea-w
        ;
        
        rM = []; //new Array(matArea);
        gM = []; //new Array(matArea);
        bM = []; //new Array(matArea);
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (j=0; j<matArea2; j+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[j+1]*=w;
        }
        
        i=0; x=0; ty=0; 
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            rM.length=0; gM.length=0; bM.length=0; 
            j=0; //j2=0;
            while (j < matArea2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2]; 
                    rM.push(r); gM.push(g); bM.push(b);
                }
                j+=2; //j2+=1;
            }
            
            // sort them, this is SLOW, alternative implementation needed
            rM.sort(); gM.sort(); bM.sort();
            len=rM.length; len2=len>>1;
            medianR=(len%2) ? rM[len2+1] : ~~(0.5*(rM[len2] + rM[len2+1]));
            len=gM.length; len2=len>>1;
            medianG=(len%2) ? gM[len2+1] : ~~(0.5*(gM[len2] + gM[len2+1]));
            len=bM.length; len2=len>>1;
            medianB=(len%2) ? bM[len2+1] : ~~(0.5*(bM[len2] + bM[len2+1]));
            
            // output
            dst[i] = medianR;  dst[i+1] = medianG;   dst[i+2] = medianB;  
            dst[i+3] = im[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    }
    
    ,"maximum": function( self, im, w, h ) {
        var 
            matRadius=self._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, 
            imageIndices=new A32I(self._indices),
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            matArea2=matArea<<1, bx=w-1, by=imArea-w
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (j=0; j<matArea2; j+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[j+1]*=w;
        }
        
        i=0; x=0; ty=0;
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            rM=0; gM=0; bM=0; 
            j=0;
            while (j < matArea2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r>rM) rM=r; if (g>gM) gM=g; if (b>bM) bM=b;
                }
                j+=2;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM;  dst[i+2] = bM;  dst[i+3] = im[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    }
    
    ,"minimum": function( self, im, w, h ) {
        var 
            matRadius=self._dim, matHalfSide=matRadius>>1, matArea=matRadius*matRadius, 
            imageIndices=new A32I(self._indices),
            imLen=im.length, imArea=(imLen>>2), dst=new IMG(imLen),
            i, j, x, ty, xOff, yOff, srcOff, r, g, b, rM, gM, bM,
            matArea2=matArea<<1, bx=w-1, by=imArea-w
        ;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        for (j=0; j<matArea2; j+=2)
        { 
            // translate to image dimensions
            // the y coordinate
            imageIndices[j+1]*=w;
        }
        
        i=0; x=0; ty=0;
        while (i<imLen)
        {
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            rM=255; gM=255; bM=255; 
            j=0;
            while (j < matArea2)
            {
                xOff=x + imageIndices[j]; yOff=ty + imageIndices[j+1];
                if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                {
                    srcOff=(xOff + yOff)<<2;
                    r=im[srcOff]; g=im[srcOff+1]; b=im[srcOff+2];
                    if (r<rM) rM=r; if (g<gM) gM=g; if (b<bM) bM=b;
                }
                j+=2;
            }
            
            // output
            dst[i] = rM;  dst[i+1] = gM; dst[i+2] = bM;  dst[i+3] = im[i+3];
            
            // update image coordinates
            i+=4; x++; if (x>=w) { x=0; ty+=w; }
        }
        return dst;
    }
};

}(FILTER);    
    /* main code ends here */
    /* export the module */
    return exports["FILTER"];
});
/**
*
*   FILTER.js Plugins
*   @version: 0.7
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Plugins)
*   https://github.com/foo123/FILTER.js
*
**/!function ( root, name, deps, factory ) {
    "use strict";
    
    //
    // export the module umd-style (with deps bundled-in or external)
    
    // Get current filename/path
    function getPath( isNode, isWebWorker, isAMD, isBrowser, amdMod ) 
    {
        var f;
        if (isNode) return {file:__filename, path:__dirname};
        else if (isWebWorker) return {file:(f=self.location.href), path:f.split('/').slice(0, -1).join('/')};
        else if (isAMD&&amdMod&&amdMod.uri)  return {file:(f=amdMod.uri), path:f.split('/').slice(0, -1).join('/')};
        else if (isBrowser&&(f=document.getElementsByTagName('script'))&&f.length) return {file:(f=f[f.length - 1].src), path:f.split('/').slice(0, -1).join('/')};
        return {file:null,  path:null};
    }
    function getDeps( names, paths, deps, depsType, require/*offset*/ )
    {
        //offset = offset || 0;
        var i, dl = names.length, mods = new Array( dl );
        for (i=0; i<dl; i++) 
            mods[ i ] = (1 === depsType)
                    ? /* node */ (deps[ names[ i ] ] || require( paths[ i ] )) 
                    : (2 === depsType ? /* amd args */ /*(deps[ i + offset ])*/ (require( names[ i ] )) : /* globals */ (deps[ names[ i ] ]))
                ;
        return mods;
    }
    // load javascript(s) (a)sync using <script> tags if browser, or importScripts if worker
    function loadScripts( scope, base, names, paths, callback, imported )
    {
        var dl = names.length, i, rel, t, load, next, head, link;
        if ( imported )
        {
            for (i=0; i<dl; i++) if ( !(names[ i ] in scope) ) importScripts( base + paths[ i ] );
            return callback( );
        }
        head = document.getElementsByTagName("head")[ 0 ]; link = document.createElement( 'a' );
        rel = /^\./; t = 0; i = 0;
        load = function( url, cb ) {
            var done = 0, script = document.createElement('script');
            script.type = 'text/javascript'; script.language = 'javascript';
            script.onload = script.onreadystatechange = function( ) {
                if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete'))
                {
                    done = 1; script.onload = script.onreadystatechange = null;
                    cb( );
                    head.removeChild( script ); script = null;
                }
            }
            if ( rel.test( url ) ) 
            {
                // http://stackoverflow.com/a/14781678/3591273
                // let the browser generate abs path
                link.href = base + url;
                url = link.protocol + "//" + link.host + link.pathname + link.search + link.hash;
            }
            // load it
            script.src = url; head.appendChild( script );
        };
        next = function( ) {
            if ( names[ i ] in scope )
            {
                if ( ++i >= dl ) callback( );
                else if ( names[ i ] in scope ) next( ); 
                else load( paths[ i ], next );
            }
            else if ( ++t < 30 ) { setTimeout( next, 30 ); }
            else { t = 0; i++; next( ); }
        };
        while ( i < dl && (names[ i ] in scope) ) i++;
        if ( i < dl ) load( paths[ i ], next );
        else callback( );
    }
    
    deps = deps || [[],[]];
    
    var isNode = ("undefined" !== typeof global) && ("[object global]" === {}.toString.call(global)),
        isBrowser = !isNode && ("undefined" !== typeof navigator), 
        isWebWorker = !isNode && ("function" === typeof importScripts) && (navigator instanceof WorkerNavigator),
        isAMD = ("function" === typeof define) && define.amd,
        isCommonJS = isNode && ("object" === typeof module) && module.exports,
        currentGlobal = isWebWorker ? self : root, currentPath = getPath( isNode, isWebWorker, isAMD, isBrowser ), m,
        names = [].concat(deps[0]), paths = [].concat(deps[1]), dl = names.length, i, requireJSPath, ext_js = /\.js$/i
    ;
    
    // commonjs, node, etc..
    if ( isCommonJS ) 
    {
        module.$deps = module.$deps || {};
        module.exports = module.$deps[ name ] = factory.apply( root, [{NODE:module}].concat(getDeps( names, paths, module.$deps, 1, require )) ) || 1;
    }
    
    // amd, requirejs, etc..
    else if ( isAMD && ("function" === typeof require) && ("function" === typeof require.specified) &&
        require.specified(name) ) 
    {
        if ( !require.defined(name) )
        {
            requireJSPath = { };
            for (i=0; i<dl; i++) 
                require.specified( names[ i ] ) || (requireJSPath[ names[ i ] ] = paths[ i ].replace(ext_js, ''));
            //requireJSPath[ name ] = currentPath.file.replace(ext_js, '');
            require.config({ paths: requireJSPath });
            // named modules, require the module by name given
            define( name, ["require", "exports", "module"].concat( names ), function( require, exports, module ) {
                return factory.apply( root, [{AMD:module}].concat(getDeps( names, paths, arguments, 2, require )) );
            });
        }
    }
    
    // browser, web worker, other loaders, etc.. + AMD optional
    else if ( !(name in currentGlobal) )
    {
        loadScripts( currentGlobal, currentPath.path + '/', names, paths, function( ){ 
            m = factory.apply( root, [{}].concat(getDeps( names, paths, currentGlobal )) ); 
            isAMD && define( name, ["require"], function( ){ return m; } );
        }, isWebWorker);
    }


}(  /* current root */          this, 
    /* module name */           "FILTER_PLUGINS",
    /* module dependencies */   [ ['FILTER'], ['./filter.js'] ], 
    /* module factory */        function( exports, FILTER ) {
        
    /* main code starts here */

/**
*
*   FILTER.js Plugins
*   @version: 0.7
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Plugins)
*   https://github.com/foo123/FILTER.js
*
**/
exports['FILTER_PLUGINS'] = FILTER;

/**
*
* Noise Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp=FILTER._notSupportClamp, rand=Math.random;

// a sample noise filter
// used for illustration purposes on how to create a plugin filter
FILTER.Create({
    name: "NoiseFilter"
    
    // parameters
    ,min: -127
    ,max: 127
    
    // this is the filter constructor
    ,init: function( min, max ) {
        var self = this;
        self.min = min||-127;
        self.max = max||127;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                min: self.min
                ,max: self.max
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.min = params.min;
            self.max = params.max;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var range=self.max-self.min, m=self.min,
            i, l=im.length, n, r, g, b, t0, t1, t2;
        
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
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            { 
                r = im[i]; g = im[i+1]; b = im[i+2];
                n = range*rand()+m;
                t0 = r+n; t1 = g+n; t2 = b+n; 
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Perlin Noise Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var FLOOR = Math.floor, sin = Math.sin, cos = Math.cos, PI2 = FILTER.CONSTANTS.PI2;
 
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
var p = new FILTER.Array8U([151,160,137,91,90,15,
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
]), perm = new FILTER.Array8U(p); // copy it initially

// This isn't a very good seeding function, but it works ok. It supports 2^16
// different seed values. Write something better if you need more seeds.
function seed( seed ) 
{
    var v, i;
    // Scale the seed out
    if ( seed > 0 && seed < 1 ) seed *= 65536;

    seed = FLOOR( seed );
    if ( seed < 256 ) seed |= seed << 8;
    for (i = 0; i < 256; i++) 
    {
        v = ( i & 1 ) ? (p[i] ^ (seed & 255)) : (p[i] ^ ((seed>>8) & 255));
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

function grad1( hash, x ) 
{
    var h = hash & 15;
    var grad = 1.0 + (h & 7);   // Gradient value 1.0, 2.0, ..., 8.0
    if (h&8) grad = -grad;         // Set a random sign for the gradient
    return ( grad * x );           // Multiply the gradient with the distance
}

function grad2( hash, x, y ) 
{
    var h = hash & 7;      // Convert low 3 bits of hash code
    var u = h<4 ? x : y;  // into 8 simple gradient directions,
    var v = h<4 ? y : x;  // and compute the dot product with (x,y).
    return ((h&1)? -u : u) + ((h&2)? -2.0*v : 2.0*v);
}

function grad3( hash, x, y, z ) 
{
    var h = hash & 15;     // Convert low 4 bits of hash code into 12 simple
    var u = h<8 ? x : y; // gradient directions, and compute dot product.
    var v = h<4 ? y : h==12||h==14 ? x : z; // Fix repeats at h = 12 to 15
    return ((h&1)? -u : u) + ((h&2)? -v : v);
}

function grad4( hash, x, y, z, t ) 
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
function simplex2( x, y ) 
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
    if ( x0>y0 ) {i1=1; j1=0;} // lower triangle, XY order: (0,0)->(1,0)->(1,1)
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
    if ( t0 < 0.0 ) n0 = 0.0;
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

// 4D simplex noise
function simplex4( x, y, z, w ) 
{
    // The skewing and unskewing factors are hairy again for the 4D case
    var F4 = 0.309016994; // F4 = (Math.sqrt(5.0)-1.0)/4.0
    var G4 = 0.138196601; // G4 = (5.0-Math.sqrt(5.0))/20.0
    
    var n0, n1, n2, n3, n4; // Noise contributions from the five corners

    // Skew the (x,y,z,w) space to determine which cell of 24 simplices we're in
    var s = (x + y + z + w) * F4; // Factor for 4D skewing
    var xs = x + s;
    var ys = y + s;
    var zs = z + s;
    var ws = w + s;
    var i = FLOOR(xs);
    var j = FLOOR(ys);
    var k = FLOOR(zs);
    var l = FLOOR(ws);

    var t = (i + j + k + l) * G4; // Factor for 4D unskewing
    var X0 = i - t; // Unskew the cell origin back to (x,y,z,w) space
    var Y0 = j - t;
    var Z0 = k - t;
    var W0 = l - t;

    var x0 = x - X0;  // The x,y,z,w distances from the cell origin
    var y0 = y - Y0;
    var z0 = z - Z0;
    var w0 = w - W0;

    // For the 4D case, the simplex is a 4D shape I won't even try to describe.
    // To find out which of the 24 possible simplices we're in, we need to
    // determine the magnitude ordering of x0, y0, z0 and w0.
    // The method below is a good way of finding the ordering of x,y,z,w and
    // then find the correct traversal order for the simplex we’re in.
    // First, six pair-wise comparisons are performed between each possible pair
    // of the four coordinates, and the results are used to add up binary bits
    // for an integer index.
    var c1 = (x0 > y0) ? 32 : 0;
    var c2 = (x0 > z0) ? 16 : 0;
    var c3 = (y0 > z0) ? 8 : 0;
    var c4 = (x0 > w0) ? 4 : 0;
    var c5 = (y0 > w0) ? 2 : 0;
    var c6 = (z0 > w0) ? 1 : 0;
    var c = c1 + c2 + c3 + c4 + c5 + c6;

    var i1, j1, k1, l1; // The integer offsets for the second simplex corner
    var i2, j2, k2, l2; // The integer offsets for the third simplex corner
    var i3, j3, k3, l3; // The integer offsets for the fourth simplex corner

    // simplex[c] is a 4-vector with the numbers 0, 1, 2 and 3 in some order.
    // Many values of c will never occur, since e.g. x>y>z>w makes x<z, y<w and x<w
    // impossible. Only the 24 indices which have non-zero entries make any sense.
    // We use a thresholding to set the coordinates in turn from the largest magnitude.
    // The number 3 in the "simplex" array is at the position of the largest coordinate.
    i1 = simplex[c][0]>=3 ? 1 : 0;
    j1 = simplex[c][1]>=3 ? 1 : 0;
    k1 = simplex[c][2]>=3 ? 1 : 0;
    l1 = simplex[c][3]>=3 ? 1 : 0;
    // The number 2 in the "simplex" array is at the second largest coordinate.
    i2 = simplex[c][0]>=2 ? 1 : 0;
    j2 = simplex[c][1]>=2 ? 1 : 0;
    k2 = simplex[c][2]>=2 ? 1 : 0;
    l2 = simplex[c][3]>=2 ? 1 : 0;
    // The number 1 in the "simplex" array is at the second smallest coordinate.
    i3 = simplex[c][0]>=1 ? 1 : 0;
    j3 = simplex[c][1]>=1 ? 1 : 0;
    k3 = simplex[c][2]>=1 ? 1 : 0;
    l3 = simplex[c][3]>=1 ? 1 : 0;
    // The fifth corner has all coordinate offsets = 1, so no need to look that up.

    var x1 = x0 - i1 + G4; // Offsets for second corner in (x,y,z,w) coords
    var y1 = y0 - j1 + G4;
    var z1 = z0 - k1 + G4;
    var w1 = w0 - l1 + G4;
    var x2 = x0 - i2 + 2.0*G4; // Offsets for third corner in (x,y,z,w) coords
    var y2 = y0 - j2 + 2.0*G4;
    var z2 = z0 - k2 + 2.0*G4;
    var w2 = w0 - l2 + 2.0*G4;
    var x3 = x0 - i3 + 3.0*G4; // Offsets for fourth corner in (x,y,z,w) coords
    var y3 = y0 - j3 + 3.0*G4;
    var z3 = z0 - k3 + 3.0*G4;
    var w3 = w0 - l3 + 3.0*G4;
    var x4 = x0 - 1.0 + 4.0*G4; // Offsets for last corner in (x,y,z,w) coords
    var y4 = y0 - 1.0 + 4.0*G4;
    var z4 = z0 - 1.0 + 4.0*G4;
    var w4 = w0 - 1.0 + 4.0*G4;

    // Wrap the integer indices at 256, to avoid indexing perm[] out of bounds
    var ii = i & 0xff;
    var jj = j & 0xff;
    var kk = k & 0xff;
    var ll = l & 0xff;

    // Calculate the contribution from the five corners
    var t0 = 0.5 - x0*x0 - y0*y0 - z0*z0 - w0*w0; // needs 0.5 here
    if ( t0 < 0.0 ) n0 = 0.0;
    else 
    {
        t0 *= t0;
        n0 = t0 * t0 * grad4(perm[ii+perm[jj+perm[kk+perm[ll]]]], x0, y0, z0, w0);
    }

    var t1 = 0.5 - x1*x1 - y1*y1 - z1*z1 - w1*w1; // needs 0.5 here
    if ( t1 < 0.0 ) n1 = 0.0;
    else 
    {
        t1 *= t1;
        n1 = t1 * t1 * grad4(perm[ii+i1+perm[jj+j1+perm[kk+k1+perm[ll+l1]]]], x1, y1, z1, w1);
    }

    var t2 = 0.5 - x2*x2 - y2*y2 - z2*z2 - w2*w2; // needs 0.5 here
    if ( t2 < 0.0 ) n2 = 0.0;
    else 
    {
        t2 *= t2;
        n2 = t2 * t2 * grad4(perm[ii+i2+perm[jj+j2+perm[kk+k2+perm[ll+l2]]]], x2, y2, z2, w2);
    }

    var t3 = 0.5 - x3*x3 - y3*y3 - z3*z3 - w3*w3; // needs 0.5 here
    if ( t3 < 0.0 ) n3 = 0.0;
    else 
    {
        t3 *= t3;
        n3 = t3 * t3 * grad4(perm[ii+i3+perm[jj+j3+perm[kk+k3+perm[ll+l3]]]], x3, y3, z3, w3);
    }

    var t4 = 0.5 - x4*x4 - y4*y4 - z4*z4 - w4*w4; // needs 0.5 here
    if ( t4 < 0.0 ) n4 = 0.0;
    else 
    {
        t4 *= t4;
        n4 = t4 * t4 * grad4(perm[ii+1+perm[jj+1+perm[kk+1+perm[ll+1]]]], x4, y4, z4, w4);
    }

    // Sum up and scale the result to cover the range [-1,1]
    return 27.0 * (n0 + n1 + n2 + n3 + n4); // TODO: The scale factor is preliminary!
}

// This is the new and improved, C(2) continuous interpolant
function FADE(t) { return t * t * t * ( t * ( t * 6 - 15 ) + 10 ); }
function LERP(t, a, b) { return a + t*(b-a); }

// 2D float Perlin noise.
function perlin2( x, y )
{
    var ix0, iy0, ix1, iy1;
    var fx0, fy0, fx1, fy1;
    var s, t, nx0, nx1, n0, n1;

    ix0 = FLOOR( x ); // Integer part of x
    iy0 = FLOOR( y ); // Integer part of y
    fx0 = x - ix0;        // Fractional part of x
    fy0 = y - iy0;        // Fractional part of y
    fx1 = fx0 - 1.0;
    fy1 = fy0 - 1.0;
    ix1 = (ix0 + 1) & 0xff;  // Wrap to 0..255
    iy1 = (iy0 + 1) & 0xff;
    ix0 = ix0 & 0xff;
    iy0 = iy0 & 0xff;
    
    t = FADE( fy0 );
    s = FADE( fx0 );

    nx0 = grad2(perm[ix0 + perm[iy0]], fx0, fy0);
    nx1 = grad2(perm[ix0 + perm[iy1]], fx0, fy1);
    n0 = LERP( t, nx0, nx1 );

    nx0 = grad2(perm[ix1 + perm[iy0]], fx1, fy0);
    nx1 = grad2(perm[ix1 + perm[iy1]], fx1, fy1);
    n1 = LERP(t, nx0, nx1);

    return 0.507 * ( LERP( s, n0, n1 ) );
}

// 4D float Perlin noise.
function perlin4( x, y, z, w )
{
    var ix0, iy0, iz0, iw0, ix1, iy1, iz1, iw1;
    var fx0, fy0, fz0, fw0, fx1, fy1, fz1, fw1;
    var s, t, r, q;
    var nxyz0, nxyz1, nxy0, nxy1, nx0, nx1, n0, n1;

    ix0 = FLOOR( x ); // Integer part of x
    iy0 = FLOOR( y ); // Integer part of y
    iz0 = FLOOR( z ); // Integer part of y
    iw0 = FLOOR( w ); // Integer part of w
    fx0 = x - ix0;        // Fractional part of x
    fy0 = y - iy0;        // Fractional part of y
    fz0 = z - iz0;        // Fractional part of z
    fw0 = w - iw0;        // Fractional part of w
    fx1 = fx0 - 1.0;
    fy1 = fy0 - 1.0;
    fz1 = fz0 - 1.0;
    fw1 = fw0 - 1.0;
    ix1 = ( ix0 + 1 ) & 0xff;  // Wrap to 0..255
    iy1 = ( iy0 + 1 ) & 0xff;
    iz1 = ( iz0 + 1 ) & 0xff;
    iw1 = ( iw0 + 1 ) & 0xff;
    ix0 = ix0 & 0xff;
    iy0 = iy0 & 0xff;
    iz0 = iz0 & 0xff;
    iw0 = iw0 & 0xff;

    q = FADE( fw0 );
    r = FADE( fz0 );
    t = FADE( fy0 );
    s = FADE( fx0 );

    nxyz0 = grad4(perm[ix0 + perm[iy0 + perm[iz0 + perm[iw0]]]], fx0, fy0, fz0, fw0);
    nxyz1 = grad4(perm[ix0 + perm[iy0 + perm[iz0 + perm[iw1]]]], fx0, fy0, fz0, fw1);
    nxy0 = LERP( q, nxyz0, nxyz1 );
        
    nxyz0 = grad4(perm[ix0 + perm[iy0 + perm[iz1 + perm[iw0]]]], fx0, fy0, fz1, fw0);
    nxyz1 = grad4(perm[ix0 + perm[iy0 + perm[iz1 + perm[iw1]]]], fx0, fy0, fz1, fw1);
    nxy1 = LERP( q, nxyz0, nxyz1 );
        
    nx0 = LERP ( r, nxy0, nxy1 );

    nxyz0 = grad4(perm[ix0 + perm[iy1 + perm[iz0 + perm[iw0]]]], fx0, fy1, fz0, fw0);
    nxyz1 = grad4(perm[ix0 + perm[iy1 + perm[iz0 + perm[iw1]]]], fx0, fy1, fz0, fw1);
    nxy0 = LERP( q, nxyz0, nxyz1 );
        
    nxyz0 = grad4(perm[ix0 + perm[iy1 + perm[iz1 + perm[iw0]]]], fx0, fy1, fz1, fw0);
    nxyz1 = grad4(perm[ix0 + perm[iy1 + perm[iz1 + perm[iw1]]]], fx0, fy1, fz1, fw1);
    nxy1 = LERP( q, nxyz0, nxyz1 );

    nx1 = LERP ( r, nxy0, nxy1 );

    n0 = LERP( t, nx0, nx1 );

    nxyz0 = grad4(perm[ix1 + perm[iy0 + perm[iz0 + perm[iw0]]]], fx1, fy0, fz0, fw0);
    nxyz1 = grad4(perm[ix1 + perm[iy0 + perm[iz0 + perm[iw1]]]], fx1, fy0, fz0, fw1);
    nxy0 = LERP( q, nxyz0, nxyz1 );
        
    nxyz0 = grad4(perm[ix1 + perm[iy0 + perm[iz1 + perm[iw0]]]], fx1, fy0, fz1, fw0);
    nxyz1 = grad4(perm[ix1 + perm[iy0 + perm[iz1 + perm[iw1]]]], fx1, fy0, fz1, fw1);
    nxy1 = LERP( q, nxyz0, nxyz1 );

    nx0 = LERP ( r, nxy0, nxy1 );

    nxyz0 = grad4(perm[ix1 + perm[iy1 + perm[iz0 + perm[iw0]]]], fx1, fy1, fz0, fw0);
    nxyz1 = grad4(perm[ix1 + perm[iy1 + perm[iz0 + perm[iw1]]]], fx1, fy1, fz0, fw1);
    nxy0 = LERP( q, nxyz0, nxyz1 );
        
    nxyz0 = grad4(perm[ix1 + perm[iy1 + perm[iz1 + perm[iw0]]]], fx1, fy1, fz1, fw0);
    nxyz1 = grad4(perm[ix1 + perm[iy1 + perm[iz1 + perm[iw1]]]], fx1, fy1, fz1, fw1);
    nxy1 = LERP( q, nxyz0, nxyz1 );

    nx1 = LERP ( r, nxy0, nxy1 );

    n1 = LERP( t, nx0, nx1 );

    return 0.87 * ( LERP( s, n0, n1 ) );
}

function basic_simplex2( x, y, w, h, baseX, baseY, offsetX, offsetY )
{
    return simplex2(((x+offsetX)%w)/baseX, ((y+offsetY)%h)/baseY);
}
function basic_perlin2( x, y, w, h, baseX, baseY, offsetX, offsetY )
{
    return perlin2(((x+offsetX)%w)/baseX, ((y+offsetY)%h)/baseY);
}
// adapted from: http://www.gamedev.net/blog/33/entry-2138456-seamless-noise/
function seamless_simplex2( x, y, w, h, baseX, baseY, offsetX, offsetY )
{
    var s = baseX*PI2*((x+offsetX)%w)/w, t = baseY*PI2*((y+offsetY)%h)/h,
        nx = w*cos(s)*PI2/baseX,
        ny = h*cos(t)*PI2/baseY,
        nz = w*sin(s)*PI2/baseX,
        nw = h*sin(t)*PI2/baseY
    ;
    return simplex4(nx,ny,nz,nw);
}
function seamless_perlin2( x, y, w, h, baseX, baseY, offsetX, offsetY )
{
    var s = PI2*((x+offsetX)%w)/w, t = PI2*((y+offsetY)%h)/h,
        nx = cos(s),
        ny = cos(t),
        nz = sin(s),
        nw = sin(t)
    ;
    return perlin4(nx,ny,nz,nw);
}
// adapted from: http://www.java-gaming.org/index.php?topic=31637.0
function octaved(noise, x, y, w, h, baseX, baseY, octaves, offsets, scale, roughness)
{
    var noiseSum = 0, layerFrequency = scale, layerWeight = 1, weightSum = 0, octave;

    for (octave = 0; octave < octaves; octave++) 
    {
        noiseSum += noise( x, y, w, h, baseX/layerFrequency, baseY/layerFrequency, offsets[octave][0], offsets[octave][1] ) * layerWeight;
        layerFrequency *= 2;
        weightSum += layerWeight;
        layerWeight *= roughness;
    }
    return noiseSum / weightSum;
}
/*function turbulence()
{
}*/


// an efficient perlin noise and simplex noise plugin
// http://en.wikipedia.org/wiki/Perlin_noise
FILTER.Create({
    name: "PerlinNoiseFilter"
    
    // parameters
    ,baseX: 1
    ,baseY: 1
    ,numOctaves: 1
    ,offsets: null
    ,colors: null
    ,_seed: 0
    ,_stitch: false
    ,_fractal: true
    ,_perlin: false
    
    // constructor
    ,init: function( baseX, baseY, octaves, stitch, fractal, offsets, colors, seed, perlin ) {
        var self = this;
        self.baseX = baseX || 1;
        self.baseY = baseY || 1;
        self.octaves( octaves||1, offsets );
        self.colors = colors || null;
        self._seed = seed || 0;
        self._stitch = !!stitch;
        self._fractal = false !== fractal;
        self._perlin = !!perlin;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,seed: function( randSeed ) {
        var self = this;
        seed( self._seed = randSeed || 0 );
        return self;
    }
    
    ,octaves: function( numOctaves, offsets ) {
        var self = this;
        self.numOctaves = numOctaves || 1;
        self.offsets = !offsets ? [] : offsets.slice(0);
        while (self.offsets.length < self.numOctaves) self.offsets.push([0,0]);
        return self;
    }
    
    ,seamless: function( enabled ) {
        if ( !arguments.length ) enabled = true;
        this._stitch = !!enabled;
        return this;
    }
    
    ,turbulence: function( enabled ) {
        if ( !arguments.length ) enabled = true;
        this._fractal = !enabled;
        return this;
    }
    
    ,simplex: function( ) {
        this._perlin = false;
        return this;
    }
    
    ,perlin: function( ) {
        this._perlin = true;
        return this;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 baseX: self.baseX
                ,baseY: self.baseY
                ,numOctaves: self.numOctaves
                ,offsets: self.offsets
                ,colors: self.colors
                ,_seed: self._seed
                ,_stitch: self._stitch
                ,_fractal: self._fractal
                ,_perlin: self._perlin
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.baseX = params.baseX;
            self.baseY = params.baseY;
            self.numOctaves = params.numOctaves;
            self.offsets = params.offsets;
            self.colors = params.colors;
            self._seed = params._seed;
            self._stitch = params._stitch;
            self._fractal = params._fractal;
            self._perlin = params._perlin;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this, baseX = self.baseX, baseY = self.baseY,
            octaves = self.numOctaves, offsets = self.offsets,
            colors = self.colors, is_grayscale = !colors || !colors.length,
            is_perlin = self._perlin, is_turbulence = !self._fractal, is_seamless = self._stitch, 
            i, l = im.length, x, y, n, c, noise
        ;
        
        noise = is_perlin ? (is_seamless?seamless_perlin2:basic_perlin2) : (is_seamless?seamless_simplex2:basic_simplex2);
        // avoid unnecesary re-seeding ??
        //if ( self._seed ) seed( self._seed );
        
        x=0; y=0;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            n = 0.5*octaved(noise, x, y, w, h, baseX, baseY, octaves, offsets, 1.0, 0.5)+0.5;
            if ( is_grayscale )
            {
                im[i] = im[i+1] = im[i+2] = ~~(255*n);
            }
            else
            {
                c = colors[FLOOR(n*(colors.length-1))];
                im[i] = c[0]; im[i+1] = c[1]; im[i+2] = c[2];
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Histogram Equalize Plugin, Histogram Equalize for grayscale images Plugin, RGB Histogram Equalize Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F,
    RGB2YCbCr=FILTER.Color.RGB2YCbCr, YCbCr2RGB=FILTER.Color.YCbCr2RGB
    ;

// a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
FILTER.Create({
    name : "HistogramEqualizeFilter"
    
    ,path: FILTER.getPath( exports.AMD )
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var r,g,b, rangeI,  maxI = 0, minI = 255,
            cdfI, accum = 0, t0, t1, t2,
            i, y, l=im.length, l2=l>>2, n=1.0/(l2), ycbcr, rgba
        ;
        
        // initialize the arrays
        cdfI = new A32F(256);
        for (i=0; i<256; i+=4)
        { 
            // partial loop unrolling
            cdfI[i]=0; 
            cdfI[i+1]=0; 
            cdfI[i+2]=0; 
            cdfI[i+3]=0; 
        }
        
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            //r = im[i]; g = im[i+1]; b = im[i+2];
            ycbcr = RGB2YCbCr(im.subarray(i,i+3));
            r = im[i] = ~~ycbcr[2]; g = im[i+1] = ~~ycbcr[0]; b = im[i+2] = ~~ycbcr[1];
            cdfI[ g ] += n;
            
            if ( g>maxI ) maxI=g;
            else if ( g<minI ) minI=g;
        }
        
        // compute cdf
        accum = 0;
        for (i=0; i<256; i+=4)
        { 
            // partial loop unrolling
            accum += cdfI[i]; cdfI[i] = accum;
            accum += cdfI[i+1]; cdfI[i+1] = accum;
            accum += cdfI[i+2]; cdfI[i+2] = accum;
            accum += cdfI[i+3]; cdfI[i+3] = accum;
        }
        
        // equalize only the intesity channel
        rangeI = maxI-minI;
        if (notSupportClamp)
        {   
            for (i=0; i<l; i+=4)
            { 
                ycbcr = [im[i+1], im[i+2], im[i]];
                ycbcr[0] = cdfI[ycbcr[0]]*rangeI + minI;
                rgba = YCbCr2RGB(ycbcr);
                t0 = rgba[0]; t1 = rgba[1]; t2 = rgba[2]; 
                // clamp them manually
                t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            { 
                ycbcr = [im[i+1], im[i+2], im[i]];
                ycbcr[0] = cdfI[ycbcr[0]]*rangeI + minI;
                rgba = YCbCr2RGB(ycbcr);
                im[i] = ~~rgba[0]; im[i+1] = ~~rgba[1]; im[i+2] = ~~rgba[2]; 
            }
        }
        
        // return the new image data
        return im;
    }
});

// a simple grayscale histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
FILTER.Create({
    name: "GrayscaleHistogramEqualizeFilter"
    
    ,path: FILTER.getPath( exports.AMD )
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var c, g, rangeI, maxI=0, minI=255,
            cdfI, accum=0, t0, t1, t2,
            i, l=im.length, l2=l>>2, n=1.0/(l2)
            ;
        
        // initialize the arrays
        cdfI = new A32F(256);
        for (i=0; i<256; i+=4)
        { 
            // partial loop unrolling
            cdfI[i]=0; 
            cdfI[i+1]=0; 
            cdfI[i+2]=0; 
            cdfI[i+3]=0; 
        }
        
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            c = im[i];  // image is already grayscale
            cdfI[c] += n;
            
            if (c>maxI) maxI=c;
            else if (c<minI) minI=c;
        }
        
        // compute cdf
        accum = 0;
        for (i=0; i<256; i+=4)
        { 
            // partial loop unrolling
            accum += cdfI[i]; cdfI[i] = accum;
            accum += cdfI[i+1]; cdfI[i+1] = accum;
            accum += cdfI[i+2]; cdfI[i+2] = accum;
            accum += cdfI[i+3]; cdfI[i+3] = accum;
        }
        
        // equalize the grayscale/intesity channels
        rangeI = maxI-minI;
        if (notSupportClamp)
        {   
            for (i=0; i<l; i+=4)
            { 
                c = im[i]; // grayscale image has same value in all channels
                g = cdfI[c]*rangeI + minI;
                // clamp them manually
                g = (g<0) ? 0 : ((g>255) ? 255 : g);
                g = ~~g;
                im[i] = g; im[i+1] = g; im[i+2] = g; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            { 
                c = im[i]; // grayscale image has same value in all channels
                g = ~~( cdfI[c]*rangeI + minI );
                im[i] = g; im[i+1] = g; im[i+2] = g; 
            }
        }
        
        // return the new image data
        return im;
    }
});

// a sample RGB histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
// not the best implementation
// used for illustration purposes on how to create a plugin filter
FILTER.Create({
    name: "RGBHistogramEqualizeFilter"
    
    ,path: FILTER.getPath( exports.AMD )
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var r,g,b, rangeR, rangeG, rangeB,
            maxR=0, maxG=0, maxB=0, minR=255, minG=255, minB=255,
            cdfR, cdfG, cdfB,
            accumR, accumG, accumB, t0, t1, t2,
            i, l=im.length, l2=l>>2, n=1.0/(l2)
        ;
        
        // initialize the arrays
        cdfR=new A32F(256); cdfG=new A32F(256); cdfB=new A32F(256);
        for (i=0; i<256; i+=4)
        { 
            // partial loop unrolling
            cdfR[i]=0; cdfG[i]=0; cdfB[i]=0; 
            cdfR[i+1]=0; cdfG[i+1]=0; cdfB[i+1]=0; 
            cdfR[i+2]=0; cdfG[i+2]=0; cdfB[i+2]=0; 
            cdfR[i+3]=0; cdfG[i+3]=0; cdfB[i+3]=0; 
        }
        
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            r = im[i]; g = im[i+1]; b = im[i+2];
            cdfR[r] += n; cdfG[g] += n; cdfB[b] += n;
            
            if (r>maxR) maxR=r;
            else if (r<minR) minR=r;
            if (g>maxG) maxG=g;
            else if (g<minG) minG=g;
            if (b>maxB) maxB=b;
            else if (b<minB) minB=b;
        }
        
        // compute cdf
        accumR=accumG=accumB=0;
        for (i=0; i<256; i+=4)
        { 
            // partial loop unrolling
            accumR+=cdfR[i]; cdfR[i]=accumR; 
            accumG+=cdfG[i]; cdfG[i]=accumG; 
            accumB+=cdfB[i]; cdfB[i]=accumB; 
            accumR+=cdfR[i+1]; cdfR[i+1]=accumR; 
            accumG+=cdfG[i+1]; cdfG[i+1]=accumG; 
            accumB+=cdfB[i+1]; cdfB[i+1]=accumB; 
            accumR+=cdfR[i+2]; cdfR[i+2]=accumR; 
            accumG+=cdfG[i+2]; cdfG[i+2]=accumG; 
            accumB+=cdfB[i+2]; cdfB[i+2]=accumB; 
            accumR+=cdfR[i+3]; cdfR[i+3]=accumR; 
            accumG+=cdfG[i+3]; cdfG[i+3]=accumG; 
            accumB+=cdfB[i+3]; cdfB[i+3]=accumB; 
        }
        
        // equalize each channel separately
        rangeR=maxR-minR; rangeG=maxG-minG; rangeB=maxB-minB;
        if (notSupportClamp)
        {   
            for (i=0; i<l; i+=4)
            { 
                r = im[i]; g = im[i+1]; b = im[i+2]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                // clamp them manually
                t0 = (t0<0) ? 0 : ((t0>255) ? 255 : t0);
                t1 = (t1<0) ? 0 : ((t1>255) ? 255 : t1);
                t2 = (t2<0) ? 0 : ((t2>255) ? 255 : t2);
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            { 
                r = im[i]; g = im[i+1]; b = im[i+2]; 
                t0 = cdfR[r]*rangeR + minR; t1 = cdfG[g]*rangeG + minG; t2 = cdfB[b]*rangeB + minB; 
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Pixelate Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var Sqrt=Math.sqrt,
    notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F;


// a sample fast pixelate filter
FILTER.Create({
    name: "PixelateFilter"
    
    // parameters
    ,scale: 1
    
    // this is the filter constructor
    ,init: function( scale ) {
        var self = this;
        self.scale = scale || 1;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                scale: self.scale
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.scale = params.scale;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        var self = this;
        if (!self._isOn || self.scale<=1) return im;
        if (self.scale>100) self.scale=100;
        
        var imLen = im.length, imArea = (imLen>>>2),
            step, stepw, hstep, wstep, hstepw, wRem, hRem,
            inv_size, inv_size1, inv_size1w, inv_size1h, inv_size1hw, 
            inv_sizes, inv_sizew, inv_sizeh, inv_sizewh,
            integral, colR, colG, colB,
            rowLen = (w<<1) + w, imageIndicesX, imageIndicesY,
            i, j, x, y, yw, px, py, pyw, pi,
            xOff1, yOff1, xOff2, yOff2, 
            bx1, by1, bx2, by2, 
            p1, p2, p3, p4, r, g, b
        ;
        
        step = ~~(Sqrt(imArea)*self.scale*0.01);
        stepw = w*step; hstep = (h%step); wstep = (w%step); hstepw = (hstep-1)*w;
        inv_size1 = 1.0/(step*step); inv_size1w = 1.0/(wstep*step); inv_size1h = 1.0/(hstep*step); inv_size1hw = 1.0/(wstep*hstep);
        inv_sizes = inv_size1; inv_sizew = inv_size1w; inv_sizeh = inv_size1h; inv_sizewh = inv_size1hw;
        
        // pre-compute indices, 
        // reduce redundant computations inside the main convolution loop (faster)
        imageIndicesX = step-1; imageIndicesY = (step-1)*w;
        bx1=0; bx2=w-1; by1=0; by2=imArea-w;
        
        // compute integral image in one pass
        integral = new A32F(imArea*3);
        // first row
        i=0; j=0; x=0; colR=colG=colB=0;
        for (x=0; x<w; x++, i+=4, j+=3)
        {
            colR += im[i]; colG += im[i+1]; colB += im[i+2];
            integral[j] = colR; integral[j+1] = colG; integral[j+2] = colB;
        }
        // other rows
        j=0; x=0; colR=colG=colB=0;
        for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
        {
            if (x>=w) { x=0; colR=colG=colB=0; }
            colR += im[i]; colG += im[i+1]; colB += im[i+2];
            integral[j+rowLen] = integral[j] + colR; 
            integral[j+rowLen+1] = integral[j+1] + colG;  
            integral[j+rowLen+2] = integral[j+2] + colB;
        }
        
        // first block
        x=0; y=0; yw=0;
        // calculate the weighed sum of the source image pixels that
        // fall under the pixelate convolution matrix
        xOff1 = x; yOff1 = yw;  
        xOff2 = xOff1 + imageIndicesX; yOff2 = yOff1 + imageIndicesY;
        
        // fix borders
        xOff2 = (xOff2>bx2) ? bx2 : xOff2;
        yOff2 = (yOff2>by2) ? by2 : yOff2;
        
        // compute integral positions
        p1=(xOff1 + yOff1); p4=(xOff2+yOff2); p2=(xOff2 + yOff1); p3=(xOff1 + yOff2);
        p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
        
        // compute matrix sum of these elements
        // maybe using a gaussian average could be better (but more computational) ??
        inv_size = inv_sizes;
        r = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
        g = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
        b = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
        
        if (notSupportClamp)
        {   
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        r = ~~r;  g = ~~g;  b = ~~b; // alpha channel is not transformed
        
        // do direct pixelate convolution
        px=0; py=0; pyw=0;
        for (i=0; i<imLen; i+=4)
        {
            // output
            // replace the area equal to the given pixelate size
            // with the average color, computed in previous step
            pi = (px+x + pyw+yw)<<2;
            im[pi] = r;  im[pi+1] = g;  im[pi+2] = b; 
            
            // next pixel
            px++; if ( px+x >= w || px >= step ) { px=0; py++; pyw+=w; }
            
            // next block
            if (py+y >= h || py >= step)
            {
                // update image coordinates
                x+=step; if ( x>=w ) { x=0; y+=step; yw+=stepw; }
                px=0; py=0; pyw=0;
                
                // calculate the weighed sum of the source image pixels that
                // fall under the pixelate convolution matrix
                xOff1 = x; yOff1 = yw;  
                xOff2 = xOff1 + imageIndicesX; yOff2 = yOff1 + imageIndicesY;
                
                // fix borders
                xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                yOff2 = (yOff2>by2) ? by2 : yOff2;
                
                // compute integral positions
                p1=(xOff1 + yOff1); p4=(xOff2+yOff2); p2=(xOff2 + yOff1); p3=(xOff1 + yOff2);
                p1=(p1<<1) + p1; p2=(p2<<1) + p2; p3=(p3<<1) + p3; p4=(p4<<1) + p4;
                
                // get correct area size
                wRem = (0==xOff2-xOff1-wstep+1);
                hRem = (0==yOff2-yOff1-hstepw);
                inv_size = (wRem && hRem) ? inv_sizewh : ((wRem) ? inv_sizew : ((hRem) ? inv_sizeh : inv_sizes));
                
                // compute matrix sum of these elements
                r = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                g = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                b = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                if (notSupportClamp)
                {   
                    // clamp them manually
                    r = (r<0) ? 0 : ((r>255) ? 255 : r);
                    g = (g<0) ? 0 : ((g>255) ? 255 : g);
                    b = (b<0) ? 0 : ((b>255) ? 255 : b);
                }
                r = ~~r;  g = ~~g;  b = ~~b; // alpha channel is not transformed
            }
        }
        
        // return the pixelated image data
        return im;
    }
});

}(FILTER);/**
*
* Triangular Pixelate Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var Sqrt = Math.sqrt, sqrt2 = Math.SQRT2, Min = Math.min,
    notSupportClamp = FILTER._notSupportClamp, A32F = FILTER.Array32F;

// a simple fast Triangular Pixelate filter
FILTER.Create({
    name: "TriangularPixelateFilter"
    
    // parameters
    ,scale: 1
    
    // this is the filter constructor
    ,init: function( scale ) {
        var self = this;
        self.scale = scale || 1;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                scale: self.scale
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.scale = params.scale;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        var self = this;
        if ( !self._isOn || self.scale <= 1 ) return im;
        if ( self.scale > 100 ) self.scale = 100;
        
        var imLen = im.length, imArea = (imLen>>>2), 
            step, step_2, step_1, stepw, hstep, wstep, hstepw, wRem, hRem,
            inv_size, inv_size1, inv_size1w, inv_size1h, inv_size1hw, 
            inv_sizes, inv_sizew, inv_sizeh, inv_sizewh,
            integral, colR, colG, colB,
            rowLen = (w<<1)+w, imageIndicesX, imageIndicesY,
            i, j, x, y, yw, px, py, pyw, pi,
            xOff1, yOff1, xOff2, yOff2, 
            bx1, by1, bx2, by2, 
            p1, p2, p3, p4, 
            r, g, b, r1, g1, b1, r2, g2, b2
        ;
        
    
        step = ~~(Sqrt(imArea)*self.scale*0.01);
        step_2 = step>>1; step_1 = step-1;
        stepw = w*step; hstep = (h%step); wstep = (w%step); hstepw = (hstep-1)*w;
        inv_size1 = 1.0/(step*step); inv_size1w = 1.0/(wstep*step); inv_size1h = 1.0/(hstep*step); inv_size1hw = 1.0/(wstep*hstep);
        inv_sizes = 2*inv_size1; inv_sizew = 2*inv_size1w; inv_sizeh = 2*inv_size1h; inv_sizewh = 2*inv_size1hw;
        
        // pre-compute indices, 
        imageIndicesX = step_1; imageIndicesY = step_1*w;
        // borders
        bx1=0; bx2=w-1; by1=0; by2=imArea-w;
        
        // compute integral image in one pass (enables fast pixelation in linear time)
        integral = new A32F(imArea*3);
        
        // first row
        i=0; j=0; x=0; colR=colG=colB=0;
        for (x=0; x<w; x++, i+=4, j+=3)
        {
            colR += im[i]; colG += im[i+1]; colB += im[i+2];
            integral[j] = colR; integral[j+1] = colG; integral[j+2] = colB;
        }
        // other rows
        j=0; x=0; colR=colG=colB=0;
        for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
        {
            if (x>=w) { x=0; colR=colG=colB=0; }
            colR += im[i]; colG += im[i+1]; colB += im[i+2];
            integral[j+rowLen] = integral[j] + colR; 
            integral[j+rowLen+1] = integral[j+1] + colG;  
            integral[j+rowLen+2] = integral[j+2] + colB;
        }
        
        // first block
        x = 0; y = 0; yw = 0;
        // calculate the weighed sum of the source image pixels that
        // fall under the pixelate convolution matrix
        
        // first triangle
        xOff1 = x; yOff1 = yw;
        xOff2 = x-step_2 + imageIndicesX; yOff2 = yw+imageIndicesY;
        
        // fix borders
        xOff2 = (xOff2>bx2) ? bx2 : xOff2;
        yOff2 = (yOff2>by2) ? by2 : yOff2;
        
        // compute integral positions
        p1 = (xOff1 + yOff1); p4 = (xOff2+yOff2); p2 = (xOff2 + yOff1); p3 = (xOff1 + yOff2);
        p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
        
        inv_size = inv_sizes;
        // compute matrix sum of these elements
        r1 = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
        g1 = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
        b1 = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
        
        // second triangle
        xOff1 = x+step_2;
        xOff2 = x+imageIndicesX;
        
        // fix borders
        xOff2 = (xOff2>bx2) ? bx2 : xOff2;
        
        // compute integral positions
        p1 = (xOff1 + yOff1); p4 = (xOff2+yOff2); p2 = (xOff2 + yOff1); p3 = (xOff1 + yOff2);
        p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
        
        // compute matrix sum of these elements
        r2 = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
        g2 = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
        b2 = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
        
        if (notSupportClamp)
        {   
            // clamp them manually
            r1 = (r1<0) ? 0 : ((r1>255) ? 255 : r1);
            g1 = (g1<0) ? 0 : ((g1>255) ? 255 : g1);
            b1 = (b1<0) ? 0 : ((b1>255) ? 255 : b1);
            r2 = (r2<0) ? 0 : ((r2>255) ? 255 : r2);
            g2 = (g2<0) ? 0 : ((g2>255) ? 255 : g2);
            b2 = (b2<0) ? 0 : ((b2>255) ? 255 : b2);
        }
        r1 = ~~r1;  g1 = ~~g1;  b1 = ~~b1; // alpha channel is not transformed
        r2 = ~~r2;  g2 = ~~g2;  b2 = ~~b2; // alpha channel is not transformed
        
        // render first triangle
        r = r1; g = g1; b = b1;
        
        // do direct pixelate convolution
        px = 0; py = 0; pyw = 0;
        for (i=0; i<imLen; i+=4)
        {
            // output
            // replace the area equal to the given pixelate size
            // with the average color, computed in previous step
            pi = (px+x + pyw+yw)<<2;
            im[pi] = r;  im[pi+1] = g;  im[pi+2] = b; 
            
            // next pixel
            px++; 
            if ( px+x >= w || px >= step ) 
            { 
                px=0; py++; pyw+=w; 
                // render first triangle, faster if put here
                r = r1; g = g1; b = b1;
            }
            // these edge conditions create the various triangular patterns
            if ( px > step_1-py ) 
            { 
                // render second triangle
                r = r2; g = g2; b = b2;
            }
            /*else
            {
                 // render first triangle
                r = r1; g = g1; b = b1;
            }*/
            
            
            // next block
            if (py + y >= h || py >= step)
            {
                // update image coordinates
                x += step; if (x >= w)  { x=0; y+=step; yw+=stepw; }
                px = 0; py = 0; pyw = 0;
                
                // calculate the weighed sum of the source image pixels that
                // fall under the pixelate convolution matrix
                
                // first triangle
                xOff1 = x; yOff1 = yw;  
                xOff2 = x - step_2 + imageIndicesX; yOff2 = yw + imageIndicesY;
                
                // fix borders
                xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                yOff2 = (yOff2>by2) ? by2 : yOff2;
                
                // compute integral positions
                p1 = (xOff1 + yOff1); p4 = (xOff2+yOff2); p2 = (xOff2 + yOff1); p3 = (xOff1 + yOff2);
                p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
                
                // get correct area size
                wRem = (0==xOff2-xOff1+step_2-wstep+1);
                hRem = (0==yOff2-yOff1-hstepw);
                inv_size = (wRem && hRem) ? inv_sizewh : ((wRem) ? inv_sizew : ((hRem) ? inv_sizeh : inv_sizes));
                
                // compute matrix sum of these elements
                r1 = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                g1 = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                b1 = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                
                // second triangle
                xOff1 = x + step_2;
                xOff2 = x + imageIndicesX;
                
                // fix borders
                xOff2 = (xOff2>bx2) ? bx2 : xOff2;
                
                // compute integral positions
                p1 = (xOff1 + yOff1); p4 = (xOff2+yOff2); p2 = (xOff2 + yOff1); p3 = (xOff1 + yOff2);
                p1 = (p1<<1) + p1; p2 = (p2<<1) + p2; p3 = (p3<<1) + p3; p4 = (p4<<1) + p4;
                
                // get correct area size
                wRem = (0==xOff2-xOff1+step_2-wstep+1);
                inv_size = (wRem && hRem) ? inv_sizewh : ((wRem) ? inv_sizew : ((hRem) ? inv_sizeh : inv_sizes));
                
                // compute matrix sum of these elements
                r2 = inv_size * (integral[p4] - integral[p2] - integral[p3] + integral[p1]);
                g2 = inv_size * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1]);
                b2 = inv_size * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2]);
                
                if (notSupportClamp)
                {   
                    // clamp them manually
                    r1 = (r1<0) ? 0 : ((r1>255) ? 255 : r1);
                    g1 = (g1<0) ? 0 : ((g1>255) ? 255 : g1);
                    b1 = (b1<0) ? 0 : ((b1>255) ? 255 : b1);
                    r2 = (r2<0) ? 0 : ((r2>255) ? 255 : r2);
                    g2 = (g2<0) ? 0 : ((g2>255) ? 255 : g2);
                    b2 = (b2<0) ? 0 : ((b2>255) ? 255 : b2);
                }
                r1 = ~~r1;  g1 = ~~g1;  b1 = ~~b1; // alpha channel is not transformed
                r2 = ~~r2;  g2 = ~~g2;  b2 = ~~b2; // alpha channel is not transformed
                
                // render first triangle
                r = r1; g = g1; b = b1;
            }
        }
        
        // return the pixelated image data
        return im;
    }
});

}(FILTER);/**
*
* Halftone Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var f1 = 7/16, f2 = 3/16, f3 = 5/16, f4 = 1/16, 
    A32F = FILTER.Array32F, clamp = FILTER.Color.clamp,
    RGB2YCbCr = FILTER.Color.RGB2YCbCr, YCbCr2RGB = FILTER.Color.YCbCr2RGB;

// http://en.wikipedia.org/wiki/Halftone
// http://en.wikipedia.org/wiki/Error_diffusion
// http://www.visgraf.impa.br/Courses/ip00/proj/Dithering1/average_dithering.html
// http://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering
FILTER.Create({
    name: "HalftoneFilter"
    
    // parameters
    ,_threshold: 0.4
    ,_size: 1
    ,_grayscale: false
    
    // this is the filter constructor
    ,init: function( size, threshold, grayscale ) {
        var self = this;
        self._size = size || 1;
        self._threshold = clamp(undef === threshold ? 0.4 : threshold,0,1);
        self._grayscale = !!grayscale;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,size: function( s ) {
        this._size = s;
        return this;
    }
    
    ,threshold: function( t ) {
        this._threshold = clamp(t,0,1);
        return this;
    }
    
    ,grayscale: function( bool ) {
        if ( !arguments.length ) bool = true;
        this._grayscale = !!bool;
        return this;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _size: self._size
                ,_threshold: self._threshold
                ,_grayscale: self._grayscale
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._size = params._size;
            self._threshold = params._threshold;
            self._grayscale = params._grayscale;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this, l = im.length, imSize = l>>>2,
            err = new A32F(imSize*3), pixel, index, t, rgb, ycbcr,
            size = self._size, area = size*size, invarea = 1.0/area,
            threshold = 255*self._threshold, size2 = size2<<1,
            colored = !self._grayscale,
            x, y, yw, sw = size*w, i, j, jw, 
            sum_r, sum_g, sum_b, qr, qg, qb
            //,f11 = area*f1, f22 = area*f2, f33 = area*f3, f44 = area*f4
        ;
        
        y=0; yw=0; x=0;
        while ( y < h )
        {
            sum_r = sum_g = sum_b = 0;
            i=0; j=0; jw=0;
            while ( j < size )
            {
                pixel = (x+yw+i+jw)<<2; index = (x+yw+i+jw)*3;
                sum_r += im[pixel] + err[index];
                sum_g += im[pixel+1] + err[index+1];
                sum_b += im[pixel+2] + err[index+2];
                i++;
                if ( i>=size ) {i=0; j++; jw+=w;}
            }
            sum_r *= invarea; sum_g *= invarea; sum_b *= invarea;
            ycbcr = colored ? RGB2YCbCr([sum_r, sum_g, sum_b]) : [sum_r, sum_g, sum_b];
            t = ycbcr[0];
            if ( t > threshold )
            {
                if ( colored ) 
                {
                    ycbcr[0] = /*255;*/clamp(~~t, 0, 255);
                    rgb = YCbCr2RGB(ycbcr);
                }
                else
                {                    
                    rgb = [255,255,255];
                }
            }
            else
            {                
                rgb = [0,0,0];
            }
            pixel = (x+yw)<<2;
            qr = im[pixel] - rgb[0];
            qg = im[pixel+1] - rgb[1];
            qb = im[pixel+2] - rgb[2];
            
            if ( x+size<w )
            {                
                i=size; j=0; jw=0;
                while ( j < size )
                {
                    index = (x+yw+i+jw)*3;
                    err[index] += f1*qr;
                    err[index+1] += f1*qg;
                    err[index+2] += f1*qb;
                    i++;
                    if ( i>=size2 ) {i=size; j++; jw+=w;}
                }
            }
            if ( y+size<h && x>size) 
            {
                i=-size; j=size; jw=0;
                while ( j < size2 )
                {
                    index = (x+yw+i+jw)*3;
                    err[index] += f2*qr;
                    err[index+1] += f2*qg;
                    err[index+2] += f2*qb;
                    i++;
                    if ( i>=0 ) {i=-size; j++; jw+=w;}
                }
            }
            if ( y+size<h ) 
            {
                i=0; j=size; jw=0;
                while ( j < size2 )
                {
                    index = (x+yw+i+jw)*3;
                    err[index] += f3*qr;
                    err[index+1] += f3*qg;
                    err[index+2] += f3*qb;
                    i++;
                    if ( i>=size ) {i=0; j++; jw+=w;}
                }
            }
            if ( y+size<h && x+size<w )
            {
                i=size; j=size; jw=0;
                while ( j < size2 )
                {
                    index = (x+yw+i+jw)*3;
                    err[index] += f4*qr;
                    err[index+1] += f4*qg;
                    err[index+2] += f4*qb;
                    i++;
                    if ( i>=size2 ) {i=size; j++; jw+=w;}
                }
            }
            
            i=0; j=0; jw=0;
            while ( j < size )
            {
                pixel = (x+yw+i+jw)<<2;
                im[pixel] = rgb[0];
                im[pixel+1] = rgb[1];
                im[pixel+2] = rgb[2];
                i++;
                if ( i>=size ) {i=0; j++; jw+=w;}
            }
            
            x+=size;
            if ( x>=w ) {x=0; y+=size; yw+=sw;}
        }
        return im;
    }
});

}(FILTER);/**
*
* Bokeh (Depth-of-Field) Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var Sqrt=Math.sqrt, Exp=Math.exp, Log=Math.log, 
    Abs=Math.abs, Floor=Math.floor,
    notSupportClamp=FILTER._notSupportClamp, A32F=FILTER.Array32F;

// a simple bokeh (depth-of-field) filter
FILTER.Create({
    name: "BokehFilter"
    
    // parameters
    ,centerX: 0
    ,centerY: 0
    ,radius: 10
    ,amount: 10
    
    // this is the filter constructor
    ,init: function( centerX, centerY, radius, amount ) {
        var self = this;
        self.centerX = centerX || 0;
        self.centerY = centerY || 0;
        self.radius = radius || 10;
        self.amount = amount || 10;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                centerX: self.centerX
                ,centerY: self.centerY
                ,radius: self.radius
                ,amount: self.amount
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.centerX = params.centerX;
            self.centerY = params.centerY;
            self.radius = params.radius;
            self.amount = params.amount;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        var self = this;
        if ( !self._isOn ) return im;
        var imLen = im.length, imArea, 
            integral, integralLen, colR, colG, colB,
            rowLen, i, j, x , y, ty, 
            cX = self.centerX||0, cY = self.centerY||0, 
            r = self.radius, m = self.amount,
            d, dx, dy, blur, blurw, wt,
            xOff1, yOff1, xOff2, yOff2,
            p1, p2, p3, p4, t0, t1, t2,
            bx1, bx2, by1, by2
        ;
        
        if ( m<=0 ) return im;
        
        imArea = (imLen>>2);
        bx1=0; bx2=w-1; by1=0; by2=imArea-w;
        
        // make center relative
        cX = Floor(cX*(w-1));
        cY = Floor(cY*(h-1));
        
        integralLen = (imArea<<1)+imArea;  rowLen = (w<<1)+w;
        integral = new A32F(integralLen);
        
        // compute integral of image in one pass
        // first row
        i=0; j=0; x=0; colR=colG=colB=0;
        for (x=0; x<w; x++, i+=4, j+=3)
        {
            colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
            integral[j]=colR; integral[j+1]=colG; integral[j+2]=colB;
        }
        // other rows
        i=rowLen+w; j=0; x=0; colR=colG=colB=0;
        for (i=rowLen+w; i<imLen; i+=4, j+=3, x++)
        {
            if (x>=w) { x=0; colR=colG=colB=0; }
            colR+=im[i]; colG+=im[i+1]; colB+=im[i+2];
            integral[j+rowLen]=integral[j]+colR; 
            integral[j+rowLen+1]=integral[j+1]+colG; 
            integral[j+rowLen+2]=integral[j+2]+colB;
        }
        
        
        // bokeh (depth-of-field) effect 
        // is a kind of adaptive blurring depending on distance from a center
        // like the camera/eye is focused on a specific area and everything else appears increasingly blurred
        
        x=0; y=0; ty=0;
        for (i=0; i<imLen; i+=4, x++)
        {
            // update image coordinates
            if (x>=w) { x=0; y++; ty+=w; }
            
            // compute distance
            dx = x-cX; dy = y-cY;
            //d = Sqrt(dx*dx + dy*dy);
            d = Abs(dx) + Abs(dy);  // approximation
            
            // calculate amount(radius) of blurring 
            // depending on distance from focus center
            blur = (d>r) ? ~~Log((d-r)*m) : ~~(d/r+0.5); // smooth it a bit, around the radius edge condition
            
            if (blur>0)
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
                im[i] = ~~t0;  im[i+1] = ~~t1;  im[i+2] = ~~t2;
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
* Seamless Tile Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

// a plugin to create a seamless tileable pattern from an image
// adapted from: http://www.blitzbasic.com/Community/posts.php?topic=43846
FILTER.Create({
    name: "SeamlessTileFilter"
    
    ,type: 0 // 0 radial, 1 linear 1, 2 linear 2
    
    // constructor
    ,init: function( tiling_type ) {
        var self = this;
        self.type = tiling_type || 0;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                type: self.type
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.type = params.type;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    // adapted from: http://www.blitzbasic.com/Community/posts.php?topic=43846
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        var self = this, masktype = self.type,
            //needed arrays
            diagonal, tile, mask, a1, a2, a3, d, i, j, k, 
            index, N, N2, size, imSize;

        //find largest side of the image
        //and resize the image to become square
        if ( w !== h ) im = FILTER.Image.resize( im, w, h, N = w > h ? w : h, N );
        else  N = w; 
        N2 = Math.round(N/2);
        size = N*N; imSize = im.length;
        diagonal = new FILTER.ImArray(imSize);
        tile = new FILTER.ImArray(imSize);
        mask = new FILTER.Array8U(size);

        i = 0; j = 0;
        for (k=0; k<imSize; k+=4,i++)
        {
            if ( i >= N ) {i=0; j++;}
            index = ((i+N2)%N + ((j+N2)%N)*N)<<2;
            diagonal[ index   ] = im[ k ];
            diagonal[ index+1 ] = im[ k+1 ];
            diagonal[ index+2 ] = im[ k+2 ];
            diagonal[ index+3 ] = im[ k+3 ];
        }

        //try to make your own masktypes here
        //Create the mask
        for (i=0; i<=N2-1; i++)
        {
            for (j=0; j<=N2-1; j++)
            {
                switch(masktype)
                {
                    case 0://RADIAL
                    d = Math.sqrt((i-N2)*(i-N2) + (j-N2)*(j-N2)) / N2;
                    break;

                    case 1://LINEAR 1
                    if ( (N2-i) < (N2-j) )
                        d = (j-N2)/N2;

                    else //if ( (N2-i) >= (N2-j) )
                        d = (i-N/2)/N2;
                    break;

                    case 2://LINEAR 2
                    default:
                    if ( (N2-i) < (N2-j) )
                        d = Math.sqrt((j-N)*(j-N) + (i-N)*(i-N)) / (1.13*N);

                    else //if ( (N2-i)>=(N2-j) )
                        d = Math.sqrt((i-N)*(i-N) + (j-N)*(j-N)) / (1.13*N);
                    break;
                }
                //Scale d To range from 1 To 255
                d = 255 - (255 * d);
                if (d < 1) d = 1;
                else if (d > 255) d = 255;

                //Form the mask in Each quadrant
                mask [i     + j*N      ] = d;
                mask [i     + (N-1-j)*N] = d;
                mask [N-1-i + j*N      ] = d;
                mask [N-1-i + (N-1-j)*N] = d;
            }
        }

        //Create the tile
        for (j=0; j<=N-1; j++)
        {
            for (i=0; i<=N-1; i++)
            {
                index = i+j*N;
                a1 = mask[index]; a2 = mask[(i+N2) % N + ((j+N2) % N)*N];
                a3 = a1+a2; a1 /= a3; a2 /= a3; index <<= 2;
                tile[index  ] = ~~(a1*im[index]   + a2*diagonal[index]);
                tile[index+1] = ~~(a1*im[index+1] + a2*diagonal[index+1]);
                tile[index+2] = ~~(a1*im[index+2] + a2*diagonal[index+2]);
                tile[index+3] = im[index+3];
            }
        }

        //create the new tileable image
        //if it wasn't a square image, resize it back to the original scale
        if ( w !== h ) tile = FILTER.Image.resize( tile, N, N, w, h );

        // return the new image data
        return tile;
    }
});

}(FILTER);/**
*
* FloodFill Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

// a fast flood fill filter using scanline algorithm
// adapted from: A Seed Fill Algorithm, by Paul Heckbert from "Graphics Gems", Academic Press, 1990
// http://en.wikipedia.org/wiki/Flood_fill
// http://www.codeproject.com/Articles/6017/QuickFill-An-efficient-flood-fill-algorithm
// http://www.codeproject.com/Articles/16405/Queue-Linear-Flood-Fill-A-Fast-Flood-Fill-Algorith
FILTER.Create({
    name : "FloodFillFilter"
    ,x: 0
    ,y: 0
    ,color: null
    ,tolerance: 0.0
    
    ,path: FILTER.getPath( exports.AMD )
    
    ,init: function( x, y, color, tolerance ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.color = color || [0,0,0];
        self.tolerance = tolerance || 0.0;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 color: self.color
                ,x: self.x
                ,y: self.y
                ,tolerance: self.tolerance
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.color = params.color;
            self.x = params.x;
            self.y = params.y;
            self.tolerance = params.tolerance;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    /* adapted from:
     * A Seed Fill Algorithm
     * by Paul Heckbert
     * from "Graphics Gems", Academic Press, 1990
     */
    ,apply: function(im, w, h/*, image*/) {
        var self = this, 
            /* seems to have issues when tol is exactly 1.0*/
            tol = ~~(255*(self.tolerance>=1.0 ? 0.999 : self.tolerance)), 
            OC, NC = self.color, /*pix = 4,*/ dy = w<<2, 
            x0 = self.x, y0 = self.y, imSize = im.length, 
            ymin = 0, ymax = imSize-dy, xmin = 0, xmax = (w-1)<<2,
            l, i, x, x1, x2, yw, stack, segment, notdone, abs = Math.abs
        /*
         * Filled horizontal segment of scanline y for xl<=x<=xr.
         * Parent segment was on line y-dy.  dy=1 or -1
         */
        yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ||
            (im[x0+yw] === NC[0] && im[x0+yw+1] === NC[1] && im[x0+yw+2] === NC[2]) ) return im;
        
        // seed color is the image color at x0,y0 position
        OC = [im[x0+yw], im[x0+yw+1], im[x0+yw+2]];    
        stack = [];
        if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, x0, x0, dy]); /* needed in some cases */
        /*if ( yw >= ymin && yw <= ymax)*/ stack.push([yw+dy, x0, x0, -dy]); /* seed segment (popped 1st) */
        
        while ( stack.length ) 
        {
            /* pop segment off stack and fill a neighboring scan line */
            segment = stack.pop();
            yw = segment[0]+(dy=segment[3]); x1 = segment[1]; x2 = segment[2];
            
            /*
             * segment of scan line y-dy for x1<=x<=x2 was previously filled,
             * now explore adjacent pixels in scan line y
             */
            for (x=x1; x>=xmin; x-=4)
            {
                i = x+yw;
                if ( abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                }
                else
                {
                    break;
                }
            }
            if ( x >= x1 ) 
            {
                // goto skip:
                while ( x<=x2 && !(abs(OC[0]-im[x+yw])<=tol && abs(OC[1]-im[x+yw+1])<=tol && abs(OC[2]-im[x+yw+2])<=tol) ) 
                    x+=4;
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+4;
                if ( l < x1 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, l, x1-4, -dy]);  /* leak on left? */
                }
                x = x1+4;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                i = x+yw;
                while ( x<=xmax && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                    x+=4; i = x+yw;
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, l, x-4, dy]);
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, x2+4, x-4, -dy]);	/* leak on right? */
                }
    /*skip:*/   while ( x<=x2 && !(abs(OC[0]-im[x+yw])<=tol && abs(OC[1]-im[x+yw+1])<=tol && abs(OC[2]-im[x+yw+2])<=tol) ) 
                    x+=4;
                l = x;
                notdone = (x <= x2);
            }
        }
        
        // return the new image data
        return im;
    }
});

/*    
FILTER.Create({
    name : "PatternFillFilter"
    ,x: 0
    ,y: 0
    ,tolerance: 0.0
    ,pattern: null
    ,_pattern: null
    ,mode: 0 // 0 tile, 1 stretch
    
    ,path: FILTER.getPath( exports.AMD )
    
    ,init: function( x, y, pattern, mode, tolerance ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.setPattern( pattern );
        self.mode = mode || 0;
        self.tolerance = tolerance || 0.0;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.pattern = null;
        self._pattern = null;
        self.$super('dispose');
        return self;
    }
    
    ,setPattern( pattern ) {
        var self = this;
        if ( pattern instanceof FILTER.Image )
        {
            self.pattern = pattern;
            self._pattern = {data:pattern.getData(), width:pattern.width, height:pattern.height};
        }
        else
        {
            self.pattern = null;
            self._pattern = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 x: self.x
                ,y: self.y
                ,tolerance: self.tolerance
                ,mode: self.mode
                ,_pattern: self._pattern
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.x = params.x;
            self.y = params.y;
            self.tolerance = params.tolerance;
            self.mode = params.mode;
            self._pattern = params._pattern;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
         if ( !this._pattern ) return im;
        var self = this, 
            // seems to have issues when tol is exactly 1.0
            tol = ~~(255*(self.tolerance>=1.0 ? 0.999 : self.tolerance)), 
            OC, dy = w<<2, pattern = self._pattern.data,
            pw = self._pattern.width, ph = self._pattern.height, 
            x0 = self.x, y0 = self.y, imSize = im.length, 
            ymin = 0, ymax = imSize-dy, xmin = 0, xmax = (w-1)<<2,
            l, i, x, x1, x2, yw, stack, segment, notdone, abs = Math.abs

            yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ) return im;
        
        stack = [];
        if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, x0, x0, dy]); // needed in some cases 
        stack.push([yw+dy, x0, x0, -dy]); // seed segment (popped 1st)
        
        while ( stack.length ) 
        {
            // pop segment off stack and fill a neighboring scan line 
            segment = stack.pop();
            yw = segment[0]+(dy=segment[3]); x1 = segment[1]; x2 = segment[2];
            
            // segment of scan line y-dy for x1<=x<=x2 was previously filled,
            // now explore adjacent pixels in scan line y
            for (x=x1; x>=xmin; x-=4)
            {
                i = x+yw;
                if ( abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                }
                else
                {
                    break;
                }
            }
            if ( x >= x1 ) 
            {
                // goto skip:
                while ( x<=x2 && !(abs(OC[0]-im[x+yw])<=tol && abs(OC[1]-im[x+yw+1])<=tol && abs(OC[2]-im[x+yw+2])<=tol) ) 
                    x+=4;
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+4;
                if ( l < x1 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, l, x1-4, -dy]);  // leak on left?
                }
                x = x1+4;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                i = x+yw;
                while ( x<=xmax && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                    x+=4; i = x+yw;
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack.push([yw, l, x-4, dy]);
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack.push([yw, x2+4, x-4, -dy]);	// leak on right?
                }
    /*skip:* /   while ( x<=x2 && !(abs(OC[0]-im[x+yw])<=tol && abs(OC[1]-im[x+yw+1])<=tol && abs(OC[2]-im[x+yw+2])<=tol) ) 
                    x+=4;
                l = x;
                notdone = (x <= x2);
            }
        }
        
        // return the new image data
        return im;
    }
});
*/
}(FILTER);/**
*
* HSV Converter Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp=FILTER._notSupportClamp, RGB2HSV=FILTER.Color.RGB2HSV,                 
    toCol = 0.70833333333333333333333333333333 // 255/360
;

// a plugin to convert an RGB Image to an HSV Image
FILTER.Create({
    name: "HSVConverterFilter"
    
    ,path: FILTER.getPath( exports.AMD )
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var /*r,g,b,*/ i, l=im.length, hsv, t0, t1, t2;
        
        if ( notSupportClamp )
        {   
            for (i=0; i<l; i+=4)
            {
                //r = im[i]; g = im[i+1]; b = im[i+2];
                hsv = RGB2HSV(im.subarray(i,i+3));
                t0 = hsv[0]*toCol; t2 = hsv[1]*255; t1 = hsv[2];
                // clamp them manually
                if (t0<0) t0=0;
                else if (t0>255) t0=255;
                if (t1<0) t1=0;
                else if (t1>255) t1=255;
                if (t2<0) t2=0;
                else if (t2>255) t2=255;
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                //r = im[i]; g = im[i+1]; b = im[i+2];
                hsv = RGB2HSV(im.subarray(i,i+3));
                t0 = hsv[0]*toCol; t2 = hsv[1]*255; t1 = hsv[2];
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Threshold Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp=FILTER._notSupportClamp,
    RGBA2Color=FILTER.Color.RGBA2Color, Color2RGBA=FILTER.Color.Color2RGBA
    ;

// a plugin to apply a general threshold filtering to an image
FILTER.Create({
    name: "ThresholdFilter"
    
    // filter parameters
    ,thresholds: null
    // NOTE: quantizedColors should contain 1 more element than thresholds
    ,quantizedColors: null
    
    // constructor
    ,init: function( thresholds, quantizedColors ) {
        var self = this;
        self.thresholds = thresholds;
        self.quantizedColors = quantizedColors || null;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                thresholds: self.thresholds
                ,quantizedColors: self.quantizedColors
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.thresholds = params.thresholds;
            self.quantizedColors = params.quantizedColors;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if (!self._isOn || !self.thresholds || !self.thresholds.length || 
            !self.quantizedColors || !self.quantizedColors.length) return im;
        
        var color, rgba,
            i, j, l=im.length,
            thresholds=self.thresholds, tl=thresholds.length, colors=self.quantizedColors, cl=colors.length
        ;
        
        for (i=0; i<l; i+=4)
        {
            color = RGBA2Color(im.subarray[i,i+4]);
            
            // maybe use sth faster here ??
            j=0; while (j<tl && color>thresholds[j]) j++;
            color = (j<cl) ? colors[j] : 255;
            
            rgba = Color2RGBA(color);
            //im.set(rgba,i);
            im[i] = rgba[0]; im[i+1] = rgba[1]; im[i+2] = rgba[2]; im[i+3] = rgba[3];
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Hue Extractor Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp=FILTER._notSupportClamp,
    IMG=FILTER.ImArray, clamp=FILTER.Color.clampPixel,
    RGB2HSV=FILTER.Color.RGB2HSV, HSV2RGB=FILTER.Color.HSV2RGB, Color2RGBA=FILTER.Color.Color2RGBA
    ;

// a plugin to extract regions based on a HUE range
FILTER.Create({
    name: "HueExtractorFilter"
    
    // filter parameters
    ,range : null
    ,background : 0
    
    // constructor
    ,init : function( range, background ) {
        var self = this;
        self.range = range;
        self.background = background || 0;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                range: self.range
                ,background: self.background
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.range = params.range;
            self.background = params.background;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if (!self._isOn || !self.range || !self.range.length) return im;
        
        var /*r, g, b,*/ br, bg, bb, ba,
            i, l=im.length, background, hue,
            hMin=self.range[0], hMax=self.range[self.range.length-1]
            ;
        
        background = Color2RGBA(self.background||0);
        br = ~~clamp(background[0]); 
        bg = ~~clamp(background[1]); 
        bb = ~~clamp(background[2]); 
        ba = ~~clamp(background[3]);
        
        for (i=0; i<l; i+=4)
        {
            //r = im[i]; g = im[i+1]; b = im[i+2];
            hue = RGB2HSV(im.subarray(i,i+3))[0];
            
            if (hue<hMin || hue>hMax) 
            {  
                im[i] = br; im[i+1] = bg; im[i+2] = bb; im[i+3] = ba; 
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Canny Edges Detector Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var Float32 = FILTER.Array32F, Int32 = FILTER.Array32I,
    GAUSSIAN_CUT_OFF = 0.005,
    MAGNITUDE_SCALE = 100,
    MAGNITUDE_LIMIT = 1000,
    MAGNITUDE_MAX = MAGNITUDE_SCALE * MAGNITUDE_LIMIT,
    PI2 = FILTER.CONSTANTS.PI2, abs = Math.abs, exp = Math.exp,
    hypot
;

// private utility methods
//NOTE: It is quite feasible to replace the implementation of this method
//with one which only loosely approximates the hypot function. I've tested
//simple approximations such as Math.abs(x) + Math.abs(y) and they work fine.
hypot = Math.hypot 
        ? Math.hypot 
        : /*function( x, y ){
            var absx = abs(x), 
                absy = abs(y),
                r, max;
            // avoid overflows
            if ( absx > absy )
            {
                max = absx;
                r = absy / max;
                
            }
            else
            {
                max = absy;
                if ( 0 == max ) return 0;
                r = absx / max;
            }
            return max*Math.sqrt(1.0 + r*r);
        }*/
        function(x, y){ return abs(x)+abs(y); };
        
/*function gaussian(x, sigma2) 
{
    return exp(-(x * x) / (2 * sigma2)); //sigma * sigma
}*/

function computeGradients(data, width, height, magnitude, kernelRadius, kernelWidth) 
{
    
    //generate the gaussian convolution masks
    var picsize = data.length,
        xConv = new Float32(picsize),
        yConv = new Float32(picsize),
        xGradient = new Float32(picsize),
        yGradient = new Float32(picsize),
        kernel = new Float32(kernelWidth),
        diffKernel = new Float32(kernelWidth),
        sigma2 = kernelRadius*kernelRadius, sigma22 = 2 * sigma2,
        factor = (FILTER.CONSTANTS.PI2 * /*kernelRadius * kernelRadius*/sigma2),
        kwidth, g1, g2, g3, x;
    for (kwidth = 0; kwidth < kernelWidth; kwidth++) 
    {
        g1 = exp(-(kwidth * kwidth) / sigma22); // gaussian
        if ( g1 <= GAUSSIAN_CUT_OFF && kwidth >= 2 ) break;
        g2 = exp(-((x=kwidth - 0.5) * x) / sigma22); // gaussian
        g3 = exp(-((x=kwidth + 0.5) * x) / sigma22); // gaussian
        kernel[kwidth] = (g1 + g2 + g3) / 3 / factor;
        diffKernel[kwidth] = g3 - g2;
    }

    var initX = kwidth - 1,
        maxX = width - (kwidth - 1),
        initY = width * (kwidth - 1),
        maxY = width * (height - (kwidth - 1)),
        x, y, index, sumX, sumY, xOffset, yOffset,
        sum, i
    ;
    
    //perform convolution in x and y directions
    for (x = initX; x < maxX; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
            index = x + y;
            sumX = data[index] * kernel[0];
            sumY = sumX;
            xOffset = 1;
            yOffset = width;
            for(; xOffset < kwidth ;) 
            {
                sumY += kernel[xOffset] * (data[index - yOffset] + data[index + yOffset]);
                sumX += kernel[xOffset] * (data[index - xOffset] + data[index + xOffset]);
                yOffset += width;
                xOffset++;
            }
            
            yConv[index] = sumY;
            xConv[index] = sumX;
        }

    }

    for (x = initX; x < maxX; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
            sum = 0;
            index = x + y;
            for (i = 1; i < kwidth; i++)
                sum += diffKernel[i] * (yConv[index - i] - yConv[index + i]);

            xGradient[index] = sum;
        }

    }

    for (x = kwidth; x < width - kwidth; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
            sum = 0.0;
            index = x + y;
            yOffset = width;
            for (i = 1; i < kwidth; i++) 
            {
                sum += diffKernel[i] * (xConv[index - yOffset] - xConv[index + yOffset]);
                yOffset += width;
            }

            yGradient[index] = sum;
        }

    }

    initX = kwidth;
    maxX = width - kwidth;
    initY = width * kwidth;
    maxY = width * (height - kwidth);
    var indexN, indexS, indexE, indexW,
        indexNW, indexNE, indexSW, indexSE,
        xGrad, yGrad, gradMag, tmp,
        nMag, sMag, eMag, wMag,
        nwMag, neMag, swMag, seMag
    ;
    for (x = initX; x < maxX; x++) 
    {
        for (y = initY; y < maxY; y += width) 
        {
            index = x + y;
            indexN = index - width;
            indexS = index + width;
            indexW = index - 1;
            indexE = index + 1;
            indexNW = indexN - 1;
            indexNE = indexN + 1;
            indexSW = indexS - 1;
            indexSE = indexS + 1;
            
            xGrad = xGradient[index];
            yGrad = yGradient[index];
            gradMag = hypot(xGrad, yGrad);

            //perform non-maximal supression
            nMag = hypot(xGradient[indexN], yGradient[indexN]);
            sMag = hypot(xGradient[indexS], yGradient[indexS]);
            wMag = hypot(xGradient[indexW], yGradient[indexW]);
            eMag = hypot(xGradient[indexE], yGradient[indexE]);
            neMag = hypot(xGradient[indexNE], yGradient[indexNE]);
            seMag = hypot(xGradient[indexSE], yGradient[indexSE]);
            swMag = hypot(xGradient[indexSW], yGradient[indexSW]);
            nwMag = hypot(xGradient[indexNW], yGradient[indexNW]);
            //tmp;
            /*
             * An explanation of what's happening here, for those who want
             * to understand the source: This performs the "non-maximal
             * supression" phase of the Canny edge detection in which we
             * need to compare the gradient magnitude to that in the
             * direction of the gradient; only if the value is a local
             * maximum do we consider the point as an edge candidate.
             * 
             * We need to break the comparison into a number of different
             * cases depending on the gradient direction so that the
             * appropriate values can be used. To avoid computing the
             * gradient direction, we use two simple comparisons: first we
             * check that the partial derivatives have the same sign (1)
             * and then we check which is larger (2). As a consequence, we
             * have reduced the problem to one of four identical cases that
             * each test the central gradient magnitude against the values at
             * two points with 'identical support'; what this means is that
             * the geometry required to accurately interpolate the magnitude
             * of gradient function at those points has an identical
             * geometry (upto right-angled-rotation/reflection).
             * 
             * When comparing the central gradient to the two interpolated
             * values, we avoid performing any divisions by multiplying both
             * sides of each inequality by the greater of the two partial
             * derivatives. The common comparand is stored in a temporary
             * variable (3) and reused in the mirror case (4).
             * 
             */
            if (xGrad * yGrad <= 0 /*(1)*/
                ? abs(xGrad) >= abs(yGrad) /*(2)*/
                    ? (tmp = abs(xGrad * gradMag)) >= abs(yGrad * neMag - (xGrad + yGrad) * eMag) /*(3)*/
                        && tmp > abs(yGrad * swMag - (xGrad + yGrad) * wMag) /*(4)*/
                    : (tmp = abs(yGrad * gradMag)) >= abs(xGrad * neMag - (yGrad + xGrad) * nMag) /*(3)*/
                        && tmp > abs(xGrad * swMag - (yGrad + xGrad) * sMag) /*(4)*/
                : abs(xGrad) >= Math.abs(yGrad) /*(2)*/
                    ? (tmp = abs(xGrad * gradMag)) >= abs(yGrad * seMag + (xGrad - yGrad) * eMag) /*(3)*/
                        && tmp > abs(yGrad * nwMag + (xGrad - yGrad) * wMag) /*(4)*/
                    : (tmp =abs(yGrad * gradMag)) >= abs(xGrad * seMag + (yGrad - xGrad) * sMag) /*(3)*/
                        && tmp > abs(xGrad * nwMag + (yGrad - xGrad) * nMag) /*(4)*/
            ) 
            {
                magnitude[index] = gradMag >= MAGNITUDE_LIMIT ? MAGNITUDE_MAX : Math.floor(MAGNITUDE_SCALE * gradMag);
                //NOTE: The orientation of the edge is not employed by this
                //implementation. It is a simple matter to compute it at
                //this point as: Math.atan2(yGrad, xGrad);
            } 
            else 
            {
                magnitude[index] = 0;
            }
        }
    }
}

function performHysteresis(data, width, height, magnitude, low, high) 
{
    //NOTE: this implementation reuses the data array to store both
    //luminance data from the image, and edge intensity from the processing.
    //This is done for memory efficiency, other implementations may wish
    //to separate these functions.
    //Arrays.fill(data, 0);
    var offset = 0, i, y, x, size = data.length;
    for (i=0; i<size; i++) data[i] = 0;

    x = 0; y = 0;
    for (offset=0; offset<size; offset++,x++) 
    {
        if ( x >= width ){x=0; y++;}
        if ( 0 === data[offset] && magnitude[offset] >= high ) 
        {
            follow(data, width, height, magnitude, x, y, offset, low);
        }
    }
}

function follow(data, width, height, magnitude, x1, y1, i1, threshold) 
{
    var
        x0 = x1 == 0 ? x1 : x1 - 1,
        x2 = x1 == width - 1 ? x1 : x1 + 1,
        y0 = y1 == 0 ? y1 : y1 - 1,
        y2 = y1 == height -1 ? y1 : y1 + 1,
        x, y, i2
    ;
    
    data[i1] = magnitude[i1];
    x = x0, y = y0;
    while (x <= x2 && y <= y2)
    {
        i2 = x + y * width;
        if ((y != y1 || x != x1)
            && 0 === data[i2]
            && magnitude[i2] >= threshold
        ) 
        {
            follow(data, width, height, magnitude, x, y, i2, threshold);
            return;
        }
        y++; if ( y>y2 ){y=y0; x++;}
    }
}

/*function luminance(r, g, b) 
{
    return Math.round(0.299 * r + 0.587 * g + 0.114 * b);
}*/

function readLuminance(im, data) 
{
    var i, di, r, g, b, size = im.length, 
        LR = FILTER.LUMA[0], LG = FILTER.LUMA[1], LB = FILTER.LUMA[2];
    for (i=0,di=0; i<size; i+=4,di++) 
    {
        r = im[i]; g = im[i+1]; b = im[i+2];
        data[di] = ~~(LR * r + LG * g + LB * b + 0.5);//luminance(r, g, b);
    }
}

function normalizeContrast(data) 
{
    var histogram = new Int32(256),
        remap = new Int32(256),
        i, size = data.length, 
        sum, j, k, target;
    
    for (i=0; i<size; i++) histogram[data[i]]++;
    
    sum = 0; j = 0;
    for (i = 0; i<256; i++) 
    {
        sum += histogram[i];
        target = sum*255/size;
        for (k = j+1; k <=target; k++) remap[k] = i;
        j = target;
    }
    
    for (i=0; i<size; i++) data[i] = remap[data[i]];
}

function thresholdEdges(im, data) 
{
    var i, di, size = im.length, v;
    for (i=0,di=0; i<size; i+=4,di++) 
    {
        v = data[di] > 0 ? 255 : 0;
        im[i] = im[i+1] = im[i+2] = v;
        //im[i+3] = 255;
    }
}

// an efficient Canny Edges Detector
// adapted from Java: http://www.tomgibara.com/computer-vision/canny-edge-detector
// http://en.wikipedia.org/wiki/Canny_edge_detector
FILTER.Create({
    name : "CannyEdgesFilter"
    
    ,low: 2.5
    ,high: 7.5
    ,gaussRadius: 2
    ,gaussWidth: 16
    ,contrastNormalized: false
    
    ,path: FILTER.getPath( exports.AMD )
    
    ,init: function( lowThreshold, highThreshold, gaussianKernelRadius, gaussianKernelWidth, contrastNormalized ) {
        var self = this;
		self.low = arguments.length < 1 ? 2.5 : lowThreshold;
		self.high = arguments.length < 2 ? 7.5 : highThreshold;
		self.gaussRadius = arguments.length < 3 ? 2 : gaussianKernelRadius;
		self.gaussWidth = arguments.length < 4 ? 16 : gaussianKernelWidth;
        self.contrastNormalized = !!contrastNormalized;
    }
    
    ,thresholds: function( low, high ) {
        var self = this;
        self.low = low;
        self.high = high;
        return self;
    }
    
    ,kernel: function( radius, width ) {
        var self = this;
        self.gaussRadius = radius;
        self.gaussWidth = width;
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 low: self.low
                ,high: self.high
                ,gaussRadius: self.gaussRadius
                ,gaussWidth: self.gaussWidth
                ,contrastNormalized: self.contrastNormalized
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.low = params.low;
            self.high = params.high;
            self.gaussRadius = params.gaussRadius;
            self.gaussWidth = params.gaussWidth;
            self.contrastNormalized = params.contrastNormalized;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this, picsize = im.length>>2, 
            low, high, data, magnitude;
        
        // init arrays
        data = new Int32(picsize);
        magnitude = new Int32(picsize);
        low = Math.round( self.low * MAGNITUDE_SCALE );
        high = Math.round( self.high * MAGNITUDE_SCALE );
        
        readLuminance( im, data );
        
        if ( self.contrastNormalized ) normalizeContrast( data );
        
        computeGradients( 
            data, w, h, magnitude, 
            self.gaussRadius, self.gaussWidth 
        );
        
        performHysteresis( data, w, h, magnitude, low, high );
        
        thresholdEdges( im, data );
        
        return im;
    }
});
    
}(FILTER);/**
*
* HAAR Feature Detector Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Array32F = FILTER.Array32F,
    Array8U = FILTER.Array8U,
    Abs = Math.abs, Max = Math.max, Min = Math.min, 
    Floor = Math.floor, Round = Math.round, Sqrt = Math.sqrt,
    HAS = 'hasOwnProperty'
;


// compute grayscale image, integral image (SAT) and squares image (Viola-Jones) and RSAT (Lienhart)
function integral_image(im, w, h, gray, integral, squares, tilted) 
{
    var imLen=im.length//, count=w*h
        , sum, sum2, i, j, k, y, g
        //, gray = new Array8U(count)
        // Viola-Jones
        //, integral = new Array32F(count), squares = new Array32F(count)
        // Lienhart et al. extension using tilted features
        //, tilted = new Array32F(count)
    ;
    
    // first row
    j=0; i=0; sum=sum2=0; 
    while (j<w)
    {
        // use fixed-point gray-scale transform, close to openCV transform
        // https://github.com/mtschirs/js-objectdetect/issues/3
        // 0,29901123046875  0,58697509765625  0,114013671875 with roundoff
        g = ((4899 * im[i] + 9617 * im[i + 1] + 1868 * im[i + 2]) + 8192) >>> 14;
        
        g &= 255;  
        sum += g;  
        sum2 += /*(*/(g*g); //&0xFFFFFFFF) >>> 0;
        
        // SAT(-1, y) = SAT(x, -1) = SAT(-1, -1) = 0
        // SAT(x, y) = SAT(x, y-1) + SAT(x-1, y) + I(x, y) - SAT(x-1, y-1)  <-- integral image
        
        // RSAT(-1, y) = RSAT(x, -1) = RSAT(x, -2) = RSAT(-1, -1) = RSAT(-1, -2) = 0
        // RSAT(x, y) = RSAT(x-1, y-1) + RSAT(x+1, y-1) - RSAT(x, y-2) + I(x, y) + I(x, y-1)    <-- rotated(tilted) integral image at 45deg
        gray[j] = g;
        integral[j] = sum;
        squares[j] = sum2;
        tilted[j] = g;
        
        j++; i+=4;
    }
    // other rows
    k=0; y=1; j=w; i=(w<<2); sum=sum2=0; 
    while (i<imLen)
    {
        // use fixed-point gray-scale transform, close to openCV transform
        // https://github.com/mtschirs/js-objectdetect/issues/3
        // 0,29901123046875  0,58697509765625  0,114013671875 with roundoff
        g = ((4899 * im[i] + 9617 * im[i + 1] + 1868 * im[i + 2]) + 8192) >>> 14;
        
        g &= 255;  
        sum += g;  
        sum2 += /*(*/(g*g); //&0xFFFFFFFF) >>> 0;
        
        // SAT(-1, y) = SAT(x, -1) = SAT(-1, -1) = 0
        // SAT(x, y) = SAT(x, y-1) + SAT(x-1, y) + I(x, y) - SAT(x-1, y-1)  <-- integral image
        
        // RSAT(-1, y) = RSAT(x, -1) = RSAT(x, -2) = RSAT(-1, -1) = RSAT(-1, -2) = 0
        // RSAT(x, y) = RSAT(x-1, y-1) + RSAT(x+1, y-1) - RSAT(x, y-2) + I(x, y) + I(x, y-1)    <-- rotated(tilted) integral image at 45deg
        gray[j] = g;
        integral[j] = integral[j-w] + sum;
        squares[j] = squares[j-w] + sum2;
        tilted[j] = tilted[j+1-w] + (g + gray[j-w]) + ((y>1) ? tilted[j-w-w] : 0) + ((k>0) ? tilted[j-1-w] : 0);
        
        k++; j++; i+=4; if (k>=w) { k=0; y++; sum=sum2=0; }
    }
}

// compute Canny edges on gray-scale image to speed up detection if possible
function integral_canny(gray, w, h, canny) 
{
    var i, j, k, sum, grad_x, grad_y,
        ind0, ind1, ind2, ind_1, ind_2, count=gray.length, 
        lowpass = new Array8U(count)//, canny = new Array32F(count)
    ;
    
    // first, second rows, last, second-to-last rows
    for (i=0; i<w; i++)
    {
        lowpass[i]=0;
        lowpass[i+w]=0;
        lowpass[i+count-w]=0;
        lowpass[i+count-w-w]=0;
        
        canny[i]=0;
        canny[i+count-w]=0;
    }
    // first, second columns, last, second-to-last columns
    for (j=0, k=0; j<h; j++, k+=w)
    {
        lowpass[0+k]=0;
        lowpass[1+k]=0;
        lowpass[w-1+k]=0;
        lowpass[w-2+k]=0;
        
        canny[0+k]=0;
        canny[w-1+k]=0;
    }
    // gauss lowpass
    for (i=2; i<w-2; i++)
    {
        sum=0;
        for (j=2, k=(w<<1); j<h-2; j++, k+=w) 
        {
            ind0 = i+k;
            ind1 = ind0+w; 
            ind2 = ind1+w; 
            ind_1 = ind0-w; 
            ind_2 = ind_1-w; 
            
            /*
             Original Code
             
            sum = 0;
            sum += 2 * grayImage[- 2 + ind_2];
            sum += 4 * grayImage[- 2 + ind_1];
            sum += 5 * grayImage[- 2 + ind0];
            sum += 4 * grayImage[- 2 + ind1];
            sum += 2 * grayImage[- 2 + ind2];
            sum += 4 * grayImage[- 1 + ind_2];
            sum += 9 * grayImage[- 1 + ind_1];
            sum += 12 * grayImage[- 1 + ind0];
            sum += 9 * grayImage[- 1 + ind1];
            sum += 4 * grayImage[- 1 + ind2];
            sum += 5 * grayImage[0 + ind_2];
            sum += 12 * grayImage[0 + ind_1];
            sum += 15 * grayImage[0 + ind0];
            sum += 12 * grayImage[i + 0 + ind1];
            sum += 5 * grayImage[0 + ind2];
            sum += 4 * grayImage[1 + ind_2];
            sum += 9 * grayImage[1 + ind_1];
            sum += 12 * grayImage[1 + ind0];
            sum += 9 * grayImage[1 + ind1];
            sum += 4 * grayImage[1 + ind2];
            sum += 2 * grayImage[2 + ind_2];
            sum += 4 * grayImage[2 + ind_1];
            sum += 5 * grayImage[2 + ind0];
            sum += 4 * grayImage[2 + ind1];
            sum += 2 * grayImage[2 + ind2];
            */
            
            // use as simple fixed-point arithmetic as possible (only addition/subtraction and binary shifts)
            // http://stackoverflow.com/questions/11703599/unsigned-32-bit-integers-in-javascript
            // http://stackoverflow.com/questions/6232939/is-there-a-way-to-correctly-multiply-two-32-bit-integers-in-javascript/6422061#6422061
            // http://stackoverflow.com/questions/6798111/bitwise-operations-on-32-bit-unsigned-ints
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#%3E%3E%3E_%28Zero-fill_right_shift%29
            sum = /*(*/(0
                    + (gray[ind_2-2] << 1) + (gray[ind_1-2] << 2) + (gray[ind0-2] << 2) + (gray[ind0-2])
                    + (gray[ind1-2] << 2) + (gray[ind2-2] << 1) + (gray[ind_2-1] << 2) + (gray[ind_1-1] << 3)
                    + (gray[ind_1-1]) + (gray[ind0-1] << 4) - (gray[ind0-1] << 2) + (gray[ind1-1] << 3)
                    + (gray[ind1-1]) + (gray[ind2-1] << 2) + (gray[ind_2] << 2) + (gray[ind_2]) + (gray[ind_1] << 4)
                    - (gray[ind_1] << 2) + (gray[ind0] << 4) - (gray[ind0]) + (gray[ind1] << 4) - (gray[ind1] << 2)
                    + (gray[ind2] << 2) + (gray[ind2]) + (gray[ind_2+1] << 2) + (gray[ind_1+1] << 3) + (gray[ind_1+1])
                    + (gray[ind0+1] << 4) - (gray[ind0+1] << 2) + (gray[ind1+1] << 3) + (gray[ind1+1]) + (gray[ind2+1] << 2)
                    + (gray[ind_2+2] << 1) + (gray[ind_1+2] << 2) + (gray[ind0+2] << 2) + (gray[ind0+2])
                    + (gray[ind1+2] << 2) + (gray[ind2+2] << 1)
                    );// &0xFFFFFFFF ) >>> 0;
            
            /*
            Original Code
            
            grad[ind0] = sum/159 = sum*0.0062893081761006;
            */
            
            // sum of coefficients = 159, factor = 1/159 = 0,0062893081761006
            // 2^14 = 16384, 16384/2 = 8192
            // 2^14/159 = 103,0440251572322304 =~ 103 +/- 2^13
            //grad[ind0] = (( ((sum << 6)&0xFFFFFFFF)>>>0 + ((sum << 5)&0xFFFFFFFF)>>>0 + ((sum << 3)&0xFFFFFFFF)>>>0 + ((8192-sum)&0xFFFFFFFF)>>>0 ) >>> 14) >>> 0;
            lowpass[ind0] = ((((103*sum + 8192)&0xFFFFFFFF) >>> 14)&0xFF) >>> 0;
        }
    }
    
    // sobel gradient
    for (i=1; i<w-1 ; i++)
    {
        //sum=0; 
        for (j=1, k=w; j<h-1; j++, k+=w) 
        {
            // compute coords using simple add/subtract arithmetic (faster)
            ind0=k+i;
            ind1=ind0+w; 
            ind_1=ind0-w; 
            
            grad_x = ((0
                    - lowpass[ind_1-1] 
                    + lowpass[ind_1+1] 
                    - lowpass[ind0-1] - lowpass[ind0-1]
                    + lowpass[ind0+1] + lowpass[ind0+1]
                    - lowpass[ind1-1] 
                    + lowpass[ind1+1]
                    ))//&0xFFFFFFFF
                    ;
            grad_y = ((0
                    + lowpass[ind_1-1] 
                    + lowpass[ind_1] + lowpass[ind_1]
                    + lowpass[ind_1+1] 
                    - lowpass[ind1-1] 
                    - lowpass[ind1] - lowpass[ind1]
                    - lowpass[ind1+1]
                    ))//&0xFFFFFFFF
                    ;
            
            //sum += (Abs(grad_x) + Abs(grad_y))&0xFFFFFFFF;
            canny[ind0] = ( Abs(grad_x) + Abs(grad_y) );//&0xFFFFFFFF;
       }
    }
    
    // integral canny
    // first row
    i=0; sum=0;
    while (i<w)
    {
        sum += canny[i];
        canny[i] = sum;//&0xFFFFFFFF;
        i++;
    }
    // other rows
    i=w; k=0; sum=0;
    while (i<count)
    {
        sum += canny[i];
        canny[i] = (canny[i-w] + sum);//&0xFFFFFFFF;
        i++; k++; if (k>=w) { k=0; sum=0; }
    }
    
    return canny;
}

function almost_equal(r1, r2)
{
    var d1=Max(r2.width, r1.width)*0.2, 
        d2=Max(r2.height, r1.height)*0.2;
    //var d1=Max(f.width, this.width)*0.5, d2=Max(f.height, this.height)*0.5;
    //var d2=d1=Max(f.width, this.width, f.height, this.height)*0.4;
    return !!( 
        Abs(r1.x-r2.x) <= d1 && 
        Abs(r1.y-r2.y) <= d2 && 
        Abs(r1.width-r2.width) <= d1 && 
        Abs(r1.height-r2.height) <= d2 
    ); 
}
function add_feat(r1, r2)
{
    r1.x += r2.x; 
    r1.y += r2.y; 
    r1.width += r2.width; 
    r1.height += r2.height; 
}
function is_inside(r1, r2)
{
    return !!( 
        (r1.x >= r2.x) && 
        (r1.y >= r2.y) && 
        (r1.x+r1.width <= r2.x+r2.width) && 
        (r1.y+r1.height <= r2.y+r2.height)
    ); 
}
function snap_to_grid(r)
{
    r.x = ~~(r.x+0.5); 
    r.y = ~~(r.y+0.5); 
    r.width = ~~(r.width+0.5); 
    r.height = ~~(r.height+0.5); 
}
function by_area(r1, r2)
{
    return r2.area-r1.area;
}
// merge the detected features if needed
function merge_features(rects, min_neighbors) 
{
    var rlen=rects.length, ref = new Array(rlen), feats=[], 
        nb_classes = 0, neighbors, r, found=false, i, j, n, t, ri;
    
    // original code
    // find number of neighbour classes
    for (i = 0; i < rlen; i++) ref[i] = 0;
    for (i = 0; i < rlen; i++)
    {
        found = false;
        for (j = 0; j < i; j++)
        {
            if ( almost_equal(rects[j],rects[i]) )
            {
                found = true;
                ref[i] = ref[j];
            }
        }
        
        if (!found)
        {
            ref[i] = nb_classes;
            nb_classes++;
        }
    }        
    
    // merge neighbor classes
    neighbors = new Array(nb_classes);  r = new Array(nb_classes);
    for (i = 0; i < nb_classes; i++) { neighbors[i] = 0;  r[i] = {x:0, y:0, width:0, height: 0}; }
    for (i = 0; i < rlen; i++) { ri=ref[i]; neighbors[ri]++; add_feat(r[ri],rects[i]); }
    for (i = 0; i < nb_classes; i++) 
    {
        n = neighbors[i];
        if (n >= min_neighbors) 
        {
            t=1/(n + n);
            ri = {
                x: t*(r[i].x * 2 + n),  y: t*(r[i].y * 2 + n),
                width: t*(r[i].width * 2 + n),  height: t*(r[i].height * 2 + n)
            };
            
            feats.push(ri);
        }
    }
    
    // filter inside rectangles
    rlen=feats.length;
    for (i=0; i<rlen; i++)
    {
        for (j=i+1; j<rlen; j++)
        {
            if (!feats[i].inside && is_inside(feats[i],feats[j])) { feats[i].inside=true; }
            else if (!feats[j].inside && is_inside(feats[j],feats[i])) { feats[j].inside=true; }
        }
    }
    i=rlen;
    while (--i >= 0) 
    { 
        if (feats[i].inside) 
        {
            feats.splice(i, 1); 
        }
        else 
        {
            snap_to_grid(feats[i]); 
            feats[i].area = feats[i].width*feats[i].height;
        }
    }
    
    // sort according to size 
    // (a deterministic way to present results under different cases)
    return feats.sort(by_area);
}


// HAAR Feature Detector (Viola-Jones-Lienhart algorithm)
// adapted from: https://github.com/foo123/HAAR.js
FILTER.Create({
    name: "HaarDetectorFilter"
    
    // parameters
    ,_update: false // filter by itself does not alter image data, just processes information
    ,hasMeta: true
    ,haardata: null
    ,objects: null
    ,baseScale: 1.0
    ,scaleIncrement: 1.25
    ,stepIncrement: 0.5
    ,minNeighbors: 1
    ,doCannyPruning: true
    ,cannyLow: 20
    ,cannyHigh: 100
    
    // this is the filter constructor
    ,init: function( haardata, baseScale, scaleIncrement, stepIncrement, minNeighbors, doCannyPruning ) {
        var self = this;
        self.objects = null;
        self.haardata = haardata || null;
        self.baseScale = undef === baseScale ? 1.0 : baseScale;
        self.scaleIncrement = undef === scaleIncrement ? 1.25 : scaleIncrement;
        self.stepIncrement = undef === stepIncrement ? 0.5 : stepIncrement;
        self.minNeighbors = undef === minNeighbors ? 1 : minNeighbors;
        self.doCannyPruning = undef === doCannyPruning ? true : !!doCannyPruning;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    ,dispose: function( ) {
        var self = this;
        self.objects = null;
        self.haardata = null;
        self.$super('dispose');
        return self;
    }
    
    ,haar: function( haardata ) {
        this.haardata = haardata;
        return this;
    }
    
    ,params: function( params ) {
        var self = this;
        if ( params )
        {
        if ( params[HAS]('baseScale') ) self.baseScale = params.baseScale;
        if ( params[HAS]('scaleIncrement') ) self.scaleIncrement = params.scaleIncrement;
        if ( params[HAS]('stepIncrement') ) self.stepIncrement = params.stepIncrement;
        if ( params[HAS]('minNeighbors') ) self.minNeighbors = params.minNeighbors;
        if ( params[HAS]('doCannyPruning') ) self.doCannyPruning = params.doCannyPruning;
        if ( params[HAS]('cannyLow') ) self.cannyLow = params.cannyLow;
        if ( params[HAS]('cannyHigh') ) self.cannyHigh = params.cannyHigh;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 haardata: self.haardata
                ,baseScale: self.baseScale
                ,scaleIncrement: self.scaleIncrement
                ,stepIncrement: self.stepIncrement
                ,minNeighbors: self.minNeighbors
                ,doCannyPruning: self.doCannyPruning
                ,cannyLow: self.cannyLow
                ,cannyHigh: self.cannyHigh
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.haardata = params.haardata;
            self.baseScale = params.baseScale;
            self.scaleIncrement = params.scaleIncrement;
            self.stepIncrement = params.stepIncrement;
            self.minNeighbors = params.minNeighbors;
            self.doCannyPruning = params.doCannyPruning;
            self.cannyLow = params.cannyLow;
            self.cannyHigh = params.cannyHigh;
        }
        return self;
    }
    
    // detected objects are passed as filter metadata (if filter is run in parallel thread)
    ,getMeta: function( ) {
        return this.objects;
    }
    
    ,setMeta: function( meta ) {
        this.objects = meta;
        return this;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this, imSize = im.length>>>2
            ,haar = self.haardata, haar_stages = haar.stages
            ,baseScale = self.baseScale
            ,scaleIncrement = self.scaleIncrement
            ,stepIncrement = self.stepIncrement
            ,minNeighbors = self.minNeighbors
            ,doCanny = self.doCannyPruning
            ,cL = self.cannyLow, cH = self.cannyHigh
            ,sizex = haar.size1, sizey = haar.size2
            ,scale, maxScale = Min(w/sizex, h/sizey)
            ,gray, integral, squares, tilted, canny, feats = []
        
            ,imArea1=imSize-1,
            xstep, ystep, xsize, ysize,
            startx = 0, starty = 0, startty,
            x, y, ty, tyw, tys, sl = haar_stages.length,
            p0, p1, p2, p3, xl, yl, s, t,
            bx1, bx2, by1, by2,
            swh, inv_area, total_x, total_x2, vnorm,
            edges_density, pass,
            
            stage, threshold, trees, tl,
            t, cur_node_ind, where, features, feature, rects, nb_rects, thresholdf, 
            rect_sum, kr, r, x1, y1, x2, y2, x3, y3, x4, y4, rw, rh, yw, yh, sum
        ;
        
        integral_image(im, w, h, 
            gray=new Array8U(imSize), 
            integral=new Array32F(imSize), 
            squares=new Array32F(imSize), 
            tilted=new Array32F(imSize)
        );
        if ( doCanny ) 
            integral_canny(gray, w, h, 
                canny=new Array32F(imSize)
            );
        
        // synchronous detection loop
        bx1=0; bx2=w-1; by1=0; by2=imSize-w;
        scale = baseScale;
        while (scale <= maxScale) 
        {
            // Viola-Jones Single Scale Detector
            xsize = ~~(scale * sizex); 
            xstep = ~~(xsize * stepIncrement); 
            ysize = ~~(scale * sizey); 
            ystep = ~~(ysize * stepIncrement);
            //ysize = xsize; ystep = xstep;
            tyw = ysize*w; tys = ystep*w; 
            startty = starty*tys; 
            xl = w-xsize; yl = h-ysize;
            swh = xsize*ysize; inv_area = 1.0/swh;
            
            for (y=starty, ty=startty; y<yl; y+=ystep, ty+=tys) 
            {
                for (x=startx; x<xl; x+=xstep) 
                {
                    p0 = x-1 + ty-w;    p1 = p0 + xsize;
                    p2 = p0 + tyw;    p3 = p2 + xsize;
                    
                    // clamp
                    p0 = (p0<0) ? 0 : (p0>imArea1) ? imArea1 : p0;
                    p1 = (p1<0) ? 0 : (p1>imArea1) ? imArea1 : p1;
                    p2 = (p2<0) ? 0 : (p2>imArea1) ? imArea1 : p2;
                    p3 = (p3<0) ? 0 : (p3>imArea1) ? imArea1 : p3;
                    
                    if (doCanny) 
                    {
                        // avoid overflow
                        edges_density = inv_area * (canny[p3] - canny[p2] - canny[p1] + canny[p0]);
                        if (edges_density < cL || edges_density > cH) continue;
                    }
                    
                    // pre-compute some values for speed
                    
                    // avoid overflow
                    total_x = inv_area * (integral[p3] - integral[p2] - integral[p1] + integral[p0]);
                    // avoid overflow
                    total_x2 = inv_area * (squares[p3] - squares[p2] - squares[p1] + squares[p0]);
                    
                    vnorm = total_x2 - total_x * total_x;
                    vnorm = (vnorm > 1) ? Sqrt(vnorm) : /*vnorm*/  1 ;  
                    
                    pass = true;
                    for (s = 0; s < sl; s++) 
                    {
                        // Viola-Jones HAAR-Stage evaluator
                        stage = haar_stages[s];
                        threshold = stage.thres;
                        trees = stage.trees; tl = trees.length;
                        sum=0;
                        
                        for (t = 0; t < tl; t++) 
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
                                    for (kr = 0; kr < nb_rects; kr++) 
                                    {
                                        r = rects[kr];
                                        
                                        // this produces better/larger features, possible rounding effects??
                                        x1 = x + ~~(scale * r[0]);
                                        y1 = (y-1 + ~~(scale * r[1])) * w;
                                        x2 = x + ~~(scale * (r[0] + r[2]));
                                        y2 = (y-1 + ~~(scale * (r[1] + r[2]))) * w;
                                        x3 = x + ~~(scale * (r[0] - r[3]));
                                        y3 = (y-1 + ~~(scale * (r[1] + r[3]))) * w;
                                        x4 = x + ~~(scale * (r[0] + r[2] - r[3]));
                                        y4 = (y-1 + ~~(scale * (r[1] + r[2] + r[3]))) * w;
                                        
                                        // clamp
                                        x1 = (x1<bx1) ? bx1 : (x1>bx2) ? bx2 : x1;
                                        x2 = (x2<bx1) ? bx1 : (x2>bx2) ? bx2 : x2;
                                        x3 = (x3<bx1) ? bx1 : (x3>bx2) ? bx2 : x3;
                                        x4 = (x4<bx1) ? bx1 : (x4>bx2) ? bx2 : x4;
                                        y1 = (y1<by1) ? by1 : (y1>by2) ? by2 : y1;
                                        y2 = (y2<by1) ? by1 : (y2>by2) ? by2 : y2;
                                        y3 = (y3<by1) ? by1 : (y3>by2) ? by2 : y3;
                                        y4 = (y4<by1) ? by1 : (y4>by2) ? by2 : y4;
                                        
                                        // RSAT(x-h+w, y+w+h-1) + RSAT(x, y-1) - RSAT(x-h, y+h-1) - RSAT(x+w, y+w-1)
                                        //        x4     y4            x1  y1          x3   y3            x2   y2
                                        rect_sum+= r[4] * (tilted[x4 + y4] - tilted[x3 + y3] - tilted[x2 + y2] + tilted[x1 + y1]);
                                    }
                                }
                                else
                                {
                                    // orthogonal rectangle feature, Viola-Jones original
                                    for (kr = 0; kr < nb_rects; kr++) 
                                    {
                                        r = rects[kr];
                                        
                                        // this produces better/larger features, possible rounding effects??
                                        x1 = x-1 + ~~(scale * r[0]); 
                                        x2 = x-1 + ~~(scale * (r[0] + r[2]));
                                        y1 = (w) * (y-1 + ~~(scale * r[1])); 
                                        y2 = (w) * (y-1 + ~~(scale * (r[1] + r[3])));
                                        
                                        // clamp
                                        x1 = (x1<bx1) ? bx1 : (x1>bx2) ? bx2 : x1;
                                        x2 = (x2<bx1) ? bx1 : (x2>bx2) ? bx2 : x2;
                                        y1 = (y1<by1) ? by1 : (y1>by2) ? by2 : y1;
                                        y2 = (y2<by1) ? by1 : (y2>by2) ? by2 : y2;
                                        
                                        // SAT(x-1, y-1) + SAT(x+w-1, y+h-1) - SAT(x-1, y+h-1) - SAT(x+w-1, y-1)
                                        //      x1   y1         x2      y2          x1   y1            x2    y1
                                        rect_sum+= r[4] * (integral[x2 + y2]  - integral[x1 + y2] - integral[x2 + y1] + integral[x1 + y1]);
                                    }
                                }
                                
                                where = (rect_sum * inv_area < thresholdf * vnorm) ? 0 : 1;
                                // END Viola-Jones HAAR-Leaf evaluator
                                
                                if (where) 
                                {
                                    if (feature.has_r) { sum += feature.r_val; break; } 
                                    else { cur_node_ind = feature.r_node; }
                                } 
                                else 
                                {
                                    if (feature.has_l) { sum += feature.l_val; break; } 
                                    else { cur_node_ind = feature.l_node; }
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
                        feats.push({
                            x: x, y: y,
                            width: xsize,  height: ysize
                        });
                    }
                }
            }
                    
            // increase scale
            scale *= scaleIncrement;
        }
        
        // return results as meta
        self.objects = merge_features(feats, minNeighbors); 
        
        // return im back
        return im;
    }
});

}(FILTER);/**
*
* Channel Copy Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp=FILTER._notSupportClamp, Min=Math.min, Floor=Math.floor,
    R=FILTER.CHANNEL.RED, G=FILTER.CHANNEL.GREEN, B=FILTER.CHANNEL.BLUE, A=FILTER.CHANNEL.ALPHA;

// a plugin to copy a channel of an image to a channel of another image
FILTER.Create({
    name: "ChannelCopyFilter"
    
    // parameters
    ,_srcImg: null
    ,srcImg: null
    ,centerX: 0
    ,centerY: 0
    ,srcChannel: 0
    ,dstChannel: 0
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    // constructor
    ,init: function( srcImg, srcChannel, dstChannel, centerX, centerY ) {
        var self = this;
        self._srcImg = null;
        self.srcImg = null;
        self.srcChannel = srcChannel || R;
        self.dstChannel = dstChannel || R;
        self.centerX = centerX || 0;
        self.centerY = centerY || 0;
        if ( srcImg ) self.setSrc( srcImg );
    }
    
    ,dispose: function( ) {
        var self = this;
        self.srcImg = null;
        self._srcImg = null;
        self.$super('dispose');
        return self;
    }
    
    ,setSrc: function( srcImg ) {
        var self = this;
        if ( srcImg )
        {
            self.srcImg = srcImg;
            self._srcImg = { data: srcImg.getData( ), width: srcImg.width, height: srcImg.height };
        }
        else
        {
            self.srcImg = null;
            self._srcImg = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _srcImg: self._srcImg
                ,centerX: self.centerX
                ,centerY: self.centerY
                ,srcChannel: self.srcChannel
                ,dstChannel: self.dstChannel
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._srcImg = params._srcImg;
            self.centerX = params.centerX;
            self.centerY = params.centerY;
            self.srcChannel = params.srcChannel;
            self.dstChannel = params.dstChannel;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn || !self._srcImg ) return im;
        
        var src = self._srcImg.data,
            i, l = im.length, l2 = src.length, 
            w2 = self._srcImg.width, 
            h2 = self._srcImg.height,
            sC = self.srcChannel, tC = self.dstChannel,
            x, x2, y, y2, off, xc, yc, 
            wm = Min(w,w2), hm = Min(h, h2),  
            cX = self.centerX||0, cY = self.centerY||0, 
            cX2 = (w2>>1), cY2 = (h2>>1)
        ;
        
        
        // make center relative
        cX = Floor(cX*(w-1)) - cX2;
        cY = Floor(cY*(h-1)) - cY2;
        
        i=0; x=0; y=0;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            xc = x - cX; yc = y - cY;
            if (xc>=0 && xc<wm && yc>=0 && yc<hm)
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

}(FILTER);/**
*
* Alpha Mask Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp = FILTER._notSupportClamp, Min = Math.min, Floor=Math.floor;

// a plugin to mask an image using the alpha channel of another image
FILTER.Create({
    name: "AlphaMaskFilter"
    
    // parameters
    ,_alphaMask: null
    ,alphaMask: null
    ,centerX: 0
    ,centerY: 0
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    // constructor
    ,init: function( alphaMask, centerX, centerY ) {
        var self = this;
        self.centerX = centerX||0;
        self.centerY = centerY||0;
        self._alphaMask = null;
        self.alphaMask = null;
        if ( alphaMask ) self.setMask( alphaMask );
    }
    
    ,dispose: function( ) {
        var self = this;
        self.alphaMask = null;
        self._alphaMask = null;
        self.$super('dispose');
        return self;
    }
    
    ,setMask: function( alphaMask ) {
        var self = this;
        if ( alphaMask )
        {
            self.alphaMask = alphaMask;
            self._alphaMask = { data: alphaMask.getData( ), width: alphaMask.width, height: alphaMask.height };
        }
        else
        {
            self.alphaMask = null;
            self._alphaMask = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _alphaMask: self._alphaMask
                ,centerX: self.centerX
                ,centerY: self.centerY
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self._alphaMask = params._alphaMask;
            self.centerX = params.centerX;
            self.centerY = params.centerY;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        
        var self = this;
        if ( !self._isOn || !self._alphaMask ) return im;
        
        var alpha = self._alphaMask.data,
            w2 = self._alphaMask.width, h2 = self._alphaMask.height,
            i, l = im.length, l2 = alpha.length, 
            x, x2, y, y2, off, xc, yc, 
            wm = Min(w, w2), hm = Min(h, h2),  
            cX = self.centerX||0, cY = self.centerY||0, 
            cX2 = (w2>>1), cY2 = (h2>>1)
        ;
        
        
        // make center relative
        cX = Floor(cX*(w-1)) - cX2;
        cY = Floor(cY*(h-1)) - cY2;
        
        x=0; y=0;
        for (i=0; i<l; i+=4, x++)
        {
            if (x>=w) { x=0; y++; }
            
            xc = x - cX; yc = y - cY;
            if (xc>=0 && xc<wm && yc>=0 && yc<hm)
            {
                // copy alpha channel
                off = (xc + yc*w2)<<2;
                im[i+3] = alpha[off+3];
            }
            else
            {
                // better to remove the alpha channel if mask dimensions are different??
                im[i+3] = 0;
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* Image Blend Filter Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var HAS = 'hasOwnProperty', Min = Math.min, Max = Math.max, 
    Round = Math.round, Floor=Math.floor, Abs = Math.abs,
    notSupportClamp = FILTER._notSupportClamp,
    blend_functions
;

// JavaScript implementations of common image blending modes, based on
// http://stackoverflow.com/questions/5919663/how-does-photoshop-blend-two-images-together
blend_functions = {
    
    normal: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
        
        // normal mode
        rb = r2;  
        gb = g2;  
        bb = b2;
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    lighten: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
        
        // lighten mode
        rb = (r > r2) ? r : r2; 
        gb = (g > g2) ? g : g2; 
        bb = (b > b2) ? b : b2; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    darken: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // darken mode
        rb = (r > r2) ? r2 : r; 
        gb = (g > g2) ? g2 : g; 
        bb = (b > b2) ? b2 : b; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    multiply: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // multiply mode
        rb = (r * r2 * 0.003921568627451);
        gb = (g * g2 * 0.003921568627451);
        bb = (b * b2 * 0.003921568627451);
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    average: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // average mode
        rb = 0.5*(r + r2); 
        gb = 0.5*(g + g2); 
        bb = 0.5*(b + b2); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    add: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // add mode
        rb = r + r2; 
        gb = g + g2; 
        bb = b + b2; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    subtract: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // subtract mode
        rb = (r + r2 < 255) ? 0 : r + r2 - 255;  
        gb = (g + g2 < 255) ? 0 : g + g2 - 255;  
        bb = (b + b2 < 255) ? 0 : b + b2 - 255;  
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    difference: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // difference mode
        rb = Abs(r2 - r); 
        gb = Abs(g2 - g); 
        bb = Abs(b2 - b); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    negation: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // negation mode
        rb = 255 - Abs(255 - r2 - r);
        gb = 255 - Abs(255 - g2 - g);
        bb = 255 - Abs(255 - b2 - b);
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    screen: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // screen mode
        rb = 255 - (((255 - r2) * (255 - r)) >> 8); 
        gb = 255 - (((255 - g2) * (255 - g)) >> 8); 
        bb = 255 - (((255 - b2) * (255 - b)) >> 8); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    exclusion: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // exclusion mode
        rb = r2 + r - 2 * r2 * r * 0.003921568627451; 
        gb = g2 + g - 2 * g2 * g * 0.003921568627451; 
        bb = b2 + b - 2 * b2 * b * 0.003921568627451; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    overlay: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // overlay mode
        rb = r < 128 ? (2 * r2 * r * 0.003921568627451) : (255 - 2 * (255 - r2) * (255 - r) * 0.003921568627451); 
        gb = g < 128 ? (2 * g2 * g * 0.003921568627451) : (255 - 2 * (255 - g2) * (255 - g) * 0.003921568627451); 
        rb = b < 128 ? (2 * b2 * b * 0.003921568627451) : (255 - 2 * (255 - b2) * (255 - b) * 0.003921568627451); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    softlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // softlight mode
        rb = r < 128 ? (2 * ((r2 >> 1) + 64)) * (r * 0.003921568627451) : 255 - (2 * (255 - (( r2 >> 1) + 64)) * (255 - r) * 0.003921568627451); 
        gb = g < 128 ? (2 * ((g2 >> 1) + 64)) * (g * 0.003921568627451) : 255 - (2 * (255 - (( g2 >> 1) + 64)) * (255 - g) * 0.003921568627451); 
        bb = b < 128 ? (2 * ((b2 >> 1) + 64)) * (b * 0.003921568627451) : 255 - (2 * (255 - (( b2 >> 1) + 64)) * (255 - b) * 0.003921568627451); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    // reverse of overlay
    hardlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // hardlight mode, reverse of overlay
        rb = r2 < 128 ? (2 * r * r2 * 0.003921568627451) : (255 - 2 * (255 - r) * (255 - r2) * 0.003921568627451); 
        gb = g2 < 128 ? (2 * g * g2 * 0.003921568627451) : (255 - 2 * (255 - g) * (255 - g2) * 0.003921568627451); 
        bb = b2 < 128 ? (2 * b * b2 * 0.003921568627451) : (255 - 2 * (255 - b) * (255 - b2) * 0.003921568627451); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    colordodge: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // colordodge mode
        rb = (255 == r) ? r : Min(255, ((r2 << 8 ) / (255 - r))); 
        gb = (255 == g) ? g : Min(255, ((g2 << 8 ) / (255 - g))); 
        bb = (255 == b) ? r : Min(255, ((b2 << 8 ) / (255 - b))); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    colorburn: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // colorburn mode
        rb = (0 == r) ? r : Max(0, (255 - ((255 - r2) << 8 ) / r)); 
        gb = (0 == g) ? g : Max(0, (255 - ((255 - g2) << 8 ) / g)); 
        bb = (0 == b) ? b : Max(0, (255 - ((255 - b2) << 8 ) / b)); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    linearlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb, tmp,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // linearlight mode
        if (r < 128)
        {
            tmp = r*2;
            rb = (tmp + r2 < 255) ? 0 : tmp + r2 - 255; //blendModes.linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r - 128);
            rb = tmp + r2; //blendModes.linearDodge(a, (2 * (b - 128)))
        }
        if (g < 128)
        {
            tmp = g*2;
            gb = (tmp + g2 < 255) ? 0 : tmp + g2 - 255; //blendModes.linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g - 128);
            gb = tmp + g2; //blendModes.linearDodge(a, (2 * (b - 128)))
        }
        if (b < 128)
        {
            tmp = b*2;
            bb = (tmp + b2 < 255) ? 0 : tmp + b2 - 255; //blendModes.linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (b - 128);
            bb = tmp + b2; //blendModes.linearDodge(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    reflect: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // reflect mode
        rb = (255 == r) ? r : Min(255, (r2 * r2 / (255 - r))); 
        gb = (255 == g) ? g : Min(255, (g2 * g2 / (255 - g))); 
        bb = (255 == b) ? b : Min(255, (b2 * b2 / (255 - b))); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    // reverse of reflect
    glow: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // glow mode, reverse of reflect
        rb = (255 == r2) ? r2 : Min(255, (r * r / (255 - r2))); 
        gb = (255 == g2) ? g2 : Min(255, (g * g / (255 - g2))); 
        bb = (255 == b2) ? b2 : Min(255, (b * b / (255 - b2))); 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    phoenix: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // phoenix mode
        rb = Min(r2, r) - Max(r2, r) + 255; 
        gb = Min(g2, g) - Max(g2, g) + 255; 
        bb = Min(b2, b) - Max(b2, b) + 255; 
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    vividlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb, tmp,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // vividlight mode
        if (r < 128)
        {
            tmp = 2*r;
            rb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - r2) << 8 ) / tmp));  //blendModes.colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            rb = (255 == tmp) ? tmp : Min(255, ((r2 << 8 ) / (255 - tmp)));  // blendModes.colorDodge(a, (2 * (b - 128)))
        }
        if (g < 128)
        {
            tmp = 2*g;
            gb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - g2) << 8 ) / tmp));  //blendModes.colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g-128);
            gb = (255 == tmp) ? tmp : Min(255, ((g2 << 8 ) / (255 - tmp)));  // blendModes.colorDodge(a, (2 * (b - 128)))
        }
        if (b < 128)
        {
            tmp = 2*b;
            bb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - b2) << 8 ) / tmp));  //blendModes.colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g-128);
            bb = (255 == tmp) ? tmp : Min(255, ((b2 << 8 ) / (255 - tmp)));  // blendModes.colorDodge(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    pinlight: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb, tmp,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // pinlight mode
        if (r < 128)
        {
            tmp = 2*r;
            rb = (tmp > r2) ? tmp : r2;  //blendModes.darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            rb = (tmp > r2) ? r2 : tmp;  // blendModes.lighten(a, (2 * (b - 128)))
        }
        if (g < 128)
        {
            tmp = 2*g;
            gb = (tmp > g2) ? tmp : g2;  //blendModes.darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            gb = (tmp > g2) ? g2 : tmp;  // blendModes.lighten(a, (2 * (b - 128)))
        }
        if (b < 128)
        {
            tmp = 2*b;
            bb = (tmp > b2) ? tmp : b2;  //blendModes.darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (b-128);
            bb = (tmp > b2) ? b2 : tmp;  // blendModes.lighten(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    },

    hardmix: function(im, pixel, im2, pixel2) { 
        var rb, gb, bb, tmp,
            amount = im2[pixel2+3]*0.003921568627451, invamount = 1-amount,
            r = im[pixel], g = im[pixel+1], b = im[pixel+2],
            r2 = im2[pixel2], g2 = im2[pixel2+1], b2 = im2[pixel2+2]
        ;
    
        // hardmix mode, blendModes.vividLight(a, b) < 128 ? 0 : 255;
        if (r < 128)
        {
            tmp = 2*r;
            rb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - r2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (r-128);
            rb = (255 == tmp) ? tmp : Min(255, ((r2 << 8 ) / (255 - tmp)));
        }
        rb = (rb < 128) ? 0 : 255;
        if (g < 128)
        {
            tmp = 2*g;
            gb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - g2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (g-128);
            gb = (255 == tmp) ? tmp : Min(255, ((g2 << 8 ) / (255 - tmp)));
        }
        gb = (gb < 128) ? 0 : 255;
        if (b < 128)
        {
            tmp = 2*b;
            bb = (0 == tmp) ? tmp : Max(0, (255 - ((255 - b2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (b-128);
            bb = (255 == tmp) ? tmp : Min(255, ((b2 << 8 ) / (255 - tmp)));
        }
        bb = (bb < 128) ? 0 : 255;
        
        // amount compositing
        r = rb * amount + r * invamount;  
        g = gb * amount + g * invamount;  
        b = bb * amount + b * invamount;
        
        if (notSupportClamp)
        {
            // clamp them manually
            r = (r<0) ? 0 : ((r>255) ? 255 : r);
            g = (g<0) ? 0 : ((g>255) ? 255 : g);
            b = (b<0) ? 0 : ((b>255) ? 255 : b);
        }
        
        // output
        im[pixel] = ~~r; im[pixel+1] = ~~g; im[pixel+2] = ~~b;
    }
};
// aliases
blend_functions.lineardodge = blend_functions.add;
blend_functions.linearburn = blend_functions.subtract;

//
//
// a photoshop-like Blend Filter Plugin
FILTER.Create({
    name: "BlendFilter"
    
    // parameters
    ,_blendMode: null
    ,_blendImage: null
    ,blendImage: null
    ,startX: 0
    ,startY: 0
    
    // support worker serialize/unserialize interface
    ,path: FILTER.getPath( exports.AMD )
    
    // constructor
    ,init: function( blendImage, blendMode ) { 
        var self = this;
        self.startX = 0;
        self.startY = 0;
        self._blendImage = null;
        self.blendImage = null;
        self._blendMode = null;
        if ( blendImage ) self.setImage( blendImage );
        if ( blendMode ) self.setMode( blendMode );
    }
    
    ,dispose: function( ) {
        var self = this;
        self.blendImage = null;
        self._blendImage = null;
        self._blendMode = null;
        self.$super('dispose');
        return self;
    }
    
    // set blend image auxiliary method
    ,setImage: function( blendImage ) {
        var self = this;
        if ( blendImage )
        {
            self.blendImage = blendImage;
            self._blendImage = { data: blendImage.getData( ), width: blendImage.width, height: blendImage.height };
        }
        else
        {
            self.blendImage = null;
            self._blendImage = null;
        }
        return self;
    }
    
    // set blend mode auxiliary method
    ,setMode: function( blendMode ) {
        var self = this;
        if ( blendMode )
        {
            self._blendMode = (''+blendMode).toLowerCase();
            if ( !blend_functions[HAS](self._blendMode) ) self._blendMode = null;
        }
        else
        {
            self._blendMode = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _blendImage: self._blendImage
                ,_blendMode: self._blendMode
                ,startX: self.startX
                ,startY: self.startY
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.startX = params.startX;
            self.startY = params.startY;
            self._blendImage = params._blendImage;
            self.setMode( params._blendMode );
        }
        return self;
    }
    
    ,reset: function( ) {
        var self = this;
        self.startX = 0;
        self.startY = 0;
        self._blendMode = null;
        return self;
    }
    
    // main apply routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !self._blendMode || !self._blendImage ) return im;
        
        var startX = self.startX||0, startY = self.startY||0, 
            startX2 = 0, startY2 = 0, W, H, im2, w2, h2, 
            W1, W2, start, end, x, y, x2, y2,
            image2 = self._blendImage, pix2,
            blend = blend_functions[ self._blendMode ]
        ;
        
        //if ( !blend ) return im;
        
        if (startX < 0) { startX2 = -startX;  startX = 0; }
        if (startY < 0) { startY2 = -startY;  startY = 0; }
        
        w2 = image2.width; h2 = image2.height;
        if (startX >= w || startY >= h) return im;
        if (startX2 >= w2 || startY2 >= h2) return im;
        
        startX = Round(startX); startY = Round(startY);
        startX2 = Round(startX2); startY2 = Round(startY2);
        W = Min(w-startX, w2-startX2); H = Min(h-startY, h2-startY2);
        if (W <= 0 || H <= 0) return im;
        
        im2 = image2.data;
        
        // blend images
        x = startX; y = startY*w;
        x2 = startX2; y2 = startY2*w2;
        W1 = startX+W; W2 = startX2+W;
        start = 0; end = H*W;
        while (start<end)
        {
            pix2 = (x2 + y2)<<2;
            // blend only if im2 has opacity in this point
            if ( im2[pix2+3] ) 
                // calculate and assign blended color
                blend(im, (x + y)<<2, im2, pix2);
            
            // next pixels
            start++;
            x++; if (x>=W1) { x = startX; y += w; }
            x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
        }
        return im; 
    }
});

}(FILTER);    
    /* main code ends here */
    /* export the module */
    return exports["FILTER_PLUGINS"];
});
