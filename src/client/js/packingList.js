import findStringInArray from "./utility"
import Communicator from "./communicator";
const regeneratorRuntime = require("regenerator-runtime");

export default class PackingListManager{
  constructor(_tripID,_packingList){
    this.tripID = _tripID;
    this.packingList = _packingList;
    this.communicator = new Communicator();
  }

  async add(item){
    console.log(`Adding packing item ${item} to Trip ID ${this.tripID}`);

    let newItem = {
      tripID: this.tripID,
      item: item,
    }
    return await this.communicator.Post("http://localhost:3033/addToTripPackingList",newItem).then(data =>{
      this.packingList.push(data.itemName);
      return data;
    })
  }

  async remove(_item){
    console.log(`Removing packing item ${_item} from Trip ID ${this.tripID}`);

    let requestData = {
      tripID: this.tripID,
      item: _item
    }
    return await this.communicator.Post("http://localhost:3033/removeTripPackingListItem",requestData).then(item =>{
      this.packingList.splice(item.index,1);
      return;
    })
  }
}