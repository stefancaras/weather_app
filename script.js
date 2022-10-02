import "./leaflet/leaflet.js";

const weatherURL = "https://api.openweathermap.org/data/2.5/weather?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=";
const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=";
let weatherData = {};
let forecastData = {};
let lat, long;
const input = document.querySelector(".input");

const getWeatherData = async () => {
  const result = await fetch(`${weatherURL}${input.value}`);
  if (result.status === 200) {
    weatherData = await result.json();
    showWeather();
  
    // Show map
    lat = weatherData.coord.lat;
    long = weatherData.coord.lon;
    showMap();
  } else {
    alert("City not found");
  }
}

const getForecastData = async () => {
  const result = await fetch(`${forecastURL}${input.value}`);
  if (result.status === 200) {
    forecastData = await result.json();
    showForecast();
  }
}

document.querySelector(".btn").addEventListener("click", () => {
  getWeatherData();
  getForecastData();
})

const showWeather = () => {
  document.querySelector(".weather").innerHTML = `
    <div class="flexWrapCenter">
      <div class="flexWrapCenter column padding">
        <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
        <div class="flexWrapCenter">
          <img src="http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" />
          <span class="largeFont">${weatherData.main.temp} &#8451</span>
        </div>
        <p>Feels like: ${weatherData.main.feels_like} &#8451</p>
        <p>Description: ${weatherData.weather[0].description}</p>
        <p>Humidity: ${weatherData.main.humidity} %</p>
        <p>Pressure: ${weatherData.main.pressure} hPa</p>
        <p>Wind speed: ${weatherData.wind.speed} m/s</p>
      </div>
      <div id="map"></div>
    </div>`
    console.log(weatherData)
}

const showForecast = () => {
  let textHTML;
  for (let i = 0; i < forecastData.list.length; i++) {
  const dateTime = forecastData.list[i].dt_txt.split(" ")

  textHTML += 
    `<h3 class="forecast-date">${dateTime[0]}</h3>
      <div class="hour-content d-flex flex-column align-center">
        <img src="http://openweathermap.org/img/w/${forecastData.list[i].weather[0].icon}.png">
        <p>Time: ${dateTime[1]}</p>
        <p>Temp: ${forecastData.list[i].main.temp} &#8451</p>
        <p>Description: ${forecastData.list[i].weather[0].description}</p>
      </div>`
  }
  document.querySelector(".forecast").innerHTML = textHTML;
  console.log(forecastData)
}

const showMap = () => {
  var map = L.map('map').setView([lat, long], 7);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, 
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}