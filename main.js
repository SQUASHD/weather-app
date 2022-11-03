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
  constructor() {
    this.locationdata = [];
    this.weatherdata = [];
  }

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
        UI.validateLocationInput(locationInput);
        UI.processUserInput(locationInput);
      }
    });
  }

  static async processUserInput(locationInput) {
    const strippedLocationInput = UI.stripWhiteSpace(locationInput);
    console.log(strippedLocationInput);
    let requestedLocationData;
    if (UI.determineZipOrCity(locationInput) === 'zipCountryCode') {
      requestedLocationData = await _weatherAPI__WEBPACK_IMPORTED_MODULE_0__.weatherAPI.fetchLocationDataByZipPostCode(strippedLocationInput);
      console.log('zipCountryCode');
    } else {
      requestedLocationData = await _weatherAPI__WEBPACK_IMPORTED_MODULE_0__.weatherAPI.fetchLocationDataByLocationName(strippedLocationInput);;
    }
    const locationObject = requestedLocationData[0]
    console.log(locationObject);
    console.log(locationObject.lat)
    console.log(locationObject.lon)
    // const weatherData = await weatherAPI.fetchWeatherData(locationObject.lat, locationObject.lon);
    // console.log(weatherData);
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
      UI.callWrongInputModal();
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
    const strippedInput = input.replace(/\s/g, '');
    return strippedInput;
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
    };
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };
    modal.innerHTML = '';
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
/* harmony import */ var _weatherData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./weatherData */ "./src/weatherData.js");
/* harmony import */ var _locationData__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./locationData */ "./src/locationData.js");



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
console.log(_UI__WEBPACK_IMPORTED_MODULE_0__.UI.stripWhiteSpace('London, UK'));
console.log(_UI__WEBPACK_IMPORTED_MODULE_0__.UI.stripWhiteSpace('New York City, US'));
console.log(_UI__WEBPACK_IMPORTED_MODULE_0__.UI.stripWhiteSpace('New York City, NY, US'));
console.log(_UI__WEBPACK_IMPORTED_MODULE_0__.UI.stripWhiteSpace('10001, US'));
console.log(_UI__WEBPACK_IMPORTED_MODULE_0__.UI.stripWhiteSpace('10001, US '));
console.log(_UI__WEBPACK_IMPORTED_MODULE_0__.UI.stripWhiteSpace('New York, NY, US'));
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUEwQztBQUNJO0FBQ0Y7O0FBRTVDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0Msa0ZBQXlDO0FBQzdFO0FBQ0EsTUFBTTtBQUNOLG9DQUFvQyxtRkFBMEM7QUFDOUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMkVBQTJFLEVBQUU7QUFDN0UsZ0ZBQWdGLEVBQUUsWUFBWSxFQUFFO0FBQ2hHLHFDQUFxQyxFQUFFLFlBQVksRUFBRTs7QUFFckQ7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJFQUEyRSxFQUFFO0FBQzdFLGdGQUFnRixFQUFFLFlBQVksRUFBRTtBQUNoRyxxQ0FBcUMsRUFBRSxZQUFZLEVBQUU7O0FBRXJEO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVjOzs7Ozs7Ozs7Ozs7Ozs7QUN0SGQ7QUFDQSxXQUFXO0FBQ1g7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0Y0QztBQUNFOztBQUU5QztBQUNBO0FBQ0EsMEVBQTBFLGNBQWM7QUFDeEYsZ0RBQWdELGNBQWM7QUFDOUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUVBQXlFLHNCQUFzQjtBQUMvRixnREFBZ0QsY0FBYztBQUM5RDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwrRUFBK0UsSUFBSSxPQUFPLElBQUk7QUFDOUYsZ0RBQWdELGNBQWM7QUFDOUQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRXNCOzs7Ozs7Ozs7Ozs7Ozs7QUMvQnRCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O1VDaEJBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7QUNOMEI7O0FBRTFCLDhDQUE4QywrQ0FBYztBQUM1RCxZQUFZLG1EQUFrQjtBQUM5QixZQUFZLG1EQUFrQjtBQUM5QixZQUFZLG1EQUFrQjtBQUM5QixZQUFZLG1EQUFrQjtBQUM5QixZQUFZLG1EQUFrQjtBQUM5QixZQUFZLG1EQUFrQixzQiIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL1VJLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL2xvY2F0aW9uRGF0YS5qcyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC8uL3NyYy93ZWF0aGVyQVBJLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwLy4vc3JjL3dlYXRoZXJEYXRhLmpzIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly93ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3dlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgd2VhdGhlckFQSSB9IGZyb20gJy4vd2VhdGhlckFQSSc7XG5pbXBvcnQgeyBsb2NhdGlvbkRhdGEgfSBmcm9tICcuL2xvY2F0aW9uRGF0YSc7XG5pbXBvcnQgeyB3ZWF0aGVyRGF0YSB9IGZyb20gJy4vd2VhdGhlckRhdGEnO1xuXG5jbGFzcyBVSSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMubG9jYXRpb25kYXRhID0gW107XG4gICAgdGhpcy53ZWF0aGVyZGF0YSA9IFtdO1xuICB9XG5cbiAgc3RhdGljIHNldEhvbWVQYWdlKCkge1xuICAgIGNvbnN0IG1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpO1xuICAgIG1haW4uaW5uZXJIVE1MID0gYDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJsb2NhdGlvbi1pbnB1dFwiIGlkPVwibG9jYXRpb24taW5wdXRcIiAvPmA7XG4gICAgVUkuaW5pdFNlYXJjaExpc3RlbmVyKCk7XG4gIH1cblxuICBzdGF0aWMgaW5pdFNlYXJjaExpc3RlbmVyKCkge1xuICAgIGNvbnN0IHNlYXJjaEJhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2NhdGlvbi1pbnB1dCcpO1xuICAgIHNlYXJjaEJhci5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIChlKSA9PiB7XG4gICAgICBpZiAoZS5rZXkgPT09ICdFbnRlcicpIHtcbiAgICAgICAgY29uc3QgbG9jYXRpb25JbnB1dCA9IHNlYXJjaEJhci52YWx1ZTtcbiAgICAgICAgVUkudmFsaWRhdGVMb2NhdGlvbklucHV0KGxvY2F0aW9uSW5wdXQpO1xuICAgICAgICBVSS5wcm9jZXNzVXNlcklucHV0KGxvY2F0aW9uSW5wdXQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIHByb2Nlc3NVc2VySW5wdXQobG9jYXRpb25JbnB1dCkge1xuICAgIGNvbnN0IHN0cmlwcGVkTG9jYXRpb25JbnB1dCA9IFVJLnN0cmlwV2hpdGVTcGFjZShsb2NhdGlvbklucHV0KTtcbiAgICBjb25zb2xlLmxvZyhzdHJpcHBlZExvY2F0aW9uSW5wdXQpO1xuICAgIGxldCByZXF1ZXN0ZWRMb2NhdGlvbkRhdGE7XG4gICAgaWYgKFVJLmRldGVybWluZVppcE9yQ2l0eShsb2NhdGlvbklucHV0KSA9PT0gJ3ppcENvdW50cnlDb2RlJykge1xuICAgICAgcmVxdWVzdGVkTG9jYXRpb25EYXRhID0gYXdhaXQgd2VhdGhlckFQSS5mZXRjaExvY2F0aW9uRGF0YUJ5WmlwUG9zdENvZGUoc3RyaXBwZWRMb2NhdGlvbklucHV0KTtcbiAgICAgIGNvbnNvbGUubG9nKCd6aXBDb3VudHJ5Q29kZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXF1ZXN0ZWRMb2NhdGlvbkRhdGEgPSBhd2FpdCB3ZWF0aGVyQVBJLmZldGNoTG9jYXRpb25EYXRhQnlMb2NhdGlvbk5hbWUoc3RyaXBwZWRMb2NhdGlvbklucHV0KTs7XG4gICAgfVxuICAgIGNvbnN0IGxvY2F0aW9uT2JqZWN0ID0gcmVxdWVzdGVkTG9jYXRpb25EYXRhWzBdXG4gICAgY29uc29sZS5sb2cobG9jYXRpb25PYmplY3QpO1xuICAgIGNvbnNvbGUubG9nKGxvY2F0aW9uT2JqZWN0LmxhdClcbiAgICBjb25zb2xlLmxvZyhsb2NhdGlvbk9iamVjdC5sb24pXG4gICAgLy8gY29uc3Qgd2VhdGhlckRhdGEgPSBhd2FpdCB3ZWF0aGVyQVBJLmZldGNoV2VhdGhlckRhdGEobG9jYXRpb25PYmplY3QubGF0LCBsb2NhdGlvbk9iamVjdC5sb24pO1xuICAgIC8vIGNvbnNvbGUubG9nKHdlYXRoZXJEYXRhKTtcbiAgfVxuXG4gIHN0YXRpYyB2YWxpZGF0ZUxvY2F0aW9uSW5wdXQobG9jYXRpb25JbnB1dCkge1xuICAgIGNvbnN0IGNpdHlSZWdleCA9IC9eW2EtekEtWl0rKD86W1xccy1dW2EtekEtWl0rKSokLztcbiAgICBjb25zdCBjaXR5Q291bnRyeUNvZGVSZWdleCA9IC9eW2EtekEtWl0rKD86W1xccy1dW2EtekEtWl0rKSosXFxzW2EtekEtWl17Mn0kLztcbiAgICBjb25zdCBjaXR5U3RhdGVDb3VudHJ5Q29kZVJlZ2V4ID0gL15bYS16QS1aXSsoPzpbXFxzLV1bYS16QS1aXSspKixcXHNbYS16QS1aXXsyfSxcXHNbYS16QS1aXXsyfSQvO1xuICAgIGNvbnN0IHppcENvdW50cnlDb2RlUmVnZXggPSAvXlxcZHs1fSxcXHNbYS16QS1aXXsyfSQvO1xuXG4gICAgaWYgKGNpdHlSZWdleC50ZXN0KGxvY2F0aW9uSW5wdXQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGNpdHlDb3VudHJ5Q29kZVJlZ2V4LnRlc3QobG9jYXRpb25JbnB1dCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoY2l0eVN0YXRlQ291bnRyeUNvZGVSZWdleC50ZXN0KGxvY2F0aW9uSW5wdXQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHppcENvdW50cnlDb2RlUmVnZXgudGVzdChsb2NhdGlvbklucHV0KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIFVJLmNhbGxXcm9uZ0lucHV0TW9kYWwoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgZGV0ZXJtaW5lWmlwT3JDaXR5KGxvY2F0aW9uSW5wdXQpIHtcbiAgICBjb25zdCBjaXR5Q291bnRyeUNvZGVSZWdleCA9IC9eW2EtekEtWl0rKD86W1xccy1dW2EtekEtWl0rKSosXFxzW2EtekEtWl17Mn0kLztcbiAgICBjb25zdCBjaXR5U3RhdGVDb3VudHJ5Q29kZVJlZ2V4ID0gL15bYS16QS1aXSsoPzpbXFxzLV1bYS16QS1aXSspKixcXHNbYS16QS1aXXsyfSxcXHNbYS16QS1aXXsyfSQvO1xuICAgIGNvbnN0IHppcENvdW50cnlDb2RlUmVnZXggPSAvXlxcZHs1fSxcXHNbYS16QS1aXXsyfSQvO1xuXG4gICAgaWYgKGNpdHlDb3VudHJ5Q29kZVJlZ2V4LnRlc3QobG9jYXRpb25JbnB1dCkpIHtcbiAgICAgIHJldHVybiAnY2l0eUNvdW50cnlDb2RlJztcbiAgICB9IGVsc2UgaWYgKGNpdHlTdGF0ZUNvdW50cnlDb2RlUmVnZXgudGVzdChsb2NhdGlvbklucHV0KSkge1xuICAgICAgcmV0dXJuICdjaXR5U3RhdGVDb3VudHJ5Q29kZSc7XG4gICAgfSBlbHNlIGlmICh6aXBDb3VudHJ5Q29kZVJlZ2V4LnRlc3QobG9jYXRpb25JbnB1dCkpIHtcbiAgICAgIHJldHVybiAnemlwQ291bnRyeUNvZGUnO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJ2NpdHknO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBzdHJpcFdoaXRlU3BhY2UoaW5wdXQpIHtcbiAgICBjb25zdCBzdHJpcHBlZElucHV0ID0gaW5wdXQucmVwbGFjZSgvXFxzL2csICcnKTtcbiAgICByZXR1cm4gc3RyaXBwZWRJbnB1dDtcbiAgfVxuXG4gIC8vIE1vZGFsIEZvcm1hdHRpbmdcblxuICBzdGF0aWMgY2FsbFdyb25nSW5wdXRNb2RhbCgpIHtcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteU1vZGFsJyk7XG4gICAgbW9kYWwuaW5uZXJIVE1MID0gYFxuICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgIDxzcGFuIGNsYXNzPVwiY2xvc2VcIj4mdGltZXM7PC9zcGFuPlxuICAgICAgPGgzIGNsYXNzPVwibW9kYWwtdGl0bGVcIj5Pb3BzITwvaDM+XG4gICAgICA8aDQgY2xhc3M9XCJtb2RhbC10aXRsZVwiPkxvb2tzIGxpa2UgeW91IGRpZG4ndCB3cml0ZSBhIHZhbGlkIGlucHV0LjwvaDQ+XG4gICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtdGV4dC1jb250YWluZXJcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJtb2RhbC10ZXh0XCI+VHJ5IHNlYXJjaGluZyBmb3I6PC9wPlxuICAgICAgICA8cCBjbGFzcz1cIm1vZGFsLXRleHRcIj5DaXR5IE5hbWUsIDItTGV0dGVyIENvdW50cnkgQ29kZTwvcD5cbiAgICAgICAgPHAgY2xhc3M9XCJtb2RhbC10ZXh0XCI+ZWc6IEJpcm1pbmdoYW0sIFVLPC9wPmA7XG4gICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdmbGV4JztcbiAgICBVSS5pbml0TW9kYWxDbG9zZUxpc3RlbmVyKCk7XG4gIH1cblxuICBzdGF0aWMgaW5pdE1vZGFsQ2xvc2VMaXN0ZW5lcigpIHtcbiAgICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdteU1vZGFsJyk7XG4gICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Nsb3NlJylbMF07XG4gICAgc3Bhbi5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgbW9kYWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9O1xuICAgIHdpbmRvdy5vbmNsaWNrID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZiAoZXZlbnQudGFyZ2V0ID09IG1vZGFsKSB7XG4gICAgICAgIG1vZGFsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9XG4gICAgfTtcbiAgICBtb2RhbC5pbm5lckhUTUwgPSAnJztcbiAgfVxufVxuXG5leHBvcnQgeyBVSSB9O1xuIiwiY29uc3QgbG9jYXRpb25EYXRhID0gKG5hbWUsIGxhdCwgbG9uLCBjb3VudHJ5KSA9PiB7XG4gIHJldHVybiB7IG5hbWUsIGxhdCwgbG9uLCBjb3VudHJ5IH07XG59XG5cbmV4cG9ydCB7IGxvY2F0aW9uRGF0YSB9OyIsImltcG9ydCB7IHdlYXRoZXJEYXRhIH0gZnJvbSAnLi93ZWF0aGVyRGF0YSc7XG5pbXBvcnQgeyBsb2NhdGlvbkRhdGEgfSBmcm9tICcuL2xvY2F0aW9uRGF0YSc7XG5cbmNsYXNzIHdlYXRoZXJBUEkge1xuICBzdGF0aWMgYXN5bmMgZmV0Y2hMb2NhdGlvbkRhdGFCeUxvY2F0aW9uTmFtZShsb2NhdGlvbklucHV0KSB7XG4gICAgY29uc3QgaW5wdXRTdHJpbmcgPSBgaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZ2VvLzEuMC9kaXJlY3Q/cT0ke2xvY2F0aW9uSW5wdXR9JmxpbWl0PTEmYXBwaWQ9NDIzNTgzMGY2Y2NhZmUyMTVkOWZhMDRjZDE0NGFjMGZgO1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goaW5wdXRTdHJpbmcsIHsgbW9kZTogJ2NvcnMnIH0pO1xuICAgIGNvbnN0IGxvY2F0aW9uRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gbG9jYXRpb25EYXRhO1xuICB9XG5cbiAgc3RhdGljIGFzeW5jIGZldGNoTG9jYXRpb25EYXRhQnlaaXBQb3N0Q29kZSh6aXBDb2RlQW5kQ291bnRyeUNvZGUpIHtcbiAgICBjb25zdCBpbnB1dFN0cmluZyA9IGBodHRwOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9nZW8vMS4wL3ppcD96aXA9JHt6aXBDb2RlQW5kQ291bnRyeUNvZGV9JmFwcGlkPTQyMzU4MzBmNmNjYWZlMjE1ZDlmYTA0Y2QxNDRhYzBmYDtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGlucHV0U3RyaW5nLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgICBjb25zdCBsb2NhdGlvbkRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIGxvY2F0aW9uRGF0YTtcbiAgfVxuXG4gIHN0YXRpYyBhc3luYyBmZXRjaFdlYXRoZXJEYXRhKGxhdCwgbG9uKSB7XG4gICAgY29uc3QgaW5wdXRTdHJpbmcgPSBgaHR0cHM6Ly9hcGkub3BlbndlYXRoZXJtYXAub3JnL2RhdGEvMi41L3dlYXRoZXI/bGF0PSR7bGF0fSZsb249JHtsb259JmFwcGlkPTQyMzU4MzBmNmNjYWZlMjE1ZDlmYTA0Y2QxNDRhYzBmYDtcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGlucHV0U3RyaW5nLCB7IG1vZGU6ICdjb3JzJyB9KTtcbiAgICBjb25zdCB3ZWF0aGVyRGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gd2VhdGhlckRhdGE7XG4gIH1cblxuICBzdGF0aWMgY3JlYXRlTG9jYXRpb25PYmplY3QobG9jYXRpb25EYXRhQXJyYXkpIHtcbiAgICBjb25zdCBsb2NhdGlvbk9iamVjdCA9IGxvY2F0aW9uRGF0YUFycmF5WzBdO1xuICAgIHJldHVybiBsb2NhdGlvbk9iamVjdDtcbiAgfVxufVxuXG5leHBvcnQgeyB3ZWF0aGVyQVBJIH07XG4iLCJjb25zdCB3ZWF0aGVyRGF0YSA9IChcbiAgd2VhdGhlckRlc2NyaXB0aW9uLFxuICB0ZW1wZXJhdHVyZSxcbiAgZmVlbHNMaWtlLFxuICBodW1pZGl0eSxcbiAgcHJlY2lwYXRpb25MYXN0SG91ciA9IG51bGwsXG4gIHdpbmRTcGVlZFxuKSA9PiB7XG4gIHJldHVybiB7XG4gICAgd2VhdGhlckRlc2NyaXB0aW9uLFxuICAgIHRlbXBlcmF0dXJlLFxuICAgIGZlZWxzTGlrZSxcbiAgICBodW1pZGl0eSxcbiAgICBwcmVjaXBhdGlvbkxhc3RIb3VyLFxuICAgIHdpbmRTcGVlZCxcbiAgfTtcbn07XG5cbmV4cG9ydCB7IHdlYXRoZXJEYXRhIH07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBVSSB9IGZyb20gJy4vVUknO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgVUkuc2V0SG9tZVBhZ2UpO1xuY29uc29sZS5sb2coVUkuc3RyaXBXaGl0ZVNwYWNlKCdMb25kb24sIFVLJykpO1xuY29uc29sZS5sb2coVUkuc3RyaXBXaGl0ZVNwYWNlKCdOZXcgWW9yayBDaXR5LCBVUycpKTtcbmNvbnNvbGUubG9nKFVJLnN0cmlwV2hpdGVTcGFjZSgnTmV3IFlvcmsgQ2l0eSwgTlksIFVTJykpO1xuY29uc29sZS5sb2coVUkuc3RyaXBXaGl0ZVNwYWNlKCcxMDAwMSwgVVMnKSk7XG5jb25zb2xlLmxvZyhVSS5zdHJpcFdoaXRlU3BhY2UoJzEwMDAxLCBVUyAnKSk7XG5jb25zb2xlLmxvZyhVSS5zdHJpcFdoaXRlU3BhY2UoJ05ldyBZb3JrLCBOWSwgVVMnKSk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9