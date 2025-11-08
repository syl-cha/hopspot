UE-L220 — Mini-projet

# Brasseries du monde

<div style="font-size: 0.5em;">
Maxime Ferrand

Serghei Anistratenco

Sylvain Chambon

</div>

====

# Slide 2

```js [1-2|3|4]
    let a = 1;
    let b = 2;
    let c = x => 1 + 2 + x;
    c(3);
```

====

# La grille

--

## Les cartes

Classe `BreweyCardBuilder`

```javascript
export class BreweryCardBuilder {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.data = {};
  }
...
}
````


--

## Les cartes

Une méthode par attribut à afficher

```javascript
addAddress(address) {
  this.data.address = address;
  return this;
}
````

--

## Les cartes

Une méthode `render()`

```javascript
render() {
  ...
  html += `<h3 class="brewery-card-name">${this.name}</h3>`;
  if (
    this.data.address ||
    this.data.city ||
    this.data.state ||
    this.data.country
  ) {
    html += '<div class="brewery-card-details">';
    html += '<div class="brewery-card-address-container">';
    if (this.data.address) {
      html += `<p class="brewery-card-address">${this.data.address}</p>`;
    }
    ...
  }
````

--

## Les cartes

ID de la brasserie est celle de la carte.

```js
let html = `<div class="brewery-card" id="${this.id}">`;
````

--

## L'affichage

Event listerner : délégation au parent (grille)

```js [1|2]
$searchResult.on('click', '.brewery-card', function () {
  const cardId = $(this).attr('id');
  ...
}
```

--

## L'affichage

Localisation dans Open Street Map

```js [1|2|3|4-6|7-9|10]
const lastCardId = breweryDisplayedOnMap.id;
breweryDisplayedOnMap = getBreweryById(fetchedFiltered, cardId);
const currentCardId = breweryDisplayedOnMap.id;
if (lastCardId) {
  $(`#${lastCardId}`).removeClass('brewery-card-selected');
}
if (currentCardId) {
  $(`#${currentCardId}`).addClass('brewery-card-selected');
}
displayBreweryDetails(breweryDisplayedOnMap);
```

--

## L'affichage

Construction de la grille

```js [1|2|3-10|11|12-16|17]
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
```

====

# La recherche 

--

## Préparation des filtres

Requête metadata dès le chargement → états/types conservés côté client.

```js [1-8]
try {
  const fetchedMetadata = await getMetadata();
  statesList = getAmericanStates(fetchedMetadata) || [];
  typesList = getAmericanTypes(fetchedMetadata) || [];
} catch (error) {
  console.log('Failed retrieving metas: ', error);
  $breweryDiv.text('Erreur dans la récupération des metadonnées.');
}
```

--

## Injection des listes

Menus déroulants alimentés via metadata mise en cache + `getCountriesList()` prédéfini.

```js [1-6|7-12|13-18]
if ($statesSelect.length && statesList.length) {
  $.each(statesList, function (_, state) {
    $statesSelect.append(new Option(state, state));
  });
}
if ($typeSelect.length && typesList.length) {
  $.each(typesList, function (_, type) {
    $typeSelect.append(new Option(toTitleCase(type), type));
  });
  $('#type option[value="micro"]').attr('selected', 'selected');
}
const countriesList = getCountriesList();
if ($countriesList.length) {
  $.each(countriesList, function (_, country) {
    $countriesList.append(new Option(country, country));
  });
}
```

--

## Comportement États-Unis

Contrôle partagé `input/change` : si pays ≠ USA, on masque `states` et on remet la valeur à vide.

```js [1-11]
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
$countryInput.on('input change', toggleAmericanStateSelector);
```

--

## Déclenchement de la recherche

Click `#search-button` → grid clean, instanciation `searchQuery`, feedback UI (boucle détaillée slide suivante).

