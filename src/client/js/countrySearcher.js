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
    //Initializes the country selector
    await this.initCountries()

    //Bind listener functions
    const inputClick = this.toggleContent.bind(null,this.content);
    const inputKeyUp = this.filterCountries.bind(null,this.countries);
    const contentClick = this.onCountryClick.bind(null,this,this.input);

    //Add event listeners
    this.input.addEventListener('click',inputClick);
    this.input.addEventListener('keyup',inputKeyUp);
    this.content.addEventListener('click',contentClick)
  }

  async initCountries(){
    //Get a list of countries from the server
    return await this.communicator.Get("http://localhost:3033/getCountries").then(countries =>{
      
      //loop through the returned country data and insert it into the searchable dropdown
      for(var i = 0;i < countries.length; i++){
        var htmlString = `<a id="${countries[i][1]}">${countries[i][0]}</a>`
        this.content.insertAdjacentHTML("beforeend",htmlString);
      }

      this.countries = this.content.getElementsByTagName("a");
      return;
    })
  }

  toggleContent(content,event) {
    //Toggles the dropdown's display
    if (content.style.display === "none" || content.style.display === "") {
      content.style.display = "block";
    } else {
      content.style.display = "none";
    }
  }

  showContent(show){
    //Shows the dropdown's display based on the passed boolean
    if (show) {
      this.content.style.display = "block";
    } else {
      this.content.style.display = "none";
    }
  }

  onCountryClick(countrySearcher,input,event){
    //Formats the country selector's input once the user clicks on a country
    var clickedCountry = event.target;

    input.value = clickedCountry.innerText;

    countrySearcher.selectedCountry = {
      name: clickedCountry.innerText,
      code: clickedCountry.id,
    }

  }

  filterCountries(countries,event) {
    //Filters through the countries in the dropdown when the users types in the input
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
