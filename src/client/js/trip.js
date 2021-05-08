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
  }

}