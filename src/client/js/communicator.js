const regeneratorRuntime = require("regenerator-runtime");

export default class Communicator{

  async  Post(url,data){
    console.log(`Posting to: ${url}`);

    const response = await fetch(url,{
      method: 'POST',
      credentials: 'same-origin',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'Origin':'http://localhost:8080',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify(data),
    });

    try{
      const data = await response.json();
      console.log(`POST to ${url} was successful`);
      return data;
    }catch(error){
      console.log("error",error);
    }
  }

  async  Get(url,data){
    console.log(`Getting from ${url}`);

    const response = await fetch(url,{
      method: 'GET',
      credentials: 'same-origin',
      mode: 'cors',
      headers:{
        'Content-Type': 'application/json',
        'Origin':'http://localhost:8080',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify(data),
    });

    try{
      const data = await response.json();
      console.log(`GET from ${url} was successful`);
      return data;
    }catch(error){
      console.log("error",error);
    }
  }
}