import Visualizer from './classes/visualizer'
import * as THREE from 'three'
import Stats from './libs/stats.module'

import { makeGrids } from './fraviz/grid'

var scene, camera, renderer, stats;

// DEFAULT VALUES
let BACKGROUND_COLOR = 0x000000;

var volumeMaterial = new THREE.MeshPhongMaterial( { color: 0xfc0303, side: THREE.DoubleSide } );
var tatumMaterial = new THREE.MeshPhongMaterial( { color: 0xfcf403, side: THREE.DoubleSide } );
var segmentMaterial = new THREE.MeshPhongMaterial( { color: 0x03fc0f, side: THREE.DoubleSide } );
var beatMaterial = new THREE.MeshPhongMaterial( { color: 0x03fcf0, side: THREE.DoubleSide } );
var barMaterial = new THREE.MeshPhongMaterial( { color: 0x0320fc, side: THREE.DoubleSide } );
var sectionMaterial = new THREE.MeshPhongMaterial( { color: 0xfc03fc, side: THREE.DoubleSide } );

let volumeObject;
let tatumObject;
let segmentObject;
let beatObject;
let barObject;
let sectionObject;

let volumeText;
let tatumText;
let segmentText;
let beatText;
let barText;
let sectionText;

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

// ( left-right, up-down, front-behind )
// (x, y, z)

function createObjects() {

  const fontJson = require( "fonts/gentilis_regular.typeface.json" );
  const font = new THREE.Font( fontJson );

  var volumeGeo  = new THREE.TextGeometry( 'volume', { font: font,size: 55,height: 5,curveSegments: 12,bevelEnabled: true,bevelThickness: 10,bevelSize: 8,bevelOffset: 0,bevelSegments: 5} );
  volumeGeo.computeBoundingBox();
  volumeGeo.computeVertexNormals()
  var tatumGeo  = new THREE.TextGeometry( 'tatum', { font: font,size: 55,height: 5,curveSegments: 12,bevelEnabled: true,bevelThickness: 10,bevelSize: 8,bevelOffset: 0,bevelSegments: 5} );
  tatumGeo.computeBoundingBox();
  tatumGeo.computeVertexNormals()
  var segmentGeo  = new THREE.TextGeometry( 'segment', { font: font,size: 55,height: 5,curveSegments: 12,bevelEnabled: true,bevelThickness: 10,bevelSize: 8,bevelOffset: 0,bevelSegments: 5} );
  segmentGeo.computeBoundingBox();
  segmentGeo.computeVertexNormals()
  var beatGeo  = new THREE.TextGeometry( 'beat', { font: font,size: 55,height: 5,curveSegments: 12,bevelEnabled: true,bevelThickness: 10,bevelSize: 8,bevelOffset: 0,bevelSegments: 5} );
  beatGeo.computeBoundingBox();
  beatGeo.computeVertexNormals()
  var barGeo  = new THREE.TextGeometry( 'bar', { font: font,size: 55,height: 5,curveSegments: 12,bevelEnabled: true,bevelThickness: 10,bevelSize: 8,bevelOffset: 0,bevelSegments: 5} );
  barGeo.computeBoundingBox();
  barGeo.computeVertexNormals()
  var sectionGeo  = new THREE.TextGeometry( 'section', { font: font,size: 55,height: 5,curveSegments: 12,bevelEnabled: true,bevelThickness: 10,bevelSize: 8,bevelOffset: 0,bevelSegments: 5} );
  sectionGeo.computeBoundingBox();
  sectionGeo.computeVertexNormals()

  volumeObject = new THREE.Mesh( new THREE.SphereBufferGeometry( 10 ), volumeMaterial );
  tatumObject = new THREE.Mesh( new THREE.SphereBufferGeometry( 10 ), tatumMaterial );
  segmentObject = new THREE.Mesh( new THREE.SphereBufferGeometry( 10 ), segmentMaterial );
  beatObject = new THREE.Mesh( new THREE.SphereBufferGeometry( 10 ), beatMaterial );
  barObject = new THREE.Mesh( new THREE.SphereBufferGeometry( 10 ), barMaterial );
  sectionObject = new THREE.Mesh( new THREE.SphereBufferGeometry( 10 ), sectionMaterial );

  volumeText = new THREE.Mesh( new THREE.BufferGeometry().fromGeometry( volumeGeo ), volumeMaterial );
  tatumText = new THREE.Mesh( new THREE.BufferGeometry().fromGeometry( tatumGeo ), tatumMaterial );
  segmentText = new THREE.Mesh( new THREE.BufferGeometry().fromGeometry( segmentGeo ), segmentMaterial );
  beatText = new THREE.Mesh( new THREE.BufferGeometry().fromGeometry( beatGeo ), beatMaterial );
  barText = new THREE.Mesh( new THREE.BufferGeometry().fromGeometry( barGeo ), barMaterial );
  sectionText = new THREE.Mesh( new THREE.BufferGeometry().fromGeometry( sectionGeo ), sectionMaterial );


  scene.add(volumeObject)
  scene.add(tatumObject)
  scene.add(segmentObject)
  scene.add(beatObject)
  scene.add(barObject)
  scene.add(sectionObject)

  scene.add(volumeText)
  scene.add(tatumText)
  scene.add(segmentText)
  scene.add(beatText)
  scene.add(barText)
  scene.add(sectionText)
}

