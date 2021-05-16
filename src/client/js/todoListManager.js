import findStringInArray from "./utility"
import Communicator from "./communicator";
const regeneratorRuntime = require("regenerator-runtime");

export default class TodoListManager{
  constructor(_tripID,_todoList){
    this.tripID = _tripID;
    this.todoList = _todoList;
    this.communicator = new Communicator();
  }

  init(document){
    //Get required inputs
    let todoInput = document.getElementsByClassName("todo-input")[0];
    let todoButton = document.getElementsByClassName("todo-button")[0];
    let todoContent = document.getElementsByClassName("todo-content")[0];

    //Load saved todo list items
    this.load(todoContent);

    //Initialize buttons
    const buttonClick = this.onEnterClick.bind(null,this,todoContent,todoInput);
    todoButton.addEventListener("click",buttonClick);
  }

  load(todoContent){
    let todoList = this.todoList;

    //loop through all of the todo items and insert them into the documents
    for(var i = 0 ; i < todoList.length; i++){
      var itemElement = this.insert(todoContent,todoList[i].item)
      var checkBox = itemElement.getElementsByTagName("input")[0];

      checkBox.checked = todoList[i].checked;
    }
  }

  insert(content,item){
    //Inserts a new todo item into the doucment
    var htmlString = `
    <div class="todo-item">
      <input type="checkbox">
      <p>${item}</p>
      <button class="todo-item-remove">X</button>
    </div>`
    //Get to the new element
    content.insertAdjacentHTML("afterbegin",htmlString);
    var itemElement = content.firstChild.nextSibling;

    //Initialize the item's buttons
    var checkBox = itemElement.getElementsByTagName("input")[0];
    var removeButton = itemElement.getElementsByClassName("todo-item-remove")[0];
    var onCheck = this.onCheck.bind(null,this,item)
    var onRemove = this.onRemove.bind(null,this,item)

    checkBox.addEventListener("change",onCheck)
    removeButton.addEventListener("click",onRemove)

    return itemElement
  }

  onEnterClick(manager,content,input,event){
    //Creates a new TODO item upon clicking the enter button
    manager.todoList.push({item: input.value,checked: false});
    manager.insert(content,input.value);
  }

  onCheck(manager,item,event){
    //Changes the TODO item's checked state upon checking it's input field
    var itemIndex = 0;
    for(var i = 0; i < manager.todoList.length; i++){
      if(manager.todoList[i].item === item) itemIndex = i;
    }
    manager.todoList[itemIndex].checked = event.target.checked
  }

  onRemove(manager,item,event){
     //Removes a TODO item upon clicking it's remove button
    var element = event.target.parentElement;

    element.remove();

    var itemIndex = 0;
    for(var i = 0; i < manager.todoList.length; i++){
      if(manager.todoList[i].item === item) itemIndex = i;
    }
    manager.todoList.splice(itemIndex,1);
  }

}