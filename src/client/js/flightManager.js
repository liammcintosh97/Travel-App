import findObjectByID from "./utility"
import Communicator from "./communicator";
import {generateID} from "./utility";
const regeneratorRuntime = require("regenerator-runtime");

export default class FlightManager{
  constructor(_tripID,_flights){
    this.tripID = _tripID;
    this.flights = _flights;
    this.communicator = new Communicator();
  }

  init(document){

    var flightContent = document.getElementsByClassName("flights-content")[0];
    var enterButton = document.getElementsByClassName("flights-enter")[0];

    var inputs = {
      codeInput: document.getElementsByClassName("flights-code-input")[0],
      departureDateTimeInput: document.getElementsByClassName("flights-departure-datetime")[0],
    }

    this.load(flightContent);

    const buttonClick = this.onEnterClick.bind(null,this,flightContent,inputs);
    enterButton.addEventListener("click",buttonClick);
  }

  load(flightContent){
    let flights = this.flights;

    for(var i = 0 ; i < flights.length; i++){
      this.insert(flightContent,flights[i])
    }
  }

  insert(content,flight){
    var htmlString = `
    <div class="flight">
      <div class="flight-info">
        <p>Flight code: ${flight.code}</p>
        <p>Flight departure: ${flight.departure}</p>
      </div>
      <button class="flight-remove">X</button>
    </div>`
    content.insertAdjacentHTML("afterbegin",htmlString);
    var itemElement = content.firstChild.nextSibling;

    var removeButton = itemElement.getElementsByClassName("flight-remove")[0];

    var onRemoveClick = this.onRemoveClick.bind(null,this,flight.id)

    removeButton.addEventListener("click",onRemoveClick)

    return itemElement
  }

  onEnterClick(manager,content,inputs){
    var newFlight = {
      id: generateID(5),
      code: inputs.codeInput.value,
      departure: inputs.departureDateTimeInput.value,
    }
    manager.flights.push(newFlight);
    manager.insert(content,newFlight);
  }

  onRemoveClick(manager,flightID,event){
    var element = event.target.parentElement;

    element.remove();

    var itemIndex = 0;
    for(var i = 0; i < manager.flights.length; i++){
      if(manager.flights[i].id === flightID) itemIndex = i;
    }
    manager.flights.splice(flightID,1);
  }
}