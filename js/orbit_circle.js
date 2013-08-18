var container;

var camera, 
    scene, 
    light,
    renderer;

var planet = {
    radius: 200,
    spin_period: 40,
    color: 0x00FF00
};

var moon = {
    orbit_period: 10,
    spin_period: 3,
    orbit_radius: 500,
    radius: 50,
    color: 0xFFFFFF
};


var start = Date.now(),
    time = 0.0;


var mouseX = 0,
    mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

    init_scene();
    init_planet();
    init_moon();

    // init renderer and bind events
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.appendChild( renderer.domElement );

    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    window.addEventListener( 'resize', onWindowResize, false);
}

function init_scene() {
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
}

function init_planet() {

    init_body( planet );

}


function init_moon() {

    init_body( moon );

}


// init a celestial body
function init_body( body ) {

    var geometry = new THREE.IcosahedronGeometry( body.radius, 1 ); 

    var materials = [

        new THREE.MeshLambertMaterial({
            color: body.color,
            shading: THREE.FlatShading
        }),
        new THREE.MeshLambertMaterial({
            color: 0x000000,
            shading: THREE.FlatShading,
            wireframe: true,
            transparent: true
        })

    ];

    body.view = THREE.SceneUtils.createMultiMaterialObject( geometry, materials );
    scene.add( body.view );
}

function update_planet() {
    planet.view.rotation.y = 2 * Math.PI * (time / planet.spin_period);
}

function update_moon() {
    moon.view.rotation.y = 2 * Math.PI * (time / moon.spin_period);
    var angle = 2 * Math.PI * (time / moon.orbit_period);
    moon.view.position.x = - moon.orbit_radius * Math.cos(angle);
    moon.view.position.z = moon.orbit_radius * Math.sin(angle);

}

function update_camera() {
    camera.position.x += ( mouseX - camera.position.x ) * 0.05;
    camera.position.y += ( ( mouseY + 900) - camera.position.y ) * 0.05;

    camera.lookAt( scene.position );
}

function update_time()  {
    time = (Date.now() - start) / 1000.0;
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

    update_time();
    update_planet();
    update_moon();
    update_camera();

    renderer.render( scene, camera );
}
