# Travel App
 Udacity FEND Capstone - Travel App

--- Project Dependencies ---
This project relies on a variety of dependencies to function. A detailed list can be found within the package.json file.
Some key ones are...
  - Express
  - Webpack
  - Babel
  - SASS
  - Jest

--- How to run ---

Production
  1- In your terminal run "npm run build-prod" to build the project distributables
  2- Then run "npm run start" to the start the express server
  3- Go to http://localhost:3033/

Development
  1- In your terminal run "npm run start" to the start the express server.
  2- Then run "npm run build-dev" to build the project and run the webpack development server
  3- Go to http://localhost:8080/

--- Important files ---

 - src/client/application.js: This file is the main entry point to the frontend of the website. It runs the initialization function,
   adds event listeners and loads saved data
 - src/client/communicator.js: This file hold the get and post methods for the frontend to use to communicate to the server
 - src/client/utility.js: This file holds utility functions used throughout the frontend application
 - src/client/trip: This class is used to create new trips from data received from the server
 - src/server/server.js: This is the backend server file of the application
 - src/server/countries.csv: This file holds a list of all the countries in the world.

--- Standout Additions ---

  - Add end date and display length of trip.
  - Allow user to add multiple destinations on the same trip.
      - Pull in weather for additional locations.
  - Allow the user to add hotel and/or flight data.
      - Multiple places to stay? Multiple flights?
  - Integrate the REST Countries API to pull in data for the country being visited.
  - Allow the user to remove the trip.
  - Use Local Storage to save the data so that when they close, then revisit the page, their information is still there.
  - Instead of just pulling a single day forecast, pull the forecast for multiple days.
  - Allow the user to add a todo list and/or packing list for their trip.


 --- APIs Used ---

   - Geonames: https://www.geonames.org/
   - REST Countries API: https://restcountries.eu/
   - Weather Bit: https://www.weatherbit.io/
   - PixaBay: https://pixabay.com/

--- References ---

  - https://developer.mozilla.org/en-US/
  - https://webpack.js.org/guides/getting-started/
  - https://babeljs.io/docs/en/
  - https://stackoverflow.com/
  - https://jestjs.io/docs/getting-started
  - https://sass-lang.com/guide
  - https://expressjs.com/en/starter/installing.html
  - https://css-tricks.com/
  - https://www.w3schools.com/js/
