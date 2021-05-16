import findObjectByID from "./utility"
import Communicator from "./communicator";
import {generateID} from "./utility";
const regeneratorRuntime = require("regenerator-runtime");

export default class HotelManager{
  constructor(_tripID,_hotels){
    this.tripID = _tripID;
    this.hotels = _hotels;
    this.communicator = new Communicator();
  }

  init(document){
    //Initializes elements
    var hotelContent = document.getElementsByClassName("hotels-content")[0];
    var enterButton = document.getElementsByClassName("hotels-enter")[0];


    //Gathers all required inputs
    var inputs = {
      nameInput: document.getElementsByClassName("hotel-name-input")[0],
      addressInput: document.getElementsByClassName("hotel-address-input")[0],
      dateInInput: document.getElementsByClassName("hotel-in-date-input")[0],
      dateOutInput: document.getElementsByClassName("hotel-out-date-input")[0],
      timeInInput: document.getElementsByClassName("hotel-in-time-input")[0],
      timeOutInput: document.getElementsByClassName("hotel-out-time-input")[0],
    }

    //load saved hotels
    this.load(hotelContent);

    //initialize buttons
    const buttonClick = this.onEnterClick.bind(null,this,hotelContent,inputs);
    enterButton.addEventListener("click",buttonClick);
  }

  load(hotelContent){
    let hotels = this.hotels;

    //loop through hotels and insert them into the document
    for(var i = 0 ; i < hotels.length; i++){
      this.insert(hotelContent,hotels[i])
    }
  }

  insert(content,hotel){
    //inserts and new hotel into the document
    var htmlString = `
    <div class="hotel">
      <div class="hotel-info">
        <p>Hotel name: ${hotel.name}</p>
        <p>Hotel address: ${hotel.address}</p>
        <p>Check In: ${hotel.dateIn} ${hotel.timeIn}</p>
        <p>Check Out: ${hotel.dateOut} ${hotel.timeOut}</p>
      </div>
      <button class="hotel-remove">X</button>
    </div>`
    //Get the new element
    content.insertAdjacentHTML("afterbegin",htmlString);
    var itemElement = content.firstChild.nextSibling;

    //Init the remove button
    var removeButton = itemElement.getElementsByClassName("hotel-remove")[0];
    var onRemoveClick = this.onRemoveClick.bind(null,this,hotel.id)
    removeButton.addEventListener("click",onRemoveClick)

    return itemElement
  }

  onEnterClick(manager,content,inputs){
    //Creates a new hotel upon clicking the enter button
    var newHotel = {
      id: generateID(5),
      name: inputs.nameInput.value,
      address: inputs.addressInput.value,
      dateIn: inputs.dateInInput.value,
      dateOut: inputs.dateOutInput.value,
      timeIn: inputs.timeInInput.value,
      timeOut: inputs.timeOutInput.value,
    }
    manager.hotels.push(newHotel);
    manager.insert(content,newHotel);
  }

  onRemoveClick(manager,hotelID,event){
    //Removes a hotel upon clicking it's remove button
    var element = event.target.parentElement;

    element.remove();

    var itemIndex = 0;
    for(var i = 0; i < manager.hotels.length; i++){
      if(manager.hotels[i].id === hotelID) itemIndex = i;
    }
    manager.hotels.splice(itemIndex,1);
  }
}