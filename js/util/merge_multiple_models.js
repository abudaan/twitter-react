import THREE from 'three';

export default function mergeMultipleModels(model, howMany, maxMerge, scale, positioner){

  let c = 0;
  let dummy = new THREE.Object3D();
  dummy.quaternion.copy(model.quaternion);
  dummy.scale.set(scale, scale, scale);
  dummy.updateMatrix();

  let mergedGeometries = [];
  let mergedGeometry = new THREE.Geometry();
  //let mergedGeometry = new THREE.BufferGeometry(); => unfortunately, BufferGeometry.merge only works with non-indexed geometries

  for(let i = 0; i < howMany; i++){
    dummy.position.copy(positioner.next().value);
    dummy.updateMatrix();

    // merge the geometry and apply the matrix of the new position
    model.geometries.forEach((geometry, uuid) => {
      // limit the amount of geometries to merge into one geometry for memory reasons
      if(maxMerge > 0 && c === maxMerge){
        mergedGeometries.push(new THREE.BufferGeometry().fromGeometry(mergedGeometry));
        mergedGeometry = new THREE.Geometry();
        c = 0;
      }else{
        mergedGeometry.merge(geometry, dummy.matrix, model.materialIndices.get(uuid));
      }
    });

    c++;
  }

  // add the last merged geometry to the array
  if(mergedGeometry.vertices.length !== 0){
    mergedGeometries.push(new THREE.BufferGeometry().fromGeometry(mergedGeometry));
  }
  return mergedGeometries;
}
