import {
  getRandom,
  getFiltered,
  searchApi,
  getMetadata,
} from './services/openBreweryService.js';
import {
  getAmericanStates,
  getAmericanTypes,
  getCountriesList,
  toTitleCase,
} from './utils/openBreweryUtils.js';
import { initializeMap, setBreweryMarker } from './services/map.js';
import { BreweryCardBuilder } from './builders/builders.js';
$(document).ready(async function () {
  const $breweryDiv = $('#random-brewery');
  $breweryDiv.text("Récupération d'une brasserie.");
  initializeMap('map-target');
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
      setBreweryMarker(brewery);
      // affichage des details brewery
      displayBreweryDetails(brewery);
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
    typesList = getAmericanTypes(fetchedMetadata);
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

  // AS: The appended new options are placed within the dropdown select menus with an inherent alphabetic order.
  // When it comes down to the country, it is preferred to utilize the US as the basis one.
  // The API has no wasy to pre-scrape all countries it has, so two options:
  // Text input ability, or a custom pre-existing list. Will do both in one - using datalist for that.

  const countriesList = getCountriesList();
  // we need to now get the input element datalist
  let $countriesList = $('#countries-list');
  // over all countries in the string[] and append them as options to the countries dataList element
  if ($countriesList.length) {
    $.each(countriesList, function (i, country) {
      $countriesList.append(new Option(country, country));
    });
  }

  const $searchButton = $('#search-button');
  const $searchResult = $('.search-result');
  console.log($searchResult);
  $($searchButton).on('click', async function () {
    console.log('search registered');
    console.log($('#countries')[0].value);
    console.log($('#states')[0].value);
    console.log($('#town')[0].value);
    console.log($('#type')[0].value);

    var country =
      $('#countries')[0] === undefined ? '' : $('#countries')[0].value;
    var state = $('#state')[0] === undefined ? '' : $('#states')[0].value;
    var town = $('#town')[0] === undefined ? '' : $('#town')[0].value;
    var type = $('#type')[0] === undefined ? '' : $('#type')[0].value;

    // A.S: now we need to pre-specify and construct the request ftowards the API.
    // edge-case: US pre-set as country, but if we set another couyntry, then the State input dialogue needs to be hidden and it's value not
    // taken into account when forming the query.

    // It now occured to me that unline other langs, js will not support custom argument syntax, so the
    // request will be an object instead.

    let searchQuery = { country, state, town, type };
    console.log(searchQuery);
    try {
      const response = await searchApi(searchQuery);
      console.log(response);
    } catch (error) {
      console.log('Failed retrieving API query: ', error);
      $searchResult.text('Erreur dans la récupération des metadonnées.');
    }
  });
  console.log($searchButton);

  // TODO: Search func, modular cleanup, logic for map render integration and raw UX
});

function displayBreweryDetails(brewery) {
  const breweryCard = new BreweryCardBuilder(brewery.name);
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
  // masquer la liste des resultats et afficher la zone de detail
  // $("#results-list").hide();

  // $("#brewery-details-area").show();

  // // mettre a jour les informations de la barsserie
  // $("#detail-name").text(brewery.name);
  // $("#detail-type").text(brewery.brewery_type);

  // // format addresse complet
  // const address = [
  //   brewery.street,
  //   `${brewery.city}, ${brewery.state_province}`,
  //   brewery.country,
  //   brewery.postal_code,
  // ]
  //   .filter((line) => line)
  //   .join("<br>");
  // $("#detail-address").html(address);

  // // telephone
  // if (brewery.phone) {
  //   $("#detail-phone").text(`Tel: ${brewery.phone}`).parent().show();
  // } else {
  //   $("#detail-phone").parent().hide();
  // }

  // // site web
  // const websiteURL = brewery.website_url;
  // const $websiteLink = $("#detail-website");
  // if (websiteURL) {
  //   $websiteLink.attr("href", websiteURL);
  //   $websiteLink.text("Visiter le site: ");
  //   $websiteLink.show();
  // } else {
  //   $websiteLink.hide();
  // }

  setBreweryMarker(brewery);
}
