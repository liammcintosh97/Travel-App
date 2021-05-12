import Communicator from "./communicator";

export default class CountrySearcher{
  constructor(document){
    this.element = document.getElementsByClassName("country-selector")[0];
    this.content = this.element.getElementsByClassName("country-selector-content")[0];
    this.input = this.element.getElementsByClassName("country-selector-input")[0];
    this.countries = this.content.getElementsByTagName("a");
    this.communicator = new Communicator();
    this.selectedCountry;
  }

  async init(){
    await this.initCountries()

    const inputClick = this.toggleContent.bind(null,this.content);
    const inputKeyUp = this.filterCountries.bind(null,this.countries);
    const contentClick = this.onCountryClick.bind(null,this,this.input);

    this.input.addEventListener('click',inputClick);
    this.input.addEventListener('keyup',inputKeyUp);
    this.content.addEventListener('click',contentClick)
  }

  async initCountries(){
    return await this.communicator.Get("http://localhost:3033/getCountries").then(countries =>{
      
      for(var i = 0;i < countries.length; i++){
        //var htmlString = `<a id="${countries[i][1]}" href="#${countries[i][0]}">${countries[i][0]}</a>`
        var htmlString = `<a id="${countries[i][1]}">${countries[i][0]}</a>`
        this.content.insertAdjacentHTML("beforeend",htmlString);
      }

      this.countries = this.content.getElementsByTagName("a");
      return;
    })
  }

  toggleContent(content,event) {

    if (content.style.display === "none" || content.style.display === "") {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  }

  showContent(show){
    if (show) {
      this.content.style.display = "block";
    } else {
      this.content.style.display = "none";
    }
  }

  onCountryClick(countrySearcher,input,event){
    var clickedCountry = event.target;

    input.value = clickedCountry.innerText;

    countrySearcher.selectedCountry = {
      name: clickedCountry.innerText,
      code: clickedCountry.id,
    }

  }

  filterCountries(countries,event) {
    var input = event.target;
    var filter = input.value.toUpperCase();
    
    for (var i = 0; i < countries.length; i++) {
      var txtValue = countries[i].textContent || countries[i].innerText;

      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        countries[i].style.display = "";
      } else {
        countries[i].style.display = "none";
      }
    }
  }
}
