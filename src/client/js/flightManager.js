import findObjectByID from "./utility"
import Communicator from "./communicator";
const regeneratorRuntime = require("regenerator-runtime");

export default class FlightManager{
  constructor(_tripID,_flights){
    this.tripID = _tripID;
    this.flights = _flights;
    this.communicator = new Communicator();
  }

  async add(_flightCode,_flightDate,_flightTime){
    console.log(`Adding flight ${_flightCode} at ${_flightDate} ${_flightTime} to Trip ID ${this.tripID}`)

    let flight = {
      tripID: this.tripID,
      flightCode: _flightCode,
      flightDate: _flightDate,
      flightTime: _flightTime,
    }

    return await this.communicator.Post("http://localhost:3033/addTripFlight",flight).then(data =>{
      this.flights.push(data);
      return data;
    })
  }

  async remove(_flightID){
    let requestData = {
      tripID: this.tripID,
      flightID: _flightID
    }
    return await this.communicator.Post("http://localhost:3033/removeTripFlight",requestData).then(data =>{
      this.flights.splice(data.flightIndex,1);
      return;
    })
  }
}