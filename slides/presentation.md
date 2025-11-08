UE-L220 — Mini-projet

# Brasseries du monde

<div style="font-size: 0.5em;">
Maxime Ferrand

Serghei Anistratenco

Sylvain Chambon

</div>

====

## Choix techniques

- [Open Brewery DB](https://www.openbrewerydb.org/)
- [Leaflet](https://leafletjs.com/)
- [jQuery](https://jquery.com/)

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

# Futur

- Pagination sur les réponses
- Géolocalisation
- Responsive
