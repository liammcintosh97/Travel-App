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
    //Gets a new destination from the server with the passed data.
    console.log(`Adding destination ${newDestination.placeName} to Trip ID ${this.tripID}`)

    return await this.communicator.Post("http://localhost:3033/getDestination",newDestination).then(data =>{
      this.destinations.push(data);
      return data
    })
  }

  init(document){
    //Get the required elements
    var destinationsContent = document.getElementsByClassName("destinations-content")[0];
    var enterButton = document.getElementsByClassName("destinations-enter")[0];
    var destinationInput =  document.getElementsByClassName("destinations-input")[0];

    //load any saved destinations
    this.load(destinationsContent);

    //Initialize buttons
    const buttonClick = this.onEnterClick.bind(null,this,destinationsContent,destinationInput);
    enterButton.addEventListener("click",buttonClick);
  }

  load(destinationsContent){
    let destinations = this.destinations;

    //loop through the saved destinations and insert them into the document
    for(var i = 0 ; i < destinations.length; i++){
      this.insert(destinationsContent,destinations[i])
    }
  }

  insert(content,destination){
    //inserts and new destination into the document
    var htmlString = `
    <div class="destination">
      <div class="destination-info">
        <h4>${destination.placeName}</h4>
        <button class="destination-remove">X</button>
      </div>
      <div class="weather">
      </div>
    </div>`
    //Gte the new element
    content.insertAdjacentHTML("afterbegin",htmlString);
    var itemElement = content.firstChild.nextSibling;

    //Init the remove button
    var removeButton = itemElement.getElementsByClassName("destination-remove")[0];
    var onRemoveClick = this.onRemoveClick.bind(null,this,destination.id)
    removeButton.addEventListener("click",onRemoveClick)

    //Initialize the weather for the destination
    this.insertWeather(itemElement,destination.weatherForecast.data);
    return itemElement
  }

  insertWeather(itemElement,weatherData){
    //Initialize the weather data and elements
    let weatherElement = itemElement.getElementsByClassName("weather")[0];
    let timezone = weatherData.timezone;
    let today = new Date(new Date().toLocaleString("en-US", {timeZone: timezone}));

    //Loop through the data and insert a new weather element
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
    //Creates a new destination on pressing the enter button
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
    //Removes destination on pressing it's remove button
    var element = event.target.parentElement;

    element.remove();

    var itemIndex = 0;
    for(var i = 0; i < manager.destinations.length; i++){
      if(manager.destinations[i].id === destinationID) itemIndex = i;
    }
    manager.destinations.splice(destinationID,1);
  }
}