/**
 * Look for the brewery in a list of breweries based on its ID.
 * Returns the object if found and null if not
 * @param {brewery[]} breweries Array of brewery object (in OpenBreweryDB meaning)
 * @param {string} id ID to be found
 * @returns {brewery} The brewery in the list matching the ID passed
 */
export function getBreweryById (breweries, id) {
  const i = 0;
  for (let i = 0; i < breweries.length; i++) {
    if (breweries[i].id === id) {
      return breweries[i]
    }
  }
  // no match
  return null
}