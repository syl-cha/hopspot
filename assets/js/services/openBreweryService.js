const baseApi_url = "https://api.openbrewerydb.org/v1/";
const baseApi_country= "united%20states";

export async function getAll(endpoint = "breweries") {
  let full_url = baseApi_url + endpoint
  console.log('Fetching all data from: ' + full_url);
  return sendRequest(full_url, "GET_ALL");
}

export async function getFiltered(endpoint = "breweries", city, state, country = baseApi_country) {
  let full_url = baseApi_url + endpoint + "?by_city=" + city + "&by_state=" + state + "&by_country=" + baseApi_country
  console.log('Fetching all data from: ' + full_url);
  return sendRequest(full_url, "GET_FILTERED");
}

export async function getMetadata(endpoint = "breweries") {
  let full_url = baseApi_url + endpoint + "/meta" + "?by_country=" + baseApi_country
  console.log('Fetching all data from: ' + full_url);
  return sendRequest(full_url, "GET_META");
}

export async function sendRequest(full_url, baseMethod = "") { 
  try {
    const result = await fetch(full_url);
    if (!result.ok) throw new Error(`HTTP: ${result.status}`);
    const data = await result.json();
    console.log("[" + baseMethod + "] " + 'Returning data.');
    return data;
  } catch (error) {
    console.log("[" + baseMethod + "] " + "Erreur: " + error);
  return [];
  }
}