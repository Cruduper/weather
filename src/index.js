import $ from "jquery";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./css/styles.css";

$(document).ready(function () {
  $("#weatherLocation").click(function () {
    const city = $("#location").val();
    $("#location").val("");

    let request = new XMLHttpRequest();
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}`;

    request.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.responseText);
        getElements(response);
      }
    };

    request.open("GET", url, true);
    request.send();

    function getElements(response) {
      const kelvinT = response.main.temp;
      const fahrT = Math.round((((kelvinT - 273.15) * 9) / 5 + 32) * 100) / 100;
      $(".showHumidity").text(`The humidity in ${city} is ${response.main.humidity}%`);
      $(".showTemp").text(`The temperature in Kelvins is ${fahrT} degrees.`);

      response.weather.forEach((elem) => {
        const iconCode = elem.icon;
        const iconUrl = "https://openweathermap.org/img/wn/" + iconCode + ".png";
        $("ul.showWeather").append(`<li><img src=${iconUrl}> ${elem.main} : ${elem.description} </li>`);
      });
    }
  });
});
