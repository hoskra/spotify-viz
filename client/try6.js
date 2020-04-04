import Visualizer from './classes/visualizer'
import * as THREE from 'three'
import Stats from './libs/stats.module'

var camera, renderer, scene;
var stats;

let BACKGROUND_COLOR = 0xCCCCCC;
let horizonalGrid;
let cubes;

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}


function moveGrid(speed) {
  horizonalGrid.children.forEach((e)=> {
    e.position.z += speed;
    if (e.position.z >= 100)
      e.position.z = -100;
  });
}

export default class Try5 extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 100 })

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight , 1, 10000 );
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );

    // CAMERA
    camera.position.set( 0, 50, 200 );
    camera.lookAt( 0, 0, 0 );

    // SCENE
    scene.background = new THREE.Color().setHSL( 0.2, 0, 1 );
    scene.fog = new THREE.Fog( scene.background, 1, 2000 );

    // STATS
    stats = new Stats();
    $("body")[0].appendChild( stats.dom );


    // HEMISPHERE LIGHT
    var hemiLight = new THREE.HemisphereLight( 0xcfcfcf, 0xcfccff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );
    scene.add( hemiLight );
        
    // var hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 100 );
    // scene.add( hemiLightHelper );
    
    // DIRECTIONAL LIGHT
    var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( - 1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    // scene.add( dirLight );

    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;


    // GROUND
    var groundGeo = new THREE.PlaneBufferGeometry( 10000, 10000 );
    var groundMat = new THREE.MeshLambertMaterial( { color: 0xffffff } );
    groundMat.color.setHSL( 0.095, 1, 0.75 );

    var ground = new THREE.Mesh( groundGeo, groundMat );
    ground.position.y = - 33;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add( ground );

    // SKYDOME
    var vertexShader = $('#vertexShader')[0].textContent;
    var fragmentShader = $('#fragmentShader')[0].textContent;
    var uniforms = {
      "topColor": { value: new THREE.Color( 0x0077ff ) },
      "bottomColor": { value: new THREE.Color( 0xffffff ) },
      "offset": { value: 33 },
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

    // RENDERER
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;

    document.body.appendChild( renderer.domElement );
    window.addEventListener( 'resize', onWindowResize, false );

    // var gridHelper = new THREE.GridHelper( 1000, 50, 0xFFFFFF, 0xFFFFFF );
    // scene.add( gridHelper );
    // gridHelper.position.y = 200;


    // VERTICAL GRID
    let verticalGrid = new THREE.Group();
    let y = 0;
    
    let grid_size = 1000, grid_spacing = 50;
    let grid_material = new THREE.LineBasicMaterial({color: 0xFFFFFF});
    // let grid_geometry = new THREE.Geometry();
    // var quaternion = new THREE.Quaternion();
    // quaternion.setFromAxisAngle(
      //     new THREE.Vector3( xRotation, yRotation, zRotation ), degree );
      
      
    for (let i = - grid_size; i <= grid_size; i += grid_spacing){
      // grid_geometry.vertices.push(new THREE.Vector3(-grid_size, y, i));
      // grid_geometry.vertices.push(new THREE.Vector3(grid_size, y, i));
      let grid_geometry = new THREE.Geometry();
      grid_geometry.vertices.push(new THREE.Vector3(i, y, -grid_size));
      grid_geometry.vertices.push(new THREE.Vector3(i, y, grid_size));
      let grid_line = new THREE.Line(grid_geometry, grid_material, THREE.LineSegments);
      verticalGrid.add(grid_line)
    }
    
    scene.add(verticalGrid);
    
    // HORIZONTAL GRID
    
    horizonalGrid = new THREE.Group();
    
    for (let i = - grid_size; i <= grid_size; i += grid_spacing){
      let grid_geometry = new THREE.Geometry();
      grid_geometry.vertices.push(new THREE.Vector3(-grid_size, y, i));
      grid_geometry.vertices.push(new THREE.Vector3(grid_size, y, i));
      let grid_line = new THREE.Line(grid_geometry, grid_material, THREE.LineSegments);
      horizonalGrid.add(grid_line)
    }
    
    scene.add(horizonalGrid);
    // horizonalGrid.translateY(20);
    
    // Add Sun Helper
   var sunSphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry( 20, 16, 8 ),
      new THREE.MeshBasicMaterial( { color: 0x00ffff } )
    );



    var geom = new THREE.Geometry();
    var v1 = new THREE.Vector3(0,0,0);
    var v2 = new THREE.Vector3(30,0,0);
    var v3 = new THREE.Vector3(30,30,0);
    var v4 = new THREE.Vector3(-30,30,0);
    
    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);
    geom.vertices.push(v4);
    
    geom.faces.push(  new THREE.Face3( 0, 1, 3 ),
                      new THREE.Face3( 0, 1, 2 ) );

    geom.computeFaceNormals();
    
    var triangle = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );

    scene.add(triangle);

    triangle.position.x = -5;
    triangle.position.y = 10;
    triangle.position.z = -200;

    let green = new THREE.MeshPhongMaterial( { color: 0x03fc0f } )
    cubes = new THREE.Group();

    let start = -100;
    let spacing = 10;

    for(let i=0; i <=11; i++){
      let cube = new THREE.Mesh( new THREE.BoxGeometry( 10, 10, 10 ), green);
      cube.position.set(start + i * (10 + spacing), 10, 0);
      cubes.add(cube)
    }

    
    scene.add(cubes);
  }

  hooks () {
    
    this.sync.on('tatum', tatum => {
      let pitches = this.sync.segment.pitches

      if (pitches) {
        cubes.children.forEach((cube, index) => {
          cube.scale.set(1, 10 * pitches[index], 1)
        });
      }

    });
  }

  getSync() {
    return this.sync.state.currentlyPlaying.name + this.sync.state.currentlyPlaying.artists[0].name
  }

  paint ({ ctx, height, width, now }) {
    let volume = this.sync.volume; let tatum = this.sync.tatum.progress * 10; let segment = this.sync.segment.progress * 10; let beat = this.sync.beat.progress * 10; let bar = this.sync.bar.progress * 10; let section = this.sync.section.progress * 10;
    renderer.render( scene, camera );

    if (volume) {
      moveGrid(0.1 + (volume * volume * volume) );
    } else {
      moveGrid(0.1);
    }
    
    stats.update();
    
    let pitches = this.sync.segment.pitches
    // console.log(pitches);


    // cubes.children.forEach((cube, index) => {
    //   cube.scale.set(1, 10 * pitches[index], 1)
    // });

  }
}