(()=>{"use strict";class t{static async fetchLocationDataByLocationName(t){try{const e=`https://api.openweathermap.org/geo/1.0/direct?q=${t}&limit=1&appid=4235830f6ccafe215d9fa04cd144ac0f`,a=await fetch(e,{mode:"cors"});return await a.json()}catch(t){console.log(t)}}static async fetchLocationDataByZipPostCode(t){const e=`https://api.openweathermap.org/geo/1.0/zip?zip=${t}&appid=4235830f6ccafe215d9fa04cd144ac0f`;try{const t=await fetch(e,{mode:"cors"});return await t.json()}catch(t){console.log(t)}}static async fetchWeatherData(t,e){const a=`https://api.openweathermap.org/data/2.5/weather?lat=${t}&lon=${e}&appid=4235830f6ccafe215d9fa04cd144ac0f`;try{const t=await fetch(a,{mode:"cors"});return await t.json()}catch(t){console.log(t)}}static createLocationObject(t){return t[0]}}class e{static setHomePage(){!function(){const t=document.getElementById("search-container"),e=document.createElement("input"),a=document.createElement("p");e.setAttribute("type","text"),e.setAttribute("id","location-input"),e.setAttribute("placeholder","Search for a location"),a.setAttribute("id","error-info"),t.appendChild(e),t.appendChild(a)}(),e.initSearchListener()}static initSearchListener(){const t=document.getElementById("location-input");t.addEventListener("keyup",(a=>{if("Enter"===a.key){const a=t.value;e.processUserInput(a)}}))}static async processUserInput(a){const o=document.getElementById("error-info"),n=e.stripReplaceWhiteSpace(a);let c;if(o.textContent="Searching...",c="zipCountryCode"===e.determineZipOrCity(a)?await t.fetchLocationDataByZipPostCode(n):await t.fetchLocationDataByLocationName(n),void 0===c[0])return e.displayErrorMessage("locationNotFound"),void e.resetSearchBar();const i=await c[0],r=Math.round(100*i.lat)/100,s=Math.round(100*i.lon)/100,d=await t.fetchWeatherData(r,s);e.resetSearchBar(),o.style.visibility="hidden",console.log("going to trigger displayWeatherData"),e.displayWeatherData(d,i)}static determineZipOrCity(t){return/^\d{5},\s[a-zA-Z]{2}$/.test(t)?"zipCountryCode":/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*,\s[a-zA-Z]{2},\s[a-zA-Z]{2}$/.test(t)?"cityStateCountryCode":/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*,\s[a-zA-Z]{2}$/.test(t)?"cityCountryCode":"city"}static stripReplaceWhiteSpace(t){return t.replace(/^\s+/,"").replace(/\s+$/,"").replace(/\s*,\s*/g,",").replace(/\s+/g,"+")}static displayWeatherData(t,e){const a=document.getElementById("results-container");!function(t,e){const a=document.querySelector(".results-header"),o=document.querySelector(".weather-description");e.state?a.textContent=`${e.name}, ${e.state}, ${e.country}`:a.textContent=`${e.name}, ${e.country}`,o.textContent=t.weather[0].description.replace(/\w\S*/g,(t=>t.charAt(0).toUpperCase()+t.substr(1).toLowerCase()))}(t,e),function(t){const e=document.querySelector(".temperature-main"),a=document.querySelector(".temperature-feels-like"),o=Math.round(t.main.temp-273.15),n=Math.round(t.main.feels_like-273.15);e.textContent=`${o}°C`,a.textContent=`Feels like ${n}°C`}(t),function(t){document.querySelector(".humidity-value").textContent=`${t.main.humidity}%`}(t),function(t){const e=document.querySelector(".wind-value"),a=Math.round(3.6*t.wind.speed);e.textContent=`${a} km/h`}(t),function(t){document.querySelector(".cloudiness-value").textContent=`${t.clouds.all}%`}(t),a.style.display="flex"}static resetSearchBar(){document.getElementById("location-input").value=""}static displayErrorMessage(t){const e=document.getElementById("error-info");e.style.visibility="visible","locationNotFound"===t&&(e.textContent="Location not found. Try again.")}}document.addEventListener("DOMContentLoaded",e.setHomePage)})();