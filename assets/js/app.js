// variable for html elements
var button = document.querySelector(".button");
var inputValue = document.querySelector(".inputValue");
var nameEl = document.querySelector(".name");
var coordLonEl = document.querySelector(".lonCoord");
var coordLatEl = document.querySelector(".latCoord");
var windEL = document.querySelector(".wind");
var tempEL = document.querySelector(".temp");
var humiEl = document.querySelector(".humi");
var uvEl = document.querySelector(".uvi");
var clearBtn = document.querySelector(".clear");

var topWeatherIcon = document.querySelector(".current-weather-icon");
var topWeatherDesc = document.querySelector(".current-weather-desc");

let mapImageEl = document.querySelector(".map-image-section");

// variables for future elements
var futureEl = document.querySelector(".futureCard");

// variables for search history
var searchFromEl = document.querySelector("#form");
var searchHistLiEl = document.querySelector(".searchHistLi");
let previousSearchesElement = document.querySelector("#previousSearches");
// let btnClearSearchHistory = document.querySelector("#btnClearSearchHistory");
let searchHistory = [];

// variables for symbols
var perSym = "%";
var farSym = "°F";
var windSym = "MPH";

// date & time
var currentDate = moment();
$("#currentDay").text(currentDate.format("LLL"));

// event listener for function 1
button.addEventListener("click", cityApi);
clearBtn.addEventListener("click", function () {
  location.assign("index.html");
  localStorage.clear();
});

function saveSearch(searchText) {
  if (previousSearch.includes(searchText)) {
    previousSearches.splice(previousSearches.indexOf(searchText), 1);
  }
  previousSearches.unshift(searchText);
  localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
}

// display history button - when clicked this function display last city searched
function displayPreviousSearches() {
  if (localStorage.getItem("previousSearches") != null) {
    previousSearches = JSON.parse(localStorage.getItem("previousSearches"));
    previousSearchesElement.innerHTML = "";

    for (let i = 0; i < previousSearches.length; i++) {
      const btnPreviousSearch = document.createElement("button");
      btnPreviousSearch.classList.add("btn");
      btnPreviousSearch.classList.add("btn-block");
      btnPreviousSearch.classList.add("previousSearch");
      btnPreviousSearch.textContent = previousSearches[i];
      previousSearchesElement.append(btnPreviousSearch);
    }
  }
}

// Animation to move header up after search
function moveHeaderSearch() {
  document.getElementById("mainHeader").style.top = "-.75rem";
  document.getElementById("mainHeader").style.transition = "400ms ease-in-out";
}

function moveHeaderClear() {
  document.getElementById("mainHeader").style.top = "0";
  document.getElementById("mainHeader").style.transition = "300ms ease-in-out";
}

// function 1 fetch url 1
function cityApi(searchText) {
  if (!searchHistory.includes(inputValue.value)) {
    searchHistory.push(inputValue.value.toUpperCase());
    localStorage.setItem("previousSearches", JSON.stringify(searchHistory));
  }

  if (inputValue.value) {
    console.log("hi");
    searchText = inputValue.value;
    inputValue.value = "";
  }

  document.querySelector(".weather-display").classList.remove("hide");

  fetch(
    "http://api.openweathermap.org/geo/1.0/direct?q=" +
      searchText +
      "&appid=3f3600732e8599f586337a5c93fffe3d"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const lat = data[0].lat.toFixed(6);
      const lon = data[0].lon.toFixed(6);
      const city = data[0].name;
      longLatApi(lat, lon, city);
    });
  // console.log("I've been clicked!");
  return;
}

