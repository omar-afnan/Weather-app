const apiKey = "9f95e6f84114c254d7c71a6c6ca387e6"; // Your API key
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input"); // Search bar
const searchBtn = document.querySelector(".search button"); // Search button
const weatherIcon = document.querySelector(".weather-icon"); // Weather icon

// Fetch current weather
async function checkWeather(city) {
  const response = await fetch(weatherUrl + city + `&appid=${apiKey}`);
  if (response.status == 404) {
    document.querySelector(".error").style.display = "block"; // Display error
    document.querySelector(".weather").style.display = "none"; // Hide weather
  } else {
    const data = await response.json(); // Parse JSON
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

    // Update weather icon
    if (data.weather[0].main === "Clouds") {
      weatherIcon.src = "Images/cloud.png";
    } else if (data.weather[0].main === "Clear") {
      weatherIcon.src = "Images/sun.png";
    } else if (data.weather[0].main === "Rain") {
      weatherIcon.src = "Images/rain.png";
    } else if (data.weather[0].main === "Drizzle") {
      weatherIcon.src = "Images/drizzle.png";
    } else if (data.weather[0].main === "Mist") {
      weatherIcon.src = "Images/mist.png";
    }

    document.querySelector(".weather").style.display = "block"; // Show weather
    document.querySelector(".error").style.display = "none"; // Hide error
  }
}

// Fetch forecast
async function getForecast(city) {
  const response = await fetch(forecastUrl + city + `&appid=${apiKey}`);
  const data = await response.json();

  const forecastContainer = document.querySelector(".forcast-items-container");
  forecastContainer.innerHTML = ""; // Clear existing forecast items

  // Process forecast data (next 5 days, at midday)
  const dailyForecast = data.list.filter((item) => item.dt_txt.includes("12:00:00"));

  dailyForecast.slice(0, 5).forEach((forecast) => {
    const date = new Date(forecast.dt * 1000); // Convert timestamp to date
    const formattedDate = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    const temperature = Math.round(forecast.main.temp);
    const icon = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`; // Use API icons

    // Create forecast item
    const forecastItem = document.createElement("div");
    forecastItem.classList.add("forcast-items");
    forecastItem.innerHTML = `
      <h5 class="forcast-items-date">${formattedDate}</h5>
      <img src="${icon}" alt="weather-icon" class="forcast-item-img">
      <h5 class="forcast-items-temp">${temperature}°C</h5>
    `;

    forecastContainer.appendChild(forecastItem);
  });
}

// Event listeners for search
searchBtn.addEventListener("click", () => {
  const city = searchBox.value.trim();
  if (city) {
    checkWeather(city); // Fetch current weather
    getForecast(city); // Fetch forecast
  }
});

searchBox.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const city = searchBox.value.trim();
    if (city) {
      checkWeather(city); // Fetch current weather
      getForecast(city); // Fetch forecast
    }
  }
});
