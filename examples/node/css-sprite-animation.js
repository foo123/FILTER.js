"use strict";

var path = require('path'),
    parse_args = require('../commargs.js'),
    F = require('../../../build/filter.bundle.js'),
    echo = console.log,
    args = parse_args(),
    format = 'png',//(args.options['format'] || 'png').toLowerCase(),
    type = 'hor',//(args.options['type'] || 'hor').toLowerCase(),
    width = 300,//parseInt(args.options['width']||'100', 10),
    height = 521,//parseInt(args.options['height']||'100', 10),
    fps = 12,
    imgs = [
    './sprites/CapGuyWalk0001.png',
    './sprites/CapGuyWalk0002.png',
    './sprites/CapGuyWalk0003.png',
    './sprites/CapGuyWalk0004.png',
    './sprites/CapGuyWalk0005.png',
    './sprites/CapGuyWalk0006.png',
    './sprites/CapGuyWalk0007.png',
    './sprites/CapGuyWalk0008.png',
    './sprites/CapGuyWalk0009.png',
    './sprites/CapGuyWalk0010.png',
    './sprites/CapGuyWalk0011.png',
    './sprites/CapGuyWalk0012.png',
    './sprites/CapGuyWalk0013.png',
    './sprites/CapGuyWalk0014.png',
    './sprites/CapGuyWalk0015.png',
    './sprites/CapGuyWalk0016.png'
    ]//(args.options['sprites'] || '').split(',')
    //, blend = F.BlendFilter(new Array(5*imgs.length));
;

function start( imMan, i, sprite, format, type, imgs, width, height, fps )
{
    if ( 0 === i ) echo('Generating Animation..');
    if ( i >= imgs.length )
    {
        if ( 0 < imgs.length ) finish( imMan, sprite, format, type, imgs, width, height, fps );
        return;
    }
    var img_file = '.' === imgs[i].charAt(0) ? path.join(__dirname, imgs[i]) : imgs[i];
    imMan.read( img_file, function( img ){
        imgs[i] = img;
        /*blend.setInput(i+1, img).setInputValues(i+1, {
                mode: "normal",
                alpha: 1,
                enabled: 1,
                startX: i*width,
                startY: 0
        });*/
        sprite.paste(img, i*width, 0);
        echo('animation sprite: "' + img_file + '" pasted');
        start( imMan, i+1, sprite, format, type, imgs, width, height, fps );
    }, function( err ){
        imgs[i] = null;
        echo('error while loading sprite image: ' + err);
        start( imMan, i+1, sprite, format, type, imgs, width, height, fps );
    });
}
function finish( imMan, sprite, format, type, imgs, width, height, fps )
{
    echo('Output animation files..');
    var sprite_img = './animation-sprite'+('jpg' === format?'.jpg':'.png');
    //blend.apply( sprite );
    imMan.write(
        path.join(__dirname, sprite_img), sprite,
        function( ){
        var nframes = imgs.length, dur = nframes/fps;
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
        position: relative;\
        display: block;\
        width: '+width+'px;\
        height: '+height+'px;\
        overflow: hidden;\
        background-image: url("'+sprite_img+'");\
        background-position: 0px 0px;\
    }\
    .sprite-animation.animated {\
        -webkit-animation-name: spriteanimation;\
        -webkit-animation-duration: '+dur+'s;\
        -webkit-animation-iteration-count: infinite;\
        -webkit-animation-timing-function: steps('+nframes+');\
        -moz-animation-name: spriteanimation;\
        -moz-animation-duration: '+dur+'s;\
        -moz-animation-iteration-count: infinite;\
        -moz-animation-timing-function: steps('+nframes+');\
        -ms-animation-name: spriteanimation;\
        -ms-animation-duration: '+dur+'s;\
        -ms-animation-iteration-count: infinite;\
        -ms-animation-timing-function: steps('+nframes+');\
        -o-animation-name: spriteanimation;\
        -o-animation-duration: '+dur+'s;\
        -o-animation-iteration-count: infinite;\
        -o-animation-timing-function: steps('+nframes+');\
        animation-name: spriteanimation;\
        animation-duration: '+dur+'s;\
        animation-iteration-count: infinite;\
        animation-timing-function: steps('+nframes+');\
    }\
    @-webkit-keyframes spriteanimation {\
        0% { background-position: 0px 0px; }\
        100% { background-position: -'+(nframes*width)+'px 0px; }\
    }\
    @keyframes spriteanimation {\
        0% { background-position: 0px 0px; }\
        100% { background-position: -'+(nframes*width)+'px 0px; }\
    }\
</style>\
</head>\
<body>\
<div class="sprite-animation animated">&nbsp;</div>\
</body>\
</html>\
', function(){
            echo('completed.');
        });
    }, function( err ){
        echo('error while writing output sprite: ' + err);
    });
}

if ( imgs.length > 0 )
{
    start( 'jpg' === format ? F.IO.BinaryManager( F.Codec.JPG, {quality: 100} ) : F.IO.BinaryManager( F.Codec.PNG, {deflateLevel: 9} ),
        0,
        F.Image().restorable(false).createImageData(imgs.length*width, height),
        format,
        type,
        imgs,
        width,
        height,
        fps
    );
}
else
{
    echo('No sprite images!');
}