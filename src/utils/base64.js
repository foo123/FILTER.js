/**
*
* Filter Utils, utf8 / base64
* @package FILTER.js
*
**/
!function(FILTER, undef){
@@USE_STRICT@@

var a2b_re = /[^A-Za-z0-9\+\/\=]/g, hex_re = /\x0d\x0a/g;

FILTER.Utf8 = {
    encode: function( string ) {
        string = string.replace(hex_re, "\x0a");
        var output = '', n, l, c, CC = String.fromCharCode;
        for (n=0,l=string.length; n<l; n++)
        {
            c = string.charCodeAt(n);
            if ( c < 128 )
                output += CC(c);
            else if ( (c > 127) && (c < 2048) )
                output += CC((c >> 6) | 192) + CC((c & 63) | 128);
            else
                output += CC((c >> 12) | 224) + CC(((c >> 6) & 63) | 128) + CC((c & 63) | 128);
        }
        return output;
    },
    decode: function( input ) {
        var string = '', i = 0, c = c1 = c2 = 0, l = input.length, CC = String.fromCharCode;
        while (i < l)
        {
            c = input.charCodeAt(i);
            if ( c < 128 )
            {
                string += CC(c);
                i++;
            }
            else if ( (c > 191) && (c < 224) )
            {
                c2 = input.charCodeAt(i+1);
                string += CC(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else
            {
                c2 = input.charCodeAt(i+1);
                c3 = input.charCodeAt(i+2);
                string += CC(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
};
    
FILTER.Base64: {
    encode: function( input ) {
        input = FILTER.Utf8.encode( input );
        var output = '', chr1, chr2, chr3,
            enc1, enc2, enc3, enc4, i = 0, l = input.length,
            keyString = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        while ( i < l )
        {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if ( isNaN(chr2) )
            {
                enc3 = enc4 = 64;
            }
            else if ( isNaN(chr3) )
            {
                enc4 = 64;
            }
            output = output + keyString.charAt(enc1) + keyString.charAt(enc2) + keyString.charAt(enc3) + keyString.charAt(enc4);
        }
        return output;
    },
    decode: function( input ) {
        input = input.replace(a2b_re, '');
        var output = '', chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0, l = input.length, CC = String.fromCharCode;
        while ( i < l )
        {
            enc1 = keyString.indexOf(input.charAt(i++));
            enc2 = keyString.indexOf(input.charAt(i++));
            enc3 = keyString.indexOf(input.charAt(i++));
            enc4 = keyString.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + CC(chr1);
            if ( 64 != enc3 )
            {
                output += CC(chr2);
            }
            if ( 64 != enc4 )
            {
                output += CC(chr3);
            }
        }
        output = FILTER.Utf8.decode( output );
        return output;
    }
};

}(FILTER);