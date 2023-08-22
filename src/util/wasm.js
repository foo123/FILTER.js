/**
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
                if (FILTER.Array32F === struct[field].type || FILTER.Array16I === struct[field].type || FILTER.Array8U === struct[field].type || FILTER.ImArray === struct[field].type)
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
        return WebAssembly.instantiate(module, imports);
    })
    .then(function(wasm) {
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
        FILTER.Util.Image.wasm = {
            interpolate: wasm.interpolate_bilinear
        };
        FILTER.Util.Filter.wasm = {
            integral_convolution: wasm.integral_convolution,
            separable_convolution: wasm.separable_convolution,
            histogram: wasm.histogram
        };
        FILTER.unwaitFor(1);
    });
}
}(FILTER);