export default class Try1 extends Visualizer {
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

     makeGrids(scene, 2, 4700, 1);
     createObjects();
  }
  hooks () {
  }

  paint ({ ctx, height, width, now }) {
    renderer.render( scene, camera );
    stats.update();
    let speed = (this.sync.volume * 10) * (this.sync.volume * 10) * (this.sync.volume * 10)
    speed = speed / 50

    camera.position.z -= speed;

    if(camera.position.z < -1000){
      camera.position.z = 1000;
    }

    let camZ = camera.position.z;

    // assign values
    let volume = this.sync.volume * 10;
    let tatum = this.sync.tatum.duration/this.sync.tatum.elapsed
    let segment = this.sync.section.duration/this.sync.section.elapsed
    let beat = this.sync.beat.duration/this.sync.beat.elapsed
    let bar = this.sync.bar.duration/this.sync.bar.elapsed
    let section = this.sync.section.duration/this.sync.section.elapsed

    bar /= 5;

    // limit values
    let limit = 10;
    tatum > limit && (tatum = limit);
    segment > limit && (segment   = limit);
    bar > limit && (bar   = limit);
    beat > limit && (beat   = limit);
    section > limit && (section   = limit);

    // volume > 10 && volume = 


    volumeObject.scale.set(volume ? volume : 0.00001 , volume ? volume : 0.00001 , volume ? volume : 0.00001 )
    tatumObject.scale.set(tatum ? tatum : 0.00001, tatum ? tatum : 0.00001, tatum ? tatum : 0.00001)
    segmentObject.scale.set(segment ? segment : 0.00001, segment ? segment : 0.00001, segment ? segment : 0.00001)
    beatObject.scale.set(beat ? beat : 0.00001, beat ? beat : 0.00001, beat ? beat : 0.00001)
    barObject.scale.set(bar ? bar : 0.00001, bar ? bar : 0.00001, bar ? bar : 0.00001)
    sectionObject.scale.set(section ? section : 0.00001, section ? section : 0.00001, section ? section : 0.00001)

    let x_position = -900;
    let spacing = 300;
    let y_position = -300;
    let z_position = -1000 + camZ;

    volumeObject.position.set(x_position, 0, z_position);
    volumeText.position.set(x_position - 70, y_position, z_position);
    x_position += spacing;

    tatumObject.position.set(x_position, 0, z_position);
    tatumText.position.set(x_position - 70, y_position, z_position);
    x_position += spacing;

    segmentObject.position.set(x_position, 0, z_position);
    segmentText.position.set(x_position - 70, y_position, z_position);
    x_position += spacing;

    beatObject.position.set(x_position, 0, z_position);
    beatText.position.set(x_position - 50, y_position, z_position);
    x_position += spacing;

    barObject.position.set(x_position, 0, z_position);
    barText.position.set(x_position - 50, y_position, z_position);
    x_position += spacing;

    sectionObject.position.set(x_position, 0, z_position);
    sectionText.position.set(x_position - 70, y_position, z_position);
    x_position += spacing;
  }
}