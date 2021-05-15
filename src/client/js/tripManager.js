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
    let newTrip = new Trip(data);
    this.trips.push(newTrip);
  }

  async removeTrip(document,_id){
    let tripElements = document.getElementsByClassName("trip");

    for(let i=0; i < tripElements.length;i++){
      if(tripElements[i].id === _id) tripElements[i].remove();
    }

    this.trips.splice(findObjectByID(this.trips,_id),1);
  }

  save(){
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
    let tripsData = JSON.parse(window.localStorage.getItem('trips'));
    if(tripsData === null || tripsData == undefined){
      console.log("There is no trip data to load");
      return
    }

    return await this.communicator.Post("http://localhost:3033/updateTrips",tripsData).then(data =>{

      for(let i = 0; i < data.length;i++){
        this.addSavedTrip(data[i]);
      }
      return this.trips;
    })
  }

  log(){
    console.log("Logging Trips");
    for(let i = 0; i < this.trips.length; i++){
      console.log(this.trips[i]);
    }
  }
} 