import Visualizer from './classes/visualizer'
import * as THREE from 'three'

import { makeGrids } from './fraviz/grid'
import { setupScene } from './fraviz/base'
import { createDummyObjects, moveDummyObjects, scaleDummyObjects } from './fraviz/dummyObjects'

var scene, camera, renderer;

// DEFAULT VALUES
let BACKGROUND_COLOR = 0x000000;

let CAMERA_START = 10000;
let CAMERA_STEP = 800;

let CAMERA_POSITION_0 = CAMERA_START - CAMERA_STEP * 0;
let CAMERA_POSITION_1 = CAMERA_START - CAMERA_STEP * 1;
let CAMERA_POSITION_2 = CAMERA_START - CAMERA_STEP * 2;
let CAMERA_POSITION_3 = CAMERA_START - CAMERA_STEP * 3;
let CAMERA_POSITION_4 = CAMERA_START - CAMERA_STEP * 4;
let CAMERA_POSITION_5 = CAMERA_START - CAMERA_STEP * 5;
let CAMERA_POSITION_6 = CAMERA_START - CAMERA_STEP * 6;
let CAMERA_POSITION_7 = CAMERA_START - CAMERA_STEP * 7;
let CAMERA_POSITION_8 = CAMERA_START - CAMERA_STEP * 8;
let CAMERA_POSITION_9 = CAMERA_START - CAMERA_STEP * 9;
let CAMERA_POSITION_10 = CAMERA_START - CAMERA_STEP * 10;

let CAMERA_POSITIONS = [ CAMERA_POSITION_0, CAMERA_POSITION_1, CAMERA_POSITION_2, CAMERA_POSITION_3, CAMERA_POSITION_4, CAMERA_POSITION_5, CAMERA_POSITION_6, CAMERA_POSITION_7, CAMERA_POSITION_8, CAMERA_POSITION_9, CAMERA_POSITION_10 ]


function move0(pitches) {
  group0.pitch(pitches)
  group10.pitch(pitches)
  group110.pitch(pitches)
  group1110.pitch(pitches)
}
function move1(pitches) {
  group1.pitch(pitches)
  group11.pitch(pitches)
  group111.pitch(pitches)
  group1111.pitch(pitches)
}
function move2(pitches) {
  group2.pitch(pitches)
  group12.pitch(pitches)
  group112.pitch(pitches)
  group1112.pitch(pitches)
}
function move3(pitches) {
  group3.pitch(pitches)
  group13.pitch(pitches)
  group113.pitch(pitches)
  group1113.pitch(pitches)
}
function move4(pitches) {
  group4.pitch(pitches)
  group14.pitch(pitches)
  group114.pitch(pitches)
  group1114.pitch(pitches)
}
function move5(pitches) {
  group5.pitch(pitches)
  group15.pitch(pitches)
  group115.pitch(pitches)
  group1115.pitch(pitches)
}
function move6(pitches) {
  group6.pitch(pitches)
  group16.pitch(pitches)
  group116.pitch(pitches)
  group1116.pitch(pitches)
}
function move7(pitches) {
  group7.pitch(pitches)
  group17.pitch(pitches)
  group117.pitch(pitches)
  group1117.pitch(pitches)
}
function move8(pitches) {
  group8.pitch(pitches)
  group18.pitch(pitches)
  group118.pitch(pitches)
  group1118.pitch(pitches)
}
function move9(pitches) {
  group9.pitch(pitches)
  group19.pitch(pitches)
  group119.pitch(pitches)
  group1119.pitch(pitches)
}

// function travellAll(allGroups) {
//   console.log(allGroups)
//   allGroups.forEach(group => {
//     group.travel()
//   });
// }

class Spectrum{
  constructor (x, y, z, spacing, material, side) {
    let group = new THREE.Group();

    for(let i=0; i <=11; i++){
      let cube = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), material);
      group.add(cube)
    }

    group.children.forEach((cube, index) => {
      cube.position.set(x - index*spacing, y, z)
    });

    this.x = x
    this.y = y
    this.spacing = spacing
    this.group = group;
    this.factor = 15;
    this.side = side

    scene.add(group)
  }

  pitch(pitch){
    this.group.children.forEach((cube, index) => {
      cube.scale.set(1, this.factor * pitch[index], 1)
      cube.position.x = this.x + index* this.spacing
      // console.log(cube.position.y)
      if (cube.position.y >= -1300) {
        // console.log("YES")
        cube.material.opacity = 1
      }

      cube.position.y = this.y

    });
  }

  travel(){
    this.group.children.forEach((cube) => {
      cube.position.x+= this.side ? -90 : 90
      cube.position.y-= 40

      if (cube.material.opacity >= 0)  {
        cube.material.opacity -= 0.0001
      }

    });
  }
}

