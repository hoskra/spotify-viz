import * as THREE from 'three'

export function createGeometry(groundGeo) {
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
}