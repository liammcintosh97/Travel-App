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
const { Console } = require('console');

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

let corsOptions = {
  origin: 'http://localhost:8080',
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}
app.use(cors(corsOptions));

/* Routing */

//Add Data

app.post("/updateTrips",(req,res)=>{
  var trips = req.body.trips;

  for(let i = 0; i < trips.length; i++ ){
    let tripCoords = trips[i].coordinates;

    getWeatherForecast(tripCoords.lat,tripCoords.lng).then(response =>{
      trips[i].weatherForecast = response;

      for(let j = 0; j < trips[i].destinations.length; j++){
        let tripDestinationCoords = trips[i].destinations[j].coordinates;

        getWeatherForecast(tripDestinationCoords.lat,tripDestinationCoords.lng).then(response =>{
          trips[i].destinations[j].weatherForecast = response;
        });
      }
    });
  }
  res.send(trips);
})

app.post("/addTrip",(req,res) =>{

  let _placeName = req.body.placeName;
  let _countryCode = req.body.countryCode;
  let _fromDate = req.body.fromDate;
  let _toDate = req.body.toDate;

  let trip = {
    id: generateID(5),
    coordinates: {
      lat: 0,
      lng: 0
    },
    fromDate: _fromDate,
    toDate: _toDate,
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
            res.send(trip);
          })
        })
    })
  })
})

app.post("/getDestination",(req,res) => {
  console.log(`Getting destination ${req.body.placeName} `)

  let _placeName = req.body.placeName;
  let _countryCode = req.body.countryCode;

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
      res.send(newDestination);
    })
  })
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
      placePictureURL = data.hits[randomRange(0,data.hits.length)].largeImageURL;
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
    await fetch(encodeURI(baseURL + paramsURL))
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
        if(location.placeName === _placeName || location.countryCode === _countryCode){
          coordinates.lat = location.lat,
          coordinates.lng = location.lng
          return;
        }
      }
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