let group0, group1, group2, group3, group4, group5, group6, group7, group8, group9;
let group10, group11, group12, group13, group14, group15, group16, group17, group18, group19;

let group110, group111, group112, group113, group114, group115, group116, group117, group118, group119;
let group1110, group1111, group1112, group1113, group1114, group1115, group1116, group1117, group1118, group1119;


export default class Try5 extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 100 })

    camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight , 1, 10000 );
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );

    setupScene(camera, scene, renderer, BACKGROUND_COLOR);

    makeGrids(scene, 2, 4700, 1);
    createDummyObjects(scene);
    camera.position.z = CAMERA_POSITIONS[0];


    let green = new THREE.MeshPhongMaterial( { color: 0x03fc0f, opacity: 0, transparent: true, side: THREE.DoubleSide } )
    let turq = new THREE.MeshPhongMaterial( { color: 0x03fcf0, opacity: 0, transparent: true, side: THREE.DoubleSide } )

    let x = 100
    let y = -1200
    let spacing = 300

    let cubeSpacing = 800
    let start = -4000

    group0 = new Spectrum(x, y, start + cubeSpacing * 0, spacing, green, 0)
    group1 = new Spectrum(x, y, start + cubeSpacing * 1, spacing, turq, 0)
    group2 = new Spectrum(x, y, start + cubeSpacing * 2, spacing, green, 0)
    group3 = new Spectrum(x, y, start + cubeSpacing * 3, spacing, turq, 0)
    group4 = new Spectrum(x, y, start + cubeSpacing * 4, spacing, green, 0)
    group5 = new Spectrum(x, y, start + cubeSpacing * 5, spacing, turq, 0)
    group6 = new Spectrum(x, y, start + cubeSpacing * 6, spacing, green, 0)
    group7 = new Spectrum(x, y, start + cubeSpacing * 7, spacing, turq, 0)
    group8 = new Spectrum(x, y, start + cubeSpacing * 8, spacing, green, 0)
    group9 = new Spectrum(x, y, start + cubeSpacing * 9, spacing, turq, 0)
    group10 = new Spectrum(x, y, start + cubeSpacing * 10, spacing, green, 0)
    group11 = new Spectrum(x, y, start + cubeSpacing * 11, spacing, turq, 0)
    group12 = new Spectrum(x, y, start + cubeSpacing * 12, spacing, green, 0)
    group13 = new Spectrum(x, y, start + cubeSpacing * 13, spacing, turq, 0)
    group14 = new Spectrum(x, y, start + cubeSpacing * 14, spacing, green, 0)
    group15 = new Spectrum(x, y, start + cubeSpacing * 15, spacing, turq, 0)
    group16 = new Spectrum(x, y, start + cubeSpacing * 16, spacing, green, 0)
    group17 = new Spectrum(x, y, start + cubeSpacing * 17, spacing, turq, 0)
    group18 = new Spectrum(x, y, start + cubeSpacing * 18, spacing, green, 0)
    group19 = new Spectrum(x, y, start + cubeSpacing * 19, spacing, turq, 0)

    x = -x - 200
    spacing = -spacing
    group110 = new Spectrum(x, y, start + cubeSpacing * 0, spacing, green, 1)
    group111 = new Spectrum(x, y, start + cubeSpacing * 1, spacing, turq, 1)
    group112 = new Spectrum(x, y, start + cubeSpacing * 2, spacing, green, 1)
    group113 = new Spectrum(x, y, start + cubeSpacing * 3, spacing, turq, 1)
    group114 = new Spectrum(x, y, start + cubeSpacing * 4, spacing, green, 1)
    group115 = new Spectrum(x, y, start + cubeSpacing * 5, spacing, turq, 1)
    group116 = new Spectrum(x, y, start + cubeSpacing * 6, spacing, green, 1)
    group117 = new Spectrum(x, y, start + cubeSpacing * 7, spacing, turq, 1)
    group118 = new Spectrum(x, y, start + cubeSpacing * 8, spacing, green, 1)
    group119 = new Spectrum(x, y, start + cubeSpacing * 9, spacing, turq, 1)
    group1110 = new Spectrum(x, y, start + cubeSpacing * 10, spacing, green, 1)
    group1111 = new Spectrum(x, y, start + cubeSpacing * 11, spacing, turq, 1)
    group1112 = new Spectrum(x, y, start + cubeSpacing * 12, spacing, green, 1)
    group1113 = new Spectrum(x, y, start + cubeSpacing * 13, spacing, turq, 1)
    group1114 = new Spectrum(x, y, start + cubeSpacing * 14, spacing, green, 1)
    group1115 = new Spectrum(x, y, start + cubeSpacing * 15, spacing, turq, 1)
    group1116 = new Spectrum(x, y, start + cubeSpacing * 16, spacing, green, 1)
    group1117 = new Spectrum(x, y, start + cubeSpacing * 17, spacing, turq, 1)
    group1118 = new Spectrum(x, y, start + cubeSpacing * 18, spacing, green, 1)
    group1119 = new Spectrum(x, y, start + cubeSpacing * 19, spacing, turq, 1)

    renderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    scene.fog = new THREE.Fog( BACKGROUND_COLOR, 4000, 8500 )

  }
  hooks () {
  }

  getSync() {
    return this.sync.state.currentlyPlaying.name + this.sync.state.currentlyPlaying.artists[0].name
  }

  paint ({ ctx, height, width, now }) {
    let volume = this.sync.volume * 10; let tatum = this.sync.tatum.progress * 10; let segment = this.sync.segment.progress * 10; let beat = this.sync.beat.progress * 10; let bar = this.sync.bar.progress * 10; let section = this.sync.section.progress * 10;
    renderer.render( scene, camera );

    let speed = (this.sync.volume * 10) * (this.sync.volume * 10)
    speed = speed / 20
    speed += 40;
    if(beat.progress > 0.9) {
      speed += 2;
    }

    // console.log(speed)

    camera.position.z -= speed;

    if(camera.position.z <= CAMERA_POSITION_10){
      camera.position.z = CAMERA_START;
    }

    let camZ = camera.position.z;

    let x_position = -900;
    let spacing = 300;
    let y_position = -300;
    let z_position = -1000 + camZ;

    scaleDummyObjects(scene, volume, tatum, segment, beat, bar, section)
    moveDummyObjects(scene, x_position, y_position + 800, z_position, spacing)

    let pitches = this.sync.segment.pitches

    let newX = -1800
    let newY = -500

//  let CAMERA_START = 5000;
//  let CAMERA_STEP = 400;
//  let cubeSpacing = 400
//  let start = -4600
    let cubeSpacing = 800
    let start = -4000

    CAMERA_POSITIONS

    group0.travel()
    group1.travel()
    group2.travel()
    group3.travel()
    group4.travel()
    group5.travel()
    group6.travel()
    group7.travel()
    group8.travel()
    group9.travel()
    group10.travel()
    group11.travel()
    group12.travel()
    group13.travel()
    group14.travel()
    group15.travel()
    group16.travel()
    group17.travel()
    group18.travel()
    group19.travel()
    group110.travel()
    group111.travel()
    group112.travel()
    group113.travel()
    group114.travel()
    group115.travel()
    group116.travel()
    group117.travel()
    group118.travel()
    group119.travel()
    group1110.travel()
    group1111.travel()
    group1112.travel()
    group1113.travel()
    group1114.travel()
    group1115.travel()
    group1116.travel()
    group1117.travel()
    group1118.travel()
    group1119.travel()

  
    // switch(this.sync.beat.index % 10){
    //   case 0:
    //     move0(pitches)
    //   case 1:
    //     move1(pitches)
    //   case 2:
    //     move2(pitches)
    //   case 3:
    //     move3(pitches)
    //   case 4:
    //     move4(pitches)
    //   case 5:
    //     move5(pitches)
    //   case 6:
    //     move6(pitches)
    //   case 7:
    //     move7(pitches)
    //   case 8:
    //     move8(pitches)
    //   case 9:
    //     move9(pitches)
    // }

    let will = 50

    // console.log(this.sync.beat)
    // if (beat.progress >= 0.9){console.log("BEAT")}

    if( Math.abs(camera.position.z - CAMERA_POSITIONS[0]) <= will   ){ move0(pitches) }
    if( Math.abs(camera.position.z - CAMERA_POSITIONS[9] ) <= will  ){ move1(pitches) }
    if( Math.abs(camera.position.z - CAMERA_POSITIONS[8] ) <= will  ){ move2(pitches) }
    if( Math.abs(camera.position.z - CAMERA_POSITIONS[7] ) <= will  ){ move3(pitches) }
    if( Math.abs(camera.position.z - CAMERA_POSITIONS[6] ) <= will  ){ move4(pitches) }
    if( Math.abs(camera.position.z - CAMERA_POSITIONS[5] ) <= will  ){ move5(pitches) }
    if( Math.abs(camera.position.z - CAMERA_POSITIONS[4] ) <= will  ){ move6(pitches) }
    if( Math.abs(camera.position.z - CAMERA_POSITIONS[3] ) <= will  ){ move7(pitches) }
    if( Math.abs(camera.position.z - CAMERA_POSITIONS[2] ) <= will  ){ move8(pitches) }
    if( Math.abs(camera.position.z - CAMERA_POSITIONS[1] ) <= will  ){ move9(pitches) }


    // if( Math.abs(camera.position.z - CAMERA_POSITIONS[0]) <= will  ){ move0(pitches) }
    // if( Math.abs(camera.position.z - CAMERA_POSITIONS[9] ) <= will  ){ move1(pitches) }
    // if( Math.abs(camera.position.z - CAMERA_POSITIONS[8] ) <= will  ){ move2(pitches) }
    // if( Math.abs(camera.position.z - CAMERA_POSITIONS[7] ) <= will  ){ move3(pitches) }
    // if( Math.abs(camera.position.z - CAMERA_POSITIONS[6] ) <= will  ){ move4(pitches) }
    // if( Math.abs(camera.position.z - CAMERA_POSITIONS[5] ) <= will  ){ move5(pitches) }
    // if( Math.abs(camera.position.z - CAMERA_POSITIONS[4] ) <= will  ){ move6(pitches) }
    // if( Math.abs(camera.position.z - CAMERA_POSITIONS[3] ) <= will  ){ move7(pitches) }
    // if( Math.abs(camera.position.z - CAMERA_POSITIONS[2] ) <= will  ){ move8(pitches) }
    // if( Math.abs(camera.position.z - CAMERA_POSITIONS[1] ) <= will  ){ move9(pitches) }





    // cube0.position.set(newX, newY, (start + cubeSpacing * 0));
    // cube1.position.set(newX, newY, (start + cubeSpacing * 1));
    // cube2.position.set(newX, newY, (start + cubeSpacing * 2));
    // cube3.position.set(newX, newY, (start + cubeSpacing * 3));
    // cube4.position.set(newX, newY, (start + cubeSpacing * 4));
    // cube5.position.set(newX, newY, (start + cubeSpacing * 5));
    // cube6.position.set(newX, newY, (start + cubeSpacing * 6));
    // cube7.position.set(newX, newY, (start + cubeSpacing * 7));
    // cube8.position.set(newX, newY, (start + cubeSpacing * 8));
    // cube9.position.set(newX, newY, (start + cubeSpacing * 9));
    // cube10.position.set(newX, newY, (start + cubeSpacing * 10));
    // cube11.position.set(newX, newY, (start + cubeSpacing * 11));
    // cube12.position.set(newX, newY, (start + cubeSpacing * 12));
    // cube13.position.set(newX, newY, (start + cubeSpacing * 13));
    // cube14.position.set(newX, newY, (start + cubeSpacing * 14));
    // cube15.position.set(newX, newY, (start + cubeSpacing * 15));
    // cube16.position.set(newX, newY, (start + cubeSpacing * 16));
    // cube17.position.set(newX, newY, (start + cubeSpacing * 17));
    // cube18.position.set(newX, newY, (start + cubeSpacing * 18));
    // cube19.position.set(newX, newY, (start + cubeSpacing * 19));

    // console.log(group0)

  }
}