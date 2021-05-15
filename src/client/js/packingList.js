import {findStringInArray} from "./utility"
import Communicator from "./communicator";
const regeneratorRuntime = require("regenerator-runtime");

export default class PackingListManager{
  constructor(_tripID,_packingList){
    this.tripID = _tripID;
    this.packingList = _packingList;
    this.communicator = new Communicator();
  }

  init(document){
    let packingInput = document.getElementsByClassName("packing-input")[0];
    let packingButton = document.getElementsByClassName("packing-button")[0];
    let packingContent = document.getElementsByClassName("packing-content")[0];

    this.load(packingContent);

    const buttonClick = this.onEnterClick.bind(null,this,packingContent,packingInput);
    packingButton.addEventListener("click",buttonClick);
  }

  load(packingContent){
    let packingList = this.packingList;

    for(var i = 0 ; i < packingList.length; i++){
      var itemElement = this.insert(packingContent,packingList[i].item)
      var checkBox = itemElement.getElementsByTagName("input")[0];

      checkBox.checked = packingList[i].checked;
    }
  }

  insert(content,item){
    var htmlString = `
    <div class="packing-item">
      <input type="checkbox">
      <p>${item}</p>
      <button class="packing-item-remove">X</button>
    </div>`
    content.insertAdjacentHTML("afterbegin",htmlString);
    var itemElement = content.firstChild.nextSibling;

    var checkBox = itemElement.getElementsByTagName("input")[0];
    var removeButton = itemElement.getElementsByClassName("packing-item-remove")[0];

    var onCheck = this.onCheck.bind(null,this,item)
    var onRemove = this.onRemove.bind(null,this,item)

    checkBox.addEventListener("change",onCheck)
    removeButton.addEventListener("click",onRemove)

    return itemElement
  }

  onEnterClick(manager,content,input,event){
    manager.packingList.push({item: input.value,checked: false});
    manager.insert(content,input.value);
  }

  onCheck(manager,item,event){
    var itemIndex = 0;
    for(var i = 0; i < manager.packingList.length; i++){
      if(manager.packingList[i].item === item) itemIndex = i;
    }
    manager.packingList[itemIndex].checked = event.target.checked
  }

  onRemove(manager,item,event){
    var element = event.target.parentElement;

    element.remove();

    var itemIndex = 0;
    for(var i = 0; i < manager.packingList.length; i++){
      if(manager.packingList[i].item === item) itemIndex = i;
    }
    manager.packingList.splice(itemIndex,1);
  }

}