import Visualizer from './classes/visualizer'
import * as THREE from 'three'
import * as d3 from 'd3-interpolate'

import { makeGrids } from './fraviz/grid'

// DEFAULT VALUES
let TRIPLE = false;
let OUTPUT_PITCH = false
let FACTOR_OF_SHORTENING = 0.5
let BACKGROUND_COLOR = 0x000000;

// VARIABLES
var scene, camera, renderer;
let group2 = new THREE.Group();
let group3 = new THREE.Group();
let group4 = new THREE.Group();
let group5 = new THREE.Group();
let group6 = new THREE.Group();



function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

// ( left-right, up-down, front-behind )
// (x, y, z)

function extrudeCurve(verticies, extrude, color) {
  let tubeGeometry = new THREE.TubeBufferGeometry( verticies, 2, extrude,  300, false );
  let material = new THREE.MeshLambertMaterial( { color: color } );
  let curveObject = new THREE.Mesh( tubeGeometry, material );
  scene.add( curveObject );
  return curveObject;
}

function lX(angle, x, hypotenuse) {
  return - (hypotenuse * FACTOR_OF_SHORTENING * Math.abs(Math.cos(angle)) + x)
}

function lY(angle, hypotenuse) {
  return (hypotenuse * FACTOR_OF_SHORTENING * Math.abs(Math.sin(angle))) + hypotenuse
}

function rX(angle, x, hypotenuse) {
  return (hypotenuse * FACTOR_OF_SHORTENING * Math.abs(Math.cos(360 - angle))) + x
}

function rY(angle, hypotenuse) {
  return (hypotenuse * FACTOR_OF_SHORTENING * Math.abs(Math.sin(360 - angle))) + hypotenuse
}

function wannaBeFractal(group, color) {
  let object;
  let x = 0; let y = 0; let z = 0; let length = 100; let angle = 45; let width = 10; y += length

  let firstSegment = extrudeCurve(new THREE.CatmullRomCurve3( [new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( x, y, 0 ) ]), width, color);   group.add(firstSegment)
  let segment = new THREE.Group();

  let left_X = lX(angle, x, y); let left_Y = lY(angle, y); let right_X = rX(angle, x, y); let right_Y = rY(angle, y);

  // console.log(left_X + "   " + left_Y)
  // console.log(right_X + "   " + right_Y)

  object = extrudeCurve(new THREE.CatmullRomCurve3( [new THREE.Vector3( x, y, 0 ), new THREE.Vector3( lX(angle, x, y), lY(angle, y), 0 ) ]), width, color);   segment.add(object);
  object = extrudeCurve(new THREE.CatmullRomCurve3( [new THREE.Vector3( x, y, 0 ), new THREE.Vector3( rX(angle, x, y), rY(angle, y), 0 ) ]), width, color);   segment.add(object);
  group.add(segment)

  var leftCopy = segment.clone()
  leftCopy.scale.set(FACTOR_OF_SHORTENING, FACTOR_OF_SHORTENING, FACTOR_OF_SHORTENING)
  leftCopy.rotateZ(Math.PI / 3);
  leftCopy.translateX(110)
  leftCopy.translateY(45)

  var rightCopy = segment.clone();
  rightCopy.scale.set(FACTOR_OF_SHORTENING, FACTOR_OF_SHORTENING, FACTOR_OF_SHORTENING)
  rightCopy.rotateZ(5 * Math.PI / 3);
  rightCopy.translateY(45)
  rightCopy.translateX(-105)

  group.add( leftCopy ); group.add( rightCopy );

  if(TRIPLE) {
    let copy1 = group.clone();
    let copy2 = group.clone();

    copy1.rotateZ(120 * (Math.PI/180));
    copy2.rotateZ(240 * (Math.PI/180));

    group.add(copy1)
    group.add(copy2)
  }

  scene.add(group)
}



