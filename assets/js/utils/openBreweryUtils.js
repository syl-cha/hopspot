export function getRandomBrewery(allBreweries) {
  console.log('Getting random brewery.');

  if (!allBreweries || allBreweries.length === 0) {
    console.log('No brewery found.');
    return null;
  }

  console.log(allBreweries);

  const breweriesCount = allBreweries.length;
  console.log(`Found ${breweriesCount} breweries.`);
  const randomIndex = Math.floor(Math.random() * breweriesCount);
  return allBreweries[randomIndex];
}

export function getAmericanStates(metadata_obj) { 
  if (!metadata_obj || metadata_obj.length === 0) {
    console.log('No metadata found.');
    return null;
  }
    // root object destructuring 
  let {total, by_state, by_type} = metadata_obj;  
  let state_list = [];
  let i = 0;
  Object.entries(by_state).forEach(([state, count]) => {
    state_list[i] = state;
    i++
  });
  return state_list;
}
