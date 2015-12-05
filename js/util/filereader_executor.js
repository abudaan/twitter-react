export default function createExecutor(file){
  return function(resolve, reject){
    let fileName = file.name;
    let fileType = file.type;
    let fileReader = new FileReader();

    if(fileType){
      if(fileType.indexOf('collada') !== -1 || fileType.indexOf('dae') !== -1){
        fileType = 'collada';
      }
    }else{
      fileType = fileName.toLowerCase().substring(fileName.lastIndexOf('.') + 1);
      if(fileType === 'dae'){
        fileType = 'collada';
      }
    }
    //console.log(fileName, fileType);

    if(fileType.indexOf('image') !== -1){
      fileType = 'image';
      fileReader.readAsDataURL(file);
    }else if(fileType === 'collada'){
      fileReader.readAsText(file);
    }else if(fileType === 'json' || fileType === 'js' || fileType.indexOf('json') !== -1){
      fileType = 'json';
      fileReader.readAsText(file);
    }

    fileReader.addEventListener('load', () => {
      if(fileType === 'image'){
        resolve({name: fileName, file: fileReader.result, type: fileType});
      }else if(fileType === 'collada'){
        resolve({name: fileName, file: fileReader.result, type: fileType});
      }else if(fileType === 'json'){
        resolve({name: fileName, file: JSON.parse(fileReader.result), type: fileType});
      }
    });

    fileReader.addEventListener('error', reject);
    fileReader.addEventListener('abort', reject);
  };
}
