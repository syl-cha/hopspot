import { getAll, getRandomBrewery } from './openBreweryUtils.js';
$(document).ready(async function () {
  const breweryDiv = $('#brewery');
  breweryDiv.text("Récupération d'une brasserie.");
  try {
    const brewery = await getRandomBrewery();
    if (brewery) {
      const breweryHtmlContent = `
        <h2>${brewery.name}</h2>
        <p><a href='${brewery.website_url}'>Site</a></p>
        `;
      breweryDiv.html(breweryHtmlContent);
    } else {
      breweryDiv.text('Aucune brasserie trouvée...');
    }
  } catch (error) {
    console.log('Failed retrieving brewery: ', error);
    breweryDiv.text('Erreur dans la récupération des données.');
  }
});
