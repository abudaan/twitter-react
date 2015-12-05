'use strict';

import THREE from 'three';
import ColladaLoader from '../../lib/ColladaLoader';
import ObjectLoader2 from '../../lib/ObjectLoader2';

let baseUrlDAE = 'undefined';
//let baseUrlJSON = window.location.protocol + '//' + window.location.host + window.location.pathname;

THREE.Cache.enabled = true;

export default function parse(modelData, textures){
  let hasTextures = false;
  let {file: model, type, name} = modelData;
  //console.log(model, type, name, textures);

  let stamp = performance.now();
  let took;
  if(type === 'collada'){
    let colladaLoader = new THREE.ColladaLoader();
    let parser = new DOMParser();
    model = parser.parseFromString(model, 'text/xml');
    //console.log(model);
    hasTextures = getTexturesFromCollada(model, textures);

    model = colladaLoader.parse(model);
    model = model.scene;
    model.scale.set(1, 1, 1);
    if(hasTextures){
      fixTextures(model);
    }
    took = performance.now() - stamp;
    //document.dispatchEvent(new CustomEvent('parsetime', {detail: `parsing took ${took}ms`}));
    console.log('parsing took:', took);

  }else if(type === 'json'){
    let jsonLoader = new THREE.ObjectLoader2();
    hasTextures = getTexturesFromJsonModel(model, textures);

    if(typeof model.object !== 'undefined'){
      model = jsonLoader.parse(model);
      //console.log(model);
      if(model instanceof THREE.Scene){
        let group = new THREE.Group();
        model.children.forEach(function(child){
          if(hasTextures){
            fixTextures(child);
          }
          child.scale.set(1, 1, 1);
          group.add(child);
          //model.remove(child);
        });
        model = group;
      }else{
        //console.log('no object');
        if(hasTextures){
          fixTextures(model);
        }
        model.scale.set(1, 1, 1);
      }
      //console.log('json', key, model);
      took = performance.now() - stamp;
      //document.dispatchEvent(new CustomEvent('parsetime', {detail:`parsing took ${took}ms`}));
      console.log('parsing took:', took);
    }
  }
  model.name = name;
  return model;
}


function getTexturesFromCollada(xml, textures){
  let results = xml.evaluate(
    '//dae:library_images/dae:image/dae:init_from/text()',
    xml,
    function(){
      return 'http://www.collada.org/2005/11/COLLADASchema';
    }, XPathResult.ANY_TYPE, null);

  let node;
  let hasTextures = false;

  while((node = results.iterateNext()) !== null){
    let imageName = node.textContent;
    if(imageName.indexOf('/') !== -1){
      imageName = imageName.substring(imageName.lastIndexOf('/') + 1);
    }
    let img = document.createElement('img');
    if(typeof textures.file !== 'undefined'){
      img.src = textures.file;
      THREE.Cache.add(baseUrlDAE + imageName, img);
      hasTextures = true;
    }
  }
  //console.log(THREE.Cache);
  return hasTextures;
}


function getTexturesFromJsonModel(json, textures){
  if(typeof json.images === 'undefined'){
    return false;
  }
  let hasTextures = false;

  json.images.forEach(function(image){
    let img = document.createElement('img');
    if(textures.has(image.url)){
      img.src = textures.get(image.url);
      //console.log(baseUrlJSON + image.name, img);
      THREE.Cache.add(image.name, img);
      hasTextures = true;
    }
  });
  //console.log(THREE.Cache);
  return hasTextures;
}


function fixTextures(model){
  model.traverse(function(child){
    if(child.material && child.material.map) {
      //console.log(child.material.map);
      child.material.emissive = new THREE.Color(0, 0, 0);
      // child.material.map.wrapS = THREE.ClampToEdgeWrapping;
      // child.material.map.wrapT = THREE.ClampToEdgeWrapping;
      // child.material.map.minFilter = THREE.LinearFilter;
      child.material.needsUpdate = true;
    }
  });
}
