var town = [];

var citysearch=document.querySelector("#citySearch");
var cityInput=document.querySelector("#city");
var currentWeather=document.querySelector("#currentWeather");
var citySearchInput = document.querySelector("#citySearchInput");
var forecastTitle = document.querySelector("#forecast");
var fiveDay = document.querySelector("#fiveDay");
var pastSearched = document.querySelector("#pastSearched");

var formSubmit = function(event){
    event.preventDefault();
    var city = cityInput.value.trim();
    if(city){
        getCityWeather(city);
        getFiveDay(city);
        town.unshift({city});
        cityInput.value = "";
    } else{
        alert("Please enter a City");
    }
    searchSave();
    pastSearch(city);
}

var searchSave = function(){
    localStorage.setItem("town", JSON.stringify(town));
};

var pastSearch = function(pastSearch){
    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");
    pastSearched.prepend(pastSearchEl);
}

var pastSearchFunct = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        getFiveDay(city);
    }
}

pastSearch();

citysearch.addEventListener("submit", formSubmit);
pastSearched.addEventListener("click", pastSearchFunct);
var getCityWeather = function(city){
    var apiKey = "8ec34521eefe69f7fca7154d7550a34a"
    var apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units=imperial&appid="+ apiKey
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            showWeather(data, city);
        });
    });
};

var showWeather = function(weather, searchCity){
   currentWeather.textContent= "";  
   citySearchInput.textContent=searchCity;

var todaysDate = document.createElement("span")
   todaysDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   citySearchInput.appendChild(todaysDate);

var dailyIcon = document.createElement("img")
var dailyIconURL = weather.weather[0].icon;
   dailyIcon.setAttribute("src", "https://openweathermap.org/img/wn/"+dailyIconURL+"@2x.png");
   citySearchInput.appendChild(dailyIcon);

var mainTemp = document.createElement("span");
   mainTemp.textContent = "Temperature: " + weather.main.temp + " °F";
   mainTemp.classList = "list-group-item"
  
var mainHumidity = document.createElement("span");
   mainHumidity.textContent = "Humidity: " + weather.main.humidity + " %";
   mainHumidity.classList = "list-group-item"

var weatherWindSpeed = document.createElement("span");
   weatherWindSpeed.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   weatherWindSpeed.classList = "list-group-item"

   currentWeather.appendChild(mainTemp);
   currentWeather.appendChild(mainHumidity);
   currentWeather.appendChild(weatherWindSpeed);

   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
   indexUV(lat,lon)
}

var indexUV = function(lat,lon){
    var apiKey = "8ec34521eefe69f7fca7154d7550a34a"
    var apiURL = "https://api.openweathermap.org/data/2.5/uvi?appid="+ apiKey +"&lat=" + lat+ "&lon=" + lon
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            showUVIndex(data)
        });
    });
}
 
var showUVIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"
    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "good"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "normal "
    }
    else if(index.value >8){
        uvIndexValue.classList = "bad"
    };
    uvIndexEl.appendChild(uvIndexValue);
    currentWeather.appendChild(uvIndexEl);
}

var getFiveDay = function(city){
    var apiKey = "8ec34521eefe69f7fca7154d7550a34a"
    var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid="+ apiKey
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           showFiveDay(data);
        });
    });
};

var showFiveDay = function(weather){
    fiveDay.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];
        
       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       
       var dailyIcon = document.createElement("img")
       dailyIcon.classList = "card-body text-center";      
       var dailyIconURL = dailyForecast.weather[0].icon;
       dailyIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + dailyIconURL + "@2x.png");
       forecastEl.appendChild(dailyIcon);
       
       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = dailyForecast.main.temp + " °F";
       forecastEl.appendChild(forecastTempEl);

       var humidity=document.createElement("span");
       humidity.classList = "card-body text-center";
       humidity.textContent = dailyForecast.main.humidity + "  %";
       forecastEl.appendChild(humidity);
        fiveDay.appendChild(forecastEl);
    }
}
