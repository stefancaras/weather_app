import "./leaflet/leaflet.js";

const $ = (query) => document.querySelector(query);

// DON'T USE MY API KEY, create your own, it's free (openweathermap.org)
const weatherURL =
  "https://api.openweathermap.org/data/2.5/weather?appid=d0ff3e62a6e73b63e01a003e877ed476&units=metric&";
const forecastURL =
  "https://api.openweathermap.org/data/2.5/forecast?appid=d0ff3e62a6e73b63e01a003e877ed476&units=metric&";
let weatherData, forecastData, lat, long;

const geolocation = async () => {
  const result = await fetch(`${weatherURL}lat=${lat}&lon=${long}`);
  const result2 = await fetch(`${forecastURL}lat=${lat}&lon=${long}`);
  if (result.status === 200) {
    weatherData = await result.json();
    forecastData = await result2.json();
    showWeather();
    showForecast();
    showMap();
    tempColor();
  }
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    geolocation();
  });
}

const getData = async () => {
  const result = await fetch(`${weatherURL}q=${$(".input").value}`);
  const result2 = await fetch(`${forecastURL}q=${$(".input").value}`);
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
    $(".input").value = "";

    // Change the color of temperature text
    tempColor();
  } else {
    alert("City not found");
  }
};

document.querySelector(".input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") getData();
});

const showWeather = () => {
  $(".weather").style.display = "block";
  $(".weather").innerHTML = `
    <div class="flexWrapCenter">
      <div class="flexWrapCenter column padding">
        <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
        <img class="marginRight" src="./img/icons/${
          weatherData.weather[0].icon
        }.png" />
        <p class="capitalize">${weatherData.weather[0].description}</p>
        <div>
          <p class="largeFont">
            <i class="fa-solid fa-temperature-half whiteText marginRight"></i>
            <span class="temp">${Math.round(
              weatherData.main.temp
            )}</span><span>&#8451</span>
          </p>
          <p>
            <span class="whiteText">
              <i class="fa-solid fa-temperature-half"></i>
              <i class="fa-solid fa-person marginRight"></i>
            </span> 
            <span class="temp">${Math.round(
              weatherData.main.feels_like
            )}</span><span>&#8451</span>
          </p>
          <p><i class="fa-solid fa-wind marginRight"></i>${Math.round(
            weatherData.wind.speed
          )} m/s</p>
          <p><i class="fa-solid fa-gauge-high marginRight"></i>${
            weatherData.main.pressure
          } hPa</p>
          <p>Humidity: ${weatherData.main.humidity}%</p>
        </div>
      </div>
      <div id="map"></div>
    </div>`;
  console.log(weatherData);
};

const showForecast = () => {
  $(".forecast").innerHTML = "";
  $(".forecast").style.display = "block";
  let dateArray = [];
  let row;
  forecastData.list.forEach((el) => {
    // Split date and time
    const dateTime = el.dt_txt.split(" ");
    // Check for the day of the forecast
    if (dateTime[0] !== dateArray[0]) {
      // Date row&cell
      let rowEnd = $(".forecast").insertRow();
      let cell = rowEnd.insertCell();
      cell.colSpan = "8";
      cell.textContent = dateTime[0];
      // Forecast row
      row = $(".forecast").insertRow();
      row.id = `id${forecastData.list.indexOf(el)}`;
    }
    // Put date in array
    dateArray.unshift(dateTime[0]);
    // Forecast cells
    let cellEnd = row.insertCell();
    cellEnd.innerHTML = `
      <div class="flexWrapCenter column">
        <p>${dateTime[1]}</p>
        <img src="./img/icons/${el.weather[0].icon}.png">
        <p class="capitalize text-center h-2rem">${
          el.weather[0].description
        }</p>
        <p>
          <i class="fa-solid fa-temperature-half whiteText marginRight"></i>
          <span class="temp">${Math.round(
            el.main.temp
          )}</span><span>&#8451</span>
        </p>
        <p><i class="fa-solid fa-wind marginRight"></i>${Math.round(
          el.wind.speed
        )} m/s</p>
      </div>`;
  });
  // Move first row TDs to the right
  const firstRow = document.getElementById("id0");
  const firstRowLength = firstRow.childNodes.length;
  for (let i = 0; i < 8 - firstRowLength; i++) {
    firstRow.insertCell(0);
  }
  console.log(forecastData);
};

const showMap = () => {
  let map = L.map("map").setView([lat, long], 9);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap&nbsp;&nbsp;</a>',
  }).addTo(map);
  let newMarker = new L.marker([lat, long]).addTo(map);
};

const tempColor = () => {
  const temp = document.querySelectorAll(".temp");
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
  });
};
