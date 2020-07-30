import Visualizer from './classes/visualizer'
import * as THREE from 'three'
import { init } from './fraviz/init';
import Stats from './libs/stats.module'
import { vertexShader, fragmentShader } from './shaders/noise_cube';
import { createGeometry, createFravizMaterial } from './fraviz/shaderAssets';
import { gridVertexShader, gridFragmentShader } from './shaders/basic';
import { fractVertexShader, fractFragmentShader } from './shaders/fract';
import { lsysVertexShader, lsysFragmentShader } from './shaders/lsystems';
import { uniforms, uniforms2, uniforms3 } from './shaders/uniforms';

const dat = require('dat.gui');

import * as d3 from 'd3-scale';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Color from 'd3-color';

// basic objects
var camera, renderer, scene, stats;
var clock;

let basicMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff  } );

let gridSpacing = 1;
let grid = -1000;
let trees = 35;
let koch = -34;

let ground,ground2;
var option = 2;

let attributesSet = false
let isMajor = false;

let redHue = d3Interpolate.quantize(d3Interpolate.interpolateHcl("#ffd119", "#bf0050"),  5);  // https://observablehq.com/@d3/working-with-color
let blueHue = d3Interpolate.quantize(d3Interpolate.interpolateHcl("#b9e038", "#05496e"), 5);
let defaultColor = "#dff0b9";

let audienceGroup = new THREE.Group();
let plane, fractLeft, fractRight, lsys, lsys2, lsysCenter;

