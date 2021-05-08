function findObjectByID(array,id){
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

export default{
  findObjectByID,
  findStringInArray
}