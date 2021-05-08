import findStringInArray from "./utility"
import Communicator from "./communicator";
const regeneratorRuntime = require("regenerator-runtime");

export default class TodoListManager{
  constructor(_tripID,_todoList){
    this.tripID = _tripID;
    this.todoList = _todoList;
    this.communicator = new Communicator();
  }

  async add(item){
    console.log(`Adding TODO item ${item} to Trip ID ${this.tripID}`);

    let newItem = {
      tripID: this.tripID,
      item: item,
    }
    return await this.communicator.Post("http://localhost:3033/addToTripTodoList",newItem).then(data =>{
      this.todoList.push(data.itemName);
      return data;
    })
  }

  async remove(_item){
    console.log(`Removing TODO item ${_item} from Trip ID ${this.tripID}`);

    let requestData = {
      tripID: this.tripID,
      item: _item
    }
    return await this.communicator.Post("http://localhost:3033/removeTodoListItem",requestData).then(item =>{
      this.todoList.splice(item.index,1);
      return;
    })
  }
}