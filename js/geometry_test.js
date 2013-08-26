var container;

var camera, 
    scene, 
    renderer;

var mesh, 
    group1, 
    group2, 
    group3, 
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

    scene = new THREE.Scene();

    light = new THREE.DirectionalLight( 0xFFFFFF );
    light.position.set( 0, 0, 1 );
    scene.add(light);

    // shadow

    var canvas = document.createElement( 'canvas' );
    canvas.width = 128;
    canvas.height = 128;

    var context = canvas.getContext( '2d' );
    var gradient = context.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2, 
            canvas.width / 2);
    gradient.addColorStop( 0.1, 'rgba(210, 210, 210, 1)' );
    gradient.addColorStop( 1, 'rgba(255, 255, 255, 1)' );

    context.fillStyle = gradient;
    context.fillRect( 0, 0, canvas.width, canvas.height );

    var shadowTexture = new THREE.Texture( canvas );
    shadowTexture.needsUpdate = true;

    var shadowMaterial = new THREE.MeshBasicMaterial( { map: shadowTexture } );
    var shadowGeo = new THREE.PlaneGeometry( 300, 300, 1, 1 );

    mesh = new THREE.Mesh( shadowGeo, shadowMaterial );
    mesh.position.y = -250;
    mesh.rotation.x = - Math.PI / 2;
    scene.add( mesh );

    mesh = new THREE.Mesh( shadowGeo, shadowMaterial );
    mesh.position.y = -250;
    mesh.position.x = -400;
    mesh.rotation.x = - Math.PI / 2;
    scene.add( mesh );

    mesh = new THREE.Mesh( shadowGeo, shadowMaterial );
    mesh.position.y = -250;
    mesh.position.x = 400;
    mesh.rotation.x = - Math.PI / 2;
    scene.add( mesh );

    var faceIndices = [ 'a', 'b', 'c', 'd' ];

    var color, f, f2, f3, p, n, vertexIndex,

        radius = 200,

        geometry = new THREE.IcosahedronGeometry( radius, 1 ),
        geometry2 = new THREE.IcosahedronGeometry( radius, 1 ),
        geometry3 = new THREE.IcosahedronGeometry( radius, 1 );

    for ( var i = 0; i < geometry.faces.length; i++ ) {

        f = geometry.faces[i];
        f2 = geometry2.faces[i];
        f3 = geometry3.faces[i];

        n = ( f instanceof THREE.Face3 ) ? 3 : 4;

        for ( var j = 0; j < n; j++) {

            vertexIndex = f[ faceIndices[j] ];

            p = geometry.vertices[ vertexIndex ];

            color = new THREE.Color( 0xFFFFFF );
            color.setHSL( ( p.y / radius + 1 ) / 2, 1.0, 0.5 );

            f.vertexColors[ j ] = color;

            color = new THREE.Color( 0xFFFFFF );
            color.setHSL( 0.0, ( p.y / radius + 1 ) / 2, 0.5 );

            f2.vertexColors[ j ] = color;

            color = new THREE.Color( 0xFFFFFF );
            color.setHSL( 0.125 * vertexIndex / geometry.vertices.length, 1.0, 
                          0.5);

            f3.vertexColors[ j ] = color;

        }

    }

    var materials = [

        new THREE.MeshLambertMaterial({
            color: 0xFFFFFF,
            shading: THREE.FlatShading,
            vertexColors: THREE.VertexColors
        }),
        new THREE.MeshLambertMaterial({
            color: 0x000000,
            shading: THREE.FlatShading,
            wireframe: true,
            transparent: true
        })

    ];

    group1 = THREE.SceneUtils.createMultiMaterialObject( geometry, materials );
    group1.position.x = -400;
    group1.rotation.x = -1.87;
    scene.add( group1 );

    group2 = THREE.SceneUtils.createMultiMaterialObject( geometry2, materials );
    group2.position.x = 400;
    group2.rotation.x = 0;
    scene.add( group2 );

    group3 = THREE.SceneUtils.createMultiMaterialObject( geometry3, materials );
    group3.position.x = 0;
    group3.rotation.x = 0;
    scene.add( group3 );

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
    camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

    camera.lookAt( scene.position );

    renderer.render( scene, camera );
}



