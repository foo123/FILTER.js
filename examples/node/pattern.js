"use strict";

var parse_args = require('./commargs.js'),
    path = require('path'),
    F = require('../../build/filter.bundle.js'),
    pattern1 = F.Image.PerlinNoise(
        140 /* width */, 140 /* height */,
        0,
        false/* seamless pattern */,
        true/* grayscale */,
        80/* baseX */, 50/* baseY */,
        4/* num octaves */,
        [[0,0],[10,10],[20,10],[10,20]] /* octave offsets */
    ),
    pattern2 = F.Image.PerlinNoise(
        140 /* width */, 140 /* height */,
        0,
        true/* seamless pattern */,
        false/* grayscale */,
        80/* baseX */, 50/* baseY */,
        4/* num octaves */,
        [[0,0],[10,10],[20,10],[10,20]] /* octave offsets */
    ),
    patternFill = new F.CompositeFilter([
        new F.PatternFillFilter(25/* x0 */,75/* y0 */,pattern2, 0,0, F.MODE.STRETCH, 0.5/* tolerance */),
        new F.PatternFillFilter(75/* x0 */,112/* y0 */,pattern2, 0,0, F.MODE.TILE, 0.5/* tolerance */),
        new F.PatternFillFilter(125/* x0 */,75/* y0 */,pattern1, 0,0, F.MODE.STRETCH, 0.5/* tolerance */),
        new F.PatternFillFilter(75/* x0 */,36/* y0 */,pattern1, 0,0, F.MODE.TILE, 0.5/* tolerance */)
    ]),
    binaryManager = F.IO.BinaryManager( F.Codec.PNG )
;

binaryManager.read( path.join(__dirname,'./yin_yang_blank.png'), function( yin_yang ){
    console.log('Applying filter..');
    patternFill.apply( yin_yang, function( ){
        //patternFill.worker( false );
        console.log('Saving image..');
        binaryManager.write( path.join(__dirname,'./yin_yang_pattern.png'), yin_yang,
        function( file ){
            console.log('image saved to: ' + './yin_yang_pattern.png');
        }, function( err ){
            console.log('error while saving image: ' + err);
        });
    });
});

