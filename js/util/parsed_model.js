import THREE from 'three';
import React from 'react';
import ReactTHREE from 'react-three';

let Mesh = ReactTHREE.Mesh;

export default class ParsedModel{

  constructor(model, quaternion = new THREE.Quaternion()){
    this.model = model;
    this.name = model.name;
    this.quaternion = quaternion;
    this.geometries = new Map();
    this.materialIndices = new Map();
    this.materialsArray = [];
    this.merge = true;

    // adjust the rotation of the model according to the rotation of the world
    this.model.quaternion.copy(this.quaternion);
    this.model.updateMatrix();

    let index = 0;
    this.model.traverse((child) => {
      if(child instanceof THREE.Mesh){
        // create an array of the use materials
        let uuid = child.material.uuid;
        this.materialIndices.set(uuid, index++);
        this.materialsArray.push(child.material);
        this.geometries.set(uuid, child.geometry);
      }
    });
    console.log('number of geometries merged', index);

    // create multimaterial
    this.material = new THREE.MeshFaceMaterial(this.materialsArray);

    let merged = new THREE.Geometry();
    // merge the geometry and apply the matrix of the new position
    this.geometries.forEach((g, uuid) => {
      merged.merge(g, this.model.matrix, this.materialIndices.get(uuid));
    });

    this.mergedGeometry = new THREE.BufferGeometry().fromGeometry(merged);
  }


  /*
    I don't think the 2 metods below should be in this class
    -> these are methods that should be in the accompanying React component, model.react.js in this case
  */

  getReactComponent(position, scale){
    let children = [];
    this.geometries.forEach((geometry, uuid) => {
      let material = this.materialsArray[this.materialIndices.get(uuid)];
      //console.log(this.materialIndices.get(uuid), material);
      children.push(
        <Mesh
          key={uuid}
          geometry={geometry}
          material={material}
        />
      );
    });

    return (
      <Mesh
        key={THREE.Math.generateUUID()}
        quaternion={this.quaternion}
        position={position}
        scale={scale}
      >
        {children}
      </Mesh>
    );
  }

  getMergedReactComponent(position, scale){
    return (
      <Mesh
        geometry={this.mergedGeometry}
        key={THREE.Math.generateUUID()}
        material={this.material}
        position={position}
        scale={scale}
      />
    );
  }
}
