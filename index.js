const search = document.querySelector("button");
const input = document.querySelector("input");
const alertMsg = document.querySelector(".alert");
const col = document.querySelector(".col");
const body = document.querySelector("body");
const div = document.createElement("div");
const cardGroup = document.createElement("div");

search.addEventListener("click", () => {
  div.innerHTML = "";
  cardGroup.innerHTML = "";
  checkValidity(input.value);
});

function checkValidity(inputValue) {
  if (inputValue === "" || inputValue === undefined || inputValue === " ") {
    alertMsg.style.display = "block";
    setTimeout(() => {
      alertMsg.style.display = "none";
    }, 3000);
  } else {
    console.log(`valid ${inputValue}`);
    gettingLocationInput(inputValue);
  }
}

function gettingLocationInput(city) {
  let url =
    "http://api.weatherapi.com/v1/forecast.json?key=6a7613743d4f4091bba93427230809";
  const formatCityInput = `&q=${city}`;
  const searchedCity = url + formatCityInput;
  getWetherByLocation(searchedCity);
  getForecastingResults(searchedCity);
}

async function getForecastingResults(searchedCity) {
  const forecastingURL = searchedCity + "&days=3";
  try {
    const response = await fetch(forecastingURL, { mode: "cors" });
    const weatherData = await response.json();

    const tomorrowWeather = weatherData.forecast.forecastday[0].day.avgtemp_c;
    const afterTomorrowWeather =
      weatherData.forecast.forecastday[1].day.avgtemp_c;
    const afterAfterTomorrowWeather =
      weatherData.forecast.forecastday[2].day.avgtemp_c;

    injectingForecastingResults(
      tomorrowWeather,
      afterTomorrowWeather,
      afterAfterTomorrowWeather
    );
  } catch (err) {
    console.error("There is Error! \n", err);
  }
}

async function getWetherByLocation(cityURL) {
  try {
    const response = await fetch(cityURL, { mode: "cors" });
    const weatherData = await response.json();
    const currentCloud = weatherData.current.condition.text;
    const currentWeather = weatherData.current.temp_c;
    const currentHumidity = weatherData.current.humidity;
    const currentWind = weatherData.current.wind_kph;
    getTheGIFLink(currentCloud);
    injectingResults(
      currentCloud,
      currentWeather,
      currentHumidity,
      currentWind
    );
  } catch (err) {
    console.error("There is Error! \n", err);
  }
}

function injectingResults(
  currentCloud,
  currentWeather,
  currentHumidity,
  currentWind
) {
  div.className = "card mb-3";
  div.id = "current-card";

  div.innerHTML = `<div class="card-body">
              <h5 class="card-title">
                <span class="current-weather">${currentWeather}</span>C
              </h5>
              <p class="card-text">
                The status is <span class="clearness-status">${currentCloud}</span>, winds are <span class="wind-status">${currentWind}</span> kph and
                humidity is <span class="humidity-status">${currentHumidity}</span>.
              </p>
            </div>`;
  col.appendChild(div);
}

function injectingForecastingResults(
  tomorrowWeather,
  afterTomorrowWeather,
  afterAfterTomorrowWeather
) {
  cardGroup.className = "card-group";
  cardGroup.id = "card-group";

  cardGroup.innerHTML = `<div class="card cards">
      <div class="card-body">
        <h5 class="card-title">Tomorrow</h5>
        <p class="card-text card-text-group tomorrow-card">${tomorrowWeather}</p>
      </div>
    </div>
    <div class="card cards">
      <div class="card-body">
        <h5 class="card-title">After Tomorrow</h5>
        <p class="card-text card-text-group after-card">${afterTomorrowWeather}</p>
      </div>
    </div>
    <div class="card cards">
      <div class="card-body">
        <h5 class="card-title">The Day After</h5>
        <p class="card-text card-text-group after-after-card">${afterAfterTomorrowWeather}</p>
      </div>
    </div>`;
  col.appendChild(cardGroup);
}

function getTheGIFLink(currentCloud) {
  if (currentCloud) {
    let giphyUrl =
      "https://api.giphy.com/v1/gifs/translate?api_key=WOLux0PXfrRXuVeBhDcVAg4EblSYORyG";
    const contentSearched = giphyUrl + `&s=${currentCloud}` + " " + "weather";
    console.log("fetched");
    fetchTheGIF(contentSearched);
  }
}

async function fetchTheGIF(url) {
  try {
    const response = await fetch(url, { mode: "cors" });
    const gifData = await response.json();
    const gifPath = gifData.data.images.original.url;
    console.log(gifPath);
    body.style.setProperty("background-image", "!important");
    body.style.backgroundImage = `url("${gifPath}")`;
    body.style.backgroundSize = "cover";
    body.style.backgroundRepeat = "no-repeat";
  } catch (error) {
    console.error("Hello:", error);
  }
}
