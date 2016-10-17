"use strict";

var path = require('path'),
    parse_args = require('../commargs.js'),
    F = require('../../../build/filter.bundle.js'),
    args = parse_args(),
    type = 'hor',//(args.options['type'] || 'hor').toLowerCase(),
    width = 300,//parseInt(args.options['width']||'100', 10),
    height = 521,//parseInt(args.options['height']||'100', 10),
    imgs = [
    path.join(__dirname,'./CapGuyWalk0001.png'),
    path.join(__dirname,'./CapGuyWalk0002.png'),
    path.join(__dirname,'./CapGuyWalk0003.png'),
    path.join(__dirname,'./CapGuyWalk0004.png'),
    path.join(__dirname,'./CapGuyWalk0005.png'),
    path.join(__dirname,'./CapGuyWalk0006.png'),
    path.join(__dirname,'./CapGuyWalk0007.png'),
    path.join(__dirname,'./CapGuyWalk0008.png'),
    path.join(__dirname,'./CapGuyWalk0009.png'),
    path.join(__dirname,'./CapGuyWalk0010.png'),
    path.join(__dirname,'./CapGuyWalk0011.png'),
    path.join(__dirname,'./CapGuyWalk0012.png'),
    path.join(__dirname,'./CapGuyWalk0013.png'),
    path.join(__dirname,'./CapGuyWalk0014.png'),
    path.join(__dirname,'./CapGuyWalk0015.png'),
    path.join(__dirname,'./CapGuyWalk0016.png')
    ],//(args.options['sprites'] || '').split(','),
    format = 'png',//(args.options['format'] || 'png').toLowerCase(),
    binaryManager, blend;

function start( i, imgs, blend, width, height )
{
    if ( i >= imgs.length ) { if ( 0 < imgs.length ) finish( blend, imgs, width, height ); return; }
    var img_file = imgs[i];
    binaryManager.read( img_file, function( img ){
        imgs[i] = img;
        blend.setInput(i+1, img).setInputValues(i+1, {
                mode: "normal",
                alpha: 1,
                enabled: 1,
                startX: 0,
                startY: i*height
        });
        start( i+1, imgs, blend, width, height );
    }, function( err ){
        console.log('error while loading image: ' + err);
    });
}
function finish( blend, imgs, width, height )
{
    var sprite = F.Image().restorable(false).createImageData(width, imgs.length*height);
    //console.log(blend.matrix); return;
    blend.apply( sprite, function(){
    binaryManager.write( path.join(__dirname,'./animation-sprite'+('jpg' === format?'.jpg':'.png')), sprite, function( ){
        F.IO.FileManager().responseType('text').write(path.join(__dirname,'./animation-sprite.html'), '\
<!DOCTYPE html>\
<html lang="en">\
<head>\
<meta http-equiv="content-type" content="text/html; charset=UTF-8">\
<meta charset="utf-8">\
\
<title>Css Sprite Animation Generator</title>\
\
<style type="text/css">\
    .sprite-animation {\
        width: '+width+'px;\
        height: '+height+'px;\
        position: relative;\
        display: block;\
        overflow: hidden;\
        background-position: 0 0;\
        background-image: url(./animation-sprite'+('jpg' === format?'.jpg':'.png')+');\
        -webkit-animation: spriteanimation 1s steps('+imgs.length+') infinite;\
        -moz-animation: spriteanimation 1s steps('+imgs.length+') infinite;\
        animation: spriteanimation 1s steps('+imgs.length+') infinite;\
    }\
    @-webkit-keyframes spriteanimation {\
        0% { background-position: 0 0; }\
        100% { background-position: 0 -'+((imgs.length-1)*height)+'px; }\
    }\
    @keyframes spriteanimation {\
        0% { background-position: 0 0; }\
        100% { background-position: 0 -'+((imgs.length-1)*height)+'px; }\
    }\
</style>\
</head>\
<body>\
<div class="sprite-animation">&nbsp;</div>\
</body>\
</html>\
', function(){
            console.log('completed.');
        });
    }, function( err ){
        console.log('error while writing sprite: ' + err);
    });
    });
}

if ( imgs.length > 0 )
{
    console.log('Generating Animation..');
    binaryManager = 'jpg' === format ? F.IO.BinaryManager( F.Codec.JPG, {quality: 100} ) : F.IO.BinaryManager( F.Codec.PNG, {deflateLevel: 9} );
    blend = F.BlendFilter(new Array(5*imgs.length));
    start( 0, imgs, blend, width, height );
}
else
{
    console.log('No sprite images!');
}