import TripManager from "./tripManager.js"
import CountrySearcher from "./countrySearcher.js"

const tripManager =  new TripManager();
const countrySearcher =  new CountrySearcher(document);

function start(){
  //Get the applications main elements
  let tripForm = document.getElementsByClassName("trip-form")[0];
  let addTripButton = tripForm.getElementsByTagName("button")[0];
  let saveButton = document.getElementsByClassName("save-button")[0];
  let tripContainer = document.getElementsByClassName("trip-container")[0];
  
  //Initialize form elements
  countrySearcher.init();
  window.addEventListener("click",offClick);
  addTripButton.addEventListener("click",onAddTripClick);
  saveButton.addEventListener("click",onSaveClick);

  //Load the saved trips from the browsers local storage
  tripManager.load().then(trips =>{
    console.log(trips);
    if(trips === null || trips === undefined) return;
    //Loop through the returned trips initialize them and insert them in the document
    for(let i = 0; i < trips.length; i++){
      trips[i].insert(document,tripContainer);
      trips[i].removeButton.addEventListener("click",()=>{
        tripManager.removeTrip(document,trips[i].data.id);
      })
    }
  })
}

function onAddTripClick(){
  //Get the input elements for the new trip
  let country = countrySearcher.selectedCountry
  let fromDate = document.getElementsByClassName("from-date")[0];
  let toDate = document.getElementsByClassName("to-date")[0];

  //Validate input
  if(country === undefined){
    alert("Please select a country");
    return;
  }

  //Add a new trip
  tripManager.addTrip(country.name,country.code,fromDate.value,toDate.value).then((trip) =>{
    let tripContainer = document.getElementsByClassName("trip-container")[0];
    console.log(trip);
    trip.insert(document,tripContainer);
    trip.removeButton.addEventListener("click",()=>{
      tripManager.removeTrip(document,trip.data.id);
    })
  })
}

function onSaveClick(){
  //Save the current trips
  tripManager.save();
}

function offClick(){
  //Close any open interactables
  var targetElement = event.target;

  if(targetElement != countrySearcher.input) countrySearcher.showContent(false);
}

export { start }