// function 2 fetch url 1 & 2 ( )
function longLatApi(lat, lon, city, searchText) {
  let requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hour&units=imperial&appid=3f3600732e8599f586337a5c93fffe3d`;
  fetch(requestUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      nameEl.innerHTML = "";
      coordLonEl.innerHTML = "";
      coordLatEl.innerHTML = "";
      humiEl.innerHTML = "";
      tempEL.innerHTML = "";
      windEL.innerHTML = "";
      uvEl.innerHTML = "";
      mapImageEl.innerHTML = "";

      // variables for currently weather values
      var tempValue = data.current.temp;
      var windValue = data.current.wind_speed;
      var uvValue = data.current.uvi;
      var humiValue = data.current.humidity;

      // posts current weather values to the page
      humiEl.textContent = `${humiValue}${perSym}`;
      tempEL.textContent = `${tempValue}${farSym}`;
      windEL.textContent = `${windValue} ${windSym}`;
      uvEl.textContent = `UVI: ${uvValue}`;

      // these values are passed through first fetch function (see below)
      coordLatEl.textContent = `LAT: ${lat}`;
      coordLonEl.textContent = `LON: ${lon}`;
      nameEl.textContent = city;

      removeAllChildNodes(mapImageEl);

      // Mapbox API key generation
      let mapApiKey = config.MAP_BOX_API_KEY;
      let zoom = 9;
      let size = "450X300";
      let apiUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lon},${lat},${zoom},0/${size}?access_token=${mapApiKey}`;

      const locationImage = document.createElement("img");
      locationImage.classList.add("map-image");
      locationImage.src = apiUrl;
      console.log(locationImage);
      mapImageEl.appendChild(locationImage);
      console.log(locationImage);

      topWeatherIcon.src = `https://openweathermap.org/img/wn/${data.current.weather[0].icon}@4x.png`;
      topWeatherIcon.textContent = `${data.current.weather[0].main}`;
      topWeatherDesc.src = `https://openweathermap.org/img/wn/${data.current.weather[0].description}.png`;
      topWeatherDesc.textContent = `${data.current.weather[0].main}`;

      // day1 - day5 variables
      var day1 = data.daily[1];
      var day2 = data.daily[2];
      var day3 = data.daily[3];
      var day4 = data.daily[4];
      var day5 = data.daily[5];

      // consolidated array that handles days 1-5
      let futureWeather = [day1, day2, day3, day4, day5];

      // for loop cycles array of days
      futureEl.innerHTML = "";

      for (let index = 0; index < futureWeather.length; index++) {
        const element = futureWeather[index];
        console.log(element);
        var futureTempVal = element.temp.day;
        var futureHumiVal = element.humidity;
        var futureWindVal = element.wind_speed;
        var futureDescVal = element.weather[0].description;
        var futureIconVal = element.weather[0].icon;
        var futureDateVal = moment()
          .add(index + 1, "days")
          .format("ddd, MMMM D YYYY");
        var futureTimeVal = moment()
          .add(index + 1, "days")
          .format("h:mm a");

        // var futureIconEl = document.createElement("main-weather-icon");
        // futureIconEl.src = `http://openweathermap.org/img/wn/${futureIconVal}@4x.png`;
        // futureIconEl.alt = futureDescVal;

        // var topWeatherIcon = document.createElement("img");
        // topWeatherIcon.classList.add("current-weather-icon");
        // topWeatherIcon.src = `https://openweathermap.org/img/wn/${futureIconVal}.png`;
        // topWeatherIcon.textContent = `${topWeatherIcon}`;
        // console.log(futureIconVal);

        var cardEl = document.createElement("div");
        cardEl.classList.add("divCard");

        var gaugleEl = document.createElement("div");
        gaugleEl.classList.add("divGauge");

        // Date Element Chunk (Part of Card)
        var futureDateEl = document.createElement("p");
        futureDateEl.textContent = `${futureDateVal}`;
        futureDateEl.classList.add("pDate");
        cardEl.append(futureDateEl);

        // Time Element Chunk (Part of Card)
        var futureTimeEl = document.createElement("p");
        futureTimeEl.textContent = `${futureTimeVal}`;
        futureTimeEl.classList.add("pTime");
        cardEl.append(futureTimeEl);

        // Weather Icon Element Chunk (Part of Card)
        var futureIconEl = document.createElement("img");
        futureIconEl.classList.add("imgIcon");
        futureIconEl.src = `http://openweathermap.org/img/wn/${futureIconVal}@2x.png`;
        futureIconEl.alt = futureDescVal;
        cardEl.append(futureIconEl);

        // Description Element Chunk (Part of Card)
        var descpEL = document.createElement("p");
        descpEL.textContent = futureDescVal;
        descpEL.classList.add("pDesc");
        cardEl.append(descpEL);

        // Temp Element Chunk (Part of Card)
        var temppEl = document.createElement("p");
        temppEl.textContent = `${futureTempVal}${farSym}`;
        temppEl.classList.add("pTemp");
        gaugleEl.append(temppEl);

        // Humidity Element Chunk (Part of Card)
        var humipEl = document.createElement("p");
        humipEl.textContent = `H: ${futureHumiVal}${perSym}`;
        humiEl.classList.add("pHumi");
        gaugleEl.append(humipEl);

        // Wind Element Chunk (Part of Card)
        var windpEL = document.createElement("p");
        windpEL.textContent = `${futureWindVal}${windSym}`;
        windpEL.classList.add("pWind");
        gaugleEl.append(windpEL);

        cardEl.append(gaugleEl);
        futureEl.append(cardEl);
      }
      displayPreviousSearches();
    });

  previousSearchesElement.addEventListener("click", function (event) {
    if (event.target.classList.contains("previousSearch")) {
      let searchText = event.target.textContent;
      cityApi(searchText);
      console.log(searchText);
    }
  });

  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  function init() {
    displayPreviousSearches();
  }

  init();

  return;
}
