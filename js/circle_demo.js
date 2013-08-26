var container;

var camera, 
    scene, 
    renderer;

var mesh, 
    light;

var mouseX = 0, 
    mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 
            20, 
            window.innerWidth / window.innerHeight, 
            1, 
            10000);
    camera.position.z = 1800;
    camera.position.y = 900;

    scene = new THREE.Scene();

    light = new THREE.DirectionalLight( 0xFFFFFF );
    light.position.set( 0, 0, 1 );
    scene.add(light);

    var circleMat = new THREE.MeshBasicMaterial({ 
        color: 0xFF0000,
        transparent: true,
        opacity: 0.7
    });
    var ellipseGeo = new THREE.EllipseGeometry( 400, 200, 64 );
    mesh = new THREE.Mesh( ellipseGeo, circleMat );
    // mesh.rotation.x = - Math.PI * 0.5;
    scene.add( mesh );

    var circleMat = new THREE.MeshBasicMaterial({ 
        color: 0x00FF00,
        transparent: true,
        opacity: 0.7
    });
    var circleGeo = new THREE.CircleGeometry( 200, 64 );
    mesh = new THREE.Mesh( circleGeo, circleMat );
    mesh.rotation.x = - Math.PI * 0.5;
    mesh.position.x = -200;
    mesh.position.y = 50;
    scene.add( mesh );

    var circleMat = new THREE.MeshBasicMaterial({ 
        color: 0x0000FF,
        transparent: true,
        opacity: 0.7
    });
    var circleGeo = new THREE.CircleGeometry( 200, 64 );
    mesh = new THREE.Mesh( circleGeo, circleMat );
    mesh.rotation.x = - Math.PI * 0.5;
    mesh.position.x = 200;
    mesh.position.y = -50;
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false);

}

function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );
    
}

function animate() {

    requestAnimationFrame( animate );
    render();

}

function render() {
    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( - (mouseY - 900) - camera.position.y ) * 0.05;

    camera.lookAt( scene.position );

    renderer.render( scene, camera );
}
