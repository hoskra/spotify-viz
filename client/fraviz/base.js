import * as THREE from 'three'

var BASE_CAMERA, BASE_RENDERER;

export function onWindowResize() {
    BASE_CAMERA.aspect = window.innerWidth / window.innerHeight;
    BASE_CAMERA.updateProjectionMatrix();
    BASE_RENDERER.setSize( window.innerWidth, window.innerHeight );
}

export function setupScene(camera, scene, renderer, BACKGROUND_COLOR) {
    BASE_CAMERA = camera;
    BASE_RENDERER = renderer;

    // CAMERA
    camera.position.set( -100, 100, 1000 );
    camera.lookAt( -100, 100, 0 );

    // SCENE
    scene.background = new THREE.Color( BACKGROUND_COLOR );

    // LIGHTS
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

    // RENDERER
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;

    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
}