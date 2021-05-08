import TripManager from "./tripManager.js"

const tripManager =  new TripManager();

function start(){

  /*
  tripManager.addTrip("Australia","AU").then((trip) =>{
    console.log(trip)
    trip.hotelManager.add("The Royal","43 Royal Street Melbourne","05/05/21 10:00AM","06/06/21 10:00AM").then((hotel) =>{
      tripManager.log();
      trip.hotelManager.remove(hotel.id).then((data)=>{
        tripManager.log();
      })
    })
  })*/

  /*
  tripManager.addTrip("Australia","AU").then((trip) =>{
    console.log(trip)
    trip.destinationManager.add("Melbourne").then((destination) =>{
      tripManager.log();
      trip.destinationManager.remove(destination.id).then((data)=>{
        tripManager.log();
      })
    })
  })*/

  /*
  tripManager.addTrip("Australia","AU").then((trip) =>{
    console.log(trip)
    trip.flightManager.add("VA0697","05/05/21","6:50AM").then((flight) =>{
      tripManager.log();
      trip.flightManager.remove(flight.id).then((data)=>{
        tripManager.log();
      })
    })
  })*/

  /*
  tripManager.addTrip("Australia","AU").then((trip) =>{
    console.log(trip)
    trip.packingListManager.add("Socks").then((data) =>{
      tripManager.log();
      trip.packingListManager.remove(data.item).then((data)=>{
        tripManager.log();
      })
    })
  })*/

  /*
  tripManager.addTrip("Australia","AU").then((trip) =>{
    console.log(trip)
    trip.todoListManager.add("Buy passport").then((data) =>{
      tripManager.log();

      trip.todoListManager.remove(data.itemName).then((data)=>{
        tripManager.log();
      })
    })
  })*/
}


export { start }