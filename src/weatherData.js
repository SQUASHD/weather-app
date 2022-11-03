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

export { weatherData };