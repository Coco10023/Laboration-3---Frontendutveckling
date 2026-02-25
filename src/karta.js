import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Hämtar koordinater via Open-Meteo Geocoding API.
 * @param {string} query
 * @returns {Promise<{lat:number, lon:number, name:string} | null>}
 */
async function geocode(query) {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search?" +
    new URLSearchParams({
      name: query,
      count: "1",
      language: "sv",
      format: "json",
    });

  const res = await fetch(url, { headers: { Accept: "application/json" } });

  // OBS: backticks här (`)
  if (!res.ok) throw new Error(`Kunde inte söka plats: ${res.status}`);

  const data = await res.json();
  const first = data?.results?.[0];
  if (!first) return null;

  const label = [first.name, first.admin1, first.country]
    .filter(Boolean)
    .join(", ");

  return {
    lat: Number(first.latitude),
    lon: Number(first.longitude),
    name: label || query,
  };
}

function initMap() {
  const map = L.map("map").setView([62.3908, 17.3069], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const marker = L.marker([62.3908, 17.3069]).addTo(map);

  setTimeout(() => {
    map.invalidateSize();
  }, 100);

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
      setTimeout(() => map.invalidateSize(),100);
      status.textContent = `Visar: ${place.name}`;
    } catch (err) {
      console.error(err);
      status.textContent = "Något gick fel. Kolla Console.";
    }
  });
}

main();