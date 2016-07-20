/**
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

}(FILTER);