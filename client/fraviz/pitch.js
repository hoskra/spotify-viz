import * as THREE from 'three'

export function pitch(scene, name, x, y, z, material) {
    // CUBES
    let cubes = new THREE.Group();
    cubes.name = name;

    let start = -50;
    let spacing = 5;

    for(let i=0; i <=11; i++){
        let cube = new THREE.Mesh( new THREE.BoxGeometry( 10, 10, 10 ), material);
        cube.position.set(start + i * (10 + spacing), 10, 0);
        cubes.add(cube)
    }
    scene.add(cubes);
    cubes.position.x = x;
    cubes.position.y = y;
    cubes.position.z = z;
}