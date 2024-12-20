import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}
// TODO: Define a class for the Weather object
class Weather {
  tempF: number
  windSpeed: number
  humidity: number
  description: string
  date: string
  icon: string
  city: string
  constructor(
    temperature: number,
    windSpeed: number,
    humidity: number,
    description: string,
    date: number,
    icon: string,
    city: string
  ) {
    this.tempF = temperature;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.description = description;
    this.date = new Date(date).toLocaleString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    this.icon = icon;
    this.city = city;

  }
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = 'https://api.openweathermap.org/data/2.5';
  private apiKey = process.env.WEATHER_API_KEY || ''; // Load from .env


  /**
   * Get the 5 day forecast for a city
   */
  public async fetchForecast(city: string) {
    const { lat, lon } = await this.fetchLocationData(city);

    // see https://openweathermap.org/forecast5#5days
    const queryURL = `${this.baseURL}/forecast?appid=${this.apiKey}&lat=${lat}&lon=${lon}&units=imperial`;
    const response = await fetch(queryURL);
    const records = await response.json();

    // we only want 1 record for each of the 5 days
    // we also want to get the weather @ mid-day so offset our records by 4

    const rec = [
      records.list[4],
      records.list[12],
      records.list[20],
      records.list[28],
      records.list[36],
    ];


    // now we need to turn that data into our Weather object
    const weather = rec.map(p => this.parseCurrentWeather(p));
    return weather
  }


  // Fetch location data based on city name
  private async fetchLocationData(city: string): Promise<Coordinates> {
    const queryURL = `${this.baseURL}/weather?q=${city}&appid=${this.apiKey}&units=imperial`;
    const response = await fetch(queryURL);
    // console.log(response, "fetchLocationData");
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    const data = await response.json();
    //console.log(data);
    return this.destructureLocationData(data);
  }
  // Destructure location data to get coordinates
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.coord.lat,
      lon: locationData.coord.lon,
    };
  }
  // // TODO: Create buildGeocodeQuery method
  //  private buildGeocodeQuery(query: string): string {
  //    console.log("buildGeocodeQuery",query);
  //    return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  //  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${this.apiKey}`;
  }
  //  TODO: Create fetchAndDestructureLocationData method
  //  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
  //    const locationData = await this.fetchLocationData(city);
  //   // console.log(locationData, "fetchAndDestructureLocationData");

  // }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherQuery);
    const data = response.json();

    return data;
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const temperature = response.main.temp;
    const windSpeed = response.wind.speed;
    const humidity = response.main.humidity;
    const description = response.weather[0].description;
    const date = response.dt * 1000;
    const icon = response.weather[0].icon;
    const city = response.name;
    return new Weather(temperature, windSpeed, humidity, description, date, icon, city);
  }
  // TODO: Complete buildForecastArray method
  public processWeatherData(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = this.buildForecastArray(currentWeather, weatherData); // Call the method here
    // Do something with the forecastArray, like logging or storing it
    console.log(forecastArray);
  }
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray: Weather[] = [];
    for (const dataPoint of weatherData) {
      const temperature = dataPoint.main.temp;
      const windSpeed = dataPoint.wind.speed;
      const humidity = dataPoint.main.humidity;
      const description = dataPoint.weather[0].description;
      const date = dataPoint.dt;
      const icon = dataPoint.weather[0].icon;
      const city = dataPoint.name;
      const forecast = new Weather(temperature, windSpeed, humidity, description, date, icon, city);
      forecastArray.push(forecast);
    }
    forecastArray.unshift(currentWeather);
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather> {
    console.log("getWeatherForCity");
    const coordinates = await this.fetchLocationData(city);
    // console.log(coordinates);
    const weatherData = await this.fetchWeatherData(coordinates);
    // console.log(weatherData);
    return this.parseCurrentWeather(weatherData);
  }
}


export default new WeatherService();