import THREE from 'three';

export default function createPositioner(settings){

  let {sceneSize: size, gridSize, maxNumberOfModels: lastStep} = settings;

  function* positionGenerator(){
    let step = 0;
    //console.log('max', lastStep);
    let x = -(size / 2) + (gridSize / 2);
    let y = -(size / 2) + (gridSize / 2);
    while(step <= lastStep){
      yield new THREE.Vector3(x, y, 0);
      step++;
      x += gridSize;
      if(x >= size / 2){
        x = -(size / 2) + (gridSize / 2);
        y += gridSize;
      }
    }
  }

  return positionGenerator();
}
