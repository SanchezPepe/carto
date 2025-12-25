// Function to set the theme based on the 'dark' class on the html element
function setTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// Function to initialize the theme
export function initTheme() {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    setTheme(storedTheme === 'dark');
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setTheme(true);
  } else {
    setTheme(false);
  }
}

// Function to toggle the theme
export function toggleTheme() {
  const isDark = document.documentElement.classList.contains('dark');
  setTheme(!isDark);
  localStorage.setItem('theme', !isDark ? 'dark' : 'light');
}
