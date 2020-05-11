import * as THREE from 'three'

export function rotateTree(toRotate, speed) {
    toRotate.forEach   (obj => obj.forEach((element, i) => {element.rotation.z += signum * (0.005 * speed )} ));
}

export class Tree {
    constructor(x = 0, y = 0, z = 0, degrees, individualLeavesSpeed = true){
        this.degree = THREE.Math.degToRad(degrees)
        this.branches = []
        this.leaves = []
        this.toRotate = []
        this.x = x;
        this.y = y;
        this.z = z;
        this.branchSpeed = 1
        this.leavesSpeed = 1
        this.individualLeavesSpeed = individualLeavesSpeed;
    }

    scale(factor) {
        this.main.scale.x = (factor,factor,factor)
        this.main.scale.y = (factor,factor,factor)
        this.main.scale.z = (factor,factor,factor)
    }

    makeTree(branchGeometry, leafGeometry, invisibleMaterial, branchMaterial, leafMaterial, scene) {
        let l1 = new Leaf(0, 0, 0, 1,   this.degree, leafGeometry, leafMaterial, invisibleMaterial);
        let l2 = new Leaf(0, 0, 0, -1,  this.degree, leafGeometry, leafMaterial, invisibleMaterial);
        let l3 = new Leaf(0, 0, 0, 1,   this.degree, leafGeometry, leafMaterial, invisibleMaterial);
        let l4 = new Leaf(0, 0, 0, -1,  this.degree, leafGeometry, leafMaterial, invisibleMaterial);

        let _l1 = new Leaf(0, 0, 0, 1,  this.degree, leafGeometry, leafMaterial, invisibleMaterial);
        let _l2 = new Leaf(0, 0, 0, -1, this.degree, leafGeometry, leafMaterial, invisibleMaterial);
        let _l3 = new Leaf(0, 0, 0, 1,  this.degree, leafGeometry, leafMaterial, invisibleMaterial);
        let _l4 = new Leaf(0, 0, 0, -1, this.degree, leafGeometry, leafMaterial, invisibleMaterial);

        let branch2 = new Branch(0, 0, 0, l1, l2,                           this.degree, branchGeometry, branchMaterial, scene);
        let branch3 = new Branch(0, 0, 0, l3, l4,                           this.degree, branchGeometry, branchMaterial, scene);
        let _branch2 = new Branch(0, 0, 0, _l1, _l2,                        this.degree, branchGeometry, branchMaterial, scene);
        let _branch3 = new Branch(0, 0, 0, _l3, _l4,                        this.degree, branchGeometry, branchMaterial, scene);
        let branch4 = new Branch(0, 0, 0, branch2, branch3,                 this.degree, branchGeometry, branchMaterial, scene);
        let _branch4 = new Branch(0, 0, 0, _branch2, _branch3,              this.degree, branchGeometry, branchMaterial, scene);
        let branch5 = new Branch(this.x, this.y, this.z, branch4, _branch4, this.degree, branchGeometry, branchMaterial, scene);

        this.main = branch5.group

        if( this.individualLeavesSpeed ){
            this.leaves.push( l1.toRotate )
            this.leaves.push( l2.toRotate )
            this.leaves.push( l3.toRotate )
            this.leaves.push( l4.toRotate )
            this.leaves.push( _l1.toRotate )
            this.leaves.push( _l2.toRotate )
            this.leaves.push( _l3.toRotate )
            this.leaves.push( _l4.toRotate )
            this.branches.push( branch2.toRotate )
            this.branches.push( branch3.toRotate )
            this.branches.push( _branch2.toRotate )
            this.branches.push( _branch3.toRotate )
            this.branches.push( branch4.toRotate )
            this.branches.push( _branch4.toRotate )
            this.branches.push( branch5.toRotate )
        } else {
            this.toRotate.push( l1.toRotate )
            this.toRotate.push( l2.toRotate )
            this.toRotate.push( l3.toRotate )
            this.toRotate.push( l4.toRotate )
            this.toRotate.push( _l1.toRotate )
            this.toRotate.push( _l2.toRotate )
            this.toRotate.push( _l3.toRotate )
            this.toRotate.push( _l4.toRotate )
            this.toRotate.push( branch2.toRotate )
            this.toRotate.push( branch3.toRotate )
            this.toRotate.push( _branch2.toRotate )
            this.toRotate.push( _branch3.toRotate )
            this.toRotate.push( branch4.toRotate )
            this.toRotate.push( _branch4.toRotate )
            this.toRotate.push( branch5.toRotate )
        }
    }

