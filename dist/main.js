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
    const resultsContainer = document.getElementById('results-container');
    updateHeader(weatherData, locationObject);
    updateTemperature(weatherData);
    updateHumidity(weatherData);
    updateWind(weatherData);
    updateCloudiness(weatherData)
    resultsContainer.style.display = 'flex';

    function updateHeader(weatherData, locationObject) {
      const resultsHeader = document.querySelector('.results-header');
      const weatherDescription = document.querySelector('.weather-description');
      if (locationObject.state) {
        resultsHeader.textContent = `${locationObject.name}, ${locationObject.state}, ${locationObject.country}`;
      } else { 
        resultsHeader.textContent = `${locationObject.name}, ${locationObject.country}`;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ZXItYXBwLy4vc3JjL1VJLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2xvY2F0aW9uRGF0YS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy93ZWF0aGVyQVBJLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3dlYXRoZXJEYXRhLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgd2VhdGhlckFQSSB9IGZyb20gJy4vd2VhdGhlckFQSSc7XG5pbXBvcnQgeyBsb2NhdGlvbkRhdGEgfSBmcm9tICcuL2xvY2F0aW9uRGF0YSc7XG5pbXBvcnQgeyB3ZWF0aGVyRGF0YSB9IGZyb20gJy4vd2VhdGhlckRhdGEnO1xuXG5jbGFzcyBVSSB7XG4gIHN0YXRpYyBzZXRIb21lUGFnZSgpIHtcbiAgICBnZW5lcmF0ZVNlYXJjaEJhcigpO1xuICAgIFVJLmluaXRTZWFyY2hMaXN0ZW5lcigpO1xuXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVTZWFyY2hCYXIoKSB7XG4gICAgICBjb25zdCBzZWFyY2hDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoLWNvbnRhaW5lcicpO1xuICAgICAgY29uc3Qgc2VhcmNoQmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgIGNvbnN0IGVycm9ySW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgIHNlYXJjaEJhci5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgICAgc2VhcmNoQmFyLnNldEF0dHJpYnV0ZSgnaWQnLCAnbG9jYXRpb24taW5wdXQnKTtcbiAgICAgIHNlYXJjaEJhci5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywgJ1NlYXJjaCBmb3IgYSBsb2NhdGlvbicpO1xuICAgICAgZXJyb3JJbmZvLnNldEF0dHJpYnV0ZSgnaWQnLCAnZXJyb3ItaW5mbycpO1xuICAgICAgc2VhcmNoQ29udGFpbmVyLmFwcGVuZENoaWxkKHNlYXJjaEJhcik7XG4gICAgICBzZWFyY2hDb250YWluZXIuYXBwZW5kQ2hpbGQoZXJyb3JJbmZvKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgaW5pdFNlYXJjaExpc3RlbmVyKCkge1xuICAgIGNvbnN0IHNlYXJjaEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2NhdGlvbi1pbnB1dCcpO1xuICAgIHNlYXJjaEJhci5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgY29uc3QgbG9jYXRpb25JbnB1dCA9IHNlYXJjaEJhci52YWx1ZTtcbiAgICAgICAgVUkucHJvY2Vzc1VzZXJJbnB1dChsb2NhdGlvbklucHV0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBwcm9jZXNzVXNlcklucHV0KGxvY2F0aW9uSW5wdXQpIHtcbiAgICBjb25zdCBlcnJvckluZm8gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXJyb3ItaW5mbycpO1xuICAgIGNvbnN0IHN0cmlwcGVkTG9jYXRpb25JbnB1dCA9IFVJLnN0cmlwUmVwbGFjZVdoaXRlU3BhY2UobG9jYXRpb25JbnB1dCk7XG4gICAgbGV0IHJlcXVlc3RlZExvY2F0aW9uRGF0YTtcblxuICAgIGVycm9ySW5mby50ZXh0Q29udGVudCA9ICdTZWFyY2hpbmcuLi4nO1xuXG4gICAgaWYgKFVJLmRldGVybWluZVppcE9yQ2l0eShsb2NhdGlvbklucHV0KSA9PT0gJ3ppcENvdW50cnlDb2RlJykge1xuICAgICAgcmVxdWVzdGVkTG9jYXRpb25EYXRhID0gYXdhaXQgd2VhdGhlckFQSS5mZXRjaExvY2F0aW9uRGF0YUJ5WmlwUG9zdENvZGUoXG4gICAgICAgIHN0cmlwcGVkTG9jYXRpb25JbnB1dFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVxdWVzdGVkTG9jYXRpb25EYXRhID0gYXdhaXQgd2VhdGhlckFQSS5mZXRjaExvY2F0aW9uRGF0YUJ5TG9jYXRpb25OYW1lKFxuICAgICAgICBzdHJpcHBlZExvY2F0aW9uSW5wdXRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKHJlcXVlc3RlZExvY2F0aW9uRGF0YVswXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBVSS5kaXNwbGF5RXJyb3JNZXNzYWdlKCdsb2NhdGlvbk5vdEZvdW5kJyk7XG4gICAgICBVSS5yZXNldFNlYXJjaEJhcigpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGxvY2F0aW9uT2JqZWN0ID0gYXdhaXQgcmVxdWVzdGVkTG9jYXRpb25EYXRhWzBdO1xuICAgIGNvbnN0IGlucHV0TGF0ID0gTWF0aC5yb3VuZChsb2NhdGlvbk9iamVjdC5sYXQgKiAxMDApIC8gMTAwO1xuICAgIGNvbnN0IGlucHV0TG9uID0gTWF0aC5yb3VuZChsb2NhdGlvbk9iamVjdC5sb24gKiAxMDApIC8gMTAwO1xuICAgIGNvbnN0IHdlYXRoZXJEYXRhID0gYXdhaXQgd2VhdGhlckFQSS5mZXRjaFdlYXRoZXJEYXRhKGlucHV0TGF0LCBpbnB1dExvbik7XG4gICAgVUkucmVzZXRTZWFyY2hCYXIoKTtcbiAgICBlcnJvckluZm8uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIGNvbnNvbGUubG9nKFwiZ29pbmcgdG8gdHJpZ2dlciBkaXNwbGF5V2VhdGhlckRhdGFcIik7XG4gICAgVUkuZGlzcGxheVdlYXRoZXJEYXRhKHdlYXRoZXJEYXRhLCBsb2NhdGlvbk9iamVjdCk7XG4gIH1cblxuICBzdGF0aWMgZGV0ZXJtaW5lWmlwT3JDaXR5KGxvY2F0aW9uSW5wdXQpIHtcbiAgICBjb25zdCBjaXR5Q291bnRyeUNvZGVSZWdleCA9IC9eW2EtekEtWl0rKD86W1xccy1dW2EtekEtWl0rKSosXFxzW2EtekEtWl17Mn0kLztcbiAgICBjb25zdCBjaXR5U3RhdGVDb3VudHJ5Q29kZVJlZ2V4ID0gL15bYS16QS1aXSsoPzpbXFxzLV1bYS16QS1aXSspKixcXHNbYS16QS1aXXsyfSxcXHNbYS16QS1aXXsyfSQvO1xuICAgIGNvbnN0IHppcENvdW50cnlDb2RlUmVnZXggPSAvXlxcZHs1fSxcXHNbYS16QS1aXXsyfSQvO1xuXG4gICAgaWYgKHppcENvdW50cnlDb2RlUmVnZXgudGVzdChsb2NhdGlvbklucHV0KSkge1xuICAgICAgcmV0dXJuICd6aXBDb3VudHJ5Q29kZSc7XG4gICAgfSBlbHNlIGlmIChjaXR5U3RhdGVDb3VudHJ5Q29kZVJlZ2V4LnRlc3QobG9jYXRpb25JbnB1dCkpIHtcbiAgICAgIHJldHVybiAnY2l0eVN0YXRlQ291bnRyeUNvZGUnO1xuICAgIH0gZWxzZSBpZiAoY2l0eUNvdW50cnlDb2RlUmVnZXgudGVzdChsb2NhdGlvbklucHV0KSkge1xuICAgICAgcmV0dXJuICdjaXR5Q291bnRyeUNvZGUnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ2NpdHknO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBzdHJpcFJlcGxhY2VXaGl0ZVNwYWNlKGlucHV0KSB7XG4gICAgY29uc3QgcmV0dXJuU3RyaW5nID0gaW5wdXRcbiAgICAgIC5yZXBsYWNlKC9eXFxzKy8sICcnKVxuICAgICAgLnJlcGxhY2UoL1xccyskLywgJycpXG4gICAgICAucmVwbGFjZSgvXFxzKixcXHMqL2csICcsJylcbiAgICAgIC5yZXBsYWNlKC9cXHMrL2csICcrJyk7XG4gICAgcmV0dXJuIHJldHVyblN0cmluZztcbiAgfVxuXG4gIHN0YXRpYyBkaXNwbGF5V2VhdGhlckRhdGEod2VhdGhlckRhdGEsIGxvY2F0aW9uT2JqZWN0KSB7XG4gICAgY29uc3QgcmVzdWx0c0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN1bHRzLWNvbnRhaW5lcicpO1xuICAgIHVwZGF0ZUhlYWRlcih3ZWF0aGVyRGF0YSwgbG9jYXRpb25PYmplY3QpO1xuICAgIHVwZGF0ZVRlbXBlcmF0dXJlKHdlYXRoZXJEYXRhKTtcbiAgICB1cGRhdGVIdW1pZGl0eSh3ZWF0aGVyRGF0YSk7XG4gICAgdXBkYXRlV2luZCh3ZWF0aGVyRGF0YSk7XG4gICAgdXBkYXRlQ2xvdWRpbmVzcyh3ZWF0aGVyRGF0YSlcbiAgICByZXN1bHRzQ29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XG5cbiAgICBmdW5jdGlvbiB1cGRhdGVIZWFkZXIod2VhdGhlckRhdGEsIGxvY2F0aW9uT2JqZWN0KSB7XG4gICAgICBjb25zdCByZXN1bHRzSGVhZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlc3VsdHMtaGVhZGVyJyk7XG4gICAgICBjb25zdCB3ZWF0aGVyRGVzY3JpcHRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2VhdGhlci1kZXNjcmlwdGlvbicpO1xuICAgICAgaWYgKGxvY2F0aW9uT2JqZWN0LnN0YXRlKSB7XG4gICAgICAgIHJlc3VsdHNIZWFkZXIudGV4dENvbnRlbnQgPSBgJHtsb2NhdGlvbk9iamVjdC5uYW1lfSwgJHtsb2NhdGlvbk9iamVjdC5zdGF0ZX0sICR7bG9jYXRpb25PYmplY3QuY291bnRyeX1gO1xuICAgICAgfSBlbHNlIHsgXG4gICAgICAgIHJlc3VsdHNIZWFkZXIudGV4dENvbnRlbnQgPSBgJHtsb2NhdGlvbk9iamVjdC5uYW1lfSwgJHtsb2NhdGlvbk9iamVjdC5jb3VudHJ5fWA7XG4gICAgICB9XG4gICAgICB3ZWF0aGVyRGVzY3JpcHRpb24udGV4dENvbnRlbnQgPSB0b1RpdGxlQ2FzZSh3ZWF0aGVyRGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uKTtcblxuICAgICAgZnVuY3Rpb24gdG9UaXRsZUNhc2Uoc3RyKSB7XG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZShcbiAgICAgICAgICAvXFx3XFxTKi9nLFxuICAgICAgICAgICh0eHQpID0+IHR4dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHR4dC5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRlbXBlcmF0dXJlKHdlYXRoZXJEYXRhKSB7XG4gICAgICBjb25zdCB0ZW1wZXJhdHVyZU1haW4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGVtcGVyYXR1cmUtbWFpbicpO1xuICAgICAgY29uc3QgdGVtcGVyYXR1cmVGZWVsc0xpa2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGVtcGVyYXR1cmUtZmVlbHMtbGlrZScpO1xuICAgICAgY29uc3QgY3VycmVudFRlbXAgPSBNYXRoLnJvdW5kKHdlYXRoZXJEYXRhLm1haW4udGVtcCAtIDI3My4xNSk7XG4gICAgICBjb25zdCBmZWVsc0xpa2VUZW1wID0gTWF0aC5yb3VuZCh3ZWF0aGVyRGF0YS5tYWluLmZlZWxzX2xpa2UgLSAyNzMuMTUpO1xuICAgICAgdGVtcGVyYXR1cmVNYWluLnRleHRDb250ZW50ID0gYCR7Y3VycmVudFRlbXB9wrBDYDtcbiAgICAgIHRlbXBlcmF0dXJlRmVlbHNMaWtlLnRleHRDb250ZW50ID0gYEZlZWxzIGxpa2UgJHtmZWVsc0xpa2VUZW1wfcKwQ2A7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlSHVtaWRpdHkod2VhdGhlckRhdGEpIHtcbiAgICAgIGNvbnN0IGh1bWlkaXR5VmFsdWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaHVtaWRpdHktdmFsdWUnKTtcbiAgICAgIGh1bWlkaXR5VmFsdWUudGV4dENvbnRlbnQgPSBgJHt3ZWF0aGVyRGF0YS5tYWluLmh1bWlkaXR5fSVgO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiB1cGRhdGVXaW5kKHdlYXRoZXJEYXRhKSB7XG4gICAgICBjb25zdCB3aW5kVmFsdWUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcud2luZC12YWx1ZScpO1xuICAgICAgY29uc3Qgd2luZFNwZWVkID0gTWF0aC5yb3VuZCh3ZWF0aGVyRGF0YS53aW5kLnNwZWVkICogMy42KTtcbiAgICAgIHdpbmRWYWx1ZS50ZXh0Q29udGVudCA9IGAke3dpbmRTcGVlZH0ga20vaGA7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlQ2xvdWRpbmVzcyh3ZWF0aGVyRGF0YSkge1xuICAgICAgY29uc3QgY2xvdWRpbmVzc1ZhbHVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmNsb3VkaW5lc3MtdmFsdWUnKTtcbiAgICAgIGNsb3VkaW5lc3NWYWx1ZS50ZXh0Q29udGVudCA9IGAke3dlYXRoZXJEYXRhLmNsb3Vkcy5hbGx9JWA7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHJlc2V0U2VhcmNoQmFyKCkge1xuICAgIGNvbnN0IHNlYXJjaEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2NhdGlvbi1pbnB1dCcpO1xuICAgIHNlYXJjaEJhci52YWx1ZSA9ICcnO1xuICB9XG5cbiAgc3RhdGljIGRpc3BsYXlFcnJvck1lc3NhZ2UoZXJyb3JUeXBlKSB7XG4gICAgY29uc3QgZXJyb3JJbmZvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yLWluZm8nKTtcbiAgICBlcnJvckluZm8uc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgICBpZiAoZXJyb3JUeXBlID09PSAnbG9jYXRpb25Ob3RGb3VuZCcpIHtcbiAgICAgIGVycm9ySW5mby50ZXh0Q29udGVudCA9ICdMb2NhdGlvbiBub3QgZm91bmQuIFRyeSBhZ2Fpbi4nO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgeyBVSSB9O1xuIiwiY29uc3QgbG9jYXRpb25EYXRhID0gKG5hbWUsIGxhdCwgbG9uLCBjb3VudHJ5KSA9PiB7XG4gIHJldHVybiB7IG5hbWUsIGxhdCwgbG9uLCBjb3VudHJ5IH07XG59XG5cbmV4cG9ydCB7IGxvY2F0aW9uRGF0YSB9OyIsImNsYXNzIHdlYXRoZXJBUEkge1xuICBzdGF0aWMgYXN5bmMgZmV0Y2hMb2NhdGlvbkRhdGFCeUxvY2F0aW9uTmFtZShsb2NhdGlvbklucHV0KSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGlucHV0U3RyaW5nID0gYGh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2dlby8xLjAvZGlyZWN0P3E9JHtsb2NhdGlvbklucHV0fSZsaW1pdD0xJmFwcGlkPTQyMzU4MzBmNmNjYWZlMjE1ZDlmYTA0Y2QxNDRhYzBmYDtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goaW5wdXRTdHJpbmcsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICAgICAgY29uc3QgbG9jYXRpb25EYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgcmV0dXJuIGxvY2F0aW9uRGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBmZXRjaExvY2F0aW9uRGF0YUJ5WmlwUG9zdENvZGUoemlwQ29kZUFuZENvdW50cnlDb2RlKSB7XG4gICAgY29uc3QgaW5wdXRTdHJpbmcgPSBgaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZ2VvLzEuMC96aXA/emlwPSR7emlwQ29kZUFuZENvdW50cnlDb2RlfSZhcHBpZD00MjM1ODMwZjZjY2FmZTIxNWQ5ZmEwNGNkMTQ0YWMwZmA7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChpbnB1dFN0cmluZywgeyBtb2RlOiAnY29ycycgfSk7XG4gICAgICBjb25zdCBsb2NhdGlvbkRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICByZXR1cm4gbG9jYXRpb25EYXRhO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIGZldGNoV2VhdGhlckRhdGEobGF0LCBsb24pIHtcbiAgICBjb25zdCBpbnB1dFN0cmluZyA9IGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mYXBwaWQ9NDIzNTgzMGY2Y2NhZmUyMTVkOWZhMDRjZDE0NGFjMGZgO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goaW5wdXRTdHJpbmcsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICAgICAgY29uc3Qgd2VhdGhlckRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICByZXR1cm4gd2VhdGhlckRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlTG9jYXRpb25PYmplY3QobG9jYXRpb25EYXRhQXJyYXkpIHtcbiAgICBjb25zdCBsb2NhdGlvbk9iamVjdCA9IGxvY2F0aW9uRGF0YUFycmF5WzBdO1xuICAgIHJldHVybiBsb2NhdGlvbk9iamVjdDtcbiAgfVxufVxuXG5leHBvcnQgeyB3ZWF0aGVyQVBJIH07XG4iLCJjb25zdCB3ZWF0aGVyRGF0YSA9IChcbiAgd2VhdGhlckRlc2NyaXB0aW9uLFxuICB0ZW1wZXJhdHVyZSxcbiAgZmVlbHNMaWtlLFxuICBodW1pZGl0eSxcbiAgcHJlY2lwYXRpb25MYXN0SG91ciA9IG51bGwsXG4gIHdpbmRTcGVlZFxuKSA9PiB7XG4gIHJldHVybiB7XG4gICAgd2VhdGhlckRlc2NyaXB0aW9uLFxuICAgIHRlbXBlcmF0dXJlLFxuICAgIGZlZWxzTGlrZSxcbiAgICBodW1pZGl0eSxcbiAgICBwcmVjaXBhdGlvbkxhc3RIb3VyLFxuICAgIHdpbmRTcGVlZCxcbiAgfTtcbn07XG5cbmV4cG9ydCB7IHdlYXRoZXJEYXRhIH07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBVSSB9IGZyb20gJy4vVUknO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgVUkuc2V0SG9tZVBhZ2UpO1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9