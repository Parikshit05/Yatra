// var map = L.map('map').setView([51.505, -0.09], 13);
// console.log("Inside map.js");


// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 19,
//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map);


document.addEventListener("DOMContentLoaded", () => {
  // Get the map container
  const mapContainer = document.getElementById("map");
  
  if (mapContainer) {
    // Check if we have valid coordinates
    const lat = parseFloat(document.querySelector('script').textContent.match(/lat = "([^"]*)"/)?.[1] || '');
    const lon = parseFloat(document.querySelector('script').textContent.match(/lon = "([^"]*)"/)?.[1] || '');
    
    // Check if coordinates are valid numbers and not null/empty
    if (lat && lon && !isNaN(lat) && !isNaN(lon) && lat !== 0 && lon !== 0) {
      try {
        // Try to initialize the map
        const map = L.map("map").setView([lat, lon], 14);
        
        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        
        // Add a marker
        L.marker([lat, lon])
          .addTo(map)
          .bindPopup("📍 Location of this listing")
          .openPopup();
          
      } catch (error) {
        // If map initialization fails, show simple message
        showSimpleMessage(mapContainer);
      }
    } else {
      // If no valid coordinates, show simple message
      showSimpleMessage(mapContainer);
    }
  }
});

function showSimpleMessage(mapContainer) {
  // Get location information if available
  const locationElement = document.querySelector('.listing-location');
  const locationText = locationElement ? locationElement.textContent : 'Location information';
  
  // Show a simple message instead of the complex fallback
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
  