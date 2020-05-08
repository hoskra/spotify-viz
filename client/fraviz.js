import Visualizer from './classes/visualizer'
import * as THREE from 'three'
import { init } from './fraviz/init';
import Stats from './libs/stats.module'
import { moveGrid, separatedGrids } from './fraviz/grid';
import { pitch } from './fraviz/pitch';
import { Tree } from './fraviz/tree';


var camera, renderer, scene, stats;
var clock, clock2;

let GRID_COLOR = 0xff0090;
let grid_material = new THREE.LineBasicMaterial({color: GRID_COLOR});
let tree
let tree2
let _tree
let _tree2

let light1;

let PITCH_MODE = 0;
let LIGHTNING = false

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

    init(camera, scene, renderer, GRID_COLOR, LIGHTNING);
    separatedGrids(scene, grid_material)


    let PITCH_COLOR = 0xd8006e;
    let SUN_INNER_COLOR = 0x21ffd2;
    let SUN_MIDDLE_COLOR = 0x00ff9c;
    let SUN_OUTER_COLOR = 0x08c30f;

    let LEAF_COLOR = 0x023bf9;
    let BRANCH_COLOR = 0x20285d;



    let pitchX = 170;
    let pitchY = 0;
    let pitchZ = -20;
    pitch(scene, "pitch1", pitchX, pitchY, pitchZ, LIGHTNING ? new THREE.MeshPhongMaterial( { color: PITCH_COLOR })
                                 : new THREE.MeshBasicMaterial( { color: PITCH_COLOR }) );

    pitch(scene, "pitch2", -pitchX, pitchY, pitchZ, LIGHTNING ? new THREE.MeshPhongMaterial( { color: PITCH_COLOR })
                                 : new THREE.MeshBasicMaterial( { color: PITCH_COLOR }) );

    let cubes2 = scene.getObjectByName( "pitch2" );
    cubes2.rotation.y = THREE.Math.degToRad(180)

    let deg = 60;

    let branchGeometry = new THREE.BoxGeometry( 0.3, 0.3,  0.3 );
    let leafGeometry = new THREE.BoxGeometry( 0.6, 0.6,  0.6 );
    let invisibleMaterial = new THREE.MeshBasicMaterial( { color: SUN_MIDDLE_COLOR, visible: true } );
    let branchMaterial = new THREE.MeshBasicMaterial( { color: SUN_INNER_COLOR } );
    let leafMaterial = new THREE.MeshBasicMaterial( { color: SUN_OUTER_COLOR } );

    if (LIGHTNING){
      leafMaterial = new THREE.MeshPhongMaterial( { color: 0xff0f0f } )
      branchMaterial = new THREE.MeshPhongMaterial( { color: 0x65c011 } )
    }

    let space_X = 10;
    let space_Z = 0;
    let y = 70;

    tree =  new Tree(-space_X, y, space_Z, deg); tree.makeTree(branchGeometry, leafGeometry, invisibleMaterial, branchMaterial, leafMaterial, scene)
    tree2 = new Tree(space_X,  y, space_Z, deg); tree2.makeTree(branchGeometry, leafGeometry, invisibleMaterial, branchMaterial, leafMaterial, scene)

    deg = 30
    y = 10;
    space_X = 60
    space_Z += 250

    branchGeometry = new THREE.BoxGeometry( 0.2, 0.6,  0.2 );
    leafGeometry = new THREE.SphereGeometry( 0.3, 4, 5 )
    invisibleMaterial = new THREE.MeshBasicMaterial( { color: 0xbd0064 , visible: false } );
    branchMaterial = new THREE.MeshBasicMaterial( { color:  BRANCH_COLOR} );
    leafMaterial = new THREE.MeshBasicMaterial( { color: LEAF_COLOR  } );

    _tree =  new Tree(-space_X, y, space_Z, deg); _tree.makeTree(branchGeometry, leafGeometry, invisibleMaterial, branchMaterial, leafMaterial, scene)
    _tree2 = new Tree(space_X,  y, space_Z, deg);  _tree2.makeTree(branchGeometry, leafGeometry, invisibleMaterial, branchMaterial, leafMaterial, scene)

    // tree.main.rotation. z = THREE.Math.degToRad(45)
    // tree2.main.rotation.z = THREE.Math.degToRad(-45)

    let factor  = 20

    tree.scale(factor)
    tree2.scale(factor)

    factor  = 10
    _tree.scale(factor)
    _tree2.scale(factor)


    // LIGHT1
    var sphere = new THREE.SphereBufferGeometry( 2, 16, 8 );

    light1 = new THREE.PointLight( 0xffffff, 20, 50 );
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
    scene.add( light1 );
  }

  hooks () {
    this.sync.on('segment', segment => {
      let pitches = this.sync.segment.pitches
      let cubes1 = scene.getObjectByName( "pitch1" );
      let cubes2 = scene.getObjectByName( "pitch2" );

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

      // console.log("bar:   " + bar.index)


    });

    this.sync.on('beat', beat => {
      light1.scale.set(1, 1, 1)

      // console.log("beat:    " + beat.index)

    });

    this.sync.on('section', section => {
      light1.scale.set(1, 1, 1)
      let cubes1 = scene.getObjectByName( "pitch1" );
      let cubes2 = scene.getObjectByName( "pitch2" );

      console.log("section:    " + section.index)

      if (section.index >= 1){

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
    let volume = this.sync.volume; let tatum = this.sync.tatum.progress * 10; let segment = this.sync.segment.progress * 10; let beat = this.sync.beat.progress * 10; let bar = this.sync.bar.progress * 10; let section = this.sync.section.progress * 10;
    renderer.render( scene, camera );
    stats.update();

    if (volume) {
      moveGrid(scene, 0.1 + (volume * volume * volume) );
    } else {
      moveGrid(scene, 0.1);
    }

    var time = Date.now() * 0.005;
    //  % 20;
    let signum

    if ( time >= 10) {
      signum = -1;
    } else {
      signum = 1;
    }

  // camera.aspect =  (signum ) * window.innerWidth / window.innerHeight;
  // camera.lookAt( 10, 10, 10 );
  //     camera.updateProjectionMatrix();
      // camera.rotation.y +=  (signum ) * camera.rotation.y;
    light1.position.x = Math.sin( time * 0.7 ) * 30;
    light1.position.y = Math.cos( time * 0.5 ) * 40 + 10;
    light1.position.z = Math.cos( time * 0.3 ) * 30 + 150;

    if (clock2.getElapsedTime ()/10 >= 1 ) {
      clock2.start();
    }

    if (this.sync.beat.index % 2 == 0){
      tree.main.position.x += 0.1;
      tree2.main.position.x -= 0.1;

      tree.rotateRight()
      tree2.rotateLeft()
      _tree.rotateRight()
      _tree.rotateRight()
      _tree2.rotateLeft()
      _tree2.rotateLeft()
    } else if (this.sync.beat.index % 2 == 1) {
      tree.main.position.x -= 0.1;
      tree2.main.position.x += 0.1;

      tree.rotateLeft()
      tree2.rotateRight()
      _tree.rotateLeft()
      _tree.rotateLeft()
      _tree2.rotateRight()
      _tree2.rotateRight()
  }




    grid_material.color.setHSL( clock2.getElapsedTime ()/10, 1, 0.8 );

  }
}