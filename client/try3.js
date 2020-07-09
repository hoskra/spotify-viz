import Visualizer from './classes/visualizer'
import * as THREE from 'three'
import * as d3 from 'd3-interpolate'
import Stats from './libs/stats.module'

import { makeGrids } from './fraviz/grid'

// DEFAULT VALUES
let BACKGROUND_COLOR = 0x000000;

// VARIABLES
var scene, camera, renderer, stats;

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

// ( left-right, up-down, front-behind )
// (x, y, z)


function cubeColor(depth, maxDepth) {
  var colorScale = [
      0xfff7f3, 0xfde0dd, 0xfcc5c0,
      0xfa9fb5, 0xf768a1, 0xdd3497
  ];
  var a = depth / (maxDepth + 1e-10);
  return colorScale[Math.floor(a * a * colorScale.length)];
}

function createCube(depth, maxDepth) {
  var cube = new THREE.BoxGeometry(1, 1, 1);
  var color = cubeColor(depth, maxDepth);
  cube.faces.forEach(function(face) {
      face.color.set(color);
  });
  return cube;
}

function createTreeGeometry() {
  var maxDepth = 10;
  var angle = Math.PI / 5;
  var ls = Math.cos(angle);
  var rs = Math.sin(angle);
  var x = ls * Math.cos(angle);
  var y = rs * Math.cos(angle);
  var geometry = new THREE.Geometry();

  var L = new THREE.Matrix4()
      .multiply(new THREE.Matrix4().makeRotationY(Math.PI / 2))
      .multiply(new THREE.Matrix4().makeTranslation(-0.5, -0.5, 0))
      .multiply(new THREE.Matrix4().makeTranslation(0, 1, 0))
      .multiply(new THREE.Matrix4().makeScale(ls, ls, ls))
      .multiply(new THREE.Matrix4().makeRotationZ(angle))
      .multiply(new THREE.Matrix4().makeTranslation(0.5, 0.5, 0));

  var R = new THREE.Matrix4()
      .multiply(new THREE.Matrix4().makeRotationY(Math.PI / 2))
      .multiply(new THREE.Matrix4().makeTranslation(-0.5, -0.5, 0))
      .multiply(new THREE.Matrix4().makeTranslation(x, 1 + y, 0))
      .multiply(new THREE.Matrix4().makeScale(rs, rs, rs))
      .multiply(new THREE.Matrix4().makeRotationZ(angle - Math.PI/2))
      .multiply(new THREE.Matrix4().makeTranslation(0.5, 0.5, 0));

  function recurse(matrix, depth) {
      if (depth <= maxDepth) {
          geometry.merge(createCube(depth, maxDepth), matrix);
          recurse(matrix.clone().multiply(L), depth + 1);
          recurse(matrix.clone().multiply(R), depth + 1);
      }
  }

  recurse(new THREE.Matrix4(), 0);
  return geometry;
}

let tree1, tree2;


export default class Try3 extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 100 })

    let canvas = document.getElementsByTagName('canvas')
    for (let element of canvas) {
      element.parentNode.removeChild(element);
    }
    // STATS
    stats = new Stats();
    $("body")[0].appendChild( stats.dom );

     // CAMERA
     camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight , 1, 10000 );
     camera.position.set( -100, 100, 1000 );
     camera.lookAt( -100, 100, 0 );

     // SCENE
     scene = new THREE.Scene();
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
     renderer = new THREE.WebGLRenderer( { antialias: true } );
     renderer.setPixelRatio( window.devicePixelRatio );
     renderer.setSize( window.innerWidth, window.innerHeight );
     renderer.shadowMap.enabled = true;

     document.body.appendChild( renderer.domElement );
     window.addEventListener( 'resize', onWindowResize, false );

     // GRID
     makeGrids(scene, 2, 5000, 1);


     var treeGeometry = createTreeGeometry();
     var treeMaterial = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          emissive: 0x443322,
          vertexColors: THREE.FaceColors
     });

        tree1 = new THREE.Mesh(treeGeometry, treeMaterial);
        tree1.castShadow = true;
        tree1.receiveShadow = true;
        tree1.scale.set(200,200,200)
        tree1.position.set(-800,-500,-500)
        scene.add(tree1);

        tree2 = new THREE.Mesh(treeGeometry, treeMaterial);
        tree2.castShadow = true;
        tree2.receiveShadow = true;
        tree2.scale.set(200,200,200)
        tree2.position.set(600,-500,-500)
        scene.add(tree2);

      // var rotScaleTranslation = new THREE.Matrix4().makeRotationY(Math.PI / 2);

      // var shearX = new THREE.Matrix4().makeTranslation(1, 1, 1)
      // var shearY = new THREE.Matrix4().makeTranslation(1, 1, 1)
      // var shearZ = new THREE.Matrix4().makeTranslation(1, 1, 1)

      // treeMesh.matrixAutoUpdate = false;
      // rotScaleTranslation.compose( treeMesh.position, treeMesh.quaternion, treeMesh.scale );
      // treeMesh.matrix.makeShear( shearX, shearY, shearZ ).multiply( rotScaleTranslation )

      // treeMesh.matrixAutoUpdate = false;
      // var finalMatrix = new THREE.Matrix4();
      // var rotationMatrix = new THREE.Matrix4();

      // rotationMatrix.makeRotationFromEuler(new THREE.Vector3(0,addedAngle,0),"XYZ");
      // finalMatrix.multiply(rotationMatrix);
      // finalMatrix.setPosition(0,0,5);
      // treeMesh.applyMatrix4(finalMatrix);
    }

  hooks () {
  }

  paint ({ ctx, height, width, now }) {
    renderer.render( scene, camera );
    stats.update();
    let speed = (this.sync.volume * 10) * (this.sync.volume * 10) * (this.sync.volume * 10)
    speed = speed / 50

    camera.position.z -= speed
    if(camera.position.z < -1000){ camera.position.z = 1000; }

    let camZ = camera.position.z;

    let x_position = -100;
    let y_position = -500;
    let z_position = -1500 + camZ;
    let spacing = 600;

    tree1.position.set(x_position + spacing,y_position,z_position)
    tree2.position.set(x_position - spacing,y_position,z_position)

    this.sync.bar.index % 2 ? tree1.rotateX(-0.1 * (Math.PI/180)) : tree1.rotateX(0.1 * (Math.PI/180))
    this.sync.beat.index % 2 ? tree2.rotateX(-0.1 * (Math.PI/180)) : tree2.rotateX(0.1 * (Math.PI/180))
  }
}