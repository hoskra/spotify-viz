import * as THREE from 'three'
const loader = new THREE.TextureLoader();
const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/bayer.png');

texture.minFilter = THREE.NearestFilter;
texture.magFilter = THREE.NearestFilter;
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;

export let uniforms = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3(1, 1, 1) },
    iChannel0: { value: texture },
    wavelength: { value: 5.2 },
    amplitude: { value: 7.0 },
    spacing: { value: 1.0 },
    speed: { value: 1.0 },
    option: { value: 2 },
    lsystemOption: { value: 2 },
    kochOption: { value: 1 },
    barPulse: { value: 0.0 },
    beatPulse: { value: 0.0 },
    clock: { value: 0.0 },
    danceability: { value: 1.0 },
    energy: { value: 1.0 },
    tempo: { value: 1.0 },
    iDepth: { value: 1 },
    gridColor: { value: new THREE.Vector3(0.5, 0.2, 0.3) },
};

export let uniforms2 = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3(1, 1, 1) },
    iChannel0: { value: texture },
    wavelength: { value: 5.2 },
    amplitude: { value: 7.0 },
    spacing: { value: 1.0 },
    speed: { value: 1.0 },
    option: { value: 0 },
    lsystemOption: { value: 0 },
    kochOption: { value: 0 },
    barPulse: { value: 0.0 },
    beatPulse: { value: 0.0 },
    clock: { value: 0.0 },
    danceability: { value: 1.0 },
    energy: { value: 1.0 },
    tempo: { value: 1.0 },
    gridColor: { value: new THREE.Vector3(0.5, 0.2, 0.3) },
};

export let uniforms3 = {
    iTime: { value: 0 },
    iResolution:  { value: new THREE.Vector3(1, 1, 1) },
    iChannel0: { value: texture },
    wavelength: { value: 5.2 },
    amplitude: { value: 7.0 },
    spacing: { value: 1.0 },
    speed: { value: 1.0 },
    option: { value: 1 },
    lsystemOption: { value: 1 },
    kochOption: { value: 0 },
    barPulse: { value: 0.0 },
    beatPulse: { value: 0.0 },
    clock: { value: 0.0 },
    danceability: { value: 1.0 },
    energy: { value: 1.0 },
    tempo: { value: 1.0 },
    gridColor: { value: new THREE.Vector3(0.5, 0.2, 0.3) },
};