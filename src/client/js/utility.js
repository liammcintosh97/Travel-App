export function findObjectByID(array,id){
  for(let i = 0; i < array.length; i++){
    if(array[i].id === id){
      return i;
    }
  }
}

export function findStringInArray(array,toFind){
  for(let i = 0; i < array.length; i++){
    if(array[i] === toFind){
      return i;
    }
  }
}

export function validateString(string){
  if(string === "" || string === null || string === undefined) return false;
  return true
}

export function generateID(length) {
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() *
charactersLength)));
 }
 return result.join('');
}

export function addDay(date,days){
  var newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export function getDayName(date){
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  return weekday[date.getDay()];
}

export default{
  findObjectByID,
  findStringInArray,
  validateString,
  addDay,
  getDayName,
}