"use strict";

function parse_args( args ) 
{
    var 
        Flags = {}, Options = {},  Params = [],
        optionname = '',  argumentforoption = false,
        arg, index, i, len, i0
    ;
    
    if ( args )
    {
        i0 = 0;
    }
    else
    {
        args = process.argv;
        // remove firt 2 args ('node' and 'this filename')
        //args = args.slice(2);
        i0 = 2;
    }
    
    for (i=i0,len=args.length; i<len; ++i) 
    {
        arg = args[i];
        if (arg.length > 1 && '-' == arg[0] && '-' != arg[1])
        {
            arg.slice(1).split('').forEach(function(c){
                Flags[c] = true;
            });
            argumentforoption = false;
        }
        /*/^--/.test(arg)*/
        else if (/^--/.test(arg))
        {
            index = arg.indexOf('=');
            if (~index)
            {
                optionname = arg.slice(2, index);
                Options[optionname] = arg.slice(index + 1);
                argumentforoption = false;
            }
            else
            {
                optionname = arg.slice(2);
                Options[optionname] = true;
                argumentforoption = true;
            }
        } 
        else 
        {
            if (argumentforoption)
            {
                Options[optionname] = arg;
            }
            else
            {
                Params.push(arg);
            }
            argumentforoption = false;
        }
    }
    
    return {flags: Flags, options: Options, params: Params};
}


var path = require('path'), F = require('../../build/filter.bundle'),
    parallel = !!parse_args().options['parallel'];

console.log('Test runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
var grayscale = new F.ColorMatrixFilter( ).grayscale( ).contrast( 1 );
if ( parallel ) grayscale.worker( true );
console.log('Loading image..');
F.IO.BinaryReader( F.Codec.JPG.decoder ).load(path.join(__dirname,'./che.jpg'), function( che ){
    console.log('./che.jpg' + ' loaded with dims: ' + che.width + ',' + che.height);
    console.log('Applying grayscale filter..');
    grayscale.apply( che, function( ){
        if ( parallel ) grayscale.worker( false );
        console.log('Saving grayscaled image..');
        F.IO.BinaryWriter( F.Codec.JPG.encoder ).write(path.join(__dirname,'./che_grayscale.jpg'), che,
        function( file ){
            console.log('grayscale image saved to: ' + './che_grayscale.jpg');
        }, function( err ){
            console.log('error while saving image: ' + err);
        });
    });
});