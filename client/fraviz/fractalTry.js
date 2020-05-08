import * as THREE from 'three'

export function triangle(scene) {
    // TRIANGLE
    var geom = new THREE.Geometry();
    var v1 = new THREE.Vector3(0,0,0);
    var v2 = new THREE.Vector3(30,0,0);
    var v3 = new THREE.Vector3(30,30,0);
    var v4 = new THREE.Vector3(-30,30,0);

    geom.vertices.push(v1);
    geom.vertices.push(v2);
    geom.vertices.push(v3);
    geom.vertices.push(v4);

    geom.faces.push(  new THREE.Face3( 0, 1, 3 ),
                        new THREE.Face3( 0, 1, 2 ) );

    geom.computeFaceNormals();

    let triangle_mat = new THREE.MeshPhongMaterial( { color: 0xffffff } )
    let triangle = new THREE.Mesh( geom, triangle_mat );

    scene.add(triangle);

    triangle.position.x = -5;
    triangle.position.y = 10;
    triangle.position.z = -200;

    triangle.name = "triangle";

    // var quaternion = new THREE.Quaternion();
    // quaternion.setFromAxisAngle(
    //   new THREE.Vector3( 0, 0, 1 ), Math.PI/3 );
    // cubes.applyQuaternion( quaternion );
}

export function pitch(scene) {
    // CUBES
    let green = new THREE.MeshPhongMaterial( { color: 0x00ffff } )
    let cubes = new THREE.Group();
    cubes.name = "cubes";

    let start = -100;
    let spacing = 10;

    for(let i=0; i <=11; i++){
        let cube = new THREE.Mesh( new THREE.BoxGeometry( 10, 10, 10 ), green);
        cube.position.set(start + i * (10 + spacing), 10, 0);
        cubes.add(cube)
    }
    scene.add(cubes);
    cubes.position.z = 150;
}