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
    orbit_per: 400,
    orbit_apo: 600,
    orbit_ecc: 0.5,
    orbit_target: planet,
    orbit_color: 0xFF0000,
    radius: 50,
    color: 0xFFFFFF
};

var start = Date.now(),
    time = 0.0;


var cameraX = 0,
    cameraY = 1200,
    cameraZ = 2400;

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
    // init_moon2();

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
    camera.position.z = cameraZ;
    camera.position.y = cameraY;

    scene = new THREE.Scene();

    light = new THREE.DirectionalLight( 0xFFFFFF );
    light.position.set( 0, 0, 1 );
    scene.add(light);
}

function init_planet() {

    init_body( planet );

}


function init_moon() {
    moon.orbit_x_radius = Math.ceil( (moon.orbit_apo + moon.orbit_per) / 2 );
    moon.orbit_z_radius = Math.ceil( moon.orbit_x_radius * Math.sqrt(1 - moon.orbit_ecc * moon.orbit_ecc) );
    moon.orbit_focus_len = Math.ceil( moon.orbit_x_radius * moon.orbit_ecc );

    var orbit_geo = new THREE.EllipseGeometry(moon.orbit_x_radius, moon.orbit_z_radius, 32);
    var orbit_mat = new THREE.MeshBasicMaterial({
        color: moon.orbit_color,
        transparent: true,
        opacity: 0.7
    });
    var mesh = new THREE.Mesh( orbit_geo, orbit_mat );
    mesh.rotation.x = -Math.PI * 0.5;
    mesh.position.x = moon.orbit_focus_len;
    scene.add( mesh );

    init_body( moon );

}

function init_moon2() {
    // init_body( moon2 );
    var geometry = new THREE.CircleGeometry( moon2.radius ); 

    var materials = new THREE.MeshLambertMaterial({
        color: moon2.color,
        shading: THREE.FlatShading
    });

    moon2.view = THREE.Mesh( geometry, materials );
    scene.add( moon2.view );
};


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

    // shadow
    var canvas = document.createElement( 'canvas' );
    canvas.width = body.radius * 0.9;
    canvas.height = body.radius * 0.9;

    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2, 
            canvas.width / 2);
    var darkest_color = Math.floor(-0.001 * body.radius * body.radius + 250);
    var darkest_color_string = 'rgba(' + darkest_color + ', '+ darkest_color + ', '+ darkest_color + ', 1)';

    gradient.addColorStop( 0.1, darkest_color_string );
    gradient.addColorStop( 1, 'rgba(255, 255, 255, 1)' );

    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    var shadowTexture = new THREE.Texture( canvas );
    shadowTexture.needsUpdate = true;

    var shadowMaterial = new THREE.MeshBasicMaterial( { map: shadowTexture } );
    var shadowGeo = new THREE.PlaneGeometry( body.radius, body.radius, 1, 1 );

    body.mesh = new THREE.Mesh( shadowGeo, shadowMaterial );
    body.mesh.position.y = -250;
    body.mesh.position.x = body.view.position.x;
    body.mesh.position.z = body.view.position.z;
    scene.add( body.mesh );
}

function update_body( body ) {

    if( body.view === undefined ) {
        return;
    }

    // update body spin
    if( body.spin_period !== undefined ) {
        body.view.rotation.y = 2 * Math.PI * (time / body.spin_period);
    }

    if( body.orbit_period !== undefined && body.orbit_radius !== undefined && body.orbit_target !== undefined ) {
        var angle = 2 * Math.PI * (time / body.orbit_period);
        body.view.position.x = - body.orbit_radius * Math.cos(angle) + body.orbit_target.view.position.x;
        body.view.position.z = body.orbit_radius * Math.sin(angle) + body.orbit_target.view.position.z;
    }

    body.mesh.position.x = body.view.position.x;
    body.mesh.position.z = body.view.position.z;

}

function update_planet() {
    update_body( planet );
}

function update_moon() {
    var angle = 2 * Math.PI * (time / moon.orbit_period);
    moon.view.position.x = - moon.orbit_x_radius * Math.cos( angle ) + moon.orbit_target.view.position.x + moon.orbit_focus_len;
    moon.view.position.z = moon.orbit_z_radius * Math.sin( angle ) + moon.orbit_target.view.position.y;
    
    // update_body( moon );
}

function update_moon2() {
    update_body( moon2 );
}

function update_camera() {
    camera.position.x += ( ( mouseX + cameraX ) - camera.position.x ) * 0.05;
    camera.position.y += ( ( mouseY + cameraY ) - camera.position.y ) * 0.05;

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
    // update_moon2();
    update_camera();

    renderer.render( scene, camera );
}
