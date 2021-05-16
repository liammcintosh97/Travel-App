import {findObjectByID} from "./utility"
import Communicator from "./communicator";
import Trip from "./trip";
const regeneratorRuntime = require("regenerator-runtime");

export default class TripManager{
  constructor(){
    this.trips = [];
    this.communicator = new Communicator();
  }

  async addTrip(_placeName,_countryCode,_fromDate,_toDate){
    //Adds a new trip to the application with the passed data
    let newTrip = {
      placeName: _placeName,
      countryCode: _countryCode,
      fromDate: _fromDate,
      toDate: _toDate,
    }
    return await this.communicator.Post("http://localhost:3033/addTrip",newTrip).then(data =>{

      let newTrip = new Trip(data);
      this.trips.push(newTrip);
      return newTrip;
    })
  }

  addSavedTrip(data){
    //Adds a trip from saved data to the application
    let newTrip = new Trip(data);
    this.trips.push(newTrip);
  }

  async removeTrip(document,_id){
    //Removes the trip from the application
    let tripElements = document.getElementsByClassName("trip");

    for(let i=0; i < tripElements.length;i++){
      if(tripElements[i].id === _id) tripElements[i].remove();
    }

    this.trips.splice(findObjectByID(this.trips,_id),1);
  }

  save(){
    //Saves the data from the application into local storage
    console.log(this.trips)
    let tripsData ={
      trips: []
    };

    for(let i = 0; i < this.trips.length;i++){
      tripsData.trips.push(this.trips[i].data);
    }

    window.localStorage.setItem('trips',JSON.stringify(tripsData));
  }

  async load(){
    //Load the data into the application from local storage
    let tripsData = JSON.parse(window.localStorage.getItem('trips'));
    if(tripsData === null || tripsData == undefined){
      console.log("There is no trip data to load");
      return
    }

    //Update the saves trips from the server
    return await this.communicator.Post("http://localhost:3033/updateTrips",tripsData).then(data =>{

      for(let i = 0; i < data.length;i++){
        this.addSavedTrip(data[i]);
      }
      return this.trips;
    })
  }

  log(){
    //Logs all of the trips currently in the application's memory
    console.log("Logging Trips");
    for(let i = 0; i < this.trips.length; i++){
      console.log(this.trips[i]);
    }
  }
} 