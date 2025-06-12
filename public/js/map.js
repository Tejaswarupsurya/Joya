mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/standard",
  projection: "globe",
  zoom: 12,
  center: listing.geometry.coordinates,
});

// Create animated marker element
const markerEl = document.createElement("div");
markerEl.className = "marker-wrap";
markerEl.innerHTML = `
  <div class="pulse-ring"></div>
    <div class="custom-marker">
    <i class="bi bi-house-door-fill"></i>
  </div>
`;

new mapboxgl.Marker(markerEl)
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`
    )
  )
  .addTo(map);
