import Communicator from "./communicator";
import DestinationManager from "./destinationManager";
import FlightManager from "./flightManager";
import HotelManager from "./hotelManager";
import PackingListManager from "./packingList";
import TodoListManager from "./todoListManager";

export default class Trip{
  constructor(_data){
    this.data = _data;
    this.destinationManager = new DestinationManager(_data.id,_data.destinations);
    this.hotelManager = new HotelManager(_data.id,_data.hotels)
    this.flightManager =  new FlightManager(_data.id,_data.flights)
    this.packingListManager = new PackingListManager(_data.id,_data.packingList);
    this.todoListManager = new TodoListManager(_data.id,_data.todoList);

    //Elements
    this.tripElement;
    this.removeButton;
  }

  insert(document,parent){
    let htmlString = `
    <div id="${this.data.id}"class="trip">
      <div class="trip-header">
        <div class="trip-name">
          <h2>${this.data.country.name}</h2>
          <img src="${this.data.country.flag}" alt="The ${this.data.country.name} flag">
        </div>
        <button class="trip-remove-button">X</button>
      </div>
      <img class="trip-image" src="${this.data.placePictureURL}" alt="A picture of ${this.data.country.name}">
      <div class="destinations">
        <h3>Destinations</h3>
        <input type="text" placeholder="Input a city/state/provence in ${this.data.country.name}">
        <div class="destinations-content">
        </div>
      </div>
      <div class="weather">
      <h3>Weather</h3>
      </div>
      <div class="packingList">
      <h3>Packing List</h3>
      </div>
      <div class="todoList">
      <h3>TODO List</h3>
      </div>
      <div class="hotels">
      <h3>Hotels</h3>
      </div>
      <div class="flights">
      <h3>Flights</h3>
      </div>
    </div>`

    parent.insertAdjacentHTML("afterbegin",htmlString);
    this.tripElement = document.getElementById(this.data.id);
    this.removeButton = this.tripElement.getElementsByClassName("trip-remove-button")[0];
  }


}