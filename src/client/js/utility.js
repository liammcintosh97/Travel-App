export function findObjectByID(array,id){
  for(let i = 0; i < array.length; i++){
    if(array[i].id === id){
      return i;
    }
  }
}

function findStringInArray(array,toFind){
  for(let i = 0; i < array.length; i++){
    if(array[i] === toFind){
      return i;
    }
  }
}

function validateString(string){
  if(string === "" || string === null || string === undefinded);
  return true
}

export default{
  findObjectByID,
  findStringInArray,
  validateString,
}