import Visualizer from './classes/visualizer'
import * as THREE from 'three'
import { init } from './fraviz/init';
import Stats from './libs/stats.module'
import { moveGrid, separatedGrids } from './fraviz/grid';
import { pitch } from './fraviz/pitch';
import { Tree, rotateTree } from './fraviz/tree';
import { getTrackFeatures } from './fraviz/trackFeatures';

import * as d3 from 'd3-interpolate';
import * as d3Color from 'd3-color';

// basic objects
var camera, renderer, scene, stats;
var clock, clock2;
let light1, light2;
let cubes1, cubes2;


// state
let PITCH_MODE = 0;
let DANCING = true;
let attributesSet = false;

let SONG_DURATION;
let SECTION_COUNT;
let SECTIONS = []
let BEATS = []
let BARS = []

// colors
let GRID_COLOR = 0xff0090;
let PITCH_COLOR = 0x00d5ff;
let LEAF_COLOR = 0xff3bf9;
let BRANCH_COLOR = 0x2ff85d;


// materials
let grid_material = new THREE.LineBasicMaterial({color: GRID_COLOR});
let pitch_material = new THREE.MeshBasicMaterial( { color: PITCH_COLOR });


let branchGeometry = new THREE.BoxGeometry( 0.2, 0.6,  0.2 );
let leafGeometry = new THREE.SphereGeometry( 0.3, 4, 5 )
let invisibleMaterial = new THREE.MeshBasicMaterial( { color: 0xbd0064 , visible: false } );

let branchMaterial = new THREE.MeshBasicMaterial( { color:  BRANCH_COLOR} );
let leafMaterial = new THREE.MeshBasicMaterial( { color: LEAF_COLOR  } );

// let shadowMaterial = new THREE.MeshPhongMaterial( { color: BRANCH_COLOR} );
let shadowMaterial = new THREE.MeshPhongMaterial( { color: 0x03fc0f, opacity: 1, transparent: true } )


let toRotate = []
let toRotateBeats = []
let barTrees = new THREE.Group();
let beatTrees = new THREE.Group();
let spacing = 200
let leftShadow, rightShadow;
let shadowTrees = [];

let middle;
let middleMaterial = new THREE.MeshBasicMaterial( { color: 0x000000  } );


let TREE_COUNT = 20;
function treePerBar() {
  let start = 200

  for (let i = 0; i < TREE_COUNT; i++) {
    let t = new Tree(30, 20, start - i * spacing, (30 + i*i) % 60, false);
    t.makeTree(branchGeometry, leafGeometry, invisibleMaterial, branchMaterial, leafMaterial, scene);
    t.scale(10)

    toRotate.push(t)
    barTrees.add(t.main);
  }

  scene.add(barTrees)
}

function treePerBeat() {
  let start = 200
  let beatSpacing = spacing / 1

  for (let i = 0; i < TREE_COUNT; i++) {
    let t = new Tree(-30, 20, start - i * beatSpacing, (30 + i*i) % 60, false);
    t.makeTree(branchGeometry, leafGeometry, invisibleMaterial, branchMaterial, leafMaterial, scene, true);
    t.scale(10)

    beatTrees.add(t.main);
    toRotateBeats.push(t)
  }

  scene.add(beatTrees)
}

let shadowScale = 60;
let shadowX = 160;

