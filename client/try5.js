import Visualizer from './classes/visualizer'
import * as THREE from 'three'

import { makeGrids } from './fraviz/grid'
import { setupScene } from './fraviz/base'

var scene, camera, renderer;

// DEFAULT VALUES
let BACKGROUND_COLOR = 0x000000;

var volumeMaterial = new THREE.MeshPhongMaterial( { color: 0xfc0303, side: THREE.DoubleSide } );
var tatumMaterial = new THREE.MeshPhongMaterial( { color: 0xfcf403, side: THREE.DoubleSide } );
var segmentMaterial = new THREE.MeshPhongMaterial( { color: 0x03fc0f, side: THREE.DoubleSide } );
var beatMaterial = new THREE.MeshPhongMaterial( { color: 0x03fcf0, side: THREE.DoubleSide } );
var barMaterial = new THREE.MeshPhongMaterial( { color: 0x0320fc, side: THREE.DoubleSide } );
var sectionMaterial = new THREE.MeshPhongMaterial( { color: 0xfc03fc, side: THREE.DoubleSide } );

let volumeObject, tatumObject, segmentObject, beatObject, barObject, sectionObject;
let volumeText, tatumText, segmentText, beatText, barText, sectionText;

let COUNTER = 1;

let group = new THREE.Group();

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

let cube0, cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9, cube10, cube11;
let CAMERA_STATE = 0;

function createMountains(pitches, x, y, z, counter) {
  let newX = x;
  let newZ = z + 100 * counter;

  let cube0 = new THREE.Mesh( new THREE.BoxGeometry( 100, pitches[0] * 100, 100 ), beatMaterial );
  newX += 100
  group.add(cube0)
  cube0.position.set(newX, y, newZ)

  let cube1 = new THREE.Mesh( new THREE.BoxGeometry( 100, pitches[1] * 100, 100 ), beatMaterial );
  newX += 100
  group.add(cube1)
  cube1.position.set(newX, y, newZ)

  let cube2 = new THREE.Mesh( new THREE.BoxGeometry( 100, pitches[2] * 100, 100 ), beatMaterial );
  newX += 100
  group.add(cube2)
  cube2.position.set(newX, y, newZ)

  let cube3 = new THREE.Mesh( new THREE.BoxGeometry( 100, pitches[3] * 100, 100 ), beatMaterial );
  newX += 100
  group.add(cube3)
  cube3.position.set(newX, y, newZ)

  let cube4 = new THREE.Mesh( new THREE.BoxGeometry( 100, pitches[4] * 100, 100 ), beatMaterial );
  newX += 100
  group.add(cube4)
  cube4.position.set(newX, y, newZ)

  let cube5 = new THREE.Mesh( new THREE.BoxGeometry( 100, pitches[5] * 100, 100 ), beatMaterial );
  newX += 100
  group.add(cube5)
  cube5.position.set(newX, y, newZ)

  let cube6 = new THREE.Mesh( new THREE.BoxGeometry( 100, pitches[6] * 100, 100 ), beatMaterial );
  newX += 100
  group.add(cube6)
  cube6.position.set(newX, y, newZ)

  let cube7 = new THREE.Mesh( new THREE.BoxGeometry( 100, pitches[7] * 100, 100 ), beatMaterial );
  newX += 100
  group.add(cube7)
  cube7.position.set(newX, y, newZ)

  let cube8 = new THREE.Mesh( new THREE.BoxGeometry( 100, pitches[8] * 100, 100 ), beatMaterial );
  newX += 100
  group.add(cube8)
  cube8.position.set(newX, y, newZ)

  let cube9 = new THREE.Mesh( new THREE.BoxGeometry( 100, pitches[9] * 100, 100 ), beatMaterial );
  newX += 100
  group.add(cube9)
  cube9.position.set(newX, y, newZ)

  let cube10 = new THREE.Mesh( new THREE.BoxGeometry( 100, pitches[10] * 100, 100 ), beatMaterial );
  newX += 100
  group.add(cube10)
  cube10.position.set(newX, y, newZ)

  let cube11 = new THREE.Mesh( new THREE.BoxGeometry( 100, pitches[11] * 100, 100 ), beatMaterial );
  newX += 100
  group.add(cube11)
  cube11.position.set(newX, y, newZ)

  scene.add(group)

}

