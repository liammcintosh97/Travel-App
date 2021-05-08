import findObjectByID from "./utility"
import Communicator from "./communicator";
const regeneratorRuntime = require("regenerator-runtime");


export default class DestinationManager{
  constructor(_tripID,_destinations){
    this.tripID = _tripID;
    this.destinations = _destinations;
    this.communicator = new Communicator();
  }

  async add(_placeName){
    console.log(`Adding destination ${_placeName} to Trip ID ${this.tripID}`)
    let requestData= {
      tripID: this.tripID,
      placeName: _placeName,
    }
    return await this.communicator.Post("http://localhost:3033/addTripDestination",requestData).then(data =>{
      this.destinations.push(data);
      return data
    })
  }

  async remove(destinationID){
    console.log(`Removing destination ID ${destinationID} from Trip ID ${this.tripID}`)
    let requestData = {
      tripID: this.tripID,
      destinationID: destinationID
    }
    return await this.communicator.Post("http://localhost:3033/removeTripDestination",requestData).then(data =>{
      this.destinations.splice(data.destinationIndex,1);
      return
    })
  }
}