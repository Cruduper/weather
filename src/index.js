import $ from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";

$(document).ready(function () {
  $("#weatherLocation").click(function () {
    const city = capitalize($("#city").val());
    const state = capitalize($("option:selected").val());

    let location = "";
    if (city !== "") {
      location = city;
      if (state !== "") {
        location += "," + state;
      }
    } else {
      location = state;
    }
    $("#city").val("");

    let request = new XMLHttpRequest();
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.API_KEY}`;

    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        getElements(response);
      }
    };

    request.open("GET", url, true);
    request.send();

    function capitalize(string) {
      let array = string.split(" ");

      for (let i = 0; i < array.length; i++) {
        array[i] = array[i].substr(0, 1).toUpperCase() + array[i].substr(1);
      }
      return array.join(" ");
    }

    function getTime(date) {
      let hours = date.getHours();
      const minutes = "0" + date.getMinutes();
      const ampm = hours > 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12;
      return hours + ":" + minutes.substr(-2) + " " + ampm;
    }

    function getElements(response) {
      const kelvinT = response.main.temp;
      const fahrT = Math.round((((kelvinT - 273.15) * 9) / 5 + 32) * 100) / 100;
      $(".showHumidity").text(`The humidity in ${location} is ${response.main.humidity}%`);
      $(".showTemp").text(`The temperature in Fahrenheit is ${fahrT} degrees.`);
      $("ul.showWeather").empty();
      response.weather.forEach((elem) => {
        const iconCode = elem.icon;
        const iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
        $("ul.showWeather").append(`<li><img src=${iconUrl}> ${elem.main} : ${elem.description} </li>`);
      });

      const sunRiseUnix = response.sys.sunrise;
      const sunSetUnix = response.sys.sunset;
      const sunRiseDate = new Date(sunRiseUnix * 1000);
      const sunSetDate = new Date(sunSetUnix * 1000);

      $(".sunrise").html("Sunrise time: " + getTime(sunRiseDate));
      $(".sunset").html("Sunset time: " + getTime(sunSetDate));
    }
  });
});
