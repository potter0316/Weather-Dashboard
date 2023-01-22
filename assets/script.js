let gotPosition = function (pos) {
    let lat = pos.coords.latitue;
    let long = pos.coords.longitude;
    getForecast(lat, long);
}

let getForecast = function (lat, long) {
    let url = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&appid=c6e25ea210e6f3f5127a9b5c05492945"
    getWeatherText(url);
}

async function getWeatherText(url) {
    let weatherObject = await fetch(url);
    let weatherText = await weatherObject.text();
    console.log(weatherText);
    console.log(weatherText);
    parseWeather(weatherText);
}

let parseWeather = function (weatherText) {
    let weatherJSON = JSON.parse(weatherText);
    let dailyForecast = weatherJSON.daily;
    console.log(dailyForecast)
    for (x = 0; x < dailyForecast.length; x++) {
        let day = dailyForecast[x];
        let today = new Date().getDay() + x;
        if (today > 6) {
            today = today - 7;
        }
        let dayOfWeek = getDayOfWeek(today);
        let description = day.weather[0].description;
        let icon = day.weather[0].icon;
        let sunrise = timestampToTime(day.sunrise);
        let sunset = timestampToTime(day.sunset);
        let highTemp = kToF(day.temp.max);
        let lowTemp = kToF(day.temp.min);
        let humidity = day.humidity;
        let windSpeed = day.wind_gust;
        let windGust = day.wind_gust;
        displayWeatherDay(dayOfWeek, description, icon, sunrise, sunset, highTemp, lowTemp, humidity, windSpeed, windGust)
    }
}