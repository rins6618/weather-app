import WeatherObject, { STATUS_MAP, formatDirection } from "./WeatherObject.js";

const API_KEY = 'UCYQXWSMY2WVZ62HTNY9WZHZM';
const link = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const main = document.querySelector('main');

  const nameDOM = {
    mainAddr: main.querySelector('#main-addr'),
    secondaryAddr: main.querySelector('#secondary-addr')
  };

  const infoDOM = {
    temp: main.querySelector("#temp"),
    feelslike: main.querySelector("#feelslike"),
    humidity: main.querySelector("#humidity"),
    wind: main.querySelector('#wind'),
  };

  const descDOM = {
    status: main.querySelector("#status"),
    desc: main.querySelector('#description'),
  }
  /** @type {HTMLInputElement} */
  const query = form.querySelector('#query');
  /** @type {HTMLInputElement} */
  const unitGroup = form.querySelector('#unit-group');
  const location = query.value;
  const checkbox = unitGroup.checked;
  const unit = checkbox.checked ? 'us' : 'metric';
  const suffixes = {
    temp: checkbox ? 'ºF' : 'ºC',
    speed: checkbox ? 'mph' : 'km/h'
  };

  const queryLink = `${link}/${location}?key=${API_KEY}&unitGroup=${unit}`;
  const response = await fetch(queryLink, { mode: 'cors' });

  /** @type {import("./WeatherObject").RawWeatherObject} */
  const data = await response.json();

  const weatherObject = new WeatherObject(data);
  weatherObject.prettyPrint();

  const icon = weatherObject.getIcon();

  const warnEntry = {
    colors: ['##ffd48a', '#ff1515'],
    status: 'Error'
  };

  const [col1, col2] = STATUS_MAP.get(icon)?.colors || warnEntry.colors;

  main.style.setProperty('--color1', col1);
  main.style.setProperty('--color2', col2);

  const resolved = weatherObject.getResolvedAddress();
  const [first, ...rest] = resolved.split(',');

  const [temp, feelslike] = weatherObject.getTemperatures();
  const [windDir, windSpeed] = weatherObject.getWind();

  nameDOM.mainAddr.textContent = first + ',';
  nameDOM.secondaryAddr.textContent = rest.join(',');

  infoDOM.temp.textContent = `${temp}${suffixes.temp}`;
  infoDOM.feelslike.textContent = `Feels like ${feelslike}${suffixes.temp}`;
  infoDOM.humidity.textContent = `Humidity: ${weatherObject.getHumidity()}%`;
  infoDOM.wind.textContent = `Wind: ${windSpeed}${suffixes.speed} ${formatDirection(windDir)} (${windDir}º)`;

  descDOM.desc.textContent = weatherObject.getDescription();
  descDOM.status.textContent = STATUS_MAP.get(icon)?.status || 'Error';
  query.value = '';
});