import { weatherAPI } from './weatherAPI';
import { locationData } from './locationData';
import { weatherData } from './weatherData';

class UI {
  static setHomePage() {
    generateSearchBar();
    UI.initSearchListener();

    function generateSearchBar() {
      const searchContainer = document.getElementById('search-container');
      const searchBar = document.createElement('input');
      const errorInfo = document.createElement('p');
      searchBar.setAttribute('type', 'text');
      searchBar.setAttribute('id', 'location-input');
      searchBar.setAttribute('placeholder', 'Search for a location');
      errorInfo.setAttribute('id', 'error-info');
      searchContainer.appendChild(searchBar);
      searchContainer.appendChild(errorInfo);
    }
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
    const errorInfo = document.getElementById('error-info');
    const strippedLocationInput = UI.stripReplaceWhiteSpace(locationInput);
    let requestedLocationData;

    errorInfo.textContent = 'Searching...';
    
    if (UI.determineZipOrCity(locationInput) === 'zipCountryCode') {
      requestedLocationData = await weatherAPI.fetchLocationDataByZipPostCode(
        strippedLocationInput
      );
    } else {
      requestedLocationData = await weatherAPI.fetchLocationDataByLocationName(
        strippedLocationInput
      );
    }

    if (requestedLocationData[0] === undefined) {
      UI.displayErrorMessage('locationNotFound');
      UI.resetSearchBar();
      return;
    }

    const locationObject = await requestedLocationData[0];
    const inputLat = Math.round(locationObject.lat * 100) / 100;
    const inputLon = Math.round(locationObject.lon * 100) / 100;
    const weatherData = await weatherAPI.fetchWeatherData(inputLat, inputLon);
    console.log(weatherData);
    UI.resetSearchBar();
    errorInfo.style.visibility = 'hidden';
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

  static resetSearchBar() {
    const searchBar = document.getElementById('location-input');
    searchBar.value = '';
  }

  static displayErrorMessage(errorType) {
    const errorInfo = document.getElementById('error-info');
    errorInfo.style.visibility = 'visible';
    if (errorType === 'locationNotFound') {
      errorInfo.textContent = 'Location not found. Try again.';
    }
  }
  
}

export { UI };
