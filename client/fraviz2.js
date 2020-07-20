import Visualizer from './classes/visualizer'
import * as THREE from 'three'
import { init } from './fraviz/init';
import Stats from './libs/stats.module'
import { moveGrid, separatedGrids } from './fraviz/grid';
import { pitch } from './fraviz/pitch';
import { getTrackFeatures } from './fraviz/trackFeatures';
import { vertexShader, fragmentShader } from './shaders/noise_cube';
import { gridVertexShader, gridFragmentShader } from './shaders/basic';
const dat = require('dat.gui');

import * as d3 from 'd3-scale';
import * as d3Color from 'd3-color';


// basic objects
var camera, renderer, scene, stats;
var clock, clock2;
let light1, light2;
let cubes1, cubes2;

let basicMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff  } );
let uniforms;
let target;

let gridSpacing = 1;
let gridScale = 130;
let gridShift = 600;
let secondGrid = false;

let ground,ground2;
var option = 2;

let defaultColor = "#3327c9";


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

    // separatedGrids(scene, basicMaterial)


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
      gridColor: { value: new THREE.Vector3(0.5, 0.2, 0.3) },
    };

    const cubeMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const gridMaterial = new THREE.ShaderMaterial({
      vertexShader: gridVertexShader,
      fragmentShader: gridFragmentShader,
      uniforms,
    });

    // var cubeMaterial = new THREE.MeshPhongMaterial( { color:0xff0000, transparent:true, opacity:1 } );
    init(camera, scene, renderer);

    var groundGeo = new THREE.Geometry();

    var cubeGeometry = new THREE.CubeGeometry( 90, 90, 90 );
    var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );
    cube.position.set(0,30,0);
    scene.add(cube);

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
      spacing: 1.0,
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
    var spacing = folder2.add( parameters, 'spacing' ).min(0.0).max(50).step(1).listen();
    folder2.open();

    wavelength.onChange(function(value) {   uniforms.wavelength.value = value;   });
    amplitude.onChange(function(value)  {   uniforms.amplitude.value  = value;   });
    spacing.onChange(function(value)    {   uniforms.spacing.value    = value;   });

    _gridScale.onChange(function(value) {   gridScale = value;   });
    _gridSpacing.onChange(function(value) {   gridSpacing = value;   });
    _gridShift.onChange(function(value) {   gridShift = value;   });

    var cubeColor = gui.addColor( parameters, 'color' ).name('Color').listen();
    cubeColor.onChange(function(value) // onFinishChange
    {
      // cube.material.color.setHex( value.replace("#", "0x") );
      let c = d3Color.color(value);
      console.log(c)
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

    // var cubeOpacity = gui.add( parameters, 'opacity' ).min(0).max(1).step(0.01).name('Opacity').listen();
    // cubeOpacity.onChange(function(value)
    // {   cube.material.opacity = value;   });

    var optionList = [0, 1, 2];
    option = gui.add( parameters, 'option', optionList ).name('Grid type').listen();
    option.onChange(function(value)    {   uniforms.option.value    = value;   });


    var cubeVisible = gui.add( parameters, 'secondGrid' ).name('second grid').listen();
    cubeVisible.onChange(function(value) {
      secondGrid = value;
      ground2.position.set(gridSpacing - gridShift,-500,0);
    });


    let width =  10;
    let height = 10;
    const cellsAcross = width - 1;
    const cellsDeep = height  - 1;

    for (let z = 0; z < cellsDeep; ++z) {
        for (let x = 0; x < cellsAcross; ++x) {
          // the corner positions
          const x0 = x;
          const x1 = x + 1;
          const z0 = z;
          const z1 = z + 1;

          // remember the first index of these 5 vertices
          const ndx = groundGeo.vertices.length;

          // add the 4 corners for this cell and the midpoint
          groundGeo.vertices.push(
            new THREE.Vector3(x0, 0, z0),
            new THREE.Vector3(x1, 0, z0),
            new THREE.Vector3(x0, 0, z1),
            new THREE.Vector3(x1, 0, z1),
            new THREE.Vector3((x0 + x1) / 2, 0, (z0 + z1) / 2),
          );
          // create 4 triangles
          groundGeo.faces.push(
            new THREE.Face3(ndx + 0, ndx + 4, ndx + 1),
            new THREE.Face3(ndx + 1, ndx + 4, ndx + 3),
            new THREE.Face3(ndx + 3, ndx + 4, ndx + 2),
            new THREE.Face3(ndx + 2, ndx + 4, ndx + 0),
          );

          // add the texture coordinates for each vertex of each face
          const u0 = x / cellsAcross;
          const v0 = z / cellsDeep;
          const u1 = (x + 1) / cellsAcross;
          const v1 = (z + 1) / cellsDeep;
          const um = (u0 + u1) / 2;
          const vm = (v0 + v1) / 2;
          groundGeo.faceVertexUvs[0].push(
            [ new THREE.Vector2(u0, v0), new THREE.Vector2(um, vm), new THREE.Vector2(u1, v0) ],
            [ new THREE.Vector2(u1, v0), new THREE.Vector2(um, vm), new THREE.Vector2(u1, v1) ],
            [ new THREE.Vector2(u1, v1), new THREE.Vector2(um, vm), new THREE.Vector2(u0, v1) ],
            [ new THREE.Vector2(u0, v1), new THREE.Vector2(um, vm), new THREE.Vector2(u0, v0) ],
          );
        }
      }


    ground = new THREE.Mesh( groundGeo, gridMaterial );
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
    });
  }

  getSync() {
    return this.sync.state.currentlyPlaying.name + this.sync.state.currentlyPlaying.artists[0].name
  }

  paint ({ ctx, height, width, now }) {
    let beat = this.sync.beat.duration/this.sync.beat.elapsed
    let bar = this.sync.bar.duration/this.sync.bar.elapsed

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

    // uniforms.speed.value = speed;
    uniforms.speed.value = linearScale(speed);
    // console.log((speed))
    uniforms.iTime.value = clock.getElapsedTime();

  }
}