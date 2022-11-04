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
      requestedLocationData = await _weatherAPI__WEBPACK_IMPORTED_MODULE_0__.weatherAPI.fetchLocationDataByZipPostCode(
        strippedLocationInput
      );
    } else {
      requestedLocationData = await _weatherAPI__WEBPACK_IMPORTED_MODULE_0__.weatherAPI.fetchLocationDataByLocationName(
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
    const weatherData = await _weatherAPI__WEBPACK_IMPORTED_MODULE_0__.weatherAPI.fetchWeatherData(inputLat, inputLon);
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
    const inputString = `http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=4235830f6ccafe215d9fa04cd144ac0f`;
    const response = await fetch(inputString, { mode: 'cors' });
    const locationData = await response.json();
    return locationData;
  }

  static async fetchLocationDataByZipPostCode(zipCodeAndCountryCode) {
    const inputString = `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCodeAndCountryCode}&appid=4235830f6ccafe215d9fa04cd144ac0f`;
    const response = await fetch(inputString, { mode: 'cors' });
    const locationData = await response.json();
    return locationData;
  }

  static async fetchWeatherData(lat, lon) {
    const inputString = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4235830f6ccafe215d9fa04cd144ac0f`;
    const response = await fetch(inputString, { mode: 'cors' });
    const weatherData = await response.json();
    return weatherData;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUEwQztBQUNJO0FBQ0Y7O0FBRTVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9DQUFvQyxrRkFBeUM7QUFDN0U7QUFDQTtBQUNBLE1BQU07QUFDTixvQ0FBb0MsbUZBQTBDO0FBQzlFO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhCQUE4QixvRUFBMkI7QUFDekQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkVBQTJFLEVBQUU7QUFDN0UsZ0ZBQWdGLEVBQUUsWUFBWSxFQUFFO0FBQ2hHLHFDQUFxQyxFQUFFLFlBQVksRUFBRTs7QUFFckQ7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWM7Ozs7Ozs7Ozs7Ozs7OztBQ3RKZDtBQUNBLFdBQVc7QUFDWDs7Ozs7Ozs7Ozs7Ozs7OztBQ0ZBO0FBQ0E7QUFDQSwwRUFBMEUsY0FBYztBQUN4RixnREFBZ0QsY0FBYztBQUM5RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5RUFBeUUsc0JBQXNCO0FBQy9GLGdEQUFnRCxjQUFjO0FBQzlEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLCtFQUErRSxJQUFJLE9BQU8sSUFBSTtBQUM5RixnREFBZ0QsY0FBYztBQUM5RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFc0I7Ozs7Ozs7Ozs7Ozs7OztBQzVCdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7VUNoQkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7OztBQ04wQjs7QUFFMUIsOENBQThDLCtDQUFjIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvVUkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvbG9jYXRpb25EYXRhLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3dlYXRoZXJBUEkuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvd2VhdGhlckRhdGEuanMiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB3ZWF0aGVyQVBJIH0gZnJvbSAnLi93ZWF0aGVyQVBJJztcbmltcG9ydCB7IGxvY2F0aW9uRGF0YSB9IGZyb20gJy4vbG9jYXRpb25EYXRhJztcbmltcG9ydCB7IHdlYXRoZXJEYXRhIH0gZnJvbSAnLi93ZWF0aGVyRGF0YSc7XG5cbmNsYXNzIFVJIHtcbiAgc3RhdGljIHNldEhvbWVQYWdlKCkge1xuICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpO1xuICAgIGNvbnN0IHNlYXJjaEJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgc2VhcmNoQmFyLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgc2VhcmNoQmFyLnNldEF0dHJpYnV0ZSgnaWQnLCAnbG9jYXRpb24taW5wdXQnKTtcbiAgICBzZWFyY2hCYXIuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsICdTZWFyY2ggZm9yIGEgbG9jYXRpb24nKTtcbiAgICBtYWluLmFwcGVuZENoaWxkKHNlYXJjaEJhcik7XG4gICAgVUkuaW5pdFNlYXJjaExpc3RlbmVyKCk7XG4gIH1cblxuICBzdGF0aWMgaW5pdFNlYXJjaExpc3RlbmVyKCkge1xuICAgIGNvbnN0IHNlYXJjaEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2NhdGlvbi1pbnB1dCcpO1xuICAgIHNlYXJjaEJhci5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgY29uc3QgbG9jYXRpb25JbnB1dCA9IHNlYXJjaEJhci52YWx1ZTtcbiAgICAgICAgVUkucHJvY2Vzc1VzZXJJbnB1dChsb2NhdGlvbklucHV0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBwcm9jZXNzVXNlcklucHV0KGxvY2F0aW9uSW5wdXQpIHtcbiAgICBjb25zdCBzdHJpcHBlZExvY2F0aW9uSW5wdXQgPSBVSS5zdHJpcFJlcGxhY2VXaGl0ZVNwYWNlKGxvY2F0aW9uSW5wdXQpO1xuXG4gICAgbGV0IHJlcXVlc3RlZExvY2F0aW9uRGF0YTtcbiAgICBpZiAoVUkuZGV0ZXJtaW5lWmlwT3JDaXR5KGxvY2F0aW9uSW5wdXQpID09PSAnemlwQ291bnRyeUNvZGUnKSB7XG4gICAgICByZXF1ZXN0ZWRMb2NhdGlvbkRhdGEgPSBhd2FpdCB3ZWF0aGVyQVBJLmZldGNoTG9jYXRpb25EYXRhQnlaaXBQb3N0Q29kZShcbiAgICAgICAgc3RyaXBwZWRMb2NhdGlvbklucHV0XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXF1ZXN0ZWRMb2NhdGlvbkRhdGEgPSBhd2FpdCB3ZWF0aGVyQVBJLmZldGNoTG9jYXRpb25EYXRhQnlMb2NhdGlvbk5hbWUoXG4gICAgICAgIHN0cmlwcGVkTG9jYXRpb25JbnB1dFxuICAgICAgKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2cocmVxdWVzdGVkTG9jYXRpb25EYXRhKTtcblxuICAgIGlmIChyZXF1ZXN0ZWRMb2NhdGlvbkRhdGEgPT09IFtdKSB7XG4gICAgICBVSS5kaXNwbGF5RXJyb3IoKTtcbiAgICAgIFVJLnJlc2V0U2VhcmNoQmFyKCk7XG4gICAgfVxuXG4gICAgY29uc3QgbG9jYXRpb25PYmplY3QgPSBhd2FpdCByZXF1ZXN0ZWRMb2NhdGlvbkRhdGFbMF07XG4gICAgY29uc3QgaW5wdXRMYXQgPSBNYXRoLnJvdW5kKGxvY2F0aW9uT2JqZWN0LmxhdCAqIDEwMCkgLyAxMDA7XG4gICAgY29uc3QgaW5wdXRMb24gPSBNYXRoLnJvdW5kKGxvY2F0aW9uT2JqZWN0LmxvbiAqIDEwMCkgLyAxMDA7XG4gICAgY29uc3Qgd2VhdGhlckRhdGEgPSBhd2FpdCB3ZWF0aGVyQVBJLmZldGNoV2VhdGhlckRhdGEoaW5wdXRMYXQsIGlucHV0TG9uKTtcbiAgICBjb25zb2xlLmxvZyh3ZWF0aGVyRGF0YSk7XG4gICAgVUkuZGlzcGxheVdlYXRoZXJEYXRhKHdlYXRoZXJEYXRhKTtcbiAgfVxuXG4gIHN0YXRpYyBkZXRlcm1pbmVaaXBPckNpdHkobG9jYXRpb25JbnB1dCkge1xuICAgIGNvbnN0IGNpdHlDb3VudHJ5Q29kZVJlZ2V4ID0gL15bYS16QS1aXSsoPzpbXFxzLV1bYS16QS1aXSspKixcXHNbYS16QS1aXXsyfSQvO1xuICAgIGNvbnN0IGNpdHlTdGF0ZUNvdW50cnlDb2RlUmVnZXggPSAvXlthLXpBLVpdKyg/OltcXHMtXVthLXpBLVpdKykqLFxcc1thLXpBLVpdezJ9LFxcc1thLXpBLVpdezJ9JC87XG4gICAgY29uc3QgemlwQ291bnRyeUNvZGVSZWdleCA9IC9eXFxkezV9LFxcc1thLXpBLVpdezJ9JC87XG5cbiAgICBpZiAoemlwQ291bnRyeUNvZGVSZWdleC50ZXN0KGxvY2F0aW9uSW5wdXQpKSB7XG4gICAgICByZXR1cm4gJ3ppcENvdW50cnlDb2RlJztcbiAgICB9IGVsc2UgaWYgKGNpdHlTdGF0ZUNvdW50cnlDb2RlUmVnZXgudGVzdChsb2NhdGlvbklucHV0KSkge1xuICAgICAgcmV0dXJuICdjaXR5U3RhdGVDb3VudHJ5Q29kZSc7XG4gICAgfSBlbHNlIGlmIChjaXR5Q291bnRyeUNvZGVSZWdleC50ZXN0KGxvY2F0aW9uSW5wdXQpKSB7XG4gICAgICByZXR1cm4gJ2NpdHlDb3VudHJ5Q29kZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnY2l0eSc7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHN0cmlwUmVwbGFjZVdoaXRlU3BhY2UoaW5wdXQpIHtcbiAgICBjb25zdCByZXR1cm5TdHJpbmcgPSBpbnB1dFxuICAgICAgLnJlcGxhY2UoL15cXHMrLywgJycpXG4gICAgICAucmVwbGFjZSgvXFxzKyQvLCAnJylcbiAgICAgIC5yZXBsYWNlKC9cXHMqLFxccyovZywgJywnKVxuICAgICAgLnJlcGxhY2UoL1xccysvZywgJysnKTtcbiAgICByZXR1cm4gcmV0dXJuU3RyaW5nO1xuICB9XG5cbiAgc3RhdGljIGRpc3BsYXlXZWF0aGVyRGF0YSh3ZWF0aGVyRGF0YSkge1xuICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpO1xuICB9XG5cbiAgLy8gTW9kYWwgRm9ybWF0dGluZ1xuXG4gIHN0YXRpYyBkaXNwbGF5RXJyb3IoZXJyb3IpIHtcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteU1vZGFsJyk7XG4gICAgY29uc3QgbW9kYWxDb250ZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29uc3QgbW9kYWxDbG9zZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBjb25zdCBtb2RhbFRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDMnKTtcbiAgICBjb25zdCBtb2RhbFN1YlRpdGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDQnKTtcbiAgICBjb25zdCBtb2RhbFRleHRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIG1vZGFsQ29udGVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ21vZGFsLWNvbnRlbnQnKTtcbiAgICBtb2RhbENsb3NlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnY2xvc2UnKTtcbiAgICBtb2RhbFRpdGxlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbW9kYWwtdGl0bGUnKTtcbiAgICBtb2RhbFN1YlRpdGxlLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbW9kYWwtc3VidGl0bGUnKTtcbiAgICBtb2RhbFRleHRDb250YWluZXIuc2V0QXR0cmlidXRlKCdjbGFzcycsICdtb2RhbC10ZXh0LWNvbnRhaW5lcicpO1xuXG4gICAgbW9kYWxDb250ZW50LmFwcGVuZENoaWxkKG1vZGFsQ2xvc2UpO1xuICAgIG1vZGFsQ29udGVudC5hcHBlbmRDaGlsZChtb2RhbFRpdGxlKTtcbiAgICBtb2RhbENvbnRlbnQuYXBwZW5kQ2hpbGQobW9kYWxTdWJUaXRsZSk7XG4gICAgbW9kYWxDb250ZW50LmFwcGVuZENoaWxkKG1vZGFsVGV4dENvbnRhaW5lcik7XG4gICAgbW9kYWwuYXBwZW5kQ2hpbGQobW9kYWxDb250ZW50KTtcbiAgICBcbiAgICBpZiAoKGVycm9yID0gJ25vIGRhdGEnKSkge1xuICAgICAgbW9kYWxDbG9zZS50ZXh0Q29udGVudCA9ICcmdGltZXM7JztcbiAgICAgIG1vZGFsVGl0bGUudGV4dENvbnRlbnQgPSAnRXJyb3InO1xuICAgICAgbW9kYWxTdWJUaXRsZS50ZXh0Q29udGVudCA9ICdMb2NhdGlvbiBOb3QgRm91bmQnO1xuICAgICAgY29uc3QgcGFyYTEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICBwYXJhMS50ZXh0Q29udGVudCA9ICdQbGVhc2UgdHJ5IGFnYWluLic7XG4gICAgICBtb2RhbFRleHRDb250YWluZXIuYXBwZW5kQ2hpbGQocGFyYTEpO1xuICAgIH1cblxuICAgIFVJLmluaXRNb2RhbENsb3NlTGlzdGVuZXIoKTtcbiAgfVxuXG4gIHN0YXRpYyByZXNldFNlYXJjaEJhcigpIHtcbiAgICBjb25zdCBzZWFyY2hCYXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9jYXRpb24taW5wdXQnKTtcbiAgICBzZWFyY2hCYXIudmFsdWUgPSAnJztcbiAgfVxuXG4gIHN0YXRpYyBpbml0TW9kYWxDbG9zZUxpc3RlbmVyKCkge1xuICAgIGNvbnN0IG1vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215TW9kYWwnKTtcbiAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY2xvc2UnKVswXTtcbiAgICBzcGFuLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBtb2RhbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgVUkucmVzZXRNb2RhbENvbnRlbnQoKTtcbiAgICB9O1xuICAgIHdpbmRvdy5vbmNsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQudGFyZ2V0ID09IG1vZGFsKSB7XG4gICAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIFVJLnJlc2V0TW9kYWxDb250ZW50KCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB7XG4gICAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIFVJLnJlc2V0TW9kYWxDb250ZW50KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzdGF0aWMgcmVzZXRNb2RhbENvbnRlbnQoKSB7XG4gICAgY29uc3QgbW9kYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlNb2RhbCcpO1xuICAgIHdoaWxlIChtb2RhbC5maXJzdENoaWxkKSB7XG4gICAgICBtb2RhbC5yZW1vdmVDaGlsZChtb2RhbC5maXJzdENoaWxkKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IHsgVUkgfTtcbiIsImNvbnN0IGxvY2F0aW9uRGF0YSA9IChuYW1lLCBsYXQsIGxvbiwgY291bnRyeSkgPT4ge1xuICByZXR1cm4geyBuYW1lLCBsYXQsIGxvbiwgY291bnRyeSB9O1xufVxuXG5leHBvcnQgeyBsb2NhdGlvbkRhdGEgfTsiLCJjbGFzcyB3ZWF0aGVyQVBJIHtcbiAgc3RhdGljIGFzeW5jIGZldGNoTG9jYXRpb25EYXRhQnlMb2NhdGlvbk5hbWUobG9jYXRpb25JbnB1dCkge1xuICAgIGNvbnN0IGlucHV0U3RyaW5nID0gYGh0dHA6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2dlby8xLjAvZGlyZWN0P3E9JHtsb2NhdGlvbklucHV0fSZsaW1pdD0xJmFwcGlkPTQyMzU4MzBmNmNjYWZlMjE1ZDlmYTA0Y2QxNDRhYzBmYDtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGlucHV0U3RyaW5nLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgICBjb25zdCBsb2NhdGlvbkRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIGxvY2F0aW9uRGF0YTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBmZXRjaExvY2F0aW9uRGF0YUJ5WmlwUG9zdENvZGUoemlwQ29kZUFuZENvdW50cnlDb2RlKSB7XG4gICAgY29uc3QgaW5wdXRTdHJpbmcgPSBgaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZ2VvLzEuMC96aXA/emlwPSR7emlwQ29kZUFuZENvdW50cnlDb2RlfSZhcHBpZD00MjM1ODMwZjZjY2FmZTIxNWQ5ZmEwNGNkMTQ0YWMwZmA7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChpbnB1dFN0cmluZywgeyBtb2RlOiAnY29ycycgfSk7XG4gICAgY29uc3QgbG9jYXRpb25EYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIHJldHVybiBsb2NhdGlvbkRhdGE7XG4gIH1cblxuICBzdGF0aWMgYXN5bmMgZmV0Y2hXZWF0aGVyRGF0YShsYXQsIGxvbikge1xuICAgIGNvbnN0IGlucHV0U3RyaW5nID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD0ke2xhdH0mbG9uPSR7bG9ufSZhcHBpZD00MjM1ODMwZjZjY2FmZTIxNWQ5ZmEwNGNkMTQ0YWMwZmA7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChpbnB1dFN0cmluZywgeyBtb2RlOiAnY29ycycgfSk7XG4gICAgY29uc3Qgd2VhdGhlckRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIHdlYXRoZXJEYXRhO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZUxvY2F0aW9uT2JqZWN0KGxvY2F0aW9uRGF0YUFycmF5KSB7XG4gICAgY29uc3QgbG9jYXRpb25PYmplY3QgPSBsb2NhdGlvbkRhdGFBcnJheVswXTtcbiAgICByZXR1cm4gbG9jYXRpb25PYmplY3Q7XG4gIH1cbn1cblxuZXhwb3J0IHsgd2VhdGhlckFQSSB9O1xuIiwiY29uc3Qgd2VhdGhlckRhdGEgPSAoXG4gIHdlYXRoZXJEZXNjcmlwdGlvbixcbiAgdGVtcGVyYXR1cmUsXG4gIGZlZWxzTGlrZSxcbiAgaHVtaWRpdHksXG4gIHByZWNpcGF0aW9uTGFzdEhvdXIgPSBudWxsLFxuICB3aW5kU3BlZWRcbikgPT4ge1xuICByZXR1cm4ge1xuICAgIHdlYXRoZXJEZXNjcmlwdGlvbixcbiAgICB0ZW1wZXJhdHVyZSxcbiAgICBmZWVsc0xpa2UsXG4gICAgaHVtaWRpdHksXG4gICAgcHJlY2lwYXRpb25MYXN0SG91cixcbiAgICB3aW5kU3BlZWQsXG4gIH07XG59O1xuXG5leHBvcnQgeyB3ZWF0aGVyRGF0YSB9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgVUkgfSBmcm9tICcuL1VJJztcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIFVJLnNldEhvbWVQYWdlKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==