/**
*
* Filter PNG Image Format CODEC
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

// @requires FILTER/util/zlib.js
// you may provide your own zlib implementation if needed by setting/overriding FILTER.Util.ZLib
//var zlib = FILTER.Util.ZLib;

var CodecUtil = FILTER.Util.Codec, readUInt16 = CodecUtil.readUInt16BE,
    readUInt32 = CodecUtil.readUInt32BE, readBytes = CodecUtil.readBytes;

// adapted from https://github.com/devongovett/png.js/
// and from https://github.com/lukeapage/pngjs
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
            chunkSize = readUInt32( self.data, self );
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
                    self.width = readUInt32( self.data, self );
                    self.height = readUInt32( self.data, self );
                    self.bits = self.data[self.pos++];
                    self.colorType = self.data[self.pos++];
                    self.compressionMethod = self.data[self.pos++];
                    self.filterMethod = self.data[self.pos++];
                    self.interlaceMethod = self.data[self.pos++];
                    break;
                case 'acTL':
                    self.animation = {
                        numFrames: readUInt32( self.data, self ),
                        numPlays: readUInt32( self.data, self ) || Infinity,
                        frames: []
                    };
                    break;
                case 'PLTE':
                    self.palette = readBytes(chunkSize, self.data, self);
                    break;
                case 'fcTL':
                    if (frame) 
                    {
                        self.animation.frames.push(frame);
                    }
                    self.pos += 4;
                    frame = {
                        width: readUInt32( self.data, self ),
                        height: readUInt32( self.data, self ),
                        xOffset: readUInt32( self.data, self ),
                        yOffset: readUInt32( self.data, self )
                    };
                    delayNum = readUInt16( self.data, self );
                    delayDen = readUInt16( self.data, self ) || 100;
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
                            self.transparency.indexed = readBytes(chunkSize, self.data, self);
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
                            self.transparency.grayscale = readBytes(chunkSize, self.data, self)[0];
                            break;
                        case 2:
                            self.transparency.rgb = readBytes(chunkSize, self.data, self);
                    }
                    break;
                case 'tEXt':
                    text = readBytes(chunkSize, self.data, self);
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
        data = FILTER.Util.ZLib.inflate( data );
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


var constants = {

  PNG_SIGNATURE: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],

  TYPE_IHDR: 0x49484452,
  TYPE_IEND: 0x49454e44,
  TYPE_IDAT: 0x49444154,
  TYPE_PLTE: 0x504c5445,
  TYPE_tRNS: 0x74524e53, // eslint-disable-line camelcase
  TYPE_gAMA: 0x67414d41, // eslint-disable-line camelcase

  // color-type bits
  COLORTYPE_GRAYSCALE: 0,
  COLORTYPE_PALETTE: 1,
  COLORTYPE_COLOR: 2,
  COLORTYPE_ALPHA: 4, // e.g. grayscale and alpha

  // color-type combinations
  COLORTYPE_PALETTE_COLOR: 3,
  COLORTYPE_COLOR_ALPHA: 6,

  COLORTYPE_TO_BPP_MAP: {
    0: 1,
    2: 3,
    3: 1,
    4: 2,
    6: 4
  },

  GAMMA_DIVISION: 100000
};

var crcTable = null;
function computeCRCTable( )
{
  if ( null === crcTable )
  {
  crcTable = new Int32Array(256);
  for (var i = 0; i < 256; i++) {
    var currentCrc = i;
    for (var j = 0; j < 8; j++) {
      if (currentCrc & 1) {
        currentCrc = 0xedb88320 ^ (currentCrc >>> 1);
      }
      else {
        currentCrc = currentCrc >>> 1;
      }
    }
    crcTable[i] = currentCrc;
  }
  }
}

function CrcStream( )
{
  this._crc = -1;
}
CrcStream.prototype.write = function( data ){
  if ( null === crcTable ) computeCRCTable( );
  for (var i = 0; i < data.length; i++) {
    this._crc = crcTable[(this._crc ^ data[i]) & 0xff] ^ (this._crc >>> 8);
  }
  return true;
};
CrcStream.prototype.crc32 = function( ){
  return this._crc ^ -1;
};
CrcStream.crc32 = function( buf ){
  if ( null === crcTable ) computeCRCTable( );
  var crc = -1;
  for (var i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ -1;
};

function bitPacker(data, width, height, options)
{
  var outHasAlpha = options.colorType === constants.COLORTYPE_COLOR_ALPHA;
  if (options.inputHasAlpha && outHasAlpha) {
    return data;
  }
  if (!options.inputHasAlpha && !outHasAlpha) {
    return data;
  }

  var outBpp = outHasAlpha ? 4 : 3;
  var outData = new Buffer(width * height * outBpp);
  var inBpp = options.inputHasAlpha ? 4 : 3;
  var inIndex = 0;
  var outIndex = 0;

  var bgColor = options.bgColor || {};
  if (bgColor.red === undefined) {
    bgColor.red = 255;
  }
  if (bgColor.green === undefined) {
    bgColor.green = 255;
  }
  if (bgColor.blue === undefined) {
    bgColor.blue = 255;
  }

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var red = data[inIndex];
      var green = data[inIndex + 1];
      var blue = data[inIndex + 2];

      var alpha;
      if (options.inputHasAlpha) {
        alpha = data[inIndex + 3];
        if (!outHasAlpha) {
          alpha /= 255;
          red = Math.min(Math.max(Math.round((1 - alpha) * bgColor.red + alpha * red), 0), 255);
          green = Math.min(Math.max(Math.round((1 - alpha) * bgColor.green + alpha * green), 0), 255);
          blue = Math.min(Math.max(Math.round((1 - alpha) * bgColor.blue + alpha * blue), 0), 255);
        }
      }
      else {
        alpha = 255;
      }

      outData[outIndex] = red;
      outData[outIndex + 1] = green;
      outData[outIndex + 2] = blue;
      if (outHasAlpha) {
        outData[outIndex + 3] = alpha;
      }

      inIndex += inBpp;
      outIndex += outBpp;
    }
  }

  return outData;
}

function paethPredictor(left, above, upLeft)
{

  var paeth = left + above - upLeft;
  var pLeft = Math.abs(paeth - left);
  var pAbove = Math.abs(paeth - above);
  var pUpLeft = Math.abs(paeth - upLeft);

  if (pLeft <= pAbove && pLeft <= pUpLeft) {
    return left;
  }
  if (pAbove <= pUpLeft) {
    return above;
  }
  return upLeft;
}

function filterNone(pxData, pxPos, byteWidth, rawData, rawPos) {
  pxData.copy(rawData, rawPos, pxPos, pxPos + byteWidth);
}

function filterSumNone(pxData, pxPos, byteWidth) {

  var sum = 0;
  var length = pxPos + byteWidth;

  for (var i = pxPos; i < length; i++) {
    sum += Math.abs(pxData[i]);
  }
  return sum;
}

function filterSub(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {

  for (var x = 0; x < byteWidth; x++) {

    var left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
    var val = pxData[pxPos + x] - left;

    rawData[rawPos + x] = val;
  }
}

function filterSumSub(pxData, pxPos, byteWidth, bpp) {

  var sum = 0;
  for (var x = 0; x < byteWidth; x++) {

    var left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
    var val = pxData[pxPos + x] - left;

    sum += Math.abs(val);
  }

  return sum;
}

function filterUp(pxData, pxPos, byteWidth, rawData, rawPos) {

  for (var x = 0; x < byteWidth; x++) {

    var up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
    var val = pxData[pxPos + x] - up;

    rawData[rawPos + x] = val;
  }
}

function filterSumUp(pxData, pxPos, byteWidth) {

  var sum = 0;
  var length = pxPos + byteWidth;
  for (var x = pxPos; x < length; x++) {

    var up = pxPos > 0 ? pxData[x - byteWidth] : 0;
    var val = pxData[x] - up;

    sum += Math.abs(val);
  }

  return sum;
}

function filterAvg(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {

  for (var x = 0; x < byteWidth; x++) {

    var left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
    var up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
    var val = pxData[pxPos + x] - ((left + up) >> 1);

    rawData[rawPos + x] = val;
  }
}

function filterSumAvg(pxData, pxPos, byteWidth, bpp) {

  var sum = 0;
  for (var x = 0; x < byteWidth; x++) {

    var left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
    var up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
    var val = pxData[pxPos + x] - ((left + up) >> 1);

    sum += Math.abs(val);
  }

  return sum;
}

function filterPaeth(pxData, pxPos, byteWidth, rawData, rawPos, bpp) {

  for (var x = 0; x < byteWidth; x++) {

    var left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
    var up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
    var upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
    var val = pxData[pxPos + x] - paethPredictor(left, up, upleft);

    rawData[rawPos + x] = val;
  }
}

function filterSumPaeth(pxData, pxPos, byteWidth, bpp) {
  var sum = 0;
  for (var x = 0; x < byteWidth; x++) {

    var left = x >= bpp ? pxData[pxPos + x - bpp] : 0;
    var up = pxPos > 0 ? pxData[pxPos + x - byteWidth] : 0;
    var upleft = pxPos > 0 && x >= bpp ? pxData[pxPos + x - (byteWidth + bpp)] : 0;
    var val = pxData[pxPos + x] - paethPredictor(left, up, upleft);

    sum += Math.abs(val);
  }

  return sum;
}

var filters = {
  0: filterNone,
  1: filterSub,
  2: filterUp,
  3: filterAvg,
  4: filterPaeth
};

var filterSums = {
  0: filterSumNone,
  1: filterSumSub,
  2: filterSumUp,
  3: filterSumAvg,
  4: filterSumPaeth
};

function filter(pxData, width, height, options, bpp)
{
  var filterTypes;
  if (!('filterType' in options) || options.filterType === -1) {
    filterTypes = [0, 1, 2, 3, 4];
  }
  else if (typeof options.filterType === 'number') {
    filterTypes = [options.filterType];
  }
  else {
    throw new Error('unrecognised filter types');
  }

  var byteWidth = width * bpp;
  var rawPos = 0;
  var pxPos = 0;
  var rawData = new Buffer((byteWidth + 1) * height);
  var sel = filterTypes[0];

  for (var y = 0; y < height; y++) {

    if (filterTypes.length > 1) {
      // find best filter for this line (with lowest sum of values)
      var min = Infinity;

      for (var i = 0; i < filterTypes.length; i++) {
        var sum = filterSums[filterTypes[i]](pxData, pxPos, byteWidth, bpp);
        if (sum < min) {
          sel = filterTypes[i];
          min = sum;
        }
      }
    }

    rawData[rawPos] = sel;
    rawPos++;
    filters[sel](pxData, pxPos, byteWidth, rawData, rawPos, bpp);
    rawPos += byteWidth;
    pxPos += byteWidth;
  }
  return rawData;
}

var Packer = function(options) {
  this._options = options;

  options.deflateChunkSize = options.deflateChunkSize || 32 * 1024;
  options.deflateLevel = options.deflateLevel != null ? options.deflateLevel : 9;
  options.deflateStrategy = options.deflateStrategy != null ? options.deflateStrategy : 3;
  options.inputHasAlpha = options.inputHasAlpha != null ? options.inputHasAlpha : true;
  //options.deflateFactory = options.deflateFactory || FILTER.Util.ZLib.createDeflate;
  options.bitDepth = options.bitDepth || 8;
  options.colorType = (typeof options.colorType === 'number') ? options.colorType : constants.COLORTYPE_COLOR_ALPHA;

  if (options.colorType !== constants.COLORTYPE_COLOR && options.colorType !== constants.COLORTYPE_COLOR_ALPHA) {
    throw new Error('option color type:' + options.colorType + ' is not supported at present');
  }
  if (options.bitDepth !== 8) {
    throw new Error('option bit depth:' + options.bitDepth + ' is not supported at present');
  }
};

Packer.prototype.getDeflateOptions = function() {
  return {
    chunkSize: this._options.deflateChunkSize,
    level: this._options.deflateLevel,
    strategy: this._options.deflateStrategy
  };
};

Packer.prototype.createDeflate = function() {
  return this._options.deflateFactory(this.getDeflateOptions());
};

Packer.prototype.filterData = function(data, width, height) {
  // convert to correct format for filtering (e.g. right bpp and bit depth)
  var packedData = bitPacker(data, width, height, this._options);

  // filter pixel data
  var bpp = constants.COLORTYPE_TO_BPP_MAP[this._options.colorType];
  var filteredData = filter(packedData, width, height, this._options, bpp);
  return filteredData;
};

Packer.prototype._packChunk = function(type, data) {

  var len = (data ? data.length : 0);
  var buf = new Buffer(len + 12);

  buf.writeUInt32BE(len, 0);
  buf.writeUInt32BE(type, 4);

  if (data) {
    data.copy(buf, 8);
  }

  buf.writeInt32BE(CrcStream.crc32(buf.slice(4, buf.length - 4)), buf.length - 4);
  return buf;
};

Packer.prototype.packGAMA = function(gamma) {
  var buf = new Buffer(4);
  buf.writeUInt32BE(Math.floor(gamma * constants.GAMMA_DIVISION), 0);
  return this._packChunk(constants.TYPE_gAMA, buf);
};

Packer.prototype.packIHDR = function(width, height) {

  var buf = new Buffer(13);
  buf.writeUInt32BE(width, 0);
  buf.writeUInt32BE(height, 4);
  buf[8] = this._options.bitDepth;  // Bit depth
  buf[9] = this._options.colorType; // colorType
  buf[10] = 0; // compression
  buf[11] = 0; // filter
  buf[12] = 0; // interlace

  return this._packChunk(constants.TYPE_IHDR, buf);
};

Packer.prototype.packIDAT = function(data) {
  return this._packChunk(constants.TYPE_IDAT, data);
};

Packer.prototype.packIEND = function() {
  return this._packChunk(constants.TYPE_IEND, null);
};

FILTER.Codec.PNG = {

    encoder: function( imgData, metaData ) {
        metaData = metaData || {};
        //var quality = 'undefined' === typeof metaData.quality ? 100 : metaData.quality;
        var packer = new Packer(metaData);
        var chunks = [];
        
        // Signature
        chunks.push(new Buffer(constants.PNG_SIGNATURE));
        
        // Header
        chunks.push(packer.packIHDR(imgData.width, imgData.height));
        if (metaData.gamma) chunks.push(packer.packGAMA(metaData.gamma));

        var filteredData = packer.filterData(imgData.data, imgData.width, imgData.height);

        // compress it
        var deflateOpts = packer.getDeflateOptions();
        var compressedData = FILTER.Util.ZLib.deflate(filteredData, deflateOpts.level, deflateOpts.chuckSize);
        filteredData = null;

        if (!compressedData || !compressedData.length) throw new Error('bad png - invalid compressed data response');
        chunks.push(packer.packIDAT(new Buffer(compressedData)));

        // End
        chunks.push(packer.packIEND());
        
        return Buffer.concat(chunks);
    },
    
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
}(FILTER);