```js [1-15|16-28]
$searchButton.on('click', async function () {
  const rawCountry = ($countryInput.val() || '').trim();
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
      ...
    });
  } catch (error) {
    console.log('Failed retrieving API query: ', error);
    $searchResult.text('Erreur dans la récupération des données.');
  }
});
```

--

## Construction de l'URL

`searchApi()` n'ajoute que les filtres renseignés avant l'appel Open Brewery DB.

```js [1-7|8-10]
export async function searchApi(searchQuery, endpoint = 'breweries') {
  const params = [];
  if (searchQuery.town) params.push(`by_city=${encodeURIComponent(searchQuery.town)}`);
  if (searchQuery.state) params.push(`by_state=${encodeURIComponent(searchQuery.state)}`);
  const effectiveCountry = searchQuery.country ?? baseApi_country;
  if (effectiveCountry) params.push(`by_country=${encodeURIComponent(effectiveCountry)}`);
  if (searchQuery.type) params.push(`by_type=${encodeURIComponent(searchQuery.type)}`);
  const full_url = `${baseApi_url}${endpoint}${params.length ? `?${params.join('&')}` : ''}`;
  return sendRequest(full_url, 'SEARCH_API');
}
```

--

## Affichage & intégration

Résultats injectés via `BreweryCardBuilder` (Sylvain) et synchronisés avec la carte Leaflet (Max).

```js [1-7|8-18|19-24]
if (!fetchedFiltered.length) {
  $searchResult.text('Aucune brasserie trouvée.');
  return;
}
$.each(fetchedFiltered, function (index, brewery) {
  const breweryCard = new BreweryCardBuilder(brewery.name, brewery.id)
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
    displayBreweryDetails(breweryDisplayedOnMap); // -> setBreweryMarker()
  }
  $searchResult.append($card);
});
```

--

## Limites & suites

● Pas de rate limiting ni de cache côté client → risque quota/API down  
● Matching exact (ville/état/type) requis → pas de tolérance aux fautes ni regex OBDB  
● Recherche incrémentale évitée pour préserver les quotas → bouton unique aujourd'hui  
● Middleware de throttling/caching identifié comme évolution future

====

# La carte 

--

## Initialisation Leaflet

```js [1-4|5-12]
let mapInstance = null;

export function initializeMap(
  elementId,
  defaultLat = 40.7128,
  defaultLon = -74.006,
) {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  mapInstance = L.map(elementId).setView([defaultLat, defaultLon], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(mapInstance);
}
```

--

## Placement du marqueur

```js [1-4|5-14|15-21]
export function setBreweryMarker(brewery) {
  if (!mapInstance) {
    console.error("La carte n'a pas été initialisée");
    return;
  }

  const lat = parseFloat(brewery.latitude);
  const lon = parseFloat(brewery.longitude);
  if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) {
    console.error(
      `Coordonnées invalides pour ${brewery.name}. Marquer non affiché.`,
    );
    return;
  }

  L.marker([lat, lon])
    .addTo(mapInstance)
    .bindPopup(
      `<b>${brewery.name}</b><br>${brewery.street || 'Adresse non spécifiée'}`,
    )
    .openPopup();
  mapInstance.setView([lat, lon], 15);
}
```

--

## Liaison carte ↔ UI

```js [2-11|12-17]
$searchResult.on('click', '.brewery-card', function () {
  const cardId = $(this).attr('id');
  const lastCardId = breweryDisplayedOnMap.id;
  breweryDisplayedOnMap = getBreweryById(fetchedFiltered, cardId);
  const currentCardId = breweryDisplayedOnMap.id;
  if (lastCardId) {
    $(`#${lastCardId}`).removeClass('brewery-card-selected');
  }
  if (currentCardId) {
    $(`#${currentCardId}`).addClass('brewery-card-selected');
  }
  displayBreweryDetails(breweryDisplayedOnMap);
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
  $('#brewery-details-area').html(breweryCard.render());
  setBreweryMarker(brewery);
}
```
