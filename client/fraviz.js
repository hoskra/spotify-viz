import Visualizer from './classes/visualizer'
import * as THREE from 'three'
import { init } from './fraviz/init';
import Stats from './libs/stats.module'
import { moveGrid, separatedGrids } from './fraviz/grid';
import { pitch } from './fraviz/pitch';
import { Tree, rotateTree } from './fraviz/tree';

import * as d3 from 'd3-interpolate';
import * as d3Color from 'd3-color';

var camera, renderer, scene, stats;
var clock, clock2;

let GRID_COLOR = 0xff0090;
let grid_material = new THREE.LineBasicMaterial({color: GRID_COLOR});

let light1;
let light2;

let PITCH_MODE = 0;
let DANCING = true;

let attributesSet = false;

let BEATS = []
let BARS = []
let SECTIONS = []

let SONG_DURATION;

let PITCH_COLOR = 0x00d5ff;
let PITCH_MATERIAL = new THREE.MeshBasicMaterial( { color: PITCH_COLOR });

let LEAF_COLOR = 0xff3bf9;
let BRANCH_COLOR = 0x2ff85d;

let branchGeometry = new THREE.BoxGeometry( 0.2, 0.6,  0.2 );
let leafGeometry = new THREE.SphereGeometry( 0.3, 4, 5 )
let invisibleMaterial = new THREE.MeshBasicMaterial( { color: 0xbd0064 , visible: false } );

let branchMaterial = new THREE.MeshBasicMaterial( { color:  BRANCH_COLOR} );
let leafMaterial = new THREE.MeshBasicMaterial( { color: LEAF_COLOR  } );

let cubes1;
let cubes2;

let toRotate = []
let toRotateBeats = []
let allTrees = new THREE.Group();
let beatTrees = new THREE.Group();
let spacing = 200

let middle;
let middleMaterial = new THREE.MeshBasicMaterial( { color: 0x000000  } );

let SECTION_COUNT;

let HUE_COLORS = [
  "#ACB6E5",
  "#74ebd5",
]

let TREE_COUNT = 20;
function treePerBar() {
  let start = 200

  for (let i = 0; i < TREE_COUNT; i++) {
    let t = new Tree(30, 20, start - i * spacing, (30 + i*i) % 60, false);
    t.makeTree(branchGeometry, leafGeometry, invisibleMaterial, branchMaterial, leafMaterial, scene);
    t.scale(7)

    toRotate.push(t)
    allTrees.add(t.main);
  }

  scene.add(allTrees)
}

function treePerBeat() {
  let start = 200
  let beatSpacing = spacing / 1

  for (let i = 0; i < TREE_COUNT; i++) {
    let t = new Tree(-30, 20, start - i * beatSpacing, (30 + i*i) % 60, false);
    t.makeTree(branchGeometry, leafGeometry, invisibleMaterial, branchMaterial, leafMaterial, scene);
    t.scale(7)

    beatTrees.add(t.main);
    toRotateBeats.push(t)
  }

  scene.add(beatTrees)
}

