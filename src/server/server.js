/* Dependencies  */
const dotenv = require('dotenv');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require("node-fetch");
const { validate } = require('webpack');
var FormData = require('form-data');
var fs = require('fs');
var https = require('https');
var Papa = require('papaparse');
const { response } = require('express');

dotenv.config();

/* Start Server */
//Start an instance of the app
const app = express()
//Spin up the server
const port = 3033
app.listen(port, function () {
  console.log(`Travel App is listening on port ${port}! - http://localhost:${port}/`)
 })
//Initialize the main project folder
app.use(express.static("dist"))

/* Middleware */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

let trips = [];

/* Routing */

//Add Data

app.post("/updateTrips",(req,res)=>{
  trips = req.trips;

  for(let i = 0; i < trips.length; i++ ){
    let tripCoords = trips[i].coordinates;

    getWeatherForecast(tripCoords.lat,tripCoords.lng).then(response =>{
      trips[i].weatherForecast = response;

      for(let j = 0; i < trips[i].destinations.length; j++){
        let tripDestinationCoords = trips[i].destinations[j].coordinates;

        getWeatherForecast(tripDestinationCoords.lat,tripDestinationCoords.lng).then(response =>{
          trips[i].destinations[j].weatherForecast = response;
        });
      }
    });
  }
})

app.post("/addTrip",(req,res) =>{

  /*
  let _placeName = req.placeName;
  let _countryCode = req.country[1]
  */

  let _placeName = "Paris";
  let _countryCode = "FR";

  let trip = {
    id: generateID(5),
    coordinates: {
      lat: 0,
      lng: 0
    },
    placeName: _placeName,
    placePictureURL: undefined,
    country: undefined,
    weatherForecast: undefined,
    destinations: [],
    hotels: [],
    flights: [],
    packingList: [],
    todoList: []
  }

  getPlaceLatLng(_placeName,_countryCode).then(response =>{
    trip.coordinates = response;

    getWeatherForecast(response.lat,response.lng).then(response =>{
      trip.weatherForecast = response;

      getCountryDetails(_countryCode).then(response =>{
        trip.country = response;

          getPlacePicture(_placeName).then(response =>{
            trip.placePictureURL = response;
            console.log(trip);
            trips.push(trip)
            res.send(trips);
          })
        })
    })
  })
})

app.post("/addTripDestination",(req,res) => {

  let tripID = req.tripID;
  let _placeName = req.placeName;
  let _countryCode = trips[findObjectByID(trips,tripID)].country.alpha2Code;

  let newDestination = {
    id: generateID(5),
    coordinates: {
      lat: 0,
      lng: 0
    },
    placeName: _placeName,
    weatherForecast: undefined,
  }

  getPlaceLatLng(_placeName,_countryCode).then(response =>{
    newDestination.coordinates = response;

    getWeatherForecast(response.lat,response.lng).then(response =>{
      newDestination.weatherForecast = response;
      trips[findObjectByID(trips,tripID)].destinations.push(newDestination);
      res.send(trips)
    })
  })
})

app.post("/addHotelInfo",(req,res)=>{

  let hotelInfo = {
    id: generateID(5),
    hotelName: req.hotelName,
    hotelAddress: req.HotelAddress,
    checkIn: req.checkIn,
    checkOut: req.checkOut,
  }

  trips[findTrip(req.tripID)].hotels.push(hotelInfo);

  res.send(trips)
})

app.post("/addFlightInfo",(req,res)=>{

  let flightInfo = {
    id: generateID(5),
    flightCode: req.flightCode,
    flightDate: req.flightDate,
    flightTime: req,flightTime,
  }

  trips[findTrip(req.tripID)].flights.push(flightInfo);

  res.send(trips)
})

app.post("/addToPackingList",(req,res) =>{
  trips[findTrip(req.tripID)].packingList.push(req.packingItem);
  res.send(trips)
})

app.post("/addToTodoList",(req,res) =>{
  trips[findTrip(req.tripID)].todoList.push(req.todoItem);
  res.send(trips)
})

//Remove Data

app.post("/removeTrip",(req,res)=>{
  let toRemove = req.id;

  trips.splice(findObjectByID(trips,toRemove),1);
  res.send(trips);
})

app.post("/removeTripDestination",(req,res) =>{
  let tripID = req.tripID;
  let destinationID = req.destinationID;

  let tripIndex = findObjectByID(trips,tripID);
  let destinationIndex = findObjectByID(trips[tripIndex].destinations,destinationID);

  trips[tripIndex].destinations.splice(destinationIndex,1)
})

app.post("/removeHotelInfo",(req,res) =>{
  let tripID = req.tripID;
  let hotelID = req.hotelID;

  let tripIndex = findObjectByID(trips,tripID);
  let hotelIndex = findObjectByID(trips[tripIndex].hotels,hotelID);

  trips[tripIndex].hotels.splice(hotelIndex,1)
})

