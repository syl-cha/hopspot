const baseApi_url = 'https://api.openbrewerydb.org/v1/';
const baseApi_country = 'united%20states';

export async function getRandom() {
  const full_url = baseApi_url + 'breweries/random';
  console.log('Fetching a random brewery: ' + full_url);
  return sendRequest(full_url, 'GET_RANDOM');
}
export async function getAll(endpoint = 'breweries') {
  let full_url = baseApi_url + endpoint;
  console.log('Fetching all data from: ' + full_url);
  return sendRequest(full_url, 'GET_ALL');
}

export async function getFiltered(
  endpoint = 'breweries',
  city,
  state,
  country = baseApi_country,
  optional
) {
  let full_url =
    baseApi_url + endpoint + '?by_city=' + city + '&by_state=' + state + '&by_country=' + country;
  console.log('Fetching all data from: ' + full_url);
  return sendRequest(full_url, 'GET_FILTERED');
}

export async function searchApi(searchQuery, endpoint = 'breweries') {
  const params = [];

  if (searchQuery.town) params.push(`by_city=${encodeURIComponent(searchQuery.town)}`);
  if (searchQuery.state) params.push(`by_state=${encodeURIComponent(searchQuery.state)}`);

  const effectiveCountry = searchQuery.country ?? baseApi_country; // when not null or undefined will keep country inputted, otherwise US
  if (effectiveCountry) params.push(`by_country=${encodeURIComponent(effectiveCountry)}`);

  if (searchQuery.type) params.push(`by_type=${encodeURIComponent(searchQuery.type)}`);

  const full_url = `${baseApi_url}${endpoint}${params.length ? `?${params.join('&')}` : ''}`;
  console.log('Fetching all data from: ' + full_url);
  return sendRequest(full_url, 'SEARCH_API');
}

export async function getMetadata(endpoint = 'breweries') {
  let full_url = baseApi_url + endpoint + '/meta' + '?by_country=' + baseApi_country;
  console.log('Fetching all data from: ' + full_url);
  return sendRequest(full_url, 'GET_META');
}

export async function sendRequest(full_url, baseMethod = '') {
  try {
    const result = await fetch(full_url);
    if (!result.ok) throw new Error(`HTTP: ${result.status}`);
    const data = await result.json();
    console.log('[' + baseMethod + '] ' + 'Returning data.');
    return data;
  } catch (error) {
    console.log('[' + baseMethod + '] ' + 'Erreur: ' + error);
    return [];
  }
}
