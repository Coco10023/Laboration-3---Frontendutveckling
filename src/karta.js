/**
 * Hämtar koordinater via Nominatim.
 * @param {string} query
 * @returns {Promise<{lat:number, lon:number, name:string} | null>}
 */

async function geocode(query) {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&q=" +
    encodeURIComponent(query);
}