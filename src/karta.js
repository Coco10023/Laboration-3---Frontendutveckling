/**
 * Hämtar koordinater via Nominatim.
 * @param {string} query
 * @returns {Promise<{lat:number, lon:number, name:string} | null>}
 */

async function geocode(query) {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&q=" +
    encodeURIComponent(query);

  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error("Kunde inte söka plats.");

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  return {
    lat: Number(data[0].lat),
    lon: Number(data[0].lon),
    name: data[0].display_name,
  };
}