function segments() {
  let newX = 500
  let newY = -300
  let newZ = 200
  let spacing = - 300

  // green
  let near = -2400
  // na -900 bez hybaci kamery

  // red
  let far = 500
  // na 600 vidim

  cube0 = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), segmentMaterial );
  scene.add(cube0)

  cube1 = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), tatumMaterial );
  scene.add(cube1)

  cube2 = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), beatMaterial );
  scene.add(cube2)

  cube3 = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), beatMaterial );
  scene.add(cube3)

  cube4 = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), beatMaterial );
  scene.add(cube4)

  cube5 = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), beatMaterial );
  scene.add(cube5)

  cube6 = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), beatMaterial );
  scene.add(cube6)

  cube7 = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), beatMaterial );
  scene.add(cube7)

  cube8 = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), beatMaterial );
  scene.add(cube8)

  cube9 = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), volumeMaterial );
  scene.add(cube9)
}

export default class Try5 extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 100 })

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight , 1, 10000 );
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );

    setupScene(camera, scene, renderer, BACKGROUND_COLOR);

    makeGrids(scene, 2, 4700, 1);
    createObjects();
    segments();
    camera.position.z = 4000;
  }
  hooks () {
  }

  getSync() {
    return this.sync.state.currentlyPlaying.name + this.sync.state.currentlyPlaying.artists[0].name
  }

  paint ({ ctx, height, width, now }) {
    renderer.render( scene, camera );

    let speed = (this.sync.volume * 10) * (this.sync.volume * 10) * (this.sync.volume * 10)
    speed = speed / 50


    camera.position.z -= speed;

    if(camera.position.z <= 0){
      camera.position.z = 4000;
    }

    let camZ = camera.position.z;

    let volume = this.sync.volume * 10;
    let tatum = this.sync.tatum.progress * 10;
    let segment = this.sync.segment.progress * 10;
    let beat = this.sync.beat.progress * 10;
    let bar = this.sync.bar.progress * 10;
    let section = this.sync.section.progress * 10;

    // console.log(this.sync.state.currentlyPlaying.name + this.sync.state.currentlyPlaying.artists[0].name)
    // console.log(this.sync.section)

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


    x_position = -700;
    y_position = -400;
    z_position = -3000 + camZ;

    setInterval(() => {
      COUNTER++
      // createMountains(this.sync.segment.pitches, x_position, y_position - 200, z_position -100, COUNTER)
    }, 2000)

    let pitches = this.sync.segment.pitches

    let newX = 500
    let newY = -300
    let newZ = 200


    // let near = -2500
    // let far = 600


    //     -1980
    //     1000

    let move = 1000

    // cube0.position.set(newX, newY, camera.position.z > -500? newZ : newZ + move)
    // newZ-= cubeSpacing
    // cube1.position.set(newX, newY, camera.position.z > -500? newZ : newZ + move)
    // newZ-= cubeSpacing
    // cube2.position.set(newX, newY, camera.position.z > -500? newZ : newZ + move)
    // newZ-= cubeSpacing
    // cube3.position.set(newX, newY, camera.position.z > -500? newZ : newZ + move)
    // newZ-= cubeSpacing
    // cube4.position.set(newX, newY, camera.position.z > -500? newZ : newZ + move)
    // newZ-= cubeSpacing
    // cube5.position.set(newX, newY, camera.position.z > -500? newZ : newZ + move)
    // newZ-= cubeSpacing
    // cube6.position.set(newX, newY, camera.position.z > -500? newZ : newZ + move)
    // newZ-= cubeSpacing
    // cube7.position.set(newX, newY, camera.position.z > -500? newZ : newZ + move)
    // newZ-= cubeSpacing
    // cube8.position.set(newX, newY, camera.position.z > -500? newZ : newZ + move)
    // newZ-= cubeSpacing
    // cube9.position.set(newX, newY, camera.position.z > -500? newZ : newZ + move)

    let cubeSpacing = 400
    let start = 0
    // CAMERA_STATE

    let distribution = 4000


    if (camera.position.z === 4000){
      console.log("4000")
        cube0.position.set(newX, newY, (start + cubeSpacing * 0)%distribution);
        cube1.position.set(newX, newY, (start + cubeSpacing * 1)%distribution);
        cube2.position.set(newX, newY, (start + cubeSpacing * 2)%distribution);
        cube3.position.set(newX, newY, (start + cubeSpacing * 3)%distribution);
        cube4.position.set(newX, newY, (start + cubeSpacing * 4)%distribution);
        cube5.position.set(newX, newY, (start + cubeSpacing * 5)%distribution);
        cube6.position.set(newX, newY, (start + cubeSpacing * 6)%distribution);
        cube7.position.set(newX, newY, (start + cubeSpacing * 7)%distribution);
        cube8.position.set(newX, newY, (start + cubeSpacing * 8)%distribution);
        cube9.position.set(newX, newY, (start + cubeSpacing * 9)%distribution);
      } else if (Math.abs (camera.position.z - 3600) <= 20 ) {
        console.log(" - 3600")
        cube0.position.set(newX, newY, (start + cubeSpacing * 0 + cubeSpacing )%distribution );
        cube1.position.set(newX, newY, (start + cubeSpacing * 1 + cubeSpacing )%distribution );
        cube2.position.set(newX, newY, (start + cubeSpacing * 2 + cubeSpacing )%distribution );
        cube3.position.set(newX, newY, (start + cubeSpacing * 3 + cubeSpacing )%distribution );
        cube4.position.set(newX, newY, (start + cubeSpacing * 4 + cubeSpacing )%distribution );
        cube5.position.set(newX, newY, (start + cubeSpacing * 5 + cubeSpacing )%distribution );
        cube6.position.set(newX, newY, (start + cubeSpacing * 6 + cubeSpacing )%distribution );
        cube7.position.set(newX, newY, (start + cubeSpacing * 7 + cubeSpacing )%distribution );
        cube8.position.set(newX, newY, (start + cubeSpacing * 8 + cubeSpacing )%distribution );
        cube9.position.set(newX, newY, (start + cubeSpacing * 9 + cubeSpacing )%distribution );
      } else if (Math.abs (camera.position.z - 3200) <= 20 ) {
        console.log(" - 3200")
        cube0.position.set(newX, newY, (start + cubeSpacing * 0 + cubeSpacing )%distribution );
        cube1.position.set(newX, newY, (start + cubeSpacing * 1 + cubeSpacing )%distribution );
        cube2.position.set(newX, newY, (start + cubeSpacing * 2 + cubeSpacing )%distribution );
        cube3.position.set(newX, newY, (start + cubeSpacing * 3 + cubeSpacing )%distribution );
        cube4.position.set(newX, newY, (start + cubeSpacing * 4 + cubeSpacing )%distribution );
        cube5.position.set(newX, newY, (start + cubeSpacing * 5 + cubeSpacing )%distribution );
        cube6.position.set(newX, newY, (start + cubeSpacing * 6 + cubeSpacing )%distribution );
        cube7.position.set(newX, newY, (start + cubeSpacing * 7 + cubeSpacing )%distribution );
        cube8.position.set(newX, newY, (start + cubeSpacing * 8 + cubeSpacing )%distribution );
        cube9.position.set(newX, newY, (start + cubeSpacing * 9 + cubeSpacing )%distribution );
      } else if (Math.abs (camera.position.z - 2800) <= 20 ) {
        console.log(" - 2800")
        cube0.position.set(newX, newY, (start + cubeSpacing * 0 + cubeSpacing )%distribution );
        cube1.position.set(newX, newY, (start + cubeSpacing * 1 + cubeSpacing )%distribution );
        cube2.position.set(newX, newY, (start + cubeSpacing * 2 + cubeSpacing )%distribution );
        cube3.position.set(newX, newY, (start + cubeSpacing * 3 + cubeSpacing )%distribution );
        cube4.position.set(newX, newY, (start + cubeSpacing * 4 + cubeSpacing )%distribution );
        cube5.position.set(newX, newY, (start + cubeSpacing * 5 + cubeSpacing )%distribution );
        cube6.position.set(newX, newY, (start + cubeSpacing * 6 + cubeSpacing )%distribution );
        cube7.position.set(newX, newY, (start + cubeSpacing * 7 + cubeSpacing )%distribution );
        cube8.position.set(newX, newY, (start + cubeSpacing * 8 + cubeSpacing )%distribution );
        cube9.position.set(newX, newY, (start + cubeSpacing * 9 + cubeSpacing )%distribution );
      } else if (Math.abs (camera.position.z - 2400) <= 20 ) {
        console.log(" - 2400")
        cube0.position.set(newX, newY, (start + cubeSpacing * 0 + cubeSpacing )%distribution );
        cube1.position.set(newX, newY, (start + cubeSpacing * 1 + cubeSpacing )%distribution );
        cube2.position.set(newX, newY, (start + cubeSpacing * 2 + cubeSpacing )%distribution );
        cube3.position.set(newX, newY, (start + cubeSpacing * 3 + cubeSpacing )%distribution );
        cube4.position.set(newX, newY, (start + cubeSpacing * 4 + cubeSpacing )%distribution );
        cube5.position.set(newX, newY, (start + cubeSpacing * 5 + cubeSpacing )%distribution );
        cube6.position.set(newX, newY, (start + cubeSpacing * 6 + cubeSpacing )%distribution );
        cube7.position.set(newX, newY, (start + cubeSpacing * 7 + cubeSpacing )%distribution );
        cube8.position.set(newX, newY, (start + cubeSpacing * 8 + cubeSpacing )%distribution );
        cube9.position.set(newX, newY, (start + cubeSpacing * 9 + cubeSpacing )%distribution );
      } else if (Math.abs (camera.position.z - 2000) <= 20 ) {
        console.log(" - 2000")
        cube0.position.set(newX, newY, (start + cubeSpacing * 0 + cubeSpacing )%distribution );
        cube1.position.set(newX, newY, (start + cubeSpacing * 1 + cubeSpacing )%distribution );
        cube2.position.set(newX, newY, (start + cubeSpacing * 2 + cubeSpacing )%distribution );
        cube3.position.set(newX, newY, (start + cubeSpacing * 3 + cubeSpacing )%distribution );
        cube4.position.set(newX, newY, (start + cubeSpacing * 4 + cubeSpacing )%distribution );
        cube5.position.set(newX, newY, (start + cubeSpacing * 5 + cubeSpacing )%distribution );
        cube6.position.set(newX, newY, (start + cubeSpacing * 6 + cubeSpacing )%distribution );
        cube7.position.set(newX, newY, (start + cubeSpacing * 7 + cubeSpacing )%distribution );
        cube8.position.set(newX, newY, (start + cubeSpacing * 8 + cubeSpacing )%distribution );
        cube9.position.set(newX, newY, (start + cubeSpacing * 9 + cubeSpacing )%distribution );
      } else if (Math.abs (camera.position.z - 1600) <= 20 ) {
        console.log(" - 1600")
        cube0.position.set(newX, newY, (start + cubeSpacing * 0 + cubeSpacing )%distribution );
        cube1.position.set(newX, newY, (start + cubeSpacing * 1 + cubeSpacing )%distribution );
        cube2.position.set(newX, newY, (start + cubeSpacing * 2 + cubeSpacing )%distribution );
        cube3.position.set(newX, newY, (start + cubeSpacing * 3 + cubeSpacing )%distribution );
        cube4.position.set(newX, newY, (start + cubeSpacing * 4 + cubeSpacing )%distribution );
        cube5.position.set(newX, newY, (start + cubeSpacing * 5 + cubeSpacing )%distribution );
        cube6.position.set(newX, newY, (start + cubeSpacing * 6 + cubeSpacing )%distribution );
        cube7.position.set(newX, newY, (start + cubeSpacing * 7 + cubeSpacing )%distribution );
        cube8.position.set(newX, newY, (start + cubeSpacing * 8 + cubeSpacing )%distribution );
        cube9.position.set(newX, newY, (start + cubeSpacing * 9 + cubeSpacing )%distribution );
      } else if (Math.abs (camera.position.z - 1200) <= 20 ) {
        console.log(" - 1200")
        cube0.position.set(newX, newY, (start + cubeSpacing * 0 + cubeSpacing )%distribution );
        cube1.position.set(newX, newY, (start + cubeSpacing * 1 + cubeSpacing )%distribution );
        cube2.position.set(newX, newY, (start + cubeSpacing * 2 + cubeSpacing )%distribution );
        cube3.position.set(newX, newY, (start + cubeSpacing * 3 + cubeSpacing )%distribution );
        cube4.position.set(newX, newY, (start + cubeSpacing * 4 + cubeSpacing )%distribution );
        cube5.position.set(newX, newY, (start + cubeSpacing * 5 + cubeSpacing )%distribution );
        cube6.position.set(newX, newY, (start + cubeSpacing * 6 + cubeSpacing )%distribution );
        cube7.position.set(newX, newY, (start + cubeSpacing * 7 + cubeSpacing )%distribution );
        cube8.position.set(newX, newY, (start + cubeSpacing * 8 + cubeSpacing )%distribution );
        cube9.position.set(newX, newY, (start + cubeSpacing * 9 + cubeSpacing )%distribution );
      } else if (Math.abs (camera.position.z - 800) <= 20 ) {
        console.log(" - 800")
        cube0.position.set(newX, newY, (start + cubeSpacing * 0 + cubeSpacing )%distribution );
        cube1.position.set(newX, newY, (start + cubeSpacing * 1 + cubeSpacing )%distribution );
        cube2.position.set(newX, newY, (start + cubeSpacing * 2 + cubeSpacing )%distribution );
        cube3.position.set(newX, newY, (start + cubeSpacing * 3 + cubeSpacing )%distribution );
        cube4.position.set(newX, newY, (start + cubeSpacing * 4 + cubeSpacing )%distribution );
        cube5.position.set(newX, newY, (start + cubeSpacing * 5 + cubeSpacing )%distribution );
        cube6.position.set(newX, newY, (start + cubeSpacing * 6 + cubeSpacing )%distribution );
        cube7.position.set(newX, newY, (start + cubeSpacing * 7 + cubeSpacing )%distribution );
        cube8.position.set(newX, newY, (start + cubeSpacing * 8 + cubeSpacing )%distribution );
        cube9.position.set(newX, newY, (start + cubeSpacing * 9 + cubeSpacing )%distribution );
      } else if (Math.abs (camera.position.z - 400) <= 20 ) {
        console.log(" - 400")
        cube0.position.set(newX, newY, (start + cubeSpacing * 0 + cubeSpacing )%distribution );
        cube1.position.set(newX, newY, (start + cubeSpacing * 1 + cubeSpacing )%distribution );
        cube2.position.set(newX, newY, (start + cubeSpacing * 2 + cubeSpacing )%distribution );
        cube3.position.set(newX, newY, (start + cubeSpacing * 3 + cubeSpacing )%distribution );
        cube4.position.set(newX, newY, (start + cubeSpacing * 4 + cubeSpacing )%distribution );
        cube5.position.set(newX, newY, (start + cubeSpacing * 5 + cubeSpacing )%distribution );
        cube6.position.set(newX, newY, (start + cubeSpacing * 6 + cubeSpacing )%distribution );
        cube7.position.set(newX, newY, (start + cubeSpacing * 7 + cubeSpacing )%distribution );
        cube8.position.set(newX, newY, (start + cubeSpacing * 8 + cubeSpacing )%distribution );
        cube9.position.set(newX, newY, (start + cubeSpacing * 9 + cubeSpacing )%distribution );
      }

  }
}