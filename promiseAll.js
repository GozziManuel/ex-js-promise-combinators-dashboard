async function handleAsync(url) {
  const result = await fetch(url);
  const obj = result.json();
  return obj;
}

async function getDashboardData(query) {
  try {
    const CityList = handleAsync(
      `http://localhost:3333/destinations?search=${query}`,
    );
    const CityListWeather = handleAsync(
      `http://localhost:3333false/weathers?search=${query}`,
    );
    const CityListAirport = handleAsync(
      `http://localhost:3333/airports?search=${query}`,
    );
    const promises = [CityList, CityListWeather, CityListAirport];
    const [dest, wheater, airport] = await Promise.allSettled(promises);

    console.log([dest, wheater, airport]);
    if (
      wheater.status === "fulfilled" ||
      airport.status === "fulfilled" ||
      dest.status === "fulfilled"
    ) {
      console.error("rejected found");

      return {
        city: null,

        country: null,

        temperature: null,

        weather: null,

        airport: null,
      };
    }
    return {
      city: dest?.value?.[0]?.name ?? null,

      country: dest?.value?.[0]?.country ?? null,

      temperature: wheater?.value?.[0]?.temperature ?? null,

      weather: wheater?.value?.[0]?.weather_description ?? null,

      airport: airport?.value?.[0]?.name ?? null,
    };
  } catch (error) {
    throw new Error("errore dei dati");
  }
}

getDashboardData("")
  .then((data) => {
    console.log("Dasboard data:", data);
    if (data.temperature || data.weather_description) {
      console.log(
        `${data.city} is in ${data.country}.\n` +
          `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` +
          `The main airport is ${data.airport}.\n`,
      );
    } else {
      console.log(
        `${data.city} is in ${data.country}.\n` +
          `The main airport is ${data.airport}.\n`,
      );
    }
  })
  .catch((error) => console.error(error));
