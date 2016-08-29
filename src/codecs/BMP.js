/**
*
* Filter BMP Image Format CODEC
* @package FILTER.js
*
**/
!function(FILTER, undef){
"use strict";

var CodecUtil = FILTER.Util.Codec, readUInt8 = CodecUtil.readUInt8, readUInt16LE = CodecUtil.readUInt16LE,
    readUInt32LE = CodecUtil.readUInt32LE, write = CodecUtil.write, writeUInt8 = CodecUtil.writeUInt8,
    writeUInt16LE = CodecUtil.writeUInt16LE, writeUInt32LE = CodecUtil.writeUInt32LE, fill = CodecUtil.fill;

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
    
    parseHeader: function( ) {
        var self = this, buf = self.buffer;
        self.fileSize = readUInt32LE( buf, self );
        self.reserved = readUInt32LE( buf, self );
        self.offset = readUInt32LE( buf, self );
        self.headerSize = readUInt32LE( buf, self );
        self.width = readUInt32LE( buf, self );
        self.height = readUInt32LE( buf, self );
        self.planes = readUInt16LE( buf, self );
        self.bitPP = readUInt16LE( buf, self );
        self.compress = readUInt32LE( buf, self );
        self.rawSize = readUInt32LE( buf, self );
        self.hr = readUInt32LE( buf, self );
        self.vr = readUInt32LE( buf, self );
        self.colors = readUInt32LE( buf, self );
        self.importantColors = readUInt32LE( buf, self );

        if ( self.bitPP < 24 ) 
        {
            var len = self.colors === 0 ? 1 << self.bitPP : self.colors;
            self.palette = new Array(len);
            for (var i = 0; i < len; i++) 
            {
                var blue = readUInt8( buf, self );
                var green = readUInt8( buf, self );
                var red = readUInt8( buf, self );
                var quad = readUInt8( buf, self );
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
        var self = this, buf = self.buffer, palette = self.palette, w = self.width, h = self.height,
            xlen = Math.ceil(w / 8), mode = xlen&3,
            y, x, b, location, i, rgb;
        for (y = h - 1; y >= 0; y--) 
        {
            for (x = 0; x < xlen; x++) 
            {
                b = readUInt8( buf, self );
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
        var self = this, buf = self.buffer, palette = self.palette, w = self.width, h = self.height,
            xlen = Math.ceil(w / 2), mode = xlen&3,
            y, x, b, location, before, after, rgb;
        for (y = h - 1; y >= 0; y--) 
        {
            for (x = 0; x < xlen; x++) 
            {
                b = readUInt8( buf, self );
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
        var self = this, buf = self.buffer, palette = self.palette, w = self.width, h = self.height,
            mode = w&3, y, x, b, location, rgb;
        for (y = h - 1; y >= 0; y--) 
        {
            for (x = 0; x < w; x++) 
            {
                b = readUInt8( buf, self );
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
        var self = this, buf = self.buffer, palette = self.palette, w = self.width, h = self.height,
            mode = w&3, y, x, location, blue, green, red;
        //when height > 0
        for (y = h - 1; y >= 0; y--) 
        {
            for (x = 0; x < w; x++) 
            {
                blue = readUInt8( buf, self );
                green = readUInt8( buf, self );
                red = readUInt8( buf, self );
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
    self.extraBytes = self.width&3/*%4*/;
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
    
    encode: function( ) {
        var self = this, w = self.width, h = self.height, 
            header = [], buffer = new Array( self.offset+self.rgbSize );
        write( header, self.flag );
        writeUInt32LE( header, self.fileSize );
        writeUInt32LE( header, self.reserved );
        writeUInt32LE( header, self.offset );

        writeUInt32LE( header, self.headerInfoSize );
        writeUInt32LE( header, w );
        writeUInt32LE( header, h );
        writeUInt16LE( header, self.planes );
        writeUInt16LE( header, self.bitPP );
        writeUInt32LE( header, self.compress );
        writeUInt32LE( header, self.rgbSize );
        writeUInt32LE( header, self.hr );
        writeUInt32LE( header, self.vr );
        writeUInt32LE( header, self.colors );
        writeUInt32LE( header, self.importantColors );

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
                fill( buffer, 0, fillOffset, fillOffset+self.extraBytes );
            }
        }
        return new Uint8Array( header.concat( buffer ) );
    }
};

FILTER.Codec.BMP = {

    encoder: function( imgData, metaData ) {
        var quality = 'undefined' === typeof metaData.quality ? 100 : metaData.quality;
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

}(FILTER);