app.post("/removeFlightInfo",(req,res) =>{
  let tripID = req.tripID;
  let flightID = req.flightID;

  let tripIndex = findObjectByID(trips,tripID);
  let flightIndex = findObjectByID(trips[tripIndex].flights,flightID);

  trips[tripIndex].flights.splice(flightIndex,1)
})

app.post("/removePackingListItem",(req,res) =>{
  let tripID = req.tripID;
  let packingItem = req.packingItem;

  let tripIndex = findObjectByID(trips,tripID);
  let packingItemIndex = findStringInArray(trips[tripIndex].packingList,packingItem);

  trips[tripIndex].packingList.splice(packingItemIndex,1)
})

app.post("/removeTodoListItem",(req,res) =>{
  let tripID = req.tripID;
  let todoItem = req.todoItem;

  let tripIndex = findObjectByID(trips,tripID);
  let todoItemIndex = findStringInArray(trips[tripIndex].todoList,todoItem);

  trips[tripIndex].todoList.splice(todoItemIndex,1)
})

//Get Data

app.get("/getWeatherForecast",(req,res) =>{

  getWeatherForecast(req.lat,req.lng).then(response =>{
    res.send(response.data);
  });
})

app.get("/getCountries",(req,res)=>{
  var file = __dirname + '/countries.csv';
  var content = fs.readFileSync(file, "utf8");

  Papa.parse(content, {
      header: false,
      delimiter: ",",
      complete: results => {
        res.send(results.data);
      }
  });
})

app.get("/getTrips",(req,res) =>{
  res.send(trips);
})

app.get("/",(req,res) =>{
  res.sendFile('index.html');
})

/* Functions */

async function getCountryDetails(_countryCode){
  let country;

  let url = `https://restcountries.eu/rest/v2/alpha/${_countryCode}`
  try{
    await fetch(url)
    .then((res)=>{
      return res.json();
    })
    .then((data)=>{
      country = data;
    })
    return country
  }
  catch(e){
    return e;
  }
}

async function getWeatherForecast(lat,lng){

  let forecast;

  let baseURL = "https://api.weatherbit.io/v2.0/forecast/daily"
  let paramsURL = `?key=${process.env.WEATHER_BIT_API_KEY}&lang=en&units=M&days=16&lat=${lat}&lon=${lng}`

  try{
    await fetch(baseURL + paramsURL)
    .then((res)=>{
      return res.json();
    })
    .then((data)=>{
      forecast = data;
    })
    return forecast
  }
  catch(e){
    return e;
  }
}

async function getPlacePicture(_placeName,_countryName){
  let orientation = "horizontal";
  let minWidth = 0;
  let minHeight = 0;

  let baseURL = "https://pixabay.com/api/"
  let paramsURL = `?key=${process.env.PIXABAY_API_KEY}&q=${_placeName}&lang=en&image_type=photo&orientation=${orientation}&min_width=${minWidth}&min_height=${minHeight}&category=travel`

  try{
    await fetch(baseURL + paramsURL)
    .then((res)=>{
      return res.json();
    })
    .then((data)=>{
      placePictureURL = data.hits[randomRange(0,data.hits.length)].pageURL;
    })
    return placePictureURL
  }
  catch(e){
    return e;
  }
}

async function getPlaceLatLng(_placeName,_countryCode){

  let coordinates = {
    lat: 0,
    lng: 0
  }

  let baseURL = "http://api.geonames.org/postalCodeSearchJSON"
  let paramsURL = `?placename=${_placeName}&maxRows=10&country=${_countryCode}&countryBias=${_countryCode}&username=liam6499`

  try{
    await fetch(baseURL + paramsURL)
    .then((res)=>{
      return res.json();
    })
    .then((data)=>{

      let totalLng = 0 ;
      let totalLat = 0 ;

      //Loop over all of the results from the Geonames API
      for(let i = 0; i < data.postalCodes.length; i++){
        let location = data.postalCodes[i]

        //If the locations place name matches the passed place name return it's coordinates
        if(location.placeName === _placeName){
          coordinates.lat = location.lat,
          coordinates.lng = location.lng
          return;
        }
         //Otherwise if the country code of the location is the same add to the total lat lng to calculate average
        else if(location.countryCode === _countryCode){
            totalLng += location.lng;
            totalLat += location.lat;
          }
      }
      //Calculate average
      coordinates.lat = totalLat/data.postalCodes.length,
      coordinates.lng = totalLng/data.postalCodes.length
    })
    return coordinates
  }
  catch(e){
    return e;
  }
}

function findObjectByID(array,id){
  for(let i = 0; i < array.length; i++){
    if(array[i].id === id){
      return i;
    }
  }
}

function findStringInArray(array,toFind){
  for(let i = 0; i < array.length; i++){
    if(array[i] === toFind){
      return i;
    }
  }
}

function randomRange(min, max){
  const r = Math.random()*(max-min) + min
  return Math.floor(r)
}

function generateID(length) {
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result.push(characters.charAt(Math.floor(Math.random() *
charactersLength)));
 }
 return result.join('');
}