(function(window){
        
    /**
     * Provides requestAnimationFrame in a cross browser way.
     * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     */

    if ( !window.requestAnimationFrame ) {

        window.requestAnimationFrame = ( function() {

            return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

                window.setTimeout( callback, 1000 / 60 );

            };

        } )();

    }
    
    var 
        $F = FILTER,
        aside, test, container, mouseXOnMouseDown, windowHalfX,
        mouseYOnMouseDown, windowHalfY,
        targetRotationOnMouseDownY = 0, targetRotationY = 0,
        targetRotationOnMouseDownX = 0, targetRotationX = 0,
        w = window.innerWidth, h = window.innerHeight,
        w2 = w/2, h2 = h/2,
        
        scene, camera, renderer, cube,
        sides = {bottom:3,top:2,  right:0,left:1, front:4,back:5},
        side = 400, N = 2, dsp = 0,
        colors = {
            inside: 0x2c2c2c,
            top: 0x2e1c3b,
            bottom: 0x2e1c3b,
            left: 0x2e1c3b,
            right: 0x2e1c3b,
            front: 0x2e1c3b,
            back: 0x2e1c3b
        },
        cubelets = [], xx, yy, zz, 
        Nz = N, Nx = N, Ny = N,
        sidex = side, sidey = side, sidez = side,
        cubletsidex = sidex/(Nx+(Nx-1)*dsp), 
        cubletsidey = sidey/(Ny+(Ny-1)*dsp), 
        cubletsidez = sidez/(Nz+(Nz-1)*dsp),
        // build cubelets
        image = [], texture = [], position = [],
        mat, starmat, materials, cubelet,
        displacemap = new $F.Image(),
        // filters
        clr = new $F.ColorMatrixFilter().colorize(0xff0000),
        gray = new $F.ColorMatrixFilter().grayscale(),
        grc = new $F.ColorMatrixFilter().grayscale().contrast(1),
        blur = new $F.ConvolutionMatrixFilter().fastGauss(3),
        twirl = new $F.GeometricMapFilter().twirl(Math.PI/2, 120, 0.33, 0.27),
        sobel = new $F.ConvolutionMatrixFilter().sobel(3),
        grs = new $F.CompositeFilter([gray, sobel]),
        emboss = new $F.ConvolutionMatrixFilter().emboss(),
        dF = new $F.DisplacementMapFilter()
    ;
    
    var self={
    
        init : function() {
            container = document.getElementById('container'),
            aside = document.getElementById('aside'),
            test = document.getElementById('test'),
            test.addEventListener('click', dotest, false);
            
            container.style.width = w+"px";
            container.style.height = h+"px";
            //container.style.marginTop=0.5*(window.innerHeight-h)+'px';
            windowHalfX = w2;
            windowHalfY = h2;
            
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera( 70, w / h, 1, 1000 );
            camera.position.z = 700;
            scene.add( camera );



            renderer = new THREE.CanvasRenderer();
            renderer.setSize( w, h );
            THREEx.WindowResize(renderer, camera);
            container.appendChild( renderer.domElement );

            cube=new THREE.Object3D();
            scene.add(cube);

            for (var i=0; i<8;i++)
            {
                image[i] = new $F.Image();
                texture[i] = new THREE.Texture(image[i].canvasElement);
                // set closure callback
                image[i].setImage(document.getElementById('Che').src, callback(i));
            }

            mat = new THREE.MeshBasicMaterial( { color: colors.inside } );
            mat.name = 'inside';
            starmat = new THREE.MeshBasicMaterial( { map:THREE.ImageUtils.loadTexture(document.getElementById('RedStar').src) } );    
            for (zz=0;zz<Nz;zz++)
            {
                for (xx=0;xx<Nx;xx++)
                {
                    for (yy=0;yy<Ny;yy++)
                    {                       
                        materials=[];
                        for (var mii=0;mii<6;mii++)
                        {
                            materials.push( mat );
                        }

                        // color external faces
                        if (yy==0)
                        {
                            //materials[sides['bottom']]=new THREE.MeshBasicMaterial( { map:THREE.ImageUtils.loadTexture('RedStar.jpg') } );
                            materials[sides['bottom']].color.setHex( colors.inside );
                            materials[sides['bottom']].name='bottom';
                        }
                        if (yy==Ny-1)
                        {
                            //materials[sides['top']]=new THREE.MeshBasicMaterial( { map:THREE.ImageUtils.loadTexture('RedStar.jpg') } );
                            materials[sides['top']].color.setHex( colors.inside );
                            materials[sides['top']].name='top';
                        }
                        if (xx==Nx-1)
                        {
                            materials[sides['right']]=starmat;
                            //materials[sides['right']].color.setHex( colors.right );
                            materials[sides['right']].name='right';
                        }
                        if (xx==0)
                        {
                            materials[sides['left']]=starmat;
                            //materials[sides['left']].color.setHex( colors.left );
                            materials[sides['left']].name='left';
                        }
                        if (zz==Nz-1)
                        {
                            materials[sides['front']]=starmat;
                            //materials[sides['front']].color.setHex( colors.front );
                            materials[sides['front']].name='front';
                        }
                        if (zz==0)
                        {
                            materials[sides['back']]=starmat;
                            //materials[sides['back']].color.setHex( colors.back );
                            materials[sides['back']].name='back';
                        }
                        // add diagonal (filtered) images
                        if (yy==1 && xx==0 && zz==1)
                        {
                            materials[sides['front']]=new THREE.MeshBasicMaterial({map:texture[0], transparent:true, overdraw:true});
                        }
                        if (yy==0 && xx==1 && zz==1)
                        {
                            materials[sides['front']]=new THREE.MeshBasicMaterial({map:texture[1], transparent:true, overdraw:true});
                        }
                        if (yy==1 && xx==1 && zz==0)
                        {
                            materials[sides['back']]=new THREE.MeshBasicMaterial({map:texture[2], transparent:true, overdraw:true});
                        }
                        if (yy==0 && xx==0 && zz==0)
                        {
                            materials[sides['back']]=new THREE.MeshBasicMaterial({map:texture[3], transparent:true, overdraw:true});
                        }
                        if (yy==1 && xx==1 && zz==1)
                        {
                            materials[sides['right']]=new THREE.MeshBasicMaterial({map:texture[4], transparent:true, overdraw:true});
                        }
                        if (yy==0 && xx==1 && zz==0)
                        {
                            materials[sides['right']]=new THREE.MeshBasicMaterial({map:texture[5], transparent:true, overdraw:true});
                        }
                        if (yy==1 && xx==0 && zz==1)
                        {
                            materials[sides['left']]=new THREE.MeshBasicMaterial({map:texture[6], transparent:true, overdraw:true});
                        }
                        if (yy==0 && xx==0 && zz==0)
                        {
                            materials[sides['left']]=new THREE.MeshBasicMaterial({map:texture[7], transparent:true, overdraw:true});
                        }

                        // new cubelet
                        cubelet = new THREE.Mesh(  new THREE.CubeGeometry( cubletsidex, cubletsidey, cubletsidez, 3, 3, 3 ), new THREE.MeshFaceMaterial(materials) );

                        // position it centered
                        cubelet.position.x = (cubletsidex+dsp*cubletsidex)*xx -sidex/2 +cubletsidex/2;
                        cubelet.position.y = (cubletsidey+dsp*cubletsidey)*yy -sidey/2 +cubletsidey/2;
                        cubelet.position.z = (cubletsidez+dsp*cubletsidez)*zz -sidez/2 +cubletsidez/2;
                        cubelet.overdraw = true;
                        // add it
                        cube.add(cubelet);
                    }
                }
            }
            
            container.addEventListener( 'mousedown', onDocumentMouseDown, false );
            container.addEventListener( 'touchstart', onDocumentTouchStart, false );
            container.addEventListener( 'touchmove', onDocumentTouchMove, false );
            animate();
        }
    };

    // closure
    function callback(ind) 
    {
        return function() { 
            texture[ind].needsUpdate=true; 
            if (ind==7)
            {
                displacemap.createImageData(image[7].width,image[7].height);
                displacemap.context.fillStyle="rgb(128,128,128)";
                displacemap.context.fillRect(0,0,displacemap.width,displacemap.height);
                // create radial gradient
                var grd = displacemap.context.createRadialGradient(displacemap.width/2, displacemap.height/2, 0, displacemap.width/2, displacemap.height/2, displacemap.width/2);
                grd.addColorStop(1, "#808080"); // neutral
                grd.addColorStop(0, "#ffffff"); // white
                displacemap.context.fillStyle = grd;
                displacemap.context.beginPath();
                displacemap.context.arc(displacemap.width/2,displacemap.height/2,displacemap.width/2,0,Math.PI*2,true);
                displacemap.context.fill();
                //image[7].setPixelData(displacemap.getPixelData());
                //displacemap._refresh();
            }
        };
    }
    
    function dotest(event)
    {
        clr.apply(image[1]);
        grc.apply(image[2]);
        blur.apply(image[3]);
        twirl.apply(image[4]);
        grs.apply(image[5]);
        emboss.apply(image[6]);
        dF.setMap(displacemap);
        dF.scaleX=100;
        dF.scaleY=100;
        dF.apply(image[7]);
        for (var i=0;i<8;i++)
            texture[i].needsUpdate=true;
    }
    
    function onDocumentMouseDown( event ) {

        event.preventDefault();

        container.addEventListener( 'mousemove', onDocumentMouseMove, false );
        container.addEventListener( 'mouseup', onDocumentMouseUp, false );
        container.addEventListener( 'mouseout', onDocumentMouseOut, false );

        mouseXOnMouseDown = event.clientX - windowHalfX;
        mouseYOnMouseDown = event.clientY - windowHalfY;
        targetRotationOnMouseDownY = targetRotationY;
        targetRotationOnMouseDownX = targetRotationX;
    }

    function onDocumentMouseMove( event ) {

        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;

        targetRotationY = targetRotationOnMouseDownY + ( mouseX - mouseXOnMouseDown ) * 0.02;
        targetRotationX = targetRotationOnMouseDownX + ( mouseY - mouseYOnMouseDown ) * 0.02;
    }

    function onDocumentMouseUp( event ) {

        container.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        container.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        container.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    }

    function onDocumentMouseOut( event ) {

        container.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        container.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        container.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    }

    function onDocumentTouchStart( event ) {

        if ( event.touches.length == 1 ) {

            event.preventDefault();

            mouseXOnMouseDown = event.clientX - windowHalfX;
            mouseYOnMouseDown = event.clientY - windowHalfY;
            targetRotationOnMouseDownY = targetRotationY;
            targetRotationOnMouseDownX = targetRotationX;
        }
    }

    function onDocumentTouchMove( event ) {

        if ( event.touches.length == 1 ) {

            event.preventDefault();

            mouseXOnMouseDown = event.clientX - windowHalfX;
            mouseYOnMouseDown = event.clientY - windowHalfY;
            targetRotationOnMouseDownY = targetRotationY;
            targetRotationOnMouseDownX = targetRotationX;
        }
    }

    //

    function animate() {
        requestAnimationFrame( animate );
        render();
    }

    function render() {
        cube.rotation.y += ( targetRotationY - cube.rotation.y ) * 0.05;
        cube.rotation.x += ( targetRotationX - cube.rotation.x ) * 0.05;
        renderer.render( scene, camera );
    }
    
    // export it
    window.Filter3Application=self;
    
})(window);