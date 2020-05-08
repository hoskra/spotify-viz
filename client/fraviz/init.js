
import * as THREE from 'three'

var BASE_CAMERA, BASE_RENDERER;

function onWindowResize() {
    BASE_CAMERA.aspect = window.innerWidth / window.innerHeight;
    BASE_CAMERA.updateProjectionMatrix();
    BASE_RENDERER.setSize( window.innerWidth, window.innerHeight );
}

export function init(camera, scene, renderer, GRID_COLOR, LIGHTING){
    BASE_CAMERA = camera;
    BASE_RENDERER = renderer;

    // CAMERA
    camera.position.set( 0, 100, 400 );
    camera.lookAt( 0, 0, 0 );

    // SCENE
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog( scene.background, 1, 1700 );

    // GROUND
    var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
    var groundMat = new THREE.MeshLambertMaterial( { color: 0x000000 } );
    // groundMat.color.setHSL( 0.095, 1, 0.75 );

    var ground = new THREE.Mesh( groundGeo, groundMat );
    ground.position.y = - 33;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add( ground );

    if (LIGHTING) {
    // HEMISPHERE LIGHT
    // var hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 100 );
    // scene.add( hemiLightHelper );

    // DIRECTIONAL LIGHT
    var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( - 1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    scene.add( dirLight );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;


    // SKYDOME
    var vertexShader = $('#vertexShader')[0].textContent;
    var fragmentShader = $('#fragmentShader')[0].textContent;
    var uniforms = {
      "topColor": { value: new THREE.Color( 0x0077ff ) },
      "bottomColor": { value: new THREE.Color( GRID_COLOR ) },
      "offset": { value: 53 },
      "exponent": { value: 0.6 }
    };
    uniforms[ "topColor" ].value.copy( hemiLight.color );

    scene.fog.color.copy( uniforms[ "bottomColor" ].value );

    var skyGeo = new THREE.SphereBufferGeometry( 4000, 32, 15 );
    var skyMat = new THREE.ShaderMaterial( {
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      side: THREE.BackSide
    } );

    var sky = new THREE.Mesh( skyGeo, skyMat );
    scene.add( sky );
    }

    // RENDERER
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;

    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );
}