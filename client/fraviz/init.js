
import * as THREE from 'three'

var BASE_CAMERA, BASE_RENDERER;

function onWindowResize() {
    BASE_CAMERA.aspect = window.innerWidth / window.innerHeight;
    BASE_CAMERA.updateProjectionMatrix();
    BASE_RENDERER.setSize( window.innerWidth, window.innerHeight );
}

export function init(camera, scene, renderer, enableGround, groundMat = new THREE.MeshLambertMaterial( { color: 0x000000 } ) ) {
    BASE_CAMERA = camera;
    BASE_RENDERER = renderer;

    // CAMERA
    camera.position.set( 0, 100, 400 );
    camera.lookAt( 0, 0, 0 );

    // SCENE
    // scene.background = new THREE.Color(0xccedff);
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog( scene.background, 1, 1200 );

    // GROUND
    var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
    // var groundMat = new THREE.MeshLambertMaterial( { color: 0x000000 } );
    var ground = new THREE.Mesh( groundGeo, groundMat );

    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 400, 0 );
    scene.add( hemiLight );
    var directionalLight = new THREE.DirectionalLight( 0xffffff );
    directionalLight.position.set( 0, 200, 100 );
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top = 180;
    directionalLight.shadow.camera.bottom = - 100;
    directionalLight.shadow.camera.left = - 120;
    directionalLight.shadow.camera.right = 120;
    scene.add( directionalLight );

    ground.position.y = - 103;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    if(enableGround) {
        scene.add( ground );
    }

    // RENDERER
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;

    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
}