export default class Try1 extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 100 })

    let canvas = document.getElementsByTagName('canvas')
    for (let element of canvas) {
      element.parentNode.removeChild(element);
    }

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

     // OBJECTS
     wannaBeFractal(group2, 0xff00ff)
     wannaBeFractal(group3, 0xff00ff)
     wannaBeFractal(group4, 0x9442ff)
     wannaBeFractal(group5, 0x9442ff)
     wannaBeFractal(group6, 0xfff200)

     group2.rotateZ(180 * (Math.PI/180))
     group3.rotateZ(180 * (Math.PI/180))
     group6.scale.set(0.5, 0.5, 0.5)
    }

  hooks () {
    if (OUTPUT_PITCH){
      this.sync.on('segment', segment => {
        segment.pitches.forEach((x, i) => {
          if(x === 1){
            switch (i){
              // chromaticka stupnice
              // C C# D D# E F F# G G# A A# H
              case 0:
                console.log("C")
              case 1:
                console.log("C#")
              case 2:
                console.log("D")
              case 3:
                console.log("D#")
              case 4:
                console.log("E")
              case 5:
                console.log("F")
              case 6:
                console.log("F#")
              case 7:
                console.log("G")
              case 8:
                console.log("G#")
              case 9:
                console.log("A")
              case 10:
                console.log("A#")
              case 11:
                console.log("H")
              default:
                console.log()
              }
            }
        });
      })
    }
  }

  paint ({ ctx, height, width, now }) {
    renderer.render( scene, camera );
    let tatumID = this.sync.tatum.index % 2 ? this.sync.tatum.progress : 1 - this.sync.tatum.progress
    let speedTatum = d3.interpolateNumber(this.sync.volume, tatumID)
    let speedTatumInterpolated = speedTatum(0.5)

    let speed = (this.sync.volume * 10) * (this.sync.volume * 10) * (this.sync.volume * 10)
    speed = speed / 50

    camera.position.z -= speed
    // camera.rotation.z -= speed
    if(camera.position.z < -1000){ camera.position.z = 1000; }

    let camZ = camera.position.z;

    let volume = this.sync.volume * 10;
    let tatum = this.sync.tatum.confidence * 10;
    let segment = this.sync.segment.confidence * 10;
    let beat = this.sync.beat;
    let bar = this.sync.bar.confidence * 10;
    let section = this.sync.section.tempo * 0.1;

    let x_position = -100;
    let y_position = 0;
    let z_position = -400 + camZ;
    let spacing = 200;

    group2.position.set(x_position - spacing, y_position + 350, z_position - 150)
    group3.position.set(x_position + spacing , y_position + 350, z_position - 150)
    group4.position.set(x_position - 2 * spacing, y_position, z_position + 50)
    group5.position.set(x_position + 2 * spacing , y_position, z_position + 50)
    group6.position.set(x_position, y_position, z_position + 100)

    this.sync.beat.index % 2 ? group2.rotateZ(1 * (Math.PI/180)) : group2.rotateZ(-1 * (Math.PI/180))
    this.sync.beat.index % 2 ? group3.rotateZ(-1 * (Math.PI/180)) : group3.rotateZ(1 * (Math.PI/180))

    let scale = this.sync.bar.index % 2 ? this.sync.bar.progress : 1 - this.sync.bar.progress
    let scaleFactor = d3.interpolateNumber(this.sync.volume, scale)
    scale = scaleFactor(0.5)

    group4.scale.set(scale, scale, scale)
    group5.scale.set(scale, scale, scale)

    this.sync.bar.index % 2 ? group4.rotateZ(1 * (Math.PI/180)) : group4.rotateZ(-1 * (Math.PI/180))
    this.sync.bar.index % 2 ? group5.rotateZ(-1 * (Math.PI/180)) : group5.rotateZ(1 * (Math.PI/180))

    let scaleFactor2 = d3.interpolateNumber(this.sync.volume, tatumID)
    tatumID = scaleFactor2(0.5)
    this.sync.tatum.index % 2 ? group6.rotateX(-5 * (Math.PI/180)) : group6.rotateX(5 * (Math.PI/180))

    var interpolate = d3.piecewise(d3.interpolateRgb.gamma(2.2), ["red", "blue"]);

    group6.children.forEach(element => {
      element.material = new THREE.MeshLambertMaterial( { color: interpolate(tatumID) } );
      element.children &&
      element.children.forEach(childElement => {
        childElement.material = new THREE.MeshLambertMaterial( { color: interpolate(tatumID) } );
          childElement.children &&
          childElement.children.forEach(childChildElement =>
            { childChildElement.material = new THREE.MeshLambertMaterial( { color: interpolate(tatumID) } )} )
        })
    });
  }
}