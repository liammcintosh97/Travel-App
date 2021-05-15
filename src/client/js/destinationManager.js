import findObjectByID from "./utility"
import {addDay} from "./utility"
import Communicator from "./communicator";
const regeneratorRuntime = require("regenerator-runtime");


export default class DestinationManager{
  constructor(_tripID,_countryCode,_destinations){
    this.tripID = _tripID;
    this.countryCode = _countryCode;
    this.destinations = _destinations;
    this.communicator = new Communicator();
  }

  async get(newDestination){
    console.log(`Adding destination ${newDestination.placeName} to Trip ID ${this.tripID}`)

    return await this.communicator.Post("http://localhost:3033/getDestination",newDestination).then(data =>{
      this.destinations.push(data);
      return data
    })
  }

  /*
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
  }*/

  init(document){
    var destinationsContent = document.getElementsByClassName("destinations-content")[0];
    var enterButton = document.getElementsByClassName("destinations-enter")[0];

    var destinationInput =  document.getElementsByClassName("destinations-input")[0];
    this.load(destinationsContent);

    const buttonClick = this.onEnterClick.bind(null,this,destinationsContent,destinationInput);
    enterButton.addEventListener("click",buttonClick);
  }

  load(destinationsContent){
    let flights = this.destinations;

    for(var i = 0 ; i < flights.length; i++){
      this.insert(destinationsContent,flights[i])
    }
  }

  insert(content,destination){
    var htmlString = `
    <div class="destination">
      <div class="destination-info">
        <h4>${destination.placeName}</h4>
        <button class="destination-remove">X</button>
      </div>
      <div class="weather">
      </div>
    </div>`
    content.insertAdjacentHTML("afterbegin",htmlString);
    var itemElement = content.firstChild.nextSibling;

    var removeButton = itemElement.getElementsByClassName("destination-remove")[0];

    var onRemoveClick = this.onRemoveClick.bind(null,this,destination.id)

    removeButton.addEventListener("click",onRemoveClick)

    this.insertWeather(itemElement,destination.weatherForecast.data);
    return itemElement
  }

  insertWeather(itemElement,weatherData){
    let weatherElement = itemElement.getElementsByClassName("weather")[0];
    let timezone = weatherData.timezone;
    let today = new Date(new Date().toLocaleString("en-US", {timeZone: timezone}));

    for(let i = 0; i < weatherData.length; i++){
      let weather = weatherData[i];
      let day = addDay(today,i);
      let htmlString=`
      <div class="weather-day">
        <p>${day.toString().slice(0,3).toUpperCase()}</p>
        <div class="temperature">
          <p class="temp-min">min ${weather.low_temp}&#176C</p>
          <h3 class="temp">${weather.temp}&#176C</h3>
          <p class="temp-max">max ${weather.high_temp}&#176C</p>
        </div>
        <p class="day">${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()}<p>
      </div>`
      weatherElement.insertAdjacentHTML("beforeend",htmlString);
    }
  }

  onEnterClick(manager,content,destinationInput){
    var newDestination = {
      placeName: destinationInput.value,
      countryCode: manager.countryCode,
    }
    manager.get(newDestination).then((data)=>{
      console.log(data);
      manager.insert(content,data);
    })
  }

  onRemoveClick(manager,destinationID,event){
    var element = event.target.parentElement;

    element.remove();

    var itemIndex = 0;
    for(var i = 0; i < manager.destinations.length; i++){
      if(manager.destinations[i].id === destinationID) itemIndex = i;
    }
    manager.destinations.splice(destinationID,1);
  }
}