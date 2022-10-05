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

    // Change the color of temperature text
    tempColor();
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
        <p class="largeFont">
          <i class="fa-solid fa-temperature-half whiteText marginRight"></i>
          <span class="temp">${Math.round(weatherData.main.temp)}</span><span>&#8451</span>
        </p>
        <p><span class="whiteText">Feels like:</span> 
          <span class="temp">${Math.round(weatherData.main.feels_like)}</span><span>&#8451</span>
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
  //forecastData.list = forecastData.list.reverse();
  let dateArray = [];
  let row;
  for (let i = 0; i < forecastData.list.length; i++) {
    // Split date and time
    const dateTime = forecastData.list[i].dt_txt.split(" ");
    // Check for the day of the forecast
    if (dateTime[0] !== dateArray[0]) {
      // Date row&cell
      let rowEnd = table.insertRow();
      let cell = rowEnd.insertCell();
      cell.colSpan = "8";
      cell.textContent = dateTime[0];
      // Forecast row
      row = table.insertRow();
    }
    // Put date in array
    dateArray.unshift(dateTime[0]);
    // Forecast cells
    let cellEnd = row.insertCell();
    cellEnd.innerHTML = 
      `<div class="flexWrapCenter column">
        <p>${dateTime[1]}</p>
        <img src="http://openweathermap.org/img/wn/${forecastData.list[i].weather[0].icon}.png">
        <p class="capitalize">${forecastData.list[i].weather[0].description}</p>
        <p>
          <i class="fa-solid fa-temperature-half whiteText marginRight"></i>
          <span class="temp">${Math.round(forecastData.list[i].main.temp)}</span><span>&#8451</span>
        </p>
        <p><i class="fa-solid fa-wind marginRight"></i>${Math.round(forecastData.list[i].wind.speed)} m/s</p>
      </div>`
  }
  console.log(forecastData)
}

const showMap = () => {
  let map = L.map('map').setView([lat, long], 9);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19, 
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap&nbsp;&nbsp;</a>'
    }).addTo(map);
  let newMarker = new L.marker([lat, long]).addTo(map);
}

const tempColor = () => {
  const temp = document.querySelectorAll(".temp")
  temp.forEach((el) => {
    if (Number(el.textContent) < 1) {
      el.parentNode.classList.add("blueText");
    } else if (Number(el.textContent) > 0 && Number(el.textContent) < 11) {
      el.parentNode.classList.add("yellowText");
    } else if (Number(el.textContent) > 10 && Number(el.textContent) < 21) {
      el.parentNode.classList.add("orangeText");
    } else {
      el.parentNode.classList.add("redText");
    }
  })
}