export default class Fraviz extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 100 })

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight , 1, 10000 );
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true } );

    // CLOCK
    clock = new THREE.Clock;
    clock.start ();
    clock2 = new THREE.Clock;
    clock2.start ();

    // STATS
    stats = new Stats();
    stats.dom.classList.add("gui");
    $("body")[0].appendChild( stats.dom );

    init(camera, scene, renderer, GRID_COLOR);
    separatedGrids(scene, grid_material)

    let LEAF_COLOR = 0x023bf9;
    let BRANCH_COLOR = 0x20285d;

    let pitchX = 170;
    let pitchY = 0;
    let pitchZ = -20;

    pitch(scene, "pitch1", pitchX, pitchY, pitchZ, PITCH_MATERIAL );
    pitch(scene, "pitch2", -pitchX, pitchY, pitchZ, PITCH_MATERIAL );

    cubes1 = scene.getObjectByName( "pitch1" );
    cubes2 = scene.getObjectByName( "pitch2" );
    cubes2.rotation.y = THREE.Math.degToRad(180)

    branchGeometry = new THREE.BoxGeometry( 0.2, 0.6,  0.2 );
    leafGeometry = new THREE.SphereGeometry( 0.3, 4, 5 )
    invisibleMaterial = new THREE.MeshBasicMaterial( { color: 0xbd0064 , visible: false } );
    branchMaterial = new THREE.MeshBasicMaterial( { color:  BRANCH_COLOR} );
    leafMaterial = new THREE.MeshBasicMaterial( { color: LEAF_COLOR  } );


    // LIGHT1
    var sphere = new THREE.SphereBufferGeometry( 2, 16, 8 );
    let lightMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );

    light1 = new THREE.PointLight( 0xffffff, 20, 50 );
    light2 = new THREE.PointLight( 0xffffff, 20, 50 );
    light1.add( new THREE.Mesh( sphere, lightMaterial ) );
    light2.add( new THREE.Mesh( sphere, lightMaterial ) );
    scene.add( light1 );
    scene.add( light2 );

    middle = new THREE.Mesh( new THREE.BoxGeometry( 100, 1,  5000 ), middleMaterial );
    scene.add(middle);
  }

  hooks () {
    this.sync.on('segment', segment => {
      let pitches = this.sync.segment.pitches

      if (pitches)
        cubes1.children.forEach((cube, index) => {
          if(PITCH_MODE == 0){
            cube.scale.set(1, 10 * pitches[index], 1)
          } else if (PITCH_MODE == 1){
            cube.position.y = 50 * pitches[index];
          } else {
            cube.scale.set(1, 10 * pitches[index], 1)
            cube.position.y = 50 * pitches[index];
          }
        });
        cubes2.children.forEach((cube, index) => {
          if(PITCH_MODE == 0){
            cube.scale.set(1, 10 * pitches[index], 1)
          } else if (PITCH_MODE == 1){
            cube.position.y = 50 * pitches[index];
          } else {
            cube.scale.set(1, 10 * pitches[index], 1)
            cube.position.y = 50 * pitches[index];
          }
        });
    });

    this.sync.on('bar', bar => {
      light1.scale.set(3, 3, 3)
      light2.scale.set(3, 3, 3)
    });

    this.sync.on('beat', beat => {
      light1.scale.set(1, 1, 1)
      light2.scale.set(1, 1, 1)
    });

    this.sync.on('section', section => {
      light1.scale.set(1, 1, 1)
      light2.scale.set(1, 1, 1)

      if (section.index >= 1){
        let hue =  d3Color.hcl( d3.interpolateHslLong("#C6FFDD", "#FBD786", "#f7797d")(section.index  / SECTION_COUNT) ) .h
        grid_material.color.setHSL( hue, 1, 0.8 );
        PITCH_MATERIAL.color.setHSL( hue, 1, 0.8 );

        if (PITCH_MODE == 0){
          PITCH_MODE = 1;
          cubes1.children.forEach(cube => cube.scale.set(1, 1, 1))
          cubes2.children.forEach(cube => cube.scale.set(1, 1, 1))
        } else if (PITCH_MODE == 1){
          PITCH_MODE = 2;
        } else {
          PITCH_MODE = 0;
          cubes1.children.forEach(cube => cube.position.y = 0)
          cubes2.children.forEach(cube => cube.position.y = 0)
        }
      }
    });
  }

  getSync() {
    return this.sync.state.currentlyPlaying.name + this.sync.state.currentlyPlaying.artists[0].name
  }

  paint ({ ctx, height, width, now }) {
    if (attributesSet){

      let beat = this.sync.beat.duration/this.sync.beat.elapsed
      let bar = this.sync.bar.duration/this.sync.bar.elapsed

      beat > 5 && (beat = 7);
      bar > 5 && (bar   = 7);

      beatTrees.position.z +=  beat;
      allTrees.position.z +=  bar;
      if(beatTrees.position.z >= 3000) {
        beatTrees.position.z = 0;
      }
      if(allTrees.position.z >= 3000) {
        allTrees.position.z = 0;
      }


      if(DANCING){
        if (this.sync.beat.index % 2 == 0){
          toRotate.forEach(element => {
            rotateTree(element.toRotate,-1 , 2)
          });
          toRotateBeats.forEach(element => {
            rotateTree(element.toRotate,1 , 2)
          });
        } else {
            toRotate.forEach(element => {
              rotateTree(element.toRotate, 1,2  )
            });
            toRotateBeats.forEach(element => {
              rotateTree(element.toRotate, -1 ,2 )
            });
        }
      }
    } else {
      BEATS = this.sync.state.trackAnalysis.beats;
      BARS = this.sync.state.trackAnalysis.bars;
      SECTIONS = this.sync.state.trackAnalysis.sections;
      SONG_DURATION = this.sync.state.trackAnalysis.track.duration;
      SECTION_COUNT = SECTIONS.length;

      attributesSet = true;
      treePerBar();
      treePerBeat();

      let hue =  d3Color.hcl( d3.interpolateHsl("#C6FFDD", "#FBD786", "#f7797d")(0) ) .h
      PITCH_MATERIAL.color.setHSL( hue, 1, 0.8 );
      grid_material.color.setHSL( hue, 1, 0.8 );
    }


    let volume = this.sync.volume;
    renderer.render( scene, camera );
    stats.update();

    if (volume) {
      let speed = volume * volume * volume;
      moveGrid(scene, 0.1 + (speed) );
      middle.scale.set(volume, 1,1);
    } else {
      moveGrid(scene, 0.1);
    }

    var time = Date.now() * 0.005;

    light1.position.x = Math.sin( time * 0.7 ) * 30;
    light1.position.y = Math.cos( time * 0.5 ) * 40 + 50;
    light1.position.z = Math.cos( time * 0.3 ) * 30 - 50;
    light2.position.x = Math.sin( (time + 1) * 0.7 ) * 30;
    light2.position.y = Math.cos( (time + 1) * 0.5 ) * 40 + 50;
    light2.position.z = Math.cos( (time + 1) * 0.3 ) * 30 - 50;

    let t = this.sync.beat.index % 10;
    let treeHue =  d3Color.hcl( d3.interpolateHsl("#1a2a6c", "#b21f1f", "#f7797d")( t / 10  ) ) .h
    let anotherHue =  d3Color.hcl( d3.interpolateHsl("#1a2a6c", "#b21f1f", "#f7797d")( (t*t) / 10  ) ) .h

    branchMaterial.color.setHSL( treeHue , 1, 0.6)
    leafMaterial.color.setHSL( anotherHue , 1, 0.8)
  }
}