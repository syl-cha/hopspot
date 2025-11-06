export class BreweryCardBuilder {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.data = {};
  }

  addAddress(address) {
    this.data.address = address;
    return this;
  }

  addCity(city) {
    this.data.city = city;
    return this;
  }

  addState(state) {
    this.data.state = state;
    return this;
  }

  addCountry(country) {
    this.data.country = country;
    return this;
  }

  addPhone(phone) {
    this.data.phone = phone;
    return this;
  }

  addWebsite(website) {
    this.data.website = website;
    return this;
  }

  addType(type) {
    this.data.type = type;
    return this;
  }

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
}
