/**
*
* Filter BMP Image Format CODEC
* @package FILTER.js
*
**/
!function(FILTER, undef){
@@USE_STRICT@@

// adapted from https://github.com/devongovett/bmp.js
/*
# MIT LICENSE
# Copyright (c) 2011 Devon Govett
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy of this 
# software and associated documentation files (the "Software"), to deal in the Software 
# without restriction, including without limitation the rights to use, copy, modify, merge, 
# publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
# to whom the Software is furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all copies or 
# substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
# BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
# DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function BMP(data) {
  var fileSize, headerLength, i, magic, offset;
  this.data = data;
  this.pos = 0;
  magic = ((function() {
    var _results;
    _results = [];
    for (i = 0; i < 2; i++) {
      _results.push(String.fromCharCode(this.data[this.pos++]));
    }
    return _results;
  }).call(this)).join('');
  if (magic !== 'BM') {
    throw 'Invalid BMP file.';
  }
  fileSize = this.readUInt32();
  this.pos += 4;
  offset = this.readUInt32();
  headerLength = this.readUInt32();
  this.width = this.readUInt32();
  this.height = this.readUInt32();
  this.colorPlaneCount = this.readUInt16();
  this.bitsPerPixel = this.readUInt16();
  this.compressionMethod = this.readUInt32();
  this.rawSize = this.readUInt32();
  this.hResolution = this.readUInt32();
  this.vResolution = this.readUInt32();
  this.paletteColors = this.readUInt32();
  this.importantColors = this.readUInt32();
}
BMP.prototype.readUInt16 = function() {
  var b1, b2;
  b1 = this.data[this.pos++];
  b2 = this.data[this.pos++] << 8;
  return b1 | b2;
};
BMP.prototype.readUInt32 = function() {
  var b1, b2, b3, b4;
  b1 = this.data[this.pos++];
  b2 = this.data[this.pos++] << 8;
  b3 = this.data[this.pos++] << 16;
  b4 = this.data[this.pos++] << 24;
  return b1 | b2 | b3 | b4;
};
BMP.prototype.copyToImageData = function(imageData) {
  var b, data, g, i, r, w, x, y, _ref;
  data = imageData.data;
  w = this.width;
  for (y = _ref = this.height - 1; _ref <= 0 ? y < 0 : y > 0; _ref <= 0 ? y++ : y--) {
    for (x = 0; 0 <= w ? x < w : x > w; 0 <= w ? x++ : x--) {
      i = (x + y * w) * 4;
      b = this.data[this.pos++];
      g = this.data[this.pos++];
      r = this.data[this.pos++];
      data[i++] = r;
      data[i++] = g;
      data[i++] = b;
      data[i++] = 255;
    }
  }
};

FILTER.Codec.BMP = {

    encoder: FILTER.NotImplemented('BMP.encoder'),
    
    decoder: function( buffer, metaData ) {
        var bmp = new BMP( new Uint8Array( buffer ) );
        var data = {
            width: bmp.width,
            height: bmp.height,
            data: new Uint8Array(bmp.width * bmp.height * 4)
        };
        bmp.copyToImageData( data );
        return data;
    }
};

}(FILTER);