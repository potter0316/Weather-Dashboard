//Converts kelvin into fahrenheit
let kToF = function (kelvinTemp) {
  const celsius = kelvinTemp - 273;
  const fahrenheit = Math.floor(celsius * (9 / 5) + 32);
  return fahrenheit;
}
$(document).ready(function () {
  let api = "15b46b4024aa9c9876a3ca0520fd79ff";
  //search button
  $("#search-button").on("click", function () {
    let citySearch = $("#search-value").val();
    $("#search-value").val("");
    weatherFunction(citySearch);
    weatherForecast(citySearch);
  });

  //search button enter key feature.
  $("#search-button").keypress(function (event) {
    let keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode === 20) {
      weatherFunction(citySearch);
      weatherForecast(citySearch);
    }
  });

  //local storage
  let storage = JSON.parse(localStorage.getItem("local")) || [];

  if (storage.length > 0) {
    weatherFunction(storage[storage.length - 1]);
  }
  //creates storage
  for (let i = 0; i < storage.length; i++) {
    createRow(storage[i]);
  }

  //local storage of the last cities searched
  function createRow(text) {
    let cityList = $("<li>").addClass("list").text(text);
    $(".local").append(cityList);
  }

  //listener for list item on click function
  $(".local").on("click", "li", function () {
    weatherFunction($(this).text());
    weatherForecast($(this).text());
  });

  function weatherFunction(citySearch) {
    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        citySearch +
        "&appid=" +
        api,
    }).then(function (data) {
        if (storage.indexOf(citySearch) === -1) {
        storage.push(citySearch);
        localStorage.setItem("local", JSON.stringify(storage));
        createRow(citySearch);
      }
      $("#today").empty();

      let city = $("<h3>").text(
        data.name + " (" + new Date().toLocaleDateString() + ")"
      );
      let icon = $("<img>").attr(
        "src",
        "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png"
      );

      let container = $("<div>");
      let containerBody = $("<div>");
      let wind = $("<p>").text("Wind Speed: " + data.wind.speed + " MPH");
      let humid = $("<p>").text("Humidity: " + data.main.humidity + " %");
      let temp = $("<p>").text("Temperature: " + kToF(data.main.temp) + " F");
      let longitude = data.coord.lon;
      let latitude = data.coord.lat;

      $.ajax({
        type: "GET",
        url:
          "https://api.openweathermap.org/data/2.5/uvi?appid=" +
          api +
          "&lat=" +
          latitude +
          "&lon=" +
          longitude,
      }).then(function (response) {
        let uvResponse = response.value;
        let btn = $("<span>").addClass("btn").text(uvResponse);

        containerBody.append(uvIndex);
        $("#today .container-body").append(uvIndex.append(btn));
      });

      // merge and add to page
      city.append(icon);
      containerBody.append(city, temp, wind, humid);
      container.append(containerBody);
      $("#today").append(container);
    });
  }
  // function weatherForecast(citySearch)
  function weatherForecast(citySearch) {
    $.ajax({
      type: "GET",
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        citySearch +
        "&appid=9f112416334ce37769e5c8683b218a0d&units=imperial",
    }).then(function (data) {
      $("#weatherDay")
        .html('<h3>5-Day Forecast:</h3>')
        .append('<div class="row">');

      // 5 Day Forecast

      for (let i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.indexOf("15:00:00") !== -1) {
          let fiveDay = $("<h3>").text(
            new Date(data.list[i].dt_txt).toLocaleDateString()
          );
          let iconFive = $("<img>").attr(
            "src",
            "https://openweathermap.org/img/w/" +
              data.list[i].weather[0].icon +
              ".png"
          );
          let colFive = $("<div>").addClass("weatherDay");
          let containerFive = $("<div>").addClass("card bg-primary");
          let containerBodyFive = $("<div>");
          let humidFive = $("<p>").text(
            "Humidity: " + data.list[i].main.humidity + "%"
          );
          let tempFive = $("<p>").text(
            "Temperature: " + data.list[i].main.temp + " °F"
          );

          colFive.append(
            containerFive.append(
              containerBodyFive.append(fiveDay, iconFive, tempFive, humidFive)
            )
          );
   
          $("#weatherDay .row").append(colFive);
        }
      }
    });
  }
});
