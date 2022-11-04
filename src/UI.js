import { weatherAPI } from './weatherAPI';

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
    UI.resetSearchBar();
    errorInfo.style.visibility = 'hidden';
    console.log("going to trigger displayWeatherData");
    UI.displayWeatherData(weatherData, locationObject);
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

  static displayWeatherData(weatherData, locationObject) {
    updateHeader(weatherData, locationObject);
    updateTemperature(weatherData);
    updateHumidity(weatherData);
    updateWind(weatherData);
    updateCloudiness(weatherData)

    function updateHeader(weatherData, locationObject) {
      const resultsHeader = document.querySelector('.results-header');
      const weatherDescription = document.querySelector('.weather-description');
      const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' });
      const countryName = regionNamesInEnglish.of(locationObject.country);
      if (locationObject.state) {
        resultsHeader.textContent = `${locationObject.name}, ${locationObject.state}, ${countryName}`;
      } else { 
        resultsHeader.textContent = `${locationObject.name}, ${countryName}`;
      }
      weatherDescription.textContent = toTitleCase(weatherData.weather[0].description);

      function toTitleCase(str) {
        return str.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
      }
    }

    function updateTemperature(weatherData) {
      const temperatureMain = document.querySelector('.temperature-main');
      const temperatureFeelsLike = document.querySelector('.temperature-feels-like');
      const currentTemp = Math.round(weatherData.main.temp - 273.15);
      const feelsLikeTemp = Math.round(weatherData.main.feels_like - 273.15);
      temperatureMain.textContent = `${currentTemp}°C`;
      temperatureFeelsLike.textContent = `Feels like ${feelsLikeTemp}°C`;
    }

    function updateHumidity(weatherData) {
      const humidityValue = document.querySelector('.humidity-value');
      humidityValue.textContent = `${weatherData.main.humidity}%`;
    }
    
    function updateWind(weatherData) {
      const windValue = document.querySelector('.wind-value');
      const windSpeed = Math.round(weatherData.wind.speed);
      windValue.textContent = `${windSpeed} m/s`;
    }

    function updateCloudiness(weatherData) {
      const cloudinessValue = document.querySelector('.cloudiness-value');
      cloudinessValue.textContent = `${weatherData.clouds.all}%`;
    }
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
