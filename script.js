window.portfolioReady = true;

const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.main-nav');
const navLinks = [...nav.querySelectorAll('a')];
const backdrop = document.createElement('div');
backdrop.className = 'menu-backdrop';
backdrop.hidden = true;
document.body.append(backdrop);

const setMenu = (isOpen) => {
  nav.classList.toggle('is-open', isOpen);
  backdrop.hidden = !isOpen;
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.querySelector('.sr-only').textContent = isOpen ? 'Fechar menu' : 'Abrir menu';
};
const isMenuOpen = () => nav.classList.contains('is-open');

menuButton.addEventListener('click', () => setMenu(!isMenuOpen()));
navLinks.forEach((link) => link.addEventListener('click', () => setMenu(false)));
backdrop.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && isMenuOpen()) {
    setMenu(false);
    menuButton.focus();
  }
});
nav.addEventListener('focusout', (event) => {
  if (isMenuOpen() && !nav.contains(event.relatedTarget) && event.relatedTarget !== menuButton) setMenu(false);
});
window.matchMedia('(min-width: 961px)').addEventListener('change', (event) => { if (event.matches) setMenu(false); });

const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Highlight the menu entry of the section in view
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((section) => sectionObserver.observe(section));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = new Date().getFullYear();
