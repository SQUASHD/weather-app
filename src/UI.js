import { weatherAPI } from './weatherAPI';
import { locationData } from './locationData';
import { weatherData } from './weatherData';

class UI {
  static setHomePage() {
    const main = document.getElementById('main');
    const searchBar = document.createElement('input');
    searchBar.setAttribute('type', 'text');
    searchBar.setAttribute('id', 'location-input');
    searchBar.setAttribute('placeholder', 'Search for a location');
    main.appendChild(searchBar);
    UI.initSearchListener();
  }

  static initSearchListener() {
    const searchBar = document.getElementById('location-input');
    searchBar.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const locationInput = searchBar.value;
        UI.processUserInput(locationInput);
      }
    });
  }

  static async processUserInput(locationInput) {
    const strippedLocationInput = UI.stripReplaceWhiteSpace(locationInput);

    let requestedLocationData;
    if (UI.determineZipOrCity(locationInput) === 'zipCountryCode') {
      requestedLocationData = await weatherAPI.fetchLocationDataByZipPostCode(
        strippedLocationInput
      );
    } else {
      requestedLocationData = await weatherAPI.fetchLocationDataByLocationName(
        strippedLocationInput
      );
    }
    console.log(requestedLocationData);

    if (requestedLocationData === []) {
      UI.displayError();
      UI.resetSearchBar();
    }

    const locationObject = await requestedLocationData[0];
    const inputLat = Math.round(locationObject.lat * 100) / 100;
    const inputLon = Math.round(locationObject.lon * 100) / 100;
    const weatherData = await weatherAPI.fetchWeatherData(inputLat, inputLon);
    console.log(weatherData);
    UI.displayWeatherData(weatherData);
  }

  static determineZipOrCity(locationInput) {
    const cityCountryCodeRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*,\s[a-zA-Z]{2}$/;
    const cityStateCountryCodeRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*,\s[a-zA-Z]{2},\s[a-zA-Z]{2}$/;
    const zipCountryCodeRegex = /^\d{5},\s[a-zA-Z]{2}$/;

    if (zipCountryCodeRegex.test(locationInput)) {
      return 'zipCountryCode';
    } else if (cityStateCountryCodeRegex.test(locationInput)) {
      return 'cityStateCountryCode';
    } else if (cityCountryCodeRegex.test(locationInput)) {
      return 'cityCountryCode';
    } else {
      return 'city';
    }
  }

  static stripReplaceWhiteSpace(input) {
    const returnString = input
      .replace(/^\s+/, '')
      .replace(/\s+$/, '')
      .replace(/\s*,\s*/g, ',')
      .replace(/\s+/g, '+');
    return returnString;
  }

  static displayWeatherData(weatherData) {
    const main = document.getElementById('main');
  }

  // Modal Formatting

  static displayError(error) {
    const modal = document.getElementById('myModal');
    const modalContent = document.createElement('div');
    const modalClose = document.createElement('span');
    const modalTitle = document.createElement('h3');
    const modalSubTitle = document.createElement('h4');
    const modalTextContainer = document.createElement('div');

    modalContent.setAttribute('class', 'modal-content');
    modalClose.setAttribute('class', 'close');
    modalTitle.setAttribute('class', 'modal-title');
    modalSubTitle.setAttribute('class', 'modal-subtitle');
    modalTextContainer.setAttribute('class', 'modal-text-container');

    modalContent.appendChild(modalClose);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalSubTitle);
    modalContent.appendChild(modalTextContainer);
    modal.appendChild(modalContent);
    
    if ((error = 'no data')) {
      modalClose.textContent = '&times;';
      modalTitle.textContent = 'Error';
      modalSubTitle.textContent = 'Location Not Found';
      const para1 = document.createElement('p');
      para1.textContent = 'Please try again.';
      modalTextContainer.appendChild(para1);
    }

    UI.initModalCloseListener();
  }

  static resetSearchBar() {
    const searchBar = document.getElementById('location-input');
    searchBar.value = '';
  }

  static initModalCloseListener() {
    const modal = document.getElementById('myModal');
    const span = document.getElementsByClassName('close')[0];
    span.onclick = function () {
      modal.style.display = 'none';
      UI.resetModalContent();
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
        UI.resetModalContent();
      }
    };
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        modal.style.display = 'none';
        UI.resetModalContent();
      }
    });
  }

  static resetModalContent() {
    const modal = document.getElementById('myModal');
    while (modal.firstChild) {
      modal.removeChild(modal.firstChild);
    }
  }
}

export { UI };
