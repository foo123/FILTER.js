/**
*
*   Classy.js
*   @version: 0.9.3
*   @built on 2016-07-19 17:09:27
*
*   Object-Oriented micro-framework for JavaScript
*   https://github.com/foo123/classy.js
*
**/!function(e,n,i){"use strict";"object"==typeof module&&module.exports?(module.$deps=module.$deps||{})&&(module.exports=module.$deps[n]=i.call(e)):"function"==typeof define&&define.amd&&"function"==typeof require&&"function"==typeof require.specified&&require.specified(n)?define(n,["module"],function(n){return i.moduleUri=n.uri,i.call(e)}):n in e||(e[n]=i.call(e)||1)&&"function"==typeof define&&define.amd&&define(function(){return e[n]})}(this,"Classy",function(){"use strict";var e=void 0,n="constructor",i="prototype",t="__proto__",r="__static__",l="__private__",u="$super",a="$static",o="$latestatic",f="$class",c=2,s=4,b=8,d=256,m=Object,p=m[i],v=Function,g=v[i],h=String,y=Number,x=RegExp,w=Array,j=p.toString,E=(g.call.bind(g.toString),"hasOwnProperty"),_="propertyIsEnumerable",q=m.keys,I=m.defineProperty,$=function(e){return typeof e},A=function(e){throw new TypeError(e)},P=2,S=3,T=4,C=8,M=9,N=16,O=32,R=64,F=128,L=256,U=512,V=1024,k={"[object Array]":N,"[object RegExp]":F,"[object Number]":P,"[object String]":C,"[object Function]":R,"[object Object]":O},B=function(n){var i;return null===n?L:!0===n||!1===n?T:e===n?U:(i=j.call(n),i=k[i]||V,P===i||n instanceof y?isNaN(n)?S:P:C===i||n instanceof h?1===n.length?M:C:N===i||n instanceof w?N:F===i||n instanceof x?F:R===i||n instanceof v?R:O===i?O:V)},D=function(e,n){var i,t=n.length,r=[].concat(e);for(i=0;t>i;i++)-1<r.indexOf(n[i])||r.push(n[i]);return r},z=function(e,n){O!==B(e)&&A("bad desc");var i={};if(e[E]("enumerable")&&(i.enumerable=!!n.enumerable),e[E]("configurable")&&(i.configurable=!!n.configurable),e[E]("value")&&(i.value=n.value),e[E]("writable")&&(i.writable=!!e.writable),e[E]("get")){var t=e.get;R!==B(t)&&"undefined"!==t&&A("bad get"),i.get=t}if(e[E]("set")){var r=e.set;R!==B(r)&&"undefined"!==r&&A("bad set"),i.set=r}return("get"in i||"set"in i)&&("value"in i||"writable"in i)&&A("identity-confused descriptor"),i},G=m.defineProperties||function(e,n){"object"===$(e)&&null!==e||A("bad obj"),n=m(n);for(var i=q(n),t=[],r=0;r<i.length;r++)t.push([i[r],z(n[i[r]],e)]);for(var r=0;r<t.length;r++)I(e,t[r][0],t[r][1]);return e},H=function(){},J=m.create||function(e,n){var r,l=function(){};return l[i]=e,r=new l,r[t]=e,"object"===$(n)&&G(r,n),r},K=function(){var e,n,i,t,r,l,u,a=arguments;for(n=a[0]||{},e=a.length,l=1;e>l;l++)if(i=a[l],O===B(i))for(r in i)i[E](r)&&i[_](r)&&(t=i[r],u=B(t),P&u?n[r]=0+t:(C|N)&u?n[r]=t.slice(0):n[r]=t);return n},Q=function(e,i,t){var r,l,u=!!i;if(u||t)if(r={},i=u?i+"$":i,t&&R===B(t))for(l in e)e[E](l)&&(n!==l?(u&&R===B(e[l])&&(r[i+l]=e[l]),r[t(l,e[l])]=e[l]):r[l]=e[l]);else for(l in e)e[E](l)&&(n!==l?(u&&R===B(e[l])&&(r[i+l]=e[l]),t&&l in t?r[t[l]]=e[l]:r[l]=e[l]):r[l]=e[l]);else r=e;return r},W=function(e){var n=e[u]||H,i=e[u+"v"]||H,t=null;return[function(i,r,l,u,a,o,f,c,s,b,d){var m,p;return t===i?m=n.call(this,i,r,l,u,a,o,f,c,s,b,d):(p=e[i])&&(t=i,m=p.call(this,r,l,u,a,o,f,c,s,b,d),t=null),m},function(n,r){var l,u;return t===n?l=i.call(this,n,r):(u=e[n])&&(t=n,l=r&&r.length?u.apply(this,r):u.call(this),t=null),l}]},X=function(e,n){return this instanceof X?(this.factory=e,void(this.qualifier=(P===B(n)?n:0)|c)):new X(e,n)},Y=function(e,n){return this instanceof Y?(this.prop=e,void(this.qualifier=(P===B(n)?n:0)|c)):new Y(e,n)},Z=function(t,c,p,v){t=t||m,c=c||{};var g,h,y,x,w,j,_,I,$,A,S=t[a]||null,T=t[o]||{},M=t[i],F=null,L=K({},T),U=null,V={};c[E](n)||(c[n]=function(){}),g=c[n],c[E](l)&&(V=c[l]||{},delete c[l]),c[E](r)&&(F=c[r],U=q(F),delete c[r]);for($ in c)if(c[E]($)){if(A=c[$],A instanceof X){if(b&A.qualifier){d&A.qualifier?L[$]=A:((F=F||{})[$]=A.factory(t,V,g),(U=U||[]).push($)),delete c[$];continue}if(s&A.qualifier){V[$]=A,delete c[$];continue}A=c[$]=A.factory(M,V,g)}R===B(A)&&(A[u]=M[$]||H)}for($ in V)V[E]($)&&(A=V[$],A instanceof X&&(A=V[$]=A.factory(M,V,g)),R!==B(A)&&delete V[$]);if(g[i]=Q(J(M),p,v),g[i]=K(g[i],c),h=W(M),w={},w[f]=w[n]={value:g,enumerable:!1,writable:!0,configurable:!0},w[u]={value:h[0],enumerable:!1,writable:!0,configurable:!0},w[u+"v"]={value:h[1],enumerable:!1,writable:!0,configurable:!0},G(g[i],w),w={},S||U)for(S=D(S||[],U||[]),x=S.length,y=0;x>y;y++){if(j=S[y],_=null,F&&e!==F[j]){if((A=F[j])instanceof X){if((b|d)&A.qualifier){L[j]=A;continue}_=A.factory(t,V,g)}else{if(L[E](j))continue;_=F[j]}R===B(_)&&(_[u]=t[j]||H)}else e!==t[j]&&(I=B(t[j]),_=O===I?K(null,t[j]):(C|N)&I?t[j].slice(0):P&I?0+t[j]:t[j]);w[j]={value:_,enumerable:!1,writable:!0,configurable:!0}}for(j in L)L[E](j)&&(_=L[j].factory(t,V,g),w[j]={value:_,enumerable:!1,writable:!0,configurable:!0});return w[a]={value:S,enumerable:!1,writable:!0,configurable:!0},w[o]={value:L,enumerable:!1,writable:!0,configurable:!0},w[u]={value:t,enumerable:!1,writable:!0,configurable:!0},G(g,w),g},ee=K,ne=K,ie=function(n){var t,r,l,c;if(R===B(n)){if(u in n&&(n[u]=e),f in n&&(n[f]=e),o in n&&(n[o]=e),a in n){for(l=n[a],t=0,r=l.length;r>t;t++)c=l[t],c in n&&(R===B(n[c])&&n[c][u]&&(n[c][u]=e),n[c]=e);n[a]=e}l=n[i];for(c in l)R===B(l[c])&&(l[c][u]&&(l[c][u]=e),l[c]=e);l[u]=e,l[u+"v"]=e}},te=function(){var e=arguments,n=e.length,t=null;if(b===e[0])return e[1]||{};if(n>=2){var r=B(e[0]);r=R===r?{Extends:e[0]}:O===r?e[0]:{Extends:m};var l,u,a=e[1]||{},o={},f=r[E]("Extends")?r.Extends:r[E]("extends")?r["extends"]:m,c=r[E]("Implements")?r.Implements:r[E]("implements")?r["implements"]:null,s=r[E]("Mixin")?r.Mixin:r[E]("mixin")?r.mixin:null,d=null;if(c=c?[].concat(c):null,s=s?[].concat(s):null)for(l=0,u=s.length;u>l;l++)O===B(s[l])?s[l][E]("mixin")&&s[l].mixin&&s[l].mixin[i]&&(d=Q(s[l].mixin[i],s[l].namespace||null,s[l].as||null),o=ne(o,d)):s[l][i]&&(d=s[l][i],o=ne(o,d));if(c)for(l=0,u=c.length;u>l;l++)O===B(c[l])?c[l][E]("implements")&&c[l]["implements"]&&c[l]["implements"][i]&&(d=Q(c[l]["implements"][i],c[l].namespace||null,c[l].as||null),o=ee(o,d)):c[l][i]&&(d=c[l][i],o=ee(o,d));t=O===B(f)?Z(f["extends"]||m,K(o,a),f.namespace||null,f.as||null):Z(f,K(o,a))}else t=Z(m,e[0]);return t},re={VERSION:"0.9.3",PUBLIC:c,STATIC:b,LATE:d,PRIVATE:s,Type:B,Create:J,Merge:K,Alias:Q,Implements:ee,Mixin:ne,Extends:Z,Dispose:ie,Method:X,Prop:Y,Class:te};return re});
/**
*
*   Asynchronous.js
*   @version: 0.5.1
*
*   Simple JavaScript class to manage asynchronous, parallel, linear, sequential and interleaved tasks
*   https://github.com/foo123/asynchronous.js
*
**/
!function(n,e,t){"use strict";"undefined"!=typeof Components&&"object"==typeof Components.classes&&"object"==typeof Components.classesByID&&Components.utils&&"function"==typeof Components.utils["import"]?(n.$deps=n.$deps||{})&&(n.EXPORTED_SYMBOLS=[e])&&(n[e]=n.$deps[e]=t.call(n)):"object"==typeof module&&module.exports?(module.$deps=module.$deps||{})&&(module.exports=module.$deps[e]=t.call(n)):"undefined"!=typeof System&&"function"==typeof System.register&&"function"==typeof System["import"]?System.register(e,[],function(r){r(e,t.call(n))}):"function"==typeof define&&define.amd&&"function"==typeof require&&"function"==typeof require.specified&&require.specified(e)?define(e,["module"],function(e){return t.moduleUri=e.uri,t.call(n)}):e in n||(n[e]=t.call(n)||1)&&"function"==typeof define&&define.amd&&define(function(){return n[e]})}(this,"Asynchronous",function n(e){"use strict";function t(n){var e,t=[];if(n)for(e in n)n[c](e)&&t.push(e+"="+(!0===n[e]||1===n[e]?"yes":!1===n[e]||0===n[e]?"no":n[e]));return t.join(",")}function r(n,e){n.$runmode=M,n.$running=!1}function o(n,e){var t,r=n,o=r.$queue;if(r.$runmode=x,o){for(;o.length&&(!o[0]||!o[0].canRun());)o.shift();o.length?(r.$running=!0,t=o.shift(),e?t.runWithArgs(e):t.run(),t.complete()):r.$running=!1}}function i(n,e){var t,r=n,o=r.$queue,s=0;if(r.$runmode=R,o&&o.length){for(r.$running=!0;s<o.length;)t=o[s],t&&t.canRun()?(e?t.runWithArgs(e):t.run(),t.isFinished()?(o.shift(),t.complete()):s++):o.shift();r.$running=!1,r.$timer=N(v(i,r),r.$interval)}}function s(n,e){var t,r=n,o=r.$queue;r.$runmode=O,o&&o.length&&(t=o[0],t&&t.canRun()?(r.$running=!0,e?t.runWithArgs(e):t.run(),t.isFinished()&&(o.shift(),t.complete())):o.shift(),r.$running=!1,r.$timer=N(v(s,r),r.$interval))}var u,l="prototype",c="hasOwnProperty",a=Object,f=Array,p=Function,d=p[l],h=a[l],m=f[l],$=(JSON.parse,JSON.stringify),g=function(){},v=function(n,e){return function(){return n(e)}},w=d.call.bind(m.slice),y=h.toString,b=function(n){return"function"==typeof n},S=function(n,e){return n instanceof e},N=setTimeout,k=clearTimeout,j=e,E=0,T=1,q=2,W=60,A=0,R=1,x=2,M=3,O=4,C="undefined"!=typeof Components&&"object"==typeof Components.classes&&"object"==typeof Components.classesByID&&Components.utils&&"function"==typeof Components.utils["import"],L="undefined"!=typeof global&&"[object global]"===y.call(global),I=L&&"undefined"!=typeof process.send,U=!C&&!L&&"undefined"!=typeof SharedWorkerGlobalScope&&"function"==typeof importScripts,B=!C&&!L&&"undefined"!=typeof WorkerGlobalScope&&"function"==typeof importScripts&&navigator instanceof WorkerNavigator,D=!(C||L||B||U||"undefined"==typeof navigator||"undefined"==typeof document),F=(D&&!!window.opener,D&&window.self!==window.top,"function"==typeof define&&define.amd),P=L||"function"==typeof Worker||"function"==typeof SharedWorker,_=L?this:U||B?self||this:window||this,z=L?module.$deps:U||B?self||this:window||this,G=(L?global:U||B?self||this:window||this,I||U||B),J=I&&0===process.listenerCount("message")||U&&!_.onconnect||B&&!_.onmessage,V=J?function un(n){un.handler&&un.handler(I?n:n.data)}:g,K=null,Q={},X=(L?require("os").cpus().length:4,L?null:"undefined"!=typeof _.webkitURL?_.webkitURL:"undefined"!=typeof _.URL?_.URL:null),Y=function(n,e){return n&&X?X.createObjectURL(new Blob(n.push?n:[n],e||{type:"text/javascript"})):n},H=function ln(n){var e;return L?{file:__filename,path:__dirname}:U||B?{file:e=self.location.href,path:e.split("/").slice(0,-1).join("/")}:F&&n?{file:e=n,path:e.split("/").slice(0,-1).join("/")}:D&&(e=document.getElementsByTagName("script"))&&e.length?(ln.link||(ln.link=document.createElement("a")),ln.link.href=e[e.length-1].src,e=ln.link.href,{file:e,path:e.split("/").slice(0,-1).join("/")}):{path:null,file:null}},Z=H(n.moduleUri),nn=Z.file,en=function(n,e){if(n=n||{},e)for(var t in e)e[c](t)&&(n[t]=e[t]);return n},tn=0;Q[nn]=1,L?(u=function(n){var e=this;e.process=require("child_process").fork(n),e.process.on("message",function(n){e.onmessage&&e.onmessage(n)}),e.process.on("error",function(n){e.onerror&&e.onerror(n)})},u.Shared=u,u[l]={constructor:u,process:null,onmessage:null,onerror:null,postMessage:function(n){return this.process&&this.process.send(n),this},terminate:function(){return this.process&&(this.process.kill(),this.process=null),this}}):(u=function(n){var e=this;e.process=new Worker(n),e.process.onmessage=function(n){e.onmessage&&e.onmessage(n.data)},e.process.onerror=function(n){e.onerror&&e.onerror(n)}},u.Shared=u,u[l]={constructor:u,process:null,onmessage:null,onerror:null,postMessage:function(n){return this.process&&this.process.postMessage(n),this},terminate:function(){return this.process&&(this.process.terminate(),this.process=null),this}},"function"==typeof SharedWorker&&(u.Shared=function(n){var e=this;e.process=new SharedWorker(n),e.process.port.start(),e.process.port.onmessage=function(n){e.onmessage&&e.onmessage(n.data)},e.process.port.onerror=e.process.onerror=function(n){e.onerror&&e.onerror(n)}},u.Shared[l]={constructor:u.Shared,process:null,onmessage:null,onerror:null,postMessage:function(n){return this.process&&this.process.port.postMessage(n),this},terminate:function(){return this.process&&(this.process.port.close(),this.process=null),this}})),J&&(U?(_.close=g,_.postMessage=g,_.onconnect=function(n){var e=n.ports[0];_.close=function(){e.close()},_.postMessage=function(n){e.postMessage(n)},e.addEventListener("message",V),e.start()}):B?_.onmessage=V:I&&(_.close=function(){process.exit()},_.postMessage=function(n){process.send(n)},_.importScripts=function(n){try{new Function("",require("fs").readFileSync(n).toString()).call(z)}catch(e){throw e}},process.on("message",V)));var rn=function cn(n){var e=this;return e instanceof cn?(e.$id=(++tn).toString(16),void(e.options=en({width:400,height:400,toolbar:0,location:0,directories:0,status:0,menubar:0,scrollbars:1,resizable:1},n))):new cn(n)};rn[l]={constructor:rn,options:null,$id:null,$window:null,dispose:function(){var n=this;return n.$window&&n.close(),n.$window=null,n.$id=null,n.options=null,n},close:function(){var n=this;return n.$window&&(n.$window.closed||n.$window.close(),n.$window=null),n},ready:function(n,e){var t=this,r=function o(){!t.$window||n&&!t.$window[n]?setTimeout(o,60):e()};return setTimeout(r,0),t},open:function(n){var e=this;return!e.$window&&n&&(e.$window=window.open(n.push?Y(["\ufeff"].concat(n),{type:"text/html;charset=utf-8"}):n,e.$id,t(e.options))),e},write:function(n){var e=this;return e.$window&&n&&e.$window.document.write(n),e}};var on=function an(n){if(n instanceof an)return n;if(!(this instanceof an))return new an(n);var t,r=this,o=null,i=null,s=null,u=!1,l=!1,c=!1,a=!1,f=!1,p=!1,d=null,h=0,m=1,$=null,g=null,v=null,w=e;r.queue=function(n){return arguments.length?(o=n,r):o},r.jumpNext=function(n){o&&o.jumpNext(!1,n)},r.abort=function(n){o&&(o.abort(!1),n&&(o.dispose(),o=null))},r.dispose=function(){o&&(o.dispose(),o=null)},r.task=function(n){return i=n,r},n&&r.task(n),r.run=t=function(){return i.jumpNext=r.jumpNext,i.abort=r.abort,i.dispose=r.dispose,w=i(),u=!0,i.jumpNext=null,i.abort=null,i.dispose=null,w},r.runWithArgs=function(n){return i.jumpNext=r.jumpNext,i.abort=r.abort,i.dispose=r.dispose,w=i.apply(null,n),u=!0,i.jumpNext=null,i.abort=null,i.dispose=null,w},r.canRun=function(){return i&&(!u||l||c||a||f||p)?(l||c)&&h>=$?!1:c&&!d?!1:!a&&!f||w!==g:!1},r.iif=function(n,e,t){return n?r.task(e):arguments.length>2&&r.task(t),r},r.until=function(n){return w=e,d=null,g=n,f=!0,p=!1,l=!1,c=!1,a=!1,r.run=t,r},r.untilNot=function(n){return w=e,d=null,v=n,p=!0,f=!1,l=!1,c=!1,a=!1,r.run=t,r},r.loop=function(n,t,o){return w=e,d=null,h=t||0,m=o||1,$=n,l=!0,f=!1,p=!1,c=!1,a=!1,r.run=function(){var n;return n=i(h),h+=m,w=n,u=!0,n},r},r.each=function(n){return w=e,d=n,h=0,m=1,$=n?n.length||0:0,c=!0,f=!1,p=!1,l=!1,a=!1,r.run=function(){var n;return n=i(d[h],h),h++,w=n,u=!0,n},r},r.recurse=function(n,e){return d=null,w=n,g=e,a=!0,f=!1,p=!1,l=!1,c=!1,r.run=function(){var n;return n=i(w),w=n,u=!0,n},r},r.isFinished=function(){var n=!u||p||f||l||c||a;return n&&(f||a)&&w===g&&(n=!1),n&&p&&w!==v&&(n=!1),n&&(l||c)&&h>=$&&(n=!1),!n},r.onComplete=function(n){return s=n||null,r},r.complete=function(){return s&&b(s)&&s(),r}},sn=function fn(n,e){if(S(n,on))return n;if(b(n))return new on(n);if(!S(this,fn))return new fn(n,e);var t=this;t.$interval=arguments.length?parseInt(n,10)||W:W,t.$timer=null,t.$runmode=A,t.$running=!1,t.$queue=[],J&&!1!==e&&t.initThread()};return sn.VERSION="0.5.1",sn.Thread=u,sn.Task=on,sn.BrowserWindow=rn,sn.MODE={NONE:A,INTERLEAVE:R,LINEAR:x,PARALLEL:M,SEQUENCE:O},sn.Platform={UNDEFINED:j,UNKNOWN:E,NODE:T,BROWSER:q},sn.supportsMultiThreading=function(){return P},sn.isPlatform=function(n){return T===n?L:q===n?D:e},sn.isThread=function(n,e){return e=!0===e?J:!0,T===n?e&&I:q===n?e&&(U||B):e&&G},sn.path=H,sn.blob=Y,sn.load=function(n,e,t){if(n){var r=function(){n=n.split(".");for(var e=z;n.length;)n[0]&&n[0].length&&e[n[0]]&&(e=e[n[0]]),n.shift();return e&&_!==e?b(e)?!1!==t?new e:e():e:void 0};return e&&e.length&&sn.importScripts(e.join?e.join(","):e),r()}return null},sn.listen=J?function(n){V.handler=n}:g,sn.send=J?function(n){_.postMessage(n)}:g,sn.importScripts=J?function(n){if(n&&n.length){n.split&&(n=n.split(","));for(var e=0,t=n.length;t>e;e++){var r=n[e];r&&r.length&&1!==Q[r]&&(_.importScripts(r),Q[r]=1)}}}:g,sn.close=J?function(){_.close()}:g,sn.log="undefined"!=typeof console?function(n){console.log(n||"")}:g,sn.serialize=function(n){n=n||new sn(0,!1);var e=function(e){var t=function(){var t=this,r=arguments;n.step(function(){e.apply(t,r)}),n.$running||n.run(x)};return t.free=function(){return e},t};return e.free=function(){n&&n.dispose(),n=null},e},sn[l]={constructor:sn,$interval:W,$timer:null,$queue:null,$thread:null,$events:null,$runmode:A,$running:!1,dispose:function(n){var e=this;return e.unfork(!0),e.$timer&&k(e.$timer),e.$thread=null,e.$timer=null,e.$interval=null,e.$queue=null,e.$runmode=A,e.$running=!1,J&&!0===n&&sn.close(),e},empty:function(){var n=this;return n.$timer&&k(n.$timer),n.$timer=null,n.$queue=[],n.$runmode=A,n.$running=!1,n},interval:function(n){return arguments.length?(this.$interval=parseInt(n,10)||this.$interval,this):this.$interval},fork:function(n,e,t,r){var o,i,s,l=this;if(!l.$thread){if(!P)throw l.$thread=null,new Error("Asynchronous: Multi-Threading is NOT supported!");L?(i="Asynchronous: Thread (Process): ",s="Asynchronous: Thread (Process) Error: "):(i="Asynchronous: Thread (Worker): ",s="Asynchronous: Thread (Worker) Error: "),l.$events=l.$events||{},o=l.$thread=!0===r?new u.Shared(nn):new u(nn),o.onmessage=function(n){if(n.event){var e=n.event,t=n.data||null;l.$events&&l.$events[e]?l.$events[e](t):"console.log"!==e&&"console.error"!==e||sn.log(("console.error"===e?s:i)+(t||""))}},o.onerror=function(n){if(!l.$events||!l.$events.error)throw new Error(s+n.toString());l.$events.error(n)},l.send("initThread",{component:n||null,asInstance:!1!==t,imports:e?[].concat(e).join(","):null})}return l},unfork:function(n){var e=this;return e.$thread&&(!0===n?e.$thread.terminate():e.send("dispose")),e.$thread=null,e.$events=null,e},initThread:function(){var n=this;return J&&(n.$events={},sn.listen(function(e){var t=e.event,r=e.data||null;t&&n.$events[t]?n.$events[t](r):"dispose"===t&&(n.dispose(),sn.close())})),n},listen:function(n,e){return n&&b(e)&&this.$events&&(this.$events[n]=e),this},unlisten:function(n,e){return n&&this.$events&&this.$events[n]&&(2>arguments.length||e===this.$events[n])&&delete this.$events[n],this},send:function(n,e){return n&&(J?sn.send({event:n,data:e||null}):this.$thread&&this.$thread.postMessage({event:n,data:e||null})),this},task:function(n){return S(n,on)?n:b(n)?on(n):void 0},iif:function(){var n=arguments,e=new on;return e.iif.apply(e,n)},until:function(){var n=w(arguments),e=new on(n.pop());return e.until.apply(e,n)},untilNot:function(){var n=w(arguments),e=new on(n.pop());return e.untilNot.apply(e,n)},loop:function(){var n=w(arguments),e=new on(n.pop());return e.loop.apply(e,n)},each:function(){var n=w(arguments),e=new on(n.pop());return e.each.apply(e,n)},recurse:function(){var n=w(arguments),e=new on(n.pop());return e.recurse.apply(e,n)},step:function(n){var e=this;return n&&e.$queue.push(e.task(n).queue(e)),e},steps:function(){var n,e,t=this,r=arguments;for(e=r.length,n=0;e>n;n++)t.step(r[n]);return t},jumpNext:function(n,e){var t=this,r=t.$queue;return e=e||0,!1!==n?function(){return e<r.length&&(e>0&&r.splice(0,e),t.run(t.$runmode)),t}:(e<r.length&&(e>0&&r.splice(0,e),t.run(t.$runmode)),t)},jumpNextWithArgs:function(n,e,t){var r=this,o=r.$queue;return e=e||0,!1!==n?function(){return e<o.length&&(e>0&&o.splice(0,e),r.run(r.$runmode,arguments)),r}:(e<o.length&&(e>0&&o.splice(0,e),r.run(r.$runmode,t)),r)},abort:function(n,e){var t=this;return!1!==n?function(){return e&&e>0?N(function(){t.empty()},e):t.empty(),t}:(e&&e>0?N(function(){t.empty()},e):t.empty(),t)},run:function(n,e){var t=this;return arguments.length?t.$runmode=n:n=t.$runmode,e=e||null,O===n?s(t,e):R===n?i(t,e):x===n?o(t,e):M===n&&r(t,e),t}},J&&(sn.log=function(n){sn.send({event:"console.log",data:"string"!=typeof n?$(n):n})},sn.listen(function(n){var e=n.event,t=n.data||null;switch(e){case"initThread":t&&t.component&&(K&&(b(K.dispose)&&K.dispose(),K=null),K=sn.load(t.component,t.imports,t.asInstance));break;case"dispose":K&&(b(K.dispose)&&K.dispose(),K=null),sn.close()}})),sn});
/**
*
*   FILTER.js
*   @version: 0.9.5
*   @built on 2016-07-26 04:03:10
*   @dependencies: Classy.js, Asynchronous.js
*
*   JavaScript Image Processing Library
*   https://github.com/foo123/FILTER.js
*
**/!function( root, name, factory ){
"use strict";
var deps = "Classy,Asynchronous".split(/\s*,\s*/);
function extract(obj,keys,index,load){return obj ? keys.map(function(k, i){return (index ? obj[i] : obj[k]) || (load?load(k):null); }) : [];}
if ( ('object'===typeof module) && module.exports ) /* CommonJS */
    (module.$deps = module.$deps||{}) && (module.exports = module.$deps[name] = factory.apply(root, extract(module.$deps,deps,false,function(k){return require("./"+k.toLowerCase());})));
else if ( ('function'===typeof define)&&define.amd&&('function'===typeof require)&&('function'===typeof require.specified)&&require.specified(name) /*&& !require.defined(name)*/ ) /* AMD */
    define(name,['module'].concat(deps),function(module){factory.moduleUri = module.uri; return factory.apply(root, extract(Array.prototype.slice.call(arguments,1),deps,true));});
else if ( !(name in root) ) /* Browser/WebWorker/.. */
    (root[name]=factory.apply(root, extract(root,deps)))&&('function'===typeof(define))&&define.amd&&define(function(){return root[name];} );
}(  /* current root */          this, 
    /* module name */           "FILTER",
    /* module factory */        function ModuleFactory__FILTER( Classy,Asynchronous ){
/* main code starts here */

/**
*
*   FILTER.js
*   @version: 0.9.5
*   @built on 2016-07-26 04:03:10
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
FILTER.VERSION = "0.9.5";
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
    ,supportsThread = Async.supportsMultiThreading( )
    ,isThread = Async.isThread( null, true )
    ,isInsideThread = Async.isThread( )
    ,userAgent = "undefined" !== typeof navigator && navigator.userAgent ? navigator.userAgent : ""
    ,platform = "undefined" !== typeof navigator && navigator.platform ? navigator.platform : ""
    ,vendor = "undefined" !== typeof navigator && navigator.vendor ? navigator.vendor : ""
    
    ,toStringPlugin = function( ) { return "[FILTER Plugin: " + this.name + "]"; }
    ,applyPlugin = function( im, w, h, image ){ return im; }
    ,initPlugin = function( ) { }
    ,constructorPlugin = function( init ) {
        return function( ) {
            this.$super('constructor');
            init.apply( this, arguments );
        };
    }
    
    ,devicePixelRatio = FILTER.devicePixelRatio = (isBrowser && !isInsideThread ? window.devicePixelRatio : 1) || 1
    
    ,notSupportClamp = FILTER._notSupportClamp = "undefined" === typeof Uint8ClampedArray
    ,no_typed_array_set = ("undefined" === typeof Int16Array) || ("function" !== typeof Int16Array[PROTO].set)
    
    ,log, _uuid = 0
;

//
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

FILTER.ArraySet = no_typed_array_set
? function( a, b, offset ) {
    offset = offset || 0;
    for(var i=0,n=b.length; i<n; i++) a[ i + offset ] = b[ i ];
}
: function( a, b, offset ){ a.set(b, offset||0); };

FILTER.ArraySubArray = !FILTER.Array32F[PROTO].subarray
? function( a, i1, i2 ){ return a.slice(i1, i2); }
: function( a, i1, i2 ){ return a.subarray(i1, i2); };

FILTER.ImArray = notSupportClamp ? FILTER.Array8U : Uint8ClampedArray;
// opera seems to have a bug which copies Uint8ClampedArrays by reference instead by value (eg. as Firefox and Chrome)
// however Uint8 arrays are copied by value, so use that instead for doing fast copies of image arrays
FILTER.ImArrayCopy = Browser.isOpera ? FILTER.Array8U : FILTER.ImArray;

FILTER.TypedObj = isNode
    ? function( o, unserialise ) { return null == o ? o : (unserialise ? JSON.parse( o ) : JSON.stringify( o )); }
    : function( o ) { return o; }
;
FILTER.TypedArray = isNode
    ? function( a, A ) {
        if ( (null == a) || (a instanceof A) ) return a;
        else if ( Array.isArray( a ) ) return Array === A ? a : new A( a );
        if ( null == a.length ) a.length = Object.keys( a ).length;
        return Array === A ? Array.prototype.slice.call( a ) : new A( Array.prototype.slice.call( a ) );
    }
    : function( a, A ) { return a; }
;

//
// Constants
FILTER.CHANNEL = {
    R: 0, G: 1, B: 2, A: 3,
    RED: 0, GREEN: 1, BLUE: 2, ALPHA: 3
};
FILTER.MODE = {
    IGNORE: 0, WRAP: 1, CLAMP: 2,
    COLOR: 3, TILE: 4, STRETCH: 5
};
FILTER.LUMA = new FILTER.Array32F([
    0.212671, 0.71516, 0.072169
]);
FILTER.FORMAT = {
    IMAGE: 1024, DATA: 2048,
    PNG: 2, JPG: 3, JPEG: 4,
    GIF: 5, BMP: 6, TGA: 7, RGBE: 8
};
FILTER.MIME = {
     PNG    : "image/png"
    ,JPG    : "image/jpeg"
    ,JPEG   : "image/jpeg"
    ,GIF    : "image/gif"
    ,BMP    : "image/bmp"
};
FILTER.CONSTANTS = FILTER.CONST = {
     X: 0, Y: 1, Z: 2
    
    ,PI: Math.PI, PI2: 2*Math.PI, PI_2: Math.PI/2
    ,toRad: Math.PI/180, toDeg: 180/Math.PI
    
    ,SQRT2: Math.SQRT2
    ,LN2: Math.LN2
};

// packages
FILTER.IO = { };
FILTER.Codec = { };
FILTER.Interpolation = { };
FILTER.Transform = { };
FILTER.MachineLearning = FILTER.ML = { };
// utilities
FILTER.Util = {
    Math    : { },
    String  : { },
    IO      : { },
    Filter  : { },
    Image   : { }
};

// IE still does not support Uint8ClampedArray and some methods on it, add the method "set"
/*if ( notSupportClamp && ("undefined" !== typeof CanvasPixelArray) && ("function" !== CanvasPixelArray[PROTO].set) )
{
    // add the missing method to the array
    CanvasPixelArray[PROTO].set = typed_array_set;
}*/
notSupportClamp = FILTER._notSupportClamp = notSupportClamp || Browser.isOpera;

FILTER.NotImplemented = function( method ) {
    method = method || '';
    return function( ) { throw new Error('Method '+method+' not Implemented!'); };
};

//
// webgl support
FILTER.useWebGL = false;
FILTER.useWebGLSharedResources = false;
FILTER.useWebGLIfAvailable = function( bool ) { /* do nothing, override */  };
FILTER.useWebGLSharedResourcesIfAvailable = function( bool ) { /* do nothing, override */  };

//
// logging
log = FILTER.log = isThread ? Async.log : (("undefine" !== typeof console) && console.log ? function( s ) { console.log(s); } : function( s ) { /* do nothing*/ });
FILTER.warning = function( s ) { log( 'WARNING: ' + s ); }; 
FILTER.error = function( s, throwErr ) { log( 'ERROR: ' + s ); if ( throwErr ) throw new Error(s); };

var 
    //
    // Thread Filter Interface (internal)
    FilterThread = FILTER.FilterThread = FILTER.Class( Async, {
        
         path: FILTERPath
        ,name: null
        ,_listener: null
        
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
                            filter = Async.load( 'FILTER.' + data.filter/*, data["import"] || data["imports"]*/ );
                        }
                    })
                    .listen('import', function( data ) {
                        if ( data && data["import"] && data["import"].length )
                        {
                            Async.importScripts( data["import"].join ? data["import"].join(',') : data["import"] );
                        }
                    })
                    .listen('params', function( data ) {
                        if ( filter ) filter.unserialize( data );
                    })
                    .listen('apply', function( data ) {
                        if ( filter && data && data.im )
                        {
                            if ( data.params ) filter.unserialize( data.params );
                            //log(data.im[0]);
                            var im = FILTER.TypedArray( data.im[ 0 ], FILTER.ImArray );
                            // pass any filter metadata if needed
                            im = filter._apply( im, data.im[ 1 ], data.im[ 2 ] );
                            self.send( 'apply', {im: filter._update ? im : false, meta: filter.hasMeta ? filter.getMeta() : null} );
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
                        //Async.close( );
                    })
                ;
            }
        }
        
        ,dispose: function( explicit ) {
            var self = this;
            self.path = null;
            self.name = null;
            if ( self._listener )
            {
                self._listener.cb = null;
                self._listener = null;
            }
            self.$super('dispose', explicit);
            return self;
        }
        
        // activate or de-activate thread/worker filter
        ,thread: function( enable, imports ) {
            var self = this;
            if ( !arguments.length ) enable = true;
            enable = !!enable;
            // activate worker
            if ( enable && !self.$thread ) 
            {
                self.fork( 'FILTER.FilterThread', FILTERPath.file !== self.path.file ? [ FILTERPath.file, self.path.file ] : self.path.file );
                if ( imports && imports.length )
                    self.send('import', {'import': imports.join ? imports.join(',') : imports});
                self.send('load', {filter: self.name});
                self.listen( 'apply', self._listener=function l( data ) { l.cb && l.cb( data ); } );
            }
            // de-activate worker (if was activated before)
            else if ( !enable && self.$thread )
            {
                self._listener.cb = null;
                self._listener = null;
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
    }),
    
    //
    // Abstract Generic Filter (implements Async Worker/Thread Interface transparently)
    Filter = FILTER.Filter = FILTER.Class( FilterThread, {
        name: "Filter"
        
        ,constructor: function( ) {
            //var self = this;
            //self.$super('constructor', 100, false);
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
        ,apply: function( src, dst, cb ) {
            var self = this, im, im2;
            
            if ( !self.canRun( ) ) return src;
            
            if ( arguments.length < 3 )
            {
                if ( dst && dst.setSelectedData ) 
                {
                    // dest is an image and no callback
                    cb = null;
                }
                else if ( 'function' === typeof dst )
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
            
            if ( src && dst )
            {
                cb = cb || self._onComplete;
                im = src.getSelectedData( );
                if ( self.$thread )
                {
                    self._listener.cb = function( data ) { 
                        //self.unlisten( 'apply' );
                        self._listener.cb = null;
                        if ( data ) 
                        {
                            // listen for metadata if needed
                            //if ( null != data.update ) self._update = !!data.update;
                            if ( data.meta ) self.setMeta( data.meta );
                            if ( data.im/*self._update*/ ) dst.setSelectedData( FILTER.TypedArray( data.im, FILTER.ImArray ) );
                        }
                        if ( cb ) cb.call( self );
                    };
                    // process request
                    self.send( 'apply', {im: im, /*id: src.id,*/ params: self.serialize( )} );
                }
                else
                {
                    im2 = self._apply( im[ 0 ], im[ 1 ], im[ 2 ], src );
                    // update image only if needed
                    // some filters do not actually change the image data
                    // but instead process information from the data,
                    // no need to update in such a case
                    if ( self._update ) dst.setSelectedData( im2 );
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
* Filter Core Utils (Filter, Image, Math, Geometry)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var IMG = FILTER.ImArray, IMGcpy = FILTER.ImArrayCopy,
    A32F = FILTER.Array32F, A64F = FILTER.Array64F,
    A16I = FILTER.Array16I, A8U = FILTER.Array8U,
    MathUtil = FILTER.Util.Math, StringUtil = FILTER.Util.String,
    ImageUtil = FILTER.Util.Image, FilterUtil = FILTER.Util.Filter,
    Sqrt = Math.sqrt, Pow = Math.pow, Ceil = Math.ceil,
    Log = Math.log, Sin = Math.sin, Cos = Math.cos,
    Min = Math.min, Max = Math.max, Abs = Math.abs,
    PI = Math.PI, PI2 = PI+PI, PI_2 = 0.5*PI, 
    pi = PI, pi2 = PI2, pi_2 = PI_2, pi_32 = 3*pi_2,
    Log2 = Math.log2 || function( x ) { return Log(x) / Math.LN2; },
    arrayset = FILTER.ArraySet, subarray = FILTER.ArraySubArray,
    notSupportClamp = FILTER._notSupportClamp,
    esc_re = /([.*+?^${}()|\[\]\/\\\-])/g, trim_re = /^\s+|\s+$/g
;

function clamp( x, m, M )
{ 
    return x > M ? M : (x < m ? m : x); 
}

function closest_power_of_two( x )
{ 
    return Pow( 2, Ceil( Log2(x) ) ); 
}

function point2( x, y )
{
    var p = new A32F( 2 );
    p[0] = x||0.0; p[1] = y||0.0;
    return p;
}

function point3( x, y, z )
{
    var p = new A32F( 3 );
    p[0] = x||0.0; p[1] = y||0.0; p[2] = z||0.0;
    return p;
}

function interpolate2( p0, p1, t ) 
{
    return point2( p0[0]+t*(p1[0]-p0[0]), p0[1]+t*(p1[1]-p0[1]) );
}

function interpolate3( p0, p1, t ) 
{
    return point3( p0[0]+t*(p1[0]-p0[0]), p0[1]+t*(p1[1]-p0[1]), p0[2]+t*(p1[2]-p0[2]) );
}

function cross2( p0, p1 )
{ 
    return p0[0]*p1[1] - p1[0]*p0[1]; 
}

function enorm2( x, y ) 
{
    // avoid oveflows
    var t;
    if ( 0 > x ) x = -x;
    if ( 0 > y ) y = -y;
    if ( 0 === x )  
    {
        return y;
    }
    else if ( 0 === y )  
    {
        return x;
    }
    else if ( x > y ) 
    {
        t = y / x;  
        return x *Sqrt( 1.0 + t*t ); 
    }
    else 
    { 
        t = x / y;
        return y * Sqrt( 1.0 + t*t ); 
    }
}

function normal2( p1, p0 ) 
{
    var d, n, lamda, normallamda, l;

    d = point2( p1[0]-p0[0], p1[1]-p0[1] );
    
    if ( 0 === d[1] && 0 === d[0] )  // same point infinite normals
    {
        return null;
    }
    
    n = point2( 0, 0 );
    
    if ( 0 === d[0] ) // lamda=Inf
    {
        n[0] = 10;
    }
    if ( 0 === d[1] )  // normallamda=Inf
    {
        n[1] = 10;
    }
    
    if ( 0 !== d[1] && 0 !== d[0] )
    {
        lamda = d[1] / d[0];
        normallamda = -d[0] / d[1];
        n[0] = 10;
        n[1] = normallamda*n[0];
    }
    
    // normalize
    l = enorm2( n[0], n[1] );
    n[0] /= l; n[1] /= l;
    if ( 0 > cross2( d, n ) )
    {
        n[0] = -n[0];
        n[1] = -n[1];
    }
    return n;
}

function crop( im, w, h, x1, y1, x2, y2 )
{
    x2 = Min(x2, w-1); y2 = Min(y2, h-1);
    var nw = x2-x1+1, nh = y2-y1+1, 
        croppedSize = (nw*nh)<<2, cropped = new IMG(croppedSize), 
        y, yw, nw4 = nw<<2, pixel, pixel2;

    for (y=y1,yw=y1*w,pixel=0; y<=y2; y++,yw+=w,pixel+=nw4)
    {
        pixel2 = (yw+x1)<<2;
        arrayset(cropped, subarray(im, pixel2, pixel2+nw4), pixel);
    }
    return cropped;
}

function pad( im, w, h, pad_right, pad_bot, pad_left, pad_top )
{
    pad_right = pad_right || 0; pad_bot = pad_bot || 0;
    pad_left = pad_left || 0; pad_top = pad_top || 0;
    var nw = w+pad_left+pad_right, nh = h+pad_top+pad_bot, 
        paddedSize = (nw*nh)<<2, padded = new IMG(paddedSize), 
        y, yw, w4 = w<<2, nw4 = nw<<2, pixel, pixel2,
        offtop = pad_top*nw4, offleft = pad_left<<2;

    for (y=0,yw=0,pixel=offtop; y<h; y++,yw+=w,pixel+=nw4)
    {
        pixel2 = yw<<2;
        arrayset(padded, subarray(im, pixel2, pixel2+w4), offleft+pixel);
    }
    return padded;
}

function get_data( D, W, H, x0, y0, x1, y1, orig )
{
    x0 = Min(x0, W-1); y0 = Min(y0, H-1);
    x1 = Min(x1, W-1); y1 = Min(y1, H-1);
    if ( (0 === x0) && (0 === y0) && (W === x1+1) && (H === y1+1) ) return true === orig ? D : new IMGcpy( D );
    if ( !D.length || (x1 < x0) || (y1 < y0) ) return new IMG(0);
    var x, y, i, I, w = x1-x0+1, h = y1-y0+1, size = (w*h) << 2, d = new IMG(size);
    for(x=x0,y=y0,i=0; y<=y1; i+=4,x++)
    {
        if ( x>x1 ){ x=x0; y++; }
        I = (y*W + x) << 2;
        d[i  ] = D[I  ];
        d[i+1] = D[I+1];
        d[i+2] = D[I+2];
        d[i+3] = D[I+3];
    }
    return d;
}

function set_data( D, W, H, d, w, h, x0, y0, x1, y1, X0, Y0 )
{
    var i, I, x, y;
    if ( !D.length || !d.length || !w || !h || !W || !H ) return D;
    x0 = Min(x0, w-1); y0 = Min(y0, h-1);
    X0 = Min(X0, W-1); Y0 = Min(Y0, H-1);
    x1 = Min(x1, w-1); y1 = Min(y1, h-1);
    X0 -= x0; Y0 -= y0;
    for(x=x0,y=y0; y<=y1; x++)
    {
        if ( x>x1 ) { x=x0; y++; }
        if ( (y+Y0 >= H) || (x+X0 >= W) ) continue;
        i = (y*w + x) << 2;
        I = ((y+Y0)*W + x+X0) << 2;
        D[I  ] = d[i  ];
        D[I+1] = d[i+1];
        D[I+2] = d[i+2];
        D[I+3] = d[i+3];
    }
    return D;
}

function fill_data( D, W, H, c, x0, y0, x1, y1 )
{
    x0 = Min(x0, W-1); y0 = Min(y0, H-1);
    x1 = Min(x1, W-1); y1 = Min(y1, H-1);
    if ( !D.length || (x1 < x0) || (y1 < y0) ) return D;
    var x, y, i, r = c[0] & 255, g = c[1] & 255, b = c[2] & 255, a = 3 < c.length ? c[3] & 255 : 255;
    for(x=x0,y=y0; y<=y1; x++)
    {
        if ( x>x1 ) { x=x0; y++; }
        i = (y*W + x) << 2;
        D[i  ] = r;
        D[i+1] = g;
        D[i+2] = b;
        D[i+3] = a;
    }
    return D;
}

// compute integral image (Summed Area Table, SAT) (for a given channel)
function integral( im, w, h, channel ) 
{
    var rowLen = w<<2, integ, sum,
        imLen = im.length, count = imLen>>2, i, j, x
    ;
    // compute integral of image in one pass
    channel = channel || 0;
    integ = new A32F(count); 
    // first row
    for (x=0,j=0,i=0,sum=0; x<w; x++, i+=4, j++)
    {
        sum+=im[i+channel]; integ[j]=sum; 
    }
    // other rows
    for (x=0,j=0,sum=0,i=rowLen; i<imLen; i+=4, j++, x++)
    {
        if ( x >=w ) { x=0; sum=0; }
        sum+=im[i+channel]; integ[j+w]=integ[j]+sum; 
    }
    return integ;
}

// compute image histogram (for a given channel)
function histogram( im, w, h, channel ) 
{
    var i, l = im.length, cdf, accum, n = 1.0 / (l>>2);
    
    // initialize the arrays
    channel = channel || 0;
    cdf = new A32F( 256 ); 
    for (i=0; i<256; i+=32) 
    { 
        // partial loop unrolling
        cdf[i   ]=0;
        cdf[i+1 ]=0;
        cdf[i+2 ]=0;
        cdf[i+3 ]=0;
        cdf[i+4 ]=0;
        cdf[i+5 ]=0;
        cdf[i+6 ]=0;
        cdf[i+7 ]=0;
        cdf[i+8 ]=0;
        cdf[i+9 ]=0;
        cdf[i+10]=0;
        cdf[i+11]=0;
        cdf[i+12]=0;
        cdf[i+13]=0;
        cdf[i+14]=0;
        cdf[i+15]=0;
        cdf[i+16]=0;
        cdf[i+17]=0;
        cdf[i+18]=0;
        cdf[i+19]=0;
        cdf[i+20]=0;
        cdf[i+21]=0;
        cdf[i+22]=0;
        cdf[i+23]=0;
        cdf[i+24]=0;
        cdf[i+25]=0;
        cdf[i+26]=0;
        cdf[i+27]=0;
        cdf[i+28]=0;
        cdf[i+29]=0;
        cdf[i+30]=0;
        cdf[i+31]=0;
    }
    // compute pdf and maxima/minima
    for (i=0; i<l; i+=4)
    {
        cdf[ im[i+channel] ] += n;
    }
    
    // compute cdf
    for (accum=0,i=0; i<256; i+=32) 
    { 
        // partial loop unrolling
        accum += cdf[i   ]; cdf[i   ] = accum;
        accum += cdf[i+1 ]; cdf[i+1 ] = accum;
        accum += cdf[i+2 ]; cdf[i+2 ] = accum;
        accum += cdf[i+3 ]; cdf[i+3 ] = accum;
        accum += cdf[i+4 ]; cdf[i+4 ] = accum;
        accum += cdf[i+5 ]; cdf[i+5 ] = accum;
        accum += cdf[i+6 ]; cdf[i+6 ] = accum;
        accum += cdf[i+7 ]; cdf[i+7 ] = accum;
        accum += cdf[i+8 ]; cdf[i+8 ] = accum;
        accum += cdf[i+9 ]; cdf[i+9 ] = accum;
        accum += cdf[i+10]; cdf[i+10] = accum;
        accum += cdf[i+11]; cdf[i+11] = accum;
        accum += cdf[i+12]; cdf[i+12] = accum;
        accum += cdf[i+13]; cdf[i+13] = accum;
        accum += cdf[i+14]; cdf[i+14] = accum;
        accum += cdf[i+15]; cdf[i+15] = accum;
        accum += cdf[i+16]; cdf[i+16] = accum;
        accum += cdf[i+17]; cdf[i+17] = accum;
        accum += cdf[i+18]; cdf[i+18] = accum;
        accum += cdf[i+19]; cdf[i+19] = accum;
        accum += cdf[i+20]; cdf[i+20] = accum;
        accum += cdf[i+21]; cdf[i+21] = accum;
        accum += cdf[i+22]; cdf[i+22] = accum;
        accum += cdf[i+23]; cdf[i+23] = accum;
        accum += cdf[i+24]; cdf[i+24] = accum;
        accum += cdf[i+25]; cdf[i+25] = accum;
        accum += cdf[i+26]; cdf[i+26] = accum;
        accum += cdf[i+27]; cdf[i+27] = accum;
        accum += cdf[i+28]; cdf[i+28] = accum;
        accum += cdf[i+29]; cdf[i+29] = accum;
        accum += cdf[i+30]; cdf[i+30] = accum;
        accum += cdf[i+31]; cdf[i+31] = accum;
    }
    return cdf;
}

function spectrum( im, w, h, channel ) 
{
    // TODO
    return null;
}

// speed-up convolution for special kernels like moving-average
function integral_convolution_rgb(im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats) 
{
    var imLen=im.length, imArea=(imLen>>2), integral, integralLen, colR, colG, colB,
        matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2,
        r, g, b, r2, g2, b2, repeat, tmp
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
    dst = im; im = new IMG(imLen); integral = new A32F(integralLen);
    
    numRepeats = numRepeats||1;
    
    if (matrix2) // allow to compute a second matrix in-parallel
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
        wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>1]; centerOffset2 = wtCenter2-wt2;
        
        // do this multiple times??
        for(repeat=0; repeat<numRepeats; repeat++)
        {
            //dst = new IMG(imLen); integral = new A32F(integralLen);
            tmp = im; im = dst; dst = tmp;

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
                
                r2 = wt2 * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset2 * im[i  ]);
                g2 = wt2 * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset2 * im[i+1]);
                b2 = wt2 * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset2 * im[i+2]);
                
                // output
                t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            
            // do another pass??
        }
    }
    else
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
    
        // do this multiple times??
        for(repeat=0; repeat<numRepeats; repeat++)
        {
            //dst = new IMG(imLen); integral = new A32F(integralLen);
            tmp = im; im = dst; dst = tmp;
            
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
                integral[j+rowLen  ]=integral[j  ]+colR; 
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
                t0 = coeff1*r + coeff2;  t1 = coeff1*g + coeff2;  t2 = coeff1*b + coeff2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                // alpha channel is not transformed
                dst[i+3] = im[i+3];
            }
            
            // do another pass??
        }
    }
    return dst;
}
function integral_convolution_rgba(im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats) 
{
    var imLen=im.length, imArea=(imLen>>2), integral, integralLen, colR, colG, colB, colA,
        matRadiusX=dimX, matRadiusY=dimY, matHalfSideX, matHalfSideY, matArea,
        dst, rowLen, matOffsetLeft, matOffsetRight, matOffsetTop, matOffsetBottom,
        i, j, x, y, ty, wt, wtCenter, centerOffset, wt2, wtCenter2, centerOffset2,
        xOff1, yOff1, xOff2, yOff2, bx1, by1, bx2, by2, p1, p2, p3, p4, t0, t1, t2, t3,
        r, g, b, a, r2, g2, b2, a2, repeat, tmp
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
    
    integralLen = imLen;  rowLen = w<<2;
    dst = im; im = new IMG(imLen); integral = new A32F(integralLen);
    
    numRepeats = numRepeats||1;
    
    if (matrix2) // allow to compute a second matrix in-parallel
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
        wt2 = matrix2[0]; wtCenter2 = matrix2[matArea>>1]; centerOffset2 = wtCenter2-wt2;
        
        // do this multiple times??
        for(repeat=0; repeat<numRepeats; repeat++)
        {
            //dst = new IMG(imLen); integral = new A32F(integralLen);
            tmp = im; im = dst; dst = tmp;
            
            // compute integral of image in one pass
            
            // first row
            i=0; colR=colG=colB=colA=0;
            for (x=0; x<w; x++, i+=4)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2]; colA+=im[i+3];
                integral[i]=colR; integral[i+1]=colG; integral[i+2]=colB; integral[i+3]=colA;
            }
            // other rows
            x=0; colR=colG=colB=colA=0;
            for (i=rowLen+w; i<imLen; i+=4, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=colA=0; }
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2]; colA+=im[i+3];
                integral[i+rowLen  ]=integral[i  ]+colR; 
                integral[i+rowLen+1]=integral[i+1]+colG; 
                integral[i+rowLen+2]=integral[i+2]+colB;
                integral[i+rowLen+3]=integral[i+3]+colA;
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
                 xOff1 = xOff1<bx1 ? bx1 : xOff1;
                 xOff2 = xOff2>bx2 ? bx2 : xOff2;
                 yOff1 = yOff1<by1 ? by1 : yOff1;
                 yOff2 = yOff2>by2 ? by2 : yOff2;
                
                // compute integral positions
                p1=(xOff1 + yOff1)<<2; p4=(xOff2 + yOff2)<<2; p2=(xOff2 + yOff1)<<2; p3=(xOff1 + yOff2)<<2;
                
                // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                // also fix the center element (in case it is different)
                r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                a = wt * (integral[p4+3] - integral[p2+3] - integral[p3+3] + integral[p1+3])  +  (centerOffset * im[i+3]);
                
                r2 = wt2 * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset2 * im[i  ]);
                g2 = wt2 * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset2 * im[i+1]);
                b2 = wt2 * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset2 * im[i+2]);
                a2 = wt2 * (integral[p4+3] - integral[p2+3] - integral[p3+3] + integral[p1+3])  +  (centerOffset2 * im[i+3]);
                
                // output
                t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;  t3 = coeff1*a + coeff2*a2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;  dst[i+3] = ~~t3;
            }
            
            // do another pass??
        }
    }
    else
    {
        wt = matrix[0]; wtCenter = matrix[matArea>>1]; centerOffset = wtCenter-wt;
    
        // do this multiple times??
        for(repeat=0; repeat<numRepeats; repeat++)
        {
            //dst = new IMG(imLen); integral = new A32F(integralLen);
            tmp = im; im = dst; dst = tmp;
            
            // compute integral of image in one pass
            
            // first row
            i=0; colR=colG=colB=colA=0;
            for (x=0; x<w; x++, i+=4)
            {
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2]; colA+=im[i+3];
                integral[i]=colR; integral[i+1]=colG; integral[i+2]=colB; integral[i+3]=colA;
            }
            // other rows
            x=0; colR=colG=colB=colA=0;
            for (i=rowLen+w; i<imLen; i+=4, x++)
            {
                if (x>=w) { x=0; colR=colG=colB=colA=0; }
                colR+=im[i]; colG+=im[i+1]; colB+=im[i+2]; colA+=im[i+3];
                integral[i+rowLen  ]=integral[i  ]+colR; 
                integral[i+rowLen+1]=integral[i+1]+colG; 
                integral[i+rowLen+2]=integral[i+2]+colB;
                integral[i+rowLen+3]=integral[i+3]+colA;
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
                 xOff1 = xOff1<bx1 ? bx1 : xOff1;
                 xOff2 = xOff2>bx2 ? bx2 : xOff2;
                 yOff1 = yOff1<by1 ? by1 : yOff1;
                 yOff2 = yOff2>by2 ? by2 : yOff2;
                
                // compute integral positions
                p1=(xOff1 + yOff1)<<2; p4=(xOff2 + yOff2)<<2; p2=(xOff2 + yOff1)<<2; p3=(xOff1 + yOff2)<<2;
                
                // compute matrix sum of these elements (trying to avoid possible overflow in the process, order of summation can matter)
                // also fix the center element (in case it is different)
                r = wt * (integral[p4  ] - integral[p2  ] - integral[p3  ] + integral[p1  ])  +  (centerOffset * im[i  ]);
                g = wt * (integral[p4+1] - integral[p2+1] - integral[p3+1] + integral[p1+1])  +  (centerOffset * im[i+1]);
                b = wt * (integral[p4+2] - integral[p2+2] - integral[p3+2] + integral[p1+2])  +  (centerOffset * im[i+2]);
                a = wt * (integral[p4+3] - integral[p2+3] - integral[p3+3] + integral[p1+3])  +  (centerOffset * im[i+3]);
                
                // output
                t0 = coeff1*r + coeff2;  t1 = coeff1*g + coeff2;  t2 = coeff1*b + coeff2;  t3 = coeff1*a + coeff2;
                if (notSupportClamp)
                {   
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                    t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;  dst[i+3] = ~~t3;
            }
            
            // do another pass??
        }
    }
    return dst;
}
function integral_convolution(rgba, im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats)
{
    return rgba
    ? integral_convolution_rgba(im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats)
    : integral_convolution_rgb(im, w, h, matrix, matrix2, dimX, dimY, coeff1, coeff2, numRepeats)
    ;
}

// speed-up convolution for separable kernels
function separable_convolution(rgba, im, w, h, matrix, matrix2, ind1, ind2, coeff1, coeff2) 
{
    var imLen=im.length, imArea=(imLen>>2),
        matArea, mat, indices, matArea2,
        dst, imageIndices, imageIndices1, imageIndices2,
        i, j, k, x, ty, ty2,
        xOff, yOff, bx, by, t0, t1, t2, t3, wt,
        r, g, b, a, coeff, numPasses, tmp
    ;
    
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
    
    while (numPasses--)
    {
        tmp = im; im = dst; dst = tmp;
        matArea = mat.length;
        matArea2 = indices.length;
        
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
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        a += im[srcOff+3] * wt;
                    }
                }
                
                // output
                t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                if ( rgba )
                {
                    t3 = coeff * a;
                    t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                    dst[i+3] = ~~t3;
                }
                else
                {
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
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
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;
                        a += im[srcOff+3] * wt;
                    }
                }
                
                // output
                t0 = coeff * r;  t1 = coeff * g;  t2 = coeff * b;
                
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                if ( rgba )
                {
                    t3 = coeff * a;
                    dst[i+3] = ~~t3;
                }
                else
                {
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
            }
        }
        
        // do another pass??
        mat = matrix2;
        indices = ind2;
        coeff = coeff2;
        imageIndices = imageIndices2;
    }
    return dst;
}

function lerp( data, index, c1, c2, t )
{
    data[index  ] = (~~(c1[0] + t*(c2[0]-c1[0]))) & 255;
    data[index+1] = (~~(c1[1] + t*(c2[1]-c1[1]))) & 255;
    data[index+2] = (~~(c1[2] + t*(c2[2]-c1[2]))) & 255;
    data[index+3] = (~~(c1[3] + t*(c2[3]-c1[3]))) & 255;
}

function colors_stops( colors, stops )
{
    stops = stops ? stops.slice() : stops;
    colors = colors ? colors.slice() : colors;
    var cl = colors.length, i;
    if ( !stops )
    {
        if ( 1 === cl )
        {
            stops = [1.0];
        }
        else
        {
            stops = new Array(cl);
            for(i=0; i<cl; i++) stops[i] = i+1 === cl ? 1.0 : i/(cl-1);
        }
    }
    else if ( stops.length < cl )
    {
        var cstoplen = stops.length, cstop = stops[cstoplen-1];
        for(i=cstoplen; i<cl; i++) stops.push( i+1 === cl ? 1.0 : cstop+(i-cstoplen+1)/(cl-1) );
    }
    if ( 1.0 != stops[stops.length-1] )
    {
        stops.push( 1.0 );
        colors.push( colors[colors.length-1] );
    }
    return [colors, stops];
}

function gradient( g, w, h, colors, stops, angle, interpolate )
{
    var i, x, y, size = g.length, t, px, py, stop1, stop2, sin, cos, r;
    //interpolate = interpolate || lerp;
    angle = angle || 0.0;
    if ( 0 > angle ) angle += pi2;
    if ( pi2 < angle ) angle -= pi2;
    sin = Abs(Sin(angle)); cos = Abs(Cos(angle));
    r = cos*w + sin*h;
    if ( (pi_2 < angle) && (angle <= pi) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = w-1-x; py = y;
            t = Min(1.0, (cos*px + sin*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    else if ( (pi < angle) && (angle <= pi_32) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = w-1-x; py = h-1-y;
            t = Min(1.0, (cos*px + sin*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    else if ( (pi_32 < angle) && (angle < pi2) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = x; py = h-1-y;
            t = Min(1.0, (cos*px + sin*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    else //if ( (0 <= angle) && (angle <= pi_2) )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            px = x; py = y;
            t = Min(1.0, (cos*px + sin*py) / r);
            stop2 = 0; while ( t > stops[stop2] ) ++stop2;
            stop1 = 0 === stop2 ? 0 : stop2-1;
            interpolate(
                g, i,
                colors[stop1], colors[stop2],
                // warp the value if needed, between stop ranges
                stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
            );
        }
    }
    return g;
}

function radial_gradient( g, w, h, colors, stops, centerX, centerY, radiusX, radiusY, interpolate )
{
    var i, x, y, size = g.length, t, px, py, stop1, stop2;
    //interpolate = interpolate || lerp;
    centerX = centerX || 0; centerY = centerY || 0;
    radiusX = radiusX || 1.0; radiusY = radiusY || 1.0;
    //relative radii to generate elliptical gradient instead of circular (rX=rY=1)
    if ( radiusY > radiusX )
    {
        radiusX = radiusX/radiusY;
        radiusY = 1.0;
    }
    else if ( radiusX > radiusY )
    {
        radiusY = radiusY/radiusX;
        radiusX = 1.0;
    }
    else
    {
        radiusY = 1.0;
        radiusX = 1.0;
    }
    for(x=0,y=0,i=0; i<size; i+=4,x++)
    {
        if ( x >= w ) { x=0; y++; }
        px = radiusX*(x-centerX)/(w-centerX); py = radiusY*(y-centerY)/(h-centerY);
        t = Min(1.0, Sqrt(px*px + py*py));
        stop2 = 0; while ( t > stops[stop2] ) ++stop2;
        stop1 = 0 === stop2 ? 0 : stop2-1;
        interpolate(
            g, i,
            colors[stop1], colors[stop2],
            // warp the value if needed, between stop ranges
            stops[stop2] > stops[stop1] ? (t-stops[stop1]) / (stops[stop2]-stops[stop1]) : t
        );
    }
    return g;
}

function esc( s )
{
    return s.replace(esc_re, '\\$1');
}

MathUtil.clamp = clamp;
MathUtil.closest_power2 = closest_power_of_two;
MathUtil.Geometry = {
     Point2: point2
    ,Point3: point3
    ,enorm2: enorm2
    ,cross2: cross2
    ,normal2: normal2
    ,interpolate2: interpolate2
    ,interpolate3: interpolate3
};

StringUtil.esc = esc;
StringUtil.trim = String.prototype.trim 
? function( s ){ return s.trim(); }
: function( s ){ return s.replace(trim_re, ''); };

ImageUtil.crop = FILTER.Interpolation.crop = crop;
ImageUtil.pad = FILTER.Interpolation.pad = pad;
ImageUtil.get_data = get_data;
ImageUtil.set_data = set_data;
ImageUtil.fill = fill_data;
ImageUtil.integral = integral;
ImageUtil.histogram = histogram;
ImageUtil.spectrum = spectrum;
ImageUtil.gradient = gradient;
ImageUtil.radial_gradient = radial_gradient;
ImageUtil.lerp = lerp;
ImageUtil.colors_stops = colors_stops;

FilterUtil.integral_convolution = integral_convolution;
FilterUtil.separable_convolution = separable_convolution;

}(FILTER);/**
*
* Filter Interpolation methods
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var clamp = FILTER.Util.Math.clamp, IMG = FILTER.ImArray;

// http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
// http://tech-algorithm.com/articles/bilinear-image-scaling/
FILTER.Interpolation.bilinear = function( im, w, h, nw, nh ) {
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
};

}(FILTER);/**
*
* Filter Interpolation methods
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var clamp = FILTER.Util.Math.clamp, IMG = FILTER.ImArray;

// http://pixinsight.com/doc/docs/InterpolationAlgorithms/InterpolationAlgorithms.html
FILTER.Interpolation.nearest = function( im, w, h, nw, nh ) {
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
};

}(FILTER);/**
*
* Filter Interpolation methods
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var clamp = FILTER.Util.Math.clamp, IMG = FILTER.ImArray, A32F = FILTER.Array32F,
    subarray = FILTER.ArraySubArray;

// http://www.gamedev.net/topic/229145-bicubic-interpolation-for-image-resizing/
FILTER.Interpolation.bicubic = function( im, w, h, nw, nh ) {
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
        C = subarray(im, pixel, pixel+4);
        L = L_EDGE ? C : subarray(im, pixel-4, pixel);
        R = R_EDGE ? C : subarray(im, pixel+4, pixel+8);
        RR = R_EDGE ? C : subarray(im, pixel+8, pixel+12);
        B = B_EDGE ? C : subarray(im, pixel+w4, pixel+w4+4);
        BB = B_EDGE ? C : subarray(im, pixel+w4+w4, pixel+w4+w4+4);
        BL = B_EDGE||L_EDGE ? C : subarray(im, pixel+w4-4, pixel+w4);
        BR = B_EDGE||R_EDGE ? C : subarray(im, pixel+w4+4, pixel+w4+8);
        BRR = B_EDGE||R_EDGE ? C : subarray(im, pixel+w4+8, pixel+w4+12);
        BBL = B_EDGE||L_EDGE ? C : subarray(im, pixel+w4+w4-4, pixel+w4+w4);
        BBR = B_EDGE||R_EDGE ? C : subarray(im, pixel+w4+w4+4, pixel+w4+w4+8);
        BBRR = B_EDGE||R_EDGE ? C : subarray(im, pixel+w4+w4+8, pixel+w4+w4+12);
        T = T_EDGE ? C : subarray(im, pixel-w4, pixel-w4+4);
        TL = T_EDGE||L_EDGE ? C : subarray(im, pixel-w4-4, pixel-w4);
        TR = T_EDGE||R_EDGE ? C : subarray(im, pixel-w4+4, pixel-w4+8);
        TRR = T_EDGE||R_EDGE ? C : subarray(im, pixel-w4+8, pixel-w4+12);
        
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
};

}(FILTER);/**
*
* Color Methods / Transforms
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// adapted from https://github.com/foo123/css-color
var // utils
    Sqrt = Math.sqrt, round = Math.round, floor = Math.floor, 
    min = Math.min, max = Math.max, abs = Math.abs,
    //notSupportClamp = FILTER._notSupportClamp,
    clamp = FILTER.Util.Math.clamp,
    esc = FILTER.Util.String.esc,
    trim = FILTER.Util.String.trim,
    
    LUMA = FILTER.LUMA,
    C2F = 1/255, C2P = 100/255, P2C = 2.55,

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
        
        toGray: function( r, g, b ) { return ~~(LUMA[0]*r + LUMA[1]*g + LUMA[2]*b); }, 
        
        distance: function( rgb1, rgb2 ) {
            var dr=rgb1[0]-rgb2[0], dg=rgb1[1]-rgb2[1], db=rgb1[2]-rgb2[2];
            return Sqrt(dr*dr + dg*dg + db*db);
        },
        
        RGB2Color: function( rgb ) {
            return ((rgb[0] << 16) | (rgb[1] << 8) | (rgb[2])&255);
        },
        
        RGBA2Color: function( rgba ) {
            return ((rgba[3] << 24) | (rgba[0] << 16) | (rgba[1] << 8) | (rgba[2])&255);
        },
        
        Color2RGBA: function( c ) {
            c = ~~c;
            return [
                (c >>> 16) & 255,
                (c >>> 8) & 255,
                (c & 255),
                (c >>> 24) & 255
            ];
        },

        // http://en.wikipedia.org/wiki/YCbCr
        RGB2YCbCr: function( rgb ) {
            var r=rgb[0], g=rgb[1], b=rgb[2];
            // each take full range from 0-255
            return [
                ~~( 0   + 0.299*r    + 0.587*g     + 0.114*b    ),
                ~~( 128 - 0.168736*r - 0.331264*g  + 0.5*b      ),
                ~~( 128 + 0.5*r      - 0.418688*g  - 0.081312*b )
            ];
        },
        
        // http://en.wikipedia.org/wiki/YCbCr
        YCbCr2RGB: function( ycbcr ) {
            var y=ycbcr[0], cb=ycbcr[1], cr=ycbcr[2];
            // each take full range from 0-255
            return [
                ~~( y                      + 1.402   * (cr-128) ),
                ~~( y - 0.34414 * (cb-128) - 0.71414 * (cr-128) ),
                ~~( y + 1.772   * (cb-128) )
            ];
        },
        
        // http://en.wikipedia.org/wiki/HSL_color_space
        // adapted from http://www.cs.rit.edu/~ncs/colo
        RGB2HSV: function( rgb )  {
            var m, M, delta, r, g, b, h, s, v;

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
            var i, f, p, q, t, r, g, b, h, s, v;
            
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

            if ( 0 === i )      { r = v; g = t; b = p; }
            else if ( 1 === i ) { r = q;  g = v; b = p; }
            else if ( 2 === i ) { r = p; g = v; b = t; }
            else if ( 3 === i ) { r = p; g = q; b = v; }
            else if ( 4 === i ) { r = t; g = p; b = v; }
            else /* case 5: */  { r = v; g = p; b = q; }
            
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
        col2per: function( c, suffix ) {
            return (c*C2P)+(suffix||'');
        },
        per2col: function( c ) {
            return c*P2C;
        },
        
        // http://www.javascripter.net/faq/rgb2cmyk.htm
        rgb2cmyk: function( r, g, b, asPercent ) {
            var c = 0, m = 0, y = 0, k = 0, minCMY, invCMY;

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
        cmyk2rgb: function( c, m, y, k ) {
            var r = 0, g = 0, b = 0, minCMY, invCMY
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
        rgb2hex: function( r, g, b, condenced, asPercent ) { 
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
        rgb2hexIE: function( r, g, b, a, asPercent ) { 
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
        hex2rgb: function( h/*, asPercent*/ ) {  
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
        hue2rgb: function( p, q, t ) {
            if ( t < 0 ) t += 1;
            if ( t > 1 ) t -= 1;
            if ( t < 1/6 ) return p + (q - p) * 6 * t;
            if ( t < 1/2 ) return q;
            if ( t < 2/3 ) return p + (q - p) * (2/3 - t) * 6;
            return p;
        },
        hsl2rgb: function( h, s, l ) {
            var r, g, b, p, q, hue2rgb = Color.hue2rgb;

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
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
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
        rgb2hsl: function( r, g, b, asPercent ) {
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
        
        parse: function( s, withColorStops, parsed, onlyColor ) {
            var m, m2, s2, end = 0, end2 = 0, c, hasOpacity;
            
            if ( 'hsl' === parsed || 
                ( !parsed && (m = s.match(Color.hslRE)) ) 
            )
            {
                // hsl(a)
                if ( 'hsl' === parsed )
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
            if ( 'rgb' === parsed || 
                ( !parsed && (m = s.match(Color.rgbRE)) ) 
            )
            {
                // rgb(a)
                if ( 'rgb' === parsed )
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
            if ( 'hex' === parsed || 
                ( !parsed && (m = s.match(Color.hexRE)) ) 
            )
            {
                // hex
                if ( 'hex' === parsed )
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
            if ( 'keyword' === parsed || 
                ( !parsed && (m = s.match(Color.keywordRE)) ) 
            )
            {
                // keyword
                if ( 'keyword' === parsed )
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
        fromString: function( s, withColorStops, parsed ) {
            return Color.parse(s, withColorStops, parsed, 1);
        },
        fromRGB: function( rgb ) {
            return new Color().fromRGB(rgb);
        },
        fromHSL: function( hsl ) {
            return new Color().fromHSL(hsl);
        },
        fromCMYK: function( cmyk ) {
            return new Color().fromCMYK(cmyk);
        },
        fromHEX: function( hex ) {
            return new Color().fromHEX(hex);
        },
        fromKeyword: function( keyword ) {
            return new Color().fromKeyword(keyword);
        },
        fromPixel: function(pixCol) {
            return new Color().fromPixel(pixCol);
        }
    },
    
    constructor: function Color( color, cstop ) {
        // constructor factory pattern used here also
        if ( this instanceof Color ) 
        {
            this.reset( );
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
    
    clone: function( ) {
        var c = new Color();
        c.col = this.col.slice();
        c.cstop = this.cstop+'';
        c.kword = this.kword;
        return c;
    },
    
    reset: function( ) {
        this.col = [0, 0, 0, 1];
        this.cstop = '';
        this.kword = null;
        return this;
    },
    
    set: function( color, cstop ) {
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
    
    colorStop: function( cstop ) {
        this.cstop = cstop;
        return this;
    },
    
    isTransparent: function( ) {
        return 1 > this.col[3];
    },
    
    isKeyword: function( ) {
        return this.kword ? true : false;
    },
    
    fromPixel: function( color ) {
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
    
    fromKeyword: function( kword ) {
        
        kword = kword.toLowerCase();
        if ( Color.Keywords[kword] )
        {
            this.col = Color.Keywords[kword].slice();
            this.kword = kword;
        }
        return this;
    },
    
    fromHEX: function( hex ) {
        
        this.col[0] = hex[0] ? clamp(parseInt(hex[0], 10), 0, 255) : 0;
        this.col[1] = hex[1] ? clamp(parseInt(hex[1], 10), 0, 255) : 0;
        this.col[2] = hex[2] ? clamp(parseInt(hex[2], 10), 0, 255) : 0;
        this.col[3] = undef!==hex[3] ? clamp(parseInt(hex[3], 10)*C2F, 0, 1) : 1;
        
        this.kword = null;
        
        return this;
    },
    
    fromRGB: function( rgb ) {
        
        this.col[0] = rgb[0] ? clamp(round(rgb[0]), 0, 255) : 0;
        this.col[1] = rgb[1] ? clamp(round(rgb[1]), 0, 255) : 0;
        this.col[2] = rgb[2] ? clamp(round(rgb[2]), 0, 255) : 0;
        this.col[3] = undef!==rgb[3] ? clamp(rgb[3], 0, 1) : 1;
        
        this.kword = null;
        
        return this;
    },
    
    fromCMYK: function( cmyk ) {
        var rgb = Color.cmyk2rgb(cmyk[0]||0, cmyk[1]||0, cmyk[2]||0, cmyk[3]||0);
        
        this.col[0] = rgb[0];
        this.col[1] = rgb[1];
        this.col[2] = rgb[2];
        this.col[3] = undef!==cmyk[4] ? clamp(cmyk[4], 0, 1) : 1;
        
        this.kword = null;
        
        return this;
    },
    
    fromHSL: function( hsl ) {
        var rgb = Color.hsl2rgb(hsl[0]||0, hsl[1]||0, hsl[2]||0);
        
        this.col[0] = rgb[0];
        this.col[1] = rgb[1];
        this.col[2] = rgb[2];
        this.col[3] = undef!==hsl[3] ? clamp(hsl[3], 0, 1) : 1;
        
        this.kword = null;
        
        return this;
    },
    
    toPixel: function( withTransparency ) {
        if ( withTransparency )
            return ((clamp(this.col[3]*255, 0, 255) << 24) | (this.col[0] << 16) | (this.col[1] << 8) | (this.col[2])&255);
        else
            return ((this.col[0] << 16) | (this.col[1] << 8) | (this.col[2])&255);
    },
    
    toCMYK: function( asString, condenced, noTransparency ) {
        var cmyk = Color.rgb2cmyk(this.col[0], this.col[1], this.col[2]);
        if (noTransparency)
            return cmyk;
        else
            return cmyk.concat(this.col[3]);
    },
    
    toKeyword: function( asString, condenced, withTransparency ) {
        if ( this.kword )
            return this.kword;
        else
            return this.toHEX(1, condenced, withTransparency);
    },
    
    toHEX: function( asString, condenced, withTransparency ) {
        if ( withTransparency )
            return Color.rgb2hexIE( this.col[0], this.col[1], this.col[2], clamp(round(255*this.col[3]), 0, 255) );
        else
            return Color.rgb2hex( this.col[0], this.col[1], this.col[2], condenced );
    },
    
    toRGB: function( asString, condenced, noTransparency ) {
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
    
    toHSL: function( asString, condenced, noTransparency ) {
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
    
    toColorStop: function( compatType ) {
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

// JavaScript implementations of common image blending modes, based on
// http://stackoverflow.com/questions/5919663/how-does-photoshop-blend-two-images-together
Color.Blend = Color.Combine = {
    //p1 = p1 || 0; p2 = p2 || 0;
    
    normal: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
        
        // normal mode
        rb = r2;  
        gb = g2;  
        bb = b2;
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    lighten: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
        
        // lighten mode
        rb = r > r2 ? r : r2; 
        gb = g > g2 ? g : g2; 
        bb = b > b2 ? b : b2; 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    darken: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // darken mode
        rb = r > r2 ? r2 : r; 
        gb = g > g2 ? g2 : g; 
        bb = b > b2 ? b2 : b; 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    multiply: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // multiply mode
        rb = r * r2 * 0.003921568627451;
        gb = g * g2 * 0.003921568627451;
        bb = b * b2 * 0.003921568627451;
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    average: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // average mode
        rb = 0.5*(r + r2); 
        gb = 0.5*(g + g2); 
        bb = 0.5*(b + b2); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    add: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // add mode
        rb = r + r2; 
        gb = g + g2; 
        bb = b + b2; 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    subtract: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // subtract mode
        rb = r + r2 < 255 ? 0 : r + r2 - 255;  
        gb = g + g2 < 255 ? 0 : g + g2 - 255;  
        bb = b + b2 < 255 ? 0 : b + b2 - 255;  
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    difference: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // difference mode
        rb = abs(r2 - r); 
        gb = abs(g2 - g); 
        bb = abs(b2 - b); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    negation: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // negation mode
        rb = 255 - abs(255 - r2 - r);
        gb = 255 - abs(255 - g2 - g);
        bb = 255 - abs(255 - b2 - b);
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    screen: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // screen mode
        rb = 255 - (((255 - r2) * (255 - r)) >> 8); 
        gb = 255 - (((255 - g2) * (255 - g)) >> 8); 
        bb = 255 - (((255 - b2) * (255 - b)) >> 8); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    exclusion: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // exclusion mode
        rb = r2 + r - 2 * r2 * r * 0.003921568627451; 
        gb = g2 + g - 2 * g2 * g * 0.003921568627451; 
        bb = b2 + b - 2 * b2 * b * 0.003921568627451; 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    overlay: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // overlay mode
        rb = r < 128 ? (2 * r2 * r * 0.003921568627451) : (255 - 2 * (255 - r2) * (255 - r) * 0.003921568627451); 
        gb = g < 128 ? (2 * g2 * g * 0.003921568627451) : (255 - 2 * (255 - g2) * (255 - g) * 0.003921568627451); 
        rb = b < 128 ? (2 * b2 * b * 0.003921568627451) : (255 - 2 * (255 - b2) * (255 - b) * 0.003921568627451); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    softlight: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // softlight mode
        rb = r < 128 ? (2 * ((r2 >> 1) + 64)) * (r * 0.003921568627451) : 255 - (2 * (255 - (( r2 >> 1) + 64)) * (255 - r) * 0.003921568627451); 
        gb = g < 128 ? (2 * ((g2 >> 1) + 64)) * (g * 0.003921568627451) : 255 - (2 * (255 - (( g2 >> 1) + 64)) * (255 - g) * 0.003921568627451); 
        bb = b < 128 ? (2 * ((b2 >> 1) + 64)) * (b * 0.003921568627451) : 255 - (2 * (255 - (( b2 >> 1) + 64)) * (255 - b) * 0.003921568627451); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    // reverse of overlay
    hardlight: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // hardlight mode, reverse of overlay
        rb = r2 < 128 ? (2 * r * r2 * 0.003921568627451) : (255 - 2 * (255 - r) * (255 - r2) * 0.003921568627451); 
        gb = g2 < 128 ? (2 * g * g2 * 0.003921568627451) : (255 - 2 * (255 - g) * (255 - g2) * 0.003921568627451); 
        bb = b2 < 128 ? (2 * b * b2 * 0.003921568627451) : (255 - 2 * (255 - b) * (255 - b2) * 0.003921568627451); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    colordodge: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // colordodge mode
        rb = 255 === r ? r : min(255, ((r2 << 8 ) / (255 - r))); 
        gb = 255 === g ? g : min(255, ((g2 << 8 ) / (255 - g))); 
        bb = 255 === b ? b : min(255, ((b2 << 8 ) / (255 - b))); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    colorburn: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // colorburn mode
        rb = 0 === r ? r : max(0, (255 - ((255 - r2) << 8 ) / r)); 
        gb = 0 === g ? g : max(0, (255 - ((255 - g2) << 8 ) / g)); 
        bb = 0 === b ? b : max(0, (255 - ((255 - b2) << 8 ) / b)); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    linearlight: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb, tmp,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // linearlight mode
        if ( r < 128 )
        {
            tmp = r*2;
            rb = tmp + r2 < 255 ? 0 : tmp + r2 - 255; //linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r - 128);
            rb = tmp + r2; //linearDodge(a, (2 * (b - 128)))
        }
        if ( g < 128 )
        {
            tmp = g*2;
            gb = tmp + g2 < 255 ? 0 : tmp + g2 - 255; //linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g - 128);
            gb = tmp + g2; //linearDodge(a, (2 * (b - 128)))
        }
        if ( b < 128 )
        {
            tmp = b*2;
            bb = tmp + b2 < 255 ? 0 : tmp + b2 - 255; //linearBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (b - 128);
            bb = tmp + b2; //linearDodge(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    reflect: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // reflect mode
        rb = 255 === r ? r : min(255, (r2 * r2 / (255 - r))); 
        gb = 255 === g ? g : min(255, (g2 * g2 / (255 - g))); 
        bb = 255 === b ? b : min(255, (b2 * b2 / (255 - b))); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    // reverse of reflect
    glow: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // glow mode, reverse of reflect
        rb = 255 === r2 ? r2 : min(255, (r * r / (255 - r2))); 
        gb = 255 === g2 ? g2 : min(255, (g * g / (255 - g2))); 
        bb = 255 === b2 ? b2 : min(255, (b * b / (255 - b2))); 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    phoenix: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // phoenix mode
        rb = min(r2, r) - max(r2, r) + 255; 
        gb = min(g2, g) - max(g2, g) + 255; 
        bb = min(b2, b) - max(b2, b) + 255; 
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    vividlight: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb, tmp,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // vividlight mode
        if ( r < 128 )
        {
            tmp = 2*r;
            rb = 0 === tmp ? tmp : max(0, (255 - ((255 - r2) << 8 ) / tmp));  //colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            rb = 255 === tmp ? tmp : min(255, ((r2 << 8 ) / (255 - tmp)));  // colorDodge(a, (2 * (b - 128)))
        }
        if ( g < 128 )
        {
            tmp = 2*g;
            gb = 0 === tmp ? tmp : max(0, (255 - ((255 - g2) << 8 ) / tmp));  //colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g-128);
            gb = 255 === tmp ? tmp : min(255, ((g2 << 8 ) / (255 - tmp)));  // colorDodge(a, (2 * (b - 128)))
        }
        if ( b < 128 )
        {
            tmp = 2*b;
            bb = 0 === tmp ? tmp : max(0, (255 - ((255 - b2) << 8 ) / tmp));  //colorBurn(a, 2 * b)
        }
        else
        {
            tmp = 2 * (g-128);
            bb = 255 === tmp ? tmp : min(255, ((b2 << 8 ) / (255 - tmp)));  // colorDodge(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    pinlight: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb, tmp,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // pinlight mode
        if ( r < 128 )
        {
            tmp = 2*r;
            rb = tmp > r2 ? tmp : r2;  //darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            rb = tmp > r2 ? r2 : tmp;  // lighten(a, (2 * (b - 128)))
        }
        if ( g < 128 )
        {
            tmp = 2*g;
            gb = tmp > g2 ? tmp : g2;  //darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (r-128);
            gb = tmp > g2 ? g2 : tmp;  // lighten(a, (2 * (b - 128)))
        }
        if ( b < 128 )
        {
            tmp = 2*b;
            bb = tmp > b2 ? tmp : b2;  //darken(a, 2 * b)
        }
        else
        {
            tmp = 2 * (b-128);
            bb = tmp > b2 ? b2 : tmp;  // lighten(a, (2 * (b - 128)))
        }
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    },

    hardmix: function(rgba1, rgba2, p1, p2, do_clamp) { 
        var amount = rgba2[p2+3]*0.003921568627451,
            rb, gb, bb, tmp,
            r = rgba1[p1], g = rgba1[p1+1], b = rgba1[p1+2],
            r2 = rgba2[p2], g2 = rgba2[p2+1], b2 = rgba2[p2+2]
        ;
    
        // hardmix mode, blendModes.vividLight(a, b) < 128 ? 0 : 255;
        if ( r < 128 )
        {
            tmp = 2*r;
            rb = 0 === tmp ? tmp : max(0, (255 - ((255 - r2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (r-128);
            rb = 255 === tmp ? tmp : min(255, ((r2 << 8 ) / (255 - tmp)));
        }
        rb = rb < 128 ? 0 : 255;
        if ( g < 128 )
        {
            tmp = 2*g;
            gb = 0 === tmp ? tmp : max(0, (255 - ((255 - g2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (g-128);
            gb = 255 === tmp ? tmp : min(255, ((g2 << 8 ) / (255 - tmp)));
        }
        gb = gb < 128 ? 0 : 255;
        if ( b < 128 )
        {
            tmp = 2*b;
            bb = 0 === tmp ? tmp : max(0, (255 - ((255 - b2) << 8 ) / tmp));
        }
        else
        {
            tmp = 2 * (b-128);
            bb = 255 === tmp ? tmp : min(255, ((b2 << 8 ) / (255 - tmp)));
        }
        bb = bb < 128 ? 0 : 255;
        
        // amount compositing
        r = r + amount * (rb-r);
        g = g + amount * (gb-g);
        b = b + amount * (bb-b);
        
        if (do_clamp)
        {
            // clamp them manually
            r = r<0 ? 0 : (r>255 ? 255 : r);
            g = g<0 ? 0 : (g>255 ? 255 : g);
            b = b<0 ? 0 : (b>255 ? 255 : b);
        }
        
        // output
        rgba1[p1] = ~~r; rgba1[p1+1] = ~~g; rgba1[p1+2] = ~~b;
    }
};
// aliases
Color.Blend.lineardodge = Color.Blend.add;
Color.Blend.linearburn = Color.Blend.subtract;
 
}(FILTER);/**
*
* Canvas Proxy Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var CanvasProxy, CanvasProxyCtx, IMG = FILTER.ImArray, ImageUtil = FILTER.Util.Image,
    Color = FILTER.Color, Min = Math.min, Max = Math.max, resize = FILTER.Interpolation.bilinear,
    get = ImageUtil.get_data, set = ImageUtil.set_data, fill = ImageUtil.fill
;

function scale( d, w, h, nw, nh )
{
    return (w === nw) && (h === nh) ? d : resize( d, w, h, nw, nh );
}

CanvasProxyCtx = FILTER.Class({
    constructor: function CanvasProxyCtx( canvas ) {
        var self = this;
        self._cnv = canvas;
        self._transform = {scale:[1,1], translate:[0,0], rotate:[0,0]};
        self._data = null;
    },
    
    _cnv: null,
    _w: 0, _h: 0,
    _transform: null,
    _data: null,
    fillStyle: null,
    
    dispose: function( ) {
        var self = this;
        self._cnv = null;
        self._data = null;
        self._transform = null;
        return self;
    },
    
    fillRect: function( x, y, w, h ) {
        var self = this, W = self._w, H = self._h, col, fillStyle = self.fillStyle;
        if ( null == x ) x = 0;
        if ( null == y ) y = 0;
        if ( null == w ) w = W;
        if ( null == h ) h = H;
        if ( fillStyle === +fillStyle )
        {
            col = Color.Color2RGBA( fillStyle );
        }
        else if ( fillStyle && fillStyle.substr )
        {
            col = Color.fromString( fillStyle ).toRGB( false );
            col[3] = ~~(255*col[3]);
        }
        else
        {
            col = fillStyle && (2 < fillStyle.length) ? fillStyle : [0,0,0,0];
        }
        fill( self._data, W, H, col, x, y, x+w-1, y+h-1 );
    },
    
    clearRect: function( x, y, w, h ) {
        var self = this, W = self._w, H = self._h;
        if ( null == x ) x = 0;
        if ( null == y ) y = 0;
        if ( null == w ) w = W;
        if ( null == h ) h = H;
        fill( self._data, W, H, [0,0,0,0], x, y, x+w-1, y+h-1 );
    },
    
    drawImage: function( canvas, sx, sy, sw, sh, dx, dy, dw, dh ) {
        var self = this, W = self._w, H = self._h,
            w = canvas._ctx._w, h = canvas._ctx._h,
            idata = canvas._ctx._data,
            argslen = arguments.length
        ;
        if ( 3 === argslen )
        {
            dx = sx; dy = sy;
            set( self._data, W, H, idata, w, h, 0, 0, w-1, h-1, dx, dy );
        }
        else if ( 5 === argslen )
        {
            dx = sx; dy = sy;
            dw = sw; dh = sh;
            set( self._data, W, H, scale( idata, w, h, dw, dh ), dw, dh, 0, 0, dw-1, dh-1, dx, dy );
        }
        else
        {
            set( self._data, W, H, scale( get( idata, w, h, sx, sy, sx+sw-1, sy+sh-1, true ), sw, sh, dw, dh ), dw, dh, 0, 0, dw-1, dh-1, dx, dy );
        }
    },
    
    createImageData: function( w, h ) {
        var self = this;
        self._data = new IMG((w*h)<<2);
        self._w = w; self._h = h;
        fill( self._data, w, h, [0,0,0,0], 0, 0, w-1, h-1 );
        return self;
    },
    
    putImageData: function( data, x, y ) {
        var self = this, W = self._w, H = self._h,
            w = data.width, h = data.height;
        if ( null == x ) x = 0;
        if ( null == y ) y = 0;
        set( self._data, W, H, data.data, w, h, 0, 0, w-1, h-1, x, y );
    },
    
    getImageData: function( x, y, w, h ) {
        var self = this, W = self._w, H = self._h, x1, y1, x2, y2;
        if ( null == x ) x = 0;
        if ( null == y ) y = 0;
        if ( null == w ) w = W;
        if ( null == h ) h = H;
        x1 = Max(0, Min(x, w-1, W-1));
        y1 = Max(0, Min(y, h-1, H-1));
        x2 = Min(x1+w-1, w-1, W-1);
        y2 = Min(y1+h-1, h-1, H-1);
        return {data: get( self._data, W, H, x1, y1, x2, y2 ), width: x2-x1+1, height: y2-y1+1};
    },
    
    scale: function( sx, sy ) {
        var self = this;
        self._transform.scale[0] = sx;
        self._transform.scale[1] = sy;
        return self;
    },
    
    translate: function( tx, ty ) {
        var self = this;
        self._transform.translate[0] = tx;
        self._transform.translate[1] = ty;
        return self;
    }
});

CanvasProxy = FILTER.CanvasProxy = FILTER.Class({
    constructor: function CanvasProxy( w, h ) {
        var self = this;
        self.width = w || 0;
        self.height = h || 0;
        self.style = { };
        self._ctx = new CanvasProxyCtx( self );
    },
    
    _ctx: null,
    width: null,
    height: null,
    style: null,
    
    dispose: function( ) {
        var self = this;
        self.width = null;
        self.height = null;
        self.style = null;
        self._ctx.dispose( );
        self._ctx = null;
        return self;
    },
    
    getContext: function( context ) {
        return this._ctx;
    },
    
    toDataURL: function( mime ) {
        return '';
    }
});

FILTER.Canvas = function( w, h ) {
    var canvas = FILTER.Browser.isNode ? new CanvasProxy( ) : document.createElement( 'canvas' );
    w = w || 0; h = h || 0;
    
    // set the display size of the canvas.
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
     
    // set the size of the drawingBuffer
    canvas.width = w * FILTER.devicePixelRatio;
    canvas.height = h * FILTER.devicePixelRatio;
    
    return canvas;
};

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
    ImageUtil = FILTER.Util.Image, Canvas = FILTER.Canvas, CanvasProxy = FILTER.CanvasProxy,
    FORMAT = FILTER.FORMAT, MIME = FILTER.MIME, ID = 0,
    notSupportTyped = FILTER._notSupportTypedArrays,
    arrayset = FILTER.ArraySet, subarray = FILTER.ArraySubArray,
    Min = Math.min, Floor = Math.floor,

    IDATA = 1, ODATA = 2, ISEL = 4, OSEL = 8, HIST = 16, SAT = 32, SPECTRUM = 64,
    WIDTH = 2, HEIGHT = 4, WIDTH_AND_HEIGHT = WIDTH | HEIGHT,
    SEL = ISEL|OSEL, DATA = IDATA|ODATA,
    CLEAR_DATA = ~DATA, CLEAR_SEL = ~SEL,
    CLEAR_HIST = ~HIST, CLEAR_SAT = ~SAT, CLEAR_SPECTRUM = ~SPECTRUM
;

// auxilliary (private) methods
function tmp_canvas( scope ) 
{
    var w = scope.width, h = scope.height, cnv = Canvas( w, h );
    cnv.width = w * devicePixelRatio;
    cnv.height = h * devicePixelRatio;
    return cnv;
}

function set_dimensions( scope, w, h, what ) 
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

function refresh_data( scope, what ) 
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

function refresh_selected_data( scope, what ) 
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
        self.id = ++ID;
        self.width = w; self.height = h;
        self.iData = null; self.iDataSel = null;
        self.oData = null; self.oDataSel = null;
        self.iCanvas = Canvas(w, h);
        self.oCanvas = Canvas(w, h);
        self.tmpCanvas = null;
        self.domElement = self.oCanvas;
        self.ictx = self.iCanvas.getContext('2d');
        self.octx = self.oCanvas.getContext('2d');
        self.webgl = null;
        self._histogram = [null, null, null, null];
        self._integral = [null, null, null, null];
        self._spectrum = [null, null, null, null];
        self._histogramRefresh = [0, 0, 0, 0];
        self._integralRefresh = [0, 0, 0, 0];
        self._spectrumRefresh = [0, 0, 0, 0];
        // lazy
        self.selection = null;
        self._needsRefresh = 0;
        self._restorable = true;
        self._grayscale = false;
        if ( img ) self.image( img );
    }
    
    // properties
    ,id: null
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
        self.id = null;
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
        self._histogramRefresh = null;
        self._integralRefresh = null;
        self._spectrumRefresh = null;
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
            self._histogramRefresh = [1, 1, 1, 1];
            self._integralRefresh = [1, 1, 1, 1];
            self._spectrumRefresh = [1, 1, 1, 1];
            if (self.selection) self._needsRefresh |= OSEL;
        }
        return self;
    }
    
    ,dimensions: function( w, h ) {
        var self = this;
        set_dimensions(self, w, h, WIDTH_AND_HEIGHT);
        self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,scale: function( sx, sy ) {
        var self = this;
        sx = sx||1; sy = sy||sx;
        if ( 1==sx && 1==sy ) return self;
        
        // lazy
        self.tmpCanvas = self.tmpCanvas || tmp_canvas( self );
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
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,flipHorizontal: function( ) {
        var self = this;
        // lazy
        self.tmpCanvas = self.tmpCanvas || tmp_canvas( self );
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
        
        self._needsRefresh |= DATA | SAT | SPECTRUM;
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,flipVertical: function( ) {
        var self = this;
        // lazy
        self.tmpCanvas = self.tmpCanvas || tmp_canvas( self );
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
        
        self._needsRefresh |= DATA | SAT | SPECTRUM;
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
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
            self._histogramRefresh = [1, 1, 1, 1];
            self._integralRefresh = [1, 1, 1, 1];
            self._spectrumRefresh = [1, 1, 1, 1];
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
        self.tmpCanvas = self.tmpCanvas || tmp_canvas( self );
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
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
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
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (sel) self._needsRefresh |= SEL;
        return self;
    }
    
    // get direct data array
    ,getData: function( ) {
        var self = this, Data;
        if ( self._restorable )
        {
        if (self._needsRefresh & IDATA) refresh_data( self, IDATA );
        Data = self.iData;
        }
        else
        {
        if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
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
            if (self._needsRefresh & ISEL) refresh_selected_data( self, ISEL );
            sel = self.iDataSel;
            }
            else
            {
            if (self._needsRefresh & OSEL) refresh_selected_data( self, OSEL );
            sel = self.oDataSel;
            }
        }
        else
        {
            if ( self._restorable )
            {
            if (self._needsRefresh & IDATA) refresh_data( self, IDATA );
            sel = self.iData;
            }
            else
            {
            if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
            sel = self.oData;
            }
        }
        // clone it
        return [new IMGcpy( sel.data ), sel.width, sel.height];
    }
    
    // get processed data array
    ,getProcessedData: function( ) {
        var self = this;
        if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
        // clone it
        return new IMGcpy( self.oData.data );
    }
    
    // get processed data array of selected part
    ,getProcessedSelectedData: function( ) {
        var self = this, sel;
        
        if (self.selection)  
        {
            if (self._needsRefresh & OSEL) refresh_selected_data( self, OSEL );
            sel = self.oDataSel;
        }
        else
        {
            if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
            sel = self.oData;
        }
        // clone it
        return [new IMGcpy( sel.data ), sel.width, sel.height];
    }
    
    // set direct data array
    ,setData: function(a) {
        var self = this;
        if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
        arrayset(self.oData.data, a); // not supported in Opera, IE, Safari
        self.octx.putImageData(self.oData, 0, 0); 
        self._needsRefresh |= HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
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
            if (self._needsRefresh & OSEL) refresh_selected_data( self, OSEL );
            arrayset(self.oDataSel.data, a); // not supported in Opera, IE, Safari
            self.octx.putImageData(self.oDataSel, xs, ys); 
            self._needsRefresh |= ODATA;
        }
        else
        {
            if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
            arrayset(self.oData.data, a); // not supported in Opera, IE, Safari
            self.octx.putImageData(self.oData, 0, 0); 
        }
        self._needsRefresh |= HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        return self;
    }
    
    ,createImageData: function( w, h ) {
        var self = this, ictx, octx;
        set_dimensions(self, w, h, WIDTH_AND_HEIGHT);
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
            isVideo, isCanvas, isImage//, isImageData
        ;
        
        if ( img instanceof FilterImage ) img = img.oCanvas;
        isVideo = ("undefined" !== typeof HTMLVideoElement) && (img instanceof HTMLVideoElement);
        isCanvas = (("undefined" !== typeof HTMLCanvasElement) && (img instanceof HTMLCanvasElement)) || (img instanceof CanvasProxy);
        isImage = ("undefined" !== typeof Image) && (img instanceof Image);
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
            set_dimensions(self, w, h, WIDTH_AND_HEIGHT);
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
                refresh_data(self, DATA);
            }
            
            if ( self._restorable )
            {
            ictx = self.ictx = self.iCanvas.getContext('2d');
            arrayset(self.iData.data, img.data); // not supported in Opera, IE, Safari
            ictx.putImageData(self.iData, 0, 0); 
            }
            
            octx = self.octx = self.oCanvas.getContext('2d');
            arrayset(self.oData.data, img.data); // not supported in Opera, IE, Safari
            octx.putImageData(self.oData, 0, 0); 
            //self._needsRefresh &= CLEAR_DATA;
        }
        //self.webgl = FILTER.useWebGL ? new FILTER.WebGL(self.domElement) : null;
        self._needsRefresh |= HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= SEL;
        return self;
    }
    
    ,getPixel: function( x, y ) {
        var self = this;
        if (self._needsRefresh & ODATA) refresh_data( self, ODATA );
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
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= OSEL;
        return self;
    }
    
    // get the imageData object
    ,getPixelData: function( ) {
        if (this._needsRefresh & ODATA) refresh_data( this, ODATA );
        return this.oData;
    }
    
    // set the imageData object
    ,setPixelData: function( data ) {
        var self = this;
        self.octx.putImageData(data, 0, 0); 
        self._needsRefresh |= ODATA | HIST | SAT | SPECTRUM;
        self._histogramRefresh = [1, 1, 1, 1];
        self._integralRefresh = [1, 1, 1, 1];
        self._spectrumRefresh = [1, 1, 1, 1];
        if (self.selection) self._needsRefresh |= OSEL;
        return self;
    }
    
    ,integral: function( channel ) {
        var self = this, integral = ImageUtil.integral, grayscale = self._grayscale;
        if ( null == channel )
        {
            if ( self._needsRefresh & SAT )
            {
                var data = self.getPixelData().data, w = self.width, h = self.height,
                    i0 = integral(data, w, h, 0);
                self._integral = [
                    i0,
                    grayscale ? i0 : integral(data, w, h, 1),
                    grayscale ? i0 : integral(data, w, h, 2),
                    integral(data, w, h, 3)
                ];
                self._integralRefresh = [0, 0, 0, 0];
                self._needsRefresh &= CLEAR_SAT;
            }
        }
        else
        {
            channel = channel || 0;
            if ( (self._needsRefresh & SAT) || self._integralRefresh[channel] )
            {
                if ( grayscale && !self._integralRefresh[0] )
                    self._integral[channel] = self._integral[0];
                else
                    self._integral[channel] = integral(self.getPixelData().data, self.width, self.height, channel);
                self._integralRefresh[channel] = 0;
                self._needsRefresh &= CLEAR_SAT;
            }
        }
        return null == channel ? self._integral : self._integral[channel||0];
    }
    
    ,histogram: function( channel ) {
        var self = this, hist = ImageUtil.histogram, grayscale = self._grayscale;
        if ( null == channel )
        {
            if ( self._needsRefresh & HIST )
            {
                var data = self.getPixelData().data, w = self.width, h = self.height,
                    h0 = hist(data, w, h, 0);
                self._histogram = [
                    h0,
                    grayscale ? h0 : hist(data, w, h, 1),
                    grayscale ? h0 : hist(data, w, h, 2),
                    null//hist(data, w, h, 3)
                ];
                self._histogramRefresh = [0, 0, 0, 0];
                self._needsRefresh &= CLEAR_HIST;
            }
        }
        else
        {
            channel = channel || 0;
            if ( (self._needsRefresh & HIST) || self._histogramRefresh[channel] )
            {
                if ( grayscale && !self._histogramRefresh[0] )
                    self._histogram[channel] = self._histogram[0];
                else
                    self._histogram[channel] = hist(self.getPixelData().data, self.width, self.height, channel);
                self._histogramRefresh[channel] = 0;
                self._needsRefresh &= CLEAR_HIST;
            }
        }
        return null == channel ? self._histogram : self._histogram[channel||0];
    }
    
    // TODO
    ,spectrum: function( channel ) {
        var self = this, spec = ImageUtil.spectrum;
        /*
        if (self._needsRefresh & SPECTRUM) 
        {
                channel = channel || 0;
            var data = self.getPixelData().data, w = self.width, h = self.height;
            self._spectrum[channel] = spec(data, w, h, channel);
            self._needsRefresh &= CLEAR_SPECTRUM;
        }
        */
        return null == channel ? self._spectrum : self._spectrum[channel||0];
    }
    
    ,toImage: function( format ) {
        var canvas = this.oCanvas, uri, quality = 1.0;
        if ( FORMAT.JPG === (format & 16) )
        {
            uri = canvas.toDataURL( MIME.JPG, quality );
        }
        else if ( FORMAT.GIF === (format & 16) )
        {
            uri = canvas.toDataURL( MIME.GIF, quality );
        }
        else/* if( FORMAT.PNG === (format & 16) )*/
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
FilterImage.Gradient = function Gradient( w, h, colors, stops, angle, interpolate ) {
    var Grad = new FilterImage().restorable(false).createImageData(w, h), c = ImageUtil.colors_stops( colors, stops );
    Grad.setData( ImageUtil.gradient( Grad.getData(), w, h, c[0], c[1], angle, interpolate||ImageUtil.lerp ) );
    return Grad;
};
FilterImage.RadialGradient = function RadialGradient( w, h, colors, stops, centerX, centerY, radiusX, radiusY, interpolate ) {
    var Grad = new FilterImage().restorable(false).createImageData(w, h), c = ImageUtil.colors_stops( colors, stops );
    Grad.setData( ImageUtil.radial_gradient( Grad.getData(), w, h, c[0], c[1], centerX, centerY, radiusX, radiusY, interpolate||ImageUtil.lerp ) );
    return Grad;
};
FilterImage.PerlinNoise = function PerlinNoise( w, h, seed, seamless, grayscale, baseX, baseY, octaves, offsets, scale, roughness, use_perlin ) {
    var perlinNoise = new FilterImage().restorable(false).createImageData(w, h);
    if ( ImageUtil.perlin )
    {
        if ( seed ) ImageUtil.perlin.seed( seed );
        perlinNoise.setData( ImageUtil.perlin(perlinNoise.getData(), w, h, seamless, grayscale, baseX, baseY, octaves, offsets, scale, roughness, use_perlin) );
    }
    return perlinNoise;
};

// resize/scale/interpolate image data
ImageUtil.scale = ImageUtil.resize = FILTER.Interpolation.bilinear;

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
            isVideo, isCanvas, isImage//, isImageData
        ;
        
        if ( img instanceof FilterImage ) img = img.oCanvas;
        isVideo = ("undefined" !== typeof HTMLVideoElement) && (img instanceof HTMLVideoElement);
        isCanvas = (("undefined" !== typeof HTMLCanvasElement) && (img instanceof HTMLCanvasElement)) || (img instanceof CanvasProxy);
        isImage = ("undefined" !== typeof Image) && (img instanceof Image);
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
            set_dimensions(self, sw, sh, WIDTH_AND_HEIGHT);
            if ( self._restorable ) 
            {
            ictx = self.ictx = self.iCanvas.getContext('2d');
            ictx.drawImage(img, 0, 0, w, h, 0, 0, sw, sh);
            }
            octx = self.octx = self.oCanvas.getContext('2d');
            octx.drawImage(img, 0, 0, w, h, 0, 0, sw, sh);
            self._needsRefresh |= DATA | HIST | SAT | SPECTRUM;
            self._histogramRefresh = [1, 1, 1, 1];
            self._integralRefresh = [1, 1, 1, 1];
            self._spectrumRefresh = [1, 1, 1, 1];
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
* Filter Loader/Reader/Writer I/O Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

FILTER.IO.Loader = FILTER.IO.Reader = FILTER.Class({
    name: "IO.Loader",
    
    __static__: {
        // accessible as "$class.load" (extendable and with "late static binding")
        load: FILTER.Method(function($super, $private, $class){
              // $super is the direct reference to the superclass itself (NOT the prototype)
              // $private is the direct reference to the private methods of this class (if any)
              // $class is the direct reference to this class itself (NOT the prototype)
              return function( url, onLoad, onError ) {
                return new $class().load(url, onLoad, onError);
            }
        }, FILTER.LATE|FILTER.STATIC )
    },
    
    constructor: function Loader() {
        /*var self = this;
        if ( !(self instanceof Loader) )
            return new Loader( );*/
    },
    
    _crossOrigin: null,
    _responseType: null,
    
    dispose: function( ) {
        var self = this;
        self._crossOrigin = null;
        self._responseType = null;
        return self;
    },
    
    // override in sub-classes
    load: function( url, onLoad, onError ){
        return null;
    },

    responseType: function ( value ) {
        var self = this;
        if ( arguments.length )
        {
            self._responseType = value;
            return self;
        }
        return self._responseType;
    },

    crossOrigin: function ( value ) {
        var self = this;
        if ( arguments.length )
        {
            self._crossOrigin = value;
            return self;
        }
        return self._crossOrigin;
    }
});
// aliases
FILTER.IO.Loader.prototype.read = FILTER.IO.Loader.prototype.load;

FILTER.IO.Writer = FILTER.Class({
    name: "IO.Writer",
    
    __static__: {
        // accessible as "$class.load" (extendable and with "late static binding")
        write: FILTER.Method(function($super, $private, $class){
              // $super is the direct reference to the superclass itself (NOT the prototype)
              // $private is the direct reference to the private methods of this class (if any)
              // $class is the direct reference to this class itself (NOT the prototype)
              return function( file, data, onWrite, onError ) {
                return new $class().write(file, data, onWrite, onError);
            }
        }, FILTER.LATE|FILTER.STATIC )
    },
    
    constructor: function Writer() {
        /*var self = this;
        if ( !(self instanceof Writer) )
            return new Writer( );*/
    },
    
    _encoding: null,
    
    dispose: function( ) {
        var self = this;
        self._encoding = null;
        return self;
    },
    
    // override in sub-classes
    write: function( file, data, onWrite, onError ){
        return null;
    },

    encoding: function ( value ) {
        var self = this;
        if ( arguments.length )
        {
            self._encoding = value;
            return self;
        }
        return self._encoding;
    }
});

}(FILTER);/**
*
* Filter Fx, perlin/simplex noise
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var ImageUtil = FILTER.Util.Image, Image = FILTER.Image, FLOOR = Math.floor,
    sin = Math.sin, cos = Math.cos, PI2 = FILTER.CONST.PI2, Array8U = FILTER.Array8U;
 
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

// adapted from: http://www.java-gaming.org/index.php?topic=31637.0
/*function octaved(seamless, noise, x, y, w, h, ibx, iby, octaves, offsets, scale, roughness)
{
    var noiseSum = 0, layerFrequency = scale, layerWeight = 1, weightSum = 0, 
        octave, nx, ny, w2 = w>>>1, h2 = h>>>1;

    for (octave=0; octave<octaves; octave++) 
    {
        nx = (x + offsets[octave][0]) % w; ny = (y + offsets[octave][1]) % h;
        if ( seamless )
        {
            // simulate seamless stitching, i.e circular/tileable symmetry
            if ( nx > w2 ) nx = w-1-nx;
            if ( ny > h2 ) ny = h-1-ny;
        }
        noiseSum += noise( layerFrequency*nx*ibx, layerFrequency*ny*iby ) * layerWeight;
        layerFrequency *= 2;
        weightSum += layerWeight;
        layerWeight *= roughness;
    }
    return noiseSum / weightSum;
}*/
function octaved(data, index, noise, x, y, w, h, ibx, iby, octaves, offsets, scale, roughness)
{
    var noiseSum = 0, layerFrequency = scale, layerWeight = 1, weightSum = 0, 
        octave, nx, ny, w2 = w>>>1, h2 = h>>>1, v;

    for (octave=0; octave<octaves; octave++) 
    {
        nx = (x + offsets[octave][0]) % w; ny = (y + offsets[octave][1]) % h;
        noiseSum += noise( layerFrequency*nx*ibx, layerFrequency*ny*iby ) * layerWeight;
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

    for (octave=0; octave<octaves; octave++) 
    {
        nx = (x + offsets[octave][0]) % w; ny = (y + offsets[octave][1]) % h;
        noiseSum += noise( layerFrequency*nx*ibx, layerFrequency*ny*iby ) * layerWeight;
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

ImageUtil.perlin = function perlin( n, w, h, seamless, grayscale, baseX, baseY, octaves, offsets, scale, roughness, use_perlin ) {
    var invBaseX = 1.0/baseX, invBaseY = 1.0/baseY,
        noise = use_perlin ? perlin2 : simplex2,
        generate = grayscale ? octaved : octaved_rgb,
        x, y, nx, ny, i, j, size = n.length, w2 = w>>>1, h2 = h>>>1;
    scale = scale || 1.0; roughness = roughness || 0.5;
    octaves = octaves || 1; offsets = offsets || [[0,0]];
    if ( seamless )
    {
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            // simulate seamless stitching, i.e circular/tileable symmetry
            nx = x > w2 ? w-1-x : x;
            ny = y > h2 ? h-1-y : y;
            if ( (nx < x) || (ny < y) )
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
        for(x=0,y=0,i=0; i<size; i+=4,x++)
        {
            if ( x >= w ) { x=0; y++; }
            generate(n, i, noise, x, y, w, h, invBaseX, invBaseY, octaves, offsets, scale, roughness);
        }
    }
    return n;
};
ImageUtil.perlin.seed = seed;

}(FILTER);
/* main code ends here */
/* export the module */
return FILTER;
});
/**
*
*   FILTER.js I/O Classes
*   @version: 0.9.5
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (I/O Loaders)
*   https://github.com/foo123/FILTER.js
*
**/!function( root, factory ){
"use strict";
if ( ('object'===typeof module) && module.exports ) /* CommonJS */
    module.exports = factory.call(root,(module.$deps && module.$deps["FILTER"]) || require("./FILTER".toLowerCase()));
else if ( ("function"===typeof define) && define.amd && ("function"===typeof require) && ("function"===typeof require.specified) && require.specified("FILTER_IO") /*&& !require.defined("FILTER_IO")*/ ) 
    define("FILTER_IO",['module',"FILTER"],function(mod,module){factory.moduleUri = mod.uri; factory.call(root,module); return module;});
else /* Browser/WebWorker/.. */
    (factory.call(root,root["FILTER"])||1)&&('function'===typeof define)&&define.amd&&define(function(){return root["FILTER"];} );
}(  /* current root */          this, 
    /* module factory */        function ModuleFactory__FILTER_IO( FILTER ){
/* main code starts here */

/**
*
*   FILTER.js I/O Classes
*   @version: 0.9.5
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (I/O Loaders)
*   https://github.com/foo123/FILTER.js
*
**/
"use strict";
var FILTER_IO_PATH = FILTER.getPath( ModuleFactory__FILTER_IO.moduleUri );
/**
*
* Filter Utils, cross-platform XmlHttpRequest (XHR)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var HAS = 'hasOwnProperty', toString = Object.prototype.toString,
    KEYS = Object.keys, CRLF = "\r\n", trim = FILTER.Util.String.trim
;

// adapted from https://github.com/foo123/RT
function header_encode( headers, xmlHttpRequest, httpRequestResponse )
{
    var header = '';
    if ( !headers ) return xhr ? xhr : header;
    var keys = KEYS(headers), key, i, l, k, kl;
    if ( httpRequestResponse )
    {
        for(i=0,l=keys.length; i<l; i++)
        {
            key = keys[i];
            // both single value and array
            httpRequestResponse.setHeader(key, headers[key]);
        }
        return httpRequestResponse;
    }
    else if ( xmlHttpRequest )
    {
        for(i=0,l=keys.length; i<l; i++)
        {
            key = keys[i];
            if ( '[object Array]' === toString.call(headers[key]) )
            {
                for(k=0,kl=headers[key].length; k<kl; k++)
                    xmlHttpRequest.setRequestHeader(key, String(headers[key][k]));
            }
            else
            {
                xmlHttpRequest.setRequestHeader(key, String(headers[key]));
            }
        }
        return xmlHttpRequest;
    }
    else
    {
        for(i=0,l=keys.length; i<l; i++)
        {
            key = keys[i];
            if ( '[object Array]' === toString.call(headers[key]) )
            {
                if ( header.length ) header += CRLF;
                header += key + ': ' + String(headers[key][0]);
                for(k=1,kl=headers[key].length; k<kl; k++)
                    header += CRLF + String(headers[key][k]);
            }
            else
            {
                if ( header.length ) header += CRLF;
                header += key + ': ' + String(headers[key]);
            }
        }
        return header;
    }
}

function header_decode( headers, lowercase )
{
    var header = { }, key = null, parts, i, l, line;
    if ( !!headers )
    {
        lowercase = true === lowercase;
        headers = headers.split( CRLF );
        for (i=0,l=headers.length; i<l; i++)
        {
            line = headers[i];
            parts = line.split(':');
            if ( parts.length > 1 )
            {
                key = trim(parts.shift());
                if ( lowercase ) key = key.toLowerCase();
                if ( header[HAS](key) )
                {
                    if ( 'string' === typeof header[key] ) header[key] = [header[key]];
                    header[key].push( trim(parts.join(':')) );
                }
                else
                {
                    header[key] = trim(parts.join(':'));
                }
            }
            else if ( parts[0].length && key )
            {
                header[key] = CRLF + parts[0];
            }
        }
    }
    return header;
}

FILTER.Util.Http = {
    Header: {
        encode: header_encode,
        decode: header_decode
    }
};

var XHR = FILTER.Util.XHR = function XHR( send, abort ){
    var xhr = this, aborted = false;
    xhr.readyState = XHR.UNSENT;
    xhr.status = null;
    xhr.statusText = null;
    xhr.responseType = 'text';
    xhr.responseURL = null;
    xhr.response = null;
    xhr.responseText = null;
    xhr.responseXml = null;
    xhr._rawHeaders = null;
    xhr._headers = null;
    xhr.send = function( payload ) {
        if ( aborted || (XHR.UNSENT !== xhr.readyState) ) return xhr;
        if ( send ) send( payload );
        xhr.readyState = XHR.OPENED;
        return xhr;
    };
    xhr.abort = function( ){
        if ( aborted ) return xhr;
        aborted = true;
        if ( abort ) abort( );
        return xhr;
    };
    xhr.getAllResponseHeaders = function( decoded ) {
        if ( XHR.DONE !== xhr.readyState ) return null;
        return true===decoded ? xhr._headers : xhr._rawHeaders;
    };
    xhr.getResponseHeader = function( key, lowercased ) {
        if ( (null == key) || (XHR.DONE !== xhr.readyState) ) return null;
        var headers = xhr._headers || {};
        if ( false !== lowercased ) key = key.toLowerCase( );
        return headers[HAS](key) ? headers[key] : null;
    };
    xhr.dispose = function( ) {
        xhr.readyState = null;
        xhr.status = null;
        xhr.statusText = null;
        xhr.responseType = null;
        xhr.responseURL = null;
        xhr.response = null;
        xhr.responseText = null;
        xhr.responseXml = null;
        xhr._rawHeaders = null;
        xhr._headers = null;
        xhr.getAllResponseHeaders = null;
        xhr.getResponseHeader = null;
        xhr.send = null;
        xhr.abort = null;
        return xhr;
    };
};

XHR.UNSENT = 0;
XHR.OPENED = 1;
XHR.HEADERS_RECEIVED = 2;
XHR.LOADING = 3;
XHR.DONE = 4;

XHR.create = FILTER.Browser.isNode
    ? function( o, payload ) {
        o = o || {};
        if ( !o.url ) return null;
        var url = '[object Object]' === toString.call(o.url) ? o.url : require('url').parse( o.url ),
            $hr$, xhr,
            options = {
                method      : o.method || 'GET',
                agent       : false,
                protocol    : url.protocol,
                host        : url.hostname,
                hostname    : url.hostname,
                port        : url.port || 80,
                path        : (url.pathname||'/')+(url.query?('?'+url.query):'')
            }
        ;
        
        if ( 'file:' === options.protocol )
        {
            xhr = new XHR(
            function( payload ) {
                // https://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback
                xhr.readyState = XHR.OPENED;
                require('fs').readFile(options.path, {
                    // return raw buffer
                    encoding: 'arraybuffer' === xhr.responseType ? null : xhr.responseType,
                    flag: 'r'
                }, function( err, data ) {
                    xhr.readyState = XHR.DONE;
                    xhr.responseUrl = options.path;
                    if ( o.onLoadStart ) o.onLoadStart( xhr );
                    if ( o.onLoadEnd ) o.onLoadEnd( xhr );
                    if ( err )
                    {
                        xhr.status = 500;
                        xhr.statusText = err.toString();
                        if ( o.onRequestError ) o.onRequestError( xhr );
                        else if ( o.onError ) o.onError( xhr );
                    }
                    else
                    {
                        xhr.status = 200;
                        xhr.statusText = null;
                        xhr.response = data;
                        if ( 'arraybuffer' !== xhr.responseType )
                        {
                            xhr.responseText = data;
                            xhr.responseXml = null;
                        }
                        else
                        {
                            xhr.responseText = null;
                            xhr.responseXml = null;
                        }
                        if ( o.onComplete ) o.onComplete( xhr );
                    }
                });
            },
            function( ) { });
            xhr.responseType = o.responseType || 'text';
            if ( arguments.length > 1 ) xhr.send( payload );
            return xhr;
        }
        
        xhr = new XHR(
        function( payload ) {
            if ( null != payload )
            {
                payload = String( payload );
                $hr$.setHeader( 'Content-Length', String(payload.length) );
                $hr$.write( payload );
            }
            /*else
            {
                $hr$.setHeader( 'Content-Length', '0' );
                $hr$.write( '' );
            }*/
            $hr$.end( );
        },
        function( ) {
            $hr$.abort( );
        });
        $hr$ = ('https:'===options.protocol?require('https').request:require('http').request)(options, function( response ) {
            var xdata = '', data_sent = 0;
            
            xhr.readyState = XHR.OPENED;
            if ( o.onStateChange ) o.onStateChange( xhr );
            
            xhr.readyState = XHR.HEADERS_RECEIVED;
            xhr._rawHeaders = response.rawHeaders.join("\r\n");
            xhr._headers = response.headers;
            xhr.responseURL = response.url || null;
            xhr.status = response.statusCode || null;
            xhr.statusText = response.statusMessage || null;
            if ( o.onStateChange ) o.onStateChange( xhr );
            
            response.on('data', function( chunk ){
                if ( !data_sent )
                {
                    data_sent = 1;
                    xhr.readyState = XHR.LOADING;
                    if ( o.onStateChange ) o.onStateChange( xhr );
                    if ( o.onLoadStart ) o.onLoadStart( xhr );
                }
                xdata += chunk.toString( );
                if ( o.onProgress ) o.onProgress( xhr );
            });
            
            response.on('end', function( ){
                xhr.readyState = XHR.DONE;
                xhr.responseType = 'text';
                xhr.response = xhr.responseText = xdata;
                
                if ( o.onStateChange ) o.onStateChange( xhr );
                if ( o.onLoadEnd ) o.onLoadEnd( xhr );
                
                if ( XHR.DONE === xhr.readyState )
                {
                    if ( 200 === xhr.status )
                    {
                        if ( o.onComplete ) o.onComplete( xhr );
                    }
                    else
                    {
                        if ( o.onRequestError ) o.onRequestError( xhr );
                        else if ( o.onError ) o.onError( xhr );
                    }
                }
            });
            
            response.on('error', function( ee ){
                xhr.statusText = ee.toString( );
                if ( o.onError ) o.onError( xhr );
            });
        });
        
        $hr$.setTimeout(o.timeout || 30000, function( e ){
            if ( o.onTimeout ) o.onTimeout( xhr );
        });
        $hr$.on('abort', function( ee ){
            if ( o.onAbort ) o.onAbort( xhr );
        });
        $hr$.on('error', function( ee ){
            xhr.statusText = ee.toString( );
            if ( o.onError ) o.onError( xhr );
        });
        
        if ( o.headers ) header_encode( o.headers, null, $hr$ );
        //if ( o.mimeType ) $hr$.overrideMimeType( o.mimeType );
        if ( arguments.length > 1 ) xhr.send( payload );
        return xhr;
    }
    : function( o, payload ) {
        o = o || {};
        if ( !o.url ) return null;
        var $xhr$ = 'undefined' !== typeof XMLHttpRequest
            ? new XMLHttpRequest( )
            : new ActiveXObject( 'Microsoft.XMLHTTP' ) /* or ActiveXObject( 'Msxml2.XMLHTTP' ); ??*/,
            
            xhr = new XHR(
            function( payload ){
                $xhr$.send( payload );
            },
            function( ){
                $xhr$.abort( );
            }),
            
            update = function( xhr, $xhr$ ) {
                //xhr.responseType = $xhr$.responseType;
                xhr.readyState = $xhr$.readyState;
                xhr.status = $xhr$.status;
                xhr.statusText = $xhr$.statusText;
                xhr.responseURL = $xhr$.responseURL;
                xhr.response = $xhr$.response;
                if ( 'arraybuffer' !== $xhr$.responseType )
                {
                    xhr.responseText = $xhr$.responseText;
                    xhr.responseXml = $xhr$.responseXml;
                }
                else
                {
                    xhr.responseText = null;
                    xhr.responseXml = null;
                }
                return xhr;
            }
        ;
        xhr.getAllResponseHeaders = function( decoded ){
            var headers = $xhr$.getAllResponseHeaders( );
            return true===decoded ? header_decode( headers ) : headers;
        };
        xhr.getResponseHeader = function( key ){
            return $xhr$.getResponseHeader( key );
        };
        
        $xhr$.open( o.method||'GET', o.url, !o.sync );
        xhr.responseType = $xhr$.responseType = o.responseType || 'text';
        $xhr$.timeout = o.timeout || 30000; // 30 secs default timeout
        
        if ( o.onProgress )
        {
            $xhr$.onprogress = function( ) {
                o.onProgress( update( xhr, $xhr$ ) );
            };
        }
        if ( o.onLoadStart )
        {
            $xhr$.onloadstart = function( ) {
                o.onLoadStart( update( xhr, $xhr$ ) );
            };
        }
        if ( o.onLoadEnd )
        {
            $xhr$.onloadend = function( ) {
                o.onLoadEnd( update( xhr, $xhr$ ) );
            };
        }
        if ( !o.sync && o.onStateChange )
        {
            $xhr$.onreadystatechange = function( ) {
                o.onStateChange( update( xhr, $xhr$ ) );
            };
        }
        $xhr$.onload = function( ) {
            update( xhr, $xhr$ );
            if ( XHR.DONE === $xhr$.readyState )
            {
                if ( 200 === $xhr$.status )
                {
                    if ( o.onComplete ) o.onComplete( xhr );
                }
                else
                {
                    if ( o.onRequestError ) o.onRequestError( xhr );
                    else if ( o.onError ) o.onError( xhr );
                }
            }
        };
        $xhr$.onabort = function( ) {
            if ( o.onAbort ) o.onAbort( update( xhr, $xhr$ ) );
        };
        $xhr$.onerror = function( ) {
            if ( o.onError ) o.onError( update( xhr, $xhr$ ) );
        };
        $xhr$.ontimeout = function( ) {
            if ( o.onTimeout ) o.onTimeout( update( xhr, $xhr$ ) );
        };
        
        if ( o.headers ) header_encode( o.headers, $xhr$ );
        if ( o.mimeType ) $xhr$.overrideMimeType( o.mimeType );
        if ( arguments.length > 1 ) xhr.send( payload );
        return xhr;
    }
;

}(FILTER);/**
*
* Filter XHRLoader Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

FILTER.IO.XHRLoader = FILTER.Class(FILTER.IO.Loader, {
    name: "IO.XHRLoader",
    
    constructor: function XHRLoader( ) {
        var self = this;
        if ( !(self instanceof XHRLoader) ) return new XHRLoader( );
    },
    
    load: function ( url, onLoad, onError ) {
        var self = this;
        
        FILTER.Util.XHR.create({
            url: url,
            responseType: self._responseType,
            onComplete: function( xhr ) {
                if ( 'function' === typeof onLoad ) onLoad( xhr.response );
            },
            onError: function( xhr ) {
                if ( 'function' === typeof onError ) onError( xhr.statusText );
            }
        }, null);
        /*if ( FILTER.Browser.isNode )
        {
            // https://nodejs.org/api/http.html#http_http_request_options_callback
            request = require('http').get(url, function(response) {
                var data = '';
                //response.setEncoding('utf8');
                response.on('data', function( chunk ) {
                    data += chunk;
                });
                response.on('end', function( ) {
                    if ( 'function' === typeof onLoad ) onLoad( new Buffer(data) );
                });
            }).on('error', function( e ) {
                if ( 'function' === typeof onError ) onError( e );
            });
        }
        else
        {
            // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
            request = new XMLHttpRequest( );
            request.open( 'GET', url, true );
            request[ON]('load', function ( event ) {
                if ( 'function' === typeof onLoad ) onLoad( this.response );
            }, false);
            //if ( 'function' === typeof onProgress ) request[ON]('progress', onProgress, false);
            if ( 'function' === typeof onError ) request[ON]('error', onError, false);
            if ( self._crossOrigin ) request.crossOrigin = self._crossOrigin;
            if ( self._responseType ) request.responseType = self._responseType;
            request.send( null );
        }*/
        return self;
    }
});
}(FILTER);/**
*
* Filter BinaryLoader Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Loader = FILTER.IO.Loader, XHR = FILTER.Util.XHR, FilterImage = FILTER.Image, Class = FILTER.Class;

var FileLoader = FILTER.IO.FileLoader = FILTER.IO.FileReader = Class(Loader, {
    name: "IO.FileLoader",
    
    constructor: function FileLoader( ) {
        var self = this;
        if ( !(self instanceof FileLoader) ) return new FileLoader( );
    },
    
    load: function ( file, onLoad, onError ) {
        var self = this;
        // read file
        if ( FILTER.Browser.isNode )
        {
            // https://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback
            require('fs').readFile('file://' === file.slice(0,7) ? file.slice(7) : file, {
                // return raw buffer
                encoding: 'arraybuffer' === self._responseType ? null : self._responseType,
                flag: 'r'
            }, function( err, data ) {
              if ( err )
              {
                  if ( 'function' === typeof onError ) onError( err.toString() );
              }
              else
              {
                  if ( 'function' === typeof onLoad ) onLoad( data );
              }
            });
        }
        else
        {
            XHR.create({
                url: file,
                responseType: self._responseType,
                onComplete: function( xhr ) {
                    if ( 'function' === typeof onLoad ) onLoad( xhr.response );
                },
                onError: function( xhr ) {
                    if ( 'function' === typeof onError ) onError( xhr.statusText );
                }
            }, null);
        }
        return self;
    }
});

FILTER.IO.BinaryLoader = FILTER.IO.BinaryReader = Class(FileLoader, {
    name: "IO.BinaryLoader",
    
    constructor: function BinaryLoader( decoder ) {
        var self = this;
        if ( !(self instanceof BinaryLoader) ) return new BinaryLoader( decoder );
        self._decoder = "function" === typeof decoder ? decoder : null;
    },
    
    _decoder: null,
    _encoder: null,
    
    dispose: function( ) {
        var self = this;
        self._decoder = null;
        self._encoder = null;
        self.$super("dispose");
        return self;
    },
    
    decoder: function( decoder ) {
        var self = this;
        self._decoder = "function" === typeof decoder ? decoder : null;
        return self;
    },
    
    encoder: function( encoder ) {
        var self = this;
        self._encoder = "function" === typeof encoder ? encoder : null;
        return self;
    },
    
    load: function( url, onLoad, onError ){
        var self = this, image = new FilterImage( ), decoder = self._decoder;
        
        if ( 'function' === typeof decoder )
        {
            self
                .responseType( 'arraybuffer' )
                .$super('load', url, function( buffer ) {
                    var metaData = {}, imData = decoder( buffer, metaData );
                    if ( !imData )
                    {
                        if ( 'function' === typeof onError ) onError( image, metaData, buffer );
                        return;
                    }
                    image.image( imData );
                    if ( 'function' === typeof onLoad ) onLoad( image, metaData );
                }, onError )
            ;
        }
        return image;
    }

});
  
}(FILTER);/**
*
* Filter BinaryWriter Class
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var Class = FILTER.Class;

var FileWriter = FILTER.IO.FileWriter = Class(FILTER.IO.Writer, {
    name: "IO.FileWriter",
    
    constructor: function FileWriter( ) {
        var self = this;
        if ( !(self instanceof FileWriter) ) return new FileWriter( );
    },
    
    write: function ( file, data, onWrite, onError ) {
        var self = this;
        // read file
        if ( FILTER.Browser.isNode )
        {
            // https://nodejs.org/api/fs.html#fs_fs_readfile_filename_options_callback
            require('fs').writeFile('file://' === file.slice(0,7) ? file.slice(7) : file, data, {
                // return raw buffer
                encoding: 'arraybuffer' === self._encoding ? null : self._encoding,
                flag: 'w'
            }, function( err ) {
              if ( err )
              {
                  if ( 'function' === typeof onError ) onError( err.toString() );
              }
              else
              {
                  if ( 'function' === typeof onWrite ) onWrite( file );
              }
            });
        }
        return self;
    }
});

FILTER.IO.BinaryWriter = Class(FileWriter, {
    name: "IO.BinaryWriter",
    
    constructor: function BinaryWriter( encoder ) {
        var self = this;
        if ( !(self instanceof BinaryWriter) ) return new BinaryWriter( encoder );
        self._encoder = "function" === typeof encoder ? encoder : null;
    },
    
    _encoder: null,
    
    dispose: function( ) {
        var self = this;
        self._encoder = null;
        self.$super("dispose");
        return self;
    },
    
    encoder: function( encoder ) {
        var self = this;
        self._encoder = "function" === typeof encoder ? encoder : null;
        return self;
    },
    
    write: function( file, image, onWrite, onError ){
        var self = this, encoder = self._encoder;
        
        if ( image && ('function' === typeof encoder) )
        {
            self
                .encoding( 'arraybuffer' )
                .$super('write', file, encoder( image.getPixelData( ) ), onWrite, onError )
            ;
        }
        return self;
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

FILTER.IO.HTMLImageLoader = FILTER.Class(FILTER.IO.Loader, {
    name: "IO.HTMLImageLoader",
    
    constructor: function HTMLImageLoader() {
        if ( !(this instanceof HTMLImageLoader) )
            return new HTMLImageLoader();
        this.$super('constructor');
    },
    
    load: function( url, onLoad, onError ){
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
        
        loader.crossOrigin = scope._crossOrigin || "";
        loader.src = url;
        
        return image;
    }
});
}(FILTER);
/* main code ends here */
/* export the module */
return FILTER;
});
/**
*
*   FILTER.js Codecs
*   @version: 0.9.5
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Image Codecs)
*   https://github.com/foo123/FILTER.js
*
**/!function( root, factory ){
"use strict";
if ( ('object'===typeof module) && module.exports ) /* CommonJS */
    module.exports = factory.call(root,(module.$deps && module.$deps["FILTER"]) || require("./FILTER".toLowerCase()));
else if ( ("function"===typeof define) && define.amd && ("function"===typeof require) && ("function"===typeof require.specified) && require.specified("FILTER_CODECS") /*&& !require.defined("FILTER_CODECS")*/ ) 
    define("FILTER_CODECS",['module',"FILTER"],function(mod,module){factory.moduleUri = mod.uri; factory.call(root,module); return module;});
else /* Browser/WebWorker/.. */
    (factory.call(root,root["FILTER"])||1)&&('function'===typeof define)&&define.amd&&define(function(){return root["FILTER"];} );
}(  /* current root */          this, 
    /* module factory */        function ModuleFactory__FILTER_CODECS( FILTER ){
/* main code starts here */

/**
*
*   FILTER.js Codecs
*   @version: 0.9.5
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Image Codecs)
*   https://github.com/foo123/FILTER.js
*
**/
"use strict";
var FILTER_CODECS_PATH = FILTER.getPath( ModuleFactory__FILTER_CODECS.moduleUri );
/**
*
* Filter Utils, zlib
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

/*
 * Extracted from pdf.js
 * https://github.com/andreasgal/pdf.js
 *
 * Copyright (c) 2011 Mozilla Foundation
 *
 * Contributors: Andreas Gal <gal@mozilla.com>
 *               Chris G Jones <cjones@mozilla.com>
 *               Shaon Barman <shaon.barman@gmail.com>
 *               Vivien Nicolas <21@vingtetun.org>
 *               Justin D'Arcangelo <justindarc@gmail.com>
 *               Yury Delendik
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

var DecodeStream = (function() {
  function constructor() {
    this.pos = 0;
    this.bufferLength = 0;
    this.eof = false;
    this.buffer = null;
  }

  constructor.prototype = {
    ensureBuffer: function decodestream_ensureBuffer(requested) {
      var buffer = this.buffer;
      var current = buffer ? buffer.byteLength : 0;
      if (requested < current)
        return buffer;
      var size = 512;
      while (size < requested)
        size <<= 1;
      var buffer2 = new Uint8Array(size);
      for (var i = 0; i < current; ++i)
        buffer2[i] = buffer[i];
      return this.buffer = buffer2;
    },
    getByte: function decodestream_getByte() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return this.buffer[this.pos++];
    },
    getBytes: function decodestream_getBytes(length) {
      var pos = this.pos;

      if (length) {
        this.ensureBuffer(pos + length);
        var end = pos + length;

        while (!this.eof && this.bufferLength < end)
          this.readBlock();

        var bufEnd = this.bufferLength;
        if (end > bufEnd)
          end = bufEnd;
      } else {
        while (!this.eof)
          this.readBlock();

        var end = this.bufferLength;
      }

      this.pos = end;
      return this.buffer.subarray(pos, end);
    },
    lookChar: function decodestream_lookChar() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return String.fromCharCode(this.buffer[this.pos]);
    },
    getChar: function decodestream_getChar() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return String.fromCharCode(this.buffer[this.pos++]);
    },
    makeSubStream: function decodestream_makeSubstream(start, length, dict) {
      var end = start + length;
      while (this.bufferLength <= end && !this.eof)
        this.readBlock();
      return new Stream(this.buffer, start, length, dict);
    },
    skip: function decodestream_skip(n) {
      if (!n)
        n = 1;
      this.pos += n;
    },
    reset: function decodestream_reset() {
      this.pos = 0;
    }
  };

  return constructor;
})();

var FlateStream = (function() {
  var codeLenCodeMap = new Uint32Array([
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
  ]);

  var lengthDecode = new Uint32Array([
    0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a,
    0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f,
    0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073,
    0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102
  ]);

  var distDecode = new Uint32Array([
    0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d,
    0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1,
    0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01,
    0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001
  ]);

  var fixedLitCodeTab = [new Uint32Array([
    0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0,
    0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0,
    0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0,
    0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0,
    0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8,
    0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8,
    0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8,
    0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8,
    0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4,
    0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4,
    0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4,
    0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4,
    0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc,
    0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec,
    0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc,
    0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc,
    0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2,
    0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2,
    0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2,
    0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2,
    0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca,
    0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea,
    0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da,
    0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa,
    0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6,
    0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6,
    0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6,
    0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6,
    0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce,
    0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee,
    0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de,
    0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe,
    0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1,
    0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1,
    0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1,
    0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1,
    0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9,
    0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9,
    0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9,
    0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9,
    0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5,
    0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5,
    0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5,
    0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5,
    0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd,
    0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed,
    0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd,
    0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd,
    0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3,
    0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3,
    0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3,
    0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3,
    0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb,
    0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb,
    0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db,
    0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb,
    0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7,
    0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7,
    0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7,
    0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7,
    0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf,
    0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef,
    0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df,
    0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff
  ]), 9];

  var fixedDistCodeTab = [new Uint32Array([
    0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c,
    0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000,
    0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d,
    0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000
  ]), 5];
  
  function error(e) {
      throw new Error(e)
  }

  function constructor(bytes) {
    //var bytes = stream.getBytes();
    var bytesPos = 0;

    var cmf = bytes[bytesPos++];
    var flg = bytes[bytesPos++];
    if (cmf == -1 || flg == -1)
      error('Invalid header in flate stream');
    if ((cmf & 0x0f) != 0x08)
      error('Unknown compression method in flate stream');
    if ((((cmf << 8) + flg) % 31) != 0)
      error('Bad FCHECK in flate stream');
    if (flg & 0x20)
      error('FDICT bit set in flate stream');

    this.bytes = bytes;
    this.bytesPos = bytesPos;

    this.codeSize = 0;
    this.codeBuf = 0;

    DecodeStream.call(this);
  }

  constructor.prototype = Object.create(DecodeStream.prototype);

  constructor.prototype.getBits = function(bits) {
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;
    var bytes = this.bytes;
    var bytesPos = this.bytesPos;

    var b;
    while (codeSize < bits) {
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad encoding in flate stream');
      codeBuf |= b << codeSize;
      codeSize += 8;
    }
    b = codeBuf & ((1 << bits) - 1);
    this.codeBuf = codeBuf >> bits;
    this.codeSize = codeSize -= bits;
    this.bytesPos = bytesPos;
    return b;
  };

  constructor.prototype.getCode = function(table) {
    var codes = table[0];
    var maxLen = table[1];
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;
    var bytes = this.bytes;
    var bytesPos = this.bytesPos;

    while (codeSize < maxLen) {
      var b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad encoding in flate stream');
      codeBuf |= (b << codeSize);
      codeSize += 8;
    }
    var code = codes[codeBuf & ((1 << maxLen) - 1)];
    var codeLen = code >> 16;
    var codeVal = code & 0xffff;
    if (codeSize == 0 || codeSize < codeLen || codeLen == 0)
      error('Bad encoding in flate stream');
    this.codeBuf = (codeBuf >> codeLen);
    this.codeSize = (codeSize - codeLen);
    this.bytesPos = bytesPos;
    return codeVal;
  };

  constructor.prototype.generateHuffmanTable = function(lengths) {
    var n = lengths.length;

    // find max code length
    var maxLen = 0;
    for (var i = 0; i < n; ++i) {
      if (lengths[i] > maxLen)
        maxLen = lengths[i];
    }

    // build the table
    var size = 1 << maxLen;
    var codes = new Uint32Array(size);
    for (var len = 1, code = 0, skip = 2;
         len <= maxLen;
         ++len, code <<= 1, skip <<= 1) {
      for (var val = 0; val < n; ++val) {
        if (lengths[val] == len) {
          // bit-reverse the code
          var code2 = 0;
          var t = code;
          for (var i = 0; i < len; ++i) {
            code2 = (code2 << 1) | (t & 1);
            t >>= 1;
          }

          // fill the table entries
          for (var i = code2; i < size; i += skip)
            codes[i] = (len << 16) | val;

          ++code;
        }
      }
    }

    return [codes, maxLen];
  };

  constructor.prototype.readBlock = function() {
    function repeat(stream, array, len, offset, what) {
      var repeat = stream.getBits(len) + offset;
      while (repeat-- > 0)
        array[i++] = what;
    }

    // read block header
    var hdr = this.getBits(3);
    if (hdr & 1)
      this.eof = true;
    hdr >>= 1;

    if (hdr == 0) { // uncompressed block
      var bytes = this.bytes;
      var bytesPos = this.bytesPos;
      var b;

      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      var blockLen = b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      blockLen |= (b << 8);
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      var check = b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      check |= (b << 8);
      if (check != (~blockLen & 0xffff))
        error('Bad uncompressed block length in flate stream');

      this.codeBuf = 0;
      this.codeSize = 0;

      var bufferLength = this.bufferLength;
      var buffer = this.ensureBuffer(bufferLength + blockLen);
      var end = bufferLength + blockLen;
      this.bufferLength = end;
      for (var n = bufferLength; n < end; ++n) {
        if (typeof (b = bytes[bytesPos++]) == 'undefined') {
          this.eof = true;
          break;
        }
        buffer[n] = b;
      }
      this.bytesPos = bytesPos;
      return;
    }

    var litCodeTable;
    var distCodeTable;
    if (hdr == 1) { // compressed block, fixed codes
      litCodeTable = fixedLitCodeTab;
      distCodeTable = fixedDistCodeTab;
    } else if (hdr == 2) { // compressed block, dynamic codes
      var numLitCodes = this.getBits(5) + 257;
      var numDistCodes = this.getBits(5) + 1;
      var numCodeLenCodes = this.getBits(4) + 4;

      // build the code lengths code table
      var codeLenCodeLengths = Array(codeLenCodeMap.length);
      var i = 0;
      while (i < numCodeLenCodes)
        codeLenCodeLengths[codeLenCodeMap[i++]] = this.getBits(3);
      var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);

      // build the literal and distance code tables
      var len = 0;
      var i = 0;
      var codes = numLitCodes + numDistCodes;
      var codeLengths = new Array(codes);
      while (i < codes) {
        var code = this.getCode(codeLenCodeTab);
        if (code == 16) {
          repeat(this, codeLengths, 2, 3, len);
        } else if (code == 17) {
          repeat(this, codeLengths, 3, 3, len = 0);
        } else if (code == 18) {
          repeat(this, codeLengths, 7, 11, len = 0);
        } else {
          codeLengths[i++] = len = code;
        }
      }

      litCodeTable =
        this.generateHuffmanTable(codeLengths.slice(0, numLitCodes));
      distCodeTable =
        this.generateHuffmanTable(codeLengths.slice(numLitCodes, codes));
    } else {
      error('Unknown block type in flate stream');
    }

    var buffer = this.buffer;
    var limit = buffer ? buffer.length : 0;
    var pos = this.bufferLength;
    while (true) {
      var code1 = this.getCode(litCodeTable);
      if (code1 < 256) {
        if (pos + 1 >= limit) {
          buffer = this.ensureBuffer(pos + 1);
          limit = buffer.length;
        }
        buffer[pos++] = code1;
        continue;
      }
      if (code1 == 256) {
        this.bufferLength = pos;
        return;
      }
      code1 -= 257;
      code1 = lengthDecode[code1];
      var code2 = code1 >> 16;
      if (code2 > 0)
        code2 = this.getBits(code2);
      var len = (code1 & 0xffff) + code2;
      code1 = this.getCode(distCodeTable);
      code1 = distDecode[code1];
      code2 = code1 >> 16;
      if (code2 > 0)
        code2 = this.getBits(code2);
      var dist = (code1 & 0xffff) + code2;
      if (pos + len >= limit) {
        buffer = this.ensureBuffer(pos + len);
        limit = buffer.length;
      }
      for (var k = 0; k < len; ++k, ++pos)
        buffer[pos] = buffer[pos - dist];
    }
  };

  return constructor;
})();

FILTER.Util.ZLib = {
    DecodeStream: DecodeStream,
    FlateStream: FlateStream
};

}(FILTER);/**
*
* Filter PNG Image Format CODEC
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// adapted from https://github.com/devongovett/png.js/
// @requires FILTER/util/zlib.js
function FlateStream( data ) { return new FILTER.Util.ZLib.FlateStream( data ); }

var
APNG_DISPOSE_OP_NONE = 0,
APNG_DISPOSE_OP_BACKGROUND = 1,
APNG_DISPOSE_OP_PREVIOUS = 2,
APNG_BLEND_OP_SOURCE = 0,
APNG_BLEND_OP_OVER = 1;

function PNG( ) { }
PNG.prototype = {
    constructor: PNG,
    
    data: null,
    pos: null,
    palette: null,
    imgData: null,
    transparency: null,
    animation: null,
    text: null,
    width: 0,
    height: 0,
    bits: null,
    colorType: null,
    compressionMethod: null,
    filterMethod: null,
    interlaceMethod: null,
    hasAlphaChannel: null,
    colors: null,
    colorSpace: null,
    pixelBitlength: null,
    
    readData: function( data ) {
        var self = this;
        var chunkSize, colors, delayDen, delayNum, frame, i, index, key, section, short, text, _i, _j, _ref;
        
        self.data = data;
        self.pos = 8;
        self.palette = [];
        self.imgData = [];
        self.transparency = {};
        self.animation = null;
        self.text = {};
        frame = null;
        while( true ) 
        {
            chunkSize = self.readUInt32();
            section = ((function() {
                var _i, _results;
                _results = [];
                for (i = _i = 0; _i < 4; i = ++_i) {
                _results.push(String.fromCharCode(this.data[this.pos++]));
                }
                return _results;
            }).call(self)).join('');
            
            switch (section) 
            {
                case 'IHDR':
                    self.width = self.readUInt32();
                    self.height = self.readUInt32();
                    self.bits = self.data[self.pos++];
                    self.colorType = self.data[self.pos++];
                    self.compressionMethod = self.data[self.pos++];
                    self.filterMethod = self.data[self.pos++];
                    self.interlaceMethod = self.data[self.pos++];
                    break;
                case 'acTL':
                    self.animation = {
                        numFrames: self.readUInt32(),
                        numPlays: self.readUInt32() || Infinity,
                        frames: []
                    };
                    break;
                case 'PLTE':
                    self.palette = self.read(chunkSize);
                    break;
                case 'fcTL':
                    if (frame) 
                    {
                        self.animation.frames.push(frame);
                    }
                    self.pos += 4;
                    frame = {
                        width: self.readUInt32(),
                        height: self.readUInt32(),
                        xOffset: self.readUInt32(),
                        yOffset: self.readUInt32()
                    };
                    delayNum = self.readUInt16();
                    delayDen = self.readUInt16() || 100;
                    frame.delay = 1000 * delayNum / delayDen;
                    frame.disposeOp = self.data[self.pos++];
                    frame.blendOp = self.data[self.pos++];
                    frame.data = [];
                    break;
                case 'IDAT':
                case 'fdAT':
                    if (section === 'fdAT') 
                    {
                        self.pos += 4;
                        chunkSize -= 4;
                    }
                    data = (frame != null ? frame.data : void 0) || self.imgData;
                    for (i = _i = 0; 0 <= chunkSize ? _i < chunkSize : _i > chunkSize; i = 0 <= chunkSize ? ++_i : --_i) 
                    {
                        data.push(self.data[self.pos++]);
                    }
                    break;
                case 'tRNS':
                    self.transparency = {};
                    switch (self.colorType) 
                    {
                        case 3:
                            self.transparency.indexed = self.read(chunkSize);
                            short = 255 - self.transparency.indexed.length;
                            if (short > 0) 
                            {
                                for (i = _j = 0; 0 <= short ? _j < short : _j > short; i = 0 <= short ? ++_j : --_j) 
                                {
                                    self.transparency.indexed.push(255);
                                }
                            }
                            break;
                        case 0:
                            self.transparency.grayscale = self.read(chunkSize)[0];
                            break;
                        case 2:
                            self.transparency.rgb = self.read(chunkSize);
                    }
                    break;
                case 'tEXt':
                    text = self.read(chunkSize);
                    index = text.indexOf(0);
                    key = String.fromCharCode.apply(String, text.slice(0, index));
                    self.text[key] = String.fromCharCode.apply(String, text.slice(index + 1));
                    break;
                case 'IEND':
                    if (frame) 
                    {
                        self.animation.frames.push(frame);
                    }
                    self.colors = (function() {
                        switch (this.colorType) 
                        {
                            case 0:
                            case 3:
                            case 4:
                                return 1;
                            case 2:
                            case 6:
                                return 3;
                        }
                    }).call(self);
                    self.hasAlphaChannel = (_ref = self.colorType) === 4 || _ref === 6;
                    colors = self.colors + (self.hasAlphaChannel ? 1 : 0);
                    self.pixelBitlength = self.bits * colors;
                    self.colorSpace = (function() {
                        switch (this.colors) 
                        {
                            case 1:
                                return 'DeviceGray';
                            case 3:
                                return 'DeviceRGB';
                        }
                    }).call(self);
                    self.imgData = new Uint8Array(self.imgData);
                    return;
                default:
                    self.pos += chunkSize;
            }
            self.pos += 4;
            if (self.pos > self.data.length) 
            {
                throw new Error("Incomplete or corrupt PNG file");
            }
        }
    },
    
    read: function( bytes ) {
        var self = this, i, _i, _results;
        _results = [];
        for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) 
        {
            _results.push(self.data[self.pos++]);
        }
        return _results;
    },

    readUInt32: function( ) {
        var self = this, b1, b2, b3, b4;
        b1 = self.data[self.pos++] << 24;
        b2 = self.data[self.pos++] << 16;
        b3 = self.data[self.pos++] << 8;
        b4 = self.data[self.pos++];
        return b1 | b2 | b3 | b4;
    },

    readUInt16: function( ) {
        var self = this, b1, b2;
        b1 = self.data[self.pos++] << 8;
        b2 = self.data[self.pos++];
        return b1 | b2;
    },

    decodePixels: function( data ) {
        var self = this, byte, c, col, i, left, length, 
            p, pa, paeth, pb, pc, pixelBytes, pixels, pos, row, 
            scanlineLength, upper, upperLeft, _i, _j, _k, _l, _m;
        if (data == null) 
        {
            data = self.imgData;
        }
        if (data.length === 0) 
        {
            return new Uint8Array(0);
        }
        data = FlateStream( data );
        data = data.getBytes();
        pixelBytes = self.pixelBitlength / 8;
        scanlineLength = pixelBytes * self.width;
        pixels = new Uint8Array(scanlineLength * self.height);
        length = data.length;
        row = 0;
        pos = 0;
        c = 0;
        while (pos < length) 
        {
            switch (data[pos++]) 
            {
                case 0:
                    for (i = _i = 0; _i < scanlineLength; i = _i += 1) 
                    {
                        pixels[c++] = data[pos++];
                    }
                    break;
                case 1:
                    for (i = _j = 0; _j < scanlineLength; i = _j += 1) 
                    {
                        byte = data[pos++];
                        left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                        pixels[c++] = (byte + left) % 256;
                    }
                    break;
                case 2:
                    for (i = _k = 0; _k < scanlineLength; i = _k += 1) 
                    {
                        byte = data[pos++];
                        col = (i - (i % pixelBytes)) / pixelBytes;
                        upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                        pixels[c++] = (upper + byte) % 256;
                    }
                    break;
                case 3:
                    for (i = _l = 0; _l < scanlineLength; i = _l += 1) 
                    {
                        byte = data[pos++];
                        col = (i - (i % pixelBytes)) / pixelBytes;
                        left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                        upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                        pixels[c++] = (byte + Math.floor((left + upper) / 2)) % 256;
                    }
                    break;
                case 4:
                    for (i = _m = 0; _m < scanlineLength; i = _m += 1) 
                    {
                        byte = data[pos++];
                        col = (i - (i % pixelBytes)) / pixelBytes;
                        left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
                        if (row === 0) 
                        {
                            upper = upperLeft = 0;
                        } 
                        else 
                        {
                            upper = pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                            upperLeft = col && pixels[(row - 1) * scanlineLength + (col - 1) * pixelBytes + (i % pixelBytes)];
                        }
                        p = left + upper - upperLeft;
                        pa = Math.abs(p - left);
                        pb = Math.abs(p - upper);
                        pc = Math.abs(p - upperLeft);
                        if (pa <= pb && pa <= pc) 
                        {
                            paeth = left;
                        } 
                        else if (pb <= pc) 
                        {
                            paeth = upper;
                        } 
                        else 
                        {
                            paeth = upperLeft;
                        }
                        pixels[c++] = (byte + paeth) % 256;
                    }
                    break;
                default:
                    throw new Error("Invalid filter algorithm: " + data[pos - 1]);
            }
            row++;
        }
        return pixels;
    },

    decodePalette: function( ) {
        var self = this, c, i, length, palette, pos, ret, 
            transparency, _i, _ref, _ref1;
        palette = self.palette;
        transparency = self.transparency.indexed || [];
        ret = new Uint8Array((transparency.length || 0) + palette.length);
        pos = 0;
        length = palette.length;
        c = 0;
        for (i = _i = 0, _ref = palette.length; _i < _ref; i = _i += 3) 
        {
            ret[pos++] = palette[i];
            ret[pos++] = palette[i + 1];
            ret[pos++] = palette[i + 2];
            ret[pos++] = (_ref1 = transparency[c++]) != null ? _ref1 : 255;
        }
        return ret;
    },

    copyToImageData: function( imageData, pixels ) {
        var self = this, alpha, colors, data, i, input, 
            j, k, length, palette, v, _ref;
        colors = self.colors;
        palette = null;
        alpha = self.hasAlphaChannel;
        if (self.palette.length) 
        {
            palette = (_ref = self._decodedPalette) != null ? _ref : self._decodedPalette = self.decodePalette();
            colors = 4;
            alpha = true;
        }
        data = imageData.data || imageData;
        length = data.length;
        input = palette || pixels;
        i = j = 0;
        if (colors === 1) 
        {
            while (i < length) 
            {
                k = palette ? pixels[i / 4] * 4 : j;
                v = input[k++];
                data[i++] = v;
                data[i++] = v;
                data[i++] = v;
                data[i++] = alpha ? input[k++] : 255;
                j = k;
            }
        } 
        else 
        {
            while (i < length) 
            {
                k = palette ? pixels[i / 4] * 4 : j;
                data[i++] = input[k++];
                data[i++] = input[k++];
                data[i++] = input[k++];
                data[i++] = alpha ? input[k++] : 255;
                j = k;
            }
        }
    },

    decode: function( ) {
        var self = this, ret;
        ret = new Uint8Array(self.width * self.height * 4);
        self.copyToImageData(ret, self.decodePixels());
        return ret;
    }
};

FILTER.Codec.PNG = {

    encoder: FILTER.NotImplemented('PNG.encoder'),
    
    decoder: function( buffer, metaData ) {
        var png = new PNG( );
        png.readData( new Uint8Array( buffer ) );
        return {
            width: png.width,
            height: png.height,
            data: png.decode( )
        };
    }
};
}(FILTER);/**
*
* Filter JPG/JPEG Image Format CODEC
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// adapted from https://github.com/eugeneware/jpeg-js

/*
   Copyright 2011 notmasteryet

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

// - The JPEG specification can be found in the ITU CCITT Recommendation T.81
//   (www.w3.org/Graphics/JPEG/itu-t81.pdf)
// - The JFIF specification can be found in the JPEG File Interchange Format
//   (www.w3.org/Graphics/JPEG/jfif3.pdf)
// - The Adobe Application-Specific JPEG markers in the Supporting the DCT Filters
//   in PostScript Level 2, Technical Note #5116
//   (partners.adobe.com/public/developer/en/ps/sdk/5116.DCT_Filter.pdf)

var dctZigZag = new Int32Array([
 0,
 1,  8,
16,  9,  2,
 3, 10, 17, 24,
32, 25, 18, 11, 4,
 5, 12, 19, 26, 33, 40,
48, 41, 34, 27, 20, 13,  6,
 7, 14, 21, 28, 35, 42, 49, 56,
57, 50, 43, 36, 29, 22, 15,
23, 30, 37, 44, 51, 58,
59, 52, 45, 38, 31,
39, 46, 53, 60,
61, 54, 47,
55, 62,
63
]);

var dctCos1  =  4017   // cos(pi/16)
var dctSin1  =   799   // sin(pi/16)
var dctCos3  =  3406   // cos(3*pi/16)
var dctSin3  =  2276   // sin(3*pi/16)
var dctCos6  =  1567   // cos(6*pi/16)
var dctSin6  =  3784   // sin(6*pi/16)
var dctSqrt2 =  5793   // sqrt(2)
var dctSqrt1d2 = 2896  // sqrt(2) / 2

function JpegImage( ) { }

function buildHuffmanTable(codeLengths, values) 
{
    var k = 0, code = [], i, j, length = 16;
    while (length > 0 && !codeLengths[length - 1]) length--;
    code.push({children: [], index: 0});
    var p = code[0], q;
    for (i = 0; i < length; i++) 
    {
        for (j = 0; j < codeLengths[i]; j++) 
        {
            p = code.pop();
            p.children[p.index] = values[k];
            while (p.index > 0) 
            {
                p = code.pop();
            }
            p.index++;
            code.push(p);
            while (code.length <= i) 
            {
                code.push(q = {children: [], index: 0});
                p.children[p.index] = q.children;
                p = q;
            }
            k++;
        }
        if (i + 1 < length) 
        {
            // p here points to last code
            code.push(q = {children: [], index: 0});
            p.children[p.index] = q.children;
            p = q;
        }
    }
    return code[0].children;
}

function decodeScan(data, offset, frame, components, resetInterval, 
            spectralStart, spectralEnd, 
            successivePrev, successive) 
{
    var precision = frame.precision;
    var samplesPerLine = frame.samplesPerLine;
    var scanLines = frame.scanLines;
    var mcusPerLine = frame.mcusPerLine;
    var progressive = frame.progressive;
    var maxH = frame.maxH, maxV = frame.maxV;

    var startOffset = offset, bitsData = 0, bitsCount = 0;
    function readBit( ) 
    {
        if (bitsCount > 0) 
        {
            bitsCount--;
            return (bitsData >> bitsCount) & 1;
        }
        bitsData = data[offset++];
        if (bitsData == 0xFF) 
        {
            var nextByte = data[offset++];
            if (nextByte) 
            {
                throw "unexpected marker: " + ((bitsData << 8) | nextByte).toString(16);
            }
            // unstuff 0
        }
        bitsCount = 7;
        return bitsData >>> 7;
    }
    
    function decodeHuffman(tree) 
    {
        var node = tree, bit;
        while ((bit = readBit()) !== null) 
        {
            node = node[bit];
            if (typeof node === 'number')  return node;
            if (typeof node !== 'object') throw "invalid huffman sequence";
        }
        return null;
    }
    
    function receive(length) 
    {
        var n = 0;
        while (length > 0) 
        {
            var bit = readBit();
            if (bit === null) return;
            n = (n << 1) | bit;
            length--;
        }
        return n;
    }
    
    function receiveAndExtend(length) 
    {
        var n = receive(length);
        if (n >= 1 << (length - 1)) return n;
        return n + (-1 << length) + 1;
    }
    
    function decodeBaseline(component, zz) 
    {
        var t = decodeHuffman(component.huffmanTableDC);
        var diff = t === 0 ? 0 : receiveAndExtend(t);
        zz[0]= (component.pred += diff);
        var k = 1;
        while (k < 64) 
        {
            var rs = decodeHuffman(component.huffmanTableAC);
            var s = rs & 15, r = rs >> 4;
            if (s === 0) 
            {
                if (r < 15) break;
                k += 16;
                continue;
            }
            k += r;
            var z = dctZigZag[k];
            zz[z] = receiveAndExtend(s);
            k++;
        }
    }
    
    function decodeDCFirst(component, zz) 
    {
        var t = decodeHuffman(component.huffmanTableDC);
        var diff = t === 0 ? 0 : (receiveAndExtend(t) << successive);
        zz[0] = (component.pred += diff);
    }
    
    function decodeDCSuccessive(component, zz) 
    {
        zz[0] |= readBit() << successive;
    }
    
    var eobrun = 0;
    
    function decodeACFirst(component, zz) 
    {
        if (eobrun > 0) 
        {
            eobrun--;
            return;
        }
        var k = spectralStart, e = spectralEnd;
        while (k <= e) 
        {
            var rs = decodeHuffman(component.huffmanTableAC);
            var s = rs & 15, r = rs >> 4;
            if (s === 0) 
            {
                if (r < 15) 
                {
                    eobrun = receive(r) + (1 << r) - 1;
                    break;
                }
                k += 16;
                continue;
            }
            k += r;
            var z = dctZigZag[k];
            zz[z] = receiveAndExtend(s) * (1 << successive);
            k++;
        }
    }
    
    var successiveACState = 0, successiveACNextValue;
    
    function decodeACSuccessive(component, zz) 
    {
        var k = spectralStart, e = spectralEnd, r = 0;
        while (k <= e) 
        {
            var z = dctZigZag[k];
            switch (successiveACState) 
            {
                case 0: // initial state
                    var rs = decodeHuffman(component.huffmanTableAC);
                    var s = rs & 15, r = rs >> 4;
                    if (s === 0) 
                    {
                        if (r < 15) 
                        {
                            eobrun = receive(r) + (1 << r);
                            successiveACState = 4;
                        } 
                        else 
                        {
                            r = 16;
                            successiveACState = 1;
                        }
                    } 
                    else 
                    {
                        if (s !== 1) throw "invalid ACn encoding";
                        successiveACNextValue = receiveAndExtend(s);
                        successiveACState = r ? 2 : 3;
                    }
                    continue;
                case 1: // skipping r zero items
                case 2:
                    if (zz[z]) zz[z] += (readBit() << successive);
                    else 
                    {
                        r--;
                        if (r === 0) successiveACState = successiveACState == 2 ? 3 : 0;
                    }
                    break;
                case 3: // set value for a zero item
                    if (zz[z]) zz[z] += (readBit() << successive);
                    else 
                    {
                        zz[z] = successiveACNextValue << successive;
                        successiveACState = 0;
                    }
                    break;
                case 4: // eob
                    if (zz[z]) zz[z] += (readBit() << successive);
                    break;
            }
            k++;
        }
        if (successiveACState === 4) 
        {
            eobrun--;
            if (eobrun === 0) successiveACState = 0;
        }
    }
    
    function decodeMcu(component, decode, mcu, row, col) 
    {
        var mcuRow = (mcu / mcusPerLine) | 0;
        var mcuCol = mcu % mcusPerLine;
        var blockRow = mcuRow * component.v + row;
        var blockCol = mcuCol * component.h + col;
        decode(component, component.blocks[blockRow][blockCol]);
    }
    
    function decodeBlock(component, decode, mcu) 
    {
        var blockRow = (mcu / component.blocksPerLine) | 0;
        var blockCol = mcu % component.blocksPerLine;
        decode(component, component.blocks[blockRow][blockCol]);
    }

    var componentsLength = components.length;
    var component, i, j, k, n;
    var decodeFn;
    if (progressive) 
    {
        if (spectralStart === 0) decodeFn = successivePrev === 0 ? decodeDCFirst : decodeDCSuccessive;
        else decodeFn = successivePrev === 0 ? decodeACFirst : decodeACSuccessive;
    } 
    else 
    {
        decodeFn = decodeBaseline;
    }

    var mcu = 0, marker;
    var mcuExpected;
    if (componentsLength == 1) 
    {
        mcuExpected = components[0].blocksPerLine * components[0].blocksPerColumn;
    } 
    else 
    {
        mcuExpected = mcusPerLine * frame.mcusPerColumn;
    }
    if (!resetInterval) resetInterval = mcuExpected;

    var h, v;
    while (mcu < mcuExpected) 
    {
        // reset interval stuff
        for (i = 0; i < componentsLength; i++) components[i].pred = 0;
        eobrun = 0;

        if (componentsLength == 1) 
        {
            component = components[0];
            for (n = 0; n < resetInterval; n++) 
            {
                decodeBlock(component, decodeFn, mcu);
                mcu++;
            }
        } 
        else 
        {
            for (n = 0; n < resetInterval; n++) 
            {
                for (i = 0; i < componentsLength; i++) 
                {
                    component = components[i];
                    h = component.h;
                    v = component.v;
                    for (j = 0; j < v; j++) 
                    {
                        for (k = 0; k < h; k++) 
                        {
                            decodeMcu(component, decodeFn, mcu, j, k);
                        }
                    }
                }
                mcu++;

                // If we've reached our expected MCU's, stop decoding
                if (mcu === mcuExpected) break;
            }
        }

        // find marker
        bitsCount = 0;
        marker = (data[offset] << 8) | data[offset + 1];
        if (marker < 0xFF00) 
        {
            throw "marker was not found";
        }

        if (marker >= 0xFFD0 && marker <= 0xFFD7) 
        { 
            // RSTx
            offset += 2;
        }
        else break;
    }

    return offset - startOffset;
}

function buildComponentData(frame, component) 
{
    var lines = [];
    var blocksPerLine = component.blocksPerLine;
    var blocksPerColumn = component.blocksPerColumn;
    var samplesPerLine = blocksPerLine << 3;
    var R = new Int32Array(64), r = new Uint8Array(64);

    // A port of poppler's IDCT method which in turn is taken from:
    //   Christoph Loeffler, Adriaan Ligtenberg, George S. Moschytz,
    //   "Practical Fast 1-D DCT Algorithms with 11 Multiplications",
    //   IEEE Intl. Conf. on Acoustics, Speech & Signal Processing, 1989,
    //   988-991.
    function quantizeAndInverse(zz, dataOut, dataIn) 
    {
        var qt = component.quantizationTable;
        var v0, v1, v2, v3, v4, v5, v6, v7, t;
        var p = dataIn;
        var i;

        // dequant
        for (i = 0; i < 64; i++) p[i] = zz[i] * qt[i];

        // inverse DCT on rows
        for (i = 0; i < 8; ++i) 
        {
            var row = 8 * i;

            // check for all-zero AC coefficients
            if (p[1 + row] == 0 && p[2 + row] == 0 && p[3 + row] == 0 &&
            p[4 + row] == 0 && p[5 + row] == 0 && p[6 + row] == 0 &&
            p[7 + row] == 0) 
            {
                t = (dctSqrt2 * p[0 + row] + 512) >> 10;
                p[0 + row] = t;
                p[1 + row] = t;
                p[2 + row] = t;
                p[3 + row] = t;
                p[4 + row] = t;
                p[5 + row] = t;
                p[6 + row] = t;
                p[7 + row] = t;
                continue;
            }

            // stage 4
            v0 = (dctSqrt2 * p[0 + row] + 128) >> 8;
            v1 = (dctSqrt2 * p[4 + row] + 128) >> 8;
            v2 = p[2 + row];
            v3 = p[6 + row];
            v4 = (dctSqrt1d2 * (p[1 + row] - p[7 + row]) + 128) >> 8;
            v7 = (dctSqrt1d2 * (p[1 + row] + p[7 + row]) + 128) >> 8;
            v5 = p[3 + row] << 4;
            v6 = p[5 + row] << 4;

            // stage 3
            t = (v0 - v1+ 1) >> 1;
            v0 = (v0 + v1 + 1) >> 1;
            v1 = t;
            t = (v2 * dctSin6 + v3 * dctCos6 + 128) >> 8;
            v2 = (v2 * dctCos6 - v3 * dctSin6 + 128) >> 8;
            v3 = t;
            t = (v4 - v6 + 1) >> 1;
            v4 = (v4 + v6 + 1) >> 1;
            v6 = t;
            t = (v7 + v5 + 1) >> 1;
            v5 = (v7 - v5 + 1) >> 1;
            v7 = t;

            // stage 2
            t = (v0 - v3 + 1) >> 1;
            v0 = (v0 + v3 + 1) >> 1;
            v3 = t;
            t = (v1 - v2 + 1) >> 1;
            v1 = (v1 + v2 + 1) >> 1;
            v2 = t;
            t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
            v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
            v7 = t;
            t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
            v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
            v6 = t;

            // stage 1
            p[0 + row] = v0 + v7;
            p[7 + row] = v0 - v7;
            p[1 + row] = v1 + v6;
            p[6 + row] = v1 - v6;
            p[2 + row] = v2 + v5;
            p[5 + row] = v2 - v5;
            p[3 + row] = v3 + v4;
            p[4 + row] = v3 - v4;
        }

        // inverse DCT on columns
        for (i = 0; i < 8; ++i) 
        {
            var col = i;

            // check for all-zero AC coefficients
            if (p[1*8 + col] == 0 && p[2*8 + col] == 0 && p[3*8 + col] == 0 &&
            p[4*8 + col] == 0 && p[5*8 + col] == 0 && p[6*8 + col] == 0 &&
            p[7*8 + col] == 0) 
            {
                t = (dctSqrt2 * dataIn[i+0] + 8192) >> 14;
                p[0*8 + col] = t;
                p[1*8 + col] = t;
                p[2*8 + col] = t;
                p[3*8 + col] = t;
                p[4*8 + col] = t;
                p[5*8 + col] = t;
                p[6*8 + col] = t;
                p[7*8 + col] = t;
                continue;
            }

            // stage 4
            v0 = (dctSqrt2 * p[0*8 + col] + 2048) >> 12;
            v1 = (dctSqrt2 * p[4*8 + col] + 2048) >> 12;
            v2 = p[2*8 + col];
            v3 = p[6*8 + col];
            v4 = (dctSqrt1d2 * (p[1*8 + col] - p[7*8 + col]) + 2048) >> 12;
            v7 = (dctSqrt1d2 * (p[1*8 + col] + p[7*8 + col]) + 2048) >> 12;
            v5 = p[3*8 + col];
            v6 = p[5*8 + col];

            // stage 3
            t = (v0 - v1 + 1) >> 1;
            v0 = (v0 + v1 + 1) >> 1;
            v1 = t;
            t = (v2 * dctSin6 + v3 * dctCos6 + 2048) >> 12;
            v2 = (v2 * dctCos6 - v3 * dctSin6 + 2048) >> 12;
            v3 = t;
            t = (v4 - v6 + 1) >> 1;
            v4 = (v4 + v6 + 1) >> 1;
            v6 = t;
            t = (v7 + v5 + 1) >> 1;
            v5 = (v7 - v5 + 1) >> 1;
            v7 = t;

            // stage 2
            t = (v0 - v3 + 1) >> 1;
            v0 = (v0 + v3 + 1) >> 1;
            v3 = t;
            t = (v1 - v2 + 1) >> 1;
            v1 = (v1 + v2 + 1) >> 1;
            v2 = t;
            t = (v4 * dctSin3 + v7 * dctCos3 + 2048) >> 12;
            v4 = (v4 * dctCos3 - v7 * dctSin3 + 2048) >> 12;
            v7 = t;
            t = (v5 * dctSin1 + v6 * dctCos1 + 2048) >> 12;
            v5 = (v5 * dctCos1 - v6 * dctSin1 + 2048) >> 12;
            v6 = t;

            // stage 1
            p[0*8 + col] = v0 + v7;
            p[7*8 + col] = v0 - v7;
            p[1*8 + col] = v1 + v6;
            p[6*8 + col] = v1 - v6;
            p[2*8 + col] = v2 + v5;
            p[5*8 + col] = v2 - v5;
            p[3*8 + col] = v3 + v4;
            p[4*8 + col] = v3 - v4;
        }

        // convert to 8-bit integers
        for (i = 0; i < 64; ++i) 
        {
            var sample = 128 + ((p[i] + 8) >> 4);
            dataOut[i] = sample < 0 ? 0 : sample > 0xFF ? 0xFF : sample;
        }
    }

    var i, j;
    for (var blockRow = 0; blockRow < blocksPerColumn; blockRow++) 
    {
        var scanLine = blockRow << 3;
        for (i = 0; i < 8; i++) lines.push(new Uint8Array(samplesPerLine));
        for (var blockCol = 0; blockCol < blocksPerLine; blockCol++) 
        {
            quantizeAndInverse(component.blocks[blockRow][blockCol], r, R);

            var offset = 0, sample = blockCol << 3;
            for (j = 0; j < 8; j++) 
            {
                var line = lines[scanLine + j];
                for (i = 0; i < 8; i++) line[sample + i] = r[offset++];
            }
        }
    }
    return lines;
}

function clampTo8bit(a) 
{
    return a < 0 ? 0 : a > 255 ? 255 : a;
}

JpegImage.prototype = {
    constructor: JpegImage,

    parse: function parse(data) {
        var offset = 0, length = data.length;
        function readUint16() 
        {
            var value = (data[offset] << 8) | data[offset + 1];
            offset += 2;
            return value;
        }
        
        function readDataBlock() 
        {
            var length = readUint16();
            var array = data.subarray(offset, offset + length - 2);
            offset += array.length;
            return array;
        }
        
        function prepareComponents(frame) 
        {
            var maxH = 0, maxV = 0;
            var component, componentId;
            for (componentId in frame.components) 
            {
                if (frame.components.hasOwnProperty(componentId)) 
                {
                    component = frame.components[componentId];
                    if (maxH < component.h) maxH = component.h;
                    if (maxV < component.v) maxV = component.v;
                }
            }
            var mcusPerLine = Math.ceil(frame.samplesPerLine / 8 / maxH);
            var mcusPerColumn = Math.ceil(frame.scanLines / 8 / maxV);
            for (componentId in frame.components) 
            {
                if (frame.components.hasOwnProperty(componentId)) 
                {
                    component = frame.components[componentId];
                    var blocksPerLine = Math.ceil(Math.ceil(frame.samplesPerLine / 8) * component.h / maxH);
                    var blocksPerColumn = Math.ceil(Math.ceil(frame.scanLines  / 8) * component.v / maxV);
                    var blocksPerLineForMcu = mcusPerLine * component.h;
                    var blocksPerColumnForMcu = mcusPerColumn * component.v;
                    var blocks = [];
                    for (var i = 0; i < blocksPerColumnForMcu; i++) 
                    {
                        var row = [];
                        for (var j = 0; j < blocksPerLineForMcu; j++) row.push(new Int32Array(64));
                        blocks.push(row);
                    }
                    component.blocksPerLine = blocksPerLine;
                    component.blocksPerColumn = blocksPerColumn;
                    component.blocks = blocks;
                }
            }
            frame.maxH = maxH;
            frame.maxV = maxV;
            frame.mcusPerLine = mcusPerLine;
            frame.mcusPerColumn = mcusPerColumn;
        }
        
        var jfif = null;
        var adobe = null;
        var pixels = null;
        var frame, resetInterval;
        var quantizationTables = [], frames = [];
        var huffmanTablesAC = [], huffmanTablesDC = [];
        var fileMarker = readUint16();
        if (fileMarker != 0xFFD8) 
        { 
            // SOI (Start of Image)
            throw "SOI not found";
        }

        fileMarker = readUint16();
        while (fileMarker != 0xFFD9) 
        { 
            // EOI (End of image)
            var i, j, l;
            switch(fileMarker) 
            {
                case 0xFF00: 
                    break;
                case 0xFFE0: // APP0 (Application Specific)
                case 0xFFE1: // APP1
                case 0xFFE2: // APP2
                case 0xFFE3: // APP3
                case 0xFFE4: // APP4
                case 0xFFE5: // APP5
                case 0xFFE6: // APP6
                case 0xFFE7: // APP7
                case 0xFFE8: // APP8
                case 0xFFE9: // APP9
                case 0xFFEA: // APP10
                case 0xFFEB: // APP11
                case 0xFFEC: // APP12
                case 0xFFED: // APP13
                case 0xFFEE: // APP14
                case 0xFFEF: // APP15
                case 0xFFFE: // COM (Comment)
                    var appData = readDataBlock();

                    if (fileMarker === 0xFFE0) 
                    {
                        if (appData[0] === 0x4A && appData[1] === 0x46 && appData[2] === 0x49 &&
                        appData[3] === 0x46 && appData[4] === 0) 
                        { 
                            // 'JFIF\x00'
                            jfif = {
                                version: { major: appData[5], minor: appData[6] },
                                densityUnits: appData[7],
                                xDensity: (appData[8] << 8) | appData[9],
                                yDensity: (appData[10] << 8) | appData[11],
                                thumbWidth: appData[12],
                                thumbHeight: appData[13],
                                thumbData: appData.subarray(14, 14 + 3 * appData[12] * appData[13])
                            };
                        }
                    }
                    // TODO APP1 - Exif
                    if (fileMarker === 0xFFEE) 
                    {
                        if (appData[0] === 0x41 && appData[1] === 0x64 && appData[2] === 0x6F &&
                        appData[3] === 0x62 && appData[4] === 0x65 && appData[5] === 0) 
                        { 
                            // 'Adobe\x00'
                            adobe = {
                                version: appData[6],
                                flags0: (appData[7] << 8) | appData[8],
                                flags1: (appData[9] << 8) | appData[10],
                                transformCode: appData[11]
                            };
                        }
                    }
                    break;

                case 0xFFDB: // DQT (Define Quantization Tables)
                    var quantizationTablesLength = readUint16();
                    var quantizationTablesEnd = quantizationTablesLength + offset - 2;
                    while (offset < quantizationTablesEnd) 
                    {
                        var quantizationTableSpec = data[offset++];
                        var tableData = new Int32Array(64);
                        if ((quantizationTableSpec >> 4) === 0) 
                        { 
                            // 8 bit values
                            for (j = 0; j < 64; j++) 
                            {
                                var z = dctZigZag[j];
                                tableData[z] = data[offset++];
                            }
                        } 
                        else if ((quantizationTableSpec >> 4) === 1) 
                        {
                            //16 bit
                            for (j = 0; j < 64; j++) 
                            {
                                var z = dctZigZag[j];
                                tableData[z] = readUint16();
                            }
                        } 
                        else throw "DQT: invalid table spec";
                        quantizationTables[quantizationTableSpec & 15] = tableData;
                    }
                    break;

                case 0xFFC0: // SOF0 (Start of Frame, Baseline DCT)
                case 0xFFC1: // SOF1 (Start of Frame, Extended DCT)
                case 0xFFC2: // SOF2 (Start of Frame, Progressive DCT)
                    readUint16(); // skip data length
                    frame = {};
                    frame.extended = (fileMarker === 0xFFC1);
                    frame.progressive = (fileMarker === 0xFFC2);
                    frame.precision = data[offset++];
                    frame.scanLines = readUint16();
                    frame.samplesPerLine = readUint16();
                    frame.components = {};
                    frame.componentsOrder = [];
                    var componentsCount = data[offset++], componentId;
                    var maxH = 0, maxV = 0;
                    for (i = 0; i < componentsCount; i++) 
                    {
                        componentId = data[offset];
                        var h = data[offset + 1] >> 4;
                        var v = data[offset + 1] & 15;
                        var qId = data[offset + 2];
                        frame.componentsOrder.push(componentId);
                        frame.components[componentId] = {
                            h: h,
                            v: v,
                            quantizationIdx: qId
                        };
                        offset += 3;
                    }
                    prepareComponents(frame);
                    frames.push(frame);
                    break;

                case 0xFFC4: // DHT (Define Huffman Tables)
                    var huffmanLength = readUint16();
                    for (i = 2; i < huffmanLength;) 
                    {
                        var huffmanTableSpec = data[offset++];
                        var codeLengths = new Uint8Array(16);
                        var codeLengthSum = 0;
                        for (j = 0; j < 16; j++, offset++) codeLengthSum += (codeLengths[j] = data[offset]);
                        var huffmanValues = new Uint8Array(codeLengthSum);
                        for (j = 0; j < codeLengthSum; j++, offset++) huffmanValues[j] = data[offset];
                        i += 17 + codeLengthSum;

                        ((huffmanTableSpec >> 4) === 0 
                                    ? huffmanTablesDC 
                                    : huffmanTablesAC)[huffmanTableSpec & 15] = buildHuffmanTable(codeLengths, huffmanValues);
                    }
                    break;

                case 0xFFDD: // DRI (Define Restart Interval)
                    readUint16(); // skip data length
                    resetInterval = readUint16();
                    break;

                case 0xFFDA: // SOS (Start of Scan)
                    var scanLength = readUint16();
                    var selectorsCount = data[offset++];
                    var components = [], component;
                    for (i = 0; i < selectorsCount; i++) 
                    {
                        component = frame.components[data[offset++]];
                        var tableSpec = data[offset++];
                        component.huffmanTableDC = huffmanTablesDC[tableSpec >> 4];
                        component.huffmanTableAC = huffmanTablesAC[tableSpec & 15];
                        components.push(component);
                    }
                    var spectralStart = data[offset++];
                    var spectralEnd = data[offset++];
                    var successiveApproximation = data[offset++];
                    var processed = decodeScan(data, offset,
                    frame, components, resetInterval,
                    spectralStart, spectralEnd,
                    successiveApproximation >> 4, successiveApproximation & 15);
                    offset += processed;
                    break;
                
                default:
                    if (data[offset - 3] == 0xFF &&
                    data[offset - 2] >= 0xC0 && data[offset - 2] <= 0xFE) 
                    {
                        // could be incorrect encoding -- last 0xFF byte of the previous
                        // block was eaten by the encoder
                        offset -= 3;
                        break;
                    }
                throw "unknown JPEG marker " + fileMarker.toString(16);
            }
            fileMarker = readUint16();
        }
        
        if (frames.length != 1) throw "only single frame JPEGs supported";

        // set each frame's components quantization table
        for (var i = 0; i < frames.length; i++) 
        {
            var cp = frames[i].components;
            for (var j in cp) 
            {
                cp[j].quantizationTable = quantizationTables[cp[j].quantizationIdx];
                delete cp[j].quantizationIdx;
            }
        }

        this.width = frame.samplesPerLine;
        this.height = frame.scanLines;
        this.jfif = jfif;
        this.adobe = adobe;
        this.components = [];
        for (var i = 0; i < frame.componentsOrder.length; i++) 
        {
            var component = frame.components[frame.componentsOrder[i]];
            this.components.push({
                lines: buildComponentData(frame, component),
                scaleX: component.h / frame.maxH,
                scaleY: component.v / frame.maxV
            });
        }
    },
    
    getData: function getData(width, height) {
        var scaleX = this.width / width, scaleY = this.height / height;

        var component1, component2, component3, component4;
        var component1Line, component2Line, component3Line, component4Line;
        var x, y;
        var offset = 0;
        var Y, Cb, Cr, K, C, M, Ye, R, G, B;
        var colorTransform;
        var dataLength = width * height * this.components.length;
        var data = new Uint8Array(dataLength);
        switch (this.components.length) 
        {
            case 1:
                component1 = this.components[0];
                for (y = 0; y < height; y++) 
                {
                    component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                    for (x = 0; x < width; x++) 
                    {
                        Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                        data[offset++] = Y;
                    }
                }
                break;
            case 2:
                // PDF might compress two component data in custom colorspace
                component1 = this.components[0];
                component2 = this.components[1];
                for (y = 0; y < height; y++) 
                {
                    component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                    component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
                    for (x = 0; x < width; x++) 
                    {
                        Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                        data[offset++] = Y;
                        Y = component2Line[0 | (x * component2.scaleX * scaleX)];
                        data[offset++] = Y;
                    }
                }
                break;
            case 3:
                // The default transform for three components is true
                colorTransform = true;
                // The adobe transform marker overrides any previous setting
                if (this.adobe && this.adobe.transformCode) colorTransform = true;
                else if (typeof this.colorTransform !== 'undefined') colorTransform = !!this.colorTransform;

                component1 = this.components[0];
                component2 = this.components[1];
                component3 = this.components[2];
                for (y = 0; y < height; y++) 
                {
                    component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                    component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
                    component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
                    for (x = 0; x < width; x++) 
                    {
                        if (!colorTransform) 
                        {
                            R = component1Line[0 | (x * component1.scaleX * scaleX)];
                            G = component2Line[0 | (x * component2.scaleX * scaleX)];
                            B = component3Line[0 | (x * component3.scaleX * scaleX)];
                        } 
                        else 
                        {
                            Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                            Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
                            Cr = component3Line[0 | (x * component3.scaleX * scaleX)];

                            R = clampTo8bit(Y + 1.402 * (Cr - 128));
                            G = clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                            B = clampTo8bit(Y + 1.772 * (Cb - 128));
                        }

                        data[offset++] = R;
                        data[offset++] = G;
                        data[offset++] = B;
                    }
                }
                break;
            case 4:
                if (!this.adobe) throw 'Unsupported color mode (4 components)';
                // The default transform for four components is false
                colorTransform = false;
                // The adobe transform marker overrides any previous setting
                if (this.adobe && this.adobe.transformCode) colorTransform = true;
                else if (typeof this.colorTransform !== 'undefined') colorTransform = !!this.colorTransform;

                component1 = this.components[0];
                component2 = this.components[1];
                component3 = this.components[2];
                component4 = this.components[3];
                for (y = 0; y < height; y++) 
                {
                    component1Line = component1.lines[0 | (y * component1.scaleY * scaleY)];
                    component2Line = component2.lines[0 | (y * component2.scaleY * scaleY)];
                    component3Line = component3.lines[0 | (y * component3.scaleY * scaleY)];
                    component4Line = component4.lines[0 | (y * component4.scaleY * scaleY)];
                    for (x = 0; x < width; x++) 
                    {
                        if (!colorTransform) 
                        {
                            C = component1Line[0 | (x * component1.scaleX * scaleX)];
                            M = component2Line[0 | (x * component2.scaleX * scaleX)];
                            Ye = component3Line[0 | (x * component3.scaleX * scaleX)];
                            K = component4Line[0 | (x * component4.scaleX * scaleX)];
                        } 
                        else 
                        {
                            Y = component1Line[0 | (x * component1.scaleX * scaleX)];
                            Cb = component2Line[0 | (x * component2.scaleX * scaleX)];
                            Cr = component3Line[0 | (x * component3.scaleX * scaleX)];
                            K = component4Line[0 | (x * component4.scaleX * scaleX)];

                            C = 255 - clampTo8bit(Y + 1.402 * (Cr - 128));
                            M = 255 - clampTo8bit(Y - 0.3441363 * (Cb - 128) - 0.71413636 * (Cr - 128));
                            Ye = 255 - clampTo8bit(Y + 1.772 * (Cb - 128));
                        }
                        data[offset++] = C;
                        data[offset++] = M;
                        data[offset++] = Ye;
                        data[offset++] = K;
                    }
                }
                break;
            default:
                throw 'Unsupported color mode';
        }
        return data;
    },
    
    copyToImageData: function copyToImageData(imageData) {
        var width = imageData.width, height = imageData.height;
        var imageDataArray = imageData.data;
        var data = this.getData(width, height);
        var i = 0, j = 0, x, y;
        var Y, K, C, M, R, G, B;
        switch (this.components.length) 
        {
            case 1:
                for (y = 0; y < height; y++) 
                {
                    for (x = 0; x < width; x++) 
                    {
                        Y = data[i++];
                        imageDataArray[j++] = Y;
                        imageDataArray[j++] = Y;
                        imageDataArray[j++] = Y;
                        imageDataArray[j++] = 255;
                    }
                }
                break;
            case 3:
                for (y = 0; y < height; y++) 
                {
                    for (x = 0; x < width; x++) 
                    {
                        R = data[i++];
                        G = data[i++];
                        B = data[i++];

                        imageDataArray[j++] = R;
                        imageDataArray[j++] = G;
                        imageDataArray[j++] = B;
                        imageDataArray[j++] = 255;
                    }
                }
                break;
            case 4:
                for (y = 0; y < height; y++) 
                {
                    for (x = 0; x < width; x++) 
                    {
                        C = data[i++];
                        M = data[i++];
                        Y = data[i++];
                        K = data[i++];

                        R = 255 - clampTo8bit(C * (1 - K / 255) + K);
                        G = 255 - clampTo8bit(M * (1 - K / 255) + K);
                        B = 255 - clampTo8bit(Y * (1 - K / 255) + K);

                        imageDataArray[j++] = R;
                        imageDataArray[j++] = G;
                        imageDataArray[j++] = B;
                        imageDataArray[j++] = 255;
                    }
                }
                break;
            default:
                throw 'Unsupported color mode';
        }
    }
};

var btoa = btoa || function(buf) {
    return new Buffer(buf).toString('base64');
};

function JPEGEncoder( quality ) {
    var self = this;
    var fround = Math.round;
    var ffloor = Math.floor;
    var YTable = new Array(64);
    var UVTable = new Array(64);
    var fdtbl_Y = new Array(64);
    var fdtbl_UV = new Array(64);
    var YDC_HT;
    var UVDC_HT;
    var YAC_HT;
    var UVAC_HT;

    var bitcode = new Array(65535);
    var category = new Array(65535);
    var outputfDCTQuant = new Array(64);
    var DU = new Array(64);
    var byteout = [];
    var bytenew = 0;
    var bytepos = 7;

    var YDU = new Array(64);
    var UDU = new Array(64);
    var VDU = new Array(64);
    var clt = new Array(256);
    var RGB_YUV_TABLE = new Array(2048);
    var currentQuality;

    var ZigZag = [
    0, 1, 5, 6,14,15,27,28,
    2, 4, 7,13,16,26,29,42,
    3, 8,12,17,25,30,41,43,
    9,11,18,24,31,40,44,53,
    10,19,23,32,39,45,52,54,
    20,22,33,38,46,51,55,60,
    21,34,37,47,50,56,59,61,
    35,36,48,49,57,58,62,63
    ];

    var std_dc_luminance_nrcodes = [0,0,1,5,1,1,1,1,1,1,0,0,0,0,0,0,0];
    var std_dc_luminance_values = [0,1,2,3,4,5,6,7,8,9,10,11];
    var std_ac_luminance_nrcodes = [0,0,2,1,3,3,2,4,3,5,5,4,4,0,0,1,0x7d];
    var std_ac_luminance_values = [
    0x01,0x02,0x03,0x00,0x04,0x11,0x05,0x12,
    0x21,0x31,0x41,0x06,0x13,0x51,0x61,0x07,
    0x22,0x71,0x14,0x32,0x81,0x91,0xa1,0x08,
    0x23,0x42,0xb1,0xc1,0x15,0x52,0xd1,0xf0,
    0x24,0x33,0x62,0x72,0x82,0x09,0x0a,0x16,
    0x17,0x18,0x19,0x1a,0x25,0x26,0x27,0x28,
    0x29,0x2a,0x34,0x35,0x36,0x37,0x38,0x39,
    0x3a,0x43,0x44,0x45,0x46,0x47,0x48,0x49,
    0x4a,0x53,0x54,0x55,0x56,0x57,0x58,0x59,
    0x5a,0x63,0x64,0x65,0x66,0x67,0x68,0x69,
    0x6a,0x73,0x74,0x75,0x76,0x77,0x78,0x79,
    0x7a,0x83,0x84,0x85,0x86,0x87,0x88,0x89,
    0x8a,0x92,0x93,0x94,0x95,0x96,0x97,0x98,
    0x99,0x9a,0xa2,0xa3,0xa4,0xa5,0xa6,0xa7,
    0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,0xb5,0xb6,
    0xb7,0xb8,0xb9,0xba,0xc2,0xc3,0xc4,0xc5,
    0xc6,0xc7,0xc8,0xc9,0xca,0xd2,0xd3,0xd4,
    0xd5,0xd6,0xd7,0xd8,0xd9,0xda,0xe1,0xe2,
    0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,0xea,
    0xf1,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
    0xf9,0xfa
    ];

    var std_dc_chrominance_nrcodes = [0,0,3,1,1,1,1,1,1,1,1,1,0,0,0,0,0];
    var std_dc_chrominance_values = [0,1,2,3,4,5,6,7,8,9,10,11];
    var std_ac_chrominance_nrcodes = [0,0,2,1,2,4,4,3,4,7,5,4,4,0,1,2,0x77];
    var std_ac_chrominance_values = [
    0x00,0x01,0x02,0x03,0x11,0x04,0x05,0x21,
    0x31,0x06,0x12,0x41,0x51,0x07,0x61,0x71,
    0x13,0x22,0x32,0x81,0x08,0x14,0x42,0x91,
    0xa1,0xb1,0xc1,0x09,0x23,0x33,0x52,0xf0,
    0x15,0x62,0x72,0xd1,0x0a,0x16,0x24,0x34,
    0xe1,0x25,0xf1,0x17,0x18,0x19,0x1a,0x26,
    0x27,0x28,0x29,0x2a,0x35,0x36,0x37,0x38,
    0x39,0x3a,0x43,0x44,0x45,0x46,0x47,0x48,
    0x49,0x4a,0x53,0x54,0x55,0x56,0x57,0x58,
    0x59,0x5a,0x63,0x64,0x65,0x66,0x67,0x68,
    0x69,0x6a,0x73,0x74,0x75,0x76,0x77,0x78,
    0x79,0x7a,0x82,0x83,0x84,0x85,0x86,0x87,
    0x88,0x89,0x8a,0x92,0x93,0x94,0x95,0x96,
    0x97,0x98,0x99,0x9a,0xa2,0xa3,0xa4,0xa5,
    0xa6,0xa7,0xa8,0xa9,0xaa,0xb2,0xb3,0xb4,
    0xb5,0xb6,0xb7,0xb8,0xb9,0xba,0xc2,0xc3,
    0xc4,0xc5,0xc6,0xc7,0xc8,0xc9,0xca,0xd2,
    0xd3,0xd4,0xd5,0xd6,0xd7,0xd8,0xd9,0xda,
    0xe2,0xe3,0xe4,0xe5,0xe6,0xe7,0xe8,0xe9,
    0xea,0xf2,0xf3,0xf4,0xf5,0xf6,0xf7,0xf8,
    0xf9,0xfa
    ];

    function initQuantTables(sf)
    {
        var YQT = [
        16, 11, 10, 16, 24, 40, 51, 61,
        12, 12, 14, 19, 26, 58, 60, 55,
        14, 13, 16, 24, 40, 57, 69, 56,
        14, 17, 22, 29, 51, 87, 80, 62,
        18, 22, 37, 56, 68,109,103, 77,
        24, 35, 55, 64, 81,104,113, 92,
        49, 64, 78, 87,103,121,120,101,
        72, 92, 95, 98,112,100,103, 99
        ];

        for (var i = 0; i < 64; i++) 
        {
            var t = ffloor((YQT[i]*sf+50)/100);
            if (t < 1) 
            {
                t = 1;
            } 
            else if (t > 255) 
            {
                t = 255;
            }
            YTable[ZigZag[i]] = t;
        }
        var UVQT = [
        17, 18, 24, 47, 99, 99, 99, 99,
        18, 21, 26, 66, 99, 99, 99, 99,
        24, 26, 56, 99, 99, 99, 99, 99,
        47, 66, 99, 99, 99, 99, 99, 99,
        99, 99, 99, 99, 99, 99, 99, 99,
        99, 99, 99, 99, 99, 99, 99, 99,
        99, 99, 99, 99, 99, 99, 99, 99,
        99, 99, 99, 99, 99, 99, 99, 99
        ];
        for (var j = 0; j < 64; j++) 
        {
            var u = ffloor((UVQT[j]*sf+50)/100);
            if (u < 1) 
            {
                u = 1;
            } 
            else if (u > 255) 
            {
                u = 255;
            }
            UVTable[ZigZag[j]] = u;
        }
        var aasf = [
        1.0, 1.387039845, 1.306562965, 1.175875602,
        1.0, 0.785694958, 0.541196100, 0.275899379
        ];
        var k = 0;
        for (var row = 0; row < 8; row++)
        {
            for (var col = 0; col < 8; col++)
            {
                fdtbl_Y[k]  = (1.0 / (YTable [ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                fdtbl_UV[k] = (1.0 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                k++;
            }
        }
    }

    function computeHuffmanTbl(nrcodes, std_table)
    {
        var codevalue = 0;
        var pos_in_table = 0;
        var HT = new Array();
        for (var k = 1; k <= 16; k++) 
        {
            for (var j = 1; j <= nrcodes[k]; j++) 
            {
                HT[std_table[pos_in_table]] = [];
                HT[std_table[pos_in_table]][0] = codevalue;
                HT[std_table[pos_in_table]][1] = k;
                pos_in_table++;
                codevalue++;
            }
            codevalue*=2;
        }
        return HT;
    }

    function initHuffmanTbl()
    {
        YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes,std_dc_luminance_values);
        UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes,std_dc_chrominance_values);
        YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes,std_ac_luminance_values);
        UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes,std_ac_chrominance_values);
    }

    function initCategoryNumber()
    {
        var nrlower = 1;
        var nrupper = 2;
        for (var cat = 1; cat <= 15; cat++) 
        {
            //Positive numbers
            for (var nr = nrlower; nr<nrupper; nr++) 
            {
                category[32767+nr] = cat;
                bitcode[32767+nr] = [];
                bitcode[32767+nr][1] = cat;
                bitcode[32767+nr][0] = nr;
            }
            //Negative numbers
            for (var nrneg =-(nrupper-1); nrneg<=-nrlower; nrneg++) 
            {
                category[32767+nrneg] = cat;
                bitcode[32767+nrneg] = [];
                bitcode[32767+nrneg][1] = cat;
                bitcode[32767+nrneg][0] = nrupper-1+nrneg;
            }
            nrlower <<= 1;
            nrupper <<= 1;
        }
    }

    function initRGBYUVTable() 
    {
        for(var i = 0; i < 256;i++) 
        {
            RGB_YUV_TABLE[i]      		=  19595 * i;
            RGB_YUV_TABLE[(i+ 256)>>0] 	=  38470 * i;
            RGB_YUV_TABLE[(i+ 512)>>0] 	=   7471 * i + 0x8000;
            RGB_YUV_TABLE[(i+ 768)>>0] 	= -11059 * i;
            RGB_YUV_TABLE[(i+1024)>>0] 	= -21709 * i;
            RGB_YUV_TABLE[(i+1280)>>0] 	=  32768 * i + 0x807FFF;
            RGB_YUV_TABLE[(i+1536)>>0] 	= -27439 * i;
            RGB_YUV_TABLE[(i+1792)>>0] 	= - 5329 * i;
        }
    }

    // IO functions
    function writeBits(bs)
    {
        var value = bs[0];
        var posval = bs[1]-1;
        while ( posval >= 0 ) 
        {
            if (value & (1 << posval) ) 
            {
                bytenew |= (1 << bytepos);
            }
            posval--;
            bytepos--;
            if (bytepos < 0) 
            {
                if (bytenew == 0xFF) 
                {
                    writeByte(0xFF);
                    writeByte(0);
                }
                else 
                {
                    writeByte(bytenew);
                }
                bytepos=7;
                bytenew=0;
            }
        }
    }

    function writeByte(value)
    {
        //byteout.push(clt[value]); // write char directly instead of converting later
        byteout.push(value);
    }

    function writeWord(value)
    {
        writeByte((value>>8)&0xFF);
        writeByte((value   )&0xFF);
    }

    // DCT & quantization core
    function fDCTQuant(data, fdtbl)
    {
        var d0, d1, d2, d3, d4, d5, d6, d7;
        /* Pass 1: process rows. */
        var dataOff=0;
        var i;
        const I8 = 8;
        const I64 = 64;
        for (i=0; i<I8; ++i)
        {
            d0 = data[dataOff];
            d1 = data[dataOff+1];
            d2 = data[dataOff+2];
            d3 = data[dataOff+3];
            d4 = data[dataOff+4];
            d5 = data[dataOff+5];
            d6 = data[dataOff+6];
            d7 = data[dataOff+7];

            var tmp0 = d0 + d7;
            var tmp7 = d0 - d7;
            var tmp1 = d1 + d6;
            var tmp6 = d1 - d6;
            var tmp2 = d2 + d5;
            var tmp5 = d2 - d5;
            var tmp3 = d3 + d4;
            var tmp4 = d3 - d4;

            /* Even part */
            var tmp10 = tmp0 + tmp3;	/* phase 2 */
            var tmp13 = tmp0 - tmp3;
            var tmp11 = tmp1 + tmp2;
            var tmp12 = tmp1 - tmp2;

            data[dataOff] = tmp10 + tmp11; /* phase 3 */
            data[dataOff+4] = tmp10 - tmp11;

            var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
            data[dataOff+2] = tmp13 + z1; /* phase 5 */
            data[dataOff+6] = tmp13 - z1;

            /* Odd part */
            tmp10 = tmp4 + tmp5; /* phase 2 */
            tmp11 = tmp5 + tmp6;
            tmp12 = tmp6 + tmp7;

            /* The rotator is modified from fig 4-8 to avoid extra negations. */
            var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
            var z2 = 0.541196100 * tmp10 + z5; /* c2-c6 */
            var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
            var z3 = tmp11 * 0.707106781; /* c4 */

            var z11 = tmp7 + z3;	/* phase 5 */
            var z13 = tmp7 - z3;

            data[dataOff+5] = z13 + z2;	/* phase 6 */
            data[dataOff+3] = z13 - z2;
            data[dataOff+1] = z11 + z4;
            data[dataOff+7] = z11 - z4;

            dataOff += 8; /* advance pointer to next row */
        }

        /* Pass 2: process columns. */
        dataOff = 0;
        for (i=0; i<I8; ++i)
        {
            d0 = data[dataOff];
            d1 = data[dataOff + 8];
            d2 = data[dataOff + 16];
            d3 = data[dataOff + 24];
            d4 = data[dataOff + 32];
            d5 = data[dataOff + 40];
            d6 = data[dataOff + 48];
            d7 = data[dataOff + 56];

            var tmp0p2 = d0 + d7;
            var tmp7p2 = d0 - d7;
            var tmp1p2 = d1 + d6;
            var tmp6p2 = d1 - d6;
            var tmp2p2 = d2 + d5;
            var tmp5p2 = d2 - d5;
            var tmp3p2 = d3 + d4;
            var tmp4p2 = d3 - d4;

            /* Even part */
            var tmp10p2 = tmp0p2 + tmp3p2;	/* phase 2 */
            var tmp13p2 = tmp0p2 - tmp3p2;
            var tmp11p2 = tmp1p2 + tmp2p2;
            var tmp12p2 = tmp1p2 - tmp2p2;

            data[dataOff] = tmp10p2 + tmp11p2; /* phase 3 */
            data[dataOff+32] = tmp10p2 - tmp11p2;

            var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
            data[dataOff+16] = tmp13p2 + z1p2; /* phase 5 */
            data[dataOff+48] = tmp13p2 - z1p2;

            /* Odd part */
            tmp10p2 = tmp4p2 + tmp5p2; /* phase 2 */
            tmp11p2 = tmp5p2 + tmp6p2;
            tmp12p2 = tmp6p2 + tmp7p2;

            /* The rotator is modified from fig 4-8 to avoid extra negations. */
            var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
            var z2p2 = 0.541196100 * tmp10p2 + z5p2; /* c2-c6 */
            var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
            var z3p2 = tmp11p2 * 0.707106781; /* c4 */

            var z11p2 = tmp7p2 + z3p2;	/* phase 5 */
            var z13p2 = tmp7p2 - z3p2;

            data[dataOff+40] = z13p2 + z2p2; /* phase 6 */
            data[dataOff+24] = z13p2 - z2p2;
            data[dataOff+ 8] = z11p2 + z4p2;
            data[dataOff+56] = z11p2 - z4p2;

            dataOff++; /* advance pointer to next column */
        }

        // Quantize/descale the coefficients
        var fDCTQuant;
        for (i=0; i<I64; ++i)
        {
            // Apply the quantization and scaling factor & Round to nearest integer
            fDCTQuant = data[i]*fdtbl[i];
            outputfDCTQuant[i] = (fDCTQuant > 0.0) ? ((fDCTQuant + 0.5)|0) : ((fDCTQuant - 0.5)|0);
            //outputfDCTQuant[i] = fround(fDCTQuant);
        }
        return outputfDCTQuant;
    }

    function writeAPP0()
    {
        writeWord(0xFFE0); // marker
        writeWord(16); // length
        writeByte(0x4A); // J
        writeByte(0x46); // F
        writeByte(0x49); // I
        writeByte(0x46); // F
        writeByte(0); // = "JFIF",'\0'
        writeByte(1); // versionhi
        writeByte(1); // versionlo
        writeByte(0); // xyunits
        writeWord(1); // xdensity
        writeWord(1); // ydensity
        writeByte(0); // thumbnwidth
        writeByte(0); // thumbnheight
    }

    function writeSOF0(width, height)
    {
        writeWord(0xFFC0); // marker
        writeWord(17);   // length, truecolor YUV JPG
        writeByte(8);    // precision
        writeWord(height);
        writeWord(width);
        writeByte(3);    // nrofcomponents
        writeByte(1);    // IdY
        writeByte(0x11); // HVY
        writeByte(0);    // QTY
        writeByte(2);    // IdU
        writeByte(0x11); // HVU
        writeByte(1);    // QTU
        writeByte(3);    // IdV
        writeByte(0x11); // HVV
        writeByte(1);    // QTV
    }

    function writeDQT()
    {
        writeWord(0xFFDB); // marker
        writeWord(132);	   // length
        writeByte(0);
        for (var i=0; i<64; i++) 
        {
            writeByte(YTable[i]);
        }
        writeByte(1);
        for (var j=0; j<64; j++) 
        {
            writeByte(UVTable[j]);
        }
    }

    function writeDHT()
    {
        writeWord(0xFFC4); // marker
        writeWord(0x01A2); // length

        writeByte(0); // HTYDCinfo
        for (var i=0; i<16; i++) 
        {
            writeByte(std_dc_luminance_nrcodes[i+1]);
        }
        for (var j=0; j<=11; j++) 
        {
            writeByte(std_dc_luminance_values[j]);
        }

        writeByte(0x10); // HTYACinfo
        for (var k=0; k<16; k++) 
        {
            writeByte(std_ac_luminance_nrcodes[k+1]);
        }
        for (var l=0; l<=161; l++) 
        {
            writeByte(std_ac_luminance_values[l]);
        }

        writeByte(1); // HTUDCinfo
        for (var m=0; m<16; m++) {
        writeByte(std_dc_chrominance_nrcodes[m+1]);
        }
        for (var n=0; n<=11; n++) 
        {
            writeByte(std_dc_chrominance_values[n]);
        }

        writeByte(0x11); // HTUACinfo
        for (var o=0; o<16; o++) 
        {
            writeByte(std_ac_chrominance_nrcodes[o+1]);
        }
        for (var p=0; p<=161; p++) 
        {
            writeByte(std_ac_chrominance_values[p]);
        }
    }

    function writeSOS()
    {
        writeWord(0xFFDA); // marker
        writeWord(12); // length
        writeByte(3); // nrofcomponents
        writeByte(1); // IdY
        writeByte(0); // HTY
        writeByte(2); // IdU
        writeByte(0x11); // HTU
        writeByte(3); // IdV
        writeByte(0x11); // HTV
        writeByte(0); // Ss
        writeByte(0x3f); // Se
        writeByte(0); // Bf
    }

    function processDU(CDU, fdtbl, DC, HTDC, HTAC)
    {
        var EOB = HTAC[0x00];
        var M16zeroes = HTAC[0xF0];
        var pos;
        const I16 = 16;
        const I63 = 63;
        const I64 = 64;
        var DU_DCT = fDCTQuant(CDU, fdtbl);
        //ZigZag reorder
        for (var j=0;j<I64;++j) 
        {
            DU[ZigZag[j]]=DU_DCT[j];
        }
        var Diff = DU[0] - DC; DC = DU[0];
        //Encode DC
        if (Diff==0) 
        {
            writeBits(HTDC[0]); // Diff might be 0
        } 
        else 
        {
            pos = 32767+Diff;
            writeBits(HTDC[category[pos]]);
            writeBits(bitcode[pos]);
        }
        //Encode ACs
        var end0pos = 63; // was const... which is crazy
        for (; (end0pos>0)&&(DU[end0pos]==0); end0pos--) {};
        //end0pos = first element in reverse order !=0
        if ( end0pos == 0) 
        {
            writeBits(EOB);
            return DC;
        }
        var i = 1;
        var lng;
        while ( i <= end0pos ) 
        {
            var startpos = i;
            for (; (DU[i]==0) && (i<=end0pos); ++i) {}
            var nrzeroes = i-startpos;
            if ( nrzeroes >= I16 ) 
            {
                lng = nrzeroes>>4;
                for (var nrmarker=1; nrmarker <= lng; ++nrmarker) writeBits(M16zeroes);
                nrzeroes = nrzeroes&0xF;
            }
            pos = 32767+DU[i];
            writeBits(HTAC[(nrzeroes<<4)+category[pos]]);
            writeBits(bitcode[pos]);
            i++;
        }
        if ( end0pos != I63 ) 
        {
            writeBits(EOB);
        }
        return DC;
    }

    function initCharLookupTable()
    {
        var sfcc = String.fromCharCode;
        for(var i=0; i < 256; i++)
        { 
            ///// ACHTUNG // 255
            clt[i] = sfcc(i);
        }
    }

    function setQuality( quality )
    {
        if (quality <= 0) 
        {
            quality = 1;
        }
        if (quality > 100) 
        {
            quality = 100;
        }

        if (currentQuality === quality) return // don't recalc if unchanged

        var sf = 0;
        if (quality < 50) 
        {
            sf = Math.floor(5000 / quality);
        } 
        else 
        {
            sf = Math.floor(200 - quality*2);
        }

        initQuantTables(sf);
        currentQuality = quality;
        //console.log('Quality set to: '+quality +'%');
    }

    function init( )
    {
        //var time_start = new Date().getTime();
        if ( !quality ) quality = 50;
        // Create tables
        initCharLookupTable()
        initHuffmanTbl();
        initCategoryNumber();
        initRGBYUVTable();

        setQuality(quality);
        //var duration = new Date().getTime() - time_start;
        //console.log('Initialization '+ duration + 'ms');
    }

    // image data object
    this.encode = function( image, quality ) {
        //var time_start = new Date().getTime();

        if ( quality ) setQuality( quality );

        // Initialize bit writer
        byteout = new Array();
        bytenew=0;
        bytepos=7;

        // Add JPEG headers
        writeWord(0xFFD8); // SOI
        writeAPP0();
        writeDQT();
        writeSOF0(image.width,image.height);
        writeDHT();
        writeSOS();


        // Encode 8x8 macroblocks
        var DCY=0;
        var DCU=0;
        var DCV=0;

        bytenew=0;
        bytepos=7;


        this.encode.displayName = "_encode_";

        var imageData = image.data;
        var width = image.width;
        var height = image.height;

        var quadWidth = width*4;
        var tripleWidth = width*3;

        var x, y = 0;
        var r, g, b;
        var start,p, col,row,pos;
        while(y < height)
        {
            x = 0;
            while(x < quadWidth)
            {
                start = quadWidth * y + x;
                p = start;
                col = -1;
                row = 0;

                for(pos=0; pos < 64; pos++)
                {
                    row = pos >> 3;// /8
                    col = ( pos & 7 ) * 4; // %8
                    p = start + ( row * quadWidth ) + col;		

                    if(y+row >= height)
                    { 
                        // padding bottom
                        p-= (quadWidth*(y+1+row-height));
                    }

                    if(x+col >= quadWidth)
                    { 
                        // padding right	
                        p-= ((x+col) - quadWidth +4)
                    }

                    r = imageData[ p++ ];
                    g = imageData[ p++ ];
                    b = imageData[ p++ ];

                    /* // calculate YUV values dynamically
                    YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
                    UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
                    VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
                    */

                    // use lookup table (slightly faster)
                    YDU[pos] = ((RGB_YUV_TABLE[r]             + RGB_YUV_TABLE[(g +  256)>>0] + RGB_YUV_TABLE[(b +  512)>>0]) >> 16)-128;
                    UDU[pos] = ((RGB_YUV_TABLE[(r +  768)>>0] + RGB_YUV_TABLE[(g + 1024)>>0] + RGB_YUV_TABLE[(b + 1280)>>0]) >> 16)-128;
                    VDU[pos] = ((RGB_YUV_TABLE[(r + 1280)>>0] + RGB_YUV_TABLE[(g + 1536)>>0] + RGB_YUV_TABLE[(b + 1792)>>0]) >> 16)-128;
                }

                DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
                DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
                DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
                x+=32;
            }
            y+=8;
        }


        ////////////////////////////////////////////////////////////////

        // Do the bit alignment of the EOI marker
        if ( bytepos >= 0 ) 
        {
            var fillbits = [];
            fillbits[1] = bytepos+1;
            fillbits[0] = (1<<(bytepos+1))-1;
            writeBits(fillbits);
        }

        writeWord(0xFFD9); //EOI

        /*
        var jpegDataUri = 'data:image/jpeg;base64,' + btoa(byteout.join(''));

        byteout = [];

        // benchmarking
        var duration = new Date().getTime() - time_start;
        //console.log('Encoding time: '+ duration + 'ms');
        //

        return jpegDataUri			*/
        //return new Buffer( byteout );
        return new Uint8Array( byteout );
    };
    init( );
};


FILTER.Codec.JPEG = FILTER.Codec.JPG = {

    encoder: function( imgData, metaData ) {
        metaData = metaData || {};
        var quality = 'undefined' === typeof metaData.quality ? 100 : metaData.quality;
        var encoder = new JPEGEncoder( quality );
        return new Buffer( encoder.encode( imgData ) );
    },
    
    decoder: function( buffer, metaData ) {
        var jpg = new JpegImage( );
        jpg.parse( new Uint8Array( buffer ) );
        var data = {
            width: jpg.width,
            height: jpg.height,
            data: new Uint8Array(jpg.width * jpg.height * 4)
        };
        jpg.copyToImageData( data );
        return data;
    }
};

}(FILTER);/**
*
* Filter BMP Image Format CODEC
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// adapted from https://github.com/shaozilee/bmp-js

function BmpDecoder( buffer ) 
{
    var self = this;
    self.pos = 0;
    self.buffer = buffer;
    self.flag = [
        String.fromCharCode(self.buffer[self.pos++]), 
        String.fromCharCode(self.buffer[self.pos++])
    ].join('');
    if ( self.flag !== "BM" ) throw new Error("Invalid BMP File");
    self.parseHeader( );
    self.parseBGR( );
}

BmpDecoder.prototype = {
    constructor: BmpDecoder,
    
    pos: 0,
    buffer: null,
    flag: null,
    fileSize: null,
    reserved: null,
    offset: null,
    headerSize: null,
    width: 0,
    height: 0,
    planes: null,
    bitPP: null,
    compress: null,
    rawSize: null,
    hr: null,
    vr: null,
    colors: null,
    importantColors: null,
    palette: null,
    data: null,
    
    readUInt8: function( pos ) {
        return this.buffer[pos++];
    },
    
    readUInt16LE: function( pos ) {
        // big endian, the most significant byte is stored in the smallest address
        // little endian, the least significant byte is stored in the smallest address
        var self = this, b0, b1;
        b0 = self.buffer[pos++];
        b1 = self.buffer[pos++];
        return b0 | (b1<<8);
    },
    
    readUInt32LE: function( pos ) {
        // big endian, the most significant byte is stored in the smallest address
        // little endian, the least significant byte is stored in the smallest address
        var self = this, b0, b1, b2, b3;
        b0 = self.buffer[pos++];
        b1 = self.buffer[pos++];
        b2 = self.buffer[pos++];
        b3 = self.buffer[pos++];
        return b0 | (b1<<8) | (b2<<16) | (b3<<24);
    },
    
    parseHeader: function( ) {
        var self = this;
        self.fileSize = self.readUInt32LE( self.pos );
        self.pos += 4;
        self.reserved = self.readUInt32LE( self.pos );
        self.pos += 4;
        self.offset = self.readUInt32LE( self.pos );
        self.pos += 4;
        self.headerSize = self.readUInt32LE( self.pos );
        self.pos += 4;
        self.width = self.readUInt32LE( self.pos );
        self.pos += 4;
        self.height = self.readUInt32LE( self.pos );
        self.pos += 4;
        self.planes = self.readUInt16LE( self.pos );
        self.pos += 2;
        self.bitPP = self.readUInt16LE( self.pos );
        self.pos += 2;
        self.compress = self.readUInt32LE( self.pos );
        self.pos += 4;
        self.rawSize = self.readUInt32LE( self.pos );
        self.pos += 4;
        self.hr = self.readUInt32LE( self.pos );
        self.pos += 4;
        self.vr = self.readUInt32LE( self.pos );
        self.pos += 4;
        self.colors = self.readUInt32LE( self.pos );
        self.pos += 4;
        self.importantColors = self.readUInt32LE( self.pos );
        self.pos += 4;

        if ( self.bitPP < 24 ) 
        {
            var len = self.colors === 0 ? 1 << self.bitPP : self.colors;
            self.palette = new Array(len);
            for (var i = 0; i < len; i++) 
            {
                var blue = self.readUInt8( self.pos++ );
                var green = self.readUInt8( self.pos++ );
                var red = self.readUInt8( self.pos++ );
                var quad = self.readUInt8( self.pos++ );
                self.palette[i] = {
                    red: red,
                    green: green,
                    blue: blue,
                    quad: quad
                };
            }
        }
    },

    parseBGR: function( ) {
        var self = this;
        self.pos = self.offset;
        var bitn = "bit" + self.bitPP;
        var len = self.width * self.height * 4;
        try {
            self.data = new Uint8Array( len );
            self[bitn]( );
        } catch (e) {
            console.log("bit decode error:" + e);
        }
    },

    bit1: function( ) {
        var self = this, palette = self.palette, w = self.width, h = self.height,
            xlen = Math.ceil(w / 8), mode = xlen%4,
            y, x, b, location, i, rgb;
        for (y = h - 1; y >= 0; y--) 
        {
            for (x = 0; x < xlen; x++) 
            {
                b = self.readUInt8(self.pos++);
                location = y * w * 4 + x*8*4;
                for (i = 0; i < 8; i++) 
                {
                    if( x*8+i<w )
                    {
                        rgb = palette[ ((b>>(7-i))&0x1) ];
                        self.data[location+i*4] = rgb.blue;
                        self.data[location+i*4 + 1] = rgb.green;
                        self.data[location+i*4 + 2] = rgb.red;
                        self.data[location+i*4 + 3] = 0xFF;
                    }
                    else
                    {
                        break;
                    }
                }
            }

            if ( mode != 0 )
            {
                self.pos += (4 - mode);
            }
        }
    },

    bit4: function( ) {
        var self = this, palette = self.palette, w = self.width, h = self.height,
            xlen = Math.ceil(w / 2), mode = xlen%4,
            y, x, b, location, before, after, rgb;
        for (y = h - 1; y >= 0; y--) 
        {
            for (x = 0; x < xlen; x++) 
            {
                b = self.readUInt8(self.pos++);
                location = y * w * 4 + x*2*4;

                before = b>>4;
                after = b&0x0F;

                rgb = palette[ before ];
                self.data[location] = rgb.blue;
                self.data[location + 1] = rgb.green;
                self.data[location + 2] = rgb.red;
                self.data[location + 3] = 0xFF;

                if( x*2+1>=w ) break;

                rgb = palette[after];
                self.data[location+4] = rgb.blue;
                self.data[location+4 + 1] = rgb.green;
                self.data[location+4 + 2] = rgb.red;
                self.data[location+4 + 3] = 0xFF;
            }

            if ( mode != 0 )
            {
                self.pos+=(4 - mode);
            }
        }
    },

    bit8: function( ) {
        var self = this, palette = self.palette, w = self.width, h = self.height,
            mode = w%4, y, x, b, location, rgb;
        for (y = h - 1; y >= 0; y--) 
        {
            for (x = 0; x < w; x++) 
            {
                b = self.readUInt8( self.pos++ );
                location = y * w * 4 + x*4;
                if ( b < palette.length ) 
                {
                    rgb = palette[b];
                    self.data[location] = rgb.blue;
                    self.data[location + 1] = rgb.green;
                    self.data[location + 2] = rgb.red;
                    self.data[location + 3] = 0xFF;
                } 
                else 
                {
                    self.data[location] = 0xFF;
                    self.data[location + 1] = 0xFF;
                    self.data[location + 2] = 0xFF;
                    self.data[location + 3] = 0xFF;
                }
            }
            if ( mode != 0 )
            {
                self.pos += (4 - mode);
            }
        }
    },

    bit24: function( ) {
        var self = this, palette = self.palette, w = self.width, h = self.height,
            mode = w%4, y, x, location, blue, green, red;
        //when height > 0
        for (y = h - 1; y >= 0; y--) 
        {
            for (x = 0; x < w; x++) 
            {
                blue = self.readUInt8( self.pos++ );
                green = self.readUInt8( self.pos++ );
                red = self.readUInt8( self.pos++ );
                location = y * w * 4 + x * 4;
                self.data[location] = red;
                self.data[location + 1] = green;
                self.data[location + 2] = blue;
                self.data[location + 3] = 0xFF;
            }
            //skip extra bytes
            self.pos += mode;
        }
    },

    getData: function( ) {
        return this.data;
    }
};

function BmpEncoder( imgData )
{
    var self = this;
    self.data = imgData.data;
    self.width = imgData.width;
    self.height = imgData.height;
    self.extraBytes = self.width%4;
    self.rgbSize = self.height*(3*self.width+self.extraBytes);
    self.headerInfoSize = 40;

    /******************header***********************/
    self.flag = "BM";
    self.reserved = 0;
    self.offset = 54;
    self.fileSize = self.rgbSize+self.offset;
    self.planes = 1;
    self.bitPP = 24;
    self.compress = 0;
    self.hr = 0;
    self.vr = 0;
    self.colors = 0;
    self.importantColors = 0;
}

BmpEncoder.prototype = {
    constructor: BmpEncoder,
    
    flag: null,
    fileSize: null,
    reserved: null,
    offset: null,
    headerSize: null,
    width: 0,
    height: 0,
    planes: null,
    bitPP: null,
    compress: null,
    rawSize: null,
    hr: null,
    vr: null,
    colors: null,
    importantColors: null,
    palette: null,
    extraBytes: null,
    rgbSize: null,
    headerInfoSize: null,
    data: null,
    
    write: function( buffer, s ) {
        for (var i=0; i<s.length; i++)
            buffer.push( s.charCodeAt( i ) );
    },
    
    writeUInt8: function( buffer, b ) {
        buffer.push( b&255 );
    },
    
    writeUInt16LE: function( buffer, b ) {
        buffer.push( b&255, (b>>>8)&255 );
    },
    
    writeUInt32LE: function( buffer, b ) {
        buffer.push( b&255, (b>>>8)&255, 
            (b>>>16)&255, (b>>>24)&255 );
    },
    
    fill: function( buffer, b, start, end ) {
        for (var i=start; i<end; i++)
            buffer[i] = b;
    },
    
    encode: function( ) {
        var self = this, w = self.width, h = self.height, 
            header = [], buffer = new Array( self.offset+self.rgbSize );
        self.write( header, self.flag );
        self.writeUInt32LE( header, self.fileSize );
        self.writeUInt32LE( header, self.reserved );
        self.writeUInt32LE( header, self.offset );

        self.writeUInt32LE( header, self.headerInfoSize );
        self.writeUInt32LE( header, w );
        self.writeUInt32LE( header, h );
        self.writeUInt16LE( header, self.planes );
        self.writeUInt16LE( header, self.bitPP );
        self.writeUInt32LE( header, self.compress );
        self.writeUInt32LE( header, self.rgbSize );
        self.writeUInt32LE( header, self.hr );
        self.writeUInt32LE( header, self.vr );
        self.writeUInt32LE( header, self.colors );
        self.writeUInt32LE( header, self.importantColors );

        var i = 0, rowBytes = 3*w+self.extraBytes, y, x, p, r, g, b, fillOffset;

        for (y = h - 1; y >= 0; y--)
        {
            for (x = 0; x < w; x++)
            {
                p = y*rowBytes+x*3;
                r = self.data[i++];//r
                g = self.data[i++];//g
                b = self.data[i++];//b
                i++;
                buffer[p+2] = r;
                buffer[p+1] = g;
                buffer[p]   = b;
            }
            if ( self.extraBytes>0 )
            {
                fillOffset = y*rowBytes+w*3;
                self.fill( buffer, 0, fillOffset, fillOffset+self.extraBytes );
            }
        }
        return new Uint8Array( header.concat( buffer ) );
    }
};

FILTER.Codec.BMP = {

    encoder: function( imgData, metaData ) {
        var quality = typeof metaData.quality === 'undefined' ? 100 : metaData.quality;
        return new Buffer( new BmpEncoder( imgData ).encode( ) );
    },
    
    decoder: function( buffer, metaData ) {
        var bmp = new BmpDecoder( new Uint8Array(buffer) );
        return {
            data: bmp.data,
            width: bmp.width,
            height: bmp.height
        };
    }
};

}(FILTER);/**
*
* Filter GIF Image Format CODEC
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// adapted from: https://github.com/buzzfeed/libgif-js
// Generic functions
function bitsToNum( ba ) 
{
    return ba.reduce(function (s, n) {
        return s * 2 + n;
    }, 0);
}

function byteToBitArr( bite ) 
{
    var a = [];
    for (var i = 7; i >= 0; i--) 
    {
        a.push( !! (bite & (1 << i)));
    }
    return a;
}

function lzwDecode( minCodeSize, data ) 
{
    // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
    var pos = 0; // Maybe this streaming thing should be merged with the Stream?
    var readCode = function( size ) {
        var code = 0;
        for (var i = 0; i < size; i++) 
        {
            if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) 
            {
                code |= 1 << i;
            }
            pos++;
        }
        return code;
    };

    var output = [];

    var clearCode = 1 << minCodeSize;
    var eoiCode = clearCode + 1;

    var codeSize = minCodeSize + 1;

    var dict = [];

    var clear = function( ) {
        dict = [];
        codeSize = minCodeSize + 1;
        for (var i = 0; i < clearCode; i++) 
        {
            dict[i] = [i];
        }
        dict[clearCode] = [];
        dict[eoiCode] = null;
    };

    var code;
    var last;

    while( true ) 
    {
        last = code;
        code = readCode(codeSize);

        if (code === clearCode) 
        {
            clear();
            continue;
        }
        if (code === eoiCode) break;

        if (code < dict.length) 
        {
            if (last !== clearCode) 
            {
                dict.push(dict[last].concat(dict[code][0]));
            }
        }
        else 
        {
            if (code !== dict.length) throw new Error('Invalid LZW code.');
            dict.push(dict[last].concat(dict[last][0]));
        }
        output.push.apply(output, dict[code]);

        if (dict.length === (1 << codeSize) && codeSize < 12) 
        {
            // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
            codeSize++;
        }
    }

    // I don't know if this is technically an error, but some GIFs do it.
    //if (Math.ceil(pos / 8) !== data.length) throw new Error('Extraneous LZW bytes.');
    return output;
}

// Stream
/**
* @constructor
*/
// Make compiler happy.
function Stream( data ) 
{
    var self = this;
    self.data = data;
    self.len = self.data.length;
    self.pos = 0;

    self.readByte = function( ) {
        var self = this;
        if (self.pos >= self.data.length) 
        {
            throw new Error('Attempted to read past end of stream.');
        }
        if ( data instanceof Uint8Array ) return data[self.pos++];
        else return data.charCodeAt(self.pos++) & 0xFF;
    };

    self.readBytes = function( n ) {
        var self = this, bytes = [];
        for (var i = 0; i < n; i++) 
        {
            bytes.push( self.readByte() );
        }
        return bytes;
    };

    self.read = function( n ) {
        var self = this, s = '';
        for (var i = 0; i < n; i++) 
        {
            s += String.fromCharCode(self.readByte());
        }
        return s;
    };

    self.readUnsigned = function( ) { // Little-endian.
        var self = this, a = self.readBytes(2);
        return (a[1] << 8) + a[0];
    };
}

// The actual parsing; returns an object with properties.
function parseGIF( st, handler ) 
{
    handler || (handler = {});

    // LZW (GIF-specific)
    var parseCT = function( entries ) { // Each entry is 3 bytes, for RGB.
        var ct = [];
        for (var i = 0; i < entries; i++) 
        {
            ct.push(st.readBytes(3));
        }
        return ct;
    };

    var readSubBlocks = function( ) {
        var size, data;
        data = '';
        do {
            size = st.readByte();
            data += st.read(size);
        } while (size !== 0);
        return data;
    };

    var parseHeader = function( ) {
        var hdr = {};
        hdr.sig = st.read(3);
        hdr.ver = st.read(3);
        if (hdr.sig !== 'GIF') throw new Error('Not a GIF file.'); // XXX: This should probably be handled more nicely.
        hdr.width = st.readUnsigned();
        hdr.height = st.readUnsigned();

        var bits = byteToBitArr(st.readByte());
        hdr.gctFlag = bits.shift();
        hdr.colorRes = bitsToNum(bits.splice(0, 3));
        hdr.sorted = bits.shift();
        hdr.gctSize = bitsToNum(bits.splice(0, 3));

        hdr.bgColor = st.readByte();
        hdr.pixelAspectRatio = st.readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
        if (hdr.gctFlag) 
        {
            hdr.gct = parseCT(1 << (hdr.gctSize + 1));
        }
        handler.hdr && handler.hdr(hdr);
    };

    var parseExt = function( block ) {
        var parseGCExt = function( block ) {
            var blockSize = st.readByte(); // Always 4
            var bits = byteToBitArr(st.readByte());
            block.reserved = bits.splice(0, 3); // Reserved; should be 000.
            block.disposalMethod = bitsToNum(bits.splice(0, 3));
            block.userInput = bits.shift();
            block.transparencyGiven = bits.shift();
            block.delayTime = st.readUnsigned();
            block.transparencyIndex = st.readByte();
            block.terminator = st.readByte();
            handler.gce && handler.gce(block);
        };

        var parseComExt = function( block ) {
            block.comment = readSubBlocks();
            handler.com && handler.com(block);
        };

        var parsePTExt = function( block ) {
            // No one *ever* uses this. If you use it, deal with parsing it yourself.
            var blockSize = st.readByte(); // Always 12
            block.ptHeader = st.readBytes(12);
            block.ptData = readSubBlocks();
            handler.pte && handler.pte(block);
        };

        var parseAppExt = function( block ) {
            var parseNetscapeExt = function( block ) {
                var blockSize = st.readByte(); // Always 3
                block.unknown = st.readByte(); // ??? Always 1? What is this?
                block.iterations = st.readUnsigned();
                block.terminator = st.readByte();
                handler.app && handler.app.NETSCAPE && handler.app.NETSCAPE(block);
            };

            var parseUnknownAppExt = function( block ) {
                block.appData = readSubBlocks();
                // FIXME: This won't work if a handler wants to match on any identifier.
                handler.app && handler.app[block.identifier] && handler.app[block.identifier](block);
            };

            var blockSize = st.readByte(); // Always 11
            block.identifier = st.read(8);
            block.authCode = st.read(3);
            switch (block.identifier) 
            {
                case 'NETSCAPE':
                    parseNetscapeExt(block);
                    break;
                default:
                    parseUnknownAppExt(block);
                    break;
            }
        };

        var parseUnknownExt = function( block ) {
            block.data = readSubBlocks();
            handler.unknown && handler.unknown(block);
        };

        block.label = st.readByte();
        switch (block.label) 
        {
            case 0xF9:
                block.extType = 'gce';
                parseGCExt(block);
                break;
            case 0xFE:
                block.extType = 'com';
                parseComExt(block);
                break;
            case 0x01:
                block.extType = 'pte';
                parsePTExt(block);
                break;
            case 0xFF:
                block.extType = 'app';
                parseAppExt(block);
                break;
            default:
                block.extType = 'unknown';
                parseUnknownExt(block);
                break;
        }
    };

    var parseImg = function( img ) {
        var deinterlace = function( pixels, width ) {
            // Of course this defeats the purpose of interlacing. And it's *probably*
            // the least efficient way it's ever been implemented. But nevertheless...
            var newPixels = new Array(pixels.length);
            var rows = pixels.length / width;
            var cpRow = function (toRow, fromRow) {
                var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
                newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
            };

            // See appendix E.
            var offsets = [0, 4, 2, 1];
            var steps = [8, 8, 4, 2];

            var fromRow = 0;
            for (var pass = 0; pass < 4; pass++) 
            {
                for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) 
                {
                    cpRow(toRow, fromRow)
                    fromRow++;
                }
            }
            return newPixels;
        };

        img.leftPos = st.readUnsigned();
        img.topPos = st.readUnsigned();
        img.width = st.readUnsigned();
        img.height = st.readUnsigned();

        var bits = byteToBitArr(st.readByte());
        img.lctFlag = bits.shift();
        img.interlaced = bits.shift();
        img.sorted = bits.shift();
        img.reserved = bits.splice(0, 2);
        img.lctSize = bitsToNum(bits.splice(0, 3));

        if (img.lctFlag) 
        {
            img.lct = parseCT(1 << (img.lctSize + 1));
        }

        img.lzwMinCodeSize = st.readByte();

        var lzwData = readSubBlocks();

        img.pixels = lzwDecode(img.lzwMinCodeSize, lzwData);

        if (img.interlaced) 
        { 
            // Move
            img.pixels = deinterlace(img.pixels, img.width);
        }
        handler.img && handler.img(img);
    };

    var parseBlock = function( ) {
        var block = {};
        block.sentinel = st.readByte();

        // For ease of matching
        switch (String.fromCharCode(block.sentinel)) 
        { 
            case '!':
                block.type = 'ext';
                parseExt(block);
                break;
            case ',':
                block.type = 'img';
                parseImg(block);
                break;
            case ';':
                block.type = 'eof';
                handler.eof && handler.eof(block);
                break;
            default:
                throw new Error('Unknown block: 0x' + block.sentinel.toString(16)); // TODO: Pad this with a 0.
        }

        if (block.type !== 'eof') parseBlock( );
    };

    var parse = function( ) {
        parseHeader();
        parseBlock();
    };
    parse( );
};

FILTER.Codec.GIF = {

    encoder: FILTER.NotImplemented('GIF.encoder'),
    
    decoder: function ( buffer, metaData ) {
        var hdr, transparency = null,
            image = {width: 0, height: 0, data: null}
        ;
        // animated GIFs are not handled at this moment, needed??
        parseGIF(new Stream(new Uint8Array( buffer )), {
            hdr: function (_hdr) { hdr = _hdr; },
            gce: function (gce) { transparency = gce.transparencyGiven ? gce.transparencyIndex : null; },
            img: function (img) {
                //ct = color table, gct = global color table
                var ct = img.lctFlag ? img.lct : hdr.gct; // TODO: What if neither exists?
                var cdd = new FILTER.ImArray(img.width * img.height * 4);
                //apply color table colors
                img.pixels.forEach(function (pixel, i) {
                    // imgData.data === [R,G,B,A,R,G,B,A,...]
                    if (pixel !== transparency) 
                    {
                        cdd[(i << 2) + 0] = ct[pixel][0];
                        cdd[(i << 2) + 1] = ct[pixel][1];
                        cdd[(i << 2) + 2] = ct[pixel][2];
                        cdd[(i << 2) + 3] = 255; // Opaque.
                    }
                });
                image.width = img.width;
                image.height = img.height;
                image.data = cdd;
            }
        });
        return image;
    }
};
}(FILTER);/**
*
* Filter TGA Image Format CODEC
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var error = function( err ){ FILTER.error(err, true); };

// adapted from: Three.js
// adapted from: https://github.com/vthibault/roBrowser/blob/master/src/Loaders/Targa.js

// TGA Constants
var TGA_TYPE_NO_DATA = 0,
TGA_TYPE_INDEXED = 1,
TGA_TYPE_RGB = 2,
TGA_TYPE_GREY = 3,
TGA_TYPE_RLE_INDEXED = 9,
TGA_TYPE_RLE_RGB = 10,
TGA_TYPE_RLE_GREY = 11,

TGA_ORIGIN_MASK = 0x30,
TGA_ORIGIN_SHIFT = 0x04,
TGA_ORIGIN_BL = 0x00,
TGA_ORIGIN_BR = 0x01,
TGA_ORIGIN_UL = 0x02,
TGA_ORIGIN_UR = 0x03;

function tgaCheckHeader( header ) 
{
    switch( header.image_type ) 
    {
        // Check indexed type
        case TGA_TYPE_INDEXED:
        case TGA_TYPE_RLE_INDEXED:
            if ( header.colormap_length > 256 || header.colormap_size !== 24 || header.colormap_type !== 1) 
            {
                error('TGA.tgaCheckHeader: Invalid type colormap data for indexed type');
            }
            break;

        // Check colormap type
        case TGA_TYPE_RGB:
        case TGA_TYPE_GREY:
        case TGA_TYPE_RLE_RGB:
        case TGA_TYPE_RLE_GREY:
            if (header.colormap_type) 
            {
                error('TGA.tgaCheckHeader: Invalid type colormap data for colormap type');
            }
            break;

        // What the need of a file without data ?
        case TGA_TYPE_NO_DATA:
            error('TGA.tgaCheckHeader: No data');

        // Invalid type ?
        default:
            error('TGA.tgaCheckHeader: Invalid type " '+ header.image_type + '"');
    }

    // Check image width and height
    if ( header.width <= 0 || header.height <=0 ) 
    {
        error( 'TGA.tgaCheckHeader: Invalid image size' );
    }

    // Check image pixel size
    if (header.pixel_size !== 8  &&
    header.pixel_size !== 16 &&
    header.pixel_size !== 24 &&
    header.pixel_size !== 32) 
    {
        error('TGA.tgaCheckHeader: Invalid pixel size "' + header.pixel_size + '"');
    }
}

// Parse tga image buffer
function tgaParse( use_rle, use_pal, header, offset, data ) 
{
    var pixel_data,
    pixel_size,
    pixel_total,
    palettes;

    pixel_size = header.pixel_size >> 3;
    pixel_total = header.width * header.height * pixel_size;

    // Read palettes
    if ( use_pal ) 
    {
        palettes = data.subarray( offset, offset += header.colormap_length * ( header.colormap_size >> 3 ) );
    }

    // Read RLE
    if ( use_rle ) 
    {
        pixel_data = new Uint8Array(pixel_total);

        var c, count, i;
        var shift = 0;
        var pixels = new Uint8Array(pixel_size);

        while (shift < pixel_total) 
        {
            c     = data[offset++];
            count = (c & 0x7f) + 1;

            // RLE pixels.
            if (c & 0x80) 
            {
                // Bind pixel tmp array
                for (i = 0; i < pixel_size; ++i) 
                {
                    pixels[i] = data[offset++];
                }

                // Copy pixel array
                for (i = 0; i < count; ++i) 
                {
                    pixel_data.set(pixels, shift + i * pixel_size);
                }

                shift += pixel_size * count;
            } 
            else 
            {
                // Raw pixels.
                count *= pixel_size;
                for (i = 0; i < count; ++i) 
                {
                    pixel_data[shift + i] = data[offset++];
                }
                shift += count;
            }
        }
    } 
    else 
    {
        // RAW Pixels
        pixel_data = data.subarray(
            offset, offset += (use_pal ? header.width * header.height : pixel_total)
        );
    }

    return {
        pixel_data: pixel_data,
        palettes: palettes
    };
}

function tgaGetImageData8bits( header, imageData, y_start, y_step, y_end, x_start, x_step, x_end, image, palettes ) 
{
    var colormap = palettes;
    var color, i = 0, x, y;
    var width = header.width;

    for (y = y_start; y !== y_end; y += y_step) 
    {
        for (x = x_start; x !== x_end; x += x_step, i++) 
        {
            color = image[i];
            imageData[(x + width * y) * 4 + 3] = 255;
            imageData[(x + width * y) * 4 + 2] = colormap[(color * 3) + 0];
            imageData[(x + width * y) * 4 + 1] = colormap[(color * 3) + 1];
            imageData[(x + width * y) * 4 + 0] = colormap[(color * 3) + 2];
        }
    }
    return imageData;
}

function tgaGetImageData16bits( header, imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) 
{
    var color, i = 0, x, y;
    var width = header.width;

    for (y = y_start; y !== y_end; y += y_step) 
    {
        for (x = x_start; x !== x_end; x += x_step, i += 2) 
        {
            color = image[i + 0] + (image[i + 1] << 8); // Inversed ?
            imageData[(x + width * y) * 4 + 0] = (color & 0x7C00) >> 7;
            imageData[(x + width * y) * 4 + 1] = (color & 0x03E0) >> 2;
            imageData[(x + width * y) * 4 + 2] = (color & 0x001F) >> 3;
            imageData[(x + width * y) * 4 + 3] = (color & 0x8000) ? 0 : 255;
        }
    }
    return imageData;
}

function tgaGetImageData24bits( header, imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) 
{
    var i = 0, x, y;
    var width = header.width;

    for (y = y_start; y !== y_end; y += y_step) 
    {
        for (x = x_start; x !== x_end; x += x_step, i += 3) 
        {
            imageData[(x + width * y) * 4 + 3] = 255;
            imageData[(x + width * y) * 4 + 2] = image[i + 0];
            imageData[(x + width * y) * 4 + 1] = image[i + 1];
            imageData[(x + width * y) * 4 + 0] = image[i + 2];
        }
    }
    return imageData;
}

function tgaGetImageData32bits( header, imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) 
{
    var i = 0, x, y;
    var width = header.width;

    for (y = y_start; y !== y_end; y += y_step) 
    {
        for (x = x_start; x !== x_end; x += x_step, i += 4) 
        {
            imageData[(x + width * y) * 4 + 2] = image[i + 0];
            imageData[(x + width * y) * 4 + 1] = image[i + 1];
            imageData[(x + width * y) * 4 + 0] = image[i + 2];
            imageData[(x + width * y) * 4 + 3] = image[i + 3];
        }
    }
    return imageData;
}

function tgaGetImageDataGrey8bits( header, imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) 
{
    var color, i = 0, x, y;
    var width = header.width;

    for (y = y_start; y !== y_end; y += y_step) 
    {
        for (x = x_start; x !== x_end; x += x_step, i++) 
        {
            color = image[i];
            imageData[(x + width * y) * 4 + 0] = color;
            imageData[(x + width * y) * 4 + 1] = color;
            imageData[(x + width * y) * 4 + 2] = color;
            imageData[(x + width * y) * 4 + 3] = 255;
        }
    }
    return imageData;
}

function tgaGetImageDataGrey16bits( header, imageData, y_start, y_step, y_end, x_start, x_step, x_end, image ) 
{
    var i = 0, x, y;
    var width = header.width;

    for (y = y_start; y !== y_end; y += y_step) 
    {
        for (x = x_start; x !== x_end; x += x_step, i += 2) 
        {
            imageData[(x + width * y) * 4 + 0] = image[i + 0];
            imageData[(x + width * y) * 4 + 1] = image[i + 0];
            imageData[(x + width * y) * 4 + 2] = image[i + 0];
            imageData[(x + width * y) * 4 + 3] = image[i + 1];
        }
    }
    return imageData;
}

function getTgaRGBA( header, width, height, image, palette, use_grey ) 
{
    var x_start,
    y_start,
    x_step,
    y_step,
    x_end,
    y_end,
    data = new Uint8Array(width * height * 4);

    switch( (header.flags & TGA_ORIGIN_MASK) >> TGA_ORIGIN_SHIFT ) 
    {
        default:
        case TGA_ORIGIN_UL:
            x_start = 0;
            x_step = 1;
            x_end = width;
            y_start = 0;
            y_step = 1;
            y_end = height;
            break;

        case TGA_ORIGIN_BL:
            x_start = 0;
            x_step = 1;
            x_end = width;
            y_start = height - 1;
            y_step = -1;
            y_end = -1;
            break;

        case TGA_ORIGIN_UR:
            x_start = width - 1;
            x_step = -1;
            x_end = -1;
            y_start = 0;
            y_step = 1;
            y_end = height;
            break;

        case TGA_ORIGIN_BR:
            x_start = width - 1;
            x_step = -1;
            x_end = -1;
            y_start = height - 1;
            y_step = -1;
            y_end = -1;
            break;
    }

    if ( use_grey ) 
    {
        switch( header.pixel_size ) 
        {
            case 8:
                tgaGetImageDataGrey8bits( header, data, y_start, y_step, y_end, x_start, x_step, x_end, image );
                break;
            case 16:
                tgaGetImageDataGrey16bits( header, data, y_start, y_step, y_end, x_start, x_step, x_end, image );
                break;
            default:
                error( 'TGA.getTgaRGBA: not support this format' );
                break;
        }
    } 
    else 
    {
        switch( header.pixel_size ) 
        {
            case 8:
                tgaGetImageData8bits( header, data, y_start, y_step, y_end, x_start, x_step, x_end, image, palette );
                break;

            case 16:
                tgaGetImageData16bits( header, data, y_start, y_step, y_end, x_start, x_step, x_end, image );
                break;

            case 24:
                tgaGetImageData24bits( header, data, y_start, y_step, y_end, x_start, x_step, x_end, image );
                break;

            case 32:
                tgaGetImageData32bits( header, data, y_start, y_step, y_end, x_start, x_step, x_end, image );
                break;

            default:
                error( 'TGA.getTgaRGBA: not support this format' );
                break;
        }
    }

    // Load image data according to specific method
    // var func = 'tgaGetImageData' + (use_grey ? 'Grey' : '') + (header.pixel_size) + 'bits';
    // func(data, y_start, y_step, y_end, x_start, x_step, x_end, width, image, palette );
    return data;
}

FILTER.Codec.TGA = {

    encoder: FILTER.NotImplemented('TGA.encoder'),
    
    decoder: function ( buffer, metaData ) {

        if ( buffer.length < 19 ) error( 'TGA: Not enough data to contain header.' );

        var content = new Uint8Array( buffer ),
            offset = 0,
            header = {
                id_length:       content[ offset ++ ],
                colormap_type:   content[ offset ++ ],
                image_type:      content[ offset ++ ],
                colormap_index:  content[ offset ++ ] | content[ offset ++ ] << 8,
                colormap_length: content[ offset ++ ] | content[ offset ++ ] << 8,
                colormap_size:   content[ offset ++ ],

                origin: [
                    content[ offset ++ ] | content[ offset ++ ] << 8,
                    content[ offset ++ ] | content[ offset ++ ] << 8
                ],
                width:      content[ offset ++ ] | content[ offset ++ ] << 8,
                height:     content[ offset ++ ] | content[ offset ++ ] << 8,
                pixel_size: content[ offset ++ ],
                flags:      content[ offset ++ ]
            };

        // Check tga if it is valid format
        tgaCheckHeader( header );

        if ( header.id_length + offset > buffer.length ) error('TGA: No data');

        // Skip the needn't data
        offset += header.id_length;

        // Get targa information about RLE compression and palette
        var use_rle = false,
            use_pal = false,
            use_grey = false;

        switch ( header.image_type ) 
        {
            case TGA_TYPE_RLE_INDEXED:
                use_rle = true;
                use_pal = true;
                break;

            case TGA_TYPE_INDEXED:
                use_pal = true;
                break;

            case TGA_TYPE_RLE_RGB:
                use_rle = true;
                break;

            case TGA_TYPE_RGB:
                break;

            case TGA_TYPE_RLE_GREY:
                use_rle = true;
                use_grey = true;
                break;

            case TGA_TYPE_GREY:
                use_grey = true;
                break;
        }

        var result = tgaParse( use_rle, use_pal, header, offset, content );
        var rgbaData = getTgaRGBA( header, header.width, header.height, result.pixel_data, result.palettes, use_grey );

        return {
            width: header.width,
            height: header.height,
            data: rgbaData
        };
    }
};

}(FILTER);/**
*
* Filter RGBE/HDR Image Format CODEC
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var error = function( err ){ FILTER.error(err, true); };
// adapted from: http://www.graphics.cornell.edu/~bjw/rgbe.html
// http://en.wikipedia.org/wiki/RGBE_image_format
var
HAS = 'hasOwnproperty', APPEND = Array.prototype.push, TOARRAY = Array.prototype.slice,
/* return codes for rgbe routines */
RGBE_RETURN_SUCCESS =  0,
RGBE_RETURN_FAILURE = -1,

/* default error routine.  change this to change error handling */
rgbe_read_error     = 1,
rgbe_write_error    = 2,
rgbe_format_error   = 3,
rgbe_memory_error   = 4,
rgbe_error = function(rgbe_error_code, msg) {
    switch (rgbe_error_code) 
    {
        case rgbe_read_error: 
            error("RGBE Read Error: " + (msg||''));
            break;
        case rgbe_write_error: 
            error("RGBE Write Error: " + (msg||''));
            break;
        case rgbe_format_error:  
            error("RGBE Bad File Format: " + (msg||''));
            break;
        case rgbe_memory_error:  
        default:
            error("RGBE: Error: " + (msg||''));
    }
    return RGBE_RETURN_FAILURE;
},

/* offsets to red, green, and blue components in a data (float) pixel */
RGBE_DATA_RED      = 0,
RGBE_DATA_GREEN    = 1,
RGBE_DATA_BLUE     = 2,

/* number of floats per pixel, use 4 since stored in rgba image format */
RGBE_DATA_SIZE     = 4,

/* flags indicating which fields in an rgbe_header_info are valid */
RGBE_VALID_PROGRAMTYPE      = 1,
RGBE_VALID_FORMAT           = 2,
RGBE_VALID_DIMENSIONS       = 4,

NEWLINE = "\n",

fgets = function( buffer, lineLimit, consume ) {
    lineLimit = !lineLimit ? 1024 : lineLimit;
    var p = buffer.pos,
        i = -1, len = 0, s = '', chunkSize = 128,
        chunk = String.fromCharCode.apply(null, new Uint16Array( buffer.subarray( p, p+chunkSize ) ) )
    ;
    while ( (0 > (i=chunk.indexOf( NEWLINE ))) && (len < lineLimit) && (p < buffer.byteLength) ) 
    {
        s += chunk; len += chunk.length;
        p += chunkSize;
        chunk += String.fromCharCode.apply(null, new Uint16Array( buffer.subarray( p, p+chunkSize ) ) );
    }

    if ( -1 < i ) 
    {
        /*for (i=l-1; i>=0; i--) {
            byteCode = m.charCodeAt(i);
            if (byteCode > 0x7f && byteCode <= 0x7ff) byteLen++;
            else if (byteCode > 0x7ff && byteCode <= 0xffff) byteLen += 2;
            if (byteCode >= 0xDC00 && byteCode <= 0xDFFF) i--; //trail surrogate
        }*/
        if ( false !== consume ) buffer.pos += len+i+1;
        return s + chunk.slice(0, i);

    }
    return false;
},

fputs = function( buffer, s ) {
    var i, l = s.length, c, b2
        b = new Uint16Array( l ); // 2 bytes for each char
    for (i=0; i<l; i++) 
    {
        // char >>> 8, char & 0xFF
        c = s.charCodeAt( i );
        b[ i ] = c;
    }
    APPEND.apply(buffer, TOARRAY.call(new Uint8Array(b)));
},

fputb = function( buffer, b ) {
    APPEND.apply(buffer, TOARRAY.call(b));
},

// regexes to parse header info fields
magic_token_re = /^#\?(\S+)$/,
gamma_re = /^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,
exposure_re = /^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,
format_re = /^\s*FORMAT=(\S+)\s*$/,
dimensions_re = /^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,

/* minimal header reading.  modify if you want to parse more information */
RGBE_ReadHeader = function( buffer ) {
    var line, match,

        // RGBE format header struct
        header = {

          valid: 0,                         /* indicate which fields are valid */

          string: '',                       /* the actual header string */

          comments: '',                     /* comments found in header */

          programtype: 'RGBE',              /* listed at beginning of file to identify it
                                            * after "#?".  defaults to "RGBE" */

          format: '',                       /* RGBE format, default 32-bit_rle_rgbe */

          gamma: 1.0,                       /* image has already been gamma corrected with
                                            * given gamma.  defaults to 1.0 (no correction) */

          exposure: 1.0,                    /* a value of 1.0 in an image corresponds to
                                            * <exposure> watts/steradian/m^2.
                                            * defaults to 1.0 */

          width: 0, height: 0               /* image dimensions, width/height */

        }
    ;

    if ( buffer.pos >= buffer.byteLength || !( line=fgets( buffer ) ) ) 
    {
        return rgbe_error( rgbe_read_error, "no header found" );
    }
    
    /* if you want to require the magic token then uncomment the next line */
    if ( !(match=line.match(magic_token_re)) ) 
    {
        return rgbe_error( rgbe_format_error, "bad initial token" );
    }
    header.valid |= RGBE_VALID_PROGRAMTYPE;
    header.programtype = match[1];
    header.string += line + "\n";

    while ( true ) 
    {
        line = fgets( buffer );
        if ( false === line ) break;
        header.string += line + "\n";

        if ( '#' === line.charAt(0) ) 
        {
            header.comments += line + "\n";
            continue; // comment line
        }

        if ( match=line.match(gamma_re) ) 
        {
            header.gamma = parseFloat(match[1], 10);
        }
        if ( match=line.match(exposure_re) ) 
        {
            header.exposure = parseFloat(match[1], 10);
        }
        if ( match=line.match(format_re) ) 
        {
            header.valid |= RGBE_VALID_FORMAT;
            header.format = match[1];//'32-bit_rle_rgbe';
        }
        if ( match=line.match(dimensions_re) ) 
        {
            header.valid |= RGBE_VALID_DIMENSIONS;
            header.height = parseInt(match[1], 10);
            header.width = parseInt(match[2], 10);
        }

        if ( (header.valid&RGBE_VALID_FORMAT) && (header.valid&RGBE_VALID_DIMENSIONS) ) break;
    }

    if ( !(header.valid&RGBE_VALID_FORMAT) ) 
    {
        return rgbe_error( rgbe_format_error, "missing format specifier" );
    }
    if ( !(header.valid&RGBE_VALID_DIMENSIONS) ) 
    {
        return rgbe_error( rgbe_format_error, "missing image size specifier" );
    }
    return header;
},

/* default minimal header. modify if you want more information in header */
RGBE_WriteHeader = function( buffer, width, height, header ) {
    var programtype = "RGBE";
    header = header || { };
    
    if ( header[HAS]('programtype') ) programtype = header.programtype;
    
    fputs( buffer, "#?"+programtype+"\n" );
    
    if ( header[HAS]('gamma') ) 
        fputs( buffer, "GAMMA="+header.gamma+"\n" );
    
    if ( header[HAS]('exposure') ) 
        fputs( buffer, "EXPOSURE="+header.exposure+"\n" );
    
    fputs( buffer, "FORMAT=32-bit_rle_rgbe\n\n" );
    
    fputs( buffer, "-Y "+(~~height)+" +X "+(~~width)+"\n" );
},

RGBE_ReadPixels_RLE = function( buffer, w, h ) {
    var data_rgba, offset, pos, count, byteValue,
        scanline_buffer, ptr, ptr_end, i, l, off, isEncodedRun,
        scanline_width = w, num_scanlines = h, rgbeStart
    ;

    if (
        // run length encoding is not allowed so read flat
        ((scanline_width < 8) || (scanline_width > 0x7fff)) ||
        // this file is not run length encoded
        ((2 !== buffer[0]) || (2 !== buffer[1]) || (buffer[2] & 0x80))
    ) 
    {
        // return the flat buffer
        return new Uint8Array( buffer );
    }

    if ( scanline_width !== ((buffer[2]<<8) | buffer[3]) ) 
    {
        return rgbe_error(rgbe_format_error, "wrong scanline width");
    }

    data_rgba = new Uint8Array( 4*w*h );

    if ( !data_rgba || !data_rgba.length ) 
    {
        return rgbe_error(rgbe_memory_error, "unable to allocate buffer space");
    }

    offset = 0; pos = 0; ptr_end = 4*scanline_width;
    rgbeStart = new Uint8Array( 4 );
    scanline_buffer = new Uint8Array( ptr_end );

    // read in each successive scanline
    while( (num_scanlines > 0) && (pos < buffer.byteLength) ) 
    {
        if ( pos+4 > buffer.byteLength ) 
        {
            return rgbe_error( rgbe_read_error );
        }

        rgbeStart[0] = buffer[pos++];
        rgbeStart[1] = buffer[pos++];
        rgbeStart[2] = buffer[pos++];
        rgbeStart[3] = buffer[pos++];

        if ( (2 != rgbeStart[0]) || (2 != rgbeStart[1]) || (((rgbeStart[2]<<8) | rgbeStart[3]) != scanline_width) ) 
        {
            return rgbe_error(rgbe_format_error, "bad rgbe scanline format");
        }

        // read each of the four channels for the scanline into the buffer
        // first red, then green, then blue, then exponent
        ptr = 0;
        while ( (ptr < ptr_end) && (pos < buffer.byteLength) ) 
        {
            count = buffer[ pos++ ];
            isEncodedRun = count > 128;
            if ( isEncodedRun ) count -= 128;

            if ( (0 === count) || (ptr+count > ptr_end) ) 
            {
                return rgbe_error(rgbe_format_error, "bad scanline data");
            }

            if ( isEncodedRun ) 
            {
                // a (encoded) run of the same value
                byteValue = buffer[ pos++ ];
                for (i=0; i<count; i++) 
                {
                    scanline_buffer[ ptr++ ] = byteValue;
                }
                //ptr += count;

            } 
            else 
            {
                // a literal-run
                scanline_buffer.set( buffer.subarray(pos, pos+count), ptr );
                ptr += count; pos += count;
            }
        }


        // now convert data from buffer into rgba
        // first red, then green, then blue, then exponent (alpha)
        l = scanline_width; //scanline_buffer.byteLength;
        for (i=0; i<l; i++) 
        {
            off = 0;
            data_rgba[offset] = scanline_buffer[i+off];
            off += scanline_width; //1;
            data_rgba[offset+1] = scanline_buffer[i+off];
            off += scanline_width; //1;
            data_rgba[offset+2] = scanline_buffer[i+off];
            off += scanline_width; //1;
            data_rgba[offset+3] = scanline_buffer[i+off];
            offset += 4;
        }
        num_scanlines--;
    }
    return data_rgba;
},

RGBE_WriteBytes_RLE = function( buffer, data, numbytes ) {
    var MINRUNLENGTH = 4;
    var cur, beg_run, run_count, old_run_count, nonrun_count;
    var buf = new Uint8Array(2);

    cur = 0;
    while( cur < numbytes ) 
    {
        beg_run = cur;
        /* find next run of length at least 4 if one exists */
        run_count = old_run_count = 0;
        while( (run_count < MINRUNLENGTH) && (beg_run < numbytes) ) 
        {
            beg_run += run_count;
            old_run_count = run_count;
            run_count = 1;
            while( (beg_run + run_count < numbytes) && (run_count < 127)
            && (data[beg_run] == data[beg_run + run_count]) )
                run_count++;
        }
        /* if data before next big run is a short run then write it as such */
        if ( (old_run_count > 1)&&(old_run_count == beg_run - cur) ) 
        {
            buf[0] = 128 + old_run_count;   /*write short run*/
            buf[1] = data[cur];
            
            fputb( buffer, buf );
            cur = beg_run;
        }
        /* write out bytes until we reach the start of the next run */
        while ( cur < beg_run ) 
        {
            nonrun_count = beg_run - cur;
            if ( nonrun_count > 128 ) nonrun_count = 128;
            buf[0] = nonrun_count;
            fputb( buffer, buf );
            fputb( buffer, data.subarray(cur, nonrun_count) );
            cur += nonrun_count;
        }
        /* write out next run if one was found */
        if ( run_count >= MINRUNLENGTH ) 
        {
            buf[0] = 128 + run_count;
            buf[1] = data[beg_run];
            fputb( buffer, buf );
            cur += run_count;
        }
    }
},
RGBE_WritePixels = function( buffer, data, numpixels ) {
    var rgbe = new Uint8Array(4);

    while ( numpixels-- > 0 ) 
    {
        rgbe[0] = 
        float2rgbe(rgbe,data[RGBE_DATA_RED],
        data[RGBE_DATA_GREEN],data[RGBE_DATA_BLUE]);
        data += RGBE_DATA_SIZE;
        fputb( buffer, rgbe );
    }
    return buffer;
},
RGBE_WritePixels_RLE = function( buffer, data, scanline_width, num_scanlines ) {
    var rgbe = new Uint8Array(4), buf, i, err, pos;

    if ( (scanline_width < 8)||(scanline_width > 0x7fff) )
    {
        /* run length encoding is not allowed so write flat*/
        //return RGBE_WritePixels( buffer,data,scanline_width*num_scanlines );
        fputb( buffer, data );
        return;
    }
    
    buf = new Uint8Array( scanline_width*4 );
    pos = 0;
    while(num_scanlines-- > 0) 
    {
        rgbe[0] = 2;
        rgbe[1] = 2;
        rgbe[2] = scanline_width >> 8;
        rgbe[3] = scanline_width & 0xFF;
        fputb( buffer, rgbe );
        
        for(i=0;i<scanline_width;i++) 
        {
            rgbe[0] = data[datapos + 0];
            rgbe[1] = data[datapos + 1];
            rgbe[2] = data[datapos + 2];
            rgbe[3] = data[datapos + 3];
            buf[i] = rgbe[0];
            buf[i+scanline_width] = rgbe[1];
            buf[i+2*scanline_width] = rgbe[2];
            buf[i+3*scanline_width] = rgbe[3];
            pos += RGBE_DATA_SIZE;
        }
        /* write out each of the four channels separately run length encoded */
        /* first red, then green, then blue, then exponent */
        for(i=0;i<4;i++) 
        {
            RGBE_WriteBytes_RLE( buffer, buf[i*scanline_width], scanline_width )
        }
    }
}
;

FILTER.Codec.HDR = FILTER.Codec.RGBE = {

    encoder: function( imgData, metaData ) {
        metaData = metaData || {};
        var buffer = [ ];
        RGBE_WriteHeader( buffer, imgData.width, imgData.height, metaData );
        RGBE_WritePixels_RLE( buffer, imgData.data, metaData.scanline_width||0, metaData.num_scanlines||0 );
        return new Buffer( new Uint8Array( buffer ) );
    },
    
    decoder: function( buffer, metaData ) {
        var byteArray = new Uint8Array( buffer ),
            byteLength = byteArray.byteLength;
        byteArray.pos = 0;
        var rgbe_header_info = RGBE_ReadHeader( byteArray );

        if ( RGBE_RETURN_FAILURE !== rgbe_header_info ) 
        {
            var w = rgbe_header_info.width,
                h = rgbe_header_info.height
                ,image_rgba_data = RGBE_ReadPixels_RLE( byteArray.subarray(byteArray.pos), w, h )
            ;
            if ( RGBE_RETURN_FAILURE !== image_rgba_data ) 
            {
                if ( metaData ) 
                {
                    metaData.header = rgbe_header_info.string;
                    metaData.gamma = rgbe_header_info.gamma;
                    metaData.exposure = rgbe_header_info.exposure;
                }
                
                return {
                    width: w, 
                    height: h,
                    data: image_rgba_data
                };
            }
        }
        return null;
    }
};
}(FILTER);
/* main code ends here */
/* export the module */
return FILTER;
});
/**
*
*   FILTER.js Generic Filters
*   @version: 0.9.5
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Generic Filters)
*   https://github.com/foo123/FILTER.js
*
**/!function( root, factory ){
"use strict";
if ( ('object'===typeof module) && module.exports ) /* CommonJS */
    module.exports = factory.call(root,(module.$deps && module.$deps["FILTER"]) || require("./FILTER".toLowerCase()));
else if ( ("function"===typeof define) && define.amd && ("function"===typeof require) && ("function"===typeof require.specified) && require.specified("FILTER_FILTERS") /*&& !require.defined("FILTER_FILTERS")*/ ) 
    define("FILTER_FILTERS",['module',"FILTER"],function(mod,module){factory.moduleUri = mod.uri; factory.call(root,module); return module;});
else /* Browser/WebWorker/.. */
    (factory.call(root,root["FILTER"])||1)&&('function'===typeof define)&&define.amd&&define(function(){return root["FILTER"];} );
}(  /* current root */          this, 
    /* module factory */        function ModuleFactory__FILTER_FILTERS( FILTER ){
/* main code starts here */

/**
*
*   FILTER.js Generic Filters
*   @version: 0.9.5
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Generic Filters)
*   https://github.com/foo123/FILTER.js
*
**/
"use strict";
var FILTER_FILTERS_PATH = FILTER.getPath( ModuleFactory__FILTER_FILTERS.moduleUri );
/**
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
// Composite Filter Stack  (a variation of Composite Design Pattern)
var CompositeFilter = FILTER.CompositeFilter = FILTER.Class( FILTER.Filter, {
    name: "CompositeFilter"
    
    ,constructor: function( filters ) { 
        var self = this;
        self.$super('constructor');
        self._stack = ( filters && filters.length ) ? filters.slice( ) : [ ];
    }
    
    ,path: FILTER_FILTERS_PATH
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
        var self = this/*, cache = {}*/, update = false;
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
                    im = filter._apply(im, w, h, image/*, cache*/);
                    update = update || filter._update;
                    if ( filter.hasMeta ) self._meta.push([fi, filter.getMeta()]);
                }
            }
        }
        self._update = update;
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
* Inline Filter(s)
*
* Allows to create an filter on-the-fly using an inline function
*
* @param handler Optional (the filter apply routine)
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var HAS = 'hasOwnProperty';

//
//  Inline Filter 
//  used as a placeholder for constructing filters inline with an anonymous function
var InlineFilter = FILTER.InlineFilter = FILTER.CustomFilter = FILTER.Class( FILTER.Filter, {
    name: "InlineFilter"
    
    ,constructor: function( handler ) {
        var self = this;
        self.$super('constructor');
        // using bind makes the code become [native code] and thus unserializable
        self._handler = handler && ('function' === typeof handler) ? handler : null;
        self._params = {};
    }
    
    ,path: FILTER_FILTERS_PATH
    ,_handler: null
    ,_params: null
    
    ,dispose: function( ) {
        var self = this;
        self.$super('dispose');
        self._handler = null;
        self._params = null;
        return self;
    }
    
    ,params: function( params ) {
        var self = this;
        if ( arguments.length )
        {
            for (var p in params)
            {
                if ( params[HAS](p) ) self._params[p] = params[p];
            }
            return self;
        }
        return self._params;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _handler: self._handler ? self._handler.toString( ) : null
                ,_params: self._params
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
                // make FILTER namespace accessible to the function code
                self._handler = new Function( "FILTER", '"use strict"; return ' + params._handler + ';')( FILTER );
            }
            self._params = params._params || {};
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

var Sin = Math.sin, Cos = Math.cos,
    // Color Matrix
    CM = FILTER.Array32F, TypedArray = FILTER.TypedArray,
    toRad = FILTER.CONST.toRad, toDeg = FILTER.CONST.toDeg,
    notSupportClamp = FILTER._notSupportClamp
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
        
        /*if ( FILTER.useWebGL )
        {
            self._webglInstance = FILTER.WebGLColorMatrixFilterInstance || null;
        }*/
    }
    
    ,path: FILTER_FILTERS_PATH
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
            
            self._matrix = TypedArray( params._matrix, CM );
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
                return this.set([
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
        var L = FILTER.LUMA;
        return this.set([
            L[0], L[1], L[2], 0, 0, 
            L[0], L[1], L[2], 0, 0, 
            L[0], L[1], L[2], 0, 0, 
            0, 0, 0, 1, 0
        ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,colorize: function( rgb, amount ) {
        var r, g, b, inv_amount, L = FILTER.LUMA;
        if ( amount === undef ) amount = 1;
        r = (((rgb >> 16) & 255) * 0.0039215686274509803921568627451);  // / 255
        g = (((rgb >> 8) & 255) * 0.0039215686274509803921568627451);  // / 255
        b = ((rgb & 255) * 0.0039215686274509803921568627451);  // / 255
        inv_amount = 1 - amount;
        return this.set([
            (inv_amount + ((amount * r) * L[0])), ((amount * r) * L[1]), ((amount * r) * L[2]), 0, 0, 
            ((amount * g) * L[0]), (inv_amount + ((amount * g) * L[1])), ((amount * g) * L[2]), 0, 0, 
            ((amount * b) * L[0]), ((amount * b) * L[1]), (inv_amount + ((amount * b) * L[2])), 0, 0, 
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
        var sInv, irlum, iglum, iblum, L = FILTER.LUMA;
        sInv = 1 - s;  irlum = sInv * L[0];
        iglum = sInv * L[1];  iblum = sInv * L[2];
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
        var cos = Cos(degrees), sin = Sin(degrees), L = FILTER.LUMA;
        return this.set([
            ((L[0] + (cos * (1 - L[0]))) + (sin * -(L[0]))), ((L[1] + (cos * -(L[1]))) + (sin * -(L[1]))), ((L[2] + (cos * -(L[2]))) + (sin * (1 - L[2]))), 0, 0, 
            ((L[0] + (cos * -(L[0]))) + (sin * 0.143)), ((L[1] + (cos * (1 - L[1]))) + (sin * 0.14)), ((L[2] + (cos * -(L[2]))) + (sin * -0.283)), 0, 0, 
            ((L[0] + (cos * -(L[0]))) + (sin * -((1 - L[0])))), ((L[1] + (cos * -(L[1]))) + (sin * L[1])), ((L[2] + (cos * (1 - L[2]))) + (sin * L[2])), 0, 0, 
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
        var L = FILTER.LUMA;
        return this.set([
            L[0], L[1], L[2], 0, 40, 
            L[0], L[1], L[2], 0, 20, 
            L[0], L[1], L[2], 0, -amount, 
            0, 0, 0, 1, 0
        ]);
    }
    
    // adapted from http://gskinner.com/blog/archives/2007/12/colormatrix_cla.html
    ,threshold: function( threshold, factor ) {
        if ( factor === undef )  factor = 256;
        var L = FILTER.LUMA;
        return this.set([
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
            L[0] * factor, L[1] * factor, L[2] * factor, 0, (-(factor-1) * threshold), 
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
        this._matrix = this._matrix ? CMconcat(this._matrix, new CM(mat)) : new CM(mat);
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
    ,_apply: notSupportClamp
    ? function(p, w, h/*, image*/) {
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
                
                p[i   ] = ~~p0;  p[i+1 ] = ~~p1;  p[i+2 ] = ~~p2;  p[i+3 ] = ~~p3;
                p[i+4 ] = ~~p4;  p[i+5 ] = ~~p5;  p[i+6 ] = ~~p6;  p[i+7 ] = ~~p7;
                p[i+8 ] = ~~p8;  p[i+9 ] = ~~p9;  p[i+10] = ~~p10; p[i+11] = ~~p11;
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
    }
    : function(p, w, h/*, image*/) {
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
                
                p[i   ] = ~~p0;  p[i+1 ] = ~~p1;  p[i+2 ] = ~~p2;  p[i+3 ] = ~~p3;
                p[i+4 ] = ~~p4;  p[i+5 ] = ~~p5;  p[i+6 ] = ~~p6;  p[i+7 ] = ~~p7;
                p[i+8 ] = ~~p8;  p[i+9 ] = ~~p9;  p[i+10] = ~~p10; p[i+11] = ~~p11;
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
    var m=new CM(20);
    
    // unroll the loop completely
    m[ 0 ] = m1[0] + amount * (m2[0]-m1[0]);
    m[ 1 ] = m1[1] + amount * (m2[1]-m1[1]);
    m[ 2 ] = m1[2] + amount * (m2[2]-m1[2]);
    m[ 3 ] = m1[3] + amount * (m2[3]-m1[3]);
    m[ 4 ] = m1[4] + amount * (m2[4]-m1[4]);

    m[ 5 ] = m1[5] + amount * (m2[5]-m1[5]);
    m[ 6 ] = m1[6] + amount * (m2[6]-m1[6]);
    m[ 7 ] = m1[7] + amount * (m2[7]-m1[7]);
    m[ 8 ] = m1[8] + amount * (m2[8]-m1[0]);
    m[ 9 ] = m1[9] + amount * (m2[9]-m1[9]);
    
    m[ 10 ] = m1[10] + amount * (m2[10]-m1[10]);
    m[ 11 ] = m1[11] + amount * (m2[11]-m1[11]);
    m[ 12 ] = m1[12] + amount * (m2[12]-m1[12]);
    m[ 13 ] = m1[13] + amount * (m2[13]-m1[13]);
    m[ 14 ] = m1[14] + amount * (m2[14]-m1[14]);
    
    m[ 15 ] = m1[15] + amount * (m2[15]-m1[15]);
    m[ 16 ] = m1[16] + amount * (m2[16]-m1[16]);
    m[ 17 ] = m1[17] + amount * (m2[17]-m1[17]);
    m[ 18 ] = m1[18] + amount * (m2[18]-m1[18]);
    m[ 19 ] = m1[19] + amount * (m2[19]-m1[19]);
    
    //while (i < 20) { m[i] = (inv_amount * m1[i]) + (amount * m2[i]);  i++; };
    
    return m;
}

ColorMatrixFilter.multiply = CMconcat;
ColorMatrixFilter.blend = CMblend;
ColorMatrixFilter.eye = eye;

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
var CT = FILTER.ImArrayCopy, clamp = FILTER.Color.clampPixel,
    TypedArray = FILTER.TypedArray,
    eye = function( ) {
        var t=new CT(256), i;
        for(i=0; i<256; i++) t[i]=i;
        return t;
    },

    inv_eye = function( ) {
        var t=new CT(256), i;
        for(i=0; i<256; i++) t[i]=255-i;
        return t;
    },

    val = function(col) {
        var t=new CT(256), i;
        for(i=0; i<256; i++) t[i]=col;
        return t;
    },
    
    clone = function(t) {
        if (t) return new CT(t);
        return null;
    },
    
    Power = Math.pow, Exponential = Math.exp, nF = 1.0/255
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
    
    ,path: FILTER_FILTERS_PATH
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
            
            self._tableR = TypedArray(params._tableR, CT);
            self._tableG = TypedArray(params._tableG, CT);
            self._tableB = TypedArray(params._tableB, CT);
            self._tableA = TypedArray(params._tableA, CT);
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

        for(i=0; i<256; i++)
        { 
            // the non-linear mapping is here
            j=0; while (j<tLR && i>thresholdsR[j]) j++;
            tR[ i ] = clamp(qR[ j ]); 
            j=0; while (j<tLG && i>thresholdsG[j]) j++;
            tG[ i ] = clamp(qG[ j ]); 
            j=0; while (j<tLB && i>thresholdsB[j]) j++;
            tB[ i ] = clamp(qB[ j ]); 
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
        for(i=0; i<256; i++) { t[i] = clamp(q[ ~~(nR * i) ]); }
        return this.set(t);
    }
    
    ,binarize: function( ) {
        return this.quantize(2);
    }
    
    ,channel: function( channel ) {
        if ( null == channel ) return this;
        var tR, tG, tB;
        switch(channel)
        {
            case FILTER.CHANNEL.BLUE: 
                tR = val(0); tG = val(0); tB = eye(); 
                break;
            
            case FILTER.CHANNEL.GREEN: 
                tR = val(0); tG = eye(); tB = val(0); 
                break;
            
            case FILTER.CHANNEL.RED: 
            default:
                tR = eye(); tG = val(0); tB = val(0); 
                break;
            
        }
        return this.set(tR, tG, tB);
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,solarize: function( threshold ) {
        if ( threshold === undef ) threshold=0.5;
        
        var i=0, t=new CT(256)
            ,q, c, n=2/255
        ;
        
        for(i=0; i<256; i++)
        { 
            q = n*i; 
            c = (q>threshold) ? (255-255*q) : (255*q-255); 
            t[i] = ~~(clamp( c ));
        }
        return this.set(t);
    }
    
    ,solarize2: function( threshold ) {
        if ( threshold === undef ) threshold=0.5;
        threshold=1-threshold;
        var i=0, t=new CT(256)
            ,q, c, n=2/255
        ;
        
        for(i=0; i<256; i++)
        { 
            q = n*i; 
            c = (q<threshold) ? (255-255*q) : (255*q-255); 
            t[i] = ~~(clamp( c ));
        }
        return this.set(t);
    }
    
    ,solarizeInverse: function( threshold ) {
        if ( threshold === undef ) threshold=0.5;
        threshold*=256; 
        
        var i=0, t=new CT(256);
        for(i=0; i<256; i++)
        { 
            t[i] = (i>threshold) ? 255-i : i; 
        }
        return this.set(t);
    }
    
    ,invert: function( ) {
        return this.set(inv_eye());
    }
    
    // apply a binary mask to the image color channels
    ,mask: function( mask ) {
        var i=0, maskR=(mask>>16)&255, maskG=(mask>>8)&255, maskB=mask&255;
            tR=new CT(256), tG=new CT(256), tB=new CT(256)
            ;
        for(i=0; i<256; i++)
        { 
            tR[i]=clamp(i & maskR); 
            tG[i]=clamp(i & maskG); 
            tB[i]=clamp(i & maskB); 
        }
        return this.set(tR, tG, tB);
    }
    
    // replace a color with another
    ,replace: function( color, replacecolor ) {
        if (color==replacecolor) return this;
        var  
            c1R=(color>>16)&255, c1G=(color>>8)&255, c1B=(color)&255, 
            c2R=(replacecolor>>16)&255, c2G=(replacecolor>>8)&255, c2B=(replacecolor)&255, 
            tR=eye(), tG=eye(), tB=eye()
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
            tR=val(bR), tG=val(bG), tB=val(bB),
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
        for(i=0; i<256; i++)
        { 
            tR[i]=clamp(~~(255*Power(nF*i, gammaR))); 
            tG[i]=clamp(~~(255*Power(nF*i, gammaG))); 
            tB[i]=clamp(~~(255*Power(nF*i, gammaB)));  
        }
        return this.set(tR, tG, tB);
    }
    
    // adapted from http://www.jhlabs.com/ip/filters/
    ,exposure: function( exposure ) {
        if ( exposure === undef ) exposure=1;
        var i=0, t=new CT(256);
        for(i=0; i<256; i++)
        { 
            t[i]=clamp(~~(255 * (1 - Exponential(-exposure * i *nF)))); 
        }
        return this.set(t);
    }
    
    ,set: function( _tR, _tG, _tB, _tA ) {
        if ( !_tR ) return this;
        
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
            for(i=0; i<256; i++)
            { 
                tR[i]=clamp( _tR[clamp( tR2[i] )] ); 
                tG[i]=clamp( _tG[clamp( tG2[i] )] ); 
                tB[i]=clamp( _tB[clamp( tB2[i] )] ); 
            }
            this._tableR=tR; this._tableG=tG; this._tableB=tB;
        }
        else
        {
            // concat/compose the filter's tables, same as composing the filters
            for(i=0; i<256; i++)
            { 
                tR[i]=clamp( _tR[clamp( tR2[i] )] ); 
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

var IMG = FILTER.ImArray, IMGcopy = FILTER.ImArrayCopy, TypedArray = FILTER.TypedArray,
    MODE = FILTER.MODE, A16I = FILTER.Array16I, Min = Math.min, Max = Math.max, Floor = Math.floor
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
    
    ,path: FILTER_FILTERS_PATH
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
    ,mode: MODE.CLAMP
    
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
        var self = this, Map = self.map;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _map: self._map || (Map ? { data: Map.getData( ), width: Map.width, height: Map.height } : null)
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
            if ( self._map ) self._map.data = TypedArray( self._map.data, IMG );
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
            self._map = null;
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
        var self = this, Map = self.map;
        if ( !self._isOn || !(Map || self._map) ) return im;
        
        //self._map = self._map || { data: Map.getData( ), width: Map.width, height: Map.height };
        
        var _map = self._map || { data: Map.getData( ), width: Map.width, height: Map.height },
            map, mapW, mapH, mapArea, displace, ww, hh,
            sx = self.scaleX*0.00390625, sy = self.scaleY*0.00390625, 
            comx = self.componentX, comy = self.componentY, 
            alpha = self.alpha, red = self.red, 
            green = self.green, blue = self.blue, mode = self.mode,
            sty, stx, styw, bx0, by0, bx, by,
            i, j, k, x, y, ty, ty2, yy, xx, mapOff, dstOff, srcOff,
            applyArea, imArea, imLen, imcopy, srcx, srcy,
            _Ignore = MODE.IGNORE, _Clamp = MODE.CLAMP, _Color = MODE.COLOR, _Wrap = MODE.WRAP
        ;
        
        map = _map.data;
        mapW = _map.width; mapH = _map.height; 
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

var IMG = FILTER.ImArray, IMGcopy = FILTER.ImArrayCopy, TypedArray = FILTER.TypedArray,
    PI = FILTER.CONST.PI, DoublePI = FILTER.CONST.PI2, HalfPI = FILTER.CONST.PI_2,
    MODE = FILTER.MODE, toRad = FILTER.CONST.toRad, ThreePI2 = 1.5 * PI,
    Sqrt = Math.sqrt, Atan2 = Math.atan2, Atan = Math.atan,
    Sin = Math.sin, Cos = Math.cos, 
    Floor = Math.floor, Round = Math.round, //Ceil=Math.ceil,
    Asin = Math.asin, Tan = Math.tan, Abs = Math.abs, Max = Math.max,
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
    
    ,path: FILTER_FILTERS_PATH
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
    ,mode: MODE.CLAMP
    
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
            
            self.matrix = TypedArray( params.matrix, Array );
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
                self.inverseTransform = new Function("FILTER", '"use strict"; return ' + params.inverseTransform)( FILTER );
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
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
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
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
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
            
            j = ( (x+dx) % w + ((y+dy) % h) * w ) << 2;
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
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
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
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
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
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
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
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
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
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
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
            ix = Round(ix); iy = Round(iy);
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
            ip = ( ix + iy*w ) << 2;
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
            _Clamp=MODE.CLAMP, _Wrap=MODE.WRAP,
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
            ix = Round(ix); iy = Round(iy);
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
            ip = ( ix + iy*w ) << 2;
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
    sqrt2 = FILTER.CONST.SQRT2, toRad = FILTER.CONST.toRad, toDeg = FILTER.CONST.toDeg,
    Abs = Math.abs, Sqrt = Math.sqrt, Sin = Math.sin, Cos = Math.cos,
    TypedArray = FILTER.TypedArray, FilterUtil = FILTER.Util.Filter,
    notSupportClamp = FILTER._notSupportClamp,
    integral_convolution = FilterUtil.integral_convolution,
    separable_convolution = FilterUtil.separable_convolution,
    // Convolution Matrix
    CM = FILTER.Array32F, IMG = FILTER.ImArray, //IMGcopy = FILTER.ImArrayCopy,
    A32F = FILTER.Array32F, A16I = FILTER.Array16I, A8U = FILTER.Array8U,
    
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
    
    ,constructor: function( weights, factor, bias, rgba ) {
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
        self._rgba = !!rgba;
        /*if ( FILTER.useWebGL ) 
        {
            self._webglInstance = FILTER.WebGLConvolutionMatrixFilterInstance || null;
        }*/
    }
    
    ,path: FILTER_FILTERS_PATH
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
    ,_rgba: false
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
        self._rgba = null;
        
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
                ,_rgba: self._rgba
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
            self._matrix = TypedArray( params._matrix, CM );
            self._matrix2 = TypedArray( params._matrix2, CM );
            self._mat = TypedArray( params._mat, CM );
            self._mat2 = TypedArray( params._mat2, CM );
            self._coeff = TypedArray( params._coeff, CM );
            self._isGrad = params._isGrad;
            self._doIntegral = params._doIntegral;
            self._doSeparable = params._doSeparable;
            self._indices = TypedArray( params._indices, A16I );
            self._indices2 = TypedArray( params._indices2, A16I );
            self._indicesf = TypedArray( params._indicesf, A16I );
            self._indicesf2 = TypedArray( params._indicesf2, A16I );
            self._rgba = params._rgba;
        }
        return self;
    }
    
    ,rgba: function( bool ) {
        var self = this;
        if ( !arguments.length )
        {
            return self._rgba;
        }
        else
        {
            self._rgba = !!bool;
            return self;
        }
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
        var self = this, rgba = self._rgba;
        if ( !self._isOn || !self._matrix ) return im;
        
        // do a faster convolution routine if possible
        if ( self._doIntegral ) 
        {
            return self._matrix2
            ? integral_convolution(rgba, im, w, h, self._matrix, self._matrix2, self._dim, self._dim2, self._coeff[0], self._coeff[1], self._doIntegral)
            : integral_convolution(rgba, im, w, h, self._matrix, null, self._dim, self._dim, self._coeff[0], self._coeff[1], self._doIntegral)
            ;
        }
        else if ( self._doSeparable )
        {
            return separable_convolution(rgba, im, w, h, self._mat, self._mat2, self._indices, self._indices2, self._coeff[0], self._coeff[1]);
        }
        // handle some common cases fast
        /*else if (3==this._dim)
        {
            return convolution3(im, w, h, this._matrix, this._matrix2, this._dim, this._dim, this._coeff[0], this._coeff[1], this._isGrad);
        }*/
        
        var imLen = im.length, imArea = (imLen>>2), 
            dst = new IMG(imLen), 
            t0, t1, t2, t3,
            i, j, k, x, ty, ty2, 
            xOff, yOff, srcOff, 
            r, g, b, a, r2, g2, b2, a2,
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
                r=g=b=a=r2=g2=b2=a2=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; 
                        wt = mat[k]; r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt;  a += im[srcOff+3] * wt;
                        // allow to apply a second similar matrix in-parallel (eg for total gradients)
                        wt2 = mat2[k]; r2 += im[srcOff] * wt2; g2 += im[srcOff+1] * wt2;  b2 += im[srcOff+2] * wt2;  a2 += im[srcOff+3] * wt2;
                    }
                }
                
                // output
                if ( _isGrad )
                {
                    t0 = Abs(r)+Abs(r2);  t1 = Abs(g)+Abs(g2);  t2 = Abs(b)+Abs(b2);
                }
                else
                {
                    t0 = coeff1*r + coeff2*r2;  t1 = coeff1*g + coeff2*g2;  t2 = coeff1*b + coeff2*b2;
                }
                if ( notSupportClamp )
                {   
                    // clamp them manually
                    t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                    t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                    t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                }
                dst[i] = ~~t0;  dst[i+1] = ~~t1;  dst[i+2] = ~~t2;
                if ( rgba )
                {
                    t3 = _isGrad ? Abs(a)+Abs(a2) : coeff1*a + coeff2*a2;
                    if ( notSupportClamp ) t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                    dst[i+3] = ~~t3;
                }
                else
                {
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
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
                r=g=b=a=0;
                for (k=0, j=0; k<matArea; k++, j+=2)
                {
                    xOff = x + imageIndices[j]; yOff = ty + imageIndices[j+1];
                    if (xOff>=0 && xOff<=bx && yOff>=0 && yOff<=by)
                    {
                        srcOff = (xOff + yOff)<<2; wt = mat[k];
                        r += im[srcOff] * wt; g += im[srcOff+1] * wt;  b += im[srcOff+2] * wt; a += im[srcOff+3] * wt;
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
                if ( rgba )
                {
                    t3 = coeff1*a + coeff2;
                    if ( notSupportClamp ) t3 = t3<0 ? 0 : (t3>255 ? 255 : t3);
                    dst[i+3] = ~~t3;
                }
                else
                {
                    // alpha channel is not transformed
                    dst[i+3] = im[i+3];
                }
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
var IMG = FILTER.ImArray, STRUCT = FILTER.Array8U, A32I = FILTER.Array32I,
    Sqrt = Math.sqrt, TypedArray = FILTER.TypedArray,
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
    
    ,path: FILTER_FILTERS_PATH
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
            self._structureElement = TypedArray( params._structureElement, STRUCT );
            self._indices = TypedArray( params._indices, A32I );
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
var IMG = FILTER.ImArray, A32I = FILTER.Array32I,TypedArray = FILTER.TypedArray,
    Min = Math.min, Max = Math.max, Filters;
    
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
    
    ,path: FILTER_FILTERS_PATH
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
            self._indices = TypedArray( params._indices, A32I );
            self._filterName = params._filterName;
            if ( self._filterName && Filters[ self._filterName ] )
                self._filter = Filters[ self._filterName ];
        }
        return self;
    }
    
    ,median: function( d ) { 
        // allow only odd dimensions for median
        return this.set( null == d ? 3 : (d&1 ? d : d+1), "median" );
    }
    
    ,minimum: function( d ) { 
        return this.set( null == d ? 3 : (d&1 ? d : d+1), "minimum" );
    }
    
    ,maximum: function( d ) { 
        return this.set( null == d ? 3 : (d&1 ? d : d+1), "maximum" );
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
            len=rM.length; len2=len>>>1;
            medianR= len&1 ? rM[len2] : ~~(0.5*rM[len2-1] + 0.5*rM[len2]);
            //len=gM.length; len2=len>>>1;
            medianG= len&1 ? gM[len2] : ~~(0.5*gM[len2-1] + 0.5*gM[len2]);
            //len=bM.length; len2=len>>>1;
            medianB= len&1 ? bM[len2] : ~~(0.5*bM[len2-1] + 0.5*bM[len2]);
            
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
return FILTER;
});
/**
*
*   FILTER.js Plugins
*   @version: 0.9.5
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Plugins)
*   https://github.com/foo123/FILTER.js
*
**/!function( root, factory ){
"use strict";
if ( ('object'===typeof module) && module.exports ) /* CommonJS */
    module.exports = factory.call(root,(module.$deps && module.$deps["FILTER"]) || require("./FILTER".toLowerCase()));
else if ( ("function"===typeof define) && define.amd && ("function"===typeof require) && ("function"===typeof require.specified) && require.specified("FILTER_PLUGINS") /*&& !require.defined("FILTER_PLUGINS")*/ ) 
    define("FILTER_PLUGINS",['module',"FILTER"],function(mod,module){factory.moduleUri = mod.uri; factory.call(root,module); return module;});
else /* Browser/WebWorker/.. */
    (factory.call(root,root["FILTER"])||1)&&('function'===typeof define)&&define.amd&&define(function(){return root["FILTER"];} );
}(  /* current root */          this, 
    /* module factory */        function ModuleFactory__FILTER_PLUGINS( FILTER ){
/* main code starts here */

/**
*
*   FILTER.js Plugins
*   @version: 0.9.5
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (Plugins)
*   https://github.com/foo123/FILTER.js
*
**/
"use strict";
var FILTER_PLUGINS_PATH = FILTER.getPath( ModuleFactory__FILTER_PLUGINS.moduleUri );

/**
*
* Noise Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp = FILTER._notSupportClamp, rand = Math.random;

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
    ,path: FILTER_PLUGINS_PATH
    
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

var perlin_noise = FILTER.Util.Image.perlin;

// an efficient perlin noise and simplex noise plugin
// http://en.wikipedia.org/wiki/Perlin_noise
FILTER.Create({
    name: "PerlinNoiseFilter"
    
    // parameters
    ,_baseX: 1
    ,_baseY: 1
    ,_octaves: 1
    ,_offsets: null
    ,_colors: false
    ,_seed: 0
    ,_stitch: false
    ,_fractal: true
    ,_perlin: false
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    // constructor
    ,init: function( baseX, baseY, octaves, stitch, fractal, offsets, seed, use_perlin ) {
        var self = this;
        self._baseX = baseX || 1;
        self._baseY = baseY || 1;
        self._seed = seed || 0;
        self._stitch = !!stitch;
        self._fractal = false !== fractal;
        self._perlin = !!use_perlin;
        self.octaves( octaves||1, offsets );
    }
    
    ,seed: function( randSeed ) {
        var self = this;
        self._seed = randSeed || 0;
        return self;
    }
    
    ,octaves: function( octaves, offsets ) {
        var self = this;
        self._octaves = octaves || 1;
        self._offsets = !offsets ? [] : offsets.slice(0);
        while (self._offsets.length < self._octaves) self._offsets.push([0,0]);
        return self;
    }
    
    ,seamless: function( enabled ) {
        if ( !arguments.length ) enabled = true;
        this._stitch = !!enabled;
        return this;
    }
    
    ,colors: function( enabled ) {
        if ( !arguments.length ) enabled = true;
        this._colors = !!enabled;
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
                 _baseX: self._baseX
                ,_baseY: self._baseY
                ,_octaves: self._octaves
                ,_offsets: self._offsets
                ,_seed: self._seed || 0
                ,_stitch: self._stitch
                ,_colors: self._colors
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
            
            self._baseX = params._baseX;
            self._baseY = params._baseY;
            self._octaves = params._octaves;
            self._offsets = params._offsets;
            self._seed = params._seed || 0;
            self._stitch = params._stitch;
            self._colors = params._colors;
            self._fractal = params._fractal;
            self._perlin = params._perlin;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !perlin_noise ) return im;
        if ( self._seed )
        {
            perlin_noise.seed( self._seed );
            self._seed = 0;
        }
        return perlin_noise( im, w, h, self._stitch, !self._colors, self._baseX, self._baseY, self._octaves, self._offsets, 1.0, 0.5, self._perlin );
    }
});

}(FILTER);/**
*
* Filter Gradient, Radial-Gradient plugins
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var ImageUtil = FILTER.Util.Image, TypedArray = FILTER.TypedArray;

FILTER.Create({
     name: "GradientFilter"
    
    // parameters
    ,colors: null
    ,stops: null
    ,angle: 0
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    // constructor
    ,init: function( colors, stops, angle ) {
        var self = this;
        self.setColors( colors, stops );
        self.angle = angle||0;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.colors = null;
        self.stops = null;
        self.angle = null;
        self.$super('dispose');
        return self;
    }
    
    ,setColors: function( colors, stops ) {
        var self = this;
        if ( colors && colors.length )
        {
            var c = ImageUtil.colors_stops( colors, stops );
            self.colors = c[0]; self.stops = c[1];
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 angle: self.angle
                ,colors: self.colors
                ,stops: self.stops
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.angle = params.angle;
            self.colors = TypedArray( params.colors, Array );
            self.stops = TypedArray( params.stops, Array );
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !self.colors ) return im;
        return ImageUtil.gradient( im, w, h, self.colors, self.stops, self.angle, ImageUtil.lerp );
    }
});

FILTER.Create({
     name: "RadialGradientFilter"
    
    // parameters
    ,colors: null
    ,stops: null
    ,centerX: 0
    ,centerY: 0
    ,radiusX: 1.0
    ,radiusY: 1.0
    
    // constructor
    ,init: function( colors, stops, centerX, centerY, radiusX, radiusY ) {
        var self = this;
        self.setColors( colors, stops );
        self.centerX = centerX||0;
        self.centerY = centerY||0;
        self.radiusX = radiusX||1.0;
        self.radiusY = radiusY||1.0;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.colors = null;
        self.stops = null;
        self.centerX = null;
        self.centerY = null;
        self.radiusX = null;
        self.radiusY = null;
        self.$super('dispose');
        return self;
    }
    
    ,setColors: function( colors, stops ) {
        var self = this;
        if ( colors && colors.length )
        {
            var c = ImageUtil.colors_stops( colors, stops );
            self.colors = c[0]; self.stops = c[1];
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 centerX: self.centerX
                ,centerY: self.centerY
                ,radiusX: self.radiusX
                ,radiusY: self.radiusY
                ,colors: self.colors
                ,stops: self.stops
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.centerX = params.centerX || 0;
            self.centerY = params.centerY || 0;
            self.radiusX = params.radiusX || 1.0;
            self.radiusY = params.radiusY || 1.0;
            self.colors = TypedArray( params.colors, Array );
            self.stops = TypedArray( params.stops, Array );
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn || !self.colors ) return im;
        return ImageUtil.radial_gradient( im, w, h, self.colors, self.stops, self.centerX, self.centerY, self.radiusX, self.radiusY, ImageUtil.lerp );
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

var notSupportClamp = FILTER._notSupportClamp, Min = Math.min, Floor = Math.floor,
    R = FILTER.CHANNEL.RED, G = FILTER.CHANNEL.GREEN, B = FILTER.CHANNEL.BLUE, A = FILTER.CHANNEL.ALPHA;

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
    ,path: FILTER_PLUGINS_PATH
    
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
            self._srcImg = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, Src = self.srcImg;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _srcImg: self._srcImg || (Src ? { data: Src.getData( ), width: Src.width, height: Src.height } : null)
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
            
            self.srcImg = null;
            self._srcImg = params._srcImg;
            if ( self._srcImg ) self._srcImg.data = FILTER.TypedArray( self._srcImg.data, FILTER.ImArray );
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
        var self = this, Src = self.srcImg;
        if ( !self._isOn || !(Src || self._srcImg) ) return im;
        
        //self._srcImg = self._srcImg || { data: Src.getData( ), width: Src.width, height: Src.height };
        
        var _src = self._srcImg || { data: Src.getData( ), width: Src.width, height: Src.height },
            src = _src.data, w2 = _src.width, h2 = _src.height,
            i, l = im.length, l2 = src.length, 
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
    ,path: FILTER_PLUGINS_PATH
    
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
            self._alphaMask = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, Mask = self.alphaMask;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _alphaMask: self._alphaMask || (Mask ? { data: Mask.getData( ), width: Mask.width, height: Mask.height } : null)
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
            
            self.alphaMask = null;
            self._alphaMask = params._alphaMask;
            if ( self._alphaMask ) self._alphaMask.data = FILTER.TypedArray( self._alphaMask.data, FILTER.ImArray );
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
        
        var self = this, Mask = self.alphaMask;
        if ( !self._isOn || !(Mask || self._alphaMask) ) return im;
        
        //self._alphaMask = self._alphaMask || { data: Mask.getData( ), width: Mask.width, height: Mask.height };
        
        var _alpha = self._alphaMask || { data: Mask.getData( ), width: Mask.width, height: Mask.height },
            alpha = _alpha.data, w2 = _alpha.width, h2 = _alpha.height,
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
* Histogram Equalize Plugin, Histogram Equalize for grayscale images Plugin, RGB Histogram Equalize Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var notSupportClamp = FILTER._notSupportClamp, A32F = FILTER.Array32F,
    RGB2YCbCr = FILTER.Color.RGB2YCbCr, YCbCr2RGB = FILTER.Color.YCbCr2RGB,
    Min = Math.min, Max = Math.max
;

// a simple histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
FILTER.Create({
    name : "HistogramEqualizeFilter"
    
    ,path: FILTER_PLUGINS_PATH
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var r,g,b, range, max = 0, min = 255,
            cdf, accum, t0, t1, t2,
            i, y, l=im.length, l2=l>>2, n=1.0/(l2), ycbcr, rgba
        ;
        
        // initialize the arrays
        cdf = new A32F( 256 );
        for (i=0; i<256; i+=32)
        { 
            // partial loop unrolling
            cdf[i   ]=0;
            cdf[i+1 ]=0;
            cdf[i+2 ]=0;
            cdf[i+3 ]=0;
            cdf[i+4 ]=0;
            cdf[i+5 ]=0;
            cdf[i+6 ]=0;
            cdf[i+7 ]=0;
            cdf[i+8 ]=0;
            cdf[i+9 ]=0;
            cdf[i+10]=0;
            cdf[i+11]=0;
            cdf[i+12]=0;
            cdf[i+13]=0;
            cdf[i+14]=0;
            cdf[i+15]=0;
            cdf[i+16]=0;
            cdf[i+17]=0;
            cdf[i+18]=0;
            cdf[i+19]=0;
            cdf[i+20]=0;
            cdf[i+21]=0;
            cdf[i+22]=0;
            cdf[i+23]=0;
            cdf[i+24]=0;
            cdf[i+25]=0;
            cdf[i+26]=0;
            cdf[i+27]=0;
            cdf[i+28]=0;
            cdf[i+29]=0;
            cdf[i+30]=0;
            cdf[i+31]=0;
        }
        
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            //r = im[i]; g = im[i+1]; b = im[i+2];
            ycbcr = RGB2YCbCr(im.subarray(i,i+3));
            r = im[i] = ~~ycbcr[2]; g = im[i+1] = ~~ycbcr[0]; b = im[i+2] = ~~ycbcr[1];
            cdf[ g ] += n;
            max = Max(g, max);
            min = Min(g, min);
        }
        
        // compute cdf
        for (accum=0,i=0; i<256; i+=32)
        { 
            // partial loop unrolling
            accum += cdf[i   ]; cdf[i   ] = accum;
            accum += cdf[i+1 ]; cdf[i+1 ] = accum;
            accum += cdf[i+2 ]; cdf[i+2 ] = accum;
            accum += cdf[i+3 ]; cdf[i+3 ] = accum;
            accum += cdf[i+4 ]; cdf[i+4 ] = accum;
            accum += cdf[i+5 ]; cdf[i+5 ] = accum;
            accum += cdf[i+6 ]; cdf[i+6 ] = accum;
            accum += cdf[i+7 ]; cdf[i+7 ] = accum;
            accum += cdf[i+8 ]; cdf[i+8 ] = accum;
            accum += cdf[i+9 ]; cdf[i+9 ] = accum;
            accum += cdf[i+10]; cdf[i+10] = accum;
            accum += cdf[i+11]; cdf[i+11] = accum;
            accum += cdf[i+12]; cdf[i+12] = accum;
            accum += cdf[i+13]; cdf[i+13] = accum;
            accum += cdf[i+14]; cdf[i+14] = accum;
            accum += cdf[i+15]; cdf[i+15] = accum;
            accum += cdf[i+16]; cdf[i+16] = accum;
            accum += cdf[i+17]; cdf[i+17] = accum;
            accum += cdf[i+18]; cdf[i+18] = accum;
            accum += cdf[i+19]; cdf[i+19] = accum;
            accum += cdf[i+20]; cdf[i+20] = accum;
            accum += cdf[i+21]; cdf[i+21] = accum;
            accum += cdf[i+22]; cdf[i+22] = accum;
            accum += cdf[i+23]; cdf[i+23] = accum;
            accum += cdf[i+24]; cdf[i+24] = accum;
            accum += cdf[i+25]; cdf[i+25] = accum;
            accum += cdf[i+26]; cdf[i+26] = accum;
            accum += cdf[i+27]; cdf[i+27] = accum;
            accum += cdf[i+28]; cdf[i+28] = accum;
            accum += cdf[i+29]; cdf[i+29] = accum;
            accum += cdf[i+30]; cdf[i+30] = accum;
            accum += cdf[i+31]; cdf[i+31] = accum;
        }
        
        // equalize only the intesity channel
        range = max-min;
        if (notSupportClamp)
        {   
            for (i=0; i<l; i+=4)
            { 
                rgba = YCbCr2RGB([cdf[im[i+1]]*range + min, im[i+2], im[i]]);
                t0 = rgba[0]; t1 = rgba[1]; t2 = rgba[2]; 
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            { 
                rgba = YCbCr2RGB([cdf[im[i+1]]*range + min, im[i+2], im[i]]);
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
    
    ,path: FILTER_PLUGINS_PATH
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        // im is a copy of the image data as an image array
        // w is image width, h is image height
        // image is the original image instance reference, generally not needed
        // for this filter, no need to clone the image data, operate in-place
        var self = this;
        if ( !self._isOn ) return im;
        var c, g, range, max = 0, min = 255,
            cdf, accum, t0, t1, t2,
            i, l = im.length, l2=l>>2, n=1.0/(l2)
        ;
        
        // initialize the arrays
        cdf = new A32F( 256 );
        for (i=0; i<256; i+=32)
        { 
            // partial loop unrolling
            cdf[i   ]=0;
            cdf[i+1 ]=0;
            cdf[i+2 ]=0;
            cdf[i+3 ]=0;
            cdf[i+4 ]=0;
            cdf[i+5 ]=0;
            cdf[i+6 ]=0;
            cdf[i+7 ]=0;
            cdf[i+8 ]=0;
            cdf[i+9 ]=0;
            cdf[i+10]=0;
            cdf[i+11]=0;
            cdf[i+12]=0;
            cdf[i+13]=0;
            cdf[i+14]=0;
            cdf[i+15]=0;
            cdf[i+16]=0;
            cdf[i+17]=0;
            cdf[i+18]=0;
            cdf[i+19]=0;
            cdf[i+20]=0;
            cdf[i+21]=0;
            cdf[i+22]=0;
            cdf[i+23]=0;
            cdf[i+24]=0;
            cdf[i+25]=0;
            cdf[i+26]=0;
            cdf[i+27]=0;
            cdf[i+28]=0;
            cdf[i+29]=0;
            cdf[i+30]=0;
            cdf[i+31]=0;
        }
        
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            c = im[i];  // image is already grayscale
            cdf[c] += n;
            max = Max(c, max);
            min = Min(c, min);
        }
        
        // compute cdf
        for (accum=0,i=0; i<256; i+=32)
        { 
            // partial loop unrolling
            accum += cdf[i   ]; cdf[i   ] = accum;
            accum += cdf[i+1 ]; cdf[i+1 ] = accum;
            accum += cdf[i+2 ]; cdf[i+2 ] = accum;
            accum += cdf[i+3 ]; cdf[i+3 ] = accum;
            accum += cdf[i+4 ]; cdf[i+4 ] = accum;
            accum += cdf[i+5 ]; cdf[i+5 ] = accum;
            accum += cdf[i+6 ]; cdf[i+6 ] = accum;
            accum += cdf[i+7 ]; cdf[i+7 ] = accum;
            accum += cdf[i+8 ]; cdf[i+8 ] = accum;
            accum += cdf[i+9 ]; cdf[i+9 ] = accum;
            accum += cdf[i+10]; cdf[i+10] = accum;
            accum += cdf[i+11]; cdf[i+11] = accum;
            accum += cdf[i+12]; cdf[i+12] = accum;
            accum += cdf[i+13]; cdf[i+13] = accum;
            accum += cdf[i+14]; cdf[i+14] = accum;
            accum += cdf[i+15]; cdf[i+15] = accum;
            accum += cdf[i+16]; cdf[i+16] = accum;
            accum += cdf[i+17]; cdf[i+17] = accum;
            accum += cdf[i+18]; cdf[i+18] = accum;
            accum += cdf[i+19]; cdf[i+19] = accum;
            accum += cdf[i+20]; cdf[i+20] = accum;
            accum += cdf[i+21]; cdf[i+21] = accum;
            accum += cdf[i+22]; cdf[i+22] = accum;
            accum += cdf[i+23]; cdf[i+23] = accum;
            accum += cdf[i+24]; cdf[i+24] = accum;
            accum += cdf[i+25]; cdf[i+25] = accum;
            accum += cdf[i+26]; cdf[i+26] = accum;
            accum += cdf[i+27]; cdf[i+27] = accum;
            accum += cdf[i+28]; cdf[i+28] = accum;
            accum += cdf[i+29]; cdf[i+29] = accum;
            accum += cdf[i+30]; cdf[i+30] = accum;
            accum += cdf[i+31]; cdf[i+31] = accum;
        }
        
        // equalize the grayscale/intesity channels
        range = max-min;
        if (notSupportClamp)
        {   
            for (i=0; i<l; i+=4)
            { 
                c = im[i]; // grayscale image has same value in all channels
                g = cdf[c]*range + min;
                // clamp them manually
                g = g<0 ? 0 : (g>255 ? 255 : g);
                g = ~~g;
                im[i] = g; im[i+1] = g; im[i+2] = g; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            { 
                c = im[i]; // grayscale image has same value in all channels
                g = ~~( cdf[c]*range + min );
                im[i] = g; im[i+1] = g; im[i+2] = g; 
            }
        }
        
        // return the new image data
        return im;
    }
});

// a sample RGB histogram equalizer filter  http://en.wikipedia.org/wiki/Histogram_equalization
// used for illustration purposes on how to create a plugin filter
FILTER.Create({
    name: "RGBHistogramEqualizeFilter"
    
    ,path: FILTER_PLUGINS_PATH
    
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
        for (i=0; i<256; i+=32)
        { 
            // partial loop unrolling
            cdfR[i   ]=0;
            cdfR[i+1 ]=0;
            cdfR[i+2 ]=0;
            cdfR[i+3 ]=0;
            cdfR[i+4 ]=0;
            cdfR[i+5 ]=0;
            cdfR[i+6 ]=0;
            cdfR[i+7 ]=0;
            cdfR[i+8 ]=0;
            cdfR[i+9 ]=0;
            cdfR[i+10]=0;
            cdfR[i+11]=0;
            cdfR[i+12]=0;
            cdfR[i+13]=0;
            cdfR[i+14]=0;
            cdfR[i+15]=0;
            cdfR[i+16]=0;
            cdfR[i+17]=0;
            cdfR[i+18]=0;
            cdfR[i+19]=0;
            cdfR[i+20]=0;
            cdfR[i+21]=0;
            cdfR[i+22]=0;
            cdfR[i+23]=0;
            cdfR[i+24]=0;
            cdfR[i+25]=0;
            cdfR[i+26]=0;
            cdfR[i+27]=0;
            cdfR[i+28]=0;
            cdfR[i+29]=0;
            cdfR[i+30]=0;
            cdfR[i+31]=0;
        
            cdfG[i   ]=0;
            cdfG[i+1 ]=0;
            cdfG[i+2 ]=0;
            cdfG[i+3 ]=0;
            cdfG[i+4 ]=0;
            cdfG[i+5 ]=0;
            cdfG[i+6 ]=0;
            cdfG[i+7 ]=0;
            cdfG[i+8 ]=0;
            cdfG[i+9 ]=0;
            cdfG[i+10]=0;
            cdfG[i+11]=0;
            cdfG[i+12]=0;
            cdfG[i+13]=0;
            cdfG[i+14]=0;
            cdfG[i+15]=0;
            cdfG[i+16]=0;
            cdfG[i+17]=0;
            cdfG[i+18]=0;
            cdfG[i+19]=0;
            cdfG[i+20]=0;
            cdfG[i+21]=0;
            cdfG[i+22]=0;
            cdfG[i+23]=0;
            cdfG[i+24]=0;
            cdfG[i+25]=0;
            cdfG[i+26]=0;
            cdfG[i+27]=0;
            cdfG[i+28]=0;
            cdfG[i+29]=0;
            cdfG[i+30]=0;
            cdfG[i+31]=0;
        
            cdfB[i   ]=0;
            cdfB[i+1 ]=0;
            cdfB[i+2 ]=0;
            cdfB[i+3 ]=0;
            cdfB[i+4 ]=0;
            cdfB[i+5 ]=0;
            cdfB[i+6 ]=0;
            cdfB[i+7 ]=0;
            cdfB[i+8 ]=0;
            cdfB[i+9 ]=0;
            cdfB[i+10]=0;
            cdfB[i+11]=0;
            cdfB[i+12]=0;
            cdfB[i+13]=0;
            cdfB[i+14]=0;
            cdfB[i+15]=0;
            cdfB[i+16]=0;
            cdfB[i+17]=0;
            cdfB[i+18]=0;
            cdfB[i+19]=0;
            cdfB[i+20]=0;
            cdfB[i+21]=0;
            cdfB[i+22]=0;
            cdfB[i+23]=0;
            cdfB[i+24]=0;
            cdfB[i+25]=0;
            cdfB[i+26]=0;
            cdfB[i+27]=0;
            cdfB[i+28]=0;
            cdfB[i+29]=0;
            cdfB[i+30]=0;
            cdfB[i+31]=0;
        }
        
        // compute pdf and maxima/minima
        for (i=0; i<l; i+=4)
        {
            r = im[i]; g = im[i+1]; b = im[i+2];
            cdfR[r] += n; cdfG[g] += n; cdfB[b] += n;
            maxR = Max(r, maxR);
            maxG = Max(g, maxG);
            maxB = Max(b, maxB);
            minR = Min(r, minR);
            minG = Min(g, minG);
            minB = Min(b, minB);
        }
        
        // compute cdf
        for (accumR=accumG=accumB=0,i=0; i<256; i+=32)
        { 
            // partial loop unrolling
            accumR += cdfR[i   ]; cdfR[i   ] = accumR;
            accumR += cdfR[i+1 ]; cdfR[i+1 ] = accumR;
            accumR += cdfR[i+2 ]; cdfR[i+2 ] = accumR;
            accumR += cdfR[i+3 ]; cdfR[i+3 ] = accumR;
            accumR += cdfR[i+4 ]; cdfR[i+4 ] = accumR;
            accumR += cdfR[i+5 ]; cdfR[i+5 ] = accumR;
            accumR += cdfR[i+6 ]; cdfR[i+6 ] = accumR;
            accumR += cdfR[i+7 ]; cdfR[i+7 ] = accumR;
            accumR += cdfR[i+8 ]; cdfR[i+8 ] = accumR;
            accumR += cdfR[i+9 ]; cdfR[i+9 ] = accumR;
            accumR += cdfR[i+10]; cdfR[i+10] = accumR;
            accumR += cdfR[i+11]; cdfR[i+11] = accumR;
            accumR += cdfR[i+12]; cdfR[i+12] = accumR;
            accumR += cdfR[i+13]; cdfR[i+13] = accumR;
            accumR += cdfR[i+14]; cdfR[i+14] = accumR;
            accumR += cdfR[i+15]; cdfR[i+15] = accumR;
            accumR += cdfR[i+16]; cdfR[i+16] = accumR;
            accumR += cdfR[i+17]; cdfR[i+17] = accumR;
            accumR += cdfR[i+18]; cdfR[i+18] = accumR;
            accumR += cdfR[i+19]; cdfR[i+19] = accumR;
            accumR += cdfR[i+20]; cdfR[i+20] = accumR;
            accumR += cdfR[i+21]; cdfR[i+21] = accumR;
            accumR += cdfR[i+22]; cdfR[i+22] = accumR;
            accumR += cdfR[i+23]; cdfR[i+23] = accumR;
            accumR += cdfR[i+24]; cdfR[i+24] = accumR;
            accumR += cdfR[i+25]; cdfR[i+25] = accumR;
            accumR += cdfR[i+26]; cdfR[i+26] = accumR;
            accumR += cdfR[i+27]; cdfR[i+27] = accumR;
            accumR += cdfR[i+28]; cdfR[i+28] = accumR;
            accumR += cdfR[i+29]; cdfR[i+29] = accumR;
            accumR += cdfR[i+30]; cdfR[i+30] = accumR;
            accumR += cdfR[i+31]; cdfR[i+31] = accumR;
        
            accumG += cdfG[i   ]; cdfG[i   ] = accumG;
            accumG += cdfG[i+1 ]; cdfG[i+1 ] = accumG;
            accumG += cdfG[i+2 ]; cdfG[i+2 ] = accumG;
            accumG += cdfG[i+3 ]; cdfG[i+3 ] = accumG;
            accumG += cdfG[i+4 ]; cdfG[i+4 ] = accumG;
            accumG += cdfG[i+5 ]; cdfG[i+5 ] = accumG;
            accumG += cdfG[i+6 ]; cdfG[i+6 ] = accumG;
            accumG += cdfG[i+7 ]; cdfG[i+7 ] = accumG;
            accumG += cdfG[i+8 ]; cdfG[i+8 ] = accumG;
            accumG += cdfG[i+9 ]; cdfG[i+9 ] = accumG;
            accumG += cdfG[i+10]; cdfG[i+10] = accumG;
            accumG += cdfG[i+11]; cdfG[i+11] = accumG;
            accumG += cdfG[i+12]; cdfG[i+12] = accumG;
            accumG += cdfG[i+13]; cdfG[i+13] = accumG;
            accumG += cdfG[i+14]; cdfG[i+14] = accumG;
            accumG += cdfG[i+15]; cdfG[i+15] = accumG;
            accumG += cdfG[i+16]; cdfG[i+16] = accumG;
            accumG += cdfG[i+17]; cdfG[i+17] = accumG;
            accumG += cdfG[i+18]; cdfG[i+18] = accumG;
            accumG += cdfG[i+19]; cdfG[i+19] = accumG;
            accumG += cdfG[i+20]; cdfG[i+20] = accumG;
            accumG += cdfG[i+21]; cdfG[i+21] = accumG;
            accumG += cdfG[i+22]; cdfG[i+22] = accumG;
            accumG += cdfG[i+23]; cdfG[i+23] = accumG;
            accumG += cdfG[i+24]; cdfG[i+24] = accumG;
            accumG += cdfG[i+25]; cdfG[i+25] = accumG;
            accumG += cdfG[i+26]; cdfG[i+26] = accumG;
            accumG += cdfG[i+27]; cdfG[i+27] = accumG;
            accumG += cdfG[i+28]; cdfG[i+28] = accumG;
            accumG += cdfG[i+29]; cdfG[i+29] = accumG;
            accumG += cdfG[i+30]; cdfG[i+30] = accumG;
            accumG += cdfG[i+31]; cdfG[i+31] = accumG;
        
            accumB += cdfB[i   ]; cdfB[i   ] = accumB;
            accumB += cdfB[i+1 ]; cdfB[i+1 ] = accumB;
            accumB += cdfB[i+2 ]; cdfB[i+2 ] = accumB;
            accumB += cdfB[i+3 ]; cdfB[i+3 ] = accumB;
            accumB += cdfB[i+4 ]; cdfB[i+4 ] = accumB;
            accumB += cdfB[i+5 ]; cdfB[i+5 ] = accumB;
            accumB += cdfB[i+6 ]; cdfB[i+6 ] = accumB;
            accumB += cdfB[i+7 ]; cdfB[i+7 ] = accumB;
            accumB += cdfB[i+8 ]; cdfB[i+8 ] = accumB;
            accumB += cdfB[i+9 ]; cdfB[i+9 ] = accumB;
            accumB += cdfB[i+10]; cdfB[i+10] = accumB;
            accumB += cdfB[i+11]; cdfB[i+11] = accumB;
            accumB += cdfB[i+12]; cdfB[i+12] = accumB;
            accumB += cdfB[i+13]; cdfB[i+13] = accumB;
            accumB += cdfB[i+14]; cdfB[i+14] = accumB;
            accumB += cdfB[i+15]; cdfB[i+15] = accumB;
            accumB += cdfB[i+16]; cdfB[i+16] = accumB;
            accumB += cdfB[i+17]; cdfB[i+17] = accumB;
            accumB += cdfB[i+18]; cdfB[i+18] = accumB;
            accumB += cdfB[i+19]; cdfB[i+19] = accumB;
            accumB += cdfB[i+20]; cdfB[i+20] = accumB;
            accumB += cdfB[i+21]; cdfB[i+21] = accumB;
            accumB += cdfB[i+22]; cdfB[i+22] = accumB;
            accumB += cdfB[i+23]; cdfB[i+23] = accumB;
            accumB += cdfB[i+24]; cdfB[i+24] = accumB;
            accumB += cdfB[i+25]; cdfB[i+25] = accumB;
            accumB += cdfB[i+26]; cdfB[i+26] = accumB;
            accumB += cdfB[i+27]; cdfB[i+27] = accumB;
            accumB += cdfB[i+28]; cdfB[i+28] = accumB;
            accumB += cdfB[i+29]; cdfB[i+29] = accumB;
            accumB += cdfB[i+30]; cdfB[i+30] = accumB;
            accumB += cdfB[i+31]; cdfB[i+31] = accumB;
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
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
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

var Sqrt = Math.sqrt, notSupportClamp = FILTER._notSupportClamp, A32F = FILTER.Array32F;


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
    ,path: FILTER_PLUGINS_PATH
    
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
    ,path: FILTER_PLUGINS_PATH
    
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
    ,path: FILTER_PLUGINS_PATH
    
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
            ,f11 = /*area**/f1, f22 = /*area**/f2
            ,f33 = /*area**/f3, f44 = /*area**/f4
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
                    err[index] += f11*qr;
                    err[index+1] += f11*qg;
                    err[index+2] += f11*qb;
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
                    err[index] += f22*qr;
                    err[index+1] += f22*qg;
                    err[index+2] += f22*qb;
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
                    err[index] += f33*qr;
                    err[index+1] += f33*qg;
                    err[index+2] += f33*qb;
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
                    err[index] += f44*qr;
                    err[index+1] += f44*qg;
                    err[index+2] += f44*qb;
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
* Image Blend Filter Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var HAS = 'hasOwnProperty', Min = Math.min, Round = Math.round,
    notSupportClamp = FILTER._notSupportClamp, blend_function = FILTER.Color.Combine
;

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
    ,path: FILTER_PLUGINS_PATH
    
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
            if ( !blend_function[HAS](self._blendMode) ) self._blendMode = null;
        }
        else
        {
            self._blendMode = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, bImg = self.blendImage;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                _blendImage: self._blendImage || (bImg ? { data: bImg.getData( ), width: bImg.width, height: bImg.height } : null)
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
            self.blendImage = null;
            self._blendImage = params._blendImage;
            if ( self._blendImage ) self._blendImage.data = FILTER.TypedArray( self._blendImage.data, FILTER.ImArray );
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
        var self = this, bImg = self.blendImage;
        if ( !self._isOn || !self._blendMode || !(bImg || self._blendImage) ) return im;
        
        //self._blendImage = self._blendImage || { data: bImg.getData( ), width: bImg.width, height: bImg.height };
        
        var image2 = self._blendImage || { data: bImg.getData( ), width: bImg.width, height: bImg.height },
            startX = self.startX||0, startY = self.startY||0, 
            startX2 = 0, startY2 = 0, W, H, im2, w2, h2, 
            W1, W2, start, end, x, y, x2, y2,
            pix2, blend = blend_function[ self._blendMode ]
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
                blend(im, im2, (x + y)<<2, pix2, notSupportClamp);
            
            // next pixels
            start++;
            x++; if (x>=W1) { x = startX; y += w; }
            x2++; if (x2>=W2) { x2 = startX2; y2 += w2; }
        }
        return im; 
    }
});

}(FILTER);/**
*
* Drop Shadow Filter Plugin
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var IMG = FILTER.ImArray, integral_convolution = FILTER.Util.Filter.integral_convolution,
    boxKernel_3x3 = new FILTER.Array32F([
        1/9,1/9,1/9,
        1/9,1/9,1/9,
        1/9,1/9,1/9
    ])
;

// adapted from http://www.jhlabs.com/ip/filters/
// analogous to ActionScript filter
FILTER.Create({
     name: "DropShadowFilter"
    
    // parameters
    ,offsetX: null
    ,offsetY: null
    ,color: 0
    ,opacity: 1
    ,quality: 3
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    // constructor
    ,init: function( offsetX, offsetY, color, opacity, quality ) {
        var self = this;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        self.color = color || 0;
        self.opacity = null == opacity ? 1.0 : +opacity;
        self.quality = quality || 3;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.offsetX = null;
        self.offsetY = null;
        self.color = null;
        self.opacity = null;
        self.quality = null;
        self.$super('dispose');
        return self;
    }
    
    ,serialize: function( ) {
        var self = this;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 offsetX: self.offsetX
                ,offsetY: self.offsetY
                ,color: self.color
                ,opacity: self.opacity
                ,quality: self.quality
            }
        };
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            self.offsetX = params.offsetX;
            self.offsetY = params.offsetY;
            self.color = params.color;
            self.opacity = params.opacity;
            self.quality = params.quality;
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image*/) {
        var self = this;
        if ( !self._isOn ) return im;
        var color = self.color || 0, offX = self.offsetX||0, offY = (self.offsetY||0)*w,
            quality = ~~self.quality,
            a = ~~(255*self.opacity), r = (color >>> 16)&255,
            g = (color >>> 8)&255, b = (color)&255,
            imSize = im.length, imArea = imSize>>>2, i, x, y, sx, sy, si, shadow, ai, aa;
            
        if ( 0 > a ) a = 0;
        if ( 255 < a ) a = 255;
        if ( 0 === a ) return im;
        
        if ( 0 >= quality ) quality = 1;
        if ( 3 < quality ) quality = 3;
        
        shadow = new IMG(imSize);
        // generate shadow from image alpha channel
        for(i=0; i<imSize; i+=4)
        {
            ai = im[i+3];
            if ( ai > 0 )
            {
                shadow[i  ] = r;
                shadow[i+1] = g;
                shadow[i+2] = b;
                shadow[i+3] = 255;
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
        shadow = integral_convolution(true, shadow, w, h, boxKernel_3x3, null, 3, 3, 1.0, 0.0, quality);
        
        // offset and combine with original image
        for(x=0,y=0,si=0; si<imSize; si+=4,x++)
        {
            if ( x >= w ) {x=0; y+=w;}
            sx = x+offX; sy = y+offY;
            if ( 0 > sx || sx >= w || 0 > sy || sy >= imArea ) continue;
            i = (sx + sy) << 2; ai = im[i+3]; a = shadow[si+3];
            if ( /*0 === alpha ||*/ (255 === ai) || (0 === a) ) continue;
            a /= 255; ai /= 255; aa = ai + a*(1.0-ai);
            // src over composition
            // https://en.wikipedia.org/wiki/Alpha_compositing
            im[i  ] = (~~((im[i  ]*ai + shadow[si  ]*a*(1.0-ai))/aa))&255;
            im[i+1] = (~~((im[i+1]*ai + shadow[si+1]*a*(1.0-ai))/aa))&255;
            im[i+2] = (~~((im[i+2]*ai + shadow[si+2]*a*(1.0-ai))/aa))&255;
            //im[i+3] = ~~(aa*255);
            /*im[i  ] = (~~(im[i  ] + (shadow[si  ]-im[i  ])*a))&255;
            im[i+1] = (~~(im[i+1] + (shadow[si+1]-im[i+1])*a))&255;
            im[i+2] = (~~(im[i+2] + (shadow[si+2]-im[i+2])*a))&255;*/
        }
        
        // return image with shadow
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

var Sqrt = Math.sqrt, Exp = Math.exp, Log = Math.log, 
    Abs = Math.abs, Floor = Math.floor,
    notSupportClamp = FILTER._notSupportClamp, A32F = FILTER.Array32F;

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
    ,path: FILTER_PLUGINS_PATH
    
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
    ,path: FILTER_PLUGINS_PATH
    
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
            resize = FILTER.Interpolation.bilinear, IMG = FILTER.ImArray,
            //needed arrays
            diagonal, tile, mask, a1, a2, a3, d, i, j, k, 
            index, N, N2, size, imSize, sqrt = Math.sqrt;

        //find largest side of the image
        //and resize the image to become square
        if ( w !== h ) im = resize( im, w, h, N = w > h ? w : h, N );
        else  N = w; 
        N2 = Math.round(N/2);
        size = N*N; imSize = im.length;
        diagonal = new IMG(imSize);
        tile = new IMG(imSize);
        mask = new FILTER.Array8U(size);

        for (i=0,j=0,k=0; k<imSize; k+=4,i++)
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
        for (i=0,j=0; i<N2; j++)
        {
            if ( j >= N2 ) { j=0; i++; }
            switch(masktype)
            {
                case 0://RADIAL
                d = sqrt((i-N2)*(i-N2) + (j-N2)*(j-N2)) / N2;
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
                    d = sqrt((j-N)*(j-N) + (i-N)*(i-N)) / (1.13*N);

                else //if ( (N2-i)>=(N2-j) )
                    d = sqrt((i-N)*(i-N) + (j-N)*(j-N)) / (1.13*N);
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

        //Create the tile
        for (j=0,i=0; j<N; i++)
        {
            if ( i >= N ) {i=0; j++;}
            index = i+j*N;
            a1 = mask[index]; a2 = mask[(i+N2) % N + ((j+N2) % N)*N];
            a3 = a1+a2; a1 /= a3; a2 /= a3; index <<= 2;
            tile[index  ] = ~~(a1*im[index]   + a2*diagonal[index]);
            tile[index+1] = ~~(a1*im[index+1] + a2*diagonal[index+1]);
            tile[index+2] = ~~(a1*im[index+2] + a2*diagonal[index+2]);
            tile[index+3] = im[index+3];
        }

        //create the new tileable image
        //if it wasn't a square image, resize it back to the original scale
        if ( w !== h ) tile = resize( tile, N, N, w, h );

        // return the new image data
        return tile;
    }
});

}(FILTER);/**
*
* FloodFill, PatternFill Plugin(s)
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

var TypedArray = FILTER.TypedArray, abs = Math.abs,
    min = Math.min, max = Math.max, ceil = Math.ceil,
    TILE = FILTER.MODE.TILE, STRETCH = FILTER.MODE.STRETCH,
    Array8U = FILTER.Array8U, Array32U = FILTER.Array32U;
    
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
    
    ,path: FILTER_PLUGINS_PATH
    
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
            
            self.color = TypedArray( params.color, Array );
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
            l, i, x, x1, x2, yw, stack, slen, segment, notdone
        ;
        /*
         * Filled horizontal segment of scanline y for xl<=x<=xr.
         * Parent segment was on line y-dy.  dy=1 or -1
         */
        yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ||
            (im[x0+yw] === NC[0] && im[x0+yw+1] === NC[1] && im[x0+yw+2] === NC[2]) ) return im;
        
        // seed color is the image color at x0,y0 position
        OC = new Array8U(3);
        OC[0] = im[x0+yw]; OC[1] = im[x0+yw+1]; OC[2] = im[x0+yw+2];    
        stack = new Array(imSize>>>2); slen = 0; // pre-allocate and soft push/pop for speed
        if ( yw+dy >= ymin && yw+dy <= ymax ) stack[slen++]=[yw, x0, x0, dy]; /* needed in some cases */
        /*if ( yw >= ymin && yw <= ymax)*/ stack[slen++]=[yw+dy, x0, x0, -dy]; /* seed segment (popped 1st) */
        
        while ( slen > 0 ) 
        {
            /* pop segment off stack and fill a neighboring scan line */
            segment = stack[--slen];
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
                    im[i  ] = NC[0];
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
                i = x+yw;
                while ( x<=x2 && !(abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                {
                    x+=4;
                    i = x+yw;
                }
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+4;
                if ( l < x1 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax ) stack[slen++]=[yw, l, x1-4, -dy];  /* leak on left? */
                }
                x = x1+4;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                i = x+yw;
                while ( x<=xmax && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    im[i  ] = NC[0];
                    im[i+1] = NC[1];
                    im[i+2] = NC[2];
                    x+=4; i = x+yw;
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack[slen++]=[yw, l, x-4, dy];
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack[slen++]=[yw, x2+4, x-4, -dy];	/* leak on right? */
                }
                i = x+yw;
    /*skip:*/   while ( x<=x2 && !(abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) ) 
                {
                    x+=4;
                    i = x+yw;
                }
                l = x;
                notdone = (x <= x2);
            }
        }
        
        // return the new image data
        return im;
    }
});

FILTER.Create({
    name : "PatternFillFilter"
    ,x: 0
    ,y: 0
    ,offsetX: 0
    ,offsetY: 0
    ,tolerance: 0.0
    ,pattern: null
    ,_pattern: null
    ,mode: TILE // FILTER.MODE.TILE, FILTER.MODE.STRETCH
    
    ,path: FILTER_PLUGINS_PATH
    
    ,init: function( x, y, pattern, offsetX, offsetY, mode, tolerance ) {
        var self = this;
        self.x = x || 0;
        self.y = y || 0;
        self.offsetX = offsetX || 0;
        self.offsetY = offsetY || 0;
        if ( pattern ) self.setPattern( pattern );
        self.mode = mode || TILE;
        self.tolerance = tolerance || 0.0;
    }
    
    ,dispose: function( ) {
        var self = this;
        self.pattern = null;
        self._pattern = null;
        self.x = null;
        self.y = null;
        self.offsetX = null;
        self.offsetY = null;
        self.tolerance = null;
        self.mode = null;
        self.$super('dispose');
        return self;
    }
    
    ,setPattern: function( pattern ) {
        var self = this;
        if ( pattern )
        {
            self.pattern = pattern;
            self._pattern = null;
        }
        return self;
    }
    
    ,serialize: function( ) {
        var self = this, Pat = self.pattern;
        return {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 x: self.x
                ,y: self.y
                ,offsetX: self.offsetX
                ,offsetY: self.offsetY
                ,tolerance: self.tolerance
                ,mode: self.mode
                ,_pattern: self._pattern || (Pat ? { data: Pat.getData( ), width: Pat.width, height: Pat.height } : null)
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
            self.offsetX = params.offsetX;
            self.offsetY = params.offsetY;
            self.tolerance = params.tolerance;
            self.mode = params.mode;
            self.pattern = null;
            self._pattern = params._pattern;
            if ( self._pattern ) self._pattern.data = TypedArray( self._pattern.data, FILTER.ImArray );
        }
        return self;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h) {
        var self = this, Pat = self.pattern;
        
        if ( !self._isOn || !(Pat || self._pattern) ) return im;
        
        // seems to have issues when tol is exactly 1.0
        var _pat = self._pattern || { data: Pat.getData( ), width: Pat.width, height: Pat.height },
            tol = ~~(255*(self.tolerance>=1.0 ? 0.999 : self.tolerance)), mode = self.mode,
            OC, dy = w<<2, pattern = _pat.data, pw = _pat.width, ph = _pat.height, 
            x0 = self.x, y0 = self.y, px0 = self.offsetX||0, py0 = self.offsetY||0,
            imSize = im.length, size = imSize>>>2, ymin = 0, ymax = imSize-dy, xmin = 0, xmax = (w-1)<<2,
            l, i, x, y, x1, x2, yw, pi, px, py, stack, slen, visited, segment, notdone
        ;
        
        if ( 0 > px0 ) px0 += pw;
        if ( 0 > py0 ) py0 += ph;
        
        y = y0; yw = (y0*w)<<2; x0 <<= 2;
        if ( x0 < xmin || x0 > xmax || yw < ymin || yw > ymax ) return im;
        
        // seed color is the image color at x0,y0 position
        OC = new Array8U(3);
        OC[0] = im[x0+yw]; OC[1] = im[x0+yw+1]; OC[2] = im[x0+yw+2];    
        stack = new Array(size); slen = 0; // pre-allocate and soft push/pop for speed
        visited = new Array32U(ceil(size/32));
        if ( yw+dy >= ymin && yw+dy <= ymax ) stack[slen++]=[yw, x0, x0, dy, y+1]; /* needed in some cases */
        /*if ( yw >= ymin && yw <= ymax)*/ stack[slen++]=[yw+dy, x0, x0, -dy, y]; /* seed segment (popped 1st) */
        
        while ( slen > 0 ) 
        {
            /* pop segment off stack and fill a neighboring scan line */
            segment = stack[--slen];
            yw = segment[0]+(dy=segment[3]); x1 = segment[1]; x2 = segment[2];
            y = segment[4];
            
            /*
             * segment of scan line y-dy for x1<=x<=x2 was previously filled,
             * now explore adjacent pixels in scan line y
             */
            for (x=x1; x>=xmin; x-=4)
            {
                i = x+yw;
                if ( !(visited[i>>>7]&(1<<((i>>>2)&31))) && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    visited[i>>>7] |= 1<<((i>>>2)&31);
                    if ( STRETCH === mode )
                    {
                        px = ~~(pw*(x>>>2)/w);
                        py = ~~(ph*(y)/h);
                    }
                    else
                    {
                        px = ((x>>>2)+px0) % pw;
                        py = (y+py0) % ph;
                    }
                    pi = (px + py*pw) << 2;
                    im[i  ] = pattern[pi  ];
                    im[i+1] = pattern[pi+1];
                    im[i+2] = pattern[pi+2];
                }
                else
                {
                    break;
                }
            }
            if ( x >= x1 ) 
            {
                // goto skip:
                i = x+yw;
                while ( x<=x2 && !(!(visited[i>>>7]&(1<<((i>>>2)&31))) && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                {
                    x+=4;
                    i = x+yw;
                }
                l = x;
                notdone = (x <= x2);
            }
            else
            {
                l = x+4;
                if ( l < x1 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack[slen++]=[yw, l, x1-4, -dy, 0 < dy ? y-1 : y+1];  /* leak on left? */
                }
                x = x1+4;
                notdone = true;
            }
            
            while ( notdone ) 
            {
                i = x+yw;
                while ( x<=xmax && !(visited[i>>>7]&(1<<((i>>>2)&31))) && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol )
                {
                    visited[i>>>7] |= 1<<((i>>>2)&31);
                    if ( STRETCH === mode )
                    {
                        px = ~~(pw*(x>>>2)/w);
                        py = ~~(ph*(y)/h);
                    }
                    else
                    {
                        px = ((x>>>2)+px0) % pw;
                        py = (y+py0) % ph;
                    }
                    pi = (px + py*pw) << 2;
                    im[i  ] = pattern[pi  ];
                    im[i+1] = pattern[pi+1];
                    im[i+2] = pattern[pi+2];
                    x+=4; i = x+yw;
                }
                if ( yw+dy >= ymin && yw+dy <= ymax) stack[slen++]=[yw, l, x-4, dy, 0 < dy ? y+1 : y-1];
                if ( x > x2+4 ) 
                {
                    if ( yw-dy >= ymin && yw-dy <= ymax) stack[slen++]=[yw, x2+4, x-4, -dy, 0 < dy ? y-1 : y+1];	/* leak on right? */
                }
                i = x+yw;
    /*skip:*/   while ( x<=x2 && !(!(visited[i>>>7]&(1<<((i>>>2)&31))) && abs(OC[0]-im[i])<=tol && abs(OC[1]-im[i+1])<=tol && abs(OC[2]-im[i+2])<=tol) )
                {
                    x+=4;
                    i = x+yw;
                }
                l = x;
                notdone = (x <= x2);
            }
        }
        
        // return the new image data
        return im;
    }
});

}(FILTER);/**
*
* HSV Converter Plugin
* @package FILTER.js
*
**/
!function(FILTER){
"use strict";

//toCol = 0.70833333333333333333333333333333 // 255/360
var notSupportClamp = FILTER._notSupportClamp, RGB2HSV = FILTER.Color.RGB2HSV, subarray = FILTER.ArraySubArray;

// a plugin to convert an RGB Image to an HSV Image
FILTER.Create({
    name: "HSVConverterFilter"
    
    ,path: FILTER_PLUGINS_PATH
    
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
                hsv = RGB2HSV(subarray(im,i,i+3));
                t0 = hsv[0]*0.70833333333333333333333333333333; t2 = hsv[1]*255; t1 = hsv[2];
                // clamp them manually
                t0 = t0<0 ? 0 : (t0>255 ? 255 : t0);
                t1 = t1<0 ? 0 : (t1>255 ? 255 : t1);
                t2 = t2<0 ? 0 : (t2>255 ? 255 : t2);
                im[i] = ~~t0; im[i+1] = ~~t1; im[i+2] = ~~t2; 
            }
        }
        else
        {
            for (i=0; i<l; i+=4)
            {
                //r = im[i]; g = im[i+1]; b = im[i+2];
                hsv = RGB2HSV(subarray(im,i,i+3));
                t0 = hsv[0]*0.70833333333333333333333333333333; t2 = hsv[1]*255; t1 = hsv[2];
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

var notSupportClamp = FILTER._notSupportClamp, TypedArray = FILTER.TypedArray,
    RGBA2Color = FILTER.Color.RGBA2Color, Color2RGBA = FILTER.Color.Color2RGBA
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
    ,path: FILTER_PLUGINS_PATH
    
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
            
            self.thresholds = TypedArray( params.thresholds, Array );
            self.quantizedColors = TypedArray( params.quantizedColors, Array );
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
            color = j < cl ? colors[j] : 255;
            
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

var notSupportClamp = FILTER._notSupportClamp, TypedArray = FILTER.TypedArray,
    IMG = FILTER.ImArray, clamp = FILTER.Color.clampPixel,
    RGB2HSV = FILTER.Color.RGB2HSV, HSV2RGB = FILTER.Color.HSV2RGB, Color2RGBA = FILTER.Color.Color2RGBA
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
    ,path: FILTER_PLUGINS_PATH
    
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
            
            self.range = TypedArray( params.range, Array );
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
            hMin = self.range[0], hMax = self.range[self.range.length-1]
            ;
        
        background = Color2RGBA(self.background||0);
        br = background[0]; 
        bg = background[1]; 
        bb = background[2]; 
        ba = background[3];
        
        for (i=0; i<l; i+=4)
        {
            //r = im[i]; g = im[i+1]; b = im[i+2];
            hue = RGB2HSV(im.subarray(i,i+3))[0];
            
            if ( hue<hMin || hue>hMax ) 
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
    PI2 = FILTER.CONST.PI2, abs = Math.abs, exp = Math.exp,
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
        factor = (PI2 * /*kernelRadius * kernelRadius*/sigma2),
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
    
    ,path: FILTER_PLUGINS_PATH
    
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

var Array32F = FILTER.Array32F, Array8U = FILTER.Array8U,
    Abs = Math.abs, Max = Math.max, Min = Math.min, 
    Floor = Math.floor, Round = Math.round, Sqrt = Math.sqrt,
    TypedObj = FILTER.TypedObj, HAS = 'hasOwnProperty'
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
// references:
// 1. Viola, Jones 2001 http://www.cs.cmu.edu/~efros/courses/LBMV07/Papers/viola-cvpr-01.pdf
// 2. Lienhart et al 2002 http://www.lienhart.de/Prof._Dr._Rainer_Lienhart/Source_Code_files/ICIP2002.pdf
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
    ,_haarchanged: false
    
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
        self._haarchanged = !!self.haardata;
    }
    
    // support worker serialize/unserialize interface
    ,path: FILTER_PLUGINS_PATH
    
    ,dispose: function( ) {
        var self = this;
        self.objects = null;
        self.haardata = null;
        self.$super('dispose');
        return self;
    }
    
    ,haar: function( haardata ) {
        var self = this;
        self.haardata = haardata;
        self._haarchanged = true;
        return self;
    }
    
    ,params: function( params ) {
        var self = this;
        if ( params )
        {
        if ( params[HAS]('haardata') )
        {
            self.haardata = params.haardata;
            self._haarchanged = true;
        }
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
        var json = {
            filter: self.name
            ,_isOn: !!self._isOn
            
            ,params: {
                 //haardata: null
                 baseScale: self.baseScale
                ,scaleIncrement: self.scaleIncrement
                ,stepIncrement: self.stepIncrement
                ,minNeighbors: self.minNeighbors
                ,doCannyPruning: self.doCannyPruning
                ,cannyLow: self.cannyLow
                ,cannyHigh: self.cannyHigh
            }
        };
        // avoid unnecessary (large) data transfer
        if ( self._haarchanged )
        {
            json.params.haardata = TypedObj( self.haardata );
            self._haarchanged = false;
        }
        return json;
    }
    
    ,unserialize: function( json ) {
        var self = this, params;
        if ( json && self.name === json.filter )
        {
            self._isOn = !!json._isOn;
            
            params = json.params;
            
            if ( params[HAS]('haardata') ) self.haardata = TypedObj( params.haardata, 1 );
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
        return FILTER.isWorker ? TypedObj( this.objects ) : this.objects;
    }
    
    ,setMeta: function( meta ) {
        this.objects = "string" === typeof meta ? TypedObj( meta, 1 ) : meta;
        return this;
    }
    
    // this is the filter actual apply method routine
    ,apply: function(im, w, h/*, image, cache*/) {
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
            //,hid = 'haar-'+im.id
        ;
        
        //cache = cache || {};
        /*if ( !cache[hid] )
        {*/
            integral_image(im, w, h, 
                gray=new Array8U(imSize), 
                integral=new Array32F(imSize), 
                squares=new Array32F(imSize), 
                tilted=new Array32F(imSize)
            );
            /*cache[hid] = {
                gray: gray, 
                integral: integral, 
                squares: squares, 
                tilted: tilted,
                canny: null
            };
        }
        else
        {
            gray = cache[hid].gray;
            integral = cache[hid].integral;
            squares = cache[hid].squares;
            tilted = cache[hid].tilted;
        }*/
        if ( doCanny )
        {
            /*if ( !cache[hid].canny )
            {*/
                integral_canny(gray, w, h, 
                    canny=new Array32F(imSize)
                );
                /*cache[hid].canny = canny;
            }
            else
            {
                canny = cache[hid].canny;
            }*/
        }
        
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

}(FILTER);
/* main code ends here */
/* export the module */
return FILTER;
});
