import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  if (!res.ok) throw new Error(`Kunde inte söka plats: ${res.status}`);

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  return {
    lat: Number(data[0].lat),
    lon: Number(data[0].lon),
    name: data[0].display_name,
  };
}

function initMap() {
  const map = L.map("map").setView([62.3908, 17.3069], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const marker = L.marker([62.3908, 17.3069]).addTo(map);
  return { map, marker };
}

async function main() {
  const form = document.querySelector("#placeForm");
  const input = document.querySelector("#placeInput");
  const status = document.querySelector("#mapStatus");

  if (!form || !input || !status) return;

  const { map, marker } = initMap();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;

    status.textContent = "Söker...";

    try {
      const place = await geocode(q);
      if (!place) {
        status.textContent = "Ingen plats hittades.";
        return;
      }

      marker.setLatLng([place.lat, place.lon]);
      map.setView([place.lat, place.lon], 13);
      status.textContent = `Visar: ${place.name}`;
    } catch (err) {
      console.error(err);
      status.textContent = "Något gick fel. Kolla Console.";
    }
  });
}

main();