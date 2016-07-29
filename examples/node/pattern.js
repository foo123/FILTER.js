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
    pattern1 = F.Image.PerlinNoise(
        100 /* width */, 100 /* height */,
        0,
        false/* seamless pattern */,
        true/* grayscale */,
        80/* baseX */, 50/* baseY */,
        4/* num octaves */,
        [[0,0],[10,10],[20,10],[10,20]] /* octave offsets */
    ),
    pattern2 = F.Image.PerlinNoise(
        100 /* width */, 100 /* height */,
        0,
        true/* seamless pattern */,
        false/* grayscale */,
        80/* baseX */, 50/* baseY */,
        4/* num octaves */,
        [[0,0],[10,10],[20,10],[10,20]] /* octave offsets */
    ),
    patternFill = new F.CompositeFilter([
        new F.PatternFillFilter(25/* x0 */,75/* y0 */,pattern2, 0,0, F.MODE.STRETCH, 0.8/* tolerance */),
        new F.PatternFillFilter(75/* x0 */,112/* y0 */,pattern2, 0,0, F.MODE.STRETCH, 0.8/* tolerance */),
        new F.PatternFillFilter(125/* x0 */,75/* y0 */,pattern1, 0,0, F.MODE.STRETCH, 0.8/* tolerance */),
        new F.PatternFillFilter(75/* x0 */,36/* y0 */,pattern1, 0,0, F.MODE.STRETCH, 0.8/* tolerance */)
    ])
;

F.IO.BinaryReader( F.Codec.JPG.decoder ).load(path.join(__dirname,'./yin_yang_blank.jpg'), function( yin_yang ){
    console.log('Applying filter..');
    patternFill.apply( yin_yang, function( ){
        //patternFill.worker( false );
        console.log('Saving image..');
        F.IO.BinaryWriter( F.Codec.JPG.encoder ).write(path.join(__dirname,'./yin_yang_pattern.jpg'), yin_yang,
        function( file ){
            console.log('image saved to: ' + './yin_yang_pattern.jpg');
        }, function( err ){
            console.log('error while saving image: ' + err);
        });
    });
});

