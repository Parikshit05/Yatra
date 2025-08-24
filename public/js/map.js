document.addEventListener("DOMContentLoaded", () => {
  const mapContainer = document.getElementById("map");

  if (mapContainer && lat != null && lon != null && !isNaN(lat) && !isNaN(lon)) {
    try {
      const map = L.map("map").setView([lat, lon], 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      L.marker([lat, lon])
        .addTo(map)
        .bindPopup("📍 Location of this listing")
        .openPopup();

    } catch (error) {
      showSimpleMessage(mapContainer);
    }
  } else {
    showSimpleMessage(mapContainer);
  }
});

function showSimpleMessage(mapContainer) {
  const locationElement = document.querySelector('.listing-location');
  const locationText = locationElement ? locationElement.textContent : 'Location information';

  mapContainer.innerHTML = `
    <div class="map-simple-message">
      <div class="simple-message-content">
        <div class="simple-message-icon">
          <i class="fa-solid fa-map-location-dot"></i>
        </div>
        <h4 class="simple-message-title">Location Service Temporarily Down</h4>
        <p class="simple-message-text">
          Our location service is currently unavailable. Developers are working on it.
        </p>
        <div class="simple-address">
          <i class="fa-solid fa-location-dot"></i>
          <span><strong>Address:</strong> ${locationText}</span>
        </div>
      </div>
    </div>
  `;
}


window.addEventListener("resize", () => {
  map.invalidateSize();
});
