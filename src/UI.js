import { weatherAPI } from './weatherAPI';
import { locationData } from './locationData';
import { weatherData } from './weatherData';

class UI {
  static setHomePage() {
    const main = document.getElementById('main');
    main.innerHTML = `<input type="text" name="location-input" id="location-input" />`;
    UI.initSearchListener();
  }

  static initSearchListener() {
    const searchBar = document.getElementById('location-input');
    searchBar.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const locationInput = searchBar.value;
        if (!UI.validateLocationInput(locationInput)) {
          return UI.callWrongInputModal();
        }
        UI.processUserInput(locationInput);
      }
    });
  }

  static async processUserInput(locationInput) {
    const strippedLocationInput = UI.stripWhiteSpace(locationInput);
    console.log(strippedLocationInput);
    let requestedLocationData;
    if (UI.determineZipOrCity(locationInput) === 'zipCountryCode') {
      requestedLocationData = await weatherAPI.fetchLocationDataByZipPostCode(
        strippedLocationInput
      );
      console.log('zipCountryCode');
    } else {
      requestedLocationData = await weatherAPI.fetchLocationDataByLocationName(
        strippedLocationInput
      );
    }
    const locationObject = await requestedLocationData[0];
    const inputLat = (await Math.round(locationObject.lat * 100)) / 100;
    const inputLon = (await Math.round(locationObject.lon * 100)) / 100;
    const weatherData = await weatherAPI.fetchWeatherData(inputLat, inputLon);
    console.log(weatherData);
  }

  static validateLocationInput(locationInput) {
    const cityRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
    const cityCountryCodeRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*,\s[a-zA-Z]{2}$/;
    const cityStateCountryCodeRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*,\s[a-zA-Z]{2},\s[a-zA-Z]{2}$/;
    const zipCountryCodeRegex = /^\d{5},\s[a-zA-Z]{2}$/;

    if (cityRegex.test(locationInput)) {
      return true;
    } else if (cityCountryCodeRegex.test(locationInput)) {
      return true;
    } else if (cityStateCountryCodeRegex.test(locationInput)) {
      return true;
    } else if (zipCountryCodeRegex.test(locationInput)) {
      return true;
    } else {
      return false;
    }
  }

  static determineZipOrCity(locationInput) {
    const cityCountryCodeRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*,\s[a-zA-Z]{2}$/;
    const cityStateCountryCodeRegex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*,\s[a-zA-Z]{2},\s[a-zA-Z]{2}$/;
    const zipCountryCodeRegex = /^\d{5},\s[a-zA-Z]{2}$/;

    if (cityCountryCodeRegex.test(locationInput)) {
      return 'cityCountryCode';
    } else if (cityStateCountryCodeRegex.test(locationInput)) {
      return 'cityStateCountryCode';
    } else if (zipCountryCodeRegex.test(locationInput)) {
      return 'zipCountryCode';
    } else {
      return 'city';
    }
  }

  static stripWhiteSpace(input) {
    const returnString = input
      .replace(/^\s+/, '')
      .replace(/\s+$/, '')
      .replace(/\s*,\s*/g, ',')
      .replace(/\s+/g, '+');
    return returnString;
  }

  // Modal Formatting

  static callWrongInputModal() {
    const modal = document.getElementById('myModal');
    modal.innerHTML = `
      <div class="modal-content">
      <span class="close">&times;</span>
      <h3 class="modal-title">Oops!</h3>
      <h4 class="modal-title">Looks like you didn't write a valid input.</h4>
      <div class="modal-text-container">
        <p class="modal-text">Try searching for:</p>
        <p class="modal-text">City Name, 2-Letter Country Code</p>
        <p class="modal-text">eg: Birmingham, UK</p>`;
    modal.style.display = 'flex';
    UI.initModalCloseListener();
  }

  static initModalCloseListener() {
    const modal = document.getElementById('myModal');
    const span = document.getElementsByClassName('close')[0];
    span.onclick = function () {
      modal.style.display = 'none';
      modal.innerHTML = '';
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
        modal.innerHTML = '';
      }
    };
  }
}

export { UI };
