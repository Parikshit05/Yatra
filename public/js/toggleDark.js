const toggle = document.getElementById('darkModeToggle');
const footer = document.getElementById('mainFooter');

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
  } else {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
  }
});

