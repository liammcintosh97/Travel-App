import Communicator from "./communicator";
import DestinationManager from "./destinationManager";
import FlightManager from "./flightManager";
import HotelManager from "./hotelManager";
import PackingListManager from "./packingList";
import TodoListManager from "./todoListManager";
import {addDay,getDayName} from "./utility";

export default class Trip{
  constructor(_data){
    this.data = _data;
    this.destinationManager = new DestinationManager(_data.id,_data.country.alpha2Code,_data.destinations);
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
        <div class="trip-dates">
          <p><strong>From:</strong> ${this.data.fromDate}</p>
          <p><strong>To:</strong> ${this.data.toDate}</p>
        </div>
        <button class="trip-remove-button">X</button>
      </div>
      <img class="trip-image" src="${this.data.placePictureURL}" alt="A picture of ${this.data.country.name}">
      <div class="destinations">
        <div class="destinations-header">
          <h3 class="destinations-title">Destinations</h3>
          <input class="destinations-input" type="text" placeholder="Input a city/state/provence in ${this.data.country.name}">
          <button class="destinations-enter">Enter</button>
        </div>
        <div class="destinations-content">
        </div>
      </div>
      <div class="weather">
      </div>
      <div class="packingList">
        <div class="packing-header">
          <h3>Packing List</h3>
          <div>
            <input type="text" class="packing-input" placeholder="Enter an item">
            <button class="packing-button">Enter</button>
          </div>
        </div>
        <div class="packing-content">
        </div>
      </div>
      <div class="todoList">
        <div class="todo-header">
          <h3>TODO List</h3>
          <div>
            <input type="text" class="todo-input" placeholder="Enter an item">
            <button class="todo-button">Enter</button>
          </div>
        </div>
        <div class="todo-content">
        </div>
      </div>
      <div class="hotels">
        <div class="hotels-header">
          <h3 class="hotels-title">Hotels</h3>
          <div class="hotels-info">
            <input type="text" class="hotel-name-input" placeholder="Hotel name">
            <input type="text" class="hotel-address-input" placeholder="Hotel address">
          </div>
          <div class="hotels-check-in">
            <p>Check in</p>
            <input type="date" class="hotel-in-date-input">
            <input type="time" class="hotel-in-time-input">
          </div>
          <div class="hotels-check-out">
            <p>Check Out</p>
            <input type="date" class="hotel-out-date-input">
            <input type="time" class="hotel-out-time-input">
          </div>

          <button class="hotels-enter">Enter</button>
        </div>

        <div class="hotels-content">
        </div>
      </div>

      <div class="flights">
        <div class="flights-header">
          <h3 class="flights-title">Flights</h3>
          <input type="text" class="flights-code-input" placeholder="Flight Code">
          <div class="flights-departure">
            <p>Departure Date and Time</p>
            <input type="datetime-local" class="flights-departure-datetime">
            <button class="flights-enter">Enter</button>
          </div>
        </div>
        <div class="flights-content">
        </div>
      </div>
    </div>`

    parent.insertAdjacentHTML("afterbegin",htmlString);
    this.insertWeather(document)
    this.tripElement = document.getElementById(this.data.id);
    this.removeButton = this.tripElement.getElementsByClassName("trip-remove-button")[0];

    this.packingListManager.init(document)
    this.todoListManager.init(document)
    this.hotelManager.init(document)
    this.flightManager.init(document)
    this.destinationManager.init(document)
  }

  insertWeather(document){
    let weatherElement = document.getElementsByClassName("weather")[0];
    let weatherData = this.data.weatherForecast.data;
    let timezone = this.data.weatherForecast.timezone;
    let today = new Date(new Date().toLocaleString("en-US", {timeZone: timezone}));

    for(let i = 0; i < weatherData.length; i++){
      let weather = weatherData[i];
      let day = addDay(today,i)

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


}

