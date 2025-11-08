import {
  getRandom,
  searchApi,
  getMetadata,
} from './services/openBreweryService.js';
import {
  getAmericanStates,
  getAmericanTypes,
  getCountriesList,
  toTitleCase,
} from './utils/openBreweryUtils.js';
import { getBreweryById } from './utils/searchUtils.js';
import { initializeMap, setBreweryMarker } from './services/map.js';
import { BreweryCardBuilder } from './builders/builders.js';
let breweryDisplayedOnMap = {};
$(document).ready(async function () {
  const $breweryDiv = $('#random-brewery');
  $breweryDiv.text("Récupération d'une brasserie.");
  initializeMap('map-target');
  try {
    // const fetchedBreweries = await getAll();
    const breweryRequest = await getRandom();
    if (breweryRequest) {
      const brewery = breweryRequest[0];
      breweryDisplayedOnMap = { ...brewery };
      const breweryCard = new BreweryCardBuilder(
        brewery.name,
        'random-brewery-id',
      );
      breweryCard
        .addAddress(brewery.street)
        .addCity(brewery.city)
        .addState(brewery.state_province)
        .addCountry(brewery.country)
        .addPhone(brewery.phone)
        .addWebsite(brewery.website_url)
        .addType(brewery.brewery_type);
      $breweryDiv.html(breweryCard.render());
      setBreweryMarker(brewery);
      // affichage des details brewery
      displayBreweryDetails(breweryDisplayedOnMap);
    } else {
      $breweryDiv.text('Aucune brasserie trouvée...');
    }
  } catch (error) {
    console.log('Failed retrieving brewery: ', error);
    $breweryDiv.text('Erreur dans la récupération des données.');
  }

  /*
   *   Search grid
   */
  const $searchResult = $('#search-result');
  // Click on card is catch by event delegation on the whole grid
  $searchResult.on('click', '.brewery-card', function () {
    const cardId = $(this).attr('id'); // retrieving the ID of the card that was clicked
    console.log('This brewery was clicked !');
    // save last ID for later use
    const lastCardId = breweryDisplayedOnMap.id;
    breweryDisplayedOnMap = getBreweryById(fetchedFiltered, cardId);
    console.log(breweryDisplayedOnMap);
    // update the card selected
    const currentCardId = breweryDisplayedOnMap.id;
    if (lastCardId) {
      $(`#${lastCardId}`).removeClass('brewery-card-selected');
    }
    if (currentCardId) {
      $(`#${currentCardId}`).addClass('brewery-card-selected');
    }
    // update brewery on map
    displayBreweryDetails(breweryDisplayedOnMap);
  });

  let fetchedFiltered = [];

  let statesList = [];
  const $statesSelect = $('#states');
  const $stateSelector = $statesSelect.closest('.selector');

  let typesList = [];
  const $typeSelect = $('#type');

  const $countryInput = $('#countries');
  const $townInput = $('#town');
  const $countriesList = $('#countries-list');
  const US_COUNTRY_NAME = 'United States';
  const US_COUNTRY_KEY = US_COUNTRY_NAME.toLowerCase();

  try {
    const fetchedMetadata = await getMetadata();
    statesList = getAmericanStates(fetchedMetadata) || [];
    typesList = getAmericanTypes(fetchedMetadata) || [];
  } catch (error) {
    console.log('Failed retrieving metas: ', error);
    $breweryDiv.text('Erreur dans la récupération des metadonnées.');
  }

  if ($statesSelect.length && statesList.length) {
    $.each(statesList, function (_, state) {
      $statesSelect.append(new Option(state, state)); // https://stackabuse.com/bytes/adding-options-to-a-select-element-using-jquery/
    });
  }

  if ($typeSelect.length && typesList.length) {
    $.each(typesList, function (_, type) {
      $typeSelect.append(new Option(toTitleCase(type), type)); // https://stackabuse.com/bytes/adding-options-to-a-select-element-using-jquery/
    });
    // AS: Source - https://stackoverflow.com/a/8335332
    // Posted by user1074546, modified by community. See post 'Timeline' for change history
    // Retrieved 2025-11-08, License - CC BY-SA 3.0
    $('#type option[value="micro"]').attr('selected', 'selected'); // jquery for default micro selecti
  }

  // AS: The appended new options are placed within the dropdown select menus with an inherent alphabetic order.
  // When it comes down to the country, it is preferred to utilize the US as the basis one.
  // The API has no wasy to pre-scrape all countries it has, so two options:
  // Text input ability, or a custom pre-existing list. Will do both in one - using datalist for that.
  const countriesList = getCountriesList();
  if ($countriesList.length) {
    $.each(countriesList, function (_, country) {
      $countriesList.append(new Option(country, country));
    });
  }

  function toggleAmericanStateSelector() {
    const currentCountry = ($countryInput.val() || '').trim().toLowerCase();
    const isUnitedStates = currentCountry === US_COUNTRY_KEY;
    if (isUnitedStates) {
      $stateSelector.show();
    } else {
      $stateSelector.hide();
      $statesSelect.val('');
    }
  }

  toggleAmericanStateSelector();
  $countryInput.on('input change', toggleAmericanStateSelector);

  const $searchButton = $('#search-button');
  // const $searchResult = $('#search-result');  // already declared as $resultGrid : change it to $searchResult

  $searchButton.on('click', async function () {
    const rawCountry = ($countryInput.val() || '').trim(); // trim removes whitespaces in strings.
    const rawState = ($statesSelect.val() || '').trim();
    const rawTown = ($townInput.val() || '').trim();
    const rawType = ($typeSelect.val() || '').trim();

    const isUnitedStates = rawCountry.toLowerCase() === US_COUNTRY_KEY;
    const searchQuery = {
      country: rawCountry || '',
      state: isUnitedStates ? rawState : '',
      town: rawTown || '',
      type: rawType || '',
    };

    // A.S: now we need to pre-specify and construct the request ftowards the API.
    // edge-case: US pre-set as country, but if we set another couyntry, then the State input dialogue needs to be hidden and it's value not
    // taken into account when forming the query.

    // It now occured to me that unline other langs, js will not support custom argument syntax, so the
    // request will be an object instead.

    $searchResult.empty().text('Recherche en cours...');

    try {
      const breweries = await searchApi(searchQuery);
      fetchedFiltered = Array.isArray(breweries) ? breweries : [];
      $searchResult.empty();

      if (!fetchedFiltered.length) {
        $searchResult.text('Aucune brasserie trouvée.');
        return;
      }

      $.each(fetchedFiltered, function (index, brewery) {
        const breweryCard = new BreweryCardBuilder(brewery.name, brewery.id);
        breweryCard
          .addAddress(brewery.street)
          .addCity(brewery.city)
          .addState(brewery.state_province)
          .addCountry(brewery.country)
          .addPhone(brewery.phone)
          .addWebsite(brewery.website_url)
          .addType(brewery.brewery_type);

        const $card = $(breweryCard.render());
        if (index === 0) {
          $card.addClass('brewery-card-selected');
          breweryDisplayedOnMap = brewery;
          displayBreweryDetails(breweryDisplayedOnMap);
        }
        $searchResult.append($card);
      });
    } catch (error) {
      console.log('Failed retrieving API query: ', error);
      $searchResult.text('Erreur dans la récupération des données.');
    }
  });

  // TODO: Search func, modular cleanup, logic for map render integration and raw UX
});

function displayBreweryDetails(brewery) {
  const breweryCard = new BreweryCardBuilder(brewery.name, 'map-brewery-id');
  breweryCard
    .addAddress(brewery.street)
    .addCity(brewery.city)
    .addState(brewery.state_province)
    .addCountry(brewery.country)
    .addPhone(brewery.phone)
    .addWebsite(brewery.website_url)
    .addType(brewery.brewery_type);
  const $breweryDiv = $('#brewery-details-area');
  $breweryDiv.html(breweryCard.render());
  setBreweryMarker(brewery);
}
