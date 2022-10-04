import "./leaflet/leaflet.js";

const weatherURL = "https://api.openweathermap.org/data/2.5/weather?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=";
const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=";
let weatherData, forecastData, lat, long;
const input = document.querySelector(".input");
const weatherDiv = document.querySelector(".weather");
const table = document.querySelector(".forecast");

const getData = async () => {
  const result = await fetch(`${weatherURL}${input.value}`);
  const result2 = await fetch(`${forecastURL}${input.value}`);
  if (result.status === 200) {
    weatherData = await result.json();
    forecastData = await result2.json();
    showWeather();
    showForecast();
  
    // Show map
    lat = weatherData.coord.lat;
    long = weatherData.coord.lon;
    showMap();

    //Clear input
    input.value = "";
  } else {
    alert("City not found");
  }
}

document.querySelector(".input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") getData();
});

const showWeather = () => {
  weatherDiv.style.display = "block";
  weatherDiv.innerHTML = `
    <div class="flexWrapCenter">
      <div class="flexWrapCenter column padding">
        <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
        <img class="marginRight" src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" />
        <p class="capitalize">${weatherData.weather[0].description}</p>
        <p class="largeFont redText">
          <i class="fa-solid fa-temperature-half whiteText marginRight">
          </i>${Math.round(weatherData.main.temp)}&#8451
        </p>
        <p>Feels like: 
          <span class="redText">${Math.round(weatherData.main.feels_like)}&#8451</span>
        </p>
        <p><i class="fa-solid fa-wind marginRight"></i>${Math.round(weatherData.wind.speed)} m/s</p>
        <p><i class="fa-solid fa-gauge-high marginRight"></i>${weatherData.main.pressure} hPa</p>
        <p>Humidity: ${weatherData.main.humidity}%</p>
      </div>
      <div id="map"></div>
    </div>`
    console.log(weatherData)
}

const showForecast = () => {
  table.innerHTML = "";
  table.style.display = "block";
  forecastData.list = forecastData.list.reverse();
  let dateArray = [];
  let row;
  for (let i = 0; i < forecastData.list.length; i++) {
    // Split date and time
    const dateTime = forecastData.list[i].dt_txt.split(" ");
    // Check for the day of the forecast
    if (dateTime[0] !== dateArray[0]) {
      // Date row&cell
      let row0 = table.insertRow(0);
      let cell0 = row0.insertCell();
      table.rows[0].cells[0].colSpan = "8";
      cell0.textContent = dateTime[0];
      // Forecast row
      row = table.insertRow(1);
    }
    // Put date in array
    dateArray.unshift(dateTime[0]);
    // Forecast cells
    let cell = row.insertCell(0);
    cell.innerHTML = 
      `<div class="flexWrapCenter column">
        <p>${dateTime[1]}</p>
        <img src="http://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}.png">
        <p class="capitalize">${forecastData.list[i].weather[0].description}</p>
        <p class="redText">
          <i class="fa-solid fa-temperature-half whiteText marginRight">
          </i>${Math.round(forecastData.list[i].main.temp)}&#8451
        </p>
        <p><i class="fa-solid fa-wind marginRight"></i>${Math.round(forecastData.list[i].wind.speed)} m/s</p>
      </div>`
  }
  console.log(forecastData)
}

const showMap = () => {
  var map = L.map('map').setView([lat, long], 8);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, 
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}