import {
  getAll,
  getFiltered,
  getMetadata,
} from './services/openBreweryService.js';
import {
  getRandomBrewery,
  getAmericanStates,
} from './utils/openBreweryUtils.js';
import { BreweryCardBuilder } from './builders/builders.js';
$(document).ready(async function () {
  const $breweryDiv = $('#brewery');
  $breweryDiv.text("Récupération d'une brasserie.");
  try {
    const fetchedBreweries = await getAll();
    const brewery = getRandomBrewery(fetchedBreweries);
    if (brewery) {
      const breweryCard = new BreweryCardBuilder(brewery.name);
      breweryCard
        .addAddress(brewery.street)
        .addCity(brewery.city)
        .addState(brewery.state_province)
        .addCountry(brewery.country)
        .addPhone(brewery.phone)
        .addWebsite(brewery.website_url)
        .addType(brewery.brewery_type);
      // const breweryHtmlContent = `
      //   <h2>${brewery.name}</h2>
      //   <p><a href='${brewery.website_url}' >Site</a></p>
      //   `;
      $breweryDiv.html(breweryCard.render());
    } else {
      $breweryDiv.text('Aucune brasserie trouvée...');
    }
  } catch (error) {
    console.log('Failed retrieving brewery: ', error);
    $breweryDiv.text('Erreur dans la récupération des données.');
  }

  try {
    const fetchedFiltered = await getFiltered(
      'breweries',
      'San Diego',
      'California',
    );
    console.log(fetchedFiltered);
  } catch (error) {
    console.log('Failed retrieving brewery: ', error);
    $breweryDiv.text('Erreur dans la récupération des données.');
  }

  let statesList = [];
  const $statesSelect = $('#states');

  try {
    const fetchedMetadata = await getMetadata();
    statesList = getAmericanStates(fetchedMetadata);
  } catch (error) {
    console.log('Failed retrieving metas: ', error);
    $breweryDiv.text('Erreur dans la récupération des metadonnées.');
  }

  console.log(statesList);

  if ($statesSelect.length && statesList.length) {
    $.each(statesList, function (_, state) {
      $statesSelect.append(new Option(state, state)); // https://stackabuse.com/bytes/adding-options-to-a-select-element-using-jquery/
    });
  }

  // TODO: Search func, modular cleanup, logic for map render integration and raw UX
});
