/**
*
*   FILTER.js Codecs
*   @version: @@VERSION@@
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (File Codecs)
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
*   @version: @@VERSION@@
*   @dependencies: Filter.js
*
*   JavaScript Image Processing Library (File Codecs)
*   https://github.com/foo123/FILTER.js
*
**/

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

FILTER.Utils.DecodeStream = DecodeStream;
FILTER.Utils.FlateStream = FlateStream;

}(FILTER);/**
*
* Filter PNG Image Format CODEC
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// adapted from https://github.com/devongovett/png.js/
// @requires FILTER/utils/zlib.js
function FlateStream( data )
{
    return new FILTER.Utils.FlateStream( data );
}

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
    animation: null,
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
        var data = encoder.encode( imgData );
        return data;
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
        return new BmpEncoder( imgData ).encode( );
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
        return new Uint8Array( buffer );
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