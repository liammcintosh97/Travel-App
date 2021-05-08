import findObjectByID from "./utility"
import Communicator from "./communicator";
const regeneratorRuntime = require("regenerator-runtime");

export default class HotelManager{
  constructor(_tripID,_hotels){
    this.tripID = _tripID;
    this.hotels = _hotels;
    this.communicator = new Communicator();
  }

  async add(name,address,checkIn,checkOut){
    console.log(
      `Adding hotel ${name}, ${address} to Trip ID ${this.tripID}
       Check in: ${checkIn}
       Check out: ${checkOut}`)

    let hotel = {
      tripID: this.tripID,
      hotelName: name,
      hotelAddress: address,
      checkIn: checkIn,
      checkOut: checkOut,
    }
    return await this.communicator.Post("http://localhost:3033/addTripHotel",hotel).then(data =>{
      this.hotels.push(data);
      return data;
    })
  }

  async remove(_hotelID){
    let requestData = {
      tripID: this.tripID,
      hotelID: _hotelID
    }
    return await this.communicator.Post("http://localhost:3033/removeTripHotel",requestData).then(data =>{
      this.hotels.splice(data.hotelIndex,1);
      return;
    })
  }
}