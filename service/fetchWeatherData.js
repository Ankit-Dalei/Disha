const API_KEY = "7a08b718ea6c46d4466ce23fd33bfed0";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export const fetchWeatherData = async (city) => {
  try {
    const response = await fetch(
      `${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch weather data");
    }
    return {
      feelsLike: data.main.feels_like,
      temp: data.main.temp,
      humidity: data.main.humidity,
      city: data.name,
      country: data.sys.country,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
    };
  } catch (error) {
    throw error;
  }
};
