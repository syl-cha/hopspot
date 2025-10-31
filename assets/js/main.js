import {
  getAll,
  getFiltered,
  getMetadata,
} from "./services/openBreweryService.js";
import {
  getRandomBrewery,
  getAmericanStates,
} from "./utils/openBreweryUtils.js";
import { BreweryCardBuilder } from "./builders/builders.js";
import { initializeMap, setBreweryMarker } from "./services/map.js";
$(document).ready(async function () {
  const $breweryDiv = $("#random-brewery");
  $breweryDiv.text("Récupération d'une brasserie.");
  initializeMap("map-target");
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
      setBreweryMarker(brewery);
      // affichage des details brewery
      displayBreweryDetails(brewery);
    } else {
      $breweryDiv.text("Aucune brasserie trouvée...");
    }
  } catch (error) {
    console.log("Failed retrieving brewery: ", error);
    $breweryDiv.text("Erreur dans la récupération des données.");
  }

  try {
    const fetchedFiltered = await getFiltered(
      "breweries",
      "San Diego",
      "California"
    );
    console.log(fetchedFiltered);
  } catch (error) {
    console.log("Failed retrieving brewery: ", error);
    $breweryDiv.text("Erreur dans la récupération des données.");
  }

  let statesList = [];
  const $statesSelect = $("#states");

  try {
    const fetchedMetadata = await getMetadata();
    statesList = getAmericanStates(fetchedMetadata);
  } catch (error) {
    console.log("Failed retrieving metas: ", error);
    $breweryDiv.text("Erreur dans la récupération des metadonnées.");
  }

  console.log(statesList);

  if ($statesSelect.length && statesList.length) {
    $.each(statesList, function (_, state) {
      $statesSelect.append(new Option(state, state)); // https://stackabuse.com/bytes/adding-options-to-a-select-element-using-jquery/
    });
  }

  // TODO: Search func, modular cleanup, logic for map render integration and raw UX
});

function displayBreweryDetails(brewery) {
  // masquer la liste des resultats et afficher la zone de detail
  $("#results-list").hide();

  $("#brewery-details-area").show();

  // mettre a jour les informations de la barsserie
  $("#detail-name").text(brewery.name);
  $("#detail-type").text(brewery.brewery_type);

  // format addresse complet
  const address = [
    brewery.street,
    `${brewery.city}, ${brewery.state_province}`,
    brewery.country,
    brewery.postal_code,
  ]
    .filter((line) => line)
    .join("<br>");
  $("#detail-address").html(address);

  // telephone
  if (brewery.phone) {
    $("#detail-phone").text(`Tel: ${brewery.phone}`).parent().show();
  } else {
    $("#detail-phone").parent().hide();
  }

  // site web
  const websiteURL = brewery.website_url;
  const $websiteLink = $("#detail-website");
  if (websiteURL) {
    $websiteLink.attr("href", websiteURL);
    $websiteLink.text("Visiter le site: ");
    $websiteLink.show();
  } else {
    $websiteLink.hide();
  }

  setBreweryMarker(brewery);
}
