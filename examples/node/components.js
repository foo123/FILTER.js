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

var path = require('path'), F = require('../../build/filter.bundle.js'),
    connected_components = new F.ConnectedComponentsFilter();

F.IO.BinaryReader( F.Codec.GIF.decoder ).load(path.join(__dirname,'./snoopy.gif'), function( snoopy ){
    console.log('./snoopy.gif' + ' loaded with dims: ' + snoopy.width + ',' + snoopy.height);
    console.log('Finding connected components..');
    connected_components.apply( snoopy, function( ){
        console.log('Saving connected components image..');
        F.IO.BinaryWriter( F.Codec.JPG.encoder ).write(path.join(__dirname,'./snoopy_components.jpg'), snoopy,
        function( file ){
            console.log('image saved to: ' + './snoopy_components.jpg');
        }, function( err ){
            console.log('error while saving image: ' + err);
        });
    });
});