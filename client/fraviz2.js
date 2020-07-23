import Visualizer from './classes/visualizer'
import * as THREE from 'three'
import { init } from './fraviz/init';
import Stats from './libs/stats.module'
import { moveGrid, separatedGrids } from './fraviz/grid';
import { pitch } from './fraviz/pitch';
import { getTrackFeatures } from './fraviz/trackFeatures';
import { vertexShader, fragmentShader } from './shaders/noise_cube';
import { createGeometry, geometryWithUv } from './fraviz/shaderAssets';
import { gridVertexShader, gridFragmentShader } from './shaders/basic';
import { fractVertexShader, fractFragmentShader } from './shaders/fract';
import { lsysVertexShader, lsysFragmentShader } from './shaders/lsystems';
const dat = require('dat.gui');

import * as d3 from 'd3-scale';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Color from 'd3-color';


// basic objects
var camera, renderer, scene, stats;
var clock, clock2;
let light1, light2;
let cubes1, cubes2;

let basicMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff  } );
let uniforms, uniforms2;
let target;

let gridSpacing = 1;
let gridScale = 130;
let gridShift = 600;
let secondGrid = false;

let ground,ground2;
var option = 2;

let attributesSet = false
let isMajor = false;

// https://observablehq.com/@d3/working-with-color

let redHue = d3Interpolate.quantize(d3Interpolate.interpolateHcl("#ffd119", "#bf0050"),  5);
let blueHue = d3Interpolate.quantize(d3Interpolate.interpolateHcl("#b9e038", "#05496e"), 5);
let defaultColor = "#dff0b9";

