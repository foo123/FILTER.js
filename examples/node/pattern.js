"use strict";

var parse_args = require('./commargs.js'),
    path = require('path'),
    F = require('../../build/filter.bundle.js'),
    pattern1 = F.Image.PerlinNoise(
        80 /* width */, 120 /* height */,
        0,
        true/* seamless pattern */,
        true/* grayscale */,
        40/* baseX */, 20/* baseY */,
        4/* num octaves */,
        [[0,0],[10,10],[20,10],[10,20]] /* octave offsets */
    ),
    pattern2 = F.Image.PerlinNoise(
        140 /* width */, 140 /* height */,
        0,
        true/* seamless pattern */,
        false/* grayscale */,
        70/* baseX */, 35/* baseY */,
        4/* num octaves */,
        [[0,0],[10,10],[20,10],[10,20]] /* octave offsets */
    ),
    patternFill = F.CompositeFilter([
        /*                  x0, y0, pattern, patX0,patY0,tolerance,exterior border */
        F.PatternFillFilter(25, 75,  pattern2, 0,    0,   0.5,      0x0).setMode(F.MODE.STRETCH),
        F.PatternFillFilter(75, 112, pattern2, 0,    0,   0.5,      0x0).setMode(F.MODE.TILE),
        F.PatternFillFilter(125,75,  pattern1, 0,    0,   0.5          ).setMode(F.MODE.TILE),
        F.PatternFillFilter(75, 36,  pattern1, 0,    0,   0.5          ).setMode(F.MODE.STRETCH)
    ]),
    binaryManager = F.IO.BinaryManager( F.Codec.PNG, {deflateLevel: 9} )
;

binaryManager.read( path.join(__dirname,'./yin_yang_blank.png'), function( yin_yang ){
    console.log('Applying filter..');
    patternFill.apply( yin_yang, function( ){
        console.log('Saving image..');
        binaryManager.write( path.join(__dirname,'./yin_yang_pattern.png'), yin_yang,
        function( file ){
            console.log('image saved to: ' + './yin_yang_pattern.png');
        }, function( err ){
            console.log('error while saving image: ' + err);
        });
    });
});

