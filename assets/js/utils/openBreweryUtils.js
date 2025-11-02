export function getRandomBreweryFromList(allBreweries) {
  console.log('Getting random brewery.');

  if (!allBreweries || allBreweries.length === 0) {
    console.log('No brewery found.');
    return null;
  }

  console.log(allBreweries);

  const breweriesCount = allBreweries.length;
  console.log(`Found ${breweriesCount} breweries.`);
  const randomIndex = Math.floor(Math.random() * breweriesCount);
  return allBreweries[randomIndex];
}

export function getAmericanStates(metadata_obj) {
  if (!metadata_obj || metadata_obj.length === 0) {
    console.log('No metadata found.');
    return null;
  }
  // root object destructuring
  let { total, by_state, by_type } = metadata_obj;
  let state_list = [];
  let i = 0;
  Object.entries(by_state).forEach(([state, count]) => {
    state_list[i] = state;
    i++;
  });
  return state_list;
}

export function getAmericanTypes(metadata_obj) { 
  if (!metadata_obj || metadata_obj.length === 0) {
    console.log('No metadata found.');
    return null;
  }
    // root object destructuring 
  let {total, by_state, by_type} = metadata_obj;  
  let type_list = [];
  let i = 0;
  Object.entries(by_type).forEach(([state, count]) => {
    type_list[i] = state;
    i++
  });
  return type_list;
}

export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g, //  the /xxx/g is plain syntax base logic for RegExp, \w matches all word characters, \S is all char that is non-whitespace
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

/** AS: using static pasted lists instead of parsing from separate file. not modular but in this kind of environment it is approacheable **/

var country_list = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
		,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands"
		,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
		,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
		,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
		,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
		,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
		,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
		,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
		,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
		,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
		,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
		,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia"
		,"Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","UNited States","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)"
		,"Yemen","Zambia","Zimbabwe"];

export function getCountriesList() {
  var postProcessedList = [];
  for (let i = 0; i < country_list.length; i++) {
    postProcessedList[i] = country_list[i].replace('&amp;','');
  }
  return postProcessedList;
}

export function sanitizeUndefined(string) { 
  if (string === undefined) {
    return '';
  }
  else return string;
}

/* Search Brewery function */