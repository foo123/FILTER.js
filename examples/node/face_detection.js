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
    haarcascade_frontalface_alt = require('./haarcascade_frontalface_alt.js'),
    face_detector = F.CompositeFilter([
        F.ColorMatrixFilter().grayscale(),
        F.HaarDetectorFilter(haarcascade_frontalface_alt)
    ]);

console.log('Detection runs "' + (parallel ? 'parallel' : 'synchronous') + '"');
if ( parallel ) face_detector.worker( true );
console.log('Loading image..');
F.IO.BinaryReader( F.Codec.JPG.decoder ).load(path.join(__dirname,'./che.jpg'), function( che ){
    console.log('./che.jpg' + ' loaded with dims: ' + che.width + ',' + che.height);
    console.log('Detecting..');
    face_detector.apply( che, function( ){
        if ( parallel ) face_detector.worker( false );
        console.log('Detection completed');
        var features = face_detector.filter(1).metaData().objects;
        console.log(features.length + (1 === features.length ? ' feature was found' : ' features were found'));
        if ( features.length )
        {
            console.log('1st feature is found at x1:' + features[0].x1 + ',y1:' + features[0].y1 + ',x2:' + features[0].x2 + ',y2:' + features[0].y2);
        }
    });
});