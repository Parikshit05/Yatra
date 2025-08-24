const toggle = document.getElementById('darkModeToggle');
const footer = document.getElementById('mainFooter');
const toggleBtn = document.getElementById("darkModeToggleBtn");
  const toggleIcon = document.getElementById("darkModeIcon");

function applyTheme(theme) {
  document.body.classList.toggle('dark-mode', theme === 'dark');

  if (footer) {
    footer.classList.toggle('bg-dark', theme === 'dark');
    footer.classList.toggle('text-light', theme === 'dark');
    footer.classList.toggle('bg-light', theme !== 'dark');
    footer.classList.toggle('text-dark', theme !== 'dark');
  }

  localStorage.setItem('theme', theme);
}


// Load dark mode preference from localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  toggle.checked = true;
}

toggle.addEventListener('change', () => {
  if (toggle.checked) {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
    toggleIcon.classList.remove("fa-moon");
    toggleIcon.classList.add("fa-sun");
    toggleIcon.style.color = "#facc15";
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
    toggleIcon.classList.remove("fa-sun");
    toggleIcon.classList.add("fa-moon");
    toggleIcon.style.color = "#121212";
  }
});

