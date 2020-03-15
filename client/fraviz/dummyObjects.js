import * as THREE from 'three'

export function createDummyObjects(scene) {
    var volumeMaterial = new THREE.MeshPhongMaterial( { color: 0xfc0303, side: THREE.DoubleSide } );
    var tatumMaterial = new THREE.MeshPhongMaterial( { color: 0xfcf403, side: THREE.DoubleSide } );
    var segmentMaterial = new THREE.MeshPhongMaterial( { color: 0x03fc0f, side: THREE.DoubleSide } );
    var beatMaterial = new THREE.MeshPhongMaterial( { color: 0x03fcf0, side: THREE.DoubleSide } );
    var barMaterial = new THREE.MeshPhongMaterial( { color: 0x0320fc, side: THREE.DoubleSide } );
    var sectionMaterial = new THREE.MeshPhongMaterial( { color: 0xfc03fc, side: THREE.DoubleSide } );

    const fontJson = require( "fonts/gentilis_regular.typeface.json" );
    const font = new THREE.Font( fontJson );

    let volumeGeo  = new THREE.TextGeometry( 'volume', { font: font,size: 55,height: 5,curveSegments: 12,bevelEnabled: true,bevelThickness: 10,bevelSize: 8,bevelOffset: 0,bevelSegments: 5} );
    volumeGeo.computeBoundingBox();
    volumeGeo.computeVertexNormals()
    let tatumGeo  = new THREE.TextGeometry( 'tatum', { font: font,size: 55,height: 5,curveSegments: 12,bevelEnabled: true,bevelThickness: 10,bevelSize: 8,bevelOffset: 0,bevelSegments: 5} );
    tatumGeo.computeBoundingBox();
    tatumGeo.computeVertexNormals()
    let segmentGeo  = new THREE.TextGeometry( 'segment', { font: font,size: 55,height: 5,curveSegments: 12,bevelEnabled: true,bevelThickness: 10,bevelSize: 8,bevelOffset: 0,bevelSegments: 5} );
    segmentGeo.computeBoundingBox();
    segmentGeo.computeVertexNormals()
    let beatGeo  = new THREE.TextGeometry( 'beat', { font: font,size: 55,height: 5,curveSegments: 12,bevelEnabled: true,bevelThickness: 10,bevelSize: 8,bevelOffset: 0,bevelSegments: 5} );
    beatGeo.computeBoundingBox();
    beatGeo.computeVertexNormals()
    let barGeo  = new THREE.TextGeometry( 'bar', { font: font,size: 55,height: 5,curveSegments: 12,bevelEnabled: true,bevelThickness: 10,bevelSize: 8,bevelOffset: 0,bevelSegments: 5} );
    barGeo.computeBoundingBox();
    barGeo.computeVertexNormals()
    let sectionGeo  = new THREE.TextGeometry( 'section', { font: font,size: 55,height: 5,curveSegments: 12,bevelEnabled: true,bevelThickness: 10,bevelSize: 8,bevelOffset: 0,bevelSegments: 5} );
    sectionGeo.computeBoundingBox();
    sectionGeo.computeVertexNormals()

    let volumeObject = new THREE.Mesh( new THREE.SphereBufferGeometry( 10 ), volumeMaterial );
    volumeObject.name ="volumeObject"
    let tatumObject = new THREE.Mesh( new THREE.SphereBufferGeometry( 10 ), tatumMaterial );
    tatumObject.name ="tatumObject"
    let segmentObject = new THREE.Mesh( new THREE.SphereBufferGeometry( 10 ), segmentMaterial );
    segmentObject.name ="segmentObject"
    let beatObject = new THREE.Mesh( new THREE.SphereBufferGeometry( 10 ), beatMaterial );
    beatObject.name ="beatObject"
    let barObject = new THREE.Mesh( new THREE.SphereBufferGeometry( 10 ), barMaterial );
    barObject.name ="barObject"
    let sectionObject = new THREE.Mesh( new THREE.SphereBufferGeometry( 10 ), sectionMaterial );
    sectionObject.name ="sectionObject"

    let volumeText = new THREE.Mesh( new THREE.BufferGeometry().fromGeometry( volumeGeo ), volumeMaterial );
    volumeText.name ="volumeText"
    let tatumText = new THREE.Mesh( new THREE.BufferGeometry().fromGeometry( tatumGeo ), tatumMaterial );
    tatumText.name ="tatumText"
    let segmentText = new THREE.Mesh( new THREE.BufferGeometry().fromGeometry( segmentGeo ), segmentMaterial );
    segmentText.name ="segmentText"
    let beatText = new THREE.Mesh( new THREE.BufferGeometry().fromGeometry( beatGeo ), beatMaterial );
    beatText.name ="beatText"
    let barText = new THREE.Mesh( new THREE.BufferGeometry().fromGeometry( barGeo ), barMaterial );
    barText.name ="barText"
    let sectionText = new THREE.Mesh( new THREE.BufferGeometry().fromGeometry( sectionGeo ), sectionMaterial );
    sectionText.name ="sectionText"

    scene.add(volumeObject)
    scene.add(tatumObject)
    scene.add(segmentObject)
    scene.add(beatObject)
    scene.add(barObject)
    scene.add(sectionObject)

    scene.add(volumeText)
    scene.add(tatumText)
    scene.add(segmentText)
    scene.add(beatText)
    scene.add(barText)
    scene.add(sectionText)
}
export function scaleDummyObjects(scene, volume, tatum, segment, beat, bar, section) {
    scene.getObjectByName("volumeObject", true).scale.set(volume ? volume : 0.00001 , volume ? volume : 0.00001 , volume ? volume : 0.00001 )
    scene.getObjectByName("tatumObject", true).scale.set(tatum ? tatum : 0.00001, tatum ? tatum : 0.00001, tatum ? tatum : 0.00001)
    scene.getObjectByName("segmentObject", true).scale.set(segment ? segment : 0.00001, segment ? segment : 0.00001, segment ? segment : 0.00001)
    scene.getObjectByName("beatObject", true).scale.set(beat ? beat : 0.00001, beat ? beat : 0.00001, beat ? beat : 0.00001)
    scene.getObjectByName("barObject", true).scale.set(bar ? bar : 0.00001, bar ? bar : 0.00001, bar ? bar : 0.00001)
    scene.getObjectByName("sectionObject", true).scale.set(section ? section : 0.00001, section ? section : 0.00001, section ? section : 0.00001)
}
export function moveDummyObjects(scene, x_position, y_position, z_position, spacing) {
    scene.getObjectByName("volumeObject", true).position.set(x_position, y_position, z_position);
    scene.getObjectByName("volumeText", true).position.set(x_position - 70, y_position - 200, z_position);
    x_position += spacing;

    scene.getObjectByName("tatumObject", true).position.set(x_position, y_position, z_position);
    scene.getObjectByName("tatumText", true).position.set(x_position - 70, y_position - 200, z_position);
    x_position += spacing;

    scene.getObjectByName("segmentObject", true).position.set(x_position, y_position, z_position);
    scene.getObjectByName("segmentText", true).position.set(x_position - 70, y_position - 200, z_position);
    x_position += spacing;

    scene.getObjectByName("beatObject", true).position.set(x_position, y_position, z_position);
    scene.getObjectByName("beatText", true).position.set(x_position - 50, y_position - 200, z_position);
    x_position += spacing;

    scene.getObjectByName("barObject", true).position.set(x_position, y_position, z_position);
    scene.getObjectByName("barText", true).position.set(x_position - 50, y_position - 200, z_position);
    x_position += spacing;

    scene.getObjectByName("sectionObject", true).position.set(x_position, y_position, z_position);
    scene.getObjectByName("sectionText", true).position.set(x_position - 70, y_position - 200, z_position);
    x_position += spacing;
}