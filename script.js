import "./leaflet/leaflet.js";

const $ = (query) => document.querySelector(query);

// DON'T USE MY API KEY, create your own, it's free (openweathermap.org)
const weatherURL =
  "https://api.openweathermap.org/data/2.5/weather?appid=d0ff3e62a6e73b63e01a003e877ed476&units=metric&";
const forecastURL =
  "https://api.openweathermap.org/data/2.5/forecast?appid=d0ff3e62a6e73b63e01a003e877ed476&units=metric&";
let weatherData, forecastData, lat, lon;

const getData = async (bool) => {
  const urlSlug = bool ? `q=${$(".input").value}` : `lat=${lat}&lon=${lon}`;
  const result = await fetch(`${weatherURL}${urlSlug}`);
  const result2 = await fetch(`${forecastURL}${urlSlug}`);
  if (result.status === 200) {
    weatherData = await result.json();
    forecastData = await result2.json();
    showWeather();
    showForecast();
    showMap();
    $(".input").value = "";
    tempColor();
  } else {
    alert("City not found");
  }
};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    getData(0);
  });
}

document.querySelector(".input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") getData(1);
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
  const dateArray = [];
  let date, time, row;
  const timezone = forecastData.city.timezone;
  forecastData.list.forEach((el) => {
    // Calculate local date and time and split date and time
    const dateTime = new Date((el.dt + timezone) * 1000);
    [date, time] = dateTime.toUTCString().split(/[0-9]{4,}/);
    // Check for the day of the forecast
    if (date !== dateArray[0]) {
      // Date row&cell
      let rowEnd = $(".forecast").insertRow();
      let cell = rowEnd.insertCell();
      cell.colSpan = "8";
      cell.textContent = date;
      // Forecast row
      row = $(".forecast").insertRow();
      row.id = `id${forecastData.list.indexOf(el)}`;
    }
    // Put date in array
    dateArray.unshift(date);
    // Forecast cells
    let cellEnd = row.insertCell();
    cellEnd.innerHTML = `
      <div class="flexWrapCenter column">
        <p>${parseInt(time)}:00</p>
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
  lat = weatherData.coord.lat;
  lon = weatherData.coord.lon;
  let map = L.map("map").setView([lat, lon], 9);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap&nbsp;&nbsp;</a>',
  }).addTo(map);
  let newMarker = new L.marker([lat, lon]).addTo(map);
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
