import * as THREE from 'three'
let GRID_COLOR = 0x00ffff;

function customGrid(y, xRotation = 0, yRotation = 0, zRotation = 0, degree = Math.PI / 4, three = false) {
    let grid_size = 100000, grid_step = 1000;
    let grid_geometry = new THREE.Geometry();
    let grid_material = new THREE.LineBasicMaterial({color: GRID_COLOR});
    var quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(
        new THREE.Vector3( xRotation, yRotation, zRotation ), degree );

    for (let i = - grid_size; i <= grid_size; i += grid_step){
        grid_geometry.vertices.push(new THREE.Vector3(-grid_size, y, i));
        grid_geometry.vertices.push(new THREE.Vector3(grid_size, y, i));
        grid_geometry.vertices.push(new THREE.Vector3(i, y, -grid_size));
        grid_geometry.vertices.push(new THREE.Vector3(i, y, grid_size));
    }
    let grid_line = new THREE.Line(grid_geometry, grid_material, THREE.LineSegments);
    grid_line.applyQuaternion( quaternion );

    switch(three){
        case 1:
            grid_line.translateY(y/3)
            break;
        case 2:
            grid_line.translateY(-y*3)
            break;
        case 3:
            grid_line.translateY(y/3)
            break;
        default:
            break;
    }

    return grid_line;
}

export function makeGrids(scene, numberOfGrids, spaceBetween, rotation) {
    let y = spaceBetween / numberOfGrids;
    let g1, g2, g3, g4;
    let gridObject;

    let group = new THREE.Group();
    switch (numberOfGrids){
        case 1:
            g1 = customGrid(y, 0, 0, 1, Math.PI / 1 );
            gridObject = g1;
            break;
        case 2:
            g1 = customGrid(-y, 0, 0, 1, Math.PI / 1 );
            g2 = customGrid(y, 0, 0, 1, Math.PI / 1 );
            group.add(g1);
            group.add(g2);
            gridObject = group;
            break;
        case 3:
            g1 = customGrid(y, 0, 0, 1, Math.PI * 1/3 , 1);
            g2 = customGrid(y, 0, 0, 1, Math.PI * 2/3 , 2);
            g3 = customGrid(y, 0, 0, 1, Math.PI * 3/3 , 3);
            group.add(g1);
            group.add(g2);
            group.add(g3);
            gridObject = group;
            break;
        case 4:
            g1 = customGrid(-y, 0, 0, 1, Math.PI / 2 );
            g2 = customGrid(y, 0, 0, 1, Math.PI / 2 );
            g3 = customGrid(-y, 0, 0, 1, Math.PI / 1 );
            g4 = customGrid(y, 0, 0, 1, Math.PI / 1 );
            group.add(g1);
            group.add(g2);
            group.add(g3);
            group.add(g4);
            gridObject = group;
            break;
        default:
            g1 = customGrid(-y, 0, 0, 1, Math.PI / 1 );
            g2 = customGrid(y, 0, 0, 1, Math.PI / 1 );
            group.add(g1);
            group.add(g2);
            gridObject = group;
            break;
    }
    let quaternion = new THREE.Quaternion();
    quaternion.setFromAxisAngle(
        new THREE.Vector3( 0, 0, 1 ), Math.PI / rotation );
    gridObject.applyQuaternion( quaternion );

    scene.add(gridObject);
}

export function moveGrid(scene, speed) {
    let horizonalGrid = scene.getObjectByName( "horizonalGrid" );
    horizonalGrid.children.forEach((e)=> {
      e.position.z += speed;
      if (e.position.z >= 100)
        e.position.z = -100;
    });
  }

export function separatedGrids(scene, grid_material) {
    let y = 0;
    let grid_size = 1000, grid_spacing = 50;

    // VERTICAL GRID
   let verticalGrid = new THREE.Group();
   verticalGrid.name = "verticalGrid";

   // larger at sides for wider screens
   for (let i = - grid_size*3; i <= grid_size*3; i += grid_spacing){
     let grid_geometry = new THREE.Geometry();
     grid_geometry.vertices.push(new THREE.Vector3(i, y, -grid_size));
     grid_geometry.vertices.push(new THREE.Vector3(i, y, grid_size));
     let grid_line = new THREE.Line(grid_geometry, grid_material, THREE.LineSegments);
     verticalGrid.add(grid_line)
   }

   scene.add(verticalGrid);

   // HORIZONTAL GRID
   let horizonalGrid = new THREE.Group();
   horizonalGrid.name = "horizonalGrid";

   for (let i = - grid_size; i <= grid_size; i += grid_spacing){
     let grid_geometry = new THREE.Geometry();
     grid_geometry.vertices.push(new THREE.Vector3(-grid_size, y, i));
     grid_geometry.vertices.push(new THREE.Vector3(grid_size, y, i));
     let grid_line = new THREE.Line(grid_geometry, grid_material, THREE.LineSegments);
     horizonalGrid.add(grid_line)
   }

   scene.add(horizonalGrid);
}