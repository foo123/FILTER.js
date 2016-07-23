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
    radial = !!parse_args().options['radial'], gradient
;

console.log('Generating '+(radial?'radial':'linear')+' gradient..');
gradient = radial
? F.Image.RadialGradient(
    200, 200, /* width,height */
    [[255,0,0,255],[0,255,0,255],[0,0,255,255]], /* colors rgba */
    [0, 0.2, 1], /* color stops, leave empty/null for uniform stops */
    100, 100, /* centerX,centerY, default 0,0 */
    0.5, 1 /* radiusX,radiusY, default 1,1 */
)
: F.Image.Gradient(
    200, 200, /* width,height */
    [[255,0,0,255],[0,255,0,255],[0,0,255,255]], /* colors rgba */
    [0, 0.7, 1], /* color stops, leave empty/null for uniform stops */
    -Math.PI/4 /* angle 0 - 2Math.PI, default 0 */
);
console.log('Saving gradient..');
F.IO.BinaryWriter( F.Codec.JPG.encoder ).write(path.join(__dirname,'./gradient.jpg'), gradient,
function( file ){
    console.log('gradient image saved to: ' + './gradient.jpg');
}, function( err ){
    console.log('error while saving image: ' + err);
});
