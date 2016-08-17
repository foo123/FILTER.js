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
    parallel = !!parse_args().options['parallel'],
    edge_detector = F.CompositeFilter([
        F.ColorMatrixFilter().grayscale(),
        F.HistogramEqualizeFilter(F.MODE.GRAY),
        F.CannyEdgesFilter()
    ]);

console.log('Detection runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if ( parallel ) edge_detector.worker( true );
console.log('Loading image..');
F.IO.BinaryReader( F.Codec.JPG.decoder ).load(path.join(__dirname,'./che.jpg'), function( che ){
    console.log('./che.jpg' + ' loaded with dims: ' + che.width + ',' + che.height);
    console.log('Detecting..');
    edge_detector.apply( che, function( ){
        if ( parallel ) edge_detector.worker( false );
        console.log('Detection completed');
        F.IO.BinaryWriter( F.Codec.JPG.encoder ).write(path.join(__dirname,'./che_edges.jpg'), che,
        function( file ){
            console.log('image saved to: ' + './che_edges.jpg');
        }, function( err ){
            console.log('error while saving image: ' + err);
        });
    });
});