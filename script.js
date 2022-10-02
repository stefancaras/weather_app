const weatherURL = "https://api.openweathermap.org/data/2.5/weather?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q="
const forecastURL = "https://api.openweathermap.org/data/2.5/forecast?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q="
let weatherData = {};
let forecastData = {};
const input = document.querySelector(".input")

const getWeatherData = async () => {
  const result = await fetch(`${weatherURL}${input.value}`);
	weatherData = await result.json();
  showWeather();
}

const getForecastData = async () => {
  const result = await fetch(`${forecastURL}${input.value}`);
	forecastData = await result.json();
  showForecast();
}

const getWeather = () => {
  getWeatherData();
  getForecastData();
}

document.querySelector(".btn").addEventListener("click", getWeather)

const showWeather = () => {
  document.querySelector(".weather").innerHTML = `
    <div class="">
      <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
      <img src="http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png" />
      <p>Description: ${weatherData.weather[0].description}</p>
      <p>Humidity: ${weatherData.main.humidity} %</p>
      <p>Pressure: ${weatherData.main.pressure} hPa</p>
      <p>Current Temp: ${weatherData.main.temp} &#8451</p>
      <p>Min Temp: ${weatherData.main.temp_min} &#8451</p>
      <p>Max Temp: ${weatherData.main.temp_max} &#8451</p>
    </div>
    <div class="">
      <iframe width="100%" height="100%" frameborder="0" style="border:0"
        src="https://maps.google.com/maps?hl=en&amp;q=${weatherData.name},${weatherData.sys.country}+()&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed"
      </iframe>
    </div>`
}

const showForecast = () => {
  const dateTime = forecastData.list[0].dt_txt.split(" ")

    document.querySelector(".forecast").innerHTML = `
    <h3 class="forecast-date">${dateTime[0]}</h3>
      <div class="hour-content d-flex flex-column align-center">
        <img src="http://openweathermap.org/img/w/${forecastData.list[0].weather[0].icon}.png">
        <p>Time: ${dateTime[1]}</p>
        <p>Temp: ${forecastData.list[0].main.temp} &#8451</p>
        <p>Description: ${forecastData.list[0].weather[0].description}</p>
      </div>`
  console.log(forecastData)
}