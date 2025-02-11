import WeatherObject, { COLOR_MAP } from "./WeatherObject.js";

const API_KEY = 'UCYQXWSMY2WVZ62HTNY9WZHZM';
const link = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

const form = document.querySelector('form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const main = document.querySelector('main');
  const h1 = main.querySelector('h1');
  const query = form.querySelector('input');
  const location = query.value;

  const queryLink = `${link}/${location}?key=${API_KEY}&unitGroup=metric`;
  const response = await fetch(queryLink, { mode: 'cors' });

  /** @type {import("./WeatherObject").RawWeatherObject} */
  const data = await response.json();

  const weatherObject = new WeatherObject(data);
  weatherObject.prettyPrint();

  const icon = weatherObject.getIcon();
  const [col1, col2] = COLOR_MAP[icon];

  main.style.setProperty('--color1', col1);
  main.style.setProperty('--color2', col2);
  h1.textContent = weatherObject.getResolvedAddress();
  query.value = '';
});