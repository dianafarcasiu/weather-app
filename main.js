// Needed elements from the DOM
const cityInput = document.querySelector('#city-input');
const searchBtn = document.querySelector('#search-btn');
const locationBtn = document.querySelector('#location-btn');

// Actual city name that the user types
let cityName;

const apiKey = '270ec8d21fc67e4a57d1e74aa502acac'

// Function to fetch the current weather data
async function fetchCurrentWeather() {

    // Getting ahold of the city name & only then defining the url
    cityName = cityInput.value;
    url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;

    // Validating the user input, fetching data from the url & converting it to an array
    const response = await fetch(url);
    if (!response.ok) alert('Please enter a valid city name.');
    const data = await response.json();
    return data;
}

// Function to display the current Weather
function displayCurrentWeather(data) {

    document.querySelector('.current-weather-info').innerHTML = `
    <h3>${data.name}</h3>
    <h1>${Math.round(data.main.temp)}°C</h1>
    <img id="current-weather-icon">
    <h4>-${data.weather[0].description}-</h4>   
    `
    // Setting the icon
    document.querySelector('#current-weather-icon').setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
}

// Function to change the background
function changeBackground() {
    let randomNumber = Math.floor(Math.random() * 10 + 1);
    document.body.style.backgroundImage = `url('./images/bg-pic-${randomNumber}.jpeg')`;
}

// Function to fetch the forecast
async function fetchForecast() {
   
    cityName = cityInput.value;
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Function to display the forecast
function displayForecast(data) {

    const forecastContainer = document.querySelector('.forecast-container');

    // Clear existing forecast cards
    forecastContainer.innerHTML = '';
    
    // Iterating through the elements of the array
    data.forEach(element => {

        // Creating a Date obj out of the date text in order to display the day of the week
        const date = new Date(element.dt_txt);
        const dayOfWeek = new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(date);

        // Creating a new div for each day and displaying the data
        const forecastDiv = document.createElement('div');
        forecastDiv.classList.add('weather-card');
        forecastDiv.innerHTML = `
        <p>${dayOfWeek}</p>
        <img src ='https://openweathermap.org/img/wn/${element.weather[0].icon}@2x.png'>
        <p id= 'forecast-temp'><b>${Math.round(element.main.temp)}°C</b></p>
        <p>-${element.weather[0].description}-</p>`;

        forecastContainer.appendChild(forecastDiv);
    });
}

// Function to filter an array of weather data in order to get only the temperature for the next following days at 15:00
function filterData(array) {
    return array.filter(element => {
        const hour = new Date(element.dt_txt).getHours();
        return hour === 15; 
    })
}

// Function to display everything
async function displayAll(e) {
    // Preventing the default behaviour of the form
    e.preventDefault();

    // Fetching & displaying the current data
    const currentWeatherData = await fetchCurrentWeather();
    displayCurrentWeather(currentWeatherData);

    // Fetching, filtering & displaying the forecast
    const forecastData = await fetchForecast();
    const forecastDays = forecastData.list;
    const filteredForecast = filterData(forecastDays);
    displayForecast(filteredForecast);

    // Changing the background pic
    changeBackground();

    // Clearing the user input
    cityInput.value = '';
}

// Geolocation API
// Getting ahold of the user's position
function getUserPosition(e) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(async position => {
        // Getting the user's coordinates
        const userLat = position.coords.latitude;
        const userLong = position.coords.longitude;

        // Fetching current weather based on the user's lat & long
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${userLat}&lon=${userLong}&units=metric&appid=${apiKey}`);
        const data = await response.json();
        displayCurrentWeather(data);

        // Fetching forecast based on the user's lat & long
        const fresponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${userLat}&lon=${userLong}&units=metric&appid=${apiKey}`);
        const fdata = await fresponse.json();
        const forecastDays = fdata.list;
        const filteredForecast = filterData(forecastDays);
        displayForecast(filteredForecast);

        changeBackground();
    });
}

// Adding Event Listeners
searchBtn.addEventListener('click', displayAll);
locationBtn.addEventListener('click', getUserPosition);