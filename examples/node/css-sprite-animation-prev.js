"use strict";

var path = require('path'),
    fs = require('fs'),
    parse_args = require('./commargs.js'),
    echo = console.log,
    F = require('../../build/filter.bundle.js'),
    args = parse_args(),
    config_file = args.options['config'] || null,
    inline = !!args.options['inline'],
    name = args.options['name'] || 'spriteanimation',
    fps = parseInt(args.options['fps']||'0', 10)
;

function pass( ){ }
function start( index, row, col, imgManager, config, sprite )
{
    if ( index >= config.sprites.length ) { finish( imgManager, config, sprite ); return; }
    var img_file = '.' === config.sprites[index].charAt(0) ? path.join(__dirname, config.sprites[index]) : config.sprites[index];
    imgManager.read( img_file, function( img ){
        sprite.paste(img, col*config.dimension[0], row*config.dimension[1]);
        if ( (++col) >= config.grid[0] ) { col = 0; row++; }
        echo('animation sprite: "' + img_file + '" pasted');
        start( index+1, row, col, imgManager, config, sprite );
    }, function( err ){
        echo('error while loading sprite image: ' + err);
        if ( (++col) >= config.grid[0] ) { col = 0; row++; }
        start( index+1, row, col, imgManager, config, sprite );
    });
}
function finish( imgManager, config, sprite )
{
    echo('Output animation files..');
    var sprite_img = './'+config.name+('jpg' === config.format?'.jpg':'.png');
    var nframes = config.sprites.length, dur = nframes/config.fps;
    
    imgManager.write( path.join(__dirname, sprite_img), sprite, pass, function( err ){
        echo('Error writing sprite image: ' + err);
    });
    
    fs.readFile(path.join(__dirname,'./animation-sprite.tpl.css'), 'utf8', function( err, data ){
        if ( err )
        {
            echo('Error reading css tpl file: ' + err);
            return;
        }
        var animation_name = '', animation_duration = '', animation_delay = '',
            animation_timing = '', animation_iteration = '', animation_keyframes = '',
            attX, attY, iniX, iniY, finX, finY, factX = 1, factY = 1,
            aspect_ratio = 100*config.dimension[1]/config.dimension[0],
            background_size = ''+(100*config.grid[0])+'% '+(100*config.grid[1])+'%',
            unit = 'px', two_dim_grid = true;
        
        if ( config.responsive )
        {
            unit = '%';
            factX = 100/(config.dimension[0]);
            factY = 100/(config.dimension[1]);
        }
            
        if ( (1 < config.grid[0]) && (1 < config.grid[1]) )
        {
            // background-position-x, background-position-y NOT supported very good
            two_dim_grid = true;
            attX = "background-position-x"; attY = "background-position-y";
            iniX = "0"+unit; iniY = "0"+unit;
            finX = "-"+(factX*config.grid[0]*config.dimension[0])+unit; finY = "-"+(factY*config.grid[1]*config.dimension[1])+unit;
            animation_name = config.name+"-grid-x, "+config.name+"-grid-y";
            animation_duration = ''+(dur/config.grid[1])+'s, '+dur+'s';
            animation_delay = '0s, 0s';
            animation_timing = "steps("+config.grid[0]+"), steps("+config.grid[1]+")";
            animation_iteration = "infinite, infinite";
        }
        else if ( 1 < config.grid[1] )
        {
            two_dim_grid = false;
            attX = "background-position";
            iniX = "0"+unit+" 0"+unit;
            finX = "0"+unit+" -"+(factY*config.grid[1]*config.dimension[1])+unit;
            animation_name = config.name+"-grid-x";
            animation_duration = ''+dur+'s';
            animation_delay = '0s';
            animation_timing = "steps("+config.grid[1]+")";
            animation_iteration = "infinite";
        }
        else
        {
            two_dim_grid = false;
            attX = "background-position";
            iniX = "0"+unit+" 0"+unit;
            finX = "-"+(factX*config.grid[0]*config.dimension[0])+unit+" 0"+unit;
            animation_name = config.name+"-grid-x";
            animation_duration = ''+dur+'s';
            animation_delay = '0s';
            animation_timing = "steps("+config.grid[0]+")";
            animation_iteration = "infinite";
        }
        animation_keyframes = '\
@-webkit-keyframes '+config.name+'-grid-x {\
    0% { '+attX+': '+iniX+'; }\
    100% { '+attX+': '+finX+'; }\
}\
@-moz-keyframes '+config.name+'-grid-x {\
    0% { '+attX+': '+iniX+'; }\
    100% { '+attX+': '+finX+'; }\
}\
@-ms-keyframes '+config.name+'-grid-x {\
    0% { '+attX+': '+iniX+'; }\
    100% { '+attX+': '+finX+'; }\
}\
@-o-keyframes '+config.name+'-grid-x {\
    0% { '+attX+': '+iniX+'; }\
    100% { '+attX+': '+finX+'; }\
}\
@keyframes '+config.name+'-grid-x {\
    0% { '+attX+': '+iniX+'; }\
    100% { '+attX+': '+finX+'; }\
}\
';
        if ( two_dim_grid )
        {
            animation_keyframes += "\n"+'\
@-webkit-keyframes '+config.name+'-grid-y {\
    0% { '+attY+': '+iniY+'; }\
    100% { '+attY+': '+finY+'; }\
}\
@-moz-keyframes '+config.name+'-grid-y {\
    0% { '+attY+': '+iniY+'; }\
    100% { '+attY+': '+finY+'; }\
}\
@-ms-keyframes '+config.name+'-grid-y {\
    0% { '+attY+': '+iniY+'; }\
    100% { '+attY+': '+finY+'; }\
}\
@-o-keyframes '+config.name+'-grid-y {\
    0% { '+attY+': '+iniY+'; }\
    100% { '+attY+': '+finY+'; }\
}\
@keyframes '+config.name+'-grid-y {\
    0% { '+attY+': '+iniY+'; }\
    100% { '+attY+': '+finY+'; }\
}\
';
        }
        fs.writeFile(
            path.join(__dirname,'./'+config.name+'.css'),
            String(data)
                .split('#animation-class#').join(config.name+'-class')
                .split('#width#').join(config.dimension[0]).split('#height#').join(config.dimension[1])
                .split('#sprite#').join(sprite_img)
                .split('#background-color#').join(String(config.color))
                .split('#aspect-ratio#').join(''+aspect_ratio+'%')
                .split('#background-size#').join(background_size)
                .split('#animation-name#').join(animation_name)
                .split('#animation-duration#').join(animation_duration)
                .split('#animation-delay#').join(animation_delay)
                .split('#animation-timing#').join(animation_timing)
                .split('#animation-iteration#').join(animation_iteration)
                .split('#animation-keyframes#').join(animation_keyframes),
            'utf8',
            function( err ) {
                if ( err ) echo('Error writing css file: ' + err);
            }
        );
    });
    fs.readFile(path.join(__dirname,'./animation-sprite.tpl.html'), 'utf8', function( err, data ){
        if ( err )
        {
            echo('Error reading html tpl file: ' + err);
            return;
        }
        fs.writeFile(
            path.join(__dirname,'./'+config.name+'.html'),
            String(data)
                .split('#stylesheet#').join('./'+config.name+'.css')
                .split('#title#').join(config.name + ' sprite animation')
                .split('#animation-class#').join(config.responsive ? ('responsive-sprite '+config.name+'-class') : (config.name+'-class')),
            'utf8',
            function( err ) {
                if ( err ) echo('Error writing html file: ' + err);
            }
        );
    });
}

