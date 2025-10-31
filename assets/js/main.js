import {
  getRandom,
  getFiltered,
  getMetadata,
} from './services/openBreweryService.js';
import {
  getRandomBreweryFromList,
  getAmericanStates,
  getAmericanTypes,
  toTitleCase,
} from './utils/openBreweryUtils.js';
import { BreweryCardBuilder } from './builders/builders.js';
$(document).ready(async function () {
  const $breweryDiv = $('#random-brewery');
  $breweryDiv.text("Récupération d'une brasserie.");
  try {
    // const fetchedBreweries = await getAll();
    const breweryRequest = await getRandom();
    if (breweryRequest) {
      const brewery = breweryRequest[0];
      const breweryCard = new BreweryCardBuilder(brewery.name);
      breweryCard
        .addAddress(brewery.street)
        .addCity(brewery.city)
        .addState(brewery.state_province)
        .addCountry(brewery.country)
        .addPhone(brewery.phone)
        .addWebsite(brewery.website_url)
        .addType(brewery.brewery_type);
      $breweryDiv.html(breweryCard.render());
    } else {
      $breweryDiv.text('Aucune brasserie trouvée...');
    }
  } catch (error) {
    console.log('Failed retrieving brewery: ', error);
    $breweryDiv.text('Erreur dans la récupération des données.');
  }

  let fetchedFiltered = [];
  try {
    fetchedFiltered = await getFiltered('breweries', 'San Diego', 'California');
    console.log('fetchedFiltered:');
    console.log(fetchedFiltered);
    /*
           /!\ For testing grid system for search result ONLY /!\
    */
    if (fetchedFiltered.length !== 0) {
      const $resultGrid = $('#search-result');
      $.each(fetchedFiltered, (_, brewery) => {
        const breweryCard = new BreweryCardBuilder(brewery.name);
        breweryCard
          .addAddress(brewery.street)
          .addCity(brewery.city)
          .addState(brewery.state_province)
          .addCountry(brewery.country)
          .addPhone(brewery.phone)
          .addWebsite(brewery.website_url)
          .addType(brewery.brewery_type);
        $resultGrid.append(breweryCard.render());
      });
    }
  } catch (error) {
    console.log('Failed retrieving brewery: ', error);
    $breweryDiv.text('Erreur dans la récupération des données.');
  }

  let statesList = [];
  const $statesSelect = $('#states');

  let typesList = [];
  const $typeSelect = $('#type');

  try {
    const fetchedMetadata = await getMetadata();
    statesList = getAmericanStates(fetchedMetadata);
    typesList = getAmericanTypes(fetchedMetadata)
  } catch (error) {
    console.log('Failed retrieving metas: ', error);
    $breweryDiv.text('Erreur dans la récupération des metadonnées.');
  }

  console.log(statesList);
  console.log(typesList);

  if ($statesSelect.length && statesList.length) {
    $.each(statesList, function (_, state) {
      $statesSelect.append(new Option(state, state)); // https://stackabuse.com/bytes/adding-options-to-a-select-element-using-jquery/
    });
  }

  if ($typeSelect.length && typesList.length) {
    $.each(typesList, function (_, type) {
      $typeSelect.append(new Option(toTitleCase(type), type)); // https://stackabuse.com/bytes/adding-options-to-a-select-element-using-jquery/
    });
  }



  // TODO: Search func, modular cleanup, logic for map render integration and raw UX
});
