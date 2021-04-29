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

/* Routing */

app.get("/getTrip",(req,res) =>{

  let _placeName = req.placeName;
  let _countryCode = req.country[1]
  let _countryName = req.country[0]

  let trip = {
    coordinates: {
      lat: 0,
      lng: 0
    },
    placeName: _placeName,
    placePictureURL: undefined,
    countryCode: _countryCode,
    countryName: _countryName,
    weatherForecast: undefined
  }

  getPlaceLatLng(_placeName,_countryCode).then(response =>{
    trip.coordinates = response;
    getWeatherForecast(response.lat,response.lng).then(response =>{
      trip.weatherForecast = response;
      getPlacePicture(_placeName).then(response =>{
        trip.placePictureURL = response;
        console.log(trip);
        res.send(trip);
      })
    })
  })
})

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

function randomRange(min, max){
  const r = Math.random()*(max-min) + min
  return Math.floor(r)
}