export default class Fraviz2 extends Visualizer {
  constructor () {
    super({ volumeSmoothing: 100 })

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight , 1, 10000 );
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { antialias: true, autoSize: true  } );

    // CLOCK
    clock = new THREE.Clock;
    clock.start ();

    // STATS
    stats = new Stats();
    stats.dom.classList.add("gui");
    $("body")[0].appendChild( stats.dom );


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

    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/bayer.png');
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    uniforms = {
      iTime: { value: 0 },
      iResolution:  { value: new THREE.Vector3(1, 1, 1) },
      iChannel0: { value: texture },
      wavelength: { value: 1.0 },
      amplitude: { value: 1.0 },
      spacing: { value: 1.0 },
      speed: { value: 1.0 },
      option: { value: 2 },
      kochOption: { value: 1 },
      barPulse: { value: 0.0 },
      beatPulse: { value: 0.0 },
      clock: { value: 0.0 },
      iDepth: { value: 1 },
      gridColor: { value: new THREE.Vector3(0.5, 0.2, 0.3) },
    };

    uniforms2 = {
      iTime: { value: 0 },
      iResolution:  { value: new THREE.Vector3(1, 1, 1) },
      iChannel0: { value: texture },
      wavelength: { value: 1.0 },
      amplitude: { value: 1.0 },
      spacing: { value: 1.0 },
      speed: { value: 1.0 },
      option: { value: 2 },
      kochOption: { value: 0 },
      barPulse: { value: 0.0 },
      beatPulse: { value: 0.0 },
      clock: { value: 0.0 },
      gridColor: { value: new THREE.Vector3(0.5, 0.2, 0.3) },
    };

    const cubeMaterial = new THREE.ShaderMaterial({ vertexShader, fragmentShader, uniforms, });
    const fractMaterial = new THREE.ShaderMaterial({
      vertexShader: fractVertexShader,
       fragmentShader: fractFragmentShader,
       uniforms,
       transparent: true,
       blending: THREE.NormalBlending,
     });
    const middleFractMaterial = new THREE.ShaderMaterial({
      vertexShader: fractVertexShader,
       fragmentShader: fractFragmentShader,
       uniforms : uniforms2,
       transparent: true,
       blending: THREE.NormalBlending,
     });
    const lsysMaterial = new THREE.ShaderMaterial({
      vertexShader: lsysVertexShader,
       fragmentShader: lsysFragmentShader,
       uniforms : uniforms,
       transparent: true,
       blending: THREE.NormalBlending,
     });
    const gridMaterial = new THREE.ShaderMaterial({ vertexShader: gridVertexShader, fragmentShader: gridFragmentShader, uniforms, });

    // var cubeMaterial = new THREE.MeshPhongMaterial( { color:0xff0000, transparent:true, opacity:1 } );
    init(camera, scene, renderer);

    var uvGeo = geometryWithUv(200, 200, 30)

    var fract = new THREE.Mesh( uvGeo, fractMaterial );
    fract.position.set(0,50,100);
    scene.add(fract);

    var smallerGeo = new THREE.PlaneGeometry( 100, 100, 2 );
    var fractLeft = new THREE.Mesh( smallerGeo, middleFractMaterial );
    var fractRight = new THREE.Mesh( smallerGeo, middleFractMaterial );
    fractLeft.position.set(-150,50,100);
    fractRight.position.set(150,50,100);

    scene.add(fractLeft);
    scene.add(fractRight);


    var lsys = new THREE.Mesh( new THREE.PlaneGeometry( 50, 50, 20 ), lsysMaterial );
    lsys.position.set(0,50,300);

    scene.add(lsys);


    // GUI
    // http://stemkoski.github.io/Three.js/GUI-Controller.html
    var gui = new dat.GUI();
    var parameters = {
      gridSpacing,
      gridScale,
      gridShift,
      color: defaultColor, // color (change "#" to "0x")
      opacity: 1,
      secondGrid,
      wavelength: 1.365,
      amplitude: 0.03,
      spacing: 2.0,
      option,
      material: "Phong",
      reset: function() { resetCube() }
    };
    uniforms.wavelength.value  = parameters.wavelength;
    uniforms.amplitude.value   = parameters.amplitude;
    uniforms.spacing.value   = parameters.spacing;

    var folder1 = gui.addFolder('Grid Objects');
    var _gridSpacing = folder1.add( parameters, 'gridSpacing' ).min(-500).max(500).step(1).listen();
    var _gridScale = folder1.add( parameters, 'gridScale' ).min(0).max(300).step(1).listen();
    var _gridShift = folder1.add( parameters, 'gridShift' ).min(-800).max(800).step(1).listen();
    folder1.open();


    var folder2 = gui.addFolder('Wave Properties');
    var wavelength = folder2.add( parameters, 'wavelength' ).min(0.1).max(5).step(0.005).listen();
    var amplitude = folder2.add( parameters, 'amplitude' ).min(0.001).max(2).step(0.005).listen();
    var spacing = folder2.add( parameters, 'spacing' ).min(1.0).max(20).step(0.5).listen();
    folder2.open();

    wavelength.onChange(function(value) {   uniforms.wavelength.value = value;   });
    amplitude.onChange(function(value)  {   uniforms.amplitude.value  = value;   });
    spacing.onChange(function(value)    {   uniforms.spacing.value    = value;   });

    _gridScale.onChange(function(value)   {   gridScale = value;   });
    _gridSpacing.onChange(function(value) {   gridSpacing = value;   });
    _gridShift.onChange(function(value)   {   gridShift = value;   });

    var cubeColor = gui.addColor( parameters, 'color' ).name('Color').listen();
    cubeColor.onChange(function(value) {
      let c = d3Color.color(value);
      c.r = c.r/100;
      c.g = c.g/100;
      c.b = c.b/100;
      uniforms.gridColor.value    = c;
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

    var cubeVisible = gui.add( parameters, 'secondGrid' ).name('second grid').listen();
    cubeVisible.onChange(function(value) {
      secondGrid = value;
      ground2.position.set(gridSpacing - gridShift,-500,0);
    });

    let groundGeo = new THREE.PlaneGeometry( 100, 100, 20 )
    createGeometry(groundGeo);

    ground = new THREE.Mesh(groundGeo, gridMaterial );
    ground.position.set(-gridSpacing - gridShift,10,0);
    ground.scale.x = gridScale;
    ground.scale.y = gridScale;
    ground.scale.z = gridScale;
    scene.add(ground);

    ground2 = new THREE.Mesh( groundGeo, gridMaterial );
    ground2.position.set(gridSpacing - gridShift,-500,0);
    ground2.scale.x = gridScale;
    ground2.scale.y = gridScale;
    ground2.scale.z = gridScale;

    scene.add(ground2);
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
      } else {
        let c = d3Color.color(blueHue[x]);
        uniforms.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
        uniforms2.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
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
      } else {
        console.log("Estimation: Minor modality")
        let c = d3Color.color(blueHue[x]);
        uniforms.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
        uniforms2.gridColor.value    = new THREE.Vector3(c.r/100, c.g/100, c.b/100);
      }

      // console.log( this.sync.state.currentlyPlaying.artists[0] )
    }

    let beat = this.sync.beat.elapsed/this.sync.beat.duration;
    let bar = this.sync.bar.elapsed/this.sync.bar.duration;

    uniforms.barPulse.value = beat;
    uniforms2.barPulse.value = beat;
    uniforms.beatPulse.value = bar;
    uniforms2.beatPulse.value = bar;

    let volume = this.sync.volume;
    renderer.render( scene, camera );

    stats.update();

    let speed = volume;

    var linearScale = d3.scaleLinear()
      .domain([0, 2])
      .range([1.1, 1.5])
      .clamp(true);

    // if (volume) {
    //   speed = 0.2 + volume * volume;
    //   console.log(speed)
    //   if (speed > 3)
    //     speed = 3
    // }

    ground.position.set(- gridShift, 10 - gridSpacing/20, 0);
    ground.scale.x = gridScale;
    ground.scale.y = gridScale;
    ground.scale.z = gridScale;

    if(secondGrid) {
      ground2.position.set(-1600 - gridShift, 420 + gridSpacing, -200);
      ground2.scale.x = gridScale * 3.5;
      ground2.scale.y = gridScale * 3.5;
      ground2.scale.z = gridScale * 3.5;
      ground2.rotation.x = THREE.Math.degToRad(160)
    }

    //console.log(speed)
    // uniforms.wavelength.value = speed;
    // uniforms.amplitude.value = speed/50;
    // uniforms.spacing.value = speed;


    // uniforms.speed.value = speed;
    uniforms.speed.value = linearScale(speed);
    uniforms.iDepth.value = 6 - (this.sync.tatum.index % 5 + 1);
    // console.log((speed))
    uniforms.iTime.value = clock.getElapsedTime();

  }
}