if ( !config_file )
{
    echo('No configuration file given!');
    process.exit();
}

echo('Reading configuration file..');
fs.readFile('.' === config_file.charAt(0) ? path.join(__dirname, config_file) : config_file, 'utf8', function( err, data ){
    if ( err )
    {
        echo('Error reading configuration file: ' + err);
        process.exit();
    }
    var config = null;
    try {
        config = JSON.parse(String(data));
    } catch (e) {
        config = null;
        echo('Error parsing configuration file: ' + e);
    }
    if ( !config )
    {
        echo('No configuration file!');
        process.exit();
    }
    if ( !config.sprites || !config.sprites.length )
    {
        echo('No sprite images!');
        process.exit();
    }
    if ( !config.dimension || !config.dimension[0] || !config.dimension[1] )
    {
        echo('Invalid sprite dimensions!');
        process.exit();
    }
    config.name = name;
    config.inline = inline;
    config.fps = fps || config.fps || 12;
    config.format = config.format ? config.format.toLowerCase() : 'png';
    if ( config.grid === +config.grid ) config.grid = [+config.grid, 1];
    config.color = config.color || "transparent";
    config.grid = config.grid ? config.grid : [config.sprites.length, 1];
    var imgManager = 'jpg' === config.format ? F.IO.BinaryManager( F.Codec.JPG, {quality: 100} ) : F.IO.BinaryManager( F.Codec.PNG, {deflateLevel: 9} );
    var sprite = F.Image().restorable(false).createImageData(config.grid[0]*config.dimension[0], config.grid[1]*config.dimension[1]);
    echo('Generating Animation..');
    start( 0, 0, 0, imgManager, config, sprite );
});
