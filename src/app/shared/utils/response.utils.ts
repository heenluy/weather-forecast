import { CityWeather, CityDailyWeather } from '../models/weather.model';

export function responseToCityWeather(response: any): CityWeather {
  return {
    city: {
      id: response.id,
      name: response.name,
      country: response.sys.country,
      coord: response.coord,
      timeZone: '',
    },
    weather: {
      id: response.weather[0].id,
      description: response.weather[0].description,
      icon: response.weather[0].icon,
      temp: response.main.temp,
      minTemp: 0,
      maxTemp: 0,
      feelsLike: response.main.feels_like,
      humidity: response.main.humidity,
      wind: {
        speed: response.wind.speed,
        deg: response.wind.deg,
      },
      sunrise: response.sys.sunrise,
      sunset: response.sys.sunset,
    },
  }
}

export function responseToCityDailyWeather(response: any): CityDailyWeather {
  return {
    city: {
      id: 0,
      name: '',
      country: '',
      coord: { lon: 0, lat: 0 },
      timeZone: response.timezone,
    },
    current: {
      id: response.current.weather[0].id,
      description: response.current.weather[0].description,
      icon: response.current.weather[0].icon,
      temp: response.current.temp,
      minTemp: 0,
      maxTemp: 0,
      feelsLike: response.current.feels_like,
      humidity: response.current.humidity,
      wind: {
        speed: response.current.wind_speed,
        deg: response.current.wind_deg,
      },
      sunset: response.current.sunset,
      sunrise: response.current.sunrise,
    },
    daily: response.daily.map((d: any) => ({
      date: d.dt,
      weather: {
        id: d.weather[0].id,
        description: d.weather[0].description,
        icon: d.weather[0].icon,
        temp: undefined,
        minTemp: d.temp.min,
        maxTemp: d.temp.max,
        humidity: d.humidity,
        wind: {
          speed: d.wind_speed,
          deg: d.wind_deg,
        },
        sunset: d.sunset,
        sunrise: d.sunrise,
      }
    })),
  }
}
