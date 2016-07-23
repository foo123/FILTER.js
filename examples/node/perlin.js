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
    perlin
;

console.log('Generating perlin noise..');
perlin = F.Image.PerlinNoise(
    200 /* width */, 200 /* height */,
    false/* seamless pattern */,
    true/* grayscale */,
    80/* baseX */, 50/* baseY */,
    4/* num octaves */,
    [[0,0],[10,10],[20,10],[10,20]] /* octave offsets */
);
console.log('Saving perlin noise..');
F.IO.BinaryWriter( F.Codec.JPG.encoder ).write(path.join(__dirname,'./perlin.jpg'), perlin,
function( file ){
    console.log('perlin noise saved to: ' + './perlin.jpg');
}, function( err ){
    console.log('error while saving image: ' + err);
});
