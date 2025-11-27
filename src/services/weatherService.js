import axios from "axios";

// coordinates for Kapelle, NL
const KAPELLE_COORDS = {
  latitude: 51.493,
  longitude: 3.958,
};

export async function getKapelleWeather() {
  const url = "https://api.open-meteo.com/v1/forecast";

  const params = {
    latitude: KAPELLE_COORDS.latitude,
    longitude: KAPELLE_COORDS.longitude,
    current_weather: true,
    timezone: "Europe/Amsterdam",
  };

  return axios.get(url, { params });
}
