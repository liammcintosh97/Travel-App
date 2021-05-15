import TripManager from "./tripManager.js"
import CountrySearcher from "./countrySearcher.js"

const tripManager =  new TripManager();
const countrySearcher =  new CountrySearcher(document);

function start(){
  let tripForm = document.getElementsByClassName("trip-form")[0];
  let addTripButton = tripForm.getElementsByTagName("button")[0];
  let saveButton = document.getElementsByClassName("save-button")[0];
  let tripContainer = document.getElementsByClassName("trip-container")[0];
  
  countrySearcher.init();
  window.addEventListener("click",offClick);
  addTripButton.addEventListener("click",onAddTripClick);
  saveButton.addEventListener("click",onSaveClick);

  tripManager.load().then(trips =>{
    console.log(trips);
    if(trips === null || trips === undefined) return;
    for(let i = 0; i < trips.length; i++){
      trips[i].insert(document,tripContainer);
      trips[i].removeButton.addEventListener("click",()=>{
        tripManager.removeTrip(document,trips[i].data.id);
      })
    }
  })
}

function onAddTripClick(){
  let country = countrySearcher.selectedCountry
  let fromDate = document.getElementsByClassName("from-date")[0];
  let toDate = document.getElementsByClassName("to-date")[0];

  if(country === undefined){
    alert("Please select a country");
    return;
  }

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
  tripManager.save();
}

function offClick(){
  var targetElement = event.target;

  if(targetElement != countrySearcher.input) countrySearcher.showContent(false);
}

export { start }

  /*
  tripManager.addTrip("Australia","AU").then((trip) =>{
    console.log(trip)
    trip.hotelManager.add("The Royal","43 Royal Street Melbourne","05/05/21 10:00AM","06/06/21 10:00AM").then((hotel) =>{
      tripManager.log();
      trip.hotelManager.remove(hotel.id).then((data)=>{
        tripManager.log();
      })
    })
  })*/

  /*
  tripManager.addTrip("Australia","AU").then((trip) =>{
    console.log(trip)
    trip.destinationManager.add("Melbourne").then((destination) =>{
      tripManager.log();
      trip.destinationManager.remove(destination.id).then((data)=>{
        tripManager.log();
      })
    })
  })*/

  /*
  tripManager.addTrip("Australia","AU").then((trip) =>{
    console.log(trip)
    trip.flightManager.add("VA0697","05/05/21","6:50AM").then((flight) =>{
      tripManager.log();
      trip.flightManager.remove(flight.id).then((data)=>{
        tripManager.log();
      })
    })
  })*/

  /*
  tripManager.addTrip("Australia","AU").then((trip) =>{
    console.log(trip)
    trip.packingListManager.add("Socks").then((data) =>{
      tripManager.log();
      trip.packingListManager.remove(data.item).then((data)=>{
        tripManager.log();
      })
    })
  })*/

  /*
  tripManager.addTrip("Australia","AU").then((trip) =>{
    console.log(trip)
    trip.todoListManager.add("Buy passport").then((data) =>{
      tripManager.log();

      trip.todoListManager.remove(data.itemName).then((data)=>{
        tripManager.log();
      })
    })
  })*/