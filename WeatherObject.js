/** @typedef RawWeatherData JSON object containing weather data.
* @prop {number} cloudcover How much the sky is overcast, from 0 to 100%.
* @prop {string} conditions Textual representation of the weather conditions.
* @prop {string} icon Icon for the forecast.
* @prop {string} description Longer description of weather conditions.
* @prop {string} datetime Local timezone ISO 8601 string of the date viewed.
* @prop {number} datetimeEpoch Timestamp since 01/01/1970 UTC of datetime.
* @prop {number} feelslike Temperature adjusted for heat index or wind chill.
* @prop {number} temp Temperature adjusted for heat index or wind chill.
* @prop {number} humidity How much humidity in the air, from 0 to 100%.
* @prop {number} winddir Direction of the wind, in degrees.
* @prop {number} windspeed Maximum hourly wind speed of the day.
* @prop {number} severerisk Forecast number, from 0 to 100, representing risk.
*/

/** @typedef RawWeatherObject JSON object containing all data;
 * @prop {string} resolvedAddress Full length name of the address
 * @prop {string} description Weather description to use;
 * @prop {RawWeatherData[]} days;
 */


function formatDirection(deg) {
  const directions = [
      "N", "NE", "E", "SE", "S", "SW", "W", "NW"
  ];
  
  deg = ((deg % 360) + 360) % 360;
  
  const index = Math.round(deg / 45) % 8;
  
  return directions[index];
}


export default class WeatherObject {

  /** @type {RawWeatherObject} */
  #innerObject;

  /** @type {RawWeatherData} */
  #today;

  /** @param {RawWeatherObject} rawData */
  constructor(rawData) {
    this.#innerObject = rawData;
    this.#today = this.#innerObject.days[0];
  }

  getTemperatures() {
    return [this.#today.temp, this.#today.feelslike];
  }

  getWind() {
    return [this.#today.winddir, this.#today.windspeed];
  }

  getCloudCoverage() {
    return this.#today.cloudcover;
  }

  getHumidity() {
    return this.#today.humidity;
  }

  getConditions() {
    return this.#today.conditions;
  }
  
  getDescription() {
    return this.#today.description;
  }
  
  getRisk() {
    const ref = this.#today.severerisk;
    if (ref <= 30) return 'low';
    else if (ref < 70) return 'medium';
    else return 'high';
  }

  getResolvedAddress() {
    return this.#innerObject.resolvedAddress;
  }

  getIcon() {
    return this.#today.icon;
  }

  prettyPrint() {
    const [temp, feelsLike] = this.getTemperatures();
    const [windDir, windSpeed] = this.getWind();
    const humidity = this.getHumidity();
    const cloudCoverage = this.getCloudCoverage();
    const risk = ((str) => (str.charAt(0).toUpperCase() + str.slice(1)))(this.getRisk());
    const icon = this.#today.icon;

    console.log(`Current situation for ${this.#innerObject.resolvedAddress}:`);
    console.log('Icon recommended: ' + icon);
    console.log(`\tTemperature today: ${temp}ºC, feels like ${feelsLike}ºC`);
    console.log(`\tWind today: ${windSpeed}km/h, heading ${formatDirection(windDir)}(${windDir}º)`);
    console.log(`\tHumidity: ${humidity}%`);
    console.log(`\tCloud coverage: ${humidity}%`);
    console.log(`\t Today's risk level is: ${risk}`);
    console.log('\t' + this.getDescription());
    console.log(`\t Condition string: ${this.getConditions()}`);
  }

};

const COLOR_MAP = {
  ['snow']: ['#b5d0de', '#f3f3ff'],
  ['rain']: ['#363744', '#73838b'],
  ['fog']: ['#c7c7c7', '#d4dbde'],
  ['wind']: ['#b9eed1', '#d5e5eb'],
  ['cloudy']: ['#ddd', '#a6a6a6'],
  ['partly-cloudy-day']: ['#6fd4ff', '#ddd'],
  ['partly-cloudly-night']: ['#434346', '#07000e'],
  ['clear-day']: ['#6fd4ff', '#c2ffeb'],
  ['clear-night']: ['#50558a', '#07000e'],
};

export { COLOR_MAP };