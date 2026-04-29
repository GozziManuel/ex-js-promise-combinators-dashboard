async function handleAsync(url) {
  const result = await fetch(url);
  const obj = result.json();
  return obj;
}

async function getDashboardData(query) {
  const CityList = await handleAsync(
    `http://localhost:3333/destinations?search=${query}`,
  );
  const CityListWeather = await handleAsync(
    `http://localhost:3333/weathers?search=${query}`,
  );
  const CityListAirport = await handleAsync(
    `http://localhost:3333/airports?search=${query}`,
  );

  const [dest, wheater, airport] = await Promise.all([
    CityList,
    CityListWeather,
    CityListAirport,
  ]);
  if (
    wheater.temperature === undefined ||
    weather.weather_description === undefined ||
    dest.name === undefined ||
    dest.country === undefined ||
    airport.name === undefined
  ) {
    return {
      city: null,
      country: null,
      temperature: null,
      weather: null,
      airport: null,
    };
  }
  return {
    city: dest[0].name,
    country: dest[0].country,
    temperature: wheater[0].temperature,
    weather: wheater[0].weather_description,
    airport: airport[0].name,
  };
}

getDashboardData("Vienna")
  .then((data) => {
    console.log("Dasboard data:", data);
    if (data.temperature || data.weather_description) {
      console.log(
        `${data.city} is in ${data.country}.\n` +
          `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` +
          `The main airport is ${data.airport}.\n`,
      );
    }
    console.log(
      `${data.city} is in ${data.country}.\n` +
        `The main airport is ${data.airport}.\n`,
    );
  })
  .catch((error) => console.error(error));
