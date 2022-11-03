class dataController {
  static async getLocationDataByLocationName(locationInput) {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${locationInput}&limit=1&appid=4235830f6ccafe215d9fa04cd144ac0f`
    );
    const locationData = await response.json();
    return locationData;
  }

  static async getLocationDataByZipPostCode(zipCodeAndCountryCode) {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/zip?zip=${zipCodeAndCountryCode}&appid=4235830f6ccafe215d9fa04cd144ac0f`
    );
    const locationData = await response.json();
    return locationData;
  }

  static async getWeatherData(lat, lon) {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=4235830f6ccafe215d9fa04cd144ac0f`
    );
    const weatherData = await response.json();
    return weatherData;
  }
}
