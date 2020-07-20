
import * as THREE from 'three'

var BASE_CAMERA, BASE_RENDERER;

function onWindowResize() {
    BASE_CAMERA.aspect = window.innerWidth / window.innerHeight;
    BASE_CAMERA.updateProjectionMatrix();
    BASE_RENDERER.setSize( window.innerWidth, window.innerHeight );
}

export function init(camera, scene, renderer, groundMat = new THREE.MeshLambertMaterial( { color: 0x000000 } )){
    BASE_CAMERA = camera;
    BASE_RENDERER = renderer;

    // CAMERA
    camera.position.set( 0, 100, 400 );
    camera.lookAt( 0, 0, 0 );

    // SCENE
    // scene.background = new THREE.Color(0xccedff);
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog( scene.background, 1, 1900 );

    // GROUND
    var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
    // var groundMat = new THREE.MeshLambertMaterial( { color: 0x000000 } );
    var ground = new THREE.Mesh( groundGeo, groundMat );

    ground.position.y = - 33;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add( ground );

    // RENDERER
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;

    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
}