    // to make this function symetrical
    rotate(signum) {
            if (this.degree == 0){
                this.branches.forEach   ((obj, i) => {
                    obj.forEach((element, i) => element.rotation.z += signum * (0.005 * this.branchSpeed * ( (i/3) + 1  )))
                    if (i >= 3) obj.forEach((element, i) => element.rotation.z += signum * (0.005 * this.branchSpeed ))
                });

                // max 8
                this.leaves.forEach     ((obj, i) => {
                    obj.forEach((element, i) => element.rotation.z += signum * (0.005 * this.leavesSpeed * ( (i/3) + 1  )))
                });

            } else {
                this.branches.forEach   (obj => obj.forEach((element, i) => {element.rotation.z += signum * (0.005 * this.branchSpeed )} ));
                this.leaves.forEach     (obj => obj.forEach((element, i) => {element.rotation.z += signum * (0.005 * this.leavesSpeed )} ));
            }
    }

    rotateLeft(){
        this.rotate(1)
    }

    rotateRight(){
        this.rotate(-1)
    }
}
class Branch {
    constructor(x = 0, y = 0, z = 0, left, right, degree, geo, mat, scene){
        this.group = new THREE.Group()
        this.toRotate = []
        this.left = left
        this.right = right
        this.createEndBranch(degree, geo, mat, scene)
        this.translate(x, y, z)
    }

    translate(x, y, z) {
        this.group.translateX(x)
        this.group.translateY(y)
        this.group.translateZ(z)
    }

    createEndBranch(degree, branchGeometry, branchMaterial, scene) {
        let objBranch =  this.left.group
        let objStatic = new THREE.Mesh( branchGeometry, branchMaterial );
        let pivotPoint  = new THREE.Object3D();

        this.group.add(objBranch)
        this.group.add(pivotPoint)
        this.group.add(objStatic)

        pivotPoint.add(objBranch);

        let pos = 1.2
        objStatic.position.set(0, pos, 0);
        objStatic.add( pivotPoint );
        objBranch.scale.y = 1
        objBranch.position.set(0, 0, 0)

        this.group.add(this.right.group)

        this.right.group.rotation.z = - degree
        this.left.group.rotation.z  = degree

        this.right.group.position.set(0, pos, 0)

        this.toRotate = [ this.group ]
        this.left.toRotate.forEach(el => this.toRotate.push(el) );
        this.right.toRotate.forEach(el => this.toRotate.push(el) );

        scene.add(this.group)
    }
}

class Leaf {
    constructor(x = 0, y = 0, z = 0, signum, degree, geo, mat, invisMat){
        this.group = new THREE.Group()
        this.toRotate = []
        this.createLeaves(x, y, z, signum, degree, geo, mat, invisMat)
    }

    createLeaves(x, y, z, signum, degree, leafGeometry, leafMaterial, invisibleMaterial) {
        let objBranch = new THREE.Mesh( leafGeometry, leafMaterial );
        let objStatic = new THREE.Mesh( leafGeometry, invisibleMaterial );
        let pivotPoint  = new THREE.Object3D();

        this.group.add(objBranch)
        this.group.add(objStatic)
        pivotPoint.add(objBranch);

        objStatic.position.set(x, y, z);
        objStatic.add( pivotPoint );
        objBranch.position.set(0, 1, 0)

        this.group.z = degree * signum;
        this.toRotate = [ pivotPoint ]
    }
}
