export function findObjectByID(array,id){
   //Returns the index of the passed object in the passed array based on the id property
  for(let i = 0; i < array.length; i++){
    if(array[i].id === id){
      return i;
    }
  }
}

export function findStringInArray(array,toFind){
  //Returns the index of the passed string in the passed array
  for(let i = 0; i < array.length; i++){
    if(array[i] === toFind){
      return i;
    }
  }
}

export function validateString(string){
  //Checked if a string is valid and has value
  if(string === "" || string === null || string === undefined) return false;
  return true
}

export function generateID(length) {
  //Generates a string of random characters and numbers with a given length
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
  //Adds a day to the passed date
  var newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}

export function getDayName(date){
  //Gets a day's name from it's associated number
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