# UE-L220 MINI-PROJET : Rapport final

## Introduction - Objectifs

Il s'agit de développer une application web au format SPA (Single Page Appolication), démontrant
notre capacité à utiliser une API.

L'API utilisée dans le cadre de ce mini-projet est développée par
[Open Brewery DB](https://www.openbrewerydb.org/) un projet open source de recensement des
brasseries à travers le monde, alimenté pas la communauté.

Les objectifs techniques sont :

- utilisation d'AJAX (via `fetch`) ;
- gestion asynchrone (via des promesses et `async/awit`) ;
- manipulation du DOM (à l'aide de [jQuery](https://jquery.com/)).

Nous avons souhaité utiliser les données de géolocalisation des brasserie pour les visualiser dans
une carte. Cela a nécessité l'utilisation d'une autre API : [Leaflet](https://leafletjs.com/)
permettant la visualisation de lieux sur un fond de carte Open Street Map, sur la base de
coordonnées GPS.

## Architecture finale

Nous avons procédé par une approche modulaires : la définition des différentes tâches de
l'application, la division de ces tâches en autant de partie sur lesquelles nous nous sommes mis à
travailler. Nous avons conçus :

- Des **services** permettant d'interroger la base de données (localisés dans `services`) :
  - `maps.js` regroupant les services liés à Leaflet et à l'affichage de lieux sur une carte ;
  - `openBReweryService.js` regroupant les fonctionnalités d'interrogation de la base de données
    d'Open Brewery DB.
- Des **fonctions utilitaires** pour des tâches répétées (localisés dans `utils`) :
  - `searchUtils.js` regroupant les fonctions de recherches dans liés au résultats des requêtes ;
  - `openBreweryUtils.js` regroupant des fonctions de pré ou post traitement des données
    recueillies.
- Des **constructeurs** (localisés dans `builders`) permettant d'assurer simplement la mise en place
  de l'affichage :
  - `BreweryCardBuilder.js` pour construire une tuile regroupant les données d'une brasserie.
- Un regroupement des fonctionnalités principales dans un fichier `main.js`.

## Implémentation des fonctionnalités

### Logique de filtrage

#### Gestion du formulaire

#### Récupération des valeurs

#### Construction de la requête

### Affichage Enrichi et Interface (CSS)

#### Le constructeur

L'affichage s'organise autour d'un système de grille où des tuiles vont contenir les données
relatives à une brasserie.

Pour se faire, nous avons imaginé une classe spécifique, `BreweryCardBuilder`. On y dispose d'un
constructeur :

```javascript
constructor(name, id) {
  this.name = name;
  this.id = id;
  this.data = {};
}
```

qui prendra en paramètre le nom et l'ID d'une brasserie, deux données dont on est à peu près
certains qu'elles existent pour chaque brasserie. Un objet vide `data` est créé afin d'accueillir
les futures données.

Ensuite, nous avons développer des méthodes pour ajouter des données spécifiques : les données
relatives à la localisation, le numéro de téléphone, l'URL du site web, etc.

Par exemple pour ajouter la données sur le pays dans lequel est localisée la brasserie, nous
utilisons une méthode `addCountry()` :

```javascript
addCountry(country) {
  this.data.country = country;
  return this;
}
```

On remarquera que les méthodes retournent toutes `this` afin de pouvoir les chaîner.

Enfin, une méthode `render()` permettra de construire un élément HTML comportant toutes la structure
et les données.

```javascript
render() {
    let html = `<div class="brewery-card" id="${this.id}">`;
    html += `<h3 class="brewery-card-name">${this.name}</h3>`;
    // ajout des données dans la carte si présentes
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
      if (this.data.city || this.data.state) {
        html += '<div class="brewery-card-lococation">';
        if (this.data.city) {
          html += `<p class="brewery-card-city">${this.data.city}${this.data.state ? ',' : ''}</p>`;
        }
        if (this.data.state) {
          html += `<p class="brewery-card-state">${this.data.state}</p>`;
        }
        html += '</div>';
      }
      if (this.data.country) {
        html += `<p class="brewery-card-country">${this.data.country}</p>`;
      }
      html += '</div>';
      // fin adresse complète
    }
    if (this.data.phone || this.data.website || this.data.type) {
      html += '<div class="brewery-card-contact">';

      // ajout des données téléphonique
      if (this.data.phone) {
        html += '<div class="brewery-card-phone-container">';
        html += `<p class="brewery-card-phone"><i class="nf nf-md-phone_classic"></i><a class="brewery-card-phone-link" href='tel:${this.data.phone}' >${this.data.phone}</a></p>`;
        html += '</div>';
        // fin phone
      }

      // ajout du site
      if (this.data.website) {
        html += '<div class="brewery-card-website-container">';
        html += `<p class="brewery-card-website"><i class="nf nf-md-web"></i><a class="brewery-card-link" href='${this.data.website}'  target='_blank'>Site</a></p>`;
        html += '</div>';
        // fin site
      }

      // ajout du type
      if (this.data.type) {
        html += '<div class="brewery-card-type-container">';
        html += `<p class="brewery-card-type"><i class="nf nf-md-factory"></i>${this.data.type}</p>`;
        html += '</div>';
        // fin type
      }
      html += '</div>';
    }
    html += '</div>';
    html += '</div>';
    return html;
  }
```

La succession de tests permet de s'assurer que la données existe et en conséquence de ne pas créer
un élément HTML qui serait vide.

On pourra ainsi utiliser ce constructeur :

```javascript
const breweryCard = new BreweryCardBuilder(brewery.name, 'random-brewery-id');
breweryCard
  .addAddress(brewery.street)
  .addCity(brewery.city)
  .addState(brewery.state_province)
  .addCountry(brewery.country)
  .addPhone(brewery.phone)
  .addWebsite(brewery.website_url)
  .addType(brewery.brewery_type);
```

et utiliser l'objet `breweryCard` pour définir le contenu d'une tuile avec par exemple

```javascript
$breweryDiv.html(breweryCard.render());
```

où `$breweryDiv` serait l'élément tuile où insérer les données.

#### La grille

La grille en elle-même est constituée sur la base des résultats d'une recherche. Touts les objets
issues de la requête vers Open Brewery DB sont dans un tableau sur lequel nous venons boucler grâce
à la fonction jQuery `each` :

```javascript
$.each(fetchedFiltered, function (index, brewery) { ... });
```

Dans cette boucle nous allons créer autant de cartes que d'entrées dans la liste des résultats grâce
à la fonction de retour.

Remarquons que nous identifions chaque tuile à l'aide de l'ID de chaque brasserie dans la base
d'Open Brewery DB : en effet, cette ID est assurée d'être unique et donc de nous permettre d'avoir
des tuiles avec des ID uniques dans notre DOM.

```javascript
const breweryCard = new BreweryCardBuilder(brewery.name, brewery.id);
```

Les objets ainsi créés sont rendues et ajouté au DOM à l'aide de la fonction `append()` de jQuery :

```javascript
const $card = $(breweryCard.render());
...
$searchResult.append($card);
```

#### Mécanisme de sélection

Lorsqu'une tuile est cliquée dans la grille, on récupère ses données dans la liste et ensuite nous
affichons cette brasserie sur une carte. Afin de ne pas attacher un écouteur à chaque tuile (ce qui
multiplierait inutilement les écouteurs et surchargerait la page), nous utilisons le principe de
**délégation** : l'écouteur est fixé sur la grille (ici `$searchResult`) mais liés aux enfants (les
tuiles) identifiés par une certaines classe `brewery-card` :

```javascript
$searchResult.on('click', '.brewery-card', function () { ... });
```

Nous identifions la tuile cliquée grâce à son ID que nous récupérons : ainsi nous pouvons facilement
identifier la brasserie correspondante dans la liste des résultats et mettre à jour sur la carte la
brasserie indiquée par l'utilisateur.

```javascript
const cardId = $(this).attr('id');
...
breweryDisplayedOnMap = getBreweryById(fetchedFiltered, cardId);
```

### Géolocalisation

## Bilan du projet

### Difficultés rencontrées

- La prise en compte des pays s'est avérée plus compliqué que prévue.
- La gestion de la notion d'état n'existant que pour les États-Unis d'Amérique, il a fallu adapter le formulaire de recherche.
- Utilisation de git a connu son lot de `merge conflicts` qui a parfois ralenti notre progression

### Points forts et apprentissages

- Utilisation de la méthode agile : nous avons bien utilisé le principe en ayant très tôt un cœur de page fonctionnel et en implémentant petit à petit d'autres fonctionnalités. Nous avons pu apprécier la puissance de ce principe.
- La division des tâches de l'application en différents modules par spécificité nous a permis d'avoir un code plus lisible et plus facilement maintenable.
- L'utilisation de jQuery a aussi ajouté en lisibilité du code et facilité la gestion de délégation des écouteurs.

## Annexe : contributions individuelle

| Membre                   | Tâches principales réalisées                                           |
| :----------------------- | :--------------------------------------------------------------------- |
| **Serghei Anistratenco** | - Implémentation des services des requêtes vers l'API Open Brewery DB  |
|                          | - Définition et implémentation de la logique de recherche              |
|                          | - Implémentation du gestionnaire d'événement (`submit`) du formulaire. |
| **Maxime Ferrand**       | - Définition et implémentation des requêtes vers l'API Leaflet.        |
|                          | - Implémentation de la géolocalisation dans la page.                   |
| **Sylvain Chambon**      | - Conception de la structure HTML de la page et de la logique CSS      |
|                          | - Finalisation CSS des tuiles dans la grille de résultats.             |
|                          | - Intégration du clic pour affichage détaillé.                         |
| **Tous**                 | - Relecture du code, tests, et rédaction du rapport final.             |
