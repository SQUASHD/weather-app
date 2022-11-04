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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUEwQztBQUNJO0FBQ0Y7O0FBRTVDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msa0ZBQXlDO0FBQzdFO0FBQ0E7QUFDQSxNQUFNO0FBQ04sb0NBQW9DLG1GQUEwQztBQUM5RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsb0VBQTJCO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyRUFBMkUsRUFBRTtBQUM3RSxnRkFBZ0YsRUFBRSxZQUFZLEVBQUU7QUFDaEcscUNBQXFDLEVBQUUsWUFBWSxFQUFFOztBQUVyRDtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWM7Ozs7Ozs7Ozs7Ozs7OztBQzdHZDtBQUNBLFdBQVc7QUFDWDs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZBO0FBQ0E7QUFDQTtBQUNBLDRFQUE0RSxjQUFjO0FBQzFGLGtEQUFrRCxjQUFjO0FBQ2hFO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0EseUVBQXlFLHNCQUFzQjs7QUFFL0Y7QUFDQSxrREFBa0QsY0FBYztBQUNoRTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtFQUErRSxJQUFJLE9BQU8sSUFBSTs7QUFFOUY7QUFDQSxrREFBa0QsY0FBYztBQUNoRTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVzQjs7Ozs7Ozs7Ozs7Ozs7O0FDMUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztVQ2hCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7O0FDTjBCOztBQUUxQiw4Q0FBOEMsK0NBQWMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9VSS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9sb2NhdGlvbkRhdGEuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvd2VhdGhlckFQSS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy93ZWF0aGVyRGF0YS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHdlYXRoZXJBUEkgfSBmcm9tICcuL3dlYXRoZXJBUEknO1xuaW1wb3J0IHsgbG9jYXRpb25EYXRhIH0gZnJvbSAnLi9sb2NhdGlvbkRhdGEnO1xuaW1wb3J0IHsgd2VhdGhlckRhdGEgfSBmcm9tICcuL3dlYXRoZXJEYXRhJztcblxuY2xhc3MgVUkge1xuICBzdGF0aWMgc2V0SG9tZVBhZ2UoKSB7XG4gICAgZ2VuZXJhdGVTZWFyY2hCYXIoKTtcbiAgICBVSS5pbml0U2VhcmNoTGlzdGVuZXIoKTtcblxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlU2VhcmNoQmFyKCkge1xuICAgICAgY29uc3Qgc2VhcmNoQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlYXJjaC1jb250YWluZXInKTtcbiAgICAgIGNvbnN0IHNlYXJjaEJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICBjb25zdCBlcnJvckluZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICBzZWFyY2hCYXIuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICAgIHNlYXJjaEJhci5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2xvY2F0aW9uLWlucHV0Jyk7XG4gICAgICBzZWFyY2hCYXIuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsICdTZWFyY2ggZm9yIGEgbG9jYXRpb24nKTtcbiAgICAgIGVycm9ySW5mby5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2Vycm9yLWluZm8nKTtcbiAgICAgIHNlYXJjaENvbnRhaW5lci5hcHBlbmRDaGlsZChzZWFyY2hCYXIpO1xuICAgICAgc2VhcmNoQ29udGFpbmVyLmFwcGVuZENoaWxkKGVycm9ySW5mbyk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGluaXRTZWFyY2hMaXN0ZW5lcigpIHtcbiAgICBjb25zdCBzZWFyY2hCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9jYXRpb24taW5wdXQnKTtcbiAgICBzZWFyY2hCYXIuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZSkgPT4ge1xuICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB7XG4gICAgICAgIGNvbnN0IGxvY2F0aW9uSW5wdXQgPSBzZWFyY2hCYXIudmFsdWU7XG4gICAgICAgIFVJLnByb2Nlc3NVc2VySW5wdXQobG9jYXRpb25JbnB1dCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgcHJvY2Vzc1VzZXJJbnB1dChsb2NhdGlvbklucHV0KSB7XG4gICAgY29uc3QgZXJyb3JJbmZvID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Vycm9yLWluZm8nKTtcbiAgICBjb25zdCBzdHJpcHBlZExvY2F0aW9uSW5wdXQgPSBVSS5zdHJpcFJlcGxhY2VXaGl0ZVNwYWNlKGxvY2F0aW9uSW5wdXQpO1xuICAgIGxldCByZXF1ZXN0ZWRMb2NhdGlvbkRhdGE7XG5cbiAgICBlcnJvckluZm8udGV4dENvbnRlbnQgPSAnU2VhcmNoaW5nLi4uJztcbiAgICBcbiAgICBpZiAoVUkuZGV0ZXJtaW5lWmlwT3JDaXR5KGxvY2F0aW9uSW5wdXQpID09PSAnemlwQ291bnRyeUNvZGUnKSB7XG4gICAgICByZXF1ZXN0ZWRMb2NhdGlvbkRhdGEgPSBhd2FpdCB3ZWF0aGVyQVBJLmZldGNoTG9jYXRpb25EYXRhQnlaaXBQb3N0Q29kZShcbiAgICAgICAgc3RyaXBwZWRMb2NhdGlvbklucHV0XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXF1ZXN0ZWRMb2NhdGlvbkRhdGEgPSBhd2FpdCB3ZWF0aGVyQVBJLmZldGNoTG9jYXRpb25EYXRhQnlMb2NhdGlvbk5hbWUoXG4gICAgICAgIHN0cmlwcGVkTG9jYXRpb25JbnB1dFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAocmVxdWVzdGVkTG9jYXRpb25EYXRhWzBdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIFVJLmRpc3BsYXlFcnJvck1lc3NhZ2UoJ2xvY2F0aW9uTm90Rm91bmQnKTtcbiAgICAgIFVJLnJlc2V0U2VhcmNoQmFyKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbG9jYXRpb25PYmplY3QgPSBhd2FpdCByZXF1ZXN0ZWRMb2NhdGlvbkRhdGFbMF07XG4gICAgY29uc3QgaW5wdXRMYXQgPSBNYXRoLnJvdW5kKGxvY2F0aW9uT2JqZWN0LmxhdCAqIDEwMCkgLyAxMDA7XG4gICAgY29uc3QgaW5wdXRMb24gPSBNYXRoLnJvdW5kKGxvY2F0aW9uT2JqZWN0LmxvbiAqIDEwMCkgLyAxMDA7XG4gICAgY29uc3Qgd2VhdGhlckRhdGEgPSBhd2FpdCB3ZWF0aGVyQVBJLmZldGNoV2VhdGhlckRhdGEoaW5wdXRMYXQsIGlucHV0TG9uKTtcbiAgICBjb25zb2xlLmxvZyh3ZWF0aGVyRGF0YSk7XG4gICAgVUkucmVzZXRTZWFyY2hCYXIoKTtcbiAgICBlcnJvckluZm8uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgIFVJLmRpc3BsYXlXZWF0aGVyRGF0YSh3ZWF0aGVyRGF0YSk7XG4gIH1cblxuICBzdGF0aWMgZGV0ZXJtaW5lWmlwT3JDaXR5KGxvY2F0aW9uSW5wdXQpIHtcbiAgICBjb25zdCBjaXR5Q291bnRyeUNvZGVSZWdleCA9IC9eW2EtekEtWl0rKD86W1xccy1dW2EtekEtWl0rKSosXFxzW2EtekEtWl17Mn0kLztcbiAgICBjb25zdCBjaXR5U3RhdGVDb3VudHJ5Q29kZVJlZ2V4ID0gL15bYS16QS1aXSsoPzpbXFxzLV1bYS16QS1aXSspKixcXHNbYS16QS1aXXsyfSxcXHNbYS16QS1aXXsyfSQvO1xuICAgIGNvbnN0IHppcENvdW50cnlDb2RlUmVnZXggPSAvXlxcZHs1fSxcXHNbYS16QS1aXXsyfSQvO1xuXG4gICAgaWYgKHppcENvdW50cnlDb2RlUmVnZXgudGVzdChsb2NhdGlvbklucHV0KSkge1xuICAgICAgcmV0dXJuICd6aXBDb3VudHJ5Q29kZSc7XG4gICAgfSBlbHNlIGlmIChjaXR5U3RhdGVDb3VudHJ5Q29kZVJlZ2V4LnRlc3QobG9jYXRpb25JbnB1dCkpIHtcbiAgICAgIHJldHVybiAnY2l0eVN0YXRlQ291bnRyeUNvZGUnO1xuICAgIH0gZWxzZSBpZiAoY2l0eUNvdW50cnlDb2RlUmVnZXgudGVzdChsb2NhdGlvbklucHV0KSkge1xuICAgICAgcmV0dXJuICdjaXR5Q291bnRyeUNvZGUnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ2NpdHknO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBzdHJpcFJlcGxhY2VXaGl0ZVNwYWNlKGlucHV0KSB7XG4gICAgY29uc3QgcmV0dXJuU3RyaW5nID0gaW5wdXRcbiAgICAgIC5yZXBsYWNlKC9eXFxzKy8sICcnKVxuICAgICAgLnJlcGxhY2UoL1xccyskLywgJycpXG4gICAgICAucmVwbGFjZSgvXFxzKixcXHMqL2csICcsJylcbiAgICAgIC5yZXBsYWNlKC9cXHMrL2csICcrJyk7XG4gICAgcmV0dXJuIHJldHVyblN0cmluZztcbiAgfVxuXG4gIHN0YXRpYyBkaXNwbGF5V2VhdGhlckRhdGEod2VhdGhlckRhdGEpIHtcbiAgICBjb25zdCBtYWluID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKTtcbiAgfVxuXG4gIHN0YXRpYyByZXNldFNlYXJjaEJhcigpIHtcbiAgICBjb25zdCBzZWFyY2hCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9jYXRpb24taW5wdXQnKTtcbiAgICBzZWFyY2hCYXIudmFsdWUgPSAnJztcbiAgfVxuXG4gIHN0YXRpYyBkaXNwbGF5RXJyb3JNZXNzYWdlKGVycm9yVHlwZSkge1xuICAgIGNvbnN0IGVycm9ySW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlcnJvci1pbmZvJyk7XG4gICAgZXJyb3JJbmZvLnN0eWxlLnZpc2liaWxpdHkgPSAndmlzaWJsZSc7XG4gICAgaWYgKGVycm9yVHlwZSA9PT0gJ2xvY2F0aW9uTm90Rm91bmQnKSB7XG4gICAgICBlcnJvckluZm8udGV4dENvbnRlbnQgPSAnTG9jYXRpb24gbm90IGZvdW5kLiBUcnkgYWdhaW4uJztcbiAgICB9XG4gIH1cbiAgXG59XG5cbmV4cG9ydCB7IFVJIH07XG4iLCJjb25zdCBsb2NhdGlvbkRhdGEgPSAobmFtZSwgbGF0LCBsb24sIGNvdW50cnkpID0+IHtcbiAgcmV0dXJuIHsgbmFtZSwgbGF0LCBsb24sIGNvdW50cnkgfTtcbn1cblxuZXhwb3J0IHsgbG9jYXRpb25EYXRhIH07IiwiY2xhc3Mgd2VhdGhlckFQSSB7XG4gIHN0YXRpYyBhc3luYyBmZXRjaExvY2F0aW9uRGF0YUJ5TG9jYXRpb25OYW1lKGxvY2F0aW9uSW5wdXQpIHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgaW5wdXRTdHJpbmcgPSBgaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZ2VvLzEuMC9kaXJlY3Q/cT0ke2xvY2F0aW9uSW5wdXR9JmxpbWl0PTEmYXBwaWQ9NDIzNTgzMGY2Y2NhZmUyMTVkOWZhMDRjZDE0NGFjMGZgO1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChpbnB1dFN0cmluZywgeyBtb2RlOiAnY29ycycgfSk7XG4gICAgICBjb25zdCBsb2NhdGlvbkRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICByZXR1cm4gbG9jYXRpb25EYXRhO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGFzeW5jIGZldGNoTG9jYXRpb25EYXRhQnlaaXBQb3N0Q29kZSh6aXBDb2RlQW5kQ291bnRyeUNvZGUpIHtcbiAgICBjb25zdCBpbnB1dFN0cmluZyA9IGBodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9nZW8vMS4wL3ppcD96aXA9JHt6aXBDb2RlQW5kQ291bnRyeUNvZGV9JmFwcGlkPTQyMzU4MzBmNmNjYWZlMjE1ZDlmYTA0Y2QxNDRhYzBmYDtcblxuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGlucHV0U3RyaW5nLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgICAgIGNvbnN0IGxvY2F0aW9uRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIHJldHVybiBsb2NhdGlvbkRhdGE7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZmV0Y2hXZWF0aGVyRGF0YShsYXQsIGxvbikge1xuICAgIGNvbnN0IGlucHV0U3RyaW5nID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD0ke2xhdH0mbG9uPSR7bG9ufSZhcHBpZD00MjM1ODMwZjZjY2FmZTIxNWQ5ZmEwNGNkMTQ0YWMwZmA7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChpbnB1dFN0cmluZywgeyBtb2RlOiAnY29ycycgfSk7XG4gICAgICBjb25zdCB3ZWF0aGVyRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIHJldHVybiB3ZWF0aGVyRGF0YTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVMb2NhdGlvbk9iamVjdChsb2NhdGlvbkRhdGFBcnJheSkge1xuICAgIGNvbnN0IGxvY2F0aW9uT2JqZWN0ID0gbG9jYXRpb25EYXRhQXJyYXlbMF07XG4gICAgcmV0dXJuIGxvY2F0aW9uT2JqZWN0O1xuICB9XG59XG5cbmV4cG9ydCB7IHdlYXRoZXJBUEkgfTtcbiIsImNvbnN0IHdlYXRoZXJEYXRhID0gKFxuICB3ZWF0aGVyRGVzY3JpcHRpb24sXG4gIHRlbXBlcmF0dXJlLFxuICBmZWVsc0xpa2UsXG4gIGh1bWlkaXR5LFxuICBwcmVjaXBhdGlvbkxhc3RIb3VyID0gbnVsbCxcbiAgd2luZFNwZWVkXG4pID0+IHtcbiAgcmV0dXJuIHtcbiAgICB3ZWF0aGVyRGVzY3JpcHRpb24sXG4gICAgdGVtcGVyYXR1cmUsXG4gICAgZmVlbHNMaWtlLFxuICAgIGh1bWlkaXR5LFxuICAgIHByZWNpcGF0aW9uTGFzdEhvdXIsXG4gICAgd2luZFNwZWVkLFxuICB9O1xufTtcblxuZXhwb3J0IHsgd2VhdGhlckRhdGEgfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IFVJIH0gZnJvbSAnLi9VSSc7XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBVSS5zZXRIb21lUGFnZSk7XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=