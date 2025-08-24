  const input = document.getElementById("location");
  const suggestions = document.getElementById("suggestions");
  
  // Debounce function
  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }
  
  async function fetchSuggestions() {
    const query = input.value;
    if (query.length < 3) {
      suggestions.innerHTML = "";
      return;
    }
  
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
    const res = await fetch(url);
    const results = await res.json();
  
    suggestions.innerHTML = "";
    results.forEach((place) => {
      const li = document.createElement("li");
      li.classList.add("location-suggestion");
      li.textContent = place.display_name;
      li.classList.add("list-group-item");
      li.addEventListener("click", () => {
        input.value = place.display_name;
        suggestions.innerHTML = "";
      });
      suggestions.appendChild(li);
    });
  }
  
  // Wrap fetchSuggestions with debounce
  const debouncedFetch = debounce(fetchSuggestions, 200);
  
  input.addEventListener("input", debouncedFetch);
  
  // Close suggestions on outside click
  document.addEventListener("click", (e) => {
    if (!suggestions.contains(e.target) && e.target !== input) {
      suggestions.innerHTML = "";
    }
  });
 
  