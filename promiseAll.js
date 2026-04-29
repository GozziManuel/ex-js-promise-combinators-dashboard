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

  return {
    city: dest && dest.length > 0 ? dest[0].name : null,

    country: dest && dest.length > 0 ? dest[0].country : null,

    temperature: wheater && wheater.length > 0 ? wheater[0].temperature : null,

    weather:
      wheater && wheater.length > 0 ? wheater[0].weather_description : null,

    airport: airport && airport.length > 0 ? airport[0].name : null,
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