export default class Fraviz2 extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 100 })

    // INITIALIZATION
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight , 1, 10000 );
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true, autoSize: true  } );
    init(camera, scene, renderer);

    // CLOCK
    clock = new THREE.Clock;
    clock.start ();

    // STATS
    stats = new Stats();
    stats.dom.classList.add("gui");
    $("body")[0].appendChild( stats.dom );

    // MATERIALS
    const cubeMaterial = createFravizMaterial( vertexShader, fragmentShader, uniforms);
    const fractMaterial = createFravizMaterial(fractVertexShader, fractFragmentShader, uniforms);
    const middleFractMaterial = createFravizMaterial(fractVertexShader, fractFragmentShader, uniforms2);
    const lsysMaterial = createFravizMaterial(lsysVertexShader, lsysFragmentShader, uniforms);
    const lsysMaterial2 = createFravizMaterial(lsysVertexShader, lsysFragmentShader, uniforms2);
    const lsysMaterial3 = createFravizMaterial(lsysVertexShader, lsysFragmentShader, uniforms3);
    const gridMaterial = createFravizMaterial(gridVertexShader, gridFragmentShader, uniforms);


    var geo = new THREE.PlaneGeometry( 1000, 500, 100 );
    plane = new THREE.Mesh( geo, gridMaterial );

    plane.position.set(0,-1000,10);
    plane.rotation.x = THREE.Math.degToRad(70)
    plane.scale.x = 10;
    plane.scale.y = 10;
    plane.scale.z = 10;

    scene.add(plane);

    var uvGeo = new THREE.PlaneGeometry( 260, 260, 60 );
    var fract = new THREE.Mesh( uvGeo, fractMaterial );
    var fract2 = new THREE.Mesh( uvGeo, fractMaterial );

    fract.position.set(0,50,100);
    scene.add(fract);

    var smallerGeo = new THREE.PlaneGeometry( 100, 100, 30 );
    fractLeft = new THREE.Mesh( smallerGeo, middleFractMaterial );
    fractRight = new THREE.Mesh( smallerGeo, middleFractMaterial );
    fractLeft.position.set(-180,koch,100);
    fractRight.position.set(180,koch,100);

    scene.add(fractLeft);
    scene.add(fractRight);


    // LSYSTEM FRACTAL OBJECTS
    lsys = new THREE.Mesh( new THREE.PlaneGeometry( 50, 50, 20 ), lsysMaterial3 );
    lsys2 = new THREE.Mesh( new THREE.PlaneGeometry( 50, 50, 20 ), lsysMaterial2 );
    lsysCenter = new THREE.Mesh( new THREE.PlaneGeometry( 50, 50, 20 ), lsysMaterial );
    lsys.position.set(-50,trees,300);
    lsys2.position.set(50,trees,300);
    lsysCenter.position.set(0,50,300);
    scene.add(lsys);
    scene.add(lsys2);
    scene.add(lsysCenter);

    let leftAudience = lsysCenter.clone();
    leftAudience.position.set(-50,35,330);
    audienceGroup.add(leftAudience);
    let rightAudience = lsysCenter.clone();
    rightAudience.position.set(50,35,330);
    audienceGroup.add(rightAudience);




    // GUI
    // http://stemkoski.github.io/Three.js/GUI-Controller.html
    var gui = new dat.GUI();
    var parameters = { gridSpacing,
       color: defaultColor,
       grid: 1,
       trees: 1,
       koch: 1,
       opacity: 1,
       wavelength: 5.2,
       amplitude: 7.03,
       spacing: 2.0,
       option: 2,
       material: "Phong",
       angle: 30,
     reset: function() { resetCube() }};

    uniforms.wavelength.value  = parameters.wavelength;
    uniforms.amplitude.value   = parameters.amplitude;
    uniforms.spacing.value   = parameters.spacing;

    var folder1 = gui.addFolder('Placement');
    var _grid = folder1.add( parameters, 'grid' ).min(-1000).max(500).step(1).listen();
    var _trees = folder1.add( parameters, 'trees' ).min(0).max(300).step(1).listen();
    var _koch = folder1.add( parameters, 'koch' ).min(-800).max(800).step(1).listen();
    folder1.open();

    gui.close()
    var folder2 = gui.addFolder('Wave Properties');
    var wavelength = folder2.add( parameters, 'wavelength' ).min(0.1).max(20).step(0.005).listen();
    var amplitude = folder2.add( parameters, 'amplitude' ).min(0.001).max(20).step(0.005).listen();
    var spacing = folder2.add( parameters, 'spacing' ).min(1.0).max(20).step(0.5).listen();
    folder2.open();

    uniforms.lsystemOption.value = 2;
    uniforms2.lsystemOption.value = 0;
    uniforms3.lsystemOption.value = 1;
    uniforms.option.value = 2;

    wavelength.onChange(function(value) {   uniforms.wavelength.value = value;   });
    amplitude.onChange(function(value)  {   uniforms.amplitude.value  = value;   });
    spacing.onChange(function(value)    {   uniforms.spacing.value    = value;   });

    _grid.onChange(function(value)   {   grid = value;   });
    _trees.onChange(function(value) {    trees = value;   });
    _koch.onChange(function(value)   {   koch = value;   });

    var cubeColor = gui.addColor( parameters, 'color' ).name('Color').listen();
    cubeColor.onChange(function(value) {
      let c = d3Color.color(value);
      c.r = c.r/100;
      c.g = c.g/100;
      c.b = c.b/100;
      // uniforms.gridColor.value    = c;
      // uniforms2.gridColor.value    = c;
      // uniforms3.gridColor.value    = c;

      scene.background.r = c.r;
      scene.background.g = c.g;
      scene.background.b = c.b;
      console.log(scene)
    });

    let c = d3Color.color(defaultColor);
    c.r = c.r/100;
    c.g = c.g/100;
    c.b = c.b/100;
    uniforms.gridColor.value    = c;
    uniforms.gridColor.value    = c;

    var optionList = [0, 1, 2];
    option = gui.add( parameters, 'option', optionList ).name('Grid type').listen();
    option.onChange(function(value)    {   uniforms.option.value    = value;   });


    // var cubeVisible = gui.add( parameters, 'secondGrid' ).name('second grid').listen();
    // cubeVisible.onChange(function(value) {
    //   secondGrid = value;
    //   ground2.position.set(gridSpacing - gridShift,-500,0);
    // });


    var angle = gui.add( parameters, 'angle' ).min(1.0).max(360).step(1.0).listen();
    angle.onChange(value => {
      plane.rotation.x = THREE.Math.degToRad(value)
    } )

  }

  hooks () {
    this.sync.on('segment', segment => {
      // pitches = this.sync.segment.pitches
    });

    this.sync.on('bar', bar => {
    });

    this.sync.on('beat', beat => {
    });

    this.sync.on('section', section => {
      let x = (section.index) % 5;
      x = (section.index % 10) > 4 ? 4 - x : x;

      if (isMajor) {
        let c = d3Color.color(redHue[x]);
        uniforms.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
        uniforms2.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
        uniforms3.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
      } else {
        let c = d3Color.color(blueHue[x]);
        uniforms.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
        uniforms2.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
        uniforms3.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
      }
    });
  }

  getSync() {
    return this.sync.state.currentlyPlaying.name + this.sync.state.currentlyPlaying.artists[0].name
  }

  paint ({ ctx, height, width, now }) {
    if (!attributesSet) {
      attributesSet = true;
      let x = (this.sync.section.index) % 5;
      x = (this.sync.section.index % 10) > 4 ? 4 - x : x;
      isMajor = this.sync.state.trackFeatures.mode;

      if(isMajor) {
        console.log("Estimation: Major modality")
        let c = d3Color.color(redHue[x]);
        uniforms.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
        uniforms2.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
        uniforms3.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
      } else {
        console.log("Estimation: Minor modality")
        let c = d3Color.color(blueHue[x]);
        uniforms.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
        uniforms2.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
        uniforms3.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
      }

      // console.log( this.sync.state.currentlyPlaying.artists[0] )

      if ( this.sync.state.trackFeatures.danceability > 0.65 ) {
        uniforms.option.value = 0;
      }

      //
      if ( this.sync.state.trackFeatures.energy > 0.5 ) {
        uniforms.wavelength.value = 4.58;
        uniforms.amplitude.value  = 7.15
      }

      if ( this.sync.state.trackFeatures.liveness >= 0.8 ) {
        scene.add(audienceGroup);
      }

      // slow long waves
      if (this.sync.state.trackFeatures.energy < 0.4 ) {
        uniforms.wavelength.value = 3.26;
        uniforms.amplitude.value  = 2.7;
      }



    }

    let beat = this.sync.beat.elapsed/this.sync.beat.duration;
    let bar = this.sync.bar.elapsed/this.sync.bar.duration;

    uniforms.barPulse.value = beat;
    uniforms2.barPulse.value = beat;
    uniforms3.barPulse.value = beat;
    uniforms.beatPulse.value = bar;
    uniforms2.beatPulse.value = bar;
    uniforms3.beatPulse.value = bar;

    let volume = this.sync.volume;
    renderer.render( scene, camera );

    stats.update();

    let speed = volume;

    var linearScale = d3.scaleLinear()
      .domain([0, 2])
      .range([1.1, 1.5])
      .clamp(true);

    plane.position.y = grid
    fractLeft.position.y = koch;
    fractRight.position.y = koch;

    lsys.position.y = trees;
    lsys2.position.y = trees;
    lsysCenter.position.y = trees;

    uniforms.speed.value = linearScale(speed);
    uniforms.iDepth.value = 6 - (this.sync.tatum.index % 5 + 1);
    uniforms.iTime.value = clock.getElapsedTime() % 20 + 2;

  }
}