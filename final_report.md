# UE-L220 MINI-PROJET : Rapport final



## Introduction - Objectifs

Il s'agit de développer une application web au format SPA (Single Page Appolication), démontrant notre capacité à utiliser une API.

L'API utilisée dans le cadre de ce mini-projet est développée par [Open Brewery DB](https://www.openbrewerydb.org/) un projet open source de recensement des brasseries à travers le monde, alimenté pas la communauté.

Les objectifs techniques sont :

- utilisation d'AJAX (via `fetch`) ;
- gestion asynchrone (via des promesses et `async/awit`) ;
- manipulation du DOM (à l'aide de [jQuery](https://jquery.com/)).

Nous avons souhaité utiliser les données de géolocalisation des brasserie pour les visualiser dans une carte. Cela a nécessité l'utilisation d'une autre API : [Leaflet](https://leafletjs.com/) permettant la visualisation de lieux sur un fond de carte Open Street Map, sur la base de coordonnées GPS.

## Architecture finale

Nous avons procédé par une approche modulaires : la définition des différentes tâches de l'application, la division de ces tâches en autant de partie sur lesquelles nous nous sommes
mis à travailler. Nous avons conçus :

- Des **services** permettant d'interroger la base de données :
  - `maps.js` regroupant les services liés à Leaflet et à l'affichage de lieux sur une carte ;
  - `openBReweryService.js` regroupant les fonctionnalités d'interrogation de la base de données d'Open Brewery DB.
- Des **fonctions utilitaires** pour des tâches répétées :
  - `searchUtils.js` regroupant les fonctions de recherches dans liés au résultats des requêtes ;
  - `openBreweryUtils.js` regroupant des fonctions de pré ou post traitement des données recueillies.
- Un regroupement des fonctionnalités principales dans un fichier `main.js`.

## Implémentation des fonctionnalités

### Logique de filtrage

#### Gestion du formulaire

#### Récupération des valeurs

#### Construction de la requête

### Affichage Enrichi et Interface (CSS)

### Géolocalisation



## Bilan du projet

### Difficultés rencontrées

### Points forts et apprentissages



## Annexe : contributions individuelle
