export async function getAll() {
  console.log('Fetching all data');
  try {
    const result = await fetch('https://api.openbrewerydb.org/v1/breweries');
    if (!result.ok) throw new Error(`HTTP: ${result.status}`);
    const data = await result.json();
    console.log('Returning data.');
    return data;
  } catch (error) {
    console.log(`Erreur: ${error}`);
    return [];
  }
}

export async function getRandomBrewery() {
  console.log('Getting random brewery.');
  const allBreweries = await getAll();

  if (!allBreweries || allBreweries.length === 0) {
    console.log('No brewery found.');
    return null;
  }

  const breweriesCount = allBreweries.length;
  console.log(`Found ${breweriesCount} breweries.`);
  const randomIndex = Math.floor(Math.random() * breweriesCount);
  return allBreweries[randomIndex];
}
