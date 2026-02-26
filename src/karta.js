import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fixar så att Leeflet-markören funkar i Vite-build
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});


/**
 * Hämtar koordinater för en plats via Open-Meteo Geocoding API.
 * @async
 * @param {string} query - Platsnamn som användaren söker efter tex "Stockholm"
 * @returns {Promise<{lat:number, lon:number, name:string} | null>}
 * Returnerar ett objekt med lat/Ion och en label, eller null om ingen träff hittades.
 * @throws {Error} Om API-anropet misslyckats (tex nätverksfel eller 4xx/5xx). 
 */

async function geocode(query) {
  const url = "https://geocoding-api.open-meteo.com/v1/search?" + new URLSearchParams({
      name: query,
      count: "1",
      language: "sv",
      format: "json",
    });

  const res = await fetch(url, { headers: { Accept: "application/json" } });

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

/**
 * Initierar Leaflet-kartan, lägger till  tile-layer och en startmarkör. 
 * @returns {{map: import("leaflet").Map, marker: import("leaflet").Marker}}
 * Ett objekt med kartinstansen och markören så de kan uppdateras vid sökning. 
 * @throws {Error} Om #map-elementet saknas i HTML.
 */

function initMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl) throw new Error("#map saknas i HTML");

  // default view
  const start = [62.3908, 17.3069];
  const map = L.map(mapEl, { zoomControl: true}).setView(start,12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const marker = L.marker(start).addTo(map);

  // Säkerställer att kartan renderas korrekt när layouten är klar.
  setTimeout(() => 
map.invalidateSize(), 250);
  
  return { map, marker };
}

/**
 * Startar kart-sidan: sätter upp karta och kopplar formuläre till sökfunktionen. 
 * @async
 * @returns {Promise<void}
 */

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
      map.setView([place.lat, place.lon], 13, { animate: true });

      setTimeout(() => map.invalidateSize(),200);
      status.textContent = `Visar: ${place.name}`;
    } catch (err) {
      console.error(err);
      status.textContent = "Något gick fel. Kolla Console.";
    }
  });
}

// Kör när sidan är laddad
window.addEventListener("load", () => 
{
  main();
});

