const regeneratorRuntime = require("regenerator-runtime");

export default class Communicator{

  async  Post(url,data){
    console.log(`Posting to: ${url}`);

    const response = await fetch(url,{
      method: 'POST',
      credentials: 'same-origin',
      headers:{
        'Content-Type': 'application/json',
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
      headers:{
        'Content-Type': 'application/json',
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