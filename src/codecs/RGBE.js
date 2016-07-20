/**
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