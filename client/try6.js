import Visualizer from './classes/visualizer'
import * as THREE from 'three'
import { init } from './fraviz/init';
import Stats from './libs/stats.module'
import { moveGrid, separatedGrids } from './fraviz/grid';
import { triangle, pitch } from './fraviz/fractalTry';

var camera, renderer, scene, stats;
var clock, clock2;

let light1;

let GRID_COLOR = 0xff0090;
let grid_material = new THREE.LineBasicMaterial({color: GRID_COLOR});

export default class Try5 extends Visualizer {
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
    $("body")[0].appendChild( stats.dom );

    init(camera, scene, renderer, GRID_COLOR);
    separatedGrids(scene, grid_material)
    // triangle(scene);
    pitch(scene);

    // LIGHT1
    var sphere = new THREE.SphereBufferGeometry( 2, 16, 8 );

    light1 = new THREE.PointLight( 0xffffff, 20, 50 );
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
    scene.add( light1 );
  }

  hooks () {

    this.sync.on('segment', segment => {
      let pitches = this.sync.segment.pitches
      let cubes = scene.getObjectByName( "cubes" );

      if (pitches) {
        cubes.children.forEach((cube, index) => {
          cube.scale.set(1, 10 * pitches[index], 1)
        });
      }
    });

    this.sync.on('bar', bar => {
      light1.scale.set(3, 3, 3)
    });

    this.sync.on('beat', beat => {
      light1.scale.set(1, 1, 1)
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

    light1.position.x = Math.sin( time * 0.7 ) * 30;
    light1.position.y = Math.cos( time * 0.5 ) * 40 + 10;
    light1.position.z = Math.cos( time * 0.3 ) * 30 + 150;

    if (clock2.getElapsedTime ()/10 >= 1 ) {
      clock2.start();
    }

    grid_material.color.setHSL( clock2.getElapsedTime ()/10, 1, 0.8 );

  }
}