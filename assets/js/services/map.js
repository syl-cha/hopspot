// script d'affichage de brasserie sur carte à l'aide de service leaflet

// variable pour stockage d'instance de carte
let mapInstance = null;

// initialisation de carte dans HTML

export function initializeMap(
  elementId,
  defaultLat = 40.7128,
  defaultLon = -74.006,
) {
  if (mapInstance) {
    // reinitialisation de carte s'elle existe deja
    mapInstance.remove();
    mapInstance = null;
  }

  // creation de carte LeafLet, vue par default est sur New York
  mapInstance = L.map(elementId).setView([defaultLat, defaultLon], 5); //zoom 5 ?

  // ajout le fond de la carte
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(mapInstance);
}

// affichage d'un marqeur sur la carte pour la brasserie selectionnée
export function setBreweryMarker(brewery) {
  if (!mapInstance) {
    console.error("La carte n'a pas été initialisée");
    return;
  }

  // retour des coordonnées par l'API
  const lat = parseFloat(brewery.latitude);
  const lon = parseFloat(brewery.longitude);
  if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) {
    console.error(
      `Coordonnées invalides pour ${brewery.name}. Marquer non affiché.`,
    );
    return;
  }
  // creer et ajouter le marqueur
  L.marker([lat, lon])
    .addTo(mapInstance)
    .bindPopup(
      `<b>${brewery.name}</b><br>${brewery.street || 'Adresse non spécifiée'}`,
    )
    .openPopup();
  mapInstance.setView([lat, lon], 15);
}
