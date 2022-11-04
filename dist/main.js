/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/UI.js":
/*!*******************!*\
  !*** ./src/UI.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "UI": () => (/* binding */ UI)
/* harmony export */ });
/* harmony import */ var _weatherAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./weatherAPI */ "./src/weatherAPI.js");
/* harmony import */ var _locationData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./locationData */ "./src/locationData.js");
/* harmony import */ var _weatherData__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./weatherData */ "./src/weatherData.js");




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
      requestedLocationData = await _weatherAPI__WEBPACK_IMPORTED_MODULE_0__.weatherAPI.fetchLocationDataByZipPostCode(
        strippedLocationInput
      );
    } else {
      requestedLocationData = await _weatherAPI__WEBPACK_IMPORTED_MODULE_0__.weatherAPI.fetchLocationDataByLocationName(
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
    const weatherData = await _weatherAPI__WEBPACK_IMPORTED_MODULE_0__.weatherAPI.fetchWeatherData(inputLat, inputLon);
    console.log(weatherData);
    UI.resetSearchBar();
    errorInfo.style.visibility = 'hidden';
    console.log("going to trigger displayWeatherData");
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
    const resultsContainer = document.getElementById('results-container');
    updateHeader(weatherData);
    updateTemperature(weatherData);
    updateHumidity(weatherData);
    updateWind(weatherData);
    updateCloudiness(weatherData)
    resultsContainer.style.display = 'flex';

    function updateHeader(weatherData) {
      const resultsHeader = document.querySelector('.results-header');
      const weatherDescription = document.querySelector('.weather-description');

      resultsHeader.textContent = weatherData.name;
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
      const windSpeed = Math.round(weatherData.wind.speed * 3.6);
      windValue.textContent = `${windSpeed} km/h`;
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




/***/ }),

/***/ "./src/locationData.js":
/*!*****************************!*\
  !*** ./src/locationData.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "locationData": () => (/* binding */ locationData)
/* harmony export */ });
const locationData = (name, lat, lon, country) => {
  return { name, lat, lon, country };
}



/***/ }),

/***/ "./src/weatherAPI.js":
/*!***************************!*\
  !*** ./src/weatherAPI.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "weatherAPI": () => (/* binding */ weatherAPI)
/* harmony export */ });
class weatherAPI {
  static async fetchLocationDataByLocationName(locationInput) {
    try {
      const inputString = `http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=4235830f6ccafe215d9fa04cd144ac0f`;
      const response = await fetch(inputString, { mode: 'cors' });
      const locationData = await response.json();
      return locationData;
    } catch (error) {
      console.log(error);
    }
  }

  static async fetchLocationDataByZipPostCode(zipCodeAndCountryCode) {
    const inputString = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCodeAndCountryCode}&appid=4235830f6ccafe215d9fa04cd144ac0f`;

    try {
      const response = await fetch(inputString, { mode: 'cors' });
      const locationData = await response.json();
      return locationData;
    } catch (error) {
      console.log(error);
    }
  }

  static async fetchWeatherData(lat, lon) {
    const inputString = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4235830f6ccafe215d9fa04cd144ac0f`;

    try {
      const response = await fetch(inputString, { mode: 'cors' });
      const weatherData = await response.json();
      return weatherData;
    } catch (error) {
      console.log(error);
    }
  }

  static createLocationObject(locationDataArray) {
    const locationObject = locationDataArray[0];
    return locationObject;
  }
}




/***/ }),

/***/ "./src/weatherData.js":
/*!****************************!*\
  !*** ./src/weatherData.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "weatherData": () => (/* binding */ weatherData)
/* harmony export */ });
const weatherData = (
  weatherDescription,
  temperature,
  feelsLike,
  humidity,
  precipationLastHour = null,
  windSpeed
) => {
  return {
    weatherDescription,
    temperature,
    feelsLike,
    humidity,
    precipationLastHour,
    windSpeed,
  };
};



/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _UI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UI */ "./src/UI.js");


