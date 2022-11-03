import { weatherData } from './weatherData';
import { locationData } from './locationData';

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

export { weatherAPI };