function createShadowTrees() {
  let x = shadowX
  let y = -80
  let z = -600
  let scale = shadowScale;
  let degrees = 45;

  leftShadow = new Tree(-x, y, z, degrees, false);
  leftShadow.makeTree(branchGeometry, leafGeometry, invisibleMaterial, shadowMaterial, shadowMaterial, scene, true);
  leftShadow.scale(scale)
  shadowTrees.push(leftShadow)

  rightShadow = new Tree(x, y, z, degrees, false);
  rightShadow.makeTree(branchGeometry, leafGeometry, invisibleMaterial, shadowMaterial, shadowMaterial, scene, true);
  rightShadow.scale(scale)
  shadowTrees.push(rightShadow)

  rightShadow.main.rotation.y = 100;
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
    separatedGrids(scene, grid_material)

    let LEAF_COLOR = 0x023bf9;
    let BRANCH_COLOR = 0x20285d;

    let pitchX = 170;
    let pitchY = 0;
    let pitchZ = -20;

    pitch(scene, "pitch1", pitchX, pitchY, pitchZ, pitch_material );
    pitch(scene, "pitch2", -pitchX, pitchY, pitchZ, pitch_material );

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

    middle = new THREE.Mesh( new THREE.BoxGeometry( 100, 3,  5000 ), middleMaterial );
    scene.add(middle);


    createShadowTrees();
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

      if(bar.confidence > 0.4){
        leftShadow.main.scale.x  = shadowScale;
        leftShadow.main.scale.y  = shadowScale;
        leftShadow.main.scale.z  = shadowScale;
        rightShadow.main.scale.x = shadowScale;
        rightShadow.main.scale.y = shadowScale;
        rightShadow.main.scale.z = shadowScale;
      }
    });

    this.sync.on('beat', beat => {
      light1.scale.set(1, 1, 1)
      light2.scale.set(1, 1, 1)

      if(beat.confidence > 0.5){
        shadowMaterial.opacity = 1;
        leftShadow.main.position.x  = -shadowX;
        rightShadow.main.position.x = shadowX;
      }
    });

    this.sync.on('section', section => {
      light1.scale.set(1, 1, 1)
      light2.scale.set(1, 1, 1)

      if (section.index >= 1){
        let hue =  d3Color.hcl( d3.interpolateHslLong("#C6FFDD", "#FBD786", "#f7797d")(section.index  / SECTION_COUNT) ) .h
        let hue2 =  d3Color.hcl( d3.interpolateHslLong("#ffa600", "#da08ff", "#00ffd5")(section.index  / SECTION_COUNT) ) .h
        grid_material.color.setHSL( hue, 1, 0.8 );
        pitch_material.color.setHSL( hue, 1, 0.8 );
        shadowMaterial.color.setHSL( hue2, 1, 0.8 );



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
      barTrees.position.z +=  bar;
      if(beatTrees.position.z >= 3000) {
        beatTrees.position.z = 0;
      }
      if(barTrees.position.z >= 3000) {
        barTrees.position.z = 0;
      }

      let speed = 0.5


      if(DANCING){
        if (this.sync.bar.index % 2 == 0){
          toRotate.forEach(element => {
            rotateTree(element.toRotate, -1, speed)
          });
          toRotateBeats.forEach(element => {
            rotateTree(element.toRotate, -1, speed)
          });
        } else {
            toRotate.forEach(element => {
              rotateTree(element.toRotate, 1, speed)
            });
            toRotateBeats.forEach(element => {
              rotateTree(element.toRotate, 1, speed)
            });
        }
      }
      // leftShadow.main.children[0].material.opacity -= 0.1;

      let fadeOut = 0.03;
      shadowMaterial.opacity -= fadeOut;
      leftShadow.main.position.x -= 0.1;
      rightShadow.main.position.x += 0.1;
      leftShadow.main.scale.x -= 0.01;
      leftShadow.main.scale.y -= 0.01;
      leftShadow.main.scale.z -= 0.01;
      rightShadow.main.scale.x -= 0.01;
      rightShadow.main.scale.y -= 0.01;
      rightShadow.main.scale.z -= 0.01;

    } else {

      // console.log(this.sync.state.trackAnalysis.sections)
      getTrackFeatures(this.sync.state.trackAnalysis.sections)

      BEATS = this.sync.state.trackAnalysis.beats;
      BARS = this.sync.state.trackAnalysis.bars;
      SECTIONS = this.sync.state.trackAnalysis.sections;
      SONG_DURATION = this.sync.state.trackAnalysis.track.duration;
      SECTION_COUNT = SECTIONS.length;

      attributesSet = true;
      treePerBar();
      treePerBeat();

      let hue =  d3Color.hcl( d3.interpolateHsl("#C6FFDD", "#FBD786", "#f7797d")(0) ) .h
      pitch_material.color.setHSL( hue, 1, 0.8 );
      grid_material.color.setHSL( hue, 1, 0.8 );
    }

    //console.log(this.sync.state.trackAnalysis.track.start_of_fade_out);
    //console.log(this.sync.state.trackAnalysis.track.start_of_fade_out);
    // console.log(this.sync.state.trackProgress);



    // rotateTree(leftShadow.toRotate,  -1, 30)
    // rotateTree(rightShadow.toRotate, 1, 30)

    let volume = this.sync.volume;
    renderer.render( scene, camera );
    stats.update();

    if (volume) {
      let speed = volume * volume * volume;
      if (speed > 8)
        speed = 8
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
    let treeHue =  d3Color.hcl( d3.interpolateHsl("#1a2a6c", "#b21f1f", "#f7797d")    ( t  ) ) .h
    let anotherHue =  d3Color.hcl( d3.interpolateHsl("#1a2a6c", "#b21f1f", "#f7797d") ( 10-t   ) ) .h

    branchMaterial.color.setHSL( treeHue , 1, 0.6)
    leafMaterial.color.setHSL( anotherHue , 1, 0.8)
  }
}