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
    binaryManager, sprite;//, blend;

function start( sprite, i, imgs, width, height )
{
    if ( 0 === i ) console.log('Generating Animation..');
    if ( i >= imgs.length ) { if ( 0 < imgs.length ) finish( sprite, imgs, width, height ); return; }
    var img_file = imgs[i];
    binaryManager.read( img_file, function( img ){
        imgs[i] = img;
        /*blend.setInput(i+1, img).setInputValues(i+1, {
                mode: "normal",
                alpha: 1,
                enabled: 1,
                startX: i*width,
                startY: 0
        });*/
        sprite.paste(img, i*width, 0);
        console.log('animation sprite: "' + img_file + '" pasted');
        start( sprite, i+1, imgs, width, height );
    }, function( err ){
        imgs[i] = null;
        console.log('error while loading sprite image: ' + err);
        start( sprite, i+1, imgs, width, height );
    });
}
function finish( sprite, imgs, width, height )
{
    console.log('Output animation files..');
    var sprite_img = './animation-sprite'+('jpg' === format?'.jpg':'.png');
    //blend.apply( sprite );
    binaryManager.write( path.join(__dirname, sprite_img), sprite, function( ){
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
        background-position: 0px 0px;\
        background-image: url("'+sprite_img+'");\
        -webkit-animation: spriteanimation 2s steps('+imgs.length+') infinite;\
        -moz-animation: spriteanimation 2s steps('+imgs.length+') infinite;\
        animation: spriteanimation 2s steps('+imgs.length+') infinite;\
    }\
    @-webkit-keyframes spriteanimation {\
        100% { background-position: -'+((imgs.length-1)*width)+'px 0px; }\
    }\
    @keyframes spriteanimation {\
        100% { background-position: -'+((imgs.length-1)*width)+'px 0px; }\
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
}

if ( imgs.length > 0 )
{
    binaryManager = 'jpg' === format ? F.IO.BinaryManager( F.Codec.JPG, {quality: 100} ) : F.IO.BinaryManager( F.Codec.PNG, {deflateLevel: 9} );
    //blend = F.BlendFilter(new Array(5*imgs.length));
    sprite = F.Image().restorable(false).createImageData(imgs.length*width, height);
    start( sprite, 0, imgs, width, height );
}
else
{
    console.log('No sprite images!');
}