document.addEventListener('DOMContentLoaded', _UI__WEBPACK_IMPORTED_MODULE_0__.UI.setHomePage);

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUEwQztBQUNJO0FBQ0Y7O0FBRTVDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLG9DQUFvQyxrRkFBeUM7QUFDN0U7QUFDQTtBQUNBLE1BQU07QUFDTixvQ0FBb0MsbUZBQTBDO0FBQzlFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixvRUFBMkI7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkVBQTJFLEVBQUU7QUFDN0UsZ0ZBQWdGLEVBQUUsWUFBWSxFQUFFO0FBQ2hHLHFDQUFxQyxFQUFFLFlBQVksRUFBRTs7QUFFckQ7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUMsWUFBWTtBQUNuRCx1REFBdUQsY0FBYztBQUNyRTs7QUFFQTtBQUNBO0FBQ0EscUNBQXFDLDBCQUEwQjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLFdBQVc7QUFDNUM7O0FBRUE7QUFDQTtBQUNBLHVDQUF1Qyx1QkFBdUI7QUFDOUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVjOzs7Ozs7Ozs7Ozs7Ozs7QUMzSmQ7QUFDQSxXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGQTtBQUNBO0FBQ0E7QUFDQSw0RUFBNEUsY0FBYztBQUMxRixrREFBa0QsY0FBYztBQUNoRTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlFQUF5RSxzQkFBc0I7O0FBRS9GO0FBQ0Esa0RBQWtELGNBQWM7QUFDaEU7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrRUFBK0UsSUFBSSxPQUFPLElBQUk7O0FBRTlGO0FBQ0Esa0RBQWtELGNBQWM7QUFDaEU7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFc0I7Ozs7Ozs7Ozs7Ozs7OztBQzFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7VUNoQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ04wQjs7QUFFMUIsOENBQThDLCtDQUFjIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvVUkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbG9jYXRpb25EYXRhLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3dlYXRoZXJBUEkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvd2VhdGhlckRhdGEuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB3ZWF0aGVyQVBJIH0gZnJvbSAnLi93ZWF0aGVyQVBJJztcbmltcG9ydCB7IGxvY2F0aW9uRGF0YSB9IGZyb20gJy4vbG9jYXRpb25EYXRhJztcbmltcG9ydCB7IHdlYXRoZXJEYXRhIH0gZnJvbSAnLi93ZWF0aGVyRGF0YSc7XG5cbmNsYXNzIFVJIHtcbiAgc3RhdGljIHNldEhvbWVQYWdlKCkge1xuICAgIGdlbmVyYXRlU2VhcmNoQmFyKCk7XG4gICAgVUkuaW5pdFNlYXJjaExpc3RlbmVyKCk7XG5cbiAgICBmdW5jdGlvbiBnZW5lcmF0ZVNlYXJjaEJhcigpIHtcbiAgICAgIGNvbnN0IHNlYXJjaENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWFyY2gtY29udGFpbmVyJyk7XG4gICAgICBjb25zdCBzZWFyY2hCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgY29uc3QgZXJyb3JJbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgc2VhcmNoQmFyLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgICBzZWFyY2hCYXIuc2V0QXR0cmlidXRlKCdpZCcsICdsb2NhdGlvbi1pbnB1dCcpO1xuICAgICAgc2VhcmNoQmFyLnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCAnU2VhcmNoIGZvciBhIGxvY2F0aW9uJyk7XG4gICAgICBlcnJvckluZm8uc2V0QXR0cmlidXRlKCdpZCcsICdlcnJvci1pbmZvJyk7XG4gICAgICBzZWFyY2hDb250YWluZXIuYXBwZW5kQ2hpbGQoc2VhcmNoQmFyKTtcbiAgICAgIHNlYXJjaENvbnRhaW5lci5hcHBlbmRDaGlsZChlcnJvckluZm8pO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpbml0U2VhcmNoTGlzdGVuZXIoKSB7XG4gICAgY29uc3Qgc2VhcmNoQmFyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvY2F0aW9uLWlucHV0Jyk7XG4gICAgc2VhcmNoQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgKGUpID0+IHtcbiAgICAgIGlmIChlLmtleSA9PT0gJ0VudGVyJykge1xuICAgICAgICBjb25zdCBsb2NhdGlvbklucHV0ID0gc2VhcmNoQmFyLnZhbHVlO1xuICAgICAgICBVSS5wcm9jZXNzVXNlcklucHV0KGxvY2F0aW9uSW5wdXQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIHByb2Nlc3NVc2VySW5wdXQobG9jYXRpb25JbnB1dCkge1xuICAgIGNvbnN0IGVycm9ySW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvci1pbmZvJyk7XG4gICAgY29uc3Qgc3RyaXBwZWRMb2NhdGlvbklucHV0ID0gVUkuc3RyaXBSZXBsYWNlV2hpdGVTcGFjZShsb2NhdGlvbklucHV0KTtcbiAgICBsZXQgcmVxdWVzdGVkTG9jYXRpb25EYXRhO1xuXG4gICAgZXJyb3JJbmZvLnRleHRDb250ZW50ID0gJ1NlYXJjaGluZy4uLic7XG5cbiAgICBpZiAoVUkuZGV0ZXJtaW5lWmlwT3JDaXR5KGxvY2F0aW9uSW5wdXQpID09PSAnemlwQ291bnRyeUNvZGUnKSB7XG4gICAgICByZXF1ZXN0ZWRMb2NhdGlvbkRhdGEgPSBhd2FpdCB3ZWF0aGVyQVBJLmZldGNoTG9jYXRpb25EYXRhQnlaaXBQb3N0Q29kZShcbiAgICAgICAgc3RyaXBwZWRMb2NhdGlvbklucHV0XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXF1ZXN0ZWRMb2NhdGlvbkRhdGEgPSBhd2FpdCB3ZWF0aGVyQVBJLmZldGNoTG9jYXRpb25EYXRhQnlMb2NhdGlvbk5hbWUoXG4gICAgICAgIHN0cmlwcGVkTG9jYXRpb25JbnB1dFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAocmVxdWVzdGVkTG9jYXRpb25EYXRhWzBdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIFVJLmRpc3BsYXlFcnJvck1lc3NhZ2UoJ2xvY2F0aW9uTm90Rm91bmQnKTtcbiAgICAgIFVJLnJlc2V0U2VhcmNoQmFyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbG9jYXRpb25PYmplY3QgPSBhd2FpdCByZXF1ZXN0ZWRMb2NhdGlvbkRhdGFbMF07XG4gICAgY29uc3QgaW5wdXRMYXQgPSBNYXRoLnJvdW5kKGxvY2F0aW9uT2JqZWN0LmxhdCAqIDEwMCkgLyAxMDA7XG4gICAgY29uc3QgaW5wdXRMb24gPSBNYXRoLnJvdW5kKGxvY2F0aW9uT2JqZWN0LmxvbiAqIDEwMCkgLyAxMDA7XG4gICAgY29uc3Qgd2VhdGhlckRhdGEgPSBhd2FpdCB3ZWF0aGVyQVBJLmZldGNoV2VhdGhlckRhdGEoaW5wdXRMYXQsIGlucHV0TG9uKTtcbiAgICBjb25zb2xlLmxvZyh3ZWF0aGVyRGF0YSk7XG4gICAgVUkucmVzZXRTZWFyY2hCYXIoKTtcbiAgICBlcnJvckluZm8uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIGNvbnNvbGUubG9nKFwiZ29pbmcgdG8gdHJpZ2dlciBkaXNwbGF5V2VhdGhlckRhdGFcIik7XG4gICAgVUkuZGlzcGxheVdlYXRoZXJEYXRhKHdlYXRoZXJEYXRhKTtcbiAgfVxuXG4gIHN0YXRpYyBkZXRlcm1pbmVaaXBPckNpdHkobG9jYXRpb25JbnB1dCkge1xuICAgIGNvbnN0IGNpdHlDb3VudHJ5Q29kZVJlZ2V4ID0gL15bYS16QS1aXSsoPzpbXFxzLV1bYS16QS1aXSspKixcXHNbYS16QS1aXXsyfSQvO1xuICAgIGNvbnN0IGNpdHlTdGF0ZUNvdW50cnlDb2RlUmVnZXggPSAvXlthLXpBLVpdKyg/OltcXHMtXVthLXpBLVpdKykqLFxcc1thLXpBLVpdezJ9LFxcc1thLXpBLVpdezJ9JC87XG4gICAgY29uc3QgemlwQ291bnRyeUNvZGVSZWdleCA9IC9eXFxkezV9LFxcc1thLXpBLVpdezJ9JC87XG5cbiAgICBpZiAoemlwQ291bnRyeUNvZGVSZWdleC50ZXN0KGxvY2F0aW9uSW5wdXQpKSB7XG4gICAgICByZXR1cm4gJ3ppcENvdW50cnlDb2RlJztcbiAgICB9IGVsc2UgaWYgKGNpdHlTdGF0ZUNvdW50cnlDb2RlUmVnZXgudGVzdChsb2NhdGlvbklucHV0KSkge1xuICAgICAgcmV0dXJuICdjaXR5U3RhdGVDb3VudHJ5Q29kZSc7XG4gICAgfSBlbHNlIGlmIChjaXR5Q291bnRyeUNvZGVSZWdleC50ZXN0KGxvY2F0aW9uSW5wdXQpKSB7XG4gICAgICByZXR1cm4gJ2NpdHlDb3VudHJ5Q29kZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnY2l0eSc7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHN0cmlwUmVwbGFjZVdoaXRlU3BhY2UoaW5wdXQpIHtcbiAgICBjb25zdCByZXR1cm5TdHJpbmcgPSBpbnB1dFxuICAgICAgLnJlcGxhY2UoL15cXHMrLywgJycpXG4gICAgICAucmVwbGFjZSgvXFxzKyQvLCAnJylcbiAgICAgIC5yZXBsYWNlKC9cXHMqLFxccyovZywgJywnKVxuICAgICAgLnJlcGxhY2UoL1xccysvZywgJysnKTtcbiAgICByZXR1cm4gcmV0dXJuU3RyaW5nO1xuICB9XG5cbiAgc3RhdGljIGRpc3BsYXlXZWF0aGVyRGF0YSh3ZWF0aGVyRGF0YSkge1xuICAgIGNvbnN0IHJlc3VsdHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncmVzdWx0cy1jb250YWluZXInKTtcbiAgICB1cGRhdGVIZWFkZXIod2VhdGhlckRhdGEpO1xuICAgIHVwZGF0ZVRlbXBlcmF0dXJlKHdlYXRoZXJEYXRhKTtcbiAgICB1cGRhdGVIdW1pZGl0eSh3ZWF0aGVyRGF0YSk7XG4gICAgdXBkYXRlV2luZCh3ZWF0aGVyRGF0YSk7XG4gICAgdXBkYXRlQ2xvdWRpbmVzcyh3ZWF0aGVyRGF0YSlcbiAgICByZXN1bHRzQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVIZWFkZXIod2VhdGhlckRhdGEpIHtcbiAgICAgIGNvbnN0IHJlc3VsdHNIZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVzdWx0cy1oZWFkZXInKTtcbiAgICAgIGNvbnN0IHdlYXRoZXJEZXNjcmlwdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy53ZWF0aGVyLWRlc2NyaXB0aW9uJyk7XG5cbiAgICAgIHJlc3VsdHNIZWFkZXIudGV4dENvbnRlbnQgPSB3ZWF0aGVyRGF0YS5uYW1lO1xuICAgICAgd2VhdGhlckRlc2NyaXB0aW9uLnRleHRDb250ZW50ID0gdG9UaXRsZUNhc2Uod2VhdGhlckRhdGEud2VhdGhlclswXS5kZXNjcmlwdGlvbik7XG5cbiAgICAgIGZ1bmN0aW9uIHRvVGl0bGVDYXNlKHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoXG4gICAgICAgICAgL1xcd1xcUyovZyxcbiAgICAgICAgICAodHh0KSA9PiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVUZW1wZXJhdHVyZSh3ZWF0aGVyRGF0YSkge1xuICAgICAgY29uc3QgdGVtcGVyYXR1cmVNYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRlbXBlcmF0dXJlLW1haW4nKTtcbiAgICAgIGNvbnN0IHRlbXBlcmF0dXJlRmVlbHNMaWtlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRlbXBlcmF0dXJlLWZlZWxzLWxpa2UnKTtcbiAgICAgIGNvbnN0IGN1cnJlbnRUZW1wID0gTWF0aC5yb3VuZCh3ZWF0aGVyRGF0YS5tYWluLnRlbXAgLSAyNzMuMTUpO1xuICAgICAgY29uc3QgZmVlbHNMaWtlVGVtcCA9IE1hdGgucm91bmQod2VhdGhlckRhdGEubWFpbi5mZWVsc19saWtlIC0gMjczLjE1KTtcbiAgICAgIHRlbXBlcmF0dXJlTWFpbi50ZXh0Q29udGVudCA9IGAke2N1cnJlbnRUZW1wfcKwQ2A7XG4gICAgICB0ZW1wZXJhdHVyZUZlZWxzTGlrZS50ZXh0Q29udGVudCA9IGBGZWVscyBsaWtlICR7ZmVlbHNMaWtlVGVtcH3CsENgO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUh1bWlkaXR5KHdlYXRoZXJEYXRhKSB7XG4gICAgICBjb25zdCBodW1pZGl0eVZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmh1bWlkaXR5LXZhbHVlJyk7XG4gICAgICBodW1pZGl0eVZhbHVlLnRleHRDb250ZW50ID0gYCR7d2VhdGhlckRhdGEubWFpbi5odW1pZGl0eX0lYDtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gdXBkYXRlV2luZCh3ZWF0aGVyRGF0YSkge1xuICAgICAgY29uc3Qgd2luZFZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLndpbmQtdmFsdWUnKTtcbiAgICAgIGNvbnN0IHdpbmRTcGVlZCA9IE1hdGgucm91bmQod2VhdGhlckRhdGEud2luZC5zcGVlZCAqIDMuNik7XG4gICAgICB3aW5kVmFsdWUudGV4dENvbnRlbnQgPSBgJHt3aW5kU3BlZWR9IGttL2hgO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUNsb3VkaW5lc3Mod2VhdGhlckRhdGEpIHtcbiAgICAgIGNvbnN0IGNsb3VkaW5lc3NWYWx1ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbG91ZGluZXNzLXZhbHVlJyk7XG4gICAgICBjbG91ZGluZXNzVmFsdWUudGV4dENvbnRlbnQgPSBgJHt3ZWF0aGVyRGF0YS5jbG91ZHMuYWxsfSVgO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyByZXNldFNlYXJjaEJhcigpIHtcbiAgICBjb25zdCBzZWFyY2hCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9jYXRpb24taW5wdXQnKTtcbiAgICBzZWFyY2hCYXIudmFsdWUgPSAnJztcbiAgfVxuXG4gIHN0YXRpYyBkaXNwbGF5RXJyb3JNZXNzYWdlKGVycm9yVHlwZSkge1xuICAgIGNvbnN0IGVycm9ySW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvci1pbmZvJyk7XG4gICAgZXJyb3JJbmZvLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgaWYgKGVycm9yVHlwZSA9PT0gJ2xvY2F0aW9uTm90Rm91bmQnKSB7XG4gICAgICBlcnJvckluZm8udGV4dENvbnRlbnQgPSAnTG9jYXRpb24gbm90IGZvdW5kLiBUcnkgYWdhaW4uJztcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgVUkgfTtcbiIsImNvbnN0IGxvY2F0aW9uRGF0YSA9IChuYW1lLCBsYXQsIGxvbiwgY291bnRyeSkgPT4ge1xuICByZXR1cm4geyBuYW1lLCBsYXQsIGxvbiwgY291bnRyeSB9O1xufVxuXG5leHBvcnQgeyBsb2NhdGlvbkRhdGEgfTsiLCJjbGFzcyB3ZWF0aGVyQVBJIHtcbiAgc3RhdGljIGFzeW5jIGZldGNoTG9jYXRpb25EYXRhQnlMb2NhdGlvbk5hbWUobG9jYXRpb25JbnB1dCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBpbnB1dFN0cmluZyA9IGBodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9nZW8vMS4wL2RpcmVjdD9xPSR7bG9jYXRpb25JbnB1dH0mbGltaXQ9MSZhcHBpZD00MjM1ODMwZjZjY2FmZTIxNWQ5ZmEwNGNkMTQ0YWMwZmA7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGlucHV0U3RyaW5nLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgICAgIGNvbnN0IGxvY2F0aW9uRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIHJldHVybiBsb2NhdGlvbkRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZmV0Y2hMb2NhdGlvbkRhdGFCeVppcFBvc3RDb2RlKHppcENvZGVBbmRDb3VudHJ5Q29kZSkge1xuICAgIGNvbnN0IGlucHV0U3RyaW5nID0gYGh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2dlby8xLjAvemlwP3ppcD0ke3ppcENvZGVBbmRDb3VudHJ5Q29kZX0mYXBwaWQ9NDIzNTgzMGY2Y2NhZmUyMTVkOWZhMDRjZDE0NGFjMGZgO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goaW5wdXRTdHJpbmcsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICAgICAgY29uc3QgbG9jYXRpb25EYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgcmV0dXJuIGxvY2F0aW9uRGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBmZXRjaFdlYXRoZXJEYXRhKGxhdCwgbG9uKSB7XG4gICAgY29uc3QgaW5wdXRTdHJpbmcgPSBgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/bGF0PSR7bGF0fSZsb249JHtsb259JmFwcGlkPTQyMzU4MzBmNmNjYWZlMjE1ZDlmYTA0Y2QxNDRhYzBmYDtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGlucHV0U3RyaW5nLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgICAgIGNvbnN0IHdlYXRoZXJEYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgcmV0dXJuIHdlYXRoZXJEYXRhO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUxvY2F0aW9uT2JqZWN0KGxvY2F0aW9uRGF0YUFycmF5KSB7XG4gICAgY29uc3QgbG9jYXRpb25PYmplY3QgPSBsb2NhdGlvbkRhdGFBcnJheVswXTtcbiAgICByZXR1cm4gbG9jYXRpb25PYmplY3Q7XG4gIH1cbn1cblxuZXhwb3J0IHsgd2VhdGhlckFQSSB9O1xuIiwiY29uc3Qgd2VhdGhlckRhdGEgPSAoXG4gIHdlYXRoZXJEZXNjcmlwdGlvbixcbiAgdGVtcGVyYXR1cmUsXG4gIGZlZWxzTGlrZSxcbiAgaHVtaWRpdHksXG4gIHByZWNpcGF0aW9uTGFzdEhvdXIgPSBudWxsLFxuICB3aW5kU3BlZWRcbikgPT4ge1xuICByZXR1cm4ge1xuICAgIHdlYXRoZXJEZXNjcmlwdGlvbixcbiAgICB0ZW1wZXJhdHVyZSxcbiAgICBmZWVsc0xpa2UsXG4gICAgaHVtaWRpdHksXG4gICAgcHJlY2lwYXRpb25MYXN0SG91cixcbiAgICB3aW5kU3BlZWQsXG4gIH07XG59O1xuXG5leHBvcnQgeyB3ZWF0aGVyRGF0YSB9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgVUkgfSBmcm9tICcuL1VJJztcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIFVJLnNldEhvbWVQYWdlKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==